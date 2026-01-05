// ==UserScript==
// @name           Pennerwechsel (Pennergame 4.0)
// @namespace      pennerwechsel
// @author         by basti121o http://pennerhack.foren-city.de.  einfach pennernamen und passwort speichern und man kann mit einen klick den penner wechseln innerhalb einer stadt ohne sich andauernd ein und aus loggen zu muessen
// @include        *pennergame.de*
// @include        *menelgame.pl*
// @include        *dossergame.co.uk*
// @include        *clodogame.fr*
// @include        *mendigogame.es*
// @include        *serserionline.com*
// @include        *faveladogame.com*
// @include        *bomzhuj.ru*
// @include        *bumrise.com*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @grant          GM_registerMenuCommand
// @version        1.3.1 Erweiterungen für Atlantis und einige Verbesserungen
// @description Pennerwechsel
// @downloadURL https://update.greasyfork.org/scripts/1053/Pennerwechsel%20%28Pennergame%2040%29.user.js
// @updateURL https://update.greasyfork.org/scripts/1053/Pennerwechsel%20%28Pennergame%2040%29.meta.js
// ==/UserScript==

// Daten über das aktuelle Skript für den Update-Mechanismus
var THISSCRIPTNAME = "Pennerwechsel";
var THISSCRIPTVERSION = GM_info.script.version.split(" ")[0];
var THISSCRIPTINSTALL_URL = GM_info.script.namespace;
var THISSCRIPTSOURCE_URL = THISSCRIPTINSTALL_URL.replace('show', 'source'); // URL für Sourceseite bei userscripts.org
var THISSCRIPTID = THISSCRIPTINSTALL_URL.split("/").pop();
//
// @version        1.2.1 Vatikan hinzugefügt; an PG-Update angepasst
// @version        1.1.3 Einstellungsbox geändert
// @version        1.1.2 Malle hinzugefügt
// @version        1.1.1 Skript wieder zum Laufen gebracht

var search = new Array("berlin.pennergame", "muenchen.pennergame", "reloaded.pennergame",
"koeln.pennergame", "sylt.pennergame", "malle.pennergame", "vatikan.pennergame", "atlantis.pennergame", "pennergame",
"krakow.menelgame", "reloaded.menelgame", "menelgame", "dossergame",
"marseille.clodogame", "reloaded.clodogame", "clodogame",
"buenosaires.mendigogame", "reloaded.mendigogame", "mendigogame",
"serserionline", "sampa.faveladogame", "faveladogame", "bomzhuj", "bumrise");

var staedte = new Array("Berlin", "München", "Hamburg reloaded",
"Köln", "Sylt", "Malle", "Vatikan", "Atlantis", "Hamburg",
"Krakau", "Warschau reloaded", "Warschau", "London",
"Marseille", "Paris reloaded", "Paris",
"Buenos Aires", "Madrid reloaded", "Madrid",
"Istanbul", "Sao Paolo", "Rio de Janeiro", "Moskau", "New York");

var urls = new Array("http://www.berlin.pennergame.de", "http://www.muenchen.pennergame.de", "http://www.reloaded.pennergame.de",
"http://www.koeln.pennergame.de", "http://www.sylt.pennergame.de", "http://malle.pennergame.de", "http://vatikan.pennergame.de", "http://atlantis.pennergame.de", "http://www.pennergame.de",
"http://www.krakow.menelgame.pl", "http://www.reloaded.menelgame.pl", "http://www.menelgame.pl", "http://www.dossergame.co.uk",
"http://www.marseille.clodogame.fr", "http://www.reloaded.clodogame.fr", "http://www.clodogame.fr",
"http://buenosaires.mendigogame.com", "http://www.reloaded.mendigogame.es", "http://www.mendigogame.es",
"http://www.serserionline.com", "http://www.sampa.faveladogame.com", "http://www.faveladogame.com", "http://www.bomzhuj.ru",
"http://www.bumrise.com");

var staedte2 = new Array("Hamburg", "Berlin", "München", "Hamburg reloaded", "Köln", "Sylt", "Malle", "Vatikan", "Atlantis",
"Warschau", "Krakau", "Warschau reloaded", "London",
"Madrid", "Buenos Aires", "Madrid reloaded",
"Paris", "Marseille", "Paris reloaded",
"Istanbul", "Sao Paolo", "Rio de Janeiro", "Moskau", "New York");

// ***********************************************************************************************
// ***********************************************************************************************
// Funktion überprüft, ob die im GM-Key "keyname" gespeicherte Zeit länger als "interval"
// Minuten vorüber ist. Falls ja, wird true zurückgegeben und die neue Zeit gespeichert
// ***********************************************************************************************
// ***********************************************************************************************
function IsTimeToCheck(keyname, interval) {
    if ((Number(new Date()) - Number(GM_getValue(keyname, "0"))) / 1000 / 60 >= interval) {
        GM_setValue(keyname, Number(new Date()).toString());
        return true;
    } else {
        return false;
    }
}

// ***********************************************************************************************
// ***********************************************************************************************
// Funktion überprüft, ob es neue Skript-Versionen gibt (im Abstand von checkminutes)
// und zeigt im positiven Fall eine Meldung an.
// ***********************************************************************************************
// ***********************************************************************************************
function CheckForUpdate(checkminutes) {

    // Wenn wieder nach einem Update gesucht werden soll
    if (IsTimeToCheck("LastUpdateCheck", (checkminutes==0?1440:checkminutes))) {
        GM_log(new Date() + ": Es wird gecheckt!");

        // **********************************************************************************
        // *** GM_XMLHTTPREQUEST *** Abrufen der Skriptseite von userscripts.org
        // **********************************************************************************
        GM_xmlhttpRequest({method: 'GET',
            url: THISSCRIPTSOURCE_URL + ".meta.js",
            headers:{ "Accept":"text/javascript; charset=UTF-8" },
            overrideMimeType:"application/javascript; charset=UTF-8",
            onload:function(responseDetails) {
                // Wenn die Seite erfolgreich abgerufen werden konnte
                if (responseDetails.status == 200) {
                    var content = responseDetails.responseText;

                    // Ermitteln der Skriptversion
                    try {
                        var scriptversion = trimString(content.split("@version")[1]);
                    } catch (e) {
                        var scriptversion = "1.1.1";
                    }
                    var scriptfullversion = trimString(scriptversion.split("\n")[0]);
                    scriptversion = trimString(scriptversion.split(" ")[0]);

                    // Wenn dort eine neue Skriptversion vorliegt

                    var thisver = THISSCRIPTVERSION.split('.');
                    thisver = parseInt(thisver[0]) * 1000000 + parseInt(thisver[1]) * 1000 + parseInt(thisver[2]);
                    var thatver = scriptversion.split('.');
                    thatver = parseInt(thatver[0]) * 1000000 + parseInt(thatver[1]) * 1000 + parseInt(thatver[2]);

                    if (thisver < thatver) {
                        // Hinweistext ausgeben
                        alert("Es gibt eine neue Version für das Skript " + THISSCRIPTNAME + ": " + scriptfullversion);
                        // Seite mit dem neuen Skript laden, um eine Installation zu ermöglichen
                        window.location.href = THISSCRIPTSOURCE_URL+'.user.js';
                    }
                }
            }
        });
    }
}

// ***********************************************************************************************
// ***********************************************************************************************
// Entfernt Leerraum aus einen String (Anfang und Ende)
// ***********************************************************************************************
// ***********************************************************************************************
function trimString(s) {
    return s.replace(/^\s+|\s+$/g,'');
}

function weinkaufen () {
	var jojo ='<select name="welchestadta"><option value=""></option>';
	for (var i = 0; i < staedte2.length; i++)
		for (var j = 0; j < staedte.length; j++)
			if (staedte[j] == staedte2[i]) {
				jojo += '<option value=\"' + urls[j] + '\">' + staedte[j] + '</option>'
				break;
			}
	jojo += '</select>Pennername : <input type="text" name="pennernamen" value="">PennerPasswort : <input type="text" name="pennerpasswort" value=""><br>';

	document.getElementsByName("fenster")[0].innerHTML = ''
	+'<table width="80%" style="background-color:rgba(0,0,0,0.8); border-color:#000000; border:5px; border-style:groove; color:#ffffff " cellspacing="0"><tr>'
	+'<th colspan="4" style="border-bottom: 5px groove;">Settingbereich Pennerwechsler by basti1012</th></tr>'
	+'<tr><td colspan="2" style="border-bottom: 5px groove;">'
	+'<h2>Einlogdaten fuer ' + Stadt + '</h2>'
	+jojo
	+jojo
	+jojo
	+jojo
	+jojo
	+jojo
	+jojo
	+jojo
	+jojo
	+jojo
	+'<input type="button" name="datenspeichern" id="datenspeichern" value="Alle Eingaben speichern und schliessen" /><br>'
	+'<br><br><br>Automatisch ein- und ausloggen geht auch von einer Stadt in die andere.'
	+'</td></tr></table>';

	for(i=0;i<=9;i++){
			document.getElementsByName("welchestadta")[i].value = GM_getValue(stadt+"welchestadta"+i, GM_getValue("welchestadta"+i));
			document.getElementsByName("pennernamen")[i].value = GM_getValue(stadt+"namen"+i, GM_getValue("namen"+i));
			document.getElementsByName("pennerpasswort")[i].value = GM_getValue(stadt+"passwort"+i, GM_getValue("passwort"+i));
			if (document.getElementsByName("pennernamen")[i].value == "undefined" || document.getElementsByName("pennerpasswort")[i].value == "undefined") {
				document.getElementsByName("welchestadta")[i].value = "";
				document.getElementsByName("pennernamen")[i].value = "";
				document.getElementsByName("pennerpasswort")[i].value = "";
			}

	}
	document.getElementsByName('datenspeichern')[0].addEventListener('click', function save_spenden () {
			for(i=0;i<=9;i++){
				if (document.getElementsByName("welchestadta")[i].value != "" &&
					document.getElementsByName("pennernamen")[i].value != "" &&
					document.getElementsByName("pennerpasswort")[i].value != "") {
					GM_setValue(stadt+"welchestadta"+i, document.getElementsByName("welchestadta")[i].value);
					GM_setValue("welchestadta"+i, document.getElementsByName("welchestadta")[i].value);
					GM_setValue(stadt+"namen"+i, document.getElementsByName("pennernamen")[i].value);
					GM_setValue("namen"+i, document.getElementsByName("pennernamen")[i].value);
					GM_setValue(stadt+"passwort"+i, document.getElementsByName("pennerpasswort")[i].value);
					GM_setValue("passwort"+i, document.getElementsByName("pennerpasswort")[i].value);
				}
				else {
					GM_deleteValue(stadt+"welchestadta"+i);
					GM_deleteValue("welchestadta"+i);
					GM_deleteValue(stadt+"namen"+i);
					GM_deleteValue("namen"+i);
					GM_deleteValue(stadt+"passwort"+i);
					GM_deleteValue("passwort"+i);
				}
			}
			alert("alle Daten erfolgreich gespeichert")
			window.location.reload();
	},false);
	document.getElementsByName("fenster")[0].style.top = (window.pageYOffset + window.outerHeight - 820) + "px";
	document.getElementsByName("fenster")[0].style.display = 'inline';
	}
CheckForUpdate(1440);

var url = document.location.href;
for (var i = 0; i < search.length; i++)
    if (url.indexOf(search[i]) >= 0) {
        var link = urls[i];
        var Stadt = staedte[i];
        break;
    }

var stadt = Stadt.replace(" ", "_").replace("ö", "oe").replace("ü", "ue");
var neu = document.getElementsByTagName("body")[0];
var title = neu.innerHTML.split('href="/profil/id')[1].split('title="')[1].split('"')[0];
if (document.getElementsByClassName('zleft profile-data')[0].getElementsByClassName("user_name").length > 0)
    jo = document.getElementsByClassName('zleft profile-data')[0].getElementsByClassName("user_name")[0].innerHTML.split("</span")[0].split(">").pop();
else
    jo = neu.innerHTML.split(title+'">')[1].split('</a>')[0].split("</span")[0].split(">").pop();
//document.getElementById("xtra-nav").innerHTML = '<marquee><font style=\"color:blue; font-size:130%;\"><b>'+jo+'</b></font></marquee>';

SubmitButtonHTML = '<input type="button" name="allesswitsch" id="allesswitsch" value="Einstellungen" />';
var newp = document.createElement("tr");
newp.innerHTML = '<b><font color="white">'+THISSCRIPTNAME+'</font></b>&nbsp;';
var newli = document.createElement("li");
newli.style="position:relative; top:-13px; left:0px";
newli.appendChild(newp);
newli.innerHTML = newli.innerHTML + SubmitButtonHTML + "<br>";
var newdiv = document.createElement("div");
newdiv.id = "wechsel_optionen";
newdiv.setAttribute('name', "fenster");
newdiv.style.display = "none";
newdiv.style.position = "absolute";
newdiv.style.left = "15%";
newdiv.style.right = "0";
newdiv.style.bottom = "0";
newdiv.style.backgroundColor = "rgba(0,0,0,0.8)";
newdiv.style.zIndex = "10000000";
neu.appendChild(newdiv);
neu = document.getElementById("footer");
neu.appendChild(newli);

document.getElementsByName('allesswitsch')[0].addEventListener('click', weinkaufen, false);

GM_registerMenuCommand(THISSCRIPTNAME + ": Einstellungen", weinkaufen);

var bot1 = document.getElementById("nav-1");
if (!bot1)
    bot1 = document.getElementById("nav-2");
bot1.style.width="1000px";
var newp = document.createElement("li");
bot1.insertBefore(newp,bot1.firstChild);
if (document.getElementById("kk-button"))
    document.getElementById("kk-button").parentNode.removeChild(document.getElementById("kk-button"));
var options = "";
var sel = 0;
for (i = 0; i <= 9; i++) {
    var lnk = GM_getValue(stadt+"welchestadta"+i, GM_getValue("welchestadta"+i, link));
	j = urls.indexOf(lnk);
	if (j >= 0 && GM_getValue(stadt+"namen"+i, GM_getValue("namen"+i, "undefined")) != "undefined")
		options += '<option value=\"'+ i + '\">'+GM_getValue(stadt+"namen"+i, GM_getValue("namen"+i, "undefined"))+' ('+staedte[j]+')</option>';
	if (GM_getValue(stadt+"namen"+i, GM_getValue("namen"+i, "undefined")).toLowerCase() == jo.toLowerCase() && GM_getValue(stadt+"welchestadta"+i, GM_getValue("welchestadta"+i, link)) == link) {
		sel = i + 1;
		while (GM_getValue(stadt+"namen"+sel, GM_getValue("namen"+sel, "undefined")) == "undefined")
			if (sel == 9)
				sel = 0;
			else
				sel++;
	}
}
newp.innerHTML += '<center><select name=\"welchestadt\">' + options + '</select>'
        +'<input type="button" id="go"  name="go" value="Penner wechseln" ></center>' ;

document.getElementsByName('welchestadt')[0].value = sel;
document.getElementsByName('go')[0].addEventListener('click', function weinkaufen () {
                was = document.getElementsByName('welchestadt')[0].value;
                oeffnen(was)

                //window.location.href = was;
        },false);

function oeffnen(was){

       var myprof = document.getElementById("my-profile-new");
       if (!myprof)
           myprof = document.getElementById("my-profile");
       var input = myprof.getElementsByTagName("input");
       var logoutPar = "";
       if (input.length > 1)
           logoutPar = input[0].name + "=" + input[0].value;
                var welchestadt = GM_getValue(stadt+"welchestadta"+was)
                var pass = GM_getValue(stadt+"passwort"+was)
                var name = GM_getValue(stadt+"namen"+was)
                var rein = 'username='+name+'&password='+pass+'&city='+welchestadt+'%2Flogin%2Fcheck%2F&submitForm=Login';

        function login(stadt, daten) {
                GM_xmlhttpRequest({
                        method: 'POST',
                        url: ''+stadt+'/login/check/',
                        headers: {'Content-type': 'application/x-www-form-urlencoded'},
                        data: encodeURI(daten),
                        onload: function(responseDetails)
                             {
                                location.href = stadt+"/overview/";
                              }
                  });
        }

        if (logoutPar == "")
            GM_xmlhttpRequest({
                  method: 'GET',
                  url: ""+welchestadt+"/logout/",
                     onload: function( response ) {
                         login (welchestadt, rein);
                 }});
        else
            GM_xmlhttpRequest({
                  method: 'POST',
                  url: ""+welchestadt+"/logout/",
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                data: encodeURI(logoutPar),
                     onload: function( response ) {
                         login (welchestadt, rein);
                 }});

}
// copyright by basti1012
