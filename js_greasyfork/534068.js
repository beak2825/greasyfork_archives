// ==UserScript==
// @name         65Cat
// @namespace    https://100713.xyz
// @version      0.2.0
// @description  替换佬友65发言中的喵，让她变成一只小猫
// @author       Ethaniel
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534068/65Cat.user.js
// @updateURL https://update.greasyfork.org/scripts/534068/65Cat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储原始文本映射
    const originalTextMap = new Map();
    let isShowingOriginal = false;

    function replaceW(str, nodeId) {
        const replaced = str.replace(/([^a-zA-Z]|^)w+(?![a-zA-Z])/g, (m, pre) => pre + '喵'.repeat(m.length - pre.length));
        if (str !== replaced && nodeId) {
            originalTextMap.set(nodeId, str);
        }
        return replaced;
    }

    function traverse(node) {
        if (!node) return;
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'CODE' || node.tagName === 'A') return;
            node.childNodes.forEach(child => traverse(child));
        } else if (node.nodeType === Node.TEXT_NODE) {
            if (!node._65catId) {
                node._65catId = Math.random().toString(36).substr(2, 9);
            }
            node.nodeValue = replaceW(node.nodeValue, node._65catId);
        }
    }

    function handleCooked(node) {
        if (!node || node.dataset.wmeowed) return;
        traverse(node);
        node.dataset.wmeowed = "1";
    }

    function scanAndReplace() {
        document.querySelectorAll('article[data-post-id]').forEach(article => {
            if (article.querySelector('.username a[data-user-card="6512345"]')) {
                handleCooked(article.querySelector('.cooked'));
            }
        });

        document.querySelectorAll('.chat-message-container').forEach(container => {
            if (container.querySelector('.chat-user-avatar[data-username="6512345"]')) {
                handleCooked(container.querySelector('.chat-cooked'));
            }
        });

        document.querySelectorAll('section[id^="embedded-posts__bottom--"] .reply').forEach(reply => {
            if (reply.querySelector('.username a[data-user-card="6512345"]')) {
                handleCooked(reply.querySelector('.cooked'));
            }
        });
        document.querySelectorAll('section[id^="embedded-posts__top--"] .reply').forEach(reply => {
            if (reply.querySelector('.username a[data-user-card="6512345"]')) {
                handleCooked(reply.querySelector('.cooked'));
            }
        });
    }

    // 切换替换前后
    function toggleOriginalText() {
        isShowingOriginal = !isShowingOriginal;
        
        document.querySelectorAll('article[data-post-id], .chat-message-container').forEach(container => {
            const is65Post = container.querySelector('.username a[data-user-card="6512345"]') || 
                             container.querySelector('.chat-user-avatar[data-username="6512345"]');
            
            if (is65Post) {
                const content = container.querySelector('.cooked') || container.querySelector('.chat-cooked');
                if (content && content.dataset.wmeowed) {
                    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
                    let textNode;
                    while (textNode = walker.nextNode()) {
                        if (textNode._65catId) {
                            if (isShowingOriginal && originalTextMap.has(textNode._65catId)) {
                                textNode.nodeValue = originalTextMap.get(textNode._65catId);
                            } else if (!isShowingOriginal) {
                                textNode.nodeValue = replaceW(originalTextMap.get(textNode._65catId) || textNode.nodeValue);
                            }
                        }
                    }
                }
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'W' && e.shiftKey) {
            const activeElement = document.activeElement;
            const isInput = activeElement.tagName === 'INPUT' || 
                           activeElement.tagName === 'TEXTAREA' || 
                           activeElement.isContentEditable;
            
            if (!isInput) {
                toggleOriginalText();
                e.preventDefault();
            }
        }
    });

    const OriginalNotification = window.Notification;

    window.Notification = function(title, options) {
        if (title && title.startsWith("6512345") && options && typeof options.body === 'string') {
            options.body = replaceW(options.body);
        }
        return new OriginalNotification(title, options);
    };

    window.Notification.prototype = OriginalNotification.prototype;
    Object.setPrototypeOf(window.Notification, OriginalNotification);

    window.Notification.requestPermission = OriginalNotification.requestPermission.bind(OriginalNotification);
    Object.defineProperty(window.Notification, 'permission', {
        get: function() {
            return OriginalNotification.permission;
        }
    });

    scanAndReplace();
    const observer = new MutationObserver(scanAndReplace);
    observer.observe(document.body, {childList: true, subtree: true});
    setInterval(scanAndReplace, 2000);
})();