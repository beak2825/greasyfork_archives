// ==UserScript==
// @name         DO Genie Assistant
// @version      1.11
// @namespace    https://github.com/edunogueira/DOGenieAssistant/
// @description  Dugout-online genie assistant
// @author       Eduardo Nogueira de Oliveira
// @icon         https://www.google.com/s2/favicons?domain=dugout-online.com
// @require	     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.j
// @include      http*dugout-online.com/*
// @include      https://www.dugout-online.com/*
// @downloadURL https://update.greasyfork.org/scripts/439078/DO%20Genie%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/439078/DO%20Genie%20Assistant.meta.js
// ==/UserScript==
//page select ----------------------------------------------//
var page=document.URL;

if (page.match('/players/details/')) {
	playerDetails();
}

else if (page.match('/players/none/')) {
	squadDetails();
}

else if (page.match('/tactics/none/') || page.match('/tactics_youth/none/')) {
	tacticsDetails();
}

dropdownMenu();
secondaryClock();

//helper //----------------------------------------------//
function serverTime() {
	const d=new Date();
	let h=addZero(d.getHours());
	let m=addZero(d.getMinutes());
	let s=addZero(d.getSeconds());
	let time=h+":"+m+":"+s;
	$('#servertime2').text(time);
}

function addZero(i) {
	if (i < 10) {
		i="0"+i
	}

	return i;
}

function applyStyle(css) {
	'use strict';
	var head,
	style;
	head=document.getElementsByTagName('head')[0];

	if ( !head) {
		return;
	}

	style=document.createElement('style');
	style.type='text/css';
	style.innerHTML=css;
	head.appendChild(style);
}

function getExp(string1) {
	var retval=string1.substring(0, string1.indexOf(" XP\""));
	retval=retval.substring(retval.lastIndexOf("\"") + "\"".length);
	retval=parseInt(retval);
	return retval;
}

function getPos() {
	var posArray=new Array();
	// Prepopulate with zero values, because threre are no div elements with /positions-0.png:
	posArray[0]="0"; // GK  (always 0 or 1 and never 2 or 3)
	posArray[1]="0"; // DL
	posArray[2]="0"; // DC
	posArray[3]="0"; // DR
	posArray[4]="0"; // ML
	posArray[5]="0"; // MC
	posArray[6]="0"; // MR
	posArray[7]="0"; // FL
	posArray[8]="0"; // FC
	posArray[9]="0"; // FR
	// Find the correct main div element with all the positions:
	var imgs=document.getElementsByTagName("img");
	var mainDiv,
	i,
	img;

	for (i in imgs) {
		img=imgs[i];

		if (img !=undefined && img.src.indexOf("positions-field") > 0) {
			mainDiv=img.parentNode;
			break;
		}
	}

	// Go thru all div elements (positions):
	var posDivs=mainDiv.getElementsByTagName("div");

	for (i in posDivs) {
		var posDiv=posDivs[i];

		if (posDiv.style !=undefined) {
			// Get position number:
			img=posDiv.style.background;
			var num=img.substring(img.indexOf("positions-") + "positions-".length, img.indexOf(".png"));
			var t=posDiv.style.top;
			var l=posDiv.style.left;
			// Fill posArray with position numbers:
			if (t=="69px"&& l=="10px") posArray[0]=num; // GK
			if (t=="69px"&& l=="40px") posArray[2]=num; // DC
			if (t=="20px"&& l=="40px") posArray[1]=num; // DL
			if (t=="117px"&& l=="40px") posArray[3]=num; // DR
			if (t=="69px"&& l=="108px") posArray[5]=num; // MC
			if (t=="20px"&& l=="108px") posArray[4]=num; // ML
			if (t=="117px"&& l=="108px") posArray[6]=num; // MR
			if (t=="69px"&& l=="185px") posArray[8]=num; // FC
			if (t=="20px"&& l=="185px") posArray[7]=num; // FL
			if (t=="117px"&& l=="185px") posArray[9]=num; // FR
		}
	}

	// posArray now contains values from 0-3 (none, green, yellow, red)
	// posArray[0] = GK  (always 0 or 1 and never 2 or 3)
	// posArray[1] = DL
	// posArray[2] = DC
	// posArray[3] = DR
	// posArray[4] = ML
	// posArray[5] = MC
	// posArray[6] = MR
	// posArray[7] = FL
	// posArray[8] = FC
	// posArray[9] = FR
	return posArray;
}

function doTable(selector) {
	$(selector + ' tr:first td').wrapInner('<div />').find('div').unwrap().wrap('<th/>');
	var header=$(selector + " .table_top_row:first").clone();
	$(selector + " .table_top_row:first").remove();
	$(selector + " tbody:first").before('<thead></thead>');
	$(selector + " thead:first").append(header);

	$(selector).dataTable( {
			"searching": false,
			"bPaginate": false,
			"bLengthChange": false,
			"bFilter": true,
			"bInfo": false,
			"bAutoWidth": false,
			"order": [[ $(selector + ' .table_top_row th').size() -1, "desc"]]
		}

	);
}

//features //----------------------------------------------//
function playerDetails() {
	var data=Array();

	$("#main-1 table tr").each(function(i, v) {
			$(this).children('td').each(function(ii, vv) {
					if ($.isNumeric($(this).text())) {
						data.push(parseInt($(this).text()));
					}
				}

			);
		}

	);
	var exp=getExp((new XMLSerializer()).serializeToString(document));
	var position=getPos();
	var ops;

	if (position[0]=="1") {
		//GK
		ops=(data[0] + data[5] + data[10] + data[15] + data[13]);
	}

	else if (position[2]=="1") {
		//DC
		ops=(data[6] + data[11] + data[1] + data[15] + data[13]);
	}

	else if ((position[1]=="1") || (position[3]=="1")) {
		//DL DR
		ops=(data[16] + data[6] + data[1] + data[15] + data[13]);
	}

	else if ((position[4]=="1") || (position[6]=="1")) {
		//ML MR
		ops=(data[16] + data[17] + data[7] + data[2] + data[13]);
	}

	else if (position[5]=="1") {
		//MC
		ops=(data[12] + data[17] + data[7] + data[2] + data[13]);
	}

	else if ((position[9]=="1") || (position[7]=="1")) {
		//FL FR
		ops=(data[3] + data[8] + data[17] + data[16] + data[13]);
	}

	else if (position[8]=="1") {
		//FC
		ops=(data[3] + data[8] + data[17] + data[11] + data[13]);
	}

	$('.player_name').append(' @ OPS '+ ops + ' | '+ exp + ' XP');
	$(document).prop('title', $('.player_name').text());
}

;

function squadDetails() {
	$(".forumline .table_top_row").each(function() {
			$(this).last().append('<td align="center" width="20" title="Original Position Skills" class="tableHeader">OPS</td>');
		}

	);

	$(".forumline [class*=matches_row]").each(function() {
			var data=Array();
			var count=0;
			$(this).find(".tableHeader").remove();

			$(this).find("table tr").each(function() {
					$(this).children('td').each(function() {
							if ($.isNumeric($(this).text())) {
								data.push(parseInt($(this).text()));
							}

							else {
								count++;
							}
						}

					);
				}

			);

			if (data.length > 0) {
				var position=$(this).find(" [class*=_icon]").text();
				var ops=0; ;

				if (position=="GK") {
					ops=(data[0] + data[5] + data[10] + data[15] + data[13]);
				}

				else if (position=="DC") {
					ops=(data[6] + data[11] + data[1] + data[15] + data[13]);
				}

				else if ((position=="DL") || (position=="DR")) {
					ops=(data[16] + data[6] + data[1] + data[15] + data[13]);
				}

				else if ((position=="ML") || (position=="MR")) {
					ops=(data[16] + data[17] + data[7] + data[2] + data[13]);
				}

				else if (position=="MC") {
					ops=(data[12] + data[17] + data[7] + data[2] + data[13]);
				}

				else if ((position=="FL") || (position=="FR")) {
					ops=(data[3] + data[8] + data[17] + data[16] + data[13]);
				}

				else if (position=="FC") {
					ops=(data[3] + data[8] + data[17] + data[11] + data[13]);
				}

				$(this).last().append('<td align="center"><span class="tableText">'+ ops + '</span></td>');
			}

			else if (count > 1) {
				$(this).last().append('<td align="center"><span class="tableText">0</span></td>');
			}
		}

	);
	var tables=document.querySelectorAll("[class=forumline]");
	tables[0].classList.add("gks");
	tables[1].classList.add("dcs");
	tables[2].classList.add("mcs");
	tables[3].classList.add("pls");
	doTable('.forumline.gks');
	doTable('.forumline.dcs');
	doTable('.forumline.mcs');
	doTable('.forumline.pls');
}

function tacticsDetails() {
	$(".player").each(function() {
			var data=Array();
			var i=0;
			var playerId=$(this).attr('rel').split('|')[0];

			$(this).find("#"+ playerId + " table tr").each(function() {
					$(this).children('td').each(function() {
							if ($.isNumeric($(this).text())) {
								data.push(parseInt($(this).text()));
								i++;
							}

							else if (i==21) {
								$(this).append("OPS");
								$(this).css("font-size", "12px");
								i++;
							}

							else if (i==22) {
								$(this).append("0");

								$(this).css( {
										"font-size": "12px",
										"font-weight": "bold"
									}

								);
								$(this).addClass("ops");
								i++;
							}
						}

					);
				}

			);

			if (data.length > 0) {
				var array=$(this).find(" [class*=matches_row] > td").map(function() {
						return $.trim($(this).text());
					}

				).get();
				var position=array[2];
				var ops=0;

				if (position=="GK") {
					ops=(data[0] + data[5] + data[10] + data[15] + data[13]);
				}

				else if (position=="DC") {
					ops=(data[6] + data[11] + data[1] + data[15] + data[13]);
				}

				else if ((position=="DL") || (position=="DR")) {
					ops=(data[16] + data[6] + data[1] + data[15] + data[13]);
				}

				else if ((position=="ML") || (position=="MR")) {
					ops=(data[16] + data[17] + data[7] + data[2] + data[13]);
				}

				else if (position=="MC") {
					ops=(data[12] + data[17] + data[7] + data[2] + data[13]);
				}

				else if ((position=="FL") || (position=="FR")) {
					ops=(data[3] + data[8] + data[17] + data[16] + data[13]);
				}

				else if (position=="FC") {
					ops=(data[3] + data[8] + data[17] + data[11] + data[13]);
				}

				$(this).find("#"+ playerId + " .ops").text(ops);
			}
		}

	);
}

function secondaryClock() {
	$('#footer').append('<div class="time_display" id="servertime2" style="top: 12px;border:1px solid #fff"></div>');
	setInterval(serverTime, 1000);
}

function dropdownMenu() {
	var css='.dropdown-content{border-radius: 15px;margin-top:40px;display:none;position:absolute;background-color:#f1f1f1;min-width:160px;box-shadow:0 8px 16px 0 rgba(0,0,0,.2);z-index:1}.dropdown-content a{border-radius: 15px;color:#000;padding:12px 16px;text-decoration:none;display:block}.dropdown-content a:hover{background-color:#ddd}.menu_button:hover .dropdown-content{display:block}.menu_button:hover .dropbtn{background-color:#3e8e41}';
	applyStyle(css);

	if ($("#mainmenu_container").find("a").removeAttr("href")[0].text=='Início') {
		$('.menu_button:nth-child(1)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/home/none/">Início</a> <a href="https://www.dugout-online.com/news/none/">Notícias</a> <a href="https://www.dugout-online.com/rules/none/">Regras</a> <a href="https://www.dugout-online.com/helpmain/none/">Ajuda</a></div>'));
		$('.menu_button:nth-child(2)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/clubinfo/none/">Informações</a><a href="https://www.dugout-online.com/clubinfo/bids/">Ofertas</a><a href="https://www.dugout-online.com/clubinfo/transfers/">Transferências</a><a href="https://www.dugout-online.com/players/none/">Jogadores</a><a href="https://www.dugout-online.com/players/none/view/youth/">Jogadores (juvenil)</a><a href="https://www.dugout-online.com/staff/none/">Comissão técnica</a> <a href="https://www.dugout-online.com/settings/none/">Configurações</a></div>'));
		$('.menu_button:nth-child(3)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/finances/none/">Finanças</a> <a href="https://www.dugout-online.com/stadium/none/">Estádio</a> <a href="https://www.dugout-online.com/facilities/none/">Instalações</a> <a href="https://www.dugout-online.com/sponsors/none/">Patrocinadores</a> <a href="https://www.dugout-online.com/calendar/none/">Calendário</a></div>'));
		$('.menu_button:nth-child(4)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/tactics/none/">Táticas</a> <a href="https://www.dugout-online.com/tactics_youth/none/">Táticas (juvenil)</a></div>'));
		$('.menu_button:nth-child(5)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/training/none/">Treinamento</a> <a href="https://www.dugout-online.com/physios/none/">Fisioterapeutas</a> <a href="https://www.dugout-online.com/physio_report/none">Relatório de lesões</a></div>'));
		$('.menu_button:nth-child(6)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/search_players/none/">Jogadores</a> <a href="https://www.dugout-online.com/search_clubs/none/">Clubes</a> <a href="https://www.dugout-online.com/national_teams/none/">Seleções</a> <a href="https://www.dugout-online.com/search_coaches/none/">Treinadores</a> <a href="https://www.dugout-online.com/search_physios/none/">Fisioterapeutas</a> <a href="https://www.dugout-online.com/search_transfers/none/">Transferências</a></div>'));
		$('.menu_button:nth-child(7)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/forum/none/">Fórum</a> <a href="https://www.dugout-online.com/community_rules/none/">Regras</a> <a href="https://www.dugout-online.com/community_profile/none/">Perfil</a> <a href="https://www.dugout-online.com/links/none/">Links</a></div>'));
	}

	else {
		$('.menu_button:nth-child(1)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/home/none/">Home</a> <a href="https://www.dugout-online.com/news/none/">News</a> <a href="https://www.dugout-online.com/rules/none/">Rules</a> <a href="https://www.dugout-online.com/helpmain/none/">Help</a></div>'));
		$('.menu_button:nth-child(2)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/clubinfo/none/">Info</a> <a href="https://www.dugout-online.com/clubinfo/bids/">Bids</a><a href="https://www.dugout-online.com/clubinfo/transfers/">Transfers</a><a href="https://www.dugout-online.com/players/none/">Players</a> <a href="https://www.dugout-online.com/players/none/view/youth/">Players (youth)</a><a href="https://www.dugout-online.com/staff/none/">Staff</a> <a href="https://www.dugout-online.com/settings/none/">Settings</a></div>'));
		$('.menu_button:nth-child(3)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/finances/none/">Finances</a> <a href="https://www.dugout-online.com/stadium/none/">Stadium</a> <a href="https://www.dugout-online.com/facilities/none/">Facilities</a> <a href="https://www.dugout-online.com/sponsors/none/">Sponsors</a> <a href="https://www.dugout-online.com/calendar/none/">Calendar</a></div>'));
		$('.menu_button:nth-child(4)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/tactics/none/">Tactics</a> <a href="https://www.dugout-online.com/tactics_youth/none/">Tactics Youth</a></div>'));
		$('.menu_button:nth-child(5)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/training/none/">Training</a> <a href="https://www.dugout-online.com/physios/none/">Physios</a> <a href="https://www.dugout-online.com/physio_report/none">Physio Report</a></div>'));
		$('.menu_button:nth-child(6)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/search_players/none/">Players</a> <a href="https://www.dugout-online.com/search_clubs/none/">Clubs</a> <a href="https://www.dugout-online.com/national_teams/none/">National</a> <a href="https://www.dugout-online.com/search_coaches/none/">Coaches</a> <a href="https://www.dugout-online.com/search_physios/none/">Physios</a> <a href="https://www.dugout-online.com/search_transfers/none/">Transfers</a></div>'));
		$('.menu_button:nth-child(7)').append(('<div class="dropdown-content"><a href="https://www.dugout-online.com/forum/none/">Forum</a> <a href="https://www.dugout-online.com/community_rules/none/">Rules</a> <a href="https://www.dugout-online.com/community_profile/none/">Profile</a> <a href="https://www.dugout-online.com/links/none/">Links</a></div>'));
	}
}

function pageTitle() {
	var title=$(location).attr('pathname').split("/")[1];
	title=title.charAt(0).toUpperCase()+title.slice(1);
	$(document).prop('title', title);
}
