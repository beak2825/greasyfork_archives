// ==UserScript==
// @name Family Search Memories MT - Flag images - 0.03
// @description I'm so fancy.
// @version 1.0
// @author DCI
// @namespace www.redpandanetework.org
// @icon http://i.imgur.com/ZITD8b1.jpg
// @include https://www.mturkcontent.com/*&FamilySearchMemoriesMTFlagimages-(WARNING:ThisHITmaycontainadultcontent.Workerdiscretionisadvised.)0.03*
// @groupId ?
// @auto_approve 0.041666666666666664 days
// @timer 3 minutes
// @quals Photo Moderation Masters has been granted; HIT approval rate (%) is not less than 97
// @frameurl https://www.mturkcontent.com/dynamic/hit?assignmentId=3MMN5BL1W0BILAVHVSFLGSL1VGMM3Y&hitId=3QQUBC64ZEKXW6P11GW8B34L5YKNX3&workerId=ALQPGVQZEZSUE&turkSubmitTo=https%3A%2F%2Fwww.mturk.com&FamilySearchMemoriesMTFlagimages-(WARNING:ThisHITmaycontainadultcontent.Workerdiscretionisadvised.)0.03
// @grant GM_setClipboard
// @grant GM_openInTab
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/32256/Family%20Search%20Memories%20MT%20-%20Flag%20images%20-%20003.user.js
// @updateURL https://update.greasyfork.org/scripts/32256/Family%20Search%20Memories%20MT%20-%20Flag%20images%20-%20003.meta.js
// ==/UserScript==

if (~document.body.innerHTML.indexOf("Please Do Not Flag Blank or Unviewable Images")){	
  var instructions = document.getElementsByTagName("h3")[0];
	document.getElementById("mturk_form").appendChild(instructions);
	var images = document.getElementsByTagName('img');
	for (f = 0; f < 10; f++){
		var clone = document.createElement("IMG");
		clone.src = images[f].src;
		clone.width = (screen.availWidth - 200) / 5;
		clone.height = (screen.availHeight/3);
		clone.style.border = "5px solid green";
		document.getElementById("mturk_form").appendChild(clone);
	}	
	
	var buttons = document.getElementsByTagName('img');
	for (var b = 10; b < 20; b++){
	  buttons[b].addEventListener("click", function(e){
			var checks = document.querySelectorAll("input[type='checkbox']");
			for (var c = 0; c < checks.length; c++){
				checks[c].checked = false;
			}
			if (this.style.border == "5px solid green"){
				this.style.border = "5px solid red";
				this.name = "red";				
			}
			else {
				this.style.border = "5px solid green";
				this.name = "not red";			
			}
			var things = document.getElementsByTagName('img');
			for (var r = 0; r < things.length; r++){
				if (things[r].name == "red"){
					document.querySelectorAll('input[type="checkbox"]')[r-10].click();
				}
			}				
		});
	}
	window.onload = function () { 
		window.scrollTo(0,document.body.scrollHeight);
	}
	function press(i) {
		if ( i.keyCode == 70 ) { //F
			document.getElementById('submitButton').click();
		}
	}
	document.addEventListener( "keydown", press, false);
}