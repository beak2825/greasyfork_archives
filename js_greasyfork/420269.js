// ==UserScript==
// @name Add a link to a screenshot of Trump's tweets on Twitter
// @namespace    http://punishedtrump.com
// @version      0.2
// @description Adds a link on Trump's suspended Twitter pages to a screenshot of the deleted tweet
// @author       chird
// @include      https://twitter.com/realDonaldTrump/status/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420269/Add%20a%20link%20to%20a%20screenshot%20of%20Trump%27s%20tweets%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/420269/Add%20a%20link%20to%20a%20screenshot%20of%20Trump%27s%20tweets%20on%20Twitter.meta.js
// ==/UserScript==

var url = window.location.href;
var id = url.replace(/(.*)\/(.*)/i,"$2"); // get the tweet ID

new MutationObserver(function(m) {
    document.querySelectorAll("a[href*='notices-on-twitter']").forEach(function (a) {
        a.parentNode.parentNode.innerHTML = "This Tweet is from a suspended account. <b><a href='https://punishedtrump.com/realDonaldTrump/status/"+id+"'>View the original tweet.</a></b>";
    });
}).observe(document, {childList: true, subtree: true});