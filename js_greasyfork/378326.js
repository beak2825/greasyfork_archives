// ==UserScript==
// @name         Cookie clicker hacks remade
// @version      1.3
// @author       ThatDragonBoi
// @namespace    Cookie clicker hacks remade
// @description  With nothing editited, it will change every building amount to 4000. If you want to change the amount, edit the file and change the number in the line "var level = ####" (#=number).
// @match        http://orteil.dashnet.org/*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @icon         https://i.ibb.co/99QcY5S/MA-NEW-LITTLE-DUDE-scaled.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378326/Cookie%20clicker%20hacks%20remade.user.js
// @updateURL https://update.greasyfork.org/scripts/378326/Cookie%20clicker%20hacks%20remade.meta.js
// ==/UserScript==

var level = 4000;
function updaAll(poi) {
      Game.Objects['Cursor'].amount = poi;
      Game.Objects['Grandma'].amount = poi;
      Game.Objects['Farm'].amount = poi;
      Game.Objects['Mine'].amount = poi;
      Game.Objects['Factory'].amount = poi;
      Game.Objects['Bank'].amount = poi;
      Game.Objects['Temple'].amount = poi;
      Game.Objects['Wizard tower'].amount = poi;
      Game.Objects['Shipment'].amount = poi;
      Game.Objects['Alchemy lab'].amount = poi;
      Game.Objects['Portal'].amount = poi;
      Game.Objects['Time machine'].amount = poi;
      Game.Objects['Antimatter condenser'].amount = poi;
      Game.Objects['Prism'].amount = poi;
      Game.Objects['Chancemaker'].amount = poi;
      Game.Objects['Fractal engine'].amount = poi;
      Game.Objects['Javascript console'].amount = poi;
    }
    setTimeout(function(){
        updaAll(level);
    }, 1000);