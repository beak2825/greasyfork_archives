// ==UserScript==
// @name        projetFER
// @namespace   projetFER
// @description projetFER Timer à resu
// @include     http://www.worldofstargate.fr/*
// @version     1.5
// @downloadURL https://update.greasyfork.org/scripts/3925/projetFER.user.js
// @updateURL https://update.greasyfork.org/scripts/3925/projetFER.meta.js
// ==/UserScript==     

$(document).keyup(function (event) {
	if(event.keyCode == 82 ){
		var tabResu = $('div[class^="resu_bar_"]');
		var j = 0;
		var h = 0;
		var m = 0;
		var s = 0;
		var globalTime = 0;
		var timeAfficher = "";
		if(tabResu.length > 0){
			tabResu.each(function(res){
				globalTime += parseInt($(this).find("span:nth-child(4)").text());
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
		}
		else{
			timeAfficher += "\t<p id=\"timerresu\" class=\"awesome\"> Temps résurrection : "+j+"j"+h+"h"+m+"m"+s+"s" +"</p>";
			var lien = $(".medium.lightblue.awesome");
			if(lien.text().indexOf("planification") != -1){
				lien.after(timeAfficher);
			}
		}
	}
});