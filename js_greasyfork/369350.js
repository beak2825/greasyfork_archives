// ==UserScript==
// @name     		WaniKani - Reading Confidence
// @version		1.0
// @description:en      Placeholder
// @match		https://www3.nhk.or.jp/*
// @match		https://matcha-jp.com/easy*
// @namespace https://greasyfork.org/users/188897
// @description Placeholder
// @downloadURL https://update.greasyfork.org/scripts/369350/WaniKani%20-%20Reading%20Confidence.user.js
// @updateURL https://update.greasyfork.org/scripts/369350/WaniKani%20-%20Reading%20Confidence.meta.js
// ==/UserScript==

function promptUserForApiKey() {
  const apiKey = prompt('To use "WaniKani - Confident Reading", please fill in your API Key (V1)');
  
  if (apiKey) {
  	localStorage.setItem('wkcr_apiKey', apiKey); 
  }
}

function getApiIUrl() {
  const base = 'https://www.wanikani.com/api/user/';
	const apiKey = localStorage.getItem('wkcr_apiKey') || promptUserForApiKey();
   
  return base + apiKey;
}

// Request vocabulary known by the user from Wanikani api and return the data without the user information included
function fetchVocabulary(url) {
  return fetch(url)
    .then(function(response){
      	return response.json();
    })
  	.then(function(data) {
    	return data.requested_information.general;
  	});
}

// Request kanji known by the user from Wanikani api and return the data without the user information included
function fetchKanji(url) {
  return fetch(url)
    .then(function(response){
      	return response.json();
    })
  	.then(function(data) {
    	return data.requested_information;
  	});
}

// Fetch the vocabulary known by the user and assign them to a map which can be used for quick look ups, based on the vocabulary
function getVocabularyMap() {
  return fetchVocabulary(`${getApiIUrl()}/vocabulary`)
    .then(function(data) {
    	return new Map(data.map(function(item) {
        const key = item.character;
        const value = item;

        return [key, value];
      }));
    });
}

// Fetch the kanji known by the user and assign them to a map which can be used for quick look ups, based on the character
function getKanjiMap() {
  return fetchKanji(`${getApiIUrl()}/kanji`)
    .then(function(data) {
    	return new Map(data.map(function(item) {
        const key = item.character;
        const value = item;

        return [key, value];
      }));
    });
} 

// Collect all annotated kanji vocabulary on the page based on the <ruby> tag
function getAnnotatedVocabulary() {
	return [].slice.call(document.querySelectorAll('ruby')); 
}

// Request a map of the vocabulary and kanji known by the user and initialize the rest of the script after completion of both async calls to the Wanikani api
Promise.all([getVocabularyMap(), getKanjiMap()])
  .then(function(data) {
		start(data[0], data[1]);
	});

// Create a custom style tag in the head of the page, so custom styles can be assigned for page elements
function addCustomStyleTag(){
  customStyleTag = document.createElement('style');
  customStyleTag.type = 'text/css';
  customStyleTag.classList.add('customStyleTag');
                      
  document.getElementsByTagName('head')[0].appendChild(customStyleTag);
}

// Apply whatever css is passed as an argument to the custom style tag
function setCustomStyle(css) { 
  customStyleTag.innerHTML = css;
}

// Apply a class and details to vocabulary that is known
function markVocabAsKnown(el, details) {
	el.classList.add('is-known-vocab');
  el.setAttribute('title', details.meaning)
}

// Replace the inner HTML of unknown vocabulary items, to highlight the kanji that are known within the vocabulary
function markKanjiAsKnown(el, editedVocab) {
  const furigana = el.lastChild.textContent;
  
  editedVocab.push(`<rt>${furigana}</rt>`);
	el.innerHTML = editedVocab.join('');
}

// Highlight all vocabulary and kanji that are known by the user
// Only annotated vocabulary that's placed within <ruby> tags is checked
function highlightVocabulary(vocabMap, kanjiMap) {
	const annotatedVocabulary = getAnnotatedVocabulary();
  let knownVocabCount = 0;
    
  annotatedVocabulary.forEach(function(vocabNode) {
		const vocabulary = vocabNode.firstChild.textContent;
   	const vocabularyDetails = vocabMap.get(vocabulary); 
   
    // The user has learned this vocabulary item
    if (vocabularyDetails) {    
      // Visually mark the vocabulary item in the DOM
      markVocabAsKnown(vocabNode, vocabularyDetails);
      
      knownVocabCount++;
    } 
    // The user has not learned this vocabulary item yet
    else {
      const splitVocab = vocabulary.split('');
      
      // If the vocabulary item consists of 1 character, check if the user has learned that kanji
      if (splitVocab.length === 1) {
        const details = kanjiMap.get(splitVocab[0]);
        
        // The user has learned this kanji
        if (details) {
     			// Visually mark the kanji as a vocabulary item in the DOM
          markVocabAsKnown(vocabNode, details);
          
          knownVocabCount++;
        }
      } 
      // The unknown vocabulary item consists of more than 1 character
      else {
        const editedVocab =[];
        
        // Individually check each kanji within the vocabulary to item and augment that kanji that the user has already learned
      	splitVocab.forEach(function(character) {
          const details = kanjiMap.get(character);
          
          if (details) {
          	editedVocab.push(`<span class="is-known-kanji" title="${details.meaning}">${character}</span>`);
          } else {
          	editedVocab.push(character); 
          }
        });
        
        // Visually mark the kanji in the DOM
        markKanjiAsKnown(vocabNode, editedVocab)
      }
    }
  });
  
  var percentageKnownVocab = ((knownVocabCount / annotatedVocabulary.length) * 100).toFixed(2);
  
  console.log(`Known vocabulary: ${knownVocabCount} / ${annotatedVocabulary.length} (${percentageKnownVocab}%)`);
}

// INITIALIZE
function start(vocabMap, kanjiMap) {
  addCustomStyleTag();
	setCustomStyle('.is-known-vocab { background-color: aquamarine; } .is-known-vocab:hover { background: #a100f1; color: #fff; } .is-known-vocab rt { display: none; } .is-known-kanji { background: gold; } .is-known-kanji:hover { background: #f100a1; color: #fff; }');

  highlightVocabulary(vocabMap, kanjiMap);
}

