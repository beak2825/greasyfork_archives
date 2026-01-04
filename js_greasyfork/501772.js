// ==UserScript==
// @name         тест
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Скрипт
// @author       Valik
// @match        https://vk.com/* 
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/501772/%D1%82%D0%B5%D1%81%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/501772/%D1%82%D0%B5%D1%81%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // You need to manually add the user ID and chat IDs here
    const userId = 'USER_ID'; // Replace with the VK user ID
    const chatIds = ['CHAT_ID1', 'CHAT_ID2']; // Replace with the VK chat IDs

    chatIds.forEach(chatId => {
        // Open the chat settings page
        window.open(`https://vk.com/im?sel=${chatId}`, '_blank');
        setTimeout(() => {
            // Simulate clicks to add the user (adjust selectors as needed)
            document.querySelector('.im-page--dialog-settings').click(); // Open settings
            setTimeout(() => {
                document.querySelector('.im-dialog-settings-add-user').click(); // Open add user dialog
                setTimeout(() => {
                    document.querySelector('input[name="addUser"]').value = userId; // Enter user ID
                    document.querySelector('.im-dialog-settings-add-user-submit').click(); // Add user
                }, 1000);
            }, 1000);
        }, 2000);
    });
})();
