// ==UserScript==
// @name         Agar.io Feed Macro + Split Hotkeys|By: Dabbles - Agario
// @namespace    Double Split, Triple Split, 16 Split Hotkeys And Quicker Feeding
// @version      1.1
// @description  D - Double Split -|- S - Triple Split -|- A - 16 Split -|- Q - Feed
// @author       Dabbles - Agario
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/499432/Agario%20Feed%20Macro%20%2B%20Split%20Hotkeys%7CBy%3A%20Dabbles%20-%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/499432/Agario%20Feed%20Macro%20%2B%20Split%20Hotkeys%7CBy%3A%20Dabbles%20-%20Agario.meta.js
// ==/UserScript==

if (event.keyCode == 81 ) // Q
{
Feed = true;
setTimeout(mass, Speed);
}