// ==UserScript==
// @name         csgo-raffle自动签到
// @match        http://csgo-raffle.com/spin-a-skin/
// @grant        none
// @version	 0.1
// @description	 zzzkky的挂机薅羊毛脚本系列
// @namespace	 https://greasyfork.org/zh-CN/users/154961-zzzkky
// @downloadURL https://update.greasyfork.org/scripts/33967/csgo-raffle%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/33967/csgo-raffle%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    var interval = 60*1000;  //多少毫秒执行一次
    var need_refresh = false;  //是否需要自动刷新
    var refresh_count = 10;   //自动刷新周期
    var openning = 0;
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);

    function DoMeEverySecond ()
    {
        document.getElementsByClassName("free-spin-button")[0].click();
        //刷新页面以免卡住(该网站不需要)
        if(need_refresh && ++count > refresh_count){
            count = 0;
            window.location.reload();
        }
    }
})();