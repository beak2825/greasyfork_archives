// ==UserScript==
// @name            Auto-reload FilmOn streams at each timeout
// @namespace       https://github.com/GavinBrelstaff
// @description     This script allows you to auto-reload a FilmOn stream at each timeout
// @match           http*://www.filmon.com/channel/*
// @version         2.0
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/459539/Auto-reload%20FilmOn%20streams%20at%20each%20timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/459539/Auto-reload%20FilmOn%20streams%20at%20each%20timeout.meta.js
// ==/UserScript==

window.count = 0;

setInterval(function() // Polling
{
   const el  = document.querySelector( 'div.tvg-count.countdown[secs]' );
   if( el ) // count down on page
   {
     const  secs = el.getAttribute('secs');
      //document.title = "Filmon " + secs;
      if( secs < 6 ) location.href = location.href; // reload the page
   }
   
   const el3 = document.querySelector( 'div.jw-display-icon-container.jw-display-icon-display' );
   if( !el &&  el3 ) // catch Loading... icon appearance
   {
     const  visibility = el3.checkVisibility();
     if( visibility ) el3.style.visibility = "hidden";
     //document.title = 'Filmon ' + window.count + ' ' + visibility;
     if( visibility  && window.count > 1) 
         location.href = location.href; // reload the page
     else
         window.count++;
   }

}, 1000);  // every second
