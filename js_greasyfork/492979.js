// ==UserScript==
// @name         Block-Retweet
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Block Retweet
// @author       dsx137
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/492979/Block-Retweet.user.js
// @updateURL https://update.greasyfork.org/scripts/492979/Block-Retweet.meta.js
// ==/UserScript==

function deleteRetweet() {
    var articles = document.querySelectorAll("article");
    for (article of articles) {
        if (article.children[0].children[0].children[0].querySelectorAll("[dir]").length != 0) {
            article.parentNode.parentNode.remove();
        }
    }
}


(function () {
    'use strict';
    new MutationObserver(function (mutations) {
        deleteRetweet();
    }).observe(document.body, { childList: true, subtree: true });
})();
