// ==UserScript==
// @name         TrustDice Faucet Auto Claim + Captcha solver - Free Bitcoin (BTC)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Klikne na tlačidlo "Nárok" na faucete po manuálnom riešení Captcha a spustí sa znova po 6:05–6:10h
// @author       You
// @match        https://trustdice.win/cs/faucet
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547352/TrustDice%20Faucet%20Auto%20Claim%20%2B%20Captcha%20solver%20-%20Free%20Bitcoin%20%28BTC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547352/TrustDice%20Faucet%20Auto%20Claim%20%2B%20Captcha%20solver%20-%20Free%20Bitcoin%20%28BTC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcia na kliknutie tlačidla
    function clickClaimButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        const claimButton = buttons.find(btn => btn.textContent.trim() === "Nárok");

        if (claimButton) {
            console.log("Tlačidlo 'Nárok' nájdené. Čakám 3s pred klikom, aby bolo možné vyriešiť Captcha...");
            setTimeout(() => {
                claimButton.click();
                console.log("Klikol som na tlačidlo 'Nárok'!");
            }, 3000);
        } else {
            console.log("Tlačidlo 'Nárok' nenájdené. Skúšam znova o 5s...");
            setTimeout(clickClaimButton, 5000);
        }
    }

    // Spustenie funkcie
    clickClaimButton();

    // Automatické spustenie po 6:05 – 6:10 hod
    const baseDelay = (6 * 60 * 60 * 1000) + (5 * 60 * 1000); // 6h + 5 min
    const randomExtra = Math.random() * (5 * 60 * 1000); // 0 – 5 min
    const randomDelay = baseDelay + randomExtra;

    console.log(`Skript sa znovu spustí o cca ${Math.round(randomDelay / 60000)} minút.`);
    setTimeout(() => {
        window.location.reload();
    }, randomDelay);

})();
