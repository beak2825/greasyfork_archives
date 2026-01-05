// ==UserScript==
// @name           Enable Form Autocomplete
// @namespace      http://armeagle.nl
// @description    Some websites use the form attribute 'autocomplete=off' so browsers won't store the login details. This script enables autocomplete.
// @include        http*
// @exclude        https://*rabobank*
// @version 0.0.1.20140705065007
// @downloadURL https://update.greasyfork.org/scripts/3023/Enable%20Form%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/3023/Enable%20Form%20Autocomplete.meta.js
// ==/UserScript==


var inputs = document.querySelectorAll('input[autocomplete="off"]');
if ( inputs != null ) {
	for (var ind=0; ind < inputs.length; ind++) {
		// console.log(inputs[ind]);
		inputs[ind].removeAttribute('autocomplete');
	}
}