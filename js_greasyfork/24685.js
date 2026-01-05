// ==UserScript==
// @name        Hide/Show Players CN
// @namespace   trophymanager.cn
// @description 在球员列表中显示或隐藏球员  Hide/Show Players in players page
// @author      ★ Steekhutzee ★ ™  cn by 太原FC

// @include     *trophymanager.com/players/
// @include     *trophymanager.com/players/#/a/true/b*
// @include     *trophymanager.com/players/#/a/true/b/true*
// @include     *trophymanager.com/players/#/a//b/true*
// @version     1.3
// @downloadURL https://update.greasyfork.org/scripts/24685/HideShow%20Players%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/24685/HideShow%20Players%20CN.meta.js
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
	
	$("#" + rif).after("<a id='a_show' href=\"javascript:void(0)\" onclick=\"$('#a_show').hide(); $('#a_hide').show(); $('.mostra').hide(); $('.elemento').show();\">显示球员信息</a>");
	$("#" + rif).after("<a id='a_hide' href=\"javascript:void(0)\" onclick=\"$('#a_show').show(); $('#a_hide').hide(); $('.mostra').show(); $('.elemento').hide();\">隐藏球员信息</a>");

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