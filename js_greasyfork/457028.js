// ==UserScript==
// @name         remove ViewCount on Twitter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove viewcount
// @author       ichii731
// @match        https://*twitter.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457028/remove%20ViewCount%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/457028/remove%20ViewCount%20on%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tweet = () => {
        let tweets = document.querySelectorAll(".css-1dbjc4n.r-1ta3fxp.r-18u37iz.r-1wtj0ep.r-1s2bzr4.r-1mdbhws");
        for (let i = 0; i < tweets.length; i++) {
            if (tweets[i].childElementCount === 5) {
                tweets[i].removeChild(tweets[i].children[3]);
            }
        }
    }
    addEventListener("DOMSubtreeModified", tweet);

})();