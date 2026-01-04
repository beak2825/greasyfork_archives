// ==UserScript==
// @name         xingyun121自动开箱
// @match        http://xingyun121.com/*
// @grant        none
// @version		 0.1
// @description	 none
// @namespace	 xingyun121自动开箱
// @downloadURL https://update.greasyfork.org/scripts/31702/xingyun121%E8%87%AA%E5%8A%A8%E5%BC%80%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/31702/xingyun121%E8%87%AA%E5%8A%A8%E5%BC%80%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    var interval = 30000;  //多少毫秒执行一次，最好设置为15000毫秒以上
    var refresh_rate = 5;  //经过多少次以上时间刷新一次网页，防止网页断网卡死等问题
    var timerVar = setInterval (function() {CirculBody (); }, interval);

    function ConfirmOnce (){
        var x = document.getElementsByClassName("plain opacity");
        for(var i = 0; x[i]; i++){
            if(x[i].innerHTML.match("开启")){
                x[i].click();
            }
        }
    }

    function ConfirmTwice (){
        var x = document.getElementsByClassName("ngdialog-button confirm ng-scope");
        for(var i = 0; x[i]; i++){
            if(x[i].innerHTML.match("确定")){
                x[i].click();
            }
        }
    }

    function OpenBox(box_type){
        var x = document.getElementsByClassName("cavity gold");
        if(x[box_type]){
            x[box_type].click();

            window.setTimeout(function(){ConfirmOnce ();}, 2000);
            window.setTimeout(function(){ConfirmTwice ();}, 4000);
        }
    }

    function CirculBody ()
    {
        //开免费箱子、福利箱子
        OpenBox(0);
        OpenBox(1);

        //网页刷新
        if(++count > refresh_rate){
            count = 0;
            window.location.reload();
        }
    }

})();