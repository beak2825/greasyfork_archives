// ==UserScript==
// @name         手机版CSDN净化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动点击CSDN博客文章详情页的“继续”按钮，移除不需要的一些元素
// @author       Snape-max
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515886/%E6%89%8B%E6%9C%BA%E7%89%88CSDN%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/515886/%E6%89%8B%E6%9C%BA%E7%89%88CSDN%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!isMobileDevice()) {
        return;
    }
    const main = document.getElementById('main');
    main.style.marginTop = '0px';
    main.style.paddingTop = '0px';
    // 创建一个观察者实例
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 当新增节点时，尝试移除目标元素
                removeTargetElements();
                // 尝试自动点击目标按钮
                autoClickButton();
            }
        }
    });

    // 配置观察选项:
    const config = { childList: true, subtree: true };

    // 选择需要观察变动的节点
    const targetNode = document.body;

    // 开始观察
    observer.observe(targetNode, config);

    // 辅助函数：移除指定的目标元素
    function removeTargetElements() {
        removeElement('#feed-open-app-btn');
        removeElement('a.openApp.active');
        removeElement('#comment');
        removeElement('#operate');
        removeElementsByClass('recommend_list');
        removeElementsByClass('aside-header-fixed');
        removeElementsByClass('search-tag-box');
        removeElement('#csdn-toolbar');
        removeElementsByClass('weixin-shadowbox.wap-shadowbox');

        // 如果所有目标元素都已被移除，则停止观察
        if (!document.querySelector('#feed-open-app-btn, a.openApp.active, #comment, #operate, .recommend_list, .aside-header-fixed, .search-tag-box, #csdn-toolbar,weixin-shadowbox.wap-shadowbox')) {
            observer.disconnect();
        }
    }

    // 辅助函数：根据选择器移除单个元素
    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    // 辅助函数：根据类名移除多个元素
    function removeElementsByClass(className) {
        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(element => {
            element.parentNode.removeChild(element);
        });
    }

    // 辅助函数：自动点击目标按钮
    function autoClickButton() {
        const button = document.querySelector('.open-app.open-app-weixin');
        if (button) {
            button.parentNode.removeChild(button);
        }
    }

    // 检查是否是移动设备
    function isMobileDevice() {
        return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 立即尝试移除一次，以处理那些可能已经存在于DOM中的元素
    removeTargetElements();
    // 立即尝试点击一次，以处理那些可能已经存在于DOM中的按钮
    autoClickButton();
})();