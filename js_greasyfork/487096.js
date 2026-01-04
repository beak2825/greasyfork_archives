// ==UserScript==
// @name         puhutv Resume Where You Left
// @namespace    puhutvResumeWhereYouLeft
// @version      1.0.0
// @description  Resume Where You Left on puhutv
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        https://puhutv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=puhutv.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/487096/puhutv%20Resume%20Where%20You%20Left.user.js
// @updateURL https://update.greasyfork.org/scripts/487096/puhutv%20Resume%20Where%20You%20Left.meta.js
// ==/UserScript==

console.log("puhutvResumeWhereYouLeft");

window.addEventListener('load', () => {
    setInterval(() => {
        const vid = document.querySelector('#dyg-player-new-player_html5_api');
        const videoUrl = window.location.href;

        localStorage.setItem(videoUrl, vid.currentTime);
        console.log("Watch time saved:", vid.currentTime);
    }, 10000);

    const videoUrl = window.location.href;
    const savedWatchedTime = localStorage.getItem(videoUrl);

    if (savedWatchedTime) {
        const vid = document.querySelector('#dyg-player-new-player_html5_api');

        vid.currentTime = parseFloat(savedWatchedTime);
        console.log("Resumed from", savedWatchedTime);
    }
});