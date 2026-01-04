// ==UserScript==
// @name         [已失效]清爽的飞猫云 0.2
// @namespace    Aloxaf_i
// @version      0.2.1
// @description  [已失效]去除飞猫云的时间限制
// @author       Aloxaf
// @match        https://www.feimaoyun.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/375604/%5B%E5%B7%B2%E5%A4%B1%E6%95%88%5D%E6%B8%85%E7%88%BD%E7%9A%84%E9%A3%9E%E7%8C%AB%E4%BA%91%2002.user.js
// @updateURL https://update.greasyfork.org/scripts/375604/%5B%E5%B7%B2%E5%A4%B1%E6%95%88%5D%E6%B8%85%E7%88%BD%E7%9A%84%E9%A3%9E%E7%8C%AB%E4%BA%91%2002.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// 取消两次下载间的时间限制
delete_cookie('fmdck');
