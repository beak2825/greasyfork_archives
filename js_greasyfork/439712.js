// ==UserScript==
// @name         APC Remover
// @version      1.1.4
// @description  Removes already participated contests.
// @author       kwknm
// @namespace    contests
// @match        https://lolz.guru/forums/contests/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439712/APC%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/439712/APC%20Remover.meta.js
// ==/UserScript==
 
const DEBUG_MODE = false; // Switch to false to prevent console logs
const CLEAN_INTERVAL = 3000; // In milliseconds
 
const removeAlreadyParticipated = () => {
  try {
    const threads = Array.from($('.latestThreads')[0].children); // HTMLCollection
    for(let i = 0; i < threads.length; i++) {
      const threadId = threads[i].id.substr(7);
      const participated = $(`#thread-${threadId} > div > a > h3 > i`).length === 1;
      if (participated) {
        $(`#thread-${threadId}`).remove();
      };
    };
    
    DEBUG_MODE && console.log('[DEBUG] Participated threads cleaned.');
  } catch(e) {
    console.error("Script Error: " + e.message);
  };
};
 
(function() {
    setInterval(removeAlreadyParticipated, CLEAN_INTERVAL);
})();