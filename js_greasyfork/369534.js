// ==UserScript==
// @name        Reddit Old Auto
// @namespace   http://7tikukgkyytgk.com
// @description Auto link to old.reddit.com
// @include     https://*.reddit.com/*
// @include     https://reddit.com/*
// @include     http://reddit.com/*
// @include     http://*.reddit.com/*
// @version     1.2.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/369534/Reddit%20Old%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/369534/Reddit%20Old%20Auto.meta.js
// ==/UserScript==

var a = document.getElementsByTagName("a");

for (var x=1; x<a.length; x++) {
  newhref = null;
    if (a[x].href.indexOf("www.reddit.com")!=-1) {
      var newhref = a[x].href.replace("www.reddit.com", "old.reddit.com")
      a[x].setAttribute("href", newhref);
    }
}

var f = document.getElementsByTagName("form");
for (var xx=1; xx<f.length; xx++) {
  newaction = null;
    if (f[xx].action.indexOf("www.reddit.com")!=-1) {
      var newaction = f[xx].action.replace("www.reddit.com", "old.reddit.com")
      f[xx].setAttribute("action", newaction);
    }
}

if (document.location.href.indexOf("www.reddit.com")!=-1) {
  document.location.href = document.location.href.replace("www.reddit.com", "old.reddit.com");
  
}