// ==UserScript==
// @name         斗鱼自动抢鱼丸
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  自动领取斗鱼的鱼丸，自动等待，自动发送弹幕增加领取机率，支持鱼秀宝箱 get the yuwan from douyu automatically.Support yuxiu.douyu.com by the way.
// @author       Chuck
// @match        https://www.douyu.com/*
// @match        http://www.douyu.com/*
// @match        https://yuxiu.douyu.com/*
// @match        http://yuxiu.douyu.com/*

// @icon         http://www.douyu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23747/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%B1%BC%E4%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/23747/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%B1%BC%E4%B8%B8.meta.js
// ==/UserScript==



if(location.host==="www.douyu.com")
{
    console.log("鱼丸自动领取已经启动");
    
    setInterval(function(){
        $peck = $(".peck");
        if($peck.prop("style").display==="block"&&$peck.hasClass("peck-open"))  {
            $(".peck-cdn").click();
        }  


    }, 500);
}
else{
    console.log("鱼秀鱼丸自动领取已经启动");
    
    setInterval(function(){
        $peck = $(".gift-peck");
        if($(".gift-peck").prop("style").display==="block"&&$(".gift-peck").hasClass("gift-peck-open"))  {
            $(".gift-peck-cool").click();
        }  

    }, 500);


}
   


//sendingInterval 为弹幕发送间隔，300000 = 300秒，可以自行修改
//发送功能已经禁用，需要启用请将下面4行开头的"//"删去并保存

//var sendingInterval = 300000;
//setInterval(function(){
//	$(".cs-textarea").val(Math.ceil(Math.random()*100));
//	$(".b-btn").click();
//}, sendingInterval);