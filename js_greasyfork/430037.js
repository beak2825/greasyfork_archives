// ==UserScript==
// @name        LeetCode 获取题解 Markdown, 自动启用运行结果差别.
// @description LeetCode 获取题解 Markdown 源码, 自动启用运行结果差别.
// @namespace   https://github.com/symant233
// @match       https://leetcode-cn.com/problems/*
// @version     0.0.2
// @author      symant233
// @homepageURL  https://github.com/symant233
// @icon         https://cdn.jsdelivr.net/gh/symant233/PublicTools/Beautify/Bkela.png
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/430037/LeetCode%20%E8%8E%B7%E5%8F%96%E9%A2%98%E8%A7%A3%20Markdown%2C%20%E8%87%AA%E5%8A%A8%E5%90%AF%E7%94%A8%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C%E5%B7%AE%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/430037/LeetCode%20%E8%8E%B7%E5%8F%96%E9%A2%98%E8%A7%A3%20Markdown%2C%20%E8%87%AA%E5%8A%A8%E5%90%AF%E7%94%A8%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C%E5%B7%AE%E5%88%AB.meta.js
// ==/UserScript==

;(function() {
    // 控制台获取题解 Markdown 源码
    function getMarkdown() {
        const node = document.querySelector('div[class*="ContentContainer"]');
        const key = Object.keys(node).find(key=>{
            return key.startsWith("__reactEventHandlers$");
        });
        console.log(node[key].children[0].props.children);
    }
    globalThis.getMarkdown = getMarkdown;
    // 自动开启运行结果差别
    function enableDiff () {
        const btn = document.querySelector('label[class*="Label-StyledSwitch"]');
        if (btn && !btn.getAttribute('beautify-data')) {
            btn.setAttribute('beautify-data', true);
            btn.click();
        }
    }
    setTimeout(() => {
        document.querySelector('div[class*=second-section-container] > div:last-child button').click();
        new Promise(resolve => {
            const container = document.querySelector('div[class*="CodeAreaContainer"]');
            if (container) {
                new MutationObserver((mutationList) => {
                    mutationList.forEach((mutation) => { 
                        if (mutation.oldValue) enableDiff();
                    });
                }).observe(container, {
                    attributes: true,
                    attributeOldValue: true,
                    subtree: true,
                });
            }
            resolve();
        });
    }, 2600);
})();