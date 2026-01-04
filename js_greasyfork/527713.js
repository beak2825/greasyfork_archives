// ==UserScript==
// @name        vocabulary.com bot
// @namespace   Violentmonkey Scripts
// @match       https://www.vocabulary.com/lists/*/practice*
// @grant       none
// @version     1.0
// @author      -
// @description 2/21/2025, 7:27:07 PM
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/527713/vocabularycom%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/527713/vocabularycom%20bot.meta.js
// ==/UserScript==
/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

(function () {
  'use strict';

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

  // naive token matching
  const defTokens = entry.definition.toLowerCase().split(/\W+/);
  let bestIndex = -1;
  let bestScore = -1;

  for (let i = 0; i < choices.length; i++) {
    const choiceTokens = choices[i].innerText.trim().toLowerCase().split(/\W+/);
    let score = choiceTokens.filter(t => defTokens.includes(t)).length;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  if (bestIndex !== -1) {
    choices[bestIndex].click();
    console.log(`attempting definition match: "${choices[bestIndex].innerText.trim()}" (score: ${bestScore})`);

    if (iscorrect(choices[bestIndex])) {
      qList[curQ.q] = choices[bestIndex].innerText.trim();
      localStorage.practiceLists = JSON.stringify(pLists);
      return true;
    }
  }

  return false;
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

    if (iscorrect(choices[r])) {
      const ans = extractanswer(choices[r], qtype);
      qlist[curq.q] = ans;
      stor.practiceLists = JSON.stringify(plists);
      console.log(`recorded: "${curq.q}" -> "${ans}"`);
      triedindices = [];
      recordedtried = false;
      clicknext();
    } else {
      triedindices.push(r);
    }
  }

  // -- initialize the pause overlay
  createpauseoverlay();
})();
