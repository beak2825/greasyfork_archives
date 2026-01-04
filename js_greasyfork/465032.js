// ==UserScript==
// @name         洛谷主页净化
// @version      0.8
// @description  让洛谷主页变得简洁
// @match        https://www.luogu.com.cn$
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/465032/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/465032/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div:nth-child(1)").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div.lg-article.am-hide-sm").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div.am-u-md-8").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-9.am-u-md-8.lg-index-benben.lg-right > div:nth-child(2)").remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(1) > div > div > div > div").className="am-u-md-12 lg-punch am-text-center";
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
    document.querySelector("#app-old > div.lg-index-content.am-center > div:nth-child(3) > div.am-u-lg-3.am-u-md-4.lg-right > div").lastChild.remove();
})();