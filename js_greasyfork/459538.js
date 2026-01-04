// ==UserScript==
// @name            Skip the play button when browsing to RaiPlay.it LIVE
// @name:it         Salta il tasto play per RaiPlay.it diretti
// @namespace       https://github.com/GavinBrelstaff
// @description     This script allows you to Skip the play button when browsing to RaiPlay.it LIVE.
// @description:it  Ti permette di saltare il tasto play per RaiPlay.it diretti
// @match           https://www.raiplay.it/dirette/*
// @version         1.0
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/459538/Skip%20the%20play%20button%20when%20browsing%20to%20RaiPlayit%20LIVE.user.js
// @updateURL https://update.greasyfork.org/scripts/459538/Skip%20the%20play%20button%20when%20browsing%20to%20RaiPlayit%20LIVE.meta.js
// ==/UserScript==

window.sel="html > body.rai-logged > main > section > rai-live-item.leaf__live > div.grid-container div.cell > a > div.cell > div.play-over-video.button"
//console.log('starting: ' + window.sel );
window.pid1 = setInterval(function() // Polling
{
  var el = document.querySelector( window.sel );
   if( el )
   {
     console.log('********* found ' + window.sel );
     el.click();
     clearInterval( window.pid1 );
   }
}, 250);
