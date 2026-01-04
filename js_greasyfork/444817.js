// ==UserScript==
// @name         officetimeline
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://online.officetimeline.com/*
// @icon         https://www.officetimeline.com/favicon.ico
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/444817/officetimeline.user.js
// @updateURL https://update.greasyfork.org/scripts/444817/officetimeline.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var css=".watermark-group{ display:none; }"
    var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}
})();