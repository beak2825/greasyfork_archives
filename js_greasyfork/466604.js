// ==UserScript==
// @name         Trains alert
// @namespace    zero.train.torn
// @version      0.2
// @description  Alerts when the trains are at 20
// @author       -zero [2669774]
// @match        https://www.torn.com/companies.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466604/Trains%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/466604/Trains%20alert.meta.js
// ==/UserScript==

var threshhold = 15;

function check(){
    if ($('.trains').length > 0){
        var t = parseInt($('.trains').text())
        if (t >= threshhold){
            alert("Your Trains are full. Don't forget to use them");
        }

    }
    else{
        setTimeout(check,300);
    }
}


(function() {
    check();
})();