// ==UserScript==
// @name		OdPiSywacz
// @version		21.37.10
// @author		Atexor
// @description		Oznacza znaleziska w serwisie wykop.pl mogące zawierać nieobiektywną i stronniczą treść
// @namespace		https://www.wykop.pl/ludzie/Atexor
// @license		CC BY-NC 4.0
// @match		https://wykop.pl*
// @icon		https://i.imgur.com/TxIuyKQ.png
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/454206/OdPiSywacz.user.js
// @updateURL https://update.greasyfork.org/scripts/454206/OdPiSywacz.meta.js
// ==/UserScript==

var maxCheckAmount = 50; //ile razy sprawdza
var maxTime = 15000; //dzialanie skryptu do max 15 sekund

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
	"salon24.pl",
	"strefabiznesu.pl",
	"strefaedukacji.pl",
	"to.com.pl",
	"tygodnikits.pl",
	"tysol.pl",
	"tv-trwam.pl",
	"tvp.info",
	"tvp.pl",
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

var checkCount = 0;
var startTime = performance.now(); //

function markWypokBadSites() {
	var articles = document.querySelectorAll('.link-block');
 if (articles.length === 0) {
		checkCount++;
		if (checkCount < maxCheckAmount && (performance.now() - startTime) < maxTime) { //wymusza w petli sprawdzanie znalezisk po zaladowaniu podstawowych danych strony
			setTimeout(function() {
				requestAnimationFrame(markWypokBadSites);
			}, 100);
		}
		return;
	}

	(function() {
		console.log(articles);
		for (let article of articles) {
			let articleDomain = article.querySelectorAll('.tooltip-slot > span > a')[1];
			if (typeof articleDomain !== 'undefined') {
				let articleDomainName = articleDomain.textContent;
				if (typeof articleDomainName !== 'undefined') {
					if(markedRedSites.some(site => ("." + articleDomainName).endsWith("." + site)) == true) {
						article.style.background = "#380000";
						article.querySelector('.heading > a').style.color = "#CCC";
					} else if(markedYellowSites.some(site => ("." + articleDomainName).endsWith("." + site)) == true) {
						article.style.background = "#333300";
						article.querySelector('.heading > a').style.color = "#CCC";
					}
				}
			}
		}
	})();
}

window.addEventListener("load", function() {
	requestAnimationFrame(markWypokBadSites);
});