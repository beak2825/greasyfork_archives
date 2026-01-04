// ==UserScript==
// @name         Stop Discourse hijacking page search
// @namespace    https://greasyfork.org/en/users/808835-xuv
// @version      0.1
// @license      CC BY-SA 3.0
// @description  Original code from: https://superuser.com/a/670040
// @author       xuv
// @website      https://greasyfork.org/en/users/808835-xuv
// @include      /^https?://(community|discourse|forums?)\./
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432367/Stop%20Discourse%20hijacking%20page%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/432367/Stop%20Discourse%20hijacking%20page%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keycode list: https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    // Keycode for 'f'. Add more to disable other ctrl+X interceptions
    var keycodes = [70];

    (window.opera ? document.body : document).addEventListener('keydown', function(e) {
        // alert(e.keyCode ); //uncomment to find more keyCodes
        if (keycodes.indexOf(e.keyCode) != -1 && e.ctrlKey) {
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            // alert("Gotcha!"); //ucomment to check if it's seeing the combo
        }
        return false;
    }, !window.opera);
})();
