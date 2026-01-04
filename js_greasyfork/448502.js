// ==UserScript==
// @name         页面跳转JS代码定位通杀方案
// @namespace   https://github.com/CC11001100/page-redirect-code-location-hook
// @version      0.2
// @description  阻断页面跳转，留在当前页面分析
// @author       CC11001100
// @match       *://*/*
// @run-at      document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448502/%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%ACJS%E4%BB%A3%E7%A0%81%E5%AE%9A%E4%BD%8D%E9%80%9A%E6%9D%80%E6%96%B9%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/448502/%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%ACJS%E4%BB%A3%E7%A0%81%E5%AE%9A%E4%BD%8D%E9%80%9A%E6%9D%80%E6%96%B9%E6%A1%88.meta.js
// ==/UserScript==
(() => {

    // 使用说明： https://github.com/CC11001100/page-redirect-code-location-hook

    window.onbeforeunload = () => {
        debugger;
        return false;
    }

})();