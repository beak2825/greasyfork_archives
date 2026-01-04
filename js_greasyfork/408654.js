// --Liste Smileys--
//    :sueur: [=> par Diplodocroute2]
//    :noelcoeur: [=> Par _410]
// ==Liste Smileys==
//
// ==UserScript==
// @name         Vos Smileys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Voila vos Smileys
// @author       ElXouif (Positron)
// @match        https://www.jeuxvideo.com/*
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408654/Vos%20Smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/408654/Vos%20Smileys.meta.js
// ==/UserScript==

replace()
function replace() {
var y = document.getElementsByTagName("P");
var i;
for (i = 0; i < y.length; i++) {
  var reg=new RegExp(":sueur:", "g");
  y[i].innerHTML = y[i].innerHTML.replace(reg,"<img border='0'src='http://shack.hapoel.rf.gd/publique/sueur.png' alt=':sueur:' />"); //Par Diplodocroute2

  reg=new RegExp(":noelcoeur:", "g");
  y[i].innerHTML = y[i].innerHTML.replace(reg,"<img border='0'src='http://shack.hapoel.rf.gd/publique/noelcoeur.png' alt=':noelcoeur:' />"); //Par _410
}
}
var userInput = document.getElementById('message_topic');
userInput.onkeyup = function() {
  if(document.getElementById('message_topic').indexOf(":hapoel:") !== -1 || document.getElementById('message_topic').indexOf(":hapoelia:") !== -1 || document.getElementById('message_topic').indexOf(":hapoel2:") !== -1){
  replace()
  }
};