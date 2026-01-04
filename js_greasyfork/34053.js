// ==UserScript==
// @name         hellcase自动开箱
// @match        https://hellcase.com/*
// @grant        none
// @version		 0.1
// @description	 zzzkky的挂机薅羊毛脚本系列
// @namespace	 https://greasyfork.org/zh-CN/users/154961-xiaozzz
// @downloadURL https://update.greasyfork.org/scripts/34053/hellcase%E8%87%AA%E5%8A%A8%E5%BC%80%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/34053/hellcase%E8%87%AA%E5%8A%A8%E5%BC%80%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    var interval = 1000*61;  //多少毫秒执行一次
    var need_refresh = true;  //是否需要自动刷新
    var refresh_count = 5;   //自动刷新周期
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);

    function DoMeEverySecond ()
    {
        //如果不是每日开箱界面则打开
        if (!window.location.href.match("https://hellcase.com/en/dailyfree")){
            window.location.href="https://hellcase.com/en/dailyfree";
        }
        //开箱
        x = document.getElementById("btn_open_daily_free");
        if(x){
            x.click();
        }
        //5分钟刷新一次
        if(need_refresh && ++count > refresh_count){
            count = 0;
            window.location.reload();
        }
    }

})();