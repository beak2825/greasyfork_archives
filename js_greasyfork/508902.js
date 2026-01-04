// ==UserScript==
// @name         YouTube Music Bulk Unlike Tool
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bulk unlike all songs in YouTube Music liked songs playlist
// @match        https://music.youtube.com/playlist?list=LM
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508902/YouTube%20Music%20Bulk%20Unlike%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/508902/YouTube%20Music%20Bulk%20Unlike%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function unlikeAllSongs() {
        let unlikedCount = 0;
        let failedCount = 0;
        let noProgressCount = 0;
        let lastHeight = 0;

        updateStatus(`Starting process...`);

        while (true) {
            const likeButtons = document.querySelectorAll('tp-yt-paper-icon-button.like[aria-pressed="true"]');
            let currentUnliked = 0;

            for (let button of likeButtons) {
                try {
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await sleep(300);
                    button.click();
                    unlikedCount++;
                    currentUnliked++;
                    updateStatus(`Unliked: ${unlikedCount} | Failed: ${failedCount}`);
                    await sleep(300);
                } catch (error) {
                    console.error(`Failed to unlike a song: ${error}`);
                    failedCount++;
                }
            }

            if (currentUnliked === 0) {
                noProgressCount++;
            } else {
                noProgressCount = 0;
            }

            const scrollContainer = document.querySelector('ytmusic-playlist-shelf-renderer');
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
            await sleep(1000);

            if (scrollContainer.scrollHeight === lastHeight) {
                noProgressCount++;
            }
            lastHeight = scrollContainer.scrollHeight;

            if (noProgressCount > 10) {
                break; 
            }
        }

        updateStatus(`Completed! Unliked: ${unlikedCount} | Failed: ${failedCount}`);
    }

    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Unlike All Songs';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #ff0000;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'YouTube Sans', sans-serif;
            font-weight: bold;
            transition: background-color 0.3s;
        `;
        button.addEventListener('mouseover', () => button.style.backgroundColor = '#cc0000');
        button.addEventListener('mouseout', () => button.style.backgroundColor = '#ff0000');
        button.addEventListener('click', unlikeAllSongs);
        return button;
    }

    function createStatusDisplay() {
        const display = document.createElement('div');
        display.id = 'unlike-status';
        display.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 5px;
            font-family: 'YouTube Sans', sans-serif;
            font-size: 14px;
        `;
        return display;
    }

    function updateStatus(message) {
        const display = document.getElementById('unlike-status') || createStatusDisplay();
        display.textContent = message;
        document.body.appendChild(display);
    }

    document.body.appendChild(createButton());
})();