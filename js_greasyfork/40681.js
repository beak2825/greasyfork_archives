// ==UserScript==
// @name        .M3U8 HLS Player
// @namespace   https://greasyfork.org/zh-CN/users/7232-andy-wong
// @description Lets you play .m3u8 with hls player.
// @include     *://*
// @version     2.0
// @require     https://cdn.jsdelivr.net/npm/hls.js@latest
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/40681/M3U8%20HLS%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/40681/M3U8%20HLS%20Player.meta.js
// ==/UserScript==

/* makes use of DailyMotion's MSE-based HLS client:
   https://github.com/dailymotion/hls.js */

var hlsJsUrl = "https://cdn.jsdelivr.net/npm/hls.js@latest";
var script = document.createElement('script');
script.onload = function() {
    window.postMessage({ type: "HLS_READY", isSupported: Hls.isSupported() }, "*");
};
script.src = hlsJsUrl;
document.head.appendChild(script);

function loadVideo(video) {
    var hls = new Hls();
    hls.loadSource(video.src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
    });
}

window.addEventListener("message", function(event) {
    if (event.source !== window)
        return;

    if (event.data.type && (event.data.type === "START_HLS_PLAYBACK")) {
        loadVideo(document.querySelector("video[inline-hls-player---video=" + event.data.videoId + "]"));
    }
}, false);

var hlsJsState = 0;
var hlsJsReadyCallbacks = [];


function loadHlsJs(callback) {
    if (hlsJsState === 0) {
        hlsJsState = 1;
    }

    if (hlsJsState === 1) {
        hlsJsReadyCallbacks.push(callback);
    }
}

function onHlsReady(isSupported) {
    hlsJsState = isSupported ? 2 : -1;
    hlsJsReadyCallbacks.forEach(callback => callback());
}

function getVideoId() {
    Array(24).fill().map(el => String.fromCharCode(Math.random() * 26 + 97));
}

function onVideoError(video) {
    if (hlsJsState === 0) {
        loadHlsJs(function() { onVideoError(video) });
    } else if (hlsJsState === 2) {
        let videoId = video.getAttribute("inline-hls-player---video");
        if (!videoId) {
            videoId = getVideoId();
            video.setAttribute("inline-hls-player---video", videoId);
        }

        window.postMessage({ type: "START_HLS_PLAYBACK", videoId: videoId }, "*");
    }
}

function isUnsupportedHlsVideo(element) {
    return (element instanceof HTMLVideoElement) &&
        element.error &&
        element.error.code === 4 &&
        element.src &&
        element.src.match(/\.m3u8($|\?)/);
}

function onWindowError(event) {
    const target = event.target;
    if (isUnsupportedHlsVideo(target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        onVideoError(target);
    }
}

document.addEventListener("error", onWindowError, true);

const videos = document.querySelectorAll("video");
if (videos.length) {
    for (var i = 0; i < videos.length; i++) {
        if (isUnsupportedHlsVideo(videos[i])) {
            onVideoError(videos[i]);
        }
    }
}

window.addEventListener("message", function(event) {
    if (event.source !== window)
        return;

    if (event.data.type && (event.data.type === "HLS_READY")) {
        onHlsReady(event.data.isSupported);
    }
}, false);