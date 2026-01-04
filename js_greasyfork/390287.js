// ==UserScript==
// @name         bilibili watchlist redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili watchlist h5 player redirect
// @author       You
// @include      https://www.bilibili.com/watchlater/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390287/bilibili%20watchlist%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/390287/bilibili%20watchlist%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    if (url != "https://www.bilibili.com/watchlater/#/list") {
        url = url.replace(/watchlater\/#\//,"");
    }
    window.location.href = url;
})();