// ==UserScript==
// @name         Webgame aliance / zebricek - lupa, rozvojky, detaily valek
// @version      2024-06-17
// @description  Lupa
// @author       yS
// @match        *://*.webgame.cz/wg/index.php?p=najit&s=najittag&*
// @match        *://*.webgame.cz/wg/index.php?p=zebricek&s=zebricek*
// @match        *://*.webgame.cz/wg/index.php?p=zebricek
// @match        *://*.webgame.cz/wg/index.php?p=zebricek&limit=*
// @match        *://*.webgame.cz/wg/index.php?p=dotace&s=hhelp
// @match        *://*.webgame.cz/wg/index.php?p=aliance
// @match        *://*.webgame.cz/wg/index.php?p=aliance&s=aliance
// @match        *://*.webgame.cz/wg/index.php?p=aliance&s=asmlouvy
// @match        *://*.webgame.cz/wg/index.php?p=najit&s=najittag*
// @match        *://*.webgame.cz/wg/index.php?p=spojenectvi&s=watchlist
// @match        *://*.webgame.cz/wg/index.php?p=valka&s=strike
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @namespace https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457642/Webgame%20aliance%20%20zebricek%20-%20lupa%2C%20rozvojky%2C%20detaily%20valek.user.js
// @updateURL https://update.greasyfork.org/scripts/457642/Webgame%20aliance%20%20zebricek%20-%20lupa%2C%20rozvojky%2C%20detaily%20valek.meta.js
// ==/UserScript==

"use strict";

const MAX_ACCEPTED_DEVIATION = 0.2;
const INFO_TOO_OLD = 24 * 60 * 60;
const COLUMN_PRESTIGE = 4;
const DATA_SEPARATOR = "<br>";
const HUMKA_LINK = "index.php?p=dotace&s=hhelp";
const ALI_VALKY = "index.php?p=konflikty&s=awarstat&getali=";
const ZOBRAZENE_PREVIEW_INFILTRACE = "show_info_preview";
const PREVIEW_INFILTRACE_TYPE = "info_preview_type"; // 1 = preview next to the members table, 2 = in tooltip

let is_humka = document.location.href.indexOf("hhelp") != -1;
let is_watchlist = document.location.href.indexOf("s=watchlist") != -1;
let is_zebricek = document.location.href.indexOf("zebricek") != -1;
let is_ali = document.location.href.indexOf("aliance") != -1;
let is_smlouvy = document.location.href.indexOf("smlouvy") != -1;
let is_any_ali_detail = document.location.href.indexOf("s=najittag") != -1;
let is_strike = document.location.href.indexOf("index.php?p=valka&s=strike") != -1;

let last_preview_id = null;

let ali_player_count = null;

if (is_humka == true) {
    prepareHumka();
    return;
}

if (is_watchlist) {
    modifyWatchlist();
    return;
}

if (is_strike) {
    modifyStrike();
    return;
}

let ali_tag = null,
    wars_table_id = null;

if (is_ali == true) {
    if (is_smlouvy == true) {
        let element = document.getElementsByName("ali")[0];
        if (element == null) return;
        ali_tag = element.value;

        element = document.querySelector(".infotext strong");
        if (element == null) return;
        ali_player_count = parseInt(element.innerText);

        wars_table_id = "vis_tbl";
    } else {
        getAliDetailPlayerCount();
        rozvojBeerAli();
        ali_tag = getAliTag();
        wars_table_id = "alliance-treaties-wars";
    }
} else {
    const is_info_preview_visible = getSetting(ZOBRAZENE_PREVIEW_INFILTRACE, false);
    const info_preview_type = getSetting(PREVIEW_INFILTRACE_TYPE, 1);

    let table = is_zebricek ? document.getElementById("zebricek") : document.getElementById("alliance-members");

    modifyInfiltrace(table, is_zebricek || info_preview_type == 2);
    rozvojBeer();

    if (is_any_ali_detail == true) {
        getAliPlayerCount();
        addInfiltrationPreviewToggle();

        if (is_info_preview_visible) {
            switch (info_preview_type) {
                case 1:
                    addInfoPreview();
                    break;
                case 2:
                    addInfoPreviewInTooltip(table, false, 660);
                    break;
            }
        }

        let header = document.getElementsByClassName("rdatar")[0];
        ali_tag = header.innerText.split("]")[0].split("[")[1];
        wars_table_id = "find-treaties-wars";

        let smlouva_elements = document.getElementsByClassName("smlouva");
        if (smlouva_elements.length > 0) {
            for (let i = 0; i < smlouva_elements.length; i++) {
                smlouva_elements[i].classList.add("l");
            }
        }
    }
    if (is_zebricek === true) {
        addInfoPreviewInTooltip(table);

        let elements = document.getElementsByClassName("top10separator");
        if (elements.length === 0) {
            return;
        }
        elements[0].colSpan = 100;
    }
}

if (ali_tag != null) {
    let wars_map;
    if (is_smlouvy == true) {
        wars_map = getAktivniValkyInSmlouvy(wars_table_id, ali_tag);
    } else {
        wars_map = getAktivniValky(wars_table_id, ali_tag);
    }
    if (wars_map != null) {
        httpGetAsync(ALI_VALKY + ali_tag, editWarTable, wars_map, ali_tag);
    }
}

//////////////////////////////////////////
//              FUNCTIONS               //
//////////////////////////////////////////

function setSetting(setting_name, value) {
    // eslint-disable-next-line no-undef
    GM_setValue(setting_name, value);
}

function getSetting(setting_name, default_value) {
    // eslint-disable-next-line no-undef
    return GM_getValue(setting_name, default_value);
}

async function modifyStrike() {
    const table = document.getElementById("war-attack-confirm");

    prepareStrike(table);

    let element = table.querySelector("a");
    let parts = element.href.split("=");
    let country_id = parts[parts.length - 1];

    const cloned_nodes = await fetchCountryData(country_id, null);
    if (cloned_nodes == null) {
        return;
    }

    const link = cloned_nodes[0].href;
    const preview_id = link.split("target=")[1];
    last_preview_id = preview_id;

    fetchInfiltrationTable(link, preview_id, 0).then((result) => {
        placeInfiltrationTableNextToTable(result, table);
    });
}

async function modifyWatchlist() {
    let tables = document.getElementsByClassName("vis_tbl");
    let table;

    if (tables.length == 0) {
        return;
    }

    for (let index = 0; index < tables.length; index++) {
        table = tables[index];

        if (table.rows[0].cells.length > 6) {
            break;
        }
    }

    let th = document.createElement("th");
    th.textContent = "Infiltrace";
    table.rows[0].appendChild(th);

    let player_ids = new Set();
    let country_data = new Map();

    for (let index = 1; index < table.rows.length; index++) {
        const row = table.rows[index];
        row.insertCell();

        if (row.cells[3].textContent === "-") {
            continue;
        }

        const country_id = row.cells[1].textContent.split("(#")[1].split(")")[0];

        const player_id = Number(row.cells[2].textContent);
        player_ids.add(player_id);
        country_data.set(country_id, row);

        // cell
    }

    let promises = [];

    for (const player_id of player_ids) {
        promises.push(fetchPlayerData(player_id, country_data));
    }

    Promise.all(promises).then(() => {
        modifyInfiltrace(table, true, 1, false);
        addInfoPreviewInTooltip(table, true, 660, 1);
    });
}

function fetchCountryData(country_id, country_data) {
    let url = "index.php?p=najit&s=najitzem&hid=" + country_id;

    return fetchData(url, country_data);
}

function fetchPlayerData(player_id, country_data) {
    let url = "index.php?p=najit&s=najitzem&hpid=" + player_id;

    return fetchData(url, country_data);
}

function fetchData(url, country_data) {
    return new Promise((resolve) => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                const cloned_nodes = fetchPlayerInfiltrace(xmlHttp, country_data);
                resolve(cloned_nodes);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);

        // httpGetAsync(url, fetchPlayerInfiltrace, country_data);
    });
}

function fetchPlayerInfiltrace(req, country_data) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(req.response, "text/html");

    let infiltration_elements = doc.querySelectorAll("img[alt=Infiltrace]");
    if (infiltration_elements.length == 0) {
        return;
    }

    let row,
        cloned_nodes = [];

    for (let i = 0; i < infiltration_elements.length; i++) {
        const link = infiltration_elements[i].parentElement;
        const url_parts = link.href.split("=");
        const country_id = url_parts[url_parts.length - 1];

        let cloned_node = link.cloneNode(true);
        if (country_data !== null) {
            row = country_data.get(country_id);
            row.cells[row.cells.length - 1].appendChild(cloned_node);
        }
        cloned_nodes.push(cloned_node);
    }
    return cloned_nodes;
}

function prepareHumka() {
    let id_zeme = localStorage.getItem("humka");
    if (id_zeme == null) {
        return;
    }
    localStorage.removeItem("humka");
    let input = document.querySelector("input.subnormal");
    if (input != null) {
        input.value = id_zeme;
    }
}

function rozvojBeerAli() {
    let rozvoj_elements = document.querySelectorAll("td span:not(.on, .off, .onoff)");

    for (let i = 0; i < rozvoj_elements.length; i++) {
        if (rozvoj_elements[i].innerText != "Rozv") {
            continue;
        }

        let row = rozvoj_elements[i].parentElement.parentElement;
        let id_zeme = row.children[2].children[1].href.split("=");
        id_zeme = parseInt(id_zeme[id_zeme.length - 1]);

        let button = createRozvojBeerButton(id_zeme);
        let link = createRozvojBeerLink();
        const button_text = "Rozv ";

        let rozvoj_text = document.createElement("span");
        rozvoj_text.innerText = button_text;
        rozvoj_text.style.fontWeight = "bold";
        rozvoj_elements[i].innerHTML = "";
        rozvoj_elements[i].append(link);

        button.insertBefore(rozvoj_text, button.children[0]);
        link.appendChild(button);
    }
}

function rozvojBeer() {
    let select_query;
    let zeme_name;
    if (is_zebricek) {
        select_query = ".prot.c";
        zeme_name = 5;
    } else {
        select_query = "td.pakt, td.red, .prot";
        zeme_name = 1;
    }

    let rozvoj_elements = document.querySelectorAll(select_query);

    for (let i = 0; i < rozvoj_elements.length; i++) {
        if (rozvoj_elements[i].innerText.indexOf("Rozv") === -1) {
            continue;
        }

        let row = rozvoj_elements[i].parentElement.children[2];
        let id_zeme = row.children[zeme_name].href.split("=");
        id_zeme = parseInt(id_zeme[id_zeme.length - 1]);

        let button = createRozvojBeerButton(id_zeme);
        let link = createRozvojBeerLink();
        const button_text = is_zebricek ? "Rozv " : "(Rozv.) ";

        let rozvoj_text;
        if (is_zebricek && rozvoj_elements[i].children.length > 0) {
            rozvoj_text = rozvoj_elements[i].children[0];
            rozvoj_text.innerText = rozvoj_text.innerText + " ";
            rozvoj_text.classList.add("pakt");
            rozvoj_elements[i].replaceChild(link, rozvoj_text);
        } else {
            rozvoj_text = document.createElement("span");
            rozvoj_text.innerText = button_text;
            rozvoj_text.style.fontWeight = "bold";
            rozvoj_elements[i].innerHTML = "";
            rozvoj_elements[i].append(link);
        }

        button.insertBefore(rozvoj_text, button.children[0]);
        link.appendChild(button);
    }
}

function createRozvojBeerButton(id_zeme) {
    let button = document.createElement("button");
    button.type = "button";
    button.style.backgroundColor = "transparent";
    button.style.cursor = "unset";
    button.style.fontFamily = "unset";
    button.style.color = "unset";
    button.addEventListener("click", () => {
        localStorage.setItem("humka", id_zeme);
    });

    let beer = document.createElement("img");
    beer.src = "img/smiles/icon_beer.gif";
    beer.alt = "Humka";

    button.appendChild(beer);
    return button;
}

function createRozvojBeerLink() {
    let link = document.createElement("a");
    link.style.color = "unset";
    link.href = HUMKA_LINK;
    link.title = "Poslat humanitární pomoc";
    return link;
}

function addInfiltrationPreviewToggle() {
    let table = document.getElementById("find-alliance-summary");
    const cell = table.rows[1].cells[2];

    const is_info_preview_visible = getSetting(ZOBRAZENE_PREVIEW_INFILTRACE, false);
    const info_preview_type = getSetting(PREVIEW_INFILTRACE_TYPE, 1);

    let a = document.createElement("a");
    a.style.marginLeft = "2rem";
    a.title = "Náhled infiltrace zobrazí nejnovější infiltraci vlády pro danou zemi (musí se najet na lupu, nevyžaduje klik)";
    a.textContent = is_info_preview_visible ? "Vypnout náhled infiltrace" : "Zapnout náhled infiltrace";
    a.href = "javascript:void(0)";
    a.addEventListener("click", () => {
        setSetting(ZOBRAZENE_PREVIEW_INFILTRACE, !is_info_preview_visible);
        location.reload();
    });
    cell.appendChild(a);

    a = document.createElement("a");
    a.textContent = info_preview_type === 1 ? "Zobrazit náhled infiltrace v tooltipu" : "Zobrazit náhled infiltrace vedle tabulky";
    a.href = "javascript:void(0)";
    a.style.marginLeft = "2rem";
    a.addEventListener("click", () => {
        setSetting(PREVIEW_INFILTRACE_TYPE, 3 - info_preview_type);
        location.reload();
    });
    cell.appendChild(a);
}

function modifyInfiltrace(table, remove_titles = false, prestige_offset = 0, add_header = !is_zebricek) {
    let lupa_elements = document.querySelectorAll("img[src='img/lupa.gif']");

    if (add_header) {
        let th = document.createElement("th");
        table.rows[0].appendChild(th);
    }
    table.rows[0].children[table.rows[0].children.length - 1].innerHTML = "Infiltrace";

    for (let i = 0; i < lupa_elements.length; i++) {
        let row = lupa_elements[i].parentElement.parentElement.parentElement;

        let columns = row.getElementsByTagName("td");
        let prestige = columns[COLUMN_PRESTIGE + prestige_offset].textContent;

        prestige = parseInt(prestige.replace(/\s/g, ""));

        if (is_zebricek == true) {
            prestige = prestige * 1000;
        }

        modifyMagnifyingGlass(prestige, lupa_elements[i], remove_titles);
    }
}

function getPrestigeDifference(current_prestige, info_prestige, round_to_thousands = false) {
    let prestige_difference = current_prestige - info_prestige;
    if (round_to_thousands) {
        prestige_difference = Math.round(prestige_difference / 1000);
    }
    if (prestige_difference > 0) {
        prestige_difference = "+" + prestige_difference;
    }

    return prestige_difference;
}

function modifyMagnifyingGlass(current_prestige, lupa_element, remove_titles = false) {
    // get image
    if (lupa_element.title == null) {
        return;
    }
    // get title from the image
    let title = lupa_element.title;
    let index = title.indexOf("Prestiž");
    if (index == -1) {
        return;
    }
    // get prestige from the title
    let prestiz = title.substr(index + 8);
    let mil_multiplier = prestiz.slice(-1) == "M" ? 1000 : 1;

    prestiz = parseFloat(prestiz.slice(0, -1) * mil_multiplier) * 1000;
    let prestige_difference = getPrestigeDifference(current_prestige, prestiz, true);
    let parent = lupa_element.parentElement;

    if (current_prestige > prestiz) {
        if (current_prestige - prestiz > prestiz * MAX_ACCEPTED_DEVIATION) {
            parent.parentElement.style = "background:#AA3333"; // current prestige is too high from before -> enemy played / bought
        }
    } else {
        if (prestiz - current_prestige > prestiz * MAX_ACCEPTED_DEVIATION) {
            parent.parentElement.style = "background:#AA3333"; // current prestige is too low from before -> enemy got attacked
        }
    }

    // get date from the title
    let index_start = title.indexOf("]") + 2;
    let index_end = title.indexOf(" |") - 1;
    let time = title.slice(index_start, index_end);

    let time_difference = processTime(time, parent);

    let span = document.createElement("span");
    span.innerText = " " + time_difference + " (" + prestige_difference + "k)";

    if (!remove_titles) {
        span.title = lupa_element.title;
    } else {
        lupa_element.title = "";
    }

    // show how old the info is
    parent.append(span);
}

function getAliDetailPlayerCount() {
    getPlayerCount(0);
}

function getAliPlayerCount() {
    getPlayerCount(1);
}

function getPlayerCount(table_index) {
    let table_elements = document.getElementsByClassName("vis_tbl");
    ali_player_count = table_elements[table_index].rows.length - 3;
}

// funkce valky info
function httpGetAsync(theUrl, callback, wars, ali_tag) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp, wars, ali_tag);
        }
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getAliTag() {
    let elements = document.getElementsByClassName("check-afflict");
    if (elements == null) {
        return;
    }

    let odejit_button = elements[0];
    return odejit_button.dataset.tag;
}

function getAktivniValky(table_id, ali_tag) {
    let table_element = document.getElementById(table_id);
    if (table_element == null) {
        return null;
    }

    table_element.style.textAlign = "center";
    let wars_map = new Map();
    for (let i = 1; i < table_element.rows.length; i++) {
        let row = table_element.rows[i];
        let column = row.children[0];
        if (column.colSpan == 3) {
            continue;
        }
        let enemy_index = 0;
        let enemy_ali = column.children[enemy_index].innerText;
        if (enemy_ali == ali_tag) {
            enemy_index = 1;
            enemy_ali = column.children[enemy_index].innerText;
        }
        wars_map.set(enemy_ali, [table_element.rows[i], enemy_index]);
    }
    return wars_map;
}

function getAktivniValkyInSmlouvy(class_name, ali_tag) {
    let table_element = document.getElementsByClassName(class_name);
    if (table_element == null || table_element.length == 0) {
        return null;
    }
    table_element = table_element[0];

    table_element.style.textAlign = "center";
    let wars_map = new Map();
    for (let i = 1; i < table_element.rows.length; i++) {
        let row = table_element.rows[i];

        let column = row.children[0];
        if (column.colSpan == 3 || column.rowSpan == 2) {
            continue;
        }

        column = row.children[1];
        if (column == null || column.innerText == "Pakt") {
            continue;
        }

        column = row.children[0];

        let enemy_index = 0;
        let enemy_ali = column.children[enemy_index].innerText;
        if (enemy_ali == ali_tag) {
            enemy_index = 1;
            enemy_ali = column.children[enemy_index].innerText;
        }
        wars_map.set(enemy_ali, [table_element.rows[i], enemy_index]);
    }
    return wars_map;
}

function processWars(response, wars_map, ali_tag) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.response, "text/html");
    let tables = doc.querySelectorAll(".container .vis_tbl");
    let keys = Array.from(wars_map.keys());

    // projit tabulky

    const wars_data = new Map();
    // ziskat nazev ali ve valce
    let offset = tables[0].rows[0].children[0].innerText == "Věk skončil" ? 1 : 0;

    for (let i = 1 + offset; i < tables.length; i++) {
        const table = tables[i];

        if (table.rows[1].children.length != 3) {
            continue;
        }

        let ali_1 = table.rows[2].cells[1].textContent; //vyhlasujici ali
        let ali_2 = table.rows[2].cells[2].textContent; //ali, na kterou bylo vyhlaseno

        let my = 2;
        let key = ali_1;
        if (ali_1 == ali_tag) {
            my = 1;
            key = ali_2;
        }
        if (keys.includes(key) == false) {
            continue;
        }

        // vytezit "neaktivni muze byt za ...."
        let neaktivni_za_element = table.rows[1].cells[2];

        // vytezit dobyte uzemi (my / oni)
        let dobyte_uzemi_1 = parseInt(table.rows[3].cells[my].innerText);
        let dobyte_uzemi_2 = parseInt(table.rows[3].cells[3 - my].innerText);

        // vytezit normalni utoky + celkove (jestli je splneno / porovnani vuci nam)
        let normalni_utoky_1 = parseInt(table.rows[8].cells[my].innerText);
        let normalni_utoky_2 = parseInt(table.rows[8].cells[3 - my].innerText);

        let celkem_utoky_1 = parseInt(table.rows[10].cells[my].innerText);
        let celkem_utoky_2 = parseInt(table.rows[10].cells[3 - my].innerText);

        let expy_1 = parseInt(table.rows[7].cells[my].textContent);
        let expy_2 = parseInt(table.rows[7].cells[3 - my].textContent);

        let zacatek_war = table.rows[1].children[0].children[0].innerText;

        let war = {
            dobyte_uzemi_my: dobyte_uzemi_1,
            dobyte_uzemi_oni: dobyte_uzemi_2,
            normalni_utoky_my: normalni_utoky_1,
            normalni_utoky_oni: normalni_utoky_2,
            celkem_utoky_my: celkem_utoky_1,
            celkem_utoky_oni: celkem_utoky_2,
            celkem_zkusenosti_my: expy_1,
            celkem_zkusenosti_oni: expy_2,
            neaktivni_element: neaktivni_za_element,
            nase_war: my == 1,
            zacatek_war: zacatek_war,
        };

        // vratit asi v mape, klic - ali, se kterou valcime, obsah = vytezene udaje
        wars_data.set(key, war);
        let index = keys.indexOf(key);
        keys.splice(index, 1);
        if (keys.length == 0) {
            break;
        }
    }
    return wars_data;
}

function editWarTable(response, wars_map, ali_tag) {
    const konflikty_url = "index.php?p=konflikty&hours_9=72&spec=9&alia_9=$ali_a$&alib_9=$ali_b$";
    let wars_data = processWars(response, wars_map, ali_tag);

    let keys = Array.from(wars_map.keys());
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const tr = wars_map.get(key)[0];
        const war_data = wars_data.get(key);
        const enemy_index = wars_map.get(key)[1];

        let anchor = document.createElement("a");
        anchor.style.display = "block";
        anchor.style.width = "100%";
        anchor.style.height = "100%";
        anchor.href = konflikty_url.replace("$ali_a$", ali_tag).replace("$ali_b$", key);
        tr.cells[1].appendChild(anchor);

        const valka_text = anchor.previousElementSibling;
        valka_text.style.fontSize = "11px";
        anchor.appendChild(valka_text);

        let img = document.createElement("img");
        img.style.margin = "auto 0.3rem";
        img.src = "img/konflikty.gif";
        anchor.appendChild(img);

        addRow(tr, war_data, enemy_index);
    }
}

function addRow(tr, war_data, enemy_index) {
    let new_tr = document.createElement("tr");

    tr.parentElement.insertBefore(new_tr, tr.nextSibling);

    // probiha
    let time_difference = processTime(war_data.zacatek_war, null, true);
    if (is_smlouvy != true) {
        tr.children[2].innerText += " (Probíhá už " + time_difference + ")";
    } else {
        tr.previousElementSibling.children[0].innerText += "\n (Probíhá už " + time_difference + ")";
    }

    // COLUMN
    let td = document.createElement("td");

    let div = document.createElement("div");
    div.innerText = "Útoky celkem (normální):";
    td.append(div);
    if (is_smlouvy == true) {
        td.colSpan = 2;
    }

    let theirs_text = war_data.celkem_utoky_oni + " (" + war_data.normalni_utoky_oni + ")";
    let ours_text = war_data.celkem_utoky_my + " (" + war_data.normalni_utoky_my + ")";
    div = document.createElement("div");
    div.innerText = processText(ours_text, theirs_text, enemy_index == 0);
    td.append(div);

    if (war_data.nase_war == true) {
        if (war_data.celkem_utoky_my < ali_player_count * 5 || war_data.normalni_utoky_my < ali_player_count) {
            let total_attacks = Math.max(ali_player_count * 5 - war_data.celkem_utoky_my, 0);
            let total_normal_attacks = Math.max(ali_player_count - war_data.normalni_utoky_my, 0);
            let war_completed_text = "Nesplněno, chybí: " + total_attacks + " (" + total_normal_attacks + ")";

            div = document.createElement("div");
            div.style.color = "red";
            div.innerText = war_completed_text;
            td.append(div);
        }
    }

    new_tr.append(td);
    // COLUMN END

    // COLUMN
    td = document.createElement("td");

    let container = document.createElement("div");
    container.style.display = "inline-flex";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";
    container.style.alignContent = "center";
    container.style.width = "70%";
    td.appendChild(container);

    let wrapper = document.createElement("div");
    container.appendChild(wrapper);

    div = document.createElement("div");
    div.innerText = "Dobyté území:";
    wrapper.append(div);

    div = document.createElement("div");
    div.innerText = processText(formatNumber(war_data.dobyte_uzemi_my) + "km²", formatNumber(war_data.dobyte_uzemi_oni) + "km²", enemy_index == 0);
    wrapper.append(div);

    wrapper = document.createElement("div");
    container.appendChild(wrapper);

    div = document.createElement("div");
    div.innerText = "Získané zkušenosti:";
    wrapper.append(div);

    div = document.createElement("div");
    div.innerText = processText(formatNumber(war_data.celkem_zkusenosti_my), formatNumber(war_data.celkem_zkusenosti_oni), enemy_index == 0);
    wrapper.append(div);

    new_tr.append(td);
    // COLUMN END

    new_tr.append(war_data.neaktivni_element);
}

function processText(ours_text, theirs_text, is_enemy_on_left) {
    if (is_enemy_on_left == false) {
        return ours_text + " x " + theirs_text;
    }
    return theirs_text + " x " + ours_text;
}

function processTime(time_text, parent, time_reversed = false) {
    let index = time_reversed ? 1 : 0;

    // get date from the title
    let separate_time = time_text.split(" ");
    let split_date = separate_time[1 - index].split(".");
    let split_hours = separate_time[index].split(":");

    let current_date = new Date();
    let info_date = new Date();

    info_date.setMonth(split_date[1] - 1, split_date[0]);
    info_date.setHours(split_hours[0], split_hours[1]);

    if (current_date.getMonth() == 0 && info_date.getMonth() == 11) {
        info_date.setFullYear(current_date.getFullYear() - 1);
    }

    // get time difference from the infiltration
    let time_difference = current_date.getTime() - info_date.getTime();
    time_difference = time_difference / 1000;
    if (parent != null && time_difference > INFO_TOO_OLD) {
        // info is too old
        parent.parentElement.style = "background:#AA3333";
    }

    let hour_difference = Math.floor(time_difference / 60 / 60);
    let minute_difference = Math.floor((time_difference / 60 / 60 - hour_difference) * 60);
    if (minute_difference < 10) {
        minute_difference = "0" + minute_difference;
    }
    return hour_difference + ":" + minute_difference;
}

function addInfoPreviewInTooltip(table, shift_to_left = true, tooltip_width = 600, prestige_offset = 0, show_info_difference = true) {
    const styles = `.tooltip { position: relative; }
        .tooltip .tooltiptext { visibility: hidden; width: ${tooltip_width}px; top: 100%; left: 50%; margin-left: -${
        shift_to_left ? tooltip_width * 0.9 : tooltip_width / 2
    }px; background-color: #363636; color: #fff; text-align: left; padding: 5px 5px; margin-top: 10px; border-radius: 6px; border: 1px solid white; position: absolute; z-index: 1; }
        .tooltip:hover .tooltiptext { visibility: visible; }
        .tooltip .tooltiptext::after { content: ' '; position: absolute; bottom: 100%; left: ${
            shift_to_left ? 95 : 50
        }%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: transparent transparent white transparent; }
        .tooltiptext > div:last-child { font-weight: bold; }
        .form-item { display: block; width: 100%; height: 100%; padding: 6px 0; box-sizing: border-box; text-align: center; }`;
    addCss(styles);

    let images = table.querySelectorAll(`td a [alt=Infiltrace]`);

    images.forEach((image) => {
        const link = image.closest("a");
        // vzit funkci na fetchnuti + jeji vysledek, hodit mimo, zavolat na strance utoku, hodit to do tabulky vedle
        link.addEventListener("mouseenter", () => {
            const preview_id = link.href.split("target=")[1];

            last_preview_id = preview_id;

            const parent = link.parentElement;

            let tooltiptext = parent.querySelector(".tooltiptext");
            if (tooltiptext !== null) {
                return;
            }

            let original_prestige = 0;
            if (show_info_difference) {
                const row = link.closest("tr");
                original_prestige = row.cells[COLUMN_PRESTIGE + prestige_offset].textContent;
                original_prestige = original_prestige.replace(/\s/g, "").replace("k", "000");
                original_prestige = Number(original_prestige);
            }

            fetchInfiltrationTable(link.href, preview_id, original_prestige).then((result) => {
                wrapInfiltrationTableInTooltip(result, parent, show_info_difference);
            });
        });
    });
}

function wrapInfiltrationTableInTooltip(result, parent, show_info_difference = true) {
    const wrapper = wrapInfiltrationTableBase(result, show_info_difference);

    let container = document.createElement("div");
    container.classList.add("tooltiptext");
    container.appendChild(wrapper);

    parent.classList.add("tooltip");
    parent.appendChild(container);
}

function placeInfiltrationTableNextToTable(result, sibling_table, show_info_difference = false) {
    const new_table = wrapInfiltrationTableBase(result, show_info_difference);
    const wrapper = sibling_table.parentElement;

    wrapper.children[2].remove();
    wrapper.appendChild(new_table);

    new_table.style.margin = "5px 0";
}

function prepareStrike(table) {
    const wrapper = document.createElement("div");

    const empty_div = function () {
        let empty = document.createElement("div");
        empty.style.width = "1px";
        empty.style.height = "1px";
        return empty;
    };

    table.parentElement.insertBefore(wrapper, table);
    wrapper.appendChild(empty_div());
    wrapper.appendChild(table);
    wrapper.appendChild(empty_div());

    table.style.margin = "5px 0";
    table.style.height = "fit-content";

    wrapper.style.display = "grid";
    wrapper.style.gap = "1rem";
    wrapper.style.gridTemplateColumns = "4fr 3fr 4fr";
}

function wrapInfiltrationTableBase(result, show_info_difference = true) {
    let wrapper = document.createElement("div");
    wrapper.style.width = "fit-content";
    wrapper.style.marginLeft = "auto";
    wrapper.style.marginRight = "auto";

    let time_parts = result.values.date.split(".");
    let time = time_parts[0] + "." + time_parts[1] + " " + time_parts[2];
    let time_difference = processTime(time, null, true);
    time_parts = time_difference.split(":");
    let time_difference_in_seconds = (Number(time_parts[0]) * 60 + Number(time_parts[1])) * 60;

    // prestige on the info
    let p = document.createElement("p");
    p.textContent = "Prestiž v infiltraci: \t" + formatNumber(result.values.prestige);
    wrapper.append(p);
    //

    // prestige difference
    if (show_info_difference) {
        let prestige_difference_percentage = Math.round(((result.values.original_prestige / result.values.prestige) * 100.0 - 100) * 10) / 10;
        if (prestige_difference_percentage > 0) prestige_difference_percentage = "+" + prestige_difference_percentage;
        p = document.createElement("p");
        p.textContent = "Rozdíl prestiže: " + formatNumber(getPrestigeDifference(result.values.original_prestige, result.values.prestige)) + " (" + prestige_difference_percentage + "%)";
        if (result.values.original_prestige > result.values.prestige) {
            if (result.values.original_prestige - result.values.prestige > result.values.prestige * MAX_ACCEPTED_DEVIATION) {
                p.classList.add("red"); // current prestige is too high from before -> enemy played / bought
            }
        } else {
            if (result.values.prestige - result.values.original_prestige > result.values.prestige * MAX_ACCEPTED_DEVIATION) {
                p.classList.add("red"); // current prestige is too low from before -> enemy got attacked
            }
        }
        wrapper.append(p);
    }

    // date of infiltration
    p = document.createElement("p");
    p.textContent = "Datum: " + time;
    wrapper.append(p);
    //

    //
    p = document.createElement("p");
    p.textContent = "Stáří: " + time_difference;

    if (time_difference_in_seconds > INFO_TOO_OLD) {
        p.classList.add("red");
    }
    wrapper.append(p);

    wrapper.append(result.table);

    return wrapper;
}

function fetchInfiltrationTable(url, preview_id, original_prestige) {
    let promise = fetchInfoTable(url, preview_id, original_prestige);
    return promise.then(
        (values) => {
            return {
                values: values,
                table: values.table.cloneNode(true),
            };
        },
        (reason) => {
            console.log("Rejected - " + reason);
        }
    );
}

function addInfoPreview() {
    const css =
        "#alliance-members { margin: 5px 0px; } " +
        "#alliance-members a { font-size: 11px; } " +
        "#tables_container { display: flex; align-items: flex-start; justify-content: space-between; width: 90%; margin: 0px auto; } " +
        "#info_preview_container { max-width: 550px; width: 100%; } " +
        "#info_preview p { font-weight: bold; margin-left: 5px; font-size: 14px; white-space: pre; } " +
        "#info_preview .minus { padding: unset; } ";
    addCss(css);

    let container = document.createElement("div");
    container.id = "tables_container";

    let members_table = document.getElementById("alliance-members");
    members_table.parentElement.insertBefore(container, members_table);
    container.appendChild(members_table);

    let links = members_table.querySelectorAll("tr td:last-of-type a");

    let info_preview_container = document.createElement("div");
    info_preview_container.id = "info_preview_container";
    container.appendChild(info_preview_container);

    let header = document.createElement("h2");
    header.textContent = "Náhled infiltrace:";
    info_preview_container.appendChild(header);

    let info_preview_wrapper = document.createElement("div");
    info_preview_wrapper.id = "info_preview";
    info_preview_container.appendChild(info_preview_wrapper);

    links.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            const preview_id = link.href.split("target=")[1];

            if (last_preview_id !== preview_id) {
                last_preview_id = preview_id;
            } else {
                return;
            }

            let original_prestige = Number(link.parentElement.parentElement.cells[4].textContent);

            let promise = fetchInfoTable(link.href, preview_id, original_prestige);
            promise.then(
                (values) => {
                    if (preview_id === last_preview_id) {
                        let time_parts = values.date.split(".");
                        let time = time_parts[0] + "." + time_parts[1] + " " + time_parts[2];
                        let time_difference = processTime(time, null, true);
                        time_parts = time_difference.split(":");
                        let time_difference_in_seconds = (Number(time_parts[0]) * 60 + Number(time_parts[1])) * 60;
                        let prestige_difference_percentage = Math.round(((values.original_prestige / values.prestige) * 100.0 - 100) * 10) / 10;
                        if (prestige_difference_percentage > 0) prestige_difference_percentage = "+" + prestige_difference_percentage;

                        // copy infiltration table, parse it to the info_preview_wrapper (clear it before)
                        let info_preview_wrapper = document.getElementById("info_preview");
                        info_preview_wrapper.innerHTML = "";

                        // prestige on the info
                        let p = document.createElement("p");
                        p.textContent = "Prestiž v infiltraci: \t" + formatNumber(values.prestige);
                        info_preview_wrapper.append(p);
                        //

                        // prestige difference
                        p = document.createElement("p");
                        p.textContent = "Rozdíl prestiže: \t" + formatNumber(getPrestigeDifference(values.original_prestige, values.prestige)) + " (" + prestige_difference_percentage + "%)";
                        if (values.original_prestige > values.prestige) {
                            if (values.original_prestige - values.prestige > values.prestige * MAX_ACCEPTED_DEVIATION) {
                                p.classList.add("red"); // current prestige is too high from before -> enemy played / bought
                            }
                        } else {
                            if (values.prestige - values.original_prestige > values.prestige * MAX_ACCEPTED_DEVIATION) {
                                p.classList.add("red"); // current prestige is too low from before -> enemy got attacked
                            }
                        }
                        info_preview_wrapper.append(p);

                        // date of infiltration
                        p = document.createElement("p");
                        p.textContent = "Datum: \t\t\t" + time;
                        info_preview_wrapper.append(p);
                        //

                        //
                        p = document.createElement("p");
                        p.textContent = "Stáří: \t\t\t" + time_difference;

                        if (time_difference_in_seconds > INFO_TOO_OLD) {
                            p.classList.add("red");
                        }
                        info_preview_wrapper.append(p);
                        //

                        let copied_table = values.table.cloneNode(true);
                        info_preview_wrapper.append(copied_table);
                    }
                },
                (reason) => {
                    console.log("Rejected - " + reason);
                }
            );
        });
    });
}

async function fetchInfoTable(all_info_url, preview_id, original_prestige) {
    // create promise, request country's infiltration, get the most recent infiltration (typ = vlada)
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.open("GET", all_info_url);
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(req.response, "text/html");

                let result = getLastInfiltration(doc);
                result.original_prestige = original_prestige;

                if (result == null) {
                    reject("Země nemá infiltrovanou vládu");
                }

                resolve(result);
            } else {
                console.log("File not found");
            }
        };
        req.send();
        // request the most recent infiltration
    }).then(
        (result) => {
            return new Promise(function (resolve, reject) {
                if (preview_id !== last_preview_id) {
                    reject("Nejsou nadále relevantní data.");
                }

                let req = new XMLHttpRequest();
                req.open("GET", result.url);
                req.onload = function () {
                    if (req.readyState == 4 && req.status == 200) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(req.response, "text/html");

                        // enhance the table
                        result.table = modifyTable(doc);

                        resolve(result);
                    } else {
                        console.log("File not found");
                    }
                };
                req.send();
                // request the most recent infiltration page
            });
        },
        (reason) => {
            return new Promise(function (reject) {
                reject(reason);
            });
        }
    );
}

function getLastInfiltration(doc) {
    const wanted_info_typ = "vláda";

    let rows = doc.querySelector("form table:not(#konfliktyup)").rows;
    let link,
        date,
        prestige,
        found = false;

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.cells[1].innerText == wanted_info_typ) {
            found = true;
            link = row.cells[4].children[0].href;
            date = row.cells[0].textContent;
            prestige = row.cells[3].textContent;
            break;
        }
    }

    if (found) {
        return {
            url: link,
            prestige: prestige,
            date: date,
        };
    }

    return null;
}

function modifyTable(doc = document, compact_mode = true) {
    let table_summary = doc.getElementById("spy-message-summary");
    let info_type = getInfoType(table_summary);
    if (info_type == null) {
        console.log("Nezměněný typ infiltrace");
        return;
    }

    let table_detail = doc.getElementById("spy-message-detail");

    let prestiz = getPrestiz(table_summary);
    let header_row = table_detail.children[0].children[0];
    let data_row = table_detail.children[0].children[1];

    addColumnInfo(doc, header_row, data_row, prestiz, info_type);
    if (info_type == 0) {
        // vlada
        addArmyData(data_row);

        if (compact_mode) {
            const element_to_edit = table_detail.children[0].children[1];
            element_to_edit.getElementsByTagName("sup")[0].remove(); // remove ^2 from km^2

            const values_to_replace = [
                "Obchodní zóny",
                "Zábavní střediska",
                "Vojenské základny",
                "Stavební firmy",
                "Nezastavěné území",
                "Rychlost stavby",
                "Hustota zalidnění",
                "Automatizace továren",
                "Cena na dom.trhu",
                "Protiraketová obrana",
                "Síla rozvědky",
                "Výzkum vesmíru",
            ];
            const replace_with_values = ["O. zóny", "Střediska", "Základny", "S. firmy", "Nezastavěno", "R. Stavby", "H. zalidnění", "A. továren", "Dom. trh", "SDI", "Rozvědka", "Vesmír"];

            let innerHTML = replaceBulk(element_to_edit.innerHTML, values_to_replace, replace_with_values);
            element_to_edit.innerHTML = innerHTML;
        }
    }

    return table_detail;
}

function replaceBulk(str, findArray, replaceArray) {
    var i,
        regex = [],
        map = {};
    for (i = 0; i < findArray.length; i++) {
        regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, "\\$1"));
        map[findArray[i]] = replaceArray[i];
    }
    regex = regex.join("|");
    str = str.replace(new RegExp(regex, "g"), function (matched) {
        return map[matched];
    });
    return str;
}

function getInfoType(table_summary) {
    let text = table_summary.querySelector(".r").innerText;
    if (text.length < 1) {
        return null;
    }

    if (text.indexOf("infiltrovat vládu") != -1) {
        return 0;
    } else if (text.indexOf("infiltrovat generální štáb") != -1) {
        return 1;
    }

    return null;
}

function getPrestiz(table_summary) {
    let column = table_summary.rows[0].children[1];
    let index = 12;
    let prestiz, text;
    let pruchodu = 50;
    do {
        pruchodu--;
        text = column.childNodes[index++];
        if (text.nodeName != "#text") {
            continue;
        }
        prestiz = parseInt(text.textContent);
    } while ((isNaN(prestiz) || prestiz < 40000) && pruchodu > 0);
    return prestiz;
}

function addHeaderColumn(doc = document, row, column_name) {
    let header = doc.createElement("th");
    header.innerHTML = column_name;
    header.colSpan = 2;
    row.appendChild(header);
}

function createColumn(doc = document, class_name_1, class_name_2, text) {
    let column = doc.createElement("td");
    column.innerHTML = text;
    column.classList.add(class_name_1);
    column.classList.add(class_name_2);
    return column;
}

function addColumnInfo(doc = document, header_row, data_row, prestiz, info_type) {
    addHeaderColumn(doc, header_row, "Prestiž");

    let left_column_content = "";
    let right_column_content = "";

    let format = new Intl.NumberFormat();

    // ARMADA ZACATEK
    let army_data = data_row.children[1].innerHTML.split(DATA_SEPARATOR);
    let prestiz_per_unit = [1, 5, 3.5, 3.5, 2.7];
    let army_prestiz = 0;
    let mechy_podil = 0;
    for (let i = 0; i < 5; i++) {
        army_prestiz = army_prestiz + parseInt(army_data[i]) * prestiz_per_unit[i];
        if (i == 4) {
            mechy_podil = parseInt(army_data[i]) * prestiz_per_unit[i];
        }
    }
    left_column_content = left_column_content + "Armáda" + DATA_SEPARATOR + "Procent" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + format.format(Math.round(army_prestiz)) + DATA_SEPARATOR + Math.round((army_prestiz / prestiz) * 1000) / 10 + "%" + DATA_SEPARATOR + DATA_SEPARATOR;
    // ARMADA KONEC

    // MECHY % ZACATEK
    left_column_content = left_column_content + "Mechy %" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + Math.round((mechy_podil / army_prestiz) * 1000) / 10 + "%" + DATA_SEPARATOR + DATA_SEPARATOR;
    // MECHY % KONEC

    if (info_type == 0) {
        let uzemi_data = processUzemiInfo(data_row, army_data, left_column_content, right_column_content, format, prestiz);
        left_column_content = uzemi_data[0];
        right_column_content = uzemi_data[1];
        let uzemi_prestiz = uzemi_data[2];
        let uzemi = uzemi_data[3];

        let techy_data = processTechy(data_row, left_column_content, right_column_content, format, prestiz);
        left_column_content = techy_data[0];
        right_column_content = techy_data[1];
        let technologie_count = techy_data[2];
        let ukrast_na_operaci = techy_data[3];

        // MRTVA PRESTIZ ZACATEK
        let mrtva_prestiz = 0;
        mrtva_prestiz = prestiz - army_prestiz - uzemi_prestiz - technologie_count;
        left_column_content = left_column_content + "Mrtvá pres" + DATA_SEPARATOR + "Procent" + DATA_SEPARATOR + DATA_SEPARATOR;
        right_column_content =
            right_column_content + format.format(Math.round(mrtva_prestiz)) + DATA_SEPARATOR + Math.round((mrtva_prestiz / prestiz) * 1000) / 10 + "%" + DATA_SEPARATOR + DATA_SEPARATOR;

        let rozvedka_prestiz = ((uzemi + 2000) / 4) * 15;
        left_column_content = left_column_content + "Na [R]" + DATA_SEPARATOR + DATA_SEPARATOR;
        right_column_content = right_column_content + format.format(Math.round(rozvedka_prestiz)) + DATA_SEPARATOR + DATA_SEPARATOR;
        // MRTVA PRESTIZ KONEC

        // KRADEZ TECHU ZACATEK
        left_column_content = left_column_content + "Techy krádež" + DATA_SEPARATOR;
        right_column_content = right_column_content + format.format(Math.floor(ukrast_na_operaci)) + DATA_SEPARATOR;
        // KRADEZ TECHU KONEC
    }

    let column = createColumn(doc, "rname", "l", left_column_content);
    data_row.appendChild(column);
    column = createColumn(doc, "rdata", "r", right_column_content);
    data_row.appendChild(column);
}

/**
 * @param data_row
 * @param army_data
 * @param left_column_content
 * @param right_column_content
 * @param format
 * @param prestiz
 *
 * @return array [left_column_content, right_column_content, uzemi_prestiz, uzemi]
 */
function processUzemiInfo(data_row, army_data, left_column_content, right_column_content, format, prestiz) {
    let budovy_data = data_row.children[3].innerHTML.split(DATA_SEPARATOR);
    let uzemi = parseInt(army_data[9]);
    let uzemi_prestiz = uzemi * 15;
    uzemi_prestiz = uzemi_prestiz + (uzemi - parseInt(budovy_data[11]) - parseInt(budovy_data[12])) * 5; // budovy
    uzemi_prestiz = uzemi_prestiz + parseInt(budovy_data[12]) * 2; // ruiny

    left_column_content = left_column_content + "Území" + DATA_SEPARATOR + "Procent" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + format.format(uzemi_prestiz) + DATA_SEPARATOR + Math.round((uzemi_prestiz / prestiz) * 1000) / 10 + "%" + DATA_SEPARATOR + DATA_SEPARATOR;

    return [left_column_content, right_column_content, uzemi_prestiz, uzemi];
}

/**
 * @param data_row
 * @param left_column_content
 * @param right_column_content
 * @param format
 * @param prestiz
 *
 * @return array [left_column_content, right_column_content, technologie_count, ukrast_na_operaci]
 */
function processTechy(data_row, left_column_content, right_column_content, format, prestiz) {
    let technologie_data = data_row.children[5].innerHTML.split(DATA_SEPARATOR);
    let technologie_count = 0;
    let pokryto_techu = 2 * parseInt(technologie_data[10]);
    let ukrast_na_operaci = 0;
    for (let i = 0; i < technologie_data.length; i++) {
        let technologie = parseInt(technologie_data[i]);
        technologie_count = technologie_count + technologie;
        if (technologie > pokryto_techu) {
            ukrast_na_operaci = ukrast_na_operaci + (technologie - pokryto_techu) * 0.05 + pokryto_techu * 0.002;
        } else {
            ukrast_na_operaci = ukrast_na_operaci + technologie * 0.002;
        }
    }
    left_column_content = left_column_content + "Technologie" + DATA_SEPARATOR + "Procent" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + format.format(technologie_count) + DATA_SEPARATOR + Math.round((technologie_count / prestiz) * 1000) / 10 + "%" + DATA_SEPARATOR + DATA_SEPARATOR;

    return [left_column_content, right_column_content, technologie_count, ukrast_na_operaci];
}

function addArmyData(data_row) {
    let format = new Intl.NumberFormat();

    // ARMADA ZACATEK
    let army_data = data_row.children[1].innerHTML.split(DATA_SEPARATOR);
    let utok_per_unit = [1, 6, 6, 0, 2];
    let obrana_per_unit = [1, 4, 0, 6, 3];
    let utok_total = 0,
        obrana_total = 0;

    for (let i = 0; i < 5; i++) {
        utok_total = utok_total + parseInt(army_data[i]) * utok_per_unit[i];
        obrana_total = obrana_total + parseInt(army_data[i]) * obrana_per_unit[i];
    }
    // ARMADA KONEC

    data_row.children[0].innerHTML += DATA_SEPARATOR + DATA_SEPARATOR + "<b>Armáda</b>" + DATA_SEPARATOR + "U základ" + DATA_SEPARATOR + "O základ";
    data_row.children[1].innerHTML += DATA_SEPARATOR + DATA_SEPARATOR + DATA_SEPARATOR + format.format(utok_total) + DATA_SEPARATOR + format.format(obrana_total);
}

function formatNumber(number, pad_to_length = 0) {
    let formatted = number
        .toString()
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (pad_to_length > 0) {
        formatted = formatted.padStart(pad_to_length, String.fromCharCode(160));
    }
    return formatted;
}

function addCss(css) {
    let style = document.createElement("style");
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
}
