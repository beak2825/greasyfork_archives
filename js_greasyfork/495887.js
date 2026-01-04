// ==UserScript==
// @name         Prime Video Enchantments
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Enhancements for Prime Video player: auto Fullscreen, skip intro, skip credits, and more.
// @author       JJJ
// @match        https://www.amazon.com/gp/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495887/Prime%20Video%20Enchantments.user.js
// @updateURL https://update.greasyfork.org/scripts/495887/Prime%20Video%20Enchantments.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        enableSkipRecap: GM_getValue('enableSkipRecap', true),
        enableSkipIntro: GM_getValue('enableSkipIntro', true),
        //enableSkipOutro: GM_getValue('enableSkipOutro', true),
        enableAutoFullscreen: GM_getValue('enableAutoFullscreen', true),
    };

    const selectors = {
        skipRecapButton: 'div.f16im4ho > div > button.fqye4e3.f1ly7q5u.fk9c3ap.fz9ydgy.f1xrlb00.f1hy0e6n.fgbpje3.f1uteees.f1h2a8xb.atvwebplayersdk-skipelement-button.fjgzbz9.fiqc9rt.fg426ew.f1ekwadg',
        skipIntroButton: 'div.f16im4ho > div > button.fqye4e3.f1ly7q5u.fk9c3ap.fz9ydgy.f1xrlb00.f1hy0e6n.fgbpje3.f1uteees.f1h2a8xb.atvwebplayersdk-skipelement-button.fjgzbz9.fiqc9rt.fg426ew.f1ekwadg',
        fullscreenVideo: 'video',
    };

    const buttonState = {
        skipRecap: false,
        skipIntro: false
    };

    function showSettingsDialog() {
        const dialogHTML = `
        <div id="primeVideoEnchantmentsDialog" class="dpe-dialog">
            <h3>Prime Video Enchantments</h3>
            <div class="dpe-toggle-container" title="Automatically skip episode recaps">
                <label class="dpe-toggle">
                    <input type="checkbox" id="enableSkipRecap" ${config.enableSkipRecap ? 'checked' : ''}>
                    <span class="dpe-toggle-slider"></span>
                </label>
                <label for="enableSkipRecap" class="dpe-toggle-label">Skip Recap</label>
            </div>
            <div class="dpe-toggle-container" title="Automatically skip the intro of episodes">
                <label class="dpe-toggle">
                    <input type="checkbox" id="enableSkipIntro" ${config.enableSkipIntro ? 'checked' : ''}>
                    <span class="dpe-toggle-slider"></span>
                </label>
                <label for="enableSkipIntro" class="dpe-toggle-label">Skip Intro</label>
            </div>
            <div class="dpe-toggle-container" title="Automatically enter fullscreen mode">
                <label class="dpe-toggle">
                    <input type="checkbox" id="enableAutoFullscreen" ${config.enableAutoFullscreen ? 'checked' : ''}>
                    <span class="dpe-toggle-slider"></span>
                </label>
                <label for="enableAutoFullscreen" class="dpe-toggle-label">Auto Fullscreen</label>
            </div>
            <div class="dpe-button-container">
                <button id="saveSettingsButton" class="dpe-button dpe-button-save">Save</button>
                <button id="cancelSettingsButton" class="dpe-button dpe-button-cancel">Cancel</button>
            </div>
        </div>
    `;

        const styleSheet = `
        <style>
            .dpe-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #444;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                z-index: 9999;
                color: white;
                width: 300px;
                font-family: Arial, sans-serif;
            }
            .dpe-dialog h3 {
                margin-top: 0;
                font-size: 1.4em;
                text-align: center;
                margin-bottom: 20px;
            }
            .dpe-toggle-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            .dpe-toggle-label {
                flex-grow: 1;
            }
            .dpe-toggle {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            .dpe-toggle input {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
                margin: 0;
            }
            .dpe-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }
            .dpe-toggle-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            .dpe-toggle input:checked + .dpe-toggle-slider {
                background-color: #0078d4;
            }
            .dpe-toggle input:checked + .dpe-toggle-slider:before {
                transform: translateX(26px);
            }
            .dpe-button-container {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            .dpe-button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1em;
                transition: background-color 0.3s;
            }
            .dpe-button-save {
                background-color: #0078d4;
                color: white;
            }
            .dpe-button-save:hover {
                background-color: #005a9e;
            }
            .dpe-button-cancel {
                background-color: #d41a1a;
                color: white;
            }
            .dpe-button-cancel:hover {
                background-color: #a61515;
            }
        </style>
    `;

        const dialogWrapper = document.createElement('div');
        dialogWrapper.innerHTML = styleSheet + dialogHTML;
        document.body.appendChild(dialogWrapper);

        document.getElementById('saveSettingsButton').addEventListener('click', saveAndCloseSettings);
        document.getElementById('cancelSettingsButton').addEventListener('click', closeSettingsDialog);
    }

    function closeSettingsDialog() {
        const dialog = document.getElementById('primeVideoEnchantmentsDialog');
        if (dialog) {
            dialog.remove();
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }

    function saveAndCloseSettings() {
        ['enableSkipRecap', 'enableSkipIntro', 'enableAutoFullscreen'].forEach(setting => {
            config[setting] = document.getElementById(setting).checked;
            GM_setValue(setting, config[setting]);
        });
        closeSettingsDialog();
    }

    function clickButton(selector, buttonType) {
        const button = document.querySelector(selector);
        if (button && !buttonState[buttonType]) {
            button.click();
            buttonState[buttonType] = true;
            console.log(`${buttonType} button clicked`);
        }
    }

    function toggleFullscreen() {
        const videoElement = document.querySelector(selectors.fullscreenVideo);
        if (videoElement) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

    function handleSkipActions() {
        try {
            if (config.enableSkipRecap) {
                clickButton(selectors.skipRecapButton, 'skipRecap');
            }

            if (config.enableSkipIntro) {
                clickButton(selectors.skipIntroButton, 'skipIntro');
            }

            if (config.enableAutoFullscreen && !document.fullscreenElement) {
                toggleFullscreen();
            }

            // Reset button states if buttons are not found
            ['skipRecap', 'skipIntro'].forEach(buttonType => {
                if (!document.querySelector(selectors[`${buttonType}Button`])) {
                    buttonState[buttonType] = false;
                }
            });

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    const observer = new MutationObserver(handleSkipActions);
    observer.observe(document.body, { childList: true, subtree: true });

    GM_registerMenuCommand('Prime Video Enchantments', showSettingsDialog);

    let isSettingsDialogOpen = false;

    function toggleSettingsDialog() {
        isSettingsDialogOpen = !isSettingsDialogOpen;
        if (isSettingsDialogOpen) {
            showSettingsDialog();
        } else {
            closeSettingsDialog();
        }
    }

    document.addEventListener('keyup', (event) => {
        if (event.key === 'F2') {
            toggleSettingsDialog();
        } else if (event.key === 'Escape') {
            document.exitFullscreen();
        }
    });

    // Auto skip ads
    const timePattern = /(\d?\d:){0,2}\d?\d/;
    const intervalDuration = 200;
    let adBypassed = false;

    setInterval(() => {
        const playerContainer = document.querySelector(".rendererContainer");
        const videoElement = playerContainer ? playerContainer.querySelector('video') : null;
        const skipIndicator = document.querySelector(".atvwebplayersdk-adtimeindicator-text");
        const remainingAdTimeElement = document.querySelector(".atvwebplayersdk-ad-timer-remaining-time");

        if (videoElement && videoElement.currentTime && (remainingAdTimeElement || skipIndicator)) {
            if (!adBypassed) {
                let adDurationElement = remainingAdTimeElement && timePattern.test(remainingAdTimeElement.textContent) ? remainingAdTimeElement :
                    skipIndicator && timePattern.test(skipIndicator.textContent) ? skipIndicator : null;

                if (adDurationElement) {
                    const adDurationParts = adDurationElement.textContent.match(timePattern)[0].split(':');
                    const adDurationSeconds = adDurationParts.reduce((acc, part, index) =>
                        acc + parseInt(part, 10) * Math.pow(60, adDurationParts.length - 1 - index), 0);

                    videoElement.currentTime += adDurationSeconds;
                    adBypassed = true;
                    console.log('=====================\nAD SKIPPED ON PRIME VIDEO\n=====================');
                }
            }
        } else {
            adBypassed = false;
        }
    }, intervalDuration);

})();