// ==UserScript==
// @name         Gööglê - Spaß auf der Google-Startseite
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Google Fun
// @author       You
// @license      MIT
// @match        https://www.google.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450410/G%C3%B6%C3%B6gl%C3%AA%20-%20Spa%C3%9F%20auf%20der%20Google-Startseite.user.js
// @updateURL https://update.greasyfork.org/scripts/450410/G%C3%B6%C3%B6gl%C3%AA%20-%20Spa%C3%9F%20auf%20der%20Google-Startseite.meta.js
// ==/UserScript==



/* globals jQuery, $ */

(function() {
//  'use strict';
    var elementfound = $("[alt='Google']");
    elementfound.attr("src","https://images2.imgbox.com/32/da/GYchgLhy_o.png").removeAttr("srcset");

    var elementfound2 = $("[class='gb_1 gb_2 gb_8d gb_8c']");
    elementfound2.html("Arsch lecken");

     var elementfound3 = $("[data-pid='2']");
    elementfound3.html("Pornos").attr("href","https://www.pornhub.com").attr("target","_blank");

    var elementfound4 = $("[class='ktLKi']");
    elementfound4.html("CO²-Neutral: Niemals in deinem ganzen Leben.");

    var elementfound5 = $( "a:contains('Datenschutzerklärung')" );
    elementfound5.html("Datenschmutzerklärung (Kekse usw.)");

     var elementfound6 = $( "a:contains('Nutzungsbedingungen')" );
    elementfound6.html("nutzlose Bedingungen (die eh keiner liest)");

    var elementfound7 = $( "div[class='ayzqOc pHiOh']:contains('Einstellungen')" );
    elementfound7.html("Ein- oder Zweistellungen");

     var elementfound8 = $( "a:contains('Wie funktioniert')" );
    elementfound8.html("Weischt'isch'mein?!");

    var elementfound9 = $("div[class='uU7dJb']");
    elementfound9.html("Drecks-Putin im Drecks-Russland. — We stand with Ukraine! ❤️🇺🇦 ");

    var elementfound10 = $("div[class='ynRric']");
    elementfound10.html("Vorschlage, weil du die Kacke schonmal gesucht hast, bei Göööglê");

//     var url = elementfound.attr("src");
// $.ajax({
//     url: url,
//     headers: { "Cache-Control": "no-cache" }
// }).done(function(){
//     // Refresh is complete, assign the image again
//      elementfound.attr("src", url);
// });
    // Your code here...
})();