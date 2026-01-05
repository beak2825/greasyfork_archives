// ==UserScript==
// @name           Spielaffe.de_ohne_Werbung
// @description    Für Spielaffe.de
// @namespace      spielaffe.de/
// @include        http://www.spielaffe.de/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @require        https://code.jquery.com/ui/1.8.20/jquery-ui.min.js
// @require        https://greasyfork.org/scripts/4382-gritter-f%C3%BCr-spielaffe/code/Gritter%20f%C3%BCr%20Spielaffe.js?version=14204
// @css            https://dl.dropboxusercontent.com/s/ba5hijihvmjgryr/spielaffe.de.user.css
// @css	          https://dl.dropboxusercontent.com/s/t5os830ecs71w0w/jquery.gritter.css
// @version        13
// @run-at         document-end
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getMetadata
// @downloadURL https://update.greasyfork.org/scripts/4014/Spielaffede_ohne_Werbung.user.js
// @updateURL https://update.greasyfork.org/scripts/4014/Spielaffede_ohne_Werbung.meta.js
// ==/UserScript==
var Spieleaffeversion = 13;

   Neuesupdatetagespruefung(); 

   Spieleliste();

   var advertiseflag = "";

      if (document.URL.substring(0,30) == "http://www.spielaffe.de/Spiel/")
      {
      advertiseflag = true;   
      }
      else
      {
      advertiseflag = false;   
      }

      if (GM_getValue("spielaffe_autowerbung") == true)
      {
         if (document.getElementsByClassName("intermediateContainer")[0] != undefined)
         {
         $('a:contains("Jetzt spielen")').trigger('click');
            
         alert("Das Spiel ist bereit.");
         }
      
      autowerbungan();

         if (advertiseflag)
         {
         $(document).ready(function()
         {
         $("a[title='Neu laden']").trigger('click');
         });   
         }
      }

      if (advertiseflag)
      {
      var Zeitdatei = new Zeit();
      Zeitjetzt = Zeitdatei.holeZeit();

      Spielcheck = new Spielfilter();
      Spieldateiseite = new Spielseitedatei();      
      var Spieldatei = Spiellisteverarbeitung();
      
      Box = document.createElement('input');
      Box.type = "checkbox";
      Box.value = "0";
      Box.id = "autowerbung";
      Box.checked = GM_getValue("spielaffe_autowerbung");
      Box.addEventListener("click", autowerbung, false);
      Boxtext = document.createElement('label');
      Boxtext.htmlFor="autowerbung";
    
         if (Box.checked)
         {
         Boxtext.id = "autowerbungtextangeschaltet";
         }
         else
         {
         Boxtext.id = "autowerbungtext";    
         }
 
      Boxtext.appendChild(Box);   
      Boxtext.appendChild(document.createTextNode('Werbung'));
      
      Spielaffebox_box = document.createElement('div');
      Spielaffebox_box.className = "Spielaffeboxknopfrahmen"; 
      Spielaffebox_box.id = "autowerbungrahmen";
      Spielaffebox_box.appendChild(Boxtext);    

      Vollbild = document.createElement("input");
      Vollbild.type = "button";
      Vollbild.value = "Volles Bild";
      Vollbild.id    = "Vollbildknopf";
      Vollbild.className = "Spielaffeboxknopfrahmen";
      Vollbild.addEventListener("click", vollesbild, false);
          
      Meinspiel = document.createElement('input');
      Meinspiel.type = "checkbox";
      Meinspiel.value = "0";
      Meinspiel.id = "Meinspielknopf";
      Meinspiel.checked = Spielcheck.sucheSpiel(Spieldatei.holeEintrag("Dateiliste"),$( '.gameTitle' ).find( 'h1' ).html());
      Meinspiel.addEventListener("click", Meinespielesetzung, false);
      Meinspieltext = document.createElement('label');
      Meinspieltext.id = "Meinspielknopftext";
      Meinspieltext.htmlFor="Meinspielknopf";
      Meinspieltext.appendChild(document.createTextNode('Mein Spiel'));
      Spielaffebox_meinspiel = document.createElement('div');
         
         if (Meinspiel.checked)
         {
         Spielaffebox_meinspiel.className = "Spielaffeboxspielrahmenmarkiert"; 
            
            if($('.subnavigationentry[title="' + $( '.gameTitle' ).find( 'h1' ).html() + '"] img').attr("src") == "")
            {
            Spielspeicherung ("Bildrefresh");
            Spieleliste();
            }
               
            window.onbeforeunload = function (e)
            {      
            Zeitende = Zeitdatei.holeZeit();
            Zeitende = Number(Zeitende) - Number(Zeitjetzt);

            Spielspeicherung("Zeit", Zeitende);
            };   
            
         Spielzeit = Zeitdatei.formatiereZeit(Spieldatei.holeEintrag("Dateizeit", -1, Spieldateiseite.holeEintrag("Name")));
         Spielname = Spieldateiseite.holeEintrag("Name");
         
            $.gritter.add(
            {
	         title: "So lange gespielt:",
	         text: Spielzeit,
	         image: "https://dl.dropboxusercontent.com/s/8f9z8ss1v1on8cq/alarm-clock-l.png",
	         sticky: false, 
	         time: 8000,
            });
         }
         else
         {
         Spielaffebox_meinspiel.className = "Spielaffeboxspielrahmen";          
         }
           
      Spielaffebox_meinspiel.id = "Meinspielrahmen";
      Spielaffebox_meinspiel.appendChild(Meinspiel);
      Spielaffebox_meinspiel.appendChild(Meinspieltext);   
          
      Neuesupdate = document.createElement('p');
      Neuesupdate.title = "Update";
      Neuesupdate.id = "Neuespdateknopf";
      Neuesupdate.appendChild(document.createTextNode('Update')); 

      Spielaffebox_Neuespdate = document.createElement('div');
      Spielaffebox_Neuespdate.className = "Spielaffeboxknopfrahmen"; 
      Spielaffebox_Neuespdate.id = "Neuesupdaterahmen";
      Spielaffebox_Neuespdate.appendChild(Neuesupdate);
      Spielaffebox_Neuespdate.addEventListener("click", Neuesupdatesetzung, false);
      Spielaffebox_links  = document.createElement('div');
      Spielaffebox_links.id = "Spielaffebox_linksrahmen";
         
      document.getElementsByClassName("footerRightContainer")[0].style.display="none";
      document.getElementsByClassName("footerLeftContainer")[0].style.display="none";
      document.getElementsByClassName("footerMiddleContainer")[0].style.marginLeft="08px";
      $(Spielaffebox_meinspiel).insertAfter( ".footerMiddleContainer" );
      $(Spielaffebox_box).insertAfter( ".footerMiddleContainer" );
      $(Spielaffebox_links).insertBefore( ".footerMiddleContainer" ); 
      document.getElementById("Spielaffebox_linksrahmen").appendChild(Spielaffebox_Neuespdate);   
      $(Vollbild).insertAfter( ".footerMiddleContainer" );
	  }
function Test (y)
{
alert(y);
var a = new Date();
var b = a.getTime();

var Test = Number(b) - Number(y);
Test = Test +  Number(GM_getValue("spielaffe_zeit",""));

GM_setValue("spielaffe_zeit",Test);
}
function autowerbungan()
{
   var Werbungen = [document.getElementById("app_advertising_pregame"),
   document.getElementById("app_advertising_pregame_ph"),
   document.getElementById("app_advertising_pregame_special"),
   document.getElementById("advertising_load_area"),
   document.getElementById("leaderboard_outer_container"),
   document.getElementById("leaderboard_top_outer_container"),
   document.getElementById("app_advertising_leaderboard_ph"),
   document.getElementById("app_advertising_leaderboard_top_ph"),
   document.getElementsByClassName("appTeaserBox")[0],
   document.getElementsByClassName("appTeaserBox")[1],
   document.getElementById("game_instruction_container"),
   document.getElementById("game_other_container"),
   document.getElementById("game_background_content"),
   document.getElementById("advertising_load_area"),
   document.getElementsByClassName("gameOutputBackgroundMobileHeader")[0],
   document.getElementsByClassName("gameOutputBackgroundMobileFooter")[0],
   document.getElementsByClassName("defaultContainer gameRightContainer")[0],
   document.getElementById("app_advertising_webbanner"),
   document.getElementsByClassName("linkBox")[0]];

      for (i = 0; i < Werbungen.length; i++) 
      {
         if (Werbungen[i] != undefined)
         {
         Werbungen[i].style.display="none";  
         }
      }
}

function autowerbung ()
{
   GM_setValue("spielaffe_autowerbung",document.getElementById("autowerbung").checked);
   
   window.location.reload();
}

function vollesbild ()
{
   var Spiel = "";
    
      if (document.getElementById("flash_game_1") != undefined)
      {
      Spiel = document.getElementById("flash_game_1");
      }
      else
      {
      Spiel = document.getElementById("flash_game_0");  
      }

 
   $(Spiel).addClass( 'Echtesvollbild');
  
      // Von Mozilla - Weil ich zu dumm bin
      // ** Für Firefox
      if (Spiel.mozRequestFullScreen) 
      {
      Spiel.mozRequestFullScreen();
      } 
      // ** Ganz normals
      if (Spiel.requestFullscreen) 
      {
      Spiel.requestFullscreen();
      } 
      // ** Für den Internet Explorer, glaube ich
      else if (Spiel.msRequestFullscreen) 
      {
      Spiel.msRequestFullscreen();
      } 
      // ** Für Google, glaube ich
      else if (Spiel.webkitRequestFullscreen) 
      {
      Spiel.webkitRequestFullscreen();
      }
}
// ### Teil - Spieleseite ###############################################################
// Objekte - Spieleliste ----------------------
function Spieleintrag (Spieltitel, Spiellink, Spielbild, Spielnummer)
{
   this.Spieltitel = Spieltitel;
   this.Spiellink = Spiellink;
   this.Spielbild = Spielbild;
   this.nummer = Spielnummer;
   var Spielliste = "\
	 <li id='" + Spielnummer + "'>\
	    <a href='" + Spiellink + "' title='" + Spieltitel + "' class='subnavigationentry'>\
			   <span class='icon naviSpriteSpan' id='Spiellisteganz'>\
			      <img src='" + Spielbild + "'>\
         </span>\
         <h3>" + Spieltitel + "</h3>\
			</a>\
	 </li>\
   ";
   
      this.holeEintrag = function ()
      {
      return Spielliste;
      }
}

function Spielfilter ()
{
   var Markierung = ["|", "#"];
   
      this.sucheSpiel = function (Eingabe, Spielname)
      {
      var Spielsuche = Eingabe.search(Spielname);
  
         if (Spielsuche == -1)
         {
         return false;   
         }
         else
         {
         return true;
         }         
      }
      
      this.loescheSpiel = function (Eingabe, Spielname)
      {
      return Eingabe.replace(Spielname, "");
      }
      
      this.setzeManuell = function (Spielliste)
      {
      var Spiellistetemp = "";
      Spiellistehier = Spielliste;
      Spiellistelaenge = Spielliste.length;      

         for (var e = 0; e < Spiellistelaenge; e++)
         {
            if (Number(e) == (Number(Spiellistelaenge) -1))
            {
            Markierungsnummer = 1;
            }
            else
            {
            Markierungsnummer = 0;
            }
            
         Spiellistetemp += Spiellistehier[e] + Markierung[Markierungsnummer];
         }
         
      return Spiellistetemp;
      }  
      
      this.teileManuell = function (Spielliste ,Option, Nummer)
      {
      Spiellistehier = Spielliste;

         switch(Option) 
            {
            case "Eintrag" :
               return Spiellistehier.split(Markierung[1]);
            break;
            case "Einzeln":
               return Spiellistehier.split(Markierung[0]);
            break;
           } 
      }   
      
}

function Spielelistebehaelter (Eingabe)
{
   var _Spieldatei = Eingabe;
   var _Spieldateiname = new Array();
   var _Spieldateiort = new Array();
   var _Spieldateibild = new Array();
   var _Spieldateinummer = new Array();
   var _Spieldateizeit = new Array();

      this.setzeEintrag = function (Datei, Option)
      {
         if(Array.isArray(Datei) == true)
         {         
         switch(Option) 
            {
            case "Dateiliste" :
               _Spieldatei = Datei;
            break;
            case "Dateiname":
               _Spieldateiname = Datei;
            break;
            case "Dateiort":
                _Spieldateiort = Datei;
            break;
            case "Dateibild":
               _Spieldateibild = Datei;
            break;
            case "Dateinummer":
               _Spieldateinummer = Datei;
            break;
            case "Dateizeit":
               _Spieldateizeit = Datei;
            break;
            }
         }
         else
         {
         getEintrag(Option).push(Datei);
         }
      }

      this.holeEintrag = function (Option, Nummer, Name)
      {
         if (Option == "Index")
         {
         return getIndex(Nummer);
         }
         else
         {
         Spiellistezwischen = getEintrag(Option); 
         }
         
         if (typeof(Nummer) === 'undefined')
         {
         return Spiellistezwischen;   
         }
		   else if (Nummer == '-1')
		   {
         return Spiellistezwischen[getIndex(Name)];
		   }
         else
         {
         return Spiellistezwischen[Nummer];   
         }
      }
      
      var getIndex = function (Eingabe)
      {
      return _Spieldateiname.indexOf(Eingabe);
      }

      this.loescheEintrag = function (Eingabe)
      {
      var Nummer = getIndex(Eingabe);
      
      _Spieldateiname.splice(Nummer, 1);
      _Spieldateiort.splice(Nummer, 1);
      _Spieldateibild.splice(Nummer, 1);
      _Spieldateinummer.splice(Nummer, 1);
      _Spieldateizeit.splice(Nummer, 1);
      }
      
      this.veraendereEintrag = function (Eingabename, Eingabewunsch, Eingabewert)
      {
      getEintrag(Eingabewunsch).splice(getIndex(Eingabename),1, Eingabewert);      
      }
      
      var getEintrag = function (Eingabe)
      {   
         switch(Eingabe) 
            {
            case "Dateiliste" :
               return Spiellistezwischen = _Spieldatei;
            break;
            case "Dateiname":
               return _Spieldateiname;
            break;
            case "Dateiort":
               return _Spieldateiort;
            break;
            case "Dateibild":
               return _Spieldateibild;
            break;
            case "Dateinummer":
               return _Spieldateinummer;
            break;
            case "Dateizeit":
               return _Spieldateizeit;
            break;
            }
      }
}

function Spiellistenordnung ()
{
   var Spielnummern = GM_getValue("spielaffe_listennummer","");
   
   this.Einschalten = function ()
   {
      $( '#Spiellistenummer' ).sortable(
      {
      axis: 'y',
      update:  function (event, ui) 
               {
               var data = $(this).sortable('toArray').toString();
                  
               GM_setValue("spielaffe_listennummer", data + ",");
               }
      });
   }
   
   this.Neusetzung = function ()
   {
   var data = $( '#Spiellistenummer' ).sortable('toArray').toString();
               GM_setValue("spielaffe_listennummer", data + ",");   
   }
   
   this.Loeschen = function (Eingabe)
   {

      if(Spielnummern.indexOf(Eingabe) != -1)
      {
      Spielnummern = Spielnummern.replace((Eingabe + ","), "");
         
         if (Spielnummern.length != 0)
         {      
         var Spielnummerhier = this.holeSpielnummern();

            for (h = 0; h < Spielnummerhier.length; h++)
            {
               if (Spielnummerhier[h] > Eingabe)
               { 
               Spielnummerhier[h] = Spielnummerhier[h] - 1; 
               }
            }
            
         Spielnummern = Spielnummerhier.toString(); 
         }
         else
         {
         Spielnummern = "";   
         }     

      this.Speichern();
      }
   }
   
   this.Speichern = function (Spielnummer)
   {
   var Spielnummerliste;   

      if (typeof(Spielnummer) === "undefined")
      {
      Spielnummerliste = Spielnummern;
      }
      else
      {
      Spielnummerliste = Spielnummern + Spielnummer;   
      }
      
      if(Spielnummerliste == "")
      {
      Komma = "";
      }
      else
      {
      Komma = ",";  
      }
    
   GM_setValue("spielaffe_listennummer", Spielnummerliste + Komma);
   }
   
   this.holeSpielnummern = function ()
   {
   Nummerhier = Spielnummern.substring(0, Spielnummern.length - 1);    
      
      if (Nummerhier != "")
      {
      Nummerhier = Nummerhier.split(",");
      }

   return Nummerhier;     
   }
   
}
// Objekte - Spieleliste ----------------------
// Objekte - Spielseite  ----------------------
function Knoepfe ()
{
   var Seitengestalt = new Array();
   
   Seitengestalt["Spielliste"] = "\
      <ul id='Meinespieleliste'>\
         <li class='more'><a id='Meinespielelistetext'>Meine<br>Spiele<span class='icon' id='Meinespielelistepfeil'></span></a>\
            <div class='subnavContainer'>\
	             <div class='bottom'>\
		              <ul class='subnavigation' id='Spiellistenummer'>\
		              </ul>\
	             </div>\
            </div>\
         </li>\
      </ul>\
      ";  
   
   var Sortierung = document.createElement('input');
   Sortierung.type = "checkbox";
   Sortierung.value = "0";
   Sortierung.id = "Sortierungknopf";
   Sortierung.checked = GM_getValue("spielaffe_sortierung", false);
   Sortierung.addEventListener("click", Spielesortierungsetzung, false);
   var Sortierungtext = document.createElement('label');
   Sortierungtext.id = "Sortierungknopftext";
   Sortierungtext.htmlFor="Sortierungknopf";
   Sortierungtext.appendChild(document.createTextNode('Sortierung'));   
   var Spielaffebox_sortierung = document.createElement('div');
      if (Sortierung.checked)
      {
      Spielaffebox_sortierung.className = "Spielaffeboxspielrahmenmarkiert"; 
      }
      else
      {
      Spielaffebox_sortierung.className = "Spielaffeboxspielrahmen";          
      }        
   Spielaffebox_sortierung.id = "Sortierungrahmen";
   Spielaffebox_sortierung.appendChild(Sortierung);
   Spielaffebox_sortierung.appendChild(Sortierungtext);    
   Seitengestalt["Sortierung"] = Spielaffebox_sortierung;  
   
   var Sortierloeschung = document.createElement('input');
   Sortierloeschung.type = "button";
   Sortierloeschung.value = "Fest";
   Sortierloeschung.id = "Sortierloeschungknopf";
   Sortierloeschung.className = "Spielaffeboxspielrahmen";
   Sortierloeschung.addEventListener("click", Fest, false);
   Seitengestalt["Sortierloeschung"] = Sortierloeschung;
   
   
      this.holeSeitenGestalt = function (Gestaltname)
      {
      return Seitengestalt[Gestaltname];  
      }
}

function Stilwechsler (Knopfname)
{
   this.Knopfname = Knopfname;

      this.setzeStil = function (Auswahl)
      {
      var Farbe = "";   
         
         if (Auswahl == "Grün")
         {
         Farbe = "Spielaffeboxspielrahmenmarkiert"; 
         }
         else if (Auswahl == "Rot")
         {
         Farbe = "Spielaffeboxspielrahmen";            
         }

      $(Knopfname).removeClass().addClass( "" );
      $(Knopfname).toggleClass(Farbe);   
      }   
}

function Spielseitedatei ()
{
   var Spiel = new Array(); 
   Spiel["Name"] = $( '.gameTitle' ).find( 'h1' ).html();
   Spiel["Ort"] = document.URL;
   Spiel["Bild"] = $( '.game__imageContainer img' ).attr( 'src' );
   Spiel["Nummer"] = $(".subnavigationentry[title='" + Spiel["Name"] + "']").closest("li").attr("id");

   this.holeEintrag = function (Eingabe)
   {
   return Spiel[Eingabe];
   }
}
// Objekte - Spielseite  ----------------------
// Objekte - Allgemein  -----------------------
function Spieleadressen () 
{
   
   var _update = new Array();
   var _datum = new Date();

   _update['Spielaffeupdateadresse'] = 'https://dl.dropboxusercontent.com/s/6qgvinngkv9qxsn/Spielaffeupdate.txt' ;
   _update['Spielaffeupdatehier'] = Spieleaffeversion ;
   _update['Datumheute'] = _datum.getDate() + "." + (Number(_datum.getMonth()) + 1) + "." + _datum.getFullYear();

      this.holeEintrag = function(Name) 
      {
      return _update[Name];
      }
}

function Sortierer (Liste)
{
   var _Sonderzeichen = ["Ä","Ae","Ö","Oe","Ü","Ue","ä","ae","ö","oe","ü","ue"];
   var _Liste = Liste;

      this.Sortiere = function ()
      {
      _Liste.sort();
      }
      
      this.Zeichenwandlung = function ()
      {
      var Sonderzeichenanzahl = _Sonderzeichen.length;
      var Listehier = mergeSplit(_Liste, "Join");
         
         for(g = 0; g < Sonderzeichenanzahl; g += 2)
         {
            if (Listehier.search(_Sonderzeichen[g]) != -1)
            {
            Listehier = ersetzeZeichen(Listehier, g, g+1);  
            }
            else if (Listehier.search(_Sonderzeichen[g+1]) != -1)
            {
            Listehier = ersetzeZeichen(Listehier, g+1,  g);   
            }
         }
     
      _Liste = mergeSplit(Listehier, "Split");
      }
      
      this.holeEintrag = function ()
      {
      return _Liste;  
      }
      
      this.setzeEintrag = function (Listennachtrag)
      {
      _Liste = Listennachtrag;
      }
      
      var ersetzeZeichen = function (Eingabe, Zeichennummer1, Zeichennummer2)
      {
      var Zeichen = [_Sonderzeichen[Zeichennummer1], _Sonderzeichen[Zeichennummer2]];    

      return Eingabe.replace(new RegExp(Zeichen[0], 'g'), Zeichen[1]);  
      }
      
      var mergeSplit = function (Listeneingabe, Auswahl)
      {
      Listehier = Listeneingabe;   
         
         if (Auswahl == "Split")
         {
         Listehier = Listeneingabe.split("|");
         }
         else if (Auswahl == "Join")
         {
            if (Array.isArray(Listeneingabe) == true)   
            {              
            Listehier = Listeneingabe.join("|");   
            }
         }
         
      return Listehier;      
      }      
}

function Zeit ()
{
   var Sekunden = 1000;
   var minute = 60 * 1000;
   var hour = minute * 60;
   
   this.holeZeit = function ()
   {
   return (new Date().getTime());
   }
   
   this.formatiereZeit = function (Eingabe, Option)
   {
   var Zeithier = "";
   
      switch(Option)
      {
         case "Sekunden":
         return getSekunden(Eingabe);
         break;
         case "Minuten":
         return getMinute(Eingabe);
         break;
         case "Stunden":
         return getStunde(Eingabe);
         break;
         default:
         var Stunde = getStunde(Eingabe);
         var Minute = getMinute(Eingabe);
         var Sekunde = getSekunden(Eingabe);
         Sekunde = Sekunde - 60 * Minute;  
         Minute = Minute - 60 * Stunde;
         
         var h = pruefeEine(Stunde);
         var m = pruefeEine(Minute);
         var s = pruefeEine(Sekunde);

            if (Stunde >= 1)
            {            
            return (Stunde + " Stunde" + h + ", " + Minute + " Minute" + m + " und " + Sekunde + " Sekunde" + s);
            }
            else if (Minute >= 1)
            {
            return (Minute + " Minute" + m + " und " + Sekunde + " Sekunde" + s);
            }
            {
            return (Sekunde + " Sekunde" + s); 
            }
         break;
      }
   
   return Zeithier;
   }
   
   var getMinute = function (Eingabe)
   {
   return Math.floor(Eingabe / minute);
   }
   
   var getStunde = function (Eingabe)
   {
   return Math.floor(Eingabe / hour);
   }
   
   var getSekunden = function (Eingabe)
   {
   return Math.floor(Eingabe / Sekunden);
   }
   
   var pruefeEine = function (Eingabe)
   {
      if (Eingabe == 1)
      {
      return ("");
      }
      else
      {
      return ("n");
      }
   }
   
}
// Objekte - Allgemein  -----------------------
// Funktionen - Spieleliste -------------------
function Meinespielesetzung ()
{ 
    var Farbwechsler = new Stilwechsler('#Meinspielrahmen');
   
   if ($( '#Meinspielknopf' ).attr( 'checked' ) == true)
   {
   Farbwechsler.setzeStil("Grün");

   Spielspeicherung ("Speichern");
   }
   else
   {
   Farbwechsler.setzeStil("Rot");      
      
   Spielspeicherung ("Löschen");
   }
   
   Spieleliste();   
}   

function Spielesortierungsetzung ()
{
   var Farbwechsler = new Stilwechsler('#Sortierungrahmen');
   
      if ($( '#Sortierungknopf' ).attr( 'checked' ) == true)
      {
      Farbwechsler.setzeStil("Grün");
      }
      else
      {
      Farbwechsler.setzeStil("Rot");
      }   
   
   GM_setValue("spielaffe_sortierung",$( '#Sortierungknopf' ).attr( 'checked' ));  
   
   Spieleliste();
}

function Spieleliste ()
{
   var Knoepfeauswahl = new Knoepfe();
   var Spieldateisortierung = GM_getValue("spielaffe_sortierung", false);
   var Spieldatei = Spiellisteverarbeitung ("Unaufbereitet");
   
   $( '#mainNavigation').attr("style","width: 790px");

      if (document.getElementById('Meinespieleliste') != null)
      {
      $( '#Meinespieleliste').remove();
      }

   $(Knoepfeauswahl.holeSeitenGestalt("Spielliste")).insertAfter( '.more:first' );
   document.getElementById("Meinespielelistetext").addEventListener("click", Fest, false);
   $(Knoepfeauswahl.holeSeitenGestalt("Sortierung")).insertAfter( '#Meinespieleliste .bottom' );
   $(Knoepfeauswahl.holeSeitenGestalt("Sortierloeschung")).insertAfter( '#Meinespieleliste .bottom' );
   
      if (Spieldatei.holeEintrag("Dateiliste") != "")
      {
      Spieldatei = Spiellisteverarbeitung ();  
      Spielordnung = new Spiellistenordnung(); 
      var Nummerliste = "";
      var Nummern = Spielordnung.holeSpielnummern();

         if (Spieldatei.holeEintrag("Dateiname").length == Nummern.length)
         {
         Nummerliste = Nummern;
         }
         else
         {
            for (h = 0; h < Spieldatei.holeEintrag("Dateiname").length; h++)
            {
            Nummerliste += h + ","; 
            }        
   
            if (Nummern != "")
            {

               for (m = 0; m < Nummern.length; m++)
               {
               Nummerersetzung = Nummern[m] + ",";
               Nummerliste = Nummerliste.replace(Nummerersetzung,"");   
               }
            
               Nummerliste = Nummern.toString() + "," + Nummerliste;
            }
            
         Nummerliste = Nummerliste.substring(0, Nummerliste.length - 1)
         Nummerliste = Nummerliste.split(",");   
         }                                                  
         
         if (Spieldateisortierung == true)
         {
         Spieldatei = Spiellisteverarbeitung ("Sortiert", Spieldatei, Nummerliste); 
         Nummerliste = Spieldatei.holeEintrag("Dateinummer");    
         }
         
         for (g = 0; g < Nummerliste.length; g++)
         {
            if (Spieldateisortierung != true)
            {
            Nummer = Nummerliste[g];
            }
            else
            {
            Nummer = g;
            }
            
         var Spielliste = new Spieleintrag(Spieldatei.holeEintrag("Dateiname", Nummer), Spieldatei.holeEintrag("Dateiort", Nummer),Spieldatei.holeEintrag("Dateibild", Nummer), Nummerliste[g]);  

         $("#Meinespieleliste .subnavigation").append(Spielliste.holeEintrag()); 
         }         
            if (Spieldateisortierung != true)
            {
            Spielordnung.Einschalten();
            Spielordnung.Neusetzung();
            }
      }
}

function Spiellisteverarbeitung (Option, Eingabe, Eingabenummer) 
{
   if(typeof(Eingabe) === 'undefined')
   {
   var Spieldatei = new Spielelistebehaelter(GM_getValue("spielaffe_speicherung"));
   var Spieldateinummern = new Spiellistenordnung();
   Spieldateinummern = Spieldateinummern.holeSpielnummern();
   }
   else
   {
   var Spieldatei = Eingabe;   
   }   
      switch (Option) 
      {
      case "Unaufbereitet":  
      break;
      case "Sortiert":
         var Spieldateiortneu = new Array();
         var Spieldateibildneu = new Array();
         var Spieldateinummerneu = new Array();
         var Spieldateizeit = new Array();
         var Sortierung = new Sortierer(Spieldatei.holeEintrag("Dateiname"));   

         Sortierung.Zeichenwandlung();   
         Sortierung.Sortiere();
         Sortierung.Zeichenwandlung();

         Spieldateinamesortiert = Sortierung.holeEintrag();  

            for (f = 0; f < Spieldateinamesortiert.length; f++)
            {
            Spieldateiortneu[f] = Spieldatei.holeEintrag("Dateiort", [Spieldatei.holeEintrag("Dateiname").indexOf(Spieldateinamesortiert[f])]);            
            Spieldateibildneu[f] = Spieldatei.holeEintrag("Dateibild", [Spieldatei.holeEintrag("Dateiname").indexOf(Spieldateinamesortiert[f])]);                        
     
            if (Eingabenummer != "")
               {
               Spieldateinummerneu[f] = Spieldatei.holeEintrag("Dateinummer", [Spieldatei.holeEintrag("Dateiname").indexOf(Spieldateinamesortiert[f])]);                       
               }
            }

         Spieldatei.setzeEintrag(Spieldateinamesortiert, "Dateiname");
         Spieldatei.setzeEintrag(Spieldateiortneu, "Dateiort");
         Spieldatei.setzeEintrag(Spieldateibildneu, "Dateibild"); 
         Spieldatei.setzeEintrag(Spieldateinummerneu, "Dateinummer"); 
      break;
      case "Listenzusammensetzung":
         var Gespeichertespiele = new Spielfilter();  
         var Zwischenlistefertig = "";

            for (a = 0; a < Spieldatei.holeEintrag("Dateiname").length; a++)
            {
            Zwischenliste = [ Spieldatei.holeEintrag("Dateiname", a),
            Spieldatei.holeEintrag("Dateiort", a),
            Spieldatei.holeEintrag("Dateibild", a),
            Spieldatei.holeEintrag("Dateizeit", a)];

            Zwischenlistefertig += Gespeichertespiele.setzeManuell(Zwischenliste);
            }
            
         Spieldatei = Zwischenlistefertig;
      break;
      default:
         var Gespeichertespiele = new Spielfilter(); 

         var Spielliste = Gespeichertespiele.teileManuell(Spieldatei.holeEintrag("Dateiliste"),"Eintrag");
   
            for ( a = 0; a < (Spielliste.length - 1); a++)
            {
            Spieldateizwischen = Gespeichertespiele.teileManuell(Spielliste[a],"Einzeln",a);

            Spieldatei.setzeEintrag(Spieldateizwischen[0],"Dateiname");
            Spieldatei.setzeEintrag(Spieldateizwischen[1],"Dateiort"); 
            
               if (typeof(Spieldateizwischen[2]) === 'undefined')
               {
               Spieldatei.setzeEintrag("","Dateibild");               
               }
               else
               {
               Spieldatei.setzeEintrag(Spieldateizwischen[2],"Dateibild");
               }
               if (typeof(Spieldateizwischen[3]) === 'undefined')   
               {
               Spieldatei.setzeEintrag("0","Dateizeit");
               }
               else
               {
               Spieldatei.setzeEintrag(Spieldateizwischen[3],"Dateizeit"); 
               }
               
            Spieldatei.setzeEintrag(a,"Dateinummer");     
            }
      }
   
   return Spieldatei; 
}

function Spielspeicherung (Options, Zeitamende)
{
   var Spieldatei = Spiellisteverarbeitung();
   var Spiellistenreihenfolge = new Spiellistenordnung();
   var Spieldateiseite = new Spielseitedatei();

      switch (Options) 
      {
      case "Speichern":
      Spieldatei.setzeEintrag(Spieldateiseite.holeEintrag("Name"), "Dateiname");
      Spieldatei.setzeEintrag(Spieldateiseite.holeEintrag("Ort"), "Dateiort");
      Spieldatei.setzeEintrag(Spieldateiseite.holeEintrag("Bild"), "Dateibild"); 
      Spieldatei.setzeEintrag((Number(Spieldatei.holeEintrag("Dateiname").length) - 1), "Dateinummer"); 
      Spieldatei.setzeEintrag("0", "Dateizeit"); 
      
      Spiellistenreihenfolge.Speichern(Spieldatei.holeEintrag("Dateinummer", -1, Spieldateiseite.holeEintrag("Name")));
      break;
      case "Löschen":
      Spiellistenreihenfolge.Loeschen(Spieldatei.holeEintrag("Index", Spieldateiseite.holeEintrag("Name")));
	   Spieldatei.loescheEintrag(Spieldateiseite.holeEintrag("Name"));
     
      break;
      case "Bildrefresh":
      Spieldatei.veraendereEintrag(Spieldateiseite.holeEintrag("Name"), "Dateibild", Spieldateiseite.holeEintrag("Bild"));
      break; 
      case "Zeit":
      Spieldatei.veraendereEintrag(Spieldateiseite.holeEintrag("Name"), "Dateizeit", Number(Spieldatei.holeEintrag("Dateizeit", -1, Spieldateiseite.holeEintrag("Name"))) + Number(Zeitamende));       
      break;     
      }

   GM_setValue("spielaffe_speicherung",Spiellisteverarbeitung("Listenzusammensetzung",Spieldatei));   
}

function Spielesortierungsloeschung ()
{
   GM_setValue("spielaffe_listennummer", "");
   
   Spieleliste();
}

function Fest ()
{
   var Farbwechsler = new Stilwechsler('#Sortierloeschungknopf');

   if ($( '#Meinespieleliste .more .subnavContainer' ).attr( 'class') == "subnavContainer")
   {
   $( '#Meinespieleliste .more .subnavContainer' ).addClass( "subnavContainer2" );
   
   Farbwechsler.setzeStil("Grün");
   }
   else
   {
   $( '#Meinespieleliste .more .subnavContainer' ).removeClass( "subnavContainer2" );  
   
   Farbwechsler.setzeStil("Rot");
   }
}
// Funktionen - Spieleliste -------------------
// Funktionen - Spielseite --------------------
function Neuesupdatesetzung ()
{
   var Pruefung = new Spieleadressen();
   var Pruefunghier = Neuesupdateueberpruefung(Pruefung.holeEintrag("Spielaffeupdateadresse"), Pruefung.holeEintrag("Spielaffeupdatehier"));
   if ( Pruefunghier == false)
   {
   alert("Es ist kein neues Update vorhanden.");
   }
   else
   {
   alert("Es ist ein neues Update da: " + Pruefunghier);
   
   $(location).attr('href',"https://greasyfork.org/scripts/4014-spielaffe-de-ohne-werbung/code/Spielaffede_ohne_Werbung.user.js"); 
   }

}

function Neuesupdatetagespruefung ()
{
   var Pruefung = new Spieleadressen();
   var Datumheute = Pruefung.holeEintrag("Datumheute");
   var Updatedatum = GM_getValue("spielaffe_updatedatum", false);

      if (Updatedatum != Datumheute)
      {
      var Updatetext = "Es ist ein neues Update verfügbar: ";
      var Updatetext2 = "\nBitte drücken Sie auf den Update-Knopf bei den Spielen.";	

      var Updateheute = Neuesupdateueberpruefung(Pruefung.holeEintrag("Spielaffeupdateadresse"), Pruefung.holeEintrag("Spielaffeupdatehier"));

         if (Updateheute == false)
         {

         }
         else
         {
         alert(Updatetext + Updateheute + Updatetext2);		 
         }
     
      GM_setValue("spielaffe_updatedatum", Datumheute);   
      }  

}

function Neuesupdateueberpruefung (Adresse, Updatehier, Text)
{
   var result = null;

      $.ajax(
      {
        url: Adresse,
         type: 'get',
         dataType: 'html',
         async: false,
         success: function(data) 
                  {
                  result = data;
                  } 
      });

      if (result == Updatehier)
      {
      return false;
      }
      else
      {
      return result; 
      } 
}
// Funktionen - Spielseite --------------------
// ### Teil - Spieleseite ###############################################################