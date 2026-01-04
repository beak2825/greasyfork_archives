// ==UserScript==
// @name         web.ligaudio.ru Safe dowloader
// @namespace    epicmorg.ligaudioru.downloader
// @version      1.0.0.2
// @description  Download files with safe without annoying ads
// @license      MIT
// @author       EpicMorg DevTeam
// @grant        unsafeWindow
// @match        *://web.ligaudio.ru/*
// @match        *://web.ligaudio.ru/mp3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ligaudio.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486973/webligaudioru%20Safe%20dowloader.user.js
// @updateURL https://update.greasyfork.org/scripts/486973/webligaudioru%20Safe%20dowloader.meta.js
// ==/UserScript==
//
// Url: https://greasyfork.org/ru/scripts/486973-web-ligaudio-ru-safe-dowloader
//

(function() {
    document.querySelectorAll('a').forEach(function(link) {
        if (link.href.toLowerCase().endsWith('.mp3')) {
            link.href += '?play';
        }
    });
})();
