// ==UserScript==
// @name         Kachelmann Regenradar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Position automatsch + Playback
// @author       You
// @match        https://kachelmannwetter.com/de/regenradar*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kachelmannwetter.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540543/Kachelmann%20Regenradar.user.js
// @updateURL https://update.greasyfork.org/scripts/540543/Kachelmann%20Regenradar.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('TM-Script läuft!');


 //  $("button[title='Ihre Position orten und in der Karte anzeigen']").css('border','3px solid red');

   $("button[title='Ihre Position orten und in der Karte anzeigen']").trigger('click');
  //$(".player_btn_div").css('border','3px solid red');

 //$(".kw-play-button").trigger('click');

//   $("button[title='Ihre Position orten und in der Karte anzeigen']").trigger('click');
 //  $(".kw-play-button").trigger('click');
    //  $(".kw-play-button").trigger('click');
    let vergangenezeit = 1;
    setTimeout ( function() {
        $(".kw-play-button").trigger('click');
    }
                , 3000);



// Cancel the timeout
//clearTimeout(timeoutID);



})();