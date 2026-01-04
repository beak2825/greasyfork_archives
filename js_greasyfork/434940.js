// ==UserScript==
// @name         上应大自动播放插件
// @version      1.3.0
// @namespace    https://www.tiankong.info/
// @description  上海应用技术大学继续教育学院自动学习插件，支持普通课程与面授课程
// @license      MIT
// @author       竟康
// @match        https://www.learnin.com.cn/user*
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @connect      www.learnin.com.cn
// @connect      work.polish.work
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/434940/%E4%B8%8A%E5%BA%94%E5%A4%A7%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/434940/%E4%B8%8A%E5%BA%94%E5%A4%A7%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

$(function () {
    'use strict';
    setTimeout(function () {
        console.log('上应自动播放插件已加载');
        let url = window.location.href;
        if (url.endsWith('?hideChapter=true')) {
            console.log('重定向目标页面');
            window.location.href = url.split('?')[0]
            setTimeout(start, 1000)
        } else if (url.indexOf('/learn/') !== -1) {
            console.log('已进入播放页面');
            start();
        } else {
            console.log('非播放页面')
        }
    }, 1000)

    function start() {
        setInterval(polling, 3000)
    }

    function polling() {
        console.log('轮询开始')
        let videoHint = document.getElementsByClassName('video-hint')[0];
        if (videoHint === undefined) {
            next();
            return;
        }
        let length = document.getElementsByClassName('pv-icon-btn-play').length;
        if (length === 2) {
            play();
            return;
        }
        let spans = videoHint.getElementsByTagName('span');
        let target = second(spans[1].innerText)
        let current = second(spans[2].innerText);
        if (current > target) {
            next();
        }
    }

    function second(time) {
        let split = time.split(":");
        return parseInt(split[0]) * 3600 + parseInt(split[1]) * 60 + parseInt(split[2])
    }

    function next() {
        console.log('切换下一个视频')
        let nextChapter = document.getElementsByClassName('next-chapter')[0];
        if (nextChapter) {
            nextChapter.getElementsByTagName('button')[0].click();
        }
    }

    function play() {
        console.log('开始播放视频')
        // 静音视频
        let volumeonElement = document.getElementsByClassName('pv-icon-volumeon')[0];
        if (volumeonElement) {
            volumeonElement.click()
        }
        // 开始播放
        document.getElementsByClassName('pv-icon-btn-play')[0].click();
        // 开启两倍速
        document.getElementsByClassName('pv-rate-select')[0].firstElementChild.click();
    }
})
;