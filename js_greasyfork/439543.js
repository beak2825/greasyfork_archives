// ==UserScript==
// @name         OnePiece
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  OnePiece1
// @author       You
// @match        https://www.yinghuadongman.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yinghuadongman.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439543/OnePiece.user.js
// @updateURL https://update.greasyfork.org/scripts/439543/OnePiece.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = startup;
    //setTimeout(configBtn, 2000)


    // Your code here...
})();
function startup() {
    getIframe();
}

function getIframe() {
    let iframe1 = document.getElementById("cciframe");
    let iframe2 = iframe1.contentWindow.document.getElementById("player").children[0];
    let xj = iframe2.contentWindow.document.getElementsByClassName("icon-xj")[0];

    xj.onclick = function(){window.location.href = getUrl()}

    // get video tag
    let videoTag = iframe2.contentWindow.document.getElementsByTagName("video")[0]
    videoTag.playbackRate = 1.5;
    videoTag.currentTime = 150;

    let fullscreen = iframe2.contentWindow.document.getElementsByClassName("yzmplayer-full-icon")[0]


    window.addEventListener("load", function(){
        GM_setValue("videoTime", videoTag.currentTime);
        console.log("video")
    })
}

function getUrl() {
    let url = window.location.href;
    const myArray = url.split("-");
    const a = myArray[2].split(".");
    a[0]--;

    url = "https://www.yinghuadongman.tv/play/1-0-" + a[0] +".html"

    return url
}