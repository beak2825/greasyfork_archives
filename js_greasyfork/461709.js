// ==UserScript==
// @name         WK Vimy Lessons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds HJKL navigation to the wanikani lessons page
// @author       Gorbit99
// @match        https://www.wanikani.com/lesson/session
// @match        https://preview.wanikani.com/lesson/session
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/461709/WK%20Vimy%20Lessons.user.js
// @updateURL https://update.greasyfork.org/scripts/461709/WK%20Vimy%20Lessons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("keydown", handleKeyPress);

    function handleKeyPress(event) {
        switch (event.key) {
            case "h":
                document.querySelector("#prev-btn")?.click();
                break;
            case "l":
                document.querySelector("#next-btn")?.click();
                break;
            case "j":
                switchSelectedContext(1);
                break;
            case "k":
                switchSelectedContext(-1);
                break;
        }
    }

    function switchSelectedContext(direction) {
        const contexts = [...document.querySelectorAll(".context__word-types .word-type__button")];
        const activeIndex = contexts.findIndex((elem) => elem.classList.contains("word-type__button--selected"))
        const nextIndex = (activeIndex + direction + contexts.length) % contexts.length;
        contexts[nextIndex].click();

    }
})();