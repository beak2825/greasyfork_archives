// ==UserScript==
// @name         MooMoo hotkeys + auto eat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto eats
// @author       meatman2tasty
// @match        http://moomoo.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28069/MooMoo%20hotkeys%20%2B%20auto%20eat.user.js
// @updateURL https://update.greasyfork.org/scripts/28069/MooMoo%20hotkeys%20%2B%20auto%20eat.meta.js
// ==/UserScript==

$("#gameCanvas").keydown(function(event){
    if(event.keyCode == 69){
        $("#actionBarItem0").click();
    }
});