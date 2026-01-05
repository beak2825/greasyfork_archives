// ==UserScript==
// @name        Anti-RickRoll
// @namespace   antirickroll
// @description Inserts a small picture of Rick Astley's face next to links to 'Never Gonna Give You Up' (currently set up for tumblr only).
// @include     http*://*.tumblr.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12972/Anti-RickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/12972/Anti-RickRoll.meta.js
// ==/UserScript==

var urls = ['https://www.youtube.com/watch?v=oHg5SJYRHA0', 'http://www.youtube.com/watch?v=oHg5SJYRHA0', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'http://www.youtube.com/watch?v=dQw4w9WgXcQ']

waitForKeyElements ("div.post_container", placeTheFace);

// This runs for every post container as they load.
function placeTheFace(jNode){  
  var links = jNode.find('a');
  for (i=0; i<links.length; i++){
    if(isRickRoll(links[i].href)){
      links[i].innerHTML = links[i].innerHTML + "<img src='http://www.lpassociation.com/forums/smilies/rick.png' alt='This link is a rick roll' style='width: 13px; display:inline;'>";
    }
  }  
}

function isRickRoll(url){
  for (var u in urls){
     if(urls[u] == url){
       return true;
     }
  }    
  return false;
}


