// ==UserScript==
// @name         Zendesk Chat Timer PDFAid
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Timer for Zendesk chats with color indicator and inactivity warning
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528256/Zendesk%20Chat%20Timer%20PDFAid.user.js
// @updateURL https://update.greasyfork.org/scripts/528256/Zendesk%20Chat%20Timer%20PDFAid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chatTimers = {};
    const INACTIVITY_MESSAGE = "Looks like you’ve been inactive for a while";
    const INACTIVITY_WARNING_TIME = 2;

    function updateTimer() {
        const tabs = document.querySelectorAll('[data-test-id="header-tab"]');

        tabs.forEach(tab => {
            const chatId = tab.getAttribute('data-entity-id');
            if (!chatId) return;

            const titleElement = tab.querySelector('[data-test-id="header-tab-title"]');
            const subtitleElement = tab.querySelector('[data-test-id="header-tab-subtitle"]');

            if (!titleElement || !subtitleElement) return;

            const latestMessage = subtitleElement.textContent;

            if (latestMessage.trim() === "Typing...") return;

            const isInactivityMessage = latestMessage.includes(INACTIVITY_MESSAGE);

            if (!chatTimers[chatId]) {
                chatTimers[chatId] = {
                    lastMessage: latestMessage,
                    lastUpdateTime: Date.now(),
                    timerElement: null,
                    notified: false,
                    inactivityDetected: isInactivityMessage,
                    inactivityNotified: false
                };
            } else if (chatTimers[chatId].lastMessage !== latestMessage && !isTypingMessage(chatTimers[chatId].lastMessage, latestMessage)) {
                chatTimers[chatId].lastMessage = latestMessage;
                chatTimers[chatId].lastUpdateTime = Date.now();
                chatTimers[chatId].notified = false;

                chatTimers[chatId].inactivityDetected = isInactivityMessage;
                if (!isInactivityMessage) {
                    chatTimers[chatId].inactivityNotified = false;
                }
            }

            let timerElement = tab.querySelector('.zendesk-chat-timer');

            if (!timerElement) {
                timerElement = document.createElement('span');
                timerElement.className = 'zendesk-chat-timer';
                timerElement.style.marginRight = '5px';
                timerElement.style.fontWeight = 'bold';

                if (titleElement.parentNode) {
                    titleElement.parentNode.insertBefore(timerElement, titleElement);
                    chatTimers[chatId].timerElement = timerElement;
                }
            } else {
                chatTimers[chatId].timerElement = timerElement;
            }

            if (!chatTimers[chatId].timerElement) return;

            const timeElapsed = Math.floor((Date.now() - chatTimers[chatId].lastUpdateTime) / 1000);
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;

            const formattedTime = `⏱️ ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

            let color = '#2ecc71';

            if (minutes >= 4) {
                color = '#e74c3c';
            } else if (minutes >= 3) {
                color = '#f39c12';
            }

            chatTimers[chatId].timerElement.textContent = formattedTime;
            chatTimers[chatId].timerElement.style.color = color;
            titleElement.style.color = color;

            if (minutes >= 3 && !chatTimers[chatId].notified) {
                showNotification(`Client ${titleElement.textContent} has been waiting for a response for more than 3 minutes!`, '#f39c12');
                chatTimers[chatId].notified = true;
            }

            if (chatTimers[chatId].inactivityDetected && minutes >= INACTIVITY_WARNING_TIME && !chatTimers[chatId].inactivityNotified) {
                showNotification(`⚠️ CLOSE CHAT: ${titleElement.textContent} has been inactive for ${INACTIVITY_WARNING_TIME} minutes!`, '#e74c3c');
                chatTimers[chatId].inactivityNotified = true;
            }
        });
    }

    function showNotification(message, backgroundColor) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '55px';
        notification.style.right = '10px';
        notification.style.backgroundColor = backgroundColor;
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.textContent = message;

        document.body.appendChild(notification);

        notification.style.animation = 'notificationPulse 1s infinite';

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 15000);
    }

    function isTypingMessage(previousMessage, currentMessage) {
        return previousMessage.trim() === "Typing..." || currentMessage.trim() === "Typing...";
    }

    function observeTabChanges() {
        const tabsContainer = document.querySelector('[data-test-id="header-tabs"]');
        if (tabsContainer) {
            const tabsObserver = new MutationObserver(() => {
                setTimeout(updateTimer, 100);
            });

            tabsObserver.observe(tabsContainer, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });
        }
    }

    function initScript() {
        const style = document.createElement('style');
        style.textContent = `
            .zendesk-chat-timer {
                font-family: monospace;
                transition: color 0.3s;
                display: inline-block;
            }

            @keyframes notificationPulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        updateTimer();
        observeTabChanges();

        setInterval(updateTimer, 1000);

        const bodyObserver = new MutationObserver(() => {
            if (!document.querySelector('[data-test-id="header-tabs"]')) {
                setTimeout(observeTabChanges, 1000);
            }
        });

        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(initScript, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(initScript, 1000);
        });
    }

    window.addEventListener('load', () => {
        setTimeout(initScript, 1000);
    });
})();