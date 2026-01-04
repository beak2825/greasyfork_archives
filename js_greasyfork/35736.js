// ==UserScript==
// @name         Loultchangerpokemonauto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://loult.family/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35736/Loultchangerpokemonauto.user.js
// @updateURL https://update.greasyfork.org/scripts/35736/Loultchangerpokemonauto.meta.js
// ==/UserScript==

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}



var CheminComplet = document.location.href;
var NomDuFichier     = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 );
var FirstMessage = true ;

 socket = new WebSocket('wss://loult.family/socket/'+NomDuFichier);




 socket.onmessage = function(e){
   var server_message = e.data;

if (typeof event.data === "string") {
var jsonObject = JSON.parse(e.data) ;


if(FirstMessage){      // si premier message du socket

var length = jsonObject.users.length ;      // taille du tableau des utilisateurs  et nombre pokemon connecté
for (var i = 0 ; i<length; i++) {

if( jsonObject.users[i].params.you === true) {


    console.log( "nom :" +  jsonObject.users[i].params.name  +" "+  jsonObject.users[i].params.adjective  );
    console.log( "cookie :" + getCookie("id") );
    document.cookie = "id"+ '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


FirstMessage=false ;  // sortir du if
}


 }




}

                                }