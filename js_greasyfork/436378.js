// ==UserScript==
// @name         推特Twitter自动关注自动回关
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  打开其他的人的推特如果没有关注则自动点关注  在关注列表页面打开后30秒自动刷新 有新的关注者自动回关
// @author       图灵网络
// @license MIT
// @match        *://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436378/%E6%8E%A8%E7%89%B9Twitter%E8%87%AA%E5%8A%A8%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/436378/%E6%8E%A8%E7%89%B9Twitter%E8%87%AA%E5%8A%A8%E5%85%B3%E6%B3%A8%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
        console.log("执行")
    setInterval(()=>{
        var dom=document.querySelector("div[aria-label~=关注]");
        if(dom){
            console.log("找到一个存在 自动点关注")
            dom.click();
        }else{
            console.log("不存在")
        }
    },3000)
    setInterval(()=>{
        console.log("自动刷新列表！");
        var xxk=document.querySelectorAll("div[role=presentation] div[dir=auto]");
        if(xxk&&xxk.length==2){
            xxk[1].click();
            setTimeout(()=>{
                xxk[0].click();
            },1000)
        }
    },30000)
})();