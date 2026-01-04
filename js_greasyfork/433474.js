// ==UserScript==
// @name         Youtube Resumer (using the url)
// @description  Changes the ?t= parameter when pausing. Other version: https://greasyfork.org/en/scripts/455475-youtube-resumer
// @version      4
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @namespace    https://greasyfork.org/users/206408
// @downloadURL https://update.greasyfork.org/scripts/433474/Youtube%20Resumer%20%28using%20the%20url%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433474/Youtube%20Resumer%20%28using%20the%20url%29.meta.js
// ==/UserScript==

(async () => {

    function l(...args){
        console.log(`[Youtube Resumer]`, ...args)
    }

    function findVideo(){
        return document.querySelector('video')
    }

    //update ?t=
    function changeUrl(time){
        const url = new URL(window.location.href)
        url.searchParams.set('t', time)
        window.history.replaceState(null, null, url)
    }

    function listen(){
        const video = findVideo()
        video.addEventListener('pause', () => {
            changeUrl(parseInt(video.currentTime))
        })
    }

    let listening = false //the video element exists even if you go back to the home page, so no need to readd event listeners

    //Event for each page change
    document.addEventListener("yt-navigate-finish", function() {
        l('navigate-finish')
        //Match page with video
        if(window.location.href.match(new RegExp('https://www.youtube.com/watch\\?v=.'))) {
            //Add video listener once
            if(!listening){
                l('listening')
                listen()
                listening = true
            }
        }
    });
})();