// ==UserScript==
// @name         WaniKani Always Show Item Info
// @namespace    polv/wanikani
// @version      1.0
// @description  Always show WaniKani item info during reviews without scrolling, no matter if your answer was correct or not.
// @author       polv
// @match        *://www.wanikani.com/*/session*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452349/WaniKani%20Always%20Show%20Item%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/452349/WaniKani%20Always%20Show%20Item%20Info.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const onSubmit = () => {
    setTimeout(() => {
      const btn = document.getElementById('option-item-info');
      if (btn instanceof HTMLElement && !btn.classList.contains('active')) {
        btn.click();
      }
    }, 50);
  };

  new MutationObserver(() => {
    const answerForm = document.querySelector('#answer-form fieldset');
    if (answerForm instanceof HTMLElement && answerForm.className) {
      onSubmit();
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
})();
