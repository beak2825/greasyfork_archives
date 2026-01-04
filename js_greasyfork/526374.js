// ==UserScript==
// @license MIT
// @name         自动点击弹窗按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击弹窗中的“好的”按钮
// @author       YourName
// @match        https://eduv.hbyihua.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526374/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%BC%B9%E7%AA%97%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/526374/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%BC%B9%E7%AA%97%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数
    const config = {
        buttonText: '好的', // 需要点击的按钮文字
        buttonSelector: '.layui-layer-btn0', // 按钮的选择器
        checkInterval: 500, // 检查间隔（毫秒）
        debugMode: true // 调试模式（打印日志）
    };

    // 核心检测函数
    function findAndClickButton() {
        // 通过选择器查找按钮
        const button = document.querySelector(config.buttonSelector);
        if (button) {
            if (config.debugMode) console.log('找到按钮：', button);
            try {
                button.click(); // 点击按钮
                if (config.debugMode) console.log('已点击按钮');
            } catch (e) {
                if (config.debugMode) console.warn('点击失败：', e);
            }
            return true;
        }
        return false;
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        if (!findAndClickButton() && config.debugMode) {
            console.log('未发现目标按钮');
        }
    });

    // 启动监听
    observer.observe(document.body, {
        childList: true, // 监听子节点变化
        subtree: true // 监听所有后代节点
    });

    // 启动定时检查作为备用方案
    const intervalId = setInterval(() => {
        if (findAndClickButton()) {
            clearInterval(intervalId); // 停止检查
        }
    }, config.checkInterval);

    // 初始立即检查一次
    setTimeout(findAndClickButton, 1000);
})();