// ==UserScript==
// @name         Reddit Slideshow - Upvote and Unmute
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Go to next slide, upvote and unmute by pressing a or /. This script is for this extension: https://chrome.google.com/webstore/detail/reddit-slideshow/jnjpgagcbhkomjfkfimifpddphbiilkh.
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464225/Reddit%20Slideshow%20-%20Upvote%20and%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/464225/Reddit%20Slideshow%20-%20Upvote%20and%20Unmute.meta.js
// ==/UserScript==

let lastVideo = ''

document.addEventListener('keydown', e=>{
    // keys
    if(e.key === 'a' || e.key === '/'){
        // upvote
        const upvote = document.querySelector('#__redditSlideShowUpVoteButton')
        if(!upvote.querySelector('.icon-upvote_fill')){ // check if not already upvoted
            upvote.click()
        }

        // next slide
        document.querySelector('#__redditSlideShowSlideShowNext').click()

        // unmute
        const currentVideo = document.querySelector('#__redditSlideShowSlideShowVideo').src // necessary because the video persists accross slides
        const currentPost = document.querySelector('#__redditSlideShowSlideShowLink').href
        // console.log(currentVideo, '|', lastVideo, currentVideo !== lastVideo)
        if(currentVideo !== lastVideo){
            document.querySelector('#__redditSlideShowSlideShowUnmute').click()
        }else{
            // mute
            document.querySelector('#__redditSlideShowSlideShowVideo').src
        }
        lastVideo = currentVideo
    }
})