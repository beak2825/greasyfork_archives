// ==UserScript==
// @name         DAU Copy Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automation for copy Pastings
// @author       Ice_fly
// @match        https://dau.csod.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523189/DAU%20Copy%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/523189/DAU%20Copy%20Script.meta.js
// ==/UserScript==

(function() {
  'use strict';


// Function to select and copy text to clipboard
  function copyToClipboard(element) {
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
  }

  // Remove the event listener that disables text selection
  document.onselectstart = null;
  document.oncontextmenu = null;
  // Find the fieldset element
  const questionFieldset = document.querySelector('.testEngine-question');

  // If the fieldset exists, select and copy its content
  if (questionFieldset) {
    copyToClipboard(questionFieldset);
  }
})();