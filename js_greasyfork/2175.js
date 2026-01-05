// ==UserScript==
// @name           Password Revealer
// @namespace      http://userscripts.org/users/23652
// @description    Shows passwords on mouse hover or focus
// @include        http://*
// @include        https://*
// @include        file:///*
// @exclude        file:///*/perf.html*
// @copyright      JoeSimmons
// @version        1.0.51
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/2175/Password%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/2175/Password%20Revealer.meta.js
// ==/UserScript==
(function() {




    var show_only_on_click = false; // only show passwords when you click on the field





    var handlers = [];

    function toText(e) {
        e = e.target;

        if (e.tagName === 'INPUT' && e.type === 'password') {
            // save the cursor position
            e.caretStart = e.selectionStart;
            e.caretEnd = e.selectionEnd;

            // switch it to text, but make it remember it was a password type
            e.type = 'text';
            e.oldType = 'password';

            // the selection range gets reset when we switch its type, so let's fix it
            e.setSelectionRange(e.caretStart, e.caretEnd);
        }
    }

    function toPassword(e) {
        e = e.target;

        if (e.tagName === 'INPUT' && e.oldType === 'password') {
            // save the cursor position
            e.caretStart = e.selectionStart;
            e.caretEnd = e.selectionEnd;

            // switch it to a password field
            e.type = 'password';

            // the selection range gets reset when we switch its type, so let's fix it
            e.setSelectionRange(e.caretStart, e.caretEnd);
            e.setSelectionRange(e.caretStart, e.caretEnd);

            // let's clean up our now-unused properties
            delete e.caretStart;
            delete e.caretEnd;
            delete e.oldType;
        }
    }

    function addHandlers() {
        var fields = document.querySelectorAll('input[type="password"]'), i, field;

        for (i = 0; field = fields[i]; i += 1) {
            if (handlers.indexOf(field) === -1) {
                field.addEventListener('focus', toText, false);
                field.addEventListener('blur', toPassword, false);
                handlers.push(field);
            }
        }
    }

    if (show_only_on_click === false) {
        window.addEventListener('mouseover', toText, false);
        window.addEventListener('mouseout', toPassword, false);
    } else {
        window.setInterval(addHandlers, 1000);
    }

}());