// ==UserScript==
// @name               自研 - 哔哩哔哩 - 播放时自动网页全屏
// @name:en_US         Self-made - BiliBili - Playing auto WebFull
// @description        视频播放时自动进入网页全屏，结束时自动退出。
// @description:en_US  Automatically enter Web Fullscreen when video playback starts and exit when the video ends.
// @version            2.0.1
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.bilibili.com/video/*
// @match              https://www.bilibili.com/bangumi/play/*
// @match              https://www.bilibili.com/festival/*
// @icon               https://static.hdslb.com/images/favicon.ico
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494553/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E6%92%AD%E6%94%BE%E6%97%B6%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494553/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E6%92%AD%E6%94%BE%E6%97%B6%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「元素快捷选择器($(元素定位符))」「元素定位符常量(selectors)」和「配置(config)」变量。
    var $ = (elm) => { return document.querySelector(elm) },
selectors = {
    playerContainer: "#bilibili-player",        // 播放器容器。
    webFullScreenBtn: ".bpx-player-ctrl-web",  // 网页全屏按钮。
    wideScreenBtn: ".bpx-player-ctrl-wide",   // 网页宽屏按钮。
    videoElement: "#bilibili-player video"   // 视频元素。
},
   config = {
       "autoWebFS": true,             // 新窗口自动网页全屏。Automatically enter web fullscreen in new window.
       "switchAutoFS": true,         // 切换视频时自动网页全屏。Automatically enter web fullscreen when switching videos.
       "exitAfterComplete": true,   // 视频完播后退出全屏。Exit fullscreen mode after video playback completes.
       "disableWide": false        // 禁用播放器宽屏状态。Disable player's widescreen mode.
       // "autoWebFS": false,            // 新窗口自动网页全屏。Automatically enter web fullscreen in new window.
       // "switchAutoFS": false,        // 切换视频时自动网页全屏。Automatically enter web fullscreen when switching videos.
       // "exitAfterComplete": false,  // 视频完播后退出全屏。Exit fullscreen mode after video playback completes.
       // "disableWide": true         // 禁用播放器宽屏状态。Disable player's widescreen mode.
   };


    // 定义「播放器监听器(playerObserver)」构造函数。
    const playerObserver = new MutationObserver((mutations) => {

        // 定义「网页全屏按钮(webFullBtn)」变量。
        const webFullBtn = $(selectors.webFullScreenBtn);

        // 如果「网页全屏按钮」存在。
        if(webFullBtn) {

            // 处理禁用网页宽屏。
            // 定义「宽屏按钮(wideBtn)」变量。
            const wideBtn = $(selectors.wideScreenBtn);

            // 如果「配置」变量的「禁用播放器宽屏状态」为启用且宽屏按钮被展示。
            if(config.disableWide && wideBtn.style.display === "") {

                // 隐藏「宽屏按钮」。
                wideBtn.style.display = "none";

                // 定义「body 监听器(bodyObserver)」构造函数。
                const bodyObserver = new MutationObserver((mutations) => {

                    // 监听 body 的类，如果播放器处于宽屏状态就退出并停止监听。
                    if($("body.player-mode-wide")) {

                        $(selectors.wideScreenBtn).click();
                        bodyObserver.disconnect();

                    }

                });

                // 配置「body 监听器」。
                bodyObserver.observe(document.body, {

                    attributes: true,
                    attributeFilter: ["class"]

                });


            }

            // 处理自动全屏。
            // 如果「配置」变量的「新窗口自动网页全屏」为启用、未处于网页全屏或全屏状态。
            if(config.autoWebFS && !($("body.player-mode-web") || $("body.player-mode-full"))) {

                webFullBtn.click();

            }

            // 处理视频完播后退出全屏。
            // 监听视频播放完成。
            $(selectors.videoElement).onended = (video) => {

                // 如果「配置」变量的「视频完播后退出全屏」为启用、处于网页全屏或全屏状态、视频进度与长度差别小于 1 秒且自动连播未开启，就关闭全屏状态。
                if(config.exitAfterComplete && ($("body.player-mode-web") || $("body.player-mode-full")) && (video.target.duration - video.target.currentTime) <= 1 && !$(".bpx-player-ctrl-setting-handoff-content input").checked) {

                    webFullBtn.click();

                }

            }

            // 停止监听。
            playerObserver.disconnect();

        }

    });

    // 配置「播放器监听器」。
    playerObserver.observe($(selectors.playerContainer), {

        childList: true,
        subtree: true,
        attributes: false

    });


    // 定义「网页标题」变量，「网页标题监听器(titleObserver)」构造函数。
    var title = document.title;

    new MutationObserver((mutations) => {

        // 如果「配置」变量的「切换视频时自动网页全屏」为启用、网页标题和此前的不一致且未处于网页全屏或全屏状态，就更新「网页标题」变量内容并点击「网页全屏按钮」。
        if (config.switchAutoFS && title !== document.title && !($("body.player-mode-web") || $("body.player-mode-full"))) {

            title = document.title
            $(selectors.webFullScreenBtn).click();

        }
    }).observe($('title'), { attributeFilter: ['innerText'], childList: true });

})();