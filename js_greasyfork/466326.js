// ==UserScript==
// @name         Toggle chat footer, navbar, sidebar and title with slash key for POE
// @namespace    poe-chat-footer-navbar-title-toggle
// @version      1.1
// @description  Toggles the chat footer, navbar, sidebar, and title on poe.com when the "/" key is pressed while the chat input view is activated, and focuses the chat input view if it's not already focused.
// @author       Zach
// @match        https://poe.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466326/Toggle%20chat%20footer%2C%20navbar%2C%20sidebar%20and%20title%20with%20slash%20key%20for%20POE.user.js
// @updateURL https://update.greasyfork.org/scripts/466326/Toggle%20chat%20footer%2C%20navbar%2C%20sidebar%20and%20title%20with%20slash%20key%20for%20POE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the chat input field, footer, navbar, and title elements
    const chatInput = document.querySelector('.ChatMessageInputView_textInput__Aervw');
    const chatFooter = document.querySelector('.ChatPageMainFooter_newFooter__e0_2s');
    const navbar = document.querySelector('.BaseNavbar_titleItem__dy46f');
    const helper_section = document.querySelector('.ChatMessage_chatWelcomeViewWrapper__EjBnZ');
    const sidebar = document.querySelector('.NewPageWithSidebarLayout_leftSidebar__14niX');
    const title = document.querySelector('title');

    // Hide the footer, navbar, and title when the input view is not activated
    chatFooter.style.display = 'none';
    navbar.style.display = 'none';
    title.innerText = ' ';
    document.addEventListener('focusin', () => {
        if (document.activeElement !== chatInput) {
            chatFooter.style.display = 'none';
            navbar.style.display = 'none';
            helper_section.style.display = 'none';
            sidebar.style.display = 'none';
            title.innerText = ' ';
        }
    });

    // Toggle the footer, navbar, and title, and focus the input view when the / key is pressed while the input view is activated
    document.addEventListener('keydown', (event) => {
        if (event.key === '/') {
            if (document.activeElement === chatInput) {
                chatFooter.style.display = chatFooter.style.display === 'none' ? 'block' : 'none';
                navbar.style.display = navbar.style.display === 'none' ? 'block' : 'none';
                helper_section.style.display = helper_section.style.display === 'none' ? 'block' : 'none';
                sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
                title.innerText = 'POE';
            } else {
                chatInput.focus();
                chatFooter.style.display = 'block';
                navbar.style.display = 'block';
                helper_section.style.display = 'block';
                sidebar.style.display = 'block';
                title.innerText = ' ';
            }
            event.preventDefault();
        }
    });
})();