// ==UserScript==
// @name         Agar.io minimap 2024
// @namespace    http://tampermonkey.net/
// @version      121
// @description  open minimap on agario
// @author       thanghc
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @include     http://agar.io/*
// @include     https://agar.io/*
// @match        *://*.agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505977/Agario%20minimap%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/505977/Agario%20minimap%202024.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$(document).ready(function() {
		$(document).on('keydown', function(e) {
			var key = e.which || e.keyCode;
			if(key == 77) { // key M
				core.playersMinimap(1)
				core.setMinimap(1)
			}
		});
	});
})();
