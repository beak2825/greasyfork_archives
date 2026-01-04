// ==UserScript==
// @name         RCD-Torn2
// @namespace    **Imperatriz[2683794]**
// @version      1.1
// @description  Remove Crimes 2.0 Description Torn
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489751/RCD-Torn2.user.js
// @updateURL https://update.greasyfork.org/scripts/489751/RCD-Torn2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetNode = document.querySelector("div.crimes-app");
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver(async (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            let mutationTarget = mutation.target;

            if (mutation.type === 'childList' && mutationTarget.classList.contains('arrowButton___gYTVW')) {
                $("div.currentCrime___KNKYQ").on("click", "div.topSection___HchKK div.crimeBanner___LiKtj div.crimeSliderArrowButtons___N_y4N button.arrowButton___gYTVW", function(){
                    observer.disconnect();
                    setTimeout(function(){
                        observer.observe(targetNode, observerConfig);
                    }, 800);
                });
            }

            if (mutation.type === 'childList' && mutationTarget.classList.contains('outcomePanel___yyL3R')) {
                mutationTarget.style.height = '100px';
                let outcomeDiv = mutationTarget.querySelector('div.outcome___Tnb4M');
                let storyp = mutationTarget.querySelector('p.story___GmRvQ');

                if (outcomeDiv == null || outcomeDiv.hasAttribute('data-value-set')) {
                    continue;
                }

                outcomeDiv.setAttribute('data-value-set', '');
                storyp.innerText = '';
            }
        }
    });

    observer.observe(targetNode, observerConfig);
})();
