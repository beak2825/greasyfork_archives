// ==UserScript==
// @name         TikTok Autoscroll
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Autoscroll videos on tiktok.
// @author       @Masiosare
// @match        https://tiktok.com/*
// @license      GNU GPLv3
// @match        https://www.tiktok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408321/TikTok%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/408321/TikTok%20Autoscroll.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let debug_enabled = false;
  let time_after_scroll = 0.5; //seconds

  function scrollTo(e) {

    while(e.tagName.toLowerCase() !== "body") {
      e = e.parentElement;
      if(e.className.includes("DivItemContainer")){
        err("Scrolling to")
        err(e.nextSibling)

        e.nextSibling.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        break;
      }
    }
  }
  err("Before event");
  document.addEventListener("DOMNodeInserted", function (e) {

    if (e.target && e.target.className && e.target.className.toString().includes("DivBasicPlayerWrapper")) {
      err("Found Video")

      let video = e.target.getElementsByTagName("video")[0]
      video.loop = false;
      video.muted = false;
      video.controls = true;

      video.addEventListener('ended', function (v) {
        err("Video ended");
        err(v);

        v.target.pause();
        err("Scrolling in " + time_after_scroll * 1000);
        setTimeout(function () {

          scrollTo(v.target)
        }, time_after_scroll * 1000);
      }, false);


    }

  }, false);

  function err(e){
    if (debug_enabled === true ) {
      if (typeof e == "string"){
        console.log("TT Autoscroll: "+ e)
      } else {
        console.log(e)
      }
    }
  }

})();
