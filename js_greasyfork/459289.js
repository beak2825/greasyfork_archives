// ==UserScript==
// @name         Sword Gale Online 介面優化 自用版
// @namespace    http://tampermonkey.net/
// @version      1.29.07
// @description  優化界面
// @author       Wind
// @match        https://swordgale.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swordgale.online
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/459289/Sword%20Gale%20Online%20%E4%BB%8B%E9%9D%A2%E5%84%AA%E5%8C%96%20%E8%87%AA%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/459289/Sword%20Gale%20Online%20%E4%BB%8B%E9%9D%A2%E5%84%AA%E5%8C%96%20%E8%87%AA%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const VERSION = "1.29.0"
    const STORAGE_NAME = "SGO_Interface_Optimization";
    const FORGE_STORAGE_NAME = "forgeLog";
    var autoButton;
    var battleButton;
    var runButton;
    var autoRunButton;
    var autoItemUseButton;
    var useButton;
    var currentTimes = 0;
    var autoBattleTimer;
    var autoRunTimer;
    var autoUseTimer;
    var canAutoBattle = false;
    var autoBattleState = false;
    var autoRunState = false;
    var autoUseState = false;
    var autoForgeTimer;
    var finishTimer;
    var currentForge = [];
    var ForgeLoop = false;
    var lastTime = 0;
    var sp;
    const DEFAULT_SETTINGS = {
        AUTO: {
            AUTO_BATTLE_BUTTON: false,
            AUTO_START_BATTLE: false,
            AUTO_BATTLE_ORDER_FLOOR: 10,
            AUTO_RUN_ORDER_FLOOR: 10,
            AUTO_STOP_HP: 600,
            AUTO_USE_SP: 200,
            AUTO_INPUT_RECIPE: false,
            AUTO_CLICK_RECIPE_START: false,
            AUTO_FINISH_FORGE: false,
            AUTO_FORGE_LOOP: false,
        },
        COLOR: {
            TIPS: "#9AE6B4", //一般提示
            WARNING: "#FC8181", //紅色警告
            TRUE_STATS: "#FEEBC8", //裝備原始素質顏色
            ZONE_LEVEL: "#FF95CA", //樓層切換的顏色
            MARKET_WATCH: "#ffff00", // 關注中的訂單
            EXP_BAR_BACKGROUND: "#57595b",
            EXP_BAR_FILL: "#aadc1e",
            EXP_BAR_FONT: "#fbfbfb"
        },
        WARNING: {
            EQUIPMENT: 20, //裝備低於多少耐久
            HP: 60, //血量單次耗損幾成
            SP: 100 //體力低於多少
        },
        GENERAL: {
            DISABLE_BAD_BUTTON: false, //將 false 改成 true，即可禁用"搶劫"與"我要超渡你"按鍵
            DISABLE_TRUE_STATS: false,
            DISABLE_MARKET_FUNCTION: true,
            HIDE_REST_BUTTON: false,
            MOBILE_WRAP_NAVBAR: false,
            MOBILE_HUNT_REPORT: true,
            HUNT_STATUS_PERCENT: false,
            SHOW_EXP_BAR: false,
            EXP_BAR_FILL_BACKGROUND_IMAGE_URL: "",
            BACKGROUND_IMAGE_URL: "",
        },
        MARKET: {
            WATCH_LIST: [],
            BLACK_LIST: []
        },
        recipe: {}
    }
    const FORGE_LOG = loadForgeLog();

    let SETTINGS = loadSettings();
    const qualityJson = {
        傳說: [2.3, 0.82],
        神話: [2.1, 0.84],
        史詩: [2.0, 0.85],
        完美: [1.85, 0.87],
        頂級: [1.65, 0.88],
        精良: [1.5, 0.9],
        高級: [1.33, 0.93],
        上等: [1.15, 0.96],
        普通: [1, 1],
        次等: [0.9, 1.01],
        劣質: [0.8, 1.02],
        破爛: [0.7, 1.03],
        垃圾般: [0.55, 1.06],
        屎一般: [0.4, 1.1],
    };
    const GLOBAL_HIGHTLIGHT_ROW = {
        equipments: [],
        mines: [],
        items: []
    }
    let GLOBAL_EQUIPMENTS = []
    const observers = [];
    const timers = [];
    const subscribeEvents = {};
    
    const pageScript = {
        "/profile": () => {
            bindEvent("/profile", () => {
                const actionContainer =
                    document.querySelectorAll(".chakra-container")[2];
                if (actionContainer) {
                    actionContainer.querySelector("div > button:nth-child(3)").onclick =
                        calcTime;
                    clearTimers();
                }
            });

            function calcTime() {
                const actionContainer =
                    document.querySelectorAll(".chakra-container")[2];
                const actionLogContainer = actionContainer.querySelector(
                    "div > :nth-child(12)"
                );
                if (actionLogContainer.tagName === "HR") return;
                const actionTime =
                    actionContainer.querySelector("div > span").innerText;

                const observer = new MutationObserver(function (e) {
                    const row = actionLogContainer.querySelector(
                        "div:nth-child(1) > div:nth-child(2) > div"
                    );
                    // console.log("row", row, row.innerText);
                    row.innerText += `    ${actionTime}`;
                    setTimeout(() => {
                        const msgArray = JSON.parse(localStorage.generalActionMessages);
                        // console.log("msgArray", msgArray);
                        msgArray[0].messages[0].m = row.innerText;
                        localStorage.generalActionMessages = JSON.stringify(msgArray);
                    }, 1500);

                    observer.disconnect();
                    // console.log("disconnnnnnnnnnnn");
                });

                observer.observe(actionLogContainer, {
                    subtree: true,
                    childList: true,
                    characterData: true,
                });
                observers.push(observer);
            }
        },
        "/hunt": () => {
            let currentZoneLevel;
            bindEvent("/hunt", () => {
                // const buttons = [
                //     document.querySelector("button.chakra-tabs__tab[data-index='0']"),
                //     document.querySelector("button.chakra-tabs__tab[data-index='1']"),
                //     document.querySelectorAll("[tabindex='0'] > .chakra-container > div > button")?.[0],
                //     document.querySelectorAll("[tabindex='0'] > .chakra-container > div > button")?.[1],
                // ]
                const huntTabButton = document.querySelector("button.chakra-tabs__tab[data-index='0']");
                const playerListTabButton = document.querySelector("button.chakra-tabs__tab[data-index='1']");
                // if (buttons.every(btn => btn)) {
                if (huntTabButton && playerListTabButton) {
                    clearTimers();
                    huntTabButton.onclick = registerHuntLogOberserverAndHideRestButtons;
                    playerListTabButton.onclick = registerPlayerListObserverAndCreateSearchPlayerUI;
                    // buttons[0].onclick = registerHuntLogOberserverAndHideRestButtons;
                    // buttons[1].onclick = registerPlayerListObserverAndCreateSearchPlayerUI;
                    // buttons[2].onclick = buttons[3].onclick =
                    currentZoneLevel = getCurrentZoneLevel();
                    if (!localStorage.hunt_tabIndex || localStorage.hunt_tabIndex === "0") {
                        registerHuntLogOberserverAndHideRestButtons();
                    }else if (localStorage.hunt_tabIndex === "1") {
                        registerPlayerListObserverAndCreateSearchPlayerUI();
                    }
                    
                    subscribeApi("hunt", (data) => {
                        if(getSettingByKey("GENERAL.HUNT_STATUS_PERCENT")){
                            data.profile.fullHp += ` (${Math.floor(data.profile.hp / data.profile.fullHp * 100)}%)`
                            data.profile.fullSp += ` (${Math.floor(data.profile.sp / data.profile.fullSp * 100)}%)`
                        }

                        if(currentZoneLevel === undefined) currentZoneLevel = data.profile.huntStage
                        if(data.profile.huntStage > currentZoneLevel){
                            data.messages.push({
                                m: `爬到了${data.profile.zoneName} ${data.profile.huntStage}`,
                                s: "info"
                            })
                        }
                        currentZoneLevel = data.profile.huntStage;

                        data.meta.teamA.forEach(player => {
                            const {name, hp} = player;
                            const index = data.messages.findIndex(msg => msg.m.match(`^${name}還有 [0-9]+ 點HP`));
                            if(!!~index){
                                const huntHp = Number(regexGetValue(`${name}還有 ([0-9]+) 點HP`, data.messages[index].m)[0])
                                if(hp - huntHp !== 0){
                                    if(hp - huntHp > 0){
                                        data.messages[index].m += `(-${hp - huntHp})`
                                    }else{
                                        data.messages[index].m += `(+${huntHp - hp})`
                                    }
                                }
                            }
                        })
                        const nickname = data.profile.nickname
                        const metaData = data.meta.teamA.find(player => player.name === nickname);
                        const index = data.messages.findIndex(msg => msg.m.match(`^${nickname}還有 [0-9]+ 點HP`));
                        if(!!~index){
                            // if(metaData.hp - data.profile.hp !== 0){
                            //     if(metaData.hp - data.profile.hp > 0){
                            //         data.messages[index].m += `(-${metaData.hp - data.profile.hp})`
                            //     }else{
                            //         data.messages[index].m += `(+${data.profile.hp - metaData.hp})`
                            //     }
                            // }
                            const msg = {m: "", s: "subInfo"}
                            if( metaData.sp - data.profile.sp > 0){
                                msg.m = `${nickname}還有 ${data.profile.sp} 點體力(-${metaData.sp - data.profile.sp })`
                            }else{
                                msg.m = `${nickname}還有 ${data.profile.sp} 點體力(+${data.profile.sp - metaData.sp})`
                            }
                            data.messages.splice(index+1, 0, msg)
                        }
                    });

                    // subscribeApi("profile", (data) => {
                    //     if(currentZoneLevel && data.huntStage > currentZoneLevel){

                    //     }
                    // });

                    // subscribeApi("team", (data) => {
                    //     if(!data.members) return;
                    //     const apiTime = new Date().getTime();
                    //     const firstHuntReport = JSON.parse(localStorage.huntReports)[0];
                    //     if(apiTime - firstHuntReport > 10) return;

                    // });
                }
            });
            function getCurrentZoneLevel(){
                const currentZone = document.querySelector("[zones]").textContent.split("：")[1].trim();
                const reglevel = regexGetValue("([0-9]+)", currentZone)
                if(reglevel.length){
                    return Number(reglevel[0])
                }
                return 0;
            }

            function createSearchPlayerUI(){

                if(document.querySelector("#searchPlayerName")) return;
                const playerListContainer = document.querySelector("[tabindex='0'] > .chakra-container > .css-0")
                const [div, input] = createSearchUI("搜尋玩家", "searchPlayerName");
                input.onchange = () => {
                    const name = input.value;
                    document.querySelectorAll("[tabindex='0'] > .chakra-container > .css-0 > div > div").forEach(row => {
                       checkPlayerName(row, name);
                    });
                };
                playerListContainer.querySelector("p").after(div);
            }

            function registerHuntLogOberserverAndHideRestButtons() {
                // console.log("Register");
                if(getSettingByKey("GENERAL.HIDE_REST_BUTTON")) hideRestButtons();
                if(getSettingByKey("AUTO.AUTO_BATTLE_BUTTON")) createAutoBattleButton();

                clearObservers();
                const huntLogContainer = document.querySelector("[tabindex='0'] > .chakra-container").lastChild
                const observer = new MutationObserver(beautifyHuntLog);
                observer.observe(huntLogContainer, { childList: true });
                observers.push(observer);
                beautifyHuntLog();
            }

            function registerPlayerListObserverAndCreateSearchPlayerUI() {
                // console.log("Register");
                createSearchPlayerUI();
                clearObservers();
                const playerListContainer = document.querySelector("[tabindex='0'] > .chakra-container > .css-0")
                const observer = new MutationObserver(playerListRefreshEvent);
                observer.observe(playerListContainer, { childList: true, subtree: true });
                observers.push(observer);
                playerListRefreshEvent();
            }

            function hideRestButtons(){
                document.querySelectorAll("[tabindex='0'] > .chakra-container > div > button").forEach(button => {
                    if(button.textContent === "休息") button.style.display = "none"; //button.style.marginLeft = "auto";
                    // if(button.textContent === "清空記錄") button.style.marginLeft = "var(--chakra-space-2)";
                });

            }

            function createAutoBattleButton() {
                document.querySelectorAll("[tabindex='0'] > .chakra-container > div > button").forEach(button => {
                    if(button.textContent === "戰鬥") {
                        autoButton = button.cloneNode();
                        battleButton = button;
                        autoButton.removeAttribute("disabled");
                        autoButton.innerText = "自動戰鬥";
                        autoButton.onclick = autoBattle;
                        clearInterval(autoBattleTimer);
                        autoBattleState = false;
                        currentTimes = 0;
                    }
                    if(button.textContent === "趕路") {
                        autoRunButton = button.cloneNode();
                        runButton = button;
                        autoRunButton.removeAttribute("disabled");
                        autoRunButton.innerText = "自動趕路";
                        autoRunButton.onclick = autoRun;
                        clearInterval(autoRunTimer);
                        autoRunState = false;
                        currentTimes = 0;
                        }
                });
                battleButton.after(autoRunButton);
                autoRunButton.after(autoButton);
            }
            
            function autoBattle(){
                if(autoBattleState){
                    clearInterval(autoBattleTimer);
                    autoButton.innerText = "自動戰鬥";
                    currentTimes = 0;
                    autoBattleState = false;
                }
                else {
                    currentZoneLevel = getCurrentZoneLevel();
                    autoBattleState = true;
                    canAutoBattle = true;
                    currentTimes = 5;
                    clearInterval(autoBattleTimer);
                    //autoButton.innerText = "剩餘 " + currentTimes + " 次";
                    autoButton.innerText = "戰鬥中...";
                    autoBattleTimer = setInterval(function(){
                        autoFinishMove();
                        if (canAutoBattle && currentZoneLevel < getSettingByKey("AUTO.AUTO_BATTLE_ORDER_FLOOR")) {
                            if(battleButton.getAttribute("disabled") === "") {
                                autoFinishMove();
                            } else {
                                //currentTimes = currentTimes - 1;
                                if(canAutoBattle) {
                                    battleButton.click();
                                    autoButton.innerText = "戰鬥中...";
                                }
                            }
                        } else {
                            clearInterval(autoBattleTimer);
                            autoButton.innerText = "自動戰鬥";
                            autoBattleState = false;
                        }
                    },1000);
                }
            }

            function autoRun(){
                if(autoRunState){
                    clearInterval(autoRunTimer);
                    autoRunButton.innerText = "自動趕路";
                    currentTimes = 0;
                    autoRunState = false;
                }
                else {
                    currentZoneLevel = getCurrentZoneLevel();
                    autoRunState = true;
                    canAutoBattle = true;
                    currentTimes = 5;
                    clearInterval(autoRunTimer);
                    //autoButton.innerText = "剩餘 " + currentTimes + " 次";
                    autoRunButton.innerText = "趕路中...";
                    autoRunTimer = setInterval(function(){
                        if (canAutoBattle && currentZoneLevel < getSettingByKey("AUTO.AUTO_RUN_ORDER_FLOOR")) {
                            if(runButton.getAttribute("disabled") === "") {
                                autoFinishMove();
                            } else {
                                //currentTimes = currentTimes - 1;
                                runButton.click();
                                autoRunButton.innerText = "趕路中...";
                            }
                        } else {
                            clearInterval(autoRunTimer);
                            autoRunButton.innerText = "自動趕路";
                            autoRunState = false;
                            if (canAutoBattle && getSettingByKey("AUTO.AUTO_START_BATTLE")) {
                                autoBattle();
                            }
                        }
                    },1000);
                }
            }

            function autoFinishMove() {
                document.querySelectorAll(".chakra-container > div > div > button").forEach(button => {
                        if(button.textContent === "完成移動") {
                            button.click();
                        }
                });
            }

            function beautifyHuntLog() {
                if (localStorage.hunt_tabIndex === "1") return;
                const huntLogContainer = document.querySelector(
                    "[tabindex='0'] > .chakra-container " // > .css-0"
                ).lastChild
                huntLogContainer.childNodes.forEach((node) => {
                    const lines = node.querySelectorAll("[data-line-number]");
                    if (lines.length > 1 && !node.querySelector(".information")) {
                        node.style.justifyContent = "space-between";
                        const beforeHuntInformations = Array.from(
                            node.childNodes[1].childNodes[0].childNodes
                        );
                        const profiles = [];
                        const equipments = [];
                        let playerInformationClassname;
                        beforeHuntInformations.forEach((information) => {
                            if (!playerInformationClassname) {
                                playerInformationClassname =
                                    information.childNodes[0].childNodes[0].className;
                            }
                            if (
                                information.childNodes[0].childNodes[0].className ===
                                playerInformationClassname
                            ) {
                                const informationLines = Array.from(information.childNodes);
                                //get name
                                const profileText = informationLines[0].innerText;
                                profiles.push({
                                    name: profileText.split("\n")[0],
                                    hp: regexGetValue("HP: ([0-9]+)", profileText)[0],
                                    die: false,
                                });
                                // profiles.push(informationLines[0].innerText.split("\n")[0]);
                                informationLines.shift();

                                informationLines.forEach((information) => {
                                    const equipmentData = information.innerText;
                                    const equipment = {
                                        name: regexGetValue("的(.*)（", equipmentData)[0],
                                        durability: Number(
                                            regexGetValue("耐([0-9]+)", equipmentData)[0]
                                        ),
                                        costDurablilty: 9999999,
                                        msgClassname: "",
                                    };
                                    equipments.push(equipment);
                                });
                            }
                        });

                        const informationDiv = document.createElement("div");
                        informationDiv.className = "information";
                        informationDiv.style.marginLeft = "0.5em";
                        let battleLogEnd = false;

                        lines.forEach((line) => {
                            const profile = profiles.find(
                                (profile) => line.innerText === `${profile.name}被擊殺死亡了`
                            );
                            if (profile) {
                                profile.die = true;
                                informationDiv.appendChild(line);
                            }

                            //單人戰鬥結束檢查
                            if (!!~line.innerText.indexOf("點HP")) {
                                battleLogEnd = true;
                                //組隊戰鬥結束檢查
                            } else if (profiles.filter((profile) => !profile.die).length === 0) {
                                battleLogEnd = true;
                            }
                            if (battleLogEnd) {
                                //血量耗損計算
                                profiles.forEach((profile) => {
                                    const hpRegexMatch = regexGetValue(
                                        `${profile.name}還有 ([0-9]+) 點HP`,
                                        line.innerText
                                    );
                                    if (hpRegexMatch.length > 0) {
                                        const currentHp = Number(hpRegexMatch[0]);
                                        const costHp = profile.hp - currentHp;
                                        if (costHp / profile.hp >= getSettingByKey("WARNING.HP") / 100) {
                                            line.style.color = getSettingByKey("COLOR.WARNING");
                                            canAutoBattle = false;
                                        }
                                        if (currentHp <= getSettingByKey("AUTO.AUTO_STOP_HP")) {
                                            canAutoBattle = false;
                                        }
                                    }

                                    const spRegexMatch = regexGetValue(
                                        `${profile.name}還有 ([0-9]+) 點體力`,
                                        line.innerText
                                    );
                                    if(spRegexMatch.length){
                                        const currentSp = Number(spRegexMatch[0]);
                                        if(currentSp < getSettingByKey("WARNING.SP")){
                                            line.style.color = getSettingByKey("COLOR.WARNING");
                                            canAutoBattle = false;
                                        }
                                    }
                                });
                                //計算耐久
                                let findEquipment = false;
                                let equipmentBroken = false;
                                equipments.forEach((equipment) => {
                                    //同名武器耐久篩選
                                    if (equipment.costDurablilty === 9999999 && !findEquipment) {
                                        const matchArray = regexGetValue(
                                            `${equipment.name}耗損了 ([0-9]+) 點耐久`,
                                            line.innerText
                                        );
                                        if (matchArray.length > 0) {
                                            findEquipment = true;
                                            equipment.msgClassname = line.className;
                                            equipment.costDurablilty = Number(matchArray[0]);
                                        }
                                        if (RegExp(`${equipment.name}損壞了`).test(line.innerText)) {
                                            equipment.costDurablilty = equipment.durability;
                                            findEquipment = true;
                                            equipmentBroken = true;
                                            canAutoBattle = false;
                                        }
                                    }
                                });
                                if(equipmentBroken) {
                                    informationDiv.insertBefore(line, informationDiv.firstChild);
                                }
                                else{
                                    informationDiv.appendChild(line);
                                }

                                if(/^爬到了(.*)/.test(line.innerText)){
                                    line.style.color = getSettingByKey("COLOR.ZONE_LEVEL");
                                    informationDiv.insertBefore(line, informationDiv.firstChild);
                                }
                            }
                        });
                        //裝備耐久提示
                        equipments.forEach((equipment) => {
                            const calcDurablilty =
                                equipment.durability - equipment.costDurablilty;
                            if (calcDurablilty > 0) {
                                const equipmentMsgDiv = document.createElement("div");
                                equipmentMsgDiv.className = equipment.msgClassname;
                                equipmentMsgDiv.innerText = `${equipment.name}還有 ${calcDurablilty} 點耐久`;
                                equipmentMsgDiv.style.color =
                                    calcDurablilty <= getSettingByKey("WARNING.EQUIPMENT")
                                        ? getSettingByKey("COLOR.WARNING")
                                        : getSettingByKey("COLOR.TIPS")
                                informationDiv.appendChild(equipmentMsgDiv);
                                if (calcDurablilty <= getSettingByKey("WARNING.EQUIPMENT")) {
                                    canAutoBattle = false;
                                }
                            }
                        });
                        // if(currentZoneLevel && getCurrentZoneLevel() > currentZoneLevel){
                        //     const zoneLevelChangeDiv = document.createElement("div");
                        //     zoneLevelChangeDiv.style.display = "flex";
                        //     zoneLevelChangeDiv.style.color = getSettingByKey("COLOR.ZONE_LEVEL");
                        //     zoneLevelChangeDiv.innerText = `爬到了${document.querySelector("[zones]").textContent.split("：")[1]}`
                        //     informationDiv.insertBefore(zoneLevelChangeDiv, informationDiv.firstChild);
                        // }
                        // currentZoneLevel = getCurrentZoneLevel();

                        const leftDiv = document.createElement("div");
                        const rightDiv = document.createElement("div");
                        leftDiv.style.display = "flex";
                        rightDiv.style.alignSelf = "flex-start";
                        leftDiv.appendChild(node.childNodes[0]);
                        if(isMobileDevice()){
                            informationDiv.style.marginLeft = "";
                            if(getSettingByKey("GENERAL.MOBILE_HUNT_REPORT")){
                                informationDiv.insertBefore(node.childNodes[0].childNodes[0], informationDiv.childNodes[0]);                            
                                node.childNodes[0].remove();
                            }else{
                                informationDiv.insertBefore(node.childNodes[0], informationDiv.childNodes[0]);
                            }     
                            leftDiv.appendChild(informationDiv);
                        }else{
                            leftDiv.appendChild(node.childNodes[0]);
                            rightDiv.appendChild(informationDiv);
                        }
                        node.appendChild(leftDiv);
                        if(!isMobileDevice()) node.appendChild(rightDiv);
                    }
                });
            }

            function checkPlayerName(row, name) {
                //檢查是否為體力低下的提示row
                if(new RegExp("^[0-9]{2}/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$").test(row.outerText)) return;
                const playerName = row?.childNodes[1]?.childNodes[0]?.childNodes[1]?.childNodes[0].textContent;
                if(playerName && !!~playerName.indexOf(name)){
                    row.hidden = false;
                }else {
                    row.hidden = true;
                }
            }

            function playerListRefreshEvent() {

                document.querySelectorAll("[tabindex='0'] > .chakra-container > .css-0 > div > div").forEach(row => {
                    //搜尋玩家
                    checkPlayerName(row, document.querySelector("#searchPlayerName").value);
                    //禁用壞按鍵
                    if(getSettingByKey("GENERAL.DISABLE_BAD_BUTTON")){
                        const menuButtons = row.querySelectorAll("[role='menu'] > button");
                        menuButtons.forEach(button => {
                            if(["搶劫", "我要超渡你"].includes(button.textContent)){
                                button.disabled = true;
                            }
                        });
                    }


                    // }
                });
            }
        },
        "/items": () => {
            const tablesColumns = {};
            // const needHighlightRow = {
            //     equipments: [],
            //     mines: [],
            //     items: []
            // };

            bindEvent(["/items", "/market"], () => {
                //var targetContainer = document.querySelector(".chakra-tabs").childNodes[2];
                const tables = document.querySelectorAll("table");
                const targetContainer = document.querySelector(".chakra-tabs");
                if (!tables || !targetContainer) return;
                if (location.pathname === "/market" && tables.length < 3) {
                    return;
                }
                clearTimers();
                // if (location.pathname === "/items") {
                    // targetContainer = document.querySelector(".chakra-tabs");
                const observer = new MutationObserver((e) => {
                    if(e.length === 2 && e[1].addedNodes.length && e[1].addedNodes[0].innerHTML !== ''){
                        if(!getSettingByKey("GENERAL.DISABLE_TRUE_STATS")) onItemsDetail(e[1].addedNodes[0].childNodes[0].childNodes);
                        if(getSettingByKey("AUTO.AUTO_BATTLE_BUTTON")) onCanUseDetail(e[1].addedNodes[0].childNodes[0].childNodes);
                        if(location.pathname === "/market" && !getSettingByKey("GENERAL.DISABLE_MARKET_FUNCTION")) createMarketButtons(e[1].addedNodes[0].childNodes[0].childNodes);
                    }
                });;
                observer.observe(targetContainer, {subtree: false, childList:true })
                observers.push(observer);

                if(!document.querySelector("#searchPlayerName") && location.pathname === "/market") {

                    const [div, input] = createSearchUI("搜尋販賣者", "searchPlayerName");
                    // targetContainer.before(targetContainer.firstChild, div);
                    div.querySelector("label").style.width = "96px";
                    div.style.maxWidth = "800px";
                    div.style.marginLeft = "auto";
                    div.style.marginRight = "auto";
                    div.style.width ="95%"
                    document.querySelector("[role=tablist]").before(div);
                    ["equipments", "mines", "items"].forEach(category => {
                        subscribeApi(`trades?category=${category}`, (data) => {
                            data.trades = data.trades.filter(trade => trade.sellerName.match(input.value))


                        });
                    });
                };

                // targetContainer.querySelectorAll(".chakra-tabs__tab-panels > div > .chakra-container").forEach(tabDiv => {
                //     document.querySelector(".chakra-tabs").appendChild.appendChild(div);
                // })
                // observer.observe(targetContainer, {
                //     subtree: true,
                //     childList: true,
                //     characterData: true,
                // });
            // }
                const types = ["equipments", "mines", "items"]
                tables.forEach((table) => {
                    const type = types.shift();
                    const tableId = `table${Object.keys(tablesColumns).length}-${type}`;
                    table.id = tableId;
                    tablesColumns[tableId] = getTableColumns(table, sortTable);

                    if(location.pathname === "/items") {
                        createQuickFilter(table);
                        table.querySelectorAll("tr > td:nth-child(1) > div").forEach(div => {
                            const tr = div.parentElement.parentElement;
                            if(getComputedStyle(div).borderColor === "rgb(128, 90, 213)"){
                                tr.style.display = "none";
                            }else{
                                tr.style.display = "";
                            }
                        });
                    }else if(location.pathname === "/market"){

                        const tbody = table.querySelector("tbody");
                        function hightlightRow(){
                            const rows = tbody.querySelectorAll("[role=row]");
                            rows.forEach(row => { row.style.border = ""; });
                            GLOBAL_HIGHTLIGHT_ROW[type].forEach(rowIndex => {
                                if(rows.length > 0){
                                    // console.log(tbody.childNodes, rowIndex, tbody.childNodes[rowIndex])
                                    try{
                                        rows[rowIndex].style.border = `solid ${getSettingByKey("COLOR.MARKET_WATCH")}`;
                                    }catch(e) {
                                        console.error(rowIndex, rows );
                                    }
                                }
                            });
                        }
                        const observer = new MutationObserver(hightlightRow);
                        // tbody.firstChild.remove();
                        observer.observe(tbody, {subtree: false, childList:true })
                        observers.push(observer);
                        tbody.appendChild(document.createElement("tr"));
                        // hightlightRow();
                    }
                    


                    
                });

                // document.querySelector(".chakra-container > div > button")?.click()
            });

            function createQuickFilter(table) {
                const quickFilterContainer = document.createElement("div");
                
                quickFilterContainer.classList.add("quick-filter-container");
                quickFilterContainer.innerText = "快篩："

                const colors = ["red", "blue", "cyan", "green", "teal", "orange", "yellow", "pink", "purple", "gray"];
                colors.forEach(color => {
                    const circle = document.createElement("div");
                    circle.classList.add(`circle-${color}`);

                    circle.onclick = (e) => {
                        let lastClickCircle;
                        circle.parentNode.querySelectorAll("div").forEach(div => {
                            if(div.style.backgroundColor !== "") lastClickCircle = div;
                            div.style.backgroundColor = ""
                        })
                        let targetColor = "";
                        if(lastClickCircle !== circle) {
                            circle.style.backgroundColor = `var(--chakra-colors-${color}-500)`;
                            targetColor = color === "gray" ? "rgba(0, 0, 0, 0)" : getComputedStyle(circle).backgroundColor;
                        }
                        table.querySelectorAll("tr > td:nth-child(1) > div").forEach(div => {
                            const tr = div.parentElement.parentElement;
                            if(targetColor === "" || getComputedStyle(div).borderColor === targetColor){
                                if (getComputedStyle(div).borderColor === "rgb(128, 90, 213)" && targetColor !== "rgb(128, 90, 213)"){
                                    tr.style.display = "none";
                                } else {
                                    tr.style.display = "";
                                }
                            }else{
                                tr.style.display = "none";
                            }
                        });
                    };

                    quickFilterContainer.appendChild(circle);
                });

                table.before(quickFilterContainer);
            }
            function sortTable(e) {
                const tableDOM = e.target.parentElement.parentElement.parentElement;
                const sortClassDOM = tableDOM.querySelector(".sort");
                if(["攻擊", "防禦", "耐久"].includes(e.target.innerText)  && location.pathname === "/items") {
                    if(sortClassDOM && sortClassDOM.innerText.match("↓|↑")){
                        sortClassDOM.innerText = sortClassDOM.innerText.slice(0, -1);
                        sortClassDOM.classList.remove("sort");
                    }
                    return;
                };

                let sortingMethod = "↓";
                if (sortClassDOM) {
                    if (sortClassDOM === e.target) {
                        sortingMethod = !!~sortClassDOM.innerText.indexOf("↓") ? "↑" : "↓";
                    }
                    sortClassDOM.classList.remove("sort");
                    sortClassDOM.innerText = sortClassDOM.innerText.slice(0, -1);
                }
                const sortType = e.target.innerText;
                const tableColumns = tablesColumns[tableDOM.id];
                const targetColumn = tableColumns.find(
                    (column) => column.name === sortType
                );
                const tbodyDOM = tableDOM.querySelector("tbody");
                if (targetColumn.isNumeric) {
                    const data = getTableData(tableDOM, targetColumn, tableColumns);

                    let sortedData = data.sort((a, b) => a[sortType] - b[sortType]);
                    if (sortingMethod === "↑") {
                        sortedData = sortedData.reverse();
                    }

                    sortedData.forEach((item) => {
                        tbodyDOM.appendChild(item.DOM);
                    });

                    e.target.innerText += sortingMethod;
                    e.target.classList.add("sort");
                } else {
                    const data = {};
                    tbodyDOM.querySelectorAll("tr[role=row]").forEach((rowDOM) => {
                        const index = tableColumns.indexOf(targetColumn);
                        const key = rowDOM.childNodes[index].innerText;
                        if (data[key]) {
                            data[key].push(rowDOM);
                        } else {
                            data[key] = [rowDOM];
                        }
                    });

                    Object.keys(data).forEach((key) => {
                        data[key].forEach((rowDOM) => {
                            tbodyDOM.appendChild(rowDOM);
                        });
                    });
                }
            }
            function onCanUseDetail(containerNodes) {
                clearInterval(autoUseTimer);
                if(containerNodes[1].tagName === "H2") {
                    let first = true;
                    document.querySelectorAll(".chakra-container > div > button").forEach(button => {
                        if(button.textContent === "使用 × 5" && first) {
                            first = false;
                            autoItemUseButton = button.cloneNode();
                            useButton = button;
                            autoItemUseButton.removeAttribute("disabled");
                            autoItemUseButton.innerText = "自動喝水";
                            autoItemUseButton.onclick = autoUse;
                            clearInterval(autoUseTimer);
                            autoUseState = false;
                            currentTimes = 0;
                        }
                    });
                    useButton.before(autoItemUseButton);
                };
            }
            function autoUse() {
                if(autoUseState){
                    clearInterval(autoUseTimer);
                    autoItemUseButton.innerText = "自動喝水";
                    autoUseState = false;
                }
                else {
                    autoUseState = true;
                    clearInterval(autoUseTimer);
                    autoItemUseButton.innerText = "自動喝水中...";
                    autoUseTimer = setInterval(function(){
                        if (sp < getSettingByKey("AUTO.AUTO_USE_SP")) {
                            if(useButton.getAttribute("disabled") === "") {
                            } else {
                                if(autoUseState) {
                                    useButton.click();
                                    autoItemUseButton.innerText = "自動喝水中...";
                                }
                            }
                        }
                    },5000);
                    timers.push(autoUseTimer);
                }
            }
            function onItemsDetail(containerNodes) {
                if(containerNodes[1].tagName === "H2") return;

                const targetDom = containerNodes[1];
                if (targetDom.classList.contains("addedTrueStat")) return;

                let equipmentNameMatch = regexGetValue("(傳說|神話|史詩|完美|頂級|精良|高級|上等|普通|次等|劣質|破爛|垃圾般|屎一般)的 (.*)", targetDom.querySelector("h2").innerText);
                if (equipmentNameMatch.length < 2) return console.error("quality error");

                //replace把強化次數移除 
                const equipmentName = equipmentNameMatch[1].replace(/\ \+\ [0-9]+/, ""); 
                const ratio = qualityJson[equipmentNameMatch[0]];
                if (!ratio) return console.error("ratio error");

                //市集的裝備顯示有較多資訊 故childNodes在7
                let statDom, forgeDataDom ;
                if(targetDom.childNodes.length >= 6 && location.pathname === "/market"){
                    forgeDataDom = targetDom.querySelector("hr + div");
                    statDom = targetDom.childNodes[5].childNodes[0];
                }else{
                    forgeDataDom = targetDom.childNodes[2];
                    statDom = targetDom.querySelector("hr + div").childNodes[0];
                }
                const [atk, def, luck, kg, dur] = statDom.innerHTML
                    .split("<br>")
                    .map((s, index) => {
                        //有強化的裝備
                        let value = regexGetValue("([0-9]+) \\(([+-]{1}[0-9]+)\\)", s);
                        if(value.length === 2){
                            return Number(value[0]) - Number(value[1])
                        }else {
                            //耐久數值處理
                            if(index === 4){
                                value = regexGetValue("[0-9]+ / ([0-9]+)", s);
                            }else {
                                value = regexGetValue("([0-9]+)", s);
                            }
                            //一般情況
                            if(value.length > 0){
                                return Number( value[0]);
                            }
                            console.error("parse stat error");
                            return 0;
                        }
                    });

                const trueStats = [atk, def, luck].map((num) => {
                    return (num / ratio[0]).toFixed(2);
                });
                trueStats.push((kg / ratio[1]).toFixed(2));
                trueStats.push((dur / ratio[0]).toFixed(2));

                const colorSpan = document.createElement("span");
                colorSpan.style.color = getSettingByKey("COLOR.TRUE_STATS");
                const newStatHTML = statDom.innerHTML
                    .split("<br>")
                    .map((s, index) => {
                        colorSpan.innerText = `(${trueStats[index]})`
                        return `${s} ${colorSpan.outerHTML}`;
                    })
                    .join("<br>");

                const forger = forgeDataDom.childNodes[0].textContent.replace("鍛造者：","")
                const forgeTime = new Date(`${new Date().getFullYear()} ${forgeDataDom.childNodes[1].textContent.replace("鍛造時間：", "")}`)
                forgeTime.setSeconds(0);
                forgeTime.setMilliseconds(0);
                const base64 =  btoa(encodeURIComponent(`${forgeTime.getTime()},${equipmentName},${forger}`))
                let forgeMaterial = "";
                if(FORGE_LOG[base64]) {
                    forgeMaterial = `鍛造材料:${FORGE_LOG[base64]}\n`;
                }

                targetDom.classList.add("addedTrueStat");
                statDom.innerHTML = newStatHTML;
                const div = document.createElement("div");
                div.innerText = `${forgeMaterial}括號內原始素質僅供參考，有研究出更好的算法可以聯絡插件作者`;
                targetDom.appendChild(targetDom.querySelector("hr").cloneNode());
                targetDom.appendChild(div);

            }
            function createMarketButtons(containerNodes) {
                let seller = "";
                //道具or礦物
                if(containerNodes[1].tagName === "H2"){
                    //販賣者：XXXX
                    if(!containerNodes[3]?.childNodes[1]?.childNodes[1]?.textContent.startsWith("販賣者：")) return;

                    seller = containerNodes[3]?.childNodes[1]?.childNodes[1]?.textContent.substring(4)
                }else { //裝備類
                    // seller =  containerNodes[1].childNodes[3].childNodes[0].textContent.substring(4)
                    if(!containerNodes[1].querySelector("h2 + div")?.childNodes[1]?.childNodes[1]?.textContent.startsWith("販賣者：")) return;
                    seller =  containerNodes[1].querySelector("h2 + div").childNodes[1].childNodes[1].textContent.substring(4)
                }

                const buttonContainer = containerNodes[containerNodes.length - 1];
                const buyButton = buttonContainer.querySelector("button");

                if(buyButton === null ||
                    getSettingByKey("MARKET.WATCH_LIST").includes(seller) ||
                    getSettingByKey("MARKET.BLACK_LIST").includes(seller)
                )
                    return;

                const watchButton = buyButton.cloneNode();
                const blacklistButton = buyButton.cloneNode();

                watchButton.style.marginRight = "0.5rem";
                watchButton.innerText = "關注賣家"
                if(watchButton.getAttribute("disabled") === "") watchButton.removeAttribute("disabled")
                watchButton.onclick = () => {
                    let list = getSettingByKey("MARKET.WATCH_LIST");
                    watchButton.remove();
                    blacklistButton.remove();
                    if(!list.includes(seller)){
                        list.push(seller);
                        setObjectValueByRecursiveKey(SETTINGS, "MARKET.WATCH_LIST", list);
                        saveSettings();
                    }
                };

                blacklistButton.innerText = "黑名單賣家"
                blacklistButton.style.backgroundColor = getSettingByKey("COLOR.WARNING");
                blacklistButton.style.marginRight = "0.5rem";
                if(blacklistButton.getAttribute("disabled") === "") blacklistButton.removeAttribute("disabled")
                blacklistButton.onclick = () => {
                    watchButton.remove();
                    blacklistButton.remove();
                    let list = getSettingByKey("MARKET.BLACK_LIST");
                    if(!list.includes(seller)){
                        list.push(seller);
                        setObjectValueByRecursiveKey(SETTINGS, "MARKET.BLACK_LIST", list);
                        saveSettings();
                    }
                };
                buyButton.before(watchButton);
                watchButton.before(blacklistButton);
            }
        },
        "/market"() {
            this["/items"]();
        },
        "/forge": () => {
            let recipeData = getSettingByKey("recipe");
            let selectedMaterials = []
            let equipmentName = "";
            const elementClassname = {};
            let materialDiv, forgeContainer, finishContainer, Container1;
            let filterRecipe = {};
            let lastRecipe = {};
            bindEvent("/forge", () => {
                forgeContainer = document.querySelectorAll(".chakra-container");
                if (forgeContainer.length > 0) {
                    if (forgeContainer.length > 1) {
                        forgeContainer = forgeContainer[1];
                    } else {
                        forgeContainer = forgeContainer[0];
                    }
                    // if(!materialDiv)
                    materialDiv = forgeContainer.childNodes[2];
                    const forgeButton = forgeContainer.querySelector("button");
                    if (materialDiv.querySelector(".chakra-table__container") && forgeButton) {
                        clearTimers();

                        createUI();
                        refreshRecipeTable();
                        forgeContainer.querySelector("#addRecipeBtn").onclick = addRecipe;
                        forgeButton.onclick = forgeClick;

                        subscribeApi("forge", (data) => {
                            const time = new Date(data.profile.actionStart);
                            time.setSeconds(0);
                            time.setMilliseconds(0);
                            const base64 = btoa(encodeURIComponent(`${time.getTime()},${equipmentName},${data.profile.nickname}`))
                            FORGE_LOG[base64] = selectedMaterials.join(",")
                            saveForgeLog()
                        });
                    }
                    clearInterval(finishTimer);
                    if (getSettingByKey("AUTO.AUTO_FINISH_FORGE"))
                    {
                        finishTimer = setInterval(function(){
                            Container1 = document.querySelectorAll(".chakra-container");
                            if (Container1.length > 0) {
                                if (Container1.length > 1) {
                                    finishContainer = Container1[0];
                                    finishContainer.querySelectorAll("button").forEach(button => {
                                        if(button.textContent === "完成鍛造") {
                                            button.click();
                                            if (getSettingByKey("AUTO.AUTO_FORGE_LOOP")){
                                                var now = new Date();
                                                if (now.getHours() >= 7 && now.getMinutes() >= 30 && lastTime.getHours() <= 7 && lastTime.getMinutes() < 30) {
                                                    ForgeLoop = false; // 將 ForgeLoop 設為 false
                                                }
                                                if (ForgeLoop) {
                                                    setTimeout(function() {
                                                        lastRecipe.click();
                                                    }, 1000);
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            
                        },2000);
                    }
                }
            });

            function createUI() {
                const equipmentNameDiv =
                    forgeContainer.querySelector("div[role='group']");
                elementClassname["labelDiv"] = equipmentNameDiv.childNodes[1].className;
                elementClassname["input"] = equipmentNameDiv.childNodes[2].className;
                elementClassname["button"] =
                    forgeContainer.querySelector("button").className;

                materialDiv.before(createRecipeTable());
                materialDiv.after(createAddRecipeBlock());
            }

            function createRecipeTable() {
                const recipeDiv = document.createElement("div");
                recipeDiv.id = "recipeDiv";
                recipeDiv.style.marginBottom = "1.25rem";
                const recipeH2 = materialDiv.querySelector("h2").cloneNode();
                recipeH2.innerText = "合成配方(非官方功能)";

                const recipeTable = materialDiv
                    .querySelector(".chakra-table__container")
                    .cloneNode();
                recipeTable.innerHTML = materialDiv.querySelector(
                    ".chakra-table__container"
                ).innerHTML;

                const tableColumns = recipeTable.querySelectorAll("thead > tr > th");
                tableColumns[0].innerText = "名稱";
                tableColumns[1].innerText = "材料";
                tableColumns[1].removeAttribute("data-is-numeric");
                tableColumns[2].innerText = "操作";
                tableColumns[2].style.minWidth = "1px";
                tableColumns[2].style.width = "1px";
                //清空Table
                recipeTable.querySelector("tbody").innerHTML = "";

                elementClassname["td"] =
                    materialDiv.querySelector("tbody > tr > td").className;
                elementClassname["tr"] =
                    materialDiv.querySelector("tbody > tr").className;

                recipeDiv.appendChild(recipeH2);
                recipeDiv.appendChild(recipeTable);

                return recipeDiv;
            }

            function createAddRecipeBlock() {
                const div = document.createElement("div");
                div.style.marginBottom = "1.25rem";

                div.innerHTML = `
                      <div class="${elementClassname["labelDiv"]}">選擇完原料之後輸入配方名字，可將此次選擇的原料記錄在合成配方裡面</div>
                      <input id="recipeNameInput" type="text" class="${elementClassname["input"]}" style="width: 80%;">
                      <button id="addRecipeBtn" type="button" class="${elementClassname["button"]}" style="width: 18%; float: right;">新增配方</button>
                  `;
                return div;
            }

            function refreshRecipeTable() {
                const keyOfRecipeData = Object.keys(recipeData);
                if (keyOfRecipeData.length > 0) {
                    let tbody = forgeContainer.querySelector("#recipeDiv");
                    if (!tbody) {
                        materialDiv.before(createRecipeTable());
                        tbody = forgeContainer.querySelector("#recipeDiv");
                    }
                    tbody = tbody.querySelector("tbody");
                    const recipeNamesDOM = tbody.querySelectorAll("tr > td:nth-child(1)");
                    if (recipeNamesDOM) {
                        recipeNamesDOM.forEach((recipeNamesDOM) => {
                            const index = keyOfRecipeData.indexOf(recipeNamesDOM.innerText);
                            if (!!~index) {
                                keyOfRecipeData.splice(index, 1);
                            }
                        });
                    }
                    // tbody.innerHTML = "";
                    keyOfRecipeData.forEach((key) => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                              <td class="${elementClassname["td"]}">${key}</td>
                              <td class="${elementClassname["td"]}" style="white-space: normal;">${recipeData[key]}</td>
                              <td class="${elementClassname["td"]}">
                                  <button type="button" class="${elementClassname["button"]}"
                                      style="height: 1.75rem; background-color: indianred;"
                                  >X</button>
                              </td>
                          `;
                        tr.className = elementClassname["tr"];
                        tr.querySelector("button").onclick = removeRecipe;
                        tr.onclick = clickRecipe;
                        tbody.appendChild(tr);
                    });
                }
            }

            function clickRecipe(e) {
                if(e.target.tagName === "BUTTON") return;
                ForgeLoop = true;
                lastTime = new Date();
                let tr = e.currentTarget;
                lastRecipe = tr;
                const recipeName = tr.querySelector("td").innerText;
                if (getSettingByKey("AUTO.AUTO_INPUT_RECIPE")) {
                    filterRecipe[recipeName] = recipeData[recipeName];
                } else {
                    if (tr.style.backgroundColor) {
                        tr.style.backgroundColor = "";
                        delete filterRecipe[recipeName];
                    } else {
                        tr.style.backgroundColor = "#1C4532";
                        filterRecipe[recipeName] = recipeData[recipeName];
                    }
                }
                const materialTable = materialDiv.querySelector("table");
                const tableData = getTableData(materialTable, {
                    name: "名稱",
                    isNumeric: false,
                });
                const tableData2 = getTableData(materialTable, {
                    name: "數量",
                    isNumeric: true,
                });
                let materials = {};
                currentForge = [];
                let canForge = true;
                let keyOfFilterRecipe = Object.keys(filterRecipe);
                if (keyOfFilterRecipe.length === 0) {
                    tableData.forEach((row) => {
                        row["DOM"].removeAttribute("hidden");
                    });
                } else {
                    keyOfFilterRecipe.forEach((name) => {
                        filterRecipe[name]
                            //.replaceAll(/ × [0-9]+/g, "")
                            .split("、")
                            .forEach((material) => {
                                let base = material;
                                let result = base.replaceAll(/ × [0-9]+/g, "");
                                let count = base.match(/\d+/g);
                                if (!materials[result]) {
                                    materials[result] = count;
                                }
                                for (let i = 0; i < count; i++) {
                                    currentForge.push(result);
                                }
                            });
                    });
                    for (let materialName in materials) {
                        let count = materials[materialName];
                        let found = false;
                        for (let i = 0; i < tableData.length; i++) {
                            if (tableData[i]["名稱"] === materialName) {
                                found = true;
                                if (parseInt(tableData2[i]["數量"]) < count) {
                                    canForge = false;
                                    console.log("物品名稱:", materialName);
                                    console.log("數量:", tableData2[i]["數量"]);
                                    console.log("需求:", count);
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            canForge = false;
                            console.log("物品名稱:", materialName);
                            console.log("數量:", 0);
                            console.log("需求:", count);
                        }
                    }
                    console.log("canforge:", canForge);
                    if (getSettingByKey("AUTO.AUTO_INPUT_RECIPE")) {
                        autoClickForge(canForge);
                        keyOfFilterRecipe = [];
                        filterRecipe = {};
                    } else if (!getSettingByKey("AUTO.AUTO_INPUT_RECIPE")) {
                        tableData.forEach((row) => {
                            if (materials[row["名稱"]]) {
                                row["DOM"].removeAttribute("hidden");
                            } else {
                                row["DOM"].setAttribute("hidden", "");
                            }
                        });
                    } else {
                        currentForge = [];
                        keyOfFilterRecipe = [];
                        filterRecipe = {};
                        console.log("材料不足");
                    }
                }
            }

            function autoClickForge(canForge) {
                clearInterval(autoForgeTimer);
                const materialTable = materialDiv.querySelector("table");
                const tableData = getTableData(materialTable, {
                    name: "名稱",
                    isNumeric: false,
                });
                    
                autoForgeTimer = setInterval(function(){
                    if(currentForge.length === 0){
                        if(getSettingByKey("AUTO.AUTO_CLICK_RECIPE_START") && canForge)
                        {
                            forgeContainer.querySelectorAll("button").forEach(button => {
                                if(button.textContent === "開始鍛造") {
                                    button.click();
                                }
                            });
                        }
                        clearInterval(autoForgeTimer);
                    } else {
                        let material = currentForge.pop();
                        tableData.forEach((row) => {
                            if (material === row["名稱"]) {
                                row["DOM"].click();
                            } 
                        });
                    }
                },30);
            }

            function addRecipe() {
                const recipeNameInput = document.querySelector("#recipeNameInput");
                const recipeName = recipeNameInput.value;
                if (recipeName !== "") {
                    const materials = [];
                    forgeContainer.childNodes[5].childNodes[2].childNodes.forEach(
                        (materialDOM) => {
                            const materialName = materialDOM.innerText;
                            materials.push(materialName);
                            for (let i = 0; i < Number(materialName.split(" × ")[1]); i++) {
                                setTimeout(() => {
                                    materialDOM.click();
                                }, 100);
                            }
                        }
                    );
                    recipeData = getSettingByKey("recipe");
                    if (!recipeData[recipeName] && materials.length > 0) {
                        recipeData[recipeName] = materials.join("、");
                        SETTINGS["recipe"] = recipeData;
                        saveSettings();
                        refreshRecipeTable();
                        recipeNameInput.value = "";
                    } else {
                        alert("配方名稱與材料不可為空");
                    }
                } else {
                    alert("配方名稱與材料不可為空");
                }
            }

            function removeRecipe(e) {
                const row = e.target.parentElement.parentElement;
                const recipeName = row.querySelector("td").innerText;
                delete recipeData[recipeName];
                SETTINGS["recipe"] = recipeData;
                saveSettings();
                row.remove();
            }

            function forgeClick(){
                selectedMaterials.length = 0
                forgeContainer.querySelectorAll("p + div > div").forEach(div => {
                    selectedMaterials.push(div.textContent.replace(" × ","x"));
                });
                equipmentName = forgeContainer.querySelector("input").value

            }
        },
    };
    
    const specialSubscribeEvents = {
        profile: [
            (data) => {
                if(location.pathname === "/hunt" && getSettingByKey("GENERAL.HUNT_STATUS_PERCENT")){
                    data.fullHp += ` (${Math.floor(data.hp / data.fullHp * 100)}%)`
                    data.fullSp += ` (${Math.floor(data.sp / data.fullSp * 100)}%)`
                }
            },
            (data) => {
                sp = data.sp;
                if(getSettingByKey("GENERAL.SHOW_EXP_BAR")){
                    if(!document.querySelector(".exp-container")) createExpBar();

                    const expBar = document.querySelector("#exp-bar");
                    const expBarFill = document.querySelector("#exp-bar-fill");
                    let percent = Math.floor(data.exp / data.nextExp * 1000) / 10.0;
                    document.querySelector("#exp-bar-level-label").textContent = `LV.${data.lv}`
                    document.querySelector("#exp-bar-exp-label").textContent = `EXP:${data.exp} / ${data.nextExp} (${percent}%)`
                    
                    expBar.style.backgroundColor = getSettingByKey("COLOR.EXP_BAR_BACKGROUND");
                    expBarFill.style.backgroundColor = getSettingByKey("COLOR.EXP_BAR_FILL");
                    if(getSettingByKey("GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL") !== ""){
                        expBar.style.backgroundImage = `url(${getSettingByKey("GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL")})`
                        expBar.style.backgroundSize = "100% 24px";

                        expBarFill.style.backgroundColor = getSettingByKey("COLOR.EXP_BAR_BACKGROUND");                        
                        expBarFill.style.left = "unset";
                        expBarFill.style.right = "0px";

                        percent = 100 - percent;
                        // expBarFill.style.backgroundImage = `url(${getSettingByKey("GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL")})`
                        // expBarFill.style.backgroundSize = "100% 24px";
                    }else{
                        expBar.style.backgroundImage = ``
                        expBarFill.style.left = "";
                        expBarFill.style.right = "";
                    }
                    expBarFill.style.width = `${percent}%`;
                    document.querySelector(".exp-container").style.color = getSettingByKey("COLOR.EXP_BAR_FONT");

                }
            }
        ],
        items: [
            (data) => {
                GLOBAL_EQUIPMENTS = structuredClone(data.equipments);
            },
        ]
    }
    const apiData = {}
    //攔截API回傳
    const _fetch = window.fetch;
    window.fetch = async (url, fetchOptions) => {
        // console.log(url);
        const originResp = await _fetch(url, fetchOptions);
        const ab = await originResp.arrayBuffer()
        const jsonObject = JSON.parse(new TextDecoder("utf-8").decode(ab));

        //特殊問題 部分電腦的url不是字串而是requestInfo 需要取其中的url property來拿到api網址
        const apiUrl = regexGetValue("api/(.*)", typeof url === "string" ? url : url.url);
        // console.log(url, apiUrl);
        if(apiUrl.length){
            if(jsonObject.profile){
                apiData["profile"] = structuredClone(jsonObject.profile);
            
                triggerEventHook("profile");

            }
            if(apiUrl[0].match("trades\\?category=[a-z]+")){ //特例常駐subscribe
                apiData[apiUrl[0]] = structuredClone(jsonObject);
                triggerEventHook(apiUrl[0]);

                const category = regexGetValue("trades\\?category=([a-z]+)", apiUrl[0])[0];
                GLOBAL_HIGHTLIGHT_ROW[category].length = 0;
                if(!getSettingByKey("GENERAL.DISABLE_MARKET_FUNCTION")){

                    const blackList = getSettingByKey("MARKET.BLACK_LIST");
                    apiData[apiUrl[0]].trades = apiData[apiUrl[0]].trades.filter(trade => !blackList.includes(trade.sellerName))

                    const watchList = getSettingByKey("MARKET.WATCH_LIST");

                    for(let i = 0; i < apiData[apiUrl[0]].trades.length; i++){
                        const trade = apiData[apiUrl[0]].trades[i];
                        if(watchList.includes(trade.sellerName)){
                            GLOBAL_HIGHTLIGHT_ROW[category].push(i);
                        }
                    }
                }
                return new Response(new TextEncoder().encode(JSON.stringify(apiData[apiUrl[0]])));
                // apiData[apiUrl[0]].trades.forEach((trade, index) => {
                // });

            }else if(apiUrl[0].match("equipment\/([0-9]+)\/recycle")){
                const equipmentId = regexGetValue("equipment\/([0-9]+)\/recycle", apiUrl[0])[0];
                const equipment = GLOBAL_EQUIPMENTS.find(equipment => equipment.id === Number(equipmentId));
                if(equipment && equipment.crafter !== null){
                    const forgeTime = new Date(`${equipment.craftedTime}`)
                    forgeTime.setSeconds(0);
                    forgeTime.setMilliseconds(0);
                    const base64 =  btoa(encodeURIComponent(`${forgeTime.getTime()},${equipment.name},${equipment.crafter}`))

                    if(FORGE_LOG[base64]){
                        delete FORGE_LOG[base64];
                        saveForgeLog();
                    }
                }
            }
            // else if(location.pathname === "/hunt" && apiUrl[0] === "profile" && getSettingByKey("GENERAL.HUNT_STATUS_PERCENT")){
            //     //狩獵頁面 顯示生命與體力的百分比
            //     jsonObject.fullHp += ` (${Math.floor(jsonObject.hp / jsonObject.fullHp * 100)}%)`
            //     jsonObject.fullSp += ` (${Math.floor(jsonObject.sp / jsonObject.fullSp * 100)}%)`
            // }

            apiData[apiUrl[0]] = structuredClone(jsonObject);
            triggerEventHook(apiUrl[0]);
            // console.log(apiUrl[0], apiData);
            return new Response(new TextEncoder().encode(JSON.stringify(apiData[apiUrl[0]])));

        }else{

            // console.log(apiData);
            const uint8Array = new TextEncoder().encode(JSON.stringify(jsonObject));
            const newResp = new Response(uint8Array);
            return newResp;
        }

    };

    function triggerEventHook(url) {
        if(specialSubscribeEvents[url]){
            specialSubscribeEvents[url].forEach(e => {
                e(apiData[url]);
            });
        }

        if(subscribeEvents[url]){

            const removes = [];
            subscribeEvents[url].forEach(element => {
                if(!element.forever) removes.push(element);
                element.event(apiData[url]);
            });
            if(removes.length) subscribeEvents[url] = subscribeEvents[url].filter(element => !removes.includes(element));
        }

    }

    function subscribeApi(url, event, forever = true) {
        if(!subscribeEvents[url]){
            subscribeEvents[url] = [];
        }
        subscribeEvents[url].push({
            event,
            forever
        });
    }

    function clearSubscribeEvents(){
        Object.keys(subscribeEvents).forEach(key => {
            delete subscribeEvents[key];
        })
    }

    //改變navbar
    function wrapNavbar() {
        const style = document.createElement("style");
        style.innerHTML = `
            nav {
                flex-wrap: wrap;
                min-width: auto !important;
            }
            #__next > div > div:nth-child(2) {
                height: 120px;
            }
        `
        document.body.appendChild(style);
        // document.querySelector("nav").style.flexWrap = "wrap";
        // document.querySelector("nav").style.minWidth = "unset";
    }
    // 搜尋UI
    function createSearchUI(labelText, inputId) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.marginBottom = "1rem"
        div.innerHTML = `<label style="width: 84px;">${labelText}</label>`
        const input = document.createElement("input");
        input.type = "text";
        input.id = inputId
        input.autocomplete = "off"
        input.style.cssText = `
            width: var(--chakra-sizes-full);
            min-width: 0px;
            outline: transparent solid 2px;
            outline-offset: 2px;
            position: relative;
            appearance: none;
            transition-property: var(--chakra-transition-property-common);
            transition-duration: var(--chakra-transition-duration-normal);
            font-size: var(--chakra-fontSizes-md);
            padding-inline-start: var(--chakra-space-4);
            padding-inline-end: var(--chakra-space-4);
            height: var(--chakra-sizes-10);
            border-radius: var(--chakra-radii-md);
            border-width: 2px;
            border-style: solid;
            border-image: initial;
            border-color: var(--chakra-colors-transparent);
            background: var(--chakra-colors-whiteAlpha-100);
        `
        // input.onchange = inputEvent
        div.appendChild(input);
        return [div, input];
    }
    //開啟系統設定UI
    function createOpenDialogButton(){
        //開啟設定的按鍵
        const openDialogBtn = document.createElement("button");
        openDialogBtn.id = "open-dialog-btn"
        openDialogBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <circle cx="12" cy="12" r="3" />
            </svg>
        `
        const style = document.createElement("style");
        //scss
        style.innerText = `*{box-sizing:border-box}.wrapper{display:flex;align-items:center;justify-content:center;background-color:rgba(15,19,26,.8);height:100vh;position:fixed;width:100%;left:0;top:0;overflow:auto;z-index:9999}.header{display:flex;justify-content:space-between;margin:1rem 1rem 0 1rem}.header button{height:100%}.header h1{color:#fff}.header #reset-settings-btn{border:1px solid #3c3f43;margin-right:1rem}.content{display:flex;margin:0 1rem 1rem 1rem;flex-direction:column}.content hr{width:100%}.panel{position:relative;width:100%;display:flex;flex-direction:column}.panel input[type=checkbox]{margin:.5rem}.panel input[type=text]{background-color:#1a1d24;background-image:none;border:1px solid #3c3f43;border-radius:6px;color:#e9ebf0;display:block;font-size:14px;line-height:1.42857143;padding:7px 11px;transition:border-color .3s ease-in-out;width:100px}.panel+.panel::before{border-top:1px solid #3c3f43;content:"";left:20px;position:absolute;right:20px;top:0}.panel-header{width:100%;padding:20px}.panel-header span{color:#fff;font-size:16px;line-height:1.25}.panel-body{padding:0 20px 20px 20px}.panel-body .row{margin-top:1rem;display:flex;align-items:center}.panel-body .row label{color:#a4a9b3;margin-right:1rem}.panel-body .row input{margin-right:1rem}.panel-body .row.table{flex-direction:column;align-items:flex-start}.grid{margin-top:10px;width:100%;color:#a4a9b3;background-color:#1a1d24}.grid div{border-bottom:1px solid #292d33;width:100%;height:40px;padding:10px}.grid .grid-row{display:flex;align-items:center}.grid .grid-row:hover{background-color:#3c3f43}.grid .grid-row button{font-size:14px;border:none;background-color:rgba(0,0,0,0);color:#9146ff;margin-left:auto}.grid .grid-row button:hover{cursor:pointer}.description{margin:0px;color:#a4a9b3;line-height:1.5;font-size:8px}.dialog{width:800px;height:500px;left:0;top:0;overflow:auto;z-index:9999;background-color:#292d33;border-radius:6px;box-shadow:0 4px 4px rgba(0,0,0,.12),0 0 10px rgba(0,0,0,.06)}#open-dialog-btn{position:-webkit-sticky;position:sticky;left:0;bottom:20px;margin-right:1rem;z-index:9998;color:#7d7d7d;background-color:rgba(0,0,0,0);border:none}#open-dialog-btn:hover{color:#fff}[hidden]{display:none}#exp-bar{position:fixed;bottom:0px;width:100%;height:24px}#exp-bar-fill{position:fixed;bottom:0px;left:0px;height:24px}.exp-container{display:flex;justify-content:flex-end;position:fixed;width:100%;bottom:0px}.quick-filter-container{display:flex;margin-bottom:.5rem;align-items:center;-webkit-box-align:center}.quick-filter-container div{width:18px;height:18px;margin-right:var(--chakra-space-3);border-radius:50%;background:var(--chakra-colors-transparent);border-width:2px;border-style:solid;-o-border-image:initial;border-image:initial;cursor:pointer}.quick-filter-container .circle-red{border-color:var(--chakra-colors-red-500)}.quick-filter-container .circle-red:hover{background-color:var(--chakra-colors-red-300)}.quick-filter-container .circle-blue{border-color:var(--chakra-colors-blue-500)}.quick-filter-container .circle-blue:hover{background-color:var(--chakra-colors-blue-300)}.quick-filter-container .circle-cyan{border-color:var(--chakra-colors-cyan-500)}.quick-filter-container .circle-cyan:hover{background-color:var(--chakra-colors-cyan-300)}.quick-filter-container .circle-green{border-color:var(--chakra-colors-green-500)}.quick-filter-container .circle-green:hover{background-color:var(--chakra-colors-green-300)}.quick-filter-container .circle-teal{border-color:var(--chakra-colors-teal-500)}.quick-filter-container .circle-teal:hover{background-color:var(--chakra-colors-teal-300)}.quick-filter-container .circle-orange{border-color:var(--chakra-colors-orange-500)}.quick-filter-container .circle-orange:hover{background-color:var(--chakra-colors-orange-300)}.quick-filter-container .circle-yellow{border-color:var(--chakra-colors-yellow-500)}.quick-filter-container .circle-yellow:hover{background-color:var(--chakra-colors-yellow-300)}.quick-filter-container .circle-pink{border-color:var(--chakra-colors-pink-500)}.quick-filter-container .circle-pink:hover{background-color:var(--chakra-colors-pink-300)}.quick-filter-container .circle-purple{border-color:var(--chakra-colors-purple-500)}.quick-filter-container .circle-purple:hover{background-color:var(--chakra-colors-purple-300)}.quick-filter-container .circle-gray{border-color:var(--chakra-colors-gray-500)}.quick-filter-container .circle-gray:hover{background-color:var(--chakra-colors-gray-300)}`;
        // document.querySelector("#open-dialog-btn").onclick = () => {createSettingUI(); registerSettingUIEvent();}
        openDialogBtn.onclick = () => {createSettingUI(); registerSettingUIEvent();}
        document.body.appendChild(style);
        document.body.appendChild(openDialogBtn);
    }
    //系統設定UI
    function createSettingUI(){
        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.display = "";
        wrapper.innerHTML = ` <div class="dialog">
        <div class="header">
            <h1>SGO介面優化插件 Ver${VERSION}</h1>
            <div>
                <button id="reset-settings-btn">RESET</button>
                <button id="close-dialog-btn">X</button>
            </div>
        </div>
        <div class="content">
        </div>
        </div>`
        const rowEvent = {
            checkbox: (e) => {
                const element = e.target;
                setObjectValueByRecursiveKey(SETTINGS, element.getAttribute("bind-setting"), element.checked);
                saveSettings();
            },
            colorInput: (e) => {
                const element = e.target;
                const bindSetting = element.getAttribute("bind-setting");
                if(!/^#[0-9a-fA-F]{6}$|transparent/.test(element.value)){
                    element.value = getSettingByKey(bindSetting);
                }
                setObjectValueByRecursiveKey(SETTINGS, bindSetting, element.value);
                element.nextElementSibling.style.color = element.value
                saveSettings();
            },
            numberInput: (e) => {
                const element = e.target;
                const bindSetting = element.getAttribute("bind-setting");
                if(element.value === "" || Number.isNaN(Number(element.value))){
                    element.value = getSettingByKey(bindSetting);
                    return;
                }
                setObjectValueByRecursiveKey(SETTINGS, bindSetting, Number(element.value))
                saveSettings();
            },
            input: (e) => {
                const element = e.target;
                const bindSetting = element.getAttribute("bind-setting");                
                setObjectValueByRecursiveKey(SETTINGS, bindSetting, element.value)
                saveSettings();
            }
        }
        const panel = [
            {
                category: "懶人功能",
                description: "懶人功能的開啟與關閉",
                rows:[
                    {
                        id: "auto-battle-button",
                        type: "checkbox",
                        label: "自動戰鬥按鈕開關",
                        bindSetting: "AUTO.AUTO_BATTLE_BUTTON"
                    },
                    {
                        id: "auto-start-battle",
                        type: "checkbox",
                        label: "趕路結束後自動戰鬥",
                        bindSetting: "AUTO.AUTO_START_BATTLE"
                    },
                    {
                        id: "auto-battle-order-floor",
                        type: "input",
                        label: "自動戰鬥上限樓層",
                        bindSetting: "AUTO.AUTO_BATTLE_ORDER_FLOOR"
                    },
                    {
                        id: "auto-run-order-floor",
                        type: "input",
                        label: "自動趕路上限樓層",
                        bindSetting: "AUTO.AUTO_RUN_ORDER_FLOOR"
                    },
                    {
                        id: "auto-stop-hp",
                        type: "input",
                        label: "血量低於多少停止自動戰鬥",
                        bindSetting: "AUTO.AUTO_STOP_HP"
                    },
                    {
                        id: "auto-use-sp",
                        type: "input",
                        label: "體力低於多少自動喝水",
                        bindSetting: "AUTO.AUTO_USE_SP"
                    },
                    {
                        id: "auto-input-recipe",
                        type: "checkbox",
                        label: "自動輸入配方",
                        bindSetting: "AUTO.AUTO_INPUT_RECIPE"
                    },
                    {
                        id: "auto-click-recipe-start",
                        type: "checkbox",
                        label: "按下配方後自動鍛造",
                        bindSetting: "AUTO.AUTO_CLICK_RECIPE_START"
                    },
                    {
                        id: "auto-finish-forge",
                        type: "checkbox",
                        label: "自動按完成鍛造",
                        bindSetting: "AUTO.AUTO_FINISH_FORGE"
                    },
                    {
                        id: "auto-forge-loop",
                        type: "checkbox",
                        label: "完成後自動再次鍛造",
                        bindSetting: "AUTO.AUTO_FORGE_LOOP"
                    }
                ]
            },
            {
                category: "一般",
                description: "一般功能的開啟與關閉",
                rows:[
                    {
                        id: "bad-button",
                        type: "checkbox",
                        label: "禁用搶劫與超渡按鍵",
                        bindSetting: "GENERAL.DISABLE_BAD_BUTTON"
                    },
                    {
                        id: "rest-button",
                        type: "checkbox",
                        label: "隱藏狩獵頁面的休息按鍵",
                        bindSetting: "GENERAL.HIDE_REST_BUTTON"
                    },
                    {
                        id: "disable-true-stats",
                        type: "checkbox",
                        label: "關閉原始素質顯示",
                        bindSetting: "GENERAL.DISABLE_TRUE_STATS"
                    },
                    {
                        id: "disable-market-function",
                        type: "checkbox",
                        label: "關閉市場黑名單與關注名單功能",
                        bindSetting: "GENERAL.DISABLE_MARKET_FUNCTION"
                    },
                    {
                        id: "hunt-status-percent",
                        type: "checkbox",
                        label: "顯示血量、體力百分比(僅在狩獵頁有效)",
                        bindSetting: "GENERAL.HUNT_STATUS_PERCENT"
                    },
                    {
                        id: "show-exp-bar",
                        type: "checkbox",
                        label: "顯示經驗條",
                        bindSetting: "GENERAL.SHOW_EXP_BAR"
                    },
                    {
                        id: "exp-bar-fill-background-image-url",
                        type: "input",
                        label: "自訂經驗條填充圖片",
                        bindSetting: "GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL"
                    },
                    {
                        id: "background-image-url",
                        type: "input",
                        label: "自訂背景圖片",
                        bindSetting: "GENERAL.BACKGROUND_IMAGE_URL"
                    }
                ]
            },
            {
                category: "手機",
                description: "手機特別功能開啟與關閉",
                mobile: true,
                rows:[
                    {
                        id: "mobile-wrap-navbar",
                        type: "checkbox",
                        label: "導覽列換行",
                        bindSetting: "GENERAL.MOBILE_WRAP_NAVBAR"
                    },
                    {
                        id: "mobile-hunt-report",
                        type: "checkbox",
                        label: "精簡狩獵結果",
                        bindSetting: "GENERAL.MOBILE_HUNT_REPORT"
                    }
                ]
            },
            {
                category: "顏色",
                description: "設定插件各種提示的顏色",
                rows:[
                    {
                        id: "tips",
                        type: "colorInput",
                        label: "一般提示",
                        bindSetting: "COLOR.TIPS"
                    },
                    {
                        id: "warning",
                        type: "colorInput",
                        label: "紅色警告",
                        bindSetting: "COLOR.WARNING"
                    },
                    {
                        id: "true-stats",
                        type: "colorInput",
                        label: "裝備原始素質",
                        bindSetting: "COLOR.TRUE_STATS"
                    },
                    {
                        id: "zone-level",
                        type: "colorInput",
                        label: "到達新樓層",
                        bindSetting: "COLOR.ZONE_LEVEL"
                    },
                    {
                        id: "market-watch",
                        type: "colorInput",
                        label: "關注中的賣家外框顏色",
                        bindSetting: "COLOR.MARKET_WATCH"
                    },
                    {
                        id: "exp-bar-background",
                        type: "colorInput",
                        label: "經驗條背景色",
                        bindSetting: "COLOR.EXP_BAR_BACKGROUND"
                    },
                    {
                        id: "exp-bar-fill-color",
                        type: "colorInput",
                        label: "經驗條填充色",
                        bindSetting: "COLOR.EXP_BAR_FILL"
                    },
                    {
                        id: "exp-bar-font",
                        type: "colorInput",
                        label: "經驗條字體顏色",
                        bindSetting: "COLOR.EXP_BAR_FONT"
                    }
                ]
            },
            {
                category: "警示",
                description: "設定警示功能的數值",
                rows:[
                    {
                        id: "equipment",
                        type: "numberInput",
                        label: "裝備耐久低於(數值)",
                        bindSetting: "WARNING.EQUIPMENT"
                    },
                    {
                        id: "hp",
                        type: "numberInput",
                        label: "血量單次耗損(百分比)",
                        bindSetting: "WARNING.HP"
                    },
                    {
                        id: "sp",
                        type: "numberInput",
                        label: "體力低於(數值)",
                        bindSetting: "WARNING.SP"
                    }
                ]
            },
            {
                category: "市場",
                description: "刪除市場的關注名單與黑名單<BR>新增請至市場點擊訂單下方即可新增",
                rows:[
                    {
                        id: "watch-list",
                        type: "table",
                        label: "關注名單",
                        header: "名字",
                        bindSetting: "MARKET.WATCH_LIST"
                    },
                    {
                        id: "black-list",
                        type: "table",
                        label: "黑名單",
                        header: "名字",
                        bindSetting: "MARKET.BLACK_LIST"
                    }
                ]
            }
        ]
        function createRow(rowDiv, rowData){
            const type = {
                checkbox: () => {
                    rowDiv.innerHTML =  `
                        <input type="checkbox" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                        <label for="${rowData.id}">${rowData.label}</label>
                    `
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.checked = getSettingByKey(rowData.bindSetting);
                    mainElement.onchange = rowEvent[rowData.type]
                },
                input: () => {
                    rowDiv.innerHTML =  `
                        <label for="${rowData.id}">${rowData.label}</label>
                        <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                    `
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.value = getSettingByKey(rowData.bindSetting);
                    mainElement.onchange = rowEvent[rowData.type]
                },
                numberInput: () => {
                    rowDiv.innerHTML =  `
                        <label for="${rowData.id}">${rowData.label}</label>
                        <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                    `
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.value = getSettingByKey(rowData.bindSetting);
                    mainElement.onchange = rowEvent[rowData.type]
                },
                colorInput: () => {
                    rowDiv.innerHTML =  `
                        <label for="${rowData.id}">${rowData.label}</label>
                        <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                        <p>我是顏文字</p>
                    `
                    const mainElement = rowDiv.querySelector(`#${rowData.id}`);
                    mainElement.value = getSettingByKey(rowData.bindSetting);
                    rowDiv.querySelector("p").style.color = getSettingByKey(rowData.bindSetting);
                    mainElement.onchange = rowEvent[rowData.type]
                },
                table: () => {
                    const tableData = getSettingByKey(rowData.bindSetting);
                    let gridRowHTML = "";
                    if(!tableData.length){
                        gridRowHTML = `
                        <div class="grid-row">
                            <label>空</label>
                        </div>`
                    }else{
                        tableData.forEach(name => {
                            const div = document.createElement("div");
                            div.innerHTML = `
                                <label>${name}</label>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="19" height="19" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            `
                            div.className = "grid-row"

                            const deleteButton = document.createElement("button");
                            deleteButton.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="19" height="19" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>`
                            gridRowHTML += div.outerHTML;
                        });
                    }
                    rowDiv.innerHTML =  `
                        <label>${rowData.label}</label>
                        <div class="grid" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                            <div class="grid-row-header">${rowData.header}</div>
                            ${gridRowHTML}
                        </div>`
                }
            }
            type[rowData.type]();
        }
        const content = wrapper.querySelector(".content");
        panel.forEach(panel => {
            if(panel.mobile && !isMobileDevice()) return;
            const panelDiv = document.createElement("div");
            panelDiv.className = "panel";
            panelDiv.innerHTML = `
                <div class="panel-header">
                    <span>${panel.category}</span>
                </div>
                <div class="panel-body">
                    <p class="description">${panel.description}</p>
                </div>
            `
            const panelBody = panelDiv.querySelector(".panel-body");
            panel.rows.forEach(row => {
                const rowDiv = document.createElement("div");
                rowDiv.className = row.type === "table" ? "row table" : "row";
                createRow(rowDiv, row);

                panelBody.appendChild(rowDiv);
            });
            content.appendChild(panelDiv);
        });


        document.body.appendChild(wrapper);
    }

    function createExpBar() {
        const expContainer = document.createElement("div");
        expContainer.className = "exp-container";
        expContainer.innerHTML = `
        <div style="margin-right: 1rem;z-index: 1;" id="exp-bar-level-label"></div>
        <div style="margin-right: 1rem;z-index: 1;" id="exp-bar-exp-label"></div>
        <div id="exp-bar"></div>
        <div id="exp-bar-fill"></div>
        `
        // const expBar = document.createElement("div");
        // const expBarFill = document.createElement("div");

        // expBar.id = "exp-bar"
        // expBarFill.id = "exp-bar-fill"
        
        // document.body.appendChild(expBar)
        document.body.appendChild(expContainer)
    }

    function registerSettingUIEvent(){
        // document.querySelector("#open-dialog-btn").onclick = () => {document.querySelector(".wrapper").style.display = ""}
        // document.querySelector("#close-dialog-btn").onclick = () => {document.querySelector(".wrapper").style.display = "none"}
        document.querySelector("#close-dialog-btn").onclick = () => {document.querySelector(".wrapper").remove()}
        document.querySelectorAll(".grid-row > button").forEach(btn => {
            btn.onclick = (e) => {
                const grid = e.currentTarget.parentElement.parentElement;
                const name = e.currentTarget.parentElement.querySelector("label").textContent
                const bindSetting = grid.getAttribute("bind-setting")
                const tableList = getSettingByKey(bindSetting);
                setObjectValueByRecursiveKey(SETTINGS, bindSetting, tableList.filter(row => row !== name));
                saveSettings();

                e.currentTarget.parentElement.remove();
                if(grid.querySelectorAll(`.grid-row`).length === 0) {
                    const spaceGridRow = document.createElement("div");
                    spaceGridRow.innerHTML = "<label>空</label>"
                    spaceGridRow.className = "grid-row";
                    grid.appendChild(spaceGridRow);
                }
            }
        });
        document.querySelector("#reset-settings-btn").onclick = () => {
            SETTINGS = structuredClone(DEFAULT_SETTINGS);
            saveSettings();
            registerSettingUIEvent();
        };
        document.querySelector(".wrapper").onclick = (e) => {
            // if(e.target.className === "wrapper") e.target.style.display = "none";
            if(e.target.className === "wrapper") e.target.remove();
        }


    }

    function loadForgeLog(){
        if (localStorage[FORGE_STORAGE_NAME]) {
            try{
                return JSON.parse(localStorage[FORGE_STORAGE_NAME]);
            }catch(e){}
        }
        return {};
    }

    function saveForgeLog(){
        localStorage[FORGE_STORAGE_NAME] = JSON.stringify(FORGE_LOG);
    }


    function loadSettings() {
        if (localStorage[STORAGE_NAME]) {
            try{
                return JSON.parse(localStorage[STORAGE_NAME]);
            }catch(e){}
        }
        return structuredClone(DEFAULT_SETTINGS);
    }

    function saveSettings() {
        localStorage[STORAGE_NAME] = JSON.stringify(SETTINGS);
    }

    function getObjectValueByRecursiveKey(obj, recursiveKey) {
        const keys = recursiveKey.split(".");
        let tempObj = obj;
        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            if(tempObj[key] === undefined) {
                // tempObj = null;
                return  null;
            }
            tempObj = tempObj[key]
        }
        // keys.forEach(key => {

        // });
        return tempObj
    }
    function setObjectValueByRecursiveKey(obj, recursiveKey, value) {
        const keys = recursiveKey.split(".");
        const lastKey = keys.pop();
        let tempObj = obj;
        keys.forEach(key => {
            if(tempObj[key] === undefined || typeof tempObj[key] !== "object") tempObj[key] = {}
            tempObj = tempObj[key]
        });
        tempObj[lastKey] = value;
        return obj
    }
    function getSettingByKey(key) {
        //檢查是否有新的類別設定或缺少類別設定
        if(key.split(".").length === 1){
            Object.keys(DEFAULT_SETTINGS).forEach(classKey => {
                // if(getObjectValueByRecursiveKey(SETTINGS, `${key}.${k}`) !== undefined) return;
                // setObjectValueByRecursiveKey(SETTINGS, `${key}.${k}`, DEFAULT_SETTINGS[key][k])
                // SETTINGS[key][k] = DEFAULT_SETTINGS[key][k];

                if(SETTINGS[classKey] !== undefined) return;
                SETTINGS[classKey] = structuredClone(DEFAULT_SETTINGS[classKey])
                saveSettings();
            });
        }
        if(getObjectValueByRecursiveKey(SETTINGS, key) === null) {
            setObjectValueByRecursiveKey(SETTINGS, key, getObjectValueByRecursiveKey(structuredClone(DEFAULT_SETTINGS), key))
            // SETTINGS[key] = getObjectValueByRecursiveKey(structuredClone(DEFAULT_SETTINGS), key)
            saveSettings();
        }else if(key === "recipe" && typeof SETTINGS[key] === 'string'){
            try{
                SETTINGS[key] = JSON.parse(SETTINGS[key]);
            }catch(e){
                SETTINGS[key] = {};
            }
            saveSettings();
        }
        return getObjectValueByRecursiveKey(SETTINGS, key)
    }

    function isMobileDevice() {
        const mobileDevices = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
        for (let i = 0; i < mobileDevices.length; i++) {
            if (navigator.userAgent.match(mobileDevices[i])) {
                return true;
            }
        }
        return false
    }
    /**
     * @returns {{name: string, isNumeric: boolean}[]}
     */
    function getTableColumns(table, tableHeaderClickEvent) {
        const ths = table.querySelectorAll("thead > tr > th");
        const tableColumns = [];
        ths.forEach((th) => {
            const column = {
                name: th.innerText,
                isNumeric: th.getAttribute("data-is-numeric") ? true : false,
            };
            tableColumns.push(column);
            if (tableHeaderClickEvent) th.onclick = tableHeaderClickEvent;
        });

        return tableColumns;
    }
    /**
     * @param {HTMLTableElement} targetColumnName
     * @param {{name: string, isNumeric: boolean}} targetColumn
     * @param {{name: string, isNumeric: boolean}[]} columns
     * @returns {{DOM: HTMLTableRowElement}[]}
     */
    function getTableData(table, targetColumn, columns) {
        const data = [];
        if (!columns) {
            columns = getTableColumns(table);
        }
        const index = columns.findIndex(
            (column) => column.name === targetColumn.name
        );
        if (!!~index === false) return [];

        table.querySelectorAll("tbody > tr[role=row]").forEach((row) => {
            const rowData = {};

            //金錢逗號處理
            const text = row.childNodes[index].innerText.replaceAll(",", "");
            if (targetColumn.name === "耐久") {
                rowData[targetColumn.name] = Number(
                    regexGetValue("([0-9]+) / [0-9]+", text)[0]
                );
            } else {
                rowData[targetColumn.name] = targetColumn.isNumeric
                    ? Number(text)
                    : text;
            }

            rowData["DOM"] = row;
            data.push(rowData);
        });
        return data;
    }
    function regexGetValue(pattern, str) {
        const match = new RegExp(pattern).exec(str);
        if (match) {
            return match.slice(1);
        } else {
            return [];
        }
    }
    function clearObservers() {
        // console.log("clear")
        observers.forEach((observer) => {
            observer.disconnect();
        });
        observers.length = 0;
    }
    function clearTimers() {
        // console.log("clear")
        timers.forEach((timer) => {
            clearInterval(timer);
        });
        timers.length = 0;
    }
    function bindEvent(pathname, timerEvent) {
        const timer = setInterval(() => {
            if (Array.isArray(pathname)) {
                if (
                    pathname.filter((path) => path === location.pathname).length === 0
                ) {
                    clearInterval(timer);
                    return;
                }
            } else {
                if (location.pathname !== pathname) {
                    clearInterval(timer);
                    return;
                }
            }

            timerEvent();
        }, 100);
        timers.push(timer);
    }

    let container;
    let debounce = 0;
    let timer = setInterval(() => {
        container = document.querySelector("#__next");
        if (container) {
            clearInterval(timer);
            createOpenDialogButton();
            if(isMobileDevice() && getSettingByKey("GENERAL.MOBILE_WRAP_NAVBAR")) wrapNavbar()
            if(getSettingByKey("GENERAL.BACKGROUND_IMAGE_URL") !== ""){
                const backgroundImageDiv = document.createElement("div");
                backgroundImageDiv.style.cssText = `
                    background: #fff url(${getSettingByKey("GENERAL.BACKGROUND_IMAGE_URL")}) center center fixed no-repeat;
                    background-size: cover;
                    width: 100%;
                    height: 100%;
                    position: fixed;
                    top: 0;
                    left: 0;
                    opacity: 0.5;
                    pointer-events: none;
                `
                document.body.insertBefore(backgroundImageDiv, document.body.firstChild);
                // document.body.style.background = ``;
                // document.body.style.backgroundSize = "cover";
            }
            // createSettingUI();
            // registerSettingUIEvent();
            loadObserver();
        }else{
            // console.log("test")
        }
    }, 10);

    function loadObserver() {
        const observer = new MutationObserver(function (e) {
            // console.log(e);

            //奇怪的DOM 導致forge UI產生兩次
            if (e.length) {
                let renderDiv = false;
                for(let i = 0; i < e.length; i++){

                    if (
                        (e[i].addedNodes.length && e[i].addedNodes[0].tagName === "DIV") ||
                        (e[i].removedNodes.length && e[i].removedNodes[0].tagName === "DIV")
                    ) {
                        renderDiv = true;
                        // console.log("DOM !!!!", e, location.pathname)
                        // return;
                    }
                }
                if(!renderDiv) return;
            }
            const pathname = location.pathname;
            if (pageScript[pathname]) {
                debounce++;
                setTimeout(() => {
                    debounce--;
                    if (debounce === 0) {
                        //console.log(e);
                        clearObservers();
                        clearTimers();
                        clearSubscribeEvents();

                        pageScript[pathname]();
                    }
                }, 500);
            }
        });
        observer.observe(container, { subtree: false, childList: true });
    }
    // Your code here...
})();
