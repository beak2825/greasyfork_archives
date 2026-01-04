// ==UserScript==
// @name        Browser Information/Systeminfo
// @namespace    Ein Script das  dir einiges über dein system/Browser verraten tut 
  
// @author       pennerhackisback früher basti1012 oder pennerhack
// @description  wer faul ist und klicks ersparen will nimmt dieses script
// @include      *http*
// @version      14.10.2017 001
// @author		pennerhackisback
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @grant			GM_deleteValue
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @downloadURL https://update.greasyfork.org/scripts/34302/Browser%20InformationSysteminfo.user.js
// @updateURL https://update.greasyfork.org/scripts/34302/Browser%20InformationSysteminfo.meta.js
// ==/UserScript==
document.getElementsByTagName("html")[0].innerHTML  ='<div id="ww"> </div> ';

function getCookieVal(offset){
var endstr=document.cookie.indexOf(";",offset);
if(endstr==-1) endstr=document.cookie.length;
return unescape(document.cookie.substring(offset,endstr));
}

function FixCookieDate(date){
var base=new Date(0);
var skew=base.getTime();
if(skew>0) date.setTime(date.getTime()-skew);
}

function GetCookie(name){
var arg=name+"=";
var alen=arg.length;
var clen=document.cookie.length;
var i=0;
while(i<clen){
var j=i+alen;
if(document.cookie.substring(i,j)==arg)
return getCookieVal(j);
i = document.cookie.indexOf(" ",i)+1;
if(i==0) break; 
}
return null;
}

function SetCookie (name,value,expires,path,domain,secure){
document.cookie=name+"="+escape(value)+((expires) ? "; expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "")+((domain) ? "; domain="+domain : "")+((secure) ? "; secure" : "");
}

function DeleteCookie(name,path,domain){
if (GetCookie(name))
document.cookie=name+"="+((path) ? "; path="+path : "")+((domain) ? "; domain="+domain : "")+"; expires=Thu, 01-Jan-70 00:00:01 GMT";
}

function NavigatorJavaScriptCookie()
{
var expdate = new Date();
expdate.setTime (expdate.getTime() + (365 * 24 * 60 * 60 * 1000));
FixCookieDate(expdate);
SetCookie("test", "safe2delete", expdate, "/");
if (GetCookie("test") == "safe2delete")
return "Ja";
else
return "Nein";
DeleteCookie("test", "/");
}

function NavigatorStyleSheets() {if(document.styleSheets) return "Ja"; else return "Nein";} 
  
function IsGoogleToolBarActivated() {if(typeof(document.GoogleActivated)=="undefined") return "Nein"; else return "Ja";}

function GoogleToolBarVersion(){
if(typeof(document.GoogleToolbarVersion)=="undefined")
return "";
else
return document.GoogleToolbarVersion;
}
  
function EncryptionStrength(){
var encryption=navigator.appName != 'Netscape' ? 'undefined' : navigator.userAgent.indexOf(' U') != -1 ? 'Strong' : 'Weak';
return encryption;}
  
function PSMVersion() {if(navigator.appName != "Netscape") return "undefined"; else return crypto.version;}

function CheckActiveX(){
res="Ja";
try{
  a=new ActiveXObject("Shell.UIHelper");
}catch(e){
	res="Nein";
}
return res;
}

 
  document.getElementById("ww").innerHTML  += "<h2><b>Browser:</b></h2> " ;
  document.getElementById("ww").innerHTML  +="Name:       "+navigator.appName ;
  document.getElementById("ww").innerHTML  +="<br>Version:    "+navigator.appVersion ;
  document.getElementById("ww").innerHTML  +="<br>Code Name:  "+navigator.appCodeName ;
  document.getElementById("ww").innerHTML  +="<br>User Agent: "+navigator.userAgent ;
  document.getElementById("ww").innerHTML  +="<br>Sprache:    "+navigator.language ;
  document.getElementById("ww").innerHTML  +="<br>Plattform:  "+navigator.platform ;
  document.getElementById("ww").innerHTML  +="<br>CPU-Klasse: "+navigator.cpuClass ;
  document.getElementById("ww").innerHTML  +="<br>Online:     "+navigator.onLine ;
  document.getElementById("ww").innerHTML  +="<br>Vendor:     "+navigator.vendor;
  document.getElementById("ww").innerHTML  +="<br>Product:    "+navigator.product;


  document.getElementById("ww").innerHTML  +=" <br><br><h2>Sprache:</h2> " ;
 document.getElementById("ww").innerHTML  +="Browser:  "+navigator.browserLanguage ;
 document.getElementById("ww").innerHTML  +="<br>System:   "+navigator.systemLanguage ;
 document.getElementById("ww").innerHTML  +="<br>Benutzer: "+navigator.userLanguage ;
 document.getElementById("ww").innerHTML  +="<br> <br><h2><b>Leistungsmerkmale:</b></h2> " ;
 document.getElementById("ww").innerHTML  +="StyleSheets aktiv:     "+NavigatorStyleSheets() ;
 document.getElementById("ww").innerHTML  +="<br>ActiveX-Objekte aktiv: "+CheckActiveX() ;
 document.getElementById("ww").innerHTML  +="<br>Java aktiv:            " ;
if(navigator.javaEnabled()){
  document.getElementById("ww").innerHTML  +="Ja ";
}else{
document.getElementById("ww").innerHTML  +="Nein";
}
 document.getElementById("ww").innerHTML  +="<br>Cookies aktiv:         " ;
if(navigator.cookieEnabled){
 document.getElementById("ww").innerHTML  +="Ja ";
}else{
 document.getElementById("ww").innerHTML  +="Nein ";
}

 document.getElementById("ww").innerHTML  +="<br>JavaScriptCookies:     "+NavigatorJavaScriptCookie() ;
 document.getElementById("ww").innerHTML  +=" <br> <br><h2>Sonstiges:</h2> " ;
 document.getElementById("ww").innerHTML  +="Google ToolBar aktiv:   "+IsGoogleToolBarActivated() ;
 document.getElementById("ww").innerHTML  +="<br>Google ToolBar Version: "+GoogleToolBarVersion() ;
 document.getElementById("ww").innerHTML  +="<br> " ;
 document.getElementById("ww").innerHTML  +="<br><h2><b>Sicherheit:</b></h2>  " ;
 document.getElementById("ww").innerHTML  +="Verschlüsselung: "+EncryptionStrength() ;
 document.getElementById("ww").innerHTML  +=" <br><br><h2><b>Nur Gecko:</b></h2> " ;
 document.getElementById("ww").innerHTML  +="Product:         "+navigator.product ;
 document.getElementById("ww").innerHTML  +="<br>Product Version: "+navigator.productSub ;
 document.getElementById("ww").innerHTML  +="<br>Vendor:          "+navigator.vendor ;
 document.getElementById("ww").innerHTML  +="<br>Vendor Version:  "+navigator.vendorSub ;
 document.getElementById("ww").innerHTML  +=" <br>";

 
 

 
	

 
 
 document.getElementById("ww").innerHTML  +="<h2><b>Informationen für mobile Geräte</b></h2>" ;
// Batteriestatus
var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
if (battery) {
 document.getElementById("ww").innerHTML  +="Batterie-Status: ' + (battery.level * 100) + '% (wird' + (battery.charging ? ' ' : ' nicht ') + 'geladen) </pre></blockquote>" ;
}else{
document.getElementById("ww").innerHTML  +="Kein mobiles Ger&auml;t";
    
}

 
 document.getElementById("ww").innerHTML  +="<h2><b>Positionsbestimmung</b></h2>" ;
 document.getElementById("ww").innerHTML  +=' Latitude   Longitude: <span id="geoloc"> Warte auf Positionsdaten  </span> ';
var geolocoutput = document.getElementById('geoloc');
var position = {};
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(geolocShow, geolocError);
} else {
	geolocoutput.innerHTML = 'Positionsbestimmung wird nicht unterstützt.';
}

function geolocShow(pos)
{
	position = pos;
	geolocoutput.innerHTML = position.coords.latitude + ' / ' + position.coords.longitude + '<br />' + 
		'<img src="http://maps.googleapis.com/maps/api/staticmap?center=' + position.coords.latitude + ',' + position.coords.longitude + '&zoom=13&size=300x300&sensor=false"></img>';
}

function geolocError(error)
{
	switch(error.code) {
	case error.PERMISSION_DENIED:
		geolocoutput.innerHTML = 'Positionsbestimmung wurde vom Benutzer verweigert.'
		break;
	case error.POSITION_UNAVAILABLE:
		geolocoutput.innerHTML = 'Positionsdaten sind nicht verfügbar.'
		break;
	case error.TIMEOUT:
		geolocoutput.innerHTML = 'Zeitüberlauf bei der Positionsbestimmung.'
		break;
	case error.UNKNOWN_ERROR:
		geolocoutput.innerHTML = 'Fehler bei der Positionsbestimmung.'
		break;
	}
};










 
 document.getElementById("ww").innerHTML  +="<br><h2>Bildschirm:</h2>" ;
 document.getElementById("ww").innerHTML  +="Größe:     "+screen.width+" x "+screen.height+" Pixel" ;
 document.getElementById("ww").innerHTML  +="<br>Verfügbar: "+screen.availWidth+" x "+screen.availHeight+" Pixel" ;
 document.getElementById("ww").innerHTML  +="<br>Farben:    "+screen.colorDepth + " Bit (" + Math.pow(2, screen.colorDepth) + " Farben)" ;
 
 
function GetDateTime(){
var today=new Date();
return (today) ? today : "undefined"
}

function GetGMT(){
var today=new Date();
return (today) ? today.toGMTString() : "undefined"
}

function GetTimeLocaleString(){
var today=new Date();
return (today) ? today.toLocaleString() : "undefined"
}

function GetTimeZoneOffset(){
var today=new Date();
return (today) ? today.getTimezoneOffset() : "undefined"
}

function GetTimerValue(){
var today=new Date();
return (Date.parse(today)) ? Date.parse(today) : "undefined"
}
  
 
 document.getElementById("ww").innerHTML  +="<br><h2>Datum und Zeit:</h2>" ;
 
 document.getElementById("ww").innerHTML  +="Datum und Zeit:     " + GetDateTime() ;
 document.getElementById("ww").innerHTML  +="<br>UTC (GMT):          " + GetGMT() ;
 document.getElementById("ww").innerHTML  +="<br>Lokale Einstellung: " + GetTimeLocaleString() ;
 document.getElementById("ww").innerHTML  +="<br>Zeitzonen-Offset:   " + GetTimeZoneOffset() + " Minuten" ;
 document.getElementById("ww").innerHTML  +="<br>Wert des Timers:    " + GetTimerValue() + " Millisekunden" ;
 document.getElementById("ww").innerHTML  +="<br>                   (seit dem 1. Jänner 1970, 00:00:00)" ;
 
 
 

 var myPlugin = navigator.plugins["Shockwave"];
if (myPlugin)
 document.getElementById("ww").innerHTML +="You have Shockwave installed!" 
else
 document.getElementById("ww").innerHTML +="You don't have Shockwave installed!" 
 
 

 
var myPlugin = navigator.plugins["Quicktime"];
if (myPlugin)
 document.getElementById("ww").innerHTML +="You have Quicktime installed!" 
else
 document.getElementById("ww").innerHTML +="You don't have Quicktime installed!" 


ShowPlugInDetails()


 
function ShowPlugInDetails(){
  var numPlugins = navigator.plugins.length;
  for (i = 0; i < numPlugins; i++) {
    var plugin = navigator.plugins[i];
 document.getElementById("ww").innerHTML  +="<br><h2> Plugin :</h2>" ;
 document.getElementById("ww").innerHTML  +="<br>Plugin-Name: " + plugin.name ;
 document.getElementById("ww").innerHTML  +="<br>Beschreibung:" + plugin.description ;
     document.getElementById("ww").innerHTML  +="<br>Dateiname: " + plugin.filename ;
      
      try{
    var numTypes = plugin.length;
    for (j = 0; j < numTypes; j++) {
      var mimetype = plugin[j];
      if (mimetype) {
        var enabled = (typeof(navigator.appName) != "undefined") ? "Ja" : "Nein";
	   
 document.getElementById("ww").innerHTML  +="<br>   Mime-Typ:       "  + mimetype.type ;
  document.getElementById("ww").innerHTML  +="<br>     Beschreibung:"   + mimetype.description ;
 document.getElementById("ww").innerHTML  +="<br>  Suffixe:     "   + mimetype.suffixes ;
  document.getElementById("ww").innerHTML  +="<br> Aktiv:       "  + enabled ;
      }
    }
      }catch(e){}
  }
}


 document.getElementById("ww").innerHTML  +="<br><h2>Mime-Typen:</h2>" ;
ShowMimeTypes()
function ShowMimeTypes(){
  if (navigator.mimeTypes) {
	var numMimeTypes = navigator.mimeTypes.length;
	for (var i = 0; i < numMimeTypes; i++) {
	  var mimetype = navigator.mimeTypes[i];
  document.getElementById("ww").innerHTML  +='   Beschreibung: ' + mimetype.description ;
  document.getElementById("ww").innerHTML  +=' <br>    Mime-Typ:   ' + mimetype.type ;
	  if (mimetype.suffixes)
  document.getElementById("ww").innerHTML  +='  <br>   Suffixe:    ' + mimetype.suffixes ;
	  else
  document.getElementById("ww").innerHTML  +='  <br>   Suffixe:    -' ;
	}
  }
}








 document.getElementById("ww").innerHTML  +="<br><h2>Andere Infos</h2>" ;
	GM_xmlhttpRequest({
		'method': 'GET',
		'url': 'http://checkip.dyndns.org/',
		     onload: function(responseDetails) {
		           var content = responseDetails.responseText;
				
		 
		var ip =content.split('body')[1].split('body')[0];
  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Ip adresse :</td><td valign=top'+ip+'/td></table>';














 xx = new Date() 
if (navigator.cookieEnabled == true) {
var cook ="Cookies erlaubt";
} else if (navigator.cookieEnabled == false) {
//alert("Cookies verboten");
} else {
var cook ="Erlaubnis nicht ermittelbar";
}

var a = !1,
    b = "";

function c(d) {
    d = d.match(/[\d]+/g);
    d.length = 3;
    return d.join(".")
}
if (navigator.plugins && navigator.plugins.length) {
    var e = navigator.plugins["Shockwave Flash"];
    e && (a = !0, e.description && (b = c(e.description)));
    navigator.plugins["Shockwave Flash 2.0"] && (a = !0, b = "2.0.0.11")
    var vtext = 'flash version:'+b+'';
} else {
    if (navigator.mimeTypes && navigator.mimeTypes.length) {
        var f = navigator.mimeTypes["application/x-shockwave-flash"];
        (a = f && f.enabledPlugin) && (b = c(f.enabledPlugin.description))
    } else {
        try {
            var g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"),
                a = !0,
                b = c(g.GetVariable("$version"))
        } catch (h) {
            try {
                g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), a = !0, b = "6.0.21"
            } catch (i) {
                try {
                    g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), a = !0, b = c(g.GetVariable("$version"))
                } catch (j) {}
            }
        }
    }
var vtext = 'flash nicht gefunden';
}
 

 
 if(navigator. javaEnabled == true) {
   var javava = 'Java ist aktiviert'
 }else{
   var javava = 'Java deaktiviert oder nicht vorhanden'
 }


   var x2 = new Date(); 
 function isMESZ(d){
 var df = typeof(d)=="object" ? d : d=="" ? new Date() : new Date(d);
return (df.getTimezoneOffset()-(new Date("2000/1/1")).getTimezoneOffset() != 0);
}

 
 var s_time = isMESZ(x2) ? "Sommerzeit" : "Winterzeit";
   
var somm = x2.getTimezoneOffset()/60;

 
function DateForm (DateObject) {
  var tVal = DateObject.getDate();
  var s = ((tVal < 10) ? "0" : "") + tVal;
  tVal = DateObject.getMonth() +1;
  s += ((tVal < 10) ? ".0" : ".") + tVal;
  s += "." + DateObject.getFullYear();
  tVal = DateObject.getHours();
  s += ((tVal < 10) ? " 0" : " ") + tVal;
  tVal = DateObject.getMinutes();
  s += ((tVal < 10) ? ":0" : ":") + tVal;
  tVal = DateObject.getSeconds();
  s += ((tVal < 10) ? ":0" : ":") + tVal;
  return s;
}
  
var x = new Date();

  
var pc = (DateForm(x));

  var h;
  var x = new Date();
  var kbimg = 25;
  var t1;
  var tres;
  var tdiff = 0;
  var tact;
  var tgzyk = 5;
  var tzyk = 50; //Anzahl Messzyklen Timerauflösung
  function tresulution() {
    if(trcount == 1) t1=new Date();
    if(trcount <= tzyk) ++trcount;
    else {
    var t2=new Date();
    window.clearInterval(tact);
    var trdiff = (t2.getTime() - t1.getTime())/tzyk ;
    var tf = Math.abs(trdiff - tdiff);
    if(tf > 1 && --tgzyk > 0 ) window.setTimeout("evtimer1()",300);
    var stex = trdiff.toFixed(0) + " ms";
      alert(stex)
    if(tdiff > 0 && tf >= 1) stex += "(+- " + tf.toFixed(0) + ")";
    tdiff = trdiff;
    tres.innerHTML = stex; }
 
  }
  function evtimer1(){
  trcount = 0;
 
      tact =  window.setTimeout(function () { tresulution() }, 2);
  }

 
  function cal() {
    var y = new Date();
    var diff = y.getTime() - x.getTime() ;
    if (diff < 200){// window.location="http://static2.pennergame.de/pennergame_media/de_DE/avatare/standard.jpg";
 
    
var dfu = ((kbimg + 6) * 8000)/diff;
 var cache = (dfu > 16000) ? " (Cache?)" : " (" + (kbimg + 6) + " kByte in " + diff + "ms)";
 var tdfu = dfu.toFixed(4) ;
       document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Datenvolumen</td><td valign=top> '+tdfu+' Kbits/sek  - cache : '+cache+'  </td></table>';
 
    }
    

    var mf = "";
    if (document.all) {
    h = document.documentElement.clientHeight;
    mf = document.body.offsetWidth + " X " + h + " Pixel"; }
    else { mf = window.innerWidth + " X " + window.innerHeight + " Pixel" }
   var  pi = Math.round(window.innerWidth*window.innerHeight)
    // fenster
var fenster = mf;
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Fenster gr&ouml:sse</td><td valign=top>  Y '+fenster+' Pixel = '+pi+'</td></table>';

 
    
       window.setTimeout(function () { evtimer1() }, 500);
     
}


cal()
calx(xx)
function calx(xx) {
    y = new Date() 
    diff = y.getTime() - xx.getTime()
 var zeita = diff/1000;

   document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Ladezeit diese Seite</td><td valign=top> '+zeita+'  Sekunden </td></table>';
    
}




try{
var e = document.getElementsByTagName('img');
var str = [];
for(var i=0; i<e.length; i++){
  //str.push(e.src);
var tags = str.push(e.src);
}
}catch(i){
var tags = '---';
  
}
           
           
           
try{
var e = document.getElementsByTagName('a');
var str = [];
for(var i=0; i<e.length; i++){
  //str.push(e.src);
var tagsa = str.push(e.src);
}
}catch(i){
var tagsa = '---';
  
}


 
  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Seiten in history</td><td valign=top> '+history.length+'  Seiten </td></table>';
           
           
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Cookies</td><td valign=top>'+cook+'</td></table>';
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Flashplayer</td><td valign=top>'+vtext+'</td></table>';
var sa = screen.width*screen.height; 
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Monitor</td><td valign=top>Y   = '+screen.width+' X   = '+screen.height+' Pixel : '+sa+'</td></table>';
  
  
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Java</td><td valign=top> '+javava+'</td></table>';
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Pc Time</td><td valign=top> '+pc+' '+s_time+' '+somm+' Stunden</td></table>';



  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Installierte Plugins</td><td valign=top> '+navigator.plugins.length+'  St&uuml;ck</td></table>';

  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>HTML-Tags</td><td valign=top>Diese Datei hat ' + document.all.length + ' HTML-Tags</td></table>';  

          document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Davon Bilder</td><td valign=top>'+tags + ' HTML-Bilder</td></table>'; 
          document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Davon Links</td><td valign=top>'+tagsa + ' HTML-Links</td></table>'; 
           
         }});


 
 