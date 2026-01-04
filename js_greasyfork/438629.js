// ==UserScript==
// @name         今日热榜小改动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        https://tophub.today/dashboard
// @icon         https://tophub.today/favicon.ico
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/438629/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E5%B0%8F%E6%94%B9%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/438629/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E5%B0%8F%E6%94%B9%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a=document.getElementsByClassName('Zd-p-ae')
    var b=document.getElementsByClassName('zb-p')[0]
    b.appendChild(a[0])
    var faviconurl="https://www.yinxiang.com/favicon.ico" ;//这里可以是动态的获取的favicon的地址

    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');

    link.type = 'image/x-icon';

    link.rel = 'shortcut icon';

    link.href = faviconurl;
    document.getElementsByTagName('head')[0].appendChild(link);

    // Your code here...
})();