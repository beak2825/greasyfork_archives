// ==UserScript==
// @name         神崎おにいさん(小並感)
// @namespace    https://rinsuki.net/
// @version      0.1.1
// @description  神崎おにいさんの投稿の最後に(小並感)を付けます
// @author       rinsuki
// @match        https://knzk.me/web/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368191/%E7%A5%9E%E5%B4%8E%E3%81%8A%E3%81%AB%E3%81%84%E3%81%95%E3%82%93%28%E5%B0%8F%E4%B8%A6%E6%84%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/368191/%E7%A5%9E%E5%B4%8E%E3%81%8A%E3%81%AB%E3%81%84%E3%81%95%E3%82%93%28%E5%B0%8F%E4%B8%A6%E6%84%9F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var originalResponseJson = Response.prototype.json;
    var originalJsonParse = JSON.parse;
    var targetUsers = [
        "knzk"
    ].map(function (s) { return s.toLowerCase(); });
    function process(r) {
        if (Array.isArray(r)) {
            return r.map(process);
        }
        if (r && typeof r == "object") {
            if (r.account && r.content) {
                if (~targetUsers.indexOf(r.account.acct.toLowerCase())) {
                    console.log("isknzk");
                    r.content = r.content.replace(/<\/p>$/, "&nbsp;(小並感)</p>");
                }
            }
            Object.keys(r).forEach(function (key) {
                if (Array.isArray(r[key]) || typeof r[key] == "object")
                    r[key] = process(r[key]);
            });
        }
        return r;
    }
    Response.prototype.json = function () {
        var res = originalResponseJson.bind(this);
        return res.then(process);
    };
    JSON.parse = function (src, reviver) {
        var res = originalJsonParse(src, reviver);
        return process(res);
    };

})();