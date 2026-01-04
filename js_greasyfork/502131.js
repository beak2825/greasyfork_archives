// ==UserScript==
// @name         Auto-Answer Chanwiki
// @namespace    chanwiki.com
// @version      1.2
// @description  Fills the answer field with "sra" on chanwiki.com.
// @author       Anon
// @match        https://chanwiki.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502131/Auto-Answer%20Chanwiki.user.js
// @updateURL https://update.greasyfork.org/scripts/502131/Auto-Answer%20Chanwiki.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function fillAnswerField() {
    const labels = document.querySelectorAll('label[for="wpCaptchaWord"]');

    labels.forEach(label => {
      if (label.textContent.includes("Sram psa jak?")) {
        const answerFieldId = label.getAttribute('for');
        const answerField = document.getElementById(answerFieldId);

        if (answerField && answerField.value === "") {
          answerField.value = "sra";
        }
      }
    });
  }

  fillAnswerField();
  window.addEventListener('load', fillAnswerField);

  const observer = new MutationObserver(fillAnswerField);
  observer.observe(document.body, { childList: true, subtree: true });
})();