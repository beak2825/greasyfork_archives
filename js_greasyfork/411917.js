// ==UserScript==
// @name         Acfun直播挂机
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       费德勒的名单
// @match        https://live.acfun.cn/live/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411917/Acfun%E7%9B%B4%E6%92%AD%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411917/Acfun%E7%9B%B4%E6%92%AD%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==
var status=document.getElementsByClassName("tip");
var timer=setInterval(function(){
    if(status[0].innerText=="当前没有直播"){
        window.location.reload();
    }else{

        clearInterval(timer);
    }
},600000);
pause();

var listener=setInterval(function(){
    var users=document.getElementsByClassName("nickname");
    $("div.gift div span:last").each(function(){
        var mess=$(this).text();
        if(mess.indexOf("猴岛")>=0||mess.indexOf("机娘")>=0){
            warnning();
        }
    });
},5000);

//点击暂停进行挂机
function pause(){
    setTimeout(function() {
    document.getElementsByClassName("btn-span")[0].click();
},2500);
};

//播放直播提醒礼物
function warnning(){
    document.getElementsByClassName("btn-span")[0].click();
    setTimeout(function(){alert("猴岛和机娘")},3000);
    clearInterval(listener);
}
