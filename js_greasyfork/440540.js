// ==UserScript==
// @name         移除google广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  需要存在adsbygoogle class样式
// @author       niushuai233
// @match        https://*.52pojie.cn/**
// @match        https://greasyfork.org/**
// @icon         https://avatar.52pojie.cn/images/noavatar_small.gif
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440540/%E7%A7%BB%E9%99%A4google%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/440540/%E7%A7%BB%E9%99%A4google%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".adsbygoogle").remove();
})();