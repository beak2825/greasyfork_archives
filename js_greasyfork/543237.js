// ==UserScript==
// @name         Yandex Music OBS Info
// @name:ru      Yandex Music OBS Info
// @author       Obektev
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Sends current Yandex Music song info to local server
// @description:ru  Отправляет информацию о текущей музыке с Yandex Music на локальный сервер
// @match        https://music.yandex.by/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543237/Yandex%20Music%20OBS%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/543237/Yandex%20Music%20OBS%20Info.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Gets song info from website
    function getSongInfo() {
        // Yandex Music devs can change these in the future. If so, report to main repo on GitHub.
        const artist = document.querySelector('[class*="Meta_artistCaption"]').innerText || '';
        const title = document.querySelector('[class*="Meta_title"]').getElementsByTagName('div')[0].getElementsByTagName('a')[0].getElementsByTagName('span')[0].innerText || '';
        const cover = document.querySelector('[class*="PlayerBarDesktopWithBackgroundProgressBar_cover"]').getElementsByTagName('img')[0].src || '';

        const isPaused = document.querySelectorAll('[class*="BaseSonataControlsDesktop_sonataButton"]')[3].ariaLabel == "Playback" || false;

        return { title, artist, cover, isPaused };
    }

    // Sends info about music to local server
    function sendNowPlaying() {
        const info = getSongInfo();

        console.log(info.artist + ' ' + info.title + ' ');

        if (info.title && info.artist) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:3000/update",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(info),
                onerror: (e) => console.warn("CSP-safe request failed:", e),
            });
        }
    }

    setInterval(sendNowPlaying, 1000);
})();
