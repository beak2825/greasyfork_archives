// ==UserScript==
// @name         Clean Twitter Feed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove "promoted" posts
// @author       Sylvain Galibert
// @match       *://twitter.com/*
// @match       *://*.twitter.com/*
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455879/Clean%20Twitter%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/455879/Clean%20Twitter%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Every second, check if there is an article (each post on Twitter is in an article element) which contains the text "Promoted" and hides it.
    // This gets rid of all the fake posts.
    // The interval is needed because Twitter constantly load new articles.
    var i = setInterval(function(){
            const articles = document.querySelectorAll("article");
            for (const article of articles){
                const articleContent = article.innerHTML;
                // This works fine, but it's brittle - TODO: identify better the "Promoted" posts to avoid catching posts which merely contain the word "Promoted".
                // note: search takes a regex expression and is case sensitive by default.
                if (articleContent.search("Promoted") !== -1){
                    article.style.display = "none";
                }
            }

    }, 1000);

})();