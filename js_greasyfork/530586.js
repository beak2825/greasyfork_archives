// ==UserScript==
// @name        001
// @namespace   Violentmonkey Scripts
// @match       https://jyqx.online/*
// @match       https://fazy.online/*
// @match       https://whatgame.xyz/*
// @match       https://qyix.online/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/8/2025, 11:28:25 PM
// @downloadURL https://update.greasyfork.org/scripts/530586/001.user.js
// @updateURL https://update.greasyfork.org/scripts/530586/001.meta.js
// ==/UserScript==
function clickButtonWithDelay(cssSelector, delay) {
    setTimeout(() => {
        const button = document.querySelector(cssSelector);
        if (button) {
            button.click();
        } else {
            console.log('Button not found!');
        }
    }, delay);
}

// Example usage: Click the button with a 2-second delay (2000 milliseconds)
clickButtonWithDelay('#next', 20000);
