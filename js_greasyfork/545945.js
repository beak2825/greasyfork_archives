// ==UserScript==
// @name        Wikipedia zh-tw+Desktop version Redirect
// @description 把手機版Wiki導向桌面版+把非台灣繁中的中文Wiki頁面（如港中、簡中等等）導向台灣繁中
// @icon https://wikipedia.org/favicon.ico
// @author       Kamikiri
// @namespace    kamikiriptt@gmail.com
// @match       *://*.m.wikipedia.org/*
// @match       *://*.wikipedia.org/zh-hant/*
// @match       *://*.wikipedia.org/zh-cn/*
// @match       *://*.wikipedia.org/zh-hk/*
// @match       *://*.wikipedia.org/zh-mo/*
// @match       *://*.wikipedia.org/zh-my/*
// @match       *://*.wikipedia.org/zh-sg/*
// @license     GPL
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/545945/Wikipedia%20zh-tw%2BDesktop%20version%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/545945/Wikipedia%20zh-tw%2BDesktop%20version%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = location.href;

    // 1. 把手機版Wiki導向桌面版
    var mobileRegex = /^(https?:\/\/.*)\.m(\.wikipedia\.org\/.*)/;
    if (mobileRegex.exec(url)) {
        location.href = url.replace('.m.', '.');
        return;
    }

    // 2. 把非台灣繁中的中文Wiki頁面導向台灣繁中（如港中、簡中等等）
    var langRegex = /^(https?:\/\/.*)(\.wikipedia\.org\/zh-)(hans|hant|cn|hk|mo|my|sg).*?(\/.*)/;
if (!location.href.includes("zh-tw")) {
    location.href = location.href.replace(/(\.wikipedia\.org\/zh-)(hans|hant|cn|hk|mo|my|sg)(\/.*)/, '$1tw$3');
}
})();
