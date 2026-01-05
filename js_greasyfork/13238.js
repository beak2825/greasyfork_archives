// ==UserScript==
// @name          Youtube Logo Subscriptions
// @namespace     http://nmtools.com
// @description   Changes youtube logo link to subscriptions feed
// @include       *.youtube.com*
// @version       1.2
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/13238/Youtube%20Logo%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/13238/Youtube%20Logo%20Subscriptions.meta.js
// ==/UserScript==

document.getElementById("logo").href = "/feed/subscriptions";