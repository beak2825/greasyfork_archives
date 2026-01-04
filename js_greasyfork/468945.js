// ==UserScript==
// @name        Redirect privated Reddit pages to cache
// @namespace   zys52712
// @match       https://*.reddit.com/*
// @version     1.1
// @license     GNU GPLv3
// @author      zys52712
// @description Redirect reddit posts from recently privated communities to google's cache (works for most front page search results on google, 9s timeout).
// @downloadURL https://update.greasyfork.org/scripts/468945/Redirect%20privated%20Reddit%20pages%20to%20cache.user.js
// @updateURL https://update.greasyfork.org/scripts/468945/Redirect%20privated%20Reddit%20pages%20to%20cache.meta.js
// ==/UserScript==

var count = 0;
var interval = window.setInterval( () => {
  if (document.body.innerHTML.search("is a private community") != -1 && ! document.URL.includes('cache:')) {
    window.location.replace('http://www.google.com/search?sourceid=chrome&ie=UTF-8&q=cache:' + window.location);
  }
  if (count > 30) {
    clearInterval(interval);
  }
  count++;
}, 300);