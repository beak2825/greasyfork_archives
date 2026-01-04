// ==UserScript==
// @name         Kirka.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  VOID Kirka tool
// @author       Mr.Time
// @match        https://kirka.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525257/Kirkaio.user.js
// @updateURL https://update.greasyfork.org/scripts/525257/Kirkaio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isAutoFireActive = false;
    let isAutoInspectActive = false;
    let uiVisible = false;
    let zInterval;
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '50%';
    uiContainer.style.left = '20px';
    uiContainer.style.transform = 'translateY(-50%)';
    uiContainer.style.backgroundColor = 'rgba(32, 38, 57, 0.9)';
    uiContainer.style.padding = '20px';
    uiContainer.style.borderRadius = '15px';
    uiContainer.style.color = '#fff';
    uiContainer.style.fontFamily = 'Exo 2';
    uiContainer.style.zIndex = '10000';
    uiContainer.style.display = 'none';
    uiContainer.style.boxShadow = '0 0 10px rgba(255, 0, 247, 0.3)';
    const toggleStyle = `
        .toggle-btn {
            border: .125rem solid #202639;
            background: var(--wNMWmnwW-1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
            margin: 8px 0;
            border-radius: .25rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,.4),inset 0 0 8px rgba(0,0,0,.4);
        }
        .toggle-btn:hover {
            background: var(--wNMWmnwW-2);
        }
        .toggle-btn.active {
            background: rgba(255, 0, 247, 0.2);
            border-color: rgba(255, 0, 247, 0.5);
        }
        .toggle-switch {
            width: 40px;
            height: 20px;
            background: var(--wNMWmnwW-4);
            border-radius: 10px;
            position: relative;
            transition: all 0.3s ease;
        }
        .toggle-switch::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            background: var(--white);
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: all 0.3s ease;
        }
        .toggle-btn.active .toggle-switch {
            background: rgba(255, 0, 247, 0.5);
        }
        .toggle-btn.active .toggle-switch::after {
            left: 22px;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = toggleStyle;
    document.head.appendChild(styleSheet);
    const statusDisplay = document.createElement('div');
    statusDisplay.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: rgb(255, 0, 247); text-align: center; text-transform: uppercase; letter-spacing: 2px;">
            Void Kirka Tool Lite
        </h3>
        <div class="toggle-btn" id="autoFireToggle">
            <span>Auto Fire</span>
            <div class="toggle-switch"></div>
        </div>
        <div class="toggle-btn" id="autoInspectToggle">
            <span>Auto Inspect</span>
            <div class="toggle-switch"></div>
        </div>
        <div style="font-size: 12px; color: var(--gray-1); margin-top: 15px; text-align: center;">
            Press L to toggle UI
        </div>
    `;
    uiContainer.appendChild(statusDisplay);
    document.body.appendChild(uiContainer);
    function toggleFeature(feature, button) {
        switch(feature) {
            case 'autoFire':
                isAutoFireActive = !isAutoFireActive;
                if (isAutoFireActive) {
                    document.addEventListener('mousedown', onMouseDownHandler);
                    document.addEventListener('mouseup', onMouseUpHandler);
                } else {
                    document.removeEventListener('mousedown', onMouseDownHandler);
                    document.removeEventListener('mouseup', onMouseUpHandler);
                }
                break;
            case 'autoInspect':
                isAutoInspectActive = !isAutoInspectActive;
                if (isAutoInspectActive) {
                    zInterval = setInterval(() => {
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', keyCode: 90 }));
                    }, 50);
                } else {
                    clearInterval(zInterval);
                }
                break;
        }
        button.classList.toggle('active');
    }
    function onMouseDownHandler(event) {
        if (event.target.tagName === 'CANVAS') {
            simulateMouseDown();
        }
    }
    function onMouseUpHandler(event) {
        if (event.target.tagName === 'CANVAS') {
            simulateMouseUp();
        }
    }
    function simulateMouseDown() {
        const canvas = document.querySelector('canvas');
        canvas.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
            clientX: canvas.width / 2,
            clientY: canvas.height / 2
        }));
    }
    function simulateMouseUp() {
        const canvas = document.querySelector('canvas');
        canvas.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
            clientX: canvas.width / 2,
            clientY: canvas.height / 2
        }));
    }
    document.getElementById('autoFireToggle').addEventListener('click', function() {
        toggleFeature('autoFire', this);
    });
    document.getElementById('autoInspectToggle').addEventListener('click', function() {
        toggleFeature('autoInspect', this);
    });
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'l') {
            uiVisible = !uiVisible;
            uiContainer.style.display = uiVisible ? 'block' : 'none';
        }
    });
    document.addEventListener('mousedown', function(event) {
        if (event.button === 0 && isAutoFireActive) {
            event.preventDefault();
        }
    });
})();
