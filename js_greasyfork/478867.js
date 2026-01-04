// ==UserScript==
// @name         全局灰色滤镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个简单的插件 只是给你的页面加上一个灰色滤镜
// @author       fgt1t5y
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478867/%E5%85%A8%E5%B1%80%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/478867/%E5%85%A8%E5%B1%80%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style");
    style.innerHTML = ".global_gray{filter: grayscale(100%);}";
    document.body.appendChild(style);
    document.body.classList.add("global_gray");
})();