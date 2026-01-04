// ==UserScript==
// @name         Webgame svetovy trh - nakup
// @version      2024-05-05
// @description  Webgame - svetovy trh - upravy
// @author       yS
// @match        *://*.webgame.cz/wg/index.php?p=domtrh
// @match        *://*.webgame.cz/wg/index.php?p=svetovy_trh
// @match        *://*.webgame.cz/wg/index.php?p=svetovy_trh&s=trhkoupit
// @match        *://*.webgame.cz/wg/index.php?p=svetovy_trh&s=techkoupit
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @namespace https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457641/Webgame%20svetovy%20trh%20-%20nakup.user.js
// @updateURL https://update.greasyfork.org/scripts/457641/Webgame%20svetovy%20trh%20-%20nakup.meta.js
// ==/UserScript==

const SHOW_COLUMN_PRICE_PRESTIGE = "show_column_price_prestige";
const COLUMN_PRICE_PRESTIGE_BEFORE_PRICE_PER_UNIT = "column_price_prestige_before_column_price_per_unit";
const SHOW_HINT = "show_hint";
const COLUMN_PRESTIGE_CHANGE = "show_column_prestige_change";

const PRESTIGE_PER_UNIT = [
    0.02, // jidlo
    0.02, // energie
    1, // vojaci
    5, // tanky
    3.5, // stihacky
    3.5, // bunkry
    2.7, // mechy
    15 // agenti
];

const is_trh_s_techy = document.location.href.indexOf("techkoupit") != -1;
const is_domaci_trh = document.location.href.indexOf("domtrh") != -1;

const IS_COLUMN_PRICE_PER_PRESTIGE_IS_VISIBLE = getSetting(SHOW_COLUMN_PRICE_PRESTIGE, true);
const IS_COLUMN_PRICE_PER_PRESTIGE_BEFORE = getSetting(COLUMN_PRICE_PRESTIGE_BEFORE_PRICE_PER_UNIT, false);
const IS_HINT_VISIBLE = getSetting(SHOW_HINT, true);
const IS_PRESTIGE_CHANGE_VISIBLE = getSetting(COLUMN_PRESTIGE_CHANGE, true);
const COLUMN_PRICE_INDEX = 4 + (is_domaci_trh == true ? 1 : 0) + (IS_COLUMN_PRICE_PER_PRESTIGE_IS_VISIBLE && IS_COLUMN_PRICE_PER_PRESTIGE_BEFORE && !is_domaci_trh ? 1 : 0);


function setSetting(setting_name, value) {
    // eslint-disable-next-line no-undef
    GM_setValue(setting_name, value);
}

function getSetting(setting_name, default_value) {
    // eslint-disable-next-line no-undef
    return GM_getValue(setting_name, default_value);
}

if (IS_PRESTIGE_CHANGE_VISIBLE) {
    addColumnPrestigeGained();
}
modifyInputs();
if (is_trh_s_techy == false) {
    createSettings();
    if (!IS_COLUMN_PRICE_PER_PRESTIGE_IS_VISIBLE) {
        return;
    }

    addColumnPricePerPrestige();
    if (is_domaci_trh != true) {
        addObserver();
    }
}



function modifyInputs() {
    let elements = document.getElementsByClassName("tdinput");

    for (let i = 0; i < elements.length; i++) {
        let column = elements[i];
        let input = column.children[0];

        if (input == null) {
            // there is no input => skip
            continue;
        }

        //skip "the price does not matter" checkbox
        if (input.type == "checkbox") {
            continue;
        }

        // skip mechy if we don't have them researched yet
        if (input.tagName == "SPAN") {
            continue;
        }

        input.addEventListener("input", handleInput);
        input.value = "";

        input.form.addEventListener("submit", () => {
            processFinalValueOfInput(input);
            if (Math.floor(parseInt(input.value)) == 0) {
                return;
            }
        });

        // add button BUY ALL
        let button = createButtonBuyAll(column);
        column.appendChild(button);
    }

    let container = document.getElementsByClassName("infotext")[0];

    let element = document.createElement("br");
    container.appendChild(element);
    element = document.createElement("br");
    container.appendChild(element);

    if (IS_HINT_VISIBLE) {
        let b = document.createElement("b");
        b.classList.add("plus");
        b.innerHTML =
            "V inputech lze použít:<br>" +
            "x* pro násobení (např 50*600 => 30.000) - užitečné pro nákup surovin na X kol.<br>" +
            "k = násobení tisícem, m = násobení miliónem a \",.\" pro desetinná čísla (např. 0.5M = 500.000)<br>" +
            "Nově lze použít na začátku znaky \"@\" a \"=\" pro nákup do počtu (včetně toho, které už mámé). Máme 300k, hodnota @330k => nakoupí 30k";
        container.appendChild(b);
    }
}

function handleInput(event) {
    filterField(event);
    if (IS_PRESTIGE_CHANGE_VISIBLE) {
        processPrestigeChange(event);
    }
}

function createSettings() {
    let container = document.getElementsByClassName("infotext")[0];

    let config = createConfig(SHOW_COLUMN_PRICE_PRESTIGE, "Zobrazit sloupec cena / prestiž", true);
    container.appendChild(config);

    config = createConfig(COLUMN_PRICE_PRESTIGE_BEFORE_PRICE_PER_UNIT, "Umístit sloupec cena / prestiž před sloupec cena / kus", true);
    container.appendChild(config);

    config = createConfig(COLUMN_PRESTIGE_CHANGE, "Zobrazit sloupec změny prestiže (je WIP)", true);
    container.appendChild(config);

    config = createConfig(SHOW_HINT, "Zobrazit nápovědu", true);
    container.appendChild(config);
}

function filterField(e) {
    let t = e.target;
    let badValues = /[^0-9xkm,.*=@]/gi;
    let value = t.value.replaceAll(badValues, '');

    if (value.startsWith("0")) {
        value = value.slice(1);
    }

    // remove @= characters if not at the start
    const chars = ["@", "="];
    chars.forEach(character => {
        while (value.lastIndexOf(character) > 0) {
            let index = value.lastIndexOf(character);
            console.log(`filter ${character} ... value before ${value}`);
            value = value.slice(0, index) + value.slice(index + 1);
            console.log(`filter ${character} ... value after ${value}`);
        }
    })

    t.value = value;
}

function processFinalValueOfInput(input) {
    input.value = getFinalValueOfInput(input);
}

function getFinalValueOfInput(input) {
    let value = input.value.toLowerCase();
    while (value.charAt(0) === '0') {
        value = value.slice(1);
    }
    value = value.replaceAll(",", ".");
    value = value.replaceAll("k", "*1000");
    value = value.replaceAll("m", "*1000000");
    const is_equal = value.startsWith("@") || value.startsWith("=");
    let values = value.split(/[*x]+/);

    if (is_equal) {
        values[0] = values[0].slice(1);
    }

    let final_value = 0;
    if (values.length == 1) {
        final_value = values[0];
    } else {
        final_value = 1;
        for (let i = 0; i < values.length; i++) {
            final_value *= parseFloat(values[i]);
        }
    }

    if (is_equal) {
        const row = input.closest("tr");
        const currently_have = Number(row.cells[1].textContent.replace(/\s/g, ""));

        final_value = Math.max(final_value - currently_have, 0);
    }

    return final_value;
}

function createButtonBuyAll(parent) {
    let button = document.createElement("button");
    button.innerHTML = "Všechno";
    button.type = "button";
    button.classList.add("submit");
    button.addEventListener('click', () => {
        fillIn(parent);
        parent.children[0].focus();
    });
    return button;
}

function fillIn(parent) {
    let numbers = [456456456, 999999999, 456546456, 456465456, 456456546, 99999999, 456456465, 456456564, 123123123, 123123132, 123123213, 123123312, 123213123, 123132123, 9999999];
    let input = parent.getElementsByTagName("input");
    input[0].value = numbers[Math.floor(numbers.length * Math.random())];

    const event = new Event("input");
    input[0].dispatchEvent(event);
}

function getTradeTable() {
    let table_elements = document.getElementsByClassName("vis_tbl");
    if (table_elements.length == 0) {
        return false;
    }
    return table_elements[table_elements.length - 1];
}

function addObserver() {
    const table = getTradeTable();
    if (table == false) {
        return;
    }

    const cell = table.rows[1].cells[1];

    let observer = new MutationObserver(mutations => {
        mutations.forEach(function (mutation) {
            if (mutation.type == "childList") {
                updatePricePerPrestige();
            }
        });
    });

    observer.observe(cell, {
        childList: true,
        subtree: false
    });
}

function addColumnPricePerPrestige() {
    let table = getTradeTable();
    if (table == false) {
        return;
    }
    const price_dom_trh_offset = is_domaci_trh == true ? 2 : 0;
    const column_offset = IS_COLUMN_PRICE_PER_PRESTIGE_BEFORE ? -1 : 0;
    const column_index = 5 + price_dom_trh_offset + column_offset;

    let th = document.createElement("th");
    th.innerHTML = "Cena/prestiž";
    table.rows[0].insertBefore(th, table.rows[0].children[column_index]);

    for (let i = 1, row, td; i < table.rows.length - 1; i++) {
        row = table.rows[i];
        td = row.insertCell(column_index);

        td.classList.add("price_per_prestige");
        td.style.color = "#00DD00";
        td.style.fontWeight = "bold";
        td.style.textAlign = "right";
        td.style.backgroundColor = "transparent";
        td.innerText = 0;
    }
    let element = table.rows[table.rows.length - 1].children[0];
    element.colSpan = element.colSpan + 1;

    updatePricePerPrestige();
}

function updatePricePerPrestige() {
    const price_dom_trh_offset = is_domaci_trh == true ? 1 : 0;
    const ppp_dom_trh_offset = is_domaci_trh == true ? 2 : 0;
    const column_offset = IS_COLUMN_PRICE_PER_PRESTIGE_BEFORE ? -1 : 0;

    const price_column_index = 4 + price_dom_trh_offset - (is_domaci_trh ? 0 : column_offset);
    const price_per_prestige_column_index = 5 + ppp_dom_trh_offset + column_offset;

    let table = getTradeTable();
    if (table == false) {
        return;
    }

    for (let i = 1, row, price, price_per_prestige; i < table.rows.length - 1; i++) {
        row = table.rows[i];

        price = parseInt(row.cells[price_column_index].innerText.replace(" ", ""));
        price_per_prestige = Math.round(price / PRESTIGE_PER_UNIT[i - 1] * 10) / 10;

        row.cells[price_per_prestige_column_index].innerText = price_per_prestige;
    }
}

function addColumnPrestigeGained() {
    let table = getTradeTable();
    if (table == false) {
        return;
    }

    let th = document.createElement("th");
    th.innerHTML = "Změna prestiže";
    table.rows[0].appendChild(th);

    for (let index = 1; index < table.rows.length - 1; index++) {
        const row = table.rows[index];
        let cell = row.insertCell();
        cell.textContent = 0;
        const prestige_per_unit = is_trh_s_techy ? 1 : PRESTIGE_PER_UNIT[index - 1];
        cell.dataset.prestige_per_unit = prestige_per_unit;
    }

    let cell = table.rows[table.rows.length - 1].insertCell();
    cell.dataset.prestige_per_unit = 1;
    cell.textContent = 0;
}

function processPrestigeChange(event) {
    let target = event.target;
    let count = getFinalValueOfInput(target);
    let final_value = 0;

    let row = target.closest("tr");
    const any_price_checked = isAnyPriceChecked(row);
    let cell = row.cells[row.cells.length - 1];

    let price = parseInt(row.cells[COLUMN_PRICE_INDEX].innerText.replace(" ", ""));
    let money_prestige_per_unit = price * 0.002;
    if (isNaN(count) || count === "") {
        count = 0;
    } else {
        if (!any_price_checked) {
            const amount_for_sale = parseInt(row.cells[2].innerText.replaceAll(" ", ""));
            if (amount_for_sale < count) {
                count = amount_for_sale;
            }
            const we_have_money_for = parseInt(row.cells[3].innerText.replaceAll(" ", ""));
            if (we_have_money_for < count) {
                count = we_have_money_for;
            }
        }
    }
    if (count !== 0) {
        final_value = (count * (cell.dataset.prestige_per_unit - money_prestige_per_unit)).toFixed(2);
    }
    cell.textContent = final_value;
    cell.title = `Počet: ${count} \nPrestiž jednotky: ${cell.dataset.prestige_per_unit}\nPrestiž peněz: ${money_prestige_per_unit.toFixed(3)}`;

    let color = "inherit";
    if (final_value > 0) {
        color = "chartreuse";
    } else if (final_value < 0) {
        color = "red";
    }
    cell.style.color = color;

    const table = row.closest("table");
    processPrestigeChangeSum(table);
}

function isAnyPriceChecked(row) {
    let checkbox = row.querySelector("input[type=checkbox]");
    if (!checkbox) return false;
    return checkbox.checked;
}

function processPrestigeChangeSum(table) {
    let sum = 0,
        text = 0;
    for (let index = 1; index < table.rows.length - 1; index++) {
        const row = table.rows[index];
        sum += Number(row.cells[row.cells.length - 1].textContent);
    }
    if (sum !== 0) {
        text = sum.toFixed(2);
    }

    let row = table.rows[table.rows.length - 1];
    let cell = row.cells[row.cells.length - 1];
    cell.textContent = text;

    let color = "inherit";
    if (sum > 0) {
        color = "chartreuse";
    } else if (sum < 0) {
        color = "red";
    }
    cell.style.color = color;
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