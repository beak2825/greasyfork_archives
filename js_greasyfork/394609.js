// ==UserScript==
// @name         Nextdoor.com - Hide annoying content in the News Feed
// @namespace    Lepricon
// @version      0.6.0
// @description  This is a content filter that will hide annoying content in the Nextdoor News Feed and add an instant "Hide" button to all posts that are shown. Customize with enable-flags and title phrases. It seems like about 99% of the content on Nextdoor is garbage but that 1% of useful posts are worth digging through all the junk. This script helps improve the ratio of gold to garbage.
// @author       Lepricon
// @match        https://nextdoor.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/394609/Nextdoorcom%20-%20Hide%20annoying%20content%20in%20the%20News%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/394609/Nextdoorcom%20-%20Hide%20annoying%20content%20in%20the%20News%20Feed.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const getValue = (settingName, defaultValue) => {
        let value = undefined;
        if (window.GM_getValue) {
            value = GM_getValue(settingName);
        }

        if (value === undefined) {
            value = defaultValue;

            if (window.GM_setValue) {
                GM_setValue(settingName, value);
            }
        }

        return value;
    }

    // --- Configurations start (Edit values in the "Storage" tab to prevent updates from overwriting your custom settings)
    const enableHidePaidAds = getValue("enableHidePaidAds", true);
    const enableHidePromos = getValue("enableHidePromos", true);
    const enableHideSponsoredAds = getValue("enableHideSponsoredAds", true);
    const enableHideNewNeighborAnnouncements = getValue("enableHideNewNeighborAnnouncements", true);
    const enableHideNonFreeClassifiedAds = getValue("enableHideNonFreeClassifiedAds", true);
    const enableAddHideLinkToPosts = getValue("enableAddHideLinkToPosts", true);

    // The following setting will hide any posts that have a matching tag set. Must be all lower-case.
    const hideTaggedInterestNames = getValue("hideTaggedInterestNames", ["dogs", "cats", "yoga", "animal adoption"]);

    // The following setting will hide any posts that have titles that contain any of these key phrases. Use array for multiple words in any order. Must be all lower-case.
    const hideKeyPhrases = getValue("hideKeyPhrases", [["dog", "lost"], ["dog", "missing"], ["dog", "found"], ["dog", "loose"], ["dog", "walk"], ["cat", "lost"], ["cat", "missing"], ["cat", "found"], "coyote", "handyman", "plumber", "roommate", "electrician"]);

    // The following setting will hide any posts with any of these author names. Name match exactly, including case. Useful for those sneaky "pay to read" news sites like San Diego Union-Tribune that otherwise look like legitimate posts.
    const hideAuthorsNames = getValue("hideAuthorsNames", ["The San Diego Union-Tribune"]);

    // Set the following setting true to send a request to the nextdoor server to hide posts permanently. Only applies to key phrases, authors, and individual "new neighbor announcements".
    const enablePermanentHide = getValue("enablePermanentHide", false);
    // --- Configurations end

    const handleMutedPost = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const qsPost = urlParams.get("post");
        if (qsPost) {
            var isUnmuteButton = false;
            setInterval(() => {
                if (isUnmuteButton) {
                    return;
                }

                const $ = unsafeWindow.$ || unsafeWindow.jQuery || window.$ || window.jQuery;
                // <div class="missing-post-caption">Sorry, the post you're looking for has been removed.</div>
                var missingPost = $("div.missing-post-caption");
                if (missingPost.length === 1) {
                    const parent = missingPost.parent();
                    let button = parent.find("button");
                    if (button.length == 0) {
                        const node = document.createElement("button");
                        parent[0].appendChild(node);
                        button = $(node);
                        button.addClass("css-uuczrf");
                    }
                    button.click(() => {
                        try {
                            mutePost(qsPost, false);
                            //unsafeWindow.jQuery.post("/ajax/confirm_unmute_post/", `post_id=${qsPost}`); // tell the server to hide this post
                            setTimeout(() => {
                                location.reload();
                            }, 500);
                        }
                        catch (error) {
                            console.log(`Unmute failed for post_id=${qsPost} failed.`)
                        }

                        return false;
                    });
                    button.text("Unhide Post");
                    isUnmuteButton = true;
                }
            }, 200);
        }
    }

    const shouldHideClassifiedItem = (postItem) => {
        if (enableHideNonFreeClassifiedAds) {
            // Single classified item
            if (postItem.classified && (postItem.classified.price || "").toLowerCase() !== "free") {
                return true;
            }

            // Multiple classified items
            if (postItem.rollupItems) {
                const freeItems = postItem.rollupItems.filter((classifiedItem) => {
                    if (classifiedItem.bottomContent && classifiedItem.bottomContent.text && classifiedItem.bottomContent.text.text ) {
                        return classifiedItem.bottomContent.text.text.includes("Free •");
                    }

                    if (classifiedItem.classified && classifiedItem.classified.price) {
                        return classifiedItem.classified.price.toUpperCase() === "FREE" || classifiedItem.classified.price === "0" || classifiedItem.classified.price === "";
                    }

                    return true;
                });
                if (freeItems.length === 0) { // count of free items
                    return true;
                }
                else if (freeItems.length !== postItem.rollupItems.length) {
                    // only keep the free items
                    postItem.rollupItems = freeItems;
                    return 0;
                }
            }
        }

        return false;
    }

    const shouldHideFeedItem = (feedItem) => {
        if (feedItem.feedItemType === "PROMO") {
            return enableHidePaidAds;
        }

        if (enableHideNewNeighborAnnouncements) {
            // Multiple people
            if (feedItem.feedItemType === "NEW_MEMBER_ANNOUNCEMENT_ROLLUP"
                || (feedItem.feedItemType === "POST" && feedItem.post && feedItem.post.postType === "NEW_MEMBER_ANNOUNCEMENT_ROLLUP")
                || (feedItem.feedItemType === "ROLLUP" && (feedItem.rollupContentType === "NEW_MEMBER_ANNOUNCEMENT_ROLLUP" || feedItem.rollupContentType === "NEW_MEMBER_ANNOUNCEMENT_ROLLUP_2"))) {
                return true;
            }

            // Single person
            if (feedItem.feedItemType === "NEW_MEMBER_ANNOUNCEMENT"
               || (feedItem.feedItemType === "POST" && feedItem.post && feedItem.post.postType === "NEW_MEMBER_ANNOUNCEMENT")) {
                return true;
            }
        }

        if (hideAuthorsNames && hideAuthorsNames.length > 0) {
            if (feedItem.feedItemType === "POST") {
                if (feedItem.post.author && feedItem.post.author.displayName) {
                    if (hideAuthorsNames.includes(feedItem.post.author.displayName)) {
                        return true;
                    }
                }
            }
        }

        if (hideTaggedInterestNames && hideTaggedInterestNames.length > 0) {
            if (feedItem.feedItemType === "POST") {
                if (feedItem.post.taggedInterest && feedItem.post.taggedInterest.name) {
                    if (hideTaggedInterestNames.includes(feedItem.post.taggedInterest.name.toLowerCase())) {
                        return true;
                    }
                }
            }
        }

        if (hideKeyPhrases && hideKeyPhrases.length > 0) {
            if (feedItem.feedItemType === "POST") {
                if (feedItem.post.subject) {
                    const subject = feedItem.post.subject.toLowerCase();
                    const keyPhraseStrings = hideKeyPhrases.filter((keyPhrase) => typeof keyPhrase === "string");
                    if (keyPhraseStrings.find((keyPhraseString) => subject.includes(keyPhraseString))) {
                        return true;
                    }

                    const keyPhraseArrays = hideKeyPhrases.filter((keyPhrase) => Array.isArray(keyPhrase));
                    if (keyPhraseArrays.find((keyPhraseArray) => keyPhraseArray.filter((keyPhrase) => subject.includes(keyPhrase)).length === keyPhraseArray.length)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    handleMutedPost();

    // create XMLHttpRequest proxy object
    var oldXMLHttpRequest = unsafeWindow.XMLHttpRequest;

    // define constructor for an proxy object to intercept all AJAX traffic for this site so we can filter it
    unsafeWindow.XMLHttpRequest = function() {
        var actual = new oldXMLHttpRequest();
        var self = this;

        this.onreadystatechange = null;

        // this is the actual handler on the real XMLHttpRequest object
        actual.onreadystatechange = function() {
            if (this.readyState == 4) {
                // Intercept the responses
                // actual.responseText is the ajax result

                // Only apply to the actual news_feed. Email article links contain the base news_feed URL so we do not want to block those.
                const isTargetPage = unsafeWindow.location.href === "https://nextdoor.com/news_feed/"
                        || unsafeWindow.location.href === "https://nextdoor.com/news_feed/?"
                        || unsafeWindow.location.href.includes("nextdoor.com/news_feed/?ordering=");

                if (!actual.responseText) {
                    self.responseText = actual.responseText;
                }
                else {
                    try {
                        let changes = 0;
                        let responseJson;

                        if (isTargetPage) {
                            responseJson = JSON.parse(actual.responseText);

                            if (responseJson.data && responseJson.data.me && responseJson.data.me.personalizedFeed && responseJson.data.me.personalizedFeed.feedItems && responseJson.data.me.personalizedFeed.feedItems.length > 0) {
                                for (let i = responseJson.data.me.personalizedFeed.feedItems.length - 1; i >= 0; i--) {
                                    const feedItem = responseJson.data.me.personalizedFeed.feedItems[i];
                                    if (feedItem.feedItemType === "CLASSIFIED" || feedItem.feedItemType === "CLASSIFIED_ROLLUP" || (feedItem.feedItemType === "ROLLUP" && feedItem.rollupContentType.includes("CLASSIFIED"))) {
                                        const shouldHideClassifiedItemResult = shouldHideClassifiedItem(feedItem);
                                        if (shouldHideClassifiedItemResult === 0) {
                                            changes++; // removed some paid items but left free items
                                        }
                                        else if (shouldHideClassifiedItemResult === true) {
                                            responseJson.data.me.personalizedFeed.feedItems.splice(i, 1);
                                            changes++;
                                            if (enablePermanentHide) {
                                                if (feedItem.classified && feedItem.classified.id) {
                                                    const postId = feedItem.classified.id.replace("classified_", "");
                                                    setTimeout(() => {
                                                        try {
                                                            unsafeWindow.jQuery.post(`/api/classifieds/${postId}/hide`); // tell the server to hide this post
                                                        }
                                                        catch (error) {
                                                            console.log(`Post to /api/classifieds/${postId}/hide failed.`)
                                                        }
                                                    }, 250);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        const $ = unsafeWindow.$ || unsafeWindow.jQuery || window.$ || window.jQuery;

                                        if (feedItem && shouldHideFeedItem(feedItem)) {
                                            responseJson.data.me.personalizedFeed.feedItems.splice(i, 1);
                                            changes++;
                                            if (enablePermanentHide) {
                                                if (feedItem.rollupItems) {
                                                    for (let j = 0; j < feedItem.rollupItems.length; j++) {
                                                        const rollupItemPost = feedItem.rollupItems[j].post;
                                                        if (!rollupItemPost) {
                                                            continue;
                                                        }

                                                        const postId = rollupItemPost.id.replace("post_", "");
                                                        if (!postId) {
                                                            continue;
                                                        }
                                                        setTimeout(() => {
                                                            mutePost(postId);
                                                        }, 250);
                                                    }
                                                }
                                                else if (feedItem.post && feedItem.post.id) {
                                                    const postId = feedItem.post.id.replace("post_", "");
                                                    setTimeout(() => {
                                                        mutePost(postId);
                                                    }, 250);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (changes > 0) {
                            self.responseText = JSON.stringify(responseJson);
                        }
                        else {
                            self.responseText = actual.responseText;
                        }

                        setTimeout(() => {
                            if (enableAddHideLinkToPosts) {
                                addHideLinkToPosts();
                            }
                            // Do some imperceptible micro scrolling to load more data. Nextdoor looks for scrolling to determine if it should try to load more data. Will only load if the "Load More" area is visible at the bottom of the posts.
                            unsafeWindow.scrollBy(0, 1);
                            unsafeWindow.scrollBy(0, -1);
                        }, 100);
                    }
                    catch (error) {
                        self.responseText = actual.responseText; // Let the actual response pass through
                    }
                }
            }
            if (self.onreadystatechange) {
                return self.onreadystatechange();
            }
        };

        // add all proxy getters
        ["status", "statusText", "responseType", "response",
         "readyState", "responseXML", "upload"].forEach(function(item) {
            Object.defineProperty(self, item, {
                get: function() {return actual[item];}
            });
        });

        // add all proxy getters/setters
        ["ontimeout, timeout", "withCredentials", "onload", "onerror", "onprogress"].forEach(function(item) {
            Object.defineProperty(self, item, {
                get: function() {return actual[item];},
                set: function(val) {actual[item] = val;}
            });
        });

        // add all pure proxy pass-through methods
        ["addEventListener", "send", "open", "abort", "getAllResponseHeaders",
         "getResponseHeader", "overrideMimeType", "setRequestHeader"].forEach(function(item) {
            Object.defineProperty(self, item, {
                value: function() {return actual[item].apply(actual, arguments);}
            });
        });
    }

    let oldXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        // do something with the method, url and etc.
        this.addEventListener('load', function() {
            // do something with the response text
            this.responseText = "";
            console.log('load: ' + this.responseText);
        });

        return oldXHROpen.apply(this, arguments);
    }

    const mutePost = (postId, mute) => {
        mute = (mute === undefined) ? true : mute;
        const $ = unsafeWindow.$ || unsafeWindow.jQuery || window.$ || window.jQuery;
        const csrftoken = window.Cookies.get("csrftoken");

        $.ajaxSetup({
            headers: {
                "Content-Type": "application/json",
                "X-CSRFTOKEN": csrftoken
            }
        });

        try {
            $.post("/api/gql/mutePost?", `{"operationName":"mutePost","variables":{"timeZone":"America/Los_Angeles","pagedCommentsMode":"FEED","input":{"postId":"post_${postId}","mute":${mute ? "true" : "false"}}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"03b767ce608c1eaaa4eaba114dae42693aab6133afd6d8148a8ebeb56f4e3399"}}}`); // tell the server to hide this post
        }
        catch (error) {
            console.log(`Post to /api/gql/mutePost? for post_id=${postId} failed.`)
        }
    }

    const addHideLinkToPosts = () => {
        const $ = unsafeWindow.$ || unsafeWindow.jQuery || window.$ || window.jQuery;

        const allPosts = $("div.js-media-post, div.classifieds-single-item-content");
        allPosts.each((index, el) => {
            const post = $(el).parent();
            const existingHideLink = post.find("a.addon-hide-link");
            if (existingHideLink.length > 0) {
                return; // The ide link already exists
            }

            // Add a "Hide" link since it does not already exist
            const caretMenu = post.find("div.dropdown").first();
            const hideLink = $('<span><a class="addon-hide-link" href="javascript:void(0)">Hide</a> &nbsp; </span>');
            hideLink.click(() => {
                if (post.hasClass("classifieds-single-item-content")) {
                    const postId = post.parent().attr("id").substring(2);
                    $.post(`/api/classifieds/${postId}/hide`); // tell the server to hide this post
                }
                else {
                    const postId = $(post.find(".dropdown")[0]).attr("id").split("_")[2];
                    mutePost(postId);
                }

                post.remove(); // hide the post now
            });
            hideLink.insertBefore(caretMenu);
        });
    }

    // CSS styles to hide ads
    let styleTag = " div.feed-container { min-height: 2000px !important; } ";
    if (enableHidePaidAds) {
        styleTag += " article.gam-ad-outer-container { display: none !important; } ";
    }

    if (enableHideSponsoredAds) {
        styleTag += " div.ad-wrapper, div.programmatic-promo-container { display: none !important; } ";
    }

    if (enableHidePromos) {
        styleTag += " div.app-promo-banner-content, div.app-promo-banner-icon, div.app-promo-banner-icon-notification, div.app-promo-banner-text-header, div.app-promo-banner-text-teaser, div.app-promo-icon-container, div.app-promo-text-container, div.app-promo-banner-dismissed, div.app-promo-overlay, div.app-promo-banner-container, div.app-promo-banner-cta-container { display: none !important; } ";
    }

    if (styleTag) {
        styleTag = `<style>${styleTag}</style>`;
        const head = document.querySelector("head").innerHTML += styleTag;
    }
})();
