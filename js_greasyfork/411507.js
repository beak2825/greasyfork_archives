// ==UserScript==
// @name         中国传媒大学20级web微信群体温打卡提醒助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://wx.qq.com/*
// @grant        none
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411507/%E4%B8%AD%E5%9B%BD%E4%BC%A0%E5%AA%92%E5%A4%A7%E5%AD%A620%E7%BA%A7web%E5%BE%AE%E4%BF%A1%E7%BE%A4%E4%BD%93%E6%B8%A9%E6%89%93%E5%8D%A1%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/411507/%E4%B8%AD%E5%9B%BD%E4%BC%A0%E5%AA%92%E5%A4%A7%E5%AD%A620%E7%BA%A7web%E5%BE%AE%E4%BF%A1%E7%BE%A4%E4%BD%93%E6%B8%A9%E6%89%93%E5%8D%A1%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var $=jQuery.noConflict();
(function($) {
    'use strict';
     $(document).ready(function(){
         var scrollTop=0;
         function sendMsg(){

            let time=new Date();
            let month=time.getMonth() +1;
            let year=time.getYear();
            let hour=time.getHours();
            let date=time.getDate();
            let storageData=localStorage.getItem("zhongchuan");
            let data=JSON.parse(storageData) || {};
            let key=`${year}${month}${date}`;
             let $zhongchuanqun;
             if(data[key] || hour!== 18 ){
                 return;
             }


             $(".ng-scope").find(".nickname .nickname_text").each((index,ele)=>{
                 if($(ele).text().trim()==="中传MBA-2020级群"){
                     $zhongchuanqun=$(ele);
                 }
             })
             if($zhongchuanqun){
                $zhongchuanqun.click();
                 setTimeout(function(){
                     
                     setTimeout(function(){
                         $("#editArea").text("体温打卡小助手提醒您'打卡啦'").trigger('input');
                         angular.element($("#editArea")[0]).triggerHandler("input")
                         angular.element($(".btn_send")[0]).triggerHandler("click")
                         console.log("体温打卡消息已发送");
                         data[key]=true;
                         localStorage.setItem("zhongchuan",JSON.stringify(data));
                     },1000)
                     
                 },1000)
                 
             }else{
                $("#J_NavChatScrollBody").scrollTop(scrollTop+=200);
             }

         }

        setInterval(function(){
            console.log("体温小助手工作中..")
            sendMsg();
        },10000)

     })
    // Your code here...
})($);