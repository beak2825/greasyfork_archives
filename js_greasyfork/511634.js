// ==UserScript==
// @name         屏蔽flowus弹窗广告
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  屏蔽移动端flowus分享页面的弹窗广告
// @author       阿虚同学
// @license      MIT
// @match        https://flowus.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511634/%E5%B1%8F%E8%94%BDflowus%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/511634/%E5%B1%8F%E8%94%BDflowus%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定义处理函数
    function handleElements() {
        // 查找 class 为 text-white 的 <svg> 元素
        var svgElement = document.querySelector('svg.text-white');
        if (svgElement) {
            // 如果找到了元素，模拟点击并停止观察
            svgElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            observer.disconnect();
            return; // 退出函数
        }

        // 查找 id 为 gdt_template_interstitial_wrap 的 <div> 元素
        var interstitialDiv = document.getElementById('gdt_template_interstitial_wrap');
        if (interstitialDiv) {
            // 如果找到了元素，拦截其显示
            interstitialDiv.style.display = 'none';
        }
    }

    // 创建一个观察者实例来监测 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        handleElements();
    });

    // 配置观察选项
    var config = { childList: true, subtree: true };

    // 传入目标节点和观察选项
    observer.observe(document.body, config);

    // 初始检查，确保在页面加载完成后立即处理
    window.addEventListener('load', function() {
        handleElements();
    });
})();
