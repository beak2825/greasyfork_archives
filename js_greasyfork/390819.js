// ==UserScript==
// @name         sakugabooru preview
// @namespace    https://github.com/KisaragiAyano/web-scripts
// @version      0.1.1
// @description  Preview sukugabooru video like pXXXhub.
// @author       Niku Kikai, Loïc
// @match        https://www.sakugabooru.com/post
// @match        https://www.sakugabooru.com/post?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390819/sakugabooru%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/390819/sakugabooru%20preview.meta.js
// ==/UserScript==

'use strict';

function foo(){
    var video = document.createElement("VIDEO");
    video.style.position = "relative";
    video.style.top = "0";
    video.autoplay = "true";
    video.muted = "true";
    video.loop = "true";
    video.onerror = _onerror;

    var posts = document.getElementById("post-list-posts").children;
    var formats = ['mp4','mkv','webm'];
    for (var i = 0; i < posts.length; i++) {
        var thumb = posts[i].getElementsByClassName("thumb")[0];
        var direct_link = posts[i].getElementsByClassName("directlink")[0];
        var splitted_url = direct_link.href.split(".");
        if (formats.indexOf(splitted_url[splitted_url.length-1]) > -1) {
            thumb.addEventListener('mouseenter', _mouseenter);
            thumb.addEventListener('mouseleave', _mouseleave);
        }
    }

    function _mouseenter(e){
        var thumb = e.srcElement;
        let preview_img = thumb.getElementsByClassName("preview")[0];
        video.width = preview_img.width;
        video.height = preview_img.height;
        var src = preview_img.src.substr(0, preview_img.src.length-4).replace("preview/","");

        video.src = src + ".mp4";
        stop = false;
        crttime = 0;
        thumb.appendChild(video);
        video.style.display = "block";
        preview_img.style.display = "none";
    }

    function _mouseleave(e){
        stop = true;
        video.pause();
        var thumb = e.srcElement;
        var preview_img = thumb.getElementsByClassName("preview")[0];
        preview_img.style.display = "block";
        video.style.display = "none";
    }

    function _onerror(e){
        video.src = video.src.substr(0, video.src.length-4) + ".webm";
        video.load();
    }

    var crttime = 0;
    var stop = true;
    var timer = function(){
        if (video.readyState > 1 && !stop){ //HAVE_CURRENT_DATA
            // play whole video in 5 sec (max)
            var inc = video.duration/2 / 5;
            if (inc < 1) inc = 1;
            crttime = (crttime + inc) % video.duration;
            video.currentTime = crttime;
        }
    };

    setInterval(timer, 500);
}

foo();