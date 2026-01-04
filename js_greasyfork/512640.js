// ==UserScript==
// @name           hwmLeader
// @namespace      Tamozhnya1
// @description    Гильдия лидеров: предпросмотр наборов; фильтр существ по известности, умениям, заклинаниям, названию; пользовательские наборы; запреты обмена.
// @author         Tamozhnya1
// @version        4.1
// @include        *heroeswm.ru/leader_army_exchange.php*
// @include        *lordswm.com/leader_army_exchange.php*
// @include        *heroeswm.ru/leader_army.php*
// @include        *lordswm.com/leader_army.php*
// @include        *heroeswm.ru/lg_event.php*
// @include        *lordswm.com/lg_event.php*
// @include        *heroeswm.ru/leader_guild.php*
// @include        *lordswm.com/leader_guild.php*
// @include        *heroeswm.ru/home.php*
// @include        *lordswm.com/home.php*
// @include        *heroeswm.ru/war.php*
// @include        *lordswm.com/war.php*
// @include        *heroeswm.ru/leader_ressurect_old.php*
// @include        *lordswm.com/leader_ressurect_old.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant 		   GM.xmlHttpRequest
// @grant 		   GM.notification
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/512640/hwmLeader.user.js
// @updateURL https://update.greasyfork.org/scripts/512640/hwmLeader.meta.js
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
const PlayerId = playerIdMatch ? playerIdMatch[1] : "";
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const win = window.wrappedJSObject || unsafeWindow;
const isHeartOnPage = (document.querySelector("canvas#heart") || document.querySelector("div#heart_js_mobile")) ? true : false;
const isMooving = location.pathname == '/map.php' && !document.getElementById("map_right_block");
const isNewInterface = document.querySelector("div#hwm_header") ? true : false;
const isMobileInterface = document.querySelector("div#btnMenuGlobal") ? true : false;
const isMobileDevice = mobileCheck(); // Там нет мышки
const isNewPersonPage = document.querySelector("div#hwm_no_zoom") ? true : false;

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

if(!PlayerId) {
    return;
}
let playerSign;
let processingResurrect = false;
let stopResurrecting = false;
let localCurrentSelectedUnitIndex = 1;

const reserveTypes = { "0": isEn ? "No reserve" : "Не резервировать", "1": isEn ? "10000 leadership" : "10000 лидерства", "2": isEn ? "8000 leadership" : "8000 лидерства", "3": isEn ? "4000 leadership" : "4000 лидерства", "4": isEn ? "pointed number" : "указанное количество", "5": isEn ? "all units" : "полностью" };
const rarityNames = [isEn ? "All" : "Все", isEn ? "Common" : "Обычные", isEn ? "Uncommon" : "Редкие", isEn ? "Rare" : "Очень редкие", isEn ? "Epic" : "Легендарные", isEn ? "Mythic" : "Мифичиские"];
_NABEG=2;_GN_OTRYAD=5;_GN_MONSTER=7;_GN_NABEGI=8;_GN_ZASHITA=10;_GN_ARMY=12;_MAL_TOUR=14;_THIEF_WAR=16;_SURVIVAL=20;_NEWGROUP=21;
_ELEMENTALS=22;_GNOMES=23;_NEWKZS=24;NEWKZS=24;_NEWKZS_T=25;NEWKZS_T=25;_NEWTHIEF=26;_NEWCARAVAN=27;_NEWGNCARAVAN=29;_SURVIVALGN=28;
_TUNNEL=30;_SEA=32;_HELL=33;_CASTLEWALLS=35;_UNIWAR=36;_DIFFTUR=37;_UNIWARCARAVAN=38;_PVPGUILDTEST=39;_PVPGUILD=40;_BALANCED_EVENT=41;
_NECR_EVENT=42;_NECR_EVENT2=43;_HELLOWEEN=44;_SURVIVAL_GNOM=45;_DEMON_EVENT=46;_DEMON_EVENT2=47;_DEMON_EVENT3=48;_DEMON_EVENT4=49;_PVEDUEL=50;_DEMONVALENTIN=51;
_QUICKTOUR=52;_BARBTE_ATTACK=53;_BARBTE_DEEP=54;_BARBTE_BOSS=55;_TRANSEVENT=56;_STEPEVENT=57;_STEPEVENT2=58;_KZS_PVE=59;_2TUR=60;_RANGER=61;
_PRAET=62;_RANGER_TEST=63;_SUN_EVENT1=64;_SUN_EVENT2=65;_NEWCARAVAN2=66;_23ATTACK=67;_2TU_FAST=68;_SV_ATTACK=69;_KILLER_BOT=70;_SV_DUEL=71;
_SV_WAR=72;_FAST_TEST=73;_TRUE_EVENT=74;_TIKVA_BOT=75;_TIKVA_ATTACK=76;_ELKA_DEFENSE=77;_PPE_EVENT=78;_ALTNECR_EVENT=79;_CLAN_SUR_DEF=80;_CLAN_SUR_ATT=81;
_QUESTWAR=82;_BARBNEW_DEEP=83;_BARBNEW_BOSS=84;_ELKA_RESCUE=85;_REGWAR1=86;_REGWAR2=87;_CLAN_SUR_CAPT=88;_CLAN_SUR_DEF_PVP=89;_TRUE_TOUR=90;_NOOB_DUEL=91;
_ALTMAG_EVENT=92;_ALTELF_EVENT=93;_NEWPORTAL_EVENT=94;_UNIGUILD=95;_PIRATE_EVENT=96;_TOUR_EVENT=97;_PAST_EVENT=98;_GOLD_EVENT=99;_FAST_TEST2=100;_OHOTA_EVENT=101;
_BUNT_EVENT=102;_ZASADA_EVENT=103;_CLAN_NEW_PVP=104;_SURV_DEEP=105;_SURV_DEEP_BOSS=106;_2AND3_EVENT=107;_CASTLE_EVENT=108;_CARAVAN_EVENT=109;_CAMPAIGN_WAR=110;_NY2016=111;
_ALTTE_EVENT=112;_PVP_EVENT=113;_ALTTE2_EVENT=114;_PIRATE_NEW_EVENT=115;_PVP_KR_EVENT=116;_CATCH_EVENT=117;_PVP_DIAGONAL_EVENT=118;_VILLAGE_EVENT=119;_TRAVEL_EVENT=120;_CASTLE_BATTLE2X2=121;
_PVP_BOT=122;_PIRATE_SELF_EVENT=123;_2ZASADA_EVENT=124;_NEWCARAVAN3=125;_ONEDAY_EVENT=126;_CRE_EVENT=127;_GL_EVENT=128;_1ZASADA_EVENT=129;_NYGL2018_EVENT=130;_EGYPT_EVENT=131;
_GL_DWARF_EVENT=132;_NAIM_MAP_EVENT=133;_2BOT_TUR=134;_CRE_SPEC=135;_CRE_INSERT=136;_CRE_TOUR=137;_GNOM_EVENT=138;_MAPHERO_EVENT=138;_NEWCRE_EVENT=139;_NEWOHOTA_EVENT=140;
_2SURVIVAL=141;_ADVENTURE_EVENT=142;_AMBUSHHERO_EVENT=143;_FRACTION_EVENT=144;_PVP_KZS=145;_REAPING_MAP_EVENT=147;
let battleLoadedTimerId;

main();
function main() {
    initUserName();
    getPlayerLevel();
    refreshData();
    advancedExchangesValidation();
    makeSetsHints();
    createMonstersDropRestBattlesInfoPanel();
    if(location.pathname == "/leader_army.php") {
        const apply_div = document.querySelector("div#apply_div");
        if(apply_div) {
            apply_div.addEventListener("click", refreshData);
        }
        const buttonsContainer = document.querySelector("div#buttons_and_army > div.hwm_leader_recruit_buttons");
        const addButton = addElement("div", { class: "home_button2 btn_hover2 hwm_recruit_button", innerHTML: isEn ? "Add" : "Добавить", title: isEn ? "Remember current set" : "Запомнить текущий набор" }, buttonsContainer);
        addButton.addEventListener("click", addCurrentSet);
        //addElement("br", {}, div);
        const div = addElement("center", {}, document.querySelector("center > div[id]"));
        const mainTable = addElement("table", { id: "leaderSetsTable", style: "border: hidden; border-collapse: collapse; vertical-align: bottom;" }, div);
        fillSetsTable();

        //observe(document.querySelector("div#army_block_left"), showUnitsWeight); //observe(document.querySelector("div#army_block_left"), showUnitsWeight, { childList: true, subtree: true, once: true });
        observe(document.querySelector("div#info_content"), showUnitWeight);
        addStyle(`
.hwm_rarity_bookmark_bottom {
  cursor: pointer;
  width: 13.7%;
  height: 16px;
  background-color: #e4e1d1;
  border: 1px solid #b19673;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgb(177, 150, 115);
  border-top: none;
  margin-right: -1px;
  -webkit-border-bottom-left-radius: 6px;
  -webkit-border-bottom-right-radius: 6px;
  -moz-border-radius-bottomleft: 6px;
  -moz-border-radius-bottomright: 6px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.hwm_rarity_bookmark_bottom span {
  text-align: center;
  display: block;
  color: #000;
  text-transform: uppercase;
  font-weight: bolder;
  font-size: 14px;
  padding-top: 0px;
}
`);
        //setTimeout(createUnitFilters, 2000);
        const creature_slider_portraits = document.querySelectorAll("div#cre_top > div.creature_slider_portrait");//        console.log(`win.obj.length: ${win.obj.length}, creature_slider_portraits.length: ${creature_slider_portraits.length}`);
        if(creature_slider_portraits.length > 0) {
            createUnitFilters();
        } else {
            observe(document.querySelector("div#army_block_left"), createUnitFilters, { childList: true, subtree: true, once: true });
        }
        recruitPage();
        // Кнопка сборос всегда видна от Something begins
        const reset_div = document.querySelector('#reset_div');
        reset_div.style.position = "relative";
        const staticResetButtonCheckbox = addElement("input", { id: "staticResetButtonCheckbox", type: "checkbox", title: isEn ? "Static reset button" : "Постоянная кнопка сброса", style: "position: absolute; right: 1px; bottom: 1px;" }, reset_div);
        staticResetButtonCheckbox.checked = getPlayerBool("staticResetButton");
        staticResetButtonCheckbox.addEventListener("click", function(e) { e.stopPropagation(); setPlayerValue("staticResetButton", this.checked); });

        if(getPlayerBool("staticResetButton")) {
            const observer = new MutationObserver((mutationsList) => {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        reset_div.style.display = "inline";
                    }
                }
            });
            observer.observe(reset_div, { attributes: true, attributeFilter: ['style'] });
        }
    }
    if(location.pathname == "/leader_ressurect_old.php") {
        const playerSignMatch = document.body.innerHTML.match(/sign=(.*?)\"/);
        if(playerSignMatch) {
            playerSign = playerSignMatch[1];
            const container = document.querySelector("#set_mobile_max_width > div:nth-child(2)");
            container.style.textAlign = "center";
            [...container.querySelectorAll("div")].forEach(x => x.style.display = "inline-block");
            const resurrectAllButton = addElement("div", { class: "home_button2 btn_hover2", style: "min-width: 10em; margin: auto; margin-top: 0.5em; margin-bottom: 1em; display: inline-block;", innerHTML: (isEn ? "Resurrect all" : "Воскресить всех") }, container);
            resurrectAllButton.addEventListener("click", resurrectAll);
        }
    }
}
function recruitPage() {
    const leader_now = document.querySelector("div#leader_now");
    const leader_free = document.querySelector("div#leader_free");
    const leader_freeContainer = leader_free.parentNode;
    //console.log(leader_freeContainer);
    leader_now.insertAdjacentElement("afterend", leader_free);
    leader_now.previousElementSibling.innerHTML = isEn ? "Leadership collected / available: " : "Лидерство набрано / доступно: ";
    leader_freeContainer.remove();

    leader_free.insertAdjacentHTML("afterend", `<div id="cre_select_div"><label for="cre_select_input">${isEn ? "Select creature" : "Выбрать существо"}:</label><input id=cre_select_input type=text list=cre_select /><datalist id="cre_select"></datalist></div>`);
    const datalist = document.querySelector("#cre_select");
    const creatures = [...win.obj].map((x, i) => { return x ? { id: i, name: x.name } : null; }).filter(x => x);
    creatures.sort(function (a, b) { if(a.name > b.name) return 1; if (a.name < b.name) return -1; return 0; });
    creatures.forEach(x => datalist.insertAdjacentHTML(`beforeend`, `<option id="cre_choice${x.id}" value="${x.name}"></option>`));
    const cre_select_input = document.querySelector("#cre_select_input");
    cre_select_input.addEventListener('input', findCreaturesByName);
}
function findCreaturesByName(e) {
    //console.log(`e.target.value: ${e.target.value}, e.data: ${e.data}`);
    if(e.target && e.target.value.length < 3 || e.data === null) {
        return;
    }
    const searchValue = e.target.value.toLowerCase();
    let firstOccurrenceIndex;
    let exactSearchedIndex = -1;
    const matchedUnits = [...win.obj].filter((x, i) => {
        if(x && x.name == e.target.value) {
            exactSearchedIndex = i;
        }
        const result = x && x.name.toLowerCase().includes(searchValue);
        if(result && !firstOccurrenceIndex) {
            firstOccurrenceIndex = i;
        }
        return result;
    });
    if(matchedUnits.length != 1 && exactSearchedIndex == -1) {
        return;
    }
    const chosenCreatureIndex = exactSearchedIndex > -1 ? exactSearchedIndex : firstOccurrenceIndex; //[...win.obj].findIndex(x => x && x.name.toLowerCase().includes(searchValue));
    //console.log(`searchValue: ${searchValue}, chosenCreatureIndex: ${chosenCreatureIndex}`);
    if(chosenCreatureIndex > -1) {
        const alreadySelectedUnit = [...win.obj_army].find(x => x && x.link == chosenCreatureIndex);
        if(!alreadySelectedUnit) {
            setCreaturesEmptyOrNextIndex();
            const amount = getAvailableUnitAmount(chosenCreatureIndex);
            win.obj_army[localCurrentSelectedUnitIndex].link = chosenCreatureIndex;
            win.obj_army[localCurrentSelectedUnitIndex].count = Math.min(amount, 1);
        }
        win.show_details(chosenCreatureIndex);
    }
}
function getAvailableUnitAmount(unitIndex) {
    if(unitIndex > 0) {
        const unit = win.obj[unitIndex];
        const busyLeadership = [...win.obj_army].filter(x => x && x.link > 0).reduce((t, x) => { return t + win.obj[x.link].cost * x.count; }, 0);
        const availableLeadership = win.max_leader - busyLeadership;
        const result = Math.min(Math.floor(Math.min(availableLeadership, 8000) / unit.cost), unit.count);
        return result;
    }
    return 0;
}
function setCreaturesEmptyOrNextIndex() {
    const emptyIndex = [...win.obj_army].findIndex(x => x && (x.link == 0 || x.count == 0));
    if(emptyIndex > -1) {
        localCurrentSelectedUnitIndex = emptyIndex;
    } else {
        localCurrentSelectedUnitIndex = localCurrentSelectedUnitIndex < 7 ? (localCurrentSelectedUnitIndex + 1) : 1;
    }
    //console.log(`emptyIndex: ${emptyIndex}, localCurrentSelectedUnitIndex: ${localCurrentSelectedUnitIndex}`);
}
async function resurrectAll(e) {
    //e.target.classList.add("home_disabled");
    if(processingResurrect) {
        stopResurrecting = true;
        return;
    } else {
        processingResurrect = true;
        stopResurrecting = false;
    }
    const resurrectUnits = [...document.querySelectorAll("td>div.home_button2.btn_hover2")].map(x => {
        const row = x.closest("tr");

        const armyInfoRef = row.querySelector("a[href^='army_info.php?name=']");
        const armyName = getUrlParamValue(armyInfoRef.href, "name");
        const armyTitleDiv = armyInfoRef.closest("div.show_hint[hint]");
        const armyTitle = armyTitleDiv?.getAttribute("hint");

        const warRef = row.querySelector("a[href^='war.php?warid=']");
        const warid = getUrlParamValue(warRef.href, "warid");

        return {warid: warid, armyName: armyName, armyTitle: armyTitle};
    });
    //console.log(resurrectUnits);

    let unitNumber = 1;
    for(const resurrectUnit of resurrectUnits) {
        if(stopResurrecting) {
            break;
        }
        e.target.innerHTML = `${isEn ? "Resurrecting" : "Воскрешение"} ${resurrectUnit.armyTitle || resurrectUnit.armyName} ${unitNumber} ${isEn ? "of" : "из"} ${resurrectUnits.length}. ${isEn ? "Break?" : "Остановить?"}`;
        await getRequest(`/leader_guild.php?action=res_old&warid=${resurrectUnit.warid}&sign=${playerSign}&mon_id=${resurrectUnit.armyName}`);
        await sleep(500);
        unitNumber++;
    }
    if(!stopResurrecting) {
        location.reload();
    }
    processingResurrect = false;
    stopResurrecting = false;
    e.target.innerHTML = isEn ? "Resurrect all" : "Воскресить всех";
    //e.target.classList.remove("home_disabled");
}
function showUnitsWeight() {
    Array.from(document.querySelectorAll("div#army_block_left div.reserve_amount")).filter(x => !x.innerHTML.includes("(")).forEach(x => {
        const unitIndex = parseInt(x.id.replace("now_count", ""));
        const unit = win.obj[unitIndex];
        x.innerHTML += ` (${(unit.cost / unit.maxhealth).toFixed(1)})`;
    });
}
function showUnitWeight() {
    const info_contentDiv = document.querySelector("div#info_content");

    const maxhealthDiv = info_contentDiv.querySelector("div#maxhealth");
    const maxhealth = parseInt(maxhealthDiv.innerText.replace(/,/g, ""));

    const leadershipDiv = info_contentDiv.querySelector("div#leadership");
    const leadership = parseInt(leadershipDiv.innerText.replace(/,/g, ""));

    const leadershipDensityDiv = info_contentDiv.querySelector("div#leadershipDensityDiv") || addElement("div", { id: "leadershipDensityDiv", class: "hwm_param_content_half", title: isEn ? "Leadership points per health point" : "Очков лидерства на очко здоровья", innerHTML: `<img src="https://dcdn.heroeswm.ru/i/icons/attr_leadership.png?v=1"><div>${isEn ? "Weight" : "Вес"}</div><div></div><div id=leadershipDensityValueDiv></div>` }, info_contentDiv);
    leadershipDensityDiv.querySelector("div#leadershipDensityValueDiv").innerText = (leadership / maxhealth).toFixed(1);

    const healthDensityDiv = info_contentDiv.querySelector("div#healthDensityDiv") || addElement("div", { id: "healthDensityDiv", class: "hwm_param_content_half", title: isEn ? "Health points multiplied by 1000 per leadership point" : "Очки здоровья умноженные на 1000 на очко лидерства", innerHTML: `<img src="https://dcdn2.heroeswm.ru/i/icons/attr_hit_points.png?v=1"><div>${isEn ? "Weight" : "Вес"}</div><div></div><div id=healthDensityValueDiv></div>` }, info_contentDiv);
    healthDensityDiv.querySelector("div#healthDensityValueDiv").innerText = Math.round(maxhealth * 1000 / leadership);
}
function advancedExchangesValidation() {
    if(location.pathname == "/leader_army_exchange.php") {
        const creatures = getExchangeList(document);
        creatures.forEach(x => {
            const totalLeadershipCell = x.row.cells[1];
            const reserveTypeSelect = addElement("select", { id: `select${x.creatureId}`, title: (isEn ? "Reserve" : "Резервировать"), style: "font-size: 10px; width: 100px;" }, totalLeadershipCell);
            reserveTypeSelect.addEventListener("change", async function(e) {
                setPlayerValue("leaderReserveType" + x.creatureId, this.value);
                toggleExchange(x);
                if(this.value != "4") {
                    reserveNumberInput.value = "";
                    setOrDeleteNumberPlayerValue("leaderReserveNumber" + x.creatureId, "");
                }
                checkExchanges();
            });
            for(const reserveType in reserveTypes) {
                const option = addElement("option", { value: reserveType, innerHTML: reserveTypes[reserveType] }, reserveTypeSelect);
                if(reserveType == getPlayerValue("leaderReserveType" + x.creatureId, "0")) {
                    option.setAttribute("selected", "selected");
                }
            }
            var reserveNumberInput = addElement("input", { value: getPlayerValue("leaderReserveNumber" + x.creatureId, ""), type: "number", id: `number${x.creatureId}`, title: (isEn ? "Reserve number" : "Резервировать количество"), style: "font-size: 10px; width: 50px;" }, totalLeadershipCell);
            reserveNumberInput.addEventListener("change", function(e) {
                setOrDeleteNumberPlayerValue("leaderReserveNumber" + x.creatureId, this.value);
                if(parseInt(this.value) > 0) {
                    reserveTypeSelect.value = "4";
                    setPlayerValue("leaderReserveType" + x.creatureId, "4");
                }
                toggleExchange(x);
            });
            toggleExchange(x);
        });
    }
}
function toggleExchange(rowData) {
    if(rowData.exchangeNumber) {
        const notEnoughPoints = rowData.row.querySelector("font[name=notEnoughPoints]") || addElement("font", { color: "gray", name: "notEnoughPoints", innerText: isEn ? "not enough points" : "недостаточно очков" }, rowData.row.cells[2]);
        const mayExchange = calcMayExchange(rowData);
        notEnoughPoints.style.display = mayExchange ? "none" : "";
        rowData.exchangeButton.style.display = mayExchange ? "" : "none";
    }
}
function makeSetsHints() {
    if(!isMobileDevice && (location.pathname == "/leader_army.php" || location.pathname == "/lg_event.php" || location.pathname == "/leader_guild.php")) {
        const setSelectors = document.querySelectorAll("div[id^='nabor']");        //console.log(setSelectors)
        for(const setSelector of setSelectors) {
            setSelector.addEventListener("mouseenter", function(e) { showSetHint(e, this); });
            setSelector.addEventListener("mouseleave", function(e) { hideSetHint(e, this); });
        }
    }
}
function showSetHint(e, setActivator) {
    //console.log(e);
    const setActivatorId = setActivator.id;
    let hintContainer = document.getElementById(`${setActivatorId}Hint`);
    if(!hintContainer) {
        const setIndex = parseInt(setActivatorId.replace("nabor", ""));
        const leaderArmySets = JSON.parse(getPlayerValue("LeaderArmySets", "[]")).map(x => JSON.parse(x));
        const set = leaderArmySets.find(x => parseInt(x.id) == setIndex);
        if(!set) {
            return;
        }
        //console.log(set);
        const monsterIds = Object.keys(set).filter(x => x.startsWith("monsterId"));
        if(monsterIds.length == 0) {
            return;
        }
        let html = "";
        for(const monsterId of monsterIds) {
            const monsterIndex = parseInt(monsterId.replace("monsterId", ""));
            html += `<div style="width: calc(100%/${set[`unitsAmount`]}); max-width: 50px; position: relative; display: inline-block;">
        <div style="padding-top: 83.3333333%; position: relative; top: 0; left: 0;">
            <img src="https://dcdn.heroeswm.ru/i/army_html/fon_lvl${set[`rarity${monsterIndex}`]}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <img src="${set[`imagePath${monsterIndex}`]}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl${set[`rarity${monsterIndex}`]}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </div>
        <div style="background: 0 0; color: #f5c140; text-align: right; font-size: 120%; position: absolute; right: .2em; bottom: 0; font-weight: 700; text-shadow: 0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000;">${set[`count${monsterIndex}`]}
        </div>
    </div>`;
        }
        hintContainer = addElement("div", { id: `${setActivatorId}Hint`, style: `width: 100%; font-size: 90%; position: fixed;`, innerHTML: html }, document.body);
    }
    hintContainer.style.display = "";
    const setActivatorRec = document.querySelector("div#nabor1").getBoundingClientRect();
    const hintRec = hintContainer.getBoundingClientRect();
    //console.log(hintRec);
    hintContainer.style.left = `${setActivatorRec.left}px`; //e.clientX;
    hintContainer.style.top = `${setActivatorRec.top - hintRec.height - 1}px`; //e.clientY;
}
function hideSetHint(e, setActivator) {
    const setActivatorId = setActivator.id;
    let hintContainer = document.getElementById(`${setActivatorId}Hint`);
    if(hintContainer) {
        hintContainer.style.display = "none";
    }
}
function refreshData() {
    if(location.pathname == "/leader_army.php") {
        if(win.obj_army_set) {
            const leaderArmySets = Array.from(win.obj_army_set).reduce((r, x, i) => {
                if(x && x.length > 0) {
                    const setObj = { id: i, sign: win.hwm_gl_army_pl_sign };
                    let unitsAmount = 0;
                    Array.from(x).forEach((xx, j) => {
                        if(xx) {
                            unitsAmount++;
                            setObj[`monsterId${j}`] = win.obj[xx.link].monster_id;
                            setObj[`imagePath${j}`] = win.obj[xx.link].p_fn;
                            setObj[`rarity${j}`] = win.obj[xx.link].rarity;
                            setObj[`count${j}`] = xx.count;
                        }
                    });
                    setObj.unitsAmount = unitsAmount;
                    r.push(setObj);
                }
                return r;
            }, []);
            //console.log(leaderArmySets);
            setPlayerValue("LeaderArmySets", JSON.stringify(leaderArmySets.map(x => JSON.stringify(x))));
        }
    }
}
function fillSetsTable() {
    const leaderSetsTable = document.getElementById("leaderSetsTable");
    leaderSetsTable.innerHTML = "";
    const sets = JSON.parse(getPlayerValue("LeaderCustomSets", "[]")).map(x => JSON.parse(x));
    for(const set of sets) {
        const monsterIds = Object.keys(set).filter(x => x.startsWith("monsterId"));
        const unitsAmount = monsterIds.length;//      console.log(`unitsAmount: ${unitsAmount}`)
        let totalCost = 0;
        const setRow = addElement("tr", {}, leaderSetsTable);

        const deleteButtonCell = addElement("td", {}, setRow);
        const deleteButton = addElement("span", { innerHTML: "&times;", title: isEn ? "Delete" : "Удалить", style: "cursor: pointer; font-size: 20px; font-weight: bold;" }, deleteButtonCell);
        deleteButton.addEventListener("click", function(e) { deleteSet(e); });

        let html = ""
        for(const monsterIdKey of monsterIds) {
            const position = parseInt(monsterIdKey.replace("monsterId", ""));
            const monsterId = set[monsterIdKey];
            const link = Array.from(win.obj).findIndex(x => x && x.monster_id == monsterId);
            //console.log(`monsterId: ${monsterId}, position: ${position}, link: ${link}`);
            
            let availableAmount = link > -1 ? win.obj[link].count : 0;
            let cost = link > -1 ? win.obj[link].cost : 0;
            
            let amount = parseInt(set[`count${position}`]);
            totalCost += amount * cost;
            const rarity = set[`rarity${position}`];
            let setTrouble = "";
            if(amount * cost > win.max_leader_by_stack) {
                setTrouble += isEn ? `Leadership Limit Exceeded: ${win.max_leader_by_stack}` : `Превышение лимита лидерства: ${win.max_leader_by_stack}`;
            }
            if(availableAmount < amount) {
                setTrouble += isEn ? "Not enough units" : "Не достаточное количество юнитов";
            }
            const imagePath = set[`imagePath${position}`];
            html += `<div style="width: calc(100%/${unitsAmount}); max-width: 50px; position: relative; display: inline-block;">
            <div style="padding-top: 83.3333333%; position: relative; top: 0; left: 0;">
                <img src="https://dcdn.heroeswm.ru/i/army_html/fon_lvl${rarity}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <img src="${imagePath}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl${rarity}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            </div>`
            + (setTrouble ? `<div title="${setTrouble}"; style="position: absolute; top: 0px; left: 1px; text-align: left; font-size: 40px; line-height: 50px; color: red;">!</div>` : '') +
            `<div style="background: 0 0; color: #f5c140; text-align: right; font-size: 120%; position: absolute; right: .2em; bottom: 0; font-weight: 700; text-shadow: 0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000;">${amount}</div></div>`;
        }
        const setCell = addElement("td", { innerHTML: html, style: "width: 350px;" }, setRow);
        setCell.addEventListener("click", function(e) { applySet(e); });
        if(totalCost > win.max_leader) {
            deleteButton.style.color = 'red';
        }
    }
}
function deleteSet(e) {
    const row = getParent(e.target, "tr");
    const sets = JSON.parse(getPlayerValue("LeaderCustomSets", "[]")).map(x => JSON.parse(x));
    sets.splice(row.rowIndex, 1);
    setPlayerValue("LeaderCustomSets", JSON.stringify(sets.map(x => JSON.stringify(x))));
    row.remove();
}
function addCurrentSet() {
    const newSet = {};
    for(var i = 1; i < win.obj_army.length; i++) {
        const set = win.obj_army[i];
        if(set.link && set.count) {
            newSet[`monsterId${i}`] = win.obj[set.link].monster_id;
            newSet[`imagePath${i}`] = win.obj[set.link].p_fn;
            newSet[`rarity${i}`] = win.obj[set.link].rarity;
            newSet[`count${i}`] = set.count;
        }
    }
    const sets = JSON.parse(getPlayerValue("LeaderCustomSets", "[]")).map(x => JSON.parse(x));
    sets.push(newSet);
    setPlayerValue("LeaderCustomSets", JSON.stringify(sets.map(x => JSON.stringify(x))));
    fillSetsTable();
}
function applySet(e) {
    const selectedRow = getParent(e.target, "tr");
    Array.from(win.obj_army).forEach(x => { if(x) { x.link = 0; x.count = 0; } });
    const sets = JSON.parse(getPlayerValue("LeaderCustomSets", "[]")).map(x => JSON.parse(x));
    const set = sets[selectedRow.rowIndex];
    const monsterIds = Object.keys(set).filter(x => x.startsWith("monsterId"));
    let lastLink = 0;
    let position = 0;
    for(const monsterIdKey of monsterIds) {
        position = parseInt(monsterIdKey.replace("monsterId", ""));
        const link = Array.from(win.obj).findIndex(x => x && x.monster_id == set[monsterIdKey]);
        if(link == -1) {
            continue;
        }
        win.obj_army[position].link = link;
        //console.log(`monsterIdKey: ${monsterIdKey}, monsterId: ${set[monsterIdKey]}, position: ${position}, link: ${link}`);

        let amount = parseInt(set[`count${position}`]);
        if(win.obj[link].count < amount) {
            amount = win.obj[link].count;
        }
        if(amount * win.obj[link].cost > win.max_leader_by_stack) {
            amount = parseInt(win.max_leader_by_stack / win.obj[link].cost);
        }
        win.obj_army[position].count = amount;
        lastLink = link;
    }
    win.show_details(lastLink);
    let lastPosition = position;
    while(win.last_leader < 0) {
        win.show_details(win.obj_army[lastPosition].link);
        lastPosition--;
    }
}
function createUnitFilters() {
    const hwm_recruit_nabor_and_pics = document.querySelector("div.hwm_recruit_nabor_and_pics.hwm_recruit_ramka");
    const rarityTogglersContainer = addElement("div", { class: "hwm_recruit_nabory" }, hwm_recruit_nabor_and_pics);
    const raritySelected = parseInt(getPlayerValue("raritySelected", "0"));
    const selectedUnitSkill = getPlayerValue("selectedUnitSkill", "0");
    const selectedUnitSpell = getPlayerValue("selectedUnitSpell", "");
    for(let rarity = 0; rarity <= 5; rarity++) {
        const title = `${isEn ? "Show" : "Показать"} ${rarityNames[rarity]}`;
        const text = rarity == 0 ? rarityNames[rarity] : rarity;
        const className = "hwm_rarity_bookmark_bottom" + (raritySelected == rarity ? " hwm_selected_bookmark" : "")
        const rarityToggler = addElement("div", { id: `rarityToggler${rarity}`, name: "rarityToggler", class: className, innerHTML: `<span>${text}</span>`, title: title }, rarityTogglersContainer);
        rarityToggler.addEventListener("click", function() {
            const newValue = rarity;
            setPlayerValue("raritySelected", newValue);
            Array.from(document.querySelectorAll("div[name=rarityToggler]")).forEach(x => { x.classList.remove('hwm_selected_bookmark'); });
            rarityToggler.classList.add('hwm_selected_bookmark');
            show_army();
        });
    }
    Array.from(document.querySelectorAll("div[id^=bookmark]")).forEach(x => x.addEventListener("click", function() { show_army(); }));

    const unitSkills = Array.from(win.obj).filter(x => x && x.skills_id && x.skills_id.length > 0).reduce((t, x) => {
        for(let i = 0; i < x.skills_id.length; i++) {
            const skillId = x.skills_id[i];
            if(!t.map(z => z.id).includes(skillId)) {
                t.push({ id: skillId, name: x.skills[i] });
            }
        }
        return t;
    }, []);
    unitSkills.sort((a, b) => { if(a.name > b.name) return 1; if(a.name < b.name) return -1; return 0; });
    //console.log([...unitSkills]);

    const originalNames = groupBy(unitSkills, x => x.name);
    const massNames = Object.keys(originalNames).filter(k => originalNames[k].length > 1);
    massNames.forEach(x => {
        const firstSkillEntrance = unitSkills.findIndex(y => y.name.startsWith(x));
        unitSkills.splice(firstSkillEntrance, originalNames[x].length, { id: x, name: x });
    });

    unitSkills.splice(0, 0, { id: "0", name: isEn ? "None" : "Не выбрано" });

    const unitSkillsContainer = addElement("div", { class: "hwm_recruit_nabory" }, hwm_recruit_nabor_and_pics);
    const unitSkillsSelect = addElement("select", { id: "unitSkillsSelect", title: isEn ? "Filter by units skill" : "Фильтр по умению существ", style: "width: 100%;" }, unitSkillsContainer);
    unitSkillsSelect.addEventListener("change", function() { setPlayerValue("selectedUnitSkill", this.value); show_army(); });
    unitSkills.forEach(x => {
        const option = addElement("option", { value: x.id, innerHTML: x.name }, unitSkillsSelect);
        if(x.id == selectedUnitSkill) {
            option.setAttribute("selected", "selected");
        }
    });

    const spellNames = Array.from(win.obj).filter(x => x && x.skills.includes(isEn ? "Caster. " : "Колдун. ")).reduce((t, x) => {
        //const casterIndex = Array.from(x.skills).findIndex(y => y == (isEn ? "Caster. " : "Колдун. "));
        const casterIndex = x.skills.indexOf(isEn ? "Caster. " : "Колдун. ");
        const casterSkillId = x.skills_id[casterIndex]; //        console.log(`${x.name}, casterIndex: ${casterIndex}, win.HWMGLSKN[${casterSkillId}]: ${win.HWMGLSKN[casterSkillId]}`);
        const spellNames = win.HWMGLSKN[casterSkillId].split(isEn ? "Spells: " : "Заклинания: ")[1].replace(".", "").split(", ").filter(y => !t.includes(y));
        return [...t, ...spellNames];
    }, []);
    spellNames.sort();
    spellNames.splice(0, 0, "");
    //console.log(spellNames);
    const unitSpellsContainer = addElement("div", { class: "hwm_recruit_nabory" }, hwm_recruit_nabor_and_pics);
    const unitSpellsSelect = addElement("select", { id: "unitSpellsSelect", title: isEn ? "Filter by units spells" : "Фильтр по заклинаниям существ", style: "width: 100%;" }, unitSpellsContainer);
    unitSpellsSelect.addEventListener("change", function() { setPlayerValue("selectedUnitSpell", this.value); show_army(); });
    spellNames.forEach(x => {
        const option = addElement("option", { value: x, innerHTML: x }, unitSpellsSelect);
        if(x == selectedUnitSpell) {
            option.setAttribute("selected", "selected");
        }
    });

    const unitNameInputContainer = addElement("div", { class: "hwm_recruit_nabory" }, hwm_recruit_nabor_and_pics);
    const unitNameInput = addElement("input", { id: "unitNameInput", type: "text", value: getPlayerValue("selectedUnitName", ""), title: isEn ? "Filter by units name" : "Фильтр по названию существ", onfocus: "this.select();", style: "width: 100%; border-radius: 5px;" }, unitNameInputContainer);
    unitNameInput.addEventListener("change", function() { setPlayerValue("selectedUnitName", this.value); show_army(); });
    if(raritySelected != 0 || selectedUnitSkill != "0" || unitSpellsSelect != "" || getPlayerValue("selectedUnitName", "")) {
        show_army();
    }
}
function show_army(skip_update) {
    let bottomHtml = '';
    for(let i = 1; i <= 7; i++) {
        const army = win.obj_army[i];
        const unit = army.link > 0 ? win.obj[army.link] : undefined;
        bottomHtml += `<div id="creature_slider${i}" class="hwm_creature_slider"`;
        if(i == win.current_top) {
			bottomHtml += ' onclick="ChangeSlider(event, 1, 1);";';
        } else {
            if(army.link > 0 && army.count > 0){
                bottomHtml += ` onclick="show_details(${army.link});";`;
            };
        };
        bottomHtml += `><div class="hwm_recruit_mon_parent"><img src="https://dcdn.heroeswm.ru/i/army_html/fon_lvl${unit?.rarity || 1}.png" class="mon_image2">`;
        if(unit) {
            unit.now_count = unit.count - army.count;
            bottomHtml += `<img src="${unit.p_fn}" class="mon_image1">`;
        };
        const t_count = army.count > 0 ? army.count.toString() : '';
        bottomHtml += `<img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl${unit?.rarity || 1}.png" class="mon_image2"></div><div class="amount hwm_amount_font_size" id=more_count${i}>${t_count}</div></div>`;
    }
    let sliderHtml = '<div class="hwm_creature_slider"><div class="hwm_recruit_mon_parent"></div></div>';
    if(win.current_top) {
        const unit = win.obj[win.obj_army[win.current_top].link];
        sliderHtml = `<div class="hwm_creature_slider">
    <div class="hwm_recruit_mon_parent" onclick="ChangeSlider(event, 1, -1);">
        <img src="https://dcdn.heroeswm.ru/i/army_html/fon_lvl${unit.rarity || 1}.png" class="mon_image2">
        <img src="${unit.p_fn}" class="mon_image1">
        <img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl${unit.rarity || 1}.png" class="mon_image2">
    </div>
    <div class="amount hwm_amount_font_size" id="add_now_count">${unit.now_count}</div>
</div>`;
    };
    document.getElementById('cre_slider').innerHTML = sliderHtml;
    if(!skip_update) {
        let availableUnitsHtml = '';
        const armyLinks = Array.from(win.obj_army).filter(x => x && x.link > 0).map(x => x.link);
        const raritySelected = parseInt(getPlayerValue("raritySelected", "0"));
        const selectedUnitSkill = getPlayerValue("selectedUnitSkill", "0");
        const selectedUnitSpell = getPlayerValue("selectedUnitSpell", "");
        const selectedUnitName = getPlayerValue("selectedUnitName", "").toLowerCase();
        //console.log(`win.current_bookmark: ${win.current_bookmark}, raritySelected: ${raritySelected}, selectedUnitSkill: ${selectedUnitSkill}, selectedUnitSpell: ${selectedUnitSpell}, selectedUnitName: ${selectedUnitName}`);
        for(let i = 1; i <= win.obj.length - 1; i++) {
            const unit = win.obj[i];
            if(unit) {
                const casterIndex = unit.skills.indexOf(isEn ? "Caster. " : "Колдун. ");
                const casterSkillId = casterIndex > -1 ? unit.skills_id[casterIndex] : 0;
                let spellNames = [];
                if(casterSkillId > 0) {
                    spellNames = win.HWMGLSKN[casterSkillId].split(isEn ? "Spells: " : "Заклинания: ")[1].replace(".", "").split(", ");
                }
                if((win.current_bookmark == -1 || unit.race == win.current_bookmark) && (raritySelected == 0 || raritySelected == unit.rarity)
                    && (selectedUnitSkill == "0" || unit.skills_id.includes(selectedUnitSkill) || unit.skills.includes(selectedUnitSkill)) && (!selectedUnitName || unit.name.toLowerCase().includes(selectedUnitName))
                    && (selectedUnitSpell == "" || spellNames.includes(selectedUnitSpell))) {
                    if(!armyLinks.includes(i)) {
                        unit.now_count = unit.count;
                    }
                    availableUnitsHtml += `<div class="creature_slider_portrait creature_level${unit.rarity || 1}" onclick="show_details(${i});">
   <img id="obj_fon${i}" src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl${unit.rarity || 1}.png" class="mon_image2">
   <img src="${unit.p_fn}">
   <div class="amount reserve_amount hwm_amount_font_size" id=now_count${i}>${unit.now_count}</div>
</div>`;
                };
            };
        }
        document.getElementById('cre_top').innerHTML = availableUnitsHtml;
    }
    if(win.last_current_monster > 0 && win.last_current_monster != win.current_monster && skip_update && document.getElementById('obj_fon' + win.last_current_monster)) {
        document.getElementById('obj_fon' + win.last_current_monster).classList.remove('frame_selected');
    }
    if(win.current_monster > 0 && document.getElementById('obj_fon' + win.current_monster)) {
        document.getElementById('obj_fon' + win.current_monster).classList.add('frame_selected');
    }
    win.last_current_monster = win.current_monster;
    document.getElementById('cre_bottom').innerHTML = bottomHtml;
    win.init_scrolls();
};
async function createMonstersDropRestBattlesInfoPanel() {
    if(location.pathname == "/war.php") {
        battleLoadedTimerId = setInterval(waitForBattleLoad, 200);
        return;
    }
    if(location.pathname == "/leader_army_exchange.php") {
        checkExchanges();
    }
    if(location.pathname == "/leader_guild.php") {
        const exchangeCreatures = JSON.parse(getPlayerValue("EvailableExchanges", "[]"));
        const leader_army_exchangeButton = document.querySelector("div.home_button2.btn_hover2 > a[href='leader_army_exchange.php']")?.closest("div");
        if(leader_army_exchangeButton && exchangeCreatures.length > 0) {
            leader_army_exchangeButton.style.background = "linear-gradient(to left, rgb(182, 244, 146), rgb(51, 139, 147))";
            leader_army_exchangeButton.title = isEn ? ("Evailable exchanges" + exchangeCreatures.join(", ")) : ("Доступны для обмена " + exchangeCreatures.join(", "));
        }
    }
    if(location.pathname == "/home.php") {
        const playerLevel = parseInt(getPlayerValue("PlayerLevel", 0));
        if(playerLevel < 3) {
            return;
        }
        if(isNewPersonPage) {
            const workerGuild = document.querySelector(".home_work_block");
            workerGuild.insertAdjacentHTML("afterend", `<div class="home_container_block" style="align-items: left;">
                <div class="global_container_block_header global_a_hover">
                    <a href="/leader_guild.php">${isEn ? "Leader`s guild" : "Гильдия Лидеров"}</a>
                </div>
                <div id=monstersDropRestBattlesInfoDiv title="${isEn ? "Refresh" : "Обновить"}" class="home_inside_margins global_a_hover">
                </div>
            </div>`);
        } else {
            const logoutRef = document.querySelector(`body > center > table td > a[href='/${isEn ? "about-game" : "ob-igre"}']`);
            const logoutRefRow = getParent(logoutRef, "td"); //        console.log(logoutRefRow);        return;
            logoutRefRow.insertAdjacentHTML("beforeend", `<span id=monstersDropRestBattlesInfoDiv title="${isEn ? "Refresh" : "Обновить"}" style="font-weight: bold; text-decoration: underline; text-decoration-skip-ink: none;"></span>`);
        }
        const monstersDropRestBattlesInfoDiv = document.querySelector("#monstersDropRestBattlesInfoDiv");
        monstersDropRestBattlesInfoDiv.addEventListener("click", async function() { await getMonstersDropRestBattlesInfo(); monstersDropRestBattlesInfoPanelDataBind(); });
        const leadersInfo = JSON.parse(getPlayerValue('MonstersDropRestBattlesInfo', "{}"));
        if(!getPlayerValue('MonstersDropRestBattlesInfo') || leadersInfo.warid) {
            await getMonstersDropRestBattlesInfo();
        }
        monstersDropRestBattlesInfoPanelDataBind();
    }
}
function waitForBattleLoad() {
    if(win.stage[win.war_scr].setted_atb) {
        clearInterval(battleLoadedTimerId);
        console.log(`win.warlog: ${win.warlog}, win.btype: ${win.btype}, win.warid: ${win.warid}, isLeaderBattle: ${isLeaderBattle()}`);
        if(win.warlog == 0 && !isLeaderBattle()) {
            const leadersInfo = JSON.parse(getPlayerValue('MonstersDropRestBattlesInfo', "{}"));
            leadersInfo.warid = win.warid; // Запишем временно в объект. Если обработаем сами, то очистим, если - нет, то запустим анализ лога боёв
            setPlayerValue('MonstersDropRestBattlesInfo', JSON.stringify(leadersInfo));
        }
    }
}
function monstersDropRestBattlesInfoPanelDataBind() {
    const leadersInfo = JSON.parse(getPlayerValue('MonstersDropRestBattlesInfo', "{}"));
    const exchangeCreatures = JSON.parse(getPlayerValue("EvailableExchanges", "[]"));
    const exchangeList = exchangeCreatures.join(", ");
    const exchangeText = exchangeList ? (isEn ? "Evailable exchanges" : "Доступны обмены") : "";
    //console.log(leadersInfo);
    const monstersDropRestBattlesInfoDiv = document.querySelector("#monstersDropRestBattlesInfoDiv");
    monstersDropRestBattlesInfoDiv.innerHTML = leadersInfo.battlesLeft ? `${isEn ? "Battles left until creatures join" : "До присоединения"} ${leadersInfo.battlesLeft} ${isEn ? "" : declOfNum(leadersInfo.battlesLeft, ['бой', 'боя', 'боёв'])}` + (leadersInfo.ammunitionScore ? `${isEn ? ", AP" : ", ОА"}: ${leadersInfo.ammunitionScore}` : "") : (isEn ? "To view information, please refresh your data." : "Для просмотра информации обновите данные");
    if(exchangeText) {
        monstersDropRestBattlesInfoDiv.innerHTML += `<br><span id="to_leader_army_exchange" style="cursor: pointer;" title="${exchangeList}">${exchangeText}</span>`;
        monstersDropRestBattlesInfoDiv.querySelector("span#to_leader_army_exchange").addEventListener("click", function(e) { e.stopPropagation(); location = "/leader_army_exchange.php"; })
    }
}
async function getMonstersDropRestBattlesInfo() {
    document.querySelector("#monstersDropRestBattlesInfoDiv").innerText = isEn ? "Battle analysis..." : 'Анализ боёв...';
    const doc = await getRequest(`/pl_warlog.php?id=${PlayerId}`);
    const wars = Array.from(doc.querySelectorAll("a[href*='warlog.php?warid']")).map(x => ({ id: getUrlParamValue(x.href, "warid"), ref: x, warType: parseInt(findSiblingComment(x).textContent) })).filter(x => !isLeaderBattle(x.warType));
    //console.log(wars);
    const undroppedWars = [];
    for(const war of wars) {
        const battleInfo = await loadLastTurn(war.id); //        console.log(battleInfo);
        if(battleInfo == null || battleInfo.skillPoints <= 0.3 || !battleInfo.artsAreWorn) {
            continue;
        }
        if(battleInfo.reserveAmount > 0) {
            break;
        }
        undroppedWars.push(battleInfo);
    }
    //console.log(undroppedWars);
    if(undroppedWars.length == 0) {
        // Последний бой был с присоединением, поэтому обновляем данные о появившихся обменах
        checkExchanges();
    }
    setPlayerValue('MonstersDropRestBattlesInfo', JSON.stringify({ battlesLeft: 5 - undroppedWars.length, ammunitionScore: Math.floor(average(undroppedWars.map(x => x.ammunitionScore))) }));
}
async function loadLastTurn(warId) {
    const responseText = await getRequestText(`/battle.php?lastturn=-3&warid=${warId}`, "text/html; charset=UTF-8");    //console.log(responseText);
    if(new RegExp(isEn ? "resurrected troops" : "воскрешено отрядов").test(responseText)) {
        return null;
    }
    const doc = (new DOMParser).parseFromString(responseText, "text/html");
    const playerResults = Array.from(doc.querySelectorAll("b > font")).filter(x => x.innerText == getPlayerValue("UserName")).map(x => x.parentNode.nextSibling.textContent); //console.log(playerResults);

    const skillPointsRegExp = new RegExp(isEn ? `(\\d+\\.?\\d*) skill points` : `(\\d+\\.?\\d*) умени`);
    const artifactsAreNotWornRegExp = new RegExp(isEn ? `artifacts are not worn` : `артефакты не изношены`);
    const toReserveRegExp = new RegExp(isEn ? `, (.+) \\(\\+([\\d,]+) cnt\\.\\) to reserve` : `, (.+) \\(\\+([\\d,]+) шт\\.\\) в резерв`); // , Gogs (+90 cnt.) to reserve and 0.44 skill points
    let skillPoints = 0;
    let artsAreWorn = true;
    let reserveUnitName = "";
    let reserveAmount = 0;
    playerResults.forEach(x => {
        const skillPointsRegExpExec = skillPointsRegExp.exec(x);
        if(skillPointsRegExpExec) {
            skillPoints = parseFloat(skillPointsRegExpExec[1]);
        }
        const artifactsAreNotWornRegExpExec = artifactsAreNotWornRegExp.exec(x);
        if(artifactsAreNotWornRegExpExec) {
            artsAreWorn = false;
        }
        const toReserveRegExpExec = toReserveRegExp.exec(x);
        if(toReserveRegExpExec) {
            reserveUnitName = toReserveRegExpExec[1];
            reserveAmount = parseInt(toReserveRegExpExec[2].replace(/,/g, ""));
        }
    });
    let ammunitionScore = 0;
    const ammunitionScoreRegExp = new RegExp(`\\|${getPlayerValue("UserName")}.+?exp1(\\d+)`);
    const ammunitionScoreRegExpExec = ammunitionScoreRegExp.exec(responseText);
    if(ammunitionScoreRegExpExec) {
        //console.log(ammunitionScoreRegExpExec)
        ammunitionScore = parseInt(ammunitionScoreRegExpExec[1]);
    }
    const warResult = { skillPoints: skillPoints, artsAreWorn: artsAreWorn, reserveUnitName: reserveUnitName, reserveAmount: reserveAmount, ammunitionScore: ammunitionScore }; //   console.log(warResult);
    return warResult;
}
async function checkExchanges() {
    const doc = location.pathname == "/leader_army_exchange.php" ? document : await getRequest("/leader_army_exchange.php");
    const creatures = getExchangeList(doc);
    const exchangeCreatures = creatures.filter(x => calcMayExchange(x));
    setPlayerValue("EvailableExchanges", JSON.stringify(exchangeCreatures.map(x => x.title)));
}
function getExchangeList(doc) {
    let exchangeTable = Array.from(doc.querySelectorAll("table.wb")).find(x => x.innerHTML.includes(isEn ? "Total leadership" : "Суммарное лидерство"));
    if(exchangeTable) {
        //console.log(exchangeTable.rows.length);
        let creatures = Array.from(exchangeTable.rows).filter((x, i) => i > 0).map(x => {
            //console.log(x.cells.length);
            const totalLeadershipCell = x.cells[1];
            const rowData = {
                row: x,
                exchangeButton: x.querySelector("form > input[type=submit]"),
                exchangeNumber: 0,
                amount: parseInt(x.querySelector("#add_now_count").innerText.replace(",", "")),
                leadership: parseInt((totalLeadershipCell.querySelector("td>b") || totalLeadershipCell.querySelector("td")).innerText.replace(/,/g, "")),
                creatureId: getUrlParamValue(x.querySelector("a[href^='army_info.php?name=']").href, "name"),
                title: x.cells[0].querySelector("div.show_hint").getAttribute("hint")
            };
            if(rowData.exchangeButton) {
                rowData.exchangeNumber = parseInt(/(\d+)/.exec(rowData.exchangeButton.value.replace(/,/g, ""))[1]);
            }
            rowData.unitLeadership = rowData.leadership / rowData.amount;
            rowData.afterExchangeRestLeadership = rowData.leadership - rowData.exchangeNumber * rowData.unitLeadership;
            return rowData;
        });
        //console.log(creatures);
        return creatures;
    }
    return [];
}
function calcMayExchange(rowData) {
    if(rowData.exchangeNumber == 0) {
        return false;
    }
    const leaderReserveType = getPlayerValue("leaderReserveType" + rowData.creatureId, "0");
    let mayExchange = true;
    switch(leaderReserveType) {
        case "0":
            break;
        case "1":
            mayExchange = rowData.afterExchangeRestLeadership >= 10000;
            break;
        case "2":
            mayExchange = rowData.afterExchangeRestLeadership >= 8000;
            break;
        case "3":
            mayExchange = rowData.afterExchangeRestLeadership >= 4000;
            break;
        case "4": {
            const leaderReserveNumber = Number(getPlayerValue("leaderReserveNumber" + rowData.creatureId, ""));
            mayExchange = rowData.amount - rowData.exchangeNumber >= leaderReserveNumber;
        }
            break;
        case "5":
            mayExchange = false;
            break;
    }
    return mayExchange;
}
function average(arr) { return arr.length == 0 ? 0 : (arr.reduce((p, c) => p + c, 0) / arr.length); }
// API
function getURL(url) { window.location.href = url; }
function createDataList(inputElement, dataListId, buttonsClass) {
    const datalist = addElement("datalist", { id: dataListId });
    const valuesData = getValue("DataList" + dataListId);
    let values = [];
    if(valuesData) {
        values = valuesData.split(",");
    }
    for(const value of values) {
        addElement("option", { value: value }, datalist);
    }
    inputElement.parentNode.insertBefore(datalist, inputElement.nextSibling);
    inputElement.setAttribute("list", dataListId);

    const clearListButton = addElement("input", { type: "button", value: "x", title: LocalizedString.ClearList, class: buttonsClass, style: "min-width: 20px; width: 20px; text-align: center; padding: 2px 2px 2px 2px;" });
    clearListButton.addEventListener("click", function() { if(window.confirm(LocalizedString.ClearList)) { deleteValue("DataList" + dataListId); datalist.innerHTML = ""; } }, false);
    inputElement.parentNode.insertBefore(clearListButton, datalist.nextSibling);

    return datalist;
}
function showCurrentNotification(html) {
    //GM_setValue("CurrentNotification", `{"Type":"1","Message":"The next-sibling combinator is made of the code point that separates two compound selectors. The elements represented by the two compound selectors share the same parent in the document tree and the element represented by the first compound selector immediately precedes the element represented by the second one. Non-element nodes (e.g. text between elements) are ignored when considering the adjacency of elements."}`);
    if(!isHeartOnPage) {
        return;
    }
    let currentNotificationHolder = document.querySelector("div#currentNotificationHolder");
    let currentNotificationContent = document.querySelector("div#currentNotificationContent");
    if(!currentNotificationHolder) {
        currentNotificationHolder = addElement("div", { id: "currentNotificationHolder", style: "display: flex; position: fixed; transition-duration: 0.8s; left: 50%; transform: translateX(-50%); bottom: -300px; width: 200px; border: 2px solid #000000; background-image: linear-gradient(to bottom, #EAE0C8 0%, #DBD1B9 100%); font: 10pt sans-serif;" }, document.body);
        currentNotificationContent = addElement("div", { id: "currentNotificationContent", style: "text-align: center;" }, currentNotificationHolder);
        const divClose = addElement("div", { title: isEn ? "Close" : "Закрыть", innerText: "x", style: "border: 1px solid #abc; flex-basis: 15px; height: 15px; text-align: center; cursor: pointer;" }, currentNotificationHolder);
        divClose.addEventListener("click", function() {
            const rect = currentNotificationHolder.getBoundingClientRect();
            currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
        });
    }
    currentNotificationContent.innerHTML = html;
    const rect = currentNotificationHolder.getBoundingClientRect();
    currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
    currentNotificationHolder.style.bottom = "0";
    setTimeout(function() { currentNotificationHolder.style.bottom = `${-rect.height-1}px`; }, 3000);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Array and object
function groupBy(list, keyFieldOrSelector) { return list.reduce(function(t, item) { const keyValue = typeof keyFieldOrSelector === 'function' ? keyFieldOrSelector(item) : item[keyFieldOrSelector]; (t[keyValue] = t[keyValue] || []).push(item); return t; }, {}); };
function getKeyByValue(object, value) { return Object.keys(object).find(key => object[key] === value); }
function findKey(obj, selector) { return Object.keys(obj).find(selector); }
function pushNew(array, newValue) { if(array.indexOf(newValue) == -1) { array.push(newValue); } }
function sortBy(field, reverse, evaluator) {
    const key = evaluator ? function(x) { return evaluator(x[field]); } : function(x) { return x[field]; };
    return function(a, b) { return a = key(a), b = key(b), (reverse ? -1 : 1) * ((a > b) - (b > a)); }
}
// HttpRequests
function getRequest(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: data,
            onload: function(response) { resolve(response); },
            onerror: function(error) { reject(error); }
        });
    });
}
function fetch({ url, method = 'GET', type = 'document', body = null }) {
    return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.responseType = type;

          xhr.onload = () => {
            if (xhr.status === 200) return resolve(xhr.response);
            throwError(`Error with status ${xhr.status}`);
          };

          xhr.onerror = () => throwError(`HTTP error with status ${xhr.status}`);

          xhr.send(body);

          function throwError(msg) {
            const err = new Error(msg);
            err.status = xhr.status;
            reject(err);
          }
    });
}
// Storage
function getValue(key, defaultValue) { return GM_getValue(key, defaultValue); };
function setValue(key, value) { GM_setValue(key, value); };
function deleteValue(key) { return GM_deleteValue(key); };
function getPlayerValue(key, defaultValue) { return getValue(`${key}${PlayerId}`, defaultValue); };
function setPlayerValue(key, value) { setValue(`${key}${PlayerId}`, value); };
function deletePlayerValue(key) { return deleteValue(`${key}${PlayerId}`); };
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    //console.log(`valueName: ${valueName}, value: ${value}, ${typeof(value)}`)
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function setOrDeleteNumberValue(key, value) {
    if(!value || value == "" || isNaN(Number(value))) {
        deleteValue(key);
    } else {
        setValue(key, value);
    }
}
function setOrDeleteNumberPlayerValue(key, value) { setOrDeleteNumberValue(key + PlayerId, value); }
function getStorageKeys(filter) { return listValues().filter(filter); }
// Html DOM
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function addStyle(css) { addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function getNearestAncestorSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextSibling) {
            return parentNode.nextSibling;
        }
    }
}
function getNearestAncestorElementSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextElementSibling) {
            return parentNode.nextElementSibling;
        }
    }
}
function nextSequential(node) { return node.firstChild || node.nextSibling || getNearestAncestorSibling(node); }
function nextSequentialElement(element) { return element.firstElementChild || element.nextElementSibling || getNearestAncestorElementSibling(element); }
function getSequentialsUntil(firstElement, lastElementTagName) {
    let currentElement = firstElement;
    const resultElements = [currentElement];
    while((currentElement = nextSequential(currentElement)) && currentElement.nodeName.toLowerCase() != lastElementTagName.toLowerCase()) {
        resultElements.push(currentElement);
    }
    if(currentElement) {
        resultElements.push(currentElement);
    }
    return resultElements;
}
function findChildrenTextContainsValue(selector, value) { return Array.from(document.querySelectorAll(selector)).reduce((t, x) => { const match = Array.from(x.childNodes).filter(y => y.nodeName == "#text" && y.textContent.includes(value)); return [...t, ...match]; }, []); }
function findSequentialTextContainsValue(node, value) {
    if(!node) {
        return;
    }
    let curNode = node;
    while(curNode = nextSequential(curNode)) {
        //console.log(`curNode.nodeName: ${curNode.nodeName}, curNode.textContent: ${curNode.textContent}`);
        if(curNode.nodeName == "#text" && curNode.textContent.includes(value)) {
            return curNode;
        }
    }
}
function findSiblingComment(node) {
    if(!node) {
        return;
    }
    let curNode = node;
    while(curNode = curNode.nextSibling) {
        //console.log(`curNode.nodeName: ${curNode.nodeName}, curNode.textContent: ${curNode.textContent}`);
        if(curNode.nodeName == "#comment") {
            return curNode;
        }
    }
}
// Popup panel
function createPupupPanel(panelName, panelTitle, fieldsMap, panelToggleHandler) {
    const backgroundPopupPanel = addElement("div", { id: panelName, style: "position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); z-index: 200;" }, document.body);
    backgroundPopupPanel.addEventListener("click", function(e) { if(e.target == this) { hidePupupPanel(panelName, panelToggleHandler); }});
    const topStyle = isMobileDevice ? "" : "top: 50%; transform: translateY(-50%);";
    const contentDiv = addElement("div", { style: `${topStyle} padding: 5px; display: flex; flex-wrap: wrap; position: relative; margin: auto; padding: 0; width: fit-content; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); border: 1mm ridge rgb(211, 220, 50);` }, backgroundPopupPanel);
    if(panelTitle) {
        addElement("b", { innerHTML: panelTitle, style: "text-align: center; margin: auto; width: 90%; display: block;" }, contentDiv);
    }
    const divClose = addElement("span", { id: panelName + "close", title: isEn ? "Close" : "Закрыть", innerHTML: "&times;", style: "cursor: pointer; font-size: 20px; font-weight: bold;" }, contentDiv);
    divClose.addEventListener("click", function() { hidePupupPanel(panelName, panelToggleHandler); });

    addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);

    if(fieldsMap) {
        let contentTable = addElement("table", { style: "flex-basis: 100%; width: min-content;"}, contentDiv);
        for(const rowData of fieldsMap) {
            if(rowData.length == 0) { // Спомощью передачи пустой стороки-массива, указываем, что надо начать новую таблицу после брейка
                addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);
                contentTable = addElement("table", undefined, contentDiv);
                continue;
            }
            const row = addElement("tr", undefined, contentTable);
            for(const cellData of rowData) {
                const cell = addElement("td", undefined, row);
                if(cellData) {
                    if(typeof(cellData) == "string") {
                        cell.innerText = cellData;
                    } else {
                        cell.appendChild(cellData);
                    }
                }
            }
        }
    }
    if(panelToggleHandler) {
        panelToggleHandler(true);
    }
    return contentDiv;
}
function showPupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    if(backgroundPopupPanel) {
        backgroundPopupPanel.style.display = '';
        if(panelToggleHandler) {
            panelToggleHandler(true);
        }
        return true;
    }
    return false;
}
function hidePupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    backgroundPopupPanel.style.display = 'none';
    if(panelToggleHandler) {
        panelToggleHandler(false);
    }
}
// Script autor and url
function getScriptLastAuthor() {
    let authors = GM_info.script.author;
    if(!authors) {
        const authorsMatch = GM_info.scriptMetaStr.match(/@author(.+)\n/);
        authors = authorsMatch ? authorsMatch[1] : "";
    }
    const authorsArr = authors.split(",").map(x => x.trim()).filter(x => x);
    return authorsArr[authorsArr.length - 1];
}
function getDownloadUrl() {
    let result = GM_info.script.downloadURL;
    if(!result) {
        const downloadURLMatch = GM_info.scriptMetaStr.match(/@downloadURL(.+)\n/);
        result = downloadURLMatch ? downloadURLMatch[1] : "";
        result = result.trim();
    }
    return result;
}
function getScriptReferenceHtml() { return `<a href="${getDownloadUrl()}" title="${isEn ? "Check for update" : "Проверить обновление скрипта"}" target=_blanc>${GM_info.script.name} ${GM_info.script.version}</a>`; }
function getSendErrorMailReferenceHtml() { return `<a href="sms-create.php?mailto=${getScriptLastAuthor()}&subject=${isEn ? "Error in" : "Ошибка в"} ${GM_info.script.name} ${GM_info.script.version} (${GM_info.scriptHandler} ${GM_info.version})" target=_blanc>${isEn ? "Bug report" : "Сообщить об ошибке"}</a>`; }
// Server time
function getServerTime() { return Date.now() - parseInt(getValue("ClientServerTimeDifference", 0)); }
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время // Это та дата, которая в toUTCString покажет время по москве
function toServerTime(clientTime) { return clientTime -  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function toClientTime(serverTime) { return serverTime +  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function truncToFiveMinutes(time) { return Math.floor(time / 300000) * 300000; }
function today() { const now = new Date(getServerTime()); now.setHours(0, 0, 0, 0); return now; }
function tomorrow() { const today1 = today(); today1.setDate(today1.getDate() + 1); return today1; }
async function requestServerTime() {
    if(parseInt(getValue("LastClientServerTimeDifferenceRequestDate", 0)) + 6 * 60 * 60 * 1000 < Date.now()) {
        setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
        const responseText = await getRequestText("/time.php");
        const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
        if(responseParcing) {
            setValue("ClientServerTimeDifference", Date.now() - parseInt(responseParcing[1]) * 1000);
        }
    } else {
        setTimeout(requestServerTime, 60 * 60 * 1000);
    }
}
// dateString - игровое время, взятое со страниц игры. Оно всегда московское // Как результат возвращаем серверную дату
function parseDate(dateString, isFuture = false, isPast = false) {
    //console.log(dateString)
    if(!dateString) {
        return;
    }
    const dateStrings = dateString.split(" ");

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const gameDate = getGameDate();
    let year = gameDate.getUTCFullYear();
    let month = gameDate.getUTCMonth();
    let day = gameDate.getUTCDate();
    const timePart = dateStrings.find(x => x.includes(":"));
    if(timePart) {
        var time = timePart.split(":");
        hours = parseInt(time[0]);
        minutes = parseInt(time[1]);
        if(time.length > 2) {
            seconds = parseInt(time[2]);
        }
        if(dateStrings.length == 1) {
            let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            if(isPast && result > gameDate) {
                result.setUTCDate(result.getUTCDate() - 1);
            }
            if(isFuture && result < gameDate) {
                result.setUTCDate(result.getUTCDate() + 1);
            }
            //console.log(`result: ${result}, gameDate: ${gameDate}`)
            result.setUTCHours(result.getUTCHours() - 3);
            return result;
        }
    }

    const datePart = dateStrings.find(x => x.includes("-"));
    if(datePart) {
        const date = datePart.split("-");
        month = parseInt(date[isEn ? (date.length == 3 ? 1 : 0) : 1]) - 1;
        day = parseInt(date[isEn ? (date.length == 3 ? 2 : 1) : 0]);
        if(date.length == 3) {
            const yearText = isEn ? date[0] : date[2];
            year = parseInt(yearText);
            if(yearText.length < 4) {
                year += Math.floor(gameDate.getUTCFullYear() / 1000) * 1000;
            }
        } else {
            if(isFuture && month == 0 && gameDate.getUTCMonth() == 11) {
                year += 1;
            }
        }
    }
    if(dateStrings.length > 2) {
        const letterDateExec = /(\d{2}):(\d{2}) (\d{2}) (.{3,4})/.exec(dateString);
        if(letterDateExec) {
            //console.log(letterDateExec)
            day = parseInt(letterDateExec[3]);
            //const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthShortNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
            month = monthShortNames.findIndex(x => x.toLowerCase() == letterDateExec[4].toLowerCase());
            if(isPast && Date.UTC(year, month, day, hours, minutes, seconds) > gameDate.getTime()) {
                year -= 1;
            }
        }
    }
    //console.log(`year: ${year}, month: ${month}, day: ${day}, time[0]: ${time[0]}, time[1]: ${time[1]}, ${new Date(year, month, day, parseInt(time[0]), parseInt(time[1]))}`);
    let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    result.setUTCHours(result.getUTCHours() - 3);
    return result;
}
// Misc
async function initUserName() {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        //console.log(document.querySelector("h1").innerText)
        setPlayerValue("UserName", document.querySelector("h1").innerText);
    }
    if(location.pathname == "/home.php") {
        //console.log(document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText)
        const userNameRef = document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`);
        if(userNameRef) {
            setPlayerValue("UserName", userNameRef.innerText);
        }
    }
    if(!getPlayerValue("UserName")) {
        const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
        setPlayerValue("UserName", doc.querySelector("h1").innerText);
    }
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function showBigData(data) { console.log(data); /*addElement("TEXTAREA", { innerText: data }, document.body);*/ }
function round0(value) { return Math.round(value * 10) / 10; }
function round00(value) { return Math.round(value * 100) / 100; }
function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
// MutationObserver
function observe(targets, handler, config = { childList: true, subtree: true }) {
    targets = Array.isArray(targets) ? targets : [targets];
    targets = targets.map(x => { if(typeof x === 'function') { return x(document); } return x; }); // Можем передавать не элементы, а их селекторы
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        if(!config.once) {
            for(const target of targets) {
                if(target) {
                    observer.observe(target, config);
                }
            }
        }
    });
    for(const target of targets) {
        if(target) {
            ob.observe(target, config);
        }
    }
}
// UpdatePanels
// Если используется url, то это должна быть та же локация с другими параметрами
async function refreshUpdatePanels(panelSelectors, postProcessor, url = location.href) {
    panelSelectors = Array.isArray(panelSelectors) ? panelSelectors : [panelSelectors];
    let freshDocument;
    for(const panelSelector of panelSelectors) {
        const updatePanel = panelSelector(document);
        //console.log(panelSelector.toString())
        //console.log(updatePanel)
        if(updatePanel) {
            freshDocument = freshDocument || await getRequest(url);
            const freshUpdatePanel = panelSelector(freshDocument);
            if(!freshUpdatePanel) {
                console.log(updatePanel)
                continue;
            }
            if(postProcessor) {
                postProcessor(freshUpdatePanel);
            }
            updatePanel.innerHTML = freshUpdatePanel.innerHTML;
            Array.from(updatePanel.querySelectorAll("script")).forEach(x => {
                x.insertAdjacentElement("afterend", addElement("script", { innerHTML: x.innerHTML })); // Передобавляем скрипты, как элементы, что они сработали
                x.remove();
            });
        }
    }
    if(typeof win.hwm_hints_init === 'function') win.hwm_hints_init();
    return freshDocument;
}
function getPlayerLevel() {
    if(location.pathname == "/home.php") {
        if(isNewPersonPage) {
            const levelInfoCell = Array.from(document.querySelectorAll("div.home_pers_info")).find(x => x.innerHTML.includes(isEn ? "Combat level" : "Боевой уровень"));
            if(levelInfoCell) {
                setPlayerValue("PlayerLevel", parseInt(levelInfoCell.querySelector("div[id=bartext] > span").innerText));
            }
        } else {
            const playerLevelExec = new RegExp(`<b>${isEn ? "Combat level" : "Боевой уровень"}: (\\d+?)<\\/b>`).exec(document.documentElement.innerHTML);
            if(playerLevelExec) {
                setPlayerValue("PlayerLevel", parseInt(playerLevelExec[1]));
            }
        }
    }
}
function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
function isLeaderBattle(btype = win.btype) {
    return btype == _CRE_EVENT || btype == _GL_EVENT || btype == _GL_DWARF_EVENT || btype == _NYGL2018_EVENT || btype == _CRE_SPEC || btype == _CRE_INSERT || btype == _CRE_TOUR || btype == _NEWCRE_EVENT;
}
//window.location.href="leader_rogues.php?action=res_all&sign="+hwm_player_sign;