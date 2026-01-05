// ==UserScript==
// @name         VIPBox Annoyance remover
// @namespace    http://www.vipboxtv.me/
// @version      0.2
// @description  Get rid of left over ad remnants (i.e. links asking you to close ads or pop-unders). (Ad-blocking still required, recommended to disable 1st party scripts on this site.)
// @author       You
// @match        www.vipboxtv.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28574/VIPBox%20Annoyance%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/28574/VIPBox%20Annoyance%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
	window.atob = function(astring) {
		console.log("atob blocked");
		return null;
	};
    setTimeout(function() {
        $(".text-success").has("#countdownnum").remove();
        $("a[onclick^='removeOverlayHTML()']").remove();
    }, 1000);
})();