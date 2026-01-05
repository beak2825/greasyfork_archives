// ==UserScript==
// @name         Remove sponsored content from Pocket
// @namespace    https://zblesk.net/blog
// @version      0.93
// @description  It tries to remove sponsored content from Pocket's queue.
// @author       zblesk
// @match        https://getpocket.com/a/queue/
// @match        https://getpocket.com/a/queue/list/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/25132/Remove%20sponsored%20content%20from%20Pocket.user.js
// @updateURL https://update.greasyfork.org/scripts/25132/Remove%20sponsored%20content%20from%20Pocket.meta.js
// ==/UserScript==

(function() {
  'use strict';
  setTimeout(function() {
    console.log('Removing all ' + $(".spoc").length + ' items with the "spoc" class.');
    $(".spoc").hide();
  }, 1000);
})();