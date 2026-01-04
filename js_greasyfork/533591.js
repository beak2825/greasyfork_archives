// ==UserScript==
// @name        YouTube add to Watch Later shortcut
// @namespace   https://greasyfork.org/en/users/1436613-gosha305
// @match       https://www.youtube.com/*
// @license     MIT
// @version     1.0
// @author      gosha305
// @description Simply Alt-Click a video in the YouTube recommendations to immediately add it to Watch Later.
// @downloadURL https://update.greasyfork.org/scripts/533591/YouTube%20add%20to%20Watch%20Later%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/533591/YouTube%20add%20to%20Watch%20Later%20shortcut.meta.js
// ==/UserScript==


document.addEventListener("click", function(event){
  if (event.altKey) {
    event.preventDefault()
    event.stopImmediatePropagation();
    clickOnWatchLater(findVideoContainer(event.target))
  }
}, true)

function findVideoContainer(target){
  return (target.closest("#dismissible") || document.querySelector(`[href=\'${target.closest("#media-container-link").getAttribute("href")}\']`).closest("#dismissible"))
}

function clickOnWatchLater(element){
  (new MutationObserver(function(_,observer){
    const watchLaterButton = document.querySelector("ytd-popup-container ytd-menu-service-item-renderer:nth-of-type(2)");
    if (watchLaterButton){
      watchLaterButton.click()
      observer.disconnect()
    }
  })).observe(document.querySelector("ytd-popup-container"), {subtree: true, attributes:true})
  element.querySelector("#button.ytd-menu-renderer > button").click()
}