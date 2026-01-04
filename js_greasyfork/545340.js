// ==UserScript==
// @name         AutoExpe
// @version      0.0.4
// @description  Auto launch your expeditions
// @author       Hibou
// @match        https://*.ogame.gameforge.com/game/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setValues
// @namespace https://greasyfork.org/users/1501974
// @downloadURL https://update.greasyfork.org/scripts/545340/AutoExpe.user.js
// @updateURL https://update.greasyfork.org/scripts/545340/AutoExpe.meta.js
// ==/UserScript==


async function waitForElement(selector) {
    return new Promise(resolve => {
        const isVisible = el => el && el.offsetParent !== null;

        const existing = document.querySelector(selector);
        if (isVisible(existing)) return resolve(existing);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (isVisible(el)) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function waitForAjaxLoadingToHide() {
    return new Promise(resolve => {
        const loading = document.querySelector('.ajax_loading');
        if (!loading || getComputedStyle(loading).display === 'none') {
            return resolve();
        }
        const observer = new MutationObserver(() => {
            if (getComputedStyle(loading).display === 'none') {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(loading, { attributes: true, attributeFilter: ['style'] });
    });
}

async function sleep(start, end) {
    const sleepTime = Math.round(Math.random() * (end - start) + start);
    console.log(`Sleeping for ${sleepTime} ms`);
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

(async function () {
    'use strict';

    // --- Constants and Regex ---
    const COORD_REGEX = /<b>(.+?) \[(\d+:\d+:\d+)\]<\/b>/;

    // --- Meta Extraction ---
    const playerId = document.querySelector('meta[name="ogame-player-id"]')?.getAttribute('content');
    const universeName = document.querySelector('meta[name="ogame-universe-name"]')?.getAttribute('content');
    const universeCommu = document.querySelector('meta[name="ogame-language"]')?.getAttribute('content');

    if (!playerId || !universeName || !universeCommu) {
        console.error('Required meta tags are missing.');
        return;
    }

    const STORAGE_KEY = `autoexpe_positions_${playerId}_${universeCommu}_${universeName}`;
    const LAUNCHED_KEY = `autoexpe_launched_${playerId}_${universeCommu}_${universeName}`;
    const CURRENT_POSITION_KEY = `autoexpe_current_position_${playerId}_${universeCommu}_${universeName}`;
    const EXPEDITION_COUNT_KEY = `autoexpe_expedition_count_${playerId}_${universeCommu}_${universeName}`;
    const TO_GHOST_OPTION = `autoexpe_toghostoption_${playerId}_${universeCommu}_${universeName}`;
    const TO_GHOST_KEY = `autoexpe_toghost_${playerId}_${universeCommu}_${universeName}`;

    // --- Storage Helpers ---
    function getStoredPositions() {
        const raw = GM_getValue(STORAGE_KEY, null);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) {
                console.error('Error parsing stored positions:', e);
            }
        }
        return [];
    }

    function addPosition(position) {
        const positions = getStoredPositions();
        // Prevent duplicates by link
        if (positions.some(p => p.link === position.link)) {
            return;
        }
        positions.push(position);
        GM_setValue(STORAGE_KEY, JSON.stringify(positions));
    }

    function setPositions(positions) {
        const obj = {};
        obj[STORAGE_KEY] = JSON.stringify(positions);
        GM_setValues(obj);
    }

    function getExpeditionCount() {
        return parseInt(GM_getValue(EXPEDITION_COUNT_KEY, '1'), 10) || 1;
    }

    function setExpeditionCount(count) {
        GM_setValue(EXPEDITION_COUNT_KEY, String(count));
    }

    function setToGhost(value) {
        GM_setValue(TO_GHOST_KEY, value);
    }

    function getToGhost() {
        return GM_getValue(TO_GHOST_KEY, false);
    }

    function setToGhostOption(value) {
        GM_setValue(TO_GHOST_OPTION, value);
    }

    function getToGhostOption() {
        return GM_getValue(TO_GHOST_OPTION, false);
    }

    // --- UI Panel Creation ---
    function renderSelectedPositions(panel, launchButton) {
        // Remove old list if it exists
        const oldList = panel.querySelector('#selected-positions');
        if (oldList) oldList.remove();
        const oldNoPositions = panel.querySelector('#no-positions');
        if (oldNoPositions) oldNoPositions.remove();

        const storedPositions = getStoredPositions();
        if (storedPositions.length > 0) {
            const selectedPositions = document.createElement('ul');
            selectedPositions.id = 'selected-positions';
            selectedPositions.style.marginTop = '10px';

            storedPositions.forEach(position => {
                const item = document.createElement('li');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                const txt = document.createElement('p');
                txt.textContent = `${position.name} [${position.coords}]`;
                item.appendChild(txt);
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.style.marginLeft = '10px';
                removeButton.addEventListener('click', () => {
                    const positions = getStoredPositions();
                    const index = positions.findIndex(p => p.link === position.link);
                    if (index !== -1) {
                        positions.splice(index, 1);
                        setPositions(positions);
                        item.remove();
                        renderSelectedPositions(panel, launchButton);
                    }
                });
                item.appendChild(removeButton);
                selectedPositions.appendChild(item);
            });
            panel.insertBefore(selectedPositions, launchButton);
        } else {
            const noPositions = document.createElement('p');
            noPositions.id = 'no-positions';
            noPositions.textContent = 'No positions stored.';
            panel.insertBefore(noPositions, launchButton);
        }
    }

    function distributeCounts(total, n) {
        if (n <= 0 || total <= 0) return Array(n).fill(0);
        const base = Math.floor(total / n);
        const rem = total % n;
        return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0));
    }

    // --- Launch Expeditions Logic ---
    function launchExpeditions() {
        const storedPositions = getStoredPositions();
        if (storedPositions.length === 0) return;
        const count = getExpeditionCount();
        const split = distributeCounts(count, storedPositions.length)
        // Set launching state
        GM_setValue(LAUNCHED_KEY, true);
        setPositions(storedPositions.map((pos, index) => {
            return {
                ...pos,
                idx: index,
                target: split[index],
                count: 0
            }
        }));

        GM_setValue(CURRENT_POSITION_KEY, JSON.stringify({ link: storedPositions[0].link, launched: 0, count }));
        window.location.reload();
    }

    function createPanel(moons) {
        const panel = document.createElement('div');
        panel.id = 'autoexpe-panel';
        panel.className = 'ogl_ogameDiv';
        panel.style.padding = '10px';
        panel.style.marginTop = '10px';
        panel.style.zIndex = 1000;

        // Title
        const title = document.createElement('h3');
        title.textContent = 'AutoExpe';
        panel.appendChild(title);

        // Expedition Count Input
        const countLabel = document.createElement('label');
        countLabel.textContent = 'Number of expeditions:';
        countLabel.style.display = 'block';
        countLabel.style.marginTop = '10px';
        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.min = '1';
        countInput.value = getExpeditionCount();
        countInput.style.marginLeft = '10px';
        countInput.style.width = '60px';
        countInput.addEventListener('change', () => {
            let val = parseInt(countInput.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            countInput.value = val;
            setExpeditionCount(val);
        });
        countLabel.appendChild(countInput);
        panel.appendChild(countLabel);

        // Moon List Dropdown
        const list = document.createElement('select');
        moons.forEach(moon => {
            const item = document.createElement('option');
            item.value = moon.link;
            item.textContent = `${moon.name} [${moon.coords}]`;
            list.appendChild(item);
        });
        panel.appendChild(list);

        // Add Button
        const button = document.createElement('button');
        button.textContent = 'Add to Expeditions';
        button.style.marginTop = '10px';
        button.addEventListener('click', () => {
            const selectedMoon = moons.find(moon => moon.link === list.value);
            if (selectedMoon) {
                addPosition(selectedMoon);
                renderSelectedPositions(panel, launchButton);
            }
        });
        panel.appendChild(button);

        // To GHOST Checkbox   

        const toGhostLabel = document.createElement('label');
        toGhostLabel.style.display = 'block';
        toGhostLabel.style.marginTop = '10px';
        const toGhostCheckbox = document.createElement('input');
        toGhostCheckbox.type = 'checkbox';
        toGhostCheckbox.checked = getToGhostOption();
        toGhostCheckbox.style.marginRight = '5px';
        toGhostCheckbox.addEventListener('change', () => {
            setToGhostOption(toGhostCheckbox.checked);
        });
        toGhostLabel.appendChild(toGhostCheckbox);
        toGhostLabel.appendChild(document.createTextNode('Ghost ships'));
        panel.appendChild(toGhostLabel);

        // Launch Button
        const launchButton = document.createElement('button');
        launchButton.textContent = 'Launch';
        launchButton.style.marginTop = '10px';
        launchButton.addEventListener('click', () => {
            setToGhost(false);
            launchExpeditions();
        });
        panel.appendChild(launchButton);

        // Initial render of selected positions (before launch button)
        renderSelectedPositions(panel, launchButton);

        // Attach panel to the page
        const linksDiv = document.querySelector('#links');
        if (linksDiv) {
            linksDiv.appendChild(panel);
        } else {
            console.error('Could not find #links to attach the panel.');
        }
        return panel;
    }

    function getMoons() {
        return Array.from(document.querySelectorAll('.moonlink')).map(moon => {
            const tooltipStr = moon.getAttribute('data-tooltip-title');
            const link = moon.getAttribute('href');
            const match = tooltipStr?.match(COORD_REGEX);
            const newUrl = link.replace(/(component=)[^&]+/, '$1fleetdispatch');
            return { link: newUrl, name: match ? match[1] : '', coords: match ? match[2] : '' };
        });
    }

    function getCurrentCoords() {
        const isPlanet = document.querySelector('.hightlightPlanet') !== null;
        const isMoon = document.querySelector('.hightlightMoon') !== null;
        let element = null;

        if (isPlanet) {
            element = document.querySelector('.hightlightPlanet > .active');
        } else if (isMoon) {
            element = document.querySelector('.hightlightMoon > .active');
        }

        if (!element) {
            console.error('No active planet or moon found.');
            return null;
        }

        const tooltipStr = element.getAttribute('data-tooltip-title');

        if (!tooltipStr) {
            console.error('No tooltip found in the active element.');
            return null;
        }

        const match = tooltipStr?.match(COORD_REGEX);

        return { type: isPlanet ? 'P' : 'M', coords: match ? match[2] : '' };
    }

    // --- Gather Moons ---
    const moons = getMoons();

    // --- Initialize Panel ---
    createPanel(moons);

    console.log('moons', moons);

    const isLaunched = GM_getValue(LAUNCHED_KEY, false);

    console.log(
        {
            isLaunched,
            currentPosKey: GM_getValue(CURRENT_POSITION_KEY, null),
            storedPos: getStoredPositions(),
            toGhost: getToGhost()
        }
    );

    if (isLaunched) {

        const positions = getStoredPositions();
        if (positions.length === 0) {
            console.error('No positions stored for expeditions.');
            GM_setValue(LAUNCHED_KEY, false);
            return;
        }


        //data-step="5"
        if (getToGhost() && getToGhostOption()) {
            const expeditionLC = await waitForElement('[data-key-id="expeditionLC"]');
            let selectAll = await waitForElement('[data-key-id="fleetSelectAll"]');
            const deathstar = await waitForElement('.deathstar .sprite_small');

            expeditionLC.click();
            await sleep(600, 1000);

            selectAll.click();
            await sleep(600, 1000);

            deathstar.click();
            await sleep(600, 1000);

            const nextBtn = document.querySelector('#continueToFleet2');
            if (!nextBtn) {
                setToGhost(false);
                return
            }

            nextBtn.click();
            await waitForAjaxLoadingToHide();

            await sleep(750, 1200);

            selectAll = await waitForElement('[data-key-id="fleetSelectAll"]');
            const sendFleetBtn = await waitForElement('#sendFleet');
            const fiftyPercent = await waitForElement('[data-step="5"]');
            const spyMission = await waitForElement('[data-mission="6"]');

            fiftyPercent.click();
            await sleep(600, 1000);

            selectAll.click();
            await sleep(600, 1000);

            spyMission.click();
            await sleep(600, 1000);

            if (sendFleetBtn) {
                setToGhost(false);
                sendFleetBtn.click();
                return;
            }
            setToGhost(false);
            return;
        }

        const currentCoords = getCurrentCoords();

        positions.sort((a, b) => { return a.idx - b.idx });

        let currentPosition = null;

        for (const pos of positions) {
            if (pos.count < pos.target) {
                currentPosition = pos;
                break;
            }
        }

        if (!currentPosition || !currentPosition.link) {
            console.error('No current position found.');
            GM_setValue(LAUNCHED_KEY, false);
            return;
        }

        if (currentCoords.type === 'P' || currentCoords.coords !== currentPosition.coords) {
            await sleep(1000, 2000);
            window.location.href = currentPosition.link;
        }

        // wait for data-key-id="expeditionSC"
        const expeditionSC = await waitForElement('[data-key-id="expeditionSC"]');
        if (!expeditionSC) {
            console.error('expeditionSC not found.');
            GM_setValue(LAUNCHED_KEY, false);
            return;
        }

        await sleep(500, 1000)
        expeditionSC.click();

        await sleep(500, 1000);
        const nextBtn = document.querySelector('#continueToFleet2');
        if (!nextBtn) {
            return
        }

        nextBtn.click();
        await sleep(750, 1200);

        const sendFleetBtn = await waitForElement('#sendFleet');


        if (sendFleetBtn) {
            await waitForAjaxLoadingToHide();
            currentPosition.count++;
            setPositions(positions.map(pos => {
                if (pos.link === currentPosition.link) {
                    return { ...pos, count: currentPosition.count };
                }
                return pos;
            }));
            console.log('Sending fleet to:', currentPosition.coords);
            console.log(getStoredPositions());

            if (currentPosition.target === currentPosition.count) {
                setToGhost(true);
            }

            sendFleetBtn.click();
        }
    }

})();
