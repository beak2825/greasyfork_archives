// ==UserScript==
// @name         WaniKani Speed
// @namespace    roboro
// @version      1.1
// @description  Speed up your reviews by moving immediately to the next kanji when correct, or opening the info box when incorrect
// @author       roboro
// @include      /https://(www.)?wanikani\.com/subjects/review/
// @include      /https://(www.)?wanikani\.com/subject-lessons/.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377778/WaniKani%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/377778/WaniKani%20Speed.meta.js
// ==/UserScript==

let observer = null;

const addInputObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  const inputEl = document.querySelector('.quiz-input__input-container');

  if (!inputEl) return;

  const nextButtonEl = inputEl.querySelector('.quiz-input__submit-button');

  observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      if (mutation.attributeName === 'correct') {
        const attributeValue = mutation.target.getAttribute('correct');
        
        if (attributeValue === 'true') {
          nextButtonEl.click();
        } else if (attributeValue === 'false') {
          document.querySelector('.additional-content__item--item-info').click();
        }
      }
    });
  });

  observer.observe(inputEl, { attributes: true });
};

document.addEventListener('DOMContentLoaded', () => {
  addInputObserver();

  // In lessons, when the user moves on to the quiz, the url changes, but the script isn't retriggered,
  // even if we set the url to only run on the quiz page. So we observe changes to the body tag, and 
  // assume that means the page has changed. Once the Navigation API (https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)
  // is better supported, we could probably use that instead.
  const pageChangeObserver = new MutationObserver(addInputObserver);
  pageChangeObserver.observe(document.body, { attributes: true });
});