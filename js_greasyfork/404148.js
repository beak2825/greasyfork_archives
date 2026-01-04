// ==UserScript==
// @name         给予页面具有跨域能力的 XMLHttpRequest
// @namespace    https://www.qs5.org/?cross-domain-xhr2
// @version      0.1
// @description  给你的页面添加具有跨域能力的 XMLHttpRequest
// @author       ImDong
// @include      *
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404148/%E7%BB%99%E4%BA%88%E9%A1%B5%E9%9D%A2%E5%85%B7%E6%9C%89%E8%B7%A8%E5%9F%9F%E8%83%BD%E5%8A%9B%E7%9A%84%20XMLHttpRequest.user.js
// @updateURL https://update.greasyfork.org/scripts/404148/%E7%BB%99%E4%BA%88%E9%A1%B5%E9%9D%A2%E5%85%B7%E6%9C%89%E8%B7%A8%E5%9F%9F%E8%83%BD%E5%8A%9B%E7%9A%84%20XMLHttpRequest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof unsafeWindow.setCrossDomainXMLHttpRequest == "function") {
        unsafeWindow.setCrossDomainXMLHttpRequest(GM_xmlhttpRequest);
    }
})();