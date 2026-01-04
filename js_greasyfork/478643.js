// ==UserScript==
// @name         hoggson's Chain Watcher
// @version      2.3
// @description  Alerts player when chain timer drops below user-defined value by flashing the screen red and/or playing a sound. Also provides a Random Target button to quickly attack a random level 1 player, all accessible via a toggleable popup menu with persistent settings. Clicking the icon in the Chain Watch button loads a random target directly. Icon changes on hover to indicate target mode. Now includes Recent Attacks viewer (sorted by respect) with API key input and toggle.
// @author       hoggson
// @match        https://www.torn.com/*
// @icon         https://torn.com/favicon.ico
// @grant        none
// @license      MIT
// @namespace    https://modgaming.co.uk/hcw/hcw.user.js
// @downloadURL https://update.greasyfork.org/scripts/478643/hoggson%27s%20Chain%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/478643/hoggson%27s%20Chain%20Watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previousStateBelowThreshold = false;
    let alertedForCurrentThreshold = false;

    // Load saved settings or defaults
    let alertThresholdInSeconds = parseInt(localStorage.getItem('alertThreshold')) || 150;
    let selectedSound = localStorage.getItem('alertSound') || 'alarm';
    let alertVolume = (localStorage.getItem('alertVolume') || 100) / 100;
    let openMode = localStorage.getItem('openMode') || 'current';
    let screenFlashEnabled = (localStorage.getItem('screenFlashEnabled') !== 'false');
    let apiKey = localStorage.getItem('tornApiKey') || '';

    // Sounds
    const sounds = {
        silent: null,
        beep: 'https://hoggson.co.uk/hcw/beep.mp3',
        alarm: 'https://hoggson.co.uk/hcw/alarm.mp3',
        siren: 'https://hoggson.co.uk/hcw/siren.mp3'
    };

    // Random Target Finder
    const minID = 3000000;
    const maxID = 3400000;
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // --- ICON TOGGLE BUTTON ---
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Chain Watch';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '5%';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '10001';
    toggleButton.style.backgroundColor = '#28a745';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '3px 8px';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';

    const icon = document.createElement('img');
    icon.src = 'https://hoggson.co.uk/hcw/chainwatch.ico';
    icon.style.width = '16px';
    icon.style.height = '16px';
    icon.style.marginRight = '5px';
    toggleButton.prepend(icon);
    document.body.appendChild(toggleButton);

    // Hover swap
    icon.addEventListener('mouseenter', () => {
        icon.src = 'https://hoggson.co.uk/hcw/chainwatchtarget.ico';
    });
    icon.addEventListener('mouseleave', () => {
        icon.src = 'https://hoggson.co.uk/hcw/chainwatch.ico';
    });

    // Icon click → Random Target
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        let randID = getRandomNumber(minID, maxID);
        let profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${randID}`;
        if (openMode === 'newtab') {
            window.open(profileLink, '_blank');
        } else {
            window.location.href = profileLink;
        }
    });

    // --- POPUP MENU ---
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = `calc(${toggleButton.style.top} + 35px)`;
    popup.style.right = '10px';
    popup.style.zIndex = '10000';
    popup.style.background = 'rgba(0,0,0,0.8)';
    popup.style.padding = '8px';
    popup.style.borderRadius = '6px';
    popup.style.display = 'none';
    document.body.appendChild(popup);

    function obfuscateKey(key) {
        if (!key) return '';
        return key.slice(0, 4) + '*'.repeat(Math.max(0, key.length - 4));
    }

    function createControls() {
        // Timer dropdown
        const timerDropdown = document.createElement('select');
        [30, 60, 90, 120, 150, 180, 210, 240, 270].forEach(seconds => {
            const option = document.createElement('option');
            option.value = seconds;
            option.textContent = `${seconds / 60} minutes`;
            timerDropdown.appendChild(option);
        });
        timerDropdown.value = alertThresholdInSeconds;
        timerDropdown.addEventListener('change', (e) => {
            alertThresholdInSeconds = parseInt(e.target.value);
            localStorage.setItem('alertThreshold', alertThresholdInSeconds);
            alertedForCurrentThreshold = false;
        });

        // Screen Flash
        const flashWrapper = document.createElement('label');
        flashWrapper.style.color = 'white';
        flashWrapper.style.marginLeft = '5px';
        flashWrapper.style.fontSize = '12px';
        flashWrapper.style.display = 'inline-flex';
        flashWrapper.style.alignItems = 'center';

        const flashCheckbox = document.createElement('input');
        flashCheckbox.type = 'checkbox';
        flashCheckbox.checked = screenFlashEnabled;
        flashCheckbox.style.marginRight = '3px';
        flashCheckbox.addEventListener('change', (e) => {
            screenFlashEnabled = e.target.checked;
            localStorage.setItem('screenFlashEnabled', screenFlashEnabled);
        });

        flashWrapper.appendChild(flashCheckbox);
        flashWrapper.appendChild(document.createTextNode('Screen Flash'));

        // Sound dropdown
        const soundDropdown = document.createElement('select');
        Object.keys(sounds).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            soundDropdown.appendChild(option);
        });
        soundDropdown.value = selectedSound;
        soundDropdown.addEventListener('change', (e) => {
            selectedSound = e.target.value;
            localStorage.setItem('alertSound', selectedSound);
        });

        // Volume slider
        const volumeWrapper = document.createElement('div');
        volumeWrapper.style.display = 'inline-flex';
        volumeWrapper.style.alignItems = 'center';
        volumeWrapper.style.marginLeft = '5px';

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = 0;
        volumeSlider.max = 100;
        volumeSlider.value = localStorage.getItem('alertVolume') || 100;

        const volumeLabel = document.createElement('span');
        volumeLabel.textContent = `Volume: ${volumeSlider.value}%`;
        volumeLabel.style.color = 'white';
        volumeLabel.style.marginLeft = '5px';
        volumeLabel.style.fontSize = '12px';

        volumeSlider.addEventListener('input', (e) => {
            alertVolume = e.target.value / 100;
            localStorage.setItem('alertVolume', e.target.value);
            volumeLabel.textContent = `Volume: ${e.target.value}%`;
        });

        volumeWrapper.appendChild(volumeSlider);
        volumeWrapper.appendChild(volumeLabel);

        // Test button
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Sound';
        testButton.style.marginLeft = '5px';
        testButton.style.backgroundColor = '#28a745';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.padding = '3px 8px';
        testButton.style.borderRadius = '4px';
        testButton.style.cursor = 'pointer';
        testButton.addEventListener('click', () => {
            playAlertSound();
        });

        // Open mode dropdown
        const openModeDropdown = document.createElement('select');
        ['current', 'newtab'].forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            option.textContent = mode === 'current' ? 'Current Window' : 'New Tab';
            openModeDropdown.appendChild(option);
        });
        openModeDropdown.value = openMode;
        openModeDropdown.style.marginLeft = '5px';
        openModeDropdown.addEventListener('change', (e) => {
            openMode = e.target.value;
            localStorage.setItem('openMode', openMode);
        });

        // Random Target button
        const randomTargetButton = document.createElement('button');
        randomTargetButton.textContent = 'Random Target';
        randomTargetButton.style.marginLeft = '5px';
        randomTargetButton.style.backgroundColor = '#28a745';
        randomTargetButton.style.color = 'white';
        randomTargetButton.style.border = 'none';
        randomTargetButton.style.padding = '3px 8px';
        randomTargetButton.style.borderRadius = '4px';
        randomTargetButton.style.cursor = 'pointer';
        randomTargetButton.addEventListener('click', () => {
            let randID = getRandomNumber(minID, maxID);
            let profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${randID}`;
            if (openMode === 'newtab') {
                window.open(profileLink, '_blank');
            } else {
                window.location.href = profileLink;
            }
        });

        // Help button
        const helpButton = document.createElement('button');
        helpButton.textContent = 'Help';
        helpButton.style.marginLeft = '5px';
        helpButton.style.backgroundColor = '#007bff';
        helpButton.style.color = 'white';
        helpButton.style.border = 'none';
        helpButton.style.padding = '3px 8px';
        helpButton.style.borderRadius = '4px';
        helpButton.style.cursor = 'pointer';
        helpButton.addEventListener('click', () => {
            window.open('https://hoggson.co.uk/hcw', '_blank');
        });

        // Attack List toggle checkbox
        const attackToggleWrapper = document.createElement('label');
        attackToggleWrapper.style.color = 'white';
        attackToggleWrapper.style.marginTop = '5px';
        attackToggleWrapper.style.fontSize = '12px';
        attackToggleWrapper.style.display = 'inline-flex';
        attackToggleWrapper.style.alignItems = 'center';

        const attackToggleCheckbox = document.createElement('input');
        attackToggleCheckbox.type = 'checkbox';
        attackToggleCheckbox.style.marginRight = '3px';
        attackToggleCheckbox.checked = (localStorage.getItem('attackListEnabled') === 'true');

        attackToggleCheckbox.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('attackListEnabled', enabled);
            if (enabled) {
                showAttackBox();
            } else {
                hideAttackBox();
            }
        });

        attackToggleWrapper.appendChild(attackToggleCheckbox);
        attackToggleWrapper.appendChild(document.createTextNode('Enable Attack List'));

        // API Key input
        const apiWrapper = document.createElement('div');
        apiWrapper.style.marginTop = '8px';
        apiWrapper.style.display = 'flex';
        apiWrapper.style.flexDirection = 'column';

        const apiLabel = document.createElement('label');
        apiLabel.textContent = 'Torn API Key';
        apiLabel.style.color = 'white';
        apiLabel.style.fontSize = '12px';
        apiLabel.style.marginBottom = '3px';

        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.style.width = '100%';
        apiInput.style.padding = '3px';
        apiInput.style.borderRadius = '4px';
        apiInput.style.border = '1px solid #555';
        apiInput.value = obfuscateKey(apiKey);

        apiInput.addEventListener('focus', () => {
            apiInput.value = apiKey; // show full key when editing
        });
        apiInput.addEventListener('blur', () => {
            apiKey = apiInput.value.trim();
            localStorage.setItem('tornApiKey', apiKey);
            apiInput.value = obfuscateKey(apiKey); // mask again

            if (apiKey && apiKey.length > 4) {
                // Auto-enable attack list
                localStorage.setItem('attackListEnabled', 'true');
                showAttackBox();
                attackToggleCheckbox.checked = true;
            } else {
                // ✅ If key is cleared, disable attack list
                localStorage.setItem('attackListEnabled', 'false');
                hideAttackBox();
                attackToggleCheckbox.checked = false;
            }
        });

        apiWrapper.appendChild(apiLabel);
        apiWrapper.appendChild(apiInput);

        // Append everything to popup
        popup.appendChild(timerDropdown);
        popup.appendChild(flashWrapper);
        popup.appendChild(soundDropdown);
        popup.appendChild(volumeWrapper);
        popup.appendChild(testButton);
        popup.appendChild(openModeDropdown);
        popup.appendChild(randomTargetButton);
        popup.appendChild(attackToggleWrapper);
        popup.appendChild(helpButton);
        popup.appendChild(apiWrapper);
    }

    // Toggle popup visibility
    toggleButton.addEventListener('click', () => {
        popup.style.display = (popup.style.display === 'none') ? 'block' : 'none';
    });

    // --- CORE FUNCTIONS (Chain Watcher) ---
    function checkChainTimer() {
        const timerElement = document.querySelector('.bar-timeleft___B9RGV');
        if (timerElement) {
            const timerText = timerElement.textContent.trim();
            const timeParts = timerText.split(':');
            const minutes = parseInt(timeParts[0], 10);
            const seconds = parseInt(timeParts[1], 10);
            const totalTimeInSeconds = (minutes * 60) + seconds;

            if (totalTimeInSeconds < alertThresholdInSeconds) {
                if (!alertedForCurrentThreshold) {
                    alertedForCurrentThreshold = true;
                }
                if (screenFlashEnabled) {
                    flashScreenRed();
                }
                playAlertSound();
                previousStateBelowThreshold = true;
            } else {
                previousStateBelowThreshold = false;
                alertedForCurrentThreshold = false;
            }
        }
    }

    function flashScreenRed() {
        const flashDiv = document.createElement('div');
        flashDiv.style.position = 'fixed';
        flashDiv.style.top = '0';
        flashDiv.style.left = '0';
        flashDiv.style.width = '100vw';
        flashDiv.style.height = '100vh';
        flashDiv.style.backgroundColor = 'red';
        flashDiv.style.zIndex = '-1';
        document.body.appendChild(flashDiv);
        setTimeout(() => { flashDiv.remove(); }, 1000);
    }

    function playAlertSound() {
        if (selectedSound === 'silent') return;
        const audio = new Audio(sounds[selectedSound]);
        audio.volume = alertVolume;
        audio.play().catch(err => {
            console.warn("Audio playback failed:", err);
        });
    }

    // Build controls inside popup
    createControls();

    // Start checking the chain timer every 2 seconds
    setInterval(checkChainTimer, 2000);

    // --- ATTACK VIEWER FUNCTIONS ---
    let currentPage = 0;
    let cachedAttacks = [];
    const hospitalTimers = {};
    const profileCache = {};
    let hospitalInterval = null;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    function startHospitalCountdown() {
        if (hospitalInterval) clearInterval(hospitalInterval);
        hospitalInterval = setInterval(() => {
            for (const id in hospitalTimers) {
                const timer = hospitalTimers[id];
                if (timer.remaining > 0) {
                    timer.remaining -= 5;
                    const el = document.getElementById(`hospital-${id}`);
                    if (el) el.textContent = `🏥 Hospital: ${formatTime(timer.remaining)}`;
                }
            }
        }, 5000);
    }

    async function fetchAttacks() {
        if (!apiKey) return [];
        try {
            const response = await fetch(`https://api.torn.com/user/?selections=attacks&key=${apiKey}`);
            const data = await response.json();
            const attacks = Object.values(data.attacks || {});
            return attacks
                .sort((a, b) => parseFloat(b.respect || 0) - parseFloat(a.respect || 0))
                .slice(0, 100);
        } catch {
            return [];
        }
    }

    async function fetchDefenderProfile(id) {
        if (profileCache[id]) return profileCache[id];
        try {
            const res = await fetch(`https://api.torn.com/user/${id}?selections=profile&key=${apiKey}`);
            const data = await res.json();
            const level = data.level || 'N/A';
            let hospitalTime = null;
            let isHospital = false;
            let until = 0;
            if (data.status?.state === 'Hospital') {
                isHospital = true;
                until = data.status.until;
                const now = Math.floor(Date.now() / 1000);
                const remaining = until - now;
                if (remaining > 0) hospitalTime = formatTime(remaining);
            }
            profileCache[id] = { level, hospitalTime, isHospital, until };
            return profileCache[id];
        } catch {
            return { level: 'N/A', hospitalTime: null, isHospital: false, until: 0 };
        }
    }

    async function renderPage() {
        const box = document.getElementById('attackBox');
        box.innerHTML = '<h2>Recent Attacks (Sorted by Respect)</h2>';
        Object.keys(hospitalTimers).forEach(id => delete hospitalTimers[id]);

        const seenIds = new Set();
        const pageAttacks = [];

        for (let i = currentPage * 10; i < cachedAttacks.length && pageAttacks.length < 10; i++) {
            const attack = cachedAttacks[i];
            const id = attack.defender_id;
            if (!seenIds.has(id)) {
                seenIds.add(id);
                pageAttacks.push(attack);
            }
        }

        for (const attack of pageAttacks) {
            const name = attack.defender_name || 'Unknown';
            const id = attack.defender_id || '';
            const respect = parseFloat(attack.respect || 0);

            const { level, hospitalTime, isHospital, until } = await fetchDefenderProfile(id);

            const entry = document.createElement('div');
            entry.className = `attack-entry ${isHospital ? 'hospital' : 'alive'}`;
            entry.innerHTML = `
                <a href="https://www.torn.com/profiles.php?XID=${id}" target="_blank"><strong>${name}</strong></a>
                (Lvl ${level})<br>
                Respect: ${respect.toFixed(2)}
            `;

            if (isHospital) {
                const now = Math.floor(Date.now() / 1000);
                const remaining = until - now;
                hospitalTimers[id] = { remaining };
                entry.innerHTML += `<br><span id="hospital-${id}">🏥 Hospital: ${formatTime(remaining)}</span>`;
            } else {
                entry.innerHTML += `<br>🟢 Alive`;
            }

            box.appendChild(entry);
        }

        // --- Controls row ---
        const controls = document.createElement('div');
        controls.className = 'refresh-controls';
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.justifyContent = 'space-between';

        // Refresh button
        const refreshDataBtn = document.createElement('button');
        refreshDataBtn.textContent = '🔄 Refresh';
        refreshDataBtn.onclick = async () => {
            cachedAttacks = await fetchAttacks();
            Object.keys(profileCache).forEach(id => delete profileCache[id]);
            renderPage();
        };

        // Previous page button
        const prevPageBtn = document.createElement('button');
        prevPageBtn.textContent = '⏮️ Prev';
        prevPageBtn.onclick = () => {
            currentPage--;
            if (currentPage < 0) {
                currentPage = Math.floor((cachedAttacks.length - 1) / 10);
            }
            renderPage();
        };

        // Page indicator (short form, centered)
        const pageIndicator = document.createElement('span');
        pageIndicator.style.color = 'white';
        pageIndicator.style.flex = '1';
        pageIndicator.style.textAlign = 'center';
        pageIndicator.textContent = `${currentPage + 1} of ${Math.max(1, Math.ceil(cachedAttacks.length / 10))}`;

        // Next page button
        const nextPageBtn = document.createElement('button');
        nextPageBtn.textContent = '⏭️ Next';
        nextPageBtn.onclick = () => {
            currentPage++;
            if (currentPage * 10 >= cachedAttacks.length) currentPage = 0;
            renderPage();
        };

        // Build row
        controls.appendChild(refreshDataBtn);
        controls.appendChild(prevPageBtn);
        controls.appendChild(pageIndicator);
        controls.appendChild(nextPageBtn);
        box.appendChild(controls);

        startHospitalCountdown();
    }

    function showAttackBox() {
        let box = document.getElementById('attackBox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'attackBox';
            box.style.position = 'fixed';
            box.style.top = 'calc(5% + 40px)';
            box.style.right = '10px';
            box.style.width = '420px';
            box.style.maxHeight = '600px';
            box.style.overflowY = 'auto';
            box.style.background = 'rgba(0,0,0,0.8)';
            box.style.color = '#fff';
            box.style.border = '1px solid #444';
            box.style.borderRadius = '6px';
            box.style.padding = '8px';
            box.style.zIndex = '9999';
            box.style.fontFamily = 'Arial, sans-serif';
            document.body.appendChild(box);
        }
        box.style.display = 'block';
        (async () => {
            cachedAttacks = await fetchAttacks();
            renderPage();
        })();
    }

    function hideAttackBox() {
        const box = document.getElementById('attackBox');
        if (box) box.style.display = 'none';
    }

    // Restore Attack List state on load
    if (localStorage.getItem('attackListEnabled') === 'true' && apiKey) {
        showAttackBox();
    }

    // --- ATTACK VIEWER STYLES (Unified with Chain Watcher) ---
    const style = document.createElement('style');
    style.textContent = `
        #attackBox {
            background: rgba(0,0,0,0.8);
            color: white;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 8px;
            font-size: 12px;
        }
        #attackBox h2 {
            margin-top: 0;
            font-size: 14px;
            border-bottom: 1px solid #555;
            padding-bottom: 4px;
            color: #28a745; /* same green as Chain Watcher button */
        }
        .attack-entry {
            border-bottom: 1px solid #333;
            padding: 5px 0;
        }
        .attack-entry a {
            color: #4fc3f7;
            text-decoration: none;
        }
        .attack-entry a:hover {
            text-decoration: underline;
        }
        .alive::before {
            content: "🟢 ";
        }
        .hospital::before {
            content: "🏥 ";
            color: #dc3545; /* Bootstrap red */
        }
        .refresh-controls {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }
        .refresh-controls button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 3px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .refresh-controls button:hover {
            background-color: #218838;
        }
    `;
    document.head.appendChild(style);

})();
