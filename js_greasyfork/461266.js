// ==UserScript==
// @name         Netflix Subtitle Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press T to hide/show subtitle
// @author       AndrewJ
// @match        *://www.netflix.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/2876/2876090.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461266/Netflix%20Subtitle%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/461266/Netflix%20Subtitle%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function addListener(e) {
        if ( e.keyCode == 84) { // T
            let elem_main_subs = document.getElementsByClassName("player-timedtext")[0];

            if (elem_main_subs) {
                let newDiv = document.getElementById("newSubParent");
                if (!newDiv) {
                    newDiv = document.createElement("div");
                    newDiv.setAttribute("id", "newSubParent");
                    elem_main_subs.parentElement.appendChild(newDiv);
                }

                if (elem_main_subs.parentElement.id === "newSubParent") {
                    newDiv.parentElement.appendChild(elem_main_subs);
                } else {
                    newDiv.appendChild(elem_main_subs);
                }
            }

    }
    }, false);
})();