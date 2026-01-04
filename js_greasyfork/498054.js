// ==UserScript==
// @name         YouTube Instant Unsubscribe Button on Manage Subscriptions Page 
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Add a Single-click Unsubscribe button for each channel on the YouTube manage subscriptions page
// @author       chrisnt
// @match        https://www.youtube.com/feed/channels
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/498054/YouTube%20Instant%20Unsubscribe%20Button%20on%20Manage%20Subscriptions%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/498054/YouTube%20Instant%20Unsubscribe%20Button%20on%20Manage%20Subscriptions%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Simulate a mouse click event on a given element.
     * @param {HTMLElement} element - The element to be clicked.
     */
    function simulateClick(element) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1
        });
        element.dispatchEvent(event);
    }

    /**
     * Hide certain YouTube elements to prevent popups during the unsubscribe process.
     */
    function hideElements() {
        const style = document.createElement('style');
        style.id = 'hide-yt-elements';
        style.innerHTML = `
            ytd-popup-container, ytd-popup-container *,
            ytd-menu-popup-renderer, ytd-menu-popup-renderer * {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show the hidden YouTube elements after the unsubscribe process is complete.
     */
    function showElements() {
        const style = document.getElementById('hide-yt-elements');
        if (style) {
            document.head.removeChild(style);
        }
    }

    /**
     * Add custom Unsubscribe buttons to each channel renderer on the page.
     */
    function addUnsubscribeButtons() {
        const channels = document.querySelectorAll('ytd-channel-renderer');

        channels.forEach(channel => {
            if (!channel.querySelector('.custom-unsubscribe-button')) {
                const unsubscribeButton = document.createElement('button');
                unsubscribeButton.className = 'custom-unsubscribe-button';
                unsubscribeButton.innerHTML = `
                    <span style="display: inline-flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="width: 20px; height: 20px; margin-right: 8px; fill: currentColor;">
                            <g class="style-scope yt-icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" class="style-scope yt-icon"></path>
                            </g>
                        </svg>Unsubscribe
                    </span>`;

                // Style the unsubscribe button
                unsubscribeButton.style.cssText = `
                    margin-left: 12px;
                    padding: 0 12px;
                    background-color: #FF0000;
                    color: #FFFFFF;
                    border: none;
                    border-radius: 2px;
                    height: 36px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    line-height: 36px;
                    vertical-align: middle;
                `;

                // Change background color on hover
                unsubscribeButton.addEventListener('mouseover', () => {
                    unsubscribeButton.style.backgroundColor = '#CC0000';
                });

                unsubscribeButton.addEventListener('mouseout', () => {
                    unsubscribeButton.style.backgroundColor = '#FF0000';
                });

                // Unsubscribe button click event
                unsubscribeButton.addEventListener('click', () => {
                    hideElements();
                    const dropdownButton = channel.querySelector("#notification-preference-button > ytd-subscription-notification-toggle-button-renderer-next > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill");
                    if (dropdownButton) {
                        simulateClick(dropdownButton);
                        setTimeout(() => {
                            const unsubscribeButton = document.querySelector("#items > ytd-menu-service-item-renderer:nth-child(4) > tp-yt-paper-item > yt-formatted-string");
                            if (unsubscribeButton) {
                                simulateClick(unsubscribeButton);
                                setTimeout(() => {
                                    const confirmButton = document.querySelector("#confirm-button > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill");
                                    if (confirmButton) {
                                        simulateClick(confirmButton);
                                        setTimeout(showElements, 100);
                                    } else {
                                        showElements();
                                    }
                                }, 100);
                            } else {
                                showElements();
                            }
                        }, 100);
                    } else {
                        showElements();
                    }
                });

                const actionButtons = channel.querySelector('#buttons');
                if (actionButtons) {
                    actionButtons.appendChild(unsubscribeButton);
                }
            }
        });
    }

    addUnsubscribeButtons();

    // Observe for new channel elements and add unsubscribe buttons dynamically
    const observer = new MutationObserver(addUnsubscribeButtons);
    const pageManager = document.querySelector('ytd-page-manager');

    if (pageManager) {
        observer.observe(pageManager, { childList: true, subtree: true });
    } else {
        console.error('YouTube page manager not found');
    }
})();
