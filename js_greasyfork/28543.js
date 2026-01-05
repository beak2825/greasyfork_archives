// ==UserScript==
// @name        4chan better image server replace
// @namespace   4chan-better-img-repl
// @include     http://boards.4chan.org/*/thread/*
// @version     1
// @grant       none
// @description Use this script if images in 4chan threads won't load/open.
// @downloadURL https://update.greasyfork.org/scripts/28543/4chan%20better%20image%20server%20replace.user.js
// @updateURL https://update.greasyfork.org/scripts/28543/4chan%20better%20image%20server%20replace.meta.js
// ==/UserScript==

var lastUpdated;
(function repl() {
  if (lastUpdated === undefined || ThreadUpdater.lastReply != null && lastUpdated != ThreadUpdater.lastUpdated) {
    lastUpdated = ThreadUpdater.lastUpdated;
    var els = document.getElementsByTagName("a");
    for(var i = els.length-1; i >= 0; i--) {
      var el = els[i], contains = el.outerHTML.indexOf('is2.4chan') > -1;
      if (el.className == 'fileThumb' && !contains) break;
      if (contains) el.outerHTML = el.outerHTML.replace(/s2\.4cha/, '.4cd');
    }
  }
  if (!ThreadUpdater.dead) setTimeout(repl, (ThreadUpdater.timeLeft || 1) * 1000);
})();