// ==UserScript==
// @name         E621 Luxury Viewer (ELV)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  View E621 posts in a full res pannel fasion
// @author       Drako Hyena
// @match        *://e621.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476031/E621%20Luxury%20Viewer%20%28ELV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476031/E621%20Luxury%20Viewer%20%28ELV%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Page restriction
    if(!window.location.href.includes("/posts?tags")){
        console.log("ELV Cannot be used on this page")
        return
    }

    // Pannel Images
    function modCss(data){
        let style = document.createElement("style")
        style.innerHTML = data
        document.head.appendChild(style)
    }
    modCss(`body.resp .user-disable-cropped-false article.post-preview img {
    width: 100% !important;
    }`)
    modCss(`body.resp .user-disable-cropped-false article.post-preview video {
    width: 100% !important;
    }`)
    modCss(`article.post-preview {
    min-width: 100% !important;
    }`)
    modCss(`article.post-preview img {
    max-height: 100% !important;
    max-width: 100% !important;
    `)
    modCss(`article.post-preview video {
    max-height: 100% !important;
    max-width: 100% !important;
    `)

    // High Res Pannels
    const isVideoURL = (url) => {
        const parts = url.split('.');
        if (parts.length > 1) {
            const extension = parts[parts.length - 1].toLowerCase();
            return ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'mpg', 'mpeg', 'webm'].includes(extension);
        }
        return false;
    };
    function hasAudio (video) {
        return video.mozHasAudio ||
            Boolean(video.webkitAudioDecodedByteCount&&video.webkitAudioDecodedByteCount>100) ||
            Boolean(video.audioTracks && video.audioTracks.length);
    }

    for(let article of document.getElementsByTagName("article")){
        let img = article.getAttribute("data-file-url")
        article.children[0].children[0].children[0].srcset = img
        article.children[0].children[0].children[1].srcset = img
        if(isVideoURL(img)){
            article.children[0].children[0].children[2].remove()
            let vid = document.createElement("video")
            vid.autoplay = true
            vid.loop = true
            vid.src = img
            vid.muted = true
            article.children[0].children[0].appendChild(vid)

            article.children[0].removeAttribute("href")
            vid.onclick = () => {
                vid.muted = !vid.muted
            }
            vid.onloadeddata = () => {
                if(hasAudio(vid)){
                    let hasAudioSpan = document.createElement("span")
                    hasAudioSpan.innerHTML = `<i>Has Audio</i>`
                    article.children[1].children[0].appendChild(hasAudioSpan)
                }
                vid.onloadeddata = undefined
            }
        }else{
            if(img.includes(".gif")) article.children[0].removeAttribute("href")
            article.children[0].children[0].children[2].src = img
        }
    }

    // Only play videos in view so we dont lag
    const videos = document.querySelectorAll('video');
    window.addEventListener('scroll', () => {
        videos.forEach((video) => {
            const rect = video.getBoundingClientRect()
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
})();