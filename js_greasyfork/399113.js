// ==UserScript==
// @name         Linux Academy Theater Mode
// @namespace    https://linuxacademy.com
// @version      1.0.0
// @description  Maximizes the Video width of Linux Academy Videos
// @author       Andy D
// @match        https://linuxacademy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399113/Linux%20Academy%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/399113/Linux%20Academy%20Theater%20Mode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const videoContainer = ['video-lesson-container']
  const videoSidebarClasses = ['video-sidebar']

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function pageload() {
      await sleep(5000);
      main()
  }

  const main = function() {
      console.log("Userscript 'Linux Academy Theater Mode' Active")
      // Maximize videoContainer div
      videoContainer.forEach(element => {
          let thisElement = document.getElementsByClassName(element)[0]
          thisElement.style.width = "100%";
          thisElement.style.padding = "0";
      })

      // Minimize Video Sidebar
      videoSidebarClasses.forEach(element => {
          let thisElement = document.getElementsByClassName(element)[0]
          thisElement.classList.add("minimize");
      })
  }

  pageload();
})();