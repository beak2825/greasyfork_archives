// ==UserScript==
// @name         计算b站合集时间
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  在具体视频网页计算b站合集时间
// @author       yky
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495747/%E8%AE%A1%E7%AE%97b%E7%AB%99%E5%90%88%E9%9B%86%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/495747/%E8%AE%A1%E7%AE%97b%E7%AB%99%E5%90%88%E9%9B%86%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function calculateTotalTime(timeStrings) {
        let totalSeconds = 0;

        timeStrings.forEach(timeStr => {
            // 检查时间字符串的格式并分割
            let parts = timeStr.split(':');
            let hours = 0, minutes = 0, seconds = 0;

            if (parts.length === 3) {
                // hh:mm:ss 格式
                hours = parseInt(parts[0], 10);
                minutes = parseInt(parts[1], 10);
                seconds = parseInt(parts[2], 10);
            } else if (parts.length === 2) {
                // mm:ss 格式
                minutes = parseInt(parts[0], 10);
                seconds = parseInt(parts[1], 10);
            } else if (parts.length === 1) {
                // ss 格式
                seconds = parseInt(parts[0], 10);
            } else {
                throw new Error('无效的时间格式');
            }

            // 将时间转换为秒并累加
            totalSeconds += hours * 3600 + minutes * 60 + seconds;
        });

        // 转换总秒数回 hh:mm:ss 格式
        let totalHrs = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let totalMins = Math.floor(totalSeconds / 60);
        let totalSecs = totalSeconds % 60;

        return {
            totalSeconds: totalSeconds,
            formattedTime: `${totalHrs.toString().padStart(2, '0')}:${totalMins.toString().padStart(2, '0')}:${totalSecs.toString().padStart(2, '0')}`
        };
    }
    setTimeout(()=> {
        var multi_page = document.getElementById('multi_page');
        var durations = Array.from(multi_page.querySelectorAll('.duration')).map(item => item.innerText);
        var totalTime = '';
        totalTime = calculateTotalTime(durations)
        var totalTimeEle = document.createElement('span');
        totalTimeEle.innerText = totalTime.formattedTime;
        totalTimeEle.style.position = 'absolute';
        totalTimeEle.style.top = '16px';
        totalTimeEle.style.right = '120px';
        totalTimeEle.style.fontSize = '16px';
        multi_page.querySelector('.head-right').appendChild(totalTimeEle)
        console.log('totalTime', totalTime);
        var seenTime='';
        var index = Array.from(document.querySelector('.list-box').querySelectorAll('li')).findIndex(item => item.classList.contains('on'))
        var array = durations.slice(0, index+1)
        seenTime = calculateTotalTime(array)
        var seenTimeEle = document.createElement('span');
        seenTimeEle.innerText = '已看时长:'+seenTime.formattedTime;
        seenTimeEle.style.position = 'absolute';
        seenTimeEle.style.top = '0px';
        seenTimeEle.style.right = '120px';
        seenTimeEle.style.fontSize = '16px';
        multi_page.querySelector('.head-right').appendChild(seenTimeEle)
    },1000)

    // Your code here...
})();