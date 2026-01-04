// ==UserScript==
// @name         zuber 查看详情
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无需登录，可在浏览器直接查看 zuber 租房的房间详情
// @author       Ericwyn
// @match        *://mobile.zuber.im/bed/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382823/zuber%20%E6%9F%A5%E7%9C%8B%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/382823/zuber%20%E6%9F%A5%E7%9C%8B%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var dom = document.getElementsByClassName("des_msg")[0];
        dom.remove();
        document.getElementsByClassName("room_des_text_wrap")[0].style.removeProperty("height")
        document.getElementsByClassName("room_des_text_wrap")[0].style.setProperty("margin-bottom","100px");
    }, 1000);
})();