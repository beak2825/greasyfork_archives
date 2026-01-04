// ==UserScript==
// @name         Das' OC checker
// @version      0.1
// @namespace    https://github.com/DasLewis
// @description  adds color highlights to OCs where members do not fulfill the success chance requirements
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author       DasLewis [2524294]
// @license      MIT License
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527042/Das%27%20OC%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/527042/Das%27%20OC%20checker.meta.js
// ==/UserScript==
//DISCLAIMER: THIS SCRIPT USES SOME APPROACHES FROM "Torn Pickpocketing Colors" by Korbrm [2931507]
//https://greasyfork.org/en/scripts/477536-torn-pickpocketing-colors


(function() {
    'use strict';
    const scriptPrefix = "Das_OC_checker";
    const colorCodeBad = "#B22222";

    //success chance required for each OC level
    const ocRequirements = {
        "1" : 80,
        "2" : 80,
        "3" : 80,
        "4" : 80,
        "5" : 80,
        "6" : 80,
        "7" : 70,
        "8" : 60,
        "9" : 80,
        "10" : 80
    };

    function updateOCMarkers() {
        const url = window.location.href;
        if (!url.includes("#/tab=crimes")){
            return;
        }

        const ocElements = document.querySelectorAll('.wrapper___U2Ap7:not(.processed)');
        ocElements.forEach(ocElement => {
            const ocLevel = ocElement.querySelector('.levelValue___TE4qC').textContent.trim();
            const ocName = ocElement.querySelector('.panelTitle___aoGuV').textContent.trim();
            const ocParticipants = ocElement.querySelectorAll('.wrapper___Lpz_D');
            ocParticipants.forEach(participantWrapper => {
                if (!participantWrapper.classList.contains("waitingJoin___jq10k")) {
                    const participantSuccess = participantWrapper.querySelector('.successChance___ddHsR').textContent.trim();
                    const participantName = participantWrapper.querySelector('.badge___E7fuw').querySelectorAll('.honor-text')[1].textContent.trim();
                    if (ocRequirements[ocLevel] > participantSuccess) {
                        //console.log(`User "${participantName}" in OC "${ocName}" (Level ${ocLevel}) does not meet requirements. (${participantSuccess}/${ocRequirements[ocLevel]})`);
                        ocElement.querySelector('.wrapper___eWVgj').style.backgroundColor = colorCodeBad;
                        participantWrapper.querySelector('.slotHeader___K2BS_').style.backgroundColor = colorCodeBad;
                    }
                }
            })

            ocElement.classList.add('processed');
        });
    }

    updateOCMarkers();
    setInterval(updateOCMarkers, 1000);
})();
