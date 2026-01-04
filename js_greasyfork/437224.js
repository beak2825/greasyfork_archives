// ==UserScript==
// @name         notionHelpButtonPostionMove
// @namespace    http://www.notion.so/
// @version      0.1
// @description  notion help button position move
// @author       xz
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?domain=notion.so
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437224/notionHelpButtonPostionMove.user.js
// @updateURL https://update.greasyfork.org/scripts/437224/notionHelpButtonPostionMove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Word Count Element */
  const countCss = `
    .notion-help-button.notion-focusable {
      bottom: 35px !important;
    }
  `;
  const countEl = document.createElement('style');
  countEl.innerHTML = countCss;
  /* Word Count Element */

  const helpBtn = document.querySelector('head');
  helpBtn.after(countEl);
})();