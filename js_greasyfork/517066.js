// ==UserScript==
// @name         Twitch Mod Action Notifier
// @namespace    https://greasyfork.org/users/Eric Shively
// @version      1.1
// @description  Plays a notification sound when mod actions are taken in Twitch Mod View
// @match        https://www.twitch.tv/moderator/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517066/Twitch%20Mod%20Action%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/517066/Twitch%20Mod%20Action%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Audio settings
    const notificationSound = new Audio('https://www.soundjay.com/button/beep-07.wav'); // Link to a simple beep sound
    notificationSound.volume = 0.5; // Adjust volume to your preference
    notificationSound.load(); // Preload sound to reduce delay

    // List of mod actions to trigger notification
    const actions = [
        'deleted a message',
        'timed out',
        'banned',
        'warned',
        'held a message'
    ];

    // Function to play sound with error handling for autoplay restrictions
    const playSound = () => {
        try {
            notificationSound.play();
        } catch (error) {
            console.error("Audio playback failed:", error);
        }
    };

    // Function to monitor mod actions
    const observeModActions = (mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Check if it's an element
                    const text = node.textContent.toLowerCase();
                    if (actions.some(action => text.includes(action))) {
                        playSound();
                    }
                }
            });
        });
    };

    // Function to initiate observer with retry if target node is not found
    const initObserver = () => {
        const targetNode = document.querySelector('[data-a-target="mod-view-content"]');
        if (targetNode) {
            const observer = new MutationObserver(observeModActions);
            observer.observe(targetNode, { childList: true, subtree: true });
            console.log("Twitch Mod Action Notifier started.");
        } else {
            console.warn("Twitch Mod View content area not found, retrying...");
            setTimeout(initObserver, 1000); // Retry after 1 second
        }
    };

    // Start the observer
    initObserver();
})();
