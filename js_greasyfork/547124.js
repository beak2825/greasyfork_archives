// ==UserScript==
// @name         Hide Video Recommendations (Watch Feed Blocker)
// @namespace    https://github.com/MAAB-FW/hide-fb-video-recommendations
// @version      1.3
// @description  Hide video recommendations and other unwanted sections on Facebook, even when scrolling
// @author       @maab-fw
// @match        https://www.facebook.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547124/Hide%20Video%20Recommendations%20%28Watch%20Feed%20Blocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547124/Hide%20Video%20Recommendations%20%28Watch%20Feed%20Blocker%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const cssRules = `
        .x1iyjqo2 > div:nth-of-type(1) > ul > li:nth-of-type(7),
        .xzkaem6.xh8yej3.xxzkxad.x7wzq59,
        #watch_feed > div > div.x78zum5:nth-of-type(2),
        li:nth-of-type(23) > div,
        .x1iyjqo2 > div:nth-of-type(1) > ul > li:nth-of-type(14) > div,
        .x1a8lsjc.x889kno.xso031l.x1q0q8m5.x1nb4dca.x1ve1bff,
        li.x1gz44f.x13fj5qh.x1awlv9s.x1l38jg0.x1hxoosp.xmlsiyf.x1iyjqo2:nth-of-type(3),
        .x11t971q.xvc5jky.x1vqzy7e.x13qq4wz.xaooukx {
            display: none !important;
        }
    `;

  // Apply styles immediately
  GM_addStyle(cssRules);

  // Reapply styles dynamically when DOM changes (SPA behavior)
  const observer = new MutationObserver(() => {
    GM_addStyle(cssRules);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();