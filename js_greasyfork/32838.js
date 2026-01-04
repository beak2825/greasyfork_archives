// ==UserScript==
// @name		pennergame Pfandsucher bot inclusive losebot 2017
// @include        *pennergame.de*
// @version       09.2017.3
// @description  es wird ein Menü erzeugt was immer da ist und man kann die bots damit steuern
// @namespace      bots die man immer gebrauchen kann ..
// @author         pennerhackisback
// @copyright     Basti1012 alias Pennerhack
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/32838/pennergame%20Pfandsucher%20bot%20inclusive%20losebot%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/32838/pennergame%20Pfandsucher%20bot%20inclusive%20losebot%202017.meta.js
// ==/UserScript==


 
/*
haustierbot = document.createElement("div");
haustierbot.setAttribute("style", "position:absolute;top:250px;left:100px;z-index:100;display:block;background-color:black;font-size:10pt;padding:25px;-moz-border-radius:25px;");
haustierbot.setAttribute("align", "left");
haustierbot.innerHTML += ' <span id="tier1"</span><span id="tier2"</span><input id="streunenan" class="formbutton" type="button" name="streunenan" value="Start tierbot." ><input id="streunenaus" class="formbutton" type="button" name="streunenaus" value="Stop tierbot." ><font style="color:white ;font-size:100%;\"><span id="tier4" </font><br><span id="tier3"</span>';



document.getElementsByTagName("body")[0].appendChild(haustierbot);


document.getElementsByName('streunenan')[0].addEventListener('click', function start() {
	haustierbot1 = document.createElement("div");
haustierbot1.setAttribute("style", "position:absolute;top:250px;left:100px;z-index:100;display:block;background-color:black;font-size:10pt;padding:5px;-moz-border-radius:25px;");
haustierbot1.setAttribute("align", "left");
//ladeanzelement.setAttribute("id");
haustierbot1.innerHTML += ' document.getElementsByTagName("body")[0].appendChild(haustierbot1);

		document.getElementsByName('speichern')[0].addEventListener('click', function start() {
  var richtungx = document.getElementsByName('richtung')[0].value;
		 var zeitx = document.getElementsByName('zeit')[0].value;
		 var tierx = document.getElementsByName('tier')[0].value;
		 var wannwasx = document.getElementsByName('wannwas')[0].value;
				 var punkter = document.getElementsByName('punkter')[0].value;
						 var puwo = document.getElementsByName('puwo')[0].value;
		var streuneraktulasierung = zeitx
		 GM_setValue("streuneraktulasierung", wannwasx);
		     if(richtungx == 1){
				 }
						 GM_setValue("puwo" ,puwo);
				 GM_setValue("punkter" ,punkter);
		 GM_setValue("richtungx" ,richtungx);
		 GM_setValue("zeitx" ,zeitx);
		 GM_setValue("tierx" ,tierx);
			     GM_setValue("wannwasx" ,wannwasx);
		isttierunterwegs()
		
	//	alert('Du gehst mit dein Tier '+tierx+' n\ in Richtung '+richtungx+' n\  Du ght '+zeitx+' Minutenn? Der Bot ist '+wannwasx+' n\ Deine Punkte werden '+punkter+' und werden auf '+puwo+' Gutgeschrieben')
			   function weg(){
               location.reload();
		     
				 } 
		document.getElementById("tier3").innerHTML = '<br><font style="color:orange ;font-size:120%;\">Daten gespeichert<br>Seite wird in 5 selunden neu gestartet</font>'	
		window.setInterval(weg, 5000);
}, false);
	
	
}, false);
document.getElementsByName('streunenaus')[0].addEventListener('click', function start() {
alert('bot aus')
}, false);
	
	
	
	gut()
	
	
	
	
	//isttierunterwegs()
//var rello = GM_getValue("streuneraktulasierung");
//window.setInterval(isttierunterwegs, rello)
      function gut(){
//alert(GM_getValue("streuneraktulasierung"))
GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.pennergame.de/pet/',
		onload: function(responseDetails) {
			var contentz = responseDetails.responseText;
			 var content= contentz.split('class="petname "')[1].split('s<h1>Wachsamkeit</h1>')[0];//1-3 
	
			   var name = content.split('>')[1].split('<div')[0];//class="petna

        var punkte = content.split('class="petnametooltip">')[1].split('</div')[0];
          var level = content.split('title="Level">')[1].split('</div>')[0];
 
             var ausdauer1 = content.split('<h1>Ausdauer</h1>')[1].split('<div style="')[0];
        var ausdauer = ausdauer1.split('</div>')[3].split('</div>')[0];
             var kampfkraft1 = content.split('<h1>Kampfkraft</h1>')[1].split('<div style="')[0];
        var kampfkraft =kampfkraft1.split('</div>')[3].split('</div')[0];
             var nase1 = content.split('rnase</h1>')[1].split('<div style="')[0];
        var nase = nase1.split('</div>')[3].split('<div')[0];
 
			  var aaa = content.split('px center; "')[1].split('/div>')[0];
	
var cc1 = aaa.split('>')[1].split('/')[0];
var cc2 = aaa.split('/')[1].split('<')[0];

var tierid = content.split('upgrade_popup_main_')[3].split('_')[0];
GM_setValue("tierid" ,tierid);

//if(cc1 <=9){
	//try{
	      var punkteaufladen = content.split('class="petinfo"')[1].split('Punkte')[0];
			 var punkteaufladena = punkteaufladen.split('>')[1].split(' ')[0];

document.getElementById("tier3").innerHTML += '<br><font style="color:red ;font-size:120%;\">Zu  wennig Ausdauer um zu streunen</font><a class="tooltip" href="http://www.pennergame.de/pet/"> [INFO]<span><font style="color:red ;font-size:100%;\"><b>Bedienungsanleitung</b></font<br><font style="color:green ;font-size:100%;\">Keine ausdaerpunkte mehr<br>Du hast aber '+punkteaufladena+' frei Punkte zu vergeben,,<br></font></span></a><br><font style="color:green ;font-size:100%;\">Du hast '+punkteaufladena+' frei Punkte zu vergeben</font><input id="vergeb" class="formbutton" type="button" name="vergeb" value="Punkte vergeben" >'
		+'	<select name="waswa">'


+'<option value="/pet/upgrade/437022/stamina/1/">aUSDAUER</option>'
+'<option value="/pet/upgrade/437022/attack/1/">kAMPFKRAFT</option>'
+'<option value="/pet/upgrade/437022/tracing/1/">Spürnase</option>'
+'<option value="/pet/upgrade/437022/vigilance/1/ ">Wachsamkeit</option></select>';
		
		 
		document.getElementsByName('vergeb')[0].addEventListener('click', function start() {
  var waswa = document.getElementsByName('waswa')[0].value;
			
							     var request = new XMLHttpRequest();
       request.open('get', ''+waswa+'', true);//roam_
       request.send(null);
			
		location.reload()
}, false);

alert(name)
	//}catch(e){
	document.getElementById("tier3").innerHTML += '<br><font style="color:red ;font-size:120%;\">Zu  wennig Ausdauer um zu streunen<br>Keine freie Punkte mehr zuvergeben</font><a class="tooltip" href="http://www.pennergame.de/pet/"> [INFO]<span><font style="color:red ;font-size:100%;\"><b>Bedienungsanleitung</b></font<br><font style="color:green ;font-size:100%;\">Keine ausdaerpunkte mehr<br>Und keine frei Punkte zu vergeben<br></font></span></a>';

//	}

//}else{
alert('gert')

	var suche = content.search("Fertig");
			    if (suche != -1) {
       var zuruecktry = contentz.split('id="pet_roam_time">')[1].split('</span>')[0]; //fertig
       var zuruecktry1 = zuruecktry.split('(')[1].split(',')[0]; //fertig
		
stall()
					}else{
	 
var zuruecktry1 ='---';
	stall()
}
alert('FDSDFGHJHGF;')
			 	 document.getElementById("tier3").innerHTML += ''	
			+'<font style="color:blue ;font-size:120%;\">'+name+' </font>'
			+'<br><font style="color:blue ;font-size:120%;\">Punkte : </font> <font style="color:green ;font-size:120%;\">'+punkte+' : </font>'
			+'<br><font style="color:blue ;font-size:120%;\">Level :</font> <font style="color:green ;font-size:120%;\">'+level+'</font> '
			+'<br><font style="color:blue ;font-size:120%;\">Ausdauer :</font> <font style="color:green ;font-size:120%;\">'+ausdauer+'</font>'
			+'<br><font style="color:blue ;font-size:120%;\">Kampfkraft :</font> <font style="color:green ;font-size:120%;\">'+kampfkraft+'</font>'
			+'<br><font style="color:blue ;font-size:120%;\">Spürnase :</font><font style="color:green ;font-size:120%;\">'+nase+'</font>'
	 +'<br><font style="color:blue ;font-size:120%;\">Wachsamkeit :</font> <font style="color:green ;font-size:120%;\">'+cc1+' / '+cc2+'</font>'
			+'<br><font style="color:blue ;font-size:120%;\">Zeit : </font><font style="color:green ;font-size:120%;\">'+zuruecktry1+' Sekunden</font>'




//}
 }});
}



																														 
																														 
function stall(){
	
GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.pennergame.de/pet/',
		onload: function(responseDetails) {
			var content = responseDetails.responseText;
		if(content.match(/Fertig/)){
 streunen()


			var request = new XMLHttpRequest();
       request.open('get', '/pet/get_roam_reward/', true);//roam_
       request.send(null);
		}
streunen()

		}});
}












function streunen(){
	      GM_xmlhttpRequest({
	                method: 'POST',
		               url: 'http://www.pennergame.de/pet/pet_action/',
		               headers: {'Content-type': 'application/x-www-form-urlencoded'},
		               data: encodeURI('area_id=1&Flink&route_length=10&pet_id=437022&:undefined'),//undefined
		               onload: function(responseDetails){
			 document.getElementById("tier3").innerHTML= '<br><font style="color:green ;font-size:120%;\">Schike tier  los.....</font>'	
				 }});
}









alert()

if(GM_getValue("streuneraktulasierung") == null){
	GM_setValue("streuneraktulasierung", 5000000000)
} 
if (GM_getValue("streuneraktulasierung") <= 600000){

  //document.getElementById("tier3").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">Streuner Bot startet ...</font></b>';
}
	if (GM_getValue("streuneraktulasierung") >= 700000){
// document.getElementById("tier3").innerHTML = '<br><b><font style="color:red ;font-size:120%;\">Streuner bot deaktiviert</font></b>';

}







/*
GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.pennergame.de/pet/?plundertab=0',
		onload: function(responseDetails) {
			 
			  	document.getElementById("tier4").innerHTML += '<br><font style="color:orange ;font-size:120%;\">tier im empfang nehmen....</font>'	
				     var request = new XMLHttpRequest();
       request.open('get', '/pet/?plundertab=0', true);//roam_
       request.send(null);
			
		}});
			
	
			
			
/*
				if(content.match(/1 freier Punkt!/)){
	        var request = new XMLHttpRequest();
           request.open('get', '/pet/upgrade/437847/stamina/1/', true);
           request.send(null);
	         document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">1 Punkt auf  Ausdauer gesetzt</font>'	
					}
			
								if(content.match(/2 freie Punkte/)){
									 var request = new XMLHttpRequest();
           request.open('get', '/pet/upgrade/437022/stamina/2/', true);
           request.send(null);
	         document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">2 Punkt auf  Ausdauer gesetzt</font>'	
					}
								if(content.match(/3 freier Punkt!/)){
					}
								if(content.match(/4 freier Punkt!/)){
					}
								if(content.match(/5 freier Punkt!/)){
				}
				
			
			
			


function empfang(){
			GM_xmlhttpRequest({
	  	method: 'GET',
	  	url: 'http://www.pennergame.de/pet/tab/action/',
	  	onload: function(responseDetails) {
			var content = responseDetails.responseText;
			try{
		         if(content.match(/Fertig/)){
			try{
			      var leinen = content.split('#00d00b;color:#00d00b">')[1].split('gefunden')[0];
			 }catch(e){
					   var leinen = '---';
			 }
	var geld = content.split('Dein Tier hat außerdem')[1].split('erbeutet')[0];
			
						  var highscore = content.split('class="hs_sum">')[1].split('<td>Highscorepunkte')[0];
	           var highscore1 = highscore.split('<td>')[1].split('</td>')[0];

	document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">'+geld+'  gefunden und '+leinen+'..Insgesamt '+highscore1+' Punkte bekommen</font>'
	
window.setTimeout(function() {
	     var request = new XMLHttpRequest();
       request.open('get', '/pet/get_roam_reward/', true);
       request.send(null);
	
 document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">tier in empfang genommen</font>'	
							
stall()
}, 3000);
						 }
		       
			}catch(e){
								 document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">errofr 1</font>'
			 }
 }});
	 
}



	GM_xmlhttpRequest({
		'method': 'GET',
		'url': 'http://www.pennergame.de/pet/',
		'onload': function(result) {
		///	try{
			var dom = document.createElement("div");
			dom.innerHTML = result.responseText;
		//	var linessd = dom.getElementsByClassName("tiername");//[0].getElementsByTagName("tr");
		//	var lines = dom.getElementsByClassName("tieritemB");
    //  for(x = 1; x < 7; x++) {
		 var jj = dom.getElementsByClassName("petbar petbusybar")[0].innerHTML;
			alert(jj)
				var liness = dom.getElementById("pet_roam_time").innerHTML;
			alert(liness)
		}});


//area_id=1%2CRobust%2C1&route_length=10&pet_id=437022: undefined
//undefined HTTP/1.1
function tierlosschicken(){
		                 GM_xmlhttpRequest({
	                    	method: 'POST',
		                    url: 'http://www.pennergame.de/pet/pet_action/',
		                     headers: {'Content-type': 'application/x-www-form-urlencoded'},
		                    data: encodeURI('area_id=1%2CFlink%2C1&route_length=10&pet_id=437847:'),
		                      onload: function(responseDetails){
			 document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">Schike tier  los.....</font>'	
window.setTimeout(function() {
	  GM_xmlhttpRequest({
		  method: 'GET',
		  url: 'http://www.pennergame.de/pet/',
		  onload: function(responseDetails) {
			var content = responseDetails.responseText;
				  try{
	            var unterwegs = content.split('Dein Haustier')[1].split('ist gerade unterwegs')[0];
 			        document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">Tier unterwegs</font>'		;
 		     }catch(e){
 						  document.getElementById("tier4").innerHTML += '<br><font style="color:blue ;font-size:120%;\">error</font>'	
		   	}			

     }});
}, 2000);

}});
}





      
	//		alert(counter1)

		}});

			
			
			
			
			
			
			
					//	}catch(e){
							//       var counter2 = counter1.split('(')[1].split(',')[0];
				
		//	}
			
			
			
			
//
     //  alert(counter1)
   //   alert(counter2)
      
    }});
      
function tierlosschicken(){



var men = document.getElementById("flasch").value;
 var jetzt = new Date();
  var Stunde = jetzt.getHours();
  var Std = ((Stunde < 10) ? "0" + Stunde : Stunde);
  var Minuten = jetzt.getMinutes();
  var Min = ((Minuten < 10) ? "0" + Minuten : Minuten);
  var Sek = jetzt.getSeconds();
  var SekA = ((Sek < 10) ? "0" + Sek : Sek);
var time = ''+Std+':'+Min+':'+SekA+'';
	
//http://www.pennergame.de/pet/tab/action/?1504711289262
//area_id=1%2CRobust%2C1&route_length=10&pet_id=437022: undefined




}


if (window.addEventListener) {
    window.addEventListener("load", ficken, false); // für alle anderen Browser
}
else if (window.attachEvent) {
    window.attachEvent("onload", ficken);           // für ältere IE
}





#dd0


*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
var url = document.location.href;
if (url.indexOf("http://www.pennergame") >= 0) {var link = "http://www.pennergame.de"}
if (url.indexOf("http://pennergame") >= 0) {var link = "http://pennergame.de"}
if (url.indexOf("berlin.pennergame.de") >= 0) {var link = "http://berlin.pennergame.de"}
if (url.indexOf("www.berlin.pennergame.de") >= 0) {var link = "http://www.berlin.pennergame.de"}
if (url.indexOf("muenchen.pennergame.de") >= 0) {var link = "http://muenchen.pennergame.de"}
if (url.indexOf("www.muenchen.pennergame.de")>=0) {var link = "http://www.muenchen.pennergame.de"}
if (url.indexOf("koeln.pennergame.de")>=0) {var link = "http://koeln.pennergame.de"}
if (url.indexOf("www.koeln.pennergame.de")>=0) {var link = "http://www.koeln.pennergame.de"}
if (url.indexOf("reloaded.pennergame.de")>=0) {var link = "http://reloaded.pennergame.de"}
if (url.indexOf("www.reloaded.pennergame.de")>=0) {var link = "http://www.reloaded.pennergame.de"}
if (url.indexOf("sylt.pennergame.de")>=0) {var link = "http://sylt.pennergame.de"}
if (url.indexOf("www.sylt.pennergame.de")>=0) {var link = "http://www.sylt.pennergame.de"}
if (url.indexOf("malle.pennergame.de")>=0) {var link = "http://malle.pennergame.de"}
if (url.indexOf("http://halloweeen.pennergame.de")>=0) {var link = "http://halloweeen.pennergame.de"}
if (url.indexOf("vatikan.pennergame.de")>=0) {var link = "http://vatikan.pennergame.de"}


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
//  body {background-color:#ccc}
//h1   {text-align:center}
  
    head.appendChild(style);
}


addGlobalStyle('div#ladebalken  {height:15px; width:200px;border:1px solid red; margin:auto}')
addGlobalStyle('div#fortschritt {height:15px; width:1px; background-color:blue; border:none}')
addGlobalStyle('div#ladebalken1  {height:15px; width:200px;border:1px solid red; margin:auto}')
addGlobalStyle('div#fortschritt1 {height:15px; width:1px; background-color:blue; border:none}')

 
 





aaa = document.createElement("div");
aaa.setAttribute("style", "position:absolute;top:100px;left:500px;z-index:100;display:block;background-color:black;font-size:10pt;padding:25px;-moz-border-radius:25px;");
aaa.setAttribute("align", "left");
//ladeanzelement.setAttribute("id");
	aaa.innerHTML += '<input type="text" id="flasch" name="flasch" size="5" value="4" ><input id="lose1" class="formbutton" type="button" name="lose1" value="Sale" ><br><input id="lose" class="formbutton" type="button" name="lose" value="Lose " > <span id="sbalki1"</span><input id="start" class="formbutton" type="button" name="start" value="Start Flaschenbot." ><input id="start1" class="formbutton" type="button" name="start1" value="Stop Flaschenbot." ><font style="color:white ;font-size:100%;\"><p id="test2" " </p><br><p id="test1" " </p></b><br><div </div></font>'
document.getElementsByTagName("body")[0].appendChild(aaa);


 
//var mybody = document.getElementById('options').innerHTML;


















if(GM_getValue("suchrr") == null){
	GM_setValue("suchrr", 5000000000)
} 
if (GM_getValue("suchrr") <= 60000){

  document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">Flaschenbot startet ...</font><div id="ladebalken1"><div id="fortschritt1"></div> </div></b>';
var zeit1 = '1';
	ficken1(zeit1)
}
	if (GM_getValue("suchrr") >= 70000){
 document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">Flaschen bot deaktiviert</font></b>';

}

 
 
//var ladevorgang;



 
     
function ficken1(zeit1) {
 	
	 zeit1++;
  var pixel1 =  Math.round(zeit1*10)*1/1;
//var pixel11 =  Math.round(200-pixel1)*1/1;
   var pi  =  Math.round(pixel1/3)*1/1;
  // var erhoehe_pixel1 =  Math.round(zeit/2)*1/1;
// alert(pixel11)
// document.getElementById("pro").innerHTML =''+erhoehe_pixel1+'';
  if (zeit1 <= 200) {
	 //				 document.getElementById("fortschritt").innerHTML+='<center>'+pro+'  % </center>';
//					  document.getElementById("ladebalken").innerHTML+=pro;
	
	
   var schritt = document.getElementById("fortschritt1");
        schritt.style.width = ''+pi+'px';
  window.setTimeout(function () { ficken1(zeit1) }, 1000); 

    
   }
}





















flaschcheck()
function flaschcheck(){
	GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/stock/bottle/',
		onload: function(responseDetails) {
			var content = responseDetails.responseText;
 var flaschen = content.split('<td align="left" width="250">')[1].split('Preis:')[0];
		
 var flaschen1 = flaschen.split('<span>')[1].split(' Pfandflaschen')[0];
			
var flaschen2 = flaschen1.replace(/\s/g, "");
		 
var cent = content.split('zum akuellen Kurs:')[1].split('</b>')[0];
 var cent2 = cent.split('euro;')[1].split(' ')[0];
			var cent3 = cent2.replace(/\,/g, ".");
var preis =  Math.round(flaschen2*cent3)*1/1;

		document.getElementById("test1").innerHTML = 	'<font style="color:blue ;font-size:120%;\"> Flaschen :</font><font style="color:red ;font-size:120%;\">'+flaschen2+'</font><br><font style="color:blue ;font-size:120%;\"> Verkaufswert :</font><font style="color:red ;font-size:120%;\">'+preis+'&euro; </font>';
			
		}});
}
//chkval=25&max=32898&sum=1: undefined

document.getElementsByName('lose1')[0].addEventListener('click', function start() {
// var post = 'chkval=25&max=44700&sum='+mengeflaschen+'&: undefined';
var mengeflaschen = document.getElementById("flasch").value;
 var jetzt = new Date();
  var Stunde = jetzt.getHours();
  var Std = ((Stunde < 10) ? "0" + Stunde : Stunde);
  var Minuten = jetzt.getMinutes();
  var Min = ((Minuten < 10) ? "0" + Minuten : Minuten);
  var Sek = jetzt.getSeconds();
  var SekA = ((Sek < 10) ? "0" + Sek : Sek);
var time = ''+Std+':'+Min+':'+SekA+'';
 	                 GM_xmlhttpRequest({
	                    	method: 'POST',
		                    url: ''+link+'/stock/bottle/sell/',
		                     headers: {'Content-type': 'application/x-www-form-urlencoded'},
		                    data: encodeURI('chkval=25&max=44700&sum='+mengeflaschen+'&:undefined'),
		                      onload: function(responseDetails){
		document.getElementById("test2").innerHTML =' <br><b>'
	+'<font style="color:blue ;font-size:120%;\">'+time+'  Verkaufe ....</font></b>';		
//window.setTimeout(function() {
			GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/stock/bottle/',
		onload: function(responseDetails) {
			var content = responseDetails.responseText;
 var flaschen = content.split('<td align="left" width="250">')[1].split('Preis:')[0];
 var flaschen1 = flaschen.split('<span>')[1].split(' Pfandflaschen')[0];
var flaschen2 = flaschen1.replace(/\ /g, "");

var cent = content.split('zum akuellen Kurs:')[1].split('</b>')[0];
 var cent2 = cent.split('euro;')[1].split(' ')[0];
			var cent3 = cent2.replace(/\,/g, ".");
		
var preis =  Math.round(mengeflaschen*cent3)*100/100;											
		var preis1 =  Math.round(flaschen2*cent3)*1/1;												
									
document.getElementById("test2").innerHTML =' <br><b>'
	+'<font style="color:blue ;font-size:120%;\">'+time+'</font></b>'
	+'<font style="color:green;font-size:120%;\"> <b>  '+mengeflaschen+' Flaschen verkauft für '+preis+' &euro; verkauft</b></font>';			
		document.getElementById("test1").innerHTML = 	'<font style="color:blue ;font-size:120%;\"> Flaschen :</font><font style="color:red ;font-size:120%;\">'+flaschen2+'</font><br><font style="color:blue ;font-size:120%;\"> Verkaufswert :</font><font style="color:red ;font-size:120%;\">'+preis1+'&euro; </font>';
flaschcheck()
        }});
//}, 2000);



}});
}, false);

document.getElementsByName('start')[0].addEventListener('click', function start() {
	var bb = '60000';
	GM_setValue("suchrr", bb)
document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">Flaschenbot gestartet</font></b>';
	check()
location.reload()
}, false);


document.getElementsByName('start1')[0].addEventListener('click', function start() {
	var bb = '500000000';
	GM_setValue("suchrr", bb)
document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">Flaschenbot gestoppt</font></b>';
location.reload()
}, false);

//alert(GM_getValue("suchr"))
  
	window.setInterval(check,GM_getValue("suchrr") )
function check(){
 var jetzt = new Date();
  var Stunde = jetzt.getHours();
  var Std = ((Stunde < 10) ? "0" + Stunde : Stunde);
  var Minuten = jetzt.getMinutes();
  var Min = ((Minuten < 10) ? "0" + Minuten : Minuten);
  var Sek = jetzt.getSeconds();
  var SekA = ((Sek < 10) ? "0" + Sek : Sek);
var time = ''+Std+':'+Min+':'+SekA+'';
 
	GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/activities/',
		onload: function(responseDetails) {
			  var content = responseDetails.responseText;
       
         try{
					  var skilla = content.split('720">12 Stunden</option>')[1].split('<div class')[0];
					            var such = skilla.split('Du bist auf')[1].split(':')[0];
	//window.setInterval(check11, 1000)					 
//function check11() {
				//	 var aaa = document.getElementById("counter2").innerHTML;

//alert(aaa)

            document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">'
							+''+time+'</font></b><b><font style="color:orange;font-size:120%;\">'+such+'</font></b><br><div id="ladebalken"><div id="fortschritt"></div><div id="pro"></div></div>';
					//		+'<img src="http://file1.npage.de/001730/84/bilder/ajax-loader.gif" alt=""> ';
//}

					 var zeit = content.split('type="text/javascript">counter(')[3].split(',"/')[0];
 
                    hour = Math.floor(zeit / 3600);
                    minute = Math.floor((zeit%3600) / 60);
                    second = Math.floor(zeit%60);
                    if ( hour < 10 ) {
                         hour = "0"+hour;
                    }
                    if ( minute < 10 ) {
                         minute = "0"+minute;
                    }
                    if ( second < 10 ) {
                         second = "0"+second;
                    }
                    var zeitt =''+hour+' : '+minute+' : '+second+'';
 
//var ladevorgang;


ficken(zeit)
 
     
function ficken(zeit) {
 	
	 
  var pixel1 =  Math.round(zeit/3)*1/1;
 var pixel11 =  Math.round(200-pixel1)*1/1;
	var pro =  Math.round(pixel11/2)*1/1;
  // var erhoehe_pixel1 =  Math.round(zeit/2)*1/1;
// alert(pixel11)
// document.getElementById("pro").innerHTML =''+erhoehe_pixel1+'';
 //  if (zeit <= 200) {
	 				 document.getElementById("fortschritt").innerHTML+='<span>'+pro+'  %  </span>';
//					  document.getElementById("ladebalken").innerHTML+=pro;
	
	
   var schritt = document.getElementById("fortschritt");
        schritt.style.width = ''+pixel11+'px';
	//   window.setTimeout(function () { ficken(zeit) }, 1000); 

    
 //  }
}


					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
					 
				 
         }catch(e){
		         try{
                  var sucha = content.split('von der')[1].split('.')[0];
					 	 
		              document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">'
									//	+''+time+'</font></b><b><font style="color:orange;font-size:120%;\">'
									+'Gehe Einkaufswagen leeren</font></b>';

		          pfand()	
			
              }catch(e){
                    try{
                    var suchs = content.split('12 Stunden</option>')[1].split('</form>')[0];
		                var suchx = suchs.split('value="Sammeln gehen"')[1].split('type')[0];
		 
			              suchen()

		          
	                  }catch(e){
var suche = content.search("gerade einen Angriff durch");
if (suche != -1) {
	window.setInterval(check111, 1000)
	function check111() {
	 var aaaa = document.getElementById("counter1").innerHTML;
			            document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">'
							+''+time+'</font></b><b><font style="color:red;font-size:120%;\">Du bist am Fighten '+aaaa+'</font></b><br>'
}
}
		              }
				    }
				 }
	 }});
}




			
	function pfand(){

     var jetzt = new Date();
  var Stunde = jetzt.getHours();
  var Std = ((Stunde < 10) ? "0" + Stunde : Stunde);
  var Minuten = jetzt.getMinutes();
  var Min = ((Minuten < 10) ? "0" + Minuten : Minuten);
  var Sek = jetzt.getSeconds();
  var SekA = ((Sek < 10) ? "0" + Sek : Sek);
var time = ''+Std+':'+Min+':'+SekA+'';
	                 GM_xmlhttpRequest({
	                    	method: 'POST',
		                    url: ''+link+'/activities/bottle/',
		                     headers: {'Content-type': 'application/x-www-form-urlencoded'},
		                    data: encodeURI('type=1&time=10&bottlecollect_pending=True&Submit2=Einkaufswagen+ausleeren:'),
		                      onload: function(responseDetails){
														flaschcheck()
                     document.getElementById("test2").innerHTML +=' <br><b><font style="color:blue ;font-size:120%;\">'+time+'</font></b><font style="color:green;font-size:120%;\"><b>Einaufswagen gelert</b></font>';
      check()               
                   }});
}		


function suchen(){
     var jetzt = new Date();
  var Stunde = jetzt.getHours();
  var Std = ((Stunde < 10) ? "0" + Stunde : Stunde);
  var Minuten = jetzt.getMinutes();
  var Min = ((Minuten < 10) ? "0" + Minuten : Minuten);
  var Sek = jetzt.getSeconds();
  var SekA = ((Sek < 10) ? "0" + Sek : Sek);
var time = ''+Std+':'+Min+':'+SekA+'';
	GM_xmlhttpRequest({
		method: 'POST',
		url: ''+link+'/activities/bottle/',
		headers: {'Content-type': 'application/x-www-form-urlencoded'},
		data: encodeURI('sammeln=10&konzentrieren=1: undefined'),
		onload: function(responseDetails){
    document.getElementById("test2").innerHTML = '<br><b><font style="color:blue ;font-size:120%;\">'+time+'</font></b><b><font style="color:green;font-size:120%;\">  Bin wieder sammeln</font></b>';

    }});
}
/////////////////////////   hier startet lose bot /////////////////////////////////////////////////
document.getElementsByName('lose')[0].addEventListener('click', function start() {


  document.getElementById('sbalki1').innerHTML = '<b><font style="color:blue ;font-size:120%;\">Losebot startet....</font>';

	GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/overview/',
		onload: function(responseDetails) {
			  var content = responseDetails.responseText;
        var skilla = content.split('>Geld:</span>')[1].split('</li>')[0];
    
            var such = skilla.split('&euro;')[1].split('<')[0];
var suchr = such.replace(/\,/g, ".");
			   GM_setValue("suchr", suchr) 
		}});
		        GM_xmlhttpRequest({
  	method: 'GET',
   	url: ''+link+'/city/games/',
        onload: function(responseDetails) {
        	var acontent = responseDetails.responseText;
        var text1 = acontent.split('Du kannst heute noch ')[1];
var NochLose = text1.split(' Lose kaufen')[0];
var text11 = NochLose.split('lose_remaining">')[1];
var menge11 = text11.split('<')[0];
//var test =  Math.round(500-NochLos)     
	var menge1 = menge11;
			if(menge1 < 1){
				alert('du kannst heute keine lose mehr kaufen ')
				location.reload()
			}
				if(menge1 > 1){

	   document.getElementById('sbalki1').innerHTML = '<b><font style="color:blue ;font-size:120%;\">Aktuelles guthaben '+GM_getValue("suchr")+'<br> du kannst noch '+menge1+' kaufen</font>';
  bot1(menge1)
				}
		}});

 
  
  
  function bot1(menge1){
  if(menge1 >= 1){
      var menge1 = menge1-10;

kaufen(menge1)
    }
    if(menge1 <= 0){ 
      	GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/overview/',
		onload: function(responseDetails) {
			  var content = responseDetails.responseText;
        var skilla = content.split('>Geld:</span>')[1].split('</li>')[0];
    
            var such = skilla.split('&euro;')[1].split('<')[0];
 
var suchr = such.replace(/\,/g, ".");

var gewinn = Math.round(suchr-GM_getValue("suchr"))*1000/1000;    
      
    document.getElementById('sbalki').innerHTML += '<br><b><font style="color:blue ;font-size:120%;\">Gewinn durch losebot  '+gewinn+'.00 &euro;</font>';  
			location.reload(5000)
      }});
		}
	}


  function kaufen(menge1){
  
        GM_xmlhttpRequest({
      method: 'POST',
      url: ''+link+'/city/games/buy/',
      headers: 
      {'Content-type': 'application/x-www-form-urlencoded'},
      data: encodeURI('menge=10&id=1&preis=1.00&preis_cent=100&submitForm=F%C3%BCr+%E2%82%AC10.00+kaufen'),
      onload: function(){

		        GM_xmlhttpRequest({
  	method: 'GET',
   	url: ''+link+'/city/games/',
        onload: function(responseDetails) {
        	var acontent = responseDetails.responseText;
        var text1 = acontent.split('Du kannst heute noch ')[1];
var NochLose = text1.split(' Lose kaufen')[0];
var text11 = NochLose.split('lose_remaining">')[1];
var NochLos = text11.split('<')[0];
var test =  Math.round(500-NochLos)     
          
document.getElementById('sbalki').innerHTML = '<b><font style="color:blue ;font-size:120%;\">'+NochLos+' / 500 <br>habe gekauft '+test+' Lose</font><br><font style="color:red ;font-size:120%;\">Bitte nicht unterbrechen...</font>';
     bot1(menge1) 
				}});
       }});      
	}



}, false);

