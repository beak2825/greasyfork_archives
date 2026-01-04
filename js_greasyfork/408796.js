// ==UserScript==
// @name         B站高能进度条跳转工具-追番利器-跳片头片尾-跳高能
// @namespace    https://eliotzhang.club
// @homepage     https://eliotzhang.club
// @version      1.1
// @description  出现高能进度条的视频播放中按下P键即可跳转到当前时间后最近一次的高能处
// @author       EliotZhang
// @match        *://www.bilibili.com/*
// @run-at       document-end
// @grant        unsafeunsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/408796/B%E7%AB%99%E9%AB%98%E8%83%BD%E8%BF%9B%E5%BA%A6%E6%9D%A1%E8%B7%B3%E8%BD%AC%E5%B7%A5%E5%85%B7-%E8%BF%BD%E7%95%AA%E5%88%A9%E5%99%A8-%E8%B7%B3%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE-%E8%B7%B3%E9%AB%98%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/408796/B%E7%AB%99%E9%AB%98%E8%83%BD%E8%BF%9B%E5%BA%A6%E6%9D%A1%E8%B7%B3%E8%BD%AC%E5%B7%A5%E5%85%B7-%E8%BF%BD%E7%95%AA%E5%88%A9%E5%99%A8-%E8%B7%B3%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE-%E8%B7%B3%E9%AB%98%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // My code here...
    // 可调参数！
    let threshold = 55; // 高能阈值。只有高于此值才被当作高能点。范围：0~100。默认：55
    let interval = 5; // 两个高能点之间的最小间隔。即：从第二个高能点开始，每个高能点与前一个高能点间的最小间隔。单位：秒。默认：5
    let bias = 0; // 跳转到高能点时附加的时间偏移量。单位：秒。默认：0
    ////////////////
    // 下面无需更改！
    let tail = '\nbilibiliDanmuSkip by EliotZhang';
    let timeTable = null;
    let cid = null;

    function getPoints() {
        if (!unsafeWindow.player || unsafeWindow.player.getVideoMessage().cid == cid)
            return;
        cid = unsafeWindow.player.getVideoMessage().cid;
        console.log('Getting points...', tail);
        var elePath = document.getElementById('pbp-curve-path').firstChild;
        if (!elePath)
            return;
        let duration = Math.floor(unsafeWindow.player.getDuration());
        var len = elePath.getTotalLength();
        var points = [];
        let las = -999;
        let lpt = elePath.getPointAtLength(0 * len / duration);
        let pt = elePath.getPointAtLength(1 * len / duration);
        for (var i = 2; i < duration; i++) {
            var rpt = elePath.getPointAtLength(i * len / duration);
            if (pt.y <= 100 - threshold && pt.x > 0.01 && pt.x < 1000 && lpt.y >= pt.y && rpt.y >= pt.y) {
                let xt = pt.x / 1000 * duration;
                if (las === -999)
                    las = xt - interval - 1;
                if (xt - las > interval) {
                    las = xt;
                    points.push([xt, pt.y]);
                }
            }
            lpt = pt;
            pt = rpt;
        }
        console.log(points, tail);
        timeTable = points;
        console.log('Got points!', tail);
    }

    function jump() {
        if (timeTable == null || timeTable.length == 0 || !unsafeWindow.player) {
            console.log('No jump point found!', tail);
            return;
        }
        for (var i = 0; i < timeTable.length; ++i) {
            if (timeTable[i][0] > unsafeWindow.player.getCurrentTime()) {
                unsafeWindow.player.seek(timeTable[i][0] + bias);
                break;
            }
        }
    }

    function keydownHandler(e) {
        let keycode = e.which;
        let keyname = String.fromCharCode(keycode);
        console.log('Get key: ' + keyname, tail);
        if (keyname == 'P') {
            getPoints();
            jump();
        }
    }

    function bindEvent() {
        console.log('Binding Event!', tail);
        // Bind keydown event
        document.onkeydown = keydownHandler;
        console.log('Binded Event!', tail);
    }

    function start() {
        console.log('Started running!', tail);
        // Bind event
        bindEvent();
    }

    // Main call
    setTimeout(start, 5000);
})();