// ==UserScript==
// @name         删掉 B 站主页右下角的傻逼广告
// @namespace    http://tampermonkey.net/
// @version      2024-11-18
// @description  rt
// @author       cff_0102
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516519/%E5%88%A0%E6%8E%89%20B%20%E7%AB%99%E4%B8%BB%E9%A1%B5%E5%8F%B3%E4%B8%8B%E8%A7%92%E7%9A%84%E5%82%BB%E9%80%BC%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/516519/%E5%88%A0%E6%8E%89%20B%20%E7%AB%99%E4%B8%BB%E9%A1%B5%E5%8F%B3%E4%B8%8B%E8%A7%92%E7%9A%84%E5%82%BB%E9%80%BC%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function cff(){
        let elements = document.querySelectorAll('div.btn-ad');
        elements.forEach(element => {
            element.remove();
        });
        elements = document.querySelectorAll('[data-v-361c3122]');
        elements.forEach(element => {
            element.remove();
        });
        elements = document.querySelectorAll('[data-v-2ce37bb8]');
        elements.forEach(element => {
            element.remove();
        });
        elements = document.querySelectorAll('[data-v-c6402956]');
        elements.forEach(element => {
            element.remove();
        });
        elements = document.querySelectorAll('[data-v-57648604]');
        elements.forEach(element => {
            element.remove();
        });
    }
    setInterval(cff, 500);
})();
