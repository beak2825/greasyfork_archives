// ==UserScript==
// @name        屏蔽 DBD-Raws
// @namespace   anti-DBD-Raws
// @version     1.0
// @description a simple script to block the display of DBD-Raws
// @author      CropCircle
// @match       http://*/*
// @match       https://*/*
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      DOMContentLoaded
// @exclude     https://*.google.*
// @exclude     https://*.bing.*
// @exclude     https://*.baidu.*
// @exclude     https://greasyfork.org/*
// @homepageURL https://greasyfork.org/zh-CN/scripts/464086-%E5%B1%8F%E8%94%BD-dbd-raws
// @supportURL  https://aiccrop.com/
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/464086/%E5%B1%8F%E8%94%BD%20DBD-Raws.user.js
// @updateURL https://update.greasyfork.org/scripts/464086/%E5%B1%8F%E8%94%BD%20DBD-Raws.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentURL = window.location.href;
    (function() {
        const defaultReplacement = '😅😅😅';
        let replacement = GM_getValue('replacement', null);
        if (replacement === null) {
            // Prompt the user to enter a replacement text for the first time
            replacement = prompt('Enter the text you want to replace the keywords with', defaultReplacement);
            if (replacement !== null) {
                GM_setValue('replacement', replacement);
            } else {
                // Use the default replacement text if the user cancels the prompt
                replacement = defaultReplacement;
            }
        }
        const keywords = [
            '黑暗路基艾尔',
            '神圣路基艾尔',
            'DBD-Raws',
            'DBD分流Q群',
            'DBD',
            'https://afdian.net/@112127luji',
            '746546998',
            '560823326',
            '1158412873',
            '1040411052',
            'https://space.bilibili.com/97177229',
            'https://space.bilibili.com/476857955',
            '神圣之路基艾尔'
        ];

        function traverse(node) {
            let child, next;
            switch (node.nodeType) {
                case 1: // Element
                case 9: // Document
                case 11: // Document fragment
                    child = node.firstChild;
                    while (child) {
                        next = child.nextSibling;
                        traverse(child);
                        child = next;
                    }
                    break;
                case 3: // Text node
                    if (keywords.some((keyword) => node.nodeValue.match(keyword))) {
                        node.nodeValue = node.nodeValue.replace(new RegExp(keywords.join('|'), 'g'), replacement);
                    }
                    break;
            }
        }

        // Create a prompt for the user to enter a replacement text
        function setReplacement() {
            const input = prompt('Enter the text you want to replace the keywords with', replacement);
            if (input !== null) {
                replacement = input;
                GM_setValue('replacement', replacement); // Save the new value to GM storage
                traverse(document.body); // Re-run the text replacement with the new replacement text
            }
        }

        traverse(document.body);
    })();
})();
