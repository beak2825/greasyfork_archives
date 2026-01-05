// ==UserScript==
// @name        CSGO Lounge Autobumper
// @description Simple CSGO-Lounge Autobumper all 300 seconds
// @include     http://csgolounge.com/mytrades*
// @include     https://csgolounge.com/mytrades*
// @version     1.01
// @grant       none
// @copyright           2015, Alucard
// @namespace https://greasyfork.org/users/12716
// @downloadURL https://update.greasyfork.org/scripts/10621/CSGO%20Lounge%20Autobumper.user.js
// @updateURL https://update.greasyfork.org/scripts/10621/CSGO%20Lounge%20Autobumper.meta.js
// ==/UserScript==

function autobump(){
  var y = 0;

for (var x = 0; x < document.getElementsByClassName("buttonright").length; x++){
 if(document.getElementsByClassName("buttonright")[x].innerHTML.search("Bump") > 0){
 var tradenr = document.getElementsByClassName("buttonright")[x].getAttribute('onclick');
 tradenr = tradenr.split("'")[1]; 
 $(document.getElementsByClassName("buttonright")[x]).hide();
 bumpTrade(tradenr); 
 y++;
 }
 
}
  timer = new Date();
  document.getElementById('follow').innerHTML += '<div id=autobumpnote style=color:white; width=100%  align=center><br>Last Autobump: ' + timer.getHours() + ':' + (timer.getMinutes()<10?'0':'') + timer.getMinutes() + '<br>' + y + ' Trades bumped</div>';
  
  
  setTimeout(function(){window.location.href=location.href;},300000)
}

autobump();

