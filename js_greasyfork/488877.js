// ==UserScript==
// @name         YouTube Default Audio Track
// @namespace    bp-yt-audio-track-default
// @version      1.4
// @description  Makes it possible to select the desired Audio Track played by default.
// @author       BuIlDaLiBlE
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488877/YouTube%20Default%20Audio%20Track.user.js
// @updateURL https://update.greasyfork.org/scripts/488877/YouTube%20Default%20Audio%20Track.meta.js
// ==/UserScript==
"use strict";

const DESIRED_AUDIO_TRACK = "original"; // The desired audio track name (can be partial)

window.addEventListener("yt-navigate-finish", main, true);
const observer = new MutationObserver(
    (mutations, shortsReady = false, videoPlayerReady = false) =>
    {
        outer: for(const mutation of mutations)
        {
            for(const node of mutation.addedNodes)
            {
                if(!shortsReady)
                {
                    shortsReady = node.tagName === "YTD-SHORTS";
                }
                if(!videoPlayerReady)
                {
                    videoPlayerReady = typeof node.className === "string" && node.className.includes("html5-main-video");
                }
                if(shortsReady || videoPlayerReady)
                {
                    observer.disconnect();
                    main();
                    break outer;
                }
            }
        }
    }
);
observer.observe(document.documentElement,
{
    childList: true,
    subtree: true,
});

async function main()
{
    let player = getPlayer();
    while(!player)
    {
        player = getPlayer();
        await new Promise(resolve => setTimeout(resolve, 5));
    }
    forceAudioTrack(player);
}

function getPlayer()
{
    let player;
    if(window.location.href.includes("youtube.com/shorts"))
    {
        player = document.querySelector("#shorts-player");
    }
    else
    {
        player = document.querySelector("#movie_player");
    }
    return player;
}

function forceAudioTrack(player)
{
    try
    {
        const availableAudioTracks = player.getAvailableAudioTracks();
        const currentAudioTrack = player.getAudioTrack();
        let languageObject;

        if(availableAudioTracks === undefined || availableAudioTracks.length == 0)
        {
            return;
        }

        for(let object in currentAudioTrack)
        {
            if(currentAudioTrack[object].name)
            {
                languageObject = object;
                break;
            }
        }

        if(!currentAudioTrack[languageObject].name.toLowerCase().includes(DESIRED_AUDIO_TRACK.toLowerCase()))
        {
            for(const track of availableAudioTracks)
            {
                if(track[languageObject].name.toLowerCase().includes(DESIRED_AUDIO_TRACK.toLowerCase()))
                {
                    player.setAudioTrack(track);
                    break;
                }
            }
        }
    }
    catch(error)
    {
        console.error("Error setting Audio Track:", error.message);
    }
}
