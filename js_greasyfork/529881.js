// ==UserScript==
// @name         Media only mode for Twitter X & Bluesky
// @namespace    https://github.com/xcloudx01
// @version      1.02
// @description  Removes all text from tweets, leaving only the pictures & videos.
// @author       xcloudx01
// @match        https://twitter.com/*
// @match        https://twitter.com/i/timeline
// @match        https://twitter.com/*/status/*
// @match        https://x.com/*
// @match        https://x.com/i/timeline
// @match        https://x.com/*/status/*
// @match        https://bsky.app/*
// @exclude      https://twitter.com/messages/*
// @exclude      https://x.com/messages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529881/Media%20only%20mode%20for%20Twitter%20X%20%20Bluesky.user.js
// @updateURL https://update.greasyfork.org/scripts/529881/Media%20only%20mode%20for%20Twitter%20X%20%20Bluesky.meta.js
// ==/UserScript==


function get_deletable_elements() {
  let postTextelements = document.querySelectorAll('[data-testid="tweetText"], [data-testid="tweet-text-show-more-link"], [data-testid="postText"]');
  let postQuoteelements = Array.from(
    document.querySelectorAll('.css-146c3p1.r-8akbws.r-krxsd3.r-dnmrzs.r-1udh08x.r-1udbk01')
  ).filter(element => element.textContent.trim() !== '') // Bluesky
  return [...postTextelements, ...postQuoteelements]
}


function delete_target_elements() {
  let deletable_elements = get_deletable_elements()
  if (deletable_elements.length > 0) {
    for(let i=0; i<deletable_elements.length; i++) {
        deletable_elements[i].remove()
      }
  }
}



// MAIN
// TODO: Make this an observer instead of a loop for optomization.
function mainLoop() {
    setTimeout(function() {
        let currentUrl = window.location.href
        if (!currentUrl.includes("notifications") && !currentUrl.includes("status") && !currentUrl.includes("messages")) {
          delete_target_elements()
        }
        mainLoop()
    }, 50) // <- too high causes scrolling down to stutter back upwards.
}

mainLoop()