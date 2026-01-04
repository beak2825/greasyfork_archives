// ==UserScript==
// @name        Pukiwiki Submit
// @namespace   yusanish@gmail.com
// @description Pukiwikiの編集画面でAlt + sで更新をする
// @include     /^https?://.*?/pukiwiki/.*$/
// @version     2
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381268/Pukiwiki%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/381268/Pukiwiki%20Submit.meta.js
// ==/UserScript==

(function () {
  document.addEventListener('keydown', function (e) {
    // pressed Alt + s
    if (e.keyCode == 83 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
      $('input[name="notimestamp"]').prop("checked", true);
      var write = $('input[value="ページの更新"]');
      write[0].click();
    }
  }, false);
}) ();