// ==UserScript==
// @name         SCO: Idle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Idler!
// @author       Amraki
// @match        https://www.starcommanderonline.com/*
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/32377/SCO%3A%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/32377/SCO%3A%20Idle.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';    
    
	jQuery.fn.exists = function(){ return this.length > 0; }; // https://www.kevinleary.net/check-element-exists-jquery/
	
	var box = "";
	setTimeout(addBox, 1000);
	
});

function addBox() {
	console.log("addBox");
	
	box = document.createElement( 'div' );
	box.id = 'displayPrices';
	box.textContent = "Latest Planet Prices";
	$("body").after( box );

	// Make sure screen elements are loaded
	if ($("#displayPrices").exists() && $("#UI_PLAYER").exists() && $("#UI_MESSAGES").exists()) {
		// do nothing to continue
	} else {
		// Try adding the display box again
		setTimeout(addBox, 1000);
		return;
	}
	
	var valueTop = Number($("#UI_PLAYER").css("height").replace(/\D/g, '')) + 50;
	//console.log("valueTop: " + valueTop);
	var valueHeight = ($(document).height() - Number($("#UI_MESSAGES").css("height").replace(/\D/g, ''))) - valueTop;
	//console.log("valueHeight: " + valueHeight);
	
	// Testing static values
	//var valueTop = 281;
	//var valueHeight = 277;

	// Position and style display box
	GM_addStyle(
		' #displayPrices {                            ' +
		'    position: absolute;                      ' +
		'    top: ' + valueTop + 'px;                 ' +
		'    height: ' + valueHeight + 'px;           ' +
		'    z-index: 2;                              ' +
		'    width: 16.7em;                           ' +
		'    font-size: 1.5em;                        ' +
		'    color: white;                            ' +
		'    background-color: rgba(85, 85, 85, 0.3); ' +
		'    text-align: center;                      ' +
		'    display: table-cell;                     ' +
		'    vertical-align: middle;                  ' +
		'    white-space: pre-wrap;                   ' +
		'    border: solid thin white;                ' +
		' } '
	);

	// Start timers
	setInterval(positionBox, 2.5 * 1000);
	setInterval(updatePrices, 30 * 1000);
}

function positionBox() {
	var valueTop = Number($("#UI_PLAYER").css("height").replace(/\D/g, '')) + 50;
	//console.log("valueTop: " + valueTop);
	var valueHeight = ($(document).height() - Number($("#UI_MESSAGES").css("height").replace(/\D/g, ''))) - valueTop;
	//console.log("valueHeight: " + valueHeight);

	GM_addStyle(
		' #displayPrices {                            ' +
		'    top: ' + valueTop + 'px;                 ' +
		'    height: ' + valueHeight + 'px;           ' +
		' } '
	);
}

function updatePrices() {
	if ($(".selling_economy_merchant_profit td:nth-child(2) span").length > 0) {
		//console.log("Latest Planet Prices");
		var temp = "Latest Planet Prices";
		$(".selling_economy_merchant_profit td:nth-child(2) span").each(function(index, val) {
			//console.log(val.innerText + ", " + $(".selling_economy_merchant_profit td:nth-child(1)")[index].innerText.replace(/[\s\d]/g, ''));
			temp = temp + "\n" + val.innerText + ", " + $(".selling_economy_merchant_profit td:nth-child(1)")[index].innerText.replace(/[\s\d]/g, '');
		});
		box.innerHTML = temp;
		//console.log("=====================");
	}
}