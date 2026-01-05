// ==UserScript==
// @name         Kmak Skin Changer
// @namespace    Kmak Private
// @version      3.0
// @description  W for Changer X for change Q = die ESC = respawn
// @author       Kmak
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://slither.io/
// @run-at document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/19985/Kmak%20Skin%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/19985/Kmak%20Skin%20Changer.meta.js
// ==/UserScript==

var s = document.createElement('script');
s.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
s.onload = function() {
	document.head.innerHTML += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">';
	var s = document.createElement('script');
	s.src = 'https://cdn.rawgit.com/kmakblob/DD/master/slither.js';
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
	(document.head || document.documentElement).appendChild(s);
};
(document.head || document.documentElement).appendChild(s);