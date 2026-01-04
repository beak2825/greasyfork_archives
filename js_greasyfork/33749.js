// ==UserScript==
// @name         darkemoon自动签到
// @match        https://www.drakemoon.com/*
// @grant        none
// @version	 0.5
// @description	 zzzkky的挂机薅羊毛脚本系列
// @namespace	 darkemoon自动签到
// @downloadURL https://update.greasyfork.org/scripts/33749/darkemoon%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/33749/darkemoon%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    var interval = 5100;  //多少毫秒执行一次
    var need_refresh = false;  //是否需要自动刷新
    var refresh_count = 10;   //自动刷新周期
    var openning = 0;
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);

    function DoMeEverySecond ()
    {
        //登录steam
        var x = document.getElementsByClassName("menu-item login");
        if(x[0]){
            x[0].click();
        }
        else{
            //跳转
            if (!window.location.href.match("https://www.drakemoon.com/get-free")){
                window.location.href="https://www.drakemoon.com/get-free";
            }

            //签到
            x = document.getElementsByClassName("borderless");
            if(x[0]){
                x[0].click();
            }
        }

        //刷新页面以免卡住(该网站不需要)
        if(need_refresh && ++count > refresh_count){
            count = 0;
            window.location.reload();
        }
    }

})();