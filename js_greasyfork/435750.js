// ==UserScript==
// @name         强智教务系统增强
// @version      0.0.8
// @icon         http://www.qzdatasoft.com/favicon.ico
// @description  让强智不弱智
// @author       torwe
// @homepageURL  https://greasyfork.org/zh-CN/users/839490-torwe
// @namespace    https://greasyfork.org/zh-CN/scripts/435750-%E5%BC%BA%E6%99%BA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA
// @supportURL   https://greasyfork.org/zh-CN/scripts/435750-%E5%BC%BA%E6%99%BA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA/feedback
// @license      GPL-3.0 License
// @match        http://qzjw.peizheng.edu.cn/jsxsd/kqgl/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/435750/%E5%BC%BA%E6%99%BA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435750/%E5%BC%BA%E6%99%BA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var time=window.setInterval(function(){
        document.querySelector("#xx04id > option:nth-child(2)").selected = true;

        if (window.screen) {//判断浏览器是否支持window.screen判断浏览器是否支持screen
            var myw = screen.availWidth;   //定义一个myw，接受到当前全屏的宽
            var myh = screen.availHeight;  //定义一个myw，接受到当前全屏的高
            window.moveTo(0, 0);           //把window放在左上脚
            window.resizeTo(myw, myh);     //把当前窗体的长宽跳转为myw和myh
        }

    },5)
    
})();