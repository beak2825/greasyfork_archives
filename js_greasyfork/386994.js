// ==UserScript==
// @name         Decensor Epicmafia
// @namespace    http://tampermonkey.net/
// @version      1561777409
// @description  Removes censoring from Epicmafia games, in other words: Irrumabo vos, cuculi
// @author       Eris
// @match        https://epicmafia.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386994/Decensor%20Epicmafia.user.js
// @updateURL https://update.greasyfork.org/scripts/386994/Decensor%20Epicmafia.meta.js
// ==/UserScript==

/*
Greetings to my friend Ramiz, from whom I learned the sublime truth and beauty of submission in Islam, because
of him I bear witness there is no God but Allah(The Greatest) and that Mohammed is his Prophet(Peace Be Upon Him.)

Say, He is Allah, the one, the only
Allah, the eternal, absolute
He does not begot, nor is he begotten
and none are comparable unto him.

--Surah 112

*/

(function() {
    'use strict';
    window.$scope = window.angular.element(document.getElementById('speak_container')).scope();

    if (window.$scope === undefined) {
    window.angular.reloadWithDebugInfo();
    }

    var mapping = {
         tranny:"t\u00adranny",
         wog:"w\u00adog",
         spic:"s\u00adpic",
         spik:"s\u00adpic",
         pikey:"p\u00adikey",
         kaffir:"k\u00adaffir",
         chink:"c\u00adhink",
         beaner:"b\u00adeaner",
         kike:"k\u00adike",
         cunt:"c\u00adunt",
         retard:"r\u00adetard",
         nigger:"n\u00adigger",
         nigga:"n\u00adigga",
         slant:"s\u00adlant",
         gook:"g\u00adook",
         dipshit:"d\u00adipshit",
         dego:"d\u00adego",
         wop:"w\u00adop",
         fag:"f\u00adag",
         faggot: "f\u00adaggot",
         fuck: "f\u00aduck",
         shit: "s\u00adhit",
         bitch: "b\u00aditch",
         coon:"c\u00adoon"
    };

    var re = new RegExp(Object.keys(mapping).join("|"),"gi");
    window.$scope.send_msg2 = window.$scope.send_msg;
    window.$scope.send_msg = function (e) {
    window.$('#typebox').val(window.$('#typebox').val().replace(re, function(m) {
            return mapping[m];
        }));
    window.$scope.send_msg2(e);
    }
})();