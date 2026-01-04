// ==UserScript==
// @name         自動的に全文にする ITmeida
// @namespace    https://greasyfork.org/ja/users/6866-ppppq
// @version      0.4.20190214
// @description  自動的に全文にする
// @author       You
// @match        *://*.itmedia.co.jp/*/spv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373545/%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E5%85%A8%E6%96%87%E3%81%AB%E3%81%99%E3%82%8B%20ITmeida.user.js
// @updateURL https://update.greasyfork.org/scripts/373545/%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E5%85%A8%E6%96%87%E3%81%AB%E3%81%99%E3%82%8B%20ITmeida.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loc = document.location;
    var url = new URL(loc.href);

    if (url.pathname.includes('_0.html')) {
        url.pathname = url.pathname.replace('_0.html', '.html');
        loc.replace(url.href);
    }
})();