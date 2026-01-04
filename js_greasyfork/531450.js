// ==UserScript==
// @name         IThome 手機版文章重新導向
// @namespace    https://ithelp.ithome.com.tw/
// @version      1.0
// @description  將手機版 URL 重新導向到桌面版本。iThome 官網不做我只好自己寫了。
// @author       Elvis Mao
// @match        https://ithelp.ithome.com.tw/m/articles/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531450/IThome%20%E6%89%8B%E6%A9%9F%E7%89%88%E6%96%87%E7%AB%A0%E9%87%8D%E6%96%B0%E5%B0%8E%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/531450/IThome%20%E6%89%8B%E6%A9%9F%E7%89%88%E6%96%87%E7%AB%A0%E9%87%8D%E6%96%B0%E5%B0%8E%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.pathname.startsWith('/m/articles/')) {
        let newUrl = window.location.href.replace('/m/articles/', '/articles/');
        window.location.replace(newUrl);
    }
})();
