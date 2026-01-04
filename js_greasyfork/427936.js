// ==UserScript==
// @name         YouTube playlist duration
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      2.0
// @description  get total duration of a playlist in an alert by pressing alt + shift + U on a playlist page.
// @author       Wis (Original), TabLand (improvements)
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427936/YouTube%20playlist%20duration.user.js
// @updateURL https://update.greasyfork.org/scripts/427936/YouTube%20playlist%20duration.meta.js
// ==/UserScript==

function doc_keyUp(e) {
  if (e.altKey && e.shiftKey && e.key == "U") {
    let num_videos_expected = document.querySelectorAll("yt-formatted-string.ytd-playlist-sidebar-primary-info-renderer > span")[0].innerText.trim()
    let num_videos_actual = document.querySelectorAll("ytd-thumbnail#thumbnail.style-scope.ytd-playlist-video-renderer").length

    if (num_videos_expected != num_videos_actual){
        alert("Only loaded " + num_videos_actual + "/" + num_videos_expected + " videos... Please scroll to the end of the page and remove private videos")
    }
    else {
        let minutes = [...document.querySelectorAll("div#contents.ytd-playlist-video-list-renderer ytd-thumbnail-overlay-time-status-renderer > span")]
        .reduce((acc, dur) => {
            dur = dur.textContent.trim().split(':');
            return acc + parseInt(dur[0]) * 60 + parseInt(dur[1]);
        }, 0) / 60;
        alert(Math.floor(minutes / 60) + " hours " + Math.ceil(minutes % 60) + " minutes.");
    }
  }
}
document.addEventListener('keyup', doc_keyUp, false);
