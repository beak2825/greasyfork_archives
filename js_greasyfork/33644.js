// ==UserScript==
// @name        Reddit Remove Spy Linking
// @namespace   http://reddit.co.uk
// @description Remove Spy Linking on Reddit.com
// @include     https://*.reddit.com/*
// @include     https://reddit.com/*
// @include     http://reddit.com/*
// @include     http://*.reddit.com/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33644/Reddit%20Remove%20Spy%20Linking.user.js
// @updateURL https://update.greasyfork.org/scripts/33644/Reddit%20Remove%20Spy%20Linking.meta.js
// ==/UserScript==

var a = document.getElementsByTagName("a");
for (var x=1; x<a.length; x++) {
  a[x].removeAttribute("data-outbound-url");
  a[x].removeAttribute("data-href-url");
  a[x].removeAttribute("data-outbound-expiration");
  a[x].removeAttribute("data-event-action");
  a[x].removeAttribute("rel");
  if (a[x].className.indexOf("comments")!=-1) {
    var nid = a[x].parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-fullname").split("_")[1];
    var sbr = a[x].parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-subreddit");
    var tid = a[x].parentNode.parentNode.parentNode.getElementsByTagName("p")[0].getElementsByTagName("a")[0].textContent.toLowerCase();
    tid = tid.replace(/\s+/g, "_");
    tid = tid.replace(/[^a-zA-z0-9]/g, "");
    tid = tid.replace(/__/g, "_");
    if (tid.length > 50) {
      tid=tid.substr(0,50);
      while (tid.length>=1 && tid.charAt(tid.length-1)!="_") {
        tid = tid.substr(0, tid.length-1)
      }
     tid = tid.substr(0, tid.length-1)
    }
    newstr = "https://www.reddit.com/" + "r/"+ sbr + "/comments/" + nid + "/" + tid;
    a[x].setAttribute("href", newstr);
  }
  a[x].removeAttribute("data-inbound-url");
}
