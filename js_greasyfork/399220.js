// ==UserScript==
// @name         YT 'views' as number only
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       narcolepticinsomniac#7875
// @include      /https?://www\.youtube\.com/watch\?v=.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399220/YT%20%27views%27%20as%20number%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/399220/YT%20%27views%27%20as%20number%20only.meta.js
// ==/UserScript==

new MutationObserver((_, observer) => {
  const viewCount = document.querySelector('.view-count');
  if (viewCount) {
    const viewText = viewCount.textContent.replace(/.*?(\d.*\d).*/, '$1');
    viewCount.textContent = viewText;
    observer.disconnect();
  }
}).observe(document, {childList: true, subtree: true});