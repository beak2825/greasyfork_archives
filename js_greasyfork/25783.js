// ==UserScript==
// @name         Proxer Remember
// @namespace    https://greasyfork.org/de/users/83349-deimos
// @version      0.25
// @description  Schnellauswahl für den letzten Manga und Anime
// @author       Deimos
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*        
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/25783/Proxer%20Remember.user.js
// @updateURL https://update.greasyfork.org/scripts/25783/Proxer%20Remember.meta.js
// ==/UserScript==

var typ ="AM"; //A: Animeserie    M: Mangaserie
document.addEventListener('DOMContentLoaded', function(event) {
    var ul = document.getElementById("leftNav");
    var li = document.createElement("li");
    li.setAttribute("class","topmenu");
    li.setAttribute("id","RememberNav");
    li.addEventListener("mouseover",  open);
    ul.appendChild(li);
    document.getElementById("RememberNav").innerHTML = '<a href="javascript:;">Lesezeichen ▾</a><ul id="RememberUl"></ul>';
    addElement("A:","RememberA");
    addElement("M:","RememberM" );
});

function addElement(name,id)
{
    var ul = document.getElementById("RememberUl");
    var element = document.createElement("li");
    element.setAttribute("id",id);
    element.innerHTML = '<a href="javascript:;">'+name+'</a>';
    ul.appendChild(element);
}

function generate_function()
{
    switch(typ)
    {
        case "A":
            return function(){find("Animeserie");}; 
        case "M":
            return function(){find("Mangaserie");};
        case "AM":
            return function(){find("Animeserie");find("Mangaserie"); if(typ !== ""){open(null,2);} typ="FIN";};
        default:
            return false;
    }
}

function open(event,page=1) //öffnet Chronik
{
    var temp_find = generate_function(); 
    typ = "";
    
    if(temp_find === false)
        return;  //Ende des Scripts

    if(page==1)
        document.getElementById("RememberNav").removeEventListener("mouseover",  open);

    var url = "";
    if(window.location.origin.includes("https"))
        url = "https://proxer.me/ucp?s=history&p="+page+"#top";
    else
        url = "http://proxer.me/ucp?s=history&p="+page+"#top";

    if (window.XMLHttpRequest) // AJAX nutzen mit IE7+, Chrome, Firefox, Safari, Opera
        xmlhttp=new XMLHttpRequest();
    else // AJAX mit IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            if(xmlhttp.responseText[0] == "<")
            {
                temp_find();
            }    
        }   
    };
    xmlhttp.open("GET",url);
    xmlhttp.send();
}

function find(medium) //Sucht Medium
{
    var doc = xmlhttp.responseText;
    var p = doc.indexOf(medium);
    if(p == -1 || p=== 0)//Medium ist auf aktueller Chronikseite nicht vorhanden
    {
        typ+=medium[0];
        return;
    }
    doc = doc.slice(p-90);
    var name = doc.slice(doc.indexOf(">")+1,doc.indexOf("<"));

    doc = doc.slice(doc.indexOf("<td>")+4);
    var episode = doc.slice(0,doc.indexOf("</td>"));

    var href = doc.slice(doc.indexOf("<a")+9);
    href = href.slice(0,href.indexOf('"'));

    var member_name = medium[0]+": "+ name+" Ep. "+episode;

    document.getElementById("Remember"+medium[0]).innerHTML = '<a href='+href+'>'+member_name+'</a>';
}