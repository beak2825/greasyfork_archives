// ==UserScript==
// @name         F__K ZhiXue
// @namespace    http://zhengjiabao.gitee.io/
// @version      0.4
// @description  把智学网的图标改的让人快乐
// @author       Zheng-Jiabao
// @match        https://www.zhixue.com/*
// @match        https://*.zhixue.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396866/F__K%20ZhiXue.user.js
// @updateURL https://update.greasyfork.org/scripts/396866/F__K%20ZhiXue.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        document.getElementById("headLogoImg").src = "https://zhengjiabao.gitee.io/2020/02/25/F-K-the-ZhiXue/zhixue_logo_1.png";
    }catch(e){}
    if(document.getElementsByTagName("title")[0].innerHTML=="直播平台"){
        document.getElementsByTagName("title")[0].innerHTML = "智障平台";
    }
    document.getElementsByTagName("title")[0].innerHTML=document.getElementsByTagName("title")[0].innerHTML.replace(/智学/g,"智障")
    if(window.location.href.search("https://www.zhixue.com/course/")==-1 && window.location.href.search("https://www.zhixue.com/zbpttools/")==-1){
        document.getElementsByTagName("html")[0].innerHTML=document.getElementsByTagName("html")[0].innerHTML.replace(/智学/g,"智障")
    }
})();