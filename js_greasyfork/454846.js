// ==UserScript==
// @name         重定向到双语地址
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动重定向到双语地址
// @author       wanglongbiao
// @match        https://cn.nytimes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454846/%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E5%8F%8C%E8%AF%AD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/454846/%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E5%8F%8C%E8%AF%AD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let link = document.querySelector('a[href*="/dual"]')
    if(link) {
        link.click()
    }
})();