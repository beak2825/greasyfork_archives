// ==UserScript==
// @name         Dispatcher Coloring Script with Sound Notification
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Dynamically color nonhighlighted-order elements based on package/item count and play a notification sound using an external MP3 in real-time
// @author       Hashem Altabbaa
// @match        https://prod-in.dis2-workbench.gsf.a2z.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524429/Dispatcher%20Coloring%20Script%20with%20Sound%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/524429/Dispatcher%20Coloring%20Script%20with%20Sound%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STAGED_ORDER_NOTIFICATION_SOUND_URL = 'https://notificationsounds.com/storage/sounds/file-sounds-792-the-little-dwarf.ogg';
    const ORDER_DROP_NOTIFICATION_SOUND_URL = 'https://notificationsounds.com/storage/sounds/file-sounds-1350-you-would-be-glad.mp3'

    /**
     * Plays the external notification sound.
     */
    function playStagedOrderNotificationSound() {
        if (window.stagedOrderNotificationAudio) {
            // Reset to start and play
            window.stagedOrderNotificationAudio.currentTime = 0;
            window.stagedOrderNotificationAudio.play().catch(error => {
                console.error('Error playing notification sound:', error);
            });
        } else {
            console.warn('Notification audio not initialized. Please enable notification sounds by clicking the button.');
        }
    }

    function playOrderDropNotificationSound() {
        if (window.orderDropNotificationAudio) {
            // Reset to start and play
            window.orderDropNotificationAudio.currentTime = 0;
            window.orderDropNotificationAudio.play().catch(error => {
                console.error('Error playing notification sound:', error);
            });
        } else {
            console.warn('Notification audio not initialized. Please enable notification sounds by clicking the button.');
        }
    }

    /**
     * Enables notification sounds by unlocking the AudioContext and setting up the Audio element.
     * @param {HTMLButtonElement} button - The button element to update its state.
     */
    function enableNotificationSounds(button) {
        if (!window.stagedOrderNotificationAudio) {
            // Create an Audio element and preload the sound
            const stagedOrderAudio = new Audio(STAGED_ORDER_NOTIFICATION_SOUND_URL);
            //ORDER_DROP_NOTIFICATION_SOUND_URL
            //STAGED_ORDER_NOTIFICATION_SOUND_URL
            stagedOrderAudio.preload = 'auto';

            // Attempt to play the audio to unlock the AudioContext
            const playPromise = stagedOrderAudio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Notification sounds enabled.');
                    button.textContent = 'Notification Sounds Enabled';
                    button.style.backgroundColor = '#f44336';
                    button.disabled = true;
                    window.stagedOrderNotificationAudio = stagedOrderAudio;
                }).catch(error => {
                    console.error('Error enabling notification sounds:', error);
                    alert('Failed to enable notification sounds. Please ensure your browser allows audio playback.');
                });
            }
            const orderDropAudio = new Audio(ORDER_DROP_NOTIFICATION_SOUND_URL);
            orderDropAudio.preload = 'auto';
            window.orderDropNotificationAudio = orderDropAudio;

        }
    }

    /**
     * Adds a toggle button to the page to enable notification sounds.
     */
    function addSoundToggleButton() {
        const button = document.createElement('button');
        button.textContent = 'Enable Notification Sounds';
        button.id = 'enable-notification-sounds';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.zIndex = '10000';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.fontSize = '14px';

        document.body.appendChild(button);

        button.addEventListener('click', () => {
            enableNotificationSounds(button);
        });
    }

    // Inject CSS for the light green background
    const style = document.createElement('style');
    style.textContent = `
        .light-green-background {
            background-color: #d4edda !important;
            transition: background-color 0.3s ease; /* Smooth transition */
        }
        .light-green-background-remove {
            background-color: initial !important;
            transition: background-color 0.3s ease; /* Smooth transition */
        }
    `;
    document.head.appendChild(style);

    // Add the toggle button to the page
    addSoundToggleButton();

    // Initialize the observer
    observeNonHighlightedOrders();

    /**
     * Initializes the MutationObserver to monitor relevant DOM changes.
     */
    function observeNonHighlightedOrders() {
        const targetNode = document.body;
        const config = {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false
        };

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList.contains('nonhighlighted-order')) {
                                processOrderElement(node);
                            }

                            const orders = node.querySelectorAll('.nonhighlighted-order');
                            orders.forEach(order => {
                                processOrderElement(order);
                            });
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    const textNode = mutation.target;
                    const parentElement = textNode.parentElement;

                    if (parentElement && parentElement.classList.contains('css-x7ujt3')) {
                        const orderElement = parentElement.closest('.nonhighlighted-order');
                        if (orderElement) {
                            evaluateAndStyleOrder(orderElement);
                        }
                    }
                }
            }
        });

        observer.observe(targetNode, config);
        const existingOrders = document.querySelectorAll('.nonhighlighted-order');
        existingOrders.forEach(order => {
            processOrderElement(order);
        });
    }

    /**
     * Processes a single .nonhighlighted-order element.
     * @param {Element} orderElement - The .nonhighlighted-order DOM element.
     */
    function processOrderElement(orderElement) {
        // Initial evaluation
        evaluateAndStyleOrder(orderElement);
    }

    /**
     * Evaluates the .nonhighlighted-order element and applies/removes styling based on the span content.
     * @param {Element} orderElement - The .nonhighlighted-order DOM element.
     */
    function evaluateAndStyleOrder(orderElement) {
        // Find all spans with class 'css-x7ujt3' within the order element
        const spans = orderElement.querySelectorAll('span.css-x7ujt3');

        let isStagedOrder = false;
        let isNewOrder = false;

        spans.forEach(span => {
            const text = span.textContent.trim();
            // Use regex to extract the number and the type (items/packages)
            const regex = /^\(?\s*(\d+)\s+(items|packages|item|package)\s*\)?$/i;
            const match = text.match(regex);

            if (match) {
                const count = parseInt(match[1], 10);
                const type = match[2].toLowerCase();

                if (type === 'packages' || type === 'package') {
                    isStagedOrder = true;
                }else if(type === 'items' || type === 'item'){
                    isNewOrder = true;
                }
            }
        });

        if (isStagedOrder) {
            if (!orderElement.classList.contains('light-green-background')) {
                orderElement.classList.add('light-green-background');
                orderElement.classList.remove('light-green-background-remove');

                playStagedOrderNotificationSound();
            }
        }else if (isNewOrder){
            playOrderDropNotificationSound();
        }
    }

})();
