// ==UserScript==
// @name         Place Clément
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://hungrymusic.fr/woraklsorchestra/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382394/Place%20Cl%C3%A9ment.user.js
// @updateURL https://update.greasyfork.org/scripts/382394/Place%20Cl%C3%A9ment.meta.js
// ==/UserScript==

(function() {
    document.body.style.backgroundColor = "green";
    var newDiv = document.getElementsByTagName("p")[0];
    newDiv.style.backgroundColor = "green";
    newDiv.innerHTML = "Pas encore ouvert..";
    newDiv.style.position = "fixed";
    newDiv.style.top = "0px";
    newDiv.style.left = "0px";
    newDiv.style.margin = "0px";
    newDiv.style.width = "100%";
    newDiv.style.height = "100%";
    newDiv.style.backgroundColor = "green";
    newDiv.style.top = "0px";
    newDiv.style.left = "0px";
    newDiv.style.margin = "0px";
    newDiv.style.fontSize = "50px";
    newDiv.innerHTML = "Pas encore ouvert..";


    var tr = document.getElementsByTagName("tr");
    var booly = false;
    for (var i = 1; i < tr.length - 1 ; i++){
        try{
            if (tr[i].getElementsByClassName("treb")[0].innerHTML == "01 NOV"){
                console.log(tr[i].getElementsByTagName("td")[3].getElementsByTagName("a")[0].href);
                window.open(tr[i].getElementsByTagName("td")[3].getElementsByTagName("a")[0].href);
                booly = true;
            }
        }catch (e){}
    }
    if (booly == false){
        window.setTimeout("location.reload()", 10000);
    }

})();