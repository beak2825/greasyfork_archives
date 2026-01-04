// ==UserScript==
// @name         百度文库去除选中文本时弹出的ai按钮
// @namespace    http://tampermonkey.net/
// @version      2023-12-16
// @description  百度文库去除恶心的选中文本时弹出的ai按钮
// @author       You
// @match        https://wenku.baidu.com/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482394/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E9%99%A4%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E6%97%B6%E5%BC%B9%E5%87%BA%E7%9A%84ai%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/482394/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E9%99%A4%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E6%97%B6%E5%BC%B9%E5%87%BA%E7%9A%84ai%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        document.querySelector(".editor-plugin-wrap").parentElement.removeChild(document.querySelector(".editor-plugin-wrap"))
    }
})();