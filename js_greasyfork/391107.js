/// ==UserScript==
// @name         Last Year Of Bloom - Profit
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
// @downloadURL https://update.greasyfork.org/scripts/391107/Last%20Year%20Of%20Bloom%20-%20Profit.user.js
// @updateURL https://update.greasyfork.org/scripts/391107/Last%20Year%20Of%20Bloom%20-%20Profit.meta.js
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

    $('.TI').remove();

	$("tr.header").append("<th class='TI' title='' style='width: 40px; cursor: pointer;''>TI</th>");

     $('.LB').remove();

	$("tr.header").append("<th class='LB' title='' style='width: 40px; cursor: pointer;''>AB</th>");

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
                {
                  var player_index = transfer_info_ar[i]["id"] ;
                  var player_asi = transfer_info_ar[i]["asi"];
                  var bidder_id = transfer_info_ar[i]["bidder_id"];
                  var age = transfer_info_ar[i]["age"];
                  var bid = transfer_info_ar[i]["bid"];
                  var pos = transfer_info_ar[i]["fp"];
                  var rec = transfer_info_ar[i]["rec"];
                  bidder_id = parseInt(bidder_id);
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
                      if ((playerID > 111104541) || (wage < 30001))
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
                    var second_num = parseInt(string_new)
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
                return ((Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/(wage_rate))/Math.log(Math.pow(2,7)))).toFixed(1)*10) - 1 ;


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

                function skill_array(array){
                    if (array[2] > 0){return "BID" ;}

                    else
                        return "---";

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

                function Pos_Index(POS) {
                   if (POS[0] == "dc" || POS[1] == "dc") {
                      return "DC";
                   }
                   if (POS[0] == "dr" || POS[1] == "dl" || POS[0] == "dl" || POS[1] == "dr") {
                      return "Full-back";
                   }
                   if (POS[0] == "mr" || POS[1] == "mr" || POS[0] == "mc" || POS[1] == "mc" || POS[0] == "ml" || POS[1] == "ml") {
                      return "Midfielder";
                   }

                   else {
                      return "DM/OM/F";
                   }
                }

                function agent_bid_func(info,TI) {
                    var ASI = info[1]
                    var AGE = info[3]
                    var BID_Full = info[4]
                    var Bid = BID_Full / 1000000;
                    var POS = info[5]
                    var REC = info[6]
                    var age = age_months(AGE);

                    var POS_Catgeoty = Pos_Index(POS);;


                    if ((age[0] > 19 && age[0] < 25) && (TI > 7) && (REC == 8) && (age[1] < 5)) {
                      if (POS_Catgeoty == "DC") {
                         if (Bid < 70) {
                          return "⚔⚔⚔";
                         }
                          else {
                              return "----";
                          }
                      }
                       if (POS_Catgeoty == "Midfielder") {
                           if (Bid < 55) {
                          return "⚔⚔⚔";
                         }
                          else {
                              return "----";
                          }

                      }
                        if (POS_Catgeoty == "Full-back") {
                            if (Bid < 60) {
                         return "⚔⚔⚔";
                         }
                          else {
                              return "----";
                          }
                      }
                       if (POS_Catgeoty == "DM/OM/F") {
                            if (Bid < 45) {
                         return "⚔⚔⚔";
                         }
                          else {
                              return "----";
                          }
                      }
                    }
                    else {
                       return "----";
                    }

                    console.log("========");
                }


                var TI = return_TI((arrary[id_index(resultado.player.player_id,arrary)][1]),resultado.player.skill_index,player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)));
                var last_year_bloom = agent_bid_func(arrary[id_index(resultado.player.player_id,arrary)],TI);

                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right TI' style='padding-right:5px;'><span>" + return_TI((arrary[id_index(resultado.player.player_id,arrary)][1]),resultado.player.skill_index,player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)))  + "</span></td>");

                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right LB' style='padding-right:5px;'><span>" + last_year_bloom  + "</span></td>");


			}
		}
		xhr.send(params);
	});
}
