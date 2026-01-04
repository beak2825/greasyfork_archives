// ==UserScript==
// @name         Moodle PlusAlarm
// @namespace    https://t.me/johannmosin
// @version      0.1.21
// @description  Предупреждает об опасности Информационной Безопасности
// @author       Johann Mosin
// @license      MIT
// @match        https://*.edu.vsu.ru/html5client/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/527428/Moodle%20PlusAlarm.user.js
// @updateURL https://update.greasyfork.org/scripts/527428/Moodle%20PlusAlarm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOLDOWN = 120000; // 2 minutes in milliseconds
    const CHECK_INTERVAL = 5000;
    const TARGET_URL = 'https://zvukipro.com/uploads/files/2020-10/1602076786_8fa134cac873622.mp3'; // Change to your target URL

    let isCooldown = false;
    let lastUser = GM_getValue('lastUser', '');
    let lastCheckedMessage = null; // To avoid processing the same last message repeatedly

    console.log('Script started. Last user:', lastUser);

    function getLatestMessage() {
        const messages = document.querySelectorAll('[data-test="msgListItem"]');
        if (messages.length === 0) {
            console.log('No messages found in the chat.');
            return null;
        }
        console.log('Total messages found:', messages.length);
        return messages[messages.length - 1];
    }

    function extractMessageInfo(messageElement) {
        try {
            const userElement = messageElement.querySelector('.sc-gFkHhu span:first-child');
            const textElement = messageElement.querySelector('[data-test="chatUserMessageText"]');

            if (!userElement || !textElement) {
                console.log('Could not find user or text element in the message.');
                return null;
            }

            const user = userElement.textContent.trim();
            const text = textElement.textContent.trim();
            console.log('Extracted message info:', { user, text });
            return { user, text };
        } catch (e) {
            console.error('Error extracting message info:', e);
            return null;
        }
    }

    function handleNewMessage() {
        const messageElement = getLatestMessage();
        if (!messageElement) return;

        if (messageElement === lastCheckedMessage) return;
        lastCheckedMessage = messageElement;

        const messageInfo = extractMessageInfo(messageElement);
        if (!messageInfo || messageInfo.text !== '+') return;

        // Check cooldown first
        if (isCooldown) {
            console.log('Cooldown active. Skipping action.');
            return;
        }

        // Get the current stored user
        const storedLastUser = GM_getValue('lastUser', '');

        // Check if the message is from a new user
        if (messageInfo.user === storedLastUser) {
            console.log('Same user as last stored. Skipping action.');
            return;
        }

        // Trigger action since it's a new user and cooldown isn't active
        console.log('Triggering action: Opening new tab for user:', messageInfo.user);
        GM_openInTab(TARGET_URL, { active: true });

        // Update lastUser and store it
        lastUser = messageInfo.user;
        GM_setValue('lastUser', lastUser);

        // Start cooldown
        isCooldown = true;
        setTimeout(() => {
            isCooldown = false;
            console.log('Cooldown ended.');
        }, COOLDOWN);
    }

    function startChecking() {
        const chatContainer = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer'); // Or the appropriate container selector
        if (!chatContainer) {
            console.log('Chat container not found yet. Waiting...');
            setTimeout(startChecking, 1000); // Re-check in 1 second
            return;
        }

        console.log('Chat container found. Starting interval check.');
        setInterval(handleNewMessage, CHECK_INTERVAL);
    }

    // Start checking for messages
    console.log('Waiting for chat container to load...');
    startChecking();

})();