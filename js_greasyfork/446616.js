// ==UserScript==
// @name           hwmSetsMaster
// @author         Tamozhnya1
// @namespace      Tamozhnya1
// @description    Смена фракций. Наборы оружия, навыков, армий и миниартов мага. Билды
// @version        14.3
// @include        *heroeswm.ru/*
// @include        *lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @require        https://update.greasyfork.org/scripts/490927/1360667/Tamozhnya1Lib.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant 		   GM.xmlHttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/446616/hwmSetsMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/446616/hwmSetsMaster.meta.js
// ==/UserScript==

if(!PlayerId) {
    return;
}
const Strings = {
        "ru": {
            Army: "Армия",
            Save: "Сохранить",
            Add: "Добавить",
            AddCurrent: "Добавить текущий",
            SetName: "Наименование набора",
            Delete: "Удалить",
            Talents: "Навыки",
            Inventory: "Оружие",
            RemoveAll: "Снять все",
            EnterJpg: "enter0.jpg",
            SignInTitle: "Войти",
            Castle: "Замок",
            Task: "Задание",
            Apply: "Применить",
            AvailablePoints: "Свободных очков",
            AvailableTalentPoints: "Свободных очков от навыка",
            IncreaseManyPointsTooltip: "Введите число от ${minValue} до ${maxValue}. Нажмите Tab."
        },
        "en": {
            Army: "Army",
            Save: "Save",
            Add: "Add",
            AddCurrent: "Add current",
            SetName: "Set name",
            Delete: "Delete",
            Talents: "Talents",
            Inventory: "Inventory",
            RemoveAll: "Un-equip all",
            EnterJpg: "enter0_eng.jpg",
            SignInTitle: "Sign in",
            Castle: "Castle",
            Task: "Task",
            Apply: "Apply",
            AvailablePoints: "Available points",
            AvailableTalentPoints: "Available talent points",
            IncreaseManyPointsTooltip: "Enter number from ${minValue} to ${maxValue}. Press Tab."
        }
    };
const LocalizedString = Strings[lang];
let Fraction;
getFraction();
const wizardSkillLevel = getWizardSkillLevel();
const miniArtsPowers = [
    [0, 1, 1, 0, 0, 0, 1],
    [0, 2, 1, 0, 1, 0, 2],
    [0, 3, 2, 0, 1, 0, 3],
    [0, 3, 2, 0, 2, 1, 4],
    [0, 4, 3, 1, 2, 1, 5],
    [0, 4, 4, 1, 3, 1, 6],
    [0, 5, 5, 1, 3, 1, 7],
    [0, 6, 6, 1, 4, 2, 8],
    [0, 6, 6, 2, 4, 2, 9],
    [0, 7, 7, 2, 5, 2, 10],
    [0, 8, 8, 2, 5, 2, 11],
    [0, 9, 9, 2, 6, 2, 12],
    [0, 10, 10, 2, 6, 2, 13],
    [0, 11, 11, 2, 6, 2, 14],
    [0, 12, 12, 2, 6, 2, 15],
];
const miniArtsPower = miniArtsPowers[wizardSkillLevel];
const creatures = [
{},
{ imageSource: "https://dcdn2.heroeswm.ru/i/portraits/mastergremlinanip33.png?v=21" },
{ imageSource: "https://dcdn2.heroeswm.ru/i/portraits/obsgargolyanip33.png?v=23" },
{ imageSource: "https://dcdn3.heroeswm.ru/i/portraits/steelgolemanip33.png?v=20" },
{ imageSource: "https://dcdn.heroeswm.ru/i/portraits/archmageanip33.png?v=18" },
{ imageSource: "https://dcdn.heroeswm.ru/i/portraits/djinn_sultananip33.png?v=20" },
{ imageSource: "https://dcdn1.heroeswm.ru/i/portraits/rakshasa_rajaanip33.png?v=23" },
{ imageSource: "https://dcdn3.heroeswm.ru/i/portraits/titananip33.png?v=21" },
];
const miniArtsEffects = [
    { imageSource: "" },
    { imageSource: "//dcdn.heroeswm.ru/i/icons/attr_defense.png?v=1" },
    { imageSource: "//dcdn.heroeswm.ru/i/icons/attr_attack.png?v=1" },
    { imageSource: "//dcdn.heroeswm.ru/i//icons/attr_speed.png?v=1" },
    { imageSource: "//dcdn.heroeswm.ru/i/icons/attr_hit_points.png?v=1" },
    { imageSource: "//dcdn.heroeswm.ru/i/icons/attr_morale.png?v=1" },
    { imageSource: "//dcdn.heroeswm.ru/i/icons/attr_initiative.png?v=1" },
];

//const homeArtsPanelSelector = doc => isNewPersonPage ? doc.querySelector("div#inv_doll_stats") : getParent(doc.querySelector("div.arts_info.shop_art_info"), "table");
const homeArtsPanelSelector = doc => isNewPersonPage ? doc.querySelector("div#inv_doll_stats") : doc.querySelector("body > center table.wb > tbody > tr:nth-child(3) > td > table:nth-child(2)");
const homeStatsPanelSelector = doc => isNewPersonPage ? doc.getElementById("home_css_stats_wrap_div") : getParent(doc.querySelector("img[src*='attr_attack']"), "table", 2);
const homeArmyPanelSelector = doc => isNewPersonPage ? doc.querySelector("div.home_pers_army") : doc.querySelector("center > div > div.cre_creature72").parentNode;
const playerInfoArtsPanelSelector = doc => getParent(doc.querySelector("div[class^='slot']"), "div");
const playerInfoStatsPanelSelector = doc => getParent(doc.querySelector("img[src*='attr_attack']"), "table");
const playerInfoArmyPanelSelector = doc => doc.querySelector("center > div > div.cre_creature72").parentNode;
const playerInfoPerksPanelSelector = doc => getParent(doc.querySelector("a[href^='showperkinfo.php']"), "table", 2);
const mapHuntButtonsPanelSelector = doc => doc.querySelector("div#neut_right_block div.map_buttons_container");
const mapHuntButtons2PanelSelector = doc => doc.querySelector("div#neut_right_block2 div.map_buttons_container");
const mapMercenaryTaskPanelSelector = doc => getParent(doc.querySelector("div#map_right_block_inside > table.wbwhite.rounded_table.map_table_margin center a[href='mercenary_guild.php']"), "center");
const inventoryStatsPanelSelector = doc => doc.querySelector("div.inventory_stats");
const resourcesPath = `${location.protocol}//${location.host.replace("www", "dcdn")}`;

const weaponSetsPreferences = {
    menuTitle: LocalizedString.Inventory,
    menuImage: `${resourcesPath}/i/combat/btn_inventory.png?v=7`,
    setReferencePage: "inventory.php",
    sets: new Array(),
    menuItems: {},
    currentMenuItem: undefined,
    initSetsApplyAction: function() {
        this.sets.length = 0;
        this.sets.push({ number: 0, name: LocalizedString.RemoveAll, method: "GET", url: "/inventory.php?all_off=100" });
        const weaponSets = JSON.parse(getPlayerValue("WeaponSets", "{}"));
        for(const setNumber in weaponSets) {
            this.sets.push({ number: setNumber, name: weaponSets[setNumber], method: "GET", url: `/inventory.php?all_on=${setNumber}` });
        }
    },
    name: "WeaponSet",
    getCurrentSetName: function() { return "WeaponSet"; },
    onPageLoad: function() {
        if(location.pathname == "/inventory.php") {
            const undressDiv = document.querySelector("div[id ='undress_all_div']");
            addSetChangerListener(undressDiv, this, 0);

            const setDivs = document.querySelectorAll("div[set_div_id]"); // Если setDivs.length = 0, то ничего не делаем - мы в заявке на бой
            if(setDivs.length > 0) {
                const weaponSets = {};
                for(const setDiv of setDivs) {
                    const setNumber = setDiv.getAttribute("set_div_id");
                    if(setDiv.hasAttribute("onclick")) {
                        weaponSets[setNumber] = setDiv.innerText;
                        addSetChangerListener(setDiv, this, setNumber);
                    }
                }
                setPlayerValue("WeaponSets", JSON.stringify(weaponSets));
            }
        }
        this.findSetChangersAndAddListener();
    },
    findSetChangersAndAddListener: function() {
        let setRefs = document.querySelectorAll("a[href^='inventory.php?all_off=100']");
        for(const setRef of setRefs) {
            addSetChangerListener(setRef, this, 0);
        }
        setRefs = document.querySelectorAll("a[href*='inventory.php?all_on=']");
        for(const weaponSetReference of setRefs) {
            let setNumber = weaponSetReference.getAttribute("href").split("all_on=")[1];
            addSetChangerListener(weaponSetReference, this, setNumber);
        }
    }
};
const skillSetsPreferences = {
    menuTitle: LocalizedString.Talents,
    menuImage: `${resourcesPath}/i/combat/btn_skills_v3.png?v=7`,
    setReferencePage: "skillwheel.php",
    sets: new Array(),
    menuItems: {},
    currentMenuItem: undefined,
    onPageLoad: function() {
        const setRefs = document.querySelectorAll("a[href^='skillwheel.php?setuserperk']"); // skillwheel.php?setuserperk=1&prace=4&buildid=5 // skillwheel.php?rand=1&setstats=1&param0=20&param1=8&param2=0&param3=2
        const pageSets = {};
        for(const setRef of setRefs) {
            pageSets[setRef.innerHTML] = getUrlParamValue(setRef.href, "buildid");
            addSetChangerListener(setRef, this, parseInt(getUrlParamValue(setRef.href, "buildid")));
        }
        setPlayerFractionValue("SkillSets", JSON.stringify(pageSets));
    },
    initSetsApplyAction: function () {
        const skillSets = JSON.parse(getPlayerFractionValue("SkillSets", "{}"));
        this.sets = Object.keys(skillSets).map(x => { return { number: parseInt(skillSets[x]), name: x, method: "GET", url: `/skillwheel.php?setuserperk=1&prace=${Fraction}&buildid=${skillSets[x]}` }; });
    },
    name: "SkillSet",
    getCurrentSetName: function() { return getFractionKey("SkillSet"); },
};
const armySetsPreferences = {
    menuTitle: LocalizedString.Army,
    menuImage: `${resourcesPath}/i/castle_im/btn_recruit.png`,
    setReferencePage: "army.php",
    sets: new Array(),
    menuItems: {},
    currentMenuItem: undefined,
    setsTable: null,
    name: "ArmySet",
    getCurrentSetName: function() { return getFractionKey("ArmySet"); },
    initSetsApplyAction: function () {
        const armySetsData = JSON.parse(getPlayerFractionValue("ArmySets", "{}"));
        const armySets = Object.keys(armySetsData).map(x => { const data = armySetsData[x].split("|"); return { Id: x, Name: data[0], Army: data.slice(1).map(y => Number(y)) } });
        this.sets = armySets.map(x => { return { number: parseInt(x.Id), name: x.Name, title: x.Army.join("+"), method: "POST", url: "/army_apply.php", data: "set_id=7&" + x.Army.map((x, i) => `countv${i + 1}=${x}`).join("&") }; });
        if(location.pathname == "/army.php") {
            this.drawSetsTable(armySets);
        }
    },
    drawSetsTable: function(armySets) {
        const isInit = this.setsTable ? false : true;
        let container;
        if(isInit) {
            const hwm_for_zoom = document.getElementById("hwm_for_zoom") || document.getElementById("hwm_no_zoom");
            container = document.body;
            if(!isMobileInterface) {
                container = addElement("center", null, hwm_for_zoom);
            }
            this.setsTable = addElement("table", { class: "smithTable", style: `${isMobileInterface ? "margin-left: px;" : ""}` }, container);
        } else {
            this.setsTable.innerHTML = "";
            container = this.setsTable.parentNode;
        }

        const cellWidths = [100, 60, 60, 60, 60, 60, 60, 60, 10, 10];
        for(const cellWidth of cellWidths) {
            this.setsTable.innerHTML += `<col style="width: ${cellWidth}px;" />`;
        }
        this.drawTableHeader();
        for(const armySet of armySets) {
            this.drawSetRow(armySet);
        }
        if(isInit) {
            const saveButton = addElement("input", { type: "button", value: LocalizedString.Save, class: "button-62", style: isMobileInterface ? "margin: 0 0 0 50px;" : "" }, container);
            saveButton.addEventListener("click", this.saveSets);
            const addCurrentButton = addElement("input", { type: "button", value: LocalizedString.AddCurrent, class: "button-62" }, container);
            addCurrentButton.addEventListener("click", function() { armySetsPreferences.drawSetRow(); });
        }
    },
    drawTableHeader: function () {
        if(!this.setsTable) {
            return;
        }
        const units = win.obj;
        //console.log(units)
        const tr = addElement("tr", null, this.setsTable);
        addElement("th", { innerHTML: LocalizedString.SetName.replace(/ /g, "<br>").replace(/-/g, "-<br>") }, tr);
        for(let i = 1; i <= 7; i++) {
            addElement("th", { innerHTML: (units[i]?.name || "").replace(/ /g, "<br>").replace(/-/g, "-<br>"), onClick: `ChangeSlider(event, ${i}, 0);` }, tr);
        }
        addElement("th", { style: "width: 30px;" }, tr);
        addElement("th", { style: "width: 30px;" }, tr);
    },
    drawSetRow: function(armySet) {
        const isNew = armySet ? false : true;
        const units = win.obj;
        //console.log(`armySet: ${armySet}, units: ${units}`);
        //console.log(units.slice(1));
        armySet = armySet || { Id: (new Date()).getTime(), Name: "", Army: [units[1], units[2], units[3], units[4], units[5], units[6], units[7]].map(x => x?.nownumberd || 0) };
        if(!this.setsTable) {
            return;
        }
        const tr = addElement("tr", { setId: armySet.Id }, this.setsTable);
        let td = addElement("td", {}, tr);
        let input = addElement("input", { value: armySet.Name, onfocus: `this.select();`, style: "width: 100%;" }, td);
        for(let i = 0; i < armySet.Army.length; i++) {
            td = addElement("td", {}, tr);
            input = addElement("input", { value: armySet.Army[i], onfocus: `ChangeSlider(event, ${i + 1}, 0); this.select();`, type: "number", style: "min-width: 47px; width: 100%; text-align: right;" }, td);
        }
        td = addElement("td", {}, tr);
        let delButton = addElement("input", { type: "button", value: "🗙", class: "button-62", style: "width: 100%;", title: LocalizedString.Delete }, td);
        delButton.addEventListener("click", this.deleteSet);

        td = addElement("td", {}, tr);
        if(!isNew) {
            let applyButton = addElement("input", { type : "button", value : "▶", class: "button-62", style: "width: 100%;", title : LocalizedString.Apply }, td);
            applyButton.addEventListener("click", function() {
                armySetsPreferences.saveSets();
                const data = armySet.Army.reduce((x, y, i) => `${x}&countv${i + 1}=${y}`, "set_id=7");
                //console.log(data);
                applySet(null, armySetsPreferences, {
                    number: parseInt(armySet.Id),
                    name: armySet.Name,
                    title: armySet.Army.join("+"),
                    method: "POST", url: "/army_apply.php",
                    data: data
                });
            });
        }
    },
    saveSets: function () {
        const rows = Array.from(armySetsPreferences.setsTable.rows).slice(1);
        const armySetsData = rows.reduce((t, x) => ({ ...t, [x.getAttribute("setId")]: Array.from(x.cells).slice(0, 8).map(y => y.firstChild.value).join("|") }), {});
        setPlayerFractionValue("ArmySets", JSON.stringify(armySetsData));
    },
    deleteSet: function () {
        const table = this.parentNode.parentNode.parentNode;
        const row = this.parentNode.parentNode;
        table.removeChild(row);
    },
};
const fractionsPreferences = {
    menuTitle: LocalizedString.Castle,
    menuImage: `${resourcesPath}/i/castle_im/btn_fraction.png`,
    setReferencePage: "castle.php",
    sets: [],
    menuItems: {},
    currentMenuItem: undefined,
    initSetsApplyAction: function() {
        const fractions = JSON.parse(getPlayerValue("Fractions", "{}"));
        this.sets = Object.keys(fractions).map(x => { return { number: fractions[x], name: x, method: "GET", url: `/castle.php?change_clr_to=${fractions[x]}&sign=${getPlayerValue("Sign")}` }; });
    },
    name: "Fraction",
    getCurrentSetName: function() { return "Fraction"; },
    onPageLoad: async function () {
        await this.initCastlesList();
        this.findSetChangersAndAddListener();
    },
    initCastlesList: async function () {
        if(location.pathname == '/castle.php' || !getPlayerValue("Fractions")) {
            const doc = location.pathname == '/castle.php' ? document : await getRequest("/castle.php");
            const fractions = Array.from(doc.querySelectorAll("div.castle_faction_div_inside")).reduce((t, x) => ({...t, [x.getAttribute("hint")]: getUrlParamValue(x.firstChild.href, "show_castle_f") }), {});
            setPlayerValue("Fractions", JSON.stringify(fractions));
            const changeCastleRef = doc.querySelector("div.castle_yes_no_dialog a[href*='castle.php?change_clr_to']");
            if(changeCastleRef) {
                setPlayerValue("Sign", getUrlParamValue(changeCastleRef.href, "sign"));
            }
        }
    },
    findSetChangersAndAddListener: function() {
        const setRefs = document.querySelectorAll("a[href*='castle.php?change_clr_to']");
        for(const setRef of setRefs) {
            addSetChangerListener(setRef, this, getUrlParamValue(setRef.href, "change_clr_to"));
        }
    },
    setChanged: function(newSetNumber) {
        Fraction = newSetNumber;
        setPlayerValue("Fraction", Fraction);
        createMenu();
    }
};
const miniartsPreferences = {
    menuTitle: isEn ? "Mini arts" : "Миниарты",
    menuImage: `${resourcesPath}/i/castle_im/btn_miniart.png`,
    setReferencePage: "magearts.php",
    sets: [],
    menuItems: {},
    currentMenuItem: undefined,
    initSetsApplyAction: function() {
        const setNumbers = GM_listValues().filter(x => x.startsWith("MiniartsSet_") && x.endsWith(PlayerId)).map(x => x.replace("MiniartsSet_", "").replace(new RegExp(`${PlayerId}$`), ""));
        this.sets = setNumbers.map(x => ({ number: x, name: getPlayerValue(`MiniartsSet_${x}`), items: JSON.parse(getPlayerValue(`MiniartsSetItems_${x}`, "[]")) }));
        if(location.pathname == "/magearts.php") {
            this.miniartSetsTableDatabind();
        }
    },
    name: "MiniartsSet",
    getCurrentSetName: function() { return "MiniartsSet"; },
    miniartSetsTableDatabind: async function() {
        if(location.pathname != "/magearts.php") {
            return;
        }
        const buildTable = Array.from(document.querySelectorAll('b')).find(x => x.innerHTML == (isEn ? "Assemble a new mini-artifact." : 'Собрать новый мини-артефакт.'))?.closest("table");
        if(!buildTable) {
            return;
        }
        let miniartSetsTable = document.getElementById("miniartSetsTable");
        if(!miniartSetsTable) {
            miniartSetsTable = addElement('table', { id: "miniartSetsTable", class: `miniartSetsTable ${buildTable.className}` });
            buildTable.insertAdjacentElement("afterend", miniartSetsTable);
            miniartSetsTable.width = buildTable.width;
            miniartSetsTable.align = buildTable.align;
        } else {
            miniartSetsTable.innerHTML = "";
        }
        const currentSet = await this.getCurrentMiniartsSet();
        const currentSetNumber = currentSet.reduce((t, x) => t + `${x.unitNumber}${x.code}`, "");
        const setCodes = GM_listValues().filter(x => x.startsWith("MiniartsSet_") && x.endsWith(PlayerId)).map(x => x.replace("MiniartsSet_", "").replace(new RegExp(`${PlayerId}$`), ""));
        console.log(setCodes);
        const sets = setCodes.map(x => ({ number: x, name: getPlayerValue(`MiniartsSet_${x}`), items: JSON.parse(getPlayerValue(`MiniartsSetItems_${x}`, "[]")) }));
        if(setCodes.find(x => x == currentSetNumber)) {
            setPlayerValue(this.getCurrentSetName(), currentSetNumber);
        } else {
            sets.push({ number: currentSetNumber, name: "", items: currentSet, isNew: true });
        }
        console.log(sets);
        const restriction = Array.from(document.getElementsByTagName('font')).find(x => x.innerHTML == "Вы находитесь в заявке на бой. Ваши действия ограничены!") != null;
        for(const set of sets) {
            const setViewHtml = this.getSetViewHtml(set);
            const row = addElement('tr', { setCode: set.number, class: set.number == currentSetNumber ? "wblight" : "wbwhite" }, miniartSetsTable);
            row.innerHTML = `<td>${setViewHtml}</td>
    <td style="border: 1px solid #5D413A; text-align: center;">
        <input type="text" name="setNameInput" value="${set.name}" placeholder="${isEn ? "Enter set name" : "Введите название набора"}" style="width: 173px;" />
    </td>
    <td style="border: 1px solid #5D413A; text-align: center;">
        <input type="button" value="${isEn ? "Save" : "Сохранить"}" name="saveButton" class="button-62" />
    </td>
    <td style="border: 1px solid #5D413A; text-align: center;">
        <input type="button" value="${isEn ? "Delete" : "Удалить"}" name="deleteButton" class="button-62" ${set.isNew ? "disabled" : ""} />
    </td>`;
            row.querySelector(`input[name=setNameInput]`).addEventListener("change", function(e) { set.name = e.target.value; });
            row.querySelector(`input[name=saveButton]`).addEventListener("click", function(e) { miniartsPreferences.saveMiniartsSet(e, set); });
            row.querySelector(`input[name=deleteButton]`).addEventListener("click", function() { miniartsPreferences.deleteMiniartsSet(set.number); });
        }
        Array.from(document.querySelectorAll("a[href*='magearts.php?sale=1&id=']")).forEach(x => {
            const artId = getUrlParamValue(x.href, "id");//        console.log(`artId: ${artId}`);
            const usedSets = sets.filter(x => x.items.map(y => y.id).includes(artId));
            const isUsed = usedSets.length > 0;
            x.style.color = isUsed ? '#882C08' : '#598808';
            x.title = isUsed ? 'Входит в сеты: ' + usedSets.map(y => y.name).join(", ") : "";

            x.parentNode.parentNode.addEventListener("mouseover", function() {
                Array.from(document.querySelectorAll(`div[artId='${artId}']`)).forEach(x => { x.style.background = "#FFDDDD"; });
            });
            x.parentNode.parentNode.addEventListener("mouseout", function() {
                Array.from(document.querySelectorAll(`div[artId='${artId}']`)).forEach(x => { x.style.background = "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"; });
            });
        });
    },
    getSetViewHtml: function(set) {
        const destructableArts = Array.from(document.querySelectorAll("a[href^='/magearts.php?sale=1&id=']")).map(x => getUrlParamValue(x.href, "id"));//    console.log(destructableArts);
        let viewHtml = "";
        for(let j = 1; j <= 7; j++) {
            const item = set.items.find(x => x.unitNumber == j);
            const creature = creatures[j];
            let miniArtsHtml = "";
            let background = "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)";
            if(item) {
                for(let effectIndex = 0; effectIndex < item.code.length; effectIndex++) {
                    const effectNumber = parseInt(item.code.substr(effectIndex, 1));
                    const miniArtsEffect = miniArtsEffects[effectNumber];
                    miniArtsHtml += `<div style="position: relative; display: inline-block; background-color: lightgreen; width: 20px; height: 20px;">
        <img src="${miniArtsEffect.imageSource}" style="width: 20px; height: 20px;" />
        <div style="position: absolute; right: 0px; bottom: 0px; font-weight: bold; color: #f5c140; text-align: right; text-shadow: 0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000;">${miniArtsPower[effectNumber]}</div>
    </div>`;
                }
                if(!destructableArts.includes(item.id) && location.pathname == "/magearts.php") {
                    background = '#FF9999';
                }
            }
            viewHtml += `<div ${item ? "artId=" + item.id : ""} class="hwm_creature_slider_army1" style="width: 60px; height: 60px; background: ${background};">
        <div class="hwm_recruit_mon_parent1">
            <img src="${creature.imageSource}" style="position: relative; top: 0; left: 0; image-rendering: -webkit-optimize-contrast; width: 60px; height: auto;">
        </div>
        <div style="position: absolute; right: 0px; bottom: 0px;">${miniArtsHtml}</div>
    </div>`;
            }
        return viewHtml;
    },
    saveMiniartsSet: function(e, set) {
        if(!set.name) {
            e.target.closest("tr").querySelector("input[name=setNameInput]").focus();
            return;
        }
        setPlayerValue(`MiniartsSetItems_${set.number}`, JSON.stringify(set.items));
        setPlayerValue(`MiniartsSet_${set.number}`, set.name);
        this.miniartSetsTableDatabind();
    },
    deleteMiniartsSet: function(number) {
        deletePlayerValue(`MiniartsSet_${number}`);
        deletePlayerValue(`MiniartsSetItems_${number}`);
        this.miniartSetsTableDatabind();
    },
    getCurrentMiniartsSet: async function() {
        const unitNames = isEn ? { "Gremlins": 1, "Gremlin engineers": 1, "Gargoyles": 2, "Enchanted gargoyles": 2, "Golems": 3, "Modern golems": 3, "Magi": 4, "Lorekeepers": 4, "Genies": 5, "Senior genies": 5, "Sphynx guardians": 6, "Sphynx warriors": 6, "Giants": 7, "Titans": 7 }
        : { "Гремлины": 1, "Старшие гремлины": 1, "Каменные горгульи": 2, "Обсидиановые горгульи": 2, "Железные големы": 3, "Стальные големы": 3, "Маги": 4, "Архимаги": 4, "Джинны": 5, "Джинны-султаны": 5, "Принцессы ракшас": 6, "Раджи ракшас": 6, "Колоссы": 7, "Титаны": 7 };
        const artProperties = isEn ? { "Defense": 1, "Attack": 2, "Speed": 3, "Health": 4, "Morale": 5, "Initiative": 6 } : { "Защита": 1, "Нападение": 2, "Скорость": 3, "Здоровье": 4, "Боевой дух": 5, "Инициатива": 6 };
        const doc = location.pathname == "/magearts.php" ? document : await getRequest("/magearts.php");
        const dressedArts = Array.from(doc.querySelectorAll("input[type=submit][value=' Ok ']")).map(x => {
            const row = x.closest("tr");
            const maid = row.querySelector("input[type=hidden][name=maid]").value;
            const unitName = row.cells[1].querySelector("b")?.innerText.trimEnd() || ""; //        console.log(unitName)
            const code = Array.from(row.cells[0].querySelectorAll("img")).map(y => artProperties[y.title]).join("");
            return { id: maid, unitNumber: unitNames[unitName], code: code };
        }).filter(x => x.unitNumber);
        //console.log(dressedArts);
        return dressedArts;
    },
    applySet: async function(set) {
        console.log(set);
        const currentSet = await this.getCurrentMiniartsSet();
        for(let i = 1; i <= 7; i++) {
            const currentUnitArt = currentSet.find(x => x.unitNumber == i);
            const newUnitArt = set.items.find(x => x.unitNumber == i);
            if(newUnitArt) {
                if(!currentUnitArt || currentUnitArt.id != newUnitArt.id) {
                    //console.log(`data: dress=1&maid=${newUnitArt.id}&who=${newUnitArt.unitNumber}`);
                    await postRequest("/magearts.php", `dress=1&maid=${newUnitArt.id}&who=${newUnitArt.unitNumber}`);
                }
            } else {
                if(currentUnitArt && !set.items.find(x => x.id == currentUnitArt.id)) {
                    //console.log(`data: dress=1&maid=${currentUnitArt.id}&who=0`);
                    await postRequest("/magearts.php", `dress=1&maid=${currentUnitArt.id}&who=0`);
                }
            }
        }
    },
    menuEnabledCondition: function() { return Fraction == "3"; },
    getTooltip: function(set) { return this.getSetViewHtml(set); }
};

const preferences = [miniartsPreferences, weaponSetsPreferences, skillSetsPreferences, armySetsPreferences, fractionsPreferences];
const dropdownPositions = { bottom: 1, right: 2 };
const dropdownActivateMethods = { hover: 1, click: 2 };

main();
function main() {
    if(isHeartOnPage && Fraction) {
        addStyle(`
.button-62 {
  background: linear-gradient(to bottom right, #E47B8E, #FF9A5A);
  border: 0;
  border-radius: 5px;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 500;
  outline: transparent;
  padding: 0 5px;
  text-align: center;
  text-decoration: none;
  transition: box-shadow .2s ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
}

.button-62:not([disabled]):focus {
  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
}

.button-62:not([disabled]):hover {
  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
}
.button-62:disabled,button[disabled] {
    background: linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%);
}
table.smithTable { 
    width: 100%;
    background: BurlyWood;
    border: 5px solid BurlyWood;
    border-radius: 5px;
    margin-top: 1px;
}
table.smithTable th {
    border: 1px none #f5c137;
    overflow: hidden;
    text-align: center;
    font-size: 11px;
}
table.smithTable td {
    border: 1px none #f5c137;
    overflow: hidden;
    text-align: center;
}
table.smithTable tr:nth-child(odd) {
  background: Wheat;
}
table.smithTable tr:nth-child(even) {
  background: white;
}
.waiting {
    cursor: wait;
}
.not-allowed {
    cursor: not-allowed;
}
.hwm_creature_slider_army1 {
  font-size: 100%;
  width: 60px;
  max-width: 60px;
  position: relative;
  display: table-cell;
  letter-spacing: normal;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.hwm_recruit_mon_parent1 {
  padding-top: 5%;
  position: relative;
  top: 0;
  left: 0;
}
.hwm_recruit_mon_parent1 img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
table.miniartSetsTable {

}
table.miniartSetsTable td {
    border: '1px solid #5D413A',
	text-align: "center"
}
.miniartsMenuContainer {
    position: absolute;
    z-index: 150;
    text-align: left;
    background: #6b6b69;
    color: #f5c137;
    border: 1px solid #f5c137;
    padding: 2px 5px;
    font-weight: bold;
}
.miniartsMenuContainer div {
    cursor: pointer;
}
`);
        //updateOldData();
        for(const preference of preferences) {
            if(preference.onPageLoad) {
                preference.onPageLoad();
            }
        }
        createMenu();
        window.addEventListener("resize", function() { createMenu(true); });
        if(isMobileDevice) {
            window.addEventListener("click", function(e) {
                const closestDropdown = e.target.closest("div[name$=Dropdown]");
                if(!closestDropdown) {
                    [...document.querySelectorAll("div[name$=Dropdown]")].forEach(x => x.style.display = "none");
                }
                const closestExpandable = e.target.closest("div[id$=_expandable]");
                if(!closestExpandable) {
                    [...document.querySelectorAll("div[id$=_expandable]")].forEach(x => x.style.display = "none");
                }
                const closestBreadcrumb = e.target.closest("div#breadcrumbs");
                if(!closestBreadcrumb) {
                    [...document.querySelectorAll("div#breadcrumbs li.subnav ul")].forEach(y => y.style.display = "none");
                }
            });
            [...document.querySelectorAll("div#breadcrumbs")].forEach(x => x.addEventListener("touchstart", function(e) {
                [...document.querySelectorAll("div#breadcrumbs li.subnav ul")].forEach(y => y.style.display = "none");
                this.querySelector("li.subnav ul").style.display = "block";
                this.querySelector("li.subnav ul").style.zIndex = "100";
            }));
        }
        const menuPanel = document.querySelector("div#hwm_header") || document.querySelector("#main_top_table") || document.querySelector("body > table");
        const homeRef = menuPanel.querySelector("a[href='home.php']");
        const menuAnchor = isNewInterface ? homeRef.parentNode : getParent(homeRef, "table", 3);
        const menuContainer = menuAnchor.parentNode;
        observe(menuContainer, function() { createMenu(true); });
        
        drowSkillChangers();
        if(location.pathname == '/home.php' && isNewPersonPage) {
            observe(document.querySelector("div#home_css_stats_wrap_div"), drowSkillChangers);
        }
    }
}
function updateOldData() {
    const fractionNumbers = [1, 101, 2, 102, 3, 103, 4, 104, 5, 105, 205, 6, 106, 7, 107, 8, 108, 9, 10];
    for(const fractionNumber of fractionNumbers) {
        //deletePlayerFractionValue("SkillSets", fractionNumber);
        const skillSetsOld = getValue(`SkillSets${PlayerId}Fraction${fractionNumber}`);
        const skillSets = getPlayerFractionValue("SkillSets", undefined, fractionNumber);
        // if(fractionNumber == 8) {
            // console.log(`fractionNumber: ${fractionNumber}, skillSetsOld: ${skillSetsOld}, skillSets: ${skillSets}, CurrentSkillSet: ${getValue(`CurrentSkillSet${PlayerId}Fraction${fractionNumber}`)}`);
        // }
        if(skillSetsOld && !skillSets) {
            setPlayerFractionValue("SkillSets", skillSetsOld, fractionNumber);
            setPlayerFractionValue("SkillSet", getValue(`CurrentSkillSet${PlayerId}Fraction${fractionNumber}`), fractionNumber);
        }
        //deletePlayerFractionValue("ArmySets", fractionNumber);
        const armySetsOld = getValue(`ArmySets${PlayerId}Fraction${fractionNumber}`);
        const armySets = getPlayerFractionValue("ArmySets", undefined, fractionNumber);
        // if(fractionNumber == 8) {
            // console.log(`fractionNumber: ${fractionNumber}, armySetsOld: ${armySetsOld}, armySets: ${armySets}, ArmySet: ${getValue(`ArmySet${PlayerId}Fraction${fractionNumber}`)}`);
        // }
        if(armySetsOld && !armySets) {
            setPlayerFractionValue("ArmySets", armySetsOld, fractionNumber);
            setPlayerFractionValue("ArmySet", getValue(`ArmySet${PlayerId}Fraction${fractionNumber}`), fractionNumber);
        }
        // if(fractionNumber == 8) {
            // console.log(`ArmySet: ${getPlayerFractionValue("ArmySet", undefined, fractionNumber)}`);
        // }
    }
}
function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas")); // re-use canvas object for better performance
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}
function getCssStyle(element, prop) { return window.getComputedStyle(element, null).getPropertyValue(prop); }
function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
    return `${fontWeight} ${fontSize} ${fontFamily}`;
}
function createMenu(isResize) {
    const menuPanel = document.querySelector("div#hwm_header") || document.querySelector("#main_top_table") || document.querySelector("body > table");
    if(!menuPanel) {
        armySetsPreferences.initSetsApplyAction();
        return;
    }
    const setsMenuPosition = getPlayerBool("ShowMenyAtRight") ? "right" : "left"; //const setsMenuPosition = isNewInterface && isMobileDevice || getPlayerBool("ShowMenyAtRight") ? "right" : "left";
    const homeRef = menuPanel.querySelector("a[href='home.php']");
    const framesRef = menuPanel.querySelector("a[href='frames.php']");
    const menuAnchor = setsMenuPosition == "left" ? (isNewInterface ? homeRef.parentNode : getParent(homeRef, "table", 3)) : (isNewInterface ? framesRef.parentNode : getParent(framesRef, "table", 3));
    if(!menuAnchor) {
        return;
    }
    const menuContainer = menuAnchor.parentNode;
    const menuAnchorStyle = window.getComputedStyle(menuAnchor);
    const menuContainerStyle = window.getComputedStyle(menuContainer);//    console.log(menuContainerStyle);
    if(!isNewInterface) {
        menuContainer.style.position = "relative";
    }
    const marginTop = menuAnchorStyle.marginTop;
    const superSets = JSON.parse(getPlayerValue("SuperSets", "[]"));
    const menuContainerRect = menuContainer.getBoundingClientRect();
    const anchorRect = menuAnchor.getBoundingClientRect();
    //console.log(anchorRect);
    const borderWidth = 0;//isNewInterface ? 0 : 2;
    const menuItemHeight = anchorRect.height - borderWidth * 2;
    const menuItemLineHeight = menuItemHeight - borderWidth;
    const foreColor = "#f5c137";
    const backgroundColor = isNewInterface ? "linear-gradient(to top, #09203f 0%, #537895 100%)" : (document.querySelector("img[src*='i/top_ny']") ? "#003399" : "#6b6b69");
    const boxShadow = isNewInterface ? "box-shadow: inset 0 0 0 1px #e2b77d, inset 0 0 4px rgba(0,0,0,.5), inset 0 -25px 10px rgba(0,0,0,.5), 0 1px 7px rgba(0,0,0,.7);" : "box-shadow: inset 0 0 0 1px #e2b77d, inset 0 -12px 10px rgba(0,0,0,.2);";
    const dropdownBoxShadow = isNewInterface ? "box-shadow: inset 0 0 0 1px #e2b77d;" : "box-shadow: inset 0 0 0 1px #e2b77d";
    const border = ""; //isNewInterface ? "" : `border: ${borderWidth}px solid ${foreColor};`;
    const zIndex = location.pathname == "/photo_pl_photos.php" ? "0" : "100";
    let currentMenuItemLeft = (setsMenuPosition == "left" ? anchorRect.left : anchorRect.right) - menuContainerRect.left;
    if(!isNewInterface) {
        currentMenuItemLeft -= setsMenuPosition == "left" ? 4 : -4; //setsMenuPosition == "left" ? (anchorRect.left - borderWidth - 1) : (anchorRect.right + borderWidth + 1);
    }
    let previousWidth = 0;
    for(let i = preferences.length - 1; i >= 0; i--) {
        const currentPreferences = preferences[i];
        if(currentPreferences.menuEnabledCondition && !currentPreferences.menuEnabledCondition()) {
            continue;
        }
        const mainMenuItemId = `SetsMenuItem${i}`;
        let mainMenuItem = document.getElementById(mainMenuItemId);
        let selectedValueHidden = document.getElementById(`hwmSetsMaster${currentPreferences.name}SelectedValue`);
        if(!mainMenuItem) {
            const menuHeaderStyle = `top: 0px; margin-top: ${marginTop}; min-width: ${menuItemHeight}px; font-size: 9pt; position: absolute; border-radius: 5px; background: ${backgroundColor}; color: ${foreColor}; ${boxShadow} ${border} padding: 0 3px 0 3px; font-weight: bold; text-align: center; z-index: ${zIndex};`;
            //console.log(menuHeaderStyle);
            mainMenuItem = addElement("div", { id: mainMenuItemId, name: "setsMenuItem", style: menuHeaderStyle }, menuContainer);
            // console.log(mainMenuItem.name)
            // console.log(mainMenuItem.getAttribute("name"))
            let itemContent = currentPreferences.menuTitle;
            let itemTitle = "";
            if(currentPreferences.menuImage && isNewInterface) {
                itemTitle = currentPreferences.menuTitle;
                itemContent = `<img src="${currentPreferences.menuImage}" alt="${itemTitle}" style="height: 90%; margin-top: 2px; border-radius: 50%;">`;
            }
            const itemChild = addElement("a", { innerHTML: itemContent, href: currentPreferences.setReferencePage, style: `color: ${foreColor}; text-decoration: none; vertical-align: middle;` }, mainMenuItem);
            if(itemTitle != "") {
                itemChild.title = itemTitle;
            }
            selectedValueHidden = addElement("div", { id: `hwmSetsMaster${currentPreferences.name}SelectedValue`, hidden: "hidden" }, mainMenuItem);
            if(currentPreferences == fractionsPreferences) {
                createBuildButton();
            }
        }
        mainMenuItem.style.height = `${menuItemHeight}px`;
        mainMenuItem.style.lineHeight = `${menuItemLineHeight}px`;
        
        const mainMenuItemRect = mainMenuItem.getBoundingClientRect();
        currentMenuItemLeft = currentMenuItemLeft + (setsMenuPosition == "left" ? (- mainMenuItemRect.width) : previousWidth);
        previousWidth = mainMenuItemRect.width;
        mainMenuItem.style.left = `${currentMenuItemLeft}px`;

        const menuContent = getOrCreateAndResizeDropdown(i, mainMenuItem, ` z-index: ${zIndex}; list-style-position: inside; color: ${foreColor}; padding: 2px 3px 2px 3px; white-space: nowrap; background: ${backgroundColor}; line-height: normal; ${dropdownBoxShadow}`);
        if(isResize) {
            continue;
        }
        currentPreferences.initSetsApplyAction();
        menuContent.style.display = "block"; // Перед заполнением покажем див для правильного определения его размеров (нужно, если он установлен в none)
        menuContent.innerHTML = '';
        const currentSetNumber = getPlayerValue(currentPreferences.getCurrentSetName(), -1);
        let maxClientWidth = menuContent.clientWidth;
        if(currentPreferences.getTooltip) {
            addElement("div", { id: `${mainMenuItem.id}TooltipContainer`, style: `position: absolute; top: 0px; left: 0px; display: none;`}, menuContent);
        }
        for(const currentSet of currentPreferences.sets) {
            const dropDownMenuItem = addElement("li", { type: "disc", style: "text-align: left;" }, menuContent);
            const currentSetReference = addElement("b", { id: `${currentPreferences.getCurrentSetName()}SetReference${currentSet.number}`, name: `${currentPreferences.getCurrentSetName()}SetReference`, innerHTML: currentSet.name, title: currentSet.title || "", style: `color: ${foreColor}; cursor: pointer; position: relative;` }, dropDownMenuItem);
            currentSetReference.addEventListener("click", function() { applySet(currentSetReference, currentPreferences, currentSet); });
            if(currentPreferences.getTooltip) {
                const tooltip = currentPreferences.getTooltip(currentSet);
                currentSetReference.addEventListener("mouseenter", function(e) {
                    const tooltipContainer = document.getElementById(`${mainMenuItem.id}TooltipContainer`);
                    tooltipContainer.innerHTML = tooltip;
                    tooltipContainer.style.display = "";
                    const anchorRect = tooltipContainer.parentNode.getBoundingClientRect();
                    tooltipContainer.style.left = `${anchorRect.width}px`;
                    tooltipContainer.style.top = `0px`;
                });
                currentSetReference.addEventListener("mouseleave", function() { document.getElementById(`${mainMenuItem.id}TooltipContainer`).style.display = "none"; });
            }
            if(currentSet.number == currentSetNumber) {
                selectedValueHidden.innerHTML = currentSet.number;
                markCurrent(currentSetReference, currentPreferences, currentSet.number);
            }
            currentPreferences.menuItems[currentSet.number] = currentSetReference;

            if(currentPreferences == fractionsPreferences) {
                const fractionBuilds = superSets.filter(x => x.Fraction == currentSet.number);
                if(fractionBuilds.length > 0) {
                    let dropdownActivateMethod = dropdownActivateMethods.hover;
                    let buildsActivator = currentSetReference;
                    if(isMobileDevice) {
                        dropdownActivateMethod = dropdownActivateMethods.click;
                        buildsActivator = addElement("div", { id: `${currentSetReference.id}BuildsActivator`, name: `${currentSetReference.getAttribute("name")}BuildsActivator`,  style: "display: inline-block; cursor: pointer; position: relative;", innerHTML: `<img src="https://dcdn.heroeswm.ru/i/inv_im/btn_expand.svg" style="vertical-align: middle;">` }, currentSetReference);
                    }
                    const superDropdown = getOrCreateAndResizeDropdown(i, buildsActivator, ` z-index: ${Number(zIndex) + 1}; list-style-position: inside; color: ${foreColor}; padding: 2px 3px 2px 3px; white-space: nowrap; background: ${backgroundColor}; ${dropdownBoxShadow}`, dropdownPositions.right, dropdownActivateMethod);
                    for(const build of fractionBuilds) {
                        const superDropdownMenuItem = addElement("li", { type: "disc", style: "text-align: left;" }, superDropdown);
                        const html = `${build.Name} <span id="deleteBuild${build.Id}Button" title='${isEn ? "Delete" : "Удалить"}' style="cursor: pointer; display: inline; color: yellow;">&times;</span>`
                        const superDropdownText = addElement("b", { name: "superDropdownText",  innerHTML: html, style: `color: ${foreColor}; cursor: pointer;` }, superDropdownMenuItem);
                        document.getElementById(`deleteBuild${build.Id}Button`).addEventListener("click", function(e) { e.stopPropagation(); deleteBuild(build.Id, superDropdownMenuItem); });
                        superDropdownMenuItem.addEventListener("click", function(e) { e.stopPropagation(); applyBuild(superDropdownText, build); });
                        if(build.Id == getPlayerValue("SuperSet")) {
                            superDropdownText.style.color = '#0f0';
                        }
                    }
                    superDropdown.style.display = "none";
                }
            }
            let currentWidth = getTextWidth(currentSet.name, getCanvasFont(currentSetReference));
            if(maxClientWidth < currentWidth) {
                maxClientWidth = currentWidth;
            }
        }
        if(currentPreferences == fractionsPreferences) {
            const showAddSuperSetButtonLable = addElement("label", { for: "showAddSuperSetButtonCheckbox", innerText: (isEn ? 'Show button "Create super set"' : 'Показать кнопку "Создать билд"') + "\t" }, menuContent);
            const showAddSuperSetButtonCheckbox = addElement("input", { id: "showAddSuperSetButtonCheckbox", type: "checkbox" }, menuContent);
            showAddSuperSetButtonCheckbox.checked = getPlayerBool("ShowAddSuperSetButton", true);
            showAddSuperSetButtonCheckbox.addEventListener("change", function() { setPlayerValue("ShowAddSuperSetButton", this.checked); });
            
            addElement("br", {}, menuContent);

            const showMenyAtRightLable = addElement("label", { for: "showMenyAtRightCheckbox", innerText: (isEn ? 'Show menu at right' : 'Показать меню справа') + "\t" }, menuContent);
            const showMenyAtRightCheckbox = addElement("input", { id: "showMenyAtRightCheckbox", type: "checkbox" }, menuContent);
            showMenyAtRightCheckbox.checked = getPlayerBool("ShowMenyAtRight");
            showMenyAtRightCheckbox.addEventListener("change", function() { setPlayerValue("ShowMenyAtRight", this.checked); location.reload(); });
        }
        menuContent.style.minWidth = `${(maxClientWidth + 25)}px`;
        menuContent.style.display = "none";
    }
}
function getOrCreateAndResizeDropdown(branchIndex, baseElement, style, dropdownPosition = dropdownPositions.bottom, dropdownActivateMethod = dropdownActivateMethods.hover) {
    const dropdownId = `${baseElement.id}Dropdown`;
    let dropdown = document.getElementById(dropdownId);
    if(!dropdown) {
        const baseElementRect = baseElement.getBoundingClientRect();
        //console.log(baseElement.style);
        //console.log(getComputedStyle(baseElement));
        const borderBottomWidth = !isNaN(parseInt(baseElement.style.borderBottomWidth)) ? parseInt(baseElement.style.borderBottomWidth) : 0;
        let top = baseElementRect.height - borderBottomWidth;
        let left = 0;
        if(dropdownPosition == dropdownPositions.right) {
            top = 0;
            const borderRightWidth = !isNaN(parseInt(baseElement.style.borderRightWidth)) ? parseInt(baseElement.style.borderRightWidth) : 0;
            left = baseElementRect.width - borderRightWidth;
        }
        const dropdownName = `${baseElement.getAttribute("name")}Dropdown`;
        dropdown = addElement("div", { id: dropdownId, name: dropdownName, style: `position: absolute; box-shadow: 3px 3px 5px #333; top: ${top}px; left: ${left}px;` + (style || "") }, baseElement);
        if(dropdownActivateMethod == dropdownActivateMethods.hover) {
            baseElement.addEventListener("mouseenter", function() { dropdown.style.display = "block"; });
            baseElement.addEventListener("mouseleave", function() { dropdown.style.display = "none"; });
            baseElement.addEventListener("touchstart", function() { hideAllDropdown(dropdownName); dropdown.style.display = "block"; });
        } else {
            baseElement.addEventListener("click", function(e) {
                //console.log(e);
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display == "none" ? "block" : "none";
                if(dropdown.style.display == "block") {
                    [...document.querySelectorAll(`div[name='${dropdownName}']`)].filter(x => x.id != dropdownId).forEach(x => x.style.display = "none");
                }
            });
        }
    }
    return dropdown;
}
function hideAllDropdown(dropdownName) { Array.from(document.querySelectorAll(`div[name=${dropdownName}]`)).forEach(x => { x.style.display = "none"; }); }
function createBuildButton() {
    if(!getPlayerBool("ShowAddSuperSetButton", true)) {
        return;
    }
    const fractionsMainMenuItem = document.getElementById(`SetsMenuItem${preferences.indexOf(fractionsPreferences)}`);
    let addBuildButton = document.getElementById("addBuildButton");
    if(addBuildButton) {
        return;
    }
    if(isNewInterface) {
        addBuildButton = addElement("div", { id: "addBuildButton", class: "position_tr", innerHTML: `<img class="NotificationIcon" src="${resourcesPath}/i/new_top/_panelBattles.png" style="width: 16px; height: 16px;" title="${isEn ? "Create build" : "Создать билд"}" >` }, fractionsMainMenuItem);
    } else {
        addBuildButton = addElement("a", { id: "addBuildButton", href: "javascript:void(0);", style: "text-decoration: none; vertical-align: bottom;", innerHTML: `<img src="${resourcesPath}/i/new_top/_panelBattles.png" style="width: 16px; height: 16px; border-radius: 50%;" title="${isEn ? "Create build" : "Создать билд"}" >` }, fractionsMainMenuItem);
    }
    addBuildButton.addEventListener("click", function(e) { e.stopPropagation(); addBuild(); });
}
function addBuild() {
    const superSetName = prompt(isEn ? "Enter build name" : "Введите название билда");
    if(superSetName) {
        //deletePlayerValue("SuperSets");
        const superSets = JSON.parse(getPlayerValue("SuperSets", "[]"));
        superSets.push({
            Id: Date.now(),
            Name: superSetName,
            Fraction: Fraction,
            WeaponSet: getPlayerValue(weaponSetsPreferences.getCurrentSetName(), -1),
            SkillSet: getPlayerValue(skillSetsPreferences.getCurrentSetName(), -1),
            ArmySet: getPlayerValue(armySetsPreferences.getCurrentSetName(), -1),
            MiniartsSet: Fraction == "3" ? getPlayerValue(miniartsPreferences.getCurrentSetName(), -1) : -1
        });
        setPlayerValue("SuperSets", JSON.stringify(superSets));
    }
}
function deleteBuild(id, menuItem) {
    const builds = JSON.parse(getPlayerValue("SuperSets", "[]"));
    const deletingIndex = builds.findIndex(x => x.Id == id);
    if(deletingIndex > -1) {
        builds.splice(deletingIndex, 1);
        setPlayerValue("SuperSets", JSON.stringify(builds));
        if(menuItem) {
            menuItem.remove();
        }
    }
}
async function applyBuild(superDropdownText, build) {
    const sets = [weaponSetsPreferences.name, skillSetsPreferences.name, armySetsPreferences.name];
    const originalText = superDropdownText ? superDropdownText.innerHTML : "";
    if(superDropdownText) {
        superDropdownText.innerHTML += " " + getWheelImage();
    }
    if(build.Fraction != Fraction) {
        await applySet(document.getElementById(`${fractionsPreferences.getCurrentSetName()}SetReference${build.Fraction}`), fractionsPreferences, fractionsPreferences.sets.find(x => x.number == build.Fraction), false);
        sets.push(fractionsPreferences.name);
    }
    await applySet(document.getElementById(`${weaponSetsPreferences.getCurrentSetName()}SetReference${build.WeaponSet}`), weaponSetsPreferences, weaponSetsPreferences.sets.find(x => x.number == build.WeaponSet), false);
    await applySet(document.getElementById(`${skillSetsPreferences.getCurrentSetName()}SetReference${build.SkillSet}`), skillSetsPreferences, skillSetsPreferences.sets.find(x => x.number == build.SkillSet), false);
    await applySet(document.getElementById(`${armySetsPreferences.getCurrentSetName()}SetReference${build.ArmySet}`), armySetsPreferences, armySetsPreferences.sets.find(x => x.number == build.ArmySet), false);
    if(build.Fraction == "3") {
        await applySet(document.getElementById(`${miniartsPreferences.getCurrentSetName()}SetReference${build.MiniartsSet}`), miniartsPreferences, miniartsPreferences.sets.find(x => x.number == build.MiniartsSet), false);
    }
    await updatePanels(sets);
    setPlayerValue("SuperSet", build.Id);
    if(superDropdownText) {
        Array.from(document.querySelectorAll("b[name=superDropdownText]")).forEach(x => x.style.color = "#f5c137");
        superDropdownText.innerHTML = originalText;
        superDropdownText.style.color = '#0f0';
    }
}
function markCurrent(selectedMenuItem, currentPreferences, currentSetNumber) {
    setPlayerValue(currentPreferences.getCurrentSetName(), currentSetNumber);
    if(selectedMenuItem) {
        selectedMenuItem.style.color = '#0f0';
        if(currentPreferences.currentMenuItem && currentPreferences.currentMenuItem != selectedMenuItem) {
            currentPreferences.currentMenuItem.style.color = "#f5c137";
        }
        currentPreferences.currentMenuItem = selectedMenuItem;
    }
}
function addSetChangerListener(htmlElement, currentPreferences, setNumber) {
    htmlElement.addEventListener("click", function() { markCurrent(currentPreferences.menuItems[setNumber], currentPreferences, setNumber); });
}
async function applySet(selectedMenuItem, currentPreferences, currentSet, callPageRefreshFunction = true) {
    markCurrent(selectedMenuItem, currentPreferences, currentSet.number);
    const originalText = selectedMenuItem ? selectedMenuItem.innerHTML : "";
    if(selectedMenuItem) {
        selectedMenuItem.innerHTML += " " + getWheelImage();
    }
    if(currentSet.url) {
        if(currentSet.method == "POST") {
            await postRequest(currentSet.url, currentSet.data);
        } else {
            await getRequest(currentSet.url);
        }
    }
    if(currentPreferences.applySet && currentPreferences.applySet.constructor.name === 'AsyncFunction') {
        await currentPreferences.applySet(currentSet);
    }
    if(selectedMenuItem) {
        selectedMenuItem.innerHTML = originalText;
        if(isMobileDevice) {
            selectedMenuItem.parentNode.parentNode.style.display = "none";
        }
    }
    const selectedValueDiv = document.getElementById(`hwmSetsMaster${currentPreferences.name}SelectedValue`);
    if(selectedValueDiv) {
        selectedValueDiv.innerHTML = currentSet.number;
    }
    if(typeof(currentPreferences.setChanged) == "function") {
        await currentPreferences.setChanged(currentSet.number);
    }
    if(callPageRefreshFunction) {
        updatePanels([currentPreferences.name]);
    }
}
function drowSkillChangers() {
    if(location.pathname=='/home.php' && !document.querySelector(`#increaseattackAmountInput`)) {
        let skillsCount = 0;
        let re = new RegExp(isNewPersonPage ? `>${LocalizedString.AvailablePoints}:\\s(\\d+)<` : `<b>${LocalizedString.AvailablePoints}:</b>\\s(\\d+)`);
        const skillsExec = re.exec(document.body.innerHTML);
        if(skillsExec) {
            skillsCount += parseInt(skillsExec[1]);
        }
        re = new RegExp(isNewPersonPage ? `>${LocalizedString.AvailableTalentPoints}:\\s(\\d+)<` : `<b>${LocalizedString.AvailableTalentPoints}:</b>\\s(\\d+)`);
        const perksSkillsExec = re.exec(document.body.innerHTML);
        if(perksSkillsExec) {
            skillsCount += parseInt(perksSkillsExec[1]);
        }
        //console.log(`skillsCount: ${skillsCount}`);
        if(skillsCount == 0) {
            return;
        }
        const skillValueContainers = [];
        if(isNewPersonPage) {
            const container = document.querySelector("div#home_css_stats_wrap_div");
            const inv_stat_dataDivs = container.querySelectorAll("div.inv_stat_data.home_stat_data.show_hint");
            for(const inv_stat_dataDiv of inv_stat_dataDivs) {
                const increaseButton = inv_stat_dataDiv.querySelector("div.home_button2.btn_hover2");
                if(!increaseButton) {
                    continue;
                }
                const skillValueContainer = inv_stat_dataDiv.querySelector("div.inv_stat_text.home_stat_text");
                skillValueContainers.push(skillValueContainer);
            }
        } else {
            const increaseRefs = document.querySelectorAll("a[href^='home.php?increase=']"); //home.php?increase=defence
            for(const increaseRef of increaseRefs) {
                const sklilIncreaseCell = getParent(increaseRef, "td");
                const skillValueContainer = sklilIncreaseCell.previousSibling;
                skillValueContainers.push(skillValueContainer);
            }
        }
        const skillNames = ["attack", "defence", "power", "knowledge"];
        let i = 0;
        for(const skillValueContainer of skillValueContainers) {
            const skillValue = Number((skillValueContainer.querySelector("b") || skillValueContainer).innerText);
            skillValueContainer.innerHTML = "";
            const skill = skillNames[i];
            const increaseAmountInput = addElement("input", { id: `increase${skill}AmountInput`, name: "increaseAmountInput", value: skillValue, type: "number", min: skillValue, max: skillValue + skillsCount, size: 4, onfocus: "this.select();", title: LocalizedString.IncreaseManyPointsTooltip.replace("${minValue}", skillValue + 1).replace("${maxValue}", skillValue + skillsCount) }, skillValueContainer);
            increaseAmountInput.addEventListener("change", function() { const targetValue = Number(increaseAmountInput.value); if(targetValue > skillValue && targetValue <= skillValue + skillsCount) { changeSkill(increaseAmountInput, isNewPersonPage, skill, skillValue, targetValue); } });
            i++;
        }
    }
}
async function changeSkill(increaseAmountInput, isNewPersonPage, skill, currentValue, targetValue) {
    while(currentValue < targetValue) {
        const url = `/home.php?increase=${skill}` + (isNewPersonPage ? `&info=1&js_output=1&rand=${Math.random() * 1000000}` : "");
        const txt = await getRequestText(url, isNewPersonPage ? "text/html; charset=UTF-8" : "text/html; charset=windows-1251");
        currentValue++;
        if(isNewPersonPage) {
            if (txt.substring(0, 7) != 'HCSS_OK') {
                window.location = '/home.php?info';
                return;
            }
            const data = txt.split('@');
            const home_css_stats_wrap_div = document.getElementById('home_css_stats_wrap_div');
            if(data && data[1] && home_css_stats_wrap_div) {
                home_css_stats_wrap_div.innerHTML = data[1];
                if(data.length > 2 && document.getElementById('home_css_mana_count')) {
                    document.getElementById('home_css_mana_count').innerHTML = parseInt(data[2]);
                }
                if(typeof win.hwm_hints_init === 'function') win.hwm_hints_init();
            }
        } else {
            increaseAmountInput.value = currentValue;
        }
    }
    if(!isNewPersonPage) {
        location.reload();
    }
}
function getWheelImage() { return `<img border="0" align="absmiddle" height="11" src="${resourcesPath}/css/loading.gif">`; }
function getFraction() {
    let currentFractionNumber;
    if(location.pathname == '/home.php') {
        // for new home page
        let currentFractionIconContainer = document.querySelector("div.home_css_pl_fract.show_hint");
        if(!currentFractionIconContainer) {
            currentFractionIconContainer = document.querySelector("a[href^='castle.php?change_faction_dialog']");
        }
        if(currentFractionIconContainer) {
            const currentFractionIconImg = currentFractionIconContainer.querySelector("img");
            currentFractionNumber = currentFractionIconImg.src.split("i/f/r")[1].split(".png")[0];
        }
    } else if(location.pathname=='/pl_info.php' && getUrlParamValue(location.href, "id") == PlayerId) {
        const fractionImage = document.querySelector("img[src*='i/f/r']");
        const regExp = new RegExp('\\/i\\/f\\/r(\\d+)\\.png');
        const regExpExec = regExp.exec(fractionImage.src);
        if(regExpExec) {
            currentFractionNumber = regExpExec[1];
        }
    } else if(location.pathname=='/castle.php') {
        const selectedFractionImg = document.querySelector("div.castle_faction_div_inside2 img");
        const selectedFractionImgName = selectedFractionImg.getAttribute("src");
        const selectedFractionNumber = selectedFractionImgName.split("kukla_png/kukla")[1].split(".")[0]; //dcdn.heroeswm.ru/i/kukla_png/kukla5.png

        const fractionsDiv = document.querySelector("div[id='faction_list']");
        if(fractionsDiv.getAttribute("style").includes("display:none;")) {
            currentFractionNumber = selectedFractionNumber;
        }
    }
    if(currentFractionNumber) {
        setPlayerValue("Fraction", currentFractionNumber);
    }
    Fraction = parseInt(getPlayerValue("Fraction"));
}
async function updatePanels(sets) {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") != PlayerId) {
        return;
    }
    let pageReloadNeeded = false;
    let panels = [];
    if(sets.includes(weaponSetsPreferences.name) && ["/home.php", "/inventory.php", "/pl_info.php", "/map.php"].includes(location.pathname)) {
        pageReloadNeeded = true;
        if(location.pathname == '/home.php') {
            pushNew(panels, homeArtsPanelSelector);
            pushNew(panels, homeStatsPanelSelector);
            pageReloadNeeded = false;
        }
        if(location.pathname == '/pl_info.php') {
            if(getUrlParamValue(location.href, "id") == PlayerId) {
                pushNew(panels, playerInfoArtsPanelSelector);
                pushNew(panels, playerInfoStatsPanelSelector);
            }
            pageReloadNeeded = false;
        }
        if(location.pathname == '/map.php') {
            pushNew(panels, mapHuntButtons2PanelSelector);
            pushNew(panels, mapMercenaryTaskPanelSelector);
            pageReloadNeeded = false;
        }
    }
    if(sets.includes(skillSetsPreferences.name) && ["/skillwheel.php", "/pl_info.php", "/home.php", "/inventory.php"].includes(location.pathname)) {
        pageReloadNeeded = true;
        if(location.pathname == '/home.php') {
            pushNew(panels, homeStatsPanelSelector);
            pageReloadNeeded = false;
        }
        if(location.pathname == '/pl_info.php') {
            if(getUrlParamValue(location.href, "id") == PlayerId) {
                pushNew(panels, playerInfoStatsPanelSelector);
                pushNew(panels, playerInfoPerksPanelSelector);
            }
            pageReloadNeeded = false;
        }
        if(location.pathname == '/inventory.php') {
            pushNew(panels, inventoryStatsPanelSelector);
            pageReloadNeeded = false;
        }
    }
    if(sets.includes(armySetsPreferences.name) && ["/home.php", "/army.php", "/pl_info.php"].includes(location.pathname)) {
        pageReloadNeeded = true;
        if(location.pathname == '/home.php') {
            pushNew(panels, homeArmyPanelSelector);
            pageReloadNeeded = false;
        }
        if(location.pathname == '/pl_info.php') {
            if(getUrlParamValue(location.href, "id") == PlayerId) {
                pushNew(panels, playerInfoArmyPanelSelector);
            }
            pageReloadNeeded = false;
        }
    }
    if(sets.includes(fractionsPreferences.name) && ["/home.php", "/army.php", "/pl_info.php", "/castle.php", "/inventory.php", "/skillwheel.php"].includes(location.pathname)) {
        pageReloadNeeded = true;
    }
    if(sets.includes(miniartsPreferences.name) && ["/home.php", "/army.php", "/pl_info.php", "/magearts.php"].includes(location.pathname)) {
        pageReloadNeeded = true;
        if(location.pathname == '/home.php') {
            pushNew(panels, homeArmyPanelSelector);
            pageReloadNeeded = false;
        }
        if(location.pathname == '/pl_info.php') {
            if(getUrlParamValue(location.href, "id") == PlayerId) {
                pushNew(panels, playerInfoArmyPanelSelector);
            }
            pageReloadNeeded = false;
        }
    }
    if(pageReloadNeeded) {
        if(location.pathname == "/army.php") {
            location = "/army.php";
        } else {
            location.reload();
        }
    } else {
        await refreshUpdatePanels(panels);
    }
}
function getWizardSkillLevel() {
    if(location.pathname == "/home.php" || location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        if(isNewPersonPage) {
            const wizardSkillLevelContainer = Array.from(document.querySelectorAll("div.home_inside_margins > div#row")).find(x => x.innerHTML.includes(isEn ? "Wizard" : "Маг"));
            if(wizardSkillLevelContainer) {
                setPlayerValue("WizardSkillLevel", wizardSkillLevelContainer.querySelector("div#bartext > span").innerText);
            }
        } else {
            const wizardSkillLevelExec = new RegExp(`${isEn ? "Wizard" : "Маг"}: (\\d+) \\(`).exec(document.body.innerHTML);
            if(wizardSkillLevelExec) {
                setPlayerValue("WizardSkillLevel", wizardSkillLevelExec[1]);
            }
        }
        //console.log(`WizardSkillLevel: ${parseInt(getPlayerValue("WizardSkillLevel", 0))}`);
    }
    return parseInt(getPlayerValue("WizardSkillLevel", 0));
}

// API
function getPlayerFractionValue(key, defaultValue, fraction = Fraction) { return getPlayerValue(getFractionKey(key, fraction), defaultValue); };
function setPlayerFractionValue(key, value, fraction = Fraction) { setPlayerValue(getFractionKey(key, fraction), value); };
function deletePlayerFractionValue(key, fraction = Fraction) { return deletePlayerValue(getFractionKey(key, fraction)); };
function getFractionKey(key, fraction = Fraction) { return `${key}${fraction}f`; }
