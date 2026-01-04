// ==UserScript==
// @name         Bilibili 网页全屏后改变标签栏颜色
// @namespace    xianfei
// @version      0.2.0
// @description  在新版Safari合并标签页和地址栏的情况下，网页全屏后将顶栏改为黑色
// @author       xianfei
// @match      *://www.bilibili.com/video/*
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459328/Bilibili%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%90%8E%E6%94%B9%E5%8F%98%E6%A0%87%E7%AD%BE%E6%A0%8F%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/459328/Bilibili%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%90%8E%E6%94%B9%E5%8F%98%E6%A0%87%E7%AD%BE%E6%A0%8F%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setToolbarColor(color) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
 
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
 
        themeColorMeta.content = color;
    }
    setInterval(()=>{if(document.querySelector('#bilibili-player').getAttribute('class').indexOf("mode-webscreen")!=-1)setToolbarColor('#000');else setToolbarColor('#fff');},100)
})();