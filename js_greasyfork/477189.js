// ==UserScript==
// @name         AMQ Tabify Anime Selection
// @namespace    http://tampermonkey.net/
// @version      1.0
// @licence      MIT
// @description  Use the tab key to navigate through the anime selection.
// @author       Shaykaden
// @match        https://animemusicquiz.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animemusicquiz.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477189/AMQ%20Tabify%20Anime%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/477189/AMQ%20Tabify%20Anime%20Selection.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const qpAnswerInput = document.querySelector("#qpAnswerInput");

    qpAnswerInput.addEventListener('keydown', function(e) {
        if (e.which === 9) {
            e.preventDefault();
            if (!!e.shiftKey) {
                const upArrowEvent = new KeyboardEvent("keydown", { keyCode: 38 });
                qpAnswerInput.dispatchEvent(upArrowEvent);
            } else {
                const downArrowEvent = new KeyboardEvent("keydown", { keyCode: 40 });
                qpAnswerInput.dispatchEvent(downArrowEvent);
            }
        }
    });
})();
