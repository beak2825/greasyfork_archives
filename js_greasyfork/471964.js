// ==UserScript==
// @name        YouTube Url Remove PP
// @namespace   UserScript
// @match       https://www.youtube.com/*
// @grant       none
// @run-at      document-start
// @version     1.0
// @author      CY Fung
// @license     MIT
// @description To remove "pp=" in YouTube Url
// @downloadURL https://update.greasyfork.org/scripts/471964/YouTube%20Url%20Remove%20PP.user.js
// @updateURL https://update.greasyfork.org/scripts/471964/YouTube%20Url%20Remove%20PP.meta.js
// ==/UserScript==

(() => {
  const Promise = ((async () => { })()).constructor;
  const ets = `
      yt-navigate
      yt-navigate-start
      yt-page-type-changed
      yt-player-updated
      yt-page-data-fetched
      yt-navigate-finish`.trim().split(/\s+/)

  const fn = () => {
    if (location.search.includes('pp=')) {
      let oUrl = location.pathname + location.search;
      let nUrl = location.pathname + location.search.replace(/([?&])pp=[^=&?]+\b(\&|)/, (a, p, q) => {
        return !q ? '' : p
      });
      if (oUrl !== nUrl) history.replaceState(history.state, '', nUrl);
    }

  }
  const fh = () => {
    fn();
    Promise.resolve().then(fn);
  }
  for (const et of ets) {

    document.addEventListener(et, fh, false);
  }

})();

