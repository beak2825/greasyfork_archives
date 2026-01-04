// ==UserScript==
// @name        Crime alert
// @namespace   Qfiffle.scripts
// @match       https://www.torn.com/crimes.php*
// @grant       none
// @run-at document-end
// @version     1.6
// @license MIT
// @author     Qfiffle
// @description 8/9/2022, 3:14:02 PM A script for Torn.com. This alerts you on loading the crimes page if you don't have enough money to pay for a kidnapping fail
// @downloadURL https://update.greasyfork.org/scripts/449197/Crime%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/449197/Crime%20alert.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

    var money = document.getElementById("user-money").innerHTML

    function showAlert(){
        alert("You do not have enough for kidnapping bribes in your wallet");
    }


    money = money.replace(/[$,]+/g,"");
    var result = parseInt(money)
 
    if(money>=0 && money<75000){

        showAlert();
    }
  
}, false);