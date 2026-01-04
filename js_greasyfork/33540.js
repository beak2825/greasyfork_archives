// ==UserScript==
// @name        Waffe anlegen beim kaufen pennergame
// @namespace    Beim waffen kaufkann man die waffe gleich anlegen
// @author       pennerhackisback früher basti1012 oder pennerhack
// @description  wer faul ist und klicks ersparen will nimmt dieses script
// @include      http://*.pennergame.de/city/weapon_store/def/buy/*
// @version      25.09.2017 02
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @downloadURL https://update.greasyfork.org/scripts/33540/Waffe%20anlegen%20beim%20kaufen%20pennergame.user.js
// @updateURL https://update.greasyfork.org/scripts/33540/Waffe%20anlegen%20beim%20kaufen%20pennergame.meta.js
// ==/UserScript==
// 


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


var tabel1 = document.getElementById('content');
var tabel2 = tabel1.getElementsByTagName('table');

for(e=0; e <= tabel2.length; e++){
 weiter(e,tabel2) 
 } 
  
function  weiter(e,tabel2){
     var tabel3 = tabel2[e].getElementsByTagName('tr')[2];
     var tabel4 = tabel3.getElementsByTagName('td')[0].innerHTML;
     var gekauft = tabel4.split('value="')[2].split('"')[0];
  
     var ids = tabel4.split('value="')[1].split('"')[0];
     var tabel3v = tabel2[e].getElementsByTagName('tr')[2];
  		 var suche = gekauft.search("gekauft");
		try{
			if (suche != -1) {
  var  rein = 'Bereits gekauft';
            }else{
            var rein = ''+gekauft+' und Anlegen ??';  
              
            }
        }catch(s){}
     var tabel4 = tabel3v.getElementsByTagName('td')[0].innerHTML = '<input   type="button" name="kaufen'+e+'" value="'+rein+'">';
  
     document.getElementsByName('kaufen'+e)[0].addEventListener('click', function start() {
          var ids = tabel4.split('value="')[1].split('"')[0];
          var was1 = document.getElementsByTagName('table')[e].innerHTML;
          var was = was1.split('name">')[1].split('<')[0];
          fragen(ids,was)
     
     }, false);    
}
    
function fragen(ids,was){
  
   Check = confirm('Möchten sie die waffe  " '+was+' " gleich anlegen ');
if (Check == true) {

 kaufen(ids,was)
 anlegen(ids,was)
 
} else {
 kaufen(ids,was)
 
} 
}   
    
    function kaufen(ids,was){
        	GM_xmlhttpRequest({
		method: 'POST',
		url: ''+link+'/city/weapon_store/',
		headers: {'Content-type': 'application/x-www-form-urlencoded'},
		data: encodeURI('id=20&submitForm=Benutzen: undefined '),//
		onload: function(responseDetails){
          alert('"'+was+'" gkauft')
       }});
 }


function anlegen(ids,was){
     GM_xmlhttpRequest({
		method: 'POST',
		url: ''+link+'/stock/armoury/sell/',
		headers: {'Content-type': 'application/x-www-form-urlencoded'},
		data: encodeURI('id='+ids+'&submitForm=Benutzen:'),//undefined
		onload: function(responseDetails){
      
               alert('"'+was+'" angelegt')
       }});
}