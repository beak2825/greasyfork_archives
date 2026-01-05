// ==UserScript==
// @name        projetFERV2
// @namespace   projetFERV2
// @description projetFERV2 permettant l'affichage d'un tableau récapitulatif des résu
// @include     http://www.worldofstargate.fr/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/4525/projetFERV2.user.js
// @updateURL https://update.greasyfork.org/scripts/4525/projetFERV2.meta.js
// ==/UserScript==     
var globalTime = 0;

function parserTime(tempsAParser){
	var timeParser = "";
	var j = 0;
	var h = 0;
	var m = 0;
	var s = 0;
	var tmp = 0;
	j = (tempsAParser - tempsAParser % 86400)/86400;
	tmp += j*86400;
	h = (tempsAParser - tmp - ((tempsAParser-tmp)%3600))/3600;
	tmp += h*3600;
	m = (tempsAParser - tmp - ((tempsAParser-tmp)%60))/60;
	tmp += m*60;
	s = tempsAParser - tmp;
	timeParser = +j+"j"+h+"h"+m+"m"+s+"s";
	return timeParser;
}

$(document).keyup(function (event) {
	if(event.keyCode == 82 ){
		globalTime = 0;
		var tabResu = $('div[class^="resu_bar_"]');
		var j = 0;
		var h = 0;
		var m = 0;
		var s = 0;
		var timeAfficher = "";
		var tabRecapNBResu = new Array();
		var tabRecapTimeResu = new Array();
		tabRecapNBResu["mort"] = 0;
		tabRecapNBResu["lourd"] = 0;
		tabRecapNBResu["moyen"] = 0;
		tabRecapNBResu["lege"] = 0;
		tabRecapTimeResu["mort"] = 0;
		tabRecapTimeResu["lourd"] = 0;
		tabRecapTimeResu["moyen"] = 0;
		tabRecapTimeResu["lege"] = 0;
		
		var maxTime = parseInt($("span")[65+$('div[class^="resu_bar_"]').length*3].textContent.split("m")[0].trim());
		//$("span")[65+$('div[class^="resu_bar_"]').length*2+1]
		var reductionSarco = (maxTime*60)/600;
		if(tabResu.length > 0){
			tabResu.each(function(res){
				var time = parseInt($(this).find("span:nth-child(4)").text());
				globalTime += time;
				switch(time){
					case 600*reductionSarco : 
						tabRecapNBResu["mort"]++;
						tabRecapTimeResu["mort"] += time;
						break;
					case 450*reductionSarco : 
						tabRecapNBResu["lourd"]++;
						tabRecapTimeResu["lourd"] += time;
						break;
					case 300*reductionSarco : 
						tabRecapNBResu["moyen"]++;
						tabRecapTimeResu["moyen"] += time;
						break;
					case 150*reductionSarco : 
						tabRecapNBResu["lege"]++;
						tabRecapTimeResu["lege"] += time;
						break;
						default : console.log(time);
				}	
			});
			console.log(globalTime);
			var tmp = 0;
			j = (globalTime - globalTime % 86400)/86400;
			tmp += j*86400;
			h = (globalTime - tmp - ((globalTime-tmp)%3600))/3600;
			tmp += h*3600;
			m = (globalTime - tmp - ((globalTime-tmp)%60))/60;
			tmp += m*60;
			s = globalTime - tmp;
		}
		if($("#timerresu").size() > 0){
			timeAfficher = "Temps résurrection : "+j+"j"+h+"h"+m+"m"+s+"s";
			$("#timerresu").text(timeAfficher);
			$("#tabresu").remove();
			var tableauResu = "<table id=\"tabresu\" width=\"100%\" class=\"awesome\"><tr><th width=\"35%\">Types</th><th width=\"15%\">Nombre</th><th width=\"50%\">Temps</th></tr>";
			tableauResu += "<tr><td>Morts</td><th>"+tabRecapNBResu["mort"]+"</th><th>"+parserTime(tabRecapTimeResu["mort"])+"<th></tr>";
			tableauResu += "<tr><td>Blessés Graves</td><th>"+tabRecapNBResu["lourd"]+"</th><th>"+parserTime(tabRecapTimeResu["lourd"])+"</th> </tr>";
			tableauResu += "<tr><td>Blessés Moyens</td><th>"+tabRecapNBResu["moyen"]+"</th><th>"+parserTime(tabRecapTimeResu["moyen"])+"</th> </tr>";
			tableauResu += "<tr><td>Blessés Légers</td><th>"+tabRecapNBResu["lege"]+"</th><th>"+parserTime(tabRecapTimeResu["lege"])+"</th> </tr></table>";
			var lien = $("#timerresu");
			lien.after(tableauResu);
		}
		else{
			timeAfficher += "\t<p id=\"timerresu\" class=\"awesome\"> Temps résurrection : "+j+"j"+h+"h"+m+"m"+s+"s" +"</p>";
			var tableauResu = "<table id=\"tabresu\" width=\"100%\" class=\"awesome\"><tr><th width=\"35%\">Types</th><th width=\"15%\">Nombre</th><th width=\"50%\">Temps</th></tr>";
			tableauResu += "<tr><td>Morts</td><th>"+tabRecapNBResu["mort"]+"</th><th>"+parserTime(tabRecapTimeResu["mort"])+"<th></tr>";
			tableauResu += "<tr><td>Blessés Graves</td><th>"+tabRecapNBResu["lourd"]+"</th><th>"+parserTime(tabRecapTimeResu["lourd"])+"</th> </tr>";
			tableauResu += "<tr><td>Blessés Moyens</td><th>"+tabRecapNBResu["moyen"]+"</th><th>"+parserTime(tabRecapTimeResu["moyen"])+"</th> </tr>";
			tableauResu += "<tr><td>Blessés Légers</td><th>"+tabRecapNBResu["lege"]+"</th><th>"+parserTime(tabRecapTimeResu["lege"])+"</th> </tr></table>";
			var lien = $(".medium.lightblue.awesome");
			if(lien.text().indexOf("planification") != -1){
				lien.after(tableauResu);
				lien.after(timeAfficher);
			}
		}
	}
});
