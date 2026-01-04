// ==UserScript==
// @name           Premiumuebersicht fuer pennergame neue Version (inclusive bis zum schlossfehlt )2017
// @namespace      basti1012
// @version        09.09.201703
// @description    Erweiterte Premiumuebersicht.auf der uebersichtsseite siehst du nun das was deer premium accound auch kann
// @include        *pennergame.de/overview/*
// @author			pennerhackisback damals basti1012 oder pennerhack
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @downloadURL https://update.greasyfork.org/scripts/33062/Premiumuebersicht%20fuer%20pennergame%20neue%20Version%20%28inclusive%20bis%20zum%20schlossfehlt%20%292017.user.js
// @updateURL https://update.greasyfork.org/scripts/33062/Premiumuebersicht%20fuer%20pennergame%20neue%20Version%20%28inclusive%20bis%20zum%20schlossfehlt%20%292017.meta.js
// ==/UserScript==
if (document.location.href.indexOf('berlin.pennergame.de/')>=0) {
  var pgurl = 'http://berlin.pennergame.de/';
}
else if(document.location.href.indexOf('dossergame.co.uk/')>=0) {
  var pgurl = 'http://dossergame.co.uk/';
}
else if(document.location.href.indexOf('pennergame.de/')>=0) {
  var pgurl = 'http://www.pennergame.de/';
}
else if(document.location.href.indexOf('menelgame.pl/')>=0) {
  var pgurl = 'http://menelgame.pl/';
}
else if(document.location.href.indexOf('clodogame.fr/')>=0) {
  var pgurl = 'http://clodogame.fr/';
};

var table1 = document.getElementsByClassName('tieritemA')[0];
var table = table1.getElementsByTagName('ul')[0];
var kurs1 = document.getElementById('tabnav');
var kurs11 = kurs1.innerHTML.split('/profil/id:')[1];
var id = kurs11.split('/"')[0];
info(id);
catchattdef();
function info(id) {
   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+pgurl+'/dev/api/user.' + id + '.xml',
      onload: function(responseDetails) {
         var parser = new DOMParser();
         var dom = parser.parseFromString(responseDetails.responseText, "application/xml");
         var gangid = dom.getElementsByTagName('id')[1].textContent;
         try {
            auslesen(gangid);
         } catch(err){
            table.innerHTML+='<li><span class="k">Bande:</span><span class="v">-</span></li>'
            table.innerHTML+='<li><span class="k">Mitglieder:</span><span class="v">-</span></li>'
            table.innerHTML+='<li><span class="k">Position:</span><span class="v">-</span></li>'
            table.innerHTML+='<li><span class="k">Punkte:</span><span class="v">-</span></li>'
         }
}
});
}
function auslesen(gangid) {
   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+pgurl+'/dev/api/gang.' + gangid + '.xml',
      onload: function(responseDetails) {
         var parser = new DOMParser();
         var dom = parser.parseFromString(responseDetails.responseText, "application/xml");
         var name = dom.getElementsByTagName('name')[0].textContent;
         var punkte = dom.getElementsByTagName('points')[0].textContent;
         var position = dom.getElementsByTagName('position')[0].textContent;
         var member = dom.getElementsByTagName('member_count')[0].textContent;
            table.innerHTML+='<li><span class="k">Bande:</span><span class="v">'+name+'</span></li>'
            table.innerHTML+='<li><span class="k">Mitglieder:</span><span class="v">'+member+'</span></li>'
            table.innerHTML+='<li><span class="k">Position:</span><span class="v"><strong>'+position+'.</strong></span></li>'
            table.innerHTML+='<li><span class="k">Punkte:</span><span class="v">'+punkte+'</span></li>'
}});
}

function catchattdef() {

GM_xmlhttpRequest(
{method: 'GET',
url: ''+pgurl+'/stock/bottle/',
onload: function(responseDetails) {
   var content = responseDetails.responseText;
   var text11 = content.split('item_list')[1];
   var text22 = text11.split('</span>')[0];
   var text1 = text22.split('<span>')[1];
   var text2 = text1.split('Pfandflaschen')[0];
   table.innerHTML+='<li><span class="k">Flaschen:</span><span class="v">'+text2+'</span></ul></li>';

   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+pgurl+'/activities/',
      onload: function(responseDetails) {
         var content = responseDetails.responseText;
         var ges = content.split('Gesch.: ')[1];
         var ges2 = ges.split('<a class="tooltip"')[0];
         var ges3 = content.split('Bandentraining: ')[1];
         var ges4 = ges3.split('%')[0];

         GM_xmlhttpRequest({
            method: 'GET',
            url: ''+pgurl+'/skills/',
            onload: function(responseDetails) {
                var contenta = responseDetails.responseText;
                var text5 = contenta.split('<strong>Angriff</strong>')[1];
                var text6 = text5.split('Verteidigung')[0];
                var text7 = text6.split('>')[6];
                var att1 = text7.split('<')[0];
                var text8 = contenta.split('<strong>Verteidigung</strong>')[1];
                var text9 = text8.split('Geschicklichkeit')[0];
                var text11 = text9.split('>')[6];
                var def3 = text11.split('<')[0];
                var text12 = contenta.split('<strong>Geschicklichkeit</strong>')[1];
                var text13 = text12.split('Sprechen')[0];
                var text14 = text13.split('>')[6];
                var ges1 = text14.split('<')[0];
                var attli = table.getElementsByTagName('li')[3].getElementsByTagName('span')[1];
                var defli = table.getElementsByTagName('li')[4].getElementsByTagName('span')[1];

                attli.innerHTML += '('+att1+')';
                defli.innerHTML += '('+def3+')</span>';
                table.innerHTML+='<li><span class="k">Geschick:</span><span class="v">'+ges1+'('+ges2+')</span></ul></li>'
                table.innerHTML+='<li><span class="k">Bandentrai:</span><span class="v">'+ges4+' %</span></ul></li>';

   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+pgurl+'/fight/overview/',
      onload: function(responseDetails){
         var content = responseDetails.responseText;
         var gew = content.split('>Gesamt:')[1].split('Gewonnen/')[0];
         var ver = content.split('Gewonnen/')[1].split('Verloren/')[0];      
         var aus = content.split('Verloren/')[1].split(' Ausgewichen/')[0];
         var une = content.split(' Ausgewichen/')[1].split('Unentschieden')[0];
         var kampf = content.split('class="fight_num">')[2].split('</')[0];
            table.innerHTML+='<li><span class="k">K&auml;mpfe:</span><span class="v">Penner</span><br></li>'
            table.innerHTML+='<li><span class="k">Gewonnen:</span><span class="v">'+gew+'</span><br></li>'
            table.innerHTML+='<li><span class="k">Verloren:</span><span class="v">'+ver+'</span></ul></li>'
            table.innerHTML+='<li><span class="k">Ausgewichen:</span><span class="v">'+aus+'</span><br></li>'
            table.innerHTML+='<li><span class="k">Unentschieden:</span><span class="v">'+une+'</span></ul></li>'
            table.innerHTML+='<li><span class="k">Kampfkrraft:</span><span class="v">'+kampf+'</span><br></li>'
 
		GM_xmlhttpRequest({
	      method: 'GET',
	      url: ''+pgurl+'/fight/pet/',
	      onload: function(responseDetails) {
		       var content = responseDetails.responseText;
	//	if(content.match(/warning/)){
	//	var part1 = content.split('id="counter3')[1].split('</span')[0];
	//	try{
             var table1 = content.split('Spezies:')[1].split('</table>')[0];
		       var tier = table1.split('<td>')[1].split('</td')[0];
	          var level = table1.split('<td>')[3].split('</td')[0];
	          var angriff = table1.split('<td>')[5].split('</td')[0];
		       var verteidigung = table1.split('<td>')[7].split('</td')[0];
		       var gewonnen = table1.split('<td>')[9].split('</td')[0];
		       var verloren = table1.split('<td>')[11].split('</td')[0];
         //   table.innerHTML+='<ul class="status"><br>'
             table.innerHTML+='<li><span class="k">K&auml;mpfe:</span><span class="v">Haustier</span><br></li>'
             table.innerHTML+='<li><span class="k">Tier:</span><span class="v">'+tier+'</span><br></li>'
             table.innerHTML+='<li><span class="k">Level:</span><span class="v">'+level+'</span></ul></li>'
             table.innerHTML+='<li><span class="k">ATT:</span><span class="v">'+angriff+'</span><br></li>'
             table.innerHTML+='<li><span class="k">VDef:</span><span class="v">'+verteidigung+'</span></ul></li>'
             table.innerHTML+='<li><span class="k">Gewonnen:</span><span class="v">'+gewonnen+'</span><br></li>'
             table.innerHTML+='<li><span class="k">Verloren:</span><span class="v">'+verloren+'</span></ul></li>'         
            
             zeigen()   
        }});
    }});
}});
         
function zeigen(){

var div_settingpoint = document.getElementsByClassName('settingpoint');
var div_tieritemAa = document.getElementsByClassName('tieritemA')[0];
var div_tieritemA = div_tieritemAa.getElementsByClassName('settings')[0];
div_tieritemA.innerHTML =' <li><a name="PennergameSpam1" id="PennergameSpam1" alt="PennergameSpam1" title="Pennergame Spam" <b><ul>Letze k&auml;mpfe anzeigen</ul></b></a></li><li><a name="PennergameSpam3" id="PennergameSpam3" alt="PennergameSpam1" title="Pennergame Spam" <b><ul>Zum Schloss fehlt ??</ul></b></a></li>';

    document.getElementsByName('PennergameSpam1')[0].addEventListener('click', function start() {
    einblenden()
    }, false);
      document.getElementsByName('PennergameSpam3')[0].addEventListener('click', function start() {
      einblenden1()
      }, false);
      
}

function einblenden(){    

GM_xmlhttpRequest({
        method: 'GET',
        url: ''+pgurl+'/fight/',
        onload: function(responseDetails) {
	     var content = responseDetails.responseText;
        try{
		        var text2 = content.split('<span class="tiername">')[3].split('<td height="19" colspan="2">')[0];
		        var text4 = content.split('<td height="19" colspan="2">')[2].split('<ul class="submenu">')[0];
       }catch(e){
             var text2 = ' Keine K&auml;mpfe in der Liste vorhanden oder andere Fehler<br> Schau doch mal meine andere Pennergame Scripte an<br><br><a href="https://greasyfork.org/de/users/150605-pennerhackisback">Scriptevon mir</a><br><br>';
              var text4= '';
   
   }
             var div_settingpoint = document.getElementsByClassName('tieritemA')[1];
             var newdiv1 = div_settingpoint.getElementsByClassName('clearcontext')[0];


				newdiv1.innerHTML = '<div class="tieritemA" style="width: 500px;"><div align="left"><div class="clearcontext" ><div id="summary"><font style=\"color:white; font-size:120%;\">'+text2+''+text4+'<a href="'+pgurl+'fight/list/clear/"><strong>Liste leeren</strong></a><br><div align="left"><li><a name="PennergameSpam11" id="PennergameSpam11" alt="PennergameSpam1" title="Pennergame Spam" <b><ul>Ausblenden</ul></b></a></li></div></div>';
   
   
        document.getElementsByName('PennergameSpam11')[0].addEventListener('click', function start() {
        var div_settingpoint = document.getElementsByClassName('tieritemA')[1];
var newdiv1 = div_settingpoint.getElementsByClassName('clearcontext')[0];


				newdiv1.innerHTML ='<li><a name="PennergameSpam1" id="PennergameSpam1" alt="PennergameSpam1" title="Pennergame Spam" <b><ul>Letze k&auml;mpfe anzeigen</ul></b></a></li>';
 zeigen()
   }, false);
   	}});
}

   function einblenden1(){  
   GM_xmlhttpRequest({
  	method: 'GET',
   	url: ''+pgurl+'/stock/bottle/',
        onload: function(responseDetails) {
        	var content = responseDetails.responseText;
			var text1 = content.split('name="chkval" value="')[1];
			var kurs = text1.split('"')[0];
         var text11 = content.split('item_list')[1];
         var text22 = text11.split('</span>')[0];
         var text1 = text22.split('<span>')[1];
         var text2 = text1.split('Pfandflaschen')[0];
         var restflaschen= Math.round(59000000 - text2);
         var flaschenergebniss= Math.round(text2*kurs)/100;
         var rest_geld = Math.round(590000 - flaschenergebniss);
	      var table = document.getElementsByClassName('status')[0];
	      var li = table.getElementsByTagName('li');

	newli = document.createElement('li');
	table.appendChild(newli);
	newli_2 = document.createElement('li');
	table.appendChild(newli_2);
table.innerHTML+='<li><span class="k">Flaschen:</span><span class="v">Du hast '+text2+' Flaschen('+flaschenergebniss+'&euro;)</span></ul></li>';
table.innerHTML+='<li><span class="k">Rest Geld:</span><span class="v">'+rest_geld+'&euro; Bis zum schloss</span></ul></li>';
table.innerHTML+='<li><span class="k">Restflaschen:</span><span class="v"> '+restflaschen+' Bis zum schloss</span></ul></li>';

}});
 }
}});
}});
}

