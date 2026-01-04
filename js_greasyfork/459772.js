// ==UserScript==
// @name         JPDB Auto Reveal Answer Sentence
// @namespace    jpdb_auto_reveal_answer
// @version      1.0
// @description  Reveals the sentence on the back of the card automatically
// @author       Farami
// @match        https://jpdb.io/review*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459772/JPDB%20Auto%20Reveal%20Answer%20Sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/459772/JPDB%20Auto%20Reveal%20Answer%20Sentence.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -こう- implemented the switch from question to answer without really navigating
    // by simply replacing the content and location.href on clicking the "show answer" button
    window.onload = observeUrlChange(revealSentence);

    // this handles refreshing the page while on the answer screen
    revealSentence();
})();


function revealSentence() {
    const isAnswerScreen = /\?c=.*&r=.*/.test(window.location.search);
    const sentence = document.getElementsByClassName("sentence")[0];

    if (isAnswerScreen) {
        sentence?.classList.remove("blur");
    }
}

function observeUrlChange(onChange) {
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                onChange();
            }
        });
    });
    observer.observe(body, { childList: true, subtree: true });
}