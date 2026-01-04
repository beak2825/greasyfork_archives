// ==UserScript==
// @name         buy shot on k key
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Buy a 360 shot powerup buy just clicking the k key on your keyboard!
// @author       HutDude
// @match        https://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417312/buy%20shot%20on%20k%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/417312/buy%20shot%20on%20k%20key.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.addEventListener('keydown', function(event)
    {
        if (document.getElementById('overlays').style.display != 'none' || document.getElementById('advert').style.display != 'none') {
            return;
        }
        if (document.activeElement.type == 'text' || document.activeElement.type == 'password') {
            return;
        }

        if (event.keyCode == 75) {
            document.getElementsByClassName("purchase-btn confirmation")[3].click();
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},500);
            setTimeout(function(){document.getElementsByClassName("confirm")[0].click();},1500);
        }});

})();