// ==UserScript==
// @name         链滴每日签到
// @namespace    pakeh2866
// @version      0.3
// @description  每天第一次打开时自动检测是否签到过，若未签到，则执行签到。
// @author       pakeh2866
// @match        https://ld246.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ld246.com
// @grant        GM_openInTab
// @grant        GM_Info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492637/%E9%93%BE%E6%BB%B4%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/492637/%E9%93%BE%E6%BB%B4%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = onloadStart()
    // Your code here...
})();

var isLogin = false;
var isqd = false;
var targetURL = false;
//判断是否登录
function checkLogin() {
    var checkLogin = document.getElementById('signOut');
    console.log(checkLogin);
    if (checkLogin) {
      isLogin = true;
    }
    console.log('isLogin:', isLogin);
}

//判断网页URL是否为"https://ld246.com/activity/checkin"
function checkURL() {
    var checkURL =  window.location.href
    //console.log(checkURL);
    if(checkURL.indexOf("activity/checkin")!= -1){
        targetURL = true;
    };
    console.log('targetURL:', targetURL);
    };


//判断是否未签到
function checkqd() {
    var checkqd = document.getElementsByClassName('item item--current');
    console.log(',checkqd:',checkqd);
    if (checkqd.length > 0) {
      isqd = true;
    }
    console.log('isqd:', isqd);
}

// 执行绿色签到click
function qd_button(){
   var button_click = document.getElementsByClassName("btn green");
   console.log(button_click[0])
   button_click[0].click();
}

function onloadStart(){
    checkLogin()
    checkqd()
    checkURL()
    if(isLogin&&isqd){
        console.log('已登录、未签到')
        if(targetURL){
            qd_button()
            console.log('签到成功')
        }else{
            GM_openInTab("https://ld246.com/activity/checkin");
            console.log('打开签到页')
            }
    }
}



