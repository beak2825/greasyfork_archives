// ==UserScript==
// @name         ConfirmeTesAmis.JS
// @version      1.0
// @description  Confirme tes amis ♥
// @author       Rolf-Peter Früschke
// @match        https://www.facebook.com/friends/requests
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @namespace https://greasyfork.org/users/752738
// @downloadURL https://update.greasyfork.org/scripts/427769/ConfirmeTesAmisJS.user.js
// @updateURL https://update.greasyfork.org/scripts/427769/ConfirmeTesAmisJS.meta.js
// ==/UserScript==
var i = 0
function confirme(){
    setInterval(function(){
        var element = document.querySelector('[aria-label="Confirmer"]');
        if (element!=undefined){
            element.click();
            i++;
        }
        if (i>10){
           i=0;
           location.reload();
        }
    }, 100);
}

confirme();
