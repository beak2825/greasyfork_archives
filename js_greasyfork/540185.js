// ==UserScript==
// @name         Twitch Screenshot
// @description  Adds a button with screenshot icon to the Player to enable you to copy to clipboard/download screenshots.
// @version      1.9
// @author       ddevv15
// @license      MIT License
// @match        https://www.twitch.tv/*
// @match        https://player.twitch.tv/*
// @match        https://embed.twitch.tv/*
// @grant        GM_download
// @grant        GM_clipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/1486302
// @downloadURL https://update.greasyfork.org/scripts/540185/Twitch%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/540185/Twitch%20Screenshot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create the button
    function createButton() {
        const isClipsPage = window.location.href.includes('/clip/') || window.location.href.includes('clips.twitch.tv');
        if (isClipsPage) {
            // remove the button on clips pages
            removeButton();
            return;
        }

        const targetClass = '[class*="Layout-sc-1xcs6mc-0"][class*="player-controls__right-control-group"]';
        const targetElement = document.querySelector(targetClass);
        if (!targetElement) {
            // if target element is not found, remove any existing button
            removeButton();
            return;
        }

        // check if the button already exists
        const existingButton = document.querySelector('.screenshot-button');
        if (existingButton) {
            return; // exit if the button already exists
        }

        // button CSS style
        const customStyles = `
            .screenshot-button {
                border: none;
                border-radius: 0.4rem;
                padding: 2px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .screenshot-button:hover {
                background-color: rgba(255,255,255,.13);
            }
            .screenshot-button:active {
                background-color: rgba(255,255,255,.16);
            }
            .screenshot-button:focus {
                background-color: rgba(255,255,255,.13);
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = customStyles;
        document.head.appendChild(styleElement);

        // create the button and add insert it
        const divWrapper = document.createElement('div');
        divWrapper.className = 'twitch-screenshot-userscript';
        const button = document.createElement('button');
        button.title = 'Take a screenshot (Alt+S)'; // button hover text
        const buttonIcon = `
            <svg width="21" height="21" viewBox="0 0 24 24" class="button-icon">
                <path fill="#ffffff" d="M17.25,3C19.3210678,3,21,4.67893219,21,6.75L21,17.25C21,19.3210678,19.3210678,21,17.25,21L6.75,21C4.67893219,21,3,19.3210678,3,17.25L3,6.75C3,4.67893219,4.67893219,3,6.75,3L17.25,3ZM17.25,4.5L6.75,4.5C5.50735931,4.5,4.5,5.50735931,4.5,6.75L4.5,17.25C4.5,18.4926407,5.50735931,19.5,6.75,19.5L17.25,19.5C18.4926407,19.5,19.5,18.4926407,19.5,17.25L19.5,6.75C19.5,5.50735931,18.4926407,4.5,17.25,4.5ZM17.25,13C17.6642136,13,18,13.3357864,18,13.75L18,16C18,17.1046,17.1046,18,16,18L13.75,18C13.3357864,18,13,17.6642136,13,17.25C13,16.8357864,13.3357864,16.5,13.75,16.5L16,16.5C16.2761,16.5,16.5,16.2761,16.5,16L16.5,13.75C16.5,13.3357864,16.8357864,13,17.25,13ZM6.75,13C7.16421356,13,7.5,13.3357864,7.5,13.75L7.5,16C7.5,16.2761,7.72386,16.5,8,16.5L10.25,16.5C10.6642136,16.5,11,16.8357864,11,17.25C11,17.6642136,10.6642136,18,10.25,18L8,18C6.89543,18,6,17.1046,6,16L6,13.75C6,13.3357864,6.33578644,13,6.75,13ZM8,6L10.25,6C10.6642136,6,11,6.33578644,11,6.75C11,7.12969577,10.7178461,7.44349096,10.3517706,7.49315338L10.25,7.5L8,7.5C7.75454222,7.5,7.5503921,7.67687704,7.50805575,7.91012499L7.5,8L7.5,10.25C7.5,10.6642136,7.16421356,11,6.75,11C6.37030423,11,6.05650904,10.7178461,6.00684662,10.3517706L6,10.25L6,8C6,6.94563773,6.81587733,6.08183483,7.85073759,6.00548573L8,6L10.25,6L8,6ZM16,6C17.1046,6,18,6.89543,18,8L18,10.25C18,10.6642136,17.6642136,11,17.25,11C16.8357864,11,16.5,10.6642136,16.5,10.25L16.5,8C16.5,7.72386,16.2761,7.5,16,7.5L13.75,7.5C13.3357864,7.5,13,7.16421356,13,6.75C13,6.33578644,13.3357864,6,13.75,6L16,6Z"></path>
            </svg>
        `;
        button.className = 'screenshot-button';

        // button click event listener
        button.addEventListener('click', captureScreenshot);
        button.innerHTML = buttonIcon;
        divWrapper.appendChild(button);
        // insert the div wrapper as the second-to-last child
        const children = targetElement.children;
        if (children.length >= 2) {
            targetElement.insertBefore(divWrapper, children[children.length - 2]);
        } else {
            targetElement.appendChild(divWrapper);
        }
    }

    // function to remove the button
    function removeButton() {
        const existingButton = document.querySelector('.screenshot-button');
        if (existingButton) {
            existingButton.remove();
        }
    }

    // capture and copy/download a screenshot
    async function captureScreenshot() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            try {
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                console.log("%cTwitch Screenshot:", "color: #9147ff", "Screenshot copied to clipboard.");
            } catch (error) {
                console.log("%cTwitch Screenshot: Screenshot failed to copy to clipboard!", "color: #ff8080");
            }

            const dataURL = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = `Twitch-Screenshot.png`;
            downloadLink.click();
        }
    }

    // event listener for Alt + S screenshot shortcut
    window.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 's' || event.key === 'S') {
            captureScreenshot();
        }
    });

    // MutationObserver to watch for DOM changes
    const observer = new MutationObserver(createButton);
    const observerOptions = {
        childList: true,
        subtree: true,
    };
    observer.observe(document.body, observerOptions);

    createButton();
})();
