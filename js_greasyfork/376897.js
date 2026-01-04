// ==UserScript==
// @name         Chortle Cheat
// @namespace    http://programmedlessons.org/
// @version      0.3
// @description  Takes Chortle quizzes and reviews for you
// @author       Shiv Trivedi
// @match        http://programmedlessons.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376897/Chortle%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/376897/Chortle%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("input[type=button]").forEach(b => {b.click();})
    var y = document.getElementsByName("answer");
    for (var i = 0; i < y.length; i++) {
        console.log((i+1)+". "+y[i].value);
        switch(y[i].value) {
            case "A":
                document.getElementsByName("questradio")[((i+1)*4)-4].click();
                break;
            case "B":
                document.getElementsByName("questradio")[((i+1)*4)-3].click();
                break;
            case "C":
                document.getElementsByName("questradio")[((i+1)*4)-2].click();
                break;
            case "D":
                document.getElementsByName("questradio")[((i+1)*4)-1].click();
                break;
        }
    }
    document.querySelector("input[value='grade quiz']").click();
})();
