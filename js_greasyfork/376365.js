// ==UserScript==
// @name        NZBKing Selector Buttons
// @description Adds buttons for selecting/deselecting/inverting checkboxes
// @include     https://www.nzbking.com/*
// @require     https://code.jquery.com/jquery-2.0.0.min.js
// @namespace   mtRoom
// @grant       GM_addStyle
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/376365/NZBKing%20Selector%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/376365/NZBKing%20Selector%20Buttons.meta.js
// ==/UserScript==

$(function() {
	var $dl_btn = $("input[value='Download NZB']");
	if ($dl_btn.length === 0) return false;
	
	$("<input type='button' id='btn_inv' value='Invert Selection'>").insertAfter($dl_btn);
	$("<input type='button' id='btn_des' value='Deselect All'>").insertAfter($dl_btn);
	$("<input type='button' id='btn_sel' value='Select All' style='margin-left: 10px;'>").insertAfter($dl_btn);
	
	// select all
	$("input#btn_sel").click(function () {
		$("input:checkbox").prop('checked', true); 
	});
	
	// deselect all
	$("input#btn_des").click(function () {
		$("input:checkbox").prop('checked', false); 
	});
	
	// invert selection
	$("input#btn_inv").click(function () {
		$("input:checkbox").each(function () {
			$(this).prop('checked', !$(this).prop('checked')); 
		});
	});
});
