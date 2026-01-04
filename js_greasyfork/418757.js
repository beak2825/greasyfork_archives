// ==UserScript==
// @name        SteamTrade Matcher - Images Bug Fix
// @description Replace the links with correct ones for images of games headers and trading cards/emoticons/backgrounds
// @icon        http://www.steamtradematcher.com/res/img/favicon.jpg
// @namespace   Carje
// @version     0.2
// @license     MIT
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include     https://www.steamtradematcher.com/compare
// @include     https://www.steamtradematcher.com/tools/fullsets
// @author      Carje
// @downloadURL https://update.greasyfork.org/scripts/418757/SteamTrade%20Matcher%20-%20Images%20Bug%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/418757/SteamTrade%20Matcher%20-%20Images%20Bug%20Fix.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

$(document).ready(function(){
if (window.location.href.indexOf("compare") > -1) {
  var id = setInterval(frame, 1000);
  function frame() {
    if (document.getElementById('progress-percent').innerText == 100) {
      clearInterval(id);
    } else {
       $('img').each(function(){
         this.src = this.src.replace('http://cdn.steamcommunity.com', 'https://steamcommunity-a.akamaihd.net');
     });
     $('img').each(function(){
         this.src = this.src.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net');
     });
    }
  }
}
if (window.location.href.indexOf("fullsets") > -1) {
    var fs = setInterval(function() {
    if($('.fullset-calc-results').is(':visible')){
        clearInterval(fs);
        $('img').each(function(){
            this.src = this.src.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net');
        });
    }
    }, 1000);
}
});