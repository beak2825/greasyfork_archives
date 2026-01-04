// ==UserScript==
// @name         Twitch Clip Downloader
// @description  Quick and easy way to download Twitch Clips.
// @version      1.2
// @author       yungsamd17
// @namespace    https://github.com/yungsamd17/UserScripts
// @license      MIT License
// @icon         https://raw.githubusercontent.com/yungsamd17/UserScripts/main/scripts/icons/Twitch-Clip-Downloader.png
// @match        https://www.twitch.tv/*
// @match        https://clips.twitch.tv/*
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/475206/Twitch%20Clip%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/475206/Twitch%20Clip%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create the button
    function createButton() {
        const targetClass = '[class*="Layout-sc-1xcs6mc-0"][class*="player-controls__right-control-group"]';
        const targetElement = document.querySelector(targetClass);
        if (!targetElement) {
            // if target element is not found, remove any existing button
            removeButton();
            return;
        }
        // check if we are on a clip page
        const isClipPage = window.location.href.includes('/clip/') || window.location.href.includes('clips.twitch.tv');
        if (!isClipPage) {
            removeButton();
            return;
        }
        // check if the button already exists
        const existingButton = document.querySelector('.twitchdownload-button');
        if (existingButton) {
            return;
        }

        // button CSS style
        const customStyles = `
            .twitchdownload-button {
                background-color: #9147ff;
                border: none;
                border-radius: 0.4rem;
                margin-right: 6px;
                padding: 5px 2px 5px 2px;
                cursor: pointer;
                width: auto;
                height: 30px;
                display: inline-block;
                align-items: center;
            }
            .twitchdownload-button:hover {
                background-color: #772ce8;
            }
            .twitchdownload-button:active {
                background-color: #5c16c5;
            }
            .twitchdownload-button:focus {
                background-color: #5c16c5;
            }
            .button-text {
                color: white;
                margin: 0 6px 0 6px;
                font-weight: bold;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = customStyles;
        document.head.appendChild(styleElement);

        // create the button and insert it
        const divWrapper = document.createElement('div');
        divWrapper.className = 'twitch-clip-downloader-userscript';
        const button = document.createElement('button');
        const buttonText = document.createElement('span');
        buttonText.textContent = 'Download'; // button Text
        button.className = 'twitchdownload-button';
        // button click event listener
        button.addEventListener('click', downloadClip);
        buttonText.className = 'button-text';
        button.appendChild(buttonText);
        divWrapper.appendChild(button);
        // insert the div wrapper before the last child
        targetElement.insertBefore(divWrapper, targetElement.firstChild);
    }

    // function to remove the button
    function removeButton() {
        const existingButton = document.querySelector('.twitchdownload-button');
        if (existingButton) {
            existingButton.remove();
        }
    }

    // function to download Twitch clip
    function downloadClip() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            const videoURL = videoElement.src;
            const downloadLink = document.createElement('a');
            downloadLink.href = videoURL;
            downloadLink.click();
        }
    }

    // MutationObserver to watch for DOM changes
    const observer = new MutationObserver(createButton);
    const observerOptions = {
        childList: true,
        subtree: true,
    };
    observer.observe(document.body, observerOptions);

    createButton();
})();
