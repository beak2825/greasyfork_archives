// ==UserScript==
// @name         Download by team
// @version      0.1
// @description  Will add a button to download all the musics from a team's page (must allow popups from the page)
// @author       Samu
// @match        http://www.keygenmusic.net/?page=team*
// @grant        none
// @namespace https://greasyfork.org/users/17840
// @downloadURL https://update.greasyfork.org/scripts/21802/Download%20by%20team.user.js
// @updateURL https://update.greasyfork.org/scripts/21802/Download%20by%20team.meta.js
// ==/UserScript==

var button = document.createElement("button");
button.setAttribute("style", "width: 100%; color: white; border-bottom: 1px gray solid !important; border: none; background-image: url(/images/bg.gif);");
button.innerText = "DOWNLOAD ALL!";
button.onclick = downloadAll;

var teamcontainer = document.querySelector(".teamcontainer");

if( teamcontainer )
  teamcontainer.insertBefore(button, teamcontainer.children[1]);


function downloadAll() {
  this.onclick = null;
  setTimeout(function() { this.onclick = downloadAll }, 3000);
  
  var teamtable = document.querySelectorAll(".teamtable  tbody tr:not(.tth)");

  for(var i = 0; i < teamtable.length; i++){

    var link = teamtable[i].querySelector(".ttleft a.menu");
    link.target = "_blank";
    link.click();
    link.removeAttribute("target");

  }
}