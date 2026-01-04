// ==UserScript==
// @name         AO3 One-Click Mute Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a mute direct link to each fic box.
// @author       exuvia
// @match        https://archiveofourown.org/users/*/muted/users/confirm_mute*
// @match        https://archiveofourown.org/tags/*/works*
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459990/AO3%20One-Click%20Mute%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/459990/AO3%20One-Click%20Mute%20Button.meta.js
// ==/UserScript==

(function() {
	
	//////SETTINGS//////
	const username = ""; //Required. Enter your username here. 
	const skipConfirm = true; //To skip the confirm mute button
	const hideMuteMessages = false; //Default disabled. Has ~0.5 second delay, may be annoying. 
	////////////////////
	

	
	if (hideMuteMessages){
		//hideMuteMessages
		//do not just get p.notes because this will also hide the Notes sections on fics. Technically, this also hides any author's notes that have this exact text.
		const muteMessage = Array.from(document.querySelectorAll("p.notes")).filter(a=>a.innerText.includes("You have muted some users on the Archive. Some items may not be shown, and any counts may be inaccurate. You can mute or unmute users on your Muted Users page."))
		if (muteMessage.length > 0) muteMessage[0].hidden = true;
	}

	
	if (window.location.href.includes("confirm_mute") && skipConfirm) {
		//skipConfirm
		document.querySelector(`input[value="Yes, Mute User"]`).click();
	}
	else{
		//add mute buttons
		//console.log("Adding mute button")
		$(`a[rel="author"]`).each((i, a)=>{
				let blockedUsername = a.innerText;
				const button = $(`<a href="https://archiveofourown.org/users/${username}/muted/users/confirm_mute?muted_id=${blockedUsername}" style="color: black;position: absolute;top: 30px;right: 0;margin: 0;">Mute</a>`);
				button.insertBefore(a);
			}
		)
	}
})();