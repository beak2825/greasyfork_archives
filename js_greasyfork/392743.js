// ==UserScript==
// @name         swagbucks 404 watch fix
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Its to fix a bug a found
// @author       bboytech
// @match        https://www.swagbucks.com/html/404.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392743/swagbucks%20404%20watch%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/392743/swagbucks%20404%20watch%20fix.meta.js
// ==/UserScript==

(function() {
    location.href = "https://www.swagbucks.com/watch/playlists/111/editors-pick";
})();