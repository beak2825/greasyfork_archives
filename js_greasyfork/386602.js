// ==UserScript==
// @name         TukarPointTP
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tokopedia.com/tokopoints/tukar-point/detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386602/TukarPointTP.user.js
// @updateURL https://update.greasyfork.org/scripts/386602/TukarPointTP.meta.js
// ==/UserScript==

(function() {
            setTimeout(function() {
        document.querySelectorAll('button._12Dqa5r2')[0].click();
    }, 1000);
    setTimeout(function(){
        document.querySelectorAll("a._1snhIO8E._1PNN-liZ")[0].click();
    },1000);
})();