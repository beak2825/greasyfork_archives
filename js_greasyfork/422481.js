// A few scripts to you:


// ==UserScript==
// @name         More things to OWOT
// @namespace    https://greasyfork.org/pt-BR/users/741478
// @version      1
// @description  Add a few things to your OWOT!
// @author       Bryan
// @match        *.ourworldoftext.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422481/More%20things%20to%20OWOT.user.js
// @updateURL https://update.greasyfork.org/scripts/422481/More%20things%20to%20OWOT.meta.js
// ==/UserScript==

menu.addEntry('<h1>Others</h1>')
var night = false;
menu.addCheckboxOption(' Night', function(){night = true;w.night()}, function(){night = false;w.day()});
var endowot = false;
menu.addOption(' End of OWOT', function(){endowot = true;positionX = tileW*-4*2251799813685246 ; positionY = tileH*4*2251799813685246}, function(){endowot = false;javascript: positionX = tileW*-4*0 ; positionY = tileH*4*0});
menu.addEntry('<li><div>Notes</div><input style="width: 95%;" id="note" maxlength="255"></li>')