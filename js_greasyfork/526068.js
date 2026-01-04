// ==UserScript==
// @name         阿里云盘自动重定向
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  重定向分享页面的 aliyundrive.com 到 alipan.com
// @author       You
// @match        https://www.aliyundrive.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526068/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/526068/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.href = 'http://alipan.com' + location.pathname
})();