// ==UserScript==
// @name         Loult_auto_bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://loult.family/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34050/Loult_auto_bot.user.js
// @updateURL https://update.greasyfork.org/scripts/34050/Loult_auto_bot.meta.js
// ==/UserScript==

var CheminComplet = document.location.href;
var NomDuFichier     = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 );
var numessage = 0 ;

function traitement() {numessage+=1 ; setTimeout(function(){ numessage-=1; console.log("+1"); }, 5000);    }

socket = new WebSocket('wss://loult.family/socket/'+NomDuFichier);



 socket.onmessage = function(e){
   var server_message = e.data;
  var random = Math.floor(Math.random()*101) ;

if (typeof event.data === "string") {
var jsonObject = JSON.parse(e.data) ;
var userId = jsonObject.userid;
var userMessage = jsonObject.msg;


if(numessage<1){

if(userMessage.indexOf("https://")>=0) {
    setTimeout(function(){
        socket.send(JSON.stringify({ type: 'msg', msg: "virus cliquez pas" , lang: 'fr' } ));
        traitement();
    }, 1000); }


if(userMessage.indexOf("http://")>=0) {
    setTimeout(function(){
        socket.send(JSON.stringify({ type: 'msg', msg: "virus cliquez pas" , lang: 'fr' } ));
        traitement();
    }, 1000); }


}

}

 };