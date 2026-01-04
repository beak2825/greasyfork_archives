// ==UserScript==
// @name         Grundos Cafe Tyranu Evavu Keys
// @namespace    https://greasyfork.org/en/users/1376035-geezaac
// @version      v1.0
// @description  Press E(vavu) or T(yranu) to guess. Press Space Bar to Start Over or Start Game.
// @author       Isaac
// @match        https://www.grundos.cafe/games/tyranuevavu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511807/Grundos%20Cafe%20Tyranu%20Evavu%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/511807/Grundos%20Cafe%20Tyranu%20Evavu%20Keys.meta.js
// ==/UserScript==

(function() {
	'use strict';

    // Helper function to find and click a button
    const clickButton = (selector) => {
        const button = document.querySelector(selector);
        if (button) {
            button.click();
        }
    };

    document.addEventListener("keydown", (event) => {
        switch (event.key.toLowerCase()) {
            case 'e':
                // Trigger click on lower button
                clickButton('input[name="lower"][value="lower"]');
                break;

            case 't':
                // Trigger click on higher button
                clickButton('input[name="higher"][value="higher"]');
                break;

            case ' ':
                event.preventDefault();
                // Try clicking "Play Again" button first, then "Play Now!"
                clickButton('input.form-control[value="Play Again"]') ||
                clickButton('input.form-control[value="Play Now!"]');
                break;
        }
    });
})();