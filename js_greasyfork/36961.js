// ==UserScript==
// @name         教师研修网自动点击继续计时和自动切换
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  教师研修网，定时检测停止计时弹窗并点击，定时检测视频是否停止播放并切换当前课程下的下一个视频
// @author       Joey
// @icon         http://i.yanxiu.com/favicon.ico
// @match        *://ipx.yanxiu.com/grain/course/*/detail*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36961/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E8%AE%A1%E6%97%B6%E5%92%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/36961/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E8%AE%A1%E6%97%B6%E5%92%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        if ($('.vcp-playtoggle').css('background-image') != undefined) {
            if ($('.ended-mask').css('display') != 'none') {
                $('.next').click();
                return;
            }
            if ($('.alarmClock-wrapper').css('display') != 'none') {
                $('.alarmClock-wrapper').click();
                console.log('继续播放');
                return;
            }
        }
    }, 3000);
})();