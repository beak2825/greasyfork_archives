// ==UserScript==
// @name         Reddit Promotion Blocker
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  Blocks all of the promoted advertisements on Reddit.
// @author       Aiden Charles
// @match        http://reddit.com/*
// @match        https://reddit.com/*
// @match        http://www.reddit.com/*
// @match        https://www.reddit.com/*
// @match        http://old.reddit.com/*
// @match        https://old.reddit.com/*
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405756/Reddit%20Promotion%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/405756/Reddit%20Promotion%20Blocker.meta.js
// ==/UserScript==

(function() {
    console.log("Reddit promotion blocker script is running!");

    var observer = new MutationObserver(function() {
        if (window.location.hostname == "old.reddit.com") {
            $("span:contains('promoted')").parent().parent().parent().parent().parent().hide();
            $("div").find(".ad-container").parent().hide();
            $("span").find(".promoted-tag").parent().parent().hide();
        }
        else {
            $("shreddit-ad-post").hide();
            $("shreddit-comments-page-ad").hide();
            $("shreddit-comment-tree-ad").hide();
            $("shreddit-async-loader[bundlename='sidebar_ad']").hide();
            $("shreddit-async-loader[bundlename='feed_announcement']").hide();
            $("div[data-before-content='advertisement']").parent().parent().parent().hide();
            $("div").find(".adsense-ad").parent().parent().hide();
            $("span").find(".promoted-tag").parent().parent().hide();
            $("div").find(".promotedlink").hide();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();