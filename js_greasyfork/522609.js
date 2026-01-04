// ==UserScript==
// @name         COMPLETELY AFK
// @namespace    http://tampermonkey.net/
// @version      2025-01-05
// @description  try to take a rest!
// @author       You
// @match        https://www.erepublik.com/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522609/COMPLETELY%20AFK.user.js
// @updateURL https://update.greasyfork.org/scripts/522609/COMPLETELY%20AFK.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const _token = csrfToken;
    const cName = erepublik.citizen.name;
    const cId = erepublik.citizen.citizenId;
    const gold = erepublik.citizen.gold;
    const location = erepublik.citizen.countryLocationId;
    const locationName = erepublik.citizen.countryLocationName;
    const energy = erepublik.citizen.energy;
    const energyPool = erepublik.citizen.energyPoolLimit;
    const energyToRecover = erepublik.citizen.energyToRecover;
    const energyPerInterval = erepublik.citizen.energyPerInterval;
    const day = erepublik.settings.eDay;
    const wnt = dotNotifications;


    const recover = Math.floor(energyToRecover/energyPerInterval);
    const full = recover * 360;
    const waitE = 0;

    const identity = `${cName} - ${energy} / ${energyPool} - ${gold} golds\n`;

    // Extract the "day" value
        const rfcValue = SERVER_DATA.serverTime.rfc;
        const rfcParts = rfcValue.split(", ");
        const dayAbbreviation = rfcParts[0];



    const countriesData = [
    { "id": 1, "name": "Romania", "flag": "🇷🇴" },
    { "id": 9, "name": "Brazil", "flag": "🇧🇷" },
    { "id": 10, "name": "Italy", "flag": "🇮🇹" },
    { "id": 11, "name": "France", "flag": "🇫🇷" },
    { "id": 12, "name": "Germany", "flag": "🇩🇪" },
    { "id": 13, "name": "Hungary", "flag": "🇭🇺" },
    { "id": 14, "name": "China", "flag": "🇨🇳" },
    { "id": 15, "name": "Spain", "flag": "🇪🇸" },
    { "id": 23, "name": "Canada", "flag": "🇨🇦" },
    { "id": 24, "name": "USA", "flag": "🇺🇸" },
    { "id": 26, "name": "Mexico", "flag": "🇲🇽" },
    { "id": 27, "name": "Argentina", "flag": "🇦🇷" },
    { "id": 28, "name": "Venezuela", "flag": "🇻🇪" },
    { "id": 29, "name": "United Kingdom", "flag": "🇬🇧" },
    { "id": 30, "name": "Switzerland", "flag": "🇨🇭" },
    { "id": 31, "name": "Netherlands", "flag": "🇳🇱" },
    { "id": 32, "name": "Belgium", "flag": "🇧🇪" },
    { "id": 33, "name": "Austria", "flag": "🇦🇹" },
    { "id": 34, "name": "Czech Republic", "flag": "🇨🇿" },
    { "id": 35, "name": "Poland", "flag": "🇵🇱" },
    { "id": 36, "name": "Slovakia", "flag": "🇸🇰" },
    { "id": 37, "name": "Norway", "flag": "🇳🇴" },
    { "id": 38, "name": "Sweden", "flag": "🇸🇪" },
    { "id": 39, "name": "Finland", "flag": "🇫🇮" },
    { "id": 40, "name": "Ukraine", "flag": "🇺🇦" },
    { "id": 41, "name": "Russia", "flag": "🇷🇺" },
    { "id": 42, "name": "Bulgaria", "flag": "🇧🇬" },
    { "id": 43, "name": "Turkey", "flag": "🇹🇷" },
    { "id": 44, "name": "Greece", "flag": "🇬🇷" },
    { "id": 45, "name": "Japan", "flag": "🇯🇵" },
    { "id": 47, "name": "South Korea", "flag": "🇰🇷" },
    { "id": 48, "name": "India", "flag": "🇮🇳" },
    { "id": 49, "name": "Indonesia", "flag": "🇮🇩" },
    { "id": 50, "name": "Australia", "flag": "🇦🇺" },
    { "id": 51, "name": "South Africa", "flag": "🇿🇦" },
    { "id": 52, "name": "Republic of Moldova", "flag": "🇲🇩" },
    { "id": 53, "name": "Portugal", "flag": "🇵🇹" },
    { "id": 54, "name": "Ireland", "flag": "🇮🇪" },
    { "id": 55, "name": "Denmark", "flag": "🇩🇰" },
    { "id": 56, "name": "Iran", "flag": "🇮🇷" },
    { "id": 57, "name": "Pakistan", "flag": "🇵🇰" },
    { "id": 58, "name": "Israel", "flag": "🇮🇱" },
    { "id": 59, "name": "Thailand", "flag": "🇹🇭" },
    { "id": 61, "name": "Slovenia", "flag": "🇸🇮" },
    { "id": 63, "name": "Croatia", "flag": "🇭🇷" },
    { "id": 64, "name": "Chile", "flag": "🇨🇱" },
    { "id": 65, "name": "Serbia", "flag": "🇷🇸" },
    { "id": 66, "name": "Malaysia", "flag": "🇲🇾" },
    { "id": 67, "name": "Philippines", "flag": "🇵🇭" },
    { "id": 68, "name": "Singapore", "flag": "🇸🇬" },
    { "id": 69, "name": "Bosnia and Herzegovina", "flag": "🇧🇦" },
    { "id": 70, "name": "Estonia", "flag": "🇪🇪" },
    { "id": 71, "name": "Latvia", "flag": "🇱🇻" },
    { "id": 72, "name": "Lithuania", "flag": "🇱🇹" },
    { "id": 73, "name": "North Korea", "flag": "🇰🇵" },
    { "id": 74, "name": "Uruguay", "flag": "🇺🇾" },
    { "id": 75, "name": "Paraguay", "flag": "🇵🇾" },
    { "id": 76, "name": "Bolivia", "flag": "🇧🇴" },
    { "id": 77, "name": "Peru", "flag": "🇵🇪" },
    { "id": 78, "name": "Colombia", "flag": "🇨🇴" },
    { "id": 79, "name": "North Macedonia", "flag": "🇲🇰" },
    { "id": 80, "name": "Montenegro", "flag": "🇲🇪" },
    { "id": 81, "name": "Republic of China (Taiwan)", "flag": "🇹🇼" },
    { "id": 82, "name": "Cyprus", "flag": "🇨🇾" },
    { "id": 83, "name": "Belarus", "flag": "🇧🇾" },
    { "id": 84, "name": "New Zealand", "flag": "🇳🇿" },
    { "id": 164, "name": "Saudi Arabia", "flag": "🇸🇦" },
    { "id": 165, "name": "Egypt", "flag": "🇪🇬" },
    { "id": 166, "name": "United Arab Emirates", "flag": "🇦🇪" },
    { "id": 167, "name": "Albania", "flag": "🇦🇱" },
    { "id": 168, "name": "Georgia", "flag": "🇬🇪" },
    { "id": 169, "name": "Armenia", "flag": "🇦🇲" },
    { "id": 170, "name": "Nigeria", "flag": "🇳🇬" },
    { "id": 171, "name": "Cuba", "flag": "🇨🇺" }
];

    //fetch all data from local storage
    const battleId = getLocalStorageData('battleID');
    const battleZoneId = getLocalStorageData('battleZoneId');
    const round = getLocalStorageData('round');
    const region = getLocalStorageData('region');
    const target = getLocalStorageData('targetCountry');
    const deffend = getLocalStorageData('deffend');
    const start = getLocalStorageData('start');
    const refresh = getLocalStorageData('refresh');
    const enemy = getLocalStorageData('targetCountry');
    const defP = Number(getLocalStorageData('defP'));
    const invP = Number(getLocalStorageData('invP'));
    const checkwar = getLocalStorageData('check');

    //modal box related
        const toggleState = getLocalStorageData('toggleState');
        const battleType = getLocalStorageData('battleType') || 'Ground'; // Default to Ground
        let weapQuality = battleType === 'Ground' ? 7 : 0;
        let hitDiv = battleType === 'Ground' ? 4 : 11;
        const lowDamageKey = battleType === 'Ground' ? 'groundLowDamage' : 'skyLowDamage';
        const highDamageKey = battleType === 'Ground' ? 'groundHighDamage' : 'skyHighDamage';
        const lowDamage = Number(getLocalStorageData(lowDamageKey));
        const highDamage = Number(getLocalStorageData(highDamageKey));

    //min energy related

    let minEnergy = Number(getLocalStorageData('minEnergy'));

    if (dayAbbreviation == "Tue") {
        minEnergy = 1700;
    }



    const captcha = checkSessionValidationExists()
    if (captcha) {
        const mCapth = `verify Capthca https://www.erepublik.com/en\n[${identity}]`;
        sendMessage(mCapth);
        // Delay of 2 seconds
        setTimeout(function() {
            reloadPage();
        }, 3600000);
    } else {
        observeAndCreateModal();
    }

    // Data keys
    const keys = {
        dmgL: 'dmgL',
        dmgH: 'dmgH',
        weapQ: 'weapQ',
    };

    //URL LIST
    const url = {
        getinventory: "https://www.erepublik.com/en/military/fightDeploy-getInventory",
        battlebooster: "https://www.erepublik.com/en/military/fight-activateBooster",
        battleeffect: "https://www.erepublik.com/en/main/fight-activateBattleEffect",
        inventorybooster: "https://www.erepublik.com/en/economy/activateBooster",
        deploy: "https://www.erepublik.com/en/military/fightDeploy-startDeploy",
        battleconsole: "https://www.erepublik.com/en/military/battle-console",
    };


    async function changeTarget(){
        //change target to the nearest battle
        const fetchTime = getCurrentUnixTimestamp();
        const data = await fetchData(`https://www.erepublik.com/en/military/campaignsJson/list?${fetchTime}`);


        const battles = data.battles;

        // Filter battles where either def.id or inv.id matches the location
        const filteredBattles = Object.values(battles).filter(battle =>
                                                              (battle.def.id === location || battle.inv.id === location) &&
                                                              battle.def.points < 130 && battle.inv.points< 130 &&
                                                              battle.war_type == "direct"
                                                             );

        // Sort the filtered battles by the 'start' value in ascending order
        filteredBattles.sort((a, b) => a.start - b.start);

        // Get the smallest object (the one with the earliest start time)
        const selected = filteredBattles.length > 0 ? filteredBattles[0] : null;

        let newTarget;
        if(location === selected.def.id){
            newTarget = selected.inv.id;
        } else {
            newTarget = selected.def.id;
        }

        let Message = `[${identity}]\nNew Target for mission: ${countryName(newTarget)}`;
        logMessage(Message);
        sendMessage(Message);

        saveToLocalStorage('targetCountry', newTarget);
        saveToLocalStorage('round', 0);
        await delay(3000);

        const next = Math.abs(checkwar - fetchTime);
        if(checkwar < fetchTime && next > 15555){
            //cek battle
            //await Serb(battles);
            await delay(5000);
            await checkAllBattle(data);
            await delay(5000);

            saveToLocalStorage('check', fetchTime);
        }


    }

    async function getBattleInfo(){
        const payLoad = payloadInfo(battleId, round, battleZoneId, _token);
        const data = await PostRequest(payLoad, url.battleconsole);

        const filteredInfo = data.division.filter(div => div.division === hitDiv);
        const d11 = filteredInfo[0];

        let timeUntilStart = 0;
        if (d11.winnerInfo && 'timeUntil' in d11.winnerInfo){
            timeUntilStart = 1;
        }

        const battleTime = data.battle_time;
        let wait = 0;
        if(battleTime < 5400){
            wait = 5400 - battleTime;
        }

        return {
            waitTime: wait,
            timeUntilStart: timeUntilStart
        };
    }

    async function checkZone(timeDiff){
        let weapQu = weapQuality;
        const targetEnemy = Number(target);

        if (weapQu == 0){
            weapQu = -1;
        }

        const division = hitDiv;
        let totDamage = 0;

        if(timeDiff < 7200){
            await delay(waitE);
            //check battle-console.round finished started
            const loadConsole = payloadStat(battleId, round, round, division, battleZoneId, _token);
            logMessage("=========CHECK=========");
            const currentBattle = await PostRequest(loadConsole, url.battleconsole);

            const started = currentBattle.rounds[battleZoneId].started;
            const finished = currentBattle.rounds[battleZoneId].finished;

            logMessage(`Started: ${convert01(started)}`);
            logMessage(`Finished: ${convert01(finished)}`);

            if(started == 1 && finished == 0){
                //check current side

                const empty = await checkFighterDataEmpty(currentBattle, location);
                //check opposite total damage
                const opposite = await checkFighterDataEmpty(currentBattle, target);
                if (opposite == false) {
                    totDamage = calculateTotalValue(currentBattle, target);
                    logMessage(`Enemy Damage: ${totDamage}`);
                }

                let damage;
                //set default damage

                if(timeDiff > 60 && opposite > 0){
                    damage = compareDamage(opposite);
                } else {
                    //hit with default damage
                    damage = defaultDamage();
                }


                logMessage(`Damage to hit: ${damage}`);
                logMessage(`Deffend: ${convert01(deffend)}`);

                logMessage(`Empty: ${empty}`);
                if(!empty){
                    const battleInfo = await getBattleInfo();
                    const wait = battleInfo.waitTime + 150;
                    const checkTime = getCurrentUnixTimestamp();
                    const nextCheck = checkTime + wait;
                    logMessage(`========================`);
                    logMessage(`Now ${msToHMS(checkTime)}`);
                    logMessage(`Wait until ${msToHMS(nextCheck)}`);
                    const delayWait = wait * 1000;
                    const changeDelay = wait * 100;
                    if (wait > 3600) {
                        await delay(changeDelay);
                        await changeTarget();
                        reloadPage();
                    } else {
                        await delay(delayWait);
                    }

                    if (wait > 152){
                        reloadPage();
                    } else {
                        await delay(60000);
                        reloadPage();
                    }
                } else {
                    //hit
                    logMessage("======READY TO HIT======");
                    const bag = await skinAndDph();
                    const skin = bag.skinId;
                    const dph = bag.damageBonus;
                    const wAmount = bag.weaponAmount;

                    //const addMoreEnergy = getLowRandom();
                    const initial = (damage/dph) * 10;
                    const final = initial;
                    const hit = Math.floor(final);

                    logMessage(`DPH: ${dph}`);
                    logMessage(`hit: ${hit} energy`);


                    if(energy > hit){

                        if(day < 6211){
                           const payloadShadow = shadow(battleId, location, battleZoneId, _token);
                            await PostRequest(payloadShadow, url.battlebooster);
                        }

                        let restTime = hit * 100;
                        const rocketLoad = deployLoad(battleId, battleZoneId, location, weapQu, hit, skin, _token);
                        await PostRequest(rocketLoad, url.deploy);
                        logMessage(`====HIT====`);


/*                         if(deffend == 1 && damage > 45000){
                            //activate booster
                            const payloadBooster = booster(_token);
                            await PostRequest(payloadBooster, url.inventorybooster);
                        } */

                        //update minEnergy
                        let newEnergy = minEnergy;
                        if(minEnergy < hit){
                            newEnergy = Math.floor((minEnergy + hit)/2);
                        }

                        await delay(2000);
                        const isi = `new : ${newEnergy}\nhit : ${hit}`;
//sendMessage(newEnergy);

                        saveToLocalStorage('minEnergy', newEnergy);

                        if(day < 6258){
                            const snowLoad = snow(battleId, cId, _token);
                            await PostRequest(snowLoad, url.battleeffect);
                        }

                        //send message here after hit
                        let message = `${identity}\nHIT ${countryName(target)} - ${region} R${round}\nEnemy Damage: ${totDamage}\nEstimated Energy: ${hit}\nEstimated Damage: ${damage}\nBattle Zone: [${battleZoneId}](https://www.erepublik.com/en/military/battlefield/${battleId}/${battleZoneId})`;

                        const recTime = getCurrentUnixTimestamp();
                        const after = Math.abs(energy - hit);
                        const energyAfter = energyToRecover - after;
                        const recovAfter = Math.floor(energyAfter/energyPerInterval);
                        const fullin = recTime + (recovAfter * 360);
                        message += `\nCurrent energy: ${after}\nFull Recovery at ${msToHMS(fullin)}`;
                        sendMessage(message);
                        await delay(restTime);
                        await changeTarget();
                        reloadPage();

                    } else {
                        //cek energy
                        logMessage(`====FAILED TO HIT====`);
                        const recovery2H = energyPerInterval * 20;
                        let change = `${identity}\nEnergy is not enough`;
                        if (recovery2H > energyToRecover){
                            //change target
                            change += `\nEnergy will full before next round\nPlease Change Target`;
                            logMessage("Change Target");
                        }

                        sendMessage(change);
                        await delay(400001);
                        await changeTarget();
                        reloadPage();
                    }

                }

            } else if(started == 1 && finished == 1){
                //check timeUntil
                const battleInfo = await getBattleInfo();
                const reload = battleInfo.timeUntilStart;

                if (reload == 1){
                    await scanBattle();
                } else {
                    logMessage(`waiting 2.5 minutes`);
                    await delay(150000);
                    await checkBattle();
                }
            }
        } else {
            //120 minutes passed, please update all data in local storage
            await scanBattle();
        }

    }

    async function checkBattle() {
        //for check if battle exist or not

        const now = getCurrentUnixTimestamp();
        const timeDiff = (Math.abs(start - now));


        if(now > refresh){
            await delay(4000);
            reloadPage();
        }

        if (now > start) {
            logMessage(`AIR BATTLE DETECTED in ${region}`);
            logMessage(`====================================`);
            logMessage(`Battle ID: ${battleId}`);
            logMessage(`Battle Zone ID: ${battleZoneId}`);
            logMessage(`Round: ${round}`);

            if (battleId != 0 && battleZoneId != 0 && round != 0) {
                //if exist, check zone
                await checkZone(timeDiff);
            } else {
                //if not exist, scan battle list
                await scanBattle();
            }

        } else {
            const wait = start - now + 1;
            logMessage(`WAIT ${wait} seconds`);
            const urlB = `https://www.erepublik.com/en/military/battlefield/${battleId}`;
            const willStart = `[${identity}]\n[${region} ${countryName(enemy)} R${round} starting in ${sToMMSS(wait)}](${urlB})`;
            sendMessage(willStart);
            await delay(wait*1001);
            checkBattle();
        }
    }

    async function scanBattle() {
        //for scan battle from list

        const target = getLocalStorageData('targetCountry');
        const fetchTime = getCurrentUnixTimestamp();
        const fetchlist = await fetchData(`https://www.erepublik.com/en/military/campaignsJson/list?${fetchTime}`);

        const list = Object.values(fetchlist.battles).filter(battle => {
            const targetNumber = Number(target); // Convert target to a number
            const locationNumber = Number(location); // Convert location to a number

            return (
                battle.war_type === "direct" &&
                (
                    (locationNumber === battle.inv.id && targetNumber === battle.def.id) ||
                    (locationNumber === battle.def.id && targetNumber === battle.inv.id)
                )
            );
        });

        if (list.length > 0) {
            const battleTarget = list[0];
            const defP = battleTarget.def.points;
            const invP = battleTarget.inv.points;
            saveToLocalStorage('round', battleTarget.zone_id);
            saveToLocalStorage('battleID', battleTarget.id);
            saveToLocalStorage('start', battleTarget.start);
            saveToLocalStorage('region', battleTarget.region.name);
            saveToLocalStorage('defP', defP);
            saveToLocalStorage('invP', invP);

            let defff;

            if(battleTarget.def.id === location){
                saveToLocalStorage('deffend', 1);
                defff = true;
            } else {
                saveToLocalStorage('deffend', 0);
                defff = false;
            }



            await delay(666);
            const id = battleTarget.id;
            const zoneList = await fetchData(`https://www.erepublik.com/en/military/campaignsJson/citizen?${fetchTime}`);
            if(battleType === 'Ground'){
                saveToLocalStorage('battleZoneId', zoneList.battles[id].groundZoneId);
            } else {
                saveToLocalStorage('battleZoneId', zoneList.battles[id].aircraftZoneId);
            }
            logMessage("DATA UPDATED");
            await delay(2666);
            reloadPage();
        } else {
            logMessage("NO BATTLE FOUND, PLEASE CHANGE TARGET");
            await delay(3000);
            await changeTarget();
            await delay(3000);
            reloadPage();

        }
    }


    // MODAL BOX - - - - - - - - - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -
    async function createModal() {
        // Check if the modal already exists
        if (document.getElementById('myModal')) {
            return; // Exit if modal is already present
        }

        // Initialize toggle button state using getLocalStorageData


        const buttonText = toggleState === '1' ? 'ON' : 'OFF';
        const buttonBattle = battleType === 'Ground' ? 'Ground' : 'Sky';


        // Load corresponding damage values



        // Create modal HTML
        const modalHTML = `
        <div id="myModal" style="display:block; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
            <div style="background-color:white; margin:15% auto; padding:20px; border:1px solid #888; width:900px; max-width:90%; position:relative; display:flex;">
                <div style="flex:1; padding:10px;">
                    <span id="closeModal" style="position:absolute; top:10px; right:10px; cursor:pointer; font-size:20px;">&times;</span>
                    <div style="margin-bottom:10px; display:flex; align-items:center;">
                        <label for="toggleButton" style="font-size:16px; margin-right:10px;">POWER State:</label>
                        <button type="button" id="toggleButton" style="padding:5px 10px; font-size:16px;">${buttonText}</button>
                    </div><br>
                    <div style="margin-bottom:10px; display:flex; align-items:center;">
                    <label for="battleToggle" style="font-size:16px; margin-right:10px;">Battle Type:</label>
                        <button type="button" id="battleToggle" style="padding:5px 10px; font-size:16px;">${buttonBattle}</button>
                        </div><br>
                    <h3>Location: ${locationName}</h3>
                    <form id="dataForm" style="width:200px;">
                        <label for="dmgL">LOW DAMAGE:</label><br>
                        <input type="number" id="dmgL" value="${lowDamage || ''}" style="border:none; border-bottom:1px solid #ccc; outline:none; width:50%; padding:5px; margin-bottom:10px;"><br>
                        <label for="dmgH">HIGH DAMAGE:</label><br>
                        <input type="number" id="dmgH" value="${highDamage || ''}" style="border:none; border-bottom:1px solid #ccc; outline:none; width:50%; padding:5px; margin-bottom:10px;"><br>
                        <label for="weapQ">WEAPON QUALITY:</label><br>
                        <input type="number" id="weapQ" value="${weapQuality}" style="border:none; border-bottom:1px solid #ccc; outline:none; width:20%; padding:5px; margin-bottom:10px;" max="10"><br>

                        <br>

                        <!-- New Dropdown for Target Country with dynamically generated options -->
                    <label for="targetCountry">Target Country:</label><br>
                    <select id="targetCountry">
                        ${generateCountryOptions(countriesData)}
                    </select><br><br>

                        <button type="button" id="saveData">Save</button>
                    </form>
                </div>
                <div id="logArea" style="flex:1; padding:10px; border-left:1px solid #888; overflow-y:auto; max-height:400px; background-color:#f9f9f9;">
                    <!-- Log messages will be added here -->
                </div>
            </div>
        </div>
    `;

        // Append modal to the body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get modal, close elements, and toggle button
        const modal = document.getElementById('myModal');
        const closeModal = document.getElementById('closeModal');
        const saveButton = document.getElementById('saveData');
        const toggleButton = document.getElementById('toggleButton');
        const targetCountry = document.getElementById('targetCountry');
        const battleToggle = document.getElementById('battleToggle');
        const hitButton = document.getElementById('hitButton');

        const dmgLInput = document.getElementById('dmgL');
        const dmgHInput = document.getElementById('dmgH');

        // Show modal
        modal.style.display = 'block';

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

        // Load the saved target country from local storage
        targetCountry.value = getLocalStorageData('targetCountry');

        // Toggle battle type functionality
        battleToggle.onclick = function() {
            const currentType = battleToggle.textContent === 'Ground' ? 'Sky' : 'Ground';
            battleToggle.textContent = currentType;

            // Update local storage with new battle type
            saveToLocalStorage('battleType', currentType);
            logMessage(`Switched to ${currentType} battle type`);
            saveToLocalStorage('round', 0);
            reloadPage();
        };

        // Save button functionality
        saveButton.onclick = function() {
            const currentType = battleToggle.textContent;
            // Save damage values to the respective keys in local storage
            const lowDamageValue = dmgLInput.value;
            const highDamageValue = dmgHInput.value;

            saveToLocalStorage(lowDamageKey, lowDamageValue);
            saveToLocalStorage(highDamageKey, highDamageValue);
            saveToLocalStorage('round', 0);

            logMessage(`Saved ${currentType} Low Damage: ${lowDamageValue}, High Damage: ${highDamageValue}`);
            reloadPage();
        };


        // Toggle button functionality
        toggleButton.onclick = function() {
            const isOn = toggleButton.textContent === 'ON';
            // Check if it's turning from OFF (0) to ON (1)
            const previousState = toggleState;
            const newState = isOn ? '0' : '1';

            // Update button text
            toggleButton.textContent = isOn ? 'OFF' : 'ON';

            // Update local storage immediately
            saveToLocalStorage('toggleState', newState);

            // Call changeTarget() only if turning from OFF to ON
            if (previousState === '0' && newState === '1') {
                changeTarget().then(() => {
                    logMessage(isOn ? 'Toggle switched OFF' : 'Toggle switched ON');
                    saveToLocalStorage('round', 0);
                    reloadPage();
                });
            } else {
                logMessage(isOn ? 'Toggle switched OFF' : 'Toggle switched ON');
                saveToLocalStorage('round', 0);
                reloadPage();
            }
        };

        // Call doSomething() when the modal is created if battleID is not 0
        const isOn = getLocalStorageData('toggleState');
        if (isOn == 1 && energy > minEnergy) {
            await delay(1000);
            // ACTIVATE HERE- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            checkBattle();
        } else if (isOn == 0) {
            logMessage(`BOT is OFF, please turn it ON`);
        } else if (isOn == 1 && energy > 66 && energy < minEnergy){
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


            logMessage(`Energy Low`);
            const noww = getCurrentUnixTimestamp();
            const load = minEnergy - energy;
            const interval = Math.floor(load/energyPerInterval) * 360;
            const next = noww + interval;
            logMessage(`Now:  ${msToHMS(noww)}`);
            logMessage(`Reload at: ${msToHMS(next)}`);
            await delay(interval * 1100);
            await delay(360000);
            await changeTarget();
            reloadPage();
        } else {
            await delay(366000);
            reloadPage();
        }
    }



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
            }
        });

        // Start observing the document for changes
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }




















    //LIST OF FUNCTION - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function checkSessionValidationExists() {
        if (typeof SERVER_DATA !== 'undefined' && SERVER_DATA.sessionValidation !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    function defaultDamage(){

        const mid = (lowDamage + highDamage)/2;
        let damage;


        if (dayAbbreviation == "Tue") {
           damage = mid - (mid * 0.07);
        } else if (dayAbbreviation == "Wed" || dayAbbreviation == "Thu") {
            damage = mid + (mid * 0.06);
        } else if (dayAbbreviation == "Fri" || dayAbbreviation == "Sat") {
            damage = mid + (mid * 0.09);
        } else {
            damage = mid + (mid * 0.11);
        }

        const random1 = getRandomNumber();
        const random2 = getRandomNumber();
        const plus = Math.floor(damage * 0.1);

        if(deffend == 1){
            damage = damage + plus + random1;
        } else {
            damage = lowDamage + plus - random1 - random2;
        }
        return damage;

    }

    function compareDamage(opposite){
        const mid = (lowDamage + highDamage)/2;
        const dhigh = 2 * highDamage;
        const high2 = highDamage + (highDamage * 0.15);
        const mid2 = mid + (mid * 0.05);
        const dom = Math.abs(defP - invP);

        const higher = opposite + (opposite * 0.14);
        const lower = opposite - (opposite * 0.1);
        const limit = 6 * Math.floor((opposite/10));

        const random = getRandomNumber();
        let damage;

        if(deffend == 1){
            if(opposite > lowDamage && opposite < highDamage && dom < 18){
                damage = high2;
            } else if(opposite > mid && opposite < dhigh && dom > 40) {
                damage = mid2;
            } else if(opposite < mid){
                damage = mid2;
            } else {
                damage = higher;
            }

            damage = damage + random;
        } else {
            //lose
            if(opposite > highDamage && opposite < dhigh){
                damage = limit;
            } else if(opposite > mid && opposite < highDamage){
                damage = mid;
            } else if(opposite > lowDamage && opposite < mid){
                damage = lower;
            } else {
                damage = lowDamage;
            }

            damage = damage + random;
        }

        return damage;

    }

    async function skinAndDph() {
        let weapQu = weapQuality;
        const idBattle = getLocalStorageData('battleID');

        if (weapQu == 0){
            weapQu = -1;
        }

        logMessage(`Weapon Quality: ${weapQu}`);

        const payLoad = inventoryPayload(idBattle, location, battleZoneId, _token);
        const inventory = await PostRequest(payLoad, url.getinventory);

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

    // Function to check if country.fighterData is empty and push to new array if empty
    async function checkFighterDataEmpty(responseData, countryLocationId) {
        if (responseData && responseData[countryLocationId] && responseData[countryLocationId]["fighterData"]) {
            const fighterData = responseData[countryLocationId]["fighterData"];
            const isFighterDataEmpty = Object.keys(fighterData).length === 0;
            return isFighterDataEmpty;
        } else {
            console.log(`Could not find ${countryLocationId}.fighterData in the response.`);
            await delay(2000);
            await scanBattle();
            return;
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

    function convert01(value){
        if(value == 1){
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

    function getRandomNumber() {
        return Math.floor(Math.random() * (2040 - 10 + 1)) + 10;
    }

    function getLowRandom() {
        return Math.floor(Math.random() * (220 - 10 + 1)) + 10;
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
            value = 0; // Default value is '0'
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

    function convertToNumber(value) {
        const num = Number(value);

        // Check if the conversion is successful
        if (isNaN(num)) {
            console.error(`Unable to convert "${value}" to a number.`);
            return null; // Or you can choose to return 0, or some other default value
        }

        return num;
    }

    function sToMMSS(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    function msToHMS(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }

    function countryName(inputId) {
    const country = countriesData.find(country => country.id === Number(inputId));
    return country ? `${country.flag} ${country.name}` : "Country not found";
}


    function sendMessage(message) {
        var botToken = '6423448975:AAGmYbAXaC0rTuIDH-2SoNXhjPLdjayX35c';
        var chatId = '776257704';

        var apiUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + encodeURIComponent(message) + '&parse_mode=markdown&disable_web_page_preview=true';

        // Make the HTTP request
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }

    function warn(message) {
        var botToken = '6423448975:AAGmYbAXaC0rTuIDH-2SoNXhjPLdjayX35c';
        var chatId = '-1002307646986';

        var apiUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + encodeURIComponent(message) + '&parse_mode=markdown&disable_web_page_preview=true';

        // Make the HTTP request
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }

    function warnSerb(message) {
        var botToken = '6423448975:AAGmYbAXaC0rTuIDH-2SoNXhjPLdjayX35c';
        var chatId = '-4593876184';

        var apiUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + encodeURIComponent(message) + '&parse_mode=markdown&disable_web_page_preview=true';

        // Make the HTTP request
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }

    // Function to generate country options dynamically
function generateCountryOptions(countriesData) {
    return countriesData.map(country =>
        `<option value="${country.id}">${country.name}</option>`
    ).join('');
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
    }
/*         else {
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
    } */

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

    async function checkAllBattle(data){
        //notify to telegram
        const dateTime = SERVER_DATA.serverTime.dateTime;
        let message = `*Indonesia Training War* \n`;
        var list = [{
            war_id: 201278,
            id: 669931,
            country_id: 35, //Poland
            region: 423, //Mazuria
            region_name: "Mazuria"
        }, {
            war_id: 205930,
            id: 669719,
            country_id: 10, //italy
            region: 272, //Piedmont
            region_name: "Piedmont"
        }, {
            war_id: 218085, //206100
            id: 735298,
            country_id: 68, //Singapore
            region: 648, //Singapore City
            region_name: "Singapore City"
        }, {
            war_id: 206942,
            id: 669321,
            country_id: 48, //India
            region: 459, //North Eastern India
            region_name: "North Eastern India"
        }, {
            war_id: 212945,
            id: 734720,
            country_id: 81, //Taiwan
            region: 462, //Kalimantan
            region_name: "Kalimantan"
        }, {
            war_id: 214928,
            id: 669679,
            country_id: 67, //Philippines
            region: 646, //Mindanao
            region_name: "Mindanao"
        }, {
            war_id: 215249,
            id: 669968,
            country_id: 72, //Lithuania
            region: 664, //Samogitia
            region_name: "Samogitia"
        }, {
            war_id: 215758,
            id: 669680,
            country_id: 166, //UAE
            region: 666, //Dainava
            region_name: "Dainava"
        }, {
            war_id: 215769,
            id: 669681,
            country_id: 24, //USA
            region: 50, //Hawaii
            region_name: "Hawaii"
        }, {
            war_id: 217808,
            id: 734931,
            country_id: 27, //Argentina
            region: 156, //Patagonia
            region_name: "Patagonia"
        }, {
            war_id: 218197,
            id: 735075,
            country_id: 31, //Netherland
            region: 464, //Sulawesi
            region_name: "Sulawesi"
        }, {
            war_id: 218415,
            id: 734992,
            country_id: 30, //Switzerland
            region: 337, //Romandie
            region_name: "Romandie"
        }];

        //start check all data
        const cotd = data.countries["49"].cotd;
        let counter = 0;

        for (let item of list) {
            let country = countryName(item.country_id);
            let result = await isWarIdExist(data, item.war_id);
            let exists = result.exists;
            let battleData = result.battle;

            if (exists) {
                const idBattle = battleData.id;
                let isCotd = ``;
                if (idBattle === cotd){
                    isCotd = ` - COTD`;
                }

                const region = battleData.region.name;
                const defC = countryName(battleData.def.id);
                const defP = battleData.def.points;
                const invC = countryName(battleData.inv.id);
                const invP = battleData.inv.points;
                message += `\n*${region}${isCotd}*\n🛡: ${defC} : ${defP} Points \n🗡: ${invC} : ${invP} Points\n`;
            } else {
                const battleId = item.id;
                const payload = payloadList(battleId, _token);
                const url = `https://www.erepublik.com/en/military/battle-console`
                const list = await PostRequest(payload, url);

                const result = list.list[0].result;
                const outcome = result.outcome;
                const winner = result.winner;

                if (outcome === "defense" && winner === "Indonesia") {
                    const ready = await checkRegionExistence(data, item.region);
                    let rta =  `*not ready to attack [QUEUE]*`;
                    if(ready){
                        rta = `*ready to attack*`;
                    }
                    const endTime = result.end;
                    var times = compareTime(dateTime, endTime);

                    message += `\nAttack *${country}* - auto in ${times}\n [${item.war_id}](https://www.erepublik.com/en/wars/show/${item.war_id}) ${rta} ${item.region_name}\n`;

                } else {
                    message += `\nWaiting attack from *${country}*\n`;

                }
                await delay(3500);
            }
        }
        sendMessage(message);
    }

    // Function to check if a war_id exists in fetchlist.battles
    function isWarIdExist(fetchlist, warId) {
        for (let battleId in fetchlist.battles) {
            if (fetchlist.battles.hasOwnProperty(battleId)) {
                if (fetchlist.battles[battleId].war_id === warId) {
                    return {
                        exists: true,
                        battle: fetchlist.battles[battleId]
                    };
                }
            }
        }
        return {
            exists: false,
            battle: null
        };
    }

    function checkRegionExistence(object, regionId) {
        // Iterate over battles object
        for (const battleId in object.battles) {
            const battle = object.battles[battleId];
            // Check if region id matches
            if (battle.region && battle.region.id === regionId) {
                // If region id exists, return false
                return false;
            }
        }
        // If region id doesn't exist, return true
        return true;
    }

    function compareTime(dateTime, resultEnd) {
        // Convert dateTime and resultEnd to Unix timestamps
        var dateTimeUnix = (new Date(dateTime)).getTime() / 1000;
        var resultEndUnix = (new Date(resultEnd)).getTime() / 1000;

        // If resultEnd is earlier than dateTime, add 24 hours to resultEnd
        if (resultEndUnix < dateTimeUnix) {
            resultEndUnix += 24 * 3600; // 24 hours in seconds
        }

        // Calculate the difference in seconds
        var differenceInSeconds = Math.abs(dateTimeUnix - resultEndUnix);

        // Convert difference to HH:MM:SS format
        var hours = Math.floor(differenceInSeconds / 3600);
        var minutes = Math.floor((differenceInSeconds % 3600) / 60);
        var seconds = Math.floor(differenceInSeconds % 60);

        // Format the difference as HH:MM:SS
        var formattedDifference = hours.toString().padStart(2, '0') + ":" +
            minutes.toString().padStart(2, '0') + ":" +
            seconds.toString().padStart(2, '0');

        return formattedDifference;
    }


    //LIST PAYLOAD
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

    function payloadInfo(battleId, zoneId, battleZoneId, _token) {
        const action = "battleConsole";

        return {
            battleId,
            zoneId,
            action,
            battleZoneId,
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

    function booster(_token) {
        const type = "air_damage";
        const quality = 2;
        const duration = 600;
        const fromInventory = true;

        return {
            type,
            quality,
            duration,
            fromInventory,
            _token
        };
    }

    function shadow(battleId, sideId, battleZoneId, _token) {
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

    function snow(battleId, citizenId, _token) {
        const type = "snowFight";

        return {
            type,
            citizenId,
            battleId,
            _token
        };
    }

    function payloadList(battleId, _token) {
        const action = "warList";
        const Page = 1;


        return {
            battleId,
            action,
            Page,
            _token
        };
    }

    //not use
        async function Serb(battles){
        // Filter battles where def.id == 49 and inv.id == 65
        const matchingBattle = Object.values(battles).find(battle =>
                                                           battle.def.id === 49 && (battle.inv.id === 65 || battle.inv.id === 27) &&
                                                           battle.war_type === "direct"
                                                          );

        // Do something if a matching battle exists
        if (matchingBattle) {
            console.log("Matching battle found:", matchingBattle);
            const inv = matchingBattle.inv.id;
            const def = matchingBattle.def.id;
            const region = matchingBattle.region.name;
            const round = matchingBattle.zone_id;
            const defP = matchingBattle.def.points;
            const invP = matchingBattle.inv.points;
            const linkId = `https://www.erepublik.com/en/military/battlefield/${matchingBattle.id}`;
            const diffP = Math.abs(defP - invP);

            if(defP < invP || diffP < 18){
                let warning = `*Please Watch This Battle*`;
                warning += `\n\n${region} ROUND ${round}`;
                warning += `\n${countryName(def)}: ${defP} points 🛡`;
                warning += `\n${countryName(inv)}: ${invP} points 🗡`;
                warning += `\nBattle ID: [${matchingBattle.id}](https://www.erepublik.com/en/military/battlefield/${matchingBattle.id})`;
                warn(warning);
                await delay(5000);
                warnSerb(warning);
            }
        } else {
            console.log("No matching battle found.");
        }
    }
})();
