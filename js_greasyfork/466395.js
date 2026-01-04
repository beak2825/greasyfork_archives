// ==UserScript==
// @name B站UI返回旧版
// @name:zh-cn B站UI返回旧版
// @namespace    none
// @version      0.2
// @description bilibili网站UI返回旧版
// @description:zh-cn  bilibili网站UI返回旧版
// @author       传说中的小白龙
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @require https://unpkg.com/js-cookie@3.0.5/dist/js.cookie.js
// @downloadURL https://update.greasyfork.org/scripts/466395/B%E7%AB%99UI%E8%BF%94%E5%9B%9E%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/466395/B%E7%AB%99UI%E8%BF%94%E5%9B%9E%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ['i-wanna-go-back', 'go_old_video', 'nostalgia_conf'].forEach(name => {
        Cookies.set(name, 1, {expires: 9999999, domain: '.bilibili.com'});
    });
})();