// ==UserScript==
// @name         Twitter/X Disable Media Blur
// @version      20240409.23.42
// @description  Disables the "Sensitive Media" blur on everyone's Media tab and feed
// @author       furfnsfw
// @license      No License
// @match      https://twitter.com/*
// @match      https://x.com/*
// @grant        GM_addStyle
// @namespace   https://greasyfork.org/en/users/1286657-ashyboy
// @downloadURL https://update.greasyfork.org/scripts/492195/TwitterX%20Disable%20Media%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/492195/TwitterX%20Disable%20Media%20Blur.meta.js
// ==/UserScript==

// Originally from https://furf.carrd.co/
// Adapted by https://twitter.com/AshyTheBoy

GM_addStyle(`
  li[id^='verticalGrid'] div *,
  article > div > div > div > div > div[id] > div > div > div > div > div {
    filter: none !important;
  }

  li[id^='verticalGrid'] > div > div > div > div:last-child,
  article > div > div > div > div > div[id] > div > div > div > div > div + div:has(div[role="button"]) {
    display:none;
  }
`);
