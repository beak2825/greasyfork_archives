// ==UserScript==
// @name     Password-Be-Gone
// @version  3
// @grant    none
// @namespace https://dueldu.neocities.org/
// @license  MIT
// @include  https://chrysanthemumgarden.com/*
// @description Bypasses the need to enter the password for every single chapter
// @downloadURL https://update.greasyfork.org/scripts/465001/Password-Be-Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/465001/Password-Be-Gone.meta.js
// ==/UserScript==
/**
 * This is what the password submit button does once clicked. It gets the two
 * important information fields. The one with the input password and the one
 * with the “nonce” (number used once). These two information are necessary to
 * be able to open the novel site.
 */
function storePassword(event) {
	let password = document.getElementById("site-pass").value;
	let nonce = event.target.children["nonce-site-pass"].value;
	
	window.sessionStorage.setItem("password", password);
	window.sessionStorage.setItem("nonce", nonce);
}

/**
 * This is what the next and previous buttons do now.
 * They no longer link to the page but instead submit our password to their
 * link instead.
 */
function formSubmit(event) {
	// Do not let the link change the page
	event.preventDefault();
	
	// Instead, change the page via a form submit
	// To do that, we need the password and nonce
	const password = window.sessionStorage.getItem("password");
	const nonce = window.sessionStorage.getItem("nonce");
	
	// Create the form to submit
	let passwordField = document.createElement("input");
	passwordField.type = "hidden";
	passwordField.name = "site-pass";
	passwordField.value = password;
	
	let nonceField = document.createElement("input");
	nonceField.type = "hidden";
	nonceField.name = "nonce-site-pass";
	nonceField.value = nonce;
	
	let form = document.createElement("form");
	form.method = "POST";
	form.enctype = "multipart/form-data";
	
	// Now let's find out where our button was headed…
	const link = event.currentTarget.href;
	
	form.action = link;
	
	// And now let's put it all together
	form.append(passwordField);
	form.append(nonceField);
	
	document.body.append(form);
	
	// And now finally send over the data
	form.submit();
}

function main() {
	let passwordLock = document.getElementById("password-lock");
	
	// Is there a password-lock element?
	if(passwordLock) {
		// Add my own text to let the user know it worked.
		let msg = document.createElement("b");
		msg.innerText = "Password-Be-Gone has successfully activated! It will remember\
		the password you type in here.";
		passwordLock.previousSibling.append(msg);
		document.getElementsByClassName("button")[0].style.backgroundColor="#5a4fe8";
		// Change what the “SUBMIT PASSWORD” button does
		passwordLock.onsubmit = storePassword;
    // And enter in the already stored password, because why not?
    document.getElementById("site-pass").value = window.sessionStorage.getItem("password");
	}
	// We just assume if it's not password-locked, it's a novel
	else {
		// Leave a message so our user knows it's working
		let msg = document.createElement("h2");
		msg.innerText = "Password-Be-Gone working as intended"
		document.getElementById("main").prepend(msg);
		
		// Look for all our “next” and “previous” buttons…
		let nextButtons = document.getElementsByClassName("nav-next");
		let prevButtons = document.getElementsByClassName("nav-previous");
		
		// … and change what they do, when clicked
		// By iterating through them. The Array.from is JavaScript madness
		Array.from(nextButtons).forEach( (button) => {
			button.onclick = formSubmit;
		});
		Array.from(prevButtons).forEach( (button) => {
			button.onclick = formSubmit;
		});
	}
}

main();
