// ==UserScript==
// @name        ChatGPT - Collapsible Messages
// @match       https://chat.openai.com/*
// @grant       GM_addStyle
// @run-at      document-end
// @license     MIT
// @homepageUrl https://github.com/RisingOrange/chatgpt-collapsible-messages
// @version 1.3
// @description Makes ChatGPT messages collapsible. The script adds a button to each chat message that lets you collapse it (and un-collapse it).
// @namespace https://chat.openai.com
// @downloadURL https://update.greasyfork.org/scripts/472095/ChatGPT%20-%20Collapsible%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/472095/ChatGPT%20-%20Collapsible%20Messages.meta.js
// ==/UserScript==

GM_addStyle(`
    .collapsed::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20%;
        background: linear-gradient(to top, grey, transparent);
    }
`);

(function() {
    'use strict';

    const TRIANGLE_SIZE = 7;  // Set the size of the triangle here
    const COLLAPSED_HEIGHT = '90px';  // Set the height of the collapsed message here

    function addCollapseButtons() {
        const messages = document.querySelectorAll('div.flex > div.group.text-token-text-primary:not(.collapse-enabled)')

        messages.forEach(message => {
            message.classList.add('collapse-enabled');
            message.style.position = 'relative';

            const button = document.createElement('div');
            button.style.cursor = 'pointer';
            button.style.width = '0';
            button.style.height = '0';
            button.style.color = window.getComputedStyle(message).color;
            button.style.margin = '10px';
            button.style.position = 'absolute';

            const content = message.querySelector('.flex');
            const originalHeight = content.offsetHeight;

            const setTriangleDown = () => {
                button.style.borderLeft = `${TRIANGLE_SIZE}px solid transparent`;
                button.style.borderRight = `${TRIANGLE_SIZE}px solid transparent`;
                button.style.borderTop = `${TRIANGLE_SIZE * 1.5}px solid`;
            };

            const setTriangleRight = () => {
                button.style.borderTop = `${TRIANGLE_SIZE}px solid transparent`;
                button.style.borderBottom = `${TRIANGLE_SIZE}px solid transparent`;
                button.style.borderLeft = `${TRIANGLE_SIZE * 1.5}px solid`;
            };

            button.addEventListener('click', () => {
                if(content.style.maxHeight) {
                    content.style.maxHeight = '';
                    content.classList.remove('collapsed');
                    setTriangleDown();
                } else {
                    content.style.maxHeight = COLLAPSED_HEIGHT;
                    content.style.overflow = 'hidden';
                    content.classList.add('collapsed');
                    setTriangleRight();
                }
            });

            setTriangleDown();
            message.prepend(button);
        });
    }

    addCollapseButtons();
    setInterval(addCollapseButtons, 1000);
})();