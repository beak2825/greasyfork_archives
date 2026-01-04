// ==UserScript==
// @name        Auto-reload tvmucho.com streams at each timeout
// @namespace   https://github.com/GavinBrelstaff
// @match       https://sat.tvmucho.com/app/tvmucho/play/*
// @description This script allows you to auto-reload a tvmucho.com stream at each timeout
// @version     1.0
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @description 06/03/2023, 14:20:03
// @downloadURL https://update.greasyfork.org/scripts/461517/Auto-reload%20tvmuchocom%20streams%20at%20each%20timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/461517/Auto-reload%20tvmuchocom%20streams%20at%20each%20timeout.meta.js
// ==/UserScript==

var allCookies = document.cookie.split(';');
// The "expire" attribute of every cookie is Set to "Thu, 01 Jan 1970 00:00:00 GMT"
for( var i=0; i < allCookies.length; i++ )
document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
localStorage.clear();

window.pid = setInterval(function() // Polling
{
  const el = document.getElementById('player');

   if( el )
   {
      el.controls=true;
      clearInterval(window.pid);
   }

}, 2000);  // every second



setInterval(function() // Polling
{
  const el1 = document.querySelector( '#app > div.modals div.signup-main-block' );
  const el2 = document.querySelector( '#time_progressbar > span > div[aria-valuenow="0"]' );

   if( el1 || el2)
   {
      var allCookies = document.cookie.split(';');
      // The "expire" attribute of every cookie is Set to "Thu, 01 Jan 1970 00:00:00 GMT"
      for( var i=0; i < allCookies.length; i++ )
      document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();

     localStorage.clear();
     //console.log('secs: ' + secs );
     location.href = location.href; // reload the page
   }

}, 1000);  // every second
