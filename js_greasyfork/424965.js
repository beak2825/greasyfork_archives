// ==UserScript==
// @name         Wolt opened restaurant
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Will play a sound once a restaurant is active again in Wolt
// @author       You
// @match        https://wolt.com/*/restaurant*
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424965/Wolt%20opened%20restaurant.user.js
// @updateURL https://update.greasyfork.org/scripts/424965/Wolt%20opened%20restaurant.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
   var has = document.querySelector(".CheckoutButton__offlineButton___uA_ST");
    if (!has){
        var audio = new Audio('https://freesound.org/data/previews/213/213889_2287873-lq.mp3');
        audio.play();
    } else {
        location.reload();
    }
    },5000);
})();