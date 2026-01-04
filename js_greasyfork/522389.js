// ==UserScript==
// @name         屏蔽百度搜索网页中无用信息
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  屏蔽百度搜索网页的引导元素，并去除百度首页搜索框自动加载的热搜内容词条，清空 placeholder
// @author       sept
// @match        https://www.baidu.com/*
// @grant        none
// @license      MIT
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/522389/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E6%97%A0%E7%94%A8%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/522389/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E6%97%A0%E7%94%A8%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 在 DOM 加载前就应用样式
    var style = document.createElement('style');
    style.textContent = '#s_new_search_guide { display: none !important; }';
    document.head.appendChild(style);

    // 使用 MutationObserver 确保元素被立即隐藏
    var guideObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                var guideElement = document.getElementById('s_new_search_guide');
                if (guideElement) {
                    guideElement.style.display = 'none';
                    guideObserver.disconnect(); // 找到元素后停止观察
                }
            }
        });
    });

    // 开始观察整个文档
    guideObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 获取百度搜索框元素
    var inputElement = document.getElementById('kw'); // 百度搜索框的 ID 是 'kw'

    if (inputElement) {
        // 提前清空 placeholder
        inputElement.placeholder = '';

        // 使用 MutationObserver 监控 placeholder 的变化
        // 监控chat-input-area内的textarea
        var chatAreaObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // 查找chat-input-area内的所有textarea
                var chatArea = document.getElementById('chat-input-area');
                if (chatArea) {
                    var textareas = chatArea.querySelectorAll('textarea');
                    textareas.forEach(function (textarea) {
                        // 清空所有placeholder属性
                        textarea.placeholder = '';
                        textarea.removeAttribute('data-ai-placeholder');
                        textarea.removeAttribute('data-normal-placeholder');
                    });
                }
            });
        });

        // 开始监控body的子节点变化
        chatAreaObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        var placeholderObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'placeholder') {
                    // 如果 placeholder 被动态加载，立即清空
                    inputElement.placeholder = '';
                    placeholderObserver.disconnect(); // 停止监控，避免重复清空
                }
            });
        });

        // 配置 MutationObserver，监控 placeholder 属性的变化
        var config = {
            attributes: true, // 监控属性变化
            attributeFilter: ['placeholder'] // 只监控 placeholder 属性
        };

        // 开始监控
        placeholderObserver.observe(inputElement, config);
    }
})();
