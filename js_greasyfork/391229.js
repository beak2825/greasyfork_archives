/// ==UserScript==
// @name         Bidding Team
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
// @downloadURL https://update.greasyfork.org/scripts/391229/Bidding%20Team.user.js
// @updateURL https://update.greasyfork.org/scripts/391229/Bidding%20Team.meta.js
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


     $('.BT').remove();

	$("tr.header").append("<th class='BT' title='' style='width: 300px; cursor: pointer;''>Bidding Team</th>");


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
                  var bid = transfer_info_ar[i]["bid"];
                  var pos = transfer_info_ar[i]["fp"];
                  var rec = transfer_info_ar[i]["rec"];
                  bidder_id = parseInt(bidder_id);
                  bid = parseInt(bid);

                  arrary.push([player_index,player_asi,bidder_id ,bid,pos,rec]);
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

          


                function who_bid(info) {

                    bidder_id = info[2];
                    var BID_Full = info[3];
                    var Bid = BID_Full / 1000000;
                    var bidders_array = ['IDF' , 'svechnik F.C.' , 'Blau-Grana' , 'Manchester United!' , 'Maccbi Milan' , 'bar united' , 'BANDOS' , 'beitar-liron' , 'Maccabi Nissim' , 'Vegetables' , 'makabi karabanga' , 'F.C. Football Club' , 'HBS' , 'Athletic Sājūr' , 'www.Zion11.com' , 'Even Yehuda F.K.' , 'Royf FC' , 'Freedom Petah Tikva' , 'f.c elgrabli' , 'FC Paldick', 'wallas' , 'F.C. TOTO' , 	'*AC MILAN 30-12-2015*' , 'Wild Boys' , 'Maccabi Tiberias' , 'Narkis' ]
                    var bidders_ids = [332649 , 43394 , 16050 , 880590 , 1837991 , 3420502 , 3191402 , 2771174 , 2302436 , 843434 , 470995 , 112312 , 38183 , 3691727 , 103311 , 2536659 , 3625504 , 3143314 , 3420509 , 4022954 , 15123 , 1149114 , 1964714 , 3072401 , 1166957 , 1342071]
                    var index_bid = bidders_ids.indexOf(bidder_id);
                    if (index_bid > -1 && Bid > 24) {
                       return bidders_array[index_bid];
                    }
                    else {
                        return "-----------";
                    }

                }


                var bidder_team = who_bid(arrary[id_index(resultado.player.player_id,arrary)]);

                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right BT' style='padding-right:5px;'><span>" + bidder_team  + "</span></td>");


			}
		}
		xhr.send(params);
	});
}
