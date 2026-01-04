// ==UserScript==
// @name         Script Hapoel Sans Bugs
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  J'ai essayé de faire un script sans bugs...
// @author       3lXouif_Hapoel (Positron)
// @match        https://www.jeuxvideo.com/*
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408068/Script%20Hapoel%20Sans%20Bugs.user.js
// @updateURL https://update.greasyfork.org/scripts/408068/Script%20Hapoel%20Sans%20Bugs.meta.js
// ==/UserScript==

function replace() {
var y = document.getElementsByTagName("P");
var i;
for (i = 0; i < y.length; i++) {
  var reg=new RegExp(":hapoel:", "g");
  y[i].innerHTML = y[i].innerHTML.replace(reg,"<img border='0'src='http://image.noelshack.com/fichiers/2018/36/5/1536354479-hapoel.gif' alt=':hapoel:' />");
  reg=new RegExp(":hapoelia:", "g");
  y[i].innerHTML = y[i].innerHTML.replace(reg,"<img border='0'src='https://wiki.jvflux.com/images/8/85/Hapoelia.gif' alt=':hapoelia:' />");
  reg=new RegExp(":hapoel2:", "g");
  y[i].innerHTML = y[i].innerHTML.replace(reg,"<img border='0'src='https://cdn.discordapp.com/emojis/718481781501853707.png' width=16 height=16 alt=':hapoel2:' />");
}
}
var userInput = document.getElementById('message_topic');
userInput.onkeyup = function() {
  if(document.getElementById('message_topic').indexOf(":hapoel:") !== -1 || document.getElementById('message_topic').indexOf(":hapoelia:") !== -1 || document.getElementById('message_topic').indexOf(":hapoel2:") !== -1){
  replace()
  }
};

replace()