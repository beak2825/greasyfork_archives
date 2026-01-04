// ==UserScript==
// @name         英华学堂刷课脚本(自动识别验证码)
// @namespace    http://tampermonkey.net/
// @version      2.0.5
// @description  这个项目已归档,请勿再使用
// @author       YoungLee
// @match        *://mooc.*
// @match        *://mooc.cdcas.com/user/*
// @grant        none
// @license      MIT
// @require https://update.greasyfork.org/scripts/502757/1422896/Jquery331.js
// @downloadURL https://update.greasyfork.org/scripts/512182/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%28%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512182/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%28%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81%29.meta.js
// ==/UserScript==

/**
 * 定义一个立即执行的匿名函数，用于控制视频播放逻辑
 */
(function() {
    'use strict';

    let captchaHandled = false;

    function playNext() {
        const navList = $('.detmain-navlist').parent();
        const currentChapterIndex = navList.find('.item a').index($('a.on'));
        const chapterLinks = navList.find('.item a');

        if (currentChapterIndex === chapterLinks.length - 1) {
            $('video')[0].onended = function() {
                console.log("Easy Easy，区区网课也敢班门弄斧！");
            };
        } else {
            setTimeout(function() {
                chapterLinks[currentChapterIndex + 1].click();
            }, 5000);
        }
    }

    function checkCaptchaAndPlay() {
        const captchaLayer = $('#layui-layer1');

        if (captchaLayer.length && captchaLayer.is(':visible') && !captchaHandled) {
            console.log("验证码弹窗出现，等待Random秒后自动点击开始播放按钮...");
            captchaHandled = true;
 	    const randomDelay = Math.floor(Math.random() * 4000) + 3000; 
            setTimeout(function() {
                const playButton = $('.layui-layer-btn0');

                if (playButton.length) {
                    playButton.click();
                    console.log("已自动点击开始播放按钮！");
                    captchaHandled = false;  // Reset flag after captcha is handled
                } else {
                    console.log("未找到开始播放按钮，刷新页面...");
                    location.reload();
                }
            }, randomDelay);
        }
    }

    $(document).ready(function() {
        let videoElement;

        const videoCheckTimer = setInterval(function() {
            videoElement = $('video');

            if (videoElement.length && videoElement[0].readyState === 4) {
                if (videoElement[0].paused) {
                    console.log("视频暂停，开始播放...");
                    videoElement[0].play();
                }

                videoElement[0].onended = function() {
                    playNext();
                };

                videoElement[0].muted = true;
                videoElement[0].playbackRate = 1.0;

                clearInterval(videoCheckTimer);
            }
        }, 1000);

        setInterval(checkCaptchaAndPlay, 2000);
    });
})();
