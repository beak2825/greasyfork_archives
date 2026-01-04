// ==UserScript==
// @name        NoG4G
// @namespace   https://github.com/meooow25
// @match       *://www.google.com/search*
// @grant       none
// @version     0.3
// @author      meooow
// @description Removes G4G from Google search results
// @downloadURL https://update.greasyfork.org/scripts/440310/NoG4G.user.js
// @updateURL https://update.greasyfork.org/scripts/440310/NoG4G.meta.js
// ==/UserScript==

(function() {
  for (const div of document.querySelector('#search').querySelector('div[data-async-context]').children) {
    for (const a of div.querySelectorAll('a')) {
      if (a.href.includes('//www.geeksforgeeks.org')) {
        console.log('[NoG4G] Removing ' + a.href);
        div.style.display = 'none';
        break;
      }
    }
  }
})();