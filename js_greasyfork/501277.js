// ==UserScript==
// @name         ooee收藏夹链接直达
// @namespace    http://tampermonkey.net/
// @version      2024-07-20
// @description  ooee收藏夹网站链接直接跳转
// @author       kakasearch
// @match        *://www.oedh.net/sites/*
// @match        *://www.oedh.net/go/?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oedh.net
// @grant        none
// @license      MIT
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/501277/ooee%E6%94%B6%E8%97%8F%E5%A4%B9%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/501277/ooee%E6%94%B6%E8%97%8F%E5%A4%B9%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(/sites/.test(window.location.href)){
    let init = setInterval(function(){
    let target = document.querySelector("span.site-go-url>a")
         if(target){
             clearInterval(init)
             window.location.href = target.href
         }
   },500)
    }else{
    let init = setInterval(function(){
    let target = document.querySelector("span.loading-url")
         if(target){
             clearInterval(init)
             window.location.href = target.innerText
         }
   },500)
    }
})();