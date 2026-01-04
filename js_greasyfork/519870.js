// ==UserScript==
// @name         bilibili移除被广告插件屏蔽的块
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  移除使用广告拦截插件后页面显示的广告提示
// @author       Winneec
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519870/bilibili%E7%A7%BB%E9%99%A4%E8%A2%AB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E5%B1%8F%E8%94%BD%E7%9A%84%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/519870/bilibili%E7%A7%BB%E9%99%A4%E8%A2%AB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6%E5%B1%8F%E8%94%BD%E7%9A%84%E5%9D%97.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    document.querySelector('.adblock-tips').remove();
 
    const carouselAd=document.querySelectorAll('.carousel-item');
    carouselAd.forEach((v)=>{
        if(v.querySelector('img[class="icon"]')){
            v.parentElement.parentElement.parentElement.remove()
        }
    })
 
    const observer = new MutationObserver(() => {
        const cardAd = document.querySelectorAll('.bili-video-card>div');
        cardAd.forEach((v)=>{
            if(window.getComputedStyle(v, '::before').content==='"该内容被AdGuard/AdBlock类插件屏蔽"'){
                v.parentElement.remove()
            }
        })
        document.querySelectorAll('.feed-card').forEach(x=>{if(!x.innerHTML){x.remove()}})
    })
    observer.observe(document.body, { childList: true, subtree: true });


})();