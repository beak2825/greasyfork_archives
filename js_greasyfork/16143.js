// ==UserScript==
// @name         [Ned] Team Management Modifications
// @namespace    localhost
// @version      2.1
// @description  Team Management Modifications
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/Schedule/Settings/Teams.aspx
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16143/%5BNed%5D%20Team%20Management%20Modifications.user.js
// @updateURL https://update.greasyfork.org/scripts/16143/%5BNed%5D%20Team%20Management%20Modifications.meta.js
// ==/UserScript==

//INFO BOX ------------------------------------------------------------------------------------------------------------------------------------------------------------
var addons = "-Priority Background Color<br>-Scroll Button at Top & Bottom<br>-Change All Priorites Function<br>-Highlight Enabled/Disabled Team Option<br>-Relocated Delete Team Button<br><br>v1.0 - 7/2/15<br>Ned@Autoloop.com";
$('#MainContainer').append('<style type="text/css">#controls { position:fixed;float:right;border-radius:3px;border-style:solid;border-color:white;border-width:2px;top:173px;right:2px;width:250px;padding:1px;margin:1px;z-index:-1;background-color:#BDBDBD;text-align: center;}</style><div id="controls"><br/><br/><b>Ned-Tools</b><br>' + addons + '<br></div>');

//BACKGROUND COLOR CHANGER ------------------------------------------------------------------------------------------------------------------------------------------------------------
function _changeCellBG(offset) {
	$('select').each(function(index) {
		var value = $(this).val();
		if(value===0) //Never
			$('#ctl00_ctl00_ctl00_Main_Main_Main_fsTeamSkills > table > tbody > tr:nth-child(' + (index+offset) + ') > td:nth-child(1)').css('background-color', '#BDBDBD'); //gray
		if(value==1) //As Needed
			$('#ctl00_ctl00_ctl00_Main_Main_Main_fsTeamSkills > table > tbody > tr:nth-child(' + (index+offset) + ') > td:nth-child(1)').css('background-color', '#819FF7'); //Blue
		if(value==127) //Usually
			$('#ctl00_ctl00_ctl00_Main_Main_Main_fsTeamSkills > table > tbody > tr:nth-child(' + (index+offset) + ') > td:nth-child(1)').css('background-color', '#A9F5BC'); //Green
		if(value==255) //Always
			$('#ctl00_ctl00_ctl00_Main_Main_Main_fsTeamSkills > table > tbody > tr:nth-child(' + (index+offset) + ') > td:nth-child(1)').css('background-color', '#F5A9A9'); //Red
	});
}
//On Page Load
_changeCellBG(-1);
//On Change
$( "select" ).change(function() {
	_changeCellBG(-2);
});

//ADD SCROLL BUTTONS (TOP AND BOT) ------------------------------------------------------------------------------------------------------------------------------------------------------------
$('#RightContent > h1').append('<a onclick="window.scrollTo(0,document.body.scrollHeight);" class="float_right text_center open_modal btn-default GeneratedButtonLink">Scroll to Bottom</a>');
$('#GlobalFooter > div').append('<a onclick="window.scrollTo(0, 0);" class="float_right text_center open_modal btn-default GeneratedButtonLink">Scroll to Top</a>');

//MOVE DELETE BUTTON ------------------------------------------------------------------------------------------------------------------------------------------------------------
$('#btnDeleteTeam').appendTo('#RightContent > fieldset > table > tbody > tr > td:nth-child(2)');

//HIGHLIGHT CHECK BOX IF DISABLED ------------------------------------------------------------------------------------------------------------------------------------------------------------
function _changeChkBG() {
	if ($('#chkDisabled').prop('checked')) //Checked
		$('#fsTeamSettings > table > tbody > tr:nth-child(1)').css('background-color', '#F5A9A9'); //Red
	if (!$('#chkDisabled').prop('checked')) //Not Checked
		$('#fsTeamSettings > table > tbody > tr:nth-child(1)').css('background-color', '#A9F5BC'); //Green
}
//On Page Load
_changeChkBG();
//On Change
$( "#chkDisabled" ).change(function() {
	_changeChkBG();
});

//CHANGE ALL DROP BOX ------------------------------------------------------------------------------------------------------------------------------------------------------------
//Gui
$('#fsTeamSettings > table').append('<tr><td>Change All Priorities</td><td><select id="selectOption"><option value="0">Never</option> <option value="1">As Needed</option> <option value="127">Usually</option> <option value="255">Always</option></select><a id="runClick" class="btn-default">Change All</a></td></tr>');
//Function
$('#runClick').click(function () { 
	$("select:gt(2)").each(function() { //:gt(2) = skips first two drop boxes
		$(this).val($("#selectOption").val());
	});
	_changeCellBG()
});