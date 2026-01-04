// ==UserScript==
// @name         SillyTavern - Excessive text hiding
// @namespace    http://tampermonkey.net/
// @version      1.9.7
// @description  Removes all dialogues on the current page each time the 1 key on the keyboard is pressed except for the last 10 dialogues and new dialogues.
// @author       Kurayami
// @match        http://127.0.0.1:8000/*
// @license      LGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/473800/SillyTavern%20-%20Excessive%20text%20hiding.user.js
// @updateURL https://update.greasyfork.org/scripts/473800/SillyTavern%20-%20Excessive%20text%20hiding.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("keypress", function(event) {
        if (event.key === "1") { hidden(); }
    });
    function hidden() {
        var elements = document. getElementsByClassName("mes");
        for(let i = 1; i < elements.length; i++) {
            elements[i].style.display = "null";
        }
        for(let i = 1; i < elements.length - 10; i++) {
            elements[i].style.display = "none";
        }
    }
})();