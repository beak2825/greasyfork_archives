// ==UserScript==
// @name         New Userscript
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2025-08-08
// @description  description
// @author       You
// @match        https://gelbooru.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gelbooru.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545121/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/545121/New%20Userscript.meta.js
// ==/UserScript==
let {body} = document
let parse = string => (new DOMParser()).parseFromString(string, "text/html")

let premium = document.createElement("div")
premium.innerText = "premium"
let alert = body.querySelector(".alert.alert-info:not(.showNoGridSupport)")
alert.appendChild(premium)
let video = body.querySelector("#gelcomVideoPlayer")
let getVideoSrc = (id, callback)=> {
    $.get( "apiTest.php", { id, tags: imageTags, nextPrev: 'prev' }, function( href ) {
		fetch(href)
        .then(response=>response.text())
        .then(page=>{
            let parsedPage = parse(page)
            let parsedVideo = parsedPage.querySelector("#gelcomVideoPlayer")
            let {src} = parsedVideo.children[0]
            let nextId = page.match(/(?<=id:)\d*/)[0]
            let {poster}= parsedVideo
            callback({src, nextId, poster})
        })
	});

}
let currentId = (new URLSearchParams(location.search)).get("id")
video.addEventListener("ended",()=>{
    getVideoSrc(currentId, ({src, nextId, poster})=>{
        currentId = nextId
        video.poster = poster
        video.src = src
        loadVideo()
    })
})
let loadVideo = () => {
    if(!document.fullscreenElement) video.requestFullscreen()
    video.loop = false
    video.play()
}
premium.onclick=()=>{
    premium.style.color = "red"
    premium.onclick = ()=>{}
    loadVideo()
}