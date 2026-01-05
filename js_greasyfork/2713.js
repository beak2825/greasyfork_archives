// ==UserScript==
// @name        Trader Attack Disabler
// @namespace   https://greasyfork.org/users/1802-wes-pardus
// @description Disables the attack buttons on the building screen.
// @author        Wes
// @include     http://artemis.pardus.at/building.php
// @include     https://artemis.pardus.at/building.php
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/2713/Trader%20Attack%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/2713/Trader%20Attack%20Disabler.meta.js
// ==/UserScript==



     var buttons = document.getElementsByTagName("input");

     if(buttons != null){
          var max = buttons.length;
          var x = 0;

          while(x < max){

	if(buttons[x].value == "Damage this building"){
	     buttons[x].disabled = true;
	}

	if(buttons[x].value == "Raid this building"){
	     buttons[x].disabled = true;
	}

	x += 1;
          }
     }