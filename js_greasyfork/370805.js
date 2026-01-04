// ==UserScript==
// @namespace https://jeroenpelgrims.com
// @name Standaard plus
// @name:nl Standaard plus
// @description Toggle Standaard premium article classes.
// @description:nl Toggle Standaard premium article classes.
// @version  1.1.1
// @grant    none
// @include http://*.standaard.be/*
// @downloadURL https://update.greasyfork.org/scripts/370805/Standaard%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/370805/Standaard%20plus.meta.js
// ==/UserScript==

function toggleClasses() {
	const toHide = [
		'#porous-paywall-content',
		'#porous-paywall-shortened-content',
		'span.label_plus'
	];

	document
		.querySelectorAll(toHide.join(','))
		.forEach(element => element.classList.toggle('is-hidden'));
	document.body.classList.remove('is-closed-article');
	document.querySelectorAll('.article--plus').forEach(element => element.classList.toggle('article--plus'));
}

toggleClasses();