// ==UserScript==
// @name         B站直播奖励领取
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  自动直播奖励领取
// @author       MEN
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461262/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A5%96%E5%8A%B1%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461262/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A5%96%E5%8A%B1%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function lingqu(){
        //console.log("执行鼠标事件")  暂时不处理点击事件
        //var evt = document.createEvent("MouseEvents");
        //evt.initMouseEvent("click", false, false);
        //document.dispatchEvent(evt);
        console.log("当前执行动作为领取奖励");
        document.querySelector(".get-award-btn").click()
    }
    
    // 12小时刷新一次
    let timeout = 43200
    //先点击领取奖励领取
    setTimeout(lingqu,10000,"等待10秒后执行领取奖励");
    console.log('等待%s秒后刷新界面: ', timeout);
    setInterval(() => {
      //刷新当前界面
      location.reload();
    }, timeout*1000);
})();