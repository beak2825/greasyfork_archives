// ==UserScript==
// @name         解除复制限制，全网解除文本复制，下载图片等限制
// @description  无需复杂操作，安装即可全网解除文本复制，下载图片等限制。支持百度文库复制，小红书，CSDN等无需登录即可复制，下载图片。
// @namespace    https://coupon.jasonzk.com/
// @version      1.0.0
// @author       落叶归秋
// @match        *://*/*
// @license      All Rights Reserved
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/510542/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E5%85%A8%E7%BD%91%E8%A7%A3%E9%99%A4%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%EF%BC%8C%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E7%AD%89%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/510542/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E5%85%A8%E7%BD%91%E8%A7%A3%E9%99%A4%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%EF%BC%8C%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E7%AD%89%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableCopy() {
        document.addEventListener(
            "contextmenu",
            function (event) {
                event.stopPropagation();
            },
            true,
        );

        document.addEventListener(
            "selectstart",
            function (event) {
                event.stopPropagation();
            },
            true,
        );

        document.addEventListener(
            "copy",
            function (event) {
                event.stopPropagation();
            },
            true,
        );

        const codes = document.querySelectorAll("code");
        codes.forEach((element) => {
            element.style.userSelect = "auto";
            // element.style.webkitUserSelect = "auto";
            // element.style.MozUserSelect = "auto";
            // element.style.msUserSelect = "auto";
            element.style.pointerEvents = "auto";

            element.oncontextmenu = null;
            element.onselectstart = null;
            element.oncopy = null;
        });

        const pres = document.querySelectorAll("pre");
        pres.forEach((element) => {
            element.style.userSelect = "auto";
            // element.style.webkitUserSelect = "auto";
            // element.style.MozUserSelect = "auto";
            // element.style.msUserSelect = "auto";
            element.style.pointerEvents = "auto";

            element.oncontextmenu = null;
            element.onselectstart = null;
            element.oncopy = null;
        });
        const wenkuEl = document.querySelector(".header-wrapper");
        wenkuEl.__vue__.vipInfo.isVip = true;
    }

    enableCopy();
})();