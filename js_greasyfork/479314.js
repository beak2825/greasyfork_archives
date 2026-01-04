// ==UserScript==
// @name         Youtube Anti-anti-adblock
// @namespace    sponers
// @version      0.2
// @description  Replaces the youtube video player with a youtube embed to bypass adblocker
// @author       SPONERS
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479314/Youtube%20Anti-anti-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/479314/Youtube%20Anti-anti-adblock.meta.js
// ==/UserScript==

/*

YT player locations:

body
  > #player > #player-wrap > #player-api
  > ytd-app > #content > #page-manager > ytd-watch-flexy
    > #full-bleed-container
    > #columns > #primary > #primary-inner > #player > #player-container-outer > #player-container-inner > #container
      > #player-container > #ytd-player > #container
        > #movie_player > .html5-video-container > video //before
        > #movie_player > #aab-embed                     //after

*/

(function() {
    'use strict';

    function log(message) {
        console.log("AAB: " + message);
    }

    function callPlayer(func, args) {
        if (!embed) return;
        embed.contentWindow.postMessage(JSON.stringify({
            'event': 'command',
            'func': func,
            'args': args || []
        }), '*');
    }

    // get the video ID of the video currently being watched
    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    // replace the youtube player with the embed
    function replacePlayer(videoId, timestamp) {
        // movie_player contains all the player controls, get rid of them and replace with the embed
        const player = document.getElementById('movie_player');
        if (!player && !embed) {
            // We're still loading the initial page; do nothing
            log("page loading; skipping.");
            return false;
        }

        log("checking for video player.");
        const videoEls = player.getElementsByClassName('html5-main-video');

        if (videoEls.length > 1) {
            log("there seem to be multiple video players?");
        }

        // if we have an html5 player (no anti-adblock)
        if (videoEls.length > 0 && !!videoEls[0].src) {
            log("html5 player present. using that instead.");
            if (embed) {
                log("removing embed.");
                embed.remove();
                embed = undefined;
            }
        }
        // if there's no html5 player (anti-adblock present)
        else {
            log("no html5 player present. adding embed.");
            // remove the notice
            const errorOverlay = document.getElementById('error-screen');
            if (errorOverlay) {
                errorOverlay.remove();
                log("error overlay removed.");
            }
            var src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`;
            if (!!timestamp && timestamp.length) {
                let time = timestamp[0]
                time = time.replace(/s$/, '');
                src += `&start=${time}`
            }
            if (embed) {
                embed.src = src;
                player.innerHtml = '';
                player.appendChild(embed);
            }
            else {
                // replace the player
                player.innerHTML = `<iframe id="aab-embed" width="100%" height="100%" src="${src}" allow="autoplay"></iframe>`;
                embed = document.getElementById('aab-embed');
            }
            callPlayer('playVideo');
            log("YouTube player replaced with embed iframe.");
            return true;
        }
    }

    // replace player again after the user navigates to a new video
    document.addEventListener("yt-navigate-finish", function(event) {
        stage = 0;
        // clear the embed if we've added it already
        const embed = document.getElementById('aab-embed');
        if (embed) embed.remove();
        // replace the video on the new page
        const videoId = youtube_parser(document.location.href);
        if (!videoId) return;
        const url = new URL(document.location.href);
        replacePlayer(videoId, url.searchParams.getAll('t'));
    });

    // unhide the player container stuff in case anti-adblock hid it
    GM_addStyle('ytd-watch-flexy[player-unavailable] #player-container-outer.ytd-watch-flexy { visibility: visible !important; }');

    // hold onto the embed for later reference
    var embed = null;

    const descObserver = new MutationObserver(textContainersMutated);
    const commentsObserver = new MutationObserver(commentsContainerMutated);
    const textObserver = new MutationObserver(textContainersMutated);

    // set up the mutation observer to monitor for when the player is added
    const pageManager = document.getElementById('page-manager');
    const pageObserver = new MutationObserver(pageMutated);
    try {
        log("observing page manager.");
        pageObserver.observe(pageManager, { childList: true });
    }
    catch (error) {
        log("couldn't observe page manager.");
    }

    var stage = 0;
    const observingTag = 'aab-observing';

    function pageMutated(mutationList, observer) {
        if (stage >= 2) return;

        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                log(`anti-anti-adblock reacting to element mutation. Stage ${stage}`);
                if (stage === 0) {
                    // looking for the main player container
                    const playerContainer = document.getElementById('player');
                    if (!playerContainer) {
                        log("no player container found.");
                        continue;
                    }

                    addTextObservers();

                    // the actual player itself hasn't been added yet
                    // so we need to monitor the element it'll be added to
                    const ytdPlayer = document.getElementById('ytd-player');
                    const ytdContainer = ytdPlayer.getElementsByClassName('ytd-player');
                    if (ytdContainer.length == 1) {
                        pageObserver.disconnect();
                        stage = 1;
                        log("observing containers.");
                        pageObserver.observe(ytdContainer[0], { childList: true });
                    }
                }
                else if (stage === 1) {
                    // should have the player ready to replace now
                    const videoId = youtube_parser(document.location.href);
                    if (!videoId) {
                        log("not a video page.");
                        continue;
                    }
                    const url = new URL(document.location.href);
                    if (!replacePlayer(videoId, url.searchParams.getAll('t'))) continue;

                    pageObserver.disconnect();
                    stage = 2;
                }
            }
        }
    }

    function addTextObservers() {
        const desc = document.querySelectorAll('#description-inline-expander yt-attributed-string')[0];
        if (desc && !desc.classList.contains(observingTag)) {
            try {
                log("observing video description.");
                descObserver.observe(desc, { childList: true });
                desc.classList.add(observingTag);
            }
            catch (error) {
                log("couldn't observe video description.");
                console.error(error);
            }
        }

        const comments = document.querySelectorAll('#comments')[0];
        if (comments && !comments.classList.contains(observingTag)) {
            try {
                log("observing comments section.");
                commentsObserver.observe(comments, { childList: true });
                comments.classList.add(observingTag);
            }
            catch (error) {
                log("couldn't observe comments section.");
                console.error(error);
            }
        }
    }

    function commentsContainerMutated(mutationList, observer) {
        log("comments section mutated.");
        for (const mutation of mutationList) {
            const comments = document.querySelectorAll('#comments > #sections > #contents')[0];
            textObserver.observe(comments, { childList: true });
        }
    }

    function textContainersMutated(mutationList, observer) {
        for (const mutation of mutationList) {
            for (let i = 0; i < Array.from(mutation.addedNodes).length; i++) {
                const node = mutation.addedNodes[i];
                const links = node.querySelectorAll('#comment #body #comment-content #content-text a');
                if (!links.length) continue;

                for (let l = 0; l < links.length; l++) {
                    const link = links[l];
                    const taggedClass = 'aab-link';
                    if (link.classList.contains(taggedClass)) continue;

                    link.classList.add(taggedClass);
                    const matches = /(?:(?<hh>\d\d?):)?(?<mm>\d\d?):(?<ss>\d\d?)/.exec(link.innerText);
                    if (!matches) continue;

                    let timestamp = (Number(matches.groups.mm)*60)+Number(matches.groups.ss);
                    if (matches.groups.hh > 0) {
                        timestamp += Number(matches.groups.hh) * 60 * 60;
                    }

                    log(`found timestamp ${timestamp}`);
                    link.addEventListener('click', (ev) => {
                        log(timestamp);
                        callPlayer('playVideo');
                        callPlayer('seekTo', [timestamp]);
                    });
                }
            }
        }
    }

})();
