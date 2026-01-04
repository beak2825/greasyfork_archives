// ==UserScript==
// @name         Jerkmate Cheat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-clicker and auto-upgrader for JerkMate
// @author       lustmch
// @match        https://jerkmate.com/jerkmate-ranked
// @icon         https://www.google.com/s2/favicons?domain=jerkmate.com
// @grant        GM_addStyle
// @license MIT; No Redistribution (see description)
// @downloadURL https://update.greasyfork.org/scripts/526615/Jerkmate%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/526615/Jerkmate%20Cheat.meta.js
// ==/UserScript==

/*
MIT License (Modified)

Copyright (c) 2025 lustmch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software, to use, copy, and modify it for personal use only.

- Redistribution, reuploading, or claiming this script as your own is prohibited.
- You may not publish this script on other sites without permission.
- Proper credit to the original author must always be maintained.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND...
*/



(function() {
    'use strict';

    // config
    const clickInterval = 1;
    const videoSelector = '.css-jg52x1-idle-game-VideoPlayerStyled > video:nth-child(4)';
    const upgradeSelectors = [
        'div.css-fm0s1w-idle-game-UpgradeBoxStyled:nth-child(1) > button:nth-child(5)',
        'div.css-fm0s1w-idle-game-UpgradeBoxStyled:nth-child(2) > button:nth-child(5)',
        'div.css-fm0s1w-idle-game-UpgradeBoxStyled:nth-child(3) > button:nth-child(5)',
        'div.css-fm0s1w-idle-game-UpgradeBoxStyled:nth-child(4) > button:nth-child(5)',
        'div.css-fm0s1w-idle-game-UpgradeBoxStyled:nth-child(5) > button:nth-child(5)'
    ];
    const upgradeNames = ['Lube', 'Poster', 'Magazine', 'Private Show', 'Cam-to-Cam'];

    GM_addStyle(`
        .jm-control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(40, 40, 40, 0.9);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: 'Segoe UI', sans-serif;
            color: white;
            min-width: 250px;
            text-align: center;
        }
        .jm-control-panel h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #ff6b6b;
        }
        .jm-toggle {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .jm-toggle label {
            flex: 1;
            margin-right: 10px;
            font-size: 14px;
        }
        .jm-toggle input[type="checkbox"] {
            -webkit-appearance: none;
            appearance: none;
            width: 40px;
            height: 20px;
            background: #444;
            border-radius: 20px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        }
        .jm-toggle input[type="checkbox"]::before {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: transform 0.3s;
        }
        .jm-toggle input[type="checkbox"]:checked {
            background: #ff6b6b;
        }
        .jm-toggle input[type="checkbox"]:checked::before {
            transform: translateX(20px);
        }
        .jm-footer {
            margin-top: 15px;
            font-size: 12px;
        }
        .jm-footer a {
            color: #ff6b6b;
            text-decoration: none;
        }
        .jm-footer a:hover {
            text-decoration: underline;
        }
    `);

    const panel = document.createElement('div');
    panel.className = 'jm-control-panel';
    panel.innerHTML = `
        <h3>Sigma Male Jerkmate Automation</h3>
        ${upgradeNames.map((name, index) => `
            <div class="jm-toggle">
                <label for="upgrade-${index}">${name}</label>
                <input type="checkbox" id="upgrade-${index}" checked>
            </div>
        `).join('')}
        <div class="jm-footer">
            Made by <a href="https://overthink.pw" target="_blank">lustmch</a>
        </div>
    `;
    document.body.appendChild(panel);

    // toggles
    const toggles = upgradeNames.map((_, index) =>
        document.getElementById(`upgrade-${index}`)
    );

    // autoclick
    function autoClick() {
        const videoElement = document.querySelector(videoSelector);
        if (videoElement) videoElement.click();

        // upgrades
        toggles.forEach((toggle, index) => {
            if (toggle.checked) {
                const upgrade = document.querySelector(upgradeSelectors[index]);
                if (upgrade && !upgrade.disabled) upgrade.click();
            }
        });
    }

    // Start
    console.log('Starting - Sigma Male Jerkmate Automation...');
    setInterval(autoClick, clickInterval);

})();
