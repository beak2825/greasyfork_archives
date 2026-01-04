// ==UserScript==
// @name         HD Highlighter - RARGB
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Highlight magnet links with the 1080p (Full HD) resolution.
// @author       hacker09
// @include      https://rargb.to/search/?search=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://rargb.to
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494280/HD%20Highlighter%20-%20RARGB.user.js
// @updateURL https://update.greasyfork.org/scripts/494280/HD%20Highlighter%20-%20RARGB.meta.js
// ==/UserScript==

(function() {
  'use strict';
  new MutationObserver(function() {
    document.querySelectorAll(".lista2").forEach(function(el) { //forEach link start the MutationObserver
      if (el.innerText.match('1080') !== null) { //If link has 10801080
        el.style.backgroundColor = 'rgb(0 102 204 / 50%)'; //Highlight the row
      } //Finishes the if condition
    }) //Finishes the forEach loop
  }).observe(document, { childList: true, subtree: true }); //Finishes the MutationObserver
})();