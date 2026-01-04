// ==UserScript==
// @name         知乎黑化(dark mode)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  开启知乎夜间模式
// @author       954
// @match        https://*.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513710/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%8C%96%28dark%20mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513710/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%8C%96%28dark%20mode%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setCookie(name, value, domain, path, expires, secure, httpOnly) {
        let cookieString = name + "=" + value + ";";
        if (domain) cookieString += " domain=" + domain + ";";
        if (path) cookieString += " path=" + path + ";";
        if (expires) cookieString += " expires=" + expires + ";";
        if (secure) cookieString += " Secure;";
        if (httpOnly) cookieString += " HttpOnly;";

        document.cookie = cookieString;
    }

    let expires = "Fri, 31 Dec 9999 23:59:59 GMT";  
    setCookie("theme", "dark", ".zhihu.com", "/", expires, false, false);

})();
