// ==UserScript==
// @name         共创世界(CCW)积木输出预览选中复制
// @namespace    https://greasyfork.org/zh-CN/scripts/491810
// @version      1.2
// @author       kukemc
// @description  将积木输出改为可编辑选中复制 方便开发者使用
// @match        https://www.ccw.site/gandi
// @match        https://www.ccw.site/gandi/*
// @match        https://cocrea.world/gandi
// @match        https://cocrea.world/gandi/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491810/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E7%A7%AF%E6%9C%A8%E8%BE%93%E5%87%BA%E9%A2%84%E8%A7%88%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491810/%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E7%A7%AF%E6%9C%A8%E8%BE%93%E5%87%BA%E9%A2%84%E8%A7%88%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的MutationObserver实例
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node instanceof Element && node.matches('.valueReportBox')) {
                    console.log('Matched .valueReportBox element:');
                    console.log(node);
                    node.style.userSelect = 'all';
                    node.contentEditable = true;
                }
            });
        });
    });

    // 观察整个文档
    const targetNode = document.body;

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察目标节点
    observer.observe(targetNode, config);
})();