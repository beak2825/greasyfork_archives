// ==UserScript==
// @name Redirect all Trump's pages on Twitter to a screenshot of the original tweet
// @version      0.1
// @namespace http://punishedtrump.com
// @description Entirely redirect all Trump's posts on Twitter to a screenshot of the original tweet. This is a more scorched earth version of my other script that simply adds a link on the page, but this one is more streamlined to use if you don't care about seeing the Twitter comments.
// @author       chird
// @include      https://twitter.com/realDonaldTrump/status/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/420270/Redirect%20all%20Trump%27s%20pages%20on%20Twitter%20to%20a%20screenshot%20of%20the%20original%20tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/420270/Redirect%20all%20Trump%27s%20pages%20on%20Twitter%20to%20a%20screenshot%20of%20the%20original%20tweet.meta.js
// ==/UserScript==
var url = window.location.href;
var new_url = url.replace(/twitter.com\/realDonaldTrump/i,"punishedtrump.com\/realDonaldTrump");
window.location.replace (new_url);