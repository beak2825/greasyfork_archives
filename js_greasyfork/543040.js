// ==UserScript==
// @name         Image enlarger SCRIPT
// @namespace    http://tampermonkey.net/
// @version      2025-07-19
// @description  This script uses basic code to find the largest available image size from the websites below.
// @author       FluorescentApe
// @run-at document-start
// @match        *i.redd.it/*
// @match        *preview.redd.it/*
// @match        *://*/*
// @icon         
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543040/Image%20enlarger%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/543040/Image%20enlarger%20SCRIPT.meta.js
// ==/UserScript==

var url = document.location.toString();
var m = null;


//REDDIT
m = url.match(/^(https?:\/\/preview\.redd\.it\/)[^\/]*-([\w\d]+)(\.jpg|\.jpeg|\.png)/i);
if (m) {
    location.href = "https://i.redd.it/" + m[2] + m[3];
}

//REDGIFS
m = url.match(/^(https?:\/\/media\.redgifs\.com\/)(\w+)\-mobile\.jpg/i);
if (m){
    location.href = m[2] + ".mp4";
}

//YOUTUBE thumbnails
m = url.match(/^(https?:\/\/i\.ytimg\.com\/vi\/(?:[^\/]*-)?([\w\d]+)\/(hq720|hqdefault))\.(jpg|jpeg|png)\?/i);
if (m){
   location.href = m[1] + "." + m[4];
}

//GOOGLE PROFILE PICTURES (INCL. YOUTUBE)

const YTurl = window.location.href;

if (!YTurl.includes("=s0")){
    const m = YTurl.match(/^(https?:\/\/yt3\.ggpht\.com\/)(.+?)(-?\w+=s)(.+)$/i);
    console.log(m);
    if(m){
        const newUrl = m[1] + m[2] + m[3] + 0;
        window.location.replace(newUrl);
        //console.log(newUrl);
    }
}

// TWITCH.TV thumbnails
m = url.match(/^(https?:\/\/static-cdn\.jtvnw\.net\/previews-ttv\/live_user_)([\w\d_]+)-(\d+x\d+)\.jpg/i);
if (m) {
    if (!url.endsWith("-1920x1080.jpg")) {
        location.href = m[1] + m[2] + "-1920x1080.jpg";
    }
}