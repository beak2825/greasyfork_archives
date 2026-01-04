// ==UserScript==
// @name         dealskins自动签到
// @match        https://dealskins.com/*
// @grant        none
// @version  0.4
// @description  zzzkky的挂机薅羊毛脚本系列
// @namespace    https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/33773/dealskins%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/33773/dealskins%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    var interval = 61*1000;  //多少毫秒执行一次
    var need_refresh = true;  //是否需要自动刷新
    var refresh_count = 5;   //自动刷新周期
    var openning = 0;
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);

    function DoMeEverySecond ()
    {
        //1小时签到
        if (window.location.href.match("https://dealskins.com/case/cash")){
            x = document.getElementById("btnOpen");
            if(x){
                x.click();
            }
        }

        //2小时参与免费枪
        if (window.location.href.match("https://dealskins.com/free-case")){
            x = document.getElementById("btnSell");
            if(x){
                x.click();
            }
        }

        //刷新页面以免卡住(该网站可能需要)
        if(need_refresh && ++count > refresh_count){
            count = 0;
            window.location.reload();
        }
    }

})();