

    // ==UserScript==
    // @name         b站快速入脑学习工具(加速播放)
    // @namespace    https://www.bilibili.com
    // @version      0.2
    // @description  其实就是视频的加速播放根据
    // @author       tuite
    // @match        https://www.bilibili.com/video/*
    // @grant        none
    // @license      none
// @downloadURL https://update.greasyfork.org/scripts/470255/b%E7%AB%99%E5%BF%AB%E9%80%9F%E5%85%A5%E8%84%91%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7%28%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470255/b%E7%AB%99%E5%BF%AB%E9%80%9F%E5%85%A5%E8%84%91%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7%28%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE%29.meta.js
    // ==/UserScript==
    (function () {
        'use strict';
        let js = `<div class="toolbar-left-item-wrap">
            <div title="加速" class="video-like video-toolbar-left-item" onclick="document.getElementsByTagName('video')[0].playbackRate=2.5">
                <span class="video-like-info video-toolbar-item-text">加速</span>
            </div>
        </div>`
        setTimeout(function () {
            document.getElementsByClassName('video-toolbar-left')[0].innerHTML += js;
        }, 3000)
    })();

