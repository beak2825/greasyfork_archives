// ==UserScript==
// @name         删除刺猬猫打开弹幕
// @namespace    http://tampermonkey.net/
// @version      2024-10-02
// @description  检测并删除页面上的打开弹幕
// @author       muyuanjin
// @match        https://www.ciweimao.com/chapter/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511196/%E5%88%A0%E9%99%A4%E5%88%BA%E7%8C%AC%E7%8C%AB%E6%89%93%E5%BC%80%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/511196/%E5%88%A0%E9%99%A4%E5%88%BA%E7%8C%AC%E7%8C%AB%E6%89%93%E5%BC%80%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 删除指定的弹幕盒子
     */
    function removeBarrageBox() {
        const barrageBox = document.getElementById('J_BarrageBox');
        if (barrageBox) {
            barrageBox.remove();
            console.log('已删除弹幕盒子');
        }
    }

    // 初始检查
    removeBarrageBox();

    // 使用MutationObserver监视DOM变化
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                // 检查新添加的节点中是否包含弹幕盒子
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.id === 'J_BarrageBox' || node.querySelector('#J_BarrageBox')) {
                            removeBarrageBox();
                        }
                    }
                });
            }
        }
    });

    // 配置观察选项
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
