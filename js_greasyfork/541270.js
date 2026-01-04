// ==UserScript==
// @name         Geoguessr Random Zoom Mode GeoDK
// @namespace    https://geodk.dev/
// @version      1.0.1
// @description  Adds random zooms and screen blackouts in Geoguessr for challenge play. Special thanks to Chhote for the idea!!
// @author       Dorukhan Bozkurt (geoDK)
// @match        https://www.geoguessr.com/*
// @icon         https://www.svgrepo.com/show/40039/eye.svg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541270/Geoguessr%20Random%20Zoom%20Mode%20GeoDK.user.js
// @updateURL https://update.greasyfork.org/scripts/541270/Geoguessr%20Random%20Zoom%20Mode%20GeoDK.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let zoomTime = parseFloat(localStorage.getItem('zoomTime')) || 1.0;
    let zoomNumber = parseInt(localStorage.getItem('zoomNumber')) || 3;
    let zoomDelay = parseFloat(localStorage.getItem('zoomDelay')) || 0;
    let zoomEnabled = localStorage.getItem('zoomEnabled') === 'enabled';

    const blinkTime = 500; // ms
    const scaleMin = 3.0;
    const scaleMax = 5.0;

    let wasBackdropThereOrLoading = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function simulatePanDrag() {
        const canvas = document.querySelector('.widget-scene-canvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        const dragDistance = 300;
        const angle = Math.random() * 2 * Math.PI;
        const endX = startX + Math.cos(angle) * dragDistance;
        const endY = startY + Math.sin(angle) * dragDistance;

        canvas.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: startX, clientY: startY }));
        canvas.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: endX, clientY: endY }));
        canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: endX, clientY: endY }));
    }

    function getPanoramaEl() {
        return document.querySelector("[data-qa=panorama]");
    }

    function applyRandomZoom(pano) {
        if (!pano) return;
        pano.style.transition = 'none';
        const randPercent = () => `${Math.random() * 100}%`;
        const zoomLevel = scaleMin + Math.random() * (scaleMax - scaleMin);
        pano.style.transformOrigin = `${randPercent()} ${randPercent()}`;
        pano.style.transform = `scale(${zoomLevel})`;
    }

    function resetZoom(pano) {
        if (!pano) return;
        pano.style.transform = 'scale(1)';
        pano.style.transformOrigin = 'center center';
    }

    function hidePanorama() {
        const pano = getPanoramaEl();
        if (pano) pano.style.filter = 'brightness(0%)';
    }

    function showPanorama() {
        const pano = getPanoramaEl();
        if (pano) pano.style.filter = 'brightness(100%)';
    }

    function isBackdropThereOrLoading() {
        return document.querySelector('[class*=overlay_backdrop__]') ||
               document.querySelector('[class*=round-starting_wrapper__]') ||
               document.querySelector('[class*=fullscreen-spinner_root__]') ||
               document.querySelector('[class*=game-starting_container__]');
    }

    async function handleRoundStart() {
        if (!zoomEnabled) return;

        const pano = getPanoramaEl();
        if (!pano) return;

        resetZoom(pano);
        showPanorama();

        if (zoomDelay > 0) {
            hidePanorama();
            await sleep(zoomDelay * 1000);
            showPanorama();
        }

        for (let i = 0; i < zoomNumber; i++) {
            simulatePanDrag();
            applyRandomZoom(pano);
            await sleep(zoomTime * 1000);

            if (i < zoomNumber - 1) {
                hidePanorama();
                await sleep(blinkTime);
                showPanorama();
                resetZoom(pano);
            }
        }

        hidePanorama();
        resetZoom(pano);
    }

    const observer = new MutationObserver(() => {
        addSettingsUI();
        if (isBackdropThereOrLoading()) {
            wasBackdropThereOrLoading = true;
        } else if (wasBackdropThereOrLoading) {
            wasBackdropThereOrLoading = false;
            handleRoundStart();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function addSettingsUI() {
        // For party mode settings
        const partyPanel = document.querySelector('[class*=party-modal_heading__]');
        const partyColumns = document.querySelectorAll('[class*=settings-modal_column__]');
        if (partyPanel && partyColumns.length && !document.getElementById('zoomModeSettings')) {
            partyColumns[partyColumns.length - 1].insertAdjacentHTML('beforeend', getSettingsHTML(true));
            bindSettingHandlers();
            return;
        }

        // For regular game interface
        const gameContainer =
            document.querySelector('[class*=map-block_mapStatsContainer__]') ||
            document.querySelector('[class*=status_container__]') ||
            document.querySelector('[class*=game-map_gameMap__]');

        if (!gameContainer || document.getElementById('zoomModeSettings')) return;
        gameContainer.insertAdjacentHTML('afterend', getSettingsHTML(false));
        bindSettingHandlers();
    }

    function getSettingsHTML(isPartyMode) {
        if (isPartyMode) {
            return `
            <div id="zoomModeSettings" class="toggle-option_wrapper__">
                <div class="toggle-option_label__">Random Zoom Mode</div>
                <input type="checkbox" id="zoomEnabled" class="toggle_toggle__">
                <div class="numeric-option_wrapper__">
                    <div class="numeric-option_label__">Zoom Time (s)</div>
                    <input type="number" id="zoomTime" value="${zoomTime}" min="0.1" step="0.1">
                </div>
                <div class="numeric-option_wrapper__">
                    <div class="numeric-option_label__">Zoom Number</div>
                    <input type="number" id="zoomNumber" value="${zoomNumber}" min="1" step="1">
                </div>
                <div class="numeric-option_wrapper__">
                    <div class="numeric-option_label__">Start Delay (s)</div>
                    <input type="number" id="zoomDelay" value="${zoomDelay}" min="0" step="0.1">
                </div>
            </div>`;
        } else {
            return `
            <div id="zoomModeSettings" style="position: absolute; bottom: 20px; left: 20px; background: rgba(255, 255, 255, 0.05); padding: 12px; border-radius: 12px; z-index: 999; backdrop-filter: blur(4px); color: white; width: 220px; font-family: inherit; box-shadow: 0 0 8px rgba(0,0,0,0.2);">
                <h3 style="margin-bottom: 10px; font-size: 16px; text-align: center;">🎥 geoDK's Random Zoom Mode</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="margin-right: 10px;">Enabled</label>
                    <input type="checkbox" id="zoomEnabled">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 4px;">Zoom Time (s)</label>
                    <input type="number" id="zoomTime" value="${zoomTime}" min="0.1" step="0.1" style="width: 100%;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 4px;">Zoom Number</label>
                    <input type="number" id="zoomNumber" value="${zoomNumber}" min="1" step="1" style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 4px;">Start Delay (s)</label>
                    <input type="number" id="zoomDelay" value="${zoomDelay}" min="0" step="0.1" style="width: 100%;">
                </div>
            </div>`;
        }
    }

    function bindSettingHandlers() {
        const enabledEl = document.getElementById('zoomEnabled');
        if (!enabledEl) return;

        enabledEl.checked = zoomEnabled;
        enabledEl.addEventListener('change', e => {
            zoomEnabled = e.target.checked;
            localStorage.setItem('zoomEnabled', zoomEnabled ? 'enabled' : 'disabled');
        });

        document.getElementById('zoomTime').addEventListener('change', e => {
            zoomTime = parseFloat(e.target.value);
            localStorage.setItem('zoomTime', zoomTime);
        });

        document.getElementById('zoomNumber').addEventListener('change', e => {
            zoomNumber = parseInt(e.target.value);
            localStorage.setItem('zoomNumber', zoomNumber);
        });

        document.getElementById('zoomDelay').addEventListener('change', e => {
            zoomDelay = parseFloat(e.target.value);
            localStorage.setItem('zoomDelay', zoomDelay);
        });
    }
})();
