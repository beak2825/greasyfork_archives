// ==UserScript==
// @name         MyInstants Download Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a Download button to each instant sound on MyInstants website.
// @author       Cryptophunk
// @match        https://www.myinstants.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472025/MyInstants%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/472025/MyInstants%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the "Download" button
    function addDownloadButton(instantContainer) {
        const audioSrc = instantContainer.querySelector('button.small-button').getAttribute('onclick').match(/play\('([^']+)'/)[1];
        const audioTitle = instantContainer.querySelector('.instant-link').textContent;

        const downloadButton = document.createElement('a');
        downloadButton.setAttribute('class', 'instant-action-button');
        downloadButton.setAttribute('title', 'Download');
        downloadButton.setAttribute('href', audioSrc);
        downloadButton.setAttribute('download', `${audioTitle}.mp3`);

        const downloadIcon = document.createElement('img');
        downloadIcon.setAttribute('class', 'instant-action-button-icon');
        downloadIcon.setAttribute('src', '/media/images/icons/save.svg');
        downloadIcon.setAttribute('alt', 'Download icon');

        downloadButton.appendChild(downloadIcon);

        const shareBox = instantContainer.querySelector('.result-page-instant-sharebox');
        shareBox.insertBefore(downloadButton, shareBox.lastChild);
    }

    // Find all instant containers and add the "Download" button to each
    const instantContainers = document.querySelectorAll('.instant');
    instantContainers.forEach(addDownloadButton);
})();
