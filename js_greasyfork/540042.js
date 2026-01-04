// ==UserScript==
// @name         Expert Portal Chat Timer Tech
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Timer for expert-portal.com chats with color indicator, inactivity warnings, and a little surprise.
// @author       Swiftlyx
// @match        https://*.expert-portal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540042/Expert%20Portal%20Chat%20Timer%20Tech.user.js
// @updateURL https://update.greasyfork.org/scripts/540042/Expert%20Portal%20Chat%20Timer%20Tech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newPortalLogoUrl = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 27.8.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 140 45' style='enable-background:new 0 0 140 45;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%2358595B;%7D .st1%7Bfill:%2336C0F1;%7D%0A%3C/style%3E%3Cg%3E%3Cg%3E%3Cpath class='st0' d='M81,33.5c-0.1,0-0.2-0.1-0.2-0.2V16.1h-6.4c-0.1,0-0.2-0.1-0.2-0.2v-2.7c0-0.1,0.1-0.2,0.2-0.2h16.9 c0.1,0,0.2,0.1,0.2,0.2v2.7c0,0.1-0.1,0.2-0.2,0.2h-6.5v17.2c0,0.1-0.1,0.2-0.2,0.2C84.6,33.5,81,33.5,81,33.5z'/%3E%3C/g%3E%3Cg%3E%3Cpath class='st1' d='M38.3,0c5.7,0,9.1,4.6,10.4,13.8c0,0.6,0.1,1.7,0.2,3.3c0,8.8-3,16.7-9,23.7c-2.8,2.8-5.6,4.2-8.4,4.2 c-4.3,0-7.6-3.2-10-9.7c-0.7-2.2-1.1-4.7-1.1-7.5c0-7.8,2.3-15.3,7-22.5h0.2v0.3c-1.3,2.2-2.1,4.1-2.6,5.7v0.2h0.2 C29.1,3.9,33.5,0,38.3,0z M24.2,28.9c0,7.7,2.6,12.3,7.9,13.7H33c1.1,0,2-0.4,2.5-1.1h-1.4c-4,0-6.5-3.3-7.7-9.8h0.3 c1.6,5.1,3.9,7.6,6.9,7.6c4.7,0,8.3-4.5,11.1-13.5c0.7-2.9,1.1-5.8,1.1-8.6v-0.5c0-1.9-0.2-4-0.7-6.4h-0.3v0.2 c0.1,1,0.2,1.8,0.2,2.4v0.4c0,3.9-0.6,6.5-1.8,8v-0.2c0.6-2.1,0.9-4.1,0.9-5.9c0-5.5-1.6-9.3-4.8-11.3l-1.7-0.2 c-4.7,0-8.7,5.2-12,15.6C24.7,23,24.2,26.2,24.2,28.9z'/%3E%3C/g%3E%3Cpath class='st0' d='M137,30.2h-8.8V13.1h-1.1h-1.4h-1.6c-0.1,0-0.2,0.1-0.2,0.2v19.9c0,0.1,0.1,0.2,0.2,0.2h13 c0.1,0,0.2-0.1,0.2-0.2v-2.8C137.1,30.3,137.1,30.2,137,30.2z'/%3E%3Cg%3E%3Cpath class='st0' d='M2.8,33.5V13h6.4c2.6,0,4.6,0.6,5.8,1.7c1.3,1.1,1.9,2.7,1.9,4.7c0,1.2-0.2,2.3-0.7,3.4 c-0.5,1.1-1.3,1.9-2.5,2.6s-2.7,1-4.7,1H7.2v7.3H2.8V33.5z M7.2,22.6h1.5c1.2,0,2.1-0.2,2.8-0.7s1.1-1.3,1.1-2.5 c0-0.9-0.3-1.6-0.8-2.1c-0.6-0.5-1.4-0.8-2.6-0.8h-2V22.6z'/%3E%3C/g%3E%3Cpath class='st0' d='M68.5,33.3L62.4,25c1.3-0.3,2.4-1,2.4-1c0.8-0.4,1.4-1,1.9-1.7c0.7-0.9,1.1-2,1.1-3.4c0-4-2.7-6-8.2-6h-6.5 v20.5h4.5v-7.9h1.3l4.4,7.7L68.5,33.3L68.5,33.3z M57.6,16.4h1.9c1.3,0,2.2,0.2,2.9,0.7c0.6,0.5,0.9,1.1,0.9,2.1 c0,1.1-0.3,1.9-1,2.4c-0.6,0.5-1.6,0.7-2.8,0.7h-1.9C57.6,22.3,57.6,16.4,57.6,16.4z'/%3E%3Cpath class='st0' d='M107.7,13.3h-3.4l-7.8,20.1h4.2l1.1-3l0,0l1-3h5.5l1,2.7l1.3,3.2h4.9L107.7,13.3z M107.6,25.1l-0.3-0.7 L107.6,25.1L107.6,25.1z M105,21.3c0.2-0.7,0.4-1.4,0.6-2h0.2c0.2,1,0.4,1.7,0.7,2.3c0.2,0.6,0.4,1.1,0.6,1.6l0.4,1.1H104l0.3-0.9 C104.5,22.8,104.8,22.1,105,21.3z'/%3E%3C/g%3E%3C/svg%3E%0A";

    const addClickListenerToLogo = () => {
        const oldLogoSelector = 'svg[viewBox="0 0 139 36"]';
        const oldLogoSvg = document.querySelector(oldLogoSelector);
        if (!oldLogoSvg) {
            return false;
        }
        const logoContainer = oldLogoSvg.closest('a');
        if (!logoContainer || logoContainer.dataset.clickListenerAdded === 'true') {
            return false;
        }
        logoContainer.addEventListener('click', (event) => {
            event.preventDefault();
            const newLogoImg = document.createElement('img');
            newLogoImg.src = newPortalLogoUrl;
            newLogoImg.alt = 'Portal Logo';
            newLogoImg.style.height = '36px';
            newLogoImg.style.width = 'auto';
            newLogoImg.style.display = 'block';
            logoContainer.innerHTML = '';
            logoContainer.appendChild(newLogoImg);
        }, { once: true });
        logoContainer.dataset.clickListenerAdded = 'true';
        return true;
    };

    const logoObserver = new MutationObserver((mutationsList, obs) => {
        if (addClickListenerToLogo()) {
            obs.disconnect();
        }
    });

    logoObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', addClickListenerToLogo);

    const STORAGE_KEY = 'expertPortalChatTimers';
    let chatTimers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    const INACTIVITY_MESSAGES = [
        "Looks like you’ve been inactive for a while",
        "Please, let me know when you will be there, ok?",
        "Are you still with me?",
        "Is everything clear with the provided instruction?",
        "Looks like you’ve been inactive for a while. Are you still with me?",
        "Looks like you’ve been inactive for a while. Can I help you with anything else?",
        "Are you still with me? What stage are you at?"
    ];
    const AUTO_CLOSE_MESSAGE = "Looks like you’ve been inactive for a while. The chat will be auto-closed in case you stay inactive for too long. If you have any other questions, I'll be happy to help you out!";
    const REGULAR_WARNING_TIME = 5;
    const INACTIVITY_WARNING_TIME = 3;
    const AUTO_CLOSE_WARNING_TIME = 2;

    function getUniqueChatId(chatItem) {
        const linkElement = chatItem.closest('a');
        if (linkElement && linkElement.href) {
            const pathParts = new URL(linkElement.href).pathname.split('/');
            for (let i = pathParts.length - 1; i >= 0; i--) {
                if (pathParts[i]) {
                    return pathParts[i];
                }
            }
        }
        return null;
    }

    function updateTimer() {
        const chatItems = document.querySelectorAll('.MuiStack-root.css-14ploym');
        const activeChatIds = new Set();

        chatItems.forEach((chatItem) => {
            const chatId = getUniqueChatId(chatItem);
            if (!chatId) return;

            activeChatIds.add(chatId);

            const userNameElement = chatItem.querySelector('._userName_1p5ir_127');
            const lastMessageElement = chatItem.querySelector('._lastMessage_1p5ir_137');
            const timeDisplayElement = chatItem.querySelector('._messageTime_1p5ir_158');

            if (!userNameElement || !lastMessageElement || !timeDisplayElement) {
                return;
            }

            const lastMessageText = lastMessageElement.textContent.trim();
            if (lastMessageText.toLowerCase().includes("typing...")) {
                if (chatTimers[chatId]) {
                    chatTimers[chatId].lastUpdateTime = Date.now();
                }
                return;
            }

            const isRegularInactivityMessage = INACTIVITY_MESSAGES.some(msg => lastMessageText.includes(msg));
            const isAutoCloseMessage = lastMessageText.includes(AUTO_CLOSE_MESSAGE);

            if (!chatTimers[chatId]) {
                chatTimers[chatId] = {
                    lastMessage: lastMessageText,
                    lastUpdateTime: Date.now(),
                    notified: false,
                    inactivityDetected: isRegularInactivityMessage,
                    autoCloseDetected: isAutoCloseMessage,
                    inactivityNotified: false,
                    autoCloseNotified: false
                };
            } else if (chatTimers[chatId].lastMessage !== lastMessageText) {
                chatTimers[chatId].lastMessage = lastMessageText;
                chatTimers[chatId].lastUpdateTime = Date.now();
                chatTimers[chatId].notified = false;
                chatTimers[chatId].inactivityDetected = isRegularInactivityMessage;
                chatTimers[chatId].autoCloseDetected = isAutoCloseMessage;
                chatTimers[chatId].inactivityNotified = false;
                chatTimers[chatId].autoCloseNotified = false;
            }

            const timeElapsed = Math.floor((Date.now() - chatTimers[chatId].lastUpdateTime) / 1000);
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;

            timeDisplayElement.textContent = `⏱️ ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            let color = '#2ecc71';
            if (minutes >= 4) {
                color = '#e74c3c';
            } else if (minutes >= 3) {
                color = '#f39c12';
            }

            timeDisplayElement.style.color = color;
            timeDisplayElement.style.fontWeight = 'bold';
            timeDisplayElement.style.fontSize = '1.00em';
            if (userNameElement.style.color !== color) {
                userNameElement.style.color = color;
            }

            const chatName = userNameElement.textContent.trim();

            if (minutes >= REGULAR_WARNING_TIME && !chatTimers[chatId].notified) {
                showNotification(`Client ${chatName} has been waiting for a response for over ${REGULAR_WARNING_TIME} minutes!`, '#f39c12');
                chatTimers[chatId].notified = true;
            }
            if (chatTimers[chatId].inactivityDetected && minutes >= INACTIVITY_WARNING_TIME && !chatTimers[chatId].inactivityNotified) {
                showNotification(`⚠️ SEND INACTIVE 2: ${chatName} has been inactive for ${INACTIVITY_WARNING_TIME} minutes!`, '#e76c3c');
                chatTimers[chatId].inactivityNotified = true;
            }
            if (chatTimers[chatId].autoCloseDetected && minutes >= AUTO_CLOSE_WARNING_TIME && !chatTimers[chatId].autoCloseNotified) {
                showNotification(`⚠️ SEND BYE INACTIVE: ${chatName} has been waiting for ${AUTO_CLOSE_WARNING_TIME} minutes after auto-close warning!`, '#e74c3c');
                chatTimers[chatId].autoCloseNotified = true;
            }
        });

        for (const chatId in chatTimers) {
            if (!activeChatIds.has(chatId)) {
                delete chatTimers[chatId];
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(chatTimers));
    }

    function showNotification(message, backgroundColor) {
        const notification = document.createElement('div');
        Object.assign(notification.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: backgroundColor,
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: '12px',
            animation: 'notificationPulse 2.5s infinite'
        });
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 15000);
    }

    function initScript() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationPulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        setInterval(updateTimer, 1000);
    }

    if (document.readyState === 'complete' || document.readyState === "interactive") {
        setTimeout(initScript, 2000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initScript, 2000);
        });
    }
})();
