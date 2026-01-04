// ==UserScript==
// @name         B站合集计时
// @namespace    mikey
// @version      0.2
// @description  获取观看合集时整体时间进度，点击视频标题弹出
// @author       mikey
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493832/B%E7%AB%99%E5%90%88%E9%9B%86%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/493832/B%E7%AB%99%E5%90%88%E9%9B%86%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onLoad
    var $ = $ || window.$;
    var dayjs = dayjs || window.dayjs;
    function convertMinutesAndSecondsToSeconds(timeString) {
        // 分割字符串得到分和秒的数值
        var parts = timeString.split(':');
        // 确保输入是有效的
        if (parts.length === 2) {
            var minutes = parseInt(parts[0], 10);
            var seconds = parseInt(parts[1], 10);
            // 计算总秒数
            return minutes * 60 + seconds;
        } else {
            throw new Error('Invalid time format. Please use "mm:ss".');
        }
    }
    function convertSecondsToTimeFormat(totalSeconds) {
        var hours = Math.floor(totalSeconds / 3600); // 总秒数除以一小时的秒数得到小时数
        var minutes = Math.floor((totalSeconds % 3600) / 60); // 剩余秒数除以一分钟的秒数得到分钟数
        var seconds = totalSeconds % 60; // 剩余秒数得到秒

        // 确保小时、分钟和秒都是两位数，不足两位的前面补0
        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        // 返回格式化的时间字符串
        return `${hours}:${minutes}:${seconds}`;
    }
    var getCurTime = function(){
        var list = $('#multi_page').find('.list-box').children();
        var curIndex = $('#multi_page').find('.list-box').children().index($('#multi_page').find('li.on').eq(0))
        var sumTime = 0;
        var preTime = 0;
        list.each(function(index){
            var $el = $(this);
            var time = $el.find('.duration').eq(0).text();
            var seconds = convertMinutesAndSecondsToSeconds(time);
            sumTime = sumTime + seconds;
            if(index === curIndex-1){
               preTime = sumTime
            }
        })
        var curVideoUseTime = convertMinutesAndSecondsToSeconds($('.bpx-player-ctrl-time-current').eq(0).text())
        var curVideoAllTime = convertMinutesAndSecondsToSeconds($('.bpx-player-ctrl-time-duration').eq(0).text())
        var curVideoAll = convertSecondsToTimeFormat(curVideoAllTime)
        var use = convertSecondsToTimeFormat(preTime+curVideoUseTime)
        var all = convertSecondsToTimeFormat(sumTime)
        alert(use+'/'+ (sumTime?all:curVideoAll))
    }
    $(() => {
        $('.video-title').on('click',()=>{
          getCurTime()
        })

    })
})();