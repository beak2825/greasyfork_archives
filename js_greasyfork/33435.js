// ==UserScript==
// @name         topmenü mit vielen exra funktionen pennergame
// @namespace    erstellt ein topmenü mit vieen funktionen die pennergame so nicht bietet
// @author       pennerhackisback früher basti1012 oder pennerhack
// @description  wer faul ist und klicks ersparen will nimmt dieses script
// @include      *pennergame.de*
// @version      25.05.2018 04
// @author			basti1012
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_openInTab
// @grant			GM_log
// @icon          http://www.lildevil.org/greasemonkey/images/IC-icon.png
// @downloadURL https://update.greasyfork.org/scripts/33435/topmen%C3%BC%20mit%20vielen%20exra%20funktionen%20pennergame.user.js
// @updateURL https://update.greasyfork.org/scripts/33435/topmen%C3%BC%20mit%20vielen%20exra%20funktionen%20pennergame.meta.js
// ==/UserScript==



	 



var jetzt = new Date();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('body')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('body {font-family:arial; font-size:15px color:white;  }div {cursor:default;}a {text-decoration:none; color:blue; }');
addGlobalStyle('#menu li a{color:white;}');
addGlobalStyle('#menu ul {margin:0px; padding:0px; list-style-type:none;}');
addGlobalStyle('#menu li {float:left; padding-top:11px; height:35px;width:150px; border-radius:2px; border:2px solid black; text-align:center;background-color:#2D2D2D;}');
addGlobalStyle('#menu li ul{display:none; padding-top:0px;margin-top:16px; }');
addGlobalStyle('#menu li:hover ul {display:block;}');
addGlobalStyle('#menu li ul li {background-color:#2D2D2D; border-bottom:1px solid #FFFFFF;}');
addGlobalStyle('#menu li ul li a{color:white;}');
addGlobalStyle('#menu li ul li:hover {background-color:#5F5245;}');
addGlobalStyle('#TopMenueDiv { position: absolute;  top: 0px;  left: 80px;  z-index:100;  padding: 0.1em;');

 
ladeanzelement = document.createElement("li");
ladeanzelement.setAttribute("style", "position:absolute;top:130px;left:2px;z-index:20;display:none;background-color:black;font-size:8pt;padding:8px;-moz-border-radius:12px;");
ladeanzelement.setAttribute("align", "left");
ladeanzelement.setAttribute("id", "ladeanzeiger");
ladeanzelement.innerHTML = '<input id="lose2" class="formbutton" type="button" name="lose2" value="X" ><p><font style="color:blue ;font-size:80%;\"> <span id="lader" </span></p>';
document.getElementsByTagName("body")[0].appendChild(ladeanzelement);


document.getElementsByName('lose2')[0].addEventListener('click', function start() {
  ladeanzeiger.style.display="none";
}, false);
  var jetzt = new Date();
  var Stunde = jetzt.getHours();
  var Std = ((Stunde < 10) ? "0" + Stunde : Stunde);
  var Minuten = jetzt.getMinutes();
  var Min = ((Minuten < 10) ? "0" + Minuten : Minuten);
  var Sek = jetzt.getSeconds();
  var SekA = ((Sek < 10) ? "0" + Sek : Sek);
  var time = ''+Std+':'+Min+':'+SekA+'';

 
  var TopMenueDiv = document.createElement('div');
  document.body.appendChild(TopMenueDiv);
  TopMenueDiv.innerHTML ='<div id=\"TopMenueDiv\"> '
  +'<div><ul id="menu">'    
+'<li><a href="/pet/" id="Eingabe" title="Aktuelle zeit wie lange dein Tier noch an weiterbilden ist "> Haustier</a><ul>'
+'<li><a href="#"  title="Angebot 3"><div id="testweiter"</div></a></li>'
+'<li><a href="/skills/pet/" title="Tier weiterbildungen">Weiterbildung</a></li>'
+'<li><a href="/fight/pet/"  title="aktuelle zeit wie lange dein tier noch am fighten ist "> <div id="tier"</div></a></li>'
+'<li><div id="tierfightanaus"</div></li>'
+'<li><div id="streunenanzeigen"</div></li>'
+'<li><div id="streunenanzeigen1"</div></li>'
+'<li><div id="sammeln11"</div></li></ul></li>'
 
+'<li> <a href="#" id="Eingabe2"  title="Infos zu Plunder inventar und co">Extras</a><ul>'
+'<li><a href="/stock/" title="Angebot 1">Inventar</a></li>'
+'<li><a href="/stock/bottle" title="Flaschen inventar">Flaschen inventar</a></li>'
+'<li><a href="/pet/" name="losekaufen" title="Angebot 2">Lose kaufen</a></li>'
+'<li><div id="uhranaus"</div></li>'
+'<li><div id="contianzeige"</div></li>'
+'<li><div id="klickeran"</div></li>'
+'<li><a href="/livegame/" name="losekaufen" title="Angebot 2">Live Games</a></li>'
+'<li><a href="?informationen" name="losekaufen" title="Angebot 2">Dein System</a></li>'
+'<li><a href="?einstellungscript" title="Angebot 5">Einstellung Script</a></li></ul></li>'

+'<li><a href="/overview/"  id="Eingabe1" title="Deine penner informationen">Dein Penner</a><ul>'
+'<li><div id="geldin"</div></li> '///   geld vom musik
+ '<li><a href="/profil/id:'+GM_getValue("idpenner")+'/" title="gehe auf dein Profil ung ggf ändere deine eingaben">Dein Profil</a></li>'
+'<li><a href="/fight/overview/" title="Paket 3">Fight übersicht</a></li>'
+'<li><div id="plunderaa"</div></li>'
+ '<li><a href="/gang/" title="Paket 2">Bande</a></li>'
+'<li><a href="/gang/forum//" title="Paket 3">Bande Forum</a></li>'
+'<li><a href="/league/" title="Paket 4">Bandenliga</a></li>'
+'<li><a href="/gang/credit/" title="Paket 4">Bandenfinanzen</a></li></ul></li>'

+'<li><a href="/activities/" title="">Aktionen</a><ul>'
+'<li><div id="tag"</div> </li>'// tagesaufgaben
+ '<li><b id="sammler"</b></li>'
+ '<li><a href="/fight/" title="">Kämpfen</a></li>'
+ '<li><a href="/activities/crime/" title="">Verbrechen</a></li>'
+ '<li><b id="loseanzeigen"</b></li>'
+'<li><a href="/skills/" title="">Weiterbilden</a></li></ul></li>'

+'<li><a href="/highscore/" title="">Highscore</a><ul>'
+'<li><a href="/highscore/attackable/" title="">Angreifbar</a></li> '
+'<li><a href="/highscore/joindate/">Meine Highscore</a></li>   ' 
+'<li><a href="/highscore/user/">User Highscore</a></li>   ' 
+'<li><a href="/highscore/rank/">Rang Highscore</a></li>   ' 
+'<li><a href="/highscore/event/">Event Highscore</a></li>   ' 
+'<li><a href="/highscore/gang/">Banden Highscore</a></li>   ' 
+'<li><a href="/league/">Bandenliga</a></li>   ' 
+'<li><a href="/highscore/gangrank/">Bandenrangpunkte</a></li>   ' 
+'<li><a href="/highscore/missionpoints/">Missionspunkte</a></li>   ' 
+'<li><a href="/highscore/tpp/">Teamplayerpunkte</a></li></ul></li>'

+'<li><a href="/city/" title="">Stadt</a><ul>'
+'<li><a href="/city/"> Meine Stadt </a></li>'
+'<li><a href="/city/map/"> Stadtkarte </a></li>'
+'<li><a href="/city/district/"> Stadtteilliste</a></li>'
+'<li><a href="/city/stuff/"> Zubehör</a></li>'
+'<li><a href="/city/supermarket/"> Supermarkt</a></li>  '
+'<li><a href="/city/pet_store/"> Begleiterheim</a></li>   ' 
+'<li><a href="/kronkorkenfabrik/"> Kronkorkenfabriken</a></li>'
+'<li><a href="/city/weapon_store/">Waffenladen</a></li>'
+'<li><a href="/city/medicine/">Apotheke</a></li>'
+'<li><a href="/city/washhouse/">Waschhaus</li>'
+'<li><a href="/city/scrounge/">Schnorrplätze</a></li>'
+'<li><a href="/city/music_store/">Musikladen</a></li>'
+'<li><a href="/city/home/">Eigenheime</a></li>'
+'<li><a href="/city/games/">Glücksspiele</a></li>'
+'<li><a href="/city/plundershop/">Plundershop</a></li></ul></ul></li></div>';
 
var elem2 = document.getElementById('Eingabe2');
var elem1 = document.getElementById('Eingabe1');
var elem = document.getElementById('Eingabe');

var timeout1 = null;
elem1.onmouseover = function() {
    function tese1() {
         penner()
    }
    timeout1 = setTimeout(tese1, 2000);
};
elem1.onmouseout = function() {
    clearTimeout(timeout1);
}

var timeout = null;
    elem.onmouseover = function() {
       function tese() {
           tierdaten()
       }
       timeout = setTimeout(tese, 2000);
    };
elem.onmouseout = function() {
    clearTimeout(timeout);
}


var timeout2 = null;
elem2.onmouseover = function() {
    function tese2() {
        stock()
    }
    timeout2 = setTimeout(tese2, 2000);
};
elem2.onmouseout = function() {
     clearTimeout(timeout2);
}

function aus() {
   function ausaus(){
       ladeanzeiger.style.display="none";
   }
   window.setTimeout(function () { ausaus() }, 3000);
}

 
if (document.location.href.indexOf('einstellungscript')>=0) {
 document.getElementById('content').innerHTML = ' '
  +'<font style="color:yellow ;font-size:180%;\">Einstellung Haustierkampf</font><br>'
  +'<input type="checkbox" name="fightan"><input type="text" name="einsatz" size="10" value="100"> &euro;<select name="minuten"><option value="20" selected>20 Minuten</option><option value="30" >30 Minuten</option><option value="40" >40 Minuten</option><option value="60" >60 Minuten</option></select>Verhalten:<select name="verhalten"><option value="1" >Aggressiv</option><option value="2" >Defensiv</option><option value="3" selected>Neutral</option></select><td id="risiko"><select name="risiko" "><option value="20"selected>20%</option><option value="19" >19%</option><option value="18" >18%</option><option value="17" >17%</option><option value="16" >16%</option><option value="15" >15%</optIon><option value="14" >14%</option><option value="13" >13%</option><option value="12" >12%</option><option value="11" >11%</option><option value="10" >10%</option><option value="9" >09%</option><option value="8" >08%</option><option value="7" >07%</option><option value="6" >06%</option><option value="5" >05%</option><option value="4" >04%</option><option value="3" >03%</option><option value="2" >02%</option><option value="1" >01%</option></select>Autofight:<input type="checkbox" name="fightanauto"><a class="tooltip" href="#">[?]<span><b>Anleitung</b><br />Hier könnt hr einstellen wie euer tier suchen soll wenn ihr im topmenue auf tier kampf klicken tut die checkbox aktiviert odr deaktiviert den klick auf fighten ,dann müsst ihr den kampf manuell auf der fight seite starten<br>Autofight heist das das script immer wieder automatisch fighten geht </span></a><br><br>'
  
+'<font style="color:yellow ;font-size:180%;\">Einstellung Streunen</font><br>'
+'<input type="checkbox" name="streunenan">Richtung<select name="richtung"><option value="1,Flink,2" >Nord</option><option value="2,Flink,2" >West</option><option value="3,Robust,1" >Ost</option> <option value="4,Wild,3" >SÃ¼d</option> </select>Route:<select name="zeit"> <option value="10">Route A (10 min)</option><option value="30">Route B (30 min)</option><option value="60">Route C (60 min)</option><option value="90">Route D (90 min)</option><option value="120">Route E (120 min)</option><option value="180">Route F (180 min)</option> </select> Tier:<select name="tier"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select><a class="tooltip" href="#">[?]<span><b>Anleitung</b>Aktiviert oder deaktiviert das streunen über topmenü,einstellenungen in welcher richtung ,welche zeit und welches tier streunen soll beim klick af streunen in top menue</span></a><br><br>'
  
 +'<font style="color:yellow ;font-size:140%;\">Kronkorken</font><br>'
 +'Kronkorken ausblenden? <input type="checkbox" name="korkenan"><a class="tooltip" href="#">[?]<span><b>Kronkorken rechts aufder Ecke und  oben neben den highscore platz werden ausgeblendet </span></a><br><br>'
 
 +'<font style="color:yellow ;font-size:140%;\">Einstellung Uhr( Farbe ist auch für behälter nd klicker )</font><br>'
 +'<input type="checkbox" name="uhran"><input type="text" name="farbe" id="menge" size="10" value="" /><a class="tooltip" href="#">[?]<span><b>bitte farbcode aus farbpallette raussuchen</span></a><br><br>'
  
 +'<font style="color:yellow ;font-size:140%;\">Einstellung Container</font><br>'
 +'wahrnung einstellen <input type="checkbox" name="contian"><a class="tooltip" href="#">[?]<span><b>Anleitung</b><br />Hier könnt hr einstellen ob das Script dich wahrnwn soll sobald dein behälter zu 90 prozent voll ist </span></a><br><br>'
 
 +'<font style="color:yellow ;font-size:140%;\">Einstellung Sammeln</font><br> <input type="checkbox" name="sammelnan">   Zeit: <select name="zeitsammeln"><option value="10" selected>10 Minuten</option><option value="30">30 Minuten</option> <option value="60">1 Stunde</option><option value="180">3 Stunden</option><option value="360">6 Stunden</option><option value="540">9 Stunden</option> <option value="720">12 Stunden</option> </select><br><br>'
    
 +'<font style="color:yellow ;font-size:140%;\">Einstellung Lose</font><br>'
 +'<input type="checkbox" name="losean">Menge: <input type="text" name="menge" id="menge" size="3" value="1" /><a class="tooltip" href="#">[?]<span><b>Menge der lose die gekauft werden soll die beim klick auf lose kaufen ngekauft werden soll</span></a><br><br>'

 +'<font style="color:yellow ;font-size:140%;\">Klick Zähler</font><a class="tooltip" href="#">[?]<span>Zählt alle deine klicks die du auf Pennergame.de gemacht hast ( Seid der instalation dieses Scriptes)</span></a><br><input type="checkbox" name="klickan">Klickzähler<br><br>'
 
  
     +' <font style="color:yellow ;font-size:140%;\">Sammelmarken</font>'
 +'<br><input type="checkbox" name="sammelnan1">Sammelmarken an ? <a class="tooltip" href="#">[?]<span><b>Mit ein klick in menü wird der höchst mögliche wechselkurs gewechselt..ist das deaktiviert wird sammelmarken inmenü nur verlinkt ansonsten wird mit ein klick die sammelmarken gewechselt</span></a><br><br>'
  
  
 +' <font style="color:yellow ;font-size:140%;\">Tagesaufgabe</font>'
 +'<br><input type="checkbox" name="tagan">Tagesaufgabe an ? <a class="tooltip" href="#">[?]<span><b>warnt dich wenn du die Tagesaufgabe noch nicht erledigt hast </span></a><br><br>'
 

  
  
 +'<br><br><input name="speichern" id="speichern" class="formbutton" type="button"  value="Speichern" ><input id="palette" class="formbutton" type="button" name="palette" value="Farbpalette anzeigen" ><input id="zu" class="formbutton" type="button" name="zu" value="Schliessen ohne Speichern" ><br><b id="pale"</b>'

 document.getElementsByName("sammelnan1")[0].checked = GM_getValue("sammelnan1");
 document.getElementsByName("klickan")[0].checked = GM_getValue("klickan");
 document.getElementsByName("fightan")[0].checked = GM_getValue("fightan");
 document.getElementsByName("losean")[0].checked = GM_getValue("losean");
 document.getElementsByName("uhran")[0].checked = GM_getValue("uhran");
 document.getElementsByName("sammelnan")[0].checked = GM_getValue("sammelnan");
 document.getElementsByName("streunenan")[0].checked = GM_getValue("streunenan");
 document.getElementsByName("tagan")[0].checked = GM_getValue("tagan");
 document.getElementsByName("contian")[0].checked = GM_getValue("contian");
 document.getElementsByName("korkenan")[0].checked = GM_getValue("korkenan");
 document.getElementsByName("fightan")[0].checked = GM_getValue("fightan");
 document.getElementsByName("fightanauto")[0].checked = GM_getValue("fightanauto");
 document.getElementsByName("menge")[0].value = GM_getValue("menge");
 document.getElementsByName("farbe")[0].value = GM_getValue("farbe");
 document.getElementsByName("risiko")[0].value = GM_getValue("risiko");
 document.getElementsByName("verhalten")[0].value = GM_getValue("verhalten");
 document.getElementsByName("einsatz")[0].value = GM_getValue("einsatz");
 document.getElementsByName("minuten")[0].value = GM_getValue("minuten");  
 document.getElementsByName("richtung")[0].value = GM_getValue("richtung");
 document.getElementsByName("zeit")[0].value = GM_getValue("zeit");
 document.getElementsByName("tier")[0].value = GM_getValue("tier"); 
 document.getElementsByName("zeitsammeln")[0].value = GM_getValue("zeitsammeln");
  
  
document.getElementsByName('speichern')[0].addEventListener('click', function start() {
 try{
     GM_setValue("menge", document.getElementsByName("menge")[0].value);
     GM_setValue("farbe", document.getElementsByName("farbe")[0].value);
     GM_setValue("risiko", document.getElementsByName("risiko")[0].value); 
     GM_setValue("verhalten", document.getElementsByName("verhalten")[0].value);
     GM_setValue("einsatz", document.getElementsByName("einsatz")[0].value);
     GM_setValue("minuten", document.getElementsByName("minuten")[0].value); 
     GM_setValue("richtung", document.getElementsByName("richtung")[0].value);  
     GM_setValue("zeit", document.getElementsByName("zeit")[0].value);
     GM_setValue("tier", document.getElementsByName("tier")[0].value);
     GM_setValue("zeitsammeln", document.getElementsByName("zeitsammeln")[0].value); 
     GM_setValue("fightanauto", document.getElementsByName("fightanauto")[0].checked); 
     GM_setValue("fightan", document.getElementsByName("fightan")[0].checked);
     GM_setValue("korkenan", document.getElementsByName("korkenan")[0].checked); 
     GM_setValue("contian", document.getElementsByName("contian")[0].checked); 
     GM_setValue("streunenan", document.getElementsByName("streunenan")[0].checked); 
     GM_setValue("sammelnan", document.getElementsByName("sammelnan")[0].checked);
     GM_setValue("klickan", document.getElementsByName("klickan")[0].checked); 
     GM_setValue("uhran", document.getElementsByName("uhran")[0].checked); 
     GM_setValue("losean", document.getElementsByName("losean")[0].checked); 
     GM_setValue("tagan", document.getElementsByName("tagan")[0].checked); 
     GM_setValue("sammelnan1", document.getElementsByName("sammelnan1")[0].checked); 
   
     ladeanzeiger.style.display="block";aus()
     document.getElementById("lader").innerHTML = '<font style="color:green ;font-size:170%;\">Alle Daten gespeichert</font>';  }catch(e){
     ladeanzeiger.style.display="block";aus()
     document.getElementById("lader").innerHTML = '<font style="color:red ;font-size:170%;\">Speichern schief gelaufen,,bitte koregiere deine eingaben oder ersuche es später noch einmal</font>';  
 }
 location.reload()
}, false);


document.getElementsByName('zu')[0].addEventListener('click', function start() {
    history.back() 
 }, false);
  
document.getElementsByName('palette')[0].addEventListener('click', function start() {
    document.getElementById("pale").innerHTML  ='<div id="text_farben_div"</div>';
    function y(){
        var x ="";
        for (var i = 10 ; i<100; i += 10)
        for (var o = 10 ; o<100; o += 10) 
        for (var c = 10 ; c<100; c += 10)             
        x += '<span style="background-color:#'+ c + o + i +';font-size:20px;color:white">Farbcode für die Uhr,Behälter,Klicker: #' + c + o + i +'</span><br />';  
        document.getElementById('text_farben_div').innerHTML = x;
     }
     window.setTimeout(function () { y() }, 100);
}, false);
  
}

 
 


//________________________________________________________-       klick zähler  _________________________________________

if(GM_getValue("klickan") == true){	
    document.getElementById('klickeran').innerHTML = '<b><font style="color:'+GM_getValue("farbe")+' ;font-size:120%;\">'+GM_getValue("klickmenge")+' Klicks</font>';
       if(localStorage.getItem('pennergameklicks')==null){
     localStorage.setItem('pennergameklicks',0);
       }
 mengeklicks=localStorage.getItem('pennergameklicks');
  mengeklicks++;
      localStorage.setItem('pennergameklicks',mengeklicks);
  document.getElementById('klickeran').innerHTML = ' <b><font style="color:'+GM_getValue("farbe")+' ;font-size:120%;\">'+mengeklicks+' Klicks</font>';
}else{
     document.getElementById('klickeran').innerHTML = '<a href="/speedworld">Speedworld</a>';
}



 //------------------------------------- --------------     Informationen uber dein system ---------------------------------


if (document.location.href.indexOf('?informationen')>=0) {
 
  document.getElementById('content').innerHTML = '<h3>Informationen von dein System und co </h3><br><div id="ww"</div><br>';
function ladezeit() {
    var endzeit = new Date();
    var diff = endzeit.getTime() - jetzt.getTime();
  
 document.getElementById('ww').innerHTML += "Es hat " + diff/1000 + " Sekunden gedauert, diese Seite zu laden !<b>";
}






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
 

 function BrowserName() {
    var bname = "";
    var n,v,t,ua = navigator.userAgent;
    var names={i:'Internet Explorer',f:'Firefox',o:'Opera',s:'Safari',n:'Netscape', c:"Chrome", x:"Other"};
    if (/MSIE (\d+\.\d+);/.test(ua)) n="i";
    else if (/Arora.(\d+\.\d+)/.test(ua)) n="x";
    else if (/Chrome.(\d+\.\d+)/.test(ua)) n="c";
    else if (/Firefox.(\d+\.\d+)/.test(ua)) n="f";
    else if (/Version.(\d+.\d+).{0,10}Safari/.test(ua)) n="s";
    else if (/Safari.(\d+)/.test(ua)) n="so";
    else if (/Opera.*Version.(\d+\.\d+)/.test(ua)) n="o";
    else if (/Opera.(\d+\.\d+)/.test(ua)) n="o";
    else if (/Netscape.(\d+)/.test(ua)) n="n";
    else n="?";
    if (n != "?") v=new Number(RegExp.$1);
     {
    if (n=="so") {
        v=((v<100) && 1.0) || ((v<130) && 1.2) || ((v<320) && 1.3) || ((v<520) && 2.0) || ((v<524) && 3.0) || ((v<526) && 3.2) ||4.0;
        n="s";
      }
      if (n=="i" && v<8 && window.XDomainRequest) {
        bname = " (Komp.Modus IE" + v +")"
        v=8;
      }
      bname = names[n] + " " + v + bname;
    }
    return bname;
}
var brname = BrowserName();
 
 
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
 
    
 dfu = ((kbimg + 6) * 8000)/diff;
 cache = (dfu > 16000) ? " (Cache?)" : " (" + (kbimg + 6) + " kByte in " + diff + "ms)";
 tdfu = dfu.toFixed(4) ;
 
 
    }
    

    var mf = "";
    if (document.all) {
    h = document.documentElement.clientHeight;
    mf = document.body.offsetWidth + " X " + h + " Pixel"; }
    else { mf = window.innerWidth + " X " + window.innerHeight + " Pixel" }
    pi = Math.round(window.innerWidth*window.innerHeight)
    // fenster
fenster = mf;

 
    
       window.setTimeout(function () { evtimer1() }, 500);
     
}


cal()
calx(xx)
function calx(xx) {
    y = new Date() 
    diff = y.getTime() - xx.getTime()
 zeita = diff/1000;
}



	GM_xmlhttpRequest({
		'method': 'GET',
		'url': 'http://checkip.dyndns.org/',
		     onload: function(responseDetails) {
		           var content = responseDetails.responseText;
				
		 
		 ip =content.split('body')[1].split('body')[0];
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

















document.getElementById("content").innerHTML ='<div id="ww"></div>';
 
 
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Codename :</td><td valign=top>' + navigator.appCodeName+'</td></table>';
 
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Browsername</td><td valign=top>' + navigator.appName+' '+brname+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Browser-Version</td><td valign=top>' + navigator.appVersion+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Plattform</td><td valign=top>'+ navigator.userAgent+'</td></table>'
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Betriebssystemtyp</td><td valign=top>' + navigator.platform+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Adresse</td><td valign=top><td valign=top>'+location.href+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Protokoll</td><td valign=top>'+location.protocol+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Severname</td><td valign=top>'+location.hostname+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Name des Servers</td><td valign=top>'+location.host+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Portnummer</td><td valign=top>'+ location.port+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Pfad-/Dateiname</td><td valign=top>'+ location.pathname+'</td></table>';


  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Ip adresse :</td><td valign=top'+ip+'/td></table>';

  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Seiten in history</td><td valign=top> '+history.length+'  Seiten </td></table>';
           
           
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Cookies</td><td valign=top>'+cook+'</td></table>';
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Flashplayer</td><td valign=top>'+vtext+'</td></table>';
var sa = screen.width*screen.height; 
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Monitor</td><td valign=top>Y   = '+screen.width+' X   = '+screen.height+' Pixel : '+sa+'</td></table>';
  
  
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Fenster gr&ouml:sse</td><td valign=top>  Y '+fenster+' Pixel = '+pi+'</td></table>';
document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Java</td><td valign=top> '+javava+'</td></table>';
 document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Pc Time</td><td valign=top> '+pc+' '+s_time+' '+somm+' Stunden</td></table>';

  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Datenvolumen</td><td valign=top> '+tdfu+' Kbits/sek  - cache : '+cache+'  </td></table>';
 
  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Ladezeit diese Seite</td><td valign=top> '+zeita+'  Sekunden </td></table>';
  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Installierte Plugins</td><td valign=top> '+navigator.plugins.length+'  St&uuml;ck</td></table>';

  document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>HTML-Tags</td><td valign=top>Diese Datei hat ' + document.all.length + ' HTML-Tags</td></table>';  

          document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Davon Bilder</td><td valign=top>'+tags + ' HTML-Bilder</td></table>'; 
          document.getElementById("ww").innerHTML +='<table width=70% border=0><td width=35% valign=top>Davon Links</td><td valign=top>'+tagsa + ' HTML-Links</td></table>'; 
           
         }});

}
 window.onload = ladezeit;
//_________________________ ________________    einstellunngen zuende ______________________________________________________


 



 
var url = document.location.href;
if (url.indexOf("pennergame") >= 0) {var link = "https://www.pennergame.de/"}
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
//////////////////////////////////////////////////////     id und name abfragen /////////////////////////////////////////////



try{
  var name = document.getElementsByClassName('user_name')[0].innerHTML;
if (GM_getValue("name") == null){

 document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:220%;\">Pennername Aktualiesiert</font></b> ';aus();
GM_setValue("name", name)
}
  if (GM_getValue("name") != name){

 document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:220%;\">Pennername Aktualiesiert</font></b> ';aus();
GM_setValue("name", name)
}
  
  
if (GM_getValue("geld1") == null){
  var geld = document.getElementsByClassName('icon money')[0].innerHTML;
  var geld1 = geld.split('€')[1].split('</a')[0].trim();
  var geld1 = geld1.replace(/\./g, "");
 var geld1 = geld1.replace(/\,/g, "");
  GM_setValue("geld1", geld1)
}
 
    var geld = document.getElementsByClassName('icon money')[0].innerHTML;
  var geld1 = geld.split('€')[1].split('</a')[0].trim();
  var geld1 = geld1.replace(/\./g, "");
 var geld1 = geld1.replace(/\,/g, "");
   if(GM_getValue("geld1") != geld1) {
   
       GM_setValue("geld1", geld1)

document.getElementById("lader").innerHTML = '<br><font style="color:orange ;font-size:220%;\">Geld angepasst</font></b> ';

     aus()

}
    
  
   
  
  
  
  
  
  var idpenner = document.getElementsByClassName('el2')[0].innerHTML;
if (GM_getValue("idpenner") == null){
 
  GM_setValue("idpenner", idpenner)
document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:220%;\">Pennerid Aktualiesiert</font></b>';aus();
}
if (GM_getValue("idpenner") != idpenner){
  GM_setValue("idpenner", idpenner)
document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:220%;\">Pennerid Aktualiesiert</font></b>';aus();
}
  
  
  
}catch(e){
ladeanzeiger.style.display="block";aus()
document.getElementById("lader").innerHTML = '<font style="color:red ;font-size:170%;\">Fehlerbeim laden des namens oder der id</font>'; aus();
}













 
//_________________________________________________________     LOse Kaufen  ________________________________________________


  losegeldcheck()
 
 
    function losegeldcheck(){
                    GM_xmlhttpRequest({
    		   method: 'GET',
		    url: ''+link+'/city/games/',
		     onload: function(responseDetails) {
		           var content = responseDetails.responseText;
               var text1 = content.split('Du kannst heute noch ')[1];
                var NochLos = text1.split(' Lose kaufen')[0];
               var NochLosea = NochLos.split('lose_remaining">')[1];
               var NochLose = NochLosea.split('<')[0];
               
         
               if(NochLose < 1){
         document.getElementById("loseanzeigen").innerHTML = '<a href="#" name="einsack1" id="einsack1" title=" "><font style="color:red ;font-size:110%;\">'+NochLose+' Lose</font></a>';               
               }else if(NochLose >=1){
      document.getElementById("loseanzeigen").innerHTML = '<a href="#" name="einsack1"  id="einsack1" title=" "><font style="color:white ;font-size:110%;\">'+NochLose+' Lose</font></a>'; 
                   
  

document.getElementsByName('einsack1')[0].addEventListener('click', function start() {
 
  
  if(GM_getValue("losean") == true){	
 
 
   
guthaben(1)
    function guthaben(l){  
  

 		          if(l < GM_getValue("menge")){
		   l++; 
                       // var l = Math.round(l*10)/1/1; 
                  GM_xmlhttpRequest({
                      method: 'POST',
                      url: ''+link+'/city/games/buy/',
                      headers: 
                      {'Content-type': 'application/x-www-form-urlencoded'},
                      data: encodeURI('menge=1&id=1&preis=10.00&preis_cent=100&submitForm=F%C3%BCr+%E2%82%AC0.00+kaufen'),
                      onload: function(){
 document.getElementById('lader').innerHTML = ' <b><font style="color:green ;font-size:300%;">Kaufe los '+l+' von '+GM_getValue("menge")+''; 
 ladeanzeiger.style.display="block";
                      guthaben(l)         
              }});                       
   }else if(l >= GM_getValue("menge")){
      document.getElementById("lader").innerHTML = '<br><font style="color:orange ;font-size:220%;\">Rechne....</font></b>';aus();
       GM_xmlhttpRequest({
    		   method: 'GET',
		    url: ''+link+'/city/games/',
		     onload: function(responseDetails) {
		           var content = responseDetails.responseText;
     		            var suchas = content.split('bersicht zu kommen">')[1].split('</li>')[0];
		                             var suchd = suchas.split('&euro;')[1].split('</a>')[0];
		                             var suchd = suchd.replace(/\n|\r/g,"");
		                             var suchd = suchd.replace(/\s/g, "");
		                             var suchd = suchd.replace(/\,/g, "");
		                             var suchd = suchd.replace(/\./g, "");
         
 								     var gewo  =  Math.round(suchd-GM_getValue("geld1"))*1/100;
    
		                             if(GM_getValue("geld1") == suchd){
			                                var farbes = 'orange';
                                    var dd ='Sie haben nix gewonnen und keine verluste gemacht'
		                             }else if(GM_getValue("geld1") < suchd){
		                                   var farbes = 'green';
                                       var dd ='Sie haben '+gew+' &euro durch Lose kaufen Gewonnen'
		                             }else if(GM_getValue("geld1") > suchd){
			                                 var farbes = 'red';
                                       var dd ='Sie haben durch Lose kaufen '+gewo+' &euro; verlust gemacht'
			                           }

 document.getElementById('lader').innerHTML = ' <b><font style="color:white ;font-size:200%;\">Aktuelles Guthaben '+GM_getValue("geld1")/100+' &euro;<br>Nach Losekauf <font style="color:'+farbes+' ;font-size:200%;\">'+suchd/100+' &euro; <br>'+gewo+' &euro; </font><br>'+dd+'</b></font> ';
ladeanzeiger.style.display="block";aus()
             }});
    }
   
    }          
                  

		           }else{
                     
                    document.getElementById("loseanzeigen").innerHTML = '<a href="/city/games/" title=" "> <font style="color:white ;font-size:120%;\">Lose</font></a>';                                     
                     
                     
                   }
}, false);
}
 }});
}

//____________________________________________      container  ___________________________________________________



if(GM_getValue("contian") == true){	
  
var zehl = Math.round(GM_getValue("max_cash")/10);  
var rest = Math.round(GM_getValue("max_cash")-zehl); 
var sa = Math.round(GM_getValue("max_cash")/10000);  

var pro = geld1/sa;//Math.round(geld1/sa)/100;  
  var proh =pro/100;
   var proa = proh.toFixed(3)/1;

if(geld1 >= GM_getValue("max_cash")){
    document.getElementById("lader").innerHTML = ' <b><font style="color:red ;font-size:211%;\">Dein container ist komplett voll</font></b>';
  document.getElementById("contianzeige").innerHTML = ' <b><font style="color:red ;font-size:100%;\">Beh&auml;lter <br>'+proa+' %</font></b>';
 ladeanzeiger.style.display="block";aus()
}else if(geld1 <= rest){
 //  alert('genug Patz')
 document.getElementById("contianzeige").innerHTML = ' <b><font style="color:'+GM_getValue("farbe")+'  ;font-size:100%;\">Beh&auml;lter <br>'+proa+' %<br></font></b>';
 }else if(geld1 > rest){
    document.getElementById("lader").innerHTML = ' <b><font style="color:orange ;font-size:200%;\">Dein Beh&auml;lter ist mehr als 90 Prozent voll</font></b>';
   document.getElementById("contianzeige").innerHTML = ' <b><font style="color:orange ;font-size:100%;\">Beh&auml;lter <br>'+proa+'</font></b>';
ladeanzeiger.style.display="block";aus()
 }  
 
}else{
 
   document.getElementById("contianzeige").innerHTML = ' <a href="/financial/">Bilanzen</a> ';
 
}
















 	if(GM_getValue("uhran") == true){
      uhr()
 function uhr()
{
  document.getElementById("uhranaus").innerHTML = ' <b><font style="color:'+GM_getValue("farbe")+' ;font-size:120%;\">'+time+' Uhr</font>'

 //    window.setInterval(function () { uhr() }, 1000);
  }
    }else{
   document.getElementById("uhranaus").innerHTML = ' <a href="https://pennergame.de">News</a>'   
      
    }
     
     
    	if(GM_getValue("korkenan") == true){  

document.getElementById("kk-button").innerHTML = '';//'<img height="50" width="50" title=" " src="'+GM_getValue("eigenesbild1")+'" alt="">';   
document.getElementsByClassName("icon crowncap")[0].innerHTML =''; 
   
        }else{
    
    }
 




 
 
if(GM_getValue("fightan") == true){

 
document.getElementById("tierfightanaus").innerHTML = '<a href="#" name="tierfightbutton" title="Ein mal klicken und dein tier geht fighten...Einstellungen sind im Bastis Topinfomenü Script Einstelllungen vorzunehmen">Go Fighten</a><img height="23" width="23" title="Aktuelle fight zeit" src="https://media.pennergame.de/de/img/att.png" alt="">';
  
  
  
  
document.getElementsByName('tierfightbutton')[0].addEventListener('click', function start() {
fight()
}, false);
 }else{ 
  document.getElementById("tierfightanaus").innerHTML = '<a href="/friendlist/"  title="Deine Freundesliste">Freundesliste</a>';
  
}


  function fight(){
       
   	GM_xmlhttpRequest({
		method: 'POST',
		url: ''+link+'/fight/pet/',
      		headers: {'Content-type': 'application/x-www-form-urlencoded'},
		data: encodeURI('einsatz='+GM_getValue("einsatz")+'&ttl='+GM_getValue("minuten")+'&verhalten='+GM_getValue("verhalten")+'&risiko='+GM_getValue("risiko")+'&: undefined'),
		onload: function(responseDetails){
 
   
    document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:220%;\">'+time+'</font></b><br><b><font style="color:white;font-size:200%;\"><br>Tier Kampf gestartet...<br>Kampf läuft '+GM_getValue("minuten")+'  Minuten <br>Mit einen Einsatz von '+GM_getValue("einsatz")+'  &euro;.<br>Dein Verhalten ist '+GM_getValue("verhalten")+'  </font></b>';

ladeanzeiger.style.display="block";aus()
        }});
  }


if(GM_getValue("fightanauto") == true){
 var zeit = GM_getValue("minuten")*60*1000;
 window.setInterval(function () { fight() }, zeit);
 }


///////////////////////////////////// Restliche informationen  stock plunder  und co //////////////////////////
function stock(){
 ladeanzeiger.style.display="block"; 
//   document.getElementById('lader').innerHTML ='<font style="color:#FF00FF ;font-size:180%">Angelegter Plunder </b></font><br>'+GM_getValue("plundertext")+'<br><br>'; 
   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/stock/',
      onload: function(responseDetails) {
         var content = responseDetails.responseText;
         var bier = content.split('de_DE/inventar/Bier.png')[1].split('<font')[0].split('<span>')[1].split('Flaschen')[0];
        var wodkar = content.split('/de_DE/inventar/Wodka.png')[1].split('<font')[0].split('<span>')[1].split('Flaschen')[0];
 document.getElementById("lader").innerHTML +='<br><b><font style="color:green ;font-size:170%;\">Getränke in Inventar</font></b><br><b><font style="color:orange ;font-size:170%;\">Bier '+bier+' Stück <br> Wodkar '+wodkar+' Stück</font></b><br>'
  GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/stock/bottle/',
      onload: function(responseDetails) {

        
        var contenta= responseDetails.responseText;
        var flasche = contenta.split('de_DE/inventar/Pfandflasche.png')[1].split('/font>')[0].split('<span>')[1].split(' Pfandflaschen')[0].trim();
     
         var kurs = contenta.split('de_DE/inventar/Pfandflasche.png')[1].split('/font>')[0].split('&euro;')[1].split('<')[0].trim();
//Math.round();
   
// var pro = pro1.toFixed(3);
 var kurs = kurs.replace(/\,/g, ".");
        
        
      var schloss = Math.round(590000/kurs);// flaschen die man bei den kurs noch brauch
        var nochf = Math.round(schloss-flasche);// eigene flaschen minus gesaamtmenge die man brauch
 var rechner = 'Bei diesen kurs('+kurs+') <br> Müsstest du noch '+schloss+' Flaschen sammeln um <br>das Schloss zu kaufen.'
      +'Du hast '+flasche+' Flaschen <br>im inventar und musst somit <br>nur noch'+nochf+' Flaschen sammeln..'
   
        
        document.getElementById("lader").innerHTML +='<br><b><font style="color:green ;font-size:170%;\">Pfandflaschen in Inventar</font></b><br><b><font style="color:orange ;font-size:170%;\">Pfandflaschen '+flasche+' Stück <br> Kurs '+kurs+' <br></font></b><font style="color:red ;font-size:170%;\">'+rechner+'</font><br>'                                                                                 

   
        
fresse()
 
      }});
      }});
  function fresse() {
              GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/stock/foodstuffs/food/',
      onload: function(responseDetails) {
         var contenta= responseDetails.responseText;
        try{
        var brot = contenta.split('/pv4/shop/de_DE/inventar/Brot.png')[1].split('<font')[0].split('<span>')[1];
        }catch(e){
          var brote = '--';
        }
        try{
        var curry = contenta.split('/pv4/shop/de_DE/inventar/Currywurst.png')[1].split('<font')[0].split('<span>')[1];
 }catch(e){
 var curry = '--';
 }
        try{
          var hamburg = contenta.split('/pv4/shop/de_DE/inventar/Hamburger.png')[1].split('<font')[0].split('<span>')[1];
  }catch(e){
 var hamburg = '--';
 }   
   
     document.getElementById("lader").innerHTML +='<br><b><font style="color:#00FFFF ;font-size:200%;\">Inventar Essen</font></b><br><br><b><font style="color:orange ;font-size:200%;\">'+brot+'</font></b><br><b><font style="color:orange ;font-size:200%;\">'+curry+'</font></b><br><b><font style="color:orange ;font-size:200%;\">'+hamburg+'</font></b><br>';
    
  document.getElementById("lader").innerHTML +='<br><b><font style="color:blue ;font-size:200%;\">Bastelbarer Plunder ???</font></b><br><br>';
       plunderstart(1)
      }});
  }     
        
        
  
  
  
  
  
  
  
  
  
        
        function plunderstart(i){
                    GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/stock/plunder/craftlist/',
      onload: function(responseDetails) {
         var contenta= responseDetails.responseText;
        var links = contenta.split('/stock/plunder/craft/details/');
        

      if(i <= links.length+2){
        try{
          var links = contenta.split('trhover td_plunder"')[i].split('</form>')[0].split('href="/stock/plunder/craft/details/')[1].split('/')[0];
         var welcherplu = contenta.split('trhover td_plunder"')[i].split('</form>')[0].split('font-size:14px;">')[1].split('</strong>')[0];
 
       // var kurs = contenta.split('&euro;')[1].split('<')[0].trim();
  GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/stock/plunder/craft/details/'+links+'/',
      onload: function(responseDetails) {
           var content= responseDetails.responseText;
           var suche = content.search("https://static2.pennergame.de/img/pv4/plunder_new/craft/craft_do.png");
		   if (suche != -1) {
document.getElementById("lader").innerHTML +='<b><font style="color:green ;font-size:170%;\"> '+welcherplu+' Ist Bastelbar</font></b><br>'
                            }else {
document.getElementById("lader").innerHTML +='<b><font style="color:orange ;font-size:170%;\">'+welcherplu+' Ist nicht Bastelbar</font></b><br>'
                              
           }
 
  
        i++;
       plunderstart(i)
     }});

        
      }catch(e){
    
        aus()
      }
      }      
 }});
      }

   
      }
//http://static2.pennergame.de/img/pv4/shop/de_DE/inventar/Bier.png  // Wodka,Pfandflasche
///////////////////////////////////////////////   Pennerinformation /////////////////////////////////////////


function penner(){

   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/activities/',
      onload: function(responseDetails) {
         var content = responseDetails.responseText;
         var ges2 = content.split('Gesch.: ')[1].split('<a class="tooltip"')[0];
         var ges4 = content.split('Bandentraining: ')[1].split('%')[0];
         var gelder = content.split('erwirtschaftet:')[1].split('<br')[0];
  //   return gelder;
        
var a1 = '<b><font style="color:green ;font-size:222%;\">Du hast '+gelder+' <br>Durchs Pfandsuchen</font></b>'      
         GM_xmlhttpRequest({
            method: 'GET',
            url: ''+link+'/skills/',
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
         var sozial = contenta.split('<strong>Sozialkontakte')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();           
         var konzi = contenta.split('Konzentration</strong>')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();        
         var tasche = contenta.split('Taschendiebstahl</strong>')[1].split('</tr>')[0].split('<td width="108">')[1].split('<')[0].trim();     
            
              
var a2 = '<b><font style="color:blue ;font-size:170%;\">Weiterbildungen<br>Du hast Att '+att1+'<br>Def '+def3+'<br>Geschicklichkeit  '+ges1+'<br>Sprechen  '+sprechen+'<br> Bildungsstufe   '+bildungssstufe+'<br>Musik   '+musik+'<br>Sozialkontakte   '+sozial+'<br>Konzentration  '+konzi+'<br>aschendiebstahl  '+tasche+'</font></b><br>';
              
              
              
   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/fight/overview/',
      onload: function(responseDetails){
         var content = responseDetails.responseText;
         var gew = content.split('>Gesamt:')[1].split('Gewonnen/')[0];
         var ver = content.split('Gewonnen/')[1].split('Verloren/')[0];      
         var aus = content.split('Verloren/')[1].split(' Ausgewichen/')[0];
         var une = content.split(' Ausgewichen/')[1].split('Unentschieden')[0];
         var kampf = content.split('class="fight_num">')[3].split('</')[0];

        

        
        
        var a3 = '<br><b><font style="color:orange ;font-size:170%;\">Kampf daten<br> Gewonnen '+gew+'<br> Verloren  '+ver+'<br>Ausgewichen '+aus+' <br> Unenschieden  '+une+'<br> Kampfkraft  '+kampf+'</font></b><br>';
 
        
       document.getElementById("lader").innerHTML = '<br>'+a1+'<br>'+a2+'<br>'+a3+'<br>';

ladeanzeiger.style.display="block";
      
        
        
      weiter()
        
        
      }});
      
    }});
}});
  function weiter(){
  aus()  
}
}













///////////////////////////////////////////////Tier kämpfe /////////////////////////////////////////////////
	 GM_xmlhttpRequest({
				method: 'GET',
				url: ""+link+"/fight/pet/",
			  onload: function(response) {
						var content = response.responseText;
                              
	 	        var bilda = content.split('static.pennergame.de/img/pv4/shop/de_DE/tiere/')[1].split('.jpg')[0];
             
            var spezies = content.split('Spezies:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
						var angriff = content.split('Angriff:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
					  var level = content.split('Level:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
					  var vertei = content.split('Verteidigung:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
					  var gewon = content.split('Gewonnene Kämpfe:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
					  var verlor = content.split('Verlorene Kämpfe:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
	          try{
						     var zeitq = content.split('Restzeit:')[1].split('fight/pet')[0];
						 		 var zeity = zeitq.split('(')[1].split(',')[0];
			 		       var ver = content.split('Verhalten:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
				         var ris = content.split('Risiko:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
				         var ein = content.split('Einsatz:')[1].split('</tr>')[0].split('<td>')[1].split('</td>')[0].trim();
				    }catch(e){
		             var zeity = '1';
	          }
					
					  var timeleft1 = zeity;
			      hallo1(timeleft1)
					  function hallo1(timeleft1){
                    hour = Math.floor(timeleft1 / 3600);
                    minute = Math.floor((timeleft1%3600) / 60);
                    second = Math.floor(timeleft1%60);
                    if ( hour < 10 ) {
                         hour = "0"+hour;
                    }
                    if ( minute < 10 ) {
                         minute = "0"+minute;
                    }
                    if ( second < 10 ) {
                         second = "0"+second;
                    }
                    var zeit1 =''+hour+' : '+minute+' : '+second+'';
                    if (timeleft1 > 2) {
	                       timeleft1--;
                         var alles ='Spezies :'+spezies+' .\n'
												 +'Level :'+level+' .\n'
												 +'Angriff :'+angriff+' .\n '
												 +'Verteidigung :'+vertei+' .\n '
												 +'Gewonnen :'+gewon+'.\n '
												 +'Verloren : '+verlor+'.\n'
												 +'Verhalten : '+ver+'.\n'
												 +'Risiko : '+ris+'.\n'
												 +'Einsatz : '+ein+'.\n';

	     

 
 
	var bildfight = 'https://static2.pennergame.de/img/pv4/shop/de_DE/tiere/'+bilda+'.jpg';
 
                
          document.getElementById('tier').innerHTML = '<center><a href="/fight/pet/"><img height="23" width="23" title="'+alles+'" src="'+bildfight+'" alt=""></a><a href="/fight/pet/"><font style="color:white ;font-size:112%;\"><b>'+zeit1+'</b></font></a></center>';             
           
 //document.getElementById('tierfight').innerHTML = ' <img height="23" width="23" title="'+alles+'" src=" http://media.pennergame.de/de/img/att.png" alt=""><font style="color:white ;font-size:112%;\"><b>Haustier</b></font>';                      
                      
                    	   window.setTimeout(function () { hallo1(timeleft1) }, 1000);
										}else if(timeleft1 <= 2){
				           //    var te = document.getElementById('topmenu');
			                 //  var ter= te.getElementsByTagName('li')[2];
												 var alles ='Spezies :'+spezies+' .\n'
												 +'Level :'+level+' .\n'
												 +'Angriff :'+angriff+' .\n '
												 +'Verteidigung :'+vertei+' .\n '
												 +'Gewonnen :'+gewon+'.\n '
												 +'Verloren : '+verlor+'';
                var zeit ='--:--:--'                          
 			var bildfight = 'https://static2.pennergame.de/img/pv4/shop/de_DE/tiere/'+bilda+'.jpg';					
 
document.getElementById('tier').innerHTML = '<center><a href="/fight/pet/"><img height="23" width="23" title="'+alles+'" src="'+bildfight+'" alt=""></a><a href="/fight/pet/"><font style="color:white ;font-size:112%;\"><b>'+zeit+'</b></font></a></center>';                              
                                        
                                         
                                          
                                          
										 }
                  //      GM_setValue("alles", alles)
    
						 }
        //  alert('Daten fürs ganze script nach oben  geben 1598')
 }});







 


/////////////////////////////////////////////    haustier platz und co /////////////////////////////////////////
 
function tierdaten(){
  GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/pet/tab/season/',
      onload: function(responseDetails) {
         var content = responseDetails.responseText;
		 
 
		try{
			// if (suche != -1) {
		var platz1 = content.split('13px;text-align:right;">')[1].split('</tr')[0].split('<')[0].trim();

              var seasonplatz = content.split('text-align:center;">')[4].split('</td')[0].trim();
             var seasonpunkte = content.split('text-align:center;">')[5].split('</td>')[0].trim();
       	var geteilthundert =  Math.round(platz1/100)*1/1;  
          	var pro1 =  seasonpunkte/geteilthundert;// Math.round(seasonpunkte/geteilthundert)/10000;
         var pro = pro1.toFixed(3);
       
           var seson = '<font style="color:orange ;font-size:170%;\"><b>Begleiter<br>Haustier Season <br>Platz : '+seasonplatz+' <br> Punkte : '+seasonpunkte+' ('+pro+' % von Platz1 ) </b></font><br><br>';
   //   var aa = content.split('highscoresearch')[1].split(' ')[0];
         
             }catch(e){
document.getElementById("lader").innerHTML = '<font style="color:red ;font-size:222%;\">Fehlerbeim laden der Haustier  season daten/font>'; 
ladeanzeiger.style.display="block";aus() 
} 
        
  GM_xmlhttpRequest({
      method: 'GET',
          url: ''+link+'/pet/tab/highscore/1/?playername='+GM_getValue("name")+'&1505940305613',
      onload: function(responseDetails) {
         var content = responseDetails.responseText;
 
		// var suche = content.search("einsacken");
	try{
			// if (suche != -1) {
              var platz = content.split('font-size:13px;">')[4].split('</td>')[0].trim();
      
             var profil = content.split('href="/profil/id:')[1].split('/')[0];
  
           var bande = content.split('href="/profil/bande:')[1].split('/')[0];
             var punkte = content.split('font-weight:bold;">')[1].split('</td>')[0].trim();
var seson1 = '<font style="color:green ;font-size:170%;\"><b>Haustier Highscor <br>Platz : '+platz+' <br> Punkte : '+punkte+'</b></font><br>'; 
//http://www.pennergame.de/pet/tab/highscore/1/?playername='+getValue("name")+'
 
      var tierweiter =' <br><font style="color:yellow ;font-size:170%;\">'
      +'<br>Letzte Weiterbildung wahr : '
+'<br>'+GM_getValue("was")+' : Stufe ['+GM_getValue("stufe")+']</font><img height="23" width="23" title="Letzte oder aktuelle Tierweiterbidung" src="'+GM_getValue("bild")+'" alt=""></a><br>';
 //    var kampf = '<br><font style="color:#FF00FF ;font-size:170%;\">Haustier Daten ( fight ) <br>'+alles+'</font>'
  //   var kampf = kampf.replace(/\./g, "<br>"); 
//var streun ='<br><br><font style="color:#0000FF ;font-size:170%;\">Leztes Sreunertier<br>'+reintun+'</font>';
      
    }catch(e){
  document.getElementById("lader").innerHTML = '<font style="color:red ;font-size:222%;\">Fehlerbeim laden der haustier highscore</font>';       
ladeanzeiger.style.display="block";aus()
}
         document.getElementById("lader").innerHTML = ''+seson+''+seson1+''+tierweiter+'';//+kampf+''+streun+'';  
ladeanzeiger.style.display="block";aus()
   
        
      }});  
        }});
}






//////////////////////////////////////////////////////////////7  tageseinnahmen einsacken ///////////////////////////

  GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/overview/',
      onload: function(responseDetails) {
         var content = responseDetails.responseText;
		
        try{
         var plu1 = content.split('src="https://static.pennergame.de/img/pv4/plunder_new/')[1].split('.png')[0];   
         var plu2 = content.split('src="https://static.pennergame.de/img/pv4/plunder_new/')[2].split('.png')[0];  
         var plu3 = content.split('src="https://static.pennergame.de/img/pv4/plunder_new/')[3].split('.png')[0];
      	 

			if (content.indexOf('Container') != -1) {
             if(GM_getValue("max_cash") != 100000000){	  
              
              
				var max_cash = 100000000;
                       GM_setValue("max_cash", max_cash);
      
			}
            }
			else if (content.indexOf('Einkaufswagen') != -1) {
				var max_cash = 1000000;
         GM_setValue("max_cash", max_cash);
			} 
			else if (content.indexOf('Beutel') != -1) {
				var max_cash = 100000;
         GM_setValue("max_cash", max_cash);
			} 
			else if(side.indexOf('Gro?e T?te') != -1) {
				var max_cash = 10000;
         GM_setValue("max_cash", max_cash);
			} else {
				var max_cash = 1000;
			} 

if (GM_getValue("max_cash") == null){
 GM_setValue("max_cash", max_cash);
}
          
plundertext = '<center><a href="/stock/plunder/" title="Angelegter Plunder"><img height="40" width="40" title=" Angelegter Plunder" src="http://static2.pennergame.de/img/pv4/plunder_new/'+plu1+'.png" alt=""></a><a href="/stock/plunder/" title="Angelegter Plunder"><img height="40" width="40" title="Angelegter Plunder" src="http://static2.pennergame.de/img/pv4/plunder_new/'+plu2+'.png" alt=""></a><a href="/stock/plunder/" title="Angelegter Plunder"><img height="40" width="40" title="Angelegter Plunder" src="http://static2.pennergame.de/img/pv4/plunder_new/'+plu3+'.png" alt=""></a></center>';	
document.getElementById('plunderaa').innerHTML = plundertext;
 //  GM_setValue("plundertext", plundertext);  
        
          
        }catch(e) {    
 document.getElementById('lader').innerHTML = '<font style="color:red ;font-size:180%;\">Fehler beim lesen der Plunder Daten (1170)</font>';
          document.getElementById('plunderaa').innerHTML = '<a href="/stock/plunder/" title="Error beim Plunder laden oder Bitte Plunder anlegen">---</a>';
        }
        
		 var suche = content.search("einsacken");
		try{
			 if (suche != -1) {
              var musikgeld = content.split('href="/city/music_store/')[1].split('</form')[0];
             var musikgeld1 = musikgeld.split('&euro;')[1].split('jetzt einsacken')[0];
//GM_setValue("musikgeld1", musikgeld1)
  var rr = document.getElementById('geldin').innerHTML = '<center><a href="#" id="einsack" title="Mit einen klick holst du das geld was du mit deinen instrument immer verdienst"><img height="23" width="23" title=" " src="https://findicons.com/files/icons/199/the_robbery/128/money.png" alt=""></a><font style="color:white ;font-size:112%;\"><b>'+musikgeld1+' Einsacken</b></font></center>';    
            
 				} else {
 
			}
      }catch(e){document.getElementById('geldin').innerHTML = 'error einsacken';}
	 document.getElementById('geldin').innerHTML = '<center><a href="#" name="einsack" id="einsack" title="Mit einen klick holst du das geld was du mit deinen instrument immer verdienst"><img height="23" width="23" title=" " src="https://findicons.com/files/icons/199/the_robbery/128/money.png" alt=""></a><font style="color:white ;font-size:80%;\"><b>&euro;'+musikgeld1+' Einsacken</b></font></a></center>';	 
document.getElementsByName('einsack')[0].addEventListener('click', function start() {
 
  		try{
  	GM_xmlhttpRequest({
		method: 'POST',
		url: ''+link+'/overview/music_payout/',
		headers: {'Content-type': 'application/x-www-form-urlencoded'},
		data: encodeURI('check=nananana...batman%21: undefined'),
		onload: function(responseDetails){
          
          


              var musikgeld = content.split('href="/city/music_store/')[1].split('</form')[0];
             var musikgeld1 = musikgeld.split('&euro;')[1].split('jetzt einsacken')[0];
   
    document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:170%;\">'+time+'</font></b><br><font style="color:blue ;font-size:120%;\">Habe das Geld '+musikgeld1+' &euro; eingesackt...<br> Schüss bis  zum  nächsten mal</font></b>';

ladeanzeiger.style.display="block";aus()
          location.reload()

        

  
        }});
          }catch(e) {
        document.getElementById("lader").innerHTML = '<font style="color:red ;font-size:222%;\">Error beim auszahlen des tageslohn (1214)</font>';  
        }
  
}, false);

 
}});

  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  

///////////////////////////////////////////   flaschen sammeln////////////////////////////////////////////////
if(GM_getValue("sammelnan") == true){

document.getElementById("sammler").innerHTML = '<a href="#" name="pfand" id="pfand" title="">Sammel ('+GM_getValue("zeitsammeln")+')<br>Minuten</a>';

document.getElementsByName('pfand')[0].addEventListener('click', function start() {
//location.reload()


 
 

	                 GM_xmlhttpRequest({
	                    	method: 'POST',
		                    url: ''+link+'/activities/bottle/',
		                     headers: {'Content-type': 'application/x-www-form-urlencoded'},
		                    data: encodeURI('type=1&time='+GM_getValue("zeitsammeln")+'&bottlecollect_pending=True&Submit2=Einkaufswagen+ausleeren:'),
		                      onload: function(responseDetails){
	GM_xmlhttpRequest({
		method: 'POST',
		url: ''+link+'/activities/bottle/',
		headers: {'Content-type': 'application/x-www-form-urlencoded'},
		data: encodeURI('sammeln='+GM_getValue("zeitsammeln")+'&konzentrieren=1: undefined'),
		onload: function(responseDetails){
    document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:222%;\">'+time+'</font></b><br><b><font style="color:blue ;font-size:222%;\">Einkaufswagen geleert....<br> Bin 10 Minuten Sammeln gegangen</font></b>';

ladeanzeiger.style.display="block";aus()
          
    }});             
                   }});
 	

}, false);
}else{
  document.getElementById("sammler").innerHTML = '<a href="/votes/"  title="">Feedback</a>';
  
}
///////////////////////////////////////////////7    tagesaufgabe /////////////////////////////////////////////////


  GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/daily/',
      onload: function(responseDetails) {
         var content = responseDetails.responseText;
		 
		 var suche = content.search("Du hast diese Aufgabe schon erledigt.");
		try{
			if (suche != -1) {

				   var kronkpng = 'https://static.pennergame.de/img/pv4/daily_jobs/korkenhaken.png';
				} else {
		
				 var kronkpng = 'https://static.pennergame.de/img/pv4/daily_jobs/korken.png';				 
			};
        }catch(e){
               document.getElementById("lader").innerHTML = '<font style="color:green ;font-size:170%;\">Error beim auszahlen des tageslohn</font>'; 
              
            }
       try{
		 var taufgabe = content.split('gliche Aufgabe</strong>')[1].split('</div>')[0];
         var taufgabe2 = taufgabe.split('<strong>')[1].split('</strong>')[0];
  

		  if(taufgabe2 == 'Jetzt einen Haustierkampf starten'){var taufgabelink  = "/fight/pet/";}
		 else if(taufgabe2 == 'Jetzt einmal 100% sauber werden'){var taufgabelink  = "/city/washhouse/";}
		 else if(taufgabe2 == 'Erstelle einen eigenen Plunder'){var taufgabelink  = "/stock/ug_plunder/create/";}
		 else if(taufgabe2 == 'Ein Verbrechen erfolgreich begehen'){var taufgabelink  = "/activities/crime/";}
		 else if(taufgabe2 == 'Geld in deine Bandenkasse einzahlen'){var taufgabelink  = "/gang/credit/";}
		 else if(taufgabe2 == 'Einen Kampf gewinnen'){var taufgabelink  = "/fight/";}
		 else if(taufgabe2 == 'Eine Haustierweiterbildung starten'){var taufgabelink  = "/skills/pet/";}
		 else if(taufgabe2 == 'Einen Plunder basteln'){var taufgabelink  = "/stock/plunder/craft/";}
		 else if(taufgabe2 == 'Jetzt einen kleinen Snack essen'){var taufgabelink  = "/stock/foodstuffs/food/";}			
		 else if(taufgabe2 == 'Plunder in die Plunderbank deiner Bande einzahlen'){var taufgabelink  = "/gang/stuff/";}				 else if(taufgabe2 == 'Jetzt einem anderen Penner spenden.'){var taufgabelink  = "/change_please/statistics/";}	
		 else if(taufgabe2 == 'Promillepegel über 2‰'){var taufgabelink  = "/stock/";}
		 else if(taufgabe2 == 'Jetzt in der SB posten'){var taufgabelink  = "/gang/";}	
		 else if(taufgabe2 == 'Einmal Flaschensammeln starten'){var taufgabelink  = "/activities/";}	
		 else if(taufgabe2 == 'Jetzt Lose kaufen'){var taufgabelink  = "/city/games/";}
		 else if(taufgabe2 == 'Jetzt Flaschen verkaufen'){var taufgabelink  = "/stock/bottle/";}	
		 else if(taufgabe2 == 'Jetzt Plunder verkaufen'){var taufgabelink  = "/stock/plunder/";}	
     
         		 else if(taufgabe2 == 'Jetzt Zahnstocher kaufen.'){var taufgabelink  = "/city/weapon_store/";}	
		 else if(taufgabe2 == 'Jetzt eine PN an einen Freund versenden'){var taufgabelink  = "/messages/write/";}		
		 else if(taufgabe2 == 'Jetzt im Supermarkt Getränke kaufen.'){var taufgabelink  = "/city/supermarket/";}	
		 
		 else  if(taufgabe2 == 'Du hast die tägliche Aufgabe erledigt!'){var taufgabelink  = "/daily/rewards/";}
        else  {var taufgabelink  = "/daily/rewards/";}
         
         	if(GM_getValue("tagan") == true){	
	 
    document.getElementById('lader').innerHTML = '<img height="35" width="300" src="https://akphoto1.ask.fm/861/685/424/1940003004-1ronh4j-d1b8os03atfcf00/original/Tagesaufgabe.png" title="'+taufgabe2+'"><a href="'+taufgabelink+'" title="'+taufgabe2+'"><br><font style="color:red ;font-size:200%;\"><b>Hinweiss</b></font></a><br><font style="color:red ;font-size:180%;\"><b>DU HAST DEINE TÄGLICHE AUFGABE NOCH NICHT ERLEDIGT  </font><br></b><font style="color:green ;font-size:180%;\">'+taufgabe2+'</font>';  
ladeanzeiger.style.display="block";aus()  
      
      
      
    }else{}
         
         
         
		}catch(e){
		 //if(taufgabe2 == 'Du hast diese Aufgabe schon erledigt.'){}
var taufgabelink  = "/daily/rewards/";
       var taufgabe2  = "/daily/rewards/";   
 //<div class="'+aufgabeerledigt+'"  title="'+taufgabet_tip+'">'+taufgabe2+'</div></a>';
        }
document.getElementById('tag').innerHTML = '<img height="23" width="23" src="'+kronkpng+'" title="'+taufgabe2+'"><a href="'+taufgabelink+'" title="'+taufgabe2+'"><font style="color:white ;font-size:80%;\"><b>Tägliche Aufgabe</b></font></a>';
//GM_setValue("taufgabelink", taufgabelink)
//GM_setValue("tagbild", tagbild)


      }});



 



//////////////////////////////////////////////////////    Tier   weiterbildungen //////////////////////////////////////
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
                   var part1 = w_end0.split('<span class="style_skill">')[1].split('table')[0];
                  var stufe = part1.split('[')[1].split(']')[0];
                             
                    var suche = w_type1.search("Angriff");
			              if (suche != -1) {
                         var bild ='https://static2.pennergame.de/img/pv4/icons/attack.jpg';
                            var was = 'Att';
			              }else{}
			                   var suche = w_type1.search("Verteidigung");
			              if (suche != -1) {
                         var bild ='https://static2.pennergame.de/img/pv4/icons/def.jpg';
                                                       var was = 'Def';
			              }else{}
			                   var suche = w_type1.search("Kunststücke");
			              if (suche != -1) {
                         var bild ='https://static2.pennergame.de/img/pv4/icons/petart.jpg';
                                                        var was = 'Kunstücke';
			              }else{}



               if (GM_getValue("bild") == null) {
                        GM_setValue("bild", bild)   
                    GM_setValue("stufe", stufe)                   
                          GM_setValue("was", was) 
               }
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

                  //  var trw = document.getElementById('topmenu');
                    if (timeleft > 2) {
                        timeleft--;
 document.getElementById('testweiter').innerHTML = '<center><a href="/skills/pet/"><img height="20" width="20" title="Aktuelle Tier weiterbildung ...es wird '+was+' '+stufe+' ausgebildet " src="'+bild+'" alt=""></a><font style="color:white ;font-size:100%;\"><b>'+zeit+'</b></font></center>';
     //    GM_setValue("bildung", zeit)	               
                        window.setTimeout(function () { hallo(timeleft) }, 1000);
	 				          }else{
	//	var zeit = '<a href="/skills/pet/"><font style="color:white ;font-size:112%;\"><b>--:--:--</b></font></a>';					
 
                    }
							 }
		       }catch(e){
     
                     GM_deleteValue('bild')    
             
                    GM_deleteValue("stufe")                   
                          GM_deleteValue("was") 
                 
             document.getElementById('testweiter').innerHTML = '<a href="/skills/pet/"><img height="20" width="20" title="Weiterbildung starten " src="https://media.pennergame.de/img/plunder/icons/stofftier.gif" alt=""><font style="color:white ;font-size:112%;\"><b>--:--:--</b></font></a>';	
//	var bildung = GM_getValue("bildung");						 
//	GM_setValue("bildung", bildung)					 
           }
}});






  

  




 











//____________________________________________________________       streunen _______________________________________________


        
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              












 







if(GM_getValue("streunenan") == true){
   
 
   GM_xmlhttpRequest({
      method: 'GET',
      url: ''+link+'/pet/',
      onload: function(responseDetails) {
         var content1 = responseDetails.responseText;
      
                var welchestier = GM_getValue("tier");
  // 	 var ausdauera = content.split('chstwert:')[1].split('<div style')[0].split('</div>')[2].split('</div>')[0].trim();
       if(welchestier == 1)  {
        var tierids = content1.split('<div id="pet')[2].split('"')[0]; //fertig
                           var tiernamen = content1.split('class="petname ">')[1].split(' <div')[0]; //fertig
       }
              if(welchestier == 2)  {
        var tierids = content1.split('<div id="pet')[3].split('"')[0]; //fertig
                             var tiernamen = content1.split('class="petname ">')[2].split(' <div')[0]; //fertig     
              }
              if(welchestier == 3)  {
        var tierids = content1.split('<div id="pet')[4].split('"')[0]; //fertig
                                var tiernamen = content1.split('class="petname ">')[3].split(' <div')[0]; //fertig  
         
       }
    var sert = content1.split('class="petname ">'+tiernamen+'')[1].split('<h1>Wachsamkeit</h1>')[0];
         var ausab = sert.split("innerHTML='")[4].split("/")[0];
        if(ausab<=10){
           var tewer = document.getElementById('weather_desc');
		 tewer.innerHTML = '<br><font style="color:red ;font-size:211%;\">Dein ausgewältes Tier hat zu wennig ausdauer,bitte warte  bis morgen<br> oder wähle ein anderes tier.<br> Du hast noch '+punkteaufladena+' die du auch <br>noch verwenden könntest</font>'	;   
          
        }else{
          GM_xmlhttpRequest({
            method: 'GET',
              url: ''+link+'/pet/tab/action/',
            onload: function(responseDetails) {
                var contentx = responseDetails.responseText;
 
 try{        
              	 var wtier= contentx.split('Dein Haustier "')[1].split('"')[0];
 
              try{
		                var zuruecktry = content1.split('id="pet_roam_time">')[1].split('</span>')[0]; //fertig
               
                                var zeita = zuruecktry.split('counter(')[1].split(',')[0];
             
                        var content = content1.split('class="petname ">'+wtier+'')[1].split('<h1>Wachsamkeit</h1>')[0]; //fertig
          
			            hour = Math.floor(zeita / 3600);
                        minute = Math.floor((zeita%3600) / 60);
                        second = Math.floor(zeita%60);
                        if ( hour < 10 ) {
                            hour = "0"+hour;
                        }
                        if ( minute < 10 ) {
                            minute = "0"+minute;
                        }
                        if ( second < 10 ) {
                            second = "0"+second;
                        }
                             zeit =''+hour+' : '+minute+' : '+second+'';

			       }catch(e){
				        var zeit ='0';
			       }

       
   
       
       
       streunenuhr(zeita)
                       function streunenuhr(zeita){
                        
			            hour = Math.floor(zeita / 3600);
                        minute = Math.floor((zeita%3600) / 60);
                        second = Math.floor(zeita%60);
                        if ( hour < 10 ) {
                            hour = "0"+hour;
                        }
                        if ( minute < 10 ) {
                            minute = "0"+minute;
                        }
                        if ( second < 10 ) {
                            second = "0"+second;
                        }
                             zeit =''+hour+' : '+minute+' : '+second+'';
                  
 document.getElementById("streunenanzeigen").innerHTML = '<a href="/pet/" title="zurstreuner seite">Streunen</a>';  
zeita--;

   document.getElementById("streunenanzeigen1").innerHTML = '<center><a href="/pet/"><img height="23" width="23" title="Aktuelle zeit des streunens" src="https://www.tierschutz-shop.de/wp-content/uploads/2016/11/Ein-Herz-für-Streuner_4-480x480.jpg" alt=""></a><a href="/fight/pet/"><font style="color:white ;font-size:112%;\"><b>'+zeit+'</b></font></a></center>';                          
                         
                         
               
                         
                         window.setTimeout(function () { streunenuhr(zeita) }, 1000); 
                  
                }
       
       
       
       
       
       
       
       
       
       

   
             var erfpro = content.split("innerHTML='")[1].split("Erfahrung")[0];
			 var punkte = content.split('class="petnametooltip">')[1].split('Punkte')[0];
			 var gutflink = content.split('class="petspec">')[1].split('class="daytime')[0];
             var gutflink1 = gutflink .split('style="color')[1].split('/div>')[0];
             var gutflink2 = gutflink .split('style="color')[2].split('/div>')[0];
             var link1 = gutflink1 .split('<img src="')[1].split('"')[0];
             var link2 = gutflink2 .split('<img src="')[1].split('"')[0];
             var fab1 = gutflink1.split(':')[1].split('"')[0];
             var fab2 = gutflink2.split(':')[1].split('"')[0];
             var was1 = gutflink1.split('/>')[1].split('<')[0];
             var was2 = gutflink2.split('/>')[1].split('<')[0];
             var gutfli ='<img src="'+link1+'"><font style="color:'+fab1+' ;font-size:100%;\">  '+was1+' </font><br>'
             +'<img src="'+link2+'"><font style="color:'+fab2+' ;font-size:100%;\"> '+was2+'   </font><br>';
		     var level = content.split('title="Level">')[1].split('</div>')[0];
			 var erf1 = content.split("innerHTML='")[2].split("'")[0];
			 var auspro1 = content.split("innerHTML='")[3].split("A")[0];
			 var auspro2 = content.split("innerHTML='")[4].split("'")[0];
			 var ausdauer = content.split('chstwert:')[1].split('<div style')[0].split('</div>')[2].split('</div>')[0].trim();
 var ausab = content.split("innerHTML='")[4].split("/")[0];
      
			 var kampf = content.split('chstwert:')[2].split('<div style')[0].split('</div>')[2].split('</div>')[0].trim();
           
			 var nase = content.split('chstwert:')[3].split('<div style')[0].split('</div>')[2].split('</div>')[0].trim();
           
			 var wach = content.split('chstwert:')[3].split('<div style')[0].split('</div>')[2].split('</div>')[0].trim();
        
             var foto = content.split('https://static.pennergame.de/img/pv4/shop/de_DE/tiere/')[1].split('.')[0];
             var fotolink = 'http://static2.pennergame.de/img/pv4/shop/de_DE/tiere/'+foto+'.jpg';
	         var tierid = content.split('upgrade_popup_main_')[3].split('_')[0];
  
	         try{
				   var punkteaufladen = content.split('class="petinfo"')[1].split('Punkte')[0];//////////////////ifpunte au en uen
			       var punkteaufladena = punkteaufladen.split('>')[1].split(' ')[0];
			 }catch(e){
					
					var punkteaufladena = '-';
			 }
       
  
      
        
             var tew = document.getElementsByClassName('zright')[0];
             tew.innerHTML = '<center><a href="/pet/" title="">'
             +'<img height="60" width="60" title="Aktuelle Streunerrei" src="'+fotolink+'" alt=""></a></center>';

       if(ausab <= 10) {
    var tewer = document.getElementById('weather_desc');
		 tewer.innerHTML = '<br><font style="color:red ;font-size:211%;\">Dein ausgewältes Tier hat zu wennig ausdauer,bitte warte  bis morgen<br> oder wähle ein anderes tier.<br> Du hast noch '+punkteaufladena+' die du auch <br>noch verwenden könntest</font>'	;
 
     
   }else{
             var tewer = document.getElementById('weather_desc');
             var reintun = 'Dein Haustier "'+wtier+'" ist am Streunen <br>'
             +'Ist noch '+zeit+' umterwegs <br>'
             +'Punkte : '+punkte+'<br>'
             +'Erfahrung : '+erfpro+'  ('+auspro1+')<br>'
             +'Ausdauer : '+auspro2+' ('+erf1+')<br>'
             +'<tr></tr>'
             +'Aakeit : '+wach+' <br>'
             +'Du hast noch  '+punkteaufladena+' freie Punkte<br>'
             +''+gutfli+'<br>'
          
 //GM_setValue("reintun", reintun)
             tewer.innerHTML = reintun;
     }
 
       
       
       
  		 }catch(e){
              var tewer = document.getElementById('weather_desc');
		 tewer.innerHTML = 'Deine haustiere würden gerne streunen gehen ....bitte gehein stall und schicke deine haustiere streunen ';
 
          
        document.getElementById("streunenanzeigen").innerHTML = '<a href="#" name="streunen1" id="streunen1" title="Hier klicken und dein eingestelltes tier geht sofort streunen ein klick genügt">Streunen</a>'; 

   document.getElementById("streunenanzeigen1").innerHTML = '<center><a href="/pet/"><img height="23" width="23" title="Aktuelle zeit des streunens" src="https://www.tierschutz-shop.de/wp-content/uploads/2016/11/Ein-Herz-für-Streuner_4-480x480.jpg" alt=""></a><a href="/fight/pet/"><font style="color:white ;font-size:112%;\"><b>--:--:--</b></font></a></center>';                          
                         
     
          
          
          
      }

  

 
   
document.getElementsByName('streunen1')[0].addEventListener('click', function start() {

 

  
  

 //    var infotiername = GM_getValue("tiernamen");
 //    var tieridsan = GM_getValue("tierids"); 
  
     

GM_xmlhttpRequest({
		method: 'GET',
		url: ''+link+'/pet/tab/action/',
		onload: function(responseDetails) {
			var content = responseDetails.responseText;
ladeanzeiger.style.display="block"; aus()
		if(content.match(/Haustier in Empfang nehmen/)){
    
document.getElementById("lader").innerHTML = '<br><font style="color:green ;font-size:211%;\">Haustier in Empfang nehmen  </font>'
			var request = new XMLHttpRequest();
       request.open('get', '/pet/get_roam_reward/', true);//roam_
       request.send(null);
document.getElementById("lader").innerHTML = '<br><font style="color:orange ;font-size:211%;\">Haustier ist zuhause gehe Tier streunen schicken</font>';			
 
       streunen(ausdauer,punkteaufladena)
		} else if(content.match(/ist gerade unterwegs/)){
	document.getElementById("lader").innerHTML = '<br><font style="color:orange ;font-size:211%;\">Tier noch unterwegs </font>';
	 
		}else{
 	
          streunen()
		}
	 aus()

	}});

 
function streunen(){

    
	      GM_xmlhttpRequest({
	                method: 'POST',
		                   url: ''+link+'/pet/pet_action/',
		               headers: {'Content-type': 'application/x-www-form-urlencoded'},
		               data: encodeURI('area_id='+GM_getValue("richtung")+'&Flink&route_length='+GM_getValue("zeit")+'&pet_id='+tierids+'&:undefined'),
		               onload: function(responseDetails){
									ladeanzeiger.style.display="block"; aus()
			 document.getElementById("lader").innerHTML= '<br><font style="color:green ;font-size:211%;\">Tier losgeschickt !!!    </font>'	

                       }});
   
   
  
   
}

}, false);
              
             }});
        }
                            }});           
              
 }else{
   document.getElementById("streunenanzeigen").innerHTML = '<a href="/pet/" name="streunen1" id="streunen1" title=" ">Streunen</a>';  
 
 }




     //_________________________________________________    sammlmarken_________________________________________________________                      
  
if(GM_getValue("sammelnan") == true){
  
  
document.getElementById("sammeln11").innerHTML = '<a href="#" name="sammeltausch"  title="Marken tauschen">Sammelmarken </a>';
  
 //<img height="23" width="23" title="Aktuelle fight zeit" src="http://media.pennergame.de/de/img/att.png" alt="">
  
  
document.getElementsByName('sammeltausch')[0].addEventListener('click', function start() {
DoPetCollect()
}, false);


 }else{ 
 
  document.getElementById("sammeln11").innerHTML = '<a href="/friendlist/"  title="Deine Freundesliste">Freundesliste</a>';
  
}


 function DoPetCollect() {
   for(l=1;l<=5;l++){
    GM_xmlhttpRequest({method:"GET", url: 'http://' + window.location.hostname + '/pet/tab/collections/', onload:function(responseDetails) {
            var content = responseDetails.responseText;
            var ptArray = [];
            var uls = content.split("tabcontainer").pop().split('id="ul_');
            for (var i = 1; i < uls.length; i++) {
                var set = uls[i].split('">')[0];
              
                var spans = uls[i].split("trade_in")[0].split("</span>");
                var trade = uls[i].split("trade_in")[1].split("</div>")[0].split(">")[0].split("value=").pop();
                var points = parseInt(trade.split(")")[0].split("(").pop());
             
                var codeset = [];
                var minanz = 99999;
                for (var j = 0; j < spans.length - 1; j++) {
                    var code = spans[j].split("item_count_")[1].split('">')[0];
          
                    var anz = Number(spans[j].split(">").pop());
                    codeset.push([code, anz]);
                    if (anz < minanz)
                        minanz = anz;
 
                }
           
                if (minanz == 0)
                    continue;
                for (var j = 0; j < ptArray.length; j++)
                   if (ptArray[j][2] <= points)
                       break;
  
                ptArray.splice(j, 0, [set, codeset, points]);
            }
            for (var i = 0; i < ptArray.length; i++) {
                var rew = ptArray[i][0];
                var special = "";
                if (rew.substr(0,8) == "special_") {
                    special = "?special=true";
                    rew = rew.substr(8);
                }
                var minanz = 99999;
          
                for (var j = 0; j < ptArray[i][1].length; j++) {
                    if (ptArray[i][1][j][1] < minanz)
                        minanz = ptArray[i][1][j][1];
              
                }
             
                if (minanz == 0)
                    continue;
                for (var j = i; j < ptArray.length; j++)
                    for (var k = 0; k < ptArray[i][1].length; k++)
                        for (var kk = 0; kk < ptArray[j][1].length; kk++)
                            if (ptArray[i][1][k][0] == ptArray[j][1][kk][0]) {
                                ptArray[j][1][kk][1] -= minanz;
                                break;
                            }
           
                GM_xmlhttpRequest({
                    method: 'GET', url: 'http://' + window.location.hostname + '/pet/get_collection_reward/'+rew+"/"+minanz+"/"+special,
                    onload: function(responseDetails) {
                  ladeanzeiger.style.display="block"; aus()             
   document.getElementById("lader").innerHTML= '<br><font style="color:green ;font-size:211%;\">Punkte eingetauscht</font>';               
                      
                    }
                });
                        
                window.setTimeout("window.location.href = '" + location.toString() + "'", 2000);
                return;
            }
    }});
    return;
}
   break;
 }
 


 
 
