// ==UserScript==
// @name        vocabulary.com bot 2
// @namespace   Violentmonkey Scripts
// @match        https://www.vocabulary.com/lists/*/practice*
// @grant       none
// @version     1.0
// @author      -
// @description 2/21/2025, 7:27:07 PM
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/528571/vocabularycom%20bot%202.user.js
// @updateURL https://update.greasyfork.org/scripts/528571/vocabularycom%20bot%202.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const failedAttempts = new Map(); // Map to store failed attempts for each question
  const maxAttempts = 3; // Maximum attempts before giving up on smart matching
   function parseList() {
    const pathParts = window.location.pathname.split('/');
    const listID = pathParts[2] || 'unknown';

    // select all li.entry.learnable elements
    const entries = document.querySelectorAll('li.entry.learnable');

    // load existing data or init empty
    let stored = JSON.parse(localStorage.getItem('words&defs') || '[]');

    // extract relevant info from each entry
    entries.forEach(li => {
      const word = li.querySelector('.word')?.textContent.trim() || '';
      const definition = li.querySelector('.definition')?.textContent.trim() || '';
      const example = li.querySelector('.example')?.textContent.trim() || '';
      const freq = li.getAttribute('freq') || ''; // numeric freq attribute

      stored.push({
        list: listID,
        word,
        definition,
        example,
        freq
      });
    });

    // store updated data
    localStorage.setItem('words&defs', JSON.stringify(stored));
    console.log(`saved ${entries.length} words from list ${listID} to localstorage`);
  }

  // Check if we're on a practice page or a list page
  const pathParts = window.location.pathname.split('/');
  const isPractice = pathParts.includes('practice');
  const isListPage = pathParts.includes('lists') && !isPractice;

  // If we're on a list page, parse it automatically
  if (isListPage) {
    window.addEventListener('load', parseList);
  }

  // If not on practice page, exit early
  if (!isPractice) return;

  // ----- PRACTICE HELPER FUNCTIONS FROM SECOND SCRIPT -----

  // Check if definitions exist in localStorage, if not, try to parse the list first
  const ensureDefinitions = async () => {
    const definitions = JSON.parse(localStorage.getItem('words&defs') || '[]');
    if (definitions.length === 0) {
      console.log('No definitions found in localStorage, attempting to fetch list data...');

      // Get the list ID from the URL
      const listID = pathParts[2] || 'unknown';

      try {
        // Fetch the list page to parse it
        const response = await fetch(`https://www.vocabulary.com/lists/${listID}`);
        if (!response.ok) throw new Error('Failed to fetch vocabulary list');

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Create a temporary div to hold the parsed content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Select all li.entry.learnable elements from the fetched page
        const entries = tempDiv.querySelectorAll('li.entry.learnable');

        if (entries.length > 0) {
          let stored = [];

          // Extract relevant info from each entry
          entries.forEach(li => {
            const word = li.querySelector('.word')?.textContent.trim() || '';
            const definition = li.querySelector('.definition')?.textContent.trim() || '';
            const example = li.querySelector('.example')?.textContent.trim() || '';
            const freq = li.getAttribute('freq') || '';

            stored.push({
              list: listID,
              word,
              definition,
              example,
              freq
            });
          });

          // Store updated data
          localStorage.setItem('words&defs', JSON.stringify(stored));
          console.log(`saved ${entries.length} words from list ${listID} to localstorage`);
        } else {
          console.log('No entries found on list page');
        }
      } catch (err) {
        console.error('Error fetching and parsing list:', err);
      }
    }
  };

  // Call this function immediately when the script runs on a practice page
  ensureDefinitions();

  // -- state for pausing
  let paused = false;

  // -- create a small overlay to toggle pause and display extra info
  function createpauseoverlay() {
  const div = document.createElement('div');
  div.id = 'pause-overlay';
  div.style.position = 'fixed';
  div.style.top = '10px';
  div.style.left = '10px';
  div.style.zIndex = '9999';
  div.style.background = '#333';
  div.style.color = '#fff';
  div.style.padding = '8px';
  div.style.cursor = 'pointer';
  div.style.borderRadius = '4px';

  // pause button
  const pauseText = document.createElement('div');
  pauseText.innerText = 'pause script';
  pauseText.style.marginBottom = '5px';
  pauseText.style.cursor = 'pointer';
  pauseText.addEventListener('click', () => {
    paused = !paused;
    pauseText.innerText = paused ? 'resume script' : 'pause script';
    console.log(paused ? 'script paused' : 'script resumed');
  });

  // dynamic display area (shared for all q types)
  const infoDisplay = document.createElement('div');
  infoDisplay.id = 'info-display';
  infoDisplay.style.fontSize = '12px';
  infoDisplay.style.color = '#ddd';
  infoDisplay.innerHTML = `
    <div id="qtype-display">Q Type: N/A</div>
    <div id="extra-info">Info: N/A</div>
  `;

  div.appendChild(pauseText);
  div.appendChild(infoDisplay);
  document.body.appendChild(div);

}

  function updateOverlay(qtype, info) {
  const qtypeDisplay = document.getElementById('qtype-display');
  const extraInfo = document.getElementById('extra-info');

  if (qtypeDisplay) qtypeDisplay.innerText = `Q Type: ${qtype}`;
  if (extraInfo) extraInfo.innerText = `Info: ${info || 'N/A'}`;
}



  // -- "synonym" fetcher using vocabulary.com dictionary page
  async function fetchsynonyms(word) {
    const url = `https://www.vocabulary.com/dictionary/${encodeURIComponent(word)}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Failed to fetch vocabulary.com page');
      const text = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      let synonyms = [];

      const instances = doc.querySelectorAll("div.div-replace-dl.instances");
      instances.forEach(instance => {
        const detailSpan = instance.querySelector("span.detail");
        if (detailSpan && detailSpan.textContent.trim().toLowerCase().includes("synonyms")) {
          instance.querySelectorAll("a.word").forEach(a => {
            synonyms.push(a.textContent.trim().toLowerCase());
          });
        }
      });

      return synonyms;
    } catch (err) {
      console.error("Error fetching synonyms from vocabulary.com:", err);
      return [];
    }
  }

  // -- helper to see if a choice is correct
  function iscorrect(choice) {
    return choice.className.includes('correct');
  }

  // -- helper: attempt synonyms only if qtype == 'S'
async function handleTypeS(curq, qlist, choices) {
  const synonyms = await fetchsynonyms(curq.q.toLowerCase());
  updateOverlay('S', synonyms.length ? `Synonyms: ${synonyms.join(', ')}` : 'No synonyms found.');

  if (!synonyms.length) {
    console.log('no synonyms found. falling back.');
    return false;
  }

  for (let i = 0; i < choices.length; i++) {
    const text = choices[i].innerText.trim().toLowerCase();
    if (synonyms.includes(text)) {
      console.log(`clicking synonym match: ${text}`);
      choices[i].click();
      if (iscorrect(choices[i])) {
        qlist[curq.q] = text;
        localStorage.practiceLists = JSON.stringify(plists);
        console.log(`recorded: "${curq.q}" -> "${text}"`);
        clicknext();
      }
      return true;
    }
  }

  return false;
}


  // -- Modular handler for question type 'D' (definition-based questions)
async function handleTypeD(curQ, qList, choices, pLists) {
    const allDefs = JSON.parse(localStorage.getItem('words&defs') || '[]');
    const entry = allDefs.find(e => e.word?.toLowerCase() === curQ.q.toLowerCase());

    if (!entry || !entry.definition) {
      console.log(`no local definition found for "${curQ.q}"`);
      updateOverlay('D', 'No definition found.');
      return false;
    }

    updateOverlay('D', `Definition: ${entry.definition}`);

    // Get the question key for tracking attempts
    const questionKey = curQ.q;

    // Initialize tracking for this question if needed
    if (!failedAttempts.has(questionKey)) {
      failedAttempts.set(questionKey, []);
    }

    // Get the failed attempts for this question
    const failedForQuestion = failedAttempts.get(questionKey);

    // Check if we've exceeded max attempts and should fall back to random
    if (failedForQuestion.length >= maxAttempts) {
      console.log(`Exceeded max attempts (${maxAttempts}) for "${questionKey}" - falling back to random`);
      updateOverlay('D', `Exceeded max attempts - using random selection`);
      return false; // Let the random selection handle it
    }

    // IMPROVED TOKEN MATCHING ALGORITHM
    const defTokens = entry.definition.toLowerCase().split(/\W+/).filter(t => t.length > 2);
    const uniqueTokens = new Set(defTokens);

    // Score choices, avoiding previously failed attempts
    let bestIndex = -1;
    let bestScore = 0; // Starting with 0 instead of -1 to require a minimum match quality

    for (let i = 0; i < choices.length; i++) {
      // Skip this choice if we've already tried it and failed
      if (failedForQuestion.includes(i)) {
        continue;
      }

      const choiceText = choices[i].innerText.trim();
      const choiceTokens = choiceText.toLowerCase().split(/\W+/).filter(t => t.length > 2);

      // Calculate a more nuanced score:
      // 1. Each matching token gives points
      // 2. Higher points for less common words
      // 3. Consecutive matches are worth more
      let score = 0;
      let consecutiveMatches = 0;

      for (const token of choiceTokens) {
        if (uniqueTokens.has(token)) {
          // Base score for a match
          score += 1;

          // Bonus for consecutive matches
          consecutiveMatches++;
          if (consecutiveMatches > 1) {
            score += 0.5;
          }

          // Bonus for longer words (likely more meaningful)
          if (token.length > 5) {
            score += 0.5;
          }
        } else {
          consecutiveMatches = 0;
        }
      }

      // Normalize by choice length to avoid favoring verbose choices
      const normalizedScore = score / Math.max(1, choiceTokens.length);

      if (normalizedScore > bestScore) {
        bestScore = normalizedScore;
        bestIndex = i;
      }
    }

    // Only attempt if we found a decent match
    const minConfidenceThreshold = 0.15; // Minimum score required to attempt

    if (bestIndex !== -1 && bestScore >= minConfidenceThreshold) {
      console.log(`attempting improved definition match: "${choices[bestIndex].innerText.trim()}" (score: ${bestScore.toFixed(2)})`);
      choices[bestIndex].click();

      if (iscorrect(choices[bestIndex])) {
        qList[curQ.q] = choices[bestIndex].innerText.trim();
        localStorage.practiceLists = JSON.stringify(pLists);
        // Clear failed attempts for this question
        failedAttempts.delete(questionKey);
        return true;
      } else {
        // Record this failed attempt
        failedForQuestion.push(bestIndex);
        console.log(`Failed attempt ${failedForQuestion.length}/${maxAttempts} for "${questionKey}"`);
      }
    } else {
      console.log(`No confident match found for "${questionKey}" (best score: ${bestScore.toFixed(2)})`);
      updateOverlay('D', `No confident match found`);
    }

    return false;
  }

  // -- Helper to see if a choice is correct
  function iscorrect(choice) {
    return choice.className.includes('correct');
  }

  // -- Update the overlay function
  function updateOverlay(qtype, info) {
    const qtypeDisplay = document.getElementById('qtype-display');
    const extraInfo = document.getElementById('extra-info');

    if (qtypeDisplay) qtypeDisplay.innerText = `Q Type: ${qtype}`;
    if (extraInfo) extraInfo.innerText = `Info: ${info || 'N/A'}`;
  }

  // -- Function to clear failed attempts when moving to a new question
  function clearFailedAttemptsForNewQuestion(questionText) {
    // Clear attempts for questions not seen recently (cleanup)
    if (failedAttempts.size > 10) {
      // Keep only the most recent 10 questions
      const keys = Array.from(failedAttempts.keys());
      for (let i = 0; i < keys.length - 10; i++) {
        failedAttempts.delete(keys[i]);
      }
    }

    // Ensure this question is tracked
    if (!failedAttempts.has(questionText)) {
      failedAttempts.set(questionText, []);
    }
  }


  // -- Modular handler for question type 'F' (fill-based questions)
async function handleTypeF(curq, qlist, choices, pLists) {
  const allDefs = JSON.parse(localStorage.getItem('words&defs') || '[]');
  const knownWords = allDefs.map(e => e.word?.toLowerCase()).filter(Boolean);

  // Convert HTMLCollection to an array so we can safely use .map()
  const choiceArray = Array.from(choices);

  const matchedWords = choiceArray
    .map((c, i) => ({ text: c.innerText.trim().toLowerCase(), index: i }))
    .filter(item => knownWords.includes(item.text));

  // Update the overlay
  updateOverlay('F', matchedWords.length ? `Matched: ${matchedWords.map(m => m.text).join(', ')}` : 'No match found.');

  // If exactly one match, click it
  if (matchedWords.length === 1) {
    const index = matchedWords[0].index;
    choices[index].click();
    console.log(`F-type guess: matched known word "${matchedWords[0].text}"`);

    if (iscorrect(choices[index])) {
      qlist[curq.q] = matchedWords[0].text;
      localStorage.practiceLists = JSON.stringify(pLists);
      return true;
    }
  }

  return false;
}




  // -- main object to store question-to-answer mappings
  function practicelist(id) {
    this.id = id;
    this.qtyped = {};
    this.qtypes = {};
    this.qtypep = {};
    this.qtypeh = {};
    this.qtypel = {};
    this.qtypea = {};
    this.qtypef = {};
    this.qtypei = {};
    this.qtypeg = {};
  }

  // -- read page context
  const parts = window.location.href.split('/');
  const ispractice = parts[3] === 'lists';
  const practiceid = parts[4];
  const stor = window.localStorage;

  // -- load or create practice lists
  const plists = stor.practiceLists ? JSON.parse(stor.practiceLists) : {};
  if (!plists[practiceid]) {
    plists[practiceid] = new practicelist(practiceid);
    stor.practiceLists = JSON.stringify(plists);
  }
  const curlist = plists[practiceid];
  console.log(`curlist: ${curlist.id}`);

  const keyword = ispractice ? '.question' : '.box-question';
  const keytypeindex = ispractice ? 4 : 5;

  let lastq = null;
  let triedindices = [];
  let recordedtried = false;

  // -- map question types to correct sub-objects
  function getqlist(list, t) {
    const map = {
      'S': list.qtypes,
      'D': list.qtyped,
      'P': list.qtypep,
      'H': list.qtypeh,
      'L': list.qtypel,
      'A': list.qtypea,
      'F': list.qtypef,
      'I': list.qtypei,
      'G': list.qtypeg,
    };
    return map[t.toUpperCase()];
  }

  // -- fill in blank type
  function answertypet(curq) {
    const ans = curq.querySelector('.complete').children[0].innerText;
    curq.querySelector('input').value = ans;
    curq.querySelector('.spellit').click();
  }

  // -- click next
  function clicknext() {
    const btn = ispractice ? document.querySelector('.next') : document.querySelector('.btn-next');
    if (btn) btn.click();
  }

  // -- helper: extracts an "answer" string from the choice (especially for images)
  function extractanswer(choice, qtype) {
    return qtype === 'I'
      ? choice.style.backgroundImage.split('/')[5]
      : choice.innerText.trim();
  }

  // -- main loop
  setInterval(answerquestion, 300);

  async function answerquestion() {
    if (paused) return; // skip logic if paused

    const qnodes = document.querySelectorAll(keyword);
    if (!qnodes.length) return;
    const curq = qnodes[qnodes.length - 1];
    const classes = curq.classList[1] || '';
    const qtype = classes.charAt(keytypeindex).toUpperCase();

    // Update overlay displays
    updateOverlay(qtype, 'Loading...');

    // Type 'T' is fill-in-the-blank
    if (qtype === 'T') {
      answertypet(curq);
      clicknext();
      return;
    }

    // Parse question text for various types
    if (qtype === 'P' || qtype === 'L' || qtype === 'H') {
      curq.q = curq.querySelector('.sentence').children[0].innerText;
    } else if (qtype === 'F') {
      curq.q = curq.querySelector('.sentence').innerText.split(' ')[0];
    } else if (qtype === 'I') {
      curq.q = ispractice
        ? curq.querySelector('.wrapper').innerText.split('\n')[1]
        : curq.querySelector('.box-word').innerText.split('\n')[1];
    } else if (qtype === 'G') {
      curq.q = curq.querySelector('.questionContent').style.backgroundImage.split('/')[5];
    } else {
      curq.q = curq.querySelector('.instructions strong').innerText;
    }

    // Reset if new question
    if (lastq !== curq.q) {
      lastq = curq.q;
      triedindices = [];
      recordedtried = false;
      clearFailedAttemptsForNewQuestion(curq.q);
    }

    const qlist = getqlist(curlist, qtype);
    if (!qlist) return;

    const choices = curq.querySelector('.choices').children;

    // If we have a recorded answer, try it first
    if (qlist.hasOwnProperty(curq.q)) {
      updateOverlay(qtype, `Using recorded knowledge: "${qlist[curq.q]}"`);
      const stored = qlist[curq.q];
      let found = -1;
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].innerText.trim() === stored) {
          found = i;
          break;
        }
      }
      if (found !== -1) {
        if (!recordedtried) {
          choices[found].click();
          console.log(`clicked recorded answer: "${stored}"`);
          recordedtried = true;
          return;
        } else {
          console.log(`recorded answer for "${curq.q}" failed. Removing & trying synonyms or random.`);
          delete qlist[curq.q];
        }
      } else {
        console.log(`recorded answer not found in choices, removing & trying synonyms or random.`);
        delete qlist[curq.q];
      }
    }

    // Modular handling: attempt qtype-specific logic
    if (qtype === 'S') {
      const handled = await handleTypeS(curq, qlist, choices);
      if (handled) return;
    }
    if (qtype === 'D') {
      const handled = await handleTypeD(curq, qlist, choices, plists);
      if (handled) { clicknext(); return; }
    }
    if (qtype === 'F') {
  const handled = await handleTypeF(curq, qlist, choices, plists);
  if (handled) { clicknext(); return; }
}


    // Fallback: sequential guess method as the last resort
    let available = [];
    for (let i = 0; i < choices.length; i++) {
      if (!triedindices.includes(i)) available.push(i);
    }
    if (!available.length) {
      triedindices = [];
      available = Array.from({ length: choices.length }, (_, i) => i);
    }
    const r = available[Math.floor(Math.random() * available.length)];
    choices[r].click();

    // Improved code with validation and delay
choices[r].click();

// Add a small delay to give the page time to update
setTimeout(() => {
  // Re-check if this choice is actually correct after DOM update
  if (iscorrect(choices[r])) {
    const ans = extractanswer(choices[r], qtype);
    console.log(`Verified correct answer: "${ans}"`);

    // Double-check before recording
    qlist[curq.q] = ans;
    stor.practiceLists = JSON.stringify(plists);
    console.log(`recorded: "${curq.q}" -> "${ans}"`);

    triedindices = [];
    recordedtried = false;

    // Now it's safe to move on
    clicknext();
  } else {
    console.log(`Answer wasn't correct or DOM didn't update in time`);
    triedindices.push(r);
  }
}, 300); // 300ms delay to ensure DOM updates
  }

  // -- initialize the pause overlay
  createpauseoverlay();
})();
