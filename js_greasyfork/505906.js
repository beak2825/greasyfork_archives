// ==UserScript==
// @name         清爽百度经验
// @namespace    http://tampermonkey.net/
// @version      2024-08-30
// @description  清爽的百度经验
// @author       You
// @match        https://jingyan.baidu.com*
// @icon         http://baidu.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505906/%E6%B8%85%E7%88%BD%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/505906/%E6%B8%85%E7%88%BD%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.querySelectorAll(".wgt-quote").forEach(a => { a.style = 'display:none'; })
    document.querySelector("#aside").style = 'display:none';
    document.querySelector("#task-panel-wrap").style = 'display:none';
    document.querySelector("#bottom-ads-container").style = 'display:none';
})();