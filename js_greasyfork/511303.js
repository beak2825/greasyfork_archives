// ==UserScript==
// @name         Click and Hit
// @namespace    something something
// @version      2024-11-17
// @description  try to hit the ground and the sky!
// @author       You and the rest of them
// @match        https://www.erepublik.com/id
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511303/Click%20and%20Hit.user.js
// @updateURL https://update.greasyfork.org/scripts/511303/Click%20and%20Hit.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const _token = csrfToken;
    const locationId = erepublik.citizen.countryLocationId;
    const locationName = erepublik.citizen.countryLocationName;
    const energy = erepublik.citizen.energy;
    const wnt = dotNotifications;
    const day = erepublik.settings.eDay;

    const captcha = checkSessionValidationExists()
    if (captcha) {
        setTimeout(function() {
            reloadPage();
        }, 3600000);
    } else {
        observeAndCreateModal();
    }

    //URL LIST
    const url = {
        getinventory: "https://www.erepublik.com/en/military/fightDeploy-getInventory",
        battlebooster: "https://www.erepublik.com/en/military/fight-activateBooster",
        battleeffect: "https://www.erepublik.com/en/main/fight-activateBattleEffect",
        inventorybooster: "https://www.erepublik.com/en/economy/activateBooster",
        deploy: "https://www.erepublik.com/en/military/fightDeploy-startDeploy",
        battleconsole: "https://www.erepublik.com/en/military/battle-console",
    };

    //OBSERVER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Function to observe DOM changes and create the modal
    async function observeAndCreateModal() {
        // Introduce a delay before starting to observe
        await delay(2000); // Adjust the delay as needed

        let triggerCount = 0; // Counter for MutationObserver triggers
        const maxTriggers = 5; // Limit for triggers


        const observer = new MutationObserver((mutationsList) => {
            console.log(triggerCount);
            triggerCount += 1;

            // Check if the modal already exists
            if (!document.getElementById('myModal')) {
                createModal();
            }

            // Stop observing after reaching the trigger limit
            if (triggerCount >= maxTriggers) {
                observer.disconnect();
                logMessage(`FULLY RELOADED`);
            }
        });

        // Start observing the document for changes
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    async function createModal() {
        if (document.getElementById('myModal')) {
            return; // Exit if modal is already present
        }

        // Initialize battle type state
        const battleType = getLocalStorageData('battleType') || 'Ground'; // Default to Ground
        const buttonText = battleType === 'Ground' ? 'Ground' : 'Sky';

        const modalHTML = `
        <div id="myModal" style="display:block; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
            <div style="background-color:white; margin:20% auto; padding:20px; border:1px solid #888; width:900px; max-width:90%; position:relative; display:flex;">
                <div style="flex:1; padding:10px;">
                    <span id="closeModal" style="position:absolute; top:10px; right:10px; cursor:pointer; font-size:20px;">&times;</span>
                    <h3>Location: ${locationName}</h3>
                    <div style="margin-bottom:10px; display:flex; align-items:center;">
                        <label for="battleToggle" style="font-size:16px; margin-right:10px;">Battle Type:</label>
                        <button type="button" id="battleToggle" style="padding:5px 10px; font-size:16px;">${buttonText}</button>
                    </div><br>
                    <form id="dataForm" style="width:200px;">
                        <label for="dmgL">LOW DAMAGE:</label><br>
                        <input type="number" id="dmgL" value="${getLocalStorageData('dmgL') || ''}" style="border:none; border-bottom:1px solid #ccc; outline:none; width:50%; padding:5px; margin-bottom:10px;"><br>
                        <label for="dmgH">HIGH DAMAGE:</label><br>
                        <input type="number" id="dmgH" value="${getLocalStorageData('dmgH') || ''}" style="border:none; border-bottom:1px solid #ccc; outline:none; width:50%; padding:5px; margin-bottom:10px;"><br>
                        <button type="button" id="saveData">Save</button>
                        <button type="button" id="hitButton">Hit</button>
                    </form>
                </div>
                <div id="logArea" style="flex:1; padding:10px; border-left:1px solid #888; max-height:400px; overflow-y:auto; background-color:#f9f9f9;">
                    <!-- Log messages will appear here -->
                </div>
            </div>
        </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('myModal');
        const closeModal = document.getElementById('closeModal');
        const saveButton = document.getElementById('saveData');
        const battleToggle = document.getElementById('battleToggle');
        const hitButton = document.getElementById('hitButton');

        const dmgLInput = document.getElementById('dmgL');
        const dmgHInput = document.getElementById('dmgH');

        //wnt here
        if (energy > 60){
            //do wnt
            await checkNotifications(wnt);
            await delay(3000);

            //check daily challenge
            logMessage(`Checking Daily Challenge`);
            await daily();
            await delay(3000);

            //claim weekly challenge
            logMessage(`Checking Weekly Challenge`);
            await weekly();
            await delay(3000);
        }

        // Close modal when 'X' is clicked
        closeModal.onclick = function() {
            modal.style.display = 'none';
        };

        // Close modal when clicking outside of the modal content
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };

        // Toggle battle type functionality
        battleToggle.onclick = function() {
            const currentType = battleToggle.textContent === 'Ground' ? 'Sky' : 'Ground';
            battleToggle.textContent = currentType;

            // Update local storage with new battle type
            saveToLocalStorage('battleType', currentType);

            // Load corresponding damage values
            const lowDamageKey = currentType === 'Ground' ? 'groundLowDamage' : 'skyLowDamage';
            const highDamageKey = currentType === 'Ground' ? 'groundHighDamage' : 'skyHighDamage';
            dmgLInput.value = getLocalStorageData(lowDamageKey) || '';
            dmgHInput.value = getLocalStorageData(highDamageKey) || '';

            logMessage(`Switched to ${currentType} battle type`);
        };

        // Save button functionality
        saveButton.onclick = function() {
            const currentType = battleToggle.textContent;
            const lowDamageKey = currentType === 'Ground' ? 'groundLowDamage' : 'skyLowDamage';
            const highDamageKey = currentType === 'Ground' ? 'groundHighDamage' : 'skyHighDamage';

            // Save damage values to the respective keys in local storage
            const lowDamageValue = dmgLInput.value;
            const highDamageValue = dmgHInput.value;

            saveToLocalStorage(lowDamageKey, lowDamageValue);
            saveToLocalStorage(highDamageKey, highDamageValue);

            logMessage(`Saved ${currentType} Low Damage: ${lowDamageValue}, High Damage: ${highDamageValue}`);
        };

        // Hit button functionality
        hitButton.onclick = function() {
            logMessage('Hit triggered');
            checkBattle();
        };

        // Initial load of the correct damage values based on battle type
        const initialLowDamageKey = battleType === 'Ground' ? 'groundLowDamage' : 'skyLowDamage';
        const initialHighDamageKey = battleType === 'Ground' ? 'groundHighDamage' : 'skyHighDamage';
        dmgLInput.value = getLocalStorageData(initialLowDamageKey) || '';
        dmgHInput.value = getLocalStorageData(initialHighDamageKey) || '';

        logMessage(`Loaded ${battleType} damage values`);
        logMessage(`READY TO DEPLOY!`);
        logMessage(`${energy} Energy`);
    }

    async function checkBattle() {
            // Get the current battle type (Ground or Sky)
            const battleType = getLocalStorageData('battleType') || 'Ground'; // Default to Ground if not set

            // Retrieve the corresponding low and high damage values based on battle type
            const lowDamageKey = battleType === 'Ground' ? 'groundLowDamage' : 'skyLowDamage';
            const highDamageKey = battleType === 'Ground' ? 'groundHighDamage' : 'skyHighDamage';
            const type = battleType === 'Ground' ? 0 : 1;

            // Get the values from local storage, or set to 900000000000 if not found
            let lowDamage = parseInt(getLocalStorageData(lowDamageKey)) || 900000000000;
            let highDamage = parseInt(getLocalStorageData(highDamageKey)) || 900000000000;
            if(day < 6211){
              lowDamage = lowDamage * 2;
              highDamage = highDamage *2;
            } 

            // Log the retrieved values
            logMessage(`Battle Type: ${battleType}`);
            logMessage(`Low Damage: ${lowDamage}`);
            logMessage(`High Damage: ${highDamage}`);

            if (energy > 1000){
                //fetch data
                const fetchTime = getCurrentUnixTimestamp();
                const maxStartTime = fetchTime - (85 * 60);
                const fetchlist = await fetchData(`https://www.erepublik.com/en/military/campaignsJson/list?${fetchTime}`);
                await delay(666);
                const zoneList = await fetchData(`https://www.erepublik.com/en/military/campaignsJson/citizen?${fetchTime}`);

                const list = Object.values(fetchlist.battles).filter(battle => {
                    return (
                        battle.war_type === "direct" &&
                        (battle.inv.id === locationId || battle.def.id === locationId) &&
                        battle.start < fetchTime &&
                        battle.start > maxStartTime // Check if the battle started within the last 85 minutes
                    );
                });

                let counter = 0;
                logMessage(`DATA LOADED`);
                logMessage(`PLEASE WAIT`);

                for (const battle of list) {
                    let region = battle.region.name;
                    let battleZoneId;
                    let division;
                    let oppositeId;
                    let deffend;
                    let weapQ;
                    let limit;
                    let totDamage = 0;
                    const idBattle = battle.id;
                    if (type == 1) {
                        battleZoneId = zoneList.battles[idBattle].aircraftZoneId;
                        division = 11;
                        weapQ = -1;
                    } else {
                        battleZoneId = zoneList.battles[idBattle].groundZoneId;
                        division = erepublik.citizen.division;
                        weapQ = 7;
                    }

                    if (locationId === battle.def.id) {
                        deffend = true;
                        oppositeId = battle.inv.id;
                    } else if (locationId === battle.inv.id) {
                        deffend = false;
                        oppositeId = battle.def.id;
                    }




                    const divData = battle.div[battleZoneId];
                    const div_end = divData.division_end;
                    let hit = false;

                    if (div_end == false) {
                        const wall = divData.wall.for;
                        const dom = divData.wall.dom;

                        if ((dom == 50 || (wall != locationId && dom == 100))) {
                            hit = true;
                        }
                    }

                    if (hit) {
                        const round = battle.zone_id;
                        const payloadBS = payloadStat(idBattle, round, round, division, battleZoneId, _token);
                        const checkStat = await PostRequest(payloadBS, url.battleconsole);
                        const empty = checkFighterDataEmpty(checkStat, locationId);
                        //check opposite total damage
                        const opposite = checkFighterDataEmpty(checkStat, oppositeId);
                        if (opposite == false) {
                            totDamage = calculateTotalValue(checkStat, oppositeId)
                        }

                        if (empty) {
                            const inventoryLoad = inventoryPayload(idBattle, locationId, battleZoneId, _token);
                            const inventory = await PostRequest(inventoryLoad, url.getinventory);
                            const bag = skinAndDph(inventory, weapQ);
                            let pool = inventory.poolEnergy;
                            const max = pool - 50;
                            const skin = bag.skinId;
                            let damage = bag.damageBonus;
                            const wAmount = bag.weaponAmount;


                            if(day < 6211){
                                  damage = damage * 2;
                                } 
                            const damageHit = checkDamage(lowDamage, highDamage, deffend, totDamage, damage, max);
                            logMessage(`${region}`);
                            logMessage(`deff: ${deffend}`);
                            logMessage(`TOT: ${totDamage}`);
                            logMessage(`DPH: ${damage}`);
                            logMessage(`ENERGY: ${damageHit}`);
                            logMessage(`DAMAGE: ${(damageHit * damage)/10}`);

                            let restTime;

                                if (weapQ == 10) {
                                    restTime = (damageHit / 10) * 1010;
                                } else {
                                    restTime = (damageHit / 10) * 400;
                                }

                            let forceHit = energy - 100;

                            if (pool > damageHit) {
                                const shadow = payloadShadow(idBattle, battleZoneId, locationId, _token);
                                if(day < 6211){
                                  await PostRequest(shadow, url.battlebooster);
                                } 
                                const rocketLoad = deployLoad(idBattle, battleZoneId, locationId, weapQ, damageHit, skin, _token);
                                await PostRequest(rocketLoad, url.deploy);
                                counter++;
                                logMessage(`hit ${region}`);
                                await delay(restTime);
                            } else if (pool < damageHit && !deffend) {
                                if (type === 0 || (type === 1 && energy > 2000)) {
                                    const forceLoad = deployLoad(idBattle, battleZoneId, locationId, weapQ, forceHit, skin, _token);
                                    await PostRequest(forceLoad, url.deploy);
                                    counter++;
                                    logMessage(`force hit ${region}`);
                                }
                            }
                        }
                        await delay(5000);
                    }
                    await delay(2000);
                    if(counter > 0){
                        reloadPage();
                    }
                }

                if(counter == 0) {
                    logMessage(`NO EMPTY BATTLE`);
                }
            }
    }

    //LIST OF FUNCTION - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function checkSessionValidationExists() {
        if (typeof SERVER_DATA !== 'undefined' && SERVER_DATA.sessionValidation !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    function getCurrentUnixTimestamp() {
        const currentTime = new Date();
        const unixTimestamp = Math.floor(currentTime.getTime() / 1000); // Convert milliseconds to seconds
        return unixTimestamp;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function reloadPage() {
        const refresh = getLocalStorageData('refresh');
        const now = getCurrentUnixTimestamp();
        const next = now + 900;
        saveToLocalStorage('refresh', next);
        await delay(200);

        const culture = erepublik.settings.culture;
        window.location.href = `https://www.erepublik.com/${culture}`;
    }


    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            reloadPage();
            throw new Error(`Failed to fetch data from ${url}: ${error.message}`);

        }
    }

    // Function to send the payload using POST request
    async function PostRequest(payload, url) {

        try {
            await delay(1000);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: Object.keys(payload)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
                    .join('&')
            });

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error("Error:", error);
            reloadPage();
            return null;
        }
    }

    // Function to get data from local storage or set default value
    function getLocalStorageData(key) {
        let value = localStorage.getItem(key);
        if (value === null) {
            value = '0'; // Default value is '0'
            localStorage.setItem(key, value);
        }
        return value;
    }

    function saveToLocalStorage(key, value) {
        // Check if the key exists in local storage
        if (localStorage.getItem(key) === null) {
            // If key does not exist, set it to default value 0
            localStorage.setItem(key, '0');
        }
        // Update the key with the new value
        localStorage.setItem(key, value);
    }



    // Function to log messages to the log area
    function logMessage(message) {
        const logArea = document.getElementById('logArea');
        if (logArea) {
            const logEntry = document.createElement('p');
            logEntry.textContent = message;
            logArea.appendChild(logEntry);
            // Scroll to the bottom of the log area
            logArea.scrollTop = logArea.scrollHeight;
        }
    }

    //LIST OF BATTLE FUNCTION -----------------------------------------------------------------------------------------
    function checkFighterDataEmpty(responseData, countryLocationId) {
        if (responseData && responseData[countryLocationId] && responseData[countryLocationId]["fighterData"]) {
            const fighterData = responseData[countryLocationId]["fighterData"];
            const isFighterDataEmpty = Object.keys(fighterData).length === 0;
            return isFighterDataEmpty;
        } else {
            console.log(`Could not find ${countryLocationId}.fighterData in the response.`);
        }
    }

    // Function to calculate the total value
    function calculateTotalValue(data, countryId) {
        let totalValue = 0;
        const fighterData = data[countryId] ?.fighterData || {};

        for (const key in fighterData) {
            if (fighterData.hasOwnProperty(key)) {
                const value = fighterData[key].value;
                if (typeof value === 'string') {
                    const parsedValue = parseInt(value.replace(/,/g, ''), 10);
                    if (!isNaN(parsedValue)) {
                        totalValue += parsedValue;
                    }
                }
            }
        }

        return totalValue;
    }

    function skinAndDph(inventory, weapQu) {
        const listweapon = inventory.weapons;
        const vehicles = inventory.vehicles;
        let weaponAmount;
        let dph;
        let skinId;
        let skinBonus;


        const objectWithQuality = listweapon.find(item => item.quality === weapQu);
        if (objectWithQuality) {
            weaponAmount = objectWithQuality.amount;
            dph = objectWithQuality.damageperHit;
        }

        const skinRecommended = vehicles.find(skin => skin.isRecommended === true);
        if (skinRecommended) {
            skinId = skinRecommended.id;
            skinBonus = skinRecommended.countryData.damageBonus;
        }
        let percentage = 0;
        if (skinBonus !== null) {
            percentage = skinBonus / 100;
        }

        let damageBonus = dph + (dph * percentage);
        return {
            damageBonus,
            skinId,
            weaponAmount
        };

    }

    function checkDamage(low, high, deffend, totDamage, damageBonus, max) {
        let targetDamage;
        let energyCount;
        let random = getRandomNumber();


        const mid = (low + high) / 2;
        const lower = (totDamage / 2) + (totDamage * 0.2);
        const higher = totDamage + (totDamage * 0.08);
        const lowest = low - (low * 0.05);
        const highest = high * 2;


        if (deffend) {
            if (totDamage > low && totDamage < high) {
                targetDamage = higher;
            } else if (totDamage > high && totDamage < highest) {
                targetDamage = lower;
            } else {
                targetDamage = high;
            }

        } else {
            if (totDamage > low && totDamage < mid) {
                targetDamage = lower;
            } else if (totDamage > mid && totDamage < highest) {
                targetDamage = mid;
            } else {
                targetDamage = low;
            }
        }

        console.log("TARGET", targetDamage);

        let exactDamage = Math.floor(damageBonus);
        console.log("DPH", exactDamage);
        const maximum = max * exactDamage;

        if(!deffend && targetDamage > maximum && maximum > low){
            targetDamage = maximum;
        }

        energyCount = Math.ceil((targetDamage / exactDamage) * 10);
        console.log("ENERGY", energyCount);
        if (deffend) {
            energyCount = energyCount + (2 * random);
        } else {
            energyCount = energyCount - random;
        }
        return energyCount;

    }

    function getRandomNumber() {
        return Math.floor(Math.random() * (70 - 10 + 1)) + 10;
    }

    //function wnt
    async function checkNotifications(dotNotifications) {
    if (dotNotifications.training) {
        const jsonData = await fetchData(`https://www.erepublik.com/en/main/training-grounds-json`);
        const groundIds = Array.isArray(jsonData.grounds) ? jsonData.grounds.map(ground => ground.id) : [];
        const canTrain = jsonData.can_train;

        console.log(groundIds);

        if (groundIds.length === 4) {
            // Call the trainLoad function with the ground IDs and the token
            const trainpayload = trainLoad(...groundIds, _token);
            const url = `https://www.erepublik.com/en/economy/train`;

            if(canTrain === true){
                logMessage(`Training`);
                await PostRequest(trainpayload, url);
                await delay(3000);
            }
        } else {
            console.error('Ground IDs are not available or incomplete');
        }
    }

    if (dotNotifications.companies) {
        const jobData = await fetchData(`https://www.erepublik.com/en/main/job-data`);
        if(jobData.isEmployee === true && jobData.alreadyWorked === false){
            const action = "work";
            const urlWork = `https://www.erepublik.com/en/economy/work`;
            const workpayload = workLoad(action, _token);
            await PostRequest(workpayload, urlWork);
            logMessage(`Working`);
            await delay(3000);

            const actionOT = "workOvertime";
            const urlWorkOT = `https://www.erepublik.com/en/economy/workOvertime`;
            const OTworkpayload = workLoad(actionOT, _token);
            await PostRequest(OTworkpayload, urlWorkOT);
            logMessage(`Overtime Work`);
            await delay(3000);
        }
    } else {
        //do OT
        const jobData = await fetchData(`https://www.erepublik.com/en/main/job-data`);
        const timeNow = getCurrentUnixTimestamp();
        const nextOT = jobData.overTime.nextOverTime;
        if (timeNow > nextOT){
            const actionOT = "workOvertime";
            const urlWorkOT = `https://www.erepublik.com/en/economy/workOvertime`;
            const OTworkpayload = workLoad(actionOT, _token);
            await PostRequest(OTworkpayload, urlWorkOT);
            logMessage(`Overtime Work`);
            await delay(3000);
        }
    }

    if (dotNotifications.shop) {
        const urlVIP = `https://www.erepublik.com/en/main/vip-claim`;
        const vipload = VIP(_token);
        await PostRequest(vipload, urlVIP);
        logMessage(`VIP Points claim`);
        await delay(3000);
    }
}

    async function weekly(){
        await delay(3000);
        const weeklyData = await fetchData(`https://www.erepublik.com/en/main/weekly-challenge-data`);
        const maxReward = weeklyData.maxRewardId;

        if(maxReward > 0){
            await delay(3000);
            const urlClaim = `https://www.erepublik.com/en/main/weekly-challenge-collect-all `;
            const weeklyLoad = weeklyPayload(maxReward, _token);
            await PostRequest(weeklyLoad, urlClaim);
            logMessage(`Claim Weekly Reward`);
        }
    }

    async function daily(){
        await delay(3000);
        const urlDaily = `https://www.erepublik.com/en/main/daily-missions-data`;
        const urlSolve = `https://www.erepublik.com/en/main/mission-solve`;
        const dailyLoad = tokenOnly(_token);
        const dataDaily = await PostRequest(dailyLoad, urlDaily);
        const missions = dataDaily.missions;

        missions.forEach((mission, index) => {
            if (mission.progress.some(p => p.completed === true)) {
                //do something

                setTimeout(() => {
                    const id = mission.id;
                    const loadSolve = solveDaily(id, _token);
                    PostRequest(loadSolve, urlSolve);
                    logMessage(`Claim Daily Mission`);
                }, index * 2000);
            }
        });

        const urlObj = `https://www.erepublik.com/en/main/objective-status`;
        const dataObj = await PostRequest(dailyLoad, urlObj);
        const dataStatus = dataObj.status;
        const dataAllObj = dataObj.data;
        await claimNextObjective(dataStatus, dataAllObj);
        await delay(1000);
    }

    async function claimNextObjective(status, data) {
    const progress = status.progress;
    const claimedObjectives = status.claimedObjectives || {};
    const objectives = Object.keys(data).map(Number).sort((a, b) => a - b); // Sort objectives in ascending order

    // Find the highest claimed objective
    let highestClaimed = 0;
    for (const key in claimedObjectives) {
        const objectiveCost = claimedObjectives[key].objective_cost;
        if (objectiveCost > highestClaimed) {
            highestClaimed = objectiveCost;
        }
    }

        const urlClaim = `https://www.erepublik.com/en/main/objective-claim-reward`;
    // Find the next objective that can be claimed
    for (const objectiveCost of objectives) {
        if (objectiveCost > highestClaimed && objectiveCost <= progress) {
            logMessage(`Claim Daily Mission Reward Box`);
            const objClaim = claimObj(objectiveCost, _token);
            await PostRequest(objClaim, urlClaim);
            await delay(2000);
        }
    }

    console.log("No objectives available for claiming.");
    return null; // No objective can be claimed
}

    //list of payload
    // Function to construct the payload from variables
    function payloadStat(battleId, zoneId, round, division, battleZoneId, _token) {
        const action = "battleStatistics";
        const type = "damage";
        const leftPage = 1;
        const rightPage = 1;

        return {
            battleId,
            zoneId,
            action,
            round,
            division,
            battleZoneId,
            type,
            leftPage,
            rightPage,
            _token
        };
    }

    //payload for inventory
    function inventoryPayload(battleId, sideCountryId, battleZoneId, _token) {
        return {
            battleId,
            sideCountryId,
            battleZoneId,
            _token
        };
    }

    //function to deploy
     function deployLoad(battleId, battleZoneId, sideCountryId, weaponQuality, totalEnergy, skinId, _token) {
        return {
            battleId,
            battleZoneId,
            sideCountryId,
            weaponQuality,
            totalEnergy,
            skinId,
            _token
        };
    }

    function trainLoad(ground0, ground1, ground2, ground3, _token) {
    return {
        "grounds[0][id]": ground0,
        "grounds[0][train]": 1,
        "grounds[1][id]": ground1,
        "grounds[1][train]": 1,
        "grounds[2][id]": ground2,
        "grounds[2][train]": 1,
        "grounds[3][id]": ground3,
        "grounds[3][train]": 1,
        _token
    };
}
    function workLoad(action, _token) {
        const action_type = action;
        return {
            action_type,
            _token
        };
    }

    function VIP(_token) {
        return {
            _token
        };
    }

    function weeklyPayload(max, _token) {
        const maxRewardId = max;
        return {
            maxRewardId,
            _token
        };
    }

    function solveDaily(id, _token) {
        const missionId = id;
        return {
            missionId,
            _token
        };
    }

    function claimObj(id, _token) {
        const objectiveCost = id;
        return {
            objectiveCost,
            _token
        };
    }

    function tokenOnly(_token) {
        return {
            _token
        };
    }

    // Function to construct the payload from variables
    function payloadShadow(battleId, battleZoneId, sideId, _token) {
        const type = "shadow_fighter";
        const quality = 100;
        const duration = 7200;


        return {
            type,
            quality,
            duration,
            battleId,
            battleZoneId,
            sideId,
            _token
        };
    }




})();