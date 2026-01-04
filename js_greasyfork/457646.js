// ==UserScript==
// @name         Webgame vylepšení
// @version      2025-11-25
// @description  Sbírka vylepšení pro hru Webgame
// @author       yS
// @match        *://*.webgame.cz/wg/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @namespace https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457646/Webgame%20vylep%C5%A1en%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/457646/Webgame%20vylep%C5%A1en%C3%AD.meta.js
// ==/UserScript==

// TODO:
// nastaveni zobrazeni pomeru ztrat prestize utocnika / obrance
// otestovat obyc listu
// archiv - ztraty nase / nepritele
// archiv - ztraty v $
// rozvedka - dohromady - nejlepsi cile pro operace
// v infu center zvyraznit hranice, senzory, protileteckou

// UFO - pridat kontrolu, zda prislo
// document.querySelector("[href='index.php?p=technologie&s=ufo']");
// pridat si do uloziste promenou - zeme + prislo ufo; jestli ufo prislo, upozornit na to. Pri zmene zeme provest kontrolu na prvno (checknout stranku index.php?p=technologie&s=ufo)

// stranka technologie - pridat sloupecek zbozi na trhu (cena + mnozstvi) - jako je tomu ve scriptu na svetaku - prodej - stranka techu; bud tady / do scriptu technologie / do scriptu svetak prodej

(function () {
    "use strict";

    // options
    const VALKY_OBRACENE = "valky_flipped";
    const ZOBRAZENE_ZOLDY = "zobrazene_zoldy";
    const MODIFY_ARCHIVE = "modify_archive";
    const MODIFY_ADVANCEMENTS = "modify_advancements";

    // menu options
    const ROZVOJ_MENU_LINK = "rozvoj";
    const GENERALS_MENU_LINK = "generalove";
    const PRODEJ_MENU_LINK = "prodej";
    const POKROKY_MENU_LINK = "pokroky";

    // budovy settings
    const COUNTRY_ALI_DATA = "country_ali_data";
    const COUNTRY_ALI_DATA_TIME_OFFSET_MILLIS = 24 * 60 * 60 * 1000;

    // rozvedka
    const SPY_SHOW_REPEAT_ACTIONS = "spy_show_repeat_actions";
    const SPY_SHOW_STATS = "spy_show_stats";
    const REPEAT_ROZVEDKA = "rozvedka_repeat";
    const MAX_OBTIZNOST_OPERACE = "rozvedka_difficulty";

    const INF_MODIFY_INFILTRATION = "inf_modify_infiltration";
    const INF_LAND_PERCENTAGE_HIGHLIGHT = "inf_land_prestige_highlight";
    const INF_TECH_PERCENTAGE_HIGHLIGHT = "inf_tech_prestige_highlight";
    const INF_MRTVA_PRES_PERCENTAGE_HIGHLIGHT = "inf_dead_prestige_highlight";
    const INF_STEAL_TECH_COUNT_HIGHLIGHT = "inf_steal_tech_highlight";

    // prices
    const ENERGY_PRICE = "energy";
    const FOOD_PRICE = "food";
    const TECHNOLOGY_PRICES = "tech_prices";

    // country stats
    const COUNTRY_STATS = "country_stats";

    // pokroky
    const ADV_SHOW_BASE_PRICE = "advancements_show_base_price";
    const ADV_SHOW_BASE_PRICE_IN_TOOLTIP = "advancements_show_base_price_tooltip";
    const ADV_SHOW_MIN_PRICE = "advancements_show_min_price";
    const ADV_SHOW_MIN_PRICE_IN_TOOLTIP = "advancements_show_min_price_tooltip";
    const ADV_SHOW_CURRENT_PRICE = "advancements_show_current_price";

    // aliance
    const ALI_ALLOW_CHANGES = "aliance_modify";
    const ALI_SHOW_CARDS = "aliance_show_cards";
    const ALI_SHOW_REGIME = "aliance_show_regime";
    const ALI_SHOW_ROCKETS = "aliance_show_rockets";
    const ALI_SHOW_WARS = "aliance_show_wars";
    const ALI_WARS_WITH_ANCHORS = "aliance_show_wars_with_anchors";
    const ALI_SHOW_FILTER = "aliance_show_filter";
    const ALI_SAVED_INFO = "aliance_saved_info";

    // strike
    const STRIKE_SHOW_EXP = "strike_show_exp";
    const STRIKE_WARNING_DISABLES_BUTTON = "strike_warning_disables_button";
    const STRIKE_SHOW_BUILD_BUTTON = "strike_show_build_button";
    const STRIKE_SHOW_GRANT_EXP_TO_GENERAL_BUTTON = "strike_show_grant_exp_to_general_button";
    const STRIKE_SHOW_BURN_LAND_BUTTON = "strike_show_burn_land_button";

    // technology
    const TECHNOLOGY_ALLOW_CHANGES = "technology_modify";

    const USED_SETTINGS = [
        ROZVOJ_MENU_LINK,
        GENERALS_MENU_LINK,
        PRODEJ_MENU_LINK,
        POKROKY_MENU_LINK,
        SPY_SHOW_REPEAT_ACTIONS,
        INF_MODIFY_INFILTRATION,
        SPY_SHOW_STATS,
        REPEAT_ROZVEDKA,
        MAX_OBTIZNOST_OPERACE,
        INF_LAND_PERCENTAGE_HIGHLIGHT,
        INF_TECH_PERCENTAGE_HIGHLIGHT,
        INF_MRTVA_PRES_PERCENTAGE_HIGHLIGHT,
        INF_STEAL_TECH_COUNT_HIGHLIGHT,
        VALKY_OBRACENE,
        ZOBRAZENE_ZOLDY,
        ENERGY_PRICE,
        FOOD_PRICE,
        COUNTRY_ALI_DATA,
        COUNTRY_STATS,
        TECHNOLOGY_PRICES,
        MODIFY_ARCHIVE,
        MODIFY_ADVANCEMENTS,
        ADV_SHOW_BASE_PRICE,
        ADV_SHOW_BASE_PRICE_IN_TOOLTIP,
        ADV_SHOW_MIN_PRICE,
        ADV_SHOW_MIN_PRICE_IN_TOOLTIP,
        ADV_SHOW_CURRENT_PRICE,
        ALI_ALLOW_CHANGES,
        ALI_SHOW_CARDS,
        ALI_SHOW_REGIME,
        ALI_SHOW_ROCKETS,
        ALI_SHOW_WARS,
        ALI_WARS_WITH_ANCHORS,
        ALI_SHOW_FILTER,
        ALI_SAVED_INFO,
        STRIKE_SHOW_EXP,
        STRIKE_WARNING_DISABLES_BUTTON,
        STRIKE_SHOW_BUILD_BUTTON,
        STRIKE_SHOW_GRANT_EXP_TO_GENERAL_BUTTON,
        STRIKE_SHOW_BURN_LAND_BUTTON,
        TECHNOLOGY_ALLOW_CHANGES,
    ];

    function execute() {
        const modified_pages_data = [
            {
                url: "p=zebricek&s=aliazebr",
                script: modifyAliZebricek,
            },
            {
                url: "s=detailyaliance",
                script: modifyDetailyAli,
            },
            {
                url: "p=konflikty&s=awarstat&getali=",
                script: modifyValky,
            },
            {
                url: "s=ppravidla",
                script: modifyPravidlaValky,
            },
            {
                url: "p=dotace&s=ehelp",
                script: modifyHospoPage,
            },
            {
                url: "s=detailyprestiz",
                script: processPrestigeDetails,
            },
            {
                url: "p=archiv",
                script: modifyArchive,
            },
            {
                url: "p=technologie&s=pokroky",
                script: modifyAdvancements,
            },
            {
                url: "p=technologie",
                script: modifyTechnologyPage,
            },
            {
                url: "p=valka",
                script: modifyValka,
            },
            {
                url: "p=zebricek&s=stats",
                script: modifyStatisticsPage,
            },
            {
                url: "p=detaily",
                script: processCountryDetail,
            },
            {
                url: "p=rozvedka",
                script: modifyRozvedka,
            },
        ];

        deleteUnusedSettings();

        createMenuItemSettings();
        addMenuLinks();
        modifyLista();

        modified_pages_data.forEach(({ url, script }) => {
            if (window.location.href.includes(url)) {
                script();
            }
        });
    }

    let log;
    setLogger(console.log);

    function setLogger(logger) {
        // eslint-disable-next-line no-undef
        log = logger.bind(console, `[${GM_info.script.name}]`);
    }

    function setSetting(setting_name, value) {
        // eslint-disable-next-line no-undef
        GM_setValue(setting_name, value);
    }

    function getSetting(setting_name, default_value) {
        // eslint-disable-next-line no-undef
        return GM_getValue(setting_name, default_value);
    }

    async function deleteUnusedSettings() {
        // eslint-disable-next-line no-undef
        const keys = await GM_listValues();

        keys.forEach((key) => {
            if (!USED_SETTINGS.includes(key)) {
                // eslint-disable-next-line no-undef
                GM_deleteValue(key);
            }
        });
    }

    function createMenuItemSettings() {
        const menu = document.getElementById("left_menu");
        const list = menu.children[0];

        let li = createElement("li");
        list.appendChild(li);

        let ul = createElement("ul");
        li.appendChild(ul);

        li = createElement("li");
        ul.appendChild(li);

        const settings_button = createElement("a", { textContent: "Modifikace ⚙️" });
        settings_button.addEventListener("click", function () {
            let element = document.getElementById("settings_container");
            element.classList.toggle("hidden");
        });

        li.appendChild(settings_button);

        createSettingsWindow();
    }

    function createElement(tag = "div", props = null) {
        let element = document.createElement(tag);

        for (const key in props) {
            if (!Object.hasOwnProperty.call(props, key)) {
                continue;
            }

            const value = props[key];
            element[key] = value;
        }

        return element;
    }

    function createButton(text, func = null, params = null, props = {}) {
        if (props === null) props = {};
        props.textContent = text;
        props.type = "button";
        const class_name = props.className ? props.className + " " : "";
        props.className = class_name + "submit btn";
        let button = createElement("button", props);
        button.addEventListener("click", (e) => {
            if (func !== null) {
                func(params, e);
            }
        });
        return button;
    }

    function addDoubleClickProtection(button) {
        button.addEventListener("click", () => {
            button.disabled = true;

            setTimeout(() => {
                button.disabled = false;
            }, 1000);
        });
    }

    function createSettingsWindow() {
        CssHelper.addSavedCss(CssHelper.styles.settings);

        const content = document.getElementById("content");
        const container = createElement("div", { id: "settings_container", className: "hidden" });
        content.appendChild(container);

        const overlay = createElement("div", { className: "overlay" });
        container.appendChild(overlay);

        const div = createElement("div", { id: "settings_window", className: "settings_window" });
        container.appendChild(div);

        const toggle_container = function () {
            container.classList.toggle("hidden");
        };

        overlay.addEventListener("click", toggle_container);

        let button = createButton("x", toggle_container, null, { className: "btn-close" });
        div.appendChild(button);

        let settings = [
            {
                menu_link_header: { label: "Zobrazit v menu odkazy na:", header: true },
                rozvoj_menu_link: { setting_name: ROZVOJ_MENU_LINK, label: "Rozvoj", default_value: true },
                generalove_menu_link: { setting_name: GENERALS_MENU_LINK, label: "Generály", default_value: true },
                prodej_menu_link: { setting_name: PRODEJ_MENU_LINK, label: "Prodej", default_value: true },
                pokroky_menu_link: { setting_name: POKROKY_MENU_LINK, label: "Pokroky", default_value: true },
            },
            {
                pokroky_header: { label: "Pokroky:", header: true },
                pokroky_changes: { setting_name: MODIFY_ADVANCEMENTS, label: "Povolit změny", default_value: true },
                min_price: { setting_name: ADV_SHOW_MIN_PRICE, label: "Povolit zobrazení minimální ceny", default_value: true },
                min_price_tooltip: { setting_name: ADV_SHOW_MIN_PRICE_IN_TOOLTIP, label: "Zobrazit minimální cenu v tooltipu", default_value: false },
                base_price: { setting_name: ADV_SHOW_BASE_PRICE, label: "Povolit zobrazení základní ceny", default_value: true },
                base_price_tooltip: { setting_name: ADV_SHOW_BASE_PRICE_IN_TOOLTIP, label: "Zobrazit základní cenu v tooltipu", default_value: true },
                current_price: { setting_name: ADV_SHOW_CURRENT_PRICE, label: "Zobrazit aktuální cenu", default_value: true },
            },
            {
                spy_header: { label: "Rozvědka:", header: true },
                spy_show_repeat_action: { setting_name: SPY_SHOW_REPEAT_ACTIONS, label: "Zobrazit menu opakování operací", default_value: true },
                spy_show_stats: { setting_name: SPY_SHOW_STATS, label: "Zobrazit statistiky rozvědky", default_value: true },
            },
            {
                strike_header: { label: "Útok:", header: true },
                strike_exp: { setting_name: STRIKE_SHOW_EXP, label: "Zobrazit zkušenosti za kolo", default_value: true },
                strike_button: { setting_name: STRIKE_WARNING_DISABLES_BUTTON, label: "Potvrzení útoku při porušení pravidel", default_value: true },
                strike_stavebka_button: { setting_name: STRIKE_SHOW_BUILD_BUTTON, label: "Dopříprava - možnost postavit stavebku", default_value: true },
                strike_dotace_button: { setting_name: STRIKE_SHOW_GRANT_EXP_TO_GENERAL_BUTTON, label: "Dopříprava - možnost dotace generála", default_value: true },
                strike_burn_land_button: { setting_name: STRIKE_SHOW_BURN_LAND_BUTTON, label: "Dopříprava - možnost spálení hlíny", default_value: false },
            },
            {
                archive_header: { label: "Archiv:", header: true },
                archive_changes: { setting_name: MODIFY_ARCHIVE, label: "Povolit změny", default_value: true },
            },
            {
                inf_header: { label: "Infiltrace:", header: true },
                inf_modify_infiltrations: { setting_name: INF_MODIFY_INFILTRATION, label: "Povolit úpravy", default_value: true },
                inf_land_highlight: {
                    setting_name: INF_LAND_PERCENTAGE_HIGHLIGHT,
                    label: "Zvýraznit území, když je přes x %",
                    default_value: 20,
                    props: { type: "number", min: 0, max: 100, step: 1 },
                },
                inf_tech_hightlight: {
                    setting_name: INF_TECH_PERCENTAGE_HIGHLIGHT,
                    label: "Zvýraznit technologie, když je jich přes x %",
                    default_value: 30,
                    props: { type: "number", min: 0, max: 100, step: 1 },
                },
                inf_dead_pres_highlight: {
                    setting_name: INF_MRTVA_PRES_PERCENTAGE_HIGHLIGHT,
                    label: "Zvýraznit mrtvou prestiž, když jí je přes x %",
                    default_value: 10,
                    props: { type: "number", min: 0, max: 100, step: 1 },
                },
                inf_steal_tech_highlight: {
                    setting_name: INF_STEAL_TECH_COUNT_HIGHLIGHT,
                    label: "Zvýraznit krádež technologií, když je přes počet",
                    default_value: 1000,
                    props: { type: "number", min: 0, step: 10 },
                },
            },
            {
                ali_header: { label: "Žebříček aliancí:", header: true },
                ali_changes: { setting_name: ALI_ALLOW_CHANGES, label: "Povolit změny", default_value: true },
                ali_show_cards: { setting_name: ALI_SHOW_CARDS, label: "Zobrazit sloupec kartiček", default_value: true },
                ali_show_regime: { setting_name: ALI_SHOW_REGIME, label: "Zobrazit sloupec zřízení", default_value: true },
                ali_show_rockets: { setting_name: ALI_SHOW_ROCKETS, label: "Zobrazit sloupec rakety", default_value: true },
                ali_show_wars: { setting_name: ALI_SHOW_WARS, label: "Zobrazit sloupec válek", default_value: true },
                ali_show_wars_with_anchors: { setting_name: ALI_WARS_WITH_ANCHORS, label: "Sloupec válek obsahuje i kotvy", default_value: true },
                ali_show_filter: { setting_name: ALI_SHOW_FILTER, label: "Zobrazit filtr", default_value: true },
            },
            {
                others_header: { label: "Jiné:", header: true },
                technology_page: { setting_name: TECHNOLOGY_ALLOW_CHANGES, label: "Povolit změny na stránce Technologií", default_value: true },
                zobrazene_zoldy: { setting_name: ZOBRAZENE_ZOLDY, label: "Zobrazit výdaje armády v detailu země", default_value: true },
                valky_obracene: { setting_name: VALKY_OBRACENE, label: "Války - poměr prestiží na začátku: vyhlašující ali / cílová", default_value: true },
            },
        ];

        for (let index = 0; index < settings.length; index++) {
            const block = settings[index];
            const container = createElement("div", { className: "block" });
            div.appendChild(container);

            for (const key in block) {
                const setting = block[key];

                if (setting.header) {
                    const h3 = createElement("h3", { textContent: setting.label });
                    container.appendChild(h3);
                } else {
                    const config = createConfig(setting.setting_name, setting.label, false, setting.default_value, setting.props ? setting.props : {});
                    container.appendChild(config);
                }
            }
        }

        button = createButton(
            "Refresh stránky",
            () => {
                refreshPage();
            },
            null,
            { className: "btn-refresh" }
        );
        div.appendChild(button);
    }

    function wrapInTooltip(element) {
        element.classList.add("tooltiptext");
        element.parentElement.classList.add("tooltip");
    }

    function createConfig(setting_name, label_text, force_reload = false, default_value = true, props) {
        let label = createElement("label");
        const value = getSetting(setting_name, default_value);

        if (props.type === undefined) {
            props.type = "checkbox";
            props.checked = value;
        } else {
            props.value = value;
        }

        let input = createElement("input", props);
        label.appendChild(input);
        label.appendChild(document.createTextNode(label_text));

        input.addEventListener("change", function () {
            if (input.type === "checkbox") {
                setSetting(setting_name, input.checked);
            } else {
                input.value = Number(input.value);
                if (input.max && input.value > Number(input.max)) input.value = Number(input.max);
                if (input.min && input.value < Number(input.min)) input.value = Number(input.min);

                setSetting(setting_name, input.value);
            }
            if (force_reload) {
                refreshPage();
            }
        });
        return label;
    }

    function addMenuLinks() {
        let vlada_menu_index = 4;
        let play_menu_index = 5;

        addButtonIfToggled(ROZVOJ_MENU_LINK, "Rozvoj", "index.php?p=vlada&s=rozvoj", vlada_menu_index, 1);
        addButtonIfToggled(GENERALS_MENU_LINK, "Generálové", "index.php?p=valka&s=general", play_menu_index, 6);
        addButtonIfToggled(PRODEJ_MENU_LINK, "Prodej", "index.php?p=svetovy_trh&s=trhposlat", play_menu_index, 4);
        addButtonIfToggled(POKROKY_MENU_LINK, "Pokroky", "index.php?p=technologie&s=pokroky", play_menu_index, 3);
    }

    function addButtonIfToggled(value_key, button_text, link, menu_index, submenu_index) {
        if (!getSetting(value_key, true)) {
            return;
        }

        let menu = document.getElementById("left_menu");
        menu = menu.children[0];
        addButton(button_text, link, menu, menu_index, submenu_index);
    }

    function addButton(button_text, link, menu, menu_index, submenu_index) {
        let relevant_menu = menu.children[menu_index].children[0];

        let element = createElement("a", { href: link, textContent: button_text });

        let li = createElement("li");
        li.append(element);

        relevant_menu.insertBefore(li, relevant_menu.children[submenu_index]);
    }
    // DETAILY ALI

    function modifyDetailyAli() {
        let table = document.getElementsByClassName("vis_tbl");
        if (table == null) {
            return;
        }

        table = table[0];
        let exp_object = calculateExp(table);

        let container_element = document.getElementsByClassName("container");
        let content_element = container_element[0].children[0];
        let div = createElement("div", {
            style: "width: 250px; background: #222222; border: 2px solid; border-bottom-color: #000; border-right-color: #000; border-left-color: #555; border-top-color: #555; padding: 3px; margin-left: calc(50% - 125px); text-align: center;",
        });

        let p = createElement("p", { textContent: "Aktualní ali hodnost: " + exp_object.current_ali_level });
        div.append(p);

        p = createElement("p", { textContent: "Celkový počet zkušeností ali: " + exp_object.total_exp + "k" });
        div.append(p);

        p = createElement("p", { textContent: "Chybějící počet zkušeností ali: " + exp_object.missing_exp + "k" });
        div.append(p);

        content_element.insertBefore(div, content_element.children[1]);
    }

    function calculateExp(table) {
        const EXPERIENCE_PER_LEVEL = [10000, 20000, 40000, 80000, 150000, 250000, 400000, 600000, 850000, 1150000, 1500000, 1950000, 2450000];

        let rows = table.getElementsByTagName("tr");
        let exp_total_row = rows[17];
        let exp_total_columns = exp_total_row.getElementsByTagName("td");

        let total_exp = 0;
        let row_count = exp_total_columns.length;
        let member_count = row_count - 1;

        for (let i = 1; i < row_count; i++) {
            total_exp = total_exp + parseInt(exp_total_columns[i].innerHTML) * 1000;
        }

        for (let i = 0; i < EXPERIENCE_PER_LEVEL.length; i++) {
            if (EXPERIENCE_PER_LEVEL[i] * member_count < total_exp) {
                continue;
            }
            let missing_exp = EXPERIENCE_PER_LEVEL[i] * member_count - total_exp;

            let exp_object = {
                missing_exp: missing_exp / 1000,
                total_exp: total_exp / 1000,
                current_ali_level: i + 1,
            };
            return exp_object;
        }
    }

    // DETAILY ALI KONEC

    // HOSPO, MAX PRESTIZ PRESTIZ
    function modifyHospoPage() {
        const table = document.forms[0].children[0];
        if (table == null) return false;

        const row = table.insertRow(table.rows.length - 1);
        row.insertCell().textContent = "Prestiž";

        let total_prestige = 0;
        let prestige_per_unit = [0, 0, 0, 0.002, 0.02, 0.02, 1, 5, 3.5, 3.5, 2.7];
        for (let i = 3; i < table.rows.length - 2; i++) {
            const cell = table.rows[i].cells[1];
            total_prestige += parseFloat(Number(cell.textContent) * prestige_per_unit[i]);

            const input = table.rows[i].cells[2].children[0];
            input.dataset.prestige = prestige_per_unit[i];
            input.addEventListener("keyup", processHospaPrestige);
        }
        row.insertCell().textContent = parseInt(total_prestige * 10) / 10;
        const cell = row.insertCell();
        cell.textContent = 0;
        cell.id = "sent_prestige";
    }

    function processHospaPrestige() {
        const result_cell = document.getElementById("sent_prestige");

        let total_prestige = 0;
        const table = document.forms[0].children[0];

        for (let i = 3; i < table.rows.length - 2; i++) {
            const max_value = Number(table.rows[i].cells[1].textContent);

            const cell = table.rows[i].cells[2];
            const input = cell.children[0];

            let value = input.value;
            if (value <= 0) {
                continue;
            }
            value = value > max_value ? max_value : value;

            const prestige_per_unit = parseFloat(input.dataset.prestige);

            total_prestige += value * prestige_per_unit;
        }

        result_cell.textContent = total_prestige.toFixed(1);
    }
    // HOSPO KONEC

    // PRAVIDLA VALEK
    function modifyPravidlaValky() {
        const table = document.forms[0].elements[1].closest("table");

        if (table == null) {
            return;
        }

        let button;
        let elements = getElementsInTheWarForm(1);

        button = createButton("Reset", resetWar, elements);
        table.parentElement.insertBefore(button, table.nextSibling);

        button = createButton("Přepnout", toggleUtoky, elements);
        addDoubleClickProtection(button);
        table.parentElement.insertBefore(button, table.nextSibling);

        button = createButton("Farmy (10)", warFarmyUtoky, elements);
        table.parentElement.insertBefore(button, table.nextSibling);

        button = createButton("Farmy", setWarAgainstFarms, elements);
        table.parentElement.insertBefore(button, table.nextSibling);

        button = createButton("Klasika", setWarClassic, elements);
        table.parentElement.insertBefore(button, table.nextSibling);
    }

    function toggleUtoky(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].value = 1 - elements[i].value;
            elements[i].checked = !elements[i].checked;
        }
    }

    function setUtoky(elements, values) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].value = values[i] == true ? 1 : 0;
            elements[i].checked = values[i];
        }
    }

    function setTextInputy(elements, values) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].value = values[i];
        }
    }

    function warFarmyUtoky(elements) {
        setWarAgainstFarms(elements);

        let text_input_elements = getElementsInTheWarForm(1, "text");
        setTextInputy(text_input_elements, [0, 0, 10]);
    }

    function setWarAgainstFarms(elements) {
        let values = [
            false,
            false,
            true, // normaly jen lupy
            true,
            true,
            true,
            false,
            true,
            true, // taktika mimo bombeni
            true,
            false,
            false,
            false,
            true,
            false,
            true,
            true,
            false,
            false,
            false, // sabotaz jen epky, bourani, demoralizace, sabotaz
            true,
            true,
            true,
            true,
            true, // kradez rozvedkou = ok
            true,
            false,
            false,
            false, // jen konve
        ];

        setUtoky(elements, values);
    }

    function setWarClassic(elements) {
        let values = [
            true,
            false,
            true, // normaly jen lupy
            true,
            true,
            true,
            false,
            true,
            true, // taktika mimo bombeni
            true,
            false,
            false,
            false,
            true,
            false,
            true,
            true,
            false,
            false,
            false, // sabotaz jen epky, bourani, demoralizace, sabotaz
            true,
            true,
            true,
            true,
            true, // kradez rozvedkou = ok
            true,
            false,
            false,
            false, // jen konve
        ];

        setUtoky(elements, values);
    }

    function resetWar(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].value = 1;
            elements[i].checked = true;
        }
    }

    function getElementsInTheWarForm(nth, type = "checkbox") {
        return document.querySelectorAll("form>div:nth-of-type(" + nth + ") input[type=" + type + "]");
    }

    // PRAVIDLA VALEK KONEC

    // ROZVEDKA

    function repeatAction(difficulties) {
        const repeat_action = getSetting(REPEAT_ROZVEDKA, 0);
        if (repeat_action == 0) {
            // log("opky se uz nemaji opakovat => konec");
            return;
        }

        // ziskat obtiznost z opky
        let content = document.getElementById("icontent");
        if (content == null) return;

        let message_start = content.innerHTML.indexOf("<br><br><br>");
        if (message_start == -1) return;

        let message = content.innerHTML.slice(message_start + 12);
        message = message.slice(0, message.indexOf("<"));

        if (message.indexOf("infiltrovali") != -1) {
            // log("infiltrace úspěšná => konec.");
            setSetting(REPEAT_ROZVEDKA, 0);
            return;
        }

        let difficulty_text = content.querySelector("b");
        if (difficulty_text == null) {
            // log("tucny text nenalezen => konec");
            setSetting(REPEAT_ROZVEDKA, 0);
            return;
        }
        difficulty_text = difficulty_text.innerText;
        let obtiznost = difficulties.indexOf(difficulty_text);
        if (obtiznost == -1) {
            // log("Obtížnost [" + difficulty_text + "] nebyla nalezena => konec");
            setSetting(REPEAT_ROZVEDKA, 0);
            return;
        }

        const max_operation_difficulty = getSetting(MAX_OBTIZNOST_OPERACE, 0);
        if (obtiznost > max_operation_difficulty) {
            // log("Obtížnost je moc vysoka => konec");
            setSetting(REPEAT_ROZVEDKA, 0);
            return;
        }
        setSetting(REPEAT_ROZVEDKA, repeat_action - 1);

        // log("reload page");
        location.reload();
    }

    let technology_prices = (function () {
        let prices = null;

        function fetchTechnologyPrices() {
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
                            // reject("Není přístup na světový trh");
                            return;
                        }

                        let technologie_prices = [];

                        let price_cells = doc.forms[0].children[0].querySelectorAll(".mactprice");

                        price_cells.forEach((price_cell) => {
                            const value = Number(price_cell.innerHTML.split("<")[0].replace(/\s/g, ""));

                            technologie_prices.push(value);
                        });

                        resolve(technologie_prices);
                    } else {
                        // reject("Soubor nenalezen");
                    }
                };
                req.send();
            });
        }

        return {
            async get() {
                if (prices) return prices;

                let technology_prices_data = getSetting(TECHNOLOGY_PRICES, null);
                let time_in_millis = getCurrentTimeInMillis();
                const hour_in_millis = 60 * 60 * 1000;

                if (!technology_prices_data || technology_prices_data.updated_at == undefined || technology_prices_data.updated_at + hour_in_millis < time_in_millis) {
                    let technology_prices = await fetchTechnologyPrices();
                    technology_prices_data.prices = technology_prices;

                    setSetting(TECHNOLOGY_PRICES, {
                        updated_at: time_in_millis,
                        prices: technology_prices,
                    });
                }
                prices = technology_prices_data.prices;

                return prices;
            },
        };
    })();

    async function modifyRozvedka() {
        const DATA_SEPARATOR = "\n";

        handleMainSpyPage();
        if (getSetting(INF_MODIFY_INFILTRATION, true)) {
            processInfiltrationPage();
        }

        function handleMainSpyPage() {
            if (document.forms.tajsluzba === undefined) return;

            const header_elements = document.getElementsByTagName("h1");
            if (header_elements.length == 0 || header_elements[0].innerText != "Rozvědka") {
                return;
            }

            const submit_elements = document.getElementsByClassName("submit");
            const list_elements = document.getElementsByClassName("tbl_sim");

            if (submit_elements.length == 0 || list_elements.length == 0) {
                return;
            }

            const submit_element = submit_elements[0];
            const list_element = list_elements[0];

            if (getSetting(SPY_SHOW_REPEAT_ACTIONS)) {
                addRepeatAction(submit_element, list_element);
            }
            if (getSetting(SPY_SHOW_STATS, true)) {
                addSpyStats(list_element);
            }
        }

        function addRepeatAction(submit_element, list_element) {
            const difficulties = ["snadná jak facka", "jednoduchá", "středně náročná", "velice náročná", "extrémně náročná", "téměř neproveditelná"];

            repeatAction(difficulties);

            const max_operation_element = document.querySelector("#icontent > p > strong"),
                inputs = [];

            let max_operation_count = parseInt(max_operation_element.innerText);
            if (isNaN(max_operation_count) == true) {
                max_operation_count = 15;
            }

            let li_index = 2,
                li,
                input;

            // kolikrat opakovat opku
            li = createElement("li", { textContent: "Opakovat operaci: " });

            input = createNumberInput("repeat_operation", 5, 1, max_operation_count);
            li.append(input);
            inputs[0] = input;

            list_element.insertBefore(li, list_element.children[li_index++]);
            //

            // do jake obtiznosti
            li = createElement("li", { textContent: "Maximální obtížnost operace: " });

            input = createElement("select");
            li.append(input);

            for (let i = 0; i < difficulties.length; i++) {
                input.append(createElement("option", { value: i, textContent: difficulties[i] }));
            }
            input.options[2].selected = true;

            inputs[1] = input;

            list_element.insertBefore(li, list_element.children[li_index++]);
            //

            // brute force button
            const button = createButton("Opakuj operaci");
            button.params = inputs;

            button.addEventListener("click", (e) => {
                setSetting(REPEAT_ROZVEDKA, e.currentTarget.params[0].value - 1);
                setSetting(MAX_OBTIZNOST_OPERACE, e.currentTarget.params[1].selectedIndex);

                const submit_elements = document.getElementsByClassName("submit");
                const list_elements = document.getElementsByClassName("tbl_sim");
                if (submit_elements.length == 0 || list_elements.length == 0) {
                    return true;
                }

                const submit_element = submit_elements[0];
                submit_element.click();
            });
            submit_element.parentElement.append(button);
        }

        function addSpyStats(list_element) {
            const stat_elements = wrapCountrySpyStatsAroundElement(list_element);
            list_element.style.height = "fit-content";
            list_element.style.marginBottom = "0";
            list_element.style.marginTop = "auto";

            stat_elements[0].style.marginTop = "14px";
        }

        function processInfiltrationPage() {
            if (location.href.indexOf("s=viewspye") === -1) {
                return;
            }

            const table_summary = document.getElementById("spy-message-summary");
            const info_type = getInfiltrationType(table_summary);
            if (info_type == null) {
                return;
            }

            CssHelper.addSavedCss(CssHelper.styles.infiltration);
            const table_detail = document.getElementById("spy-message-detail");

            const country = getCountryData(table_detail.rows[1], table_summary);
            addColumnInformation(table_detail, info_type, country);
            if (info_type !== 0) {
                return;
            }

            // vlada
            const row = table_detail.rows[1];
            const labels_column = row.cells[0];
            const values_column = row.cells[1];

            addValueToTable(labels_column, values_column);
            addValueToTable(labels_column, values_column);

            let added_values = addValueToTable(labels_column, values_column, "Armáda");
            added_values.label.style = "font-weight: bold";

            const army_strength = getArmyStrength(country);
            addValueToTable(labels_column, values_column, "U základ", formatNumber(army_strength.attack_sum));
            addValueToTable(labels_column, values_column, country.people_defense > 0 ? "O základ (včetně lidí)" : "O základ", formatNumber((army_strength.defense_sum + country.people_defense).toFixed(0)));
            if (country.people_defense > 0) addValueToTable(labels_column, values_column, "Minimum za obyvatele", formatNumber(country.people_defense.toFixed(0)));
        }

        function formatPercentage(percentage) {
            return formatNumber(percentage.toFixed(1)) + "%";
        }

        function getInfiltrationType(table_summary) {
            const text = table_summary.querySelector(".r").textContent;

            if (text.indexOf("infiltrovat vládu") !== -1) {
                return 0;
            }

            if (text.indexOf("infiltrovat generální štáb") !== -1) {
                return 1;
            }

            return null;
        }

        function getPrestige(table_summary) {
            const matches = table_summary.rows[0].cells[1].innerHTML.match(/(?<=<br>)(\d){5,}(?=<br>)/g);
            if (matches.length === 0) return null;
            return Number(matches[0]);
        }

        function addColumnInformation(table, info_type, country) {
            const header_row = table.rows[0],
                data_row = table.rows[1];
            header_row.appendChild(createElement("th", { textContent: "Přehled", colSpan: 2 }));

            let added_column = {
                labels: createElement("td", { className: "rname l" }),
                values: createElement("td", { className: "rdata r" }),
            };
            data_row.appendChild(added_column.labels);
            data_row.appendChild(added_column.values);

            // ARMADA ZACATEK
            let army_prestige = 0;
            for (const key in country.units) {
                army_prestige += country.units[key].total_prestige;
            }

            addValueToTable(added_column.labels, added_column.values, "Armáda prestiž", formatNumber(Math.round(army_prestige)));
            addValueToTable(added_column.labels, added_column.values, "Podíl prestiže", formatPercentage((army_prestige / country.prestige) * 100), true);
            // ARMADA KONEC

            // MECHY % ZACATEK
            const mech_percent = (country.units.mechy.total_prestige / army_prestige) * 100;
            addValueToTable(added_column.labels, added_column.values, "Mechy %", formatPercentage(mech_percent), true);
            // MECHY % KONEC

            if (info_type == 0) {
                let elements;
                const land_prestige = getLandPrestige(country);

                addValueToTable(added_column.labels, added_column.values, "Území", formatNumber(land_prestige));
                let percent = (land_prestige / country.prestige) * 100;
                elements = addValueToTable(added_column.labels, added_column.values, "Procent", formatPercentage(percent), true);
                if (percent > getSetting(INF_LAND_PERCENTAGE_HIGHLIGHT, 20)) elements.value.style.color = "lime";

                const techy_data = processTechy(data_row, country.prestige);
                addValueToTable(added_column.labels, added_column.values, "Technologie", formatNumber(techy_data.count));
                percent = (techy_data.count / country.prestige) * 100;
                elements = addValueToTable(added_column.labels, added_column.values, "Procent", formatPercentage(percent), true);
                if (percent > getSetting(INF_TECH_PERCENTAGE_HIGHLIGHT, 30)) elements.value.style.color = "lime";

                // MRTVA PRESTIZ ZACATEK
                const mrtva_prestiz = country.prestige - army_prestige - land_prestige - techy_data.count;
                addValueToTable(added_column.labels, added_column.values, "Mrtvá prestiž", formatNumber(Math.round(mrtva_prestiz)));
                percent = (mrtva_prestiz / country.prestige) * 100;
                elements = addValueToTable(added_column.labels, added_column.values, "Procent", formatPercentage(percent), true);
                if (percent > getSetting(INF_MRTVA_PRES_PERCENTAGE_HIGHLIGHT, 10)) elements.value.style.color = "lime";

                const rozvedka_prestiz = ((country.land + 2000) / 4) * 15;
                addValueToTable(added_column.labels, added_column.values, "Na R kartičku", formatNumber(Math.round(rozvedka_prestiz)), true);
                // MRTVA PRESTIZ KONEC

                // KRADEZ TECHU ZACATEK
                CssHelper.addTooltipCss(200);
                elements = addValueToTable(added_column.labels, added_column.values, "Techy krádež", formatNumber(techy_data.steal_per_op), true);
                if (Number(techy_data.steal_per_op) > getSetting(INF_STEAL_TECH_COUNT_HIGHLIGHT, 1000)) elements.value.style.color = "lime";
                const tooltip = createElement();
                elements.value.appendChild(tooltip);
                wrapInTooltip(tooltip);
                createStolenTechnologiesInformation(tooltip, techy_data.technologies_stolen_per_type);
                // KRADEZ TECHU KONEC
            }
        }

        function createStolenTechnologiesInformation(tooltip, technologies_stolen_per_type) {
            const sorted_keys = Object.keys(technologies_stolen_per_type).sort(function (a, b) {
                return technologies_stolen_per_type[b] - technologies_stolen_per_type[a];
            });

            for (let index = 0; index < sorted_keys.length; index++) {
                const key = sorted_keys[index];

                const p = createElement("p", { className: "row" });
                tooltip.appendChild(p);

                p.appendChild(createElement("span", { textContent: key }));
                p.appendChild(createElement("span", { textContent: technologies_stolen_per_type[key] }));

                tooltip.appendChild(p);
            }
        }

        function getLandPrestige(country) {
            const land_prestige = country.land * 15;
            const buildings_prestige = (country.land - country.buildings.empty - country.buildings.ruins) * 5;
            const ruins_prestige = country.buildings.ruins * 2;

            return land_prestige + buildings_prestige + ruins_prestige;
        }

        function processTechy(data_row) {
            const technology_name_data = data_row.cells[4].innerText.split(DATA_SEPARATOR);
            const technology_count_data = data_row.cells[5].innerText.split(DATA_SEPARATOR);
            const secure_technology_count = 2 * parseInt(technology_count_data[10]);
            const technology = {
                count: 0,
                steal_per_op: 0,
                technologies_stolen_per_type: {},
            };

            for (let i = 0; i < technology_count_data.length; i++) {
                const count = parseInt(technology_count_data[i]);
                technology.count += count;

                let per_op;
                if (count > secure_technology_count) {
                    per_op = (count - secure_technology_count) * 0.05 + secure_technology_count * 0.002;
                } else {
                    per_op = count * 0.002;
                }

                if (per_op !== 0) {
                    technology.steal_per_op += per_op;
                    technology.technologies_stolen_per_type[technology_name_data[i]] = per_op.toFixed(0);
                }
            }

            technology.steal_per_op = technology.steal_per_op.toFixed(0);

            return technology;
        }

        function getCountryData(data_row, table_summary) {
            const unit_column = data_row.children[1].innerText.split(DATA_SEPARATOR);
            const country = { units: {}, buildings: {} };
            const unit_names = ["vojaci", "tanky", "stihacky", "bunkry", "mechy"];

            for (let i = 0; i < unit_names.length; i++) {
                const unit_name = unit_names[i];
                const count = parseInt(unit_column[i]);
                country.units[unit_name] = UNITS.get(unit_name, count);
            }

            const buildings_data = data_row.children[3].innerText.split(DATA_SEPARATOR);

            country.prestige = getPrestige(table_summary);
            country.regime = unit_column[8];
            country.land = parseInt(unit_column[9]);
            country.buildings.villages = Number(buildings_data[0]);
            country.buildings.cities = Number(buildings_data[1]);
            country.buildings.empty = Number(buildings_data[buildings_data.length - 2]);
            country.buildings.ruins = Number(buildings_data[buildings_data.length - 1]);
            country.people_defense = country.regime === "Anarchie" ? (country.buildings.cities * 2 + country.buildings.villages + country.land) * 3.5 : 0;

            return country;
        }

        function getArmyStrength({ units }) {
            let attack_sum = 0,
                defense_sum = 0;

            for (const unit_name in units) {
                attack_sum += units[unit_name].count * units[unit_name].attack;
                defense_sum += units[unit_name].count * units[unit_name].defense;
            }
            // ARMADA KONEC

            return {
                attack_sum,
                defense_sum,
            };
        }
    }

    function addValueToTable(labels_column, values_column, label = null, value = null, space_after = false) {
        const result = { after: {} };
        let element = addText(label);
        labels_column.appendChild(element);
        result.label = element;

        element = addText(value);
        values_column.appendChild(element);
        result.value = element;

        if (space_after) {
            element = createElement("br");
            labels_column.appendChild(element);
            result.after.label = element;

            element = createElement("br");
            values_column.appendChild(element);
            result.after.value = element;
        }
        return result;

        function addText(text = null) {
            if (text === null) {
                return createElement("br");
            }
            return createElement("p", { textContent: text });
        }
    }

    function wrapCountrySpyStatsAroundElement(element, country_id = getCountryId()) {
        const country_stats = getCountryStats(country_id);
        if (country_stats === undefined) return;

        const country_stats_table = createCountryStatsSpySuccessTable(country_stats);
        const operations_stats_table = createCountryStatsSpyOperationsTable(country_stats);
        const stolen_stats_table = createCountryStatsStolenStatsTable(country_stats);

        const combined_spy_stats_difficulty = getAllSpyStats();
        const combined_country_stats_table = createCombinedSpySuccessTable(combined_spy_stats_difficulty);

        const tables = [country_stats_table, combined_country_stats_table, operations_stats_table, stolen_stats_table];
        for (let index = 0; index < tables.length; index++) {
            const table = tables[index];
            if (table === undefined) continue;
            table.style.margin = "unset";
            table.style.height = "fit-content";
        }

        function toggleCurrentChild(parent) {
            const children = Array.from(parent.children);
            children[0].style.display = "initial";
            for (let i = 1; i < children.length; i++) {
                const child = children[i];
                child.style.display = "none";
            }

            let index = 0;
            parent.addEventListener("click", () => {
                index = index + 1;
                if (index >= children.length) index = 0;

                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    child.style.display = index === i ? "initial" : "none";
                }
            });
        }

        const container = createElement("div", { style: "position: relative" });
        element.parentElement.insertBefore(container, element);

        const wrapper = createElement("div", { style: "display: grid; grid-template-columns: 2fr 3fr 2fr; gap: 0.5rem; margin: 5px auto;" });
        container.appendChild(wrapper);

        const left_wrapper = createElement("div", { style: "margin-left: auto; height: fit-content;" });
        wrapper.appendChild(left_wrapper);

        const operations_stats_table_wrapper = createElement();
        left_wrapper.appendChild(operations_stats_table_wrapper);
        operations_stats_table_wrapper.appendChild(createElement("h2", { textContent: "Úspěsnost operací země 🔄", style: "padding-bottom: 0.25rem;" }));
        operations_stats_table_wrapper.appendChild(operations_stats_table);

        const stolen_stats_table_wrapper = createElement("div", { style: "display: none;" });
        left_wrapper.appendChild(stolen_stats_table_wrapper);
        stolen_stats_table_wrapper.appendChild(createElement("h2", { textContent: "Statistiky krádeží země 🔄", style: "padding-bottom: 0.25rem;" }));
        stolen_stats_table_wrapper.appendChild(stolen_stats_table);

        toggleCurrentChild(left_wrapper);

        element.style.margin = "unset";
        wrapper.appendChild(element);

        const right_wrapper = createElement("div", { style: "margin-right: auto; height: fit-content;" });
        wrapper.appendChild(right_wrapper);

        const country_stats_table_wrapper = createElement();
        right_wrapper.appendChild(country_stats_table_wrapper);

        country_stats_table_wrapper.appendChild(createElement("h2", { textContent: "Statistiky země 🔄", style: "padding-bottom: 0.25rem" }));
        country_stats_table_wrapper.appendChild(country_stats_table);

        const combined_country_stats_table_wrapper = createElement("div", { style: "display: none;" });
        right_wrapper.appendChild(combined_country_stats_table_wrapper);

        combined_country_stats_table_wrapper.appendChild(createElement("h2", { textContent: "Kombinované statistiky všech zemí 🔄", style: "padding-bottom: 0.25rem;" }));
        combined_country_stats_table_wrapper.appendChild(combined_country_stats_table);

        toggleCurrentChild(right_wrapper);

        return [operations_stats_table, country_stats_table_wrapper, combined_country_stats_table_wrapper];
    }

    function getCountryId() {
        let country_id = document.querySelector("#uLista a").href.split("id=")[1];
        if (country_id == undefined) {
            //obyc lista, mozna nefunguje?
            const lista = document.getElementById("#uLista");
            country_id = lista.children[0].textContent.split("#")[1];
        }
        return country_id;
    }

    function createNumberInput(id, default_value = 5, min = 1, max = 15, class_text = "short") {
        if (default_value > max) {
            default_value = max;
        }
        let input = createElement("input", { className: class_text, type: "number", value: default_value, min, max, id });

        return input;
    }

    // ROZVEDKA KONEC

    // valky

    function modifyValky() {
        const flipped = getSetting(VALKY_OBRACENE, 0);

        const textContent = flipped == 1 ? "Přehodit počítání prestiže na: cílová / vyhlašující ali" : "Přehodit počítání prestiže na: vyhlašující ali / cílová";
        let func = () => {
            setSetting(VALKY_OBRACENE, 1 - getSetting(VALKY_OBRACENE, 0));
            location.reload();
        };
        let button = createButton(textContent, func);

        let div = createElement("div", { style: "margin: 0 auto; width: fit-content;" });
        div.append(button);

        let header = document.getElementsByTagName("h1")[0];
        header.parentElement.insertBefore(div, header.nextElementSibling);

        let tables = document.querySelectorAll(".container .vis_tbl");

        // ziskat nazev ali ve valce
        let offset = isGameOver() ? 1 : 0;

        for (let i = 1 + offset; i < tables.length; i++) {
            const table = tables[i];

            for (let column_index = 4; column_index < 6; column_index++) {
                const vyhlasujici_ali_prestiz = parseInt(table.rows[column_index].children[1].innerText);
                const cilova_ali_prestiz = parseInt(table.rows[column_index].children[2].innerText);

                let procentualni_sila_ali = flipped == 0 ? cilova_ali_prestiz / vyhlasujici_ali_prestiz : vyhlasujici_ali_prestiz / cilova_ali_prestiz;
                procentualni_sila_ali = Math.round(procentualni_sila_ali * 10000) / 100;

                let color = "palegreen";
                if ((procentualni_sila_ali > 120 && flipped == 0) || (procentualni_sila_ali < 80 && flipped == 1)) {
                    color = "chartreuse";
                } else if ((procentualni_sila_ali < 80 && flipped == 0) || (procentualni_sila_ali > 120 && flipped == 1)) {
                    color = "coral";
                }

                table.rows[column_index].children[0].append(createElement("span", { textContent: "(" + procentualni_sila_ali + "%)", style: "margin-left: 5px; color: " + color }));
            }
        }
    }

    // valky konec

    // lista
    function saveResourcePrices() {
        if ((location.href.indexOf("svetovy_trh") != -1 && location.href.indexOf("tech") === -1) || location.href.indexOf("domtrh") != -1) {
            getPricesFromMarket();
        } else if (location.href.indexOf("index.php?p=archiv") === -1) {
            let info_messages = document.getElementsByClassName("infomsg");
            if (info_messages.length === 0) {
                return;
            }

            let count = info_messages.length - 1,
                food_set = false,
                energy_set = false,
                max_tries = 3;

            while (--count >= 0 && max_tries-- > 0) {
                let info_message = info_messages[count];
                if (info_message.textContent.indexOf("nakoupili") === -1) {
                    continue;
                }

                const price = Number(info_message.textContent.split("po ")[1].split("$")[0]);
                let variable;

                if (info_message.textContent.indexOf("jídla") != -1) {
                    if (food_set) continue;

                    variable = FOOD_PRICE;
                    food_set = true;
                } else if (info_message.textContent.indexOf("energie") != -1) {
                    if (energy_set) continue;

                    variable = ENERGY_PRICE;
                    energy_set = true;
                }

                if (variable !== undefined) {
                    setSetting(variable, price);
                }

                if (food_set && energy_set) {
                    return;
                }
            }
        }
    }

    function getPricesFromMarket() {
        const column_names = ["cena/kus", "tržní cena"];

        let tables = document.getElementsByClassName("vis_tbl");
        if (tables.length === 0) {
            return;
        }

        let column_price = 0,
            table;

        main_loop: for (let i = 0; i < tables.length; i++) {
            table = tables[i];

            for (let j = 0; j < table.rows[0].cells.length; j++) {
                const cell = table.rows[0].cells[j];
                if (column_names.includes(cell.textContent.toLowerCase())) {
                    column_price = j;
                    break main_loop;
                }
            }
        }

        if (column_price === 0) {
            return;
        }

        let cell = table.rows[1].cells[column_price];
        let price = cell.innerText.split("\n")[0].replace("$", "");
        if (price === "") {
            price = cell.children[0].value;
        }
        setSetting(FOOD_PRICE, Number(price));

        cell = table.rows[2].cells[column_price];
        price = cell.innerText.split("\n")[0].replace("$", "");
        if (price === "") {
            price = cell.children[0].value;
        }
        setSetting(ENERGY_PRICE, Number(price));
    }

    function modifyLista() {
        if (isGameOver()) {
            return;
        }

        saveResourcePrices();

        let lista = document.getElementById("uLista");
        if (lista == null) {
            // lista neni z nejakeho duvodu vubec na strance => skip
            return;
        }

        if (lista.rows[0].cells[0].children[0].tagName == "IMG") {
            processGoldLista();
            addListaObserver();

            return;
        }

        let tables = document.getElementsByTagName("table");
        const dividers = ["$", "t", "MWh"];

        // chceme vsechny tabulky, protoze na strance se muze 2x vyskytovat #uLista - stara + nova po odehrani kol
        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            if (table.id != "uLista") {
                // neni uLista => skip
                continue;
            }

            const row = table.rows[0];
            for (let j = 1; j < 4; j++) {
                const cell = row.cells[j];
                processListaCell(cell, dividers[j - 1]);
            }
        }
    }

    function addListaObserver() {
        let lista_elements = document.querySelectorAll("#uLista");
        const lista_element = lista_elements[lista_elements.length - 1];

        addObserver(lista_element, processGoldLista);
    }

    function addObserver(
        element,
        callback,
        options = {
            childList: true,
            subtree: false,
        }
    ) {
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
                    callback();
                }
            });
        });

        observer.observe(element, options);
    }

    function processGoldLista() {
        let lista_elements = document.querySelectorAll("table#uLista");

        for (let index = 0; index < lista_elements.length; index++) {
            const lista = lista_elements[index];

            updateGoldLista(lista);
        }
    }

    function updateGoldLista(lista) {
        let tables = lista.querySelectorAll("table");
        let table = tables[0];
        if (!table) {
            return;
        }
        const turns_element = lista.querySelector("strong");
        let playable_turns = 140;
        if (turns_element) {
            playable_turns = Number(turns_element.textContent.split("+")[0]);
        }

        const energy_price = getSetting(ENERGY_PRICE, 15);
        const food_price = getSetting(FOOD_PRICE, 15);
        const prices = [1, food_price, energy_price];

        const resource_names = ["money", "food", "energy"];
        const resources = new Map();
        resource_names.forEach((resource_name, index) => {
            let resource = {
                value: Number(table.rows[index].cells[1].textContent.replace(/\s/g, "")),
                per_turn: Number(table.rows[index].cells[2].textContent.replace(/\s/g, "")),
            };

            let stockpiled = 140;
            if (resource.per_turn < 0) {
                stockpiled = Math.floor(resource.value / -resource.per_turn);
            }
            if (stockpiled > 140 || stockpiled < 0) {
                stockpiled = 140;
            }
            resource.stockpiles_for = stockpiled;

            resource.spotreba = -resource.per_turn * prices[index];

            resources.set(resource_name, resource);
        });

        let cell;
        let resources_for_turns = getMoneyFor(resources.get("money"), resources.get("food"), resources.get("energy"));

        cell = table.rows[0].cells[3];
        if (cell === undefined) {
            cell = table.rows[0].insertCell();
            cell.style.textAlign = "right";
            cell.style.paddingLeft = "20px";
        } else {
            for (let index = cell.children.length - 1; index >= 0; index--) {
                const element = cell.children[index];
                element.remove();
            }
        }

        let props = { textContent: resources_for_turns[0], className: "plus" };

        if (Number(resources_for_turns[0].split(" kol")[0]) < playable_turns) {
            props.className = "minus";
        }

        let money_for_turns = createElement("span", props);
        cell.appendChild(money_for_turns);

        let separator = createElement("span", { textContent: " | " });
        cell.appendChild(separator);

        props = { textContent: resources_for_turns[1], className: "minus", style: "padding-right: 0;" };
        if (Number(resources_for_turns[1].replaceAll(String.fromCharCode(160), "").slice(0, -1)) > 0) {
            props.className = "plus";
        }
        let money_change_per_turn = createElement("span", props);
        cell.appendChild(money_change_per_turn);

        resource_names.forEach((resource_name, index) => {
            if (index === 0) return;

            const resource = resources.get(resource_name);

            if (resource.per_turn < 0) {
                const stockpiles_for = Math.round(resource.stockpiles_for * 10) / 10;
                const stockpiles_text = stockpiles_for == 0 ? "" : stockpiles_for + " kol | ";

                cell = table.rows[index].cells[3];
                if (cell === undefined) {
                    cell = table.rows[index].insertCell();
                    cell.style.textAlign = "right";
                    cell.style.paddingLeft = "20px";
                    cell.classList.add("minus");
                }
                cell.textContent = `${stockpiles_text} ${formatNumber(-resource.spotreba)}$`;
            }
        });
    }

    function getMoneyFor(money, food, energy) {
        let current_money = money.value,
            current_spotreba = money.spotreba,
            total_spotreba = current_spotreba + (energy.spotreba < 0 ? 0 : energy.spotreba) + (food.spotreba < 0 ? 0 : food.spotreba),
            money_for = 0,
            money_for_offset = 0;

        if (total_spotreba < 0) {
            return ["140+ kol", formatNumber(-total_spotreba) + "$"];
        }

        if (food.stockpiles_for !== energy.stockpiles_for && food.stockpiles_for !== 0) {
            let is_more_of_food = food.stockpiles_for > energy.stockpiles_for;
            let more_res = is_more_of_food ? food : energy;
            let less_res = is_more_of_food ? energy : food;

            if (less_res.stockpiles_for !== 0) {
                money_for = current_money / current_spotreba;
                if (money_for >= 0 && money_for < less_res.stockpiles_for) {
                    return [Math.floor(money_for) + " kol", formatNumber(-total_spotreba) + "$"];
                }
                money_for_offset = Math.min(money_for, less_res.stockpiles_for);
                current_money -= current_spotreba * less_res.stockpiles_for;
            }

            current_spotreba += less_res.spotreba;
            money_for = money_for_offset + current_money / current_spotreba;
            if (money_for >= 0 && money_for < more_res.stockpiles_for) {
                return [Math.floor(money_for) + " kol", formatNumber(-total_spotreba) + "$"];
            }
            money_for_offset = Math.min(money_for, more_res.stockpiles_for);

            current_money -= current_spotreba * (more_res.stockpiles_for - less_res.stockpiles_for);
        }
        current_spotreba = money.spotreba + food.spotreba + energy.spotreba;
        current_spotreba = money.spotreba + Math.max(food.spotreba, 0) + Math.max(energy.spotreba, 0);
        money_for = money_for_offset + current_money / current_spotreba;

        if (money_for > 140 || money_for < 0) {
            money_for = "140+";
        } else {
            money_for = Math.floor(money_for);
        }

        return [money_for + " kol", formatNumber(-total_spotreba) + "$"];
    }

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, String.fromCharCode(160));
    }

    function processListaCell(cell, divider) {
        if (cell == null) return;

        let text = cell.innerText;
        if (text == "") return;
        text = text.replaceAll(" ", "");

        const values = text.split(divider);
        const production = values[1].split(":")[1];

        if (production >= 0) {
            return;
        }

        const at_storage = values[0].split(":")[1];

        const turns_left = Math.floor((parseInt(at_storage) / parseInt(production)) * -1);
        addListaCellInformation(cell, turns_left);
    }

    function addListaCellInformation(cell, turns_left) {
        let color_class = "plus";
        if (turns_left < 20) {
            color_class = "minus";
        }
        const paragraph = createElement("p", { textContent: "Vydrží: ", className: color_class });

        const bold = createElement("b", { textContent: turns_left, className: color_class });
        bold.innerText = turns_left;
        if (color_class != null) {
            bold.classList.add(color_class);
        }
        paragraph.append(bold);
        paragraph.append(document.createTextNode("kol"));

        cell.append(paragraph);
    }
    //

    // detaily zeme
    function createArmyUnit(name, count, base_wage, prestige, base_food_consumption = 0.005, base_energy_consumption = 0) {
        const unit = new ArmyUnit(name, count, prestige);
        unit.base_wage = base_wage;
        unit.base_food_consumption = base_food_consumption;
        unit.base_energy_consumption = base_energy_consumption;
        return unit;
    }

    function createCountryStatsSpySuccessTable(country_stats) {
        const sorted_stats = country_stats.spy_stats.success_stats.sort((a, b) => a.difficulty_id - b.difficulty_id);

        return createCountryStatsSpyTable(sorted_stats, "difficulty_id", SpyDifficulty);
    }

    function createCombinedSpySuccessTable(complete_stats) {
        const sorted_stats = complete_stats.sort((a, b) => a.difficulty_id - b.difficulty_id);
        return createCountryStatsSpyTable(sorted_stats, "difficulty_id", SpyDifficulty);
    }

    function createCountryStatsSpyOperationsTable(country_stats) {
        const sorted_stats = country_stats.spy_stats.operation_stats.sort((a, b) => a.operation_id - b.operation_id);
        return createCountryStatsSpyTable(
            sorted_stats,
            "operation_id",
            Operation,
            [
                { label: "Název operace", key: "operation_id" },
                { label: "Operací", key: "count" },
                { label: "Úspěšných", key: "success" },
                { label: "%", key: "success_percentage" },
            ],
            false
        );
    }

    function createCountryStatsStolenStatsTable(country_stats) {
        const stats = country_stats.spy_stats.stolen_stats.reduce((result, stat) => {
            const values = {};
            values.operation_id = stat.operation_id;

            let per_operation = stat.values
                .map((value) => value.per_operation)
                .flat()
                .sort((a, b) => b - a);

            values.stolen = per_operation.reduce((sum, value) => sum + value, 0);
            values.count = per_operation.length;
            values.per_operation = Math.round(values.stolen / values.count);
            values.max = per_operation[0];

            result.push(values);
            return result;
        }, []);

        const sorted_stats = stats.sort((a, b) => a.operation_id - b.operation_id);
        return createCountryStatsSpyTable(
            sorted_stats,
            "operation_id",
            Operation,
            [
                { label: "Název operace", key: "operation_id" },
                { label: "Počet operací", key: "count" },
                { label: "Za operaci", key: "per_operation" },
                { label: "Max", key: "max" },
                { label: "Celkem", key: "stolen" },
            ],
            false
        );
    }

    function getAllSpyStats() {
        const all_country_stats = getSetting(COUNTRY_STATS, []);
        const stats = Object.values(all_country_stats);
        const success_stats = stats.map((stat) => stat.spy_stats.success_stats).flat();

        const length = getEnumLength(SpyDifficulty);
        let total_stats = new Array(length);
        for (let index = 0; index < length; index++) {
            total_stats[index] = {
                difficulty_id: index + 1,
                count: 0,
                success: 0,
            };
        }

        total_stats = success_stats.reduce(function (result, stats) {
            result[stats.difficulty_id - 1].count += stats.count;
            result[stats.difficulty_id - 1].success += stats.success;
            return result;
        }, total_stats);

        return total_stats;
    }

    function createCountryStatsSpyTable(
        stats,
        key,
        myEnum,
        values = [
            { label: "Obtížnost", key: "difficulty_id" },
            { label: "Operací", key: "count" },
            { label: "Úspěšných", key: "success" },
            { label: "%", key: "success_percentage" },
        ],
        add_total_row = true
    ) {
        let table = createElement("table", { className: "vis_tbl" });

        const header = table.insertRow();
        values.forEach((value) => {
            const header_cell = createElement("th", { textContent: value.label });
            header.appendChild(header_cell);
        });

        let total_count = 0;
        let total_succeeded = 0;

        let colors = [
            // red to green
            "#900", // 0
            "#B20", // 1
            "#F50", // 2
            "#FA0", // 3
            "#FD0", // 4
            "#DF0", // 5
            "#AF0", // 6
            "#5F0", // 7
            "#2B0", // 8
            "#090", // 9
            "#090", // 10
        ];

        const length = stats.length;

        for (let index = 0; index < length; index++) {
            const current_stat = stats[index];

            if (current_stat === undefined) return;

            total_count += current_stat.count;
            total_succeeded += current_stat.success;

            const row = table.insertRow();

            let cell = row.insertCell();
            cell.classList.add("l");
            const name = getEnumKeyByEnumValue(myEnum, current_stat[key]);
            cell.innerText = name.charAt(0).toUpperCase() + name.slice(1);

            for (let i = 1; i < values.length; i++) {
                const value = values[i].key;

                cell = row.insertCell();
                if (value === "success_percentage") {
                    cell.textContent = ((current_stat.success / current_stat.count) * 100).toFixed(1) + "%";
                    const color_id = current_stat.count === 0 ? 0 : Math.floor((current_stat.success / current_stat.count) * 10);
                    cell.style.color = colors[color_id];
                    continue;
                }

                const text = Number.isInteger(current_stat[value]) ? formatNumber(current_stat[value]) : current_stat[value];
                cell.textContent = text;
            }
        }

        if (add_total_row) {
            const row = table.insertRow();
            let cell = row.insertCell();
            cell.classList.add("l");
            cell.innerText = "Celkem";

            cell = row.insertCell();
            cell.innerText = total_count;

            cell = row.insertCell();
            cell.innerText = total_succeeded;

            let color_id = 0;
            if (total_count !== 0) {
                color_id = Math.floor((total_succeeded / total_count) * 10);
            }

            cell = row.insertCell();
            cell.style.color = colors[color_id];
            cell.innerText = (total_count !== 0 ? Math.round((total_succeeded / total_count) * 10000) / 100 : 0) + "%";
        }

        return table;
    }

    async function createWagesTable(eco_detail_table, war_detail_table, prestige, total_wage_reduction, resources_reduction, vlada) {
        let is_robokrat = vlada == "Robokracie";

        let values = getValuesFromTheCell(eco_detail_table.rows[1].cells[1]);
        let people = parseInt(values[2]);

        const base_consumption = 0.005 * ((1 * (100 - resources_reduction)) / 100);
        let consumption_food = base_consumption,
            consumption_energy = 0;
        if (is_robokrat) {
            consumption_food = 0;
            consumption_energy = base_consumption;
        }

        values = getValuesFromTheCell(war_detail_table.rows[1].cells[5]);
        let units = [];

        units.push(createArmyUnit("Vojáci", parseInt(values[0]), 0.06, 1, consumption_food, consumption_energy));
        units.push(createArmyUnit("Tanky", parseInt(values[1]), 0.42, 5, consumption_food, consumption_energy));
        units.push(createArmyUnit("Stíhačky", parseInt(values[2]), 0.32, 3.5, consumption_food, consumption_energy));
        units.push(createArmyUnit("Bunkry", parseInt(values[3]), 0.35, 3.5, consumption_food, consumption_energy));
        units.push(createArmyUnit("Mechové", parseInt(values[4]), 0.2, 2.7, 0, base_consumption));
        units.push(createArmyUnit("Agenti", parseInt(values[5]), 5.0, 15, consumption_food, consumption_energy));

        addUnitsBeingSold(units);

        let food_price = 10;
        let energy_price = 10;

        let prices = await fetchMarketPrices();

        food_price = prices[0];
        energy_price = prices[1];

        let wages_total = calculateTotalWages(units, prestige, -total_wage_reduction);
        let expenses_total = calculateTotalExpenses(units, food_price, energy_price);

        let expenses_container = createExpensesTable(units, expenses_total, wages_total, food_price, energy_price, total_wage_reduction, resources_reduction);
        war_detail_table.parentElement.insertBefore(expenses_container, war_detail_table.nextElementSibling);

        let result = {
            prestige: prestige,
            units: units,
            people: people,
            is_robokrat: is_robokrat,
            wages_total: wages_total,
            expenses_total: expenses_total,
            food_price: food_price,
            energy_price: energy_price,
        };

        return result;
    }

    function addUnitsBeingSold(units) {
        let package_elements = document.querySelectorAll(".gtrans, .gsale");

        for (let index = 0; index < package_elements.length; index++) {
            let cell = package_elements[index];
            let row = cell.parentElement;

            const name_to_find = row.cells[2].textContent.slice(0, -1);

            const unit = units.find(({ name }) => name === name_to_find);
            if (unit !== undefined) {
                unit.count += Number(row.cells[3].textContent.replace(/\s/g, ""));
            }
        }
    }

    function addSpyRobberyColumn(eco_detail_table, war_detail_table, prestige) {
        let values = getValuesFromTheCell(eco_detail_table.rows[1].cells[3]);
        const money = parseInt(values[0].slice(0, -1));
        const food = parseInt(values[1].slice(0, -1));
        const energy = parseInt(values[2].slice(0, -1));

        values = getValuesFromTheCell(war_detail_table.rows[1].cells[3]);
        const spy_tech_points = parseInt(values[10]);
        const safe_technology_points = spy_tech_points * 2;
        let technology_to_steal = 0;

        values.forEach((value) => {
            const technology_points = parseInt(value);
            if (technology_points > safe_technology_points) {
                technology_to_steal += (technology_points - safe_technology_points) * 0.05 + safe_technology_points * 0.002;
            } else {
                technology_to_steal += technology_points * 0.002;
            }
        });

        const safe_money = Math.min(spy_tech_points * 1000, money);
        const unsafe_money = money - safe_money;

        const money_to_steal = Math.round(Math.min(unsafe_money * 0.25 + safe_money * 0.01, prestige));

        const safe_food = Math.min(spy_tech_points * 50, food);
        const unsafe_food = food - safe_food;

        const food_to_steal = Math.round(Math.min(unsafe_food * 0.25 + safe_food * 0.01, prestige / 5));

        const safe_energy = Math.min(spy_tech_points * 50, energy);
        const unsafe_energy = energy - safe_energy;

        const energy_to_steal = Math.round(Math.min(unsafe_energy * 0.25 + safe_energy * 0.01, prestige / 5));

        war_detail_table.rows[0].appendChild(createElement("th", { textContent: "Další informace", colSpan: 2 }));

        // krádez rozvedkou:

        const columns = {
            labels: war_detail_table.rows[1].insertCell(),
            values: war_detail_table.rows[1].insertCell(),
        };
        columns.labels.classList.add("rname", "l");
        columns.values.classList.add("rdata", "r");

        let elements = addValueToTable(columns.labels, columns.values, "Krádež rozvědkou");
        elements.label.style.fontWeight = "bold";

        addValueToTable(columns.labels, columns.values, "Peníze", formatNumber(money_to_steal));
        addValueToTable(columns.labels, columns.values, "Jídlo", formatNumber(food_to_steal));
        addValueToTable(columns.labels, columns.values, "Energie", formatNumber(energy_to_steal));
        addValueToTable(columns.labels, columns.values, "Technologie", formatNumber(Math.floor(technology_to_steal)), true);
        addValueToTable(columns.labels, columns.values, "Mechy %", getMechyPercentageInArmy(war_detail_table));
    }

    function getMechyPercentageInArmy(war_detail_table) {
        const values = getValuesFromTheCell(war_detail_table.rows[1].cells[5]);
        let units = [];

        units.push(new ArmyUnit("Mechové", parseInt(values[4]), 2.7));
        units.push(new ArmyUnit("Vojáci", parseInt(values[0]), 1));
        units.push(new ArmyUnit("Tanky", parseInt(values[1]), 5));
        units.push(new ArmyUnit("Stíhačky", parseInt(values[2]), 3.5));
        units.push(new ArmyUnit("Bunkry", parseInt(values[3]), 3.5));

        let prestige_sum = units.reduce((acc, obj) => acc + obj.total_prestige, 0);
        if (prestige_sum === 0) {
            return "0%";
        }

        return ((units[0].total_prestige / prestige_sum) * 100).toFixed(1) + "%";
    }

    function addCountryDetailButtons(show_wages) {
        let infotext = document.getElementsByClassName("infotext");

        if (infotext.length === 0) {
            return;
        }

        infotext = infotext[0];

        const padding = "0.5rem";

        const div = createElement("div", { style: "margin-top: 0.6rem;" });
        infotext.append(div);

        let text = show_wages ? "Vypnout zobrazení výdajů" : "Zapnout zobrazení výdajů";
        let func = () => {
            setSetting(ZOBRAZENE_ZOLDY, !show_wages);
            refreshPage();
        };
        const show_wages_button = createButton(text, func, null, { style: `padding: ${padding}` });
        div.appendChild(show_wages_button);

        const is_ally = location.href.endsWith("p=detaily");

        const refresh_stats_button = createButton("Aktualizovat statistiky země", null, null, { style: `padding: ${padding}` });
        addDoubleClickProtection(refresh_stats_button);
        refresh_stats_button.addEventListener("click", async function () {
            await archive_spy.processSpyArchive(countryDetailGetCountryId(), !is_ally, false, true, refresh_stats_button);
        });
        div.appendChild(refresh_stats_button);

        const fetch_all_stats_button = createButton("Získat kompletní statistiky země", null, null, { style: `padding: ${padding}` });
        addDoubleClickProtection(fetch_all_stats_button);
        fetch_all_stats_button.addEventListener("click", async function () {
            await archive_spy.processSpyArchive(countryDetailGetCountryId(), !is_ally, true, true, fetch_all_stats_button);
        });
        div.appendChild(fetch_all_stats_button);

        const fetch_all_stats_for_ali_button = createButton("Získat statistiky všech zemí v alianci", null, null, { style: `padding: ${padding}` });
        addDoubleClickProtection(fetch_all_stats_for_ali_button);
        fetch_all_stats_for_ali_button.addEventListener("click", async function () {
            await processSpyArchiveForAlliance(fetch_all_stats_for_ali_button);
        });
        div.appendChild(fetch_all_stats_for_ali_button);

        const reset_button = createButton("Vynulovat statistiky všech zemí", null, null, { style: `padding: ${padding}` });
        addDoubleClickProtection(fetch_all_stats_for_ali_button);
        reset_button.addEventListener("click", async function () {
            resetCountryStats();
        });
        div.appendChild(reset_button);
    }

    async function processCountryDetail() {
        if (document.querySelector("h1").textContent !== "Detaily členů aliance") {
            return;
        }

        const show_wages = getSetting(ZOBRAZENE_ZOLDY, true);
        const country_id = countryDetailGetCountryId();
        const country_stats = getCountryStats(country_id);

        addCountryDetailButtons(show_wages);

        let eco_detail_table = document.getElementById("tdetail");
        let war_detail_table = document.getElementById("detaily");

        if (!war_detail_table || !eco_detail_table) {
            return;
        }

        let values = getValuesFromTheCell(eco_detail_table.rows[1].cells[1]);
        let prestige = parseInt(values[0]);

        addSpyRobberyColumn(eco_detail_table, war_detail_table, prestige);
        if (country_stats !== undefined) {
            wrapCountrySpyStatsAroundElement(eco_detail_table, country_id);
        }

        if (!show_wages) {
            return;
        }

        let vlada = null,
            hodnost = null,
            ekonom = 0,
            ali_bonus = 0,
            ali_tag = null;

        // ziskat hodnost
        let hodnost_elements = document.getElementsByClassName("hodnost");
        if (hodnost_elements.length === 0) {
            return;
        }
        hodnost = Number(hodnost_elements[0].textContent.split("(")[1].split(")")[0]);
        let table = hodnost_elements[0].closest("table");

        // ziskat zrizeni
        vlada = table.rows[0].cells[3].textContent;

        // ziskat ali tag
        let country_full_name = table.rows[0].cells[1].textContent;
        if (country_full_name.includes("[")) {
            ali_tag = country_full_name.split("[")[1].split("]")[0];
        }

        let generals_table = document.getElementById("dgen");
        if (generals_table) {
            for (let index = 1; index < generals_table.rows.length; index++) {
                const row = generals_table.rows[index];
                let cell = row.cells[1];

                if (cell.textContent.includes("Ekonom")) {
                    ekonom = Number(row.cells[2].textContent);
                    break;
                }
            }
        }

        if (ali_tag !== null && ali_tag !== "Bezalianční") {
            let saved_ali_data = getSetting(COUNTRY_ALI_DATA, null);
            let time_in_millis = getCurrentTimeInMillis();

            if (saved_ali_data == null || saved_ali_data.ali_tag != ali_tag || saved_ali_data.updated_at + COUNTRY_ALI_DATA_TIME_OFFSET_MILLIS < time_in_millis) {
                // pouze provadet request, jestli informace ze settingu jsou ulozene informace z jine aliance a nebo jsou data moc stara
                ali_bonus = await fetchAliFundaBonus(ali_tag);

                setSetting(COUNTRY_ALI_DATA, {
                    ali_tag: ali_tag,
                    ali_bonus: ali_bonus,
                    updated_at: time_in_millis,
                });
            } else {
                ali_bonus = saved_ali_data.ali_bonus;
            }
        }

        let resources_reduction = 0;
        let total_wage_reduction = ali_bonus;
        let econom_effective_level = ekonom;

        if (ekonom > 5) {
            econom_effective_level = 4 + ((ekonom - 4) * (ekonom - 3)) / 2;
        }
        total_wage_reduction += econom_effective_level * 5;
        if (hodnost >= 11) resources_reduction += 15;
        if (hodnost >= 12) total_wage_reduction += 25;
        if (vlada === "Fundamentalismus") total_wage_reduction += 25;

        createWagesTable(eco_detail_table, war_detail_table, prestige, total_wage_reduction, resources_reduction, vlada);
    }

    async function fetchAliFundaBonus(ali_tag) {
        return new Promise((resolve) => {
            const url = "index.php?p=najit&s=najittag&tag=" + ali_tag;

            let req = new XMLHttpRequest();
            req.open("GET", url);
            req.onload = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(req.response, "text/html");

                    let funda_bonus = 0;

                    let table = doc.getElementById("alliance-members");
                    let member_count = table.rows.length - 3;
                    const fund_text = "Fund";

                    for (let index = 1; index < member_count + 1; index++) {
                        const row = table.rows[index];
                        let cell = row.cells[6];

                        if (cell.textContent === fund_text) {
                            funda_bonus = Math.floor(member_count / 2) * 3;
                            break;
                        }
                    }

                    resolve(funda_bonus);
                } else {
                    resolve(0);
                }
            };
            req.send();
        });
    }

    function getValuesFromTheCell(cell) {
        return cell.innerHTML.replaceAll("\n\t", "").replaceAll(" ", "").split("<br>");
    }

    function calculateTotalWages(units, prestige, wage_increase = 0) {
        const wage_modification = Math.max((1 + wage_increase / 100) * (1 + prestige / 5000000), 0.1);

        let wages_total = 0;
        for (const unit of units) {
            unit.expenses_per_unit = unit.base_wage * wage_modification;

            unit.wages_total = Math.round(unit.count * unit.expenses_per_unit * 100) / 100;
            wages_total += unit.wages_total;
        }

        return Math.round(wages_total * 100) / 100;
    }

    function calculateTotalExpenses(units, food_price, energy_price) {
        let expenses_total = 0;

        for (const unit of units) {
            unit.expenses_per_unit += unit.base_food_consumption * food_price + unit.base_energy_consumption * energy_price;
            unit.expenses_per_prestige_point = unit.expenses_per_unit / unit.prestige;

            unit.expenses_total = Math.round(unit.expenses_per_unit * unit.count * 100) / 100;

            expenses_total += unit.expenses_total;
        }

        return Math.round(expenses_total * 100) / 100;
    }

    function fetchMarketPrices() {
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
                    for (let i = 0; i < 2; i++) {
                        const price_cell = price_cells[i];
                        prices.push(Number(price_cell.innerText.replaceAll(" ", "").replace("$", "")));
                    }

                    resolve(prices);
                } else {
                    log("File not found");
                }
            };
            req.send();
        });
    }

    function createExpensesTable(units, expenses_total, wages_total, food_price, energy_price, total_wage_reduction, resources_reduction) {
        const div = createElement();

        div.append(createElement("h2", { textContent: "Výdaje za armádu" }));

        const table = createElement("table", { id: "spotreba_jednotek", className: "vis_tbl", style: "table-layout: fixed; min-width: 600px; max-width: 1200px; width: 70%;" });
        div.append(table);

        const th_values = [
            "Jednotka",
            "Počet",
            "Celkem",
            `Žold (${(total_wage_reduction <= 0 ? "+" : "") + -total_wage_reduction}%)`,
            `Suroviny (${(resources_reduction <= 0 ? "+" : "") + -resources_reduction}%)`,
            "Na 1 jednotku",
            "Na bod prestiže",
            "Procento výdajů",
        ];
        let row = table.insertRow();
        th_values.forEach((th_value) => {
            row.appendChild(createElement("th", { textContent: th_value }));
        });

        let total_food_cost = 0,
            total_energy_cost = 0;

        units.forEach((unit) => {
            const food_consumed = unit.base_food_consumption * unit.count;
            const food_cost = food_consumed * food_price;
            total_food_cost += food_cost;

            const energy_consumed = unit.base_energy_consumption * unit.count;
            const energy_cost = energy_consumed * energy_price;
            total_energy_cost += energy_cost;

            const base_resources_consumption = unit.base_food_consumption * food_price + unit.base_energy_consumption * energy_price;
            const base_wage_per_unit = unit.expenses_per_unit - base_resources_consumption;
            const wage_percentage = (base_wage_per_unit / (base_wage_per_unit + base_resources_consumption)) * 100;
            const others_percentage = (base_resources_consumption / (base_wage_per_unit + base_resources_consumption)) * 100;

            const row = table.insertRow();

            let cell = row.insertCell();
            cell.textContent = unit.name;
            cell.classList.add("rname", "l");

            addCellWithNumericalValue(row, unit.count, 0, "");

            cell = addCellWithNumericalValue(row, unit.expenses_total);
            cell.title = `Žold: ${Math.round(wage_percentage * 10) / 10}% \nSuroviny: ${Math.round(others_percentage * 10) / 10}%`;

            cell = addCellWithNumericalValue(row, unit.wages_total);
            cell.title = `Žold: ${Math.round(wage_percentage * 10) / 10}% \nSuroviny: ${Math.round(others_percentage * 10) / 10}%`;

            if (food_cost > energy_cost) {
                cell = addCellWithNumericalValue(row, food_cost);
                cell.title = `Celková spotřeba jídla jednotkou: ${Math.round(food_consumed * 10) / 10}\nCena jídla: ${food_price}`;
            } else {
                cell = addCellWithNumericalValue(row, energy_cost);
                if (energy_cost > 0) {
                    cell.title = `Celková spotřeba energie jednotkou: ${Math.round(energy_consumed * 10) / 10}\nCena energie: ${energy_price}`;
                }
            }

            cell = addCellWithNumericalValue(row, unit.expenses_per_unit, 3);
            cell.title = `Žold: ${Math.round(base_wage_per_unit * 1000) / 1000}$ \nSuroviny: ${Math.round(base_resources_consumption * 1000) / 1000}$`;

            cell = addCellWithNumericalValue(row, unit.expenses_per_prestige_point, 3);
            cell.title = `Žold: ${Math.round((base_wage_per_unit / unit.prestige) * 1000) / 1000}$ \nSuroviny: ${Math.round((base_resources_consumption / unit.prestige) * 1000) / 1000}$`;

            let percent = expenses_total > 0 ? unit.expenses_total / expenses_total : 0;
            cell = addCellWithNumericalValue(row, percent * 100, 1, "%");
            cell.title = `Žold: ${Math.round(wage_percentage * 10) / 10}% \nSuroviny: ${Math.round(others_percentage * 10) / 10}%`;
        });

        row = table.insertRow();

        let cell = row.insertCell();
        cell.textContent = "Celkem";
        cell.classList.add("rname", "l");
        cell.colSpan = 2;

        addCellWithNumericalValue(row, expenses_total);
        addCellWithNumericalValue(row, wages_total);
        cell = addCellWithNumericalValue(row, total_food_cost + total_energy_cost);
        cell.title = `Celkem jídlo:      \t${formatNumber(total_food_cost.toFixed(1))}$\nCelkem energie: \t${formatNumber(total_energy_cost.toFixed(1))}$`;
        row.insertCell().colSpan = 3;

        return div;
    }

    function processPrestigeDetails() {
        let tables = document.getElementsByClassName("vis_tbl");
        let table = null;

        for (let i = 0; i < tables.length; i++) {
            if (tables[i].rows.length > 10) {
                table = tables[i];
                break;
            }
        }

        if (table === null) return;

        let percent = 0,
            prestige = 0;

        for (let index = 3; index < table.rows.length; index++) {
            const row = table.rows[index];
            if (row.cells[0].tagName === "TH") {
                insertPrestigeDetailsRow(table, index, prestige, percent);
                prestige = 0;
                percent = 0;
                index++;

                continue;
            }

            const percent_cell = row.cells[1];
            const prestige_cell = row.cells[4];

            percent += Number(percent_cell.textContent.split("%")[0]);
            prestige += Number(prestige_cell.textContent.replace(/\s/g, ""));
        }

        insertPrestigeDetailsRow(table, table.rows.length, prestige, percent);
    }

    function insertPrestigeDetailsRow(table, index, prestige, percent) {
        const row = table.insertRow(index);
        let cell = row.insertCell();
        cell.classList.add("rname", "l");
        cell.textContent = "Celkem";

        cell = row.insertCell();
        cell.classList.add("perf");
        cell.textContent = percent.toFixed(1) + "%";

        cell = row.insertCell();
        cell.classList.add("rdata");
        cell.colSpan = 2;

        cell = row.insertCell();
        cell.classList.add("rdata");
        cell.textContent = formatNumber(prestige);
    }

    function modifyStatisticsPage() {
        let table = document.getElementById("statszrizeni");
        if (!table) {
            return;
        }

        let rows = Array.from(table.rows);

        let row = rows.shift();
        row.insertBefore(createElement("th", { innerHTML: "%<br>zemí" }), row.children[2]);

        let countries_count = rows.reduce((acc, row) => acc + Number(row.cells[1].textContent), 0);

        rows.forEach((row) => {
            const count = Number(row.cells[1].textContent);
            const cell = row.insertCell(2);
            const percent = (100 * count) / countries_count;
            cell.textContent = formatNumber(percent.toFixed(1)) + "%";
        });

        let sum_row = table.insertRow();
        let cell = sum_row.insertCell();
        cell.classList.add("l");
        cell.textContent = "Celkem";

        cell = sum_row.insertCell();
        cell.textContent = countries_count;

        cell = sum_row.insertCell();
        cell.textContent = "100.0%";

        const stats = getStatsData();
        if (!stats) {
            return;
        }

        cell = sum_row.insertCell();
        cell.textContent = stats.average_land;

        cell = sum_row.insertCell();
        cell.textContent = stats.average_prestige;

        cell = sum_row.insertCell();
        cell.textContent = stats.max_prestige;

        cell = sum_row.insertCell();
        cell.textContent = stats.average_turns_played;
    }

    function getStatsData() {
        const table = document.getElementById("statvalues");
        if (!table) {
            return null;
        }

        let stats_data = {};

        let rows = Array.from(table.rows);

        const labels = ["average_prestige", "average_land", "max_prestige", "average_turns_played"];
        const row_index = [1, 2, 1, 6];
        const column_index = [1, 1, 3, 1];

        for (let index = 0; index < row_index.length; index++) {
            const row = rows[row_index[index]];
            const value = Number(row.children[column_index[index]].textContent);
            stats_data[labels[index]] = value;
        }

        return stats_data;
    }

    function addCellWithNumericalValue(row, value, fraction_digits = 1, after_value = "$") {
        const cell = row.insertCell();
        cell.textContent = formatNumber(value.toFixed(fraction_digits)) + after_value;
        cell.classList.add("rdata", "r");
        return cell;
    }

    function modifyArchive() {
        const modify_archive = getSetting(MODIFY_ARCHIVE, true);

        if (!modify_archive) {
            return;
        }

        let tables = document.getElementsByClassName("vis_tbl");
        let table = null;
        for (let i = 0; i < tables.length; i++) {
            if (tables[i].rows.length > 2 && tables[i].rows[0].cells.length == 2) {
                table = tables[i];
                break;
            }
        }

        if (table === null) {
            return;
        }

        const TOOLTIP_ROW_VALUES = ["name", "count", "prestige"];

        CssHelper.addSavedCss(CssHelper.styles.archive);
        CssHelper.addTooltipCss(250, true, 100);

        let header_row = table.rows[0];
        header_row.style.position = "sticky";
        header_row.style.top = "0";
        header_row.style.zIndex = "1";

        header_row.appendChild(createElement("th", { textContent: "Prestiž na expy" }));

        const colors = ["red", "lime", "mediumorchid"];

        for (let index = 1; index < table.rows.length; index++) {
            const row = table.rows[index];
            let message = row.cells[1].textContent;
            message = message.replace("Nová - Útoky", "").replace("Nová - Spojenci", "").replace("Nová - Rozvědka", "").trim();

            let result = null;

            if (message.indexOf("Nepřátelským mechům") !== -1) {
                result = processExpTazeni(message);
            } else if (message.indexOf("na nás podnikla partyzánský útok") !== -1) {
                result = processExpPartyzan(message);
            } else if (message.indexOf("Naši vojáci odvrátili partyzánský útok") !== -1) {
                result = processExpPartyzanSuccessful(message);
            } else if (message.startsWith("Pěchotě země ")) {
                result = processExpVniknutiDoBunkru(message);
            } else if (message.startsWith("Naši vojáci odvrátili vniknutí do bunkrů")) {
                result = processExpVniknutiDoBunkruSuccessful(message);
            } else if (message.startsWith("Naší pěchotě se")) {
                result = processExpVniknutiDoBunkruUtok(message);
            } else if (message.startsWith("Tankové brigádě ")) {
                result = processExpTyl(message);
            } else if (message.startsWith("Bleskový úder tankové brigády ")) {
                result = processExpTyl(message, true);
            } else if (message.startsWith("Letectvo nepřátelské země")) {
                result = processExpNaletSuccessful(message);
            } else if (message.indexOf("na naše strategická vojenská zařízení") !== -1) {
                result = processExpNalet(message);
            } else if (message.startsWith("Stali jsme se obětí  loupežného útoku") || message.startsWith("Stali jsme se obětí částečného loupežného útoku")) {
                result = processExpLoupezak(message);
            } else if (message.indexOf("prolomila naši obranu a zabrala ") !== -1) {
                result = processExpDobyvak(message);
            } else if (message.startsWith("Naší tankové brigádě se")) {
                result = processExpTylUtok(message);
            } else if (message.startsWith("Bleskový úder naší tankové brigády")) {
                result = processExpTylUtok(message, false);
            } else if (message.indexOf("Naši elitní piloti podnikli  taktický nálet") !== -1 || message.indexOf("Naši elitní piloti podnikli částečný taktický nálet") !== -1) {
                result = processExpNaletUtok(message);
            } else if (message.startsWith("Našim mechům se podařilo během nočního tažení")) {
                result = processExpTazeniUtok(message);
            } else if (message.indexOf("Při loupeživém útoku na ") !== -1) {
                result = processExpNormalUtok(message);
            } else if (message.indexOf("Obsadili jsme") !== -1) {
                result = processExpNormalUtok(message);
            } else if (message.startsWith("Partyzánský útok")) {
                result = processExpPartyzanUtok(message);
            } else if (message.startsWith("Naši vojáci neuspěli díky silnému odporu")) {
                result = processExpPartyzanUtok(message, false);
            } else if (message.startsWith("Barbarská armáda")) {
                result = processExpVyhlaz(message);
            } else if (message.indexOf("Při vyhlazovacím útoku") !== -1) {
                result = processExpDobyvakSuccessful(message);
            } else if (message.startsWith("Sebevědomá země")) {
                result = processExpDobyvakSuccessful(message);
            } else if (message.indexOf("bombardovaly naše budovy") !== -1) {
                result = processExpBombeni(message);
            } else if (message.startsWith("Naše mocné protiletecké síly")) {
                result = processExpBombeniSuccessful(message);
            } else if (message.indexOf("úspěšně bombardovaly  civilní cíle") !== -1) {
                result = processExpBombeniUtok(message);
            } else if (message.startsWith("Našim jednotkám se nepodařilo obejít přesilu nepřátelských mechů")) {
                result = processExpTazeniUtok(message);
            } else if (message.startsWith("Země") && message.indexOf("nebyla poražena. Naše ztráty byly ")) {
                result = processExpNormalUtok(message);
            } else if (message.startsWith("Byli jsme povoláni zemí")) {
                result = processExpSpojka(message);
            } else if (message.startsWith("Rozvědka")) {
                // process opku
                if (message.indexOf("Naši agenti ukradli celkem") !== -1) {
                    processTechnologyToMoney(message, row);
                }
            }

            const cell = row.insertCell();

            if (result === null) continue;

            cell.style.textAlign = "center";
            cell.style.userSelect = "none";

            if (result.exp_ratio !== null) {
                cell.textContent = result.exp_ratio;
                cell.style.color = colors[result.type];

                const tooltip = createElement();
                cell.appendChild(tooltip);
                wrapInTooltip(tooltip);

                const header = addRowToTooltip(tooltip, { name: "Jednotka", count: "Počet", prestige: "Prestiž" });
                header.classList.add("header");

                for (let index = 0; index < result.units_lost.length; index++) {
                    const unit = result.units_lost[index];
                    addRowToTooltip(tooltip, unit);
                }
                tooltip.appendChild(createElement("p", { className: "divider" }));

                const additional_info = [
                    {
                        name: "Celkem:",
                        count: "",
                        prestige: result.total_prestige,
                    },
                    {
                        name: "Zkušeností:",
                        count: "",
                        prestige: result.experience,
                    },
                ];

                for (let index = 0; index < additional_info.length; index++) {
                    const info = additional_info[index];
                    addRowToTooltip(tooltip, info);
                }
            }
        }

        function addRowToTooltip(tooltip, information) {
            const p = createElement("p", { className: "row" });
            tooltip.appendChild(p);

            for (let i = 0; i < TOOLTIP_ROW_VALUES.length; i++) {
                const unit_value = TOOLTIP_ROW_VALUES[i];
                const span = createElement("span", { textContent: information[unit_value] });
                p.appendChild(span);
            }

            return p;
        }
    }

    async function processTechnologyToMoney(message, row) {
        message = message.split("Rozpis: ")[1];
        let numbers = message.match(/(\d)+/g);
        let words = message.replace(/[0-9]/g, "").split(".")[0].split(", ");

        let tech_prices = await technology_prices.get();

        let total_money = 0,
            title = "";

        for (let i = 0; i < words.length; i++) {
            let count = Number(numbers[i]);
            if (count === 0) {
                continue;
            }

            let word = words[i];
            let price = tech_prices[i];

            total_money += price * count;
            title += `${word}: ${formatNumber(count)}x ${formatNumber(price)}$ = ${formatNumber(Math.floor(price * count))}$\n`;
        }

        let p = createElement("p", { textContent: "Hodnota celkem: ", title });
        row.cells[1].appendChild(p);

        p.appendChild(createElement("span", { textContent: formatNumber(Math.floor(total_money)) + "$", style: "font-weight: bold; color: lime;" }));
    }

    function processExpTazeni(message) {
        if (message.indexOf("nepodařilo obejít přesilu našich mechů") !== -1) {
            message = message.split("nepodařilo obejít přesilu našich mechů")[1];
            let numbers = message.match(/(\d)+/g);

            let units = [UNITS.get("mechy", Number(numbers[1]))];
            let experience = Number(numbers.pop());
            return processExp(units, experience);
        }

        message = message.split("se podařilo během nočního tažení naší zemí zlikvidovat")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [
            UNITS.get("vojaci", Number(numbers.shift())),
            UNITS.get("tanky", Number(numbers.shift())),
            UNITS.get("stihacky", Number(numbers.shift())),
            UNITS.get("budovy", Number(numbers.shift())),
            UNITS.get("mechy", Number(numbers[1])),
        ];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpTazeniUtok(message) {
        message = message.split("Zničeno bylo")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("mechy", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience, 1);
    }

    function processExpPartyzan(message) {
        message = message.split("%, zabito bylo ")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("agenti", Number(numbers.shift())), UNITS.get("energie", Number(numbers.shift())), UNITS.get("vojaci", Number(numbers[1]))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpPartyzanSuccessful(message) {
        message = message.split("Zahynulo při tom ")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("vojaci", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpPartyzanUtok(message, success = true) {
        let separator = "Při bojích zahynulo";
        if (!success) separator = "Zahynulo při tom";
        message = message.split(separator)[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("vojaci", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience, 1);
    }

    function processExpVniknutiDoBunkru(message) {
        message = message.split("se podařilo vniknout do ")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("bunkry", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpVniknutiDoBunkruSuccessful(message) {
        message = message.split("Zahynulo při tom ")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("vojaci", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpVniknutiDoBunkruUtok(message) {
        message = message.split("Při tom zahynulo")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("vojaci", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience, 1);
    }

    function processExpTyl(message, success = false) {
        let separator = "My jsme při tom přišli o";
        if (success) separator = "Ztratili jsme při tom";
        message = message.split(separator)[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("tanky", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpTylUtok(message, success = true) {
        let separator = "My jsme při tom přišli o ";
        if (!success) {
            separator = "Ztratili jsme při tom ";
        }
        message = message.split(separator)[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("tanky", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience, 1);
    }

    function processExpNalet(message) {
        message = message.split("Nálety nám zničily ")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("budovy_na_ruiny", Number(numbers.shift())), UNITS.get("stihacky", Number(numbers.shift())), UNITS.get("bunkry", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpNaletSuccessful(message) {
        message = message.split("Při obraně jsme ztratili ")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("stihacky", Number(numbers.shift())), UNITS.get("bunkry", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpBombeni(message) {
        message = message.split("Pod troskami")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("budovy", Number(numbers.shift())), UNITS.get("budovy_na_ruiny", Number(numbers.shift()))];
        numbers.shift(); // obyvatele
        numbers.shift(); // nepratelske stihacky
        units.push(UNITS.get("stihacky", Number(numbers.shift())));
        units.push(UNITS.get("bunkry", Number(numbers.shift())));
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpBombeniSuccessful(message) {
        message = message.split(". Bylo zničeno ")[1];

        let numbers = message.match(/(\d)+/g);
        numbers.shift(); // nepratelske stihacky

        let units = [UNITS.get("stihacky", Number(numbers.shift())), UNITS.get("bunkry", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience);
    }

    function processExpBombeniUtok(message) {
        message = message.split("Bylo zničeno")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("stihacky", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience, 1);
    }

    function processExpNaletUtok(message) {
        message = message.split("vojenských základen nepřítele")[1];

        let numbers = message.match(/(\d)+/g);

        let units = [UNITS.get("stihacky", Number(numbers.shift()))];
        let experience = Number(numbers.pop());

        return processExp(units, experience, 1);
    }

    function processExpLoupezak(message) {
        message = message.split("Bylo nám násilně zabráno ")[1];
        return processNormal(message);
    }

    function processExpNormalUtok(message) {
        message = message.split("Naše ztráty byly ")[1];
        return processNormalUtok(message);
    }

    function processExpSpojka(message) {
        message = message.split("V bojích bylo ztraceno ")[1];
        return processNormalUtok(message, true);
    }

    function processExpDobyvak(message) {
        message = message.split("prolomila naši obranu a zabrala ")[1];
        return processNormal(message);
    }

    function processExpDobyvakSuccessful(message) {
        message = message.split("Naše ztráty byly")[1];

        let numbers = message.match(/(\d)+/g);

        const experience = Number(numbers.pop());

        let units = [UNITS.get("vojaci", Number(numbers.shift())), UNITS.get("tanky", Number(numbers.shift())), UNITS.get("bunkry", Number(numbers.shift())), UNITS.get("mechy", Number(numbers.shift()))];

        return processExp(units, experience);
    }

    function processExpVyhlaz(message) {
        message = message.split(" zničila ")[1];

        let numbers = message.match(/(\d)+/g);

        const experience = Number(numbers.pop());

        let units = [
            UNITS.get("budovy", Number(numbers[0])),
            UNITS.get("ruiny", Number(numbers[1])),
            UNITS.get("penize", Number(numbers[3])),
            UNITS.get("jidlo", Number(numbers[4])),
            UNITS.get("energie", Number(numbers[5])),
            UNITS.get("technologie", Number(numbers[6])),
            UNITS.get("vojaci", Number(numbers[7])),
            UNITS.get("tanky", Number(numbers[8])),
            UNITS.get("bunkry", Number(numbers[9])),
            UNITS.get("mechy", Number(numbers[10])),
        ];

        return processExp(units, experience);
    }

    function processNormal(message) {
        let numbers = message.match(/(\d)+/g);

        const experience = Number(numbers.pop());

        let units = [
            UNITS.get("uzemi", Number(numbers[0])),
            UNITS.get("budovy", Number(numbers[2]) * 2),
            UNITS.get("penize", Number(numbers[3])),
            UNITS.get("jidlo", Number(numbers[4])),
            UNITS.get("energie", Number(numbers[5])),
            UNITS.get("technologie", Number(numbers[6])),
            UNITS.get("vojaci", Number(numbers[7])),
            UNITS.get("tanky", Number(numbers[8])),
            UNITS.get("bunkry", Number(numbers[9])),
            UNITS.get("mechy", Number(numbers[10])),
        ];

        return processExp(units, experience);
    }

    function processNormalUtok(message, is_spojka = false) {
        let numbers = message.match(/(\d)+/g);

        const experience = Number(numbers.pop());

        let units = [UNITS.get("vojaci", Number(numbers.shift())), UNITS.get("tanky", Number(numbers.shift())), UNITS.get("bunkry", Number(numbers.shift())), UNITS.get("mechy", Number(numbers.shift()))];

        let type = is_spojka ? 2 : 1;

        return processExp(units, experience, type);
    }

    /**
     *
     * @param {array} units
     * @param {int} experience
     * @param {int} type 0 = defense, 1 = attack, 2 = ally
     * @returns {object}
     */
    function processExp(units, experience, type = 0) {
        let total_prestige = 0,
            units_lost = [];

        for (let index = 0; index < units.length; index++) {
            const unit = units[index];
            const prestige = unit.count * unit.prestige;
            total_prestige += prestige;
            units_lost.push({ name: unit.name + ":", count: formatNumber(unit.count), prestige: formatNumber(prestige.toFixed(1)) });
        }

        let percentage = total_prestige == 0 ? 999 : (experience / total_prestige) * 100;
        experience = formatNumber(experience.toFixed(1));
        total_prestige = formatNumber(total_prestige.toFixed(1));

        return { exp_ratio: formatNumber(percentage.toFixed(2)) + "%", units_lost, total_prestige, type, experience };
    }

    class Operation {
        constructor(type) {
            this.type = type;
        }
    }

    Operation["Infiltrovat vládu"] = 10;
    Operation["Infiltrovat rozvědku"] = 11;
    Operation["Infiltrovat generální štáb"] = 12;
    Operation["Infiltrovat vědecká centra"] = 13;
    Operation["Nabourat ovládání mechů"] = 20;
    Operation["Počítačový virus"] = 21;
    Operation["Sabotovat letiště"] = 22;
    Operation["Rozšířit epidemii"] = 23;
    Operation["Demoralizovat obyvatele"] = 24;
    Operation["Zničit rakety"] = 25;
    Operation["Vykrást sklady"] = 30;
    Operation["Vykrást centrální banku"] = 31;
    Operation["Napíchnout ropovod"] = 32;
    Operation["Ukrást technologie"] = 33;
    Operation["Prodat drogy"] = 34;
    Operation["Jiné"] = 40;

    class SpyDifficulty {
        constructor(type) {
            this.type = type;
        }
    }

    SpyDifficulty["snadná jak facka"] = 1;
    SpyDifficulty["jednoduchá"] = 2;
    SpyDifficulty["středně náročná"] = 3;
    SpyDifficulty["velice náročná"] = 4;
    SpyDifficulty["extrémně náročná"] = 5;
    SpyDifficulty["téměř neproveditelná"] = 6;

    const archive_spy = (function () {
        const URL = "index.php?p=archiv&typ=3&limit=";
        const ALLY_URL = "index.php?p=archiv&typ=3&tag=1&id=$country_id$&limit=";
        const MESSAGES_PER_PAGE = 30;

        const OPERATION_SEARCH_TERMS = [
            // infiltrace
            {
                term: /infiltrova(li|t) vládu/,
                operation: "Infiltrovat vládu",
            },
            {
                term: /infiltrova(li|t) rozvědku/,
                operation: "Infiltrovat rozvědku",
            },
            {
                term: /infiltrova(li|t) generální štáb/,
                operation: "Infiltrovat generální štáb",
            },
            {
                term: /infiltrova(li|t) vědecká centra/,
                operation: "Infiltrovat vědecká centra",
            },

            // sabotazni
            {
                term: /naboura(li|t) ovládání mechů/,
                operation: "Nabourat ovládání mechů",
            },
            {
                term: /zavirova(li|t) počítače/,
                operation: "Počítačový virus",
            },
            {
                term: /sabotova(li|t) letiště/,
                operation: "Sabotovat letiště",
            },
            {
                term: /rozšíři(li|t) epidemii/,
                operation: "Rozšířit epidemii",
            },
            {
                term: /demoralizova(li|t) obyvatele/,
                operation: "Demoralizovat obyvatele",
            },
            {
                term: /zniči.*raket/,
                operation: "Zničit rakety",
            },

            // loupezive
            {
                term: /vykr(a|á)(dli|st) sklady/,
                operation: "Vykrást sklady",
            },
            {
                term: /vykr(a|á)(dli|st) centrální banku/,
                operation: "Vykrást centrální banku",
            },
            {
                term: /napích(li|nout) ropovod/,
                operation: "Napíchnout ropovod",
            },
            {
                term: /ukr(a|á)(st|dli) (celkem )?(\d)*( )?technologi(í|e)/,
                operation: "Ukrást technologie",
            },
            {
                term: /prod(a|á)(vá|t) drogy/,
                operation: "Prodat drogy",
            },

            // TODO zbytek sabotaznich:
            {
                term: " ",
                operation: "Jiné",
            },
        ];

        const steal_operation_types = [Operation["Vykrást sklady"], Operation["Vykrást centrální banku"], Operation["Napíchnout ropovod"], Operation["Ukrást technologie"], Operation["Prodat drogy"]];

        let country_id;
        let current_page;
        let last_message_time = null;
        let fetch_until_time = null;
        let spy_success_stats;
        let spy_operation_stats;
        let spy_stolen_stats;

        let button = null;

        function initValues(_country_id) {
            country_id = _country_id;
            current_page = 0;
            last_message_time = null;
            fetch_until_time = null;
            current_page = 0;
            spy_stolen_stats = [];
            spy_operation_stats = [];
            spy_success_stats = [];
        }

        function save() {
            const stats = getSetting(COUNTRY_STATS, []);

            let relevant_stats = stats.find((country_stats) => country_stats.country_id === country_id);
            if (relevant_stats === undefined) {
                relevant_stats = {
                    country_id,
                };
                stats.push(relevant_stats);
            }

            relevant_stats.spy_stats = {
                success_stats: spy_success_stats,
                operation_stats: spy_operation_stats,
                stolen_stats: spy_stolen_stats,
                last_message: last_message_time,
                // spy_messages: archive_spy.messages,
            };

            setSetting(COUNTRY_STATS, stats);
        }

        async function processSpyArchive(is_ally, force_all = false) {
            const country_stats = getCountryStats(country_id);

            if (country_stats !== undefined && !force_all) {
                let spy_stats = country_stats.spy_stats;
                spy_success_stats = spy_stats.success_stats;
                spy_operation_stats = spy_stats.operation_stats;
                spy_stolen_stats = spy_stats.stolen_stats;

                let time = spy_stats.last_message;
                fetch_until_time = time ? archiveGetTimeInMillis(time) : null;
            }

            let message_count = 0;
            let url = URL;
            if (is_ally) {
                url = ALLY_URL.replace("$country_id$", country_id);
            }

            do {
                message_count = await fetchPage(url + current_page++ * MESSAGES_PER_PAGE, processArchivePage);
                if (button !== null) {
                    button.textContent = `Probíhá... ${current_page}`;
                }
            } while (message_count === MESSAGES_PER_PAGE);
        }

        function isNewerMessage(row) {
            const time = row.cells[0].textContent;
            const time_in_millis = archiveGetTimeInMillis(time);
            if (fetch_until_time && fetch_until_time === time_in_millis) {
                return false;
            }
            return true;
        }

        function getOperationId(original_message) {
            for (let index = 0; index < OPERATION_SEARCH_TERMS.length; index++) {
                const search_term = OPERATION_SEARCH_TERMS[index];
                if (original_message.match(search_term.term) !== null) {
                    return Operation[search_term.operation];
                }
            }
            return null;
        }

        async function addStolenData(clean_message, operation_id, targetted_country_id) {
            const stolen_amount = await getStolenData(clean_message, operation_id);
            if (stolen_amount === null) return;
            const operation_stats = getStolenStats(operation_id);
            const target_country_stats = getStolenStatsForTargetCountry(operation_stats, targetted_country_id);
            target_country_stats.per_operation.push(stolen_amount);
        }

        function getOperationStats(operation_id) {
            return findStats(spy_operation_stats, "operation_id", operation_id, { operation_id, count: 0, success: 0 });
        }

        function getStolenStats(operation_id) {
            return findStats(spy_stolen_stats, "operation_id", operation_id, { operation_id, values: [] });
        }

        function getStolenStatsForTargetCountry(operation_stats, targetted_country_id) {
            return findStats(operation_stats.values, "country_id", targetted_country_id, { country_id: targetted_country_id, per_operation: [] });
        }

        function getSuccessStats(difficulty) {
            return findStats(spy_success_stats, "difficulty_id", difficulty, { difficulty_id: difficulty, count: 0, success: 0 });
        }

        function findStats(stats, key, id, blank_object) {
            let result = stats.find((stat) => stat[key] === id);
            if (result === undefined) {
                result = blank_object;
                stats.push(result);
            }
            return result;
        }

        function getCleanMessage(cell) {
            let text = "";
            for (let i = 0; i < cell.childNodes.length; i++) {
                if (cell.childNodes[i].nodeType === Node.TEXT_NODE) {
                    text += cell.childNodes[i].textContent;
                }
            }
            return text;
        }

        async function processRow(row) {
            const original_message = row.cells[1].textContent;
            const clean_message = getCleanMessage(row.cells[1]);

            if (original_message.indexOf("Operace byla ") == -1) {
                return null;
            }

            const targetted_country_id = original_message.match(/(?<=\(#)\d+(?=\))/g)[0];

            const difficulty_text = original_message.split("Operace byla ")[1].split(".")[0];
            const difficulty = SpyDifficulty[difficulty_text] || 1;

            const failed_operation = original_message.indexOf("nepodařilo") !== -1;

            let difficulty_results = getSuccessStats(difficulty);
            difficulty_results.count++;
            if (!failed_operation) difficulty_results.success++;

            const operation_id = getOperationId(original_message);

            const operation_stats = getOperationStats(operation_id);
            operation_stats.count++;

            if (failed_operation) return;

            operation_stats.success++;

            if (steal_operation_types.includes(operation_id)) {
                await addStolenData(clean_message, operation_id, targetted_country_id);
            }
        }

        async function processArchivePage(doc) {
            let tables = doc.getElementsByClassName("vis_tbl");
            let table = null;
            for (let i = 0; i < tables.length; i++) {
                if (tables[i].rows.length > 2 && tables[i].rows[0].cells.length >= 2) {
                    table = tables[i];
                    break;
                }
            }

            if (table === null) {
                return;
            }

            let rows = table.rows;
            if (last_message_time === null) {
                last_message_time = rows[1].cells[0].textContent;
            }
            for (let i = 1; i < rows.length; i++) {
                if (!isNewerMessage(rows[i])) return;
                await processRow(rows[i]);
            }

            return table.rows.length - 1;
        }

        async function transformNumbersTechy(numbers) {
            const tech_prices = await technology_prices.get();
            for (let i = 0; i < numbers.length; i++) {
                numbers[i] = tech_prices[i] * Number(numbers[i]);
            }
            return numbers;
        }

        function transformNumbersEnergy(numbers) {
            const energy_price = getSetting(ENERGY_PRICE, 15);
            return transformNumbers(numbers, energy_price);
        }

        function transformNumbersFood(numbers) {
            const food_price = getSetting(FOOD_PRICE, 15);
            return transformNumbers(numbers, food_price);
        }

        function transformNumbers(numbers, price) {
            for (let i = 0; i < numbers.length; i++) {
                numbers[i] = price * Number(numbers[i]);
            }
            return numbers;
        }

        async function getStolenData(clean_message, operation_id) {
            let numbers = clean_message.match(/(?<!\(#)\d+(?!\))/g);
            switch (operation_id) {
                case Operation["Napíchnout ropovod"]:
                    numbers = transformNumbersEnergy(numbers);
                    break;
                case Operation["Vykrást sklady"]:
                    numbers = transformNumbersFood(numbers);
                    break;
                case Operation["Ukrást technologie"]:
                    numbers = await transformNumbersTechy(numbers);
                    break;
                default:
                    numbers = clean_message.match(/(?<!\(#)\d{3,}(?!\))/g);
            }

            if (numbers === null) {
                return null;
            }
            const sum = numbers.reduce((acc, n) => acc + Number(n), 0);
            return sum;
        }

        return {
            OPERATION_SEARCH_TERMS,
            spy_success_stats() {
                return spy_success_stats;
            },
            last_message_time() {
                return last_message_time;
            },
            async processSpyArchive(country_id, is_ally = false, force_all = false, reload_page = false, _button = null) {
                initValues(country_id);
                button = _button;
                if (button !== null) {
                    button.textContent = "Probíhá...";
                }
                await processSpyArchive(is_ally, force_all);
                save();

                if (reload_page) {
                    refreshPage();
                }
            },
            // spy_operation_stats: spy_operation_stats
        };
    })();

    function modifyTechnologyPage() {
        if (!getSetting(TECHNOLOGY_ALLOW_CHANGES, true)) {
            return;
        }

        const h1 = document.getElementsByTagName("h1")[0];
        if (h1.textContent.trim() != "Technologie") {
            return;
        }

        let content = document.getElementById("icontent");

        let form = document.forms.nastavit;

        let button = createButton("Reset všechny techy", resetAll);
        content.insertBefore(button, form);

        button = createButton("Reset hospo techy", resetEconomicTechnologies);
        content.insertBefore(button, form);

        button = createButton("Reset vojenské techy", resetMilitaryTechnologies);
        content.insertBefore(button, form);

        function resetEconomicTechnologies() {
            let elements = getFormInputElements();
            for (let i = 0; i < elements.length / 2; i++) {
                elements[i].value = 0;
            }
        }

        function resetMilitaryTechnologies() {
            let elements = getFormInputElements();
            for (let i = elements.length / 2; i < elements.length; i++) {
                elements[i].value = 0;
            }
        }

        function resetAll() {
            resetEconomicTechnologies();
            resetMilitaryTechnologies();
        }

        function getFormInputElements() {
            return document.querySelectorAll("input.ushort");
        }
    }

    function modifyAdvancements() {
        if (!getSetting(MODIFY_ADVANCEMENTS, true)) {
            return;
        }

        execute();

        function execute() {
            const table = getAdvancementTable();
            if (table === null) {
                return;
            }

            const show_base_price = getSetting(ADV_SHOW_BASE_PRICE, true);
            const show_min_price = getSetting(ADV_SHOW_MIN_PRICE, true);
            const show_current_price = getSetting(ADV_SHOW_CURRENT_PRICE, true);

            const difficulty = getCurrentTechnologicalDifficulty();

            if (show_base_price) {
                CssHelper.addTooltipCss(300);
            }

            for (let index = 1; index < table.rows.length; index++) {
                const row = table.rows[index];

                const type = getAdvancementType(row);
                const advancement_name = getAdvancementName(row);

                const current_price_element = getCurrentPriceElement(row);
                const current_price = getCurrentPrice(current_price_element);
                const times_researched = getTimesResearched(row);
                formatValueOnElement(current_price_element);

                const price_reduction = getPriceReduction(row, type);
                let elements = [];
                if (show_base_price) {
                    elements.push(addBasePrice(current_price_element, current_price, price_reduction, difficulty, advancement_name));
                }

                if (type == AdvancementHelper.types.S) {
                    continue;
                }

                if (show_min_price) {
                    elements.push(addMinPrice(current_price_element, current_price, price_reduction, difficulty, type, advancement_name, times_researched));
                }
                if (show_current_price) {
                    addPriceReduction(current_price_element, price_reduction);
                }
                mergeTooltips(elements);
            }
        }

        function mergeTooltips(elements) {
            if (elements.length < 2) {
                return;
            }

            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (!element.classList.contains("tooltiptext")) return;
            }

            let content = "";
            for (let index = 1; index < elements.length; index++) {
                const element = elements[index];
                content += "<p>" + element.innerHTML + "</p>";
                element.remove();
            }

            const tooltip = elements[0];
            tooltip.innerHTML += content;
        }

        function getPriceReduction(row, type) {
            if (type == AdvancementHelper.types.S || type == AdvancementHelper.types["K-"]) {
                return 100;
            }

            const country_count = Number(row.cells[3].textContent);
            return getPrice(type, country_count);
        }

        function getPrice(type, countries) {
            if (type == AdvancementHelper.types.S || type == AdvancementHelper.types["K-"]) {
                return 100;
            }

            const reduction = AdvancementHelper.maxReduction[type].reduction;
            const countries_max = AdvancementHelper.maxReduction[type].countries;

            const base = 100 - reduction;
            const discounted = reduction * (1 - Math.min(countries / countries_max, 1));
            return base + discounted;
        }

        function getMinPrice(type) {
            if (type == AdvancementHelper.types.S || type == AdvancementHelper.types["K-"]) {
                return 100;
            }

            return getPrice(type, AdvancementHelper.maxReduction[type].countries);
        }

        function getAdvancementType(row) {
            let value = row.cells[0].textContent.match(/\([TSK-]*\)/g)[0];
            return value.slice(1).slice(0, -1);
        }

        function getAdvancementName(row) {
            const cell = row.cells[0];
            const child_nodes = cell.childNodes;
            return child_nodes[child_nodes.length - 1].textContent.split(" (")[0].trim();
        }

        function addPriceReduction(element, price_reduction) {
            const wrapper = createElement("i", { textContent: "Aktuální cena pokroku je: " + Math.round(price_reduction * 10) / 10 + "%" });

            const parent = element.parentElement.parentElement;
            const sibling = element.parentElement.nextSibling;
            if (sibling) {
                parent.insertBefore(wrapper, sibling);
            } else {
                parent.appendChild(wrapper);
            }

            return wrapper;
        }

        function addMinPrice(current_price_element, current_price, price_reduction, difficulty, type, advancement_name, times_researched) {
            let min_price = 0;

            if (AdvancementHelper.advancementExceptions[advancement_name] !== undefined) {
                let exception = AdvancementHelper.advancementExceptions[advancement_name];

                min_price = exception.minimum_price;
                if (exception.per_country_price) {
                    let extra_price = exception.per_country_price * times_researched;

                    if (exception.cap_price && exception.cap_price <= min_price + extra_price) {
                        min_price = exception.cap_price;
                    } else {
                        min_price += extra_price;
                    }
                }

                if (!exception.not_affected_by_difficulty) {
                    min_price = min_price * difficulty;
                }
            } else {
                min_price = (current_price / price_reduction) * getMinPrice(type);
            }

            const element = addPriceValue(current_price_element, min_price, "Minimální cena");
            if (getSetting(ADV_SHOW_MIN_PRICE_IN_TOOLTIP, false)) {
                element.classList.add("center");
                wrapInTooltip(element);
            }
            return element;
        }

        function addBasePrice(current_price_element, current_price, current_reduction, difficulty, advancement_name) {
            let base_price = 0;

            if (AdvancementHelper.advancementExceptions[advancement_name] !== undefined) {
                base_price = AdvancementHelper.advancementExceptions[advancement_name].base_price;
            } else {
                base_price = getBasePrice(current_price, current_reduction, difficulty);
            }

            const element = addPriceValue(current_price_element, base_price, "Základní cena");
            if (getSetting(ADV_SHOW_BASE_PRICE_IN_TOOLTIP, true)) {
                element.classList.add("center");
                wrapInTooltip(element);
            }
            return element;
        }

        function getCurrentPrice(current_price_element) {
            return Number(current_price_element.textContent);
        }

        function getCurrentPriceElement(row) {
            return row.getElementsByTagName("em")[0];
        }

        function getTimesResearched(row) {
            return Number(row.cells[3].textContent);
        }

        function formatValueOnElement(current_price_element) {
            const current_price = Number(current_price_element.textContent);
            current_price_element.textContent = formatNumber(current_price);
        }

        function addPriceValue(element, value, label = "") {
            const wrapper = createElement("p", { className: "imprp" });

            const i = createElement("i");
            wrapper.appendChild(i);

            const em = createElement("em", { textContent: formatNumber(value.toFixed(0)) });
            i.appendChild(em);

            i.innerHTML = label + ": " + i.innerHTML + " " + element.nextSibling.textContent;

            const parent = element.parentElement.parentElement;
            const sibling = element.parentElement.nextSibling;
            if (sibling) {
                parent.insertBefore(wrapper, sibling);
            } else {
                parent.appendChild(wrapper);
            }

            return wrapper;
        }

        function getBasePrice(current_price, current_reduction, difficulty) {
            return ((current_price / current_reduction) * 100) / difficulty;
        }

        function getAdvancementTable() {
            let tables = document.getElementsByClassName("vis_tbl");
            let table = null;
            for (let i = 0; i < tables.length; i++) {
                if (tables[i].rows[0].cells[0].textContent == "Pokrok") {
                    table = tables[i];
                    break;
                }
            }
            return table;
        }

        function getCurrentTechnologicalDifficulty() {
            let elements = document.querySelectorAll(".infotext strong");

            let difficulty = null;
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].textContent.indexOf("Náročnost pokroků je") !== -1) {
                    const parts = elements[i].textContent.split(" ");
                    difficulty = Number(parts[parts.length - 1]);
                    break;
                }
            }
            return difficulty;
        }
    }

    class ValkaHelper {
        static get rychlost_dopripravovani_za_kolo() {
            return 3;
        }
        static get vyssi_dopriprava_nad_pripravenosti() {
            return 10;
        }
    }

    function modifyValka() {
        let last_production_table = null;
        let warning_message_element = null;

        const WARNING_MESSAGE = "!!! Útokem se dopouštíte porušení pravidel VEDENÍ ALIANCE !!!";
        const BUILDINGS_LINK = "index.php?p=budovy";
        const DOTACE_LINK = "index.php?p=dotace";
        const DEMOLITION_LINK = "index.php?p=budovy&s=budobour";

        const is_show_exp_on = getSetting(STRIKE_SHOW_EXP, true);
        const is_build_stavebka_on = getSetting(STRIKE_SHOW_BUILD_BUTTON, true);
        const is_exp_general_button_on = getSetting(STRIKE_SHOW_GRANT_EXP_TO_GENERAL_BUTTON, true);
        const is_burn_land_button_on = getSetting(STRIKE_SHOW_BURN_LAND_BUTTON, false);
        const is_extra_protection_from_accidental_attacks_on = getSetting(STRIKE_WARNING_DISABLES_BUTTON, true);

        execute();

        function execute() {
            CssHelper.addSavedCss(CssHelper.styles.strike);

            if (is_show_exp_on) {
                showExp();
            }
            if (is_build_stavebka_on || is_exp_general_button_on || is_burn_land_button_on) {
                addAlternativeReadyingButtons(is_build_stavebka_on, is_exp_general_button_on, is_burn_land_button_on);
            }
            if (is_extra_protection_from_accidental_attacks_on) {
                if (hasWarningMessage()) {
                    disableButton();
                    addForceAttackButton();
                }
            }
        }

        function disableButton() {
            const button = getStrikeSubmitButton();
            button.disabled = true;
            button.classList.add("disabled");
        }

        function addForceAttackButton() {
            const warning_message = getWarningMessage();
            if (warning_message === null) {
                return;
            }

            const parent = warning_message.parentElement;
            parent.style.textAlign = "center";

            const button = createButton("Rozumím a chci pokračovat", () => {
                const btn = getStrikeSubmitButton();
                btn.disabled = false;
                btn.classList.remove("disabled");
            });
            parent.appendChild(button);
        }

        function getStrikeSubmitButton() {
            return document.forms[0].querySelector("input[type=submit]");
        }

        function getWarningMessage() {
            if (warning_message_element !== null) return warning_message_element;

            let warning_messages = document.getElementsByClassName("warn");
            if (warning_messages.length == 0) return null;

            for (let index = 0; index < warning_messages.length; index++) {
                const element = warning_messages[index];
                if (element.textContent == WARNING_MESSAGE) {
                    warning_message_element = element;
                    break;
                }
            }

            return warning_message_element;
        }

        function hasWarningMessage() {
            return getWarningMessage() !== null;
        }

        function showExp() {
            const strong_elements = document.getElementsByTagName("strong");
            let experience_element = null;

            for (let i = 0; i < strong_elements.length; i++) {
                if (strong_elements[i].nextSibling && strong_elements[i].nextSibling.textContent == " zkušeností.") {
                    experience_element = strong_elements[i];
                    break;
                }
            }

            if (experience_element === null) {
                return;
            }

            const experience = Number(experience_element.textContent);
            const turns_played = getPlayedTurns();
            const pripravenost = getCombatReadiness();

            const turns_to_full = getTurnsToBeCombatReady(pripravenost, true);
            const turns_to_less_than_3 = getTurnsToBeCombatReady(pripravenost, false);

            const experience_to_full = getExperiencePerTurn(experience, turns_played + turns_to_full);

            let break_element = createElement("br");
            experience_element.parentElement.insertBefore(break_element, experience_element.nextSibling.nextSibling);

            const element = addResults("Zkušeností / kolo: ", experience_to_full, break_element);

            if (turns_to_full != turns_to_less_than_3) {
                const experience_to_less_than_3 = getExperiencePerTurn(experience, turns_played + turns_to_less_than_3);
                addResults("Zkušeností za kolo (<3%): ", experience_to_less_than_3, element);
            }
        }

        function getPlayedTurns() {
            let tables = document.getElementsByClassName("vis_tbl");
            let turns = 0;

            for (let index = 0; index < tables.length; index++) {
                const table = tables[index];
                if (table.rows[0].cells[0].textContent == "Peníze") {
                    last_production_table = table;
                    turns++;
                }
            }

            return turns;
        }

        function getCombatReadiness() {
            if (!last_production_table) {
                log("Není uložená poslední tabulka.");
                return 100;
            }

            return 100 - Number(last_production_table.rows[2].cells[5].textContent.slice(0, -1));
        }

        function getTurnsToBeCombatReady(pripravenost, doFull = true) {
            let turns = 0;

            if (pripravenost > 10) {
                const per_turn = ValkaHelper.rychlost_dopripravovani_za_kolo + 1;
                turns = Math.ceil((pripravenost - ValkaHelper.vyssi_dopriprava_nad_pripravenosti) / per_turn);
                pripravenost -= turns * per_turn;
            }

            if (doFull) {
                turns += Math.ceil(pripravenost / ValkaHelper.rychlost_dopripravovani_za_kolo);
            } else {
                turns += Math.floor(pripravenost / ValkaHelper.rychlost_dopripravovani_za_kolo);
            }

            return turns;
        }

        function getExperiencePerTurn(experience, turns) {
            return (experience / turns).toFixed(0);
        }

        function addResults(label, experience, insertBeforeElement) {
            const p = createElement("p", { textContent: label, style: "margin-left: 1ch;" });

            p.appendChild(createElement("strong", { textContent: experience }));

            const parent = insertBeforeElement.parentElement;
            parent.insertBefore(p, insertBeforeElement.nextSibling);

            return p;
        }

        function addAdvisedToBuildSymbol(button, advised) {
            const text = ["✔", "✖"];
            const colors = ["lime", "red"];
            const index = advised ? 0 : 1;
            button.appendChild(createElement("span", { textContent: text[index], style: `margin-left: 1ch; color: ${colors[index]};` }));
        }

        function createButtonPostavitStavebku(advised = false) {
            const button = createButton("Postavit stavebku");
            button.addEventListener("click", () => {
                sendPost(BUILDINGS_LINK, buildStavebkuCallback, "doAction=build&vlgsc=&rsdsc=&comsc=&farmsc=&labsc=&fctrsc=&brcksc=&plntsc=&entzsc=&mlbsc=&cssc=1*&expKola=1");
            });
            addAdvisedToBuildSymbol(button, advised);
            addDoubleClickProtection(button);
            return button;
        }

        function createButtonGrantExpToGeneral(advised = false) {
            const button = createButton("Dotovat generála");
            button.addEventListener("click", () => {
                sendPost(DOTACE_LINK, dotaceGeneralaCallback, "action=Dotovat&kol=1&typdotaci=11");
            });
            addAdvisedToBuildSymbol(button, advised);
            addDoubleClickProtection(button);
            return button;
        }

        function createButtonBurnLand() {
            const button = createButton("Spálit území");
            button.addEventListener("click", () => {
                sendPost(DEMOLITION_LINK, burnLandCallback, `action=${encodeURIComponent("Zničit budovy")}&vlgsc=&rsdsc=&comsc=&farmsc=&labsc=&fctrsc=&brcksc=&plntsc=&entzsc=&mlbsc=&cssc=&freec=99999`);
            });
            addDoubleClickProtection(button);
            return button;
        }

        function addAlternativeReadyingButtons(is_build_stavebka_on, is_exp_general_button_on, is_burn_land_button_on) {
            const table = document.getElementById("war-summary");
            if (table === null) {
                return;
            }

            const cell = table.rows[0].cells[0];
            const dopripravit = cell.children[0];

            if (dopripravit == null) {
                return;
            }

            if (dopripravit.value != "Dopřipravit armádu") {
                return;
            }

            const advised_to_build = getAdvisedToBuild();
            if (is_build_stavebka_on) cell.appendChild(createButtonPostavitStavebku(advised_to_build));
            if (is_exp_general_button_on) cell.appendChild(createButtonGrantExpToGeneral(advised_to_build));
            if (is_burn_land_button_on) cell.appendChild(createButtonBurnLand());
        }

        function getAdvisedToBuild() {
            const bonuses_table = document.getElementById("war-bonuses");
            if (bonuses_table === null) {
                return false;
            }

            const combat_readiness = -Number(bonuses_table.rows[1].cells[1].innerText.slice(0, -1));
            if (combat_readiness < 10) return false;
            if (combat_readiness == 10) {
                return true;
            }
            const left_over_readiness = (combat_readiness - 10) % 4;
            return left_over_readiness == 1 || left_over_readiness == 0;
        }

        function dotaceGeneralaCallback(dom) {
            const warn_element = dom.getElementsByClassName("warn");
            const goodevent_elements = dom.getElementsByClassName("goodevent");
            const elements = [];

            for (let index = 0; index < goodevent_elements.length; index++) {
                if (goodevent_elements[index].textContent.startsWith("Generál")) {
                    elements.push(goodevent_elements[index]);
                }
            }

            for (let index = 0; index < warn_element.length; index++) {
                elements.push(warn_element[index]);
            }

            addResponse(elements);
        }

        function buildStavebkuCallback(dom) {
            const warn_element = dom.getElementsByClassName("warn")[0];
            const goodmsg_element = dom.getElementsByClassName("goodmsg")[0];

            addResponse([goodmsg_element, warn_element]);
        }

        function burnLandCallback(dom) {
            let element = dom.getElementsByClassName("infomsg")[0];
            addResponse([element]);
        }

        function addResponse(elements) {
            const header = document.getElementsByTagName("h1")[0];
            const sibling = header.nextElementSibling;

            const icontent = header.parentElement;
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                icontent.insertBefore(element, sibling);
            }
        }
    }

    function fetchPage(url, callback) {
        return new Promise((resolve) => {
            let req = new XMLHttpRequest();
            req.open("GET", url);
            req.onload = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(req.response, "text/html");

                    resolve(callback(doc));
                }
            };
            req.send();
        });
    }

    function sendPost(theUrl, callback, params) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                const dom = new DOMParser().parseFromString(xmlHttp.responseText, "text/html");
                callback(dom);
            }
        };
        xmlHttp.open("POST", theUrl, true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xmlHttp.send(params);
    }

    async function processSpyArchiveForAlliance(button) {
        button.textContent = "Probíhá...";

        let country_ids = await fetchCountryIds();
        button.textContent = `Probíhá... 0 / ${country_ids.length}`;
        for (let index = 0; index < country_ids.length; index++) {
            const country_id = country_ids[index];
            await archive_spy.processSpyArchive(country_id, true, false, false);

            updateProgressBackground(button, index, country_ids.length);
        }

        refreshPage();
    }

    function updateProgressBackground(button, completed, total) {
        button.textContent = "Probíhá ... " + (completed + 1) + " / " + total;
        const progress = Math.floor(((completed + 1) / total) * 100);

        let background = "chocolate";
        if (progress < 100) {
            background = `linear-gradient(to right, chocolate ${progress}%, #363636 ${progress}%)`;
        }
        button.style.background = background;
    }

    function fetchCountryIds() {
        const URL = "index.php?p=detaily&s=detaily&adetaily=true";
        return fetchPage(URL, getCountryIdsCallback);
    }

    function getCountryIdsCallback(doc) {
        let country_ids = [];

        let table = doc.forms[0].children[0];
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const img = row.querySelector("img");
            if (img === null) {
                continue;
            }
            const country_id = Number(img.parentElement.href.split("to_id=")[1]);
            country_ids.push(country_id);
        }

        return country_ids;
    }

    function getCountryStats(country_id) {
        const all_country_stats = getSetting(COUNTRY_STATS, []);
        if (typeof all_country_stats == "object" && all_country_stats != null && !Array.isArray(all_country_stats)) {
            resetCountryStats();
            return undefined;
        }

        return all_country_stats.find((stats) => stats.country_id === country_id);
    }

    function archiveGetTimeInMillis(time) {
        let date = archiveProcessTime(time);
        return date.getTime();
    }

    function archiveProcessTime(time) {
        let parts = time.split(" ");

        let date_parts = parts[0].split(".");
        let date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);

        let hour_parts = parts[1].split(":");

        date.setHours(hour_parts[0], hour_parts[1], hour_parts[2]);
        return date;
    }

    function countryDetailGetCountryId() {
        let mail_to = document.querySelector(".vis_tbl td:nth-child(2) a");
        return Number(mail_to.href.split("id=")[1]);
    }

    function getAliInformation(doc) {
        const separator = ",";
        const allowed_cards = ["G", "F", "S", "Q", "P", "Z", "R"];
        const rocket_cards = ["L", "B", "N"];
        const cards_to_replace = {
            "?": "Q",
        };
        const REGIMES = {
            Feud: "e",
            Demo: "d",
            Rep: "r",
            Tech: "t",
            Fund: "f",
            Anar: "a",
            Kom: "k",
            Dikt: "i",
            Utop: "u",
            Robo: "b",
        };

        let cards = new Map(),
            regimes = new Map(),
            rockets = new Map();

        return execute(doc);

        function execute(doc) {
            const table = getMembersTable(doc);
            processTable(table);
            const wars = getWarsData(doc);

            const cards_result = transformMapToString(cards);
            const regimes_result = transformMapToString(regimes);
            const rockets_result = transformMapToString(rockets);

            return { cards: cards_result, regimes: regimes_result, rockets: rockets_result, wars };
        }

        function transformMapToString(map) {
            let result = Array.from(map, ([key, value]) => ({ key, value }));
            result = result.sort((a, b) => b.value - a.value);
            return result.reduce((value, current_value) => value + current_value.key + current_value.value + separator, "").slice(0, -1);
        }

        function processTable(table) {
            if (table === null) throw new Error("Není tabulka v detailu aliance");
            for (let i = 1; i < table.rows.length - 2; i++) {
                processRow(table.rows[i]);
            }
        }

        function processRow(row) {
            addRegimeFromRow(row);
            processCards(row);
        }

        function cardName(card) {
            return card in cards_to_replace ? cards_to_replace[card] : card;
        }

        function getWarsData(doc) {
            const table = doc.getElementById("find-treaties-wars");
            if (!table) return "";

            const ali_tag = getAliTag(doc);

            const wars = new Map();
            for (let i = 1; i < table.rows.length; i++) {
                const row = table.rows[i];
                const cells = row.cells;
                if (cells[0].colSpan > 1) continue; // is war description = skip

                const declarant = cells[0].children[0].textContent.trim();
                const declaree = cells[0].children[1].textContent.trim();
                const ali = ali_tag == declarant ? declaree : declarant;
                const age = getDeclarationAge(cells[2].textContent);

                if (!wars.has(ali)) {
                    wars.set(ali, { age });
                } else {
                    const war = wars.get(ali);
                    war.kotva = true;
                    war.age = Math.max(war.age, age);
                }
            }

            const war_data = function () {
                return { count: 0, kotev: 0 };
            };
            let wars_simplified = [war_data(), war_data(), war_data(), war_data()];
            for (let [, war] of wars) {
                const age = Math.min(war.age, 3);
                wars_simplified[age].count++;
                if (war.kotva) {
                    wars_simplified[age].kotev++;
                }
            }

            let result = "";
            for (let i = 0; i < wars_simplified.length; i++) {
                if (wars_simplified[i].count === 0) continue;
                result += wars_simplified[i].count + "x" + i + "x" + wars_simplified[i].kotev + ",";
            }
            result = result.slice(0, -1);

            return result;
        }

        function getDeclarationAge(text) {
            const numbers = text.match(/\d+/g);
            const day = numbers[0];
            const month = numbers[1];
            const hours = numbers[2];
            const minutes = numbers[3];

            const date = new Date();
            date.setDate(day);
            date.setMonth(month - 1);
            date.setHours(hours);
            date.setMinutes(minutes);

            const current_time = new Date();

            if (current_time - date < 0) date.setFullYear(date.getFullYear() - 1);

            return Math.floor((current_time - date) / 1000 / 60 / 60 / 24);
        }

        function getAliTag(doc) {
            const table = doc.getElementById("find-alliance-summary");
            return table.rows[0].cells[1].textContent.match(/(?<=\[).*(?=\])/g)[0];
        }

        function processCards(row) {
            const cell = row.cells[9];

            if (!cell.children) return;

            let allowed_types = allowed_cards.concat(rocket_cards);

            for (let index = 0; index < cell.children.length; index++) {
                const element = cell.children[index];

                let card_type = cardName(element.alt.slice(1, -1));
                if (allowed_types.indexOf(card_type) == -1) {
                    continue;
                }

                let map = cards;
                if (rocket_cards.indexOf(card_type) != -1) map = rockets;

                let count = map.get(card_type);
                if (count === undefined) {
                    count = 0;
                }
                map.set(card_type, count + 1);
            }
        }

        function addRegimeFromRow(row) {
            const cell = row.cells[6];
            const regime = cell.textContent;

            let regime_value = REGIMES[regime];
            if (regime_value === undefined) {
                throw new Error("Neznámá vláda - " + regime);
            }

            let count = regimes.get(regime_value);
            if (count === undefined) {
                count = 0;
            }

            regimes.set(regime_value, count + 1);
        }

        function getMembersTable(doc) {
            return doc.getElementById("alliance-members");
        }
    }

    function modifyAliZebricek() {
        if (!getSetting(ALI_ALLOW_CHANGES, true)) return;

        const FULL_SEPARATOR = "*||*";
        const SEPARATOR = "*|*";
        const URL = "index.php?p=najit&s=najittag&tag=";
        const EXCEPTION_ALI_TAG = "ADMINS";
        const REGIMES = {
            e: "Feud",
            d: "Demo",
            r: "Rep",
            t: "Tech",
            f: "Fund",
            a: "Anar",
            k: "Kom",
            i: "Dikt",
            u: "Utop",
            b: "Robo",
        };

        // icon constants
        const background_colors = ["rgb(0, 255, 0)", "rgb(255, 255, 0)", "rgb(255, 128, 0)", "rgb(0, 0, 0)"];
        const age_values = ["<24", "24-48", "48-72", ">72"];

        const show_wars_with_anchors = getSetting(ALI_WARS_WITH_ANCHORS, true);

        const filter_buttons = [];
        const table_data = [];

        execute();

        async function execute() {
            const table = getTable();
            if (table === null) {
                return;
            }

            const saved_information = getAllSavedInformations();

            addControls(table, saved_information);
            saveDataRows(table, saved_information);
            if (getSetting(ALI_SHOW_CARDS, true)) {
                addCards(table, saved_information);
            }
            if (getSetting(ALI_SHOW_REGIME, true)) {
                addRegimes(table, saved_information);
            }
            if (getSetting(ALI_SHOW_ROCKETS, true)) {
                addRockets(table, saved_information);
            }
            if (getSetting(ALI_SHOW_WARS, true)) {
                addWars(table, saved_information);
            }
            if (getSetting(ALI_SHOW_FILTER, true)) {
                addFilter();
            }
        }

        function addCards(table, saved_information) {
            addColumn(table, saved_information, { header_text: "Kartičky", type: "cards", callback: cardContentCallback });
        }

        function addRockets(table, saved_information) {
            addColumn(table, saved_information, { header_text: "Rakety", type: "rockets", callback: cardContentCallback });
        }

        function addRegimes(table, saved_information) {
            CssHelper.addTooltipCss(60);
            addColumn(table, saved_information, { header_text: "Vlády", type: "regimes", callback: regimeContentCallback });
        }

        function addWars(table, saved_information) {
            addColumn(table, saved_information, { header_text: "Války", type: "wars", callback: warsContentCallback });
        }

        function saveDataRows(table, saved_information) {
            if (saved_information.length == 0) return;

            for (let index = 1; index < table.rows.length; index++) {
                const row = table.rows[index];
                const ali_tag = getAliTag(row);
                const ali_information = saved_information.filter((ali_information) => ali_information.tag === ali_tag)[0];
                if (ali_information === undefined) {
                    continue;
                }

                const cards_data = (ali_information.cards + "," + ali_information.rockets).split(",");
                const wars_data = ali_information.wars.split(",");
                const data = [];

                cards_data.forEach((card_data) => {
                    if (card_data.length == 0) return;

                    const card_type = card_data.slice(0, -1);
                    const card_count = card_data.slice(-1);
                    data[card_type] = Number(card_count);
                });

                let war_count = 0;
                wars_data.forEach((war_data) => {
                    if (war_data.length == 0) return;

                    const parts = war_data.split("x");

                    data["war-" + parts[1]] = Number(parts[0]);
                    war_count += Number(parts[0]);
                });

                data["war-count"] = war_count;

                table_data.push({
                    data,
                    row,
                });
            }
        }

        function addFilter() {
            let form = getSearchForm();

            if (form === null) {
                return;
            }

            CssHelper.addSavedCss(CssHelper.styles.ali_zebricek);

            const container = createElement("div", { className: "grid", style: "grid-template-columns: 1fr 1fr 1fr;" });
            form.parentElement.insertBefore(container, form);
            container.appendChild(createElement());
            container.appendChild(form);

            const filter_container = createElement("div", { className: "filter_container" });
            container.appendChild(filter_container);

            filter_container.appendChild(createElement("h2", { textContent: "Filtr kartiček" }));

            const header = createElement("div", { className: "row header" });
            filter_container.appendChild(header);
            header.appendChild(createElement("span", { textContent: "Min" }));
            header.appendChild(createElement("span", { textContent: "Max" }));

            const keys = Object.keys(ImageHelper.ICONS);
            keys.forEach((key) => {
                filter_container.appendChild(createFilterRow(key));
            });

            filter_container.appendChild(createFilterRow("war-count", createElement("span", { textContent: "-", className: "icon war_count", title: "Celkem válek" })));

            filter_container.appendChild(createFilterRow("war-0", createWarIcon({ war_age: 0, textContent: "-", is_filter: true })));
            filter_container.appendChild(createFilterRow("war-1", createWarIcon({ war_age: 1, textContent: "-", is_filter: true })));
            filter_container.appendChild(createFilterRow("war-2", createWarIcon({ war_age: 2, textContent: "-", is_filter: true })));
            filter_container.appendChild(createFilterRow("war-3", createWarIcon({ war_age: 3, textContent: "-", is_filter: true })));
        }

        function createFilterRow(key, icon = null) {
            const wrapper = createElement("div", { className: "row" });

            const input_min = createNumberInput(key + "_min", 0, 0, 10);
            input_min.addEventListener("change", () => filterRows());
            wrapper.appendChild(input_min);

            if (icon === null) {
                icon = createElement("img", { src: ImageHelper.ICONS[key], alt: key });
            }
            wrapper.appendChild(icon);

            const input_max = createNumberInput(key + "_max", 10, 0, 10);
            input_max.addEventListener("change", () => filterRows());
            wrapper.appendChild(input_max);

            filter_buttons.push({
                min: input_min,
                max: input_max,
            });

            return wrapper;
        }

        function getSearchForm() {
            if (document.forms.length == 0) return null;

            return document.forms[0];
        }

        function filterRows() {
            const filter = {};

            filter_buttons.forEach((buttons) => {
                const type = buttons.min.id.split("_")[0];
                const min = Number(buttons.min.value);
                const max = Number(buttons.max.value);

                if (min > 0 || max < buttons.max.max) {
                    filter[type] = { min, max };
                }
            });

            for (let index = 0; index < table_data.length; index++) {
                const data = table_data[index];
                const row = data.row;
                const cards_data = data.data;

                if (fitsCriteria(cards_data, filter)) {
                    row.classList.remove("fits_not");
                } else {
                    row.classList.add("fits_not");
                }
            }
        }

        function fitsCriteria(cards_data, filter) {
            const keys = Object.keys(filter);
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const min = filter[key].min;
                const max = filter[key].max;
                const count = cards_data[key] === undefined ? 0 : cards_data[key];

                if (count < min || count > max) {
                    return false;
                }
            }

            return true;
        }

        function addColumn(table, saved_information, { header_text, type, callback }) {
            const th = createElement("th", { textContent: header_text });
            table.rows[0].appendChild(th);

            for (let index = 1; index < table.rows.length; index++) {
                const row = table.rows[index];
                const ali_tag = getAliTag(row);
                const ali_information = saved_information.filter((ali_information) => ali_information.tag === ali_tag)[0];
                const cell = row.insertCell();

                if (ali_information === undefined) {
                    cell.textContent = "chybí";
                    row.classList.add("not_fetched");
                    continue;
                }

                if (ali_information[type] === "") {
                    continue;
                }

                let data = ali_information[type].split(",");
                callback(cell, data);
            }
        }

        function cardContentCallback(cell, data) {
            for (let index = 0; index < data.length; index++) {
                const value = data[index];
                const count = Number(value.slice(1));
                cell.appendChild(createElement("span", { textContent: count + "x " }));

                const icon_type = value.slice(0, 1);
                const icon = createElement("img", { src: ImageHelper.ICONS[icon_type], style: "margin-right: 5px; " });
                cell.appendChild(icon);
            }
        }

        function regimeContentCallback(cell, data) {
            const icon = createElement("span", { textContent: "?", className: "tooltip icon" });
            cell.appendChild(icon);
            cell.classList.add("c");

            const wrapper = createElement("div", { className: "tooltiptext" });
            icon.appendChild(wrapper);

            for (let index = 0; index < data.length; index++) {
                const value = data[index];
                const count = Number(value.slice(1));
                const regime = REGIMES[value.slice(0, 1)];
                wrapper.appendChild(createElement("p", { textContent: count + "x " + regime }));
            }
        }

        function warsContentCallback(cell, data) {
            let war_count = 0;

            for (let index = 0; index < data.length; index++) {
                const parts = data[index].split("x");
                const count = Number(parts[0]);
                war_count += count;

                const days = Number(parts[1]);
                const kotev = Number(parts[2]);

                if (!show_wars_with_anchors) {
                    cell.appendChild(createWarIcon({ war_age: days, textContent: count }));
                    continue;
                }

                if (kotev == 0) {
                    cell.appendChild(createWarIcon({ war_age: days, textContent: count }));
                    continue;
                }

                if (kotev == count) {
                    cell.appendChild(createWarIcon({ war_age: days, textContent: kotev, is_kotev: true }));
                    continue;
                }

                cell.appendChild(createWarIcon({ war_age: days, textContent: count - kotev }));
                cell.appendChild(createWarIcon({ war_age: days, textContent: kotev, is_kotev: true }));
            }

            const element = createElement("span", { textContent: war_count, className: "icon war_count", title: `Celkem: ${war_count} ${war_count == 1 ? "válka" : war_count > 4 ? "válek" : "války"}` });

            cell.prepend(element);
        }

        function createWarIcon({ war_age, textContent, is_kotev = false, is_filter = false }) {
            const background_color = background_colors[war_age];
            const color = war_age == 3 ? "color: white;" : "";
            const style = (is_kotev ? `background: linear-gradient(135deg, ${background_color} 50%, #99F 50%);` : `background:${background_color};`) + ` ${color}`;
            const title = is_filter ? `Celkem válek ${age_values[war_age]}` : is_kotev ? `Zakotveno: ${textContent}x ${age_values[war_age]}` : `${textContent}x ${age_values[war_age]}`;

            if (is_filter) {
                return createElement("span", { className: "icon", style, textContent, title });
            }

            return createElement("span", {
                className: "icon",
                style,
                textContent,
                title,
            });
        }

        async function resetAllInformations() {
            setSetting(ALI_SAVED_INFO, "");
            refreshPage();
        }

        function getAliTagsFromRows(rows) {
            let ali_tags = [];
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                const ali_tag = getAliTag(row);
                ali_tags.push(ali_tag);
            }

            return ali_tags;
        }

        async function fetchInformationForAliances(ali_tags, button) {
            let data = [];
            const length = ali_tags.length;
            for (let index = 0; index < length; index++) {
                if (ali_tags[index] === EXCEPTION_ALI_TAG) {
                    updateProgressBackground(button, index, length);
                    continue;
                }
                const result = await fetchInformationForAnAliance(ali_tags[index]);

                data.push(result);

                updateProgressBackground(button, index, length);
            }
            return data;
        }

        function removeDuplicates(saved_information, ali_tags) {
            for (let index = 0; index < ali_tags.length; index++) {
                const tag = ali_tags[index];
                const found_index = saved_information.findIndex((card) => card.tag === tag, tag);

                if (found_index !== -1) {
                    saved_information.splice(found_index, 1);
                }
            }
            return saved_information;
        }

        function saveInformation(saved_information, new_ali_information, ali_tags = null, remove_duplicates = false) {
            if (remove_duplicates) {
                saved_information = removeDuplicates(saved_information, ali_tags);
            }

            let result = "";
            if (saved_information.length > 0) {
                result = saved_information.reduce(
                    (acc, information) => acc + information.tag + SEPARATOR + information.cards + SEPARATOR + information.regimes + SEPARATOR + information.rockets + SEPARATOR + information.wars + FULL_SEPARATOR,
                    ""
                );
            }
            result += new_ali_information.join(FULL_SEPARATOR);
            result.slice(0, -FULL_SEPARATOR.length);

            setSetting(ALI_SAVED_INFO, result);
            refreshPage();
        }

        async function fetchMissingInformations({ table, saved_information }, e) {
            const rows = table.querySelectorAll(".not_fetched");
            const ali_tags = getAliTagsFromRows(rows);
            let ali_Information = await fetchInformationForAliances(ali_tags, e.target);

            saveInformation(saved_information, ali_Information);
        }

        async function refreshAllInformations({ table, saved_information }, e) {
            let rows = Array.from(table.rows);
            rows.shift();
            const ali_tags = getAliTagsFromRows(rows);
            let ali_Information = await fetchInformationForAliances(ali_tags, e.target);

            saveInformation(saved_information, ali_Information, ali_tags, true);
        }

        function getAllSavedInformations() {
            let saved_information = getSetting(ALI_SAVED_INFO, "");
            if (saved_information.length === 0) {
                return [];
            }
            saved_information = saved_information.split(FULL_SEPARATOR);

            const ali_informations = [];
            for (let index = 0; index < saved_information.length; index++) {
                const cards = saved_information[index];
                const parts = cards.split(SEPARATOR);

                const formatted_cards = {
                    tag: parts[0],
                    cards: parts[1],
                    regimes: parts[2],
                    rockets: parts[3],
                    wars: parts[4],
                };

                ali_informations.push(formatted_cards);
            }

            return ali_informations;
        }

        function addControls(table, saved_information) {
            const h1 = document.getElementsByTagName("h1")[0];

            const container = createElement("div", { style: "text-align: end" });
            h1.parentElement.insertBefore(container, h1.nextSibling);

            container.appendChild(createButton("Získat informace pro chybějící aliance", fetchMissingInformations, { table, saved_information }));
            container.appendChild(createButton("Získat informace o aliancích pro tuto stránku", refreshAllInformations, { table, saved_information }));
            container.appendChild(createButton("Smazat všechna data o aliancích", () => resetAllInformations()));
        }

        function getTable() {
            const tables = document.getElementsByClassName("vis_tbl");
            if (tables.length == 0) {
                return null;
            }

            for (let index = 0; index < tables.length; index++) {
                if (tables[index].rows[0].cells[1].textContent === "Aliance") {
                    return tables[index];
                }
            }

            return null;
        }

        function getAliTag(row) {
            return row.cells[1].textContent.match(/(?<=\[).+(?=\])/)[0];
        }

        async function fetchInformationForAnAliance(ali_tag) {
            const results = await fetchPage(URL + ali_tag, getAliInformation);
            return ali_tag + SEPARATOR + results.cards + SEPARATOR + results.regimes + SEPARATOR + results.rockets + SEPARATOR + results.wars;
        }
    }
    //

    function resetCountryStats() {
        setSetting(COUNTRY_STATS, []);
        refreshPage();
    }

    function refreshPage() {
        window.location.replace(location.href);
    }

    function getCurrentTimeInMillis() {
        return new Date().getTime();
    }

    function isGameOver() {
        let table = document.querySelector(".container .vis_tbl");
        if (!table) {
            return false;
        }
        return table.rows[0].children[0].innerText == "Věk skončil";
    }

    function getEnumLength(myEnum) {
        return Object.keys(myEnum).length;
    }

    function getEnumKeyByEnumValue(myEnum, enumValue) {
        const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
    }

    class ArmyUnit {
        count;
        name;
        base_wage;
        base_food_consumption;
        base_energy_consumption;
        prestige;
        total_prestige;

        wages_total;
        expenses_total;
        expenses_per_unit;
        expenses_per_prestige_point;

        attack;
        defense;

        constructor(name, count, prestige, attack = 0, defense = 0) {
            this.name = name;
            this.count = count;
            this.prestige = prestige;
            this.total_prestige = prestige * count;
            this.attack = attack;
            this.defense = defense;
        }

        setCount(count) {
            this.count = count;
            this.total_prestige = this.prestige * count;
        }
    }

    const UNITS = {
        vojaci: new ArmyUnit("Vojáci", 0, 1, 1, 1),
        tanky: new ArmyUnit("Tanky", 0, 5, 6, 4),
        stihacky: new ArmyUnit("Stíhačky", 0, 3.5, 6, 0),
        bunkry: new ArmyUnit("Bunkry", 0, 3.5, 0, 6),
        mechy: new ArmyUnit("Mechy", 0, 2.7, 2, 3),
        agenti: new ArmyUnit("Agenti", 0, 15),

        penize: new ArmyUnit("Peníze", 0, 0.002),
        jidlo: new ArmyUnit("Jídlo", 0, 0.02),
        energie: new ArmyUnit("Energie", 0, 0.02),

        uzemi: new ArmyUnit("Uzemi", 0, 15),
        budovy: new ArmyUnit("Budovy", 0, 5),
        budovy_na_ruiny: new ArmyUnit("B -> ruiny", 0, 3),
        ruiny: new ArmyUnit("Ruiny", 0, 2),
        technologie: new ArmyUnit("Technologie", 0, 1),

        get(unit_name, count = 0) {
            const unit = this[unit_name];
            unit.setCount(count);
            return unit;
        },
    };

    class AdvancementHelper {
        static get types() {
            return Object.freeze({
                T: "T",
                K: "K",
                "K-": "K-",
                S: "S",
            });
        }

        static get maxReduction() {
            return {
                T: {
                    reduction: 80,
                    countries: 80,
                },
                K: {
                    reduction: 60,
                    countries: 300,
                },
            };
        }

        static get advancementExceptions() {
            return {
                "Fúzní elektrárny": {
                    base_price: 400000,
                    minimum_price: 160000,
                    not_affected_by_difficulty: true,
                },
                "Nejvyšší budova světa": {
                    base_price: 4000000,
                    minimum_price: 4000000,
                    per_country_price: 50000,
                },
                "Vojenská akademie": {
                    base_price: 1000,
                    minimum_price: 1000,
                    per_country_price: 2,
                    cap_price: 4000,
                },
            };
        }
    }

    class ImageHelper {
        static get ICONS() {
            return {
                F: "img/f.gif",
                S: "img/x.gif",
                P: "img/p.gif",
                G: "img/gv.gif",
                R: "img/r.gif",
                Q: "img/q.gif",
                Z: "img/z.gif",
                L: "img/l.gif",
                B: "img/b.gif",
                N: "img/n.gif",
            };
        }
    }

    class CssHelper {
        static get styles() {
            return {
                ali_zebricek: `
                    .vis_tbl tr:first-child {
                        position: sticky;
                        top: 0;
                        z-index: 1;
                    }

                    .grid {
                        display: grid;
                        gap: 1rem;
                    }

                    .filter_container h2 {
                        border-bottom: 1px solid white;
                        margin-bottom: 0.5rem;
                        font-size: 1.5rem;
                        text-transform: inherit;
                        letter-spacing: 1.5px;
                    }

                    .filter_container input {
                        padding: 1px 0 1px 4px;
                        margin: 0 0.5rem;
                    }

                    .row {
                        width: fit-content;
                        margin: auto;
                        padding: 0.1rem;
                    }

                    .header {
                        width: 160px;
                        display: flex;
                        justify-content: space-around;
                        font-weight: bold;
                    }

                    .row img {
                        vertical-align: sub;
                    }

                    tr.fits_not td {
                        background: rgb(160, 20, 20);
                    }

                    .icon.war_count {
                        border-radius: unset;
                        margin-right: 0.25rem;
                    }
                `,
                archive: `
                    .row {
                        display: grid;
                        gap: 1rem;
                        grid-template-columns: 5fr 4fr 4fr;
                    }

                    .row span:first-child {
                        font-weight: bold;
                    }

                    .row span:not(:first-child) {
                        text-align: right;
                    }
                `,
                infiltration: `
                    .row {
                        display: grid;
                        gap: 1rem;
                        grid-template-columns: 4fr 1fr;
                    }

                    .row span:first-child {
                        font-weight: bold;
                    }

                    .row span:not(:first-child) {
                        text-align: right;
                    }
                `,
                settings: `
                    .icon {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        border: 1px solid black;
                        border-radius: 10px;
                        background: #aff;
                        color: black;
                        font-weight: bold;
                        text-align: center;
                    }

                    button.btn {
                        width: fit-content;
                        border-radius: 2px;
                        cursor: pointer;
                        font-weight: bold;
                        text-shadow: 0 0 5px black;
                        -webkit-transition: background-color 200ms ease-in-out;
                        -ms-transition: background-color 200ms ease-in-out;
                        transition: background-color 200ms ease-in-out, box-shadow 200ms ease-in-out;
                    }

                    .btn:hover {
                        background-color: #777;
                        box-shadow: 0 0 5px white;
                    }
                        
                    .btn.btn-close {
                        position: absolute;
                        top: 10px;
                        right: 5px;
                    }

                    .btn.btn-refresh {
                        position: absolute;
                        bottom: 5px;  
                        left: 0;
                        right: 0;
                        margin-left: auto;
                        margin-right: auto;
                        width: fit-content;
                    }

                    .overlay {
                        position: fixed;
                        height: 100%;
                        width: 100%;
                        background: black;
                        opacity: 0.3;  
                        top: 0;
                        left: 0;
                        z-index: 2;
                    }

                    .settings_window {
                        -webkit-columns: 2 auto;
                        -moz-columns: 2 auto;
                        columns: 2 auto;
                        -webkit-column-gap: 1em;
                        -moz-column-gap: 1em;
                        column-gap: 1em;
                        
                        z-index: 1000;
                        position: fixed;
                        padding: 10px 10px 35px 10px;
                        top: 130px;
                        left: 150px;
                        background: #666;
                        border: 1px solid #aaa;
                        border-radius: 5px;
                    }

                    .block {
                        display: flex;
                        flex-direction: column;
                        gap: 1px;
                        margin-bottom: 10px;
                        border: 1px solid;
                        border-top-color: #fff;
                        border-right-color: #aaa;
                        border-bottom-color: #999;
                        border-left-color: #aaa;
                        padding: 0.5rem;
                        background: #555;
                        break-inside: avoid-column;
                    }

                    .settings_window label {
                        width: fit-content;
                        text-shadow: 1px 1px 4px black;
                    }

                    .settings_window h3 {
                        margin: 0 0 6px 0;
                        font-weight: bold;
                        text-shadow: 0 0 5px black;
                    }

                    .settings_window input {
                        margin-right: 10px;
                        box-shadow: 3px 3px #555;
                    }

                    .settings_window input[type=checkbox] {
                        cursor: pointer;
                    }

                    .settings_window input[type=number] {
                        width: 8ch;
                    }

                    .hidden {
                        display: none;
                    }
                `,
                tooltip: `
                    .tooltip { position: relative; }
                    .tooltip .tooltiptext { 
                        visibility: hidden; 
                        width: $tooltip_width$px; 
                        top: 100%; 
                        left: $left$%; 
                        margin-left: -$margin_left$px; 
                        background-color: #363636; 
                        color: #fff;
                        text-align: left;
                        padding: 5px 5px;
                        margin-top: 10px;
                        border-radius: 6px;
                        border: 1px solid white;
                        position: absolute;
                        z-index: 1;
                    }
                    .tooltip .tooltiptext.center { text-align: center; }
                    .tooltip:hover .tooltiptext { visibility: visible; }
                    .tooltip .tooltiptext::after { 
                        content: ' ';
                        position: absolute;
                        bottom: 100%;
                        left: $arrow_left$%;
                        margin-left: -5px;
                        border-width: 5px;
                        border-style: solid;
                        border-color: transparent transparent white transparent;
                    }
                    .tooltiptext .header { font-weight: bold; border-bottom: 1px solid white; }
                    .tooltiptext .divider { height: 1px; width: 100%; border-bottom: 1px solid white; }
                `,
                strike: `
                    input[type=submit].disabled { background: red; border-color: black; }
                    button.submit:disabled {
                        filter: blur(0.75px);
                    }
                `,
            };
        }

        static addTooltipCss(tooltip_width = 100, to_left = false, move_to_left_percentage = 75) {
            const margin_left = to_left ? (tooltip_width * move_to_left_percentage) / 100 : tooltip_width / 2;
            const left = to_left ? move_to_left_percentage : 50;
            const arrow_left = to_left ? (50 + left) / 2 : 50;
            this.addSavedCss(CssHelper.styles.tooltip, { tooltip_width, margin_left, left, arrow_left });
        }

        static addSavedCss(css, values_to_replace = {}) {
            css = Object.keys(values_to_replace).reduce((acc, key) => {
                return acc.replaceAll(`$${key}$`, values_to_replace[key]);
            }, css);
            CssHelper.addCss(css);
        }

        static addCss(css) {
            let style = document.createElement("style");
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            document.getElementsByTagName("head")[0].appendChild(style);
        }
    }

    execute();
    //
})();
