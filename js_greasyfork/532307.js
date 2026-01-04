// ==UserScript==
// @name         Zendesk Chat Timer Tech
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Timer for Zendesk chats with color indicator and inactivity warnings
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532307/Zendesk%20Chat%20Timer%20Tech.user.js
// @updateURL https://update.greasyfork.org/scripts/532307/Zendesk%20Chat%20Timer%20Tech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chatTimers = {};

    // Messages that trigger the "Send Inactive 2" notification after 3 minutes
    const INACTIVITY_MESSAGES = [
        "Looks like you’ve been inactive for a while",
        "Please, let me know when you will be there, ok?",
        "Are you still with me?",
        "Is everything clear with the provided instruction?"
    ];

    const AUTO_CLOSE_MESSAGE = "Looks like you’ve been inactive for a while. The chat will be auto-closed in case you stay inactive for too long. If you have any other questions, I'll be happy to help you out!";

    // Timing constants (in minutes)
    const REGULAR_WARNING_TIME = 5; // Дефолтний час щоб попереджати якщо каст був без відповіді (дефолт 5 хвилин)
    const INACTIVITY_WARNING_TIME = 3;
    const AUTO_CLOSE_WARNING_TIME = 2;

    function updateTimer() {
        const tabs = document.querySelectorAll('[data-test-id="header-tab"]');

        tabs.forEach(tab => {
            const chatId = tab.getAttribute('data-entity-id');
            if (!chatId) return;

            const titleElement = tab.querySelector('[data-test-id="header-tab-title"]');
            const subtitleElement = tab.querySelector('[data-test-id="header-tab-subtitle"]');

            if (!titleElement || !subtitleElement) return;

            const latestMessage = subtitleElement.textContent;

            // Skip timer reset if the message is just "Typing..."
            if (latestMessage.trim() === "Typing...") return;

            const isRegularInactivityMessage = INACTIVITY_MESSAGES.some(msg => latestMessage.includes(msg));
            const isAutoCloseMessage = latestMessage.includes(AUTO_CLOSE_MESSAGE);

            if (!chatTimers[chatId]) {
                chatTimers[chatId] = {
                    lastMessage: latestMessage,
                    lastUpdateTime: Date.now(),
                    timerElement: null,
                    notified: false,
                    inactivityDetected: isRegularInactivityMessage,
                    autoCloseDetected: isAutoCloseMessage,
                    inactivityNotified: false,
                    autoCloseNotified: false
                };
            } else if (chatTimers[chatId].lastMessage !== latestMessage && !isTypingMessage(chatTimers[chatId].lastMessage, latestMessage)) {
                chatTimers[chatId].lastMessage = latestMessage;
                chatTimers[chatId].lastUpdateTime = Date.now();
                chatTimers[chatId].notified = false;

                if (isRegularInactivityMessage) {
                    chatTimers[chatId].inactivityDetected = true;
                    chatTimers[chatId].inactivityNotified = false;
                } else {
                    chatTimers[chatId].inactivityDetected = false;
                    chatTimers[chatId].inactivityNotified = false;
                }

                if (isAutoCloseMessage) {
                    chatTimers[chatId].autoCloseDetected = true;
                    chatTimers[chatId].autoCloseNotified = false;
                } else {
                    chatTimers[chatId].autoCloseDetected = false;
                    chatTimers[chatId].autoCloseNotified = false;
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

            // Regular warning after 5 minutes
            if (minutes >= REGULAR_WARNING_TIME && !chatTimers[chatId].notified) {
                showNotification(`Client ${titleElement.textContent} has been waiting for a response for more than ${REGULAR_WARNING_TIME} minutes!`, '#f39c12');
                chatTimers[chatId].notified = true;
            }

            // Inactivity notification after 3 minutes
            // Показуємо сповіщення тільки якщо останнє повідомлення - про неактивність
            if (chatTimers[chatId].inactivityDetected && minutes >= INACTIVITY_WARNING_TIME && !chatTimers[chatId].inactivityNotified) {
                showNotification(`⚠️ SEND INACTIVE 2: ${titleElement.textContent} has been inactive for ${INACTIVITY_WARNING_TIME} minutes!`, '#e76c3c');
                chatTimers[chatId].inactivityNotified = true;
            }

            // Auto-close notification after 2 minutes
            // Показуємо сповіщення тільки якщо останнє повідомлення - про автозакриття чату
            if (chatTimers[chatId].autoCloseDetected && minutes >= AUTO_CLOSE_WARNING_TIME && !chatTimers[chatId].autoCloseNotified) {
                showNotification(`⚠️ SEND BYE INACTIVE: ${titleElement.textContent} has been waiting for ${AUTO_CLOSE_WARNING_TIME} minutes after auto-close warning!`, '#e74c3c');
                chatTimers[chatId].autoCloseNotified = true;
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
        }, 15000); // 15 секунд для важливих повідомлень
    }

    function isTypingMessage(previousMessage, currentMessage) {
        // Check if the previous message was "Typing..." or the current message is "Typing..."
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