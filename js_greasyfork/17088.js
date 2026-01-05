// ==UserScript==
// @name         OrlyGift Giveaway Advisor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Te avisa cuando Orlygift esta listo para aplicar.
// @author       Sergio Susa (http://sergiosusa.com)
// @match        https://www.orlygift.com/giveaway
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17088/OrlyGift%20Giveaway%20Advisor.user.js
// @updateURL https://update.greasyfork.org/scripts/17088/OrlyGift%20Giveaway%20Advisor.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$( document ).ready(function() {

    var btn  = $("#raffle-enter-button");

    if(btn.length > 0) {
        btn[0].click();
        alert("Ya puedes aplicar a una nueva ronda");
    } else {
        setTimeout(function(){
            window.location.reload(false);
        }, 1200000);
    }

});