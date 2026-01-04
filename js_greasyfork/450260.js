// ==UserScript==
// @name        youtube deshorter
// @namespace   tgies
// @match       *://*.youtube.com/*
// @run-at      document-start
// @version     0.2
// @license     MIT
// @author      tgies
// @description redirect youtube shorts to regular watch page
// @downloadURL https://update.greasyfork.org/scripts/450260/youtube%20deshorter.user.js
// @updateURL https://update.greasyfork.org/scripts/450260/youtube%20deshorter.meta.js
// ==/UserScript==

(() => {
  let prevURL = location.href;
  
  // Trap normal navigation (we reuse this logic when trapping fake navigation)
  const maybeDoRedir = () => {
    if (location.href.includes('/shorts/'))
      location.replace(location.toString().replace('/shorts/', '/watch?v=')); // redirect it
  };
  maybeDoRedir();
  
  // Trap SPA "fake" navigation: location.href changes and the body changes, but
  // an actual navigation and associated document readiness cycle does not happen.
  // we observe body replacement to catch these and force a true navigation to the
  // original watch page.
  const obs = new MutationObserver((muts) => {
    if (location.href != prevURL) {
      // location changed, save this as new prevURL and redirect if it's shorts
      prevURL = location.href;
      maybeDoRedir();
    }
  });
  obs.observe(document, { subtree: true, childList: true });
})();