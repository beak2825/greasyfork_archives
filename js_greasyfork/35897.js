// ==UserScript==
// @name         Un-Rickroll For My Vebsiet
// @namespace    http://tampermonkey.net/
// @version      420
// @description  Un-Rickrollify The Automated Rickroll on My Website 
// @author       Anirudh B
// @match          https://anirudhhax.duckdns.org
// @match          http://anirudhhax.duckdns.org
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/35897/Un-Rickroll%20For%20My%20Vebsiet.user.js
// @updateURL https://update.greasyfork.org/scripts/35897/Un-Rickroll%20For%20My%20Vebsiet.meta.js
// ==/UserScript==
if (location.protocol != 'https:')
{
location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
var elmDeleted = document.getElementById("rickroll");
elmDeleted.parentNode.removeChild(elmDeleted);

