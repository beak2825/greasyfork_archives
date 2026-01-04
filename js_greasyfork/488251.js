// ==UserScript==
// @name         盛趣登录页面自动勾选同意服务协议
// @namespace    https://greasyfork.org/users/325815
// @version      1.0.0
// @description  none
// @author       monat151
// @license      MIT
// @match        https://login.u.sdo.com/sdo/Login/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sdo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488251/%E7%9B%9B%E8%B6%A3%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/488251/%E7%9B%9B%E8%B6%A3%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.$

    $('#isAgreementAccept').prop('checked', true)
})();