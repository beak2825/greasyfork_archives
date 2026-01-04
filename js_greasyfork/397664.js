// ==UserScript==
// @name:ja      アフィリエイト除去
// @name         Affiliate ID remover
// @namespace    https://greasyfork.org/morca
// @version      0.2
// @description:ja URLからアフィリエイトIDを除去する(Amazon, 楽天, Yahoo)
// @description  Removes affiliate IDs from URL (Amazon, Rakuten, Yahoo)
// @author       morca
// @match        https://www.amazon.co.jp/*
// @match        https://*.rakuten.co.jp/*
// @match        https://*shopping.yahoo.co.jp/*
// @match        https://*paypaymall.yahoo.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397664/Affiliate%20ID%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/397664/Affiliate%20ID%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sites = {
        "amazon": [/^tag=.+$/],
        "rakuten": [/^scid=.+$/, /^sc2id=.+$/],
        "yahoo": [/^sc_e=.+$/]
    };
    var href = (window.location != window.parent.location) ? document.referrer : document.location.href;
    const amazon = /^https:\/\/www\.amazon\.co\.jp\/[^?]+\?.*$/.test(href) === true;
    const rakuten = /^https:\/\/\w+\.rakuten\.co\.jp\/[^?]+\?.*$/.test(href) === true;
    const yahoo = /^https:\/\/.*shopping\.yahoo\.co\.jp\/[^?]+\?.*$/.test(href) === true || /^https:\/\/.*paypaymall\.yahoo\.co\.jp\/[^?]+\?.*$/.test(href);
    const site = sites[amazon ? "amazon" : rakuten ? "rakuten" : yahoo ? "yahoo" : null];
    if (site) {
        var base = href.replace(/^([^?]+)\?(.*)$/, "$1");
        var params = href.replace(/^([^?]+)\?(.*)$/, "$2");
        var params2 = params.split("&").filter(function(param) {
            for (var i = 0; i < site.length; i++) {
                if (site[i].test(param) === true) return false;
            }
            return true;
        }).join("&");
        if (params2 != params) {
            if (params2) base += "?"
            window.top.location.replace(base + params2);
        }
    }
})();