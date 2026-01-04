// ==UserScript==
// @name         acfun 点赞开关
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  手动开关自动点赞!  1.0.2更新：直播间去灰度功能。
// @author       乌贼·tentacles
// @homepage     https://www.acfun.cn/u/205408
// @match        *://live.acfun.cn/live/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441704/acfun%20%E7%82%B9%E8%B5%9E%E5%BC%80%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/441704/acfun%20%E7%82%B9%E8%B5%9E%E5%BC%80%E5%85%B3.meta.js
// ==/UserScript==

let css = ".autolike{display: block;position: absolute;padding: 4px 8px;color: white;border-radius: 4px;font-size: 12px;bottom: 95px;background: gray;right: 240px;z-index: 99;} .fou{background:red}"
GM_addStyle(css);

let isStart = false;
let div1 = document.createElement("div");
let startLike;
div1.append("自动点赞");
div1.classList.add("autolike");
document.getElementsByClassName("container-live-feed right")[0].append(div1);
document.getElementsByTagName("html")[0].classList.remove("gray");
var Belike = function() {
    isStart = !isStart;
    if(isStart){
        startLike = window.setInterval(Clicklike, 1500);
    }else{
        clearInterval(startLike);
    }
    div1.classList.toggle("fou");
};
var Clicklike = function(){
    document.getElementsByClassName('like-btn')[0].click();
};

div1.addEventListener("click", Belike, false);

(function() {
    'use strict';
})();