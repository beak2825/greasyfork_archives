// ==UserScript==
// @name         Bilibili 任意倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  可以自定义键位控制长按播放及正常播放的倍速，范围为 0.1 - 16 。
// @author       MnFeN
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480909/Bilibili%20%E4%BB%BB%E6%84%8F%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/480909/Bilibili%20%E4%BB%BB%E6%84%8F%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    // 以下为用户自定义内容 在这里自定义键位和速度的映射关系

    // keycode 可在此查询：https://learn.microsoft.com/zh-cn/dotnet/api/system.windows.forms.keys

    // 长按这个字典的键：长按时以此速度播放，松开后恢复原先的速度
    var sustain = {
        '16': 0.25, // Shift
        '17': 0.5, // Ctrl
        '96': 4, // 小键盘 0
        '110': 8, // 小键盘 .
    };

    // 按下这个字典的键：设置相应的播放速度
    var setOnce = {
        '111': 0.25, // 小键盘 /
        '106': 0.5, // 小键盘 *
        '97': 1, // 小键盘 1
        '98': 2, // 小键盘 2
        '99': 3, // 小键盘 3
        '100': 4, // 小键盘 4
        '101': 5, // 小键盘 5
        '102': 6, // 小键盘 6
        '103': 7, // 小键盘 7
        '104': 8, // 小键盘 8
        '105': 9, // 小键盘 9
    };

    // 按下这个字典的键：加速 (true) 或 减速 (false)
    var adjust = {
        '107': true, // 小键盘 +
        '109': false, // 小键盘 -
    };

    //  这个列表为加速或减速时可用的速度档位
    var speedList = [0.1, 0.15, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16];

    // 用户自定义内容到此为止

    var originalSpeed = 1;

    function setSpeed(speed) {
        var video = document.querySelector('video') || document.querySelector('bwp-video');
        if (video) {
            video.playbackRate = speed;
        }
    }

    function getSpeed() {
        var video = document.querySelector('video') || document.querySelector('bwp-video');
        if (video) {
            return video.playbackRate;
        }
        else return 0;
    }

    document.onkeydown = function(e) {
        var key = e.keyCode || e.which;
        if (key in sustain) {
            setSpeed(sustain[key]);
        }
        else if (key in setOnce) {
            setSpeed(setOnce[key]);
        }
        else if (key in adjust) {
            var shouldIncrease = adjust[key];
            var currentSpeed = getSpeed();
            setSpeed(getNewSpeed(currentSpeed, shouldIncrease));
        }
    };

    function getNewSpeed(currentSpeed, shouldIncrease) {
        let index;
        if (shouldIncrease) {
            index = speedList.findIndex(speed => speed > currentSpeed);
            index = (index != -1) ? index : (speedList.length - 1);
        } else {
            index = speedList.slice().reverse().findIndex(speed => speed < currentSpeed);
            index = (index != -1) ? speedList.length - index - 1 : 0;
        }
        return speedList[index];
    }

    document.onkeyup = function(e) {
        var key = e.keyCode || e.which;
        if (sustain[key]) {
            setSpeed(originalSpeed);
        }
    };
})();