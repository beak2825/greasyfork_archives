// ==UserScript==
// @name         Always Typing Prank
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @version      1.1
// @description  Injects a draggable UI to send Discord typing indicators at random intervals (20-45s), auto-populates channel ID, stores token persistently with expiry, shows time until next typing, and has a toggle button.
// @author       Anonymous
// @match        https://discord.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536291/Always%20Typing%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/536291/Always%20Typing%20Prank.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2024 Anonymous

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const injectUI = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #discord-typing-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #1a1a1a;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                max-width: 350px;
                font-family: 'Arial', sans-serif;
                color: #ddd;
                resize: both;
                overflow: auto;
            }

            #discord-typing-container .header {
                padding: 8px 10px;
                background-color: #2a2a2a;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                cursor: grab;
                border-bottom: 1px solid #444;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #discord-typing-container .header span {
                 cursor: pointer;
                 font-size: 18px;
                 line-height: 1;
            }

            #discord-typing-container .form-row {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 8px;
                align-items: center;
            }

            #discord-typing-container label {
                font-size: 12px;
                margin-right: 5px;
                white-space: nowrap;
                color: #bbb;
            }

            #discord-typing-container input[type="text"],
            #discord-typing-container input[type="password"],
            #discord-typing-container input[type="number"] {
                background-color: #333;
                color: #eee;
                border-radius: 3px;
                border: 1px solid #555;
                padding: 4px 8px;
                height: 24px;
                flex-grow: 1;
                font-size: 12px;
            }

             #discord-typing-container input[type="text"]:focus,
             #discord-typing-container input[type="password"]:focus,
             #discord-typing-container input[type="number"]:focus {
                 outline: none;
                 border-color: #5e5e5e;
             }


            #discord-typing-container button {
                color: #fff;
                background-color: #555;
                border: 1px solid #666;
                border-radius: 3px;
                font-size: 12px;
                padding: 4px 10px;
                cursor: pointer;
                transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
            }

            #discord-typing-container button:hover {
                background-color: #666;
                border-color: #777;
            }

            #discord-typing-container button#startButton {
                 background-color: #43b581;
                 border-color: #5acb9a;
                 flex-grow: 1;
            }
             #discord-typing-container button#startButton:hover {
                 background-color: #5acb9a;
                 border-color: #43b581;
            }

            #discord-typing-container button#stopButton {
                 background-color: #f04747;
                 border-color: #ff6b6b;
                 flex-grow: 1;
            }
            #discord-typing-container button#stopButton:hover {
                 background-color: #ff6b6b;
                 border-color: #f04747;
            }

             #discord-typing-container button#getToken-button {
                 background-color: #7289da;
                 border-color: #8a9de9;
             }
              #discord-typing-container button#getToken-button:hover {
                 background-color: #8a9de9;
                 border-color: #7289da;
             }


            #discord-typing-container hr {
                border-color: rgba(255, 255, 255, 0.1);
                margin: 10px 0;
            }

            #discord-typing-container #status {
                margin-top: 8px;
                text-align: center;
                font-size: 11px;
                color: #bbb;
            }

            #typing-toggle-button {
                margin: 0 8px !important;
                cursor: pointer;
                color: var(--interactive-normal);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                padding: 0;
                background: none;
                border: none;
            }
             #typing-toggle-button:hover {
                 color: var(--interactive-hover);
             }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'discord-typing-container';
        container.style.display = 'none';

        const header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = `
            Typing Indicator
            <span id="minimize-toggle">-</span>
        `;
        container.appendChild(header);

        const contentContainer = document.createElement('div');
        contentContainer.id = 'typing-content-container';
        contentContainer.style.display = '';
        container.appendChild(contentContainer);

        const formContent = `
            <div class="form-row">
                <label for="typing-token">Token:</label>
                <input type="password" id="typing-token" placeholder="Enter your token">
                <button id="get-token-button">Get Token</button>
            </div>

            <div class="form-row">
                <label for="typing-channelId">Channel ID:</label>
                <input type="text" id="typing-channelId" placeholder="Enter channel ID">
            </div>

            <div class="form-row">
                <label for="typing-interval">Interval (10s - 25s):</label>
                <input type="number" id="typing-interval" value="10" min="10" max="17" style="width: 60px;" disabled> </div>

            <hr>

            <div class="form-row">
                <button id="startButton">Start Typing</button>
                <button id="stopButton" disabled>Stop</button>
            </div>

            <div id="status">Status: Idle</div>
        `;

        contentContainer.innerHTML = formContent;
        document.body.appendChild(container);

        const tokenInput = document.getElementById('typing-token');
        const channelIdInput = document.getElementById('typing-channelId');
        const intervalInput = document.getElementById('typing-interval');
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        const statusDiv = document.getElementById('status');
        const minimizeToggle = document.getElementById('minimize-toggle');
        const getTokenButton = document.getElementById('get-token-button');

        let typingTimeout = null;
        let typingActive = false; // Flag to control the typing loop
        let countdownInterval = null;
        let timeRemaining = 0;

        // Load Token from Storage on Script Load
        const loadToken = () => {
            const storedTokenData = GM_getValue('discord_typing_token', null);
            if (storedTokenData) {
                const { token, timestamp } = storedTokenData;
                const now = Date.now();
                const expiryTime = 60 * 60 * 1000; // 1 hour in milliseconds

                if (now - timestamp < expiryTime) {
                    tokenInput.value = token;
                    console.log('Loaded token from storage.');
                    statusDiv.textContent = 'Status: Token loaded from storage.';
                } else {
                    console.log('Stored token expired.');
                    statusDiv.textContent = 'Status: Stored token expired.';
                    GM_setValue('discord_typing_token', null);
                }
            }
        };

        // Minimize/Maximize Functionality
        minimizeToggle.addEventListener('click', () => {
            const isHidden = contentContainer.style.display === 'none';
            contentContainer.style.display = isHidden ? '' : 'none';
            minimizeToggle.textContent = isHidden ? '-' : '+';
            container.style.height = isHidden ? 'auto' : '';
            container.style.padding = isHidden ? '10px' : '10px';
        });

        // Draggable Functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener("mousedown", dragStart, false);
        document.addEventListener("mouseup", dragEnd, false);
        document.addEventListener("mousemove", drag, false);

        function dragStart(e) {
            if (e.target === header || e.target.parentNode === header) {
                 initialX = e.clientX - xOffset;
                 initialY = e.clientY - yOffset;
                 isDragging = true;
                 container.style.cursor = 'grabbing';
                 header.style.cursor = 'grabbing';
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            container.style.cursor = 'grab';
            header.style.cursor = 'grab';
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, container);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

        // Get Token Button Logic
        getTokenButton.addEventListener('click', () => {
            try {
                // Use the iframe technique to access local storage
                const ls = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
                const token = ls.getItem('token');
                if (token) {
                    const cleanToken = token.replace(/^"|"$/g, '');
                    tokenInput.value = cleanToken;
                    const now = Date.now();
                    // Store token and timestamp persistently using GM_setValue
                    GM_setValue('discord_typing_token', { token: cleanToken, timestamp: now });
                    console.log('Token retrieved and stored successfully.');
                     statusDiv.textContent = 'Status: Token retrieved and stored.';
                } else {
                    console.warn('Discord token not found in local storage.');
                    alert('Discord token not found in local storage. Please log in to Discord or try again.');
                     statusDiv.textContent = 'Status: Token not found.';
                }
                 // Clean up the temporary iframe
                document.body.lastChild.remove();
            } catch (e) {
                console.error('Error getting Discord token:', e);
                alert('Could not retrieve Discord token. Please ensure you are logged in to Discord.');
                 statusDiv.textContent = 'Status: Error retrieving token.';
            }
        });

        // Auto-populate Channel ID on URL Change
        const updateChannelId = () => {
            const match = location.href.match(/channels\/[\w@]+\/(\d+)/);
            if (match && match[1]) {
                channelIdInput.value = match[1];
            }
        };

        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (lastUrl !== location.href) {
                lastUrl = location.href;
                updateChannelId();
            }
        });
        urlObserver.observe(document.body, { subtree: true, childList: true });

        // Script Logic
        const startCountdown = (duration) => {
             timeRemaining = Math.ceil(duration / 1000);
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }

            countdownInterval = setInterval(() => {
                timeRemaining--;
                if (timeRemaining < 0) timeRemaining = 0;
                 if (typingActive) {
                     statusDiv.textContent = `Status: Typing... (Next in ${timeRemaining}s)`;
                 }
                 if (timeRemaining <= 0 && typingActive) {
                     clearInterval(countdownInterval);
                     countdownInterval = null; // Clear interval when countdown finishes
                     statusDiv.textContent = `Status: Typing... (Sending now)`; // Update status right before sending
                 }
            }, 1000);
        };


        const sendTypingIndicator = async (token, channelId) => {
            const url = `https://discord.com/api/v9/channels/${channelId}/typing`;

            const headers = new Headers();
            headers.append('accept', '*/*');
            headers.append('accept-encoding', 'gzip, deflate, br');
            headers.append('authorization', token);
            headers.append('origin', 'https://discord.com');
            headers.append('sec-ch-ua', '"Not?A_Brand";v="8", "Chromium";v="108"');
            headers.append('user-agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9013 Chrome/108.0.5359.215 Electron/22.3.2 Safari/537.36');

            const requestOptions = {
                method: 'POST',
                headers: headers,
                redirect: 'follow'
            };

            try {
                const response = await fetch(url, requestOptions);

                if (response.ok) {
                    console.log('Typing event sent successfully.');
                } else {
                    console.error('Failed to send typing event:', response.status, response.statusText);
                    statusDiv.textContent = `Status: Error sending typing event (${response.status})`;
                }
            } catch (error) {
                console.error('Error sending typing event:', error);
                statusDiv.textContent = `Status: Network error`;
            }

            if (typingActive) {
                const randomInterval = getRandomInt(10, 17) * 1000;
                console.log(`Next typing event in ${randomInterval / 1000} seconds.`);

                startCountdown(randomInterval);

                typingTimeout = setTimeout(() => {
                    sendTypingIndicator(token, channelId);
                }, randomInterval);
            } else {
                 if (countdownInterval) {
                     clearInterval(countdownInterval);
                     countdownInterval = null;
                 }
            }
        };

        const startTyping = () => {
            const token = tokenInput.value.trim();
            const channelId = channelIdInput.value.trim();

            if (!token || !channelId) {
                alert('Please ensure Token and Channel ID are filled.');
                return;
            }

            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
             if (countdownInterval) {
                clearInterval(countdownInterval);
            }

            typingActive = true;
            sendTypingIndicator(token, channelId);

            startButton.textContent = 'Typing Started';
            stopButton.disabled = false;
            startButton.disabled = true;
            statusDiv.textContent = 'Status: Sending first event...';
        };

        const stopTyping = () => {
            typingActive = false;
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                typingTimeout = null;
            }
             if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            startButton.textContent = 'Start Typing';
            stopButton.disabled = true;
            startButton.disabled = false;
            statusDiv.textContent = 'Status: Stopped';
        };

        startButton.addEventListener('click', startTyping);
        stopButton.addEventListener('click', stopTyping);

        statusDiv.textContent = 'Status: Idle';

        updateChannelId();
        loadToken();
    };

    // --- Inject Toggle Button into Channel Bar ---
    // Use a more robust, potentially periodic check + observer approach
    let toggleButtonInstance = null; // Keep track of the button element

    const injectToggleButton = () => {
        const channelBottomBarArea = document.querySelector('.channelBottomBarArea_f75fb0');
        if (channelBottomBarArea && !document.getElementById('typing-toggle-button')) {
             const toggleButton = document.createElement('button');
             toggleButton.id = 'typing-toggle-button';
             toggleButton.type = 'button';
             toggleButton.setAttribute('aria-label', 'Toggle Typing Indicator UI');
             toggleButton.classList.add('button__201d5', 'lookBlank__201d5', 'colorBrand__201d5', 'grow__201d5');

             // Star icon SVG
             toggleButton.innerHTML = `
                 <div class="contents__201d5">
                     <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="20" fill="currentColor">
                         <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-11.4 1.7-20.1 11.6-19.9 23.4s8.6 21.5 19.9 23.4l123.3 18.5 55.1 109.9c5.4 10.8 16.4 17.7 28.8 17.7s23.4-7 28.8-18L381.2 263.7 504.6 245.2c11.4-1.7 20.1-11.6 19.9-23.4s-8.6-21.5-19.9-23.4L381.2 150.3 316.9 18z"/>
                     </svg>
                 </div>
             `;

             toggleButton.style.cssText = `
                 margin: 0 8px !important;
                 cursor: pointer;
                 color: var(--interactive-normal);
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 width: 24px;
                 height: 24px;
                 padding: 0;
                 background: none;
                 border: none;
             `;

             const buttonsContainer = channelBottomBarArea.querySelector('.buttons__74017');
             if (buttonsContainer) {
                const giftButton = buttonsContainer.querySelector('[aria-label="Send a gift"]');
                if (giftButton) {
                    buttonsContainer.insertBefore(toggleButton, giftButton);
                } else {
                     buttonsContainer.appendChild(toggleButton);
                }
             } else {
                 channelBottomBarArea.appendChild(toggleButton);
             }

             // Store the button instance
             toggleButtonInstance = toggleButton;

             // Add event listener to toggle the UI visibility
             toggleButton.addEventListener('click', () => {
                 const container = document.getElementById('discord-typing-container');
                 if (container) {
                     container.style.display = container.style.display === 'none' ? '' : 'none';
                     if (container.style.display !== 'none') {
                          const content = container.querySelector('#typing-content-container');
                          const minimizeToggle = container.querySelector('#minimize-toggle');
                          if(content) content.style.display = '';
                          if(minimizeToggle) minimizeToggle.textContent = '-';
                          container.style.height = 'auto';
                          container.style.padding = '10px';
                     }
                 }
             });
        }
    };

    // Periodically check if the button exists and re-inject if necessary
    setInterval(() => {
        if (!document.getElementById('typing-toggle-button')) {
            injectToggleButton();
        }
    }, 2000); // Check every 2 seconds

    // Use a MutationObserver to wait for the channel bottom bar to exist initially
    const initialObserver = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.channelBottomBarArea_f75fb0')) {
            injectToggleButton();
            injectUI(); // Inject main UI once bottom bar is ready
            obs.disconnect(); // Stop observing once the elements are found and injected
        }
    });

    // Start observing the body for changes
    initialObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();