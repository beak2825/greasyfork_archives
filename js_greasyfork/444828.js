// ==UserScript==
// @name         WarcraftLogs移除google广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  需要存在adsbygoogle class样式
// @author       shykai
// @match        https://*.warcraftlogs.com/**
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444828/WarcraftLogs%E7%A7%BB%E9%99%A4google%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/444828/WarcraftLogs%E7%A7%BB%E9%99%A4google%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".adsbygoogle").remove();
})();