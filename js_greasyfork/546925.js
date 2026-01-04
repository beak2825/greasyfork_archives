// ==UserScript==
// @name         视频播放器倍速
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  任意浏览器视频倍速播放，按键调速。
// @author       bsq
// @include      *
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546925/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/546925/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 辅助函数：保留两位小数，四舍五入，去掉尾随零
    function roundRate(rate) {
        return parseFloat(rate.toFixed(2));
    }

    // 轻提醒 Toast 函数
    function Toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;

        // 清除旧提示
        let old = document.getElementById('video-toast');
        if (old) old.remove();

        var m = document.createElement('div');
        m.id = 'video-toast';
        m.innerHTML = msg;
        m.style.cssText = `
        position: fixed !important;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2147483647 !important;
        pointer-events: none !important;
        font-family: 'Microsoft YaHei', sans-serif;
        max-width: 60%;
        min-width: 150px;
        padding: 0 14px;
        height: 40px;
        color: white;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.8);
        font-size: 16px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        opacity: 1;
        transition: opacity 0.5s ease-in;
        margin: 0;
        padding: 0;
        border: 0;
        font-weight: normal;
    `;

        // 关键：尝试找到 video 元素，并插入其最近的“定位祖先”或 body
        let video = document.querySelector('video');
        let container = document.body;

        if (video) {
            // 找到最近的有定位（relative/absolute/fixed）的祖先
            let parent = video.parentElement;
            while (parent && parent !== document.body) {
                const style = getComputedStyle(parent);
                if (style.position !== 'static' || style.transform !== 'none' || style.zIndex !== 'auto') {
                    container = parent;
                    break;
                }
                parent = parent.parentElement;
            }
        }

        // 强制添加到选中的容器
        try {
            container.appendChild(m);
        } catch (e) {
            document.body.appendChild(m);
        }

        // 强制重排
        void m.offsetWidth;

        // 淡出
        setTimeout(() => {
            m.style.opacity = '0';
            setTimeout(() => {
                if (m.parentElement) m.parentElement.removeChild(m);
            }, 500);
        }, duration);
    }

    // 主功能函数
    function mainFunc() {
        document.body.onkeydown = function (ev) {
            var e = ev || event;

            // 防止短时间重复触发
            this.lastCode = this.lastCode || 0;
            this.lastTime = this.lastTime || 0;
            if (this.lastCode === ev.keyCode) {
                if ((new Date()).getTime() - this.lastTime < 100) {
                    return;
                }
            }
            this.lastCode = ev.keyCode;
            this.lastTime = (new Date()).getTime();

            // 获取页面第一个 video 元素
            let video = document.querySelector('video');
            if (!video) return;

            // 显示按键码（调试用）
            //Toast(e.keyCode, 100);

            switch (e.keyCode) {
                case 190: // . 键：加速 0.05
                    video.playbackRate = roundRate(video.playbackRate + 0.05);
                    Toast(roundRate(video.playbackRate), 1000);
                    break;

                case 188: // , 键：减速 0.05
                    video.playbackRate = roundRate(video.playbackRate - 0.05);
                    if (video.playbackRate < 0.05) video.playbackRate = 0.05; // 防止过慢
                    Toast(roundRate(video.playbackRate), 10000);
                    break;

                case 49: // 1 键：1.0 倍速
                    video.playbackRate = 1;
                    Toast(1, 100);
                    break;

                case 50: // 2 键：2.0 倍速
                    video.playbackRate = 2;
                    Toast(2, 100);
                    break;

                case 51: // 3 键：3.0 倍速
                    video.playbackRate = 3;
                    Toast(3, 100);
                    break;

                case 52: // 4 键：4.0 倍速
                    video.playbackRate = 4;
                    Toast(4, 100);
                    break;

                default:
                    return;
            }

            // 阻止默认行为（可选，防止某些页面冲突）
            e.preventDefault();
        };
    }

    // 页面加载和 hash 变化时执行
    window.addEventListener('load', mainFunc);
    window.addEventListener('hashchange', mainFunc);
    mainFunc(); // 立即执行一次

})();