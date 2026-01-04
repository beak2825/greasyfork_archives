// ==UserScript==
// @name         DisneySubtitlesLikeNetflix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The script modifies the appearance of Disney+ subtitles to resemble the subtitles on Netflix. Your device must have "Netflix Sans" font installed.
// @author       xcode35
// @license MIT
// @match        https://www.disneyplus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=disneyplus.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462340/DisneySubtitlesLikeNetflix.user.js
// @updateURL https://update.greasyfork.org/scripts/462340/DisneySubtitlesLikeNetflix.meta.js
// ==/UserScript==



(function() {
    'use strict';


let processedURLs = [];

function checkURL() {
  if (
    window.location.href.startsWith(
      "https://www.disneyplus.com/tr-tr/video/"
    ) &&
    !processedURLs.includes(window.location.href)
  ) {

    console.log("URL matches pattern!");
    var styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      ".dss-subtitle-renderer-line { text-shadow: #000 0px 0px 7px; font-family: NetflixSans-Bold;  }",
      styleSheet.cssRules.length
    );

    processedURLs.push(window.location.href);
  }
}


const observer = new MutationObserver(checkURL);


observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});


checkURL();



})();