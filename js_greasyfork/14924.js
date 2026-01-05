
// ==UserScript==
// @name        KMaZ agario client
// @namespace	 AgarioMods
// @version      1.9.9
// @description  community run mod feature set for agar.io
// @author       kmakblob
// @match        http://agar.io/
// @match        http://agar.io/#*
// @match        http://agar.io/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14924/KMaZ%20agario%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/14924/KMaZ%20agario%20client.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = document.location.protocol+"//raw.githubusercontent.com/kmakblob/KMaZ/master/KMaZ.js";
(document.body || document.head || document.documentElement).appendChild(script);

/*
repo:
https://github.com/electronoob/agarmods

http://www.agariomods.com

*/

