// ==UserScript==
// @name				 Typingclub Hack
// @namespace		https://github.com
// @version			0.1
// @description	uefa's typingclub hack
// @author			 You
// @match				*://*.typingclub.com/sportal/*.play
// @grant				none
// @downloadURL https://update.greasyfork.org/scripts/397822/Typingclub%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/397822/Typingclub%20Hack.meta.js
// ==/UserScript==








function randomInteger(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	var randint = Math.floor(Math.random() * (max - min + 1)) + min;
	return randint;
}

function randomDelay() {
	var randint = randomInteger(40, 101);
	return 2.01 * Math.pow(2, 0.070854 * randint);
}
function typeShit(c) {
	if(c.charCodeAt(0) == 10 || c.charCodeAt(0) == 13) {
		typeShit("'");
		c = c.substr(1);
	}
	console.log(c[0]);
	var input = document.querySelector('input');
	input.value = c[0];
	var inputEvent = new Event('input', {
		'bubbles': true,
		'cancellable': true
	});
	input.dispatchEvent(new Event('focus'));
	input.dispatchEvent(inputEvent);
	var key_code = c[0].charCodeAt(0);
	var keydownEvent = new KeyboardEvent('keydown', {
		keyCode: key_code
	});
	input.dispatchEvent(keydownEvent);
	var keyupEvent = new KeyboardEvent('keyup', {
		keyCode: key_code
	});
	input.dispatchEvent(keyupEvent);
	if(c.substr(1) == "") {
		checkNext();
		return;
	}
	setTimeout(typeShit, randomDelay(), c.substr(1));
}
function checkVariable() {
	if(typeof core.text !== 'undefined') {
		setTimeout(typeShit, 1000, core.text);
	} else {
		setTimeout(checkVariable, 250);
	}
}
function checkNext() {
	if(document.getElementsByClassName("navbar-continue").length > 0) {
		delete core.text;
		document.getElementsByClassName("navbar-continue")[0].click();
		checkVariable();
	} else {
		setTimeout(checkNext, 250);
	}
}
window.addEventListener('load', checkVariable);