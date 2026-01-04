// ==UserScript==
// @name         Osu! Private Server (Akatsuki) Leaderboard Viewer 
// @namespace    https://osu.ppy.sh/
// @version      1.1.1
// @description  Adds a button to osu! beatmap pages to check their status on Akatsuki, with valid mod/mode restrictions.
// @author       ThunderBirdo
// @license      MIT
// @match        https://osu.ppy.sh/beatmapsets/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535153/Osu%21%20Private%20Server%20%28Akatsuki%29%20Leaderboard%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535153/Osu%21%20Private%20Server%20%28Akatsuki%29%20Leaderboard%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SERVER_LOGO = 'https://akatsuki.gg/static/images/logos/logo.png';
    const PRIVATE_SERVER_BASE_URL = 'https://akatsuki.gg/b/';

    function getBeatmapId() {
        const hash = window.location.hash;
        if (!hash) return null;
        const idMatch = hash.match(/\/(\d+)$/);
        return idMatch ? idMatch[1] : null;
    }

    function createRadioOption(label, groupName, value, checked = false, id = '') {
        const wrapper = document.createElement('label');
        wrapper.style.display = 'block';
        wrapper.style.margin = '3px 0';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = groupName;
        input.value = value;
        input.checked = checked;
        input.id = id;
        input.style.marginRight = '6px';

        wrapper.appendChild(input);
        wrapper.appendChild(document.createTextNode(label));
        return wrapper;
    }

    function openAkatsukiPage(beatmapId, mode, rx) {
        const url = `${PRIVATE_SERVER_BASE_URL}${beatmapId}?mode=${mode}&rx=${rx}`;
        window.open(url, '_blank');
    }

    function updateModAvailability() {
        const selectedMode = document.querySelector('input[name="mode"]:checked').value;

        // Enable all first
        document.getElementById('mod-nomod').disabled = false;
        document.getElementById('mod-relax').disabled = false;
        document.getElementById('mod-autopilot').disabled = false;

        // Disable based on mode
        if (selectedMode === '3') { // Mania
            document.getElementById('mod-relax').disabled = true;
        }

        if (selectedMode !== '0') { // Not Standard
            document.getElementById('mod-autopilot').disabled = true;
        }

        // Automatically fallback to valid mod if selected one is now invalid
        const currentMod = document.querySelector('input[name="mod"]:checked');
        if (currentMod.disabled) {
            document.getElementById('mod-nomod').checked = true;
        }
    }

    function createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = '20px';
        container.style.top = '100px';
        container.style.zIndex = 1000;
        container.style.background = '#333';
        container.style.color = 'white';
        container.style.padding = '12px';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 0 10px black';
        container.style.fontFamily = 'sans-serif';
        container.style.width = '200px';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const logo = document.createElement('img');
        logo.src = SERVER_LOGO;
        logo.style.height = '20px';
        logo.style.marginRight = '8px';

        const title = document.createElement('span');
        title.textContent = 'Check Status';
        title.style.fontWeight = 'bold';

        header.appendChild(logo);
        header.appendChild(title);
        container.appendChild(header);

        // Mod Section
        container.appendChild(document.createTextNode('Mods'));
        const modGroup = document.createElement('div');
        modGroup.appendChild(createRadioOption('No Mod', 'mod', 0, true, 'mod-nomod'));
        modGroup.appendChild(createRadioOption('Relax', 'mod', 1, false, 'mod-relax'));
        modGroup.appendChild(createRadioOption('Auto Pilot', 'mod', 2, false, 'mod-autopilot'));
        container.appendChild(modGroup);
        container.appendChild(document.createElement('hr'));

        // Mode Section
        container.appendChild(document.createTextNode('Modes'));
        const modeGroup = document.createElement('div');
        ['Standard', 'Taiko', 'Catch', 'Mania'].forEach((label, i) => {
            const modeRadio = createRadioOption(label, 'mode', i, i === 0, `mode-${label.toLowerCase()}`);
            modeRadio.querySelector('input').addEventListener('change', updateModAvailability);
            modeGroup.appendChild(modeRadio);
        });
        container.appendChild(modeGroup);

        // Button
        const button = document.createElement('button');
        button.textContent = 'View Page';
        button.style.marginTop = '10px';
        button.style.width = '100%';
        button.style.padding = '6px';
        button.style.borderRadius = '6px';
        button.style.border = 'none';
        button.style.background = '#05a';
        button.style.color = 'white';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';

        button.onclick = () => {
            const beatmapId = getBeatmapId();
            const mode = document.querySelector('input[name="mode"]:checked').value;
            const mod = document.querySelector('input[name="mod"]:checked').value;

            if (beatmapId) {
                openAkatsukiPage(beatmapId, mode, mod);
            } else {
                alert("Couldn't find beatmap ID from URL!");
            }
        };

        container.appendChild(button);
        document.body.appendChild(container);
        updateModAvailability();
    }

    setTimeout(() => {
        if (window.location.href.includes("osu.ppy.sh/beatmapsets")) {
            createUI();
        }
    }, 1000);
})();


//If you are seeing this, you've done it, you have reached the bottom of the code, you now know that this code is amazing and super cool! amazing job.