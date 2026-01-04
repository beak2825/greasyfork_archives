// ==UserScript==
// @name         2022_福建药师协会_执业药师继续教育学习平台-学习助手    切换屏幕,视频不暂停
// @version      1.3.4
// @description  切换屏幕,视频不暂停
// @author       You
// @match        https://fjlpa.mtnet.com.cn/video/*
// @grant        none
// @license     MIT
// @namespace www.31ho.com
// @downloadURL https://update.greasyfork.org/scripts/434665/2022_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%20%20%20%E5%88%87%E6%8D%A2%E5%B1%8F%E5%B9%95%2C%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/434665/2022_%E7%A6%8F%E5%BB%BA%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A_%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%20%20%20%E5%88%87%E6%8D%A2%E5%B1%8F%E5%B9%95%2C%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保jQuery已加载
    function loadJQuery(callback) {
        if (typeof $ !== 'undefined' && $.fn.jquery) {
            callback();
        } else {
            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = callback;
            document.head.appendChild(script);
        }
    }

    // 页面加载时滚动到底部
    window.onload = function() {
        var h = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollTo(h, h);

        // 定期检查页面URL并执行相应的操作
        setInterval(() => {
            try {
                let hre = location.href;
                if (hre.includes("https://fjlpa.mtnet.com.cn/video")) {
                    if (document.querySelector("video").paused) {
                        document.querySelector("video").play();
                    }
                }
            } catch (error) {
                console.error("定期检查页面URL时发生错误:", error);
            }
        }, 5000);

        // 每20分钟重新加载页面
        setInterval(function() {
            window.location.reload();
        }, 20 * 60 * 1000);

        // 隐藏继续看视频弹窗
        $('.el-dialog__footer').hide();
    };

    // 处理页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // 页面重新变为可见时，尝试恢复视频播放
            const videoElement = document.querySelector('video');
            if (videoElement && videoElement.paused) {
                videoElement.play().catch(error => {
                    console.error("无法自动播放视频:", error);
                });
            }

            // 重新隐藏继续看视频弹窗
            $('.el-dialog__footer').hide();
        }
    });

    // 加载jQuery并执行主逻辑
    loadJQuery(() => {
        // 隐藏继续看视频弹窗
        $('.el-dialog__footer').hide();

        // 其他逻辑可以在这里添加
    });
})();