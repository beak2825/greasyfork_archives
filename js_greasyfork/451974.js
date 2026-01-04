// ==UserScript==
// @name         Classroom change group name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the displayed group name to one of your liking on google classroom
// @author       You
// @match        https://classroom.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451974/Classroom%20change%20group%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/451974/Classroom%20change%20group%20name.meta.js
// ==/UserScript==

(function() {
    'use strict';
/* ==============================================================
*  Modify, add and removes entries following the format :
*
*  "Exact displayed text": "Remplacement text",
*
*  Don't forget the comma at the end exept for the last entry
*/
    const translations = {
        "Secondaire 5 PEI":     "Secondaire 5",
        "Projet personnel PEI": "Projet personnel",
        "Groupe 53":            "Français",
        "Math Groupe 74":       "Mathématique",
        "Group 53":             "Anglais",
        "Chimie groupe 85":     "Chimie",
        "81 - Physique":        "Physique",
        "ECR-53":               "ECR",
        "HMC5PI-53 (Monde contemporain)": "Monde contemporain",
        "FIN5PI-53 (Finances)": "Finances",
        "Arts PEI 53":          "Arts"
    };
//  ==============================================================

    let working = false;

    function onPageChange() {
        if (working) return;
        working = true;
        if (document.querySelector(".YVvGBb .z3vRcc-ZoZQ1") != null) {
                applyChanges();
        }
        working = false;
    }

    function applyChanges() {
        for(let element of document.querySelectorAll(".YVvGBb .z3vRcc-ZoZQ1")) {
            if (translations[element.innerText] !== undefined) {
                element.innerText = translations[element.innerText];
            }
        }
    }
    const options = {
        subtree: true,
        childList: true
    };
    new MutationObserver(onPageChange).observe(document.body,options);

})();