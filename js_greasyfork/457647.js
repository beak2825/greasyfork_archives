// ==UserScript==
// @name         Webgame budovy
// @version      2025-03-15
// @description  Some improvements of the building page
// @author       yS
// @match        *://*.webgame.cz/wg/index.php?p=budovy&s=budostav
// @match        *://webgame.cz/wg/index.php?p=budovy&s=budostav
// @match        *://*.webgame.cz/wg/index.php?p=budovy
// @match        *://webgame.cz/wg/index.php?p=budovy
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @namespace    https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457647/Webgame%20budovy.user.js
// @updateURL https://update.greasyfork.org/scripts/457647/Webgame%20budovy.meta.js
// ==/UserScript==

// setting constants
const SCROLL = "scroll";
const COLONIZE = "colonize";
const BASE_PRODUCTION_COLUMN = "base_production_column";
const TOTAL_PRODUCTION_COLUMN = "total_production_column";
const TIME_OF_LAST_REFRESH = "time_of_last_refresh";
const STORED_BONUSES = "bonuses";
const STORED_COUNTRY_ID = "country_id";
const REPLACE_BUILDINGS = "replace_buildings";
const STORED_CHECKBOX_SETTINGS = "checked_buildings";
//

// constants
const REFRESH_PRODUCTION_AFTER_MILLIS = 10 * 60 * 1000;

const VLADA_FUNDAMENTALISMUS = "Fundamentalismus";
const VLADA_KOMUNISMUS = "Komunismus";
const VLADA_ROBOKRACIE = "Robokracie";
const VLADA_ANARCHIE = "Anarchie";
//

if (getSetting(SCROLL, 1) == 1) {
    scrollToBottom();
}

let center_element = document.forms[0].parentElement;
while (center_element.tagName != "CENTER") {
    center_element = center_element.parentElement;
}
let i = 0;
let checkbox = createConfig(SCROLL, "Povolit okamžitý scroll dolů");
center_element.insertBefore(checkbox, center_element.children[i++]);

checkbox = createConfig(COLONIZE, "Povolit tlačítko chytré kolonizace", true);
center_element.insertBefore(checkbox, center_element.children[i++]);

checkbox = createConfig(BASE_PRODUCTION_COLUMN, "Povolit sloupec základní produkce", true);
center_element.insertBefore(checkbox, center_element.children[i++]);

checkbox = createConfig(TOTAL_PRODUCTION_COLUMN, "Povolit sloupec celkové produkce s bonusy", true);
center_element.insertBefore(checkbox, center_element.children[i++]);

checkbox = createConfig(REPLACE_BUILDINGS, "Povolit režim přestavby země", true, false);
center_element.insertBefore(checkbox, center_element.children[i++]);

let manual_refresh_bonuses = document.createElement("a");
manual_refresh_bonuses.innerHTML = "Manuální obnova bonusů a cen na trhu";
center_element.insertBefore(manual_refresh_bonuses, center_element.children[i++]);
manual_refresh_bonuses.onclick = function () {
    fetchProductionBonuses().then(() => {
        window.location.replace(location.href);
    });
};

if (getSetting(COLONIZE, 1) == 1) {
    addButtonProzkoumatToBudostav();
}
addProductionColumn();
initReplaceBuildings();

function setSetting(setting_name, value) {
    // eslint-disable-next-line no-undef
    GM_setValue(setting_name, value);
}

function getSetting(setting_name, default_value) {
    // eslint-disable-next-line no-undef
    return GM_getValue(setting_name, default_value);
}

function scrollToBottom() {
    let element = document.getElementById("advert-bottom");
    if (element != null) {
        element.scrollIntoView();
    }
}

function createButtonProzkoumat() {
    let turns_to_explore = calculateTurnsRequiredToExplore();

    let button = document.createElement("button");
    button.innerHTML = "Vyslat osadníky<br>(" + turns_to_explore + ")";
    button.dataset.turns = turns_to_explore;
    button.id = "explore";
    button.type = "button";
    button.classList.add("submit");
    button.addEventListener("click", () => {
        explore();
    });
    return button;
}

function calculateTurnsRequiredToExplore() {
    let infotext_elements = document.getElementsByClassName("infotext");
    let empty_km = parseFloat(infotext_elements[0].children[2].innerText);
    let buildings_per_turn = parseFloat(infotext_elements[0].children[5].innerText);

    if (empty_km / buildings_per_turn > 1) {
        return document.forms.prozkoumat.kola.value;
    }

    let explore_per_turn = parseFloat(infotext_elements[5].children[0].innerText);
    // add in poor RNG chance
    explore_per_turn = Math.floor(explore_per_turn * 0.9);

    return Math.ceil((buildings_per_turn - empty_km) / explore_per_turn);
}

function explore() {
    let explore_button = document.getElementById("explore");
    let turns_to_explore = explore_button.dataset.turns;

    let kola_element = document.getElementsByName("kola");
    kola_element[0].value = turns_to_explore;

    clickExplore();
}

function clickExplore() {
    let form = document.getElementsByName("prozkoumat");
    form = form[0];
    let submit = form.getElementsByClassName("submit");
    submit = submit[0];

    submit.click();
}

function addButtonProzkoumatToBudostav() {
    let form = document.getElementsByClassName("budostav");
    form = form[0];

    let rows = form.getElementsByTagName("tr");
    let th = document.createElement("th");
    th.innerHTML = "Kolonizace";
    rows[0].appendChild(th);

    let button = createButtonProzkoumat();

    let td = document.createElement("td");
    td.rowSpan = 11;
    td.style = "padding:unset; margin: unset;";
    td.appendChild(button);
    button.style = "height: 307px;";
    rows[1].appendChild(td);
}

function createConfig(input_id, label_text, force_reload = false, default_value = true) {
    let input = document.createElement("input");
    input.id = input_id;
    input.type = "checkbox";
    input.style.verticalAlign = "middle";
    input.checked = getSetting(input_id, default_value);
    input.addEventListener("change", () => {
        setSetting(input.id, input.checked);
        if (force_reload) {
            window.location.replace(location.href);
        }
    });

    let label = document.createElement("label");
    label.htmlFor = input.id;
    label.innerText = label_text;
    label.style.marginLeft = "5px";

    let container = document.createElement("div");
    container.append(input);
    container.append(label);
    return container;
}

function addProductionColumn(index = 0) {
    const setting_show_base_production_column = getSetting(BASE_PRODUCTION_COLUMN, 1);
    const setting_show_total_production_column = getSetting(TOTAL_PRODUCTION_COLUMN, 1);

    if (!setting_show_base_production_column && !setting_show_total_production_column) {
        return;
    }

    const saved_country_id = getSetting(STORED_COUNTRY_ID, 0);
    let country_id = saved_country_id;

    const country_id_element = document.querySelector("#uLista a");
    if (country_id_element !== null) {
        country_id = country_id_element.textContent.replace("#", "");
    }

    const date = new Date();
    const time_of_last_refresh = getSetting(TIME_OF_LAST_REFRESH, 0);

    const is_data_too_old = date.getTime() - time_of_last_refresh > REFRESH_PRODUCTION_AFTER_MILLIS;
    const is_different_country = country_id !== saved_country_id;

    let bonuses = getSetting(STORED_BONUSES, null);

    if (is_data_too_old || is_different_country || bonuses === null) {
        if (index > 1) {
            console.log("Recursive code, break");
            return;
        }
        let promise = fetchProductionBonuses();
        promise.then(() => {
            addProductionColumn(++index);
        });
        return;
    }

    addBudovyCss();

    let form = document.getElementsByClassName("budostav");
    let table = form[0].querySelector("table");
    let column_num = 3;

    if (setting_show_base_production_column) {
        addBaseProductionColumn(table, column_num++, bonuses);
    }

    if (setting_show_total_production_column) {
        addProductionWithBonusesColumn(table, column_num++, bonuses);
    }

    table.rows[table.rows.length - 1].cells[0].colSpan += column_num - 3;
}

async function fetchProductionBonuses() {
    let promises = [];

    let bonuses = {};

    promises.push(fetchVladaBonusy(bonuses));
    promises.push(fetchDetaily(bonuses));
    promises.push(fetchEfektyTechnologii(bonuses));
    promises.push(fetchMarketPrices(bonuses));
    promises.push(fetchTechnologyPrices(bonuses));

    return Promise.all(promises).then(
        () =>
            new Promise((resolve) => {
                const date = new Date();
                setSetting(TIME_OF_LAST_REFRESH, date.getTime());
                setSetting(STORED_BONUSES, bonuses);
                setSetting(STORED_COUNTRY_ID, bonuses.country_id);

                resolve(bonuses);
            })
    );
}

function addBaseProductionColumn(table, column_index, bonuses) {
    let th = document.createElement("th");
    th.innerHTML = "Základní produkce v $";
    table.rows[0].insertBefore(th, table.rows[0].children[column_index]);

    const is_robokrat = bonuses.vlada === VLADA_ROBOKRACIE;
    const pop_modifier = is_robokrat ? 0.7 : 1;

    const OBCHODNI_ZONY = 3;
    const LABORATORE = 5;
    const TOVARNY = 6;
    const KASARNY = 7;

    for (let i = 1; i < table.rows.length - 1; i++) {
        const row = table.rows[i];
        let td = row.insertCell(column_index);
        td.classList.add("r");

        switch (i) {
            case OBCHODNI_ZONY:
                getProductionForBuilding(td, i, bonuses.food_price, bonuses.energy_price, {
                    populace: (bonuses.rozloha + bonuses.vesnice + bonuses.mesta * 2) * 350 * pop_modifier,
                    rozloha: bonuses.rozloha,
                    spokojenost: 100,
                    bonus_penize: 0,
                    efekt_obchod: 100,
                    vlada: null,
                });
                break;
            case LABORATORE:
                getProductionForBuilding(td, i, bonuses.food_price, bonuses.energy_price, {
                    hospo_technologie_price: bonuses.hospo_technologie_price,
                    army_technologie_price: bonuses.army_technologie_price,
                    spokojenost: 100,
                    vlada: null,
                });
                break;
            case TOVARNY:
                getProductionForBuilding(td, i, bonuses.food_price, bonuses.energy_price, {
                    average_factory_unit_price: bonuses.average_factory_unit_price,
                    mechy_price: bonuses.mechy_price,
                    vlada: null,
                });
                break;
            case KASARNY:
                getProductionForBuilding(td, i, bonuses.food_price, bonuses.energy_price, {
                    soldier_price: bonuses.soldier_price,
                    vlada: null,
                });
                break;
            default:
                getProductionForBuilding(td, i, bonuses.food_price, bonuses.energy_price, null);
                break;
        }
    }
}

function addProductionWithBonusesColumn(table, column_index, bonuses) {
    const th = document.createElement("th");
    th.innerHTML = "Celková produkce v $";
    table.rows[0].insertBefore(th, table.rows[0].children[column_index]);

    for (let i = 1; i < table.rows.length - 1; i++) {
        const row = table.rows[i];

        let td = row.insertCell(column_index);
        td.classList.add("r");
        getProductionForBuilding(td, i, bonuses.food_price, bonuses.energy_price, bonuses);
    }
}

function getProductionForBuilding(element, building_id, food_price, energy_price, bonuses) {
    const vlada = bonuses ? bonuses.vlada : null;

    switch (building_id) {
        case 1:
            if (bonuses == null) {
                getProductionVesnice(element, food_price, energy_price);
            } else {
                getProductionVesnice(
                    element,
                    food_price,
                    energy_price,
                    bonuses.obchodni_zony_procent,
                    bonuses.efekt_zemedelstvi,
                    bonuses.efekt_hustota,
                    bonuses.efekt_obchod,
                    bonuses.spokojenost,
                    bonuses.bonus_penize,
                    bonuses.bonus_vesnice,
                    vlada
                );
            }
            break;
        case 2:
            if (bonuses == null) {
                getProductionMesta(element, food_price, energy_price);
            } else {
                getProductionMesta(element, food_price, energy_price, bonuses.obchodni_zony_procent, bonuses.efekt_hustota, bonuses.efekt_obchod, bonuses.spokojenost, bonuses.bonus_penize, vlada);
            }
            break;
        case 3:
            if (bonuses !== null) {
                getProductionObchodniZony(element, energy_price, bonuses.populace, bonuses.rozloha, bonuses.efekt_obchod, bonuses.spokojenost, bonuses.bonus_penize, vlada);
            }
            break;
        case 4:
            if (bonuses == null) {
                getProductionFarmy(element, food_price, energy_price);
            } else {
                getProductionFarmy(element, food_price, energy_price, bonuses.efekt_zemedelstvi, bonuses.bonus_farmy, vlada);
            }
            break;
        case 5:
            if (bonuses !== null) {
                getProductionLaboratore(
                    element,
                    energy_price,
                    bonuses.hospo_technologie_price,
                    bonuses.army_technologie_price,
                    bonuses.bonus_zatechovanost_hospo,
                    bonuses.bonus_zatechovanost_armada,
                    bonuses.zkusenosti_armady,
                    bonuses.bonus_laboratore,
                    bonuses.spokojenost,
                    vlada
                );
            }
            break;
        case 6:
            if (bonuses !== null) {
                getProductionTovarny(
                    element,
                    energy_price,
                    bonuses.average_factory_unit_price,
                    bonuses.mechy_price,
                    bonuses.bonus_tovarny,
                    bonuses.efekt_automatizace,
                    bonuses.zkusenosti_armady,
                    vlada
                );
            }
            // tovarny
            break;
        case 7:
            if (bonuses !== null) {
                getProductionKasarny(element, energy_price, bonuses.soldier_price, bonuses.bonus_kasarny, bonuses.zkusenosti_armady, vlada);
            }
            // kasarny
            break;
        case 8:
            if (bonuses == null) {
                getProductionElektrarny(element, energy_price);
            } else {
                getProductionElektrarny(element, energy_price, bonuses.efekt_energetika, bonuses.bonus_elektrarny, vlada);
            }
            // elektrarny
            break;
        case 9:
            getBezprodukcniBudova(element, energy_price, 0.1, true, vlada);
            // zabavni strediska
            break;
        case 10:
            getBezprodukcniBudova(element, energy_price, 0.1, false, vlada);
            // vojenske zakladny
            break;
        case 11:
            getBezprodukcniBudova(element, energy_price, 0.1, false, vlada);
            // stavebni firmy
            break;
    }
}

function getBezprodukcniBudova(element, energy_price, base_energy_consumption, question_mark = false, vlada = null) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const tooltip_data = [];

    let energy_consumption = base_energy_consumption * energy_price;
    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);

    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }

    if (!question_mark) {
        element.textContent = (-energy_consumption).toFixed(2) + "$";

        let css_class = "plus";
        if (energy_consumption) {
            css_class = "minus";
        }

        element.classList.add(css_class);
    } else {
        element.textContent = "?";
    }

    createTooltip(element, tooltip_data);
}

function getProductionVesnice(
    element,
    food_price,
    energy_price,
    obchodni_zony_procent = 0,
    efekt_zemedelstvi = 100,
    efekt_hustota = 100,
    efekt_obchod = 100,
    spokojenost = 100,
    bonus_penize = 0,
    bonus_vesnice = 0,
    vlada = null
) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const is_robokrat = vlada === VLADA_ROBOKRACIE;
    const tooltip_data = [];
    const pop_modifier = is_robokrat ? 0.7 : 1;

    const base_food_production = 1.5;
    const people = 350 * (efekt_hustota / 100) * pop_modifier;
    const money_fixed = 5;
    const market_fee = 0.1;
    const base_energy_consumption = 0.1;

    let food_production = ((base_food_production * (100 + (efekt_zemedelstvi - 100) / 2)) / 100) * (1 + bonus_vesnice / 100);
    let people_production = people * 0.0125 * (efekt_obchod / 100) * (1 + bonus_penize / 100) * (1 + obchodni_zony_procent * 2) * (1 + (spokojenost - 100) * 0.0075);
    let people_food_consumption = (people / 1000) * 0.25;
    let energy_consumption = base_energy_consumption * energy_price;

    let total_production = money_fixed + people_production + (food_production - people_food_consumption) * food_price;
    let market_loss = (food_production - people_food_consumption) * food_price * market_fee;

    tooltip_data.push(["Produkce jídla: ", food_production, 2, food_price]);
    tooltip_data.push(["Cena jídla: ", food_price]);
    tooltip_data.push(["Paušální peníze (vesnice): ", 5, 2]);
    tooltip_data.push(["Obyvatel: ", people, 0, 0]);
    tooltip_data.push(["Produkce peněz (z obyvatel): ", people_production, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Spotřeba jídla (obyvatelé): ", -people_food_consumption, 2, food_price]);
    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);
    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }
    let total_production_with_fees = total_production - market_loss - energy_consumption;
    tooltip_data.push(["Trh poplatek (jídlo -10%): ", -market_loss, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Celkem po prodeji: ", total_production_with_fees, 2]);

    element.textContent = (total_production - energy_consumption).toFixed(2) + "$";
    element.classList.add(total_production - energy_consumption > 0 ? "plus" : "minus");

    createTooltip(element, tooltip_data);
}

function getProductionMesta(element, food_price, energy_price, obchodni_zony_procent = 0, efekt_hustota = 100, efekt_obchod = 100, spokojenost = 100, bonus_penize = 0, vlada = null) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const is_robokrat = vlada === VLADA_ROBOKRACIE;
    const tooltip_data = [];
    const pop_modifier = is_robokrat ? 0.7 : 1;

    const people = 700 * (efekt_hustota / 100) * pop_modifier;
    const base_energy_consumption = 0.2;

    let people_production = people * 0.0125 * (efekt_obchod / 100) * (1 + bonus_penize / 100) * (1 + obchodni_zony_procent * 2) * (1 + (spokojenost - 100) * 0.0075);
    let people_food_consumption = (people / 1000) * 0.25;
    let energy_consumption = base_energy_consumption * energy_price;

    let total_production = people_production - people_food_consumption * food_price;

    tooltip_data.push(["Obyvatel: ", people, 0, 0]);
    tooltip_data.push(["Produkce peněz (z obyvatel): ", people_production, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Spotřeba jídla (obyvatelé): ", -people_food_consumption, 2, food_price]);
    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);
    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }
    tooltip_data.push([""]);
    tooltip_data.push(["Maximálně celkem: ", total_production - energy_consumption, 2]);

    element.textContent = (total_production - energy_consumption).toFixed(2) + "$";
    element.classList.add(total_production - energy_consumption > 0 ? "plus" : "minus");

    createTooltip(element, tooltip_data);
}

function getProductionObchodniZony(element, energy_price, populace, rozloha, efekt_obchod, spokojenost, bonus_penize, vlada = null) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const tooltip_data = [];

    const efekt = 2 / rozloha;
    const base_energy_consumption = 0.2;

    let people_production = populace * 0.0125 * (efekt_obchod / 100) * (1 + bonus_penize / 100) * (1 + (spokojenost - 100) * 0.0075);
    let money_produced = people_production * efekt;
    let energy_consumption = base_energy_consumption * energy_price;

    tooltip_data.push(["Produkce peněz (navíc): ", money_produced, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);
    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }
    tooltip_data.push([""]);
    tooltip_data.push(["Maximálně celkem: ", money_produced - energy_consumption, 2]);

    element.textContent = (money_produced - energy_consumption).toFixed(2) + "$";
    element.classList.add(money_produced - energy_consumption > 0 ? "plus" : "minus");

    createTooltip(element, tooltip_data);
}

function getProductionFarmy(element, food_price, energy_price, efekt_zemedelstvi = 100, bonus_farmy = 0, vlada = null) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const tooltip_data = [];

    const base_food_production = 2;
    const market_fee = 0.1;
    const base_energy_consumption = 0.1;

    let food_production = ((base_food_production * efekt_zemedelstvi) / 100) * (1 + bonus_farmy / 100);
    let energy_consumption = base_energy_consumption * energy_price;

    let total_production = food_production * food_price;
    let market_loss = total_production * market_fee;

    tooltip_data.push(["Produkce jídla: ", food_production, 2, food_price]);
    tooltip_data.push(["Cena jídla: ", food_price]);
    tooltip_data.push([""]);

    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);
    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }
    tooltip_data.push([""]);
    tooltip_data.push(["Trh poplatek (jídlo -10%): ", -market_loss, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Celkem po prodeji: ", total_production - market_loss - energy_consumption, 2]);

    element.textContent = (total_production - energy_consumption).toFixed(2) + "$";
    element.classList.add(total_production - energy_consumption > 0 ? "plus" : "minus");

    createTooltip(element, tooltip_data);
}

function getProductionLaboratore(
    element,
    energy_price,
    hospo_technologie_price,
    army_technologie_price,
    bonus_zatechovanost_hospo = 0,
    bonus_zatechovanost_armada = 0,
    zkusenosti_armady = 0,
    bonus_laboratore = 0,
    spokojenost = 100,
    vlada = null
) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const tooltip_data = [];

    const market_fee = 0.1;
    const base_techy_production = 0.08 * (1 + (spokojenost - 100) * 0.005) * (1 + bonus_laboratore / 100);
    const base_energy_consumption = 0.2;

    let energy_consumption = base_energy_consumption * energy_price;

    let technologie_hospo_production = base_techy_production * (1 + bonus_zatechovanost_hospo / 100);
    let technologie_armady_production = base_techy_production * (1 + bonus_zatechovanost_armada / 100) * (1 + zkusenosti_armady / 200);

    let hospo_techy_produced_value = technologie_hospo_production * hospo_technologie_price;
    let army_techy_produced_value = technologie_armady_production * army_technologie_price;

    let hospo_market_loss = hospo_techy_produced_value * market_fee;
    let army_market_loss = army_techy_produced_value * market_fee;

    tooltip_data.push(["Hospodářské technologie: "]);
    tooltip_data.push(["Produkce: ", technologie_hospo_production, 3, hospo_technologie_price]);
    tooltip_data.push(["Cena bodu: ", hospo_technologie_price]);
    tooltip_data.push(["Trh poplatek (technologie -10%): ", -hospo_market_loss, 2]);
    tooltip_data.push(["Celkem po prodeji na trhu: ", hospo_techy_produced_value - hospo_market_loss - energy_consumption, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Vojenské technologie: "]);
    tooltip_data.push(["Produkce: ", technologie_armady_production, 3, army_technologie_price]);
    tooltip_data.push(["Cena bodu: ", army_technologie_price]);
    tooltip_data.push(["Trh poplatek (technologie -10%): ", -army_market_loss, 2]);
    tooltip_data.push(["Celkem po prodeji na trhu: ", army_techy_produced_value - army_market_loss - energy_consumption, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);
    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }
    tooltip_data.push([""]);

    let total_production = hospo_techy_produced_value > army_techy_produced_value ? hospo_techy_produced_value : army_techy_produced_value;
    total_production -= energy_consumption;
    tooltip_data.push(["Maximálně celkem: ", total_production, 2]);

    element.textContent = total_production.toFixed(2) + "$";
    element.classList.add(total_production > 0 ? "plus" : "minus");

    createTooltip(element, tooltip_data);
}

function getProductionTovarny(element, energy_price, average_factory_unit_price, mechy_price, bonus_tovarny = 0, efekt_automatizace = 100, zkusenosti_armady = 0, vlada = null) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const is_komunismus = vlada === VLADA_KOMUNISMUS;
    const is_robokracie = vlada === VLADA_ROBOKRACIE;
    const tooltip_data = [];

    const market_fee = 0.06;
    const base_energy_consumption = 0.2;

    let mechy_required_units = 21;
    if (is_komunismus) {
        mechy_required_units = 25;
    } else if (is_robokracie) {
        mechy_required_units = 19;
    }

    let energy_consumption = base_energy_consumption * energy_price;
    let unit_created = 1 * (efekt_automatizace / 100) * (1 + bonus_tovarny / 100) * (1 + zkusenosti_armady / 200);
    let total_production = unit_created * average_factory_unit_price;
    let market_loss = total_production * market_fee;

    let mechy_units_created = 1 * ((100 + (efekt_automatizace - 100) * 2) / 100) * (1 + bonus_tovarny / 100) * (1 + zkusenosti_armady / 200);
    let mechy_total_production = (mechy_units_created / mechy_required_units) * mechy_price;
    let mechy_market_loss = mechy_total_production * market_fee;

    let maximum_value = total_production > mechy_total_production ? total_production : mechy_total_production;

    tooltip_data.push(["Obyčejná technika:"]);
    tooltip_data.push(["Počet dílů: ", unit_created, 2, average_factory_unit_price]);
    tooltip_data.push(["Průměrná cena dílu: ", average_factory_unit_price, 2]);
    tooltip_data.push(["Trh poplatek (vojenské jednotky -6%): ", -market_loss, 2]);
    tooltip_data.push(["Celkem po prodeji: ", total_production - market_loss - energy_consumption, 2]);
    tooltip_data.push([""]);

    tooltip_data.push(["Mechy:"]);
    tooltip_data.push(["Počet dílů: ", mechy_units_created, 2, mechy_price / mechy_required_units]);
    tooltip_data.push(["Počet dílů na jednotku: ", mechy_required_units, 0, 0]);
    tooltip_data.push(["Cena jednotky: ", mechy_price]);
    tooltip_data.push(["Trh poplatek (vojenské jednotky -6%): ", -mechy_market_loss, 2]);
    tooltip_data.push(["Celkem po prodeji: ", mechy_total_production - mechy_market_loss - energy_consumption, 2]);
    tooltip_data.push([""]);

    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);
    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }
    tooltip_data.push([""]);
    tooltip_data.push(["Maximálně celkem: ", maximum_value - energy_consumption, 2]);

    element.textContent = (maximum_value - energy_consumption).toFixed(2) + "$";
    element.classList.add(maximum_value - energy_consumption > 0 ? "plus" : "minus");

    createTooltip(element, tooltip_data);
}

function getProductionKasarny(element, energy_price, soldier_price, bonus_kasarny = 0, zkusenosti_armady = 0, vlada = null) {
    if (!element) {
        return;
    }

    const is_anarchy = vlada === VLADA_ANARCHIE;
    const tooltip_data = [];

    const market_fee = 0.06;
    const base_energy_consumption = 0.1;

    let energy_consumption = base_energy_consumption * energy_price;
    let unit_created = (3 / 10) * (1 + bonus_kasarny / 100) * (1 + zkusenosti_armady / 200);
    let total_production = unit_created * soldier_price;
    let market_loss = total_production * market_fee;

    tooltip_data.push(["Počet vojáků: ", unit_created, 2, soldier_price]);
    tooltip_data.push(["Cena vojáka: ", soldier_price]);
    tooltip_data.push([""]);
    tooltip_data.push(["Spotřeba energie (budova): ", -base_energy_consumption, 2, energy_price]);
    if (is_anarchy) {
        energy_consumption = (base_energy_consumption - 0.1) * energy_price;
        tooltip_data.push(["Ušetřená energie (anarchie): ", 0.1, 2, energy_price]);
    }
    tooltip_data.push(["Trh poplatek (vojenské jednotky -6%): ", -market_loss, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Celkem po prodeji: ", total_production - market_loss - energy_consumption, 2]);

    element.textContent = (total_production - energy_consumption).toFixed(2) + "$";
    element.classList.add(total_production - energy_consumption > 0 ? "plus" : "minus");

    createTooltip(element, tooltip_data);
}

function getProductionElektrarny(element, energy_price, efekt_energetika = 100, bonus_elektrarny = 0, vlada = null) {
    if (!element) {
        return;
    }

    const is_fundamentalismus = vlada === VLADA_FUNDAMENTALISMUS;
    const tooltip_data = [];

    const market_fee = 0.1;

    let energy_production = 2 * (efekt_energetika / 100) * (1 + bonus_elektrarny / 100);
    tooltip_data.push(["Produkce energie: ", energy_production, 2, energy_price]);

    if (is_fundamentalismus) {
        energy_production += 0.8;
        tooltip_data.push(["Bonus za vládu (fundamentalismus): ", 0.8, 2, energy_price]);
        tooltip_data.push(["Celkem produkce: ", energy_production, 2, energy_price]);
    }
    tooltip_data.push(["Cena energie: ", energy_price]);

    let total_production = energy_production * energy_price;
    let market_loss = total_production * market_fee;

    tooltip_data.push([""]);
    tooltip_data.push(["Trh poplatek (energie -6%): ", -market_loss, 2]);
    tooltip_data.push([""]);
    tooltip_data.push(["Celkem po prodeji: ", energy_production * energy_price - market_loss, 2]);

    element.textContent = total_production.toFixed(2) + "$";
    element.classList.add("plus");

    createTooltip(element, tooltip_data);
}

function fetchVladaBonusy(bonuses) {
    return new Promise(function (resolve) {
        let req = new XMLHttpRequest();
        let url = "index.php?p=vlada&s=revoluce";
        req.open("GET", url);
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(req.response, "text/html");

                getVlada(doc, bonuses);
                resolve(bonuses);
            } else {
                console.log("File not found");
            }
        };
        req.send();
    });
}

function fetchEfektyTechnologii(bonuses) {
    return new Promise(function (resolve) {
        let req = new XMLHttpRequest();
        let url = "index.php?p=technologie";
        req.open("GET", url);
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(req.response, "text/html");

                getEfektyTechnologii(doc, bonuses);
                resolve(bonuses);
            } else {
                console.log("File not found");
            }
        };
        req.send();
    });
}

function fetchDetaily(bonuses) {
    return new Promise(function (resolve) {
        let req = new XMLHttpRequest();
        let url = "index.php?p=detaily&s=detaily";
        req.open("GET", url);
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(req.response, "text/html");

                getDetails(doc, bonuses);
                resolve(bonuses);
            } else {
                console.log("File not found");
            }
        };
        req.send();
    });
}

function getVlada(doc, bonuses) {
    let table = doc.getElementById("revoluce");
    bonuses.bonus_vesnice = Number(table.rows[1].cells[1].textContent.slice(0, -1));
    bonuses.bonus_farmy = Number(table.rows[2].cells[1].textContent.slice(0, -1));
    bonuses.bonus_laboratore = Number(table.rows[3].cells[1].textContent.slice(0, -1));
    bonuses.bonus_tovarny = Number(table.rows[4].cells[1].textContent.slice(0, -1));
    bonuses.bonus_kasarny = Number(table.rows[5].cells[1].textContent.slice(0, -1));
    bonuses.bonus_elektrarny = Number(table.rows[6].cells[1].textContent.slice(0, -1));
    bonuses.bonus_penize = Number(table.rows[8].cells[1].textContent.slice(0, -1));
}

function getEfektyTechnologii(doc, bonuses) {
    let table = doc.forms[0].children[0];
    bonuses.efekt_obchod = Number(table.rows[2].cells[2].textContent.slice(0, -1));
    bonuses.efekt_hustota = Number(table.rows[3].cells[2].textContent.slice(0, -1));
    bonuses.efekt_zemedelstvi = Number(table.rows[4].cells[2].textContent.slice(0, -1));
    bonuses.efekt_automatizace = Number(table.rows[5].cells[2].textContent.slice(0, -1));
    bonuses.efekt_energetika = Number(table.rows[6].cells[2].textContent.slice(0, -1));

    let strong_elements = doc.querySelectorAll(".infotext > strong");

    bonuses.bonus_zatechovanost_armada = Number(strong_elements[strong_elements.length - 1].textContent.replace(/\s/g, "").slice(0, -1));
    bonuses.bonus_zatechovanost_hospo = Number(strong_elements[strong_elements.length - 2].textContent.replace(/\s/g, "").slice(0, -1));
}

function getDetails(doc, bonuses) {
    let table = doc.querySelector("#icontent > .vis_tbl");
    let cell = table.rows[0].cells[1];
    bonuses.country_id = cell.innerText.split("(#")[1].split(")")[0];
    bonuses.vlada = table.rows[0].cells[3].textContent;

    let tdetail_table = doc.getElementById("tdetail");
    cell = tdetail_table.rows[1].cells[1];
    let basic_info = cell.innerHTML.replace(/\s/g, "").split("<br>");

    bonuses.rozloha = Number(basic_info[1].split("km")[0]);
    bonuses.populace = Number(basic_info[2]);

    cell = tdetail_table.rows[1].cells[3];
    basic_info = cell.innerHTML.replace(/\s/g, "").split("<br>");

    bonuses.spokojenost = Number(basic_info[3].slice(0, -1).replace(",", "."));

    table = doc.getElementById("war-bonuses");
    bonuses.zkusenosti_armady = Number(table.rows[4].cells[1].textContent.replace(/\s/g, "").slice(0, -1).replace(",", "."));

    table = doc.getElementById("detaily");
    let content = table.rows[1].cells[1].innerHTML.replace(/\s/g, "").split("<br>");
    bonuses.vesnice = Number(content[0]);
    bonuses.mesta = Number(content[1]);
    bonuses.obchodni_zony_procent = content[2] / bonuses.rozloha;
}

function fetchMarketPrices(bonuses) {
    return new Promise((resolve) => {
        let req = new XMLHttpRequest();
        let url = "index.php?p=domtrh";
        req.open("GET", url);
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(req.response, "text/html");

                let prices = [];

                let price_cells = doc.querySelectorAll("#icontent form .vis_tbl .mactprice");
                price_cells.forEach((price_cell) => {
                    prices.push(Number(price_cell.innerText.replaceAll(" ", "").replace("$", "")));
                });

                // skip agenty
                prices.pop();
                // mechy
                bonuses.mechy_price = prices.pop();

                const pieces_required = {
                    3: 24,
                    4: 18,
                    5: 18,
                };

                let average_factory_unit_price = 0;

                for (let i = prices.length - 1; i > 2; i--) {
                    const value = prices.pop();
                    average_factory_unit_price += value / pieces_required[i];
                }

                bonuses.food_price = prices[0];
                bonuses.energy_price = prices[1];
                bonuses.soldier_price = prices[2];
                bonuses.average_factory_unit_price = average_factory_unit_price / 3;

                resolve(bonuses);
            } else {
                console.log("File not found");
            }
        };
        req.send();
    });
}

function fetchTechnologyPrices(bonuses) {
    return new Promise((resolve) => {
        let req = new XMLHttpRequest();
        let url = "index.php?p=svetovy_trh&s=techkoupit";
        req.open("GET", url);
        req.onload = function () {
            if (req.readyState == 4 && req.status == 200) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(req.response, "text/html");

                let warning_elements = doc.getElementsByClassName("warn");

                if (warning_elements.length > 0 || !doc.forms[0]) {
                    bonuses.hospo_technologie_price = 400;
                    bonuses.army_technologie_price = 400;

                    resolve(bonuses);
                    return;
                }

                let hospo_technologie_prices = [],
                    army_technologie_prices = [];

                let price_cells = doc.forms[0].children[0].querySelectorAll(".mactprice");

                price_cells.forEach((price_cell, index) => {
                    const value = Number(price_cell.innerHTML.split("<")[0].replace(/\s/g, ""));

                    if (index < 6) {
                        hospo_technologie_prices.push(value);
                    } else {
                        army_technologie_prices.push(value);
                    }
                });

                hospo_technologie_prices.sort();
                army_technologie_prices.sort();

                hospo_technologie_prices.shift();
                hospo_technologie_prices.shift();

                army_technologie_prices.shift();
                army_technologie_prices.shift();

                let hospo_technologie_price = hospo_technologie_prices.reduce((a, b) => a + b, 0) / hospo_technologie_prices.length;
                let army_technologie_price = army_technologie_prices.reduce((a, b) => a + b, 0) / army_technologie_prices.length;

                bonuses.hospo_technologie_price = hospo_technologie_price;
                bonuses.army_technologie_price = army_technologie_price;

                resolve(bonuses);
            } else {
                console.log("File not found");
            }
        };
        req.send();
    });
}

function initReplaceBuildings() {
    let is_on = getSetting(REPLACE_BUILDINGS, false);
    if (!is_on) {
        return;
    }

    let checkbox_settings = getSetting(STORED_CHECKBOX_SETTINGS, []);

    let table = document.forms[0].querySelector("table");
    let checkboxes = [];
    let is_everything_off = true;
    let cell;

    for (let index = 1; index < table.rows.length - 2; index++) {
        let row = table.rows[index];
        cell = row.insertCell(0);
        cell.style.padding = "0px";

        let label = document.createElement("label");
        label.classList.add("form-item");
        cell.appendChild(label);

        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.checked = checkbox_settings[index];
        is_everything_off = is_everything_off && checkbox_settings[index];
        input.dataset.index = index;
        input.addEventListener("change", function () {
            let checkbox_settings = getSetting(STORED_CHECKBOX_SETTINGS, []);
            checkbox_settings[this.dataset.index] = this.checked;
            setSetting(STORED_CHECKBOX_SETTINGS, checkbox_settings);
        });
        label.appendChild(input);

        checkboxes.push(input);
    }
    let row = table.rows[table.rows.length - 2];
    row.insertCell(0);

    removeEnterSubmitScript();

    let inputs = table.querySelectorAll("input[type='text']");
    inputs.forEach((input) => {
        input.addEventListener("keypress", function (event) {
            let code = event.keyCode ? event.keyCode : event.which;
            if (code == 13) {
                event.preventDefault();
                replaceBuildings(table);
                return false;
            }
        });
    });

    let table_header = document.createElement("th");
    table.rows[0].prepend(table_header);
    table_header.textContent = "Nahradit";
    let toggle_num = is_everything_off ? 0 : 1;
    table_header.addEventListener("click", () => {
        toggle_num++;
        let is_checked = toggle_num % 2 == 1;

        checkboxes.forEach((input) => {
            if (input.checked == is_checked) {
                input.click();
            }
        });
    });

    cell = table.rows[table.rows.length - 1].cells[0];
    cell.colSpan += 1;

    let relevant_form_id = null;
    for (let index = 0; index < document.forms.length; index++) {
        const form = document.forms[index];
        if (form.classList.contains("budostav")) {
            relevant_form_id = index;
            break;
        }
    }

    if (relevant_form_id === null) {
        console.log("Nepodařilo se upravit formulář");
        return;
    }

    document.forms[relevant_form_id].addEventListener("submit", function (event) {
        event.preventDefault();
        replaceBuildings(table);
    });
}

function removeEnterSubmitScript() {
    window.addEventListener(
        "keypress",
        (event) => {
            if (event.key == "Enter") {
                event.stopPropagation();
            }
        },
        true
    );
}

function replaceBuildings(table) {
    const form = document.forms[0];

    let infotext_elements = document.getElementsByClassName("infotext");

    let free_space_element = infotext_elements[0].querySelector("strong:nth-child(3)");
    let free_space = Number(free_space_element.textContent.split(" ")[0]);
    let number_of_buildings_to_demolish;

    let building_speed_element = infotext_elements[3].querySelector("strong");
    let building_speed = Number(building_speed_element.textContent.split("x")[1]);

    let inputs = table.querySelectorAll("input[type='text']");
    let to_build = 0;
    inputs.forEach((input) => {
        let value = input.value;
        if (value.endsWith("x") || value.endsWith("*")) {
            value = value.slice(0, -1) * building_speed;
        }

        to_build += Number(value);
    });
    if (free_space > to_build) {
        form.submit();
        return;
    }

    number_of_buildings_to_demolish = to_build - free_space;

    let column_ids = {};
    table.querySelectorAll("th").forEach((column, index) => {
        column_ids[column.textContent.toLowerCase()] = index;
    });

    let buildings_to_demolish = {
        vlgsc: "",
        rsdsc: "",
        comsc: "",
        farmsc: "",
        labsc: "",
        fctrsc: "",
        brcksc: "",
        plntsc: "",
        entzsc: "",
        mlbsc: "",
        cssc: "",
    };

    let checked_buildings_to_demolish = table.querySelectorAll("input[type='checkbox']:checked");

    for (let index = 0; index < checked_buildings_to_demolish.length; index++) {
        const checkbox = checked_buildings_to_demolish[index];
        let row = checkbox.closest("tr");
        let cell = row.cells[column_ids.postavit];
        let input = cell.children[0];
        let name = input.name;

        let total_amount = Number(row.cells[column_ids.postaveno].textContent);
        if (total_amount > 0) {
            if (number_of_buildings_to_demolish < total_amount) {
                buildings_to_demolish[name] = number_of_buildings_to_demolish;
                number_of_buildings_to_demolish = 0;
                break;
            }
            buildings_to_demolish[name] = total_amount;
            number_of_buildings_to_demolish -= total_amount;
        }
    }

    let promise = demolishBuildings(buildings_to_demolish);
    promise.then((freed_space) => {
        if (!freed_space) {
            return;
        }

        form.submit();
    });
}

function demolishBuildings(buildings_to_demolish) {
    let promise = new Promise((resolve) => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                resolve(xmlHttp);
            }
        };
        xmlHttp.open("POST", "index.php?p=budovy&s=budobour", true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        let params =
            `action=${encodeURIComponent("Zničit budovy")}&vlgsc=${buildings_to_demolish.vlgsc}&rsdsc=${buildings_to_demolish.rsdsc}&comsc=${buildings_to_demolish.comsc}&farmsc=${
                buildings_to_demolish.farmsc
            }&` +
            `labsc=${buildings_to_demolish.labsc}&fctrsc=${buildings_to_demolish.fctrsc}&brcksc=${buildings_to_demolish.brcksc}&plntsc=${buildings_to_demolish.plntsc}&entzsc=${buildings_to_demolish.entzsc}&` +
            `mlbsc=${buildings_to_demolish.mlbsc}&cssc=${buildings_to_demolish.cssc}`;

        xmlHttp.send(params);
    });
    promise = promise.then(
        (response) =>
            new Promise((resolve) => {
                let freed_space = freedSpace(response);
                resolve(freed_space);
            })
    );

    return promise;
}

function freedSpace(response) {
    let responseText = response.responseText;
    let dom = new DOMParser().parseFromString(responseText, "text/html");

    let warn_element = dom.querySelector(".infomsg strong");
    if (!warn_element || warn_element.length === 0) {
        return false;
    }
    return Number(warn_element.textContent);
}

// example
// values: [
//     [label, value, decimals, price],
//     [label, value, decimals],
//     [label, value, decimals],
//     [label, value, decimals, price],
// ]
function createTooltip(element, values) {
    element.classList.add("tooltip");

    let div,
        container = document.createElement("div");
    container.classList.add("tooltiptext");
    element.appendChild(container);

    values.forEach((value) => {
        if (!value) return;

        div = document.createElement("div");
        container.appendChild(div);

        createSpan(div, value);
    });
}

// values: [label, value, decimals, price]
function createSpan(div, values) {
    if (values.length == 1 && values[0] == "") {
        let br = document.createElement("br");
        div.appendChild(br);
        return;
    }

    let span = document.createElement("span");
    span.textContent = values[0];
    div.appendChild(span);

    if (!values[1]) {
        span.style.fontWeight = "bold";
        return span;
    }

    span = document.createElement("span");
    span.textContent = values[1].toFixed(values[2]);
    div.appendChild(span);

    if (values[1] > 0) {
        span.classList.add("plus");
    } else {
        span.classList.add("minus");
    }

    if (values[3] !== undefined) {
        if (values[3] !== 0) {
            const value = values[1] * values[3];
            span = document.createElement("span");
            span.textContent = "(" + value.toFixed(2) + "$)";
            span.classList.add(value > 0 ? "plus" : "minus");
            div.appendChild(span);
        }
    } else {
        span.textContent += "$";
    }

    return span;
}

function addBudovyCss() {
    const styles = `.tooltip { position: relative; }
        .tooltip .tooltiptext { visibility: hidden; width: 360px; top: 100%; left: 50%; margin-left: -180px; background-color: #363636; color: #fff; text-align: left; padding: 5px 5px; margin-top: 10px; border-radius: 6px; border: 1px solid white; position: absolute; z-index: 1; }
        .tooltip:hover .tooltiptext { visibility: visible; }
        .tooltip .tooltiptext::after { content: ' '; position: absolute; bottom: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: transparent transparent white transparent; }
        .tooltiptext > div:last-child { font-weight: bold; }
        .form-item { display: block; width: 100%; height: 100%; padding: 6px 0; box-sizing: border-box; text-align: center; }
        table.vis_tbl td { height: 1.2rem; }`;
    addCss(styles);
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