// ==UserScript==
// @name        Remove Google AI Overview
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/search*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant       none
// @version     1.2
// @author      klaufir216
// @run-at      document-start
// @license     MIT
// @description Automatically hides the AI Overview section from Google search pages.
// @downloadURL https://update.greasyfork.org/scripts/540134/Remove%20Google%20AI%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/540134/Remove%20Google%20AI%20Overview.meta.js
// ==/UserScript==

function parentUntil(elem, cond) {
  while (elem) {
    if (cond(elem)) return elem;
    elem = elem.parentNode;
  }
  return null;
}

function hideElement(elem) {
  if (elem) {
    elem.style.display='none';
  }
}

function removeAiOverview() {
  hideElement(document.querySelector('div[data-mlros]'));
  hideElement(document.querySelector('div#m-x-content'));
}

setTimeout(removeAiOverview, 100);
setTimeout(removeAiOverview, 200);
setTimeout(removeAiOverview, 300);
setTimeout(removeAiOverview, 400);
setTimeout(removeAiOverview, 600);
setTimeout(removeAiOverview, 800);
setTimeout(removeAiOverview, 1000);
setInterval(removeAiOverview, 1000);
