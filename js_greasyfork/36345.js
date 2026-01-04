// ==UserScript==
// @name        xvideos pictures without javascript
// @namespace   http://greasy568uiyhgy.com
// @description Show images on xvideos.com without having javascript enabled
// @include     http://www.xvideos.com*
// @include     https://www.xvideos.com*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36345/xvideos%20pictures%20without%20javascript.user.js
// @updateURL https://update.greasyfork.org/scripts/36345/xvideos%20pictures%20without%20javascript.meta.js
// ==/UserScript==

var alli = document.getElementById("content").getElementsByTagName("img");
for (x in alli) {
  try {
   if (alli[x].id.indexOf("pic_")!=-1) {
      try {
        r = alli[x].getAttribute("data-src");
        alli[x].src = r.replace("THUMBNUM", "2")
      }catch(e) {}
      try {
        alli[x].removeAttribute("data-src");
        alli[x].removeAttribute("data-idcdn");
        alli[x].removeAttribute("data-videoid");
      }catch(e) {}
   }
  }catch(e) {}
}