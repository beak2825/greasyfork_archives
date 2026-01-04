// ==UserScript==
// @name         去腾讯视频Logo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去腾讯视频Logo的脚本
// @author       Mark
// @match        http*://v.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431700/%E5%8E%BB%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/431700/%E5%8E%BB%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91Logo.meta.js
// ==/UserScript==
(function() {
    setTimeout(function (){
        console.log("去腾讯视频Logo开始执行");
        document.evaluate("/html/body/div[1]/div[3]/div/div[1]/div[1]/div[1]/div[2]/txpdiv/txpdiv[25]/img", document).iterateNext().style.display='none';
        console.log("页面加载执行成功");
    },2000 );
})();