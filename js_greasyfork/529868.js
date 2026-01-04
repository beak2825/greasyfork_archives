// ==UserScript==
// @name         修改B站粉丝数（本地）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动更改b站前端任意up主主页的粉丝数为脚本内设定值
// @author       EricZhou05
// @match        https://space.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529868/%E4%BF%AE%E6%94%B9B%E7%AB%99%E7%B2%89%E4%B8%9D%E6%95%B0%EF%BC%88%E6%9C%AC%E5%9C%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529868/%E4%BF%AE%E6%94%B9B%E7%AB%99%E7%B2%89%E4%B8%9D%E6%95%B0%EF%BC%88%E6%9C%AC%E5%9C%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationList, observer) => {
        if (document.getElementsByClassName("nav-statistics__item-num") &&
            document.getElementsByClassName("nav-statistics__item-num")[1]) {
            document.getElementsByClassName("nav-statistics__item-num")[1].innerText = '2333.3万';
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
