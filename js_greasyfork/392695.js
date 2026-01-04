// ==UserScript==
// @name         HRG刷课
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  HRG学习平台自动点击继续学习
// @author       Bruce Wayne
// @match        http://hiiri.yunxuetang.cn/kng/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392695/HRG%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/392695/HRG%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    alert("start script\n");
    setInterval(onTimer,1000);
})();
function onTimer()
{
    console.log("call onTimer");
    //document.querySelector("input[value='继续学习']").click();
    var e = document.querySelector("input[value='继续学习']");
    if(e!=null){
        e.click();
    }
}