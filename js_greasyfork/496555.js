// ==UserScript==
// @name        Hide Twitter Crap
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.0
// @author      turtlebasket
// @run-at      document-idle
// @license     MIT
// @description Hide noise on Twitter ("Who to follow", etc)
// @downloadURL https://update.greasyfork.org/scripts/496555/Hide%20Twitter%20Crap.user.js
// @updateURL https://update.greasyfork.org/scripts/496555/Hide%20Twitter%20Crap.meta.js
// ==/UserScript==


// https://stackoverflow.com/a/61511955
function waitForEl(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


for (let label of [
  '[aria-label="Premium"]',
  '[aria-label="Trending"]',
]) {
  waitForEl(label).then((el) => {
    el.style.display = 'none';
  })
}

// draft:
// hide "what's happening", "who to follow", etc; this attempts to leave the searchbar intact

// waitForEl('[aria-label="Trending"]').then((trendingEl) => {
//   let trendingContainerEls = trendingEl.childNodes[0].childNodes;
//   console.log(trendingContainerEls)
//   for (let elIndex of [2, 3]) {
//     trendingContainerEls[elIndex].style.display = 'none';
//   }
// })

