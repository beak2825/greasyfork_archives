// ==UserScript==
// @name         TikTok Auto Like
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Automatically clicks the like button on TikTok live pages with a draggable and collapsible UI.
// @author       therealbeanos.
// @match        https://www.tiktok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522790/TikTok%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/522790/TikTok%20Auto%20Like.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;
    let clickInterval = 200;
    let isMinimized = false;
    let isDragging = false;
    let offsetX, offsetY;
    let rateLimited = false;

    function autoClickLikeButton() {
        const likeButtonContainer = document.querySelector('.css-hm4yna-DivLikeContainer.ebnaa9i0');
        if (likeButtonContainer) {
            const likeButton = likeButtonContainer.querySelector('.css-1mk0i7a-DivLikeBtnIcon.ebnaa9i3');
            if (likeButton && !rateLimited) {
                likeButton.click();
            }
        }
    }

    function startAutoClicking() {
        if (!intervalId) {
            intervalId = setInterval(autoClickLikeButton, clickInterval);
            const startButton = document.getElementById('start-button');
            const stopButton = document.getElementById('stop-button');
            if (startButton) startButton.style.backgroundColor = '#00f593';
            if (stopButton) stopButton.style.backgroundColor = '';
            updateLiveStatus('Live', '#00f593');
        }
    }

    function stopAutoClicking() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            const startButton = document.getElementById('start-button');
            const stopButton = document.getElementById('stop-button');
            if (stopButton) stopButton.style.backgroundColor = '#ff2d55';
            if (startButton) startButton.style.backgroundColor = '';
            updateLiveStatus('Stopped', '#ff2d55');
        }
    }

    function updateLiveStatus(status, color) {
        const statusElement = document.getElementById('live-status');
        const rateLimitMessage = document.getElementById('rate-limit-message');
        if (statusElement) {
            statusElement.textContent = `Status: ${status}`;
            statusElement.style.color = color;
            statusElement.style.textAlign = 'center';
        }
        if (rateLimitMessage) {
            rateLimitMessage.style.textAlign = 'center';
        }
    }

    function createUI() {
        const uiContainer = document.querySelector('#auto-click-ui');
        if (!uiContainer) {
            const uiContainer = document.createElement('div');
            uiContainer.id = 'auto-click-ui';
            uiContainer.style.position = 'absolute';
            uiContainer.style.top = '50px';
            uiContainer.style.right = '10px';
            uiContainer.style.backgroundColor = '#ffffff';
            uiContainer.style.border = '1px solid #ddd';
            uiContainer.style.borderRadius = '8px';
            uiContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            uiContainer.style.padding = '15px';
            uiContainer.style.zIndex = 1000;
            uiContainer.style.fontFamily = 'Arial, sans-serif';
            uiContainer.style.fontSize = '14px';
            uiContainer.style.color = '#333';
            uiContainer.style.transition = 'max-height 0.3s ease';
            uiContainer.style.overflow = 'hidden';

            uiContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 15px; font-family: 'Arial', sans-serif;">
                    <span style="font-size: 18px; font-weight: bold; color: #333;">TikTok</span><br>
                    <span style="font-size: 24px; font-weight: bold; color: #ff2d55;">Auto Like</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <button id="start-button" style="flex: 1; margin-right: 5px; padding: 8px 12px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Start</button>
                    <button id="stop-button" style="flex: 1; margin-left: 5px; padding: 8px 12px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Stop</button>
                </div>
                <div>
                    <label for="interval-input" style="display: block; margin-bottom: 5px; font-weight: bold;">Interval (ms):</label>
                    <input type="number" id="interval-input" value="${clickInterval}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div id="live-status" style="margin-top: 10px; color: #ff2d55; font-weight: bold; text-align: center;">Status: Stopped</div>
                <div id="rate-limit-message" style="color: #ff2d55; font-weight: bold; margin-top: 10px; display: none; text-align: center;">Rate limit exceeded. Please wait...</div>
            `;

            const heartIcon = document.createElement('div');
            heartIcon.style.width = '24px';
            heartIcon.style.height = '24px';
            heartIcon.style.backgroundSize = 'cover';
            heartIcon.style.margin = '0 auto 10px';
            uiContainer.insertBefore(heartIcon, uiContainer.firstChild);

            document.body.appendChild(uiContainer);

            uiContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - uiContainer.offsetLeft;
                offsetY = e.clientY - uiContainer.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    uiContainer.style.left = `${e.clientX - offsetX}px`;
                    uiContainer.style.top = `${e.clientY - offsetY}px`;
                    uiContainer.style.right = 'auto';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            const expandBar = document.createElement('div');
            expandBar.style.width = '50%';
            expandBar.style.height = '10px';
            expandBar.style.backgroundColor = '#000';
            expandBar.style.cursor = 'pointer';
            expandBar.style.borderRadius = '0 0 8px 8px';
            expandBar.style.position = 'absolute';
            expandBar.style.left = '25%';
            expandBar.style.bottom = '0';
            uiContainer.appendChild(expandBar);

            expandBar.addEventListener('click', () => {
                isMinimized = !isMinimized;
                if (isMinimized) {
                    uiContainer.style.maxHeight = '50px';
                    expandBar.style.display = 'block';
                } else {
                    uiContainer.style.maxHeight = '300px';
                    expandBar.style.display = 'block';
                }
            });

            document.getElementById('start-button').addEventListener('click', () => {
                const inputValue = parseInt(document.getElementById('interval-input').value, 10);
                if (!isNaN(inputValue) && inputValue > 0) {
                    clickInterval = inputValue;
                    if (intervalId) {
                        stopAutoClicking();
                        startAutoClicking();
                    }
                }
                startAutoClicking();
            });

            document.getElementById('stop-button').addEventListener('click', stopAutoClicking);
        }
    }

    function checkRateLimit() {
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const response = await originalFetch(...args);
            if (response.status === 429) {
                rateLimited = true;
                document.getElementById('rate-limit-message').style.display = 'block';
                updateLiveStatus('Rate limited, please wait...', '#ff2d55');
            } else {
                rateLimited = false;
                document.getElementById('rate-limit-message').style.display = 'none';
            }
            return response;
        };
    }

    window.addEventListener('load', () => {
        createUI();
        checkRateLimit();
    });
})();
