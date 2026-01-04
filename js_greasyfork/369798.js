// ==UserScript==
// @name        Sale To Bank

// @namespace    https://your.homepage/
// @version      1.1.6
// @description  enter something useful
// @author        Omer Ben Yosef
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       Omer Ben Yosef
// @include      https://trophymanager.com/transfer/*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/369798/Sale%20To%20Bank.user.js
// @updateURL https://update.greasyfork.org/scripts/369798/Sale%20To%20Bank.meta.js
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
    $('.Val').remove();
	$("tr.header").append("<th class='Val' title='' style='width: 40px; cursor: pointer;''>Val</th>");
    $('.Wor').remove();
	$("tr.header").append("<th class='Wor' title='' style='width: 40px; cursor: pointer;''>Wor</th>");

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
                var arrary = [];
                for (var i = 0 ; i < transfer_info_ar.length; i ++)
                { var player_index = transfer_info_ar[i]["id"] ;
                  var player_asi = transfer_info_ar[i]["asi"];
                  var rec = parseInt(transfer_info_ar[i]["rec"])/2 ;
                  var bid = transfer_info_ar[i]["bid"]
                  arrary.push([player_index,player_asi,rec,bid]);
                }
                 function Last_Season_Avg_Ti(TI,Season_TI,session,months,playerID,wage) {

                    if ((months + 1) >=  session)
                    { return 0 ;
                    }
                    else
                    { var This_Season = months + 1;
                      var Last_Season =  session - This_Season ;
                      if ((playerID > 122711600) || (wage < 30001))
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
                function return_starting_blooming(Last_Season_Avg_Ti,Season_Avg,SI,age,rec)
                        {var Age = parseInt(age);
                         var SIN = parseInt(SI.replace(",", "")) ;
                         if ((Age == 20)&&(rec > 2.5)&&(rec <4.0)&&(Last_Season_Avg_Ti < 10)&&(Season_Avg == 8)&&(SIN < 16000)&&(SIN > 6999)) {return "⚔⚔⚔";}
                         if ((Age == 21)&&(rec > 2.5)&&(rec <4.0)&&(Last_Season_Avg_Ti < 10)&&(Season_Avg == 7)&&(SIN < 16000)&&(SIN > 6999)) {return "⚔⚔⚔";}
                         if ((Age == 20)&&(rec > 2.0)&&(rec <3.5)&&(Last_Season_Avg_Ti < 10)&&(Season_Avg == 7)&&(SIN < 7000)&&(SIN > 1999)) {return "⚔⚔⚔";}
                         if ((Age == 21)&&(rec > 2.0)&&(rec <3.5)&&(Last_Season_Avg_Ti < 10)&&(Season_Avg == 6)&&(SIN < 7000)&&(SIN > 1999)) {return "⚔⚔⚔";}

                         if ((Age == 18)&&(rec > 1.5)&&(rec <3.5)&&(Season_Avg > 9)&&(Season_Avg<20)) {return "$$$" ; }
                         if ((Age == 19)&&(rec > 1.5)&&(rec <3.5)&&(Season_Avg > 5)&&(Season_Avg<10)) {return "$$$" ; }
                         if ((Age == 20)&&(rec > 2.0)&&(rec <4.0)&&(Season_Avg > 5)&&(Season_Avg<9)&&(SIN > 1999) &&(SIN<16000)&&(Last_Season_Avg_Ti < 10)) {return "$$$" ; }
                         if ((Age == 21)&&(rec > 2.0)&&(rec <4.0)&&(Season_Avg > 5)&&(Season_Avg<8)&&(SIN > 1999) &&(SIN<16000)&&(Last_Season_Avg_Ti < 10)) {return "$$$"; } else {return "----";}
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
                        wage = wage.slice(19);
                        wage = wage.replace(",", "") ;
                        return parseInt(wage.replace(",", ""));;
                }
                   function AVG_Check(AVG_TI,Player_Months,session,player_wage) {
                    if (player_wage == 30000) {return 0;}
                     AVG_TI = AVG_TI.toFixed(1) ;
                    if (Player_Months + 1 >  session - 1) {return AVG_TI ;} else {return "A_" + (AVG_TI.toString())  ;}
                }
                   function fixAsi(str_asi) {
                    var num = str_asi ;
                    var firstnum = parseInt(num);
                    var index_two = num.indexOf(",") + 1;
                    var string_new = num.slice(index_two,num.length);
                    var second_num = parseInt(string_new)
                    var indexsss = num.indexOf(",");
                    if (indexsss != -1)
                    ASI = firstnum*1000 + second_num ;
                    else{
                   ASI = firstnum ;
                    }
                    return ASI

                   }

                function sale_to_bank_val(resultado,player,avg_ti) {
                 averge_ti = avg_ti.toString();
                 if (averge_ti.indexOf("A") > -1) {
                             averge_ti = 3
                             averge_ti = parseFloat(averge_ti)
                  }
                 else {
                             averge_ti = parseFloat(averge_ti)
                 }
                 Ti_Diff = ((averge_ti/10)*6).toFixed(1)
                 Ti_Diff = parseFloat(Ti_Diff)

                 Asi = fixAsi(resultado.player.skill_index)
                 Skill = parseFloat(Math.pow((Asi* Math.pow(2,9)*Math.pow(5,4)*Math.pow(7,7)),(1/7)) + Ti_Diff)
                 Asi = Math.pow((Skill*0.023359),6.99998)
                 age = parseInt(resultado.player.age) + (resultado.player.months/12) + 0.5
                 val = Asi*500*Math.pow((25/age),2.5)
                 wage = (return_wage(resultado.player.wage)*6/1000000).toFixed(1)
                 income = ((val - player[3])/(1000000) - wage)
                 return income.toFixed(0)

                }
                function check_worth_income(val) {
                if (val > 14) {return "⚔⚔⚔";}
                if (val > 7) {return "$$$" ; }
                else {return "----";}
                }
                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right Val' style='padding-right:5px;'><span>" + sale_to_bank_val(resultado,arrary[id_index(resultado.player.player_id,arrary)],AVG_Check (( Season_TI(player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)),SI(resultado.player.skill_index),return_wage(resultado.player.wage),19.836)/session),parseInt(resultado.player.months),session,return_wage(resultado.player.wage))) + "</span></td>");
                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right Wor' style='padding-right:5px;'><span>" + check_worth_income(sale_to_bank_val(resultado,arrary[id_index(resultado.player.player_id,arrary)],AVG_Check (( Season_TI(player_postion(transfer_info_ar,id_index(resultado.player.player_id,arrary)),SI(resultado.player.skill_index),return_wage(resultado.player.wage),19.836)/session),parseInt(resultado.player.months),session,return_wage(resultado.player.wage)))) + "</span></td>");



			}
		}
		xhr.send(params);
	});
}
// @match        http://*/*
// @grant        none
// ==/UserScript==
