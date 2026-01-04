// ==UserScript==
// @name         Hanime Resumer and Hider
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Store video timespamps locally, hide videos that have a timespamp, button to hide all videos in a playlist (all your liked videos)
// @author       You
// @match        https://player.hanime.tv/*
// @match        https://hanime.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanime.tv
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/454662/Hanime%20Resumer%20and%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/454662/Hanime%20Resumer%20and%20Hider.meta.js
// ==/UserScript==

function l(...args){
    console.log('[Resumer]', ...args)
}

function key(){
    let key = document.URL.split(',')[2]
    return key
}

if(document.URL.includes('player.hanime')){
    //Resumer
    let once = false
    //Observe changes to the DOM
    const observer = new MutationObserver(async (mutationsList, observer) => {
        if(!once){
            //Get video element
            let video = document.querySelector('video')
            if(video){
                //Resume
                let previousTime = await GM.getValue(key())
                if(previousTime){
                    video.currentTime = previousTime
                    l(`resuming ${key()} ${video.currentTime}`)
                }
                //Save currentTime
                video.ontimeupdate = () => {
                    GM.setValue(key(), video.currentTime)
                }
                once = true
            }
        }
    })
    observer.observe(document, {subtree:true, childList:true, attributes:true})
}else{
    async function hide(a){
        let name = a.href.replace('https://hanime.tv/videos/hentai/', '')
        name = name.split('?')[0] //to remove ?playlist
        let previousTime = await GM.getValue(name)
        if(previousTime !== undefined){
            l(name, previousTime)
            a.style.filter = 'brightness(0.1)'
        }
    }
    //Hider
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList){
            //home page
            if(mutation.target.className == 'lazy hvc__media__cover' && mutation.removedNodes.length == 0){
                hide(mutation.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)
            }else if(mutation.target.className == 'lazy relative hvc2__lazy' && mutation.removedNodes.length == 0){
                hide(mutation.target.parentElement.parentElement)
            }else if(mutation.target.id == 'related_content' && mutation.removedNodes.length == 0){ //video page
                for(let a of mutation.target.querySelectorAll('.video__item a')){
                    hide(a)
                }
                break
            }
        }
        //playlists (inefficient)
        if(document.URL.includes('/playlists/')){
            for(let a of document.querySelectorAll('.video__item a')){
                hide(a)
            }

            //Hide all liked videos
            if(!document.querySelector('#hide-all')){
                let group = document.querySelector('.btn-toggle.btn-toggle--selected')
                group.insertAdjacentHTML('afterEnd', '<button id="hide-all" type="button" class="btn btn--active btn--flat" style="position: relative;"><div class="btn__content">Hide All</div></button>')
                document.querySelector('#hide-all').onclick = async () => {
                    for(let a of document.querySelectorAll('.video__item a')){
                        let name = a.href.replace('https://hanime.tv/videos/hentai/', '')
                        name = name.split('?')[0] //to remove ?playlist
                        let previousTime = await GM.getValue(name)
                        if(previousTime === undefined){
                            l('hiding', name)
                            a.style.filter = 'brightness(0.1)'
                            GM.setValue(name, 0)
                        }
                    }
                }
            }
        }

    })
    observer.observe(document, {subtree:true, childList:true})
}