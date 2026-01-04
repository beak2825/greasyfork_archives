// ==UserScript==
// @name         Steam Community - export game list
// @name:fr      Steam Community - export de la liste des jeux
// @namespace    manulelutin
// @version      0.1
// @description  Export game list of a steam user in a text file
// @description:fr Exporte dans un fichier texte la liste des jeux Steam affichés dans la page "games" de Steam community
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @author       manulelutin
// @include      *://steamcommunity.com/id/*/games/?tab=all
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/36785/Steam%20Community%20-%20export%20game%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/36785/Steam%20Community%20-%20export%20game%20list.meta.js
// ==/UserScript==

var gamelist = $( ".gameListRowItemName");
var username = $( ".profile_small_header_name").text();
var exportxt = "";

for (var i = 0; i < gamelist.length;i++)
{exportxt+=gamelist[i].innerHTML+"\r\n";}

function download(filename,text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

var filename="steam_game_list_of_"+username;
download(filename+".txt", exportxt);