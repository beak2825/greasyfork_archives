// ==UserScript==
// @name       [GC] Organize SW Results
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match				https://www.grundos.cafe/market/wizard*
// @match       https://www.grundos.cafe/guilds/guild/*/members*
// @match       https://www.grundos.cafe/block*
// @require  	  https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require     https://update.greasyfork.org/scripts/487361/1389917/%5BGC%20%7C%20Library%5D%20-%20SSW%3A%20Savvy%20Shop%20Wiz.js
// @grant				GM.getValue
// @grant     	GM.setValue
// @grant				GM.listValues
// @license     MIT
// @version     86
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description	 Blocked users can be synced but do not actually change anything in the SW results yet.

// @downloadURL https://update.greasyfork.org/scripts/487277/%5BGC%5D%20Organize%20SW%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/487277/%5BGC%5D%20Organize%20SW%20Results.meta.js
// ==/UserScript==

if (!localStorage.getItem('scriptAlert-487277')) {
    alert("Organize SW Results script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-487277', 'true');
}