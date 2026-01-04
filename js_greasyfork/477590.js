
// ==UserScript==
// @license MIT
// @name         u校园愚蠢的刷新网页功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动刷新网页功能
// @author       写代码的猫叔
// @match        *://ucontent.unipus.cn/_pc_default/pc.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477590/u%E6%A0%A1%E5%9B%AD%E6%84%9A%E8%A0%A2%E7%9A%84%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/477590/u%E6%A0%A1%E5%9B%AD%E6%84%9A%E8%A0%A2%E7%9A%84%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let timeout = 120
    console.log('%s秒后刷新: ', timeout);
    setTimeout(() => {
      location.reload()
    }, timeout*1000);
})();
