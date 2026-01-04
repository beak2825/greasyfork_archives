// ==UserScript==
// @name         Yahoo! - Yahoo!検索削除
// @namespace    https://github.com/y-muen
// @license      MIT
// @version      0.1.4
// @description  Yahoo!でYahoo検索のポップアップを削除する。
// @author       Yoiduki <y-muen>
// @include      *://news.yahoo.co.jp/*
// @include      *://chiebukuro.yahoo.co.jp/*
// @include      *://*.chiebukuro.yahoo.co.jp/*
// @icon         https://www.google.com/s2/favicons?domain=yahoo.co.jp
// @grant        GM_addStyle
// @supportURL   https://gist.github.com/y-muen/087b1da04d259314c72d62aaee310feb
// @downloadURL https://update.greasyfork.org/scripts/443512/Yahoo%21%20-%20Yahoo%21%E6%A4%9C%E7%B4%A2%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/443512/Yahoo%21%20-%20Yahoo%21%E6%A4%9C%E7%B4%A2%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("#yjSearchPop {visibility:hidden; }")
})();