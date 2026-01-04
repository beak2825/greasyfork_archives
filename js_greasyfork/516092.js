// ==UserScript==
// @name        RPS Comment Auto-Expander
// @namespace   Violentmonkey Scripts
// @match       https://www.rockpapershotgun.com/*
// @grant       none
// @version     1.3
// @author      AshEnke
// @license     MIT
// @description Auto-expands truncated comments on Rock Paper Shotgun, and optionally auto expand replies as well
// @downloadURL https://update.greasyfork.org/scripts/516092/RPS%20Comment%20Auto-Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/516092/RPS%20Comment%20Auto-Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        DEBUG: false,                  // Enable debug logging
        EXPAND_REPLIES: true,       // Enable auto-expanding of reply threads
        BATCH_SIZE: 10,             // Number of replies to expand in each batch
        BATCH_DELAY: 5000,           // Delay between batches in milliseconds
        ADD_COLLAPSE_BUTTON: true   // Add a collapse button to the left of each comment
    };

    const log = CONFIG.DEBUG ? (...args) => console.log('[RPS Comment Expander]', ...args) : () => {};

    // Queue to store reply buttons
    let replyQueue = [];
    let isProcessingQueue = false;

    async function processReplyQueue() {
        if (isProcessingQueue || replyQueue.length === 0) return;

        isProcessingQueue = true;

        while (replyQueue.length > 0) {
            const batch = replyQueue.splice(0, CONFIG.BATCH_SIZE);
            log(`Processing batch of ${batch.length} replies`);

            for (const button of batch) {
                button.click();
            }

            if (replyQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.BATCH_DELAY));
            }
        }

        isProcessingQueue = false;
    }


    function createCollapseButton() {
        const button = document.createElement('button');
        button.innerHTML = '−';
        button.style.cssText = `
            position: absolute;
            left: -20px;
            top: 6px;
            background: none;
            border: none;
            color: #666;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            padding: 0 5px;
        `;
        return button;
    }

    function addCollapseButtons(shadowRoot) {
        const messageWrappers = shadowRoot.querySelectorAll('.components-MessageLayout-index__messageWrapper');

        messageWrappers.forEach(wrapper => {
            if (wrapper.querySelector('.collapse-button')) return;

            wrapper.style.position = 'relative';
            const button = createCollapseButton();
            button.className = 'collapse-button';

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCollapsed = button.innerHTML === '+';

                // Toggle button
                button.innerHTML = isCollapsed ? '−' : '+';

                // Toggle current message content
                const messageContent = wrapper.querySelector('.components-MessageContent-index__messageEntitiesWrapper');
                const messageActions = wrapper.querySelector('.components-MessageActions-index__messageActionsWrapper');
                if (messageContent) messageContent.style.display = isCollapsed ? 'block' : 'none';
                if (messageActions) messageActions.style.display = isCollapsed ? 'block' : 'none';

                // Hide children
                const childrenList = wrapper.parentElement.parentElement.parentElement.querySelector('.spcv_children-list');
                if (childrenList) {
                    childrenList.style.display = isCollapsed ? 'block' : 'none';

                }
            });

            const userImageCol = wrapper.querySelector('.components-MessageUserImage-index__userAvatarWrapper');
            if (userImageCol) {
                userImageCol.style.position = 'relative';
                userImageCol.appendChild(button);
            }
        });
    }

    function expandContent(shadowRoot) {
        log('Expanding content');

        // Add collapse buttons
        if (CONFIG.ADD_COLLAPSE_BUTTON)
            addCollapseButtons(shadowRoot);

        // Your existing expansion code...
        const seeMoreSpans = Array.from(shadowRoot.querySelectorAll('span'))
            .filter(span => span.textContent.trim() === 'See more');

        seeMoreSpans.forEach(span => {
            log('Expanding comment');
            span.click();
        });

        if (CONFIG.EXPAND_REPLIES) {
            const replyButtons = Array.from(shadowRoot.querySelectorAll('span'))
                .filter(span =>
                    span.className.startsWith('Button__contentWrapper') &&
                    (span.textContent.includes('reply') || span.textContent.includes('replies'))
                );

            replyQueue.unshift(...replyButtons);
            processReplyQueue();

            return seeMoreSpans.length > 0 || replyButtons.length > 0;
        }

        return seeMoreSpans.length > 0;
    }

    function initialize() {
        const owComponent = document.querySelector('#comments > div > *');
        if (!owComponent || !owComponent.shadowRoot) {
            setTimeout(initialize, 1000);
            return;
        }

        log('Found OpenWeb component');

        // Initial expansion
        expandContent(owComponent.shadowRoot);

        // Watch for new comments and replies
        new MutationObserver(() => expandContent(owComponent.shadowRoot))
            .observe(owComponent.shadowRoot, {
                childList: true,
                subtree: true
            });
    }

    // Start looking for comments when the page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

