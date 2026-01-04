// ==UserScript==
// @name        DGG Boring Mode (remove april fools css)
// @namespace   yuniDev.boringmodedgg
// @match       https://www.destiny.gg/embed/chat
// @match       https://destiny.gg/embed/chat
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      yuniDev
// @description Removes april fools css from destiny.gg chat. If it doesn't work, try !darkmode in chat
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531527/DGG%20Boring%20Mode%20%28remove%20april%20fools%20css%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531527/DGG%20Boring%20Mode%20%28remove%20april%20fools%20css%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_CSS_FILENAME = 'emotes.css';
    const SELECTORS_TO_REMOVE = [
    '.msg-chat.msg-user',
    '#chat',
    '.msg-chat',
    '#chat.chat-autocomplete-in #chat-input-control',
    '.msg-chat .user',
    '#chat-input-control',
    '.textarea, .input, .button',
    '#chat-auto-complete li',
    '#chat-input-frame',
    '.msg-pinned',
    '#chat-pinned-message',
    '.msg-pinned .user',
    '#chat-event-bar',
    '.chat-unpinned .chat-scroll-notify',
    '.dgg-scroller-theme.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle',
    '.msg-donation .user, .msg-subscription .user, .msg-giftsub .user, .msg-massgift .user, .msg-broadcast .user',
    '.msg-donation .event-top, .msg-subscription .event-top, .msg-giftsub .event-top, .msg-massgift .event-top, .msg-broadcast .event-top',
    '.msg-donation, .msg-subscription, .msg-giftsub, .msg-massgift, .msg-broadcast',
    '.chat-menu .chat-menu-inner',
    '.toolbar h5',
    '.conversation .user',
    '.msg-own',
    '.msg-highlight',
    '.msg-tagged:before'
    ];

    // Ty to gemini 2.5 pro for this function
    function filterCssRules(cssText, selectorsToRemove) {
        let modifiedCss = '';
        let depth = 0;
        let currentBlock = '';
        let potentialSelector = '';
        let isCapturingSelector = true;
        let removedCount = 0;

        for (let i = 0; i < cssText.length; i++) {
        const char = cssText[i];
        currentBlock += char;

        if (char === '{') {
            if (depth === 0) {
                potentialSelector = currentBlock.slice(0, -1).trim();
                isCapturingSelector = false;
            }
            depth++;
        } else if (char === '}') {
            depth--;
            if (depth === 0) {
                let keepBlock = true;
                if (potentialSelector) {
                    if (selectorsToRemove.includes(potentialSelector)) {
                        keepBlock = false;
                        removedCount++;
                    }
                }
                if (keepBlock) modifiedCss += currentBlock;
                currentBlock = '';
                potentialSelector = '';
                isCapturingSelector = true;
            }
        } else if (isCapturingSelector && depth === 0 && char === ';') {
                modifiedCss += currentBlock;
                currentBlock = '';
                potentialSelector = '';
                isCapturingSelector = true;
            }
        }
        if (depth === 0 && currentBlock.trim()) {
            modifiedCss += currentBlock;
        }
        return modifiedCss;
    }

    function injectCssAndBase(originalLink, modifiedCss) {
        const baseUrl = originalLink.href.substring(0, originalLink.href.lastIndexOf('/') + 1);
        const existingBase = document.querySelector('head > base');
        existingBase?.remove();
        const base = document.createElement('base');
        base.href = baseUrl;
        document.head.insertBefore(base, document.head.firstChild);
        const style = document.createElement('style');
        style.id = `boring-dgg-styles`;
        style.textContent = modifiedCss;
        originalLink.parentNode.insertBefore(style, originalLink);
        originalLink.remove();
    }

    function processLinkElement(linkElement) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: linkElement.href,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300 && response.responseText) {
                    try {
                    const modifiedCss = filterCssRules(response.responseText, SELECTORS_TO_REMOVE);
                    injectCssAndBase(linkElement, modifiedCss);
                    } catch (error) {}
                }
            },
        });
    }

    const immediateLink = document.querySelector(`link[rel="stylesheet"][href*="${TARGET_CSS_FILENAME}"]`);

    if (immediateLink) {
        processLinkElement(immediateLink);
    } else {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'LINK' && node.rel === 'stylesheet' && node.href && node.href.includes(TARGET_CSS_FILENAME)) {
                            observer.disconnect();
                            processLinkElement(node);
                            return;
                        }
                    }
                }
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
})();