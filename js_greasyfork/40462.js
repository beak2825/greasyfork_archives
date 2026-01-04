// ==UserScript==
// @name        Youtube No Resume
// @match       *://*.youtube.com/watch?*
// @run-at      document-start
// @grant       none
// @description:en Disables the resume feature in Youtube.
// @version 0.0.2.1523310876
// @namespace https://greasyfork.org/users/179175
// @license MIT
// @description Disables the resume feature in Youtube.
// @downloadURL https://update.greasyfork.org/scripts/40462/Youtube%20No%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/40462/Youtube%20No%20Resume.meta.js
// ==/UserScript==
function TestUrl() {
  var href = window.location.href;
  if (href.search("&t=") != "-1") {
    if (href.search("&t=1s") == "-1") {
      window.location.replace(href.substr(0, href.lastIndexOf('&')) + "&t=1s");
    }
  }
}
var pageURLCheckTimer = setInterval(
  function () {
    if (this.lastPathStr !== location.pathname ||
      this.lastQueryStr !== location.search ||
      (this.lastHashStr !== location.hash)
    ) {
      this.lastPathStr = location.pathname;
      this.lastQueryStr = location.search;
      this.lastHashStr = location.hash;
      TestUrl();
    }
  }, 111
);
TestUrl();