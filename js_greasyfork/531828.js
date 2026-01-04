// ==UserScript==
// @name         Cartel Empire - Quick Refills/Resets
// @namespace    baccy.ce
// @version      0.1.4
// @description  Adds buttons to pages to allow you to quick use point refills and resets without being on the Supporter page. Change energyBarRefill to true to allow clicking the energy bar with 0 energy using your energy refill
// @author       Baccy
// @match        https://cartelempire.online/*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531828/Cartel%20Empire%20-%20Quick%20RefillsResets.user.js
// @updateURL https://update.greasyfork.org/scripts/531828/Cartel%20Empire%20-%20Quick%20RefillsResets.meta.js
// ==/UserScript==


(async function() {
    'use strict';


    const energyBarRefill = false; //true; // Change to true to allow clicking the energy bar activating your energy refill if it is at 0 energy


    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const day = now.getUTCDate();

    const settings = await GM.getValue('pointsData', {});

    function energyBar() {
        if (settings.refillEnergy && settings.refillEnergy === day) return;
        const energyBar = document.querySelector('#energyProgress').parentElement;
        energyBar.addEventListener('click', async () => {
            const currentEnergy = document.querySelector('#currentEnergy');
            if (parseInt(currentEnergy.textContent) === 0) {
                const response = await fetch('https://cartelempire.online/Supporter/Refill/Energy', { method: 'POST' });
                if (response.ok) {
                    settings.refillEnergy = day;
                    await GM.setValue('pointsData', settings);
                    window.location.reload();
                }
            }
        });
    }

    async function addButtons() {
        let title = null;
        let url;
        let header = 1;
        let key;
        switch (location.pathname) {
            case '/Supporter':
                title = 'Supporter';
                break;
            case '/PetShop':
                title = 'Reset Pets';
                url = 'https://cartelempire.online/Supporter/ResetPetShop';
                key = 'resetPetSlots';
                break;
            case '/Town/Club':
                title = 'Reset Sicarios';
                url = 'https://cartelempire.online/Supporter/ResetClubRecruitment';
                key = 'resetSicarioRecruitmentSlots';
                break;
            case '/Casino/Blackjack':
                title = 'Refill Tokens';
                url = 'https://cartelempire.online/Supporter/ResetTokens';
                key = 'resetCasinoTokens';
                break;
            case '/Casino/Spinner':
                title = 'Refill Tokens';
                url = 'https://cartelempire.online/Supporter/ResetTokens';
                key = 'resetCasinoTokens';
                break;
            case '/Casino/Slots':
                title = 'Refill Tokens';
                url = 'https://cartelempire.online/Supporter/ResetTokens';
                key = 'resetCasinoTokens';
                break;
            case '/Casino/Lottery':
                title = 'Refill Tokens';
                url = 'https://cartelempire.online/Supporter/ResetTokens';
                key = 'resetCasinoTokens';
                header = 3;
                break;
            case '/Gym':
                title = 'Refill Energy';
                url = 'https://cartelempire.online/Supporter/Refill/Energy';
                key = 'refillEnergy';
                header = 0;
                break;
            case '/University':
                title = 'Refill Energy';
                url = 'https://cartelempire.online/Supporter/Refill/Energy';
                key = 'refillEnergy';
                header = 0;
                break;
            case '/Hospital':
                title = 'Refill Life';
                url = 'https://cartelempire.online/Supporter/Refill/Life';
                key = 'refillLife';
                header = 0;
                break;
            default:
                break;
        }
        if (title !== null) {
            if (title === 'Supporter') {
                const keys = ['resetPetSlots', 'refillLife', 'refillEnergy', 'resetCasinoTokens', 'resetSicarioRecruitmentSlots'];
                for (const key of keys) {
                    const el = document.getElementById(key);
                    if (el && el.classList.contains('disabled')) {
                        settings[key] = day;
                    }
                }
                await GM.setValue('pointsData', settings);
            } else {
                if (settings[key] && settings[key] === day) return;
                const headers = document.querySelectorAll('.header-section');
                if (headers[header]) {
                    headers[header].style.cssText = 'display: flex; justify-content: space-between;';
                    const button = document.createElement('button');
                    button.textContent = title;
                    button.style.cssText = 'background: #1e1e1e; color: #fff; border: 1px solid #555; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 14px;';
                    button.addEventListener('click', async () => {
                        button.style.pointerEvents = 'none';
                        button.style.opacity = '50%';
                        const response = await fetch(url, { method: 'POST' });
                        if (response.ok) {
                            settings[key] = day;
                            await GM.setValue('pointsData', settings);
                            window.location.reload();
                        } else {
                            button.style.pointerEvents = '';
                            button.style.opacity = '100%';
                        }
                    });
                    headers[header].appendChild(button);
                }
            }
        }
    }


    if (energyBarRefill) energyBar();
    addButtons();
})();