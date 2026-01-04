// ==UserScript==
// @name Bandenhighscore  mssionspunkte highscore pennergame 2017
// @namespace erstellt ein neues highscore bild mit alle daten die man für fremde banden bekommenn kann
// @include      http://*.pennergame.de/highscore/gangrank/*
// @include      http://*.pennergame.de/highscore/missionpoints/*
// @version      30.09.2017 01
// @description pennerhackisbck früher asti1012 oder pennerhack
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @grant			GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/33667/Bandenhighscore%20%20mssionspunkte%20highscore%20pennergame%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/33667/Bandenhighscore%20%20mssionspunkte%20highscore%20pennergame%202017.meta.js
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
 
 var ausgabebe = document.getElementsByTagName('table')[0].style="width:1550px; left:-100px;";
 var ausgabebereich = document.getElementsByTagName('thead')[0];//.getElementsByTagName('tr')[0];
 ausgabebereich.innerHTML = '<table class="list" border="1" ><tr bgcolor="#272720">'
  +'<th align="center" width="30"> </th>'
  +'<th align="center" width="150">Bande   </th>'
  +'<th align="center" width="100">Punkte    </th>'
  +'<th align="center" width="50">Mitglieder  </th>'
  +'<th align="center" width=" ">ø Punkte</th>'
  +'<th align="center" width="100">Missionspunkte     </th>'
  +'<th align="center" width="100">Rankpunkte   </th>'
  +'<th align="center" width="150">Herschend in </th>'
  +'<th align="center" width="200">Qualifizierung  </th> </tr></table>';
 a=1;
start(a)
function start(a){
  if(a<=25){
    var tab = document.getElementsByTagName('table')[0] ;
    var tr =  tab.getElementsByTagName('tr')[a].innerHTML;
    var id = tr.split('/profil/bande:')[1].split('/')[0];
    banden(a,id)
  }
}
 function banden(a,id){
     GM_xmlhttpRequest({
    	 method: 'GET',
		     url: ''+link+'/profil/bande:'+id+'/',
		     onload: function(responseDetails) {
		      var content = responseDetails.responseText;
              var name = content.split('broad_content_shell">')[1].split('">&nbsp;')[1].split('</span>')[0];
		      var mitglied = content.split('class="gang_header_sub">')[1].split('Mitglieder')[0];
       		  var punkte = content.split('class="gang_header_sub">')[1].split('Mitglieder')[1].split('Punkte')[0];
          	  var durchschnitt = content.split('class="gang_header_sub">')[1].split('Punkte')[1].split('Punkte')[0];           
         	  var missionspunkte = content.split('class="gang_header_sub">')[1].split('Punkte')[2].split('Missionspunkte')[0];   
              var Rangpunkte = content.split('class="gang_header_sub">')[1].split('Missionspunkte')[1].split('Rangpunkte')[0];
              try{
                 var stadt1 = content.split('class="gang_header_sub">')[1].split('Herrschend in ')[1].split('<a href=')[0];
                   var stadt = ''+stadt1+' <a href="/gang/fight/?b_name='+name+'">[Angreifen]</a>';
              }catch(e){
                 var stadt = '----'
              }
               
               
          var Rangpunkte = Rangpunkte.replace(/\&nbsp;/g, "");
          var stadt = stadt.replace(/\&nbsp;/g, ""); 
          var punkte = punkte.replace(/\&nbsp;/g, "");    
          var durchschnitt = durchschnitt.replace(/\&nbsp;/g, ""); 
          var missionspunkte = missionspunkte.replace(/\&nbsp;/g, "");
             
    try{           
       var handel = content.split('<span>Bandenliga</span>')[1].split('<div style="clear:both;')[0];            
       var qualli = handel.split('</span><br />')[1].split('</span><br />')[0];      
    }catch(e){
       var qualli = '----'; 
    }             
        var ausgabebereich1 = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[a];
        ausgabebereich1.innerHTML = '<table  class="list" border="1" width="1250"><tr bgcolor="#272727">'
        +'<th align="center" width="30">'+a+'</th>'
        +'<th align="center" width="150"><a href="/profil/bande:'+id+'/">'+name+'</a></th>'
        +'<th align="center" width="100">'+punkte+'</th>'
        +'<th align="center" width="50">'+mitglied+'</th>'
        +'<th align="center" width="100">'+durchschnitt+'</th>'
        +'<th align="center" width="50" bgcolor="#272727">'+missionspunkte+'</th>'
        +'<th align="center" width="50" bgcolor="#272727">'+Rangpunkte+'</th>'
        +'<th align="center" width="300" bgcolor="#272727">'+stadt+'</th>'
        +'<th align="center" width="150" bgcolor="#272727">'+qualli+'</th></tr></table>';
        a++;
        start(a)
    }});
 }

 





