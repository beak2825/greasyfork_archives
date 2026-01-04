// ==UserScript==
// @name        Pure_掘金
// @namespace   https://juejin.cn/*
// @match       https://juejin.cn/*
// @grant       none
// @version     0.5.1
// @author      13号寄信人
// @description 净化掘金
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/463108/Pure_%E6%8E%98%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463108/Pure_%E6%8E%98%E9%87%91.meta.js
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
            return `
        .recommend-box , .sidebar > a , .sidebar > .sidebar-bd-entry , .article-suspended-panel , .article-end , .category-course-recommend {
            display: none !important;
        }
        `
        }
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