// ==UserScript==
// @name         TNT Twitter is not Tiktok
// @namespace    twitter
// @version      0.3
// @license MIT
// @description  Hides posts with videos
// @author       https://x.com/codeninja_ru
// @match               *://twitter.com/*
// @match               *://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant    GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @connect raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/499510/TNT%20Twitter%20is%20not%20Tiktok.user.js
// @updateURL https://update.greasyfork.org/scripts/499510/TNT%20Twitter%20is%20not%20Tiktok.meta.js
// ==/UserScript==

const MIN_TEXT_LENGTH = 50;

const gmAddStyle = typeof GM.addStyle == 'function' ? GM.addStyle : GM_addStyle;
const gmRegisterMenuCommand = typeof GM.registerMenuCommand == 'function' ? GM.registerMenuCommand : GM_registerMenuCommand;
gmAddStyle(`article[data-has-video] {
        opacity: 50%;
    }
    article[data-has-video]:hover {
        opacity: 1;
    }

    article[data-has-video] [data-testid="tweetText"][data-small-text] {
        display: none;
    }

    [data-video-block] {
        display: none;
    }

    article[data-has-video] [data-username]::after {
        display: inline;
        content: '[🎦]';
        padding: 0 10px;
        color: red;
    }

    article[data-has-video]:hover [data-video-block], article[data-has-video]:hover [data-testid="tweetText"] {
        display: block;
    }
`);

function watchOnVideos(newVideosCallback) {
    var targetNode = document.body;
    if (targetNode) {
        var config = { childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    var videos = [];
                    Array.prototype.filter.call(mutation.addedNodes, function(node) {
                        return node instanceof Element;
                    })
                        .forEach(function(element) {
                        selectAllVideos(element).forEach(function(tweet) {
                            videos.push(tweet);
                        });
                    });

                    if (videos.length > 0) {
                        newVideosCallback(videos);
                    }
                }

            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
}

function processVideo(video) {
    const tweet = video.closest('article');
    if (tweet) {
        tweet.dataset.hasVideo = true;

        const tweetText = tweet.querySelector('[data-testid="tweetText"]');
        if (tweetText) {
            if (tweetText.innerText.trim().length < MIN_TEXT_LENGTH) {
                tweetText.dataset.smallText = true;
            }
        }

        const username = tweet.querySelector('[data-testid="User-Name"]');
        if (username) {
            username.dataset.username = true;
        }

        tweet.querySelectorAll('[data-testid="tweetPhoto"]').forEach(function(elm) {
            const repost = elm.closest('div[role="link"]');
            const video = elm.querySelector('video');
            const block = elm.closest('[aria-labelledby]');
            if (video && repost) {
                elm.dataset.videoBlock = true;
            } else if (block) {
                block.dataset.videoBlock = true;
            } else {
                elm.dataset.videoBlock = true;
            }

        });
    }
}

function selectAllVideos(element) {
    return element.querySelectorAll('video');
}

console.log('TNT Twitter Is Not Tiktok has been loaded');
selectAllVideos(document).forEach(processVideo);
watchOnVideos(function(videos) {
    videos.forEach(processVideo);
});
