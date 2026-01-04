// ==UserScript==
// @name         🔥超星学习通刷章节学习次数🔥
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description 🔥学习通挂机自动刷章节学习次数🔥 使用方式：打开脚本后只需点击课程进入后挂机。一般是300次满分，可以在统计里查看学习次数
// @author       CHENL
// @include      *mycourse/studentcourse*
// @include      *mooc2-ans.chaoxing.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465041/%F0%9F%94%A5%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/465041/%F0%9F%94%A5%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0%F0%9F%94%A5.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    if(window.location.href.indexOf("mooc2-ans.chaoxing.com") != -1){
       backToOld()
    }
    alert("正在刷章节学习次数，此页面请勿关闭、跳出！")
    let logSrc = $("script[src^='https://fystat-ans.chaoxing.com/log/setlog']").eq(0).attr("src");
    setInterval(()=>{
        $.ajax({url:logSrc,dataType: "jsonp"});
    },35000)
    // Your code here...
})();