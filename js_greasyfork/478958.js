// ==UserScript==
// @name         Change Disney+ Subtitles Style
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script auto-modifies the style of Disney+ subtitles to make them similar to those on Netflix, and it is recommended that you install "Netflix Sans" fonts.
// @author       wayneclub
// @license MIT
// @match        https://www.disneyplus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=disneyplus.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478958/Change%20Disney%2B%20Subtitles%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/478958/Change%20Disney%2B%20Subtitles%20Style.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let processedURLs = [];

  function checkURL() {
    if (window.location.href.match(/https:\/\/www.disneyplus.com\/.+\/video\//) &&
      !processedURLs.includes(window.location.href)
    ) {
      var styleSheet = document.styleSheets[0];
      styleSheet.insertRule(
        ".dss-subtitle-renderer-cue { text-shadow: #000 0px 0px 7px !important; font-family: Netflix Sans,Helvetica Nueue,Helvetica,Arial,sans-serif !important; font-weight: bolder !important; }",
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