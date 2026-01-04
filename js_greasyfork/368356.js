// ==UserScript==
// @name         Aperture Tech, NGA-thread
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://bbs.ngacn.cc/thread.php?fid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368356/Aperture%20Tech%2C%20NGA-thread.user.js
// @updateURL https://update.greasyfork.org/scripts/368356/Aperture%20Tech%2C%20NGA-thread.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var table = document.getElementById("topicrows");
    var limit = 0
    var counter = 0
    for (var i = table.rows.length -1; i >= 0; i--) {
        var number = parseInt(table.rows[i].cells[0].textContent)
        if( number < 300) {
            limit += number;
            counter += 1;
        }
    }
    console.log(limit);
    console.log(counter);
    limit = limit / counter
    console.log(limit);

    for (var j = table.rows.length -1; j >= 0; j--) {
        number = table.rows[j].cells[0].textContent
        if( number < limit) {
            table.rows[j].remove()
        }
    }
})();