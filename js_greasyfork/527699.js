// ==UserScript==
// @name         osu地图状态替换为英文
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  替换osu地图状态为英文
// @author       Mon3tr_Miku
// @match        https://osu.ppy.sh/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527699/osu%E5%9C%B0%E5%9B%BE%E7%8A%B6%E6%80%81%E6%9B%BF%E6%8D%A2%E4%B8%BA%E8%8B%B1%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/527699/osu%E5%9C%B0%E5%9B%BE%E7%8A%B6%E6%80%81%E6%9B%BF%E6%8D%A2%E4%B8%BA%E8%8B%B1%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义替换规则
    const replacements = {
        '待定': 'Pending',
        '上架': 'Ranked',
        '过审': 'Qualified',
        '社区喜爱': 'Loved',
        '制作中': 'WIP',
        '坟场': 'Graveyard'
    };

    // 替换函数
    function replaceText(node) {
        // 如果节点是文本节点，直接替换
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            for (const [search, replace] of Object.entries(replacements)) {
                text = text.replace(new RegExp(search, 'g'), replace);
            }
            node.textContent = text;
        }
        // 如果节点是元素节点，遍历其子节点
        else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(child => replaceText(child));
        }
    }

    // 监听 DOM 变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => replaceText(node));
        });
    });

    // 开始监听
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始替换
    replaceText(document.body);
})();