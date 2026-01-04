// ==UserScript==
// @name         河南工业职业技术学院继续教育平台-可点击进度条脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  河南工业职业技术学院继续教育平台脚本，运行后可以直接进行进度条点击跳转
// @author       ethan4y
// @match        http://hnpizy.newzhihui.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hnpizy.newzhihui.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512566/%E6%B2%B3%E5%8D%97%E5%B7%A5%E4%B8%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E5%8F%AF%E7%82%B9%E5%87%BB%E8%BF%9B%E5%BA%A6%E6%9D%A1%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512566/%E6%B2%B3%E5%8D%97%E5%B7%A5%E4%B8%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E5%8F%AF%E7%82%B9%E5%87%BB%E8%BF%9B%E5%BA%A6%E6%9D%A1%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    window.ckplayer.prototype.checkSlideLeft = function() {
        return true;
    };
 
})();