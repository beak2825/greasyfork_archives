// ==UserScript==
// @name         自動的に全文にする Afpbb
// @namespace    https://greasyfork.org/ja/users/6866-ppppq
// @version      0.2.20190312
// @description  自動的に全文にする
// @author       You
// @match        *://www.afpbb.com/articles/-/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373544/%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E5%85%A8%E6%96%87%E3%81%AB%E3%81%99%E3%82%8B%20Afpbb.user.js
// @updateURL https://update.greasyfork.org/scripts/373544/%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E5%85%A8%E6%96%87%E3%81%AB%E3%81%99%E3%82%8B%20Afpbb.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loc = document.location;
    var url = new URL(loc.href);
    var search = url.search;
    var fullPageMarker = 'act=all';

    if (!search.includes(fullPageMarker)) {
        if (search.length === 0) {
            url.search = fullPageMarker;
        } else {
            url.search += `&${fullPageMarker}`;
        }
        loc.replace(url.href);
    }
})();