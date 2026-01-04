// ==UserScript==
// @name         洛谷省略专栏、剪切板、讨论跳转
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  解放双手，造福人类
// @author       tbdsh
// @match        *://www.luogu.com.cn/article/*
// @match        *://www.luogu.com.cn/discuss/*
// @match        *://www.luogu.com.cn/paste/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501530/%E6%B4%9B%E8%B0%B7%E7%9C%81%E7%95%A5%E4%B8%93%E6%A0%8F%E3%80%81%E5%89%AA%E5%88%87%E6%9D%BF%E3%80%81%E8%AE%A8%E8%AE%BA%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/501530/%E6%B4%9B%E8%B0%B7%E7%9C%81%E7%95%A5%E4%B8%93%E6%A0%8F%E3%80%81%E5%89%AA%E5%88%87%E6%9D%BF%E3%80%81%E8%AE%A8%E8%AE%BA%E8%B7%B3%E8%BD%AC.meta.js
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