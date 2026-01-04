// ==UserScript==
// @name         DMHY 動漫花園 刪除特定關鍵字
// @namespace    http://your.namespace.com
// @version      0.4
// @description  刪除 DMHY 動漫花園 动漫花园 特定關鍵字
// @author       Saika
// @match        https://www.dmhy.org/*
// @match        https://share.dmhy.org/*
// @match        https://dmhy.b168.net/*
// @match        https://dmhy.org/*
// @match        https://dmhy.anoneko.com/*
// @icon         https://share.dmhy.org/favicon.ico
// @icon64       https://share.dmhy.org/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494074/DMHY%20%E5%8B%95%E6%BC%AB%E8%8A%B1%E5%9C%92%20%E5%88%AA%E9%99%A4%E7%89%B9%E5%AE%9A%E9%97%9C%E9%8D%B5%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/494074/DMHY%20%E5%8B%95%E6%BC%AB%E8%8A%B1%E5%9C%92%20%E5%88%AA%E9%99%A4%E7%89%B9%E5%AE%9A%E9%97%9C%E9%8D%B5%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 輸入想封鎖的關鍵字
    var keywords = ["恋之星第六季"];
    // 根據需要增加更多關鍵字
    // 例如 var keywords = ["恋之星第六季", "羅莉"];

    // 尋找所有行
    var rows = document.querySelectorAll("tr");

    // Loop through each row
    rows.forEach(function(row) {
        // 檢查該行中是否 有出現關鍵字
        var containsKeyword = keywords.some(function(keyword) {
            return row.innerText.includes(keyword);
        });

        // 如果找到關鍵字，則刪除該行
        if (containsKeyword) {
            row.remove();
        }
    });
})();
