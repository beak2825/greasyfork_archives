// ==UserScript==
// @name         Chain Warn with Toggleable Glitter
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Visual and loud audio alerts for Torn chain status, for Jynnx [2165445].
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant         GM_xmlhttpRequest
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/507824/Chain%20Warn%20with%20Toggleable%20Glitter.user.js
// @updateURL https://update.greasyfork.org/scripts/507824/Chain%20Warn%20with%20Toggleable%20Glitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const showTestButton = false;
    let alertSoundEnabled = GM_getValue('alertSoundEnabled');
    if (alertSoundEnabled === undefined) {
        const soundChoice = prompt('Would you like to enable sound alerts? (Yes or No)', 'Yes');
        alertSoundEnabled = soundChoice.toLowerCase() === 'yes';
        GM_setValue('alertSoundEnabled', alertSoundEnabled);
    }

    let glitterEnabled = GM_getValue('glitterEnabled');
    if (glitterEnabled === undefined) {
        const glitterChoice = prompt('Would you like to enable glitter animation? (Yes or No)', 'Yes');
        glitterEnabled = glitterChoice.toLowerCase() === 'yes';
        GM_setValue('glitterEnabled', glitterEnabled);
    }

    const userAlertTime = GM_getValue('alertTime', 100);
    const userMinChain = GM_getValue('minChain', 100);

    if (!GM_getValue('alertTime')) GM_setValue('alertTime', userAlertTime);
    if (!GM_getValue('minChain')) GM_setValue('minChain', userMinChain);

    const API_STORAGE_KEY = 'tornApiKey';
    const API_URL = 'https://api.torn.com/faction/?selections=chain&key=';
    let apiKey = GM_getValue(API_STORAGE_KEY);

    async function requestApiKey() {
        const inputKey = prompt('Enter your Torn API key:', '');
        if (inputKey) {
            GM_setValue(API_STORAGE_KEY, inputKey);
            apiKey = inputKey;
        } else {
            alert('API key is required to use this script.');
        }
    }

    if (!apiKey) {
        requestApiKey();
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let alarm = null;
    let alertTriggered = false;

    function playAlarmSound() {
        if (!alertSoundEnabled) return;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const duration = 0.5;
        const frequencies = [440, 550];
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;

        function playTone(frequency) {
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.connect(gainNode).connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        }

        let index = 0;
        alarm = setInterval(() => {
            playTone(frequencies[index]);
            index = (index + 1) % frequencies.length;
        }, duration * 1000);
    }

    async function fetchChainData() {
        if (!apiKey) {
            requestApiKey();
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL + apiKey,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        alert('Invalid API key. Please enter a valid one.');
                        GM_setValue(API_STORAGE_KEY, '');
                        requestApiKey();
                        return;
                    }
                    handleChainData(data.chain);
                } catch (error) {
                    console.error('Failed to fetch chain data:', error);
                }
            },
            onerror: function() {
                console.error('API request failed.');
            }
        });
    }

    function handleChainData(chain) {
        const { current, cooldown, end } = chain;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = end - currentTime;
        const inCooldown = cooldown > 0;

        if (current > 0 && timeRemaining > 0 && !inCooldown && timeRemaining < userAlertTime) {
            triggerGlitterAlert();
        } else {
            alertTriggered = false;
            removeGlitter();
        }
    }

    function triggerGlitterAlert() {
        if (alertTriggered) return;

        let warnOverlay = document.querySelector('.glitter');
        if (warnOverlay) document.body.removeChild(warnOverlay);

        if (glitterEnabled) {
            warnOverlay = document.createElement('div');
            warnOverlay.className = 'glitter';
            document.body.appendChild(warnOverlay);
        }

        if (!alarm) playAlarmSound();
        setTimeout(() => {
            alert('Warning! Chain is about to expire.');
            removeGlitter();
        }, 200);

        alertTriggered = true;
    }

    function removeGlitter() {
        const warnOverlay = document.querySelector('.glitter');
        if (warnOverlay) document.body.removeChild(warnOverlay);
        clearInterval(alarm);
        alarm = null;
    }

    setInterval(fetchChainData, 10000);
    fetchChainData();
})();