// ==UserScript==
// @name         Wanikani Enter Key Rebind
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Rebinds the enter and backspace keys to reduce strain on the right pinky finger
// @author       nomius10
// @homepageURL  https://gist.github.com/nomius10/46361e9c57300645f2ae3ab12780351a
// @include      *wanikani.com/review/session
// @include      *wanikani.com/lesson/session
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437193/Wanikani%20Enter%20Key%20Rebind.user.js
// @updateURL https://update.greasyfork.org/scripts/437193/Wanikani%20Enter%20Key%20Rebind.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* global $ */

    const buttonSel = "#answer-form button";
    const form = $("#answer-form form");
    const input = $("#user-response");

    function interceptDot(e) {
        console.log(e)
        if (e.key == ".") {
            e.preventDefault();
            // reselect each time, as button might be replaced (e.g. by Double-check script)
            $(buttonSel).trigger("click")
        }
        if (e.key == "Enter") {
            e.preventDefault();
        }
    }

    function interceptComma(e) {
        if(e.key == ",") {
            e.preventDefault();
            // trim the last char irrespective of cursor position
            let text = input[0].value
            text = text.slice(0,-1)
            input[0].value = text
        }
        if (e.key == "Backspace") {
            e.preventDefault();
        }
    }

    const disableKey = (key) => (e) => {
        if (e.key == key) {
            e.preventDefault()
            console.log(e)
        }
    }

    form.on("keydown", interceptComma);
    $("html").on("keydown", interceptDot);

    // Disable Backspace and Enter keys
    form.on("keydown", disableKey("Backspace"));
    $._data(form[0], 'events').keydown[0].handler = ()=>{}
})();