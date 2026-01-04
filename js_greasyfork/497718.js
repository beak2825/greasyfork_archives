// ==UserScript==
// @name        JPDB Show Pitch In Review Question
// @namespace   JPDB_Show_Pitch_In_Review_Question
// @match       https://jpdb.io/review*
// @grant       none
// @version     0.01
// @author      Flipp Fuzz
// @description 6/12/2024, 6:06:28 PM
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497718/JPDB%20Show%20Pitch%20In%20Review%20Question.user.js
// @updateURL https://update.greasyfork.org/scripts/497718/JPDB%20Show%20Pitch%20In%20Review%20Question.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Handling of answer is copied from https://greasyfork.org/en/scripts/459772-jpdb-auto-reveal-answer-sentence/code
  // -こう- implemented the switch from question to answer without really navigating
  // by simply replacing the content and location.href on clicking the "show answer" button
  window.onload = observeUrlChange(addPitchToQuestion);

  // this handles refreshing the page while on the answer screen
  addPitchToQuestion();
})();

function observeUrlChange(onChange) {
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        onChange();
      }
    });
  });
  observer.observe(body, { childList: true, subtree: true });
}

function addPitchToQuestion() {
  if(new URL(location.href).searchParams.get('c')) {
    let pitchSearchResults = document.querySelectorAll('body > div.container.bugfix > div > div.review-reveal > div.result.vocabulary > div > div.subsection-pitch-accent > div > div > div > div');
    let insertAfterElement = document.querySelector('body > div.container.bugfix > div > div.review-reveal > div.answer-box > div.plain > a');

    if(!pitchSearchResults || pitchSearchResults.length == 0 || !insertAfterElement) {
      console.log(`pitchSearchResults: ${pitchSearchResults}`);
      console.log(`insertAfterElement: ${insertAfterElement}`);
      return;
    }

    // Create a div to add our new pitches into
    let containerDiv = document.createElement("div");
    containerDiv.setAttribute('class', 'answer-pitch-container');
    containerDiv.style.fontSize = "50%";
    containerDiv.style.paddingLeft = "5px";
    insertAfterElement.insertAdjacentElement('afterend', containerDiv);

    pitchSearchResults.forEach(pitch => {
        containerDiv.appendChild(pitch.cloneNode(true));
    });
  }
}