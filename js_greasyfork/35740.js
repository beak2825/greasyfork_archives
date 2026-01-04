// ==UserScript==
// @name         csgojoe轮盘自动押注黑色
// @namespace     blue杰作
// @version      1.1
// @description  blue挂机薅羊毛系列
// @author        blue
// @match        https://csgojoe.com/roulette
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35740/csgojoe%E8%BD%AE%E7%9B%98%E8%87%AA%E5%8A%A8%E6%8A%BC%E6%B3%A8%E9%BB%91%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/35740/csgojoe%E8%BD%AE%E7%9B%98%E8%87%AA%E5%8A%A8%E6%8A%BC%E6%B3%A8%E9%BB%91%E8%89%B2.meta.js
// ==/UserScript==

(function() {
     var count = 0;
    var interval = 10*1000;
    var need_refresh = false;
    var refresh_count = 1;
    var openning = 0;
         var target1 = 9999.9;
        var target2 = 28000.1;
        var target3 = 29000.1;
        var target4 = 24000.1;
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);
    function DoMeEverySecond ()
    {
        var coins = parseInt(document.getElementsByClassName("topmenuprofile")[0].childNodes[2].childNodes[3].innerHTML);
        if (coins < target3 && coins > target2) {
                document.getElementsByClassName("form-control")[0].value = 1800;
                document.getElementsByClassName("blackb")[7].click();
        } else if (coins < target1) {
        if (coins > 2000){
                document.getElementsByClassName("form-control")[0].value = 2000;
        } else {
                document.getElementsByClassName("btn-warning")[10].click();
        }
                document.getElementsByClassName("greenb")[0].click();
        }else if (coins < target4 && coins > target1) {
                document.getElementsByClassName("btn-warning")[10].click();
                document.getElementsByClassName("blackb")[7].click();
        }
    }
})();