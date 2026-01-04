// ==UserScript==
// @name         音视频解析
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  支持爱奇艺、腾讯视频、优酷视频、哔哩哔哩、乐视、PPTV、芒果TV的视频解析，和网易云音乐免费歌曲的解析及下载。弹窗显示会有延迟，耐心等待网站完全加载完成即可。部分网站无反应可刷新重试。若浏览器阻止弹出式窗口，请在浏览器中设置始终显示弹出式窗口。
// @author       achtlv
// @match        http://*.163.com/*/song?id=*
// @match        https://*.163.com/*/song?id=*
// @match        http://*.mgtv.com/b/*/*.html?*
// @match        https://*.mgtv.com/b/*/*.html?*
// @match        http://*.iqiyi.com/v*
// @match        https://*.iqiyi.com/v*
// @match        http://*.bilibili.com/bangumi/play/*
// @match        https://*.bilibili.com/bangumi/play/*
// @match        http://*.youku.com/alipay_video*id*
// @match        https://*.youku.com/alipay_video*id*
// @match        http://*.qq.com/x/*/*
// @match        https://*.qq.com/x/*/*
// @match        http://*.le.com/vplay_*
// @match        https://*.le.com/vplay_*
// @match        http://*.pptv.com/show/*
// @match        https://*.pptv.com/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519778/%E9%9F%B3%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/519778/%E9%9F%B3%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoSites = {
        "mgtv.com": "https://www.ckplayer.vip/jiexi/?url=",
        "bilibili.com": "https://jx.2s0.cn/player/analysis.php?v=",
        "youku.com":    "https://jiexi.789jiexi.com/?url=",
        "v.qq.com":     "https://jx.2s0.cn/player/analysis.php?v=",
        "iqiyi.com":    "https://jiexi.789jiexi.com/?url=",
        "le.com":       "https://jx.xmflv.com/?url=",
        "pptv.com":     "https://jx.xmflv.com/?url="
    };

    const url = window.location.href;
    console.log("当前URL:", url);

    // 弹出原生确认弹窗
    let ok = confirm('确定解析？');
    if (ok) {
        // 视频平台解析
        for (const site in videoSites) {
            if (url.includes(site)) {
                console.log(`匹配到视频网站: ${site}`);
                window.open(videoSites[site] + encodeURIComponent(url), '_blank');
                return;
            }
        }

        // 网易云音乐解析
        const match = url.match(/id=(\d+)/);
        if (match) {
            console.log("匹配到网易云音乐");
            window.open(`http://music.163.com/song/media/outer/url?id=${match[1]}`, '_blank');
            return;
        }
    } else {
        console.log("取消解析");
    }
})();