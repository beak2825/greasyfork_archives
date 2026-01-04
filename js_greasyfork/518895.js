// ==UserScript==
// @name         Money Roll Auto Spinner
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds auto-spin controls for Money Roll game
// @author       Angus
// @match        https://xlr.ppgames.net/gs2c/html5Game.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518895/Money%20Roll%20Auto%20Spinner.user.js
// @updateURL https://update.greasyfork.org/scripts/518895/Money%20Roll%20Auto%20Spinner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Only run if it's Money Roll game
    if (!window.location.search.includes('gname=Money%20Roll')) {
        return;
    }

    // Create UI elements
    function createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            color: white;
            font-family: Arial, sans-serif;
        `;

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter balance';
        input.style.cssText = `
            margin: 5px;
            padding: 5px;
            width: 100px;
        `;

        const button = document.createElement('button');
        button.textContent = 'Start Auto-Spin';
        button.style.cssText = `
            margin: 5px;
            padding: 5px 10px;
            background: #4CAF50;
            border: none;
            border-radius: 3px;
            color: white;
            cursor: pointer;
        `;

        button.addEventListener('click', () => {
            const balance = parseFloat(input.value);
            if (balance > 0) {
                spinBalance(balance);
            }
        });

        container.appendChild(input);
        container.appendChild(button);
        document.body.appendChild(container);
    }

    // Auto-spin function
    function spinBalance(balance) {
        XT.TriggerEvent(Vars.Evt_DataToCode_StopAutoplay);
        const spinsNeeded = Math.max(0, Math.ceil(balance / XT.GetDouble(Vars.TotalBetDisplayed)));
        XT.SetInt(Vars.AutoplaySpinsRequested, spinsNeeded);
        XT.SetBool(Vars.Autoplay_SkipScreens, true);
        XT.SetBool(Vars.AutoplayContinuousSpin, true);
        XT.SetBool(Vars.ContinuousSpin, true);
        XT.TriggerEvent(Vars.Evt_DataToCode_StartAutoplay);

        function checkSpins() {
            if (XT.GetInt(Vars.AutoplaySpinsLeft) <= -1) {
                KeyboardManager.SetFocus(false);
                return;
            } else {
                KeyboardManager.onKeyDown(new KeyboardEvent('keydown', {
                    keyCode: KeyCode.Space,
                }));
            }
            requestAnimationFrame(checkSpins);
        }
        setTimeout(() => {
            requestAnimationFrame(checkSpins);
        }, 500);
    }

    // Wait for game to load
    const checkGameLoaded = setInterval(() => {
        if (typeof XT !== 'undefined' && typeof Vars !== 'undefined') {
            clearInterval(checkGameLoaded);
            createUI();
        }
    }, 1000);
})();
