// @grant        none
// ==/UserScript==// ==UserScript==
// @name        Rec Transfer List V1.1 - 4.9+ Age 21

// @namespace    https://your.homepage/
// @version      1.1.2
// @description  enter something useful
// @author        Omer Ben Yosef
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       Omer Ben Yosef
// @include      https://trophymanager.com/transfer/*
// @include      http://trophymanager.com/transfer/*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/390783/Rec%20Transfer%20List%20V11%20-%2049%2B%20Age%2021.user.js
// @updateURL https://update.greasyfork.org/scripts/390783/Rec%20Transfer%20List%20V11%20-%2049%2B%20Age%2021.meta.js
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
    $('.FavPos1').remove();
	$("tr.header").append("<th class='FavPos1' title='' style='width: 40px; cursor: pointer;''>Fav_1</th>");
    $('.FavPos2').remove();
	$("tr.header").append("<th class='FavPos2' title='' style='width: 40px; cursor: pointer;''>Fav_2</th>");
    $('.BUY').remove();
	$("tr.header").append("<th class='FavPos2' title='' style='width: 40px; cursor: pointer;''>BUY</th>");

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

                var weightRb = [[	0.10476131	,	0.05214691	,	0.07928798	,	0.14443775	,	0.13140328	,	0.06543399	,	0.07762453	,	0.06649973	,	0.05174317	,	0.02761713	,	0.12122597	,	0.01365182	,	0.02547069	,	0.03869574	],	// DC
                [	0.07660230	,	0.05043295	,	0.11528887	,	0.11701021	,	0.12737497	,	0.07681385	,	0.06343039	,	0.03777422	,	0.10320519	,	0.06396543	,	0.09155298	,	0.01367035	,	0.02554511	,	0.03733318	],	// DL/R
                [	0.08289553	,	0.08655174	,	0.07386703	,	0.09784055	,	0.08807642	,	0.09017265	,	0.09391390	,	0.08893449	,	0.04707010	,	0.05961795	,	0.05373727	,	0.05013894	,	0.05768539	,	0.02949804	],	// DMC
                [	0.06705156	,	0.06600599	,	0.10002073	,	0.08249862	,	0.09719526	,	0.09243450	,	0.08504033	,	0.06129130	,	0.10295145	,	0.08088686	,	0.04665721	,	0.03841339	,	0.05222570	,	0.02732710	],	// DML/R
                [	0.07333243	,	0.08171847	,	0.07197804	,	0.08469622	,	0.07098103	,	0.09554048	,	0.09470328	,	0.09576006	,	0.04729121	,	0.07092367	,	0.04588383	,	0.05986604	,	0.07170498	,	0.03562024	],	// MC
                [	0.06527363	,	0.06410270	,	0.09701305	,	0.07406706	,	0.08563595	,	0.09648566	,	0.08651209	,	0.06357183	,	0.10819222	,	0.07386495	,	0.03245554	,	0.05430668	,	0.06572005	,	0.03279859	],	// ML/R
                  [	0.07842736	,	0.07744888	,	0.07201150	,	0.06734457	,	0.05002348	,	0.08350204	,	0.08207655	,	0.11181914	,	0.03756112	,	0.07486004	,	0.06533972	,	0.07457344	,	0.09781475	,	0.02719742	],	// OMC
                [	0.06145375	,	0.06545378	,	0.10803536	,	0.06421508	,	0.06927526	,	0.09232981	,	0.07763931	,	0.07001035	,	0.11307331	,	0.07398351	,	0.04248486	,	0.07062713	,	0.07038293	,	0.02403557	],	// OML/R
                [	0.07339710	,	0.05295200	,	0.07641981	,	0.01110784	,	0.01149133	,	0.06383764	,	0.07782980	,	0.07632566	,	0.02708970	,	0.07771063	,	0.12775187	,	0.15539719	,	0.12843583	,	0.03845360	],	// F

                [	0.07466384	,	0.07466384	,	0.07466384	,	0.14932769	,	0.10452938	,	0.14932769	,	0.10452938	,	0.10344411	,	0.07512610	,	0.04492581	,	0.04479831	]];

                var weightR = [[0.653962303361921,  0.330014238020285, 0.562994547223387, 0.891800163983125,  0.871069095865164,  0.454514672470839, 0.555697278549252, 0.42777598627972,  0.338218821750765, 0.134348455965202, 0.796916786677566, 0.048831870932616, 0.116363443378865, 0.282347752982916],	//DC
			   [0.565605120229193,  0.430973382039533, 0.917125432457378, 0.815702528287723,  0.99022325015212,   0.547995876625372, 0.522203232914265, 0.309928898819518, 0.837365352274204, 0.483822472259513, 0.656901420858592, 0.137582588344562, 0.163658117596413, 0.303915447383549],	//DL/R
			   [0.55838825558912,   0.603683502357502, 0.563792314670998, 0.770425088563048,  0.641965853834719,  0.675495235675077, 0.683863478201805, 0.757342915150728, 0.473070797767482, 0.494107823556837, 0.397547163237438, 0.429660916538242, 0.56364174077388,  0.224791093448809],	//DMC
			   [0.582074038075056,  0.420032202680124, 0.7887541874616,   0.726221389774063,  0.722972329840151,  0.737617252827595, 0.62234458453736,  0.466946909655194, 0.814382915598981, 0.561877829393632, 0.367446981999576, 0.360623408340649, 0.390057769678583, 0.249517737311268],	//DML/R
			   [0.578431939417021,  0.778134685048085, 0.574726322388294, 0.71400292078636,   0.635403391007978,  0.822308254446722, 0.877857040588335, 0.864265671245476, 0.433450219618618, 0.697164252367046, 0.412568516841575, 0.586627586272733, 0.617905053049757, 0.308426814834866],	//MC
			   [0.497429376361348,  0.545347364699553, 0.788280917110089, 0.578724574327427,  0.663235306043286,  0.772537143243647, 0.638706135095199, 0.538453108494387, 0.887935381275257, 0.572515970409641, 0.290549550901104, 0.476180499897665, 0.526149424898544, 0.287001645266184],	//ML/R
			   [0.656437768926678,  0.617260722143117, 0.656569986958435, 0.63741054520629,   0.55148452726771,   0.922379789905246, 0.790553566121791, 0.999688557334153, 0.426203575603164, 0.778770912265944, 0.652374065121788, 0.662264393455567, 0.73120100926333,  0.274563618133769],	//OMC
			   [0.483341947292063,  0.494773052635464, 0.799434804259974, 0.628789194186491,  0.633847969631333,  0.681354437033551, 0.671233869875345, 0.536121458625519, 0.849389745477645, 0.684067723274814, 0.389732973354501, 0.499972692291964, 0.577231818355874, 0.272773352088982],	//OML/R
			   [0.493917051093473,  0.370423904816088, 0.532148929996192, 0.0629206658586336, 0.0904950078155216, 0.415494774080483, 0.54106107545574,  0.468181146095801, 0.158106484131194, 0.461125738338018, 0.83399612271067,  0.999828328674183, 0.827171977606305, 0.253225855459207],	//F
//			   For  Rez    Vit  Ind  One  Ref Aer  Sar  Com    Deg    Aru
			   [0.5, 0.333, 0.5, 1,   0.5, 1,  0.5, 0.5, 0.333, 0.333, 0.333]];

               function ReturnPosIndex(string){
               if (string == "dc"){return 0;}
               if (string == "dl"){return 1;}
               if (string == "dr"){return 2;}
               if (string == "dmc"){return 3;}
               if (string == "dml"){return 4;}
               if (string == "dmr"){return 5;}
               if (string == "mc"){return 6;}
               if (string == "ml"){return 7;}
               if (string == "mr"){return 8;}
               if (string == "omc"){return 9;}
               if (string == "oml"){return 10;}
               if (string == "omr"){return 11;}
               if (string == "fc"){return 12;}
               if (string == "gk"){return 13;}
               if (string == ""){return -1;}

               }
               function Calc(positionIndex, skills, SI){
                   if (positionIndex == 13) var weight = 48717927500;
                   else var weight = 263533760000;
                   var skillSum = 0;
                   for (var j = 0; j < skills.length; j++) {
                       skillSum += parseInt(skills[j]);
                   }
                   var remainder = Math.round((Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - skillSum)*10)/10;		// 正確な余り
                   var recb = 0;
                   var weightSumb = 0;
                   var not20 = 0;

                   for (i = 0; 2+i <= positionIndex; i += 2) {		// TrExMaとRECのweight表のずれ修正
                       positionIndex--;
                   }
                   for (var i = 0; i < weightR[positionIndex].length; i++) {
                       recb += skills[i] * weightRb[positionIndex][i];
                       if (skills[i] != 20) {

                           weightSumb += weightRb[positionIndex][i];
                           not20++;

                       }
                   }
                   if (not20 == 0) recb = 6;		// All MAX
                   else recb = (recb + remainder * weightSumb / not20 - 2) / 3;
                   return recb.toFixed(3);
               }

                for (var i = 0 ; i < transfer_info_ar.length; i ++)
                { var player_index = transfer_info_ar[i]["id"] ;
                  var player_asi = transfer_info_ar[i]["asi"];
                  var fp = transfer_info_ar[i]["fp"];
                  var cro = transfer_info_ar[i]["cro"];
                  var fin = transfer_info_ar[i]["fin"];
                  var hea = transfer_info_ar[i]["hea"];
                  var lon = transfer_info_ar[i]["lon"];
                  var mar = transfer_info_ar[i]["mar"];
                  var pac = transfer_info_ar[i]["pac"];
                  var pas = transfer_info_ar[i]["pas"];
                  var pos = transfer_info_ar[i]["pos"];
                  var set = transfer_info_ar[i]["set"];
                  var sta = transfer_info_ar[i]["sta"];
                  var str = transfer_info_ar[i]["str"];
                  var tac = transfer_info_ar[i]["tac"];
                  var tec = transfer_info_ar[i]["tec"];
                  var wor = transfer_info_ar[i]["wor"];
                  var han = transfer_info_ar[i]["han"];
                  var one = transfer_info_ar[i]["one"];
                  var ref = transfer_info_ar[i]["ref"];
                  var ari = transfer_info_ar[i]["ari"];
                  var jum = transfer_info_ar[i]["jum"];
                  var com = transfer_info_ar[i]["com"];
                  var kic = transfer_info_ar[i]["kic"];
                  var thr = transfer_info_ar[i]["thr"];
                  var FavPos1 = ReturnPosIndex(fp[0])
                  var FavPos2 = ReturnPosIndex(fp[1])
                  arrary.push([player_index,player_asi,FavPos1,FavPos2,str,sta,pac,mar,tac,wor,pos,pas,cro,tec,hea,fin,lon,set,han,one,ref,ari,jum,com,kic,thr]);
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

                function Check(first_rating,second_rating,player) {
                  if (player.age < 22) {
                   if(first_rating > 4.84 || second_rating > 4.84) {
                     return "$$$";
                   }
                  if( first_rating > 4.94 || second_rating > 4.94) {
                    return "⚔⚔⚔" ;
                    }
                  else {
                    return "----";
                  }
                  }
                  else {
                   return "----";
                  }
                }

                function getSkills(Index,Res){
                 var Ar = [];
                 var Skills = Res ;
                 if (Index == 13){
                 for (var i = 0 ; i < 5 ; i += 2)
                 {
                  if (Skills[i].value == "<img src='/pics/star_silver.png' alt='19' title='19' />")
                  {Ar.push(19);}
                  if (Skills[i].value == "<img src='/pics/star.png' alt='20' title='20' />")
                  {Ar.push(20);}
                  if  (Skills[i].value < 19) {Ar.push(Skills[i].value)}
                }
                  for (var i = 1 ; i < 16 ; i += 2)
                 {
                  if (Skills[i].value == "<img src='/pics/star_silver.png' alt='19' title='19' />")
                  Ar.push(19);
                  if (Skills[i].value == "<img src='/pics/star.png' alt='20' title='20' />")
                   Ar.push(20);
                  if  (Skills[i].value < 19) {Ar.push(Skills[i].value)}

                }
                 }
                 if (Index < 13) {
                     for (var i = 0 ; i < 13 ; i += 2)
                 {
                  if (Skills[i].value == "<img src='/pics/star_silver.png' alt='19' title='19' />")
                  {Ar.push(19);}
                  if (Skills[i].value == "<img src='/pics/star.png' alt='20' title='20' />")
                  {Ar.push(20);}
                  if  (Skills[i].value < 19) {Ar.push(Skills[i].value)}
                }
                  for (var i = 1 ; i < 14 ; i += 2)
                 {
                  if (Skills[i].value == "<img src='/pics/star_silver.png' alt='19' title='19' />")
                  Ar.push(19);
                  if (Skills[i].value == "<img src='/pics/star.png' alt='20' title='20' />")
                   Ar.push(20);
                  if  (Skills[i].value < 19) {
                      Ar.push(Skills[i].value);
                  }
                }
                 }


                 return Ar ;
                }
                first_rating = Calc((arrary[id_index(resultado.player.player_id,arrary)][2]),getSkills(arrary[id_index(resultado.player.player_id,arrary)][2],resultado.player.skills),SI(resultado.player.skill_index));
                second_rating = '0.000';
                if (arrary[id_index(resultado.player.player_id,arrary)][3] > 0){
                second_rating =  Calc((arrary[id_index(resultado.player.player_id,arrary)][3]),getSkills(arrary[id_index(resultado.player.player_id,arrary)][2],resultado.player.skills),SI(resultado.player.skill_index));
                }
				$("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right FavPos1' style='padding-right:5px;'><span>" + first_rating  + "</span></td>");
                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right FavPos2' style='padding-right:5px;'><span>" + second_rating + "</span></td>");
                
                $("a[player_link=" + resultado.player.player_id + "]").closest("tr").append("<td class='right align_right SB' style='padding-right:5px;'><span>" + Check(first_rating,second_rating,resultado.player)  + "</span></td>");

			}
		};
		xhr.send(params);
	});
}
// @match        https://*/*
// @grant        none
// ==/UserScript==


/* jshint -W097 */
'use strict';

// Your code here...