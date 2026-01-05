// ==UserScript==
// @name        RES twitter expandos
// @namespace   com.example
// @description Formats embedded tweets. RES cannot do this for technical and security reasons.
// @match       https://*.reddit.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17908/RES%20twitter%20expandos.user.js
// @updateURL https://update.greasyfork.org/scripts/17908/RES%20twitter%20expandos.meta.js
// ==/UserScript==

"use strict";

/**
 * loadTwitterScript(): void
 * Adds the twitter script that was stripped by RES to the given node.
 */
function loadTwitterScript(node) {
  node.style.display = 'none';
  let script = document.createElement('script');
  script.src = 'https://platform.twitter.com/widgets.js';
  node.appendChild(script);
}

/**
 * observeForTwits(target: HTMLElement): void
 * Attaches a MutationObserver to target and loads twitter's js whenever it finds a tweet.
 */
function observeForTwits(target) {
  let observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.className == 'twitter-tweet') {
          loadTwitterScript(node);
        }
      }
    }
  });

  // configuration of the observer:
  let config = { childList: true, subtree: true };

  // pass in the target node, as well as the observer options
  observer.observe(target, config);
}

observeForTwits(document.body);