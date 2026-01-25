// ==UserScript==
// @name         (Deprecated)Legacy Video Quality on Crunchyroll
// @namespace    http://tampermonkey.net/
// @version      2025-08-31-Deprecated
// @description  Forces the legacy video quality settings for the video stream on crunchyroll(basically returns the option to choose 1080p,720p,480p etc..)
// @author       Some random dude from reddit
// @match        *static.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546531/%28Deprecated%29Legacy%20Video%20Quality%20on%20Crunchyroll.user.js
// @updateURL https://update.greasyfork.org/scripts/546531/%28Deprecated%29Legacy%20Video%20Quality%20on%20Crunchyroll.meta.js
// ==/UserScript==

function doStuff() {
    let configDelta;
    configDelta = localStorage.getItem('Vilos:ConfigDelta');

    console.log("Legacy Video Quality on Crunchyroll is RUNNING");
    if(!configDelta) setTimeout(function() { doStuff(); }, 200);
    else {
        if(configDelta.qualitySettings) configDelta.qualitySettings.enabled = false;
        else configDelta = JSON.parse('{"ads":{"adSystem":"GoogleAdManager","adTech":"CSAI","minimumDurationThreshold":420,"truex":true},"playbackSpeed":{"enabled":true},"qualitySettings":{"enabled":false}}');
        localStorage.setItem('Vilos:ConfigDelta', JSON.stringify(configDelta));
    }
}

doStuff();