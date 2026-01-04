// ==UserScript==
// @name         洛谷省略专栏跳转
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  解放双手，造福人类
// @author       cyx
// @match        *://www.luogu.com.cn/article/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488981/%E6%B4%9B%E8%B0%B7%E7%9C%81%E7%95%A5%E4%B8%93%E6%A0%8F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488981/%E6%B4%9B%E8%B0%B7%E7%9C%81%E7%95%A5%E4%B8%93%E6%A0%8F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let a = document.URL;
    let t = document.documentElement.outerHTML;
    let b = "";
    for (let i = 0; i < a.length; i++) {
        if (i < a.length - 3 && a[i] == '.' && a[i + 1] == 'c' && a[i + 2] == 'n') i += 2;
        else b += a[i];
    }
    if (t.indexOf(b) >= 0) {
        window.location.replace(b);
    }
})();