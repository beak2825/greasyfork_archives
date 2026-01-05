// ==UserScript==
// @name         MateHaki
// @version      21.37
// @description  Placki ziemniaczane
// @author       Nie znasz
// @match        http://*.matemaks.pl/*

// @namespace https://greasyfork.org/users/38902
// @downloadURL https://update.greasyfork.org/scripts/18803/MateHaki.user.js
// @updateURL https://update.greasyfork.org/scripts/18803/MateHaki.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

setTimeout(premium, 1*1000); //5 sekund

function premium() {
    var zadania = document.getElementsByClassName('zadanie');
    for(var i = 0; i < zadania.length; i++)
    {
        if(zadania.item(i).getAttribute("id")){
            var id = zadania.item(i).getAttribute("id");
            var item = document.getElementById(id);
            var a = document.createElement('a');
            var linkText = document.createTextNode("Link do zadania");
            a.appendChild(linkText);
            a.href = "http://www.matemaks.pl/zadania/zadanie"+id+".html";
            a.setAttribute("class",'but b_www');
            document.getElementById(id).appendChild(a);
            
            var youtube = zadania.item(i).getAttribute("yt");
            if(youtube!=""){
            var you = document.createElement('a');
            var youtext = document.createTextNode("Youtube");
            you.appendChild(youtext);
            you.href = "https://www.youtube.com/watch?v="+youtube;
            you.setAttribute("class",'but b_yt');
            document.getElementById(id).appendChild(you);
            }

        }
    }
}