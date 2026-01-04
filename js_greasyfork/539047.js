// ==UserScript==
// @name         Torn Job Icon Addiction Warning (Torn PDA)
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  Highlights the job icon based on your addiction level using Torn PDA. Color changes: green (-0 to -5), orange (-6 to -9), red (-10 to -20). Resets after rehab.
// @author       OGChigs
// @license      GPL-3.0
// @match        https://www.torn.com/*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539047/Torn%20Job%20Icon%20Addiction%20Warning%20%28Torn%20PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539047/Torn%20Job%20Icon%20Addiction%20Warning%20%28Torn%20PDA%29.meta.js
// ==/UserScript==

/* 
This script depends on Torn PDA being present and configured with a valid Torn API key.
It will color the job icon based on your addiction level:
- Green for addiction between 0 and -5
- Orange for addiction between -6 and -9
- Red for addiction between -10 and -20
Addiction value is reset after visiting rehab.
*/

(function () {
    'use strict';

    const ADDICTION_THRESHOLDS = {
        green: -5,
        orange: -9,
        red: -20
    };

    // Inject custom styles
    const style = document.createElement('style');
    style.textContent = `
        .addiction-green {
            box-shadow: 0 0 5px 2px #4caf50 !important;
        }
        .addiction-orange {
            box-shadow: 0 0 5px 2px #ff9800 !important;
        }
        .addiction-red {
            box-shadow: 0 0 5px 2px #f44336 !important;
        }
    `;
    document.head.appendChild(style);

    function waitForTornPDA() {
        if (typeof window.TornPDA === 'undefined' || typeof TornPDA.get === 'undefined') {
            setTimeout(waitForTornPDA, 500);
        } else {
            checkAddiction();
            setInterval(checkAddiction, 60000);
        }
    }

    function checkAddiction() {
        TornPDA.get('user', ['personalstats'])
            .then(data => {
                const addiction = data?.personalstats?.addiction || 0;
                updateJobIcon(addiction);
            })
            .catch(err => console.error('[Addiction Warning] Error fetching data:', err));
    }

    function updateJobIcon(addiction) {
        const jobIcon = document.querySelector('li.jobs-button');
        if (!jobIcon) return;

        jobIcon.classList.remove('addiction-green', 'addiction-orange', 'addiction-red');

        if (addiction >= ADDICTION_THRESHOLDS.green) {
            jobIcon.classList.add('addiction-green');
        } else if (addiction >= ADDICTION_THRESHOLDS.orange) {
            jobIcon.classList.add('addiction-orange');
        } else if (addiction >= ADDICTION_THRESHOLDS.red) {
            jobIcon.classList.add('addiction-red');
        }

        jobIcon.title = `Addiction Level: ${addiction}`;
    }

    waitForTornPDA();
})();