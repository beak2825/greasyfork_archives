// ==UserScript==
// @name		Komplett rest spiel errechner pennergame
// @include        *pennergame.de/overview/*
// @version       10.2017.5
// @description  errechnet dir das geschafft komplett ergebniss aus 
// @namespace      bots die man immer gebrauchen kann ..
// @author         pennerhackisback
// @copyright     Basti1012 alias Pennerhack
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/33627/Komplett%20rest%20spiel%20errechner%20pennergame.user.js
// @updateURL https://update.greasyfork.org/scripts/33627/Komplett%20rest%20spiel%20errechner%20pennergame.meta.js
// ==/UserScript==



  var table2 = document.getElementsByClassName("settingpoint")[0];
 

var newtr = new Array();
for (x = 0; x <= 5; x++){
	newtr[x] = document.createElement('tieritemA');
	table2.appendChild(newtr[x]);
}
 
alles()




function alles(){
  skillsa()
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

  
function wohnung(){
  var table1 = document.getElementsByClassName("first")[2];
  var wohnug = table1.getElementsByTagName("li")[0].innerHTML;
  
  if(wohnug == 'Bürgersteig'){var wohn = '1';}
else if(wohnug == 'Park'){var wohn = '2';}
else if(wohnug == 'Parkbank'){var wohn = '3';}
else if(wohnug == 'Pennerbox'){var wohn = '4';}
else if(wohnug == 'Brunnen'){var wohn = '5';}
else if(wohnug == 'Brücke'){var wohn = '6';}
else if(wohnug == 'Katakomben'){var wohn = '7';}
else if(wohnug == 'Elbstrand'){var wohn = '8';}
else if(wohnug == 'Baumhaus'){var wohn = '9';}
else if(wohnug == 'Zelt'){var wohn = '10';}
else if(wohnug == 'Wolfsrudel'){var wohn = '11';}
else if(wohnug == 'Wohnwagen'){var wohn = '12';}
else if(wohnug == 'Boot'){var wohn = '13';}
else if(wohnug == 'Grabkammer'){var wohn = '14';}
else if(wohnug == 'Tiefgarage'){var wohn = '15';}
else if(wohnug == 'Kakao Fabrik'){var wohn = '16';}
else if(wohnug == 'Kran'){var wohn = '17';}
else if(wohnug == 'Leuchtturm'){var wohn = '18';}
else if(wohnug == 'Alte Kirche'){var wohn = '19';}
else if(wohnug == 'Burg'){var wohn = '20';}
else if(wohnug == 'Sternwarte'){var wohn = '21';}
else if(wohnug == 'Schloss'){var wohn = '22';}
else{var wohn = '0';}
 return wohn;
}
  
 function mucke(){
 
var table1 = document.getElementsByClassName("first")[3];
var musik = table1.getElementsByTagName("li")[0].innerHTML;
 if(musik == 'Grashalm-Flöte'){var musi = '1';}
else if(musik == 'Flaschen-Flöte'){var musi = '2';}
else if(musik == 'Glocke'){var musi = '3';}
else if(musik == 'Trommel'){var musi = '4';}
else if(musik == 'Akkordeon'){var musi = '5';}
else if(musik == 'Radio'){var musi = '6';}
else if(musik == 'Gitarre'){var musi = '7';}
else if(musik == 'Saxophon'){var musi = '8';}
else if(musik == 'Chor'){var musi = '9';}
else{var musi = '0';}
 return musi;
 }
 function schnorry(){
 var table1 = document.getElementsByClassName("first")[4];
 var schnorrw = table1.getElementsByTagName("li")[0].innerHTML;
  schnorr= schnorrw.split(' ')[0];
 if(schnorr.indexOf("Kindergarten") >= 0){var schn = '1';}
 else if(schnorr.indexOf("Punks") >= 0){var schn = '2';}
  else if(schnorr.indexOf("Arbeitsamt") >= 0){var schn = '3';}
 else if(schnorr.indexOf("Kneipe") >= 0){var schn = '4';}
  else if(schnorr.indexOf("Bahnhof") >= 0){var schn = '5';}
 else if(schnorr.indexOf("U-Bahn") >= 0){var schn = '6';}
  else if(schnorr.indexOf("Einkaufszentrum") >= 0){var schn = '7';}
    else if(schnorr.indexOf("Börse") >= 0){var schn = '8';}

else{var schn = '0';}
 return schn;
  }
 function tiere(){
 var table1 = document.getElementsByClassName("first")[6];
 var tier = table1.getElementsByTagName("li")[0].innerHTML;
 var tier = tier.replace(/\"/g, "");
  var tier = tier.replace(/\ /g, "");
    var tier = tier.replace(/\ \g/g, "");
 

   if(tier == 'Kakerlake'){var tierl = '1';}
else if(tier == 'Goldfisch'){var tierl = '2';}
else if(tier == 'Maus'){var tierl = '3';}
else if(tier == 'Hamster'){var tierl = '4';}
else if(tier == 'Wellensittich'){var tierl = '5';}
else if(tier == 'Taube'){var tierl = '6';}
else if(tier == 'Ratte'){var tierl = '7';}
else if(tier == 'Hase'){var tierl = '8';}
  else if(tier == 'Frettchen'){var tierl = '9';}
else if(tier == 'Katze'){var tierl = '10';}
else if(tier == 'Falke'){var tierl = '11';}
else if(tier == 'Schlange'){var tierl = '12';}
else if(tier == 'Hausziege'){var tierl = '13';}
else if(tier == 'Pudel'){var tierl = '14';}
else if(tier == 'Adler'){var tierl = '15';}
  
  else if(tier == 'Schäferhund'){var tierl = '16';}
else if(tier == 'Pitbull'){var tierl = '17';}
else if(tier == 'Cockerspaniel'){var tierl = '18';}
else if(tier == 'Chihuahua'){var tierl = '19';}
else if(tier == 'Pferd'){var tierl = '20';}
else if(tier == 'Giraffe'){var tierl = '21';}
else if(tier == 'Nilpferd'){var tierl = '8';}
  
  else if(tier == 'Krokodil'){var tierl = '22';}
else if(tier == 'Tiger'){var tierl = '23';}
else if(tier == 'Äffchen'){var tierl = '24';}
else if(tier == 'Nashorn'){var tierl = '25';}
else if(tier == 'Elefant'){var tierl = '26';}
else if(tier == 'Eisbär'){var tierl = '27';}
else if(tier == 'Dressierte Maus '){var tierl = '28';}
  else{var tierl = '0';}
 return tierl;
 } 
  function skillsa(){
 
         GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://www.pennergame.de/skills/',
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
    
var sprechen = contenta.split('Sprechen</stron')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();
var bildungssstufe = contenta.split('Bildungsstufe</strong>')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();
var musik = contenta.split('Musik</strong>')[1].split('</tr> ')[0].split('<td width="108">')[1].split('<')[0].trim();         
var sozial = contenta.split('<strong>Sozialkontakte')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();   var konzi = contenta.split('Konzentration</strong>')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();     var tasche = contenta.split('Taschendiebstahl</strong>')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();     
var mus = musik.split('/')[0];
  var mus1 = mus;
var mus = 100/17*mus;
var mus = mus.toFixed(2)/1;    
if(mus>100){
var mus = 100;
}     
     
var spr = sprechen.split('/')[0];
 var spr1 = spr;
var spr = 100/13*spr;  
var spr = spr.toFixed(2)/1;             
if(spr>100){
var spr = 100;
}    
     
var bil = bildungssstufe.split('/')[0];
 var bil1 = bil;
var bil = 100/12*bil; 
var bil = bil.toFixed(2)/1;              
if(bil>100){
var bil = 100;
}                
      
var soz = sozial.split('/')[0];
 var soz1 = soz;
var soz = 100/22*soz;  
var soz = soz.toFixed(2)/1;          
if(soz>100){
var soz = 100;
}                
              
var kon = konzi.split('/')[0];
 var kon1 =  kon;
var kon = 100/4*kon;  
var kon = kon.toFixed(2)/1;         
if(kon>100){
var kon = 100;
}                
              
var tas = tasche.split('/')[0];
 var tas1 = tas;
var tas = 100/4*tas; 
var tas = tas.toFixed(2)/1;            
if(tas>100){
var tas = 100;
}               
                 
var att = 100/186*att1;
 var atte = ''+att1+'.0';
var att = att.toFixed(2)/1;
if(att>100){
var att = 100;
}           
            
var def = 100/186*def3;
 var deff = ''+def3+',0';         
var def = def.toFixed(2)/1;
if(def>100){
var def = 100;
}             
              
var ges = 100/165*ges1;
 var gess = ''+ges1+'.0';
var ges = ges.toFixed(2)/1;
if(ges>100){
var ges = 100;
}    
          var komplett1 = mus+spr+bil+soz+kon+tas+att+def+ges;   
          var komplett2 = komplett1/9;
           komplett = komplett2.toFixed(2)/1;
            var selberdef = '186';
             var selberatt = '186';
              var selberges = '165';
var all = parseInt(att1)+parseInt(def3)+parseInt(ges1)+parseInt(sprechen)+parseInt(bildungssstufe)+parseInt(musik)+parseInt(sozial)+parseInt(konzi)+parseInt(tasche);
             
 newtr[0].innerHTML = '<div class="tieritemA" style="width: 500px;"><div class="clearcontext"><h2>Skills</h2><br> </div>'
              
+'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200"> Att: </th><th align="left" width="200"> '+att1+'/'+selberatt+' </th><th align="left" width="100">('+att+' %)</th> </tr></tbody></table>'
              
	+' <table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Deff:</th><th align="left" width="200">'+def3+'/'+selberdef+' </th><th align="left" width="100">('+def+'%)</th> </tr></tbody></table>'	
              
      +'	 <table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Geschick:</th><th align="left" width="200">'+ges1+'/'+selberges+'</th><th align="left" width="100">('+ges+'%)</th>  </tr></tbody></table>'   
              
         +' <table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Sprechen:</th><th align="left" width="200">'+sprechen+' </th><th align="left" width="100">('+spr+'%)</th>  </tr></tbody></table>' 
              
          +' <table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Bildungsstufe:</th><th align="left" width="200">'+bildungssstufe+' </th><th align="left" width="100">('+bil+'%)</th>  </tr></tbody></table>'   
              
            +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Musik:</th><th align="left" width="200">'+musik+' </th><th align="left" width="100">('+mus+'%)</th>  </tr></tbody></table>'
              
           +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Sozialkontakte:</th><th align="left" width="200">'+sozial+' </th><th align="left" width="100">('+soz+'%)</th>  </tr></tbody></table>'
              
            +' <table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Konzentration:</th><th align="left" width="200">'+konzi+' </th><th align="left" width="100">('+kon+'%)</th>  </tr></tbody></table>'
              
              +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Taschendiebsthl:</th><th align="left" width="200">'+tasche+' </span> </th> <th align="left" width="100">('+tas+'%)</th> </tr></tbody></table>'
              
   +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="center" width="200">Skill Geschafft</th><th align="left" width="200">'+all+'/609</span> </th> <th align="left" width="100">'+komplett+' % </th> </tr></tbody></table>';
            
  }});
}
  waffenatt()
function waffenatt(){
  
         GM_xmlhttpRequest({
            method: 'GET',
            url: ''+link+'/city/weapon_store/',
            onload: function(responseDetails) {
                var contenta = responseDetails.responseText;
                var attw = contenta.split('class="tiername">');
             
var waffen  = attw.length-1;         
  var attwaffe = attw[waffen].split('<')[0];
 
if(attwaffe == 'Zahnstocher'){var attt = '1';}
else if(attwaffe == 'Zerbrochene Flasche'){var attt = '2';}         
else if(attwaffe == 'Wasserbomben'){var attt = '3';}               
else if(attwaffe == 'Silvesterknaller'){var attt = '4';}               
else if(attwaffe == 'Spraydose'){var attt = '5';}              
else if(attwaffe == 'Gürtel'){var attt = '6';}  
else if(attwaffe == 'Gummiknüppel'){var attt = '7';}         
else if(attwaffe == 'Gullideckel'){var attt = '8';}               
else if(attwaffe == 'Kettenschloss'){var attt = '9';}               
else if(attwaffe == 'Schlagringe'){var attt = '10';}              
else if(attwaffe == 'Heizungsrohr'){var attt = '11';}        
else if(attwaffe == 'Hammer'){var attt = '12';}         
else if(attwaffe == 'Pfefferspray'){var attt = '13';}               
else if(attwaffe == 'Elektroschocker'){var attt = '14';}              
else if(attwaffe == 'Feuerlöscher'){var attt = '15';}              
else if(attwaffe == 'Schwert'){var attt = '16';}         
else if(attwaffe == 'Alte Knarre'){var attt = '17';}               
else if(attwaffe == 'Pistole'){var attt = '18';}               
else if(attwaffe == 'Maschinengewehr'){var attt = '19';}              
else if(attwaffe == 'Shotgun'){var attt = '20';}        
else if(attwaffe == 'Kanone'){var attt = '21';}         
else if(attwaffe == 'Kriegsmaschine'){var attt = '22';}                          
else if(attwaffe == 'Atombombe'){var attt = '23';}              
else if(attwaffe == 'Schwarzes Loch'){var attt = '24';}  
 else{var attt = '0';}
   var waa = 100/24*attt;
var waa = waa.toFixed(2)/1;
if(waa>100){
var waa = 100;
}             
      
         GM_xmlhttpRequest({
            method: 'GET',
            url: ''+link+'/city/weapon_store/def/',
            onload: function(responseDetails) {
                var content = responseDetails.responseText;
                var defw = content.split('class="tiername">');
var dwaffen  = defw.length-1;
 var dattwaffe = defw[dwaffen].split('<')[0];
 
   if(dattwaffe == 'Hand voll Sand'){var deft = '1';}
else if(dattwaffe == 'Bananenschalen verteilen'){var deft = '2';}            
              
 else if(dattwaffe == 'Hand voll Salz'){var deft = '3';}         
else if(dattwaffe == 'Wegweiser aufstellen'){var deft = '4';}               
else if(dattwaffe == 'Totstellen'){var deft = '5';}               
else if(dattwaffe == 'Juckpulver verschleudern'){var deft = '6';}              
else if(dattwaffe == 'Tarnen'){var deft = '7';}  
else if(dattwaffe == 'Mit bösen Katzen werfen'){var deft = '8';}         
else if(dattwaffe == 'Mit Spiegel blenden'){var deft = '9';}               
else if(dattwaffe == 'Mausefallen'){var deft = '10';}               
else if(dattwaffe == 'Kleister verschmieren'){var deft = '11';}              
else if(dattwaffe == 'Vergiftetes Bier herstellen'){var deft = '12';}        
else if(dattwaffe == 'Elektrozaun aufstellen'){var deft = '13';}         
else if(dattwaffe == 'Fischernetz spannen'){var deft = '14';}               
else if(dattwaffe == 'Feuer legen'){var deft = '15';}              
else if(dattwaffe == 'Stacheldraht aufstellen'){var deft = '16';}              
else if(dattwaffe == 'Selbstschussanlagen'){var deft = '17';}         
else if(dattwaffe == 'Wassergraben'){var deft = '18';}               
else if(dattwaffe == 'Fallgruben buddeln'){var deft = '19';}               
else if(dattwaffe == 'Schlingfalle mit Bier-Köder'){var deft = '20';}              
else if(dattwaffe == 'Bärenfallen verteilen'){var deft = '21';}        
else if(dattwaffe == 'Findling'){var deft = '22';}         
else if(dattwaffe == 'Zum Mond fliegen'){var deft = '23';}                          
else if(dattwaffe == 'Ins Schwarze Loch springen'){var deft = '24';}             
  else if(dattwaffe == 'UN-Schutztruppe'){var deft = '25';}  
 else{var deft = '0';}            
    var daa = 100/25*deft;
var daa = daa.toFixed(2)/1;
if(daa>100){
var daa = 100;
}  
 
       
   GM_xmlhttpRequest({
            method: 'GET',
            url: ''+link+'/activities/crime/',
            onload: function(responseDetails) {
                var content = responseDetails.responseText;
                var ver = content.split('crime_headline">');
var verbre  = ver.length-1;
  var verr = 100/11*verbre;
var verr = verr.toFixed(2)/1;
if(verr>100){
var verr = 100;
}  
 alleszusammen(attt,waa,daa,deft,verr,verbre);
           }});
       }});
  }});
}
  
 function alleszusammen(attt,waa,daa,deft,verr,verbre) {       
 
 var wohna =wohnung();
   var wohn1 = wohna;
var wohna =  100/22*wohna;   
var wohna = wohna.toFixed(2)/1;
if(wohna>100){
  var wohna = 100;
}  
 var musi =mucke(); 
    var musi1 = musi;
   var musi =  100/9*musi; 
   
var musi = musi.toFixed(2)/1;
if(musi>100){
  var musi = 100;
} 
   
 var schn = schnorry(); 
   var schn1 = schn;
   var schn =  100/8*schn;   
var schn = schn.toFixed(2)/1;
if(schn>100){
  var schn = 100;
}  
   
   
   var tie = tiere();
   var tie1 = tie;
   var tie =  100/28*tie;   
var tie = tie.toFixed(2)/1;
if(tie>100){
  var tie = 100;
}  
 var zusam2 = musi+waa+daa+verr+schn+tie+wohna;
   var zusamm1 =zusam2/7;
 zusam = zusamm1.toFixed(2)/1;
  var ja = parseInt(musi1)+parseInt(attt)+parseInt(deft)+parseInt(verbre)+parseInt(schn1)+parseInt(tie1)+parseInt(wohn1);
   
   newtr[1].innerHTML = '<div class="tieritemA" style="width: 500px;"><div class="clearcontext"><h2>Musik,eigenheim,usv</h2><br> </div>'
   
   +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Musikinstrument: </th><th align="left" width="200"> '+musi1+'/9 </th><th align="left" width="100">('+musi+' %)</th> </tr></tbody></table>'

       +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Att waffen: </th><th align="left" width="200"> '+attt+'/24 </th><th align="left" width="100">('+waa+' %)</th> </tr></tbody></table>'

         +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Def waffen: </th><th align="left" width="200"> '+deft+'/25 </th><th align="left" width="100">('+daa+' %)</th> </tr></tbody></table>'
   
            +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Verbrechen: </th><th align="left" width="200"> '+verbre+'/11 </th><th align="left" width="100">('+verr+' %)</th> </tr></tbody></table>'
   
 
      +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Schnorrpl&auml;tze: </th><th align="left" width="200"> '+schn1+'/8 </th><th align="left" width="100">('+schn+' %)</th> </tr></tbody></table>'
   
         +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200">Haustier: </th><th align="left" width="200"> '+tie1+'/28 </th><th align="left" width="100">('+tie+' %)</th> </tr></tbody></table>'
   

+'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="left" width="200"> Wohnung: </th><th align="left" width="200"> '+wohn1+'/22 </th><th align="left" width="100">('+wohna+' %)</th> </tr></tbody></table>'
 
          +'<table class="list" border="1" width="500"><tbody><tr bgcolor="#272727"><th align="center" width="200">Zusammen: </th><th align="center" width="200"> '+ja+'/128 </th><th align="center" width="100">'+zusam+' %</th> </tr></tbody></table></div></div>'
 
alles()
 
 }
  
  function alles(){
    
     var ee = zusam+komplett;//GM_getValue('komplett');
 var eee = ee/2;
              var eeee = eee.toFixed(2)/1;
   if(eeee>=100){
     var input ='<div class="tieritemA" style="width: 500px;"><div class="clearcontext"><img height="70" width="500" src="http://www.eskalierende-traeume.de/wp-content/uploads/2012/01/Geschafft.gif" alt=""><br><h2>100 % Geschafft,<br>Danke  das sie mein Script benutzt haben.Mehr Scripte von mir bei <a href="https://greasyfork.org/de/users/150605-pennerhackisback" class="btn2"><span>Pennerhackisback</span></a</h2><br> </div>';
   }else{
     
     var input = '<div class="tieritemA" style="width: 500px;"><div class="clearcontext"><h2>Komplett spiel zu '+eeee+' % Geschafft</h2><br> </div>';
   }
     newtr[2].innerHTML = ''+input+'';
    
    
    
    
  }
 }
 // copyright by basti1012  lias pennerhackisback