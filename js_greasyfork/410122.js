// ==UserScript==
// @name         t.cn Auto Redirect / t.cn 自动跳转
// @name:en      t.cn Auto Redirect
// @name:zh-CN   t.cn 自动跳转
// @namespace    https://t.cn/
// @version      0.1.1
// @license MIT
// @description:en  Make t.cn a real link shorten service.
// @description:zh-CN  让 t.cn 成为一个真正的短链接服务
// @author       ericdiao
// @match        *://t.cn/*
// @match        *://weibo.cn/sinaurl*
// @grant        none
// @description Make t.cn a real link shorten service.
// @downloadURL https://update.greasyfork.org/scripts/410122/tcn%20Auto%20Redirect%20%20tcn%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/410122/tcn%20Auto%20Redirect%20%20tcn%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isValidUrl(string) {
        try {
            new URL(string);
        } catch (_) {
            return false;
        }
        return true;
    }

    // Find the URL for redirect.
    var url = document.getElementsByClassName('desc')[0].textContent;

    // Do redirection.
    if (isValidUrl(url)) {
        document.getElementsByClassName('open-url')[0].children[0].textContent = "Redirecting...";
        window.location.replace(url);
    } else {
        alert("Userscript: Could not fetch URL for redirection. URL found: " + url);
    }
})();