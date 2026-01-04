// ==UserScript==
// @name         解除所有输入框和多行文本框复制限制
// @namespace    MilesTurner
// @version      1.0.0
// @description  允许在所有输入框和多行文本框中选中和复制内容，密码框聚焦时可复制
// @author       Miles Turner
// @match        *://*/*
// @icon         https://www.greasyfork.org/static/icon256.png
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/000000
// @supportURL   https://greasyfork.org/zh-CN/scripts/000000/feedback
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535107/%E8%A7%A3%E9%99%A4%E6%89%80%E6%9C%89%E8%BE%93%E5%85%A5%E6%A1%86%E5%92%8C%E5%A4%9A%E8%A1%8C%E6%96%87%E6%9C%AC%E6%A1%86%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535107/%E8%A7%A3%E9%99%A4%E6%89%80%E6%9C%89%E8%BE%93%E5%85%A5%E6%A1%86%E5%92%8C%E5%A4%9A%E8%A1%8C%E6%96%87%E6%9C%AC%E6%A1%86%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
"use strict";

// 解除所有输入框和多行文本框的选中和复制限制，并处理密码框
function unlockAllInputFields(root=document) {
    root.querySelectorAll('input, textarea').forEach(el => {
        el.style.userSelect = 'text';
        el.style.webkitUserSelect = 'text';
        el.style.mozUserSelect = 'text';
        el.style.msUserSelect = 'text';
        el.style.cursor = 'text';

        // 对密码框特殊处理：聚焦时变为text，失焦时还原
        if (el.tagName.toLowerCase() === 'input' && el.type === 'password') {
            if (!el._unlockCopyHandler) {
                el._unlockCopyHandler = true;
                el.addEventListener('focus', function() {
                    el.setAttribute('data-old-type', el.type);
                    el.type = 'text';
                });
                el.addEventListener('blur', function() {
                    if (el.getAttribute('data-old-type')) {
                        el.type = el.getAttribute('data-old-type');
                        el.removeAttribute('data-old-type');
                    }
                });
            }
        }
    });
}

// 初始解除
unlockAllInputFields();

// 动态内容支持
const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (node.nodeType === 1) {
                unlockAllInputFields(node);
            }
        }
    }
});
observer.observe(document.body, {childList: true, subtree: true});

// 解除右键菜单限制
document.addEventListener('contextmenu', event => {
    event.stopImmediatePropagation();
}, true);
