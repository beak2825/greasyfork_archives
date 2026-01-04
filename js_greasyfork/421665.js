// ==UserScript==
// @name         Missing Information Prompt Fix
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  fix
// @author       purpie
// @match        https://web.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421665/Missing%20Information%20Prompt%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/421665/Missing%20Information%20Prompt%20Fix.meta.js
// ==/UserScript==
 
sel('MonthDropDown', '1'); sel('DayDropDown', '1'); sel('YearDropDown', '2002'); document.getElementById("roblox-confirm-btn").click();
function sel(id, select) { let el = document.getElementById(id); el.value = select; }
