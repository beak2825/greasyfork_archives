// ==UserScript==
// @name         知乎去除强制登录弹出框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这个脚本自动去除了强制登录弹出框。另外访问登录页面会自动跳转到搜索页面，直接开始你的搜索。
// @author       Ganlv
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417220/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%BC%BA%E5%88%B6%E7%99%BB%E5%BD%95%E5%BC%B9%E5%87%BA%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/417220/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%BC%BA%E5%88%B6%E7%99%BB%E5%BD%95%E5%BC%B9%E5%87%BA%E6%A1%86.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (window.location.href.indexOf("/signin") >= 0) {
        window.location.href = "//zhihu.com/search";
    }

    function removeSignFlowModal() {
        var el = document.querySelector('.signFlowModal');
        if (el !== null) {
            while (el.parentElement !== document.body) {
                el = el.parentElement;
            }
            el.remove();
            setTimeout(function () {
                document.documentElement.style.overflow = "";
                document.documentElement.style.marginRight = "";
            }, 50);
        }
    }

    document.body.addEventListener("DOMNodeInserted", function () {
        removeSignFlowModal();
    });
})();