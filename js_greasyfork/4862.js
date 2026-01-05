// ==UserScript==
// @name         YouTube Stop AUTOPLAY (OBSOLETE)
// @namespace    http://www.diamonddownload.weebly.com
// @version      1.1.6
// @description  Stop videos from auto playing
// @include      *youtube.*/watch?v=*
// @copyright    2014+, RGSoftware
// @run-at       document-body
// @author       R.F Geraci
// @icon64       http://icons.iconarchive.com/icons/simekonelove/modern-web/64/youtube-icon.png
// @downloadURL https://update.greasyfork.org/scripts/4862/YouTube%20Stop%20AUTOPLAY%20%28OBSOLETE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4862/YouTube%20Stop%20AUTOPLAY%20%28OBSOLETE%29.meta.js
// ==/UserScript==

var delay = 5000;
var autoBtn = document.getElementsByClassName('yt-uix-button yt-uix-button-size-default yt-uix-button-player-controls yt-uix-button-empty yt-uix-button-has-icon toggle-autoplay yt-uix-button-opacity yt-uix-tooltip yt-uix-tooltip yt-uix-button-toggled')[0];

setTimeout(function(){
    if (autoBtn != undefined){
        autoBtn.click();
    }
}, delay);
