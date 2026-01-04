// ==UserScript==
// @name         Cookie Clicker Auto Clicker
// @namespace    https://orteil.dashnet.org/cookieclicker/
// @version      1.0.0
// @description  Merriam Webster Search on Right Click
// @author       Konghe Won
// @include        https://orteil.dashnet.org/cookieclicker/*
// @include        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409921/Cookie%20Clicker%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/409921/Cookie%20Clicker%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function click(){
		document.querySelector("#bigCookie").click()
	}
	setInterval(function (){click()},1);
})();