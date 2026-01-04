// ==UserScript==
// @name         草榴社区手机版 redirect t66y to mobile url
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在PC上重定向草榴社区链接到手机版
// @author       TSO
// @match        *://*/htm_data/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396665/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E6%89%8B%E6%9C%BA%E7%89%88%20redirect%20t66y%20to%20mobile%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/396665/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E6%89%8B%E6%9C%BA%E7%89%88%20redirect%20t66y%20to%20mobile%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = location.href;
    var regx = /\/htm_data\//;
    if (!regx.test(url)) return;
    location.href = url.replace(regx, '/htm_mob/');
})();