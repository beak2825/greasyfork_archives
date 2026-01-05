// ==UserScript==
// @name        AO Auto choose player
// author       Wiktor Radecki
// @namespace   AnimeOdcinki
// @include     http://anime-odcinki.pl/*
// @version     3
// @grant       none
// @description Add to anime-odcinki.pl's players auto choose player in order of players
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10367/AO%20Auto%20choose%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/10367/AO%20Auto%20choose%20player.meta.js
// ==/UserScript==

// Należy wyedytowac liste z odtwarzaczmi... jest sprawdzane po tej liscie czy jest taki player
// jesli jest to wybiera go i przelacza.
// Bierze pirwszy na liscie, wiec trzeba wpisac w kolejnosci w jakiej chce sie wybierac otwarzacze.
var players = ['VK Player', 'Google Player', 'Tune Player', 'MP4Upload Player'];

var done = false;

$(document).ready(choosePlayer);

function filterByNonNext(array) {
  var divs = [];
  for(var i = 0; i < array.length; i++){
    var div = array[i];
    if(contains(div.innerHTML,'&lt;&lt;') 
       || contains(div.innerHTML, '&gt;&gt;')
       || contains(div.innerHTML, '<<') 
       || contains(div.innerHTML, '>>'))
      continue;
    divs.push(div);
  }
  return divs;
}

function contains(text, search){
  return text.indexOf(search) > -1;
}

function choosePlayer(){
var playerDiv = $('#video-player-control');
if (playerDiv.length) {
  var divs = filterByNonNext(playerDiv.children());
  for (var i = 0; !done && i < players.length; i++) {
    var player = players[i];
    for (var j = 0; j < divs.length && !done; j++) {
      var div = divs[j];
      if(contains(div.innerHTML,player)){
        done = true;
        if(div !== divs[0]){
          div.click(); 
        }
      }
    }
  }
}

}