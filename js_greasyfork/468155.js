// ==UserScript==
// @name         biliMessNone 关闭bilibili消息通知
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  关闭消息通知，在哔哩哔哩（bilibili）拒绝社交，拒绝评论区battle。
// @author       You
// @match        *://*.bilibili.com
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468155/biliMessNone%20%E5%85%B3%E9%97%ADbilibili%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/468155/biliMessNone%20%E5%85%B3%E9%97%ADbilibili%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("hello script.");
    var timerId = setInterval(function(){
        var mess = document.getElementsByClassName("signin")[0];
        if(mess) {
           mess.children[2].setAttribute("style", "display:None");
           // console.log(mess);
           clearInterval(timerId);
        } else {
            mess = document.getElementsByClassName("right-entry--message")[0];
            if(mess){
                // console.log(mess);
                mess.setAttribute("style", "display:None");
                clearInterval(timerId);
            }
        }
    }, 500); // 每隔 0.5 秒执行一次
    // Your code here...
})();