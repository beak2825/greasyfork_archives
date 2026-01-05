// ==UserScript==
// @name          Steam Linkfilter Redirect
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       1
// @description   Redirects Steam Linkfilter to the Linked Page
// @include       *://steamcommunity.com/linkfilter/?url=*
// @grant         none
// @updateVersion 1
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/4559/Steam%20Linkfilter%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/4559/Steam%20Linkfilter%20Redirect.meta.js
// ==/UserScript==

window.location.assign(document.URL.split("url=")[1]);