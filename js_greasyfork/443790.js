// ==UserScript==
// @name         QQ 链接拦截自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  QQ或者TIM自动拦截群内未知链接时，自动跳转到目标地址
// @author       You
// @run-at       document-start
// @match        *://c.pc.qq.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/443790/QQ%20%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443790/QQ%20%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryVariable(variable)
    {
        var url = new URL(location.href);
        var query = url.searchParams.toString();
        var vars = query.split("&");
        for (var i = 0; i < vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable) {
                return pair[1];
            }
        }
        return null;
    }

    var url = decodeURIComponent(getQueryVariable("pfurl") || getQueryVariable("url"));
    var urllowercase = url.toLowerCase();
    if (urllowercase.startsWith("http://") || urllowercase.startsWith("https://") || urllowercase.startsWith("ftp://") || urllowercase.startsWith("ftps://")) {
        // no thing
    } else {
        url = "http://" + url;
    }

    unsafeWindow.location.replace(url);
})();