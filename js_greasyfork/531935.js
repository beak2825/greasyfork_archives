// ==UserScript==
// @name         Color Switcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Color Switcher script
// @author       guildedbird
// @match        pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531935/Color%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/531935/Color%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedKey = 'W';
    let autoClickEnabled = false;
    let autoClickInterval = 1000;
    let rafId = null;
    let lastClickTime = performance.now();
    let uiContainer = null;

    const MODE_KEY = 'colorSwitcherMode';
    let switchMode = localStorage.getItem(MODE_KEY) || 'random';
    let indexLTR = 0;
    let indexRTL = 0;

    function createUI() {
        uiContainer = document.createElement('ui');
        uiContainer.style.position = 'fixed';
        uiContainer.style.display = 'flex column';
        uiContainer.style.top = '10px';
        uiContainer.style.backgroundImage = "linear-gradient(to bottom, rgba(40,40,40,1), rgba(30,30,30,1))";
        uiContainer.style.color = 'white';
        uiContainer.style.padding = '5px';
        uiContainer.style.border = '1px solid #4b4949';
        uiContainer.style.zIndex = '299';
        uiContainer.style.borderRadius = '10px';
        uiContainer.style.fontFamily = 'Consolas, monospace';

        let nameLabel = document.createElement('name');
        nameLabel.textContent = 'Color Switcher';
        nameLabel.style.borderBottom = '1px solid #4b4949';

        let keyLabel = document.createElement('label');
        keyLabel.textContent = 'Set Hotkey:';
        keyLabel.style.fontFamily = 'Consolas, monospace';

        let keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.value = selectedKey;
        keyInput.maxLength = 1;
        keyInput.style.color = 'rgba(0, 226, 255, 1)';
        keyInput.style.background = 'rgba(10, 10, 10, 1)';
        keyInput.style.width = '16px';
        keyInput.style.fontFamily = 'Consolas, monospace';
        keyInput.style.border = '1px solid #4b4949';
        keyInput.addEventListener('input', function() {
            selectedKey = keyInput.value;
        });

        let modeLabel = document.createElement('label');
        modeLabel.textContent = 'Switch Mode:';
        modeLabel.style.fontFamily = 'Consolas, monospace';

        let modeSelect = document.createElement('select');
        modeSelect.style.background = 'rgba(10, 10, 10, 1)';
        modeSelect.style.color = 'rgba(0, 226, 255, 1)';
        modeSelect.style.marginLeft = '5px';
        modeSelect.style.fontFamily = 'Consolas, monospace';
        modeSelect.style.border = '1px solid #4b4949';

        const modes = [
            { value: 'random', text: 'Random' },
            { value: 'leftToRight', text: 'Rainbow (Descending)' },
            { value: 'rightToLeft', text: 'Rainbow (Ascending)' }
        ];

        modes.forEach(mode => {
            let option = document.createElement('option');
            option.value = mode.value;
            option.textContent = mode.text;
            modeSelect.appendChild(option);
        });

        modeSelect.value = switchMode;

        modeSelect.addEventListener('change', function() {
            switchMode = modeSelect.value;
            localStorage.setItem(MODE_KEY, switchMode);
            indexLTR = 0;
            indexRTL = 0;
        });

        let autoClickLabel = document.createElement('label');
        autoClickLabel.textContent = 'Auto Switcher';
        autoClickLabel.style.fontFamily = 'Consolas, monospace';
        let autoClickToggle = document.createElement('input');
        autoClickToggle.type = 'checkbox';
        autoClickToggle.addEventListener('change', function() {
            autoClickEnabled = autoClickToggle.checked;
            toggleAutoClick(autoClickEnabled);
        });

        let intervalLabel = document.createElement('label');
        intervalLabel.textContent = 'Switch Interval:';
        intervalLabel.style.fontFamily = 'Consolas, monospace';

        let intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.step = '50';
        intervalInput.value = autoClickInterval;
        intervalInput.style.color = 'rgba(0, 226, 255, 1)';
        intervalInput.style.background = 'rgba(10, 10, 10, 1)';
        intervalInput.style.width = '60px';
        intervalInput.style.fontFamily = 'Consolas, monospace';
        intervalInput.style.border = '1px solid #4b4949';
        intervalInput.addEventListener('input', function() {
            autoClickInterval = parseFloat(intervalInput.value) || 1;
            if (autoClickEnabled) {
                toggleAutoClick(false);
                toggleAutoClick(true);
            }
        });

        let hideLabel = document.createElement('label');
        hideLabel.textContent = 'Press Alt+S to Show/Hide UI';
        hideLabel.style.color = 'rgba(68, 68, 68, 1)';
        hideLabel.style.fontSize = '11px';

        let versionLabel = document.createElement('label');
        versionLabel.textContent = 'v1.2';
        versionLabel.style.color = 'rgba(68, 68, 68, 1)';
        versionLabel.style.fontSize = '11px';
        versionLabel.style.marginLeft = '100px';

        uiContainer.appendChild(nameLabel);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(keyLabel);
        uiContainer.appendChild(keyInput);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(modeLabel);
        uiContainer.appendChild(modeSelect);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(autoClickLabel);
        uiContainer.appendChild(autoClickToggle);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(intervalLabel);
        uiContainer.appendChild(intervalInput);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(hideLabel);
        uiContainer.appendChild(versionLabel);

        document.body.appendChild(uiContainer);
    }

    function clickColorButton() {
        let buttons = document.querySelectorAll('#container #palette-buttons a');
        if (!buttons || buttons.length === 0) return;

        if (switchMode === 'random') {
            buttons[Math.floor(Math.random() * buttons.length)].click();
        } else if (switchMode === 'leftToRight') {
            buttons[indexLTR % buttons.length].click();
            indexLTR++;
        } else if (switchMode === 'rightToLeft') {
            buttons[buttons.length - 1 - (indexRTL % buttons.length)].click();
            indexRTL++;
        }
    }

    function toggleAutoClick(enable) {
        if (enable) {
            function autoClickLoop(timestamp) {
                if (timestamp - lastClickTime >= autoClickInterval) {
                    clickColorButton();
                    lastClickTime = timestamp;
                }
                rafId = requestAnimationFrame(autoClickLoop);
            }
            lastClickTime = performance.now();
            rafId = requestAnimationFrame(autoClickLoop);
        } else {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key.toLowerCase() === 's') {
            if (uiContainer.style.display === 'none' || !uiContainer.style.display) {
                uiContainer.style.display = 'block';
            } else {
                uiContainer.style.display = 'none';
            }
        }
    });

    createUI();
})();

(function() {
    'use strict';

    const WARNING_KEY = 'colorSwitcherWarningShown';

    if (!localStorage.getItem(WARNING_KEY)) {
        setTimeout(() => {
            const notifications = document.querySelector('#notification');
            if (!notifications) return;

            const notification = document.createElement('div');
            notification.className = 'box warning';
            notification.innerHTML = `
                <div class="icon"></div>
                <div class="content">
                    <div class="title">Notice: Do not use in player/guild wars.</div>
                </div>
            `;

            notifications.appendChild(notification);
            localStorage.setItem(WARNING_KEY, 'true');

            setTimeout(() => {
                notification.style.transition = 'opacity 1s';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 1000);
            }, 10000);
        });
    }

    // Author credit
    const copyright = document.querySelector('#container #copyright');
    if (copyright) {
        copyright.innerHTML = "<span style='color: #ffffff;'>Script made by @guildedbird</span>";
        copyright.style.fontFamily = "monospace";
    }

    // Drag functionality
    const uiMenu = document.querySelector('ui');
    let dragging = false, initialX, initialY;

    function md(event) {
        dragging = true;
        initialX = event.clientX - uiMenu.getBoundingClientRect().left;
        initialY = event.clientY - uiMenu.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'move';
    }

    function mm(event) {
        if (dragging) {
            const newX = event.clientX - initialX;
            const newY = event.clientY - initialY;
            uiMenu.style.left = newX + 'px';
            uiMenu.style.top = newY + 'px';
        }
    }

    function mu() {
        dragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }

    uiMenu.addEventListener('mousedown', md);
    document.addEventListener('mousemove', mm);
    document.addEventListener('mouseup', mu);
})();