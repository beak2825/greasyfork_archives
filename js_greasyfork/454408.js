// ==UserScript==
// @name         GeoGuessr Quick Next Round
// @namespace    leopoldwigbratt.com
// @version      1.1.2
// @license      MIT
// @description  Press the spacebar to start a round or to go to the next round
// @author       Leopold Wigbratt
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @downloadURL https://update.greasyfork.org/scripts/454408/GeoGuessr%20Quick%20Next%20Round.user.js
// @updateURL https://update.greasyfork.org/scripts/454408/GeoGuessr%20Quick%20Next%20Round.meta.js
// ==/UserScript==

const validPaths = ["maps", "game", "country-streak", "us-state-streak", "daily-challenges", "challenge"];

document.addEventListener('keypress', e => {
    if (e.keyCode === 32) {
        const button = document.querySelector('.button_variantPrimary__xc8Hp');
        const path = document.location.pathname;
        if (validPaths.every(p => !RegExp(`\/${p}.*`).test(path))) return;
        if (button && !button.parentNode.classList.contains('guess-map__guess-button')) {
            e.preventDefault();
            button.click();
            console.log('Saluī!');
        }
    }
});