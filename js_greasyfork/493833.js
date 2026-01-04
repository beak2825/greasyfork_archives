// ==UserScript==
// @name         移除123Pan顶部广告
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Remove elements with specified class from the page
// @author       东东
// @match        https://www.123pan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493833/%E7%A7%BB%E9%99%A4123Pan%E9%A1%B6%E9%83%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/493833/%E7%A7%BB%E9%99%A4123Pan%E9%A1%B6%E9%83%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 顶部广告
    var elements = document.getElementsByClassName("mfy-main-layout__head");
    for(var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
    }

    // 左侧按钮
    var element = document.querySelector(".sider-member-btn");
    if (element) {
        element.parentNode.removeChild(element);
    }

})();