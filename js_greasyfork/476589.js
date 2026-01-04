// ==UserScript==
// @name        drafter.gg role filtering
// @description Add role filtering to drafter.gg
// @namespace   Violentmonkey Scripts
// @version     1.2
// @license     MIT
// @grant       none
// @author      Driky
// @run-at      document-end
// @include https://drafter.gg*
// @include https://drafter.gg/simulation
// @include https://drafter.gg/draft
// @downloadURL https://update.greasyfork.org/scripts/476589/draftergg%20role%20filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/476589/draftergg%20role%20filtering.meta.js
// ==/UserScript==

const grid_selector = "html body div#root div div div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-6 div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2";
const center_part_selector = "html body div#root div div div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-6";


const TOP = 0, JUNGLE = 1, MID = 2, BOT = 3, SUPP = 4, UNKNOWN = -1, ALL = 5;
const ALL_ID = "all_button", TOP_ID = "top_button", JUNGLE_ID = "jungle_button", MID_ID = "mid_button", BOT_ID = "bot_button", SUPP_ID = "supp_button";

let champion_nodes_by_role = new Map()
champion_nodes_by_role.set(TOP, new Map());
champion_nodes_by_role.set(JUNGLE, new Map());
champion_nodes_by_role.set(MID, new Map());
champion_nodes_by_role.set(BOT, new Map());
champion_nodes_by_role.set(SUPP, new Map());
champion_nodes_by_role.set(UNKNOWN, new Map());

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getChampionRole(name){
    switch (name) {
        case "Aatrox":
        case "Akali":
        case "Camille":
        case "Chogath":
        case "Darius":
        case "DrMundo":
        case "Fiora":
        case "Gangplank":
        case "Garen":
        case "Gnar":
        case "Gragas":
        case "Gwen":
        case "Illaoi":
        case "Irelia":
        case "Jax":
        case "Jayce":
        case "Kayle":
        case "Kennen":
        case "Kled":
        case "Lillia":
        case "Malphite":
        case "Mordekaiser":
        case "Nasus":
        case "Olaf":
        case "Ornn":
        case "Quinn":
        case "Renekton":
        case "Riven":
        case "Rumble":
        case "Sejuani":
        case "Sett":
        case "Shen":
        case "Shyvana":
        case "Singed":
        case "Sion":
        case "TahmKench":
        case "Teemo":
        case "Tryndamere":
        case "Urgot":
        case "Vayne":
        case "Volibear":
        case "Wukong":
        case "Yasuo":
        case "Yone":
        case "Yorick":
            return TOP;

        case "Amumu":
        case "Briar":
        case "Belveth":
        case "Diana":
        case "Ekko":
        case "Elise":
        case "Evelynn":
        case "Fiddlesticks":
        case "Graves":
        case "Hecarim":
        case "Ivern":
        case "JarvanIV":
        case "Karthus":
        case "KSante":
        case "Kayn":
        case "Khazix":
        case "Kindred":
        case "LeeSin":
        case "Lillia":
        case "MasterYi":
        case "Naafiri":
        case "Nidalee":
        case "Nocturne":
        case "Nunu":
        case "Pantheon":
        case "Poppy":
        case "Rammus":
        case "RekSai":
        case "Rengar":
        case "Sejuani":
        case "Shaco":
        case "Shyvana":
        case "Skarner":
        case "Taliyah":
        case "Talon":
        case "Trundle":
        case "Udyr":
        case "Vi":
        case "Viego":
        case "Volibear":
        case "Warwick":
        case "MonkeyKing":
        case "XinZhao":
        case "Zac":
        case "Zed":
            return JUNGLE;


        case "Ahri":
        case "Akali":
        case "Akshan":
        case "Anivia":
        case "Annie":
        case "AurelionSol":
        case "Azir":
        case "Cassiopeia":
        case "Corki":
        case "Ekko":
        case "Fizz":
        case "Galio":
        case "Gangplank":
        case "Heimerdinger":
        case "Irelia":
        case "Kassadin":
        case "Katarina":
        case "Leblanc":
        case "Lissandra":
        case "Lux":
        case "Malzahar":
        case "Neeko":
        case "Orianna":
        case "Qiyana":
        case "Ryze":
        case "Swain":
        case "Sylas":
        case "Syndra":
        case "Taliyah":
        case "Talon":
        case "TwistedFate":
        case "Veigar":
        case "Vex":
        case "Viktor":
        case "Vladimir":
        case "Xerath":
        case "Yasuo":
        case "Yone":
        case "Zed":
        case "Ziggs":
        case "Zoe":
            return MID;

        case "Aphelios":
        case "Ashe":
        case "Caitlyn":
        case "Draven":
        case "Ezreal":
        case "Jhin":
        case "Jinx":
        case "Kaisa":
        case "Kalista":
        case "KogMaw":
        case "Lucian":
        case "MissFortune":
        case "Nilah":
        case "Samira":
        case "Sivir":
        case "Tristana":
        case "Twitch":
        case "Varus":
        case "Vayne":
        case "Xayah":
        case "Yasuo":
        case "Zeri":
        case "Ziggs":
            return BOT;

        case "Alistar":
        case "Amumu":
        case "Ashe":
        case "Bard":
        case "Blitzcrank":
        case "Brand":
        case "Braum":
        case "Janna":
        case "Karma":
        case "Leona":
        case "Lulu":
        case "Lux":
        case "Maokai":
        case "Milio":
        case "MissFortune":
        case "Morgana":
        case "Nami":
        case "Nautilus":
        case "Pantheon":
        case "Pyke":
        case "Rakan":
        case "Rell":
        case "Renata":
        case "Senna":
        case "Seraphine":
        case "Sona":
        case "Soraka":
        case "Swain":
        case "Taric":
        case "Thresh":
        case "Velkoz":
        case "Xerath":
        case "Yuumi":
        case "Zilean":
        case "Zyra":
            return SUPP;

        default:
            console.log(`UNKNOW ${name}`);
            return UNKNOWN;
    }
}

function showOnlyChampionOfRole(role){
    champion_nodes_by_role.forEach((champion_map, champion_map_key) => {
        champion_map.forEach((champion_element, champion_name_key) => {
            if(champion_element != undefined){
                if(champion_map_key == role || role == ALL){
                    champion_element.style.display = "";
                } else {
                    champion_element.style.display = "none";
                }
            }
        });
    });
}

function styleRoleElement(element, id, role, text) {
    element.id = id;
    element.style.flexBasis = "15%";
    element.style.textAlign = "center";
    element.style.backgroundColor = "grey"
    element.onclick = ()=>{showOnlyChampionOfRole(role)};
    element.textContent = text;
}

function createRoleSelectionMenu(center_part_element){
    let container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexFlow = "row";
    container.style.justifyContent = "space-evenly";

    let all_button = document.createElement("div");
    let top_button = document.createElement("div");
    let jungle_button = document.createElement("div");
    let mid_button = document.createElement("div");
    let bot_button = document.createElement("div");
    let supp_button = document.createElement("div");

    styleRoleElement(all_button, ALL_ID, ALL, "ALL");
    styleRoleElement(top_button, TOP_ID, TOP, "TOP");
    styleRoleElement(jungle_button, JUNGLE_ID, JUNGLE, "JUNGLE");
    styleRoleElement(mid_button, MID_ID, MID, "MID");
    styleRoleElement(bot_button, BOT_ID, BOT, "BOT");
    styleRoleElement(supp_button, SUPP_ID, SUPP, "SUPP");

    container.append(all_button);
    container.append(top_button);
    container.append(jungle_button);
    container.append(mid_button);
    container.append(bot_button);
    container.append(supp_button);
    center_part_element.insertBefore(container, center_part_element.firstChild);
}

function buildChampDataStruct(champions_grid_element){
    [...champions_grid_element.children].forEach((champion_element) => {
        let champion_name = champion_element.getElementsByTagName('a')[0].href;
        let champion_role;
        if(champion_name != "" && champion_name != null  && champion_name != undefined) {

        champion_name = champion_name.replace("https://drafter.gg/","").trim();
            champion_role = getChampionRole(champion_name);
        } else{
            console.log(`Tried to get champion's name and got:  ${champion_name}`);
            champion_role = UNKNOWN;
        }

        // console.log(`Adding ${champion_name} to ${champion_role}`);
        champion_nodes_by_role.get(champion_role).set(champion_name, champion_element);
    });
}

waitForElm(grid_selector).then((champions_grid_element) => {
    waitForElm(center_part_selector).then((center_part_element) => {
        buildChampDataStruct(champions_grid_element);
        createRoleSelectionMenu(center_part_element);
    });
});