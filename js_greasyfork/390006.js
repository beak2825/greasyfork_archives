// ==UserScript==
// @name           Banker
// @description    Just set the timer, and this script will deposit your hard earned money for you!\
// @copyright      2019+, 
// @include        https://www.generalsofarmageddon.com/bank.php*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @version 0.0.1.20191120015554
// @namespace https://greasyfork.org/users/307175
// @downloadURL https://update.greasyfork.org/scripts/390006/Banker.user.js
// @updateURL https://update.greasyfork.org/scripts/390006/Banker.meta.js
// ==/UserScript==

var timer = 300000; // In milliseconds (1000 = 1sec 30000 = 30sec 300000 = 5min)

setTimeout( function() {
    var depositButton = $( 'input[src$="/pics/deposit.png"]' );
    $( depositButton ).click();
}, timer );