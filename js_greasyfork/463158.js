// ==UserScript==
// @name         去除幕布分享页登录框
// @namespace    https://github.com/
// @version      0.1
// @description  通过css去除幕布分享页登录框
// @author       walker93
// @match        https://mubu.com/doc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mubu.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463158/%E5%8E%BB%E9%99%A4%E5%B9%95%E5%B8%83%E5%88%86%E4%BA%AB%E9%A1%B5%E7%99%BB%E5%BD%95%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/463158/%E5%8E%BB%E9%99%A4%E5%B9%95%E5%B8%83%E5%88%86%E4%BA%AB%E9%A1%B5%E7%99%BB%E5%BD%95%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var modalEle=document.querySelector('.mt-portal');
        modalEle.remove();
    };
})();