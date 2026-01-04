// ==UserScript==
// @name         转换body为绿豆沙色
// @namespace  https://greasyfork.org/zh-CN/users/190580
// @version      0.2.2
// @author       joeonshaw
// @match        https://*
// @grant        none
// @include      http://*
// @include      https://*
// @include      file://*
// @description  转化body颜色
// @downloadURL https://update.greasyfork.org/scripts/389218/%E8%BD%AC%E6%8D%A2body%E4%B8%BA%E7%BB%BF%E8%B1%86%E6%B2%99%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/389218/%E8%BD%AC%E6%8D%A2body%E4%B8%BA%E7%BB%BF%E8%B1%86%E6%B2%99%E8%89%B2.meta.js
// ==/UserScript==
    'use strict';
(function() {
    let bodyCol = document.querySelector("body")
    bodyCol.style.backgroundColor = "rgba(140, 199, 181, 0.5)"
    let wrapper_wrapper = document.querySelector("#wrapper_wrapper")
    wrapper_wrapper.style.backgroundColor = "rgba(140, 199, 181, 0.5)"
})();