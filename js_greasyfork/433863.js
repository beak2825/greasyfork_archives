// ==UserScript==
// @name GitHubの一部テキストを日本語化
// @author waki285
// @version 1.0.1
// @description GitHubの「Code」や「Issue」などを日本語化してくれます。
// @match github.com/*
// @match github.com/*/*
// @namespace https://greasyfork.org/ja/users/585161
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/433863/GitHub%E3%81%AE%E4%B8%80%E9%83%A8%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%82%92%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/433863/GitHub%E3%81%AE%E4%B8%80%E9%83%A8%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%82%92%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%8C%96.meta.js
// ==/UserScript==
(() => {
    'use strict';
    $("span[data-content=Code]").textContent = "コード";
})();