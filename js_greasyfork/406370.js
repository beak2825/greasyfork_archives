// ==UserScript==
// @name          invidious always-dash
// @description   Always appends "quality=dash" to an invidio.us URL
// @author        nullgemm
// @version       0.2.4
// @grant         none
// @match         *://invidious.snopyta.org/watch?v=*
// @run-at        document-idle
// @namespace     https://greasyfork.org/en/users/322108-nullgemm
// @downloadURL https://update.greasyfork.org/scripts/406370/invidious%20always-dash.user.js
// @updateURL https://update.greasyfork.org/scripts/406370/invidious%20always-dash.meta.js
// ==/UserScript==

var url = new URL(window.location);

if (url.searchParams.get("quality") != "dash") {
  url.searchParams.set("quality", "dash")
  window.location.replace(url);
}