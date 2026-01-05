// ==UserScript==
// @name         [Ned] Scheduled Maint OpCode Cleaner
// @namespace    localhost
// @version      2.1
// @description  Scheduled Maint OpCode Cleaner
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/Notifications/ScheduledMaintenance/Settings.aspx*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16141/%5BNed%5D%20Scheduled%20Maint%20OpCode%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/16141/%5BNed%5D%20Scheduled%20Maint%20OpCode%20Cleaner.meta.js
// ==/UserScript==

var oldtext = '';
var newtext = '';

//Add GUI
$('#ctl00_ctl00_Main_Main_loopServiceSettings_Fieldset1 > div:nth-child(6)').prepend('<a class="float_right text_center btn-default" id="opCleaner">[BotNed] Clean White Space</a>');

//Function
$('#opCleaner').click(function () {
	var mode = $('#opCleaner').text(); //Link Text determines mode
	if(mode == '[BotNed] Clean White Space') { //Change Text
		oldtext = $('#txtOpCodes').val();
		newtext = oldtext.replace(/\s+/g, ' ');
		$('#txtOpCodes').val(newtext);

		$('#opCleaner').text('[BotNed] Undo Changes');
	}

	if(mode == '[BotNed] Undo Changes') { //Undo
		$('#txtOpCodes').val(oldtext);
		$('#opCleaner').text('[BotNed] Clean White Space');
	}
});