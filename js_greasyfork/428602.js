// ==UserScript==
// @name         translator thing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  uhhhh if roblox autocaptures spectating names it adds a button and it copies it
// @author       realwut
// @match        https://www.roblox.com/localization/games/107172930/translations?languageCode=nl
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428602/translator%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/428602/translator%20thing.meta.js
// ==/UserScript==

// IS THE SITE LOADED?
window.addEventListener("load", function(){

    // CREATING THE BUTTON
	let clone = document.querySelector('#selenium-save-entry-button').cloneNode( true );
	clone.setAttribute('id', 'selenium-submit-invalid-button');
	document.querySelectorAll('.col-sm-6')[2].appendChild( clone );
	clone.innerHTML = "Invalid";
	document.getElementById("selenium-submit-invalid-button").style.marginRight = "10px";
	clone.removeAttribute("disabled")

	// DEFINING THE INPUT TEXTBOX
	let inputbox = document.getElementById("selenium-translation-text");

	// INVALID BUTTON LISTENER FUNCTION
	document.getElementById("selenium-submit-invalid-button").addEventListener("click", function() {

		//COPYING AND PASTING THE TEXT
		inputbox.value = document.getElementById("selenium-entry-source-text").innerHTML;
		inputbox.innerHTML = document.getElementById("selenium-entry-source-text").innerHTML;
		inputbox.classList.remove("ng-pristine");
		inputbox.classList.remove("ng-empty");
		inputbox.classList.add("ng-valid");
		inputbox.classList.add("ng-not-empty");
		inputbox.classList.add("ng-dirty");
		inputbox.classList.add("ng-valid-parse");

		// MANUAL TEXTBOX UPDATE (IMPORTANT)
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			inputbox.dispatchEvent(evt);
		}
		else {
			inputbox.fireEvent("onchange");
		}

	});
});

