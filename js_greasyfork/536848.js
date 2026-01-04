// ==UserScript==
// @name        pr0game auto-galaxy sync
// @namespace   pr0game
// @match       https://pr0game.com/*/game.php*page=galaxy*
// @grant       none
// @version     1.0
// @run-at      document-end
// @license     MIT
// @author      moh
// @description Automatic galaxy sync
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pr0game.com
// @downloadURL https://update.greasyfork.org/scripts/536848/pr0game%20auto-galaxy%20sync.user.js
// @updateURL https://update.greasyfork.org/scripts/536848/pr0game%20auto-galaxy%20sync.meta.js
// ==/UserScript==

(function() {
  const node = document.querySelector("#gala_sync")?.remove();
  syncsys();
})();
