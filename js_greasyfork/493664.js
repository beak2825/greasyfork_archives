// ==UserScript==
// @name         B站旧版顶部栏 - 隐藏左侧活动态栏
// @namespace    mscststs
// @version      1.5
// @license      ISC
// @description  隐藏顶部栏左侧活动动态栏
// @author       mscststs
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493664/B%E7%AB%99%E6%97%A7%E7%89%88%E9%A1%B6%E9%83%A8%E6%A0%8F%20-%20%E9%9A%90%E8%97%8F%E5%B7%A6%E4%BE%A7%E6%B4%BB%E5%8A%A8%E6%80%81%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493664/B%E7%AB%99%E6%97%A7%E7%89%88%E9%A1%B6%E9%83%A8%E6%A0%8F%20-%20%E9%9A%90%E8%97%8F%E5%B7%A6%E4%BE%A7%E6%B4%BB%E5%8A%A8%E6%80%81%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.URL;
    if(!(url.startsWith("https://space.bilibili.com/") || url.startsWith("https://www.bilibili.com/v/") || url.startsWith("https://www.bilibili.com/video/") || url.startsWith("https://search.bilibili.com/") || url.startsWith("https://www.bilibili.com/bangumi/play/") || url.startsWith("https://live.bilibili.com/") || url.startsWith("https://www.bilibili.com/c/") || url.startsWith("https://www.bilibili.com/bangumi/media/") || url.startsWith("https://www.bilibili.com/watchlater/"))) {
        StartNavLink();
        async function StartNavLink(){

            await mscststs.wait(".nav-link .nav-link-ul .nav-link-item");
            var article = document.querySelector("body");

            function setNavLink() {
                var navLinks = document.querySelectorAll(".nav-link .nav-link-ul .nav-link-item");
                //alert(navLinks.length);
                if(navLinks.length == 10) {
                    navLinks[7].style.display = "none";
                    navLinks[8].style.display = "none";
                } else if(navLinks.length == 9) {
                    navLinks[7].style.display = "none";
                }
            }

            var options = { 'childList': true, 'attributes':true };
            const callback = function(mutationsList, observer) {
                setNavLink();
            };
            const observer = new MutationObserver(callback);
            observer.observe(article, options);
            setNavLink();
            var time = 1000;
            for(var i = 0; i < 10; i++) {
                setTimeout(function() {
                    setNavLink();
                    //alert(123);
                }, time);
                time += 1000;
            }

        }
    }
})();