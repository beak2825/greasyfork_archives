// ==UserScript==
// @name         视频控制
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  视频滚轮控制6.4
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
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532657/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/532657/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        SEEK_STEP: 5,
        WHEEL_THROTTLE: 100,
        DOMAIN_RULES: {
            'www.bilibili.com': ['#bilibili-player video'],
            'www.youtube.com': ['#movie_player video'],
            'www.xiaohongshu.com': ['#noteContainer video'],
            'v.qq.com': ['fake-iframe-video'],
            'missav.ai': ['.plyr__video-wrapper video'],
            'jable.tv': ['#player'],
            'www.eporner.com': ['#EPvideo_html5_api'],
            'spankbang.com': ['#main_video_player_html5_api'],
            'cn.pornhub.com': ['video.mgp_videoElement'],
            'www.xvideos.com': ['#hlsplayer video'],
            'xojav.tv': ['#player'],
            'tktube.com': ['#kt_player video'],
            'www.91porn.com': ['#player_one_html5_api']
        }
    };

    // 状态变量
    let activeVideo = null;
    let lastAction = 0;

    // 可视性检测
    const isVisible = el => el.offsetWidth > 0 && el.offsetHeight > 0;

    // 视频检测逻辑
    const findActiveVideo = target => {
        const { hostname } = location;
        const rules = CONFIG.DOMAIN_RULES[hostname];

        // 域名专用检测
        if (rules) {
            for (const selector of rules) {
                const video = document.querySelector(selector);
                if (video && isVisible(video)) return video;
            }
            return null;
        }

        // 通用检测
        return target.closest('video') || document.querySelector('video');
    };

    // 区域检测
    const isInVideoArea = (e, video) => {
        const rect = video.getBoundingClientRect();
        return e.clientX >= rect.left && e.clientX <= rect.right &&
               e.clientY >= rect.top && e.clientY <= rect.bottom;
    };

    // 核心控制逻辑
    const handleWheel = e => {
        const now = Date.now();
        if (now - lastAction < CONFIG.WHEEL_THROTTLE) {
            e.preventDefault();
            return;
        }

        activeVideo = findActiveVideo(e.target);
        if (!activeVideo || !isVisible(activeVideo) || !isInVideoArea(e, activeVideo)) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        const delta = Math.sign(e.deltaY);
        activeVideo.currentTime = Math.max(0,
            activeVideo.currentTime + (delta * CONFIG.SEEK_STEP)
        );
        lastAction = now;
    };

    // 资源清理
    const cleanup = () => { activeVideo = null; };

    // 初始化
    const init = () => {
        document.addEventListener('wheel', handleWheel, {
            capture: true,
            passive: false
        });

        document.addEventListener('visibilitychange', () =>
            document.visibilityState === 'hidden' && cleanup()
        );
        window.addEventListener('pagehide', cleanup);
    };

    // 启动逻辑
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init, { once: true })
        : init();
})();