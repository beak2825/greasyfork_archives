// ==UserScript==
// @name        Gearspace cleanup
// @namespace   Gearspace
// @match       *://gearspace.com/*
// @grant       GM_log
// @version     1.4
// @author      Arkady Zotov
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @description 4/5/2023, 5:36:18 AM
// @downloadURL https://update.greasyfork.org/scripts/463352/Gearspace%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/463352/Gearspace%20cleanup.meta.js
// ==/UserScript==

const debugMode = false;

const likeLookupList = [];
const likeLookupWorkQueue = [];
let likeCountLookupsInProgress = false;

function xlog() {
    if (!debugMode) {
        return;
    }

    if (arguments.length === 1) {
        GM_log(arguments[0]);
    } else {
        GM_log(arguments[0], arguments[1]);
    }
}

function nextLikeCountLookup() {
    if (likeLookupWorkQueue.length === 0) {
        return;
    }

    const lookupItem = likeLookupWorkQueue.shift();

    if (lookupItem === undefined) {
        return;
    }

    const url = "https://gearspace.com/board/user_ajax.php?do=get_liked_post_usernames&postid=" + lookupItem.postId;
    xlog(`[GM] Like count lookup`, url);

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jsonRes;
            try {
                jsonRes = JSON.parse(xhttp.responseText);
            } catch {
                xlog(`[GM] JSON parse err`, url);
                nextLikeCountLookup();
                return;
            }

            const divList = $(lookupItem.postTableNode).find('div.smallfont');
            if (divList.length > 0) {
                $(divList[0]).prepend('<span style="margin-right: 20px">Likes: <strong>' + jsonRes.length + '</strong></span>');
            }

            nextLikeCountLookup();
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    xhttp.send();
}

function startLikeCountLookups() {
    if (likeCountLookupsInProgress || likeLookupList.length === 0) {
        return;
    }

    for (let i = 0; i < likeLookupList.length; i++) {
        likeLookupWorkQueue[i] = likeLookupList[i];
    }

    likeCountLookupsInProgress = true;

    window.setTimeout(nextLikeCountLookup, 3000);
}

function scheduleDelete(nodes) {
    window.setTimeout(() => {
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].style.display = 'none';
        }
    }, 5);
}

(function() {
    'use strict';
    xlog('[GM] init');

    VM.observe(document.body, () => {
        let nodes;

        nodes = document.querySelectorAll('div[id^="Takeover"');
        if (nodes) {
            xlog('[GM] site-notice-container nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('#adBanner');
        if (nodes) {
            xlog('[GM] adBanner nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('a[title="Advertisement"]');
        if (nodes) {
            xlog('[GM] a Advertisement nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('iframe[title="Advertisement"]');
        if (nodes) {
            xlog('[GM] iframe Advertisement nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('a[title="Click Here!"]');
        if (nodes) {
            xlog('[GM] ClickHere nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('#WallpaperAd');
        if (nodes) {
            xlog('[GM] WallpaperAd nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('.bnb');
        if (nodes) {
            xlog('[GM] BNB nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('.glide__slide');
        if (nodes) {
            xlog('[GM] GlideSlide nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('div[id^="showthread-category-vendors"');
        if (nodes) {
            xlog('[GM] showthread-category-vendors nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        nodes = document.querySelectorAll('div[id^="site-notice-container"');
        if (nodes) {
            xlog('[GM] site-notice-container nodes ', nodes.length);
            scheduleDelete(nodes);
        }

        // Add like count to post listing
        if (window.location.pathname === "/board/search.php") {
            const postTableNodes = $('.tborder');
            for (const postTableNode of postTableNodes) {
                const aList = $(postTableNode).find('a');
                for (const a of aList) {
                    const idx = a.href.indexOf('#post');
                    if (idx > -1) {
                        const postId = a.href.substring(idx).replace('#post', '');
                        if (!likeLookupList.find((f) => f.postId === postId)) {
                            likeLookupList.push({ postTableNode, postId });
                        }
                    }
                }
            }

            startLikeCountLookups();
        }
    });
})();