// ==UserScript==
// @name         Real Profit Calculator
// @namespace    http://tampermonkey.net/
// @version      1.61
// @description  Calculates real NoRNG profit and exp gain for MWI battle emulator.
// @author       guch8017
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534895/Real%20Profit%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/534895/Real%20Profit%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let globalBuffConfig = {
        expLevel: 20,
        battleDropLevel: 20,
        mooPass: true
    }
    let language = "en";

    const eliteMapExpBonus = {
        "/actions/combat/smelly_planet_elite": 0.1,
        "/actions/combat/swamp_planet_elite": 0.1,
        "/actions/combat/aqua_planet_elite": 0.1,
        "/actions/combat/jungle_planet_elite": 0.1,
        "/actions/combat/gobo_planet_elite": 0.15,
        "/actions/combat/planet_of_the_eyes_elite": 0.15,
        "/actions/combat/sorcerers_tower_elite": 0.15,
        "/actions/combat/bear_with_it_elite": 0.15,
        "/actions/combat/golem_cave_elite": 0.2,
        "/actions/combat/twilight_zone_elite": 0.2,
        "/actions/combat/infernal_abyss_elite": 0.2,
    }

    const i18nText = {
        "en": {
            "i18n-realProfitTitle": "Real No RNG Profit",
            "i18n-realExpGainTitle": "Real XP Per Hour",
            "i18n-realDailyProfitTitle": "Real No RNG Profit Per Day",
            "i18n-communityBuff": "Community Buffs",
            "i18n-expLevel": "Experience Level",
            "i18n-battleDropLevel": "Combat Drop Level",
            "i18n-mooPass": "Moo Pass",
            "i18n-close": "Close",
        },
        "zh": {
            "i18n-realProfitTitle": "实际期望利润",
            "i18n-realExpGainTitle": "实际每小时经验值",
            "i18n-realDailyProfitTitle": "实际每日期望利润",
            "i18n-communityBuff": "社区增益",
            "i18n-expLevel": "经验等级",
            "i18n-battleDropLevel": "战斗掉落等级",
            "i18n-mooPass": "哞卡",
            "i18n-close": "关闭",
        }
    }

    const enhancementLevelTotalMultiplierTable = [0, 1, 2.1, 3.3, 4.6, 6, 7.5, 9.1, 10.8, 12.600000000000001, 14.500000000000002, 16.5, 18.6, 20.8, 23.1, 25.5, 28, 30.6, 33.300000000000004, 36.1, 39];

    function parseNumber(text) {
        const numericText = text.replace(/[^\d.,\-]/g, '').replace(/,/g, '');
        return parseFloat(numericText);
    }

    function getDrinkConcentration(level) {
        return 0.1 + 0.002 * (enhancementLevelTotalMultiplierTable[level] || 0);
    }

    function getWisdomNeckBonus(level) {
        return 0.03 + 0.003 * (enhancementLevelTotalMultiplierTable[level] || 0);
    }

    function getBuffRate(level) {
        if (level === 0) return 0;
        return 0.2 + 0.005 * (level - 1);
    }

    async function calculateProfit() {
        const expenseText = document.getElementById('script_expense')?.textContent || '';
        const noRngProfitText = document.getElementById('noRngProfitPreview')?.textContent || '';

        const expense = parseNumber(expenseText);
        const noRngProfit = parseNumber(noRngProfitText);
        const buffRate = getBuffRate(globalBuffConfig.battleDropLevel);
        const simulationTime = Number.parseInt(document.querySelector("#inputSimulationTime").value);

        if (!isNaN(expense) && !isNaN(noRngProfit)) {
            const realProfit = ((noRngProfit + expense) * (1 + buffRate)) - expense;
            const formattedProfit = realProfit.toLocaleString(undefined, { maximumFractionDigits: 3 });
            const dailyRealProfit = realProfit / simulationTime * 24;
            const formattedDailyProfit = dailyRealProfit.toLocaleString(undefined, { maximumFractionDigits: 3 });
            const realProfitDiv = document.getElementById('realProfitDisplay');
            const realDailyProfitDiv = document.getElementById('realDailyProfitDisplay');
            realProfitDiv.setAttribute("i18n-data", `: ${formattedProfit}`);
            realDailyProfitDiv.setAttribute("i18n-data", `: ${formattedDailyProfit}`);
            applyi18n();
        }
    }

    function addRealProfitBlock() {
        const realProfitDiv = document.createElement('div');
        realProfitDiv.id = 'realProfitDisplay';
        realProfitDiv.style.backgroundColor = '#FFD700';
        realProfitDiv.style.color = 'black';
        realProfitDiv.style.fontWeight = 'bold';
        realProfitDiv.style.padding = '4px';
        realProfitDiv.setAttribute("i18n-id", "i18n-realProfitTitle");
        realProfitDiv.setAttribute("i18n-data", ":");

        const realDailyProfitDiv = document.createElement('div');
        realDailyProfitDiv.id = 'realDailyProfitDisplay';
        realDailyProfitDiv.style.backgroundColor = '#FFD700';
        realDailyProfitDiv.style.color = 'black';
        realDailyProfitDiv.style.fontWeight = 'bold';
        realDailyProfitDiv.style.padding = '4px';
        realDailyProfitDiv.setAttribute("i18n-id", "i18n-realDailyProfitTitle");
        realDailyProfitDiv.setAttribute("i18n-data", ":");

        const targetDiv = document.getElementById('noRngProfitPreview').parentElement.parentElement;
        targetDiv.parentNode.insertBefore(realDailyProfitDiv, targetDiv.nextSibling);
        targetDiv.parentNode.insertBefore(realProfitDiv, targetDiv.nextSibling);
    }

    function addRealExpBlock() {
        let realExpTitle = document.createElement('div');
        realExpTitle.className = "row";
        realExpTitle.innerHTML = `<b id="realExpGainTitle" i18n-id="i18n-realExpGainTitle"></b>`;
        let realExpDiv = document.createElement('div');
        realExpDiv.id = "simulationResultExperienceGainReal";
        realExpDiv.className = "mb-2";
        realExpDiv.style.backgroundColor = "rgb(205, 255, 221)";
        realExpDiv.style.color = "black";
        const targetDiv = document.getElementById('simulationResultExperienceGain');
        targetDiv.parentNode.insertBefore(realExpDiv, targetDiv.nextSibling);
        targetDiv.parentNode.insertBefore(realExpTitle, targetDiv.nextSibling);
    }

    function addi18nListener() {
        setTimeout(() => {
            const i18nBtnList = document.querySelector("body > div.language-switcher").children;
            i18nBtnList[0].addEventListener("click", () => {
                language = "en";
                applyi18n();
            });
            i18nBtnList[1].addEventListener("click", () => {
                language = "zh";
                applyi18n();
            });
        }, 1000);
    }

    function applyi18n() {
        const i18nElements = document.querySelectorAll("[i18n-id]");
        i18nElements.forEach(element => {
            const i18nId = element.getAttribute("i18n-id");
            let text = "";
            if (i18nText[language] && i18nText[language][i18nId]) {
                text = i18nText[language][i18nId];
            } else {
                console.warn(`Missing translation for ${i18nId} in language ${language}`);
            }
            if (element.getAttribute("i18n-data")) {
                text += element.getAttribute("i18n-data");
            }
            element.textContent = text;
        });
    }

    function addCommunityBuffDialog() {
        const dialogHtml = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" i18n-id="i18n-communityBuff"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" id="buttonCloseCommBuff1"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div id="commBuffList">
                                <div class="row mb-2">
                                    <div class="col-md-4 offset-md-3 align-self-center" i18n-id="i18n-expLevel"></div>
                                    <div class="col-md-3">
                                        <input class="form-control" type="number" placeholder="0" min="0" max="20" step="1" id="commExpLevel">
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 offset-md-3 align-self-center" i18n-id="i18n-battleDropLevel"></div>
                                    <div class="col-md-3">
                                        <input class="form-control" type="number" placeholder="0" min="0" max="20" step="1" id="commBattleDropLevel">
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 offset-md-3 align-self-center" i18n-id="i18n-mooPass"></div>
                                    <div class="col-md-3">
                                        <input class="form-check-input" type="checkbox" id="commMooPass">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="buttonCloseCommBuff2" i18n-id="i18n-close"></button>
                    </div>
                </div>
            </div>
        `;
        const dialogDiv = document.createElement('div');
        dialogDiv.className = "modal";
        dialogDiv.id = "communityBuffModal";
        dialogDiv.tabIndex = "-1";
        dialogDiv.style.display = "none";
        dialogDiv.ariaHidden = "true";
        dialogDiv.innerHTML = dialogHtml;
        const targetDiv = document.getElementById('houseRoomsModal');
        targetDiv.parentNode.insertBefore(dialogDiv, targetDiv.nextSibling);
        const button = document.createElement('button');
        button.id = "buttonCommunityBuff";
        button.className = "btn btn-primary";
        button.type = "button";
        button.setAttribute("i18n-id", "i18n-communityBuff");
        button.onclick = showCommunityBuffDialog;
        const buttonDiv = document.createElement('div');
        buttonDiv.className = "col-md-auto";
        buttonDiv.appendChild(button);
        const targetButton = document.getElementById('buttonImportExport');
        targetButton.parentNode.parentNode.insertBefore(buttonDiv, targetButton.parentNode.nextSibling);
        document.getElementById('buttonCloseCommBuff1').onclick = hideCommunityBuffDialog;
        document.getElementById('buttonCloseCommBuff2').onclick = hideCommunityBuffDialog;
    }

    function saveBuffStatus() {
        const expLevel = parseInt(document.getElementById('commExpLevel').value);
        const battleDropLevel = parseInt(document.getElementById('commBattleDropLevel').value);
        const mooPass = document.getElementById('commMooPass').checked;
        globalBuffConfig.expLevel = expLevel;
        globalBuffConfig.battleDropLevel = battleDropLevel;
        globalBuffConfig.mooPass = mooPass;
        localStorage.setItem("rpc_buff_config", JSON.stringify(globalBuffConfig));
    }

    function loadBuffStatus() {
        const buffConfig = localStorage.getItem("rpc_buff_config");
        if (buffConfig) {
            let { expLevel, battleDropLevel, mooPass } = JSON.parse(buffConfig);
            if (expLevel === undefined) expLevel = 20;
            if (battleDropLevel === undefined) battleDropLevel = 20;
            if (mooPass === undefined) mooPass = true;

            document.getElementById('commExpLevel').value = expLevel;
            document.getElementById('commBattleDropLevel').value = battleDropLevel;
            document.getElementById('commMooPass').checked = mooPass;

            globalBuffConfig.expLevel = expLevel;
            globalBuffConfig.battleDropLevel = battleDropLevel;
            globalBuffConfig.mooPass = mooPass;
        } else {
            document.getElementById('commExpLevel').value = 20;
            document.getElementById('commBattleDropLevel').value = 20;
            document.getElementById('commMooPass').checked = true;
        }
    }

    function showCommunityBuffDialog() {
        const dialog = document.getElementById('communityBuffModal');
        if (dialog) {
            dialog.style.display = "block";
            dialog.className = "modal show";
            dialog.ariaModal = "true";
            dialog.role = "dialog";
            dialog.removeAttribute("aria-hidden");
            document.body.classList.add("modal-open");
            document.body.style.overflow = "hidden";
            const modalBackdrop = document.createElement('div');
            modalBackdrop.className = "modal-backdrop show";
            document.body.appendChild(modalBackdrop);
        } else {
            console.error("Dialog not found");
        }
    }

    function hideCommunityBuffDialog() {
        const dialog = document.getElementById('communityBuffModal');
        if (dialog) {
            saveBuffStatus();
            dialog.style.display = "none";
            dialog.className = "modal";
            dialog.removeAttribute("aria-modal");
            dialog.removeAttribute("role");
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
        } else {
            console.error("Dialog not found");
        }
    }

    function clearRealExp() {
        const simulationResultExperienceGain = document.getElementById('simulationResultExperienceGainReal');
        if (simulationResultExperienceGain) {
            simulationResultExperienceGain.innerHTML = "";
        }
    }

    function addRealExp(key, value) {
        const simulationResultExperienceGain = document.getElementById('simulationResultExperienceGainReal');
        if (simulationResultExperienceGain) {
            const row = document.createElement('div');
            row.className = "row";
            const col1 = document.createElement('div');
            col1.className = "col-md-6";
            col1.textContent = key;
            const col2 = document.createElement('div');
            col2.className = "col-md-6 text-end";
            col2.textContent = value;
            row.appendChild(col1);
            row.appendChild(col2);
            simulationResultExperienceGain.appendChild(row);
        }
    }

    async function calculateExp() {
        let expBonus = 0;
        // 判断精英地图或地下城加成
        const isDungeon = document.getElementById("simDungeonToggle").checked;
        const mapSelected = document.querySelector("#selectZone").value;
        const isEliteMap = mapSelected.includes("elite");
        if (isDungeon) {
            expBonus = 0.2;
        }
        else if (isEliteMap) {
            let mapBonus = eliteMapExpBonus[mapSelected];
            if (mapBonus === undefined) {
                console.error(`No bonus found for elite map: ${mapSelected}`);
            } else {
                expBonus = mapBonus;
            }
        }
        // 判断咖啡加成，同时计算暴饮带来的额外增益
        let coffeeBonus = 0;
        for (let drinkId = 0; drinkId < 3; drinkId++) {
            const drink = document.querySelector(`#selectDrink_${drinkId}`);
            if (drink && drink.value === "/items/wisdom_coffee") {
                coffeeBonus += 0.12;
            }
        }
        const pouchSel = document.querySelector("#selectEquipment_pouch");
        if (pouchSel && pouchSel.value === "/items/guzzling_pouch") {
            const pouchEnhanceLv = Number.parseInt(document.querySelector("#inputEquipmentEnhancementLevel_pouch").value) || 0;
            const pouchConcentration = getDrinkConcentration(pouchEnhanceLv);
            coffeeBonus *= pouchConcentration;
        }
        expBonus += coffeeBonus;
        // 判断经验项链加成
        const neckSel = document.querySelector("#selectEquipment_neck").value;
        if (neckSel === "/items/necklace_of_wisdom" || neckSel === "/items/philosophers_necklace") {
            const neckEnhanceLv = Number.parseInt(document.querySelector("#inputEquipmentEnhancementLevel_neck").value) || 0;
            expBonus += getWisdomNeckBonus(neckEnhanceLv);
        }
        // 判断房屋加成
        let houseTotalLv = 0;
        for (const houseLv of document.querySelectorAll('input[data-house-hrid]')) {
            houseTotalLv += Number.parseInt(houseLv.value) || 0;
        }
        expBonus += houseTotalLv * 0.0005;
        // 读取经验值
        const expRateBonus = getBuffRate(globalBuffConfig.expLevel);
        const mooPassBonus = globalBuffConfig.mooPass ? 0.05 : 0;
        clearRealExp();
        for (let node of document.querySelector("#simulationResultExperienceGain").childNodes) {
            let node0 = node.childNodes[1];
            let expCurrent = Number.parseInt(node0.innerText);
            let expNew = Math.floor(expCurrent / (1 + expBonus) * (1 + expBonus + expRateBonus + mooPassBonus));
            addRealExp(node.childNodes[0].innerText, expNew);
        }
        let descText = "";
        if (globalBuffConfig.expLevel > 0) descText += `${i18nText[language]["i18n-expLevel"]}: ${globalBuffConfig.expLevel}`;
        if (globalBuffConfig.mooPass) {
            if (descText.length > 0) descText += ", ";
            descText += i18nText[language]["i18n-mooPass"];
        }
        if (descText.length > 0) {
            descText = `(${descText})`;
        }
        document.getElementById("realExpGainTitle").textContent = `${i18nText[language]["i18n-realExpGainTitle"]} ${descText}`;
    }

    const obConfig = { characterData: true, subtree: true, childList: true };
    const ProfitNode = document.getElementById('noRngProfitPreview');
    const ExpNode = document.getElementById('simulationResultExperienceGain');

    addRealExpBlock();
    addCommunityBuffDialog();
    loadBuffStatus();
    addi18nListener();
    addRealProfitBlock();
    language = localStorage.getItem("i18nextLng") || "en";
    applyi18n();

    new MutationObserver(() => { calculateProfit(); }).observe(ProfitNode, obConfig);
    const expObserver = new MutationObserver(() => {
        calculateExp();
    });
    expObserver.observe(ExpNode, obConfig)
})();