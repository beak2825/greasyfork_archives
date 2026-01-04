// ==UserScript==
// @name		1_JamMagic
// @description		fix layout
// @match		*://*.jammagic.net/*
// @match		*://jammagic.freeforums.net/*
// @match		https://*.jammagic.net/*
// @match		https://jammagic.freeforums.net/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/463353-1_jammagic
// @author		sports_wook
// @version		2025.05.15

// @downloadURL https://update.greasyfork.org/scripts/463353/1_JamMagic.user.js
// @updateURL https://update.greasyfork.org/scripts/463353/1_JamMagic.meta.js
// ==/UserScript==


GM_addStyle (`

.pad-top, .container .note, table.list abbr.time, .last-edited, #recent-threads .item.thread td.latest.last, .legend .content td {
    color: #000;
}


`);