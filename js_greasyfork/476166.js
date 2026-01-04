// ==UserScript==
// @name         refetch-article-content
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  news.bg will block your content under certain conditions. This script will re-fetch the article and insert it back in the dom.
// @author       You
// @match        https://news.bg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476166/refetch-article-content.user.js
// @updateURL https://update.greasyfork.org/scripts/476166/refetch-article-content.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    setTimeout(async () => {
        var result = await fetch(window.location.href)

        var parser = new DOMParser();

        var doc = parser.parseFromString(await result.text(), "text/html");

        var oldText = doc.getElementsByClassName('article-text');

        console.log('DOC', oldText);

        jQuery(".article-text").html(oldText[0]);
    }, 500);
})();