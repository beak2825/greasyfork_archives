// ==UserScript==
// @name         Emoji Party
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces keywords with emojis to add a fun twist to webpages.
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @author       Kiwv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471150/Emoji%20Party.user.js
// @updateURL https://update.greasyfork.org/scripts/471150/Emoji%20Party.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywordMap = {
        'cat': '🐱',
        'dog': '🐶',
        'happy': '😄',
        'sad': '😢',
        'love': '❤️',
        'pizza': '🍕',
        'coffee': '☕',
        'thumbs up': '👍',
        'thumbs down': '👎',
        'rocket': '🚀',
        'sun': '☀️',
        'moon': '🌙',
        'star': '⭐',
        'rainbow': '🌈',
        'flower': '🌸',
        'tree': '🌳',
        'beach': '🏖️',
        'mountain': '⛰️',
        'book': '📚',
        'music': '🎵',
        'movie': '🎥',
        'camera': '📷',
        'guitar': '🎸',
        'game': '🎮',
        'soccer': '⚽',
        'basketball': '🏀',
        'baseball': '⚾',
        'tennis': '🎾',
        'globe': '🌍',
        'clock': '⏰',
        'money': '💰',
        'gift': '🎁',
        'fire': '🔥',
        'party': '🎉',
        'smile': '😊',
        'cry': '😭',
        'laugh': '😂',
        'wink': '😉',
        'kiss': '💋',
        'thumbs up': '👍',
        'thumbs down': '👎',
        'heart': '❤️',
        'bomb': '💣',
        'ghost': '👻',
        'robot': '🤖',
        'unicorn': '🦄',
        'rocket': '🚀',
        'crown': '👑',
        'cake': '🍰',
        'cookie': '🍪',
        'car': '🚗',
        'bicycle': '🚲',
        'train': '🚆',
        'ship': '🚢',
        'airplane': '✈️',
        'rocket': '🚀',
        'football': '🏈',
        'swimmer': '🏊',
        'runner': '🏃'
        // Add more keyword mappings here
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                replaceKeywordsInNode(mutation.target);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function replaceKeywordsInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const content = node.textContent;
            let replacedContent = content;

            for (const keyword in keywordMap) {
                const emoji = keywordMap[keyword];
                const regex = new RegExp(keyword, 'gi');
                replacedContent = replacedContent.replace(regex, emoji);
            }

            if (replacedContent !== content) {
                const newNode = document.createTextNode(replacedContent);
                node.parentNode.replaceChild(newNode, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const childNode of node.childNodes) {
                replaceKeywordsInNode(childNode);
            }
        }
    }
})();