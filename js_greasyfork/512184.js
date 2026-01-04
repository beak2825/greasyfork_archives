// ==UserScript==
// @name         妖火自动转英文半角
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  对于妖火论坛 自动转英文半角
// @author       yh翼城
// @match       *://yaohuo.me/bbs-*
// @match       *://www.yaohuo.me/bbs-*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512184/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%8B%B1%E6%96%87%E5%8D%8A%E8%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/512184/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%8B%B1%E6%96%87%E5%8D%8A%E8%A7%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 写个映射对象，存全角符号到半角符号的对应关系
    const fullToHalfMap = {
        '，': ',',  // 全角逗号
        '。': '.',  // 全角句号
        '！': '!',  // 全角感叹号
        '？': '?',  // 全角问号
        '：': ':',  // 全角冒号
        '；': ';',  // 全角分号
        '（': '(',  // 全角左括号
        '）': ')',  // 全角右括号
        '【': '[',  // 全角左方括号
        '】': ']',  // 全角右方括号
        '《': '<',  // 全角左尖括号
        '》': '>',  // 全角右尖括号
        '“': '"',   // 全角双引号
        '”': '"',   // 全角双引号
        '‘': "'",   // 全角单引号
        '’': "'",   // 全角单引号
        '　': ' '   // 全角空格
    };
    function replace(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            for (const [full, half] of Object.entries(fullToHalfMap)) {
                text = text.split(full).join(half);
            }
            node.nodeValue = text;
        } else {
            for (let child of node.childNodes) {
                replace(child);
            }
        }
    }
    window.onload = function() {
        replace(document.body);
    };
})();
