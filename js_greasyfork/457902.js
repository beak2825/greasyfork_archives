// ==UserScript==
// @name         卫健委查询限制60s倒计时
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给卫健委页面添加了一个倒计时面板
// @author       Feng_Yijiu
// @match        *zgcx.nhc.gov.cn:9090/Doctor
// @icon         http://zgcx.nhc.gov.cn:9090/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457902/%E5%8D%AB%E5%81%A5%E5%A7%94%E6%9F%A5%E8%AF%A2%E9%99%90%E5%88%B660s%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/457902/%E5%8D%AB%E5%81%A5%E5%A7%94%E6%9F%A5%E8%AF%A2%E9%99%90%E5%88%B660s%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("插件加载成功...");
    // Your code here...
    $(".form-control").eq(3).val("");

    var timer = 60;
    var timeOut;

    $("body").append("<div class='content'><h3>倒计时:&nbsp;&nbsp;&nbsp;<b class='timer'></b><i>s</i></h3></div>");

    $(".content").css({
				"position":"absolute",
				"left":"100px",
				"bottom":"50px",
				"width":"200px",
				"height":"65px",
				"color":"red",
				"border":"1px solid rgba(128, 166, 138, 0.2)",
				"border-radius":"5px",
				"box-shadow":"1px 2px 3px rgba(0,0,0,0.2)",
				"padding-left":"30px",
			})





    function start(){
        if(timer>0){
            timer--;
            $(".timer").text(timer);
        }else{
            $(".timer").text("");
            $("h3").eq(0).text("可以查询了！")
            $(".content>h3").text("可以查询了！")
            $("h3").eq(0).css({"color":"red"});
            end()
        }
    }

    function end(){
        clearInterval(timeOut)
    }

    timeOut = setInterval(start,1000)


    start();
})();