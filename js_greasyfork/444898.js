// ==UserScript==
// @name         b站视频页整理
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  echo hello world
// @author       zycat
// @license GPL
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/444898/b%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%E6%95%B4%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/444898/b%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%E6%95%B4%E7%90%86.meta.js
// ==/UserScript==

(function () {
    'use strict';


    var ival1 = setInterval(() => {
        //弹幕区
        if (document.getElementsByClassName('bui-danmaku-switch-input') && document.getElementsByClassName('bui-danmaku-switch-input')[0]) {
            if (document.getElementsByClassName('bui-danmaku-switch-input')[0].checked) {
                document.getElementsByClassName('bui-danmaku-switch-input')[0].click();
                  clearInterval(ival1)
            }
          //  document.getElementsByClassName('bilibili-player-video-danmaku-root')[0].style.display = 'none'
        }
    }, 1000)
    //评论区
    var ival = setInterval(() => {
        if (document.getElementsByClassName('bb-comment') && document.getElementsByClassName('bb-comment')[0]) {
            document.getElementsByClassName('bb-comment')[0].style.display = 'none';
            clearInterval(ival)
        }
    }, 1000)
    //右侧广告区
    var ival5 = setInterval(() => {
        if (document.getElementsByClassName('video-page-game-card-small') && document.getElementsByClassName('video-page-game-card-small')[0]) {
            document.getElementsByClassName('video-page-game-card-small')[0].style.display = 'none';
            clearInterval(ival5)
        }
    }, 1000)
    var ival2 = setInterval(() => {
        if (document.getElementsByClassName('video-page-special-card-small') && document.getElementsByClassName('video-page-special-card-small')[0]) {
            document.getElementsByClassName('video-page-special-card-small')[0].style.display = 'none';
            clearInterval(ival2)
        }
    }, 1000)
    //右侧弹幕区
    if (document.getElementById('danmukuBox')) {
        document.getElementById('danmukuBox').style.display = 'none';

    }
    var ival3 = setInterval(() => {
        if (document.getElementById('danmukuBox')) {
            document.getElementById('danmukuBox').style.display = 'none';
            clearInterval(ival3)
        }
    }, 1000)
    //视频下方广告区
    var ival4 = setInterval(() => {
        if (document.getElementById('activity_vote')) {
            document.getElementById('activity_vote').style.display = 'none';
            clearInterval(ival4)
        }
    }, 1000)
    //右侧推荐区
    var iva5 = setInterval(() => {
        if (document.getElementsByClassName('video-page-card-small')) {
            document.getElementsByClassName('video-page-card-small').forEach((v, i, arr) => {
                if (i > 4) {
                    v.style.display = 'none'
                }
            })
            if (document.getElementsByClassName('rec-footer') && document.getElementsByClassName('rec-footer')[0]) {
                document.getElementsByClassName('rec-footer')[0].style.display = 'none';
            }
            if (document.getElementsByClassName('fixed-nav') && document.getElementsByClassName('fixed-nav')[0]) {
                document.getElementsByClassName('fixed-nav')[0].style.display = 'none';
            }
            clearInterval(ival5)
        }
    }, 1000)
    //自动连播区

    setTimeout(() => {
        if (document.getElementsByClassName('switch-button on') || document.getElementsByClassName('switch-button')) {
            if (document.getElementsByClassName('switch-button on')[0]) {
                document.getElementsByClassName('switch-button on')[0].click();

            }
            if (document.getElementsByClassName('rec-title') && document.getElementsByClassName('rec-title')[0]) {
                document.getElementsByClassName('rec-title')[0].style.visibility = 'hidden';
            }
        }
    }, 3000)
    //广告和推荐
    setTimeout(() => {
        if (document.getElementById('right-bottom-banner')) {
            document.getElementById('right-bottom-banner').style.display = 'none'
        }
    }, 5000)
    setTimeout(() => {
        if (document.getElementById('live_recommand_report')) {
            document.getElementById('live_recommand_report').style.display = 'none'
        }
    }, 5000)

    setTimeout(() => {
        clearInterval(ival);
        clearInterval(ival1);
        clearInterval(ival2);
        clearInterval(ival2);
        clearInterval(ival4)
        clearInterval(ival5)
    }, 10000)
})();