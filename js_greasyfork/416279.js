// ==UserScript==
// @name         Hard Sub Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to block hard coded subs
// @author       Kamui7
// @match       https://mcloud2.to/embed/*
// @match       https://streamtape.com/*
// @match       https://www.mp4upload.com/*
// @match       https://vidstream.pro/*


// @downloadURL https://update.greasyfork.org/scripts/416279/Hard%20Sub%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/416279/Hard%20Sub%20Blocker.meta.js
// ==/UserScript==
const blockSubs = () => {
     let x = 30;
    let y = 119;
    let width = 240;
    let height = 26;

    let video = document.querySelector("video");
    let div = document.createElement("canvas");
    div.style.position = "absolute";
    div.style.width = "100%";
    div.style.height = "100%";
    div.position = "absolute";

    div.id = "paintpad";

    video.parentNode.insertBefore(div, video.nextSibling);

    let canvas = document.querySelector("#paintpad");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(x, y, width, height);
}
setTimeout(blockSubs, 2000)