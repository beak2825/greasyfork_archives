// ==UserScript==
// @name         NowSniper
// @namespace    NowSniper
// @version      1.0.1
// @description  Now Playing Data
// @author       Kıraç Armağan Önal
// @match        *://open.spotify.com/*
// @match        *://soundcloud.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/396396/NowSniper.user.js
// @updateURL https://update.greasyfork.org/scripts/396396/NowSniper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ws = new WebSocket("ws://127.0.0.1:9081");
    unsafeWindow.ws = ws;
    function wsSend(data){
        ws.send(JSON.stringify({data,hostname:window.location.hostname,date:Date.now()}));
    }
    function StartFunction(){

        setInterval(()=>{
            let hostname = window.location.hostname;
            if (hostname == "soundcloud.com") {
              let isPlaying = document.querySelector(".playControl").classList.contains("playing");
              let artwork = document.querySelector(".playbackSoundBadge span.sc-artwork").style.backgroundImage.slice(5,-2).replace("t50x50","t500x500");
              let title = document.querySelector(".playbackSoundBadge__titleLink").title;
              let artist = document.querySelector(".playbackSoundBadge__lightLink").title;
              let timePassed = document.querySelector(".playbackTimeline__timePassed span:nth-child(2)").textContent;
              let totalDuration = document.querySelector(".playbackTimeline__duration span:nth-child(2)").textContent;
              let albumLink = document.querySelector(".playbackSoundBadge__titleLink").href;
              wsSend({artwork,title,artist,isPlaying,timePassed,totalDuration,albumLink});

            } else if (hostname == "open.spotify.com") {
              let isPlaying = !!document.querySelector('.player-controls [data-testid="control-button-pause"]');
              let title = document.querySelector('[data-testid="nowplaying-track-link"]').textContent;
              let artist = [...new Set(Array.from(document.querySelectorAll('span[draggable] a[href*="artist"]')).map(i=>i.textContent))].join(", ");
              let artwork = document.querySelector('[data-testid="CoverSlotExpanded__container"] .cover-art-image').style.backgroundImage.slice(5,-2);
              let timePassed = document.querySelectorAll(".playback-bar .playback-bar__progress-time")[0].textContent;
              let totalDuration = document.querySelectorAll(".playback-bar .playback-bar__progress-time")[1].textContent;
              let albumLink = document.querySelector('[data-testid="nowplaying-track-link"]').href;
              wsSend({artwork,title,artist,isPlaying,timePassed,totalDuration,albumLink});
            }

        },1000);

    }

    if (ws.readyState == WebSocket.OPEN) {
       StartFunction();
    } else {
       ws.onopen = ()=>{StartFunction();}
    }

})();