// ==UserScript==
// @name         EquiMissioner
// @namespace    https://github.com/Equihub/EquiMissioner
// @version      1.7
// @description  Best OpenSource Hero Zero Utility Userscript
// @author       LilyPrism @ Equihub
// @license      AGPL3.0
// @match        https://*.herozerogame.com
// @icon         https://github.com/Equihub/EquiMissioner/blob/main/equimissioner.jpg?raw=true
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js
// @resource     BS5_CSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513183/EquiMissioner.user.js
// @updateURL https://update.greasyfork.org/scripts/513183/EquiMissioner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Enum for mission focus types.
     */
    const MISSION_FOCUS = Object.freeze({
        XP: 'XP',
        COINS: 'COINS',
        COMBAT: 'COMBAT',
        TIME: 'TIME',
        MIN_ENERGY: 'MIN_ENERGY',
        HC: 'HC',
        HEROBOOK_ITEM: 'HEROBOOK_ITEM',
        EVENT_ITEM: 'EVENT_ITEM',
        SLOTMACHINE: 'SLOTMACHINE'
    });

    /**
     * Mapping of quest stages to their names.
     */
    const QUEST_STAGES = Object.freeze({
        '1': "At Home in Humphreydale",
        '2': "Dirty Downtown",
        '3': "Center of Granbury",
        '4': "State Capitol",
        '5': "Switzerland",
        '6': "The Big Crumble",
        '7': "Yoyo Island",
        '8': "Gamble City",
        '9': "Sillycon Valley",
        '10': "Paris",
        '11': "Yollywood",
        '12': "Australia",
        '13': "Yokio",
        '14': "The Golden Desert"
    });

    /**
     * Main class for the EquiMissioner script.
     */
    class EquiMissioner {
        constructor() {
            this.currentQuests = [];
            this.currentMissionFocus = GM_getValue("mission-focus", MISSION_FOCUS.XP);
            this.currentFPS = GM_getValue("fps", 30);
            this.maxEnergyPerQuest = GM_getValue("max-energy-quest", 20);
            this.autoStartQuest = GM_getValue("auto-start-quest", false);
            this.autoClaimQuest = GM_getValue("quest-auto-claim", false);
            this.autoNextQuest = GM_getValue("quest-auto-next", false);
            this.autoRedeemVoucherLater = GM_getValue("auto-redeem-voucher-later", false);
            this.autoDismissLevelUp = GM_getValue("auto-dismiss-level-up", false);
            this.autoDismissPetLevelUp = GM_getValue("auto-dismiss-pet-level-up", false);
            this.questSenseBoosterActive = GM_getValue("sense-booster", false);
            this.trainSenseBoosterActive = GM_getValue("train-sense-booster", false);

            this.init();
        }

        /**
         * Initializes the script by applying styles, creating UI, and setting up event listeners.
         */
        init() {
            this.applyStyles();
            this.setupRequestProxy();

            // Event listeners
            document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded.bind(this));
            window.addEventListener("load", this.onWindowLoad.bind(this));
        }

        /**
         * Applies the external Bootstrap CSS styles to the document.
         */
        applyStyles() {
            const bs5Css = GM_getResourceText("BS5_CSS");
            GM_addStyle(bs5Css);
        }

        /**
         * Creates and inserts the user interface elements into the document.
         */
        createUI() {
            // Create the main container div
            const mainDiv = document.createElement('div');
            mainDiv.id = "missioner";
            mainDiv.className = "fixed-top";
            mainDiv.innerHTML = `
                <div style="z-index: 1050">
                    <button class="btn btn-secondary position-absolute d-flex align-items-center" style="z-index: 1050;" type="button" data-bs-toggle="collapse" data-bs-target="#missioner-cont" aria-expanded="false" aria-controls="missioner-cont">
                        <img src="https://github.com/Equihub/EquiMissioner/blob/main/equimissioner.jpg?raw=true" alt="M" style="width: 32px;">
                        <p class="mx-2 my-0">EquiMissioner</p>
                    </button>
                    <div class="position-absolute top-0" style="height: 100vh;background: #262626cc;overflow-y: auto">
                        <div class="collapse collapse-horizontal" id="missioner-cont">
                            <div class="pt-5 px-3" style="width: 300px;">
                                <div class="card text-bg-dark mb-2">
                                    <div class="card-body">
                                        <h5 class="card-title">Best Mission</h5>
                                        <p id="m-city" class="mb-0 card-text text-center">City</p>
                                        <p class="mb-0 card-text"><img src="https://hz-static-2.akamaized.net/assets/emoticons_big/xp.png" alt="XP" style="width: 24px"> <span id="m-xp"></span></p>
                                        <p class="mb-0 card-text"><img src="https://hz-static-2.akamaized.net/assets/emoticons_big/coin.png" alt="Coins" style="width: 24px"> <span id="m-coins"></p>
                                        <p class="mb-0 card-text"><img src="https://hz-static-2.akamaized.net/assets/emoticons_big/energy.png" alt="Coins" style="width: 24px"> <span id="m-cost"></p>
                                        <p class="mb-2 card-text">Duration: <span id="m-duration"></p>
                                        <label class="form-label">Max Energy:</label>
                                        <input type="number" class="form-control mb-2" id="max-energy-quest" min="1" max="50" value="${this.maxEnergyPerQuest}">
                                        <label class="form-label">Quest Focus:</label>
                                        <select class="form-select mb-2" id="quest-focus">
                                            <option value="XP">XP / Energy</option>
                                            <option value="COINS">Coins / Energy</option>
                                            <option value="COMBAT">Fighting Quests</option>
                                            <option value="TIME">Time Quests</option>
                                            <option value="MIN_ENERGY">Minimum Energy</option>
                                            <option value="HC">HeroCon Items</option>
                                            <option value="HEROBOOK_ITEM">Herobook Items</option>
                                            <option value="EVENT_ITEM">Event Items</option>
                                            <option value="SLOTMACHINE">Slotmachine Jetons</option>
                                        </select>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="quest-auto-start">
                                            <label class="form-check-label" for="quest-auto-start">Start Quest on Go</label>
                                        </div>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="quest-auto-claim">
                                            <label class="form-check-label" for="quest-auto-claim">Auto Claim Quest Rewards</label>
                                        </div>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="quest-auto-next">
                                            <label class="form-check-label" for="quest-auto-next">Start Next After Claim</label>
                                        </div>
                                        <button id="mission-go" class="btn btn-success w-100" style="padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x)!important;" type="button">Go</button>
                                    </div>
                                </div>
                                <div class="card text-bg-dark mb-2">
                                    <div class="card-body">
                                        <h5 class="card-title">FPS Unlock</h5>
                                        <label for="fps-input" class="form-label" id="fps-input-label">Current FPS: ${this.currentFPS}</label>
                                        <input type="range" class="form-range" min="30" max="160" step="10" id="fps-input" value="${this.currentFPS}">
                                    </div>
                                </div>
                                <div class="card text-bg-dark mb-2">
                                    <div class="card-body">
                                        <h5 class="card-title">Exploits</h5>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="quest-sense-booster">
                                            <label class="form-check-label" for="quest-sense-booster">Quest Sense Booster</label>
                                        </div>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="train-sense-booster">
                                            <label class="form-check-label" for="train-sense-booster">Train Sense Booster</label>
                                        </div>
                                        <button id="buy-energy" class="btn btn-primary w-100" style="padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x)!important;" type="button">Buy Energy</button>
                                    </div>
                                </div>
                                <div class="card text-bg-dark mb-2">
                                    <div class="card-body">
                                        <h5 class="card-title">Vouchers</h5>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="auto-redeem-voucher-later">
                                            <label class="form-check-label" for="auto-redeem-voucher-later">Auto Redeem-Later</label>
                                        </div>
                                        </div>
                                </div>
                                <div class="card text-bg-dark mb-2">
                                    <div class="card-body">
                                        <h5 class="card-title">Level Up</h5>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="auto-dismiss-level-up">
                                            <label class="form-check-label" for="auto-dismiss-level-up">Auto Dismiss Popup</label>
                                        </div>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="auto-dismiss-pet-level-up">
                                            <label class="form-check-label" for="auto-dismiss-pet-level-up">Auto Dismiss Pet Popup</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center mb-2">
                                    <a href="https://discord.gg/ZEXdQreFxF" target="_blank" class="p-2 bg-dark rounded">
                                        <img src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord" style="width: 32px">
                                    </a>
                                </div>
                                <div class="d-flex justify-content-center mb-2">
                                    <p>Made with ♥ by LilyPrism</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(mainDiv);
            this.initializeUIElements();
        }

        /**
         * Initializes UI elements and sets up event listeners.
         */
        initializeUIElements() {
            // Get references to UI elements
            const questFocusSelect = document.getElementById('quest-focus');
            const questSenseBoosterCheckbox = document.getElementById('quest-sense-booster');
            const trainSenseBoosterCheckbox = document.getElementById('train-sense-booster');
            const questAutoStartCheckbox = document.getElementById('quest-auto-start');
            const questAutoClaimCheckbox = document.getElementById('quest-auto-claim');
            const questAutoNextCheckbox = document.getElementById('quest-auto-next');
            const voucherAutoRedeemLaterCheckbox = document.getElementById('auto-redeem-voucher-later');
            const autoDismissLevelUpCheckbox = document.getElementById('auto-dismiss-level-up');
            const autoDismissPetLevelUpCheckbox = document.getElementById('auto-dismiss-pet-level-up');
            const fpsInput = document.getElementById('fps-input');
            const missionGoButton = document.getElementById('mission-go');
            const buyEnergyButton = document.getElementById('buy-energy');
            const maxEnergyQuestInput = document.getElementById('max-energy-quest');

            // Set initial values
            questFocusSelect.value = this.currentMissionFocus;
            questSenseBoosterCheckbox.checked = this.questSenseBoosterActive;
            trainSenseBoosterCheckbox.checked = this.trainSenseBoosterActive;
            questAutoStartCheckbox.checked = this.autoStartQuest;
            questAutoClaimCheckbox.checked = this.autoClaimQuest;
            questAutoNextCheckbox.checked = this.autoNextQuest;
            voucherAutoRedeemLaterCheckbox.checked = this.autoRedeemVoucherLater;
            autoDismissLevelUpCheckbox.checked = this.autoDismissLevelUp;
            autoDismissPetLevelUpCheckbox.checked = this.autoDismissPetLevelUp;

            // Set up event listeners
            fpsInput.addEventListener('input', this.updateFPS.bind(this));
            missionGoButton.addEventListener('click', this.executeBestMission.bind(this));
            buyEnergyButton.addEventListener('click', this.buyMoreEnergy.bind(this));
            questFocusSelect.addEventListener('change', this.updateMissionFocus.bind(this));
            maxEnergyQuestInput.addEventListener('change', this.updateMaxEnergyQuest.bind(this));
            questSenseBoosterCheckbox.addEventListener('change', this.updateQuestSenseBooster.bind(this));
            trainSenseBoosterCheckbox.addEventListener('change', this.updateTrainSenseBooster.bind(this));
            questAutoStartCheckbox.addEventListener('change', this.updateAutoStartQuest.bind(this));
            questAutoClaimCheckbox.addEventListener('change', this.updateAutoClaimQuest.bind(this));
            questAutoNextCheckbox.addEventListener('change', this.updateAutoNextQuest.bind(this));
            voucherAutoRedeemLaterCheckbox.addEventListener('change', this.updateAutoRedeemVoucherLater.bind(this));
            autoDismissLevelUpCheckbox.addEventListener('change', this.updateAutoDismissLevelUp.bind(this));
            autoDismissPetLevelUpCheckbox.addEventListener('change', this.updateAutoDismissPetLevelUp.bind(this));
        }

        /**
         * Sets up a proxy for XMLHttpRequest to intercept and handle quest data.
         */
        setupRequestProxy() {
            const self = this;
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function (method, url) {
                this._method = method;
                this._url = url;
                return originalOpen.apply(this, arguments);
            };

            XMLHttpRequest.prototype.send = function (data) {
                const xhr = this;
                const originalOnReadyStateChange = xhr.onreadystatechange;

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr._method === "POST" && xhr._url.includes("request.php")) {
                        const jsonResponse = JSON.parse(xhr.responseText)

                        if (Array.isArray(jsonResponse?.data?.quests))
                            self.handleQuestChange(jsonResponse.data.quests);

                        if (data.includes("action=checkForQuestComplete"))
                            self.handleCheckForQuestComplete();

                        if (data.includes("action=claimQuestRewards"))
                            self.handleClaimQuestRewards();
                    }
                    let reportingError = data && data.includes("gameReportError");
                    if (!reportingError && originalOnReadyStateChange) {
                        originalOnReadyStateChange.apply(xhr, arguments);
                    } else if (originalOnReadyStateChange) {
                        console.error("[Missioner] Game error report prevented", data);
                    }
                }

                return originalSend.apply(this, arguments);
            };
        }

        /**
         * Handles check for claim quest rewards.
         */
        handleClaimQuestRewards() {
            if (!this.autoNextQuest || !document.Missioner.quest_complete)
                return;

            setTimeout(() => {
                this.executeBestMission();
            }, 500);
        }

        /**
         * Handles check for quest complete events.
         */
        handleCheckForQuestComplete() {
            // Auto-claim Quest
            setTimeout(() => {
                if (!this.autoClaimQuest || !document.Missioner.quest_complete || !document.Missioner.quest_complete._btnClose)
                    return;

                document.Missioner.quest_complete.onClickClose();
            }, 500);
        }

        /**
         * Handles changes in quest data and updates the UI.
         * @param {Array} quests - The array of quest data.
         */
        handleQuestChange(quests) {
            this.currentQuests = quests.map(quest => ({...quest, rewards: JSON.parse(quest.rewards)}));
            this.updateUIWithBestQuest(this.getBestQuest());
        }

        /**
         * Updates the user interface with information about the best quest.
         * @param {Object} quest - The best quest object.
         */
        updateUIWithBestQuest(quest) {
            if (!quest) return;
            document.getElementById("m-city").textContent = QUEST_STAGES[quest.stage];
            document.getElementById("m-xp").textContent = numeral(quest.rewards.xp || 0).format('0,0');
            document.getElementById("m-coins").textContent = numeral(quest.rewards.coins || 0).format('0,0');
            document.getElementById("m-cost").textContent = numeral(quest.energy_cost).format('0,0');
            document.getElementById("m-duration").textContent = (quest.duration / 60) + " Minutes";
        }

        /**
         * Determines and returns the best quest based on the current mission focus and settings.
         * @returns {Object|null} The best quest object or null if no quests are available.
         */
        getBestQuest() {
            let availableQuests = [...this.currentQuests];

            if (availableQuests.length === 0) return null;

            // Filter Quests exceeding the max energy per quest
            availableQuests = availableQuests.filter(q => q.energy_cost <= this.maxEnergyPerQuest);

            availableQuests = this.sortQuestsByFocus(availableQuests);

            // If there's no quest meeting the criteria filters, sort all quests by min energy
            if (availableQuests.length <= 0) {
                this.currentQuests.sort((a, b) => a.energy_cost - b.energy_cost);
            }

            return availableQuests[0] || null;
        }

        /**
         * Sorts the quests array based on the current mission focus.
         * @param {Array} quests - The array of quests to sort.
         * @returns {Array} The sorted array of quests.
         */
        sortQuestsByFocus(quests) {
            switch (this.currentMissionFocus) {
                case MISSION_FOCUS.XP:
                    return quests.sort((a, b) => (b.rewards.xp / b.energy_cost) - (a.rewards.xp / a.energy_cost));
                case MISSION_FOCUS.COINS:
                    return quests.sort((a, b) => (b.rewards.coins / b.energy_cost) - (a.rewards.coins / a.energy_cost));
                case MISSION_FOCUS.COMBAT:
                    return quests.filter(q => q.fight_difficulty !== 0).sort((a, b) => a.energy_cost - b.energy_cost);
                case MISSION_FOCUS.TIME:
                    return quests.filter(q => q.fight_difficulty === 0).sort((a, b) => a.energy_cost - b.energy_cost);
                case MISSION_FOCUS.MIN_ENERGY:
                    return quests.sort((a, b) => a.energy_cost - b.energy_cost);
                case MISSION_FOCUS.HEROBOOK_ITEM:
                    return quests.sort((a, b) => b.rewards.hasOwnProperty("herobook_item_epic") - a.rewards.hasOwnProperty("herobook_item_epic") || a.energy_cost - b.energy_cost);
                case MISSION_FOCUS.HC:
                    return quests.sort((a, b) => b.rewards.hasOwnProperty("guild_competition_item") - a.rewards.hasOwnProperty("guild_competition_item") || a.energy_cost - b.energy_cost);
                case MISSION_FOCUS.EVENT_ITEM:
                    return quests.sort((a, b) => b.rewards.hasOwnProperty("event_item") - a.rewards.hasOwnProperty("event_item") || a.energy_cost - b.energy_cost);
                case MISSION_FOCUS.SLOTMACHINE:
                    return quests.sort((a, b) => b.rewards.hasOwnProperty("slotmachine_jetons") - a.rewards.hasOwnProperty("slotmachine_jetons") || a.energy_cost - b.energy_cost);
                default:
                    return quests;
            }
        }

        /**
         * Event handler for changing the mission focus.
         * @param {Event} event
         */
        updateMissionFocus(event) {
            this.currentMissionFocus = event.target.value;
            GM_setValue('mission-focus', this.currentMissionFocus);
            this.updateUIWithBestQuest(this.getBestQuest());
        }

        /**
         * Event handler for changing the auto-redeem voucher later setting.
         * @param {Event} event
         */
        updateAutoRedeemVoucherLater(event) {
            this.autoRedeemVoucherLater = event.target.checked;
            GM_setValue("auto-redeem-voucher-later", this.autoRedeemVoucherLater);
        }

        /**
         * Event handler for changing the auto dismiss pet level-up setting.
         * @param {Event} event
         */
        updateAutoDismissPetLevelUp(event) {
            this.autoDismissPetLevelUp = event.target.checked;
            GM_setValue("auto-dismiss-pet-level-up", this.autoDismissPetLevelUp);
        }

        /**
         * Event handler for changing the auto dismiss level-up setting.
         * @param {Event} event
         */
        updateAutoDismissLevelUp(event) {
            this.autoDismissLevelUp = event.target.checked;
            GM_setValue("auto-dismiss-level-up", this.autoDismissLevelUp);
        }

        /**
         * Event handler for changing the max energy per quest.
         * @param {Event} event
         */
        updateMaxEnergyQuest(event) {
            this.maxEnergyPerQuest = event.target.value;
            GM_setValue("max-energy-quest", this.maxEnergyPerQuest);
            this.updateUIWithBestQuest(this.getBestQuest());
        }

        /**
         * Event handler for updating the quest sense booster setting.
         * @param {Event} event
         */
        updateQuestSenseBooster(event) {
            this.questSenseBoosterActive = event.target.checked;
            GM_setValue("sense-booster", this.questSenseBoosterActive);
        }

        /**
         * Event handler for updating the train sense booster setting.
         * @param {Event} event
         */
        updateTrainSenseBooster(event) {
            this.trainSenseBoosterActive = event.target.checked;
            GM_setValue("train-sense-booster", this.trainSenseBoosterActive);
        }

        /**
         * Event handler for updating the auto-start-quest setting.
         * @param {Event} event
         */
        updateAutoStartQuest(event) {
            this.autoStartQuest = event.target.checked;
            GM_setValue("auto-start-quest", this.autoStartQuest);
        }

        /**
         * Event handler for updating the auto-claim-quest setting.
         * @param {Event} event
         */
        updateAutoClaimQuest(event) {
            this.autoClaimQuest = event.target.checked;
            GM_setValue("quest-auto-claim", this.autoClaimQuest);
        }

        /**
         * Event handler for updating the auto-next-quest setting.
         * @param {Event} event
         */
        updateAutoNextQuest(event) {
            this.autoNextQuest = event.target.checked;
            GM_setValue("quest-auto-next", this.autoNextQuest);
        }

        /**
         * Event handler for updating the FPS value.
         * @param {Event} event
         */
        updateFPS(event) {
            this.currentFPS = parseInt(event.target.value, 10);
            GM_setValue("fps", this.currentFPS);
            document.getElementById("fps-input-label").textContent = "Current FPS: " + this.currentFPS;
            this.setFPS();
        }

        /**
         * Sets the game's FPS (Frames Per Second) to the current FPS value.
         */
        setFPS() {
            if (document.Missioner.app && document.Missioner.app.framePeriod) {
                document.Missioner.app.framePeriod = Math.floor(1000 / this.currentFPS);
            }
        }

        /**
         * Shows the dialog to buy more energy
         */
        buyMoreEnergy() {
            if (document?.Missioner?.quest) {
                document.Missioner.quest.onClickBuyEnergy();
            }
        }

        /**
         * Executes the best quest based on the current settings.
         */
        executeBestMission() {
            if (!document.Missioner.stage)
                return;

            const bestQuest = this.getBestQuest();
            if (!bestQuest) return;

            document.Missioner.stage.setStage(bestQuest.stage);

            setTimeout(() => {
                const questButtons = [
                    document.Missioner.quest._btnQuest1,
                    document.Missioner.quest._btnQuest2,
                    document.Missioner.quest._btnQuest3
                ];

                const targetButton = questButtons.find(button => button.get_tag()._data.id === bestQuest.id);
                if (targetButton) {
                    document.Missioner.quest.clickQuest(targetButton);

                    setTimeout(() => {
                        if (this.autoStartQuest && document.Missioner.dialog_quest) {
                            document.Missioner.dialog_quest.onClickStartQuest();
                        }
                    }, 300);
                } else {
                    console.error("Failed to find quest");
                }
            }, 400);
        }

        /**
         * Handler for the DOMContentLoaded event.
         */
        onDOMContentLoaded() {
            document.Missioner = {};

            // Remove conflicting script
            const embedScript = this.findScriptWithCode("function embedGame()");
            if (embedScript) embedScript.parentNode.removeChild(embedScript);

            // Inject the fixed game code
            this.injectFixedEmbedCode();

            // Create the UI
            this.createUI();
            console.log("[Missioner] Setup complete!");
        }

        /**
         * Handler for the window load event.
         */
        onWindowLoad() {
            this.setFPS();

            // General Loop
            setInterval(() => {

                // Quest sense booster
                if (document.Missioner.quest && document.Missioner.quest._btnSenseBooster)
                    if (document.Missioner.quest._btnSenseBooster.get_visible() === this.questSenseBoosterActive) {
                        document.Missioner.quest._btnSenseBooster.set_visible(!this.questSenseBoosterActive);
                        document.Missioner.quest._btnMostXPQuest.set_visible(this.questSenseBoosterActive);
                        document.Missioner.quest._btnMostGameCurrencyQuest.set_visible(this.questSenseBoosterActive);
                    }

                // Train sense booster
                if (document.Missioner.train && document.Missioner.train._btnTrainingSenseBooster)
                    if (document.Missioner.train._btnTrainingSenseBooster.get_visible() === this.trainSenseBoosterActive) {
                        document.Missioner.train._btnTrainingSenseBooster.set_visible(!this.trainSenseBoosterActive);
                        document.Missioner.train._btnMostGameCurrencyTrainingQuest.set_visible(this.trainSenseBoosterActive);
                        document.Missioner.train._btnMostTrainingProgressTrainingQuest.set_visible(this.trainSenseBoosterActive);
                        document.Missioner.train._btnMostXPTrainingQuest.set_visible(this.trainSenseBoosterActive);
                    }

                // Auto-redeem Voucher Later
                if (this.autoRedeemVoucherLater && document.Missioner.new_voucher && document.Missioner.new_voucher._btnClose) {
                    document.Missioner.new_voucher.onClickClose();
                }

                // Level-up dismiss
                if (this.autoDismissLevelUp && document.Missioner.level_up && document.Missioner.level_up._btnClose) {
                    document.Missioner.level_up.onClickClose();
                    document.Missioner.level_up.dispose();
                }

                // Pet Level-up dismiss
                if (this.autoDismissPetLevelUp && document.Missioner.pet_level_up && document.Missioner.pet_level_up._btnClose) {
                    document.Missioner.pet_level_up.onClickClose();
                    document.Missioner.pet_level_up.dispose();
                }
            }, 300);
        }

        /**
         * Finds a script element that contains the specified code.
         * @param {string} targetCode - The code to search for.
         * @returns {HTMLScriptElement|null} The found script element or null.
         */
        findScriptWithCode(targetCode) {
            return Array.from(document.querySelectorAll("script")).find(script => script.textContent.includes(targetCode)) || null;
        }

        /**
         * Injects the fixed embed code into the document.
         */
        injectFixedEmbedCode() {
            const fixedEmbedCode = `
                var appWidth = 1120;
                var appHeight = 755;
                if (gameLoaded) {
                    embedGame();
                }
                function embedGame() {
                    let script = lime.$scripts["HeroZero.min"].toString();
                    script = script.replace('this.gameDeviceCache', 'document.Missioner.app=this;this.gameDeviceCache');
                    script = script.replace('this._timer=this._tooltipProgressStar1', 'document.Missioner.train=this;this._timer=this._tooltipProgressStar1');
                    script = script.replace('this._btnClose=this._btnStartQuest=this._b', 'document.Missioner.dialog_quest=this;this._btnClose=this._btnStartQuest=this._b');
                    script = script.replace('this._quest.get_isTimeQuest()', 'document.Missioner.quest_complete=this;this._quest.get_isTimeQuest()');
                    script = script.replace('this._btnVideoAdvertisment=this._btnUseResource=this._btnSlotMachine', 'document.Missioner.stage=this;this._btnVideoAdvertisment=this._btnUseResource=this._btnSlotMachine');
                    script = script.replace('{this._leftSideButtons=null;', '{document.Missioner.quest=this;this._leftSideButtons=null;');
                    script = script.replace('this._onLoadedCharacter=this', 'document.Missioner.view_manager=this;this._onLoadedCharacter=this');
                    script = script.replace('this._voucher=a', 'document.Missioner.new_voucher=this;this._voucher=a');
                    script = script.replace('.txtLevelNumber.set_fontName("FontHeadline");', '.txtLevelNumber.set_fontName("FontHeadline");document.Missioner.level_up=this;');
                    script = script.replace('this._btnClose=this._sidekick=null;', 'this._btnClose=this._sidekick=null;document.Missioner.pet_level_up=this;');
                    script = script.replace('this._btnCurrentDungeonQuest=this._btnBack', 'document.Missioner.dungeon=this;this._btnCurrentDungeonQuest=this._btnBack');
                    eval("window.lime_script = " + script);
                    lime.$scripts["HeroZero.min"] = window.lime_script;
                    lime.embed("HeroZero.min", "appClient", appWidth, appHeight, {
                        height: appHeight,
                        rootPath: "https://hz-static-2.akamaized.net/assets/html5",
                        parameters: clientVars
                    });
                    console.log("[Missioner] Game Fix Injected");
                }
            `;
            const fixScript = document.createElement("script");
            fixScript.textContent = fixedEmbedCode;
            document.head.appendChild(fixScript);
        }
    }

    // Instantiate the EquiMissioner class
    new EquiMissioner();
})();
