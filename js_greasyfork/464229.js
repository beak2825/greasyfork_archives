// ==UserScript==
// @name        去除知乎中间跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除知乎烦人的中间跳转确认
// @author       Eric
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464229/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%AD%E9%97%B4%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464229/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%AD%E9%97%B4%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("a[href^='https://link.zhihu.com']")
        .forEach(function(v){
        v.setAttribute('href', decodeURIComponent(v.getAttribute('href').replace('https://link.zhihu.com/?target=', '')))
    })
})();