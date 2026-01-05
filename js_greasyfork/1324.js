// ==UserScript==
// @name        Google Calendar "hide morning and night" lab - hide night
// @version     1.3
// @description Hides "night" part of lab
// @match       https://www.google.com/calendar/*
// @match       https://calendar.google.com/calendar/*
// @namespace   https://greasyfork.org/users/1858
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/1324/Google%20Calendar%20%22hide%20morning%20and%20night%22%20lab%20-%20hide%20night.user.js
// @updateURL https://update.greasyfork.org/scripts/1324/Google%20Calendar%20%22hide%20morning%20and%20night%22%20lab%20-%20hide%20night.meta.js
// ==/UserScript==

GM_addStyle(" .crd-bottom, .cgd-col-last, .tg-hourmarkers > div:last-child { display:none; } .crd-col.tg-times-pri, .crd-col.tg-times-sec { top:-62px !important; } ");
