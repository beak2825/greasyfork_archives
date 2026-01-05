// ==UserScript==
// @name         SplixPlus - Extension (Mod)
// @namespace    Splixplus.io
// @version      1.5
// @description  Splix.io Extension Zoom and Hacks
// @author       Razor
// @match        http://splix.io/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23208/SplixPlus%20-%20Extension%20%28Mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23208/SplixPlus%20-%20Extension%20%28Mod%29.meta.js
// ==/UserScript==

var s = document.createElement('script');
s.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
s.onload = function() {
    var s = document.createElement('script');
	s.src = 'https://greasyfork.org/scripts/23245-headsplix-io/code/headSplixio.js';
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
	(document.head || document.documentElement).appendChild(s);
};
(document.head || document.documentElement).appendChild(s);

	