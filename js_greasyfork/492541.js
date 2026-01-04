// ==UserScript==
// @name           Simple Suno Downloader
// @name:ru        Simple Suno Downloader
// @namespace      https://github.com/WolfySoCute
// @version        2024-04-14
// @description    Simple suno music downloader
// @description:ru Простой загрузчик музыки с сайта suno
// @author         Wolfy
// @match          https://suno.com/*
// @icon           https://suno.com/favicon.ico
// @grant          none
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492541/Simple%20Suno%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/492541/Simple%20Suno%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let blobUrl;

    function editButton(button, audio, node) {
        if (blobUrl) URL.revokeObjectURL(blobUrl);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', audio.src, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            if (xhr.status === 200) {
                const blob = new Blob([xhr.response], { type: 'audio/mpeg' });
                blobUrl = URL.createObjectURL(blob);

                const authorNode = document.getElementsByClassName("css-dw5ttn")[0].childNodes[0];
                const titleNode = document.getElementsByClassName("css-idoyen")[0];

                button.href = blobUrl;
                button.download = `${authorNode.textContent} - ${titleNode.textContent}.mp3`;
                node.appendChild(button);
            }
        };

        xhr.send();
    }

    function startScript() {
        const downloadButton = document.createElement("a");
        downloadButton.setAttribute("data-theme", "dark");
        downloadButton.setAttribute("aria-label", "Download");
        downloadButton.classList.add("chakra-button", "css-o244em");
        downloadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="#ffffff"/></svg>';

        const buttonsNode = document.getElementsByClassName("css-18y9vo3")[0];
        const audioNode = document.getElementById("active-audio-play");

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "attributes") {
                    editButton(downloadButton, audioNode, buttonsNode)
                }
            }
        };

        const config = { attributes: true };

        const observer = new MutationObserver(callback);
        observer.observe(audioNode, config);

        if (audioNode.src) {
            editButton(downloadButton, audioNode, buttonsNode)
        }
    }

    setTimeout(() => {
        startScript();
    }, 2000)
})();