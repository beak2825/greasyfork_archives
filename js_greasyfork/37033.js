// ==UserScript==
// @name         [incomplete] Withdraw From Village Overview
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        https://*.tribalwars.co.uk/game.php?village=*&screen=info_village&id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37033/%5Bincomplete%5D%20Withdraw%20From%20Village%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/37033/%5Bincomplete%5D%20Withdraw%20From%20Village%20Overview.meta.js
// ==/UserScript==

var supportLength = $("#content_value").children().eq(4).children().eq(1).children().children().length;
for (var i = 1; i <= supportLength; i++) {
    $("#content_value").children().eq(4).children().eq(1).children().children().eq(i).children().eq(14).children()[0].click();
}