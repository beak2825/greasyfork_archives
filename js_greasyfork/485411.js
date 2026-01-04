// ==UserScript==
// @name         删除一块钱评教窗口
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除一块钱评教顶层遮挡
// @author       Melonedo
// @match        https://1.tongji.edu.cn/workbench
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongji.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485411/%E5%88%A0%E9%99%A4%E4%B8%80%E5%9D%97%E9%92%B1%E8%AF%84%E6%95%99%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/485411/%E5%88%A0%E9%99%A4%E4%B8%80%E5%9D%97%E9%92%B1%E8%AF%84%E6%95%99%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

setTimeout(function() {
    'use strict';

    document.querySelector('.el-message-box__wrapper')?.remove() ;
    document.querySelector('body > .v-modal')?.remove();
}, 1000);