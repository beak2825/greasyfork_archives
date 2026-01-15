// ==UserScript==
// @name         battle_damage_tooltip
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Просмотр урона всех видов в бою, фиксы и фичи (перечислены в описаниее)
// @author       Something begins
// @license      MIT
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @match       https://mirror.heroeswm.ru/war*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/463617/battle_damage_tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/463617/battle_damage_tooltip.meta.js
// ==/UserScript==
// Активация горячих кнопок на Alt, поменять можно в переменной triggerKey
// Выбор биндов горячих кнопок, редактировать можно снизу, спец символы копировать из списка keyboardKeycodes на 23 строке

// посмотреть урон
const seeDamage = "E";
// посмотреть рельсу
const seeMagShot = "U"
    // кнопка, зажав которую, становятся активны кнопки ниже
const triggerKey = "alt";
// автобой
const autoBattle = "A";
// вкл/выкл кастом скорость боя
const toggleSpeed = "S";
// авто расстановка
const autoPlacement = "R";
// кнопка назад
const backToGame = "Z";
// начать бой
const startBattle = "B";

const keyboardKeycodes = {
    "backspace": 8,
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "ctrl": 17,
    "alt": 18,
    "pause": 19,
    "capslock": 20,
    "escape": 27,
    "space": 32,
    "pageup": 33,
    "pagedown": 34,
    "end": 35,
    "home": 36,
    "leftarrow": 37,
    "uparrow": 38,
    "rightarrow": 39,
    "downarrow": 40,
    "insert": 45,
    "delete": 46,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90,
    "leftwindowkey": 91,
    "rightwindowkey": 92,
    "selectkey": 93,
    "numpad0": 96,
    "numpad1": 97,
    "numpad2": 98,
    "numpad3": 99,
    "numpad4": 100,
    "numpad5": 101,
    "numpad6": 102,
    "numpad7": 103,
    "numpad8": 104,
    "numpad9": 105,
    "multiply": 106,
    "add": 107,
    "subtract": 109,
    "decimalpoint": 110,
    "divide": 111,
    "f1": 112,
    "f2": 113,
    "f3": 114,
    "f4": 115,
    "f5": 116,
    "f6": 117,
    "f7": 118,
    "f8": 119,
    "f9": 120,
    "f10": 121,
    "f11": 122,
    "f12": 123,
    "numlock": 144,
    "scrolllock": 145,
    "semicolon": 186,
    "equal": 187,
    "comma": 188,
    "dash": 189,
    "period": 190,
    "forwardslash": 191,
    "graveaccent": 192,
    "openbracket": 219,
    "backslash": 220,
    "closebracket": 221,
    "singlequote": 222
};

const pressedKeys = new Set();

function handleKeyDown(event) {
    pressedKeys.add(event.keyCode);
}

function handleKeyUp(event) {
    pressedKeys.delete(event.keyCode);
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Странные способы в некоторых местах обусловлены конфликтом со скриптом battleHelper от omne
let outer_chat = document.getElementById("chat_format");
let atLaunch = true;
const physCalcColor = "#141736";
let lastTurnDefended;
const magCalcColor = "#150f1c";
const calcHellFireColor = "rgba(255,0,0,0.1)";
const inputHTML = `<input type="text" id="uprava_filter_input" placeholder="Ник для управы">`;
const infoImgHTML = `<img style='height: 1.3em; width: auto; vertical-align: middle; margin-left: 1em' src="https://dcdn2.heroeswm.ru/i/combat/btn_info.png?v=6">`;
document.body.insertAdjacentHTML("afterbegin", `
    <style>
        .custom-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: none;
            z-index: 1000;
        }
    </style>
<div class="custom-popup" id="customPopup">
        <span class="popup-icon">⚠️</span>
        <i id="popupMessage"></i>
    </div>`);
outer_chat.insertAdjacentHTML("beforeend", `
<div id="cre_distance_div" style="display: none"></div>
<div id="individual_calc"></div>
<div id="mag_calc"></div>
<div id="dmg_list_container"></div>
<button id="dmg_list_refresh" style="background-color: #3d3d29; opacity: 0.7; font-size:100%; color: white; padding: 5px 10px; border: none; border-radius: 4px;  cursor: pointer">Список🔽</button>
<select style="display : none; background-color: #333; color: white; margin: 10px" id="choose_cre"></select>
<button id="change_side" style="background-color: #6b6b47; color: white; padding: 5px 10px; border: none; border-radius: 4px;  cursor: pointer; display: none">Сменить сторону</button>
<button id="collapse" style="background-color: #000000; color: white; padding: 5px 10px; border: none; border-radius: 4px;  cursor: pointer; display: none; margin:10px">❌</button> `)

let last_individual_calc = {}
let isOpen = false
let ini_weight = 10;
let chosen = { side: 1, creature: "Высшие вампиры", afterSideSwitchCre: { "-1": "", "1": "" } }
let chat = document.getElementById("chat_inside");
let select = document.getElementById("choose_cre")
let refresh_button = document.getElementById("dmg_list_refresh")
let side_button = document.getElementById("change_side")
let collapse_button = document.getElementById("collapse")
let individual_calc = document.querySelector("#individual_calc")
let cre_distance_div = document.querySelector("#cre_distance_div")
const settings_panel = document.querySelector("#webgl_settings_whole")
let dmg_list_container = document.querySelector("#dmg_list_container")
cre_distance_div.innerHTML = `<span>Выбранное расстояние: ${GM_getValue('cre_distance')}</span><br>`;

// ========= utils ============
function showPopup(message) {
    const popup = document.getElementById('customPopup');
    popup.querySelector("i").textContent = message;
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

function get_GM_value_if_exists(GM_key, default_value) {
    const GM_value = GM_getValue(GM_key)
    return GM_value != undefined ? GM_value : default_value;
}

function triggerMouseUpEvent(element) {
    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent("mouseup", true, true);
    element.dispatchEvent(clickEvent);
}

function getCurrentBattleSpeed() {
    for (let i = 1; i <= 3; i++) {
        let div = document.querySelector(`#speed${i}_button`)
        if (div.style.display === 'none') continue
        if (i === 1) return 2
        else if (i === 3) return 1
        else return 4
    }
}

function setBattleSpeed(value) {
    if (value === 0) return value
    else if (value < 1) {
        unsafeWindow.timer_interval = Math.abs(value) * 20;
        return value
    }
    unsafeWindow.animspeed_def = unsafeWindow.animspeed = value
    unsafeWindow.animspeed_init = unsafeWindow.animspeed > 4 ? 0.5 : 2;
    unsafeWindow.timer_interval = Math.abs(value - 20);
    !unsafeWindow.timer_interval && unsafeWindow.timer_interval++;
    return value
}

function countOccurrences(arr, element) {
    return arr.reduce((acc, curr) => (curr === element ? acc + 1 : acc), 0);
}

function insertInput() {
    const parent = document.querySelector("#bcontrol_users");
    if (parent.querySelector("#uprava_filter_input")) return;
    parent.insertAdjacentHTML("afterbegin", inputHTML);
}

function send_get(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType('text/plain; charset=windows-1251');
    xhr.send(null);

    if (xhr.status == 200)
        return xhr.responseText;

    return null;
}


function upravaEvent(event) {
    const parent = document.querySelector("#bcontrol_users");
    for (const child of parent.children) {
        if (child.tagName === "INPUT") continue;
        if (event.target.value === "") {
            child.classList.remove("hidden");
            continue;
        }
        const relevant = child.querySelector("span").textContent.toLowerCase().includes(event.target.value.toLowerCase());
        if (relevant) {
            child.classList.remove("hidden");
        } else {
            child.classList.add("hidden");
        }
    }
}
const damageMultipliers = {
    "doublestrike": 1.8, // двойной удар
    "cleave": 1.75, // колун
    "triplestrike": 2.5, // тройной удар
    "doubleshoot": 2, // двойной выстрел
    "assault": 1.3 // штурм
}

function evalStrength(attacker, defender) {
    const cre_collection = unsafeWindow.stage.pole.obj;
    let dmg = get_dmg_info(attacker.obj_index, defender.obj_index)
    let practical_overall_hp;
    if (cre_collection[defender.obj_index].attack > attacker.defence) {
        practical_overall_hp = attacker.maxhealth * attacker.nownumber / (1 + 0.05 * Math.abs(cre_collection[defender.obj_index].attack - attacker.defence))
    } else {
        practical_overall_hp = attacker.maxhealth * attacker.nownumber * (1 + 0.05 * Math.abs(cre_collection[defender.obj_index].attack - attacker.defence))
    }
    let multiplier = 1;
    for (const abil in damageMultipliers) {
        if (attacker.data_string.includes(abil)) multiplier *= damageMultipliers[abil];
    }
    let avgDmg = ((dmg.max + dmg.min) / 2) * multiplier * (attacker.maxinit * attacker.initmodifier / 10);

    let koef = avgDmg / practical_overall_hp;
    if (attacker.hero || defender.hero) koef = 0;
    return { avgDmg: avgDmg, koef: koef, practical_overall_hp: practical_overall_hp };
}
// инфа о гейтах на карте
function initGates() {
    const match = document.body.innerHTML.match(/umka\|(.+?)\|/);
    if (!match) return;
    const umka = match[1];
    const factions = [];
    for (let i = 1; i < umka.length; i += 14) {
        factions.push(umka[i]);
    }
    const demonsNo = countOccurrences(factions, "7");
    if (demonsNo < 1) return;
    document.head.insertAdjacentHTML("beforeEnd", `
    <style>
        #floatingBox {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
            color: white;
            padding: 10px;
            border-radius: 8px;
            pointer-events: none;
            white-space: normal;
            word-wrap: break-word;
            display: none;
        }
        .line {
            font-family: Arial, sans-serif;
            font-size: 16px;
            margin: 5px 0;
        }
    </style>
    `);
    document.body.insertAdjacentHTML("beforeEnd", `
    <div id="floatingBox">
        <div class="line" id = "gate_name">Гейт [#] </div>
        ${demonsNo > 1 ? '<div class="line" id = "gate_owner"> Владелец</div>' : ''}
    </div>
    `);
    const floatingBox = document.getElementById('floatingBox');

    function showGates(event = null) {
        const [gate_x, gate_y] = [xr_last, yr_last];
        if (gate_x > defxn || gate_y > defyn || gate_x < 0 || gate_y < 0 || (event && event.target.tagName !== "CANVAS")) {
            floatingBox.style.display = "none";
            return;
        }
        let foundGate = false;
        let curGate;
        for (const cre of Object.values(stage.pole.obj)) {
            if (cre.nownumber !== -1) continue;
            if (cre.x !== gate_x || cre.y !== gate_y) continue;
            foundGate = true;
            curGate = cre;
            break;
        }
        if (!foundGate) {
            floatingBox.style.display = "none";
            return;
        };
        floatingBox.style.display = "block";
        const mouseX = event.pageX || event.touches[0].pageX;
        const mouseY = event.pageY || event.touches[0].pageY;
        floatingBox.style.left = mouseX + 10 + 'px';
        floatingBox.style.top = mouseY + 10 + 'px';
        document.querySelector("#gate_name").innerHTML = `${curGate.nametxt} [${curGate.maxnumber}]`;
        document.querySelector("#floatingBox").style.color = curGate.get_color();

        if (demonsNo < 2) return;
        const owner = stage.pole.obj[heroes[curGate.owner]]
        document.querySelector("#gate_owner").innerHTML = `${owner.nametxt} [${owner.maxhealth}]`
    }
    document.addEventListener("mousemove", showGates);
    document.addEventListener("touchstart", event => {
        showGates(event);
    });
}

function calcKilled(dmg, defender) {
    let killed;
    if (dmg % defender.maxhealth > defender.nowhealth) killed = Math.floor(dmg / defender.maxhealth) + 1
    else killed = Math.floor(dmg / defender.maxhealth);
    return killed
}

function calcHellFireHTML(attacker, defender, cre_collection, physDamage) {
    if (!isperk(attacker.obj_index, 7) || attacker.hero === 1) {
        return "";
    }
    const dmg = calcHellFire(attacker, defender, cre_collection);
    const minDamage = dmg + physDamage.min;
    const maxDamage = dmg + physDamage.max;
    const minKilled = calcKilled(minDamage, defender);
    const maxKilled = calcKilled(dmg + physDamage.max, defender);
    return `<p id="${0}" style=" background-color: ${calcHellFireColor}">
    <span style="color:white; font-size: 90%">Адское пламя: </span> <span style = "color:red">${dmg}</span> <span style = "font-size: 80%">урона</span><br>
    <b style="color:#ffffff; font-size: 120%; text-decoration: underline;">💀️ ${minKilled}-${maxKilled}</b><span style="color:#ffffff">💥${minDamage}-${maxDamage}
  </p><br>`;
}

function calcStormHTML(attacker, defender) {
    let koef;
    if (attacker.stormstrike) koef = 0.5;
    else if (attacker.flamestrike) koef = 1.2;
    else return "";
    let xr = defender.x;
    let yr = defender.y;
    let i = attacker.obj_index;
    let dmgMap;
    Totalmagicdamage = 0;
    Totalmagickills = 0;
    var ok = false;
    var xx = 0,
        yy = 0,
        xp = 0,
        yp = 0;
    mul = 1;
    var len = stage.pole.obj_array.length;
    for (var k1 = 0; k1 < len; k1++) {
        var j = stage.pole.obj_array[k1];
        stage.pole.obj[j]['attacked'] = 1;
        stage.pole.obj[j]['attacked2'] = 1;
    }
    var herd = 0;
    var hera = 0;
    for (var k1 = 0; k1 < len; k1++) {
        k = stage.pole.obj_array[k1];
        if ((stage.pole.obj[k].hero) && (stage.pole.obj[k].owner == stage.pole.obj[mapobj[xr + yr * defxn]].owner)) herd = k;
        if ((stage.pole.obj[k].hero) && (stage.pole.obj[k].owner == stage.pole.obj[i].owner)) hera = k;
    }
    let b = 0;
    if ((magic[hera]) && (magic[hera]['mle'])) {
        b = magic[hera]['mle']['effect'];
        magic[hera]['mle']['effect'] = 0;
    }
    if (magic[herd]) {
        let rangedDef;
        if (magic[herd]['msk']) rangedDef = magic[herd]['msk']['effect'];
        else rangedDef = 0;
        if (magic[herd]['mld']) {
            let b = magic[herd]['mld']['effect'];
            magic[herd]['mld']['effect'] = rangedDef;
            dmgMap = get_dmg_info(attacker.obj_index, defender.obj_index, koef);
            magic[herd]['mld']['effect'] = b;
        } else {
            magic[herd]['mld'] = [];
            magic[herd]['mld']['effect'] = rangedDef;
            dmgMap = get_dmg_info(attacker.obj_index, defender.obj_index, koef);
            delete magic[herd]['mld'];
        }
    } else {
        dmgMap = get_dmg_info(attacker.obj_index, defender.obj_index, koef);
    }
    if (b != 0) {
        magic[hera]['mle']['effect'] = b;
    }
    return `<p id="${0}" style=" background-color: ${calcHellFireColor}">
    <span style="color:white; font-size: 90%">Урон абилкой: </span><br>
    <b style="color:#ffffff; font-size: 120%; text-decoration: underline;">💀️ ${dmgMap.min_killed}-${dmgMap.max_killed}</b><span style="color:#ffffff">💥${dmgMap.min}-${dmgMap.max}
  </p><br>`;
}

function calcMagicHTML(attacker, defender, cre_collection, dmg, inList = false) {
    if (!mag_damage_on) return "";
    let calcHTML = "";
    const disclaimerHTML = `<span class="tooltip"> ⚠️ <span class="tooltiptext chat_tooltip" style = " transform: translateX(-30%);"> (в КБО) это заклинание показывает <br> неправильный урон </span>
    </span>`;

    const incorrectSpellIDs = ["circle_of_winter", "swarm", "stormcaller"];
    // если темная сила, то дописать урон с усилком
    const isPowered = attacker.hero && unsafeWindow.isperk(attacker.obj_index, 6) ? true : false;
    for (let spellID of Object.keys(damageSpells)) {
        let additionalInfoHTML = "";
        if (attacker[spellID]) {
            if (spellID === "calllightning") spellID = "lighting";
            const dmg = unsafeWindow.stage.pole.calcmagic_script(attacker.x, attacker.y, defender.x, defender.y, spellID);
            if (spellID === "meteor") {
                let meteorText = "Целей:<br>";
                for (let i = 1; i <= 4; i++) {
                    let dmg2 = Math.floor(dmg * Math.pow(0.85, i));
                    let killed2 = calcKilled(dmg2, defender);
                    const poweredDamage = Math.round(dmg2 * 1.5);
                    const poweredKilled = calcKilled(poweredDamage, defender);
                    const poweredDamageText = isPowered ? `<span style = "font-style:italic; font-size:80%"><br>\t[1.5x] ${poweredKilled}  💥${poweredDamage}<br></span>` : "";
                    meteorText += `[${i+1}]: 💀${killed2} 💥${dmg2} ${poweredDamageText}<br>`;
                }
                additionalInfoHTML = `<span class="tooltip"> ${infoImgHTML} <span class="tooltiptext chat_tooltip" style = " transform: ${isPowered? "translateY(30%);" : "translateX(-60%);"}">${meteorText}</span>
                </span>`;
            }
            if (spellID === "chainlighting") {
                let chainText = "Цель №<br>";
                const penaltyArr = Array(0.5, 0.25, 0.125);
                for (let i = 0; i < 3; i++) {
                    let dmg2 = unsafeWindow.stage.pole.calcmagic_script(attacker.x, attacker.y, defender.x, defender.y, spellID, penaltyArr[i]);
                    let killed2 = calcKilled(dmg2, defender);
                    const poweredDamage = Math.round(dmg2 * 1.5);
                    const poweredKilled = calcKilled(poweredDamage, defender);
                    const poweredDamageText = isPowered ? `<span style = "font-style:italic; font-size:80%"><br>\t[1.5x] ${poweredKilled} 💥${poweredDamage}<br></span>` : "";
                    chainText += `${i+2} : 💀${killed2}  💥${dmg2} ${poweredDamageText}<br>`;
                }
                additionalInfoHTML = `<span class="tooltip"> ${infoImgHTML} <span class="tooltiptext chat_tooltip" style = " transform: ${isPowered? "translateY(30%);" : "translateX(-60%);"};">${chainText}</span>
                </span>`;
            }
            if (spellID === "poison") {
                additionalInfoHTML = `<span class="tooltip"> ⚠️ <span class="tooltiptext chat_tooltip" style = " transform: ${isPowered? "translateY(30%);" : "translateX(-60%);"};">Погрешность +-10%</span>
                </span>`;
            }
            let killed = calcKilled(dmg, defender);
            const poweredDamage = Math.round(dmg * 1.5);
            const poweredKilled = calcKilled(poweredDamage, defender);
            const poweredDamageText = isPowered ? `<span style = "font-style:italic; font-size:80%"><br>\t[1.5x] 💀${poweredKilled}  💥${poweredDamage}<br></span>` : "";
            calcHTML += `<p id="${0}" style=" background-color: ${magCalcColor}">
            <span style="color:white; font-size: 90%">${damageSpells[spellID]}: </span><br>💀
            <b style="color:#ffffff; font-size: 120%; text-decoration: underline;">${killed}</b>  <span style="color:#ffffff">💥${dmg} ${poweredDamageText}</span> ${incorrectSpellIDs.includes(spellID) ? disclaimerHTML : additionalInfoHTML}
          </p>`;
        }
    }
    calcHTML += "<br>";
    return calcHTML;
}

function calcPhysHTML(attacker, defender, dmg, distance_str) {
    return ` <div id="individual_cre_heading" style="display:inline; background-color: ${physCalcColor}">
    ${distance_str}
  <span>Урон <br>
  </span>
  <span>
    <b>${attacker.nametxt}</b> ${attacker.hero === 1 ? "" : ("[" + attacker.nownumber + "]")} по <b>${defender.nametxt}</b> [${defender.nownumber}]: <br>
    <br>
  </span>
</div>
<p id="${0}" style=" background-color: ${physCalcColor}">
  <span style=color:#bfbfbf"></span>
  💀<b style="color:#ffffff; font-size: 120%; text-decoration: underline;">${dmg.min_killed}-${dmg.max_killed}</b> <span style="color:#ffffff">💥${dmg.min}-${dmg.max}</span>
</p>
<br>`;
}

function individual_calc_innerHTML(atk_obj_index, def_obj_index) {
    if (atk_obj_index === undefined || def_obj_index === undefined) return "";
    let cre_collection = unsafeWindow.stage.pole.obj;
    let attacker = cre_collection[atk_obj_index];
    let defender = cre_collection[def_obj_index];
    let dmg = get_dmg_info(atk_obj_index, def_obj_index);
    let distance_str = dmg.distance === "" ? "" : `<p> Прыжок на <u>${dmg.distance}</u> клеток </p>`;
    last_individual_calc.atk_obj_index = atk_obj_index;
    last_individual_calc.def_obj_index = def_obj_index;
    let calcHTML = calcPhysHTML(attacker, defender, dmg, distance_str) + calcHellFireHTML(attacker, defender, cre_collection, dmg) + calcStormHTML(attacker, defender) + (lastturn > 0 ? calcMagicHTML(attacker, defender, cre_collection, dmg) : "");

    return calcHTML;
}

function paint_coords(x, y, color, timeout = 2077) {
    let tile = shado[x + y * defxn]
    if (tile == undefined) return
    tile.fill(color)
    set_visible(tile, 1)

    setTimeout(() => {
        tile.fill(null)
        set_visible(tile, 0)
    }, timeout)
}


function GM_toggle_boolean(GM_key, boolean) {
    boolean = !boolean
    GM_setValue(GM_key, boolean);
    return boolean
}

function set_Display(element_arr, displayProperty) {
    element_arr.forEach(element => {
        if (element == null) return
        element.style.display = displayProperty
    })
}

function readjust_elements() {
    chat = document.getElementById("chat_inside");
    select = document.getElementById("choose_cre")
    refresh_button = document.getElementById("dmg_list_refresh")
    side_button = document.getElementById("change_side")
    collapse_button = document.getElementById("collapse")
    dmg_list_container = document.querySelector("#dmg_list_container")
    individual_calc = document.querySelector("#individual_calc")
    cre_distance_div = document.querySelector("#cre_distance_div")
}
// -----------------------------------
// =========   Настройки ============

let cre_distance = get_GM_value_if_exists('cre_distance', "")
let cre_distance_on = get_GM_value_if_exists('cre_distance_on', false)
let coeff_on = get_GM_value_if_exists('coeff_on', false)
let animation_speed_on = get_GM_value_if_exists("animation_speed_on", false);
let mag_damage_on = get_GM_value_if_exists("mag_damage_on", true);

const new_settings = `
<style>
  .tooltip {
    position: relative;
    display: inline-block;
    text-size: 120%;
    color: brown;
  }

.tooltip .tooltiptext {
    visibility: hidden;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    background-color: #555;
    color: #fff;
    border-radius: 6px;
    word-wrap: break-word;      /* wrap long words */
    white-space: normal;        /* allow multiple lines */
    z-index: 1000;              /* above panel content */
}
    .chat_tooltip{
        min-width: 500%;
    max-width: 700%;
    }
.settings_tooltip{
        min-width: 1500%;
    max-width: 3000%;
}
.tooltip:hover .tooltiptext,
.tooltip:active .tooltiptext {
    visibility: visible;
}

</style>
<div class="info_row">
  <label class="checkbox_container">⚖️коэф. урона<span class="tooltip">🔍<span class="tooltiptext settings_tooltip" style = "transform: translateX(-30%);">отношение урон/хп (т.е. у кого больше всех коэф., с того выгоднее начинать. <br>Работает в списке уронов если нажать на "Список" в чате)</span>
  </span>
    <input type="checkbox" checked="true" id="coeff_on">
    <span class="checkbox_checkmark"></span>
  </label>
</div>
<div class="info_row">
  <label class="checkbox_container">Расстояние между стеками <span class="tooltip">🔍<span class="tooltiptext settings_tooltip" "style = "transform: translateX(-30%);">Расстояние между атакующим и защищающимся стеками. Выбирать расстояние стрелочками в текстовом поле снизу. <br>
    Влияет на статус урона стрелка (ближний/дальний урон, кривая/прямая стрела),
     разбег и прочие абилки, зависящие от расстояния. <br> Если выставить "Расстояние: 1", то стрелок будет считаться заблокированным.
      Если выставить расстояние больше 1,
       то стрелок будет считаться не заблокированным (даже если рядом с ним вражеское существо). </span>
    </span>
    <input type="checkbox" checked="true" id="cre_distance_on">
    <span class="checkbox_checkmark"></span>
  </label>
  <ass style="display: inline-flex; align-items: center; gap: 2px;">
  <button type="button" id="cre_distance_minus" style="padding: 0 4px;">−</button>
  <input type="number" id="cre_distance" style="width: 40px; text-align: center;" value="${cre_distance}">
  <button type="button" id="cre_distance_plus" style="padding: 0 4px;">+</button>
</ass>
</div>
<div class="info_row">
    <label class="checkbox_container">Скорость анимации <span class="tooltip">🔍<span class="tooltiptext settings_tooltip" style = " transform: translateX(-30%);"> Скорость боевых анимаций. <br> Выбирать расстояние стрелочками в текстовом поле снизу или если зажать кнопку Alt и нажимать на стрелки клавиатуры.<br> Включить/выключить анимацию [Alt + P (русская З)].<br> Анимацию можно как ускорить, так и замедлить.<br>Верхний потолок у скорости 20, нижнего нету.<br> Негативный показатель означает скорость ниже возможной гвдшной. </span>
      </span>
      <input type="checkbox" checked="true" id="animation_speed_on">
      <span class="checkbox_checkmark"></span>
    </label>
  <input type="range" id="anim_speed" min="1" max="20" step="1" value="4" style="width:150px;">
  <span id="anim_speed_val">4</span>
</div>
<div class="info_row">
  <label class="checkbox_container">Расчет маг. урона <span class="tooltip"> ⚠️ <span class="tooltiptext" style = " transform: translateX(-30%);"> Расчет магического урона не работает во время расстановки
  </span></span>
    <input type="checkbox" checked="true" id="mag_damage_on">
    <span class="checkbox_checkmark"></span>
  </label>
</div>
`
settings_panel.insertAdjacentHTML("beforeend", new_settings)

let settings_interval = setInterval(() => {
    if (Object.keys(unsafeWindow.stage.pole.obj).length !== 0) {
        initMagicCalc();
        document.querySelector("#mag_damage_on").checked = mag_damage_on;
        document.querySelector("#coeff_on").checked = coeff_on
        document.querySelector("#cre_distance_on").checked = cre_distance_on
        document.querySelector("#animation_speed_on").checked = animation_speed_on;
        let spd = get_GM_value_if_exists("anim_speed", getCurrentBattleSpeed());
        document.getElementById("anim_speed_val").textContent = spd;
        document.querySelector("#anim_speed").value = spd
        if (GM_getValue("animation_speed_on")) setBattleSpeed(spd);
        // авторасстановка в ГВ
        //if (btype === 66) setTimeout(make_ins_but, 1000);
        if (location.href.includes("&lt")) {
            const test = document.querySelector("#pause_button");
            if (test.style.display === "none") {
                show_button("pause_button");
                pause_button_onRelease()
            }

        }
        clearInterval(settings_interval)
    }
}, 300);
let upravaRoot;
const upravaInterval = setInterval(() => {
    upravaRoot = document.querySelector("#win_BattleControl");
    if (!upravaRoot) return;
    else {
        clearInterval(upravaInterval);
        upravaRoot.insertAdjacentHTML("afterbegin",
            `
        <style>
            .hidden {
                display: none;
            }
        </style>
            `);
        insertInput();

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    insertInput();
                }
            });
        });
        const config = { childList: true, subtree: true };
        observer.observe(upravaRoot, config);
    }

}, 100);
const distance_counter = document.getElementById("cre_distance");
const anim_speed_counter = document.querySelector("#anim_speed")


// =========  Event Listeners ============
let speedCount, distance;
document.body.addEventListener('input', function(event) {
    switch (event.target.id) {
        case "cre_distance":
            distance = parseInt(distance_counter.value);
            if (isNaN(distance)) {
                distance_counter.value = "";
                return;
            }
            if (distance < 1) {
                distance_counter.value = 1;
                return;
            }
            if (!cre_distance_on) return
            GM_setValue('cre_distance', distance)
            if (isOpen) refresh()
            individual_calc.innerHTML = individual_calc_innerHTML(last_individual_calc.atk_obj_index, last_individual_calc.def_obj_index)
            cre_distance_div.innerHTML = `Выбранное расстояние: <span style= "color:white">${GM_getValue('cre_distance')}</span><br>`
            break;
        case "anim_speed":
            speedCount = Number(event.target.value);
            GM_setValue('anim_speed', speedCount);
            document.getElementById("anim_speed_val").textContent = document.getElementById("anim_speed").value;
            if (!animation_speed_on) return;
            setBattleSpeed(speedCount);

            break;
    }
});
const anim_speed_input = document.querySelector('#anim_speed')
document.addEventListener('keydown', event => {
    if ((document.querySelector("#chattext") === document.activeElement) || (document.querySelector("#chattext_classic") === document.activeElement)) return;

    const keyCode = parseInt(event.keyCode);
    if (!pressedKeys.has(keyboardKeycodes[triggerKey.toLowerCase()]) || !Object.values(keyboardKeycodes).includes(keyCode)) return;
    if (keyCode === keyboardKeycodes[toggleSpeed.toLowerCase()]) {
        animation_speed_on = GM_toggle_boolean("animation_speed_on", GM_getValue("animation_speed_on"))
        document.querySelector("#animation_speed_on").checked = animation_speed_on
        if (animation_speed_on) {
            GM_setValue('anim_speed', anim_speed_counter.value)
            setBattleSpeed(anim_speed_counter.value);
        } else {
            setBattleSpeed(getCurrentBattleSpeed());
        }
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const increment = event.key === 'ArrowUp' ? 1 : -1;
        anim_speed_input.value = parseInt(anim_speed_input.value) + increment;
        anim_speed_input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (keyCode === keyboardKeycodes[autoBattle.toLowerCase()]) {
        fastbut_onRelease2();
    }
    if (keyCode === keyboardKeycodes[autoPlacement.toLowerCase()]) {
        make_ins_but();
    }
    if (keyCode === keyboardKeycodes[startBattle.toLowerCase()]) {
        document.querySelector("#confirm_ins_img") && triggerMouseUpEvent(document.querySelector("#confirm_ins_img"));
    }
    if (keyCode === keyboardKeycodes[backToGame.toLowerCase()]) {
        if (history.length > 1) {
            back_to_game_button_onRelease();
        } else {
            back_to_home_button_onRelease();
        }
    }
});
document.body.addEventListener('change', function(event) {
    switch (event.target.id) {
        case "mag_damage_on":
            mag_damage_on = GM_toggle_boolean("mag_damage_on", mag_damage_on);
            if (isOpen) refresh();
            individual_calc.innerHTML = individual_calc_innerHTML(last_individual_calc.atk_obj_index, last_individual_calc.def_obj_index)
            break;
        case "coeff_on":
            coeff_on = GM_toggle_boolean("coeff_on", coeff_on);
            if (isOpen) refresh();
            break;
        case "choose_cre":
            chosen.creature = select.value
            refresh()
            break;
        case "cre_distance_on":
            cre_distance_on = GM_toggle_boolean("cre_distance_on", cre_distance_on)
            cre_distance_on ? GM_setValue('cre_distance', distance_counter.value) : GM_setValue('cre_distance', "")
            if (cre_distance_on) {
                cre_distance_div.innerHTML = `<span>Выбранное расстояние: ${GM_getValue('cre_distance')}</span><br>`
                cre_distance_div.style.display = "inline"
                if (isOpen) refresh()
                individual_calc.innerHTML = individual_calc_innerHTML(last_individual_calc.atk_obj_index, last_individual_calc.def_obj_index)
            } else {
                cre_distance_div.innerHTML = ""
            }
            if (isOpen) refresh()
            individual_calc.innerHTML = individual_calc_innerHTML(last_individual_calc.atk_obj_index, last_individual_calc.def_obj_index)
            break;
        case "animation_speed_on":
            animation_speed_on = GM_toggle_boolean("animation_speed_on", GM_getValue("animation_speed_on"))
            if (animation_speed_on) {
                GM_setValue('anim_speed', anim_speed_counter.value)
                setBattleSpeed(anim_speed_counter.value);
            } else {
                setBattleSpeed(getCurrentBattleSpeed());
            }
            break;
    }
});
document.body.addEventListener('click', function(event) {
    if (event.target.parentElement && /speed(.)_button/.test(event.target.parentElement.id)) {
        setBattleSpeed(getCurrentBattleSpeed());
        document.querySelector("#animation_speed_on").checked = false
        GM_setValue('animation_speed_on', false)
    }
    switch (event.target.id) {
        case "dmg_list_refresh":
            readjust_elements()
            refresh()
            break
        case "change_side":
            chosen.afterSideSwitchCre[chosen.side] = chosen.creature
            chosen.side = -chosen.side
            chosen.creature = chosen.afterSideSwitchCre[chosen.side]
            refresh()
            break
        case "collapse":
            readjust_elements()
            isOpen = false
            refresh_button.innerHTML = "Список🔽";
            set_Display([select, side_button, collapse_button, document.querySelector("#chosen_cre_heading"), dmg_list_container, individual_calc, cre_distance_div], "none")
            break;

        case "cre_distance_plus":
            document.getElementById('cre_distance').value = parseInt(document.getElementById('cre_distance').value || 0) + 1;
            document.getElementById('cre_distance').dispatchEvent(new Event('input', { bubbles: true }));
            break;
        case "cre_distance_minus":
            document.getElementById('cre_distance').value = parseInt(document.getElementById('cre_distance').value || 0) - 1;
            document.getElementById('cre_distance').dispatchEvent(new Event('input', { bubbles: true }));
            break;
    }
});

function paint_two_coords() {

}
let calc_attacker, magshot_x, magshot_y;

function manageDamageCalc() {
    // если бой не начался, популизирует mapobj
    if (lastturn < 0) {
        for (const cre of Object.values(stage.pole.obj)) {
            unsafeWindow.mapobj[cre.x + cre.y * defxn] = cre.obj_index;
        }
    }
    let cre_collection = unsafeWindow.stage.pole.obj;
    if (mapobj[xr_last + yr_last * defxn] === undefined || cre_collection[mapobj[xr_last + yr_last * defxn]].rock === 1) {
        paint_coords(xr_last, yr_last, "#cccccc");
        return;
    }
    if (calc_attacker === undefined) {
        calc_attacker = cre_collection[mapobj[xr_last + yr_last * defxn]];
        paint_coords(xr_last, yr_last, "#800000");
        if (calc_attacker.hero === 1) {
            readjust_elements();
            individual_calc.innerHTML = ` <div id="individual_cre_heading" style="display:inline; background-color: ${physCalcColor}">
                  <span>Урон <br>
                  </span>
                    <b>${calc_attacker.nametxt}</b> по
                    <br>
                    </div>
                    `;
        }
    } else {
        readjust_elements();
        let def_obj_index = unsafeWindow.mapobj[xr_last + yr_last * defxn];
        set_Display([individual_calc, collapse_button], "inline");
        if (cre_distance_on) {
            cre_distance_div.style.display = "inline";
            cre_distance_div.innerHTML = `<span>Выбранное расстояние: ${GM_getValue('cre_distance')}</span><br>`
        }
        individual_calc.innerHTML = individual_calc_innerHTML(calc_attacker.obj_index, def_obj_index);
        calc_attacker = undefined;
        paint_coords(xr_last, yr_last, "blue");
    }
}

// если есть настройка подтверждения хода = моб. версия, + поддержка моб версии
const mobileInterval = setInterval(() => {
    if ([typeof android, typeof iOS].includes("undefined")) return;
    clearInterval(mobileInterval);
    if (!android && !iOS) return;
    const helpButtonHTML = `<div id="help_buttonScript" class="toolbars_mobile_img"><span style = "color:white;">урон</span><img id = "help_imgScript" src="https://dcdn.heroeswm.ru/i/combat/btn_help.png?v=6" style="opacity:0.5"><br></div>`
    document.querySelector("#left_button").insertAdjacentHTML("beforeEnd", helpButtonHTML);
    const helpButton = document.querySelector("#help_buttonScript");
    helpButton.addEventListener("touchend", event => {
        calc_x = calc_y = undefined;
        const firstTime = localStorage.getItem("battle_damage_tooltip_mobile_first_time");
        if (!firstTime) {
            localStorage.setItem("battle_damage_tooltip_mobile_first_time", 1);
            alert("Кнопка с вопросительным знаком -- активация просмотра урона в скрипте battle_damage_tooltip. Чтобы посмотреть урон, нужно, чтобы эта кнопка была активной. Тап на атакующее существо (клетка с существом помечается красным цветом), затем тап на атакуемое существо (клетка синим цветом). Урон будет в боевом чате");
        }
        const img = helpButton.querySelector("img");
        img.style.opacity = img.style.opacity === "0.5" ? "1" : "0.5";
        helpButton.classList.toggle("active");
    })
    document.addEventListener("touchend", event => {
        info_btn_cnt = 0;
        if (!helpButton.classList.contains("active") || event.target.id === "help_imgScript" || event.target.tagName !== "CANVAS") return;
        manageDamageCalc();
    })

}, 100);
document.addEventListener("click", event => {
        if (!info_btn_cnt) return;
        info_btn_cnt = 0;
    })
    // Урон одного стека по другому по выбору нажатием кнопки E

window.addEventListener("keyup", event => {
    const keyCode = parseInt(event.keyCode);
    if ((document.querySelector("#chattext") === document.activeElement) || (document.querySelector("#chattext_classic") === document.activeElement)) return;
    if (keyCode === keyboardKeycodes[seeDamage.toLowerCase()]) manageDamageCalc();
    if (event.target.id === "uprava_filter_input") {
        upravaEvent(event);
    }
    if (keyCode === keyboardKeycodes[seeMagShot.toLowerCase()]) {
        if (!magshot_x) {
            [magshot_x, magshot_y] = [xr_last, yr_last]
            paint_coords(xr_last, yr_last, "#FC7052", 4000)
        } else {
            paint_coords(xr_last, yr_last, "#7A71FE", 4000)
            magshot(magshot_x, magshot_y, xr_last, yr_last)
            magshot_x = magshot_y = null
        }
    }

});
// -----------------------------------

// =========  маг. урон ============

const damageSpells = {
    "meteor": "Метеоритный дождь",
    "lighting": "Молния",
    "implosion": "Взрыв",
    "fireball": "Огненный шар",
    "chainlighting": "Цепная молния",
    "firewall": "Огненная стена",
    "magicarrow": "Магическая стрела",
    "stonespikes": "Каменные шипы",
    "magicfist": "Магический кулак",
    "icebolt": "Ледяная глыба",
    "circle_of_winter": "Кольцо холода",
    "swarm": "Осиный рой",
    "angerofhorde": "Ярость орды",
    "poison": "Разложение",
    "stormcaller": "Зов бури",
    "calllightning": "Зов молний",
    "firearrow": "Огненная стрела",
    "divinev": "Божественная месть"

}

function calcFactionModifier(attacker, defender) {
    let modifier, k;
    if ((umelka[attacker['owner']][0] > 0) && (umelka[defender['owner']][0] > 0)) {
        k = umelka[attacker['owner']][0];
        if ((k > 0) && (k < 11)) {
            let j = umelka[defender['owner']][k];
            modifier = 1 - j * 0.03;
        };
    };
    return modifier;
}

function calcHellFire(attacker, defender, cre_collection) {
    const factionModifier = calcFactionModifier(attacker, defender);
    const spellPower = cre_collection[heroes[attacker.owner]].maxnumber;
    const perkModifier = isperk(attacker.obj_index, 104) ? 1.5 : 1;
    const res = Math.floor(Math.round((7 * spellPower + 7) * perkModifier) * factionModifier);
    return res;
}
// добавление spellname_magiceff для объекта для дальнийших расчетов
function initEff(s, activeobj_S) { // s = spell name
    if (stage[war_scr].obj[activeobj_S][s + 'effmain'] > 0) {
        let eff;
        if (stage[war_scr].obj[activeobj_S].hero) {
            var s1 = 0;
            if ((isperk(activeobj_S, 93)) && ((s == 'magicfist') || (s == 'raisedead'))) { s1 = 4; };
            if ((isperk(activeobj_S, 78)) && ((s == 'poison') || (s == 'mpoison'))) { s1 += 5; };
            if ((isperk(activeobj_S, 89)) && ((s == 'poison') || (s == 'mpoison'))) { s1 += 3; };
            eff = (stage[war_scr].obj[activeobj_S][s + 'effmain'] + stage[war_scr].obj[activeobj_S][s + 'effmult'] * (stage[war_scr].getspellpower(activeobj_S, s) + s1));
            if (stage[war_scr].obj[activeobj_S][s + 'effmult'] == 1.5) { eff = Math.round(eff); };
            var teff = eff;
        } else {
            eff = Math.round(stage[war_scr].obj[activeobj_S][s + 'effmain'] + stage[war_scr].obj[activeobj_S][s + 'effmult'] * Math.pow(stage[war_scr].obj[activeobj_S]['nownumber'], 0.7));
            if (s == 'blind') {
                eff = Math.round(stage[war_scr].obj[activeobj_S][s + 'effmain'] + stage[war_scr].obj[activeobj_S][s + 'effmult'] * stage[war_scr].obj[activeobj_S]['nownumber']);
            };
            var teff = eff;
        }
        stage[war_scr].obj[activeobj_S][s + '_magiceff'] = eff;
    }
}

function initMagicCalc() {


    // родной calcmagic с удалением кодом массовых заклов и др. побочных эффектов наведения курсора с активным заклом
    unsafeWindow.stage.pole.calcmagic_script = function calcmagic(atk_x, atk_y, xr, yr, magicuse, penalty = 1) {
        let i = mapobj[atk_x + defxn * atk_y];
        const activeobj_S = i;
        initEff(magicuse, i);
        unsafeWindow.Totalmagicdamage = 0;
        unsafeWindow.Totalmagickills = 0;

        var ok = false;
        unsafeWindow.mul = 1;
        var len = unsafeWindow.stage.pole.obj_array.length;
        for (var k1 = 0; k1 < len; k1++) {
            var j = unsafeWindow.stage.pole.obj_array[k1];
            unsafeWindow.stage.pole.obj[j]['attacked'] = 1;
            unsafeWindow.stage.pole.obj[j]['attacked2'] = 1;
        };

        if ((magicuse == 'magicfist') || (magicuse == 'angerofhorde')) {
            var eff = unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'];
            if ((magicuse == 'magicfist') && (unsafeWindow.stage.pole.obj[mapobj[xr + yr * defxn]]['organicarmor'])) eff = Math.round(eff * 0.2);
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], eff, 'neutral', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'swarm') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'], 'other', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse === "divinev") {
            var separhsum = (stage.pole.obj[mapobj[xr + yr * defxn]].separhsum ? 1 : 0);
            var eff = (stage.pole.obj[i]['divineveffmain'] + Math.round(stage.pole.obj[i]['divineveffmult'] * Math.pow(stage.pole.obj[i]['nownumber'], 0.7))) * Math.sqrt(separhsum);
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], eff, 'other', 'divinev', 0, 0, 0);
            ok = true;
        }
        if ((magicuse == 'magicarrow') || (magicuse == 'lighting')) {
            if (unsafeWindow.stage.pole.obj[activeobj_S]['calllightning']) {
                unsafeWindow.stage.pole.obj[activeobj_S]['lighting_magiceff'] = 50 * unsafeWindow.stage.pole.obj[activeobj_S]['nownumber'];
            };
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'] * mul), 'air', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'firearrow') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'] * mul), 'fire', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'icebolt') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'] * mul), 'cold', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'implosion') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'] * mul), 'earth', magicuse, 0, 0, 0);
            ok = true;
        };

        if (magicuse == 'poison') {
            unsafeWindow.stage.pole.calcpoison(i, mapobj[xr + yr * defxn], unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff']);
            ok = true;
        };
        if (magicuse == 'meteor') {
            var eff = unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'];
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(eff * mul), 'earth', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'chainlighting') {
            var eff = unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'];
            if (unsafeWindow.stage.pole.obj[activeobj_S]['spmult'] > 1) {
                eff = Math.round(unsafeWindow.stage.pole.obj[activeobj_S]['spmult'] * (unsafeWindow.stage.pole.obj[activeobj_S]['chainlightingeffmain'] + unsafeWindow.stage.pole.obj[activeobj_S]['chainlightingeffmult'] * Math.pow(unsafeWindow.stage.pole.obj[activeobj_S]['nownumber'], 0.7)));
            }
            if (penalty === 1) {
                unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(eff * mul), 'air', 'lighting', 0, 0, 0);
            } else {
                unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.floor(Math.round(eff * mul) * penalty), 'air', 'lighting', 0, 0, 0);
            }
            ok = true;
        };

        if (magicuse == 'fireball') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'] * mul), 'fire', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'stormcaller') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S].nownumber * 10), 'air', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'firewall') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'], 'fire', magicuse, 0, 0, 0);
            ok = true;
        };
        if (magicuse == 'circle_of_winter') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'] * mul), 'water', magicuse, 0, 0, 0);
            ok = true;
        };

        if (magicuse == 'stonespikes') {
            unsafeWindow.stage.pole.attackmagic(i, mapobj[xr + yr * defxn], Math.round(unsafeWindow.stage.pole.obj[activeobj_S][magicuse + '_magiceff'] * mul), 'earth', magicuse, 0, 0, 0);
            ok = true;
        };
        return Totalmagicdamage;
    };
    // копипаст с удаленем запрета на показ урона по своим стекам
    stage.pole.attackmagic = function attackmagic(attacker, defender, eff, element, iname, noexp, nodamage, nomult) {
        if (defender == 1000) return 0;
        if ((defender <= 0) || (defender == undefined) || (!this.obj[defender])) return 0;
        if ((this.obj[defender]['rock']) || (this.obj[defender]['hero'])) return 0;
        if (!nomult) nomult = 0;
        if (this.obj[defender]['y'] < 0) return 0;
        if (this.obj[defender]['attacked'] != 1) return 0;

        if ((magic[attacker]['apc']) && (magic[attacker]['apc']['effect'] > 0)) {
            eff *= magic[attacker]['apc']['effect'] / 100;
        };
        if (this.obj[defender]['building']) {
            eff *= 0.05;
        };
        if ((magic[defender]['enc']) && (magic[defender]['enc']['effect'] == 1)) {
            eff *= 0.5;
        };

        if (this.obj[attacker]['forbiddenspell']) {
            eff *= this.check_forbiddenspell(attacker);

        }

        this.obj[defender]['attacked'] = 0;
        if ((this.obj[defender]['owner'] == 2) && ((is_naim_guild(btype)) || ((btype != 13) && (plid2 == -2))) && (this.obj[attacker]['hero'])) {
            eff *= checkmage(this.obj[attacker]['owner'], iname);
        };

        if ((btype == 108) && (checkwall2(this.obj[attacker]['x'], this.obj[attacker]['y'], this.obj[defender]['x'], this.obj[defender]['y'], attacker))) eff *= 0.5;
        if ((btype == 118) && (checkwall2(this.obj[attacker]['x'], this.obj[attacker]['y'], this.obj[defender]['x'], this.obj[defender]['y'], attacker))) eff *= 0.5;


        var hera = 0;
        var herd = 0;
        var len = this.obj_array.length;
        for (var k1 = 0; k1 < len; k1++) {
            var k = this.obj_array[k1];
            if ((this.obj[k].hero) && (this.obj[k].owner == this.obj[attacker].owner)) hera = k;
            if ((this.obj[k].hero) && (this.obj[k].owner == this.obj[defender].owner)) herd = k;
        };

        if ((hera > 0) && (magic[hera]['bna'])) {
            eff = eff * (1 + magic[hera]['bna']['effect'] / 100);
        };
        if ((!this.obj[attacker]['hero']) && (isperk(attacker, _PERK_BLESS))) {
            eff *= 1.04;
        };
        if ((herd > 0) && (magic[herd]['bnd'])) {
            eff = eff / (1 + magic[herd]['bnd']['effect'] / 100);
        };
        if ((herd > 0) && (magic[herd]['fld'])) {
            eff = eff * (1 - magic[herd]['fld']['effect'] / 100);
        };
        if ((herd > 0) && (magic[herd]['rcd']) && (monster_race[this.obj[attacker]['id']] == magic[herd]['rcd']['effect'])) {
            eff = eff * 0.93;
        };

        if ((!this.obj[attacker]['hero']) && (magic[attacker]['zat']) && ((magic[attacker]['zat']['effect'] == 1) || (magic[attacker]['zat']['effect'] == 2))) {
            eff *= 1.15;
        };


        if ((magic[defender]['sum']) && (isperk(attacker, _PERK_EXORCISM)) && (nomult == 0)) {
            eff *= 2;
        };

        eff = this.calceffmagic(attacker, defender, eff, element);
        ignor = 0;
        if ((magic[defender]['mmn']) && (element != 'neutral')) {
            eff *= 1 + magic[defender]['mmn']['effect'] / 100;
        }

        if ((hera > 0) && (this.obj[hera]['hero'])) {
            h = hera;
            if (nomult == 0) {
                if ((magic[h]['_en']) && (element == 'neutral')) {
                    eff *= 1 + magic[h]['_en']['effect'] / 100;
                };
                if ((magic[h]['_ea']) && (element == 'air')) {
                    eff *= 1 + magic[h]['_ea']['effect'] / 100;
                };
                if ((magic[h]['_ew']) && (element == 'cold')) {
                    eff *= 1 + magic[h]['_ew']['effect'] / 100;
                };
                if ((magic[h]['_ef']) && (element == 'fire')) {
                    eff *= 1 + magic[h]['_ef']['effect'] / 100;
                };
                if ((magic[h]['_ee']) && (element == 'earth')) {
                    eff *= 1 + magic[h]['_ee']['effect'] / 100;
                };
            };

            if ((magic[h]['_Ia']) && ((element == 'air') || (iname == 'lighting'))) {
                ignor = magic[h]['_Ia']['effect'] / 100;
            };
            if ((magic[h]['_Iw']) && (element == 'cold')) {
                ignor = magic[h]['_Iw']['effect'] / 100;
            };
            if ((magic[h]['_If']) && (element == 'fire')) {
                ignor = magic[h]['_If']['effect'] / 100;
            };
            if ((magic[h]['_Ie']) && (element == 'earth')) {
                ignor = magic[h]['_Ie']['effect'] / 100;
            };
        };

        magicdamage = Math.round(eff);
        if ((umelka[this.obj[attacker]['owner']][0] > 0) && (umelka[this.obj[defender]['owner']][0] > 0)) {
            var k = umelka[this.obj[attacker]['owner']][0];
            if ((k > 0) && (k < 11)) {
                j = umelka[this.obj[defender]['owner']][k];
                magicdamage = magicdamage * (100 - j * 3) / 100;
            };
        };

        immune = this.getattackimmune(attacker, defender, element, iname, 1);
        if (hera > 0) {
            h = hera;
            if ((magic[h]['nut']) && (plid2 == -2)) {
                magicdamage = magicdamage * (100 + magic[h]['nut']['effect']) / 100;
            };
            if ((magic[h]['imd'])) {
                ignor = 1 - (1 - ignor) * (1 - magic[h]['imd']['effect'] / 100);
            };
            if ((this.obj[defender]['mechanical']) && (magic[hera]['MEC']) && (element == 'neutral')) {
                magicdamage *= 1 + magic[hera]['MEC']['effect'] / 100;
            };
        };



        if (isperk(defender, _PERK_BONEWARD)) {
            immune *= 0.8;
        };
        immune2 = 0;
        if (element != 'neutral') {
            var xx = 0,
                yy = 0,
                xx1 = 0,
                yy1 = 0;

            var bigx = this.obj[defender]['big'];
            var bigy = this.obj[defender]['big'];
            if (this.obj[defender]['bigx']) bigx = 1;
            if (this.obj[defender]['bigy']) bigy = 1;

            for (xx = -1; xx <= 1 + bigx; xx++) {
                for (yy = -1; yy <= 1 + bigy; yy++) {
                    xx1 = this.obj[defender]['x'] + xx;
                    yy1 = this.obj[defender]['y'] + yy;
                    if ((mapobj[xx1 + yy1 * defxn] > 0) && (!this.obj[defender]['magnetism']) && (this.obj[mapobj[xx1 + yy1 * defxn]]['side'] == this.obj[defender]['side']) && (this.obj[mapobj[xx1 + yy1 * defxn]]['magnetism'])) {
                        if (immune2 < this.obj[mapobj[xx1 + yy1 * defxn]]['nownumber']) {
                            immune2 = this.obj[mapobj[xx1 + yy1 * defxn]]['nownumber'];
                            var mg = mapobj[xx1 + yy1 * defxn];
                        };
                        break;
                    };
                };
            };
            immune2 = Math.min(100, immune2);
            if ((this.obj[defender]['enchantedarmor']) && (this.obj[defender]['nownumber'] > 0) && (this.obj[attacker]['side'] == this.obj[defender]['side'])) { immune2 = 100; var mg = defender; };
        };
        if (this.obj[defender]['organicarmor']) ignor = 0;
        immune1 = (100 - (100 - immune) * (1 - ignor));
        dambefore = Math.round(magicdamage * immune1 / 100);
        immune *= 1 - immune2 / 100;
        immune = (100 - (100 - immune) * (1 - ignor));



        magicdamage = Math.round(magicdamage * immune / 100);


        if (magic[defender]['rag']) {
            magicdamage = this.ragedamage(defender, magicdamage);
        };


        Totalmagicdamage += magicdamage;
        var totalh = (this.obj[defender]['nownumber'] - 1) * this.obj[defender]['maxhealth'] + this.obj[defender]['nowhealth'];
        var kills = Math.floor(Math.min(magicdamage, totalh) / this.obj[defender]['maxhealth']);
        var nowhealth = this.obj[defender]['nowhealth'] - (Math.min(magicdamage, totalh) - kills * this.obj[defender]['maxhealth']);
        if (nowhealth <= 0) kills++;
        Totalmagickills += kills;

        if ((magicuse != '') && (defender > 0) && (this.obj[attacker][magicuse + 'elem'] == 'air') && (((this.obj[attacker]['hero']) && (isperk(attacker, 100 /*_PERK_MASTER_OF_STORMS*/ ))) || (this.obj[activeobj]['master_of_storms']))) {
            var a = 0.3;
            if (this.obj[activeobj]['master_of_storms']) a = this.obj[activeobj]['master_of_storms'] / 100;
            init = Math.floor((100 - this.obj[defender]['nowinit'] + this.obj[attacker]['nowinit']) * a);
            this.obj[defender]['reset_init'] = init;
        };
        if ((magicuse != '') && ((magicuse == 'circle_of_winter') || (magicuse == 'icebolt')) && (((this.obj[activeobj]['hero']) && (isperk(activeobj, 99 /*_PERK_MASTER_OF_ICE*/ ))) || (this.obj[activeobj]['master_of_ice']))) {
            var a = 30;
            if (this.obj[activeobj]['master_of_ice']) a = this.obj[activeobj]['master_of_ice'];
            setn_temp_magic(defender, 'cld', a);
        };


    }
    stage.pole.calcpoison = function calcpoison(i, j, eff) {
        var defender = j;
        var attacker = i;

        function experimental() {
            if ((magic[attacker]['apc']) && (magic[attacker]['apc']['effect'] > 0)) {
                eff *= magic[attacker]['apc']['effect'] / 100;
            };
            if (stage.pole.obj[attacker]['forbiddenspell']) {
                eff *= stage.pole.check_forbiddenspell(attacker);
            }
            if ((!stage.pole.obj[attacker]['hero']) && (isperk(attacker, _PERK_BLESS))) {
                eff *= 1.04;
            };
            if ((herd > 0) && (magic[herd]['fld'])) {
                eff = eff * (1 - magic[herd]['fld']['effect'] / 100);
            };
            if ((herd > 0) && (magic[herd]['rcd']) && (monster_race[stage.pole.obj[attacker]['id']] == magic[herd]['rcd']['effect'])) {
                eff = eff * 0.93;
            };
            if ((!stage.pole.obj[attacker]['hero']) && (magic[attacker]['zat']) && ((magic[attacker]['zat']['effect'] == 1) || (magic[attacker]['zat']['effect'] == 2))) {
                eff *= 1.15;
            };
            if ((magic[defender]['sum']) && (isperk(attacker, _PERK_EXORCISM)) && (nomult == 0)) {
                eff *= 2;
            };

            if ((hera > 0) && (stage.pole.obj[hera]['hero'])) {
                h = hera;
                if (nomult == 0) {
                    if ((magic[h]['_ee'])) {
                        eff *= 1 + magic[h]['_ee']['effect'] / 100;
                    };
                };
                if ((magic[h]['_Ie'])) {
                    ignor = magic[h]['_Ie']['effect'] / 100;
                };
            };


        }
        if ((defender <= 0) || (defender == undefined)) return 0;
        if ((stage.pole.obj[defender]['rock']) || (stage.pole.obj[defender]['hero'])) return 0;
        if (stage.pole.obj[defender]['y'] < 0) return 0;
        if (stage.pole.obj[defender]['attacked'] != 1) return 0;
        stage.pole.obj[defender]['attacked'] = 0;
        var hera = 0;
        var herd = 0;
        var attacker = i;
        var len = stage.pole.obj_array.length;
        for (var k1 = 0; k1 < len; k1++) {
            var k = stage.pole.obj_array[k1];
            if ((stage.pole.obj[k].hero) && (stage.pole.obj[k].owner == stage.pole.obj[attacker].owner)) hera = k;
            if ((stage.pole.obj[k].hero) && (stage.pole.obj[k].owner == stage.pole.obj[defender].owner)) herd = k;
        };
        if (stage.pole.obj[j]['absolutepurity']) eff = 0;
        if (stage.pole.obj[j]['building']) eff *= 0.05;
        if (hera > 0) {
            h = hera;
            if (magic[h]['_ee']) {
                eff *= 1 + magic[h]['_ee']['effect'] / 100;
            };
            eff = Math.round(eff);
            if ((hera > 0) && (magic[hera]['bna'])) {
                eff = Math.round(eff * (1 + magic[hera]['bna']['effect'] / 100));
            };
            if ((herd > 0) && (magic[herd]['bnd'])) {
                eff = Math.round(eff / (1 + magic[herd]['bnd']['effect'] / 100));
            };
            if (stage.pole.obj[j]['vulnerabletoshadowmagic']) eff *= 1.25;
        };
        eff = Math.round(eff);
        var magicdamage = eff;
        if ((umelka[stage.pole.obj[attacker]['owner']][0] > 0) && (umelka[stage.pole.obj[defender]['owner']][0] > 0)) {
            var k = umelka[stage.pole.obj[attacker]['owner']][0];
            if ((k > 0) && (k < 11)) {
                j = umelka[stage.pole.obj[defender]['owner']][k];
                magicdamage = magicdamage * (100 - j * 3) / 100;
            };
        };
        magicdamage = Math.round(magicdamage);

        Totalmagicdamage += magicdamage;
        Totalmagicdamage = Math.round(Totalmagicdamage / 1.1);
        var totalh = (stage.pole.obj[defender]['nownumber'] - 1) * stage.pole.obj[defender]['maxhealth'] + stage.pole.obj[defender]['nowhealth'];
        var kills = Math.floor(Math.min(magicdamage, totalh) / stage.pole.obj[defender]['maxhealth']);
        var nowhealth = stage.pole.obj[defender]['nowhealth'] - (Math.min(magicdamage, totalh) - kills * stage.pole.obj[defender]['maxhealth']);
        if (nowhealth <= 0) kills++;
        Totalmagickills += kills;
    };
    unsafeWindow.check_keys = function check_keys(key) {
        if (key == 27) {
            if ((buttons_visible['magicbook_button_close']) || (buttons_visible['magicbook_button_close2']))
                hide_magic_book();
            if (buttons_visible['rune_off_button'])
                rune_button_off_onRelease();
            if (buttons_visible['info_off'])
                info_off_onRelease();
            if ((buttons_visible['oneskill_button_close']) || (buttons_visible['oneskill_button_close2'])) {
                stage[war_scr].oneskillbutton_onRelease();
            };
            hide_button('win_InfoCreature');
            hide_button('win_InfoHero');
            hide_button('win_InfoHero2');
            hide_button('win_InfoCreatureEffect');
        };
        if (chatfocus) {
            if (key == 13) {
                btn_SendChatMessage_release();
            };
            return 0;
        }
        if ((key == 68) && ((buttons_visible['defend_button']) || (buttons_visible['defend_button2'])))
            defend_button_release();
        if (key == 32) {
            if (buttons_visible['pause_button']) {
                pause_button_onRelease();
            } else if (buttons_visible['play_button']) {
                play_button_onRelease();
            };
        };
        if ((key == 87) && ((buttons_visible['wait_button']) || (buttons_visible['wait_button2'])))
            wait_button_release();
        if (key == 67) {
            if ((buttons_visible['magicbook_button']) || (buttons_visible['magicbook_button2']))
                magicbook_button_release();
            else if ((buttons_visible['magicbook_button_close']) || (buttons_visible['magicbook_button_close2']))
                hide_magic_book();
            if ((buttons_visible['oneskill_button']) || (buttons_visible['oneskill_button2']) || (buttons_visible['oneskill_button_close']) || (buttons_visible['oneskill_button_close2'])) {
                stage[war_scr].oneskillbutton_onRelease();
            };
        };
    }
    let defend_button_release = function defend_button_release() {
        if ((is_visible_element('magic_book')) || (buttons_visible['scroll_runes'])) {
            return 0;
        }
        if ((someactive) || (!inserted)) {
            return 0;
        }
        if (Object.values(heroes).includes(activeobj) && activeobj !== 0) {
            if (lastTurnDefended !== lastturn) {
                showPopup("Оборона была одноразово заблокирована");
                lastTurnDefended = lastturn;
                return 0;
            }

        }
        if ((loader.loading) || (activeobj == 0)) {
            return 0;
        }
        if ((info_button) && (android)) {
            return 0;
        };
        loader.loading = true;
        pl_id = player;
        if (player2 > 0)
            pl_id = player2;
        loadmy('battle.php?warid=' + warid + '&move=1&defend=1&pl_id=' + pl_id + '&my_monster=' + activeobj + '&x=' + stage[war_scr].obj[activeobj].x + '&y=' + stage[war_scr].obj[activeobj].y + '&lastturn=' + lastturn + '&lastmess=' + lastmess + '&lastmess2=' + lastmess2 + '&rand=' + mathrandom());
    }
    stage[war_scr].check_timer = () => {
        var anyway = false;
        //    anyway = true; total_time = 396;
        if ((anyway) || ((total_time > 0) && (total_time < 950) && ((!demomode) || (total_time < 100)) && (!battle_ended))) {
            var timer = Math.max(0, total_time - Math.floor((Date.now() - count_time) / 1000));
            ctime = timer;
            if ((anyway) || (timer != lasttimer)) {
                lasttimer = timer;
                if (document.getElementById('timer')) {
                    if ((stage[war_scr]) && (stage[war_scr].ground) && (stage[war_scr].ground.inited_ground)) {
                        show_button('timer');
                    }
                    if (timer <= 5 && activeobj) {
                        document.getElementById('timer').innerHTML = `<span style="color:red">${timer}</span>`;
                    } else {
                        document.getElementById('timer').innerHTML = timer
                    }
                };
                stage[war_scr].scale_timer();

            };
        } else {
            var was_visible = 0;
            if ((stage[war_scr].infos.timer_text) && (btype != 86) && (btype != 87)) {
                if (get_visible(stage[war_scr].infos.timer_text) == 1) was_visible = 1;
                set_visible(stage[war_scr].infos.timer_text, 0);
                if (was_visible) { stage[war_scr].scale_timer(); };
            };
        };
    };
}
// -----------------------------------

// Функция рельсы гвд с поправкой на выбор клеток юзером
function magshot(x1, y1, xr, yr) {
    var x2 = xr;
    var y2 = yr;
    var dx = Math.abs(x1 - x2);
    var dy = Math.abs(y1 - y2);
    var skip = false;
    if (x1 < x2) {
        var xp = 1;
    } else {
        var xp = -1;
    };
    if (y1 < y2) {
        var yp = 1;
    } else {
        var yp = -1;
    };
    if (dx > dy) {
        if (x1 > x2) {
            var x = -5;
        } else {
            var x = defxn + 3 - 1;
        };
        var y = (y2 - y1) / (x2 - x1) * (x - x1) + y1;
    } else {
        if (y1 > y2) {
            var y = -5;
        } else {
            var y = defyn + 5 + 1;
        };
        var x = (x2 - x1) / (y2 - y1) * (y - y1) + x1;
    };
    x = x1;
    y = y1;
    while ((x > 0) && (y > 0) && (x <= defxn - 2) && (y <= defyn)) {
        if (dx > dy) {
            x += xp;
            y = (y2 - y1) / (x2 - x1) * (x - x1) + y1;
        } else {
            y += yp;
            x = (x2 - x1) / (y2 - y1) * (y - y1) + x1;
        };
        let shot_coords = []
        if ((Math.round(x) > 0) && (Math.round(y) > 0) && (Math.round(x) <= defxn - 2) && (Math.round(y) <= defyn)) {
            if (shado[Math.round(x) + Math.round(y) * defxn]) {
                set_visible(shado[Math.round(x) + Math.round(y) * defxn], 1);
                shot_coords.push({ x: Math.round(x), y: Math.round(y) })
            }
        };
        setTimeout(() => {
            for (const coord of shot_coords) {
                set_visible(shado[coord.x + coord.y * defxn], 0);
            }
        }, 4000)
    };
};

// Родная функция гвд с поправками на переменную l и модификаторами magic[]
function attackmonster(attacker, ax, ay, x, y, defender, cre_distance, shootok, koef, inuse) {
    let cre_collection = unsafeWindow.stage.pole.obj
    var mainattack = 1;
    var ax1 = ax;
    var ay1 = ay;
    if (defender == 1000) return 0;
    if (defender <= 0) return 0;
    if (!cre_collection[defender]) return 0;
    if (cre_collection[defender]['hero']) return 0;
    if (cre_collection[defender]['rock']) return 0;
    if (koef == undefined) koef = 1;
    if (inuse == undefined) inuse = '';
    var len = unsafeWindow.wmap2[y * defxn + x];
    if ((cre_collection[attacker].x == x) && (cre_collection[attacker].y == y)) len = spd;
    shootok = 1;

    function getAdjacentAndDiagonalCoords(x, y) {
        const adjacentAndDiagonalCoords = [];
        adjacentAndDiagonalCoords.push([x + 1, y]);
        adjacentAndDiagonalCoords.push([x - 1, y]);
        adjacentAndDiagonalCoords.push([x, y + 1]);
        adjacentAndDiagonalCoords.push([x, y - 1]);
        adjacentAndDiagonalCoords.push([x + 1, y + 1]);
        adjacentAndDiagonalCoords.push([x - 1, y + 1]);
        adjacentAndDiagonalCoords.push([x + 1, y - 1]);
        adjacentAndDiagonalCoords.push([x - 1, y - 1]);
        return adjacentAndDiagonalCoords;
    }

    if (cre_collection[attacker].shots === 0) {
        shootok = 0
    } else {
        let attacker_adjacent_coords = getAdjacentAndDiagonalCoords(stage.pole.obj[attacker].x, stage.pole.obj[attacker].y)
        let enemies_list = Object.values(stage.pole.obj).filter(creature => creature.side != stage.pole.obj[attacker].side)
        enemies_list.forEach(enemy => {
            attacker_adjacent_coords.forEach(coord => {
                if (coord[0] == enemy.x && coord[1] == enemy.y && ![0, -1].includes(enemy.nownumber)) shootok = 0
            })
        })
    }
    if (cre_collection[attacker]['big']) {
        if (ax > x) {
            x++;
        };
        if (ay > y) {
            y++;
        };
    };
    if (cre_collection[attacker]['bigx']) {
        if (ax > x) {
            x++;
        };
    };
    if (cre_collection[attacker]['bigy']) {
        if (ay > y) {
            y++;
        };
    };
    var spd = Math.max(0, Math.round((cre_collection[attacker].speed + cre_collection[attacker]['ragespeed'] + cre_collection[attacker]['speedaddon']) * cre_collection[attacker].speedmodifier));
    if (unsafeWindow.magic[attacker]['ent']) {
        spd = 0;
    };
    var movelen = spd - len;
    unsafeWindow.attacker_c = attacker;
    unsafeWindow.ax_c = ax;
    unsafeWindow.ay_c = ay;
    unsafeWindow.x_c = x;
    unsafeWindow.y_c = y;
    unsafeWindow.defender_c = defender;
    unsafeWindow.shootok_c = shootok;
    if ((x == 0) && (y == 0)) {
        x = cre_collection[attacker]['x'];
        y = cre_collection[attacker]['y'];
    };
    if ((defender > 0) && (cre_collection[defender]['big'])) {
        if ((x - ax > 1) && (ax < x) && (defender == mapobj[ay * defxn + ax + 1])) {
            ax++;
        };
        if ((y - ay > 1) && (ay < y) && (defender == mapobj[(ay + 1) * defxn + ax])) {
            ay++;
        };
        if ((ax - x > 1) && (ax > x) && (defender == mapobj[ay * defxn + ax - 1])) {
            ax--;
        };
        if ((ay - y > 1) && (ay > y) && (defender == mapobj[(ay - 1) * defxn + ax])) {
            ay--;
        };
    };
    if ((defender > 0) && (cre_collection[defender]['bigx'])) {
        if ((x - ax > 1) && (ax < x) && (defender == mapobj[ay * defxn + ax + 1])) {
            ax++;
        };
        if ((ax - x > 1) && (ax > x) && (defender == mapobj[ay * defxn + ax - 1])) {
            ax--;
        };
    };
    if ((defender > 0) && (cre_collection[defender]['bigy'])) {
        if ((y - ay > 1) && (ay < y) && (defender == mapobj[(ay + 1) * defxn + ax])) {
            ay++;
        };
        if ((ay - y > 1) && (ay > y) && (defender == mapobj[(ay - 1) * defxn + ax])) {
            ay--;
        };
    };
    let dx = x - ax;
    let dy = y - ay;
    l = dx * dx + dy * dy;
    if (movelen == undefined) movelen = 0;
    if (cre_distance !== "") {
        movelen = cre_distance
        l = Math.round(cre_distance * cre_distance)
        if (l > 2) shootok = 1
        else shootok = 0
        if (cre_collection[attacker].shots === 0) shootok = 0
    }
    unsafeWindow.PhysicalModifiers = 1;
    unsafeWindow.PhysicalModifiers *= koef;
    if (cre_collection[attacker]['shadowattack']) l = 0;

    var hera = 0;
    var herd = 0;
    len = unsafeWindow.stage.pole.obj_array.length;
    for (var k1 = 0; k1 < len; k1++) {
        unsafeWindow.k = unsafeWindow.stage.pole.obj_array[k1];

        if ((cre_collection[k].hero) && (cre_collection[k].owner == cre_collection[attacker].owner)) hera = unsafeWindow.k;
        if ((cre_collection[k].hero) && (cre_collection[k].owner == cre_collection[defender].owner)) herd = unsafeWindow.k;
    };
    if ((cre_collection[defender]['pirate']) && ((unsafeWindow.magic[defender]['sea']) || (unsafeWindow.gtype == 125) || (unsafeWindow.gtype == 126) || (unsafeWindow.gtype == 133))) {
        unsafeWindow.PhysicalModifiers *= 0.85;
    };
    if (cre_collection[defender]['deadflesh']) {
        unsafeWindow.PhysicalModifiers *= 0.8;
    };
    if (cre_collection[defender]['immaterial']) {
        unsafeWindow.PhysicalModifiers *= 0.65;
    };
    if ((cre_collection[attacker]['oppressionofweak']) && (cre_collection[defender]['level'] == 1)) {
        unsafeWindow.PhysicalModifiers *= 1.5;
    };
    if ((cre_collection[attacker]['fearofstrong']) && (cre_collection[defender]['level'] == 7)) {
        unsafeWindow.PhysicalModifiers *= 0.5;
    };

    if ((defender > 0) && (cre_collection[attacker]['sorcererslayer']) && (cre_collection[defender]['caster']) && (cre_collection[defender]['maxmanna'] > 3)) {
        unsafeWindow.PhysicalModifiers *= 1.4 + 0.02 * Math.max(0, cre_collection[defender]['maxmanna'] - cre_collection[defender]['nowmanna']);
    };
    if ((hera > 0) && (unsafeWindow.magic[hera]['bna'])) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (1 + unsafeWindow.magic[hera]['bna']['effect'] / 100);
        if ((cre_collection[defender]['mechanical']) && (unsafeWindow.magic[hera]['MEC'])) {
            unsafeWindow.PhysicalModifiers *= 1 + unsafeWindow.magic[hera]['MEC']['effect'] / 100;
        };
        if ((cre_collection[attacker]['mechanical']) && (unsafeWindow.magic[hera]['mch'])) {
            unsafeWindow.PhysicalModifiers *= 1 + unsafeWindow.magic[hera]['mch']['effect'] / 100;
        };
    };
    if ((cre_collection[defender]['building']) && (!cre_collection[attacker]['siegewalls'])) {
        unsafeWindow.PhysicalModifiers *= 0.05;
    };
    if ((defender > 0) && (cre_collection[attacker]['cruelty']) && ((cre_collection[defender]['nowhealth'] < cre_collection[defender]['maxhealth']) || (cre_collection[defender]['nownumber'] < cre_collection[defender]['maxnumber']))) {
        unsafeWindow.PhysicalModifiers *= 1.15;
    };
    if ((defender > 0) && (cre_collection[attacker]['morecruelty']) && ((cre_collection[defender]['nowhealth'] < cre_collection[defender]['maxhealth']) || (cre_collection[defender]['nownumber'] < cre_collection[defender]['maxnumber']))) {
        unsafeWindow.PhysicalModifiers *= 1.3;
    };
    if ((cre_collection[attacker]['giantkiller']) && (cre_collection[defender]['big'])) unsafeWindow.PhysicalModifiers *= 2;
    if ((cre_collection[attacker]['pygmykiller']) && (!cre_collection[defender]['big'])) unsafeWindow.PhysicalModifiers *= 1.33;
    if (cre_collection[attacker]['stormstrike']) unsafeWindow.PhysicalModifiers *= 2;
    if ((cre_collection[attacker]['undeadkiller']) && (cre_collection[defender]['undead'])) unsafeWindow.PhysicalModifiers *= 1.5;
    if ((cre_collection[attacker]['pirate']) && (unsafeWindow.magic[defender]['blb'])) unsafeWindow.PhysicalModifiers *= 1.5;
    if ((!cre_collection[attacker]['hero']) && (unsafeWindow.magic[attacker]['zat'])) {
        unsafeWindow.PhysicalModifiers *= 1.15;
    };
    if ((herd > 0) && (unsafeWindow.magic[herd]['bnd'])) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers / (1 + unsafeWindow.magic[herd]['bnd']['effect'] / 100);
    };
    if ((herd > 0) && (unsafeWindow.magic[herd]['fld'])) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (1 - unsafeWindow.magic[herd]['fld']['effect'] / 100);
    };
    if ((herd > 0) && (unsafeWindow.magic[herd]['rcd']) && (monster_race[cre_collection[attacker]['id']] == unsafeWindow.magic[herd]['rcd']['effect'])) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.93;
    };
    if (unsafeWindow.magic[attacker]['prp']) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (1 + unsafeWindow.magic[attacker]['prp']['effect'] / 100);
    };
    if (unsafeWindow.magic[defender]['sta']) {
        unsafeWindow.PhysicalModifiers *= 0.5;
    };
    if ((unsafeWindow.magic[attacker]['chd']) && (cre_collection[unsafeWindow.magic[attacker]['chd']['effect']]['nownumber'] > 0) && (unsafeWindow.magic[attacker]['chd']['effect'] != defender)) {
        unsafeWindow.PhysicalModifiers *= 0.55;
    };
    unsafeWindow.PhysicalModifiers *= unsafeWindow.stage.pole.checkmembrane(defender);
    if (!cre_collection[attacker]['hero']) {
        if ((l <= 2 || shootok === 0) && (cre_collection[attacker]['shooter']) && (!cre_collection[attacker]['nopenalty']) && (!cre_collection[attacker]['warmachine'])) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.5;
        };
        if ((l > 2) && (cre_collection[attacker]['rangepenalty'])) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.5;
        };
        unsafeWindow.rangemod = 1;
        if (l > 2 && (shootok !== 0 || cre_collection[attacker].shots !== 0) && (cre_collection[attacker]['shooter']) && (((cre_collection[attacker]['range'] < Math.sqrt(l)) && (!cre_collection[attacker].shadowattack)) || ((iswalls) && (!cre_collection[attacker]['hero']) && (unsafeWindow.checkwall(x, y, ax, ay))))) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.5;
            unsafeWindow.rangemod = 0.5;
        };
        if (l > 2 && (shootok !== 0 || cre_collection[attacker].shots !== 0) && (cre_collection[attacker]['shooter']) && (iswalls2) && (!cre_collection[attacker]['hero']) && (((!cre_collection[attacker].siegewalls) || (btype == 118)) || (!cre_collection[defender].stone)) && (unsafeWindow.checkwall2(x, y, ax, ay, attacker))) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.5;
            unsafeWindow.rangemod *= 0.5;
        };
    };
    var _PERK_ARCHERY = 11;
    var _PERK_EVASION = 22;
    if ((defender > 0) && ((((cre_collection[attacker].shooter && shootok == 0) || (cre_collection[attacker].shooter != 1) || cre_collection[attacker].shots == 0) && (!cre_collection[attacker]['ballista']) && (inuse != 'ssh') && (inuse != 'mga') && (inuse != 'dcd') && (inuse != 'chs') && (!cre_collection[attacker]['hero'])) || (inuse == 'brs') || (inuse == 'cpt'))) {
        if (cre_collection[defender]['dodge'])
            unsafeWindow.PhysicalModifiers *= 0.5;
        if (cre_collection[defender]['brittle'])
            unsafeWindow.PhysicalModifiers *= 1.25;
    };
    if ((shootok === 1) && (!cre_collection[attacker]['hero']) && (cre_collection[attacker]['shooter'])) {
        if (unsafeWindow.isperk(attacker, _PERK_ARCHERY)) unsafeWindow.PhysicalModifiers *= 1.2;
        if (unsafeWindow.isperk(defender, _PERK_EVASION)) unsafeWindow.PhysicalModifiers *= 0.8;
        if ((!cre_collection[defender]['lshield']) && (unsafeWindow.stage.pole.shieldother(defender))) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.75;
        };
        if ((cre_collection[defender]['lshield']) || (cre_collection[defender]['hollowbones'])) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.5;
        };
        if (cre_collection[defender]['diamondarmor']) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.1;
        };
        if (cre_collection[defender]['shielded']) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 0.75;
        };
        if (cre_collection[defender]['unprotectedtarget']) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * 1.25;
        };
        if (unsafeWindow.magic[defender]['dfm']) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (1 - unsafeWindow.magic[defender]['dfm']['effect'] / 100);
        };
        if (unsafeWindow.magic[attacker]['cnf']) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (1 - unsafeWindow.magic[attacker]['cnf']['effect'] / 100);
        };

        if (hera > 0) {
            if (unsafeWindow.magic[hera]['sat']) {
                unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (100 + unsafeWindow.magic[hera]['sat']['effect']) / 100;
            };
        };
    };
    if ((!cre_collection[attacker]['hero']) && (unsafeWindow.isperk(attacker, _PERK_BLESS))) {
        unsafeWindow.PhysicalModifiers *= 1.04;
    };
    let o = cre_collection[attacker]['owner'];
    if (unsafeWindow.magic[defender]['mf' + o]) {
        unsafeWindow.PhysicalModifiers *= 1 + unsafeWindow.magic[defender]['mf' + o]['effect'] / 100;
    };
    if ((!cre_collection[attacker]['hero']) && (unsafeWindow.isperk(attacker, _PERK_FERVOR))) {
        unsafeWindow.PhysicalModifiers *= 1.03;
    };
    if (hera > 0) {
        var h = hera;
        if ((unsafeWindow.magic[h]['nut']) && ((plid2 == -2) || (ohotnik_set_neutral()))) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (100 + unsafeWindow.magic[h]['nut']['effect']) / 100;
        };
        if ((unsafeWindow.magic[h]['mle']) && ((cre_collection[attacker].shooter && shootok == 0) || (cre_collection[attacker].shooter != 1) || cre_collection[attacker].shots == 0)) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (100 + unsafeWindow.magic[h]['mle']['effect']) / 100;
        };
        if (unsafeWindow.magic[attacker]['fbd']) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (100 + Math.floor(unsafeWindow.magic[attacker]['fbd']['effect'] / 10)) / 100;
        };
    };
    let leap_atk_bonus, leap_distance = 0;

    if (cre_collection[attacker].leap && l >= 4) {
        leap_distance = cre_distance ? cre_distance : Math.min((movelen - 1) * 2, Math.round(Math.sqrt(l)));
        leap_atk_bonus = cre_collection[attacker].attack * (1 + leap_distance * 0.1) - cre_collection[attacker].attack
        cre_collection[attacker]['attackaddon'] += leap_atk_bonus
    }
    unsafeWindow.monatt = cre_collection[attacker]['attack'] + cre_collection[attacker]['attackaddon'] + cre_collection[attacker]['rageattack'];
    if ((defender > 0) && (cre_collection[attacker]['giantslayer']) && (cre_collection[defender]['big'])) unsafeWindow.monatt += 4;
    if ((!cre_collection[attacker]['undead']) && (!cre_collection[attacker]['hero']) && (!cre_collection[attacker]['perseverance'])) {
        unsafeWindow.frig2 = false;
        unsafeWindow.i = attacker;
        var bigx = cre_collection[i]['big'];
        var bigy = cre_collection[i]['big'];
        if (cre_collection[i]['bigx']) bigx = 1;
        if (cre_collection[i]['bigy']) bigy = 1;
        unsafeWindow.xd = cre_collection[i]['x'];
        unsafeWindow.yd = cre_collection[i]['y'];
        for (var xz = unsafeWindow.xd - 1; xz <= unsafeWindow.xd + 1 + bigx; xz++) {
            for (var yz = unsafeWindow.yd - 1; yz <= unsafeWindow.yd + 1 + bigy; yz++) {
                if ((!unsafeWindow.frig2) && (mapobj[yz * defxn + xz] > 0) && (cre_collection[mapobj[yz * defxn + xz]]['side'] != cre_collection[i]['side']) && (cre_collection[mapobj[yz * defxn + xz]]['festeringaura']) && (cre_collection[mapobj[yz * defxn + xz]]['nownumber'] > 0)) {
                    unsafeWindow.monatt -= 4;
                    unsafeWindow.frig2 = true;
                };
            };
        };
    };

    if ((unsafeWindow.magic[attacker]['bsr']) || (unsafeWindow.magic[attacker]['rof'])) {
        unsafeWindow.monatt += Math.floor((cre_collection[attacker]['defence'] + cre_collection[attacker]['defenceaddon'] + cre_collection[attacker]['ragedefence']) * cre_collection[attacker]['defencemodifier']);
    };
    if (herd > 0) {
        h = herd;
        if ((unsafeWindow.magic[h]['mld']) && ((cre_collection[attacker].shooter && shootok == 0) || (cre_collection[attacker].shooter != 1) || cre_collection[attacker].shots == 0)) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (100 - unsafeWindow.magic[h]['mld']['effect']) / 100;
        };
        if ((unsafeWindow.magic[h]['_ia']) && (!cre_collection[attacker]['perseverance'])) {
            unsafeWindow.monatt *= (1 - unsafeWindow.magic[h]['_ia']['effect'] / 100);
        };
        if ((!cre_collection[attacker]['hero']) && (cre_collection[attacker].shooter) && (cre_collection[attacker].shots != 0) && (unsafeWindow.magic[h]['msk']) && shootok == 1) {
            unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (100 - unsafeWindow.magic[h]['msk']['effect']) / 100;
        };
    };
    unsafeWindow.defadd = 0;
    if (cre_collection[defender]['agility']) {
        if (!unsafeWindow.magic[defender]['agl']) unsafeWindow.defadd = cre_collection[defender]['speed'] * 2;
    };
    if ((cre_collection[defender]['spirit']) && (!unsafeWindow.magic[defender]['spi'])) {
        unsafeWindow.PhysicalModifiers *= 0.5;
    };
    if ((cre_collection[attacker]['rageagainsttheliving']) && (cre_collection[defender]['alive'])) {
        unsafeWindow.PhysicalModifiers *= 1.3;
    };
    if ((cre_collection[defender]['defensivestance']) && (!unsafeWindow.magic[defender]['mvd'])) {
        unsafeWindow.defadd += 5;
    };
    if ((!cre_collection[defender]['undead']) && (!cre_collection[defender]['armoured']) && (!cre_collection[defender]['organicarmor'])) {
        unsafeWindow.frig2 = false;
        unsafeWindow.i = defender;
        bigx = cre_collection[i]['big'];
        bigy = cre_collection[i]['big'];
        if (cre_collection[i]['bigx']) bigx = 1;
        if (cre_collection[i]['bigy']) bigy = 1;
        unsafeWindow.xd = cre_collection[i]['x'];
        unsafeWindow.yd = cre_collection[i]['y'];
        for (let xz = unsafeWindow.xd - 1; xz <= unsafeWindow.xd + 1 + bigx; xz++) {
            for (let yz = unsafeWindow.yd - 1; yz <= unsafeWindow.yd + 1 + bigy; yz++) {
                if ((!unsafeWindow.frig2) && (mapobj[yz * defxn + xz] > 0) && (cre_collection[mapobj[yz * defxn + xz]]['side'] != cre_collection[i]['side']) && (cre_collection[mapobj[yz * defxn + xz]]['festeringaura']) && (cre_collection[mapobj[yz * defxn + xz]]['nownumber'] > 0)) {
                    unsafeWindow.defadd -= 4;
                    unsafeWindow.frig2 = true;
                };
            };
        };
    };
    if ((attacker > 0) && (cre_collection[defender]['giantslayer']) && (cre_collection[attacker]['big'])) unsafeWindow.defadd += 4;
    unsafeWindow.mondef = Math.round((cre_collection[defender]['defence'] + cre_collection[defender]['defenceaddon'] + unsafeWindow.defadd + cre_collection[defender]['ragedefence']) * cre_collection[defender]['defencemodifier']);
    if (unsafeWindow.magic[defender]['bsr']) {
        unsafeWindow.mondef = 0;
    };

    if ((cre_collection[attacker]['preciseshot']) && (l > 2) && (l <= 9) && (unsafeWindow.rangemod >= 1)) {
        unsafeWindow.mondef = 0;
    };
    if ((cre_collection[attacker]['ignoredefence'])) {
        unsafeWindow.mondef *= (1 - cre_collection[attacker]['ignoredefence'] / 100);
    };
    if (cre_collection[attacker]['crushingleadership']) {
        var morale_delta = unsafeWindow.stage.pole.getmorale(attacker) - unsafeWindow.stage.pole.getmorale(defender);
        if (morale_delta > 0) {
            unsafeWindow.mondef *= Math.max(0, 1 - morale_delta / 10);
        };
    };
    if (cre_collection[attacker]['sacredweapon']) {
        var dark_count = get_dark_count(defender);
        if (dark_count > 0) {
            unsafeWindow.mondef *= Math.max(0, 1 - 0.15 * dark_count);
        };
    };
    if (unsafeWindow.isperk(attacker, _PERK_PIERCING_LUCK)) {
        unsafeWindow.mondef *= 1 - Math.max(0, 0.025 * (cre_collection[attacker]['luck'] + cre_collection[attacker]['luckaddon']));
    };
    if ((cre_collection[defender]['ignoreattack'])) {
        unsafeWindow.monatt *= (1 - cre_collection[defender]['ignoreattack'] / 100);
    };
    if ((cre_collection[attacker]['ridercharge']) && (movelen > 0)) {
        unsafeWindow.mondef = unsafeWindow.mondef * (5 - movelen) / 5;
    };
    if ((cre_collection[attacker]['forcearrow']) && (!cre_collection[defender]['armoured']) && (!cre_collection[defender]['organicarmor']) && (l > 2)) {
        unsafeWindow.mondef *= 0.8;
    };
    if ((cre_collection[attacker]['armorpiercing']) && (!cre_collection[defender]['armoured']) && (!cre_collection[defender]['organicarmor']) && (l > 2)) {
        unsafeWindow.mondef *= 0.5;
    };
    if (cre_collection[defender]['shroudofdarkness']) {
        unsafeWindow.PhysicalModifiers *= Math.max(0, 1 - 0.15 * get_dark_count(defender));
    };
    if (cre_collection[attacker]['tasteofdarkness']) {
        unsafeWindow.PhysicalModifiers *= 1 + get_dark_count(defender) * 0.12;
    };
    if ((cre_collection[attacker]['jousting']) && (movelen > 0)) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (1 + 0.05 * movelen);
    };
    if (((cre_collection[attacker]['blindingcharge']) || (cre_collection[attacker]['charge'])) && (movelen > 0)) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * (1 + 0.1 * movelen);
    };
    if ((cre_collection[defender]['shieldwall']) && (movelen > 0)) {
        unsafeWindow.PhysicalModifiers = unsafeWindow.PhysicalModifiers * Math.max(0.1, 1 - 0.1 * movelen);
    };
    if ((unsafeWindow.magic[defender]['enc']) && (unsafeWindow.magic[defender]['enc']['effect'] == 1)) {
        unsafeWindow.PhysicalModifiers *= 0.5;
    };
    if ((cre_collection[attacker]['safeposition']) && (movelen == 0)) {
        unsafeWindow.PhysicalModifiers *= 1.5;
    };
    if ((cre_collection[attacker]['agilesteed']) && (movelen > 0)) {
        unsafeWindow.PhysicalModifiers *= 1 - 0.05 * movelen;
    };
    if (unsafeWindow.mondef < 0) {
        unsafeWindow.mondef = 0;
    };

    unsafeWindow.air = 0;
    unsafeWindow.fire = 0;
    unsafeWindow.water = 0;
    unsafeWindow.earth = 0;
    if ((hera > 0) && (!cre_collection[attacker]['taran'])) {
        h = hera;
        if (unsafeWindow.magic[h]['_id']) {
            unsafeWindow.mondef *= (1 - unsafeWindow.magic[h]['_id']['effect'] / 100);
        };
        if (unsafeWindow.magic[h]['_aa']) {
            unsafeWindow.air = unsafeWindow.magic[h]['_aa']['effect'] / 100;
        };
        if (unsafeWindow.magic[h]['_af']) {
            unsafeWindow.fire = unsafeWindow.magic[h]['_af']['effect'] / 100;
        };
        if (unsafeWindow.magic[h]['_aw']) {
            unsafeWindow.water = unsafeWindow.magic[h]['_aw']['effect'] / 100;
        };
        if (unsafeWindow.magic[h]['_ae']) {
            unsafeWindow.earth = unsafeWindow.magic[h]['_ae']['effect'] / 100;
        };
    };
    if ((cre_collection[defender]['armoured']) || (cre_collection[defender]['organicarmor'])) {
        unsafeWindow.mondef = Math.round((cre_collection[defender]['defence'] + cre_collection[defender]['defenceaddon'] + cre_collection[defender]['ragedefence']) * cre_collection[defender]['defencemodifier']);
    };
    if (unsafeWindow.monatt < 0) {
        unsafeWindow.monatt = 0;
    };
    if (unsafeWindow.monatt > unsafeWindow.mondef) {
        unsafeWindow.AttackDefenseModifier = 1 + (unsafeWindow.monatt - unsafeWindow.mondef) * 0.05;
    } else {
        unsafeWindow.AttackDefenseModifier = 1 / (1 + (unsafeWindow.mondef - unsafeWindow.monatt) * 0.05);
    };
    if (cre_collection[attacker]['hero']) {
        unsafeWindow.AttackDefenseModifier = 1;
    };
    var _PERK_ATTACK1 = 8;
    var _PERK_ATTACK2 = 9;
    var _PERK_ATTACK3 = 10;
    var _PERK_DEFENSE1 = 19;
    var _PERK_DEFENSE2 = 20;
    var _PERK_DEFENSE3 = 21;

    if ((!cre_collection[attacker]['hero']) && ((cre_collection[attacker].shooter && shootok == 0) || (cre_collection[attacker].shooter != 1))) {
        if (unsafeWindow.isperk(attacker, _PERK_ATTACK3)) {
            unsafeWindow.PhysicalModifiers *= 1.3;
        } else {
            if (unsafeWindow.isperk(attacker, _PERK_ATTACK2)) {
                unsafeWindow.PhysicalModifiers *= 1.2;
            } else
            if (unsafeWindow.isperk(attacker, _PERK_ATTACK1)) unsafeWindow.PhysicalModifiers *= 1.1;
        };
        if (unsafeWindow.isperk(defender, _PERK_DEFENSE3)) {
            unsafeWindow.PhysicalModifiers *= 0.7;
        } else {
            if (unsafeWindow.isperk(defender, _PERK_DEFENSE2)) {
                unsafeWindow.PhysicalModifiers *= 0.8;
            } else {
                if (unsafeWindow.isperk(defender, _PERK_DEFENSE1)) unsafeWindow.PhysicalModifiers *= 0.9;
            };
        };
    };
    if ((cre_collection[attacker]['siegewalls']) && (cre_collection[defender]['stone'])) {
        unsafeWindow.PhysicalModifiers *= 10;
    };
    var _PERK_COLD_STEEL = 14;
    var _PERK_FIERY_WRATH = 101;
    var _PERK_HELLFIRE_AURA = 123;
    var _PERK_RETRIBUTION = 16;

    if (unsafeWindow.isperk(attacker, _PERK_COLD_STEEL)) unsafeWindow.water = 1 - (1 - unsafeWindow.water) * (0.9);
    if (unsafeWindow.isperk(attacker, _PERK_FIERY_WRATH)) unsafeWindow.fire = 1 - (1 - unsafeWindow.fire) * (0.85);
    if (unsafeWindow.isperk(attacker, _PERK_HELLFIRE_AURA)) unsafeWindow.fire = 1 - (1 - unsafeWindow.fire) * (0.95);

    if (unsafeWindow.magic[attacker]['cre']) {
        unsafeWindow.air = 1 - (1 - unsafeWindow.air) * (1 - unsafeWindow.magic[attacker]['cre']['effect'] / 100);
    };

    if (unsafeWindow.isperk(attacker, _PERK_RETRIBUTION)) unsafeWindow.PhysicalModifiers *= (1 + Math.min(Math.max(unsafeWindow.stage.pole.getmorale(attacker, x, y), 0), 5) / 20);
    if ((cre_collection[attacker]['viciousstrike']) && (Math.max(0, Math.round((cre_collection[defender]['speed'] + cre_collection[defender]['ragespeed'] + cre_collection[defender]['speedaddon']) * cre_collection[defender]['speedmodifier'])) == 0)) unsafeWindow.PhysicalModifiers *= 1.5;
    unsafeWindow.PhysicalModifiers *= unsafeWindow.stage.pole.magicmod(attacker, defender, unsafeWindow.fire, unsafeWindow.air, unsafeWindow.water, unsafeWindow.earth, 0.1);
    if ((cre_collection[attacker]['bloodfrenzy']) && (unsafeWindow.magic[defender]['fd1'])) {
        unsafeWindow.PhysicalModifiers *= 1.3;
    };
    unsafeWindow.UmelkaModifiers = 1;

    if ((umelka[cre_collection[attacker]['owner']][0] > 0) && (umelka[cre_collection[defender]['owner']][0] > 0)) {
        unsafeWindow.k = umelka[cre_collection[attacker]['owner']][0];
        if ((unsafeWindow.k > 0) && (unsafeWindow.k < 11)) {
            let j = umelka[cre_collection[defender]['owner']][k];
            unsafeWindow.UmelkaModifiers = 1 - j * 0.03;
        };
    };
    unsafeWindow.NumCreatures = cre_collection[attacker]['nownumber'];
    let tsc = 0;

    bigx = cre_collection[defender]['big'];
    bigy = cre_collection[defender]['big'];
    if (cre_collection[defender]['bigx']) bigx = 1;
    if (cre_collection[defender]['bigy']) bigy = 1;
    for (var xs = cre_collection[defender]['x'] - 1; xs <= cre_collection[defender]['x'] + 1 + bigx; xs++) {
        for (var ys = cre_collection[defender]['y'] - 1; ys <= cre_collection[defender]['y'] + 1 + bigy; ys++) {
            if ((mapobj[xs + ys * defxn] > 0) && (mapobj[xs + ys * defxn] != defender) && (cre_collection[mapobj[xs + ys * defxn]]['shieldguard']) && (cre_collection[defender]['side'] == cre_collection[mapobj[xs + ys * defxn]]['side'])) {
                tsc++;
            };
        };
    };


    unsafeWindow.PhysicalModifiers /= (tsc + 1);

    var minmag = 0;
    var maxmag = 0;
    if ((inuse == 'lep') && (cre_collection[attacker]['crashingleap'])) {
        unsafeWindow.Totalmagicdamage = 0;
        cre_collection[defender]['attacked'] = 1;
        unsafeWindow.stage.pole.attackmagic(attacker, defender, cre_collection[attacker]['nownumber'] * 4, 'cold', '', 0, 0, 0);
        minmag = unsafeWindow.Totalmagicdamage;
        unsafeWindow.Totalmagicdamage = 0;
        cre_collection[defender]['attacked'] = 1;
        unsafeWindow.stage.pole.attackmagic(attacker, defender, cre_collection[attacker]['nownumber'] * 6, 'cold', '', 0, 0, 0);
        maxmag = unsafeWindow.Totalmagicdamage;
    };

    unsafeWindow.mindam = cre_collection[attacker]['mindam'] + cre_collection[attacker]['damageaddon'] + (cre_collection[attacker]['maxdam'] - cre_collection[attacker]['mindam']) * (cre_collection[attacker]['mindamaddon']) + cre_collection[attacker]['ragedamage'];
    unsafeWindow.maxdam = cre_collection[attacker]['maxdam'] + cre_collection[attacker]['damageaddon'] - (cre_collection[attacker]['maxdam'] - cre_collection[attacker]['mindam']) * (cre_collection[attacker]['maxdamaddon']) + cre_collection[attacker]['ragedamage'];
    h = hera;
    if ((h > 0) && (unsafeWindow.magic[h]) && (unsafeWindow.magic[h]['BLS']) && (unsafeWindow.magic[h]['BLS']['effect'] > 0)) unsafeWindow.mindam = unsafeWindow.maxdam;
    if ((h > 0) && (unsafeWindow.magic[h]) && (unsafeWindow.magic[h]['CRS']) && (unsafeWindow.magic[h]['CRS']['effect'] > 0)) unsafeWindow.maxdam = unsafeWindow.mindam;
    if ((cre_collection[attacker]['taran']) && (cre_collection[defender]['stone'])) {
        h = hera;
        unsafeWindow.mindam = Math.floor(Math.pow(cre_collection[h]['maxhealth'], 0.5) * 200 * cre_collection[attacker]['mindam']);
        unsafeWindow.maxdam = Math.floor(Math.pow(cre_collection[h]['maxhealth'], 0.5) * 400 * cre_collection[attacker]['maxdam']);
    };
    if (cre_collection[attacker]['accuracy']) unsafeWindow.mindam = unsafeWindow.maxdam;
    unsafeWindow.BaseDamage = unsafeWindow.mindam;
    unsafeWindow.PhysicalDamage = unsafeWindow.NumCreatures * unsafeWindow.BaseDamage * unsafeWindow.AttackDefenseModifier * unsafeWindow.PhysicalModifiers * unsafeWindow.UmelkaModifiers + minmag;
    unsafeWindow.PhysicalDamage2 = unsafeWindow.NumCreatures * unsafeWindow.maxdam * unsafeWindow.AttackDefenseModifier * unsafeWindow.PhysicalModifiers * unsafeWindow.UmelkaModifiers + maxmag;
    if ((cre_collection[attacker]['deathstrike']) && (cre_collection[defender]['maxhealth'] < 400) && (!cre_collection[defender]['stone'])) {
        if ((cre_collection[defender]['nownumber'] - 1) * cre_collection[defender]['maxhealth'] + cre_collection[defender]['nowhealth'] > unsafeWindow.PhysicalDamage) {
            unsafeWindow.PhysicalDamage += cre_collection[defender]['maxhealth'] - unsafeWindow.PhysicalDamage % cre_collection[defender]['maxhealth'];
        };
        if ((cre_collection[defender]['nownumber'] - 1) * cre_collection[defender]['maxhealth'] + cre_collection[defender]['nowhealth'] > unsafeWindow.PhysicalDamage2) {
            unsafeWindow.PhysicalDamage2 += cre_collection[defender]['maxhealth'] - unsafeWindow.PhysicalDamage2 % cre_collection[defender]['maxhealth'];
        };
    };

    if (cre_collection[attacker]['bladeofslaughter']) {
        unsafeWindow.PhysicalDamage += Math.min(500, cre_collection[defender]['nownumber'] * 2);
        unsafeWindow.PhysicalDamage2 += Math.min(500, cre_collection[defender]['nownumber'] * 2);
    };
    if (unsafeWindow.magic[attacker]['brk']) {
        unsafeWindow.PhysicalDamage *= (1 + unsafeWindow.magic[attacker]['brk']['effect'] * 0.03);
        unsafeWindow.PhysicalDamage2 *= (1 + unsafeWindow.magic[attacker]['brk']['effect'] * 0.03);
    };
    if (unsafeWindow.PhysicalDamage < 1) {
        unsafeWindow.PhysicalDamage = 1;
    };
    if (unsafeWindow.PhysicalDamage2 < 1) {
        unsafeWindow.PhysicalDamage2 = 1;
    };
    if ((cre_collection[attacker]['magicattack']) && (unsafeWindow.l > 2) && (unsafeWindow.stage.pole.issomething(defender, 'dampenmagic'))) unsafeWindow.PhysicalDamage = 0;
    if (unsafeWindow.magic[defender]['rag']) {
        unsafeWindow.PhysicalDamage = unsafeWindow.stage.pole.ragedamage(defender, unsafeWindow.PhysicalDamage);
        unsafeWindow.PhysicalDamage2 = unsafeWindow.stage.pole.ragedamage(defender, unsafeWindow.PhysicalDamage2);
    };
    if ((cre_collection[attacker]['vorpalsword']) && (cre_collection[defender]['maxhealth'] < 400) && (!cre_collection[defender]['stone'])) {
        unsafeWindow.PhysicalDamage += cre_collection[defender]['maxhealth'];
        unsafeWindow.PhysicalDamage2 += cre_collection[defender]['maxhealth'];
    };

    unsafeWindow.PhysicalDamage = Math.round(unsafeWindow.PhysicalDamage);
    unsafeWindow.PhysicalDamage2 = Math.round(unsafeWindow.PhysicalDamage2);
    if (cre_collection[defender]['pleasureinpain']) {
        unsafeWindow.PhysicalDamage = Math.round(unsafeWindow.PhysicalDamage * 0.9);
        unsafeWindow.PhysicalDamage2 = Math.round(unsafeWindow.PhysicalDamage2 * 0.9);
    };
    if (cre_collection[defender]['raptureinagony']) {
        unsafeWindow.PhysicalDamage = Math.round(unsafeWindow.PhysicalDamage * 0.8);
        unsafeWindow.PhysicalDamage2 = Math.round(unsafeWindow.PhysicalDamage2 * 0.8);
    };
    var totalh = (cre_collection[defender]['nownumber'] - 1) * cre_collection[defender]['maxhealth'] + cre_collection[defender]['nowhealth'];
    unsafeWindow.Uronkills = Math.floor(Math.min(unsafeWindow.PhysicalDamage, totalh) / cre_collection[defender]['maxhealth']);
    unsafeWindow.Uronkills2 = Math.floor(Math.min(unsafeWindow.PhysicalDamage2, totalh) / cre_collection[defender]['maxhealth']);
    var nowhealth = cre_collection[defender]['nowhealth'] - (Math.min(unsafeWindow.PhysicalDamage, totalh) - unsafeWindow.Uronkills * cre_collection[defender]['maxhealth']);
    var nowhealth2 = cre_collection[defender]['nowhealth'] - (Math.min(unsafeWindow.PhysicalDamage2, totalh) - unsafeWindow.Uronkills2 * cre_collection[defender]['maxhealth']);
    if (nowhealth <= 0) unsafeWindow.Uronkills++;
    if (nowhealth2 <= 0) unsafeWindow.Uronkills2++;
    unsafeWindow.tUronkills += unsafeWindow.Uronkills;
    unsafeWindow.tUronkills2 += unsafeWindow.Uronkills2;
    unsafeWindow.tPhysicalDamage += unsafeWindow.PhysicalDamage;
    unsafeWindow.tPhysicalDamage2 += unsafeWindow.PhysicalDamage2;
    if (![0, 1].includes(leap_distance)) cre_collection[attacker].attackaddon -= leap_atk_bonus;
    let leap_display_distance = ""
    if (leap_atk_bonus) leap_display_distance = cre_distance ? "" : leap_distance;
    return { distance: leap_display_distance, leap_atk_bonus: leap_atk_bonus }
}

function get_dmg_info(attacker_obj_index, defender_obj_index, koef = 1) {
    let cre_collection = unsafeWindow.stage.pole.obj
    let attacker = cre_collection[attacker_obj_index]
    let defender = cre_collection[defender_obj_index]
    let dmg_dict = attackmonster(attacker_obj_index, attacker.x, attacker.y, defender.x, defender.y, defender_obj_index, GM_getValue("cre_distance"), 1, koef);
    let min_damage = unsafeWindow.PhysicalDamage
    let max_damage = unsafeWindow.PhysicalDamage2
    let min_killed, max_killed;
    if (min_damage % defender.maxhealth >= defender.nowhealth) min_killed = Math.floor(min_damage / defender.maxhealth) + 1
    else min_killed = Math.floor(min_damage / defender.maxhealth)
    if (max_damage % defender.maxhealth >= defender.nowhealth) max_killed = Math.floor(max_damage / defender.maxhealth) + 1
    else max_killed = Math.floor(max_damage / defender.maxhealth)
    return { min: min_damage, max: max_damage, min_killed: min_killed, max_killed: max_killed, distance: dmg_dict.distance }
}

let defender_obj_id = 0
let selected_id = 0

function refresh() {
    isOpen = true;
    let cre_collection = unsafeWindow.stage.pole.obj;

    if (cre_distance_on) {
        cre_distance_div.style.display = "inline";
        cre_distance_div.innerHTML = `<span>Выбранное расстояние: ${GM_getValue('cre_distance')}</span><br>`;
    }

    set_Display([select, side_button, collapse_button, document.querySelector("#chosen_cre_heading"), dmg_list_container, individual_calc], "inline");

    refresh_button.innerHTML = "🔄";

    let cre_list = Object.values(cre_collection);
    cre_list.sort((a, b) => a.obj_index - b.obj_index);

    dmg_list_container.innerHTML = "";
    [...select.children].forEach(child => child.remove());

    let found_defender = false;

    cre_list.forEach(defender => {
        if (defender.nownumber > 0 && defender.nametxt != "" && defender.side == chosen.side && defender.hero === undefined) {
            let option_id = `cre_no${cre_list.indexOf(defender)}`;
            select.insertAdjacentHTML("beforeend",
                `<option id="${option_id}" value="${defender.obj_index}">
                    ${defender.nametxt} [${defender.nownumber}]
                </option>`
            );

            if (!found_defender) {
                if (`${defender.obj_index}` == chosen.creature) found_defender = true;
                defender_obj_id = defender.obj_index;
                selected_id = [...select.children].indexOf(select.lastChild);
            }
        }
    });

    dmg_list_container.insertAdjacentHTML("beforeend", `
        <div id="chosen_cre_heading" style="display:inline; background-color: ${physCalcColor}">
            <span>Урон по </span>
            <span style="color:#ffffff; font-size: 110%; font-weight: bold;">
                ${cre_collection[defender_obj_id].nametxt} [${cre_collection[defender_obj_id].nownumber}] :
            </span>
        </div>
    `);

    /* ===========================
       COLLECT + CALCULATE
    ============================ */

    let attackerRows = [];

    cre_list.forEach(attacker => {
        if (attacker.side == -chosen.side && attacker.nownumber > 0 && attacker.nametxt != "") {
            let dmg = get_dmg_info(attacker.obj_index, defender_obj_id);
            let practical_overall_hp;

            if (cre_collection[defender_obj_id].attack > attacker.defence) {
                practical_overall_hp = attacker.maxhealth * attacker.nownumber /
                    (1 + 0.05 * Math.abs(cre_collection[defender_obj_id].attack - attacker.defence));
            } else {
                practical_overall_hp = attacker.maxhealth * attacker.nownumber *
                    (1 + 0.05 * Math.abs(cre_collection[defender_obj_id].attack - attacker.defence));
            }

            let coef = evalStrength(attacker, cre_collection[defender_obj_id]).koef;

            attackerRows.push({ attacker, dmg, coef });
        }
    });

    /* ===========================
       SORT BY DANGER COEF (DESC)
    ============================ */

    attackerRows.sort((a, b) => b.coef - a.coef);

    /* ===========================
       RENDER WITH ALTERNATING ROW COLORS
    ============================ */

    const color1 = "#1a1a1a"; // dark row
    const color2 = "#262626"; // slightly lighter row

    attackerRows.forEach((row, index) => {
        let { attacker, dmg, coef } = row;

        let row_id = `row_no${index}`;
        let koef_string = `<span title="коэф. урона">⚖️</span><b style="color:white">${coef.toFixed(2)}</b>`;

        // pick alternating background color
        let bgColor = index % 2 === 0 ? color1 : color2;

        dmg_list_container.insertAdjacentHTML("beforeend", `
            <p id="${row_id}" style="color:white; background-color:${bgColor}; padding:2px 5px; margin:0;">
                <span style="text-decoration: underline;color:#bfbfbf">${attacker.nametxt}</span>
                [${attacker.nownumber}] |
                💀️<b style="color:#bfbfbf">${dmg.min_killed}-${dmg.max_killed}</b>
                 💥${dmg.min}-${dmg.max}
                ${(attacker.hero == undefined && coeff_on) ? koef_string : ""}
            </p>
        `);

        dmg_list_container.insertAdjacentHTML("beforeend",
            calcHellFireHTML(attacker, cre_collection[defender_obj_id], cre_collection, dmg)
        );

        dmg_list_container.insertAdjacentHTML("beforeend",
            calcStormHTML(attacker, cre_collection[defender_obj_id])
        );

        mag_damage_on && lastturn > 0 &&
            dmg_list_container.insertAdjacentHTML("beforeend",
                calcMagicHTML(attacker, cre_collection[defender_obj_id], cre_collection, dmg)
            );
    });

    select.options.item(selected_id).selected = true;
}

initGates();