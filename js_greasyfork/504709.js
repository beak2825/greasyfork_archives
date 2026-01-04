// ==UserScript==
// @name         Powerline Spectator Mode
// @author       Rumini - Discord: rumini
// @description  Powerline.io Spectator Mode
// @version      1.0
// @match        *://powerline.io/*
// @icon         https://i.imgur.com/9k4SFr0.png
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1356205
// @downloadURL https://update.greasyfork.org/scripts/504709/Powerline%20Spectator%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/504709/Powerline%20Spectator%20Mode.meta.js
// ==/UserScript==

if (window.location.href === 'https://powerline.io/') {
    window.location.href = 'https://powerline.io/maindev.html';
}

(function () {
    'use strict';

    let currentSpectateIndex = 0;
    let switcherButton;
    let overlayToggleButton;
    let isSpectating = false;
    let infoDiv;
    let updateInterval;
    let lastKnownLocalPlayerID = 0;
    let overlayVisible = true;
    let forceOverlayVisible = false;

    function waitForGame(callback) {
        if (typeof network !== 'undefined' && typeof entities !== 'undefined' && typeof Snake !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForGame(callback), 100);
        }
    }

    function createSpectateSwitcherUI() {
        const container = document.createElement('div');
        container.id = 'spectate-switcher-container';
        container.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          display: flex;
          align-items: center;
          gap: 10px;
      `;

        switcherButton = document.createElement('button');
        switcherButton.id = 'spectate-switcher';
        switcherButton.style.cssText = `
          background-color: rgba(0, 58, 58, 0.4);
          color: #05ffff;
          border: 2px solid rgba(5, 255, 255, 0.5);
          border-radius: 10px;
          padding: 10px 20px;
          font-family: 'Arial Black', sans-serif;
          font-size: 16px;
          cursor: pointer;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
      `;
        switcherButton.textContent = 'Switch Spectate';

        switcherButton.addEventListener('click', switchSpectatePlayer);
        switcherButton.addEventListener('mouseover', () => {
            switcherButton.style.backgroundColor = 'rgba(0, 88, 88, 0.5)';
            switcherButton.style.transform = 'scale(1.05)';
            switcherButton.style.boxShadow = '0 0 15px rgba(5, 255, 255, 0.2)';
        });
        switcherButton.addEventListener('mouseout', () => {
            switcherButton.style.backgroundColor = 'rgba(0, 58, 58, 0.3)';
            switcherButton.style.transform = 'scale(1)';
            switcherButton.style.boxShadow = 'none';
        });

        overlayToggleButton = document.createElement('div');
        overlayToggleButton.id = 'overlay-toggle-button';
        overlayToggleButton.style.cssText = `
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(0, 58, 58, 0.4);
          border: 2px solid rgba(5, 255, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
      `;

        overlayToggleButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="24" height="24">
              <path fill="#00ffff" d="M15 15C24.4 5.7 39.6 5.7 49 15l63 63L112 40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 96c0 13.3-10.7 24-24 24l-96 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l38.1 0L15 49C5.7 39.6 5.7 24.4 15 15zM133.5 243.9C158.6 193.6 222.7 112 320 112s161.4 81.6 186.5 131.9c3.8 7.6 3.8 16.5 0 24.2C481.4 318.4 417.3 400 320 400s-161.4-81.6-186.5-131.9c-3.8-7.6-3.8-16.5 0-24.2zM320 320a64 64 0 1 0 0-128 64 64 0 1 0 0 128zM591 15c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-63 63 38.1 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-96 0c-13.3 0-24-10.7-24-24l0-96c0-13.3 10.7-24 24-24s24 10.7 24 24l0 38.1 63-63zM15 497c-9.4-9.4-9.4-24.6 0-33.9l63-63L40 400c-13.3 0-24-10.7-24-24s10.7-24 24-24l96 0c13.3 0 24 10.7 24 24l0 96c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-38.1L49 497c-9.4 9.4-24.6 9.4-33.9 0zm576 0l-63-63 0 38.1c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-96c0-13.3 10.7-24 24-24l96 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-38.1 0 63 63c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0z"/>
          </svg>
      `;

        overlayToggleButton.addEventListener('click', toggleOverlay);
        overlayToggleButton.addEventListener('mouseover', () => {
            overlayToggleButton.style.backgroundColor = 'rgba(0, 88, 88, 0.5)';
            overlayToggleButton.style.transform = 'scale(1.1)';
            overlayToggleButton.style.boxShadow = '0 0 15px rgba(5, 255, 255, 0.2)';
        });
        overlayToggleButton.addEventListener('mouseout', () => {
            overlayToggleButton.style.backgroundColor = 'rgba(0, 58, 58, 0.3)';
            overlayToggleButton.style.transform = 'scale(1)';
            overlayToggleButton.style.boxShadow = 'none';
        });

        infoDiv = document.createElement('div');
        infoDiv.id = 'spectate-info';
        infoDiv.style.cssText = `
          position: fixed;
          bottom: 200px;
          right: 20px;
          z-index: 1000;
          background-color: rgba(0, 58, 58, 0.3);
          border: 2px solid rgba(5, 255, 255, 0.8);
          border-radius: 10px;
          padding: 0 20px 20px 20px;
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          color: #05ffff;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 0 20px rgba(5, 255, 255, 0.5);
          transition: opacity 0.3s ease, box-shadow 1s ease;
          max-width: 400px;
          word-wrap: break-word;
          opacity: 0;
      `;

        container.appendChild(switcherButton);
        container.appendChild(overlayToggleButton);
        document.body.appendChild(container);
        document.body.appendChild(infoDiv);

        setInterval(updateButtonVisibility, 100);
        setInterval(updateInfoBoxGlow, 50);

        document.addEventListener('keydown', function (event) {
            if (event.code === 'Space') {
                if (isSpectating || localPlayerID === 0) {
                    isSpectating = false;
                    clearInterval(updateInterval);
                    infoDiv.style.opacity = '0';
                }
                updateButtonVisibility();
            }
        });

        setOverlayVisibility(true);
    }

    function updateButtonVisibility() {
        const container = document.getElementById('spectate-switcher-container');

        if (localPlayerID !== 0 && lastKnownLocalPlayerID === 0) {
            isSpectating = false;
            clearInterval(updateInterval);
            infoDiv.style.opacity = '0';
            forceOverlayVisible = false;
        }

        if (localPlayerID === 0 && lastKnownLocalPlayerID !== 0) {
            forceOverlayVisible = true;
            setOverlayVisibility(true);
        }

        lastKnownLocalPlayerID = localPlayerID;

        if (localPlayerID === 0 || isSpectating) {
            container.style.opacity = '1';
            infoDiv.style.opacity = isSpectating ? '1' : '0';
        } else {
            container.style.opacity = '0';
            infoDiv.style.opacity = '0';
        }
    }

    function setOverlayVisibility(visible) {
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlayVisible = visible;
            overlay.style.opacity = visible ? '1' : '0';
        }
    }

    function toggleOverlay() {
        if (forceOverlayVisible) {
            forceOverlayVisible = false;
        }
        setOverlayVisibility(!overlayVisible);
    }

    function updateInfoBoxGlow() {
        const glowIntensity = Math.sin(Date.now() * 0.0005) * 5 + 15;
        infoDiv.style.boxShadow = `0 0 ${glowIntensity}px rgba(5, 255, 255, 0.7)`;
    }

    function switchSpectatePlayer() {
        const keys = Object.keys(entities);
        if (keys.length === 0) return;

        let found = false;
        for (let i = 0; i < keys.length; i++) {
            currentSpectateIndex = (currentSpectateIndex + 1) % keys.length;
            const entity = entities[keys[currentSpectateIndex]];
            if (entity instanceof Snake && entity !== localPlayer) {
                localPlayer = entity;
                camera.target = localPlayer;
                updateInfoDiv(entity);
                clearInterval(updateInterval);
                updateInterval = setInterval(() => updateInfoDiv(entity), 100);
                isSpectating = true;
                found = true;
                break;
            }
        }

        if (!found) {
            hud.addSpecialMessage("No other snakes are close enough to spectate.");
        }

        updateButtonVisibility();
    }

    function updateInfoDiv(entity) {
        if (!entity || entity.id === 0) {
            infoDiv.style.opacity = '0';
            return;
        }

        const entityInfo = `
          <h3>Spectating: ${entity.nick || '<unnamed>'}</h3>
          <b>ID:</b> ${entity.id}<br>
          <b>Current Length:</b> ${entity.curLength.toFixed(2)}<br>
          <b>Total Length:</b> ${entity.curLengthDst.toFixed(2)}<br>
          <b>Last Speed:</b> ${entity.lastSpeed.toFixed(2)}<br>
          <b>Client X:</b> ${entity.x.toFixed(2)}<br>
          <b>Client Y:</b> ${entity.y.toFixed(2)}<br>
          <b>Server X:</b> ${entity.lastServerX.toFixed(2)}<br>
          <b>Server Y:</b> ${entity.lastServerY.toFixed(2)}<br>
      `;
        infoDiv.innerHTML = entityInfo;
        infoDiv.style.opacity = '1';
    }

    waitForGame(createSpectateSwitcherUI);
})();