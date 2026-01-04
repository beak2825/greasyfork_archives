// ==UserScript==
// @name Google Image Reminder 3
// @namespace nelemnaru
// @description Popup reminder on Google images
// @include *.google.*tbm=isch*
// @include *.google.*tbm=vid*
// @include *.google.*tbs=sbi*
// @include *.google.*imgurl*
// @version 3.0
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/376959/Google%20Image%20Reminder%203.user.js
// @updateURL https://update.greasyfork.org/scripts/376959/Google%20Image%20Reminder%203.meta.js
// ==/UserScript==

var el = document.createElement("STYLE");
el.innerHTML = "body { visibility: hidden !important; }"
document.head.appendChild(el);

alert("Be vigilant!")

setTimeout(function() {
  document.head.removeChild(el);
}, 3000)
