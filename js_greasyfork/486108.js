// ==UserScript==
// @name         EvoWorld.io Gems Cheat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set gems to 9999999 when 'M' key is pressed on EvoWorld.io
// @author       You
// @match        https://evoworld.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486108/EvoWorldio%20Gems%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/486108/EvoWorldio%20Gems%20Cheat.meta.js
// ==/UserScript==

   document.addEventListener("keydown",function(e){
if(e.key == 'M'){
alert("Infinity gems spawn (reload-page)");
localStorage.setItem("gemsOwned", "9999999999999999999999999999999999999999999999");
        }});