// ==UserScript==
// @name        Shorten AliExpress Links
// @description Get rid of all those useless parameters on an item URL
// @namespace   ceremony.shorten.aliexpress.links
// @include     /https?:\/\/([^\.]+\.)?aliexpress\.[a-z.]*\/(store\/product|item)\/([^\/]+\/)?[_\d]+\.html(\?.*)?/
// @version     2.1
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34530/Shorten%20AliExpress%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/34530/Shorten%20AliExpress%20Links.meta.js
// ==/UserScript==

let realWindow = window.parent, url = document.createElement('a');
url.href = realWindow.location.href;

url.protocol = "https:";
url.search = "";
url.hash = "";
//url.hostname = "www.aliexpress.com"; // does not work due to cookie/session variables

if (url.href !== realWindow.location.href) {
  if (realWindow.location.hostname === url.hostname && realWindow.location.protocol === url.protocol)
    realWindow.history.replaceState(null, null, url.href);
  else
    realWindow.location = url.href;
}