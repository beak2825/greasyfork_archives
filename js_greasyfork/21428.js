// ==UserScript==
// @name         Furvilla Inventory Quick Access
// @namespace    fortytwo
// @version      0.1
// @description  Adds two buttons for medicines and potions on the inventory page.
// @author       fortytwo
// @match        http://www.furvilla.com/inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21428/Furvilla%20Inventory%20Quick%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/21428/Furvilla%20Inventory%20Quick%20Access.meta.js
// ==/UserScript==
/***
	NOTICE: YOU ARE AGREEING THAT ANY USE OF THE FOLLOWING SCRIPT IS AT
	YOUR OWN RISK. I DO NOT MAKE ANY GUARANTEES THE SCRIPT WILL WORK, NOR 
	WILL I HOLD MYSELF ACCOUNTABLE FOR ANY DAMAGES TO YOUR DEVICE.
	
	WHILE THE SCRIPT IS UNLIKELY TO CAUSE ANY HARM, AS WITH ALL TECHNICAL
	COMPONENTS, BUGS AND GLITCHES CAN HAPPEN.
	
	Find me here:
		http://42-dragons.tumblr.com/
		http://www.furvilla.com/profile/34742
***/

(function() {
    'use strict';
	
	var insertAfter = function(x, y){
		y.parentNode.insertBefore(x, y.nextSibling);
	};

	var createButton = function(icon, link){
		var btn = document.createElement("a");
		btn.setAttribute('class', 'btn tooltipster tooltipstered');
		btn.href = link;
		
		var text = document.createElement('span');
		text.setAttribute('class', icon);
		btn.appendChild(text);
		return btn;
	};

    var medic_button = createButton("fa fa-medkit", "/inventory?type=is_medicine&sort=potency");
	var potion_button = createButton("fa fa-flask", "/inventory?type=is_potion");

	var display = document.createElement('div');
	display.style = "margin:5px 0px";
	display.innerHTML = "Quick Access: ";
	display.appendChild(medic_button);
	display.appendChild(potion_button);
	insertAfter(display, document.querySelector("body > div.content > div > div.left-column > h1"));
})();