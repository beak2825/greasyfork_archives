// ==UserScript==
// @name         Twitch VODCAST remover
// @namespace    http://maxbrown.dk
// @version      0.3.3
// @description  Remove VODCASTS from following page
// @author       Max Brown
// @include      *://www.twitch.tv/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/30444/Twitch%20VODCAST%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/30444/Twitch%20VODCAST%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
       var maxTry = 200; // 20 secounds
       var i = 0;
       var inVal = setInterval(function() {
           removeMain();
           removeSC();
           if (i == maxTry) {
               clearInterval(inVal);
           }
           i++;
       }, 100);
    });
})();

function removeMain() {
     if ($(".pill").length) {
               $(".pill").each(function(i,v) {
                   if ($(v).text().toLowerCase() == "vodcast") {
                       $(v).parent().parent().parent().parent().parent().remove();
                   }
               });
           }
}

function removeSC() {
    var scContainer = $("sc-channels__live");
    if ($(scContainer).length && $(scContainer).children().length) {
     $($0).find('[data-tooltip-text="Vodcast"]').each(function(i,v) {
         $(this).remove();
     });
    }
}