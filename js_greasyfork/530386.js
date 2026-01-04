// ==UserScript==
// @name         TornPDA - Gym Gains Calculator
// @namespace    http://tampermonkey.net/
// @version      2.53
// @description  A calculator for Torn's gym training, predicting stat gains, time to reach goals, and booster costs. Features a collapsible UI with bonus settings, energy/happiness boosters, and persistent user inputs.
// @author       Jvmie[2094564]
// @match        https://www.torn.com/gym.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530386/TornPDA%20-%20Gym%20Gains%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/530386/TornPDA%20-%20Gym%20Gains%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Gym data
    const gyms = {
        "[H] Gun Shop": { energy: 10, strength: 6.6, speed: 6.4, defense: 6.2, dexterity: 6.2 },
        "[L] Premier Fitness": { energy: 5, strength: 2, speed: 2, defense: 2, dexterity: 2 },
        "[L] Average Joes": { energy: 5, strength: 2.4, speed: 2.4, defense: 2.8, dexterity: 2.4 },
        "[L] Woody's Workout": { energy: 5, strength: 2.8, speed: 3.2, defense: 3, dexterity: 2.8 },
        "[L] Beach Bods": { energy: 5, strength: 3.2, speed: 3.2, defense: 3.2, dexterity: 0 },
        "[L] Silver Gym": { energy: 5, strength: 3.4, speed: 3.6, defense: 3.4, dexterity: 3.2 },
        "[L] Pour Femme": { energy: 5, strength: 3.4, speed: 3.6, defense: 3.6, dexterity: 3.8 },
        "[L] Davies Den": { energy: 5, strength: 3.7, speed: 0, defense: 3.7, dexterity: 3.7 },
        "[L] Global Gym": { energy: 5, strength: 4, speed: 4, defense: 4, dexterity: 4 },
        "[M] Knuckle Heads": { energy: 10, strength: 4.8, speed: 4.4, defense: 4, dexterity: 4.2 },
        "[M] Pioneer Fitness": { energy: 10, strength: 4.4, speed: 4.6, defense: 4.8, dexterity: 4.4 },
        "[M] Anabolic Anomalies": { energy: 10, strength: 5, speed: 4.6, defense: 5.2, dexterity: 4.6 },
        "[M] Core": { energy: 10, strength: 5, speed: 5.2, defense: 5, dexterity: 5 },
        "[M] Racing Fitness": { energy: 10, strength: 5, speed: 5.4, defense: 4.8, dexterity: 5.2 },
        "[M] Complete Cardio": { energy: 10, strength: 5.5, speed: 5.8, defense: 5.5, dexterity: 5.2 },
        "[M] Legs, Bums and Tums": { energy: 10, strength: 0, speed: 5.6, defense: 5.6, dexterity: 5.8 },
        "[M] Deep Burn": { energy: 10, strength: 6, speed: 6, defense: 6, dexterity: 6 },
        "[H] Apollo Gym": { energy: 10, strength: 6, speed: 6.2, defense: 6.4, dexterity: 6.2 },
        "[H] Force Training": { energy: 10, strength: 6.4, speed: 6.6, defense: 6.4, dexterity: 6.8 },
        "[H] Cha Cha's": { energy: 10, strength: 6.4, speed: 6.4, defense: 6.8, dexterity: 7 },
        "[H] Atlas": { energy: 10, strength: 7, speed: 6.4, defense: 6.4, dexterity: 6.6 },
        "[H] Last Round": { energy: 10, strength: 6.8, speed: 6.6, defense: 7, dexterity: 6.6 },
        "[H] The Edge": { energy: 10, strength: 6.8, speed: 7, defense: 7, dexterity: 6.8 },
        "[H] George's": { energy: 10, strength: 7.3, speed: 7.3, defense: 7.3, dexterity: 7.3 },
        "[S] Balboas Gym": { energy: 25, strength: 0, speed: 0, defense: 7.5, dexterity: 7.5 },
        "[S] Frontline Fitness": { energy: 25, strength: 7.5, speed: 7.5, defense: 0, dexterity: 0 },
        "[S] Gym 3000": { energy: 50, strength: 8, speed: 0, defense: 0, dexterity: 0 },
        "[S] Mr. Isoyamas": { energy: 50, strength: 0, speed: 0, defense: 8, dexterity: 0 },
        "[S] Total Rebound": { energy: 50, strength: 0, speed: 8, defense: 0, dexterity: 0 },
        "[S] Elites": { energy: 50, strength: 0, speed: 0, defense: 0, dexterity: 8 },
        "[S] Sports Science Lab": { energy: 25, strength: 9, speed: 9, defense: 9, dexterity: 9 },
        "The Jail Gym": { energy: 5, strength: 3.4, speed: 3.4, defense: 4.6, dexterity: 0 }
    };

    const stats = ["Strength", "Speed", "Defense", "Dexterity"];
    const bonusPercentages = Array.from({ length: 101 }, (_, i) => i); // 0 to 100

    // CSS for the embedded collapsible menu
    const styles = `
        .grok-menu {
            margin: 10px 0;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 10px;
            font-family: "Arial", sans-serif;
            color: #ccc;
        }
        .grok-menu h3 {
            margin: 0;
            padding: 10px;
            background: linear-gradient(to bottom, #333, #222);
            cursor: pointer;
            border-radius: 3px;
            font-size: 16px;
            font-weight: bold;
            color: #ddd;
            border: 1px solid #555;
            transition: background 0.2s ease;
        }
        .grok-menu h3:hover {
            background: linear-gradient(to bottom, #444, #333);
        }
        .grok-content {
            display: none;
            padding: 10px;
        }
        .grok-content.show {
            display: block;
        }
        .grok-menu label {
            display: block;
            margin: 8px 0;
            font-size: 14px;
            color: #ddd;
        }
        .grok-menu input, .grok-menu select {
            width: 100%;
            padding: 5px;
            margin-top: 2px;
            border: 1px solid #444;
            border-radius: 3px;
            background: #333;
            color: #fff;
            box-sizing: border-box;
            font-size: 14px;
        }
        .grok-menu input:focus, .grok-menu select:focus {
            outline: none;
            border-color: #666;
        }
        .grok-menu .result {
            margin-top: 10px;
            padding: 8px;
            border-radius: 3px;
            font-size: 14px;
        }
        .grok-menu .result.red {
            background: #3a1c1c;
            color: #ff6666;
        }
        .grok-menu .result.grey {
            background: #2a2a2a;
            color: #bbb;
        }
        .grok-menu .button-container {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }
        .grok-menu button {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 3px;
            padding: 5px 10px;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s ease;
        }
        .grok-menu button:hover {
            background: #3a3a3a;
        }
        .bonus-menu {
            margin: 10px 0;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 3px;
        }
        .bonus-menu h4 {
            margin: 0;
            padding: 8px;
            background: linear-gradient(to bottom, #333, #222);
            cursor: pointer;
            border-radius: 3px;
            font-size: 14px;
            font-weight: bold;
            color: #ddd;
            border: 1px solid #555;
            transition: background 0.2s ease;
        }
        .bonus-menu h4:hover {
            background: linear-gradient(to bottom, #444, #333);
        }
        .bonus-content {
            display: none;
            padding: 8px;
        }
        .bonus-content.show {
            display: block;
        }
        .changelog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .changelog-box {
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 20px;
            max-width: 400px;
            color: #ccc;
            font-family: "Arial", sans-serif;
        }
        .changelog-box h4 {
            margin: 0 0 10px;
            color: #fff;
        }
        .changelog-box ul {
            margin: 0 0 20px;
            padding-left: 20px;
        }
        .changelog-box button {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 3px;
            padding: 5px 10px;
            color: #fff;
            cursor: pointer;
        }
        .changelog-box button:hover {
            background: #3a3a3a;
        }
    `;

    // Add styles to the page
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Find the main content area
    const contentWrapper = document.querySelector('.content-wrapper') || document.body;
    if (!contentWrapper) {
        console.error("Could not find content wrapper to embed calculator.");
        return;
    }

    // Load saved values
    const savedGym = GM_getValue("gym", "[H] Gun Shop");
    const savedStat = GM_getValue("stat", "strength");
    const savedEnergyBooster = GM_getValue("energyBooster", "none");
    const savedBoosterCount = GM_getValue("boosterCount", "0");
    const savedHappy = GM_getValue("happy", "4525");
    const savedStatTotal = GM_getValue("statTotal", "234522");
    const savedStatGoal = GM_getValue("statGoal", "300000");
    const savedEnergy = GM_getValue("energy", "10");
    const savedFactionPerk = GM_getValue("factionPerk", "0");
    const savedPropertyPerk = GM_getValue("propertyPerk", "0");
    const savedEduStatPerk = GM_getValue("eduStatPerk", "0");
    const savedEduGenPerk = GM_getValue("eduGenPerk", "0");
    const savedJobPerk = GM_getValue("jobPerk", "0");
    const savedBookPerk = GM_getValue("bookPerk", "0");
    const savedSportsSneakers = GM_getValue("sportsSneakers", "0");
    const savedSteroids = GM_getValue("steroids", "0");
    const savedEcstasy = GM_getValue("ecstasy", "no");
    const savedEroticDVDs = GM_getValue("eroticDVDs", "0");

    // Create the menu HTML with saved values
    const menu = document.createElement("div");
    menu.className = "grok-menu";
    menu.innerHTML = `
        <h3>TornPDA - Gym Gains Calculator</h3>
        <div class="grok-content">
            <label>Gym:
                <select id="gymSelect"></select>
            </label>
            <label>Stat to Train:
                <select id="statSelect">
                    ${stats.map(stat => `<option value="${stat.toLowerCase()}">${stat}</option>`).join('')}
                </select>
            </label>
            <label>Energy Booster:
                <select id="energyBooster">
                    <option value="none">None</option>
                    <option value="xanax">Xanax (+250 Energy, $880,000, 7 hr cooldown)</option>
                    <option value="energyCan">Energy Can (+20 Energy, $1,166,667, 30 min cooldown)</option>
                    <option value="fhc">Feathery Hotel Coupon (150 Energy, $12,500,000, 24 hr cooldown)</option>
                    <option value="refill">Energy Refill (150 Energy, $1,725,000, No cooldown)</option>
                </select>
            </label>
            <label>Number of Energy Boosters per Day:
                <input type="number" id="boosterCount" value="${savedBoosterCount}" min="0">
            </label>
            <label>Starting Happy: <input type="number" id="happy" value="${savedHappy}" min="0"></label>
            <label>Current Stat Total: <input type="number" id="statTotal" value="${savedStatTotal}" min="0"></label>
            <label>Desired Stat Goal: <input type="number" id="statGoal" value="${savedStatGoal}" min="0"></label>
            <label>Total Energy to Spend (Initial): <input type="number" id="energy" value="${savedEnergy}" min="0"></label>
            <div class="bonus-menu">
                <h4>Bonuses & Boosters</h4>
                <div class="bonus-content">
                    <label>Faction Steadfast (%):
                        <select id="factionPerk">
                            ${bonusPercentages.map(val => `<option value="${val}">${val}%</option>`).join('')}
                        </select>
                    </label>
                    <label>Property Perks (%):
                        <select id="propertyPerk">
                            ${bonusPercentages.map(val => `<option value="${val}">${val}%</option>`).join('')}
                        </select>
                    </label>
                    <label>Education (Stat Specific) (%):
                        <select id="eduStatPerk">
                            ${bonusPercentages.map(val => `<option value="${val}">${val}%</option>`).join('')}
                        </select>
                    </label>
                    <label>Education (General) (%):
                        <select id="eduGeneralPerk">
                            ${bonusPercentages.map(val => `<option value="${val}">${val}%</option>`).join('')}
                        </select>
                    </label>
                    <label>Job Perks (%):
                        <select id="jobPerk">
                            ${bonusPercentages.map(val => `<option value="${val}">${val}%</option>`).join('')}
                        </select>
                    </label>
                    <label>Book Perks (%):
                        <select id="bookPerk">
                            ${bonusPercentages.map(val => `<option value="${val}">${val}%</option>`).join('')}
                        </select>
                    </label>
                    <label>Sports Sneakers (Speed Only, %):
                        <select id="sportsSneakers">
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                        </select>
                    </label>
                    <label>Steroids Booster (%):
                        <select id="steroids">
                            <option value="0">0%</option>
                            <option value="20">20%</option>
                        </select>
                    </label>
                    <label>Ecstasy (Doubles Happiness):
                        <select id="ecstasy">
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </label>
                    <label>Erotic DVDs (Happiness Boost):
                        <select id="eroticDVDs">
                            <option value="0">0</option>
                            <option value="1">1 (+2500 Happy)</option>
                            <option value="2">2 (+5000 Happy)</option>
                            <option value="3">3 (+7500 Happy)</option>
                            <option value="4">4 (+10000 Happy)</option>
                        </select>
                    </label>
                </div>
            </div>
            <div class="button-container">
                <button id="calculateButton">Calculate</button>
                <button id="copyButton" style="display: none;">Copy Results</button>
            </div>
            <div class="result grey">Energy Per Train: <span id="energyPerTrain">-</span></div>
            <div class="result grey">Number of Trains: <span id="numTrains">-</span></div>
            <div class="result grey">Bonus Multiplier: <span id="bonusMultiplier">-</span></div>
            <div class="result red">Predicted Gains (Single Train): <span id="singleGain">-</span></div>
            <div class="result red">Predicted Gains (Total Initial): <span id="totalGain">-</span></div>
            <div class="result red">Allowable Error (+/-): <span id="errorMargin">-</span></div>
            <div class="result grey">Total Energy Per Day: <span id="dailyEnergy">-</span></div>
            <div class="result grey">Total Cost of Boosters: <span id="boosterCost">-</span></div>
            <div class="result grey">Days to Reach Goal: <span id="daysToGoal">-</span></div>
            <div class="result grey">Total Booster Cost to Goal: <span id="totalBoosterCost">-</span></div>
        </div>
    `;

    // Populate gym dropdown and set saved value
    const gymSelect = menu.querySelector("#gymSelect");
    Object.keys(gyms).forEach(gym => {
        const option = document.createElement("option");
        option.value = gym;
        option.textContent = gym;
        gymSelect.appendChild(option);
    });
    gymSelect.value = savedGym;

    // Set saved values for other inputs
    const statSelect = menu.querySelector("#statSelect");
    statSelect.value = savedStat;

    const energyBoosterSelect = menu.querySelector("#energyBooster");
    energyBoosterSelect.value = savedEnergyBooster;

    const factionPerkSelect = menu.querySelector("#factionPerk");
    factionPerkSelect.value = savedFactionPerk;

    const propertyPerkSelect = menu.querySelector("#propertyPerk");
    propertyPerkSelect.value = savedPropertyPerk;

    const eduStatPerkSelect = menu.querySelector("#eduStatPerk");
    eduStatPerkSelect.value = savedEduStatPerk;

    const eduGenPerkSelect = menu.querySelector("#eduGeneralPerk");
    eduGenPerkSelect.value = savedEduGenPerk;

    const jobPerkSelect = menu.querySelector("#jobPerk");
    jobPerkSelect.value = savedJobPerk;

    const bookPerkSelect = menu.querySelector("#bookPerk");
    bookPerkSelect.value = savedBookPerk;

    const sportsSneakersSelect = menu.querySelector("#sportsSneakers");
    sportsSneakersSelect.value = savedSportsSneakers;

    const steroidsSelect = menu.querySelector("#steroids");
    steroidsSelect.value = savedSteroids;

    const ecstasySelect = menu.querySelector("#ecstasy");
    ecstasySelect.value = savedEcstasy;

    const eroticDVDsSelect = menu.querySelector("#eroticDVDs");
    eroticDVDsSelect.value = savedEroticDVDs;

    // Insert the menu
    contentWrapper.insertBefore(menu, contentWrapper.firstChild);

    // Toggle main menu visibility
    const header = menu.querySelector("h3");
    const content = menu.querySelector(".grok-content");
    header.addEventListener("click", () => {
        content.classList.toggle("show");
    });

    // Toggle bonus menu visibility
    const bonusHeader = menu.querySelector(".bonus-menu h4");
    const bonusContent = menu.querySelector(".bonus-content");
    bonusHeader.addEventListener("click", () => {
        bonusContent.classList.toggle("show");
    });

    // Save input values on change
    gymSelect.addEventListener("change", () => GM_setValue("gym", gymSelect.value));
    statSelect.addEventListener("change", () => GM_setValue("stat", statSelect.value));
    energyBoosterSelect.addEventListener("change", () => GM_setValue("energyBooster", energyBoosterSelect.value));
    factionPerkSelect.addEventListener("change", () => GM_setValue("factionPerk", factionPerkSelect.value));
    propertyPerkSelect.addEventListener("change", () => GM_setValue("propertyPerk", propertyPerkSelect.value));
    eduStatPerkSelect.addEventListener("change", () => GM_setValue("eduStatPerk", eduStatPerkSelect.value));
    eduGenPerkSelect.addEventListener("change", () => GM_setValue("eduGeneralPerk", eduGenPerkSelect.value));
    jobPerkSelect.addEventListener("change", () => GM_setValue("jobPerk", jobPerkSelect.value));
    bookPerkSelect.addEventListener("change", () => GM_setValue("bookPerk", bookPerkSelect.value));
    sportsSneakersSelect.addEventListener("change", () => GM_setValue("sportsSneakers", sportsSneakersSelect.value));
    steroidsSelect.addEventListener("change", () => GM_setValue("steroids", steroidsSelect.value));
    ecstasySelect.addEventListener("change", () => GM_setValue("ecstasy", ecstasySelect.value));
    eroticDVDsSelect.addEventListener("change", () => GM_setValue("eroticDVDs", eroticDVDsSelect.value));

    const boosterCountInput = menu.querySelector("#boosterCount");
    boosterCountInput.addEventListener("change", () => GM_setValue("boosterCount", boosterCountInput.value));

    const happyInput = menu.querySelector("#happy");
    happyInput.addEventListener("change", () => GM_setValue("happy", happyInput.value));

    const statTotalInput = menu.querySelector("#statTotal");
    statTotalInput.addEventListener("change", () => GM_setValue("statTotal", statTotalInput.value));

    const statGoalInput = menu.querySelector("#statGoal");
    statGoalInput.addEventListener("change", () => GM_setValue("statGoal", statGoalInput.value));

    const energyInput = menu.querySelector("#energy");
    energyInput.addEventListener("change", () => GM_setValue("energy", energyInput.value));

    // Calculation function with error handling
    function calculateGains() {
        try {
            const gym = gymSelect.value;
            const stat = statSelect.value;
            const gymData = gyms[gym];
            if (!gymData) throw new Error("Invalid gym selected");

            const energyPerTrain = gymData.energy;
            const gymDots = gymData[stat];
            if (!gymDots) throw new Error("Invalid stat for this gym");

            let happy = parseFloat(document.getElementById("happy").value) || 0;
            let statTotal = parseFloat(document.getElementById("statTotal").value) || 0;
            const statGoal = parseFloat(document.getElementById("statGoal").value) || statTotal;
            const totalEnergy = parseFloat(document.getElementById("energy").value) || 0;

            // Perks
            const factionPerk = (parseFloat(document.getElementById("factionPerk").value) || 0) / 100;
            const propertyPerk = (parseFloat(document.getElementById("propertyPerk").value) || 0) / 100;
            const eduStatPerk = (parseFloat(document.getElementById("eduStatPerk").value) || 0) / 100;
            const eduGenPerk = (parseFloat(document.getElementById("eduGeneralPerk").value) || 0) / 100;
            const jobPerk = (parseFloat(document.getElementById("jobPerk").value) || 0) / 100;
            const bookPerk = (parseFloat(document.getElementById("bookPerk").value) || 0) / 100;
            const sportsSneakers = (parseFloat(document.getElementById("sportsSneakers").value) || 0) / 100;
            const steroids = (parseFloat(document.getElementById("steroids").value) || 0) / 100;
            const ecstasy = document.getElementById("ecstasy").value;
            const eroticDVDs = parseInt(document.getElementById("eroticDVDs").value) || 0;
            const energyBooster = document.getElementById("energyBooster").value;
            let boosterCount = parseInt(document.getElementById("boosterCount").value) || 0;

            // Apply happiness boosters
            if (ecstasy === "yes") {
                happy *= 2;
            }
            happy += eroticDVDs * 2500;

            // Bonus multiplier
            let bonusMultiplier = (1 + factionPerk) * (1 + propertyPerk) * (1 + eduStatPerk) *
                                 (1 + eduGenPerk) * (1 + jobPerk) * (1 + bookPerk) * (1 + steroids);
            if (stat === "speed") {
                bonusMultiplier *= (1 + sportsSneakers);
            }

            // Number of trains (initial)
            const numTrains = Math.floor(totalEnergy / energyPerTrain);

            // Calculate single train gain
            const initialCoreComponent = (0.00019106 * statTotal) + (0.00226263 * happy) + 0.55;
            const initialBaseGain = (gymDots * 4) * initialCoreComponent;
            const singleGain = (initialBaseGain * bonusMultiplier / 147.24) * energyPerTrain;

            // Iterative calculation for initial energy
            let totalGain = 0;
            let currentStat = statTotal;
            let currentHappy = happy;
            for (let i = 0; i < numTrains; i++) {
                const coreComponent = (0.00019106 * currentStat) + (0.00226263 * currentHappy) + 0.55;
                const baseGain = (gymDots * 4) * coreComponent;
                const trainGain = (baseGain * bonusMultiplier / 147.24) * energyPerTrain;
                totalGain += trainGain;
                currentStat += trainGain;
                currentHappy = Math.max(0, currentHappy - (energyPerTrain * 0.5));
            }

            // Allowable error
            const errorMarginSingle = singleGain * 0.00233;
            const errorMarginTotal = totalGain * 0.00419;

            // Calculate daily energy with boosters
            let dailyEnergy = 480; // Natural energy (20 per hour * 24 hours)
            let boosterEnergy = 0;
            let boosterCostPerDay = 0;
            let cooldownHours = 0;
            let maxBoostersPerDay = 0;

            if (energyBooster === "xanax") {
                boosterEnergy = 250;
                boosterCostPerDay = boosterCount * 880000;
                cooldownHours = 7;
                maxBoostersPerDay = Math.floor(24 / cooldownHours); // 3 Xanax per day
            } else if (energyBooster === "energyCan") {
                boosterEnergy = 20;
                boosterCostPerDay = boosterCount * 1166667;
                cooldownHours = 0.5; // 30 minutes
                maxBoostersPerDay = 48; // Max 48 cans in 24 hours
            } else if (energyBooster === "fhc") {
                boosterEnergy = 150;
                boosterCostPerDay = boosterCount * 12500000;
                cooldownHours = 24;
                maxBoostersPerDay = 1; // 1 FHC per day
            } else if (energyBooster === "refill") {
                boosterEnergy = 150;
                boosterCostPerDay = boosterCount * 1725000;
                cooldownHours = 0; // No cooldown
                maxBoostersPerDay = 999; // Arbitrary high limit
            }

            boosterCount = Math.min(boosterCount, maxBoostersPerDay);
            dailyEnergy += boosterCount * boosterEnergy;

            // Add happiness booster costs
            if (ecstasy === "yes") {
                boosterCostPerDay += 100000; // 1 Ecstasy per day
            }
            boosterCostPerDay += eroticDVDs * 2500000; // Cost of Erotic DVDs
            if (steroids > 0) {
                boosterCostPerDay += 1000000; // 1 Steroids per day
            }

            // Calculate daily gains
            const dailyTrains = Math.floor(dailyEnergy / energyPerTrain);
            let dailyGain = 0;
            currentStat = statTotal + totalGain; // Start from after initial train
            currentHappy = happy; // Reset daily with Ecstasy
            for (let i = 0; i < dailyTrains; i++) {
                const coreComponent = (0.00019106 * currentStat) + (0.00226263 * currentHappy) + 0.55;
                const baseGain = (gymDots * 4) * coreComponent;
                const trainGain = (baseGain * bonusMultiplier / 147.24) * energyPerTrain;
                dailyGain += trainGain;
                currentStat += trainGain;
                currentHappy = Math.max(0, currentHappy - (energyPerTrain * 0.5));
            }

            // Calculate days to reach goal
            let daysToGoal = 0;
            let totalBoosterCost = 0;
            const maxIterations = 10000; // Prevent infinite loops
            let iterationCount = 0;

            while (currentStat < statGoal && iterationCount < maxIterations) {
                currentStat += dailyGain;
                daysToGoal++;
                totalBoosterCost += boosterCostPerDay;
                iterationCount++;
            }

            // Update display
            document.getElementById("energyPerTrain").textContent = energyPerTrain;
            document.getElementById("numTrains").textContent = numTrains;
            document.getElementById("bonusMultiplier").textContent = bonusMultiplier.toFixed(4);
            document.getElementById("singleGain").textContent = `${singleGain.toFixed(2)} (Min: ${(singleGain - errorMarginSingle).toFixed(2)}, Max: ${(singleGain + errorMarginSingle).toFixed(2)})`;
            document.getElementById("totalGain").textContent = `${totalGain.toFixed(2)} (Min: ${(totalGain - errorMarginTotal).toFixed(2)}, Max: ${(totalGain + errorMarginTotal).toFixed(2)})`;
            document.getElementById("errorMargin").textContent = `Single: ±${errorMarginSingle.toFixed(2)}, Total: ±${errorMarginTotal.toFixed(2)}`;
            document.getElementById("dailyEnergy").textContent = dailyEnergy;
            document.getElementById("boosterCost").textContent = `$${boosterCostPerDay.toLocaleString()}`;
            document.getElementById("daysToGoal").textContent = iterationCount >= maxIterations ? "Goal unreachable" : daysToGoal;
            document.getElementById("totalBoosterCost").textContent = iterationCount >= maxIterations ? "N/A" : `$${totalBoosterCost.toLocaleString()}`;

            // Show copy button
            document.getElementById("copyButton").style.display = "inline-block";
        } catch (error) {
            console.error("Calculation error:", error);
            alert("An error occurred during calculation: " + error.message);
            // Display default values to ensure output shows
            document.getElementById("energyPerTrain").textContent = "-";
            document.getElementById("numTrains").textContent = "-";
            document.getElementById("bonusMultiplier").textContent = "-";
            document.getElementById("singleGain").textContent = "-";
            document.getElementById("totalGain").textContent = "-";
            document.getElementById("errorMargin").textContent = "-";
            document.getElementById("dailyEnergy").textContent = "-";
            document.getElementById("boosterCost").textContent = "-";
            document.getElementById("daysToGoal").textContent = "-";
            document.getElementById("totalBoosterCost").textContent = "-";
        }
    }

    // Copy results to clipboard
    function copyResults() {
        try {
            const singleGain = document.getElementById("singleGain").textContent;
            const totalGain = document.getElementById("totalGain").textContent;
            const errorMargin = document.getElementById("errorMargin").textContent;
            const dailyEnergy = document.getElementById("dailyEnergy").textContent;
            const boosterCost = document.getElementById("boosterCost").textContent;
            const daysToGoal = document.getElementById("daysToGoal").textContent;
            const totalBoosterCost = document.getElementById("totalBoosterCost").textContent;

            const textToCopy = `Predicted Gains (Single Train): ${singleGain}\n` +
                               `Predicted Gains (Total Initial): ${totalGain}\n` +
                               `Allowable Error (+/-): ${errorMargin}\n` +
                               `Total Energy Per Day: ${dailyEnergy}\n` +
                               `Daily Booster Cost: ${boosterCost}\n` +
                               `Days to Reach Goal: ${daysToGoal}\n` +
                               `Total Booster Cost to Goal: ${totalBoosterCost}`;

            navigator.clipboard.writeText(textToCopy).then(() => {
                alert("Results copied to clipboard!");
            }).catch(err => {
                console.error("Failed to copy: ", err);
                alert("Failed to copy results. Please copy manually.");
            });
        } catch (error) {
            console.error("Copy error:", error);
            alert("An error occurred while copying results: " + error.message);
        }
    }

    // Add event listeners
    const calculateButton = menu.querySelector("#calculateButton");
    calculateButton.addEventListener("click", calculateGains);

    const copyButton = menu.querySelector("#copyButton");
    copyButton.addEventListener("click", copyResults);

    // Changelog Pop-up Logic
    const currentVersion = "2.53";
    const lastSeenVersion = GM_getValue("lastSeenVersion", "0.0");

    if (lastSeenVersion !== currentVersion) {
        const changelogOverlay = document.createElement("div");
        changelogOverlay.className = "changelog-overlay";
        changelogOverlay.innerHTML = `
            <div class="changelog-box">
                <h4>TornPDA - Gym Gains Calculator v${currentVersion}</h4>
                <ul>
                    <li>Added persistence for user entries on page close/refresh using GM_setValue/GM_getValue.</li>
                    <li>Previous: Improved styling of dropdown headers to match Torn's theme.</li>
                    <li>Previous: Moved Bonuses & Boosters menu to the bottom of the main UI.</li>
                    <li>Previous: Fixed TypeError by changing const to let for boosterCount.</li>
                    <li>Previous: Ensured bonuses are in a nested collapsible menu.</li>
                    <li>Previous: Added error handling to ensure output displays.</li>
                    <li>Previous: Added energy and happiness booster dropdowns.</li>
                    <li>Previous: Added desired stat goal input.</li>
                    <li>Previous: Calculated total time to goal with cooldowns.</li>
                    <li>Previous: Added booster cost calculations.</li>
                </ul>
                <button id="closeChangelog">Close</button>
            </div>
        `;
        document.body.appendChild(changelogOverlay);

        const closeButton = changelogOverlay.querySelector("#closeChangelog");
        closeButton.addEventListener("click", () => {
            GM_setValue("lastSeenVersion", currentVersion);
            changelogOverlay.remove();
        });
    }
})();