// ==UserScript==
// @name       AgarioMods Script
// @namespace	 electronoob-agarmods
// @version      1.7.7
// @description  Multiplayer Script For Agar.io
// @author       electronoob
// @match        http://agar.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10690/AgarioMods%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/10690/AgarioMods%20Script.meta.js
// ==/UserScript==
 
var script = document.createElement('script');
script.src = "http://agariomods.com/mods.js";
(document.body || document.head || document.documentElement).appendChild(script);
 
/*
repo:
https://github.com/electronoob/agarmods
 
common website for all mods from anybody:
http://www.agariomods.com
 
*/