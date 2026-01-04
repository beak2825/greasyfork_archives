// ==UserScript==
// @name         Youtube shorts controls
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shortcuts for Like and Dislike on Youtube shorts
// @author       You
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460417/Youtube%20shorts%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/460417/Youtube%20shorts%20controls.meta.js
// ==/UserScript==

const shortcutLike = 'Home'
const shortcutDislike = 'End'
const skipSmallLikes = true
const skipLikesThreshold = 10000

let video, videoContainer, shortsContainer
document.addEventListener('keydown', manageKey)

setTimeout(start, 1000)
function start(){
    shortsContainer = document.querySelector('#shorts-container')
}

async function findVideo(){
    await sleep(300)
    video = document.querySelector('ytd-player#player:not([style*="visibility: hidden"])')
    videoContainer = video.closest('ytd-reel-video-renderer')
    if(skipSmallLikes){
        skipVideo()
    }
}

function skipVideo(){
    const likeCountString = videoContainer.querySelector('#like-button #like-button span').innerText
    let likeCount = parseFloat(likeCountString)
    if(likeCountString.includes("K")){
        likeCount *= 1000
    }
    if(likeCount < skipLikesThreshold){
        console.log('skip')
    }
}

async function manageKey(keyboardEvent){
    if(keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.shiftKey) return
    let element = null, link = null
    const tag = keyboardEvent.target.tagName.toLowerCase()
	if(tag == 'input' || tag == 'textarea') return
    if(keyboardEvent.code == shortcutLike || keyboardEvent.code == shortcutDislike){
        keyboardEvent.preventDefault()
        video = document.querySelector('ytd-player#player:not([style*="visibility: hidden"])')
        videoContainer = video.closest('ytd-reel-video-renderer')
        const likeBlock = videoContainer.querySelector('#like-button')
        let button, dislikeCount
        dislikeCount = likeBlock.querySelector('#like-button #dislike-button yt-button-shape > label > div > span').innerText
        if(keyboardEvent.code == shortcutLike){
            button = likeBlock.querySelector('#like-button yt-button-shape button')
        }else if(keyboardEvent.code == shortcutDislike){
            button = likeBlock.querySelector('#dislike-button yt-button-shape button')
        }
        button.click()
        if(dislikeCount){
            await sleep(200)
            likeBlock.querySelector('#like-button #dislike-button yt-button-shape > label > div > span').innerText = dislikeCount
        }
    }
}

function sleep(ms){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}