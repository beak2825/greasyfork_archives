// ==UserScript==
// @name         第一个脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  掘金随便改改
// @author       qc-z
// @match        https://juejin.cn/user/*
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-16x16.png
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/439261/%E7%AC%AC%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439261/%E7%AC%AC%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

$(document).ready(function(){
    setTimeout(()=>{
        const tag1 = document.getElementsByClassName('count')[3]
        const tag2 = document.getElementsByClassName('count')[4]
        const tag3 = document.getElementsByClassName('count')[5]
        tag1.innerText = Math.ceil(Math.random() * 1000000)
        tag2.innerText = Math.ceil(Math.random() * 1000000)
        tag3.innerText = Math.ceil(Math.random() * 1000000)
    },1000)
});
