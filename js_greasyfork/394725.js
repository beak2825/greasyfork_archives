// ==UserScript==
// @name            Black Net Connector
// @author          Kirjah
// @include         https://cybertown.fr/ingame.php*
// @include         https://www.cybertown.fr/ingame.php*
// @grant           GM_xmlhttpRequest
// @description     Partage vos informations MIDA au réseau BlackNet
// @version 1
// @namespace https://greasyfork.org/users/6386
// @downloadURL https://update.greasyfork.org/scripts/394725/Black%20Net%20Connector.user.js
// @updateURL https://update.greasyfork.org/scripts/394725/Black%20Net%20Connector.meta.js
// ==/UserScript==


function getAction() {
    var action = document.getElementById("action").textContent;
    return action
}

function retrieveElementContent(element) {
  return document.getElementById(element).innerText;
}

$(document).ready ( function() {
window.setInterval(function() {


var pseudo = retrieveElementContent("pseudoig");
var sante = retrieveElementContent("santecontrol");
var forme = retrieveElementContent("formecontrol");
var faim = retrieveElementContent("alimfaim").replace(/\D/g,'');
var soif = retrieveElementContent("alimsoif").replace(/\D/g,'');
var stinfo = retrieveElementContent("inf");
var isatwork = (getAction().includes("travaillez") == 1) ? "true":"false";
var isasleep = getAction().includes("reposez");
var lastcheck = new Date();

//On forge le POST

var url = 'https://blacktools.bacon-network.net/post_state.php';
var params = {
  perso: pseudo ,
  isWorking: isatwork ,
  info: stinfo ,
  pv: sante ,
  pf: forme ,
  manger: faim ,
  boire: soif ,
  lastseen: lastcheck.toString().slice(0,25) ,
};

// Envoi des infos

var xhr = new XMLHttpRequest();
xhr.open('POST', url, true);
xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
    }
}
xhr.send("data="+JSON.stringify(params));
},5000);
});