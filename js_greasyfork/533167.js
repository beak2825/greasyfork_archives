// ==UserScript==
// @name         Auto Scroll/Jump Back Helper (Scroll Position Saver/Tracker)
// @namespace    https://nemeth.it/
// @version      0.3
// @description  Detects sudden scroll jumps and restores your previous position automatically or on click. (+ Settings)
// @license      MIT
// @author       nemeth.it
// @match        *://*/*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/533167/Auto%20ScrollJump%20Back%20Helper%20%28Scroll%20Position%20SaverTracker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533167/Auto%20ScrollJump%20Back%20Helper%20%28Scroll%20Position%20SaverTracker%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const defaultSettings = {
        whitelist: ['manga', 'manhua','webtoon'],
        pixelThreshold: 3000,
        trackInterval: 3000,
        maxButtons: 10,
        maxHistory: 400,
        settingsBtnAnchor: 'bottom left',
        containerAnchor: 'right center',
        settingsBtnOffsetX: 10,
        settingsBtnOffsetY: 10,
        offsetX: 20,
        offsetY: 20,
        autoJump: false,
        autoJumpDelay: 1000,
    };

    const anchorOptions = ['top right', 'top left', 'bottom right', 'bottom left', 'right center', 'left center', 'top center', 'bottom center', 'center'];
    const staticWhitelist = ['greasyfork.org'];
    const settingsKey = 'scroll_jump_saver_settings';
    let settings = sanitizeSettings(await loadSettings());
    let pendingAutoJump = null;

    const url = window.location.href.toLowerCase();
    const lowerUrl = url.toLowerCase();
    const isWhitelisted = staticWhitelist.some(entry => lowerUrl.includes(entry.toLowerCase())) || settings.whitelist.some(entry => lowerUrl.includes(entry.toLowerCase()));
    
    if (!isWhitelisted) {
        return;
    } else {
        console.log("This page is on the whitelist, scroll helper started."); 
    }


    const positionHistory = [];
    const buttonContainer = document.createElement('div');
    applyAnchor(buttonContainer, settings.containerAnchor, settings.offsetX, settings.offsetY);
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column-reverse';
    buttonContainer.style.gap = '8px';
    document.body.appendChild(buttonContainer);

    let lastPosition = window.scrollY;

    setInterval(() => {
        const currentPosition = window.scrollY;
        positionHistory.push(currentPosition);
        if (positionHistory.length > settings.maxHistory) positionHistory.shift();

        const diff = currentPosition - lastPosition;
        if (diff >= settings.pixelThreshold && getButtonCount() < settings.maxButtons) {
            const wrapper = createJumpButton(lastPosition);
            if (settings.autoJump) {
                if (pendingAutoJump) clearTimeout(pendingAutoJump);
                pendingAutoJump = setTimeout(() => {
                    if (document.body.contains(wrapper)) {
                        wrapper.querySelector('div').click();
                        pendingAutoJump = null;
                    }
                }, settings.autoJumpDelay);
            }
        }
        lastPosition = currentPosition;
        handleCleanupButton();
    }, settings.trackInterval);

    function sanitizeSettings(input) {
        const safe = { ...defaultSettings, ...input };
        safe.pixelThreshold = Math.max(1, safe.pixelThreshold || 5000);
        safe.trackInterval = Math.max(1, safe.trackInterval || 2000);
        safe.autoJumpDelay = Math.max(1, safe.autoJumpDelay || 1000);
        safe.maxButtons = Math.max(1, safe.maxButtons);
        safe.maxHistory = Math.max(10, safe.maxHistory);
        safe.offsetX = Math.max(0, safe.offsetX || 10);
        safe.offsetY = Math.max(0, safe.offsetY || 10);
        safe.settingsBtnOffsetX = Math.max(0, safe.settingsBtnOffsetX || 10);
        safe.settingsBtnOffsetY = Math.max(0, safe.settingsBtnOffsetY || 10);
        safe.containerAnchor = anchorOptions.includes(safe.containerAnchor) ? safe.containerAnchor : 'top right';
        safe.settingsBtnAnchor = anchorOptions.includes(safe.settingsBtnAnchor) ? safe.settingsBtnAnchor : 'top right';
        return safe;
    }

    function createJumpButton(scrollPos) {
        const wrapper = document.createElement('div');

        scrollPos = Math.round(scrollPos) === scrollPos ? scrollPos : scrollPos.toFixed(1);

        wrapper.className = 'jump-btn';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '4px';
        wrapper.style.background = 'rgba(0,0,0,0.7)';
        wrapper.style.color = '#fff';
        wrapper.style.padding = '6px 10px';
        wrapper.style.borderRadius = '4px';
        wrapper.style.fontSize = '14px';
        wrapper.style.cursor = 'pointer';
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'opacity 0.5s';

        const btn = document.createElement('div');
        btn.textContent = settings.autoJump ? `AutoJump back to ${scrollPos}px in ${(settings.autoJumpDelay/1000).toFixed(2)}sec` : `Jump back to position ${scrollPos}px`;
        btn.title = `Jump back to position ${scrollPos}px`;
        btn.style.flex = '1';
        btn.style.textAlign = 'right';
        btn.onclick = () => {
            window.scrollTo({ top: scrollPos, behavior: 'smooth' });
            wrapper.remove();
            if (pendingAutoJump && document.body.contains(wrapper)) {
                clearTimeout(pendingAutoJump);
                pendingAutoJump = null;
            }
            handleCleanupButton();
        };

        const close = document.createElement('div');
        close.textContent = '✕';
        close.style.marginLeft = '8px';
        close.style.cursor = 'pointer';
        close.onclick = (e) => {
            e.stopPropagation();
            wrapper.remove();
            if (pendingAutoJump && document.body.contains(wrapper)) {
                clearTimeout(pendingAutoJump);
                pendingAutoJump = null;
            }
            handleCleanupButton();
        };

        wrapper.appendChild(btn);
        wrapper.appendChild(close);
        buttonContainer.appendChild(wrapper);

        requestAnimationFrame(() => {
            wrapper.style.opacity = '1';
        });

        return wrapper;
    }

    function handleCleanupButton() {
        const existing = document.getElementById('mass-remove-btn');
        const btnCount = getButtonCount();
        if (btnCount > 1 && !existing) {
            const massBtn = document.createElement('div');
            massBtn.id = 'mass-remove-btn';
            massBtn.textContent = `✕ Remove all buttons`;
            massBtn.style.background = 'rgba(255,0,0,0.7)';
            massBtn.style.color = '#fff';
            massBtn.style.padding = '6px 10px';
            massBtn.style.borderRadius = '4px';
            massBtn.style.fontSize = '12px';
            massBtn.style.cursor = 'pointer';
            massBtn.onclick = () => {
                const all = buttonContainer.querySelectorAll('.jump-btn');
                all.forEach(btn => btn.remove());
                massBtn.remove();
            };
            buttonContainer.insertBefore(massBtn, buttonContainer.firstChild);
        } else if (btnCount <= 1 && existing) {
            existing.remove();
        }
    }

    function getButtonCount() {
        return buttonContainer.querySelectorAll('.jump-btn').length;
    }

    function applyAnchor(element, anchor, offsetX, offsetY) {
        const positions = {
            'top right': { top: offsetY + 'px', right: offsetX + 'px' },
            'top left': { top: offsetY + 'px', left: offsetX + 'px' },
            'bottom right': { bottom: offsetY + 'px', right: offsetX + 'px' },
            'bottom left': { bottom: offsetY + 'px', left: offsetX + 'px' },
            'right center': { top: '50%', right: offsetX + 'px', transform: 'translateY(-50%)' },
            'left center': { top: '50%', left: offsetX + 'px', transform: 'translateY(-50%)' },
            'top center': { top: offsetY + 'px', left: '50%', transform: 'translateX(-50%)' },
            'bottom center': { bottom: offsetY + 'px', left: '50%', transform: 'translateX(-50%)' },
            'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        };
        const chosen = positions[anchor] || positions['top right'];
        for (const [key, value] of Object.entries(chosen)) {
            element.style[key] = value;
        }
    }

    // SETTINGS UI FOLGT IN TEIL 2...


    // Gemeinsamer Wrapper für Settings-Button und AutoJump-Toggle
    const settingsBtnWrapper = document.createElement('div');
    settingsBtnWrapper.style.position = 'fixed';
    settingsBtnWrapper.style.zIndex = '9999';
    settingsBtnWrapper.style.display = 'flex';
    settingsBtnWrapper.style.alignItems = 'center';
    settingsBtnWrapper.style.gap = '6px';
    document.body.appendChild(settingsBtnWrapper);

    // AutoJump Toggle-Button [▶️]/[⏸]
    const autoJumpBtn = document.createElement('div');
    autoJumpBtn.textContent = settings.autoJump ? '[↪️]' : '[⏹️]';
    autoJumpBtn.style.cursor = 'pointer';
    autoJumpBtn.style.fontSize = '20px';
    autoJumpBtn.style.userSelect = 'none';
    autoJumpBtn.onclick = () => {
        settings.autoJump = !settings.autoJump;
        autoJumpBtn.textContent = settings.autoJump ? '[↪️]' : '[⏹️]';
        GM_setValue(settingsKey, JSON.stringify(settings));
    };
    settingsBtnWrapper.appendChild(autoJumpBtn);

    // ⚙️ Settings-Button
    const settingsBtn = document.createElement('div');
    settingsBtn.textContent = '⚙️';
    settingsBtn.style.cursor = 'pointer';
    settingsBtn.style.fontSize = '20px';
    settingsBtn.style.userSelect = 'none';
    settingsBtnWrapper.appendChild(settingsBtn);

    // Ausrichtung beider Buttons entsprechend den gespeicherten Einstellungen
    applyAnchor(settingsBtnWrapper, settings.settingsBtnAnchor, settings.settingsBtnOffsetX, settings.settingsBtnOffsetY);

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.3)';
    overlay.style.display = 'none';
    overlay.style.zIndex = '9998';
    document.body.appendChild(overlay);

    const settingsMenu = document.createElement('div');
    settingsMenu.style.position = 'fixed';
    settingsMenu.style.background = 'rgba(255,255,255,0.95)';
    settingsMenu.style.color = '#000';
    settingsMenu.style.padding = '10px';
    settingsMenu.style.borderRadius = '6px';
    settingsMenu.style.display = 'none';
    settingsMenu.style.zIndex = '9999';
    settingsMenu.style.minWidth = '340px';
    settingsMenu.style.boxShadow = '0 0 20px rgba(0,0,0,0.4)';
    settingsMenu.style.position = 'fixed';
    settingsMenu.style.maxWidth = '400px';
    settingsMenu.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(settingsMenu);

    settingsBtn.onclick = () => {
        renderSettingsMenu();
        settingsMenu.style.display = 'block';
        overlay.style.display = 'block';

        // Kurz sichtbar machen, damit wir Größe berechnen können
        settingsMenu.style.visibility = 'hidden';
        settingsMenu.style.left = '0px';
        settingsMenu.style.top = '0px';

        // Nach einem Frame Größe auslesen
        requestAnimationFrame(() => {
            const btnRect = settingsBtn.getBoundingClientRect();
            const menuRect = settingsMenu.getBoundingClientRect();
            const padding = 10;

            let top = btnRect.bottom + padding;
            let left = btnRect.left;

            if (left + menuRect.width > window.innerWidth) {
                left = window.innerWidth - menuRect.width - padding;
            }
            if (top + menuRect.height > window.innerHeight) {
                top = btnRect.top - menuRect.height - padding;
                if (top < 0) top = padding;
            }

            settingsMenu.style.left = `${left}px`;
            settingsMenu.style.top = `${top}px`;
            settingsMenu.style.visibility = 'visible';
        });
    };

    overlay.onclick = () => {
        settingsMenu.style.display = 'none';
        overlay.style.display = 'none';
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            settingsMenu.style.display = 'none';
            overlay.style.display = 'none';
        }
    });

    function renderSettingsMenu() {
        settingsMenu.innerHTML = `
            <div style="text-align: right; margin-bottom: 5px;">
                <span id="close-settings" style="cursor: pointer; font-weight: bold;">✕</span>
            </div>
            <table style="width: 100%; border-spacing: 6px;">
                <tr><th colspan="2" style="text-align:left;">General Settings</th></tr>
                <tr><td title="Coma seperated strings to match in url to activate this script">Whitelist:</td><td><input type="text" id="st_whitelist" value="${settings.whitelist.join(',')}" /></td></tr>
                <tr><td title="How many pixels define a big jump">Pixel Threshold (px):</td><td><input type="number" id="st_pixel" value="${settings.pixelThreshold}" /></td></tr>
                <tr><td title="Interval in ms to record the scroll position">Track Interval (ms):</td><td><input type="number" id="st_interval" value="${settings.trackInterval}" /></td></tr>
                <tr><td title="Max jump allowed on screen">Max Buttons:</td><td><input type="number" id="st_maxbtns" value="${settings.maxButtons}" /></td></tr>
                <tr><td title="AutoJump back after big jump">AutoJump:</td><td><input type="checkbox" id="st_autojump" ${settings.autoJump ? 'checked' : ''} /></td></tr>
                <tr><td title="AutoJump back delayed by ms">AutoJumpDelay (ms):</td><td><input type="number" id="st_autoumpdelaybtn" value="${settings.autoJumpDelay}" /></td></tr>
                <tr><th colspan="2" style="text-align:left;">Jump Buttons Position</th></tr>
                <tr><td>Anchor:</td><td><select id="st_anchor">${anchorOptions.map(p => `<option ${settings.containerAnchor === p ? 'selected' : ''}>${p}</option>`).join('')}</select></td></tr>
                <tr><td>- X Offset:</td><td><input type="number" id="st_offsetx" value="${settings.offsetX}" /></td></tr>
                <tr><td>- Y Offset:</td><td><input type="number" id="st_offsety" value="${settings.offsetY}" /></td></tr>
                <tr><th colspan="2" style="text-align:left;">⚙️ Button Position</th></tr>
                <tr><td>Anchor:</td><td><select id="st_btnpos">${anchorOptions.map(p => `<option ${settings.settingsBtnAnchor === p ? 'selected' : ''}>${p}</option>`).join('')}</select></td></tr>
                <tr><td>- X Offset:</td><td><input type="number" id="st_btnx" value="${settings.settingsBtnOffsetX}" /></td></tr>
                <tr><td>- Y Offset:</td><td><input type="number" id="st_btny" value="${settings.settingsBtnOffsetY}" /></td></tr>
            </table>
            <p style="font-size: 11px; color: #555; margin-top: 5px;">Tip: Hover on labels for tooltips.</p>
            <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                <button id="st_reset" style="background: #e74c3c; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">Reset</button>
                <button id="st_save" style="background: #2ecc71; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">Save</button>
            </div>
        `;

        document.getElementById('close-settings').onclick = () => {
            settingsMenu.style.display = 'none';
            overlay.style.display = 'none';
        };

        document.getElementById('st_save').onclick = () => {
            settings.whitelist = document.getElementById('st_whitelist').value.split(',').map(s => s.trim());
            settings.pixelThreshold = parseInt(document.getElementById('st_pixel').value);
            settings.trackInterval = parseInt(document.getElementById('st_interval').value);
            settings.maxButtons = parseInt(document.getElementById('st_maxbtns').value);
            settings.autoJump = document.getElementById('st_autojump').checked;
            settings.autoJumpDelay = parseInt(document.getElementById('st_autoumpdelaybtn').value);
            settings.containerAnchor = document.getElementById('st_anchor').value;
            settings.offsetX = parseInt(document.getElementById('st_offsetx').value);
            settings.offsetY = parseInt(document.getElementById('st_offsety').value);
            settings.settingsBtnAnchor = document.getElementById('st_btnpos').value;
            settings.settingsBtnOffsetX = parseInt(document.getElementById('st_btnx').value);
            settings.settingsBtnOffsetY = parseInt(document.getElementById('st_btny').value);
            saveSettings();
            if (confirm('Settings saved. Do you want to reload the page now?')) {
                location.reload();
            }
        };

        document.getElementById('st_reset').onclick = () => {
            if (confirm('Reset all settings?')) {
                GM_deleteValue(settingsKey);//localStorage.removeItem(settingsKey);
                location.reload();
            }
        };
    }

    function saveSettings() {
        GM_setValue(settingsKey, JSON.stringify(settings));//localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    async function loadSettings() {
        const data = await GM_getValue(settingsKey); // alte localStorage-Zeile ersetzt
        return data ? JSON.parse(data) : { ...defaultSettings };
    }

})();
