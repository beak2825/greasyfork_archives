// ==UserScript==
// @name         Sedecordle floating keyboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Floating keyboard for Sedecordle
// @author       You
// @match        https://sedecordlegame.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sedecordlegame.org
// @grant        none
// @license      GPLv3
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/469065/Sedecordle%20floating%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/469065/Sedecordle%20floating%20keyboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify the Game-keyboard div element
    function modifyGameKeyboardDiv() {
        const div = document.querySelector('div.Game-keyboard');
        if (div) {
            div.style.position = 'fixed';
            div.style.bottom = '0px';
        }
    }

    // Call the function when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyGameKeyboardDiv);
    } else {
        modifyGameKeyboardDiv();
    }

    // Observe changes to the DOM and reapply modifications when needed
    const observer = new MutationObserver(modifyGameKeyboardDiv);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();