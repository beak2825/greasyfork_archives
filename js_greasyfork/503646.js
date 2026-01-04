// ==UserScript==
// @name         Luogu 私信图片显示
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  一款可以帮助您在洛谷私信中显示图片的脚本
// @author       MushR
// @license      GPL-3.0-or-later
// @match        https://www.luogu.com.cn/chat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503646/Luogu%20%E7%A7%81%E4%BF%A1%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/503646/Luogu%20%E7%A7%81%E4%BF%A1%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

// 参考了 "Luogu QQ 表情显示" 项目
// 修复了图片过大时显示超出窗口的bug

(function() {
    'use strict';

    // 要搜索的 class 列表
    const searchClasses = ['message'];

    // 替换图片链接
    function replacePics(element) {
        if (!element) return;

        // 创建遍历器
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
            acceptNode: function(node) {
                // 只搜索指定 class 的节点
                if (node.classList && searchClasses.some(className => node.classList == className)) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        }, false);

        let node;
        while (node = walker.nextNode()) {
            var a = node.innerHTML.indexOf("![");
            while(a != -1){
                var b = node.innerHTML.indexOf("](", a);
                if(b == -1) break;
                var c = node.innerHTML.indexOf(")", b);
                if(c == -1) break;
                var link = node.innerHTML.substr(b + 2, c - b - 2);
                var text = node.innerHTML.substr(a + 2, b - a - 2);
                if(text == '') text = link;
                var regex = node.innerHTML.substr(a, c - a + 1);
                node.innerHTML = node.innerHTML.replace(regex, `<img style = "max-width: 516px;" src="${link}" alt="${text}">`);
                a = node.innerHTML.indexOf("![")
            }
        }
    }

    // 初始页面替换
    replacePics(document.body);

    // 监听 DOM 变化，实时替换图片链接
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replacePics(node);
                    }
                });
            }
        });
    });

    // 开始观察 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });
})();
