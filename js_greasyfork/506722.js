// ==UserScript==
// @name         智慧树自动播放-TTaket
// @version      1.6.4
// @description  ❤❤仅用于学习使用 我爱你哦小朱
// @author       TTaket
// @match        *://*.zhihuishu.com/*
// @match        *://*.zhihuishu.com/videoStudy*
// @match        *://*.zhihuishu.com/portals_h5*
// @match        *://*.zhihuishu.com/live*
// @match        *://*.zhihuishu.com/examh5*
// @match        *://*.zhihuishu.com/live/vod_room*
// @match        *://*.zhihuishu.com/stuExamWeb*
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1362827
// @downloadURL https://update.greasyfork.org/scripts/506722/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-TTaket.user.js
// @updateURL https://update.greasyfork.org/scripts/506722/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-TTaket.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pause_in(delay) {
        console.log("pause_in");
        return new Promise(resolve => setTimeout(() => {
            console.log("pause_in for  ", delay);
            resolve();
        }, delay));
    }

    async function pause(minMs, maxMs) {
        console.log("pause begin");
        var delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
        await pause_in(delay);
        console.log("pause end");
    }

    function getRandomDelay(minMs, maxMs) {
        console.log("getRandomDelay");
        return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    }

    function clickCloseButton() {
        var closeButton = document.querySelector('span.dialog-footer .btn');
        if (closeButton) {
            console.log('发现关闭按钮，执行点击');
            closeButton.click();
        }
    }

    async function clickSvgIcon() {
        var svgIcons = document.querySelectorAll('svg.icon.topic-option');
        if (svgIcons.length > 0) {
            console.log('发现 SVG 图标，点击第一个...');
            svgIcons[0].dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }));

            // 随机等待 1 到 5 秒
            await pause(1000, 5000);
            console.log('等待结束，点击关闭按钮');
            clickCloseButton(); // 点击关闭按钮
        }
    }

    async function processVideos() {
        // 随机等待 1 到 2 秒
        await pause(1000, 2000);
        console.log("processVideos");
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i];

            // 设置视频音量为 10%
            current_video.volume = 0.1;

            // 设置播放速度为正常速度（1.0 倍速）
            current_video.playbackRate = 1.0;

            // 如果视频播放完毕
            if (current_video.ended) {
                console.log("视频播放完毕");

                var chapterNodeList = document.querySelectorAll('span.catalogue_title');
                var j = 0;

                for (; j < chapterNodeList.length; j++) {
                    var parentDiv = chapterNodeList[j].parentNode;

                    // 检查 parentNode 是否合法 合法拥有b.fl.time_ico_half
                    var iVaild = parentDiv.querySelector('b.fl.time_ico_half');
                    console.log(parentDiv , "Check iVaild : ", iVaild);
                    if (!iVaild) {
                        console.log('not vaild continue ', chapterNodeList[j].innerText);
                        continue;
                    }

                    // 检查是否未完成的课程b.fl.time_icofinish
                    var isFinish = parentDiv.querySelector('b.fl.time_icofinish');
                    console.log(parentDiv , "Check isFinish : ", isFinish);
                    if (isFinish) {
                        console.log('已完成视频，跳过', chapterNodeList[j].innerText);
                        continue;
                    }

                    console.log('未完成视频，马上播放视频', chapterNodeList[j].innerText);
                    break;
                }

                if (j < chapterNodeList.length) {
                    console.log("未完成视频 : " , j , chapterNodeList[j]);
                    //阻塞等待10 - 20s
                    await pause(10000, 20000);
                    console.log('CLICK', chapterNodeList[j]);
                    chapterNodeList[j].dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                    }));
                    // 设置当前视频进度初始化
                    await pause(1000, 2000);
                    for (var ivideoid = 0; ivideoid < document.getElementsByTagName('video').length; ivideoid++) {
                        console.log("Set Init Video : ",document.getElementsByTagName('video')[ivideoid]);
                        document.getElementsByTagName('video')[ivideoid].currentTime = 0;
                    }
                    console.log("set end _ start new");
                } else {
                    console.log('没有找到未完成的课程');
                }
            }

            // 如果视频被暂停，重新播放
            if (current_video.paused) {
                current_video.play();
            }
        }
    }

    async function startProcessing() {
        console.log("startProcessing");
        while (true) {
            await clickSvgIcon(); // 先处理 SVG 图标
            await processVideos(); // 处理自动播放
            await pause(1000, 3000); // 随机时间间隔 1 到 3 秒
        }
    }

    startProcessing(); // 启动脚本
})();