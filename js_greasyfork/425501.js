// ==UserScript==
// @name        IP2 ENHANCER
// @description This script adds video thumbnails to IP2 and fixes various issues with video playback. Message /u/ChangThunderwang for bugs and anything related to this.
// @grant       GM_addStyle
// @version     2.3
// @match       *://ip2always.win/*
// @match       *://communities.win/*
// @namespace https://greasyfork.org/users/764563
// @downloadURL https://update.greasyfork.org/scripts/425501/IP2%20ENHANCER.user.js
// @updateURL https://update.greasyfork.org/scripts/425501/IP2%20ENHANCER.meta.js
// ==/UserScript==
"use strict";
/*jshint esversion: 6 */

if (typeof GM_addStyle !== "function") {
    var GM_addStyle = function (css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
}

// Fixes janky CSS
GM_addStyle(`
@media only screen and (min-width:973px) {
     .post-list .content , .post-list .content.text{
         margin: 8px 0 0 67px;
         padding: 0;
    }
}
@media only screen and (max-width:973px) {
     .post-list .content , .post-list .content.text{
         margin: 8px 0 0 8px;
         padding: 0;
    }
}
     body .post-list div.content.link div.inner{
         background: rgba(0,0,0,0)!important;
    }
     body {
         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
     .post-list .content , .post-list .content.text{
         margin: 8px 0 0 67px;
         padding: 0;
    }
     .post-list .content:not(.text) .inner {
         padding: 0 
    }
     .video-container.iframe-parent{
         position: relative;
         overflow: hidden;
         width: 100%;
         padding-top: 56.25%;
    }
     .video-container.iframe-parent > .responsive-iframe {
         position: absolute;
         top: 0;
         left: 0;
         bottom: 0;
         right: 0;
         width: 100%;
         height: 100%;
    }
     .video-container {
         margin: 0px;
         padding: 0px;
         overflow: inherit;
         height: auto;
    }
     .video-container video {
         max-height: calc(100vw/3);
    }
     .content img {
         display: block;
         width: auto;
         height: auto;
    }
`);

// Replaces iframes with video tags, mostly for videy.co
var ifr = document.querySelector(".main-content:not(.post-list) .video-container > iframe");
if (ifr != null) {
    if (/.+(\.mp4|\.mov|\.webm)/i.test(ifr.src)) {
        console.log('replacing');
        var src = ifr.src;
        var par = ifr.parentElement;
        ifr.remove();
        var vid = document.createElement('video');
        vid.autoplay = true;
        vid.src = src;
        vid.controls = true;
        vid.preload = 'auto';
        par.appendChild(vid);
        par.dataset.src = src;
    } else {
        ifr.classList.add('responsive-iframe');
        ifr.parentElement.classList.add('iframe-parent');
        ifr.scrolling = 'no';
    }
}

//Function to add thumbnails to videos
async function addThumbs() {
    var vidposts = document.querySelectorAll('.post:not([data-thumb-checked]) .video-container.mp4');

    if (vidposts.length == 0) {
        return;
    }

    for (var i = 0; i < Math.min(vidposts.length, 3); i++) {
        vidposts[i].parentElement.closest('.post').dataset.thumbChecked = '';
    }

    var count = 3;

    for (var i = 0; i < Math.min(vidposts.length, 3); i++) {
        var vid = vidposts[i];
        var post = vid.parentElement.closest(".post");
        var thumb = post.querySelector(".thumb");
        var videoUrl = vid.getAttribute("data-src");
        var newThumb = document.createElement('video');
        newThumb.preload = 'metadata';
        newThumb.style = 'object-fit:cover';
        newThumb.classList.add('thumb');
        newThumb.dataset.action= 'expand';

        newThumb.oncontextmenu = () => {
            return;
        };

        newThumb.src = videoUrl;
        post.insertBefore(newThumb, thumb);
        thumb.remove();
        count--;
    }

    if (count <= 0) {
        setTimeout(addThumbs, 1000);
    }
}

//Adds thumbnails upon loading and upon entering new pages
addThumbs();
if (!(typeof ias === 'undefined')) {
    ias.on("appended", addThumbs);
}

//Removes old handler for the expand buttons upon mouseover.
var once = false;

function removeOldExpander() {
    console.log('mouseover');
    if (!once) {
        $(document).off("click", '[data-action="expand"]');
        once = true;
    } else {
        document.querySelector('a[data-action="expand"], .thumb[data-action="expand"]').removeEventListener("mouseover", removeOldExpander);
    }
}

document.querySelectorAll('a[data-action="expand"], .thumb[data-action="expand"]').forEach(x => x.addEventListener("mouseover", removeOldExpander));
window.onload = function () {
    $(document).off("click", '[data-action="expand"]');
};

//Assigns new improved handler for video embeds which removes video tags upon closing
function expandHandler() {
    $(document).off("click", '[data-action="expand"]');
    var content = this.parentElement.closest(".post").querySelector(".content");
    console.log(content);

    if ("opened" in content.dataset) {
        return;
    }

    content.dataset.opened = true;
    var img = content.querySelector('img');
    var first = content.querySelector(".video-container");
    var text = content.querySelector(".inner > p");
    console.log(first);

    if (img != null && img.getAttribute("src") === "") {
        img.setAttribute("src", img.dataset.src);
        img.style.maxHeight = 'calc(100vh - 250px)';
        var sidebar = document.getElementsByClassName('sidebar')[0];
        const width  = window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth;
        if(width < 973){
            img.style.maxWidth = 'calc(100vw - 93px)';
        }
        else {
            img.style.maxWidth = 'calc(100vw - 437px)';
        }
    } else if (first != null) {
        if (!first.hasChildNodes()) {
            if (first.classList.contains("mp4") || /.+(\.mp4|\.mov|\.webm)/i.test(first.dataset.src)) {
                var vid = document.createElement('video');
                vid.style.display = 'block';
                vid.autoplay = true;
                vid.classList.add('child-video', 'child-content');
                vid.controls = true;
                vid.preload = 'auto';
                vid.src = first.dataset.src;
                first.appendChild(vid);
            } else {
                var iframe = document.createElement('iframe');
                iframe.scrolling = 'no';
                iframe.classList.add('responsive-iframe', 'child-content');
                iframe.src = first.dataset.src;
                iframe.frameborder = 0;
                iframe.allowfullscreen = true;
                first.appendChild(iframe);
                first.classList.add('iframe-parent');
            }
        }
    }

    delete content.dataset.opened;

    if (img != null) {
        delete img.dataset.src;
    }

    if (content.style.display === '' || content.style.display === 'none') {
        content.style.display = 'block';
    } else if (content.style.display === 'block') {
        content.style.display = 'none';
        var children = content.querySelector(".child-content");
        if (children != null) {
            children.remove();
        }
    }
}
function addExpandHandlers() {
    document.querySelectorAll('a[data-action="expand"]:not([data-onclick-added]), .thumb[data-action="expand"]:not([data-onclick-added])').forEach(x => {
        x.dataset.onclickAdded = '';
        x.addEventListener("click", expandHandler)
    });
}


addExpandHandlers()
if (!(typeof ias === 'undefined')) {
    ias.on("appended", addExpandHandlers);
}
