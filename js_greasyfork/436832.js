// ==UserScript==
// @name         acl 自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用来 acl 自动登录
// @author       AC-YoY
// @include      *://*sso.shizhuang-inc.*/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436832/acl%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/436832/acl%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function () {
        var reg = /code/
        var href = location.href
        if (!reg.test(href)) {
            // document.querySelector('.fs-login button').click();
            $("button:contains('飞书')")[0].click()
        }
    })
})();