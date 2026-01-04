// ==UserScript==
// @name         Memrise Simple Auto Learn
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  When enabled, memrise will auto learn. Make sure audio tests and tapping tests are disabled before using.
// @author       Ben Jenkins
// @match        https://app.memrise.com/aprender/learn*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=memrise.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441026/Memrise%20Simple%20Auto%20Learn.user.js
// @updateURL https://update.greasyfork.org/scripts/441026/Memrise%20Simple%20Auto%20Learn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        // Get the 4 answer buttons
        const answerButtons = document.querySelectorAll('div[data-testid="testLearnableCard"] button')

        const nextButton = document.querySelector('button[data-testid="next-button"]')

        const learnLink = document.querySelector('a[aria-label="learn"]')

        const toggleDifficultButton = document.querySelector('button[aria-label="toggle-difficultWords"]')

        const DIFFICULT_YELLOW = 'rgb(255, 187, 0)'

        // the path will be yellow if the word is difficult
        const difficultWordPath = document.querySelector('g[id="Difficult Words"] > path')
        const difficultPathFillColor = getComputedStyle(difficultWordPath).fill

        const isDifficult = difficultPathFillColor == DIFFICULT_YELLOW

        if (isDifficult) {
          // If the question is marked difficult, mark it normal again
          toggleDifficultButton.click()
        } else if (answerButtons.length > 0) {
            // if answer buttons exist click one at random
            const randomIndex = Math.floor(Math.random() * answerButtons.length)
            const randomAnswerButton = answerButtons[randomIndex]
            randomAnswerButton.click()
        } else if (nextButton) {
            // if there is a next button, click it
            nextButton.click()
        } else if (learnLink) {
            // if there is a learn new words button, click it
            learnLink.click()
        }

    }, 50)

})();