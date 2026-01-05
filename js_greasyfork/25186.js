// ==UserScript==
// @name         Proxer Statistics
// @namespace    https://greasyfork.org/de/users/83349-deimos
// @version      1.31
// @description  Zählt die bereits geschauten/gelesenen Animes/Mangas und erlaubt es die Tabellen per Klick zusammenzuklappen bzw. sich mehr Details anzeigen zu lassen.
// @author       Deimos
// @run-at       document-start
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*
// @grant        unsafeWindow
// @history      1.31 Beheben von Cookie Problem, Beheben von nicht erkannten URLs
// @history      1.30 Entferne Userscript Anker, Ergänze Novel, Zähle Medienkategorien dynamisch
// @history      1.2 Script funktioniert auch im User-Control-Panel
// @history      1.1 Einbinden des Userscript Anker von Blue.Reaper
// @history      1.0 Zählen von Anime/Manga, anzeigen von Details, minimieren von Tabellen
// @downloadURL https://update.greasyfork.org/scripts/25186/Proxer%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/25186/Proxer%20Statistics.meta.js
// ==/UserScript==

//############## Initialisierung ####################

var page = 0;
var n_values = 12

//guckt ob Cookie vorhanden ist und korrekted Format hat, ansonsten wird neuer erstellt
var hv_values = checkCookie("hv_values", "v".repeat(n_values));   //v:= visible     h:= hidden
var dn_values = checkCookie("dn_values", "n".repeat(n_values));   //d:= details     n:= no details

//############################# Einbinden des Scripts #############################

//startet das Script beim Laden der Seite und
document.addEventListener('DOMContentLoaded', function(event) {
    waitForKeyElements ("#pageMetaAjax", applyChange, false);
});

function applyChange(){
    var path1 = window.location.pathname.split('/')[3]
    var path2 = window.location.search

    if(path1 == "anime" || path2.substring(0,8) === "?s=anime")  ///User befindet sich auf Anime Verzeichnis
    {
        page = 0;
        tableListener();
    }
    else if(path1 == "manga" || path2.substring(0,8) === "?s=manga") ///User befindet sich auf Manga Verzeichnis
    {
        page = 1;
        tableListener();
    }
    else if(path1 == "novel" || path2.substring(0,8) === "?s=novel") ///User befindet sich auf Novel Verzeichnis
    {
        page = 2;
        tableListener();
    }
}

//############################# Hauptteil #############################

//Ermitteln der Tabellenlänge und setzen der EventListener
function tableListener()
{
    var tables = document.getElementsByTagName("table");

    for(var i = 0; i<tables.length;i++){

        var tr = tables[i].rows;
        var l = 0;

        if(tr[2].getElementsByTagName("td")[0].innerHTML !== "Keine Einträge.")
            l = tr.length - 2;
        var message= ": " + l;

        //Anzahl anzeigen
        tr[0].getElementsByTagName("th")[0].innerHTML+= message;
        tr[0].addEventListener("click",action);
        tr[0].id ="tr"+(i+page*4);

        //Tabellen einklappen
        if(hv_values[i+page*4]=="h")
            hide(tr);

        //Details anzeigen
        if(dn_values[i+page*4]=="d")
            details(tr);
    }
}

//Auswahl ob "hide" oder "details", setzen des neuen Cookies
function action(e)
{
    var tr = this.parentElement.parentElement.rows;
    var xPosition = e.clientX;
    var rect = tr[0].getBoundingClientRect();
    var width = tr[0].offsetWidth;

    if(xPosition<width/2){
        details(tr);
        setCookie("dn_values",dn_values);
    }
    else{
        hide(tr);
        setCookie("hv_values",hv_values);
    }
}

//Anzeigen der genaueren Details der ausgewählten Tabelle
function details(tr)
{
    //Checke ob Einträge vorhanden sind
    if(!tr[2].getElementsByTagName("td")[2]){
        return false
    }

    var id = parseInt(tr[0].id.substring(2));
    var text = tr[0].getElementsByTagName("th")[0].innerHTML;

    //Details werden minimiert
    if(text.includes("<br>")){
        text = text.slice(0,text.indexOf("<br>"));
        tr[0].getElementsByTagName("th")[0].innerHTML = text;

        //Update des Status
        dn_values = dn_values.substring(0,id) + "n" + dn_values.substring(id+1, dn_values.length);  //erstellen eines neuen Cookies
        return true;
    }

    var l = tr.length;
    var content = {}

    //Zähle verschieden Medientypen
    for(var e = 2; e<l; e++){
        var type = tr[e].getElementsByTagName("td")[2].innerHTML;
        if(type in content)
            content[type] +=1
        else
            content[type] =1
    }

    //Anzeigen
    var message= "";
    for(type in content){
        message += "<br> "+type.replace("<br>"," ")+": "+content[type]
    }
    tr[0].getElementsByTagName("th")[0].innerHTML+= message;

    //Update des Status
    dn_values = dn_values.substring(0,id) + "d" + dn_values.substring(id+1, dn_values.length);
}

//Einklappen der ausgewählten Tabelle
function hide(tr)
{
    var id = parseInt(tr[0].id.substring(2));
    var visibility;
    var char;

    if(tr[1].style.display == "none") {
        visibility = "table-row";
        char = "v";
    }
    else{
        visibility = "none";
        char = "h";
    }

    //Update des Status
    hv_values = hv_values.substring(0,id) + char + hv_values.substring(id+1, hv_values.length);

    for(var e = 1; e < tr.length; e++){
        tr[e].style.display = visibility;
    }
}

//############################# Cookies #############################
function checkCookie(cname,ctext)
{
    var cookie = getCookie(cname);
    if (cookie === "" || cookie.length != n_values)
    {
        cookie = ctext;
        setCookie(cname, cookie);
    }
    return cookie;
}
function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue)
{
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Strict;"
}

//############################### Hintergrund Thread #######################################
//Code from: https://github.com/CoeJoder/waitForKeyElements.js
//(Greasy Fork doesn't allow to include this project by "require")

function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes = (typeof selectorOrFunction === "function")
            ? selectorOrFunction()
            : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function() {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}