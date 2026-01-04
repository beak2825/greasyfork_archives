// ==UserScript==
// @name         SOLO CAR-WARS 2018
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  SALTA EL DESCANSO
// @author       Lexander Ortega
// @match        http://www.humanatic.com/pages/humfun/break_room.cfm?review_ajax
// @match        https://www.humanatic.com/pages/humfun/break_room.cfm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369822/SOLO%20CAR-WARS%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/369822/SOLO%20CAR-WARS%202018.meta.js
// ==/UserScript==

if(location.href ==='https://www.humanatic.com/pages/humfun/break_room.cfm'){

}

var url = window.location.href;
var masse_fichier = document.getElementsByClassName("content-text")[0];
console.log(masse_fichier);
if(url)
{
    var arrayOfStrings = url.split("/");
    if(arrayOfStrings[4])
    {
        var dossier = arrayOfStrings[4];
        if(arrayOfStrings[5])
        {
            var video = arrayOfStrings[5];
            top.location.href="https://www.humanatic.com/pages/humfun/upgrade_review_page.cfm/" + dossier + "/" + video;
}
        else
        {
           top.location.href="https://www.humanatic.com/pages/humfun/upgrade_review_page.cfm/" + dossier;
        }
    }
    else
    {
        alert("error2");
    }
}
else
{
    alert("error1");
}
