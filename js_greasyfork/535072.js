// ==UserScript==
// @name         Dead Frontier Tooltip DPS Injector
// @author       ils94
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Injects DPS into #infoBox on hover and also into static boxes for exact weapon name matches, caching data in localStorage for 24 hours.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=82*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=84
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535072/Dead%20Frontier%20Tooltip%20DPS%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/535072/Dead%20Frontier%20Tooltip%20DPS%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dpsData = {};

    function loadDPS() {
        const cacheKey = 'deadFrontierDPSData';
        const timestampKey = 'deadFrontierDPSTimestamp';
        const cacheDuration = 24 * 60 * 60 * 1000;

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(timestampKey);

        if (cachedData && cachedTimestamp) {
            const timeElapsed = Date.now() - parseInt(cachedTimestamp, 10);
            if (timeElapsed < cacheDuration) {
                dpsData = JSON.parse(cachedData);
                console.log('[DPS] Loaded', Object.keys(dpsData).length, 'entries from localStorage');
                startWatcher();
                injectDPSIntoStaticBoxes();
                return;
            }
        }

        fetch('https://fairview.deadfrontier.com/onlinezombiemmo/dfdata/damagepersec.php')
            .then(r => r.text())
            .then(text => {
                const regex = /(.+?)\s*:\s*<b>([\d.]+)<\/b>\s*\(<b>([\d.]+)<\/b>\)<br \/>/g;
                let m;
                while ((m = regex.exec(text)) !== null) {
                    const name = m[1].trim();
                    dpsData[name.toLowerCase()] = {
                        name,
                        base: m[2],
                        mod: m[3]
                    };
                }
                localStorage.setItem(cacheKey, JSON.stringify(dpsData));
                localStorage.setItem(timestampKey, Date.now().toString());
                console.log('[DPS] Loaded', Object.keys(dpsData).length, 'entries from server and saved to localStorage');
                startWatcher();
                injectDPSIntoStaticBoxes();
            })
            .catch(err => {
                console.error('[DPS] Failed to load DPS list:', err);
                if (cachedData) {
                    dpsData = JSON.parse(cachedData);
                    console.log('[DPS] Loaded', Object.keys(dpsData).length, 'entries from localStorage (fallback)');
                    startWatcher();
                    injectDPSIntoStaticBoxes();
                }
            });
    }

    function startWatcher() {
        setInterval(() => {
            const box = document.getElementById('infoBox');
            if (!box || box.style.visibility === 'hidden') return;

            const nameEl = box.querySelector('.itemName');
            if (!nameEl) return;

            const weapon = nameEl.textContent.trim();
            const key = weapon.toLowerCase();

            const entry = dpsData[key];
            if (!entry) {
                const old = box.querySelector('.dpsInjected');
                if (old) old.remove();
                const oldDisclaimer = box.querySelector('.dpsDisclaimer');
                if (oldDisclaimer) oldDisclaimer.remove();
                console.log(`[DPS] ✗ ${weapon} (hover, no exact match)`);
                return;
            }

            const old = box.querySelector('.dpsInjected');
            if (old) old.remove();
            const oldDisclaimer = box.querySelector('.dpsDisclaimer');
            if (oldDisclaimer) oldDisclaimer.remove();

            const line = document.createElement('div');
            line.className = 'itemData dpsInjected';
            line.style.color = '#00FF00';
            line.textContent = `DPS: ${entry.base} (Theoretical: ${entry.mod})`;
            box.appendChild(line);

            const disclaimer = document.createElement('div');
            disclaimer.className = 'itemData dpsDisclaimer';
            disclaimer.style.color = '#FFFF00';
            disclaimer.style.fontSize = '0.9em';
            disclaimer.textContent = 'The values may not match what you see in-game.';
            box.appendChild(disclaimer);

            console.log(`[DPS] ✔ ${weapon} (hover)`);
        }, 1000);
    }

    function injectDPSIntoStaticBoxes() {
        const staticBoxes = document.querySelectorAll('.itemName');

        staticBoxes.forEach(nameEl => {
            const parent = nameEl.parentElement;
            if (!parent || parent.querySelector('.dpsInjected')) return;

            const weapon = nameEl.textContent.trim();
            const key = weapon.toLowerCase();

            const entry = dpsData[key];
            if (!entry) {
                console.log(`[DPS] ✗ ${weapon} (static, no exact match)`);
                return;
            }

            const line = document.createElement('div');
            line.className = 'itemData dpsInjected';
            line.style.color = '#00FF00';
            line.textContent = `DPS: ${entry.base} (Theoretical: ${entry.mod})`;
            parent.appendChild(line);

            const disclaimer = document.createElement('div');
            disclaimer.className = 'itemData dpsDisclaimer';
            disclaimer.style.color = '#FFFF00';
            disclaimer.style.fontSize = '0.9em';
            disclaimer.textContent = 'The values may not match what you see in-game.';
            parent.appendChild(disclaimer);

            console.log(`[DPS] ✔ ${weapon} (static)`);
        });
    }

    loadDPS();
})();