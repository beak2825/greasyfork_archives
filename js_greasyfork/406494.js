// ==UserScript==
// @name         百度首页净化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  还原一个干净的百度首页
// @author       WoShiJack
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406494/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406494/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = () => {
        //热榜标题
        var title = document.getElementsByClassName("s-hotsearch-title");
        //热榜内容
        var content = document.getElementsByClassName("s-hotsearch-content");
        //首页左上角
        var top_left = document.getElementsByClassName("s-top-left");
        //首页左下角
        var bottom_left = document.getElementsByClassName("s-bottom-layer-left");
        //首页右下角
        var bottom_right = document.getElementsByClassName("s-bottom-layer-right");
        //首页右下角二维码
        var qrcode = document.getElementsByClassName("qrcode-nologin");
        //首页
        var top_right = document.getElementsByClassName("s-top-right");
        title[0].style.display="none";
        content[0].style.display="none";
        top_left[0].style.display="none";
        bottom_left[0].style.display="none";
        bottom_right[0].style.display="none";
        qrcode[0].style.display="none";
        top_right[0].style.display="none";
    };
})();