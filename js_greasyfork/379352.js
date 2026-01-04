// ==UserScript==
// @name         Keyboard Shortcut - Show Complete/Incomplete
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds keyboard shortcut to trigger Show Complete/Incomplete documents in SymLite. Hit Ctrl+X!
// @author       TB
// @match        https://symlite.moravia.com/Document?requestId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379352/Keyboard%20Shortcut%20-%20Show%20CompleteIncomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/379352/Keyboard%20Shortcut%20-%20Show%20CompleteIncomplete.meta.js
// ==/UserScript==

(function(){
document.addEventListener('keydown', function(e) {
  // pressed alt+g
  if (e.keyCode == 88 && !e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
   document.querySelector("#btn-filter-completed").click();
  }
}, false);
})();