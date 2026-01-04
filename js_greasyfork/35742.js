// ==UserScript==
// @name         csgojoe轮盘100金币版
// @namespace     blue杰作
// @version     1.1
// @description  blue挂机薅羊毛系列
// @author      blue
// @match        https://csgojoe.com/roulette
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35742/csgojoe%E8%BD%AE%E7%9B%98100%E9%87%91%E5%B8%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/35742/csgojoe%E8%BD%AE%E7%9B%98100%E9%87%91%E5%B8%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
     var count = 0;
    var interval = 10*1000;
    var need_refresh = false;
    var refresh_count = 1;
    var openning = 0;
         var target1 = 9999.9;
        var target2 = 38000.1;
        var target3 = 39000.1;
        var target4 = 15000.1;
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);
    function DoMeEverySecond ()
    {
        var coins = parseInt(document.getElementsByClassName("topmenuprofile")[0].childNodes[2].childNodes[3].innerHTML);
        if (coins < target3 && coins > target2) {
                document.getElementsByClassName("form-control")[0].value = 1800;
                document.getElementsByClassName("redb")[7].click();
        } else if (coins < target1) {
        if (coins > 2000){
                document.getElementsByClassName("form-control")[0].value = 2000;
        } else {
                document.getElementsByClassName("btn-warning")[10].click();
        }
                document.getElementsByClassName("greenb")[0].click();
        }else if (coins < target4 && coins > target1) {
                document.getElementsByClassName("btn-warning")[10].click();
                document.getElementsByClassName("redb")[7].click();
        }
    }
})();