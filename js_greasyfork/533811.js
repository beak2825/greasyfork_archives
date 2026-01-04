// ==UserScript==
// @name         AMA Artist 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AMA section
// @author       JMB
// @license      JMB
// @match        https://www.billboard.com/amasvote/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533811/AMA%20Artist.user.js
// @updateURL https://update.greasyfork.org/scripts/533811/AMA%20Artist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {

        function expandKpopSection() {
            const kpopButton = document.querySelector('button#accordion-button-\\:r16\\:');
            
            if (!kpopButton) {
                console.log("❌ K-Pop section button not found.");
                return;
            }

            const ariaExpanded = kpopButton.getAttribute('aria-expanded');
            if (ariaExpanded === 'false') {
                kpopButton.click();
                console.log("✅ K-Pop section expanded.");
            } else {
                console.log("❌ K-Pop section is already expanded.");
            }

            setTimeout(voteForJimin, 2000);
        }

        function voteForJimin() {
            const jiminCard = document.querySelector('a[data-nominee="jimin"]');
            if (!jiminCard) {
                console.log("❌ Jimin's nominee card not found.");
                return;
            }

            jiminCard.click();
            console.log("✅ Clicked Jimin's nominee card.");

            setTimeout(() => {
                const increaseBtn = document.querySelector('button[aria-label="Increase Votes"]');
                const voteBtn = document.querySelector('button.Vote_submit-button');

                if (!increaseBtn || !voteBtn) {
                    console.log("❌ Increase or Vote button not found.");
                    return;
                }

                let votes = 1;
                const maxVotes = 25;
                const interval = setInterval(() => {
                    if (votes >= maxVotes) {
                        clearInterval(interval);
                        voteBtn.click();
                        console.log(`✅ Submitted ${votes} votes for Jimin!`);
                    } else {
                        increaseBtn.click();
                        votes++;
                        console.log(`✅ Increased votes to ${votes}`);
                    }
                }, 300);
            }, 2000);
        }

        expandKpopSection();
    });

})();
