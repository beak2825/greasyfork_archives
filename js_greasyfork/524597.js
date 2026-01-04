// ==UserScript==
// @name        Reddit un-cancel X
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0.1
// @author      -
// @description 1/22/2025, 10:37:06 PM
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524597/Reddit%20un-cancel%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/524597/Reddit%20un-cancel%20X.meta.js
// ==/UserScript==
//
let cancelUrls = ['xcancel.com', 'nitter.com'];
for(let url of cancelUrls) {
  let links = document.querySelectorAll(`a[href*='https://${url}']`);
  for(let link of links) {
    let originalhref = link.href;
    let newhref = originalhref.replace(`https://${url}`,"https://x.com");
    link.href = newhref;
    console.info(`Replaced ${originalhref} with ${newhref}`);
  }
}