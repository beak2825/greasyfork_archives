// ==UserScript==
// @name         thing
// @namespace    thing
// @version      0.1
// @description  thingy
// @author       Ajax Playz
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19794/thing.user.js
// @updateURL https://update.greasyfork.org/scripts/19794/thing.meta.js
// ==/UserScript==
var show_borders = true;
function DrawBorders(c, dark){
       if (show_borders){
            c.strokeStyle = dark ? "#1EFF00" : "#1EFF00";
            c.beginPath();
            c.moveTo(0, 0), c.lineTo(11180, 0), c.lineTo(11180, 11180), c.lineTo(0, 11180), c.lineTo(0, 0);
            c.stroke();
        }        
}