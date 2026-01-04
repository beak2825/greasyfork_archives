// ==UserScript==
// @name           Super Highscore Gegner nach Geld und Punkte suche 2017 Pennergame Hamburg

// @include        *www.pennergame.de/highscore/*
// @include        *berlin.pennergame.de/highscore/*
// @version       10.09.2017
// @description  es wird ein untermenue in der  highscoreerzeugt in den man nach geld suchen kann
// @namespace      sucht gegner nach geld und nach punkten 
// @author         Basti1012
// @copyright     Basti1012 alias Pennerhackisback
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @author       Basti1012

// @downloadURL https://update.greasyfork.org/scripts/32630/Super%20Highscore%20Gegner%20nach%20Geld%20und%20Punkte%20suche%202017%20Pennergame%20Hamburg.user.js
// @updateURL https://update.greasyfork.org/scripts/32630/Super%20Highscore%20Gegner%20nach%20Geld%20und%20Punkte%20suche%202017%20Pennergame%20Hamburg.meta.js
// ==/UserScript==




var url = document.location.href;
if (url.indexOf("http://www")>=0) {
var link = "http://www.pennergame.de"
var siglink = 'http://inodes.pennergame.de/de_DE/signaturen/';
}
if (url.indexOf("http://berlin")>=0) {
var link = "http://berlin.pennergame.de"
var siglink = 'http://inodes.pennergame.de/bl_DE/signaturen/';
}
	var head =document.getElementsByTagName('head')[0];
	head.innerHTML += '<link rel="icon" type="image/x-icon" href="http://media.pennergame.de/de/img/att.png" />';

document.title += 'Geldsuche By Basti1012';




var table = document.getElementById('nav-2');
table.innerHTML += '<li><a name="PennergameSpam1" id="PennergameSpam1" alt="PennergameSpam1" title="Pennergame Spam" <span class="btn-right"><span class="btn-left">Geldsuche im Punktebereich</span></span></a></li>';
document.getElementById('PennergameSpam1').addEventListener('click', function linktklickerone() {

var anleitung = '<div align="left" name="sbalki" id="sbalki"></div><br><br>';

	GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/fight/overview/',
			onload: function( response ) {
				var lf = response.responseText;
				var attmin = lf.match(/Dein Ziel muss ([0-9]+) bis ([0-9]+) Punkte haben/)[ 1 ];
				var attmax = lf.match(/Dein Ziel muss ([0-9]+) bis ([0-9]+) Punkte haben/)[ 2 ];
        			hs2 = Math.round(attmin*1.25/3);
				GM_setValue("attmax" , attmax);
				GM_setValue("attmin" , attmin);
				GM_setValue("money" , hs2);
						}
			});

var knopfe ='Min-Punkte f&uuml;r gezielte suche:'
+'<input name="min_points" id="min_points" maxlength="11" '
+'size="7" value="'+GM_getValue("attmin")+'" type="text" /><br>'
+'Max-Punkte f&uuml;r gezielte suche:<input id="max_points" '
+'name="max_points" maxlength="11" size="7" value="'+GM_getValue("attmax")+'" type="text" /><br> '
+'Geldangabe:<input id="geld" name="geld" maxlength="11" size="7" value="'+GM_getValue("geld")+'" type="text" /><br> '
+'Menge der Seiten die durchsucht werden sollen:'

    +'<select name="seite">'
     +'  <option value="5" >5 Seiten für langsame computer mit langsamen internet ( isdn )</option>'
     +'  <option value="10" >10 Seiten für langsame computer mit langsamen internet ( isdn )</option>'
      +'  <option value="15" >15 Seiten für langsame computer mit langsamen internet ( isdn )</option>'
     +'  <option value="20" >20 Seiten für langsame computer mit langsamen internet ( isdn )</option>'
          +'     <option value="25" >25 Seiten für mittelschnelle computer und kleiner dsl leitung</option>'
            +'    <option value="30" >30 Seiten für mittelschnelle computer und kleiner dsl leitung</option>'
           +'      <option value="35" >35 Seiten für mittelschnelle computer und kleiner dsl leitung</option>'
              +'    <option value="40" >40 Seiten für mittelschnelle computer und kleiner dsl leitung</option>'
              +'     <option value="50" >50 Seiten für mittelschnelle computer und kleiner dsl leitung</option>'
               +'     <option value="100" >100 Seiten nur für schnelle computer und schnellen internet</option>'
             +'        <option value="150" >150 Seiten nur für schnelle computer und schnellen internet</option>'
                 +'     <option value="200" >200 Seiten nur für schnelle computer und schnellen internet</option>'
                    +'   <option value="300" >300 Seiten nur für schnelle computer und schnellen internet</option>'
                     +'   </select><br>'

+'<input type="button" id="geldsucher" name="geldsucher" value="gegner mit euren Einstellungen suchen " /><br>'
+'<div align="left" name="wasgeht" id="wasgeht"></div>';

var inhalt = '<div class="settingpoint"><table border="0" cellspacing="0" cellpadding="0">'
+'<td width="500" height="70"><tr>'
+'<div align="left" name="sbalki" id="sbalki"></div><br><div align="left" name="sbalkia" id="sbalkia"></div>'
+''+knopfe+'</div></td></tr>';

var tr = document.getElementsByClassName('zrelative sitdown')[0];
	tr.innerHTML = ''+anleitung+''+inhalt+'<table class="list" border="1" width="1490"><tbody><tr bgcolor="#272727">'
	+'<th align="center" width="30">Id</th>'
	+'<th align="center" width="50">promille</th>'
	+'<th align="center" width="270">Profillink</th>'
	+'<th align="center" width="50">Rankink</th>'
	+'<th align="center" width="80">Platz</th>'
	+'<th align="center" width="80">Punkte</th>'
	+'<th align="center" width="80">Reg</th>'
	+'<th align="center" width="100">Geld</th>'
	+'<th align="center" width="130">Stadt</th>'
	+'<th align="center" width="100">Status</th>'
	+'<th align="center" width="100">Joined</th>'
	+'<th align="center" width="200">Bande</th>'
	+'<th align="center" width="120">Tier</th>'
	+'<th align="center" width="15"><img src="http://media.pennergame.de/de/img/att.png" width="16" height="16"></th>'
	+'<th align="center" width="15"><img src="http://media.pennergame.de/img/overview/new_msg.gif"></th>'
	+'<th align="center" width="15">g</th>'
	+'<th align="center" width="15">o</th>'
	+'</tr>' ;

document.getElementById('geldsucher').addEventListener('click', function linktklickerone() {
	     var menge = document.getElementsByName('seite')[0].value;

	  var max = document.getElementById('max_points').value;
	  var min = document.getElementById('min_points').value;
	 var geld = document.getElementById('geld').value;
	GM_setValue("max" , max);
	GM_setValue("min" , min);
	GM_setValue("menge" , menge);
	GM_setValue("geld" , geld);
	x=1;
	i=1;
	z=1;
	seitenwahl(x,i,z);
},false);

function seitenwahl(x,i,z){
	var mengea = GM_getValue("menge");
		if(i<=Number(mengea)){
		i++;
		anfang(x,i,z);
	}else{
document.getElementsByName('sbalki')[0].innerHTML = '<font style=\"color:green; font-size:200%;\"><b>Habe fertig gescannt</b></font>';
	}
}

function anfang(x,i,z){

	var max = GM_getValue("max");
	var min = GM_getValue("min");
	var menge = GM_getValue("menge");
	var geld = GM_getValue("geld");

document.getElementsByName('wasgeht')[0].innerHTML = '<font style=\"color:red; font-size:200%;\"><b>Suche inerhalb Min: '+min+' Max: '+max+' Punkte .Nach minimum Geld: '+geld+' &euro; durchsuche '+menge+' Seiten.</b></font>';



	GM_xmlhttpRequest({
       		method: 'GET',
            	url: ''+link+'/highscore/user/'+i+'/?max='+max+'&min='+min+'',
            	//url: 'http://www.pennergame.de/highscore/user/'+i+'/?max=1&min=111111',
             			onload: function(responseDetails) {
            			 var content = responseDetails.responseText;
					for (var x = 1; x<=20; x++){
						if(x>=20){
						seitenwahl(x,i,z);
					}
				var table = content.split('id="stadtteil"><div>Stadtteil</div>')[1];
				var table1 = table.split('<div id="pagination">')[0];
				var feld = table1.split('class="col1')[x];
				var feld1 = feld.split('</tr>')[0];
				var id = feld1.split('<a href="/profil/id:')[1];
				var id2 = id.split('/')[0];
				z++;
				var mengea = GM_getValue("menge");
			var prozi2 = Math.round(mengea*19)
			GM_setValue("prozi2" , prozi2);
			var prozi1 = Math.round((100/prozi2)*10)/10
			var prozi = Math.round(prozi1*z)
			var balki = Math.round(prozi*3)
document.getElementsByName('sbalki')[0].innerHTML = '&nbsp; ['+prozi+'%] Suche bei '+z+' von '+prozi2+'<br><div class="processbar_bg" style="width: 300px;"><div id="active_process2" class="processbar" style="width: '+balki+'px;"></div></div>';
mitte(id2,x,z);
		}
	}});
}

function mitte(id2,x,z){

	GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/dev/api/user.'+id2+'.xml',
		onload: function(responseDetails) {
			var parser = new DOMParser();
			var dom = parser.parseFromString(responseDetails.responseText, "application/xml");
			var nam = dom.getElementsByTagName('name')[0].textContent;
			var id = dom.getElementsByTagName('id')[0].textContent;
			var platz = dom.getElementsByTagName('position')[0].textContent;
			var punkte = dom.getElementsByTagName('points')[0].textContent;
			var reg = dom.getElementsByTagName('reg_since')[0].textContent;
			var rankingpoints = dom.getElementsByTagName('rankingpoints')[0].textContent;

				try{
					var cash = dom.getElementsByTagName('cash')[0].textContent/100;
				}catch(e){
					cash='- - -';
				}

				try{
					var bande = dom.getElementsByTagName('name')[1].textContent;
					var bandeid = dom.getElementsByTagName('id')[1].textContent;
					var status = dom.getElementsByTagName('status')[0].textContent;
					var joined = dom.getElementsByTagName('joined')[0].textContent;
					var bandeergebniss = '<a href="/profil/bande:'+bandeid+'/" style="text-decoration: none;">'+bande+'</a>';
				}catch(e){
				var bandeergebniss = '- - -';
				}
        if (status==3) {
       	var statu = '<img src="http://media.pennergame.de/img/bande/admin.gif"><font style=\"color:blue; font-size:100%;\"><b> Admin</b></font>';
        }
        else if (status==2) {
        var statu = '<img src="http://media.pennergame.de/img/bande/coadmin.gif"><font style=\"color:orange; font-size:100%;\"><b> Co-Admin</font>';
        }
        else if (status==1) {
        var statu = '<img src="http://media.pennergame.de/img/bande/member.gif"><font style=\"color:grey; font-size:100%;\"><b> Mitglied</font>';
        }
        else if (status==0) {
        var statu = 'No Bande';
};
	try{
		var cash = dom.getElementsByTagName('cash')[0].textContent/100;
		var promille = '<div align="right"><div style="overflow: hidden; width: 40px; height: 15px;"><img style="position: relative; top: -40px; left: -120px;" src="'   + siglink + id + '.jpg"></div></div>';
	}catch(e){
		var promille = '- - -';
	}



var fight ='<a href="/fight/?to='+nam+'"><img src="http://media.pennergame.de/de/img/att.png" width="16" height="16"</a>';
var sms ='<a href="/messages/write/?to='+id+'"><img src="http://media.pennergame.de/img/overview/new_msg.gif"</a>';

if (cash <= 111111){
farbe1 = "black";}
if (cash <= 99999){
var farbe1 = "gray";}
if (cash <= 77777){
farbe1 = "blue";}
if (cash <= 66666){
var farbe1 = "cyan";}
if (cash <= 55555){
farbe1 = "red";}
if (cash <= 44444){
var farbe1 = "green";}
if (cash <= 33333){
farbe1 = "magenta";}
if (cash <= 22222){
farbe1 = "orange";}
if (cash <= 11111){
var farbe1 = "yellow";}
if (cash <= 1111){
var farbe1 = "white";}







GM_xmlhttpRequest({
method: 'GET',
url: ''+link+'/profil/id:' + id + '/',
onload: function(responseDetails) {
			var content = responseDetails.responseText;

			var suche = content.search("Ist gerade Online");
			try{
			if (suche != -1) {
			var online2a = "<img src='http://media.pennergame.de/img/on.gif'></img>";
			}
			else {
			var online2a = "<img src='http://media.pennergame.de/img/off.gif'></img>";
			};
			}catch(e){
			var online2a = '<font style=\"color:black; font-size:100%;\"><b>geloescht</b></font>';
			}


      try{
      var location1 = content.split('Stadtteil</strong>')[1];
      var location2 = location1.split('bgcolor="#232323">')[1];
      var stadt = location2.split('</td>')[0];
      }catch(e){
      var stadt ='<font style=\"color:green; font-size:100%;\">Premium</font>';   
}   










//try{
    var hausi5 = content.split('http://static2.pennergame.de/img/pv4/shop/de_DE/tiere/')[1];
    var tier_number = hausi5.split('.jpg')[0];
  //  var hausi4 = hausi3.split('<img src="')[1];
   // var hausi2 = hausi4.split('"')[0];
			switch (tier_number) {
 
				case "14896": var tier_name = 'Eisbär'; break; 
				case "94826": var tier_name = 'Elefant'; break;
				case "43703": var tier_name = 'Tiger'; break;
				case "73933": var tier_name = 'Dressierte Maus'; break;
				case "12536": var tier_name = 'Äffchen'; break;
				case "32563": var tier_name = 'Chihuahua'; break;
				case "00001": var tier_name = 'Kakerlake'; break;
				case "68930": var tier_name = 'Goldfisch'; break;
				case "11836": var tier_name = 'Maus'; break;
				case "73308": var tier_name = 'Hamster'; break;
				case "52483": var tier_name = 'Wellensittich'; break;
				case "31451": var tier_name = 'Taube'; break;
				case "73684": var tier_name = 'Ratte'; break;
				case "77310": var tier_name = 'Hase'; break;
				case "21903": var tier_name = 'Frettchen'; break;
				case "73735": var tier_name = 'Katze'; break;
				case "89386": var tier_name = 'Falke'; break;
				case "61402": var tier_name = 'Schlange'; break;
				case "62474": var tier_name = 'Hausziege'; break;
				case "12758": var tier_name = 'Pudel'; break;
				case "48263": var tier_name = 'Adler'; break;
				case "09051": var tier_name = 'Schäferhund'; break;
				case "15240": var tier_name = 'Pitbull'; break;
				case "62456": var tier_name = 'Cockerspaniel'; break;
				case "90385": var tier_name = 'Pferd'; break;
				case "98962": var tier_name = 'Giraffe'; break;
				case "64220": var tier_name = 'Nilpferd'; break;
				case "73953": var tier_name = 'Krokodil'; break;
				case "25834": var tier_name = 'Nashorn'; break;
default: var tier_name = "-"; break;

			}
     // }catch(e){
		//		var tier_name = '-';
	//		}
try {
var geschlecht2 = content.split('<img src="http://media.pennergame.de/img/profilseite/')[1];
var geschlecht  = geschlecht2.split('.jpg"')[0];
var geschlecht_image = '<div style="display:inline-block;"><img src="http://media.pennergame.de/img/profilseite/' + geschlecht + '.jpg" height="12" width="12"></img></div>&nbsp;&nbsp;';
} catch(err) {
var geschlecht_image = '<font style=\"color:green; font-size:100%;\">[X]</font>';
}   









var geld = GM_getValue("geld" , geld);
if (cash >= Number(geld)){
			tr.innerHTML += '<table class="list" border="1" width="1490"><tbody><tr bgcolor="#272727">'
			+'<th align="center" width="30">'+z+'</th>'
			+'<th align="center" width="50">'+promille+'</th>'
			+'<th align="center" width="270"><a href="/profil/id:'+id+'/">'+nam+'</a></th>'
			+'<th align="center" width="50">'+rankingpoints+'</th>'
			+'<th align="center" width="80">'+platz+'</th>'
			+'<th align="center" width="80">'+punkte+'</th> '
			+'<th align="center" width="80">'+reg+'</th>'
			+'<th align="center" width="100"><font style=\"color:'+farbe1+'; font-size:100%;\"><b>'+cash+' &euro;</b></font></th>'
			+'<th align="center" width="130">'+stadt+'</th>'
			+'<th align="center" width="100">'+statu+'</th>'
			+'<th align="center" width="100">'+joined+'</th>'
			+'<th align="center" width="200">'+bandeergebniss+'</th>'
			+'<th align="center" width="120">'+tier_name+'</th>'
			+'<th align="center" width="15">'+fight+'</th>'
			+'<th align="center" width="15">'+sms+'</th>'
			+'<th align="center" width="15">'+geschlecht_image+'</th>'
			+'<th align="center" width="15">'+online2a+'</th>'

			+'</tr></tbody></table>';
}

var prozi2 = GM_getValue("prozi2" , prozi2);
if(z >= prozi2){
document.getElementsByName('sbalki')[0].innerHTML = '<font style=\"color:green; font-size:300%;\"><b>Habe fertig gescannt</b></font>';
}
}});
}});
}
},false);