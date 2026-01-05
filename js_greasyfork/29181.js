// ==UserScript==
// @name        gazellegames ggn: show gold per terabytehour
// @namespace   gazellegames
// @description calculates gold per terabytehour on ggn| Greasemonkey 4.1: ✔ Tampermonkey 4.4: ✔ 
// @include     https://gazellegames.net/torrents.php?id=*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29181/gazellegames%20ggn%3A%20show%20gold%20per%20terabytehour.user.js
// @updateURL https://update.greasyfork.org/scripts/29181/gazellegames%20ggn%3A%20show%20gold%20per%20terabytehour.meta.js
// ==/UserScript==


var games = document.getElementsByClassName('group_torrent');


for(i = 0; i < games.length; i++){

try{
   var childTd = games[i].getElementsByTagName('td')[2];
   var gameSize = childTd.innerHTML;
   var goldGeneration = games[i].nextElementSibling.firstElementChild.firstElementChild.getElementsByTagName('span')[1];
   
   //alert(goldGeneration.innerHTML);
   gameSize = toTeraByte(gameSize);
   goldGeneration.innerHTML = Math.round( goldGeneration.innerHTML/gameSize) + ' Gold/TBh  OR  ' + goldGeneration.innerHTML
}
catch(err){console.log(err.message);}

}

function toTeraByte(str){
    var re = /(.*?)\s(.*)/;
    var size = str.match(re) [2];
    var number =  str.match(re) [1];

    switch(size) {
    case 'KB':
        number = number / 1073741824 ;
        break;
    case 'MB':
        number = number / 1048576 ;
        break;
    case 'GB':        
        number = number / 1024 ;
        break;          
    default:
        number = number;
   } 
    
  return number;
}
