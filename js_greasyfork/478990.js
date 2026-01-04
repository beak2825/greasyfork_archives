// ==UserScript==
// @name         Youtube - Resume
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Automatically start videos from where it stopped.
// @author       hacker09
// @match        https://*.youtube.com/embed/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/478990/Youtube%20-%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/478990/Youtube%20-%20Resume.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector('video').addEventListener('timeupdate', function() { //When the video is playing
    if (this.currentTime >= 5) { //If 5 or more secs have passed
      GM_setValue(ytcfg.data_.VIDEO_ID === undefined ? document.querySelector('[video-id]').getAttribute('video-id') : ytcfg.data_.VIDEO_ID,{ "Last_Watched": new Date().getTime(), "StoppedAt": parseInt(this.currentTime)}); //Save the watched time
    } //Finishes the if condition
  }); //Finishes the Resume function

  GM_listValues().forEach(function(VidIDs) { //ForEach saved watched video time
    if ((GM_getValue(VidIDs, {}).Last_Watched) < (new Date().getTime() - 30 * 24 * 60 * 60 * 1000)) { //If 30+ days passed since the video was watched
      GM_deleteValue(VidIDs); //Delete the old saved watched video time
    }}); //Finishes the ForEach loop

  window.addEventListener('popstate', function() { document.querySelector('video').currentTime = GM_getValue(ytcfg.data_.VIDEO_ID === undefined ? document.querySelector("meta[itemprop='identifier']").content : ytcfg.data_.VIDEO_ID, {}).StoppedAt; }); //Save the watched time if the video url changes
  setTimeout(function() { //Starts the settimeout function
    document.querySelector('video').currentTime = GM_getValue(ytcfg.data_.VIDEO_ID === undefined ? document.querySelector("meta[itemprop='identifier']").content : ytcfg.data_.VIDEO_ID, {}).StoppedAt; //Auto Resume the video onload
  }, 2000); //Auto resume video after 2 secs
})();