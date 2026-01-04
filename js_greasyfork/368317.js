// ==UserScript==
// @name         Auto high quality rapidvideo video
// @namespace    https://greasyfork.org/users/119029
// @version      0.1
// @description  Auto play high quality rapidvideo video
// @author       McPeace
// @match        *://www.rapidvideo.com/*
// @downloadURL https://update.greasyfork.org/scripts/368317/Auto%20high%20quality%20rapidvideo%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/368317/Auto%20high%20quality%20rapidvideo%20video.meta.js
// ==/UserScript==
var newsrc = "";
var oldsrc = window.location.href;
if (window.location.href.indexOf("&q") == -1){
    if (document.querySelector('a[href*="1080p"]') !== null ){
        newsrc = "&q=1080p";
    } else if (document.querySelector('a[href*="720p"]') !== null ){
        newsrc = "&q=720p";
    } else if (document.querySelector('a[href*="480p"]') !== null ){
        newsrc = "&q=480p";
    } else if (document.querySelector('a[href*="360p"]') !== null ){
        newsrc = "&q=360p";
    }
    window.location.href = oldsrc + newsrc;
}