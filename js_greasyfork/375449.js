// ==UserScript==
// @name         托福考满分海外IP屏蔽解除
// @namespace    https://kyokuheishin.github.io/
// @version      0.102
// @description  解除托福考满分网站对于海外IP的屏蔽遮罩+模糊
// @author       kyokuheishin
// @match        https://toefl.kmf.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375449/%E6%89%98%E7%A6%8F%E8%80%83%E6%BB%A1%E5%88%86%E6%B5%B7%E5%A4%96IP%E5%B1%8F%E8%94%BD%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/375449/%E6%89%98%E7%A6%8F%E8%80%83%E6%BB%A1%E5%88%86%E6%B5%B7%E5%A4%96IP%E5%B1%8F%E8%94%BD%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var shieldBoxList = document.getElementsByClassName("shield-box js-shield-box");
    shieldBoxList[0].parentNode.removeChild(shieldBoxList[0]);
    var maskList = document.getElementsByClassName("practice-container js-practice-container");
    setTimeout(function(){
        maskList[0].classList.remove("blur");
    },1500);
})();