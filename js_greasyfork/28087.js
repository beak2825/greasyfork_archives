// ==UserScript==
// @name          G-play show rating
// @description   Shows the rating as text next to the stars in Google Play app listings
// @version       2.0.0
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @match         https://play.google.com/*
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/28087/G-play%20show%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/28087/G-play%20show%20rating.meta.js
// ==/UserScript==


(document.head || document.documentElement)
  .appendChild(document.createElement('style')).textContent = /*css*/`
  [data-wx-rating]::before {
    content: attr(data-wx-rating);
  }
  [data-wx-rating-5]::before {
    color: green;
    font-weight: bold;
  }
  [data-wx-rating-4]::before {
    color: green;
  }
  [data-wx-rating-3]::before {
    color: cornflowerblue;
  }
  [data-wx-rating-2]::before {
    color: hotpink;
  }
  [data-wx-rating-1]::before {
    color: red;
  }
`;

const SEL = [1, 2, 3, 4, 5]
  .map(r => `[role="img"]:not([data-wx-rating])[aria-label*="${r}"]`).join(',');
const mo = new MutationObserver(onMutation);
const observe = () => mo.observe(document, {
  childList: true,
  subtree: true,
  attributes: true,
});
observe();

async function onMutation(mutations) {
  let changed;
  for (const { target } of mutations) {
    if (target && target.firstElementChild && target.querySelector(SEL)) {
      for (const star of target.querySelectorAll(SEL)) {
        const r = star.getAttribute('aria-label').match(/\b\d(\.\d)?\b|$/)[0];
        if (r) {
          if (!changed) changed = mo.disconnect() || 1;
          star.setAttribute('data-wx-rating', r);
          star.setAttribute('data-wx-rating-' + Math.max(1, r | 0), '');
        }
      }
    }
  }
  if (changed) observe();
}
