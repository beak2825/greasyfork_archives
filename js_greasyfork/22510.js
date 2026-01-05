// ==UserScript==
// @name         Tab Size Switcher
// @namespace    https://greasyfork.org/users/649
// @version      1.0
// @description  Switches tab size css to 4
// @author       Adrien Pyke
// @include      http*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22510/Tab%20Size%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/22510/Tab%20Size%20Switcher.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var style = document.createElement('style');
	style.textContent = '* { -moz-tab-size: 4; -webkit-tab-size: 4; -o-tab-size: 4; tab-size: 4; }';
	document.head.appendChild(style);
})();