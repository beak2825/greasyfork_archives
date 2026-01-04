// ==UserScript==
// @name         b站多P视频进度计算
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  计算多P视频已观看部分总进度
// @author       ElZhao
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437948/b%E7%AB%99%E5%A4%9AP%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/437948/b%E7%AB%99%E5%A4%9AP%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hmsToSecondsOnly(str) {
        var p = str.split(':'),
            s = 0, m = 1;
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
        return s;
    }
    setTimeout(() => {
        var counter = 0;
        var myTimer = setInterval(() => {
            ++counter;
            let total_time = 0;
            let current_time = 0;
            for (let node of document.querySelectorAll('div#multi_page div.cur-list ul li')) {
                if (node.getAttribute('class') == 'watched on' || node.getAttribute('class') == 'on') {
                    current_time = total_time;
                }
                total_time += hmsToSecondsOnly(node.querySelector('div.duration').textContent);
            }
            if (total_time == 0 && counter >= 5) {
                clearInterval(myTimer);
            }
            let watch_progress = current_time / total_time;
            let data = document.querySelector('div.video-data');
            let node = data.querySelector('span#progress ');
            let texts = '播放总进度：' + (current_time / 60).toFixed(0) + 'min' + ' / ' + (total_time / 60).toFixed(0) + 'min' + ' ( ' + (watch_progress * 100).toFixed(2) + '%' + ' )';
            if (!isNaN(watch_progress)) {
                if (node == null) {
                    var span = document.createElement("span");
                    span.id = 'progress'
                    span.textContent = texts;
                    data.innerHTML += '&nbsp;&nbsp;&nbsp;'
                    data.appendChild(span);
                } else {
                    node.textContent = texts
                }
            }
        }, 2000)
    }, 1000)
})();