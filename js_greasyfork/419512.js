// ==UserScript==
// @name         Torn Booster/Drug Cooldown Alerter
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Dismissible alerts for Torn booster and drug cooldowns
// @author       Humpty-Dumpty[2527857]
// @include      https://www.torn.com/*
// @exclude      https://www.torn.com/api*
// @connect      api.torn.com
// @run-at       document-idle
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419512/Torn%20BoosterDrug%20Cooldown%20Alerter.user.js
// @updateURL https://update.greasyfork.org/scripts/419512/Torn%20BoosterDrug%20Cooldown%20Alerter.meta.js
// ==/UserScript==

(function() {

const FORCE_EXPIRED_COOLDOWNS = false;
const LOG_ENABLED = false;

function addCSS() {
    let css = document.createElement("style");
    css.innerHTML = `
    .centeredDivAlert {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 5px;
        padding: 5px;
        border: 5px solid red;
        background: rgba(128,128,128,1.0);
        z-index: 100000000;
    }
    `
    document.head.appendChild(css);
}

function log(text) {
    if (LOG_ENABLED) {
        GM_log(text);
    }
}

function logApiKeyStorage() {
    log(`GM_getValue('API_KEY'): ${GM_getValue('API_KEY')}`);
}

function logStorage() {
    log(`GM_listValues(): ${GM_listValues()}`);
}

function handleSaveBtn() {
    const apiKeyContainer = document.querySelector('#getApiKeyContainer');
    const textInput = document.querySelector('#apiKeyInput');

    if (! textInput.value) {
        return;
    }

    if (textInput.value.length < 1) {
        return;
    }

    const api_key = textInput.value;
    GM_setValue('API_KEY', api_key);
    apiKeyContainer.parentNode.removeChild(apiKeyContainer);

    mainLoop();
}

function initApiKey() {
    logApiKeyStorage();
    if (! GM_getValue('API_KEY', null)) {
        let newSideBarContainer = document.createElement('div');
        newSideBarContainer.id = 'getApiKeyContainer';
        newSideBarContainer.classList.add('centeredDivAlert');

        let titleContainer = document.createElement('div');
        let title = document.createTextNode('Cooldown Script');
        titleContainer.appendChild(title);
        newSideBarContainer.appendChild(titleContainer);

        let apiInputContainer = document.createElement('div');
        let newInput = document.createElement('input');
        newInput.id = 'apiKeyInput';
        newInput.type = 'text';
        newInput.placeholder = 'API_KEY';

        let newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.innerText = 'SAVE';
        newButton.addEventListener('click', handleSaveBtn);

        apiInputContainer.appendChild(newInput);
        apiInputContainer.appendChild(newButton);
        newSideBarContainer.appendChild(apiInputContainer);

        document.body.appendChild(newSideBarContainer);
    }

    logApiKeyStorage();
}

function handle_cooldownEndTimesJSON_storageChange(name, old_value, new_value, remote) {
    log(`name=${name}, old_value=${old_value}, new_value=${new_value}, remote=${remote}`);
}

function checkAPI() {
    const api_key = GM_getValue('API_KEY', null);
    if (! api_key) {
        return null;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.torn.com/user/?selections=timestamp,cooldowns,travel&key=${api_key}`,
        onload:     function (responseDetails) {
            log(`responseDetails.responseText=${responseDetails.responseText}`);

            if (GM_getValue('cooldownEndTimesJSON', null) !== responseDetails.responseText) {
                const json = JSON.parse(responseDetails.responseText);
                const currentTimeUnix = Math.floor(Date.now() / 1000);

                const cooldownEndTimesJSON = {
                    "drugCooldownEndUnix": json.timestamp + json.cooldowns.drug,
                    "boosterCooldownEndUnix": json.timestamp + json.cooldowns.booster,
                    "travel": json.travel
                };

                GM_setValue('cooldownEndTimesJSON', JSON.stringify(cooldownEndTimesJSON));
            }
        }
    })
}

function mainLoop() {
    log('START mainLoop()');

    if (! GM_getValue('API_KEY', null)) {
        log('aborting mainLoop() (missing API key)');
        return;
    }

    const lastUpdateTime = GM_getValue('lastUpdateTime', null);
    log(`lastUpdateTime=${lastUpdateTime}`);
    const currentTimeMS = Date.now();

    if (lastUpdateTime && (currentTimeMS - lastUpdateTime) < 30 * 1000) {
        // An instance of the userscript has updated in the last 30 sec
        return; 
    }

    let cooldownEndTimesJSON = GM_getValue('cooldownEndTimesJSON', null);
    cooldownEndTimesJSON = cooldownEndTimesJSON !== null ? JSON.parse(cooldownEndTimesJSON) : null;
    const drugCooldownEndUnix = cooldownEndTimesJSON !== null ? cooldownEndTimesJSON.drugCooldownEndUnix : null;
    const boosterCooldownEndUnix = cooldownEndTimesJSON !== null ? cooldownEndTimesJSON.boosterCooldownEndUnix : null;

    const currentTimeUnix = Math.floor(currentTimeMS / 1000);
    if (drugCooldownEndUnix && boosterCooldownEndUnix &&
        currentTimeUnix < drugCooldownEndUnix && currentTimeUnix < boosterCooldownEndUnix) {
        // Cooldowns have not expired yet
        return;
    }

    /** Flying away from Torn:
            "travel": {
                "destination": "Mexico",
                "timestamp": 1609833072,
                "departed": 1609831992,
                "time_left": 1075
            }
        */

        /** Sitting overseas:
            "travel": {
                "destination": "Mexico",
                "timestamp": 1609833072,
                "departed": 1609831992,
                "time_left": 0
            }
        */

    /** Flying back to Torn:
            "travel": {
                "destination": "Torn",
                "timestamp": 1609834185,
                "departed": 1609833105,
                "time_left": 1016
            }
        */

    /** Sitting in Torn:
            "travel": {
                "destination": "Torn",
                "timestamp": 1609834185,
                "departed": 1609833105,
                "time_left": 0
            }
        */

    if (lastUpdateTime && cooldownEndTimesJSON) {
        const travel = cooldownEndTimesJSON.travel;
        if (travel.destination !== "Torn" && currentTimeUnix < travel.timestamp) {
            // flying away from Torn
            return;
        }

        if (travel.destination === "Torn" && currentTimeUnix < travel.timestamp) {
            // flying toward Torn
            return;
        }

        if (travel.destination !== "Torn" && travel.timestamp <= currentTimeUnix) {
            // sitting overseas
            const timeSinceLastUpdateMs = currentTimeMS - lastUpdateTime;
            if (timeSinceLastUpdateMs < 5 * 60 * 1000) {
                // been less than 5 minutes since last update
                // no point checking as shortest flight is ~6 minutes
                return;
            }
        }
    }

    GM_setValue('lastUpdateTime', currentTimeMS);
    checkAPI();
}

function removeAlertContainer() {
    const alertContainer = document.querySelector('#alertContainer');
    if (alertContainer) {
        log('removing #alertContainer');
        alertContainer.parentNode.removeChild(alertContainer);
    }
}

function handleSleepBtn() {
    const currentTimeUnix = Math.floor(Date.now() / 1000);
    const currentPlusMinute = currentTimeUnix + 60;
    GM_setValue('alertSleepEndUnix', currentPlusMinute);
    removeAlertContainer();
}

function handle_alertSleepEndUnix_storageChange(name, old_value, new_value, remote) {
    handleSleepBtn();
    log(`name=${name}, old_value=${old_value}, new_value=${new_value}, remote=${remote}`);
}

function handleDrugCooldownButton() {
    handleSleepBtn();
    window.location.href = 'https://www.torn.com/item.php#drugs-items';
}

function handleBoosterCooldownButton() {
    handleSleepBtn();
    window.location.href = 'https://www.torn.com/item.php#energy-d-items';
}

function handleAlerts() {
    if (FORCE_EXPIRED_COOLDOWNS) {
        const currentTimeUnixOptional = Math.floor(Date.now() / 1000);
        const cooldownEndTimesJSON = {
            "drugCooldownEndUnix": currentTimeUnixOptional - 10,
            "boosterCooldownEndUnix": currentTimeUnixOptional - 100,
            "travel": {
                "destination": "Torn",
                "timestamp": 1609834185,
                "departed": 1609833105,
                "time_left": 0
            }
        };

        GM_setValue('cooldownEndTimesJSON', JSON.stringify(cooldownEndTimesJSON));
    }

    if (! GM_getValue('API_KEY', null)) {
        log('aborting handleAlerts() (missing API key)');
        return;
    }

    let cooldownEndTimesJSON = GM_getValue('cooldownEndTimesJSON', null);
    if (! cooldownEndTimesJSON) {
        log('no cooldownEndTimesJSON in storage');
        removeAlertContainer();
        return;
    }

    cooldownEndTimesJSON = JSON.parse(cooldownEndTimesJSON);
    const currentTimeUnix = Math.floor(Date.now() / 1000);
    const drugCooldownEndUnix = cooldownEndTimesJSON.drugCooldownEndUnix;
    const boosterCooldownEndUnix = cooldownEndTimesJSON.boosterCooldownEndUnix;

    if (currentTimeUnix < drugCooldownEndUnix && currentTimeUnix < boosterCooldownEndUnix) {
        // no expired cooldowns
        removeAlertContainer();
        return;
    }

    const travel = cooldownEndTimesJSON.travel;
    if (! (travel.destination === "Torn" && travel.time_left === 0)) {
        // not in torn, so don't display
        removeAlertContainer();
        return;
    }

    const timeSleptAlertToUnix = GM_getValue('alertSleepEndUnix', null);
    if (timeSleptAlertToUnix) {
        if (currentTimeUnix < timeSleptAlertToUnix) {
            // alert is slept
            removeAlertContainer();
            return;
        }
    }

    if (document.querySelector('#alertContainer')) {
        // alert already present
        return;
    }

    log('EXPIRED COOLDOWNS');
    let alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    alertContainer.classList.add('centeredDivAlert');

    let titleContainer = document.createElement('div');
    titleContainer.style.marginBottom = "5px";
    let title = document.createTextNode('Cooldown(s) over:');
    titleContainer.appendChild(title);

    let bodyContainer = document.createElement('div');
    if (drugCooldownEndUnix <= currentTimeUnix) {
        let drugContainer = document.createElement('div');
        let drugCooldownButton = document.createElement('button');
        drugCooldownButton.type = 'button';
        drugCooldownButton.innerText = 'Drug Cooldown';
        drugCooldownButton.style.marginBottom = "30px"
        drugCooldownButton.addEventListener('click', handleDrugCooldownButton);
        drugContainer.appendChild(drugCooldownButton);
        bodyContainer.appendChild(drugContainer);
    }

    if (boosterCooldownEndUnix <= currentTimeUnix) {
        let boosterContainer = document.createElement('div');
        let boosterCooldownButton = document.createElement('button');
        boosterCooldownButton.type = 'button';
        boosterCooldownButton.innerText = 'Booster Cooldown';
        boosterCooldownButton.style.marginBottom = "30px"
        boosterCooldownButton.addEventListener('click', handleBoosterCooldownButton);
        boosterContainer.appendChild(boosterCooldownButton);
        bodyContainer.appendChild(boosterContainer);
    }

    let sleepContainer = document.createElement('div');
    let sleepButton = document.createElement('button');
    sleepButton.type = 'button';
    sleepButton.innerText = 'sleep 1 minute';
    sleepButton.addEventListener('click', handleSleepBtn);
    sleepContainer.appendChild(sleepButton);

    alertContainer.appendChild(titleContainer);
    alertContainer.appendChild(bodyContainer);
    alertContainer.appendChild(sleepContainer);

    log('adding #alertContainer')
    document.body.appendChild(alertContainer);
}

function main() {
    'use strict';

    log('START cooldown userscript');
    addCSS();

    logStorage();
    initApiKey();
    logStorage();

    GM_addValueChangeListener('cooldownEndTimesJSON', handle_cooldownEndTimesJSON_storageChange);
    GM_addValueChangeListener('alertSleepEndUnix', handle_alertSleepEndUnix_storageChange);

    mainLoop();
    setInterval(mainLoop, 30 * 1000);

    handleAlerts();
    setInterval(handleAlerts, 1 * 1000);
}

main();

})();