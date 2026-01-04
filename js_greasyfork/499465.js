// ==UserScript==
// @name         qhu cs 选课去掉禁用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除禁用属性并为特定按钮绑定 onclick 事件
// @match        *://120.53.235.233:8080/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499465/qhu%20cs%20%E9%80%89%E8%AF%BE%E5%8E%BB%E6%8E%89%E7%A6%81%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499465/qhu%20cs%20%E9%80%89%E8%AF%BE%E5%8E%BB%E6%8E%89%E7%A6%81%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableBtnWarning() {
        let btnWarningElements = document.querySelectorAll('.btn-warning');
        btnWarningElements.forEach(function(button) {
            button.removeAttribute('disabled');
            button.setAttribute('onclick', 'del(this)');
        });
    }

    function enableBtnInfo() {
        let btnInfoElements = document.querySelectorAll('.btn-info');
        btnInfoElements.forEach(function(button) {
            button.removeAttribute('disabled');
            button.setAttribute('onclick', 'add(this)');
        });
    }

    enableBtnWarning();
    enableBtnInfo();
})();
