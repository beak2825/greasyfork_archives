// ==UserScript==
// @name         Youtube - Auto Like
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Auto likes a video near the end, the goal being to keep track of watched videos since youtube history is limited
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455474/Youtube%20-%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/455474/Youtube%20-%20Auto%20Like.meta.js
// ==/UserScript==


function l(...args){
    console.log('[Auto Like]', ...args)
}

function getLikeButton(){
    return document.querySelector('like-button-view-model button')
}

function isLiked(){
    return getLikeButton().getAttribute("aria-pressed") === 'true'
}

function like(){
    if(!isLiked()) getLikeButton().click()
}

function listen(video){
    l('listening', video)
    video.addEventListener('timeupdate', () => {
        if(video.currentTime/video.duration > 0.9){
            like()
        }
    })
}

function findVideo(onVideoFound){
    const observer = new MutationObserver((mutations, observer) => {
        // Keep trying to find video
        let video = document.querySelector('video.video-stream')
        if(video){
            onVideoFound(video)
            observer.disconnect()
        }
    })
    observer.observe(document, {childList:true, subtree:true})
}

findVideo(video => {
    listen(video)
})