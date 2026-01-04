// ==UserScript==
// @name         SABB解除文字选择限制
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @homepage     https://greasyfork.org/zh-CN/scripts/447270-sabb%E8%A7%A3%E9%99%A4%E6%96%87%E5%AD%97%E9%80%89%E6%8B%A9%E9%99%90%E5%88%B6
// @description  自用
// @author       义气之勇
// @match        *.sabb.com/*
// @match        *.sab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sabb.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447270/SABB%E8%A7%A3%E9%99%A4%E6%96%87%E5%AD%97%E9%80%89%E6%8B%A9%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447270/SABB%E8%A7%A3%E9%99%A4%E6%96%87%E5%AD%97%E9%80%89%E6%8B%A9%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.onmousedown = function (event) //鼠标按下事件
    {
        //  $("*").css("user-select", "text");  //依赖JQ，改为下面的原生JS遍历

        // 遍历
        var elements = document.querySelectorAll('*');
        elements.forEach(function (element) {
            element.style.userSelect = 'text';
        });

    }

    // 解除粘贴限制
    document.addEventListener('paste', function (e) {
        e.stopImmediatePropagation();
    }, true);

})();