// ==UserScript==
// @name Pennergame LoseBot fuer Pennergame 2017
// @namespace       Pennerhackisback früher pennerhack oder basti1012
// @description    Kauft die angegebene Anzahl Lose automatisch
// @include        */city/games/*
// @version       09.2017
// @author         Basti1012
// @copyright      Pennerhackisback früher pennerhackoder basti1012
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/32802/Pennergame%20LoseBot%20fuer%20Pennergame%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/32802/Pennergame%20LoseBot%20fuer%20Pennergame%202017.meta.js
// ==/UserScript==


    
var mybody = document.getElementsByTagName('body')[0].innerHTML;
var text1 = mybody.split('Du kannst heute noch ')[1];
var NochLose = text1.split(' Lose kaufen')[0];
var text11 = NochLose.split('lose_remaining">')[1];
var NochLos = text11.split('<')[0];

var text1 = mybody.split('Du kannst heute noch ')[1];
var NochLose = text1.split(' Lose kaufen')[0];
var text11 = NochLose.split('lose_remaining">')[1];
var NochLos = text11.split('<')[0];



document.getElementById('content').getElementsByClassName('listshop')[0].getElementsByTagName('td')[4].innerHTML = 
'Menge:'+
'<input name="mengeH" id="mengeH" size="3" value="'+NochLos+'">'+
  '<input id="start" class="formbutton" type="button" name="start" value="Start Losebot." >'+
'<div id="sbalki"><div id="sbalki1">'+
'</div>';


  document.getElementById('sbalki1').innerHTML = 'Losebot ist Startbereit';

document.getElementsByName('start')[0].addEventListener('click', function start() {			
var menge =document.getElementsByName('mengeH')[0].value;
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.pennergame.de/overview/',
		onload: function(responseDetails) {
			  var content = responseDetails.responseText;
        var skilla = content.split('>Geld:</span>')[1].split('</li>')[0];
    
            var such = skilla.split('&euro;')[1].split('<')[0];
var suchr = such.replace(/\,/g, ".");

   GM_setValue("suchr", suchr) 
      }});
  bot1(menge) 
  document.getElementById('sbalki1').innerHTML = 'kaufe '+menge+' Lose';
  
  
  
  
  
  
  function bot1(menge){
//var start = GM_getValue('menge');
//  alert(start)
  if(menge >= 1){
   // document.getElementById('sbalki').innerHTML= 'Noch '+start+' LOSE ZU KAUFEN';
      var menge = menge-10;
//alert(menge)

kaufen(menge)
    }
    if(menge <= 0){ 
      	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.pennergame.de/overview/',
		onload: function(responseDetails) {
			  var content = responseDetails.responseText;
        var skilla = content.split('>Geld:</span>')[1].split('</li>')[0];
    
            var such = skilla.split('&euro;')[1].split('<')[0];
 
var suchr = such.replace(/\,/g, ".");

var gewinn = Math.round(suchr-GM_getValue("suchr"))*1000/1000;    
      
    document.getElementById('sbalki').innerHTML += '<br>Gewinn durch losebot  '+gewinn+'.00 &euro;';  
      }});
      
      
      
        
     

///setInterval("window.location.reload();", 5000);
        
        
    }
  
 
  
  
  
  
  function kaufen(menge){
  
        GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://www.pennergame.de/city/games/buy/',
      headers: 
      {'Content-type': 'application/x-www-form-urlencoded'},
      data: encodeURI('menge=10&id=1&preis=1.00&preis_cent=100&submitForm=F%C3%BCr+%E2%82%AC10.00+kaufen'),
      onload: function(){

        GM_xmlhttpRequest({
  	method: 'GET',
   	url: "http://www.pennergame.de/city/games/",
        onload: function(responseDetails) {
        	var acontent = responseDetails.responseText;
        var text1 = acontent.split('Du kannst heute noch ')[1];
var NochLose = text1.split(' Lose kaufen')[0];
var text11 = NochLose.split('lose_remaining">')[1];
var NochLos = text11.split('<')[0];
var test =  Math.round(500-NochLos)     

          
document.getElementById('sbalki').innerHTML = '<div class="processbar_bg" style="width: 500px;">'
 +'<div id="active_process2" class="processbar" style="width: '+test+'px;">'+NochLos+' / 500</div></div><br>kaufe noch '+menge+' Lose';
     bot1(menge) 
 
       }});      
      }});
  }
  

}
     






},false); 


// Copy By Pennerhack_is_back aliace Basti1012
// 
//dieses ist ein enacherer losebot deralle lose mit ein klick verkaufen tut 