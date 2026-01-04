// ==UserScript==
// @name         KaBoot(modified)
// @namespace    https://tampermonkey.net
// @version      0.1
// @description  Allows you to press the 1234 keys on your keyboard to trigger the Kahoot answer buttons
// @author       lifavo
// @match        https://kahoot.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425312/KaBoot%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425312/KaBoot%28modified%29.meta.js
// ==/UserScript==

(function() {
document.addEventListener('keydown', e => {
    if (event.isComposing ||e.keyCode == 49) {
        document.querySelector('[data-functional-selector="answer-0"]').click();
    }
    if (event.isComposing ||e.keyCode == 50) {
        document.querySelector('[data-functional-selector="answer-1"]').click();
    }
    if (event.isComposing ||e.keyCode == 51) {
        document.querySelector('[data-functional-selector="answer-2"]').click();
    }
    if (event.isComposing ||e.keyCode == 52) {
        document.querySelector('[data-functional-selector="answer-3"]').click();
    }
});
})();