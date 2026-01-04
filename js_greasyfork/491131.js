// ==UserScript==
// @name        Simple Search Filter
// @namespace   Violentmonkey Scripts
// @match       https://search.bilibili.com/*
// @grant       none
// @version     1.0
// @author      anonfruit
// @license MIT
// @description 2024/3/29 07:06:40
// @downloadURL https://update.greasyfork.org/scripts/491131/Simple%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/491131/Simple%20Search%20Filter.meta.js
// ==/UserScript==

// TODO: Add input fields to set thresholds
const ARTICLE_LIKE_COUNT_THRESHOLD = 20;
const VIDEO_PLAY_COUNT_THRESHOLD = 1000;

// TODO: Use MutationObserver to detect changes
setInterval(function () {
  if (!location.search.includes("order=pubdate")) {
    return;
  }
  const infoList = document.querySelectorAll(".atc-info");
  const likeRegex = /(\d+)点赞/;
  for (const info of infoList) {
    const text = info.innerText;
    const match = likeRegex.exec(text);
    if (match) {
      const likeCount = parseInt(match[1]);
      if (likeCount < ARTICLE_LIKE_COUNT_THRESHOLD) {
        const item = info.parentElement.parentElement;
        item.classList.add("userscript-bilibili-filter-unimportant");
      }
    }
  }
}, 1000);

setInterval(function () {
  if (!location.search.includes("order=pubdate")) {
    return;
  }
  const statsList = document.querySelectorAll(".bili-video-card__stats--left");
  for (const stats of statsList) {
    const playCountText = stats.querySelector(".bili-video-card__stats--item").innerText.trim();
    if (!playCountText.match(/^\d+$/)) {
      continue;
    }
    const playCount = parseInt(playCountText);
    if (playCount < VIDEO_PLAY_COUNT_THRESHOLD) {
      let parent = stats.parentElement;
      while (parent && !parent.classList.contains("video-list-item")) {
        parent = parent.parentElement;
      }
      if (parent) {
        parent.classList.add("userscript-bilibili-filter-unimportant");
      }
    }
  }
}, 1000);



const style = document.createElement("style");
style.innerText = `
.userscript-bilibili-filter-unimportant {
  filter: opacity(0.3);
}
.userscript-bilibili-filter-unimportant:hover {
  filter: none;
}
`;
document.head.appendChild(style);