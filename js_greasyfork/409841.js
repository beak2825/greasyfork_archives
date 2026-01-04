// ==UserScript==
// @name 渣浪微博外链自动跳转
// @namespace https://github.com/fython
// @version 0.2
// @description 渣浪微博外链（t.cn）自动跳转
// @author Siubeng (fython)
// @match *://t.cn/*
// @license  MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/409841/%E6%B8%A3%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/409841/%E6%B8%A3%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
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

    const link = document.querySelector("a[href]").href;
    if (isValidUrl(link)) {
        window.location.href = link;
    }
})();
