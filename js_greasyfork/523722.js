// ==UserScript==
// @name        PokemonSoundTarget
// @namespace   PokemonSoundTarget
// @description Play a sound if 151 UPC is in stock
// @version     1
// @include 	https://www.target.com/p/pokemon-trading-card-game--scarlet---38--violet-151-ultra-premium-collection--no-aasa/-/A-88897906*
// @author      Colin
// @license     MIT
 
// @downloadURL https://update.greasyfork.org/scripts/523722/PokemonSoundTarget.user.js
// @updateURL https://update.greasyfork.org/scripts/523722/PokemonSoundTarget.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE: www.target.com/p/pokemon-trading-card-game--scarlet---38--violet-151-ultra-premium-collection--no-aasa/-/A-88897906
 
var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
player.preload = 'auto';
 
if (!(/Not available/i.test (document.body.innerHTML) ) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 15*1000);
}