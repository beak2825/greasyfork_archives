// ==UserScript==
// @name         通过UI触发播放速度设置并移除blur事件_amac
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动移除 iframe 中的 blur 事件，并通过模拟点击设置视频播放速度为 2.0x（针对 https://peixun.amac.org.cn/）
// @author       你
// @match        https://peixun.amac.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520895/%E9%80%9A%E8%BF%87UI%E8%A7%A6%E5%8F%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%AE%BE%E7%BD%AE%E5%B9%B6%E7%A7%BB%E9%99%A4blur%E4%BA%8B%E4%BB%B6_amac.user.js
// @updateURL https://update.greasyfork.org/scripts/520895/%E9%80%9A%E8%BF%87UI%E8%A7%A6%E5%8F%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%AE%BE%E7%BD%AE%E5%B9%B6%E7%A7%BB%E9%99%A4blur%E4%BA%8B%E4%BB%B6_amac.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时检查 iframe 是否加载完成
    const waitForIframe = setInterval(() => {
        const iframe = document.querySelector('#articleContext iframe'); // 定位 iframe
        if (iframe && iframe.contentWindow) {
            console.log("找到 iframe");

            // 访问 iframe 的 window 对象
            const iframeWindow = iframe.contentWindow;
            const iframeDocument = iframe.contentDocument || iframeWindow.document;

            // 移除 blur 事件监听器
            const $ = iframeWindow.$; // 检查 iframe 内的 jQuery
            if ($) {
                console.log("iframe 中的 jQuery 可用");

                // 移除 blur 事件监听器
                $(iframeWindow).off('blur'); // 移除绑定在 iframe 的 window 上的 blur 事件
                console.log("已移除 iframe 中的 blur 事件监听器");
            } else {
                console.log("iframe 中未找到 jQuery，尝试使用原生方法");

                // 如果 jQuery 不可用，使用原生方法移除事件
                try {
                    iframeWindow.removeEventListener('blur', iframeWindow.MtsWebAliPlayer.pausePlayer);
                    console.log("已通过原生方法移除 blur 事件监听器");
                } catch (e) {
                    console.error("移除事件时发生错误：", e);
                }
            }

            // 模拟点击倍速按钮
            const rateList = iframeDocument.querySelector('.rate-list'); // 定位倍速列表
            if (rateList) {
                console.log("找到倍速列表");

                // 确保倍速列表显示出来
                rateList.style.display = 'block';

                // 查找并点击 2.0x 的按钮
                const rateButton = rateList.querySelector('li[data-rate="2.0"]');
                if (rateButton) {
                    console.log("找到 2.0x 倍速按钮");

                    // 模拟点击
                    rateButton.click();
                    console.log("已触发 2.0x 倍速设置");

                    // 隐藏倍速列表
                    rateList.style.display = 'none';
                } else {
                    console.error("未找到 2.0x 倍速按钮");
                }
            } else {
                console.error("未找到倍速列表");
            }

            clearInterval(waitForIframe); // 停止定时器
        }
    }, 500); // 每 500 毫秒检查一次
})();