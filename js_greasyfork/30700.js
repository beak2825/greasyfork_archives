// ==UserScript==
// @name         Pound adopter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refreshes if it doesnt find the pet and clicks the adopt image if it finds it.
// @author       Nyu (clraik)
// @match        http://www.neopets.com/pound/adopt.phtml?search=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30700/Pound%20adopter.user.js
// @updateURL https://update.greasyfork.org/scripts/30700/Pound%20adopter.meta.js
// ==/UserScript==



////////////////////////////////////////////////////////////////////////

//You must change PetNameHere to the name of the pet you want to adopt.
var petname="PetNameHere";

//With this version you will have to press Enter manually
////////////////////////////////////////////////////////////////////////


var inf=$("[class='contentModuleTable']")[0].outerHTML.toString();

if(document.URL.indexOf("pound/adopt.phtml?search="+petname) != -1) {
	if (inf.includes("No abandoned Neopets were found with that name")){
		location.reload();
	}else{
		$("img[src='http://images.neopets.com/pound/adopt_link.png']")[0].click();
	}
}