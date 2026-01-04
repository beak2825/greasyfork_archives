// ==UserScript==
// @name        ChatGPT Direct File Upload
// @namespace   VphTvD
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.0
// @author      VphTvD
// @description Reverts to the old way of uploading files on ChatGPT
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496992/ChatGPT%20Direct%20File%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/496992/ChatGPT%20Direct%20File%20Upload.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(m) {
  m.forEach(function(item) {
    var x = item.addedNodes[0] && item.addedNodes[0].childNodes[0] && item.addedNodes[0].childNodes[0].childNodes;
    if (x && x.length == 4 && x[3].className == 'flex items-center m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group relative hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] dark:hover:bg-token-main-surface-secondary dark:focus-visible:bg-token-main-surface-secondary rounded-md my-0 px-3 mx-2 radix-state-open:bg-[#f5f5f5] dark:radix-state-open:bg-token-main-surface-secondary gap-2.5 py-3') x[3].click();
  });
});
observer.observe(document.body, { childList: true });
