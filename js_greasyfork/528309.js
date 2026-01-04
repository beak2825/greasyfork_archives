// ==UserScript==
// @name         ✌学习通，青书学堂|学起plus||国开|智慧职教|等各种成人教育网站|，均支持视频加速服务|指定倍速✌👈
// @namespace    white996_1
// @version      1.0.0
// @description  使用前请务必打开浏览器开发者模式，按F2后即可执行，使用前一定要看脚本使用说明|脚本可完美运行
// @author       white996_1
// @run-at       document-end
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528309/%E2%9C%8C%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BC%8C%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%7C%E5%AD%A6%E8%B5%B7plus%7C%7C%E5%9B%BD%E5%BC%80%7C%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%7C%E7%AD%89%E5%90%84%E7%A7%8D%E6%88%90%E4%BA%BA%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%7C%EF%BC%8C%E5%9D%87%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%9C%8D%E5%8A%A1%7C%E6%8C%87%E5%AE%9A%E5%80%8D%E9%80%9F%E2%9C%8C%F0%9F%91%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528309/%E2%9C%8C%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BC%8C%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%7C%E5%AD%A6%E8%B5%B7plus%7C%7C%E5%9B%BD%E5%BC%80%7C%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%7C%E7%AD%89%E5%90%84%E7%A7%8D%E6%88%90%E4%BA%BA%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%7C%EF%BC%8C%E5%9D%87%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%9C%8D%E5%8A%A1%7C%E6%8C%87%E5%AE%9A%E5%80%8D%E9%80%9F%E2%9C%8C%F0%9F%91%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = {
        bilibili: 'bwp-video',
        douyin: '.xg-video-container video',
        other: '傻瓜你看不懂代码，就知道会举报，举报大白脚本得祝你生孩子没屁眼，笑死'
    };

    function registerMenu() {
        try {
            GM_registerMenuCommand("减速/加速", () => {
                const rate = prompt("请输入您的速率(0-16)", "2.0");
                if (isValidRate(rate)) {
                    setPlaybackRate(rate);
                } else {
                    alert("无效数值");
                }
            }, "rate");
        } catch (error) {
            console.error("注册菜单命令失败:", error);
        }
    }

    function isValidRate(rate) {
        return !isNaN(rate) && rate >= 0 && rate <= 16;
    }

    function onKeyDown(event) {
        if (event.key === 'F2' || event.keyCode === 113) {
            event.preventDefault();
            promptForRate();
        }
    }

    function promptForRate() {
        const rate = prompt("请输入您的速率(0-16)", "2.0");
        if (isValidRate(rate)) {
            setPlaybackRate(rate);
        } else {
            alert("无效数值");
        }
    }

    function setPlaybackRate(rate) {
        let video = findVideoElement();
        if (video) {
            video.playbackRate = parseFloat(rate);
        } else {
            console.error("未找到视频元素");
        }
    }

    function findVideoElement() {
        let video = null;
        Object.keys(selectors).forEach((key) => {
            if (location.host.replace(/\./g, "").includes(key)) {
                video = document.querySelector(selectors[key]);
            }
        });

        return video || document.querySelector('video');
    }

    registerMenu();
    document.addEventListener('keydown', onKeyDown);

})();
