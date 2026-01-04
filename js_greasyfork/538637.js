// ==UserScript==
// @name         x.com to twitter.com
// @namespace    https://github.com/derpyymuffins
// @version      1.0
// @description  Brings back the twitter.com domain in the URL bar
// @license      MIT
// @author       derpyymuffins
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538637/xcom%20to%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/538637/xcom%20to%20twittercom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //  if (document.location.hostname === "x.com") {

const newUrl = document.location.href.replace("x.com", "twitter.com");

const [mainUrl, queryString] = newUrl.split("?");

const queryParams = new URLSearchParams(queryString);

queryParams.set("mx", "1");

document.location.href = `${mainUrl}?${queryParams.toString()}`;

})();