// ==UserScript==
// @name         隐藏斗鱼恋爱表白弹幕
// @namespace    http://tampermonkey.net/
// @version      2024-02-14-2
// @description  屏蔽斗鱼在2024-02-14 的恋爱表白活动出现的弹幕
// @author       阿冰777
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487279/%E9%9A%90%E8%97%8F%E6%96%97%E9%B1%BC%E6%81%8B%E7%88%B1%E8%A1%A8%E7%99%BD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/487279/%E9%9A%90%E8%97%8F%E6%96%97%E9%B1%BC%E6%81%8B%E7%88%B1%E8%A1%A8%E7%99%BD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let container;
    let regex = /noble-\w+/; // 正则表达式，匹配类名为 "noble-xxxxxx" 的元素
    
    // 定义一个函数，用于检查元素的类名并修改其样式
    function checkAndHide(element) {
        if (Array.from(element.classList).some(className => regex.test(className))) {
            element.style.cssText += 'display: none !important;';
        }
    }
    
    // 创建一个新的 MutationObserver 实例
    let observer = new MutationObserver(mutations => {
        // 遍历所有的 mutation 对象
        mutations.forEach(mutation => {
            // 遍历 mutation 对象中所有被添加的节点
            mutation.addedNodes.forEach(node => {
                // 检查被添加的节点是否为元素节点
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 如果是元素节点，则检查其类名并修改其样式
                    checkAndHide(node);
                }
            });
        });
    });
    
    // 配置观察器选项
    let config = { childList: true, subtree: true };
    
    // 使用 setInterval 来定期检查元素是否创建
    let checkExist = setInterval(function() {
        container = document.querySelector('#__h5player');
        if (container) {
            // 如果元素创建了，就开始观察它的变化，并清除定时器
            observer.observe(container, config);
            clearInterval(checkExist);
        }
    }, 100); // 每 100 毫秒检查一次

})();