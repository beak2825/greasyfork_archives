// ==UserScript==
// @name         Reddit Comment Filter
// @namespace    https://codeberg.org/cache_miss
// @version      1.3
// @description  Automatically hides annoying, repetitive, or meaningless Reddit comments
// @author       Logan Kirkland <logan@logankirk.land>
// @license      MIT
// @match        https://www.reddit.com/*/comments/*
// @match        https://old.reddit.com/*/comments/*
// @grant        none
// @homepageURL  https://codeberg.org/cache_miss/reddit-comment-filter
// @homepage     https://codeberg.org/cache_miss/reddit-comment-filter
// @supportURL   https://codeberg.org/cache_miss/reddit-comment-filter/issues
// @downloadURL https://update.greasyfork.org/scripts/522732/Reddit%20Comment%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/522732/Reddit%20Comment%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Regex patterns for comments to filter
    const FILTERED_PATTERNS = [
        /^.{0,50}laughed .{0,50} harder than .{0,50} should.{0,50}$/im,
        /^.{0,50}spit out .{0,50} coffee.{0,50}$/im,
        /^.{0,50}going to hell for this.{0,50}$/im,
        /^.{0,50}enough reddit for today.{0,50}$/im,
        /^.{0,50}comment right here.{0,50} officer.{0,50}$/im,
        /^.{0,50}how do .{0,50} delete someone else.{0,50} comment.{0,50}$/im,
        /^.{0,50}terrible day to have eyes.{0,50}$/im,
        /^.{0,50}terrible day to be literate.{0,50}$/im,
        /^.{0,50}take my up\w+.{0,50}$/im,
        /^.{0,50}sav(?:e|ing) this for later.{0,50}$/im,
        /^.{0,50}chef'*s kiss.{0,50}$/im,
        /^.{0,50}cutting onions.{0,50}$/im,
        /^.{0,50}who hurt you.{0,50}$/im,
        /^.{0,50}don’*t deserve dogs.{0,50}$/im,
        /^.{0,50}misread instructions.{0,50}now my.{0,50}$/im,
        /^.{0,50}tell me you.{0,50} without telling me.{0,50}$/im,
        /^.{0,50}not all heroe*s wear.{0,50}capes*.{0,50}$/im,
        /^.{0,50}sigh.{0,50}unzip.{0,50}pants.{0,50}$/im,
        /^.{0,50}not.{0,50}proudest.{0,50}$/im,
        /^.{0,50}downvoted for this.*$/im,
        /^.{0,50}will get downvoted.*$/im,
        /^.{0,10}this(?: one right)*.{0,10}$/im,
        /^.*(?:👏.*){5,}.*$/im,
        /^.{0,10}rip.{0,10}$/im,
        /^.{0,50}underrated \w+.{0,10}$/im,
        /^.{0,10}came here to \w+ this.{0,10}$/im,
        /^.{0,50}scroll(?:ed)* \w+ far.{0,50}$/im,
        /^.{0,10}beat\s*(?:me|meat|my meat)\s*to\s*it.{0,10}$/im,
        /^.{0,10}too poor.{0,10}give.{0,10}gold.{0,10}$/im,
        /^.{0,50}not crying.{0,10}you.{0,5}crying.{0,50}$/im,
        /^this \w+ \w+s.{0,10}$/im,
        /^.{0,50}am i the only one who.*$/im,
        /^.{0,50}is it just me.*$/im,
        /^f$/im,
        /^.{0,10}f in the.{0,50}$/im,
        /^.{0,10}must be fun at part.{0,50}$/im,
        /^chat.{0,10}is this real.{0,10}$/im,
        /^is this real.{0,10}chat.{0,10}$/im,
        /^.{0,50}don'*t \w+ (?:how|why) this (?:comment |post )*is so low.{0,50}$/im,
        /^(?:how|why) is this (?:comment |post )*so low.{0,10}$/im,
        /^i hate sand.{0,80}$/im,
        /^.{0,10}play \w+ \w+,* win \w+ \w+.{0,10}$/im,
        /^.{0,10}every \w*\s*thread.{0,10}$/im,
        /^thanks for the .{0,20} kind.{0,50}$/im,
        /^.{0,50}good (?:sir|lady|madam).{0,50}$/im,
        /^.{0,50}believe.{0,50}(top|most).{0,50}comment.{0,50}$/im,
        /^.{0,50}calm down satan.{0,50}$/im,
        /^.{0,50}repost{0,50}$/im,
        /^.{0,50}mom'*s spaghetti{0,50}$/im,
    ];

    function isOldReddit() {
        return document.URL.includes("old.reddit.com")
    }

    function shouldFilter(text) {
        return FILTERED_PATTERNS.some(pattern => pattern.test(text));
    }

    function processComments() {
        const oldReddit = isOldReddit();
        const comments = document.querySelectorAll(oldReddit ? 'div.comment' : 'shreddit-comment')

        for (const comment of comments) {
            const commentTextNode = comment.querySelector(oldReddit ? '.md' : 'div[slot="comment"]')

            // Comment text sometimes doesn't exist, such as when the comment
            // has been deleted
            if (commentTextNode === null) continue;

            const commentText = commentTextNode.textContent.trim().replace(/\n/g, ' ');
            if (shouldFilter(commentText)) {
                comment.remove();
                numFiltered++;
                console.debug("Filtered comment: " + commentText)
            }
        }
    }

    // Initial processing
    let numFiltered = 0;
    processComments();
    console.debug("Total comments filtered: " + numFiltered)


    // Monitor DOM changes for dynamically loaded comments
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                processComments();
                console.debug("Total comments filtered: " + numFiltered)
            }
        });
    });

    observer.observe(document.body, {
        childList: true, subtree: true
    });
})();
