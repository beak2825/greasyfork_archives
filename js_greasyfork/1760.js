// ==UserScript==
// @name        YouTube RSS Feed
// @namespace   http://greasyfork.org/users/2240-doodles
// @author      Doodles
// @version     20
// @description Adds an RSS feed button to YouTube channels next to the subscribe button
// @icon        http://i.imgur.com/Ty5HNbT.png
// @icon64      http://i.imgur.com/1FfVvNr.png
// @match       *://www.youtube.com/*
// @match       *://youtube.com/*
// @grant       none
// @run-at      document-end
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/1760/YouTube%20RSS%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/1760/YouTube%20RSS%20Feed.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(function () {

    "use strict";
    addRssFeedSupport(true);
    document.body.addEventListener("yt-navigate-finish", function (event) {
        addRssFeedSupport(false);
    });

    function addRssFeedSupport(firstLoad) {
        if (isPlaylistPage()) {
            waitForElement("owner-container", function () {
                let playlistFeedLink = getPlaylistFeed(getPlatlistId());
                addRssLink(playlistFeedLink);
                addRssButtonPlaylist(playlistFeedLink);
            }, 330);
        } else if (isVideoPage()) {
            waitForElement("upload-info", function () {
                let channelFeedLink = getChannelFeed(getChannelIdFromPage());
                removeRssLink();
                addRssLink(channelFeedLink);
                addRssButton(channelFeedLink);
            }, 330);
        } else if (isChannelPage()) {
            waitForElement("subscribe-button", function () {
                let channelId = getChannelIdFromPage();
                if (channelId === null && firstLoad) {
                    removeRssLink();
                    addRefreshButton();
                } else {
                    let channelFeedLink = getChannelFeed(channelId);
                    removeRssLink();
                    addRssLink(channelFeedLink);
                    addRssButton(channelFeedLink);
                }
            }, 330);
        }
    }

    function isPlaylistPage() {
        return document.URL.indexOf("/playlist?list=") !== -1;
    }

    function isVideoPage() {
        return document.URL.indexOf("/watch") !== -1 && document.URL.indexOf("v=") !== -1;
    }

    function isChannelPage() {
        return $("#channel-header").length > 0;
    }

    function getPlatlistId() {
        let playlistId = document.URL.split("list=")[1].split("&")[0];
        if (!playlistId.startsWith("PL")) {
            playlistId = "PL" + playlistId;
        }
        return playlistId;
    }

    function getChannelIdFromPage() {
        let channelId = null;

        // try URL
        channelId = getChannelIdFromUrl(document.URL);
        if (channelId) {
            return channelId;
        }

        // try meta tags that are channel URLs
        let metaChannelUrlTags = [
            'og:url',
            'al:ios:url',
            'al:android:url',
            'al:web:url',
            'twitter:url',
            'twitter:app:url:iphone',
            'twitter:app:url:ipad'
        ];
        for (let i = 0; i < metaChannelUrlTags.length; i++) {
            let metaPropertyValue = getMetaTagValue(metaChannelUrlTags[i]);
            channelId = metaPropertyValue ? getChannelIdFromUrl(metaPropertyValue) : null;
            if (channelId) {
                return channelId;
            }
        }

        // try meta tags that are channel IDs
        let metaChannelIdTags = [
            'channelId'
        ];
        for (let i = 0; i < metaChannelIdTags.length; i++) {
            channelId = getMetaTagValue(metaChannelIdTags[i]);
            if (channelId) {
                return channelId;
            }
        }

        // try upload info box on video page
        let uploadInfoLink = $("#upload-info a[href*='/channel/']:first");
        if (uploadInfoLink.length) {
            let uploadInfoLinkHref = uploadInfoLink.attr("href");
            channelId = uploadInfoLinkHref ? getChannelIdFromUrl(uploadInfoLinkHref) : null;
            if (channelId) {
                return channelId;
            }
        }

        // give up
        return null;
    }

    function getChannelIdFromUrl(url) {
        if (url && url.indexOf("youtube.com/channel/") !== -1) {
            return url.split("youtube.com/channel/")[1].split("/")[0].split("?")[0];
        } else {
            return null;
        }
    }

    function getMetaTagValue(metaPropertyKey) {
        // <meta property="og:url" content="https://www.youtube.com/channel/UCC8VtutLDSrreNEZj8CU01A">
        // <meta name="twitter:url" content="https://www.youtube.com/channel/UCC8VtutLDSrreNEZj8CU01A">
        // <meta itemprop="channelId" content="UCC8VtutLDSrreNEZj8CU01A">

        let nameAttributes = ['property', 'name', 'itemprop'];
        let metaProperty = null;
        for (let i = 0; i < nameAttributes.length; i++) {
            metaProperty = $("meta[" + nameAttributes[i] + "='" + metaPropertyKey + "']");
            if (metaProperty.length === 1) {
                break;
            }
            metaProperty = null;
        }

        if (metaProperty !== null) {
            let value = metaProperty.attr("content");
            if (value) {
                return value;
            }
        }
        return null;
    }

    function getChannelFeed(channelId) {
        return "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId;
    }

    function getPlaylistFeed(playlistId) {
        return "https://www.youtube.com/feeds/videos.xml?playlist_id=" + playlistId;
    }

    function addRssLink(link) {
        $("head").append('<link rel="alternate" type="application/rss+xml" title="RSS" href="' +
                link + '" />');
    }

    function removeRssLink() {
        if ($("link[type='application/rss+xml']").length > 0) {
            $("link[type='application/rss+xml']").remove();
        }
    }

    function waitForElement(elementId, callbackFunction, intervalLength = 330) {
        var waitCount = 15000 / intervalLength; // wait 15 seconds maximum
        var wait = setInterval(function () {
            waitCount--;
            if ($("#" + elementId).length > 0) {
                callbackFunction();
                clearInterval(wait);
            } else if (waitCount <= 0) {
                console.log("YouTube RSS Feed UserScript - wait for element \"#" + elementId +
                        "\" failed! Time limit (15 seconds) exceeded.");
                clearInterval(wait);
            }
        }, intervalLength);
    }

    function addRssButton(link) {
        if ($("#rssSubButton").length > 0) {
            $("#rssSubButton").remove();
        }
        $("#subscribe-button")
                .css({
                    "display": "flex",
                    "flex-flow": "nowrap",
                    "height": "37px"
                })
                .prepend(makeRssButton(link));
    }

    function addRssButtonPlaylist(link) {
        if ($("#rssSubButton").length === 0) {
            $("#owner-container > #button")
                    .css({
                        "display": "flex",
                        "flex-flow": "nowrap",
                        "height": "37px"
                    })
                    .prepend(makeRssButton(link));
        }
    }

    function makeRssButton(link) {
        return $("<a>RSS</a>")
                .attr("id", "rssSubButton")
                .attr("target", "_blank")
                .attr("href", rssLinkToData(link))
                .attr("download", "feed.rss")
                .css({
                    "background-color": "#fd9b12",
                    "border-radius": "3px",
                    "padding": "10px 16px",
                    "color": "#ffffff",
                    "font-size": "14px",
                    "text-decoration": "none",
                    "text-transform": "uppercase",
                    "margin-right": "5px"
                });
    }

    function rssLinkToData(link) {
        return "data:application/atom+xml,<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                "<feed xmlns=\"http://www.w3.org/2005/Atom\">" +
                "<title type=\"text\">YouTube RSS Button</title>" +
                "<link rel=\"self\" href=\"" + link + "\" type=\"application/atom+xml\" />" +
                "</feed>";
    }

    function addRefreshButton() {
        let refreshButton = $("<a>Refresh</a>")
                .attr("id", "rssSubButton")
                .attr("href", "#")
                .css({
                    "background-color": "#fd9b12",
                    "border-radius": "3px",
                    "padding": "10px 16px",
                    "color": "#ffffff",
                    "font-size": "14px",
                    "text-decoration": "none",
                    "text-transform": "uppercase",
                    "margin-right": "5px"
                });
        $(refreshButton).click(function (e) {
            e.preventDefault();
            let r = confirm("Due to how YouTube load pages, there isn't a reliable way to get channel" +
                    " IDs from channel pages if you've navigated to them from another YouTube page." +
                    " The solution is to reload the page.\n\nWould you like to reload the page?");
            if (r === true) {
                window.location.reload();
            }
        });
        if ($("#rssSubButton").length > 0) {
            $("#rssSubButton").remove();
        }
        $("#subscribe-button")
                .css({
                    "display": "flex",
                    "flex-flow": "nowrap",
                    "height": "37px"
                })
                .prepend(refreshButton);
    }

});
