// ==UserScript==
// @name         YouTube Auto Like
// @namespace    http://tampermonkey.net/
// @version      1.26
// @description  Automatically likes a video or livestream on YouTube
// @author       Yukiteru
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @require      https://greasyfork.org/scripts/470224-tampermonkey-config/code/Tampermonkey%20Config.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482555/YouTube%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/482555/YouTube%20Auto%20Like.meta.js
// ==/UserScript==

function printLog(message) {
  console.log(`[YouTube Auto Like]: ${message}`);
}

const config_desc = {
  ratio: {
    name: "Like after percentage",
    processor: "int",
    value: 50,
    min: 1,
    max: 100,
  },
  livestream: {
    name: "Auto like livestreams",
    input: "current",
    processor: "not",
    formatter: "boolean",
    value: true,
  },
  only_sub: {
    name: "Only like subscribed channels",
    input: "current",
    processor: "not",
    formatter: "boolean",
    value: true,
  },
};
const config = new GM_config(config_desc);

function getLikeButton() {
  return document.querySelector("like-button-view-model button");
}

function getVideo() {
  return document.querySelector("video.html5-main-video");
}

function isLiked() {
  return getLikeButton().getAttribute("aria-pressed") === "true";
}

function isSubscribed() {
  const subscribeButton = document.querySelector("ytd-subscribe-button-renderer");
  return subscribeButton.hasAttribute("subscribed");
}

function shouldLike() {
  if (isSubscribed()) return true;
  return !config.get('only_sub');
}

function isLivestream() {
  const liveBadge = document.querySelector(".ytp-live");
  return liveBadge !== null;
}

function like() {
  if (isLiked()) printLog("user liked manually");
  else getLikeButton().click();
  getVideo().removeEventListener("timeupdate", listener);
}

function listener() {
  const video = getVideo();
  const percentage = config.get('ratio') / 100;
  if (video.currentTime / video.duration > percentage && shouldLike()) {
    like(video);
  }
}

function findLikeButton() {
  const observer = new MutationObserver((mutations, observer) => {
    const likeButton = getLikeButton();
    if (!likeButton) return;

    printLog("like button checked");
    observer.disconnect();

    if (!shouldLike()) return false;
    if (isLivestream() && shouldLike() && config.get('livestream') === true) return like(); // like and exit if this is a livestream

    getVideo().addEventListener("timeupdate", listener);
  });
  observer.observe(document, { childList: true, subtree: true });
}

document.addEventListener("yt-navigate-finish", findLikeButton);
