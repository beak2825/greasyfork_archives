// ==UserScript==
// @name        remove_trending - twitter.com
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @grant       none
// @version     1.0
// @author      fudgepop01
// @description 2/6/2020, 10:34:31 PM
// @downloadURL https://update.greasyfork.org/scripts/396136/remove_trending%20-%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/396136/remove_trending%20-%20twittercom.meta.js
// ==/UserScript==

const deleter = () => {
  const possibilities = document.querySelectorAll("section > h1");
  let found = false;
  for (const possible of possibilities) {
    if (possible.innerText.toLowerCase() === 'trending now') {
      possible.parentNode.parentNode.parentNode.parentNode.remove();
      found = true;
      break;
    }
  }
  if (!found) requestAnimationFrame(deleter);
}

setInterval( () => {
  if (window.location.href !== window.oldHref) deleter();
  window.oldHref = window.location.href;
}, 50)
