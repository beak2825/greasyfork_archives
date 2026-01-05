// ==UserScript==
// @name         [Ned] User Account Multi-Tool / Helper
// @namespace    localhost
// @version      2.1
// @description  User Account Multi-Tool / Helper
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/DealershipSettings/EditUser.aspx*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16142/%5BNed%5D%20User%20Account%20Multi-Tool%20%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/16142/%5BNed%5D%20User%20Account%20Multi-Tool%20%20Helper.meta.js
// ==/UserScript==

if (window.location.href.indexOf('?UserName=') < 0) {

	//Uncheck Generate Password and invoke event
	if ($('#ctl00_ctl00_Main_Main_cbAllowUserPassword').attr('checked')){
		$('#ctl00_ctl00_Main_Main_cbAllowUserPassword').prop('checked', false);
		setTimeout('__doPostBack(\'ctl00$ctl00$Main$Main$cbAllowUserPassword\',\'\')', 0);
	}

	//Copy usernmae to email and vis-versa
	$('#ctl00_ctl00_Main_Main_tfUserName_textBox').on('change keyup paste' , function () {
		var userName = $('#ctl00_ctl00_Main_Main_tfUserName_textBox').val();
		$('#ctl00_ctl00_Main_Main_tfEmailAddress_textBox').val(userName);
	});

	$('#ctl00_ctl00_Main_Main_tfEmailAddress_textBox').on('change keyup paste' , function () {
		var userName = $('#ctl00_ctl00_Main_Main_tfEmailAddress_textBox').val();
		$('#ctl00_ctl00_Main_Main_tfUserName_textBox').val(userName);
	});

	//Disable Welcome Email - BROKEN - STILL SENDS! 8/7 [NED]
	//$('#ctl00_ctl00_Main_Main_cbWelcomeEmail').prop('checked', false);

	//Change Password fields to Text
	$('#ctl00_ctl00_Main_Main_tfNewPassword_textBox').get(0).type='text';
	$('#ctl00_ctl00_Main_Main_tfConfirmPassword_textBox').get(0).type='text';

	//Change Password to last name
	$('#ctl00_ctl00_Main_Main_tfLastName_textBox').on('change keyup paste' , function () {
		var lastName = $('#ctl00_ctl00_Main_Main_tfLastName_textBox').val();
		$('#ctl00_ctl00_Main_Main_tfNewPassword_textBox').val(lastName + '1');
		$('#ctl00_ctl00_Main_Main_tfConfirmPassword_textBox').val(lastName + '1');
	});

	//Change Landing Page to Scheduling
	$('#ctl00_ctl00_Main_Main_ddlLandingPage').val(landingPage);

	//Highlight Enabled Checkboxs
	//--to be added...
	/*
	$(':checkbox').change(function() {
		if($(this).attr('checked'))
			$(this).css('background-color', '#A9F5BC');
	});
        */
}