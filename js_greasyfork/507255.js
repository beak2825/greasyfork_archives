// ==UserScript==
// @name         Mooneycalc-Importer (Multi)
// @namespace    http://tampermonkey.net/
// @version      2.2.9
// @description  脚本基于Mooneycalc-Importer v5.3，增加了组队模拟功能，使用时请手动查看队友装备以获取数据。https://amvoidguy.github.io/MWICombatSimulatorTest/dist/index.html.
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://mooneycalc.vercel.app/*
// @match        https://mooneycalc.netlify.app/*
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/dist/index.html
// @match        https://shykai.github.io/MWICombatSimulatorTest/*
// @match        http://localhost:9000/
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/507255/Mooneycalc-Importer%20%28Multi%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507255/Mooneycalc-Importer%20%28Multi%29.meta.js
// ==/UserScript==

//TODO
// 1. 目前只支持当然页面刷新之后的角色 模拟多久升级
// 2. 检验trigger是否工作 找到了trigger数据


(function () {
    "use strict";
    const userLanguage = navigator.language || navigator.userLanguage;
    const isZH = userLanguage.startsWith("zh");
    let profile_arr = new Array();
    const SCRIPT_SIMULATE_TIME = "24";//模拟时长
    //启动前先把所有队友的装备手动看一遍!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    if (document.URL.includes("milkywayidle.com") || document.URL.includes("milkywayidlecn.com")) {
        hookWS();
    } else if (document.URL.includes("mooneycalc")) {
        addImportButton1();
    } else if( document.URL.includes("MWICombatSimulatorTest") || document.URL.includes("localhost")){
        addImportButton4();
        waitSimulationResultsLoading();
    }
    function waitSimulationResultsLoading(){
        const waitForNavi = () => {
            if(document.querySelector(`div.row`)?.querySelectorAll(`div.col-md-5`)?.[2]?.querySelector(`div.row > div.col-md-5`))observeResults();
            else setTimeout(waitSimulationResultsLoading, 200);
        };
        waitForNavi();
    }



    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1) {

                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }

    function handleMessage(message) {
        let obj = JSON.parse(message);
        //const keys = GM_listValues();
        //console.log('keys',keys);
        // keys.forEach(key => { GM_deleteValue(key); });
        if (obj && obj.type === "init_character_data") {

            if(GM_getValue("profile_arr"))
            {
                profile_arr = GM_getValue("profile_arr");
            }

            if(!profile_arr.includes(obj.character.name)){
                profile_arr.push(obj.character.name);
            }

            // profile_arr.reverse();
            // console.log("profileArr",profile_arr);
            GM_setValue("profile_arr", profile_arr);
            GM_setValue("profile_" + obj.character.name, message);
            GM_setValue("init_character_data",message);
            const init_client_data = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem('initClientData')));
            if(init_client_data)GM_setValue("init_client_data", init_client_data);

        }else if (obj && obj.type === "new_battle"){
            let newBattleHandler = [];
            obj.players.forEach((player) => {
                newBattleHandler.push(player.name);
            });

            console.log("new_battle",newBattleHandler);

            //以防万一 留一个旧的team battle
            GM_setValue("team_battle", message);

            GM_setValue("team_battle_" + newBattleHandler[0], message);
        }else if (obj && obj.type === "profile_shared"){
            console.log("profile_shared",obj);
            GM_setValue(obj.profile.sharableCharacter.name, message);
            get_sim_json(obj);
        }
        return message;
        }

    function get_sim_json(obj) {
        const checkElem = () => {
            const selectedElement = document.querySelector(`div.SharableProfile_overviewTab__W4dCV`);
            if (selectedElement) {
                clearInterval(timer);
                //获取模拟数据
                let player_name=obj.profile.sharableCharacter.name;
                let exportObj = {};
                    exportObj.player = {};
                    exportObj.player.equipment = [];
                    exportObj.houseRooms = {};
                    //装备
                    for (const key in obj.profile.wearableItemMap) {
                        const item = obj.profile.wearableItemMap[key];
                        exportObj.player.equipment.push({
                            itemLocationHrid: item.itemLocationHrid,
                            itemHrid: item.itemHrid,
                            enhancementLevel: item.enhancementLevel,
                        });
                    }
                    //别人房子
                    for (const house of Object.values(obj.profile.characterHouseRoomMap)) {
                        exportObj.houseRooms[house.houseRoomHrid] = house.level;
                    }
                    //技能等级
                    for (const skill of obj.profile.characterSkills) {
                        if (skill.skillHrid.includes("stamina")) {
                            exportObj.player.staminaLevel = skill.level;
                        } else if (skill.skillHrid.includes("intelligence")) {
                            exportObj.player.intelligenceLevel = skill.level;
                        } else if (skill.skillHrid.includes("attack")) {
                            exportObj.player.attackLevel = skill.level;
                        } else if (skill.skillHrid.includes("power")) {
                            exportObj.player.powerLevel = skill.level;
                        } else if (skill.skillHrid.includes("defense")) {
                            exportObj.player.defenseLevel = skill.level;
                        } else if (skill.skillHrid.includes("ranged")) {
                            exportObj.player.rangedLevel = skill.level;
                        } else if (skill.skillHrid.includes("magic")) {
                            exportObj.player.magicLevel = skill.level;
                        } else if (skill.skillHrid.includes("melee")) {
                            exportObj.player.meleeLevel = skill.level;
                        }
                    }
                    //战斗技能等级
                exportObj.abilities = [
                    {
                        abilityHrid: "",
                        level: "1",
                    },
                    {
                        abilityHrid: "",
                        level: "1",
                    },
                    {
                        abilityHrid: "",
                        level: "1",
                    },
                    {
                        abilityHrid: "",
                        level: "1",
                    },
                    {
                        abilityHrid: "",
                        level: "1",
                    },
                ];
                let clientObj = GM_getValue("init_client_data");
                let normalAbillityIndex = 1;
                for (const ability of obj.profile.equippedAbilities) {
                if (ability && clientObj.abilityDetailMap[ability.abilityHrid].isSpecialAbility) {
                    exportObj.abilities[0] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                    };
                } else if (ability) {
                    exportObj.abilities[normalAbillityIndex++] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                    };
                }
            }
                //吃喝
                exportObj.food={};
                exportObj.drinks={};
                exportObj.food["/action_types/combat"] = [];
                exportObj.drinks["/action_types/combat"] = [];
                let weapon=obj.profile.wearableItemMap["/item_locations/main_hand"]?.itemHrid||obj.profile.wearableItemMap["/item_locations/two_hand"]?.itemHrid;
                if(weapon.includes("shooter")||weapon.includes("bow")){
                    //远程
                    // xp,超远,暴击
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/wisdom_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/super_ranged_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/critical_coffee"
                    });
                    // 2红1蓝
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/spaceberry_donut"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/spaceberry_cake"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/star_fruit_yogurt"
                    });
                }else if (weapon.includes("boomstick")||weapon.includes("staff")){
                    //法师
                    //xp,超魔,吟唱
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/wisdom_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/super_magic_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/channeling_coffee"
                    });
                    // 1红2蓝
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/spaceberry_cake"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/star_fruit_gummy"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/star_fruit_yogurt"
                    });
                }else if (weapon.includes("bulwark")){
                    //双手盾 精暮光
                    //xp,超防,超耐   xp,超智,幸运
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/wisdom_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/super_defense_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/super_stamina_coffee"
                    });
                    // 2红1蓝
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/spaceberry_donut"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/spaceberry_cake"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/star_fruit_yogurt"
                    });
                }else{
                    //战士
                    //xp,超力,迅捷
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/wisdom_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/super_melee_coffee"
                    });
                    exportObj.drinks["/action_types/combat"].push({
                        itemHrid:"/items/swiftness_coffee"
                    });
                    // 2红1蓝
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/spaceberry_donut"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/spaceberry_cake"
                    });
                    exportObj.food["/action_types/combat"].push({
                        itemHrid:"/items/star_fruit_yogurt"
                    });
                }
                //队内检测
                let team_data = GM_getValue("team_battle", "");
                let team_obj = JSON.parse(team_data);
                if(team_obj){
                    for(const team_member of team_obj.players){
                        if(team_member.name==player_name){
                            for(const food_or_drink of team_member.combatConsumables){
                                if(food_or_drink.itemHrid.includes('coffee')){
                                    exportObj.drinks["/action_types/combat"].push({
                                        itemHrid:food_or_drink.itemHrid,
                                    });
                                }else{
                                    exportObj.food["/action_types/combat"].push({
                                        itemHrid:food_or_drink.itemHrid,
                                    });
                                }
                            }
                        }
                    }
                }
                //我不知道有什么用，以防万一写一下，和原版保持一致
                exportObj.food["/action_types/combat"].push({
                    itemHrid:"",
                });
                exportObj.drinks["/action_types/combat"].push({
                    itemHrid:"",
                });

                let sim_json_value=JSON.stringify(exportObj);
                //按钮粘贴
                let button = document.createElement("button");
                selectedElement.appendChild(button);
                button.textContent = "获取模拟器导入数据";
                button.style.borderRadius = '5px';
                button.style.height = '30px';
                button.style.backgroundColor = '#4357AF';
                button.style.color = 'white';
                button.style.boxShadow = 'none';
                button.style.border = '0px';
                button.onclick = function () {
                    navigator.clipboard.writeText(sim_json_value);
                    button.textContent = "导入数据已粘贴到剪切板";
                    return false;
                };
                    return false;
                };
            };
        let timer = setInterval(checkElem, 200);
    }

    function addImportButton1() {
        const checkElem = () => {
            const selectedElement = document.querySelector(`div[role="tablist"]`);
            if (selectedElement) {
                clearInterval(timer);
                console.log("Mooneycalc-Importer: Found elem");
                let button = document.createElement("button");
                selectedElement.parentNode.insertBefore(button, selectedElement.nextSibling);
                button.textContent = isZH
                    ? "导入人物数据 (左边的市场里可以改价差,设置里可启用茶)"
                    : "Import character settings (Refresh game page to update character settings)";
                button.style.backgroundColor = "green";
                button.style.padding = "5px";
                button.onclick = function () {
                    console.log("Mooneycalc-Importer: Button onclick");
                    importData1(button);
                    return false;
                };
            }
        };
        let timer = setInterval(checkElem, 200);
    }

    async function importData1(button) {
        let data = GM_getValue("init_character_data");
        let obj = JSON.parse(data);

        if (!obj || !obj.characterSkills || !obj.currentTimestamp) {
            button.textContent = isZH ? "错误：没有人物数据" : "Error: no character settings found";
            button.textContent += "init_character_data";
            return;
        }

        let ls = constructMooneycalcLocalStorage(obj);
        localStorage.setItem("settings", ls);

        let timestamp = new Date(obj.currentTimestamp).getTime();
        let now = new Date().getTime();
        button.textContent = isZH
            ? "已导入，人物数据更新时间：" + timeReadable(now - timestamp) + " 前"
            : "Imported, updated " + timeReadable(now - timestamp) + " ago";

        await new Promise((r) => setTimeout(r, 500));
        location.reload();
    }

    function constructMooneycalcLocalStorage(obj) {
        const ls = localStorage.getItem("settings");
        let lsObj = JSON.parse(ls);

        if (!lsObj) {
            lsObj = {};
        }

        // 人物技能等级
        lsObj.state.settings.levels = {};
        for (const skill of obj.characterSkills) {
            lsObj.state.settings.levels[skill.skillHrid] = skill.level;
        }

        // 社区全局buff
        lsObj.state.settings.communityBuffs = {};
        for (const buff of obj.communityBuffs) {
            lsObj.state.settings.communityBuffs[buff.hrid] = buff.level;
        }

        // 装备 & 装备强化等级
        lsObj.state.settings.equipment = {};
        lsObj.state.settings.equipmentLevels = {};
        for (const item of obj.characterItems) {
            lsObj.state.settings.equipment[item.itemLocationHrid.replace("item_locations", "equipment_types")] = item.itemHrid;
            lsObj.state.settings.equipmentLevels[item.itemLocationHrid.replace("item_locations", "equipment_types")] = item.enhancementLevel;
        }

        // 房子
        lsObj.state.settings.houseRooms = {};
        for (const house of Object.values(obj.characterHouseRoomMap)) {
            lsObj.state.settings.houseRooms[house.houseRoomHrid] = house.level;
        }

        return JSON.stringify(lsObj);
    }

    function timeReadable(ms) {
        const d = new Date(1000 * Math.round(ms / 1000));
        function pad(i) {
            return ("0" + i).slice(-2);
        }
        let str = d.getUTCHours() + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
        console.log("Mooneycalc-Importer: " + str);
        return str;
    }

    function addImportButton4() {
        const checkElem = () => {
            const selectedElement = document.querySelector(`button#buttonImportExport`);
            if (selectedElement) {
                clearInterval(timer);
                console.log("Mooneycalc-Importer: Found elem");
                let profileArr = GM_getValue("profile_arr");

                generateComboList(profileArr);

                let button = document.createElement("button");
                selectedElement.parentNode.parentElement.parentElement.insertBefore(button, selectedElement.parentElement.parentElement.nextSibling);
                button.textContent = isZH
                    ? "导入人物数据(刷新游戏网页更新人物数据)"
                    : "Import character settings (Refresh game page to update character settings)";
                button.style.backgroundColor = "green";
                button.style.padding = "5px";
                button.onclick = function () {

                    console.log("Mooneycalc-Importer: Button onclick");
                    const getPriceButton = document.querySelector(`button#buttonGetPrices`);
                    if (getPriceButton) {
                        console.log("Click getPriceButton");
                        getPriceButton.click();
                    }

                    let checkedProfile = getSelectedValue()

                    importData4(button,checkedProfile);
                    return false;
                };
            }
        };
        let timer = setInterval(checkElem, 200);
    }

    function getSelectedValue() {
        let select = document.getElementById("profile-combo-container");
        let selectedValue = select.value;
        return selectedValue;
    }

    async function importData4(button,checkedProfile) {
        let playerInfo = JSON.parse(GM_getValue("profile_"+ checkedProfile));

        let playerArr = [];
        if ( playerInfo.partyInfo ) {
            Object.values(playerInfo.partyInfo.partySlotMap).forEach((value,key) => { playerArr.push(playerInfo.partyInfo.sharableCharacterMap[value.characterID].name); });
        }else{
            playerArr.push(playerInfo.character.name)
        }

        let data = GM_getValue("team_battle_" + playerArr[0], "");

        let obj
        if (!data) {
            button.textContent = isZH ? "错误：没有人物数据" : "Error: no character settings found";
            button.textContent += " team_battle_" + playerArr[0];
            return;
        }else{
            obj = JSON.parse(data);
        }

        const jsonObj = constructImportJsonObj_team(obj,checkedProfile);

        for(let i=1;i<=jsonObj.player_number;i++){
            const importInputElem = document.querySelector(`input#inputSetGroupCombatplayer`+i);
            importInputElem.value = JSON.stringify(jsonObj.players[i-1]);

            document.querySelector(`a#player${i}-tab`).textContent = playerArr[i-1];
        }
        document.querySelector(`button#buttonImportSet`).click();

        let timestamp = new Date(obj.combatStartTime).getTime();
        let now = new Date().getTime();
        button.textContent = isZH
            ? "已导入，人物数据更新时间：" + timeReadable(now - timestamp) + " 前"
            : "Imported, updated " + timeReadable(now - timestamp) + " ago";

        if (document.URL.includes(`//amvoidguy.github.io/`)) {
            setTimeout(() => {
                const selectZone = document.querySelector(`select#selectZone`);
                for (let i = 0; i < selectZone.options.length; i++) {
                    if (selectZone.options[i].value == jsonObj.zone) {
                        selectZone.options[i].selected = true;
                        break;
                    }
                }

                const player1Checkbox = document.querySelector(`input#player1.form-check-input.player-checkbox`);
                const player2Checkbox = document.querySelector(`input#player2.form-check-input.player-checkbox`);
                const player3Checkbox = document.querySelector(`input#player3.form-check-input.player-checkbox`);
                switch (jsonObj.player_number) {
                    case 1:
                        player1Checkbox.checked = true;
                        break;
                    case 2:
                        player1Checkbox.checked = true;
                        player2Checkbox.checked = true;
                        break;
                    case 3:
                        player1Checkbox.checked = true;
                        player2Checkbox.checked = true;
                        player3Checkbox.checked = true;
                        break;
                }
                const time_set = document.querySelector(`input#inputSimulationTime`);
                time_set.value=jsonObj.simulationTime
                //无法获取别人的触发器会报错
                const errorModal = document.querySelector('div#errorModal');
                if (errorModal) {
                    errorModal.parentNode.removeChild(errorModal);
                }

                document.querySelector(`button#buttonStartSimulation`).click();
                document.querySelector(`button.btn.btn-secondary`).click();
            }, 500);
        }
    }


    function generateComboList(profileArr) {
        const container = document.getElementById("profile-combo-container");
        if (!container) return;

        if (profileArr.length <= 0) return;
        profileArr.forEach(item => {

            let option = document.createElement("option");
            option.value = item;
            let labelText = item;
            let profile = GM_getValue("profile_"+ item);
            if (!profile) return;
            let playerInfo = JSON.parse(profile);
            let partyMember = [];

            if ( playerInfo?.partyInfo?.partySlotMap ){
                labelText += " Party:";
                Object.values(playerInfo.partyInfo.partySlotMap).forEach((value,key) => { partyMember.push(playerInfo.partyInfo.sharableCharacterMap[value.characterID].name); });
                labelText += partyMember.join(", ");
            }

            option.textContent = labelText;
            container.appendChild(option);
        })
    }


    function constructImportJsonObj_team(obj,checkedProfile) {
        let clientObj = GM_getValue("init_client_data");
        let init_character_obj = JSON.parse(GM_getValue("profile_"+ checkedProfile));
        let exportObj = {};

        exportObj.player_number=obj.players.length;
        exportObj.players = {};

        //看一圈所有人配置
        for(let player_num=0;player_num<obj.players.length;player_num++ ){
             // Levels
            exportObj.players[player_num]={};
            exportObj.players[player_num].player={};
            // Items
            // HouseRooms
            exportObj.players[player_num].player.equipment = [];
            exportObj.players[player_num].houseRooms = {};
            if(obj.players[player_num].character.name==init_character_obj.character.name){
                //自己的装备不用看，直接从init里取
                for (const item of init_character_obj.characterItems) {
                    if (!item.itemLocationHrid.includes("/item_locations/inventory")) {
                        exportObj.players[player_num].player.equipment.push({
                            itemLocationHrid: item.itemLocationHrid,
                            itemHrid: item.itemHrid,
                            enhancementLevel: item.enhancementLevel,
                        });
                    }
                }
                //自己房子
                for (const house of Object.values(init_character_obj.characterHouseRoomMap)) {
                    exportObj.players[player_num].houseRooms[house.houseRoomHrid] = house.level;
                }
                //level
                for (const skill of init_character_obj.characterSkills) {
                    if (skill.skillHrid.includes("stamina")) {
                        exportObj.players[player_num].player.staminaLevel = skill.level;
                    } else if (skill.skillHrid.includes("intelligence")) {
                        exportObj.players[player_num].player.intelligenceLevel = skill.level;
                    } else if (skill.skillHrid.includes("attack")) {
                        exportObj.players[player_num].player.attackLevel = skill.level;
                    } else if (skill.skillHrid.includes("power")) {
                        exportObj.players[player_num].player.powerLevel = skill.level;
                    } else if (skill.skillHrid.includes("defense")) {
                        exportObj.players[player_num].player.defenseLevel = skill.level;
                    } else if (skill.skillHrid.includes("ranged")) {
                        exportObj.players[player_num].player.rangedLevel = skill.level;
                    } else if (skill.skillHrid.includes("magic")) {
                        exportObj.players[player_num].player.magicLevel = skill.level;
                    } else if (skill.skillHrid.includes("melee")) {
                        exportObj.players[player_num].player.meleeLevel = skill.level;
                    }
                }
            }else{
                //手动取装备数据
                let team_mate_str=GM_getValue(obj.players[player_num].character.name, "")
                console.log("team_mate_str",team_mate_str);
                if (!team_mate_str) {
                    alert("请手动查看一下队友装备信息，当前缺失装备信息队友："+obj.players[player_num].character.name);
                //    console.log( "不敢模拟点击，请手动查看一下队友装备信息，当前缺失装备信息队友："+obj.players[player_num].character.name);
                   return;
                }
                let team_mate_obj = JSON.parse(GM_getValue(obj.players[player_num].character.name, ""));
                console.log("team_mate_obj",team_mate_obj);
                for (const key in team_mate_obj.profile.wearableItemMap) {
                    const item = team_mate_obj.profile.wearableItemMap[key];
                    exportObj.players[player_num].player.equipment.push({
                        itemLocationHrid: item.itemLocationHrid,
                        itemHrid: item.itemHrid,
                        enhancementLevel: item.enhancementLevel,
                    });
                }
                //别人房子
                for (const house of Object.values(team_mate_obj.profile.characterHouseRoomMap)) {
                    exportObj.players[player_num].houseRooms[house.houseRoomHrid] = house.level;
                }
                //level
                for (const skill of team_mate_obj.profile.characterSkills) {
                    if (skill.skillHrid.includes("stamina")) {
                        exportObj.players[player_num].player.staminaLevel = skill.level;
                    } else if (skill.skillHrid.includes("intelligence")) {
                        exportObj.players[player_num].player.intelligenceLevel = skill.level;
                    } else if (skill.skillHrid.includes("attack")) {
                        exportObj.players[player_num].player.attackLevel = skill.level;
                    } else if (skill.skillHrid.includes("power")) {
                        exportObj.players[player_num].player.powerLevel = skill.level;
                    } else if (skill.skillHrid.includes("defense")) {
                        exportObj.players[player_num].player.defenseLevel = skill.level;
                    } else if (skill.skillHrid.includes("ranged")) {
                        exportObj.players[player_num].player.rangedLevel = skill.level;
                    } else if (skill.skillHrid.includes("magic")) {
                        exportObj.players[player_num].player.magicLevel = skill.level;
                    } else if (skill.skillHrid.includes("melee")) {
                        exportObj.players[player_num].player.meleeLevel = skill.level;
                    }
                }

                //triggerMap
                if (team_mate_obj.profile.abilityCombatTriggersMap && team_mate_obj.profile.consumableCombatTriggersMap) {
                    exportObj.players[player_num].triggerMap = { ...team_mate_obj.profile.abilityCombatTriggersMap, ...team_mate_obj.profile.consumableCombatTriggersMap };
                }
            }
            exportObj.players[player_num].food={};
            exportObj.players[player_num].drinks={};
            exportObj.players[player_num].food["/action_types/combat"] = [];
            exportObj.players[player_num].drinks["/action_types/combat"] = [];
            for(const food_or_drink of obj.players[player_num].combatConsumables){
                if(food_or_drink.itemHrid.includes('coffee')){
                    exportObj.players[player_num].drinks["/action_types/combat"].push({
                        itemHrid:food_or_drink.itemHrid,
                    });
                }else{
                    exportObj.players[player_num].food["/action_types/combat"].push({
                        itemHrid:food_or_drink.itemHrid,
                    });
                }
            }
            //我不知道有什么用，以防万一写一下，和原版保持一致
            exportObj.players[player_num].food["/action_types/combat"].push({
                itemHrid:"",
            });
            exportObj.players[player_num].drinks["/action_types/combat"].push({
                itemHrid:"",
            });
            // Abilities
            exportObj.players[player_num].abilities = [
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            ];
            let normalAbillityIndex = 1;
            for (const ability of obj.players[player_num].combatAbilities) {
                if (ability && clientObj.abilityDetailMap[ability.abilityHrid].isSpecialAbility) {
                    exportObj.players[player_num].abilities[0] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                    };
                } else if (ability) {
                    exportObj.players[player_num].abilities[normalAbillityIndex++] = {
                        abilityHrid: ability.abilityHrid,
                        level: ability.level,
                    };
                }
            }
            // TriggerMap 获取不了别人的触发器
            if(obj.players[player_num].character.name==init_character_obj.character.name){
                exportObj.players[player_num].triggerMap = { ...init_character_obj.abilityCombatTriggersMap, ...init_character_obj.consumableCombatTriggersMap };
            }


        }
        // Zone
        let hasMap = false;
        for (const action of init_character_obj.characterActions) {
            if (
                action &&
                action.actionHrid.includes("/actions/combat/")
            ) {
                hasMap = true;
                exportObj.zone = action.actionHrid;
                break;
            }
        }
        if (!hasMap) {
            exportObj.zone = "/actions/combat/fly";
        }
        // SimulationTime
        exportObj.simulationTime = SCRIPT_SIMULATE_TIME;
        return exportObj;
    }


    function constructImportJsonObj(obj) {
        let clientObj = GM_getValue("init_client_data");

        let exportObj = {};

        exportObj.player = {};
        // Levels
        for (const skill of obj.characterSkills) {
            if (skill.skillHrid.includes("stamina")) {
                exportObj.player.staminaLevel = skill.level;
            } else if (skill.skillHrid.includes("intelligence")) {
                exportObj.player.intelligenceLevel = skill.level;
            } else if (skill.skillHrid.includes("attack")) {
                exportObj.player.attackLevel = skill.level;
            } else if (skill.skillHrid.includes("power")) {
                exportObj.player.powerLevel = skill.level;
            } else if (skill.skillHrid.includes("defense")) {
                exportObj.player.defenseLevel = skill.level;
            } else if (skill.skillHrid.includes("ranged")) {
                exportObj.player.rangedLevel = skill.level;
            } else if (skill.skillHrid.includes("magic")) {
                exportObj.player.magicLevel = skill.level;
            } else if (skill.skillHrid.includes("melee")) {
                exportObj.player.meleeLevel = skill.level;
            }
        }
        // Items
        exportObj.player.equipment = [];
        for (const item of obj.characterItems) {
            if (!item.itemLocationHrid.includes("/item_locations/inventory")) {
                exportObj.player.equipment.push({
                    itemLocationHrid: item.itemLocationHrid,
                    itemHrid: item.itemHrid,
                    enhancementLevel: item.enhancementLevel,
                });
            }
        }

        // Food
        exportObj.food = {};
        exportObj.food["/action_types/combat"] = [];
        for (const food of obj.actionTypeFoodSlotsMap["/action_types/combat"]) {
            if (food) {
                exportObj.food["/action_types/combat"].push({
                    itemHrid: food.itemHrid,
                });
            } else {
                exportObj.food["/action_types/combat"].push({
                    itemHrid: "",
                });
            }
        }

        // Drinks
        exportObj.drinks = {};
        exportObj.drinks["/action_types/combat"] = [];
        for (const drink of obj.actionTypeDrinkSlotsMap["/action_types/combat"]) {
            if (drink) {
                exportObj.drinks["/action_types/combat"].push({
                    itemHrid: drink.itemHrid,
                });
            } else {
                exportObj.drinks["/action_types/combat"].push({
                    itemHrid: "",
                });
            }
        }

        // Abilities
        exportObj.abilities = [
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
            {
                abilityHrid: "",
                level: "1",
            },
        ];
        let normalAbillityIndex = 1;
        for (const ability of obj.combatUnit.combatAbilities) {
            if (ability && clientObj.abilityDetailMap[ability.abilityHrid].isSpecialAbility) {
                exportObj.abilities[0] = {
                    abilityHrid: ability.abilityHrid,
                    level: ability.level,
                };
            } else if (ability) {
                exportObj.abilities[normalAbillityIndex++] = {
                    abilityHrid: ability.abilityHrid,
                    level: ability.level,
                };
            }
        }

        // TriggerMap
        exportObj.triggerMap = { ...obj.abilityCombatTriggersMap, ...obj.consumableCombatTriggersMap };

        // Zone
        let hasMap = false;
        for (const action of obj.characterActions) {
            if (
                action &&
                action.actionHrid.includes("/actions/combat/") &&
                !clientObj.actionDetailMap[action.actionHrid]?.combatZoneInfo?.isDungeon
            ) {
                hasMap = true;
                exportObj.zone = action.actionHrid;
                break;
            }
        }
        if (!hasMap) {
            exportObj.zone = "/actions/combat/fly";
        }

        // SimulationTime
        exportObj.simulationTime = "24";

        // HouseRooms
        exportObj.houseRooms = {};
        for (const house of Object.values(obj.characterHouseRoomMap)) {
            exportObj.houseRooms[house.houseRoomHrid] = house.level;
        }

        return exportObj;
    }

    async function observeResults() {
        let resultDiv = document.querySelector(`div.row`)?.querySelectorAll(`div.col-md-5`)?.[2]?.querySelector(`div.row > div.col-md-5`);
        if(document.URL.includes("mwisim.github.io")||document.URL.includes("simTest")){
            resultDiv = document.querySelectorAll(`div.row`)?.[1]?.querySelectorAll(`div.col-md-5`)?.[2]?.querySelector(`div.row > div.col-md-5`);
        }
        const deathDiv = document.querySelector(`div#simulationResultPlayerDeaths`);
        const expDiv = document.querySelector(`div#simulationResultExperienceGain`);
        const consumeDiv = document.querySelector(`div#simulationResultConsumablesUsed`);
        deathDiv.style.backgroundColor = "#FFEAE9";
        deathDiv.style.color = "black";
        expDiv.style.backgroundColor = "#CDFFDD";
        expDiv.style.color = "black";
        consumeDiv.style.backgroundColor = "#F0F8FF";
        consumeDiv.style.color = "black";

        let div = document.createElement("div");
        div.id = "tillLevel";
        div.style.backgroundColor = "#FFFFE0";
        div.style.color = "black";
        div.textContent = "";
        resultDiv.append(div);

        new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.addedNodes.length >= 2) {
                    handleResult(mutation.addedNodes, div);
                }
            });
        }).observe(expDiv, { childList: true, subtree: true });
    }

    function handleResult(expNodes, parentDiv) {
        let perHourGainExp = {
            stamina: 0,
            intelligence: 0,
            attack: 0,
            power: 0,
            defense: 0,
            ranged: 0,
            magic: 0,
            melee: 0,
        };
        expNodes.forEach((expNodes) => {
            if (expNodes.textContent.includes("Stamina")||expNodes.textContent.includes("耐力")) {
                perHourGainExp.stamina = Number(expNodes.children[1].textContent);
            } else if (expNodes.textContent.includes("Intelligence")||expNodes.textContent.includes("智力")) {
                perHourGainExp.intelligence = Number(expNodes.children[1].textContent);
            } else if (expNodes.textContent.includes("Attack")||expNodes.textContent.includes("攻击")) {
                perHourGainExp.attack = Number(expNodes.children[1].textContent);
            } else if (expNodes.textContent.includes("Power")||expNodes.textContent.includes("力量")) {
                perHourGainExp.power = Number(expNodes.children[1].textContent);
            } else if (expNodes.textContent.includes("Defense")||expNodes.textContent.includes("防御")) {
                perHourGainExp.defense = Number(expNodes.children[1].textContent);
            } else if (expNodes.textContent.includes("Ranged")||expNodes.textContent.includes("远程")) {
                perHourGainExp.ranged = Number(expNodes.children[1].textContent);
            } else if (expNodes.textContent.includes("Magic")||expNodes.textContent.includes("魔法")) {
                perHourGainExp.magic = Number(expNodes.children[1].textContent);
            } else if (expNodes.textContent.includes("Melee")||expNodes.textContent.includes("近战")) {
                perHourGainExp.melee = Number(expNodes.children[1].textContent);
            }
        });

        let data = GM_getValue("init_character_data");

        let obj = JSON.parse(data);
        if (!obj || !obj.characterSkills || !obj.currentTimestamp) {
            console.error("handleResult no character localstorage");
            return;
        }

        let skillLevels = {};
        for (const skill of obj.characterSkills) {
            if (skill.skillHrid.includes("stamina")) {
                skillLevels.stamina = {};
                skillLevels.stamina.skillName = "Stamina";
                skillLevels.stamina.currentLevel = skill.level;
                skillLevels.stamina.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("intelligence")) {
                skillLevels.intelligence = {};
                skillLevels.intelligence.skillName = "Intelligence";
                skillLevels.intelligence.currentLevel = skill.level;
                skillLevels.intelligence.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("attack")) {
                skillLevels.attack = {};
                skillLevels.attack.skillName = "Attack";
                skillLevels.attack.currentLevel = skill.level;
                skillLevels.attack.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("power")) {
                skillLevels.power = {};
                skillLevels.power.skillName = "Power";
                skillLevels.power.currentLevel = skill.level;
                skillLevels.power.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("defense")) {
                skillLevels.defense = {};
                skillLevels.defense.skillName = "Defense";
                skillLevels.defense.currentLevel = skill.level;
                skillLevels.defense.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("ranged")) {
                skillLevels.ranged = {};
                skillLevels.ranged.skillName = "Ranged";
                skillLevels.ranged.currentLevel = skill.level;
                skillLevels.ranged.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("magic")) {
                skillLevels.magic = {};
                skillLevels.magic.skillName = "Magic";
                skillLevels.magic.currentLevel = skill.level;
                skillLevels.magic.currentExp = skill.experience;
            } else if (skill.skillHrid.includes("melee")) {
                skillLevels.melee = {};
                skillLevels.melee.skillName = "Melee";
                skillLevels.melee.currentLevel = skill.level;
                skillLevels.melee.currentExp = skill.experience;
            }
        }

        const skillNamesInOrder = ["stamina", "intelligence", "attack", "power", "melee", "defense", "ranged", "magic"];
        let hTMLStr = "";
        for (const skill of skillNamesInOrder) {
            if (!skillLevels[skill]) continue;
            hTMLStr += `<div id="${"inputDiv_" + skill}" style="display: flex; justify-content: flex-end">${skillLevels[skill].skillName}${
                isZH ? "到" : " to level "
            }<input id="${"input_" + skill}" type="number" value="${skillLevels[skill].currentLevel + 1}" min="${
                skillLevels[skill].currentLevel + 1
            }" max="200">${isZH ? "级" : ""}</div>`;
        }

        hTMLStr += `<div id="script_afterDays" style="display: flex; justify-content: flex-end"><input id="script_afterDays_input" type="number" value="1" min="0" max="200">${
            isZH ? "天后" : "days after"
        }</div>`;

        hTMLStr += `<div id="needDiv"></div>`;
        hTMLStr += `<div id="needListDiv"></div>`;
        parentDiv.innerHTML = hTMLStr;

        for (const skill of skillNamesInOrder) {
            if (!skillLevels[skill]) continue;
            const skillDiv = parentDiv.querySelector(`div#${"inputDiv_" + skill}`);
            const skillInput = parentDiv.querySelector(`input#${"input_" + skill}`);
            skillInput.onchange = () => {
                calculateTill(skill, skillInput, skillLevels, parentDiv, perHourGainExp);
            };
            skillInput.addEventListener("keyup", function (evt) {
                calculateTill(skill, skillInput, skillLevels, parentDiv, perHourGainExp);
            });
            skillDiv.onclick = () => {
                calculateTill(skill, skillInput, skillLevels, parentDiv, perHourGainExp);
            };
        }

        const daysAfterDiv = parentDiv.querySelector(`div#script_afterDays`);
        const daysAfterInput = parentDiv.querySelector(`input#script_afterDays_input`);
        daysAfterInput.onchange = () => {
            calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder);
        };
        daysAfterInput.addEventListener("keyup", function (evt) {
            calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder);
        });
        daysAfterDiv.onclick = () => {
            calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder);
        };

        // 提取成本和收益
        const expensesSpan = document.querySelector(`span#expensesSpan`);
        const revenueSpan = document.querySelector(`span#revenueSpan`);
        const profitSpan = document.querySelector(`span#profitPreview`);
        const expenseDiv = document.querySelector(`div#script_expense`);
        const revenueDiv = document.querySelector(`div#script_revenue`);
        if (expenseDiv && expenseDiv) {
            expenseDiv.textContent = expensesSpan.parentNode.textContent;
            revenueDiv.textContent = revenueSpan.parentNode.textContent;
        } else {
            profitSpan.parentNode.insertAdjacentHTML(
                "beforeend",
                `<div id="script_expense" style="background-color: #DCDCDC; color: black;">${expensesSpan.parentNode.textContent}</div><div id="script_revenue" style="background-color: #DCDCDC; color: black;">${revenueSpan.parentNode.textContent}</div>`
            );
        }
    }

    function calculateAfterDays(daysAfterInput, skillLevels, parentDiv, perHourGainExp, skillNamesInOrder) {
        const initData_levelExperienceTable = GM_getValue("init_client_data").levelExperienceTable;
        const days = Number(daysAfterInput.value);
        parentDiv.querySelector(`div#needDiv`).textContent = `${isZH ? "" : "After"} ${days} ${isZH ? "天后：" : "days: "}`;
        const listDiv = parentDiv.querySelector(`div#needListDiv`);

        let html = "";
        let resultLevels = {};
        for (const skillName of skillNamesInOrder) {
            for (const skill of Object.values(skillLevels)) {
                if (skill.skillName.toLowerCase() === skillName.toLowerCase()) {
                    const exp = skill.currentExp + perHourGainExp[skill.skillName.toLowerCase()] * days * 24;
                    let level = 1;
                    while (initData_levelExperienceTable[level] < exp) {
                        level++;
                    }
                    level--;
                    const minExpAtLevel = initData_levelExperienceTable[level];
                    const maxExpAtLevel = initData_levelExperienceTable[level + 1] - 1;
                    const expSpanInLevel = maxExpAtLevel - minExpAtLevel;
                    const levelPercentage = Number(((exp - minExpAtLevel) / expSpanInLevel) * 100).toFixed(1);
                    resultLevels[skillName.toLowerCase()] = level;
                    html += `<div>${skill.skillName} ${isZH ? "" : "level"} ${level} ${isZH ? "级" : ""} ${levelPercentage}%</div>`;
                    break;
                }
            }
        }
        const combatLevel =
            0.1 * (resultLevels.stamina + resultLevels.intelligence + resultLevels.defense + resultLevels.attack + Math.max(resultLevels.melee, resultLevels.ranged, resultLevels.magic)) +
            0.5 * Math.max(resultLevels.attack, resultLevels.defense, resultLevels.melee, resultLevels.ranged, resultLevels.magic);
        html += `<div>${isZH ? "战斗等级：" : "Combat level: "} ${combatLevel.toFixed(1)}</div>`;
        listDiv.innerHTML = html;
    }

    function calculateTill(skillName, skillInputElem, skillLevels, parentDiv, perHourGainExp) {
        const initData_levelExperienceTable = GM_getValue("init_client_data").levelExperienceTable;
        const targetLevel = Number(skillInputElem.value);
        parentDiv.querySelector(`div#needDiv`).textContent = `${skillLevels[skillName].skillName} ${isZH ? "到" : "to level"} ${targetLevel} ${
            isZH ? "级 还需：" : " takes: "
        }`;
        const listDiv = parentDiv.querySelector(`div#needListDiv`);

        const currentLevel = Number(skillLevels[skillName].currentLevel);
        const currentExp = Number(skillLevels[skillName].currentExp);
        if (targetLevel > currentLevel && targetLevel <= 200) {
            if (perHourGainExp[skillName] === 0) {
                listDiv.innerHTML = isZH ? "永远" : "Forever";
            } else {
                let needExp = initData_levelExperienceTable[targetLevel] - currentExp;
                let needHours = needExp / perHourGainExp[skillName];
                let html = "";
                html += `<div>[${hoursToReadableString(needHours)}]</div>`;

                const consumeDivs = document.querySelectorAll(`div#simulationResultConsumablesUsed div.row`);
                for (const elem of consumeDivs) {
                    const conName = elem.children[0].textContent;
                    const conPerHour = Number(elem.children[1].textContent);
                    html += `<div>${conName} ${Number(conPerHour * needHours).toFixed(0)}</div>`;
                }

                listDiv.innerHTML = html;
            }
        } else {
            listDiv.innerHTML = isZH ? "输入错误" : "Input error";
        }
    }

    function hoursToReadableString(hours) {
        const sec = hours * 60 * 60;
        if (sec >= 86400) {
            return Number(sec / 86400).toFixed(1) + (isZH ? " 天" : " days");
        }
        const d = new Date(Math.round(sec * 1000));
        function pad(i) {
            return ("0" + i).slice(-2);
        }
        let str = d.getUTCHours() + "h " + pad(d.getUTCMinutes()) + "m " + pad(d.getUTCSeconds()) + "s";
        return str;
    }
})();
