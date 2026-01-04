// ==UserScript==
// @name         Bunpro: Toggle Tense Tip
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Automatically hides the tense tip on review and cram pages - press spacebar to toggle
// @author       yndajas, durtle9831/memosiki (draft toggle logic)
// @license      MIT
// @include      *bunpro.jp*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974366
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435322/Bunpro%3A%20Toggle%20Tense%20Tip.user.js
// @updateURL https://update.greasyfork.org/scripts/435322/Bunpro%3A%20Toggle%20Tense%20Tip.meta.js
// ==/UserScript==

(() => {
  const placeholder = "_________";
  let tense;
  let studyAreaInput;
  let currentTenseAttribute;

  const toggleTenseAttribute = () => {
    const newTenseAttribute = (currentTenseAttribute === tense ? placeholder : tense);
    studyAreaInput.setAttribute("data-tense", newTenseAttribute);
    currentTenseAttribute = newTenseAttribute;
  }

  const html = document.getElementsByTagName('HTML')[0];

  // wait until reviewing
  html.addEventListener('quiz-page', () => {
    // wait for new review item
    html.addEventListener('new-review-item', (event) => {
      // get element and current tense attribute
      studyAreaInput = document.getElementsByClassName("study-area-input")[0];
      currentTenseAttribute = studyAreaInput.getAttribute("data-tense");

      // set tense if attribute exists and isn't the placeholder; hide tense inititally
      if (currentTenseAttribute && currentTenseAttribute !== placeholder) {
        tense = currentTenseAttribute;
        toggleTenseAttribute();
      }
    });
  })

  const handleSpaceKey = (event) => {
    if (event.keyCode === 32 && currentTenseAttribute) {
      toggleTenseAttribute();
    }
  }

  // toggle tense on space bar
  const studyAnswerInput = document.getElementById("study-answer-input");
  [html, studyAnswerInput].forEach((element) => {
    element.addEventListener('keydown', handleSpaceKey);
  });
})();