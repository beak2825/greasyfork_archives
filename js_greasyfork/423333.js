// ==UserScript==
// @name        cece
// @namespace   cece
// @description Cece facebook
// @version     1
// @include		https://www.facebook.com/CecesCollectables*
// @author      Dawdie
// @downloadURL https://update.greasyfork.org/scripts/423333/cece.user.js
// @updateURL https://update.greasyfork.org/scripts/423333/cece.meta.js
// ==/UserScript==



var player = document.createElement('audio');
player.src = 'https://lawdie.co.uk/bells.mp3';
player.preload = 'auto';

rand = Math.floor((Math.random() * 10) + 1);
Title = "Watching: ";
document.title =  Title.concat(document.title);

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}

Rand = generateRandomInteger(5,7)


function LocalMain ()
{
    if (/THIS IS THE POST! (3)/i.test(document.body.innerHTML) ) {

        document.title = "IN STOCK!";
        player.play()


  } else {
    
  setTimeout(function(){  location.reload(); }, Rand*1000);
  };

window.addEventListener('load', function() {

}, false);

}

LocalMain (); 

