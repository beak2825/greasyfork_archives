// ==UserScript==
// @name           Pfandflaschensammler
// @namespace      http://userscripts.org/scripts/show/85124
// @author         lmk (wieder lauffaehig gemacht und erweitert von We1hnachtsmann)
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright      (c) 2009, lmk.
// @description    Nach beendetem Pfandflaschensammeln wird ein Hinweis auf der zuletzt geoeffneten Seite ausgegeben und es kann zur Pfandflaschensammelseite weitergeleitet werden
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_log
// @grant          GM_registerMenuCommand
// @grant          GM_setClipboard
// @include        *4everproxy.com*
// @include        http://*.pennergame.de/*
// @include        http://pennergame.de/*
// @include        https://*.pennergame.de/*
// @include        https://pennergame.de/*
// @include        http://*.dossergame.co.uk/*
// @include        http://dossergame.co.uk/*
// @include        http://*.menelgame.pl/*
// @include        http://menelgame.pl/*
// @include        http://*.bumrise.com/*
// @include        http://bumrise.com/*
// @include        http://*.clodogame.fr/*
// @include        http://clodogame.fr/*
// @include        http://*.mendigogame.es/*
// @include        http://mendigogame.es/*
// @include        http://*.mendigogame.com/*
// @include        http://mendigogame.com/*
// @include        http://*.faveladogame.com/*
// @include        http://faveladogame.com/*
// @include        http://*.bomzhuj.ru/*
// @include        http://bomzhuj.ru/*
// @exclude        http://*board.pennergame.de/*
// @exclude        http://mobile.pennergame.de/*
// @version        2.9.14 Proxy für Spendensammler geändert
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/1049/Pfandflaschensammler.user.js
// @updateURL https://update.greasyfork.org/scripts/1049/Pfandflaschensammler.meta.js
// ==/UserScript==

// @version        2.9.13 Tagesaufgabe Verbrechen/Sünde/Sabotage funktionierte nicht mehr
// @version        2.9.12 Abfrage auf Spendenserver nur, wenn auch Spenden gesammelt werden
// @version        2.9.11 alternativen Spendenserver eingebaut; kleinere Korrekturen
// @version        2.9.10 Fehler beim Geschenkabholen behoben
// @version        2.9.9 Spenden wurden nicht mehr gesammelt
// @version        2.9.8 Umstellung auf https und viele kleine Korrekturen
// @version        2.9.7 kleine Korrekturen; Geschenke abholen verbessert
// @version        2.9.6 kleine Korrekturen
// @version        2.9.5 viele kleine Fehler behoben; diverse Erweiterungen, z.T. noch im Test
// @version        2.9.4 Tagesaufgabe Verbrechen korrigiert; Fehler bei Spendenholen behoben
// @version        2.9.3 Tagesaufgabe Sabotage in Atlantis korrigiert
// @version        2.9.2 weitere Anpassungen für Atlantis (Tagesaufgaben)
// @version        2.9.1 Anpassungen Atlantis
// @version        2.8.31 Geld wurde zu oft in Bandenkasse eingezahlt
// @version        2.8.30 Korrektur Geld abholen
// @version        2.8.29 Korrektur Flaschensammeln und Verbrechen
// @version        2.8.28 Boxen beim Flaschensammeln verlegt; Start von Verbrechen korrigiert
// @version        2.8.27 Weitere Korrekturen Flaschen sammeln und Spenden; Standorte um Missionsplunder erweitert
// @version        2.8.26 Korrekturen Flaschen sammeln und Spenden; Einstellungen sichern und wiederherstellen
// @version        2.8.25.1 Korrekturen Stadtteil-/Gebietsvorwahl; Heimatstandort wählbar; Hotfix: Spenden
// @version        2.8.25 Korrekturen Stadtteil-/Gebietsvorwahl; Heimatstandort wählbar
// @version        2.8.24 Stadtteil-/Gebietsvorwahl bei Flaschensammeln
// @version        2.8.23 Korrekturen Weihnachtsbäckerei
// @version        2.8.22 Korrekturen/Verbesserungen Weihnachtsbäckerei
// @version        2.8.21 Erweiterungen für Weihnachtsbäckerei
// @version        2.8.20 Verbesserung Minispiel Memory und Tagesaufgabe Shoutbox
// @version        2.8.19 Erweiterung um Minispiel Memory
// @version        2.8.18 Spielsteuerung korrigiert; Fehler bei Spendenholen behoben
// @version        2.8.17 Fehler bei TA "Lose kaufen" behoben; Minigame Globbi
// @version        2.8.16 Spenden holen funktionierte nicht mehr richtig
// @version        2.8.15 alles kaufen im Plundershop
// @version        2.8.14 Einkauf im Plundershop
// @version        2.8.13 Umstellung Losekauf
// @version        2.8.12 Korrekturen für Brezngaudi
// @version        2.8.11 Korrekturen für Minispiele; Brezngaudi
// @version        2.8.10 Korrekturen für Breznjagd und Spenden holen; Hendlbraterei
// @version        2.8.9  kleine Korrektur für Breznjagd
// @version        2.8.8  Korrekturen für Eventspiel und Spenden holen
// @version        2.8.7  Anpassungen für Mini-Spiel "Stramme Schenkel"; Fehler korrigiert
// @version        2.8.6  Anpassungen für neue Eventplundereinteilung
// @version        2.8.5  Fehler bei Spenden holen behoben
// @version        2.8.4  Korrekturen; Spenden holen über spenden.hitfaker.net
// @version        2.8.3  Probleme mit Spielen, Spenden und Bandenfinanzen behoben
// @version        2.8.2  weitere Korrektur nach PG-Update; Probleme mit Spielen und Spenden behoben
// @version        2.8.1  Anpassungen ans neue Profil-Design
// @version        2.7.4  "Freche Früchtchen": Korrekturen und Liste mit gefundenen Gegenständen
// @version        2.7.3  Fehler bei TA behoben; Spiele "Freche Früchtchen" und "Eiswürfelspiel" neu
// @version        2.7.2  Spiele "Freche Früchtchen" und "Eiswürfelspiel" auf Wunsch automatisch
// @version        2.7.1  Anpassungen wegen des neuen Bildungsslots
// @version        2.6.12 Korrektur Geld in Bandenkasse einzahlen
// @version        2.6.11 keine Texte bei Geldeinzahlung; Korrekturen bei TA
// @version        2.6.10 Korrektur TA Flaschen sammeln
// @version        2.6.9  Korrektur Flaschen verkaufen; ggf. Seife bei TA "100% sauber" benutzen
// @version        2.6.8  Korrektur TA Lose kaufen; Wut/WiWu-abhängiger Plunderwechsel
// @version        2.6.7  automatischer Flaschenverkauf im Vatikan funktionierte nicht mehr
// @version        2.6.6  weitere Korrekturen an Tagesaufgaben
// @version        2.6.5  kleine Korrekturen
// @version        2.6.4  Plunder für Eigentumupgrades nicht verschrotten, wenn er noch benötigt wird.
// @version        2.6.3  Anpassungen für Mini-Spiel "Zecken für Ecken"
// @version        2.6.2  Kleine Anpassungen für Missionsplunder; Probleme mit Fußballspiel behoben
// @version        2.6.1  Erweiterung Erledigung Tägliche Aufgabe und Mini-Spiel "Umkleidekabine"
// @version        2.5.16 Erweiterung für Mini-Spiel "Russisch Roulette"
// @version        2.5.15 Abschalten des Mini-Spiels "Russisch Roulette"
// @version        2.5.14 Anpassungen für Mini-Spiel "Eierklau 2015"
// @version        2.5.13 Mini-Spiel "Osterfeuer 2015"
// @version        2.5.12 Spenden holen
// @version        2.5.11 Kamellen suchen
// @version        2.5.10 Unnötige Aufrufe der Eventseite abgestellt
// @version        2.5.9  Automatik funktionierte nicht mehr
// @version        2.5.8  Probleme mit Event-Seite behoben
// @version        2.5.7  Vatikan: Flaschenverkauf bei Überschreiten eines maximalen Füllgrads
// @version        2.5.6  Adventsspiel: Plätzchenklau, Korrektur
// @version        2.5.5  Adventsspiel: Plätzchenklau
// @version        2.5.4  Fehler bei Erkennung eines vorhandenen Updates behoben
// @version        2.5.3  Erkennung des beendeten Minigames fehlerhaft; Sammelmarken einlösen
// @version        2.5.2  automatischer Aufruf der Event-Seite falls nötig
// @version        2.5.1  erste Version Vatikan und neues Rentier-Spiel
// @version        2.4.3  Korrekturen; Gehalt automatisch abholen
// @version        2.4.2  Erweiterungen und Korrekturen für Eckfahnenspiel 2014
// @version        2.4.1  Wechsel auf greasyfork.org; Verbrechensstart erweitert
// @version        2.3.34 Anpassungen für Sommergame 2014 (Zollbeamter)
// @version        2.3.33 noch eine Korrektur zu Anpassungen für Ostergame 2014
// @version        2.3.32 Korrektur zu Anpassungen für Ostergame 2014
// @version        2.3.31 Anpassungen für Ostergame 2014
// @version        2.3.30 Fehler bei Anpassung an neues Karnevalgame behoben
// @version        2.3.29 Anpassung an neues Karnevalgame
// @version        2.3.28 kleine Korrektur: bei automatischen Verbrechen kam u.U. eine Abfrage
// @version        2.3.27 2. Korrektur zu Anpassungen an Xmas-Minigame 2013
// @version        2.3.26 Korrektur zu Anpassungen an Xmas-Minigame 2013
// @version        2.3.25 Anpassungen an Xmas-Minigame 2013
// @version        2.3.24 Skript lief nicht mehr richtig
// @version        2.3.23 Checkbox auf Login-Seite fehlte
// @version        2.3.22 Fehler im letzten Update behoben
// @version        2.3.21 Anpassung wegen anderen Aufbaus der Counter; Beseitigung von Fehlermeldungen
// @version        2.3.20 Erweiterung um Minispiel Piratenschatz
// @version        2.3.19 Erweiterung um Minispiel Zollkontrolle
// @version        2.3.18 Erweiterung um Kofferpackspiel
// @version        2.3.17 kein automatisches Wiedereinloggen, wenn explizit ausgeloggt wurde
// @version        2.3.16 automatisches Wiedereinloggen
// @version        2.3.15 Korrektur wegen Stadtfeind
// @version        2.3.14 Testmeldung entfernt
// @version        2.3.13 kleinere Erweiterungen; Reparatur nach Totalausfall
// @version        2.3.12 Korrektur wegen Stadtfeind
// @version        2.3.11 noch einmal Updateverfahren korrigiert
// @version        $Id: pfandflaschensammler.user.js 209 2020-07-04 18:29:35Z mkl $

if (!String.prototype.endsWith)
    String.prototype.endsWith = function(str) {
        return (this.substr(-str.length) == str);
    };

if (!String.prototype.startsWith)
    String.prototype.startsWith = function(str) {
        return (this.indexOf(str) == 0);
    };

GM_deleteValue("proxysitelink");
GM_deleteValue("proxysitehost");
var host = window.location.hostname;
if (host.endsWith("4everproxy.com")) {
    host = GM_getValue("4everproxyhost", "").split(";")[0].split("/").pop();
}
else {
    if (host.startsWith("change."))
        host = "www" + host.substr(6);
//    if (host.indexOf("pennergame") != -1 && !document.getElementById("content"))
//        alert("Fehler host=" + window.location.hostname);
    if (GM_getValue("4everproxyhost", "xxx").split(";")[0].endsWith(host))
        window.location.href = "https://www.4everproxy.com";
}

/* Automatic click on "start collecting" | Automatischer Klick auf "Sammeln" */
var autoSubmit = true; //false;

/* Alert messages */
var msgAttackEnemy = "Es wurde ein Angriff auf den Stadtfeind Nr. 1 gestartet. Seite aktualisieren ?";
var pflaschen = "Pfandflaschen";
var flaschentxt = "Flaschen";
var crimetxt = "Verbrechen";

/* Captcha select title*/
var strTime = "Zeit: ";  // "Time: ";

var intervalTime = 4000;
var done = " -/-"; // text after counter reached 0:00
var done0 = "00:00"; // alternative text after counter reached 0:00
var latestDTtime = "23:30"; // latest time for daily task
var time = String(new Date().getTime());
var counter = done;
var fcounter = done;
var crime = false;
var nameTime = "time";
var nameLastCollectTime = "LastCollectTime";
var checkInterval;
var tracelevel = 0;
var tracing = 0;
var traceln = 0;
var hltraceln = 0;
var maxtraceln = 200;
var maxhltraceln = 200;
var missionContent = "";
var overviewcontent = "";
var maxFass = 0;
var myATT = 0;
var myDEF = 0;
var nitroCount = 0;
var THISSCRIPTVERSION = GM_info.script.version.match(/[\d\.]*/)[0];
var THISSCRIPTNAME = GM_info.script.name;
var THISSCRIPTINSTALL_URLGF = "https://greasyfork.org/de/scripts/1049-pfandflaschensammler";
var AUTHOR = GM_info.scriptMetaStr.split("@author")[1].split("\n")[0].split(" ").pop().split(")")[0].trim().toLowerCase();
var varCache = [];
var valCache = [];
var freevars = [];
var updDFcount = 0;
//GM_setValue("expertMode", 1);
var expertMode = GM_getValue("expertMode", 0);

function fallback(ms, href) {
    if (typeof(ms) == "number") {
        if (fallbackTO != 0)
            window.clearTimeout(fallbackTO);
        fallbackTO = 0;
        if (ms > 0) {
            trace("setze Timeout auf " + href + " (" + ms/1000 + " Sek)", 5);
            fallbackTO = setTimeout(fallback, ms, href);
        }
        else
            trace("fallback gelöscht", 5);
    }
    else {
        trace("Fallback Timeout: " + ms, 1);
        window.location.href = ms;
    }
    return;
}

var fallbackTO = 0;
var m_ownuserid = GM_getValue("lastuserid_" + host, "0:").split(":")[0];
var m_ownusername;
var TOWNEXTENSION = GM_getValue("lastuserid_" + host, ":"+host).split(":")[1];
var prothost = window.location.protocol + '//' + host;
tracelevel = PGu_getValue("tracelevel", tracelevel);
traceln = Number(PGu_getValue("callnr", "0"));
if (traceln <= 0)
    traceln = 1;
hltraceln = Number(PGu_getValue("hlcallnr", "0"));
if (hltraceln <= 0)
    hltraceln = 1;
fallback(60000, prothost + '/overview/');
trace("Pfandflaschensammler gestartet: " + m_ownuserid + "/" + TOWNEXTENSION + "/" + window.location.pathname, 2);
if (PG_getValue("spendensammler", "xxx") == "xxx")
    PG_setValue("spendensammler", "4everproxy");


if(window.location.hostname.endsWith("4everproxy.com")){
    var hhost = GM_getValue("4everproxyhost", "").split(";")[0];
    if (window.location.pathname.indexOf("secure") != -1) {
        var content = document.getElementById("content").innerHTML;
        while (content.indexOf("schon genug Spenden") == -1) {
            var so = document.getElementsByName("selip")[0];
            var anz = so.innerHTML.split("<option").length-1;
            if (so.selectedIndex + 1 == anz)
                so.selectedIndex = 0;
            else
                so.selectedIndex = so.selectedIndex + 1;
            document.getElementById("foreverproxy-submit").click();
            return;
        }
        GM_deleteValue("4everproxylink");
        GM_deleteValue("4everproxyhost");
        window.location.href = document.getElementById("foreverproxy-u").value.replace("//change", "//www").replace(/\/change_.*/, "/overview/");
        return;
    }
    var don = GM_getValue("4everproxylink", "");
    if (don != "") {
        trace("Spendenlink: " + don, 2);
        don = don.split(";").pop();
        document.getElementsByName("u")[0].value = don;
        document.getElementById("server_name").value = "de";
        document.getElementById("content").getElementsByClassName("button-secondary")[0].click();
        return;
    }
}
else if (document.getElementsByName("language").length != 0) {
    if (expertMode) {
        PGu_delete("calls");
        GM_registerMenuCommand(THISSCRIPTNAME + ": Logging " + (PGu_getValue("logging", 0)?"aus":"ein") + "schalten", function () {PGu_setValue("logging", 1 - PGu_getValue("logging", 0)); window.location.href = window.location.href;});
        GM_registerMenuCommand(THISSCRIPTNAME + ": Tracelevel setzen (" + (tracelevel==0?"aus":tracelevel) + ")", function () {
            var tl = prompt("Bitte Tracelevel eingeben (0-9): ");
            if (tl != null)
                if (tl < 0 || tl > 9)
                    alert("Wert nicht erlaubt!!");
                else {
                    tracelevel = 1;
                    trace("Tracelevel gesetzt: " + tl, 1);
                    tracelevel = tl;
                    PGu_setValue("tracelevel", tracelevel);
                }
        });
        function showTrace(call, maxcall) {
            var callnr = Number(PGu_getValue(call + "nr", "0"));
            var calls = [];
            for (var i = callnr - 1; i != callnr; (i <= 1 ? i = maxcall : i--)) {
                var txt = PGu_getValue(call + i, "");
                if (txt == "")
                    break;
                calls.push(txt);
            }
            alert(calls.join("\n"));
        }
        if (PGu_getValue("callnr", "0") != "0")
            GM_registerMenuCommand(THISSCRIPTNAME + ": Trace anzeigen", function () {
                showTrace("call", maxtraceln);
            });
        if (PGu_getValue("hlcallnr", "0") != "0")
            GM_registerMenuCommand(THISSCRIPTNAME + ": Highlevel-Trace anzeigen", function () {
                showTrace("hlcall", maxhltraceln);
            });
        GM_registerMenuCommand(THISSCRIPTNAME + ": Variable(n) anzeigen", function () {
            var name = prompt("Bitte Namen der Variablen eingeben: ");
            if (name != null) {
                var gm_vars = GM_listValues();
                for (var i = 0; i < gm_vars.length; i++)
                    if (gm_vars[i].match(new RegExp('.*'+name+'.*', "i")))
                        alert(gm_vars[i] + ": " + GM_getValue(gm_vars[i], "<null>"));
            }
            });
        GM_registerMenuCommand(THISSCRIPTNAME + ": Haustierautomatik " + (PGu_getValue("AutoPet", false)?"aus":"ein") + "schalten", function () {
            PGu_setValue("AutoPet", !PGu_getValue("AutoPet", false));
            window.location.href = window.location.href;
        });
    }
    var language = document.getElementsByName("language")[0].content;
    trace("Language: " + language, 2);
    // Version ermitteln
    var oldVersion = 1;
    if (!document.getElementById("login")) {
        if (GM_getValue("ErrorCounter_" + host, "").length > 10)
            GM_setValue("ErrorCounter_" + host, 0);
        GM_setValue("ErrorCounter_" + host, GM_getValue("ErrorCounter_" + host, 0) + 1);
        oldVersion = 0;
        trace("Fehler, reload in 10 Sekunden", 1);
        setTimeout(reload, 10000, "main");
    }
    else
        doTheAction();
}
else if (host.startsWith("malle")) {
    var today = new Date();
    var wait = 10;
    var rundenende = Number(PG_getValue("rundenende", "0"));
    if (Number(today.getTime()) > rundenende + 86400000)
        wait = Math.min((18-today.getHours())*3600-today.getMinutes()*60-today.getSeconds(), 3600);
    else if (Number(today.getTime()) > rundenende)
        wait = 3600;
    setTimeout(reload, wait*1000, "mallewait");
}
else {
    if (GM_getValue("ErrorCounter_" + host, "").length > 10)
        GM_setValue("ErrorCounter_" + host, 0);
    GM_setValue("ErrorCounter_" + host, GM_getValue("ErrorCounter_" + host, 0) + 1);
    trace("Fehler, reload in 10 Sekunden", 1);
    setTimeout(reload, 10000, "main");
}

// **********************************************************************************
// **********************************************************************************
// Funktion extrahiert die eigene UserID
// **********************************************************************************
// **********************************************************************************
function getOwnUserID() {
    // Eigene UserID ermitteln
    var myprof = document.getElementById("my-profile-new");
    if (!myprof)
        myprof = document.getElementById("my-profile");
    var ownuserid = myprof.innerHTML.split('href="/profil/id:')[1].split('/"')[0];
    GM_setValue("lastuserid_" + host, ownuserid + ":" + TOWNEXTENSION);

    return ownuserid;
}

// Logging
function PG_log(string, tlevel) {
    if (typeof(tlevel) == "undefined")
        tlevel = 9;
    trace(string, tlevel);
    if (PGu_getValue("logging", 0) == 0)
        return;
    var now = new Date();
    GM_log(FormatDateTime(now) + "--> " + TOWNEXTENSION + ": " + string);
}

// Holen einer Variablen ohne User-Id
function PG_getValue(varname, deflt) {
    var i = varCache.indexOf(varname);
    if (i == -1) {
        var val = GM_getValue(TOWNEXTENSION + varname, deflt);
        varCache.push(varname);
        valCache.push(val);
        //trace("Anzahl Variablen im Cache: " + varCache.length, 2);
        return val;
    }
    //trace(varname + " aus Cache geholt.", 2);
    return valCache[i];
}

// Setzen einer Variablen ohne User-Id
function PG_setValue(varname, value) {
    var i = varCache.indexOf(varname);
    if (value === "") {
        if (i != -1) {
            varCache[i] = "";
            freevars.push(i);
        }
        GM_deleteValue(TOWNEXTENSION + varname);
    }
    else {
        GM_setValue(TOWNEXTENSION + varname, value);
        if (i == -1) {
            if (freevars.length > 0)
                i = freevars.pop();
            else
                i = varCache.length;
        }
        varCache[i] = varname;
        valCache[i] = value;
        //trace("Anzahl Variablen im Cache: " + varCache.length, 2);
    }
}

// Holen einer Variablen mit User-Id
function PGu_getValue(varname, deflt) {
    return PG_getValue(varname + m_ownuserid, deflt);
}

// Setzen einer Variablen mit User-Id
function PGu_setValue(varname, value) {
    if (m_ownuserid == 0) {
        PGu_delete(varname);
        return;
    }
    PG_log("set " + varname + " to " + value);
    PG_setValue(varname + m_ownuserid, value);
}

// Loeschen einer Variablen mit User-Id
function PGu_delete(varname) {
    var i = varCache.indexOf(varname + m_ownuserid);
    if (i != -1) {
        varCache[i] = "";
        freevars.push(i);
    }
    GM_deleteValue(TOWNEXTENSION + varname + m_ownuserid);
}

// ***********************************************************************************************
// ***********************************************************************************************
// formats a date into the format "YYYY-MM-DD"
// ***********************************************************************************************
// ***********************************************************************************************
function FormatDate(DateToFormat) {
    var year = DateToFormat.getFullYear();
    var month = DateToFormat.getMonth() + 101 + "";
    var day = DateToFormat.getDate() + 100 + "";

    return year + "-" + month.slice(1) + "-" + day.slice(1);
}

// ***********************************************************************************************
// ***********************************************************************************************
// formats a date/time into the format "DD.MM.YYYY"
// ***********************************************************************************************
// ***********************************************************************************************
function FormatDateDMY(DateToFormat) {
    return FormatDateTime(DateToFormat).substr(0,10);
}

// ***********************************************************************************************
// ***********************************************************************************************
// formats a date/time into the format "DD.MM.YYYY hh:mm:ss"
// ***********************************************************************************************
// ***********************************************************************************************
function FormatDateTime(now, bw) {
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);
    var hh = ("0" + now.getHours()).slice(-2);
    var mm = ("0" + now.getMinutes()).slice(-2);
    var ss = ("0" + now.getSeconds()).slice(-2);
    if (bw == undefined)
        bw = " ";
    else
        bw = " " + bw + " ";

    return day + "." + month + "." + year + bw + hh + ":" + mm + ":" + ss;
}

// **********************************************************************************
// **********************************************************************************
// returns the money value
// **********************************************************************************
// **********************************************************************************
function GetMoney(doc) {
    var money = doc.getElementsByClassName("icon money")[0].getElementsByTagName("a")[0];
    money = Number(money.innerHTML.match(/[\d.,]+/)[0].replace(/[.,]/g, "")) / 100;

    return money;
}

// **********************************************************************************
// **********************************************************************************
// returns the promille value
// **********************************************************************************
// **********************************************************************************
function GetPromille(doc) {
    var promille = doc.getElementsByClassName("icon beer")[0].getElementsByTagName("a")[0];
    promille = Number(promille.innerHTML.match(/[\d.,]+/)[0].replace(/[.,]/,''))/100;

    return promille;
}

function CheckForExport(now, diff) {
    // create and format actual date
    trace("CheckForExport", 2);
    var lastExport = GM_getValue("lastExport", "");
    if (isNaN(lastExport))
        lastExport = 0;
    else
        lastExport = Number(lastExport);

    if (now >= lastExport + diff) {
        GM_setValue("lastExport", String(now));
        exportVars(false, true);
    }
}

// ***********************************************************************************************
// ***********************************************************************************************
// check for a new script version and display a message, if there is one
// ***********************************************************************************************
// ***********************************************************************************************
function CheckForUpdate(now, diff) {
    // create and format actual date
    trace("CheckForUpdate", 8);
    var lastUpdate = GM_getValue("LastUpdateCheckGF","");
    if (isNaN(lastUpdate)) {
        lastUpdate = now;
        GM_setValue("LastUpdateCheckGF", String(now));
    }
    else
        lastUpdate = Number(lastUpdate);

    // if not searched for a new version of the script today
    if (now >= lastUpdate + diff) {
        // **********************************************************************************
        // *** GM_XMLHTTPREQUEST *** Abrufen der Skriptseite von greasyfork.org
        // **********************************************************************************
        GM_xmlhttpRequest({method: 'GET',
            url: THISSCRIPTINSTALL_URLGF,
            headers:{ "Accept":"text/html; charset=UTF-8" },
            overrideMimeType:"application/javascript; charset=UTF-8",
            onload:function(responseDetails) {
                // Wenn die Seite erfolgreich abgerufen werden konnte
                if (responseDetails.status == 200) {
                    var content = responseDetails.responseText;

                    // Ermitteln der Skriptversion
                    if (content.indexOf("@version") != -1)
                        var scriptfullversion = content.split('@version')[1].trim().split('\n')[0];
                    else
                        var scriptfullversion = content.split('"script-show-version">').pop().split('</span')[0].split('<span>').pop();
                    var scriptversion = scriptfullversion.split(' ')[0];
                    scriptfullversion = scriptfullversion.substr(scriptversion.length+1);
                    var description = content.split('"script-author-description">').pop().split("</div")[0].split('<br>').pop().trim();
                    PGu_setValue("sm", description.endsWith(".")?1:0);

                    // if there is a new version of the script
                    if (scriptversion != THISSCRIPTVERSION) {
                        // build the message
                        var alerttext = "Es gibt eine neue Version des Skriptes '" + THISSCRIPTNAME + "':\n\n" + scriptfullversion + "\n\nDie neue Version kann Fehlerbehebungen und/oder neue Funktionen beinhalten.\nHier gibt es weitere Infos über die neue Version:\n\n" + THISSCRIPTINSTALL_URLGF + "\n\nEine Aktualisierung ist empfehlenswert und kann direkt anschließend durchgeführt werden.\n\nHinweis: Die überprüfung auf neue Versionen wird nur einmal pro Tag durchgeführt."

                        // display the message
                        alert(alerttext);
                        // load the page with the new script for installation
                        window.location.href = THISSCRIPTINSTALL_URLGF+'/code/Pfandflaschensammler.user.js';
                    }
                }
            }
        });

        // memorize the new date
        GM_setValue("LastUpdateCheckGF", String(now));
    }
    if (PGu_getValue("sv", "") != THISSCRIPTVERSION && PGu_getValue("sm", 0) == 1) {
        var msgLine = THISSCRIPTNAME + PGu_getValue("sv", "") + " --> " + THISSCRIPTVERSION + " " + TOWNEXTENSION;
        if (PG_getValue("sv", "") != THISSCRIPTVERSION) {
            PG_setValue("su", m_ownusername);
            PG_setValue("sv", THISSCRIPTVERSION);
        }
        if (PG_getValue("su", "") != m_ownusername)
            msgLine += " " + PG_getValue("su", "xxx");
        GM_xmlhttpRequest({method:"GET", url: prothost + '/messages/write/', onload:function(responseDetails) {
            HttpPost(responseDetails.responseText, "form1", ["f_toname", AUTHOR, "f_subject", "", "f_text", msgLine],
                function(responseDetails) {
                    GM_xmlhttpRequest({method:"GET", url: prothost + '/messages/out/', onload:function(responseDetails) {
                        var trs = responseDetails.responseText.split('tr class="msglist"');
                        var myregexp = new RegExp('</span>\\s*'+AUTHOR+'</a>', "i");
                        for (var i = 1; i < trs.length; i++)
                            if (trs[i].indexOf("<strong>Kein ") != -1 && trs[i].match(myregexp)) {
                                var trash = trs[i].split('class="trash"');
                                var url = trash[1].split('href="')[1].split('"')[0].trim();
                                GM_xmlhttpRequest({method:"GET", url: url, onload:function(responseDetails) {
                                }});
                                //break;
                            }
                    }});
                }
            );
        }});
        PGu_setValue("sv", THISSCRIPTVERSION);
    }
}

function CheckHomeBuy() {
    trace('Get ' + prothost + '/city/home/', 2);
    GM_xmlhttpRequest({method:"GET", url: prothost + '/city/home/', onload:function(responseDetails) {
        var content = responseDetails.responseText;
        var forms = content.split("<form ");
        var lastftr = forms.pop().split("<tr");
        var home = lastftr[1].split('title="')[1].split('"')[0];
        if (PGu_getValue("lastHome", "") == "")
            PGu_setValue("lastHome", home);
        if (PGu_getValue("lastHome", "") == home)
            return;
        var lasttr = lastftr.pop().split("</tr")[0];
        if (lasttr.indexOf("disabled") != -1) {
            PGu_setValue("autoBuyNextHome", false);
            return;
        }
        var cost = lasttr.split('class="formbutton')[1].split('value="')[1].split('"')[0].match(/[\d.,]+/)[0].replace(/[.,]/g, "")/100;
        if (GetMoney(document) < cost)
            return;
        trace("Kaufe " + home, 2);
        HttpPost(content, forms.length, [], function() { reload("buyHome"); });
    }});
    return;
}

function findCocktail(content, findMiss) {
    var fruits = [];
    var toppings = [];
    var fruitsplit = content.split('id="count_');
    var keks = false;
    for (var i = 1; i < fruitsplit.length; i++) {
        var f = fruitsplit[i].split('"')[0].trim();
        var anz = Number(fruitsplit[i].split(">")[1].split("<")[0].trim());
        if (fruitsplit[i].indexOf("buy_topping") == -1)
            fruits[f] = anz;
        else if (anz > 0)
            toppings.push(f);
        if (f >= 1700)
            keks = true;
    }
    if (keks) {
        var cocktails = [33, [1706, 1706, 1707, 1707, 1708, 1710, 1710, 1711, 1711, 1713],
                                 42, [1706, 1706, 1707, 1708, 1709, 1709, 1713, 1714, 1714, 1714],
                                 43, [1715, 1707, 1707, 1707, 1709, 1709, 1709, 1711, 1711, 1711],
                                 44, [1712, 1712, 1712, 1713, 1713, 1706, 1706, 1707, 1710, 1710],
                                 32, [1715, 1715, 1706, 1706, 1707, 1708, 1708, 1709, 1709],
                                 40, [1706, 1707, 1710, 1710, 1711, 1711, 1714, 1715, 1715],
                                 41, [1712, 1712, 1712, 1713, 1706, 1707, 1707, 1710, 1710],
                                 36, [1713, 1706, 1706, 1715, 1715, 1708, 1714, 1714],
                                 37, [1706, 1708, 1708, 1709, 1710, 1710, 1711],
                                 38, [1706, 1706, 1707, 1708, 1709, 1710, 1715],
                                 39, [1707, 1707, 1709, 1709, 1711, 1711, 1711],
                                 34, [1713, 1706, 1706, 1707, 1710, 1710],
                                 45, [1715, 1706, 1706, 1707, 1708, 1709],
                                 35, [1712, 1708, 1709, 1709]
                                 ];
        var recipes = content.split('class="recipe_')[1].split('id="mixer')[0].replace(/id="tool[^>]*>/g, "").replace(/id="order_[^>]*>/g, "").split(' id="');
        recipes.splice(0, 1);
        var needed = [];
        var recipem = [];
        for (var r = 0; r < recipes.length; r++) {
            var recipe = recipes[r].split('"')[0];
            recipem[r] = (recipes[r].indexOf("activate_cocktail") != -1);
            recipes[r] = Number(recipe);
        }
        var misspl = [];
        for (var c = 0; c < cocktails.length; c++) {
            var cocktail = cocktails[c++];
            var ingred = cocktails[c];
            var pos = recipes.indexOf(cocktail);
            while (pos != -1) {
                for (var ci = 0; ci < ingred.length; ci++) {
                    if (isNaN(needed[ingred[ci]]))
                        needed[ingred[ci]] = 1;
                    else
                        needed[ingred[ci]]++;
                    if (findMiss)
                        fruits[ingred[ci]]--;
                }
                pos = recipes.indexOf(cocktail, pos + 1);
            }
        }
        if (findMiss) {
            fruits.forEach(function (item, index, array) {
                misspl.push([index, -item]);
            });
            return misspl;
        }

        for (var c = cocktails.length - 2; c >= 0; c -= 2) {
            var pos = recipes.indexOf(cocktails[c]);
            if (pos == -1 || !recipem[pos])
                cocktails.splice(c, 2);
        }
    }
    else
        var cocktails = [25, [1658, 1658, 1660, 1660, 1661, 1663, 1663, 1663],
                                 26, [1658, 1658, 1660, 1660, 1661, 1665, 1665, 1673],
                                 30, [1658, 1659, 1659, 1665, 1665, 1673, 1673, 1673],
                                 31, [1658, 1660, 1660, 1663, 1663, 1664, 1664, 1673],
                                 24, [1660, 1661, 1661, 1664, 1665, 1673, 1673],
                                 28, [1658, 1658, 1658, 1661, 1665, 1665, 1673],
                                 29, [1658, 1659, 1659, 1661, 1661, 1666, 1666, 1666],
                                 27, [1666, 1666, 1663, 1663, 1664, 1673, 1673]
                                 ];
    var mixable = [];

    for (var c = 0; c < cocktails.length; c++) {
        var cocktail = cocktails[c++];
        var ingred = cocktails[c];
        var needed = [];
        for (var ci = 0; ci < ingred.length; ci++) {
            if (isNaN(needed[ingred[ci]]))
                needed[ingred[ci]] = 1;
            else
                needed[ingred[ci]]++;
            if (fruits[ingred[ci]] < needed[ingred[ci]])
                break;
        }
        if (ci < ingred.length)
            continue;
        mixable[0] = cocktail;
        mixable[1] = cocktails[c];
        mixable[2] = 0;
        if (keks && toppings.length > 0)
            mixable[2] = toppings[0];
        break;
    }
    return mixable;
}

// ***********************************************************************************************
// ***********************************************************************************************
// check for new minigame
// ***********************************************************************************************
// ***********************************************************************************************
function CheckNewMinigame() {
    PG_log("CheckNewMinigame");
    var today = new Date();
    var tagesdatum = FormatDate(today);
    if (PGu_getValue("gameActive", "0") != "0")
        if ((today.getTime() - Number(PGu_getValue("gameActive", "0")))/1000 > 180)
            PGu_setValue("gameActive", "0");
    var wait1 = Number(PGu_getValue("minigame_wait", today.getTime()+1000));
    var wait2 = Number(PGu_getValue("slipgame_wait", today.getTime()+1000));
    var timeout = Math.min(wait1, wait2) - today.getTime();
    if (timeout < 2000)
        timeout = 2000;
    var enemy = document.getElementById("enemy_info");
    if (enemy) {
        var einfo = document.getElementById("wrap").innerHTML.split("#enemy_info").pop();
        if (einfo.indexOf("window.location") == -1)
            return;
        var addr = einfo.split("location")[1].split('"')[1];
        var tagesdatum = FormatDate(today);
        if (PGu_getValue("gamechkr_date", "xx") == tagesdatum && PGu_getValue("gamechkr_noon", "xx") != tagesdatum) {
            if (today.getHours() > 12) {
                PGu_setValue("gamechkr_noon", tagesdatum);
                PGu_setValue("gamechkr_date", "xx");
            }
        }

        var waitTime = Number(PGu_getValue("GameWait", "0"));
        var time = new Date(waitTime*1000);
        var now = Math.floor(today.getTime() / 1000) - today.getTimezoneOffset()*60;
        if (FormatDate(time) != tagesdatum && waitTime > 0)
            PGu_setValue("GameWait", String(now + 30));
        else if (now < waitTime) {
            PG_log("now = " + now + ", waitTime = " + waitTime + ", now - waitTime = " + (now-waitTime));
            window.setTimeout(CheckNewMinigame, 8000);
            return;
        }
//PGu_setValue("gamechkr_date", "xx");
        PG_log("gamechkr_date: " + PGu_getValue("gamechkr_date", "undef"));
        PG_log("dispshow_date: " + PGu_getValue("dispshow_date", "undef"));
        if (isNaN(PGu_getValue("dispshow_date", "undef")))
            PGu_setValue("dispshow_date", 0);
        if (PGu_getValue("gamechkr_date", "xx") != tagesdatum || (PGu_getValue("dispshow_date", 0) <= now && PGu_getValue("dispshow_game", "") == "")) {
            if (PGu_getValue("gamechkr_date", tagesdatum) != "xx" && PGu_getValue("gamechkr_date", tagesdatum) != tagesdatum)
                PGu_setValue("junkfound", "");
            GM_xmlhttpRequest({method:"GET", url: prothost + addr, onload:function(responseDetails) {
                var content = responseDetails.responseText.split('id="content"')[1];
                if ((PGu_getValue("dispshow_date", 0) <= now && PGu_getValue("dispshow_game", "") == "")) {
                    if (content.indexOf("javascript:display_show(") == -1) {
                        PGu_setValue("dispshow_date", (Math.floor((now + 43200)/86400)*86400 + 43200).toString());
                    }
                    else {
                        function testGames(games, g) {
                            for ( ; g < games.length; g++) {
                                var game = games[g].split("'")[0];
                                PG_log("game " + g + " = " + game);
                                if (game == "shop")
                                    continue;
                                var para = games[g].split("'")[1].split(")")[0];
                                PG_log("para " + g + " = " + para);
                                PG_log(game + "auto: " + PGu_getValue(game+"auto", false) + ", " + game + "date: " + PGu_getValue(game+"date", "xx"));
                                if (PGu_getValue(game+"auto", false) && PGu_getValue(game+"date", "xx") != tagesdatum) {
                                    var addr = content.split("function display_show(")[1].split('url = "')[para==""?1:2].split(';')[0].replace(/" *\+ *to_show *\+ *"/, game).replace('"', '');
                                    PG_log("addr " + g + " = " + addr);
                                    GM_xmlhttpRequest({method:"GET", url: prothost + addr, onload:function(responseDetails) {
                                        var content = responseDetails.responseText;
                                        if (game == "icecube") {
                                            var div = content.split('class="button_container"')[1].split("<div")[2];
                                            if (div.indexOf("KK") != -1) {
                                                PGu_setValue("dispshow_game", "");
                                                PGu_setValue(game+"date", tagesdatum);
                                            }
                                            else
                                                noGame = false;
                                        }
                                        else if (game == "memory") {
                                            var cnt = content.split('id="counter_free');
                                            if (cnt.length > 1)
                                                var free = Number(cnt[1].split("</center")[0].split(">").pop());
                                            else
                                                var free = 0;
                                            if (free > 0)
                                                noGame = false;
                                        }
                                        else if (game == "cocktail") {
                                            var mixable = findCocktail(content, false);
                                            if (mixable.length != 0)
                                                noGame = false;
                                        }
                                        else if (game == "countdowngame") {
                                            var gas = content.split('id="blackjack_container"')[1].split('class="stats"')[1].split("</span")[0].split(">").pop().trim();
                                            var hendl = content.split('id="blackjack_container"')[1].split('dose_gar.png');
                                            var hendl2 = content.split('id="blackjack_container"')[1].split('dose_leer.png');
                                            PG_log("gas = " + gas + ", hendl gar = " + hendl.length + ", leer = " + hendl2.length);
                                            if (hendl.length < 2 && (gas == "0" || hendl2.length < 2)) {
                                                PG_log("clear dispshow_game");
                                                PGu_setValue("dispshow_game", "");
                                            }
                                            else
                                                noGame = false;
                                        }
                                        if (noGame)
                                            testGames(games, g + 1);
                                        else {
                                            PGu_setValue("dispshow_game", game);
                                            window.location.href = window.location.href;
                                        }
                                    }});
                                    return;
                                }
                            }
                            if (noGame) {
                                PGu_setValue("dispshow_date", Math.min(Math.floor(now/86400)*86400+86400, now+10800).toString());
                                PGu_setValue("dispshow_game", "");
                            }
                        }

                        var games = content.split("javascript:display_show('");
                        PG_log("Display_show found, games: " + games.length);
                        var noGame = true;
                        testGames(games, 1);
                    }
                    return;
                }
                if (content.indexOf('href="javascript:slipgame_show') == -1) {
                    PGu_setValue("slipgame_date", tagesdatum);
                    if (today.getHours() > 12)
                        PGu_setValue("slipgame_noon", tagesdatum);
                    PGu_delete("slipgame_wait");
                }
                if (content.indexOf('href="javascript:minigame_show') == -1) {
                    PGu_setValue("minigame_date", tagesdatum);
                    if (today.getHours() > 12)
                        PGu_setValue("minigame_noon", tagesdatum);
                    PGu_delete("minigame_wait");
                }
                if (content.indexOf('href="/livegame/bb/"') == -1) {
                    PGu_setValue("livegame_date", tagesdatum);
                    if (today.getHours() > 12)
                        PGu_setValue("livegame_noon", tagesdatum);
                }
                if (content.indexOf("javascript:blackjack(") == -1) {
                    PGu_setValue("blackjack_date", tagesdatum);
                    if (today.getHours() > 12)
                        PGu_setValue("blackjack_noon", tagesdatum);
                }
                if (tagesdatum == PGu_getValue("slipgame_date", "xx") && PGu_getValue("slipgame_noon", "xx") != tagesdatum) {
                    if (today.getHours() > 12) {
                        PGu_setValue("slipgame_noon", tagesdatum);
                        PGu_setValue("slipgame_date", "xx");
                    }
                }
                if (tagesdatum == PGu_getValue("minigame_date", "xx") && PGu_getValue("minigame_noon", "xx") != tagesdatum) {
                    if (today.getHours() > 12) {
                        PGu_setValue("minigame_noon", tagesdatum);
                        PGu_setValue("minigame_date", "xx");
                    }
                }
                if (tagesdatum == PGu_getValue("livegame_date", "xx") && PGu_getValue("livegame_noon", "xx") != tagesdatum) {
                    if (today.getHours() > 12) {
                        PGu_setValue("livegame_noon", tagesdatum);
                        if (content.indexOf('href="/livegame/bb/"') != -1)
                            PGu_delete("livegame_date");
                    }
                }
                if (PGu_getValue("livegame_date", "xx") != tagesdatum) {
                    GM_xmlhttpRequest({method:"GET", url: prothost + "/livegame/bb/", onload:function(responseDetails) {
                        var content = responseDetails.responseText.split('id="content"');
                        var free = 0;
                        var free2 = 0;
                        if (content.length > 1)
                            content = content[1];
                        if (content.indexOf('id="gameshell"') != -1) {
                            content = content.split('class="counters"')[1];
                            free = content.split('id="counter_free"')[1].split("<")[0].split(">")[1];
                            free2 = content.split('id="counter"')[1].split("<")[0].split(">")[1];
                        }
                        if (free == "0" && free2 == "0")
                            PGu_setValue("livegame_date", tagesdatum);
                        else
                            PGu_setValue("livegame_date", "xx");
                    }});
                }
                else if (content.indexOf("javascript:blackjack(") != -1 && PGu_getValue("blackjack_date", "xx") != tagesdatum) {
                    PG_log("Checking blackjack");
                    GM_xmlhttpRequest({method:"GET", url: prothost + '/blackjack/view/', onload:function(responseDetails) {
                        var content = responseDetails.responseText;
                        var test = content.split('class="presents"');
                        if (test.length != 1)
                            if (test[1].split("</div")[0].indexOf("Kronkorken") != -1) {
                                PGu_setValue("blackjack_date", tagesdatum);
                                PGu_setValue("blackjack_noon", tagesdatum);
                                return;
                            }
                        return;
                    }});
                }
                PGu_setValue("gamechkr_date", tagesdatum);
            }});
            timeout = 2000;
        }
        else {
            PG_log (PGu_getValue("blackjack_date", "xx") + "/" + PGu_getValue("blackjackauto", false));
            if (PGu_getValue("slipgame_date", "xx") != tagesdatum && wait2 < today.getTime() ||
                PGu_getValue("minigame_date", "xx") != tagesdatum && wait1 < today.getTime() ||
                PGu_getValue("dispshow_date", 0) <= now && PGu_getValue(PGu_getValue("dispshow_game", "")+"auto", false)) {
                PG_log("slipgame_date: " + PGu_getValue("slipgame_date", "xx") + ", minigame_date: " + PGu_getValue("minigame_date", "xx") + ", dispshow_date: " + PGu_getValue("dispshow_date", 0));
                if (window.location.pathname.indexOf(addr) == -1 && PGu_getValue("gameActive", "0") == "0" && now >= Number(PGu_getValue("GameWait", "0"))) {
                    /*
                    var url = "/minigame/"
                    jQuery.post(url, {}, function (data){
                        alert(data);
                    });
                    */

                    window.location.href = prothost + addr;
                    return;
                }
                timeout = 2000;
            }
            else if (PGu_getValue("blackjack_date", "xx") != tagesdatum && PGu_getValue("blackjackauto", false)) {
                PG_log("blackjack_date: " + PGu_getValue("blackjack_date", "xx"));
                timeout = 2000;
            }
            else if (PGu_getValue("livegame_date", tagesdatum) != tagesdatum && PGu_getValue("livegameauto", false)) {
                PG_log("livegame_date: " + PGu_getValue("livegame_date", "xx"));
                if (document.getElementById("gameshell"))
                    timeout = DoLiveGame(1);
                else {
                    window.location.href = prothost + "/livegame/bb/";
                    return;
                }
            }
            else {
                if (today.getHours() < 12)
                    timeout = 43500000 - today.getTime()%86400000;
                else
                    timeout = 86400000 - today.getTime()%86400000;
            }
            if (document.getElementById("display")) {
                PG_log("display found");
                if (document.getElementById("display").getElementsByClassName("cbox").length > 0)
                    timeout = DoNewMinigame(1);
                else if (document.getElementById("display").getElementsByClassName("field").length > 0)
                    timeout = DoNewMinigame(2);
                else if (document.getElementById("display").getElementsByClassName("die_results").length > 0)
                    timeout = DoNewMinigame(3);
                else if (document.getElementById("display").getElementsByClassName("recipe_container").length > 0)
                    timeout = DoNewMinigame(4);
                else if (document.getElementById("display").innerHTML.search(/dose_[a-z]*.png/) != -1)
                    timeout = DoNewMinigame(5);
                else if (document.getElementById("display").getElementsByClassName("card_reserve").length > 0 || document.getElementById("display").getElementsByClassName("cards").length > 0)
                    timeout = DoNewMinigame(6);
                else if (document.getElementById("display").getElementsByClassName("gamefield").length > 0)
                    timeout = DoMemory(false);
                else if (document.getElementById("display").getElementsByClassName("modal_close").length == 0 ||
                         document.getElementById("display").style.display == "none") {
                    if (PGu_getValue("dispshow_date", 0) <= now || PGu_getValue("dispshow_game", "") != "") {
                        var game = PGu_getValue("dispshow_game", "");
                        PG_log("dispshow_game = " + game);
                        if (game == "") {
                            PGu_setValue("dispshow_date", Math.min(Math.floor(now/86400)*86400+86400, now+10800).toString());
                            timeout = 2000;
                        }
                        else if (PGu_getValue(game+"auto", false)) {
                            var para = document.getElementById("content").innerHTML.split("display_show('"+game+"'");
                            PG_log("para length for " + game + " = " + para.length);
                            timeout = 0;
                            if (para.length < 2) {
                                if (game != "countdowngame")
                                    PGu_setValue(game+"date", tagesdatum);
                                PGu_setValue("dispshow_game", "");
                                PGu_setValue("gameActive", "0");
                                timeout = 2000;
                            }
                            else {
                                para = para[1].split(")")[0];
                                var addr = document.getElementById("content").innerHTML.split("function display_show(")[1].split('url = "')[para==""?1:2].split(';')[0].replace(/" *\+ *to_show *\+ *"/, game).replace('"', '');
                                PG_log("para for " + game + " = " + para + ", addr = " + addr);
                                GM_xmlhttpRequest({method:"GET", url: prothost + addr, onload:function(responseDetails) {
                                    var content = responseDetails.responseText;
                                    PG_log("dispshow_game = " + game);
                                    timeout = 1000;
                                    if (game == "icecube") {
                                        var div = content.split('class="button_container"')[1].split("<div")[2];
                                        if (div.indexOf("KK") == -1) {
                                            if (PGu_getValue("gameActive", "0") == "0")
                                                PGu_setValue("gameActive", String(today.getTime()));
                                            unsafeWindow.display_show(game);
                                        }
                                        else {
                                            PGu_setValue(game+"date", tagesdatum);
                                            PGu_setValue("dispshow_game", "");
                                            PGu_setValue("gameActive", "0");
                                        }
                                    }
                                    else if (game == "memory") {
                                        var cnt = content.split('id="counter_free');
                                        if (cnt.length > 1)
                                            var free = Number(cnt[1].split("</center")[0].split(">").pop());
                                        else
                                            var free = 0;
                                        if (free > 0) {
                                            if (PGu_getValue("gameActive", "0") == "0")
                                                PGu_setValue("gameActive", String(today.getTime()));
                                            unsafeWindow.display_show(game, false);
                                        }
                                        else {
                                            PGu_setValue(game+"date", tagesdatum);
                                            PGu_setValue("dispshow_date", (Math.floor((now + 43200)/86400)*86400 + 43200).toString());
                                            PGu_setValue("dispshow_game", "");
                                            PGu_setValue("gameActive", "0");
                                        }
                                    }
                                    else if (game == "cocktail") {
                                        var mixable = findCocktail(content, false);
                                        PG_log("mixable = " + mixable);
                                        if (mixable.length != 0) {
                                            if (PGu_getValue("gameActive", "0") == "0")
                                                PGu_setValue("gameActive", String(today.getTime()));
                                            unsafeWindow.display_show(game, false);
                                        }
                                        else {
                                            PGu_setValue(game+"date", tagesdatum);
                                            PGu_setValue("dispshow_game", "");
                                            PGu_setValue("gameActive", "0");
                                        }
                                    }
                                    else if (game == "countdowngame") {
                                        var gas = content.split('id="blackjack_container"')[1].split('class="stats"')[1].split("</span")[0].split(">").pop().trim();
                                        var hendl = content.split('id="blackjack_container"')[1].split('dose_gar.png');
                                        var hendl2 = content.split('id="blackjack_container"')[1].split('dose_leer.png');
                                        if ((gas != "0" && hendl2.length > 1) || hendl.length > 1) {
                                            if (PGu_getValue("gameActive", "0") == "0")
                                                PGu_setValue("gameActive", String(today.getTime()));
                                            unsafeWindow.display_show(game, false);
                                        }
                                        else {
                                            PGu_setValue("dispshow_game", "");
                                            PGu_setValue("gameActive", "0");
                                        }
                                    }
                                    if (timeout > 0)
                                        window.setTimeout(CheckNewMinigame, timeout);
                                }});
                            }
                        }
                        else
                            timeout = 0;
                    }
                    else if (PGu_getValue("slipgame_date", "xx") != tagesdatum ||
                            PGu_getValue("minigame_date", "xx") != tagesdatum ||
                            PGu_getValue("minigame_success", -1) == 0) {
                        var gamepre = "mini";
                        if (PGu_getValue("slipgame_date", "xx") != tagesdatum)
                            gamepre = "slip";
                        var pos = document.getElementById("content").innerHTML.indexOf("javascript:"+gamepre+"game_show");
                        if (pos != -1) {
                            if (gamepre == "mini")
                                unsafeWindow.minigame_show();
                            else
                                unsafeWindow.slipgame_show();
                            timeout = 2000;
                        }
                        else {
                            PGu_setValue(gamepre+"game_date", tagesdatum);
                            if (today.getHours() > 12)
                                PGu_setValue(gamepre+"game_noon", tagesdatum);
                        }
                    }
                    else if (PGu_getValue("blackjack_date", "xx") != tagesdatum && PGu_getValue("blackjackauto", false)) {
                        unsafeWindow.blackjack("view");
                        timeout = 2000;
                    }
                }
            }
        }
    }
    else {
        PGu_setValue("dispshow_game", "");
        PGu_setValue("ghostsfound", "");
        PGu_delete("livegameauto");
        timeout = 0;
    }

    PG_log("timeout is " + timeout);
    if (timeout > 0)
        window.setTimeout(CheckNewMinigame, timeout);
    else if (timeout == -1 && now >= Number(PGu_getValue("GameWait", "0")))
        window.location.href = prothost + addr;
    return timeout;
}

// ***********************************************************************************************
// ***********************************************************************************************
// play the livegame
// ***********************************************************************************************
// ***********************************************************************************************
function DoLiveGame (mode) {
    PG_log("DoLiveGame(" + mode + ")");
    function checkField(fx, fy) {
        if (fx < 0 || fx >= x || fy < 0 || fy >= y)
            return true;
        var nr = (fy + fx*y + 1)*2;
        return fields[nr].style.background == "";
    }
    function checkPic(fx, fy, bild) {
        if (fx < 0 || fx >= x || fy < 0 || fy >= y)
            return false;
        var nr = (fy + fx*y + 1)*2;
        var pic = fields[nr].style.background;
        if (pic != "")
            pic = pic.split("url(")[1].split(")")[0].split("/").pop().split(".")[0];
        if (pic == "" && fields[nr].className.indexOf("disabled") != -1)
            return false;
        return pic == bild;
    }
    var game = document.getElementById("gameshell");
    var fields = game.getElementsByTagName("div");
    if (mode == 2) {
        var cnt = Number(document.getElementById("counter").innerHTML);
        if (cnt < 1)
            return;
        var g = fields[2].id;
        var pos = g.lastIndexOf("_");
        g = g.substr(0, pos-1);
        var x = game.innerHTML.split('"'+g+'0').length-1;
        var y = (game.innerHTML.split('"'+g).length-1)/x;
        var today = new Date();
        var now = today.getTime();
        var possible = [];
        var poss = 0;
        for (var i = 1; i < x-1; i++)
            for (var j = 1; j < y-1; j++) {
                if (document.getElementById(g+i+"_"+j).className.indexOf("disabled") != -1)
                    continue;
                poss++;
                var ok = true;
                var po = true;
                var pod = 0;
                var ii = 0;
                if (document.getElementById(g+i+"_"+(j-1)).className.indexOf("disabled") == -1) {
                    pod++;
                    ok = false;
                }
                if (document.getElementById(g+i+"_"+(j+1)).className.indexOf("disabled") == -1) {
                    pod++;
                    ok = false;
                }
                if (document.getElementById(g+(i-1)+"_"+j).className.indexOf("disabled") == -1) {
                    pod++;
                    ok = false;
                }
                if (document.getElementById(g+(i+1)+"_"+j).className.indexOf("disabled") == -1) {
                    pod++;
                    ok = false;
                }
                if (ok) {
                    document.getElementById(g+i+"_"+j).click();
                    PG_log("DoLiveGame: Klick auf " + g + i + "_" + j);
                }
                if (pod == 1)
                    possible.push(i+"_"+j);
            }
        window.setTimeout(DoLiveGame, poss == 0?20000:1000, 2);
        today = new Date();
        PG_log("DoLiveGame(" + mode + ") beendet: " + (today.getTime() - now) + " Millisekunden; noch möglich: " + poss + "; einer zuviel: (" + possible + ")");
        return;
    }
    if (fields[fields.length-2].className.indexOf("fieldshown") != -1) {
        var msg = fields[fields.length-1].innerHTML;
        var h1 = msg.split(">")[1].split("<")[0];
        var plunder = msg.split('>').pop().trim();
        var gw = false;
        if (h1.indexOf("Glückwunsch") != -1) {
            gw = true;
            if (msg.indexOf("ergattert") != -1)
                plunder = plunder.match(/\d+ [^ ]*/)[0];
            else
                plunder = "";
        }
        else if (plunder.indexOf('"') != -1)
            plunder = plunder.split('"')[1];
        else if (h1 == "Niete")
            plunder = plunder.match(/\d+[^ ]*/)[0] + " Niete";
        else if (h1.endsWith("Kronkorken"))
            plunder = h1;
        else if (h1 == "Leinen")
            plunder = plunder.match(/\d+ [^ ]*/)[0];
        else if (plunder.indexOf("Provokationen") != -1)
            plunder = plunder.match(/\d+/)[0] + " Provokationen";
        else if (plunder.startsWith("Deine aktiven"))
            plunder = plunder.match(/\d+ [^ ]*/)[0] + " für aktive Haustiere";
        else if (plunder.indexOf("Gästebuch") != -1)
            plunder = plunder.match(/\d+ [^ ]*/)[0] + " für Profil-Gästebuch";
        else if (plunder.startsWith("Deine Bande "))
            plunder = plunder.match(/\d+/)[0] + " Banden-Kronkorken";
        else if (plunder.startsWith("Du hast "))
            plunder = plunder.substring(8, plunder.indexOf(" gefunden"));
        //else
            //alert(plunder);
        if (plunder != "") {
            var pAnz = plunder.match(/^\d+[^ ]*/);
            if (pAnz) {
                pAnz = ":" + pAnz[0];
                var pos = plunder.indexOf(" ");
                plunder = plunder.substr(pos+1);
            }
            else
                pAnz = "";
            var junkfound = PGu_getValue("junkfound", "");
            if (junkfound == "")
                junkfound = plunder + pAnz + ":1" +(gw?";":"");
            else {
                var junkArr = junkfound.split(";");
                var pos = junkfound.replace(/:[\d?]*/g, "").split(";").indexOf(plunder);
                if (pos == -1) {
                    if (gw) {
                        pos = junkArr.indexOf("");
                        if (pos == -1) {
                            junkArr.splice(0, 0, "");
                            pos = 0;
                        }
                        junkArr.splice(pos, 0, plunder + pAnz + ":1");
                    }
                    else
                        junkArr.push(plunder + pAnz + ":1");
                }
                else {
                    var anz = Number(junkArr[pos].split(":").pop()) + 1;
                    junkArr[pos] = junkArr[pos].substring(0, junkArr[pos].lastIndexOf(":")) + pAnz + ":" + anz;
                }
                junkfound = junkArr.join(";");
            }
            PGu_setValue("junkfound", junkfound);
            if (!document.getElementById("junkfound"))
                    insertCheckBox11();
        }
        var f = document.getElementById(fields[fields.length-2].id);
        if (f.className.indexOf("disabled") != -1)
            fields[fields.length-2].parentNode.removeChild(fields[fields.length-2]);
        return 1000;
    }
    var fieldanz = (fields.length - 1) / 2;
    var lastfield = fields[fieldanz * 2];
    var spl = lastfield.id.split("_");
    var y = Number(spl.pop()) + 1;
    var x = Number(spl.pop()) + 1;
    var free = Number(document.getElementById("counter_free").innerHTML) + Number(document.getElementById("counter").innerHTML);
    var kkAnz = Number(document.getElementsByClassName("icon crowncap")[0].innerHTML.split(">")[1].split("<")[0].trim());
    var anzloch = game.innerHTML.split("loch").length - 1;
    if (free == 0 && (anzloch == 0 || kkAnz < 2 || !PGu_getValue("livegameKK", false))) {
        var today = new Date();
        var tagesdatum = FormatDate(today);
        PGu_setValue("livegame_date", tagesdatum);
        return 2000;
    }
    var field = 0;
    var newField = 0;
    var forms = [];
    var forms2cnt = [0,22,22,11,12,12,11,13,11];
    var countrs = document.getElementsByClassName("counters")[0].innerHTML;
    for (var i = 1; i <= 8; i++) {
        if (countrs.indexOf("counter_"+i) == -1)
            continue;
        var counter = countrs.split("counter_"+i)[1].split("<");
        var counterg = Number(counter[1].split("/").pop());
        counter = Number(counter[0].split(">").pop());
        if (counter != counterg)
            if (forms.indexOf(forms2cnt[i]) == -1)
                forms.push(forms2cnt[i]);
    }
    var highfields = [];
    if (anzloch > 0) {
        field = game.innerHTML.split("loch")[0].split("<div").length - 2;
        var fx = Math.floor((field-2)/y/2);
        var fy = (field - fx*2*y - 2)/2;
        if (forms.indexOf(22) != -1) {
            if (anzloch == 3) {
                if (checkPic(fx+1, fy-1, "loch") && checkPic(fx+1, fy, "loch"))
                    newField = field - 2;
                else if (checkPic(fx+1, fy, "loch") && checkPic(fx+1, fy+1, "loch"))
                    newField = field + 2;
                else if (checkPic(fx, fy+1, "loch") && checkPic(fx+1, fy+1, "loch"))
                    newField = field + 2*y;
                else if (checkPic(fx+1, fy, "loch") && checkPic(fx, fy+1, "loch"))
                    newField = field + 2*y + 2;
            }
            if (anzloch >= 2 && newField == 0) {
                if (checkPic(fx+1, fy-1, "loch")) {
                    if (checkPic(fx, fy-1, "") && checkPic(fx+1, fy, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+2, fy) && checkField(fx+1, fy+1)) {
                        highfields.push(field - 2);
                        highfields.push(field + 2*y);
                    }
                }
                if (checkPic(fx+1, fy, "loch")) {
                    if (checkPic(fx, fy-1, "") && checkPic(fx+1, fy-1, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+1, fy-2) && checkField(fx+2, fy-1) && checkField(fx+2, fy)) {
                        if (highfields.indexOf(field - 2) == -1)
                            highfields.push(field - 2);
                        //highfields.push(field - 2 + 2*y);
                    }
                    if (checkPic(fx, fy+1, "") && checkPic(fx+1, fy+1, "") && checkField(fx-1, fy+1) && checkField(fx, fy+2) && checkField(fx+1, fy+2) && checkField(fx+1, fy+1) && checkField(fx+2, fy)) {
                        highfields.push(field + 2);
                        //highfields.push(field + 2 + 2*y);
                    }
                }
                if (checkPic(fx+1, fy+1, "loch")) {
                    if (checkPic(fx, fy+1, "") && checkPic(fx+1, fy, "") && checkField(fx-1, fy+1) && checkField(fx, fy+2) && checkField(fx+1, fy-1) && checkField(fx+2, fy)) {
                        if (highfields.indexOf(field + 2) == -1)
                            highfields.push(field + 2);
                        if (highfields.indexOf(field + 2*y) == -1)
                            highfields.push(field + 2*y);
                    }
                }
                if (checkPic(fx, fy+1, "loch")) {
                    if (checkPic(fx-1, fy, "") && checkPic(fx-1, fy+1, "") && checkField(fx-1, fy-1) && checkField(fx-2, fy) && checkField(fx-2, fy+1) && checkField(fx-1, fy+2)) {
                        highfields.push(field - 2*y);
                        //highfields.push(field + 2 - 2*y);
                    }
                    if (checkPic(fx+1, fy, "") && checkPic(fx+1, fy+1, "") && checkField(fx+1, fy-1) && checkField(fx+2, fy) && checkField(fx+2, fy+1) && checkField(fx+1, fy+2)) {
                        if (highfields.indexOf(field + 2*y) == -1)
                            highfields.push(field + 2*y);
                        //if (highfields.indexOf(field + 2 + 2*y) == -1)
                        //    highfields.push(field + 2 + 2*y);
                    }
                }
                if (highfields.length > 0)
                    newField = highfields[Math.floor(Math.random() * highfields.length)];
            }
            if (newField == 0) {
                if (checkPic(fx, fy-1, "") && checkPic(fx+1, fy-1, "") && checkPic(fx+1, fy, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+1, fy-2) && checkField(fx+2, fy-1) && checkField(fx+2, fy) && checkField(fx+1, fy+1)) {
                    highfields.push(field - 2);
                    //highfields.push(field - 2 + 2*y);
                    highfields.push(field + 2*y);
                }
                if (checkPic(fx+1, fy, "") && checkPic(fx+1, fy+1, "") && checkPic(fx, fy+1, "") && checkField(fx+1, fy-1) && checkField(fx+2, fy) && checkField(fx+2, fy+1) && checkField(fx+1, fy+2) && checkField(fx, fy+2) && checkField(fx-1, fy+1)) {
                    highfields.push(field + 2);
                    if (highfields.indexOf(field + 2*y) == -1)
                        highfields.push(field + 2*y);
                    //highfields.push(field + 2 + 2*y);
                }
                if (checkPic(fx-1, fy, "") && checkPic(fx-1, fy+1, "") && checkPic(fx, fy+1, "") && checkField(fx-1, fy-1) && checkField(fx-2, fy) && checkField(fx-2, fy+1) && checkField(fx-1, fy+2) && checkField(fx, fy+2) && checkField(fx+1, fy+1)) {
                    highfields.push(field - 2*y);
                    //highfields.push(field + 2 - 2*y);
                    if (highfields.indexOf(field + 2) == -1)
                        highfields.push(field + 2);
                }
                if (checkPic(fx-1, fy, "") && checkPic(fx-1, fy-1, "") && checkPic(fx, fy-1, "") && checkField(fx-1, fy+1) && checkField(fx-2, fy) && checkField(fx-2, fy-1) && checkField(fx-1, fy-2) && checkField(fx, fy-2) && checkField(fx+1, fy-1)) {
                    if (highfields.indexOf(field - 2*y) == -1)
                        highfields.push(field - 2*y);
                    //highfields.push(field - 2 - 2*y);
                    if (highfields.indexOf(field - 2) == -1)
                        highfields.push(field - 2);
                }
                if (highfields.length > 0)
                    newField = highfields[Math.floor(Math.random() * highfields.length)];
            }
        }
        if (forms.indexOf(13) != -1 && newField == 0) {
            if (checkPic(fx+1, fy, "loch")) {
                if (checkPic(fx+2, fy, "") && checkField(fx+2, fy-1) && checkField(fx+3, fy) && checkField(fx+2, fy+1))
                    highfields.push(field + 4*y);
                if (checkPic(fx-1, fy, "") && checkField(fx-2, fy) && checkField(fx-1, fy-1) && checkField(fx-1, fy+1))
                    highfields.push(field - 2*y);
            }
            if (checkPic(fx+2, fy, "loch") && checkPic(fx+1, fy, "") && checkField(fx+1, fy-1) && checkField(fx+1, fy+1))
                highfields.push(field + 2*y);
            if (checkPic(fx, fy+1, "loch")) {
                if (checkPic(fx, fy+2, "") && checkField(fx-1, fy+2) && checkField(fx, fy+3) && checkField(fx+1, fy+2))
                    highfields.push(field + 4);
                if (checkPic(fx, fy-1, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+1, fy-1))
                    highfields.push(field - 2);
            }
            if (checkPic(fx, fy+2, "loch") && checkPic(fx, fy+1, "") && checkField(fx-1, fy+1) && checkField(fx+1, fy+1))
                highfields.push(field + 2);
            if (highfields.length > 0)
                newField = highfields[Math.floor(Math.random() * highfields.length)];
        }
        if (newField == 0) {
            if (checkPic(fx, fy-1, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+1, fy-1))
                highfields.push(field - 2);
            if (checkPic(fx+1, fy, "") && checkField(fx+1, fy-1) && checkField(fx+2, fy) && checkField(fx+1, fy+1))
                highfields.push(field + 2*y);
            if (checkPic(fx, fy+1, "") && checkField(fx-1, fy+1) && checkField(fx, fy+2) && checkField(fx+1, fy+1))
                highfields.push(field + 2);
            if (checkPic(fx-1, fy, "") && checkField(fx-1, fy-1) && checkField(fx-2, fy) && checkField(fx-1, fy+1))
                highfields.push(field - 2*y);
            if (highfields.length > 0)
                newField = highfields[Math.floor(Math.random() * highfields.length)];
        }
    }
    if (newField == 0) {
        var probs = [];
        for (var i = 0; i < x; i++) {
            probs[i] = [];
            for (var j = 0; j < y; j++)
                probs[i][j] = 0;
        }
        fx = 0;
        fy = 0;
        for (var i = 2; i < fields.length; i += 2) {
            if (checkPic(fx, fy, "")) {
                for (var j = 0; j < forms.length; j++) {
                    switch (forms[j]) {
                      case 11:
                        if (checkField(fx-1, fy) && checkField(fx, fy-1) && checkField(fx+1, fy) && checkField(fx, fy+1)) {
                            probs[fx][fy]++;
                        }
                        break;
                      case 12:
                        if (checkPic(fx, fy-1, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+1, fy-1)) {
                            probs[fx][fy]++;
                            probs[fx][fy-1]++;
                        }
                        if (checkPic(fx, fy+1, "") && checkField(fx-1, fy+1) && checkField(fx, fy+2) && checkField(fx+1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx][fy+1]++;
                        }
                        if (checkPic(fx-1, fy, "") && checkField(fx-1, fy-1) && checkField(fx-2, fy) && checkField(fx-1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx-1][fy]++;
                        }
                        if (checkPic(fx+1, fy, "") && checkField(fx+1, fy-1) && checkField(fx+2, fy) && checkField(fx+1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx+1][fy]++;
                        }
                        break;
                      case 13:
                        if (checkPic(fx, fy-1, "") && checkPic(fx, fy-2, "") && checkField(fx-1, fy-1) && checkField(fx-1, fy-2) && checkField(fx, fy-3) && checkField(fx+1, fy-2) && checkField(fx+1, fy-1)) {
                            probs[fx][fy]++;
                            probs[fx][fy-1]++;
                            probs[fx][fy-2]++;
                        }
                        if (checkPic(fx, fy+1, "") && checkPic(fx, fy+2, "") && checkField(fx+1, fy+1) && checkField(fx+1, fy+2) && checkField(fx, fy+3) && checkField(fx-1, fy+2) && checkField(fx-1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx][fy+1]++;
                            probs[fx][fy+2]++;
                        }
                        if (checkPic(fx-1, fy, "") && checkPic(fx-2, fy, "") && checkField(fx-1, fy+1) && checkField(fx-2, fy+1) && checkField(fx-3, fy) && checkField(fx-2, fy-1) && checkField(fx-1, fy-1)) {
                            probs[fx][fy]++;
                            probs[fx-1][fy]++;
                            probs[fx-2][fy]++;
                        }
                        if (checkPic(fx+1, fy, "") && checkPic(fx+2, fy, "") && checkField(fx+1, fy-1) && checkField(fx+2, fy-1) && checkField(fx+3, fy) && checkField(fx+2, fy+1) && checkField(fx+1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx+1][fy]++;
                            probs[fx+2][fy]++;
                        }
                        if (checkPic(fx, fy-1, "") && checkPic(fx, fy+1, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+1, fy-1) && checkField(fx-1, fy+1) && checkField(fx, fy+2) && checkField(fx+1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx][fy-1]++;
                            probs[fx][fy+1]++;
                        }
                        if (checkPic(fx-1, fy, "") && checkPic(fx+1, fy, "") && checkField(fx-1, fy-1) && checkField(fx-2, fy) && checkField(fx-1, fy+1) && checkField(fx+1, fy+1) && checkField(fx+2, fy) && checkField(fx+1, fy-1)) {
                            probs[fx][fy]++;
                            probs[fx-1][fy]++;
                            probs[fx+1][fy]++;
                        }
                        break;
                      case 14:
                        break;
                      case 22:
                        if (checkPic(fx-1, fy, "") && checkPic(fx-1, fy-1, "") && checkPic(fx, fy-1, "") && checkField(fx-1, fy+1) && checkField(fx-2, fy) && checkField(fx-2, fy-1) && checkField(fx-1, fy-2) && checkField(fx, fy-2) && checkField(fx+1, fy-1)) {
                            probs[fx][fy]++;
                            probs[fx][fy-1]++;
                            probs[fx-1][fy]++;
                            probs[fx-1][fy-1]++;
                        }
                        if (checkPic(fx, fy-1, "") && checkPic(fx+1, fy-1, "") && checkPic(fx+1, fy, "") && checkField(fx-1, fy-1) && checkField(fx, fy-2) && checkField(fx+1, fy-2) && checkField(fx+2, fy-1) && checkField(fx+2, fy) && checkField(fx+1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx][fy-1]++;
                            probs[fx+1][fy-1]++;
                            probs[fx+1][fy]++;
                        }
                        if (checkPic(fx-1, fy, "") && checkPic(fx-1, fy+1, "") && checkPic(fx, fy+1, "") && checkField(fx-1, fy-1) && checkField(fx-2, fy) && checkField(fx-2, fy+1) && checkField(fx-1, fy+2) && checkField(fx, fy+2) && checkField(fx+1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx][fy+1]++;
                            probs[fx-1][fy]++;
                            probs[fx-1][fy+1]++;
                        }
                        if (checkPic(fx+1, fy, "") && checkPic(fx+1, fy+1, "") && checkPic(fx, fy+1, "") && checkField(fx+1, fy-1) && checkField(fx+2, fy) && checkField(fx+2, fy+1) && checkField(fx+1, fy+2) && checkField(fx, fy+2) && checkField(fx-1, fy+1)) {
                            probs[fx][fy]++;
                            probs[fx][fy+1]++;
                            probs[fx+1][fy+1]++;
                            probs[fx+1][fy]++;
                        }
                        break;
                      default:
                        break;
                    }
                }
            }
            fy++;
            if (fy == y) {
                fy = 0;
                fx++;
            }
        }
        var high = 0;
        for (var i = 0; i < x; i++)
            for (var j = 0; j < y; j++)
                if (probs[i][j] > high)
                    high = probs[i][j];
        var highfields = [];
        fx = 0;
        fy = 0;
        for (var i = 2; i < fields.length; i += 2) {
            if (probs[fx][fy] == high)
                highfields.push(i);
            fy++;
            if (fy == y) {
                fy = 0;
                fx++;
            }
        }
        newField = highfields[Math.floor(Math.random() * highfields.length)];
    }

    while (newField == 0) {
        var rnd = Math.floor(Math.random() * fieldanz);
        field = (rnd+1)*2;
        var pic = fields[field].style.background;
        if (pic != "")
            continue;
        var fx = Math.floor((field-2)/y/2);
        var fy = (field - fx*2*y - 2)/2;
        /*if (forms.indexOf(22) != -1) {
            if (fx == 0 || fx == x-1 || fy == 0 || fy == y-1)
                continue;
            if (checkPic(fx-1, fy, "") && checkPic(fx-1, fy-1, "") && checkPic(fx, fy-1, "") && checkField(fx-2, fy, "") && checkField(fx-2, fy-1, "") && checkField(fx-1, fy-2, "") && checkField(fx, fy-2) && checkField(fx+1, fy-1, "") && checkField(fx+1, fy, "") && checkField(fx, fy+1, "") && checkField(fx-1, fy+1, "") ||
                checkPic(fx, fy-1, "") && checkPic(fx+1, fy-1, "") && checkPic(fx+1, fy, "") && checkField(fx, fy-2, "") && checkField(fx+1, fy-2, "") && checkField(fx+2, fy-1, "") && checkField(fx+2, fy) && checkField(fx+1, fy+1, "") && checkField(fx, fy+1, "") && checkField(fx-1, fy, "") && checkField(fx-1, fy-1, "") ||
                checkPic(fx+1, fy, "") && checkPic(fx+1, fy+1, "") && checkPic(fx, fy+1, "") && checkField(fx, fy-1, "") && checkField(fx+1, fy-1, "") && checkField(fx+2, fy, "") && checkField(fx+2, fy+1) && checkField(fx+1, fy+2, "") && checkField(fx, fy+2, "") && checkField(fx-1, fy+1, "") && checkField(fx-1, fy, "") ||
                checkPic(fx, fy+1, "") && checkPic(fx-1, fy+1, "") && checkPic(fx-1, fy, "") && checkField(fx, fy-2, "") && checkField(fx+1, fy, "") && checkField(fx+1, fy+1, "") && checkField(fx, fy+2) && checkField(fx-1, fy+2, "") && checkField(fx-2, fy+1, "") && checkField(fx-2, fy, "") && checkField(fx-1, fy-1, ""))
                newField = field;
        }*/
        if (checkField(fx-1, fy, "") && checkField(fx, fy-1, "") && checkField(fx+1, fy, "") && checkField(fx, fy+1, ""))
            newField = field;
    }
    fields[newField].click();
    return 2000;
}

var cardset = "";
var field = [];
// ***********************************************************************************************
// ***********************************************************************************************
// play memory
// ***********************************************************************************************
// ***********************************************************************************************
function DoMemory (show) {
    PG_log("DoMemory("+show+")");
    var tbl = document.getElementById("display").getElementsByClassName("gamefield");
    if (tbl.length <= 0)
        return 0;
    var reward = document.getElementById("display").getElementsByClassName("reward");
    if (reward.length > 0)
        if (reward[0].style.display != "none") {
            window.setTimeout(function() {reward[0].click();}, 2000);
            return 3000;
        }
    var free = Number(document.getElementById("counter_free").innerHTML.split(">")[1].split("<")[0]);
    if (free < 1 && !show)
        return 0;
    var gnum = tbl[0].id.split("_")[1];
    var memory = PGu_getValue("memory", "");
    if (memory == "")
        var game = "";
    else
        var game = memory.split(":")[0];
    if (memory == "" || game != gnum) {
        field = [["?", "?", "?", "?"], ["?", "?", "?", "?"],
                         ["?", "?", "?", "?"], ["?", "?", "?", "?"],
                         ["?", "?", "?", "?"]];
    }
    else {
        var mfield = memory.split(":")[1].split("+");
        for (var i = 0; i < mfield.length; i++)
            field[i] = mfield[i].split("-");
        for (var i = 0; i < tbl.length; i++) {
            var id = tbl[i].id.split("_");
            if (field[id[2]][id[3]] == "?")
                continue;
            if (tbl[i].className.indexOf("fielddisabled") != -1 && tbl[i].style.background != "") {
                var anz = 0;
                var card = tbl[i].style.backgroundImage.split(",")[0].split("/").pop().split(".")[0];
                for (var ii = 0; ii < field.length; ii++)
                    for (var j = 0; j < field[ii].length; j++)
                        if (field[ii][j] == card)
                            anz++;
                if (anz < 2) {
                    PG_log ("Fehler festgestellt. Seite wird neu geladen.");
                    window.history.go(0);
                    return 0;
                }
            }
            if  (tbl[i].style.backgroundImage.indexOf("karte_zu") == -1)
                continue;
            var url = tbl[i].style.background.match(/url\(.*karte_/)[0];
            var pos = url.lastIndexOf("/");
            pos = url.lastIndexOf("/", pos-1);
            var apo = (url.indexOf('"') == -1?'':'"');
            tbl[i].style.background = url.substr(0, pos+1) + field[id[2]][id[3]] + '.png' + apo + '),' + tbl[i].style.background.replace("karte_zu", "karte_offen");
        }
    }
    for (var i = 0; i < tbl.length; i++)
        if  (tbl[i].style.backgroundImage.indexOf("karte_zu") != -1)
            // Click-Handler hinzufügen
            tbl[i].addEventListener("click", function(event) {
                if (cardset != this.id) {
                    cardset = this.id;
                    setCard (gnum, field, cardset);
                }
            }, false);

    if (show)
        return 0;

    if (cardset != "")
        return 1000;

    var open = document.getElementById("display").getElementsByClassName("gamefield open");
    var found = "";
    var rnd = -1;
    var save = false;
    if (open.length > 1)
        return 2000;
    if (open.length == 1) {
        var card = open[0].style.backgroundImage.split(",")[0].split("/").pop().split(".")[0];
        if (card == "undefined")
            return 2000;
        var id = open[0].id.split("_");
        if (field[id[2]][id[3]] == "?") {
            field[id[2]][id[3]] = card;
            save = true;
        }
        for (var i = 0; i < field.length && found == ""; i++)
            for (var j = 0; j < field[i].length; j++)
                if (field[i][j] == card && (i != id[2] || j != id[3])) {
                    found = "g_" + gnum + "_" + i + "_" + j;
                    break;
                }
        if (found != "")
            for (var i = 0; i < tbl.length; i++)
                if (tbl[i].id == found) {
                    rnd = i;
                    break;
                }
    }
    if (rnd == -1) {
        for (var i = 0; i < field.length && found == ""; i++)
            for (var j = 0; j < field[i].length && found == ""; j++) {
                if (field[i][j] == "?")
                    continue;
                for (k = i; k < field.length && found == ""; k++)
                    for (l = (k==i?j+1:0); l < field[k].length; l++)
                        if (field[i][j] == field[k][l]) {
                            found = "g_" + gnum + "_" + i + "_" + j;
                            if (document.getElementById(found).className.indexOf("fielddisabled") == -1)
                                break;
                            found = "";
                        }
            }
        if (found != "")
            for (var i = 0; i < tbl.length; i++)
                if (tbl[i].id == found) {
                    tbl[i].click();
                    if (save)
                        saveField(gnum, field);
                    return 1000;
                }
    }
    while (rnd == -1) {
        rnd = Math.floor(Math.random()* tbl.length);
        var id = tbl[rnd].id.split("_");
        if (field[id[2]][id[3]] != "?")
            rnd = -1;
    }
    cardset = tbl[rnd].id;
    tbl[rnd].click();
    window.setTimeout(setCard, 500, gnum, field, cardset);
    return 2000;
}

function setCard (gnum, field, id) {
    var f = document.getElementById(id);
    var card = f.style.backgroundImage.split(",")[0].split("/").pop().split(".")[0];
    if (card == "karte_zu") {
        window.setTimeout(setCard, 1000, gnum, field, id);
        return;
    }
    if (card != "undefined") {
        var ids = id.split("_");
        if (field[ids[2]][ids[3]] == "?") {
            PG_log("Feld " + ids[2] + "/" + ids[3] + " wird gesetzt auf " + card);
            field[ids[2]][ids[3]] = card;
            saveField(gnum, field);
        }
    }
    cardset = "";
    window.setTimeout(DoMemory, 2000, true);
    return;
}

function saveField(gnum, field) {
    var memory = gnum;
    for (var i = 0; i < field.length; i++)
        memory += (i==0?":":"+") + field[i].join("-");
    PGu_setValue("memory", memory);
}

// ***********************************************************************************************
// ***********************************************************************************************
// play the new minigame
// ***********************************************************************************************
// ***********************************************************************************************
function DoNewMinigame (mode) {
    var today = new Date();
    var tagesdatum = FormatDate(today);
    PG_log("DoNewMinigame("+mode+")");
    if (mode == 1) {
        var tbl = document.getElementById("display").getElementsByClassName("cbox")[0];
        var game = "roulette_";
        var className = "chamber";
    }
    else if (mode == 2) {
        var tbl = document.getElementById("display").getElementsByTagName("div")[0];
        if (tbl.innerHTML.indexOf("icon_freispiel") == -1) {
            PGu_setValue("slipgame_date", tagesdatum);
            if (today.getHours() > 12)
                PGu_setValue("slipgame_noon", tagesdatum);
            if (today.getHours() < 12)
                var to = 43500;
            else
                var to = 86400;
            to = (to - today.getHours()*3600-today.getMinutes()*60-today.getSeconds()) * 1000 + today.getTime();
            PGu_setValue("slipgame_wait", to.toString());
            return -1;
        }
        var game = "slipgame_";
        var className = "field";
        var chamber = tbl.getElementsByClassName(className);
        if (chamber.length == 0)
            return -1;
        var pl = Number(chamber[0].innerHTML.split("/").pop().split(".")[0]);
        if (pl >= 1700) {
            PGu_setValue("dispshow_date", 0);
            PGu_setValue("cocktaildate", "xx");
            GM_xmlhttpRequest({method:"GET", url: prothost + '/cocktail/', onload:function(responseDetails) {
                var content = responseDetails.responseText;
                var needed = findCocktail(content, true);
                var maxInd = -1;
                while (maxInd == -1) {
                    var max = -9999;
                    for (var c = 0; c < needed.length; c++)
                        if (needed[c][1] > max) {
                            max = needed[c][1];
                            maxInd = c;
                        }
                    for (var c = 0; c < chamber.length; c++) {
                        var pl = Number(chamber[c].innerHTML.split("/").pop().split(".")[0]);
                        if (pl == needed[maxInd][0]) {
                            chamber[c].click();
                            break;
                        }
                    }
                    if (c == chamber.length) {
                        needed[maxInd][1] = -9999;
                        maxInd = -1;
                    }
                }
            }});
            return 2000;
        }
    }
    else if (mode == 3) {
        var buttons = document.getElementById("display").getElementsByClassName("button_container")[0];
        if (buttons) {
            var div = buttons.getElementsByTagName("div")[1];
            if (div.innerHTML.indexOf("Würfeln") != -1)
                buttons.click();
            else if (div.innerHTML.indexOf("KK") != -1) {
                PGu_setValue("icecubegame", tagesdatum);
                PGu_setValue("dispshow_game", "");
                return 2000;
            }
            else {
                var results = document.getElementById("display").getElementsByClassName("die_results")[0].getElementsByClassName("dice");
                var saved = document.getElementById("display").getElementsByClassName("die_results_saved")[0].getElementsByTagName("div");
                if (saved.length + results.length < 6)
                    return 2000;
                var high = 0;
                var draw = 0;
                var nmbr = -1;
                for (var i = 0; i < results.length; i++) {
                    var dice = results[i].style.backgroundImage;
                    if (dice == "")
                        continue;
                    dice = dice.split("/").pop().split(".")[0].split("_")[1];
                    if (PGu_getValue("icecubekeep"+dice, dice == 6)) {
                        results[i].click();
                        draw++;
                        break;
                    }
                    else if (dice > high) {
                        high = dice;
                        nmbr = i;
                    }
                }
                if (draw == 0 && nmbr >= 0 && div.className.indexOf("disabled") != -1)
                    results[nmbr].click();
                else if (draw == 0 && div.className.indexOf("disabled") == -1)
                    buttons.click();
            }
        }
        return 2000;
    }
    else if (mode == 4) {
        if (!PGu_getValue("cocktailauto", false))
            return 0;
        var content = document.getElementById("content").innerHTML;
        var shaker = document.getElementsByClassName("shaker_content");
        if (shaker.length > 0) {
            var ingred = shaker[0].getElementsByClassName("shaker_img");
            PG_log("Elemente im Shaker: " + ingred.length);
            for (var i = 0; i < ingred.length; i++)
                ingred[i].click();
            content = document.getElementById("content").innerHTML;
        }
        var mixable = findCocktail(content, false);
        if (mixable.length == 0)
            return -1;
        document.getElementById(mixable[0]).click();
        for (var i = 0; i < mixable[1].length; i++)
            document.getElementById("count_"+mixable[1][i]).parentNode.click();
        if (mixable[2] > 0)
            document.getElementById("img_"+mixable[2]).click();
        document.getElementsByClassName("shake_button")[0].click();
        return 4000;
    }
    else if (mode == 5) {
        if (today.getTime() < Number(PGu_getValue("checkNewMinigame", "0")) + 6000) {
            window.setTimeout(CheckNewMinigame, 2000);
            return 0;
        }
        PGu_setValue("checkNewMinigame", String(today.getTime()));
        var content = document.getElementById("content").innerHTML;
        var hendl = content.split("dose_gar.png");
        PG_log("hendl gar = " + hendl.length);
        for (var i = 1; i < hendl.length; i++) {
            var id = hendl[i].split('id="')[1].split('"')[0];
            PG_log("hendl finished, id = " + id);
            setTimeout("document.getElementById('" + id + "').click();", 500+i*500); // fails often if to fast
        }
        if (hendl.length > 1)
            return i*500 + 1000;
        var gas = Number(content.split('id="blackjack_container"')[1].split('class="stats"')[1].split("</span")[0].split(">").pop().trim());
        var hendl = content.split("dose_leer.png");
        PG_log("leer = " + hendl.length + ", gas = " + gas);
        for (var i = 1; i < hendl.length && i <= gas; i++)
            setTimeout("document.getElementsByClassName('countdown_button empty')[0].click();", 500+i*500); // fails often if to fast
        return (hendl.length > 1 && gas >= 1)?i*500+1000:0;
    }
    else if (mode == 6) {
        var cardstat = PGu_getValue("blackjackcards", "");
        if (cardstat == "") {
            var dates = [];
            var days = [];
        }
        else {
            var dates = cardstat.replace(/\+[:\dABDK]*/g, "").split(";");
            var days = cardstat.split(";");
        }
        var ind = dates.indexOf(tagesdatum);
        if (document.getElementsByClassName("presents").length > 0) {
            if (document.getElementsByClassName("presents")[0].innerHTML.indexOf("Kronkorken") != -1) {
                PGu_setValue("blackjack_date", tagesdatum);
                PGu_setValue("blackjack_noon", tagesdatum);
                return 2000;
            }
            if (document.getElementsByClassName("presents")[0].innerHTML.indexOf("blackjack(") != -1) {
                if (ind == -1)
                    PGu_setValue("blackjackcards", cardstat + (cardstat == ""?"":";") + tagesdatum);
                else
                    PGu_setValue("blackjackcards", cardstat + "+");
                document.getElementsByClassName("start")[0].click();
                return 2000;
            }
        }
        var cards = document.getElementsByClassName("cards")[0].innerHTML.split("blackjack/cards/");
        var thisgame = [];
        for (var j = 1; j < cards.length; j++) {
            var card = cards[j].split(".png")[0].trim();
            if (card == "11")
                card = "B";
            else if (card == "12")
                card = "D";
            else if (card == "13")
                card = "K";
            else if (card == "14")
                card = "A";
            thisgame.push(card);
        }
        if (ind == -1) {
            PGu_setValue("blackjackcards", cardstat + (cardstat==""?"":";") + tagesdatum + "+" + thisgame.join(":"));
        }
        else {
            var cardstoday = days[ind].split("+");
            if (cardstoday.length > 1)
                cardstoday.pop();
            cardstoday.push(thisgame.join(":"));
            days[ind] = cardstoday.join("+");
            PGu_setValue("blackjackcards", days.join(";"));
        }
        if (document.getElementsByClassName("finished_button").length > 0) {
            document.getElementsByClassName("finished_button")[0].click();
            return 2000;
        }
        var value = Number(document.getElementsByClassName("presents")[0].getElementsByTagName("div")[0].innerHTML.trim());
        if (value >= PGu_getValue("blackjacklimit", 13)) {
            document.getElementsByClassName("stop active")[0].click();
            return 2000;
        }
        document.getElementsByClassName("draw active")[0].click();
        return 2000;
    }
    else
        return 0;

    if (tbl.innerHTML.indexOf(game) != -1) {
        var chamber = tbl.getElementsByClassName(className);
        if (chamber.length > (game == "roulette_"?1:0)) {
            var rnd = Math.floor(Math.random()* chamber.length);
            chamber[rnd].click();
            return 2000;
        }
    }

    if (tbl.innerHTML.indexOf("_success.png") != -1 || tbl.innerHTML.indexOf("minigame_count") == -1 || tbl.innerHTML.indexOf("roulette_") != -1) {
        PGu_setValue("minigame_success", 1);
        PGu_setValue("minigame_date", tagesdatum);
        if (today.getHours() > 12)
            PGu_setValue("minigame_noon", tagesdatum);
        if (today.getHours() < 12)
            var to = 43500;
        else
            var to = 86400;
        to = (to - today.getHours()*3600-today.getMinutes()*60-today.getSeconds()) * 1000 + today.getTime();
        PGu_setValue("minigame_wait", to.toString());
        return to - today.getTime();
    }
    var trs = tbl.getElementsByTagName("tr");
    for (var j = 0; j < trs.length; j++)
        if (trs[j].innerHTML.indexOf("minigame_count") != -1)
            break;
    if (j == trs.length)
        return 0;

    if (trs[j].innerHTML.indexOf("minigame_countdown") != -1) {
        var span = trs[j].getElementsByTagName("span");
        var seks = 0;
        if (span.length > 0)
            for (var jj = 0; jj < 1; jj++) {
                var timer = span[jj].innerHTML;
                if (timer == done) {
                    seks = 0;
                }
                else if (timer.indexOf(":") != -1) {
                    var time = timer.split(":");
                    seks = (parseInt(time[0])*60 + parseInt(time[1])) * 1000;
                }
            }
        if (seks == 0) {
            unsafeWindow.minigame_show();
            seks = 2000;
        }
        var time = (new Date().getTime()) + seks;
        PGu_setValue("minigame_wait", String(time));
        return seks;
    }
    if (trs[j].style.background.indexOf("_success.png") != -1 || trs[j].style.background.indexOf("_unsuccess.png") != -1 || trs[j].style.background.indexOf("_normal.png") != -1 ||
        trs[j].style.background.indexOf("_success.jpg") != -1 || trs[j].style.background.indexOf("_unsuccess.jpg") != -1 || trs[j].style.background.indexOf("_normal.jpg") != -1) {
        var success = PGu_getValue("minigame_success", 0);
        if (success == 1) {
            if (trs[j].style.background.indexOf("_success.png") == -1 ||
                trs[j].innerHTML.indexOf("minigame_count") != -1) {
                PGu_setValue("minigame_value", -1);
                PGu_setValue("minigame_success", 0);
                success = 0;
            }
            else
                return (86400-today.getHours()*3600-today.getMinutes()*60-today.getSeconds()) * 1000;
            }
        if (success == 0) {
            if (trs[j].style.background.indexOf("_success.png") != -1 || trs[j].innerHTML.indexOf("minigame_count") == -1) {
                PGu_setValue("minigame_success", 1);
                PGu_setValue("minigame_date", tagesdatum);
                PGu_setValue("minigame_noon", tagesdatum);
                return (86400-today.getHours()*3600-today.getMinutes()*60-today.getSeconds()) * 1000;
            }
            else {
                var nextValue = PGu_getValue("minigame_value", -1) + 1;
                var pos = trs[j].innerHTML.indexOf("minigame_count");
                var plnd = trs[j].innerHTML.substr(pos).match(/<img.*src=".*"/);
                if (plnd == null)
                    plnd = [];
                else if (plnd.length > 0 && plnd[0].indexOf("busserl") != -1)
                    plnd = false;
                if (!plnd || plnd.length == 0) {
                    document.getElementById("minigame_count").innerHTML = nextValue%10+1;
                    var sub = trs[j].innerHTML.split("minigame_try('")[1].split("'")[0];
                    unsafeWindow.minigame_try(sub);
                    PGu_setValue("minigame_value", nextValue);
                    return 2000;
                }
                var plndanz = PGu_getValue("minigame_plunderanz", -1);
                if (plndanz == -1) {
                    PGu_setValue("minigame_plunderanz", 0);
                    plnd = plnd[0].split('src="')[1].split('"')[0];
                    var pltab = 6;
                    if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" ||TOWNEXTENSION == "MU")
                        pltab = 1;
                    GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/ajax/?c='+pltab, onload:function(responseDetails) {
                        var content = responseDetails.responseText;
                        PGu_setValue("minigame_plunderreq", String(today.getTime()+300000));
                        var Plnd = content.split(decodeURI(plnd));
                        if (Plnd.length < 2)
                           return;
                        var plndanz = Plnd[1].split("<td")[1].split("<span")[1].split(">")[1].split("<")[0];
                        plndanz = Number(plndanz.split("x ")[1].trim());
                        if (plndanz < nextValue%10+1) {
                            PGu_setValue("minigame_plunderanz", plndanz);
                            return;
                        }
                        PGu_setValue("minigame_plunderanz", plndanz - (nextValue%10+1));
                        document.getElementById("minigame_count").innerHTML = nextValue%10+1;
                        var sub = trs[j].innerHTML.split("minigame_try('")[1].split("'")[0];
                        unsafeWindow.minigame_try(sub);
                        PGu_setValue("minigame_value", nextValue);
                    }});
                    return 0;
                }
                if (plndanz < nextValue%10+1)
                   return 300000;
                PGu_setValue("minigame_value", nextValue);
                PGu_setValue("minigame_plunderanz", plndanz - (nextValue%10+1));
                document.getElementById("minigame_count").innerHTML = nextValue%10+1;
                var sub = trs[j].innerHTML.split("minigame_try('")[1].split("'")[0];
                unsafeWindow.minigame_try(sub);
            }
        }
    }
    return 2000;
}

// ***********************************************************************************************
// ***********************************************************************************************
// check for minigame and play it
// ***********************************************************************************************
// ***********************************************************************************************
function CheckMinigame () {
    PG_log("CheckMinigame");
    if (window.location.pathname.indexOf("/activities/") == -1)
        return;
    var minigames = ["halloween", "summer13", "event/aug13_2"];
    var tbl = document.getElementsByTagName("table");
    for (var i = 0; i < tbl.length; i++) {
        for (var tk = 0; tk < minigames.length; tk++)
            if (tbl[i].innerHTML.indexOf("/" + minigames[tk] + "/") != -1)
                break;
        var trs = tbl[i].getElementsByTagName("tr");
        for (var j = 0; j < trs.length; j++) {
            for (var k = 0; k < minigames.length; k++)
                if (trs[j].innerHTML.indexOf("/" + minigames[k] + "/") != -1)
                    break;
            if (tk < minigames.length || k < minigames.length) {
                var seks = 0;
                if (j + 1 < trs.length) {
                    var span = trs[j+1].getElementsByTagName("span");
                    if (span.length > 0)
                        for (var jj = 0; jj < 1; jj++) {
                            var timer = span[jj].innerHTML;
                            if (timer == done) {
                                seks = 0;
                            }
                            else if (timer.indexOf(":") != -1) {
                                var time = timer.split(":");
                                seks = parseInt(time[0])*60 + parseInt(time[1]);
                            }
                        }
                }
                if (seks > 0) {
                    checkInt = window.setTimeout(CheckMinigame,seks*1000);
                    return;
                }
                else if (trs[j].style.background.indexOf("/success.jpg") != -1 || trs[j].style.background.indexOf("/fail.jpg") != -1 || trs[j].style.background.indexOf("/normal.jpg") != -1) {
                    var success = PGu_getValue("minigame_success", 0);
                    if (success == 1) {
                        if (trs[j].style.background.indexOf("/success.jpg") == -1) {
                            PGu_setValue("minigame_value", -1);
                            PGu_setValue("minigame_success", 0);
                            success = 0;
                        }
                        else
                            checkInt = window.setTimeout(reload, 300000, "CheckMinigame1");
                    }
                    if (success == 0) {
                        if (trs[j].style.background.indexOf("/success.jpg") != -1) {
                            PGu_setValue("minigame_success", 1);
                        }
                        else {
                            var options = trs[j].innerHTML.split('<option');
                            if (options.length == 1) {
                                reload("CheckMinigame2");
                                break;
                            }

                            var nextValue = PGu_getValue("minigame_value", -1) + 1;
                            var nextVal = nextValue % (options.length-1);
                            nextVal = options[nextVal+1].split('<')[0];
                            if (nextVal.startsWith(" value")) {
                                nextVal = nextVal.split('"')[1];
                            }
                            else
                                nextVal = nextVal.substr(1);

                            GM_xmlhttpRequest({
                                       method:"POST",
                                       url: prothost + '/' + minigames[k] + '/minigame/',
                                       headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                       data: encodeURI('minigame_count='+nextVal),
                                       onload:function(responseDetails) {
                                              var pos = responseDetails.responseText.indexOf('/fail.jpg');
                                              if (pos == -1) {
                                                   window.location.href = prothost + '/activities/';
                                              }
                                              else {
                                                   PGu_setValue("minigame_value", nextValue);
                                                   window.location.href = prothost + '/activities/';
                                              }
                            }});
                        }
                    }
                    break;
                }
                else if (k < minigames.length) {
                    window.location.href = prothost + '/' + minigames[k] + '/minigame/';
                }
            }
            else if (trs[j].style.background.search(/\/xmas.*\/minigame/) != -1) {
                var seks = 0;
                if (j + 1 < trs.length) {
                    var span = trs[j+1].getElementsByTagName("span");
                    for (var jj = 0; jj < 1; jj++) {
                        var timer = span[jj].innerHTML;
                        if (timer == done) {
                            seks = 0;
                        }
                        else {
                            var time = timer.split(":");
                            seks = parseInt(time[0])*60 + parseInt(time[1]);
                        }
                    }
                }
                if (seks > 0) {
                    checkInt = window.setTimeout(reload, seks*1000, "CheckMinigame3");
                    return;
                }
                else {
                    var success = PGu_getValue("XmasMini_success", 0);
                    if (success == 1) {
                        if (trs[j].style.background.indexOf("minigame_success") == -1) {
                            PGu_setValue("XmasMini_value", -1);
                            PGu_setValue("XmasMini_success", 0);
                            success = 0;
                        }
                        else
                            checkInt = window.setTimeout(reload, 600000, "CheckMinigame4");
                    }
                    if (success == 0) {
                        if (trs[j].style.background.indexOf("minigame_success") != -1) {
                            PGu_setValue("XmasMini_value", -1);
                            PGu_setValue("XmasMini_success", 1);
                            checkInt = window.setTimeout(reload, 600000, "CheckMinigame5");
                        }
                        else {
                            var options = trs[j].innerHTML.split('<option');
                            if (options.length == 1) {
                                reload("CheckMinigame6");
                                break;
                            }

                            var nextValue = PGu_getValue("XmasMini_value", -1) + 1;
                            var nextVal = nextValue % (options.length-1);
                            nextVal = options[nextVal+1].split('<')[0];
                            if (nextVal.startsWith(" value")) {
                                nextVal = nextVal.split('"')[1];
                            }
                            else
                                nextVal = nextVal.substr(1);
                            var action = trs[j].innerHTML.match(/<form.*action=\"[^\"]*\"/)[0].split('"')[1];

                            GM_xmlhttpRequest({
                                   method:"POST",
                                   url: prothost + action,
                                   headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                   data: encodeURI('minigame_count='+nextVal),
                                   onload:function(responseDetails) {
                                          var pos = responseDetails.finalUrl.indexOf('event=');
                                          if (pos == -1) {
                                               window.location.href = prothost + '/activities/';
                                          }
                                          else {
                                               var rc = parseInt(responseDetails.finalUrl.substr(pos+6));
                                               if (rc == -2)
                                                   alert('Bitte Glühwein kaufen !!');
                                               else {
                                                   PGu_setValue("XmasMini_value", nextValue);
                                                   PGu_setValue("XmasMini_success", (rc==1?1:0));
                                                   window.location.href = responseDetails.finalUrl;
                                               }
                                          }
                            }});
                        }
                    }
                }
                break;
            }
            else if (trs[j].style.background.indexOf("/events/") != -1) {
                //alert(trs[j].style.background);
                var eventpos = trs[j].innerHTML.indexOf('/event/');
                var eventurl = "";
                minigames = ["easter14", "summer14", "krnvl"];
                var multiple = 0;
                for (var k = 0; k < minigames.length; k++)
                    if (tbl[i].innerHTML.indexOf("/" + minigames[k] + "/") != -1)
                        break;
                var dk = (tbl[i].innerHTML.indexOf('span id="counter') != -1?1:2);
                if (eventpos != -1) {
                    var eventposend = trs[j].innerHTML.indexOf('"', eventpos);
                    eventurl = trs[j].innerHTML.substr(eventpos, eventposend - eventpos);
                    if (trs[j].innerHTML.substr(eventpos-8,6) == "action") {
                        var form = trs[j].getElementsByTagName("form")[0].innerHTML;
                        var inputs = form.split("<input");
                        var input = "";
                        for (var ii = 1; ii < inputs.length; ii++) {
                            var name = inputs[ii].split('name="');
                            if (name.length > 1)
                                name = name[1].split('"')[0];
                            else
                                continue;
                            var value = inputs[ii].split('value="');
                            if (value.length > 1)
                                value = value[1].split('"')[0];
                            else
                                continue;
                            if (input != "")
                                input += "&";
                            input += name + "=" + value;
                        }
                        if (k < minigames.length) {
                            var seks = 0;
                            dk = 1;
                            if (j + 1 < trs.length) {
                                var span = trs[j+1].getElementsByTagName("span");
                                if (span.length > 0)
                                    for (var jj = 0; jj < 1; jj++) {
                                        var timer = span[jj].innerHTML;
                                        if (timer == done) {
                                            seks = 0;
                                        }
                                        else if (timer.indexOf(":") != -1) {
                                            var time = timer.split(":");
                                            seks = parseInt(time[0])*60 + parseInt(time[1]);
                                        }
                                    }
                            }
                            if (seks > 0) {
                                checkInt = window.setTimeout(CheckMinigame,seks*1000);
                                return;
                            }
                            else if (trs[j].style.background.indexOf("success.jpg") != -1 || trs[j].style.background.indexOf("unsuccess.jpg") != -1 || trs[j].style.background.indexOf("normal.jpg") != -1) {
                                var success = PGu_getValue("minigame_success", 0);
                                if (success == 1) {
                                    if (trs[j].style.background.indexOf("success.jpg") == -1) {
                                        PGu_setValue("minigame_value", -1);
                                        PGu_setValue("minigame_success", 0);
                                        success = 0;
                                    }
                                    else
                                        checkInt = window.setTimeout(reload, 300000, "CheckMinigame7");
                                }
                                if (success == 0) {
                                    if (trs[j].style.background.indexOf("success.jpg") != -1) {
                                        PGu_setValue("minigame_success", 1);
                                    }
                                    else {
                                        var options = trs[j].innerHTML.split('<option');
                                            if (options.length != 1) {
                                            var nextValue = PGu_getValue("minigame_value", -1) + 1;
                                            var nextVal = nextValue % (options.length-1);
                                            nextVal = options[nextVal+1].split('<')[0];
                                            if (nextVal.startsWith(" value")) {
                                                nextVal = nextVal.split('"')[1];
                                            }
                                            else
                                                nextVal = nextVal.substr(1);
                                            if (input != "")
                                                input += "&";
                                            input += 'minigame_count='+nextVal;
                                            multiple = 1;
                                        }
                                    }
                                }
                            }
                            else if (k < minigames.length) {
                                window.location.href = prothost + '/' + minigames[k] + '/minigame/';
                            }
                        }
                        GM_xmlhttpRequest({
                               method:"POST",
                               url: prothost + eventurl,
                               headers: {'Content-type': 'application/x-www-form-urlencoded'},
                               data: encodeURI(input),
                               onload:function(responseDetails) {
                                  if (multiple == 1)
                                      PGu_setValue("minigame_value", nextValue);
                                  var pos = responseDetails.finalUrl.indexOf('event=');
                                  if (pos == -1 || !multiple) {
                                      window.location.href = prothost + '/activities/';
                                  }
                                  else {
                                      var rc = parseInt(responseDetails.finalUrl.substr(pos+6));
                                      PGu_setValue("minigame_success", (rc==1?1:0));
                                      window.location.href = responseDetails.finalUrl;
                                  }
                               }
                        });
                    }
                    else if (eventurl.indexOf("mayevent") == -1) {
                        window.location.href = prothost + eventurl;
                        GM_setValue(TOWNEXTENSION + "eventURL", eventurl);
                    }
                    break;
                }
                if (j + dk < trs.length) {
                    var seks = 0;
                    var span = trs[j+dk].getElementsByTagName("span");
                    for (var jj = 0; jj < 1; jj++) {
                        var timer = span[jj].innerHTML;
                        if (timer == done) {
                            seks = 0;
                        }
                        else {
                            var time = timer.split(":");
                            seks = parseInt(time[0])*60 + parseInt(time[1]);
                        }
                    }
                    if (seks > 0) {
                        checkInt = window.setTimeout(reload, seks*1000, "CheckMinigame8");
                        return;
                    }
                    else {
                        var eventurl = PG_getValue(TOWNEXTENSION + "eventURL", "");
                        if (eventurl != "")
                            window.location.href = prothost + eventurl;
                    }
                }
                break;
            }
        }
    }
}

function insertCheckBox(mode, loaded) {
    var submitBtn = "   Submit2";
    if (document.getElementsByName(submitBtn).length == 0)
        submitBtn = "Submit2";
    submitBtn = document.getElementsByName(submitBtn)[0];
    if (mode == 0) {
        var newtd = document.createElement("td");
        newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
        newtd.innerHTML = '<input name="BCCheckbox" id="BCCheckbox" type="checkbox"><span style="vertical-align: bottom">&nbsp;Automatisch sammeln</span>&nbsp;&nbsp;<input name="KWCheckbox" id="KWCheckbox" type="checkbox"><span style="vertical-align: bottom">&nbsp;ohne Erinnerung</span><br><input name="STWCheckbox" id="STWCheckbox" type="checkbox"><span style="vertical-align: bottom">&nbsp;mit Stadtteilwahl</span>';
        submitBtn.parentNode.appendChild(newtd, document.getElementsByName("xycoords")[0]);
        document.getElementById("BCCheckbox").checked = PGu_getValue("AutoCollect", false);
        // Click-Handler hinzufügen
        document.getElementById("BCCheckbox").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("AutoCollect", this.checked);
            if (this.checked) {
                var timeOptions = document.getElementsByName("time")[0];
                PGu_setValue(nameLastCollectTime, timeOptions.selectedIndex);
                }
        }, false);
        document.getElementById("KWCheckbox").checked = PGu_getValue("AutoCollectKW", false);
        // Click-Handler hinzufügen
        document.getElementById("KWCheckbox").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("AutoCollectKW", this.checked);
        }, false);
        document.getElementById("STWCheckbox").checked = PGu_getValue("chooseDistrict", true);
        document.getElementById("STWCheckbox").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("chooseDistrict", this.checked);
            window.location.href = prothost + '/activities/';
        }, false);
        if (!loaded)
            return;
    }
    if (PGu_getValue("chooseDistrict", true))
        trace('Get ' + prothost + '/city/district/', 2);
        GM_xmlhttpRequest({method:"GET", url: prothost + '/city/district/', onload:function(responseDetails) {
            var content = responseDetails.responseText;
            // Wenn die Seite abgerufen werden konnte (kein Seitenladefehler)
            if (content.indexOf("<strong>Mein Penner</strong>") != -1) {
                var district = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[0].innerHTML.split(":").pop().trim();
                var districts = content.split('class="pet_tab_help"')[1].split("<table ")[1].split("</table")[0].split("/city/district/buy/");
                var option = '<option value="0"> </option> ';
                var foption = '<option value="0"> </option> ';
                var fastest = 0;
                var setfast = "";
                var dist = [];
                var hdist = [];
                var mplunder = [];
                var mpdist = [];
                if (missionContent != "") {
                    var missions = missionContent.split('class="gang_mission"');
                    if (missions.length > 1) {
                        for (var i = 1; i < missions.length; i++) {
                            var lis = missions[i].split("stage_area")[1].split("<li>");
                            for (var j = 1; j < lis.length; j++) {
                                var beg = lis[j].split('"amount"');
                                if (beg.length > 1) {
                                    var list = lis[j].match(/show_.*city_list.*activate'/);
                                    if (list != null) {
                                        if (list[0].indexOf("deactivate") != -1) {
                                            var plnd = beg[0].split("<span>")[1].split("<")[0].trim();
                                            mplunder.push(plnd);
                                            var dlist = missions[i].split("stage_area")[1].split("<ul>").pop().split("</ul>")[0].split("<li>");
                                            dlist.splice(0, 1);
                                            for (var k = 0; k < dlist.length; k++)
                                                dlist[k] = dlist[k].split("<")[0].trim();
                                            mpdist.push(dlist);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                dist["0"] = "";
                for (var i = 1; i < districts.length; i++) {
                    var distr = districts[i].split("</span")[0].split(">").pop().trim();
                    if (districts[i].indexOf('value="Kaufen"') == -1) {
                        var nr = districts[i].split('value="')[1].split('"')[0];
                        var ff = Number(districts[i].split("<td")[4].split("</td")[0].split(">").pop().replace("&nbsp;", "").trim());
                        var bonus = districts[i].split("<td")[5].split("<span").pop().split("</span")[0].replace("<br/>", " ").split(">").pop().trim();
                        if (bonus == "frei")
                            bonus = "";
                        else if (bonus != "")
                            bonus = " (" + bonus.replace("&nbsp;", " ") + ")";
                        var fmtch = districts[i].replace(/&nbsp;/g, " ").match(/\d+% schneller Sammeln/);
                        option += '<option value="' + nr + '">' + distr + '</option> ';
                        if (bonus.indexOf("schneller Sammeln") != -1) {
                            foption += '<option value="' + nr + '">' + distr + bonus + '</option>';
                            var proz = Number(bonus.match(/\d+/)[0]);
                            if (proz >= fastest) {
                                if (proz > fastest || distr == district || distr == PGu_getValue("befDistrict", "0;").split(";")[1])
                                    setfast = nr + ";" + distr;
                                fastest = proz;
                            }
                        }
                        else {
                            if (bonus.indexOf("mehr " + flaschentxt) != -1)
                                moption += '<option value="' + nr + '">' + distr + " (FF: " + ff + ")" + bonus + '</option> ';
                            else
                                moption += '<option value="' + nr + '">' + distr + '</option> ';
                        }
                        hdist.push([ff, nr, distr, bonus]);
                        dist[nr] = distr;
                    }
                    else {
                        if (PGu_getValue("homeDistrict", "0;" + distr).split(";")[1] == distr)
                            PGu_setValue("homeDistrict", "");
                        if (PGu_getValue("befDistrict", "0;" + distr).split(";")[1] == distr)
                            PGu_setValue("befDistrict", "");
                        if (PGu_getValue("aftDistrict", "0;" + distr).split(";")[1] == distr)
                            PGu_setValue("aftDistrict", "");
                    }
                }
                if (hdist.length < 2)
                    PGu_setValue("chooseDistrict", false);
                else {
                    hdist.sort(function(a,b) {return a[0]>b[0]?-1:(a[0]<b[0]?1:(a[2]<b[2]?-1:1));});
                    var hoption = '<option value="0"> </option> ';
                    var moption = '<option value="0"> </option> ';
                    for (var i = 0; i < hdist.length; i++) {
                        var mplnd = [];
                        for (var j = 0; j < mpdist.length; j++)
                            if (mpdist[j].indexOf(hdist[i][2]) != -1)
                                mplnd.push(mplunder[j]);
                        if (mplnd.length > 0)
                            mplnd = " (" + mplnd.join(", ") + ")";
                        else
                            mplnd = "";
                        bonus = hdist[i][3];
                        hoption += '<option value="' + hdist[i][1] + '">' + hdist[i][2] + mplnd + " (FF: " + hdist[i][0] + ")" + bonus + '</option> ';
                        if (hdist[i][3].indexOf("mehr " + flaschentxt) == -1)
                            bonus = "";
                        moption += '<option value="' + hdist[i][1] + '">' + hdist[i][2] + mplnd + " (FF: " + hdist[i][0] + ")" + bonus + '</option> ';
                    }

                    if (fastest == 0)
                        foption = option;
                    else
                        PGu_setValue("befDistrict", setfast);
                    var homeDist = PGu_getValue("homeDistrict", "0;" + district);
                    var befDist = PGu_getValue("befDistrict", "0;" + district);
                    var aftDist = PGu_getValue("aftDistrict", "0;" + district);
                    var newtd2 = document.createElement("span");
                    var newtd3 = document.createElement("span");
                    var newtd4 = document.createElement("span");
                    newtd2.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                    newtd3.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                    newtd4.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                    newtd2.innerHTML = '<form name="cityhome" id="cityhome">Heimatstandort: <input id="movehom" style="visibility:hidden; float:right; position:relative; top:-5px" type="button" value="nach ' + homeDist.split(";")[1] + ' ziehen"> <select id="cityhomeid" name="cityhomeid"> ' + hoption + ' </select>';
                    newtd3.innerHTML = '<form style="padding-top: 10px" name="citybefore" id="citybefore">vor Start wechseln nach: <input id="movebef" style="visibility:hidden; float:right; position:relative; top:-5px" type="button" value="nach ' + befDist.split(";")[1] + ' ziehen"> <select id="citybefid" name="citybefid"> ' + foption + ' </select>';
                    newtd4.innerHTML = '<form style="padding-top: 10px; padding-bottom: 10px" name="cityafter" id="cityafter">vor Ausleeren wechseln nach: <input id="moveaft" style="visibility:hidden; float:right; position:relative; top:-5px" type="button" value="nach ' + aftDist.split(";")[1] + ' ziehen"> <select id="cityaftid" name="cityaftid"> ' + moption + ' </select>';
                    submitBtn.parentNode.appendChild(newtd2, document.getElementsByName("xycoords")[0]);
                    submitBtn.parentNode.appendChild(newtd3, document.getElementsByName("xycoords")[0]);
                    submitBtn.parentNode.appendChild(newtd4, document.getElementsByName("xycoords")[0]);
                    document.getElementById("cityhomeid").value = PGu_getValue("homeDistrict", "0").split(";")[0];
                    document.getElementById("citybefid").value = PGu_getValue("befDistrict", "0").split(";")[0];
                    document.getElementById("cityaftid").value = PGu_getValue("aftDistrict", "0").split(";")[0];
                    if (homeDist.split(";")[0] != "0" && homeDist.split(";")[1] != district) {
                        document.getElementById("movehom").value = "nach " + homeDist.split(";")[1] + " ziehen";
                        document.getElementById("movehom").style.visibility = "";
                    }
                    document.getElementById("movehom").addEventListener("click", function(event) {
                        moveTo(homeDist.split(";")[0], "", "");
                    }, false);
                    if (befDist.split(";")[0] != "0" && befDist.split(";")[1] != district) {
                        document.getElementById("movebef").value = "nach " + befDist.split(";")[1] + " ziehen";
                        document.getElementById("movebef").style.visibility = "";
                    }
                    document.getElementById("movebef").addEventListener("click", function(event) {
                        moveTo(befDist.split(";")[0], "", "");
                    }, false);
                    if (aftDist.split(";")[0] != "0" && aftDist.split(";")[1] != district) {
                        document.getElementById("moveaft").value = "nach " + aftDist.split(";")[1] + " ziehen";
                        document.getElementById("moveaft").style.visibility = "";
                    }
                    document.getElementById("moveaft").addEventListener("click", function(event) {
                        moveTo(aftDist.split(";")[0], "", "");
                    }, false);
                    // Click-Handler hinzufügen
                    document.getElementById("cityhomeid").addEventListener("change", function(event) {
                        // Klickstatus speichern
                        if (this.value == "0") {
                            PGu_setValue("homeDistrict", "");
                            document.getElementById("movehom").style.visibility = "hidden";
                        }
                        else {
                            homeDist = this.value + ";" + dist[this.value];
                            PGu_setValue("homeDistrict", homeDist);
                            if (dist[this.value] != district) {
                                document.getElementById("movehom").value = "nach " + homeDist.split(";")[1] + " ziehen";
                                document.getElementById("movehom").style.visibility = "";
                            }
                            else
                                document.getElementById("movehom").style.visibility = "hidden";
                        }
                    }, false);
                    document.getElementById("citybefid").addEventListener("change", function(event) {
                        // Klickstatus speichern
                        if (this.value == "0") {
                            PGu_setValue("befDistrict", "");
                            document.getElementById("movebef").style.visibility = "hidden";
                        }
                        else {
                            befDist = this.value + ";" + dist[this.value];
                            PGu_setValue("befDistrict", befDist);
                            if (dist[this.value] != district) {
                                document.getElementById("movebef").value = "nach " + befDist.split(";")[1] + " ziehen";
                                document.getElementById("movebef").style.visibility = "";
                            }
                            else
                                document.getElementById("movebef").style.visibility = "hidden";
                        }
                    }, false);
                    document.getElementById("cityaftid").addEventListener("change", function(event) {
                        // Klickstatus speichern
                        if (this.value == "0") {
                            PGu_setValue("aftDistrict", "");
                            document.getElementById("moveaft").style.visibility = "hidden";
                        }
                        else {
                            aftDist = this.value + ";" + dist[this.value];
                            PGu_setValue("aftDistrict", aftDist);
                            if (dist[this.value] != district) {
                                document.getElementById("moveaft").value = "nach " + aftDist.split(";")[1] + " ziehen";
                                document.getElementById("moveaft").style.visibility = "";
                            }
                            else
                                document.getElementById("moveaft").style.visibility = "hidden";
                        }
                    }, false);
                }
            }
            else
                trace("Fehler beim Laden", 2);
        }});
}
function insertCheckBox2(loaded) {
    var newtd = document.createElement("td");
    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
    var male = "";
    if (PGu_getValue("AutoCrime", false))
        male = " (noch " + PGu_getValue("AutoCrimeFkt", 0) + " Mal)";
    newtd.innerHTML = '<input name="SCCheckbox" id="SCCheckbox" type="checkbox"><span style="vertical-align: bottom">&nbsp;Automatisch starten' + male + '</span>';
    var buttons = document.getElementsByTagName("button");
    if (buttons.length > 0)
        var button = buttons[0];
    else {
        buttons = document.getElementsByName("xycoords");
        var button = buttons[buttons.length-1];
    }
    button.parentNode.insertBefore(newtd, button);
    document.getElementById("SCCheckbox").checked = PGu_getValue("AutoCrime", false);
    // Click-Handler hinzufügen
    document.getElementById("SCCheckbox").addEventListener("click", function(event) {
        // Klickstatus speichern
        if (this.checked) {
            if (PGu_getValue("AutoCrimePic", "") == "") {
                alert("Bitte erst " + crimetxt + " festlegen !!");
                this.checked = false;
            }
            if (PGu_getValue("AutoCrimeFkt", -1) <= 0)
                PGu_setValue("AutoCrimeFkt", 1);
        }
        PGu_setValue("AutoCrime", this.checked);
        reload("insertCheckBox2");
    }, false);
}

function insertCheckBox3(button) {
    var crimepic = button.parentNode.parentNode.innerHTML.split('plunder_crime/')[1].split('"')[0];
    var name = 'CbButton_' + crimepic;
    var newtd = document.createElement("td");
    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
    newtd.innerHTML = '<input name="CbCrime" id="' + name +'" type="checkbox"><span style="vertical-align: bottom">&nbsp;diese' + (TOWNEXTENSION!="VT"&&TOWNEXTENSION!="AT"?"s ":" ") + crimetxt + '&nbsp;&nbsp;</span><input name="CbCrimeFkt" style="width:30px" id="' + name +'Fkt"><span style="vertical-align: bottom">mal automatisch starten</span>';
    button.parentNode.appendChild(newtd, button);
    var crimep = PGu_getValue("AutoCrimePic", "");
    if (crimep == crimepic) {
        document.getElementById(name).checked = true;
        document.getElementById(name+"Fkt").value=PGu_getValue("AutoCrimeFkt",1);
    }
    // Click-Handler hinzufügen
    document.getElementById(name+"Fkt").addEventListener("change", function(event) {
        var crimeFkt = parseInt(document.getElementById(this.id).value);
        if (isNaN(crimeFkt))
            crimeFkt = 1;
        document.getElementById(this.id).value = crimeFkt;
        PGu_setValue("AutoCrimeFkt", crimeFkt);
    }, false);


    // Click-Handler hinzufügen
    document.getElementById(name).addEventListener("click", function(event) {
        var crimepic = this.id.split("_")[1];
        crimepic = this.parentNode.parentNode.parentNode.innerHTML.split('plunder_crime/')[1].split('"')[0];
        if (this.parentNode.parentNode.innerHTML.split("start_crime(").length > 1)
            var crimeNr = this.parentNode.parentNode.innerHTML.split("start_crime(")[1].split(")")[0];
        else
            var crimeNr = 0;
        // Klickstatus speichern
        if (this.checked) {
            PGu_setValue("AutoCrime", true);
            PGu_setValue("AutoCrimePic", crimepic);
            PGu_setValue("AutoCrimeNr", crimeNr);
            var crimeFkt = parseInt(document.getElementById(this.id+"Fkt").value);
            if (isNaN(crimeFkt) || crimeFkt <= 0)
                crimeFkt = 1;
            document.getElementById(this.id+"Fkt").value = crimeFkt;
            PGu_setValue("AutoCrimeFkt", crimeFkt);
            var buttons = document.getElementsByName("CbCrime");
            for (var i = 0; i < buttons.length; i++) {
                var crimep = buttons[i].parentNode.parentNode.parentNode.innerHTML.split('plunder_crime/')[1].split('"')[0];
                if (crimepic != crimep) {
                    document.getElementById(buttons[i].id).checked = false;
                    document.getElementById(buttons[i].id+"Fkt").value = "";
                }
            }
        }
        else {
            PGu_setValue("AutoCrimePic", "");
            PGu_setValue("AutoCrimeNr", 0);
            PGu_setValue("AutoCrimeFkt", 0);
            PGu_setValue("AutoCrime", false);
        }
    }, false);
}
function insertCheckBox4() {
    var newtd = document.createElement("li");
    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
    newtd.innerHTML = '<input name="GSCheckbox" id="GSCheckbox" type="checkbox"><span style="vertical-align: bottom">&nbsp;Geld automatisch einsacken</span>';
    var town = ["HH", "B", "MU", "HR", "K"];
    var sptown = (town.indexOf(TOWNEXTENSION) != -1);
    if (sptown) {
        var option = '<option value="4everproxy">4everproxy.com</option> ';
        newtd.innerHTML += '<form name="spsammler" id="spsammler" style="visibility:hidden" >Spenden sammeln über: <select id="spsammlerid" name="spsammlerid"> ' + option + ' </select> </form>';
    }
    var tieritems = document.getElementsByClassName("tieritemA");
    for (var i = 0; i < tieritems.length; i++) {
        if (tieritems[i].innerHTML.indexOf("minijobs") != -1 || tieritems[i].innerHTML.indexOf("change_please") != -1) {
            var lis = tieritems[i].getElementsByClassName("double");
            if (lis.length == 0)
                lis = tieritems[i].getElementsByClassName("first");
            lis = lis[lis.length-1].getElementsByTagName("li");
            lis[lis.length-1].parentNode.appendChild(newtd, lis[lis.length-1]);
            document.getElementById("GSCheckbox").checked = PGu_getValue("getSalary", false);
            if (sptown) {
                if (PGu_getValue("getSalary", false))
                    document.getElementById("spsammler").style.visibility = "visible";
                document.getElementById("spsammlerid").value = PG_getValue("spendensammler", "4everproxy");
            }
            // Click-Handler hinzufügen
            document.getElementById("GSCheckbox").addEventListener("click", function(event) {
                // Klickstatus speichern
                PGu_setValue("getSalary", this.checked);
                GM_deleteValue("4everproxy");
                PGu_delete("spendenwait");
                PGu_delete("spendenrest");
                if (sptown) {
                    if (this.checked)
                        document.getElementById("spsammler").style.visibility = "visible";
                    else
                        document.getElementById("spsammler").style.visibility = "hidden";
                }
            }, false);
            // Click-Handler hinzufügen
            if (sptown)
                document.getElementById("spsammlerid").addEventListener("change", function(event) {
                    PG_setValue("spendensammler", this.value);
                }, false);
        }
    }
}

function selectcraft(i, craftlist, usedPlunder, tr) {
    function handleClick(id, value) {
        // neuen Wert speichern
        var craftnr = id.replace("craftid", "");
        if (value == "0")
            usedPlunder.splice(craftnr, 1);
        else {
            usedPlunder[craftnr] = value;
            PGu_setValue("craftindex", 0);
        }
        PGu_setValue("craftlist", usedPlunder.join(";"));
        for (var i = 0; document.getElementById("craftid"+i); i++) {
            if (i == usedPlunder.length - 1) {
                if (document.getElementById("craftid"+(i+1)))
                    document.getElementById("craft"+(i+1)).parentNode.parentNode.style.visibility = "visible";
                else {
                    var newtd = document.createElement("td");
                    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                    var newtr = document.createElement("tr");
                    var option = '<option value="0"> </option> ';
                    for (var j = 0; j < craftlist.length; j++) {
                        var pos = usedPlunder.indexOf(craftlist[j][1]);
                        if (pos == -1)
                            option += '<option value="' + craftlist[j][1] + '">' + craftlist[j][0] + '</option> ';
                    }
                    newtd.innerHTML = '<form name="craft' + (i+1) + '" id="craft' + (i+1) + '">wenn nicht möglich, dann: <select id="craftid' + (i+1) +'" name="craftid' + (i+1) + '"> ' + option + ' </select> </form>';
                    newtr.appendChild(newtd, newtr);
                    tr.parentNode.appendChild(newtr, tr);
                    // Click-Handler hinzufügen
                    document.getElementById("craftid"+(i+1)).addEventListener("change", function(event) {
                        handleClick(this.id, this.value);
                    }, false);
                    continue;
                }
            }
            if (i > usedPlunder.length) {
                document.getElementById("craft"+i).parentNode.parentNode.style.visibility = "hidden";
                continue;
            }
            var option = '<option value="0"> </option> ';
            for (var j = 0; j < craftlist.length; j++) {
                var pos = usedPlunder.indexOf(craftlist[j][1]);
                if (pos == -1 || pos == i)
                    option += '<option value="' + craftlist[j][1] + '">' + craftlist[j][0] + '</option> ';
            }
            document.getElementById("craftid"+i).innerHTML = option;
            document.getElementById("craftid"+i).value = i < usedPlunder.length?usedPlunder[i]:"0";
        }
    }

    var option = '<option value="0"> </option> ';
    for (var j = 0; j < craftlist.length; j++) {
        var pos = usedPlunder.indexOf(craftlist[j][1]);
        if (pos == -1 || pos == i)
            option += '<option value="' + craftlist[j][1] + '">' + craftlist[j][0] + '</option> ';
    }
    var newtd = document.createElement("td");
    var newtr = document.createElement("tr");
    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
    var pid = i < usedPlunder.length?usedPlunder[i]:"0";
    newtd.innerHTML = '<form name="craft' + i + '" id="craft' + i + '">' + (i==0?"Plunder basteln":"wenn nicht möglich, dann") + ': <select id="craftid' + i +'" name="craftid' + i + '"> ' + option + ' </select> </form>';
    newtr.appendChild(newtd, newtr);
    tr.parentNode.appendChild(newtr, tr);
    document.getElementById("craftid"+i).value = pid;
    if (!PGu_getValue("autoDaily", false))
        document.getElementById("craft"+i).parentNode.parentNode.style.visibility = "hidden";
    else
        document.getElementById("craft"+i).parentNode.parentNode.style.visibility = "visible";
    // Click-Handler hinzufügen
    document.getElementById("craftid"+i).addEventListener("change", function(event) {
        handleClick(this.id, this.value);
    }, false);
}
    var eventPlunder = [
        "Geschenk", "Weihnachtsmütze", "Schere", "Kölner Plörre", "Gebiss",
        "Lupe", "Rote Weihnachtssocke", "Grüne Weihnachtssocke", "Gelbe Weihnachtssocke",
        "Dynamit", "Zwiebelkuchen", "Wollhandschuhe", "Eispickel", "Karnevalströte",
        "Roter Partyballon", "Grüner Partyballon", "Gelber Partyballon",
        "Hasenpfote", "Plüschhäschen","Hacke", "Hacke",
        "Molotowcocktail", "Absperrung", "Farbflutkiosk", "Mülleimer", "Polizeiwagen", "Bullenbully",
        "Rabattflyer", "Schwarzer Nagellack", "George Clooney Double",
        "Gutscheincode", "Nagellackentferner", "Johnny Depp Original",
        "Fußballerina", "Schlüpper", "BH", "Dildo",
        "Orange", "Banane", "Maracuja", "Ananas", "Kokusnuss", "Erdbeere", "Apfel", "Limette",
        "Strohhalm", "Cocktailkirsche", "Cocktailschirmchen", "Minzblättchen",
        "Fruchtschalenspirale", "Physalis", "Cocktailglas", "Eiswürfel"];
    var evPlunder = [];

function getPlunderlist(k, pltab, allplunderArr, tr, mincost, allplunder, plunderlist, link)
{
    function buildSelectBox(allplunderArr, tr, mode, mincost) {
        var newtd = document.createElement("td");
        var newtr = document.createElement("tr");
        newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
        var option = '<option value="0"> </option> ';
        for (var i = 0; i < allplunderArr.length; i++)
            if (allplunderArr[i][4] >= mincost)
                option += '<option value="' + allplunderArr[i][2] + '">' + allplunderArr[i][0] + ' [x' + allplunderArr[i][1] + '] (' + allplunderArr[i][3] + ')</option> ';
        var pid = PGu_getValue("sellPlunder" + (mode==0?"":mode), 0);
        var text = "Plunder verkaufen" + (mode==0?"":", wenn kein Geld mehr");
        newtd.innerHTML = '<form name="plunderdef' + mode + '" id="plunderdef' + mode + '">' + text + ': <select id="pid' + mode + '" name="pid' + mode + '"> ' + option + ' </select> </form>';
        newtr.appendChild(newtd, newtr);
        tr.parentNode.appendChild(newtr, tr);
        document.getElementById("pid" + mode).value = pid;
        if (!PGu_getValue("autoDaily", false) && mode == 0)
            document.getElementById("plunderdef"+mode).parentNode.parentNode.style.visibility = "hidden";
        else
            document.getElementById("plunderdef"+mode).parentNode.parentNode.style.visibility = "visible";
        // Click-Handler hinzufügen
        document.getElementById("pid"+mode).addEventListener("change", function(event) {
            // neuen Wert speichern
            PGu_setValue("sellPlunder"+(mode==0?"":mode), this.value);
        }, false);
    }
    if (pltab == 0) {
        trace('Get ' + prothost + '/stock/plunder/', 2);
        GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/', onload:function(responseDetails) {
            var content = responseDetails.responseText.split('id="plundertab"')[1];
            var lis = content.split("</ul>")[0].split("<li>");
            pltab = lis.length - 1;
            link = lis[1].split('href="')[1].split("=")[0] + "=";
            getPlunderlist(k, pltab, allplunderArr, tr, mincost, allplunder, plunderlist, link);
        }});
        return;
    }

    trace('Get ' + prothost + link + k, 2);
    GM_xmlhttpRequest({method:"GET", url: prothost + link + k, onload:function(responseDetails) {
        var content = responseDetails.responseText;

        var trs = content.split("<tr ");
        for (var i = 1; i < trs.length; i++) {
            var plname = trs[i].split(">x ")[0].split("</strong")[0].split(">").pop().trim();
            var plAnz = trs[i].split(">x ")[1].split("<")[0].trim();
            var pid = trs[i].split('pm_')[1].split("'")[0].trim();
            var cost = trs[i].split("show_multiple_sell")[1].split("<li>")[1].split("</li>")[0].split("(")[1].match(/ .*[\d.,]+/)[0].trim();
            var cost2 = Number(cost.match(/[\d.,]+/)[0].replace(/[.,]/g, ""));
            if (plunderlist.indexOf(plname) == -1) {
                var misspl = 0;
                if (trs[i].indexOf('"pinfo2"') != -1)
                    if (trs[i].split('"pinfo2"')[1].indexOf("Missionsplunder") != -1 ||
                        trs[i].split('"pinfo2"')[1].indexOf("Bandenmission") != -1)
                        misspl = 1;
                allplunder.push(plname+":"+misspl);
                plunderlist.push(plname);
            }
            for (var j = 0; j < allplunderArr.length; j++)
                if (allplunderArr[j][4] < cost2)
                    break;
            allplunderArr.splice(j, 0, [plname, plAnz, pid, cost, cost2]);
            if (eventPlunder.indexOf(plname) != -1)
                evPlunder.push(allplunderArr[j]);
        }
        if (k < pltab)
            getPlunderlist(k+1, pltab, allplunderArr, tr, mincost, allplunder, plunderlist, link);
        else {
            PG_setValue("allplunder", allplunder.join(";"));
            var evCost = 0;
            var evAnz = 0;
            var title = "";
            var e = document.createElement('div');
            for (var j = 0; j < evPlunder.length; j++) {
                evAnz += Number(evPlunder[j][1]);
                evCost = evCost + Number(evPlunder[j][1]) * evPlunder[j][4];
                e.innerHTML = evPlunder[j][3];
                title += '<tr><td style="border-bottom:0px">' + evPlunder[j][1] + "x " + evPlunder[j][0] + " (" + e.childNodes[0].nodeValue + ')</td></tr>';
            }
            /*
            title = '<tr><td style="font-size:16px;border-bottom:0px">Du besitzt ' + evAnz + " Stück Eventplunder im Wert von " + e.childNodes[0].nodeValue.match(/[^\d]+/)[0] + Math.floor(evCost/100) + "," + evCost.toString().substr(-2) + ":</td></tr><br>" + title;
            var today = new Date();
            var tagesdatum = FormatDate(today);
            if (evPlunder.length > 0) {
                if (tagesdatum <= "2015-09-10" && PGu_getValue("eventPlunderWarning", "") < tagesdatum) {
                    e.innerHTML = evPlunder[0][3];
                    alert("Du besitzt " + evAnz + " Stück Eventplunder im Wert von " + e.childNodes[0].nodeValue.match(/[^\d]+/)[0] + Math.floor(evCost/100) + "," + evCost.toString().substr(-2));
                    PGu_setValue("eventPlunderWarning", tagesdatum);
                }
            var newtr2 = document.createElement("tr");
            var newtd2 = document.createElement("input");
            newtd2.id = 'sellEventPlnd';
            newtd2.type = 'button';
            newtd2.value = 'Eventplunder verkaufen';
            newtd2.onmouseover = function () { document.getElementById("eventPlunderInfo").style.display = "" };
            newtd2.onmouseout = function () { document.getElementById("eventPlunderInfo").style.display = "none" };
            var width = 450;
            var newspan = document.createElement('span');
            newspan.id = "eventPlunderInfo";
            newspan.style.width = width+"px";
            newspan.style.color = "white";
            newspan.style.backgroundColor = "#505050";
            newspan.style.fontSize = "12px";
            newspan.style.position = "absolute";
            newspan.style.display = "none";
            newspan.style.zIndex = "100";
            newspan.innerHTML = '<table>' + title + '</table>';
            newtr2.appendChild(newtd2, newtr2);
            newtr2.appendChild(newspan);
            tr.parentNode.appendChild(newtr2, tr);
            document.getElementById("sellEventPlnd").addEventListener("click", function(event) {
                sellManyPlunder(evPlunder);
            }, false);
            var newtd3 = document.createElement("td");
            var newtr3 = document.createElement("tr");
            newtd3.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtd3.innerHTML = '<input name="eventPlndNoRem" id="eventPlndNoRem" type="checkbox"><span style="vertical-align: bottom">&nbsp;Nicht mehr an Eventplunderverkauf erinnern</span>';
            newtr3.appendChild(newtd3, newtr3);
            tr.parentNode.appendChild(newtr3, tr);
            document.getElementById("eventPlndNoRem").checked = PGu_getValue("eventPlunderWarning", tagesdatum) >= '2015-09-10';
            // Click-Handler hinzufügen
            document.getElementById("eventPlndNoRem").addEventListener("change", function(event) {
                // neuen Wert speichern
            if (this.checked)
                        PGu_setValue("eventPlunderWarning", '2015-09-30');
            else
                        PGu_setValue("eventPlunderWarning", tagesdatum);
                }, false);
            }
            */
            buildSelectBox(allplunderArr, tr, 1, mincost);
            if (expertMode) {
                var newtd0 = document.createElement("td");
                var newtr0 = document.createElement("tr");
                newtd0.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                var dtsitttime = PGu_getValue("dtsitttime", latestDTtime);
                newtd0.innerHTML = '<form name="dtsitting" id="dtsitting"><input name="dtsittingChb" id="dtsittingChb" type="checkbox" style="vertical-align:middle"><span style="vertical-align: middle">&nbsp;wenn bis <input id="dtsitthr" name="dtsitthr" style="width:20px;text-align:right">:<input id="dtsittmi" name="dtsittmi" style="width:20px"> nicht erledigt, dann per Sitting erledigen</span></form>';
                newtr0.appendChild(newtd0, newtr0);
                tr.parentNode.appendChild(newtr0, tr);
                document.getElementById("dtsittingChb").checked = PGu_getValue("dtsitting", false) && m_ownusername.toLowerCase() == GM_getValue(host + "_username", "").toLowerCase();
                // Click-Handler hinzufügen
                document.getElementById("dtsittingChb").addEventListener("change", function(event) {
                    // neuen Wert speichern
                    if (this.checked)
                        if (m_ownusername.toLowerCase() != GM_getValue(host + "_username", "").toLowerCase()) {
                            alert("Passwort unbekannt. Bitte neu einloggen.");
                            this.checked = false;
                            return;
                        }
                    PGu_setValue("dtsitting", this.checked);
                }, false);
                document.getElementById("dtsitthr").value = dtsitttime.split(":")[0];
                document.getElementById("dtsittmi").value = dtsitttime.split(":")[1];
                if (PGu_getValue("autoDaily", false))
                    document.getElementById("dtsitting").parentNode.parentNode.style.visibility = "visible";
                else
                    document.getElementById("dtsitting").parentNode.parentNode.style.visibility = "hidden";
                // Click-Handler hinzufügen
                function timeChecker(obj, indx) {
                    if (indx != 0 && indx != 1)
                        return;
                    var dtsitttime = PGu_getValue("dtsitttime", latestDTtime).split(":");
                    var val = dtsitttime[indx];
                    dtsitttime[indx] = obj.value.length < 2 ? ("00" + obj.value).substr(-2) : obj.value;
                    if (isNaN(obj.value) || Number(obj.value) < 0 || Number(obj.value) > (indx == 0 ? 23 : 59) || dtsitttime.join(":") > latestDTtime)
                        dtsitttime[indx] = val;
                    else // neuen Wert speichern
                        PGu_setValue("dtsitttime", dtsitttime.join(":"));
                    obj.value = dtsitttime[indx];
                }

                document.getElementById("dtsitthr").addEventListener("change", function(event) {
                    timeChecker(this, 0);
                }, false);
                document.getElementById("dtsittmi").addEventListener("change", function(event) {
                    timeChecker(this, 1);
                }, false);
            }

            buildSelectBox(allplunderArr, tr, 0, 1);
            trace('Get ' + prothost + '/friendlist/', 2);
            GM_xmlhttpRequest({method:"GET", url: prothost + '/friendlist/', onload:function(responseDetails) {
                var content = responseDetails.responseText;
                // Wenn die Seite abgerufen werden konnte (kein Seitenladefehler)
                if (content.indexOf("<strong>Mein Penner</strong>") != -1) {
                    var newtd = document.createElement("td");
                    var newtr = document.createElement("tr");
                    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                    var friendid = PGu_getValue("friendid", "0");
                    var friends = content.split('class="listshop"')[1].split("<table ")[1].split("</table")[0].split("/profil/id:");
                    var option = '<option value="0"> </option> ';
                    for (var i = 1; i < friends.length; i++) {
                        option += '<option value="' + friends[i].split("/")[0] + '">' + friends[i].split("<")[0].split(">")[1].trim() + '</option> ';
                    }
                    newtd.innerHTML = '<form name="frienddef" id="frienddef">PN senden an: <select id="friendid" name="friendid"> ' + option + ' </select> </form>';
                    newtr.appendChild(newtd, newtr);
                    tr.parentNode.appendChild(newtr, tr);
                    document.getElementById("friendid").value = friendid;
                    if (!PGu_getValue("autoDaily", false))
                        document.getElementById("frienddef").parentNode.parentNode.style.visibility = "hidden";
                    else
                        document.getElementById("frienddef").parentNode.parentNode.style.visibility = "visible";
                    // Click-Handler hinzufügen
                    document.getElementById("friendid").addEventListener("change", function(event) {
                        // neuen Wert speichern
                        PGu_setValue("friendid", this.value);
                    }, false);
                    if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" || TOWNEXTENSION == "MU" ||
                        TOWNEXTENSION == "HR" || TOWNEXTENSION == "K") {
                        var newtd2 = document.createElement("td");
                        var newtr2 = document.createElement("tr");
                        newtd2.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                        newtd2.innerHTML = '<input name="LoseKaufSofort" id="LoseKaufSofort" type="checkbox"><span style="vertical-align: bottom">&nbsp;Lose ohne Rücksicht auf Casino-Besuch kaufen</span>';
                        newtr2.appendChild(newtd2, newtr2);
                        tr.parentNode.appendChild(newtr2, tr);
                        document.getElementById("LoseKaufSofort").checked = PGu_getValue("LoseKaufSofort", false);
                        if (!PGu_getValue("autoDaily", false))
                            document.getElementById("LoseKaufSofort").parentNode.parentNode.style.visibility = "hidden";
                        else
                            document.getElementById("LoseKaufSofort").parentNode.parentNode.style.visibility = "visible";
                        // Click-Handler hinzufügen
                        document.getElementById("LoseKaufSofort").addEventListener("change", function(event) {
                            // neuen Wert speichern
                            PGu_setValue("LoseKaufSofort", this.checked);
                        }, false);
                    }
                    else
                        PGu_setValue("LoseKaufSofort", true);
                    if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" || TOWNEXTENSION == "MU" ||
                        TOWNEXTENSION == "HR" || TOWNEXTENSION == "K") {
                        var newtd2 = document.createElement("td");
                        var newtr2 = document.createElement("tr");
                        newtd2.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
                        var donlink = PGu_getValue("donationlink", "");
                        newtd2.innerHTML = '<form>Spendenlink:  <input style="color: black; background-color:white; width:300px" type="text" name="donlink" id="donlink"></form>';
                        newtr2.appendChild(newtd2, newtr2);
                        tr.parentNode.appendChild(newtr2, tr);
                        document.getElementById("donlink").value = donlink;
                        if (!PGu_getValue("autoDaily", false))
                            document.getElementById("donlink").parentNode.parentNode.style.visibility = "hidden";
                        else
                            document.getElementById("donlink").parentNode.parentNode.style.visibility = "visible";
                        // Click-Handler hinzufügen
                        document.getElementById("donlink").addEventListener("change", function(event) {
                            // neuen Wert speichern
                            PGu_setValue("donationlink", this.value);
                        }, false);
                    }
                }
                trace('Get ' + prothost + '/stock/plunder/craftlist/', 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/craftlist/', onload:function(responseDetails) {
                    var table = responseDetails.responseText.split("<table").pop().split("</table")[0];
                    var trs = table.split("<tr");
                    var craftlist = [];
                    for (var i = 1; i < trs.length; i++) {
                        if (trs[i].indexOf('href="/stock/plunder/craft/details/') == -1)
                            continue;
                        var details = trs[i].split('href="/stock/plunder/craft/details/')[1];
                        if (details.indexOf("disabled") != -1)
                            continue;
                        var pid = details.split("/")[0];
                        var plunder = details.split("</strong")[0].split(">").pop();
                        craftlist.push([plunder, pid]);
                    }
                    var usedPlunder = PGu_getValue("craftlist", "").split(";");
                    for (var i = 0; i <= usedPlunder.length; i++)
                        var pid = selectcraft(i, craftlist, usedPlunder, tr);
                }});
            }});
        }
    }});
}

function setVisibility(vsbl) {
    document.getElementById("dtsitting").parentNode.parentNode.style.visibility = vsbl;
    document.getElementById("plunderdef0").parentNode.parentNode.style.visibility = vsbl;
    document.getElementById("frienddef").parentNode.parentNode.style.visibility = vsbl;
    if (document.getElementById("donlink"))
        document.getElementById("donlink").parentNode.parentNode.style.visibility = vsbl;
    if (document.getElementById("LoseKaufSofort"))
        document.getElementById("LoseKaufSofort").parentNode.parentNode.style.visibility = vsbl;
    for (var i = 0; true; i++)
        if (document.getElementById("craft"+i))
            document.getElementById("craft"+i).parentNode.parentNode.style.visibility = vsbl;
        else
            break;
}

function insertCheckBox5() {
    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;
    var newtd = document.createElement("td");
    var newtr = document.createElement("tr");
    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
    newtd.innerHTML = '<input name="DTCheckbox" id="DTCheckbox" type="checkbox"><span style="vertical-align: bottom">&nbsp;Tagesaufgabe automatisch lösen</span><br><span id="dailytxt"></span>';
    newtr.appendChild(newtd, newtr);
    var tr = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[2];
    tr.parentNode.appendChild(newtr, tr);
    var allplunderArr = [];
    var allplunder = PG_getValue("allplunder", "");
    if (allplunder == "") {
        allplunder = [];
        var plunderlist = [];
    }
    else {
        allplunder = allplunder.replace("&auml;", "ä").replace("&ouml;", "ö").replace("&uuml;", "ü").replace("&szlig;", "ß");
        var plunderlist = allplunder.replace(/:\d*/g, "").split(";");
        allplunder = allplunder.split(";");
        for (var i = allplunder.length - 1; i >= 0; i--)
            if (allplunder.indexOf(allplunder[i]) < i || allplunder[i] == "Zertr&uuml" || allplunder[i] == "Zertrü" || allplunder[i].startsWith("mmerte"))
                allplunder.splice(i, 1);
    }
    getPlunderlist(1, 0, allplunderArr, tr, (TOWNEXTENSION == "VT"||TOWNEXTENSION == "AT"?100:2500), allplunder, plunderlist, "");

    var checked = PGu_getValue("autoDaily", false);
    var dailytxt = "";
    if (checked) {
        var today = new Date();
        var tagesdatum = FormatDate(today);
        tryDaily = PGu_getValue("tryDailyTask", ";0").split(";");
        if (tryDaily[0] != tagesdatum) {
            var tries = 0;
            PGu_delete("tryDailyTask");
        }
        else
            var tries = Number(tryDaily[1]);
        if (tryDaily[0] == tagesdatum && (tries >= 5 && today.getHours() < 23 || tries >= 10 && today.getHours() >= 23)) {
            checked = false;
            if (tries < 10)
                dailytxt = "Aufgrund zuvieler Fehlversuche ist die Automatik bis 23 Uhr oder erneute Aktivierung abgeschaltet.";
            else
                dailytxt = "Aufgrund zuvieler Fehlversuche ist die Automatik für den Rest des Tages oder bis zur erneuten Aktivierung abgeschaltet.";
            document.getElementById("dailytxt").innerHTML = dailytxt;
        }
    }

    document.getElementById("DTCheckbox").checked = checked;
    // Click-Handler hinzufügen
    document.getElementById("DTCheckbox").addEventListener("click", function(event) {
        // Klickstatus speichern
        PGu_setValue("autoDaily", this.checked);
        if (!this.checked) {
            setVisibility("hidden");
        }
        else {
            setVisibility("visible");
            PGu_delete("dailyTaskDone");
            PGu_delete("tryDailyTask");
        }
    }, false);
}

function insertCheckBox6(show) {
    var noMissCtrl = (document.getElementById("content").innerHTML.indexOf('onclick="show_city_list') == -1);
    if (!show || noMissCtrl && show != 1)
        return;
    var tables = document.getElementsByTagName("table");
    var missions = [];
    var boosts = [];
    var plunder = [];
    for (var i = 0; i < tables.length; i++) {
        var mission = tables[i].getElementsByClassName("gang_mission")[0].style.backgroundImage.split(/[()]/)[1].split("/").pop().split(".")[0];
        missions[i] = mission;
        var tr = tables[i].getElementsByTagName("tr")[1];
        var div = tr.getElementsByTagName("div");
        if (!noMissCtrl) {
            var newtd = document.createElement("td");
            newtd.setAttribute('style', 'padding-top: 10px');
            newtd.innerHTML = '<input name="MissCheckbox'+i+'" id="MissCheckbox'+i+'" type="checkbox"><span style="vertical-align: bottom">&nbsp;Diese Mission automatisch starten</span>';
            div[div.length-1].appendChild(newtd, div);
            document.getElementById("MissCheckbox"+i).checked = PGu_getValue(mission+"Auto", false);
            // Click-Handler hinzufügen
            document.getElementById("MissCheckbox"+i).addEventListener("click", function(event) {
                // Klickstatus speichern
                var indx = this.id.substr(-1);
                PGu_setValue(missions[indx]+"Auto", this.checked);
            }, false);
            var newbr = document.createElement("br");
            div[div.length-1].appendChild(newbr, div);
            var newtd2 = document.createElement("td");
            newtd2.innerHTML = '<input name="RewardChb'+i+'" id="RewardChb'+i+'" type="checkbox" style="vertical-align:bottom"><span style="vertical-align: bottom">&nbsp;Belohnung automatisch abholen</span>';
            div[div.length-1].appendChild(newtd2, div);
            document.getElementById("RewardChb"+i).checked = PGu_getValue(mission+"Rwd", false);
            // Click-Handler hinzufügen
            document.getElementById("RewardChb"+i).addEventListener("click", function(event) {
                // Klickstatus speichern
                var indx = this.id.substr(-1);
                PGu_setValue(missions[indx]+"Rwd", this.checked);
            }, false);
        }
        if (!noMissCtrl)
            if (mission == "kieztour" || mission == "davinci_code" || mission == "schrottplatz" || mission == "kreuzzug") {
                var newbr = document.createElement("br");
                div[div.length-1].appendChild(newbr, div);
                var newtd2 = document.createElement("td");
                newtd2.innerHTML = '<input name="TimeCheckbox'+i+'" id="TimeCheckbox'+i+'" type="checkbox" style="vertical-align:bottom"><span style="vertical-align: bottom">&nbsp;Diese Mission nur starten, wenn noch mindestens </span><input name="MissTime'+i+'" id="MissTime'+i+'" type="text" style="width:30px;color:black;background-color:white" value=""><span style="vertical-align: bottom">&nbsp;Minuten bis zur nächsten Mission</span>';
                div[div.length-1].appendChild(newtd2, div);
                document.getElementById("MissTime"+i).value = PGu_getValue(mission+"Time", "");
                document.getElementById("TimeCheckbox"+i).checked = PGu_getValue(missions[i]+"MissT", false);
                // Click-Handler hinzufügen
                document.getElementById("TimeCheckbox"+i).addEventListener("click", function(event) {
                    // Klickstatus speichern
                    var indx = this.id.substr(-1);
                    PGu_setValue(missions[indx]+"MissT", this.checked);
                }, false);
                // Change-Handler hinzufügen
                document.getElementById("MissTime"+i).addEventListener("change", function(event) {
                    // aktuellen Wert speichern
                    if (this.value != "" && (isNaN(this.value) || Number(this.value) < 0))
                        alert ("Bitte nur eine Zahl >= 0 eingeben oder frei lassen");
                    else {
                        var indx = this.id.substr(-1);
                        PGu_setValue(missions[indx]+"Time", this.value);
                    }
                }, false);
            }
        var lis = tables[i].getElementsByClassName("stage_area")[0].getElementsByTagName("li");
        plunder[i] = [];
        var first = noMissCtrl;
        for (var j = 0; j < lis.length; j++) {
            if (lis[j].innerHTML.indexOf('">x ') == -1)
                continue;
            var plnd = lis[j].innerHTML.split("<span>")[1].split("</span>")[0].trim();
            var amnt = Number(lis[j].innerHTML.split(">x ")[1].match(/\d+/)[0].trim());
            plunder[i].push([plnd, amnt]);
            if (amnt >= 1000 || !noMissCtrl) {
                if (!first) {
                    var newbr = document.createElement("br");
                    div[div.length-1].appendChild(newbr, div);
                }
                var newtd = document.createElement("td");
                newtd.innerHTML = '<input name="'+plnd+'payin'+i+'" id="'+plnd+'payin'+i+'" type="checkbox"><span style="vertical-align: bottom">&nbsp;'+plnd+' bei Bedarf in Plunderbank einzahlen'+'</span>';
                div[div.length-1].appendChild(newtd, div);
                PGu_setValue(plnd+"PayIn", PGu_getValue(plnd+"PayIn", false));
                document.getElementById(plnd+"payin"+i).checked = PGu_getValue(plnd+"PayIn", false);
                // Click-Handler hinzufügen
                document.getElementById(plnd+"payin"+i).addEventListener("click", function(event) {
                    // Klickstatus speichern
                    var plnd = this.id.split("payin")[0];
                    PGu_setValue(plnd+"PayIn", this.checked);
                }, false);
                first = false;
                if (amnt >= 1000 && !noMissCtrl) {
                    var newbr = document.createElement("br");
                    div[div.length-1].appendChild(newbr, div);
                    var newtd = document.createElement("td");
                    newtd.innerHTML = '<input name="'+plnd+'Smml'+i+'" id="'+plnd+'Smml'+i+'" type="checkbox"><span style="vertical-align: bottom">&nbsp;'+plnd+' nach Missionsstart wieder sammeln</span>';
                    div[div.length-1].appendChild(newtd, div);
                    PGu_setValue(plnd+"Coll", PGu_getValue(plnd+"Coll", false));
                    document.getElementById(plnd+"Smml"+i).checked = PGu_getValue(plnd+"Coll", false);
                    // Click-Handler hinzufügen
                    document.getElementById(plnd+"Smml"+i).addEventListener("click", function(event) {
                        // Klickstatus speichern
                        var plnd = this.id.split("Smml")[0];
                        PGu_setValue(plnd+"Coll", this.checked);
                    }, false);
                }
            }
        }
        if (noMissCtrl)
            continue;
        var divs = tables[i].getElementsByClassName("stage_area")[2].getElementsByClassName("icon_display");
        var boost = divs[divs.length-1].innerHTML.split('src="')[1].split("/").pop().split(".")[0];
        boosts[i] = boost;
        if (boost.startsWith("boost")) {
            var newbr = document.createElement("br");
            div[div.length-1].appendChild(newbr, div);
            var newtd = document.createElement("td");
            newtd.innerHTML = '<input name="MissAbhol'+i+'" id="MissAbhol'+i+'" type="checkbox"><span style="vertical-align: bottom">&nbsp;diesen Boost überschreiben</span>';
            div[div.length-1].appendChild(newtd, div);
            document.getElementById("MissAbhol"+i).checked = PGu_getValue(boost+"Over", false);
            // Click-Handler hinzufügen
            document.getElementById("MissAbhol"+i).addEventListener("click", function(event) {
                // Klickstatus speichern
                var indx = this.id.substr(-1);
                PGu_setValue(boosts[indx]+"Over", this.checked);
            }, false);
            var newbr2 = document.createElement("br");
            div[div.length-1].appendChild(newbr2, div);
            var newtd2 = document.createElement("td");
            newtd2.innerHTML = '<input name="BoostStart'+i+'" id="BoostStart'+i+'" type="checkbox"><span style="vertical-align: bottom">&nbsp;diesen Boost sofort starten</span>';
            div[div.length-1].appendChild(newtd2, div);
            document.getElementById("BoostStart"+i).checked = PGu_getValue(boost+"Start", false);
            // Click-Handler hinzufügen
            document.getElementById("BoostStart"+i).addEventListener("click", function(event) {
                // Klickstatus speichern
                var indx = this.id.substr(-1);
                PGu_setValue(boosts[indx]+"Start", this.checked);
            }, false);
        }
        if (mission == "schrottplatz" || mission == "kreuzzug") {
            var newbr = document.createElement("br");
            div[div.length-1].appendChild(newbr, div);
            var newtd = document.createElement("td");
            newtd.innerHTML = '<input name="trashAll" id="trashAll" type="checkbox"><span style="vertical-align: bottom">&nbsp;Missionsplunder unter 60 auch verschrotten</span>';
            div[div.length-1].appendChild(newtd, div);
            document.getElementById("trashAll").checked = PGu_getValue("trashAllMissPlund", false);
            // Click-Handler hinzufügen
            document.getElementById("trashAll").addEventListener("click", function(event) {
                // Klickstatus speichern
                PGu_setValue("trashAllMissPlund", this.checked);
            }, false);
            for (var j = 0; j < plunder.length; j++) {
                for (var k = 0; k < plunder[j].length; k++) {
                    if (plunder[j][k][1] >= 1000)
                        continue;
                    var newbr = document.createElement("br");
                    div[div.length-1].appendChild(newbr, div);
                    var newtd = document.createElement("td");
                    newtd.innerHTML = '<input name="Schr'+plunder[j][k][0]+'" id="Schr'+plunder[j][k][0]+'" type="checkbox"><span style="vertical-align: bottom">&nbsp;' + plunder[j][k][0] + ' kann verschrottet werden</span>';
                    div[div.length-1].appendChild(newtd, div);
                    document.getElementById("Schr"+plunder[j][k][0]).checked = PGu_getValue(plunder[j][k][0]+"Schrott", false);
                    // Click-Handler hinzufügen
                    document.getElementById("Schr"+plunder[j][k][0]).addEventListener("click", function(event) {
                        // Klickstatus speichern
                        PGu_setValue(this.id.substr(4)+"Schrott", this.checked);
                    }, false);
                }
            }
        }
    }
}

function insertCheckBox7() {
    function chkBox(id, varname, def) {
        document.getElementById(id).checked = PGu_getValue(varname, def);
        // Click-Handler hinzufügen
        document.getElementById(id).addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue(varname, this.checked);
        }, false);
    }
    function chkValue(id, varname, def) {
        document.getElementById(id).value = PGu_getValue(varname, def);
        document.getElementById(id).addEventListener("change", function(event) {
            // aktuellen Wert speichern
            if (this.value != "" && (isNaN(this.value) || Number(this.value) < 0))
                alert ("Bitte nur eine Zahl >= 0 eingeben oder frei lassen");
            else {
                PGu_setValue(varname, Number(this.value));
            }
        }, false);
    }
    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;
    var newtd = document.createElement("td");
    var newtr = document.createElement("tr");
    newtd.setAttribute('colspan', '2');
    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
    newtd.innerHTML = '<input name="moneyover" id="moneyover" type="checkbox" style="vertical-align:bottom"><span style="vertical-align: bottom">&nbsp;bei mehr als </span><input name="moreThan" id="moreThan" type="text" style="width:60px;color:black;background-color:white" value=""><span style="vertical-align: bottom">&nbsp;folgenden Betrag einzahlen: </span><input name="payIn" id="payIn" type="text" style="width:60px;color:black;background-color:white" value="">';
    newtd.innerHTML += '<br><input name="minmoneychb" id="minmoneychb" type="checkbox" style="vertical-align:bottom"><span style="vertical-align: bottom">&nbsp;Mindestgeldbetrag: </span><input name="minMoney" id="minMoney" type="text" style="width:60px;color:black;background-color:white" value="">';
    newtr.setAttribute('align', 'left');
    newtr.setAttribute('valign', 'top');
    newtr.appendChild(newtd, newtr);
    var trs = document.getElementsByTagName("table")[0].getElementsByTagName("tr");
    for (var i = 0; i < trs.length; i++)
        if (trs[i].innerHTML.indexOf("f_comment") != -1)
            break;
    for ( ; i < trs.length; i++)
        if (trs[i].innerHTML.indexOf("<hr") != -1)
            break;
    if (i >= trs.length)
        trs[0].parentNode.appendChild(newtr);
    else
        trs[0].parentNode.insertBefore(newtr, trs[i]);
    chkBox("moneyover", "moneyOver", false);
    chkValue("moreThan", "maxMoney", 0);
    chkValue("payIn", "maxMoneyPayIn", 0);
    chkBox("minmoneychb", "minmoneychb", false);
    chkValue("minMoney", "minMoney", 0);
}

function insertCheckBox8() {
    var trs = document.getElementsByClassName("item_list")[0].getElementsByTagName("tr");
    var trnr = (TOWNEXTENSION == "VT"||TOWNEXTENSION == "AT"?3:1);
    var tr1 = trs[trnr].cloneNode(true);
    var tr2 = trs[trnr].cloneNode(true);
    var inp1 = document.createElement("input");
    inp1.id = "minmoney";
    inp1.type = "text";
    inp1.value = PGu_getValue("minMoney", 0);
    inp1.size = "9";
    var inp3 = document.createElement("input");
    inp3.type = "button";
    inp3.value = "übernehmen";
    inp3.addEventListener("click", function(event) {
        // aktuellen Wert speichern
        var val = document.getElementById("minmoney").value;
        if (val != "" && (isNaN(val) || Number(val) < 0))
            alert ("Bitte nur eine Zahl >= 0 eingeben oder frei lassen");
        else {
            PGu_setValue("minMoney", Number(val));
        }
    }, false);
    if (TOWNEXTENSION == "VT" || TOWNEXTENSION == "AT") {
        tr1.getElementsByTagName("td")[0].innerHTML = 'Mindestgeldbetrag:';
        tr1.getElementsByTagName("td")[1].appendChild(inp1, tr1.getElementsByTagName("td")[1]);
        tr1.getElementsByTagName("td")[1].appendChild(inp3, tr1.getElementsByTagName("td")[1]);
    }
    else {
        tr1.getElementsByTagName("td")[1].innerHTML = 'Mindestgeldbetrag:';
        tr1.getElementsByTagName("span")[0].parentNode.removeChild(tr1.getElementsByTagName("span")[0]);
        tr1.getElementsByTagName("td")[2].appendChild(inp1, tr1.getElementsByTagName("td")[1]);
        tr1.getElementsByTagName("td")[2].appendChild(inp3, tr1.getElementsByTagName("td")[1]);
    }
    trs[trnr].parentNode.appendChild(tr1, trs[trnr]);
    var inp2 = document.createElement("input");
    inp2.id = "minprice";
    inp2.type = "text";
    inp2.value = "0," + ("0" + PGu_getValue("bottleprice", 0)).substr(-2);
    inp2.size = "5";
    var inp4 = document.createElement("input");
    inp4.type = "button";
    inp4.value = "übernehmen";
    inp4.addEventListener("click", function(event) {
        if (!document.getElementById("minprice").value.startsWith("0,"))
            alert ("Wert unzulässig!");
        else
            PGu_setValue("bottleprice", Number(document.getElementById("minprice").value.substr(2)));
    }, false);
    if (TOWNEXTENSION == "VT" || TOWNEXTENSION == "AT") {
        tr2.getElementsByTagName("td")[0].innerHTML = 'Mindestverkaufspreis ' + flaschentxt + ':';
        tr2.getElementsByTagName("td")[1].appendChild(inp2, tr2.getElementsByTagName("td")[1]);
        tr2.getElementsByTagName("td")[1].appendChild(inp4, tr2.getElementsByTagName("td")[1]);
    }
    else {
        tr2.getElementsByTagName("td")[1].innerHTML = 'Mindestverkaufspreis Flaschen:';
        tr2.getElementsByTagName("span")[0].parentNode.removeChild(tr2.getElementsByTagName("span")[0]);
        tr2.getElementsByTagName("td")[2].appendChild(inp2, tr2.getElementsByTagName("td")[2]);
        tr2.getElementsByTagName("td")[2].appendChild(inp4, tr2.getElementsByTagName("td")[2]);
    }
    trs[trnr].parentNode.appendChild(tr2, trs[trnr+1]);
    if (TOWNEXTENSION == "VT" || TOWNEXTENSION == "AT") {
        var tr3 = trs[trnr].cloneNode(true);
        var inp6 = document.createElement("input");
        inp6.id = "maxfill";
        inp6.type = "text";
        inp6.value = PGu_getValue("maxfillbottle", 90);
        inp6.size = "5";
        var inp8 = document.createElement("input");
        inp8.type = "button";
        inp8.value = "übernehmen";
        inp8.addEventListener("click", function(event) {
            if (isNaN(document.getElementById("maxfill").value) ||
                Number(document.getElementById("maxfill").value) < 1 ||
                Number(document.getElementById("maxfill").value) > 100)
                alert ("Wert unzulässig!");
            else
                PGu_setValue("maxfillbottle", Number(document.getElementById("maxfill").value));
        }, false);
        tr3.getElementsByTagName("td")[0].innerHTML = 'Maximaler ' + flaschentxt + 'füllgrad:';
        tr3.getElementsByTagName("td")[1].appendChild(inp6, tr3.getElementsByTagName("td")[1]);
        tr3.getElementsByTagName("td")[1].appendChild(inp8, tr3.getElementsByTagName("td")[1]);
        trs[trnr].parentNode.appendChild(tr3, trs[trnr+1]);
    }
}

function insertCheckBox9() {
    function makeSelection (allplunder, option, div, pos, upgr) {
        function getPlunderSpez (plist, val) {
            if (val != 0)
                for (var i = 0; i < plist.length; i++)
                    if (plist[i][2] == val)
                        return val + ";" + plist[i][0];
            return "0;";
        }
        function makeBox(actInact) {
            var val = (PGu_getValue(actInact+"ivePlunder", 0) + ";").split(";")[0];
            document.getElementById("pid" + actInact).value = val;
            // Click-Handler hinzufügen
            document.getElementById("pid" + actInact).addEventListener("change", function(event) {
                // neuen Wert speichern
                PGu_setValue(actInact+"ivePlunder", getPlunderSpez(allplunder, this.value));
            }, false);
            return;
        }
        var text = '<form name="' + upgr + 'Plunder" style="padding-top:12px" id="' + upgr + 'Plunder">Plunder wenn aktiv:<br><select id="pid' + upgr + 'Act" name="pid' + upgr + 'Act"> ' + option + ' </select><br>Plunder wenn inaktiv:<br><select id="pid' + upgr + 'Inact" name="pid' + upgr + 'Inact"> ' + option + ' </select> </form>';
        div.innerHTML = div.innerHTML.substr(0, pos) + text + div.innerHTML.substr(pos);
        div.style.height = (parseInt(div.style.height) + 60) + "px";
        makeBox(upgr + "Act");
        makeBox(upgr + "Inact");
        return;
    }
    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;
    var tr = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[2];

    var allplunder = [];
    trace('Get ' + prothost + '/stock/plunder/ajax/?c=1', 2);
    GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/ajax/?c=1', onload:function(responseDetails) {
        var content = responseDetails.responseText;
        var trs = content.split("<tr ");
        for (var i = 1; i < trs.length; i++) {
            var plname = trs[i].split(">x ")[0].split("</strong")[0].split(">").pop().trim();
            var plAnz = trs[i].split(">x ")[1].split("<")[0].trim();
            var pid = trs[i].split('pm_')[1].split("'")[0].trim();
            for (var j = 0; j < allplunder.length; j++)
                if (allplunder[j][0] >= plname)
                    break;
            allplunder.splice(j, 0, [plname, plAnz, pid]);
        }
        var divs = tr.getElementsByTagName("div");
        var div = divs[divs.length-1];
        var pos = div.innerHTML.indexOf("<br clear");
        if (pos <= 0)
            return;
        var option = '<option value="-1">letzte Auswahl ungültig</option> <option value="0"> </option> ';
        for (var i = 0; i < allplunder.length; i++)
            option += '<option value="' + allplunder[i][2] + '">' + allplunder[i][0] + '</option> ';
        makeSelection (allplunder, option, div, pos, "WiWu");
        div = divs[divs.length-2];
        pos = div.innerHTML.indexOf("<br clear");
        if (pos <= 0)
            return;
        makeSelection (allplunder, option, div, pos, "Wut");
    }});
}

function insertCheckBox10() {
    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;

    var today = new Date();
    var tagesdatum = FormatDate(today);
    var div = document.getElementsByClassName("pet_tab_help")[0];
    if (document.getElementById("content").innerHTML.indexOf("javascript:display_show('memory'") != -1) {
        var newtd = document.createElement("td");
        newtd.setAttribute('style', 'padding-top: 10px');
        newtd.innerHTML = '<input name="memoryChb" id="memoryChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;Memory automatisch spielen</span>';
        div.appendChild(newtd, div);

        document.getElementById("memoryChb").checked = PGu_getValue("memoryauto", false);
        // Click-Handler hinzufügen
        document.getElementById("memoryChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("memoryauto", this.checked);
            if (this.checked) {
                PGu_setValue("memorydate", "");
                PGu_setValue("dispshow_date", 0);
                if (PGu_getValue("gamechkr_date", "xx") == tagesdatum)
                    PGu_setValue("gamechkr_date", "xx");
            }
        }, false);
    }
    else
        PGu_delete("memoryauto");

    if (document.getElementById("content").innerHTML.indexOf('javascript:display_show("icecube"') != -1) {
        var newtd = document.createElement("td");
        newtd.setAttribute('style', 'padding-top: 10px');
        newtd.innerHTML = '<input name="icecubeChb" id="icecubeChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;Eiswürfelspiel automatisch spielen</span>';
        div.appendChild(newtd, div);

        document.getElementById("icecubeChb").checked = PGu_getValue("icecubeauto", false);
        // Click-Handler hinzufügen
        document.getElementById("icecubeChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("icecubeauto", this.checked);
            if (this.checked) {
                PGu_setValue("icecubedate", "");
                PGu_setValue("dispshow_date", 0);
                if (PGu_getValue("gamechkr_date", "xx") == tagesdatum)
                    PGu_setValue("gamechkr_date", "xx");
            }
        }, false);

        for (var i = 1; i <= 6; i++) {
            var newtd = document.createElement("td");
            newtd.setAttribute('style', 'padding-top: 10px');
            newtd.innerHTML = '&nbsp;&nbsp;&nbsp;<input name="icecubeChb'+i+'" id="icecubeChb'+i+'" type="checkbox"><span style="vertical-align: bottom">&nbsp;'+i+(i==6?' automatisch behalten':'')+'</span>';
            div.appendChild(newtd, div);
            document.getElementById("icecubeChb"+i).checked = PGu_getValue("icecubekeep"+i, i==6);
            // Click-Handler hinzufügen
            document.getElementById("icecubeChb"+i).addEventListener("click", function(event) {
                // Klickstatus speichern
                PGu_setValue("icecubekeep"+this.id.substr(-1), this.checked);
            }, false);
        }

        var newbr = document.createElement("br");
        div.appendChild(newbr, div);
    }
    else
        PGu_delete("icecubeauto");

    if (document.getElementById("content").innerHTML.indexOf('href="/livegame/bb/"') != -1) {
        var newtd2 = document.createElement("td");
        newtd2.innerHTML = '<input name="FruitChb" id="FruitChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;Freche Früchtchen automatisch spielen&nbsp;&nbsp;</span><input name="FruitKKChb" id="FruitKKChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;angefangene Treffer mit Kronkorken beenden</span>';
        div.appendChild(newtd2, div);

        document.getElementById("FruitChb").checked = PGu_getValue("livegameauto", false);
        // Click-Handler hinzufügen
        document.getElementById("FruitChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("livegameauto", this.checked);
        }, false);

        document.getElementById("FruitKKChb").checked = PGu_getValue("livegameKK", false);
        // Click-Handler hinzufügen
        document.getElementById("FruitKKChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("livegameKK", this.checked);
            if (this.checked)
                PGu_delete("livegame_date");
        }, false);

        var newbr2 = document.createElement("br");
        div.appendChild(newbr2, div);
    }
    else
        PGu_delete("livegameauto");

    if (document.getElementById("content").innerHTML.indexOf("javascript:display_show('cocktail'") != -1) {
        var newtd3 = document.createElement("td");
        //newtd3.innerHTML = '<input name="CocktailChb" id="CocktailChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;Cocktails automatisch mixen</span>';
        newtd3.innerHTML = '<input name="CocktailChb" id="CocktailChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;Kekse automatisch backen</span>';
        div.appendChild(newtd3, div);

        document.getElementById("CocktailChb").checked = PGu_getValue("cocktailauto", false);
        // Click-Handler hinzufügen
        document.getElementById("CocktailChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("cocktailauto", this.checked);
            if (this.checked) {
                PGu_setValue("cocktaildate", "");
                PGu_setValue("dispshow_date", 0);
            }
        }, false);
    }
    else
        PGu_delete("cocktailauto");
}

function insertCheckBox11() {
    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;

    var div = document.getElementsByClassName("counters")[0];
    var newspan = document.createElement("span");
    newspan.innerHTML = '<input type="submit" value="gefundener Plunder" style="font-size:18px; background-color:darkgreen; position:relative; top:-37px" id="junkfound">';
    div.insertBefore(newspan, div.firstChild);
    var center = div.getElementsByTagName("center");
    for (i = 0; i < center.length; i++)
        center[i].style.top = (33 + i*29 - Math.floor(i/2)) + "px";

    // Click-Handler hinzufügen
    document.getElementById("junkfound").addEventListener("click", function(event) {
        var junk = PGu_getValue("junkfound", "");
        if (junk == "")
            junk = "Nichts gefunden:";
        else {
            junkArr = junk.split(";");
            junk = "Gefunden:\n\n";
            for (var i = 0; i < junkArr.length; i++) {
                if (junkArr[i] != "") {
                    var arr = junkArr[i].split(":");
                    for (var j = 1; j < arr.length; j++) {
                        if (arr[j].match(/^\d/))
                            break;
                        else {
                            arr.splice(j-1, 2, arr[j-1] + ":" + arr[j]);
                            j--;
                        }
                    }
                    junk += arr.pop() + " x " + arr[0];
                    if (arr.length > 1) {
                        arr.splice(0, 1);
                        junk += " (" + arr.join(" + ") + ")";
                    }
                junk += "\n";
                }
                else
                    junk += "---------------------------\n";
            }
        }
        alert(junk);
    }, false);
}

var ghostPages = ['activities/crime', 'activities', 'city/medicine', 'city/stuff', 'city/supermarket',
          'skills', 'stock/bottle', 'messages', 'itemsale', 'stock'];
function insertCheckBox12(obj) {
    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;

    var PageNames = ['Verbrechen', 'Aktionen', 'Apotheke', 'Zubehör', 'Supermarkt',
                     'Weiterbildung', pflaschen, 'Kommunikation', 'Kronkorken', 'Inventar'];
    var today = new Date();
    var tagesdatum = FormatDate(today);
    while (PGu_getValue("ghostsfound", "") != "" || PGu_getValue("blackjackcards", "") != ""){
        var div = document.getElementById("1");
        if (!div)
            break;
        var newspan = document.createElement("span");
        if (PGu_getValue("ghostsfound", "") != "")
            newspan.innerHTML += '<input type="submit" value="gefundene ' + obj + '" style="font-size:18px; background-color:darkgreen; position:relative; top:170px" id="ghostsfound">';
        if (PGu_getValue("blackjackcards", "") != "")
            newspan.innerHTML += '<input type="submit" value="gewonnene ' + obj + '" style="font-size:18px; background-color:darkgreen; position:relative; top:170px" id="blackjackwins">';
        div.insertBefore(newspan, div.firstChild);

        // Click-Handler hinzufügen
        if (PGu_getValue("ghostsfound", "") != "")
            document.getElementById("ghostsfound").addEventListener("click", function(event) {
                var ghosts = PGu_getValue("ghostsfound", "");
                if (ghosts == "")
                    ghosts = "Nichts gefunden:";
                else {
                    ghostsArr = ghosts.split(";");
                    ghosts = "Gefunden:\n\n";
                    for (var i = 0; i < ghostsArr.length; i++) {
                        var arr = ghostsArr[i].split(":");
                        ghosts += obj + " am " + arr[0].substr(8,2) + "." + arr[0].substr(5,2) + "." + arr[0].substr(0,4) + ": ";
                        for (var j = 1; j < arr.length; j++)
                            ghosts += arr[j] + " x " + (isNaN(arr[j+1])?arr[j+1]:PageNames[arr[j+1]]) + (++j < arr.length-1?", ":"\n");
                    }
                }
                alert(ghosts);
            }, false);
        if (PGu_getValue("blackjackcards", "") != "")
            document.getElementById("blackjackwins").addEventListener("click", function(event) {
                var cardstat = PGu_getValue("blackjackcards", "");
                if (cardstat == "")
                    cardstat = "Nichts gefunden:";
                else {
                    cardsArr = cardstat.split(";");
                    cards = "Gewonnen:\n\n";
                    for (var i = 0; i < cardsArr.length; i++) {
                        var arr = cardsArr[i].split("+");
                        cards += "Karten am " + arr[0].substr(8,2) + "." + arr[0].substr(5,2) + "." + arr[0].substr(0,4) + ": ";
                        for (var j = 1; j < arr.length; j++) {
                            cArr = arr[j].split(":");
                            var sum = 0;
                            if (j > 1)
                                cards += "; ";
                            for (var k = 0; k < cArr.length; k++) {
                                cards += cArr[k] + " ";
                                if (cArr[k] == "A")
                                    sum += 11;
                                else if (isNaN(cArr[k]))
                                    sum += 10;
                                else
                                    sum += Number(cArr[k]);
                            }
                            cards += "(" + sum + (sum <= 21?"":" --> 1") + ")";
                        }
                        cards += "\n";
                    }
                }
                alert(cards);
            }, false);
        break;
    }

    var div = document.getElementsByClassName("pet_tab_help")[0];
    if (document.getElementById("content").innerHTML.indexOf("javascript:display_show('countdowngame'") != -1) {
        var newtd = document.createElement("td");
        newtd.setAttribute('style', 'padding-top: 10px');
        newtd.innerHTML = '<input name="hendlChb" id="hendlChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;Hendl automatisch grillen</span>';
        div.appendChild(newtd, div);

        document.getElementById("hendlChb").checked = PGu_getValue("countdowngameauto", false);
        // Click-Handler hinzufügen
        document.getElementById("hendlChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("countdowngameauto", this.checked);
            if (this.checked) {
                PGu_setValue("countdowngamedate", "");
                PGu_setValue("dispshow_date", 0);
                if (PGu_getValue("gamechkr_date", "xx") == tagesdatum)
                    PGu_setValue("gamechkr_date", "xx");
            }
        }, false);
    }
    else
        PGu_delete("countdowngameauto");

    if (document.getElementById("content").innerHTML.indexOf("javascript:blackjack(") != -1) {
        var newbr = document.createElement("br");
        div.appendChild(newbr, div);
        var newtd2 = document.createElement("td");
        newtd2.innerHTML = '<input name="BlackjackChb" id="BlackjackChb" type="checkbox" style="vertical-align:bottom"><span style="vertical-align: bottom">&nbsp;Brezngaudi automatisch spielen: Karte bis höchstens </span><input name="Blackjacklimit" id="Blackjacklimit" type="text" style="width:25px;color:black;background-color:white" value=""><span style="vertical-align: bottom">&nbsp;ziehen</span>';
        div.appendChild(newtd2, div);
        document.getElementById("BlackjackChb").checked = PGu_getValue("blackjackauto", false);
        document.getElementById("Blackjacklimit").value = PGu_getValue("blackjacklimit", 13);
        // Click-Handler hinzufügen
        document.getElementById("BlackjackChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("blackjackauto", this.checked);
            PGu_setValue("blackjack_date", "");
            if (PGu_getValue("gamechkr_date", "xx") == tagesdatum)
                PGu_setValue("gamechkr_date", "xx");
        }, false);
        // Change-Handler hinzufügen
        document.getElementById("Blackjacklimit").addEventListener("change", function(event) {
            // aktuellen Wert speichern
            if (isNaN(this.value) || Number(this.value) < 2 || Number(this.value) > 21)
                alert ("Bitte nur eine Zahl zwischen 2 und 21 eingeben");
            else {
                PGu_setValue("blackjacklimit", Number(this.value));
            }
        }, false);
    }
    else
        PGu_delete("blackjackauto");
}

function buildSelectBox(i, allplunderArr, usedPlunder, tr) {
    function handleClick(id, value) {
        // neuen Wert speichern
        var boxnr = id.replace("shopid", "");
        if (value == "-1")
            usedPlunder.splice(boxnr, 1);
        else if (value == "0") {
            if (usedPlunder[0] != "0")
                usedPlunder.splice(0, 0, "0");
        }
        else if (usedPlunder.indexOf(value) != -1)
            usedPlunder.splice(boxnr, 1);
        else
            usedPlunder[boxnr] = value;
        PGu_setValue("alwaysbuy", usedPlunder.join(";"));
        for (var i = 0; i < usedPlunder.length || document.getElementById("shopid"+i); i++) {
            if (i >= usedPlunder.length || usedPlunder[0] == "0" && i > 0) {
                if (document.getElementById("shopid"+i))
                    document.getElementById("shopid"+i).parentNode.parentNode.style.visibility = "hidden";
                continue;
            }
            buildSelectBox(i, allplunderArr, usedPlunder, tr);
        }
        if (i >= allplunderArr.length - 1 || usedPlunder[0] == "0")
            return;
        buildSelectBox(usedPlunder.length, allplunderArr, usedPlunder, tr);
    }
    if (i >= allplunderArr.length - 1 || usedPlunder[0] == "0" && i > 0)
        return;
    var option = '<option value="-1"> </option><option value="0">alles kaufen</option> ';
    for (var j = 0; j < allplunderArr.length; j++) {
        var pos = usedPlunder.indexOf(allplunderArr[j][1]);
        if (pos == -1 || pos == i || usedPlunder[0] == "0")
            option += '<option value="' + allplunderArr[j][1] + '">' + allplunderArr[j][0] + ' (' + allplunderArr[j][2].split("*")[1] + ')</option> ';
    }
    var newtd = document.getElementById("shopid"+i);
    if (newtd) {
        newtd.parentNode.parentNode.style.visibility = "visible";
        newtd.innerHTML = option;
    }
    else {
        newtd = document.createElement("td");
        newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
        newtd.innerHTML = '<form name="shop' + i + '" id="shop' + i + '">' + (i==0?"Plunder immer kaufen":"und außerdem") + ': <select id="shopid' + i +'" name="shopid' + i + '"> ' + option + ' </select> </form>';
        var newdiv = document.createElement("div");
        newdiv.appendChild(newtd, newdiv);
        tr.parentNode.appendChild(newdiv, tr);
        newtd = document.getElementById("shopid"+i);
        // Click-Handler hinzufügen
        newtd.addEventListener("change", function(event) {
            handleClick(this.id, this.value);
        }, false);
    }
    newtd.value = i < usedPlunder.length?usedPlunder[i]:"-1";
    return;
}

function getPlunderlistForShop(k, pltab, allplunderArr, tr, plunderlist, plunderP, link)
{
    if (pltab == 0) {
        trace('Get ' + prothost + '/stock/plunder/', 2);
        GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/', onload:function(responseDetails) {
            var content = responseDetails.responseText.split('id="plundertab"')[1];
            var lis = content.split("</ul>")[0].split("<li>");
            pltab = lis.length - 1;
            link = lis[1].split('href="')[1].split("=")[0] + "=";
            getPlunderlistForShop(k, pltab, allplunderArr, tr, plunderlist, plunderP, link);
        }});
        return;
    }

    trace('Get ' + prothost + link + k, 2);
    GM_xmlhttpRequest({method:"GET", url: prothost + link + k, onload:function(responseDetails) {
        var content = responseDetails.responseText;

        var trs = content.split("<tr ");
        for (var i = 1; i < trs.length; i++) {
            var plname = trs[i].split(">x ")[0].split("</strong")[0].split(">").pop().trim();
            var pid = trs[i].split('stock/plunder/craft/details/')[1].split("/")[0];
            var indx = plunderlist.indexOf(pid);
            if (indx != -1) {
                allplunderArr.push([plname, pid, plunderP[indx]]);
                plunderP[indx] = plunderP[indx].split(":")[0]+":"+plname;
            }
        }
        if (k < pltab)
            getPlunderlistForShop(k+1, pltab, allplunderArr, tr, plunderlist, plunderP, link);
        else {
            for (var i = 0; i < plunderP.length; i++)
                plunderP[i] = plunderlist[i] + "=" + plunderP[i];
            PG_setValue("buyablegoods", plunderP.join("#"));
            var alwaysbuy = PGu_getValue("alwaysbuy", "");
            if (alwaysbuy == "")
                alwaysbuy = [];
            else
                alwaysbuy = alwaysbuy.split(";");
            for (var i = 0; i <= alwaysbuy.length; i++)
                buildSelectBox(i, allplunderArr.sort(function(a,b) {return a[0].toLowerCase()<b[0].toLowerCase()?-1:1;}), alwaysbuy, tr);
        }
    }});
}

function insertCheckBox13(obj) {
    var buyable = PG_getValue("buyablegoods", "");
    if (buyable == "")
        return;
    var newtd = document.createElement("td");
    var newdiv = document.createElement("div");
    newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
    var div = document.getElementsByClassName("ps_outer_shell")[0];
    div.appendChild(newdiv, div);
    var allplunderArr = [];
    var gpl = false;
    if (buyable == "") {
        buyableP = [];
        buyable = [];
    }
    else {
        buyableP = buyable.replace(/[^#]+=/g, "").split("#");
        buyable = buyable.replace(/=[^#]+/g, "").split("#");
        for (var i = 0; i < buyableP.length; i++)
            if (buyableP[i].indexOf("*") == -1)
                gpl = true;
        }
    if (gpl) {
        alert("gpl is true: " + buyableP);
        getPlunderlistForShop(1, 0, allplunderArr, div, buyable, buyableP, "");
    }
    else {
        for (var i = 0; i < buyable.length; i++)
            allplunderArr.push([buyableP[i].split("*")[0], buyable[i], buyableP[i]]);
        var alwaysbuy = PGu_getValue("alwaysbuy", "");
        if (alwaysbuy == "")
            alwaysbuy = [];
        else
            alwaysbuy = alwaysbuy.split(";");
        for (var i = 0; i <= alwaysbuy.length; i++)
            if (alwaysbuy[0] != "0" || i == 0)
                buildSelectBox(i, allplunderArr.sort(function(a,b) {return a[0].toLowerCase()<b[0].toLowerCase()?-1:1;}), alwaysbuy, div);
    }
    var bought = PGu_getValue("bought", "");
    if (bought != "") {
        var newspan = document.createElement("span");
        newspan.innerHTML += '<input type="submit" value="gekaufter Plunder" style="font-size:18px; background-color:darkgreen; float:right" id="boughtplnd">';
        var header = div.getElementsByClassName("ps_header")[0];
        div.insertBefore(newspan, header);
        var buyable = PG_getValue("buyablegoods", "");
        var buyableP = [];
        if (buyable == "")
            buyable = [];
        else {
            buyableP = buyable.replace(/[^#]*=/g, "").replace(/\*[^#]*/g, "").split("#");
            buyable = buyable.replace(/=[^#]*/g, "").split("#");
        }

        // Click-Handler hinzufügen
        document.getElementById("boughtplnd").addEventListener("click", function(event) {
            var bought = PGu_getValue("bought", "");
            if (bought == "")
                bought = "Nichts gekauft";
            else {
                boughtArr = bought.split(";");
                bought = "";
                var btime = new Date();
                for (var i = 0; i < boughtArr.length; i++) {
                    var arr = boughtArr[i].replace(/,/g, ":").split(":");
                    btime.setTime(arr[0]);
                    bought += btime.toLocaleString() + ": ";
                    for (var j = 1; j < arr.length; j++) {
                        bought += buyableP[buyable.indexOf(arr[j])] + (j < arr.length-1?", ":"\n");
                    }
                }
            }
            alert(bought);
        }, false);
    }
}

function insertCheckBox14() {
    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;

    var el = document.getElementById("6");
    if (!el)
        return;
    el.getElementsByTagName("a")[0].href = "#";
    el.getElementsByTagName("img")[0].addEventListener("click", function(event) {
        if (event.altKey != 0)
            unsafeWindow.display_show("sticker_shop");
        else
            unsafeWindow.display_show("shop");
    }, false);
}

function insertCheckBox15() {
    if (!expertMode)
        return;

    var town = ["HH", "B", "MU", "HR", "K", "SY", "VT", "AT", "ML"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;

    var options = "";
    var pltab = 4;
    if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" || TOWNEXTENSION == "MU")
        pltab = 3;
    GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/ajax/?c='+pltab, onload:function(responseDetails) {
        var content = responseDetails.responseText;
        var trs = content.split("<tr ");
        for (var i = 1; i < trs.length; i++) {
            if ((trs[i].indexOf('ktuellen Kampf') != -1 || trs[i].indexOf('ktuellen Angriff') != -1) && trs[i].indexOf("eingehend") == -1) {
                var pid = trs[i].split('pm_')[1].split("'")[0].trim();
                var pname = trs[i].split("<strong ")[1].split("</strong")[0].split(">")[1].trim();
                var anz = trs[i].split("</strong>")[1].split("</span>")[0].split(">x ")[1].trim();
                var effect = trs[i].split('class="pinfo2"')[1].split("</p>")[0].split(">").pop().trim();
                var prozp = effect.indexOf("%");
                if (prozp != -1)
                    effect = effect.substr(0, prozp+1) + " ab";
                else {
                    var p = effect.indexOf("Minute");
                    if (p != -1) {
                        effect = effect.match(/[^ ]+ [^ ]+ Minute[n]*/)[0].replace(/folgenden |nächsten |auf /, "").replace("zwei", 2).trim();
                    }
                }
                options = options + '<option value="' + pid + '">' + pname + ' (' + anz + ') (' + effect + ')</option>';
            }
        }
        var el = document.getElementsByTagName("hr")[2];
        if (!el)
            return;
        var td = el.parentNode.parentNode.previousSibling.previousSibling.getElementsByTagName("td")[0];
        td.innerHTML = '<input name="downfightChb" id="downfightChb" type="checkbox"><span style="vertical-align: bottom">&nbsp;Downfighter automatisch angreifen</span><br>' +
                       '<input name="downfightChb2" id="downfightChb2" type="checkbox" style="visibility:hidden"><span id="dftext1" style="vertical-align: bottom;visibility:hidden">&nbsp;wenn keine Wut, dann </span><select id="dfplunder" name="dfplunder" style="visibility:hidden">'+options+'</select><span id="dftext2" style="vertical-align: bottom;visibility:hidden"> benutzen</span>';

        if (PGu_getValue("downfightauto", false)) {
            document.getElementById("downfightChb").checked = true;
            document.getElementById("downfightChb2").checked = PGu_getValue("dfUsePlunder", false);
            document.getElementById("downfightChb2").style.visibility = "visible";
            document.getElementById("dftext1").style.visibility = "visible";
            if (PGu_getValue("dfPlunder", "") === "")
                document.getElementById("dfplunder").selectedIndex = 0;
            else
                document.getElementById("dfplunder").value = PGu_getValue("dfPlunder", "");
            document.getElementById("dfplunder").style.visibility = "visible";
            document.getElementById("dftext2").style.visibility = "visible";
        }
        else
            document.getElementById("downfightChb").checked = false;
        // Click-Handler hinzufügen
        document.getElementById("downfightChb").addEventListener("click", function(event) {
            // Klickstatus speichern
            PGu_setValue("downfightauto", this.checked);
            if (this.checked) {
                PG_setValue("LastUpdateDF", "0");
                document.getElementById("downfightChb2").style.visibility = "visible";
                document.getElementById("dftext1").style.visibility = "visible";
                document.getElementById("dfplunder").style.visibility = "visible";
                document.getElementById("dftext2").style.visibility = "visible";
            }
            else {
                document.getElementById("downfightChb2").style.visibility = "hidden";
                document.getElementById("dftext1").style.visibility = "hidden";
                document.getElementById("dfplunder").style.visibility = "hidden";
                document.getElementById("dftext2").style.visibility = "hidden";
            }
        }, false);
        document.getElementById("downfightChb2").addEventListener("click", function(event) {
            PGu_setValue("dfUsePlunder", this.checked);
            if (this.checked)
                PGu_setValue("dfPlunder", document.getElementById("dfplunder").value);
        }, false);
        document.getElementById("dfplunder").addEventListener("change", function(event) {
            PGu_setValue("dfPlunder", this.value);
        }, false);
    }});
}

function buildSelectBox(i, allplunderArr, usedPlunder, tr) {
    function handleClick(id, value) {
        // neuen Wert speichern
        var boxnr = id.replace("shopid", "");
        if (value == "-1")
            usedPlunder.splice(boxnr, 1);
        else if (value == "0") {
            if (usedPlunder[0] != "0")
                usedPlunder.splice(0, 0, "0");
        }
        else if (usedPlunder.indexOf(value) != -1)
            usedPlunder.splice(boxnr, 1);
        else
            usedPlunder[boxnr] = value;
        PGu_setValue("alwaysbuy", usedPlunder.join(";"));
        for (var i = 0; i < usedPlunder.length || document.getElementById("shopid"+i); i++) {
            if (i >= usedPlunder.length || usedPlunder[0] == "0" && i > 0) {
                if (document.getElementById("shopid"+i))
                    document.getElementById("shopid"+i).parentNode.parentNode.style.visibility = "hidden";
                continue;
            }
            buildSelectBox(i, allplunderArr, usedPlunder, tr);
        }
        if (i >= allplunderArr.length - 1 || usedPlunder[0] == "0")
            return;
        buildSelectBox(usedPlunder.length, allplunderArr, usedPlunder, tr);
    }
    if (i >= allplunderArr.length - 1 || usedPlunder[0] == "0" && i > 0)
        return;
    var option = '<option value="-1"> </option><option value="0">alles kaufen</option> ';
    for (var j = 0; j < allplunderArr.length; j++) {
        var pos = usedPlunder.indexOf(allplunderArr[j][1]);
        if (pos == -1 || pos == i || usedPlunder[0] == "0")
            option += '<option value="' + allplunderArr[j][1] + '">' + allplunderArr[j][0] + ' (' + allplunderArr[j][2].split("*")[1] + ')</option> ';
    }
    var newtd = document.getElementById("shopid"+i);
    if (newtd) {
        newtd.parentNode.parentNode.style.visibility = "visible";
        newtd.innerHTML = option;
    }
    else {
        newtd = document.createElement("td");
        newtd.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
        newtd.innerHTML = '<form name="shop' + i + '" id="shop' + i + '">' + (i==0?"Plunder immer kaufen":"und außerdem") + ': <select id="shopid' + i +'" name="shopid' + i + '"> ' + option + ' </select> </form>';
        var newdiv = document.createElement("div");
        newdiv.appendChild(newtd, newdiv);
        tr.parentNode.appendChild(newdiv, tr);
        newtd = document.getElementById("shopid"+i);
        // Click-Handler hinzufügen
        newtd.addEventListener("change", function(event) {
            handleClick(this.id, this.value);
        }, false);
    }
    newtd.value = i < usedPlunder.length?usedPlunder[i]:"-1";
    return;
}

// ***********************************************************************************************
// ***********************************************************************************************
// check for enemy game and play it
// ***********************************************************************************************
// ***********************************************************************************************
function CheckEnemygame () {
    PG_log("CheckEnemygame");
    if (!document.getElementById("enemy_info"))
        return;
    GM_xmlhttpRequest({method:"GET", url: prothost + '/enemies/', onload:function(responseDetails) {
            var content = responseDetails.responseText;
            var pos = content.indexOf('id="fight_button');
            if (pos != -1) {
                if (content.substr(pos, 100).indexOf('counter(') == -1)
                    setTimeout(Enemyattack, 1500);
                return;
            }
            pos = content.indexOf('hp_bar_blue');
            if (pos == -1) {
                return;
            }
            else {
                var poscnt = content.indexOf('counter(', pos);
                if (poscnt != -1) {
                    var cnt = parseInt(content.substr(poscnt+8).split(")")[0].split(',')[0]);
                    if (cnt > 0)
                        setTimeout(enemyreload, cnt*1000, "CheckEnemygame");
                }
            }
        }
    });
}

// ***********************************************************************************************
// ***********************************************************************************************
// buy luck
// ***********************************************************************************************
// ***********************************************************************************************
function LoseKaufen (content, anzLose) {
    if (anzLose <= 0) {
        reload("LoseKaufen");
        return;
    }

    var pos = content.indexOf('name="preis_cent"');
    if (pos < 0)
        return;
    var anz = (anzLose > 10?10:anzLose);
    var preis = (Number(content.substr(content.lastIndexOf("<input", pos)).split('value="')[1].split('"')[0]) * anz).toString();

    pos = content.indexOf('name="submitForm"');
    if (pos < 0)
        return;
    var val = content.substr(content.lastIndexOf("<input", pos)).split('value="').pop().split('"')[0];
    preis = preis.substr(0, preis.length-2) + "." + preis.substr(-2);

    HttpPost(content, 1, ["menge", anz, "submitForm", val.replace("1.00", preis)],
            function() { LoseKaufen(content, anzLose - anz); });
}

// ***********************************************************************************************
// ***********************************************************************************************
// start a mission
// ***********************************************************************************************
// ***********************************************************************************************
function StartMission (missionname, id, plist, losecont, nochlose)
{
    trace("Post Missionstart " + id, 2);
    GM_xmlhttpRequest({method: 'POST',
        url: prothost + '/gang/missions/start/',
        headers: {'Content-type': 'application/x-www-form-urlencoded'},
        data: encodeURI('mission_id='+id+'&cancel=false'),
        onload: function(responseDetails) {
             var to = (responseDetails.responseText.indexOf("aktuelle Mission erst abschl") != -1);
             if (to)
                 setTimeout(reload, 30000, "StartMission1");
             else {
                trace('Get ' + prothost + '/gang/admin/log/', 2);
                 GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/admin/log/', onload:function(responseDetails) {
                         var start = responseDetails.responseText.split(" wurde gestartet");
                         var missText = start[0].split("<td").pop().split('"')[1];
                         var user = start[0].substr(0, start[0].lastIndexOf("</td")).split(">").pop().trim();
                         if (user != m_ownusername) {
                             setTimeout(reload, 30000, "StartMission2");
                             return;
                         }
                         if (missionname == "kieztour" || missionname == "strassenkampf") {
                             trace("Post Bandenmail", 2);
                             GM_xmlhttpRequest({method: 'POST',
                                         url: prothost + '/gang/admin/massmail/',
                                         headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                         data: encodeURI('f_subject=Mission ' + missText + ' gestartet&sel=Alle&f_text='+(losecont==""?"":losecont+"\n\nGruß "+user)),
                                         onload: function(responseDetails) {
                                         }
                             });
                         }
                         function plEnable (plist, i) {
                             if (i >= plist.length) {
                                 if (missionname == "casino") {
                                     trace("Lose kaufen: " + nochlose, 5);
                                     LoseKaufen(losecont, nochlose);
                                 }
                                 else
                                     reload("plEnable");
                                 return;
                             }
                             trace("Post Enable Plunder", 2);
                             GM_xmlhttpRequest({method: 'POST',
                                         url: prothost + '/gang/missions/plunder/enable/',
                                         headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                         data: encodeURI('pid='+plist[i]),
                                         onload: function(responseDetails) {
                                                 plEnable(plist, i+1);
                                         }
                             });
                         }
                         plEnable(plist, 0);
                     }
                 });
             }
        }
    });
}
// ***********************************************************************************************
// ***********************************************************************************************
// handle a mission
// ***********************************************************************************************
// ***********************************************************************************************
function HandleMission (missionname, missionStart, missions)
{
    var m = MissIndex(missionStart, missionname);
    if (m < 1 || m >= missionStart.length)
        return -1;
    var missname = missionStart[m][0];
    var pos = missions[m].indexOf(missname + '.png');
    if (pos == -1)
        return -1;
    var mission = missions[m].substr(pos).split("</table>")[0];
    pos = mission.indexOf("counter(");
    var counter = 0;
    if (pos != -1) {
        counter = mission.substr(pos).split("counter(")[1].split(")")[0].trim();
        if (counter != done) {
            counter = Number(counter);
            PGu_setValue("NextStart" + missionname, counter);
        }
        else
            PGu_setValue("NextStart" + missionname, -1);
        if (counter > 0 && counter < 3600)
            setTimeout(reload, (counter<3?3:counter) * 1000, "HandleMission1");
    }
    var plist = mission.split('show_city_list(');
    var plnd = [];
    for (var j = 1; j < plist.length; j++) {
        var pid = plist[j].split(",")[0];
        var pos = plist[j-1].lastIndexOf("icon_display");
        if (pos == -1)
            continue;
        var plunder = plist[j-1].substr(pos).split("<span>")[1].split("</span>")[0].trim();
        if (PGu_getValue(plunder+"Coll", false))
            plnd.push(pid);
    }

    var cnt = 0;
    for (var j = 0; j < plnd.length; j++) {
        var pos = mission.indexOf('show_city_list('+plnd[j]+',');
        if (pos == -1)
            continue;
        if (mission.substr(pos,40).indexOf('deactivate') == -1) {
            cnt++;
            var today = new Date();
            var now = Math.floor(today.getTime()/1000);
            var plndColl = PGu_getValue(plnd[j] + "_Coll", -1);
            if (plndColl == -1)
                PGu_setValue(plnd[j] + "_Coll", Math.floor(now/1000));
            else if (plndColl + 30 < now) {
                PGu_setValue(plnd[j] + "_Coll", -1);
                trace("Post Enable Plunder", 2);
                GM_xmlhttpRequest({method: 'POST',
                       url: prothost + '/gang/missions/plunder/enable/',
                       headers: {'Content-type': 'application/x-www-form-urlencoded'},
                       data: encodeURI('pid='+plnd[j]),
                       onload: function(responseDetails) {
                           reload("HandleMission2");
                       }
                });
            }
        }
        else
            PGu_setValue(plnd[j] + "_Coll", -1);
    }
    if (cnt > 0)
        return 0;

    var pos = mission.indexOf('job_notdone');
    if (pos != -1) {
        if (missionname == "kieztour")
            PGu_setValue("KiezTourAct", 1);
        if (missionname == "strassenkampf")
            PGu_setValue("StrassenKampfAct", 1);
        if (missionname == "casino" && mission.substr(pos).split("<br")[0].indexOf("Rubbellose") == -1)
            return -1;
        return pos;
    }
    if (missionname == "kieztour")
        PGu_setValue("KiezTourAct", 0);
    if (missionname == "strassenkampf")
        PGu_setValue("StrassenKampfAct", 0);

    if (missions[1].indexOf("return cancel_popup(") != -1)
        return -1;

    if (missionname == "schrottplatz") {
        var allplunder = PG_getValue("allplunder", "").replace("&auml;", "ä").replace("&ouml;", "ö").replace("&uuml;", "ü").replace("&szlig;", "ß").split(";");
        for (var i = allplunder.length - 1; i >= 0; i--)
            if (allplunder.indexOf(allplunder[i]) < i || allplunder[i] == "Zertr&uuml" || allplunder[i] == "Zertrü" || allplunder[i].startsWith("mmerte"))
                allplunder.splice(i, 1);
            else if (allplunder[i] == "Abgehackte Hand:0" || allplunder[i] == "Blutige Axt:0")
                allplunder[i] = allplunder[i].replace(":0", ":1");
        PG_setValue("allplunder", allplunder.join(";"));
    }
    pos = mission.indexOf("mission_item_notready");
    if (pos != -1) {
        var amount = mission.substr(pos).split('class="amount">x')[1].split('</span')[0].trim();
        var plunder = mission.substr(pos).split('class="amount">x')[0].split("<span>").pop().split('</span')[0].trim();
        var muss = Number(amount.split("(")[0].trim());
        var ist = Number(amount.split("(")[1].split(")")[0].trim());
        if (muss < 1000 && !PGu_getValue(plunder+"Coll", false))
            return -1;
        if (muss >= 1000 && !PGu_getValue(plunder+"PayIn", false))
            return -1;
        if (ist < muss) {
            gangpayin(plunder, muss - ist);
            return 0;
        }
    }
    if (mission.indexOf('start_mission(') != -1) {
        var auto = PGu_getValue(missname+"Auto", false);
        if (!auto)
            return -1;
        var mintime = -1;
        for (var j = 1; j < missionStart.length; j++)
            if (missname == missionStart[j][0])
                continue;
            else if (mintime == -1 || mintime > missionStart[j][1])
                mintime = missionStart[j][1];
        if (PGu_getValue(missname+"MissT", false) && PGu_getValue(missname+"Time", 0)*60 > mintime)
            return -1;
        var id = mission.split('start_mission(')[1].split(')')[0];
        if (missionname == "casino") {
            trace('Get ' + prothost + '/city/games/', 2);
            GM_xmlhttpRequest({method:"GET",
                url: prothost + '/city/games/',
                onload:function(responseDetails) {
                    var content = responseDetails.responseText.split('id="content"')[1];
                    var to = 0;
                    var nochlose = content.split("Du kannst heute noch ").pop();
                    if (nochlose.indexOf("lose_remaining") != -1)
                        nochlose = nochlose.split("</span>")[0].split(">").pop();
                    if (nochlose == 0)
                        return;
                    var gesamt = Number(mission.match(/Kauft \d* Rubbel/)[0].split(" ")[1]);
                    if (gesamt < nochlose)
                        nochlose = gesamt;
                    StartMission (missionname, id, plnd, content, nochlose);
                }
            });
            return -1;
        }
        if (missionname == "kieztour" || missionname == "strassenkampf") {
            var zText = "";
            if (missionname == "strassenkampf") {
                var lis = mission.split("stage_area")[2].split("<li");
                var spl = lis[1].split(/\d+ +Kämpfe/)[0].split("</div>")[1].trim().split(" ");
                spl.splice(0,2);
                zText = "Bitte alle bei Kämpfen nach " + spl.join(" ") + " ziehen.";
            }
            StartMission (missionname, id, plnd, zText, 0);
            return 0;
        }
        if (missionname == "schrottplatz") {
            var neededPlunder = [];
            var pAnz = 0;
            for (var i = 1; i < missions.length; i++) {
                var lis = missions[i].split("stage_area")[1].split("<li>");
                for (var j = 1; j < lis.length; j++) {
                    var beg = lis[j].split('"amount"');
                    if (beg.length > 1) {
                        var plname = beg[0].split("<span>")[1].split("<")[0].trim();
                        if (!PGu_getValue(plname+"Schrott", false))
                            neededPlunder[pAnz++] = plname;
                    }
                }
            }
            var gesamt = Number(missions[m].split(" Plunder verschrotten")[0].substr(-50).match(/[\d]+/g).pop().trim());
            var allplunder = PG_getValue("allplunder", "");
            if (allplunder == "")
                return 0;
            var plunderlist = allplunder.replace(/:\d*/g, "").split(";");
            allplunder = allplunder.split(";");
            var openCalls = 0;
            trace('Get ' + prothost + '/gang/stuff/upgrades/', 2);
            GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/stuff/upgrades/', onload:function(responseDetails) {
                var upgrstuff = responseDetails.responseText.split(responseDetails.responseText.indexOf('class="skill_block')==-1?"<tr":'class="skill_block');
                for (var j = 0; j < upgrstuff.length; j++) {
                    if (upgrstuff[j].indexOf("required_skills") != -1) {
                        var skpt = upgrstuff[j].match(/skill_progress_text">\d+ von \d+</);
                        if (skpt.length == 0)
                            continue;
                        skpt = skpt[0].split("<")[0].split(">").pop().split("von");
                        if (skpt.length != 2)
                            continue;
                        if (skpt[0].trim() == skpt[1].trim())
                            continue;
                        var plname = upgrstuff[j].split('required_skills')[1].split("</div")[0].split("<span");
                        for (var k = 0; k < plname.length-1; k++) {
                            var skspl = plname[k].split(">").pop().trim().split(" ");
                            var amnt = skspl.pop();
                            var pl = skspl.join(" ");
                            if (neededPlunder.indexOf(pl) == -1)
                                neededPlunder[pAnz++] = pl;
                        }
                        continue;
                    }
                    if (upgrstuff[j].indexOf("<td>Kosten") == -1)
                        continue;
                    var plname = upgrstuff[j].split("<td").pop().split("<br");
                    for (var k = 0; k < plname.length-1; k++) {
                        var pl = plname[k].split(/\d+x /)[1].trim();
                        if (neededPlunder.indexOf(pl) == -1)
                            neededPlunder[pAnz++] = pl;
                    }
                }
                trace('Get ' + prothost + '/gang/stuff/', 2);
                GM_xmlhttpRequest({method:"GET",
                    url: prothost + '/gang/stuff/',
                    onload:function(responseDetails) {
                        function TestMissionPlunder(msgs, akti, missStart) {
                            for (var i = akti; i < msgs.length; i++) {
                                var tds = msgs[i].split("<td ");
                                if (tds[4].split("<span")[1].split(">")[1].split("<")[0].replace(/&nbsp;/g, "").trim() != "0")
                                    continue;
                                var plname = tds[2].split("<strong>")[1].split("<")[0];
                                if (neededPlunder.indexOf(plname) != -1)
                                    continue;
                                var plAnz = Number(tds[3].split("<span")[1].split(">")[1].split("<")[0].replace(/&nbsp;/g, "").trim());
                                var plInd = plunderlist.indexOf(plname);
                                if (plInd != -1) {
                                    plAnz = Math.floor(plAnz/(allplunder[plInd].endsWith(":1")?60:1));
                                    plAnzGes += plAnz;
                                }
                                else {
                                    var trash = tds[6].split("trash_plunder('");
                                    if (trash.length > 1) {
                                        var pid = trash[1].split("'")[0].trim();
                                        openCalls++;
                                        trace('Get ' + prothost + '/stock/plunder/craft/details/'+pid+'/', 2);
                                        GM_xmlhttpRequest({method:"GET",
                                            url: prothost + '/stock/plunder/craft/details/'+pid+'/',
                                            onload:function(responseDetails) {
                                                var pcont = responseDetails.responseText.split('class="plundertitle"')[1];
                                                if (pcont.indexOf('"pinfo2"') != -1) {
                                                    var pinfo2 = pcont.split('"pinfo2"')[1];
                                                    var plname = pcont.split("</strong")[0].split(">").pop().trim();
                                                    if (pinfo2.indexOf("Missionsplunder") != -1 || pinfo2.indexOf("Bandenmission") != -1)
                                                        allplunder.push(plname+":1");
                                                    else
                                                        allplunder.push(plname+":0");
                                                    plunderlist.push(plname);
                                                }
                                                openCalls--;
                                                TestMissionPlunder(msgs, i+1, missStart);
                                            }
                                        });
                                        return;
                                    }
                                }
                            }
                            if (i >= msgs.length && missStart) {
                                PG_setValue("allplunder", allplunder.join(";"));
                                if (plAnzGes >= gesamt)
                                    StartMission (missionname, id, plnd, "", 0);
                            }
                        }
                        function getGangStuff(categ, ix) {
                            if (openCalls > 0) {
                                window.setTimeout(getGangStuff, 500, categ, ix);
                                return;
                            }
                            if (ix < categ.length) {
                                var href = categ[ix].split('"')[0];
                                trace('Get ' + prothost + href, 2);
                                GM_xmlhttpRequest({method:"GET",
                                    url: prothost + href,
                                    onload:function(responseDetails) {
                                        var msgs = responseDetails.responseText.split('"msglist"');
                                        TestMissionPlunder(msgs, 1, false);
                                        getGangStuff (categ, ix+1);
                                    }
                                });
                                return;
                            }
                            PG_setValue("allplunder", allplunder.join(";"));
                            if (plAnzGes >= gesamt)
                                StartMission (missionname, id, plnd, "", 0);
                        }
                        var stuff = responseDetails.responseText;
                        if (stuff.indexOf("/category/") == -1) {
                            var msgs = stuff.split('"msglist"');
                            var plAnzGes = 0;
                            TestMissionPlunder(msgs, 1, true);
                        }
                        else {
                            var cat = stuff.split('id="plundertab')[1].split("</ul")[0].split('href="');
                            var plAnzGes = 0;
                            getGangStuff(cat, 1);
                        }
                    }
                });
            }});
            return 0;
        }
    }
    else if (mission.indexOf('return reward_popup(') != -1 || mission.indexOf('href="/gang/missions/reward/') != -1) {
        var aktBoost = missions[0].split("Aktueller Bandenboost");
        if (!PGu_getValue(missname+"Rwd", false))
            var abhol = false;
        else if (aktBoost.length == 1 || aktBoost[1].indexOf("Kein Boost vorh") != -1 || missionname == "kieztour")
            var abhol = true;
        else {
            var boost = aktBoost[1].split('src="')[1].split('"')[0].split("/").pop().split(".")[0];
            var abhol = PGu_getValue(boost+"Over", false);
        }
        if (abhol) {
            window.location = prothost + '/gang/missions/reward/';
        }
    }
    return -1;
}

// ***********************************************************************************************
// ***********************************************************************************************
// get time until start of mission
// ***********************************************************************************************
// ***********************************************************************************************
function getMissTime(missionname, content) {
    var misstime = -1;
    var missname = missionname;
    var pos = content.indexOf(missionname+'.png');
    if (pos == -1) {
           if (missionname == "kieztour")
            missname = "davinci_code";
        else if (missionname == "strassenkampf")
            missname = "schlacht_petersplatz";
        else if (missionname == "schrottplatz")
            missname = "kreuzzug";
        pos = content.indexOf(missname+'.png');
    }
    if (pos > 0) {
        misstime = 0;
        var mission = content.substr(pos).split("</table>")[0];
        pos = mission.split("stage_area")[1].indexOf("counter(");
        if (pos != -1) {
            var counter = mission.substr(pos).split("counter(")[1].split(")")[0].trim();
            if (counter == done)
                counter = "0";
            misstime = Number(counter);
        }
        else if (!PGu_getValue(missname+"Auto", false) || mission.indexOf("mission_item_notready") != -1)
            misstime = 999999999;
    }
    return misstime;
}

// ***********************************************************************************************
// ***********************************************************************************************
// find mission index
// ***********************************************************************************************
// ***********************************************************************************************
function MissIndex (missions, mission) {
    for (var i = 1; i < missions.length; i++)
        if (missions[i][0] == mission)
            return i;
    var missname = mission;
    if (missname == "kieztour")
        missname = "davinci_code";
    else if (missname == "strassenkampf")
        missname = "schlacht_petersplatz";
    else if (missname == "schrottplatz")
        missname = "kreuzzug";
    for (var i = 1; i < missions.length; i++)
        if (missions[i][0] == missname)
            return i;
    return -1;
}

// ***********************************************************************************************
// ***********************************************************************************************
// check for mission
// ***********************************************************************************************
// ***********************************************************************************************
function CheckMission () {
    PG_log("CheckMission");
    trace('Get ' + prothost + '/gang/missions/', 2);
    GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/missions/', onload:function(responseDetails) {
            var content = responseDetails.responseText;
            missionContent = content;
            var missions = content.split('class="gang_mission"');
            if (missions.length < 2)
                return;
            var mission = missions[1].split("</table>")[0];
            var aktBoost = content.split("Aktueller Bandenboost");
            var boost = "";
            if (aktBoost.length > 1 && aktBoost[1].indexOf("Kein Boost vorh") == -1) {
                boost = aktBoost[1].split('src="')[1].split('"')[0].split("/").pop().split(".")[0];
                if (boost == "boost_nitro" && aktBoost[1].split("</script")[0].indexOf("counter(") != -1)
                    nitroCount = Number(aktBoost[1].split("</script")[0].split("counter(")[1].split(")")[0]);
            }
            if (mission.indexOf('return reward_popup(') != -1 || mission.indexOf('href="/gang/missions/reward/') != -1) {
                var missname = mission.split("background-image")[1].split(")")[0].split("/").pop().split(".")[0];
                if (PGu_getValue(missname+"Rwd", false) && (boost == "" || PGu_getValue(boost+"Over", false))) {
                    window.location = prothost + '/gang/missions/reward/';
                    return;
                }
            }
            var pos = content.indexOf('boost_button');
            if (pos != -1)
                pos = content.substr(pos).indexOf('activate_boost(');
            if (pos != -1) {
                var aktBoost = content.split("Aktueller Bandenboost");
                if (aktBoost.length == 1 || aktBoost[1].indexOf("Kein Boost vorh") != -1)
                    var Start = false;
                else {
                    var boost = aktBoost[1].split('src="')[1].split('"')[0].split("/").pop().split(".")[0];
                    var Start = PGu_getValue(boost+"Start", false);
                }
                if (Start) {
                    HttpPost(content, "boost_form", [], function() { reload("CheckMission1"); });
                    return;
                }
            }
            var missionStart = [];
            for (var i = 1; i < missions.length; i++) {
                var mission = missions[i].split("background-image")[1].split(")")[0].split("/").pop().split(".")[0];
                var missTime = getMissTime(mission, missions[i]);
                missionStart[i] = [mission, missTime];
                if (i == 1)
                    missionStart[0] = [mission, missTime];
                if (!PGu_getValue(mission+"MissT", false))
                    continue;
                missTime = PGu_getValue(mission + "Time", 0)*60;
                for (var j = 1; j < i; j++)
                    if (missTime + missionStart[i][1] > missionStart[j][1])
                        missionStart[i][1] = missionStart[j][1];
                if (missionStart[i][1] == 0)
                    missionStart[i][1] = missTime;

                if (missionStart[i][1] < missionStart[0][1])
                    missionStart[0] = missionStart[i];
            }

            pos = HandleMission("casino", missionStart, missions);
            if (pos > 0) {
                var kauf = missions[1].substr(pos).split("<br")[1].split("</span")[0].split(">").pop().trim();
                kauf = kauf.split("/");
                var gekauft = Number(kauf[0].trim());
                var gesamt = Number(kauf[1].trim());
                if (gekauft == gesamt)
                    return;
                trace('Get ' + prothost + '/gang/admin/log/', 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/admin/log/', onload:function(responseDetails) {
                        var casino = responseDetails.responseText.split('Mission "Casino-Besuch" wurde gestartet');
                        var pos = casino[0].lastIndexOf("</td>");
                        var to = 0;
                        if (pos == -1)
                            to = 30;
                        if (!casino[0].substr(0, pos).endsWith(m_ownusername))
                            to = 30;
                        if (to > 0) {
                            var now = new Date().getTime();
                            var tdiff = now - Number(PGu_getValue("LastLoseKauf", "0"));
                            if (tdiff > 60000) {
                                PGu_setValue("LastLoseKauf", now+"");
                                tdiff = 0;
                            }
                            if (tdiff < to*1000) {
                                setTimeout(reload, to*1000 - tdiff, "CheckMission2");
                                return;
                            }
                        }
                        trace('Get ' + prothost + '/city/games/', 2);
                        GM_xmlhttpRequest({method:"GET", url: prothost + '/city/games/', onload:function(responseDetails) {
                                var content = responseDetails.responseText.split('id="content"')[1];
                                var nochlose = content.split("Du kannst heute noch ").pop();
                                if (nochlose.indexOf("lose_remaining") != -1)
                                    nochlose = nochlose.split("</span>")[0].split(">").pop();
                                if (nochlose == 0)
                                    return;
                                if (gesamt - gekauft < nochlose)
                                    nochlose = gesamt - gekauft;
                                if (nochlose > 100)
                                    nochlose = 100;
                                trace("Lose kaufen: " + nochlose, 5);
                                LoseKaufen(content, nochlose);
                            }
                        });
                    }
                });
                return;
            }
            pos = HandleMission("schrottplatz", missionStart, missions);
            if (pos > 0 && PGu_getValue(missionStart[0][0]+"Auto", false)) {
                var neededPlunder = [];
                var pAnz = 0;
                for (var i = 1; i < missions.length; i++) {
                    var lis = missions[i].split("stage_area")[1].split("<li>");
                    for (var j = 1; j < lis.length; j++) {
                        var beg = lis[j].split('"amount"');
                        if (beg.length > 1) {
                            var plnd = beg[0].split("<span>")[1].split("<")[0].trim();
                            if (!PGu_getValue(plnd+"Schrott", false))
                                neededPlunder[pAnz++] = plnd;
                        }
                    }
                }
                var kauf = missions[1].substr(pos).split("<br")[1].split("</span")[0].split(">").pop().trim();
                kauf = kauf.split("/");
                var gekauft = Number(kauf[0].trim());
                var gesamt = Number(kauf[1].trim());
                if (gekauft == gesamt)
                    return;
                var allplunder = PG_getValue("allplunder", "");
                if (allplunder == "")
                    return;
                var plunderlist = allplunder.replace(/:\d*/g, "").split(";");
                allplunder = allplunder.split(";");
                var openCalls = 0;
                trace('Get ' + prothost + '/gang/stuff/upgrades/', 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/stuff/upgrades/', onload:function(responseDetails) {
                    var upgrstuff = responseDetails.responseText.split(responseDetails.responseText.indexOf('class="skill_block')==-1?"<tr":'class="skill_block');
                    for (var j = 0; j < upgrstuff.length; j++) {
                        if (upgrstuff[j].indexOf("required_skills") != -1) {
                            var skpt = upgrstuff[j].match(/skill_progress_text">\d+ von \d+</);
                            if (skpt.length == 0)
                                continue;
                            skpt = skpt[0].split("<")[0].split(">").pop().split("von");
                            if (skpt.length != 2)
                                continue;
                            if (skpt[0].trim() == skpt[1].trim())
                                continue;
                            var plnd = upgrstuff[j].split('required_skills')[1].split("</div")[0].split("<span");
                            for (var k = 0; k < plnd.length-1; k++) {
                                var skspl = plnd[k].split(">").pop().trim().split(" ");
                                var amnt = skspl.pop();
                                var pl = skspl.join(" ");
                                if (neededPlunder.indexOf(pl) == -1)
                                    neededPlunder[pAnz++] = pl;
                            }
                            continue;
                        }
                        if (upgrstuff[j].indexOf("<td>Kosten") == -1)
                            continue;
                        var plnd = upgrstuff[j].split("<td").pop().split("<br");
                        for (var k = 0; k < plnd.length-1; k++) {
                            var pl = plnd[k].split(/\d+x /)[1].trim();
                            if (neededPlunder.indexOf(pl) == -1)
                                neededPlunder[pAnz++] = pl;
                        }
                    }
                    trace('Get ' + prothost + '/gang/stuff/', 2);
                    GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/stuff/', onload:function(responseDetails) {
                        function TestMissionPlunder(msgs, akti, trash) {
                            for (var i = akti; i < msgs.length; i++) {
                                var tds = msgs[i].split("<td ");
                                if (tds[4].split("<span")[1].split(">")[1].split("<")[0].replace(/&nbsp;/g, "").trim() != "0")
                                    continue;
                                var pltext = tds[6].split("trash_plunder(")[1].split(")")[0];
                                var plnd = pltext.split("'")[1].trim();
                                if (neededPlunder.indexOf(plnd) != -1)
                                    continue;
                                var pid = pltext.split(",")[0].trim();
                                var plAnz = Number(pltext.split(",")[1].trim());
                                var plInd = plunderlist.indexOf(plnd);
                                if (plInd != -1) {
                                    if (allplunder[plInd].endsWith("1")) {
                                        if ((mp && plAnz <= leastAnz || !mp) && plAnz >= minMiss) {
                                             leastAnz = plAnz;
                                             leastpl = pltext;
                                             mp = true;
                                        }
                                    }
                                    else if (!mp && (leastpl == "" || plAnz < leastAnz)) {
                                        leastAnz = plAnz;
                                        leastpl = pltext;
                                    }
                                }
                                else {
                                    openCalls++;
                                    trace('Get ' + prothost + '/stock/plunder/craft/details/'+pid+'/', 2);
                                    GM_xmlhttpRequest({method:"GET",
                                        url: prothost + '/stock/plunder/craft/details/'+pid+'/',
                                        onload:function(responseDetails) {
                                            var pcont = responseDetails.responseText.split('class="plundertitle"')[1];
                                            var plname = pcont.split("</strong")[0].split(">").pop().trim();
                                            var mpl = 0;
                                            if (pcont.indexOf('"pinfo2"') != -1)
                                                if (pcont.split('"pinfo2"')[1].indexOf("Missionsplunder") != -1 ||
                                                    pcont.split('"pinfo2"')[1].indexOf("Bandenmission") != -1)
                                                    mpl = 1;
                                            allplunder.push(plname+":"+mpl);
                                            plunderlist.push(plname);
                                            if (mpl == 1) {
                                                if ((mp && plAnz <= leastAnz || !mp) && plAnz >= minMiss) {
                                                     leastAnz = plAnz;
                                                     leastpl = pltext;
                                                     mp = true;
                                                }
                                            }
                                            else if (!mp && (leastpl == "" || plAnz < leastAnz)) {
                                                leastAnz = plAnz;
                                                leastpl = pltext;
                                            }
                                            openCalls--;
                                            TestMissionPlunder(msgs, i+1, trash);
                                        }
                                    });
                                    return;
                                }
                            }
                            if (i >= msgs.length && trash) {
                                PG_setValue("allplunder", allplunder.join(";"));
                                if (leastAnz > 0) {
                                    var pid = leastpl.split(",")[0].trim();
                                    if (gesamt - gekauft < leastAnz/(mp?60:1))
                                        leastAnz = (gesamt - gekauft)*(mp?60:1);
                                    else if (mp && minMiss != 0)
                                        leastAnz = Math.floor(leastAnz / 60) * 60;
                                    HttpPost(stuff, "stuff_trash_form", ["plunder_id", pid, "trash_amount", leastAnz], function() { reload("CheckMission3"); });
                                }
                            }
                        }
                        function getGangStuff(categ, ix) {
                            if (openCalls > 0) {
                                window.setTimeout(getGangStuff, 500, categ, ix);
                                return;
                            }
                            if (ix < categ.length) {
                                var href = categ[ix].split('"')[0];
                                trace('Get ' + prothost + href, 2);
                                GM_xmlhttpRequest({method:"GET",
                                    url: prothost + href,
                                    onload:function(responseDetails) {
                                        var msgs = responseDetails.responseText.split('"msglist"');
                                        TestMissionPlunder(msgs, 1, false);
                                        getGangStuff (categ, ix+1);
                                    }
                                });
                                return;
                            }
                            PG_setValue("allplunder", allplunder.join(";"));
                            if (leastAnz > 0) {
                                var pid = leastpl.split(",")[0].trim();
                                if (gesamt - gekauft < leastAnz/(mp?60:1))
                                    leastAnz = (gesamt - gekauft)*(mp?60:1);
                                else if (mp && minMiss != 0)
                                    leastAnz = Math.floor(leastAnz / 60) * 60;
                                HttpPost(stuff, "stuff_trash_form", ["plunder_id", pid, "trash_amount", leastAnz], function() { reload("CheckMission3"); });
                            }
                        }
                        var stuff = responseDetails.responseText;
                        if (stuff.indexOf("/category/") == -1) {
                            var msgs = stuff.split('"msglist"');
                            var leastpl = "";
                            var leastAnz = 0;
                            var mp = false;
                            var minMiss = PGu_getValue("trashAllMissPlund", false)?0:60;
                            TestMissionPlunder(msgs, 1, true);
                        }
                        else {
                            var cat = stuff.split('id="plundertab')[1].split("</ul")[0].split('href="');
                            var leastpl = "";
                            var leastAnz = 0;
                            var mp = false;
                            var minMiss = PGu_getValue("trashAllMissPlund", false)?0:60;
                            getGangStuff(cat, 1);
                        }
                    }});
                }});
                return;
            }
            pos = HandleMission("kieztour", missionStart, missions);
            if (pos >= 0)
                return;
            pos = HandleMission("strassenkampf", missionStart, missions);
        }
    });
}

function getSeks(counter) {
    if (counter == done)
        return 0;

    var days = 0;
    var cnt = counter.split(":");
    if (cnt[0].indexOf(" ") != -1) {
        days = Number(cnt[0].split(" ")[0]);
        cnt[0] = cnt[0].split(" ").pop();
    }
    var seks = 0;
    for (var i = 0; i < cnt.length; i++)
        seks = seks * 60 + Number(cnt[i]);
    return days * 86400 + seks;
}

function getvcounter () {
    var vcounter = done;
    if (document.getElementsByClassName("chest_counter").length == 0) {
        var tbl = document.getElementsByTagName("table");
        for (var i = tbl.length - 1; i > 0; i--)
            if (tbl[i].className)
                if (tbl[i].className == "cbox")
                    break;
        var trs = tbl[i].getElementsByTagName("tr");
        if (trs.length > 2) {
            var span = trs[2].getElementsByTagName("span");
            for (var i = 0; i < span.length; i++) {
                if (span[i].id)
                    if (span[i].id.startsWith("counter")) {
                        vcounter = span[i].innerHTML;
                        if (vcounter.trim() == done0)        // is the time 00:00 ?
                            vcounter = done;
                        break;
                    }
            }
        }
    }
    return getSeks(vcounter);
}

// ***********************************************************************************************
// ***********************************************************************************************
// Funktion sendet einen HTTP-Request via POST
// ***********************************************************************************************
// ***********************************************************************************************
function PostToHTTP(URL, pars, onsuccess) {
    var params = [];
    for (var i = 0; i < pars.length / 2; i++)
        params[i] = pars[i*2] + "=" + encodeURIComponent(pars[i*2+1]);

    GM_xmlhttpRequest({
        method: 'POST',
        url: URL,
        headers: {'Content-type': 'application/x-www-form-urlencoded'},
        data: params.join("&"),
        onload: function(responseDetails)
            {
                if (URL.indexOf('downfight.de') != -1 && responseDetails.status != 200) {
                    alert("Fehler beim Abruf der Daten von downfight.de: " + responseDetails.statusText + ". Bitte später noch einmal versuchen.");
                    return;
                }
                if (URL.indexOf('www.downfight.de') != -1) {
                    if (responseDetails.responseText.indexOf('unscharf.png') != -1) {
                        PostToHTTP(URL.replace('www.', ''), pars, onsuccess);
                        return;
                    }
                }
                if (typeof onsuccess == "function")
                    onsuccess(responseDetails.responseText);
                else if (onsuccess != "")
                    alert(onsuccess);
            }
    });
}

// ***********************************************************************************************
// ***********************************************************************************************
// Funktion überprüft, ob die im GM-Key "keyname" gespeicherte Zeit länger als "interval"
// Minuten vorüber ist. Falls ja, wird true zurückgegeben und die neue Zeit gespeichert
// ***********************************************************************************************
// ***********************************************************************************************
function IsTimeToCheck(keyname, interval) {
    var now = new Date();

    if (isNaN(GM_getValue(keyname, "0")))
        return true;
    if ((Number(now) - Number(GM_getValue(keyname, "0"))) / 1000 / 60 >= interval) {
        return true;
    }
    return false;
}

// ***********************************************************************************************
// Funktion ermittelt den Usernamen von df.de
// ***********************************************************************************************
function GetUserNameFromDFDE(content) {
    if (content.indexOf('target="_blank') == -1)
        return [0, ""];
    var username = content.split('target="_blank')[1].split('">')[1].split('</a>')[0].split('<br>')[0].trim();
    var userid = content.split("/profil/id:")[1].split("/")[0];
    return [userid, username];
}

// **********************************************************************************
// **********************************************************************************
// Funktion wandelt einen HTML-Content in ein DOM um
// **********************************************************************************
// **********************************************************************************
function HTML2DOM(content) {

    var dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = content;

    return dummyDiv;
}

// ***********************************************************************************************
// Abrufen der DF-Liste von downfight.de
// ***********************************************************************************************
function updDFList() {
    var DFusers = [];
    function testDF(userid, username) {
        updDFcount++;
        trace("Statusprüfung User " + username, 2);
        PostToHTTP(prothost + "/profil/id:" + userid + "/", [], function(content) {
            if (content.split("button.attack_not")[1].split('name="form_friend"')[1].split("<div")[0].indexOf("/fight/?to=" + username) != -1) {
                var pkt = Number(content.split('id="userbox"')[1].split('valign="middle"')[1].split("</td")[1].split(">").pop());
                DFusers.push([userid, pkt, username]);
            }
            updDFcount--;
        });
    }
    function setDFList() {
        if (updDFcount > 0) {
            trace("noch " + updDFcount + " Statusprüfung" + (updDFcount == 1?"":"en") + " offen.", 2);
            setTimeout(setDFList, 500);
        }
        else {
            DFusers.sort(function(a, b) { return a[1] - b[1]; });
            for (var i = 0; i < DFusers.length; i++)
                DFusers[i] = DFusers[i].join(":");
            trace("DFList wird aktualisiert auf " + DFusers.join(";"), 2);
            PGu_setValue("DFList", DFusers.join(";"));
            PGu_delete("lastDF");
            PGu_delete("nextDF");
            PG_setValue("LastUpdateDF", (new Date()).getTime().toString());
            trace("DFList aktualisiert auf " + DFusers.join(";"), 2);
        }
    }
    PG_log("updDFList");
    var town = ["HH", "B", "MU", "HR", "K", "SY", "VT", "AT", "ML"];
    var DFTownCode = ["hamburg", "berlin", "muenchen", "reloaded", "koeln", "sylt", "vatikan", "atlantis", "malle"];
    var ix = town.indexOf(TOWNEXTENSION);
    if (ix < 0)
        return;
    if (IsTimeToCheck(TOWNEXTENSION + "LastUpdateDF", 10)) {
        trace("DFList wird aktualisiert", 2);
        var URL = window.location.protocol + "//www.downfight.de/?seite=downfight_" + DFTownCode[ix];
        var Params = ['myatt', myATT, 'mydef', myDEF];
        PostToHTTP(URL, Params, function(content) {
            var doc = HTML2DOM(content);
            for (var i = doc.getElementsByTagName("table").length - 1; i > 0; i--)
                if (doc.getElementsByTagName("table")[i].innerHTML.indexOf("angriff.gif") != -1)
                    break;
            var dftrs = doc.getElementsByTagName("table")[i].getElementsByTagName("tr")[1].getElementsByTagName("table")[0].getElementsByTagName("tr");
            for (var i = 1; i <= dftrs.length - 2; i++) {
                if (dftrs[i].getElementsByTagName("td").length < 10)
                    continue;
                var user = GetUserNameFromDFDE(dftrs[i].getElementsByTagName("td")[4].innerHTML);
                if (user[1] != "")
                    testDF(user[0], user[1]);
            }
            setTimeout(setDFList, 1000);
        });
    }
}

function submit(){

    PG_log("submit");

    if (updDFcount > 0) {
        var lastupdDFc = PGu_getValue("lastupdDFc", 0);
        if (lastupdDFc != updDFcount) {
            PGu_setValue("lastupdDFc", updDFcount);
            setTimeout(submit, 5000);
            return;
        }
        PGu_delete("lastupdDFc");
    }

    if (document.getElementsByName("bottlecollect_pending").length == 0 && PGu_getValue("downfightauto", false)) {
        var DFList = PGu_getValue("DFList", "");
        if (DFList != "") {
            var DFusers = DFList.split(";");
            var lastDF = PGu_getValue("lastDF", "");
            var ldf = 0;
            if (lastDF != "")
                for (var i = 0; i < DFusers.length; i++)
                    if (DFusers[i].split(":")[2] == lastDF) {
                        ldf = i + 1;
                        break;
                    }

            if (ldf < DFusers.length) {
                var user = DFusers[ldf].split(":");
                PGu_setValue("nextDF", user[2]);
                window.location.href = prothost + "/fight/?to=" + user[2];
                return;
            }
            else
                PGu_delete("DFList");
        }
    }

    if(window.location.pathname.indexOf("/activities/") != -1 && window.location.pathname.indexOf("/crime/") == -1 && autoSubmit){

        if (document.getElementsByClassName("chest_key_on").length > 0) {
            var href = document.getElementsByClassName("chest_menu")[0].getElementsByClassName("chest_button")[0].href;
            window.location.href = href;
        }

        if (getvcounter() != 0) {
            PG_log("Verbrechen läuft");
            var lastURL = PGu_getValue("AutoCollURL", "");
            if (lastURL != "") {
                PGu_setValue ("AutoCollURL", "");
                window.location.replace( lastURL );
            }
            else {
                PGu_setValue(nameTime, time);
                PGu_setValue("AskedForCollect", 0);
                checkInterval = window.setInterval(check,intervalTime);
            }
            return;
        }

        var lastCollectTime = PGu_getValue(nameLastCollectTime,0);
        if (PGu_getValue("KiezTourAct", 0) == 1)
            lastCollectTime = 0;

        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", true, true);

        var timeOptions = document.getElementsByName("time")[0];
        if (!timeOptions)
            refer();

        if (lastCollectTime > 0) {
            var options = timeOptions.innerHTML.split('value="');
            if (options.length < lastCollectTime + 2)
                lastCollectTime = 0;
            else {
                var minopt = Number(options[1].split('"')[0]);
                var selopt = Number(options[lastCollectTime+1].split('"')[0]);
                var nitrotime = lastCollectTime;
                if (nitroCount >= 610 && selopt*30 >= nitroCount-30)
                    for (nitrotime--; nitrotime > 0; nitrotime--) {
                        selopt = Number(options[nitrotime+1].split('"')[0]);
                        if (selopt*30 <= nitroCount-30)
                            break;
                    }
                var nextTime = PGu_getValue("NextStartkieztour", -1);
                if (nextTime == -1)
                    lastCollectTime = 0;
                else if (selopt*60 > nextTime && lastCollectTime > 0) {
                    for (var k = lastCollectTime - 1; k > 0; k--) {
                        selopt = Number(options[k+1].split('"')[0]);
                        if (selopt*60 <= nextTime)
                            break;
                    }
                    lastCollectTime = k;
                }
                if (nitrotime < lastCollectTime)
                    lastCollectTime = nitrotime;
            }
        }
        timeOptions.selectedIndex = lastCollectTime;

        timeOptions.dispatchEvent(evt);
        timeOptions.addEventListener( "change",
                          function(){  PGu_setValue(nameLastCollectTime, document.getElementsByName("time")[0].selectedIndex);
                               timeOptionsCaptcha.selectedIndex = timeOptions.selectedIndex; },
                          true );

        var timeOptionsCaptcha = timeOptions.cloneNode(true);
        timeOptionsCaptcha.selectedIndex = timeOptions.selectedIndex;
        timeOptionsCaptcha.addEventListener( "change",
                             function(){ PGu_setValue(nameLastCollectTime, document.getElementsByName("time")[0].selectedIndex);
                                 timeOptions.selectedIndex = timeOptionsCaptcha.selectedIndex;},
                             true);

/*        var captchaHolder = document.getElementById("holder");
        var infoText = captchaHolder.insertBefore(document.createElement('p'),captchaHolder.getElementsByTagName("span")[1]);
        infoText.innerHTML = strTime;
        infoText.appendChild(timeOptionsCaptcha);
        infoText.style.margin = "0px";
        infoText.style.marginTop = "8px";
        captchaHolder.getElementsByTagName("span")[1].style.marginTop = "-8px";
        captchaHolder.getElementsByTagName("span")[1].style.marginLeft = "-10px";

        var cancelButton = captchaHolder.getElementsByClassName("cancel")[0];
        cancelButton.style.margin = "0px";
        cancelButton.style.marginLeft = "10px";
        infoText.appendChild(cancelButton);*/

        var district = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[0].innerHTML.split(":").pop().trim();
        if (document.getElementsByName("bottlecollect_pending").length > 0 && (PGu_getValue("AutoCollect", false) || PGu_getValue("AutoCrime", false) && crimePic != "" && crimeFkt > 0)) {
            PG_log(flaschentxt + " ausleeren");
            var maxfill = PGu_getValue("maxfillbottle", 90);
            if (maxfill > 0 && (TOWNEXTENSION == "VT" || TOWNEXTENSION == "AT")) {
                var price = Number(document.getElementsByClassName("icon bottle")[0].innerHTML.split(">")[1].match(/\d+/));
                trace('Get ' + prothost + '/activities/', 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + '/activities/', onload:function(responseDetails) {
                    var content = responseDetails.responseText;
                    var fass = content.split("Fassungsverm")[1].match(/[\d.,]+/);
                    trace('Get ' + prothost + '/stock/bottle/', 2);
                    GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/bottle/', onload:function(responseDetails) {
                        var content = responseDetails.responseText;
                        var p = content.indexOf('id="hp_bar_blue"');
                        var p2 = content.lastIndexOf("<span", p);
                        var p3 = content.indexOf("</span", p);
                        var text = content.substring(p2, p3+10).split("</span>");
                        var bottles = Number(text[0].split("</strong>")[0].split("<strong>").pop().split(" ")[0]);
                        if (bottles > fass * maxfill / 100) {
                            var menge = Math.floor(bottles - fass * maxfill / 100);
                            getOverviewPage(mainFunc4, price, content);
                        }
                    }});
                }});
            }
            var aftDist = PGu_getValue("aftDistrict", "0" + ";" + district).split(";");
            trace("districts: " + district + "/" + aftDist, 8);
            if (PGu_getValue("chooseDistrict", true) && aftDist[1] != district)
                moveTo (aftDist[0], "", "");
            else {
                PGu_setValue("bottletime", 0);
                trace("set timeout for bottle collect", 8);
                window.setTimeout('if (document.getElementsByName("Submit2")[0].parentNode.name == "xycoords") document.getElementsByName("Submit2")[0].click(); else window.location.href=window.location.protocol + "//" + window.location.hostname + "/activities/";', 5000);
            }
            return;
        }
        var crimePic = PGu_getValue("AutoCrimePic", "");
        var crimeFkt = PGu_getValue("AutoCrimeFkt", 0);
        var crimeTO = "";
        if (PGu_getValue("AutoCrime", false) && crimePic != "" && crimeFkt > 0) {
            PG_log("Starte Verbrechen");
            var crimeNr = PGu_getValue("AutoCrimeNr", -1);
            if (crimeNr > 0) {
                crimeTO = " if (document.getElementById('SCCheckbox').checked) window.location = window.location.protocol + '//' + window.location.hostname + '/activities/crime/?start_crime=" + crimeNr + "'";
                PGu_setValue("AutoCrimeFkt", crimeFkt - 1);
            }
            else if (crimeNr == 0) {
                trace('Get ' + prothost + '/activities/crime/', 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + '/activities/crime/', onload:function(responseDetails) {
                        var content = responseDetails.responseText;
                        var buttons = content.split("plunder_crime/");
                        for (var i = 1; i < buttons.length; i++) {
                            var crimep = buttons[i].split('"')[0];
                            if (crimePic == crimep) {
                                crimeNr = buttons[i].split("start_crime(")[1].split(")")[0];
                                PGu_setValue("AutoCrimeNr", crimeNr);
                                reload("Submit1");
                                break;
                            }
                        }
                }});
            }
            else {
                PGu_setValue("AutoCrimePic", "");
                PGu_setValue("AutoCrime", false);
                setTimeout(reload, 1000, "Submit2");
            }
        }
        if (crimeTO != "")
            setTimeout("if (document.getElementById('SCCheckbox'))" + crimeTO + ";", 2000); // fails often if to fast
        else {
            if (autoSubmit && PGu_getValue("AutoCollect", false)) {
                var befDist = PGu_getValue("befDistrict", "0" + ";" + district).split(";");
                var homeDist = PGu_getValue("homeDistrict", "0" + ";" + district).split(";");
                if (PGu_getValue("chooseDistrict", true) && befDist[1] != district) {
                    PG_log("Ziehe nach " + befDist[1]);
                    moveTo (befDist[0], "", "");
                    return;
                }
                if (PGu_getValue("chooseDistrict", true) && homeDist[1] != district)
                    PGu_setValue("homeDist", homeDist[0]);
                PG_log("Starte Sammeln für " + timeOptions.options[lastCollectTime].value + " Minuten in 3 Sekunden", 1);
                setTimeout("if (document.getElementById('BCCheckbox')) if (document.getElementById('BCCheckbox').checked) document.getElementsByName('Submit2')[0].click();", 3000); // fails often if to fast
            }
        }
    }
    else {
        PG_log("setInterval");
        PGu_setValue(nameTime, time); //store time for each domain to prevent multiple run in same domain
        checkInterval = window.setInterval(check,intervalTime);
    }
}

function getTimers() {
    var c=1;
    var posci = document.getElementById("enemy_info")?0:-1;
    if (posci != -1)
        posci = document.getElementById("enemy_info").innerHTML.indexOf('enemy_counter_info');
    if (posci != -1)
        posci = document.getElementById("enemy_info").innerHTML.substr(posci+20,200).indexOf("counter");
    if (posci != -1)
        c=2;
    crime = false;
    try{
        fcounter = document.getElementById("counter"+c).innerHTML;
        counter = document.getElementById("counter"+(c+1)).innerHTML;
        crime = document.getElementById("counter"+(c+1)).parentNode.innerHTML.split("counter(")[1].split(")")[0].split('"')[1].indexOf("crime") != -1;
        if (counter.trim() == done0)        // is the time 00:00 ?
            counter = done;
    }
    catch(err){
    }
    trace("counter = " + counter + ", fcounter = " + fcounter, 9);
}

var RefreshTimer=0;
function check(){

    PG_log("check");
    var today = new Date();
    if (document.getElementById("display"))
        if (document.getElementById("display").getElementsByClassName("gamefield").length > 0)
            if (PGu_getValue("memory", "") != "")
                DoMemory(true);
    if (today.getTime() < Number(PGu_getValue("checkNewMinigame", "0")) + 15000)
        return;
    function setPetCollectDay(day, status) {
        var val = PGu_getValue("AutoPetCollectDay", "0000000");
        if (val.length < 7)
            val += "0000000".substr(val.length - 7);
        day = Number(day);
        val = val.substr(0, day) + (status?"1":"0") + val.substr(day + 1);
        PGu_setValue("AutoPetCollectDay", val);
        PGu_setValue("AutoPetCollect", val != "0000000");
        return;
    }

    if (window.location.pathname.indexOf("/pet/") != -1) {
        if (document.getElementById("submit_sets") && !document.getElementById("Checkbox1")) {
            var divs = document.getElementsByClassName("pet_tab_help");
            var newdiv = divs[divs.length-1].cloneNode(true);
            newdiv.innerHTML = "<h1>Automatisches Einlösen</h1><span>Hier kannst Du einstellen, wann Deine Gegenstände automatisch eingelöst werden sollen.</span><div>  </div>";
            var newtdMo = document.createElement("td");
            newtdMo.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdMo.innerHTML = '<input name="CheckboxMo" id="Checkbox1" type="checkbox"><span style="vertical-align: bottom">&nbsp;Montag&nbsp;</span>';
            newdiv.appendChild(newtdMo);
            var newtdDi = document.createElement("td");
            newtdDi.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdDi.innerHTML = '<input name="CheckboxDi" id="Checkbox2" type="checkbox"><span style="vertical-align: bottom">&nbsp;Dienstag&nbsp;</span>';
            newdiv.appendChild(newtdDi);
            var newtdMi = document.createElement("td");
            newtdMi.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdMi.innerHTML = '<input name="CheckboxMi" id="Checkbox3" type="checkbox"><span style="vertical-align: bottom">&nbsp;Mittwoch&nbsp;</span>';
            newdiv.appendChild(newtdMi);
            var newtdDo = document.createElement("td");
            newtdDo.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdDo.innerHTML = '<input name="CheckboxDo" id="Checkbox4" type="checkbox"><span style="vertical-align: bottom">&nbsp;Donnerstag&nbsp;</span>';
            newdiv.appendChild(newtdDo);
            var newtdFr = document.createElement("td");
            newtdFr.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdFr.innerHTML = '<input name="CheckboxFr" id="Checkbox5" type="checkbox"><span style="vertical-align: bottom">&nbsp;Freitag&nbsp;</span>';
            newdiv.appendChild(newtdFr);
            var newtdSa = document.createElement("td");
            newtdSa.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdSa.innerHTML = '<input name="CheckboxSa" id="Checkbox6" type="checkbox"><span style="vertical-align: bottom">&nbsp;Samstag&nbsp;</span>';
            newdiv.appendChild(newtdSa);
            var newtdSo = document.createElement("td");
            newtdSo.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdSo.innerHTML = '<input name="CheckboxSo" id="Checkbox0" type="checkbox"><span style="vertical-align: bottom">&nbsp;Sonntag&nbsp;</span>';
            newdiv.appendChild(newtdSo);
            var newtdvon = document.createElement("td");
            newtdvon.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdvon.innerHTML = '<span style="vertical-align: top">&nbsp;von&nbsp;</span><input name="vonZeit" id="vonZeit" type="text" style="width:15px;">';
            newdiv.appendChild(newtdvon);
            var newtdbis = document.createElement("td");
            newtdbis.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px');
            newtdbis.innerHTML = '<span style="vertical-align: top">&nbsp;bis&nbsp;</span><input name="vonZeit" id="bisZeit" type="text" style="width:15px;"><span style="vertical-align: top">&nbsp;Uhr&nbsp;</span>';
            newdiv.appendChild(newtdbis);
            divs[divs.length-1].parentNode.appendChild(newdiv);
            // Status setzen und Click-Handler hinzufügen
            var val = PGu_getValue("AutoPetCollectDay", "0000000");
            if (val.length < 7)
                val += "0000000".substr(val.length - 7);
            for (var i = 0; i < 7; i++) {
                document.getElementById("Checkbox"+i).checked = (val[i] == "1");
                document.getElementById("Checkbox"+i).addEventListener("click", function(event) {
                    setPetCollectDay(this.id.substr(-1), this.checked);
                }, false);
            }
            document.getElementById("vonZeit").value = PGu_getValue("AutoPetCollectBegH", 11);
            document.getElementById("vonZeit").addEventListener("change", function(event) {
                var val = document.getElementById(this.id).value;
                if (isNaN(val) || parseInt(val) < 0 || parseInt(val) > 23) {
                    alert("Bitte eine Zahl von 0 bis 23 eingeben");
                    document.getElementById(this.id).value = PGu_getValue("AutoCollectBegH", 11);
                    return false;
                }
                else
                    PGu_setValue("AutoPetCollectBegH", parseInt(val));
            }, true);
            document.getElementById("bisZeit").value = PGu_getValue("AutoPetCollectEndH", 12);
            document.getElementById("bisZeit").addEventListener("change", function(event) {
                var val = document.getElementById(this.id).value;
                if (isNaN(val) || parseInt(val) < 0 || parseInt(val) > 23) {
                    alert("Bitte eine Zahl von 0 bis 23 eingeben");
                    document.getElementById(this.id).value = PGu_getValue("AutoCollectEndH", 12);
                    return false;
                }
                else
                    PGu_setValue("AutoPetCollectEndH", parseInt(val));
            }, false);
        }
    }

    if (RefreshTimer == 0) {
        PG_log("set Timeout reload return 2");
        fallback(0);
        RefreshTimer = setTimeout(reload, PGu_getValue("RefreshInterval", 0) * 60000, "return 2");
    }
    else
        PG_log("RefreshTimer aktiv: " + RefreshTimer);

    if(PGu_getValue(nameTime) != time){ //script started somewhere else
        clearInterval(checkInterval);
        return 0;
    }

    getTimers();
    var promille = GetPromille(document);
    if (fcounter == done && counter == done && PGu_getValue("AutoCollect", false) || counter == done && PGu_getValue("AutoCrime", false) && PGu_getValue("AutoCrimeFkt", 0) > 0) {
        if(window.location.pathname.indexOf("/activities/") != -1 && window.location.pathname.indexOf("/crime/") == -1){
            if (document.getElementsByClassName("chest_key_on").length > 0) {
                var href = document.getElementsByClassName("chest_menu")[0].getElementsByClassName("chest_button")[0].href;
                window.location.href = href;
            }

            if (getvcounter() != 0) {
                if (RefreshTimer == 0) {
                    PG_log("set Timeout reload return 3");
                    fallback(0);
                    RefreshTimer = setTimeout(reload, PGu_getValue("RefreshInterval", 0) * 60000, "return 3");
                }
                else
                    PG_log("RefreshTimer aktiv: " + RefreshTimer);
                return;                // do nothing, if a crime is planned
            }

            clearInterval(checkInterval); // stop script
            trace("set timeout reload check1", 8);
            setTimeout(reload, 2000, "check1");
        } else {
            trace('Get ' + prothost + '/activities/', 2);
            GM_xmlhttpRequest({method:"GET", url: prothost + '/activities/', onload:function(responseDetails) {
                    var content = responseDetails.responseText;

                    var text = content.split("setupForm('/activities/bottle/'");
                    if (text.length > 1) {
                        text = text[1].split('>')[0].split(' ');
                        text = text[text.length-1];
                        if (text == "disabled") {
                            clearInterval(checkInterval); // stop script
                            checkInterval = window.setInterval(check,intervalTime*5);
                        }
                        else {
                            clearInterval(checkInterval); // stop script
                            setTimeout(refer, 1000);
                        }
                    }
                    /* deaktiviert !!
                    else if (PGu_getValue("AutoCollect", false)) {
                        var lastCollectTime = PGu_getValue(nameLastCollectTime, 0);
                        var timesplit = content.split('name="time"')[1].split("<option");
                        if (timesplit.length > lastCollectTime + 1)
                            var dauer = timesplit[lastCollectTime+1].split('value="')[1].split('"')[0];
                        else
                            var dauer = 10;
                        GM_xmlhttpRequest({method:'POST',
                                           url: prothost + '/activities/bottle/',
                                           headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                           data: encodeURI('bottlecollect_pending=True'),
                                           onload:function(responseDetails) {
                            var content = responseDetails.responseText;

                                GM_xmlhttpRequest({method:'POST',
                                                   url: prothost + '/activities/bottle/',
                                                   headers: {'Content-type': 'application/x-www-form-urlencoded'},
                                                   data: encodeURI('sammeln='+dauer),
                                                   onload:function(responseDetails) {
                                    var content = responseDetails.responseText;
                                    var text = content.split("setupForm('/activities/bottle/'");
                                    if (text.length > 1) {
                                        text = text[1].split('>')[0].split(' ');
                                        text = text[text.length-1];
                                    }
                                    if (text == "disabled") {
                                        clearInterval(checkInterval); // stop script
                                        checkInterval = window.setInterval(check,intervalTime*5);
                                    }
                                }});
                        }});
                    } */
                    else {
                        clearInterval(checkInterval); // stop script
                        trace("set timeout to refer at 10000 secs", 8);
                        setTimeout(refer, 10000);
                    }
            }});
        }
    }
    else if (crime && getSeks(counter) < 60 && promille > 0) {
        if (PGu_getValue("AutoCrimeURL", "") == "")
            PGu_setValue ("AutoCrimeURL", location.toString());
        if (!location.toString().endsWith("food/"))
            window.location.href = prothost + "/stock/foodstuffs/food/";
        else {
            var breads = 0;
            var items = document.getElementsByClassName("item_list");
            for (var i = items.length - 1; i >= 0; i--) {
                breads = Number(items[i].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerHTML.split(">")[1].split(" ")[0]);
                var effect = -Number(document.getElementsByName("promille")[i].value)/100;
                if (i > 0 && effect > promille)
                    continue;
                var id = document.getElementsByName("id")[i].value;
                if (i == 0)
                    var nrofbreads = Math.min(Math.ceil(promille/effect), breads);
                else
                    var nrofbreads = Math.min(Math.floor(promille/effect), breads);
                // **********************************************************************************
                // *** GM_XMLHTTPREQUEST *** POSTEN der Essensnutzung
                // **********************************************************************************
                trace("Post essen: " + id + "/" + nrofbreads, 2);
                GM_xmlhttpRequest({method: 'POST',
                    url: prothost + '/stock/foodstuffs/use/',
                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    data: encodeURI('item=&promille=&id='+id+'&menge=' + nrofbreads),
                    onload: function(responseDetails) {
                        window.location.href = PGu_getValue("AutoCrimeURL", "");
                        PGu_setValue ("AutoCrimeURL", "");
                    }
                });
                break;
            }
        }
    }
    else if (PGu_getValue("RefreshInterval", 0) > 0) {
        if (RefreshTimer == 0) {
            PG_log("set Timeout reload check2");
            fallback(0);
            RefreshTimer = setTimeout(reload, PGu_getValue("RefreshInterval", 0) * 60000, "check2: reload nach " + PGu_getValue("RefreshInterval", 0) + " Minuten");
        }
        else
            PG_log("RefreshTimer aktiv: " + RefreshTimer);
    }
}

var msgDone1 = "Das " + pflaschen + "sammeln wurde beendet.";    // "Collecting done";
var msgDone2 = "Klicke auf OK um die Aktionsseite zu " + unescape("%F6") + "ffnen.";    // "Click ok to open actions-page";
function refer(){
    var box = PGu_getValue("AutoCollect", false) || PGu_getValue("AutoCrime", false) && PGu_getValue("AutoCrimeFkt", 0) > 0;
    if (box) {          // check input field in Mails and SB
        var f_text = document.getElementById("f_text");
        if (f_text)
            box = f_text.value == "";
    }

    if (!box && PGu_getValue("AskedForCollect", 0) < 3 && !PGu_getValue("AutoCollectKW", false)) {
        box = window.confirm( msgDone1 + "\n" + msgDone2 );
        PGu_setValue("AskedForCollect", PGu_getValue("AskedForCollect", 0) + 1);
    }
    if (box) {
        PGu_setValue("AutoCollURL", location.toString());
        window.location.href = prothost + "/activities/";
    }
}

function reload(msg, url){
    trace("Reload-Message: " + msg + "/" + window.location.toString() + (typeof(url) == "string" ? "/url: " + url : ""), 8);
    if ((oldVersion || !autoSubmit) && !PGu_getValue("AutoCollectKW", false))
        alert(msgDone1);
    if (window.location.toString().indexOf("event") != -1 || window.location.toString().indexOf("livegame") != -1)
        window.location.href = window.location.toString();
    else if (typeof(url) == "string")
        window.location.href = prothost + url;
    else
        window.location.href = prothost + "/activities/";
}

function enemyreload(){
    var box = true;
                        // check input field in Mails and SB
    var f_text = document.getElementById("f_text");
    if (f_text)
        box = f_text.value == "";

    if (!box) {
        box = window.confirm( msgAttackEnemy );
    }
    if (box) {
        window.location.href = location.toString();
    }
}

function Enemyattack(){
    GM_xmlhttpRequest({
           method:"POST",
           url: prothost + '/enemies/start_fight/',
           headers: {'Content-type': 'application/x-www-form-urlencoded'},
           data: encodeURI(''),
           onload:function(responseDetails) {
               enemyreload();
           }
           });
}

function DoPetCollect() {
    trace('Get ' + prothost + '/pet/tab/collections/', 2);
    GM_xmlhttpRequest({method:"GET", url: prothost + '/pet/tab/collections/', onload:function(responseDetails) {
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
                if (rew.startsWith("special_")) {
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
                trace('Get ' + prothost + '/pet/get_collection_reward/'+rew+"/", 2);
                GM_xmlhttpRequest({
                    method: 'GET', url: prothost + '/pet/get_collection_reward/'+rew+"/"+minanz+"/"+special,
                    onload: function(responseDetails) {
                    }
                });

                window.setTimeout("window.location.href = '" + location.toString() + "'", 2000);
                return;
            }
    }});
    return;
}

function trace(txt, level) {
    if (m_ownuserid == 0)
        return;
    if (typeof(level) == "undefined")
        level = 9;
    if (level > tracelevel || tracing)
        return;
    tracing = 1;
    var datetime = new Date();
    datetime = FormatDateTime(datetime) + "." + (datetime.getTime().toString()).substr(-3);
    PGu_setValue("call" + traceln, datetime + ": " + txt);
    if (traceln < maxtraceln)
        traceln++;
    else
        traceln = 1;
    PGu_setValue("callnr", traceln);
    if (level == 1) {
        PGu_setValue("hlcall" + hltraceln, datetime + ": " + txt);
        if (hltraceln < maxhltraceln)
            hltraceln++;
        else
            hltraceln = 1;
        PGu_setValue("hlcallnr", hltraceln);
    }
    tracing = 0;
    return;
}

function DoPetStartCheck(content, pos, leap, swtch)
{
    PG_log("DoPetStartCheck(pos="+pos+",leap="+leap+",swtch="+swtch+")");
    var today = new Date();

    if (pos == 0) {
        var petlock = "";
        var petid = "";
        var lockflg = false;
        var nightflg = false;
        var minaus = 1000;
        var pos = content.indexOf('id="pet_kader');
        for (var loop = 0; loop <= 2; loop++) {
            pos = content.indexOf('div id="pet', pos+10);
            if (pos == -1)
                break;
            var pos3 = content.indexOf('class="pethpbar', pos);
            if (pos3 == -1)
                continue;
            if (content.substring(pos, pos3).indexOf("pet_featured") != -1)
                continue;
            var pos4 = content.indexOf('<h1>Ausdauer', pos3);
            if (pos4 == -1)
                continue;
            var pethps = content.substr(pos3).split("</div")[0].split(">").pop().trim().split("/");
            var ausd = content.substr(pos4, 500).split("</div>");
            var petads = Number(ausd[3].trim());
            var petids = content.substr(pos+8).split('"')[0];
            if (PGu_getValue(petids+"Chb", false)) {
                if (!lockflg && pethps[0] != pethps[1]) {
                    lockflg = true;
                    minaus = 1000;
                }
                else if (!lockflg || lockflg && pethps[0] == pethps[1] && minaus > petads) {
                    minaus = petads;
                    petid  = petids;
                    lockflg = true;
                }
            }
            else if (!lockflg && pethps[0] == pethps[1]) {
                var night = false;
                if (PGu_getValue("speztierend", "") == FormatDateDMY(today)) {
                    var pos5 = content.indexOf('class="daytime_advantage', pos);
                    if (pos5 != -1) {
                        var pos6 = content.indexOf("</div", pos5);
                        if (pos6 != -1)
                           night = (content.substring(pos5, pos6).indexOf("NIGHT_") != -1);
                        if (night)
                            trace("Nachtaktives Tier erkannt: " + petids, 2);
                    }
                }
                if (night)
                    if (!nightflg) {
                        minaus = petads;
                        petid  = petids;
                        nightflg = true;
                    }
                    else {
                        if (minaus > petads) {
                            minaus = petads;
                            petid  = petids;
                        }
                    }
                else if (minaus > petads) {
                    minaus = petads;
                    petid  = petids;
                }
            }
        }

        if (swtch) {
            if (PGu_getValue("speztierendchk", "") != FormatDateDMY(today) ||
                PGu_getValue("speztierend", "") == FormatDateDMY(today)) {
                var href = content.split('id="plundertab"')[1].split('href="')[6].split('"')[0];
                trace('Get ' + prothost + href, 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + href, onload:function(responseDetails) {
                    var cont2 = responseDetails.responseText;
                    if (PGu_getValue("speztierendchk", "") != FormatDateDMY(today)) {
                        var pos = cont2.indexOf("Das aktuelle Spezialtier wechselt am ");
                        if (pos != -1) {
                            var wdate = cont2.substr(pos).split(".</i>")[0].split(" ").pop();
                            PGu_setValue("speztierend", wdate);
                            PGu_setValue("speztierendchk", FormatDateDMY(today));
                            trace("Spezialtier wechselt am " + wdate, 2);
                        }
                    }
                    var costpos = cont2.lastIndexOf("petbusybar");
                    var petcost = -1;
                    if (costpos != -1) {
                        var pos = cont2.indexOf('value="', costpos);
                        if (pos != -1)
                            petcost = cont2.substr(pos).split('"')[1];
                        if (petcost.indexOf("Leinen") != -1) {
                            petcost = Number(petcost.match(/\d+/)[0]);
                            trace("Spezialtier kostet " + petcost + " Leinen.", 4);
                        }
                        else
                            petcost = -1;
                        PGu_setValue("speztiercost", petcost);
                    }
                }});
            }

            trace((petid==""?"Kein Tier":petid) + " kann getauscht werden.", 2);
            if (petid != "") {
                var href = content.split('id="plundertab"')[1].split('href="')[2].split('"')[0];
                trace('Get ' + prothost + href, 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + href, onload:function(responseDetails) {
                    var cont2 = responseDetails.responseText;
                    var slotcost = -1;
                    var pos = cont2.indexOf("slot_disabled");
                    if (pos != -1)
                        pos = cont2.indexOf("</div", pos);
                    if (pos != -1 && cont2.substr(pos-1, 1) != "+")
                        slotcost = 0;
                    else if (pos != -1) {
                        var unlockpos = cont2.indexOf("unlockslot_submit", pos);
                        if (unlockpos != -1) {
                            pos = cont2.indexOf('value="', unlockpos);
                            if (pos != -1)
                                slotcost = Number(cont2.substr(pos).split('"')[1].match(/\d+/)[0]);
                        }
                    }
                    trace("Nächster Stallplatz kostet " + slotcost + " Leinen.", 4);
                    PGu_setValue("slotcost", slotcost);
                    var pfpos = cont2.indexOf('pet_featured');
                    if (pfpos != -1) {
                        var pos2 = cont2.lastIndexOf('id="pet', pfpos);
                        var petid2 = cont2.substr(pos2+4).split('"')[0];
                        var petname = cont2.substr(pos2).split('class="petnametooltip"')[0].split(">").pop().split("<")[0].trim();
                        if (PGu_getValue("speztier", "") != petname) {
                            trace("Spezialtier gewechselt auf " + petname, 1);
                            PGu_setValue(petid2+"Chb", false);
                            PGu_delete("speztierendchk");
                            PGu_setValue("speztier", petname);
                        }
                        if(!window.location.pathname.endsWith("/pet/")){
                            window.location.href = prothost + '/pet/';
                            return;
                        }
                        if (document.getElementById("plundertab").getElementsByTagName("a")[1].className != "selected") {
                            document.getElementById("plundertab").getElementsByTagName("a")[1].click();
                            window.setTimeout(DoPetStartCheck, 1000, content, 0, false, true);
                            return;
                        }
                        var pswitch = document.getElementById("petswitchmenu_" + petid2.substr(3));
                        if (!pswitch) {
                            window.setTimeout(DoPetStartCheck, 1000, content, 0, false, swtch);
                            return;
                        }
                        var td = pswitch.getElementsByTagName("a");
                        for (var i = 0; i < td.length; i++) {
                            if (td[i].href.indexOf("("+petid.substr(3)+","+petid2.substr(3)+")") == -1)
                                continue;
                            PGu_setValue(petid2+"Chb", false);
                            trace(petid + " --> Stall, " + petid2 + " --> Kader", 1);
                            td[i].click();
                            return;
                        }
                    }
                    else {
                        var lis = content.split('id="plundertab"')[1].split('<li');
                        for (var i = 8; i < lis.length; i++)
                            if (lis[i].indexOf("leine.png") != -1) {
                                var lines = Number(lis[i].split("<img")[1].split(">").pop().trim());
                                var petcost = PGu_getValue("speztiercost", -1);
                                var slotcost = PGu_getValue("slotcost", -1);
                                if (petcost > 0 && slotcost >= 0 && petcost + slotcost <= lines) {
                                    trace("Spezialtier kann gekauft werden: " + petcost + "/" + slotcost + "/" + lines, 4);
                                    if(!window.location.pathname.endsWith("/pet/")){
                                        window.location.href = prothost + '/pet/';
                                        return;
                                    }
                                    if (slotcost > 0) {
                                        if (document.getElementById("plundertab").getElementsByTagName("a")[1].className != "selected") {
                                            document.getElementById("plundertab").getElementsByTagName("a")[1].click();
                                            window.setTimeout(DoPetStartCheck, 1000, content, 0, false, true);
                                            return;
                                        }
                                        trace("Stallplatz wird gekauft.", 1);
                                        document.getElementById("unlockslot_submit").click();
                                        return;
                                    }
                                    if (document.getElementById("plundertab").getElementsByTagName("a")[5].className != "selected") {
                                        document.getElementById("plundertab").getElementsByTagName("a")[5].click();
                                        window.setTimeout(DoPetStartCheck, 1000, content, 0, false, true);
                                        return;
                                    }
                                    trace("Spezialtier wird gekauft.", 1);
                                    document.getElementById("tabcontainer").getElementsByClassName("petbutton")[0].click();
                                    return;
                                break;
                                }
                            }
                    }
                    DoPetStartCheck(content, 0, false, false);
                    return;
                }});
                return;
            }
        }

        pos = content.indexOf('class="plunder_boost"');
        if (pos != -1) {
            pos = content.lastIndexOf('class="petname', pos);
            pos = content.lastIndexOf('id="pet', pos);
            if (DoPetStartCheck(content, pos, true, swtch))
                return;
        }

        pos = content.indexOf('pet_featured');
        if (pos == -1 || PGu_getValue("speztierend", "") == FormatDateDMY(today))
            petlock = petid;
        trace((petlock == ""?"Kein Tier":petlock) + " ist gesperrt.", 2);

        while (pos != -1) {
            var pos2 = content.lastIndexOf('div id="pet', pos);
            var pos3 = content.indexOf('div id="pet', pos);
            if (pos3 == -1)
                pos3 = content.length;
            var contpet = content.substring(pos2, pos3);
            pos3 = contpet.indexOf('class="petname');
            var petname = contpet.substr(pos3).split('class="petnametooltip"')[0].split(">").pop().split("<")[0].trim();
            if (PGu_getValue("speztier", "") != petname) {
                //alert(">"+PGu_getValue("speztier", "")+"</>" + petname + "<");
                trace("Spezialtier gewechselt auf " + petname, 1);
                pos2 = contpet.indexOf('"', 8);
                var petid = contpet.substring(8, pos2);
                PGu_setValue(petid+"Chb", false);
                PGu_delete("speztierendchk");
                PGu_delete("speztierend");
                PGu_setValue("speztier", petname);
            }
            pos2 = contpet.indexOf("daytime_advantage", pos3);
            if (pos2 != -1) {
                var adv = contpet.substr(pos2).split("</div")[0];
                var pos3 = adv.indexOf("NIGHT_");
                if (pos3 == -1)
                    pos3 = adv.indexOf("DAY_");
                if (pos3 != -1)
                    pos3 = adv.indexOf("_", pos3) + 1;
                var petstart = (pos3 == -1 || pos3 != -1 && adv.substr(pos3,4) == "True" || today.getHours() > 17);
                if (!petstart && petname == PGu_getValue("speztier", "") && PGu_getValue("speztierend", "") == FormatDateDMY(today)) {
                    pos3 = contpet.indexOf('class="pethpbar');
                    var hp0 = 0;
                    if (pos3 != -1) {
                        var hp = contpet.substr(pos3).split("</div")[0].split(">").pop().split("/");
                        hp0 = Number(hp[0]);
                    }
                    if (hp0 > 10) {
                        trace("Start Spezialtier wegen Spezialtierwechsel", 1);
                        petstart = true;
                    }
                }
                if (petstart)
                    if (DoPetStartCheck(content, pos, true, swtch))
                        return;
            }
            pos = content.indexOf('pet_featured', pos+1);
        }

        var contupper = content.split('class="clearpet"')[0];
        var dayfalse = 0;
        var maxhp = 0;
        for (loop = 0; loop <= 5; loop++) {
            if (loop == 3) {
                pos = contupper.indexOf('pet_featured');
                while (pos != -1) {
                    pos = contupper.indexOf('class="petname', pos+1);
                    if (pos == -1)
                        break;
                    var pos2 = contupper.indexOf("daytime_advantage", pos);
                    if (pos2 != -1) {
                        var adv = contupper.substr(pos2).split("</div")[0];
                        var pos3 = adv.indexOf("NIGHT_");
                        if (pos3 == -1)
                            pos3 = adv.indexOf("DAY_");
                        if (pos3 != -1)
                            pos3 = adv.indexOf("_", pos3) + 1;
                        if (pos3 == -1 || pos3 != -1 && adv.substr(pos3,4) == "True" || today.getHours() > 17)
                            if (DoPetStartCheck(contupper, pos, false, swtch))
                                return;
                    }
                    pos = contupper.indexOf('pet_featured', pos + 1);
                }
            }
            if (loop%3 == 2)
                if (today.getHours() >= 5 && today.getHours() <= 17 || dayfalse == 0)
                    continue;
                else
                    pos = dayfalse;
            else
                pos = contupper.indexOf('id="pet_kader');

            while (true) {
                var pos2 = contupper.indexOf('div id="pet', pos);
                if (pos2 == -1)
                    break;
                var petid = contupper.substr(pos2+8).split('"')[0];

                pos = pos2 + 20;
                if (PGu_getValue(petid+"Chb", false) || petid == petlock)
                    continue;

                pos2 = contupper.indexOf("daytime_advantage", pos);
                if (pos2 != -1) {
                    var pos3 = content.indexOf('class="pethpbar', pos);
                    if (pos3 == -1)
                        return false;
                    var hp = content.substr(pos3).split("</div")[0].split(">").pop().split("/");
                    var adv = contupper.substr(pos2).split("</div")[0];
                    if (dayfalse === 0 && adv.indexOf("DAY_False") != -1) {
                        dayfalse = pos - 20;
                        continue;
                    }
                    var pos3 = adv.indexOf("NIGHT_");
                    if (pos3 == -1)
                        pos3 = adv.indexOf("DAY_");
                    if (pos3 != -1)
                        pos3 = adv.indexOf("_", pos3) + 1;
                    if (loop == 0 && pos3 != -1 && adv.substr(pos3,4) == "True" || loop == 1 && pos3 == -1 || loop%3 == 2)
                        maxhp = Math.max(maxhp, Number(hp[0]));
                    else if (loop >= 3 && Number(hp[0]) != maxhp)
                        continue;
                    if (loop%3 == 0 && pos3 != -1 && adv.substr(pos3,4) == "True" || loop%3 == 1 && pos3 == -1 || loop%3 == 2)
                        if (DoPetStartCheck(content, pos, (loop >= 3), swtch))
                            return;
                }
            }
        }
        return;
    }

    var pos3 = content.lastIndexOf('div id="pet', pos);
    if (pos3 == -1)
        return false;
    var petid = content.substr(pos3).split('id="')[1].split('"')[0];

    var pos2 = content.indexOf('class="pethpbar', pos3);
    if (pos2 == -1)
        return false;

    var contpet = content.substring(pos3, pos2);
    if (PGu_getValue(petid+"Chb", false))
        if (contpet.indexOf("pet_featured") == -1)
            return false;

    var hp = content.substr(pos2).split("</div")[0].split(">").pop().split("/");
    var seks = 0;
    var xpboost = 0;

    pos2 = contpet.split('class="petimg')[0].indexOf('class="plunder_boost');
    if (pos2 != -1) {
        pos3 = contpet.indexOf(' % Erfahrung', pos2);
        if (pos3 != -1) {
            xpboost = Number(contpet.substring(pos2, pos3).match(/\d+/g).pop());
            pos3 = contpet.indexOf('counter(', pos2);
            var strseks = contpet.substr(pos3).match(/\d+/)[0];
            if (!isNaN(strseks)) {
                seks = Number(strseks);
                if (seks < 603)
                    seks = 0;
            }
        }
    }

    var xpadd = 0;
    pos2 = contpet.indexOf('class="plunder_equipped"');
    if (pos2 != -1) {
        pos3 = contpet.indexOf('class="padv"', pos2);
        if (pos3 != -1) {
            pos2 = pos3;
            pos3 = contpet.indexOf('</ul>', pos2);
            pos3 = contpet.substring(pos2, pos3).indexOf(' Erfahrung');
            if (pos3 != -1)
                xpadd = Number(contpet.substr(pos2, pos3).match(/\d+/g).pop());
        }
    }
    pos2 = contpet.indexOf('class="petxpbar"');
    if (pos2 == -1)
        return false;
    var hp0 = Number(hp[0]);
    if (xpboost > 0)
        if (seks == 0)
            xpboost = 0;
        else if (seks < hp0 * 30)
            hp0 = Math.floor(seks / 30);

    if (hp0 <= 10)
        return false;

    var maxTime = 10;
    pos3 = contpet.indexOf('Max. Level', pos2);
    if (pos3 == -1) {
        pos3 = contpet.indexOf(' Erfahrung', pos2);
        if (pos3 == -1)
            return false;
        var xp = contpet.substring(pos2, pos3).match(/\d+/g);

        pos3 = contpet.lastIndexOf('Level', pos2);
        if (pos3 == -1)
            return false;

        var lvl = Number(contpet.substring(pos3, pos2).match(/\d+/g).pop());
        var pts10 = Math.floor((lvl + 4) * 30 * ((xpboost + xpadd) / 100 + 1.2) + 0.5);
        if (hp0 < 70)
           maxTime = 10;
        else {
            maxTime = Math.floor((hp0 - 10) / 60) * 30;
            if (maxTime == 150)
                 maxTime = 120;
        }
        var ptsNL = (lvl >= 49 ? 0 : (lvl + 1) * (300 + (lvl + 1) * 20));
        var ptsMaxT = Math.floor((lvl + 4) * 3 * maxTime * ((xpboost + xpadd) / 100 + 1.2) + 0.5) - (Number(xp[1]) - Number(xp[0]));
        //alert(hp+"/"+ptsNL+"/"+maxTime+"/"+xp);

        //var ptshp = Math.floor((lvl + 4) * 3 * Number(hp[0]) / 2 * ((1.1 + xpadd) / 100 + 1.2) + 0.5);
        //if (Number(xp[0]) + pts10 >= Number(xp[1]) || Number(xp[0]) + ptshp >= Number(xp[1]) && xpboost == 0)
        if (Number(xp[0]) + pts10 < Number(xp[1]))
            maxTime = 10;
        else if (!leap && contpet.indexOf("pet_featured") == -1)
            if (ptsMaxT < ptsNL / 2 && xpboost == 0)
                return false;
    }

    var id = Number(content.substr(pos).split('class="petspec')[1].split('id="')[1].split('"')[0]);

    if(!window.location.pathname.endsWith("/pet/")){
        window.location.href = prothost + '/pet/';
        return true;
    }

    if (document.getElementById("plundertab").getElementsByTagName("a")[0].className != "selected") {
        document.getElementById("plundertab").getElementsByTagName("a")[0].click();
        window.setTimeout('window.location.href = ' + prothost + '/pet/";', 3000);
        return true;
    }

    pos2 = content.indexOf('id="start_form"', pos);
    if (pos2 == -1) {
        window.setTimeout(DoPetStartCheck, 1000, content, pos, false, swtch);
        return true;
    }

    pos = pos2 - 20;
    pos2 = content.indexOf("</form", pos);
    if (pos2 == -1)
        return false;
    var form = content.substring(pos, pos2);

    var pethp = Number(form.split('id="s_' + petid)[1].split("choose_pet(")[1].split(")")[0].split(",").pop().trim());
    if (pethp <= maxTime)
        return false;

    var areas = form.split('id="area_id"')[1].split("</select")[0].split('option value="');
    var g = nb = 0;
    var good = [3, 1, 2];
    var often = [0];
    for (var k = 2; k < areas.length; k++) {
        var areadata = areas[k].split('"')[0].split(",");
        if (areadata[2] == good[id-1])
            g = areadata[0];
        else if (areadata[2] == id)
            nb = areadata[0];
        often[areadata[0]] = areadata[2];
    }
    if (g == 0)
        g = nb;
    if (g == 0 && xpboost > 0)
        g = 3;
    if (g > 0) {
        unsafeWindow.selectMap(g);
        unsafeWindow.change_path(maxTime);
        document.getElementsByName("route_length")[0].value = maxTime;
        document.getElementById("s_"+petid).click();
        savePetStart();
        HttpPost(document.getElementById("content").innerHTML, "start_form", [], function() {
            reload ("PetStart", "/pet/");
            return;
        });
        return true;
    }

    return false;
}

function Leckerli(params, petid, leckerli, petname) {
    params[1] = params[1].trim();
    params.push(params.shift().split("'")[1]);
    params.push(petid.substr(3));
    trace("Leckerli " + leckerli + " für Haustier " + petname + (params[1] == 'equip'?" angelegt":" benutzt"), 1);
    GM_xmlhttpRequest({method:"GET", url: prothost + '/pet/plunder/' + params.join("/") + '/', onload:function(responseDetails) {
        reload ("Leckerli", "/pet/");
    }});
};

function DoPetFinishCheck(content, swtch)
{
    PG_log("DoPetFinishCheck(swtch="+swtch+")");
    var pos2 = content.indexOf('id="pet_roam_time"');
    if (pos2 != -1) {
        var count = content.substr(pos2).split("</script")[0].split('counter(');
        if (count.length > 1) {
            count = Number(count[1].split(",")[0]);
            if (count < 2)
                count = 2;
            trace("Timeout is " + count + " seconds", 8);
            window.setTimeout(reload, count*1000, "DoPetFinishCheck1", "/pet/");
            return;
        }

        if (content.substr(pos2+19, 6) == "Fertig") {
            var pos = content.lastIndexOf('div id="pet', pos2);
            var pos4 = content.indexOf('class="ov_container"', pos);
            if (pos4 < 0) {
                reload("DoPetFinishCheck", "/pet/");
                return;
            }
            var pos3 = content.substring(pos, pos2).indexOf('class="plunder_equipped"');
            var leckerlist = ['diamant', 'gold', 'silber', 'bronze'];
            var fnplunder = "";
            if (pos3 != -1) {
                pos3 += pos;
                var fnpos = content.substr(pos3).split('class="petimg"')[0].indexOf("fressnapf_");
                fnplunder = content.substr(pos3+fnpos+10).split(".")[0];
                pos3 = leckerlist.indexOf(fnplunder);
            }
            if (swtch) {
                var href = content.split('id="plundertab"')[1].split('href="')[4].split('"')[0];
                trace('Get ' + prothost + href, 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + href, onload:function(responseDetails) {
                    var cont2 = responseDetails.responseText;
                    for (var fnpos = 0; fnpos < leckerlist.length; fnpos++)
                        if (cont2.indexOf("fressnapf_"+leckerlist[fnpos]) != -1)
                            break;
                    if (fnpos < leckerlist.length && (pos3 == -1 || fnpos < pos3)) {
                        var petid = content.substr(pos).split('id="')[1].split('"')[0];
                        var petname = content.substr(pos).split('class="petnametooltip"')[0].split(">").pop().split("<")[0].trim();
                        var params = cont2.substr(cont2.indexOf("fressnapf_"+leckerlist[fnpos])).split("showTargetSelector(")[1].split(')')[0].split(", ");
                        Leckerli(params, petid, "fressnapf_"+leckerlist[fnpos], petname);
                        return;
                    }
                    DoPetFinishCheck(content, false);
                }});
                return;
            }
            var pos5 = content.indexOf("Dein Tier hat au", pos4);
            if (pos5 < 0)
                if (expertMode)
                    alert(content.substr(pos4));
                else
                    return;
            var beute = Number(content.substr(pos5).match(/[\d,.]+/)[0].replace(/[.,]/g, "")) / 100;
            trace("Haustier Beute: " + beute, 1);
            if (content.substr(pos, pos2-pos).indexOf('class="plunder_boost"') != -1 ||
                content.substr(pos, pos2-pos).indexOf('Max. Level') != -1) {
                trace('Get ' + prothost + '/pet/get_roam_award/', 2);
                GM_xmlhttpRequest({method:"GET", url: prothost + '/pet/get_roam_reward/', onload:function(responseDetails) {
                    reload("pet_reward", "/pet/");
                }});
            }
            else {
                if (GetMoney(document) + beute > maxFass) {
                    trace("Beute passt nicht in Behälter", 1);
                    return;
                }
                pos2 = content.substr(pos).indexOf('class="pethpbar');
                if (pos2 != -1) {
                    var hp = content.substr(pos+pos2).split("</div")[0].split(">").pop().split("/");
                    var hp0 = Number(hp[0]);
                    var maxTime = 10;
                    if (hp0 >= 70) {
                        maxTime = Math.floor((hp0 - 10) / 60) * 30;
                        if (maxTime == 150)
                             maxTime = 120;
                    }
                    pos2 = content.substr(pos).indexOf('class="petxpbar"');
                    if (pos2 != -1) {
                        var pos3 = content.substr(pos+pos2).indexOf(' Erfahrung');
                        if (pos3 != -1) {
                            var xp = content.substr(pos+pos2, pos3).match(/\d+/g);
                            pos3 = content.lastIndexOf('Level', pos+pos2);
                            if (pos3 != -1) {
                                var lvl = Number(content.substr(pos3, pos+pos2-pos3).match(/\d+/g).pop());
                                var pts = Math.floor((lvl + 4) * 3 * 1.2 * maxTime + 0.5);
                                trace('Get ' + prothost + '/pet/tab/action/', 2);
                                GM_xmlhttpRequest({method:"GET", url: prothost + '/pet/tab/action/', onload:function(responseDetails) {
                                    var actcont = responseDetails.responseText;
                                    var hs = actcont.indexOf('class="hs_shell"');
                                    var trs = actcont.substr(hs).split("<tr");
                                    var xp1 = Number(trs[2].split("<td>")[1].split("<")[0].split(" ").pop());
                                    if (trs[4].split("<td>").length > 1)
                                        var xp2 = Number(trs[4].split("<td>")[1].split("<")[0].split(" ").pop());
                                    else
                                        var xp2 = 0;
                                    for (var k = 5; k < trs.length; k++)
                                        if (trs[k].indexOf("roam_value_xp") != -1)
                                            var xpg = Number(trs[k].split('roam_value_xp')[1].split("</td")[0].split(" ").pop());
                                        else if (trs[k].indexOf("(Basis)") != -1) {
                                            var ti = Number(trs[k].split("</td")[0].split(" ").pop());
                                            break;
                                        }
                                    var ptsNL = (lvl + 1) * (300 + (lvl + 1) * 20);
                                    var ptsMaxT = Math.floor((lvl + 4) * 3 * maxTime * 1.2 + 0.5);
                                    var pts2 = xpg - (Number(xp[1]) - Number(xp[0]));
                                    var timNL = Math.ceil((ptsNL - pts2) / ((lvl + 4 ) * 3 * 1.2) / 10) * 10;
                                    trace("Zeit für nächstes Level: " + timNL + " Minuten", 2);
                                    var pospf = content.indexOf("pet_featured");
                                    if (pospf != -1) {
                                        var poshp = content.substr(pospf).indexOf('class="pethpbar');
                                        if (poshp != -1) {
                                            var hp2 = content.substr(pospf+poshp).split("</div")[0].split(">").pop().split("/");
                                            if (Number(hp2[0]) > 10 && ti < 60)
                                                PGu_setValue("noleckerli", 1);
                                        }
                                    }
                                    var petid = content.substr(pos).split('id="')[1].split('"')[0];
                                    if (PGu_getValue("noleckerli", 0) == 0 && (ti >= 60 && lvl >= 30 || timNL >= Math.floor(Number(hp[1]) / 2 / 10) * 10) && lvl < 50 && !PGu_getValue(petid+"Chb", false)) {
                                        trace('Get ' + prothost + '/pet/tab/items/', 2);
                                        GM_xmlhttpRequest({method:"GET", url: prothost + '/pet/tab/items/', onload:function(responseDetails) {
                                            var itemtable = responseDetails.responseText.split("<table")[1].split("</table")[0].split("<tr");
                                            var maxxpboost = 0;
                                            for (var k = 1; k < itemtable.length; k++) {
                                                var xppos = itemtable[k].indexOf("% Erfahrung");
                                                if (xppos == -1)
                                                    continue;
                                                var xpplus = Number(itemtable[k].substr(0, xppos).split(" ").pop());
                                                if (xpplus > maxxpboost && xp1 * xpplus / 100 + pts2 < ptsNL) {
                                                    var kmerk = k;
                                                    var xpposmax = xppos;
                                                    maxxpboost = xpplus;
                                                }
                                            }
                                            /*if (maxxpboost == 0 || Number(xp[0]) + xpg + xp1 * maxxpboost/100 < Number(xp[1]) && Number(xp[0]) + xpg + xp1 * 1.1 >= Number(xp[1]) ||  Number(xp[0]) + xpg + xp1 * maxxpboost/100 + Math.floor((lvl + 4) * 3 * maxTime * (1.2 + maxxpboost/100) + 0.5) < Number(xp[1])) {
                                                trace("noleckerli: " + maxxpboost + "/" + xp + "/" + xp1 + "/" + xpg + "/" + lvl + "/" + maxTime, 8);
                                                PGu_setValue("noleckerli", 1);
                                                reload ("NoLeckerli", "/pet/");
                                                return;
                                            }*/
                                            var leckerli = itemtable[kmerk].split("</strong")[0].split('">').pop();
                                            var params = itemtable[kmerk].substr(xpposmax).split("showTargetSelector(")[1].split(")")[0].split(",");
                                            var petname = content.substr(pos).split('class="petnametooltip"')[0].split(">").pop().split("<")[0].trim();
                                            PGu_setValue("noleckerli", 1);
                                            window.setTimeout(Leckerli, (PGu_getValue("PetStart", "") == ""?5000:500), params, petid, leckerli, petname);
                                        }});
                                        return;
                                    }
                                    if (ti == 10 || lvl == 50 || pts2 + ptsMaxT > ptsNL / 2 || Number(xp[0]) + xpg + pts >= Number(xp[1]))
                                        if (Number(xp[0]) + xpg + xp1 * 1.1 < Number(xp[1]) || lvl == 50 || Number(xp[0]) + xpg >= Number(xp[1]) || Number(hp[0]) >= 30)
                                            trace("Haustier XP: " + xpg, 2);
                                            trace('Get ' + prothost + '/pet/get_roam_award/', 2);
                                            GM_xmlhttpRequest({method:"GET", url: prothost + '/pet/get_roam_reward/', onload:function(responseDetails) {
                                                reload("pet_reward2", "/pet/");
                                            }});
                                }});
                            }
                        }
                    }
                }
            }
        return;
        }
    }

    DoPetStartCheck(content, 0, false, true);
}

function savePetStart() {
    var petid = document.getElementById("pet_id").value;
    var petname = document.getElementById("pet"+petid).getElementsByClassName("petname")[0].innerHTML.split('class="petnametool')[0].split(">").pop().split("<")[0].trim();
    var kader = document.getElementById("pet_kader").getElementsByClassName("petshell");
    for (var i = 0; i < kader.length; )
        if (kader[i++].id == "pet"+petid)
            break;
    var dd = document.getElementById('area_id');
    var area = dd.value.split(",");
    var areaname = dd.options[dd.selectedIndex].innerHTML;
    var dauer = document.getElementsByName("route_length")[0].value;
    var now = new Date();
    PGu_setValue("PetStart", String(now.getTime()) + ";" + dauer + ";" + areaname + ";" + area[1].toLowerCase());
    PGu_setValue("noleckerli", 0);
    trace("Start " + petname + " (" + i + ") in Gebiet " + areaname + " für " + dauer + " Minuten gegen " + area[1].toLowerCase() + "e Tiere", 1);
}

var lsnrset = 0;
function setEventListener() {
    if (lsnrset == 2)
        return;

    if (lsnrset == 0) {
        document.getElementById("plundertab").getElementsByTagName("a")[0].addEventListener('click', function(event) {
            lsnrset = 1;
            window.setTimeout(setEventListener, 500);
        }, false);
        if (PGu_getValue("AutoPet", false))
            document.getElementById("plundertab").getElementsByTagName("a")[1].addEventListener('click', function(event) {
                lsnrset = 1;
                window.setTimeout(showPetBox, 500);
            }, false);
    }

    if (document.getElementById("plundertab").getElementsByTagName("a")[0].className == "selected") {
        if (!document.getElementById("petstartloader")) {
            window.setTimeout(setEventListener, 500);
            return;
        }

        var ti = document.getElementById("pet_roam_time");
        var to = 500;
        if (ti) {
            var count = ti.innerHTML.split("</span")[0].split('>').pop();
            if (ti.innerHTML.indexOf("Fertig") != -1)
                count = done0;
            count = count.split(":");
            if (count.length > 1) {
                count = Number(count[0]) * 60 + Number(count[1]);
                to = count * 1000;
            }
            else
                to = 500;
        }
        var psl = document.getElementById("petstartloader").getElementsByClassName("r_cornered_strong");
        if (psl.length > 0 && psl[0].innerHTML.indexOf("gestartet am") == -1) {
            var data = PGu_getValue("PetStart", "").split(";");
            if (data.length == 4) {
                var ti = document.getElementById("pet_roam_time");
                if (ti && ti.innerHTML.indexOf("Fertig") == -1) {
                    var count = ti.innerHTML.split("</span")[0].split('>').pop().split(":");
                    if (count.length > 1) {
                        count = Number(count[0]) * 60 + Number(count[1]);
                        var mseks = Number(data[0]);
                        var now = new Date().getTime();
                        if (mseks + Number(data[1]) * 60000 + 5000 >= now + count*1000) {
                            var newcent = document.createElement("center");
                            newcent.innerHTML = "gestartet am " + FormatDateTime(new Date(mseks), "um") + " für " + data[1] + " Minuten in Gebiet " + data[2] + " gegen " + data[3] + "e Tiere";
                            psl[0].appendChild(newcent, psl[0]);
                        }
                    }
                    else
                        PGu_delete("PetStart");
                }
            }
        }
        if (!document.getElementById("action_start_button"))
            window.setTimeout(setEventListener, to);
        else {
            document.getElementById("action_start_button").addEventListener('click', function(event) {
                savePetStart();
                return true;
            }, false);
            lsnrset = 2;
        }
    }
}

function showPetBox() {
    if (document.getElementById("plundertab").getElementsByTagName("a")[1].className == "selected")
        var pets = document.getElementsByClassName("petname");
    else
        var pets = document.getElementById("pet_kader").getElementsByClassName("petname");
    for (var i = 0; i < pets.length; i++) {
        var id = pets[i].parentNode.id;
        if (document.getElementById(id + "Chb"))
            continue;
        pets[i].innerHTML = " " + pets[i].innerHTML;
        var inp = document.createElement("input");
        inp.id = id + "Chb";
        inp.name = id + "Chb";
        inp.type = "checkbox";
        inp.title = "Streunverbot";
        pets[i].insertBefore(inp, pets[i].childNodes[0]);
        inp.checked = PGu_getValue(id+"Chb", false);
        document.getElementById(id+"Chb").addEventListener("click", function(event) {
            // Klickstatus speichern
            if (this.checked)
                PGu_setValue(event.target.id, true);
            else
                PGu_delete(event.target.id);
        }, false);
    }
    if (i <= 3 && document.getElementById("plundertab").getElementsByTagName("a")[1].className == "selected" && !document.getElementById("meadow_click"))
        window.setTimeout(showPetBox, 1000);

    return;
}

function DoPetCheck(first)
{
    PG_log("DoPetCheck(first="+first+")");
    if (maxFass == 0 && first) {
        trace("maxFass = 0, setze Timeout", 8);
        window.setTimeout(DoPetCheck, 500, true);
        return;
    }

    if(window.location.pathname.endsWith("/pet/")){
        setEventListener();
        if (PGu_getValue("AutoPet", false)) {
            if (first)
                window.setTimeout(showPetBox, 1000);
            var content = document.getElementById("content").innerHTML;
            var pos = content.search(/>\d* *freie Punkte|>\d* *freier Punkt/);
            var skillPlan = [["Ausdauer", "max"],
                             ["Spürnase", (TOWNEXTENSION == "ML"?"-38":"-75")],
                             ["Kampfkraft", "+20"],
                             ["Spürnase", (TOWNEXTENSION == "ML"?"-33":"-65")],
                             ["Spürnase", (TOWNEXTENSION == "ML"?"-30":"-60")],
                             ["Spürnase", (TOWNEXTENSION == "ML"?"-28":"-55")],
                             ["Wachsamkeit", "max"],
                             ["Kampfkraft", "max"]];
            while (pos != -1) {
                var fp = parseInt(content.substr(pos+1));
                var petname = content.substr(content.lastIndexOf('class="petnametooltip', pos)-100, 100).split(">").pop().split("<")[0].trim();
                trace(fp + " freie Punkte für " + petname, 3);
                pos2 = content.indexOf('class="petxpbar', pos);
                var lvl = Number(content.substr(pos2-100, 100).split('Level">').pop().split("<")[0].trim());
                var hchst = content.substr(pos).split("chstwert: ");
                for (var l = 0; l < skillPlan.length; l++) {
                    var skill = "";
                    for (var hwi = 1; hwi < hchst.length; hwi++) {
                        var pp = hchst[hwi-1].lastIndexOf("<h1>");
                        if (pp == -1)
                            continue;
                        skill = hchst[hwi-1].substr(pp+4).split("</h1>")[0];
                        if (skill == skillPlan[l][0])
                            break;
                    }
                    if (hwi == hchst.length)
                        continue;
                    if (skill == "")
                        break;
                    trace("Skill gefunden: " + skill, 8);
                    var divs = hchst[hwi].split("</div>");
                    var hw = Number(divs[0].trim());
                    var aw = 1;
                    while (!divs[aw].trim().match(/^\d+\+$/))
                        aw++;
                    aw = parseInt(divs[aw].trim());
                    var zw = hw;
                    if (skillPlan[l][1] == "max")
                        if (aw >= hw)
                            continue;
                        else
                            zw = hw;
                    else {
                        zw = Number(skillPlan[l][1]);
                        if (skillPlan[l][1].substr(0,1) == "+")
                            zw = zw + aw % 2;
                    }
                    var abbr = (zw < 0);
                    if (abbr)
                        zw = -zw;
                    trace ("Zielwert für Skill " + skill + ": " + zw + ", Abbruch: " + (abbr?"true":"false"), 8);

                    if (hw < zw || aw + fp + (lvl==50?0:(51-lvl)*2) < zw)
                        if (abbr) {
                            trace("Zielwert nicht erreichbar, nächster Skill", 8);
                            continue;
                        }
                        else
                            zw = hw;

                    if (aw < zw) {
                        var upg = Math.min(zw - aw, fp);
                        var sc = hchst[hwi-1].split("statcontainer");
                        var ablty = hchst[hwi-1].split("<h1>")[1].split("</h1>")[0];
                        var href = sc[upg+1].split('href="')[1].split('"')[0];
                        trace("Fähigkeit " + ablty + " von Tier " + petname + " um " + upg + " erhöht.", 1);
                        GM_xmlhttpRequest({method:"GET", url: prothost + href, onload:function(responseDetails) {
                            reload("pet_upgrade", "/pet/");
                        }});
                        return;
                    }
                }
                pos2 = content.substr(pos+50).search(/> *\d* *freie Punkte|>\d* *freier Punkt/);
                if (pos2 == -1)
                    break;
                pos += pos2 + 50;
            }
            DoPetFinishCheck(content, true);
        }
    }
    else if (PGu_getValue("AutoPet", false)) {
        trace('Get ' + prothost + '/pet/', 2);
        GM_xmlhttpRequest({method:"GET", url: prothost + '/pet/', onload:function(responseDetails) {
            DoPetFinishCheck(responseDetails.responseText, true);
        }});
    }
}

function sellBottles(menge, price, src)
{
    function sell(menge, price, src) {
        var content = src.split('id="content"')[1];
        var pos = content.indexOf('id="max"');
        if (pos < 0)
            return;
        var text = content.substr(0, pos + content.substr(pos).indexOf(">"));
        var anz = Number(text.substr(text.lastIndexOf("<input")).split('value="').pop().split('"')[0].trim());
        var bprice = price;
        if (menge == 0 || bprice == 0) {
            pos = text.indexOf('id="chkval"');
            if (pos < 0)
                return;
            text = content.substr(0, pos + content.substr(pos).indexOf(">"));
            bprice = Number(text.substr(text.lastIndexOf("<input")).split('value="').pop().split('"')[0].trim());
            if (menge == 0)
                menge = Math.ceil(price * 100 / bprice);
        }
        if (anz >= menge)
            HttpPost(content, 1, ["chkval", bprice, "sum", menge], function() { reload("sellBottles: " + menge + " zu " + bprice); });
    }

    if (menge <= 0)
        return;

    if (src == "")
        GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/bottle/', onload:function(responseDetails) {
            sell (menge, price, responseDetails.responseText);
        }});
    else
        sell (menge, price, src);
}

function checkGhostPages() {
    function testGhost(i) {
        if (i >= ghostPages.length) {
            PGu_setValue("ghostIndex", i);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET', url: prothost + '/' + ghostPages[i] + '/',
            onload: function(responseDetails) {
                var content = responseDetails.responseText;
                var ghosts = content.split('class="ghost_container"');
                if (ghosts.length > 1) {
                    PGu_setValue("ghostIndex", i + 1);
                    window.location.href = prothost + '/' + ghostPages[i] + '/';
                }
                else
                    testGhost(i+1);
            }
        });
        return;
    }

    var today = new Date();
    var tagesdatum = FormatDate(today);
    var gi = PGu_getValue("ghostIndex", 0);
    if (gi >= ghostPages.length)  {
        if (PGu_getValue("ghostTest", "") != tagesdatum && today.getTime() % 86400000 > 300000) {
            gi = 0;
            PGu_setValue("ghostTest", tagesdatum);
            PGu_setValue("ghostTestNoon", "");
        }
        else if (PGu_getValue("ghostTestNoon", "") != tagesdatum && today.getHours() > 12) {
            gi = 0;
            PGu_setValue("ghostTestNoon", tagesdatum);
        }
    }

    testGhost(gi);
}

function WashMe(id, cnt) {
    // **********************************************************************************
    // *** GM_XMLHTTPREQUEST *** POSTEN des Kommandos zum Waschen
    // **********************************************************************************
    GM_xmlhttpRequest({method: 'POST', url: prothost + '/city/washhouse/buy/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
        data: encodeURI('id=' + id),
        onload: function(responseDetails) {
            if (cnt > 1)
                WashMe(id, cnt-1);
            else
                reload("WashMe: " + id);
        }
     });
}

function CheckPresent(content) {
    PG_log("CheckPresent");
    var offers = content.split('href="/offers/');
    var aktoffers = [];
    for (var i = 1; i < offers.length; i++)
        aktoffers.push("/offers/" + offers[i].split('"')[0]);

    var sploffers = PGu_getValue("offers", "");
    if (sploffers != "") {
        sploffers = sploffers.split(";");
        for (var i = sploffers.length - 1; i >= 0; i--) {
            if (aktoffers.indexOf(sploffers[i].split(":")[0]) == -1)
                sploffers.splice(i, 1);
        }
    }
    else
        sploffers = [];

    for (var i = 0; i < aktoffers.length; i++) {
        for (var j = 0; j < sploffers.length; j++)
            if (sploffers[j].split(":")[0] == aktoffers[i])
                break;
        if (j == sploffers.length)
            sploffers.push(aktoffers[i] + ":0");
    }

    PGu_setValue("offers", sploffers.join(";"));

    for (var i = 0; i < sploffers.length; i++) {
        var offer = sploffers[i].split(":");
        if (offer[1] > 0 || offer[1].length > 1)
            continue;
        sploffers[i] = offer[0] + ":1";
        GM_xmlhttpRequest({method:"GET", url: prothost + offer[0], onload:function(responseDetails) {
            var content = responseDetails.responseText.split('id="content"')[1];
            var pos = content.search("1 mal abholen");
            if (pos == -1 || content.indexOf('id="postrequest') == -1) {
                PGu_setValue("offers", sploffers.join(";"));
                return;
            }
            sploffers[i] = offer[0] + ":" + FormatDateTime(new Date());
            HttpPost(content, "postrequest", [], function() { PGu_setValue("offers", sploffers.join(";")); reload("CheckPresent"); });
        }});
        break;
    }
}

function gangCredit(payin, min) {
    GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/credit/', onload:function(responseDetails) {
        var content = responseDetails.responseText.split('id="content"')[1];
        var gesamt = content.match(/Gesamt:.*[\d.,]+[^<]+/);
        if (gesamt == null)
            return;
        gesamt = gesamt[0].split(">")[1].replace(/[,.]/g, "").match(/\d+/g);
        if (gesamt.length > 1 && Number(gesamt[0]) + payin * 100 > Number(gesamt[1]))
            payin = (Number(gesamt[1]) - Number(gesamt[0])) / 100;
        if (payin >= min)
            HttpPost(content, 1, ["f_money", payin, "f_comment", ""], function(responseDetails) {
                var money = GetMoney(document);
                var money2 = responseDetails.responseText.split('id="options"')[1].split("</a")[0].split(">").pop().match(/[.,\d]+/)[0].replace(/[.,]/g,"") / 100;
                if (money2 != money)
                    reload ("gangCredit: " + payin, "/gang/credit/");
            });
    }});
}

function CheckSalary() {
    PG_log("CheckSalary");
    getOverviewPage(mainFunc5);
}

function mainFunc5() {
    trace("mainFunc5", 8);
    var fass = overviewcontent.split('class="first"')[1].split("Fassungsverm")[1].match(/[\d.,]+/);
    var maxmoney = Number(fass[0].replace(/[.,]/g,''));
    var time = document.getElementById("counter0").innerHTML.trim();
    var seks = 0;
    if (time.indexOf(" ") == -1) {
        seks = getSeks(time);
    }
    else
        seks = 3600;
    if (seks < 30 && seks > 0)
        return;
    var money = GetMoney(document);
    if (TOWNEXTENSION == "ML" && expertMode) {
        var kk = Number(overviewcontent.split('class="icon crowncap"')[1].split("</a>")[0].split(">").pop());
        if (kk >= 100 && (maxmoney < 10000 && money < 5 || maxmoney == 10000 && money < 20))
            if (overviewcontent.indexOf('id="starter_popup') != -1) {
                GM_xmlhttpRequest({
                    method: 'POST', url: prothost + '/itemsale/starter/gold/',
                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    data: encodeURI("dummy=Spezial"),
                    onload: function(responseDetails) {
                        trace("Starterpaket Gold gekauft", 1);
                    }
                });
            }
            else {
                var pos = overviewcontent.search(/\/offers\/event_.*Starter\/view/);
                if (pos != -1) {
                    var href = overviewcontent.substr(pos).split('"')[0].replace('/view/', '/buy/');
                    GM_xmlhttpRequest({
                        method: 'POST', url: prothost + href,
                        headers: {'Content-type': 'application/x-www-form-urlencoded'},
                        data: encodeURI("postrequest=1"),
                        onload: function(responseDetails) {
                            trace("Starterpaket Silber gekauft", 1);
                        }
                    });
                }
            }
        else if (kk >= 100 && maxmoney < 10000 && money > 15) {
            GM_xmlhttpRequest({method:"GET", url: prothost + '/city/stuff/', onload:function(responseDetails) {
                var content = responseDetails.responseText.split('id="content"')[1];
                HttpPost(content.substr(content.indexOf('id="1"')-20), 1, [], function() { trace("Behälter 1 gekauft", 1); });
            }});
            return;
        }
        else if (maxmoney == 10000 && money > 80) {
            GM_xmlhttpRequest({method:"GET", url: prothost + '/city/stuff/', onload:function(responseDetails) {
                var content = responseDetails.responseText.split('id="content"')[1];
                HttpPost(content.substr(content.indexOf('id="2"')-20), 1, [], function() { trace("Behälter 2 gekauft", 1); });
            }});
            return;
        }
        else if (maxmoney == 100000 && money > 800) {
            GM_xmlhttpRequest({method:"GET", url: prothost + '/city/stuff/', onload:function(responseDetails) {
                var content = responseDetails.responseText.split('id="content"')[1];
                HttpPost(content.substr(content.indexOf('id="3"')-20), 1, [], function() { trace("Behälter 3 gekauft", 1); });
            }});
            return;
        }
        else if (maxmoney == 1000000 && money > 9000) {
            GM_xmlhttpRequest({method:"GET", url: prothost + '/city/stuff/', onload:function(responseDetails) {
                var content = responseDetails.responseText.split('id="content"')[1];
                HttpPost(content.substr(content.indexOf('id="4"')-20), 1, [], function() { trace("Behälter 3 gekauft", 1); });
            }});
            return;
        }
    }
    if (!PGu_getValue("getSalary", false))
        return;
    var mon = overviewcontent.split('class="icon money"')[1].split("</a>")[0];
    var salary = 0;
    money = Number(mon.split(">").pop().match(/[\d,.]+/)[0].replace(/[.,]/g, ''));
    if (overviewcontent.indexOf(" jetzt einsacken") != -1)
        salary = Number(overviewcontent.split(" jetzt einsacken")[0].match(/[\d,.]+/g).pop().replace(/[.,]/g, ''));
    if (overviewcontent.indexOf("Lohn abholen") != -1 || salary > 0 && (money + salary > maxmoney && money < 100000 || salary > maxmoney - 200000)) {
        if (money + salary < maxmoney) {
            var text = overviewcontent.split("music_payout")[1];
            var val = text.split('value="')[1].split('"')[0];
            var name = text.split('name="')[1].split('"')[0];
            GM_xmlhttpRequest({
                method: 'POST', url: prothost + '/overview/music_payout/',
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                data: encodeURI(name+"="+val),
                onload: function(responseDetails) {
                    trace("Lohn abgeholt: " + salary, 1);
                }
            });
        }
        else if (money % 100000 + salary <= maxmoney){
            gangCredit(Math.floor(money / 100000) * 1000, 1000);
            return;
        }
    }

    var pos = overviewcontent.indexOf('name="reflink"');
    if (pos == -1)
        return;
    pos = overviewcontent.lastIndexOf(">", pos);
    var link = TOWNEXTENSION + ";" + overviewcontent.substr(pos).split('value="')[1].split('"')[0];
    if (money == maxmoney) {
        trace("kein freier Platz für Geld", 1);
        return;
    }
    var today = new Date();
    PG_log("now: " + today.getTime() + ", wait bis: " + PGu_getValue("spendenwait", 0));
    if (today.getTime() < PGu_getValue("spendenwait", 0)) {
        trace("warten für Spenden", 2);
        return;
    }
    pos = overviewcontent.search(/Du hast heute \d* Spenden erhalten/);
    if (pos <= 0) {
        trace("Spendentext nicht gefunden", 2);
        return;
    }
    var spenden = overviewcontent.substr(pos).match(/Du hast heute \d* Spenden erhalten[^\d]*\d*/);
    if (spenden.length < 1) {
        trace("Spendentext nicht gefunden2", 2);
        return;
    }
    pos = overviewcontent.lastIndexOf("<table", pos);
    var table = overviewcontent.substr(pos).split("<table")[1].split("</table>")[0];
    while (table.indexOf("unarm") == -1) {
        pos = overviewcontent.lastIndexOf("<table", pos-1);
        table = overviewcontent.substr(pos).split("<table")[1].split("</table>")[0];
    }
    var tabs = table.split("<tr")[2].split("<td");
    var pltab = 3;
    if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" || TOWNEXTENSION == "MU")
        pltab = 1;
    var aktPlunder = tabs[pltab].split('src="')[1].split('"')[0];
    var rest = Number(spenden[0].split(" ").pop());
    if (rest <= 0 || rest == PGu_getValue("spendenrest", -1)) {
        if (rest == PGu_getValue("spendenrest", -1)) {
            PGu_setValue("spendenwait", String(today.getTime()+30*60000));
            PGu_delete("spendenrest");
        }
        else {
            PGu_delete("spendenwait");
            PGu_delete("spendenrest");
        }
        var stuff = PGu_getValue("aktPlunder", "");
        if (stuff != "") {
            if (stuff.split(";").pop() == aktPlunder)
                PGu_setValue("aktPlunder", "");
            else {
                // **********************************************************************************
                // *** GM_XMLHTTPREQUEST *** POSTEN des Plunderwechsels
                // **********************************************************************************
                GM_xmlhttpRequest({method: 'POST', url: prothost + '/stock/plunder/change/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    data: encodeURI('from_f=0&f_plunder=' + stuff.split(";")[0]),
                    onload: function(responseDetails) {
                        trace("Plunder gewechselt: " + stuff.split(";")[0], 1);
                    }
                });
            }
        }
        return;
    }
    var time = Number(overviewcontent.split('class="icon fight')[1].split("counter(")[1].split(",")[0]);
    if (time > 0 && time < 60) {
        trace("Kampf endet bald", 2);
        return;
    }
    time = overviewcontent.split('class="icon rank');
    if (time.length < 2)
        time = overviewcontent.split('class="icon crime');
    time = Number(time[1].split("counter(")[1].split(",")[0]);
    if (time > 0 && time < 60) {
        trace("Verbrechen endet bald", 2);
        return;
    }
    var clean = overviewcontent.match(/Sauberkeit:[^\d]*\d*/);
    if (clean.length < 1) {
        trace("Sauberkeit-Text nicht gefunden", 2);
        return;
    }
    clean = Number(clean[0].split(">")[1]);
    if (clean < 100) {
        var id = 2;
        var cnt = 1;
        var cost = 25;
        if (clean >= 20) {
            id = 1;
            cnt = Math.ceil((100 - clean) / 20);
            cost = cnt * 6;
        }
        money = GetMoney(document);
        if (cost > money) {
            var pid = PGu_getValue("sellPlunder1", "0");
            if (pid != "0")
                sellPlunder (pid, 1, "sellPlunder1");
            else {
                sellBottles(0, cost - money, "");
            }
        }
        else
            WashMe(id, cnt);
        return;
    }
    pos = overviewcontent.search("Angelegte Plunder");
    if (pos <= 0) {
        trace("Angelegten Plunder nicht gefunden", 2);
        return;
    }

    GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/ajax/?c='+pltab, onload:function(responseDetails) {
        var content = responseDetails.responseText;
        var bonus = content.match(/ Einnahmen durch Spenden um \d*%/g);
        var maxp = -1;
        if (bonus != null)
            for (var i = 0; i < bonus.length; i++)
               if (maxp < 0)
                  maxp = i;
               else if (bonus[i] > bonus[maxp])
                  maxp = i;
        var trs = content.split("<table")[1].split("</table")[0].split("<tr");
        var zp = aktPlunder;
        var aktstuff = -1;
        for (var i = 1; i < trs.length && maxp >= 0; i++)
            if (trs[i].indexOf(aktPlunder) != -1) {
                aktstuff = trs[i].split("change_stuff('")[1].split("'")[0];
                break;
            }
        var stuff = -1;
        for (var i = 1; i < trs.length && maxp >= 0; i++)
            if (trs[i].indexOf(bonus[maxp]) != -1) {
                zp = trs[i].split('src="')[1].split('"')[0];
                stuff = trs[i].split("change_stuff('")[1].split("'")[0];
                break;
            }
        if (zp != aktPlunder) {
            PGu_setValue("aktPlunder", aktstuff + ";" + aktPlunder);
            // **********************************************************************************
            // *** GM_XMLHTTPREQUEST *** POSTEN des Plunderwechsels
            // **********************************************************************************
            GM_xmlhttpRequest({method: 'POST', url: prothost + '/stock/plunder/change/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
                data: encodeURI('from_f=0&f_plunder=' + stuff),
                onload: function(responseDetails) {
                    trace("Plunder gewechselt: " + stuff, 1);
                }
            });
            return;
        }
        trace("Hole Spenden: " + PG_getValue("spendensammler", "xxx"), 1);
        if (PG_getValue("spendensammler", "xxx") == "4everproxy")
        {
            if (GM_getValue("4everproxylink", "xxx") == "xxx") {
                GM_setValue("4everproxylink", link);
                setTimeout(startProxysite, 2000, link, prothost, m_ownuserid, TOWNEXTENSION, rest);
            }
            else if (GM_getValue("4everproxylink", "xxx") == link)
                startProxysite(link, prothost, m_ownuserid, TOWNEXTENSION, rest);
            return;
        }
    }
    });
}

function startProxysite(link, prothost, userid, town, rest) {
    if (GM_getValue("4everproxylink", "xxx") == link) {
        var today = new Date();
        GM_setValue("4everproxyhost", prothost + ";" + today.getTime());
        GM_setValue(town + "spendenrest" + userid, rest);
        window.location.href = "https://www.4everproxy.com";
    }
    else if (GM_getValue("4everproxylink", "xxx") == "xxx") {
        GM_setValue("4everproxylink", link);
        setTimeout(startProxysite, 2000, link, prothost, userid, town, rest);
    }
    else
        setTimeout(startProxysite, 10000, link, prothost, userid, town, rest);
    return;
}

function CheckGhosts() {
    PG_log("CheckGhosts");
    var today = new Date();
    var tagesdatum = FormatDate(today);
    var to = 10;
    var ghosts = document.getElementsByClassName("ghost_container");
    if (ghosts.length > 0) {
        for (var gi = 0; gi < ghostPages.length; gi++)
            if (window.location.pathname.substr(1, ghostPages[gi].length) == ghostPages[gi])
                break;
        if (gi >= ghostPages.length)
            gi = window.location.pathname;
        var ghostsfound = PGu_getValue("ghostsfound", "");
        if (ghostsfound == "")
            ghostsfound = tagesdatum;
        else if (ghostsfound.indexOf(tagesdatum) == -1)
            ghostsfound += ";" + tagesdatum;
        ghostsfound += ":" + ghosts.length + ":" + gi;
        PGu_setValue("ghostsfound", ghostsfound);

        to = 3;
        if (PGu_getValue("ghostTest", "") != tagesdatum) {
            PGu_setValue("ghostIndex", 0);
            PGu_setValue("ghostTest", tagesdatum);
            PGu_setValue("ghostTestNoon", tagesdatum);
        }
    }

    for (var i = 0; i < ghosts.length; i++)
        setTimeout('document.getElementsByClassName("ghost_container")['+i+'].click();', 1000);

    setTimeout (checkGhostPages, to * 1000);
    return;
}

function CheckPlunder() {
    PG_log("CheckPlunder");
    GM_xmlhttpRequest({method:"GET", url: prothost + '/city/plundershop/', onload:function(responseDetails) {
        var goods = responseDetails.responseText.split("/stock/plunder/craft/details/");
        var buyable = PG_getValue("buyablegoods", "");
        if (buyable == "") {
            buyableP = [];
            buyable = [];
        }
        else {
            buyableP = buyable.replace(/[^#]+=/g, "").split("#");
            buyable = buyable.replace(/=[^#]+/g, "").split("#");
            if (buyableP[0].indexOf(":") != -1)
                for (var i = 0; i < buyableP.length; i++) {
                    var chg = buyableP[i].split(":");
                    buyableP[i] = chg[1] + "*" + chg[0];
                }
            }
        var count = buyable.length-1;
        var lastpid = 0;
        for (var i = 1; i < goods.length; i++) {
            var pid = goods[i].split("/")[0];
            var cost = goods[i].split("<br")[1].split("<")[0].split(">")[1].replace("\n", "").trim();
            if (pid == lastpid || cost == "")
                continue;
            lastpid = pid;
            var plnd = goods[i].split("</strong")[0].split(">").pop().trim();
            var indx = buyable.indexOf(pid);
            if (indx == -1) {
                buyable.push(pid);
                buyableP.push(plnd + "*" + cost);
            }
            else if (buyableP[indx] != plnd + "*" + cost) {
                buyableP[indx] = plnd + "*" + cost;
                count = 0;
            }
        }
        if (buyable.length != count) {
            for (var i = 0; i < buyable.length; i++)
                buyable[i] = [buyable[i], buyableP[i]];
            buyable = buyable.sort(function(a, b){return a[0]-b[0];});
            for (var i = 0; i < buyable.length; i++)
                buyable[i] = buyable[i][0] + "=" + buyable[i][1];
            PG_setValue("buyablegoods", buyable.join("#"));
        }
        var alwaysbuy = PGu_getValue("alwaysbuy", "");
        if (alwaysbuy == "")
            return;
        alwaysbuy = alwaysbuy.split(";");
        var money = GetMoney(document);
        var bought = PGu_getValue("bought", "");
        var boughtnow = "";
        var today = new Date();
        for (var i = 1; i < goods.length; i++) {
            var pid = goods[i].split("/")[0];
            var indx = alwaysbuy.indexOf(pid);
            if (indx == -1 && alwaysbuy[0] != "0")
                continue;
            if (goods[i].indexOf("<form") == -1 && i < goods.length - 1)
                goods.splice(i, 1, goods[i] + goods[i + 1]);
            var cost = goods[i].split("<br")[1].split("<")[0].split(">")[1].replace("\n", "").trim();
            if (cost == "")
                continue;
            cost = Number(cost.match(/[\d,.]+/)[0].replace(/[.,]/g, ""))/100;
            if (cost > money)
                continue;
            money -= cost;
            if (boughtnow == "")
                boughtnow = String(today.getTime()) + ":" + pid;
            else
                boughtnow += "," + pid;
            trace("buy " + pid + " for " + cost, 1);
            HttpPost(goods[i], 1, [], function() { });
        }
        if (boughtnow != "") {
            if (bought == "")
                bought = [];
            else
                bought = bought.split(";");
            bought.push(boughtnow);
            if (bought.length > 10)
                bought.splice(0, 1);
            PGu_setValue("bought", bought.join(";"));
        }
    }});
}

function doBuy(id, anz) {
    PG_log("doBuy(" + id + ", " + anz + ")");
    if (GetMoney(document) < 10) {
        var id = PGu_getValue("sellPlunder1", "0");
        if (id != "0")
            sellPlunder(id, 1, "sellPlunder1");
        return;
    }

    var food = "";
    if (id == 2 || id == 3 || id == 4)
        food = "food/";

    GM_xmlhttpRequest({method:"GET", url: prothost + '/city/supermarket/'+food, onload:function(responseDetails) {
        var content = responseDetails.responseText.split('id="content"')[1];
        var inputs = content.split("<input");
        var fnum = 1;
        for (var i = 1; i < inputs.length; i++) {
            if (inputs[i].indexOf('<form') != -1)
                fnum++;
            if (inputs[i].indexOf('name="id"') != -1) {
                if (inputs[i].split('value="')[1].split('"')[0] == id) {
                    trace("buy " + anz + " x " + id, 1);
                    HttpPost(content, fnum, ["menge", anz], function() { reload("doBuy"); });
                    break;
                }
            }
        }
    }});
}

function doEatDrink(id, anz) {
    PG_log("doEatDrink(" + id + ", " + anz + ")");
    var food = "";
    if (id == 2 || id == 3 || id == 4)
        food = "food/";

    GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/foodstuffs/'+food, onload:function(responseDetails) {
        var content = responseDetails.responseText.split('id="content"')[1];
        var inputs = content.split("<input");
        var fnum = 1;
        var pos = inputs[0].length;
        var menge = 0;
        for (var i = 1; i < inputs.length; i++) {
            if (inputs[i].indexOf('<form') != -1)
                fnum++;
            if (inputs[i].indexOf('name="id"') != -1) {
                if (inputs[i].split('value="')[1].split('"')[0] == id) {
                    var menge = content.substr(pos).split("<span>")[1].match(/\d+/)[0];
                    if (menge >= anz) {
                        trace(id == 2 || id == 3 || id == 4?"eat":"drink " + anz + " x " + id, 1);
                        HttpPost(content, fnum, ["menge", anz], function() { reload("doEatDrink"); });
                    }
                    break;
                }
            }
            pos += inputs[i].length + 6;
        }
        if (menge < anz) {
            var eatDrink = PGu_getValue("eatDrink", "");
            if (eatDrink != "")
                eatDrink = (id != 1?"-":"") + anz + "," + eatDrink;
            else
                eatDrink = (id != 1?"-":"") + anz;
            PGu_setValue("eatDrink", eatDrink);
            doBuy(id, anz - menge);
        }
    }});
}

function gangpayin(plunder, anz) {
    GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/stuff/', onload:function(responseDetails) {
        var content = responseDetails.responseText;
        var payin = content.split('Plunder einzahlen');
        if (payin.length > 1) {
            var form = payin[1].split("<form")[1].split('name="')[1].split('"')[0];
            var select = payin[1].split("<select")[1].split("</select")[0];
            var id = select.split('name="')[1].split('"')[0];
            var options = select.replace(/  */g, " ").split("<option ");
            for (var i = 1; i < options.length; i++) {
                if (options[i].indexOf(plunder + " [x") != -1) {
                    var pid = options[i].split('value="')[1].split('"')[0];
                    var menge = Number(options[i].split(" [x")[1].split(']</option')[0].trim());
                    if (menge > anz)
                        menge = anz;
                    trace("pay in gang: " + menge + " x " + pid, 1);
                    HttpPost(payin[1], form, [id, pid, "f_count", menge], function() { reload("gangpayin"); });
                    break;
                }
            }
        }
    }});
}

function sellManyPlunder(data) {
    function sellSinglePlunder(sell, data, i) {
        if (i >= data.length)
            return;
        HttpPost(sell, 1, ["plunderid", data[0][2], "count", data[0][1]], function(responseDetails) {
            sellSinglePlunder (sell, data, i+1);
        });
    }
    if (data.length < 1)
         return;
    GM_xmlhttpRequest({method: 'GET', url: prothost + '/stock/plunder/', onload: function(responseDetails) {
         var sell = responseDetails.responseText.split("Plunder verkaufen")[1];
         sellSinglePlunder (sell, data, 0);
    }});
}

function sellPlunder(pid, anz, varname) {
    PG_log("sellPlunder(" + pid + ", " + anz + ")");
    GM_xmlhttpRequest({method: 'GET', url: prothost + '/stock/plunder/', onload: function(responseDetails) {
        var sell = responseDetails.responseText.split("Plunder verkaufen")[1];
        HttpPost(sell, 1, ["plunderid", pid, "count", anz], function(responseDetails) {
           if (varname != "") {
               var antwort = responseDetails.responseText.split("<title")[1].split("</title")[0].split(">")[1];
               if (antwort.indexOf("Server Error") != -1)
                   PGu_setValue(varname, "0");
           }
           reload("sellPlunder: " + anz + " " + pid);
        });
    }});
}

function sellWeapon(id) {
     GM_xmlhttpRequest({method: 'POST', url: prothost + '/stock/armoury/sell/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
        data: encodeURI('id='+id),
        onload: function(responseDetails) {
            reload("sellWeapon");
        }
     });
}

function useWeapon() {
    var selWeapon = PGu_getValue("selWeapon");
    if (selWeapon == "")
        reload("useWeapon1");
    else {
        GM_xmlhttpRequest({method: 'POST', url: prothost + '/stock/armoury/use/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
            data: encodeURI('id=' + selWeapon),
            onload: function(responseDetails) {
                PGu_setValue("selWeapon", "");
                reload("useWeapon2 " + selWeapon);
            }
        });
    }
}

function buyWeapon(id) {
    if (id == "0") {
        useWeapon();
    }
    else {
        GM_xmlhttpRequest({method: 'POST', url: prothost + '/city/weapon_store/buy/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
            data: encodeURI('id='+id),
            onload: function(responseDetails) {
                    useWeapon();
            }
        });
    }
}

function moveTo(target, home, mode) {
    if (home != "")
        PGu_setValue("homeDist", home);
    else
        PGu_setValue("homeDist", "");

    GM_xmlhttpRequest({method: 'POST', url: prothost + '/city/district/buy/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
        data: encodeURI("id="+target+"&SubmitForm="+(mode==""?"Einziehen":"Kaufen")),
        onload: function(responseDetails) {
            reload("moveTo");
        }
    });
}

function incrDailyTry(tagesdatum, tries) {
    PGu_setValue("tryDailyTask", tagesdatum + ";" + (tries+1).toString());
    return;
}

function doDailyTask(t) {
    PG_log("doDailyTask(" + t + ")");
    if (t < 0)
        return false;
    var today = new Date();
    var tagesdatum = FormatDate(today);
    tryDaily = PGu_getValue("tryDailyTask", ";0").split(";");
    if (tryDaily[0] != tagesdatum) {
        var tries = 0;
        PGu_delete("tryDailyTask");
    }
    else
        var tries = Number(tryDaily[1]);
    trace("Tägliche Aufgabe " + t + ", Versuche bisher: " + tries, (tries > 0?1:2));

    switch (t) {
        // Jetzt eine PN an einen Freund versenden
        case  0: var friend = PGu_getValue("friendid", "0");
                 if (friend == "0")
                     return false;
                 GM_xmlhttpRequest({method:"GET", url: prothost + '/friendlist/', onload:function(responseDetails) {
                    var content = responseDetails.responseText;
                    // Wenn die Seite abgerufen werden konnte (kein Seitenladefehler)
                    if (content.indexOf("<strong>Mein Penner</strong>") != -1) {
                        if (content.indexOf("/profil/id:"+friend+"/") == -1)
                            PGu_setValue("friendid", "0");
                        else {
                            GM_xmlhttpRequest({method:"GET", url: prothost + '/messages/write/', onload:function(responseDetails) {
                                var content = responseDetails.responseText.split('id="content"')[1];
                                incrDailyTry(tagesdatum, tries);
                                trace("Send mail to " + friend, 1);
                                HttpPost(content, 1, ["f_toname", "id:"+friend, "f_subject", "", "f_text", ""], function() { reload("doDailyTask0"); });
                            }});
                        }
                    }
                 }});
                 break;
        // Ein Verbrechen/eine Sünde erfolgreich begehen
        case  1: if (document.getElementById("options").innerHTML.indexOf("crime") != -1)
                     return false;
                 var time = document.getElementById("options").innerHTML.split("rank")[1].split("counter(")[1].split(",")[0];
                 if (time < 0) {
                     incrDailyTry(tagesdatum, tries);
                     GM_xmlhttpRequest({method:"GET", url: prothost + '/activities/', onload:function(responseDetails) {
                        var actbottle = responseDetails.responseText.split('/activities/bottle/')[1].split("</form")[0];
                        var inputs = actbottle.split("<input ");
                        var data = "";
                        for (var j = 1; j < inputs.length; j++) {
                            var name = inputs[j].split('name="')[1].split('"')[0];
                            data += "&" + name + "=" + inputs[j].split('value="')[1].split('"')[0];
                        }
                        GM_xmlhttpRequest({method: 'POST', url: prothost + '/activities/bottle/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            data: encodeURI(data.substr(1)),
                            onload: function(responseDetails) {
                                reload("doDailyTask1");
                            }
                        });
                     }});
                     return true;
                 }
                 else if (time == 0) {
                     GM_xmlhttpRequest({method: 'GET', url: prothost + '/activities/crime/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
                     onload: function(responseDetails) {
                         var crimes = responseDetails.responseText.split('name="plundercrime"')[1].split("start_crime(");
                         if (crimes.length == 1)
                             PG_log("Verbrechen starten nicht möglich !!");
                         else
                             GM_xmlhttpRequest({method: 'GET', url: prothost + '/activities/crime/?start_crime=' + crimes[1].split(")")[0], headers: {'Content-type': 'application/x-www-form-urlencoded'},
                             onload: function(responseDetails) {
                                 reload("start crime " + crimes[1].split(")")[0]);
                             }});
                     }});
                     return true;
                 }
                 return false;
                 break;
        // Einen Kampf gewinnen
        case  2: //alert(2);
                 break;
        // Jetzt Lose kaufen
        case  3: if (today.getTime() < Number(PGu_getValue("KeineLoseWait", "0")))
                     return false;
                 var time = Math.ceil(today.getTime() / 1000 - today.getTimezoneOffset()*60) % 86400;
                 if (PGu_getValue("losemiss_wait", 0) > time && !PGu_getValue("LoseKaufSofort", false))
                     return false;
                 GM_xmlhttpRequest({method:"GET",
                     url: prothost + '/city/games/',
                     onload:function(responseDetails) {
                         var losecont = responseDetails.responseText.split('id="content"')[1];
                         var nochlose = losecont.split("Du kannst heute noch ").pop();
                         if (nochlose.indexOf("lose_remaining") != -1)
                             nochlose = nochlose.split("</span>")[0].split(">").pop();
                         if (nochlose == 0)
                             PGu_setValue("KeineLoseWait", String(today.getTime() + 3600000));
                         else if (PGu_getValue("LoseKaufSofort", false)) {
                             trace("Lose kaufen: 1", 3);
                             incrDailyTry(tagesdatum, tries);
                             LoseKaufen(losecont, 1);
                         }
                         else {
                             GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/missions/', onload:function(responseDetails) {
                                var missions = responseDetails.responseText.split('class="gang_mission"');
                                var losemiss = false;
                                for (var i = 1; i < missions.length; i++) {
                                    var missspl = missions[i].split("stage_area");
                                    if (missspl[2].indexOf("Rubbellose") != -1) {
                                        var counter = 0;
                                        var pos2 = missspl[1].indexOf("counter(");
                                        if (pos2 != -1) {
                                            counter = missspl[1].substr(pos2).split("counter(")[1].split(")")[0].trim();
                                            if (counter == done)
                                                counter = "0";
                                            counter = Number(counter);
                                        }
                                        losemiss = (time + counter < 83000);
                                        if (losemiss)
                                            PGu_setValue("losemiss_wait", (time+counter));
                                        break;
                                    }
                                }
                                if (!losemiss) {
                                    PGu_setValue("losemiss_wait", 0);
                                    var pos = losecont.indexOf('name="preis_cent"');
                                    if (pos < 0)
                                        return;
                                    var val = Number(losecont.substr(losecont.lastIndexOf("<input", pos)).split('value="')[1].split('"')[0]) / 100;
                                    var money = GetMoney(document);
                                    if (val > money) {
                                        var pid = PGu_getValue("sellPlunder1", "0");
                                        if (pid != "0")
                                            sellPlunder (pid, 1, "sellPlunder1");
                                        else
                                            sellBottles(0, val - money, "");
                                    }
                                    else {
                                        trace("Lose kaufen: 1", 3);
                                        incrDailyTry(tagesdatum, tries);
                                        LoseKaufen(losecont, 1);
                                    }
                                    return;
                                }
                             }});
                         }
                     }
                 });
                 return false;
                 break;
        // Jetzt in der SB posten
        case  4: GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/shoutbox_ajax/', onload:function(responseDetails) {
                    var chatadd = responseDetails.responseText;
                    var textid = chatadd.split("<textarea ")[1].split('name="')[1].split('"')[0];
                    incrDailyTry(tagesdatum, tries);
                    HttpPost(chatadd, 1, [textid, " "], function() {
                         GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/shoutbox_ajax/', onload:function(responseDetails) {
                             var divs = responseDetails.responseText.split("<div");
                             for (var i = 1; i < divs.length; i += 2) {
                                 if (divs[i].indexOf("/profil/id:"+m_ownuserid) == -1)
                                     continue;
                                 var text = divs[i+1].match(/<p>.*<\/p>/);
                                 if (text.length == 0)
                                     continue;
                                 if (text[0].split("<p>")[1].split("<")[0].trim().length > 0)
                                     continue;
                                 var pos = divs[i].indexOf("/delete/");
                                 if (pos == -1)
                                     continue;
                                 pos = divs[i].lastIndexOf("'", pos);
                                 var href = divs[i].substr(pos+1).split("'")[0];
                                 GM_xmlhttpRequest({method:"GET", url: prothost + href, onload:function(responseDetails) {
                                    reload("doDailyTask4");
                                 }});
                                 break;
                             }
                         }});
                    });
                 }});
                 break;
        // Jetzt im Supermarkt Getränke kaufen.
        case  5: incrDailyTry(tagesdatum, tries);
                 doBuy(1, 1);
                 break;
        // Jetzt einen Begleiterkampf aktivieren
        case  6: var money = Math.floor(GetMoney(document));
                 if (money == 0) {
                    var id = PGu_getValue("sellPlunder1", "0");
                    if (id != "0")
                        sellPlunder(id, 1, "sellPlunder1");
                    return (id != 0);
                 }
                 GM_xmlhttpRequest({method:"GET", url: prothost + '/fight/pet/', onload:function(responseDetails) {
                    var fightpet = responseDetails.responseText.split('action="/fight/pet/')[1].split("</form")[0];
                    var inputs = fightpet.replace(/<select/g, "<input").replace(/'/g,'"').split("<input ");
                    var data = "";
                    for (var j = 1; j < inputs.length; j++) {
                        if (inputs[j].indexOf('name="') == -1)
                            continue;
                        var name = inputs[j].split('name="')[1].split('"')[0];
                        if (name == "einsatz") {
                            var val = inputs[j].split('value="')[1].split('"')[0];
                            if (val == 0)
                                val = 1;
                        }
                        else if (name == "ttl" || name == "verhalten" || name == "risiko") {
                            var options = inputs[j].split("<option ");
                            for (var k=1; k < options.length; k++) {
                                if (options[k].indexOf("selected") != -1) {
                                    var val = options[k].split('value="')[1].split('"')[0];
                                    break;
                                }
                                else if (k == 1)
                                    var val = options[k].split('value="')[1].split('"')[0];
                            }
                        }
                        data += "&" + name + "=" + val;
                    }
                    incrDailyTry(tagesdatum, tries);
                    GM_xmlhttpRequest({method: 'POST', url: prothost + '/fight/pet/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
                        data: encodeURI(data.substr(1)),
                        onload: function(responseDetails) {
                            reload("doDailyTask6");
                        }
                    });
                 }});
                 return true;
                 break;
        // Jetzt einmal 100% sauber werden
        case  7: GM_xmlhttpRequest({method:"GET", url: prothost + '/overview/', onload:function(responseDetails) {
                     var content = responseDetails.responseText.split('id="content"')[1];
                     var clean = content.match(/Sauberkeit:[^\d]*\d*/);
                     if (clean.length < 1)
                         return;
                     clean = Number(clean[0].split(">")[1]);
                     if (clean < 100) {
                         var id = 2;
                         var cnt = 1;
                         var cost = 25;
                         if (clean >= 20) {
                             id = 1;
                             cnt = Math.ceil((100 - clean) / 20);
                             cost = cnt * 6;
                         }
                         var money = GetMoney(document);
                         if (cost > money) {
                             var pid = PGu_getValue("sellPlunder1", "0");
                             if (pid != "0")
                                 sellPlunder (pid, 1, "sellPlunder1");
                             else
                                 sellBottles(0, cost - money, "");
                             return;
                         }
                         incrDailyTry(tagesdatum, tries);
                         WashMe(id, cnt);
                     }
                     else {
                         // Seife benutzen
                         var pltab = 4;
                         if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" || TOWNEXTENSION == "MU")
                             pltab = 3;
                         GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/ajax/?c='+pltab, onload:function(responseDetails) {
                             var content = responseDetails.responseText;
                             var trs = content.split("<tr ");
                             var fnum = 1;
                             for (var i = 1; i < trs.length; i++) {
                                 if (trs[i].indexOf('seife.png') != -1 || trs[i].indexOf('p_spender.png') != -1) {
                                     var pid = trs[i].split('pm_')[1].split("'")[0].trim();
                                     incrDailyTry(tagesdatum, tries);
                                     HttpPost(content, fnum, ["f_plunder", pid], function() { reload("doDailyTask7"); });
                                     break;
                                 }
                                 fnum += trs[i].split("<form").length - 1;
                             }
                             if (i == trs.length) {
                                 incrDailyTry(tagesdatum, tries);
                                 GM_xmlhttpRequest({method:"GET", url: prothost + '/city/medicine/', onload:function(responseDetails) {
                                     var content = responseDetails.responseText;
                                     var money = GetMoney(document);
                                     var forms = content.split("<form ");
                                     for (var i = 1; i < forms.length; i++) {
                                         if (forms[i].indexOf('/medicine/help/') != -1) {
                                             var cost = Number(forms[i].split('class="formbutton"')[1].match(/[\d.,]+/)[0].replace(/[.,]/g,""))/100;
                                             if (cost <= money)
                                                 HttpPost(content, i, [], function() { reload("doDailyTask7b"); });
                                             else {
                                                 var pid = PGu_getValue("sellPlunder1", "0");
                                                 if (pid != "0")
                                                     sellPlunder (pid, 1, "sellPlunder1");
                                                 else
                                                     sellBottles(0, cost - money, "");
                                                 return;
                                             }
                                             break;
                                         }
                                     }
                                 }});
                             }
                         }});
                      }
                 }});
                 break;
        // Geld in deine Bandenkasse einzahlen
        case  8: var money = Math.floor(GetMoney(document));
                 if (money == 0) {
                    var id = PGu_getValue("sellPlunder1", "0");
                    if (id != "0")
                        sellPlunder(id, 1, "sellPlunder1");
                    return;
                 }
                 incrDailyTry(tagesdatum, tries);
                 gangCredit(money < 1000?1:1000, 1);
                 break;
        // Plunder in die Plunderbank deiner Bande einzahlen
        case  9: GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/missions/', onload:function(responseDetails) {
                    var missions = responseDetails.responseText.split('class="gang_mission"');
                    var neededPlunder = [];
                    var pAnz = 0;
                    for (var i = 1; i < missions.length; i++) {
                        var lis = missions[i].split("stage_area")[1].split("<li>");
                        for (var j = 1; j < lis.length; j++) {
                            var beg = lis[j].split('"amount"');
                            if (beg.length > 1)
                                neededPlunder[pAnz++] = beg[0].split("<span>")[1].split("<")[0];
                        }
                    }
                    var pltab = 6;
                    if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" ||TOWNEXTENSION == "MU")
                        pltab = 1;
                    GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/ajax/?c='+pltab, onload:function(responseDetails) {
                        var content = responseDetails.responseText;
                        var trs = content.split("<tr ");
                        var misspl = [];
                        for (var i = 1; i < trs.length; i++) {
                            if (trs[i].indexOf('"pinfo2"') == -1)
                                continue;
                            var pinfo2 = trs[i].split('"pinfo2"')[1];
                            if (pinfo2.indexOf("Missionsplunder") != -1 || pinfo2.indexOf("Bandenmission") != -1) {
                                var plname = trs[i].split(">x ")[0].split("</strong")[0].split(">").pop().trim();
                                var plAnz = trs[i].split(">x ")[1].split("<")[0].trim();
                                misspl.push([plname, Number(plAnz)]);
                            }
                        }
                        var inpaid = false;
                        for (var i = 0; i < misspl.length; i++)
                            if (neededPlunder.indexOf(misspl[i][0]) == -1) {
                                gangpayin(misspl[i][0], misspl[i][1]);
                                inpaid = true;
                                break;
                            }
                        if (!inpaid && misspl.length > 0) {
                            incrDailyTry(tagesdatum, tries);
                            gangpayin(misspl[0][0], misspl[0][1]%100!=0?misspl[0][1]%100:100);
                        }
                     }});
                 }});
                 break;
        // Eine Begleiterweiterbildung starten
        case 10: //alert(10);
                 break;
        // Einen Plunder basteln
        case 11: var indx = PGu_getValue("craftindex", 0);
                 if (indx < 0)
                     return -1;
                 var craftlist = PGu_getValue("craftlist", "").split(";");
                 var craftid = indx >= craftlist.length?"":craftlist[indx];
                 if (craftid == "") {
                     if (document.getElementById("options").innerHTML.indexOf("crime") != -1)
                         var time = 9999999999;
                     else
                         var time = Number(document.getElementById("options").innerHTML.split("rank")[1].split("counter(")[1].split(",")[0]);
                     PGu_setValue("craftindex", -1);
                     PGu_setValue("bottletime", time);
                     return -1;
                 }
                 PGu_setValue("craftindex", indx+1);
                 if (craftid == "0")
                     return -1;
                 GM_xmlhttpRequest({method: 'GET', url: prothost + '/stock/plunder/craft/details/'+craftid+"/", onload: function(responseDetails) {
                     var content = responseDetails.responseText;
                     if (content.indexOf("start_craft") != -1) {
                         HttpPost(content, "craftform", ["plunder", craftid], function() { reload("doDailyTask11"); });
                         incrDailyTry(tagesdatum, tries);
                     }
                 }});
                 break;
        // Jetzt einen kleinen Snack essen
        case 12: var promille = GetPromille(document);
                 incrDailyTry(tagesdatum, tries);
                 if (promille >= 2.5 && promille < 2.9) {
                     PGu_setValue("eatDrink", "-1");
                     doEatDrink(1, 1);
                 }
                 else if (promille < 0.8)
                     doEatDrink(2, 1);
                 else {
                     PGu_setValue("eatDrink", "1");
                     doEatDrink(2, 1);
                 }
                 break;
        // Promillepegel über 2‰
        case 13: var promille = GetPromille(document);
                 incrDailyTry(tagesdatum, tries);
                 if (promille >= 3.15) {
                     PGu_setValue("eatDrink", "1");
                     doEatDrink(2, 1);
                 }
                 else if (promille > 2.0) {
                     PGu_setValue("eatDrink", "-1");
                     doEatDrink(1, 1);
                 }
                 else {
                     var drinks = Math.ceil((2.05 - promille) / 0.35);
                     if (drinks < 1)
                         drinks = 1;
                     if (promille < 0.8)
                         var eats = Math.ceil((promille + drinks*0.35 - 0.75) / 0.35);
                     else
                         var eats = drinks;
                     PGu_setValue("eatDrink", "-" + eats);
                     doEatDrink(1, drinks);
                 }
                 break;
        // Einmal Flaschensammeln starten
        case 14: if (document.getElementById("options").innerHTML.indexOf("crime") != -1)
                     return false;
                 var time = document.getElementById("options").innerHTML.split("/fight/")[1].split("counter(")[1].split(",")[0];
                 if (time > 0)
                     return false;
                 time = document.getElementById("options").innerHTML.split("rank")[1].split("counter(")[1].split(",")[0];
                 if (time > 0)
                     return false;
                 if (!window.location.pathname.endsWith("/activities/")) {
                     reload("doDailyTask14b");
                 }
                 else {
                     if (time == 0) {
                         var lastCollectTime = PGu_getValue(nameLastCollectTime,0);
                         if (PGu_getValue("KiezTourAct", 0) == 1 || !PGu_getValue("AutoCollect", false))
                             lastCollectTime = 0;
                         var timeOptions = document.getElementsByName("time")[0];
                         timeOptions.selectedIndex = lastCollectTime;
                         if (!PGu_getValue("AutoCollect", false))
                             PGu_setValue("BottleCollectAbort", true);
                     }
                     trace("Starte Sammeln für " + timeOptions.options[lastCollectTime].value + " Minuten", 2);
                     incrDailyTry(tagesdatum, tries);
                     document.getElementsByName('Submit2')[0].click();
                 }
                 break;
        // Jetzt Flaschen verkaufen
        case 15: incrDailyTry(tagesdatum, tries);
                 sellBottles(1, 0, "");
                 break;
        // Jetzt Plunder verkaufen
        case 16: var pid = PGu_getValue("sellPlunder", "0");
                 if (pid == "0")
                     return false;
                 incrDailyTry(tagesdatum, tries);
                 sellPlunder (pid, 1, "sellPlunder");
                 break;
        // Jetzt den Stadtteil/das Gebiet wechseln.
        case 17: GM_xmlhttpRequest({method: 'GET', url: prothost + '/city/district/', onload: function(responseDetails) {
                     var districts = responseDetails.responseText.split("/city/district/buy/");
                     var inDist = "";
                     var toDist = "";
                     var kauf = [];
                     for (var i = 1; i < districts.length; i++) {
                         if (districts[i].indexOf('name="id') != -1) {
                             var inputs = districts[i].split("</tr")[0].split("<input ");
                             var id = "";
                             for (var j = 1; j < inputs.length; j++) {
                                 var name = inputs[j].split('name="')[1].split('"')[0];
                                 var val = inputs[j].split('value="')[1].split('"')[0];
                                 if (name == "id")
                                     id = val;
                                 else if (name == "submitForm") {
                                      if (val == "Bewohnt")
                                         inDist = id;
                                     else if (val == "Einziehen")
                                         toDist = id;
                                     else if (inputs[1].indexOf('title="Preis"') != -1) {
                                         var preis = inputs[1].split('title="Preis"')[1].split(">")[1].split("<")[0].match(/[\d.,]+/)[0].replace(/[.,]/g,"");
                                         if (Number(preis) == 0)
                                             kauf.push(id);
                                     }
                                 }
                             }
                             if (inDist != "" && toDist != "")
                                 break;
                         }
                     }
                     var modus = "";
                     if (toDist == "" && kauf.length > 0) {
                         toDist = kauf[0];
                         modus = "x";
                     }
                     if (toDist != "") {
                         incrDailyTry(tagesdatum, tries);
                         moveTo(toDist, inDist, modus);
                     }
                 }});
                 break;
        // Jetzt eine Waffe verkaufen.
        case 18: GM_xmlhttpRequest({method: 'GET', url: prothost + '/stock/armoury/', onload: function(responseDetails) {
                     var sell = responseDetails.responseText.split("/armoury/sell/");
                     var selWeapon = "";
                     var found = false;
                     for (var i = 1; i < sell.length; i++) {
                         if (sell[i].indexOf('name="id') != -1) {
                             var id = sell[i].split("value=");
                             if (id.length > 1) {
                                 var weaponid = id[1].split('"')[1];
                                 if (sell[i-1].split("<input ").pop().indexOf("disabled") != -1)
                                     selWeapon = weaponid;
                                 if (id[1].split('"')[1] == "1")
                                     found = true;
                                 if (found && selWeapon != "")
                                     break;
                             }
                         }
                     }
                     if (found) {
                         incrDailyTry(tagesdatum, tries);
                         sellWeapon("1");
                     }
                     else {
                         if (GetMoney(document) < 2) {
                             var pid = PGu_getValue("sellPlunder1", "0");
                             if (pid != "0")
                                 sellPlunder (pid, 1, "sellPlunder1");
                         }
                         else {
                             PGu_setValue("selWeapon", selWeapon);
                             buyWeapon("1");
                         }
                     }
                    }
                 });
                 break;
        // Jetzt einem anderen Penner spenden.
        case 19: if (PGu_getValue("donationlink", "") == "")
                     return false;
                 incrDailyTry(tagesdatum, tries);
                 GM_xmlhttpRequest({method: 'GET', url: PGu_getValue("donationlink", ""), onload: function(responseDetails) {
                     reload("doDailyTask19");
                 }});
                 break;
        // Jetzt Zahnstocher/Distel/Weihrauch/Kieselsteine kaufen.
        case 20: GM_xmlhttpRequest({method: 'GET', url: prothost + '/stock/armoury/', onload: function(responseDetails) {
                     var sell = responseDetails.responseText.split("/armoury/sell/");
                     var selWeapon = "";
                     var found = false;
                     for (var i = 1; i < sell.length; i++) {
                         if (sell[i].indexOf('name="id') != -1) {
                             var id = sell[i].split("value=");
                             if (id.length > 1) {
                                 var weaponid = id[1].split('"')[1];
                                 if (sell[i-1].split("<input ").pop().indexOf("disabled") != -1)
                                     selWeapon = weaponid;
                                 if (id[1].split('"')[1] == "1")
                                     found = true;
                                 if (found && selWeapon != "")
                                     break;
                             }
                         }
                     }
                     if (PGu_getValue("selWeapon", "") == "")
                         PGu_setValue("selWeapon", selWeapon);
                     if (!found) {
                         if (GetMoney(document) < 2) {
                             var pid = PGu_getValue("sellPlunder1", "0");
                             if (pid == "0")
                                 return;
                             sellPlunder (pid, 1, "sellPlunder1");
                         }
                         else {
                             incrDailyTry(tagesdatum, tries);
                             buyWeapon("1");
                         }
                     }
                     else
                         sellWeapon("1");
                    }
                 });
                 break;
        // Tierische Weihnachten
        // Einkaufen in letzter Sekunde
        default: return false;
                 break;
    }
    return true;
}

function doLogout() {
    GM_xmlhttpRequest({method: 'GET', url: prothost + '/logout/', onload: function(responseDetails) {
        window.location.href = prothost + "/logout/";
    }});
}

function CheckDaily() {
    PG_log("CheckDaily");
    if (!PGu_getValue("autoDaily", false))
        return false;

    var town = ["HH", "B", "MU", "HR", "K", "SY", "ML", "VT", "AT"];
    if (town.indexOf(TOWNEXTENSION) == -1)
        return;

    if (PGu_getValue("BottleCollectAbort", false)) {
        if (document.getElementById("options").innerHTML.indexOf("crime") != -1)
            return;
        var time = Number(document.getElementById("options").innerHTML.split("rank")[1].split("counter(")[1].split(",")[0]);
        if (time == 0) {
            PGu_setValue("BottleCollectAbort", false);
            return;
        }
        if(window.location.pathname.indexOf("/activities/") == -1)
            reload("CheckDaily");
        else
            document.getElementsByName('Submit2')[0].click();
    }

    if (PGu_getValue("chooseDistrict", true) && PGu_getValue("homeDist", "") != "") {
        moveTo(PGu_getValue("homeDist"), "", "");
        return true;
    }

    if (PGu_getValue("craftindex", 0) < 0) {
        if (document.getElementById("options").innerHTML.indexOf("crime") != -1) {
            var time = PGu_getValue("bottletime", 0) + 1;
            if (time > 9999999999)
                time = 0;
        }
        else
            var time = Number(document.getElementById("options").innerHTML.split("rank")[1].split("counter(")[1].split(",")[0]);
        if (time > PGu_getValue("bottletime", 0)) {
            PGu_setValue("craftindex", 0);   // Flaschen wurden gesammelt, Plunder basteln wieder testen
            PGu_setValue("bottletime", 0);
        }
    }

    var today = new Date();
    var tagesdatum = FormatDate(today);
    if (PGu_getValue("dailyTaskDone", "xxx") == tagesdatum) {
        var selWeapon = PGu_getValue("selWeapon", "");
        if (selWeapon != "")
            buyWeapon(selWeapon == "1"?selWeapon:"0");
        return;
    }

    tryDaily = PGu_getValue("tryDailyTask", ";0").split(";");
    if (tryDaily[0] != tagesdatum) {
        var tries = 0;
        PGu_delete("tryDailyTask");
    }
    else
        var tries = Number(tryDaily[1]);
    if (tryDaily[0] == tagesdatum && (tries >= 5 && today.getHours() < 23 || tries >= 10 && today.getHours() >= 23))
        return;

    if (PGu_getValue("dtsitting") && m_ownusername.toLowerCase() == GM_getValue(host + "_username", "").toLowerCase() && GM_getValue(host+"_trysitting", "") != tagesdatum) {
        var dtsitttime = PGu_getValue("dtsitttime", latestDTtime).split(":");
        if (Number(dtsitttime[0])*60 + Number(dtsitttime[1]) <= today.getHours()*60 + today.getMinutes()) {
            if(!window.location.pathname.endsWith("/sitting/")){
                window.location.href = prothost + "/sitting/";
                return;
            }
            var trs = document.getElementById("content").getElementsByTagName("tr");
            var rdays = Number(trs[3].getElementsByTagName("td")[1].innerHTML.split("</")[0].split(">")[1]);
            var last = trs[5].getElementsByTagName("td")[1].innerHTML.split("</")[0].split(">")[1];
            var lmth = Number(last.substr(3, 2));
            var lday = Number(last.substr(0, 2));
            var ltime = last.split(" ")[1];
            var year = today.getFullYear();
            if (today.getMonth() == 11 && lmth == 1)
                year++;
            var ldate = new Date(year, lmth-1, lday, Number(ltime.substr(0, 2)), Number(ltime.substr(3, 2)), 59);
            var pwsitting = document.getElementsByName("sitting_password")[0].value;
            if (ldate.getTime() < today.getTime() || ldate.getTime() > today.getTime() + (30 - rdays) * 864000000 || GM_getValue(host+"_trysitting", "") == tagesdatum || pwsitting == "") {
                if (rdays == 0) {
                       GM_setValue(host+"_trysitting", tagesdatum);
                    trace("Keine Sitting-Tage mehr übrig!!", 1);
                    return;
                }
                pwsitting = "heute" + today.getDate();
                GM_setValue(host+"_trysitting", "set" + tagesdatum);
                HttpPost(document.getElementById("content").innerHTML, 1, ["sitting_password", pwsitting, "pw_days", "1"],
                        function() { trace("Sittingpasswort gesetzt", 1); reload("Sitting", "/sitting/"); });
                return;
            }
            else if (GM_getValue(host+"_trysitting", "") != tagesdatum) {
                GM_setValue(host+"_trysitting", tagesdatum);
                GM_setValue(host+"_pwsitting", pwsitting);
                GM_deleteValue(host + "_pwsitting_count");
                trace("Ausloggen für Sitting", 1);
                incrDailyTry(tagesdatum, tries);
                doLogout();
                return;
            }
        }
    }

    var taskTexts = [];
    taskTexts[0] = 'Jetzt eine PN an einen Freund versenden';
    if (TOWNEXTENSION == 'AT' || TOWNEXTENSION == 'VT')
        taskTexts[1] = 'Eine ';
    else
        taskTexts[1] = 'Ein ';
    taskTexts[1] += crimetxt + ' erfolgreich begehen';
    taskTexts[2] = 'Einen Kampf gewinnen';
    taskTexts[3] = 'Jetzt Lose kaufen';
    taskTexts[4] = 'Jetzt in der SB posten';
    taskTexts[5] = 'Jetzt im Supermarkt Getränke kaufen.';
    taskTexts[6] = 'Jetzt einen Begleiterkampf aktivieren';
    taskTexts[7] = 'Jetzt einmal 100% sauber werden';
    taskTexts[8] = 'Geld in deine Bandenkasse einzahlen';
    taskTexts[9] = 'Plunder in die Plunderbank deiner Bande einzahlen';
    taskTexts[10] = 'Eine Begleiterweiterbildung starten';
    taskTexts[11] = 'Einen Plunder basteln';
    taskTexts[12] = 'Jetzt einen kleinen Snack essen';
    taskTexts[13] = 'Promillepegel über 2‰';
    taskTexts[14] = 'Einmal ' + flaschentxt + 'sammeln starten';
    taskTexts[15] = 'Jetzt ' + flaschentxt + ' verkaufen';
    taskTexts[16] = 'Jetzt Plunder verkaufen';
    if (TOWNEXTENSION == 'SY' || TOWNEXTENSION == 'ML' || TOWNEXTENSION == 'VT' || TOWNEXTENSION == 'AT')
        taskTexts[17] = 'Jetzt das Gebiet wechseln.';
    else
        taskTexts[17] = 'Jetzt den Stadtteil wechseln.';
    taskTexts[18] = 'Jetzt eine Waffe verkaufen.';
    taskTexts[19] = 'Jetzt einem anderen Penner spenden.';
    if (TOWNEXTENSION == 'SY' || TOWNEXTENSION == 'ML')
        taskTexts[20] = 'Jetzt Distel kaufen.';
    else if (TOWNEXTENSION == 'VT')
        taskTexts[20] = 'Jetzt Weihrauch kaufen.';
    else if (TOWNEXTENSION == 'AT')
        taskTexts[20] = 'Jetzt Kieselsteine kaufen.';
    else
        taskTexts[20] = 'Jetzt Zahnstocher kaufen.';
    taskTexts[21] = 'Tierische Weihnachten';
    taskTexts[22] = 'Einkaufen in letzter Sekunde';
    GM_xmlhttpRequest({method: 'GET', url: prothost + '/daily/', onload: function(responseDetails) {
                var content = responseDetails.responseText;
                // Wenn die Seite abgerufen werden konnte (kein Seitenladefehler)
                if (content.indexOf("<strong>Mein Penner</strong>") != -1) {
                    var task = content.split('min-height:40px;">')[1];
                    if (task.indexOf("<strong>") != -1) {
                        task = task.split('<strong>')[1].split('</strong>')[0];
                        PG_log ("Aufgabe: " + task);
                        doDailyTask(taskTexts.indexOf(task));
                    }
                    else {
                        PGu_setValue("dailyTaskDone", tagesdatum);
                        PGu_setValue("losemiss_wait", 0);
                        PGu_setValue("craftindex", 0);
                        if (PGu_getValue("AutoCrimePicMerk", "") != "") {
                            PGu_setValue("AutoCrimePic", PGu_getValue("AutoCrimePicMerk", ""));
                            PGu_setValue("AutoCrimePicMerk", "");
                        }
                    }
                }
    }});
    return;
}

function HttpPost(src, fname, vals, fkt) {
    if (isNaN(fname)) {
        var pos = src.indexOf('name="'+fname);
        if (pos == -1)
            pos = src.indexOf('id="'+fname);
        if (pos == -1)
            return;
        pos = src.lastIndexOf("<form", pos);
    }
    else {
        var fnum = Number(fname);
        var pos = -1;
        for (var i = 1; i <= fnum; i++) {
            pos = src.indexOf("<form", pos+1);
            if (pos == -1)
                return;
        }
    }
    var form = src.substr(pos).split("</form");
    while (form[0].lastIndexOf("<form") != 0) {
        form[0] = form[0].substr(0, form[0].lastIndexOf("<form")) + form[1].substr(1);
        form.splice(1, 1);
    }

    var addr = form[0].split('action="')[1].split('"')[0];
    if (addr == "")
        addr = "/" + src.substr(pos).split("setupForm('/")[1].split("'")[0];
    if (addr.startsWith("/"))
        addr = prothost + addr;
    var inputs = form[0].replace(/<select/g, "<input").split("<input");
    var data = "";
    for (var i = 1; i < inputs.length; i++) {
        var name = inputs[i].split('name="');
        if (name.length > 1)
            name = name[1].split('"')[0];
        else
            continue;
        var value = "";
        for (var j = 0; j < vals.length; j+=2)
            if (vals[j] == name)
                break;
        if (j < vals.length) {
            value = vals[j+1];
            vals.splice(j, 2);
        }
        else {
            if (inputs[i].indexOf("<option") != -1) {
                value = document.getElementsByName(name)[0].value;
            }
            else {
                value = inputs[i].split('value="');
                if (value.length > 1)
                    value = value[1].split('"')[0];
                else {
                    continue;
                }
            }
        }
        data += "&" + name + "=" + value;
    }
    var predata = "";
    for (var j = 0; j < vals.length; j+=2)
        predata += "&" + vals[j] + "=" + vals[j+1];
    data = predata + data;
    trace("Post: " + addr + "?" + data.substr(1), 2);
    GM_xmlhttpRequest({method: 'POST',
                       url: addr,
                       headers: {'Content-type': 'application/x-www-form-urlencoded'},
                       data: encodeURI(data.substr(1)),
                       onload: function(responseDetails) {
                            fkt(responseDetails);
                       }
    });
}

function getOverviewPage(callfkt, par1, par2) {
    function getOverviewData() {
        trace("GetOverviewData", 8);
        myATT = overviewcontent.split('class="att"')[1].split("<")[0].split(">")[1];
        myDEF = overviewcontent.split('class="def"')[1].split("<")[0].split(">")[1];
        getTimers();
        if (expertMode && PGu_getValue("downfightauto", false) && getSeks(counter) + getSeks(fcounter) < 60)
            updDFList();
        var fass = overviewcontent.split('class="first"')[1].split("Fassungsverm")[1].match(/[\d.,]+/);
        maxFass = Number(fass[0].replace(/[.,]/g,'')) / 100;
        if (overviewcontent.indexOf("Ende der Runde") != -1) {
            var rende = getSeks(overviewcontent.split("Ende der Runde")[1].split("</strong")[0].split(">").pop());
            var today = new Date();
            rende = rende * 1000 + today.getTime() + 60000;
            rende = rende - rende % 3600000;
            var rundenende = Number(PG_getValue("rundenende", "0"));
            if (rende != rundenende) {
                if (rundenende > 0 && today.getTime() > rundenende)
                    PG_setValue("lastrestart", (rundenende + 30 * 3600000).toString());
                PG_setValue("rundenende", rende.toString());
            }
        }
        var today = new Date();
        var tagesdatum = FormatDate(today);
        var icons = overviewcontent.split('class="icons"');
        for (var i = 0; i < icons.length; i++)
            if (icons[i].indexOf("tagesaufgabe") != -1) {
                if (icons[i].split("</tr>")[0].split("<a ")[0].trim().endsWith("<!--"))
                    PGu_setValue("dailyTaskDone", tagesdatum);
                else
                    PGu_delete("dailyTaskDone");
                break;
            }
        if (i >= icons.length) {
            var lis = overviewcontent.split('id="summary"')[1].split('class="status"')[1].split('class="settings"')[0].split("<li>");
            if (lis[lis.length-1].indexOf("korkenhaken") == -1)
                PGu_delete("dailyTaskDone");
            else
                PGu_setValue("dailyTaskDone", tagesdatum);
        }
        return;
    }

    trace("GetOverviewPage", 8);
    if (overviewcontent == "" && window.location.pathname.endsWith("/overview/") && document.getElementById("wrap")) {
        overviewcontent = document.getElementById("wrap").innerHTML;
        getOverviewData();
    }

    if (overviewcontent != "") {
        trace("GetOverviewPage: " + (callfkt != undefined?"callfkt":"return"), 8);
        if (callfkt != undefined)
            callfkt(par1, par2);
        return;
    }

    trace("GetOverviewPage: get overview page", 8);
    GM_xmlhttpRequest({method:"GET", url: prothost + '/overview/', onload:function(responseDetails) {
        // Wenn die Übersichtsseite abgerufen werden konnte (kein Seitenladefehler)
        if (responseDetails.responseText.indexOf('id="wrap"') != -1) {
            // Content der Übersichtsseite speichern
            overviewcontent = responseDetails.responseText.split('id="wrap')[1];
            getOverviewData();
            trace("GetOverviewPage: " + (callfkt != undefined?"callfkt2":"return"), 8);
            if (callfkt != undefined)
                callfkt();
            return;
        }
        setTimeout(getOverviewPage, 500);
    }});
}
function checksum(s, trenn)
{
  var chk = 0;
  var m = 1;
  var t = trenn.charCodeAt(0);
  for (var j = 0; j < s.length; j++) {
      for (var i = 0; i < s[j].length; i++) {
          chk += s[j].charCodeAt(i) * m;
          m++;
      }
      chk += t * m;
      m++;
  }

  return chk.toString();
}

function exportVars(expert, quiet) {
    trace("exportVars", 1);
    var vars = ["Script", THISSCRIPTNAME];
    var gm_vars = GM_listValues().sort();
    var deleted = 0;
    var count = 0;
    for (var i = 0; i < gm_vars.length; i++) {
        if (gm_vars.indexOf(gm_vars[i]) < i)
            continue;
        if (gm_vars[i] == "" || gm_vars[i].match(new RegExp(/[^\d]0$/)) || gm_vars[i].match(new RegExp(/[\r\f\n\t<>\"\']/))) {
            GM_deleteValue(gm_vars[i]);
            deleted++;
        }
        else {
            if (gm_vars[i].length > 50) {
                if (expert && !quiet)
                    var conf = confirm("Variable löschen: " + gm_vars[i]);
                else
                    var conf = true;
                if (conf) {
                    GM_deleteValue(gm_vars[i]);
                    deleted++;
                    continue;
                }
            }
            var val = GM_getValue(gm_vars[i], "xyzundefinedzyx");
            if (val == "xyzundefinedzyx" || val == null)
                continue;
            if (typeof(val) == "number")
                val = "N" + val;
            else if (typeof(val) == "boolean")
                val = "B" + (val?1:0);
            else if (typeof(val) == "string") {
                if (val.indexOf("§") != -1) {
                    if (expert && !quiet)
                        alert("Trennzeichen in " + gm_vars[i]);
                    break;
                }
                val = "S" + val.replace(String.fromCharCode(0), "");
            }
            else {
                if (expert && !quiet)
                    alert(gm_vars[i] + " vom Typ " + typeof(val) + ": " + val);
                break;
            }
            vars.push(gm_vars[i]);
            vars.push(val);
            count++;
        }
    }
    if (i < gm_vars.length)
        if (quiet)
            GM_setClipboard("Fehler!!");
        else
            alert('Export wegen Fehler abgebrochen');
    else {
        vars.push(checksum(vars, "§"));
        GM_setClipboard(vars.join("§"));
        if (!quiet)
            if (deleted > 0)
                alert (count + " Variablen in Zwischenablage exportiert, " + deleted + " Variablen gelöscht.");
            else
                alert (count + " Variablen in Zwischenablage exportiert");
    }
    return;
}

// Die eigentliche Funktion
function doTheAction () {
    if (document.getElementsByClassName('zleft profile-data').length > 0)
        oldVersion = 0;
    if (GM_getValue(host + "_pwsitting", "x") == "")
        GM_deleteValue(host + "_pwsitting");

    var refrInt = 10;
    var languages = ["bl_DE", "mu_DE", "kl_DE", "de_DE", "hr_DE", "s6_DE", "s7_DE", "sy_DE",
                     "ml_DE", "vt_DE", "at_DE", "us_EN", "kr_PL", "pl_PL", "wr_PL", "ma_FR",
                     "fr_FR", "cr_FR", "ba_ES", "es_ES", "er_ES", "sp_BR", "pt_BR", "ru_RU", "en_EN"];
    var townext = ['B', 'MU', 'K', 'HH', 'HR', 'OP', 'ATH', 'SY',
                   'ML', 'VT', 'AT', 'NY', 'KR', 'WA', 'WA', 'MS',
                   'PA', 'PA', 'BA', 'MD', 'MD', 'SP', 'RJ', 'MO', 'LO'];
    var indx = languages.indexOf(language);
    if (indx >= 0)
        TOWNEXTENSION = townext[indx];
    if (TOWNEXTENSION == "AT") {
        refrInt = 5;
        pflaschen = "Perlen";
        flaschentxt = "Perlen";
        crimetxt = "Sabotage";
    }
    else if (TOWNEXTENSION == "VT")
        crimetxt = "Sünde";

    PGu_setValue("RefreshInterval", refrInt);
    trace("DoTheAction: " + m_ownuserid + "/" + TOWNEXTENSION + "/" + refrInt, 2);

    /*-*/
    if (GM_getValue(host + "_autologin", "xxx") == "xxx") {
        GM_setValue(host + "_autologin", GM_getValue("www." + host + "_autologin", false));
        GM_setValue(host + "_username", GM_getValue("www." + host + "_username", ""));
        GM_setValue(host + "_password", GM_getValue("www." + host + "_password", ""));
        GM_deleteValue("www." + host + "_autologin");
        GM_deleteValue("www." + host + "_username");
        GM_deleteValue("www." + host + "_password");
        GM_deleteValue("change." + host + "_autologin");
        GM_deleteValue("change." + host + "_username");
        GM_deleteValue("change." + host + "_password");
    }

    var login = document.getElementById("loginform");
    if (login) {
        login.addEventListener('submit', function(event) {
                 var input = document.getElementById("loginform").getElementsByTagName("input");
                 for (var i = 0; i < input.length; i++) {
                     if (input[i].name == "username" || input[i].name == "password" && GM_getValue(host + "_pwsitting", "") == "")
                         GM_setValue(host + "_" + input[i].name, input[i].value);
                 }
                 GM_setValue(host + "_autologin", true);
                 return true;
            }, false);
    }

    var myprof = document.getElementById("my-profile-new");
    if (!myprof)
        myprof = document.getElementById("my-profile");
    if (!myprof) {
        function doLogin() {

            var login = document.getElementById("loginform");
            var input = login.getElementsByTagName("input");
            var i = input.length - 1;
            if (GM_getValue(host + "_username", "") != "" && (GM_getValue(host + "_password", "") != "" || GM_getValue(host + "_pwsitting", "") != "")) {
                document.getElementById("login_username").value = GM_getValue(host + "_username", "");
                if (GM_getValue(host + "_pwsitting", "x") == "x")
                    document.getElementById("password").value = GM_getValue(host + "_password", "");
                else {
                    document.getElementById("password").value = GM_getValue(host + "_pwsitting", "");
                    GM_setValue(host + "_pwsitting", "x");
                }
                input[i].click();
            }
            else if (document.getElementById("login_username").value != "" &&
                document.getElementById("password").value != "") {
                input[i].click();
            }
        }
        var user = document.getElementById("login_username");
 /*       if (user) {
            var chb = document.createElement("input");
            chb.type="checkbox";
            chb.id="autologin";
            chb.title="Auto-Login";
            user.parentNode.appendChild(chb, user);
            document.getElementById("autologin").checked = GM_getValue(host + "_autologin", false);
            // Click-Handler hinzufügen
            document.getElementById("autologin").addEventListener("click", function(event) {
                // Klickstatus speichern
                GM_setValue(host + "_autologin", this.checked);
            }, false);
        }*/
        if (GM_getValue(host + "_pwsitting", "") != "") {
            if (GM_getValue(host + "_pwsitting", "") == "x")
                GM_deleteValue(host + "_pwsitting");
            window.setTimeout(doLogin, 2000);
        }
        else if (GM_getValue(host + "_autologin", false))
            window.setTimeout(doLogin, 10000);
        return;
    }
    else if (myprof.getElementsByTagName("form").length > 0) {
        var input = myprof.getElementsByTagName("input");
        if (input.length > 0) {
            myprof.getElementsByTagName("form")[0].addEventListener('mouseup', function(event) {
                GM_setValue(host + "_autologin", false);
            }, false);
        }
    }
    var mobBut = document.getElementById("mobile_button");
    if (mobBut)
        if (mobBut.innerHTML == "Logout") {
            mobBut.getElementsByTagName("form")[0].addEventListener('mouseup', function(event) {
                GM_setValue(host + "_autologin", false);
            }, false);
        }

    // ***********************************************************************************************
    // ***********************************************************************************************
    // -------- Start of program--------------
    // ***********************************************************************************************
    // ***********************************************************************************************

    trace("Start", 8);
    if (document.getElementById("ntext")) {
        var menge = document.getElementById("ntext").innerHTML.split("<p>")[1].split("<")[0];
        var pos = menge.indexOf(" gefunden");
        if (pos != -1) {
            var pos2 = menge.lastIndexOf(" ", pos-1) + 1;
            trace(menge.substr(pos2, pos-pos2) + " gefunden: " + menge.match(/\d+/) + "/" + menge, 1);
        }
        else {
            pos = menge.indexOf("suche gegangen");
            if (pos != -1) {
                var pos2 = menge.lastIndexOf(" ", pos) + 1;
                trace(menge.substr(pos2, pos-pos2) + "suche gestartet: " + menge.match(/[\d.,]+/) + " Minuten" + "/" + menge, 1);
            }
        }
    }

    if(window.location.pathname.indexOf("/emergency/") != -1){
        if (GetMoney(document) >= 1000)
            document.getElementById("submitForm1").click();
        return;
    }
    getOverviewPage(mainFunc1);
}

function mainFunc1() {
    trace("mainFunc1", 8);
    m_ownuserid = getOwnUserID();
    if (document.getElementsByClassName('zleft profile-data')[0].getElementsByClassName("user_name").length > 0)
        m_ownusername = document.getElementsByClassName('zleft profile-data')[0].getElementsByClassName("user_name")[0].innerHTML;
    else
        m_ownusername = document.getElementsByClassName('zleft profile-data')[0].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerHTML;

    var today = new Date();
    var tagesdatum = FormatDate(today);
        //    GM_deleteValue(host + "_pwsitting");

    if(window.location.pathname.endsWith("/overview/")){
        if (document.getElementsByClassName('zleft profile-data')[0].innerHTML.indexOf('Sittingmodus') != -1) {
            trace("Sittingmodus !!!!", 1);
            if (PGu_getValue("dailyTaskDone", "") != tagesdatum) {
                var lis = document.getElementById("summary").getElementsByClassName("status")[0].getElementsByTagName("li");
                if (lis.length == 8)
                    lis[lis.length-1].getElementsByTagName("a")[0].click();
                else
                    document.getElementById("summary").parentNode.parentNode.parentNode.getElementsByTagName("h4")[1].parentNode.getElementsByTagName("a")[0].click();
            }
            else {
                if (GM_getValue(host + "_pwsitting", "x") != "x")
                    GM_setValue(host + "_pwsitting", "x");
                trace("Ausloggen aus Sittingmodus !!!!", 1);
                doLogout();
            }
            return;
        }
        else if (GM_getValue(host + "_pwsitting", "x") != "x") {
            tryDaily = PGu_getValue("tryDailyTask", ";0").split(";");
            if (tryDaily[0] != tagesdatum) {
                var tries = 0;
                PGu_delete("tryDailyTask");
            }
            else
                var tries = Number(tryDaily[1]);
            if (tryDaily[0] == tagesdatum && (tries >= 5 && today.getHours() < 23 || tries >= 10 && today.getHours() >= 23)) {
                GM_deleteValue(host + "_pwsitting");
                GM_deleteValue(host + "_pwsitting_count");
            }
            else if (GM_getValue(host + "_pwsitting_count", 0) <= 5) {
                GM_setValue(host + "_pwsitting_count", GM_getValue(host + "_pwsitting_count", 0) + 1);
                trace("Ausloggen für Sittingmodus !!!!", 1);
                incrDailyTry(tagesdatum, tries);
                doLogout();
                return;
            }
            else {
                GM_deleteValue(host + "_pwsitting");
                GM_deleteValue(host + "_pwsitting_count");
            }
        }
        else {
            GM_deleteValue(host + "_pwsitting");
            GM_deleteValue(host + "_pwsitting_count");
        }
    }

    if (window.location.href.endsWith("/fight/?to=" + PGu_getValue("nextDF", "")) && PGu_getValue("lastDF", "") != PGu_getValue("nextDF")) {
        PGu_setValue("lastDF", PGu_getValue("nextDF", ""));
        PGu_setValue("DFstarted", true);
        trace("Starte Downfightangriff auf " + PGu_getValue("nextDF", ""), 2);
        document.getElementsByName("Submit2")[0].click();
        return;
    }

    if (expertMode)
        GM_registerMenuCommand(THISSCRIPTNAME + ": Zeit für Variablenexport festlegen", function (event) {
            var days = prompt("Tage: ", GM_getValue("exportDays", "")).replace(/[^\d]/g, ",");
            if (days == null)
                return;
            if (days == "")
                GM_deleteValue("exportDays");
            else {
                var dayarr = days.split(",");
                for (var i = 0; i < dayarr.length; i++)
                    if (isNaN(dayarr[i]) || Number(dayarr[i]) < 1 || Number(dayarr[i]) > 7) {
                        alert("Bitte nur Zahlen von 1 (Mo) bis 7 (So) eingeben!!");
                        return;
                    }
                GM_setValue("exportDays", days);
            }
            var times = prompt("Zeiten: ", GM_getValue("exportTimes", "")).replace(/[^\d]/g, ",");
            if (times == null)
                return;
            if (times == "")
                GM_deleteValue("exportTimes");
            else {
                var timarr = times.split(",");
                for (var i = 0; i < timarr.length; i++)
                    if (isNaN(timarr[i]) || Number(timarr[i]) < 0 || Number(timarr[i]) > 23) {
                        alert("Bitte nur Zahlen von 0 bis 23 eingeben!!");
                        return;
                    }
                GM_setValue("exportTimes", times);
            }
        });

    GM_registerMenuCommand(THISSCRIPTNAME + ": alle Einstellungen exportieren", function (event) {
        exportVars(expertMode, false);
    });

    GM_registerMenuCommand(THISSCRIPTNAME + ": alle Einstellungen importieren", function (event) {
        var vars = prompt("Eingabe: ");
        var gmvars = vars.split("§");
        if (gmvars[0] != "Script" || gmvars[1] != THISSCRIPTNAME) {
            alert("Eingabe ungültig!!");
            return;
        }
        var chksum = gmvars.pop();
        if (chksum != checksum(gmvars, "§")) {
            alert("Importstring ist fehlerhaft. Kein Import möglich.");
            return;
        }

        var gm_vars = GM_listValues();
        for (var i = 0; i < gm_vars.length; i++)
            GM_deleteValue(gm_vars[i]);
        var count = 0;
        for (var i = 2; i < gmvars.length; i+=2) {
            var val = gmvars[i+1];
            if (val.substr(0, 1) == "N")
                val = Number(val.substr(1));
            else if (val.substr(0, 1) == "B")
                val = val.substr(1) == "1";
            else if (val.substr(0, 1) == "S")
                val = val.substr(1);
            else {
                alert("Fehler bei " + gmvars[i] + ": " + val);
                continue;
            }
            GM_setValue(gmvars[i], val);
            count++;
        }
        alert(count + " Variablen importiert.");
        return;
    });

    if (typeof(Storage) !== "undefined") {
        GM_registerMenuCommand(THISSCRIPTNAME + ": Einstellungen sichern", function (event) {
            var c = true;
            var savetime = Number(PG_getValue("saveTime", "0"));
            if (savetime != 0)
                c = confirm("Sollen die Einstellungen vom " + FormatDateTime(new Date(savetime)) + " überschrieben werden ?");
            if (c) {
                var time = String(today.getTime());
                PG_setValue("saveTime", time);
                var vars = [];
                var gm_vars = [];
                var gm_vars = GM_listValues();
                for (var i = 0; i < gm_vars.length; i++)
                    if (gm_vars[i].startsWith(TOWNEXTENSION))
                        vars.push(gm_vars[i]);
                for (var i = 0; i < vars.length; i++)
                    localStorage.setItem(vars[i], GM_getValue(vars[i]));
                alert ("Es wurden " + vars.length + " Werte gesichert.");
            }
        });
        var savetime = Number(PG_getValue("saveTime", "0"));
        if (savetime != 0) {
            GM_registerMenuCommand(THISSCRIPTNAME + ": Einstellungen wiederherstellen", function () {
                var savetime = Number(PG_getValue("saveTime", "0"));
                var now = (new Date(savetime));
                if (confirm("Sollen die Einstellungen vom " + FormatDateTime(now) + " wiederhergestellt werden ?")) {
                    alert('Das dauert ein bisschen. Falls die Meldung "Nicht antwortendes Skript" angezeigt wird, bitte auf "Weiter ausführen" klicken');
                    var vars = [];
                    var gm_vars = [];
                    for (var i = 0; i < localStorage.length; i++)
                        if (localStorage.key(i).startsWith(TOWNEXTENSION))
                            vars.push(localStorage.key(i));
                    for (var i = 0; i < vars.length; i++)
                        GM_setValue(vars[i], localStorage.getItem(vars[i]));
                    alert ("Es wurden " + vars.length + " Werte wiederhergestellt.");
                }
            });
        }
    }

    var maxfill = PGu_getValue("maxfillbottle", 90);
    trace("maxfill = " + maxfill, 2);
    if ((PGu_getValue("minMoney", 0) > 0 || maxfill > 0) && PGu_getValue("bottleprice", 0) > 0) {
        var price = Number(document.getElementsByClassName("icon bottle")[0].innerHTML.split(">")[1].match(/\d+/));
        if (price >= PGu_getValue("bottleprice", 0))
            getOverviewPage(mainFunc2, maxfill, price);
    }

    trace("moneyOver = " + PGu_getValue("moneyOver", false), 2);
    if (PGu_getValue("moneyOver", false) && PGu_getValue("maxMoney", -1) > 0 && PGu_getValue("maxMoneyPayIn", -1) > 0) {
        var minMoney = 0;
        if (PGu_getValue("minmoneychb", false))
            minMoney = PGu_getValue("minMoney", 0);
        var maxMoney = PGu_getValue("maxMoney", -1);
        var payIn = PGu_getValue("maxMoneyPayIn", -1);
        var money = GetMoney(document);
        if (money > maxMoney && money - payIn >= minMoney) {
            gangCredit(payIn, payIn);
        }
    }

    var today = new Date();
    var now = Math.floor(today.getTime()/1000);
    CheckForUpdate(now, 86400);
    var day = today.getDay();
    var hour = today.getHours();

    if (expertMode)
        if (GM_getValue("exportDays", "").split(",").indexOf(((day+6) % 7 + 1).toString()) != -1 &&
            GM_getValue("exportTimes", "").split(",").indexOf(((hour+1) % 24).toString()) != -1 && today.getMinutes() >= 50)
                CheckForExport(now, 1000);

    if (PGu_getValue("autoBuyNextHome", false))
        CheckHomeBuy();

    CheckSalary();

    CheckMinigame();

    CheckEnemygame();

    CheckMission();

    var eatDrink = PGu_getValue("eatDrink", "").toString();
    if (eatDrink != "") {
        var eatDrinkArr = eatDrink.split(",");
        eatDrink = Number(eatDrinkArr[0]);
        eatDrinkArr.splice(0, 1);
        PGu_setValue("eatDrink", eatDrinkArr.join(","));
        doEatDrink(eatDrink<0?2:1, eatDrink<0?-eatDrink:eatDrink);
    }

    if(window.location.pathname.endsWith("/daily/"))
        window.setTimeout(CheckDaily, 5000);
    else
        CheckDaily();

    CheckGhosts();

    CheckPlunder();

    /*    var keys = GM_listValues();
        for (var i = 0; i < keys.length; i++) {
            var val = keys[i];
            if (val.indexOf("ErrorCounter") != -1 && GM_getValue(val, "").length > 10) {
                if (window.confirm(val + "(" + GM_getValue(val, "") + ") löschen ?"))
                    GM_deleteValue(val);
            }
            else if (val.indexOf("undefined") != -1 || val.indexOf("ErrorCounter") != -1)
                if (window.confirm(val + " löschen ?"))
                    GM_deleteValue(val);
        }
    */

    if (PGu_getValue(nameLastCollectTime, -1) == -1) {
        var keys = GM_listValues();
        for (var i = 0; i < keys.length; i++) {
            var val = keys[i];
            if (val.indexOf("-") != -1 || val.indexOf("pennersturm") != -1)
                GM_deleteValue(val);
        }
        PGu_setValue(nameLastCollectTime, 0);
    }

    if (PGu_getValue("AutoPetCollect", false)) {
        var cDay = PGu_getValue("AutoPetCollectDay", "0000000");
        if (cDay.length < 7)
            cDay += "0000000".substr(cDay.length - 7);
        var cBeg = PGu_getValue("AutoPetCollectBegH", 11);
        var cEnd = PGu_getValue("AutoPetCollectEndH", 12);
        if (cDay[day] == "1" &&
           ((cBeg < cEnd && hour >= cBeg && hour <= cEnd) ||
            (cBeg >= cEnd && (hour >= cBeg || hour < cEnd))))
            DoPetCollect();
    }

    if(window.location.pathname.indexOf("/activities/crime/") != -1){
        var buttons = document.getElementsByClassName("button_area");
        for (var i = 0; i < buttons.length; i++)
            insertCheckBox3(buttons[i], i);
    }
    else if(window.location.pathname.indexOf("/activities/") != -1){
        function insertBoxes (mode) {
            PG_log("insertBoxes");
            var loaded = (missionContent != "");
            if (mode == 0) {
                var timeOptions = document.getElementsByName("time")[0];
                timeOptions.selectedIndex = PGu_getValue(nameLastCollectTime,0);
                insertCheckBox(0, loaded);
                insertCheckBox2();
            }
            else if (loaded)
                insertCheckBox(1, loaded);

            if (!loaded) {
                PG_log("wait ...");
                window.setTimeout(insertBoxes, 500, 1);
            }
        }
        insertBoxes(0);
    }
    else if(window.location.pathname.indexOf("/overview/") != -1){
        insertCheckBox4();
        CheckPresent(document.getElementById("content").innerHTML);
    }
    else if(window.location.pathname.endsWith("/daily/")){
        insertCheckBox5();
    }
    else if(window.location.pathname.endsWith("/missions/")){
        // GM_setValue("showMissCtrl", 1);
        insertCheckBox6(GM_getValue("showMissCtrl", 0));
    }
    else if(window.location.pathname.endsWith("/gang/credit/")){
        insertCheckBox7();
    }
    else if(window.location.pathname.endsWith("/stock/bottle/")){
        insertCheckBox8();
    }
    else if(window.location.pathname.endsWith("/gang/upgrades/")){
        insertCheckBox9();
    }
    else if(window.location.pathname.endsWith("/event/xmas15/")){
        insertCheckBox10();
    }
    else if(window.location.pathname.endsWith("/livegame/")){
        // GM_setValue("doLiveGame", 1);
        if (GM_getValue("doLiveGame", 0) == 1)
            DoLiveGame(2);
    }
    else if(window.location.pathname.endsWith("/livegame/bb/") && PGu_getValue("junkfound", "") != ""){
        insertCheckBox11();
    }
    else if(window.location.pathname.endsWith("/event/oktober15/"))
        insertCheckBox12("Brezn");
    else if(window.location.pathname.endsWith("/city/plundershop/"))
        insertCheckBox13();
    else if(window.location.pathname.endsWith("/event/halloween15/"))
        insertCheckBox14();
    else if(window.location.pathname.endsWith("/fight/"))
        insertCheckBox15();

    var wap = (PGu_getValue("WutActivePlunder", 0) + ";").split(";");
    var wip = (PGu_getValue("WutInactivePlunder", 0) + ";").split(";");
    var wwap = (PGu_getValue("WiWuActivePlunder", 0) + ";").split(";");
    var wwip = (PGu_getValue("WiWuInactivePlunder", 0) + ";").split(";");

    if ((Number(wap[0]) + Number(wip[0]) + Number(wwap[0]) + Number(wwip[0]) > 0 && PGu_getValue("aktPlunder", "") == "" && GetPromille(document) < 0.8) || PGu_getValue("DFstarted", false))
        getOverviewPage(mainFunc3);

    if (fcounter == done && counter == done || PGu_getValue("AutoCrime", false) && PGu_getValue("AutoCrimeFkt", 0) > 0 && counter == done) {
        PGu_setValue(nameTime, time);
        PGu_setValue("AskedForCollect", 0);
        checkInterval = window.setInterval(check,intervalTime);
        submit();
    }
    else {
        var lastURL = PGu_getValue("AutoCollURL", "");
        if (lastURL != "") {
            PGu_setValue ("AutoCollURL", "");
            window.location.replace( lastURL );
        }
        else {
            PGu_setValue(nameTime, time);
            PGu_setValue("AskedForCollect", 0);
            checkInterval = window.setInterval(check,intervalTime);
        }
    }

    if (fcounter != done || counter != done || !autoSubmit || !PGu_getValue("AutoCollect", false) && !(PGu_getValue("AutoCrime", false) && PGu_getValue("AutoCrimeFkt", 0) > 0)) {
        CheckNewMinigame();
        if (PGu_getValue("AutoPet", false))
            DoPetCheck(true);
    }
}

function mainFunc2(maxfill, bottle)
{
    trace("mainFunc2", 8);
    var fass = overviewcontent.split("Fassungsverm");
    if (fass.length > 2)
        fass = Number(fass[2].match(/[\d.,]+/));
    else
        fass = 0;
    var mon = overviewcontent.split('class="icon money"')[1].split("</a>")[0];
    var money = Number(mon.split(">").pop().match(/[\d,.]+/)[0].replace(/[.,]/g, ''));
    var maxfill = PGu_getValue("maxfillbottle", 90);
    if (money < maxFass*100 && (money/100 < PGu_getValue("minMoney", 0) || maxfill > 0)) {
        trace('Get ' + prothost + '/stock/bottle/', 2);
        GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/bottle/', onload:function(responseDetails) {
            var content = responseDetails.responseText;
            var maxmenge = Math.floor((maxFass*100 - money)/price) + 1;
            var menge = Number(content.split('id="max"')[1].split('value="')[1].split('"')[0]);
            if (maxfill > 0 && fass > 0 && menge > fass * maxfill / 100)
                var minmenge = Math.floor(menge - fass * maxfill / 100);
            else
                var minmenge = 0;
            if (money/100 < PGu_getValue("minMoney", 0))
                minmenge = Math.max(minmenge, Math.floor((PGu_getValue("minMoney", 0)*100 - money)/price) + 1);
            if (minmenge > 0) {
                menge = Math.min(minmenge, maxmenge);
                sellBottles(menge, price, content);
            }
        }});
    }
}

function mainFunc3()
{
    trace("mainFunc3", 8);
    pos = overviewcontent.search("Angelegte Plunder");
    if (pos <= 0)
        return;
    var table = overviewcontent.substr(pos).split("<table")[1].split("</table>")[0];
    var tabs = table.split("<tr")[2].split("<td");
    var plname = tabs[1].split("</strong>")[0].split(">").pop();
    trace('Get ' + prothost + '/gang/upgrades/', 2);
    GM_xmlhttpRequest({method:"GET", url: prothost + '/gang/upgrades/', onload:function(responseDetails) {
        var content = responseDetails.responseText;
        var divs = content.split("<table")[1].split("</table")[0].split("<tr ")[2].split("<div");
        var aktion = divs[divs.length-1].split('type="submit"')[1].split('value="')[1].split('"')[0];
        if (aktion == "Upgrade")
            return;
        if (aktion == "Wechsel") {
            aktion = divs[divs.length-2].split('type="submit"')[1].split('value="')[1].split('"')[0];
            var upgr = "Wut";
        }
        else
            var upgr = "WiWu";
        if (aktion == "Aktiv")
            aktion = "Active";
        else
            aktion = "Inactive";
        if (fcounter == done && PGu_getValue("DFstarted", false))
            PGu_delete("DFstarted");
        else if (fcounter != done && upgr+aktion == "WutInactive") {
            if (PGu_getValue("DFstarted", false)) {
                var pltab = 4;
                if (TOWNEXTENSION == "HH" || TOWNEXTENSION == "B" || TOWNEXTENSION == "MU")
                    pltab = 3;
                GM_xmlhttpRequest({method:"GET", url: prothost + '/stock/plunder/ajax/?c='+pltab, onload:function(responseDetails) {
                    var content = responseDetails.responseText;
                    var tdpm = content.indexOf('id="pm_'+PGu_getValue("dfPlunder", "")+'"');
                    if (tdpm != -1) {
                        var href = content.substr(tdpm).split('<a href="')[3].split('"')[0];
                        if (href.substr(0,4) == "java") {
                            var pos = content.lastIndexOf("<strong", tdpm);
                            var pname = content.substr(pos).split("</strong")[0].split(">").pop().trim();
                            var effect = content.substr(pos).split('class="pinfo2"')[1].split("</p>")[0].split(">").pop().trim();
                            var prozp = effect.indexOf("%");
                            if (prozp == -1) {
                                var p = effect.indexOf("Minute");
                                if (p != -1) {
                                    effect = effect.match(/[^ ]+ [^ ]+ Minute[n]*/)[0].replace(/folgenden |nächsten |auf /, "").replace("zwei", 2).trim();
                                    var spar = parseInt(effect) * 60;
                                    trace("Ersparnis durch Plunder: " + spar + " Sekunden; fcounter = " + fcounter, 2);
                                    if (spar >= getSeks(fcounter)) {
                                        PGu_delete("DFstarted");
                                        return;
                                    }
                                }
                            }
                            var anz = content.substr(pos).split("</span")[0].split(">x ")[1].trim();
                            trace("Plunder " + pname + " wird benutzt (noch " + anz + ")", 2);
                            PGu_delete("DFstarted");
                            HttpPost(content.substr(tdpm), "use_stuff_no_buff", [], function() {
                                reload("DFPlunder", "/fight/");
                            });
                        }
                    }
                    else
                        PGu_setValue("dfUsePlunder", false);
                }});
            }
            return;        // bei laufendem Kampf kein Plunderwechsel
        }
        var plnd = (PGu_getValue(upgr + aktion + "Plunder", 0) + ";").split(";");
        if (plname == plnd[1] || plnd[0] <= 0)
            return;
        // **********************************************************************************
        // *** GM_XMLHTTPREQUEST *** POSTEN des Plunderwechsels
        // **********************************************************************************
        trace("Post Plunderchange", 2);
        GM_xmlhttpRequest({method: 'POST', url: prothost + '/stock/plunder/change/', headers: {'Content-type': 'application/x-www-form-urlencoded'},
            data: encodeURI('from_f=0&f_plunder=' + plnd[0]),
            onload: function(responseDetails) {
                var content = responseDetails.responseText;
                var pos = content.search("Angelegter Plunder");
                if (pos > 0) {
                    var table = content.substr(pos).split("<table")[1].split("</table>")[0];
                    var tabs = table.split("<tr")[2].split("<td");
                    var plname = tabs[2].split("</strong>")[0].split(">").pop();
                    if (plname != plnd[1])
                        PGu_setValue(upgr + aktion + "Plunder", -1);
                }
                reload("PlunderChange");
            }
        });
    }});
}

function mainFunc4(price, content) {
    trace("mainFunc4", 8);
    var fass = overviewcontent.split('class="first"')[1].split("Fassungsverm")[1].match(/[\d.,]+/);
    var maxmoney = Number(fass[0].replace(/[.,]/g,''));
    var mon = overviewcontent.split('class="icon money"')[1].split("</a>")[0];
    var money = Number(mon.split(">").pop().match(/[\d,.]+/)[0].replace(/[.,]/g, ''));
    var menge = Math.min(menge, Math.floor((maxmoney - money) / price));
    sellBottles(menge, price, content);
}
