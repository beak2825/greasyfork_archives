// ==UserScript==
// @name         YouTube Search Results CleanUp
// @icon         https://i.postimg.cc/mg5spQGd/yt-search-cleanup-logo-64x.png
// @namespace    adtitas
// @version      1.0.0
// @description  Refine search results by removing unrelated content such as 'People also watched', 'For you' & 'Reels' ensuring a focused and relevant video search experience.
// @include      http://youtube.com/*
// @include      https://youtube.com/*
// @include      http://*.youtube.com/*
// @include      https://*.youtube.com/*
// @grant        none
// @author       adtitas
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486616/YouTube%20Search%20Results%20CleanUp.user.js
// @updateURL https://update.greasyfork.org/scripts/486616/YouTube%20Search%20Results%20CleanUp.meta.js
// ==/UserScript==

(function() {
    let styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(`
    .ytd-search ytd-shelf-renderer,
    .ytd-search ytd-reel-shelf-renderer,
    .ytd-search ytd-horizontal-card-list-renderer,
    .ytd-search ytd-search-pyv-renderer,
    #spinner-container {
      display: none !important;
    }

    .ytd-search:hover .ytd-shelf-renderer,
    .ytd-search:hover .ytd-reel-shelf-renderer,
    .ytd-search:hover .ytd-horizontal-card-list-renderer,
    .ytd-search ytd-search-pyv-renderer,
    .ytd-search:hover #spinner-container {
      display: block !important;
    }
  `));
    (document.querySelector("head") || document.documentElement).appendChild(styleNode);

    let spinnerContainer = document.getElementById("spinner-container");
    if (spinnerContainer) {
        spinnerContainer.parentNode.removeChild(spinnerContainer);
    }
})();