// ==UserScript==
// @name			HejOdPiSywacz
// @version			21.37
// @author			Atexor
// @description		Oznacza znaleziska w serwisie hejto.pl mogące zawierać nieobiektywną i stronniczą treść
// @namespace		https://www.hejto.pl/uzytkownik/Atexor*
// @license			CC BY-NC 4.0
// @match			https://www.hejto.pl/*
// @icon			https://i.imgur.com/YGE2Cm4.png
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/458913/HejOdPiSywacz.user.js
// @updateURL https://update.greasyfork.org/scripts/458913/HejOdPiSywacz.meta.js
// ==/UserScript==

var markedRedSites = [ //strony domyślnie oznaczane na ciemnoczerwony kolor, nie trzeba dodawać podstron typu podstrona1.strona1.pl
	"dziennikbaltycki.pl",
	"dzienniklodzki.pl",
	"dziennikpolski24.pl",
	"dziennikzachodni.pl",
	"dorzeczy.pl",
	"echodnia.eu",
	"expressbydgoski.pl",
	"expressilustrowany.pl",
	"filarybiznesu.pl",
	"fratria.pl",
	"gb.pl",
	"gazetabankowa.pl",
	"gazetakrakowska.pl",
	"gazetalubuska.pl",
	"gazetapolska.pl",
	"gazetawroclawska.pl",
	"gk24.pl",
	"gloswielkopolski.pl",
	"gp24.pl",
	"gpcodziennie.pl",
	"gs24.pl",
	"i.pl",
	"instytutstaszica.org",
	"klub-lewica.org.pl", //( ͡° ͜ʖ ͡°)
	"konfederacja.pl", //( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)
	"kurierlubelski.pl",
	"lewica.org.pl", //( ͡° ͜ʖ ͡°)
	"mediappg.pl",
	"naszahistoria.pl",
	"naszemiasto.pl",
	"niezalezna.pl",
	"nowiny24.pl",
	"nowosci.com.pl",
	"nto.pl",
	"panstwo.net",
	"polskapress.pl",
	"polskatimes.pl",
	"polskieradio24.pl",
	"polskieradio.pl",
	"pomorska.pl",
	"poranny.pl",
	"radiomaryja.pl",
	"strefabiznesu.pl",
	"strefaedukacji.pl",
	"to.com.pl",
	"tygodnikits.pl",
	"tysol.pl",
	"tv-trwam.pl",
	"tvp.info",
	"tvrepublika.pl",
	"wgospodarce.pl",
	"wpolityce.pl",
	"wpolsce.pl",
	"wsieci.pl",
	"wsiecihistorii.pl",
	"wsieciprawdy.pl",
	"wspolczesna.pl"
];

var markedYellowSites = [ //w celu oznaczania stron na zółto usunąć "//" i podmienić strony na żądane
	//"strona1.pl",
	//"strona2.pl",
	//"strona3.pl"
];

setTimeout(function() {
(function() {
	var articles = document.querySelectorAll('article'); //dla znalezisk w formie kafelek
	for (let article of articles) {
		let articleDomain = article.querySelectorAll('div > .items-center .one-line')[1];
		if (typeof articleDomain !== 'undefined') {
			let articleDomainName = articleDomain.textContent;
			if (typeof articleDomainName !== 'undefined') {
				if(markedRedSites.some(site => ("." + articleDomainName).endsWith("." + site)) == true) {
					article.style.background = "#380000";
					article.querySelector('article > div > a > h2').style.color = "#EFEFEF";
					article.querySelector('div > a > span').style.color = "#CCC";
					article.querySelector('p').style.color = "#CCC";
				} else if(markedYellowSites.some(site => ("." + articleDomainName).endsWith("." + site)) == true) {
					article.style.background = "#333300";
					article.querySelector('article > div > a > h2').style.color = "#EFEFEF";
					article.querySelector('p').style.color = "#CCC";
				}
			}
		}
	}
})();
}, 800)