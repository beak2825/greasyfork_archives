// ==UserScript==
// @name        mydealz comment thread expander - mydealz.de
// @namespace   Violentmonkey Scripts
// @match       https://www.mydealz.de/*
// @match       https://www.chollometro.com/*
// @match       https://www.pepper.ru/*
// @match       https://www.promodescuentos.com/*
// @match       https://nl.pepper.com/*
// @match       https://www.dealabs.com/*
// @match       https://www.preisjaeger.at/*
// @match       https://www.pepper.it/*
// @match       https://www.pepper.pl/*
// @match       https://www.hotukdeals.com/*
// @grant       none
// @version     1.0.2
// @author      max.savings
// @description expands all comment threads.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/447494/mydealz%20comment%20thread%20expander%20-%20mydealzde.user.js
// @updateURL https://update.greasyfork.org/scripts/447494/mydealz%20comment%20thread%20expander%20-%20mydealzde.meta.js
// ==/UserScript==
setInterval(()=>{
  document.querySelectorAll('button[data-t=moreReplies]').forEach(btn=>btn.click());
},1000)