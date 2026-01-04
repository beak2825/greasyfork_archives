// ==UserScript==
// @name         cnfans.com Modal Remover
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes the warning modal on cnfans.com
// @author       cnfan12
// @match        *://cnfans.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530817/cnfanscom%20Modal%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/530817/cnfanscom%20Modal%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        modalSelector: '.n-modal-container',
        checkInterval: 300,
        maxHistoryChecks: 20 // For SPA navigation
    };

    // 1. Add notification styles
    GM_addStyle(`
        .cnfans-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 18px;
            border-radius: 4px;
            z-index: 99999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `);

    // 2. Notification method
    const showModalRemovedNotification = () => {
        // Remove any existing notification first
        const oldNotice = document.querySelector('.cnfans-notification');
        if (oldNotice) oldNotice.remove();
        
        // Create new notification
        const notice = document.createElement('div');
        notice.className = 'cnfans-notification';
        notice.textContent = 'Modal removed successfully';
        document.body.appendChild(notice);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notice.style.opacity = '0';
            setTimeout(() => notice.remove(), 300);
        }, 3000);
    };

    // 3. Enhanced modal remover
    const removeModal = () => {
        const modal = document.querySelector(CONFIG.modalSelector);
        if (!modal) return false;

        modal.remove();
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.documentElement.style.overflow = '';
        
        // Show notification when modal is removed
        showModalRemovedNotification();
        return true;
    };

    // 4. SPA Navigation Detection
    let lastUrl = location.href;
    const watchSPANavigation = () => {
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (location.href.includes('/product?id')) {
                    startModalWatch();
                }
            }
        }, 1000);
    };

    // 5. Start monitoring
    const startModalWatch = () => {
        // Immediate check
        if (removeModal()) {
            return;
        }

        // Fallback: MutationObserver + polling
        const observer = new MutationObserver(() => {
            if (removeModal()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Cleanup after 10 seconds
        setTimeout(() => observer.disconnect(), 10000);
    };

    // Init
    if (location.href.includes('/product?id')) {
        startModalWatch();
    }
    watchSPANavigation(); // For SPA transitions
})();