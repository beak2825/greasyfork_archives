// ==UserScript==
// @name        🚫 ShortsOff! - YouTube Shorts Remover
// @icon        https://solabs.neocities.org/assets/no_shorts!.png
// @license     GNU GPL v3.0; http://www.gnu.org/licenses/gpl-3.0.txt
// @match       https://www.youtube.com/*
// @version     1.1
// @author      Boon!
// @description Disables elements that lead to YouTube Shorts.
// @namespace https://greasyfork.org/users/1398226
// @downloadURL https://update.greasyfork.org/scripts/517805/%F0%9F%9A%AB%20ShortsOff%21%20-%20YouTube%20Shorts%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/517805/%F0%9F%9A%AB%20ShortsOff%21%20-%20YouTube%20Shorts%20Remover.meta.js
// ==/UserScript==

console.log("[ShortsOff!] Boop!")

// Remove shorts category when searching.
function removeShortsSearchCategory() {
  const elements = document.querySelectorAll('yt-formatted-string[title="Shorts"]');
  elements.forEach(element => {
    if (element) {
      element.parentElement.remove();
    }
  });
}

// Removes the shorts endpoint link at the sidebar.
function removeShortsEndpointLinks() {
  const elements = document.querySelectorAll('a[title="Shorts"]');
  elements.forEach(element => {
    if (element) {
      element.remove();
    }
  });
}

// Removes the recommended shorts at the homepage.
function removeIsShorts() {
  const elements = document.querySelectorAll('[is-shorts]');
  elements.forEach(element => {
    if (element) {
      element.remove();
    }
  });
}

// Removes the recommended shorts at the side while watching a video.
function removeYtdReels() {
  const elements = document.querySelectorAll('ytd-reel-shelf-renderer');
  elements.forEach(element => {
    if (element) {
      element.remove();
    }  });
}

// Main function
function main() {
  removeShortsEndpointLinks();
  removeIsShorts();
  removeYtdReels();
  removeShortsSearchCategory()
}

// Initialize an observer that runs the main function when an element is modified.
const observer = new MutationObserver(main);
observer.observe(document.body, { childList: true, subtree: true });
