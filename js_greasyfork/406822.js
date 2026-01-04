// ==UserScript==
// @name         跳过 管家拦截页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳过腾讯的管家拦截页面
// @author       Epix
// @match        https://c.pc.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406822/%E8%B7%B3%E8%BF%87%20%E7%AE%A1%E5%AE%B6%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/406822/%E8%B7%B3%E8%BF%87%20%E7%AE%A1%E5%AE%B6%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.href=new URLSearchParams(location.search.substring(1)).get('pfurl');
})();