// ==UserScript==
// @name          YouTube UnShortner
// @description   Turns YouTube Shorts into normal YouTube videos
// @icon          https://www.google.com/s2/favicons?domain=www.youtube.com
// @version       1.0.0 (20/08/2023)
// @author        gt10i
// @homepage      https://github.com/gt10i
// @namespace     Violentmonkey Scripts
// @license       MIT
// @grant         none
// @run-at        document-start
// @match         https://www.youtube.com/*
// @match         https://www.youtu.be/*
// @match         https://m.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/494766/YouTube%20UnShortner.user.js
// @updateURL https://update.greasyfork.org/scripts/494766/YouTube%20UnShortner.meta.js
// ==/UserScript==

if (test(location.href)) {
  updateUrl()
}

let previousUrl = '';
let observer = new MutationObserver(function(mutations) {
  if (location.href !== previousUrl) {
      if (test(location.href)) {
        updateUrl()
      }
      previousUrl = location.href;
      console.log(`URL changed to ${location.href}`);
    }
});

observer.observe(document, { childList: true, subtree: true })

function test(url){
  var isYouTubeShortUrl = !!url.match(/^(|http(s?):\/\/)(|www.)(youtube.com|youtu.be)\/shorts(\/.*|$)/gim);

  return isYouTubeShortUrl;
}

function updateUrl(){
    window.location.replace("https://youtube.com/watch?v=" + videoIdFromUrl());
}

function videoIdFromUrl(){
    const videoIdExtractRegex = /(youtube.com|youtu.be)\/shorts\/([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]*)/gi;
    const youtubeRegex = new RegExp(videoIdExtractRegex);
    const regexResult = youtubeRegex.exec(window.location.href);
    const videoId = regexResult[2];

    return videoId;
}