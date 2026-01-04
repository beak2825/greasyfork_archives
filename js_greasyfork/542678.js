// ==UserScript==
// @name         轻舟发布编排便捷工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在发布计划详情页，提供一系列便捷工具
// @author       gaotu/chenzheqi
// @match        https://qingzhou.baijia.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542678/%E8%BD%BB%E8%88%9F%E5%8F%91%E5%B8%83%E7%BC%96%E6%8E%92%E4%BE%BF%E6%8D%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542678/%E8%BD%BB%E8%88%9F%E5%8F%91%E5%B8%83%E7%BC%96%E6%8E%92%E4%BE%BF%E6%8D%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'action-switcher-button';
    const TARGET_PATH = '#/publishArrangement/subPublishArrangement/publishPlan/detail';
    let lastUrl = location.href;

    // --- UI Functions ---

    function createSwitchButton() {
        if (document.getElementById(BUTTON_ID)) {
            return; // Button already exists
        }

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.innerHTML = '🔄'; // A good "switch" emoji
        button.title = '切换“编辑/审核”模式';

        // Apply styles for a floating action button
        Object.assign(button.style, {
            position: 'fixed',
            top: '150px',
            right: '25px',
            zIndex: '99999',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontSize: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
        });

        // Add hover effects
        button.onmouseover = () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
        };
        button.onmouseout = () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        };

        button.addEventListener('click', toggleActionParameter);
        document.body.appendChild(button);
    }

    function removeSwitchButton() {
        const button = document.getElementById(BUTTON_ID);
        if (button) {
            button.remove();
        }
    }

    // --- Logic Functions ---

    function showConfirmationMessage(newAction) {
        const MESSAGE_ID = 'action-switcher-message';

        // Remove any existing message to prevent overlap
        const existingMessage = document.getElementById(MESSAGE_ID);
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageText = `已切换为 ${newAction === 'edit' ? '编辑' : '审核'} 模式`;

        const messageElement = document.createElement('div');
        messageElement.id = MESSAGE_ID;
        messageElement.textContent = messageText;

        // Style the message for visibility and aesthetics
        Object.assign(messageElement.style, {
            position: 'fixed',
            top: '158px', // Align vertically with the button
            right: '83px', // Position to the left of the button (25px right + 48px width + 10px gap)
            zIndex: '99998',
            padding: '8px 16px',
            backgroundColor: 'rgba(30, 30, 30, 0.85)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            opacity: '0',
            transition: 'opacity 0.4s ease-in-out',
            whiteSpace: 'nowrap',
            pointerEvents: 'none', // Allow clicks to pass through
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        });

        document.body.appendChild(messageElement);

        // Animate fade in
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 10);

        // Animate fade out and remove from DOM
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentElement) {
                    messageElement.remove();
                }
            }, 400); // Wait for fade out transition to finish
        }, 1500);
    }

    function toggleActionParameter() {
        try {
            const currentUrl = new URL(location.href);
            const [hashPath, hashQuery] = currentUrl.hash.split('?');
            const params = new URLSearchParams(hashQuery || '');

            const currentAction = params.get('action');
            const newAction = currentAction === 'edit' ? 'audit' : 'edit';
            params.set('action', newAction);

            const newHash = `${hashPath}?${params.toString()}`;
            location.hash = newHash;

            // Show confirmation message after switching
            showConfirmationMessage(newAction);

        } catch (e) {
            console.error('[Action Switcher] Error toggling URL parameter:', e);
        }
    }

    // --- Main Execution & SPA Navigation Handling ---

    function run() {
        // Check if the current page hash matches the target path
        if (window.location.hash.startsWith(TARGET_PATH)) {
            createSwitchButton();
        } else {
            removeSwitchButton();
        }
    }

    function setupSpaNavigationListener() {
        // Function to handle URL changes
        const handleUrlChange = () => {
            // Use a short timeout to allow the DOM to update after a navigation event
            setTimeout(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    run();
                }
            }, 100);
        };

        // Monkey-patch history.pushState and history.replaceState
        const patchHistoryMethod = (method) => {
            const original = history[method];
            history[method] = function(state) {
                const result = original.apply(this, arguments);
                handleUrlChange();
                return result;
            };
        };

        patchHistoryMethod('pushState');
        patchHistoryMethod('replaceState');

        // Listen to popstate and hashchange for browser back/forward and direct hash changes
        window.addEventListener('popstate', handleUrlChange);
        window.addEventListener('hashchange', handleUrlChange);
    }

    // --- Script Initialization ---

    function initialize() {
        // Initial run after a short delay to ensure the page is settled
        setTimeout(run, 500);
        // Set up listeners for Single Page Application navigation
        setupSpaNavigationListener();
    }

    initialize();

})();
