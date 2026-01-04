// ==UserScript==
// @name         Hide dead links - RARGB
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      6
// @description  Hides magnet links without any seeders.
// @author       hacker09
// @include      https://rargb.to/search/?search=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://rargb.to
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494052/Hide%20dead%20links%20-%20RARGB.user.js
// @updateURL https://update.greasyfork.org/scripts/494052/Hide%20dead%20links%20-%20RARGB.meta.js
// ==/UserScript==

(function() {
  'use strict';
  new MutationObserver(function() {
    document.querySelectorAll('[width="50px"].lista:nth-child(6)').forEach(function(el) { //forEach link start the MutationObserver
      if (el.innerText === '0') { //If seeder count is zero
        el.parentNode.style.display = 'none'; //Hide the parent element
      } //Finishes the if condition
    }) //Finishes the forEach loop
  }).observe(document, { childList: true, subtree: true }); //Finishes the MutationObserver
})();