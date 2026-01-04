// ==UserScript==
// @name           hwmOptimalRepairAtMarketV2
// @homepage       https://greasyfork.org/ru/scripts/491194-hwmoptimalrepairatmarketv2
// @author         Tamozhnya1, nexterot
// @namespace      nexterot
// @description    Цена боя и оптимальный слом на рынке + улучшение массовой передачи артов
// @version        31.2n2
// @include        *heroeswm.ru/*
// @include        *lordswm.com/*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant 		   GM.xmlHttpRequest
// @grant 		   GM.notification
// @license        MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @downloadURL https://update.greasyfork.org/scripts/491194/hwmOptimalRepairAtMarketV2.user.js
// @updateURL https://update.greasyfork.org/scripts/491194/hwmOptimalRepairAtMarketV2.meta.js
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
const stopwatchStartTime = Date.now();
function millisecondsIntervalToString(interval) {
    let diff = interval;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    diff -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const mimutes = Math.floor(diff / 1000 / 60);
    diff -= mimutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);
    diff -= seconds * 1000;
    const formatedTime = (days > 0 ? days + " " : "") + (hours > 0 ? hours + ":" : "") + mimutes.toString().padStart(2, "0") + ':' + seconds.toString().padStart(2, "0") + "." + diff.toString().padStart(3, "0");
    return formatedTime;
}
const LotType = { Purchase: 1, Auction: 2 };
const GoldPng = "i/r/48/gold.png";
const locations = {
    1: [50,50,"Empire Capital","EmC","Столица Империи"],
    2: [51,50,"East River","EsR","Восточная Река"],
    3: [50,49,"Tiger Lake","TgL","Тигриное Озеро"],
    4: [51,49,"Rogues' Wood","RgW","Лес Разбойников"],
    5: [50,51,"Wolf Dale","WoD","Долина Волков"],
    6: [50,48,"Peaceful Camp","PcC","Мирный Лагерь"],
    7: [49,51,"Lizard Lowland","LzL","Равнина Ящеров"],
    8: [49,50,"Green Wood","GrW","Зеленый Лес"],
    9: [49,48,"Eagle Nest","EgN","Орлиное Гнездо"],
    10: [50,52,"Portal Ruins","PoR","Руины Портала"],
    11: [51,51,"Dragons' Caves","DrC","Пещеры Драконов"],
    12: [49,49,"Shining Spring","ShS","Сияющий Родник"],
    13: [48,49,"Sunny City","SnC","Солнечный Город"],
    14: [52,50,"Magma Mines","MgM","Магма Шахты"],
    15: [52,49,"Bear Mountain","BrM","Медвежья Гора"],
    16: [52,48,"Fairy Trees","FrT","Магический Лес"],
    17: [53,50,"Harbour City","HrC","Портовый Город"],
    18: [53,49,"Mythril Coast","MfC","Мифриловый Берег"],
    19: [51,52,"Great Wall","GtW","Великая Стена"],
    20: [51,53,"Titans' Valley","TiV","Равнина Титанов"],
    21: [52,53,"Fishing Village","FsV","Рыбачье село"],
    22: [52,54,"Kingdom Castle","KiC","Замок Королевства"],
    23: [48,48,"Ungovernable Steppe","UnS","Непокорная Степь"],
    24: [51,48,"Crystal Garden","CrG","Кристальный Сад"],
    25: [53,52,"East Island","EsI","Восточный Остров"],
    26: [49,52,"The Wilderness","ThW","Дикие земли"],
    27: [48,50,"Sublime Arbor","SbA","Великое Древо"]
};
let playerLocationNumber = getPlayerLocationNumber();
if(win.sign) {
    setValue("PlayerSign", win.sign);
}
const PlayerSign = getValue("PlayerSign");
if(location.pathname == "/home.php" || location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
    if(isNewPersonPage) {
        const levelInfoCell = Array.from(document.querySelectorAll("div.home_pers_info")).find(x => x.innerHTML.includes(isEn ? "Combat level" : "Боевой уровень"));
        if(levelInfoCell) {
            setPlayerValue("PlayerLevel", parseInt(levelInfoCell.querySelector("div[id=bartext] > span").innerText));
        }
    } else {
        const levelExec = new RegExp(`<b>${isEn ? "Combat level" : "Боевой уровень"}: (\\d+?)<\\/b>`).exec(document.documentElement.innerHTML);
        if(levelExec) {
            setPlayerValue("PlayerLevel", parseInt(levelExec[1]) || 1);
        }
    }
}
const PlayerLevel = parseInt(getPlayerValue("PlayerLevel", 1));

var CombatCostBestDeviation = parseInt(getValue("CombatCostBestDeviation", 1)); // percent
var CombatCostGoodDeviation = parseInt(getValue("CombatCostGoodDeviation", 10)); // percent
let CombatCostBestDeviationColor = getValue("CombatCostBestDeviationColor", "#becb10");
let CombatCostGoodDeviationColor = getValue("CombatCostGoodDeviationColor", "#90EE90");
const SortType = { Text: 1, Number: 2 };
const InventoryArtMenuDirections = { Horizontal: 1, Vertical: 2 };
const InventoryArtMenuDirection = InventoryArtMenuDirections.Vertical;
const CraftLevels = [0, 1, 2, 4, 6, 9, 12, 15, 19, 24, 30, 37, 45];
const CraftType = { Unknown: 0, Weapon: 1, Armor: 2, Jewelry: 3, Backpack: 4 };
const MarketCategory = ["no_sell", "helm", "necklace", "cuirass", "cloack", "weapon", "shield", "boots", "ring", "other", "thief", "tactic", "verb", "medals", "relict", "backpack"];
const ResourcesTypes = { "wood": { Type: "1", ImageName: "wood" }, "ore": { Type: "2", ImageName: "ore" }, "mercury": { Type: "3", ImageName: "mercury" }, "sulphur": { Type: "4", ImageName: "sulfur" }, "crystal": { Type: "5", ImageName: "crystals" }, "gem": { Type: "6", ImageName: "gems" } };
const ElementsTypes = { "42": "abrasive", "43": "snake_poison", "46": "tiger_tusk", "44": "ice_crystal", "45": "moon_stone", "40": "fire_crystal", "37": "meteorit", "41": "witch_flower", "39": "wind_flower", "78": "fern_flower", "38": "badgrib" }
const ElementNames = ["abrasive", "snake_poison", "tiger_tusk", "ice_crystal", "moon_stone", "fire_crystal", "meteorit", "witch_flower", "wind_flower", "fern_flower", "badgrib"];
const localElementNames = {
    "abrasive": isEn ? "Abrasive" : "Абразив",
    "snake_poison": isEn ? "Viper venom" : "Змеиный яд",
    "tiger_tusk": isEn ? "Tiger`s claw" : "Клык тигра",
    "ice_crystal": isEn ? "Ice crystal" : "Ледяной кристалл",
    "moon_stone": isEn ? "Moonstone" : "Лунный камень",
    "fire_crystal": isEn ? "Fire crystal" : "Огненный кристалл",
    "meteorit": isEn ? "Meteorite shard" : "Осколок метеорита",
    "witch_flower": isEn ? "Witch bloom" : "Цветок ведьм",
    "wind_flower": isEn ? "Windflower" : "Цветок ветров",
    "fern_flower": isEn ? "Fern flower" : "Цветок папоротника",
    "badgrib": isEn ? "Toadstool" : "Ядовитый гриб"
};
const ArtifactInfo = { "staff": { Strength: 40, RepairCost: 2527, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "sword18": { Strength: 70, RepairCost: 17755, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "wood_sword": { Strength: 7, RepairCost: 133, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 1 }, "long_bow": { Strength: 50, RepairCost: 6317, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "dagger_dex": { Strength: 40, RepairCost: 3230, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "dagger": { Strength: 30, RepairCost: 912, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 1 }, "dagger20": { Strength: 60, RepairCost: 9291, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "dagger16": { Strength: 60, RepairCost: 9120, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "shortbow": { Strength: 20, RepairCost: 342, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 1 }, "gnome_hammer": { Strength: 25, RepairCost: 294, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 2 }, "bow14": { Strength: 65, RepairCost: 9946, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "bow17": { Strength: 65, RepairCost: 10108, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "power_sword": { Strength: 80, RepairCost: 9775, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "requital_sword": { Strength: 40, RepairCost: 2527, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "firsword15": { Strength: 70, RepairCost: 17670, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "ssword16": { Strength: 46, RepairCost: 6051, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "ssword8": { Strength: 40, RepairCost: 3838, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "ssword10": { Strength: 45, RepairCost: 4854, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "broad_sword": { Strength: 60, RepairCost: 4721, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "def_sword": { Strength: 40, RepairCost: 1292, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 3 }, "dagger_myf": { Strength: 60, RepairCost: 8626, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "mif_sword": { Strength: 70, RepairCost: 16957, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "mif_staff": { Strength: 70, RepairCost: 16387, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "ssword13": { Strength: 50, RepairCost: 5985, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "mstaff13": { Strength: 40, RepairCost: 4797, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "mstaff8": { Strength: 30, RepairCost: 2888, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "smstaff16": { Strength: 37, RepairCost: 4883, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "staff18": { Strength: 70, RepairCost: 17746, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "sor_staff": { Strength: 50, RepairCost: 6118, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "ffstaff15": { Strength: 70, RepairCost: 17679, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "mstaff10": { Strength: 35, RepairCost: 3781, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "mm_sword": { Strength: 70, RepairCost: 17195, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "mm_staff": { Strength: 70, RepairCost: 16986, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "composite_bow": { Strength: 55, RepairCost: 8246, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "steel_blade": { Strength: 30, RepairCost: 465, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 2 }, "large_shield": { Strength: 70, RepairCost: 9576, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 6 }, "hauberk": { Strength: 40, RepairCost: 2289, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 3 }, "boots2": { Strength: 35, RepairCost: 1026, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 2 }, "armor15": { Strength: 70, RepairCost: 9310, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "marmor17": { Strength: 70, RepairCost: 9310, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 9 }, "sarmor16": { Strength: 44, RepairCost: 4351, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "armor17": { Strength: 70, RepairCost: 9490, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 9 }, "leather_shiled": { Strength: 18, RepairCost: 266, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 1 }, "leatherhat": { Strength: 12, RepairCost: 171, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 1 }, "leatherboots": { Strength: 14, RepairCost: 199, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 1 }, "leatherplate": { Strength: 30, RepairCost: 1358, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 2 }, "hunter_boots": { Strength: 30, RepairCost: 912, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 1 }, "leather_helm": { Strength: 30, RepairCost: 627, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 1 }, "wizard_cap": { Strength: 35, RepairCost: 1596, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 2 }, "chain_coif": { Strength: 40, RepairCost: 1539, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 2 }, "xymhelmet15": { Strength: 70, RepairCost: 6612, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "mhelmetzh13": { Strength: 70, RepairCost: 6384, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 6 }, "round_shiled": { Strength: 10, RepairCost: 104, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 1 }, "mif_light": { Strength: 70, RepairCost: 6251, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 5 }, "mif_lboots": { Strength: 55, RepairCost: 7153, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "mif_lhelmet": { Strength: 70, RepairCost: 5244, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 5 }, "sarmor9": { Strength: 40, RepairCost: 2479, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 5 }, "miff_plate": { Strength: 75, RepairCost: 9842, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "sarmor13": { Strength: 50, RepairCost: 4322, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "boots13": { Strength: 70, RepairCost: 8502, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 7 }, "zxhelmet13": { Strength: 70, RepairCost: 6384, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 6 }, "shield13": { Strength: 70, RepairCost: 10174, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 7 }, "mage_armor": { Strength: 50, RepairCost: 4465, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 5 }, "robewz15": { Strength: 70, RepairCost: 9310, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "wiz_robe": { Strength: 70, RepairCost: 9376, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "sboots12": { Strength: 35, RepairCost: 2992, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "shelm12": { Strength: 40, RepairCost: 2660, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 5 }, "sboots16": { Strength: 30, RepairCost: 3239, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "boots15": { Strength: 70, RepairCost: 8559, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "boots17": { Strength: 70, RepairCost: 8683, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 9 }, "mboots17": { Strength: 70, RepairCost: 8683, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 9 }, "mboots14": { Strength: 70, RepairCost: 8825, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "sboots9": { Strength: 30, RepairCost: 2137, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 5 }, "ciras": { Strength: 70, RepairCost: 4455, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 4 }, "steel_helmet": { Strength: 70, RepairCost: 3676, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 3 }, "s_shield": { Strength: 15, RepairCost: 266, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 2 }, "full_plate": { Strength: 75, RepairCost: 9243, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 6 }, "steel_boots": { Strength: 70, RepairCost: 5785, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 4 }, "shoe_of_initiative": { Strength: 40, RepairCost: 2384, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 3 }, "wiz_boots": { Strength: 65, RepairCost: 8008, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "mif_hboots": { Strength: 65, RepairCost: 7752, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "mif_hhelmet": { Strength: 70, RepairCost: 6298, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 5 }, "shelm16": { Strength: 40, RepairCost: 2774, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "mage_helm": { Strength: 50, RepairCost: 3277, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 4 }, "shelm8": { Strength: 30, RepairCost: 1197, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 3 }, "myhelmet15": { Strength: 70, RepairCost: 6583, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "helmet17": { Strength: 70, RepairCost: 7239, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "mhelmet17": { Strength: 70, RepairCost: 7239, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "knowledge_hat": { Strength: 25, RepairCost: 978, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 2 }, "dragon_shield": { Strength: 70, RepairCost: 8778, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 5 }, "shield16": { Strength: 70, RepairCost: 10298, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 8 }, "sshield17": { Strength: 35, RepairCost: 4018, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 8 }, "shield19": { Strength: 70, RepairCost: 10469, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 9 }, "sshield5": { Strength: 40, RepairCost: 2888, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 4 }, "sshield11": { Strength: 40, RepairCost: 3876, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 6 }, "defender_shield": { Strength: 40, RepairCost: 1130, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 3 }, "sshield14": { Strength: 38, RepairCost: 3923, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 7 }, "wzzamulet16": { Strength: 65, RepairCost: 10972, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "mmzamulet16": { Strength: 65, RepairCost: 10972, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "smamul17": { Strength: 30, RepairCost: 4389, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "bafamulet15": { Strength: 65, RepairCost: 10811, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "amulet_of_luck": { Strength: 25, RepairCost: 959, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 2 }, "samul14": { Strength: 30, RepairCost: 4370, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "wzzamulet13": { Strength: 60, RepairCost: 9975, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "warring13": { Strength: 60, RepairCost: 10279, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "ring19": { Strength: 65, RepairCost: 11305, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "wwwring16": { Strength: 65, RepairCost: 11238, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "dring5": { Strength: 40, RepairCost: 3496, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 4 }, "warriorring": { Strength: 40, RepairCost: 6697, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "mmmring16": { Strength: 65, RepairCost: 11238, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "i_ring": { Strength: 10, RepairCost: 171, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 1 }, "smring10": { Strength: 30, RepairCost: 2859, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "dring18": { Strength: 70, RepairCost: 14820, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 9 }, "mring19": { Strength: 65, RepairCost: 11390, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 7 }, "circ_ring": { Strength: 50, RepairCost: 6507, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 4 }, "dring15": { Strength: 70, RepairCost: 14534, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "powerring": { Strength: 40, RepairCost: 5187, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 4 }, "bring14": { Strength: 60, RepairCost: 10374, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "sring4": { Strength: 15, RepairCost: 579, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 2 }, "doubt_ring": { Strength: 12, RepairCost: 1064, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 2 }, "dring21": { Strength: 70, RepairCost: 15104, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "rashness_ring": { Strength: 30, RepairCost: 1928, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 2 }, "darkring": { Strength: 50, RepairCost: 8379, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "sring17": { Strength: 30, RepairCost: 2907, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "warrior_pendant": { Strength: 50, RepairCost: 8046, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 }, "mamulet19": { Strength: 65, RepairCost: 11039, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 }, "power_pendant": { Strength: 60, RepairCost: 7381, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "amulet19": { Strength: 65, RepairCost: 11039, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 }, "magic_amulet": { Strength: 50, RepairCost: 8379, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "cloack17": { Strength: 65, RepairCost: 9975, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 9 }, "cloackwz15": { Strength: 65, RepairCost: 9614, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "scroll18": { Strength: 70, RepairCost: 10307, MarketCategory: "weapon", CraftType: 3, AmmunitionPoints: 9 }, "scloack8": { Strength: 30, RepairCost: 2052, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 4 }, "bravery_medal": { Strength: 25, RepairCost: 560, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 2 }, "mmzamulet13": { Strength: 60, RepairCost: 9975, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "dring12": { Strength: 65, RepairCost: 13356, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "soul_cape": { Strength: 30, RepairCost: 1197, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 2 }, "wiz_cape": { Strength: 60, RepairCost: 8711, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 7 }, "samul17": { Strength: 30, RepairCost: 4389, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "smamul14": { Strength: 30, RepairCost: 4370, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "verve_ring": { Strength: 18, RepairCost: 1577, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 2 }, "dring9": { Strength: 50, RepairCost: 10032, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "smring17": { Strength: 30, RepairCost: 2907, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "magring13": { Strength: 60, RepairCost: 10279, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "scloack16": { Strength: 30, RepairCost: 3192, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "powercape": { Strength: 40, RepairCost: 5339, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 4 }, "scoutcloack": { Strength: 20, RepairCost: 304, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 1 }, "energy_scroll": { Strength: 70, RepairCost: 9044, MarketCategory: "weapon", CraftType: 3, AmmunitionPoints: 6 }, "samul8": { Strength: 30, RepairCost: 3391, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "sring10": { Strength: 30, RepairCost: 2859, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "antiair_cape": { Strength: 60, RepairCost: 2926, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 3 }, "antimagic_cape": { Strength: 50, RepairCost: 4949, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 5 }, "d_spray": { Strength: 15, RepairCost: 3325, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 5 }, "bfly": { Strength: 50, RepairCost: 49875, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 5 }, "bril_pendant": { Strength: 50, RepairCost: 23275, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 6 }, "warmor": { Strength: 50, RepairCost: 16625, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 6 }, "flowers3": { Strength: 15, RepairCost: 3325, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 4 }, "flowers1": { Strength: 10, RepairCost: 332, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 1 }, "flowers4": { Strength: 25, RepairCost: 4987, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 5 }, "flowers2": { Strength: 10, RepairCost: 332, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 1 }, "roses": { Strength: 40, RepairCost: 8312, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 9 }, "flowers5": { Strength: 25, RepairCost: 4987, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 5 }, "half_heart_m": { Strength: 25, RepairCost: 4987, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 2 }, "half_heart_w": { Strength: 25, RepairCost: 4987, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 2 }, "venok": { Strength: 10, RepairCost: 332, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 2 }, "defender_dagger": { Strength: 15, RepairCost: 1330, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 2 }, "goldciras": { Strength: 50, RepairCost: 13300, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 4 }, "koltsou": { Strength: 40, RepairCost: 23275, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 6 }, "bril_ring": { Strength: 40, RepairCost: 33250, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 5 }, "wboots": { Strength: 50, RepairCost: 16625, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 6 }, "flower_heart": { Strength: 20, RepairCost: 1662, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 3 }, "protazan": { Strength: 40, RepairCost: 8312, MarketCategory: "no_sell", CraftType: 1, AmmunitionPoints: 2 }, "whelmet": { Strength: 50, RepairCost: 16625, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 6 }, "shpaga": { Strength: 60, RepairCost: 26600, MarketCategory: "no_sell", CraftType: 1, AmmunitionPoints: 10 },
 "coldamul": { Strength: 75, RepairCost: 11000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: x => 8 + Math.floor(x / 4) },
 "sun_armor": { Strength: 85, RepairCost: 9500, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: x => 1 + Math.floor(x / 2) },
 "super_dagger": { Strength: 75, RepairCost: 10400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: x => 3 + Math.floor(x / 4) },
 "clover_amul": { Strength: 75, RepairCost: 11000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: x => 3 + Math.floor(x / 2) },
 "ring2013": { Strength: 50, RepairCost: 800, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 3 },
 "sun_ring": { Strength: 75, RepairCost: 6400, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: x => 4 + Math.floor(x / 4) },
 "coldring_n": { Strength: 75, RepairCost: 6400, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: x => 6 + Math.floor(x / 4) },
 "lbow": { Strength: 85, RepairCost: 10100, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: x => 1 + Math.floor(x / 3) },
 "cold_sword2014": { Strength: 85, RepairCost: 17600, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: x => 4 + Math.floor(x / 2) },
 "sun_sword": { Strength: 85, RepairCost: 17600, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: x => 4 + Math.floor(x / 2) },
 "finecl": { Strength: 80, RepairCost: 10000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 6 },
 "sun_boots": { Strength: 85, RepairCost: 8700, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: x => 1 + Math.floor(x / 2) },
 "sun_helm": { Strength: 85, RepairCost: 7400, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: x => 1 + Math.floor(x / 2) },
 "wshield": { Strength: 65, RepairCost: 4000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 6 }, "shield_14y": { Strength: 70, RepairCost: 14000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 5 },
 "cold_shieldn": { Strength: 85, RepairCost: 10400, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: x => 5 + Math.floor(x / 4) }, "n_amul": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 2 }, "n_boots": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 1 }, "n_armor": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 1 }, "n_ringa": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 1 }, "n_ringd": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 1 }, "n_sword": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 1, AmmunitionPoints: 1 }, "n_clk": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 3, AmmunitionPoints: 1 }, "n_helmet": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 1 }, "n_shield": { Strength: 40, RepairCost: 2000, MarketCategory: "no_sell", CraftType: 2, AmmunitionPoints: 1 }, "neut_amulet": { Strength: 20, RepairCost: 10000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "forest_armor": { Strength: 1, RepairCost: 10000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "forest_dagger": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "forest_blade": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "neut_ring": { Strength: 1, RepairCost: 10000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 7 }, "les_cl": { Strength: 20, RepairCost: 10000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "forest_bow": { Strength: 20, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "forest_boots": { Strength: 1, RepairCost: 10000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "forest_helm": { Strength: 1, RepairCost: 10000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 6 }, "shieldofforest": { Strength: 1, RepairCost: 10000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 8 }, "hunter_pendant1": { Strength: 10, RepairCost: 400, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 1 }, "hunter_bow1": { Strength: 10, RepairCost: 400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 2 }, "hunter_gloves1": { Strength: 10, RepairCost: 400, MarketCategory: "other", CraftType: 3, AmmunitionPoints: 1 }, "hunter_jacket1": { Strength: 10, RepairCost: 400, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 1 }, "hunter_boots1": { Strength: 10, RepairCost: 400, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 1 }, "hunter_sword1": { Strength: 10, RepairCost: 400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 1 }, "hunter_hat1": { Strength: 10, RepairCost: 400, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 1 }, "hunter_shield1": { Strength: 10, RepairCost: 400, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 2 }, "hunter_amulet1": { Strength: 10, RepairCost: 800, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 3 }, "hunter_armor1": { Strength: 10, RepairCost: 800, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 3 }, "hunterdagger": { Strength: 10, RepairCost: 800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 2 }, "hunter_ring2": { Strength: 10, RepairCost: 800, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 3 }, "hunter_ring1": { Strength: 10, RepairCost: 800, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 2 }, "hunter_roga1": { Strength: 10, RepairCost: 800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 2 }, "huntersword2": { Strength: 10, RepairCost: 800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "hunter_boots3": { Strength: 10, RepairCost: 800, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 2 }, "hunter_bow2": { Strength: 10, RepairCost: 800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 3 }, "hunter_mask1": { Strength: 10, RepairCost: 800, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 3 }, "hunterdsword": { Strength: 10, RepairCost: 800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "hunter_boots2": { Strength: 10, RepairCost: 800, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 2 }, "hunter_arrows1": { Strength: 10, RepairCost: 800, MarketCategory: "other", CraftType: 1, AmmunitionPoints: 3 }, "hunter_helm": { Strength: 10, RepairCost: 800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 2 }, "huntershield2": { Strength: 10, RepairCost: 800, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 3 }, "gm_amul": { Strength: 10, RepairCost: 1200, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 5 }, "gm_arm": { Strength: 10, RepairCost: 1200, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 5 }, "gm_rring": { Strength: 10, RepairCost: 1200, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 2 }, "gm_kastet": { Strength: 10, RepairCost: 1200, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "gm_sring": { Strength: 10, RepairCost: 1200, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 4 }, "gm_abow": { Strength: 10, RepairCost: 1200, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "gm_protect": { Strength: 10, RepairCost: 1200, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 6 }, "gm_sword": { Strength: 10, RepairCost: 1200, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "gm_spdb": { Strength: 10, RepairCost: 1200, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 2 }, "gm_3arrows": { Strength: 10, RepairCost: 1200, MarketCategory: "other", CraftType: 1, AmmunitionPoints: 5 }, "gm_hat": { Strength: 10, RepairCost: 1200, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 4 }, "gm_defence": { Strength: 10, RepairCost: 1200, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 5 }, "sh_amulet2": { Strength: 15, RepairCost: 2400, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "sh_armor": { Strength: 15, RepairCost: 2400, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "sh_ring1": { Strength: 15, RepairCost: 2400, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "sh_ring2": { Strength: 15, RepairCost: 2400, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 4 }, "sh_spear": { Strength: 15, RepairCost: 2400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "sh_bow": { Strength: 15, RepairCost: 2400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "sh_cloak": { Strength: 15, RepairCost: 2400, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "sh_sword": { Strength: 15, RepairCost: 2400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "sh_boots": { Strength: 15, RepairCost: 2400, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 4 }, "sh_4arrows": { Strength: 15, RepairCost: 2400, MarketCategory: "other", CraftType: 1, AmmunitionPoints: 7 }, "sh_helmet": { Strength: 15, RepairCost: 2400, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 6 }, "sh_shield": { Strength: 15, RepairCost: 2400, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 7 }, "thief_neckl": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 8 }, "thief_arb": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 1, AmmunitionPoints: 9 }, "thief_goodarmor": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 2, AmmunitionPoints: 6 }
 , "thief_ml_dagger": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 1, AmmunitionPoints: 7 }, "ring_of_thief": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 5 }, "thief_msk": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 2, AmmunitionPoints: 5 }, "thief_cape": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 5 }, "thief_fastboots": { Strength: 60, RepairCost: 8000, MarketCategory: "thief", CraftType: 2, AmmunitionPoints: 6 }, "tm_amulet": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 11 }, "tm_arb": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 1, AmmunitionPoints: 12 }, "tm_armor": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 2, AmmunitionPoints: 10 }, "tm_knife": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 1, AmmunitionPoints: 11 }, "tm_mring": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 8 }, "tm_wring": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 8 }, "tm_msk": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 2, AmmunitionPoints: 8 }, "tm_cape": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 7 }, "tm_boots": { Strength: 60, RepairCost: 24000, MarketCategory: "thief", CraftType: 2, AmmunitionPoints: 8 }, "r_warriorsamulet": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 11 }, "r_m_amulet": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 11 }, "r_zarmor": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 10 }, "r_dagger": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 8 }, "r_magicsring": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 7 }, "r_warring": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 7 }, "r_bow": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 7 }, "r_bigsword": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 13 }, "r_clck": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 11 }, "r_magy_staff": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 13 }, "r_bootsmb": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 10 }, "r_goodscroll": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 9 }, "r_helmb": { Strength: 70, RepairCost: 36000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 10 }, "tact1w1_wamulet": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 3, AmmunitionPoints: 10 }, "tactcv1_armor": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 2, AmmunitionPoints: 9 }, "tactsm0_dagger": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 1, AmmunitionPoints: 8 }, "tactspw_mring": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 3, AmmunitionPoints: 7 }, "tactwww_wring": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 3, AmmunitionPoints: 7 }, "tact765_bow": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 1, AmmunitionPoints: 7 }, "tactms1_mamulet": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 3, AmmunitionPoints: 10 }, "tactpow_cloack": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 3, AmmunitionPoints: 9 }, "tactmag_staff": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 1, AmmunitionPoints: 10 }, "tactzl4_boots": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 2, AmmunitionPoints: 9 }, "tactaz_axe": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 1, AmmunitionPoints: 11 }, "tacthapp_helmet": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 2, AmmunitionPoints: 8 }, "tactdff_shield": { Strength: 75, RepairCost: 40000, MarketCategory: "tactic", CraftType: 2, AmmunitionPoints: 8 }, "v_1armor": { Strength: 90, RepairCost: 48000, MarketCategory: "verb", CraftType: 2, AmmunitionPoints: 9 }, "verb11_sword": { Strength: 90, RepairCost: 48000, MarketCategory: "verb", CraftType: 1, AmmunitionPoints: 11 }, "verbboots": { Strength: 90, RepairCost: 48000, MarketCategory: "verb", CraftType: 2, AmmunitionPoints: 9 }, "ve_helm": { Strength: 90, RepairCost: 48000, MarketCategory: "verb", CraftType: 2, AmmunitionPoints: 8 }, "vrb_shild": { Strength: 90, RepairCost: 48000, MarketCategory: "verb", CraftType: 2, AmmunitionPoints: 8 }, "tl_medal1": { Strength: 50, RepairCost: 32000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 9 }, "tl_medal2": { Strength: 40, RepairCost: 16000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 4 }, "tl_medal3": { Strength: 30, RepairCost: 6000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 3 }, "bwar1": { Strength: 1, RepairCost: 60000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 15 }, "kwar1": { Strength: 1, RepairCost: 60000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 15 }, "gnomewar1": { Strength: 70, RepairCost: 60000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 15 }, "bwar2": { Strength: 1, RepairCost: 48000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 12 }, "kwar2": { Strength: 1, RepairCost: 48000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 12 }, "gnomewar2": { Strength: 65, RepairCost: 48000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 12 }, "kwar3": { Strength: 1, RepairCost: 36000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 10 }, "gnomewar3": { Strength: 60, RepairCost: 36000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 10 }, "bwar3": { Strength: 1, RepairCost: 36000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 10 }, "bwar4": { Strength: 1, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "kwar4": { Strength: 1, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "gnomewar4": { Strength: 55, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "bwar5": { Strength: 1, RepairCost: 20000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 7 }, "kwar5": { Strength: 1, RepairCost: 20000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 7 }, "gnomewar5": { Strength: 50, RepairCost: 20000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 7 }, "bwar6": { Strength: 1, RepairCost: 16000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 6 }, "kwar6": { Strength: 1, RepairCost: 16000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 6 }, "gnomewar6": { Strength: 45, RepairCost: 16000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 6 }, "bwar7": { Strength: 1, RepairCost: 12000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 5 }, "kwar7": { Strength: 1, RepairCost: 12000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 5 }, "gnomewar7": { Strength: 40, RepairCost: 12000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 5 }, "bunt_medal1": { Strength: 60, RepairCost: 40000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 11 }, "bunt_medal2": { Strength: 50, RepairCost: 20000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 6 }, "bunt_medal3": { Strength: 40, RepairCost: 10000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 4 }, "bwar_splo": { Strength: 50, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "gnomewar_splo": { Strength: 50, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "kwar_splo": { Strength: 50, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "kwar_stoj": { Strength: 25, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "bwar_stoj": { Strength: 30, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "gnomewar_stoj": { Strength: 50, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "bwar_takt": { Strength: 50, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "gnomewar_takt": { Strength: 50, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "kwar_takt": { Strength: 50, RepairCost: 28000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "necrwar1st": { Strength: 70, RepairCost: 56000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 14 }, "necrwar2st": { Strength: 60, RepairCost: 36000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 10 }, "necrwar3st": { Strength: 50, RepairCost: 20000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 6 }, "necrwar4st": { Strength: 40, RepairCost: 10000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 4 }, "necrwar5st": { Strength: 30, RepairCost: 4000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 2 }, "warthief_medal1": { Strength: 70, RepairCost: 18000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 7 }, "warthief_medal2": { Strength: 60, RepairCost: 14000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 6 }, "warthief_medal3": { Strength: 50, RepairCost: 10000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 5 }, "warthief_medal4": { Strength: 40, RepairCost: 6000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 4 }, "warthief_medal5": { Strength: 30, RepairCost: 2000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 3 }, "elfwar1": { Strength: 80, RepairCost: 60000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 13 }, "elfwar2": { Strength: 70, RepairCost: 40000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 11 }, "elfwar3": { Strength: 60, RepairCost: 32000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 8 }, "elfwar4": { Strength: 50, RepairCost: 20000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 7 }, "elfwar5": { Strength: 40, RepairCost: 10000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 6 }, "elfwar6": { Strength: 30, RepairCost: 4000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 4 }, "magewar1": { Strength: 80, RepairCost: 52000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 12 }, "magewar2": { Strength: 70, RepairCost: 40000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 9 }, "magewar3": { Strength: 60, RepairCost: 32000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 7 }, "magewar4": { Strength: 50, RepairCost: 20000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 5 }, "magewar5": { Strength: 35, RepairCost: 12000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 4 }, "demwar1": { Strength: 80, RepairCost: 60000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 14 }, "demwar2": { Strength: 70, RepairCost: 44000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 11 }, "demwar3": { Strength: 60, RepairCost: 36000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 9 }, "demwar4": { Strength: 50, RepairCost: 24000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 7 }, "demwar5": { Strength: 40, RepairCost: 16000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 5 }, "demwar6": { Strength: 30, RepairCost: 8000, MarketCategory: "medals", CraftType: 3, AmmunitionPoints: 4 }, "barb_armor": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "barb_club": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 7 }, "barb_boots": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "barb_helm": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 4 }, "barb_shield": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "necr_amulet": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "necr_helm": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "necr_staff": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 10 }, "necr_robe": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "merc_armor": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "merc_dagger": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 6 }, "merc_sword": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 8 }, "merc_boots": { Strength: 100, RepairCost: 40000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "elfamulet": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 9 }, "elfbow": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 8 }, "elfshirt": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "elfboots": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "darkelfkaska": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "darkelfciras": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "darkelfpendant": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 9 }, "darkelfcloack": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 6 }, "darkelfstaff": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 10 }, "darkelfboots": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "dem_amulet": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 12 }, "dem_armor": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 9 }, "dem_bootshields": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "dem_axe": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 12 }, "dem_helmet": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 9 }, "dem_shield": { Strength: 100, RepairCost: 50000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "mage_cape": { Strength: 100, RepairCost: 60000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 6 }, "mage_staff": { Strength: 100, RepairCost: 60000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 11 }, "mage_robe": { Strength: 100, RepairCost: 60000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "mage_boots": { Strength: 100, RepairCost: 60000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "mage_scroll": { Strength: 100, RepairCost: 60000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "mage_hat": { Strength: 100, RepairCost: 60000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "gnomearmor": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "gnomehammer": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 9 }, "gnomeboots": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 5 }, "gnomehelmet": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 5 }, "gnomeshield": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "gnomem_amulet": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 11 }, "gnomem_armor": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "gnomem_hammer": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 10 }, "gnomem_boots": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "gnomem_helmet": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "gnomem_shield": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "gmage_crown": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "gmage_cloack": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "gmage_staff": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 11 }, "gmage_armor": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "gmage_boots": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "gmage_scroll": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "welfarmor": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "welfbow": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 6 }, "welfsword": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 9 }, "welfboots": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 5 }, "welfhelmet": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 5 }, "welfshield": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "druid_amulet": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 11 }, "druid_cloack": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "druid_staff": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 11 }, "druid_armor": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "druid_boots": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "knightarmor": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "knightsword": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 9 }, "knightboots": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 5 }, "knighthelmet": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 5 }, "knightshield": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "paladin_bow": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 8 }, "paladin_armor": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "paladin_sword": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 11 }, "paladin_boots": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "paladin_helmet": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "paladin_shield": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "sv_arb": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 8 }, "sv_body": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "sv_weap": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 11 }, "sv_boot": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "sv_helm": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "sv_shield": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "nv_body": { Strength: 100, RepairCost: 56000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "nv_weap": { Strength: 100, RepairCost: 56000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 10 }, "nv_boot": { Strength: 100, RepairCost: 56000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "nv_helm": { Strength: 100, RepairCost: 56000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "nv_shield": { Strength: 100, RepairCost: 56000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "kn_body": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "kn_weap": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 9 }, "kn_helm": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 5 }, "kn_shield": { Strength: 100, RepairCost: 44000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "inq_body": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 9 }, "inq_cl": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "inq_weap": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 12 }, "inq_boot": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "inq_helm": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "amf_body": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 8 }, "amf_cl": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "amf_boot": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 7 }, "amf_weap": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 11 }, "amf_scroll": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "amf_helm": { Strength: 100, RepairCost: 64000, MarketCategory: "relict", CraftType: 2, AmmunitionPoints: 6 }, "8amul_inf": { Strength: 8, RepairCost: 12000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 }, "quest_pendant1": { Strength: 20, RepairCost: 600, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 1 }, "9amu_let": { Strength: 9, RepairCost: 18000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 4 }, "trinitypendant": { Strength: 50, RepairCost: 6400, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "sunart2": { Strength: 20, RepairCost: 28000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "a_mallet": { Strength: 10000, RepairCost: 40, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 1 }, "buben2": { Strength: 1, RepairCost: 12800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "totem1": { Strength: 70, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "icesphere1": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 7 }, "mechanic_glasses1": { Strength: 1, RepairCost: 8000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "buben1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "anomal_ring1": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 15 }, "mart8_ring1": { Strength: 8, RepairCost: 400, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 5 }, "mart8_flowers1": { Strength: 8, RepairCost: 8000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 4 }, "wolfjacket": { Strength: 15, RepairCost: 800, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 2 }, "sharik": { Strength: 1, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 4 }, "magneticarmor": { Strength: 1, RepairCost: 36000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 }, "dragonstone": { Strength: 70, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "dubina": { Strength: 30, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "ogre_bum": { Strength: 1, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "gdubina": { Strength: 30, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "lizard_armor": { Strength: 15, RepairCost: 800, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 2 }, "hopesh1": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "mgear": { Strength: 1, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "5years_star": { Strength: 10, RepairCost: 5000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 5 }, "znamya1": { Strength: 70, RepairCost: 8000, MarketCategory: "no_sell", CraftType: 0, AmmunitionPoints: 1 }, "krest2": { Strength: 1, RepairCost: 9000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "znamya2": { Strength: 70, RepairCost: 8000, MarketCategory: "no_sell", CraftType: 0, AmmunitionPoints: 1 }, "kznamya1": { Strength: 70, RepairCost: 10000, MarketCategory: "no_sell", CraftType: 0, AmmunitionPoints: 1 }, "kznamya2": { Strength: 70, RepairCost: 10000, MarketCategory: "no_sell", CraftType: 0, AmmunitionPoints: 1 }, "ankh1": { Strength: 70, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 7 }, "zub": { Strength: 30, RepairCost: 40000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "tunnel_kirka": { Strength: 25, RepairCost: 4000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "bludgeon": { Strength: 30, RepairCost: 28000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "brush": { Strength: 70, RepairCost: 19824, MarketCategory: "no_sell", CraftType: 1, AmmunitionPoints: 9 }, "windsword": { Strength: 1, RepairCost: 22000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "pit_sword1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 19 }, "pit_sword2": { Strength: 1, RepairCost: 13200, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "kniga": { Strength: 40, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 2 }, "skill_book11": { Strength: 1, RepairCost: 40000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "anomal_ring2": { Strength: 1, RepairCost: 18000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 13 }, "commander_ring": { Strength: 70, RepairCost: 20000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 8 }, "testring": { Strength: 30, RepairCost: 40000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 6 }, "thief_premiumring1": { Strength: 70, RepairCost: 24000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 8 }, "thief_premiumring2": { Strength: 65, RepairCost: 18000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 7 }, "thief_premiumring3": { Strength: 60, RepairCost: 12000, MarketCategory: "thief", CraftType: 3, AmmunitionPoints: 6 }, "ttring": { Strength: 1, RepairCost: 10800, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 4 }, "blackring": { Strength: 40, RepairCost: 8000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 4 }, "student_armor": { Strength: 30, RepairCost: 2000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 2 }, "pegaskop": { Strength: 1, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "sunart1": { Strength: 20, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "kopie": { Strength: 30, RepairCost: 28000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "pika": { Strength: 30, RepairCost: 28000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "trogloditkop": { Strength: 1, RepairCost: 5600, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "dragon_crown": { Strength: 50, RepairCost: 6800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 5 }, "necrohelm2": { Strength: 10, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "dem_kosa": { Strength: 30, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "pouch": { Strength: 70, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "cubed": { Strength: 45, RepairCost: 4800, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "bal_cube": { Strength: 45, RepairCost: 4800, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "cubes": { Strength: 50, RepairCost: 6400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "cubeg": { Strength: 60, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "bshield3": { Strength: 1, RepairCost: 8000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 7 }, "icesphere2": { Strength: 1, RepairCost: 14400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "goblin_bow": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "centaurbow": { Strength: 30, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "sniperbow": { Strength: 1, RepairCost: 36000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 8 }, "totem3": { Strength: 70, RepairCost: 8400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "10scroll": { Strength: 1, RepairCost: 40000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "sunart3": { Strength: 20, RepairCost: 32000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "sword5": { Strength: 30, RepairCost: 4000, MarketCategory: "no_sell", CraftType: 1, AmmunitionPoints: 5 }, "blacksword": { Strength: 10, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "sunart4": { Strength: 20, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "dem_dmech": { Strength: 30, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "blacksword1": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "slayersword": { Strength: 30, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "meshok": { Strength: 2012, RepairCost: 2012, MarketCategory: "no_sell", CraftType: 0, AmmunitionPoints: 2 }, "meshok2": { Strength: 2012, RepairCost: 2012, MarketCategory: "no_sell", CraftType: 0, AmmunitionPoints: 2 }, "molot_tan": { Strength: 30, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "13coin": { Strength: 1, RepairCost: 40000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "snowjinka": { Strength: 40, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 4 }, "sosulka": { Strength: 40, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 4 }, "obereg": { Strength: 50, RepairCost: 20000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "castle_orden": { Strength: 60, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "order_griffin": { Strength: 70, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 }, "order_manticore": { Strength: 70, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 }, "eg_order1": { Strength: 1, RepairCost: 22000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 14 }, "eg_order2": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 }, "eg_order3": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "ord_light": { Strength: 75, RepairCost: 18000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 12 }, "ord_dark": { Strength: 75, RepairCost: 18000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 12 }, "mechanic_glasses2": { Strength: 1, RepairCost: 7400, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 10 }, "pen": { Strength: 70, RepairCost: 19824, MarketCategory: "no_sell", CraftType: 1, AmmunitionPoints: 9 }, "sandglass": { Strength: 70, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "inq_ring1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 15 }, "battlem_cape": { Strength: 1, RepairCost: 28000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 11 }, "stalkercl": { Strength: 1, RepairCost: 8000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "totem2": { Strength: 70, RepairCost: 9000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "2year_amul_lords": { Strength: 10, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 2 }, "7ka": { Strength: 10, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "3year_amul": { Strength: 10, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 2 }, "icesphere3": { Strength: 1, RepairCost: 12800, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "inq_ring2": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 11 }, "krest3": { Strength: 1, RepairCost: 8400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "anomal_ring3": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "buben3": { Strength: 1, RepairCost: 9600, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "mechanic_glasses3": { Strength: 1, RepairCost: 6800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "rog_demon": { Strength: 30, RepairCost: 40000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "runkam": { Strength: 50, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "lizard_boots": { Strength: 15, RepairCost: 800, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 2 }, "torg_boots": { Strength: 1, RepairCost: 20000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 5 }, "krest1": { Strength: 1, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "thief_unique_secretops": { Strength: 200, RepairCost: 0, MarketCategory: "no_sell", CraftType: 1, AmmunitionPoints: 3 }, "ankh2": { Strength: 70, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "compass": { Strength: 40, RepairCost: 8000, MarketCategory: "other", CraftType: 3, AmmunitionPoints: 7 }, "statue": { Strength: 70, RepairCost: 12000, MarketCategory: "no_sell", CraftType: 0, AmmunitionPoints: 3 }, "nefrit2": { Strength: 1, RepairCost: 9000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "nefrit3": { Strength: 1, RepairCost: 8400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "nefrit1": { Strength: 1, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 7 }, "cat_statue": { Strength: 70, RepairCost: 8000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "bear_statue": { Strength: 70, RepairCost: 8000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "ru_statue": { Strength: 20, RepairCost: 2009, MarketCategory: "shield", CraftType: 3, AmmunitionPoints: 10 }, "dog_statue": { Strength: 70, RepairCost: 8000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "msphere": { Strength: 60, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "3year_art": { Strength: 10, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 3 }, "znak5": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak8": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak7": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak3": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak2": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak1": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak6": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak9": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "znak4": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "firehammer": { Strength: 1, RepairCost: 32000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "topor_drov": { Strength: 40, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "dem_dtopor": { Strength: 30, RepairCost: 48000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "taskaxe": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 16 }, "orc_axe": { Strength: 1, RepairCost: 28000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "topor_skelet": { Strength: 30, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "sea_trident": { Strength: 15, RepairCost: 4000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "bshield1": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 10 }, "dudka": { Strength: 1, RepairCost: 6000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 5 }, "flyaga": { Strength: 1, RepairCost: 60000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "antifire_cape": { Strength: 40, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 3 }, "hopesh2": { Strength: 1, RepairCost: 7200, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "12hron": { Strength: 1, RepairCost: 40000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 1 }, "4year_klever": { Strength: 10, RepairCost: 4000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 3 }, "6ring": { Strength: 10, RepairCost: 15000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "lizard_helm": { Strength: 15, RepairCost: 800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 2 }, "ogre_helm": { Strength: 1, RepairCost: 24000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "orc_hat": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "necrohelm3": { Strength: 10, RepairCost: 24000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "necrohelm1": { Strength: 10, RepairCost: 10000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 4 }, "gargoshield": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 8 }, "bshield2": { Strength: 1, RepairCost: 12000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 9 }, "e_shield2": { Strength: 1, RepairCost: 7200, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 8 }, "e_shield1": { Strength: 1, RepairCost: 10000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 10 }, "elfdagger": { Strength: 1, RepairCost: 36000, MarketCategory: "relict", CraftType: 1, AmmunitionPoints: 12 }, "dun_amul2": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 }, "dun_bow2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "drak_armor1": { Strength: 1, RepairCost: 20000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "dun_boots1": { Strength: 1, RepairCost: 20000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 12 }, "dun_amul1": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 14 }, "dun_bow1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "dun_armor1": { Strength: 1, RepairCost: 20000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "dun_dagger1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "dun_sword1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 16 }, "dun_ring1": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 15 }, "dun_cloak1": { Strength: 1, RepairCost: 18000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 12 }, "dung_axe1": { Strength: 1, RepairCost: 18000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 18 }, "hm2": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "dun_shield1": { Strength: 1, RepairCost: 20000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 11 }, "dun_armor2": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 10 }, "dun_dagger2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "dering": { Strength: 1, RepairCost: 24000, MarketCategory: "relict", CraftType: 3, AmmunitionPoints: 15 }, "drak_armor2": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 10 }, "dun_boots3": { Strength: 1, RepairCost: 12000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "dun_armor3": { Strength: 1, RepairCost: 12000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "dun_shield3": { Strength: 1, RepairCost: 12000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "drak_armor3": { Strength: 1, RepairCost: 12000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "dun_bow3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "dun_dagger3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "dun_sword3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "dung_axe3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "dun_sword2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "dun_ring2": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 12 }, "dun_cloak2": { Strength: 1, RepairCost: 15000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "crystal": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "dun_amul3": { Strength: 1, RepairCost: 12000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "dun_cloak3": { Strength: 1, RepairCost: 12000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 5 }, "dun_ring3": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 9 }, "dun_boots2": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 10 }, "dung_axe2": { Strength: 1, RepairCost: 15000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "hm1": { Strength: 1, RepairCost: 14400, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "dun_shield2": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "ramul1": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 13 }, "rarmor1": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 }, "rdagger1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "rogring1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "rarmor2": { Strength: 1, RepairCost: 8000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 11 }, "rboots2": { Strength: 1, RepairCost: 8000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "rhelm2": { Strength: 1, RepairCost: 8000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 10 }, "rsword2": { Strength: 1, RepairCost: 8000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "raxe2": { Strength: 1, RepairCost: 8000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "rbow1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "rsword1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "rcloak1": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 9 }, "rogring2": { Strength: 1, RepairCost: 8000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 7 }, "ramul2": { Strength: 1, RepairCost: 8000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "rdagger2": { Strength: 1, RepairCost: 8000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "rbow2": { Strength: 1, RepairCost: 8000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "rcloak2": { Strength: 1, RepairCost: 8000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 7 }, "rshield2": { Strength: 1, RepairCost: 8000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 11 }, "rboots1": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 11 }, "sumka": { Strength: 1, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "raxe1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "rhelm1": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "rshield1": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 14 }, "surv_halberdzg": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "surv_wamuletik": { Strength: 1, RepairCost: 28000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 12 }, "surv_crossbowsurv": { Strength: 1, RepairCost: 32000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "surv_armorsu": { Strength: 1, RepairCost: 28000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "surv_wring2o": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "surv_daggermd": { Strength: 1, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "surv_sword2sd": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "surv_mring2fpg": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "surv_wring1my": { Strength: 1, RepairCost: 28000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "surv_mbootsbb": { Strength: 1, RepairCost: 28000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 11 }, "surv_mamulka": { Strength: 1, RepairCost: 28000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 15 }, "surv_marmoroz": { Strength: 1, RepairCost: 28000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "surv_mhelmetcv": { Strength: 1, RepairCost: 28000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "surv_mring1fd": { Strength: 1, RepairCost: 28000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 11 }, "surv_mcloacksv": { Strength: 1, RepairCost: 28000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 9 }, "surv_sword_surv": { Strength: 1, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "surv_cloacksrv": { Strength: 1, RepairCost: 28000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 9 }, "surv_staffik": { Strength: 1, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "surv_bootsurv": { Strength: 1, RepairCost: 28000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 11 }, "surv_scrollcd": { Strength: 1, RepairCost: 28000, MarketCategory: "weapon", CraftType: 3, AmmunitionPoints: 11 }, "surv_axes": { Strength: 1, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "surv_helmetpi": { Strength: 1, RepairCost: 28000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "surv_shieldvv": { Strength: 1, RepairCost: 28000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 10 }, "tj_magam2": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "mtcloak1": { Strength: 1, RepairCost: 24000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 11 }, "tmarmor1": { Strength: 1, RepairCost: 24000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "sph1": { Strength: 1, RepairCost: 24000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "tj_mtuf1": { Strength: 1, RepairCost: 24000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 12 }, "vbow1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "mhelmv1": { Strength: 1, RepairCost: 24000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "vtmsword1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 13 }, "vtjcloak1": { Strength: 1, RepairCost: 24000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "staff_v1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "vscroll-1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 3, AmmunitionPoints: 11 }, "vtmaxe1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 16 }, "vmring1": { Strength: 1, RepairCost: 24000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 13 }, "tjarmor2": { Strength: 1, RepairCost: 20000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 10 }, "vrdagger2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "v-ring2": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "tjam2": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "mtcloak3": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "vtjcloak3": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 5 }, "staff_v3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "tmarmor3": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "tj_vboots3": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 7 }, "tj_mtuf3": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 7 }, "tjarmor3": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "vrdagger3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "vbow3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "mhelmv3": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "vtmsword3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "vtmaxe3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "tj_helmet3": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "tj-shield3": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 7 }, "vbow2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "mhelmv2": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "vmring2": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 11 }, "v-ring3": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "tj_magam3": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "tjam3": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "vbolt3": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 5 }, "vscroll-3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 3, AmmunitionPoints: 7 }, "mtcloak2": { Strength: 1, RepairCost: 20000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 9 }, "vtmsword2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "v-ring1": { Strength: 1, RepairCost: 24000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "tj_magam1": { Strength: 1, RepairCost: 24000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 12 }, "vrdagger1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "tjam1": { Strength: 1, RepairCost: 24000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 12 }, "vbolt1": { Strength: 1, RepairCost: 24000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "vbolt2": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "vtjcloak2": { Strength: 1, RepairCost: 20000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 7 }, "staff_v2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "sph3": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "vmring3": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 9 }, "tmarmor2": { Strength: 1, RepairCost: 20000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 10 }, "tj_vboots2": { Strength: 1, RepairCost: 20000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 9 }, "vscroll-2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 3, AmmunitionPoints: 9 }, "sph2": { Strength: 1, RepairCost: 20000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "vtmaxe2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 13 }, "tj_mtuf2": { Strength: 1, RepairCost: 20000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 9 }, "tj_vboots1": { Strength: 1, RepairCost: 24000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 12 }, "tjarmor1": { Strength: 1, RepairCost: 24000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "tj_helmet1": { Strength: 1, RepairCost: 24000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "tj-shield1": { Strength: 1, RepairCost: 24000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 10 }, "tj_helmet2": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "tj-shield2": { Strength: 1, RepairCost: 20000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 9 }, "p_amulet2": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 12 }, "p_amulet1": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 15 }, "piratehat3": { Strength: 1, RepairCost: 12000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "pir_armor1": { Strength: 1, RepairCost: 20000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "p_dag2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "p_dag1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "p_sword3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "pn_ring2": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "pn_ring1": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 13 }, "p_compas2": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }, "p_compas1": { Strength: 1, RepairCost: 20000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "pn_ring3": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 7 }, "piring2": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "piring1": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 12 }, "pir_armor3": { Strength: 1, RepairCost: 12000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "pir_armor2": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 9 }, "p_pistol2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "p_pistol1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "p_cloak2": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 }, "p_cloak1": { Strength: 1, RepairCost: 20000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 10 }, "p_amulet3": { Strength: 1, RepairCost: 12000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "p_dag3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "p_compas3": { Strength: 1, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "piring3": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 7 }, "p_pistol3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "p_cloak3": { Strength: 1, RepairCost: 12000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 7 }, "p_sword2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "p_boots2": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "p_boots1": { Strength: 1, RepairCost: 20000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 10 }, "p_boots3": { Strength: 1, RepairCost: 12000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "piratehat2": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "piratehat1": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "p_sword1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "polk_sword1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 16 }, "polk_armor2": { Strength: 1, RepairCost: 12000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "gring": { Strength: 1, RepairCost: 24000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 11 }, "polk_armor3": { Strength: 1, RepairCost: 8000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 6 }, "polkboots3": { Strength: 1, RepairCost: 8000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "polk_sword3": { Strength: 1, RepairCost: 8000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "polk__helm3": { Strength: 1, RepairCost: 8000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 6 }, "polk_sword2": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "gringd": { Strength: 1, RepairCost: 24000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 12 }, "polkboots2": { Strength: 1, RepairCost: 12000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "polk_armor1": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 10 }, "polkboots1": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 10 }, "polk__helm1": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 10 }, "polk__helm2": { Strength: 1, RepairCost: 12000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "m_amul2": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 13 }, "ocean_boots1": { Strength: 1, RepairCost: 20000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 12 }, "m_amul1": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 15 }, "m_armor1": { Strength: 1, RepairCost: 20000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 13 }, "ocean_dgr1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "ocean_bw1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "ocean_sword1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 16 }, "ocean_per1": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 13 }, "ocean_cl1": { Strength: 1, RepairCost: 20000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 12 }, "ocean_hlm1": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "ocean_m_shield1": { Strength: 1, RepairCost: 20000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 14 }, "ocean_ring1": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 13 }, "ocean_eye1": { Strength: 1, RepairCost: 20000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 7 }, "m_armor2": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 11 }, "ocean_dgr2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "ocean_ring2": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "m_armor3": { Strength: 1, RepairCost: 12000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 9 }, "ocean_boots3": { Strength: 1, RepairCost: 12000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "ocean_dgr3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "ocean_sword3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "ocean_hlm3": { Strength: 1, RepairCost: 12000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "ocean_m_shield3": { Strength: 1, RepairCost: 12000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 10 }, "ocean_bw2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "ocean_sword2": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 13 }, "ocean_eye2": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "ocean_per2": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "ocean_cl2": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 9 }, "ocean_ring3": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 7 }, "ocean_eye3": { Strength: 1, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "m_amul3": { Strength: 1, RepairCost: 12000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 }, "ocean_bw3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "ocean_per3": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 7 }, "ocean_cl3": { Strength: 1, RepairCost: 12000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 7 }, "ocean_boots2": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 10 }, "ocean_hlm2": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 10 }, "ocean_m_shield2": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 12 }, "adv_neck1": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }, "adv_armor1": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 15 }, "a_dagger1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "adv_fring1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "adv_armor2": { Strength: 1, RepairCost: 10000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 11 }, "adv_boot2": { Strength: 1, RepairCost: 10000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 10 }, "adv_hm2": { Strength: 1, RepairCost: 10000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 10 }, "adv_shild2": { Strength: 1, RepairCost: 10000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 11 }, "adv_saber2": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "adv_longbow1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "adv_clk1": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 12 }, "adv_sumk2": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 }, "adv_fring2": { Strength: 1, RepairCost: 10000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "adv_neck2": { Strength: 1, RepairCost: 10000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 7 }, "adv_longbow2": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "a_dagger2": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "adv_clk2": { Strength: 1, RepairCost: 10000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 9 }, "adv_boot1": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 13 }, "adv_sumk1": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 }, "adv_hm1": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 13 }, "adv_shild1": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 15 }, "adv_saber1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "mir_am2": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 }, "mir_am1": { Strength: 1, RepairCost: 24000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 13 }, "mh_sword1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 17 }, "mir_armor2": { Strength: 1, RepairCost: 20000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 10 }, "mir_armor3": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "mir_boots3": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "mh_sword3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "mir_shld3": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 7 }, "mh_sword2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "mir_am3": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 9 }, "mir_boots2": { Strength: 1, RepairCost: 20000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 }, "mir_armor1": { Strength: 1, RepairCost: 24000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "mir_shld1": { Strength: 1, RepairCost: 24000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 12 }, "mir_boots1": { Strength: 1, RepairCost: 24000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 10 }, "mir_shld2": { Strength: 1, RepairCost: 20000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 9 }, "ed_mbook1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "ed_armr1": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "ed_elfbow1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "ed_bsword1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "ed_ring1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "ed_armr2": { Strength: 1, RepairCost: 14000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 9 }, "ed_mbook2": { Strength: 1, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "ed_ring2": { Strength: 1, RepairCost: 14000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "ed_armr3": { Strength: 1, RepairCost: 12000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 7 }, "ed_bsword3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "ed_elfbow2": { Strength: 1, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }, "ed_bsword2": { Strength: 1, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "ed_mbook3": { Strength: 54, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "ed_ring3": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "ed_elfbow3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "stalker_crsb2": { Strength: 1, RepairCost: 12800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "stalker_crsb1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "stalker_hlm1": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 13 }, "stalker_dagger1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "stalker_hlm2": { Strength: 1, RepairCost: 12800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 10 }, "stalker_dagger2": { Strength: 1, RepairCost: 12800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "stalker_crsb3": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "stalker_hlm3": { Strength: 1, RepairCost: 10000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "stalker_dagger3": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }, "potion01": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 }, "potion02": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 }, "potion03": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 }, "potion04": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 }, "potion05": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 }, "potion06": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 }, "potion07": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 }, "potion08": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 1 },
 "16amul": { Strength: 16, RepairCost: 16161, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: x => Math.floor(x / 2) },
 "17bring": { Strength: 17, RepairCost: 17170, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: x => Math.floor(x / 2) },
 "18turban": { Strength: 18, RepairCost: 18018, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: x => Math.floor(x / 2) },

 "forest_crossbow": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }, "icecr1": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 8 }, "drak_crown1": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 14 }, "ed_pendant1": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 16 }, "arm_armor1": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 15 }, "arm_cap1": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "eddem_ring1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 10 }, "stalker_cl1": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 13 }, "arm_armor2": { Strength: 1, RepairCost: 12800, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 11 }, "arm_cap2": { Strength: 1, RepairCost: 12800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }, "drak_crown2": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 11 }, "arm_cap3": { Strength: 1, RepairCost: 10000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "mir_helmt3": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 7 }, "icecr2": { Strength: 1, RepairCost: 14400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 7 }, "icecr3": { Strength: 1, RepairCost: 12800, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "eddem_ring2": { Strength: 1, RepairCost: 14000, MarketCategory: "undefined", CraftType: 3, AmmunitionPoints: 8 }, "stalker_cl2": { Strength: 1, RepairCost: 12800, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 10 }, "ed_pendant2": { Strength: 1, RepairCost: 14000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 },
 "sun_staff": { Strength: 85, RepairCost: 17600, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: x => 4 + Math.floor(x / 2) }, "drak_crown3": { Strength: 1, RepairCost: 12000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 8 }, "ed_pendant3": { Strength: 1, RepairCost: 12000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 }, "arm_armor3": { Strength: 1, RepairCost: 10000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }, "eddem_ring3": { Strength: 1, RepairCost: 12000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }, "stalker_cl3": { Strength: 1, RepairCost: 10000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 7 },
 "wind_boots": { Strength: 85, RepairCost: 8700, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: x => 1 + Math.floor(x / 2) }, "mir_helmt1": { Strength: 1, RepairCost: 24000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 11 },
 "wind_helm": { Strength: 85, RepairCost: 7400, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: x => 1 + Math.floor(x / 2) }, "mir_helmt2": { Strength: 1, RepairCost: 20000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 },
 "wind_armor": { Strength: 85, RepairCost: 9500, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: x => 1 + Math.floor(x / 2) }, "wanderer_armor1": { Strength: 80, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 }, "wanderer_armor2": { Strength: 80, RepairCost: 14000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 9 }, "wanderer_armor3": { Strength: 80, RepairCost: 12000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 6 }, "imp_helmet": { Strength: 80, RepairCost: 36000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 14 }, "imp_amul": { Strength: 80, RepairCost: 60000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 19 }, "imp_ring": { Strength: 80, RepairCost: 28000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 17 }, "imp_armor": { Strength: 80, RepairCost: 36000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 }, "imp_cloak": { Strength: 80, RepairCost: 36000, MarketCategory: "cloack", CraftType: 2, AmmunitionPoints: 11 }, "imp_crossbow": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "imp_sword": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 17 }, "imp_boots": { Strength: 80, RepairCost: 36000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 15 }, "imp_shield": { Strength: 80, RepairCost: 36000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 15 }, "imp_dagger": { Strength: 80, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 14 }, "dark_helmet": { Strength: 80, RepairCost: 36000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 14 }, "dark_amul": { Strength: 80, RepairCost: 60000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 19 }, "dark_ring": { Strength: 80, RepairCost: 28000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 17 }, "dark_armor": { Strength: 80, RepairCost: 36000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 }, "dark_cloak": { Strength: 80, RepairCost: 36000, MarketCategory: "cloack", CraftType: 2, AmmunitionPoints: 12 }, "dark_bow": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "dark_axe": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 17 }, "dark_boots": { Strength: 80, RepairCost: 36000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 15 }, "dark_shield": { Strength: 80, RepairCost: 36000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 15 }, "dark_dagger": { Strength: 80, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "heaven_helm": { Strength: 80, RepairCost: 36000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 14 }, "heaven_armr": { Strength: 80, RepairCost: 36000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 }, "heaven_clk": { Strength: 80, RepairCost: 36000, MarketCategory: "cloack", CraftType: 2, AmmunitionPoints: 12 }, "heaven_staff": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 18 }, "heaven_bts": { Strength: 80, RepairCost: 36000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 15 },

"thief_paper": { Strength: 1, RepairCost: 0, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 0 },
"mirror": { Strength: 1, RepairCost: 16000, MarketCategory: "other", CraftType: 0, AmmunitionPoints: 0 },
"stalker_armour1": { Strength: 1, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 15 },
"stalker_armour2": { Strength: 1, RepairCost: 12800, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 12 },
"stalker_armour3": { Strength: 1, RepairCost: 10000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 9 },
"arm_clk1": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 14 },
"arm_clk2": { Strength: 1, RepairCost: 12800, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 10 },
"arm_clk3": { Strength: 1, RepairCost: 10000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 6 },
"pend_a1": { Strength: 1, RepairCost: 20000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 15 },
"pend_a2": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 },
"pend_a3": { Strength: 1, RepairCost: 12000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 },
"lotus1": { Strength: 1, RepairCost: 9600, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 8 },
"lotus2": { Strength: 1, RepairCost: 9000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 },
"lotus3": { Strength: 1, RepairCost: 8400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 },
"eye1": { Strength: 1, RepairCost: 14400, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 16 },
"eye2": { Strength: 1, RepairCost: 12000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 13 },
"eye3": { Strength: 1, RepairCost: 9600, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 },
"stalker_boot1": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 14 },
"stalker_boot3": { Strength: 1, RepairCost: 10000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 7 },
"stalker_boot2": { Strength: 1, RepairCost: 12800, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 11 },
"arm_sekstant1": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 7 },
"arm_sekstant3": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 3 },
"arm_sekstant2": { Strength: 1, RepairCost: 12800, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 5 },
"forest_bolt": { Strength: 1, RepairCost: 10000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 },
"mir_cl1": { Strength: 1, RepairCost: 24000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 10 },
"mir_cl3": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 6 },
"mir_cl2": { Strength: 1, RepairCost: 20000, MarketCategory: "cloack", CraftType: 3, AmmunitionPoints: 8 },
"dung_glefa1": { Strength: 1, RepairCost: 16800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 20 },
"dung_glefa2": { Strength: 1, RepairCost: 14400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 },
"dung_glefa3": { Strength: 1, RepairCost: 11800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 },
"wanderer_hat1": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 13 },
"wanderer_hat3": { Strength: 1, RepairCost: 12000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 6 },
"wanderer_hat2": { Strength: 1, RepairCost: 14000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 },
"ed_svboots1": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 11 },
"ed_svboots3": { Strength: 1, RepairCost: 12000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 },
"ed_svboots2": { Strength: 1, RepairCost: 14000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 8 },
"stalker_aml2": { Strength: 1, RepairCost: 12800, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 },
"stalker_aml1": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 },
"stalker_aml3": { Strength: 1, RepairCost: 10000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 5 },
"stalker_shid1": { Strength: 1, RepairCost: 16000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 16 },
"stalker_shid3": { Strength: 1, RepairCost: 10000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 9 },
"stalker_shid2": { Strength: 1, RepairCost: 12800, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 13 },
"arm_bts1": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 12 },
"arm_bts3": { Strength: 1, RepairCost: 10000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 7 },
"arm_bts2": { Strength: 1, RepairCost: 12800, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 9 },
"icebow1": { Strength: 1, RepairCost: 15200, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 },
"icebow2": { Strength: 1, RepairCost: 13600, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 },
"icebow3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 },
"arm_r1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 15 },
"arm_r2": { Strength: 1, RepairCost: 12800, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 12 },
"arm_r3": { Strength: 1, RepairCost: 10000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 9 },
"heaven_amlt": { Strength: 80, RepairCost: 60000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 20 },
"heaven_rn": { Strength: 80, RepairCost: 28000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 17 },
"heaven_bow": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 },
"heaven_shield": { Strength: 80, RepairCost: 36000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 15 },
"heaven_dagger": { Strength: 80, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 },
"magma_helm": { Strength: 80, RepairCost: 36000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 14 },
"magma_pend": { Strength: 80, RepairCost: 60000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 20 },
"magma_rd": { Strength: 80, RepairCost: 28000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 17 },
"magma_armor": { Strength: 80, RepairCost: 36000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 },
"magma_clc": { Strength: 80, RepairCost: 36000, MarketCategory: "cloack", CraftType: 2, AmmunitionPoints: 12 },
"magma_arb": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 },
"magma_swrd": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 18 },
"magma_boots": { Strength: 80, RepairCost: 36000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 15 },
"magma_lshield": { Strength: 80, RepairCost: 36000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 15 },
"magma_dagger": { Strength: 80, RepairCost: 36000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 },
"fear_scythe": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 18 },
"fear_boots": { Strength: 80, RepairCost: 36000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 15 },
"fear_shield": { Strength: 80, RepairCost: 36000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 15 },
"fear_lantern": { Strength: 80, RepairCost: 36000, MarketCategory: "shield", CraftType: 2, AmmunitionPoints: 15 },
"fear_bonearmour": { Strength: 80, RepairCost: 36000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 },
"fear_cloack": { Strength: 80, RepairCost: 36000, MarketCategory: "cloack", CraftType: 2, AmmunitionPoints: 12 },
"fear_amulk": { Strength: 80, RepairCost: 60000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 20 },
"fear_bow": { Strength: 80, RepairCost: 40000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 },
"fear_maska": { Strength: 80, RepairCost: 36000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 14 },
"chains1": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 8 }, "chains2": { Strength: 1, RepairCost: 9200, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "chains3": { Strength: 1, RepairCost: 8400, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }
, "forest_knives": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }
, "drak_greaves1": { Strength: 1, RepairCost: 16800, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 12 }, "drak_greaves3": { Strength: 1, RepairCost: 11800, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "drak_greaves2": { Strength: 1, RepairCost: 14400, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 9 }
, "smaska1": { Strength: 1, RepairCost: 16000, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 12 }, "smaska3": { Strength: 1, RepairCost: 12800, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 6 }, "smaska2": { Strength: 1, RepairCost: 14400, MarketCategory: "helm", CraftType: 2, AmmunitionPoints: 9 }
, "wanderer_boot1": { Strength: 1, RepairCost: 16000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 12 }, "wanderer_boot3": { Strength: 1, RepairCost: 12000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 6 }, "wanderer_boot2": { Strength: 1, RepairCost: 14000, MarketCategory: "boots", CraftType: 2, AmmunitionPoints: 9 }
, "ed_barrel1": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 8 }, "ed_barrel2": { Strength: 1, RepairCost: 14000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "ed_barrel3": { Strength: 1, RepairCost: 12000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }
, "mir_bow1": { Strength: 1, RepairCost: 24000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 8 }, "mir_bow3": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 4 }, "mir_bow2": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 6 }
, "stalker_iring1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 11 }, "stalker_iring2": { Strength: 1, RepairCost: 12800, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "stalker_iring3": { Strength: 1, RepairCost: 10000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }
, "dglef2": { Strength: 1, RepairCost: 14000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 16 }, "dglef1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 21 }, "dglef3": { Strength: 1, RepairCost: 12000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }
, "arm_handgun1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 16 }, "arm_handgun2": { Strength: 1, RepairCost: 12800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }, "arm_handgun3": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }
, "dun_pendant1": { Strength: 1, RepairCost: 16800, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 16 }, "dun_pendant2": { Strength: 1, RepairCost: 14400, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 13 }, "dun_pendant3": { Strength: 1, RepairCost: 11800, MarketCategory: "necklace", CraftType: 1, AmmunitionPoints: 10 }
, "forest_edge": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 2 }
, "stalker_backsword1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }, "stalker_backsword3": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "stalker_backsword2": { Strength: 1, RepairCost: 12800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 12 }
, "steptopor1": { Strength: 1, RepairCost: 20000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 17 }, "steptopor2": { Strength: 1, RepairCost: 18000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 13 }, "steptopor3": { Strength: 1, RepairCost: 15200, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 9 }
, "wandr_cloack1": { Strength: 1, RepairCost: 16000, MarketCategory: "cloack", CraftType: 1, AmmunitionPoints: 12 }, "wandr_cloack2": { Strength: 1, RepairCost: 14000, MarketCategory: "cloack", CraftType: 1, AmmunitionPoints: 8 }, "wandr_cloack3": { Strength: 1, RepairCost: 12000, MarketCategory: "cloack", CraftType: 1, AmmunitionPoints: 5 }
, "armad_aml2": { Strength: 1, RepairCost: 12800, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 14 }, "armad_aml1": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 17 }, "armad_aml3": { Strength: 1, RepairCost: 10000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 10 }
, "sv_order1": { Strength: 1, RepairCost: 16000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 16 }, "sv_order2": { Strength: 1, RepairCost: 12800, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 12 }, "sv_order3": { Strength: 1, RepairCost: 9600, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 8 }
, "stalker_ark2": { Strength: 1, RepairCost: 12800, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 6 }, "stalker_ark1": { Strength: 1, RepairCost: 16000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 8 }, "stalker_ark3": { Strength: 1, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 4 }
, "stalker_sring1": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 11 }, "stalker_sring2": { Strength: 1, RepairCost: 12800, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }, "stalker_sring3": { Strength: 1, RepairCost: 10000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 6 }
, "santas_sack": { Strength: 50, RepairCost: 10000, MarketCategory: "backpack", CraftType: 0, AmmunitionPoints: 2 }
, "icehammer3": { Strength: 80, RepairCost: 12800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "icehammer1": { Strength: 80, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 18 }, "icehammer2": { Strength: 80, RepairCost: 14400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }
, "mirh_ring1": { Strength: 1, RepairCost: 24000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 14 }, "mirh_ring2": { Strength: 1, RepairCost: 20000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 1 }, "mirh_ring3": { Strength: 1, RepairCost: 16000, MarketCategory: "ring", CraftType: 3, AmmunitionPoints: 8 }
, "arm_tesak1": { Strength: 1, RepairCost: 16000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 19 }, "arm_tesak3": { Strength: 1, RepairCost: 10000, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 11 }, "arm_tesak2": { Strength: 1, RepairCost: 12800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 15 }
, "neut_leaf": { Strength: 1, RepairCost: 10000, MarketCategory: "necklace", CraftType: 3, AmmunitionPoints: 11 }
, "dun_bw1": { Strength: 1, RepairCost: 16800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 10 }, "dun_bw2": { Strength: 1, RepairCost: 14400, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 7 }, "dun_bw3": { Strength: 1, RepairCost: 11800, MarketCategory: "weapon", CraftType: 1, AmmunitionPoints: 5 }
, "honorarmour_1": { Strength: 80, RepairCost: 16000, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 14 }
, "honorarmour_2": { Strength: 80, RepairCost: 14400, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 11 }
, "honorarmour_3": { Strength: 80, RepairCost: 12800, MarketCategory: "cuirass", CraftType: 2, AmmunitionPoints: 8 }};

const EcostatDetailsIds = { 92: "wzzamulet16", 12: "amulet_of_luck", 120: "samul14", 107: "wzzamulet13", 66: "large_shield", 23: "hauberk", 131: "boots2", 150: "sword18", 95: "warring13", 98: "armor15", 126: "sarmor16", 154: "armor17", 160: "dagger16", 15: "leather_shiled", 142: "leatherboots", 140: "leatherplate", 18: "leather_helm", 100: "wwwring16", 149: "dring5", 76: "warriorring", 152: "dring18", 146: "dring15", 128: "sring4", 21: "doubt_ring", 159: "dring21", 139: "sring17", 32: "chain_coif", 61: "warrior_pendant", 56: "power_pendant", 156: "amulet19", 70: "mif_lboots", 88: "bow14", 155: "bow17", 132: "scloack8", 14: "bravery_medal", 48: "power_sword", 25: "requital_sword", 87: "firsword15", 121: "ssword16", 130: "ssword8", 127: "ssword10", 30: "broad_sword", 34: "def_sword", 135: "sarmor9", 147: "dring12", 102: "miff_plate", 74: "mif_sword", 24: "soul_cape", 116: "sarmor13", 90: "boots13", 115: "ssword13", 99: "zxhelmet13", 97: "shield13", 157: "samul17", 19: "verve_ring", 153: "dring9", 125: "scloack16", 114: "sboots12", 86: "mm_sword", 113: "shelm12", 124: "sboots16", 91: "boots15", 148: "boots17", 133: "sboots9", 47: "ciras", 16: "steel_blade", 51: "steel_helmet", 143: "s_shield", 63: "full_plate", 50: "steel_boots", 136: "samul8", 129: "sring10", 73: "mif_hboots", 72: "mif_hhelmet", 123: "shelm16", 138: "shelm8", 82: "myhelmet15", 151: "helmet17", 49: "dragon_shield", 83: "shield16", 158: "shield19", 134: "sshield5", 112: "sshield11", 17: "defender_shield", 118: "sshield14" };
const Strings = {
    "ru": {
        BreakingTheRules: "<b>Функция нарушает правила 2.2 ...приводит в действие игровые механизмы.<br>Используете на свой страх и риск!</b>",
        Lot: "Товар",
        Cost: "Цена",
        TimeLeft: "Завершение",
        BattlePrice: "Цена боя",
        Strength: "Прочность",
        RestStrength: "Оставшаяся прочность",
        OptimalStrength: "До прочности",
        Combats: "Боев",
        Options: "Настройки",
        BestApproach: "Лучшее приближение к минимальной цене (%)",
        GoodApproach: "Хорошее приближение к минимальной цене (%)",
        BuyInfo: "Информация о покупке",
        ShowAfterRepairBattleCostInInventory: "Показывать в инвентаре стоимость боя после ремонта",
        SmithLevelCaption: "Уровень кузнеца (0-9)",
        SmithRewardPercentCaption: "Вознаграждение кузнецу (10%-150%)",
        EditLotInfo: "О покупке",
        Spended: "Проведено",
        Remaining: "Осталось",
        ShopAndFactoryPrice: "Цена магазина и предприятия",
        ResidualValue: "Остаточная стоимость",
        gold: "золото",
        wood: "дерево",
        ore: "руда",
        mercury: "ртуть",
        sulfur: "сера",
        crystals: "кристаллы",
        gems: "самоцветы",
        diamonds: "бриллианты",
        Total: "Итого",
        BuyNow: "Купить сразу!",
        MarketPrice: "Цена на рынке",
        ToUpdateTheCertificatePrice: "Чтобы цена обновилась, зайдите на рынок (щелчок по картинке сертификата)",
        ArtBulkTtransferEnabledName: "Включить массовую передачу артефактов",
        Receiver: "Получатель",
        Transfer: "Передача",
        FillReceiver: "Задайте получателя",
        CancelAll: "Отменить всё",
        IntoOwnership: "В распоряжение",
        WithRecallIn: "С возвратом через",
        IntoRepairs: "В ремонт",
        PercentOfRepairCost: "% от цены ремонта (10 - 150)",
        BulkTransferBattlesNum: "На боев",
        BulkTransferRecallTime: "на",
        BulkTransferGold: "за",
        Days: "Дней",
        TransferData: "Параметры передачи",
        AllowRepairing: "разрешить ремонт",
        ForAll: "Для всех",
        ForThis: "Для данного",
        ClearList: "Очистить список",
        UnderRepair: "В ремонте",
        SmithSchedulingEnabledName: "Включить расписание в кузнице",
        Sale: "Продать",
        AsForAll: "Как для всех",
        Forbid: "Запретить",
        Allow: "Разрешить",
        ToMarket: "На рынок",
        BeginRepairOnSmithFreeName: "Начинать ремонт при освобождении кузницы",
        WithRecallInTitle: "Надо задать ненулевые цену, количество дней и боёв",
        IntoOwnershipTitle: "Можно задать цену или оставить пустой",
        IntoRepairsTitle: "Должен быть задан % кузнецу",
        IncomeViewEnabledName: "Включить просмотр дохода",
        ShowResourcesCostPanelName: "Показывать панель стоимости ресурсов",
        ArtCost: "Стоимость арта",
        CraftCostString: "Стоимость крафта",
        Recalc: "Расчет",
        RecalcFromDaily: "Рассчитать стоимость крафта из статистики цен на элементы с Daily",
        BeginRepairClanDepositoryName: "Начинать ремонт кланового склада"
    },
    "en": {
        BreakingTheRules: "<b>The function violates rules 2.2...activates game mechanisms.<br>Use at your own risk!<b>",
        Lot: "Lot",
        Cost: "Cost",
        TimeLeft: "Time left",
        BattlePrice: "Battle price",
        Strength: "Strength",
        RestStrength: "Rest strength",
        OptimalStrength: "Optimal strength",
        Combats: "Combats",
        Options: "Options",
        BestApproach: "Best approach to min price (%)",
        GoodApproach: "Good approach to min price (%)",
        BuyInfo: "Buy info",
        ShowAfterRepairBattleCostInInventory: "Show afterRepairBattleCost in inventory",
        SmithLevelCaption: "Smith level (0-9)",
        SmithRewardPercentCaption: "Smith reward (10%-150%)",
        EditLotInfo: "Lot info",
        Spended: "Spended",
        Remaining: "Remaining",
        ShopAndFactoryPrice: "Shop and factory price",
        ResidualValue: "Residual value",
        gold: "gold",
        wood: "wood",
        ore: "ore",
        mercury: "mercury",
        sulfur: "sulfur",
        crystals: "crystals",
        gems: "gems",
        diamonds: "diamonds",
        Total: "Total",
        BuyNow: "Buy now!",
        MarketPrice: "Market price",
        ToUpdateTheCertificatePrice: "To update the price, go to the market (click on the certificate image)",
        ArtBulkTtransferEnabledName: "Enable bulk arts transfer",
        Receiver: "Receiver",
        Transfer: "Transfer",
        FillReceiver: "Fill receiver",
        CancelAll: "Cancel all",
        IntoOwnership: "Into ownership",
        WithRecallIn: "With recall in",
        IntoRepairs: "Into repairs",
        PercentOfRepairCost: "% of repair cost (10 - 150)",
        BulkTransferBattlesNum: "Combats",
        BulkTransferRecallTime: "for",
        BulkTransferGold: "for",
        Days: "Days",
        TransferData: "Transfer data",
        AllowRepairing: "Allow repairing",
        ForAll: "For all",
        ForThis: "For this",
        ClearList: "Clear list",
        UnderRepair: "Under repair",
        SmithSchedulingEnabledName: "Enable smith scheduling",
        Sale: "Sale",
        AsForAll: "As for all",
        Forbid: "Forbid",
        Allow: "Allow",
        ToMarket: "To the market",
        BeginRepairOnSmithFreeName: "Begin repair on smith free",
        WithRecallInTitle: "It is necessary to set a non-zero price, number of days and fights",
        IntoOwnershipTitle: "You can set a price or leave it blank",
        IntoRepairsTitle: "Must be given % to the blacksmith",
        IncomeViewEnabledName: "Enable income view",
        ShowResourcesCostPanelName: "Show resources cost panel",
        ArtCost: "Art cost",
        CraftCostString: "Craft cost",
        Recalc: "Recalc",
        RecalcFromDaily: "Recalc craft cost from daily elements statistics",
        BeginRepairClanDepositoryName: "Begin repair clan depository"
    }
};
const LocalizedString = Strings[document.documentElement.lang];
const StockArtifactIds = [ "finecl", "super_dagger", "sun_staff", "cold_sword2014", "wind_armor", "wind_boots", "wind_helm", "cold_shieldn", "coldring_n", "coldamul", "sun_boots", "sun_armor", "sun_helm", "sun_ring", "clover_amul", "lbow" ];
const SmithRecoveryEfficiency = [10, 20, 30, 40, 50, 60, 70, 80, 90, 90];
const inventoryStatsPanelSelector = doc => doc.querySelector("div.inventory_stats");
const inventoryArtsPanelSelector = doc => doc.querySelector("div#inv_doll_inside");
const craftElementsAmount = 45;
let notificationNumber = 0;
//const auctionCategoriesCaptionsIds = ["mark_helm", "mark_necklace", "mark_cuirass", "mark_cloack", "mark_weapon", "mark_shield", "mark_boots", "mark_ring", "mark_backpack", "mark_elements", "mark_other", "mark_thief", "mark_tactic", "mark_verb", "mark_medals", "mark_relict", "mark_dom", "mark_cert", "mark_obj_share", "mark_part"];
//const auctionCategoriesIds = ["mark_info_helm", "mark_info_necklace", "mark_info_cuirass", "mark_info_cloack", "mark_info_weapon", "mark_info_shield", "mark_info_boots", "mark_info_ring", "mark_info_backpack", "mark_info_elements", "mark_info_other", "mark_info_thief", "mark_info_tactic", "mark_info_verb", "mark_info_medals", "mark_info_relict", "mark_info_dom", "mark_info_cert", "mark_info_obj_share", "mark_info_part"];
const auctionCategoriesUrlNames = ["helm", "necklace", "cuirass", "cloack", "weapon", "shield", "boots", "ring", "backpack", "elements", "other", "thief", "tactic", "verb", "medals", "relict", "dom", "cert", "obj_share", "part"];
const resourcesPath = `${location.protocol}//${location.host.replace("www", "dcdn")}`;

// Start
// showBigData(artefacts.reduce((t, a) => t + `, "${a.id}": { Strength: ${a.usual_dur}, RepairCost: ${a.repair_cost} }`, ""));
main();
function main() {
    processNewArts();
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
`);
    sendArtsTo();
    countResources();
    if(location.pathname == '/mod_workbench.php' && getUrlParamValue(location.href, "type") != "repair") {
        const subdivRow = getParent(document.querySelector("img[src$='mod_weapon.gif']"), "tr", 2);
        subdivRow.previousElementSibling.insertAdjacentHTML("beforeend", subdivRow.innerHTML);
        subdivRow.remove();
        //const new_mod = document.querySelector("form[name=fmain] > select[name=new_mod]");
        const elprice = document.querySelector("div#elprice");
        if(elprice) {
            observe(elprice, countSelectedCraftCost);
        }
        const resImages = Array.from(document.querySelectorAll(`img[src^='${resourcesPath}/i/gn_res/']`));
        const avalableResources = resImages.map(x => {
            const code = /\/([a-z_]+).png/.exec(x.src)[1];
            const amount = parseInt(x.nextElementSibling.innerText.replace(/,/g, ""));
            return { code: code, amount: amount, imageSrc: x.src };
        });
        const resources = ElementNames.map(x => {
           const res = avalableResources.find(y => y.code == x);
           return { code: x, amount: res?.amount || 0, imageSrc: `${resourcesPath}/i/gn_res/${x}.png` };
        });
        const resCell = resImages.length > 0 ? resImages[0].closest("td") : null;
        if(resCell) {
            const elementsPrices = JSON.parse(getValue("ElementPrices", "{}"));

            resCell.innerHTML = (isEn ? "Your disposal: " : "В наличии: ") + resources.map(x => `<a style="display: inline-block; vertical-align: middle;" href="/auction.php?cat=elements&sort=0&art_type=${x.code}">
<div style="position: relative; width: 50px; height: 50px; background: url(https://dcdn3.heroeswm.ru/i/army_html/frame_lvl1.png) no-repeat, url(https://dcdn3.heroeswm.ru/i/army_html/fon_lvl1.png) no-repeat;
    background-size: auto, auto;
  background-size: 100% 100%;">
    <img style="position: absolute; width: 100%; height: auto; top: 0; left: 0;" src="${x.imageSrc}" alt="${localElementNames[x.code]}" title="${isEn ? "Buy" : "Закупить"}">
    <div style="position: absolute; right: .2em !important; bottom: .1em !important; text-align: right; color: #f5c140; font-weight: bold; font-size: 120%; text-shadow: 0px 0px 2px #000, 0px 0px 2px #000;">${x.amount}</div>
    <div id="MarketPriceDiv${x.code}" style="position: absolute; right: .2em !important; bottom: -1.1em !important; text-align: right; color: black; font-weight: bold; font-size: 100%;" title="${isEn ? "Market price" : "Рыночная цена"}">${(elementsPrices[x.code] || 0).toLocaleString()}</div>
</div></a>`).join("");

            const refreshElementsPricesButton = addElement("input", { type: "button", class: "button-62", value: isEn ? "Prices" : "Цены", title: isEn ? "Refresh elements prices" : "Обновить цены на элементы" }, resCell, "beforeend");
            refreshElementsPricesButton.addEventListener("click", async function(e) {
                await getMarketElementPrices(e);
                const elementsPrices = JSON.parse(getValue("ElementPrices", "{}"));
                Object.keys(elementsPrices).forEach(x => {
                    const div = document.getElementById(`MarketPriceDiv${x}`); //                    console.log(div);
                    if(div) {
                        div.innerText = elementsPrices[x].toLocaleString();
                    }
                });
            });
        }
    }
    if(location.pathname == '/vd_send.php' || location.pathname == '/feb23_send.php' || location.pathname == '/mart8_send.php') {
        const messageName = location.pathname == '/vd_send.php' ? "ValentinesDayMessage" : (location.pathname == '/feb23_send.php' ? "DefenderDay" : (location.pathname == '/mart8_send.php' ? "WomenDayMessage" : "HolidayMessage"));
        //console.log(`messageName: ${messageName}, message: ${getPlayerValue(messageName, "")}`)
        const messageArea = document.querySelector("textarea[name=msg]");
        if(messageArea) {
            messageArea.value = getPlayerValue(messageName, "");
            messageArea.addEventListener("change", function() { setPlayerValue(messageName, this.value); });
            messageArea.onfocus = "this.select();";
        }
    }
    if(location.pathname == '/pl_info_realty.php') {
        certificateAuctionReferences();
    }
    if(location.pathname == '/auction.php') {
        const categoriesContainer = document.querySelector(`#mark_info_${auctionCategoriesUrlNames[0]}`).closest("td");
        const categoriesCaption = categoriesContainer.parentNode.previousElementSibling.firstChild;
        categoriesCaption.insertAdjacentHTML("beforeend", `&nbsp;<b><a href="auction_new_lot.php" title="${isEn ? "Post a lot" : "Выставить лот"}">${isEn ? "Lot" : "Лот"}</a></b>`);

        extendLotsTable(document, location.href);

        smoothLotsRefresh();
    }
    if(location.pathname == '/art_info.php') {
        const artId = getUrlParamValue(location.href, "id");
        const artUid = getUrlParamValue(location.href, "uid");;
        const s_art_insideDiv = document.querySelector("div.s_art_inside");
        if(artUid) {
            AppendLotInfo(s_art_insideDiv, artUid);

            const home_art_infoDiv = document.querySelector("div.home_art_info");
            const buttonsDiv = home_art_infoDiv.nextElementSibling;
            if(buttonsDiv) {
                const art_info_mod_textDiv = document.querySelector("div.art_info_mod_text");
                if(art_info_mod_textDiv) {
                    var craftInfo = /\[(.+)\]/.exec(art_info_mod_textDiv.innerText)[1];
                    //console.log(craftInfo);
                }
                const openArtPriceSettingsRef = addElement("a", { href: "#", style: "text-decoration: none;", innerHTML: `
                <div class="s_art_btn_small s_art_btn_margin" style="padding: 0.4em 0;font-size: 11px;">
                <div class="s_art_prop_amount_icon s_art_bold_font" style="padding-left: 0;">${LocalizedString.EditLotInfo}</div></div>` }, buttonsDiv);
                openArtPriceSettingsRef.addEventListener("click", function() { openArtPriceSettings(artUid, artId, craftInfo); }, false);
            }
        } else {
            const costLable = Array.from(s_art_insideDiv.querySelectorAll("b")).find(x => x.innerText == (isEn ? "Cost:" : "Стоимость:")); // Ищем таблицу со стоимостью в ресурсах
            const artCostInResourcesTable = costLable?.nextElementSibling.nodeName.toLowerCase() == "table" ? costLable.nextElementSibling : undefined;
            if(artCostInResourcesTable) {
                const costInfoRow = artCostInResourcesTable.rows[0];
                const td = addElement("td", undefined, costInfoRow);
                addShopArtPriceAndBattleCost(artId, costInfoRow, td);
            } else {
                const div = addElement("div");
                s_art_insideDiv.childNodes[1].after(div);
                addShopArtPriceAndBattleCost(artId, div, div);
            }
        }
    }
    if(location.pathname == '/mod_workbench.php') {
        const formElement = document.querySelector("form[name='fmain']");
        if(formElement) {
            const idInput = formElement.querySelector("input[name='art_id2']");
            if(idInput && idInput.value != "") {
                AppendLotInfo(formElement, idInput.value, getParent(formElement, "TABLE"));
            }
        }
    }
    if(location.pathname == '/inventory.php') {
        setPlayerValue("InventoryArts", JSON.stringify(Array.from(win.arts).reduce((t, x) => { t[x.id] = x.art_id; return t; }, {})));//        console.log(JSON.parse(getPlayerValue("InventoryArts", "{}")));
        drawArtsTtransferPanel();
        attachArtTtransferActionsToItems();
        addAfterRepairCombatCostToInventory();
        observe(document.querySelector("div#inventory_block"), function() { attachArtTtransferActionsToItems(); addAfterRepairCombatCostToInventory(); });
        addBattlePriceToInventory();
        observe([inventoryArtsPanelSelector, inventoryStatsPanelSelector], addBattlePriceToInventory);
        kitsDataBind();
    }
    if(location.pathname == "/auction_new_lot.php") {
        auctionNewLot();
    }
    if(location.pathname == '/shop.php' && !getUrlParamValue(location.href, "rent")) {
        addShopArtsPriceAndBattleCost();
    }
    if(location.pathname == '/object-info.php') {
        getObjectPrice();
    }
    if(location.pathname == '/ecostat.php') {
        let tableDiv = document.getElementById("tableDiv");
        let ecostatTable = tableDiv.querySelector("table");
        for(const row of ecostatTable.rows) {
            let ref = row.cells[0].querySelector("a");
            if(ref) {
                let ecostatDetailsId = getUrlParamValue(ref.href, "id");
                if(ecostatDetailsId in EcostatDetailsIds) {
                    let artId = EcostatDetailsIds[ecostatDetailsId];
                    let averagePrice = parseInt(row.cells[2].innerText.replace(/,/g, ""));
                    let currentSavedFactoryPrice = parseInt(getValue("ShopArtFactoryPrice_" + artId, 0));
                    //console.log([artId, averagePrice, currentSavedFactoryPrice]);
                    if(averagePrice > 0 && (currentSavedFactoryPrice > 0 && averagePrice < currentSavedFactoryPrice || currentSavedFactoryPrice == 0)) {
                        setValue("ShopArtFactoryPrice_" + artId, averagePrice);
                    }
                }
            }
        }
    }
    if(location.pathname == '/ecostat_details.php') {
        let tableDiv = document.getElementById("tableDiv");
        let ecostatTable = tableDiv.querySelector("table");
        let artId = getUrlParamValue(location.href, "r");
        if(!artId) {
            let ecostatDetailsId = getUrlParamValue(location.href, "id");
            if(ecostatDetailsId) {
                artId = EcostatDetailsIds[ecostatDetailsId];
            }
        }
        //console.log(`artId: ${artId}`);
        if(artId) {
            let minPrice = 0;
            for(const row of ecostatTable.rows) {
                let amount = parseInt(row.cells[2].innerText);
                if(amount > 0) {
                    let price = parseInt(row.cells[3].innerText.replace(/,/g, ""));
                    if(price < minPrice || minPrice == 0) {
                        minPrice = price;
                    }
                }
            }
            //console.log(`minPrice: ${minPrice}`);
            if(minPrice > 0) {
                saveBestArtPrice(artId, minPrice, true);
            } else {
                deleteValue("ShopArtFactoryPrice_" + artId); // На предприятиях кончилось
            }
        }
    }
    if(location.pathname == '/home.php' || location.pathname == '/pl_info.php') {
        let playerLevel = PlayerLevel;
        if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") != PlayerId) {
            playerLevel = parseInt(new RegExp(`<b>${isEn ? "Combat level" : "Боевой уровень"}: (\\d+?)<\\/b>`).exec(document.documentElement.innerHTML)[1]);
        }
        addBattlePrice(playerLevel);
        let artsUpdatePanel;
        let statsUpdatePanel;
        if(location.pathname == '/home.php') {
            if(isNewPersonPage) {
                artsUpdatePanel = document.querySelector("div#inv_doll_stats");
            } else {
                artsUpdatePanel = document.querySelector("body > center table.wb > tbody > tr:nth-child(3) > td > table:nth-child(2)");// getParent(document.querySelector("div.arts_info.shop_art_info"), "table");
            }
            statsUpdatePanel = isNewPersonPage ? document.getElementById("home_css_stats_wrap_div") : getParent(document.querySelector("img[src*='attr_attack']"), "table", 2);
        }
        if(location.pathname == '/pl_info.php' && getUrlParamValue(location.href, "id") == PlayerId) {
            artsUpdatePanel = getParent(document.querySelector("div[class^='slot']"), "div");
            statsUpdatePanel = getParent(document.querySelector("img[src*='attr_attack']"), "table");
        }
        if(artsUpdatePanel) {
            observe([statsUpdatePanel, artsUpdatePanel], addBattlePrice);
        }
    }
    createPersonPageSellResourceReferences();
    smithScheduling();
    findClanDepository();
    findClanDepositoryRepair();
    checkClanDepositoryNeedRepair();
    showTradesToMeIndicator();
    showThresholdPricesIndicator();
    if(location.pathname == "/house_info.php") {
        const artSelect = document.querySelector("form[name=f_push] > select[name=art]");
        if(artSelect) {
            const houseId = getUrlParamValue(location.href, "id");
            const arts = [...artSelect.querySelectorAll("option")].map(x => { return { id: Number(x.value), name: x.innerText }; }).filter(x => x.id > 0);
            if(arts.length > 0) {
                const artsRow = artSelect.closest("tr");

                const flatArtsRow = addElement("tr", { innerHTML: `<td colspan=6><table id=flatArtsTable class=smithTable></table></td>`}, artsRow, "afterend");
                const flatArtsTable = flatArtsRow.querySelector("table#flatArtsTable");
                //console.log(flatArtsTable);
                for(const art of arts) {
                    const row = addElement("tr", { innerHTML: `<td>${art.id}</td><td>${art.name}</td><td><input name=putArtButton type=button class="button-62" value="${isEn ? "Put" : "Поместить"}"></td>` }, flatArtsTable);
                    row.querySelector("input[name=putArtButton]").addEventListener("click", async function() { await postRequest("/house_info.php", `id=${houseId}&action=put_art&art=${art.id}`); location.reload(); } );
                }
                const spoiler = addElement("div", { id: "putArtsToHoumePanelSpoiler",  style: "display: inline-block; cursor: pointer;", innerHTML: `<img src="https://dcdn.heroeswm.ru/i/inv_im/btn_expand.svg" style="vertical-align: middle;">`, title: isEn ? "Show all artifacts" : "Показать все артефакты" }, artSelect.parentNode);
                spoiler.addEventListener("click", function() { setPlayerValue(this.id, !getPlayerBool(this.id)); bindSpoiler(this.id); });
                bindSpoiler("putArtsToHoumePanelSpoiler");
            }
        }
    }
    if(location.pathname == '/auction.php') {
        const category = getUrlParamValue(location.href, "cat") || "my";
        if(category == "my") {
            if(getPlayerBool("storePlayerBits")) {
                playerBitsTableDatabind();
            }
        }
    }
}
function processNewArts() {
    const newArts = JSON.parse(getValue("newArts", "[]"));
    let needPack = false;
    newArts.map(x => x).forEach((a, i) => {
        const existingArt = ArtifactInfo[a.ArtId];
        if(existingArt) {
            newArts.splice(i, 1);
            needPack = true;
        } else {
            ArtifactInfo[a.ArtId] = a;
        }
    });
    if(needPack) {
        setValue(JSON.stringify(newArts));
    }
    if(newArts.length > 0) {
        showBigData(newArts.reduce((t, e) => t + `, "${e.ArtId}": { Strength: ${e.Strength}, RepairCost: ${e.RepairCost}, MarketCategory: "${e.MarketCategory}", CraftType: ${e.CraftType}, AmmunitionPoints: ${e.AmmunitionPoints} }`, ""));
    }
}
function playerBitsTableDatabind() {
    const ss2 = document.querySelector("select[name='ss2']");
    const ss2Table = getParent(ss2, "table");
    const playerBitsTable = document.getElementById("playerBitsTable") || addElement("table", { id: "playerBitsTable", class: "smithTable" }, ss2Table.parentNode);
    playerBitsTable.innerHTML = "";
    const bits = JSON.parse(getPlayerValue("bitsStorage", "[]")).map(x => { x.art = Object.assign(new ArtifactLot, JSON.parse(x.art)); return x; });
    playerBitsTable.style.display = bits.length == 0 ? "none" : "";
    console.log(bits);
    addElement("tr", { innerHTML: `
<th>${isEn ? "Product" : "Товар"}</th>
<th>${isEn ? "Bid" : "Лот"}</th>
<th>${isEn ? "Last bid owner" : "Владелец максимальной ставки"}</th>
<th>${isEn ? "Auction end" : "Окончание торгов"}</th>
<th></th>` }, playerBitsTable);
    for(const bit of bits) {
        const bitRow = addElement("tr", {}, playerBitsTable);
        bitRow.innerHTML = `
<td>
    <a href="auction.php?cat=${bit.category}&art_type=${bit.art.Id}" style="text-decoration:none;">${bit.artName} ${bit.art.LotStrength ? `[${bit.art.RestLotStrength}/${bit.art.LotStrength}]` : ""}</a>
</td>
<td>
    <a class="pi" href="auction_lot_protocol.php?id=${bit.lotId}&crc=${bit.lotCrc}">#${bit.lotId}</a>
</td>
<td>
    <a class="pi" href="pl_info.php?id=${bit.maxBitOwnerId}">${bit.maxBitOwnerName}</a>
</td>
<td>
    ${new Date(bit.lotEndTime).toLocaleString()}${bit.lotEndTime < getServerTime() ? (isEn ? " expired" : " истекло") : ""}
</td>
<td>
    <input type=button class="button-62" value="&#215" name=deleteBitButton title="${isEn ? "Delete" : "Удалить"}">
</td>
`;
        bitRow.querySelector("input[name=deleteBitButton]").addEventListener("click", function() {
            const bits = JSON.parse(getPlayerValue("bitsStorage", "[]"));
            const bitIndex = bits.findIndex(x => x.lotId == bit.lotId);
            if(bitIndex > -1) {
                bits.splice(bitIndex, 1);
                setPlayerValue("bitsStorage", JSON.stringify(bits));
                playerBitsTableDatabind();
            }
        });
    }
}
function bindSpoiler(spoilerId) {
    const spoiler = document.getElementById(spoilerId);
    if(spoiler) {
        const spoiled = getPlayerBool(spoilerId);
        spoiler.querySelector("img").style.transform = spoiled ? 'rotate(0deg)' : 'rotate(90deg)';
        spoiler.closest("tr").nextElementSibling.style.display = spoiled ? "none" : "";
    }
}
// Асинхронная работа с рынком
function smoothLotsRefresh() {
    if(!getPlayerBool("SmoothLotsRefresh", true)) {
        return;
    }
    printNewSaleLabel();
    window.addEventListener("keydown", function(e) { getArtLots(e); });

    const categoriesContainer = document.querySelector(`#mark_info_${auctionCategoriesUrlNames[0]}`).closest("td");
    categoriesContainer.style.minWidth = "210px";

    const categoriesCaption = categoriesContainer.parentNode.previousElementSibling.firstChild;
    const artsHighlightingCheckboxesCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Show checkboxes for highlighting artifactst" : "Показать чекбоксы для выделения артефактов" });
    artsHighlightingCheckboxesCheckbox.checked = getPlayerBool("artsHighlightingCheckboxes", true);
    artsHighlightingCheckboxesCheckbox.addEventListener("change", function() { setPlayerValue("artsHighlightingCheckboxes", this.checked); location.reload(); })
    categoriesCaption.insertAdjacentElement("afterbegin", artsHighlightingCheckboxesCheckbox);

    const hideArtsInCategoryCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Show selected" : "Показывать отмеченные" });
    hideArtsInCategoryCheckbox.checked = getPlayerBool("hideArtsInCategory");
    hideArtsInCategoryCheckbox.addEventListener("change", function() { setPlayerValue("hideArtsInCategory", this.checked); location.reload(); })
    categoriesCaption.insertAdjacentElement("afterbegin", hideArtsInCategoryCheckbox);

    const collapseOtherCategoriesCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Collapse categories when selecting a new one" : "Сворачивать категории при выборе новой" });
    collapseOtherCategoriesCheckbox.checked = getPlayerBool("collapseOtherCategories");
    collapseOtherCategoriesCheckbox.addEventListener("change", function() { setPlayerValue("collapseOtherCategories", this.checked); })
    categoriesCaption.insertAdjacentElement("afterbegin", collapseOtherCategoriesCheckbox);

    const limitCategoryHeightCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Limit category height" : "Ограничить высоту категории" });
    limitCategoryHeightCheckbox.checked = getPlayerBool("limitCategoryHeight");
    limitCategoryHeightCheckbox.addEventListener("change", function() { setPlayerValue("limitCategoryHeight", this.checked); location.reload(); })
    categoriesCaption.insertAdjacentElement("afterbegin", limitCategoryHeightCheckbox);

    // const categoryLotsContainer = document.querySelector("table.wb > tbody > tr:nth-child(2) > td:nth-child(2)");
    // categoryLotsContainer.style.maxHeight = "900px";
    // categoryLotsContainer.style.overflowY = "auto";

    Array.from(categoriesContainer.querySelectorAll("a[href*='auction.php?cat=res']")).forEach(x => {
        x.addEventListener("click", function(e) { e.preventDefault(); refreshLots(x.href); });
    });
    auctionCategoriesUrlNames.forEach(x => {
        const categoryContainer = document.querySelector(`#mark_info_${x}`);
        if(categoryContainer) {
            if(getPlayerBool("limitCategoryHeight")) {
                categoryContainer.style.maxHeight = "300px";
                categoryContainer.style.overflowY = "auto";
            }
            replaceArtsCategoryMenuItems(categoryContainer);
            observe(categoryContainer, function() { replaceArtsCategoryMenuItems(categoryContainer); });
        }
    });
    const categoryName = getUrlParamValue(location.href, "cat");
    if(!auctionCategoriesUrlNames.includes(categoryName)) {
        return;
    }
    const categoryContainer = document.querySelector(`#mark_info_${categoryName}`);
    replaceArtsBuyForms(location.href, categoryContainer);
}
function replaceArtsCategoryMenuItems(categoryContainer) {
    if(!categoryContainer) {
        return;
    }
    if(categoryContainer.innerHTML != "" && getPlayerBool("collapseOtherCategories")) {
        auctionCategoriesUrlNames.filter(x => `mark_info_${x}` != categoryContainer.id).forEach(x => {
            const toggleMark = document.querySelector(`#mark_${x} a`);
            //console.log(`mark selector: #mark_${x} a`);
            if(toggleMark && toggleMark.onclick.toString().includes("a2_")) {
                toggleMark.click();
            }
        });
    }
    const artRefs = categoryContainer.querySelectorAll("a");
    const divs = [];
    for(const artRef of artRefs) {
        const artId = getUrlParamValue(artRef.href, "art_type");
        const div = addElement("div", { artId: artId, artLotsUrl: artRef.href, innerHTML: `<span>${artRef.firstChild.innerHTML}</span>`, style: `cursor: pointer; width: 100%; min-height: 15px;` });
        div.addEventListener("click", function() { refreshLots(artRef.href, categoryContainer); });
        divs.push(div);

        if(getPlayerBool("artsHighlightingCheckboxes", true)) {
            const showArtInCategoryCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Show artifact" : "Показывать артефакт" });
            showArtInCategoryCheckbox.checked = getPlayerBool(`showArtInCategory${artId}`);
            showArtInCategoryCheckbox.addEventListener("change", function(e) { setPlayerValue(`showArtInCategory${artId}`, this.checked); })
            showArtInCategoryCheckbox.addEventListener("click", function(e) { e.stopPropagation(); })
            div.insertAdjacentElement("afterbegin", showArtInCategoryCheckbox);
        }
        div.style.display = getPlayerBool("hideArtsInCategory") && !getPlayerBool(`showArtInCategory${artId}`) ? "none" : "";
    }
    categoryContainer.innerHTML = "";
    divs.forEach(x => categoryContainer.insertAdjacentElement("beforeend", x));
    colorizeCategory(categoryContainer);
}
function colorizeCategory(categoryContainer) {
    if(!categoryContainer) {
        return;
    }
    const artRefs = Array.from(categoryContainer.querySelectorAll("div")).filter(x => x.style.display == "");
    let isEven = false;
    const selectedArtId = getUrlParamValue(location.href, "art_type");
    for(const artRef of artRefs) {
        const isSelected = artRef.getAttribute("artId") && selectedArtId && artRef.getAttribute("artId") == selectedArtId;
        artRef.style.backgroundColor = isSelected ? "#66bfbf" : (isEven ? "#fcfefe" : "#eaf6f6");
        isEven = !isEven;
        if(isSelected) {
            //categoryContainer.scrollTop = artRef.offsetTop;
            artRef.scrollIntoView({block: "nearest", inline: "nearest", behavior: "auto"});
        }
        artRef.setAttribute("viewingArt", isSelected);
    }
}
async function refreshLots(categoryUrl, categoryContainer) {
    const panelSelectors = [doc => doc.querySelector("table.wb > tbody > tr:nth-child(2) > td:nth-child(2)"), doc => isNewInterface ? doc.querySelector("div#ResourcesPanel") : doc.querySelector("table#top_res_table")];
    const newDocument = await refreshUpdatePanels(panelSelectors, null, categoryUrl);
    if(newDocument) {
        window.history.replaceState(null, newDocument.title, categoryUrl);
        printNewSaleLabel(newDocument);
        const newScripts = Array.from(newDocument.querySelectorAll("center > table td > script")); //console.log(newScripts);
        const oldScripts = Array.from(document.querySelectorAll("center > table td > script")); //console.log(oldScripts);
        if(newScripts.length != oldScripts.length) {
            location.reload();
        }
        newScripts.forEach((x, i) => replaceScript(oldScripts[i], x));
        auctionCategoriesUrlNames.forEach(x => {
            const cat0 = document.querySelector(`#mark_${x}`);
            if(cat0) {
                const cat = newDocument.querySelector(`#mark_${x}`);
                const newNodes = cat.childNodes;
                Array.from(cat0.childNodes).forEach((x, i) => { if(i > 0) { x.replaceWith(newNodes[i].cloneNode(true)); }}); // Обновляем количество лотов по категории
            }
        });
        const categoryLotsContainer = document.querySelector("table.wb > tbody > tr:nth-child(2) > td:nth-child(2)");
        const table = categoryLotsContainer.querySelector("table");
        Array.from(table.rows).forEach(x => { if(x.cells[4]) { x.cells[4].style.wordBreak = "break-all"; x.cells[4].style.minWidth = "80px"; }});

        await extendLotsTable(document, categoryUrl);
        colorizeCategory(categoryContainer);
        replaceArtsBuyForms(categoryUrl, categoryContainer);
    }
}
function replaceArtsBuyForms(categoryUrl, categoryContainer) {
    if(!getPlayerBool("SmoothBuying")) {
        return;
    }
    const buyForms = document.querySelectorAll("form[action='auction_buy_now.php']");
    for(const buyForm of buyForms) {
        const lotRow = getParent(buyForm, "tr");
        buyForm.querySelector("a[onclick]").style.display = "none";

        const amount = parseInt(lotRow.cells[0].innerHTML.match(new RegExp(`\\d+(?= ${isEn ? "pcs" : "шт"}\\.)`)) || 1);
        //console.log(`amount: ${amount}`);
        let amountInput;
        if(amount > 1) {
            amountInput = addElement("input", { type: "number", min: "1", max: amount, value: amount, style: "width: 50px;", onfocus: "this.select();", title: isEn ? "Quantity to purchase" : "Количество для покупки" } );
            buyForm.insertAdjacentElement("afterend", amountInput);
            amountInput.addEventListener("click", function(e) { e.stopPropagation(); });
        }
        // const asyncBuyButton = addElement("div", { title: isEn ? "Buy" : "Купить", innerHTML: `<img src="https://dcdn.heroeswm.ru/i/new_top/_panelRoulette.png" style="position: absolute; scale: 60%; clip: rect(10px, 50px, 40px, 20px); top: -43px; left: -30px;">`, style: "position: relative; width=30px; height=30px; display: inline-block;" } );
        // //console.log(getParent(buyForm, "td"))
        // getParent(buyForm, "td").style.minWidth = "75px";
        // buyForm.insertAdjacentElement("afterend", asyncBuyButton);
        // asyncBuyButton.addEventListener("click", function() { buyLot(buyForm, amountInput, categoryUrl, categoryContainer); });
        lotRow.addEventListener("click", function(e) { buyLot(buyForm, amountInput, categoryUrl, categoryContainer); });
        Array.from(lotRow.querySelectorAll("a")).forEach(x => x.addEventListener("click", function(e) { e.stopPropagation(); }));
        lotRow.title = isEn ? "Buy" : "Купить";
    }
}
function printNewSaleLabel(doc = document) {
    const elem = document.querySelector("div#mark_helm").closest('table.wb').parentNode;
    const lotSaleLabel = elem.textContent.match(/\({4}[^;]+/)[0];
    //console.log(lotSaleLabel);
}
function replaceScript(oldScriptElement, newScriptElement) {
    oldScriptElement.insertAdjacentElement("afterend", addElement("script", { innerHTML: newScriptElement.innerHTML }));
    oldScriptElement.remove();
}
async function buyLot(buyForm, amountInput, artLotsUrl, categoryContainer) {
    const lotRow = getParent(buyForm, "tr");
    const lotRef = lotRow.querySelector("a[href^='auction_lot_protocol.php?id=']");
    const lotId = getUrlParamValue(lotRef.href, "id");
    const amount = parseInt(amountInput?.value || 1);

    const art = parseLotRow(lotRow, artLotsUrl);
    if(art.Uid) {
        setValue(art.Uid, JSON.stringify(art));
    }

    if(getPlayerBool("ConfirmPurchase", true)) {
        if(!confirm(isEn ? `Buy ${amount} number of ${lotId} lot?` : `Купить лот ${lotId} в количестве ${amount}?`)) {
            return;
        }
    }
    const showBuyButtonRef = buyForm.querySelector("a[onclick]");
    showBuyButtonRef.click();
    //showBuyButtonRef.remove();
    document.getElementById('swf_button'+lotId).style.display = "none";
    document.getElementById('swf_inp_field'+lotId).style.display = "none";

    const nativeAmountInput = buyForm.querySelector('input[type="text"]');
    if(amount != 1) {
        nativeAmountInput.value = amount;
    }
    const nativeSubmit = buyForm.querySelector('input[type="submit"]');
    nativeSubmit.dispatchEvent(new MouseEvent('mousedown'));
    const rnd = 54 + Math.random() * 54 >> 0;
    await new Promise(resolve => setTimeout(resolve, rnd));
    nativeSubmit.dispatchEvent(new MouseEvent('mouseup'));

    const elem = buyForm.closest('table.wb').parentNode;
    const lotSaleLabel = elem.textContent.match(/\({4}[^;]+/)[0];
    //console.log(lotSaleLabel);
    const calcSaleLabel = (id) => new Function('id', `return ${lotSaleLabel}`)(id);
    buyForm.querySelector(`#buy_num${lotId}`).value = calcSaleLabel(parseInt(lotId));

    const formData = new FormData(buyForm);
    console.log(formData);
    const doc = await fetch.post(buyForm.action, formData).catch(() => ({ URL: '' }));
    showCurrentNotification(doc.querySelector("table.wbwhite").innerHTML);
    await sleep(700);
    refreshLots(artLotsUrl, categoryContainer);
    //createPupupPanel(`BuyReults${lotId}`, isEn ? "Buy results" : "Результаты покупки", [[doc.querySelector("table.wbwhite")]], function(buyResultsPanelShown) { if(!buyResultsPanelShown) refreshLots(artLotsUrl, categoryContainer); });
}
function getArtLots(e) {
    //console.log(e)
    if(e.key == "w" || e.key == "ц" || e.key == "ArrowUp") {
        const viewingArt = document.querySelector("div[viewingArt=true]");
        //console.log(viewingArt)
        if(viewingArt) {
            const artsDivs = Array.from(viewingArt.parentNode.childNodes).filter(x => x.style.display != "none");
            const indexOfViewingArt = artsDivs.indexOf(viewingArt);
            const nextNode = indexOfViewingArt > 0 ? artsDivs[indexOfViewingArt - 1] : artsDivs[artsDivs.length - 1];
            refreshLots(nextNode.getAttribute("artLotsUrl"), viewingArt.parentNode);
            // let previous = viewingArt.previousElementSibling;
            // while(previous && previous.style.display == "none") {
                // previous = previous.previousElementSibling;
            // }
            // //console.log(previous)
            // if(previous && previous.style.display != "none") {
                // refreshLots(previous.getAttribute("artLotsUrl"), viewingArt.parentNode);
            // }
        }
    }
    if(e.key == "s" || e.key == "ы" || e.key == "ArrowDown") {
        const viewingArt = document.querySelector("div[viewingArt=true]");
        //console.log(viewingArt)
        if(viewingArt) {
            const artsDivs = Array.from(viewingArt.parentNode.childNodes).filter(x => x.style.display != "none");
            const indexOfViewingArt = artsDivs.indexOf(viewingArt);
            const nextNode = (indexOfViewingArt < artsDivs.length - 1) ? artsDivs[indexOfViewingArt + 1] : artsDivs[0];
            refreshLots(nextNode.getAttribute("artLotsUrl"), viewingArt.parentNode);
            // let next = viewingArt.nextElementSibling;
            // while(next && next.style.display == "none") {
                // next = next.nextElementSibling;
            // }
            // //console.log(next)
            // if(next && next.style.display != "none") {
                // refreshLots(next.getAttribute("artLotsUrl"), viewingArt.parentNode);
            // }
        }
    }
}

function getLocationNumberByCoordinate(x, y) {
    for(let locationNumber in locations) {
        if(locations[locationNumber][0] == x && locations[locationNumber][1] == y) {
            return locationNumber;
        }
    }
}
function optimalRepair(marketPrice, repairCost, strength, restStrength, wornStrength, wornRestStrength) {
    restStrength = restStrength || strength;
    let totalSpending = marketPrice;
    let currentRestStrength = restStrength;
    let totalCombatsAmount = currentRestStrength;
    let currentStrength = strength;
    let currentCombatCost = totalSpending / totalCombatsAmount; // Начальная стоимость боя
    const smithRewardPercent = parseInt(getPlayerValue("SmithRewardPercent", 100));
    const smithRepairCost = repairCost * smithRewardPercent / 100;
    const smithRecoveryEfficiency = SmithRecoveryEfficiency[parseInt(getPlayerValue("SmithLevel", 9))] / 100;

    //if(marketPrice == 20000) console.log(`currentStrength: ${currentStrength}, currentRestStrength: ${currentRestStrength}, totalSpending: ${totalSpending}, totalCombatsAmount: ${totalCombatsAmount}, newCombatCost: ${currentCombatCost}, smithRewardPercent: ${smithRewardPercent}, smithLevel: ${getPlayerValue("SmithLevel", 9)}, smithRecoveryEfficiency: ${smithRecoveryEfficiency.toLocaleString()}`);
    for(currentStrength = strength; currentStrength > 0; currentStrength--) {
        if(currentStrength == wornStrength) {
            var spendedCombats = totalCombatsAmount - wornRestStrength;
        }
        currentRestStrength = Math.floor(currentStrength * smithRecoveryEfficiency);
        totalSpending += smithRepairCost;

        let newCombatCost = totalSpending / (totalCombatsAmount + currentRestStrength);
        //if(marketPrice == 20000) console.log(`currentStrength: ${currentStrength}, currentRestStrength: ${currentRestStrength} / ${currentStrength * smithRecoveryEfficiency}, totalSpending: ${totalSpending}, totalCombatsAmount: ${totalCombatsAmount + currentRestStrength}, newCombatCost: ${newCombatCost}`);
        if(newCombatCost > currentCombatCost) {
            break;
        }
        totalCombatsAmount += currentRestStrength;
        currentCombatCost = newCombatCost;
    }
    if(wornStrength) {
        var residualValue = round00(currentCombatCost * (totalCombatsAmount - spendedCombats) - repairCost * (wornStrength - currentStrength));
    }
    return { Strength: currentStrength, CombatCost: round00(currentCombatCost), CombatsAmount: totalCombatsAmount, SpendedCombats: spendedCombats, ResidualValue: residualValue };
}
function showScriptOptions() {
    if(showPupupPanel(GM_info.script.name)) {
        return;
    }
    const fieldsMap = [];

    const combatCostBestDeviationLabel = addElement("label", { for: "combatCostBestDeviationInput", innerText: LocalizedString.BestApproach + "\t", style: `background-color: ${CombatCostBestDeviationColor};` });
    const combatCostBestDeviationInput = addElement("input", { id: "combatCostBestDeviationInput", type: "number", value: CombatCostBestDeviation, style: "width: 70px;", onfocus: "this.select();" });
    combatCostBestDeviationInput.addEventListener("change", function() { setValue("CombatCostBestDeviation", parseInt(this.value)); CombatCostBestDeviation = parseInt(this.value); });
    const combatCostBestDeviationColorInput = addElement("input", { id: "combatCostBestDeviationColorInput", type: "color", value: CombatCostBestDeviationColor, style: "height: 22px; width: 30px;" });
    combatCostBestDeviationColorInput.addEventListener("change", function() { setValue("CombatCostBestDeviationColor", this.value); CombatCostBestDeviationColor = this.value; combatCostBestDeviationLabel.style.backgroundColor = this.value; });
    fieldsMap.push([combatCostBestDeviationLabel, combatCostBestDeviationInput, combatCostBestDeviationColorInput]);

    const combatCostGoodDeviationLabel = addElement("label", { for: "combatCostGoodDeviationInput", innerText: LocalizedString.GoodApproach + "\t", style: `background-color: ${CombatCostGoodDeviationColor};` });
    const combatCostGoodDeviationInput = addElement("input", { id: "combatCostGoodDeviationInput", type: "number", value: CombatCostGoodDeviation, style: "width: 70px;", onfocus: "this.select();" });
    combatCostGoodDeviationInput.addEventListener("change", function() { setValue("CombatCostGoodDeviation", parseInt(this.value)); CombatCostGoodDeviation = parseInt(this.value); });
    const combatCostGoodDeviationColorInput = addElement("input", { id: "combatCostGoodDeviationColorInput", type: "color", value: CombatCostGoodDeviationColor, style: "height: 22px; width: 30px;" });
    combatCostGoodDeviationColorInput.addEventListener("change", function() { setValue("CombatCostGoodDeviationColor", this.value); CombatCostGoodDeviationColor = this.value; combatCostGoodDeviationLabel.style.backgroundColor = this.value; });
    fieldsMap.push([combatCostGoodDeviationLabel, combatCostGoodDeviationInput, combatCostGoodDeviationColorInput]);

    const smoothLotsRefreshLable = addElement("label", { for: "smoothLotsRefreshInput", innerText: isEn ? "Smooth lots refresh" : "Мягкое обновление лотов" });
    const smoothLotsRefreshInput = addElement("input", { id: "smoothLotsRefreshInput", type: "checkbox" });
    smoothLotsRefreshInput.checked = getPlayerBool("SmoothLotsRefresh", true);
    smoothLotsRefreshInput.addEventListener("change", function() { setPlayerValue("SmoothLotsRefresh", this.checked); });
    fieldsMap.push([smoothLotsRefreshLable, smoothLotsRefreshInput]);

    const smoothBuyingLable = addElement("label", { for: "smoothBuyingInput", innerHTML: isEn ? "Smooth buying" : "Мягкая покупка",
title: isEn ? "The purchase is made by clicking on a line in the lot table, without reloading the page." : "Покупка осуществляется щелчком на строке таблицы лотов, без перезагрузки страницы." });
    const smoothBuyingInput = addElement("input", { id: "smoothBuyingInput", type: "checkbox" });
    smoothBuyingInput.checked = getPlayerBool("SmoothBuying");
    smoothBuyingInput.addEventListener("change", function() { setPlayerValue("SmoothBuying", this.checked); });
    fieldsMap.push([smoothBuyingLable, smoothBuyingInput]);

    const showBattlePriceOnHomeLable = addElement("label", { for: "showBattlePriceOnHomeInput", innerText: isEn ? "Battle price on home page" : "Цена за бой на домашней странице" });
    const showBattlePriceOnHomeInput = addElement("input", { id: "showBattlePriceOnHomeInput", type: "checkbox" });
    showBattlePriceOnHomeInput.checked = getPlayerBool("ShowBattlePriceOnHome", true);
    showBattlePriceOnHomeInput.addEventListener("change", function() { setPlayerValue("ShowBattlePriceOnHome", this.checked); });
    fieldsMap.push([showBattlePriceOnHomeLable, showBattlePriceOnHomeInput]);

    const showBattlePriceInPlayerInfoLable = addElement("label", { for: "showBattlePriceInPlayerInfoInput", innerText: isEn ? "Battle price in player info" : "Цена за бой в информации об игроке" });
    const showBattlePriceInPlayerInfoInput = addElement("input", { id: "showBattlePriceInPlayerInfoInput", type: "checkbox" });
    showBattlePriceInPlayerInfoInput.checked = getPlayerBool("ShowBattlePriceInPlayerInfo", true);
    showBattlePriceInPlayerInfoInput.addEventListener("change", function() { setPlayerValue("ShowBattlePriceInPlayerInfo", this.checked); });
    fieldsMap.push([showBattlePriceInPlayerInfoLable, showBattlePriceInPlayerInfoInput]);

    const showBattlePriceInInventoryLable = addElement("label", { for: "showBattlePriceInInventoryInput", innerText: isEn ? "Battle price in inventory" : "Цена за бой в инвентаре" });
    const showBattlePriceInInventoryInput = addElement("input", { id: "showBattlePriceInInventoryInput", type: "checkbox" });
    showBattlePriceInInventoryInput.checked = getPlayerBool("ShowBattlePriceInInventory", true);
    showBattlePriceInInventoryInput.addEventListener("change", function() { setPlayerValue("ShowBattlePriceInInventory", this.checked); });
    fieldsMap.push([showBattlePriceInInventoryLable, showBattlePriceInInventoryInput]);

    const showAfterRepairBattleCostInInventoryLable = addElement("label", { for: "showAfterRepairBattleCostInInventoryInput", innerText: LocalizedString.ShowAfterRepairBattleCostInInventory + "\t" });
    const showAfterRepairBattleCostInInventoryInput = addElement("input", { id: "showAfterRepairBattleCostInInventoryInput", type: "checkbox" });
    showAfterRepairBattleCostInInventoryInput.checked = getBool("ShowAfterRepairBattleCostInInventory");
    showAfterRepairBattleCostInInventoryInput.addEventListener("change", function() { setValue("ShowAfterRepairBattleCostInInventory", this.checked); });
    fieldsMap.push([showAfterRepairBattleCostInInventoryLable, showAfterRepairBattleCostInInventoryInput]);

    const showArtifactInformationIconInInventoryLable = addElement("label", { for: "showArtifactInformationIconInInventoryInput", innerText: (isEn ? "Show artifact information icon in inventory" : "Показывать в инвентаре иконку информации об артефакте") + "\t" });
    const showArtifactInformationIconInInventoryInput = addElement("input", { id: "showArtifactInformationIconInInventoryInput", type: "checkbox" });
    showArtifactInformationIconInInventoryInput.checked = getBool("ShowArtifactInformationIconInInventory", true);
    showArtifactInformationIconInInventoryInput.addEventListener("change", function() { setValue("ShowArtifactInformationIconInInventory", this.checked); });
    fieldsMap.push([showArtifactInformationIconInInventoryLable, showArtifactInformationIconInInventoryInput]);

    const artBulkTtransferEnabledLable = addElement("label", { for: "artBulkTtransferEnabledInput", innerText: LocalizedString.ArtBulkTtransferEnabledName + "\t" });
    const artBulkTtransferEnabledInput = addElement("input", { id: "artBulkTtransferEnabledInput", type: "checkbox" });
    artBulkTtransferEnabledInput.checked = getBool("ArtBulkTtransferEnabled");
    artBulkTtransferEnabledInput.addEventListener("change", function() { setValue("ArtBulkTtransferEnabled", this.checked); });
    fieldsMap.push([artBulkTtransferEnabledLable, artBulkTtransferEnabledInput]);

    const artSmithScheduleEnabledLable = addElement("label", { for: "artSmithScheduleEnabledInput", innerText: LocalizedString.SmithSchedulingEnabledName + "\t" });
    const artSmithScheduleEnabledInput = addElement("input", { id: "artSmithScheduleEnabledInput", type: "checkbox" });
    artSmithScheduleEnabledInput.checked = getBool("SmithSchedulingEnabled");
    artSmithScheduleEnabledInput.addEventListener("change", function() { setValue("SmithSchedulingEnabled", this.checked); });
    fieldsMap.push([artSmithScheduleEnabledLable, artSmithScheduleEnabledInput]);

    const artBeginRepairOnSmithFreeLable = addElement("label", { for: "artBeginRepairOnSmithFreeInput", innerHTML: LocalizedString.BeginRepairOnSmithFreeName + "\t" + "<br><span style='color: red;'>" + LocalizedString.BreakingTheRules + "</span>"});
    const artBeginRepairOnSmithFreeInput = addElement("input", { id: "artBeginRepairOnSmithFreeInput", type: "checkbox" });
    artBeginRepairOnSmithFreeInput.checked = getBool("BeginRepairOnSmithFree");
    artBeginRepairOnSmithFreeInput.addEventListener("change", function() { setValue("BeginRepairOnSmithFree", this.checked); });
    fieldsMap.push([artBeginRepairOnSmithFreeLable, artBeginRepairOnSmithFreeInput]);

    const incomeViewEnabledLable = addElement("label", { for: "incomeViewEnabledInput", innerText: LocalizedString.IncomeViewEnabledName + "\t" });
    const incomeViewEnabledInput = addElement("input", { id: "incomeViewEnabledInput", type: "checkbox" });
    incomeViewEnabledInput.checked = getBool("IncomeViewEnabled");
    incomeViewEnabledInput.addEventListener("change", function() { setValue("IncomeViewEnabled", this.checked); });
    fieldsMap.push([incomeViewEnabledLable, incomeViewEnabledInput]);

    const showResourcesCostPanelLable = addElement("label", { for: "showResourcesCostPanelInput", innerText: LocalizedString.ShowResourcesCostPanelName + "\t" });
    const showResourcesCostPanelInput = addElement("input", { id: "showResourcesCostPanelInput", type: "checkbox" });
    showResourcesCostPanelInput.checked = getBool("ShowResourcesCostPanel");
    showResourcesCostPanelInput.addEventListener("change", function() { setValue("ShowResourcesCostPanel", this.checked); });
    fieldsMap.push([showResourcesCostPanelLable, showResourcesCostPanelInput]);

    const beginRepairClanDepositoryLable = addElement("label", { for: "beginRepairClanDepositoryCheckbox", innerText: LocalizedString.BeginRepairClanDepositoryName + "\t" });
    const beginRepairClanDepositoryCheckbox = addElement("input", { id: "beginRepairClanDepositoryCheckbox", type: "checkbox" });
    beginRepairClanDepositoryCheckbox.checked = getBool("BeginRepairClanDepository");
    beginRepairClanDepositoryCheckbox.addEventListener("change", function() { setValue("BeginRepairClanDepository", this.checked); });
    //fieldsMap.push([beginRepairClanDepositoryLable, beginRepairClanDepositoryCheckbox]);

    const showTradesToMeLable = addElement("label", { for: "ShowTradesToMeCheckbox", innerText: (isEn ? "Show trades to me icon" : "Показать индикатор передач") + "\t" });
    const showTradesToMeCheckbox = addElement("input", { id: "ShowTradesToMeCheckbox", type: "checkbox" });
    showTradesToMeCheckbox.checked = getBool("ShowTradesToMe");
    showTradesToMeCheckbox.addEventListener("change", function() { setValue("ShowTradesToMe", this.checked); });
    fieldsMap.push([showTradesToMeLable, showTradesToMeCheckbox]);

    const showThresholdPricesIndicatorLable = addElement("label", { for: "ShowThresholdPricesImdicatorCheckbox", innerText: (isEn ? "Show advantageous lots" : "Показать индикатор выгодных лотов") + "\t" });
    const showThresholdPricesImdicatorCheckbox = addElement("input", { id: "ShowThresholdPricesImdicatorCheckbox", type: "checkbox" });
    showThresholdPricesImdicatorCheckbox.checked = getBool("ShowThresholdPricesIndicator");
    showThresholdPricesImdicatorCheckbox.addEventListener("change", function() { setValue("ShowThresholdPricesIndicator", this.checked); });

    const showThresholdPricesNotificationLable = addElement("label", { for: "ShowThresholdPricesNotificationCheckbox", innerText: (isEn ? "Notification" : "Оповещение") + "\t" });
    const showThresholdPricesNotificationCheckbox = addElement("input", { id: "ShowThresholdPricesNotificationCheckbox", type: "checkbox" });
    showThresholdPricesNotificationCheckbox.checked = getBool("ShowThresholdPricesNotification");
    showThresholdPricesNotificationCheckbox.addEventListener("change", function() { setValue("ShowThresholdPricesNotification", this.checked); });

    fieldsMap.push([showThresholdPricesIndicatorLable, showThresholdPricesImdicatorCheckbox, showThresholdPricesNotificationLable, showThresholdPricesNotificationCheckbox]);

    const showClanDepositoryRepairIconLable = addElement("label", { for: "showClanDepositoryRepairIconSelect", innerText: (isEn ? "Show clan depository repair icon" : "Показать индикатор ремонта на складе") + "\t" });
    const showClanDepositoryRepairIconSelect = addElement("select", { id: "showClanDepositoryRepairIconSelect" });
    showClanDepositoryRepairIconSelect.addEventListener("change", function() { setValue("ShowClanDepositoryRepairIcon", parseInt(this.value)); });
    const showClanDepositoryRepairIconOptions = {"0": "Никогда", "1": "Если кузница свободна", "2": "Всегда"};
    for(const key in showClanDepositoryRepairIconOptions) {
        let option = addElement("option", { value: parseInt(key), innerHTML: showClanDepositoryRepairIconOptions[key] }, showClanDepositoryRepairIconSelect);
        if(key == getValue("ShowClanDepositoryRepairIcon")) {
            option.setAttribute("selected", "selected");
        }
    }
    fieldsMap.push([showClanDepositoryRepairIconLable, showClanDepositoryRepairIconSelect]);

    const smithLevelLable = addElement("label", { for: "OptimalRepairAtMarketSmithLevelInput", innerText: LocalizedString.SmithLevelCaption + "\t" });
    const optimalRepairAtMarketSmithLevelInput = addElement("input", { id: "OptimalRepairAtMarketSmithLevelInput", type: "number", value: getPlayerValue("SmithLevel"), style: "width: 70px;", placeholder: "9", onfocus: "this.select();" });
    optimalRepairAtMarketSmithLevelInput.addEventListener("change", function() { setOrDeleteNumberPlayerValue("SmithLevel", parseInt(this.value)); });
    fieldsMap.push([smithLevelLable, optimalRepairAtMarketSmithLevelInput]);

    const smithRewardPercentLable = addElement("label", { for: "OptimalRepairAtMarketSmithRewardPercentInput", innerText: LocalizedString.SmithRewardPercentCaption + "\t" });
    const optimalRepairAtMarketSmithRewardPercentInput = addElement("input", { id: "OptimalRepairAtMarketSmithRewardPercentInput", type: "number", value: getPlayerValue("SmithRewardPercent", ""), style: "width: 70px;", placeholder: "100", onfocus: "this.select();" });
    optimalRepairAtMarketSmithRewardPercentInput.addEventListener("change", function() { setOrDeleteNumberPlayerValue("SmithRewardPercent", this.value); });
    fieldsMap.push([smithRewardPercentLable, optimalRepairAtMarketSmithRewardPercentInput]);

    const showKitsLable = addElement("label", { for: "showKitsCheckbox", innerText: (isEn ? "Show kits" : "Показать наборы") + "\t" });
    const showKitsCheckbox = addElement("input", { id: "showKitsCheckbox", type: "checkbox" });
    showKitsCheckbox.checked = getPlayerBool("ShowKits");
    showKitsCheckbox.addEventListener("change", function() { setPlayerValue("ShowKits", this.checked); });
    fieldsMap.push([showKitsLable, showKitsCheckbox]);

    const storePlayerBitsLable = addElement("label", { for: "storePlayerBitsCheckbox", innerText: (isEn ? "Store bits" : "Сохранять ставки") + "\t" });
    const storePlayerBitsCheckbox = addElement("input", { id: "storePlayerBitsCheckbox", type: "checkbox" });
    storePlayerBitsCheckbox.checked = getPlayerBool("storePlayerBits");
    storePlayerBitsCheckbox.addEventListener("change", function() { setPlayerValue("storePlayerBits", this.checked); });
    fieldsMap.push([storePlayerBitsLable, storePlayerBitsCheckbox]);

    createPupupPanel(GM_info.script.name, getScriptReferenceHtml() + " " + getSendErrorMailReferenceHtml(), fieldsMap);
}
function sortTable(tableElement, columnIndex, startRowIndex = 1, sortType = SortType.Text, valueSelector = null) {
    Array.from(tableElement.rows).slice(startRowIndex).forEach(x => x.sortValue = (sortType == SortType.Text ? (valueSelector ? valueSelector(x.cells[columnIndex]) : x.cells[columnIndex].innerHTML).toLowerCase() : (
    sortType == SortType.Number ? parseFloat(valueSelector ? valueSelector(x.cells[columnIndex]) : x.cells[columnIndex].innerHTML) : 0
    )));
    let currentIndex = startRowIndex;
    const lastIndex = tableElement.rows.length - 1;
    while(currentIndex <= lastIndex) {
        const rows = tableElement.rows;
        let currentMinValue = rows[currentIndex].sortValue;
        let currentMinValueIndex = currentIndex;
        for(let i = currentIndex + 1; i <= lastIndex; i++) {
            if(rows[i].sortValue < currentMinValue) {
                currentMinValue = rows[i].sortValue;
                currentMinValueIndex = i;
            }
        }
        if(currentMinValueIndex > currentIndex) {
            rows[currentIndex].parentNode.insertBefore(rows[currentMinValueIndex], rows[currentIndex]);
        }
        currentIndex++;
    }
}
async function extendLotsTable(doc, url, removeForms = false, getDataOnly = false) {
    const ss2 = doc.querySelector("select[name='ss2']");
    const ss2Table = getParent(ss2, "table");
    if(!ss2Table) {
        return;
    }
    if(removeForms) {
        const forms = ss2Table.querySelectorAll("form");
        for(const form of forms) {
            form.remove();
        }
    }
    let tableHeaderRow;
    for(const tr of doc.querySelectorAll("tr")) {
        if(tr.nextElementSibling && tr.textContent.includes(LocalizedString.Lot) && tr.textContent.includes(LocalizedString.Cost) && tr.textContent.includes(LocalizedString.TimeLeft)) {
            tableHeaderRow = tr;
            break;
        }
    }
    if(!tableHeaderRow) {
        tableHeaderRow = ss2Table.rows[1];
    }
    if(!tableHeaderRow) {
        return;
    }
    const urlArtId = getUrlParamValue(url, "art_type");
    if(urlArtId) {
        const product = tableHeaderRow.cells[0];
        var shopCostInfo = getFormatedArtCost(urlArtId);
        if(shopCostInfo) {
            var shopCostSpan = addElement("span", { innerText: shopCostInfo.CostInfo, title: LocalizedString.ShopAndFactoryPrice, style: "padding-left: 3px;" }, product);
        }
    }
    const selForm = ss2Table.querySelector("form[name='sort']");
    if(selForm && getBool("IncomeViewEnabled")) {
        const incomeOnlyCheckbox = addElement("input", { type: "checkbox", title: isEn ? "With benefit only" : "Только с выгодой" }, selForm);
        incomeOnlyCheckbox.checked = getBool("IncomeOnly");
        incomeOnlyCheckbox.addEventListener("change", function(e) { e.stopPropagation(); setValue("IncomeOnly", this.checked); toggleIncomeRows(getParent(tableHeaderRow, "table")); });

        const confirmPurchaseCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Confirm purchase" : "Подтверждать покупку" }, selForm);
        confirmPurchaseCheckbox.checked = getPlayerBool("ConfirmPurchase", true);
        confirmPurchaseCheckbox.addEventListener("change", function(e) { e.stopPropagation(); setPlayerValue("ConfirmPurchase", this.checked); });

        const agiotagePercentInput = addElement("input", { type: "number", value: getPlayerValue("agiotagePercent", 2), title: isEn ? "Percentage of rush demand" : "Процент ажиотажного спроса", style: "width: 50px;", onfocus: "this.select();" }, selForm);
        agiotagePercentInput.addEventListener("change", function(e) { e.stopPropagation(); setOrDeleteNumberPlayerValue("agiotagePercent", this.value); });
    }
    if(selForm && urlArtId && getBool("ShowThresholdPricesIndicator")) {
        const thresholdPrices = JSON.parse(getPlayerValue("ThresholdPrices", "[]"));
        const thresholdPrice = thresholdPrices.find(x => x.ArtId == urlArtId) || { ArtId: urlArtId, Url: url };

        const indicatedPriceInput = addElement("input", { type: "number", value: thresholdPrice.Price || "", title: isEn ? "Indicated price" : "Цена для индикации", style: "width: 100px;", onfocus: "this.select();" }, selForm);
        indicatedPriceInput.addEventListener("change", function(e) { e.stopPropagation(); saveThresholdPrice(thresholdPrice.ArtId, thresholdPrice.Url, Number(this.value), thresholdPrice.BattlePrice); });
        const indicatedBattlePriceInput = addElement("input", { type: "number", value: thresholdPrice.BattlePrice || "", title: isEn ? "Indicated battle price" : "Цена за бой для индикации", style: "width: 100px;", onfocus: "this.select();" }, selForm);
        indicatedBattlePriceInput.addEventListener("change", function(e) { e.stopPropagation(); saveThresholdPrice(thresholdPrice.ArtId, thresholdPrice.Url, thresholdPrice.Price, Number(this.value)); });
    }
    const urlCat = getUrlParamValue(url, "cat") || "my";
    const drawOptimalRepairColumns = (!urlArtId || urlArtId in ArtifactInfo) && !["res", "elements", "part", "obj_share", "cert", "dom"].includes(urlCat);
    if(drawOptimalRepairColumns) {
        ss2Table.rows[0].cells[1].setAttribute("colspan", "7");
        let td = addElement("td", { style: "text-align: center; min-width: 50px;", innerText: LocalizedString.BattlePrice, title: isEn ? "Open settings" : "Открыть настройки" }, tableHeaderRow);
        td.addEventListener("click", showScriptOptions);

        let sortDiv = addElement("div", { style: "float: right; border: 1px solid; cursor: pointer;", innerText: "[v]", title: isEn ? "Sort" : "Сортировать" }, td);
        sortDiv.addEventListener("click", function(e) { e.stopPropagation(); sortTable(tableHeaderRow.parentNode, 5, 2, SortType.Number, x => x.childNodes[1].innerText); });
    }
    await logNewArtifactsIds(doc, tableHeaderRow.previousElementSibling);

    let row = tableHeaderRow;
    let arts = [];
    while(row = row.nextElementSibling) {
        const art = parseLotRow(row, urlArtId);
        if(art) {
            arts.push(art);
            if(drawOptimalRepairColumns && art.OptimalRepairCombatCost) {
                let title = "";
                if(art.LotType == LotType.Auction) {
                    title += (isEn ? `The price per battle is calculated based on the current price plus 1%: ${art.LotPrice}` : `Расчет цены за бой ведется от текущей цены плюс 1%: ${art.LotPrice}`) + "\n";
                }
                title += `${isEn ? "Costs in the forge" : "Затраты в кузне"}: (${art.LotStrength} - ${art.OptimalRepairStrength}) * ${art.RepairCost} = ${((art.LotStrength - art.OptimalRepairStrength) * art.RepairCost).toLocaleString()}`;
                if(art.CraftCost > 0) {
                    title += `\n${isEn ? "Crafting cost" : "Стоимость крафта"}: ${art.CraftCost.toLocaleString()}, ${isEn ? "cost of art without crafting" : "стоимость арта без крафта"}: ${(art.LotPrice - art.CraftCost).toLocaleString()}`;
                }
                addElement("td", { style: "text-align: right;", innerHTML: `
<span title="${title}">${art.OptimalRepairCombatCost}</span>
<br>
<span title="${LocalizedString.OptimalStrength}" style="font-size: 8pt;">${art.OptimalRepairStrength}</span> / <span title="${LocalizedString.Combats}" style="font-size: 8pt;">${art.OptimalRepairCombatsAmount}</span>
` }, row);
            }
            if(art.Uid) {
                let buyHrefElement = row.querySelector("a[onclick*='show_js_button']");
                if(buyHrefElement) {
                    buyHrefElement.addEventListener("click", function() { setValue(art.Uid, JSON.stringify(art)); });
                }
            }
        }
    }
    const grouppedArts = groupBy(arts.filter(x => x.LotType == LotType.Purchase), x => `${x.Id}${x.CraftInfo ? "#" + x.CraftInfo : ""}`);
    const agiotagePercent = parseInt(getPlayerValue("agiotagePercent", 2));
    for(const artHash in grouppedArts) {
        let [artId, craftInfo] = artHash.split("#");
        craftInfo = craftInfo || "";
        const isArt = artId in ArtifactInfo;
        const arts = grouppedArts[artHash];
        //console.log(`artId: ${artId}, craftInfo: ${craftInfo}`);

        // Раскраска дохода
        if(artId) { // artId нету у лотов, которые ещё не парсятся целой категорией. Например у домов. Если ид нет в урл, то нет вообще
            if(getBool("IncomeViewEnabled")) {
                arts.sort(function(a,b) { return isArt ? a.OptimalRepairCombatCost - b.OptimalRepairCombatCost : a.LotPrice - b.LotPrice; });
                let basePrice = isArt ? arts[0].OptimalRepairCombatCost : arts[0].LotPrice;
                const shopCostInfo1 = getFormatedArtCost(artId);
                if(shopCostInfo1 && !craftInfo) {
                    basePrice = shopCostInfo1.MinBattleCost;
                } else {
                    for(const el of arts) {
                        const secondLotPrice = isArt ? el.OptimalRepairCombatCost : el.LotPrice;
                        if(secondLotPrice > basePrice) {
                            basePrice = secondLotPrice;
                            break;
                        }
                    }
                }
                for(const el of arts) {
                    const goldImageElement = el.RowElement.querySelector("img[src*='gold.png']");
                    const priceTable = getParent(goldImageElement, "table");
                    const tr = addElement("tr", undefined, priceTable);
                    let income;
                    let incomePercent;
                    let title;
                    if(isArt) {
                        income = (basePrice - el.OptimalRepairCombatCost) * el.OptimalRepairCombatsAmount;
                        incomePercent = (basePrice - el.OptimalRepairCombatCost) / basePrice * 100;
                        const titel1 = shopCostInfo1 && !craftInfo ? "Цена за бой на предприятии" : "Цена за бой второго по дешевизне лота";
                        title = `Выгода (${titel1}: ${basePrice} - Цена за бой лота: ${el.OptimalRepairCombatCost}) * Количество боев лота: ${el.OptimalRepairCombatsAmount}`;
                    } else {
                        income = basePrice - el.LotPrice;
                        incomePercent = (basePrice - el.LotPrice) / basePrice * 100;
                        title = `Выгода по сравнению со вторым по дешевизне лотом`;
                    }
                    let fontColor = "red";
                    let fontBold = "";
                    if(income >= 0) {
                        fontBold = "font-weight: bold;";
                        fontColor = "blue";
                        //console.log(`incomePercent: ${incomePercent}, basePrice: ${basePrice}, LotPrice: ${el.LotPrice}, OptimalRepairCombatCost: ${el.OptimalRepairCombatCost}, OptimalRepairCombatsAmount: ${el.OptimalRepairCombatsAmount}`)
                        if(incomePercent >= agiotagePercent) {
                            fontColor = "#991199";
                        }
                    }
                    addElement("td", { colspan: 2, name: "income", innerText: income.toLocaleString(), style: `color: ${fontColor};${fontBold}`, title: title }, tr);
                }
            }
        }
        // Раскраска оптимального слома
        if(isArt) {
            const minCombatCost = arts.reduce((c, e) => Math.min(c, e.OptimalRepairCombatCost), arts[0].OptimalRepairCombatCost);
            for(const art of arts) {
                if(art.RowElement.cells.length > 5) {
                    if(art.OptimalRepairCombatCost <= minCombatCost * (100 + CombatCostBestDeviation) / 100) {
                        art.RowElement.cells[5].style.backgroundColor = CombatCostBestDeviationColor;
                    } else if(art.OptimalRepairCombatCost <= minCombatCost * (100 + CombatCostGoodDeviation) / 100) {
                        art.RowElement.cells[5].style.backgroundColor = CombatCostGoodDeviationColor;
                    }
                }
            }
            if(shopCostSpan) {
                if(minCombatCost > shopCostInfo.MinBattleCost) {
                    shopCostSpan.style.backgroundColor = CombatCostBestDeviationColor;
                }
            }
        }
        if(urlCat != "my") {
            // Запомним последнюю рыночную минимальную цену
            let strength = ArtifactInfo[artId]?.Strength;
            let fullArs = arts; //arts.filter(x => !isArt || x.LotStrength == strength && x.RestLotStrength == strength || !StockArtifactIds.includes(artId)); // Здесь акционные арты брались только целые - убрал
            if(fullArs.length > 0) {
                if(isArt) {
                    let minOptimalRepairCombatCost = fullArs.reduce((c, e) => Math.min(c, e.OptimalRepairCombatCost), fullArs[0].OptimalRepairCombatCost);
                    let minPriceArt;
                    for(const art of fullArs) {
                        if(art.OptimalRepairCombatCost == minOptimalRepairCombatCost) {
                            minPriceArt = art;
                            break;
                        }
                    }
                    //console.log(minPriceArt);
                    setValue("LastBestLotData_" + artId + (craftInfo ? "Craft" + craftInfo: ""), JSON.stringify(minPriceArt)); // if(craftInfo) console.log(getValue("LastBestLotData_" + artId + (craftInfo ? "Craft" + craftInfo: "")))
                } else {
                    //console.log(fullArs);
                    const minLotPrice = fullArs.reduce((c, e) => Math.min(c, e.LotPrice), fullArs[0].LotPrice);
                    setValue("LastBestLotData_" + artId, minLotPrice);
                }
            }
        }
    }
    if(getBool("IncomeViewEnabled")) {
        toggleIncomeRows(ss2Table);
    }
    return { Table: ss2Table, Arts: grouppedArts };
}
function saveThresholdPrice(artId, url, price, battlePrice) {
    const thresholdPrices = JSON.parse(getPlayerValue("ThresholdPrices", "[]"));
    let thresholdPrice = thresholdPrices.find(x => x.ArtId == artId);
    if(!thresholdPrice) {
        thresholdPrice = { ArtId: artId, Url: url };
        thresholdPrices.push(thresholdPrice);
    }
    thresholdPrice.Price = price || 0;
    thresholdPrice.BattlePrice = battlePrice || 0;
    setPlayerValue("ThresholdPrices", JSON.stringify(thresholdPrices.filter(x => Number(x.Price) > 0 || Number(x.BattlePrice) > 0)));
    deleteValue("ShowThresholdBattlePricesData");
    deleteValue("ShowThresholdBattlePricesImdicatorLastRequestTime");
    //console.log(getPlayerValue("ThresholdPrices", "[]"));
}
function parseLotRow(row, urlArtId) {
    if(!row || row.nodeName != "TR") {
        return;
    }
    const lotType = row.innerHTML.includes(LocalizedString.BuyNow) ? LotType.Purchase : LotType.Auction;
    const goldImageElement = row.cells[2]?.querySelector("img[src*='gold.png']");
    if(!goldImageElement) {
        return;
    }
    let lotPrice = parseFloat(goldImageElement.parentNode.nextElementSibling.innerText.replace(/,/g, ""));
    let maxBitOwnerId = "";
    let maxBitOwnerName = "";
    if(lotType == LotType.Auction) {
        lotPrice += Math.max(Math.floor(lotPrice / 100), 3);
        const maxBitOwnerRef = row.cells[2].querySelector("a[href^='pl_info.php?id=']");
        if(maxBitOwnerRef) {
            maxBitOwnerId = parseInt(getUrlParamValue(maxBitOwnerRef.href, "id"));
            maxBitOwnerName = maxBitOwnerRef.innerHTML;
        }
    }
    let artId;
    let category;
    let lotAmount = 1;
    const lotAmountExec = new RegExp(`(\\d+) ${isEn ? "pcs." : "шт."}`).exec(row.innerHTML);
    if(lotAmountExec) {
        lotAmount = parseInt(lotAmountExec[1]);
    }
    let artName = "";
    const artImageRefElement = row.querySelector("a[href*='art_info.php']");
    if(!artImageRefElement) {
        artId = urlArtId;
        category = getUrlParamValue(location.href, "cat");

        const elementsList = Object.values(ElementsTypes).join("|");
        const elementParse = (new RegExp(`gn_res/(${elementsList}).png`)).exec(row.innerHTML);
        if(elementParse) {
            artId = elementParse[1];
            category = "elements";
        }
        if(row.innerHTML.includes("house_cert")) {
            const locationsList = Object.values(locations).map(x => x[2]).join("|");
            const sertParse = (new RegExp(`<br>(${locationsList})&nbsp;<b>`)).exec(row.innerHTML);
            if(sertParse) {
                artId = getSertIdByLocationName(sertParse[1]);
                category = "cert";
            }
        }
        const resourcesList = Object.values(ResourcesTypes).map(x => x.ImageName).join("|");
        const resourceParse = (new RegExp(`/(${resourcesList}).png`)).exec(row.innerHTML);
        if(resourceParse) {
            artId = "res_" + resourceParse[1];
            category = "res";
        }
        if(row.innerHTML.includes("auc_dom")) {
            const locationsList = Object.values(locations).map(x => x[2]).join("|");
            const sertParse = (new RegExp(`<br>(${locationsList})&nbsp;<b>`)).exec(row.innerHTML);
            if(sertParse) {
                artId = getHouseIdByLocationName(sertParse[1]);
                category = "dom";
            }
        }
        if(row.innerHTML.includes("obj_share_pic")) {
            const locationsList = Object.values(locations).map(x => x[2]).join("|");
            const sertParse = (new RegExp(`<br>(${locationsList})&nbsp;<b>`)).exec(row.innerHTML);
            if(sertParse) {
                artId = getShaIdByLocationName(sertParse[1]);
                category = "obj_share";
            }
        }
        artName = row.cells[0].querySelector("img").title;
    } else {
        artId = getUrlParamValue(artImageRefElement.href, "id");
        var artUid = getUrlParamValue(artImageRefElement.href, "uid");;
        const strengthData = row.innerText.match(/\d+\/\d+/);
        var restLotStrength = parseInt(strengthData[0].split("/")[0]);
        var lotStrength = parseInt(strengthData[0].split("/")[1]);
        let artName = "";
        const show_hint = artImageRefElement.querySelector("img.show_hint");
        if(show_hint) {
            artName = show_hint.getAttribute("hint").split("<br />")[0].trimEnd();
        } else {
            const auction_lot_protocolRefElement = row.cells[0].querySelector("a[href^='auction_lot_protocol.php']");
            const artNameNode = auction_lot_protocolRefElement.nextSibling;
            artName = artNameNode.textContent.substr(2);
        }
        category = ArtifactInfo[artId]?.MarketCategory;
    }
    const lotRef = row.querySelector("a[href^='auction_lot_protocol.php']");
    const lotId = getUrlParamValue(lotRef.href, "id");
    const lotCrc = getUrlParamValue(lotRef.href, "crc");
    const artifact = new ArtifactLot(artUid, artId, lotStrength, restLotStrength, lotPrice, undefined, undefined, undefined, row, lotType, lotAmount, lotId);
    artifact.CalcOptRepair();

    const lotEndTime = parseElapseTime(row.cells[3].innerHTML);

    const lotCell = getParent(lotRef, "td");
    const craftExec = /\[(([IDN]\d{1,2})?(E\d{1,2})?(A\d{1,2})?(W\d{1,2})?(F\d{1,2})?)\]/.exec(lotCell.innerHTML);
    //const craftExec = /\[(.+)\]/.exec(isMobileInterface ? lotRef.parentNode?.previousSibling?.textContent : lotRef.nextSibling?.textContent) || /\[(.+)\]/.exec(isMobileInterface ? lotRef.parentNode?.previousElementSibling?.innerHTML : lotRef.nextSibling?.nextElementSibling?.innerText);
    if(craftExec) {
        artifact.CraftInfo = craftExec[1];
        [artifact.CraftCost, artifact.CraftUnderCost] = getCraftCost(artifact.CraftInfo, ArtifactInfo[artifact.Id]?.CraftType);
    }
    if(getPlayerBool("storePlayerBits")) {
        const bitsStorage = JSON.parse(getPlayerValue("bitsStorage", "[]"));
        let lot = bitsStorage.find(x => x.lotId == lotId);
        if(maxBitOwnerId == PlayerId || lot) {
            if(lot) {
                lot.maxBitOwnerId = maxBitOwnerId;
                lot.lotCrc = lotCrc;
                lot.category = category;
                lot.lotEndTime = lotEndTime;
            } else {
                bitsStorage.push({ lotId: lotId, lotCrc: lotCrc, category: category, lotEndTime: lotEndTime, maxBitOwnerId: maxBitOwnerId, maxBitOwnerName: maxBitOwnerName, artName: artName, art: JSON.stringify(artifact) });
            }
            setPlayerValue("bitsStorage", JSON.stringify(bitsStorage));
        }
    }
    return artifact;
}
function parseElapseTime(restText) {
    // 2 д. 19 ч. 6 мин. 2 d. 18 h. 19 m.
    const elapseTimeRegExp = isEn ? new RegExp(`((\\d)+ d.)?\\s?((\\d)+ h.)?\\s?((\\d)+ m.)?`) : new RegExp(`((\\d)+ д.)?\\s?((\\d)+ ч.)?\\s?((\\d)+ мин.)?`);
    const elapseTimeRegExpExec = elapseTimeRegExp.exec(restText);
    let elapsedTime = 0;
    if(elapseTimeRegExpExec) {
        if(elapseTimeRegExpExec[2]) {
            const days = parseInt(elapseTimeRegExpExec[2]);
            elapsedTime += days * 24 * 3600 * 1000;
        }
        if(elapseTimeRegExpExec[4]) {
            const hours = parseInt(elapseTimeRegExpExec[4]);
            elapsedTime += hours * 3600 * 1000;
        }
        if(elapseTimeRegExpExec[6]) {
            const minutes = parseInt(elapseTimeRegExpExec[6]);
            elapsedTime += minutes * 60 * 1000;
        }
    }
    return getServerTime() + elapsedTime;
}
function toggleIncomeRows(table) {
    for(const row of table.rows) {
        const goldImageElement = row.querySelector("img[src*='gold.png']");
        if(!goldImageElement) {
            continue;
        }
        const incomeCell = row.querySelector("td[name='income']");
        let income = 0;
        if(incomeCell) {
            income = parseFloat(incomeCell.innerText.replace(/\\s/g, "").replace(/,/g, "."));
        }
        row.style.display = income > 0 || !getBool("IncomeOnly") ? '' : 'none';
    }
}
function ArtifactLot(uid, id, lotStrength, restLotStrength, lotPrice, optimalRepairCombatCost, optimalRepairStrength, optimalRepairCombatsAmount, rowElement, lotType, lotAmount, lotId) {
  this.Uid = uid;
  this.Id = id;
  this.LotStrength = lotStrength;
  this.RestLotStrength = restLotStrength;
  this.LotPrice = lotPrice;
  this.OptimalRepairCombatCost = optimalRepairCombatCost;
  this.OptimalRepairStrength = optimalRepairStrength;
  this.OptimalRepairCombatsAmount = optimalRepairCombatsAmount;
  this.RowElement = rowElement;
  this.LotType = lotType;
  this.LotAmount = lotAmount || 1;
  this.LotId = lotId;
  this.RepairCost = ArtifactInfo[this.Id]?.RepairCost;
  this.CraftInfo = undefined;
  this.CraftCost = undefined;
  this.ArtCost = undefined;
  this.CalcOptRepair = function() {
      if(this.Id in ArtifactInfo) {
          //console.log(`LotPrice: ${this.LotPrice}, RepairCost: ${this.RepairCost}, LotStrength: ${this.LotStrength}, RestLotStrength: ${this.RestLotStrength}`);
          const optRepair = optimalRepair(this.LotPrice, this.RepairCost, this.LotStrength, this.RestLotStrength);
          this.OptimalRepairCombatCost = optRepair.CombatCost;
          this.OptimalRepairStrength = optRepair.Strength;
          this.OptimalRepairCombatsAmount = optRepair.CombatsAmount;
      }
  }
  this.GetLotInfo = function(wornStrength, wornRestStrength) {
      console.log(`wornStrength: ${wornStrength}, wornRestStrength: ${wornRestStrength}`);
      const optRepair = optimalRepair(this.LotPrice, ArtifactInfo[this.Id].RepairCost, this.LotStrength, this.RestLotStrength, wornStrength, wornRestStrength);
      console.log(optRepair);
      let wornData = "";
      if(optRepair.SpendedCombats) {
          wornData = `, ${LocalizedString.Spended}: ${optRepair.SpendedCombats}, ${LocalizedString.Remaining}: ${optRepair.CombatsAmount - optRepair.SpendedCombats}, ${LocalizedString.ResidualValue}: ${optRepair.ResidualValue}`;
      }
      return `${LocalizedString.BuyInfo}: ${LocalizedString.Cost}: ${this.LotPrice}, ${LocalizedString.Strength}: ${this.RestLotStrength}/${this.LotStrength}, ${LocalizedString.BattlePrice}: ${this.OptimalRepairCombatCost}, ${LocalizedString.Strength}: ${this.OptimalRepairStrength}, ${LocalizedString.Combats}: ${this.OptimalRepairCombatsAmount}${wornData}`;
  }
}
async function logNewArtifactsIds(doc, containsRow) {
    if(!containsRow) {
        return;
    }
    const newArts = JSON.parse(getValue("newArts", "[]"));
    let isArtsAdded = false;
    let options = containsRow.getElementsByTagName("option");
    for(const constoptionElement of options) {
        let valueParts = constoptionElement.value.split("#");
        if(valueParts.length >= 2) {
            let artId = valueParts[1];
            if(!(artId in ArtifactInfo)) {
                let category = "";
                let craftType = CraftType.Unknown;
                const re = new RegExp(`auction.php\\?cat=(\\w+)&sort=0&art_type=${artId}`);
                const ex = re.exec(document.documentElement.innerHTML);
                if(ex) {
                    category = ex[1];
                    craftType = getCraftTypeByCategory(category);
                }
                const artDoc = await getRequest(`/art_info.php?id=${artId}`);
                const artInfoDiv = artDoc.querySelector("div#set_mobile_max_width div.s_art_inside");//                console.log(artInfoDiv);

                const durabilityRegexp = new RegExp(`<b>${isEn ? "Durability" : "Прочность"}:</b> (\\d+)<br>`);
                const durabilityRegexpExec = durabilityRegexp.exec(artInfoDiv.innerHTML);
                const durability = durabilityRegexpExec ? parseInt(durabilityRegexpExec[1]) : 1;

                const ammunitionPointsRegexp = new RegExp(`<b> ${isEn ? "Ammunition points" : "Очки амуниции"}:</b> (\\d+)<br>`);
                const ammunitionPointsRegexpExec = ammunitionPointsRegexp.exec(artInfoDiv.innerHTML);
                const ammunitionPoints = ammunitionPointsRegexpExec ? parseInt(ammunitionPointsRegexpExec[1]) : 1;

                const repairingCostRegexp = new RegExp(`<b> ${isEn ? "Repairing cost" : "Стоимость ремонта"}:</b><table.+<td>([\\d,]+)</td>.+</table><br>`);
                const repairingCostRegexpExec = repairingCostRegexp.exec(artInfoDiv.innerHTML);
                const repairingCost = repairingCostRegexpExec ? parseInt(repairingCostRegexpExec[1].replace(/,/g, "")) : 1;

                const newArt = { ArtId: artId, MarketCategory: category, CraftType: craftType, Strength: durability, AmmunitionPoints: ammunitionPoints, RepairCost: repairingCost, isNew: true };
                newArts.push(newArt);
                isArtsAdded = true;
            }
        }
    }
    //console.log(newArts);
    if(isArtsAdded) {
        setValue("newArts", JSON.stringify(newArts));
        processNewArts();
    }
}
function getCraftTypeByCategory(category) {
    switch(category) {
        case "weapon":
            return CraftType.Weapon;
        case "helm":
        case "shield":
        case "boots":
        case "cuirass":
        case "cloack":
            return CraftType.Armor;
        case "necklace":
        case "ring":
            return CraftType.Jewelry;
        case "backpack":
            return CraftType.Backpack;
    }
    return CraftType.Unknown;
}
function AppendLotInfo(parentElement, artUid, restStrengthInfoElement) {
    restStrengthInfoElement = restStrengthInfoElement || parentElement;
    let artifact = getArtifactLot(artUid);
    if(parentElement && artifact.Id) {
        const wornStrengthData = /(\d{1,4})\/(\d{1,4})/.exec(restStrengthInfoElement.innerHTML);
        if(wornStrengthData && wornStrengthData.length >= 3) {
            var wornStrength = parseInt(wornStrengthData[2]);
            var wornRestStrength = parseInt(wornStrengthData[1]);
        }
        //console.log([wornStrength, wornRestStrength]);
        addElement("b", { innerText: artifact.GetLotInfo(wornStrength, wornRestStrength) }, parentElement);
    }
}
function getArtifactLot(artUid, artId) {
    let artifact;
    let artifactData = getValue(artUid);
    if(artifactData && artifactData != "") {
        artifact = Object.assign(new ArtifactLot, JSON.parse(artifactData));
    }
    if(!artifact) {
        artifact = new ArtifactLot(artUid, artId);
    }
    return artifact;
}
function getArtMinBattlePrice(artId, artUid, craftInfo) {
    const art = ArtifactInfo[artId];

    const factoryPrice = parseInt(getValue("ShopArtFactoryPrice_" + artId, 0));
    const factoryBattlePrice = round00(factoryPrice / art.Strength);
    const shopPrice = parseInt(getValue("ShopArtShopPrice_" + artId, 0));
    const shopBattlePrice = round00(shopPrice / art.Strength);
    let hint = "";
    let minBatlePrice = 0;
    if((minBatlePrice == 0 || minBatlePrice > factoryBattlePrice) && !craftInfo) {
        minBatlePrice = factoryBattlePrice;
        hint = `На производстве цена за бой: ${factoryBattlePrice}`;
    }
    if((minBatlePrice == 0 || minBatlePrice > shopBattlePrice) && !craftInfo) {
        minBatlePrice = shopBattlePrice;
        hint = `В магазине цена за бой: ${shopBattlePrice}`;
    }

    const lot = getSavedArtifactLot(artId, artUid, false, craftInfo);
    // if(artId == "cold_sword2014") {
        // console.log(`factoryPrice: ${factoryPrice}, craftInfo: ${craftInfo}, shopPrice: ${shopPrice}, lot?.OptimalRepairCombatCost: ${lot?.OptimalRepairCombatCost}`);
    // }
    if(lot && (minBatlePrice == 0 || minBatlePrice > lot.OptimalRepairCombatCost)) {
        minBatlePrice = lot.OptimalRepairCombatCost;
        hint = `На рынке цена за бой: ${lot.OptimalRepairCombatCost}`;
    }
    return { minBatlePrice: minBatlePrice, hint: hint };
}
function extractCraftInfo(text) {
    const craftExec = /\[(([IDN]\d{1,2})?(E\d{1,2})?(A\d{1,2})?(W\d{1,2})?(F\d{1,2})?)\]/.exec(text);
    if(craftExec) {
        return craftExec[1];
    }
    return "";
}
function addAfterRepairCombatCostToInventory() {
    const artInfoDivs = document.querySelectorAll("div#inventory_block div.inventory_item_div.inventory_item2");
    const smithRewardPercent = parseInt(getPlayerValue("SmithRewardPercent", 100));
    const smithRecoveryEfficiency = SmithRecoveryEfficiency[parseInt(getPlayerValue("SmithLevel", 9))] / 100;
    //console.log(`addAfterRepairCombatCostToInventory artInfoDivs: ${artInfoDivs.length}`);
    for(const artInfoDiv of artInfoDivs) {
        const artIndex = parseInt(artInfoDiv.getAttribute("art_idx"));
        const artInfo = win.arts[artIndex];
        if(!artInfo) { console.log(`artIndex: ${artIndex}`); console.log(artInfoDiv); continue; }
        const artId = artInfo.art_id;
        const craftInfo = extractCraftInfo(artInfo.suffix);
        if(artId in ArtifactInfo) {
            const repairCost = ArtifactInfo[artId].RepairCost;
            const afterRepairCombatCost = Math.round(repairCost * (smithRewardPercent / 100) / Math.floor(artInfo.durability2 * smithRecoveryEfficiency));
            if(getBool("ShowAfterRepairBattleCostInInventory") && !isNaN(afterRepairCombatCost)) {
                const overlapInfoDiv = artInfoDiv.querySelector("div.art_durability_hidden");
                const artMinBattlePrice = getArtMinBattlePrice(artId, undefined, craftInfo);
                const color = artMinBattlePrice.minBatlePrice < afterRepairCombatCost ? "red" : "green";
                overlapInfoDiv.innerHTML += `<br><span style="color: ${color};">${afterRepairCombatCost}</span>`;
                const img = artInfoDiv.querySelector("img.cre_mon_image2.show_hint");
                img.setAttribute("hint", img.getAttribute("hint") + "<br>" + artMinBattlePrice.hint);

                const customArtInfo = getValue("CustomArtInfo" + artInfo.id, "");
                if(customArtInfo != "") {
                    img.setAttribute("hint", img.getAttribute("hint") + "<br>" + customArtInfo);
                }
            }
            const factoryPrice = parseInt(getValue("ShopArtFactoryPrice_" + artId, 0));
            const shopPrice = parseInt(getValue("ShopArtShopPrice_" + artId, 0));
            if(factoryPrice > 0 && shopPrice > 0 && shopPrice <= factoryPrice && artInfo.renew_disabled == 0) {
                const brokenDiv = artInfoDiv.querySelector("div.inventory_item_normal.inventory_item_broken");
                if(brokenDiv) {
                    //console.log([artId, shopPrice, factoryPrice]);
                    brokenDiv.style.borderColor = "green";
                }
            }
        }
    }
}
function addBattlePriceToInventory() {
    if(!getPlayerBool("ShowBattlePriceInInventory", true)) {
        return;
    }
    // Выведем цену за бой
    let dressedArtsBattleCost = 0;
    for(let i = 0; i < win.slots.length; i++) {
        const slot = win.slots[i];
        if(slot) {
            const artInfo = Array.from(win.arts).find(x => x.id == parseInt(slot));
            if(artInfo) {
                const artBattleCost = getArtBattleCost(artInfo.art_id, artInfo.id, extractCraftInfo(artInfo.suffix));
                dressedArtsBattleCost += artBattleCost;
                if(artBattleCost > 0) {
                    const slotDiv = document.getElementById(`slot${i}`);
                    const durabilityDiv = slotDiv.querySelector("div.art_durability_hidden");
                    let battleCostSpan = durabilityDiv.querySelector(`span#slot${i}BattleCost`);
                    if(!battleCostSpan) {
                        addElement("br", undefined, durabilityDiv);
                        battleCostSpan = addElement("span", { id: `slot${i}BattleCost` }, durabilityDiv);
                    }
                    battleCostSpan.innerText = artBattleCost;
                }
            }
        }
    }
    const inventoryStatsDiv = document.querySelector("div.inventory_stats");
    let dressedArtsBattleCostDiv = inventoryStatsDiv.querySelector("div#dressedArtsBattleCostDiv");
    if(!dressedArtsBattleCostDiv) {
        addElement("div", { class: "inv_stat_data show_hint", title: LocalizedString.BattlePrice, innerHTML: `
            <div class="inv_stat_img_div">
                <div class="set_wh100"></div>
                <img src="${GoldPng}" class="mwh100">
            </div>
            <div id="dressedArtsBattleCostDiv" class="inv_stat_text"></div>` }, inventoryStatsDiv);
        dressedArtsBattleCostDiv = inventoryStatsDiv.querySelector("div#dressedArtsBattleCostDiv");
    }
    dressedArtsBattleCostDiv.innerHTML = Math.round(dressedArtsBattleCost);
}
function getArtBattleCost(artId, artUid, craftInfo) {
    //console.log(`getArtBattleCost artId: ${artId}, artUid: ${artUid}`);
    let artifactLot = getSavedArtifactLot(artId, artUid, true, craftInfo);
    if(artifactLot) {
        return artifactLot.OptimalRepairCombatCost;
    }
    const art = ArtifactInfo[artId];
    const factoryPrice = parseInt(getValue("ShopArtFactoryPrice_" + artId, 0)); // Фабричная цена
    if(factoryPrice > 0 && !craftInfo) {
        return round00(factoryPrice / art.Strength);
    }
    const shopPrice = parseInt(getValue("ShopArtShopPrice_" + artId, 0)); // Магазинная цена
    if(shopPrice > 0 && !craftInfo) {
        return round00(shopPrice / art.Strength);
    }
    artifactLot = getSavedArtifactLot(artId, artUid, false, craftInfo);
    //console.log(artifactLot);
    if(artifactLot) {
        return artifactLot.OptimalRepairCombatCost || 0;
    }
    return 0;
}
function getSavedArtifactLot(artId, artUid, uniqueOnly = false, craftInfo = undefined) {
    // Рыночная цена. Сначала пытаемся найти данные о лоте, если нет, то последние минимальные по данному арту
    let lastBestLotData = getValue(artUid);
    if((!lastBestLotData || lastBestLotData == "") && !uniqueOnly) {
        lastBestLotData = getValue("LastBestLotData_" + artId + (craftInfo ? "Craft" + craftInfo: ""), "");
    }
    //console.log(lastBestLotData);
    if(lastBestLotData && lastBestLotData != "") {
        return Object.assign(new ArtifactLot, JSON.parse(lastBestLotData));
    }
}
function addShopArtsPriceAndBattleCost() {
    let artInfoDivs = document.querySelectorAll("div.s_art");
    for(const artInfoDiv of artInfoDivs) {
        let artPropDiv = artInfoDiv.querySelector("div.s_art_prop");
        let artId = getArtIdFromArtInfoRef(artInfoDiv).Id;
        addShopArtPriceAndBattleCost(artId, artInfoDiv, artPropDiv);
    }
}
function addShopArtPriceAndBattleCost(artId, artInfoDiv, artPropDiv) {
    let price = 0;
    let isPriceFromLot = false;
    let needConvertResourcesToGold = false;
    let amountElement;

    let goldImage = artInfoDiv.querySelector("img[src*='gold']");
    if(goldImage) {
        amountElement = goldImage.nextSibling || goldImage.parentNode.nextSibling;
        if(amountElement) {
            price += parseInt(amountElement.textContent.replace(/,/g, ""));
        }
    }
    let woodImage = artInfoDiv.querySelector("img[src*='wood']");
    if(woodImage) {
        amountElement = woodImage.nextSibling || woodImage.parentNode.nextSibling;
        if(amountElement) {
            needConvertResourcesToGold = true;
            price += parseInt(amountElement.textContent) * 180;
        }
    }
    let oreImage = artInfoDiv.querySelector("img[src*='ore']");
    if(oreImage) {
        amountElement = oreImage.nextSibling || oreImage.parentNode.nextSibling;
        if(amountElement) {
            needConvertResourcesToGold = true;
            price += parseInt(amountElement.textContent) * 180;
        }
    }
    let mercuryImage = artInfoDiv.querySelector("img[src*='mercury']");
    if(mercuryImage) {
        amountElement = mercuryImage.nextSibling || mercuryImage.parentNode.nextSibling;
        if(amountElement) {
            needConvertResourcesToGold = true;
            price += parseInt(amountElement.textContent) * 360;
        }
    }
    let sulfurImage = artInfoDiv.querySelector("img[src*='sulfur']");
    if(sulfurImage) {
        amountElement = sulfurImage.nextSibling || sulfurImage.parentNode.nextSibling;
        if(amountElement) {
            needConvertResourcesToGold = true;
            price += parseInt(amountElement.textContent) * 360;
        }
    }
    let crystalsImage = artInfoDiv.querySelector("img[src*='crystals']");
    if(crystalsImage) {
        amountElement = crystalsImage.nextSibling || crystalsImage.parentNode.nextSibling;
        if(amountElement) {
            needConvertResourcesToGold = true;
            price += parseInt(amountElement.textContent) * 360;
        }
    }
    let gemsImage = artInfoDiv.querySelector("img[src*='gems']");
    if(gemsImage) {
        amountElement = gemsImage.nextSibling || gemsImage.parentNode.nextSibling;
        if(amountElement) {
            needConvertResourcesToGold = true;
            price += parseInt(amountElement.textContent) * 360;
        }
    }
    if(price > 0) {
        setValue("ShopArtShopPrice_" + artId, price);
    }
    let battlePriceText = "";
    const art = ArtifactInfo[artId];
    if(art) {
        battlePriceText = `(${round00(price / art.Strength)})`;
    }
    //console.log(`artId: ${artId}, price: ${price}`);
    if(price == 0) {
        let lastBestLotData = getValue("LastBestLotData_" + artId);
        if(lastBestLotData && lastBestLotData != "") {
            let artifact = Object.assign(new ArtifactLot, JSON.parse(lastBestLotData));
            price = artifact.LotPrice;
            battlePriceText = `(${artifact.OptimalRepairCombatCost})`;
            isPriceFromLot = true;
        }
    }
    //console.log(`artId: ${artId}, price: ${price}, isPriceFromLot: ${isPriceFromLot}`);
    if(price > 0) {
        if(isPriceFromLot) {
            deleteValue("ShopArtFactoryPrice_" + artId); // Записался мусор
            deleteValue("ShopArtShopPrice_" + artId);
        }
        if(!getKeyByValue(EcostatDetailsIds, artId)) {
            deleteValue("ShopArtFactoryPrice_" + artId); // Если арт только магазинный - Записался мусор
        }
        let factoryPrice = parseInt(getValue("ShopArtFactoryPrice_" + artId, 0));
        let factoryPriceText = "";
        if(art && factoryPrice > 0 && factoryPrice != price) {
            factoryPriceText = ` / ${factoryPrice}(${round00(factoryPrice / art.Strength)})`;
        }
        if(!(battlePriceText == "" && factoryPriceText == "" && !needConvertResourcesToGold)) {
            addElement("label", { innerText: ` = ${price}${battlePriceText}${factoryPriceText}` }, artPropDiv);
        }
    }
    //console.log(`${"ShopArtShopPrice_" + artId}: ${getValue("ShopArtShopPrice_" + artId)}, ${"ShopArtFactoryPrice_" + artId}: ${getValue("ShopArtFactoryPrice_" + artId)}`);
}
function getFormatedArtCost(artId) {
    //console.log(`${"ShopArtShopPrice_" + artId}: ${getValue("ShopArtShopPrice_" + artId)}, ${"ShopArtFactoryPrice_" + artId}: ${getValue("ShopArtFactoryPrice_" + artId)}`);
    let shopPrice = getValue("ShopArtShopPrice_" + artId);
    let factoryPrice = getValue("ShopArtFactoryPrice_" + artId);
    //console.log(`artId: ${artId}, shopPrice: ${shopPrice}, factoryPrice: ${factoryPrice}`);
    if(shopPrice || factoryPrice) {
        let result = "";
        let minBattleCost = 0;
        let minArtPrice = 0;
        let strength = ArtifactInfo[artId].Strength;
        if(shopPrice) {
            shopPrice = parseInt(shopPrice);
            minArtPrice = shopPrice;
            const shopBattleCost = round00(shopPrice / strength);
            minBattleCost = shopBattleCost;
            result += `${shopPrice}(${shopBattleCost})`;
        }
        if(factoryPrice && shopPrice != parseInt(factoryPrice)) {
            factoryPrice = parseInt(factoryPrice);
            minArtPrice = factoryPrice < shopPrice || minArtPrice == 0 ? factoryPrice : minArtPrice;
            const factoryBattleCost = round00(factoryPrice / strength);
            minBattleCost = minBattleCost > 0 && minBattleCost <= factoryBattleCost ? minBattleCost : factoryBattleCost;
            result += (result != "" ? " / " : "") + `${factoryPrice}(${factoryBattleCost})`;
        }
        return { CostInfo: result, MinBattleCost: minBattleCost, MinArtPrice: minArtPrice };
    }
}
function getArtIdFromArtInfoRef(artInfoRefContainer) {
    let artId;
    let artUid;
    let craftInfo;
    if(artInfoRefContainer) {
        const artInfoRef = artInfoRefContainer.querySelector("a[href*='art_info.php']");
        if(artInfoRef) {
            artId = getUrlParamValue(artInfoRef.href, "id");
            artUid = getUrlParamValue(artInfoRef.href, "uid");
        }
        const hintImage = artInfoRefContainer.querySelector("img[hint]");
        if(hintImage) {
            const hint = hintImage.getAttribute("hint");
            craftInfo = extractCraftInfo(hint);
        }
    }
    return { Id: artId, Uid: artUid, craftInfo: craftInfo };
}
function getObjectPrice() {
    let buyResForm = document.querySelector("form[name='buy_res']");
    let artId = getArtIdFromArtInfoRef(buyResForm).Id;
    let tableElement = buyResForm.querySelector("table");
    let amountCell = tableElement.rows[1].cells[2];
    let priceCell = tableElement.rows[1].cells[3];
    let amount = parseInt(amountCell.innerText.split("/")[0].replace(/,/g, ""));
    let price = parseInt(priceCell.innerText.replace(/,/g, ""));
    if(amount > 0) { // артефакт есть в наличии
        saveBestArtPrice(artId, price);
    }
}
function saveBestArtPrice(artId, newPrice, force) {
    let savedPrice = parseInt(getValue("ShopArtFactoryPrice_" + artId, 0));
    if(newPrice < savedPrice || savedPrice == 0 || force) {
        setValue("ShopArtFactoryPrice_" + artId, newPrice);
    }
}
function openArtPriceSettings(artUid, artId, craftInfo) {
    //console.log(`artUid: ${artUid}, artId: ${artId}, craftInfo: ${craftInfo}`);
    if(showPupupPanel("ArtPriceSettings" + artUid)) {
        return;
    }
    const artifact = getArtifactLot(artUid, artId);
    artifact.CraftInfo = craftInfo;
    const fieldsMap = [];

    const costLabel = addElement("label", { for: "openArtPriceSettingsLotPrice", innerText: LocalizedString.Cost + "\t" });
    const openArtPriceSettingsLotPrice = addElement("input", { id: "openArtPriceSettingsLotPrice", type: "number", value: artifact.LotPrice });
    openArtPriceSettingsLotPrice.addEventListener("change", function() { artifact.LotPrice = parseInt(this.value); calcArtefactLotAndSave(artifact); openArtPriceSettingsRefresh(artifact); });

    const artCostLabel = addElement("label", { for: "artCostInput", innerText: LocalizedString.ArtCost + "\t" });
    const artCostInput = addElement("input", { id: "artCostInput", type: "number", value: artifact.ArtCost });
    artCostInput.addEventListener("change", function() { artifact.ArtCost = parseInt(this.value); calcArtefactLotAndSave(artifact); openArtPriceSettingsRefresh(artifact); });

    fieldsMap.push([costLabel, openArtPriceSettingsLotPrice, artCostLabel, artCostInput]);

    const strengthLabel = addElement("label", { for: "openArtPriceSettingsLotStrength", innerText: LocalizedString.Strength + "\t" });
    const openArtPriceSettingsLotStrength = addElement("input", { id: "openArtPriceSettingsLotStrength", type: "number", value: artifact.LotStrength });
    openArtPriceSettingsLotStrength.addEventListener("change", function() { artifact.LotStrength = parseInt(this.value); calcArtefactLotAndSave(artifact); openArtPriceSettingsRefresh(artifact); });

    const craftCostLabel = addElement("label", { for: "craftCostInput", innerText: LocalizedString.CraftCostString + "\t" });
    const craftCostInput = addElement("input", { id: "craftCostInput", type: "number", value: artifact.CraftCost });
    craftCostInput.addEventListener("change", function() { artifact.CraftCost = parseInt(this.value); calcArtefactLotAndSave(artifact); openArtPriceSettingsRefresh(artifact); });

    const craftCostRecalcButton = addElement("input", { id: "craftCostRecalcButton", type: "button", value: LocalizedString.Recalc, title: LocalizedString.RecalcFromDaily, class: "button-62" });
    craftCostRecalcButton.addEventListener("click", function(e) { craftCostRecalc(artifact, craftCostInput, e); });

    fieldsMap.push([strengthLabel, openArtPriceSettingsLotStrength, craftCostLabel, craftCostInput, craftCostRecalcButton]);

    const restStrengthLabel = addElement("label", { for: "openArtPriceSettingsRestLotStrength", innerText: LocalizedString.RestStrength + "\t" });
    const openArtPriceSettingsRestLotStrength = addElement("input", { id: "openArtPriceSettingsRestLotStrength", type: "number", value: artifact.RestLotStrength });
    openArtPriceSettingsRestLotStrength.addEventListener("change", function() { artifact.RestLotStrength = parseInt(this.value); calcArtefactLotAndSave(artifact); openArtPriceSettingsRefresh(artifact); });

    const shopCostLabel = addElement("label", { for: "shopCostInput", innerText: (isEn ? "Shop cost" : "Магазинная цена") + "\t" });
    const shopCostInput = addElement("input", { id: "shopCostInput", type: "number", value: parseInt(getValue("ShopArtShopPrice_" + artId, 0)) });
    shopCostInput.addEventListener("change", function() { setValue("ShopArtShopPrice_" + artId, parseInt(this.value)); });

    fieldsMap.push([restStrengthLabel, openArtPriceSettingsRestLotStrength, shopCostLabel, shopCostInput]);

    const battlePriceLabel = addElement("label", { for: "openArtPriceSettingsOptimalRepairCombatCost", innerText: LocalizedString.BattlePrice + "\t" });
    const openArtPriceSettingsOptimalRepairCombatCost = addElement("input", { id: "openArtPriceSettingsOptimalRepairCombatCost", type: "number", value: artifact.OptimalRepairCombatCost, disabled: "disabled" });

    const openArtPriceSettingsCraftUnderCostLabel = addElement("label", { for: "openArtPriceSettingsCraftUnderCost", innerText: (isEn ? "Craft under cost" : "Стоимость недокрафта") + "\t" });
    const openArtPriceSettingsCraftUnderCostInput = addElement("input", { id: "openArtPriceSettingsCraftUnderCost", type: "number", value: artifact.CraftUnderCost, disabled: "disabled" });

    fieldsMap.push([battlePriceLabel, openArtPriceSettingsOptimalRepairCombatCost, openArtPriceSettingsCraftUnderCostLabel, openArtPriceSettingsCraftUnderCostInput]);

    const optimalStrengthLabel = addElement("label", { for: "openArtPriceSettingsOptimalRepairStrength", innerText: LocalizedString.OptimalStrength + "\t" });
    const openArtPriceSettingsOptimalRepairStrength = addElement("input", { id: "openArtPriceSettingsOptimalRepairStrength", type: "number", value: artifact.OptimalRepairStrength, disabled: "disabled" });
    fieldsMap.push([optimalStrengthLabel, openArtPriceSettingsOptimalRepairStrength]);

    const combatsLabel = addElement("label", { for: "openArtPriceSettingsOptimalRepairCombatsAmount", innerText: LocalizedString.Combats + "\t" });
    const openArtPriceSettingsOptimalRepairCombatsAmount = addElement("input", { id: "openArtPriceSettingsOptimalRepairCombatsAmount", type: "number", value: artifact.OptimalRepairCombatsAmount, disabled: "disabled" });
    fieldsMap.push([combatsLabel, openArtPriceSettingsOptimalRepairCombatsAmount]);

    // Стоимость элементов
    const getYesterdayDailyPricesButton = addElement("input", { id: "getYesterdayDailyPricesButton", type: "button", value: isEn ? "Yesterday Daily's" : "Вчерашние с дейли", title: isEn ? "Get yesterday daily prices" : "Получить вчерашние цены с дейли", class: "button-62" });
    getYesterdayDailyPricesButton.addEventListener("click", async function(e) { await getDailyElementsPrices(e); bindElementPrices(); });
    const getMarketPricesButton = addElement("input", { id: "getMarketPricesButton", type: "button", value: isEn ? "Market prices" : "Рыночные цены", title: isEn ? "Get market prices" : "Получить рыночные цены", class: "button-62" });
    getMarketPricesButton.addEventListener("click", async function(e) { await getMarketElementPrices(e); bindElementPrices(); });
    fieldsMap.push([null, addElement("b", { innerText: (isEn ? "Elements price" : "Стоимость элементов"), style: "text-align: center; margin: auto; width: 90%; display: block;" }), getYesterdayDailyPricesButton, getMarketPricesButton]);
    const elementsPrices = JSON.parse(getValue("ElementPrices", "{}"));

    let arr = [];
    for(let i = 0; i < ElementNames.length; i++) {
        const elementName = ElementNames[i];
        arr.push(addElement("img", { src: `${resourcesPath}/i/gn_res/${elementName}.png`, style: "position: inline-block; width: 20px; height: 20px;", title: localElementNames[elementName] }));
        //const label = addElement("label", { for: `${elementName}Price`, innerText: elementName + "\t" });
        const price = addElement("input", { id: `${elementName}Price`, type: "number", value: elementsPrices[elementName], onfocus: "this.select();" });
        price.addEventListener("change", function() { elementsPrices[elementName] = this.value; setValue("ElementPrices", JSON.stringify(elementsPrices)); });
        //arr.push(label);
        arr.push(price);
        //console.log(`i: ${i}, i % 2 == 1: ${i % 2 == 1}, arr.length: ${arr.length}, fieldsMap.length: ${fieldsMap.length}, price.id: ${price.id}`);
        if(i % 2 == 1 || i == ElementNames.length - 1) {
            fieldsMap.push(arr);
            arr = [];
        }
    }
    createPupupPanel("ArtPriceSettings" + artUid, LocalizedString.EditLotInfo, fieldsMap);
}
function bindElementPrices() {
    const elementsPrices = JSON.parse(getValue("ElementPrices", "{}"));
    for(const elementName of ElementNames) {
        document.getElementById(`${elementName}Price`).value = elementsPrices[elementName];
    }
}
async function craftCostRecalc(artifact, craftCostInput, e) {
    if(e) {
        e.target.disabled = true;
    }
    //console.log(`Id: ${artifact.Id}, artifact.CraftInfo: ${artifact.CraftInfo}, CraftType: ${ArtifactInfo[artifact.ArtId]?.CraftType}`);
    [artifact.CraftCost, artifact.CraftUnderCost] = getCraftCost(artifact.CraftInfo, ArtifactInfo[artifact.Id]?.CraftType, true);
    if(craftCostInput) {
        craftCostInput.value = artifact.CraftCost;
    }
    calcArtefactLotAndSave(artifact);
    openArtPriceSettingsRefresh(artifact);
    if(e) {
        e.target.disabled = false;
    }
}
function openArtPriceSettingsRefresh(artifact) {
    document.getElementById("openArtPriceSettingsLotPrice").value = artifact.LotPrice;
    document.getElementById("openArtPriceSettingsOptimalRepairCombatCost").value = artifact.OptimalRepairCombatCost;
    document.getElementById("openArtPriceSettingsOptimalRepairStrength").value = artifact.OptimalRepairStrength;
    document.getElementById("openArtPriceSettingsOptimalRepairCombatsAmount").value = artifact.OptimalRepairCombatsAmount;
    document.getElementById("openArtPriceSettingsCraftUnderCost").value = artifact.CraftUnderCost;
}
function calcArtefactLotAndSave(artifact) {
    if(artifact.ArtCost > 0 || artifact.CraftCost > 0) {
        artifact.LotPrice = (artifact.ArtCost || 0) + (artifact.CraftCost || 0);
    }
    if(artifact.LotPrice > 0 && artifact.LotStrength > 0 && artifact.RestLotStrength > 0) {
        const artRepairCost = ArtifactInfo[artifact.Id].RepairCost;
        const optimalRepairData = optimalRepair(artifact.LotPrice, artRepairCost, artifact.LotStrength, artifact.RestLotStrength);
        artifact.OptimalRepairCombatCost = optimalRepairData.CombatCost;
        artifact.OptimalRepairStrength = optimalRepairData.Strength;
        artifact.OptimalRepairCombatsAmount = optimalRepairData.CombatsAmount;
    }
    setValue(artifact.Uid, JSON.stringify(artifact));
}
function getOrCreateAndResizeDropdown(baseElement, style) {
    const dropdownId = `${baseElement.id}Dropdown`;
    let dropdown = document.getElementById(dropdownId);
    if(!dropdown) {
        baseElement.style.position = "relative";
        const baseElementRect = baseElement.getBoundingClientRect();
        const borderBottomWidth = !isNaN(parseInt(baseElement.style.borderBottomWidth)) ? parseInt(baseElement.style.borderBottomWidth) : 0;
        let top = baseElementRect.height - borderBottomWidth - 1;
        dropdown = addElement("div", { id: dropdownId, style: `position: absolute; top: ${top}px; left: 0px; z-index: 1;` + (style || "") }, baseElement);
        baseElement.addEventListener("click", function() { dropdown.style.display = "block"; });
        baseElement.addEventListener("touchstart", function() { dropdown.style.display = "block"; });
        baseElement.addEventListener("mouseleave", function() { dropdown.style.display = "none"; });
    }
    return dropdown;
}
function countResources() {
    if(!getBool("ShowResourcesCostPanel")) {
        return;
    }
    let dropdown, foreColor;
    let gold, wood, ore, mercury, sulfur, crystals, gems, diamonds;
    const topResTable = document.getElementById("top_res_table");
    if(topResTable) {
        gold = parseInt(topResTable.querySelector("img[src*='gold.png']").parentNode.nextElementSibling.innerText.replace(/,/g, ""));
        wood = parseInt(topResTable.querySelector("img[src*='wood.png']").parentNode.nextElementSibling.innerText.replace(/,/g, ""));
        ore = parseInt(topResTable.querySelector("img[src*='ore.png']").parentNode.nextElementSibling.innerText.replace(/,/g, ""));
        mercury = parseInt(topResTable.querySelector("img[src*='mercury.png']").parentNode.nextElementSibling.innerText.replace(/,/g, ""));
        sulfur = parseInt(topResTable.querySelector("img[src*='sulfur.png']").parentNode.nextElementSibling.innerText.replace(/,/g, ""));
        crystals = parseInt(topResTable.querySelector("img[src*='crystals.png']").parentNode.nextElementSibling.innerText.replace(/,/g, ""));
        gems = parseInt(topResTable.querySelector("img[src*='gems.png']").parentNode.nextElementSibling.innerText.replace(/,/g, ""));
        diamonds = parseFloat(topResTable.querySelector("img[src*='diamonds.png']").parentNode.parentNode.nextElementSibling.innerText.replace(/,/g, ""));

        dropdown = getOrCreateAndResizeDropdown(topResTable, `color: ${topResTable.style.color}; padding: 2px 3px 2px 3px; white-space: nowrap; background: url(https://dcdn2.heroeswm.ru/i/top/bkg2.jpg);`);
        foreColor = topResTable.style.color;
    }
    const resourcesPanel = document.getElementById("ResourcesPanel");
    if(resourcesPanel) {
        gold = parseInt(resourcesPanel.querySelector("img[src*='gold.png']").nextElementSibling.innerText.replace(/,/g, ""));
        wood = parseInt(resourcesPanel.querySelector("img[src*='wood.png']").nextElementSibling.innerText.replace(/,/g, ""));
        ore = parseInt(resourcesPanel.querySelector("img[src*='ore.png']").nextElementSibling.innerText.replace(/,/g, ""));
        mercury = parseInt(resourcesPanel.querySelector("img[src*='mercury.png']").nextElementSibling.innerText.replace(/,/g, ""));
        sulfur = parseInt(resourcesPanel.querySelector("img[src*='sulfur.png']").nextElementSibling.innerText.replace(/,/g, ""));
        crystals = parseInt(resourcesPanel.querySelector("img[src*='crystals.png']").nextElementSibling.innerText.replace(/,/g, ""));
        gems = parseInt(resourcesPanel.querySelector("img[src*='gems.png']").nextElementSibling.innerText.replace(/,/g, ""));
        diamonds = parseFloat(resourcesPanel.querySelector("img[src*='diamonds.png']").nextElementSibling.innerText.replace(/,/g, ""));

        dropdown = getOrCreateAndResizeDropdown(resourcesPanel, `color: #ccb89f; padding: 2px 3px 2px 3px; white-space: nowrap; background: #592c08;`);
        foreColor = "#ccb89f";
    }
    if(dropdown) {
        const table = addElement("table", { style: `color: ${foreColor};` }, dropdown);
        dropdown.style.display = "block";
        let tr;
        if(wood > 0) {
            tr = addElement("tr", undefined, table);
            addElement("td", { innerText: LocalizedString.wood, style: `color: ${foreColor};` }, tr);
            addElement("td", { innerText: `${wood} * 180 =`, style: `color: ${foreColor}; text-align: right;` }, tr);
            addElement("td", { innerText: `${(wood * 180).toLocaleString()}`, style: `color: ${foreColor}; text-align: right;` }, tr);
        }
        if(ore > 0) {
            tr = addElement("tr", undefined, table);
            addElement("td", { innerText: LocalizedString.ore, style: `color: ${foreColor};` }, tr);
            addElement("td", { innerText: `${ore} * 180 =`, style: `color: ${foreColor}; text-align: right;` }, tr);
            addElement("td", { innerText: `${(ore * 180).toLocaleString()}`, style: `color: ${foreColor}; text-align: right;` }, tr);
        }
        if(mercury > 0) {
            tr = addElement("tr", undefined, table);
            addElement("td", { innerText: LocalizedString.mercury, style: `color: ${foreColor};` }, tr);
            addElement("td", { innerText: `${mercury} * 360 =`, style: `color: ${foreColor}; text-align: right;` }, tr);
            addElement("td", { innerText: `${(mercury * 360).toLocaleString()}`, style: `color: ${foreColor}; text-align: right;` }, tr);
        }
        if(sulfur > 0) {
            tr = addElement("tr", undefined, table);
            addElement("td", { innerText: LocalizedString.sulfur, style: `color: ${foreColor};` }, tr);
            addElement("td", { innerText: `${sulfur} * 360 =`, style: `color: ${foreColor}; text-align: right;` }, tr);
            addElement("td", { innerText: `${(sulfur * 360).toLocaleString()}`, style: `color: ${foreColor}; text-align: right;` }, tr);
        }
        if(crystals > 0) {
            tr = addElement("tr", undefined, table);
            addElement("td", { innerText: LocalizedString.crystals, style: `color: ${foreColor};` }, tr);
            addElement("td", { innerText: `${crystals} * 360 =`, style: `color: ${foreColor}; text-align: right;` }, tr);
            addElement("td", { innerText: `${(crystals * 360).toLocaleString()}`, style: `color: ${foreColor}; text-align: right;` }, tr);
        }
        if(gems > 0) {
            tr = addElement("tr", undefined, table);
            addElement("td", { innerText: LocalizedString.gems, style: `color: ${foreColor};` }, tr);
            addElement("td", { innerText: `${gems} * 360 =`, style: `color: ${foreColor}; text-align: right;` }, tr);
            addElement("td", { innerText: `${(gems * 360).toLocaleString()}`, style: `color: ${foreColor}; text-align: right;` }, tr);
        }
        const totalResourcesValue = wood * 180 + ore * 180 + mercury * 360 + sulfur * 360 + crystals * 360 + gems * 360;
        if(totalResourcesValue > 0) {
            tr = addElement("tr", { style: "color: yellow; font-weight: bold;" }, table);
            addElement("td", { innerText: LocalizedString.Total, style: "color: yellow;" }, tr);
            addElement("td", undefined, tr);
            addElement("td", { innerText: `${totalResourcesValue.toLocaleString()}`, style: "color: yellow; text-align: right;" }, tr);
        }
        tr = addElement("tr", undefined, table);
        addElement("td", { innerText: LocalizedString.gold, style: `color: ${foreColor};` }, tr);
        addElement("td", undefined, tr);
        addElement("td", { innerText: gold.toLocaleString(), style: `color: ${foreColor}; text-align: right;` }, tr);
        if(totalResourcesValue > 0) {
            tr = addElement("tr", { style: "color: yellow; font-weight: bold;" }, table);
            addElement("td", { innerText: LocalizedString.Total, style: "color: yellow;" }, tr);
            addElement("td", undefined, tr);
            addElement("td", { innerText: (gold + totalResourcesValue).toLocaleString(), style: "color: yellow; text-align: right;" }, tr);
        }
        if(diamonds > 0) {
            tr = addElement("tr", undefined, table);
            addElement("td", { innerText: LocalizedString.diamonds, style: `color: ${foreColor};` }, tr);
            addElement("td", { innerText: `${diamonds} * 5000 = `, style: `color: ${foreColor}; text-align: right;` }, tr);
            addElement("td", { innerText: (diamonds * 5000).toLocaleString(), style: `color: ${foreColor}; text-align: right;` }, tr);
            tr = addElement("tr", { style: "color: yellow; font-weight: bold;" }, table);
            addElement("td", { innerText: LocalizedString.Total, style: "color: yellow;" }, tr);
            addElement("td", undefined, tr);
            addElement("td", { innerText: (gold + totalResourcesValue + diamonds * 5000).toLocaleString(), style: "color: yellow; text-align: right;" }, tr);
        }
        dropdown.style.display = "none";
    }
}
function certificateAuctionReferences() {
    const houseCertificates = document.querySelectorAll("img[src*='house_cert.jpg']");
    let table;
    let totalAmount = 0;
    let total = 0;
    for(const houseCertificate of houseCertificates) {
        const cell = houseCertificate.parentNode;
        const row = cell.parentNode;
        if(!table) {
            table = row.parentNode;
        }
        const sectorRef = row.querySelector("a[href*='map.php']");
        const locationNumber = getLocationNumberByCoordinate(getUrlParamValue(sectorRef.href, "cx"), getUrlParamValue(sectorRef.href, "cy"));
        const artId = getSertIdByLocationNumber(locationNumber);
        const auctionLotUrl = `/auction.php?cat=cert&sort=0&art_type=${artId}`;

        cell.removeChild(houseCertificate);
        const auctionLotRef = addElement("a", { href: auctionLotUrl }, cell);
        auctionLotRef.appendChild(houseCertificate);

        const amountCell = row.cells[2];
        const amount = parseInt(/(\d+)%/.exec(amountCell.innerHTML)[1]);
        const marketPrice = parseInt(getValue("LastBestLotData_" + artId, 0));
        //console.log(`marketPrice: ${marketPrice}, amount: ${amount}, artId: ${artId}`);
        addElement("td", { innerText: (marketPrice > 0 ? marketPrice.toLocaleString() : "" ), class: "wbwhite", style: "text-align: right;" }, row);
        addElement("td", { innerText: (marketPrice > 0 ? (amount * marketPrice).toLocaleString() : ""), class: "wbwhite", style: "text-align: right;" }, row);
        totalAmount += amount;
        total += amount * marketPrice;
    }
    if(table) {
        const titleRow = table.rows[0];
        addElement("td", { innerText: LocalizedString.MarketPrice, class: "wbwhite", style: "text-align: center; font-weight: bold;", title: LocalizedString.ToUpdateTheCertificatePrice }, titleRow);
        addElement("td", { innerText: LocalizedString.Total, class: "wbwhite", style: "text-align: center; font-weight: bold;" }, titleRow);
        const totalRow = addElement("tr", undefined, table);
        addElement("td", { innerText: LocalizedString.Total, colspan: 2, class: "wbwhite", style: "font-weight: bold;" }, totalRow);
        addElement("td", { innerText: totalAmount.toLocaleString(), class: "wbwhite", style: "text-align: right; font-weight: bold;" }, totalRow);
        addElement("td", { innerText: "", class: "wbwhite", style: "text-align: right; font-weight: bold;" }, totalRow);
        addElement("td", { innerText: total.toLocaleString(), class: "wbwhite", style: "text-align: right; font-weight: bold;" }, totalRow);
    }
}
function addBattlePrice(playerLevel = PlayerLevel) {
    if(location.pathname == "/home.php" && !getPlayerBool("ShowBattlePriceOnHome", true) || location.pathname == "/pl_info.php" && !getPlayerBool("ShowBattlePriceInPlayerInfo", true)) {
        return;
    }
    let artDivs = document.querySelectorAll("div.arts_info.shop_art_info");
    let battleCost = 0;
    for(const artDiv of artDivs) {
        const artInfo = getArtIdFromArtInfoRef(artDiv);
        const artBattleCost = getArtBattleCost(artInfo.Id, artInfo.Uid, artInfo.craftInfo);
        if(artBattleCost > 0) {
            let artDurabilityDiv = artDiv.querySelector("div.art_durability_hidden");
            if(!artDurabilityDiv.innerText.includes(`\n${artBattleCost}`)) {
                artDurabilityDiv.innerText += `\n${artBattleCost}`;
            }
        }
        battleCost += artBattleCost;
    }
    const [craftTotal, ammunitionPointsTotal] = calcCraftAndAmmunitionPoints(playerLevel);
    battleCost = Math.round(battleCost);
    //console.log(`battleCost: ${battleCost}, craftTotal: ${craftTotal}, ammunitionPointsTotal: ${ammunitionPointsTotal}`);
    if(battleCost > 0) {
        if(location.pathname == '/home.php') {
            let hwmOptimalRepairAtMarketBattlePriceContainer = document.getElementById("hwmOptimalRepairAtMarketBattlePriceContainer");
            let hwmOptimalRepairAtMarketAmmunitionPointsContainer = document.getElementById("hwmOptimalRepairAtMarketAmmunitionPointsContainer");
            let hwmOptimalRepairAtMarketCraftValueContainer = document.getElementById("hwmOptimalRepairAtMarketCraftValueContainer");
            if(!hwmOptimalRepairAtMarketBattlePriceContainer) {
                if(isNewPersonPage) {
                    const statsContainer = document.querySelector("div#home_css_stats_wrap_div > div");
                    const battleCostContainer = addElement("div", { class: "inv_stat_data home_stat_data show_hint", title: `${LocalizedString.BattlePrice}` }, statsContainer);
                    addElement("div", { innerHTML: `<img src="${GoldPng}" alt="" title="${LocalizedString.BattlePrice}" width="24" height="24" border="0">`, class: "inv_stat_img_div home_stat_img_div" }, battleCostContainer);
                    addElement("div", { innerHTML: `<b id="hwmOptimalRepairAtMarketBattlePriceContainer"></b>`, align: "center", class: "inv_stat_text home_stat_text" }, battleCostContainer);
                } else {
                    const statsContainer = getParent(document.querySelector("table img[src*='attr_attack.png']"), "tr", 2);
                    statsContainer.insertAdjacentHTML("beforeend", `
<td valign="top">
    <table border="0" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td><img style="padding-left: 3px;" src="${GoldPng}" alt="" title="${LocalizedString.BattlePrice}" width="24" height="24" border="0"></td><td align="center"><b id="hwmOptimalRepairAtMarketBattlePriceContainer"></b></td>
            </tr>
            <tr>
                <td align="center">
                    <img title="${isEn ? "AP" : "ОА"}" src="https://dcdn.heroeswm.ru/i/icons/attr_oa.png?v=1" width="24" height="24" />
                </td>
                <td align="center">
                    <b id="hwmOptimalRepairAtMarketAmmunitionPointsContainer"></b>
                </td>
            </tr>
            <tr id=hwmOptimalRepairAtMarketCraftValueRow>
                <td align="center">
                    <img title="${isEn ? "Craft" : "Крафт"}" src="/i/mod_common.gif" width="24" height="24" />
                </td>
                <td align="center">
                    <b id="hwmOptimalRepairAtMarketCraftValueContainer"></b>
                </td>
            </tr>
        </tbody>
    </table>
</td>
`);
                    // addElement("td", { innerHTML: `<img src="${GoldPng}" alt="" title="${LocalizedString.BattlePrice}" width="24" height="24" border="0">`, style: "padding-left: 3px;" }, tr);
                    // addElement("td", { innerHTML: `${LocalizedString.BattlePrice}: `, align: "center", style: "padding-left: 3px;" }, tr);
                    // addElement("td", { innerHTML: `<b id="hwmOptimalRepairAtMarketBattlePriceContainer"></b>`, align: "center", style: "padding-left: 3px;" }, tr);
                }
                hwmOptimalRepairAtMarketBattlePriceContainer = document.getElementById("hwmOptimalRepairAtMarketBattlePriceContainer");
                hwmOptimalRepairAtMarketAmmunitionPointsContainer = document.getElementById("hwmOptimalRepairAtMarketAmmunitionPointsContainer");
                hwmOptimalRepairAtMarketCraftValueContainer = document.getElementById("hwmOptimalRepairAtMarketCraftValueContainer");
            }
            hwmOptimalRepairAtMarketBattlePriceContainer.innerHTML = battleCost;
            if(hwmOptimalRepairAtMarketAmmunitionPointsContainer) {
                hwmOptimalRepairAtMarketAmmunitionPointsContainer.innerHTML = ammunitionPointsTotal;
            }
            if(hwmOptimalRepairAtMarketCraftValueContainer) {
                hwmOptimalRepairAtMarketCraftValueContainer.innerHTML = `${craftTotal}%`;
                document.getElementById("hwmOptimalRepairAtMarketCraftValueRow").style.display = craftTotal > 0 ? "" : "none";
            }
        }
        if(location.pathname == '/pl_info.php') {
            const tableElement = getParent(document.querySelector("table img[src*='attr_attack.png']"), "table");
            const hwmOptimalRepairAtMarketBattlePriceContainer = document.getElementById("hwmOptimalRepairAtMarketBattlePriceContainer") || addElement("tr", { id: "hwmOptimalRepairAtMarketBattlePriceContainer" }, tableElement);
            hwmOptimalRepairAtMarketBattlePriceContainer.innerHTML = `<td><img src="${GoldPng}" alt="" title="${LocalizedString.BattlePrice}" width="24" height="24" border="0"></td><td align="center"><b>${battleCost}</b></td>`;
            const hwmOptimalRepairAtMarketAmmunitionPointsContainer = document.getElementById("hwmOptimalRepairAtMarketAmmunitionPointsContainer") || addElement("tr", { id: "hwmOptimalRepairAtMarketAmmunitionPointsContainer" }, tableElement);
            hwmOptimalRepairAtMarketAmmunitionPointsContainer.innerHTML = `<td align="center">
                <img title="${isEn ? "AP" : "ОА"}" src="https://dcdn.heroeswm.ru/i/icons/attr_oa.png?v=1" width="24" height="24" />
            </td>
            <td align="center">
                <b>${ammunitionPointsTotal}</b>
            </td>
`;
            const hwmOptimalRepairAtMarketCraftValueContainer = document.getElementById("hwmOptimalRepairAtMarketCraftValueContainer") || addElement("tr", { id: "hwmOptimalRepairAtMarketCraftValueContainer" }, tableElement);
            hwmOptimalRepairAtMarketCraftValueContainer.innerHTML = craftTotal > 0 ? `<td align="center">
                <img title="${isEn ? "Craft" : "Крафт"}" src="/i/mod_common.gif" width="24" height="24" />
            </td>
            <td align="center">
                <b>${craftTotal}%</b>
            </td>
` : "";
        }
    }
}
function calcCraftAndAmmunitionPoints(playerLevel = PlayerLevel) {
    let ammunitionPointsTotal = 0;
    let craftTotal = 0;
    let artsRefs = Array.from(document.querySelectorAll("div[id^=slot] a[href^='art_info.php?id=']"));
    if(artsRefs.length == 0) {
        artsRefs = Array.from(document.querySelectorAll("div.arts_info.shop_art_info a[href^='art_info.php?id=']"));
    }
    artsRefs.forEach(x => {
        const hint = x.querySelector("img[hint]").getAttribute("hint");
        const craftExec = /\[(([IDN]\d{1,2})?(E\d{1,2})?(A\d{1,2})?(W\d{1,2})?(F\d{1,2})?)\]/.exec(hint);
        let craftRate = 1;
        if(craftExec) {
            const craftInfo = craftExec[1];
            const craftExec2 = craftInfo.match(/\d{1,2}/g);
            const craftSum = craftExec2.reduce((t, x) => t + parseInt(x), 0);
            //console.log(craftExec2)
            craftTotal += craftSum;
            craftRate += craftSum * 0.02;
            //console.log(`craftInfo: ${craftInfo}, craftSum: ${craftSum}, craftRate: ${craftRate}`);
        }
        const artName = getUrlParamValue(x.href, "id");
        const artInfo = ArtifactInfo[artName];
        if(artInfo) {
            const ammunitionPoints = typeof(artInfo.AmmunitionPoints) == "function" ? artInfo.AmmunitionPoints(playerLevel) : artInfo.AmmunitionPoints;
            //console.log(`typeof(artInfo.AmmunitionPoints): ${typeof(artInfo.AmmunitionPoints)}, ammunitionPoints: ${ammunitionPoints}`);
            ammunitionPointsTotal += Math.floor(ammunitionPoints * craftRate);
        }
    });
    return [craftTotal, ammunitionPointsTotal];
}
async function startRepairWaiting() {
    if(getBool("BeginRepairOnSmithFree") && isHeartOnPage) {
        let savedRepairEnd = getPlayerValue("RepairEnd");
        if(!savedRepairEnd || parseInt(savedRepairEnd) <= Date.now()) {
            await parseSmithPage();
            const leader = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x)).find(x => true);
            if(leader) {
                savedRepairEnd = getPlayerValue("RepairEnd");
                if(savedRepairEnd) {
                    setTimeout(startRepairWaiting, parseInt(savedRepairEnd) - Date.now());
                } else {
                    await repairArt(leader);
                    await parseSmithPage();
                }
            }
        } else {
            setTimeout(startRepairWaiting, parseInt(savedRepairEnd) - Date.now());
        }
    }
}
async function repairArt(art) {
    console.log(`repairArt art.Id: ${art.Id}, art.TradeId: ${art.TradeId}, PlayerSign: ${PlayerSign}`);
    if(art.TradeId) {
        await getRequest(`/trade_accept.php?tid=${art.TradeId}&sign=${PlayerSign}`);
        await readTradesToMe(true);
    } else {
        await postRequest("/mod_workbench.php", `action=repair&art_id=${art.Id}&art_id2=${art.Id}&but=${isEn ? "Repair" : "%CE%F2%F0%E5%EC%EE%ED%F2%E8%F0%EE%E2%E0%F2%FC"}`);
    }
    deleteArtFromSmithSchedule(art.Id);
}
async function findClanDepository() {
    if(location.pathname=='/map.php' && location.search == '') {
        //console.log(`ClanDepository: ${getValue("ClanDepository")}, ClanDepositoryLocations: ${getValue("ClanDepositoryLocations")}`);
        deleteValue("InClanDepositorySector");
        const mapRightBlock = document.getElementById("map_right_block");
        if(mapRightBlock) {
            const sklad = mapRightBlock.querySelector("a[href^='sklad_info.php']");
            if(sklad) {
                setValue("InClanDepositorySector", true);
            }
            const clanDepository = getValue("ClanDepository");
            if(sklad) {
                if(!clanDepository || clanDepository != sklad.href || !getValue("ClanDepositoryLocations")) {
                    setValue("ClanDepository", sklad.href);
                    const doc = await getRequest(sklad.href);
                    const stockSectorRefs = Array.from(doc.querySelectorAll("a[href^='map.php?cx']"));
                    const stockLocationNumbers = stockSectorRefs.map(x => getLocationNumberFromMapUrlByXy(x.href));
                    //console.log(`ClanDepositoryLocations: ${stockLocationNumbers.join()}`);
                    setValue("ClanDepositoryLocations", stockLocationNumbers.join());
                }
            } else {
                if(clanDepository) {
                    const clanDepositoryLocations = getValue("ClanDepositoryLocations", "").split(",").filter(x => x != "").map(x => parseInt(x));
                    if(clanDepositoryLocations.includes(playerLocationNumber)) {
                        // Склада - нет, а мы в его секторе. Значит игрок вышел из клана
                        deleteValue("ClanDepository");
                        deleteValue("ClanDepositoryLocations");
                    }
                }
            }
        }
    }
}
async function findClanDepositoryRepair() {
    const clanDepository = getValue("ClanDepository");
    //console.log(clanDepository);
    if(isHeartOnPage && clanDepository && !getPlayerValue("RepairEnd") && getBool("BeginRepairClanDepository") && getBool("InClanDepositorySector")) {
        const clanDepositoryLastRequestedTime = getValue("ClanDepositoryLastRequestedTime");
        //console.log(`clanDepositoryLastRequestedTime: ${clanDepositoryLastRequestedTime}, ${((Date.now() - parseInt(clanDepositoryLastRequestedTime)) < 60 * 1000)}`);
        if(clanDepositoryLastRequestedTime && ((Date.now() - parseInt(clanDepositoryLastRequestedTime)) < 60 * 1000)) {
            setTimeout(findClanDepositoryRepair, 40 * (1 + Math.random()) * 1000);
            return;
        }
        const doc = await getRequest(clanDepository);
        const repairRefs = doc.querySelectorAll("a[href*='sklad_info.php']"); //sklad_info.php?id=175&cat=-1&action=repair&repair_id=418409576&sign=4d0c5f8dfcc71ed0619916bdcbac8d9b
        setValue("ClanDepositoryLastRequestedTime", Date.now());
        let maxCost = 0;
        let repair;
        for(const repairRef of repairRefs) {
            if(getUrlParamValue(repairRef.href, "action") == "repair") {
                const td = getParent(repairRef, "td");
                const re = new RegExp(`${ isEn ? "Your cut" : "Вам" }: ([\\d,]+)`);
                //console.log(`td.innerHTML: ${td.innerHTML}, re: ${re}`);
                const result = re.exec(td.innerHTML);
                const cost = parseInt(result[1].replace(/,/g, ""));
                if(maxCost == 0 || cost > maxCost) {
                    maxCost = cost;
                    repair = repairRef;
                }
            }
        }
        if(repair) {
            console.log(`repair found: ${repair.href}, maxCost: ${maxCost}`);
            await parseSmithPage();
            if(!getPlayerValue("RepairEnd")) {
                await getRequest(repair.href);
                await parseSmithPage();
            }
        } else {
            console.log("Clan depository needn't for repair");
            setTimeout(findClanDepositoryRepair, 40 * (1 + Math.random()) * 1000);
        }
    }
}
async function checkClanDepositoryNeedRepair() {
    const clanDepository = getValue("ClanDepository");
    const lastClanDepositoryNeedRepairRequestDate = parseInt(getValue("LastClanDepositoryNeedRepairRequestDate", 0));
    if(isHeartOnPage && clanDepository && (getValue("ShowClanDepositoryRepairIcon", "0") == "2" || getValue("ShowClanDepositoryRepairIcon", "0") == "1" && !getPlayerValue("RepairEnd"))) {
        //console.log(`clanDepository: ${clanDepository}, isOnClanDepositoryPage: ${location.href.includes(clanDepository)}, lastClanDepositoryNeedRepairRequestDate: ${Date.now() - lastClanDepositoryNeedRepairRequestDate}`);
        if(location.href.includes(clanDepository) || Date.now() - lastClanDepositoryNeedRepairRequestDate > 1000 * 60) {
            const doc = location.href.includes(clanDepository) ? document : await getRequest(clanDepository);
            parseClanDepositoryNeedRepair(doc);
        }
        const lastClanDepositoryNeedRepairRequestResult = getValue("LastClanDepositoryNeedRepairRequestResult");
        toggleHomeIndicator("https://dcdn.heroeswm.ru/i/castle_im/btn_forge.png", lastClanDepositoryNeedRepairRequestResult, clanDepository, !!lastClanDepositoryNeedRepairRequestResult, "StockRepairSignTitle", "StockRepairSign");
    }
}
function parseClanDepositoryNeedRepair(doc) {
    setValue("LastClanDepositoryNeedRepairRequestDate", Date.now());
    const bold = [...doc.querySelectorAll("b")].find(x => x.innerHTML.includes(isEn ? "Artifacts to repair" : "Артефакты для ремонта"));
    const artsForRepairContainer = getParent(bold, "tr")?.nextElementSibling;
    if(artsForRepairContainer) {
        const arts = artsForRepairContainer.querySelectorAll("a[href^='art_info.php']");
        const lastClanDepositoryNeedRepairRequestResult = isEn ? `There are ${arts.length} artifacts in stock in need of repair` : `На складе ${arts.length} ${declOfNum(arts.length, ['артефакт требует', 'артефакта требуют', 'артефактов требуют'])} ремонта`;
        //console.log(lastClanDepositoryNeedRepairRequestResult);
        setValue("LastClanDepositoryNeedRepairRequestResult", lastClanDepositoryNeedRepairRequestResult);
    } else {
        deleteValue("LastClanDepositoryNeedRepairRequestResult");
    }
}
async function smithScheduling() {
    if(!getBool("SmithSchedulingEnabled")) {
        return;
    }
    const repairRefs = document.querySelectorAll("a[href*='sklad_info.php']"); //sklad_info.php?id=175&cat=-1&action=repair&repair_id=418409576&sign=4d0c5f8dfcc71ed0619916bdcbac8d9b
    for(const repairRef of repairRefs) {
        if(getUrlParamValue(repairRef.href, "action") == "repair") {
            repairRef.addEventListener("click", function() { setValue("RepairAwaiting", Date.now()); });
        }
    }
    if(location.pathname=='/mod_workbench.php' && getUrlParamValue(location.href, "type") == "repair") {
        //setPlayerValue("TradesToMe", JSON.stringify({"Id":"53897507","SenderId":"4039417","SenderName":"iNeroon","ArtId":"boots13","ArtName":"Обсидиановые сапоги","ForRepairs":true,"Cost":"7,652","Durability":"0/70","Percent":"90"}));
        const smithSchedulingRecords = getPlayerValue("SmithSchedulingRecords", "");
        if(smithSchedulingRecords.includes("&")) {
            setPlayerValue("SmithSchedulingRecords", JSON.stringify(smithSchedulingRecords.split("&")));
        }

        await parseSmithPage();
        const baseTable = document.querySelector("table.wbwhite");
        baseTable.insertAdjacentHTML("beforeend", `<tr><td><center id=scheduleContainer></center></td></tr>`);
        refreshSmithScheduleTables();
        //selectItemForRepair();
        const but = document.querySelector("input[name='but']");
        if(but) {
            but.addEventListener("click", function() { setValue("RepairAwaiting", Date.now()); });
        }
    } else if(getValue("RepairAwaiting")) {
        await parseSmithPage(); // Обновим информацию, т.к. ожидаем, что начали ремонт не через основной интерфейс
    }
    deleteValue("RepairAwaiting");
    startRepairWaiting();
    updateRepairTimerPanel("SmithMoratoriumPanel");
}
function selectItemForRepair() {
    const leader = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x)).find(x => true);
    const artsList = document.querySelector("select[name='art_id']");
    if(leader && artsList && artsList.value == "0" && !getBool("BeginRepairOnSmithFree")) {
        artsList.value = leader.Id;
        win.selectart(0);
    }
}
function addArtToSmithSchedule(art) {
    const smithSchedulingRecords = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x));
    const found = smithSchedulingRecords.find(x => x.Id == art.Id);
    if(found) {
        return;
    }
    art.Queue = smithSchedulingRecords.reduce((c, e) => Math.max(c, e.Queue), 0) + 1;
    smithSchedulingRecords.push(art);
    setPlayerValue("SmithSchedulingRecords", JSON.stringify(smithSchedulingRecords.map(x => JSON.stringify(x))));
}
function deleteArtFromSmithSchedule(artId) {
    const smithSchedulingRecords = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x)).filter(x => x.Id != artId);
    smithSchedulingRecords.sort((a, b) => a.Queue == b.Queue ? 0 : (a.Queue > b.Queue ? 1 : -1));
    let i = 1;
    for(const smithSchedulingRecord of smithSchedulingRecords) {
        smithSchedulingRecord.Queue = i++;
    }
    setPlayerValue("SmithSchedulingRecords", JSON.stringify(smithSchedulingRecords.map(x => JSON.stringify(x))));
}
function upArtInSmithSchedule(artId, scheduleRow, queueColumnIndex) {
    const smithSchedulingRecords = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x));
    const artIndex = smithSchedulingRecords.findIndex(x => x.Id == artId);
    if(artIndex == 0) {
        return;
    }
    smithSchedulingRecords[artIndex].Queue -= 1;
    scheduleRow.cells[queueColumnIndex].innerText = smithSchedulingRecords[artIndex].Queue;

    smithSchedulingRecords[artIndex - 1].Queue += 1;
    scheduleRow.previousElementSibling.cells[queueColumnIndex].innerText = smithSchedulingRecords[artIndex - 1].Queue;

    smithSchedulingRecords.splice(artIndex - 1, 2, smithSchedulingRecords[artIndex], smithSchedulingRecords[artIndex - 1]);
    //console.log(smithSchedulingRecords);
    setPlayerValue("SmithSchedulingRecords", JSON.stringify(smithSchedulingRecords.map(x => JSON.stringify(x))));
    scheduleRow.parentNode.insertBefore(scheduleRow, scheduleRow.previousElementSibling);
}
function downArtInSmithSchedule(artId, scheduleRow, queueColumnIndex) {
    const smithSchedulingRecords = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x));
    const artIndex = smithSchedulingRecords.findIndex(x => x.Id == artId);
    if(artIndex == smithSchedulingRecords.length - 1) {
        return;
    }
    smithSchedulingRecords[artIndex].Queue += 1;
    scheduleRow.cells[queueColumnIndex].innerText = smithSchedulingRecords[artIndex].Queue;

    smithSchedulingRecords[artIndex + 1].Queue -= 1;
    scheduleRow.nextElementSibling.cells[queueColumnIndex].innerText = smithSchedulingRecords[artIndex + 1].Queue;

    smithSchedulingRecords.splice(artIndex, 2, smithSchedulingRecords[artIndex + 1], smithSchedulingRecords[artIndex]);
    //console.log(smithSchedulingRecords);
    setPlayerValue("SmithSchedulingRecords", JSON.stringify(smithSchedulingRecords.map(x => JSON.stringify(x))));
    scheduleRow.parentNode.insertBefore(scheduleRow.nextElementSibling, scheduleRow);
}
function refreshSmithScheduleTables() {
    refreshSmithScheduleTable();
    refreshSmithBrokenArtsTable();
    refreshTradedToRepairTable();
}
function refreshSmithScheduleTable() {
    const scheduleContainer = document.getElementById("scheduleContainer");
    const table = scheduleContainer.querySelector("table#SmithScheduleTable") || addElement("table", { id: "SmithScheduleTable", class: "smithTable" }, scheduleContainer);
    const smithSchedulingRecords = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x));
    table.style.display = smithSchedulingRecords.length == 0 ? "none" : "";
    if(smithSchedulingRecords.length == 0) {
        table.innerHTML = "";
        return;
    }
    table.innerHTML = `<tr>
    <th>${isEn ? "Art ID": "ID арта"}</th>
    <th>${isEn ? "Name (strength)" : "Наименование (прочность)"}</th>
    <th>${isEn ? "Sender" : "Отправитель"}</th>
    <th>${isEn ? "Repair pay" : "Плата за ремонт"}</th>
    <th>${isEn ? "Income" : "Доход"}</th>
    <th>${isEn ? "Repair cost" : "Стоимость ремонта"}</th>
    <th>${isEn ? "Repair time" : "Время ремонта"}</th>
    <th>${isEn ? "Repair end" : "Окончание ремонта"}</th>
    <th>${isEn ? "Queue" : "Очередь"}</th>
    <th>${isEn ? "Up" : "Поднять"}</th>
    <th>${isEn ? "Down" : "Опустить"}</th>
    <th>${isEn ? "Delete" : "Удалить"}</th>
    <th>${isEn ? "Repair" : "Ремонтировать"}</th>
</tr>
`;
    const savedRepairEnd = getPlayerValue("RepairEnd");
    const deleteButtonName = isEn ? "Delete" : (Math.random() < 0.05 ? "Нах" : "Удалить");
    const queueColumnIndex = 8;
    for(const smithSchedulingRecord of smithSchedulingRecords) {
        let repairCost = "";
        let repairTime = "";
        let repairEnd = "";
        if(smithSchedulingRecord.ArtId) {
            const art = ArtifactInfo[smithSchedulingRecord.ArtId];
            if(art) {
                repairCost = art.RepairCost;
                const repairTimeMs = round00(art.RepairCost / 4000) * 60 * 60000;
                repairTime = timeToMinutesFormat(repairTimeMs);
                repairEnd = timeToDateMinutesFormat(getServerTime() + repairTimeMs);
            }
        }

        const scheduleRow = addElement("tr", { innerHTML : `
<td>${smithSchedulingRecord.Id}</td>
<td>${smithSchedulingRecord.Name} [0/${smithSchedulingRecord.Durability2}]</td>
    <td>${smithSchedulingRecord.SenderId ? `<a href="/pl_info.php?id=${smithSchedulingRecord.SenderId}">${smithSchedulingRecord.SenderName}</a>` : "" }</td>
    <td>${smithSchedulingRecord.SenderId ? `${parseInt(smithSchedulingRecord.Cost.replace(/,/g, "")).toLocaleString()} (${smithSchedulingRecord.Percent}%)` : ""}</td>
    <td>${smithSchedulingRecord.SenderId ? `${(parseInt(smithSchedulingRecord.Cost.replace(/,/g, "")) - repairCost).toLocaleString()}` : ""}</td>
<td>${repairCost.toLocaleString()}</td>
<td>${repairTime}</td>
<td>${repairEnd}</td>
<td>${smithSchedulingRecord.Queue}</td>
<td><input name=upButton class="button-62" type=button value="${isEn ? "Up" : "Вверх"}"></td>
<td><input name=downButton class="button-62" type=button value="${isEn ? "Down" : "Вниз"}"></td>
<td><input name=deleteButton class="button-62" type=button value="${deleteButtonName}"></td>
<td><input name=repairButton class="button-62${savedRepairEnd ? " not-allowed" : ""}" type=button value="${isEn ? "Repair" : "Ремонт"}" ${savedRepairEnd ? "disabled" : ""} title="${isEn ? (savedRepairEnd ? "The forge is busy" : "Repair") : (savedRepairEnd ? "Кузница занята" : "Ремонтировать")}"></td>
`}, table);
        scheduleRow.querySelector("input[name=upButton]").addEventListener("click", function() { upArtInSmithSchedule(smithSchedulingRecord.Id, scheduleRow, queueColumnIndex); });
        scheduleRow.querySelector("input[name=downButton]").addEventListener("click", function() { downArtInSmithSchedule(smithSchedulingRecord.Id, scheduleRow, queueColumnIndex); });
        scheduleRow.querySelector("input[name=deleteButton]").addEventListener("click", function() { deleteArtFromSmithSchedule(smithSchedulingRecord.Id); refreshSmithScheduleTables(); });
        scheduleRow.querySelector("input[name=repairButton]").addEventListener("click", async function() {
            if(confirm(isEn ? `Repair ${smithSchedulingRecord.Name} [0/${smithSchedulingRecord.Durability2}]?` : `Ремонтировать ${smithSchedulingRecord.Name} [0/${smithSchedulingRecord.Durability2}]?`)) {
                await repairArt(smithSchedulingRecord);
                location.reload();
            }
        });
    }
}
function refreshSmithBrokenArtsTable() {
    const scheduleContainer = document.getElementById("scheduleContainer");
    const table = scheduleContainer.querySelector("table#SmithBrokenArtsTable") || addElement("table", { id: "SmithBrokenArtsTable", class: "smithTable" }, scheduleContainer);
    const inventoryArts = JSON.parse(getPlayerValue("InventoryArts", "{}"));
    const brokenArts = JSON.parse(getPlayerValue("BrokenArts", "[]")).map(x => { const art = JSON.parse(x); art.ArtId = inventoryArts[art.Id]; return art; });
    const smithSchedulingRecordsIds = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => { const art = JSON.parse(x); return art.Id; });
    const notScheduledArts = brokenArts.filter(x => !smithSchedulingRecordsIds.includes(x.Id));
    table.style.display = notScheduledArts.length == 0 ? "none" : "";
    if(notScheduledArts.length == 0) {
        table.innerHTML = "";
        return;
    }
    console.log(notScheduledArts);
    table.innerHTML = `<tr>
    <th>${isEn ? "Art ID" : "ID арта"}</th>
    <th>${isEn ? "Name (strength)" : "Наименование (прочность)"}</th>
    <th>${isEn ? "Repair cost" : "Стоимость ремонта"}</th>
    <th>${isEn ? "Repair time" : "Время ремонта"}</th>
    <th>${isEn ? "Repair end" : "Окончание ремонта"}</th>
    <th>${isEn ? "Push to queue" : "Поставить в очередь"}</th>
    <th>${isEn ? "Repair" : "Ремонтировать"}</th>
</tr>`;
    const savedRepairEnd = getPlayerValue("RepairEnd");
    for(const artInfo of notScheduledArts) {
        let repairCost = "";
        let repairTime = "";
        let repairEnd = "";
        if(artInfo.ArtId) {
            const art = ArtifactInfo[artInfo.ArtId];
            if(art) {
                repairCost = art.RepairCost;
                const repairTimeMs = round00(art.RepairCost / 4000) * 60 * 60000;
                repairTime = timeToMinutesFormat(repairTimeMs);
                repairEnd = timeToDateMinutesFormat(getServerTime() + repairTimeMs);
            }
        }
        const scheduleRow = addElement("tr", { innerHTML: `<td>${artInfo.Id}</td>
<td>${artInfo.Name} [0/${artInfo.Durability2}]</td>
<td>${repairCost.toLocaleString()}</td>
<td>${repairTime}</td>
<td>${repairEnd}</td>
<td><input type=button name=pushToQueue value="${isEn ? "Push to queue" : "В очередь"}" class="button-62"></td>
<td><input type=button name=repair value="${isEn ? "Repair" : "Ремонт"}" class="button-62${savedRepairEnd ? " not-allowed" : ""}" ${savedRepairEnd ? "disabled" : ""} title="${isEn ? (savedRepairEnd ? "The forge is busy" : "Repair") : (savedRepairEnd ? "Кузница занята" : "Ремонтировать")}"></td>
` }, table);
        scheduleRow.querySelector("input[name=pushToQueue]").addEventListener("click", function() { addArtToSmithSchedule(artInfo); refreshSmithScheduleTables(); });
        scheduleRow.querySelector("input[name=repair]").addEventListener("click", async function() { if(confirm(isEn ? `Repair ${artInfo.Name} [0/${artInfo.Durability2}]?` : `Ремонтировать ${artInfo.Name} [0/${artInfo.Durability2}]?`)) { await repairArt(artInfo); location.reload(); } });
    }
}
function refreshTradedToRepairTable() {
    const smithSchedulingRecordsIds = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => { const art = JSON.parse(x); return art.Id; });
    const trades = getPlayerValue("TradesToMe", "").split("&").filter(x => x != "").map(x => JSON.parse(x)).filter(x => x.ForRepairs && !smithSchedulingRecordsIds.includes(x.Id));
    console.log(trades);
    const scheduleContainer = document.getElementById("scheduleContainer");
    const table = scheduleContainer.querySelector("table#TradedToRepairTable") || addElement("table", { id: "TradedToRepairTable", class: "smithTable" }, scheduleContainer);
    table.style.display = trades.length == 0 ? "none" : "";
    if(trades.length == 0) {
        table.innerHTML = "";
        return;
    }
    const savedRepairEnd = getPlayerValue("RepairEnd");
    table.innerHTML = `<tr>
    <th>${isEn ? "Trade ID": "ID передачи"}</th>
    <th>${isEn ? "Name (strength)" : "Наименование (прочность)"}</th>
    <th>${isEn ? "Sender" : "Отправитель"}</th>
    <th>${isEn ? "Repair pay" : "Плата за ремонт"}</th>
    <th>${isEn ? "Income" : "Доход"}</th>
    <th>${isEn ? "Repair cost" : "Стоимость ремонта"}</th>
    <th>${isEn ? "Repair time" : "Время ремонта"}</th>
    <th>${isEn ? "Repair end" : "Окончание ремонта"}</th>
    <th>${isEn ? "Push to queue" : "Поставить в очередь"}</th>
    <th>${isEn ? "Repair" : "Ремонтировать"}</th>
</tr>
${trades.map(x => {
            let repairCost = 0;
            let repairTime = "";
            let repairEnd = "";
            if(x.ArtId) {
                const art = ArtifactInfo[x.ArtId];
                if(art) {
                    repairCost = art.RepairCost;
                    const repairTimeMs = round00(art.RepairCost / 4000) * 60 * 60000;
                    repairTime = timeToMinutesFormat(repairTimeMs);
                    repairEnd = timeToDateMinutesFormat(getServerTime() + repairTimeMs);
                }
            }

    return `<tr>
    <td>${x.Id}</td>
    <td>${x.ArtName} [${x.Durability}]</td>
    <td><a href="/pl_info.php?id=${x.SenderId}">${x.SenderName}</a></td>
    <td>${parseInt(x.Cost.replace(/,/g, "")).toLocaleString()} (${x.Percent}%)</td>
    <td>${(parseInt(x.Cost.replace(/,/g, "")) - repairCost).toLocaleString()}</td>
    <td>${repairCost.toLocaleString()}</td>
    <td>${repairTime}</td>
    <td>${repairEnd}</td>
    <td><input type=button name=pushToQueue value="${isEn ? "Push to queue" : "В очередь"}" class="button-62${savedRepairEnd ? " not-allowed" : ""}" artId="${x.Id}"></td>
    <td><input type=button name=repair value="${isEn ? "Repair" : "Ремонт"}" class="button-62" ${savedRepairEnd ? "disabled" : ""} artId="${x.Id}" title="${isEn ? (savedRepairEnd ? "The forge is busy" : "Repair") : (savedRepairEnd ? "Кузница занята" : "Ремонтировать")}"></td>
</tr>`;
}).join("")}
`;
    Array.from(table.querySelectorAll("input[name=pushToQueue]")).forEach(x => x.addEventListener("click", function() {
        const art = trades.find(x => x.Id == this.getAttribute("artId"));
        art.TradeId = art.Id;
        art.Name = art.ArtName;
        art.Durability2 = parseInt(art.Durability.split("/")[1]);
        addArtToSmithSchedule(art);
        refreshSmithScheduleTables();
    }));
    Array.from(table.querySelectorAll("input[name=repair]")).forEach(x => x.addEventListener("click", async function() {
        if(confirm(isEn ? "Repair?" : "Ремонтировать?")) {
            await repairArt({ TradeId: this.getAttribute("artId") });
            location.reload();
        }
    }));
}
function repackSavedSmithSchedule() {
    const brokenArtIds = JSON.parse(getPlayerValue("BrokenArts", "[]")).map(x => { const art = JSON.parse(x); return art.Id; });
    const tradeIds = getPlayerValue("TradesToMe", "").split("&").filter(x => x != "").map(x => JSON.parse(x)).filter(x => x.ForRepairs).map(x => x.Id);
    console.log(tradeIds);
    const smithSchedulingRecords = JSON.parse(getPlayerValue("SmithSchedulingRecords", "[]")).map(x => JSON.parse(x)).filter(x => brokenArtIds.includes(x.Id) || tradeIds.includes(x.Id));
    smithSchedulingRecords.sort((a, b) => a.Queue == b.Queue ? 0 : (a.Queue > b.Queue ? 1 : -1));
    let i = 1;
    for(const smithSchedulingRecord of smithSchedulingRecords) {
        smithSchedulingRecord.Queue = i++;
    }
    setPlayerValue("SmithSchedulingRecords", JSON.stringify(smithSchedulingRecords.map(x => JSON.stringify(x))));
}
async function parseSmithPage() {
    const doc = (location.pathname == '/mod_workbench.php' && getUrlParamValue(location.href, "type") == "repair") ? document : await getRequest("/mod_workbench.php?type=repair");
    const allb = doc.querySelectorAll("b");
    for(const b of allb) {
        if(b.innerText.includes(LocalizedString.UnderRepair)) {
            var repairData = b.innerText;
            break;
        }
    }
    if(repairData) {
        const restRepairTime = { Hours: 0, Minutes: 0, Seconds: 59 };
        //В ремонте: еще 1 ч. 31 мин. //Under repair another 1 h. 17 min.
        const hoursRegex = new RegExp(`(\\d+) ${isEn ? "h" : "ч"}\\.`);
        const hoursRegexResult = hoursRegex.exec(repairData);
        if(hoursRegexResult) {
            restRepairTime.Hours = parseInt(hoursRegexResult[1]);
        }
        const minutesRegex = new RegExp(`(\\d+) ${isEn ? "min" : "мин"}\\.`);
        const minutesRegexResult = minutesRegex.exec(repairData);
        if(minutesRegexResult) {
            restRepairTime.Minutes = parseInt(minutesRegexResult[1]);
        }
        //console.log(repairData);
        //console.log(restRepairTime);
        const repairEnd = new Date();
        repairEnd.setHours(repairEnd.getHours() + restRepairTime.Hours);
        repairEnd.setMinutes(repairEnd.getMinutes() + restRepairTime.Minutes);
        repairEnd.setSeconds(repairEnd.getSeconds() + restRepairTime.Seconds);
        //console.log(repairEnd);

        const savedRepairEnd = getPlayerValue("RepairEnd");
        if(!savedRepairEnd || Math.abs(repairEnd.getTime() - parseInt(savedRepairEnd)) / 1000 / 60 > 2) {
            setPlayerValue("RepairEnd", repairEnd.getTime());
        }
    } else {
        deletePlayerValue("RepairEnd");
    }
    updateRepairTimerPanel("SmithMoratoriumPanel");

    let artsInfos = [];
    const artsList = doc.querySelector("select[name='art_id']");
    if(artsList) {
        artsInfos = Array.from(artsList.querySelectorAll("option")).filter(x => parseInt(x.value) > 0).map(x => {
            const artInfoExec = /(.+) \[0\/(\d+)\]/.exec(x.innerText);
            return { Id: parseInt(x.value), Name: artInfoExec[1], Durability2: parseInt(artInfoExec[2]) };
        });
    }
    setPlayerValue("BrokenArts", JSON.stringify(artsInfos.map(x => JSON.stringify(x))));
    repackSavedSmithSchedule();
}
function updateRepairTimerPanel(panelId) {
    const repairTimerPanel = document.querySelector(`#${panelId}`);
    let savedRepairEnd = getPlayerValue("RepairEnd");
    //console.log(savedRepairEnd);
    //console.log(repairTimerPanel);
    if(repairTimerPanel && savedRepairEnd) {
        savedRepairEnd = parseInt(savedRepairEnd);
        const now = Date.now();
        if(savedRepairEnd > now) {
            let diff = savedRepairEnd - now;
            const days = Math.floor(diff / 1000 / 60 / 60 / 24);
            diff -= days * 1000 * 60 * 60 * 24;
            const hours = Math.floor(diff / 1000 / 60 / 60);
            diff -= hours * 1000 * 60 * 60;
            const mimutes = Math.floor(diff / 1000 / 60);
            diff -= mimutes * 1000 * 60;
            const seconds = Math.floor(diff / 1000);
            const formatedTime = (days > 0 ? days + " " : "") + (hours > 0 ? hours + ":" : "") + ( (mimutes < 10) ? '0' : '' ) + mimutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            repairTimerPanel.innerText = formatedTime;
            setTimeout(function() { updateRepairTimerPanel(panelId); }, 1000);
        } else {
            repairTimerPanel.innerText = "";
            deletePlayerValue("RepairEnd");
        }
    }
}

function attachArtTtransferActionsToItems() {
    if(!getBool("ArtBulkTtransferEnabled")) {
        return;
    }
    let artInfoDivs = document.querySelectorAll("div.inventory_item_div.inventory_item2");
    //console.log(`artInfoDivs.length: ${artInfoDivs.length}`);
    for(const artInfoDiv of artInfoDivs) {
        const artIndex = parseInt(artInfoDiv.getAttribute("art_idx"));
        const artInfo = win.arts[artIndex];
        if(!artInfo) { console.log(`artIndex: ${artIndex}`); continue; }
        if(artInfo.transfer_ok == 0) {
            continue;
        }
        const artId = artInfo.art_id;
        const artUid = artInfo.id;
        const hint = artInfoDiv.querySelector(".cre_mon_image2.show_hint").getAttribute("hint");
        const craftInfo = extractCraftInfo(hint);
        const artInfoDivRect = artInfoDiv.getBoundingClientRect();
        const isBroken = artInfo.can_be_repaired == 1 ? true : false;
        //const isBroken = artInfoDiv.querySelector("div.inventory_item_normal.inventory_item_broken") ? true : false;
        const verticalShiftDown = 9;
        const artTransferFormActivatorWidth = 15;
        const artTransferFormActivatorHeight = 15;
        let rects;
        if(InventoryArtMenuDirection == InventoryArtMenuDirections.Horizontal) {
            rects = {
                artSelector: {
                    top: artInfoDivRect.height - 18 + verticalShiftDown,
                    left: artInfoDivRect.width - 18 + 9
                },
                artTransferFormActivator: {
                    top: artInfoDivRect.height - artTransferFormActivatorHeight - 1 + verticalShiftDown,
                    left: artInfoDivRect.width - artTransferFormActivatorWidth - 5,
                    height: artTransferFormActivatorHeight,
                    width: artTransferFormActivatorWidth
                },
                artSaleButton: {
                    top: artInfoDivRect.height - artTransferFormActivatorHeight - 1 + verticalShiftDown,
                    left: artInfoDivRect.width - artTransferFormActivatorWidth * 2 - 5,
                    height: artTransferFormActivatorHeight,
                    width: artTransferFormActivatorWidth
                }
            };
        } else {
            rects = {
                artSelector: {
                    top: artInfoDivRect.height - 18 + verticalShiftDown,
                    left: artInfoDivRect.width - 18 + 9
                },
                artTransferFormActivator: {
                    top: artInfoDivRect.height - 18 + verticalShiftDown - artTransferFormActivatorHeight + 3,
                    left: artInfoDivRect.width - 18 + 12,
                    height: artTransferFormActivatorHeight,
                    width: artTransferFormActivatorWidth
                },
                artSaleButton: {
                    top: artInfoDivRect.height - 18 + verticalShiftDown - artTransferFormActivatorHeight * 2 + 3,
                    left: artInfoDivRect.width - 18 + 12,
                    height: artTransferFormActivatorHeight,
                    width: artTransferFormActivatorWidth
                },
                artDataFormActivator: {
                    top: artInfoDivRect.height - 18 + verticalShiftDown - artTransferFormActivatorHeight * 3 + 3,
                    left: artInfoDivRect.width - 18 + 12,
                    height: artTransferFormActivatorHeight,
                    width: artTransferFormActivatorWidth
                }
            };
        }
        const artSelector = addElement("input", { type: "checkbox", name: "artSelector", artId: artId, artUid: artUid, artIndex: artIndex, style: `position: absolute; top: ${rects.artSelector.top}px; left: ${rects.artSelector.left}px; z-index: 3;` }, artInfoDiv);
        if(isBroken) {
            artSelector.setAttribute("isBroken", isBroken);
        }
        artSelector.addEventListener("click", function(e) {
            e.stopPropagation();
            const selectedArts = document.querySelectorAll("input[name='artSelector']:checked");
            document.getElementById("ArtBulkTransferSkladButton").disabled = document.getElementById("ArtBulkTtransferTransferButton").disabled = document.getElementById("ArtBulkTtransferWithRecallInButton").disabled = selectedArts.length == 0;
            const selectedArtsArray = Array.from(selectedArts);
            let isBrokenCheckBox = selectedArtsArray.find(x => x.hasAttribute("isBroken"));
            document.getElementById("ArtBulkTtransferIntoRepairsButton").disabled = isBrokenCheckBox ? false : true;
        });

        const artTransferFormActivator = addElement("input", { type: "image", src: "/i/inv_im/btn_art_transfer.png", name: "artTransferFormActivator", value: "...", artIndex: artIndex, style: `position: absolute; top: ${rects.artTransferFormActivator.top}px; left: ${rects.artTransferFormActivator.left}px; z-index: 3; width: ${rects.artTransferFormActivator.width}px; height: ${rects.artTransferFormActivator.height}px;`, title: LocalizedString.TransferData }, artInfoDiv);
        artTransferFormActivator.addEventListener("click", function(e) { e.stopPropagation(); showTransferDataPanel(parseInt(this.getAttribute("artIndex"))); });

        const artSaleButton = addElement("input", { type: "image", src: "/i/r/48/gold.png", name: "artSaleButton", value: "...", artIndex: artIndex, style: `position: absolute; top: ${rects.artSaleButton.top}px; left: ${rects.artSaleButton.left}px; z-index: 3; width: ${rects.artSaleButton.width}px; height: ${rects.artSaleButton.height}px;`, title: artInfo.can_be_repaired == 0 ? LocalizedString.Sale : LocalizedString.ToMarket }, artInfoDiv);
        artSaleButton.addEventListener("click", function(e) {
            e.stopPropagation();
            if(artInfo.can_be_repaired == 0) {
                setValue("ArtSave", JSON.stringify({ Id: artId, Uid: artUid, ArtType: artId, Strength: artInfo.durability2, RestStrength: artInfo.durability1, CraftInfo: craftInfo }));
                getURL("/auction_new_lot.php");
            } else {
                getURL(getAuctionUrl(`${artId}@${artUid}`));
            }
        });
        if(getBool("ShowArtifactInformationIconInInventory", true)) {
            const artDataFormActivator = addElement("input", { type: "image", src: "https://dcdn.heroeswm.ru/i/inv_im/btn_art_info1.png", name: "artDataFormActivator", value: "...", artIndex: artIndex, style: `position: absolute; top: ${rects.artDataFormActivator.top}px; left: ${rects.artDataFormActivator.left}px; z-index: 3; width: ${rects.artDataFormActivator.width}px; height: ${rects.artDataFormActivator.height}px;`, title: isEn ? "Info" : "Инфо" }, artInfoDiv);
            //console.log(`hint: ${hint}, craftInfo: ${craftInfo}`)
            artDataFormActivator.addEventListener("click", function(e) { e.stopPropagation(); openArtPriceSettings(artUid, artId, craftInfo); });
        }
    }
}
function createPersonPageSellResourceReferences() {
    if(location.pathname == '/pl_info.php' && getUrlParamValue(location.href, "id") == PlayerId) {
        const resourcesPanel = getResourcesPanel();
        createPersonPageSellResourceReferencesCore(resourcesPanel);
    }
}
function createPersonPageSellResourceReferencesCore(resourcesPanel) {
    const resourceSlots = resourcesPanel.querySelectorAll("div.resourceSlot");
    //console.log(`createPersonPageSellResourceReferencesCore resourceSlots: ${resourceSlots.length}`);
    for(const resourceSlot of resourceSlots) {
        const amountSlot = resourceSlot.querySelector("div.amountSlot");
        const amount = parseInt(amountSlot.innerHTML);
        const auctionReference = resourceSlot.querySelector("a");
        const artType = getUrlParamValue(auctionReference.href, "art_type");
        const artCategory = getUrlParamValue(auctionReference.href, "cat");
        let artId;
        let sellAmount = 0;
        if(artCategory == "part") {
            artId = artType.replace("part_", "ARTPART_");
            sellAmount = amount >= 20 ? 20 : 0;
        }
        if(artCategory == "elements") {
            artId = getElementOptionValueByName(artType);
            sellAmount = 1;
        }
        if(sellAmount > 0) {
            amountSlot.setAttribute("title", "Продать");
            amountSlot.addEventListener("click", function(e) {
                setValue("ArtSave", JSON.stringify({ Id: artId, Amount: sellAmount, ArtType: artType }));
                getURL("/auction_new_lot.php");
            });
        }
    }
    if(resourceSlots.length == 0) {
        observe(resourcesPanel, function() { createPersonPageSellResourceReferencesCore(resourcesPanel); });
    }
}
function getResourcesPanel() {
    const tables = document.querySelectorAll("table.wblight");
    for(const table of tables) {
        const bolds = table.querySelectorAll("b");
        for(const bold of bolds) {
            if(bold.innerText == (isEn ? "Resources" : "Ресурсы")) {
                return table.rows[1].cells[0];
            }
        }
    }
}
function drawArtsTtransferPanel() {
    if(!getBool("ArtBulkTtransferEnabled")) {
        return;
    }
    const containerBlock = document.querySelector("div.container_block");
    const bulkSend = addElement("div", { class: "inv_note_kukla", style: "padding: 4px 4px 4px 4px" }, containerBlock);
    const buttonsClass = "inv_text_kukla_btn inv_text_kukla_btn_hover"
    addElement("div", { innerText: LocalizedString.Transfer + " ", class: "inv_scroll_content_inside" }, bulkSend);

    // На склад
    const skladButton = addElement("input", { id: "ArtBulkTransferSkladButton", type: "button", value: "На склад", title: "На склад", class: buttonsClass }, bulkSend);
    skladButton.disabled = true;
    skladButton.addEventListener("click", transferArtsSklad);
    addElement("br", undefined, bulkSend);
    addElement("br", undefined, bulkSend);

    addElement("span", { innerText: LocalizedString.Receiver + " " }, bulkSend);
    const receiverName = addElement("input", { id: "TransferReceiverNameInput", type: "text", value: getValue("LastReceiver", ""), style: "width: 120px;", autocomplete: "off", onfocus: "this.value = ''; document.getElementById('receiverNames').style.display = 'block'; document.getElementById('receiverNames').style.display = 'none';" }, bulkSend);
   createDataList(receiverName, "receiverNames", buttonsClass);

    addElement("br", undefined, bulkSend);
    const transferButton = addElement("input", { id: "ArtBulkTtransferTransferButton", type: "button", value: LocalizedString.IntoOwnership, title: LocalizedString.IntoOwnershipTitle, class: buttonsClass }, bulkSend);
    transferButton.disabled = true;
    transferButton.addEventListener("click", transferArts);

    // боев
    addElement("br", undefined, bulkSend);
    addElement("br", undefined, bulkSend);
    addElement("span", { innerText: LocalizedString.BulkTransferBattlesNum + " " }, bulkSend);
    const lastTransferBattlesInput = addElement("input", { id: "BulkTransferBattlesNumButton", type: "number", value: getValue("BulkTransferBattlesNum", ""), min: "1", max: "100", style: "width: 50px;" }, bulkSend);
    lastTransferBattlesInput.addEventListener("change", function() { setOrDeleteNumberValue("BulkTransferBattlesNum", this.value); });

    // с возвратом через
    addElement("span", { innerText: " " + LocalizedString.BulkTransferRecallTime + " " }, bulkSend);
    const lastTransferRecallTimeInput = addElement("input", { id: "BulkTransferRecallTimeButton", type: "number", value: getValue("BulkTransferRecallTime", ""), min: "0.01", max: "365", style: "width: 50px;" }, bulkSend);
    lastTransferRecallTimeInput.addEventListener("change", function() { setOrDeleteNumberValue("BulkTransferRecallTime", this.value); });

    // дней
    addElement("span", { innerText: " " + LocalizedString.Days + " " }, bulkSend);

    // за
    addElement("br", undefined, bulkSend);
    addElement("span", { innerText: " " + LocalizedString.BulkTransferGold + " " }, bulkSend);
    const lastTransferRecallGoldInput = addElement("input", { id: "BulkTransferGoldButton", type: "number", value: getValue("BulkTransferGold", ""), min: "", max: "99999", style: "width: 50px;" }, bulkSend);
    lastTransferRecallGoldInput.addEventListener("change", function() { setOrDeleteNumberValue("BulkTransferGold", this.value); });

    // с возвратом
    const withRecallInButton = addElement("input", { id: "ArtBulkTtransferWithRecallInButton", type: "button", value: LocalizedString.WithRecallIn, title: LocalizedString.WithRecallInTitle, class: buttonsClass }, bulkSend);
    withRecallInButton.disabled = true;
    withRecallInButton.addEventListener("click", transferArtsWithRecall);

    // % от цены ремонта
    addElement("br", undefined, bulkSend);
    addElement("br", undefined, bulkSend);
    addElement("span", { innerText: LocalizedString.PercentOfRepairCost }, bulkSend);
    const lastTransferRepairsPercentInput = addElement("input", { type: "number", value: getValue("LastTransferRepairsPercent", "100"), min: "10", max: "150", style: "width: 50px;" }, bulkSend);
    lastTransferRepairsPercentInput.addEventListener("change", function() { setOrDeleteNumberValue("LastTransferRepairsPercent", this.value); });

    // В ремонт
    const intoRepairsButton = addElement("input", { id: "ArtBulkTtransferIntoRepairsButton", type: "button", value: LocalizedString.IntoRepairs, title: LocalizedString.IntoRepairsTitle, class: buttonsClass }, bulkSend);
    intoRepairsButton.disabled = true;
    intoRepairsButton.addEventListener("click", repairArts);

    addElement("br", undefined, bulkSend);

    // Отменить всё
    const all_trades_from_me = document.querySelector("div#all_trades_from_me");
    const cancelTransferButton = addElement("input", { type: "button", value: LocalizedString.CancelAll, class: buttonsClass }, bulkSend);
    cancelTransferButton.disabled = all_trades_from_me ? false : true;
    cancelTransferButton.addEventListener("click", cancelTransfers);

    addElement("br", undefined, bulkSend);

    // Принять всё бесплатное
    const all_trades_to_me = document.querySelector("div#all_trades_to_me");
    const acceptFreeButton = addElement("input", { type: "button", value: "Принять всё без цены", title: "Принять всё без цены", class: buttonsClass }, bulkSend);
    acceptFreeButton.disabled = all_trades_to_me ? false : true;
    acceptFreeButton.addEventListener("click", acceptFreeTransfers);

    if(getPlayerBool("ShowKits")) {
        const createKitButton = addElement("input", { id: "CreateKitButton", type: "button", value: isEn ? "Create kit" : "Создать комплект", class: buttonsClass }, bulkSend);
        createKitButton.addEventListener("click", function() { new KitsManager().Create(); });
    }
}
function auctionNewLot() {
    const sel = document.querySelector("select#sel");
    const anl_count = document.querySelector("input#anl_count");
    anl_count.type = "number";
    anl_count.setAttribute("onfocus", "this.select();");

    const anl_price = document.querySelector("input#anl_price");
    anl_price.type = "number";
    anl_price.setAttribute("onfocus", "this.select();");
    //anl_price.setAttribute("step", "10"); // Допускает только кратные 10-ти значения
    const saleInfo = addElement("b", { id: "anl_price_extra_info", style: "margin-left: 5px;" });
    anl_price.parentNode.insertBefore(saleInfo, anl_price.nextElementSibling);
    anl_price.addEventListener("change", function() {
        saleInfo.innerText = "";
        if(sel.selectedIndex > -1) {
            saleInfo.innerText = "";
            const artInfo = calcArtTypeAndCategory(sel.value);
            const strengthExec = /(\d+)\/(\d+)/.exec(sel.options[sel.selectedIndex].text);
            //console.log(strengthExec);
            if(strengthExec && strengthExec.length >=3 && Number(this.value) > 0) {
                const strength = parseInt(strengthExec[2]);
                const restStrength = parseInt(strengthExec[1]);
                const art = new ArtifactLot(artInfo.Uid, artInfo.Id, strength, restStrength, Number(this.value));
                art.CalcOptRepair();
                saleInfo.innerText = `${LocalizedString.BattlePrice}: ${art.OptimalRepairCombatCost}, ${LocalizedString.Strength}: ${art.OptimalRepairStrength}, ${LocalizedString.Combats}: ${art.OptimalRepairCombatsAmount}`;
            }
        }
    });
    const anl_form_ok = document.querySelector("form[name='anl_form_ok']");
    const formContainer = anl_form_ok.parentNode;
    const marketContainer = addElement("div");
    formContainer.parentNode.insertBefore(marketContainer, formContainer.nextElementSibling);

    sel.addEventListener("change", function() {
        const art = calcArtTypeAndCategory(this.value);
        const craftInfo = extractCraftInfo(this.options[this.selectedIndex].text);
        const strengthExec = /(\d+)\/(\d+)/.exec(this.options[this.selectedIndex].text);
        let strength;
        let restStrength;
        if(strengthExec && strengthExec.length >=3) {
            strength = parseInt(strengthExec[2]);
            restStrength = parseInt(strengthExec[1]);
        }
        setValue("ArtSave", JSON.stringify({ Id: art.Id, Uid: art.Uid, ArtType: art.ArtType, CraftInfo: craftInfo, Strength: strength, RestStrength: restStrength }));
        loadLots(marketContainer, getAuctionUrl(this.value));
    });
    const toMarketButton = document.querySelector("div[onclick*='auction.php']");
    toMarketButton.onclick = "";
    toMarketButton.addEventListener("click", function() { getURL(getAuctionUrl(sel.value)); });

    const art = JSON.parse(getValue("ArtSave", "{}"));
    console.log(art);
    if(art.Id) {
        let searchStr = `option[value='${art.Id}']`;
        if(art.Uid) {
            searchStr = `option[value^='${art.Id}@${art.Uid}']`;
        }
        let options = Array.from(sel.querySelectorAll(searchStr)); //        console.log(options);
        console.log(`auctionNewLot searchStr: ${searchStr}, options.length: ${options.length}`);
        if(options.length == 0 && art.Uid) {
            searchStr = `option[value^='${art.Id}@']`;
            options = Array.from(sel.querySelectorAll(searchStr));
            console.log(`auctionNewLot searchStr: ${searchStr}, options.length: ${options.length}`);
        }
        if(options.length == 1) {
            options[0].selected = true;
        } else if(options.length > 1) {
            console.log(options);
            const found = options.find(x => x.value.includes(art.Uid) || x.innerText.includes(`${art.RestStrength}/${art.Strength}`));
            if(found) {
                found.selected = true;
            }
        }
        anl_count.value = art.Amount || 1;
        anl_count.dispatchEvent(new Event('change'));
        anl_count.dispatchEvent(new Event('keyup'));
    }
    loadLots(marketContainer, getAuctionUrl(sel.value));
}
async function loadLots(marketContainer, url) {
    marketContainer.innerHTML = "";
    if(url && getUrlParamValue(url, "cat")) {
        const doc = await getRequest(url);
        const extendResult = await extendLotsTable(doc, url, true);
        if(extendResult.Table) {
            //console.log(extendResult.Arts)
            marketContainer.appendChild(extendResult.Table);
            const art = JSON.parse(getValue("ArtSave", "{}"));
            //console.log(art)
            var arrSell = document.querySelector("#arr_sell");
            if(art.ArtType) {
                let artId = art.ArtType;
                const isPart = artId.startsWith("part_");
                if(isPart) {
                    artId = artId.substring(5);
                }
                const isArt = artId in ArtifactInfo;
                const anl_price = document.querySelector("input#anl_price");
                if(isArt) {
                    var leastPpb = 2147483647;
                    for (const [key, value] of Object.entries(extendResult.Arts)) {
                        for (const entry of value) {
                            var ppb = entry.LotPrice / entry.RestLotStrength;
                            if (ppb < leastPpb) {
                                leastPpb = ppb;
                            }
                        }
                    }
                    const anl_price_extra_info = document.querySelector("b#anl_price_extra_info");
                    if (anl_price_extra_info != null) {
                        anl_price_extra_info.style.display = 'inline';
                        if (arrSell == null) {
                            arrSell = document.createElement("text");
                            arrSell.id = "arr_sell";
                            anl_price_extra_info.insertAdjacentElement('afterend', arrSell);
                        }
                        arrSell.innerHTML = `<br> или <b>${Math.floor(leastPpb * art.RestStrength) - (((leastPpb * art.RestStrength) % 1 == 0) ? 1 : 0)}</b> для фильтра "Цена боя: По возрастанию", min цена боя без ремонта: ${leastPpb.toFixed(2)}`;
                    }
                    const cheapestLot = JSON.parse(getValue("LastBestLotData_" + artId + (art.CraftInfo ? "Craft" + art.CraftInfo: ""), "{}"));
                    console.log(cheapestLot);
                    if(isPart) {
                        anl_price.value = cheapestLot.LotPrice - 1;
                    } else {
                        anl_price.value = adjustToCheapest(art) || "";
                    }
                } else {
                    const minLotPrice = parseInt(getValue("LastBestLotData_" + artId, 0));
                    console.log(`minLotPrice: ${minLotPrice}`);
                    anl_price.value = Math.max(minLotPrice - 1, 0);
                    const anl_price_extra_info = document.querySelector("b#anl_price_extra_info");
                    anl_price_extra_info.style.display = 'none';
                    if (arrSell != null) {
                        arrSell.innerHTML = ``;
                    }
                }
                anl_price.dispatchEvent(new Event('change'));
                anl_price.dispatchEvent(new Event('keyup'));
            } else {
                const anl_price_extra_info = document.querySelector("b#anl_price_extra_info");
                anl_price_extra_info.style.display = 'none';
                if (arrSell != null) {
                    arrSell.innerHTML = ``;
                }
            }
        }
    }
}
function adjustToCheapest(art) {
    const cheapestLot = JSON.parse(getValue("LastBestLotData_" + art.ArtType + (art.CraftInfo ? "Craft" + art.CraftInfo: ""), "{}"));
    const etalonBattleCost = cheapestLot.OptimalRepairCombatCost;
    let testPrice = cheapestLot.LotPrice;//    console.log(`testPrice: ${testPrice}`);
    if(!testPrice) {
        return 0;
    }
    let i = 0;
    while(true) {
        const artefactLot = new ArtifactLot(art.Uid, art.Id, art.Strength, art.RestStrength, testPrice);
        artefactLot.CalcOptRepair();
        const approximationPercent = Math.round(artefactLot.OptimalRepairCombatCost / etalonBattleCost * 100);
        console.log(`i: ${i}, testPrice: ${testPrice}, CombatCost: ${artefactLot.OptimalRepairCombatCost}, etalonBattleCost: ${etalonBattleCost}, approximationPercent: ${approximationPercent}`);
        if(artefactLot.OptimalRepairCombatCost == etalonBattleCost) {
            return testPrice - 1;
        }
        if(artefactLot.OptimalRepairCombatCost < etalonBattleCost && artefactLot.OptimalRepairCombatCost + 1 > etalonBattleCost) {
            return testPrice;
        }
        testPrice = Math.floor(testPrice * etalonBattleCost / artefactLot.OptimalRepairCombatCost);
        // if(Math.abs(100 - approximationPercent) < 3) {
            // testPrice += Math.sign(etalonBattleCost - artefactLot.OptimalRepairCombatCost);
        // } else {
            // testPrice = Math.floor(testPrice * etalonBattleCost / artefactLot.OptimalRepairCombatCost);
        // }
        i++;
        if(i > 200) {
            break;
        }
    }
    return testPrice;
}
async function transferArts() {
    const receiverName = document.getElementById("TransferReceiverNameInput");
    const receiver = receiverName.value;
    if(!receiver || receiver == "") {
        alert(LocalizedString.FillReceiver);
        return;
    }
    setValue("LastReceiver", receiver);
    insertReceiverName("receiverNames", receiver);
    const selectedArts = document.querySelectorAll("input[name='artSelector']:checked");
    for(const selectedArt of selectedArts) {
        const artUid = parseInt(selectedArt.getAttribute("artUid"));
        const artId = selectedArt.getAttribute("artId");
        const gold = parseInt(getValue("TransferGold" + artUid) || getValue("TransferGold" + artId)) || 0;
        await postRequest("/art_transfer.php", `id=${artUid}&nick=${receiver}&gold=${gold}&sendtype=1&dtime=0&bcount=0&rep_price=0&art_id=&sign=${win.sign}`);
    }
    window.location.reload();
}
async function transferArtsWithRecall() {
    const receiverName = document.getElementById("TransferReceiverNameInput");
    const receiver = receiverName.value;
    if(!receiver || receiver == "") {
        alert(LocalizedString.FillReceiver);
        return;
    }
    setValue("LastReceiver", receiver);
    insertReceiverName("receiverNames", receiver);
    // ***
    const allBattlesNum = document.getElementById("BulkTransferBattlesNumButton").value;
    const allRecallTime = document.getElementById("BulkTransferRecallTimeButton").value;
    const allGold = document.getElementById("BulkTransferGoldButton").value;
    const selectedArts = document.querySelectorAll("input[name='artSelector']:checked");
    for(const selectedArt of selectedArts) {
        const artUid = parseInt(selectedArt.getAttribute("artUid"));
        const artId = selectedArt.getAttribute("artId");

        const gold = allGold || parseInt(getValue("TransferGold" + artUid) || getValue("TransferGold" + artId)) || 0;
        const days = allRecallTime || parseFloat(getValue("TransferDays" + artUid) || getValue("TransferDays" + artId)) || 0;
        const combats = allBattlesNum || parseInt(getValue("TransferCombats" + artUid) || getValue("TransferCombats" + artId)) || 0;
        const allowRepairing = (getValue("TransferAllowRepairing" + artUid, "0") == "0" && getBool("TransferAllowRepairing" + artId) || getValue("TransferAllowRepairing" + artUid, "0") == "2") ? "&rep=on" : "";
        //console.log(`artUid: ${artId}, repairCost: ${repairCost}, repairsPercent: ${repairsPercent}, repairPrice: ${repairPrice}`);
        if(true) {
            //console.log(`id=${artUid}&nick=${receiver}&gold=${gold}&sendtype=2&dtime=${days}&bcount=${combats}${allowRepairing}&rep_price=0&art_id=&sign=${win.sign}`)
            await postRequest("/art_transfer.php", `id=${artUid}&nick=${receiver}&gold=${gold}&sendtype=2&dtime=${days}&bcount=${combats}${allowRepairing}&rep_price=0&art_id=&sign=${win.sign}`);
        }
        // ***
    }
    window.location.reload();
}
async function transferArtsSklad() {
    const selectedArts = document.querySelectorAll("input[name='artSelector']:checked");
    for(const selectedArt of selectedArts) {
        const artUid = parseInt(selectedArt.getAttribute("artUid"));
        const artId = selectedArt.getAttribute("artId");
        const skladId = 32;
        await getRequest(`/sklad_info.php?id=${skladId}&sign=${win.sign}&p_art_id=${artUid}`);
        console.log(`/sklad_info.php?id=${skladId}&sign=${win.sign}&p_art_id=${artUid}`)
    }
    window.location.reload();
}
async function showTradesToMeIndicator() {
    if(getBool("ShowTradesToMe") && isHeartOnPage) {
        await readTradesToMe();
        const trades = getPlayerValue("TradesToMe", "").split("&").filter(x => x != "").map(x => JSON.parse(x));
        toggleHomeIndicator("https://dcdn.heroeswm.ru/i/inv_im/btn_art_put.png", `${isEn ? "Trades for me" : "Передач вам" }: ${trades.length}`, "/inventory.php", trades.length > 0, "TradesToMeSignTitle", "TradesToMeSign");
    }
}
async function showThresholdPricesIndicator() {
    if(getBool("ShowThresholdPricesIndicator") && isHeartOnPage) {
        const thresholdPrices = JSON.parse(getPlayerValue("ThresholdPrices", "[]"));
        const currentArtId = location.pathname == '/auction.php' ? getUrlParamValue(location.href, "art_type") : undefined;
        if(currentArtId && thresholdPrices.find(x => x.ArtId == currentArtId)) {
            deleteValue("ShowThresholdPricesImdicatorLastRequestTime");
        }
        const timeExpired = Date.now() > parseInt(getValue("ShowThresholdPricesImdicatorLastRequestTime", 0)) + 1000 * 60;
        //console.log(`showThresholdPricesIndicator ShowThresholdPricesData: ${getValue("ShowThresholdPricesData")}, timeExpired: ${timeExpired}, isMooving: ${isMooving}`);
        if(timeExpired && !isMooving) {
            setValue("ShowThresholdPricesImdicatorLastRequestTime", Date.now());
            deleteValue("ShowThresholdPricesData");
            for(const thresholdPrice of thresholdPrices) {
                const doc = await getRequest(thresholdPrice.Url);
                const elementMarketInfos = (await extendLotsTable(doc, thresholdPrice.Url, false, true)).Arts;
                const artIdStr = thresholdPrice.ArtId.replace('part_', '');
                const arts = elementMarketInfos[artIdStr];
                if(!arts || arts.length == 0) {
                    continue;
                }
                //console.log(`artId: ${thresholdPrice.ArtId}, url: ${thresholdPrice.Url}, thresholdPrice: ${thresholdPrice.Price}, thresholdBattlePrice: ${thresholdPrice.BattlePrice}`);
                const minLotPrice = arts.reduce((c, e) => Math.min(c, e.LotPrice), arts[0].LotPrice);
                const minLotBattlePrice = arts.reduce((c, e) => Math.min(c, e.OptimalRepairCombatCost), arts[0].OptimalRepairCombatCost);

                const thresholdExists = minLotPrice <= thresholdPrice.Price || minLotBattlePrice <= thresholdPrice.BattlePrice;
                //console.log(`artId: ${thresholdPrice.ArtId}, url: ${thresholdPrice.Url}, thresholdPrice: ${thresholdPrice.Price}, thresholdBattlePrice: ${thresholdPrice.BattlePrice}, minLotPrice: ${minLotPrice}, minLotBattlePrice: ${minLotBattlePrice}`);
                if(thresholdExists) {
                    setValue("ShowThresholdPricesData", thresholdPrice.Url);
                    if(getBool("ShowThresholdPricesNotification")) {
                        const lotId = arts.find(x => x.LotPrice == minLotPrice).LotId;
                        if(!getValue(`NotificatedThresholdPricesLotId${lotId}`)) {
                            setValue(`NotificatedThresholdPricesLotId${lotId}`, Date.now());
                            GM.notification(`${isEn ? "Advantageous lot" : "Выгодный лот" }`, "ГВД", "https://dcdn2.heroeswm.ru/i/forum/130_1.png?v=1", function() { window.focus(); console.log(getValue("ShowThresholdPricesData")); window.location.href = getValue("ShowThresholdPricesData"); });
                        }
                    }
                    break;
                }
            }
        }
        if(getValue("ShowThresholdPricesData")) {
            toggleHomeIndicator("https://dcdn2.heroeswm.ru/i/forum/130_1.png?v=1", `${isEn ? "Advantageous lot" : "Выгодный лот" }`, getValue("ShowThresholdPricesData"), true, "ThresholdPricesTitle", "ThresholdPrices");
        }
        setTimeout(showThresholdPricesIndicator, 1000 * (120 + Math.floor(Math.random() * 12)));
    }
}
async function readTradesToMe(force = false) {
    const lastTradesToMeRequestDate = parseInt(getPlayerValue("LastTradesToMeRequestDate", 0));
    const isOnInventoryPage = location.href.includes("inventory.php");
    //console.log(`TradesToMe: ${getPlayerValue("TradesToMe")}, isOnInventoryPage: ${isOnInventoryPage}, lastTradesToMeRequestDate: ${Date.now() - lastTradesToMeRequestDate}`);
    if(isOnInventoryPage || Date.now() - lastTradesToMeRequestDate > 1000 * 60 * 2 || force) {
        setPlayerValue("LastTradesToMeRequestDate", Date.now());
        const doc = isOnInventoryPage ? document : await getRequest("/inventory.php");
        const allTradesToMeDiv = doc.querySelector("div#all_trades_to_me");
        const trades = [];
        if(allTradesToMeDiv) {
            const tradeDivs = allTradesToMeDiv.querySelectorAll("div.inv_peredachka");
            for(const tradeDiv of tradeDivs) {
                const senderRef = tradeDiv.querySelector("a[href^='pl_info.php']");
                const senderId = getUrlParamValue(senderRef.href, "id");
                const senderName = (senderRef.querySelector("b") || senderRef).innerHTML;

                const artRef = tradeDiv.querySelector("a[href^='art_info.php']");
                const artId = getUrlParamValue(artRef.href, "id");
                const cancelRef = tradeDiv.querySelector("a[href^='trade_cancel.php']");
                const tradeId = getUrlParamValue(cancelRef.href, "tid");
                const forRepairs = tradeDiv.innerHTML.includes(isEn ? "for repairs" : "на ремонт");
                const artName = tradeDiv.querySelector("b").innerHTML;
                const invRequestInfo = tradeDiv.querySelector("div.inv_request_info");
                const invRequestInfo2 = invRequestInfo.children[1];
                const invRequestInfo2bolds = invRequestInfo2.querySelectorAll("b");
                const durability = invRequestInfo2bolds[0].innerHTML;

                const cost = invRequestInfo2bolds[1].innerHTML;
                let percent;
                if(forRepairs) {
                    percent = /\((\d+)%\)/.exec(invRequestInfo2.innerHTML)[1];
                }
                trades.push({ Id: tradeId, SenderId: senderId, SenderName: senderName, ArtId: artId, ArtName: artName, ForRepairs: forRepairs, Cost: cost, Durability: durability, Percent: percent });
                if(isOnInventoryPage) {
                    const [restLotStrength, lotStrength] = durability.split("/");
                    const artifact = new ArtifactLot(undefined, artId, parseInt(lotStrength), parseInt(restLotStrength), parseInt(cost.replace(",", "")));
                    artifact.CalcOptRepair();

                    const artMinBattlePrice = getArtMinBattlePrice(artId);
                    const color = artMinBattlePrice.minBatlePrice < artifact.OptimalRepairCombatCost ? "red" : "green";
                    invRequestInfo2bolds[1].insertAdjacentHTML("afterend", ` <span title="${artMinBattlePrice.hint}" style="color: ${color};">(${artifact.OptimalRepairCombatCost})</span>`)
                }
            }
        }
        setPlayerValue("TradesToMe", trades.map(x => JSON.stringify(x)).join("&")); // {"Id":"53897507","SenderId":"4039417","SenderName":"iNeroon","ArtId":"boots13","ArtName":"Обсидиановые сапоги","ForRepairs":true,"Cost":"7,652","Durability":"0/70","Percent":"90"}
        //console.log(getPlayerValue("TradesToMe"));
    }
}
function toggleHomeIndicator(imageName, message, url, condition, indicatorContainerId, indicatorId) {
    if(condition) {
        const homeRef = document.querySelector("a[href='home.php']");
        const existingIndicator = document.getElementById(indicatorContainerId);
        if(existingIndicator) {
            existingIndicator.title = message;
        } else {
            notificationNumber++;
            //console.log(`notificationNumber: ${notificationNumber}`);
            if(isMobileInterface) {
                const link_home = document.querySelector("div#link_home")
                const a = addElement("a", { id: indicatorId, href: url }, link_home);
                const width = 22;
                const height = 21;
                const top = 13 + height;
                const right = -3 + width * (notificationNumber - 1);
                const div = addElement("div", { id: indicatorContainerId, title: message, style: `line-height: 20.6px; position: absolute; top: ${top}px; right: ${right}px;`, class: "PanelBottomNotification PanelBottomNotification_add" }, a);
                addElement("img", { src: imageName, class: "NotificationIcon" }, div);
            } else if(isNewInterface) {
                const a = addElement("a", { id: indicatorId, href: url }, homeRef.parentNode);
                const width = 24;
                const height = 24;
                const top = -1 + height;
                const right = -3 + width * (notificationNumber - 1);
                const div = addElement("div", { id: indicatorContainerId, title: message, style: `height: ${height}px; width: ${width}px; position: absolute; top: ${top}px; right: ${right}px;` }, a);
                addElement("img", { src: imageName, class: "NotificationIcon" }, div);
            } else {
                const td = getParent(homeRef, "td");
                const newTd = addElement("td", { id: indicatorId }, td.parentNode);
                const a = addElement("a", { href: url }, newTd);
                addElement("img", { id: indicatorContainerId, src: imageName, title: message, style: "width: 12px; height: 12px; border-radius: 50%;" }, a);
            }
        }
    } else {
        const existingIndicator = document.getElementById(indicatorId);
        if(existingIndicator) {
            existingIndicator.remove();
            notificationNumber--;
        }
    }
}
async function repairArts() {
    const receiverName = document.getElementById("TransferReceiverNameInput");
    const receiver = receiverName.value;
    const repairsPercent = parseInt(getValue("LastTransferRepairsPercent", "100"));
    if(!receiver || receiver == "") {
        alert(LocalizedString.FillReceiver);
        return;
    }
    setValue("LastReceiver", receiver);
    insertReceiverName("receiverNames", receiver);
    const selectedArts = Array.from(document.querySelectorAll("input[name='artSelector']:checked")).filter(x => x.hasAttribute("isBroken"));
    for(const selectedArt of selectedArts) {
        const artUid = parseInt(selectedArt.getAttribute("artUid"));
        const artId = selectedArt.getAttribute("artId");
        const repairCost = ArtifactInfo[artId].RepairCost;
        const repairPrice = Math.ceil(repairCost * repairsPercent / 100);
        //console.log(`artId: ${artId}, repairCost: ${repairCost}, repairsPercent: ${repairsPercent}, repairPrice: ${repairPrice}`);
        await postRequest("/art_transfer.php", `id=${artUid}&nick=${receiver}&gold=0&sendtype=5&dtime=0&bcount=0&rep_price=${repairPrice}&art_id=&sign=${win.sign}`);
    }
    window.location.reload();
}
async function cancelTransfers() {
    const all_trades_from_me = document.querySelector("div#all_trades_from_me");
    if(all_trades_from_me) {
        let result = confirm("Press OK to confirm cancel all trades");
        if (result === true) {
            const tradeCancelRefs = all_trades_from_me.querySelectorAll("a[href*='trade_cancel.php']");
            for(const tradeCancelRef of tradeCancelRefs) {
                await getRequest(tradeCancelRef.href);
            }
            window.location.reload();
        }
    }
}
async function acceptFreeTransfers() {
    const all_trades_to_me = document.querySelector("div#all_trades_to_me");
    if(all_trades_to_me) {
        let result = confirm("Press OK to confirm accepting all free trades");
        if (result === true) {
            const trades = all_trades_to_me.querySelectorAll(".inv_peredachka");
            for (const trade of trades) {
                if (trade.innerHTML.includes("Цена:&nbsp;-")) {
                    const ref = trade.querySelector("a[href*='trade_accept.php']");
                    if (ref) {
                        await getRequest(ref.href);
                    }
                }
            }
            window.location.reload();
        }
    }
}
function calcArtTypeAndCategory(selectValue) {
    if(selectValue) {
        if(selectValue.includes("@")) {
            let artId = selectValue.split("@")[0];
            let uid = selectValue.split("@")[1];
            if(ArtifactInfo[artId]) {
                return { ArtType: artId, Category: ArtifactInfo[artId].MarketCategory, Id: artId, Uid: uid };
            }
        } else if(ResourcesTypes[selectValue]) {
            return { Type: ResourcesTypes[selectValue].Type, Category: "res", Id: selectValue };
        } else if(selectValue.match(/EL_\d{2}/)) {
            let elNumber = parseInt(/EL_(\d{2})/.exec(selectValue)[1]);
            return { ArtType: ElementsTypes[elNumber], Category: "elements", Id: selectValue };
        } else if(selectValue.match(/ARTPART_.+/)) {
            let artType = /ARTPART_(.+)/.exec(selectValue)[1];
            return { ArtType: "part_" + artType, Category: "part", Id: selectValue };
        } else if(selectValue.match(/CERT_\d+/)) {
            let artType = /CERT_(\d+)/.exec(selectValue)[1];
            //console.log(artType);
            return { ArtType: getSertIdByLocationNumber(artType), Category: "cert", Id: selectValue };
        }
    }
}
function getElementOptionValueByName(name) { return "EL_" + getKeyByValue(ElementsTypes, name); }
function getSertIdByLocationNumber(locationNumber) { return "sec_" + (locationNumber.toString()).padStart(2, "0"); }
function getSertIdByLocationName(locationName) {
    const locationNumber = Object.keys(locations).find(x => locations[x][2] == locationName);
    return getSertIdByLocationNumber(locationNumber);
}
function getHouseIdByLocationNumber(locationNumber) { return "dom_" + (locationNumber.toString()).padStart(2, "0"); }
function getHouseIdByLocationName(locationName) {
    const locationNumber = Object.keys(locations).find(x => locations[x][2] == locationName);
    return getHouseIdByLocationNumber(locationNumber);
}
function getShaIdByLocationNumber(locationNumber) { return "sha_" + (locationNumber.toString()).padStart(2, "0"); }
function getShaIdByLocationName(locationName) {
    const locationNumber = Object.keys(locations).find(x => locations[x][2] == locationName);
    return getShaIdByLocationNumber(locationNumber);
}
function getAuctionUrl(selectValue) {
    let urlParams = calcArtTypeAndCategory(selectValue);
    if(urlParams) {
        let url = `/auction.php?cat=${urlParams.Category}`;
        if(urlParams.ArtType) {
            url += `&art_type=${urlParams.ArtType}`;
        }
        if(urlParams.Type) {
            url += `&type=${urlParams.Type}`;
        }
        return url;
    }
    return "/auction.php";
}
function showTransferDataPanel(artIndex, panelToggleHandler) {
    const artInfo = win.arts[artIndex];
    if(!artInfo) { console.log(`artIndex: ${artIndex}`); return; }
    const artId = artInfo.art_id;
    const artUid = artInfo.id;
    if(showPupupPanel("TransferData_" + artUid, panelToggleHandler)) {
        return;
    }
    const fieldsMap = [];

    fieldsMap.push([null, addElement("span", { innerText: LocalizedString.ForAll, style: "font-weight: bold;" }), null, addElement("span", { innerText: LocalizedString.ForThis, style: "font-weight: bold;" })]);

    const transferGoldLabel = addElement("label", { for: "transferGoldInput", innerText: LocalizedString.Cost + "\t" });
    const transferGoldInput = addElement("input", { id: "transferGoldInput", type: "number", value: getValue("TransferGold" + artId, ""), onfocus: "this.select();" });
    transferGoldInput.addEventListener("change", function() { setOrDeleteNumberValue("TransferGold" + artId, this.value); }, false);

    const transferGoldUniqueLabel = addElement("label", { for: "transferGoldUniqueInput", innerText: LocalizedString.Cost + "\t" });
    const transferGoldUniqueInput = addElement("input", { id: "transferGoldUniqueInput", type: "number", value: getValue("TransferGold" + artUid, ""), onfocus: "this.select();" });
    transferGoldUniqueInput.addEventListener("change", function() { setOrDeleteNumberValue("TransferGold" + artUid, this.value); }, false);

    fieldsMap.push([transferGoldLabel, transferGoldInput, transferGoldUniqueLabel, transferGoldUniqueInput]);


    const transferDaysLabel = addElement("label", { for: "transferDaysInput", innerText: LocalizedString.Days + "\t" });
    const transferDaysInput = addElement("input", { id: "transferDaysInput", type: "number", value: getValue("TransferDays" + artId, ""), onfocus: "this.select();" });
    transferDaysInput.addEventListener("change", function() { setOrDeleteNumberValue("TransferDays" + artId, this.value); }, false);

    const transferDaysUniqueLabel = addElement("label", { for: "transferDaysUniqueInput", innerText: LocalizedString.Days + "\t" });
    const transferDaysUniqueInput = addElement("input", { id: "transferDaysUniqueInput", type: "number", value: getValue("TransferDays" + artUid, ""), onfocus: "this.select();" });
    transferDaysUniqueInput.addEventListener("change", function() { setOrDeleteNumberValue("TransferDays" + artUid, this.value); }, false);

    fieldsMap.push([transferDaysLabel, transferDaysInput, transferDaysUniqueLabel, transferDaysUniqueInput]);


    const transferCombatsLabel = addElement("label", { for: "transferCombatsInput", innerText: LocalizedString.Combats + "\t" });
    const transferCombatsInput = addElement("input", { id: "transferCombatsInput", type: "number", value: getValue("TransferCombats" + artId, ""), onfocus: "this.select();" });
    transferCombatsInput.addEventListener("change", function() { setOrDeleteNumberValue("TransferCombats" + artId, this.value); recalcTransferGold(artId, transferGoldInput); }, false);

    const transferCombatsUniqueLabel = addElement("label", { for: "transferCombatsUniqueInput", innerText: LocalizedString.Combats + "\t" });
    const transferCombatsUniqueInput = addElement("input", { id: "transferCombatsUniqueInput", type: "number", value: getValue("TransferCombats" + artUid, ""), onfocus: "this.select();" });
    transferCombatsUniqueInput.addEventListener("change", function() { setOrDeleteNumberValue("TransferCombats" + artUid, this.value); recalcTransferGold(artUid, transferGoldUniqueInput); }, false);

    fieldsMap.push([transferCombatsLabel, transferCombatsInput, transferCombatsUniqueLabel, transferCombatsUniqueInput]);


    const allowRepairingLabel = addElement("label", { for: "allowRepairingInput", innerText: LocalizedString.AllowRepairing + "\t" });
    const allowRepairingInput = addElement("input", { id: "allowRepairingInput", type: "checkbox" });
    allowRepairingInput.checked = getBool("TransferAllowRepairing" + artId);
    allowRepairingInput.addEventListener("change", function() { setValue("TransferAllowRepairing" + artId, this.checked); }, false);

    const allowRepairingUniqueLabel = addElement("label", { for: "allowRepairingUniqueInput", innerText: LocalizedString.AllowRepairing + "\t" });
    const allowRepairingUniqueInput = addElement("select", { id: "allowRepairingUniqueInput", innerHTML: `<option value="0">${LocalizedString.AsForAll}</option><option value="1">${LocalizedString.Forbid}</option><option value="2">${LocalizedString.Allow}</option>` });
    allowRepairingUniqueInput.value = getValue("TransferAllowRepairing" + artUid, "0");
    allowRepairingUniqueInput.addEventListener("change", function() { setValue("TransferAllowRepairing" + artUid, this.value); }, false);

    fieldsMap.push([allowRepairingLabel, allowRepairingInput, allowRepairingUniqueLabel, allowRepairingUniqueInput]);


    const battlePriceLabel = addElement("label", { for: "battlePriceInput", innerText: `${isEn ? "Battle price" : "Цена за бой"}\t` });
    const battlePriceInput = addElement("input", { id: "battlePriceInput", type: "number", value: getValue(`TransferBattlePrice${artId}`, ""), onfocus: "this.select();" });
    battlePriceInput.addEventListener("change", function() { setOrDeleteNumberValue(`TransferBattlePrice${artId}`, this.value); recalcTransferGold(artId, transferGoldInput); }, false);

    const battlePriceUniqueLabel = addElement("label", { for: "battlePriceUniqueInput", innerText: `${isEn ? "Battle price" : "Цена за бой"}\t` });
    const battlePriceUniqueInput = addElement("input", { id: "battlePriceUniqueInput", type: "number", value: getValue("TransferBattlePrice" + artUid, ""), onfocus: "this.select();" });
    battlePriceUniqueInput.addEventListener("change", function() { setOrDeleteNumberValue("TransferBattlePrice" + artUid, this.value); recalcTransferGold(artUid, transferGoldUniqueInput); }, false);

    fieldsMap.push([battlePriceLabel, battlePriceInput, battlePriceUniqueLabel, battlePriceUniqueInput]);

    const customArtInfoLabel = addElement("label", { for: "CustomArtInfoInput", innerText: `${isEn ? "Info" : "Инфо"}\t` });
    const customArtInfoInput = addElement("input", { id: "CustomArtInfoInput", type: "text", value: getValue("CustomArtInfo" + artUid, ""), onfocus: "this.select();" });
    customArtInfoInput.addEventListener("change", function() { setValue("CustomArtInfo" + artUid, this.value); }, false);

    fieldsMap.push([null, null, customArtInfoLabel, customArtInfoInput]);

    createPupupPanel("TransferData_" + artUid, `${LocalizedString.TransferData} ${artInfo.name}`, fieldsMap, panelToggleHandler);
}
function recalcTransferGold(artId, transferGoldInput) {
    const transferBattlePrice = parseInt(getValue(`TransferBattlePrice${artId}`, 0));
    const transferCombats = parseInt(getValue(`TransferCombats${artId}`, 0));
    if(transferBattlePrice > 0 && transferCombats > 0) {
        transferGoldInput.value = transferBattlePrice * transferCombats;
        setValue("TransferGold" + artId, transferBattlePrice * transferCombats);
    }
}
function insertReceiverName(dataListId, receiverName) {
    const valuesData = getValue("DataList" + dataListId);
    let values = [];
    if(valuesData) {
        values = valuesData.split(",");
    }
    if(!values.includes(receiverName)) {
        values.unshift(receiverName);
        setValue("DataList" + dataListId, values.join());
    }
}
async function getDailyElementsPrices(e) {
    if(e) {
        e.target.disabled = true;
        e.target.classList.toggle("waiting");
    }
    const doc = await getRequest("https://daily.heroeswm.ru/market/elements");
    const elementsTable = doc.getElementById("report_1");
    const takeRow = 2;
    const elementsPrices = { Date: parseDate(elementsTable.rows[1].cells[0].innerText) };
    for(let i = 0; i < elementsTable.rows[takeRow].cells.length - 1; i++) {
        elementsPrices[ElementNames[i]] = elementsTable.rows[takeRow].cells[i + 1].innerText;
    }
    //console.log(elementsPrices);
    setValue("ElementPrices", JSON.stringify(elementsPrices));
    if(e) {
        e.target.disabled = false;
        e.target.classList.toggle("waiting");
    }
    return elementsPrices;
}
async function getMarketElementPrices(e) {
    if(e?.target) {
        e.target.disabled = true;
        e.target.classList.toggle("waiting");
    }
    const elementsPrices = {};
    for(const elementName of ElementNames) {
        const url = `/auction.php?cat=elements&sort=0&art_type=${elementName}`;
        //console.log(url);
        const doc = await getRequest(url);
        const elementMarketInfos = await extendLotsTable(doc, url, true).Arts;
        elementsPrices[elementName] = 0;
        const elementMarketInfo = elementMarketInfos[elementName];
        if(elementMarketInfo) {
            elementMarketInfo.sort((a, b) => parseFloat(a.LotPrice) - parseFloat(b.LotPrice));
            //console.log(elementMarketInfo);
            let totalAmount = 0;
            let totalSum = 0;
            for(const lot of elementMarketInfo) {
                if(totalAmount < craftElementsAmount) {
                    const addAmount = Math.min(lot.LotAmount, craftElementsAmount - totalAmount);
                    totalSum += addAmount * lot.LotPrice;
                    totalAmount += addAmount;
                } else {
                    break;
                }
            }
            if(totalAmount > 0) {
                elementsPrices[elementName] = Math.round(totalSum / totalAmount);
            }
            //console.log(`elementName: ${elementName}, totalAmount: ${totalAmount}, totalSum: ${totalSum}`);
        }
    }
    //console.log(elementsPrices);
    setValue("ElementPrices", JSON.stringify(elementsPrices));
    if(e?.target) {
        e.target.disabled = false;
        e.target.classList.toggle("waiting");
    }
    return elementsPrices;
}
function getPlayerLocationNumber() {
    if(location.pathname == '/map.php' && location.search == '') {
        // Если мы на карте без параметров, т.е. на локации, где сами находимся. Если мы не в пути, тогда видим предприятия. Мы можем обновить текущее положение игрока.
        const minesRef = document.querySelector("a[href*='map.php?cx='][href*='&cy='][href*='&st=mn']"); // Берем из ссылки на заголовке шахт данной локации
        if(minesRef) {
            const locationNumber = getLocationNumberFromMapUrlByXy(minesRef.href);
            if(locationNumber) {
                setValue("PlayerLocationNumber", locationNumber);
                return locationNumber;
            }
        }
    }
    return parseInt(getValue("PlayerLocationNumber")); // Иначе, возьмем из кеша. Там будет пусто только при первом запуске скрипта, когда мы не просматриваем карту.
}
function getLocationNumberFromMapUrlByXy(href) {
    const x = getUrlParamValue(href, "cx");
    const y = getUrlParamValue(href, "cy");
    for(let locationNumber in locations) {
        if(x == locations[locationNumber][0] && y == locations[locationNumber][1]) {
            return locationNumber;
        }
    }
}
function getCraftCost(craftInfo, craftType, isLogCalculation = false) {
    const elementsPrices = JSON.parse(getValue("ElementPrices", "{}"));
    const elementsAmount = {};
    let modsAmount = 0;
    // I12E12A12W12F12
    if(craftType == CraftType.Weapon) {
        if(craftInfo.includes("I")) {
            const ignoreCraftLevel = parseInt(/I(\d+)/.exec(craftInfo)[1]);
            elementsAmount["abrasive"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["moon_stone"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("E")) {
            const ignoreCraftLevel = parseInt(/E(\d+)/.exec(craftInfo)[1]);
            elementsAmount["meteorit"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["badgrib"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("A")) {
            const ignoreCraftLevel = parseInt(/A(\d+)/.exec(craftInfo)[1]);
            elementsAmount["wind_flower"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["witch_flower"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("W")) {
            const ignoreCraftLevel = parseInt(/W(\d+)/.exec(craftInfo)[1]);
            elementsAmount["ice_crystal"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["snake_poison"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("F")) {
            const ignoreCraftLevel = parseInt(/F(\d+)/.exec(craftInfo)[1]);
            elementsAmount["fire_crystal"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["tiger_tusk"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
    }
    if(craftType == CraftType.Armor) {
        if(craftInfo.includes("D")) {
            const ignoreCraftLevel = parseInt(/D(\d+)/.exec(craftInfo)[1]);
            elementsAmount["abrasive"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["moon_stone"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("E")) {
            const ignoreCraftLevel = parseInt(/E(\d+)/.exec(craftInfo)[1]);
            elementsAmount["meteorit"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("A")) {
            const ignoreCraftLevel = parseInt(/A(\d+)/.exec(craftInfo)[1]);
            elementsAmount["wind_flower"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("W")) {
            const ignoreCraftLevel = parseInt(/W(\d+)/.exec(craftInfo)[1]);
            elementsAmount["ice_crystal"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("F")) {
            const ignoreCraftLevel = parseInt(/F(\d+)/.exec(craftInfo)[1]);
            elementsAmount["fire_crystal"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
    }
    if(craftType == CraftType.Jewelry) {
        if(craftInfo.includes("N")) {
            const ignoreCraftLevel = parseInt(/N(\d+)/.exec(craftInfo)[1]);
            elementsAmount["wind_flower"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["tiger_tusk"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("E")) {
            const ignoreCraftLevel = parseInt(/E(\d+)/.exec(craftInfo)[1]);
            elementsAmount["meteorit"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["tiger_tusk"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("A")) {
            const ignoreCraftLevel = parseInt(/A(\d+)/.exec(craftInfo)[1]);
            elementsAmount["wind_flower"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["meteorit"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("W")) {
            const ignoreCraftLevel = parseInt(/W(\d+)/.exec(craftInfo)[1]);
            elementsAmount["ice_crystal"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["witch_flower"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
        if(craftInfo.includes("F")) {
            const ignoreCraftLevel = parseInt(/F(\d+)/.exec(craftInfo)[1]);
            elementsAmount["fire_crystal"] = CraftLevels[ignoreCraftLevel];
            elementsAmount["abrasive"] = CraftLevels[ignoreCraftLevel];
            modsAmount++;
        }
    }
    elementsAmount["fern_flower"] = fernFlowersCount(modsAmount);
    const craftCost = Object.keys(elementsAmount).reduce((total, key) => total + elementsAmount[key] * elementsPrices[key], 0);
    const craftUnderCost = Object.keys(elementsAmount).reduce((total, key) => total + ((elementsAmount[key] < 45 && key != "fern_flower" ? -1 : 0) + elementsAmount[key]) * elementsPrices[key], 0);
    if(isLogCalculation) {
        const craftCostFormula = Object.keys(elementsAmount).map(key => `${key}: ${elementsAmount[key]}*${elementsPrices[key]} = ${elementsAmount[key] * elementsPrices[key]}`).join(" + ");
        console.log(`${craftInfo}, ${Object.keys(CraftType).find(key => CraftType[key] === craftType)}, ${craftCostFormula}=${craftCost}`);
    }
    return [craftCost, craftUnderCost];
}
function fernFlowersCount(modsAmount) {
    let result = 0;
    if(modsAmount >= 1) {
        result += 2;
    }
    if(modsAmount >= 2) {
        result += 4;
    }
    if(modsAmount >= 3) {
        result += 6;
    }
    if(modsAmount >= 4) {
        result += 8;
    }
    if(modsAmount >= 5) {
        result += 10;
    }
    return result;
}
function sendArtsTo() {
    if(location.pathname == "/transfer.php") {
        const nickInput = document.querySelector("input[name=nick]");
        nickInput.addEventListener("focus", function() { this.select(); });
        nickInput.addEventListener("change", function() { if(getPlayerBool("repeatTranferNick")) { setValue("LastTransferResourcesReceiver", this.value); } });
        nickInput.value = getValue("LastTransferResourcesReceiver", "");
        if(!getPlayerBool("repeatTranferNick")) {
            deleteValue("LastTransferResourcesReceiver");
        }
        const repeatTranferNickCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Store last value" : "Запоминать последнее значение" });
        repeatTranferNickCheckbox.checked = getPlayerBool("repeatTranferNick");
        repeatTranferNickCheckbox.addEventListener("change", function() { setPlayerValue("repeatTranferNick", this.checked); });
        nickInput.insertAdjacentElement("afterend", repeatTranferNickCheckbox);
    }
    if(location.pathname == "/el_transfer.php") {
        const nickInput = document.querySelector("input[name=nick]");
        nickInput.addEventListener("focus", function() { this.select(); });
        nickInput.addEventListener("change", function() { if(getPlayerBool("repeatTranferElementsNick")) { setValue("LastTransferElementsReceiver", this.value); } });
        nickInput.value = getValue("LastTransferElementsReceiver", "");
        if(!getPlayerBool("repeatTranferElementsNick")) {
            deleteValue("LastTransferElementsReceiver");
        }
        const repeatTranferNickCheckbox = addElement("input", { type: "checkbox", title: isEn ? "Store last value" : "Запоминать последнее значение" });
        repeatTranferNickCheckbox.checked = getPlayerBool("repeatTranferElementsNick");
        repeatTranferNickCheckbox.addEventListener("change", function() { setPlayerValue("repeatTranferElementsNick", this.checked); });
        nickInput.insertAdjacentElement("afterend", repeatTranferNickCheckbox);
    }
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") != PlayerId) {
        const playerName = document.querySelector("h1").innerText;
        const mailRef = document.querySelector("a[href^='sms-create.php']");

        const sendArtsRef = addElement("a", { href: "/inventory.php", style: "text-decoration: none;", innerText: isEn ? "arts" : "арты" });
        sendArtsRef.addEventListener("click", function() { setValue("LastReceiver", playerName); });
        mailRef.insertAdjacentElement("afterend", sendArtsRef);
        sendArtsRef.insertAdjacentHTML("beforebegin", " / ");

        const sendElementsRef = addElement("a", { href: "/el_transfer.php", style: "text-decoration: none;", innerText: isEn ? "elements" : "элементы" });
        sendElementsRef.addEventListener("click", function() { setValue("LastTransferElementsReceiver", playerName); });
        mailRef.insertAdjacentElement("afterend", sendElementsRef);
        sendElementsRef.insertAdjacentHTML("beforebegin", " / ");

        const sendResourcesRef = addElement("a", { href: "/transfer.php", style: "text-decoration: none;", innerText: isEn ? "Transfer resources" : "Передать ресурсы" });
        sendResourcesRef.addEventListener("click", function() { setValue("LastTransferResourcesReceiver", playerName); });
        mailRef.insertAdjacentElement("afterend", sendResourcesRef);
        sendResourcesRef.insertAdjacentHTML("beforebegin", " / ");
    }
}
function kitsDataBind(afterPriceSettingOpen = false) {
    //console.log(`afterPriceSettingOpen: ${afterPriceSettingOpen}`)
    if(afterPriceSettingOpen) {
        return;
    }
    if(location.pathname == "/inventory.php" && getPlayerBool("ShowKits")) {
        let kitsHtml = "<div>";
        const kitsManager = new KitsManager();
        let kitIndex = 0;
        for(const kit of kitsManager.Kits) {
            kitsHtml += `<div class='inventory_block' style='font-size: 9pt;'><div id='kitContainer${kitIndex}' style='display: flex; flex-direction: row; flex-wrap: wrap; width: 65%;'>`;
            let kitItemIndex = 0;
            for(const kitItem of kit.Items) {
                const artUid = parseInt(kitItem);
                //console.log(artUid)
                const artIndex = Array.from(win.arts).findIndex(x => x.id == artUid);
                let art;
                let artHtml = "";
                if(artIndex >= 0) {
                    art = win.arts[artIndex];
                    artHtml = art.html;
                } else {
                    artHtml = `<div style="height: 100%; width: 100%; background-image: url('https://dcdn1.heroeswm.ru/i/art_fon_100x100.png');"><span style="font-size: 9px;">${isEn ? "Absent" : "Отсутствует"}</span></div>`;
                }
                kitsHtml += `
<div class="inventory_item_div inventory_item2">
    ${artHtml}
    <div id="transferData${kitIndex}Item${kitItemIndex}" artIndex="${artIndex}" title="${isEn ? "Battle price" : "Цена за бой"}" style="position: absolute; top: 40px; left: 1px; z-index: 3; background-color: rgba(255,255,255,.5);">
        ${parseInt(getValue("TransferBattlePrice" + art?.id) || getValue("TransferBattlePrice" + art?.art_id)) || 0}
    </div>
    <div id="delete${kitIndex}Item${kitItemIndex}" kitIndex="${kitIndex}" kitItemIndex="${kitItemIndex}" title="${isEn ? "Delete" : "Удалить"}" style="position: absolute; top: 0px; left: 38px; z-index: 3;">
        [x]
    </div>
</div>`;

                // kitsHtml += `
// <div class="inv_art_outside shop_art_outside">
    // <div class="arts_info shop_art_info" style="height: 100%; width: 100%;" onmouseover="hwm_mobile_show_arts_durability(true, true);" onmouseout="hwm_mobile_hide_arts_durability()">
        // <div class="art_durability_hidden" style="opacity: 0; display: none;">38/67</div>
        // <img src="https://dcdn1.heroeswm.ru/i/art_fon_100x100.png" border="0" width="100%" height="100%" '="" alt="" class="cre_mon_image1">
        // <img src="https://dcdn3.heroeswm.ru/i/artifacts/super_dagger.png" border="0" width="100%" height="100%" hint="Кинжал пламени <br />Нападение: &nbsp;+1 <br />Инициатива: &nbsp;+1% <br />Прочность: 38/67<br>На рынке цена за бой: 427.66" alt="" class="cre_mon_image2 show_hint" hwm_hint_added="1">
    // </div>
// </div>
// `;
                kitItemIndex++;
            }
            kitsHtml += `</div>
<div class="inv_note_kukla" style="width: 32%; margin-left: auto; margin-right: 0; padding: 4px 4px 4px 4px;">
        <input id="dressKit${kitIndex}" kitIndex="${kitIndex}" type="button" value="${isEn ? "Dress" : "Надеть"}" class="inv_text_kukla_btn inv_text_kukla_btn_hover">
        <input id="transferKit${kitIndex}" kitIndex="${kitIndex}" type="button" value="${isEn ? "Transfer" : "Передать"}" class="inv_text_kukla_btn inv_text_kukla_btn_hover">
        <br>
        <input id="appendKit${kitIndex}" kitIndex="${kitIndex}" type="button" value="${isEn ? "Append" : "Пополнить"}" class="inv_text_kukla_btn inv_text_kukla_btn_hover">
        <input id="deleteKit${kitIndex}" kitIndex="${kitIndex}" type="button" value="${isEn ? "Delete" : "Удалить"}" class="inv_text_kukla_btn inv_text_kukla_btn_hover">
        <br>
        <label for="daysNumber${kitIndex}">${isEn ? "Days" : "Дней"}</label><input id="daysNumber${kitIndex}" kitIndex="${kitIndex}" type="number" value="${kit.DaysNumber}" style="width: 60px;" onfocus="this.select();">
        <label for="combatsNumber${kitIndex}">${isEn ? "Combats" : "Боев"}</label><input id="combatsNumber${kitIndex}" kitIndex="${kitIndex}" type="number" value="${kit.CombatsNumber}" style="width: 60px;" onfocus="this.select();">
        <br>
        <label for="totalCost${kitIndex}">${isEn ? "Cost" : "Стоимость"}</label><input id="totalCost${kitIndex}" kitIndex="${kitIndex}" type="number" value="${kit.Cost()}" readonly style="width: 60px;">
        <label for="kitOrder${kitIndex}">${isEn ? "#" : "№"}</label><input id="kitOrder${kitIndex}" kitIndex="${kitIndex}" type="number" value="${kitIndex}" style="width: 50px;" onfocus="this.select();">
</div></div>`;
            kitIndex++;
        }
        kitsHtml += "</div>";
        //console.log(kitsHtml)
        const rightContainer = document.querySelector("div.container_block_right");
        rightContainer.style.flexWrap = "wrap";
        rightContainer.querySelector("div.container_block").style.minHeight = "auto";

        let kitsContainer = rightContainer.querySelector("div#kitsContainer");
        if(!kitsContainer) {
            addElement("div", { style: "flex-basis: 100%; height: 0;" }, rightContainer);
            kitsContainer = addElement("div", { id: "kitsContainer", class: "container_block" }, rightContainer);
        }
        kitsContainer.innerHTML = kitsHtml;
        kitsManager.Kits.forEach((x, kitIndex) => {
            kitsContainer.querySelector(`#dressKit${kitIndex}`).addEventListener("click", async function(e) { new KitsManager().DressKit(parseInt(e.target.getAttribute("kitIndex"))); });
            kitsContainer.querySelector(`#transferKit${kitIndex}`).addEventListener("click", function(e) { new KitsManager().TransferKit(parseInt(e.target.getAttribute("kitIndex"))); });
            kitsContainer.querySelector(`#appendKit${kitIndex}`).addEventListener("click", function(e) { new KitsManager().AppendKit(parseInt(e.target.getAttribute("kitIndex"))); });
            kitsContainer.querySelector(`#deleteKit${kitIndex}`).addEventListener("click", function(e) { new KitsManager().Delete(parseInt(e.target.getAttribute("kitIndex"))); });
            kitsContainer.querySelector(`#daysNumber${kitIndex}`).addEventListener("change", function(e) { new KitsManager().SetDaysNumber(parseInt(e.target.getAttribute("kitIndex")), parseFloat(this.value)); });
            kitsContainer.querySelector(`#combatsNumber${kitIndex}`).addEventListener("change", function(e) { new KitsManager().SetCombatsNumber(parseInt(e.target.getAttribute("kitIndex")), parseInt(this.value)); });
            kitsContainer.querySelector(`#kitOrder${kitIndex}`).addEventListener("change", function(e) { new KitsManager().Swap(parseInt(e.target.getAttribute("kitIndex")), parseInt(this.value)); });
            x.Items.forEach((y, kitItemIndex) => {
                kitsContainer.querySelector(`div#kitContainer${kitIndex} div#transferData${kitIndex}Item${kitItemIndex}`).addEventListener("click", function(e) { showTransferDataPanel(parseInt(this.getAttribute("artIndex")), kitsDataBind); });
                kitsContainer.querySelector(`div#kitContainer${kitIndex} div#delete${kitIndex}Item${kitItemIndex}`).addEventListener("click", function(e) { new KitsManager().DeleteKitItem(parseInt(this.getAttribute("kitIndex")), parseInt(this.getAttribute("kitItemIndex"))); });
            });
        });
    }
}
async function tryDress(artId) {
    const art = Array.from(win.arts).find(y => y.id == artId);
    if(!art) {
        return;
    }
    var k = art['pos_dress'];
    if(k == 8) {
        if(win.slots[8]) {
            if(!win.slots[9]) {
                k = 9;
            } else {
                if(win.last_ring_dress == 8) k = 9;
            }
        }
    }
    if(!art["dressed"] && (k > 0 || art['action'] == 'open')) {
        let responseText = await getRequestText(`/inventory.php?dress=${art.id}&js=1&last_ring_dress=${win.last_ring_dress}&rand=${Math.random() * 1000000}`);
        if(responseText == "fail") {
            responseText = await getRequestText(`/inventory.php?dress=${art.id}&js=1&last_ring_dress=${win.last_ring_dress}&rand=${Math.random() * 1000000}`);
        }
        dressHandle(responseText);
        if(k == 8 || k == 9) {
            win.last_ring_dress = k;
        }
        win.last_dress = k;
    }
}
function dressHandle(txt) {
    if (txt == 'fail' || txt.length > 5000) {
        console.log(txt)
        //console.log(win.add_url)
        //window.location = 'inventory.php?1' + win.add_url;
        return 0;
    } else if (txt) {
        var data = txt.split('|');
        if (data && data[0]) {
            if (data[0] == 'gift_box_opened_refresh' && data[1]) {
                window.location = 'inventory.php?gift_box_opened=' + data[1] + win.add_url;
                return 0;
            }
            if (data.length > 20) {
                window.location = 'inventory.php?1' + win.add_url;
                return 0;
            }
            win.refresh_pl_params(data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11]);
            for (var i = 0; i < win.arts_c; i++)
                if (win.arts[i]["id"] == data[1]) {
                    document.getElementById('slot' + data[0]).innerHTML = win.arts[i]['html'];
                    document.getElementById('slot' + data[0]).onclick = win.try_undress;
                    document.getElementById('slot' + data[0]).setAttribute('art_id', win.arts[i]["id"]);
                    win.arts[i]['dressed'] = data[0];
                    if (win.slots[data[0]] > 0) win.inv_remove_dress_attr_from_array_by_id(win.slots[data[0]]);
                    win.slots[data[0]] = win.arts[i]['id'];
                    break;
                }
        }
        win.show_arts_in_category();
        win.hide_hwm_hint(this, true);
    }
}
function KitsManager() {
    //console.log(getPlayerValue("Kits"))
    this.Kits = JSON.parse(getPlayerValue("Kits", "[]")).map(x => new Kit(x));
    this.Create = function() {
        const selectedArts = Array.from(document.querySelectorAll("input[name='artSelector']:checked")).map(x => parseInt(x.getAttribute("artUid")));
        if(selectedArts.length > 0) {
            const kit = new Kit(null, selectedArts);
            this.Kits.unshift(kit);
            this.SaveAndDataBind();
        }
    };
    this.AppendKit = function(kitIndex) {
        const kit = this.Kits[kitIndex];
        const selectedArts = Array.from(document.querySelectorAll("input[name='artSelector']:checked")).map(x => parseInt(x.getAttribute("artUid")));
        selectedArts.filter(x => !kit.Items.includes(x)).forEach(x => { kit.Items.push(x); });
        this.SaveAndDataBind();
    };
    this.Delete = function(kitIndex) { this.Kits.splice(kitIndex, 1); this.SaveAndDataBind(); };
    this.DeleteKitItem = function(kitIndex, kitItemIndex) {
        this.Kits[kitIndex].Items.splice(kitItemIndex, 1);
        if(this.Kits[kitIndex].Items.length == 0) {
            this.Kits.splice(kitIndex, 1);
        }
        this.SaveAndDataBind();
    };
    this.Save = function() { setPlayerValue("Kits", JSON.stringify(this.Kits.map(x => x.Collect()))); };
    this.SaveAndDataBind = function() { this.Save(); kitsDataBind(); };
    this.TransferKit = async function(kitIndex) {
        const receiverName = document.getElementById("TransferReceiverNameInput");
        const receiver = receiverName.value;
        if(!receiver || receiver == "") {
            alert(LocalizedString.FillReceiver);
            return;
        }
        setValue("LastReceiver", receiver);
        insertReceiverName("receiverNames", receiver);
        const kit = this.Kits[kitIndex];
        for(const artUid of kit.Items) {
            const art = Array.from(win.arts).find(y => y.id == artUid);
            if(!art) {
                continue;
            }
            const artId = art.art_id;
            const gold = (parseInt(getValue("TransferBattlePrice" + artUid) || getValue("TransferBattlePrice" + artId)) || 0) * kit.CombatsNumber;
            const allowRepairing = (getValue("TransferAllowRepairing" + artUid, "0") == "0" && getBool("TransferAllowRepairing" + artId) || getValue("TransferAllowRepairing" + artUid, "0") == "2") ? "&rep=on" : "";
            //console.log(`gold: ${gold}, daysNumber: ${kit.DaysNumber}, combatsNumber: ${kit.CombatsNumber}`)
            if(gold > 0 && kit.DaysNumber > 0 && kit.CombatsNumber > 0) {
                //console.log(`id=${artUid}&nick=${receiver}&gold=${gold}&sendtype=2&dtime=${kit.DaysNumber}&bcount=${kit.CombatsNumber}${allowRepairing}&rep_price=0&art_id=&sign=${win.sign}`)
                await postRequest("/art_transfer.php", `id=${artUid}&nick=${receiver}&gold=${gold}&sendtype=2&dtime=${kit.DaysNumber}&bcount=${kit.CombatsNumber}${allowRepairing}&rep_price=0&art_id=&sign=${win.sign}`);
            }
        }
        window.location.reload();
    };
    this.DressKit = function(kitIndex) { this.Kits[kitIndex].Items.forEach(async x => { await tryDress(x); }); };
    this.Swap = function(kitIndex, kitNewIndex = 0) {
        kitNewIndex = Math.min(Math.max(kitNewIndex, 0), this.Kits.length - 1);
        if(kitNewIndex != kitIndex) {
            [this.Kits[kitIndex], this.Kits[kitNewIndex]] = [this.Kits[kitNewIndex], this.Kits[kitIndex]];
            this.SaveAndDataBind();
        }
    };
    this.SetCombatsNumber = function(kitIndex, combatsNumber) {
        const kit = this.Kits[kitIndex];
        kit.CombatsNumber = combatsNumber;
        this.Save();
        document.querySelector(`#totalCost${kitIndex}`).value = kit.Cost();
    };
    this.SetDaysNumber = function(kitIndex, daysNumber) { this.Kits[kitIndex].DaysNumber = daysNumber; this.Save(); };
}
function Kit(kitData, items) {
    [this.DaysNumber, this.CombatsNumber] = kitData ? kitData.slice(-2) : [0, 0];
    this.Items = kitData ? kitData.slice(0, -2) : items;
    this.Collect = function() { return [...this.Items, this.DaysNumber, this.CombatsNumber]; };
    this.Cost = function() {
        return this.Items.reduce((t, x) => {
            const artUid = x;
            const art = Array.from(win.arts).find(y => y.id == artUid);
            if(!art) {
                return t;
            }
            const result = parseInt(getValue("TransferBattlePrice" + artUid) || getValue("TransferBattlePrice" + art.art_id)) || 0;
            return t + result * this.CombatsNumber;
        }, 0);
    }
}
function countSelectedCraftCost() {
    const elprice = document.querySelector("div#elprice");
    if(elprice) {
        let cost = 0;
        const elementsPrices = JSON.parse(getValue("ElementPrices", "{}"));
        const re = /\/([a-z_]+).png/;
        Array.from(elprice.querySelectorAll("img")).forEach(x => {
            //console.log(x.nextSibling);
            let amount = 0;
            if(x.nextSibling.nodeName == '#text' && parseInt(x.nextSibling.textContent)) {
                amount = parseInt(x.nextSibling.textContent);
            } else if(parseInt(x.nextElementSibling.innerText)) {
                amount = parseInt(x.nextElementSibling.innerText);
            }
            const elementName =  x.src.match(re)[1];
            if(elementName in elementsPrices) {
                cost += elementsPrices[elementName] * amount; //console.log(`elementName: ${elementName}, amount: ${amount}, cost: ${cost}`);
            }
            if(elementName == "gold") {
                cost += amount;
            }
        });
        const totalCraftCostDiv = document.querySelector("div#totalCraftCostDiv") || addElement("div", { id: "totalCraftCostDiv", style: "display: inline;", title: isEn ? "Cost" : "Стоимость" }, elprice.querySelector("center") || elprice);
        totalCraftCostDiv.innerHTML = `<img src="i/r/32/gold.png" style="height: 12px; vertical-align: middle;"> ${cost.toLocaleString()}`;
    }
}
function timeToMinutesFormat(time) {
    if(!time || time < 0) {
        return "00:00";
    }
    const secondsLeft = Math.round(time / 1000);
    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft - days * 86400) / 3600);
    const minutes = Math.round((secondsLeft - days * 86400 - hours * 3600) / 60);
    //console.log(`timeFormat: ${timeFormat}, days: ${days}, hours: ${hours}`)
    return `${days === 0 ? '' : (days.toString().padStart(2, "0") + ':')}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
function timeToDateMinutesFormat(time) {
    const date = new Date(Math.ceil(time / 60000) * 60000);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}
function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
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
        setPlayerValue("UserName", document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText);
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
        for(const target of targets) {
            if(target) {
                observer.observe(target, config);
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

//console.log(Object.values(ArtifactInfo).reduce((c, e,) => Math.max(c, e.RepairCost), 0)); // Самый дорогой ремонт 64000 - 16 часов
// for(let artId of Object.keys(ArtifactInfo)) {
    // let found = artefacts.find(x => x.id == artId);
    // if(found) {
        // ArtifactInfo[artId].AmmunitionPoints = found.ap;
    // } else {
        // ArtifactInfo[artId].AmmunitionPoints = 0;
    // }
// }
//showBigData(Object.keys(ArtifactInfo).filter(x => ArtifactInfo[x].AmmunitionPoints > 0).reduce((t, a) => t + `, "${a}": { Strength: ${ArtifactInfo[a].Strength}, RepairCost: ${ArtifactInfo[a].RepairCost}, MarketCategory: "${ArtifactInfo[a].MarketCategory}", CraftType: ${ArtifactInfo[a].CraftType}, AmmunitionPoints: ${ArtifactInfo[a].AmmunitionPoints} }`, ""));
// showBigData(Object.keys(ArtifactInfo).filter(x => ArtifactInfo[x].AmmunitionPoints == 0).reduce((t, a) => t + `,
// "${a}": { Strength: ${ArtifactInfo[a].Strength}, RepairCost: ${ArtifactInfo[a].RepairCost}, MarketCategory: "${ArtifactInfo[a].MarketCategory}", CraftType: ${ArtifactInfo[a].CraftType}, AmmunitionPoints: ${ArtifactInfo[a].AmmunitionPoints} }`, ""));
//console.log(Object.values(ArtifactInfo).filter(x => x.MarketCategory == "").length);
//console.log(`Script ${GM_info.script.name} work time ${millisecondsIntervalToString(Date.now() - stopwatchStartTime)}`);
