// ==UserScript==
// @name         Nix Posted
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the posted grades columns from the Infinite Campus Gradebook for Iowa City Community School District teachers
// @author       Jeff Conner
// @match        https://iowacityia.infinitecampus.org/campus/apps/gradebook
// @icon         https://www.google.com/s2/favicons?domain=infinitecampus.org
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/433634/Nix%20Posted.user.js
// @updateURL https://update.greasyfork.org/scripts/433634/Nix%20Posted.meta.js
// ==/UserScript==

var timecount = 0;

function nixPostedLoop(){

    setTimeout(function(){

        var cell = document.querySelector("#assignTable > col:nth-child(3)");
        cell.style.width = '74px';

        var cell2 = document.querySelector("#assignTable > col:nth-child(6)");
        cell2.style.width = '76px';

        while ((document.querySelector("[id*='post']"))!==null) {
            var elem = document.querySelector("[id*='post']"); elem.remove();
        };

        timecount++;

        if (timecount < 15){
            nixPostedLoop();
        }

    }, 1500);
};

nixPostedLoop();
