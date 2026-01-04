// ==UserScript==
// @name         YouTube Multi Unsubscribe with Buttons and Checkboxes
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add checkboxes and individual Unsubscribe buttons to YouTube channels for easy bulk and single-channel unsubscribing
// @author       Dannysgonemad
// @match        https://www.youtube.com/feed/channels
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/525292/YouTube%20Multi%20Unsubscribe%20with%20Buttons%20and%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/525292/YouTube%20Multi%20Unsubscribe%20with%20Buttons%20and%20Checkboxes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("YouTube Multi Unsubscribe script loaded");

    function simulateClick(element) {
        if (element) {
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            element.dispatchEvent(event);
        }
    }

    async function unsubscribeChannel(channel) {
        console.log("Attempting to unsubscribe...");

        const dropdownButton = channel.querySelector("#notification-preference-button button");
        if (!dropdownButton) return;

        simulateClick(dropdownButton);
        await new Promise(resolve => setTimeout(resolve, 300));

        const unsubscribeMenuItem = [...document.querySelectorAll("tp-yt-paper-item yt-formatted-string")]
            .find(el => el.textContent.trim() === "Unsubscribe");

        if (!unsubscribeMenuItem) return;

        simulateClick(unsubscribeMenuItem);
        await new Promise(resolve => setTimeout(resolve, 300));

        const confirmButton = document.querySelector("#confirm-button button");
        if (confirmButton) {
            simulateClick(confirmButton);
            console.log("Unsubscribed successfully!");
        }
    }

    async function unsubscribeSelectedChannels() {
        console.log("Unsubscribing from selected channels...");

        const selectedCheckboxes = document.querySelectorAll('.custom-unsubscribe-checkbox:checked');

        for (const checkbox of selectedCheckboxes) {
            const channel = checkbox.closest('ytd-channel-renderer');
            if (channel) {
                await unsubscribeChannel(channel);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    function ensureUnsubscribeSelectedButton() {
        let unsubscribeButton = document.querySelector('#custom-unsubscribe-button');

        if (!unsubscribeButton) {
            unsubscribeButton = document.createElement('button');
            unsubscribeButton.id = 'custom-unsubscribe-button';
            unsubscribeButton.textContent = "Unsubscribe Selected";
            unsubscribeButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #FF0000;
                color: #FFFFFF;
                border: none;
                padding: 12px 20px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 4px;
                box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
                z-index: 9999;
            `;

            unsubscribeButton.addEventListener('click', unsubscribeSelectedChannels);
            document.body.appendChild(unsubscribeButton);
        }
    }

    function addUnsubscribeUI() {
        console.log("Adding UI elements...");

        document.querySelectorAll('ytd-channel-renderer').forEach(channel => {
            if (!channel.querySelector('.custom-unsubscribe-button')) {
                const unsubscribeButton = document.createElement('button');
                unsubscribeButton.className = 'custom-unsubscribe-button';
                unsubscribeButton.textContent = "Unsubscribe";

                unsubscribeButton.style.cssText = `
                    margin-left: 12px;
                    padding: 8px 12px;
                    background-color: #FF0000;
                    color: #FFFFFF;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                `;

                unsubscribeButton.addEventListener('mouseover', () => {
                    unsubscribeButton.style.backgroundColor = '#CC0000';
                });

                unsubscribeButton.addEventListener('mouseout', () => {
                    unsubscribeButton.style.backgroundColor = '#FF0000';
                });

                unsubscribeButton.addEventListener('click', () => unsubscribeChannel(channel));

                const actionButtons = channel.querySelector('#buttons');
                if (actionButtons) {
                    actionButtons.appendChild(unsubscribeButton);
                }
            }

            if (!channel.querySelector('.custom-unsubscribe-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'custom-unsubscribe-checkbox';

                checkbox.style.cssText = `
                    margin-left: 10px;
                    transform: scale(1.5);
                    cursor: pointer;
                `;

                const actionButtons = channel.querySelector('#buttons');
                if (actionButtons) {
                    actionButtons.appendChild(checkbox);
                }
            }
        });

        ensureUnsubscribeSelectedButton();
    }

    addUnsubscribeUI();

    const observer = new MutationObserver(addUnsubscribeUI);
    const pageManager = document.querySelector('ytd-page-manager');

    if (pageManager) {
        observer.observe(pageManager, { childList: true, subtree: true });
    }
})();
