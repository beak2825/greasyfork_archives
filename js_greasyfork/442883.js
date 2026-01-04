// ==UserScript==
// @name         Youtube Shorts Blocker
// @namespace    https://www.anosher.com/
// @version      1.0.4
// @description  It Blocks Youtube Shorts
// @author       Anosher
// @match        https://www.youtube.com/*
// @icon         https://raw.githubusercontent.com/anosher/Youtube-shorts-blocker-extension/main/icons/logo_128x128.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442883/Youtube%20Shorts%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/442883/Youtube%20Shorts%20Blocker.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function () {
    "use strict";
  
    // Your code here...
  
    let delay = 1000; //1000 = 1 sec

  //removes shorts from side panel
  setTimeout(() => {
    let element = document.querySelectorAll("#endpoint");
    let nonExistentFirstElement = element[2];
    if (nonExistentFirstElement) nonExistentFirstElement.remove();
  }, delay * 2);

  function removeShortsVideos() {
    let output = [];
    let regex = /\/shorts\/*/g;
    for (let i of document.querySelectorAll("*")) {
      if (regex.test(i.href)) {
        output.push(i);
        var bruh = i.parentElement;
        bruh.parentElement.remove();
      }
    }
  }

  function redirectShorts() {
    let shortsPlayer = document.getElementById("shorts-player");
    let shortsPlayerParent;
    if (shortsPlayer) shortsPlayerParent = shortsPlayer.parentElement;
    if (shortsPlayerParent != undefined || null) {
      // shortsPlayerParent.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      window.location.replace("https://youtu.be/AIJLuBc5P-o");
    }
  }

  function removeShorts() {
    removeShortsVideos();

    redirectShorts();
  }

  var interval = setInterval(function () {
    removeShorts();
  }, delay);
})();