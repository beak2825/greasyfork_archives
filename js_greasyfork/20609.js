// ==UserScript==
// @name         Get'em
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://severinpreisig.ch/moodle/mod/quiz/review.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20609/Get%27em.user.js
// @updateURL https://update.greasyfork.org/scripts/20609/Get%27em.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isMultiple = false;
    var var1 = [];
    [].slice.call( document.getElementsByClassName("feedbackspan" )).forEach(function ( div,i ) {
        var1[i] = div.innerHTML.replace("Not answered<br>The correct answer is: ","").replace("<br>Mark 0.00 out of 1.00","")
    });
    if(isMultiple)
    {
        [].slice.call( document.getElementsByClassName("rightanswer" )).forEach(function ( div,i ) {
            var1[i] = div.innerHTML.replace("The correct answer is: ","")
        });
    }
    else
    {
        [].slice.call( document.getElementsByClassName("feedbackspan" )).forEach(function ( div,i ) {
            var1[i] = div.innerHTML.replace("Not answered<br>The correct answer is: ","").replace("<br>Mark 0.00 out of 1.00","")
        });
    }
    prompt("Hit Ctr+C",JSON.stringify(var1));
})();