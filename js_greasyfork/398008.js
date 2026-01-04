// ==UserScript==
// @name         腾讯课堂自动签到 Plus
// @name:zh-CN   腾讯课堂自动签到 Plus
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  基于SDchao的改编  加入系统级通知和网页签到状态指示功能  合并了去除xxx正在观看的弹幕
// @description:zh-cn  基于SDchao的改编  加入系统级通知和网页签到状态指示功能  合并了去除xxx正在观看的弹幕
// @author       xianfei, thank for SDchao
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398008/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/398008/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20Plus.meta.js
// ==/UserScript==
var signNum = 0;
var signElement;
var intervalFlag;
var hasDati = false;
var lastHasDati = false;

(function() {
    'use strict';
    setTimeout(()=>{signElement=document.getElementsByClassName("applied-text")[0];},4000);
    setInterval(clickSign,5000);
    intervalFlag = setInterval(clearDanmu,1000);
    console.warn("签到脚本已经加载");
    // 请求通知权限
    window.addEventListener('load', function () {
  Notification.requestPermission(function (status) {
    // 这将使我们能在 Chrome/Safari 中使用 Notification.permission
    if (Notification.permission !== status) {
      Notification.permission = status;
    }
  });
});
    // Your code here...
})();

function clearDanmu() {
    var marquee = document.getElementById("marquee");
    if(marquee) {
        marquee.firstElementChild.innerHTML = "";
        clearInterval(intervalFlag);
    }
}

function showNotifi(status,str) {
  console.log(status); // 仅当值为 "granted" 时显示通知
  var n = new Notification("腾讯课堂签到助手", {body: str}); // 显示通知
}

function clickSign() {
    'use strict';
    if(signNum==0) signElement.innerHTML = "自动签到已加载";
    var elements = document.getElementsByClassName("s-btn s-btn--primary s-btn--m");
    var datiElements = document.getElementsByClassName("head-text");
    hasDati = false;
    for(var e of datiElements){if(e.innerHTML.indexOf("选题") !== -1){
        hasDati = true;
        if(lastHasDati==false&&hasDati==true){
        console.warn("老师发起了答题");
        Notification.requestPermission(showNotifi(status,"老师发起了答题 快去看看！"));}
    }}
    if(hasDati) lastHasDati = true;
    else lastHasDati=false;
    for(var element of elements) {
        try {
            if(element.innerHTML == "签到") {
                element.click();
                signNum = signNum+1;
                console.warn("签到了"+signNum+"次");
                Notification.requestPermission(showNotifi(status,"刚刚进行了签到，已成功签到"+signNum+"次"));
                signElement.innerHTML = ("已签到"+signNum+"次");
                setTimeout(clickConfirm,2000);
                break;
            }
        }
        catch(e){}
    }
}

function clickConfirm() {
    'use strict';
    var elements2 = document.getElementsByClassName("s-btn s-btn--primary s-btn--m");
    for(var i = 0; i < elements2.length; i++) {
        try {
            var element = elements2[i];
            if(element.innerHTML == "确定") {
                element.click();
                break;
            }
        }
        catch(e){}
    }
}