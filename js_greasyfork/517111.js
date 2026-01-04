// ==UserScript==
// @name         隐藏WebP
// @namespace    http://tampermonkey.net/
// @version      2024-11-13
// @description  隐藏WebP脚本
// @author       You
// @match        https://lanhuapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanhuapp.com
// @license none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517111/%E9%9A%90%E8%97%8FWebP.user.js
// @updateURL https://update.greasyfork.org/scripts/517111/%E9%9A%90%E8%97%8FWebP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    lanhu()
    // Your code here...
})();

function lanhu(){
    // 创建一个MutationObserver实例
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(async(mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList.contains('mu-popover') || node.querySelector('.mu-popover')) {
                            const list = document.querySelector('.mu-menu-list').children
                            Array.from(list||'').forEach(item=>{
                                if(item.outerText==='WebP'){
                                    item.style = "display: none"
                                }
                            })
                        }
                    }
                });
            }
        });
    });

    // 选择要观察的目标节点
    const targetNode = document.body;

    // 配置观察选项
    const config = {
        childList: true,
        attributes: true,
        subtree: true
    };

    // 开始观察
    observer.observe(targetNode, config);

}