// ==UserScript==
// @name         关闭网站灰色过滤
// @description  网页美容
// @author       Ryan Choi
// @version      1.4.
// @license      MIT
// @namespace    https://juejin.cn/?utm_source=gold_browser_extension
// @match        https://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456038/%E5%85%B3%E9%97%AD%E7%BD%91%E7%AB%99%E7%81%B0%E8%89%B2%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/456038/%E5%85%B3%E9%97%AD%E7%BD%91%E7%AB%99%E7%81%B0%E8%89%B2%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let css = `
    html{
        -webkit-filter: grayscale(0)!important;
        filter: grayscale(0)important!;
        }
    body{
        -webkit-filter: grayscale(0)!important;
        filter:grayscale(0)!important;
        }
    gray {
        -webkit-filter:grayscale(0) !important;
        filter:grayscale(0)!important;
        }
    element.style {
        -webkit-filter:grayscale(0) !important;
        filter: grayscale(0)!important;
           }`
    document.body.classList.remove("big-event-gray");
    GM_addStyle(css)
})();