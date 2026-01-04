// ==UserScript==
// @name         新版Canvas(2024.8)视频水印消除
// @namespace    http://tampermonkey.net/
// @version      2024-08-23
// @description  fuck the watermark
// @author       Teruteru
// @match        https://v.sjtu.edu.cn/jy-application-canvas-sjtu-ui/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sjtu.edu.cn
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504798/%E6%96%B0%E7%89%88Canvas%2820248%29%E8%A7%86%E9%A2%91%E6%B0%B4%E5%8D%B0%E6%B6%88%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/504798/%E6%96%B0%E7%89%88Canvas%2820248%29%E8%A7%86%E9%A2%91%E6%B0%B4%E5%8D%B0%E6%B6%88%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addGlobalStyle = (css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    };

    addGlobalStyle("div#watermark-service-00001 {display: none !important; }");
    addGlobalStyle("div#watermark-service-00002 {display: none !important; }");
})();