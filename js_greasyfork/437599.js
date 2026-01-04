// ==UserScript==
// @name         Acfun移动动态跳转网页
// @namespace    https://www.acfun.cn/
// @version      0.1
// @description  RT
// @author       星雨漂流
// @match        https://m.acfun.cn/communityCircle/moment/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437599/Acfun%E7%A7%BB%E5%8A%A8%E5%8A%A8%E6%80%81%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/437599/Acfun%E7%A7%BB%E5%8A%A8%E5%8A%A8%E6%80%81%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const query = location.href.split('/moment/')[1]
     location.href = `https://www.acfun.cn/moment/am${query}`
})();