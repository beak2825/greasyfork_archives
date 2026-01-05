// ==UserScript==
// @name        Auto Focus Username Field
// @namespace   ClintPriest.com
// @description Attempts to locate the username input box and change focus to it, will briefly change the background color of the field green when it activates.
// @include     http://*
// @include     https://*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4497/Auto%20Focus%20Username%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/4497/Auto%20Focus%20Username%20Field.meta.js
// ==/UserScript==

var names = new Set([ 'username','login_name','user','login' ]);

function findFocus(e) {
	console.log('load %o', e);
	for(var x of names.values()) {
		var elem = document.querySelector('INPUT[name*=' + x + ']');
		if(elem) {
			elem.origbackgroundColor= elem.style.backgroundColor;
			elem.style.backgroundColor = '#A0FFA0';
			elem.focus();
			elem.selectionStart = 0;
			elem.selectionEnd = 999;

			setTimeout(function() {
				elem.style.backgroundColor = elem.origbackgroundColor;
				delete elem.origbackgroundColor;
			}, 2000);
			break;
		}
	}
	window.removeEventListener('DOMContentLoaded', findFocus);
};

window.addEventListener('DOMContentLoaded', findFocus);
