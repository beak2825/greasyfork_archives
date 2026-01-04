// ==UserScript==
// @name         SBAuto for Swagbucks (May 2025 Update)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Automatically answers Swagbucks surveys with random choices and clicks "Next" when enabled.
// @author       Thaswasupbreh
// @match        *://www.swagbucks.com/surveys/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536441/SBAuto%20for%20Swagbucks%20%28May%202025%20Update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536441/SBAuto%20for%20Swagbucks%20%28May%202025%20Update%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const interval = 1000;

    function getChoices() {
        return Array.from(document.querySelectorAll(".choice-option.random-choice"));
    }

    function clickRandomChoice() {
        const choices = getChoices();
        if (choices.length === 0) return;

        const randomIndex = Math.floor(Math.random() * choices.length);
        const choice = choices[randomIndex];

        if (choice) {
            choice.scrollIntoView({ behavior: "smooth", block: "center" });
            choice.click();
        }
    }

    function clickNextIfEnabled() {
        const nextButton = document.querySelector("button.next");
        if (nextButton && !nextButton.disabled) {
            nextButton.scrollIntoView({ behavior: "smooth", block: "center" });
            nextButton.click();
        }
    }

    function autoAnswer() {
        try {
            clickRandomChoice();
            setTimeout(clickNextIfEnabled, 500);
        } catch (err) {
            console.error("SBAuto error:", err);
        }
    }

    window.addEventListener('load', () => {
        setInterval(autoAnswer, interval);
    });
})();


