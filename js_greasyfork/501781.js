// ==UserScript==
// @name         Hotstring Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace hotstrings with predefined texts
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501781/Hotstring%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/501781/Hotstring%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义hotstrings和替换内容的映射
    const hotstrings = {
        'btw': 'by the way',
        'brb': 'be right back',
        'email': 'example@example.com'
    };

    // 监听文本输入事件
    document.addEventListener('input', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            const target = event.target;
            const value = target.value || target.innerText;
            for (let hotstring in hotstrings) {
                if (value.endsWith(hotstring)) {
                    replaceHotstring(target, hotstring, hotstrings[hotstring]);
                }
            }
        }
    });

    function replaceHotstring(target, hotstring, replacement) {
        if (target.value !== undefined) {
            // 针对input和textarea
            target.value = target.value.replace(new RegExp(hotstring + '$'), replacement);
        } else {
            // 针对contenteditable元素
            target.innerText = target.innerText.replace(new RegExp(hotstring + '$'), replacement);
        }
    }
})();