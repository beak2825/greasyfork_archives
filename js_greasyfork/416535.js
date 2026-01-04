// ==UserScript==
// @name         问卷星允许选中复制
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @icon         https://www.wjx.cn/favicon.ico
// @description  解除问卷星对选中和右键的限制
// @author       CodeLumos
// @homepageURL  https://github.com/codelumos/tampermonkey-scripts
// @match        *://*.wjx.cn/*
// @match        *://*.wjx.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416535/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%85%81%E8%AE%B8%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/416535/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%85%81%E8%AE%B8%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.oncontextmenu = function () {
        return true;
    };
    document.onselectstart = function () {
        return true;
    };
    $("body").css("user-select", "text");

})();
