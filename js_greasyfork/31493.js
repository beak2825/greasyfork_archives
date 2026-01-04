// ==UserScript==
// @name         csgoatse自动下注
// @match        https://csgoatse.com/*
// @grant        none
// @version		 0.4
// @description	 none
// @namespace	 csgoatse自动下注
// @downloadURL https://update.greasyfork.org/scripts/31493/csgoatse%E8%87%AA%E5%8A%A8%E4%B8%8B%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/31493/csgoatse%E8%87%AA%E5%8A%A8%E4%B8%8B%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    var amount = 25;  //下注金额
    var interval = 30000;  //下注间隔时间
    var timerVar = setInterval (function() {DoMeEverySecond (); }, interval);

    function DoMeEverySecond ()
    {
        //登录steam
        var x = document.getElementsByClassName("btn-login");
        if(x[0]){
            x[0].click();
        }
        
        //填写amount
        x = document.getElementsByClassName("amount");
        if(x[0]){
            x[0].lastChild.value = amount;
        }
        
        //最后一个是什么颜色
        x = document.getElementsByClassName("last");
        if(x[0]){
            var last = x[0].lastChild;
            if(last){
                var StrMatch = last.className.match("green");
                if(!StrMatch){
                    StrMatch = last.className.match("red");
                    if(StrMatch){
                        //红色, header-button red
                        x = document.getElementsByClassName("header-button red");
                    }
                    else{
                        x = document.getElementsByClassName("header-button black");
                    }
                    x[0].click();
                }
            }
        }
        
        //10分钟刷新一次
        if(++count > 10){
            count = 0;
            window.location.reload();
        }
    }

})();