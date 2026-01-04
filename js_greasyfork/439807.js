// ==UserScript==
// @name         Jstris Replay PC Number
// @namespace    Jstris Replay PC Number
// @version      0.0.5
// @description  Shows PC number on Jstris replays
// @author       smdbs
// @match        https://jstris.jezevec10.com/replay*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439807/Jstris%20Replay%20PC%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/439807/Jstris%20Replay%20PC%20Number.meta.js
// ==/UserScript==

(function setupStats() {
    'use strict';
    try {
        if(document.getElementsByClassName('formulaElement').length<1){ // To not create too many elements
            $("<div class='formulaElement' style='display:none;color:#999;font-size: 32px;text-align: center;margin-top: 15px;'>1st</div>").insertBefore("#lrem");
        }
        const formulaElement = $('.formulaElement').first();
        const sprintText = $('#stPC')[0];
        var observer1 = new MutationObserver(function(mutations){
            if(sprintText.style.display=='block'){
                   $('.formulaElement').first().css('display','block'); // If PCMode then display
               }
        });
        observer1.observe(sprintText, {
            attributes:    true,
        });

        const pcElement = $('#sprintInfo div').filter('#lrem').last()[0];
        var lastPCNumber = 0
        var lastPiecesNumber = 0;
        const suffixes = ['th','st','nd','rd','th','th','th','th'];

        var observer = new MutationObserver(function(mutations) { // Listens to change on number of PCs
            let piecesElement = $("#statTable tr td").filter(function(index){return this.textContent=="#"}).next()[0];
            let newPiecesNumber = parseInt(piecesElement.innerHTML); // piece number
            let newPCNumber = parseInt(pcElement.innerHTML); // pc number
            if(newPCNumber==0){
                formulaElement.text("1st");
                return;
            }
            let displayNumber;
            if(newPiecesNumber % 5 != 0){
                /*
                14 blocks = 5 or 10 blocks @ the start
                18 blocks = 10 or 15 blocks @ the start
                */
                if (newPiecesNumber % 10 < 5) displayNumber = ((newPiecesNumber - 5) - (newPiecesNumber - 5) % 5) * 5 % 7 + 1;
                else displayNumber = (newPiecesNumber - newPiecesNumber % 10) * 5 % 7 + 1;
            }else{
                displayNumber = newPiecesNumber*5%7+1; //
            }
            let text = displayNumber+suffixes[displayNumber];

            if(newPCNumber - lastPCNumber != 1 || (newPiecesNumber - lastPiecesNumber) % 5 > 0){
                let displayNumber2 = (displayNumber + 3) % 7 + 1;
                text += '/' + displayNumber2+suffixes[displayNumber2];
            }

            formulaElement.text(text);
            lastPiecesNumber = newPiecesNumber-newPiecesNumber%5;
            lastPCNumber = newPCNumber;
        });

        observer.observe(pcElement, {
            attributes:    true,
            childList:     true,
            characterData: true
        });

    } catch (e) { // Rerun on error
        setTimeout(setupStats, 1000);
    }
})();