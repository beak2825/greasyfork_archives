// ==UserScript==
// @name           Twitter Meta and Ad Buster
// @include        *://*twitter.com/*
// @include        *://www.twitter.com/*
// @include        http*://www.twitter.com/*
// @namespace      https://www.twitter.com
// @description    Remove tweets talking about tweets
// @version        1.1
// @run-at document-idle
// @grant unsafeWindow
// 0.9 Nuke sumall.com spam
// 1.0 Remove elements with Class promoted-tweet
// 1.1 Add all Twitters events for timeline mods
// @downloadURL https://update.greasyfork.org/scripts/399749/Twitter%20Meta%20and%20Ad%20Buster.user.js
// @updateURL https://update.greasyfork.org/scripts/399749/Twitter%20Meta%20and%20Ad%20Buster.meta.js
// ==/UserScript==

function remove_meta_tweets() {
    var anchors = document.getElementsByTagName('a');
    for(var i=0; i<anchors.length; i++){
        var raw_url = anchors[i].getAttribute('data-expanded-url');
        if(raw_url && raw_url.match(/https:\/\/sumall.com\/(.*)/)) {
            var parent_p = anchors[i].parentNode;
            var tweet_text_container = parent_p.parentNode;
            var stream_item_header = tweet_text_container.parentNode;
            var content = stream_item_header.parentNode;
            while (content.firstChild) content.removeChild(content.firstChild); // die die die die die
            content.parentNode.removeChild(content);
        }
    }
}

function remove_promoted_tweets() {
    var tweet_divs = document.getElementsByClassName('promoted-tweet');
    for(var i=0; i<tweet_divs.length; i++){
        var tweet_li = tweet_divs[i].parentNode;
        while (tweet_li.firstChild) tweet_li.removeChild(tweet_li.firstChild); // die die die die die
        tweet_li.parentNode.removeChild(tweet_li);
    }
}

function tidy() {
    remove_meta_tweets();
    remove_promoted_tweets();
}

tidy();
setTimeout(tidy, 3000);

(function () {
    var events = [
        "scroll", "click", "uiHasInjectedNewTimeline", "uiHasInjectedOldTimelineItems",
        "uiHasInjectedRangeTimelineItems", "uiHasInjectedNewTimelineItems", "uiOverlayPageChanged",
        "uiPermalinkThreadExpanded", "uiExpandedConversationRendered", "uiTweetInserted", "uiPageChanged",
        "uiShowRelatedVideoTweets", "uiLoadDynamicContent", "uiDMConversationUpdated"
    ];
    for(var i=0; i<events.length; i++) {
        window.addEventListener(event[i], () => {
            tidy();
            setTimeout(tidy, 3000);
        });
    }
})();