// ==UserScript==
// @name         Twitch Shared Chat Filter
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  I got annoyed by spam from other chats so I yeet it
// @author       Tilted Toast
// @match        https://www.twitch.tv/*
// @run-at       document-start
// @license      MIT
// @website      https://greasyfork.org/en/scripts/520551-twitch-shared-chat-filter
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/520551/Twitch%20Shared%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/520551/Twitch%20Shared%20Chat%20Filter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let isFilterActive = true;

    function createToggleButton() {
        if (!isFilterActive) return;

        const chatBtn = document.querySelector('button[data-a-target="chat-send-button"]');

        const btn = chatBtn.cloneNode(true);
        btn.id = "shared_chat_toggle_btn";

        btn.querySelector('[data-a-target="tw-core-button-label-text"]').textContent = 'ON';
        btn.setAttribute('aria-label', 'Filter ON');
        btn.setAttribute('title', 'Shared Chat Filter');

        btn.style.marginRight = '0.5rem';
        chatBtn.parentNode.insertBefore(btn, chatBtn);

        btn.addEventListener('click', () => {
            isFilterActive = !isFilterActive;

            const label = `${isFilterActive ? 'ON' : 'OFF'}`;
            const ariaLabel = `Filter ${isFilterActive ? 'ON' : 'OFF'}`;

            btn.querySelector('[data-a-target="tw-core-button-label-text"]').textContent = label;
            btn.setAttribute('aria-label', ariaLabel);

            console.log(`Shared Chat Filter is now ${isFilterActive ? 'enabled' : 'disabled'}.`);
        });
    }

    function filterSharedChatMessages() {
        isFilterActive = true

        // Get the current streamer's name from the URL
        const currentStreamer = window.location.pathname.split('/')[1].toLowerCase();

        if (!currentStreamer) {
            return console.error('Unable to detect streamer name from the URL.');
        }

        // Check if Shared Chat mode is active
        const sharedChatIndicator = document.querySelector('#chat-room-header-label');
        if (!sharedChatIndicator || sharedChatIndicator.textContent !== 'Shared Chat') {
            return console.error('Shared Chat is not active.');
        }

        // Get a list of streamer participants
        const streamers = Array.from(
            document.querySelectorAll('[class*="sharedChatHeaderAvatarSmall--"] > div > [aria-label*="Shared Chat Participant"]')
        ).map(s => s.ariaLabel.split(" ").at(-1).toLowerCase());

        if (!streamers || streamers.length == 0) {
            return console.error("Unable to find shared chat avatars");
        }

        console.log("Streamers:", streamers);

        console.log(`Shared Chat is active for ${currentStreamer}.`);

        const chatContainer = document.querySelector('.seventv-chat-list');
        if (!chatContainer) {
            return console.error('Chat container not found!');
        }

        createToggleButton();


        const observer = new MutationObserver((mutationsList) => {
            if (!isFilterActive) return;

            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {

                            // We allow either a message with no "streamer badge" or a message with the current page's streamer's badge
                            // We also only care about the first badge, since if there's a "streamer badge" they're always first
                            const badge = node.querySelector('.seventv-chat-badge > img');
                            if (!badge) return;

                            const badgeAlt = badge.alt.toLowerCase();
                            if (!streamers.includes(badgeAlt)) return;

                            if (badgeAlt != currentStreamer) {
                                node.style.display = "none";
                            }
                        }
                    });
                }
            }
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await sleep(10000)
    filterSharedChatMessages();

    GM_registerMenuCommand("Run Script", filterSharedChatMessages);
})();