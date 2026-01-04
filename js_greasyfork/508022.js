// ==UserScript==
// @name            Toonio Audio Downloader
// @name:ru         Toonio Audio Downloader
// @namespace       nland.fun
// @version         1.0
// @description     Audio Downloader from Toon
// @description:ru  Скачивание Озвучки из Мульта
// @author          MrVladar (@vlad246YT)
// @match           https://toonio.ru/t/*
// @match           https://en.toonio.ru/t/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=toonio.ru
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/508022/Toonio%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/508022/Toonio%20Audio%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createDownloadButton(audioUrl, fileName, buttonText) {
        const button = document.createElement('a');
        button.className = 'nav';
        button.href = audioUrl;
        button.download = fileName;
        button.innerHTML = `<span class="far fa-music"></span>${buttonText}`;
        return button;
    }

    const iframe = document.getElementById('player');
    if (iframe) {
        const src = iframe.getAttribute('src');
        const audioParam = new URLSearchParams(src.split('?')[1]).get('audio');
        if (audioParam) {
            const currentDomain = window.location.hostname;
            const audioUrl = `https://${currentDomain}/Toons/audio/${audioParam}`;
            const buttonText = currentDomain === 'en.toonio.ru' ? 'Download audio' : 'Скачать озвучку';
            const musicTitleElement = document.querySelector('h3.music');
            let fileName = 'audio.mp3';
            if (musicTitleElement) {
                fileName = musicTitleElement.textContent.trim() + '.mp3';
            }

            const actionBlocks = document.querySelectorAll('.toon_actions');
            actionBlocks.forEach(block => {
                const downloadButton = createDownloadButton(audioUrl, fileName, buttonText);
                block.appendChild(downloadButton);
            });
        }
    }
})();
