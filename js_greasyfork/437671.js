// ==UserScript==
// @name         OA页面最大化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       AN drew
// @match        http://116.136.156.49:30080/seeyon/govdoc/govdoc.do*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/437671/OA%E9%A1%B5%E9%9D%A2%E6%9C%80%E5%A4%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/437671/OA%E9%A1%B5%E9%9D%A2%E6%9C%80%E5%A4%A7%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.screen) {//判断浏览器是否支持window.screen判断浏览器是否支持screen
        var myw = screen.availWidth;   //定义一个myw，接受到当前全屏的宽
        var myh = screen.availHeight;  //定义一个myw，接受到当前全屏的高
        window.moveTo(0, 0);           //把window放在左上脚
        window.resizeTo(myw, myh);     //把当前窗体的长宽跳转为myw和myh
    }
})();