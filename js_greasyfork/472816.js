// ==UserScript==
// @name         Change Telegram web page elements
// @namespace    https://greasyfork.org/zh-CN/users/737511
// @description  Move the Telegram chat bubble to the left and hide the "All Chats" button
// @version      0.4
// @icon         https://gcore.jsdelivr.net/gh/Bush2021/img-hosting@main/Icons/Telegram.svg
// @author       Bush2021
// @match        https://web.telegram.org/k/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472816/Change%20Telegram%20web%20page%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/472816/Change%20Telegram%20web%20page%20elements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MENU_ITEM_SELECTOR = 'div.menu-horizontal-div-item';

    function moveChatElementsOnce() {
        GM_addStyle('.chat-input, .bubbles-date-group { transform: translateX(-95px); }');
    }

    function clickSecondElement() {
        const secondMenuItem = document.querySelector(`${MENU_ITEM_SELECTOR}:nth-of-type(2)`);
        if (secondMenuItem) {
            secondMenuItem.click();
        }
    }

    function hideAllChatsButton() {
        const allChatsButton = document.querySelector(MENU_ITEM_SELECTOR);
        if (allChatsButton && allChatsButton.textContent.trim().startsWith("All")) {
            allChatsButton.style.display = "none";
        }
    }

    function checkAndExecute() {
        const targetElement = document.querySelector(MENU_ITEM_SELECTOR);
        if (targetElement) {
            moveChatElementsOnce();
            clickSecondElement();
            hideAllChatsButton();
        } else {
            setTimeout(checkAndExecute, 10);
        }
    }

    checkAndExecute();
})();