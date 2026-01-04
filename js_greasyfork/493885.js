// ==UserScript==
// @name         Key System Bypass
// @namespace    http://your.domain.com
// @version      0.1
// @description  Bypass key system steps with HWID parameter in the link
// @author       Your Name
// @match        https://spdmteam.com/key-system-1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493885/Key%20System%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/493885/Key%20System%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const hwid = urlParams.get('hwid');

    async function keySystem() {
        try {
            let step1Url = `https://spdmteam.com/key-system-1?hwid=${hwid}&zone=Europe/Rome&os=android`;
            await fetch(step1Url);

            let step2Url = 'https://spdmteam.com/api/keysystem';
            let paramsStep2 = {
                step: '1',
                zone: 'Europe/Rome',
                advertiser: 'lootlabs',
                OS: 'ios'
            };
            await fetch(`${step2Url}?${new URLSearchParams(paramsStep2)}`);

            let captchaDetected = detectCaptcha();

            if (captchaDetected) {
                alert('Solved Captcha first');
                return;
            }

            let step3Url = `https://spdmteam.com/key-system-2?hwid=${hwid}`;
            await fetch(step3Url);

            // Remaining steps...
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }

    function detectCaptcha() {
        let checkBox = document.querySelector('input[type="checkbox"]');
        return checkBox !== null;
    }

    keySystem();
})();