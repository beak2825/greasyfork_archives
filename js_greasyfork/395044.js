// ==UserScript==
// @name         rakuten pr
// @namespace    https://greasyfork.org/morca
// @version      0.3
// @description  楽天市場の検索結果からPRを消す
// @author       morca
// @match        https://search.rakuten.co.jp/search/mall/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395044/rakuten%20pr.user.js
// @updateURL https://update.greasyfork.org/scripts/395044/rakuten%20pr.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("div.searchresultitem > div.title > h2 > span.-pr").each((i, e) => {
        $(e).parent().parent().parent().hide();
    });
    $("div.searchresultitem > div.content > div.title > h2 > span.-pr").each((i, e) => {
        $(e).parent().parent().parent().parent().hide();
    });
    $("div.searchresultitem[data-card-type='cpc']").each((i, e) => {
        $(e).hide();
    });
})();