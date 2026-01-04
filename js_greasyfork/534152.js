// ==UserScript==
// @name         ChatGPT Ctrl+Enter Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send ChatGPT messages using Ctrl+Enter on smaller screen
// @author       nonepork
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534152/ChatGPT%20Ctrl%2BEnter%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/534152/ChatGPT%20Ctrl%2BEnter%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback, checkFrequencyInMs, timeoutInMs) {
        let startTimeInMs = Date.now();
        const interval = setInterval(function() {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
                return;
            }
            if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                clearInterval(interval);
                console.log('Element not found within timeout period');
                return;
            }
        }, checkFrequencyInMs || 100);
    }

    function sendMessage() {
        const sendButton = document.querySelector('button[data-testid="send-button"]');
        if (sendButton && !sendButton.disabled) {
            sendButton.click();
            return true;
        }
        return false;
    }

    function setupCtrlEnterHandler() {
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();

                if (sendMessage()) {
                    console.log('Message sent with Ctrl+Enter');
                } else {
                    console.log('Send button not found or disabled');
                    waitForElement('button[data-testid="send-button"]', function(element) {
                        if (element && !element.disabled) {
                            element.click();
                            console.log('Message sent with Ctrl+Enter (delayed)');
                        }
                    }, 100, 5000);
                }
            }
        });
    }

    function initialize() {
        console.log('ChatGPT Ctrl+Enter Send script loaded');
        setupCtrlEnterHandler();

        waitForElement('button[data-testid="send-button"]', function() {
            console.log('Send button found and ready');
        }, 100, 10000);
    }

    initialize();
})();
