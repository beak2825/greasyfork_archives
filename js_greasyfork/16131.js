// ==UserScript==
// @name         [Ned] Default Trigger Page Mods
// @namespace    localhost
// @version      2.1.1
// @description  Default Trigger Page Mods
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/Default.aspx*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16131/%5BNed%5D%20Default%20Trigger%20Page%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/16131/%5BNed%5D%20Default%20Trigger%20Page%20Mods.meta.js
// ==/UserScript==

//Green/Red Stuff
(function(){
	$('a.ApprovalQueueEnabled > span').prepend('<i class="icon-small icon-alert-alt"></i>');
	$('a.ApprovalQueueDisabled > span').prepend('<i class="icon-small icon-check"></i>');
	$('.ServiceEnabled').css({'background-color': '#AAFFA1  ', 'width': '100%', 'padding-left': '0%', 'border-radius': '10px'});
	$('.ServiceDisabled').css({'background-color': '#FFD3D3  ', 'width': '100%', 'padding-left': '0%', 'border-radius': '10px'});
})();

//$('.ServiceDisabled').fadeToggle();

//Trigger Toggle
$('#ctl00_ctl00_Main_AutoLoopHeader_HeaderUtilityLinks_ulSettings').append('<a id="disabledToggle">Toggle Disabled</a>');
$('#disabledToggle').click(function () { 
	$('.ServiceDisabled').fadeToggle();
});