// ==UserScript==
// @name         学习公社弹窗关闭
// @namespace www.ttcdw.cn
// @version      0.1
// @description  学习公社弹窗打卡自动执行
// @author       sunny
// @match        https://*.ttcdw.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477996/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%BC%B9%E7%AA%97%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/477996/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%BC%B9%E7%AA%97%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        let clockBtn = document.querySelector("#comfirmClock")
        if(clockBtn!==null){
            clockBtn.click()
            console.log("已自动打卡！")
        }
    },1000)
})();