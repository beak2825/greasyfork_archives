// ==UserScript==
// @name         Kick.com Auto Hide (Chat + Sidebar)
// @namespace    https://greasyfork.org/en/users/1392176-codificalo-xyz
// @version      1.0.1
// @description  Automatically hides both chat and sidebar on Kick.com streams for a cleaner viewing experience
// @author       codeandoando
// @icon         https://play-lh.googleusercontent.com/66czInHo_spTFWwLVYntxW8Fa_FHCDRPnd3y0HT14_xz6xb_lqSv005ARvdkJJE2TA=s256-rw
// @match        https://kick.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523092/Kickcom%20Auto%20Hide%20%28Chat%20%2B%20Sidebar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523092/Kickcom%20Auto%20Hide%20%28Chat%20%2B%20Sidebar%29.meta.js
// ==/UserScript==

/* 
MIT License
Copyright (c) 2024 codeandoando
Permission is hereby granted, free of charge, to any person obtaining a copy of this software...
*/

(function() {
    'use strict';

    function hideChat() {
        const chatContainer = document.getElementById('channel-chatroom');
        if (chatContainer) {
            const mainContainer = chatContainer.closest('[data-chat]');
            if (mainContainer) {
                mainContainer.setAttribute('data-chat', 'false');
                return true;
            }
        }
        return false;
    }

    function collapseSidebar() {
        const sidebarButton = document.querySelector('button[aria-label="Collapse sidebar"]');
        if (sidebarButton) {
            sidebarButton.click();
            return true;
        }
        return false;
    }

    function initializeHiding() {
        let chatHidden = false;
        let sidebarCollapsed = false;

        function retry(attempt = 0) {
            if (!chatHidden) {
                chatHidden = hideChat();
            }
            if (!sidebarCollapsed) {
                sidebarCollapsed = collapseSidebar();
            }

            if (!chatHidden || !sidebarCollapsed) {
                const delay = Math.min(500 * (attempt + 1), 2000);
                setTimeout(() => retry(attempt + 1), delay);
            }
        }

        retry();
    }

    window.addEventListener('load', () => {
        setTimeout(initializeHiding, 2000);
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initializeHiding, 2000);
        }
    }).observe(document, {subtree: true, childList: true});
})();