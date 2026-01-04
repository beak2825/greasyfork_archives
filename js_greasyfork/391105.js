/// ==UserScript==
// @name        Big_Names
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// ==UserScript==
// @name         Add routine to transfer list
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       Jhonatan Bianchi
// @include      https://trophymanager.com/transfer/*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/391105/Big_Names.user.js
// @updateURL https://update.greasyfork.org/scripts/391105/Big_Names.meta.js
// ==/UserScript==

var wage_rate = 19.76;

var today = new Date();
var s43 = new Date("11 30 2015 10:30:00 GMT");				// season start
var s43t = new Date("12 01 2015 00:30:00 GMT");				// first training
var day = (today.getTime()-s43t.getTime())/1000/3600/24;
while (day > 84-16/24) day -= 84;
var session = Math.floor(day/7)+1;

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
    $('.LSTI').remove();

	$("tr.header").append("<th class='LSTI' title='' style='width: 40px; cursor: pointer;''>LSTI</th>");

    $('.TI').remove();

	$("tr.header").append("<th class='TI' title='' style='width: 40px; cursor: pointer;''>TI</th>");

         $('.BID').remove();

	$("tr.header").append("<th class='BID' title='' style='width: 60px; cursor: pointer;''>BID</th>");


    if (today.getDay() < 2){
     $('.AVGTI').remove();

	$("tr.header").append("<th class='TI' title='' style='width: 40px; cursor: pointer;''>AVGTI</th>");
    }

	var params = "";
	$("div.player_name > a").each(function(e, player)
	{
		params = "player_id="+$(player).attr("player_link");

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://trophymanager.com/ajax/tooltip.ajax.php", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var XHR2 = new XMLHttpRequest();
        XHR2.open("POST", "https://trophymanager.com/transfer", true);
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
                  var bidder_id = transfer_info_ar[i]["bidder_id"];
                  bidder_id = parseInt(bidder_id);
                  var age = transfer_info_ar[i]["age"];
                  var bid = transfer_info_ar[i]["bid"];
                  var pos = transfer_info_ar[i]["fp"];
                  var rec = transfer_info_ar[i]["rec"];
                                    bid = parseInt(bid);

                  arrary.push([player_index,player_asi,bidder_id , age ,bid,pos,rec]);
                }


                function Last_Season_Avg_Ti(TI,Season_TI,session,months,playerID,wage) {
                    if ((months + 1) >=  session)
                    { return 0 ;
                    }
                    else
                    { var This_Season = months + 1;
                      var Last_Season =  session - This_Season ;
                      if ((playerID > 127657894) || (wage < 30001))
                          return 0;
                      else{
                      return ((Season_TI-(TI*This_Season)) /  Last_Season).toFixed(1) ;
                     }
                    }

                }

                function return_TI(First_Asi,Second_Asi,weight){
                    var num = Second_Asi ;
                    var firstnum = parseInt(num);
                    var index_two = num.indexOf(",") + 1;
                    var string_new = num.slice(index_two,num.length);
                    var second_num = parseInt(string_new) ;
                    var indexsss = num.indexOf(",");
                    if (indexsss != -1)
                    var ASI_TWO = firstnum*1000 + second_num ;
                    else
                    var ASI_TWO = firstnum ;
                   if (weight == 263533760000){
                    var index = (1/6.99998) ;
                    var ch = 0.023359 ;
                    }
                    else
                    { var index = (0.143) ;
                      var ch = 0.02979 ;
                    }
                    var Second_Asi_Skill_Sum = Math.pow(ASI_TWO,index)/ch ;
                    var First_Asi_Skill_Sum = Math.pow(First_Asi,index)/ch;
                    First_Asi_Skill_Sum = First_Asi_Skill_Sum.toFixed(1);
                    Second_Asi_Skill_Sum = Second_Asi_Skill_Sum.toFixed(1);
                    var TI = (Second_Asi_Skill_Sum - First_Asi_Skill_Sum)*10 ;
                    return Math.round(TI) ;
                }
                function player_postion(array,index) {
                    if (array[index]['fp'][0] == "gk")
                        return 48717927500 ;
                    else
                        return 263533760000 ;
                }
                function Season_TI(weight,SI,wage,wage_rate,playerID)
                {
                return ((Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/(wage_rate*0.8))/Math.log(Math.pow(2,7)))).toFixed(1)*10) - 1 ;
                }



                 function return_starting_blooming(Last_Season_Avg_Ti,Season_Avg)
                        {
                         if ((Last_Season_Avg_Ti < 9) && (Last_Season_Avg_Ti > 0))
                             if ((Season_Avg > 10) && (Season_Avg > 0))
                                 return "YES" ;
                             else
                                 return "----";
                         else
                             return "----";
                        }


                function id_index(player_idx,arrary_y){
                    for (var i = 0 ; i < arrary_y.length ; i ++){
                       if (player_idx == arrary_y[i][0])
                           return i ;
                    }
                }


                function SI(skill_index){
                    return parseInt(skill_index.replace(",", ""));

                }


                    function return_wage(wage){
                        wage = wage.slice(19)
                        wage = wage.replace(",", "") ;
                        return parseInt(wage.replace(",", ""));;





                }

                  function age_months(age_str) {
                   var Months = 0;
                    var Years = 0;

                    var age_string = age_str.toString();
                    var months = age_string.split(".");
                    if (months.length == 1) {
                      Months = "00";
                      Years = months[0]
                    }
                    else {
                      if (months[1] == "1") {
                      Months = "10";

                      }
                      else {
                       Months =  months[1]
                      }

                      Years =months[0]
                    }
                    Months = parseInt(Months);
                    Years = parseInt(Years);
                    return [Years,Months];

                }



                function skill_array(array){

                    var AGE = array[3]
                    var BID_Full = array[4]
                    var Bid = BID_Full / 1000000;
                    var REC = array[6] /2 ;
                    var age = age_months(AGE);
                    if ((array[2] > 0) && (Bid > 79) && (REC > 2.0) && (REC < 4.5) && (age[0] < 23)) {
                        return "BID" ;
                    }

                    else
                        return "---";

                 }
                var BID = skill_array(arrary[id_index(resultado.player.player_id,arrary)]);
                var TI = return_TI((arrary[id_index(resultado.player.player_id,arrary)][1]),resultado.player.skill_index,player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)));
                var Last_TI = Last_Season_Avg_Ti(return_TI((arrary[id_index(resultado.player.player_id,arrary)][1]),resultado.player.skill_index,player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary))),Season_TI(player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)),SI(resultado.player.skill_index),return_wage(resultado.player.wage),19.836),session,parseInt(resultado.player.months),parseInt(resultado.player.player_id),return_wage(resultado.player.wage))  ;
                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right LSTI' style='padding-right:5px;'><span>" + Last_Season_Avg_Ti(return_TI((arrary[id_index(resultado.player.player_id,arrary)][1]),resultado.player.skill_index,player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary))),Season_TI(player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)),SI(resultado.player.skill_index),return_wage(resultado.player.wage),19.836),session,parseInt(resultado.player.months),parseInt(resultado.player.player_id),return_wage(resultado.player.wage))   + "</span></td>");

                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right TI' style='padding-right:5px;'><span>" + return_TI((arrary[id_index(resultado.player.player_id,arrary)][1]),resultado.player.skill_index,player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)))  + "</span></td>");

                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right BID' style='padding-right:5px;'><span>" + BID + "</span></td>");


			}
		}
		xhr.send(params);
	});
}
