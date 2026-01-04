// ==UserScript==
// @name               自研 - Acfun - 播放时自动网页全屏
// @name:en_US         Self-made - Acfun - Playing auto WebFull
// @description        视频播放时网页全屏，播放结束自动退出。
// @description:en_US  When the video plays, it automatically enters WebFull mode, and automatically exits this mode once the video concludes.
// @version            1.0.1
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.acfun.cn/v/*
// @match              https://www.acfun.cn/bangumi/*
// @icon               https://cdn.aixifan.com/ico/favicon.ico
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/500517/%E8%87%AA%E7%A0%94%20-%20Acfun%20-%20%E6%92%AD%E6%94%BE%E6%97%B6%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/500517/%E8%87%AA%E7%A0%94%20-%20Acfun%20-%20%E6%92%AD%E6%94%BE%E6%97%B6%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「网页标题」变量，「元素选择器」「body 元素含有类」函数。
    let title = document.title;

    function $(elm) {
        return document.querySelector(elm);
    }

    function playerStatus(match = /web|screen/) {

        // 返回结果。
        return match.test($("#ACPlayer > .container-player").dataset.bindAttr);

    }


    // 定义「元素监听」变量及其回调函数。
    const observer = new MutationObserver(() => {

        // 定义「全屏按钮」变量。
        const full = $(".fullscreen.fullscreen-screen");

        // 如果「全屏按钮」存在。
        if(full) {

            // 定义「网页全屏按钮」「视频元素」变量。
            const web = $(".fullscreen.fullscreen-web"),
                  video = $("video");

            // 如果播放器不是网页全屏或全屏状态，就网页全屏。
            if(!playerStatus()) {

                web.click();

            }

            // 监听视频播放。
            $("video").addEventListener("playing", () => {

                // 如果「网页标题」和当前页面的不一致且播放器不是网页全屏或全屏状态，就更新「视频编号」变量后全屏。
                if(title !== document.title && !playerStatus()) {

                    title = document.title;
                    web.click();

                }
            });

            // 监听视频暂停。
            $("video").addEventListener("pause", () => {

                // 如果视频已经播放完成。
                if((video.duration - video.currentTime) <= 1) {

                    // 判断网播放器状态，如果视频网页全屏或全屏就退出它们。
                    if(playerStatus(/web/)) {

                        web.click();

                    }else if(playerStatus(/screen/)) {

                        full.click();

                    }

                }

            });

            // 中止「元素监听」。
            observer.disconnect();

        }
    });

    // 配置「元素监听」需要监听的元素和参数。
    observer.observe(document.body, {
        "childList": true,
        "subtree": true
    });

})();