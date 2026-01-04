// ==UserScript==
// @name         Ironwood RPG - Quests Temptation Control
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Automatically disables and re-enables Quests
// @author       shiroinegai
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499964/Ironwood%20RPG%20-%20Quests%20Temptation%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/499964/Ironwood%20RPG%20-%20Quests%20Temptation%20Control.meta.js
// ==/UserScript==

(() => {
    let questsButton
    let secondsToReset

    function locateQuestsButton() {
        const main = setInterval(() => {
            questsButton = document.querySelector('[routerlink="/quests"]');}, 10)
        if (questsButton) { clearInterval(main) }
    }

    function disableQuestsButton() {
        const main = setInterval(() => {
            if (questsButton) {
                questsButton.setAttribute('disabled', 'disabled');
                questsButton.querySelector('.new').innerText = '⛔'
                clearInterval(main)
            }
        }, 10)
    }

    function enableQuestsButtonNearReset() {
        const main = setInterval(() => {
            const now = new Date();
            const hours = now.getUTCHours();
            const minutes = now.getUTCMinutes();
            const seconds = now.getUTCSeconds();

            secondsToReset = (23 - hours) * 3600 + (59 - minutes) * 60 + (60 - seconds);

            if (secondsToReset <= 3600) {
                questsButton.removeAttribute('disabled');
                questsButton.querySelector('.new').innerText = 'New'
                clearInterval(main)
            }
        }, 1000)
    }

    locateQuestsButton();
    disableQuestsButton();
    enableQuestsButtonNearReset();
})()
