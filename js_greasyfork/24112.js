// ==UserScript==
// @name        Trophy Manager - Hide/Show Players
// @namespace   https://greasyfork.org/it/users/74311
// @description Hide/Show Players in players page
// @include     http://trophymanager.com/players/
// @include     http://trophymanager.com/players/#/a/true/b//
// @include     http://trophymanager.com/players/#/a/true/b/true/
// @include     http://trophymanager.com/players/#/a//b/true/
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/24112/Trophy%20Manager%20-%20HideShow%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/24112/Trophy%20Manager%20-%20HideShow%20Players.meta.js
// ==/UserScript==

function fallo()
{
	var k = 0;
	$("#sq > table > tbody > tr:not(.header):not(:has(td.splitter))").each(function()
    {
		$(this).addClass('elemento');
		$(this).attr('id', "tr_id" + k);
		$(this).before("<tr><td class='align_left' colspan=99><a class='mostra' href='javascript:void(0)' onclick=\"$('#tr_id" + k +"').show();\">" + $(this).find("div.name a").html() + "</a></td></tr>");

		k++;
	});
    $('.mostra').hide();
}

$(document).ready(function()
{
	rif = "toggle_a_team";
	if ($("#toggle_b_team").length)
		rif = "toggle_b_team";
	
	$("#" + rif).after("<a id='a_show' href=\"javascript:void(0)\" onclick=\"$('#a_show').hide(); $('#a_hide').show(); $('.mostra').hide(); $('.elemento').show();\">Show Players</a>");
	$("#" + rif).after("<a id='a_hide' href=\"javascript:void(0)\" onclick=\"$('#a_show').show(); $('#a_hide').hide(); $('.mostra').show(); $('.elemento').hide();\">Hide Players</a>");

	fallo();
	$('#a_show').hide();


	$("#sq").on("click", "table > tbody > tr.header", function()
	{
		fallo();
		$('#a_show').hide();
		$('#a_hide').show();
	});

	$("#toggle_a_team").click(function()
	{
		fallo();
		$('#a_show').hide();
		$('#a_hide').show();
	});

	if ($("#toggle_b_team").length)
	{
		$("#toggle_b_team").click(function()
		{
			fallo();
			$('#a_show').hide();
			$('#a_hide').show();
		});
	}
});