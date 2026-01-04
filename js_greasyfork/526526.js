// ==UserScript==
// @name         SMLWiki - Maddenverse Old Redirect Fix
// @version      1.0
// @description  Fixes the redirect location on nfl.smlwiki.com/oldwebsite
// @author       deathofserenity
// @match        https://nfl.smlwiki.com/oldwebsite.html
// @namespace https://greasyfork.org/users/1353485
// @downloadURL https://update.greasyfork.org/scripts/526526/SMLWiki%20-%20Maddenverse%20Old%20Redirect%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/526526/SMLWiki%20-%20Maddenverse%20Old%20Redirect%20Fix.meta.js
// ==/UserScript==

(function() { 'use strict'; if (ybtn) { ybtn.onclick = function() { this.src = 'ybtn3.png'; setTimeout(function() { window.location.href = 'https://smlwiki.com'; }, 90); }; } })();