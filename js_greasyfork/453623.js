// ==UserScript==
// @name         什么值得买-直接购买
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  什么值得买，增加直接购买按钮
// @author       You
// @match        https://www.smzdm.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453623/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0-%E7%9B%B4%E6%8E%A5%E8%B4%AD%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/453623/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0-%E7%9B%B4%E6%8E%A5%E8%B4%AD%E4%B9%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let buyBtnGroup = document.querySelector(".info-details .J_btn_group");
    if (buyBtnGroup == null) {
        return;
    }
    let mobileBuyBtn = buyBtnGroup.querySelector(".mobile-buy");
    if (mobileBuyBtn == null) {
        return;
    }
    let qrImg = mobileBuyBtn.querySelector(".qr-code-box img");
    if (qrImg == null) {
        return;
    }
    let buyUrl = qrImg.getAttribute("data-url");
    if (buyUrl == null) {
        return;
    }
    let directBuyBtn = document.createElement("a");
    directBuyBtn.setAttribute("href", buyUrl);
    directBuyBtn.setAttribute("target", "_blank");
    directBuyBtn.classList.add("go-buy");
    directBuyBtn.classList.add("btn");
    directBuyBtn.innerHTML = '直接购买<i class="icon-angle-right-o-thin">';
    buyBtnGroup.append(directBuyBtn);
    // Your code here...
})();