// ==UserScript==
// @name         FMU Add routine to transfer list
// @version      0.3
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       Emiliano
// @include      http://ultra.trophymanager.com/transfer/*
// @grant        all
// @description  en
// @namespace https://greasyfork.org/en/users/13375-emiliano
// @downloadURL https://update.greasyfork.org/scripts/11522/FMU%20Add%20routine%20to%20transfer%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/11522/FMU%20Add%20routine%20to%20transfer%20list.meta.js
// ==/UserScript==

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
    
	$("tr.header").append("<th class='routine' title='' style='width: 40px; cursor: pointer;''>XP</th>");

	var params = "";
	$("div.player_name > a").each(function(e, player) 
	{
		params = "player_id="+$(player).attr("player_link");

		var xhr = new XMLHttpRequest(); 
		xhr.open("POST", "http://trophymanager.com/ajax/tooltip.ajax.php", true);
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