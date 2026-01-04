// ==UserScript==
// @name        Hide Discord Servers
// @description Hide Servers You Only Joined Them For Global Emotes :)
// @version     1.1
// @author      KudoAmine
// @namespace   http://tampermonkey.net/
// @match       *://discordapp.com/*
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/374478/Hide%20Discord%20Servers.user.js
// @updateURL https://update.greasyfork.org/scripts/374478/Hide%20Discord%20Servers.meta.js
// ==/UserScript==

// Add Servers' Names or IDs below, e.g. : var ServersToHide = ["ServerName1","ServerName2","ServerName3",...];

var ServersToHide = ["ServerName1"];

function JustWait() {
var guilds = document.getElementsByClassName("listItem-2P_4kh");
if (guilds.length>6){
HideServers ()
  } else {
setTimeout(function(){
    JustWait()
}, 2000);
}
}

function HideServers () {
var guilds = document.getElementsByClassName("listItem-2P_4kh");
var i,j;
for (j=0;j<ServersToHide.length;j++){
for (i=1;i<guilds.length - 1;i++){
if(guilds[i].innerHTML.indexOf(ServersToHide[j])!=-1){
guilds[i].style.display="none";
}
}
}
}

JustWait()