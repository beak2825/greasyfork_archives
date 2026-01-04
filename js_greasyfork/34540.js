// ==UserScript==
// @name WaniKani Example Sentences
// @version 3.2
// @description  Displays additional examples sentences for the given vocabulary.
// @require https://greasyfork.org/scripts/34539-wanikani-api/code/WaniKani%20API.js?version=226222
// @match https://www.wanikani.com/settings/account*
// @match https://www.wanikani.com/vocabulary/*
// @match https://www.wanikani.com/review/session*
// @match https://www.wanikani.com/lesson/session*
// @run-at          document-end
// @copyright 2017 jeshuam
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/27794
// @downloadURL https://update.greasyfork.org/scripts/34540/WaniKani%20Example%20Sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/34540/WaniKani%20Example%20Sentences.meta.js
// ==/UserScript==

//////////////////////////
/////// CSS Styles ///////
//////////////////////////
GM_addStyle(`
div#example-sentences {
max-height: 400px;
overflow: auto;
}

.example-sentence-unlearned-vocab {
display: none;
}

#example-sentences-toggle-display {
margin-bottom: 20px;
}`);


/////////////////////////
/////// Constants ///////
/////////////////////////
// The amount of time before the learned item cache is updated.
let CACHE_EXPIRATION_TIMER_MS = 24 * 60 * 60 * 1000; // (1 day)


/////////////////////////////////
/////// Utility Functions ///////
/////////////////////////////////
//
// Determine whether the given Japanese word ends in an 'u' sound (i.e. is a verb).
//
function EndsInUSound(japaneseWord) {
  return japaneseWord.match(/[るゆむふぬつすくう]/) !== null;
}

//
// Function to check whether a Japanese word only contains kana (hira- or katakana).
//
function OnlyContainsKanaOrPunctuation(japaneseWord) {
  return japaneseWord.match(/^[\u3000-\u30FF]+$/) !== null;
}


/////////////////////////////
/////// Main Function ///////
/////////////////////////////
function DisplayExampleSentences(known_vocab) {
  //
  // Extract the Kanji from the current page. This will have a switch for each type of page, and
  // will do something different for each. This will only include vocabulary pages, reviews and
  // lessons.
  //
  function GetVocabularyKanjiFromPage() {
    // Vocabulary information page.
    if (document.URL.indexOf('vocabulary') != -1) {
      return document.querySelector('header span.vocabulary-icon span').innerText.trim();
    }

    // Review page.
    else if (document.URL.indexOf('review/session') != -1) {
      return document.querySelector('div.vocabulary span').innerText.trim();
    }

    // Lesson page.
    else if (document.URL.indexOf('lesson/session') != -1) {
      return document.querySelector('div#main-info div#character').innerText.trim();
    }

    // Not on a valid page.
    else {
      return null;
    }
  }

  //
  // Get the data from the remote URL for the given vocabulary.
  //
  function GetExampleSentencesForVocabulary(vocabulary, complete) {
    WaniKaniAPI.load('https://jeshuam.pythonanywhere.com/wanikani-sentences/' + vocabulary, complete);
  }

  //
  // Generate the DOM required to display the example sentences. This will be consistent over the
  // various pages this script runs on.
  //
  function GetSectionWithExamplesSentences(known_vocab, sentences) {
    // Make the initial section.
    let section = document.createElement('section');
    section.id = 'examples-sentences-section';
    section.innerHTML = `
<h2>More Context Sentences</h2>
<button id="example-sentences-toggle-display">Show All Sentences</button>
<div id="example-sentences"></div>
`;

    // When the button is pressed, show/hide the example sentences with unlearned vocab.
    section.children[1].onclick = function() {
      if (this.innerText === 'Show All Sentences') {
        for (let element of document.querySelectorAll('.example-sentence-unlearned-vocab')) {
          element.style.display = 'block';
        }

        this.innerText = 'Show Only Known Vocab';
      } else {
        for (let element of document.querySelectorAll('.example-sentence-unlearned-vocab')) {
          element.style.display = 'none';
        }

        this.innerText = 'Show All Sentences';
      }
    };

    // Add each sentence to the section.
    for (let sentence of sentences) {
      // Check if this sentence has any words we don't know. If it does, add an extra class to it.
      let extra_class = '';
      let kanji = GetVocabularyKanjiFromPage();
      for (let word of sentence.jpn) {
        if (word != kanji && !OnlyContainsKanaOrPunctuation(word) && known_vocab[word] === undefined) {
          extra_class = 'example-sentence-unlearned-vocab';
          break;
        }
      }

      // Make the HTML for this sentence.
      let japanese_html = '';
      for (let word of sentence.jpn) {
        // Highlight the current word.
        if (word == kanji) {
          japanese_html += '<span class="vocabulary-highlight highlight-vocabulary">' + kanji + '</span>';
        }

        // Insert a link to the WaniKani page for learned vocabulary.
        else if (known_vocab[word] !== undefined) {
          japanese_html += '<span><a href="https://www.wanikani.com/vocabulary/' + known_vocab[word] + '">' + word + '</a></span>';
        }

        // Otherwise, just put the word into the text.
        else {
          japanese_html += '<span>' + word + '</span>';
        }
      }

      let sentence_html = document.createElement('div');
      sentence_html.className = `context-sentence-group ${extra_class}`;
      sentence_html.innerHTML = `<p lang="ja">${japanese_html}</p><p>${sentence.eng}</p>`;

      section.children[2].appendChild(sentence_html);
    }

    return section;
  }

  // Process the vocabulary page.
  if (document.URL.indexOf('vocabulary') >= 0) {
    let vocab = GetVocabularyKanjiFromPage();
    GetExampleSentencesForVocabulary(vocab, function(data) {
      if (data.length === 0) {
        return;
      }

      let section = GetSectionWithExamplesSentences(known_vocab, data);
      let insertion_section = document.querySelector('section.context-sentence');
      insertion_section.parentNode.insertBefore(section, insertion_section.nextSibling);
    });
  }

  // Process the review page. TODO(jeshua): test this.
  else if (document.URL.indexOf('review/session') >= 0) {
    // If the 'all-info' button is pressed, then display it.
    document.querySelector('div#all-info').onclick = function() {
      let vocab = GetVocabularyKanjiFromPage();
      GetExampleSentencesForVocabulary(vocab, function(data) {
        if (data.length === 0) {
          return;
        }

        // Remove the old section.
        let section_to_remove = document.querySelector('#examples-sentences-section');
        if (section_to_remove !== null) {
          section_to_remove.parentNode.removeChild(section_to_remove);
        }

        let section = GetSectionWithExamplesSentences(known_vocab, data);
        let insertion_section = document.querySelector('section#item-info-context-sentences');
        insertion_section.parentNode.appendChild(section);
      });
    };
  }

  // Process the lesson page.
  else if (document.URL.indexOf('lesson/session') >= 0) {
    let observer = new MutationObserver(function() {
      let vocab = GetVocabularyKanjiFromPage();
      GetExampleSentencesForVocabulary(vocab, function(data) {
        if (data.length === 0) {
          return;
        }

        // Remove the old section.
        let section_to_remove = document.querySelector('#examples-sentences-section');
        if (section_to_remove !== null) {
          section_to_remove.parentNode.removeChild(section_to_remove);
        }

        // Add the new section.
        let section = GetSectionWithExamplesSentences(known_vocab, data);
        let insertion_section = document.querySelector('div#supplement-voc-context-sentence');
        insertion_section.parentNode.insertBefore(section, insertion_section.nextSibling);
      });
    });
    
    observer.observe(document.querySelector('div#main-info'), {subtree: true, childList: true});
  }
}


//////////////////////////////
/////// Start Function ///////
//////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  // Get their API key. If we are on the account page, go no further.
  if (WaniKaniAPI.getAPIKey() === undefined) {
    console.log('EXAMPLE-SENTENCES: No WaniKani API key found!');
    return;
  }

  // Load the unlocked vocab, initializing to an empty object.
  let unlockedVocab = JSON.parse(GM_getValue('wanikani-sentences-learned-cache', '{"__cache-time": 0}'));

  // If cache expired, update first then run main.
  let currentTime = (new Date().getTime());
  if ((currentTime - unlockedVocab['__cache-time']) > CACHE_EXPIRATION_TIMER_MS) {
    console.log('EXAMPLE-SENTENCES: Cache expired, refreshing known vocabulary.');
    WaniKaniAPI.load(WaniKaniAPI.apiURL('vocabulary'), function(data) {
      for (let vocab of data.requested_information.general) {
        if (vocab.user_specific !== null) {
          // Remove any preceding ~ characters (as they aren't part of the word).
          let kanji = vocab.character.replace(/〜/g, '');
          unlockedVocab[kanji] = kanji;

          // For verbs, remove the U sound at the end. This should do a decent job of showing
          // the verb even if it is conjugated (it won't be perfect, but better than nothing).
          if (EndsInUSound(kanji)) {
            unlockedVocab[kanji.substr(0, kanji.length - 1)] = kanji;
          }
        }
      }

      // Cache time in milliseconds since the epoch.
      unlockedVocab['__cache-time'] = (new Date().getTime());

      // Save the cache, then keep going with the main program.
      GM_setValue('wanikani-sentences-learned-cache', JSON.stringify(unlockedVocab));
      DisplayExampleSentences(unlockedVocab);
    });
  } else {
    DisplayExampleSentences(unlockedVocab);
  }
});
