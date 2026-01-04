// ==UserScript==
// @name         auto-next-episode
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  auto play next episode
// @author       zqcccc
// @match        https://ddys.art/*
// @include      /^https:\/\/ddys.+$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ddys.art
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467874/auto-next-episode.user.js
// @updateURL https://update.greasyfork.org/scripts/467874/auto-next-episode.meta.js
// ==/UserScript==

(function() {
    'use strict';

var videoElement = getVideoElement()

function getVideoElement() {
    return document.querySelector('video')
}
function getPlayBtn() {
    return document.querySelector('button[title="Resume"]') || document.querySelector('button[title="播放视频"]')
}
function videoEndHandle() {
    var nextEpisodeBtn = document.querySelector('button[title="下一集"]')
    nextEpisodeBtn.click()
    this.removeEventListener('ended', videoEndHandle)
    var checkTimer = setInterval(()=>{
        var playBtn = getPlayBtn()
        if (playBtn) {
            playBtn.click()
            clearInterval(checkTimer)
            var newVideoElement = getVideoElement()
            newVideoElement.addEventListener('ended', videoEndHandle)
            setTimeout(()=>checkIfVideoPlaying(newVideoElement), 2000)
        }
    }
    , 1000)
}

function checkIfVideoPlaying(videoElement, hasCheckedTimes=0) {
    if (hasCheckedTimes > 10) {
        window.location.reload()
    } else if (videoElement.paused) {
        const btn = getPlayBtn()
        btn?.click()
        setTimeout(()=>checkIfVideoPlaying(videoElement, hasCheckedTimes + 1), 2000)
    }
}

videoElement.addEventListener('ended', videoEndHandle)

checkIfVideoPlaying(videoElement)

})();