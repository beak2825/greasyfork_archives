// ==UserScript==
// @name         Slither.io Mods / Slithere.com 6.X
// @version      6.X
// @description  Slither.io Mods, Skins, Create Your Skins
// @author       Slithere.com
// @match        http://slither.io
// @run-at       document-start
// @grant        GM_getResourceText
// @require      http://code.jquery.com/jquery-latest.js
// @namespace Slithere.com
// @downloadURL https://update.greasyfork.org/scripts/412930/Slitherio%20Mods%20%20Slitherecom%206X.user.js
// @updateURL https://update.greasyfork.org/scripts/412930/Slitherio%20Mods%20%20Slitherecom%206X.meta.js
// ==/UserScript==    

var s = document.createElement('script');
s.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
s.onload = function() {
	document.head.innerHTML += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">';
	var s = document.createElement('script');
	s.src = 'http://slithere.com/chrome2/suankizup.js';
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
	(document.head || document.documentElement).appendChild(s);
};
(document.head || document.documentElement).appendChild(s);