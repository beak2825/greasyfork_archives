// ==UserScript==
// @name         重庆市交通干部学校在线培训平台-防挂机破解
// @namespace    http://jiacyer.com/
// @version      0.1.2
// @description  这是一个用于重庆市交通干部学校在线培训平台的防挂机破解脚本，可以实现自动继续播放视频的功能。
// @author       Jiacy
// @match        http://www.cqjtgx.com:8083/jt/site/web/study/index.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404320/%E9%87%8D%E5%BA%86%E5%B8%82%E4%BA%A4%E9%80%9A%E5%B9%B2%E9%83%A8%E5%AD%A6%E6%A0%A1%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0-%E9%98%B2%E6%8C%82%E6%9C%BA%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/404320/%E9%87%8D%E5%BA%86%E5%B8%82%E4%BA%A4%E9%80%9A%E5%B9%B2%E9%83%A8%E5%AD%A6%E6%A0%A1%E5%9C%A8%E7%BA%BF%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0-%E9%98%B2%E6%8C%82%E6%9C%BA%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timestampStr = "timestamp=11590727499471";

    // 隐藏防挂机问题弹窗
    function hiddenFunc() {
        var p1 = document.getElementsByClassName('panel window');
        for(var i = 0; i < p1.length; i++) {
            p1[i].style.display = "none";
        }

        var p2 = document.getElementsByClassName('window-shadow');
        for(i = 0; i < p2.length; i++) {
            p2[i].style.display = "none";
        }

        var p3 = document.getElementsByClassName('window-mask');
        for(i = 0; i < p3.length; i++) {
            p3[i].style.display = "none";
        }
    };

    // 检测是否出现防挂机问题，并继续播放视频
    function intervalFunc() {
        var curPage = document.getElementById("cur_page");
        if (curPage != null) {
            var iframe = curPage.getElementsByTagName("iframe");

            if (iframe != null && iframe.length > 0) {
                iframe = iframe[0];
                var url = iframe.src;

                var currTime = url.substring(url.indexOf("timestamp"));
                if (currTime != timestampStr) {
                    url = url.substring(0, url.indexOf("timestamp"))
                    iframe.src = url + timestampStr;
                } else {
                    setTimeout(hiddenFunc, 500);
                    this.video.startTime();
                }
            }
        }
    };

    // 当检测到视频超过10秒未播放，则强制刷新页面
    var lastTime = -1;
    function refreshPage(){
        var player = document.getElementById("video").contentWindow.document.getElementById("player");
        var currentTime = Math.round(player.getVideoTime());

        if(currentTime == lastTime){
            location.reload();
        } else {
            lastTime = currentTime;
        }
    }

    // 启动固定时间间隔的任务
    if (document.getElementById("cur_page") !== null) {
        setInterval(intervalFunc, 2 * 1000);
        setInterval(refreshPage, 10 * 1000);
    }
})();