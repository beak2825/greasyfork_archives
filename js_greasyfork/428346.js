// ==UserScript==
// @name         优化启航教育的浏览体验
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去掉延迟加载的没卵用的聊天框和广告
// @author       HqLin
// @match        *://www.iqihang.com/*
// @icon         https://www.google.com/s2/favicons?domain=iqihang.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428346/%E4%BC%98%E5%8C%96%E5%90%AF%E8%88%AA%E6%95%99%E8%82%B2%E7%9A%84%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/428346/%E4%BC%98%E5%8C%96%E5%90%AF%E8%88%AA%E6%95%99%E8%82%B2%E7%9A%84%E6%B5%8F%E8%A7%88%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 按照规范，第一个参数是变化列表，第二个是监听器本身
    new MutationObserver((changeList, ob) => {
        const chat = document.querySelector("#MANTIS-CHAT-DIV");
        if (chat !== null){
            chat.remove();
            // 完成任务之后就不用再监听了。
            ob.disconnect();
            // 管他加载出来没呢，有就干掉。
            let ad = document.querySelector("section .courseActive");
            ad && ad.remove();
        }
        // 只用监听子元素，不用监听属性之类的。
    }).observe(document.body, {childList: true});
    // 连带侧边栏一起干掉。
    document.querySelector(".footer .setup").remove();

})();