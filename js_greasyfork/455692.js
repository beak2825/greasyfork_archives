// ==UserScript==
// @name         去除版谷米主页黑白
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除版谷米主页黑白(bgm.tv、bangumi.tv、chii.in)
// @author       老悠
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455692/%E5%8E%BB%E9%99%A4%E7%89%88%E8%B0%B7%E7%B1%B3%E4%B8%BB%E9%A1%B5%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455692/%E5%8E%BB%E9%99%A4%E7%89%88%E8%B0%B7%E7%B1%B3%E4%B8%BB%E9%A1%B5%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").removeClass("bangumi");
})();