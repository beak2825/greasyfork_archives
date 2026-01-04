// ==UserScript==
// @name         Cookie clicker hacks
// @version      0.1
// @author       ReF
// @namespace    Cookie clicker hacks
// @description  Choose what level do you want
// @match        http://orteil.dashnet.org/*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @icon         http://images2.wikia.nocookie.net/__cb20130827014914/cookieclicker/images/5/5a/PerfectCookie.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38863/Cookie%20clicker%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/38863/Cookie%20clicker%20hacks.meta.js
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
    }
    setTimeout(function(){
        updaAll(level);
    }, 1000);