// ==UserScript==
// @name         Pagination Keyboard Shortcut Fix
// @namespace    https://greasyfork.org/users/65414
// @description  Fix unreliable pagination behavior
// @version      0.1
// @match        *.tumblr.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411988/Pagination%20Keyboard%20Shortcut%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/411988/Pagination%20Keyboard%20Shortcut%20Fix.meta.js
// ==/UserScript==

(function() {

  (window.opera ? document.body : document).addEventListener('keydown', function(e) {

    let btns = {
      "Previous": 37,
      "Next": 39
    }

    $(Object.keys(btns)).each(function() {
      let el = $(`button[aria-label="${this}"] > :first-child`).last();
      if (e.keyCode == btns[this]) {
        e.cancelBubble = true;
        e.stopImmediatePropagation();
        if (el.closest('._3uGiA._2t9LV').length || el.length && !$('._3uGiA._2t9LV').length)
          el.click();
      }
    })
    return false;

  }, !window.opera);

})();