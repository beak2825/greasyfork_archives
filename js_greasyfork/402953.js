// ==UserScript==
// @name         View More Twitter Replies
// @namespace    jak0723
// @version      1.3.10
// @icon         https://live.staticflickr.com/7136/7842096300_012ec6cbda_q.jpg
// @description  Automatically displays replies hidden behind buttons
// @author       JAK0723
// @include      http*://*twitter.com/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/402953/View%20More%20Twitter%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/402953/View%20More%20Twitter%20Replies.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findAndClick(selector, observer) {
        const elem = document.querySelector(selector);

        if (elem != null) {
            elem.click();
            observer.disconnect();
        }
    }

    function isLink(element) {
        return element.getAttribute("role") === "link";
    }

    function isParentLink(element, parentN) {
        if (isLink(element)) {
            return true;
        }

        for (let i = 0; i <= parentN; i++) {
            element = element.parentElement;

            if (isLink(element)) {
                return true;
            }
        }

        return false;
    }

    const config = {childList: true, subtree: true};
    // Replies list
    const repliesSelector = "[aria-labelledby^='accessible-list'][role='region'][class='css-1dbjc4n']";
    // "View more replies" button on preview tweets
    const viewMoreSelector = "[href*='i/status/']" +
            "[role='link']" +
            "[data-focusable='true']" +
            "[class^='css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1ny4l3l'][class$='r-o7ynqc r-6416eg'] " +
            "div span";
    // "Show additional replies, including those that may contain offensive content" button
    const offensiveSelector = "[role='button']" +
            "[data-focusable='true']" +
            "[tabindex='0']" +
            "[class^='css-18t94o4 css-1dbjc4n r-1niwhzg r-42olwf r-sdzlij r-1phboty r-rs99b7 r-1w2pmg'][class$='r-o7ynqc r-6416eg r-lrvibr'] " +
            "div span span";
    // "Show replies" and "Show more replies" buttons
    const moreRepliesSelector = "div[dir='auto']" +
            "[class^='css-901oao r-1n1174f r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo'][class$='r-qvutc0'] " +
            "span[class^='css-901oao css-16my406'][class$='r-bcqeeo r-qvutc0']";

    setTimeout(function () {
        // For preview tweets, tweets that are opened from external sources may has a special format where only a few replies are shown and the rest are replaced
        // by a "More Tweets" section that contains popular tweets from random accounts that may or may not be related to the previewed tweet
        const previewSelector = "[data-testid='primaryColumn']" +
                "[class='css-1dbjc4n r-yfoy6g r-18bvks7 r-1ljd8xs r-13l2t4g r-1phboty r-1jgb5lz r-11wrixw r-61z16t r-1ye8kvj r-13qz1uu r-184en5c']";
        const preview = document.querySelector(previewSelector);

        if (preview != null) {
            const viewMore = document.querySelector(viewMoreSelector);

            if (viewMore != null) {
                viewMore.click();
            }
        }
    }, 3000);

    const rootCallback = function (mutationsList, observer) {
        const repliesNode = document.querySelector(repliesSelector);

        if (repliesNode != null) {
            const offensiveObserver = new MutationObserver(offensiveCallback);
            const moreRepliesObserver = new MutationObserver(moreRepliesCallback);
            offensiveObserver.observe(repliesNode, config);
            moreRepliesObserver.observe(repliesNode, config);
        }
    };

    const offensiveCallback = function (mutationsList, observer) {
        findAndClick(offensiveSelector, observer);
    };

    const moreRepliesCallback = function (mutationsList, observer) {
        const moreRepliesNodes = document.querySelectorAll(moreRepliesSelector);

        for (let elem of moreRepliesNodes) {
            if (isParentLink(elem, 4)) {
                continue;
            }
            elem.click();
        }
    };

    const rootNode = document.querySelector("#react-root");
    if (rootNode != null) {
        const rootObserver = new MutationObserver(rootCallback);
        rootObserver.observe(rootNode, config);
    }
})();