// ==UserScript==
// @name         Add routine to transfer list
// @description  转会列表加入经验值
// @version      0.4
// @require https://greasyfork.org/scripts/24686-jquery-min/code/jquerymin.js?version=156920
// @author       Jhonatan Bianchi，cn by 太原FC
// @include      *trophymanager.com/transfer/*
// @grant        none
// @namespace   trophymanager.cn
// @downloadURL https://update.greasyfork.org/scripts/24687/Add%20routine%20to%20transfer%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/24687/Add%20routine%20to%20transfer%20list.meta.js
// ==/UserScript==

jQuery.noConflict(true);

unsafeWindow.jQuery(document).ajaxComplete(function(event, xhr, settings)
{   
    rebindClicks();
    
    if (settings.url === "/ajax/transfer.ajax.php")
    {
        calcularRotinas();
    }
});

function rebindClicks()
{
    $.each($('#pages').find('span'), function(index, span) 
    {
        var clickAntigo = $(span).attr('onclick');
		$(span).removeAttr('onclick');
        $(span).off('click');
        $(span).on('click', function()
                   {
                       eval(clickAntigo);
                       calcularRotinas();
                       rebindClicks();
                   });
	});
}

function calcularRotinas()
{
  $('.routine').remove();
    
	$("tr.header").append("<th class='routine' title='' style='width: 40px; cursor: pointer;''>经验</th>");

	var params = "";
	$("div.player_name > a").each(function(e, player) 
	{
		params = "player_id="+$(player).attr("player_link");

		var xhr = new XMLHttpRequest(); 
		xhr.open("POST", "https://trophymanager.com/ajax/tooltip.ajax.php", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function()
		{ 
			if (xhr.readyState == 4)
			{
				var resultado = JSON.parse(xhr.responseText);

				$("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right routine' style='padding-right:5px;'><span>" + resultado.player.routine + "</span></td>");
			}
		}
		xhr.send(params);
	});	
}