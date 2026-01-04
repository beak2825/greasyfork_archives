// ==UserScript==
// @name               Skillkenntnisse + Fertige Skills ausblenden Hamburg + Berlin + Muenchen 2017
// @namespace      Skillkentnisse by newman & Fertige Skils ausblenden by basti1012 gefixt und zusammengenommen von niceguy0815
// @description       Listet die benötigten Kenntnisse für die Skills direkt auf der Skillseite auf. Fertige Skills werden ausgeblendet.
// @include        *pennergame.de/skills/*
// @grant    GM_xmlhttpRequest
// @grant    GM_getValue
// @grant    GM_setValue  
// @author       Basti1012   
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @include             *menelgame.pl/skills/*
// @exclude             *skills/pet/*
// @version            08.2017
// @downloadURL https://update.greasyfork.org/scripts/32826/Skillkenntnisse%20%2B%20Fertige%20Skills%20ausblenden%20Hamburg%20%2B%20Berlin%20%2B%20Muenchen%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/32826/Skillkenntnisse%20%2B%20Fertige%20Skills%20ausblenden%20Hamburg%20%2B%20Berlin%20%2B%20Muenchen%202017.meta.js
// ==/UserScript==



var url = document.location.href;

if (url.indexOf("http://berlin.pennergame")>=0) {
	var link = "http://berlin.pennergame.de"
	var anzahl = '94';

}
if (url.indexOf("http://www.berlin.pennergame")>=0) {
	var link = "http://www.berlin.pennergame.de"
	var anzahl = '94';

}
if (url.indexOf("http://www.pennergame")>=0) {
	var link = "http://www.pennergame.de"
	var anzahl = '103';

}
if (url.indexOf("http://koeln.pennergame")>=0) {
	var link = "http://koeln.pennergame.de"
	var anzahl = '53';

}
if (url.indexOf("http://www.koeln.pennergame")>=0) {
	var link = "http://www.koeln.pennergame.de"
	var anzahl = '53';

}
if (url.indexOf("http://reloaded.pennergame")>=0) {
	var link = "http://reloaded.pennergame.de"
	var anzahl = '53';

}
if (url.indexOf("http://www.reloaded.pennergame")>=0) {
	var link = "http://www.reloaded.pennergame.de"
	var anzahl = '53';

}
if (url.indexOf("http://muenchen.pennergame")>=0) {
	var link = "http://muenchen.pennergame.de"
	var anzahl = '53';

}
if (url.indexOf("http://www.muenchen.pennergame")>=0) {
	var link = "http://www.muenchen.pennergame.de"
	var anzahl = '53';

}
if (url.indexOf("http://halloween.pennergame")>=0) {
	var link = "http://halloween.pennergame.de"
	var anzahl = '53';

}

if (url.indexOf("http://www.menelgame")>=0) {
	var link = 'http://www.menelgame.pl/'
	var anzahl = '00';

}

//----------------------------------------------------------
//-------------------------Skillkentnisse-----------------
//-------------------------by newman-------------------


for(x=0;x<=15;x++){
	try {
		document.getElementsByTagName('tbody')[x].setAttribute('id', 'tbody.'+x);
		id_max = x;
	} catch (err){
		break;
	}
}


function skill_info(skill_name, pos){
	GM_xmlhttpRequest({
		method: 'GET',
    	url: ''+link+'/skill/info/'+skill_name+'/',
		onload: function(responseDetails) {
			var side = responseDetails.responseText;
			skill_info_ausgabe(side, skill_name, pos);
		}
	 });
}


function skill_info_ausgabe(side, skill_name, pos){
	try {
		var side_split = side.split(/Kenntnisse<\/strong><\/td>[\s]*<\/tr>/)[1].split('</table>')[0];
		document.getElementById('tbody.'+(id_max-pos)).getElementsByTagName('td')[4].innerHTML+='<br /><br /><table><tr><th>Erforderliche Kenntnisse<br /></th></tr>'+side_split+'</table>';
	}
	catch(err){
		document.getElementById('tbody.'+(id_max-pos)).getElementsByTagName('td')[4].innerHTML+='<br /><br /><table><tr><th> Alles erreicht <br /></th></tr>Herzlichen glueckwunsch du hast hier alles erreicht</table>';


		//alert(err);
	}
}


if (url.indexOf("http://malle.pennergame")>=0) {

skill_info('Sprechen',6)
skill_info('Bildungsstufe',5)
skill_info('Musik',4)
skill_info('Sozialkontakte',3)
skill_info('Konzentration',2)
skill_info('Taschendiebstahl',1)
skill_info('survival',0)

} else {

skill_info('Sprechen',5)
skill_info('Bildungsstufe',4)
skill_info('Musik',3)
skill_info('Sozialkontakte',2)
skill_info('Konzentration',1)
skill_info('Taschendiebstahl',0)

}

// upfate fuer 2017 by pennerhackisback 