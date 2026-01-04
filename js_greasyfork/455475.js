// ==UserScript==
// @name         Youtube - Resumer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Store video.currentTime locally
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455475/Youtube%20-%20Resumer.user.js
// @updateURL https://update.greasyfork.org/scripts/455475/Youtube%20-%20Resumer.meta.js
// ==/UserScript==


function l(...args){
    console.log('[Resumer]', ...args)
}

function videoId(url=document.URL){
    return new URL(url).searchParams.get('v')
}

let lastTimeInSeconds
function save(video, id){
    const seconds = Math.floor(video.currentTime)
    if(lastTimeInSeconds != seconds){ // save less often
        let completion = video.currentTime / video.duration
        GM.setValue(id, video.currentTime)
        GM.setValue(id + '-completion', completion)
    }
    lastTimeInSeconds = seconds
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


let id = videoId() //if you use the miniplayer the url no longer includes the video id
function listen(video){
    let lastSrc

    function handleTimeUpdate(){
        //Video source is '' and duration is NaN when going back to the home page
        //When loading a new video, the event is fired with currentTime 0 and duration NaN
        if(video.src && !isNaN(video.duration)){
            l('timeupdate', id, lastId, video.src, lastSrc)
            if(id){
                save(video, id)
                lastSrc = video.src
            }else if(video.src === lastSrc){ //in case you click another video while using the miniplayer
                save(video, lastId) //save even if in miniplayer
            }
        }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
    }
}

async function resume(video){
    id = videoId() // set id here because in firefox the url changes before navigate-finish completes
    let lastTime = await GM.getValue(id)
    if(lastTime){
        if(lastTime < video.duration - 1){
          l('resuming', id, video.currentTime, lastTime)
          video.currentTime = lastTime
        }else{
          l('nearly complete, skipping resume for', id);
        }
    }else{
        l('new video', video.currentTime)
    }
}

function cleanUrl(){
    //Remove t paramater when opening a video that had a progress bar
    let url = new URL(document.URL)
    url.searchParams.delete('t')
    window.history.replaceState(null, null, url)
}

let lastId // don't resume if going back to same page from miniplayer

// Event for each page change
document.addEventListener("yt-navigate-finish", () => {
    l('navigate-finish', lastId, videoId())
    // video page
    if(videoId() && lastId !== videoId()) {
        lastId = videoId()
        cleanUrl()

        let removeListeners
        findVideo(video => {
            resume(video)

            // clean previous listeners
            if(removeListeners) removeListeners()
            removeListeners = listen(video)
        })
    }
})

/////////////////////


function addProgressBar(thumbnail, completion){
    let overlays = thumbnail.querySelector('#overlays')
    let existingProgressBar = thumbnail.querySelector('ytd-thumbnail-overlay-resume-playback-renderer')
    if(!existingProgressBar) {
        let parent = document.createElement('div')
        parent.innerHTML = `
        <ytd-thumbnail-overlay-resume-playback-renderer class="style-scope ytd-thumbnail">
             <div id="progress" class="style-scope ytd-thumbnail-overlay-resume-playback-renderer" style="width: 100%"></div>
        </ytd-thumbnail-overlay-resume-playback-renderer>
        `
        overlays.appendChild(parent.children[0])
    }

    // style
    let progress = overlays.querySelector('#progress')
    let width = parseInt(completion * 100)
    progress.style.width = `${width}%`
    progress.style.backgroundColor = 'blue'
}

function progressBars(){
    // Add progress bars in the related section
    const observer = new MutationObserver(async (mutations, observer) => {
        for(let mutation of mutations){
            if(mutation.addedNodes.length > 0) {
                let thumbnails = mutation.target.querySelectorAll('a.ytd-thumbnail')
                for(let thumbnail of thumbnails){
                    let href = thumbnail.href
                    if(href) {
                        let id = videoId(href)
                        let completion = await GM.getValue(id + '-completion')
                        if(completion) {
                            addProgressBar(thumbnail, completion)
                        }
                    }
                }
            }
        }
    })
    observer.observe(document, {childList:true, subtree:true})
}

progressBars() // TODO doesn't always work