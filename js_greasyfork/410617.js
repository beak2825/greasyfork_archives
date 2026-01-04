// ==UserScript==
// @name         Neopets - Sticky Snowball
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  neopets buy sticky snowball
// @author       You
// @match        http://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8429
// @match        http://www.neopets.com/faerieland/springs.phtml?bought=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410617/Neopets%20-%20Sticky%20Snowball.user.js
// @updateURL https://update.greasyfork.org/scripts/410617/Neopets%20-%20Sticky%20Snowball.meta.js
// ==/UserScript==

var minutes = 1;


function visitlink(){
    window.location.href = "http://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8429";
}

while (true) {
    var url = window.location.href;
    if (url.search("true") < 0) {
        // successfully bought
        minutes = 30
    } else {
        // Error: Sorry, you are only allowed to purchase one item every 30 minutes
        minutes = 1
    }
    visitlink()
    window.setInterval(visitlink, minutes *60*1000);
}