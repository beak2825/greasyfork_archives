// ==UserScript==
// @name         Pound adopter TM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refreshes is a pet is not found and adopts if it finds it. (TM only)
// @author       Nyu (clraik)
// @match        http://www.neopets.com/pound/adopt.phtml?search=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/30743/Pound%20adopter%20TM.user.js
// @updateURL https://update.greasyfork.org/scripts/30743/Pound%20adopter%20TM.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////////////

//You must change PetNameHere to the name of the pet you want to adopt.
var petname="PetNameHere";

////////////////////////////////////////////////////////////////////////



var inf=$("[class='contentModuleTable']")[0].outerHTML.toString();

if(document.URL.indexOf("pound/adopt.phtml?search="+petname) != -1) {
	if (inf.includes("No abandoned Neopets were found with that name")){
		location.reload();
	}else{
			adoptPet();
	}
}
function adoptPet(){
    GM_xmlhttpRequest({
		method: "POST",
		url: "http://www.neopets.com/pound/process_adopt.phtml?",
		data: "pet_name="+petname,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		onload: function(response) {
			if (response.responseText.includes("This Neopet could not be found")) {
				alert("Failed to adopt "+petname);
			}else{
				alert("Successfully adopted "+petname);
			}
		}
    });
}