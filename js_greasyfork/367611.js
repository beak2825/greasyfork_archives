// ==UserScript==
// @name         Tweetdeck Image Saver
// @namespace    https://twitter.com/aloneunix
// @version      1.1
// @description  Script to download tweet images in one click.
// @author       aloneunix
// @include      https://tweetdeck.twitter.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/367611/Tweetdeck%20Image%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/367611/Tweetdeck%20Image%20Saver.meta.js
// ==/UserScript==

(function() {
    var TweetType = {
        Column: 0,
        Detail: 1,
        Modal: 2
    };
    function GetOrigUrl(url) {
        var u = new URL(url);
        u.searchParams = new URLSearchParams(url.search);
        u.searchParams.set("format", u.pathname.substring(u.pathname.lastIndexOf(".")+1)); // because sometimes png images have jpg format
        u.searchParams.set("name", "orig");
        return u
    }
    var TweetTools = (function () {
        function TweetTools(tweet, type) {
            var self = this;
            this.tweet = tweet;
            this.type = type;
            this.GatherData();
            var dlButton = this.CreateDLButton();
            dlButton.onclick = function () {
                var urls = self.GetImages();
                if (urls.length == 1) {
                    var u = GetOrigUrl(urls[0]);
                    GM_download({url: u.href, name: self.GetFilename(u)});
                } else {
                    urls.forEach(function(url, i) {
                        var u = GetOrigUrl(url);
                        GM_download({url: u.href, name: self.GetFilename(u, i)});
                    });
                }
            };
        }
        TweetTools.prototype.GetImages = function () {
            var urls = [];
            if (this.type == TweetType.Modal) {
                urls.push(this.tweet.querySelector(".js-media-image-link img").src);
            } else if (this.type == TweetType.Column || this.type == TweetType.Detail) {
                var imgLinks = this.tweet.getElementsByClassName("js-media-image-link");
                if (imgLinks.length == 1) {
                    if (this.type == TweetType.Column)
                        urls.push(imgLinks[0].style.backgroundImage.slice(4, -1).replace(/"/g, ""));
                    if (this.type == TweetType.Detail)
                        urls.push(imgLinks[0].firstElementChild.src);
                } else {
                    Array.from(imgLinks).forEach(function(url) {
                        urls.push(url.style.backgroundImage.slice(4, -1).replace(/"/g, ""));
                    });
                }
            }
            return urls;
        };
        TweetTools.prototype.GatherData = function () {
            this.username = this.tweet.querySelector("span.username").innerHTML.slice(1);
            if (this.type == TweetType.Modal) {
                this.tweet_id = this.tweet.querySelector("time.tweet-timestamp a").href.split("status/")[1];
            } else {
                this.tweet_id = this.tweet.getAttribute("data-tweet-id");
            }
            var ts;
            if (this.type == TweetType.Detail) {
                ts = this.tweet.querySelector(".margin-tl a").text.split(" · ")[1];
            } else {
                ts = parseInt(this.tweet.getElementsByClassName("tweet-timestamp")[0].getAttribute("data-time"));
            }
            ts = new Date(ts);
            this.ts = ts.getFullYear() + '-' +
                ('0'+ (ts.getMonth()+1)).slice(-2) + '-' +
                ('0'+ ts.getDate()).slice(-2); // I don't want to live on this planet anymore
        };
        TweetTools.prototype.CreateDLButton = function () {
            var actions = this.tweet.querySelector("footer ul");
            var dlIcon = document.createElement("i");
            dlIcon.className = "icon icon-share txt-right";
            var iconContainer = document.createElement("a");
            iconContainer.href = "#";
            iconContainer.appendChild(dlIcon);
            var dlButton = document.createElement("li");
            if (this.type == TweetType.Detail) {
                iconContainer.className = "tweet-detail-action";
                dlButton.className = "tweet-detail-action-item position-rel";
                Array.from(actions.children).forEach(function (action) {
                    action.style.width = "20%";
                });
                dlButton.style.width = "20%";
            } else {
                iconContainer.className = "tweet-action";
                dlButton.className = "tweet-action-item position-rel pull-left margin-r--13";
            }
            dlButton.appendChild(iconContainer);
            actions.appendChild(dlButton);
            this.tweet.className += " has-tis-tools";
            return dlButton;
        };
        TweetTools.prototype.GetFilename = function(url, index) {
            var extension = url.searchParams.get("format");
            var _index = index !== undefined ? "_"+(index+1) : "";
            return `${this.username}_${this.ts}_${this.tweet_id}${_index}.${extension}`;
        };
        return TweetTools;
    }());
    var columnDetailObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == "childList") {
                var tweet = mutation.target.querySelector(".js-tweet-detail article:not(.has-tis-tools)");
                if (tweet)
                    new TweetTools(tweet, TweetType.Detail);
                var replies = mutation.target.querySelectorAll(".tweet-detail-reply article:not(.has-tis-tools)");
                if (replies.length !== 0) {
                    replies = Array.from(replies).filter(function(tweet) {
                        return tweet.querySelector(".js-media .js-media-image-link") && !tweet.querySelector(".quoted-tweet, .video-overlay");
                    });
                    replies.forEach(function (reply) {
                        new TweetTools(reply, TweetType.Column);
                    });
                }
            }
        });
    });
    var columnObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == "childList") {
                var tweets = document.querySelectorAll("article.stream-item.is-actionable:not(.has-tis-tools)");
                tweets = Array.from(tweets).filter(function(tweet) {
                    return tweet.querySelector(".js-media .js-media-image-link") && !tweet.querySelector(".quoted-tweet, .video-overlay");
                });
                tweets.forEach(function(tweet) {
                    new TweetTools(tweet, TweetType.Column);
                });
            }
        });
    });
    var modalObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == "childList") {
                var modal = document.querySelector("#open-modal .js-modal-panel");
                if (!modal) {
                    return;
                }
                var tweet = modal.querySelector(".med-tweet .item-box");
                if (tweet) {
                    new TweetTools(modal, TweetType.Modal);
                }
            }
        });
    });
    function initModalObserver() {
        var modalPanel = document.querySelector("#open-modal");
        modalObserver.observe(modalPanel, {
            childList: true
        });
    }
    function initColumnObserver() {
        var columns = document.querySelectorAll("#container section.column");
        Array.from(columns).forEach(function(column) {
            columnObserver.observe(column.querySelector("div.chirp-container"), {
                childList: true
            });
            columnDetailObserver.observe(column.querySelector("div.column-detail"), {
                childList: true, subtree: true
            });
        });
    }
    function initAppObserver() {
        var app = document.querySelector("div.application");
        new MutationObserver(function(mutations) {
            var appColumns = app.querySelector(".app-content .app-columns");
            if (appColumns.children.length !== 0) {
                this.disconnect();
                initColumnObserver();
                initModalObserver();
            }
        }).observe(app, {
            childList: true,
        });
    }
    initAppObserver();
})();
