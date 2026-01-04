// ==UserScript==
// @name        Pure_脚本之家
// @namespace   https://www.jb51.net/*
// @match       https://www.jb51.net/*
// @grant       none
// @version     0.0.2
// @author      13号寄信人
// @description 净化脚本之家
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479281/Pure_%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/479281/Pure_%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    appendStyle(buildCss())

    function buildCss() {
        if (browserDetection() !== "PC") {
            //------------------------移动端------------------------
            console.log("Not PC")
            return ``
        } else {
            //------------------------桌面端------------------------
            console.log("Is PC")
            return pathHandler()
        }
    }

    function pathHandler() {
        let pathname = location.pathname;
        if (pathname.includes("/article/")) {
            return articlePathRule()
        }
    }

    function articlePathRule() {
        return `
        .pt10 , .r300 , .logor , .logom , .lbd , #i009b , .lbd_bot {
            display: none !important;
        }
        `
    }

    function appendStyle(css) {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    function browserDetection() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        let browser = null;
        if (userAgent.match(/ipad/i)) {
            browser = 'ipad';
        } else if (userAgent.match(/iphone os/i)) {
            browser = 'iphone';
        } else if (userAgent.match(/midp/i)) {
            browser = 'midp'
        } else if (userAgent.match(/rv:1.2.3.4/i)) {
            browser = 'rv:1.2.3.4';
        } else if (userAgent.match(/ucweb/i)) {
            browser = 'ucweb';
        } else if (userAgent.match(/android/i)) {
            browser = 'android';
        } else if (userAgent.match(/windows ce/i)) {
            browser = 'windowsCe';
        } else if (userAgent.match(/windows mobile/i)) {
            browser = 'windowsMobile';
        } else {
            browser = 'PC'
        }
        return browser;
    }
})();