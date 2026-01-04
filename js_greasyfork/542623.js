// ==UserScript==
// @name         Jackpot Tracker cu refresh random
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Monitorizează câștigătorul cu refresh aleator
// @match        https://www.torn.com/page.php?sid=slotsStats*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542623/Jackpot%20Tracker%20cu%20refresh%20random.user.js
// @updateURL https://update.greasyfork.org/scripts/542623/Jackpot%20Tracker%20cu%20refresh%20random.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findWinnerAfterHeading() {
        const headings = Array.from(document.querySelectorAll('.title-black'));
        const targetHeading = headings.find(h => h.textContent.includes('Last 100 jackpot winners'));

        if (!targetHeading) return;

        const topBox = targetHeading.closest('.top-box');
        if (!topBox) return;

        const winnerLink = topBox.querySelector('ul.item li.player.icons a.user.name');
        if (!winnerLink) return;

        let rawText = winnerLink.innerText.trim();
        let lines = rawText.split('\n');
        let currentWinner = (lines.length === 2 && lines[0] === lines[1]) ? lines[0] : lines.join(' ');
        let previousWinner = localStorage.getItem('lastWinner') || '';

        if (currentWinner !== previousWinner) {
            console.log(`🎉 Câștigător nou: ${previousWinner} ➡️ ${currentWinner}`);
            localStorage.setItem('lastWinner', currentWinner);
            alert(`🟢 Avem un nou câștigător: ${currentWinner}`);
        } else {
            console.log(`⏳ Fără schimbare: ${currentWinner}`);
        }
    }

    // ✅ Pornim verificarea la încărcare
    window.addEventListener('load', findWinnerAfterHeading);

    // 🧠 Timp aleator între 55s și 65s
    let randomDelay = Math.floor(Math.random() * (65 - 55 + 1) + 55) * 1000;

    console.log(`⏱️ Următorul refresh în ${randomDelay / 1000} secunde`);

    setTimeout(() => {
        location.reload();
    }, randomDelay);
})();