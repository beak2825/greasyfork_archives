// ==UserScript==
// @name         腾讯域名拦截重定向
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  重定向腾讯拦截页面的域名
// @author       Akilarlxh
// @match        *://c.pc.qq.com/*
// @icon         https://akilar.top/img/siteicon/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427083/%E8%85%BE%E8%AE%AF%E5%9F%9F%E5%90%8D%E6%8B%A6%E6%88%AA%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/427083/%E8%85%BE%E8%AE%AF%E5%9F%9F%E5%90%8D%E6%8B%A6%E6%88%AA%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Redirect_url = document.getElementById("url").innerText;
    var Has_HTTP = Redirect_url.substring(0,4);
    if (Has_HTTP === "http"){
        window.location.href = Redirect_url;
    }
    else {
        Redirect_url = "https://"+ Redirect_url;
        window.location.href = Redirect_url;
    }

})();