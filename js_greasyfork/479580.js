// ==UserScript==
// @name         Twitter auto expand show more text + filter tweets + remove short urls
// @namespace    zezombye.dev
// @version      0.11
// @description  Automatically expand the "show more text" section of tweets when they have more than 280 characters. While we're at it, replace short urls by their actual link, and add a way to filter those annoying repetitive tweets.
// @author       Zezombye
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/grapheme-splitter@1.0.4/index.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479580/Twitter%20auto%20expand%20show%20more%20text%20%2B%20filter%20tweets%20%2B%20remove%20short%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/479580/Twitter%20auto%20expand%20show%20more%20text%20%2B%20filter%20tweets%20%2B%20remove%20short%20urls.meta.js
// ==/UserScript==


(function() {
    'use strict';

//################# START OF CONFIG #################

    //Define your filters here. If the text of the tweet contains any of these strings, the tweet will be removed from the timeline
    const forbiddenText = [
        "https://rumble.com/",
        "topg.com",
        "clownworldstore.com",
        "dngcomics",
        "tatepledge.com",
        "tate confidential ep ",
        "skool.com/monetize",
        "http://tinyurl.com/48ntfwhh",
        "tinyurl.com/334jes22",
        "greatonlinegame.com",
        "thedankoe.com",
        "getairchat.com",
        "theartoffocusbook.com",
    ].map(x => x.toLowerCase());

    //Same but for regex
    const forbiddenTextRegex = [
        /^follow @\w+ for more hilarious commentaries$/i,
        /^GM\.?$/,
        /You can make money, TODAY.+\s+Begin now: .+university\.com/i,
        /\b(israel|palestine|israeli|palestinian)\b/i,
        /(^|\W)\$\w+\b/, //cashtags - good for removing crypto shit
    ];

    const removeTextAtStart = /^([\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}\p{Format}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}\uFE0F\u20E3\s]|breaking|flash|alerte info|[:|-])+/iu;

    //Remove the pinned tweets of these accounts
    const accountsWithNoPinnedTweets = [
        "clownworld_",
    ].map(x => x.toLowerCase());

    //Remove the tweets of these accounts that only contain images
    const accountsWithNoImages = [
        "HumansNoContext",
    ].map(x => x.toLowerCase());

    //Remove the tweets of these accounts that do not contain a photo/video (only text)
    const accountsWithRequiredMedia = [
        "NoContextHumans",
    ].map(x => x.toLowerCase());

    //Remove threads starting by these tweet ids
    const forbiddenThreadIds = [
        "1681712437085478912", //tate jamaican music
        "1710941438526017858", //tatepledge
        "1709651947354026010", //tate trw promo quotes
        "1753107137444888972", //tate university.com promo quotes
        "1738538369557090317", //tate avoiding speaking to famous people
    ]

    const removeTweetsWithOnlyEmojis = true //will not remove tweets with extra info such as quote tweet or media
    const removeTweetsWithOnlyMentions = true //same
    const hashtagLimit = 15 // remove tweets with more than this amount of hashtags

//################# END OF CONFIG #################

    var splitter = new GraphemeSplitter();
    window.splitter = splitter;

    function shouldRemoveTweet(tweet) {

        if (!tweet || !tweet.legacy) {
            //Tweet husk (when a quote tweet quotes another tweet, for example)
            return false;
        }

        //console.log(tweet);

        if (forbiddenThreadIds.includes(tweet.legacy.conversation_id_str)) {
            return true;
        }


        if (tweet.legacy.retweeted_status_result) {
            //Remove duplicate tweets from those annoying accounts that retweet their own tweets. (I know, it's for the algo...)
            //A good account to test with is https://twitter.com/ClownWorld_
            if (tweet.core.user_results.result.legacy.screen_name === tweet.legacy.retweeted_status_result.result.core.user_results.result.legacy.screen_name
                && new Date(tweet.legacy.created_at) - new Date(tweet.legacy.retweeted_status_result.result.legacy.created_at) < 10 * 24 * 60 * 60 * 1000 //10 days
            ) {
                return true;
            }


            return shouldRemoveTweet(tweet.legacy.retweeted_status_result.result);
        }

        if (tweet.quoted_status_result && shouldRemoveTweet(tweet.quoted_status_result.result)) {
            return true;
        }

        var user = tweet.core.user_results.result.legacy.screen_name.toLowerCase();
        var text, entities;
        if (tweet.note_tweet) {
            text = tweet.note_tweet.note_tweet_results.result.text;
            entities = tweet.note_tweet.note_tweet_results.result.entity_set;
        } else {
            text = splitter.splitGraphemes(tweet.legacy.full_text).slice(tweet.legacy.display_text_range[0], tweet.legacy.display_text_range[1]).join("");
            entities = tweet.legacy.entities;
        }

        //Replace shorthand urls by their real links
        //Go in descending order to not fuck up the indices by earlier replacements
        var urls = entities.urls.sort((a,b) => b.indices[0] - a.indices[0])
        for (var url of urls) {
            text = text.substring(0, url.indices[0]) + url.expanded_url + text.substring(url.indices[1])
        }

        //console.log("Testing if we should remove tweet by '"+user+"' with text: \n"+text);

        if (removeTweetsWithOnlyEmojis && text.match(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}\p{Format}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}\uFE0F\u20E3\s\p{P}]+$/u) && !tweet.quoted_status_result && !tweet.legacy.entities.media) {
            return true;
        }
        if (removeTweetsWithOnlyMentions && text.match(/^@\w+$/u) && !tweet.quoted_status_result && !tweet.legacy.entities.media) {
            return true;
        }

        if (tweet.legacy.entities.hashtags.length > hashtagLimit) {
            return true;
        }

        if (forbiddenText.some(x => text.toLowerCase().includes(x))) {
            //console.log("Removed tweet");
            return true;
        }
        if (forbiddenTextRegex.some(x => text.match(x))) {
            //console.log("Removed tweet");
            return true;
        }

        if (accountsWithNoImages.includes(user) && tweet.legacy.entities.media && tweet.legacy.entities.media.every(x => x.expanded_url.includes("/photo/"))) {
            return true;
        }
        if (accountsWithRequiredMedia.includes(user) && !tweet.legacy.entities.media) {
            return true;
        }

        return false;
    }

    function fixUser(user, isGraphql) {
        if (user.__typename !== "User" && isGraphql) {
            console.error("Unhandled user typename '"+user.__typename+"'");
            return;
        }

        var userEntities;
        if (isGraphql) {
            if (!user?.legacy?.entities) {
                return;
            }
            userEntities = user.legacy.entities;
        } else {
            userEntities = user.entities;
        }

        //Edit user descriptions to remove the shortlinks
        if (userEntities.description) {
            for (let url of userEntities.description.urls) {
                if (url.expanded_url) {
                    url.url = url.expanded_url;
                    url.display_url = url.expanded_url.replace(/^https?:\/\/(www\.)?/, "");
                }
            }
        }
        if (userEntities.url) {
            for (let url of userEntities.url.urls) {
                if (url.expanded_url) {
                    url.url = url.expanded_url;
                    url.display_url = url.expanded_url.replace(/^https?:\/\/(www\.)?/, "");
                }
            }
        }
    }

    function fixTweet(tweet) {

        if (!tweet) {
            return;
        }

        if (tweet.__typename === "TweetWithVisibilityResults") {
            if (tweet.tweetInterstitial && tweet.tweetInterstitial.text.text === "This Post violated the X Rules. However, X has determined that it may be in the public’s interest for the Post to remain accessible. Learn more") {
                delete tweet.tweetInterstitial;
            }
            tweet = tweet.tweet;
        }

        if (tweet.__typename !== "Tweet" && tweet.__typename) {
            console.error("Unhandled tweet typename '"+tweet.__typename+"'");
            return;
        }

        if (!tweet.legacy) {
            //Tweet husk (when a quote tweet quotes another tweet, for example)
            return;
        }

        //console.log("Fixing tweet:", tweet);


        fixUser(tweet.core.user_results.result, true);


        if (tweet.birdwatch_pivot) {
            //It's pretty neat that you can just delete properties and the markup instantly adapts, ngl
            delete tweet.birdwatch_pivot.callToAction;
            delete tweet.birdwatch_pivot.footer;
            tweet.birdwatch_pivot.title = tweet.birdwatch_pivot.shorttitle;
            //Unfortunately, the full URLs of community notes aren't in the tweet itself. It's another API call
        }

        if (tweet.hasOwnProperty("note_tweet")) {
            //Thank God for this property or this would simply be impossible.
            //For some reason the full text of the tweet is stored here. So put it in where the webapp is fetching the tweet text
            //Also put the entities with their indices
            tweet.legacy.full_text = tweet.note_tweet.note_tweet_results.result.text;
            tweet.legacy.display_text_range = [0, 9999999];
            if ("media" in tweet.legacy.entities) {
                for (var media of tweet.legacy.entities.media) {
                    if (media.display_url.startsWith("pic.twitter.com/")) {
                        media.indices = [1000000, 1000001];
                    }
                }
            }
            for (let key of ["user_mentions", "urls", "hashtags", "media", "symbols"]) {
                if (tweet.note_tweet.note_tweet_results.result.entity_set[key]) {
                    tweet.legacy.entities[key] = tweet.note_tweet.note_tweet_results.result.entity_set[key];
                }
            }
        }

        //Good account to test that on: https://twitter.com/AlertesInfos
        let displayedTweetText = splitter.splitGraphemes(tweet.legacy.full_text).slice(tweet.legacy.display_text_range[0], tweet.legacy.display_text_range[1]).join("")
        let oldLength = splitter.countGraphemes(displayedTweetText)
        let oldLengthMedia = [...displayedTweetText].length //media indices are apparently based on this length?
        let oldLengthRichText = displayedTweetText.length //apparently rich text indices are based on js calculated length, which counts emojis as 2 chars
        //console.log("oldlength", oldLength, "oldLengthRichText", oldLengthRichText)
        displayedTweetText = displayedTweetText.replace(removeTextAtStart, "")
        let lengthDifference = oldLength - splitter.countGraphemes(displayedTweetText)
        let lengthDifferenceMedia = oldLengthMedia - [...displayedTweetText].length
        let lengthDifferenceRichText = oldLengthRichText - displayedTweetText.length
        //console.log(lengthDifference, lengthDifferenceRichText)
        tweet.legacy.full_text = splitter.splitGraphemes(tweet.legacy.full_text).slice(0, tweet.legacy.display_text_range[0]).join("")+displayedTweetText+splitter.splitGraphemes(tweet.legacy.full_text).slice(tweet.legacy.display_text_range[1]).join("")
        tweet.legacy.display_text_range[1] -= lengthDifference

        for (let key of ["user_mentions", "urls", "hashtags", "media", "symbols"]) {
            if (tweet.legacy.entities[key]) {
                for (let entity of tweet.legacy.entities[key]) {
                    entity.indices[0] -= lengthDifferenceMedia
                    entity.indices[1] -= lengthDifferenceMedia
                }
            }
            if (tweet.legacy.extended_entities && tweet.legacy.extended_entities[key]) {
                for (let entity of tweet.legacy.extended_entities[key]) {
                    entity.indices[0] -= lengthDifferenceMedia
                    entity.indices[1] -= lengthDifferenceMedia
                }
            }
        }

        if (tweet.hasOwnProperty("note_tweet")) {
            //Tweets with more than 250 chars are displayed using the note tweet, so put back the modified full text to the note tweet property
            //https://twitter.com/MarioNawfal/status/1733973012050022523
            tweet.note_tweet.note_tweet_results.result.text = tweet.legacy.full_text;
            for (let key of ["user_mentions", "urls", "hashtags", "media", "symbols"]) {
                if (tweet.legacy.entities[key]) {
                    tweet.note_tweet.note_tweet_results.result.entity_set[key] = tweet.legacy.entities[key];
                }
            }
            if (tweet.note_tweet.note_tweet_results.result.richtext) {
                for (let richTextObject of tweet.note_tweet.note_tweet_results.result.richtext.richtext_tags) {
                    richTextObject.from_index -= lengthDifferenceRichText
                    richTextObject.to_index -= lengthDifferenceRichText
                }
            }
        }


        //Remove shortlinks for urls
        for (let url of tweet.legacy.entities.urls) {
            if (url.expanded_url) {
                url.display_url = url.expanded_url.replace(/^https?:\/\/(www\.)?/, "");
                url.url = url.expanded_url;
            }
        }

        if (tweet.legacy.quoted_status_permalink) {
            tweet.legacy.quoted_status_permalink.display = tweet.legacy.quoted_status_permalink.expanded.replace(/^https?:\/\//, "")
        }

        if (tweet.quoted_status_result) {
            fixTweet(tweet.quoted_status_result.result);
        }

        if (tweet.legacy.retweeted_status_result) {
            fixTweet(tweet.legacy.retweeted_status_result.result);
        }
    }

    function patchApiResult(apiPath, data) {

        if (apiPath === "UserByScreenName" || apiPath === "UserByRestId") {
            if (data.data.user) {
                fixUser(data.data.user.result, true);
            }
            return data;
        }
        if (apiPath === "recommendations.json") {
            for (var user of data) {
                fixUser(user.user, false);
            }
            return data;
        }

        var timeline;
        if (apiPath === "TweetDetail") {
            //When viewing a tweet directly.
            //https://twitter.com/atensnut/status/1723692342727647277
            timeline = data.data.threaded_conversation_with_injections_v2;
        } else if (apiPath === "HomeTimeline" || apiPath === "HomeLatestTimeline") {
            //"For you" and "Following" respectively, of the twitter homepage
            timeline = data.data.home.home_timeline_urt;
        } else if (apiPath === "UserTweets" || apiPath === "UserTweetsAndReplies" || apiPath === "UserMedia" || apiPath === "Likes") {
            //When viewing a user directly.
            //https://twitter.com/elonmusk
            //https://twitter.com/elonmusk/with_replies
            //https://twitter.com/elonmusk/media
            //https://twitter.com/elonmusk/likes
            timeline = data.data.user.result.timeline_v2.timeline;
        } else if (apiPath === "UserHighlightsTweets") {
            //https://twitter.com/elonmusk/highlights
            timeline = data.data.user.result.timeline.timeline;
        } else if (apiPath === "SearchTimeline") {
            //When viewing quoted tweets, or when literally searching tweets.
            //https://twitter.com/elonmusk/status/1721042240535973990/quotes
            //https://twitter.com/search?q=hormozi&src=typed_query
            timeline = data.data.search_by_raw_query.search_timeline.timeline;
        } else {
            console.error("Unhandled api path '"+apiPath+"'")
            return data;
        }

        if (!timeline) {
            console.error("No timeline found");
            return data;
        }

        for (var instruction of timeline.instructions) {
            if (instruction.type === "TimelineClearCache" || instruction.type === "TimelineTerminateTimeline" || instruction.type === "TimelineReplaceEntry") {
                //do nothing
            } else if (instruction.type === "TimelineShowAlert") {
                for (let user of instruction.usersResults) {
                    fixUser(user.result, true);
                }
            } else if (instruction.type === "TimelinePinEntry") {
                //Sometimes there is an empty pinned entry? Eg https://twitter.com/RyLiberty
                if (instruction.entry.content.itemContent.tweet_results.result) {
                    console.log(instruction.entry.content.itemContent.tweet_results.result);
                    if (instruction.entry.content.itemContent.tweet_results.result.tweet) {
                        instruction.entry.content.itemContent.tweet_results.result = instruction.entry.content.itemContent.tweet_results.result.tweet
                    }
                    if (accountsWithNoPinnedTweets.includes(instruction.entry.content.itemContent.tweet_results.result.core.user_results.result.legacy.screen_name.toLowerCase())) {
                        instruction.shouldBeRemoved = true;
                    } else if (shouldRemoveTweet(instruction.entry.content.itemContent.tweet_results.result)) {
                        instruction.shouldBeRemoved = true;
                    } else {
                        fixTweet(instruction.entry.content.itemContent.tweet_results.result);
                    }
                }

            } else if (instruction.type === "TimelineAddToModule") {
                //Only seen on threads with longer than 30 tweets. Eg: https://twitter.com/Cobratate/status/1653053914411941897
                for (let item of instruction.moduleItems) {
                    if (item.entryId.startsWith(instruction.moduleEntryId+"-tweet-")) {
                        fixTweet(item.item.itemContent.tweet_results.result);
                    } else if (item.entryId.startsWith(instruction.moduleEntryId+"-cursor-")) {
                        //do nothing
                    } else {
                        console.error("Unhandled item entry id '"+item.entryId+"'");
                    }
                }

            } else if (instruction.type === "TimelineAddEntries") {
                for (var entry of instruction.entries) {
                    if (entry.entryId.startsWith("tweet-")) {
                        if (apiPath !== "TweetDetail" && shouldRemoveTweet(entry.content.itemContent.tweet_results.result)) {
                            //If TweetDetail, then the tweet is either the tweet itself, or the tweet(s) it is replying to.
                            //Do not check them for deletion because it would make the tweet have no sense.
                            entry.shouldBeRemoved = true;
                        }
                        if (!entry.shouldBeRemoved) {
                            fixTweet(entry.content.itemContent.tweet_results.result);
                        }

                    } else if (entry.entryId.startsWith("conversationthread-") || entry.entryId.startsWith("tweetdetailrelatedtweets-")) {
                        for (let item of entry.content.items) {
                            if (item.entryId.startsWith(entry.entryId+"-tweet-")) {
                                if (shouldRemoveTweet(item.item.itemContent.tweet_results.result)) {
                                    item.shouldBeRemoved = true;
                                } else {
                                    fixTweet(item.item.itemContent.tweet_results.result)
                                }
                            } else if (item.entryId.startsWith(entry.entryId+"-cursor-")) {
                                //do nothing
                            } else {
                                console.error("Unhandled item entry id '"+item.entryId+"'");
                            }

                        }
                        entry.content.items = entry.content.items.filter(x => !x.shouldBeRemoved)
                        if (entry.content.items.length === 0) {
                            entry.shouldBeRemoved = true
                        }

                    } else if (entry.entryId.startsWith("profile-conversation-") || entry.entryId.startsWith("home-conversation-")) {
                        //Only remove tweets in a conversation if it is the last tweet of the conversation. (Else, the tweets after won't make sense.)
                        let hasTweetBeenKept = false;
                        for (let i = entry.content.items.length - 1; i >= 0; i--) {
                            if (!hasTweetBeenKept) {
                                if (shouldRemoveTweet(entry.content.items[i].item.itemContent.tweet_results.result)) {
                                    entry.content.items[i].shouldBeRemoved = true;
                                } else {
                                    hasTweetBeenKept = true;
                                }
                            }
                            if (!entry.content.items[i].shouldBeRemoved) {
                                fixTweet(entry.content.items[i].item.itemContent.tweet_results.result);
                            }
                        }
                        entry.content.items = entry.content.items.filter(x => !x.shouldBeRemoved)
                        if (entry.content.items.length === 0) {
                            entry.shouldBeRemoved = true
                        }

                    } else if (entry.entryId.startsWith("toptabsrpusermodule-")) {
                        for (let item of entry.content.items) {
                            fixUser(item.item.itemContent.user_results.result, true);
                        }

                    } else if (entry.entryId.startsWith("who-to-follow-") || entry.entryId.startsWith("who-to-subscribe-") || entry.entryId.startsWith("promoted-tweet-") || entry.entryId === "messageprompt-premium-plus-upsell-prompt") {
                        entry.shouldBeRemoved = true;

                    } else if (entry.entryId.startsWith("cursor-") || entry.entryId.startsWith("label-") || entry.entryId.startsWith("relevanceprompt-")) {
                        //nothing to do
                    } else {
                        console.error("Unhandled entry id '"+entry.entryId+"'")
                    }
                }
                instruction.entries = instruction.entries.filter(x => !x.shouldBeRemoved);
            } else {
                console.error("Unhandled instruction type '"+instruction.type+"'");
            }
        }
        timeline.instructions = timeline.instructions.filter(x => !x.shouldBeRemoved);

        return data;
    }


    //It's absolutely crazy that the only viable way of expanding a tweet is to hook the XMLHttpRequest object itself.
    //Big thanks to https://stackoverflow.com/a/28513219/4851350 because all other methods did not work.
    //Apparently it's only in firefox. If it doesn't work in Chrome, cry about it.

    /*const OriginalXMLHttpRequest = unsafeWindow.XMLHttpRequest;

    class XMLHttpRequest extends OriginalXMLHttpRequest {
        get responseText() {
            // If the request is not done, return the original responseText
            if (this.readyState !== 4) {
                return super.responseText;
            }
            console.log(super.responseText);

            return super.responseText.replaceAll("worse", "owo");
        }
    }

    unsafeWindow.XMLHttpRequest = XMLHttpRequest;*/

    try {
        var open_prototype = XMLHttpRequest.prototype.open
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('readystatechange', function(event) {
                if ( this.readyState === 4 ) {
                    var urlPath = event.target.responseURL ? (new URL(event.target.responseURL)).pathname : "";
                    var apiPath = urlPath.split("/").pop()
                    //console.log(urlPath);
                    if (urlPath.startsWith("/i/api/") && ["UserTweets", "HomeTimeline", "HomeLatestTimeline", "SearchTimeline", "TweetDetail", "UserByScreenName", "UserByRestId", "UserTweetsAndReplies", "UserMedia", "Likes", "UserHighlightsTweets", "recommendations.json"].includes(apiPath)) {

                        var originalResponseText = event.target.responseText;
                        console.log(apiPath, JSON.parse(originalResponseText));
                        originalResponseText = patchApiResult(apiPath, JSON.parse(originalResponseText));
                        console.log(originalResponseText);
                        Object.defineProperty(this, 'response', {writable: true});
                        Object.defineProperty(this, 'responseText', {writable: true});
                        this.response = this.responseText = JSON.stringify(originalResponseText);
                    }
                }
            });
            return open_prototype.apply(this, arguments);
        };
    } catch (e) {
        console.error(e);
    }
    /*var accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');

    Object.defineProperty(unsafeWindow.XMLHttpRequest.prototype, 'responseText', {
        get: function() {
            var urlPath = this.responseURL ? (new URL(this.responseURL)).pathname : "";
            var apiPath = urlPath.split("/").pop()
            console.log(urlPath);
            if (urlPath.startsWith("/i/api/") && ["UserTweets", "HomeTimeline", "HomeLatestTimeline", "SearchTimeline", "TweetDetail", "UserByScreenName", "UserByRestId", "UserTweetsAndReplies", "UserMedia", "Likes", "UserHighlightsTweets", "recommendations.json"].includes(apiPath)) {
                var originalResponseText = accessor.get.call(this);
                console.log(apiPath, JSON.parse(originalResponseText));
                originalResponseText = patchApiResult(apiPath, JSON.parse(originalResponseText));
                console.log(originalResponseText);
                return JSON.stringify(originalResponseText);
            } else {
                return accessor.get.call(this);
            }
        },
        set: function(str) {
            console.log('set responseText: %s', str);
            return accessor.set.call(this, str);
        },
        configurable: true
    });*/
})();