// ==UserScript==
// @name         Music Yandex Playback Automation
// @description  Automate playback on music.yandex.ru
// @namespace    MusicYandexPlaybackAutomation
// @version      1.1.2
// @author       CriDos
// @match        https://music.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456501/Music%20Yandex%20Playback%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/456501/Music%20Yandex%20Playback%20Automation.meta.js
// ==/UserScript==

const PAUSE_DURATION = 5 * 1000; // 5 seconds

setInterval(() => {
    console.log("Resuming script execution");

    const buttonPlay = document.querySelector('.player-controls__btn.player-controls__btn_play');
    if (buttonPlay && !buttonPlay.classList.contains('player-controls__btn_pause')) {
        buttonPlay.click();
    }

    console.log("Pausing for " + PAUSE_DURATION + " milliseconds");
}, PAUSE_DURATION);