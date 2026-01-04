// ==UserScript==
// @name        Twitter sensitive content unhide
// @namespace   Twitter sensitive content unhide
// @match       https://twitter.com/*
// @match       https://x.com/*
// @version     1.0
// @author      Anon
// @grant       GM_addStyle
// @license MIT 
// @description Removes twitter's sensitive content toggle so that nothing is hidden
// @downloadURL https://update.greasyfork.org/scripts/492130/Twitter%20sensitive%20content%20unhide.user.js
// @updateURL https://update.greasyfork.org/scripts/492130/Twitter%20sensitive%20content%20unhide.meta.js
// ==/UserScript==


GM_addStyle('.r-yfv4eo { filter: blur(0px) !important }')
GM_addStyle('.r-drfeu3 { display: none !important }')
GM_addStyle('.r-1cmwbt1.r-1777fci { display: none !important }')