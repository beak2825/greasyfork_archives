// ==UserScript==
// @name         Land of Ice modifikace
// @version      2024-10-17
// @description  Menu, rychle utoky, dane, dobyti mesta
// @author       yS, doon (copying army)
// @match        *://*.landofice.com/main.php*
// @match        *://*.landofice.com/market*
// @match        *://*.landofice.com/utok*
// @match        *://*.landofice.com/settings*
// @match        *://*.landofice.com/klanarmy_vybaveni*
// @match        *://*.landofice.com/aliance/banka*
// @match        *://*.landofice.com/stavby/portal*
// @match        *://*.landofice.com/chat*
// @match        *://*.landofice-simulator.4fan.cz/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @namespace    https://greasyfork.org/users/1005892
// @icon         https://www.google.com/s2/favicons?sz=64&domain=landofice.com
// @downloadURL https://update.greasyfork.org/scripts/460215/Land%20of%20Ice%20modifikace.user.js
// @updateURL https://update.greasyfork.org/scripts/460215/Land%20of%20Ice%20modifikace.meta.js
// ==/UserScript==

// Constants for disabling certain parts of the script
const ZMENIT_MENU = "edit_menu";
const PRIDAT_DANE = "add_vat";
const PRIDAT_DOBYT_MESTO = "add_city";
const PRIDAT_NASTAVENI_PRODUKCE = "add_recruit_buttons";
const PRIDAT_RYCHLE_UTOKY = "add_quick_attacks";
const PRIDAT_SMART_REKRUT = "add_smart_recruit";
const POUZIT_ASYNC_REKRUT = "async_recruit";
const PRIDAT_SMART_MARKET = "add_smart_market";
const PRIDAT_SMART_PORTAL = "add_smart_portal";
const PRIDAT_SMART_BANK = "add_smart_bank";
const ZOBRAZIT_ZTRATY_V_UTOKU = "add_attack_losses";
const PRIDAT_ODKAZ_NA_SIMULATOR = "add_simulator_link";
const VYPNOUT_OBNOVOVANI_CHATU = "stop_refreshing_chat";
const ZKOPIROVANA_KLAN_ARMADA = "copied_clan_army";
const KOPIROVANI_KLAN_ARMADY = "copying_clan_army";
const VYPNOUT_PRODAVANI_RUN_ZA_MIN_CENY = "do_not_sell_runes_at_min_price";
const PRIDAT_TRH_VYBAVENI = "add_market_artifacts";
const PRIDAT_TRH_VYBAVENI_MIN_MAX_BUTTONS = "add_market_artifacts_min_max_buttons";
const ZOBRAZENA_TABULKA_VYBAVENI_U_TRHU = "visible_item_table_on_market";
const MARKET_REPEAT_PACKAGE_TIMES = "market_repeat_package_times";
const MARKET_REPEAT_PACKAGE_ITEM = "market_repeat_package_item";
const MARKET_REPEAT_PACKAGE_PRICE = "market_repeat_package_price";
const SIMULATOR_PASTE_ARMY_MAX_ATTEMPTS = 500;
const ZOBRAZIT_MAX_POP = "show_max_pop";
const VYBRANA_MOZNOST_ZOBRAZENI_POPULACE = "show_max_pop_variant"; // "Prostor pro lidi" = 0, "% zabraného místa" = 1, "% volného místa" = 2, "Prostor pro lidi + % zabraného místa" = 3, "Prostor pro lidi + % volného místa" = 4
const UPRAVIT_BARVU_POPULACE_DLE_ZALIDNENOSTI = "color_max_pop";
const CELKOVY_PROSTOR_PRO_BYDLENI = "current_max_pop";
const OBNOVIT_CELKOVY_PROSTOR_PRO_BYDLENI = "refresh_max_pop";
const AKTUALNI_KLAN_ID = "current_clan_id";
const POVOLIT_BARVOSLEPY_MOD = "colorblind_mode";
const POVOLIT_KOMPAKTNI_MOD_NA_PROSTOR = "compact_mode_for_max_pop";

const SIMULATOR_URL = "http://landofice-simulator.4fan.cz/";
const REFRESH_CLAN_URL = "/settings/changeClan/";
const REFRESH_MAIN = "/main.php?obnovit";

const ARTIFACT_MIN_PRICE = 200000;
const ARTIFACT_MAX_PRICE = 20000000;

const ID_BUDOVY_TEMNYCH_PRIZRAKU = 1030;

let configuration_showing = 0;
let active_clan_id = null;

let interval = null;
let interval_tries = 0;

if (location.href.indexOf("simulator") != -1) {
    // eslint-disable-next-line no-undef
    if (!GM_getValue(KOPIROVANI_KLAN_ARMADY, false)) {
        return;
    }
    // eslint-disable-next-line no-undef
    GM_setValue(KOPIROVANI_KLAN_ARMADY, false);
    interval = window.setInterval(function () {
        interval_tries++;
        if (pasteArmy() || interval_tries > SIMULATOR_PASTE_ARMY_MAX_ATTEMPTS) {
            clearInterval(interval);
        }
    }, 200);
    return;
}

if (location.href.indexOf("market") != -1) {
    modifyMarket();
    if (location.href.indexOf("artefacts") != -1) {
        modifyArtifactMarket();
    }
    return;
}

if (location.href.indexOf("aliance/banka") != -1) {
    modifyAliBank();
    return;
}

if (location.href.indexOf("portal") != -1) {
    modifyPortal();
    return;
}

if (location.href.indexOf("chat") != -1) {
    stopRefreshingChat();
    return;
}

if (location.href.indexOf("utok") != -1) {
    // eslint-disable-next-line no-undef
    if (GM_getValue(ZOBRAZIT_ZTRATY_V_UTOKU, true) == false) {
        return;
    }

    let konec = document.getElementById("konec");
    if (konec != null) {
        let results_div = addBattleResult(document, false, false, false);

        let br = document.createElement("br");
        results_div.append(br);
        br = document.createElement("br");
        results_div.append(br);

        konec.append(results_div);

        let event_type = location.href.split("utok=")[1];
        if (event_type.includes("vesnice") || event_type.includes("osada") || event_type.includes("opevnene_mesto") || event_type.includes("pleneni_06")) {
            // eslint-disable-next-line no-undef
            GM_setValue(OBNOVIT_CELKOVY_PROSTOR_PRO_BYDLENI, true);
        }
    }
    return;
}

if (location.href.indexOf("settings") != -1) {
    modifySettings();
    return;
}

if (location.href.indexOf("klanarmy_vybaveni") != -1) {
    processEquipment();
    return;
}

// eslint-disable-next-line no-undef
if (GM_getValue(ZMENIT_MENU, true)) {
    modifyMenu();
    modifyClanStats();
}
// eslint-disable-next-line no-undef
if (GM_getValue(PRIDAT_RYCHLE_UTOKY, true)) {
    modifyBattles();
}
// eslint-disable-next-line no-undef
if (GM_getValue(PRIDAT_SMART_REKRUT, true) || GM_getValue(POUZIT_ASYNC_REKRUT, true)) {
    modifyRecruit();
}
addMenuRightButtons();

// FUNCTIONS

// ALI BANK
function modifyAliBank() {
    let div = document.createElement("div");
    div.style.marginLeft = "5px";
    div.style.marginBottom = "5px";
    addConfigBelowHeader(div, PRIDAT_SMART_BANK, "Použít chytré inputy v ali pokladně.", true);

    // eslint-disable-next-line no-undef
    if (GM_getValue(PRIDAT_SMART_BANK, true) == true) {
        let elements = document.querySelectorAll("input[type='text']");

        for (let i = 0; i < elements.length; i++) {
            let input = elements[i];
            modifySmartInput(input);
        }
    }
}
// ALI BANK END

// MARKET
function modifyMarket() {
    // eslint-disable-next-line no-undef
    const change_market = GM_getValue(PRIDAT_SMART_MARKET, true);

    if (location.href.endsWith("market") || location.href.endsWith("runes")) {
        let div = document.createElement("div");
        div.style.marginBottom = "30px";
        addConfigBelowHeader(div, PRIDAT_SMART_MARKET, "Použít chytré tržiště - použití x* pro násobení, k = násobení tisícem, m = násobení miliónem a ',.' pro desetinná čísla.", true);

        if (change_market == false) {
            return;
        }

        let form = document.forms[0];
        let select_element = form.kolik_krat;

        let input = document.createElement("input");
        select_element.parentElement.replaceChild(input, select_element);

        input.name = "kolik_krat";
        input.placeholder = 1;
        modifySmartInput(input, setPlaceholderAsValue);

        form.kolik.placeholder = 1;
        form.kolik.maxLength = 5;
        modifySmartInput(form.kolik, setPlaceholderAsValue);

        form.cena.maxLength = 12;
        // eslint-disable-next-line no-undef
        if (GM_getValue(VYPNOUT_PRODAVANI_RUN_ZA_MIN_CENY) === true) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                if (validatePrice(form) === true) {
                    form.submit();
                }
            });
        }
        modifySmartInput(form.cena);
    } else {
        if (change_market == false) {
            return;
        }

        let elements = document.querySelectorAll("input[type='number']");
        if (elements.length == 0) {
            elements = document.querySelectorAll("input[type='text']");
        }

        for (let i = 0; i < elements.length; i++) {
            let input = elements[i];
            modifySmartInput(input);
        }
    }
}

function modifyArtifactMarket() {
    // toggle the settings on / off
    let container = document.getElementsByClassName("opaque-frame")[0];

    // eslint-disable-next-line no-undef
    let i = GM_getValue(PRIDAT_TRH_VYBAVENI, false) == true ? 1 : 0;
    let texts = ["Přidat změny", "Schovat změny"];

    let button = createElement("input");
    button.type = "button";
    button.classList.add("button");
    button.value = texts[i];
    button.addEventListener("click", function () {
        i = (i + 1) % 2;
        // eslint-disable-next-line no-undef
        GM_setValue(PRIDAT_TRH_VYBAVENI, i == 1);
        location.reload();
    });
    container.append(button);

    if (i == 0) {
        return;
    }

    // eslint-disable-next-line no-undef
    let min_max_index = GM_getValue(PRIDAT_TRH_VYBAVENI_MIN_MAX_BUTTONS, false) == true ? 1 : 0;
    texts = ["Přidat min/max", "Schovat min/max"];

    button = createElement("input");
    button.type = "button";
    button.classList.add("button");
    button.value = texts[min_max_index];
    button.addEventListener("click", function () {
        min_max_index = (min_max_index + 1) % 2;
        // eslint-disable-next-line no-undef
        GM_setValue(PRIDAT_TRH_VYBAVENI_MIN_MAX_BUTTONS, min_max_index == 1);
        location.reload();
    });
    container.append(button);
    //

    let form = document.forms[0];

    let p = createParagraph("Předměty se prodávají po jednom - cena je za kus.");
    form.prepend(p);

    let input = createElement("input", "");
    input.classList.add("repeat");
    input.type = "text";
    input.placeholder = "1";
    input.size = 1;
    input.maxLength = 3;
    form.insertBefore(input, form.childNodes[2]);
    modifySmartInput(input, setPlaceholderAsValue);

    let span = createElement("span", " x ");
    form.insertBefore(span, form.childNodes[3]);

    if (min_max_index == 1) {
        button = createElement("input", "", form);
        button.classList.add("button");
        button.type = "button";
        button.value = "Prodat za 200k";
        // eslint-disable-next-line no-undef
        button.addEventListener("click", function () {
            if (form.cena.value != 0) {
                return;
            }
            form.cena.value = ARTIFACT_MIN_PRICE;
            form.submit_sell.click();
        });

        button = createElement("input", "", form);
        button.classList.add("button");
        button.type = "button";
        button.value = "Prodat za 20M";
        // eslint-disable-next-line no-undef
        button.addEventListener("click", function () {
            if (form.cena.value != 0) {
                return;
            }
            form.cena.value = ARTIFACT_MAX_PRICE;
            form.submit_sell.click();
        });
    }

    if (repeatTrade(form) == true) {
        return;
    }

    form.addEventListener("submit", function () {
        // eslint-disable-next-line no-undef
        GM_setValue(MARKET_REPEAT_PACKAGE_ITEM, form.vec.selectedOptions[0].innerText);
        // eslint-disable-next-line no-undef
        GM_setValue(MARKET_REPEAT_PACKAGE_PRICE, form.cena.value);
        // eslint-disable-next-line no-undef
        GM_setValue(MARKET_REPEAT_PACKAGE_TIMES, form.elements[0].value - 1);
    });

    const url = "../klanarmy_vybaveni.php";
    httpGetAsync(url, artifactsShowArtifactTable);
}

function repeatTrade(form) {
    // eslint-disable-next-line no-undef
    let times = GM_getValue(MARKET_REPEAT_PACKAGE_TIMES, null);
    // eslint-disable-next-line no-undef
    let item = GM_getValue(MARKET_REPEAT_PACKAGE_ITEM, null);
    // eslint-disable-next-line no-undef
    let price = GM_getValue(MARKET_REPEAT_PACKAGE_PRICE, null);

    if (times == null || times == 0 || item == null || price == null) {
        resetTrade();
        return false;
    }

    // item
    let found = false;
    for (let i = 0; i < form.vec.options.length; i++) {
        let option = form.vec.options[i];
        if (option.innerText == item) {
            found = true;
            option.selected = true;
            form.vec.dispatchEvent(new Event("change"));
        }
    }
    if (found == false) {
        resetTrade();
        return false;
    }

    // price
    form.cena.value = price;

    // eslint-disable-next-line no-undef
    GM_setValue(MARKET_REPEAT_PACKAGE_TIMES, times - 1);

    form.submit_sell.click();

    return true;
}

function resetTrade() {
    // eslint-disable-next-line no-undef
    GM_setValue(MARKET_REPEAT_PACKAGE_TIMES, null);
    // eslint-disable-next-line no-undef
    GM_setValue(MARKET_REPEAT_PACKAGE_ITEM, null);
    // eslint-disable-next-line no-undef
    GM_setValue(MARKET_REPEAT_PACKAGE_PRICE, null);
}

function artifactsShowArtifactTable(response) {
    let responseText = response.responseText;
    let dom = new DOMParser().parseFromString(responseText, "text/html");

    // ADD EQUIPMENT TABLE FROM THE INVENTORY PAGE
    let tables = dom.getElementsByClassName("equip-items-table");
    let item_table = tables[0];

    let container = document.getElementsByClassName("opaque-frame")[0];

    // eslint-disable-next-line no-undef
    let i = GM_getValue(ZOBRAZENA_TABULKA_VYBAVENI_U_TRHU, false) == true ? 1 : 0;
    let texts = ["Schovat tabulku", "Zobrazit tabulku"];

    let button = createElement("input");
    button.type = "button";
    button.classList.add("button");
    button.value = texts[i];
    container.append(button);

    let cloned_table = item_table.cloneNode(true);
    cloned_table.classList.add("text");
    if (i == 1) {
        cloned_table.classList.add("hide");
    }
    cloned_table.id = "cloned_table";
    container.append(cloned_table);

    button.addEventListener("click", function () {
        i = (i + 1) % 2;
        // eslint-disable-next-line no-undef
        GM_setValue(ZOBRAZENA_TABULKA_VYBAVENI_U_TRHU, i == 1);
        button.value = texts[i];
        cloned_table.classList.toggle("hide");
    });
    // EQUIPMENT TABLE

    // link items together
    const css = ".highlight { border: 3px groove gold !important; font-weight: unset; }";
    addCss(css);

    // equipmnent, link equipment table to the item selector
    let equipment_select = document.forms[0].vec;
    // skip table head
    for (let i = 1; i < cloned_table.rows.length; i++) {
        let option = equipment_select.options[i - 1]; // minus table head
        let row = cloned_table.rows[i];
        row.addEventListener("click", function () {
            option.selected = true;
            equipment_select.dispatchEvent(new Event("change"));
        });
        row.style.cursor = "pointer";
        pairElements(row, option, row.children[0].innerText);
    }

    equipment_select.addEventListener("change", function () {
        if (equipment_select.selectedOptions[0].dataset.id == null) {
            return;
        }

        highlightRow(equipment_select.selectedOptions[0].dataset.id);
    });

    // dispatch the events to force highlight on the selected options
    equipment_select.dispatchEvent(new Event("change"));

    // link items together END
}

function validatePrice(form) {
    processFinalValueOfInput(form.kolik);
    processFinalValueOfInput(form.cena);

    let count = Math.floor(parseInt(form.kolik.value));
    let price = Math.floor(parseInt(form.cena.value));

    if (price / count <= 1000) {
        console.log("Cena runy pod cenou, stop");
        return false;
    }

    return true;
}
// MARKET END

// PORTAL
function modifyPortal() {
    // eslint-disable-next-line no-undef
    if (GM_getValue(PRIDAT_SMART_PORTAL, true) != true) {
        return;
    }

    let form = document.forms[0];
    let repeat_elements = form.opakovat;
    let parent_element = form.opakovat[0].parentElement.parentElement;
    while (repeat_elements.length > 0) {
        repeat_elements[0].parentElement.remove();
    }

    let div = document.createElement("div");

    let input = document.createElement("input");
    input.type = "text";
    input.id = "opakovat";
    input.name = "opakovat";
    input.style.position = "inherit";
    input.placeholder = 1;
    input.addEventListener("input", filterField);

    let label = document.createElement("label");
    label.htmlFor = input.id;
    label.style.marginRight = "5px";
    label.style.color = "#BFBEBC";
    label.innerText = "Počet opakování: ";

    div.append(label);
    div.append(input);
    parent_element.append(div);

    input.form.addEventListener("submit", () => {
        setPlaceholderAsValue(input);
        processFinalValueOfInput(input);
    });
}
// PORTAL END

// CHAT
function stopRefreshingChat() {
    // eslint-disable-next-line no-undef
    if (GM_getValue(VYPNOUT_OBNOVOVANI_CHATU, false) == false) {
        return;
    }

    let element = document.forms[0].stop_reload;
    element.click();
}
// CHAT - END

// RECRUIT
/**
 * Modifies the buildings. Changes recruit from refreshing the page, to sending the form through XHR
 */
function modifyRecruit() {
    // modify the form
    for (let i = 0; i < document.forms.length; i++) {
        const form = document.forms[i];
        if (form.action.indexOf("changeClan") != -1) {
            continue;
        }

        let input = form.bu_kolik;
        if (input == null) {
            console.log("Chybi input na pocet vybaveni");
            continue;
        }

        // eslint-disable-next-line no-undef
        if (GM_getValue(PRIDAT_SMART_REKRUT, true)) {
            input.type = "text";
            input.value = null;
            input.addEventListener("input", filterField);
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            processFinalValueOfInput(input);
            if (Math.floor(parseInt(input.value)) == 0) {
                input.value = null;
                return;
            }
            // eslint-disable-next-line no-undef
            if (GM_getValue(POUZIT_ASYNC_REKRUT, true)) {
                handleForm(form, recruitCallback);
                input.value = null;
                input.blur();
            } else {
                form.submit();
            }
        });
    }

    // if not using async recruit, skip modifying the anchors
    // eslint-disable-next-line no-undef
    if (GM_getValue(POUZIT_ASYNC_REKRUT, true) == false) {
        return;
    }

    // modify the anchors
    let elements = document.querySelectorAll(".recrut_btn a");
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let action = element.href;
        element.href = "javascript:void(0)";

        let form = element.parentElement.nextElementSibling;

        element.addEventListener("click", () => {
            httpPostAsync(action, null, recruitCallback, form);
        });
    }
}

function processFinalValueOfInput(input) {
    input.value = input.value.toLowerCase().replaceAll(",", ".").replaceAll("k", "*1000").replaceAll("m", "*1000000");
    let values = input.value.split(/[*x]+/);
    let value = 0;
    if (values.length == 1) {
        value = values[0];
    } else {
        value = 1;
        for (let i = 0; i < values.length; i++) {
            value *= parseFloat(values[i]);
        }
    }
    input.value = value;
}

function filterField(e) {
    let t = e.target;
    let badValues = /[^0-9xkm,.*]/gi;
    t.value = t.value.replaceAll(badValues, "");
}

function recruitCallback(dom, form) {
    let elements = dom.getElementsByClassName("odehraj-ostatni");
    if (elements.length != 1) {
        return;
    }

    let div = document.createElement("div");
    div.innerText = elements[0].innerText;

    let building_action_id = parseInt(form.action.split("budovaaction=")[1]);
    if (building_action_id == ID_BUDOVY_TEMNYCH_PRIZRAKU) {
        // eslint-disable-next-line no-undef
        GM_setValue(OBNOVIT_CELKOVY_PROSTOR_PRO_BYDLENI, true);
    }

    appendToOdtah(div);
    updateMaterials(dom);
}

function updateMaterials(dom) {
    let original_element = document.getElementsByClassName("klan-stats")[0];
    let updated_element = dom.getElementsByClassName("klan-stats")[0];
    original_element.parentElement.replaceChild(updated_element, original_element);
    modifyClanStats();

    original_element = document.getElementsByClassName("klan-source")[0];
    updated_element = dom.getElementsByClassName("klan-source")[0];
    original_element.parentElement.replaceChild(updated_element, original_element);

    let original_elements = document.querySelectorAll(".odehraj-budovy-akce .build .data p");
    let updated_elements = dom.querySelectorAll(".odehraj-budovy-akce .build .data p");
    for (let i = 0; i < original_elements.length; i++) {
        original_elements[i].parentElement.replaceChild(updated_elements[i], original_elements[i]);
    }
}

// RECRUIT END

// QUICK BATTLES

/**
 * Adds a button for quick battles
 */
function modifyBattles() {
    let links_node_list = document.querySelectorAll(".odehraj:NOT(.odehraj-budovy-akce, .odehraj-odtah, .odehraj-new-stavby, .odehraj-valka) a"); // prophet, new buildings and buildings
    let links = Array.prototype.slice.call(links_node_list);

    let defend_city_link = document.querySelector(".odehraj.odehraj-valka a:nth-of-type(2)"); // sieged city
    if (defend_city_link != null) {
        links.push(defend_city_link);
    }

    for (let i = 0; i < links.length; i++) {
        addQuickBattle(links[i]);
    }
}

function quickAttackRenderBattleResult(dom, form, params) {
    let div = addBattleResult(dom, true, true, true);
    if (div !== null) {
        appendToOdtah(div);
    }
    if (params.element != null && params.text_after != null) {
        params.element.innerText = params.text_after;
    }
}

/**
 * Renders all of the battle results. The losses, new units, experience gained and rewards.
 * @param HTMLDocument dom
 */
function addBattleResult(dom, show_rewards = true, show_exp = true, show_equipment_gained = true) {
    let div = document.createElement("div");
    let br = document.createElement("br");
    div.append(br);

    if (show_rewards) {
        let konec = dom.getElementById("konec");

        if (konec == null) {
            return null;
        }

        for (let i = 1; ; i++) {
            konec = konec.nextSibling;

            if (konec == null) {
                break;
            }

            let element = konec.cloneNode(true);
            div.append(element);
        }
    }

    const results = processLosses(dom);
    const losses_map = results[0];
    const experience_element = results[1];

    if (losses_map != null) {
        renderLosses(losses_map, div);
    }

    if (experience_element != null && show_exp) {
        div.append(experience_element);
    }

    if (show_equipment_gained) {
        let break_elements = dom.querySelectorAll("div.obrance p br");

        if (break_elements.length > 0) {
            let equipment_div = document.createElement("div");

            for (let i = 0; i < break_elements.length; i++) {
                let html = break_elements[i].parentElement.innerHTML.split("<br>");
                let p = document.createElement("p");
                p.innerHTML = html[1];
                p.children[0].style.color = "#bdb76b";
                equipment_div.append(p);
            }

            div.append(equipment_div);
        }
    }

    return div;
}

/**
 * Renders losses / gained units
 * @param  Map losses_map
 * @param  HTMLDivElement div
 */
function renderLosses(losses_map, div) {
    let losses_div = document.createElement("div");
    let reincarnated_div = document.createElement("div");
    let gained_units = false;
    let lost_units = false;
    let p;

    losses_map.forEach((count, unit) => {
        p = createParagraph(Math.abs(count) + " x " + unit);
        if (count < 0) {
            gained_units = true;
            reincarnated_div.append(p);
        } else {
            losses_div.append(p);
            lost_units = true;
        }
    });

    if (lost_units == true) {
        p = createParagraph("Ztráty");
        p.style.color = "red";
        losses_div.prepend(p);
        div.append(losses_div);
    }

    if (gained_units) {
        p = createParagraph("Získáno");
        p.style.color = "green";
        reincarnated_div.prepend(p);
        div.append(reincarnated_div);
    }
}

function appendToOdtah(div) {
    let odehraj_odtah = document.getElementsByClassName("odehraj-odtah");
    if (odehraj_odtah.length == 1) {
        odehraj_odtah = odehraj_odtah[0];
        odehraj_odtah.append(div);
    }
}

function getUnitData(element) {
    let unit_data = element.innerText.replaceAll(",", "").split(" x ");
    if (unit_data.length == 1) {
        return null;
    }
    let unit_name = unit_data[1].split(" (");
    return [unit_data[0], unit_name[0]];
}

function processLosses(dom) {
    let konec = dom.getElementById("konec");
    let elements = konec.querySelectorAll(".utocnik p");

    const units_map = new Map();
    let losses_map = new Map();

    // BEFORE BATTLE
    let army_elements = dom.querySelectorAll(".armady p.utocnik");
    for (let i = 0; i < army_elements.length; i++) {
        let unit_data = getUnitData(army_elements[i]);

        let original_count = units_map.get(unit_data[1]);
        if (original_count == null) {
            // in case more stacks of the same unit exist (general of old imperium)
            original_count = 0;
        }

        units_map.set(unit_data[1], original_count + parseInt(unit_data[0]));
    }

    // AFTER BATTLE
    let experience_element = null;

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].children[0] == null || elements[i].children[0].className != "privolane") {
            let unit_data = getUnitData(elements[i]);
            if (unit_data == null) {
                if (elements[i].innerText.indexOf("Za tuhle slavnou bitvu ziskava velitel") != -1) {
                    experience_element = elements[i].cloneNode(true);
                    experience_element.style.color = "chartreuse";
                }
                continue;
            }

            let original_count = units_map.get(unit_data[1]);
            units_map.delete(unit_data[1]);
            if (original_count == null) {
                // unit was not there at the beginning => added by necromancy
                original_count = 0;
            }

            if (original_count - unit_data[0] != 0) {
                let current_count = losses_map.get(unit_data[1]);
                if (current_count == null) {
                    current_count = original_count;
                }
                current_count = current_count - parseInt(unit_data[0]);
                if (current_count == 0) {
                    losses_map.delete(unit_data[1]);
                } else {
                    if (unit_data[1].indexOf("velitel klanu") != -1) {
                        // Commander is dead -> add back to army
                        httpGetAsync("/clanarmy/addCommander", null);
                        losses_map.set("Velitel klanu se vrátil zpátky do armády", -1);
                    }
                    losses_map.set(unit_data[1], current_count);
                }
            }
        }
    }

    if (losses_map.size == 0) {
        losses_map = null;
    }

    return [losses_map, experience_element];
}

function attack(response, params) {
    let responseText = response.responseText;
    let dom = new DOMParser().parseFromString(responseText, "text/html");

    let header = dom.getElementsByTagName("h2");
    let title = header[0].innerHTML;
    title = title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (title == "vesnice" || title == "osada" || title == "opevnene mesto") {
        // eslint-disable-next-line no-undef
        GM_setValue(OBNOVIT_CELKOVY_PROSTOR_PRO_BYDLENI, true);
        modifyClanStats();
    }

    handleForm(dom.forms[0], quickAttackRenderBattleResult, params);
}

function addQuickBattle(link) {
    let anchor = createAnchor("(Rychle zaútočit)", "Provede útok okamžitě, bez otevírání oken");
    addClickEventListener(anchor, link.href, attack, "(Útok se provádí)", "(Útok dokončen)");
    link.parentElement.insertBefore(anchor, link.nextSibling);
}

function addClickEventListener(element, url, callback, element_text = null, text_after = null) {
    element.addEventListener("click", () => {
        httpGetAsync(url, callback, {
            text_after: text_after,
            element: element,
        });
        if (element_text != null) {
            element.innerText = element_text;
        }
    });
}

// QUICK BATTLES END

// MENU

function modifyMenu() {
    // eslint-disable-next-line no-undef
    if (!GM_getValue(PRIDAT_DANE, true) && !GM_getValue(PRIDAT_DOBYT_MESTO, true) && !GM_getValue(PRIDAT_NASTAVENI_PRODUKCE, true)) {
        return;
    }

    let elements = document.getElementsByClassName("action-list");
    if (elements == null) {
        return;
    }
    let left_menu = elements[0];
    let index = 0;
    let sees_valka = false;

    for (let i = 0; i < left_menu.children.length; i++) {
        if (left_menu.children[i].innerText == "Válka") {
            sees_valka = true;
            break;
        }
    }

    // eslint-disable-next-line no-undef
    if (GM_getValue(PRIDAT_NASTAVENI_PRODUKCE, true)) {
        index = addRecruitButtonsToMenu(left_menu, index);
    }

    if (!sees_valka) {
        return;
    }

    // eslint-disable-next-line no-undef
    if (GM_getValue(PRIDAT_DANE, true)) {
        index = addVatModificationToMenu(left_menu, index);
    }

    // eslint-disable-next-line no-undef
    if (GM_getValue(PRIDAT_DOBYT_MESTO, true)) {
        let anchor = createAnchor("Dobýt město", "Okamžitě dobyje město bez nových oken");
        addClickEventListener(anchor, "utok.php?utok=mesto&", attack, "Útok se provádí", "Útok dokončen");

        let li = document.createElement("li");
        li.append(anchor);
        left_menu.insertBefore(li, left_menu.children[index++]);
    }
}

// CLAN STATS

function modifyClanStats() {
    // eslint-disable-next-line no-undef
    if (!GM_getValue(ZOBRAZIT_MAX_POP, false) && !GM_getValue(UPRAVIT_BARVU_POPULACE_DLE_ZALIDNENOSTI, false)) {
        return;
    }

    let clan_stats = document.getElementsByClassName("klan-stats");
    if (clan_stats == null) {
        return;
    }

    // eslint-disable-next-line no-undef
    if (GM_getValue(ZOBRAZIT_MAX_POP, false)) {
        editClanStatsCss();
    }

    // eslint-disable-next-line no-undef
    let force_pull_max_pop_cap = GM_getValue(CELKOVY_PROSTOR_PRO_BYDLENI, 0) == 0;
    if (!force_pull_max_pop_cap) {
        // eslint-disable-next-line no-undef
        force_pull_max_pop_cap = GM_getValue(OBNOVIT_CELKOVY_PROSTOR_PRO_BYDLENI, false);
    }

    let current_clan_id = 0;
    let clan_name_container = document.getElementsByClassName("klan-name");
    if (clan_name_container.length != 0) {
        clan_name_container = clan_name_container[0];

        let leader_header = clan_name_container.getElementsByTagName("h3");
        if (leader_header.length > 0) {
            let leader_text = leader_header[0].innerText;
            leader_text = leader_text.split("id: ")[1];
            leader_text = leader_text.split(")")[0];

            current_clan_id = parseInt(leader_text);

            // eslint-disable-next-line no-undef
            force_pull_max_pop_cap = force_pull_max_pop_cap || GM_getValue(AKTUALNI_KLAN_ID, 0) != current_clan_id;
        }
    }

    if (!force_pull_max_pop_cap) {
        let odehraj_valka_container = document.getElementsByClassName("odehraj-valka");
        if (odehraj_valka_container.length != 0) {
            odehraj_valka_container = odehraj_valka_container[0];

            let bold_elements = odehraj_valka_container.getElementsByTagName("b");
            for (let i = 0; i < bold_elements.length; i++) {
                if (bold_elements[i].innerText.includes("Podařilo se nám zrekonstruovat město")) {
                    force_pull_max_pop_cap = true;
                    break;
                }
            }
        }
    }

    if (force_pull_max_pop_cap) {
        // eslint-disable-next-line no-undef
        GM_setValue(OBNOVIT_CELKOVY_PROSTOR_PRO_BYDLENI, false);
        // eslint-disable-next-line no-undef
        GM_setValue(AKTUALNI_KLAN_ID, current_clan_id);

        pullMaxPopSpace(true);
    }

    updateMaxPopSpace();
}

function editClanStatsCss() {
    const styles = ".main-left-content { padding-top: 18px !important; }";
    addCss(styles);
}

function pullMaxPopSpace(refresh_pop_capacity = false) {
    // eslint-disable-next-line no-undef
    GM.xmlHttpRequest({
        method: "GET",
        url: "/klanstats.php",
        onload: function (response) {
            let parser = new DOMParser();
            let dom = parser.parseFromString(response.responseText, "text/html");

            let equip_item_table = dom.getElementsByClassName("equip-items-table");
            if (equip_item_table.length == 0) {
                return;
            }
            equip_item_table = equip_item_table[0];

            let pop_capacity_row = equip_item_table.rows[0];
            let pop_capacity_value = pop_capacity_row.children[1].innerText.replaceAll(",", "");

            // eslint-disable-next-line no-undef
            GM_setValue(CELKOVY_PROSTOR_PRO_BYDLENI, pop_capacity_value);

            if (refresh_pop_capacity) {
                updateMaxPopSpace();
            }
        },
    });
}

function updateMaxPopSpace() {
    // eslint-disable-next-line no-undef
    let max_pop_variant = parseInt(GM_getValue(VYBRANA_MOZNOST_ZOBRAZENI_POPULACE, 0));

    let clan_stats = document.getElementsByClassName("klan-stats");
    if (clan_stats == null) {
        return;
    }

    clan_stats = clan_stats[0];
    let people_row = clan_stats.children[1];
    let people_value_span = people_row.children[1];
    let people_value = parseInt(people_value_span.innerText.toLowerCase().replaceAll(" ", "").replace("k", "000").replace("m", "000000"));
    let used_big_numbers = people_value > 100000;

    let show_max_pop_capacity_values = [0, 3, 4];
    let show_percentage_of_used_capacity = [1, 3];
    let show_percentage_of_free_capacity = [2, 4];

    let max_pop = "";
    // eslint-disable-next-line no-undef
    let pop_capacity = GM_getValue(CELKOVY_PROSTOR_PRO_BYDLENI, 0);
    if (used_big_numbers) {
        pop_capacity = Math.round(pop_capacity / 1000) * 1000;
    }

    if (show_max_pop_capacity_values.includes(max_pop_variant)) {
        // eslint-disable-next-line no-undef
        let is_compact_mode_on = GM_getValue(POVOLIT_KOMPAKTNI_MOD_NA_PROSTOR, true);
        if (is_compact_mode_on) {
            max_pop += pop_capacity / 1000 + "k";
        } else {
            max_pop += (pop_capacity / 1000).toLocaleString("en").replaceAll(",", " ") + " K";
        }

        if (max_pop_variant == 3 || max_pop_variant == 4) {
            max_pop += ", ";
        }
    }

    let pop_density;
    if (pop_capacity == 0) {
        pop_density = 100;
    } else {
        pop_density = Math.round((people_value / pop_capacity) * 1000) / 10;
    }

    if (show_percentage_of_used_capacity.includes(max_pop_variant)) {
        max_pop += Math.round(pop_density * 100) / 100 + "%";
    } else if (show_percentage_of_free_capacity.includes(max_pop_variant)) {
        max_pop += Math.round((100 - pop_density) * 100) / 100 + "%";
    }

    let container = null;

    // eslint-disable-next-line no-undef
    if (GM_getValue(ZOBRAZIT_MAX_POP, false)) {
        container = document.getElementById("max_pop_row");
        let span = document.getElementById("max_pop_val");

        if (span == null) {
            span = document.createElement("span");
            span.id = "max_pop_val";
            span.classList.add("val");
            people_value_span.appendChild(span);

            let label = document.createElement("span");
            label.classList.add("key");
            label.textContent = "Prostor:";

            if (container == null) {
                container = document.createElement("p");
                container.id = "max_pop_row";
            }

            container.appendChild(label);
            container.appendChild(span);

            people_row.parentElement.insertBefore(container, people_row.nextElementSibling);
        }
        span.textContent = max_pop;
    }

    colorPop(pop_density, people_value_span, container);
}

function colorPop(pop_density, people_value_span, container) {
    // eslint-disable-next-line no-undef
    if (!GM_getValue(UPRAVIT_BARVU_POPULACE_DLE_ZALIDNENOSTI, true)) {
        return;
    }

    let color = "unset";
    if (pop_density >= 100) {
        color = "rgb(255, 0, 0)";
    } else if (pop_density > 95) {
        let other_colors = (128 / 5) * (100 - pop_density);
        color = "rgb(255, " + other_colors + ", " + other_colors + ")";
    } else if (pop_density < 80) {
        let other_colors;
        if (pop_density < 40) {
            other_colors = 0;
        } else {
            other_colors = (128 / 40) * (pop_density - 40);
        }

        // eslint-disable-next-line no-undef
        const colorblind_mode = GM_getValue(POVOLIT_BARVOSLEPY_MOD, false);

        if (colorblind_mode) {
            color = "rgb(" + other_colors + ", " + (other_colors + 120) + ", 255)";
        } else {
            color = "rgb(" + other_colors + ", 255, " + other_colors + ")";
        }
    }

    people_value_span.parentElement.style.color = color;
    if (container) {
        container.style.color = color;
    }
}

// MENU (VAT)

function addVatModificationToMenu(left_menu, index) {
    let li = document.createElement("li");
    li.innerText = "Daně:";
    left_menu.insertBefore(li, left_menu.children[index++]);
    let vat_li = li;

    li = document.createElement("li");
    left_menu.insertBefore(li, left_menu.children[index++]);

    let anchor = createAnchor("<<", "Snížit daně");
    anchor.onclick = function () {
        changeValueAction("klanstats.php?dane=snizit", vat_li, "Daně (snížené):");
    };
    li.append(anchor);

    anchor = createAnchor(" --- ", "Normální daně");
    anchor.onclick = function () {
        changeValueAction("klanstats.php?dane=normal", vat_li, "Daně (normální):");
    };
    li.append(anchor);

    anchor = createAnchor(">>", "Zvýšit daně");
    anchor.onclick = function () {
        changeValueAction("klanstats.php?dane=zvysit", vat_li, "Daně (zvýšené):");
    };
    li.append(anchor);

    // separate Dane from other menu options
    li = document.createElement("li");
    li.classList.add("empty");
    left_menu.insertBefore(li, left_menu.children[index++]);

    return index;
}

// MENU (RECRUIT BUTTONS)

function addRecruitButtonsToMenu(left_menu, index) {
    let li = document.createElement("li");
    li.innerText = "Produkce jednotek:";
    left_menu.insertBefore(li, left_menu.children[index++]);
    let recruit_li = li;

    li = document.createElement("li");
    left_menu.insertBefore(li, left_menu.children[index++]);

    let anchor = createAnchor("Stop", "Zastavit rekrut");
    anchor.onclick = function () {
        changeValueAction("klanstats.php?produkce=stop", recruit_li, "Produkce jednotek (Zastavená):");
    };
    li.append(anchor);

    anchor = createAnchor("Start", "Povolit rekrut");
    anchor.onclick = function () {
        changeValueAction("klanstats.php?produkce=start", recruit_li, "Produkce jednotek (Povolená):");
    };
    li.append(anchor);

    // separate recruit from other menu options
    li = document.createElement("li");
    li.classList.add("empty");
    left_menu.insertBefore(li, left_menu.children[index++]);

    return index;
}

// MENU END

// Menu actions

function changeValueAction(url, vat_li, text) {
    httpGetAsync(url, valueChanged, {
        vat_li: vat_li,
        text: text,
    });
}

function valueChanged(xmlHttp, params) {
    params.vat_li.innerText = params.text;
}

// VAT END

// CONFIG

function addMenuRightButtons() {
    let elem;
    let target = document.getElementsByClassName("menu-right")[0];

    // eslint-disable-next-line no-undef
    if (GM_getValue(PRIDAT_ODKAZ_NA_SIMULATOR, true) == true) {
        elem = document.createElement("a");
        elem.href = SIMULATOR_URL;
        elem.addEventListener("click", copyArmy);
        elem.textContent = "Simulátor";
        elem.target = "_blank";
        elem.title = "Simulátor - dev verze";

        let index = target.children.length == 4 ? 1 : 0;
        target.insertBefore(elem, target.children[index]);
    }

    elem = document.createElement("a");
    elem.href = "javascript:void(0)";
    elem.addEventListener("click", renderSettings);
    elem.textContent = "Mód";
    elem.title = "Nastavení modifikací LoI";

    target.insertBefore(elem, target.children[0]);

    const width = target.children.length * 75;
    target.style = "width: " + width + "px; background-size: 100% 70px;";
}

function renderSettings() {
    if (configuration_showing == 2) {
        configuration_showing = 1;
        document.getElementById("mod_configuration").classList.add("hide");
        return;
    }
    if (configuration_showing == 1) {
        configuration_showing = 2;
        document.getElementById("mod_configuration").classList.remove("hide");
        return;
    }

    configuration_showing = 2;
    let div = document.createElement("div");
    div.id = "mod_configuration";

    let p = createParagraph('Změny se provedou po obnovení stránky. Po změnách v levém menu stiskněte "Obnovit"');
    div.append(p);

    div.append(document.createElement("br"));
    div.append(document.createElement("br"));

    createHeader3("Změny levého menu:", div);
    appendConfigurationInputToDiv(div, ZMENIT_MENU, "Povolit úpravy");
    appendConfigurationInputToDiv(div, PRIDAT_DANE, "Přidat změnu daní");
    appendConfigurationInputToDiv(div, PRIDAT_DOBYT_MESTO, "Přidat dobytí města do levého menu");
    appendConfigurationInputToDiv(div, PRIDAT_NASTAVENI_PRODUKCE, "Přidat nastavení produkce (povolení / zastavení rekrutování)");

    appendConfigurationInputToDiv(div, ZOBRAZIT_MAX_POP, "Zobrazit zalidněnost", false, false);

    // select na moznost vybrani zobrazeni max populace, bud jako %, celkove misto a nebo oboji
    let label = document.createElement("label");
    label.textContent = "Možnost zobrazení maximální populace";

    let select = document.createElement("select");
    select.id = VYBRANA_MOZNOST_ZOBRAZENI_POPULACE;

    select.addEventListener("change", () => {
        // eslint-disable-next-line no-undef
        GM_setValue(select.id, select.selectedOptions[0].value);
    });

    label.htmlFor = select.id;

    let optionsText = ["Prostor pro lidi", "% zabraného místa", "% volného místa", "Prostor pro lidi + % zabraného místa", "Prostor pro lidi + % volného místa"];

    let option;
    for (let i = 0; i < optionsText.length; i++) {
        option = document.createElement("option");
        option.value = i;
        option.text = optionsText[i];
        select.options.add(option);

        // eslint-disable-next-line no-undef
        if (GM_getValue(VYBRANA_MOZNOST_ZOBRAZENI_POPULACE, 0) == i) {
            option.selected = true;
        }
    }
    div.append(label);
    div.append(select);
    //

    appendConfigurationInputToDiv(div, UPRAVIT_BARVU_POPULACE_DLE_ZALIDNENOSTI, "Upravit barvu populace dle zalidněnosti (zelená = máme místo, červená = nemáme místo)");
    appendConfigurationInputToDiv(div, POVOLIT_BARVOSLEPY_MOD, "Barvoslepý mód (zelená => modrá)", false, false);
    appendConfigurationInputToDiv(div, POVOLIT_KOMPAKTNI_MOD_NA_PROSTOR, "Prostor pro lidi se vypíše bez mezer");
    div.append(document.createElement("br"));

    createHeader3("Chytré inputy:", div);
    createElement("i", "Použití x* pro násobení, k = násobení tisícem, m = násobení miliónem a ',.' pro desetinná čísla", div);
    appendConfigurationInputToDiv(div, PRIDAT_SMART_REKRUT, "U rekrutu");
    appendConfigurationInputToDiv(div, PRIDAT_SMART_MARKET, "Na tržišti");
    appendConfigurationInputToDiv(div, PRIDAT_SMART_BANK, "V ali pokladně.");
    appendConfigurationInputToDiv(div, PRIDAT_SMART_PORTAL, "U portálu (místo tlačítek 1-5-20...).");
    div.append(document.createElement("br"));

    createHeader3("Asynchroní funkce (běží na pozadí) :", div);
    appendConfigurationInputToDiv(div, PRIDAT_RYCHLE_UTOKY, "Povolit rychlé utoky u eventů");
    appendConfigurationInputToDiv(div, POUZIT_ASYNC_REKRUT, "Povolit u rekrutu - bez obnovení stránky");
    div.append(document.createElement("br"));

    createHeader3("Ostatní QoL úpravy :", div);
    appendConfigurationInputToDiv(div, ZOBRAZIT_ZTRATY_V_UTOKU, "Zobrazit přehled ztrát (a získaných jednotek) v normalních útocích.");
    appendConfigurationInputToDiv(div, PRIDAT_ODKAZ_NA_SIMULATOR, "Zobrazit odkaz na simulátor v horním menu");
    appendConfigurationInputToDiv(div, VYPNOUT_OBNOVOVANI_CHATU, "Vypnout automatické obnovování chatu.", false, false);
    appendConfigurationInputToDiv(div, VYPNOUT_PRODAVANI_RUN_ZA_MIN_CENY, "Vypnout prodávání run za min cenu (<1k / runa).", false, false);

    appendToOdtah(div);
}

function appendConfigurationInputToDiv(div, input_id, label_text, force_reload = false, default_value = true) {
    let input = document.createElement("input");
    input.id = input_id;
    input.type = "checkbox";
    input.style.verticalAlign = "middle";
    // eslint-disable-next-line no-undef
    input.checked = GM_getValue(input_id, default_value);
    input.addEventListener("change", () => {
        // eslint-disable-next-line no-undef
        GM_setValue(input.id, input.checked);
        if (force_reload) {
            location.reload();
        }
    });

    let label = document.createElement("label");
    label.htmlFor = input.id;
    label.innerText = label_text;
    label.style.marginLeft = "5px";

    let container = document.createElement("div");
    container.append(input);
    container.append(label);
    div.append(container);
}

// CONFIG END

// SETTINGS

function modifySettings() {
    let headers = document.getElementsByTagName("h3");
    if (headers.length == 0) {
        return;
    }

    // add refresh button
    let refresh_button = document.createElement("a");
    refresh_button.href = "javascript:void(0)";
    refresh_button.addEventListener("click", refreshClans);
    refresh_button.textContent = "Obnovit tahy";
    refresh_button.title = "Obnoví počet tahů u klanů";
    refresh_button.classList.add("button");

    headers[0].parentElement.insertBefore(refresh_button, headers[0].nextSibling);
}

function refreshClans() {
    let clan_id_elements = document.querySelectorAll("td.t-c");
    let active_clan_id_element = document.querySelector(".active td.t-c");
    active_clan_id = active_clan_id_element.innerText;

    let clan_ids = [];
    for (let i = 0; i < clan_id_elements.length; i++) {
        clan_ids.push(clan_id_elements[i].innerText);
    }

    // settings, refresh turns for all clans, set active the clan that was active
    refreshNextClan(null, clan_ids);
}

function refreshNextClan(xmlHttp, clan_ids) {
    if (clan_ids == null || clan_ids.length == 0) {
        if (active_clan_id != null) {
            httpGetAsync(REFRESH_CLAN_URL + active_clan_id, refreshMain, null);
            active_clan_id = null;
        } else {
            location.reload();
        }
        return;
    }

    let clan_id = clan_ids[0];
    clan_ids.shift();

    httpGetAsync(REFRESH_CLAN_URL + clan_id, refreshMain, clan_ids);
}

function refreshMain(xmlHttp, clan_ids) {
    httpGetAsync(REFRESH_MAIN, refreshNextClan, clan_ids);
}

//

// EQUIPMENT

function processEquipment() {
    const css = ".highlight { border: 3px groove gold !important; font-weight: unset; }";
    addCss(css);

    // units + selector to give them equipment
    let tables = document.getElementsByClassName("equip-items-table");

    if (tables.length < 2) {
        console.log("missing tables");
        return;
    }

    let unit_table = tables[1];
    let equipment_table = tables[0];

    if (document.forms[0] == null) {
        console.log("missing form");
        return;
    }

    let units_without_equipment_map = new Map();

    for (let i = 0; i < unit_table.rows.length; i++) {
        if (unit_table.rows[i].children[1].innerText == "žádné") {
            let row = unit_table.rows[i];
            units_without_equipment_map.set(row.children[0].innerText, row);
        }
    }

    let p = createParagraph("Na jednotky bez vybavení se může kliknout, aby se vybrala dole v selektoru.");
    unit_table.parentElement.append(p);

    let first_option_selected = false;
    let unit_select = document.forms[0].jednotka;

    for (let i = 0; i < unit_select.options.length; i++) {
        let option = unit_select.options[i];
        let relevant_row = units_without_equipment_map.get(option.innerText.trim());
        if (relevant_row == null) {
            option.classList.add("hide");
        } else {
            // select the first visible option
            if (first_option_selected == false) {
                option.selected = true;
                first_option_selected = true;
            }

            // add on click event to the table with units on the right to select relevant option
            relevant_row.addEventListener("click", function () {
                option.selected = true;
                unit_select.dispatchEvent(new Event("change"));
            });
            relevant_row.style.cursor = "pointer";
            pairElements(relevant_row, option, relevant_row.children[0].innerText);
        }
    }

    unit_select.addEventListener("change", function () {
        if (unit_select.selectedOptions[0].dataset.id == null) {
            return;
        }

        highlightRow(unit_select.selectedOptions[0].dataset.id);
    });

    // equipmnent, link equipment table to the item selector
    let equipment_select = document.forms[0].vybaveni;
    // skip table head
    for (let i = 1; i < equipment_table.rows.length; i++) {
        let option = equipment_select.options[i - 1]; // minus table head
        let row = equipment_table.rows[i];
        row.addEventListener("click", function () {
            option.selected = true;
            equipment_select.dispatchEvent(new Event("change"));
        });
        row.style.cursor = "pointer";
        pairElements(row, option, row.children[0].innerText);
    }

    equipment_select.addEventListener("change", function () {
        if (equipment_select.selectedOptions[0].dataset.id == null) {
            return;
        }

        highlightRow(equipment_select.selectedOptions[0].dataset.id);
    });

    // dispatch the events to force highlight on the selected options
    unit_select.dispatchEvent(new Event("change"));
    equipment_select.dispatchEvent(new Event("change"));

    p = createParagraph("Na vybavení se může kliknout, aby se vybralo dole v selektoru.");
    equipment_table.parentElement.append(p);
}

function highlightRow(id) {
    let element = document.getElementById(id);
    if (element == null) {
        return;
    }

    let highlighted_element = element.parentElement.querySelector(".highlight");
    if (highlighted_element != null) {
        highlighted_element.classList.remove("highlight");
    }

    element.classList.add("highlight");
}

function pairElements(element, option, id) {
    id = id.replaceAll(" ", "_");
    element.id = id;
    option.dataset.id = id;
}

// EQUIPMENT END

// SIMULATOR - PASTE ARMY

function copyArmy() {
    // eslint-disable-next-line no-undef
    GM_setValue(KOPIROVANI_KLAN_ARMADY, true);
    copyArmyToClipboard();
}

function pasteArmy() {
    // eslint-disable-next-line no-undef
    let copied_clan_army = GM_getValue(ZKOPIROVANA_KLAN_ARMADA, null);
    if (copied_clan_army == null) {
        return false;
    }

    let element = document.getElementById("ut");
    element.value = copied_clan_army;

    // eslint-disable-next-line no-undef
    GM_setValue(ZKOPIROVANA_KLAN_ARMADA, null);
    return true;
}

/**
 * Copying army from game - all credits to doon
 * @author doon
 */

const unitNameReplacements = {
    "Topázový Golem": "Topazový Golem",
    "Příklad neznámá jednotka": null,
};

// --------------------------------------------------------------------------------------

let unitName = function (text) {
    if (text.indexOf("velitel klanu") !== -1) {
        return "Velitel 1";
    }
    return text in unitNameReplacements ? unitNameReplacements[text] : text;
};

let unitCount = function (text) {
    // remove commas
    return text.replaceAll(/,/g, "");
};

let armyFromClanarmy = function (dom) {
    let army = [];
    let rows = dom.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; ++i) {
        let unit = unitName(rows[i].children[1].firstChild.textContent);
        if (!unit) {
            continue;
        }

        let count = unitCount(rows[i].children[2].textContent);
        let line = count + " x " + unit;

        // add item if unit has one
        let itemElem = rows[i].children[1].querySelector(".predmet");
        if (itemElem) {
            line += " (" + itemElem.textContent + ")";
        }

        army.push(line);
    }
    // return army.join("\n");
    return army.join("\n");
};

let getArmyHtml = function (callback) {
    // eslint-disable-next-line no-undef
    GM.xmlHttpRequest({
        method: "GET",
        url: "/clanarmy",
        onload: function (response) {
            let parser = new DOMParser();
            let dom = parser.parseFromString(response.responseText, "text/html");
            callback(dom);
        },
    });
};

let copyArmyToClipboard = function () {
    // let button = this;
    // button.className = "";
    let onSuccess = function (army) {
        // button.className = "new-msg";
        // GM.setClipboard(army);
        // eslint-disable-next-line no-undef
        GM_setValue(ZKOPIROVANA_KLAN_ARMADA, army); // TO SAVE ARMY TO GM VALUES INSTEAD OF CLIPBOARD!!!
    };

    // Main page - send XHR request to /clanarmy
    if (location.href.indexOf("/main.php") !== -1) {
        getArmyHtml((dom) => onSuccess(armyFromClanarmy(dom)));
    }
    // // Clan army page
    // else if (location.href.indexOf("/clanarmy") !== -1) {
    //     onSuccess(armyFromClanarmy(document));
    // }
    // // Spying page
    // else if (location.href.indexOf("/spying") !== -1) {
    //     onSuccess(armyFromSpying(document));
    // }
};

// end copying army from game

// SIMULATOR - PASTE ARMY END

// GENERAL FUNCTIONS

function createAnchor(text, title, parent = null) {
    let element = createElement("a", text, parent);
    element.style.marginLeft = "5px";
    element.href = "javascript:void(0)";
    if (title != null) {
        element.title = title;
    }
    return element;
}

function createHeader3(text, parent = null) {
    return createElement("h3", text, parent);
}

function createParagraph(text, parent = null) {
    return createElement("p", text, parent);
}

function createElement(tag_name, text, parent = null) {
    let element = document.createElement(tag_name);
    element.innerText = text;
    if (parent != null) {
        parent.append(element);
    }
    return element;
}

function handleForm(form, func, params) {
    let data = new FormData(form);
    let url_search_params = new URLSearchParams(data).toString();

    httpPostAsync(form.action, url_search_params, func, form, params);
}

function httpPostAsync(theUrl, url_search_params, callback, form, params) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let responseText = xmlHttp.responseText;
            let dom = new DOMParser().parseFromString(responseText, "text/html");
            callback(dom, form, params);
        }
    };
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(url_search_params);
}

function httpGetAsync(theUrl, callback, params) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (callback != null) {
                callback(xmlHttp, params);
            }
        }
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function modifySmartInput(input, func_pre = null) {
    input.type = "text";
    input.addEventListener("input", filterField);

    input.form.addEventListener("submit", () => {
        if (func_pre != null) {
            func_pre(input);
        }
        processFinalValueOfInput(input);
        if (Math.floor(parseInt(input.value)) == 0) {
            input.value = null;
            return;
        }
    });
}

function setPlaceholderAsValue(input) {
    if (input.value == 0) {
        input.value = input.placeholder;
    }
}

function addConfigBelowHeader(div, required_permission, checkbox_text, force_reload) {
    let h3_elements = document.getElementsByTagName("h3");
    if (h3_elements != null) {
        appendConfigurationInputToDiv(div, required_permission, checkbox_text, force_reload);
        h3_elements[0].parentElement.insertBefore(div, h3_elements[0].nextElementSibling);
    }
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

// GENERAL FUNCTIONS END