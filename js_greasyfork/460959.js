// ==UserScript==
// @name         Hide retweets
// @name:ja      リツイート非表示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide tweets not belonging to currently shown user
// @description:ja 閲覧中のユーザがつぶやいていないツイートを非表示にする
// @author       syockit
// @license      MIT
// @match        https://twitter.com/*
// @exclude      https://twitter.com/*/status/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460959/Hide%20retweets.user.js
// @updateURL https://update.greasyfork.org/scripts/460959/Hide%20retweets.meta.js
// ==/UserScript==
'use strict';

function findArticleAncestor(el) {
    el = el.parentNode;
    while (el && el.tagName != "ARTICLE") {
        el = el.parentNode;
    }
    return el;
}

function removeRetweets() {
    [... document.getElementsByClassName("r-15zivkp")]
        .map(findArticleAncestor)
        .forEach(el => el && el.parentElement.removeChild(el));
}

(function() {
    document.body.addEventListener("DOMNodeInserted", removeRetweets, false);
})();