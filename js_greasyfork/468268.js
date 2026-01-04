// ==UserScript==
// @name         梦想小镇挂机脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动签到/自动抢特价菜/自动添油/自动领体力/自动除蟑螂
// @author       Jay Chou
// @match        *://*.dream233.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license MIT
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/468268/%E6%A2%A6%E6%83%B3%E5%B0%8F%E9%95%87%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468268/%E6%A2%A6%E6%83%B3%E5%B0%8F%E9%95%87%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
 //-------------------------------------------------------------------------------------------------start-------------------------------------------------------------------------------------------------------------------------
    'use strict';
    let tingye=$("span:contains('停业')").length>0;
    let yingyezhong=$("span:contains('营业中')").length>0;
    let indexPage=tingye||yingyezhong;
    //首页
    if(indexPage){
      //签到
      jumpSignedPage();
      //运行定时器
      setInterval(function(){
          let dt = new Date();//当前时间
          let h = dt.getHours(); //获取时
          let m = dt.getMinutes(); //获取分
          let s = dt.getSeconds(); //获取秒
          //抢特价菜
          let marketHours=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0];
          if(marketHours.indexOf(h)>0&&m==0&&s==10){
              jumpMarketPage();
          }
          //添油
          let tianYouMinutes=[15,35,55];
          if(tingye){
              tianYouRun();
          }else if(tianYouMinutes.indexOf(m)>0&&s==20){
              tianYouRun();
          }
          //领体力
          let energyHours=[7,8,9,12,13,14,18,19,20];
          if(energyHours.indexOf(h)>0&&m==10&&s==30){
              jumptEnergyPage();
          }
          //除蟑螂
          let restaurantHours=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,23];
          if(restaurantHours.indexOf(h)>0&&m==30&&s==40){
              jumpRestaurant();
          }
       }, 1000);
    }
    //签到完成页
    if($("p:contains('今日已签到成功')").length>0){
        setTimeout(jumpIndexPage,1000)
    }
    //特价菜页面
    if($("p:contains('菜园姐：欢迎大家选购')").length>0){
       buy();
       setTimeout(jumpIndexPage,1000)
    }
    //领体力页面
    if($("b:contains('吃饭时间领取体力活动')").length>0){
       //禁止alert弹窗
       window.alert = function() {
           return false;
       }
       lingQuRun();
       setTimeout(jumpIndexPage,1000)
    }
    //餐厅页面
    if($("p:contains('餐厅公告')").length>0){
        kill();
        let needKill=$("span:contains('楼')").eq(0).next().next();
        if(needKill.length>0){
           $(needKill)[0].click();
        }else{
            setTimeout(jumpIndexPage,1000)
        }
    }
    //运行定时器,刷新页面防止页面宕掉
     setInterval(function(){
        let dt = new Date();//当前时间
        let h = dt.getHours(); //获取时
        let m = dt.getMinutes(); //获取分
        let s = dt.getSeconds(); //获取秒
        let refreshMinues=[20,25,40,45];
        if(refreshMinues.indexOf(m)>0&&s==50){
           location.reload();
        }
   }, 1000);
 //-------------------------------------------------------------------------------------------------end-------------------------------------------------------------------------------------------------------------------------
})();

 //签到
 function jumpSignedPage(){
    let signIn=$("a[href='/mxxz/sign_in']")[0];
    if(signIn.text=='签到'){
       console.log("准备签到...");
       signIn.click();
    }
}

 //添油
 function tianYouRun(){
     console.log("准备添油...");
     $("a:contains('添满')").click();
}

 //跳转领体力页面
 function jumptEnergyPage(){
     console.log("准备跳转领体力页面...");
     $("a[href='/mxxz/activity_energy']")[0].click();
}
 //领取体力
 function lingQuRun(){
     console.log("准备领体力...");
     $("a:contains('我吃')").click();
}

//跳转菜场页面
 function jumpMarketPage(){
     console.log("准备跳转菜场页面...");
     $("a[href='/mxxz/market']")[0].click();
}

//买特价菜
 function buy(){
     console.log("准备买特价菜...");
     $("p:contains('3级')").find('a').click();
     $("p:contains('4级')").find('a').click();
     $("p:contains('5级')").find('a').click();
}

//跳转餐厅页面
function jumpRestaurant(){
     console.log("准备跳转餐厅页面...");
    $("a[href='/mxxz/restaurant']")[0].click();
}

//除蟑螂
function kill(){
    console.log("准备除蟑螂...");
    $("a:contains('蟑螂')").click();
}

//跳转首页
 function jumpIndexPage(){
     console.log("准备跳转首页...");
     $("a[href='/mxxz']")[0].click();
}