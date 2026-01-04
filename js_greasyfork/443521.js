// ==UserScript==
// @name         Youtube Shorts Blocker For Mobile
// @namespace    https://www.anosher.com/
// @version      0.1
// @description  It Blocks Youtube Shorts on mobile
// @author       Anosher
// @match        https://m.youtube.com/*
// @icon         https://raw.githubusercontent.com/anosher/Youtube-shorts-blocker-extension/main/icons/logo_128x128.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443521/Youtube%20Shorts%20Blocker%20For%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/443521/Youtube%20Shorts%20Blocker%20For%20Mobile.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function () {
    "use strict";
  
    // Your code here...
  
 let delay = 500; //1000 = 1 sec

  function removeShortsVideos() {
    let output = [];
    let regex = /\/shorts\/*/g;
    for (let i of document.querySelectorAll("*")) {
      if (regex.test(i.href)) {
        output.push(i);
        var bruh = i.parentNode;
        bruh.remove();
      }
    }
  }

  function redirectShortsPlayer() {
    let shortsPlayer = document.getElementsByClassName(".sticky-player");
    let shortsPlayerParent;
    if (shortsPlayer) shortsPlayerParent = shortsPlayer;

    if (document.getElementsByClassName("page-shorts").length > 0) {
      // shortsPlayerParent.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      window.location.replace("https://youtu.be/AIJLuBc5P-o");
    }
  }

  function removeShortsTab() {
    let shortsTab = document.querySelector("div.pivot-shorts");

    if (shortsTab) {
      shortsTab.parentElement.remove();
    }
  }


  var interval = setInterval(function () {
    removeShortsTab()
    removeShortsVideos();
    redirectShortsPlayer();
  }, delay);
})();