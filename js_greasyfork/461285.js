// ==UserScript==
// @name        Pure_CSDN
// @namespace   https://blog.csdn.net/*
// @match       https://blog.csdn.net/*
// @grant       none
// @version     0.6.5
// @author      13号寄信人
// @description 净化CSDN
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461285/Pure_CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/461285/Pure_CSDN.meta.js
// ==/UserScript==

(function () {
    'use strict';

    appendStyle(buildCss())

    function buildCss() {
        if (browserDetection() !== "PC") {
            //------------------------移动端------------------------
            return `
        .wap-shadowbox , .readall_box .open_app_channelCode .btn_open_app_prompt_div {
            display: none !important;
        }
        .article_content{
            height:auto !important;
        }
        #main {
            padding-top: 0 !important;
            margin-top: 0 !important;
        }
        `
        } else {
            //------------------------桌面端------------------------
            return `
        .blog_container_aside , #rightAside , .csdn-side-toolbar , .csdn-toolbar-creative-mp-bg , .toolbar-advert {
            display: none !important;
        }
        #mainBox {
            display: flex !important;
            justify-content: center !important;
        }
        .container {
            margin-right: 0 !important;
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