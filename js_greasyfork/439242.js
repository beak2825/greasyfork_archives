// ==UserScript==
// @name         Autowin Wordle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  FULL CREDIT TO JSBITS
// @author       You
// @match        https://www.powerlanguage.co.uk/wordle/
// @icon         https://www.google.com/s2/favicons?domain=powerlanguage.co.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439242/Autowin%20Wordle.user.js
// @updateURL https://update.greasyfork.org/scripts/439242/Autowin%20Wordle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const solution = JSON.parse(localStorage.gameState).solution;
    const app = document.querySelector('game-app');
    const keyboard = app.shadowRoot.querySelector('game-keyboard');
    const keyboardRoot = keyboard.shadowRoot;
    function keyPress(letter) {
        const btnSel = `button[data-key="${letter}"]`;
        const btn = keyboardRoot.querySelector(btnSel);
        btn.click();
    }
    solution.split('').forEach(keyPress);
    const enterBtnSel = 'button[data-key="↵"]';
    keyboardRoot.querySelector(enterBtnSel).click();
})();