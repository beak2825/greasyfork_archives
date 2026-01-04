// ==UserScript==
// @name           Pennergame LoseBot mit Detalierter auflistung
// @include        *pennergame.de/city/games/*
// @version       11-06-2018-1
// @description  der altelosebotjetzt mit einzelheiten die vorher nie beachtet wurden (zeigt jedes los ob und wie viel gewonnen)
// @namespace      bots die man immer gebrauchen kann ..Von pennerhackisback
// @author         pennerhackisback
// @copyright     Basti1012 alias Pennerhack
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_addStyle
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant    GM_xmlhttpRequest
 
// @downloadURL https://update.greasyfork.org/scripts/33309/Pennergame%20LoseBot%20mit%20Detalierter%20auflistung.user.js
// @updateURL https://update.greasyfork.org/scripts/33309/Pennergame%20LoseBot%20mit%20Detalierter%20auflistung.meta.js
// ==/UserScript==

 
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('#haben,#noch{margin-left:20px}#balken  {height:25px; width:200px;overflow:hidden;border:1px solid red;background:green; margin:auto}#balkeninnen {height:25px; width:1px;text-align:center; background-color:blue; border:none}#bild{width:200px;height:300px}#bot{height:1000px}#aus3{  display:none;  position:absolute;  top:39%;  left:-8px;  transform:rotateZ(15deg);  width:102%;  height:10px;  background:red;  border-radius:50px;}#aus4{  display:none;  position:absolute;  top:39%;  left:-8px;  transform:rotateZ(-15deg);  width:102%;  height:10px;  background:red;   border-radius:50px;}td{  width:44%;  margin:0;  padding:0;  font-size:25px}.botclass{  width:45%;  height:25px;  font-size:21px;  padding:0;  margin-left:1px;}td{  border-bottom:1px solid black;}form{width:100%;padding:5px; border:10px solid white;box-shadow:15px  15px 15px black;border-radius:25px;display:inline-block;max-height:400px;overflow:auto;}#aus1 p{width:500px;display:inline-block;display:flex;font-size:20px;}');


var nochlos=$('#lose_remaining').html();
guthaben1=$('#options li a').html().trim();
guthaben2=guthaben1.replace('€','');
guthaben3=guthaben2.replace(',','');
guthaben=guthaben3.replace('.','');
localStorage.setItem('hab',guthaben);
localStorage.setItem('start',guthaben);

if(nochlos>=101){
   farb='lightgreen';
   addGlobalStyle('#aus3,#aus4{display:none}');
}else if(nochlos >= 1){
   farb='orange';
   addGlobalStyle('#aus3,#aus4{display:none}');
}else if(nochlos==0){
   addGlobalStyle('#aus3,#aus4{display:block}');
   farb='red';
}
addGlobalStyle('#menge{background:'+farb+'}');

$('.tieritemA').html('<div id="tieritemA"><form><table id="bot"><tr><td>Lose Guthaben:</td><td class="ab"> '+nochlos+'</td><td rowspan="7"><img src="https://static.pennergame.de/img/pv4/shop/de_DE/games/Rubbellos_31.jpg" alt="Rubbellos" title="Rubbellos"></td></tr><tr><td>Kontostand:</td><td class="ab" id="gut">'+guthaben1+'</td></tr><tr><td>Kaufe  1 Los :</td><td><input type="radio" value="1" name="was"  class="was" id="eins"></td></tr><tr><td>Kaufe 10 Lose :</td><td><input type="radio" value="10" class="was" name="was" id="zehn"></td></tr><tr><td>Mit details :</td><td><input type="checkbox" id="details"></td></tr><tr><td>Menge:</td><td><input type="text" class="botclass" id="menge" value="'+nochlos+'"><input class="botclass" type="button" id="start" value="Bot Starten"></td></tr><tr><td colspan="2"><div id="balken" ><div id="balkeninnen"> </div></div></td></tr><tr colspan="2" id="aus1"></tr><tr colspan="2" id="aus"></tr></table></form><div id="aus3"></div><div id="aus4"></div></div> ');

 $('#start').click(function(){
    var wieviele_kaufen=$('#menge').val();
    var mit_details=$('#details').is(':checked')
    var radio=$("input[name='was']:checked").val()
    var NOCH;
    var plus=0;
    los(wieviele_kaufen,plus);
    function los(NOCH,plus){
        plus=plus+parseInt(radio);
        var NOCH=NOCH-radio;
        if(NOCH>=0){
            kaufe(NOCH,plus)
            $('#aus1').html('<p style="font-size:30px">kaufe noch '+NOCH+' Lose.</p> ');
        }
    }

    function kaufe(NOCH,plus){
       if(mit_details==true){
           GM_xmlhttpRequest({
		      method: 'GET',
		      url: 'http://www.pennergame.de/city/games/',
		      onload: function(responseDetails) {
		          var content = responseDetails.responseText;
		          var suchas = content.split('bersicht zu kommen">')[1].split('</li>')[0];
		          var suchd = suchas.split('&euro;')[1].split('</a>')[0];
		          var suchd = suchd.replace(/\n|\r/g,"");
		          var suchd = suchd.replace(/\s/g, "");
		          var suchd = suchd.replace(/\,/g, "");
		          var hab = suchd.replace(/\./g, "");
                  var vergleich=localStorage.getItem('hab');
             	  if(vergleich == hab){
			           var farbes = 'orange';
		          }else if(vergleich < hab){
		               var farbes = 'green';
		          }else if(vergleich > hab){
			           var farbes = 'red';
			      }
                  var hab1=hab/100;
                  localStorage.setItem('hab',hab);
                  var details='<span style="color:'+farbes+'">Kontostand  '+hab1+'  &euro;</span><br>';
                  document.getElementById('aus').innerHTML+=details;
                  bezahlen(NOCH,plus)
             }
         });  
     }else{
         var details='Ohne Details';
         var hab='';
         bezahlen(NOCH,plus)
     }
     function bezahlen(NOCH,plus){
    
	     GM_xmlhttpRequest({
      	     method: 'POST',
     	     url: 'https://www.pennergame.de/city/games/buy/',
      	     headers: 
             {'Content-type': 'application/x-www-form-urlencoded'},
             data: encodeURI('menge='+radio+'&id=1&preis='+radio+'.00&preis_cent=100&submitForm=F%C3%BCr+%E2%82%AC0.00+kaufen'),
     	     onload: function(){
                 var k=200/wieviele_kaufen;
                 var k1=k*plus;
                 var k2=k1/2;
                 var k2=k2.toFixed(2);                
                 $('#balkeninnen').css('width',k1+'px')        
                 $('#balkeninnen').html(k2+' %')
                 if(k2==100){
                    var gewinn=localStorage.getItem('start')-localStorage.getItem('hab');
                    if(gewinn==0){
                         // var gewinn1='<p>Fertig gekauft ,das Lose kaufen hat nix an deinen Kontostand geändert</p>';
                    }
                    if(gewinn>0){
                        gewinn=gewinn/100;
                        var gewinn1='<p style="font-size:20px">Fertig gekauft ,'
                        +'du hast <span style="color:red">'+gewinn+' &euro; </span>verlust gemacht</p>';
                    }
                    if(gewinn<0){
                        gewinn=gewinn/100;
                        var gewinn1='<p style="font-size:20px">Fertig gekauft ,'
                        +'du hast <span style="color:green">'+gewinn+' &euro; </span>Gewinn gemacht</p>';
                    } 
                    $('#aus1').html(gewinn1);
                 }
                 los(NOCH,plus)
             }
         });
     }
   }
})                    
// Copyright By Basti1012 http://sebastian1012.bplacede.net