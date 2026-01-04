// ==UserScript==
// @name         Yohoho3 Cheats Mod Menu V2
// @namespace    https://yohoho.io/
// @version      2.1
// @description  Cheats for Yohoho.com with styled mod menu, Auto Space toggle, and stats editing including Total Wins and Kills
// @author       Jadob Lane aka Luckyday999
// @match        https://yohoho.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539333/Yohoho3%20Cheats%20Mod%20Menu%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/539333/Yohoho3%20Cheats%20Mod%20Menu%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoClicking = false;
    let intervalId = null;

    function pressSpace() {
        const down = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        const up = new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        window.dispatchEvent(down);
        window.dispatchEvent(up);
    }

    // Mod Menu UI
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '20px';
    menu.style.right = '20px';
    menu.style.width = '280px';
    menu.style.background = 'rgba(0,0,0,0.85)';
    menu.style.color = '#0ff';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.fontSize = '14px';
    menu.style.padding = '12px';
    menu.style.borderRadius = '10px';
    menu.style.zIndex = 999999;
    menu.style.userSelect = 'none';
    menu.style.boxShadow = '0 0 10px #00ffff';
    menu.style.maxHeight = '90vh';
    menu.style.overflowY = 'auto';

    const titleBar = document.createElement('div');
    titleBar.style.display = 'flex';
    titleBar.style.justifyContent = 'space-between';
    titleBar.style.alignItems = 'center';
    titleBar.style.marginBottom = '10px';

    const title = document.createElement('h3');
    title.textContent = 'Yohoho3 Cheats Mod Menu';
    title.style.margin = '0';
    title.style.color = '#0ff';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Hide';
    toggleBtn.style.background = '#0ff';
    toggleBtn.style.color = '#000';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '6px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.padding = '4px 8px';
    toggleBtn.style.fontSize = '12px';

    toggleBtn.onclick = () => {
        const children = Array.from(menu.children).slice(1);
        const isHidden = children[0].style.display === 'none';
        children.forEach(el => el.style.display = isHidden ? 'block' : 'none');
        toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
    };

    titleBar.appendChild(title);
    titleBar.appendChild(toggleBtn);
    menu.appendChild(titleBar);

    function createInput(labelText, placeholder, min, max) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '4px';

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = placeholder;
        input.style.width = '100%';
        input.style.padding = '6px 8px';
        input.style.borderRadius = '5px';
        input.style.border = '1px solid #0ff';
        input.style.background = '#000';
        input.style.color = '#0ff';
        if (min !== undefined) input.min = min;
        if (max !== undefined) input.max = max;

        container.appendChild(label);
        container.appendChild(input);
        return {container, input};
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.width = '100%';
        btn.style.padding = '8px';
        btn.style.marginTop = '5px';
        btn.style.background = '#0ff';
        btn.style.color = '#000';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.onmouseenter = () => btn.style.background = '#00cccc';
        btn.onmouseleave = () => btn.style.background = '#0ff';
        btn.onclick = onClick;
        return btn;
    }

    function alertReload(msg) {
        alert(msg);
        location.reload();
    }

    // Coins
    const {container: coinsCont, input: coinsInput} = createInput('Set Coins', 'Number >= 0');
    menu.appendChild(coinsCont);
    menu.appendChild(createButton('Apply Coins', () => {
        const val = parseInt(coinsInput.value);
        if (isNaN(val) || val < 0) return alert('Invalid coin value');
        localStorage.setItem('coinsOwned', val);
        const homepageBooty = document.getElementById('homepage-booty');
        const skinPopupBooty = document.getElementById('skin-popup-booty');
        if (homepageBooty) homepageBooty.innerHTML = val;
        if (skinPopupBooty) skinPopupBooty.innerHTML = val;
        alertReload('Coins set! Reloading...');
    }));

    // XP
    const {container: xpCont, input: xpInput} = createInput('Set XP', '0 - 13500', 0, 13500);
    menu.appendChild(xpCont);
    menu.appendChild(createButton('Apply XP', () => {
        let val = parseInt(xpInput.value);
        if (isNaN(val) || val < 0) return alert('Invalid XP value');
        if (val > 13500) val = 13500;
        localStorage.setItem('playerXP', val);
        alertReload('XP set! Reloading...');
    }));

    // Skin
    const {container: skinCont, input: skinInput} = createInput('Change Character Skin', '1 - 35', 1, 35);
    menu.appendChild(skinCont);
    menu.appendChild(createButton('Apply Skin', () => {
        const val = parseInt(skinInput.value);
        if (isNaN(val) || val < 1 || val > 35) return alert('Invalid skin number');
        localStorage.setItem('playerSkin', val);
        alertReload('Skin selected! Reloading...');
    }));

    // Pet
    const {container: petCont, input: petInput} = createInput('Change Pet', '1 - 7', 1, 7);
    menu.appendChild(petCont);
    menu.appendChild(createButton('Apply Pet', () => {
        const val = parseInt(petInput.value);
        if (isNaN(val) || val < 1 || val > 7) return alert('Invalid pet number');
        localStorage.setItem('playerPet', val);
        alertReload('Pet selected! Reloading...');
    }));

    // Pet Level
    const {container: petLvlCont, input: petLvlInput} = createInput('Set Pet Level', '1 - 14', 1, 14);
    menu.appendChild(petLvlCont);
    menu.appendChild(createButton('Apply Pet Level', () => {
        const val = parseInt(petLvlInput.value);
        if (isNaN(val) || val < 1 || val > 14) return alert('Invalid pet level');
        localStorage.setItem('playerPetLevel', val);
        alertReload('Pet level set! Reloading...');
    }));

    // Island
    const islandCont = document.createElement('div');
    islandCont.style.marginTop = '10px';
    islandCont.style.marginBottom = '10px';

    const islandLabel = document.createElement('label');
    islandLabel.textContent = 'Teleport to Island';
    islandLabel.style.display = 'block';
    islandLabel.style.marginBottom = '4px';
    islandCont.appendChild(islandLabel);

    const islandSelect = document.createElement('select');
    islandSelect.style.width = '100%';
    islandSelect.style.padding = '6px 8px';
    islandSelect.style.borderRadius = '5px';
    islandSelect.style.border = '1px solid #0ff';
    islandSelect.style.background = '#000';
    islandSelect.style.color = '#0ff';
    islandSelect.innerHTML = `
        <option value="">-- Select Island --</option>
        <option value="0">Tortuga</option>
        <option value="140">Beach</option>
        <option value="700">Easter</option>
        <option value="2100">Wreck</option>
        <option value="4400">Aztec</option>
        <option value="7600">Volcano</option>
        <option value="13500">Village</option>
    `;
    islandCont.appendChild(islandSelect);
    menu.appendChild(islandCont);
    menu.appendChild(createButton('Teleport', () => {
        const val = islandSelect.value;
        if (!val) return alert('Select an island first');
        localStorage.setItem('playerXP', val);
        alertReload('Island set! Reloading...');
    }));

    // Auto Space Toggle
    const autoBtn = createButton('Auto Space: OFF', () => {
        autoClicking = !autoClicking;
        if (autoClicking) {
            intervalId = setInterval(() => pressSpace(), 100);
            autoBtn.textContent = 'Auto Space: ON';
        } else {
            clearInterval(intervalId);
            intervalId = null;
            autoBtn.textContent = 'Auto Space: OFF';
        }
    });
    menu.appendChild(autoBtn);

    // Last Game Time
    const {container: lastTimeCont, input: lastTimeInput} = createInput('Set Last Game Time', 'Milliseconds >= 0', 0);
    menu.appendChild(lastTimeCont);
    menu.appendChild(createButton('Apply Last Game Time', () => {
        const val = parseInt(lastTimeInput.value);
        if (isNaN(val) || val < 0) return alert('Invalid time value');
        localStorage.setItem('lastGameTime', val);
        alertReload('Last Game Time set! Reloading...');
    }));

    // Best Game Time
    const {container: bestTimeCont, input: bestTimeInput} = createInput('Set Best Game Time', 'Milliseconds >= 0', 0);
    menu.appendChild(bestTimeCont);
    menu.appendChild(createButton('Apply Best Game Time', () => {
        const val = parseInt(bestTimeInput.value);
        if (isNaN(val) || val < 0) return alert('Invalid time value');
        localStorage.setItem('bestGameTime', val);
        alertReload('Best Game Time set! Reloading...');
    }));

    // Total Time
    const {container: totalTimeCont, input: totalTimeInput} = createInput('Set Total Time', 'Milliseconds >= 0', 0);
    menu.appendChild(totalTimeCont);
    menu.appendChild(createButton('Apply Total Time', () => {
        const val = parseInt(totalTimeInput.value);
        if (isNaN(val) || val < 0) return alert('Invalid time value');
        localStorage.setItem('totalTime', val);
        alertReload('Total Time set! Reloading...');
    }));

    // Total Game Wins
    const {container: winsCont, input: winsInput} = createInput('Set Total Game Wins', 'Wins count', 0);
    menu.appendChild(winsCont);
    menu.appendChild(createButton('Apply Total Wins', () => {
        const val = parseInt(winsInput.value);
        if (isNaN(val) || val < 0) return alert('Invalid win value');
        localStorage.setItem('totalWins', val);
        alertReload('Total wins set! Reloading...');
    }));

    // Total Game Kills
    const {container: killsCont, input: killsInput} = createInput('Set Total Game Kills', 'Kills count', 0);
    menu.appendChild(killsCont);
    menu.appendChild(createButton('Apply Game Kills', () => {
        const val = parseInt(killsInput.value);
        if (isNaN(val) || val < 0) return alert('Invalid kill value');
        localStorage.setItem('totalKills', val);
        localStorage.setItem('bestKills', val);
        localStorage.setItem('lastKills', val);
        alertReload('Total kills set! Reloading...')
    }));

    document.body.appendChild(menu);

    // Dragging Support
    let dragging = false, offsetX, offsetY;
    titleBar.style.cursor = 'move';
    titleBar.addEventListener('mousedown', e => {
        dragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        menu.style.transition = 'none';
    });
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        menu.style.left = e.clientX - offsetX + 'px';
        menu.style.top = e.clientY - offsetY + 'px';
        menu.style.right = 'auto';
    });

    document.title = '*HACKED* YoHoHo.COM - pirate battle royale io game';
})();
