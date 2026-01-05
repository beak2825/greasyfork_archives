// ==UserScript==
// @name         TI
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// ==UserScript==
// @name         Add routine to transfer list
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       Jhonatan Bianchi
// @include      http://trophymanager.com/transfer/*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/13336/TI.user.js
// @updateURL https://update.greasyfork.org/scripts/13336/TI.meta.js
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
    
	$("tr.header").append("<th class='routine' title='' style='width: 40px; cursor: pointer;''>TI</th>");

	var params = "";
	$("div.player_name > a").each(function(e, player) 
	{
		params = "player_id="+$(player).attr("player_link");

		var xhr = new XMLHttpRequest(); 
		xhr.open("POST", "http://trophymanager.com/ajax/tooltip.ajax.php", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var XHR2 = new XMLHttpRequest(); 
        XHR2.open("POST", "http://trophymanager.com/transfer", true);
		XHR2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
		xhr.onreadystatechange = function()
		{ 
			if (xhr.readyState == 4)
			{
				var resultado = JSON.parse(xhr.responseText);
                var arrary = [];
                for (var i = 0 ; i < transfer_info_ar.length; i ++)
                { var player_index = transfer_info_ar[i]["id"] ;
                  var player_asi = transfer_info_ar[i]["asi"];
                  arrary.push([player_index,player_asi]);
                }
                
                function return_TI(First_Asi,Second_Asi){
                    var num = Second_Asi ;
                    var firstnum = parseInt(num);
                    var index_two = num.indexOf(",") + 1;
                    var string_new = num.slice(index_two,num.length);
                    var second_num = parseInt(string_new)
                    var indexsss = num.indexOf(",");
                    if (indexsss != -1)
                    var ASI_TWO = firstnum*1000 + second_num ; 
                    else
                    var ASI_TWO = firstnum ; 
                   
                    
                    var index = (1/6.99998) ; 
                    var Second_Asi_Skill_Sum = Math.pow(ASI_TWO,index)/0.023359 ;
                    var First_Asi_Skill_Sum = Math.pow(First_Asi,index)/0.023359;
                    First_Asi_Skill_Sum = First_Asi_Skill_Sum.toFixed(1);
                    Second_Asi_Skill_Sum = Second_Asi_Skill_Sum.toFixed(1);
                    var TI = (Second_Asi_Skill_Sum - First_Asi_Skill_Sum)*10 ; 
                    return Math.round(TI) ; 
                    
                    
                }

          
                function id_index(player_idx,arrary_y){
                    for (var i = 0 ; i < arrary_y.length ; i ++){
                       if (player_idx == arrary_y[i][0])
                           return i ;
                    }
                }

                
                
                    
				$("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right routine' style='padding-right:5px;'><span>" + return_TI((arrary[id_index(resultado.player.player_id,arrary)][1]),resultado.player.skill_index)  + "</span></td>");
                
			}
		}
		xhr.send(params);
	});	
}
// @match        http://*/*
// @grant        none
// ==/UserScript==

