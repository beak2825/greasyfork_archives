// ==UserScript==
// @name         Bili播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站播放快捷键：倍速(C-加,X-减,Z-原)，全屏(Q-宽,W-网全,E-全)
// @author       Galois
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/466084/Bili%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/466084/Bili%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    // @require      file://d:\A_Code\Tampermonkey\bili.js
    'use strict';
    // document.querySelector('video').playbackRate = 1.5; 
    // $('bwp-video')[0].playbackRate = 5;

    let $video = $('video');
    if (!$video[0]) {
        $video = $('bwp-video');
    }
    let vd = $video[0];
    keyDown(vd);
})();

function showspeed(rate) {
    let mbox = $("<div></div>");
    let oth = $(".bpx-player-video-perch"); // bpx-player-video-perch   bpx-player-video-area
    mbox.css({
        "width":100,
        "height":50,
        "background":"gray",
        "position":"absolute",
        "text-align":"center",
        "line-height":"50px",
        "z-index":100,
        "top":"80%",
        "color":"white",
        "font-size":"20px",
        "font-weight":"bold",
        // "opacity":1,
    });
    oth.prepend(mbox);
    mbox.html(rate);
    setTimeout(()=>{
        mbox.remove();
    },700);
}

function su(vd) { // speed up  C
    if (vd.playbackRate < 10) {
        vd.playbackRate += 0.5;
    }
    showspeed(vd.playbackRate);
}

function sd(vd) { // speed down  X
    if (vd.playbackRate > 0.5) {
        vd.playbackRate -= 0.5;
    }
    showspeed(vd.playbackRate);
}

function s1(vd) { // speed 1x  Z
    vd.playbackRate = 1;
    showspeed(vd.playbackRate);
}

function toggleWideScreen(e) { //宽屏  Q
    $(".bpx-player-ctrl-btn.bpx-player-ctrl-wide").click();
    noPropagation(e);
}
function toggleWebFullScreen(e) { //网页全屏  W
    $(".bpx-player-ctrl-btn.bpx-player-ctrl-web").click();
    noPropagation(e);
}
function toggleFullScreen(e) { //全屏  E
    $(".bpx-player-ctrl-btn.bpx-player-ctrl-full").click();
    noPropagation(e);
}

function noPropagation(e) {

    e.preventDefault();
    e.stopPropagation();

    return false;
}

function keyDown(vd) {
    // console.log(vd[0])
    $(document).keydown(function(e) {
        switch(e.keyCode) {
            case KEY.Q:
                toggleWideScreen(e);
                break;
            case KEY.W:
                toggleWebFullScreen(e);
                break;
            case KEY.E:
                toggleFullScreen(e);
                break;
            case KEY.Z:
                s1(vd);
                break;
            case KEY.X:
                sd(vd);
                break;
            case KEY.C:
                su(vd);
                break;
            default:
                break;
        }
    });
}

const KEY = {
    Q : 81,
    W : 87,
    E : 69,
    Z : 90,
    X : 88,
    C : 67,
}