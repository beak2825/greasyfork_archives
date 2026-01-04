// ==UserScript==
// @name       Aufstellungsanzeige
// @include  https://fussballcup.de/*
// @version    0.1.3
// @description  Zeigt die Anzahl der Spieler die auf dem Feld sind auf der Fussballcup-Startseite an.
// @copyright  Klaid, 2013 edited by mot33, 2018
// @grant  GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/30510/Aufstellungsanzeige.user.js
// @updateURL https://update.greasyfork.org/scripts/30510/Aufstellungsanzeige.meta.js
// ==/UserScript==

window.setTimeout(function () { auf_count_number(); }, 2500);
window.setInterval(function() { auf_count_number(); }, 5000);

function auf_count_number()
{
    if(!document.getElementById("auf_count_number"))
    {
        document.getElementById("clubinfocard").getElementsByTagName("ul")[0].innerHTML += "<li id='auf_count_number'><span class='label'>Aufstellung:</span> wird geladen...</li>";
        document.getElementsByClassName("likebox")[0].style.marginBottom = "-40px";
    }
    
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://fussballcup.de/index.php?w=301&area=user&module=formation&action=index&_=*&path=index.php&layout=none",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        onload: function(responseDetails){
            var inhalt = responseDetails.responseText;
            var for_count = inhalt.indexOf('formation-count');
            var count_number_site = inhalt.substr(for_count, 50);
            count_number = count_number_site.match(/[0-9]{1,10}/);
            if(count_number == "11")
            {
                count_number = "vollständig";   
            }
            else
            {
                count_number = "<span style='color: red;'>unvollständig</span>";
            }
            
            document.getElementById("auf_count_number").innerHTML = "<li id='auf_count_number'><span class='label'>Aufstellung:</span> "+ String(count_number) +"</li>";
        }	
    });
}
window.onload = show_count;