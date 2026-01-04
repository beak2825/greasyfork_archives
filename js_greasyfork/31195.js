// ==UserScript==
// @name         UTA
// @namespace    EPS Developments
// @version      0.1
// @description  try to take over the world!
// @author       EPS
// @match        https://spms.indot.in.gov/uta/Dashboard/*
// @match        https://spms.indot.in.gov/rra/Dashboard/*
// @match        https://spmsqa.indot.in.gov/uta/Dashboard/*
// @match        https://spmsqa.indot.in.gov/rra/Dashboard/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/31195/UTA.user.js
// @updateURL https://update.greasyfork.org/scripts/31195/UTA.meta.js
// ==/UserScript==

(function() {	
    'use strict';
    
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	// We are adding some functionality to the UTA/RRA apps.
    //
	//////////////////////////////////////////////////////////////////////////////////////////////
	
    // Load Admin page in new tab
	var adminIcon = $('div[title="Admin Dashboard"]');
	console.log('adminIcon.length: ' + adminIcon.length);
	
    unsafeWindow.OpenWindow = null;
	unsafeWindow.OpenWindow = function OpenWindow(n) {
		var w = window.open(n, "_blank");
		w.focus();
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
})(); // End anonymous wrapper function