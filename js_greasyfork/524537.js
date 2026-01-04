// ==UserScript==
// @name         DeepSeek Wide Mode
// @author       Stuart Saddler
// @icon         https://i.ibb.co/1GvGSHW/left-right-arrow.png
// @version      1.1
// @description  Customize the width of the chat area while using DeepSeek
// @match        https://chat.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/567951
// @downloadURL https://update.greasyfork.org/scripts/524537/DeepSeek%20Wide%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/524537/DeepSeek%20Wide%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default width
    const defaultWidth = "800px";

    // Load the saved width or default to 800px
    let currentWidth = GM_getValue("chatWidth", defaultWidth);

    function applyChatWidth(width) {
        // Get the available screen width
        const availableWidth = window.innerWidth;

        // Ensure the width doesn't exceed available screen width
        const safeWidth = Math.min(
            parseInt(width.replace('px', ''), 10),
            availableWidth - 100 // Leave some margin
        ) + 'px';

        const style = document.createElement('style');
        style.id = 'deepseek-wide-mode-style';
        style.textContent = `
            .f8d1e4c0,
            .aaff8b8f,
            .cefa5c26,
            .dad65929 {
                max-width: ${safeWidth} !important;
                width: ${safeWidth} !important;
            }
        `;
        // Remove existing style if it exists
        const existingStyle = document.getElementById('deepseek-wide-mode-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        document.head.appendChild(style);
    }

    function changeChatWidth() {
        const newWidth = prompt(
            `Enter the desired chat width in pixels (e.g., 1000).\nDefault width is ${defaultWidth}:`,
            currentWidth.replace('px', '') // Remove 'px' for the input
        );

        if (newWidth !== null) {
            // Validate the input
            const widthValue = parseInt(newWidth, 10);
            if (!isNaN(widthValue) && widthValue > 0) {
                currentWidth = `${widthValue}px`;
                GM_setValue("chatWidth", currentWidth);
                applyChatWidth(currentWidth);
            } else {
                alert("Invalid input. Please enter a positive number for the width.");
            }
        }
    }

    // Register the menu command
    GM_registerMenuCommand("Change Chat Width", changeChatWidth);

    // Apply the saved width when the page loads
    if (document.readyState === 'complete') {
        applyChatWidth(currentWidth);
    } else {
        window.addEventListener('load', () => applyChatWidth(currentWidth));
    }
})();
