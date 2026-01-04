// ==UserScript==
// @name         嘉兴市专业技术人员继续教育平台自动学习
// @namespace    http://zy.jxkp.net/
// @version      1.1
// @description  自动学习,自动续播,静音
// @author       happyghw
// @match        *://zy.jxkp.net/Person/Play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463309/%E5%98%89%E5%85%B4%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/463309/%E5%98%89%E5%85%B4%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        setInterval(function () {
            for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
                var current_video = document.getElementsByTagName('video')[i]

                //允许视频后台播放，后台播放不记已学时长，故取消
                /* document.addEventListener("visibilitychange", function() {
                    if (document.hidden) {
                        let videos = document.getElementsByTagName("video");
                        for (let i = 0; i < videos.length; i++) {
                            videos[i].play();
                        }
                    }
                }); */

                // 静音
                current_video.volume = 0

                // 设置倍速，倍速播放不记已学时长，故取消
                // current_video.playbackRate = 2

                // 视频播放结束后，模拟点击“下一课”
                if (current_video.ended) {
                    setTimeout(function (){
                        // 查找具有类名 "pull-right" 的元素
                        var nextText = document.getElementsByClassName("pull-right");

                        // 检查是否有匹配的元素
                        if (nextText.length > 0) {
                            // 找到第二个匹配元素的第二个子节点
                            var nexttag = nextText[1].childNodes[1];

                            // 检查子节点是否是一个链接（<a>标签）
                            if (nexttag.tagName === 'A') {
                                // 如果是链接，模拟点击它
                                nexttag.click();
                            }
                        }
                    },2000)
                }
            }
        },2000)
    }})();