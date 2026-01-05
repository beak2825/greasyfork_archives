// ==UserScript==
// @name            Muted and Away Colour Fix
// @author          skyboy
// @version         1.0.0
// @description     Fixes users who are both muted and AFK from appearing as though they are silenced.
// @include         http://www.kongregate.com/games/*/*
// @homepage        http://userscripts.org/scripts/show/72292
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17726/Muted%20and%20Away%20Colour%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/17726/Muted%20and%20Away%20Colour%20Fix.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?]+(\?.*)?$/.test(window.location.pathname))
setTimeout(function() {
window.location.assign("javascript:$(\"gamepage_header\").innerHTML+=\"<style>#kong_game_ui .user_row.away.muted .username{color:#844 !important}</style>\";void(0);");
}, 1250);