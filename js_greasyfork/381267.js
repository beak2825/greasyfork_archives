// ==UserScript==
// @name        Pukiwiki Edit
// @namespace   yusanish@gmail.com
// @description Pukiwikiの編集をCtrl+eで行えるようにする。
// @include     /^https?://.*?/pukiwiki/.*$/
// @version     2
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381267/Pukiwiki%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/381267/Pukiwiki%20Edit.meta.js
// ==/UserScript==

(function () {
  document.addEventListener('keydown', function (e) {
    // pressed Ctrl + e
    if (e.keyCode == 69 && !e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
      var edit = $('#navigator > a[href*="edit"]');
      window.location = edit[0].href;
    }
  }, false);
}) ();