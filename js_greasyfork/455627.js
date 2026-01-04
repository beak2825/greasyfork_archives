// ==UserScript==
// @name         Phoronix Enhancer
// @namespace    https://phoronix.com/
// @version      0.4
// @description  Improve QoL of Phoronix.com
// @author       AlanTuring69
// @match        http*://*.phoronix.com/forums/forum/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/455627/Phoronix%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/455627/Phoronix%20Enhancer.meta.js
// ==/UserScript==

const KNOWN_TROLLS = [
    'birdie',
    'rmoog',
    'xfcemint'
];

const IS_DEBUG = true;

(function() {
    'use strict';

    const knownTrollsSet = new Set(KNOWN_TROLLS);
    const additionalTrolls = new Set();

    let additionalTrollsText = GM.getValue('additionalTrolls', '[]');
    additionalTrollsText.then(value => {
        let additionalTrollsList = JSON.parse(value);
        additionalTrollsList.forEach(additionalTroll => {
            additionalTrolls.add(additionalTroll);
        });
    });

    function isTroll(authorName) {
        return knownTrollsSet.has(authorName) || additionalTrolls.has(authorName);
    };

    function debug(text) {
        if (IS_DEBUG) {
            console.log(text);
        }
    };

    function hashCode(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            let char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    window.hidePostsBy = function(authorName) {
        if (window.confirm(`Are you sure you wish to hide all posts and topics by ${authorName}?`)) {
            debug(`Hiding posts by ${authorName}`);
            additionalTrolls.add(authorName);
            GM.setValue('additionalTrolls', JSON.stringify(Array.from(additionalTrolls)));
        }
    };

    window.setInterval(function() {
        // Remove posts themselves
        $('.b-post').each(function() {
            // Find author name
            let authorName = $(this).find('.author > strong > a').last().text();
            let authorNameHash = hashCode(authorName);

            // debug(`Checking ${authorName} against incel list`);
            if (isTroll(authorName)) {
                // debug(`${authorName} is a known incel - removing hateful content`);
                $(this).remove();
            }

            var respondingToTroll = false;
            // Remove any quotes of these posts - anyone responding to such a troll is surely a troll themselves
            $(this).find('.bbcode_postedby > strong').each(function() {
                let respondingToName = $(this).text();
                if (isTroll(respondingToName)) {
                    respondingToTroll = true;
                    return false;
                }
            });

            if (respondingToTroll) {
                // debug(`${authorName} is responding to a known incel - removing hateful content`);
                $(this).remove();
            }

            // Add button to add to list
            let twitterShare = $(this).find('.js-twitter-share');
            if (twitterShare.length > 0) {
                $(twitterShare).parent().append(`<a class="hide-posts" id="hide-posts-${authorNameHash}" href="javascript: window.hidePostsBy('${authorNameHash}'); void(0);">Hide posts</a>`);
                $(`#hide-posts-${authorNameHash}`).click(function(event) {
                    event.preventDefault();
                    hidePostsBy(authorName);
                });
                $(twitterShare).remove();
            }
        });

        // Remove topic lists
        $('.topic-item').each(function() {
            let authorName = $(this).find('.topic-info > a').last().text();

            if (isTroll(authorName)) {
                debug(`Removing post by known troll ${authorName}`);
                $(this).remove();
            }
        });
    }, 333);
})();