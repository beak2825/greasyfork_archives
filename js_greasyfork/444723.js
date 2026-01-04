// ==UserScript==
// @name        Reddit redirect to ThreadClient
// @namespace   WF Scripts
// @match       https://*.reddit.com/*
// @grant       none
// @version     1.0
// @author      WhiteFang
// @description Redirect reddit desktop links to ThreadClient
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/444723/Reddit%20redirect%20to%20ThreadClient.user.js
// @updateURL https://update.greasyfork.org/scripts/444723/Reddit%20redirect%20to%20ThreadClient.meta.js
// ==/UserScript==

(function()
{
  var url = window.location.href
  if(url.includes('https://www.reddit.com')){
    window.location.replace(window.location.href.replace('://www.reddit.com', '://thread.pfg.pw/#reddit'));
  }
  else if(url.includes('https://old.reddit.com')){
    window.location.replace(window.location.href.replace('://old.reddit.com', '://thread.pfg.pw/#reddit'));
  }
})();