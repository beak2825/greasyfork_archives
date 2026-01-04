// ==UserScript==
// @name         Haustier weiterbildungs bot Pennergame 2017
// @namespace    Bildet automatiscdie eingestellte weiterbildung automatisch immer wieder aus
// @author       pennerhackisback früher basti1012 oder pennerhack
// @description  wer die weiterbildung nichtimmer mit der hand ausführen will nimmt dieses Script
// @include      http://*.pennergame.de*
// @version      09.09.201701
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @downloadURL https://update.greasyfork.org/scripts/33063/Haustier%20weiterbildungs%20bot%20Pennergame%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/33063/Haustier%20weiterbildungs%20bot%20Pennergame%202017.meta.js
// ==/UserScript==
//GET /activities/crime/?start_crime=1 HTTP/1.1
 //Du bist noch unterwegs:


if(GM_getValue("seite") == 1){
	var gleich = 'att';
var welcher = '<b><font style="color:green ;font-size:80%;\">HTWB Ist  Aktiviert (ATT)</font></b>';
GM_setValue("welcher" ,welcher);
	window.setInterval(check, 100000)
}
if(GM_getValue("seite") == 2){
	var gleich = 'def';
	var welcher = '<b><font style="color:green ;font-size:80%;\">HTWB Ist  Aktiviert (DEF)</font></b>';
	GM_setValue("welcher" ,welcher);
	window.setInterval(check, 100000)
}
if(GM_getValue("seite") == 3){
	var gleich = 'geschick';
	var welcher = '<b><font style="color:green ;font-size:80%;\">HTWB Ist  Aktiviert (GESCHICK)</font></b>';
	GM_setValue("welcher" ,welcher);
	window.setInterval(check, 100000)
}
if(GM_getValue("seite") > 5){
	var gleich = 'geschick';
	var welcher = '<b><font style="color:red ;font-size:80%;\">HTWB Ist  DEAKTIVIERT</font></b>';
	GM_setValue("welcher" ,welcher);
	window.setInterval(check, 90000000000)
}
ladeanzelement = document.createElement("li");
ladeanzelement.setAttribute("style", "position:absolute;top:130px;left:2px;z-index:100;display:none;background-color:black;font-size:8pt;padding:8px;-moz-border-radius:12px;");
ladeanzelement.setAttribute("align", "left");
ladeanzelement.setAttribute("id", "ladeanzeiger");
ladeanzelement.innerHTML = '<p>'+GM_getValue("welcher")+'<input id="lose2" class="formbutton" type="button" name="lose2" value="X" ><font style="color:blue ;font-size:80%;\"><br><span id="teil1" </span></p>';
document.getElementsByTagName("body")[0].appendChild(ladeanzelement);
 ladeanzeiger.style.display="block";


document.getElementsByName('lose2')[0].addEventListener('click', function start() {

ladeanzelement1 = document.createElement("li");
ladeanzelement1.setAttribute("style", "position:absolute;top:222px;left:120px;z-index:100;display:none;background-color:black;font-size:8pt;padding:8px;-moz-border-radius:12px;");
ladeanzelement1.setAttribute("align", "left");
ladeanzelement1.setAttribute("id", "ladeanzeiger1");
ladeanzelement1.innerHTML = '<p><font style="color:blue ;font-size:120%;\">Haustierweiterbildungsbot  einstellungen</font>'
+'<center><select name="seite">  <option value="55" >DEAKTIVIEREN</option>'
	+'<option value="1" >Att</option> <option value="2" >def</option><option value="3" >geschick</option></select>'
		+'<input id="teil44" class="formbutton" type="button" name="lose44" value="Save" >'
	+'<input id="teil22" class="formbutton" type="button" name="lose22" value="Close" ><div id="lose13"</div>';
document.getElementsByTagName("body")[0].appendChild(ladeanzelement1);
 ladeanzeiger1.style.display="block";


	document.getElementsByName('lose44')[0].addEventListener('click', function start() {
	 var seite = document.getElementsByName('seite')[0].value;
		if(seite == 1){
		 document.getElementById("lose13").innerHTML = '<b><font style="color:blue ;font-size:120%;\">ATT wird ab sofort  weitergebildet....<br>Das Script macht regelm&auml;ssig eine Abfrage und <br> checkt ob eine Haustier Weiterbildung l&aumel;, fals nicht wird <br>ATT durchgehend weiter gebildet</font></b>';
}
if(seite == 2){
		 document.getElementById("lose13").innerHTML = '<b><font style="color:blue ;font-size:120%;\">DEF wird ab sofort  weitergebildet...<br>.Das Script macht regelm&auml;ssig eine Abfrage und <br> checkt ob eine Haustier Weiterbildung l&aumel;, fals nicht wird <br>DEF durchgehend weiter gebildet</font></b>';
}
if(seite == 3){
		 document.getElementById("lose13").innerHTML = '<b><font style="color:blue ;font-size:120%;\">MITLEID wird ab sofort  weitergebildet...<br>.Das Script macht regelm&auml;ssig eine Abfrage und  <br>checkt ob eine Haustier Weiterbildung l&aumel;, fals nicht wird<br> MITLEID durchgehend weiter gebildet</font></b>';
}
		if(seite == 55){

		 document.getElementById("lose13").innerHTML = '<b><font style="color:red ;font-size:120%;\">WEITERBILDUNGEN ALS BOT GESTOPPT</font></b>';
}
		GM_setValue("seite" ,seite);
location.reload();
	}, false);
	

document.getElementsByName('lose22')[0].addEventListener('click', function start() {
ladeanzeiger1.style.display="none";
}, false);

}, false);





function check(){
GM_xmlhttpRequest({
	method: 'GET',
	url: 'http://www.pennergame.de/skills/pet/',
	onload: function(responseDetails) {
		var content = responseDetails.responseText;
	//	if(content.match(/warning/)){
	//	var part1 = content.split('id="counter3')[1].split('</span')[0];
		try{
  var weiterlauf = content.split('uft bereits eine')[1].split('Weiterbildung')[0];
	var waslauft = content.split('class="style_skill">')[1].split('</span')[0];
	 var stufe = content.split('</span> [')[1].split(']')[0];
       var part = content.split('class="style_skill">')[2].split('</span')[0];
         var time = part.split('(')[1].split(',')[0];
var end1 = content.split('end = ')[1].split(';')[0];
         var start1 = content.split('start = ')[1].split(';')[0];
			      var part = content.split('id="now_timestamp')[1].split('</td')[0];
         var jetzt1 = part.split('value="')[1].split('"')[0];



		//		if (content.indexOf('counter') != -1) {
	//		var tr = document.getElementById('active_process').innerHTML;
//alert(tr)
	
 
	
					var end = end1;
					var jetzt = jetzt1;
					var start = start1;
		var			gesammt = end - start;
		var			bisher = jetzt - start;
			var		perc = (bisher / gesammt) * 100;

					if(perc > 0  && perc < 100){
			var			width_balken = Math.round(perc*10)/5;
			var			percger = Math.round(perc*10)/10+"%";
					}

					if(perc < 0){
						width_balken = 0;	
			var			percger = "-";
					}

					if(perc > 100){
						width_balken = 200;
			var		percger = "100% Warten auf Fertigstellung...";
					}

					if (!width_balken){
						width_balken = 0
					}


document.getElementById("teil1").innerHTML = '<b><a href="/skills/pet/" class="pet"><font style="color:blue ;font-size:100%;\">Weiterbildung l&auml;uft...<br>'+waslauft+'  '+stufe+'  <br>Noch '+time+'  Sekunden  ['+percger+']</font></a>&nbsp;<br><img src="http://file1.npage.de/001730/84/bilder/ajax-loader.gif" alt="">';


		
		}catch(e){
//document.getElementById("teil1").innerHTML = '<b><font style="color:blue ;font-size:100%;\">Weiterbildung zuende gehe weiterbilden</font></b>';
			

	weiterbilden()
		}
		
		
		
	
		}});
}
		check()


//Location: http://www.pennergame.de/skills/pet/toomanyinline/
//POST /skill/pet/upgrade/mitleid/



function weiterbilden(){

		 var was = GM_getValue("seite");
 if(was > 5){

		}
		
		if(was == 1){
			var was1 = 'att';
			post()
		}
		if(was == 2){
			var was1 = 'att';
			post()
		}
				if(was == 3){
			var was1 = 'mitleid';
					post()
		}
function post(){
	try{
		GM_xmlhttpRequest({
		method: 'POST',
		url: 'http://www.pennergame.de/skill/pet/upgrade/'+was1+'/',
		headers: {'Content-type': 'application/x-www-form-urlencoded'},
		data: encodeURI('skill_num='+was+': undefined'),
		onload: function(responseDetails){
 document.getElementById("teil1").innerHTML = '<b><font style="color:blue ;font-size:120%;\">'+was1+' Weiterbildung gestartet</font></b>';

		   }});
		}catch(e){
			 document.getElementById("teil1").innerHTML = '<b><font style="color:blue ;font-size:120%;\">Error</font></b>';
			alert('Ein ausergew&ouml;hnlicher Fehler ist aufgetreten /n  werde das Script in wennigen Minuten wieder neu  laden ')
			window.setInterval(check, 300000)
		}
	}		
			
			check()

 
	
	
	

}	
	
	
	
