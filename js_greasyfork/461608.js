// ==UserScript==
// @name        Reddit Shitheads
// @version     1.01
// @grant       none
// @match       *://*.reddit.com/*
// @namespace   "finbarfin"
// @description "Redditors are shitheads"
// @downloadURL https://update.greasyfork.org/scripts/461608/Reddit%20Shitheads.user.js
// @updateURL https://update.greasyfork.org/scripts/461608/Reddit%20Shitheads.meta.js
// ==/UserScript==

/* Might break the site, it sure as hell was in version 1.0 lol, didn't even notice for several days though */
 
setInterval(function() {
  var comments = document.querySelectorAll(".Comment p, [data-test-id='post-content'] a[data-click-id='body'], [data-test-id='post-content'] div[data-click-id='text']");
                                        
  comments.forEach(function(comment) {
    comment.innerHTML = comment.innerHTML.replace(/([Aa]s a )(\w+),*/,"$1shithead,");
    comment.innerHTML = comment.innerHTML.replace(/(\w+) here[,.]*/,"Shithead here");
  });
},1000);
