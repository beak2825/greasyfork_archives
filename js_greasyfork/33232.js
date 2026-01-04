// ==UserScript==
// @name        Pennergame tier weiterbildung in status leiste
// @namespace   basti 10121012
// @description ersetzt das newsbbild in einen weiterbildungs counter von tierweiterbildunegen
// @include     *pennergame*
// @version     16.09.2017
// @author         pennerhackisback
// @copyright     Basti1012 alias Pennerhack
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/33232/Pennergame%20tier%20weiterbildung%20in%20status%20leiste.user.js
// @updateURL https://update.greasyfork.org/scripts/33232/Pennergame%20tier%20weiterbildung%20in%20status%20leiste.meta.js
// ==/UserScript==

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


	 GM_xmlhttpRequest({
				method: 'GET',
				url: ""+link+"/skills/pet/",
					onload: function(response) {
						var content = response.responseText;
	 	        try{
				        var part = content.split('class="style_skill">')[2].split('</span')[0];
                var time = part.split('(')[1].split(',')[0];
 							  var w_end0 = content.split('bereits eine Weiterbildung')[1];
							  var w_type1 = w_end0.split('<span class="style_skill">')[1].split('</span>')[0];
                var timeleft = time;
			          hallo(timeleft)
						    function hallo(timeleft){
                    hour = Math.floor(timeleft / 3600);
                    minute = Math.floor((timeleft%3600) / 60);
                    second = Math.floor(timeleft%60);
                    if ( hour < 10 ) {
                         hour = "0"+hour;
                    }
                    if ( minute < 10 ) {
                         minute = "0"+minute;
                    }
                    if ( second < 10 ) {
                         second = "0"+second;
                    }
                    var zeit =''+hour+' : '+minute+' : '+second+'';
                    var suche = w_type1.search("Angriff");
			              if (suche != -1) {
                         var bild ='<img height="30" width="30"  src="http://static2.pennergame.de/img/pv4/icons/attack.jpg" />';
			              }else{}
			                   var suche = w_type1.search("Verteidigung");
			              if (suche != -1) {
                         var bild ='<img height="30" width="30"  src="http://static2.pennergame.de/img/pv4/icons/def.jpg" />';
			              }else{}
			                   var suche = w_type1.search("Kunststücke");
			              if (suche != -1) {
                         var bild ='<img height="30" width="30"  src="http://static2.pennergame.de/img/pv4/icons/petart.jpg" />';
			              }else{}
                    var trw = document.getElementById('topmenu');
                    if (timeleft > 2) {
                        timeleft--;
                        var trwq = trw.getElementsByTagName('li')[5];
                        trwq.innerHTML = '<center>'+bild+'</center><font style="color:white ;font-size:100%;\"><b> '+zeit+'</b></font>';
                        window.setTimeout(function () { hallo(timeleft) }, 1000);
	 				          }
		           }
		       }catch(e){
			     var trw = document.getElementById('topmenu');
			     var trwq = trw.getElementsByTagName('li')[5];
           trwq.innerHTML = '<td align="center"><a href="/skills/pet/" ><font style="color:white ;font-size:100%;\"><br>&nbsp;&nbsp;<b>--:--</b></font></a></td>';
		  }
 }});
