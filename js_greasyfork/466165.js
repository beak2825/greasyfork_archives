// ==UserScript==
// @name         Youtube hide spoilers
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Blurs videos on YT which titles match a filter
// @author       RedMed
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/466165/Youtube%20hide%20spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/466165/Youtube%20hide%20spoilers.meta.js
// ==/UserScript==

// This is a list of filters
// When any single RegExp matches the title of the video, the video will be blurred in the recomendations/subscribtions
const spoilerFilters = [/Tears (of)|(a) the Kingdom/i, /BOTW 2/i, /TOTK/i]
// How often the script checks for spoilers in milliseconds.
const checkEvery = 3000;

function checkVideoText(text) {
  for (let fil of spoilerFilters) {
    if (text.search(fil) != -1) {
      return true;
    }
  }
  return false;
}


function removeBetween(element) {
  let parrent = element.parentNode;
  let removedElement = parrent.removeChild(element);
  let firstChild = element.firstChild;
  for (let child of removedElement.children) {
    if (firstChild !== null) {
      parrent.insertBefore(child, parrent.firstChild);
    } else {
      parrent.appendChild(child);
    }
  }
}


function insertBetween(element, newElement) {
  let parrent = element.parentNode;
  let nextSibling = element.nextElementSibling;
  let removedElement = parrent.removeChild(element);
  newElement.appendChild(removedElement);
  if (nextSibling !== null) {
    parrent.insertBefore(newElement, nextSibling);
  } else {
    parrent.appendChild(newElement);
  }
}

function despoilVideo(element, hideComplete, extraStyles = undefined) {
  if (element.querySelector(".spoiler-hider") != undefined || element.parentNode.className === "spoiler-hider") {
    return;
  }
  let hiderElement = document.createElement("div");
  hiderElement.className = "spoiler-hider";
  if (extraStyles !== undefined) {
    hiderElement.style.cssText = extraStyles;
  }
  if (hideComplete) {
    while (element.firstChild !== null) {
        hiderElement.appendChild(element.removeChild(element.firstChild));
    }
    element.appendChild(hiderElement);
    return;
  }
  let toHideElement = element.querySelector("." + element.tagName.toLowerCase());
  if (toHideElement === null) {
    let removedElement = element.removeChild(element.firstChild);
    hiderElement.appendChild(removedElement);
    element.appendChild(hiderElement);
  } else {
    insertBetween(toHideElement, hiderElement);
  }
}

function despoilVideos(videos, hideComplete = false, extraStyles = undefined) {
  for (let videoElement of videos) {
    if (!checkVideoText(videoElement.innerText)) {
      continue;
    }
    despoilVideo(videoElement, hideComplete, extraStyles);
  }
}

function removeSpoilerHiders() {
  for (let element of document.getElementsByClassName("spoiler-hider")) {
    removeBetween(element);
  }
}

let lastHref = document.location.href;
let doDespoil = true;

window.onload = function() {
  // Add observer that checks if the href changed, and then removes all spoiler hiders
  const body = document.getElementsByTagName("body")[0];
  var observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (lastHref != document.location.href) {
        lastHref = document.location.href;
        doDespoil = false;
        setTimeout(() => {
          removeSpoilerHiders();
          doDespoil = true
        }, 800);
        break;
      }
    }
  });
  observer.observe(body, {
      childList: true,
      subtree: true
  });
  // Add hider styles
  const styleElement = document.createElement("style");
  styleElement.textContent = `
  .spoiler-hider {
    filter: blur(8px);
    transition: filter 1s ease-in-out;
  }

  .spoiler-hider:hover, .spoiler-hider:active, .spoiler-hider:focus-within, .ytp-ce-element:hover > .spoiler-hider, .ytp-ce-element:active > .spoiler-hider {
    filter: none;
  }
  `
  body.appendChild(styleElement);
  // Despoil videos periodically
  setInterval(() => {
    if (!doDespoil) return;
    despoilVideos(document.getElementsByTagName("ytd-video-renderer"));
    despoilVideos(document.getElementsByTagName("ytd-grid-video-renderer"));
    despoilVideos(document.getElementsByTagName("ytd-rich-item-renderer"));
    despoilVideos(document.getElementsByTagName("ytd-compact-video-renderer"));
    despoilVideos(document.getElementsByTagName("ytd-two-column-browse-results-renderer"));
    despoilVideos(document.getElementsByClassName("ytp-ce-element"), true, "position: absolute; right: 0px; top: 0px; bottom: 0px; left: 0px;");
    despoilVideos(document.getElementsByTagName("ytm-rich-item-renderer"));
    despoilVideos(document.getElementsByTagName("ytm-video-with-context-renderer"));
  }, checkEvery);
};