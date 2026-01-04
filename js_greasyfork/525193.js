// ==UserScript==
// @name        RES bluesky expandos
// @namespace   com.example
// @description Formats embedded blue sky possts. RES cannot do this for technical and security reasons.
// @match       https://*.reddit.com/*
// @version     1
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525193/RES%20bluesky%20expandos.user.js
// @updateURL https://update.greasyfork.org/scripts/525193/RES%20bluesky%20expandos.meta.js
// ==/UserScript==

"use strict";

/**
 * loadBlueskyEmbedScript(): void
 * Adds the bluesky script that was stripped by RES to the given node.
 */
function loadBlueskyEmbedScript(node) {
  let script = document.createElement('script');
  script.src = 'https://embed.bsky.app/static/embed.js';
  node.appendChild(script);
}

/**
 * observeForBlueskyPosts(target: HTMLElement): void
 * Attaches a MutationObserver to target and loads bluesky's js whenever it finds a post.
 */
function observeForBlueskyPosts(target) {
  let observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.className == 'bluesky-embed') {
          loadBlueskyEmbedScript(node);
        }
      }
    }
  });

  // configuration of the observer:
  let config = { childList: true, subtree: true };

  // pass in the target node, as well as the observer options
  observer.observe(target, config);
}

observeForBlueskyPosts(document.body);