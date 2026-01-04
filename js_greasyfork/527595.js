// ==UserScript==
// @name         Torn - Refill & Cooldown Reminders 2.0
// @namespace    odung.wowow
// @version      0.2
// @description  This script requires your gender icon not to be disabled. Displays reminder buttons at the top of the screen if your cooldowns are at 0 or energy/nerve refills have not been used. Points building and items page have a toggle button that will change the notice's link from your own items/refills and your faction's armory, as well as disabling that notice. If you use armory refills, click the relevant button to remove the reminder.
// @author       Baccy
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527595/Torn%20-%20Refill%20%20Cooldown%20Reminders%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/527595/Torn%20-%20Refill%20%20Cooldown%20Reminders%2020.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let settings;

    function displayNotice(text, url) {
        const anchor = document.createElement('a');
        const id = `${text.replace(/\s+/g, '-')}-odung`;
        anchor.id = id;
        anchor.style.cssText = 'display: inline-block; padding: 5px; font-size: 14px; border-radius: 5px; background-color: #444; color: #fff; border: 1px solid #ccc; cursor: pointer; text-decoration: none; text-align: center;';
        anchor.textContent = text;
        anchor.href = url;
        anchor.addEventListener("mouseover", () => {
            anchor.style.backgroundColor = "#555";
            anchor.style.color = "#ddd";
        });
        anchor.addEventListener("mouseout", () => {
            anchor.style.backgroundColor = "#444";
            anchor.style.color = "#fff";
        });

        const header = document.querySelector('#topHeaderBanner');
        header.style.textAlign = 'center';
        if (!document.querySelector(`#${id}`) && header) header.appendChild(anchor);
    }

    function addToggles(buttons, title, urls) {
        let header;
        if (!title) header = [...document.querySelectorAll('h4')].find(el => el.innerText.trim() === 'Points Building');
        else header = document.querySelector(title);
        const headerParent = document.querySelector('#topHeaderBanner');
        let newHeader = document.querySelector('.duckwowowcooldownsrefills');
        if (!newHeader) {
            newHeader = document.createElement('div');
            newHeader.style.textAlign = 'center';
            newHeader.className = 'duckwowowcooldownsrefills';
        }
        headerParent.appendChild(newHeader);
        for (const button of buttons) {
            const key = button.toLowerCase();
            if (!document.querySelector(`#${key}-toggle-odung`) && header) {
                const currentSetting = settings[key];
                const currentUrl = currentSetting.url;
                const currentOption = urls[currentUrl] || urls['N/A'];

                const label = document.createElement('label');
                label.id = `${key}-toggle-odung`;
                label.style.cssText = `display: inline-block; text-align: center; padding: 5px; font-size: 14px !important; line-height: 14px !important; width: 60px; border-radius: 5px; background-color: #444; margin: 0px 5px 0px 5px; color: #fff; border: 1px solid ${currentOption.color}; cursor: pointer; text-decoration: none; text-align: center;`;
                label.innerText = button;
                label.addEventListener("mouseover", () => {
                    label.style.backgroundColor = "#555";
                    label.style.color = "#ddd";
                });
                label.addEventListener("mouseout", () => {
                    label.style.backgroundColor = "#444";
                    label.style.color = "#fff";
                });
                label.addEventListener('click', () => {
                    const originalText = button;

                    const keys = Object.keys(urls);
                    let currentIndex = keys.indexOf(currentSetting.url);
                    do {
                        currentIndex = (currentIndex + 1) % keys.length;
                    } while (button === 'Casino' && keys[currentIndex] === 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=points');


                    const newUrl = keys[currentIndex];
                    const newOption = urls[newUrl];

                    settings[key].url = newUrl;
                    settings[key].enabled = newOption.enabled;
                    localStorage.setItem('odung_refill_cooldown_notice', JSON.stringify(settings));

                    label.style.border = `1px solid ${newOption.color}`;
                    label.innerText = newOption.display;

                    setTimeout(() => {
                        label.innerText = originalText;
                    }, 1000);

                    let existingNotice;
                    if (button === 'Drug' || button === 'Booster' || button === 'Medical') existingNotice = document.querySelector(`#${button}-Cooldown-odung`)
                    else existingNotice = document.querySelector(`#${button}-Refill-odung`)
                    if (existingNotice) existingNotice.href = newUrl;

                    if (newUrl === 'N/A' && existingNotice) existingNotice.remove();
                });

                newHeader.appendChild(label);
            }
        }
    }

    function observePointsPage() {
        const observer = new MutationObserver(() => {
            if (!window.location.href.includes('sid=points')) {
                observer.disconnect();
                return;
            }

            const energy = document.querySelector('[class*="buttonContainer"][class*="refillEnergy"][class*="owned"]');
            const nerve = document.querySelector('[class*="buttonContainer"][class*="refillNerve"][class*="owned"]');
            const casino = document.querySelector('[class*="buttonContainer"][class*="refillCasinoTokens"][class*="owned"]');
            if (energy) {
                settings.refills.energy = true;
                const existingEnergyNotice = document.querySelector('#Energy-Refill-odung');
                if (existingEnergyNotice) existingEnergyNotice.remove();
            }
            if (nerve) {
                settings.refills.nerve = true;
                const existingNerveNotice = document.querySelector('#Nerve-Refill-odung');
                if (existingNerveNotice) existingNerveNotice.remove();
            }
            if (casino) {
                settings.refills.casino = true;
                const existingCasinoNotice = document.querySelector('#Casino-Refill-odung');
                if (existingCasinoNotice) existingCasinoNotice.remove();
            }
            if (energy || nerve || casino) localStorage.setItem('odung_refill_cooldown_notice', JSON.stringify(settings));
            if (energy && !settings.nerve.enabled && !settings.casino.enabled) observer.disconnect();
            else if (energy && nerve && !settings.casino.enabled) observer.disconnect();
            else if (energy && nerve && casino) observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function addConfirmButtons() {
        function createLabel(text) {
            const label = document.createElement('label');
            label.className = 'odung-confirm-button';
            label.style.cssText = `display: inline-block; padding: 5px; font-size: 14px !important; line-height: 14px !important; width: 60px; border-radius: 5px; background-color: #444; margin: 0px 5px 0px 5px; color: #fff; border: 1px solid #ccc; cursor: pointer; text-decoration: none; text-align: center;`;
            label.innerText = text;
            label.addEventListener("mouseover", () => {
                label.style.backgroundColor = "#555";
                label.style.color = "#ddd";
            });
            label.addEventListener("mouseout", () => {
                label.style.backgroundColor = "#444";
                label.style.color = "#fff";
            });
            label.addEventListener('click', () => {
                settings.refills[text.toLowerCase()] = true;
                localStorage.setItem('odung_refill_cooldown_notice', JSON.stringify(settings));

                const existingNotice = document.querySelector(`#${text}-Refill-odung`);
                if (existingNotice) existingNotice.remove();
                label.remove()
            });

            return label;
        }

        const header = document.querySelector('#skip-to-content');
        if (!document.querySelector('.odung-confirm-button') && header) {
            const energy = createLabel('Energy')
            const nerve = createLabel('Nerve')
            if (settings.energy.enabled && !settings.refills.energy) header.appendChild(energy);
            if (settings.nerve.enabled && !settings.refills.nerve) header.appendChild(nerve);
        }
    }

    function checkTime() {
        const todayUTC = new Date().toISOString().split('T')[0];

        if (settings.refills.dayChecked !== todayUTC) {
            settings.refills.energy = false;
            settings.refills.nerve = false;
            settings.refills.casino = false;
            settings.refills.dayChecked = todayUTC;
            localStorage.setItem('odung_refill_cooldown_notice', JSON.stringify(settings));
        }
    }

    function init() {
        try {
            settings = JSON.parse(localStorage.getItem('odung_refill_cooldown_notice')) || {energy: {enabled: true, url: 'https://www.torn.com/page.php?sid=points'}, nerve: {enabled: true, url: 'https://www.torn.com/page.php?sid=points'}, casino: {enabled: true, url: 'https://www.torn.com/page.php?sid=points'}, drug: {enabled: true, url: 'https://www.torn.com/item.php'}, booster: {enabled: true, url: 'https://www.torn.com/item.php'}, medical: {enabled: true, url: 'https://www.torn.com/item.php'}, refills: {energy: false, nerve: false, casino: false, dayChecked: ''}};
        } catch (error) {
            console.warn('Refill & Cooldown Notices: Error loading settings, using default settings instead.');
            settings = {energy: {enabled: true, url: 'https://www.torn.com/page.php?sid=points'}, nerve: {enabled: true, url: 'https://www.torn.com/page.php?sid=points'}, casino: {enabled: true, url: 'https://www.torn.com/page.php?sid=points'}, drug: {enabled: true, url: 'https://www.torn.com/item.php'}, booster: {enabled: true, url: 'https://www.torn.com/item.php'}, medical: {enabled: true, url: 'https://www.torn.com/item.php'}, refills: {energy: false, nerve: false, casino: false, dayChecked: ''}};
        }

        const url = window.location.href;
        if (url.includes('sid=points')) {
            observePointsPage();
            addToggles(['Energy', 'Nerve', 'Casino'], false, { 'https://www.torn.com/page.php?sid=points': {color: 'lightgreen', display: 'Points', enabled: true}, 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=points': {color: 'red', display: 'Armory', enabled: true}, 'N/A': {color: '#ccc', display: 'Disabled', enabled: false}});
        } else if (url.includes('item.php')) {
            addToggles(['Drug'], '#skip-to-content', { 'https://www.torn.com/item.php': {color: 'lightgreen', display: 'Items', enabled: true}, 'https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=drugs': {color: 'red', display: 'Armory', enabled: true}, 'N/A': {color: '#ccc', display: 'Disabled', enabled: false}});
            addToggles(['Booster'], '#skip-to-content', { 'https://www.torn.com/item.php': {color: 'lightgreen', display: 'Items', enabled: true}, 'https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=boosters': {color: 'red', display: 'Armory', enabled: true}, 'N/A': {color: '#ccc', display: 'Disabled', enabled: false}});
            addToggles(['Medical'], '#skip-to-content', { 'https://www.torn.com/item.php': {color: 'lightgreen', display: 'Items', enabled: true}, 'https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=medical': {color: 'red', display: 'Armory', enabled: true}, 'N/A': {color: '#ccc', display: 'Disabled', enabled: false}});
        } else if (url.includes('factions.php?step=your')) {
            addConfirmButtons();
        }

        checkTime();

        const observer = new MutationObserver(() => {
            if (document.querySelector('[aria-label="Male"]') || document.querySelector('[aria-label="Female"]') || document.querySelector('[aria-label="Enby"]')) {
                if (settings.drug.enabled && !document.querySelector('[aria-label*="Drug Cooldown"]')) displayNotice('Drug Cooldown', settings.drug.url);
                if (settings.booster.enabled && !document.querySelector('[aria-label*="Booster Cooldown"]')) displayNotice('Booster Cooldown', settings.booster.url);
                if (settings.medical.enabled && !document.querySelector('[aria-label*="Medical Cooldown"]')) displayNotice('Medical Cooldown', settings.medical.url);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        if (settings.energy.enabled && !settings.refills.energy) displayNotice('Energy Refill', settings.energy.url);
        if (settings.nerve.enabled && !settings.refills.nerve) displayNotice('Nerve Refill', settings.nerve.url);
        if (settings.casino.enabled && !settings.refills.casino) displayNotice('Casino Refill', settings.casino.url);
    }

    init();
})();