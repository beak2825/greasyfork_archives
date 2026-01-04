// ==UserScript==
// @name        Remove Highlight Button (before page load)
// @namespace   Violentmonkey Scripts
// @match       https://help.qsys.com/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      Scott Stubblefield | https://github.com/sstubblefield/vm-qsys-help_removehighlights
// @description 5/23/2024, 1:55:17 PM
// @downloadURL https://update.greasyfork.org/scripts/499065/Remove%20Highlight%20Button%20%28before%20page%20load%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499065/Remove%20Highlight%20Button%20%28before%20page%20load%29.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', () => {
  const elm = document.querySelector('.search-bar-container');
  if (elm) {
    elm.insertAdjacentHTML('afterbegin', '<button class="remove-highlight-button">Remove Highlights</button>');
  } else {
    const observer = new MutationObserver(mutations => {
      const elm = document.querySelector('.search-bar-container');
      if (elm) {
        observer.disconnect();
        elm.insertAdjacentHTML('afterbegin', '<button class="remove-highlight-button">Remove Highlights</button>');
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
});
