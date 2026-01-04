// ==UserScript==
// @name            GT AccessKeys
// @version         2020.04.25.1
// @description     Hotkeys for Google Translator
// @include         http*://translate.google.com*
// @author          Rainbow-Spike
// @namespace       https://greasyfork.org/users/7568
// @homepage        https://greasyfork.org/ru/users/7568-dr-yukon
// @icon            https://www.google.com/s2/favicons?domain=translate.google.com
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/391951/GT%20AccessKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/391951/GT%20AccessKeys.meta.js
// ==/UserScript==

var pars = [ ".clear", ".src-tts", ".starbutton", ".share-translation-button", ".suggest-edit-button", ".copybutton", ".res-tts", "gt-ct-tts" ],
	keys = [ "D", "O", "F", "H", "E", "C", "T", "B" ],
	attr = "data-tooltip",
	i, node, setter;

function AccessKeys() {
	for ( i = 0; i < pars.length; i++ ) {
		node = document.querySelector ( pars[i] );
		if ( node != null ) {
			node.accessKey = keys[i];
			setter = node.getAttribute ( attr );
			node.setAttribute ( attr, ( setter ? setter + " " : "" ) + "[" + keys[i] + "]");
		};
	};
};

setTimeout ( AccessKeys, 2000 );