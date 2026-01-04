// ==UserScript==
// @name         Classroom backspace shortcut
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description   Press backspace in google classroom to get back to the mais page
// @author       You
// @match        https://classroom.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/431350/Classroom%20backspace%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/431350/Classroom%20backspace%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onBackspace() {
        document.getElementsByClassName("Xi8cpb cd29Sd")[0].click();
    }

    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.keyCode == 8) {
            onBackspace();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();