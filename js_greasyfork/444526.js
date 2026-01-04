// ==UserScript==
// @name         思想政治理论实践教学网络平台
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  跳过等待和修复无法选择的bug
// @author       Kiyuiro
// @match        http://szsj.cswu.cn/*
// @icon         https://avatars.githubusercontent.com/u/46850357?v=4
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444526/%E6%80%9D%E6%83%B3%E6%94%BF%E6%B2%BB%E7%90%86%E8%AE%BA%E5%AE%9E%E8%B7%B5%E6%95%99%E5%AD%A6%E7%BD%91%E7%BB%9C%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/444526/%E6%80%9D%E6%83%B3%E6%94%BF%E6%B2%BB%E7%90%86%E8%AE%BA%E5%AE%9E%E8%B7%B5%E6%95%99%E5%AD%A6%E7%BD%91%E7%BB%9C%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button1 = document.createElement('input');
    button1.type = "button"
    button1.value = "点击跳过"
    button1.style.position = "fixed"
    button1.style.top = "20px"
    button1.style.right = "20px"
    document.body.appendChild(button1);

    button1.onclick = () => {
        document.querySelector("[name='regForm']").submit();
    }

    function setCheckboxStyle() {
        let checkboxs = document.querySelectorAll('[type="checkbox"]')
        checkboxs.forEach(item => {
            item.style.width = "13px"
            item.style.height = "13px"
            item.style.border = "1px solid black"
            item.style.webkitAppearance = "checkbox"
        })
    }

    setCheckboxStyle();

    // Your code here...
})();