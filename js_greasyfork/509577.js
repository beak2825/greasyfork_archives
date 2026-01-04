// ==UserScript==
// @name         9gag NSFW unblock (temp fix for mobiles)
// @namespace    https://greasyfork.org/en/users/715695-unblock
// @version      0.5.1
// @description  Unblock NSFW without account
// @author       Unblock
// @match        https://9gag.com/*
// @icon         https://icons.duckduckgo.com/ip2/9gag.com.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509577/9gag%20NSFW%20unblock%20%28temp%20fix%20for%20mobiles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509577/9gag%20NSFW%20unblock%20%28temp%20fix%20for%20mobiles%29.meta.js
// ==/UserScript==

function bootstrap() {
    'use strict';
    const baseUrl = "https://img-9gag-fun.9cache.com/photo/";

    function setChild(container, post) {
        container.firstElementChild.replaceWith(post);
    }

    function tryVideo(id, container) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.poster = baseUrl + id + "_460s.jpg";

        const srcAV1 = document.createElement("source");
        srcAV1.src = baseUrl + id + "_460svav1.mp4";
        srcAV1.type = "video/mp4; codecs=\"av01.0.00M.08, opus\"";
        video.appendChild(srcAV1);

        const srcVP9 = document.createElement("source");
        srcVP9.src = baseUrl + id + "_460svvp9.webm";
        srcVP9.type = "video/mp4; codec=\"vp9, opus\"";
        video.appendChild(srcVP9);

        const srcMP4 = document.createElement("source");
        srcMP4.src = baseUrl + id + "_460sv.mp4";
        srcMP4.type = "video/mp4";
        video.appendChild(srcMP4);

        video.controls = true;
        //  video.autoplay = true;
        //  video.muted = true;
        video.onloadedmetadata = function () {
            //    console.log("NSFW MP4");
            setChild(container, video);
        }
    }

    function tryImage(id, container) {
        const picture = document.createElement("picture");
        const source = document.createElement("source");
        source.srcset = baseUrl + id + "_460swp.webp";
        source.type = "image/webp";
        picture.appendChild(source);
        const img = document.createElement("img");
        img.src = baseUrl + id + "_460s.jpg";
        img.loading = "lazy";
        picture.appendChild(img);
        setChild(container, picture)
    }

    var mobile = true;
    var desktop = true;

    function clearPosts() {
        if (true) {
            var nsfw_desktop = document.querySelectorAll("div.post-view.post-sensitive-mask");
            for (var post of nsfw_desktop) {
                mobile = false;
                const container = post.parentElement;
                const id = container.parentElement.id.slice(10);

                tryImage(id, container);
                tryVideo(id, container);
            }
        }

        if (true) {
            var nsfw_mobile_photo = document.querySelectorAll("article.post-cell.photo div.post-sensitive-mask");
            var nsfw_mobile_video = document.querySelectorAll("article.post-cell.video div.post-sensitive-mask, article.post-cell.gif div.post-sensitive-mask");
            for (post of nsfw_mobile_photo) {
                desktop = false;
                const container = post.parentElement;
                const id = container.parentElement.id.slice(15);
                tryImage(id, container);
            }
            for (post of nsfw_mobile_video) {
                desktop = false;
                const container = post.parentElement;
                const id = container.parentElement.id.slice(15);
                tryVideo(id, container);
            }
        }
    }

    const observer = new MutationObserver((mutations, observer) => {
        clearPosts();
    });

    const postSection = document.querySelector("div#main section#list-view-2, div.post-container");
    // todo: make better fix
    // desc: this prevent from break on mobile/android devices, retry again after .5s
    if (!postSection) {
        setTimeout(bootstrap, 500)
        return;
    }
    observer.observe(postSection, {
        childList: true
    });

    setTimeout(clearPosts, 200);
}

bootstrap();