// ==UserScript==
// @name         simple-mmo-helper
// @namespace    Yoki
// @version      0.1.20250114.1
// @description  Simple MMO（https://web.simple-mmo.com/）游戏功能辅助
// @author       Yoki
// @include      *https://web.simple-mmo.com*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_log
// [1111]@require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521618/simple-mmo-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/521618/simple-mmo-helper.meta.js
// ==/UserScript==



(function() {
    'use strict';

    //----------------------自动点击逻辑-------------------------------
    var clickNum = window.localStorage.getItem("clickNum") == null ? 0 : window.localStorage.getItem("clickNum");
    var clickAttackNum = window.localStorage.getItem("clickAttackNum") == null ? 0 : window.localStorage.getItem("clickAttackNum");
    var clickCollectNum = window.localStorage.getItem("clickCollectNum") == null ? 0 : window.localStorage.getItem("clickCollectNum");
    var collectList = window.localStorage.getItem("collectList") == null || window.localStorage.getItem("collectList") == "" ? [] : window.localStorage.getItem("collectList").split(",");
    var showStop = 0;
    var timer = null;
    var clickTimer = setInterval(function() {
        if(clickNum == 1 && window.location.href.startsWith('https://web.simple-mmo.com/travel')){
            if($(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("a").length == 2 && ($(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("button").length == 0 || $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("small").length > 0 && $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("small")[0].innerText == '你的技能等级不够高')
               || $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("button").length == 2 && $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("button")[1].innerText == "挥手"){
                if(!$("button[id^='step_btn_']")[2].disabled){
                    clearTimeout(timer);
                    $("button[id^='step_btn_']")[2].click()
                    showStop = 0;
                }
            }else if(clickAttackNum == 1 && $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("a").length > 0 && $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("a")[0].innerText == "攻击"){
                try{
                    $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("a")[0].click();
                }catch(err){
                    console.log(err);
                        if(showStop == 0){
                            showStop = 1;
                            if(timer != null)
                                clearTimeout(timer);
                            timer = setTimeout(function(){
                                showStop = 0;
                            },60000)
                            notifyMe("SimpleMMO 进入攻击失败,请检查,或联系Yoki(截图console数据)");
                        }
                }
            }else if(clickCollectNum == 1 && $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("button").length > 0 && collectList.indexOf($(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("button")[0].innerText) != -1){
                try{
                    $(".p-2.sm\\:px-5.sm\\:py-3").find(".text-center.mt-2").find("button")[0].click();
                }catch(err){
                    console.log(err);
                        if(showStop == 0){
                            showStop = 1;
                            if(timer != null)
                                clearTimeout(timer);
                            timer = setTimeout(function(){
                                showStop = 0;
                            },60000)
                            notifyMe("SimpleMMO 进入收集失败,请检查,或联系Yoki(截图console数据)");
                        }
                }
            }else if(showStop == 0){
                showStop = 1
                if(timer != null)
                    clearTimeout(timer);
                timer = setTimeout(function(){
                    showStop = 0;
                },60000)
                notifyMe("SimpleMMO 等待操作中...");
            }
        }
        if(clickAttackNum == 1 && window.location.href.startsWith('https://web.simple-mmo.com/npcs/attack')){
            if($(".rounded-lg.h-96").find("button").length > 0 && $(".rounded-lg.h-96").find("button")[0].innerText == "攻击" ){
                if($(".flex.h-full.sm\\:p-0") && $(".flex.h-full.sm\\:p-0")[0].style.display == "none" &&
               ($(".p-4.text-center.sm\\:p-0")[0].style.display == "none" || $(".mt-5.sm\\:mt-6")[0].style.display != "none")){
                    try{
                        $(".rounded-lg.h-96").find("button")[0].click()
                    }catch(err){
                        console.log(err);
                        if(showStop == 0){
                            showStop = 1;
                            if(timer != null)
                                clearTimeout(timer);
                            timer = setTimeout(function(){
                                showStop = 0;
                            },60000)
                            notifyMe("SimpleMMO 进行攻击失败,请检查,或联系Yoki(截图console数据)");
                        }
                    }
                }else if($(".p-4.text-center.sm\\:p-0")[0].style.display == "none" || $(".mt-5.sm\\:mt-6")[0].style.display != "none"){
                    try{
                        $(".flex.h-full.sm\\:p-0").find("a")[0].click()
                    }catch(err){
                        console.log(err);
                        if(showStop == 0){
                            showStop = 1;
                            if(timer != null)
                                clearTimeout(timer);
                            timer = setTimeout(function(){
                                showStop = 0;
                            },60000)
                            notifyMe("SimpleMMO 攻击完成返回失败,请检查,或联系Yoki(截图console数据)");
                        }
                    }
                }else if(showStop == 0){
                    showStop = 1
                    if(timer != null)
                        clearTimeout(timer);
                    timer = setTimeout(function(){
                        showStop = 0;
                    },60000)
                    notifyMe("SimpleMMO 等待操作中...");
                }
            }
        }
        if(clickCollectNum == 1 && window.location.href.startsWith('https://web.simple-mmo.com/crafting/material/gather')){
            if(!($(".web-app-container").find("button").length == 4 && $(".web-app-container").find("button")[3].innerText == "点这里以关闭")){
                console.log(err);
                if(showStop == 0){
                    showStop = 1;
                    if(timer != null)
                        clearTimeout(timer);
                    timer = setTimeout(function(){
                        showStop = 0;
                    },60000)
                    notifyMe("功能判断有误,联系Yoki(截图console数据)");
                }
            }else if($(".web-app-container").find("button")[3].style.display == "none"){
                try{
                    $("#crafting_button").click()
                }catch(err){
                    console.log(err);
                    if(showStop == 0){
                        showStop = 1;
                        if(timer != null)
                            clearTimeout(timer);
                        timer = setTimeout(function(){
                            showStop = 0;
                        },60000)
                        notifyMe("SimpleMMO 进行收集失败,请检查,或联系Yoki(截图console数据)");
                    }
                }
            }else{
                try{
                    $(".web-app-container").find("button")[3].click()
                }catch(err){
                    console.log(err);
                    if(showStop == 0){
                        showStop = 1;
                        if(timer != null)
                            clearTimeout(timer);
                        timer = setTimeout(function(){
                            showStop = 0;
                        },60000)
                        notifyMe("SimpleMMO 收集完成返回失败,请检查,或联系Yoki(截图console数据)");
                    }
                }
            }
        }
    }, 1000,1000);
    if(window.location.href.startsWith('https://web.simple-mmo.com/travel')){
        setTimeout(function(){
            $("#the-user-menu-button-2").click();
            isFull();
        },500)
    }
    //------------------------自动点击控制-----------------------------
    //放置按钮
    window.onload = function() {
        if($("#yoki-headline").length == 0){
            $("#projects-headline").before('<h3 class="px-3 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="yoki-headline" x-show="webAppSideBar" x-transition:enter="transition-transform transition-opacity ease-out duration-500" x-transition:enter-start="opacity-0 transform translate-x-2" x-transition:enter-end="opacity-100 transform translate-y-0" x-transition:leave="transition ease-in duration-500" x-transition:leave-end="opacity-0 transform -translate-x-2">                脚本</h3>')
            $("#yoki-headline").after('<a href="#" id="auto_click_btn" class=" text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200   group flex items-center px-2 py-2 text-sm font-medium rounded-md"><img src="/img/icons/A_Shoes01.png" class="h-6 mr-3"><span id="auto_click_span" x-show="webAppSideBar" x-transition:enter="transition-transform transition-opacity ease-out duration-500" x-transition:enter-start="opacity-0 transform translate-x-2" x-transition:enter-end="opacity-100 transform translate-y-0" x-transition:leave="transition ease-in duration-500" x-transition:leave-end="opacity-0 transform -translate-x-2">开启自动旅行</span></a>');
            $("#auto_click_btn").after('<a href="#" id="auto_click_attack_btn" class=" text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200   group flex items-center px-2 py-2 text-sm font-medium rounded-md"><img src="/img/icons/S_Sword07.png" class="h-6 mr-3"><span id="auto_click_attack_span" x-show="webAppSideBar" x-transition:enter="transition-transform transition-opacity ease-out duration-500" x-transition:enter-start="opacity-0 transform translate-x-2" x-transition:enter-end="opacity-100 transform translate-y-0" x-transition:leave="transition ease-in duration-500" x-transition:leave-end="opacity-0 transform -translate-x-2">开启自动攻击</span></a>');
            $("#auto_click_attack_btn").after('<a href="#" id="auto_click_collect_btn" class=" text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200   group flex items-center px-2 py-2 text-sm font-medium rounded-md"><img src="/img/icons/one/icon864.png" class="h-6 mr-3"><span id="auto_click_collect_span" x-show="webAppSideBar" x-transition:enter="transition-transform transition-opacity ease-out duration-500" x-transition:enter-start="opacity-0 transform translate-x-2" x-transition:enter-end="opacity-100 transform translate-y-0" x-transition:leave="transition ease-in duration-500" x-transition:leave-end="opacity-0 transform -translate-x-2">开启自动收集</span></a>');
            if(clickNum == 0){
                $("#auto_click_span").text("开启自动旅行");
            }else{
                $("#auto_click_span").text("关闭自动旅行");
            }
            if(clickAttackNum == 0){
                $("#auto_click_attack_span").text("开启自动攻击");
            }else{
                $("#auto_click_attack_span").text("关闭自动攻击");
            }
            if(clickCollectNum == 0){
                $("#auto_click_collect_span").text("开启自动收集");
            }else{
                $("#auto_click_collect_span").text("关闭自动收集");
            }
            //旅行按钮开关功能
            $('body').on('click','#auto_click_btn',function(){
                if(clickNum == 0){
                    $("#auto_click_span").text("关闭自动旅行");
                    window.localStorage.setItem("clickNum",1)
                    clickNum = 1;
                }
                else if(clickNum == 1){
                    $("#auto_click_span").text("开启自动旅行");
                    window.localStorage.setItem("clickNum",0)
                    clickNum = 0;
                }
            })
            //攻击按钮开关功能
            $('body').on('click','#auto_click_attack_btn',function(){
                if(clickAttackNum == 0){
                    $("#auto_click_attack_span").text("关闭自动攻击");
                    window.localStorage.setItem("clickAttackNum",1)
                    clickAttackNum = 1;
                }
                else if(clickAttackNum == 1){
                    $("#auto_click_attack_span").text("开启自动攻击");
                    window.localStorage.setItem("clickAttackNum",0)
                    clickAttackNum = 0;
                }
            })
            //收集按钮开关功能
            $('body').on('click','#auto_click_collect_btn',function(){
                if(clickCollectNum == 0){
                    $("#auto_click_collect_span").text("关闭自动收集");
                    window.localStorage.setItem("clickCollectNum",1)
                    clickCollectNum = 1;
                }
                else if(clickCollectNum == 1){
                    $("#auto_click_collect_span").text("开启自动收集");
                    window.localStorage.setItem("clickCollectNum",0)
                    clickCollectNum = 0;
                }
            })
        }
    }

    const { fetch: originalFetch } = window.unsafeWindow;

    window.unsafeWindow.fetch = async (...args) => {
        let [resource, config ] = args;
        // request interceptor here
        if(resource == "https://api.simple-mmo.com/api/action/travel/4"){
            config.body.set("d_1",parseInt(Math.random()*30+510))
            config.body.set("d_2",parseInt(Math.random()*30+510))
            config.body.set("s",false)
        }
        const response = await originalFetch(resource, config);
        // response interceptor here
        return response;
    };

    window.unsafeWindow.addFilterWord = function(text){
        text = text.toString();
        collectList.push(text);
        window.localStorage.setItem("collectList",collectList);
        return collectList;
    }

    window.unsafeWindow.addFilterWords = function(arr){
        collectList.push(...arr);
        window.localStorage.setItem("collectList",collectList);
        return collectList;
    }

    window.unsafeWindow.removeFilterWord = function(text){
        text = text.toString();
        collectList.pop(text);
        window.localStorage.setItem("collectList",collectList);
        return collectList;
    }

    window.unsafeWindow.getFilterWord = function(text){
        collectList = window.localStorage.getItem("collectList") == null || window.localStorage.getItem("collectList") == "" ? [] : window.localStorage.getItem("collectList").split(",");
        return collectList;
    }
})();

function notifyMe(text) {
  if (!("Notification" in window)) {
    // 检查浏览器是否支持通知
    alert("当前浏览器不支持桌面通知");
  } else if (Notification.permission === "granted") {
    // 检查是否已授予通知权限；如果是的话，创建一个通知
    const notification = new Notification(text);
    // …
  } else if (Notification.permission !== "denied") {
    // 我们需要征求用户的许可
    Notification.requestPermission().then((permission) => {
      // 如果用户接受，我们就创建一个通知
      if (permission === "granted") {
        const notification = new Notification(text);
        // …
      }
    });
  }
  // 最后，如果用户拒绝了通知，并且你想尊重用户的选择，则无需再打扰他们
}
function isFull() {
    setTimeout(function(){
        if($("span[x-text='user.energy']")[0].innerText == ""){
            isFull();
            return;
        }
        if($("span[x-text='user.energy']")[0].innerText == $("span[x-text='user.max_energy']")[0].innerText)
            notifyMe("能量恢复完毕");
        if($("span[x-text='user.quest_points']")[0].innerText == $("span[x-text='user.max_quest_points']")[0].innerText)
            notifyMe("冒险点数恢复完毕");
    },500)
}