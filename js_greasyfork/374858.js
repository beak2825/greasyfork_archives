// ==UserScript==
// @name         coding首页自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新版 coding 首页自动跳转到个人中心
// @author       You
// @match        https://coding.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374858/coding%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/374858/coding%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    if (/coding.net\/?$/.test(url))
        window.location.href = 'https://dev.tencent.com/user'
})();
