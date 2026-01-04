// ==UserScript==
// @name        Youtube Video Quality
// @version     1.0
// @grant       none
// @match       https://www.youtube.com/*
// @run-at      document-start
// @author      Gamsteron
// @description Disabling auto video quality
// @no-frames
// @namespace https://greasyfork.org/en/users/226529
// @downloadURL https://update.greasyfork.org/scripts/374466/Youtube%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/374466/Youtube%20Video%20Quality.meta.js
// ==/UserScript==

const QUALITIES =  ['auto', 'highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
const QUALITY_MEDIUM = QUALITIES[8];
const QUALITY_LARGE = QUALITIES[7];

function SetQuality() {
    console.log("quality changed to: " + QUALITY_LARGE);
    //console.log(document.getElementById("movie_player").innerHTML);
    document.getElementById("movie_player").setPlaybackQualityRange(QUALITY_LARGE);
}

setTimeout(SetQuality, 2000);
setInterval(SetQuality, 2000);