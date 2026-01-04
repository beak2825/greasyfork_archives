// ==UserScript==
// @name        keyboard shotcut like typracer
// @namespace   Violentmonkey Scripts
// @match       https://monkeytype.com/
// @grant       none
// @version     1.0
// @author      -
// @description 6.5.2021, 00:19:25
// @downloadURL https://update.greasyfork.org/scripts/427343/keyboard%20shotcut%20like%20typracer.user.js
// @updateURL https://update.greasyfork.org/scripts/427343/keyboard%20shotcut%20like%20typracer.meta.js
// ==/UserScript==

window.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.altKey && e.key == "k"){
        document.getElementById("nextTestButton").click();
    }
});