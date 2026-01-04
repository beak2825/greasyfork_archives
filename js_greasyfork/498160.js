// ==UserScript==
// @name         Leech Display
// @namespace    jpdb.io
// @version      0.1.7
// @description  While reviewing it shows you if a card is a leech by looking at the review history
// @author       Kokuru
// @match        https://jpdb.io/review*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @license The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/498160/Leech%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/498160/Leech%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';



    window.LeechThreshold = {};
    // How many times a card has to be answered Nothing / Something to count
    window.LeechThreshold.threshold = 4
    // How many times a card has to be answered correctly before to be valid for the Threshold
    window.LeechThreshold.newProtection = 4
    // Show New Card Indicator
    window.LeechThreshold.showNewIndicator = true


    window.LeechThreshold.init = () =>{

        // Code from daruko - JPDB add context menu in reviews
        // https://greasyfork.org/en/scripts/471987-jpdb-add-context-menu-in-reviews
        const wordUri = document.querySelector('.review-reveal .answer-box a[href^="/vocabulary"]')?.href;
        const deckUri = document.querySelector('.review-reveal a[href^="/deck"]')?.href;
        if (!wordUri || !deckUri) {
            return;
        }
        const [,, wordId, word] = new URL(wordUri).pathname.split('/', 4);
        if (!word) {
            return;
        }

        fetch(`https://jpdb.io/vocabulary/${wordId}/${word}/review-history`)
            .then((response) => response.text())
            .then((text) => {
            const html = new DOMParser().parseFromString(text, "text/html");
            window.LeechThreshold.getLeechCount(html)
        })
            .catch((err) => {
            console.error('An error has occurred.', err);
        });
        // End
    };

    window.LeechThreshold.getLeechCount = (xml) =>{
        const threshold = window.LeechThreshold.threshold;
        const newProtection = window.LeechThreshold.newProtection;
        let current = 0
        let isReady = false;
        let isReadyCount = 0;
        let debugLog = [];
        let lastDate = "";
        const histories = xml.querySelectorAll(".review-history > div");
        histories.forEach((historie, index) =>{
            var state = historie.children[2].textContent;
            var date = historie.children[0].textContent.substring(0,historie.children[0].textContent.indexOf("T"));
            if (state != "Next"){
                if (lastDate == ""){
                    lastDate = date
                }
                if (isReady){
                    if (state == "Nothing" || state == "Something"){
                        if (lastDate == date){
                            debugLog.push(`${date} - [${current}][Same Day] ${state}`)
                        } else {
                            current++;
                            lastDate = date
                            debugLog.push(`${date} - [${current}] ${state}`)
                        }
                    } else {
                        debugLog.push(`${date} - [${current}] ${state}`)
                    }
                } else {
                    debugLog.push(`${date} - [Skip] ${state}`)
                    if (state == "Nothing" || state == "Something"){
                        isReadyCount = 0
                    } else {
                        isReadyCount++;
                        if (isReadyCount >= newProtection){
                            isReady = true;
                        }
                    }
                }}
        });
        console.log(histories.length, debugLog)
        const info = document.createElement("div");
        info.innerHTML = "";
        info.style.color = "green"
        info.style.position = "absolute"
        if (current >= threshold){
            info.style.color = "red"
            info.innerHTML = "> Leech <";
        }
        if (!isReady && window.LeechThreshold.showNewIndicator){
            info.innerHTML = "New";
        }
        document.querySelector(".plain").prepend(info)

        const info2 = document.createElement("div");
        info2.innerHTML = `Contamination ${current}/${threshold}`;
        info2.style.color = "#bbb"


        document.querySelector(".vbox.gap").append(info2)
    }


    window.LeechThreshold.init();
    if (document.querySelector("#show-answer"))
        document.querySelector("#show-answer").addEventListener("click", ()=>{
            setTimeout(window.LeechThreshold.init,1)
        })
    // Your code here...
})();