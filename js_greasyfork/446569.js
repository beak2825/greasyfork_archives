// ==UserScript==
// @name         MZ Market fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to view your players properly
// @author       Murder ft. tu hermana
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446569/MZ%20Market%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/446569/MZ%20Market%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    start();

    function start() {
        var checkExist = setInterval(function() {
            if(document.getElementsByClassName('skill')) {
                var skills = document.getElementsByClassName('skill');
                for(var i = 0; i < skills.length; i++) {
                    skills[i].parentElement.parentElement.style = "display: contents"
                }
                //clearInterval(checkExist);
            }
        }, 3000);
    }
})();