// ==UserScript==
// @name        Virtonomica:CityVotes
// @namespace   Virtonomica
// @description подсчет "влияния" городов в регионе
// @include     https://virtonomica.ru/vera/main/politics/governor/*/city
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23244/Virtonomica%3ACityVotes.user.js
// @updateURL https://update.greasyfork.org/scripts/23244/Virtonomica%3ACityVotes.meta.js
// ==/UserScript==
var run = function() {
	var table = $('table.list');
	
	var city = $('a[href*="main/politics/mayor"]', table);
	var pop_all = 0;
	for(var i=0; i<city.length; i++){
		var pop = parseInt( city.eq(i).next().text().replace('тыс. чел.','').replace(' ','').replace(' ','') );
		pop_all += pop;
	}

	for(var i=0; i<city.length; i++){
		var pop = parseInt( city.eq(i).next().text().replace('тыс. чел.','').replace(' ','').replace(' ','') );
		var procent = Math.round(1000*pop/pop_all)/10;
		city.eq(i).before("<div style='float:right;color:gray;'>" + procent + "%</div");
	}
	
}
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);