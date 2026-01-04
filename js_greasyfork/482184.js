// ==UserScript==
// @name         Lehrgangskostenwächter
// @namespace    leeSalami.lss
// @version      1.0.3
// @license      MIT
// @description  Verhindert das Nutzen kostenpflichtiger Lehrgänge
// @author       leeSalami
// @match        https://www.leitstellenspiel.de/schoolings*
// @match        https://polizei.leitstellenspiel.de/schoolings*
// @downloadURL https://update.greasyfork.org/scripts/482184/Lehrgangskostenw%C3%A4chter.user.js
// @updateURL https://update.greasyfork.org/scripts/482184/Lehrgangskostenw%C3%A4chter.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const schoolings = document.querySelectorAll('td > a[href^="/schoolings/"]');
    const schoolingsCount = schoolings.length;

    if (!schoolingsCount) {
        return;
    }

    for (let i = 0; i < schoolingsCount; i++) {
        const row = schoolings[i].parentElement.parentElement;
        const creditsCell = row.querySelector('td:nth-child(3)');

        if (!creditsCell || !creditsCell.innerText.includes('Credits') || creditsCell.innerText.trim().startsWith('0 Credits')) {
            continue;
        }

        row.style.backgroundColor = '#c9302c';
        schoolings[i].classList.add('disabled');
    }
})();
