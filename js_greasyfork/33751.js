// ==UserScript==
// @name         flamecases自动参与
// @match        *://flamecases.com/*
// @grant        none
// @version		 0.2
// @description	 zzzkky的挂机薅羊毛系列
// @namespace	 flamecases自动参与
// @downloadURL https://update.greasyfork.org/scripts/33751/flamecases%E8%87%AA%E5%8A%A8%E5%8F%82%E4%B8%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/33751/flamecases%E8%87%AA%E5%8A%A8%E5%8F%82%E4%B8%8E.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    var interval = 1000*60*6;  //多少毫秒执行一次
    var need_refresh = true;  //是否需要自动刷新
    var refresh_count = 5;   //自动刷新周期
    var openning = 0;
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);

    function DoMeEverySecond ()
    {
        if (!window.location.href.match("https://flamecases.com/en/freecase")){
            window.location.href="https://flamecases.com/en/freecase";
        }
        //点击参与
        x = document.getElementsByClassName("open-case");
        if(x[0]){
            x[0].click();
        }
        //5分钟刷新一次
        if(need_refresh && ++count > refresh_count){
            count = 0;
            window.location.reload();
        }
    }

})();