// ==UserScript==
// @name         Hanime Auto Like
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto likes videos
// @author       You
// @match        https://hanime.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanime.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454661/Hanime%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/454661/Hanime%20Auto%20Like.meta.js
// ==/UserScript==

function l(...args){
    console.log('[Auto Like]', ...args)
}

let lastPage
const observer = new MutationObserver(async (mutationsList, observer) => {
    let page = document.URL
    if(page.includes('/videos/') && page != lastPage){
        //Keep trying until found
        if(document.querySelector('.icon.mdi.mdi-heart.primary--text')){
            lastPage = page //already liked
        }else{
            let button = document.querySelector('.icon.mdi.mdi-heart.grey--text')
            if(button){
                l('liked', page)
                button.click()
                button.style.setProperty("color", "blue", "important") //to tell if you liked manually
                lastPage = page //do it once per page
            }
        }
    }
})

observer.observe(document, {subtree:true, childList:true, attributes:true})