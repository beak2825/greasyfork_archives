// ==UserScript==
// @name        auto scroll when content is added
// @namespace   Violentmonkey
// @match       https://texthooker.com/*
// @grant       none
// @version     1.0
// @author      Takemi
// @description simple scrolling when change is detected in the body of the page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542546/auto%20scroll%20when%20content%20is%20added.user.js
// @updateURL https://update.greasyfork.org/scripts/542546/auto%20scroll%20when%20content%20is%20added.meta.js
// ==/UserScript==

const container = document.querySelector("body");

if (container) {
  const observer = new MutationObserver(() => {
    container.scrollTop = container.scrollHeight;
  });

  observer.observe(container, { childList: true, subtree: true });
}
