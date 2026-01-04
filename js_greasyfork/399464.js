// ==UserScript==
// @name         gray filter remover
// @namespace    color
// @version      1.5
// @description  移除国家公祭日加在网页上的灰色滤镜, 恢复彩色适用于大部分网站.
// @author       AndyF
// @license      GPL-3.0-or-later
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://*.facebook.com/*
// @exclude      *://twitter.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/399464/gray%20filter%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/399464/gray%20filter%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var grayDate=new Array();
    var a = new Date();
    grayDate.push("2020-4-4"); //抗击新冠疫情斗争牺牲烈士纪念日
    grayDate.push("2020-12-13"); //第七个南京大屠杀国家公祭日
    grayDate.push("2022-11-30"); // 3rd 领导人逝世, 持续7天
    grayDate.push("2022-12-1");
    grayDate.push("2022-12-2");
    grayDate.push("2022-12-3");
    grayDate.push("2022-12-4");
    grayDate.push("2022-12-5");
    grayDate.push("2022-12-6");
    grayDate.push("2022-12-7");

    var today=a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getUTCDate();
    if(-1 == grayDate.indexOf(today)) return;//非灰色日期时退出脚本, 避免引发bug

    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('styles_remove_gray_filter');

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_remove_gray_filter';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }

        styleElement.appendChild(document.createTextNode(newStyle));
    }

    addNewStyle('* {filter: unset!important;-webkit-filter: unset!important;}');
    document.getElementsByTagName("html")[0].style.cssText="-webkit-filter: grayscale(0%) !important; ";
})();