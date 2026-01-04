// ==UserScript==
// @name         Welcome Image Changer (Kemono.su)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Changes the mascot image on kemono.su to a random one from a predefined list
// @author       Delzon
// @match        https://kemono.su/*
// @match        https://kemono.cr/*
// @copyright    2025, Delzon (https://openuserjs.org/users/Delzon)
// @license      MIT
// @run-at       document-body
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541478/Welcome%20Image%20Changer%20%28Kemonosu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541478/Welcome%20Image%20Changer%20%28Kemonosu%29.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function () {
  'use strict';

  // Inject CSS to hide the image immediately
  var style = GM_addStyle(
    `
    .jumbo-welcome-mascot img {
        visibility: hidden !important;
        opacity: 0 !important;
        transition: none !important;
    }
    `
  );

  const randomImages = [
    "https://i.bandori.party/u/asset/hXOOXlReona-Nyubara-Key-Visual-e8PBWd.png",
    "https://i.bandori.party/u/asset/PlxWU93rd-Anniversary-Kasumi-Splash-2kcZ3c.png",
    // Add more images as needed, you can set only one if you want.
  ];

  function debugLog(message) {
    console.log("[Welcome Image Changer] " + message);
  }

  function changeImage(imgElement) {
    if (!imgElement) return;

    const randomIndex = Math.floor(Math.random() * randomImages.length);
    imgElement.src = randomImages[randomIndex];

    // Restore visibility after changing the source
    if (style) {
      style.remove();
    }

    debugLog("Image changed: " + imgElement.src);
  }

  // Observer to detect the image as soon as it's added to the DOM
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList') continue;

      for (const node of mutation.addedNodes) {
        // Check if the node is the image
        if (node.nodeType === 1 && node.matches('.jumbo-welcome-mascot img')) {
          changeImage(node);
        }

        // Check if the node contains the image
        if (node.nodeType === 1 && node.querySelector) {
          const img = node.querySelector('.jumbo-welcome-mascot img');
          if (img) changeImage(img);
        }
      }
    }
  });

  // Start observing
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Initial check for cases where the image already exists
  document.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('.jumbo-welcome-mascot img');
    if (img) changeImage(img);
  });
})();
