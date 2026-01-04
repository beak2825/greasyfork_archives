// ==UserScript==
// @name        API WhatsApp To WEB WhatsApp
// @icon        https://i.imgur.com/r2qkepk.png
// @namespace   Violentmonkey Scripts
// @include     *://api.whatsapp.com/*
// @version     1.0
// @author      iN4sser
// @namespace   iN4sser
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @license     GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @run-at      document-start
// @description 9/10/2021, 1:25:20 PM
// @downloadURL https://update.greasyfork.org/scripts/432199/API%20WhatsApp%20To%20WEB%20WhatsApp.user.js
// @updateURL https://update.greasyfork.org/scripts/432199/API%20WhatsApp%20To%20WEB%20WhatsApp.meta.js
// ==/UserScript==
if (location.href.match("api.whatsapp")) {
	location.href = location.href.replace("api", "web");
}