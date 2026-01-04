// ==UserScript==
// @name         时间显示
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Fullscreen Time Display 1.1
// @author       s_____________
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.youtube.com/*
// @match        https://www.xiaohongshu.com/*
// @match        https://*.baidu.com/*vid*
// @match        https://v.qq.com/x/*
// @match        https://www.iqiyi.com/v_*
// @match        https://www.youku.com/video*
// @match        https://www.mgtv.com/b/*
// @match        https://www.acfun.cn/v/*
// @match        https://v.ikanbot.com/play/*
// @match        https://www.nivod.vip/*
// @match        https://www.sourcepower.top/*
// @match        https://javdb.com/v/*
// @match        https://missav.ai/*-*
// @match        https://www.eporner.com/video-*
// @match        https://spankbang.com/*/video/*
// @match        https://jable.tv/videos/*
// @match        https://cn.pornhub.com/view_*
// @match        https://www.xvideos.com/video.*
// @match        https://tktube.com/*/videos/*
// @match        https://xojav.tv/videos/*
// @match        https://www.91porn.com/view_*
// @match        https://91porny.com/video/view*
// @match        https://avple.tv/video/*
// @match        https://rou.video/v/*
// @match        https://hsex.icu/video-*
// @match        https://hanime1.me/watch*
// @match        https://www.iwara.tv/*
// @match        https://anime1.me/category/*
// @match        https://catbox.moe/*
// @match        https://gofile.io/*
// @match        https://*.dmm.com/*
// @match        https://*.dmm.co.jp/*
// @match        https://115vod.com/*
// @match        https://player.ezdmw.com/*
// @match        https://m3u8.girigirilove.com/*
// @match        https://player.moedot.net/*
// @match        https://surrit.store/*
// @match        https://turbovidhls.com/*
// @match        https://fc2stream.tv/*
// @match        https://streamtape.com/*
// @match        https://www.douyin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532654/%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532654/%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const STYLE = {
        position: 'fixed',
        top: '5px',
        left: '5px',
        zIndex: 2147483647,
        fontSize: '16px',
        color: 'rgba(255,255,255,0.85)',
        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
        fontFamily: 'system-ui, sans-serif',
        pointerEvents: 'none',
        display: 'none'
    };

    // 创建时间元素
    const timeDisplay = document.createElement('div');
    Object.assign(timeDisplay.style, STYLE);
    document.body.appendChild(timeDisplay);

    // 时间状态管理
    let currentTime = Date.now();
    let timer = null;

    // 更新时间显示
    const updateDisplay = (time) => {
        const date = new Date(time);
        timeDisplay.textContent =
            `${date.getHours().toString().padStart(2, '0')}:${
             date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 智能定时器管理
    const manageTimer = {
        start: () => {
            const now = new Date();
            const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

            clearTimeout(timer);
            timer = setTimeout(() => {
                currentTime += 60000;
                updateDisplay(currentTime);
                timer = setInterval(() => {
                    currentTime += 60000;
                    updateDisplay(currentTime);
                }, 60000);
            }, delay);
        },
        stop: () => {
            clearTimeout(timer);
            timer = null;
        }
    };

    // 全屏处理逻辑
    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            // 进入全屏
            timeDisplay.style.display = 'block';
            currentTime = Date.now();
            updateDisplay(currentTime);
            manageTimer.start();
            document.fullscreenElement.appendChild(timeDisplay);
        } else {
            // 退出全屏
            timeDisplay.style.display = 'none';
            manageTimer.stop();
            document.body.appendChild(timeDisplay);
        }
    };

    // 事件监听
    document.addEventListener('fullscreenchange', handleFullscreen);
})();