// ==UserScript==
// @name         PokeTonEgirl.js
// @version      1.0
// @description  Poke ton E-girl ♥
// @author       Rolf-Peter Früschke
// @match        https://www.facebook.com/pokes*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @namespace https://greasyfork.org/users/752738
// @downloadURL https://update.greasyfork.org/scripts/424180/PokeTonEgirljs.user.js
// @updateURL https://update.greasyfork.org/scripts/424180/PokeTonEgirljs.meta.js
// ==/UserScript==

function poke(){
    setInterval(function(){
        var element = document.querySelector('[aria-label="Envoyer un poke"]');
        if (element!=undefined){
            element.click();
        }
    }, 3000);
}

poke();