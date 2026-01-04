// ==UserScript==
// @name           hwmHuntHelper
// @namespace      Tamozhnya1
// @description    Поиск охот. Подробная информация об охоте. Фильтрация охот в групповых боях. История боёв ГО, ГН. Светофоры в рекордах персонажа. Информация о вражеской армии на страницах ГЛ и ивентов.
// @author         Mantens, ElMarado, CheckT, Pagan of Dark, Tamozhnya1
// @version        19.2
// @include        https://*.heroeswm.ru/group_wars.php*
// @include        https://*.lordswm.com/group_wars.php*
// @include        https://*.heroeswm.ru/leader_army.php*
// @include        https://*.lordswm.com/leader_army.php*
// @include        https://*.heroeswm.ru/plstats_hunters.php*
// @include        https://*.lordswm.com/plstats_hunters.php*
// @include        https://*.heroeswm.ru/home.php*
// @include        https://*.lordswm.com/home.php*
// @include        https://*.heroeswm.ru/map.php*
// @include        https://*.lordswm.com/map.php*
// @include        https://*.heroeswm.ru/mercenary_guild.php*
// @include        https://*.lordswm.com/mercenary_guild.php*
// @include        https://*.heroeswm.ru/leader_guild.php*
// @include        https://*.lordswm.com/leader_guild.php*
// @include        https://*.heroeswm.ru/tj_single.php*
// @include        https://*.lordswm.com/tj_single.php*
// @include        https://*.heroeswm.ru/*_event*.php*
// @include        https://*.lordswm.com/*_event*.php*
// @include        https://*.heroeswm.ru/pl_hunter_stat.php*
// @include        https://*.lordswm.com/pl_hunter_stat.php*
// @include        https://daily.heroeswm.ru/help/gn/monsters.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant 		   GM.xmlHttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/488993/hwmHuntHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/488993/hwmHuntHelper.meta.js
// ==/UserScript==

// Update by CheckT
// небольшая доработка скрипта hwm_GO_exp от ElMarado (Based on script Mantens)
//    - хранение настроек независимо по игрокам
//    - кнопка "пометить всех птиц"
// Оригинал https://greasyfork.org/ru/scripts/11692-hwm-go-exp


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
const path = `${location.protocol}//${location.host}`;
const resourcesPath = `${location.protocol}//${location.host.replace("www", "dcdn").replace("mirror", "qcdn")}`;

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

if(!PlayerId) {
    return;
}


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


if(location.pathname == "/home.php" || location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
    if(isNewPersonPage) {
        const levelInfoCell = Array.from(document.querySelectorAll("div.home_pers_info")).find(x => x.innerHTML.includes(isEn ? "Combat level" : "Боевой уровень"));
        if(levelInfoCell) {
            console.log(levelInfoCell.querySelector("div[id=bartext] > span").innerText)
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
let playerArmyMightAdd;
let playerArmyMightMulti;
let playerArmyMightAvgSq;
const recruitEventPlayerArmyDiv = document.querySelector("#set_mobile_max_width > div > div.global_container_block.recruit_event_army_attack > div.recruit_event_army_attack_inside > div:nth-child(1) > div:nth-child(2) > div");
const pairedPortalEventPlayerArmyDiv = document.querySelector("#set_mobile_max_width > div.new_event_map > div.event_result_attack.event_old_chrome_column > div.global_container_block.event_old_chrome_column > div:first-of-type > div:first-of-type"); //console.log(pairedPortalEventPlayerArmyDiv);

const glEventPlayerArmyDiv = document.querySelector("div#hwm_lg_stacks_div");
const sectors = {
    "cx=50&cy=50": 1, //Empire Capital
    "cx=51&cy=50": 2, //East River
    "cx=50&cy=49": 3, //Tiger Lake
    "cx=51&cy=49": 4, //Rogues' Wood
    "cx=50&cy=51": 5, //Wolf Dale
    "cx=50&cy=48": 6, //Peaceful Camp
    "cx=49&cy=51": 7, //Lizard Lowland
    "cx=49&cy=50": 8, //Green Wood
    "cx=49&cy=48": 9, //Eagle Nest
    "cx=50&cy=52": 10, //Portal Ruins
    "cx=51&cy=51": 11, //Dragon Caves
    "cx=49&cy=49": 12, //Shining Spring
    "cx=48&cy=49": 13, //Sunny Sity
    "cx=52&cy=50": 14, //Magma Mines
    "cx=52&cy=49": 15, //Bear Mountain
    "cx=52&cy=48": 16, //Fairy Trees
    "cx=53&cy=50": 17, //Harbour City (Port City)
    "cx=53&cy=49": 18, //Mithril Coast
    "cx=51&cy=52": 19, //GreatWall
    "cx=51&cy=53": 20, //Titans' Valley
    "cx=52&cy=53": 21, //Fishing Village
    "cx=52&cy=54": 22, //Kingdom Capital
    "cx=48&cy=48": 23, //Ungovernable Steppe
    "cx=51&cy=48": 24, //Crystal Garden
    "cx=53&cy=52": 25, //East Island
    "cx=49&cy=52": 26, //The Wilderness
    "cx=48&cy=50": 27 //Sublime Arbor
}
const monsters = [{"name":"zealot","title":"Адепты","experience":121,"health":80,"enTitle":"Exorcists",leadership:1000}
,{"name":"hellcharger","title":"Адские жеребцы","experience":136,"health":50,"imageName":"nightmare","enTitle":"Hell horses",leadership:403}
,{"name":"zhryak","title":"Адские жнецы","experience":250,"health":99,"enTitle":"Hell reapers",leadership:1688}
,{"name":"hellhound","title":"Адские псы","experience":33,"health":15,"imageName":"demondog","enTitle":"Wolfhounds",leadership:83}
,{"name":"reanimatorup","title":"Адские реаниматоры","experience":43,"health":27,"enTitle":"Infernal reanimators",leadership:undefined}
,{"name":"iceelb","title":"Айсберговые элементали","experience":50,"health":90,"canFly":true,"enTitle":"Iceberg elementals",leadership:undefined}
,{"name":"diamondgolem","title":"Алмазные големы","experience":110,"health":60,"enTitle":"Diamond golems",leadership:284}
,{"name":"yetiup","title":"Алмасты","experience":400,"health":290,"enTitle":"Almases",leadership:undefined}
,{"name":"angel","title":"Ангелы","experience":330,"health":180,"canFly":true,"enTitle":"Angels",leadership:1890}
,{"name":"marksman","title":"Арбалетчики","experience":19,"health":10,"enTitle":"Crossbowmen",leadership:87}
,{"name":"archangel","title":"Архангелы","experience":390,"health":220,"canFly":true,"enTitle":"Archangels",leadership:3797}
,{"name":"archdemon","title":"Архидемоны","experience":312,"health":211,"enTitle":"Antichrists",leadership:2804}
,{"name":"archdevil","title":"Архидьяволы","experience":311,"health":199,"enTitle":"Archdevils",leadership:2437}
,{"name":"archlich","title":"Архиличи","experience":110,"health":55,"enTitle":"Archliches",leadership:797}
,{"name":"archmage","title":"Архимаги","experience":70,"health":30,"enTitle":"Lorekeepers",leadership:544}
,{"name":"assassin","title":"Ассасины","experience":33,"health":14,"imageName":"assasin","enTitle":"Poisoners",leadership:126}
,{"name":"ghostdragon","title":"Астральные драконы","experience":310,"health":150,"canFly":true,"enTitle":"Mirage dragons",leadership:1479}
,{"name":"banshee","title":"Баньши","experience":205,"health":110,"enTitle":"Death proclaimers",leadership:905}
,{"name":"behemoth","title":"Бегемоты","experience":350,"health":210,"enTitle":"Behemoths",leadership:1708}
,{"name":"berserker","title":"Берсерки","experience":42,"health":25,"enTitle":"Berserkers",leadership:130}
,{"name":"maiden","title":"Бестии","experience":30,"health":16,"enTitle":"Rogues",leadership:125}
,{"name":"imp","title":"Бесы","experience":6,"health":4,"enTitle":"Imps",leadership:24}
,{"name":"wisp","title":"Блуждающие огни","experience":7,"health":10,"canFly":true,"enTitle":"Will-O-Wisps",leadership:undefined}
,{"name":"battlegriffin","title":"Боевые грифоны","experience":45,"health":35,"canFly":true,"enTitle":"Frenzied griffins",leadership:342}
,{"name":"silverunicorn","title":"Боевые единороги","experience":135,"health":77,"enTitle":"Brilliant unicorns",leadership:533}
,{"name":"mcentaur","title":"Боевые кентавры","experience":21,"health":10,"enTitle":"Tempered centaurs",leadership:83}
,{"name":"battlemage","title":"Боевые маги","experience":72,"health":29,"enTitle":"Battlemagi",leadership:467}
,{"name":"slon","title":"Боевые слоны","experience":120,"health":100,"enTitle":"Fighting elephants",leadership:777}
,{"name":"vampire","title":"Вампиры","experience":68,"health":30,"enTitle":"Vampires",leadership:256}
,{"name":"warmong","title":"Вармонгеры","experience":36,"health":20,"enTitle":"Protectors",leadership:109}
,{"name":"cursed","title":"Ведьмы-призраки","experience":30,"health":20,"canFly":true,"imageName":"cursed_","enTitle":"Cursed witches",leadership:187}
,{"name":"giant","title":"Великаны","experience":160,"health":100,"enTitle":"Trashers",leadership:949}
,{"name":"giantarch","title":"Великаны-лучники","experience":130,"health":100,"enTitle":"Giant archers",leadership:1306}
,{"name":"upleviathan","title":"Великие левиафаны","experience":300,"health":250,"enTitle":"Great leviathans",leadership:undefined}
,{"name":"wendigo","title":"Вендиго","experience":20,"health":25,"enTitle":"Wendigos",leadership:undefined}
,{"name":"druideld","title":"Верховные друиды","experience":101,"health":38,"imageName":"ddeld","enTitle":"Anchorites",leadership:539}
,{"name":"wraith","title":"Вестники смерти","experience":205,"health":100,"enTitle":"Death heralds",leadership:1001}
,{"name":"wyvern","title":"Виверны","experience":170,"health":90,"canFly":true,"enTitle":"Tamed wyverns",leadership:703}
,{"name":"djinn_vizier","title":"Визири джиннов","experience":110,"health":50,"canFly":true,"enTitle":"Fortune genies",leadership:409}
,{"name":"matriarch","title":"Владычицы тени","experience":185,"health":90,"enTitle":"Dark sibyls",leadership:1116}
,{"name":"water","title":"Водные элементали","experience":57,"health":43,"enTitle":"Water elementals",leadership:460}
,{"name":"chieftain","title":"Вожаки","experience":100,"health":48,"enTitle":"Chieftains",leadership:1397}
,{"name":"air","title":"Воздушные элементали","experience":59,"health":30,"canFly":true,"enTitle":"Air elementals",leadership:258}
,{"name":"anubisup","title":"Воины Анубиса","experience":420,"health":200,"enTitle":"Anubis warriors",leadership:2571}
,{"name":"battlerager","title":"Воины ярости","experience":42,"health":30,"enTitle":"Beastslayers",leadership:187}
,{"name":"mercfootman","title":"Воины-наёмники","experience":25,"health":24,"enTitle":"Mercenary warriors",leadership:131}
,{"name":"shieldguard","title":"Воители","experience":12,"health":12,"enTitle":"Veterans",leadership:51}
,{"name":"thiefmage","title":"Воры-колдуны","experience":35,"health":30,"enTitle":"Renegade magicians",leadership:506}
,{"name":"thiefwarrior","title":"Воры-разведчики","experience":35,"health":45,"enTitle":"Renegade scouts",leadership:279}
,{"name":"thiefarcher","title":"Воры-убийцы","experience":35,"health":40,"enTitle":"Renegade thugs",leadership:390}
,{"name":"seraph2","title":"Высшие ангелы","experience":390,"health":220,"canFly":true,"enTitle":"Thrones",leadership:3471}
,{"name":"vampirelord","title":"Высшие вампиры","experience":70,"health":35,"enTitle":"Vampire counts",leadership:344}
,{"name":"masterlich","title":"Высшие личи","experience":100,"health":55,"enTitle":"Demiliches",leadership:802}
,{"name":"highwayman","title":"Вышибалы","experience":30,"health":24,"enTitle":"Bruisers",leadership:117}
,{"name":"harpooner","title":"Гарпунеры","experience":18,"health":10,"enTitle":"Harpooners",leadership:69}
,{"name":"hydra","title":"Гидры","experience":108,"health":80,"enTitle":"Hydras",leadership:420}
,{"name":"upseamonster","title":"Глубоководные черти","experience":140,"health":105,"enTitle":"Voracious anglerfish",leadership:undefined}
,{"name":"rotzombie","title":"Гниющие зомби","experience":17,"health":23,"enTitle":"Ghouls",leadership:75}
,{"name":"goblin","title":"Гоблины","experience":5,"health":3,"enTitle":"Goblins",leadership:19}
,{"name":"goblinarcher","title":"Гоблины-лучники","experience":9,"health":3,"enTitle":"Goblin archers",leadership:29}
,{"name":"goblinmag","title":"Гоблины-маги","experience":9,"health":3,"enTitle":"Goblin warlocks",leadership:330}
,{"name":"trapper","title":"Гоблины-трапперы","experience":15,"health":7,"enTitle":"Goblin trappers",leadership:25}
,{"name":"gogachi","title":"Гоги","experience":13,"health":13,"imageName":"gog","enTitle":"Gogs",leadership:91}
,{"name":"brute","title":"Головорезы","experience":6,"health":8,"enTitle":"Brutes",leadership:32}
,{"name":"mountaingr","title":"Горные стражи","experience":24,"health":12,"enTitle":"Mountain sentries",leadership:36}
,{"name":"gremlin","title":"Гремлины","experience":5,"health":5,"enTitle":"Gremlins",leadership:29}
,{"name":"saboteurgremlin","title":"Гремлины-вредители","experience":9,"health":6,"enTitle":"Gremlin wreckers",leadership:90}
,{"name":"griffon","title":"Грифоны","experience":59,"health":30,"canFly":true,"enTitle":"Griffins",leadership:194}
,{"name":"thunderlord","title":"Громовержцы","experience":162,"health":120,"enTitle":"Invokers",leadership:1389}
,{"name":"axegnom","title":"Громоглавы","experience":14,"health":10,"enTitle":"Thunderheads",leadership:45}
,{"name":"nomadup","title":"Гунны","experience":60,"health":33,"enTitle":"Huns",leadership:148}
,{"name":"deserter","title":"Дезертиры","experience":40,"health":25,"enTitle":"Deserters",leadership:undefined}
,{"name":"succubusmis","title":"Демонессы","experience":67,"health":30,"imageName":"succubusm","enTitle":"Mistresses",leadership:363}
,{"name":"djinn","title":"Джинны","experience":103,"health":40,"canFly":true,"enTitle":"Genies",leadership:375}
,{"name":"djinn_sultan","title":"Джинны-султаны","experience":110,"health":45,"canFly":true,"enTitle":"Senior genies",leadership:805}
,{"name":"savageent","title":"Дикие энты","experience":210,"health":175,"enTitle":"Savage Treant",leadership:1231}
,{"name":"robber","title":"Дозорные","experience":7,"health":5,"enTitle":"Outriders",leadership:35}
,{"name":"eadaughter","title":"Дочери земли","experience":72,"health":35,"enTitle":"Earth shamans",leadership:790}
,{"name":"sdaughter","title":"Дочери неба","experience":75,"health":35,"enTitle":"Sky shamans",leadership:834}
,{"name":"ancientbehemoth","title":"Древние бегемоты","experience":390,"health":250,"imageName":"abehemoth","enTitle":"Ancient Behemoths",leadership:2605}
,{"name":"amummy","title":"Древние мумии","experience":135,"health":80,"enTitle":"Ancient mummies",leadership:undefined}
,{"name":"ancienent","title":"Древние энты","experience":210,"health":181,"enTitle":"Ironroot treefolk",leadership:1415}
,{"name":"sprite","title":"Дриады","experience":20,"health":6,"canFly":true,"enTitle":"Sprites",leadership:54}
,{"name":"druid","title":"Друиды","experience":74,"health":34,"imageName":"dd_","enTitle":"Druids",leadership:535}
,{"name":"poltergeist","title":"Духи","experience":27,"health":20,"canFly":true,"enTitle":"Poltergeists",leadership:143}
,{"name":"devil","title":"Дьяволы","experience":245,"health":166,"enTitle":"Devils",leadership:1893}
,{"name":"vermin","title":"Дьяволята","experience":10,"health":6,"enTitle":"Vermins",leadership:39}
,{"name":"unicorn","title":"Единороги","experience":124,"health":57,"enTitle":"Unicorns",leadership:390}
,{"name":"iron_golem","title":"Железные големы","experience":33,"health":18,"imageName":"golem","enTitle":"Golems",leadership:73}
,{"name":"runepriest","title":"Жрецы рун","experience":59,"health":60,"enTitle":"Priests",leadership:439}
,{"name":"runekeeper","title":"Жрецы пламени","experience":100,"health":65,"enTitle":"Ascetics",leadership:970}
,{"name":"priestmoon","title":"Жрицы луны","experience":60,"health":50,"enTitle":"Moon Priestesses","imageName":"zhrica",leadership:947}
,{"name":"priestsun","title":"Жрицы солнца","experience":70,"health":55,"enTitle":"Sun Priestesses","imageName":"zhricaup",leadership:1997}
,{"name":"vindicator","title":"Защитники веры","experience":20,"health":23,"enTitle":"Crusaders",leadership:121}
,{"name":"defender","title":"Защитники гор","experience":7,"health":7,"enTitle":"Sentries",leadership:29}
,{"name":"greendragon","title":"Зелёные драконы","experience":350,"health":200,"canFly":true,"enTitle":"Green dragons",leadership:2611}
,{"name":"earth","title":"Земные элементали","experience":63,"health":75,"enTitle":"Earth elementals",leadership:337}
,{"name":"zombie","title":"Зомби","experience":11,"health":17,"enTitle":"Zombies",leadership:46}
,{"name":"emeralddragon","title":"Изумрудные драконы","experience":400,"health":200,"canFly":true,"enTitle":"Jade dragons",leadership:3522}
,{"name":"impergriffin","title":"Имперские грифоны","experience":62,"health":35,"canFly":true,"enTitle":"Royal griffins",leadership:290}
,{"name":"inquisitor","title":"Инквизиторы","experience":121,"health":80,"enTitle":"Clerics",leadership:900}
,{"name":"seducer","title":"Искусительницы","experience":65,"health":26,"enTitle":"Temptresses",leadership:495}
,{"name":"efreeti","title":"Ифриты","experience":200,"health":90,"canFly":true,"enTitle":"Efreeti",leadership:982}
,{"name":"efreetisultan","title":"Ифриты султаны","experience":250,"health":100,"canFly":true,"enTitle":"Efreeti sultans",leadership:1033}
,{"name":"yeti","title":"Йети","experience":400,"health":280,"enTitle":"Yeties",leadership:undefined}
,{"name":"stone_gargoyle","title":"Каменные горгульи","experience":16,"health":15,"canFly":true,"imageName":"gargoly","enTitle":"Gargoyles",leadership:44}
,{"name":"kammon","title":"Каменные монстры","experience":20,"health":28,"enTitle":"Stone monsters",leadership:undefined}
,{"name":"fcentaur","title":"Кентавры","experience":13,"health":6,"enTitle":"Centaurs",leadership:54}
,{"name":"vampireprince","title":"Князья вампиров","experience":70,"health":40,"enTitle":"Dreadlords",leadership:388}
,{"name":"outlaw","title":"Колдуны-ренегаты","experience":6,"health":6,"enTitle":"Turncoat Mages",leadership:199}
,{"name":"colossus","title":"Колоссы","experience":350,"health":175,"enTitle":"Giants",leadership:1888}
,{"name":"hellkon","title":"Кони преисподней","experience":138,"health":66,"imageName":"hellstallion","enTitle":"Searing horses",leadership:791}
,{"name":"brawler","title":"Костоломы","experience":27,"health":20,"enTitle":"Brawlers",leadership:96}
,{"name":"bonedragon","title":"Костяные драконы","experience":280,"health":150,"canFly":true,"enTitle":"Skeletal dragons",leadership:1265}
,{"name":"nomad","title":"Кочевники","experience":50,"health":30,"enTitle":"Nomads",leadership:129}
,{"name":"ncentaur","title":"Кочевые кентавры","experience":20,"health":9,"enTitle":"Centaur outriders",leadership:77}
,{"name":"nightmare","title":"Кошмары","experience":140,"health":66,"imageName":"stallion","enTitle":"Nightmares",leadership:619}
,{"name":"reddragon","title":"Красные драконы","experience":400,"health":235,"canFly":true,"enTitle":"Red dragons",leadership:3977}
,{"name":"peasant","title":"Крестьяне","experience":5,"health":4,"imageName":"paesant","enTitle":"Farmers",leadership:16}
,{"name":"crusader","title":"Крестоносцы","experience":27,"health":30,"enTitle":"Templars",leadership:160}
,{"name":"crystaldragon","title":"Кристальные драконы","experience":400,"health":200,"canFly":true,"enTitle":"Crystal Dragons",leadership:3683}
,{"name":"bloodeyecyc","title":"Кровоглазые циклопы","experience":500,"health":235,"enTitle":"Tribal beholders",leadership:2408}
,{"name":"rakshasa_kshatra","title":"Кшатрии ракшасы","experience":162,"health":135,"enTitle":"Sphynx immortals",leadership:1464}
,{"name":"lavadragon","title":"Лавовые драконы","experience":329,"health":275,"enTitle":"Core dragons",leadership:2829}
,{"name":"scout","title":"Лазутчики","experience":20,"health":10,"enTitle":"Bandits",leadership:63}
,{"name":"banditka","title":"Лазутчицы","experience":12,"health":8,"enTitle":"Infiltrators",leadership:57}
,{"name":"squire","title":"Латники","experience":21,"health":26,"imageName":"swordman","enTitle":"Guardians",leadership:231}
,{"name":"leviathan","title":"Левиафаны","experience":250,"health":200,"enTitle":"Leviathans",leadership:undefined}
,{"name":"arcaneelf","title":"Лесные снайперы","experience":42,"health":12,"enTitle":"Sharpshooters",leadership:292}
,{"name":"bobbit","title":"Лесные хоббиты","experience":9,"health":6,"enTitle":"Forest hobbits",leadership:57}
,{"name":"lich","title":"Личи","experience":87,"health":50,"enTitle":"Liches",leadership:550}
,{"name":"stalker","title":"Ловчие","experience":34,"health":15,"enTitle":"Stalkers",leadership:98}
,{"name":"archer","title":"Лучники","experience":15,"health":7,"enTitle":"Bowmen",leadership:72}
,{"name":"mage","title":"Маги","experience":63,"health":18,"enTitle":"Magi",leadership:402}
,{"name":"magicel","title":"Магические элементали","experience":200,"health":80,"enTitle":"Magic elementals",leadership:870}
,{"name":"magmadragon","title":"Магма драконы","experience":329,"health":280,"enTitle":"Magma dragons",leadership:2594}
,{"name":"magneticgolem","title":"Магнитные големы","experience":57,"health":28,"enTitle":"Lodestone golems",leadership:111}
,{"name":"megogachi","title":"Магоги","experience":16,"health":13,"imageName":"magog","enTitle":"Magogs",leadership:97}
,{"name":"raremamont","title":"Мамонты","experience":160,"health":110,"enTitle":"Mammoths","imageName":"mamont",leadership:undefined}
,{"name":"skirmesher","title":"Мастера копья","experience":17,"health":12,"enTitle":"Master spearmen",leadership:78}
,{"name":"masterhunter","title":"Мастера лука","experience":42,"health":14,"imageName":"hunterelf","enTitle":"Grandmaster bowmen",leadership:205}
,{"name":"bloodsister","title":"Мегеры","experience":49,"health":24,"enTitle":"Termagants",leadership:232}
,{"name":"spearwielder","title":"Метатели копья","experience":11,"health":10,"enTitle":"Spearmen",leadership:39}
,{"name":"minotaur","title":"Минотавры","experience":39,"health":31,"enTitle":"Tamed minotaurs",leadership:114}
,{"name":"minotaurguard","title":"Минотавры-стражи","experience":56,"health":35,"imageName":"minotaurguard_","enTitle":"Minotaur soldiers",leadership:161}
,{"name":"taskmaster","title":"Минотавры-надсмотрщики","experience":56,"health":40,"enTitle":"Minotaur gladiators",leadership:1875}
,{"name":"cbal","title":"Мобильные баллисты","experience":100,"health":65,"enTitle":"Mobile ballista",leadership:447}
,{"name":"gnomon","title":"Молотобойцы","experience":12,"health":9,"enTitle":"Warhammerers",leadership:53}
,{"name":"priest","title":"Монахи","experience":101,"health":54,"enTitle":"Monks",leadership:528}
,{"name":"seamonster","title":"Морские черти","experience":120,"health":90,"enTitle":"Anglerfish",leadership:undefined}
,{"name":"mummy","title":"Мумии","experience":115,"health":50,"enTitle":"Mummies",leadership:3310}
,{"name":"pharaoh","title":"Мумии фараонов","experience":135,"health":70,"enTitle":"Sphynx mummies",leadership:3400}
,{"name":"enforcer","title":"Мятежники","experience":10,"health":7,"enTitle":"Rebels",leadership:38}
,{"name":"naga","title":"Наги","experience":160,"health":110,"enTitle":"Nagas",leadership:938}
,{"name":"dromad","title":"Наездники на верблюдах","experience":60,"health":40,"enTitle":"Camel riders",leadership:212}
,{"name":"wolfrider","title":"Наездники на волках","experience":20,"health":10,"enTitle":"Wolf Riders",leadership:59}
,{"name":"hyenarider","title":"Наездники на гиенах","experience":31,"health":13,"enTitle":"Hyena riders",leadership:84}
,{"name":"boarrider","title":"Наездники на кабанах","experience":31,"health":14,"enTitle":"Boar riders",leadership:85}
,{"name":"bearrider","title":"Наездники на медведях","experience":24,"health":25,"enTitle":"Dwarven ursary",leadership:119}
,{"name":"darkrider","title":"Наездники на ящерах","experience":65,"health":40,"imageName":"lizardrider","enTitle":"Lizard cavalry",leadership:277}
,{"name":"dromadup","title":"Налетчики на верблюдах","experience":70,"health":45,"enTitle":"Camel raiders",leadership:261}
,{"name":"wolfraider","title":"Налётчики на волках","experience":31,"health":12,"imageName":"hobwolfrider","enTitle":"Wolf Raiders",leadership:71}
,{"name":"dryad","title":"Нимфы","experience":20,"health":6,"canFly":true,"imageName":"dryad_","enTitle":"Dryads",leadership:50}
,{"name":"obsgargoyle","title":"Обсидиановые горгульи","experience":26,"health":20,"canFly":true,"imageName":"obsgargoly","enTitle":"Enchanted gargoyles",leadership:60}
,{"name":"hotdog","title":"Огненные гончие","experience":36,"health":15,"imageName":"firehound","enTitle":"Blazing hounds",leadership:161}
,{"name":"hornedoverseer","title":"Огненные демоны","experience":23,"health":13,"imageName":"fdemon","enTitle":"Incendiaries",leadership:47}
,{"name":"firedragon","title":"Огненные драконы","experience":255,"health":230,"enTitle":"Lava dragons",leadership:2386}
,{"name":"firebird","title":"Огненные птицы","experience":117,"health":65,"canFly":true,"imageName":"firebird_","enTitle":"Firebirds",leadership:680}
,{"name":"fire","title":"Огненные элементали","experience":60,"health":43,"enTitle":"Fire elementals",leadership:356}
,{"name":"ogre","title":"Огры","experience":60,"health":50,"enTitle":"Ogres",leadership:220}
,{"name":"ogrebrutal","title":"Огры-ветераны","experience":75,"health":70,"enTitle":"Ogre trophy-hunters",leadership:291}
,{"name":"ogremagi","title":"Огры-маги","experience":74,"health":65,"enTitle":"Ogre magi",leadership:823}
,{"name":"ogreshaman","title":"Огры-шаманы","experience":74,"health":55,"enTitle":"Ogre shamans",leadership:675}
,{"name":"conscript","title":"Ополченцы","experience":7,"health":6,"enTitle":"Recruits",leadership:24}
,{"name":"orc","title":"Орки","experience":29,"health":12,"enTitle":"Orcs",leadership:109}
,{"name":"orcchief","title":"Орки-вожди","experience":38,"health":18,"enTitle":"Orc chiefs",leadership:200}
,{"name":"orcrubak","title":"Орки-тираны","experience":38,"health":20,"enTitle":"Orc tyrants",leadership:167}
,{"name":"orcshaman","title":"Орки-шаманы","experience":33,"health":13,"enTitle":"Orc shamans",leadership:644}
,{"name":"paladin","title":"Паладины","experience":262,"health":100,"enTitle":"Paladins",leadership:undefined}
,{"name":"executioner","title":"Палачи","experience":83,"health":40,"enTitle":"Warlords",leadership:325}
,{"name":"footman","title":"Пехотинцы","experience":17,"health":16,"enTitle":"Swordsmen",leadership:79}
,{"name":"pitlord","title":"Пещерные владыки","experience":195,"health":120,"imageName":"pitlord_","enTitle":"Pit demons",leadership:1334}
,{"name":"deephydra","title":"Пещерные гидры","experience":115,"health":125,"enTitle":"Ladons",leadership:599}
,{"name":"pitfiend","title":"Пещерные демоны","experience":157,"health":110,"imageName":"pitfiend_","enTitle":"Cave demons",leadership:950}
,{"name":"pity","title":"Пещерные отродья","experience":165,"health":140,"imageName":"pitspawn","enTitle":"Abyss demons",leadership:1103}
,{"name":"piroman","title":"Пироманьяки","experience":10,"health":20,"enTitle":"Pyromaniacs",leadership:undefined}
,{"name":"ghost","title":"Привидения","experience":26,"health":8,"canFly":true,"enTitle":"Ghosts",leadership:86}
,{"name":"spectre","title":"Призраки","experience":27,"health":19,"canFly":true,"enTitle":"Apparitions",leadership:146}
,{"name":"spectraldragon","title":"Призрачные драконы","experience":310,"health":160,"canFly":true,"enTitle":"Shadow dragons",leadership:1595}
,{"name":"rakshasa_rani","title":"Принцессы ракшас","experience":155,"health":120,"imageName":"rakshas","enTitle":"Sphynx guardians",leadership:707}
,{"name":"briskrider","title":"Проворные наездники","experience":94,"health":50,"enTitle":"Lizard chargers",leadership:378}
,{"name":"cursedbehemoth","title":"Проклятые бегемоты","experience":400,"health":250,"imageName":"dbehemoth","enTitle":"Cursed behemoths",leadership:2614}
,{"name":"predator","title":"Проклятые горгульи","experience":25,"health":35,"canFly":true,"imageName":"hgarg","enTitle":"Cursed Gargoyles",leadership:undefined}
,{"name":"cursedent","title":"Проклятые энты","experience":250,"health":215,"enTitle":"Cursed treefolk",leadership:1327}
,{"name":"thunderbird","title":"Птицы грома","experience":115,"health":65,"canFly":true,"enTitle":"Thunderbirds",leadership:649}
,{"name":"darkbird","title":"Птицы тьмы","experience":120,"health":60,"canFly":true,"enTitle":"Dark rocs",leadership:649}
,{"name":"vulture","title":"Пустынные налетчики","experience":50,"health":40,"canFly":true,"enTitle":"Desert Raiders",leadership:227}
,{"name":"duneraider","title":"Пустынные рейдеры","experience":22,"health":12,"enTitle":"Dune raiders",leadership:94}
,{"name":"duneraiderup","title":"Пустынные убийцы","experience":24,"health":12,"enTitle":"Dune assassins",leadership:137}
,{"name":"rakshasa_raja","title":"Раджи ракшас","experience":160,"health":140,"enTitle":"Sphynx warriors",leadership:1075}
,{"name":"tombraider","title":"Расхитители могил","experience":14,"health":10,"enTitle":"Grave raiders",leadership:52}
,{"name":"gladiator","title":"Ретиарии","experience":12,"health":25,"enTitle":"Retiarius",leadership:undefined}
,{"name":"horneddemon","title":"Рогатые демоны","experience":14,"health":13,"imageName":"hdemon","enTitle":"Demons",leadership:40}
,{"name":"rapukk","title":"Рогатые жнецы","experience":200,"health":99,"enTitle":"Horned reapers",leadership:927}
,{"name":"rocbird","title":"Роки","experience":104,"health":55,"canFly":true,"imageName":"roc","enTitle":"Rocs",leadership:658}
,{"name":"brigand","title":"Рубаки","experience":6,"health":5,"enTitle":"Vagabonds",leadership:29}
,{"name":"cavalier","title":"Рыцари","experience":232,"health":90,"imageName":"knight","enTitle":"Cavalry",leadership:947}
,{"name":"pristineunicorn","title":"Светлые единороги","experience":135,"health":80,"enTitle":"Pristine Unicorns",leadership:826}
,{"name":"dbehemoth","title":"Свирепые бегемоты","experience":410,"health":280,"enTitle":"Infuriated behemoths",leadership:2599}
,{"name":"untamedcyc","title":"Свободные циклопы","experience":700,"health":225,"enTitle":"Unfettered cyclops",leadership:2606}
,{"name":"scarabup","title":"Священные скарабеи","experience":11,"health":6,"canFly":true,"enTitle":"Sacred scarabs",leadership:35}
,{"name":"whitebearrider","title":"Северные наездники","experience":36,"health":30,"enTitle":"Rearguard ursary",leadership:186}
,{"name":"kachok","title":"Силачи","enTitle":"Strongmen","experience":20,"health":50,leadership:211}
,{"name":"siren","title":"Сирены","experience":60,"health":20,"enTitle":"Sirens",leadership:undefined}
,{"name":"upsiren","title":"Сирены-искусительницы","experience":70,"health":24,"enTitle":"Seducing sirens",leadership:undefined}
,{"name":"scarab","title":"Скарабеи","experience":10,"health":6,"canFly":true,"enTitle":"Scarabs",leadership:23}
,{"name":"skeleton","title":"Скелеты","experience":6,"health":4,"imageName":"sceleton","enTitle":"Skeletons",leadership:20}
,{"name":"skmarksman","title":"Скелеты-арбалетчики","experience":12,"health":6,"enTitle":"Skeletal crossbowmen",leadership:36}
,{"name":"sceletonwar","title":"Скелеты-воины","experience":10,"health":5,"enTitle":"Skeletal legionnaires",leadership:391}
,{"name":"skeletonarcher","title":"Скелеты-лучники","experience":10,"health":4,"imageName":"sceletonarcher","enTitle":"Skeletal bowmen",leadership:33}
,{"name":"scorp","title":"Скорпионы","experience":6,"health":4,"enTitle":"Scorpions",leadership:34}
,{"name":"anubis","title":"Слуги Анубиса","experience":350,"health":160,"enTitle":"Anubis avatars",leadership:1610}
,{"name":"krokodil","title":"Служители оазисов","experience":110,"health":70,"enTitle":"Oasis acolytes",leadership:382}
,{"name":"chuvak","title":"Снежные воины","experience":35,"health":27,"enTitle":"Snow warriors",leadership:undefined}
,{"name":"snowwolf","title":"Снежные волки","experience":70,"health":50,"enTitle":"Snow wolves",leadership:271}
,{"name":"steelgolem","title":"Стальные големы","experience":54,"health":24,"enTitle":"Modern golems",leadership:137}
,{"name":"runepatriarch","title":"Старейшины рун","experience":100,"health":70,"enTitle":"Patriarchs",leadership:720}
,{"name":"mastergremlin","title":"Старшие гремлины","experience":9,"health":6,"enTitle":"Gremlin engineers",leadership:37}
,{"name":"jdemon","title":"Старшие демоны","experience":20,"health":13,"enTitle":"Fiends",leadership:57}
,{"name":"ddhigh","title":"Старшие друиды","experience":101,"health":34,"enTitle":"High Druids",leadership:421}
,{"name":"mauler","title":"Степные бойцы","experience":23,"health":12,"enTitle":"Enforcers",leadership:79}
,{"name":"warrior","title":"Степные воины","experience":21,"health":12,"enTitle":"Invaders",leadership:55}
,{"name":"goblinus","title":"Степные гоблины","experience":5,"health":3,"enTitle":"Tribal goblins",leadership:13}
,{"name":"cyclopus","title":"Степные циклопы","experience":390,"health":220,"enTitle":"Tribal cyclops",leadership:2213}
,{"name":"elgargoly","title":"Стихийные горгульи","experience":25,"health":16,"canFly":true,"enTitle":"Grotesques",leadership:74}
,{"name":"crossman","title":"Стрелки","experience":16,"health":8,"imageName":"crossbowman","enTitle":"Wardens",leadership:98}
,{"name":"mercarcher","title":"Стрелки-наёмники","experience":15,"health":8,"enTitle":"Mercenary archers",leadership:129}
,{"name":"succubus","title":"Суккубы","experience":61,"health":20,"imageName":"succub","enTitle":"Succubi",leadership:240}
,{"name":"shadow_witch","title":"Сумеречные ведьмы","experience":157,"health":80,"imageName":"witch","enTitle":"Dark witches",leadership:964}
,{"name":"shadowdragon","title":"Сумеречные драконы","experience":350,"health":200,"canFly":true,"enTitle":"Twilight dragons",leadership:3690}
,{"name":"wdancer","title":"Танцующие с ветром","experience":33,"health":14,"imageName":"winddancer","enTitle":"Forest brethren",leadership:135}
,{"name":"dancer","title":"Танцующие с клинками","experience":20,"health":12,"enTitle":"Forest keepers",leadership:71}
,{"name":"wardancer","title":"Танцующие со смертью","experience":33,"health":12,"imageName":"bladedancer","enTitle":"Elite forest keepers",leadership:91}
,{"name":"thane","title":"Таны","experience":131,"health":100,"enTitle":"Dreadbanes",leadership:1209}
,{"name":"foulwyvern","title":"Тёмные виверны","experience":195,"health":105,"canFly":true,"enTitle":"Venomous wyverns",leadership:861}
,{"name":"grimrider","title":"Тёмные всадники","experience":94,"health":50,"enTitle":"Lizard assailants",leadership:380}
,{"name":"foulhydra","title":"Тёмные гидры","experience":115,"health":125,"enTitle":"Foul hydras",leadership:615}
,{"name":"burbuly","title":"Тёмные горгульи","experience":21,"health":30,"canFly":true,"enTitle":"Dark Gargoyles",leadership:undefined}
,{"name":"titan","title":"Титаны","experience":400,"health":190,"enTitle":"Titans",leadership:3653}
,{"name":"stormtitan","title":"Титаны шторма","experience":400,"health":190,"enTitle":"Stormcallers",leadership:4034}
,{"name":"tengu","title":"Тэнгу","experience":100,"health":45,"canFly":true,"enTitle":"Tengu",leadership:480}
,{"name":"slayer","title":"Убийцы","experience":70,"health":34,"enTitle":"Commanders",leadership:248}
,{"name":"verblud","title":"Угонщики верблюдов","experience":55,"health":35,"enTitle":"Camel thieves",leadership:172}
,{"name":"wight","title":"Умертвия","experience":165,"health":95,"enTitle":"Death envoys",leadership:962}
,{"name":"pixel","title":"Феи","experience":12,"health":5,"canFly":true,"imageName":"pp","enTitle":"Faeries",leadership:37}
,{"name":"phoenix","title":"Фениксы","experience":600,"health":777,"canFly":true,"enTitle":"Phoenixes",leadership:undefined}
,{"name":"fury","title":"Фурии","experience":49,"health":16,"enTitle":"Shrews",leadership:213}
,{"name":"hobgoblin","title":"Хобгоблины","experience":9,"health":4,"enTitle":"Hobgoblins",leadership:23}
,{"name":"blackbearrider","title":"Хозяева медведей","experience":36,"health":30,"enTitle":"Frontier ursary",leadership:175}
,{"name":"mistress","title":"Хозяйки ночи","experience":185,"health":100,"enTitle":"Shadow mistresses",leadership:1213}
,{"name":"cerberus","title":"Церберы","experience":41,"health":15,"enTitle":"Cerberi",leadership:152}
,{"name":"cyclop","title":"Циклопы","experience":172,"health":85,"enTitle":"Cyclops",leadership:1132}
,{"name":"cyclopod","title":"Циклопы-генералы","experience":187,"health":100,"imageName":"cyclopod_","enTitle":"Cyclop generals",leadership:1120}
,{"name":"cyclopking","title":"Циклопы-короли","experience":182,"health":95,"enTitle":"Cyclop kings",leadership:1078}
,{"name":"shamancyclop","title":"Циклопы-шаманы","experience":190,"health":105,"imageName":"cyclopshaman","enTitle":"Cyclops shamans",leadership:4410}
,{"name":"mercwizard","title":"Чародеи-наёмники","experience":35,"health":36,"enTitle":"Mercenary sorcerers",leadership:536}
,{"name":"champion","title":"Чемпионы","experience":252,"health":100,"enTitle":"Chargers",leadership:1358}
,{"name":"blackwidow","title":"Черные вдовы","experience":40,"health":14,"enTitle":"Black widows",leadership:293}
,{"name":"scorpup","title":"Черные скорпионы","experience":9,"health":5,"enTitle":"Black scorpions",leadership:43}
,{"name":"familiar","title":"Черти","experience":10,"health":6,"enTitle":"Spawns",leadership:36}
,{"name":"blackdragon","title":"Чёрные драконы","experience":400,"health":240,"canFly":true,"enTitle":"Black dragons",leadership:3909}
,{"name":"plaguezombie","title":"Чумные зомби","experience":15,"health":17,"enTitle":"Infected zombies",leadership:88}
,{"name":"shakal","title":"Шакалы","experience":30,"health":24,"enTitle":"Jackals",leadership:158}
,{"name":"shakalup","title":"Шакалы-воины","experience":45,"health":30,"enTitle":"Jackals-warriors",leadership:202}
,{"name":"shamaness","title":"Шаманки","experience":66,"health":30,"enTitle":"Shamans",leadership:755}
,{"name":"banditkaup","title":"Шпионки","experience":14,"health":9,"enTitle":"Spies",leadership:73}
,{"name":"battlegriffon","title":"Штурмовые грифоны","experience":62,"health":52,"canFly":true,"enTitle":"Wild griffins",leadership:296}
,{"name":"slonup","title":"Штурмовые слоны","experience":150,"health":110,"enTitle":"Assault elephants",leadership:952}
,{"name":"elf","title":"Эльфийские лучники","experience":38,"health":10,"enTitle":"Elven bowmen",leadership:160}
,{"name":"treant","title":"Энты","experience":187,"health":175,"enTitle":"Treefolk","imageName":"ent",leadership:938}
,{"name":"tenguup","title":"Ямабуси Тэнгу","experience":100,"health":60,"canFly":true,"enTitle":"Yamabushi Tengu",leadership:705}
,{"name":"flamelord","title":"Ярлы","experience":162,"health":120,"enTitle":"Punishers",leadership:1352}
,{"name":"evilbunny2023","title":"Злой кроля 2023","experience":130,"health":123,"newYear":true,"enTitle":"Evil rabbit 2023",leadership:undefined}
,{"name":"evilcat2023","title":"Злой котик 2023","experience":45,"health":23,"newYear":true,"enTitle":"Evil cat 2023",leadership:undefined}
,{"name":"eviltiger2022","title":"Злой тигр 2022","experience":100,"health":122,"newYear":true,"enTitle":"Furious Tiger 2022",leadership:undefined}
,{"name":"bull2021","title":"Злой бык 2021","experience":69,"health":71,"newYear":true,"enTitle":"Ox 2021","imageName":"byk2",leadership:undefined}
,{"name":"rat2020","title":"Злая крыса 2020","experience":20,"health":20,"newYear":true,"enTitle":"Rat 2020",leadership:undefined}
,{"name":"pig2019","title":"Свин 2019","experience":16,"health":19,"newYear":true,"enTitle":"Pig 2019","imageName":"evilpig",leadership:undefined}
,{"name":"evildog","title":"Злой пёс 2018","experience":100,"health":88,"newYear":true,"enTitle":"Evil Dog 2018",leadership:undefined}
,{"name":"rooster","title":"Злой Петушок 2017","experience":60,"health":77,"canFly":true,"newYear":true,"enTitle":"Evil Rooster 2017",leadership:undefined}
,{"name":"gorilla","title":"Злая Обезьяна 2016","experience":40,"health":66,"newYear":true,"enTitle":"Evil Monkey 2016",leadership:undefined}
,{"name":"kozel","title":"Злой Козел 2015","experience":35,"health":55,"newYear":true,"enTitle":"Evil Goat 2015",leadership:undefined}
,{"name":"evilhorse","title":"Злая Лошадь 2014","experience":45,"health":84,"newYear":true,"enTitle":"Mad horse 2014",leadership:undefined}
,{"name":"evilsnake","title":"Злая Змея 2013","experience":45,"health":73,"newYear":true,"enTitle":"Mad snake 2013",leadership:undefined}
,{"name":"pikeman","title":"Копейщики","experience":15,"health":15,"enTitle":"Pikemen",leadership:80}
,{"name":"snowmonster","title":"Снежные монстры","experience":400,"health":350,"enTitle":"Snow monsters",leadership:undefined}
,{"name":"reanimator","title":"Реаниматоры","experience":40,"health":27,"enTitle":"Reanimators",leadership:98}
,{"name":"poacher","title":"Браконьеры","experience":33,"health":16,"enTitle":"Poachers",leadership:undefined}
,{"name":"gnomka","title":"Жрицы огня","experience":70,"health":40,"enTitle":"Priestesses of fire",leadership:undefined}
,{"name":"maroder","title":"Мародёры","experience":10,"health":7,"enTitle":"Marauders",leadership:36}
,{"name":"varg","title":"Наездники на варгах","experience":60,"health":44,"enTitle":"Varg riders",leadership:350}
,{"name":"ork","title":"Орочьи воины","experience":44,"health":24,"enTitle":"Orc warriors",leadership:171}
,{"name":"gnollsh","title":"Гноллы-шаманы","experience":11,"health":6,"enTitle":"Gnolls-shamans",leadership:703}
,{"name":"warden","title":"Надзиратели","experience":70,"health":39,"enTitle":"Prison guards",leadership:177}
,{"name":"outlawup","title":"Чародеи-ренегаты","experience":6,"health":8,"enTitle":"Turncoat Warmages",leadership:208}
,{"name":"brigandup","title":"Душегубы","experience":10,"health":6,"enTitle":"Murderers",leadership:35}
,{"name":"vorovka","title":"Воровки","experience":44,"health":30,"enTitle":"Shadow thieves",leadership:undefined}

,{"name":"acrossbowman","title":"Элитные арбалетчики","experience":45,"health":24,"enTitle":"Elite crossbowmen",leadership:206}

,{"name":"vedma","title":"Карги с болот","experience":80,"health":40,"enTitle":"Bog hags",leadership:undefined}
,{"name":"vedmaup","title":"Хозяйки топей","experience":95,"health":46,"enTitle":"Mire Mistress",leadership:undefined}

,{"name":"exile","title":"Маги-изгнанники","experience":60,"health":28,"enTitle":"Exiled mages",leadership:404}
,{"name":"monk","title":"Еретики","experience":40,"health":20,"enTitle":"Heretics",leadership:550}
,{"name":"stoneman","title":"Каменные гиганты","experience":200,"health":100,"enTitle":"Stone giants",leadership:1355}

,{"name":"gnollboss","title":"Гноллы-вожаки","experience":50,"health":36,"enTitle":"Gnoll Leaders",leadership:242}
,{"name":"gnoll","title":"Гноллы","experience":9,"health":6,"enTitle":"Gnolls",leadership:47}
,{"name":"gnollup","title":"Яростные гноллы","experience":13,"health":9,"enTitle":"Furious gnolls",leadership:93}
,{"name":"gnollka","title":"Дочери стаи","experience":9,"health":6,"enTitle":"Daughters of gnolls",leadership:47}
,{"name":"adeptus","title":"Сектанты","experience":40,"health":46,"enTitle":"Cultists",leadership:undefined}
,{"name":"robberup","title":"Соглядатаи","experience":13,"health":6,"enTitle":"Snoopers",leadership:62}
,{"name":"blud","title":"Блудницы","experience":10,"health":7,"enTitle":"Mystic courtesans",leadership:29}
,{"name":"gnollum","title":"Метатели боласов","experience":12,"health":6,"enTitle":"Bolas throwers",leadership:61}
,{"name":"charmerup","title":"Повелители змей","experience":15,"health":10,"enTitle":"Snake masters",leadership:undefined}
,{"name":"gorynych2024","title":"Злой Горыныч 2024","experience":200,"health":124,"canFly":true,"newYear":true,"enTitle":"Evil Dragon 2024",leadership:undefined}
,{"name":"smaster","title":"Мастера клинка","experience":150,"health":84,"enTitle":"Blade masters",leadership:749}
,{"name":"throwgnom","title":"Метатели молота","experience":40,"health":24,"enTitle":"Warhammermen",leadership:198}
,{"name":"witchhunter","title":"Охотники на ведьм","experience":78,"health":38,"enTitle":"Witch hunters",leadership:334}

,{"name":"grinchshad","title":"Тень Гринча","experience":100,"health":1000,"enTitle":"Grinch`s Shadow",leadership:undefined}

// Нейтралы
,{ name: "armorgnom", title: "Воители гор", enTitle: "Dwarf warriors", health: 55, experience: 50 ,leadership:308}
,{ name: "skgiantarch", title: "Костяные смотрители", enTitle: "Bone sentinels", health: 67, experience: 110 ,leadership:827}
,{ name: "bonelizard", title: "Костяные ящеры", enTitle: "Bone lizards", health: 30, experience: 55 ,leadership:undefined}
,{ name: "skgiant", title: "Костяные гиганты", enTitle: "Bone giants", health: 72, experience: 100 ,leadership:undefined}

// Фауна и жители леса
,{"name":"leprekon","title":"Лепреконы","experience":11,"health":7,"imageName":"lepr","enTitle":"Leprechauns",leadership:435}
,{"name":"klop","title":"Кислотники","experience":22,"health":12,"enTitle":"Acidspitters",leadership:undefined}
,{"name":"boar","title":"Кабаны","experience":12,"health":17,"enTitle":"Boars",leadership:86}
,{"name":"ancientpig","title":"Древние кабаны","experience":12,"health":15,"enTitle":"Ancient boars",leadership:100}
,{"name":"bear","title":"Медведи","experience":22,"health":22,"enTitle":"Bears",leadership:106}
,{"name":"swolf","title":"Степные волки","experience":20,"health":25,"enTitle":"Plains wolves",leadership:undefined}
,{"name":"whitetiger","title":"Белые тигры","experience":60,"health":35,"enTitle":"White tigers",leadership:260}
,{"name":"ant","title":"Муратавры","experience":33,"health":27,"enTitle":"Antauruses",leadership:undefined}
,{"name":"zerg","title":"Клыколиски","experience":50,"health":40,"enTitle":"Fangolisks",leadership:undefined}
,{"name":"plant","title":"Хищные растения","experience":92,"health":60,"enTitle":"Waspworts",leadership:744}
,{"name":"hungerplant","title":"Пожиратели плоти","experience":130,"health":70,"enTitle":"Flesh-eating trees",leadership:undefined}
,{"name":"forestspirit","title":"Духи леса","experience":90,"health":50,"canFly":true,"enTitle":"Spirits of forest","imageName":"spirit",leadership:undefined}
,{ name: "horse", title: "Жеребцы", enTitle: "Stallions", health: 70, experience: 70 ,leadership:undefined}
,{ name: "deertaur", title: "Дэрвинты", enTitle: "Deervyns", health: 50, experience: 100 ,leadership:260}
,{ name: "kobra", title: "Кобальтовые змеи", enTitle: "Cobalt snakes", health: 40, experience: 0 ,leadership:undefined}
,{ name: "elephant", title: "Слоны", enTitle: "Elephants", health: 200, experience: 270,leadership:undefined }
,{"name":"shaman","title":"Лесные шаманы","experience":200,"health":110,"enTitle":"Forest shamans",leadership:undefined}
,{"name":"buffalo","title":"Буйволы","experience":120,"health":120,"enTitle":"Buffaloes",leadership:undefined}

// Подземелье
,{"name":"troglodyte","title":"Троглодиты","experience":5,"health":5,"enTitle":"Troglodytes",leadership:31}
,{"name":"troglodyteup","title":"Адские троглодиты","experience":7,"health":6,"enTitle":"Infernal Troglodytes",leadership:33}
,{"name":"spider","title":"Пауки","experience":15,"health":9,"enTitle":"Spiders",leadership:59}
,{"name":"spiderpois","title":"Ядовитые пауки","experience":30,"health":14,"enTitle":"Venomous spiders",leadership:75}
,{"name":"harpy","title":"Гарпии","experience":29,"health":15,"canFly":true,"enTitle":"Harpies",leadership:123}
,{"name":"harpyhag","title":"Гарпии-ведьмы","experience":45,"health":15,"canFly":true,"enTitle":"Raiding harpies",leadership:194}
,{"name":"beholder","title":"Бехолдеры","experience":33,"health":22,"enTitle":"Beholders",leadership:166}
,{"name":"evileye","title":"Злобные глаза","experience":33,"health":22,"enTitle":"Evil eyes",leadership:165}
,{"name":"darkeye","title":"Глаза тьмы","experience":33,"health":26,"enTitle":"Shadow eyes",leadership:236}
,{"name":"medusa","title":"Медузы","experience":45,"health":25,"enTitle":"Medusas",leadership:238}
,{"name":"medusaup","title":"Медузы королевы","experience":55,"health":30,"enTitle":"Medusas Queens",leadership:221}
,{"name":"kamneed","title":"Камнееды","experience":56,"health":45,"enTitle":"Stoneeaters",leadership:242}
,{"name":"kamnegryz","title":"Камнегрызы","experience":67,"health":55,"enTitle":"Stonegnawers",leadership:226}
,{"name":"bigspider","title":"Гигантские пауки","experience":50,"health":55,"enTitle":"Giant Spiders",leadership:244}
,{"name":"manticore","title":"Мантикоры","experience":130,"health":80,"canFly":true,"enTitle":"Manticores",leadership:518}
,{"name":"manticoreup","title":"Скорпикоры","experience":140,"health":80,"canFly":true,"enTitle":"Scorpicores",leadership:706}
,{"name":"troll","title":"Тролли","experience":150,"health":150,"enTitle":"Trolls",leadership:962}
,{"name":"blacktroll","title":"Черные тролли","experience":180,"health":180,"enTitle":"Crazed trolls",leadership:1259}

// Ящеры
,{"name":"basilisk","title":"Василиски","experience":44,"health":35,"enTitle":"Basilisks",leadership:undefined}
,{"name":"basiliskup","title":"Древние василиски","experience":44,"health":40,"enTitle":"Ancient basilisks",leadership:undefined}
,{"name":"gekkon","title":"Ядоплюи","experience":20,"health":11,"enTitle":"Venomspitters",leadership:undefined}
,{"name":"gekkonup","title":"Гремучие ядоплюи","experience":20,"health":21,"enTitle":"Rattlesnake venomspitters",leadership:undefined}
,{"name":"ptero","title":"Птероящеры","experience":33,"health":20,"enTitle":"Pterolizards",leadership:undefined}
,{"name":"pteroup","title":"Матриархи птероящеров","experience":43,"health":27,"enTitle":"Pterolizards matriarchs",leadership:undefined}
,{"name":"serpentfly","title":"Крылатые змии","experience":35,"health":20,"canFly":true,"enTitle":"Serpent flyers",leadership:undefined}
,{"name":"dragonfly","title":"Стрекозы","experience":40,"health":20,"canFly":true,"enTitle":"Dragon flyers",leadership:undefined}
,{"name":"smalllizard","title":"Детёныши ящера","experience":13,"health":13,"imageName":"smalllizard_","enTitle":"Lizard cubs",leadership:undefined}
,{"name":"lizard","title":"Гигантские ящеры","experience":25,"health":25,"imageName":"lizard_","enTitle":"Giant lizards",leadership:undefined}
,{"name":"redlizard","title":"Кровавые ящеры","experience":30,"health":35,"imageName":"redlizard_","enTitle":"Vampiric lizards",leadership:undefined}
,{"name":"yascher","title":"Вараны","experience":75,"health":44,"enTitle":"Varans",leadership:undefined}
,{"name":"yascherup","title":"Огнедышащие вараны","experience":90,"health":49,"enTitle":"Fire-breathing varans",leadership:undefined}

//Сектанты
,{"name":"demoniac","title":"Одержимые","experience":6,"health":5,"enTitle":"Demoniacs",leadership:undefined}
,{"name":"drakonid","title":"Туманник","experience":300,"health":160,"canFly":true,"enTitle":"Foggy",leadership:undefined}

//Разбойники
,{"name":"charmer","title":"Заклинатели змей","experience":15,"health":9,"enTitle":"Snake charmers",leadership:undefined}
,{"name":"krokodilup","title":"Стражи оазисов","experience":100,"health":80,"enTitle":"Oasis guards",leadership:428}
,{"name":"krokodilmag","title":"Жрецы оазисов","experience":110,"health":60,"enTitle":"Oasis priests",leadership:undefined}
,{"name":"varan","title":"Загонщики на варанах","experience":80,"health":60,"enTitle":"Varan beaters",leadership:undefined}
,{"name":"nomadbow","title":"Скитальцы","experience":63,"health":31,"enTitle":"Wanderers",leadership:139}
,{"name":"vsad_unit","title":"Завоеватели","experience":300,"health":200,"enTitle":"Conquerors",leadership:undefined}
,{"name":"deserterup","title":"Искариоты","experience":60,"health":30,"enTitle":"Iscariots",leadership:undefined}
,{"name":"zasad","title":"Засадники","experience":110,"health":70,"enTitle":"Ambushers",leadership:443}
,{"name":"traitor","title":"Изменники","experience":20,"health":9,"enTitle":"Traitors",leadership:undefined}
,{"name":"gnollumup","title":"Дикие звероловы","experience":16,"health":8,"enTitle":"Wild beasthunters",leadership:undefined}
,{"name":"stonemanup","title":"Лавовые гиганты","experience":240,"health":110,"enTitle":"Lava giants",leadership:2105}
,{"name":"tombraiderup","title":"Расхитители гробниц","experience":17,"health":12,"enTitle":"Tomb raiders",leadership:undefined}
,{"name":"sekhmet","title":"Сехметиты","experience":100,"health":50,"enTitle":"Sekhmetites",leadership:229}

// Обитатели пляжа
, { name: "shellmonster", title: "Моллюски", enTitle: "Clam-monster", health: 90, experience: 80,leadership:622 }
, { name: "shell", title: "Ракушки", enTitle: "Shells", health: 6, experience: 7,leadership:undefined }
, { name: "krevetko", title: "Эбиры", enTitle: "Ebirahs", health: 66, experience: 90,leadership:437 }
, { name: "krab", title: "Гигантские крабы", enTitle: "Giant crabs", health: 50, experience: 80,leadership:undefined }
, { name: "krabup", title: "Плотоядные крабы", enTitle: "Carnivorous crabs", health: 60, experience: 100,leadership:undefined }

, { name: "shad", title: "Тени", enTitle: "Shadows", health: 9, experience: 14,"canFly": true,leadership:undefined }

//Грибы
,{ name: "gribok", title: "Поганцы", enTitle: "Toadstooler", health: 16, experience: 30,leadership:222 }
,{"name":"mushroom","title":"Мухоморища","experience":150,"health":90,"enTitle":"Amanitas",leadership:undefined}
,{"name":"boletus","title":"Споровики","experience":22,"health":17,"enTitle":"Sporeballs",leadership:undefined}
,{"name":"grib","title":"Боровики","experience":30,"health":20,"enTitle":"Boletuses",leadership:79}
,{"name":"fungus","title":"Грибоманты","experience":50,"health":29,"enTitle":"Mushroommancers",leadership:undefined}

//Армия Тьмы
,{ name: "necrodog", title: "Могильные псы", enTitle: "Grave hounds", health: 8, experience: 13,leadership:49 }
,{"name":"necrodogup","title":"Сумрачные гончие","experience":15,"health":9,"enTitle":"Twilight hounds",leadership:67}
,{"name":"blackarcher","title":"Сумрачные следопыты","experience":26,"health":13,"enTitle":"Twilight hunters",leadership:161}
,{"name":"deadarcher","title":"Чёрные сагиттарии","experience":33,"health":16,"enTitle":"Black sagittarii",leadership:185}
,{"name":"blackfootman","title":"Чёрные стражи","experience":26,"health":25,"enTitle":"Black guards",leadership:undefined}
,{"name":"deadfootman","title":"Тёмные бастионы","experience":31,"health":30,"enTitle":"Dark bastions",leadership:undefined}
,{"name":"blackmage","title":"Тёмные проклинатели","experience":39,"health":20,"enTitle":"Dark hexers",leadership:undefined}
,{"name":"deadmage","title":"Ваятели проклятий","experience":60,"health":27,"enTitle":"Сursing thaumaturges",leadership:undefined}
,{"name":"necromancer","title":"Ткачи смерти","experience":66,"health":33,"enTitle":"Deathweavers",leadership:undefined}
,{"name":"deadptic","title":"Предвестники тьмы","experience":100,"health":82,"canFly":true,"enTitle":"Harbingers of darkness",leadership:679}
,{ name: "blackptic", title: "Проклятые костеглоды", enTitle: "Damned bonegobblers", health: 70, experience: 100, canFly: true,leadership:555 }
,{"name":"blackknight","title":"Рыцари тьмы","experience":160,"health":90,"enTitle":"Black knights",leadership:835}
,{"name":"deadknight","title":"Рыцари смерти","experience":190,"health":100,"enTitle":"Unholy knights",leadership:1089}
,{"name":"dgolem","title":"Големы смерти","experience":329,"health":350,"enTitle":"Death golems",leadership:5170}
,{"name":"dgolemup","title":"Могильные големы","experience":400,"health":400,"enTitle":"Sepulcher golems",leadership:5061}

//Армия холода
,{"name":"snowarcher","title":"Полярные охотники","experience":36,"health":18,"enTitle":"Polar hunters",leadership:undefined}
,{"name":"snegovik","title":"Гигантские снеговики","experience":160,"health":100,"enTitle":"Giant snowmen",leadership:undefined}
,{"name":"wbear","title":"Белые медведи","experience":77,"health":55,"enTitle":"White bears",leadership:undefined}
,{"name":"chuvakup","title":"Ледяные воины","experience":35,"health":33,"enTitle":"Ice warriors",leadership:undefined}
,{"name":"snowowl","title":"Снежные совы","experience":100,"health":76,"canFly":true,"enTitle":"Snow owls",leadership:684}
,{"name":"snowowlup","title":"Полярные совы","experience":120,"health":81,"canFly":true,"enTitle":"Polar owls",leadership:undefined}
,{"name":"snowwolfup","title":"Полярные волки","experience":75,"health":53,"enTitle":"Polar wolves",leadership:335}
,{"name":"icequeen","title":"Снежные королевы","experience":120,"health":29,"enTitle":"Ice queens",leadership:undefined}
,{"name":"icequeenup","title":"Ледяные королевы","experience":120,"health":39,"enTitle":"Ice-Maidens",leadership:undefined}
,{"name":"iceddragonup","title":"Морозные драконы","experience":350,"health":250,"canFly":true,"enTitle":"Frost dragons",leadership:undefined}
,{"name":"iceddragon","title":"Ледяные драконы","experience":250,"health":220,"canFly":true,"enTitle":"Iced dragons","imageName":"icedragon",leadership:undefined}
,{"name":"iceel","title":"Ледяные элементали","experience":50,"health":45,"canFly":true,"enTitle":"Ice elementals",leadership:undefined}
,{"name":"iceelup","title":"Ледниковые элементали","experience":50,"health":45,"canFly":true,"enTitle":"Glacial elementals",leadership:undefined}
,{"name":"flake","title":"Снежинки","experience":7,"health":10,"canFly":true,"enTitle":"Snowflakes",leadership:undefined}
,{"name":"wendigoup","title":"Древние вендиго","experience":30,"health":35,"enTitle":"Ancient wendigos",leadership:329}

//Механики
,{"name":"mechdron","title":"Дроны","experience":10,"health":7,"canFly":true,"enTitle":"Drones",leadership:undefined}
,{"name":"mechspider","title":"Боты-пауки","experience":17,"health":12,"enTitle":"Spider-bots",leadership:undefined}
,{"name":"mechspiderup","title":"Боты-арахниды","experience":21,"health":14,"enTitle":"Arachnid-bots",leadership:undefined}
,{"name":"mechanic","title":"Механики","experience":50,"health":30,"enTitle":"Mechanics",leadership:undefined}
,{ name: "mechguard", title: "Пила-боты", enTitle: "Saw-bots", health: 50, experience: 75,leadership:undefined }
,{ name: "mechguardup", title: "Пила-терминаторы", enTitle: "Saw-terminators", health: 55, experience: 86,leadership:undefined }
,{"name":"alchemist","title":"Алхимики","experience":95,"health":60,"enTitle":"Alchemists",leadership:undefined}
,{"name":"alchemistup","title":"Изобретатели","experience":110,"health":68,"enTitle":"Inventors",leadership:undefined}
,{"name":"mechtank","title":"Паровые танки","experience":200,"health":120,"enTitle":"Steam tanks",leadership:undefined}
,{"name":"mechtankup","title":"Паровые аннигиляторы","experience":250,"health":140,"enTitle":"Steam annihilators",leadership:undefined}
,{ name: "mechgolem", title: "Стальные исполины", enTitle: "Steel giants", health: 180, experience: 350,leadership:undefined }


// Амфибии
,{"name":"sharkguard","title":"Акульи стражи","experience":87,"health":25,"enTitle":"Ichthys guard",leadership:undefined}
,{"name":"wanizame","title":"Акульи бойцы","experience":123,"health":31,"enTitle":"Ichthys fighters",leadership:undefined}
,{"name":"kappa","title":"Каппы","experience":78,"health":21,"enTitle":"Kappas",leadership:undefined}
,{"name":"kappashoya","title":"Могучие каппы","experience":114,"health":25,"enTitle":"Mighty kappas",leadership:undefined}
,{"name":"coralp","title":"Коралловые жрицы","experience":111,"health":18,"enTitle":"Coral priestesses",leadership:undefined}
,{"name":"pearlp","title":"Жемчужные жрицы","experience":159,"health":22,"enTitle":"Pearl priestesses",leadership:undefined}
,{"name":"springspirit","title":"Духи ручьёв","experience":315,"health":70,"enTitle":"Spring spirits",leadership:undefined}
,{"name":"mizukami","title":"Духи морей","experience":402,"health":76,"enTitle":"Spring custodians",leadership:undefined}
,{"name":"kenshi","title":"Кэнши","experience":438,"health":80,"enTitle":"Tritons",leadership:undefined}
,{"name":"kensei","title":"Кэнсэи","experience":564,"health":90,"enTitle":"Myrmidons",leadership:undefined}
,{"name":"snowmaiden","title":"Снежные девы","experience":450,"health":65,"enTitle":"Snow maidens",leadership:undefined}
,{"name":"yukionna","title":"Ледяные девы","experience":582,"health":72,"enTitle":"Frost maidens",leadership:undefined}
,{"name":"kirin","title":"Кирины","experience":1467,"health":255,"enTitle":"Aquatic serpents",leadership:undefined}
,{"name":"sacredkirin","title":"Священные кирины","experience":1794,"health":265,"enTitle":"Aquatic drakes",leadership:undefined}

// Инферно
,{"name":"maniac","title":"Помешанные","experience":87,"health":23,"enTitle":"Maniacs",leadership:undefined}
,{"name":"demented","title":"Безумцы","experience":129,"health":28,"enTitle":"Demented",leadership:undefined}
,{"name":"hellhound6","title":"Адские гончие","experience":123,"health":22,"enTitle":"Hellhounds",leadership:undefined}
,{"name":"cerber","title":"Адские церберы","experience":180,"health":28,"enTitle":"Hell cerberi",leadership:undefined}
,{"name":"succubus6","title":"Адские суккубы","experience":108,"health":20,"enTitle":"Demonesses","canFly":true,leadership:undefined}
,{"name":"lilim","title":"Лилимы","experience":159,"health":24,"enTitle":"Infernal succubi","canFly":true,leadership:undefined}
,{"name":"tormentor","title":"Садисты","experience":441,"health":80,"enTitle":"Tormentors",leadership:undefined}
,{"name":"lacerator","title":"Изверги","experience":522,"health":85,"enTitle":"Torturers",leadership:undefined}
,{"name":"breeder","title":"Породительницы","experience":366,"health":70,"enTitle":"Breeders",leadership:undefined}
,{"name":"mbreeder","title":"Матки-породительницы","experience":441,"health":75,"enTitle":"Heinous breeders",leadership:undefined}
,{"name":"juggernaut","title":"Разрушители","experience":120,"health":90,"enTitle":"Juggernauts",leadership:undefined}
,{"name":"ravager","title":"Опустошители","experience":136,"health":100,"enTitle":"Ravagers",leadership:undefined}
,{"name":"pitfiend6","title":"Демоны бездны","experience":1728,"health":270,"enTitle":"Wrath demons",leadership:undefined}
,{"name":"pitlord6","title":"Владыки бездны","experience":2250,"health":280,"enTitle":"Hatred demons",leadership:undefined}

// Некрополис
,{"name":"skeleton6","title":"Костяные воины","experience":72,"health":18,"enTitle":"Skeletal warriors",leadership:undefined}
,{"name":"skeletons6","title":"Костяные копейщики","experience":111,"health":23,"enTitle":"Skeletal Spearmen",leadership:undefined}
,{"name":"ghoul","title":"Упыри","experience":105,"health":25,"enTitle":"Nachzehrers",leadership:undefined}
,{"name":"ravenousghoul","title":"Ненасытные упыри","experience":147,"health":32,"enTitle":"Ravenous ghouls",leadership:undefined}
,{"name":"ghost6","title":"Привидения прошлого","experience":99,"health":21,"enTitle":"Ghosts of past",leadership:undefined}
,{"name":"spectre6","title":"Призраки прошлого","experience":138,"health":27,"enTitle":"Specters of past",leadership:undefined}
,{"name":"lich6","title":"Личи прошлого","experience":375,"health":65,"enTitle":"Liches of past",leadership:undefined}
,{"name":"vampire6","title":"Кровопийцы","experience":327,"health":80,"enTitle":"Bloodsuckers",leadership:undefined}
,{"name":"vampirelord6","title":"Вампиры прошлого","experience":408,"health":95,"enTitle":"Vampires of past",leadership:undefined}
,{"name":"fatespinner","title":"Прядильщицы судеб","experience":1746,"health":280,"enTitle":"Fate spinners",leadership:undefined}

// Непокорные племена
,{"name":"goblin6","title":"Непокорные гоблины","experience":66,"health":23,"enTitle":"Wild goblins",leadership:undefined}
,{"name":"goblinhunter6","title":"Гоблины-охотники","experience":99,"health":26,"enTitle":"Goblin hunters",leadership:undefined}
,{"name":"mauler6","title":"Громилы","experience":117,"health":30,"enTitle":"Maulers",leadership:undefined}
,{"name":"crusher6","title":"Крушилы","experience":162,"health":36,"enTitle":"Crushers",leadership:undefined}
,{"name":"harpy6","title":"Непокорные гарпии","experience":99,"health":29,"enTitle":"Unruly harpies",leadership:undefined}
,{"name":"fury6","title":"Сирины","experience":144,"health":33,"enTitle":"Frenzied harpies",leadership:undefined}
,{"name":"dreamwalker6","title":"Сноходцы","experience":315,"health":85,"enTitle":"Dreamwalkers",leadership:undefined}
,{"name":"dreamreaver6","title":"Ловцы снов","experience":399,"health":100,"enTitle":"Dreamreavers",leadership:undefined}
,{"name":"jaguar6","title":"Воины-ягуары","experience":369,"health":85,"enTitle":"Worshippers",leadership:undefined}
,{"name":"panther6","title":"Воины-пантеры","experience":480,"health":90,"enTitle":"Fetishists",leadership:undefined}
,{"name":"centaur6","title":"Непокорные кентавры","experience":645,"health":70,"enTitle":"Nomad centaurs",leadership:undefined}
,{"name":"mcentaur6","title":"Кентавры-мародёры","experience":849,"health":80,"enTitle":"Marauding centaurs",leadership:undefined}
,{"name":"cyclop6","title":"Непокорные циклопы","experience":1662,"health":330,"enTitle":"Wild cyclops",leadership:undefined}
,{"name":"ecyclop6","title":"Разъяренные циклопы","experience":2283,"health":360,"enTitle":"Raging cyclops",leadership:undefined}

// Рыцари солнца
,{"name":"sentinel","title":"Стражи","experience":66,"health":23,"enTitle":"Sentinels",leadership:undefined}
,{"name":"praetorian","title":"Гвардейцы","experience":99,"health":32,"enTitle":"Praetorians",leadership:undefined}
,{"name":"cman","title":"Арбалетчики света","experience":111,"health":22,"enTitle":"Marksmen",leadership:undefined}
,{"name":"marks","title":"Арбалетчики солнца","experience":50,"health":28,"enTitle":"Templar marksmen",leadership:undefined}
,{"name":"sister","title":"Послушницы","experience":72,"health":19,"enTitle":"Novices",leadership:undefined}
,{"name":"vestal","title":"Весталки","experience":108,"health":25,"enTitle":"Vestals",leadership:undefined}
,{"name":"griffin","title":"Грифоны света","experience":456,"health":75,"enTitle":"Tamed griffins",leadership:undefined}
,{"name":"igriffin","title":"Грифоны солнца","experience":588,"health":85,"enTitle":"Templar griffins",leadership:undefined}
,{"name":"radiantglory","title":"Сияние","experience":489,"health":65,"enTitle":"Blessed spirits",leadership:undefined}
,{"name":"blazingglory","title":"Лучезарное сияние","experience":170,"health":70,"enTitle":"Beaming spirits",leadership:undefined}
,{"name":"sunrider","title":"Всадники солнца","experience":489,"health":90,"enTitle":"Sun chargers",leadership:undefined}
,{"name":"suncrusader","title":"Крестоносцы солнца","experience":240,"health":95,"enTitle":"Champions",leadership:undefined}
,{"name":"celestial","title":"Небесные воители","experience":1956,"health":300,"enTitle":"Celestials",leadership:undefined}
,{"name":"seraph","title":"Серафимы","experience":800,"health":325,"enTitle":"Seraphs",leadership:undefined}

// Ангелы
,{ name: "valkyrie", title: "Валькирии", enTitle: "Valkyries", health: 61, experience: 120,leadership:506 }
,{ name: "gatekeeper", title: "Стражи поднебесья", enTitle: "Guardians of heaven", health: 120, experience: 120,leadership:739 }

// Драконы
,{ name: "mikrodragon", title: "Драконлинги", enTitle: "Dragonlings", health: 30, experience: 30,leadership:undefined }
,{"name":"minidragon","title":"Дрэйки","experience":60,"health":60,"canFly":true,"enTitle":"Drakes",leadership:598}
,{ name: "rustdragon", title: "Коррозийные драконы", enTitle: "Rust dragons", health: 750, experience: 1500, "canFly": true,leadership:undefined }
,{"name":"faeriedragon","title":"Волшебные драконы","experience":800,"health":500,"canFly":true,"enTitle":"Faerie dragons",leadership:undefined}
,{"name":"golddragon","title":"Золотые драконы","experience":400,"health":169,"canFly":true,"enTitle":"Gold dragons",leadership:4001}
,{"name":"azuredragon","title":"Лазурные драконы","experience":1500,"health":1000,"canFly":true,"enTitle":"Azure dragons",leadership:undefined}

// Пираты
,{"name":"apirate","title":"Корсары","experience":16,"health":13,"enTitle":"Corsairs",leadership:71}
,{"name":"bpirate","title":"Абордажники","experience":30,"health":16,"enTitle":"Pirate Fighters",leadership:76}
,{"name":"negro","title":"Матросы-чужеземцы","experience":24,"health":17,"enTitle":"Sailors-strangers",leadership:98}
,{"name":"spearthrower","title":"Прибрежные налётчики","experience":10,"health":19,"enTitle":"Coastal raiders","imageName":"jpirate",leadership:149}
,{"name":"piratka","title":"Пиратки","experience":20,"health":10,"enTitle":"Women pirates",leadership:107}
,{"name":"piratkaup","title":"Корсарки","experience":32,"health":12,"enTitle":"Women corsairs",leadership:178}
,{"name":"ppirate","title":"Морские волки","experience":45,"health":25,"enTitle":"Sea wolves",leadership:undefined}
,{"name":"ppirateup","title":"Одноногие пираты","experience":55,"health":30,"enTitle":"One-legged pirates",leadership:undefined}
,{"name":"shootpirate","title":"Буканиры","experience":45,"health":15,"enTitle":"Buccaneers",leadership:294}
,{"name":"shootpirateup","title":"Флибустьеры","experience":75,"health":18,"enTitle":"Flibustiers",leadership:287}
,{"name":"ocean","title":"Духи океана","experience":53,"health":30,"canFly":true,"enTitle":"Ocean spirits",leadership:272}
,{"name":"assida","title":"Ассиды","experience":53,"health":30,"canFly":true,"enTitle":"Ayssids",leadership:290}
,{ name: "bokopor", title: "Заклинатели штормов", enTitle: "Storm warlocks", health: 40, experience: 70,leadership:undefined }
,{"name":"fatpirate","title":"Толстяки","experience":180,"health":100,"enTitle":"Fatso",leadership:696}
,{"name":"fatpirateup","title":"Одноглазые пираты","experience":190,"health":120,"enTitle":"One-eyed pirates",leadership:665}
,{"name":"priestess","title":"Жрицы моря","experience":70,"health":35,"enTitle":"Sea priestesses",leadership:1069}
,{"name":"priestessup","title":"Ведьмы моря","experience":70,"health":35,"enTitle":"Sea witches",leadership:1150}
,{"name":"reptiloid","title":"Никсы","experience":110,"health":80,"enTitle":"Nixes",leadership:882}
,{"name":"reptiloidup","title":"Никсы-воины","experience":180,"health":90,"enTitle":"Nix warriors",leadership:undefined}
,{"name":"gnompirate","title":"Гном-капитан","experience":150,"health":100,"enTitle":"Gnom-captain",leadership:703}
,{"name":"piratemonster","title":"Морские дьяволы","experience":300,"health":190,"enTitle":"Sailors` devil",leadership:2315}
,{"name":"piratemonsterup","title":"Пираты Ктулху","experience":350,"health":200,"enTitle":"Pirates of Cthulhu",leadership:2424}

// Пираты-нежить
,{"name":"skeletonpirate","title":"Скелеты-пираты","experience":7,"health":4,"enTitle":"Skeletal pirates","imageName":"dpirate",leadership:17}
,{"name":"skeletonpirateup","title":"Скелеты-корсары","experience":10,"health":4,"enTitle":"Skeletal corsairs","imageName":"dpirateup",leadership:52}
,{"name":"cpirate","title":"Скелеты-моряки","experience":6,"health":4,"enTitle":"Skeleton sailor",leadership:25}
,{"name":"gpiratka","title":"Призраки пираток","experience":17,"health":8,"canFly":true,"enTitle":"Ghosts of pirates",leadership:undefined}
,{"name":"gpiratkaup","title":"Призраки корсарок","experience":40,"health":9,"canFly":true,"enTitle":"Spectres of corsairs",leadership:undefined}
,{"name":"drowned","title":"Утопленники","experience":20,"health":16,"enTitle":"Drowned men",leadership:50}
,{ name: "pushkar", title: "Утопшие канониры", enTitle: "Drowned gunners", health: 64, experience: 168,leadership:552 }
,{"name":"pushkarup","title":"Обречённые бомбардиры","experience":208,"health":76,"enTitle":"Doomed bombers",imageFullName:"pushkarupanip40",leadership:undefined}
,{"name":"zpirate","title":"Пираты зомби","experience":200,"health":150,"enTitle":"Zombie pirates",leadership:824}
,{ name: "zpirateup", title: "Могучие зомби", enTitle: "Mighty zombies", health: 170, experience: 301,leadership:undefined }
,{ name: "dleviathan", title: "Костяные левиафаны", enTitle: "Bone leviathans", health: 145, experience: 180,leadership:1896 }
,{ name: "dleviathanup", title: "Левиафаны погибели", enTitle: "Leviathans of doom", health: 175, experience: 220,leadership:undefined }

,{ name: "poukai", title: "Безглазые виверны", enTitle: "Eyeless wyverns", health: 120, experience: 200,leadership:872 }
,{ name: "goblinshaman", title: "Гоблины-шаманы", enTitle: "Goblin shamans", health: 5, experience: 10,leadership:154 }
,{ name: "ill", title: "Больные крестьяне", enTitle: "Ill peasants", health: 2, experience: 2,leadership:undefined }
,{ name: "elfhealer", title: "Эльфийские целительницы", enTitle: "Elvish healer", health: 7, experience: 15,leadership:undefined }

// Армия кошмаров
,{ name: "gop", title: "Карлики", enTitle: "Jack-o`-lantern", health: 20, experience: 50,leadership:undefined }
,{ name: "yaga", title: "Баба Яга", enTitle: "Yagas", health: 43, experience: 65,leadership:undefined }
,{ name: "scream", title: "Маньяки", enTitle: "Grim reapers", health: 33, experience: 40,leadership:undefined }
,{ name: "freddy", title: "Фредди", enTitle: "Sneaky horror", health: 44, experience: 100,leadership:undefined }
,{ name: "bonehydra", title: "Костяные гидры", enTitle: "Skeletal hydras", health: 60, experience: 120,leadership:undefined }
,{ name: "smert", title: "Смерть", enTitle: "Soul collector", health: 70, experience: 170,leadership:undefined }
,{ name: "pumkinhead", title: "Тыквоголовые", enTitle: "Pumkinheads", health: 111, experience: 150,leadership:undefined }
,{ name: "frankenstein", title: "Монстр франкенштейна", enTitle: "Frankenstein monsters", health: 530, experience: 250,leadership:undefined }

// Фермеры
,{ name: "lumberman", title: "Дровосеки", enTitle: "Lumbermen", health: 4, experience: 5,leadership:undefined }
,{ name: "peasantw", title: "Крестьянки", enTitle: "Peasant women", health: 3, experience: 3,leadership:undefined }
,{ name: "strashidlo", title: "Ходячие пугала", enTitle: "Mechanical scarecrows", health: 7, experience: 10,leadership:undefined }
,{"name":"hobbit","title":"Хоббиты","experience":8,"health":4,"enTitle":"Hobbits",leadership:55}

// Жители рощи
,{ name: "pegasus", title: "Пегасы", enTitle: "Pegasus", health: 30, experience: 45, canFly: true,leadership:170 }
,{"name":"spegasus","title":"Серебряные пегасы","experience":50,"health":30,"canFly":true,"enTitle":"Silver pegasus",leadership:241}
,{"name":"satyr","title":"Сатиры","experience":49,"health":36,"enTitle":"Satyrs",leadership:300}

// Альт фараона
,{"name":"scarabalt","title":"Сверкающие скарабеи","experience":11,"health":6,"enTitle":"Gleaming scarabs",leadership:undefined}
,{"name":"scorpalt","title":"Царские скорпионы","experience":9,"health":4,"enTitle":"Pharaoh scorpions",leadership:33}
,{"name":"duneraideralt","title":"Филакитаи","experience":24,"health":19,"enTitle":"Phylakites",leadership:undefined}
,{"name":"shakalalt","title":"Шакалы-пельтасты","experience":45,"health":24,"enTitle":"Jackal peltasts",leadership:215}
,{"name":"dromadalt","title":"Мехаристы","experience":70,"health":40,"enTitle":"Meharists",leadership:undefined}
,{"name":"zhricaalt","title":"Жрицы битвы","experience":70,"health":50,"enTitle":"Battle priestesses",leadership:1100}
,{"name":"slonalt","title":"Осадные слоны","experience":150,"health":100,"enTitle":"Siege elephants",leadership:undefined}
,{"name":"anubisalt","title":"Судьи Анубиса","experience":420,"health":210,"enTitle":"Judges of Anubis",leadership:undefined}

// Строения
,{"name":"archtower","title":"Башня лучников","experience":0,"health":0,"enTitle":"Archer tower", isBuilding: true,leadership:undefined}
,{"name":"towerwall","title":"Башня лучников","experience":0,"health":0,"enTitle":"Archer tower", isBuilding: true,leadership:undefined}
,{"name":"bigtower","title":"Основная башня","experience":0,"health":0,"enTitle":"Main tower", isBuilding: true,leadership:undefined}//?
,{"name":"witchhouse","title":"Дом","experience":0,"health":0,"enTitle":"House", isBuilding: true,leadership:undefined}
,{"name":"sklep","title":"Склеп","experience":0,"health":0,"enTitle":"Crypt", isBuilding: true,leadership:undefined}
,{ name: "sarkofag", title: "Саркофаг", enTitle: "Sarcophagus", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{"name":"grob1","title":"Могила","experience":0,"health":0,"enTitle":"Grave", isBuilding: true,leadership:undefined}
,{ name: "grob2", title: "Могила", enTitle: "Grave", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "logovo1", title: "Логово бандитов", enTitle: "Bandits lair", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{"name":"logovo2","title":"Логово бандитов","experience":0,"health":0,"enTitle":"Bandits lair", isBuilding: true,leadership:undefined}
,{"name":"logovo3","title":"Логово бандитов","experience":0,"health":0,"enTitle":"Bandits lair", isBuilding: true,leadership:undefined}
,{"name":"logovo4","title":"Повозка бандитов","experience":0,"health":0,"enTitle":"Bandits wagon", isBuilding: true,leadership:undefined}
,{"name":"sbor1","title":"Завод механиков","experience":0,"health":0,"enTitle":"Mechanics factory", isBuilding: true,leadership:undefined}
,{ name: "fabrik", title: "Фабрика големов", enTitle: "Golem factory", health: 0, experience: 0, isBuilding: true,leadership:undefined}
,{"name":"hellgate","title":"Врата ада","experience":0,"health":0,"enTitle":"Hell gate", isBuilding: true,leadership:undefined}
,{"name":"brevno","title":"Бревно","experience":0,"health":0,"enTitle":"Log", isBuilding: true,leadership:undefined}
,{ name: "castertower", title: "Башня магов", enTitle: "Mage tower", health: 10, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "lamp", title: "Лампа джиннов", enTitle: "Лампа джиннов", health: 0, experience: 0, isBuilding: true }
,{ name: "derevo", title: "Дерево", enTitle: "Tree", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "vdutl", title: "Нора", enTitle: "Den", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "cmajak", title: "Кристальный маяк", enTitle: "Crystal beacon", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "elspawn", title: "Стихийное средоточие", enTitle: "Elemental focus", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "house1", title: "Дом", enTitle: "House", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "house2", title: "Дом", enTitle: "House", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "house3", title: "Дом", enTitle: "House", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "yurt", title: "Степной форт", enTitle: "Steppe fort", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "gnh2", title: "Хижина гноллов", enTitle: "Gnoll hut", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "gnh3", title: "Хижина гноллов", enTitle: "Gnoll hut", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "sknor", title: "Песчаное логово", enTitle: "Sand lair", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "gnh1", title: "Хижина гноллов", enTitle: "Gnoll hut", health: 0, experience: 0, isBuilding: true,leadership:undefined }
,{ name: "ballista", title: "Баллиста", enTitle: "Carroballista", health: 0, experience: 0, isBuilding: true }
,{ name: "imp_tent1", title: "Имперская палатка", enTitle: "Imperial tent", health: 0, experience: 0, isBuilding: true }
,{ name: "imp_tent2", title: "Имперская палатка", enTitle: "Imperial tent", health: 0, experience: 0, isBuilding: true }
];

// 0-id, 1-castle, 2-tier, 3-attack, 4-defense, 5-minDamage, 6-maxDamage, 7-health, 8-speed, 9-shots, 10-mana, 11-range, 12-initiative, 13-leadership, 14-abilities
const monsterParametersList = [[" Бобёр (Существо 7 уровня)",61,7,75,75,19,24,3750,5,0,0,0,10,0,["Механизм","Иммунитет к замедлению","Жестокость"]]
,[" Хомяк (Существо 7 уровня)",61,7,100,100,5,10,10000,4,0,0,0,10,0,["Живой","Большое существо","Большой щит","Иммунитет к замедлению"]]
,["acrossbowman",78,2,6,7,12,19,24,3,12,0,0,8,206,["Живой","Стрелок","Точный выстрел","Броня"]]
,["adeptus",53,5,14,10,11,11,46,5,6,0,0,11,0,["Живой","Стрелок","Колдун","Знак Огня","Извращенный разум"]]
,["air",68,4,8,6,5,7,30,8,0,0,0,17,258,["Летающее существо","Элементаль","Враг не сопротивляется","Иммунитет к воздуху"]]
,["alchemist",57,5,20,14,6,8,60,4,0,32,0,11,0,["Колдун","Защитная оболочка"]]
,["alchemistup",57,5,21,18,7,9,68,4,0,32,0,11,0,["Колдун","Защитная оболочка","Аура совершенства"]]
,["ambal",63,6,35,22,22,35,100,6,0,0,0,12,0,["Живой","Сопротивление магии 50%","Разящий меч","Аура храбрости","Присутствие командира"]]
,["amummy",56,5,10,20,16,20,80,4,0,0,0,11,0,["Нежить","Колдун","Песнь времён"]]
,["ancienent",4,6,19,29,10,20,181,6,0,0,0,7,1359,["Живой","Большое существо","Ярость","Оплетающие корни","Укоренение"]]
,["ancientbehemoth",5,7,33,25,30,50,250,5,0,0,0,9,2796,["Живой","Большое существо","Игнорирование защиты 60%"]]
,["ancientpig",59,3,7,4,5,5,15,7,0,0,0,11,100,["Живой","Большое существо","Игнорирование защиты 20%","Разбег"]]
,["angel",1,7,27,27,45,45,180,6,0,0,0,11,1890,["Живой","Большое существо","Летающее существо"]]
,["ant",59,4,9,4,3,5,27,7,0,0,0,13,0,["Живой","Животный яд","Паралич"]]
,["anubis",10,7,22,14,30,40,160,6,1,0,0,12,1960,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Иммунитет к влиянию на разум","Непробиваемость огнем 25%","Личинки скарабеев"]]
,["anubisalt",10,7,30,25,37,51,210,7,0,0,0,13,2302,["Живой","Большое существо","Летающее существо","Непробиваемость огнем 25%","Непорочность","Приговор","Личинки сверкающих скарабеев"]]
,["anubisup",10,7,28,22,35,45,200,7,2,0,0,13,2302,["Живой","Стрелок","Большое существо","Летающее существо","Нет штрафов в ближнем бою","Смертоносное облако","Телепортация","Иммунитет к влиянию на разум","Непробиваемость огнем 25%","Личинки священных скарабеев"]]
,["apirate",51,1,5,1,4,7,13,4,0,0,0,10,70,["Живой","Колун","Скрытый","Пират"]]
,["arcaneelf",104,3,6,5,7,8,12,5,16,0,0,11,306,["Живой","Стрелок","Стрельба без штрафов","Усиленная стрела"]]
,["archangel",1,7,31,31,50,50,220,8,0,0,0,11,3994,["Живой","Большое существо","Летающее существо","Воскрешение"]]
,["archdemon",107,7,32,31,33,66,211,6,0,0,0,10,2850,["Живой","Большое существо","Летающее существо","Демоническое существо","Телепортация","Телепортация других"]]
,["archdevil",7,7,32,29,36,66,199,7,0,0,0,11,2512,["Живой","Большое существо","Летающее существо","Демоническое существо","Телепортация","Призыв пещерных владык"]]
,["archer",1,2,4,3,2,4,7,4,10,0,0,9,72,["Живой","Стрелок","Стрельба навесом"]]
,["archlich",2,5,19,19,17,20,55,3,6,0,0,10,797,["Нежить","Стрелок","Большое существо","Колдун","Смертоносное облако"]]
,["archmage",3,4,10,10,7,7,30,4,4,0,0,10,526,["Живой","Стрелок","Магический выстрел","Стрельба без штрафов","Колдун","Энергетический канал"]]
,["armorgnom",56,5,8,15,7,11,55,4,0,0,0,9,308,["Живой","Защита союзников","Броня","Защита от стрел","Надзор"]]
,["assassin",6,1,4,3,2,4,14,5,5,0,0,12,135,["Живой","Стрелок","Нет штрафов в ближнем бою","Штраф за стрельбу","Отравляющий удар"]]
,["assida",51,4,11,8,6,10,30,9,0,0,0,11,303,["Живой","Летающее существо","Жажда крови","Сопротивление магии 50%","Стремительная атака","Ледяное дыхание"]]
,["axegnom",56,1,5,2,2,3,10,5,0,0,0,9,47,["Живой","Ярость","Игнорирование защиты 10%"]]
,["azuredragon",71,9,60,60,78,112,1000,19,0,0,0,14,0,["Живой","Большое существо","Летающее существо","Атака страхом","Огненное дыхание","Скрытый"]]
,["banditka",63,1,5,2,1,3,8,6,0,0,0,11,62,["Живой","Отравляющий удар","Ловкость"]]
,["banditkaup",63,1,6,4,1,3,9,7,0,0,0,12,0,["Живой","Отравляющий удар","Колун","Ловкость"]]
,["banshee",102,6,23,23,22,27,110,6,0,0,0,11,905,["Нежить","Большое существо","Скорбный вопль"]]
,["barb",60,"?",7,3,8,10,45,3,4,0,0,8,0,["Живой","Стрелок","Нет штрафов в ближнем бою"]]
,["basilisk",56,1,11,11,6,10,35,5,0,0,0,12,0,["Живой","Большое существо","Окаменение"]]
,["basiliskup",56,1,12,12,6,10,40,7,0,0,0,13,0,["Живой","Большое существо","Окаменение","Каменный сад",""]]
,["battlegriffin",56,4,7,12,7,15,35,9,0,0,0,16,353,["Живой","Большое существо","Летающее существо","Бесконечный отпор","Иммунитет к ослеплению"]]
,["battlegriffon",101,4,7,12,6,12,52,7,0,0,0,10,296,["Живой","Большое существо","Летающее существо","Бесконечный отпор","Иммунитет к ослеплению","Боевые рефлексы","Губительное пике"]]
,["battlemage",103,4,12,9,7,7,29,4,6,0,0,10,457,["Живой","Стрелок","Магический выстрел","Стрельба без штрафов","Колдун","Приглушение магии"]]
,["battlerager",108,4,7,7,3,7,30,5,0,0,0,11,180,["Живой","Оглушающий удар","Иммунитет к влиянию на разум","Победитель гигантов","Боевая ярость"]]
,["bear",59,3,8,6,3,5,22,5,0,0,0,10,106,["Живой","Большое существо","Ярость","Удар лапой"]]
,["bearrider",8,3,5,10,4,5,25,6,0,0,0,10,119,["Живой","Большое существо","Ярость"]]
,["behemoth",5,7,30,22,30,50,210,5,0,0,0,9,1708,["Живой","Большое существо","Игнорирование защиты 40%"]]
,["beholder",54,3,9,7,3,5,22,5,12,0,0,10,0,["Живой","Стрелок","Ярость","Нет штрафов в ближнем бою"]]
,["berserker",8,4,7,7,3,8,25,5,0,0,0,12,130,["Живой","Иммунитет к влиянию на разум","Ярость берсерка"]]
,["bigspider",54,4,14,9,9,14,55,6,0,0,0,10,278,["Живой","Большое существо","Оцепенение"]]
,["blackarcher",66,1,9,6,4,6,13,4,10,0,0,10,0,["Нежить","Стрелок","Пелена тьмы"]]
,["blackbearrider",8,3,6,14,5,6,30,7,0,0,0,11,175,["Живой","Большое существо","Ярость","Броня","Удар лапой"]]
,["blackdragon",6,7,30,30,45,70,240,9,0,0,0,10,4029,["Живой","Большое существо","Летающее существо","Огненное дыхание","Невосприимчивость магии"]]
,["blackfootman",66,1,11,11,5,7,25,5,0,0,0,10,0,["Нежить","Большой щит","Стена из щитов","Ни шагу назад","Устойчивость к проклятиям"]]
,["blackknight",66,6,23,23,25,35,90,7,0,0,0,10,0,["Нежить","Большое существо","Наложение проклятия"]]
,["blackmage",66,1,8,6,4,5,20,4,10,0,0,12,0,["Нежить","Стрелок","Колдун","Колдовской дар"]]
,["blackptic",66,5,14,10,12,15,70,7,0,0,0,12,0,["Нежить","Большое существо","Летающее существо","Ненависть к живым","Падальщик"]]
,["blacktroll",54,6,27,25,20,27,180,6,0,0,0,10,1311,["Живой","Большое существо","Большой щит","Жажда крови","Сопротивление магии 25%"]]
,["blackwidow",56,2,6,2,4,7,14,7,0,0,0,16,293,["Живой","Стрелок","Враг не сопротивляется","Теневая атака"]]
,["blazingglory",58,6,17,14,15,18,70,6,0,0,0,15,0,["Летающее существо","Враг не сопротивляется","Удар и возврат","Телепортация","Скорость света","Очищающий свет","Уязвимость к магии Тьмы","Дух"]]
,["bloodeyecyc",109,7,28,28,35,50,235,6,0,0,0,10,2408,["Живой","Большое существо","Штраф за стрельбу","Бурлящая кровь","Пожирание гоблинов","Метание гоблинов","Сглаз"]]
,["bloodsister",106,2,5,4,4,6,24,8,0,0,0,14,232,["Живой","Враг не сопротивляется","Удар и возврат","Иммунитет к ослаблению"]]
,["blud",106,1,4,1,1,2,7,5,0,0,0,11,29,["Враг не сопротивляется","Похищение Света"]]
,["boar",59,3,5,3,3,4,17,6,0,0,0,10,86,["Живой","Большое существо","Жажда крови","Разбег"]]
,["boarrider",105,2,6,5,4,6,14,7,0,0,0,10,85,["Живой","Большое существо","Игнорирование защиты 20%"]]
,["bobbit",63,1,5,2,2,3,6,5,16,0,0,10,57,["Живой","Стрелок","Убийца гигантов"]]
// 0-id, 1-castle, 2-tier, 3-attack, 4-defense, 5-minDamage, 6-maxDamage, 7-health, 8-speed, 9-shots, 10-mana, 11-range, 12-initiative, 13-leadership, 14-abilities
,["bokopor",63,4,14,9,9,13,40,4,0,12,0,11,0,["Колдун","Пират","Повелитель огня 10%","Повелитель бурь 10%"]]
,["boletus",62,1,5,2,1,3,17,7,0,0,0,9,0,["Живой","Летающее существо","Окопаться","Взрыв спор"]]
,["bonedragon",2,7,27,28,15,30,150,6,0,0,0,11,1344,["Нежить","Большое существо","Летающее существо"]]
,["bonehydra",56,5,13,13,6,13,60,5,0,0,0,8,0,["Нежить","Большое существо","Ярость","Враг не сопротивляется","Удар тремя головами"]]
,["bonelizard",56,4,9,5,5,8,30,7,0,0,0,11,0,["Нежить","Большое существо","Укус ящера"]]
,["bpirate",51,1,5,3,4,7,16,3,0,0,0,10,82,["Живой","Прыжок","Скрытый","Пират"]]
,["brawler",8,4,6,6,2,6,20,5,0,0,0,12,92,["Живой","Иммунитет к влиянию на разум"]]
,["breeder",52,5,13,11,13,16,70,5,10,0,0,10,0,["Живой","Стрелок","Большое существо","Огнеупорная кожа","Уязвимость к Свету","Поглощение маны"]]
,["brigand",63,1,3,1,1,3,5,5,0,0,0,9,29,["Живой","Жестокость"]]
,["brigandup",63,1,4,4,2,3,6,5,0,0,0,9,35,["Живой","Жажда крови","Чрезмерная жестокость"]]
,["briskrider",106,4,10,8,7,12,50,6,0,0,0,12,352,["Живой","Большое существо","Удар с разбега","Укус ящера","Попутная атака"]]
,["brute",101,1,2,2,1,2,8,4,0,0,0,8,32,["Живой","Штурм"]]
,["buffalo",59,6,30,10,25,35,120,6,0,0,0,11,0,["Живой","Большое существо","Ярость","Жажда крови"]]
,["burbuly",68,3,12,11,4,7,30,6,0,0,0,11,0,["Летающее существо","Элементаль","Жажда крови","Защита от стрел","Упорство"]]
,["cavalier",1,6,23,21,20,30,90,7,0,0,0,11,947,["Живой","Большое существо","Рыцарский разбег"]]
,["cbal",63,5,17,10,10,16,65,3,15,0,0,9,460,["Живой","Стрелок","Большое существо","Усиленная стрела"]]
,["celestial",58,7,47,37,51,52,300,6,0,0,0,12,0,["Живой","Большое существо","Летающее существо","Клинок воздаяния","Клинок милосердия"]]
,["centaur6",70,6,9,8,14,16,70,6,10,0,0,13,0,["Живой","Стрелок","Большое существо","Стрельба без штрафов","Маневрирование","Бдительность"]]
,["cerber",52,2,8,4,5,10,28,7,0,0,0,10,0,["Живой","Большое существо","Бесконечный отпор","Огнеупорная кожа","Уязвимость к Свету","Голодный взгляд","Прожорливость"]]
,["cerberus",7,3,4,2,4,6,15,8,0,0,0,13,157,["Живой","Враг не сопротивляется","Удар тремя головами","Демоническое существо"]]
,["champion",101,6,24,20,20,35,100,8,0,0,0,12,1400,["Живой","Большое существо","Рыцарский разбег","Турнирный удар"]]
,["charmer",63,2,7,2,4,5,9,4,0,0,0,12,0,["Живой","Бесконечный отпор","Враг не сопротивляется","Отравляющий удар","Змеиные рефлексы","Незащищённая цель"]]
,["charmerup",63,2,8,3,4,6,10,4,0,0,0,13,0,["Живой","Бесконечный отпор","Враг не сопротивляется","Отравляющий удар","Змеиные рефлексы","Незащищённая цель","Удар без предупреждения"]]
,["chieftain",109,5,13,15,10,12,48,7,0,0,0,12,867,["Живой","Бурлящая кровь","Присутствие командира","Приказ вожака"]]
,["chuvak",55,2,6,6,4,8,27,4,0,0,0,8,0,["Живой","Ярость","Сопротивление магии 10%","Иммунитет к холоду"]]
,["chuvakup",55,2,8,8,5,8,33,5,0,0,0,8,0,["Живой","Ярость","Сопротивление магии 20%","Иммунитет к холоду","Ледяное касание"]]
,["cman",58,2,4,4,2,4,22,6,10,0,0,9,0,["Живой","Стрелок","Стрельба без штрафов","Бронебойный выстрел"]]
,["colossus",3,7,27,27,40,70,175,6,0,0,0,10,2006,["Живой","Большое существо","Иммунитет к влиянию на разум"]]
,["conscript",1,1,1,1,1,2,6,4,0,0,0,8,24,["Живой","Оглушающий удар"]]
,["coralp",76,3,5,3,3,5,18,5,10,0,0,10,0,["Живой","Стрелок","Стрельба без штрафов","Амфибия","Волны обновления","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["cpirate",79,1,3,1,1,2,4,5,0,0,0,11,26,["Нежить","Ярость","Колун","Пират"]]
,["crossman",101,2,5,4,2,8,8,4,10,0,0,8,98,["Живой","Стрелок","Стрельба без штрафов"]]
,["crusader",78,3,10,10,3,6,30,5,0,0,0,9,160,["Живой","Большой щит","Двойной удар","Уничтожитель нежити"]]
,["crusher6",70,2,5,5,4,8,36,6,0,0,0,9,0,["Живой","Двойной удар","Защита от стрел","Вкус крови","Демоническая кровь"]]
,["crystaldragon",104,7,30,26,30,60,200,9,0,0,0,14,4036,["Живой","Большое существо","Летающее существо","Призменное дыхание"]]
,["cursed",56,3,8,7,4,6,20,5,0,0,0,11,199,["Нежить","Летающее существо","Бестелесное существо","Осушение","Дух"]]
,["cursedbehemoth",205,7,33,26,35,50,250,6,0,0,0,9,3363,["Живой","Большое существо","Игнорирование защиты 40%","Аура страха"]]
,["cursedent",56,6,24,23,15,27,215,6,0,0,0,9,1368,["Живой","Большое существо","Ослабляющий удар","Аура страха"]]
,["cyclop",5,6,20,15,18,26,85,4,6,0,0,10,1060,["Живой","Стрелок"]]
,["cyclop6",70,7,26,24,57,65,330,7,0,0,0,10,0,["Живой","Большое существо","Демоническая кровь","Нечувствительность","Сильный удар"]]
,["cyclopking",5,6,23,18,19,28,95,5,8,0,0,10,984,["Живой","Стрелок","Осада стен"]]
,["cyclopod",105,6,25,17,20,26,100,4,10,0,0,10,1224,["Живой","Стрелок","Оглушающий выстрел"]]
,["cyclopus",9,7,29,27,40,52,220,5,0,0,0,9,2038,["Живой","Большое существо","Бурлящая кровь","Пожирание гоблинов"]]
,["dancer",4,2,3,2,2,5,12,6,0,0,0,11,71,["Живой"]]
,["darkbird",205,5,16,10,11,15,60,8,0,0,0,13,555,["Живой","Большое существо","Летающее существо","Покров тьмы"]]
,["darkelf",60,"?",4,4,8,10,41,3,0,0,0,8,0,["Живой","Колдун"]]
,["darkeye",54,3,9,9,3,5,26,6,24,0,0,10,0,["Живой","Стрелок","Ярость","Нет штрафов в ближнем бою","Покров тьмы"]]
,["darkon",60,0,6,6,8,11,70,4,4,0,0,8,0,["Нежить","Стрелок","Колдун","Нет штрафов в ближнем бою"]]
,["darkrider",6,4,9,7,7,12,40,6,0,0,0,11,277,["Живой","Большое существо","Удар с разбега"]]
,["dbehemoth",105,1,35,25,35,45,280,5,0,0,0,9,2679,["Живой","Большое существо","Игнорирование защиты 40%","Ужасная рана"]]
,["ddhigh",104,4,12,8,10,14,34,4,7,0,0,10,421,["Живой","Стрелок","Колдун","Канал"]]
,["deadarcher",66,1,10,7,5,7,16,4,12,0,0,11,0,["Нежить","Стрелок","Пелена тьмы","Тёмный выстрел"]]
,["deadfootman",66,1,13,13,6,9,30,5,0,0,0,11,0,["Нежить","Большой щит","Стена из щитов","Ни шагу назад","Устойчивость к проклятиям","Аура тёмного сопротивления"]]
,["deadknight",66,6,26,26,28,38,100,8,0,0,0,10,0,["Нежить","Большое существо","Наложение проклятия","Смертельная атака"]]
,["deadmage",66,1,10,7,6,7,27,4,10,0,0,12,0,["Нежить","Стрелок","Колдун","Колдовской дар"]]
,["deadptic",66,5,16,12,14,17,82,7,0,0,0,13,0,["Нежить","Большое существо","Летающее существо","Ненависть к живым","Падальщик"]]
,["deephydra",6,5,15,15,9,14,125,5,0,0,0,7,617,["Живой","Большое существо","Ярость","Враг не сопротивляется","Регенерация","Удар шестью головами"]]
,["defender",8,1,1,4,1,1,7,4,0,0,0,9,29,["Живой","Ярость","Большой щит","Броня"]]
,["demented",52,1,9,5,4,8,28,5,0,0,0,10,0,["Живой","Извращенный разум","Огнеупорная кожа","Уязвимость к Свету","Безумный смех"]]
,["demoniac",53,1,3,1,1,2,5,5,0,0,0,12,0,["Живой","Жажда крови"]]
,["deserter",63,3,6,8,3,5,25,4,0,0,0,9,0,["Живой","Аморальность","Побег"]]
,["deserterup",63,3,8,11,4,7,30,5,0,0,0,9,0,["Живой","Большой щит","Аморальность","Побег"]]
,["devil",7,7,27,25,36,66,166,7,0,0,0,11,2011,["Живой","Большое существо","Летающее существо","Демоническое существо","Телепортация"]]
,["dgolem",66,7,25,40,40,60,350,5,1,0,0,10,0,["Нежить","Стрелок","Большое существо","Нет штрафов в ближнем бою","Сопротивление магии 40%"]]
,["dgolemup",66,7,30,50,50,70,400,5,2,0,0,10,0,["Нежить","Стрелок","Большое существо","Нет штрафов в ближнем бою","Сопротивление магии 50%","Атака страхом","Аура страха"]]
,["diamondgolem",56,5,13,12,10,14,60,4,0,0,0,9,284,["Элементаль","Сопротивление магии 95%","Алмазная броня"]]
,["djinn",3,5,11,10,12,14,40,7,0,0,0,12,375,["Живой","Большое существо","Летающее существо","Колдун","Случайное заклинание тьмы"]]
,["djinn_sultan",3,5,14,14,14,19,45,8,0,0,0,12,805,["Живой","Большое существо","Летающее существо","Колдун","Сопротивление магии 50%","Случайное заклинание тьмы","Случайное заклятие тьмы и света"]]
,["djinn_vizier",103,5,13,13,14,19,50,8,0,0,0,12,409,["Живой","Большое существо","Летающее существо","Сопротивление магии 25%","Иммунитет к воздуху","Колесо удачи"]]
,["djinna",60,"?",4,4,8,10,48,3,4,0,0,8,0,["Живой","Стрелок","Летающее существо","Колдун","Штраф за стрельбу"]]
,["dragonfly",56,1,8,10,2,5,20,11,0,0,0,16,0,["Живой","Летающее существо","Наложение проклятия","Очищение"]]
,["drakonid",53,7,33,36,29,49,160,7,0,0,0,13,0,["Живой","Летающее существо","Демоническое существо","Аура страха","Ослепление","Дух"]]
,["dreamreaver6",70,6,12,11,15,19,100,6,0,0,0,10,0,["Живой","Колдун","Демоническая кровь"]]
,["dreamwalker6",70,6,11,10,13,15,85,6,0,0,0,9,0,["Живой","Колдун","Демоническая кровь"]]
,["dromad",10,4,12,6,7,10,40,4,0,0,0,10,212,["Живой","Большое существо","Непробиваемость огнем 25%","Выносливость"]]
,["dromadalt",10,4,12,6,7,10,40,4,5,0,0,10,0,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Штраф за стрельбу","Игнорирование защиты 10%","Непробиваемость огнем 25%","Расторопность","Выносливость","Быстрая стрельба"]]
,["dromadup",10,4,12,8,8,11,45,4,0,0,0,11,261,["Живой","Большое существо","Игнорирование защиты 30%","Непробиваемость огнем 25%","Выносливость"]]
,["drowned",79,2,5,4,2,3,16,5,0,0,0,7,0,["Нежить","Летающее существо","Телепортация","Пират"]]
,["druid",4,4,7,7,7,9,34,5,5,0,0,10,535,["Живой","Стрелок","Колдун"]]
,["druideld",4,4,12,9,9,14,38,4,7,0,0,10,539,["Живой","Стрелок","Колдун","Передача маны"]]
,["dryad",104,1,2,1,2,3,6,7,0,0,0,14,50,["Живой","Летающее существо","Враг не сопротивляется","Убийственные брызги","Симбиоз"]]
,["duneraider",10,2,4,8,3,5,12,5,8,0,0,9,94,["Живой","Стрелок","Непробиваемость огнем 25%","Хамелеон"]]
,["duneraideralt",10,2,7,15,5,7,19,6,0,0,0,12,0,["Непробиваемость огнем 25%","Надзор","Хамелеон","Эксперт по ловушкам","Внимательный",""]]
,["duneraiderup",10,2,6,9,4,6,12,6,10,0,0,10,134,["Живой","Стрелок","Враг не сопротивляется","Непробиваемость огнем 25%","Хамелеон"]]
,["eadaughter",109,4,10,7,7,11,35,5,0,0,0,12,693,["Живой","Колдун","Колдовской удар","Бурлящая кровь","Жертвоприношение гоблинами","Стремительная атака"]]
,["earth",68,4,8,11,10,14,75,5,0,0,0,6,363,["Элементаль","Бесконечный отпор","Сопротивление магии 50%","Иммунитет к магии земли"]]
,["ecyclop6",70,7,26,24,57,65,360,7,12,0,0,11,0,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Демоническая кровь","Нечувствительность","Могучий удар","Испепеляющая ярость"]]
,["efreeti",53,6,25,22,16,24,90,6,0,0,0,12,0,["Живой","Большое существо","Летающее существо","Колдун","Иммунитет к огню","Демоническое существо"]]
,["efreetisultan",53,6,26,24,16,24,100,7,0,0,0,12,0,["Живой","Большое существо","Летающее существо","Колдун","Иммунитет к огню","Демоническое существо","Огненный щит"]]
,["elephant",59,6,20,20,10,20,200,5,0,0,0,9,0,["Живой","Большое существо"]]
,["elf",4,3,4,1,4,7,10,5,12,0,0,10,160,["Живой","Стрелок","Двойной выстрел"]]
,["elfhealer",56,1,1,5,1,3,7,4,0,0,0,11,0,["Живой","Исцеление (12)"]]
,["elfik",60,"?",4,4,8,10,37,4,4,0,0,8,0,["Живой","Стрелок","Колдун"]]
,["elgargoly",103,2,4,4,2,3,16,7,0,0,0,11,74,["Летающее существо","Ярость","Элементаль","Аура уязвимости к огню","Аура уязвимости к воде","Аура уязвимости к воздуху"]]
,["emeralddragon",4,7,31,27,33,57,200,9,0,0,0,14,3489,["Живой","Большое существо","Летающее существо","Иммунитет к магии земли","Кислотное дыхание"]]
,["enforcer",56,1,3,2,1,3,7,5,0,0,0,8,33,["Живой","Оглушающий удар","Атака стаей"]]
,["evileye",54,3,10,8,3,5,22,7,24,0,0,10,0,["Живой","Стрелок","Ярость","Нет штрафов в ближнем бою","Останавливающий выстрел"]]
,["eviltiger2022",77,2022,22,22,7,12,122,7,0,0,0,12,0,["Живой","Большое существо","Ярость","Храбрость","Калечащее ранение","Кошачьи рефлексы"]]
,["executioner",9,5,14,10,8,12,40,7,0,0,0,12,336,["Живой","Храбрость","Аура страха","Колун","Бурлящая кровь"]]
,["exile",63,4,12,10,6,8,28,4,15,0,0,10,404,["Живой","Стрелок","Стрельба без штрафов","Колдун","Ответный выстрел","Запретные чары"]]
,["faeriedragon",71,7,20,30,20,30,500,8,0,0,0,11,0,["Живой","Большое существо","Летающее существо","Колдун","Сопротивление магии 50%","Огненное дыхание","Волшебное зеркало"]]
,["familiar",7,1,3,2,2,3,6,5,0,0,0,13,36,["Живой","Демоническое существо","Крадущий ману"]]
,["fatespinner",65,7,32,30,47,52,280,5,10,0,0,10,0,["Нежить","Большое существо","Дух","Уязвимость к Свету","Скрытый","Два облика","Гибельный взгляд"]]
,["fatpirate",51,5,20,10,15,25,100,4,0,0,0,9,682,["Живой","Большое существо","Сильный удар","Скрытый","Пират"]]
,["fatpirateup",51,5,23,15,18,29,120,4,0,0,0,9,706,["Живой","Большое существо","Могучий удар","Скрытый","Пират"]]
,["fcentaur",9,2,3,1,2,4,6,5,8,0,0,11,54,["Живой","Стрелок","Большое существо","Бурлящая кровь","Маневрирование"]]
,["fire",68,4,10,5,11,20,43,6,50,0,0,8,475,["Стрелок","Элементаль","Иммунитет к огню","Огненный щит"]]
,["firebird",105,5,22,12,12,16,65,8,0,0,0,12,619,["Живой","Большое существо","Летающее существо","Переносчик","Иммунитет к огню","Атака огнем"]]
,["firedragon",8,7,25,35,40,50,230,5,0,0,0,9,2304,["Большое существо","Элементаль","Иммунитет к огню","Огненное дыхание","Огненный щит"]]
,["flake",55,1,5,2,2,3,10,7,0,0,0,11,0,["Летающее существо","Элементаль","Враг не сопротивляется","Убийственные брызги","Иммунитет к холоду"]]
,["flamelord",108,6,15,25,21,26,120,8,0,0,0,11,1393,["Живой","Большое существо","Летающее существо","Иммунитет к огню","Телепортация","Волна огня","Удар пламенем"]]
,["footman",1,3,4,8,2,4,16,4,0,0,0,8,79,["Живой","Ярость","Большой щит","Оглушающий удар"]]
,["forestspirit",59,5,15,15,12,16,50,9,0,0,0,12,0,["Летающее существо","Враг не сопротивляется","Удар и возврат","Телепортация","Скорость света","Дух"]]
,["foulhydra",106,5,15,14,9,12,125,5,0,0,0,8,633,["Живой","Большое существо","Ярость","Враг не сопротивляется","Удар шестью головами","Кислотная кровь"]]
,["foulwyvern",9,6,21,18,20,27,105,7,0,0,0,10,951,["Живой","Большое существо","Летающее существо","Регенерация","Животный яд"]]
,["frankenstein",56,7,30,31,31,60,530,4,0,0,0,7,0,["Нежить","Оглушающий удар","Иммунитет к замедлению"]]
,["freddy",56,4,14,14,9,14,44,5,0,0,0,11,0,["Нежить","Осушение","Атака страхом"]]
,["fungus",62,3,3,5,2,4,29,4,0,0,0,10,0,["Живой","Колдун","Пожиратель маны","Прикосновение времени","Окопаться"]]
,["fury",6,2,5,3,5,7,16,8,0,0,0,16,213,["Живой","Враг не сопротивляется","Удар и возврат"]]
,["fury6",70,3,5,4,5,8,33,7,0,0,0,13,0,["Живой","Летающее существо","Враг не сопротивляется","Удар и возврат"]]
,["gatekeeper",64,6,17,20,16,30,120,6,0,0,0,10,739,["Живой","Летающее существо","Сопротивление магии 50%","Защита союзников","Защита от стрел"]]
,["gekkon",56,1,4,4,2,3,11,5,10,0,0,14,0,["Живой","Стрелок","Нет штрафов в ближнем бою","Штраф за стрельбу","Отравляющий удар"]]
,["gekkonup",56,1,5,7,2,3,21,5,12,0,0,14,0,["Живой","Стрелок","Нет штрафов в ближнем бою","Штраф за стрельбу","Животный яд"]]
,["ghost",2,3,4,4,3,7,8,5,0,0,0,10,86,["Нежить","Летающее существо","Бестелесное существо"]]
,["ghost6",65,3,7,6,3,7,21,5,0,0,0,8,0,["Нежить","Летающее существо","Уязвимость к Свету","Скрытый","Загробный вопль","Нематериальность"]]
,["ghostdragon",102,7,31,27,27,36,150,7,0,0,0,11,1524,["Нежить","Большое существо","Летающее существо","Удар скорби"]]
,["ghostshaman",61,7,14,11,95,150,200,6,0,0,0,10,0,["Нежить","Летающее существо","Игнорирование защиты 20%","Дух","Нематериальность"]]
,["ghoul",65,3,7,6,5,7,25,5,0,0,0,8,0,["Нежить","Уязвимость к Свету","Скрытый","Мертвая плоть"]]
,["giant",63,6,30,18,17,25,100,6,0,0,0,11,949,["Живой","Большое существо","Жажда крови","Могучий удар"]]
,["giantarch",63,6,30,16,12,22,100,5,6,0,0,11,1306,["Живой","Стрелок","Большое существо","Стрельба без штрафов","Жажда крови"]]
,["gladiator",61,3,4,1,1,4,25,6,1,0,0,10,0,["Живой","Стрелок","Нет штрафов в ближнем бою","Штраф за стрельбу","Метающий сеть"]]
,["gladiatorup",61,3,5,2,1,4,27,6,1,0,0,10,0,["Живой","Стрелок","Нет штрафов в ближнем бою","Штраф за стрельбу","Метающий цепи"]]
,["gnoll",74,1,3,5,2,3,6,4,0,0,0,10,47,["Живой","Сила стаи","Налёт стаи"]]
,["gnollboss",74,3,9,14,6,9,36,5,0,0,0,10,184,["Живой","Большое существо","Сила стаи","Налёт стаи","Вожак стаи","Широкий взмах"]]
,["gnollka",74,1,3,5,2,3,6,6,0,0,0,10,47,["Живой","Сила стаи","Налёт стаи","Месть стаи"]]
,["gnollsh",74,1,1,3,1,2,6,4,0,0,0,10,572,["Живой","Колдун","Сила стаи","Мудрость стаи","Налёт стаи"]]
,["gnollum",74,1,2,4,1,3,6,4,5,0,0,10,75,["Живой","Стрелок","Нет штрафов в ближнем бою","Сила стаи","Налёт стаи","Сковывающий выстрел"]]
,["gnollumup",74,1,3,5,2,3,8,4,7,0,0,11,0,["Живой","Стрелок","Нет штрафов в ближнем бою","Сила стаи","Налёт стаи","Сковывающий выстрел","Защита стаи"]]
,["gnollup",74,1,4,6,3,4,9,4,0,0,0,11,93,["Живой","Сила стаи","Налёт стаи","Ярость стаи"]]
,["gnomka",56,4,9,5,7,11,40,4,12,0,0,10,0,["Живой","Стрелок","Стрельба без штрафов","Колдун","Пиромант"]]
,["gnomon",63,1,4,4,2,3,9,4,0,0,0,9,53,["Живой","Храбрость","Убийца гигантов"]]
,["gnompirate",51,6,21,12,12,17,100,5,0,0,0,11,0,["Живой","Бесконечный отпор","Двойной удар","Пират"]]
,["goblin",5,1,3,1,1,2,3,5,0,0,0,10,19,["Живой"]]
,["goblin6",70,2,2,2,2,3,23,5,8,0,0,10,0,["Живой","Стрелок","Демоническая кровь","Калечащие капканы"]]
,["goblinarcher",105,1,3,3,1,2,3,5,10,0,0,10,29,["Живой","Стрелок"]]
,["goblinhunter6",70,2,2,2,3,5,26,7,10,0,0,11,0,["Живой","Стрелок","Демоническая кровь","Калечащие капканы","Подлые удары"]]
,["goblinmag",205,1,2,1,1,2,3,5,0,0,0,11,521,["Живой","Колдун"]]
,["goblinshaman",109,1,2,1,1,2,5,5,0,0,0,9,202,["Живой","Колдун","Бурлящая кровь","Трусость","Порча магии"]]
,["goblinus",9,1,1,1,1,1,3,4,0,0,0,12,13,["Живой","Бурлящая кровь","Трусость","Предательство"]]
,["gogachi",53,2,6,4,2,4,13,4,12,0,0,10,0,["Живой","Стрелок","Демоническое существо"]]
,["golddragon",71,7,41,24,63,71,169,9,0,0,0,12,4047,["Живой","Большое существо","Летающее существо","Сопротивление магии 50%","Огненное дыхание","Скрытый","Уничтожитель нежити"]]
,["gop",56,2,6,6,4,7,20,6,0,0,0,12,0,["Нежить","Ослабляющий удар","Удар и возврат"]]
,["gpiratka",79,2,6,2,2,4,8,9,0,0,0,12,0,["Нежить","Летающее существо","Бестелесное существо","Осушение","Удар и возврат","Пират"]]
,["gpiratkaup",79,2,6,3,2,4,9,9,0,0,0,12,0,["Нежить","Летающее существо","Бестелесное существо","Осушение","Удар и возврат","Пират","Призрачный холод"]]
,["greendragon",4,7,27,25,30,50,200,8,0,0,0,12,2691,["Живой","Большое существо","Летающее существо","Кислотное дыхание"]]
,["gremlin",3,1,2,2,1,2,5,3,5,0,0,7,29,["Живой","Стрелок"]]
,["grib",62,1,4,9,2,3,20,5,0,0,0,11,0,["Живой","Окопаться"]]
,["gribok",62,1,3,7,1,2,16,4,12,0,0,11,0,["Живой","Стрелок","Отравляющий удар","Окопаться"]]
,["griffin",58,4,16,12,14,18,75,6,0,0,0,12,0,["Живой","Большое существо","Летающее существо","Бесконечный отпор","Удар с небес"]]
,["griffon",1,4,7,5,5,10,30,7,0,0,0,15,194,["Живой","Большое существо","Летающее существо","Бесконечный отпор","Иммунитет к ослеплению"]]
,["grimrider",6,4,10,9,7,14,50,7,0,0,0,11,333,["Живой","Большое существо","Удар с разбега","Укус ящера"]]
,["grinchshad",55,8,18,18,5,9,1000,5,4,0,0,10,0,["Стрелок","Элементаль"]]
,["harpooner",108,2,5,3,2,5,10,4,4,0,0,9,69,["Живой","Стрелок","Броня","Удар гарпуном"]]
,["harpy",54,2,5,1,4,7,15,8,0,0,0,13,133,["Живой","Летающее существо","Удар и возврат"]]
,["harpy6",70,3,4,3,4,5,29,6,0,0,0,12,0,["Живой","Летающее существо","Удар и возврат"]]
,["harpyhag",54,2,6,2,4,7,15,9,0,0,0,15,194,["Живой","Летающее существо","Враг не сопротивляется","Удар и возврат"]]
,["hellcharger",7,5,18,18,8,16,66,8,0,0,0,16,403,["Живой","Большое существо","Демоническое существо","Атака страхом"]]
,["hellhound",7,3,4,2,3,5,15,7,0,0,0,13,83,["Живой","Демоническое существо"]]
,["hellhound6",52,2,8,4,4,7,22,6,0,0,0,9,0,["Живой","Большое существо","Бесконечный отпор","Огнеупорная кожа","Уязвимость к Свету","Голодный взгляд"]]
,["hellkon",107,5,18,17,10,17,66,8,0,0,0,15,791,["Живой","Большое существо","Демоническое существо","Атака страхом","Иссушающая аура"]]
,["highwayman",63,3,9,6,4,7,24,4,0,0,0,8,122,["Живой","Большое существо","Задира"]]
,["hobbit",75,1,4,2,1,3,4,5,24,0,0,10,0,["Живой","Стрелок","Убийца гигантов","Постоянная удача"]]
,["hobgoblin",5,1,4,3,2,2,4,5,0,0,0,10,23,["Живой"]]
,["horneddemon",7,2,1,3,1,2,13,5,0,0,0,7,40,["Живой","Ярость","Демоническое существо"]]
,["hornedoverseer",7,2,3,4,2,3,13,5,0,0,0,8,47,["Живой","Ярость","Демоническое существо","Взрыв"]]
,["horse",59,5,12,10,8,15,70,7,0,0,0,10,0,["Живой","Большое существо"]]
,["hotdog",107,3,4,3,3,5,15,8,0,0,0,13,161,["Живой","Враг не сопротивляется","Удар тремя головами","Демоническое существо","Огненное дыхание"]]
,["hungerplant",59,5,25,25,11,15,70,2,20,0,0,11,0,["Живой","Стрелок","Нет штрафов в ближнем бою","Наложение проклятия","Животный яд"]]
,["hydra",6,5,15,12,7,14,80,5,0,0,0,7,467,["Живой","Большое существо","Ярость","Враг не сопротивляется","Удар тремя головами"]]
,["hyenarider",205,2,8,4,4,5,14,6,0,0,0,11,84,["Живой","Большое существо","Ослабляющий удар"]]
,["iceddragon",55,7,35,25,35,45,220,6,0,0,0,10,0,["Большое существо","Летающее существо","Элементаль","Иммунитет к холоду","Ледяное дыхание"]]
,["iceddragonup",55,7,40,30,40,50,250,7,0,0,0,10,0,["Большое существо","Летающее существо","Элементаль","Иммунитет к холоду","Защита от стрел","Живая броня","Ледяное дыхание"]]
,["iceel",55,1,4,4,2,3,45,6,0,0,0,9,0,["Летающее существо","Элементаль","Иммунитет к холоду"]]
,["iceelb",55,2,25,25,15,25,90,6,0,0,0,10,0,["Большое существо","Летающее существо","Элементаль","Иммунитет к холоду"]]
,["iceelup",55,1,5,6,2,4,45,6,0,0,0,9,0,["Летающее существо","Элементаль","Иммунитет к холоду","Игнорирование атаки 20%"]]
,["icegiant",60,0,5,10,8,12,100,3,4,0,0,8,0,["Живой","Стрелок","Большое существо","Колдун","Нет штрафов в ближнем бою","Иммунитет к холоду"]]
,["icequeen",55,5,9,9,17,24,29,4,12,0,0,8,0,["Живой","Стрелок","Колдун","Иммунитет к холоду"]]
,["icequeenup",55,5,9,11,17,25,39,4,12,0,0,8,0,["Живой","Стрелок","Иммунитет к холоду","Ледяные ласки"]]
,["igriffin",58,4,19,15,14,20,85,6,0,0,0,13,0,["Живой","Большое существо","Летающее существо","Бесконечный отпор","Нападение с небес"]]
,["ill",56,1,1,1,0,1,2,3,0,0,0,8,0,["Живой"]]
,["imp",7,1,2,1,1,2,4,5,0,0,0,13,24,["Живой","Демоническое существо","Уничтожитель маны"]]
,["impergriffin",1,4,9,8,5,15,35,7,0,0,0,15,290,["Живой","Большое существо","Летающее существо","Бесконечный отпор","Удар с небес","Иммунитет к ослеплению"]]
,["inquisitor",1,5,16,16,9,12,80,5,7,0,0,10,1497,["Живой","Стрелок","Колдун","Нет штрафов в ближнем бою"]]
,["iron_golem",3,3,5,5,3,5,18,4,0,0,0,7,76,["Механизм","Иммунитет к замедлению","Сопротивление магии 50%"]]
,["jaguar6",70,6,10,9,17,20,85,7,0,0,0,13,0,["Живой","Большое существо","Демоническая кровь","Воин ярости","Зверская атака"]]
,["jdemon",107,2,3,1,1,4,13,4,0,0,0,9,57,["Живой","Ярость","Демоническое существо","Прыжок"]]
,["juggernaut",52,6,12,16,17,20,90,6,0,0,0,12,0,["Живой","Большое существо","Огнеупорная кожа","Уязвимость к Свету","Живая броня","Неудержимый натиск"]]
// 0-id, 1-castle, 2-tier, 3-attack, 4-defense, 5-minDamage, 6-maxDamage, 7-health, 8-speed, 9-shots, 10-mana, 11-range, 12-initiative, 13-leadership, 14-abilities
,["kachok",61,4,7,3,4,8,50,5,0,0,0,10,208,["Живой","Окаменевшая кровь"]]
,["kammon",68,2,8,5,7,12,28,5,0,0,0,10,0,["Элементаль","Прогресс на охоте"]]
,["kamneed",54,4,8,6,6,9,45,4,0,0,0,9,250,["Живой","Оглушающий удар"]]
,["kamnegryz",54,4,9,7,6,10,55,4,0,0,0,9,252,["Живой","Ярость","Оглушающий удар","Сопротивление магии 25%","Калечащее ранение"]]
,["kappa",56,3,6,6,3,4,21,4,0,0,0,13,0,["Живой","Амфибия","Скачок","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["kappashoya",56,3,9,6,4,6,25,4,0,0,0,14,0,["Живой","Амфибия","Мощный скачок","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["kensei",76,6,18,17,19,22,90,5,0,0,0,12,0,["Живой","Большое существо","Бесконечный отпор","Амфибия","Вызов","Четыре волны","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["kenshi",76,6,15,15,17,21,80,5,0,0,0,11,0,["Живой","Большое существо","Бесконечный отпор","Амфибия","Вызов","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["kirin",76,7,32,31,53,57,255,7,0,0,0,13,0,["Большое существо","Дух","Амфибия","Свободное течение","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["klop",76,2,5,7,2,3,12,4,8,0,6,9,0,["Стрелок","Иммунитет к магии земли","Повреждение доспехов 25%"]]
,["krab",73,5,15,15,10,14,50,6,0,0,0,10,0,["Живой","Ладья"]]
,["krabup",73,5,17,17,13,16,60,6,0,0,0,10,0,["Живой","Осушение","Броня","Ладья"]]
,["krevetko",73,5,13,19,7,10,66,6,0,0,0,12,0,["Живой","Большое существо","Двойной удар","Аура страха","Иммунитет к влиянию на разум"]]
,["krokodil",63,5,14,8,11,15,70,5,0,0,0,11,376,["Живой","Большое существо","Защита от стрел","Пожиратель света"]]
,["krokodilmag",63,5,10,7,9,12,60,4,8,0,0,11,0,["Живой","Стрелок","Большое существо","Колдун","Нет штрафов в ближнем бою","Штраф за стрельбу","Пожиратель света","Пожиратель тьмы"]]
,["krokodilup",63,5,15,11,12,16,80,5,0,0,0,11,441,["Живой","Большое существо","Защита от стрел","Пожиратель света","Пожиратель тьмы"]]
,["lacerator",52,5,16,13,17,22,85,6,0,0,0,11,0,["Живой","Огнеупорная кожа","Уязвимость к Свету","Вкус боли","Разрывные шипы"]]
,["lavadragon",108,7,30,35,44,55,275,5,0,0,0,9,2561,["Большое существо","Элементаль","Иммунитет к огню","Жидкое пламя"]]
,["leprekon",59,2,5,2,2,7,7,6,0,0,0,13,286,["Живой","Дарующий удачу"]]
,["leviathan",67,7,28,28,43,63,200,5,0,0,0,10,0,["Живой","Большое существо","Иммунитет к холоду","Игнорирование защиты 30%"]]
,["lich",2,5,15,15,12,17,50,3,5,0,0,10,550,["Нежить","Стрелок","Большое существо","Смертоносное облако"]]
,["lich6",65,5,13,12,16,19,65,4,8,0,0,8,0,["Нежить","Стрелок","Уязвимость к Свету","Объятия тьмы"]]
,["lilim",52,3,7,5,5,7,24,6,12,0,0,8,0,["Живой","Стрелок","Летающее существо","Стрельба без штрафов","Огнеупорная кожа","Уязвимость к Свету","Упоение страданиями"]]
,["lizard",56,4,7,7,4,6,25,6,0,0,0,12,0,["Живой","Большое существо"]]
,["lumberman",75,1,3,1,1,3,4,4,0,0,0,8,0,["Живой","Оглушающий удар"]]
,["mage",3,4,10,10,7,7,18,4,3,0,0,10,402,["Живой","Стрелок","Магический выстрел","Стрельба без штрафов","Колдун"]]
,["magicel",68,6,15,13,10,20,80,9,0,0,0,12,870,["Элементаль","Враг не сопротивляется","Невосприимчивость магии","Круговой удар"]]
,["magmadragon",8,7,30,40,40,50,280,5,0,0,0,9,2569,["Большое существо","Элементаль","Иммунитет к огню","Огненное дыхание","Магма щит"]]
,["magneticgolem",103,3,6,6,3,5,28,4,0,0,0,9,102,["Механизм","Зачарованный доспех","Магнетизм"]]
,["maiden",6,2,4,2,5,7,16,7,0,0,0,14,125,["Живой","Удар и возврат"]]
,["mamont",56,6,23,23,23,37,140,5,0,0,0,9,0,["Живой","Большое существо","Сокрушающий удар","Убийца пигмеев","Несдвигаемый"]]
,["maniac",52,1,7,4,3,6,23,5,0,0,0,9,0,["Живой","Извращенный разум","Огнеупорная кожа","Уязвимость к Свету"]]
,["manticore",54,6,15,13,14,20,80,7,0,0,0,12,569,["Живой","Большое существо","Летающее существо","Животный яд"]]
,["manticoreup",54,6,16,14,14,20,80,9,0,0,0,13,750,["Живой","Большое существо","Летающее существо","Паралич"]]
,["marks",58,2,5,5,3,5,28,6,10,0,0,9,0,["Живой","Стрелок","Стрельба без штрафов","Бронебойный выстрел","Стрельба насквозь"]]
,["marksman",1,2,4,4,2,8,10,4,12,0,0,8,87,["Живой","Стрелок","Точный выстрел"]]
,["maroder",63,1,4,2,2,3,7,5,0,0,0,10,0,["Живой","Жестокость","Угнетение слабых","Боязнь сильных"]]
,["mastergremlin",3,1,3,2,1,2,6,5,7,0,0,11,48,["Живой","Стрелок","Починка"]]
,["masterhunter",4,3,5,4,5,8,14,5,16,0,0,10,250,["Живой","Стрелок","Двойной выстрел","Останавливающий выстрел"]]
,["masterlich",102,5,21,19,17,21,55,4,5,0,0,10,802,["Нежить","Стрелок","Большое существо","Колдун"]]
,["matriarch",6,6,20,20,17,27,90,4,4,0,0,10,1116,["Живой","Стрелок","Колдун","Удар хлыстом"]]
,["mauler",9,3,6,4,4,6,12,5,0,0,0,11,79,["Живой","Ярость","Штурм","Бурлящая кровь"]]
,["mauler6",70,2,4,4,4,8,30,5,0,0,0,8,0,["Живой","Защита от стрел","Вкус крови","Демоническая кровь"]]
,["mbreeder",52,5,15,13,15,18,75,5,11,0,0,11,0,["Живой","Стрелок","Большое существо","Огнеупорная кожа","Уязвимость к Свету","Поглощение маны","Размножение"]]
,["mcentaur",109,2,4,4,3,5,10,6,8,0,0,10,78,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Бурлящая кровь"]]
,["mcentaur6",70,6,10,9,14,18,80,8,12,0,0,13,0,["Живой","Стрелок","Большое существо","Стрельба без штрафов","Маневрирование","Бдительность","Расторопность"]]
,["mechanic",57,3,13,7,4,7,30,4,6,0,0,9,0,["Живой","Стрелок","Калечащее ранение","Эксперт починки"]]
,["mechdron",57,1,7,4,2,3,7,6,0,0,0,11,0,["Летающее существо","Механизм","Иммунитет к замедлению","Игнорирование защиты 10%","Броня"]]
,["mechgolem",57,7,30,28,55,75,180,6,0,0,0,9,0,["Большое существо","Оглушающий удар","Механизм","Броня","Могучий удар","Несдвигаемый","Тяжелый шаг"]]
,["mechguard",57,4,18,15,7,9,50,5,0,0,0,9,0,["Механизм","Игнорирование защиты 25%","Броня","Ужасная рана"]]
,["mechguardup",57,4,21,16,8,11,55,5,0,0,0,9,0,["Механизм","Игнорирование защиты 25%","Броня","Ужасная рана","Дезориентирующий визг","Пиломашина"]]
,["mechspider",57,2,10,6,2,3,12,5,0,0,0,10,0,["Механизм","Броня","Самоуничтожение"]]
,["mechspiderup",57,2,13,8,2,3,14,6,0,0,0,11,0,["Механизм","Броня","Самоуничтожение","Прыжок арахнида"]]
,["mechtank",57,6,24,24,16,24,120,5,16,0,0,9,0,["Стрелок","Большое существо","Механизм","Броня","Игнорирование атаки 20%","Прицельный выстрел"]]
,["mechtankup",57,6,27,30,17,25,140,5,16,0,0,10,0,["Стрелок","Большое существо","Механизм","Броня","Игнорирование атаки 40%","Прицельный выстрел"]]
,["medusa",54,4,9,9,6,8,25,5,4,0,0,11,222,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Окаменение"]]
,["medusaup",54,4,10,10,6,8,30,6,8,0,0,11,234,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Окаменение"]]
,["megogachi",53,2,7,4,2,4,13,4,24,0,0,10,0,["Живой","Стрелок","Демоническое существо","Пиромант"]]
,["mercarcher",69,2,5,2,2,5,8,5,12,0,0,11,125,["Живой","Стрелок","Ярость","Стрельба без штрафов"]]
,["mercfootman",69,3,9,5,3,5,24,5,0,0,0,9,136,["Живой","Ярость","Большой щит","Оглушающий удар","Бесконечный отпор"]]
,["mercwizard",69,4,9,8,5,10,36,4,5,0,0,11,0,["Живой","Стрелок","Колдун"]]
,["metal",60,8,4,8,7,11,55,3,4,0,0,8,0,["Стрелок","Механизм","Колдун","Нет штрафов в ближнем бою"]]
,["mikrodragon",71,3,7,7,4,7,30,5,0,0,0,9,0,["Живой","Проклятие дракона"]]
,["minidragon",71,4,12,12,10,16,60,7,0,0,0,9,0,["Живой","Летающее существо","Увёртливый"]]
,["minotaur",6,3,5,2,4,7,31,5,0,0,0,8,114,["Живой","Храбрость"]]
,["minotaurguard",6,3,5,2,4,7,35,5,0,0,0,8,161,["Живой","Двойной удар","Храбрость"]]
,["mistress",106,6,20,20,20,30,100,5,0,0,0,11,1479,["Живой","Колдун","Удар хлыстом","Невидимость"]]
,["mizukami",76,6,20,15,10,13,76,5,0,0,0,12,0,["Дух","Амфибия","Отражение боли","Духовные узы","Защитная оболочка","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["monk",63,4,11,8,5,5,20,4,7,0,0,11,0,["Живой","Стрелок","Колдун"]]
,["mountaingr",108,1,1,6,1,2,12,4,0,0,0,8,36,["Живой","Ярость","Большой щит","Броня","Ни шагу назад","Оборонительная позиция"]]
,["mummy",56,5,8,9,20,30,50,3,0,0,0,15,3412,["Нежить","Колдун","Колдовской удар"]]
,["mushroom",62,1,14,19,9,15,90,5,0,0,0,9,0,["Живой","Большое существо","Нечувствительность","Могучий удар","Надёжная позиция","Окопаться"]]
,["naga",56,6,25,25,30,30,110,5,0,0,0,10,1062,["Живой","Большое существо","Бесконечный отпор","Враг не сопротивляется"]]
,["ncentaur",9,2,4,2,3,6,9,5,8,0,0,10,70,["Живой","Стрелок","Большое существо","Бурлящая кровь","Маневрирование"]]
,["necra",60,"?",4,4,8,10,40,3,4,0,0,8,0,["Живой","Стрелок","Колдун"]]
,["necrodog",66,1,3,1,2,3,8,7,0,0,0,12,0,["Нежить","Вкус тьмы"]]
,["necrodogup",66,1,4,3,2,4,9,7,0,0,0,14,0,["Нежить","Вкус тьмы","Стремительный бросок"]]
,["necromancer",66,4,19,16,10,21,33,4,12,0,0,10,0,["Нежить","Стрелок","Колдун"]]
,["negro",51,1,6,2,4,6,17,6,0,0,0,10,98,["Живой","Двойной удар","Пират"]]
,["nightmare",7,5,18,18,8,16,66,8,0,0,0,16,619,["Живой","Большое существо","Демоническое существо","Атака страхом","Аура страха"]]
,["nomad",63,4,9,8,2,6,30,7,0,0,0,13,129,["Живой","Большое существо","Игнорирование защиты 15%"]]
,["nomadbow",63,4,10,8,3,6,31,6,7,0,0,13,0,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Игнорирование защиты 15%","Расторопность"]]
,["nomadup",63,4,10,10,4,6,33,7,0,0,0,14,0,["Живой","Большое существо","Храбрость","Игнорирование защиты 20%"]]
,["obsgargoyle",3,2,3,5,1,2,20,7,0,0,0,10,60,["Летающее существо","Ярость","Элементаль","Иммунитет к молниям","Иммунитет к холоду","Иммунитет к огню"]]
,["ocean",51,4,10,8,6,9,30,8,0,0,0,11,272,["Живой","Летающее существо","Сопротивление магии 50%","Стремительная атака","Ледяное дыхание"]]
,["ogre",5,4,10,5,5,10,50,4,0,0,0,8,220,["Живой","Ярость","Отбрасывающий удар"]]
,["ogrebrutal",105,4,12,5,5,10,70,5,0,0,0,9,291,["Живой","Ярость","Отбрасывающий удар","Калечащее ранение"]]
,["ogremagi",5,4,11,6,5,12,65,5,0,0,0,8,823,["Живой","Ярость","Колдун","Отбрасывающий удар"]]
,["ogreshaman",205,4,12,5,7,12,55,5,0,0,0,9,769,["Живой","Ярость","Колдун","Отбрасывающий удар"]]
,["orc",5,3,6,1,3,4,12,4,6,0,0,11,124,["Живой","Стрелок","Нет штрафов в ближнем бою","Жажда крови"]]
,["orcchief",5,3,9,4,4,6,18,5,8,0,0,11,196,["Живой","Стрелок","Нет штрафов в ближнем бою","Жажда крови","Останавливающий выстрел"]]
,["orcrubak",105,3,10,3,3,5,20,5,10,0,0,10,167,["Живой","Стрелок","Двойной удар","Нет штрафов в ближнем бою","Жажда крови"]]
,["orcshaman",205,3,6,3,3,4,13,4,6,0,0,11,644,["Живой","Стрелок","Колдун","Нет штрафов в ближнем бою","Жажда крови"]]
,["ork",56,3,11,12,5,9,24,5,0,0,0,11,0,["Живой","Жажда крови","Штурм","Защита от стрел","Вкус крови","Жажда битвы"]]
,["outlaw",63,1,1,1,1,2,6,4,0,0,0,9,199,["Живой","Колдун","Иммунитет к магии земли"]]
,["outlawup",63,1,1,1,2,3,8,4,0,0,0,9,208,["Живой","Колдун","Иммунитет к магии земли"]]
,["paladin",1,6,24,24,20,30,100,7,0,0,0,12,0,["Живой","Большое существо","Рыцарский разбег","Возложение рук","Иммунитет к заклинанию Берсерк"]]
,["panther6",70,6,11,10,18,22,90,7,0,0,0,14,0,["Живой","Большое существо","Демоническая кровь","Воин ярости","Бойня"]]
,["pearlp",76,3,7,4,5,6,22,5,12,0,0,11,0,["Живой","Стрелок","Стрельба без штрафов","Амфибия","Волны обновления","Взгляд медузы","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["peasant",1,1,1,1,1,1,4,4,0,0,0,8,16,["Живой"]]
,["peasantw",75,1,0,0,0,1,3,3,0,0,0,10,0,["Живой","Трусость"]]
,["pegasus",80,3,9,8,5,9,30,7,0,0,0,12,170,["Живой","Большое существо","Летающее существо","Пожиратель маны"]]
,["pharaoh",56,5,10,10,25,35,70,3,0,0,0,16,3400,["Нежить","Колдун","Колдовской удар"]]
,["phoenix",68,8,33,33,30,50,777,7,0,0,0,15,0,["Большое существо","Летающее существо","Элементаль","Иммунитет к огню","Огненный щит","Возрождение 100%"]]
,["pikeman",78,3,12,7,3,5,15,5,0,0,0,9,77,["Живой","Игнорирование защиты 60%"]]
,["piratemonster",51,7,34,29,40,60,190,5,0,0,0,11,2588,["Живой","Большое существо","Сопротивление магии 50%","Атака страхом","Живая броня","Скрытый","Пират"]]
,["piratemonsterup",51,7,40,33,40,70,200,6,0,0,0,11,2710,["Живой","Большое существо","Летающее существо","Сопротивление магии 50%","Атака страхом","Телепортация","Живая броня","Пират"]]
,["piratess",60,0,4,4,8,11,33,4,4,0,0,8,0,["Живой","Стрелок","Колдун","Пират"]]
,["piratka",51,2,6,4,3,5,10,8,0,0,0,12,107,["Живой","Удар и возврат","Штурм","Скрытый","Пират"]]
,["piratkaup",51,2,8,4,4,6,12,8,0,0,0,13,184,["Живой","Враг не сопротивляется","Удар и возврат","Штурм","Пират"]]
,["piroman",53,3,4,4,3,4,20,3,6,0,0,10,0,["Живой","Стрелок","Воспламеняющийся выстрел"]]
,["pitfiend",7,6,21,21,13,26,110,4,0,0,0,8,950,["Живой","Большое существо","Колдун","Демоническое существо"]]
,["pitfiend6",52,7,29,24,49,56,270,7,0,0,0,11,0,["Живой","Большое существо","Летающее существо","Телепортация","Огнеупорная кожа","Уязвимость к Свету","Затаенная ненависть","Клинок ненависти","Ослепленный яростью"]]
,["pitlord",7,6,22,21,13,31,120,4,0,0,0,8,1257,["Живой","Большое существо","Колдун","Демоническое существо","Разящий меч"]]
,["pitlord6",52,7,32,26,55,64,280,7,0,0,0,12,0,["Живой","Большое существо","Летающее существо","Телепортация","Огнеупорная кожа","Уязвимость к Свету","Затаенная ненависть","Клинок ненависти","Ослепленный яростью","Безграничная ненависть"]]
,["pity",107,6,27,23,13,31,140,6,0,0,0,9,1103,["Живой","Большое существо","Сопротивление магии 50%","Демоническое существо","Убойный клинок"]]
,["pixel",4,1,1,1,1,2,5,7,0,0,0,12,37,["Живой","Летающее существо","Враг не сопротивляется","Убийственные брызги"]]
,["plaguezombie",2,2,2,2,2,3,17,4,0,0,0,7,96,["Нежить","Ярость","Ослабляющий удар"]]
,["plant",59,5,22,22,10,14,60,2,20,0,0,10,830,["Живой","Стрелок","Нет штрафов в ближнем бою","Животный яд"]]
,["poacher",63,2,9,4,5,7,16,6,3,0,0,11,0,["Живой","Стрелок","Зов зверя"]]
,["poltergeist",102,3,6,5,4,6,20,6,0,0,0,9,143,["Нежить","Летающее существо","Бестелесное существо","Кража боеприпасов"]]
,["poukai",109,6,19,19,20,25,120,7,0,0,0,10,872,["Живой","Большое существо","Летающее существо","Иммунитет к ослеплению","Электрическое дыхание","Трупоед"]]
,["ppirate",51,3,14,8,5,7,25,4,0,0,0,10,0,["Живой","Жажда крови","Храбрость","Аура страха","Скрытый","Пират"]]
,["ppirateup",51,3,16,10,6,9,30,4,20,0,0,10,0,["Живой","Стрелок","Нет штрафов в ближнем бою","Черная метка","Пират"]]
,["praetorian",58,1,4,10,3,4,32,5,0,0,0,8,0,["Живой","Защитник","Защита от стрел","Надзор"]]
,["predator",68,3,13,7,3,7,35,7,0,0,0,13,0,["Летающее существо","Элементаль","Броня","Калечащее ранение"]]
,["priest",1,5,12,12,9,12,54,5,7,0,0,10,457,["Живой","Стрелок","Нет штрафов в ближнем бою"]]
,["priestess",51,5,12,7,10,14,35,4,4,0,0,12,1059,["Живой","Стрелок","Колдун","Пират"]]
,["priestessup",51,5,12,10,10,16,35,4,4,0,0,12,1574,["Живой","Стрелок","Колдун","Пират"]]
,["priestmoon",10,5,11,11,4,6,50,6,10,0,0,9,1213,["Живой","Стрелок","Колдун","Непробиваемость огнем 25%","Затмение"]]
,["priestsun",10,5,13,13,4,6,55,6,10,0,0,9,1798,["Живой","Стрелок","Колдун","Непробиваемость огнем 25%","Затмение"]]
,["pristineunicorn",104,5,15,15,9,24,80,7,0,0,0,12,785,["Живой","Большое существо","Ослепление","Дитя Света"]]
,["ptero",56,1,7,4,3,4,20,8,0,0,0,13,0,["Живой","Летающее существо","Переносчик"]]
,["pteroup",56,1,9,5,4,6,27,10,0,0,0,14,0,["Живой","Летающее существо","Переносчик","Дезориентирующий визг"]]
,["pumkinhead",56,6,31,31,11,31,111,6,0,0,0,11,0,["Нежить","Бесконечный отпор","Сопротивление магии 50%"]]
,["pushkar",79,5,12,10,12,15,64,4,6,0,0,9,460,["Нежить","Стрелок","Игнорирование защиты 20%","Пират","Убийца гигантов","Мощная отдача"]]
,["pushkarup",79,5,13,11,13,16,76,4,7,0,0,9,0,["Нежить","Стрелок","Игнорирование защиты 20%","Пират","Убийца гигантов","Безрассудный залп","Мощная отдача"]]
,["radiantglory",58,5,15,12,14,16,65,6,0,0,0,14,0,["Летающее существо","Враг не сопротивляется","Удар и возврат","Телепортация","Скорость света","Очищающий свет","Уязвимость к магии Тьмы","Дух"]]
,["rakshasa_kshatra",103,6,27,20,25,35,135,7,0,0,0,8,1573,["Живой","Большое существо","Натиск","Вихрь"]]
,["rakshasa_raja",3,6,25,20,23,30,140,6,0,0,0,8,1142,["Живой","Большое существо","Враг не сопротивляется","Натиск"]]
,["rakshasa_rani",3,6,25,20,15,23,120,5,0,0,0,9,781,["Живой","Большое существо","Враг не сопротивляется"]]
,["rapukk",53,6,33,22,22,33,99,5,0,0,0,10,0,["Живой","Колдун","Жажда крови","Демоническое существо"]]
,["raremamont",61,6,20,10,16,33,110,5,0,0,0,9,0,["Живой","Большое существо","Убийца пигмеев","Несдвигаемый","Вымирающий вид"]]
,["ravager",52,6,13,17,18,21,100,7,0,0,0,13,0,["Живой","Большое существо","Огнеупорная кожа","Уязвимость к Свету","Живая броня","Неудержимый натиск","Вызывающий облик"]]
,["ravenousghoul",65,3,10,8,6,8,32,5,0,0,0,9,0,["Нежить","Уязвимость к Свету","Скрытый","Мертвая плоть","Ненависть к живым"]]
,["reanimator",53,3,3,3,3,6,27,5,0,0,0,9,0,["Живой","Демоническое существо"]]
,["reanimatorup",53,3,6,3,3,6,27,6,0,0,0,9,0,["Живой","Демоническое существо","Воззидание"]]
,["reddragon",106,7,30,30,45,60,235,9,0,0,0,11,4099,["Живой","Большое существо","Летающее существо","Огненное дыхание","Сжигание"]]
,["redlizard",56,4,13,13,8,10,35,7,0,0,0,13,0,["Живой","Большое существо","Осушение"]]
,["reptiloid",51,6,13,19,18,22,80,6,0,0,0,11,882,["Живой","Большой щит","Игнорирование атаки 20%"]]
,["reptiloidup",51,6,15,24,18,22,90,7,0,0,0,11,904,["Живой","Большой щит","Защита союзников","Игнорирование атаки 40%"]]
,["robber",63,1,4,2,1,3,5,4,8,0,0,9,36,["Живой","Стрелок","Трусость"]]
,["robberup",63,1,6,3,2,3,6,4,10,0,0,10,60,["Живой","Стрелок","Трусость","Защита от стрел","Первый выстрел"]]
,["rocbird",5,5,16,8,11,15,55,8,0,0,0,12,605,["Живой","Большое существо","Летающее существо","Переносчик"]]
,["rotzombie",102,2,2,3,1,3,23,4,0,0,0,7,73,["Нежить","Ярость","Отравляющая аура"]]
,["runekeeper",108,5,10,9,17,20,65,3,5,0,0,9,1120,["Живой","Стрелок","Колдун","Иммунитет к огню","Аура уязвимости к огню"]]
,["runepatriarch",8,5,10,9,14,18,70,3,5,0,0,9,794,["Живой","Стрелок","Колдун","Иммунитет к огню","Знак Огня","Перекрестная атака"]]
,["runepriest",8,5,10,6,12,15,60,3,5,0,0,8,344,["Живой","Стрелок","Колдун","Непробиваемость огнем 50%","Знак Огня"]]
,["saboteurgremlin",103,1,5,3,1,2,6,5,7,0,0,12,95,["Живой","Стрелок","Магическая ловушка"]]
,["sacredkirin",76,7,35,33,55,59,265,7,0,0,0,14,0,["Большое существо","Дух","Амфибия","Свободное течение","Покров из града","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["satyr",80,4,14,13,5,8,36,5,0,0,0,11,178,["Живой","Весельчак"]]
,["savageent",104,6,21,27,12,20,175,6,0,0,0,7,1256,["Живой","Большое существо","Ярость","Иммунитет к замедлению","Оплетающие корни","Ярость леса"]]
,["scarab",10,1,1,1,1,1,6,5,0,0,0,8,23,["Живой","Летающее существо","Непробиваемость огнем 25%","Прикосновение времени"]]
,["scarabalt",10,1,3,1,1,2,6,6,0,0,0,10,35,["Живой","Маленькое существо","Летающее существо","Непробиваемость огнем 25%","Посмертное очищение"]]
,["scarabup",10,1,2,2,1,2,6,5,0,0,0,9,35,["Живой","Летающее существо","Непробиваемость огнем 25%","Дитя Света","Прикосновение времени"]]
,["sceletonwar",102,1,2,6,1,3,5,5,0,0,0,10,408,["Нежить","Большой щит","Оглушающий удар","Сопротивление магии 25%","Защита союзников"]]
,["scorp",10,1,4,1,1,1,4,6,0,0,0,14,25,["Живой","Непробиваемость огнем 25%","Укус времени"]]
,["scorpalt",10,1,5,3,1,2,4,6,0,0,0,15,33,["Живой","Маленькое существо","Непробиваемость огнем 25%","Повреждение доспехов 20%"]]
,["scorpup",10,1,5,2,1,1,5,7,0,0,0,15,38,["Живой","Отравляющий удар","Непробиваемость огнем 25%"]]
,["scout",6,1,3,3,2,4,10,5,5,0,0,10,63,["Живой","Стрелок","Нет штрафов в ближнем бою","Штраф за стрельбу"]]
,["scream",56,4,13,13,7,13,33,13,0,0,0,13,0,["Живой","Враг не сопротивляется"]]
,["sdaughter",9,4,7,9,6,9,35,4,0,0,0,12,816,["Живой","Колдун","Бурлящая кровь","Жертвоприношение гоблинами"]]
,["seamonster",67,5,13,13,11,19,90,5,0,0,0,9,0,["Живой","Большое существо","Смертельный удар"]]
,["seducer",107,4,6,6,6,13,26,4,6,0,0,9,495,["Живой","Стрелок","Демоническое существо","Иммунитет к гипнозам","Соблазнение"]]
,["sekhmet",56,5,10,13,3,5,50,5,8,0,0,10,203,["Живой","Стрелок","Непробиваемость огнем 50%","Пиромант","Выжигающая поступь"]]
,["sentinel",58,1,3,7,2,3,23,5,0,0,0,7,0,["Живой","Защитник","Защита от стрел"]]
,["seraph",58,7,50,40,54,54,325,6,0,0,0,13,0,["Живой","Большое существо","Летающее существо","Клинок воздаяния","Клинок откровения","Непорочность"]]
,["seraph2",101,7,35,25,25,75,220,8,0,0,0,11,3490,["Живой","Большое существо","Летающее существо","Колдун"]]
,["serpentfly",56,1,7,9,2,5,20,9,0,0,0,14,0,["Живой","Летающее существо","Очищение"]]
,["shad",68,2,4,2,2,4,9,5,0,0,0,10,0,["Летающее существо","Элементаль","Двойной удар","Невидимость"]]
,["shadow_witch",6,6,18,18,17,24,80,4,4,0,0,10,926,["Живой","Стрелок","Колдун"]]
,["shadowdragon",6,7,25,24,45,70,200,9,0,0,0,10,3886,["Живой","Большое существо","Летающее существо","Огненное дыхание"]]
,["shakal",10,3,9,8,4,7,24,5,0,0,0,9,156,["Живой","Непробиваемость огнем 25%","Защита от стрел","Возрождение 25%"]]
,["shakalalt",10,3,9,8,5,7,24,5,1,0,0,10,215,["Живой","Стрелок","Маленькое существо","Нет штрафов в ближнем бою","Точный выстрел","Штраф за стрельбу","Непробиваемость огнем 25%","Защита от стрел","Возрождение 50%"]]
,["shakalup",10,3,10,9,6,9,30,5,0,0,0,10,202,["Живой","Непробиваемость огнем 25%","Защита от стрел","Возрождение 50%"]]
,["shaman",59,6,16,16,30,40,110,4,0,0,0,12,0,["Живой","Колдун","Иммунитет к замедлению","Защита от стрел"]]
,["shamancyclop",205,6,24,18,20,27,105,3,10,0,0,10,5880,["Живой","Стрелок","Колдун"]]
,["shamaness",9,4,5,5,6,9,30,5,0,0,0,11,755,["Живой","Колдун","Бурлящая кровь"]]
,["shamanka",60,8,5,3,8,11,41,4,0,0,0,8,0,["Живой","Колдун","Бурлящая кровь"]]
,["sharkguard",56,1,5,5,2,5,25,4,0,0,0,8,0,["Живой","Ужасная рана","Амфибия","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["shell",73,1,2,6,1,2,6,2,16,0,0,9,0,["Живой","Стрелок","Броня","Защита от стрел"]]
,["shellmonster",73,5,11,18,16,20,90,5,0,0,0,9,0,["Живой","Большое существо","Игнорирование защиты 30%","Броня","Калечащее ранение","Защита от стрел"]]
,["sheriff",61,5,16,14,10,16,38,6,0,0,0,11,0,["Живой","Ярость","Бесконечный отпор","Жажда крови","Храбрость"]]
,["shieldguard",8,1,1,5,1,2,12,4,0,0,0,9,51,["Живой","Ярость","Большой щит","Броня","Стена из щитов"]]
,["shootpirate",51,4,9,3,7,11,15,3,10,0,0,10,279,["Живой","Стрелок","Стрельба без штрафов","Игнорирование защиты 20%","Скрытый","Пират"]]
,["shootpirateup",51,4,8,6,8,12,18,3,12,0,0,10,296,["Живой","Стрелок","Стрельба без штрафов","Игнорирование защиты 30%","Скрытый","Пират"]]
,["silverunicorn",4,5,17,17,10,20,77,7,0,0,0,12,533,["Живой","Большое существо","Аура магического сопротивления","Ослепление"]]
,["siren",67,4,10,7,5,8,20,5,0,0,0,12,0,["Живой","Колдун","Иммунитет к влиянию на разум"]]
,["sister",58,3,4,3,5,7,19,5,0,0,0,10,0,["Живой","Исцеление (5)"]]
,["skeleton",2,1,1,2,1,1,4,5,0,0,0,10,20,["Нежить"]]
,["skeleton6",65,1,6,4,3,5,18,4,8,0,0,7,0,["Нежить","Стрелок","Уязвимость к Свету","Скрытый","Полые кости"]]
,["skeletonarcher",2,1,1,2,1,2,4,4,8,0,0,10,36,["Нежить","Стрелок"]]
,["skeletonpirate",79,1,1,2,1,2,4,4,8,0,0,10,18,["Нежить","Маневрирование","Стрельба насквозь","Скрытый","Пират"]]
,["skeletonpirateup",79,1,1,2,2,3,4,4,8,0,0,10,54,["Нежить","Стрелок","Нет штрафов в ближнем бою","Маневрирование","Стрельба насквозь","Пират"]]
,["skeletons6",65,1,7,6,4,7,23,4,10,0,0,8,0,["Нежить","Стрелок","Уязвимость к Свету","Скрытый","Полые кости","Костяные путы"]]
,["skgiant",56,5,30,14,14,21,72,5,0,0,0,10,0,["Нежить","Большое существо","Защита от стрел","Ужасная рана","Ветхий","Внимательный"]]
,["skgiantarch",56,5,27,13,11,19,67,4,8,0,0,10,0,["Нежить","Стрелок","Большое существо","Стрельба без штрафов","Защита от стрел","Ветхий"]]
,["skirmesher",8,2,4,4,2,3,12,4,4,0,0,9,66,["Живой","Стрелок","Нет штрафов в ближнем бою","Калечащее ранение"]]
,["skmarksman",56,1,2,3,1,3,6,3,10,0,0,7,36,["Нежить","Стрелок","Точный выстрел"]]
,["slayer",9,5,11,8,7,10,34,6,0,0,0,11,248,["Живой","Колун","Бурлящая кровь"]]
,["slon",10,6,15,20,25,35,100,5,0,0,0,8,677,["Живой","Большое существо","Отбрасывающий удар","Непробиваемость огнем 25%","Несдвигаемый"]]
,["slonalt",10,6,21,20,25,35,100,5,0,0,0,8,981,["Живой","Большое существо","Броня","Непробиваемость огнем 25%","Осада стен","Разбег","Несдвигаемый","Тяжелый шаг","Широкий взмах","Сокрушающий топот"]]
,["slonup",10,6,20,26,25,35,110,5,0,0,0,9,981,["Живой","Большое существо","Отбрасывающий удар","Непробиваемость огнем 25%","Убийца пигмеев","Несдвигаемый"]]
,["smalllizard",56,2,5,5,2,4,13,6,0,0,0,18,0,["Живой","Атака стаей"]]
,["smaster",78,5,19,17,18,24,84,6,0,0,0,11,735,["Живой","Рассекающий удар","Сокрушающий дух"]]
,["smert",56,5,25,25,13,25,70,4,0,0,0,9,0,["Нежить","Игнорирование защиты 90%"]]
,["snegovik",55,6,16,16,20,35,100,2,6,0,0,10,0,["Стрелок","Большое существо","Элементаль","Иммунитет к замедлению","Иммунитет к холоду"]]
,["snowarcher",55,1,12,10,5,8,18,5,12,0,0,12,0,["Живой","Стрелок","Стрельба без штрафов","Знобящий выстрел"]]
,["snowarcherup",55,1,13,11,6,9,22,5,12,0,0,12,0,["Живой","Стрелок","Стрельба без штрафов","Знобящий выстрел"]]
,["snowmaiden",76,6,15,12,13,15,65,6,10,0,0,10,0,["Живой","Стрелок","Стрельба без штрафов","Амфибия","Ледяное касание","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["snowmonster",55,7,27,34,17,24,350,5,0,0,0,10,0,["Большое существо","Элементаль","Ужасная рана"]]
,["snowowl",55,5,20,11,15,21,76,7,0,0,0,13,0,["Живой","Большое существо","Летающее существо","Вездесущий взор"]]
,["snowowlup",55,5,22,16,16,23,81,7,0,0,0,14,0,["Живой","Большое существо","Летающее существо","Защита от стрел","Вездесущий взор"]]
,["snowwolf",55,3,11,7,7,10,50,7,0,0,0,12,276,["Живой","Бесконечный отпор","Атака стаей","Храбрость"]]
,["snowwolfup",55,3,12,7,7,11,53,7,0,0,0,13,335,["Живой","Бесконечный отпор","Атака стаей","Храбрость","Калечащее ранение","Ловкость"]]
,["spearthrower",51,1,4,2,5,9,19,5,6,0,0,9,174,["Живой","Стрелок","Храбрость"]]
,["spearwielder",8,2,4,4,1,2,10,4,2,0,0,9,39,["Живой","Стрелок","Калечащее ранение"]]
,["spectraldragon",2,7,30,28,25,35,160,7,0,0,0,11,1595,["Нежить","Большое существо","Летающее существо","Наложение проклятия","Смертельный взгляд"]]
,["spectre",2,3,4,4,4,6,19,5,0,0,0,10,146,["Нежить","Летающее существо","Бестелесное существо","Осушение маны"]]
,["spectre6",65,3,8,7,5,7,27,5,0,0,0,9,0,["Нежить","Летающее существо","Уязвимость к Свету","Скрытый","Загробный вопль","Нематериальность"]]
,["spegasus",80,4,9,11,5,9,30,9,0,0,0,12,241,["Живой","Большое существо","Летающее существо","Колун","Пожиратель маны"]]
,["sphinx",56,7,45,45,60,70,300,5,0,0,0,12,0,["Живой","Большое существо","Летающее существо","Непробиваемость огнем 50%","Свирепое возмездие","Защита от стрел"]]
,["spider",54,1,4,4,3,5,9,6,0,0,0,11,61,["Живой","Оплетающие корни","Паутина"]]
,["spiderpois",54,1,5,5,3,5,11,6,0,0,0,12,75,["Живой","Отравляющий удар","Оплетающие корни","Паутина"]]
,["springspirit",76,6,18,14,9,12,70,5,0,0,0,11,0,["Дух","Амфибия","Отражение боли","Духовная связь","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["sprite",4,1,2,1,2,2,6,7,0,0,0,14,57,["Живой","Летающее существо","Враг не сопротивляется","Колдун","Убийственные брызги"]]
,["squire",1,3,5,9,2,5,26,4,0,0,0,8,231,["Живой","Ярость","Большой щит","Оглушающий удар","Защита союзников","Прилив сил"]]
,["stalker",106,1,5,4,3,5,15,6,0,0,0,12,98,["Живой","Отравляющий удар","Невидимость"]]
,["steelgolem",3,3,6,6,5,7,24,4,0,0,0,7,142,["Механизм","Бесконечный отпор","Иммунитет к замедлению","Сопротивление магии 75%"]]
,["stone_gargoyle",3,2,3,4,1,1,15,6,0,0,0,9,44,["Летающее существо","Ярость","Элементаль","Иммунитет к молниям"]]
,["stoneman",68,1,16,36,15,22,100,5,2,0,0,9,0,["Стрелок","Большое существо","Элементаль","Стрельба без штрафов","Нет штрафов в ближнем бою","Иммунитет к магии земли","Оглушающий выстрел","Тяжелый шаг"]]
,["stonemanup",68,6,19,40,17,23,110,5,2,0,0,9,0,["Стрелок","Большое существо","Элементаль","Стрельба без штрафов","Нет штрафов в ближнем бою","Иммунитет к магии земли","Оглушающий выстрел","Взрывной выстрел","Тяжелый шаг"]]
,["stormtitan",103,7,30,30,40,70,190,6,5,0,0,10,4034,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Иммунитет к влиянию на разум","Призывающий бурю"]]
,["strashidlo",75,1,4,2,2,3,7,4,0,0,0,7,0,["Механизм"]]
,["succubus",7,4,6,6,6,13,20,4,6,0,0,10,231,["Живой","Стрелок","Демоническое существо","Ответный выстрел"]]
,["succubus6",52,3,5,4,3,5,20,6,10,0,0,8,0,["Живой","Стрелок","Летающее существо","Стрельба без штрафов","Огнеупорная кожа","Уязвимость к Свету","Наслаждение болью"]]
,["succubusmis",7,4,6,6,6,13,30,4,6,0,0,10,337,["Живой","Стрелок","Демоническое существо","Ответный выстрел","Цепной выстрел"]]
,["suncrusader",58,6,25,20,14,16,95,6,0,0,0,12,0,["Живой","Большое существо","Ослепительный разбег","Солнечный скакун"]]
,["sunrider",58,6,22,18,14,16,90,5,0,0,0,11,0,["Живой","Большое существо","Разбег"]]
,["swolf",59,4,5,3,3,5,25,6,0,0,0,14,0,["Живой","Атака стаей"]]
,["taskmaster",106,3,6,5,5,8,40,5,0,0,0,9,1592,["Живой","Аура храбрости"]]
,["tengu",63,5,21,13,13,17,45,7,0,0,0,12,480,["Живой","Летающее существо","Смертельная атака","Свирепое возмездие"]]
,["tenguup",63,5,25,17,15,19,60,8,0,0,0,12,705,["Живой","Летающее существо","Смертельная атака","Свирепое возмездие"]]
,["thane",8,6,15,25,8,12,100,8,0,0,0,11,1209,["Живой","Большое существо","Летающее существо","Иммунитет к молниям","Телепортация","Удар бури"]]
,["thiefarcher",72,4,12,6,6,10,40,5,12,0,0,13,413,["Живой","Стрелок","Нет штрафов в ближнем бою","Отравляющий удар"]]
,["thiefmage",72,4,8,7,5,9,30,4,0,0,0,11,506,["Живой","Колдун"]]
,["thiefwarrior",72,4,10,8,7,12,45,6,0,0,0,11,279,["Живой","Враг не сопротивляется"]]
,["throwgnom",56,3,7,8,3,5,24,4,8,0,0,11,164,["Живой","Стрелок","Оглушающий удар","Оглушающий выстрел"]]
,["thunderbird",5,5,20,10,11,15,65,9,0,0,0,12,590,["Живой","Большое существо","Летающее существо","Переносчик","Удар молнией"]]
,["thunderlord",8,6,15,25,9,14,120,8,0,0,0,11,1389,["Живой","Большое существо","Летающее существо","Иммунитет к молниям","Телепортация","Удар бури","Нежданная буря"]]
,["tikovka",60,0,31,31,21,31,310,4,"-",0,0,8,0,["Живой"]]
,["titan",3,7,30,30,40,70,190,6,5,0,0,10,3442,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Иммунитет к влиянию на разум","Зов молний"]]
,["tombraider",63,2,4,4,2,3,10,6,0,0,0,10,0,["Живой","Окопаться","Устойчивость к проклятиям","Мастер по ловушкам"]]
,["tombraiderup",63,2,4,5,2,3,12,6,0,0,0,11,0,["Живой","Окопаться","Устойчивость к проклятиям","Эксперт по ловушкам"]]
,["tormentor",52,5,14,10,15,20,80,6,0,0,0,10,0,["Живой","Огнеупорная кожа","Уязвимость к Свету","Вкус боли","Втягиваемые шипы"]]
,["traitor",63,2,5,4,3,5,9,4,10,0,0,9,0,["Живой","Стрелок","Аморальность","Побег"]]
,["trapper",9,1,1,3,1,1,7,4,0,0,0,10,16,["Живой","Бурлящая кровь","Трусость","Установка капканов"]]
,["treant",4,6,19,27,7,17,175,6,0,0,0,7,966,["Живой","Большое существо","Ярость","Оплетающие корни"]]
,["troglodyte",54,1,4,3,1,3,5,4,0,0,0,11,31,["Живой","Иммунитет к ослеплению"]]
,["troglodyteup",54,1,5,4,1,3,6,5,0,0,0,11,32,["Живой","Аура страха","Иммунитет к ослеплению"]]
,["troll",54,6,23,21,16,24,150,5,0,0,0,10,1032,["Живой","Большое существо","Большой щит","Жажда крови"]]
,["udav",61,9,100,35,190,200,816,0,127,0,0,5,0,["Живой","Стрелок","Большое существо","Стрельба без штрафов"]]
,["unicorn",4,5,12,12,10,20,57,7,0,0,0,12,390,["Живой","Большое существо","Аура магического сопротивления"]]
,["untamedcyc",9,7,30,27,45,57,225,5,0,0,0,9,2606,["Живой","Большое существо","Штраф за стрельбу","Бурлящая кровь","Пожирание гоблинов","Метание гоблинов","Сокрушающий удар"]]
,["upleviathan",67,7,35,35,45,65,250,5,0,0,0,10,0,["Живой","Большое существо","Иммунитет к холоду"]]
,["upseamonster",67,5,18,16,15,24,105,6,0,0,0,9,0,["Живой","Большое существо","Регенерация","Смертельный удар"]]
,["upsiren",67,4,10,8,6,9,24,5,0,0,0,12,0,["Живой","Колдун","Иммунитет к влиянию на разум"]]
,["valkyrie",64,5,16,11,14,18,61,7,0,0,0,12,506,["Живой","Летающее существо","Колдун","Двойной удар","Непробиваемость огнем 50%","Защита от стрел"]]
,["vampire",2,4,6,6,6,8,30,6,0,0,0,11,256,["Нежить","Враг не сопротивляется","Осушение"]]
,["vampire6",65,6,19,16,13,14,80,4,0,0,0,11,0,["Нежить","Летающее существо","Телепортация","Уязвимость к Свету","Вне времени","Объятия вампира"]]
,["vampirelord",2,4,9,9,7,11,35,7,0,0,0,11,344,["Нежить","Летающее существо","Враг не сопротивляется","Осушение","Телепортация"]]
,["vampirelord6",65,6,22,20,14,16,95,5,0,0,0,12,0,["Нежить","Летающее существо","Телепортация","Уязвимость к Свету","Вне времени","Хватка вампира"]]
,["vampireprince",102,4,9,9,5,13,40,8,0,0,0,11,388,["Нежить","Летающее существо","Осушение","Телепортация","Оцепенение"]]
,["varan",63,5,7,13,4,7,60,6,1,0,0,9,0,["Живой","Стрелок","Большое существо","Нет штрафов в ближнем бою","Взрывной выстрел"]]
,["varg",56,4,18,14,11,15,44,7,0,0,0,11,0,["Живой","Большое существо","Ярость","Жажда крови","Игнорирование защиты 30%","Грозный взгляд"]]
,["verblud",56,3,10,4,6,10,35,4,0,0,0,10,172,["Живой","Большое существо","Выносливость","Надёжная позиция","Норовистый скакун"]]
,["vermin",107,1,3,3,1,4,6,6,0,0,0,13,39,["Живой","Демоническое существо","Откачивание маны"]]
,["vestal",58,3,5,4,5,7,25,5,0,0,0,11,0,["Живой","Ослепление","Исцеление (6)"]]
,["vindicator",101,3,8,8,2,5,23,4,0,0,0,8,121,["Живой","Ярость","Большой щит","Колун"]]
,["vorovka",72,4,12,6,8,11,30,7,0,0,0,13,0,["Живой","Ослабляющий удар","Удар и возврат","Невидимость"]]
,["vsad_unit",69,7,35,35,30,40,200,6,0,0,0,10,0,["Живой","Большое существо","Аура храбрости"]]
,["vulture",63,4,9,7,8,11,40,7,0,0,0,11,235,["Живой","Большое существо","Летающее существо","Падальщик"]]
,["wanizame",56,1,7,7,3,7,31,5,0,0,0,9,0,["Живой","Ужасная рана","Амфибия","Кровавое безумие","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["wardancer",4,2,4,3,3,5,12,6,0,0,0,15,91,["Живой","Боевое па"]]
,["warden",78,4,6,10,8,15,39,5,0,0,0,9,145,["Живой","Грозный взгляд","Очищающий удар","Сковывающий удар"]]
,["warmong",109,3,4,6,3,5,20,4,0,0,0,9,102,["Живой","Ярость","Бурлящая кровь","Задира","Свирепое возмездие"]]
,["warrior",9,3,5,2,2,5,12,4,0,0,0,10,55,["Живой","Ярость","Бурлящая кровь"]]
,["water",68,4,8,8,8,12,43,5,0,0,0,10,460,["Элементаль","Колдун","Иммунитет к холоду"]]
,["wbear",55,5,18,11,11,13,55,6,0,0,0,9,0,["Живой","Большое существо","Ярость","Удар лапой","Непробиваемость водой 50%","Выжидание"]]
,["wdancer",104,2,6,6,4,6,14,7,0,0,0,15,135,["Живой","Ловкость"]]
,["wendigo",55,4,8,5,7,10,25,5,0,0,0,12,0,["Живой","Осушение","Иммунитет к холоду"]]
,["wendigoup",55,4,11,10,9,12,35,5,0,0,0,13,339,["Живой","Осушение","Иммунитет к холоду","Игнорирование защиты 15%"]]
,["wfassault",61,7,50,100,5,10,100,5,30,0,0,10,0,["Живой","Стрелок","Двойной выстрел","Штурм"]]
,["whitebearrider",108,3,6,14,5,6,30,7,0,0,0,11,186,["Живой","Большое существо","Ярость","Медвежий рев"]]
,["whitetiger",59,4,19,19,6,8,35,7,0,0,0,13,260,["Живой","Большое существо","Кошачьи рефлексы"]]
,["wight",2,6,24,22,21,25,95,6,0,0,0,11,962,["Нежить","Большое существо"]]
,["wisp",56,2,5,5,1,3,10,7,0,0,0,12,0,["Нежить","Летающее существо","Дух","Нематериальность"]]
,["wolfraider",5,2,7,3,2,3,12,6,0,0,0,11,71,["Живой","Большое существо","Тройной удар"]]
,["wolfrider",5,2,5,1,2,3,10,6,0,0,0,11,59,["Живой","Большое существо","Двойной удар"]]
,["wraith",2,6,26,24,25,30,100,6,0,0,0,11,1001,["Нежить","Большое существо","Смертельная хватка"]]
,["wyvern",9,6,17,17,15,25,90,6,0,0,0,10,703,["Живой","Большое существо","Летающее существо","Регенерация"]]
,["yaga",56,3,13,13,10,13,43,7,0,0,0,11,0,["Живой","Летающее существо","Колдун"]]
,["yascher",56,1,6,11,3,5,44,6,0,0,0,10,0,["Живой","Большое существо","Непробиваемость огнем 50%","Смертельная атака"]]
,["yascherup",56,4,8,14,4,5,49,7,0,0,0,11,0,["Живой","Большое существо","Смертельная атака","Обжигающий удар"]]
,["yeti",55,6,22,25,12,22,280,6,0,0,0,7,0,["Живой","Большое существо","Ярость","Иммунитет к холоду"]]
,["yetiup",55,6,25,28,16,23,290,6,0,0,0,8,0,["Живой","Большое существо","Ярость","Жажда крови","Иммунитет к холоду","Атака страхом"]]
,["yukionna",76,6,18,13,14,16,72,6,12,0,0,11,0,["Живой","Стрелок","Стрельба без штрафов","Амфибия","Ледяные ласки","Непробиваемость водой 50%","Уязвимость к воздуху"]]
,["zasad",63,5,17,12,8,12,70,5,0,0,0,12,443,["Живой","Животный яд","Невидимость","Паралич"]]
,["zealot",101,5,20,14,9,12,80,5,10,0,0,10,1752,["Живой","Стрелок","Колдун","Нет штрафов в ближнем бою","Очищение"]]
,["zerg",59,4,11,6,6,10,40,7,0,0,0,16,0,["Живой","Большое существо","Ярость","Отбрасывающий удар","Живая броня"]]
,["zhricaalt",10,5,14,11,4,7,50,6,10,0,0,9,1100,["Живой","Стрелок","Маленькое существо","Колдун","Непробиваемость огнем 25%","Хранитель тайн"]]
,["zhryak",53,6,44,33,22,33,99,5,0,0,0,11,0,["Живой","Колдун","Жажда крови","Демоническое существо"]]
,["zombie",2,2,1,2,1,2,17,4,0,0,0,6,46,["Нежить","Ярость"]]
,["zpirate",79,6,20,5,10,20,150,4,0,0,0,8,827,["Нежить","Большое существо","Оглушающий удар","Сопротивление магии 50%","Ослабляющий удар","Отравляющая аура","Пират"]]
,["zpirateup",79,6,20,10,10,20,170,4,0,0,0,9,0,["Нежить","Большое существо","Оглушающий удар","Сопротивление магии 50%","Ослабляющий удар","Отравляющая аура","Могучий удар","Пират"]]];
// let monsterData = Object.keys(mob_rus_exp).reduce((t, x, i) => [...t, `{ id: ${i + 1}, name: '${mob_rus_exp[x][2]}', title: isEn ? '${x}' : '${x}', experience: ${mob_rus_exp[x][0]}, health: ${mob_rus_exp[x][1]}, canFly: ${mob_rus_exp[x][3] == 1 ? 'true' : 'false'} }`], []);
// let monsterData = monsters.reduce((t, x, i) => [...t, `{ name: '${x.name}', title: "${x.title}", experience: ${x.experience}, health: ${x.health}, canFly: ${x.canFly}, newYear: false }`], []);
// console.log(`[${monsterData.join(", ")}]`);
//deleteValue("monsters");
const newMonsters = JSON.parse(getValue("monsters", "[]"));
newMonsters.forEach(x => {
    let baseMonster = monsters.find(y => y.name == x.name);
    if(baseMonster) {
        baseMonster.wanted = x.wanted ? true : false;
        if(x.experience > 0 && x.health > 0) {
            baseMonster.title = x.title;
            baseMonster.enTitle = x.enTitle;
            baseMonster.experience = x.experience;
            baseMonster.health = x.health;
            baseMonster.canFly = x.canFly ? true : false;
            baseMonster.newYear = x.newYear ? true : false;
        }
    } else {
        monsters.push(x);
    }
});
monsters.sort(sortBy(isEn ? "enTitle" : "title"));
const addedMonsters = monsters.filter(x => x.isNew);
if(addedMonsters.filter(x => !x.name.startsWith("bandit")).length > 0) {
    console.log(addedMonsters.filter(x => !x.name.startsWith("bandit")).map(x => `{ name: "${x.name}", title: "${x.title}", enTitle: "${x.enTitle}", health: ${x.health}, experience: 0 }`).join(", "));
}
for(const monster of monsters) {
    const monsterParameters = monsterParametersList.find(x => x[0] == monster.name);
    if(monsterParameters) {
        monster.castle = monsterParameters[1];
        monster.tier = monsterParameters[2];
        monster.attack = monsterParameters[3];
        monster.defense = monsterParameters[4];
        monster.minDamage = monsterParameters[5];
        monster.maxDamage = monsterParameters[6];
        monster.speed = monsterParameters[8];
        monster.shots = monsterParameters[9];
        monster.mana = monsterParameters[10];
        monster.range = monsterParameters[11];
        monster.initiative = monsterParameters[12];
    }
    monster.abilities = monsterParameters ? monsterParameters[14] : [];
}
//console.log(monsters);

const mercenaryTesks = isEn ? ["army", "conspirators", "invaders", "monster", "raid", "vanguard", "brigands"] : ["армии", "заговорщики", "захватчики", "монстры", "набеги", "отряды", "разбойники"];
var warlogProcessing = false;
var terminateProcess = false;
const attackWeight = 3;
const defenceWeight = 1;
const isEvent = location.pathname == "/tj_event2.php" || location.pathname == "/recruit_event.php" || location.pathname == "/lg_event.php";
const heroParamsIds = { pa: "attack", pd: "defense", pp: "power", pk: "knowledge", pl: "luck", pm: "morale" };

addStyle(`
.script-settings-panel {
    ${isMobileDevice ? "" : "top: 50%; transform: translateY(-50%);"}
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin: auto;
    padding: 0;
    width: fit-content;
    background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);
    border: 1mm ridge rgb(211, 220, 50);
}
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
.separator {
  display: flex;
  align-items: center;
  text-align: center;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #000;
}

.separator:not(:empty)::before {
  margin-right: .25em;
}

.separator:not(:empty)::after {
  margin-left: .25em;
}
input[type=number] {
    width: 70px;
}
.event_hero_params {
    display: inline-block !important;
}
.event_hero_params>div {
    display: inline-block;
    vertical-align: middle;
}
`);
//parseMonsterParameters();
main();
async function main() {
    refreshRecruitPrices();
    showArmiesHealth();
    //console.log(Array.isArray("asfasdf"))
    if(location.pathname == "/leader_army.php") {
        const units = [...win.obj];
        let newLeadership = "";
        monsters.filter(x => {
            if(x.isBuilding) {
                return false;
            }
            const finded = units.find(y => y && y.monster_id == x.name);
            const result = finded && finded.cost != x.leadership;
            if(result) {
                newLeadership += `\n${x.title}, старое: ${x.leadership}, новое: ${finded.cost}`;
            }
            return result;
        });
        if(newLeadership) console.log(newLeadership);
    }
    if(location.pathname == "/mercenary_guild.php") {
        const tasksPanel = document.querySelector("div#set_mobile_max_width"); // document.querySelector("body > center > table table td[rowspan='2']");
        let rejectButtonContainer = tasksPanel.querySelector("center:has(>form.global_input)");
        if(!rejectButtonContainer) {
            addElement("div", { style: "flex-basis: 100%; height: 0;"}, tasksPanel);
            rejectButtonContainer = addElement("div", {} , tasksPanel);
        }
        const warStatistics = JSON.parse(getValue(`WarStatistics${PlayerId}`, "{}"));
        const warlogScanned = warStatistics.minWarId > 0 && warStatistics.firstWarId == warStatistics.minWarId;

        //const refreshRef = Array.from(document.querySelectorAll("a[href='/mercenary_guild.php']")).find(x => x.innerText == (isEn ? "Refresh" : "Обновить"));
        const getWarsStatisticsName = warlogScanned ? (isEn ? "Append war statistics" : "Пополнить боевую статистику") : (isEn ? "Get war statistics" : "Получить боевую статистику");
        const getWarsStatistics = addElement("input", { id: "getWarsStatistics", style: "border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: auto; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s; transition: filter .15s;", type: "button", value: getWarsStatisticsName }, rejectButtonContainer);
        getWarsStatistics.addEventListener("click", function(e) { readWarlog(e); });
        const clearWarsStatisticsButton = addElement("input", { id: "clearWarsStatisticsButton", style: "border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: auto; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s; transition: filter .15s;", type: "button", value: isEn ? "Clear statistics" : "Очистить статистику" }, rejectButtonContainer);
        clearWarsStatisticsButton.addEventListener("click", clearWarsStatistics);

        // const correctWarsStatisticsButton = addElement("input", { style: "border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #592c08; font-family: verdana,geneva,arial cyr; position: relative; text-align: center; font-weight: 700; background: url(../i/homeico/art_btn_bg_gold.png) #dab761; background-size: auto; background-size: 100% 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px #fce6b0,inset 0 0 0 2px #a78750,0 0 0 1px rgba(0,0,0,.13); line-height: 25px; cursor: pointer; transition: -webkit-filter .15s; transition: filter .15s;", type: "button", value: isEn ? "Correct statistics" : "Скорректировать статистику" }, rejectButtonContainer);
        // correctWarsStatisticsButton.addEventListener("click", function(e) { correctWarsStatistics(e); });

        if(tasksPanel) {
            addMercAgenciesTable(tasksPanel);
            const enemies = tasksPanel.querySelectorAll("b");
            let mayAutoskipTasks = true;
            for(const enemy of enemies) {
                const enemyExec = /(.+) {(\d+)}/.exec(enemy.innerText);
                if(enemyExec) {
                    const enemyName = enemyExec[1];
                    const enemyLevel = enemyExec[2];
                    let taskType;
                    // История
                    const historyContainer = addElement("div", { id: `historyContainer${enemyName}`, style: "display: none;" }, enemy, "afterend");
                    const wars = restoreWars(enemyName, PlayerId); // JSON.parse(getPlayerValue(enemyName, "[]")).map(x => JSON.parse(x));
                    //console.log(wars);
                    if(wars.length > 0) {
                        //console.log(getPlayerValue(enemyName, "[]"));
                        for(const war of wars) {
                            historyContainer.insertAdjacentHTML("beforeend", `<div><a href="/warlog.php?warid=${war.id}" target="_blank">${war.isWin ? "<b>" : ""}${war.date.substr(0, 16).replace("T", " ")} <span title="${isEn ? "Player level" : "Уровень игрока"}">(${war.playerLevel})</span> {${war.enemyLevel}}${war.isWin ? "</b>" : ""}</a></div>`);
                        }
                        const historyToggler = addElement("div", { title: isEn ? "History" : "История", style: "display: inline-block; cursor: pointer;", innerHTML: `<img spoiled="true" src="https://dcdn.heroeswm.ru/i/inv_im/btn_expand.svg" style="vertical-align: middle;">` }, enemy, "afterend");
                        historyToggler.addEventListener("click", function(e) {
                            const historyContainer = document.getElementById(`historyContainer${enemyName}`);
                            historyContainer.style.display = (historyContainer.style.display == "none" ? "block" : "none");
                            e.target.setAttribute("spoiled", !(e.target.getAttribute("spoiled") == "true"));
                            e.target.style.transform = e.target.getAttribute("spoiled") == "true" ? 'rotate(0deg)' : 'rotate(90deg)';
                        });
                    }
                    let creatueName;
                    let isMonster = false;
                    
//const mercenaryTesks = isEn ? ["army", "conspirators", "invaders", "monster", "raid", "vanguard", "brigands"] : ["армии", "заговорщики", "захватчики", "монстры", "набеги", "отряды", "разбойники"];

                    if(enemyName.toLowerCase().includes(isEn ? "-raids" : "-набеги")) {
                        creatueName =  enemyName.replace(isEn ? "-raids" : "-набеги", "");
                        taskType = "raid";
                    }
                    if(enemyName.toLowerCase().includes(isEn ? "-monster" : "-монстр")) {
                        creatueName =  enemyName.replace(isEn ? "-monster" : "-монстр", "");
                        isMonster = true;
                        taskType = "monster";
                    }
                    if(enemyName.toLowerCase().includes(isEn ? "army" : "армия")) {
                        taskType = "army";
                    }
                    if(enemyName.toLowerCase().includes(isEn ? "- conspirators" : " заговорщики")) {
                        taskType = "conspirators";
                    }
                    if(enemyName.toLowerCase().includes(isEn ? "invaders" : "захватчики")) {
                        taskType = "invaders";
                    }
                    if(enemyName.toLowerCase().includes(isEn ? "vanguard of " : "отряд ")) {
                        taskType = "vanguard";
                    }
                    if(enemyName.toLowerCase().includes(isEn ? "brigands" : "разбойники")) {
                        taskType = "brigands";
                    }
                    //console.log(`enemyName: ${enemyName}, taskType: ${taskType}`);
                    if(taskType) {
                        const skipLevel = parseInt(getPlayerValue(`${taskType}TaskLevelToSkip`, "0"));
                        //console.log(`enemyName: ${enemyName}, enemyLevel: ${enemyLevel}, skipLevel: ${skipLevel}, taskType: ${taskType}`);
                        if(skipLevel > 0) {
                            if(parseInt(enemyLevel) < skipLevel) {
                                enemy.style.backgroundColor = "lightgreen";
                                mayAutoskipTasks = false;
                            }
                        } else {
                            mayAutoskipTasks = false;
                        }
                    } else {
                        mayAutoskipTasks = false;
                    }
                    if(creatueName) {
                        const monster = monsters.find(x => (isEn ? x.enTitle : x.title) == creatueName);
                        if(monster) {
                            enemy.innerHTML = enemy.innerHTML.replace(creatueName, `<a href="army_info.php\?name=${monster.name}">${creatueName}</a>`);
                            if(isMonster) {
                                let monstersDataIds = JSON.parse(getValue("MonstersDataIds", "{}"));//                                console.log(monstersDataIds);
                                let monstersDataId = monstersDataIds[monster.title];
                                if(!monstersDataId) {
                                    const doc = await getRequest("https://daily.heroeswm.ru/help/gn/monsters.php");
                                    monstersDataIds = Array.from(doc.querySelectorAll("select#id > option")).filter(x => parseInt(x.value) > 0).reduce((t, x) => { t[x.innerText] = parseInt(x.value); return t; }, {});
                                    console.log(monstersDataIds);
                                    setValue("MonstersDataIds", JSON.stringify(monstersDataIds));
                                    monstersDataId = monstersDataIds[monster.title];
                                }
                                if(monstersDataId) {
                                    enemy.addEventListener("mouseenter", async function(e) {
                                        let tooltipDiv = document.getElementById(`monster${monster.name}TooltipDiv`);
                                        if(!tooltipDiv) {
                                            e.target.style.position = "relative";
                                            tooltipDiv = addElement("div", { id: `monster${monster.name}TooltipDiv`, innerHTML: isEn ? "Loading..." : "Загрузка...", style: "position: absolute; left: 0px; z-index: 150;" }, e.target);

                                            const monsterDataDoc = await getRequest(`https://daily.heroeswm.ru/help/gn/monsters.php?id=${monstersDataId}`);
                                            // const images = [...monsterDataDoc.querySelectorAll("img[src^='../']")];
                                            // //images.forEach(x => x.src.replace("https://www.heroeswm.ru/", "https://daily.heroeswm.ru/"))
                                            // images.forEach(x => x.src = `https://daily.heroeswm.ru/img/creatures/icons/crossman.png`)
                                            // console.log(images.map(x => x.src));
                                            // console.log(images.filter(x => x.src.includes("https://www.heroeswm.ru/")));
                                            const monsterLevelsDataTable = monsterDataDoc.querySelector("table.Table");
                                            const currentLevelRow = Array.from(monsterLevelsDataTable.rows).find(x => x.cells[0].innerHTML.includes(`{${enemyLevel}}`));
                                            currentLevelRow.style.backgroundColor = "yellow";
                                            tooltipDiv.innerHTML = monsterLevelsDataTable.outerHTML;
                                            const table = tooltipDiv.querySelector("table");
                                            table.style.whiteSpace = "nowrap";
                                        }
                                        const anchorRect = e.target.getBoundingClientRect();
                                        tooltipDiv.style.top = `${anchorRect.height}px`;
                                        tooltipDiv.style.display = "";
                                        //console.log(`tooltipDiv.style.display: ${tooltipDiv.style.display}`);
                                    });
                                    enemy.addEventListener("mouseleave", function(e) { const tooltipDiv = document.getElementById(`monster${monster.name}TooltipDiv`); if(tooltipDiv) { tooltipDiv.style.display = "none"; } });
                                }
                            }
                        }
                    }
                }
            }
            if(getPlayerBool("autoSkipMercenaryTasks") && mayAutoskipTasks) {
                const declineForm = document.querySelector(`form.global_input:has(input[value="${isEn ? "Decline" : "Отказаться"}"])`);
                //console.log(declineForm);
                if(declineForm) {
                    declineForm.submit();
                }
            }
        }
    }
    createSettingsCaller();
    const settingsButtonContainer = document.querySelector("div#hwm_map_objects_and_buttons");
    observe(settingsButtonContainer, createSettingsCaller);
    applyGreenPeace();
    if(!getPlayerBool("hideHunts")) {
        Array.from(document.querySelectorAll("tr > td[colspan*='2']")).filter(x => x.innerHTML == (isEn ? "You are already in a challenge!" : "Вы уже в заявке!")).forEach(x => { x.align = 'right'; x.innerHTML = `<a href="map.php?action=skip">${isEn ? "Skip" : "Пройти мимо"}</a>`; }); //добавить ссылку на пропуск охот, если стоишь в заявке на бой или карточную игру
        if(getPlayerBool("show_archive")) {
            for(const ref of document.querySelectorAll("div > a[href*='mid=']")) {
                const s = ref.href.split('&mid');
                ref.insertAdjacentHTML("afterEnd", `<br><a href="${s[0]}&show_archive=1&mid${s[1]}" target=_blanc><img border="0" title="${isEn ? "Archive record before 2015-03-01" : "Рекорд из архива (до 01.03.2015"}" src="http://dcdn.heroeswm.ru/i/s_knowledge.gif"></a>`); //добавить ссылку на рекорд из архива
            }
        }
        transformMapHunts();
    }
    huntHelpers();
    Array.from(document.querySelectorAll("a[href*='group_wars.php']")).forEach(x => x.href = x.href.replace("group_wars.php", "group_wars.php?filter=hunt")); //заменяет ссылку в групповые бои на такую же с выделением свободных охот
    if(location.pathname == "/plstats_hunters.php") {
        // const monstersInfo = Array.from(document.querySelectorAll("a[href^='army_info.php?name=']")).map(x => ({ name: getUrlParamValue(x.href, "name"), title: x.innerText }));
        // console.log(monstersInfo.filter(x => !monsters.map(y => y.name).includes(x.name)));

        // monsters.forEach(x => {
            // const monsterInfo = monstersInfo.find(y => y.name == x.name);
            // if(isEn && monsterInfo) {
                // x.enTitle = monsterInfo.title;
            // }
        // })
        // monsters.forEach(x => {
            // const monsterInfo = monstersInfo.find(y => y.title == x.title);
            // if(x.name != monsterInfo.name) {
                // x.imageName = x.name;
                // x.name = monsterInfo.name;
            // }
        // })
        //console.log(JSON.stringify(monsters));
        //console.log(monstersInfo.filter(x => !monsters.map(y => y.title).includes(x.title)));
        addHuntRecordsArchiveReference();
    }
    if(location.pathname == "/pl_hunter_stat.php") {
        initLoadSemaphoresButton();
    }
    if(location.pathname == "/recruit_event_set.php") {
        const recruit_event_join_block = document.getElementById("recruit_event_join_block");
        if(recruit_event_join_block) {
            observe(recruit_event_join_block, function() { refreshRecruitPrices(); });
        }
        const revent_silver_count = document.getElementById("revent_silver_count");
        revent_silver_count.style.display = "inline-block";
        
        const scriptSettingsContainer = addElement("div", {}, revent_silver_count.parentNode);
        const recruitMightPerBattleContainer = addElement("input", { id: "recruitMightPerBattleContainer", type: "number", style: "width: 70px; display: inline-block;", value: getPlayerValue("recruitMightPerBattle", 5000), placeholder: "5000", title: isEn ? "Enter the amount of penetration power per battle" : "Введите количество пробиваемой за бой мощи", onfocus: "this.select();" }, scriptSettingsContainer);
        recruitMightPerBattleContainer.addEventListener("change", function() { setPlayerValue("recruitMightPerBattle", Number(this.value)); });

        const recruitHeroAttackInput = addElement("input", { id: "recruitHeroAttackInput", type: "number", style: "width: 70px; display: inline-block;", value: getPlayerValue("recruitHeroAttack", 50), placeholder: "50", title: isEn ? "Hero attack" : "Атака героя", onfocus: "this.select();" }, scriptSettingsContainer);
        recruitHeroAttackInput.addEventListener("change", function() { setPlayerValue("recruitHeroAttack", Number(this.value)); });

        const recruitHeroDefenseInput = addElement("input", { id: "recruitHeroDefenseInput", type: "number", style: "width: 70px; display: inline-block;", value: getPlayerValue("recruitHeroDefense", 50), placeholder: "50", title: isEn ? "Hero defense" : "Защита героя", onfocus: "this.select();" }, scriptSettingsContainer);
        recruitHeroDefenseInput.addEventListener("change", function() { setPlayerValue("recruitHeroDefense", Number(this.value)); });
    }
}
async function showArmiesHealth() {
    let armyContainers = [];
    if(location.pathname == "/leader_guild.php" && getPlayerBool("armiesInfoInLeadersGuild", true) || (location.pathname == "/tj_single.php" || location.pathname == "/leader_rogues.php" || location.pathname.endsWith("_event.php") || location.pathname.endsWith("_event2.php")) && getPlayerBool("armiesInfoAtTheEventsPage", true)) {
        let unitSources = [...document.querySelectorAll("div.cre_creature > a[href^='army_info.php?name=']")];
        unitSources = [...unitSources, ...document.querySelectorAll("div.hwm_dynamic_portrait > div > a[href^='army_info.php?name=']")];
        const global_container_blockArray = unitSources.map(x => x.closest("div.global_container_block.event_old_chrome_column")).filter(onlyUnique);
        const armyUnits = unitSources.map((x, i) => {
            let armyContainer;
            if(location.pathname == "/pirate_self_event.php") {
                armyContainer = getParent(x, "td");
            } else {
                const parentDiv = x.parentNode.parentNode; //console.log(`parentDiv.tagName: ${parentDiv.tagName}, parentDiv.style.display: ${parentDiv.style.display}`);
                if(parentDiv.tagName == "DIV" && parentDiv.style.display == "flex") {
                    armyContainer = parentDiv;
                } else {
                    let deep = 3;
                    if(location.pathname == "/tj_single.php" && x.closest("div.global_container_block.event_old_chrome_column") == global_container_blockArray[0]) {
                        deep = 5;
                    }
                    if(location.pathname == "/tj_event2.php" && x.closest("div.global_container_block.event_old_chrome_column") == global_container_blockArray[0]) {
                        deep = 4;
                    }
                    armyContainer = getParent(x, "div", deep); //console.log(`deep: ${deep}`); //console.log(armyContainer);
                }
            }
            return { armyContainer: armyContainer };
        });
        armyContainers = [...armyContainers, ...groupToArray(armyUnits, x => x.armyContainer).map(x => x.key)];
    }
    armyContainers = armyContainers.map(x => {
        let isPlayerArmy = false;
        if(recruitEventPlayerArmyDiv && recruitEventPlayerArmyDiv == x 
            || glEventPlayerArmyDiv && glEventPlayerArmyDiv == x
            || pairedPortalEventPlayerArmyDiv && pairedPortalEventPlayerArmyDiv == x) {
            isPlayerArmy = true;
        }
        return { armyContainer: x, isPlayerArmy: isPlayerArmy };
    });
    armyContainers.sort(sortBy("isPlayerArmy", true)); //console.log(armyContainers);
    for(const x of armyContainers) {
        await showArmyHealth(x);
        observe(x.armyContainer, async function() { await showArmyHealth(x); });
    }
}
async function showArmyHealth(armyContainerPack) {
    const armyContainer = armyContainerPack.armyContainer; //console.log(armyContainerPack);
    
    // Улучшение визуализации параметров вражеских героев
    const heroParamsContainer = armyContainer.nextElementSibling?.innerHTML.includes(isEn ? "Combat level:" : "Боевой уровень:") ? armyContainer.nextElementSibling : null;
    const hero = { level: 0, attack: 0, defense: 0, power: 0, knowledge: 0, luck: 0, morale: 0 };
    if(armyContainerPack.isPlayerArmy) {
        hero.attack = Number(getPlayerValue("recruitHeroAttack", 50));
        hero.defense = Number(getPlayerValue("recruitHeroDefense", 50));
    }
    if(heroParamsContainer) {
        hero.level = Number(heroParamsContainer.querySelector("b").innerText);
        heroParamsContainer.querySelector("br")?.remove();
        const paramsDiv = heroParamsContainer.querySelector("div:has(img[src*='attr_attack'])");
        paramsDiv.style.display = "inline-block";
        paramsDiv.style.verticalAlign = "middle";

        for(const key in heroParamsIds) {
            const paramBold = paramsDiv.querySelector(`div#${key}>b`);
            if(paramBold) {
                const paramValue = Number(paramBold.innerText);
                hero[heroParamsIds[key]] = paramValue;
            }
        }
        console.log(hero);
    }
    //console.log(armyContainer);
    let unitSources = [...armyContainer.querySelectorAll("a[href^='army_info.php?name=']")];
    const units = [];
    for(const x of unitSources) {
        //console.log(`x.href: ${x.href}`);
        const name = getUrlParamValue(x.href, "name");
        const monster = await getMonster(x.href);
        units.push({
            name: name,
            amount: parseInt((x.parentNode.querySelector("div.cre_amount") || x.parentNode.parentNode.querySelector("div.cre_amount"))?.innerText
            || x.parentNode.querySelector("div.cre_amount48")?.innerText
            || 0),
            health: monster?.health || 0,
            experience: monster?.experience || 0,
            leadership: monster?.leadership || 0,
            isEmptyLeadership: !monster.leadership ? true : false,
            title: monster ? (isEn ? monster.enTitle : monster.title) : "",
            isAbsent: monster ? false : true,
            isBuilding: monster?.isBuilding || false,
            might: getCreatureMightHeuristic(monster, hero)
        });
        const creatureDiv = x.closest("div.cre_creature") || x.closest("div.show_hint");
        if(creatureDiv) {
            const borderColors = [];
            if(getPlayerBool("showPoisonersFrame") && (monster.abilities.includes("Отравляющий удар") || monster.abilities.includes("Животный яд"))) {
                borderColors.push("#28e128");
            }
            if(getPlayerBool("showCastersFrame") && monster.abilities.includes("Колдун")) {
                borderColors.push("#3e47cc");
            }
            if(getPlayerBool("showShootersFrame") && monster.abilities.includes("Стрелок")) {
                borderColors.push("red");
            }
            if(borderColors.length > 0) {
                creatureDiv.style.border = `2px solid`;
                creatureDiv.style.borderImage = `linear-gradient(to right, ${borderColors.join(" ,")}) 1`;
            }
        } else {
            console.log(x);
        }
    }
    //console.log(units);
    const totalHealth = units.reduce((t, x) => t + x.amount * x.health, 0);
    const totalExperience = units.reduce((t, x) => t + x.amount * x.experience, 0);
    const totalLeadership = units.reduce((t, x) => t + x.amount * x.leadership, 0);
    const totalAttack = Math.round(units.reduce((t, x) => t + x.amount * x.might.attack, 0));
    const totalDefense = Math.round(units.reduce((t, x) => t + x.amount * x.might.defense, 0));
    const totalMightAdd = Math.round(units.reduce((t, x) => t + x.amount * x.might.mightAdd, 0));
    const totalMightMulti = Math.round(units.reduce((t, x) => t + x.amount * x.might.mightMulti, 0));
    const totalMightAvgSq = Math.round(units.reduce((t, x) => t + x.amount * x.might.mightAvgSq, 0));
    
    let mightAddRatio = 1;
    let mightMultiRatio = 1;
    let mightAvgSqRatio = 1;
    if(isEvent) {
        if(armyContainerPack.isPlayerArmy) {
            playerArmyMightAdd = totalMightAdd;
            playerArmyMightMulti = totalMightMulti;
            playerArmyMightAvgSq = totalMightAvgSq;
        } else {
            if(playerArmyMightAdd > 0) {
                mightAddRatio = round00(totalMightAdd / playerArmyMightAdd);
            }
            if(playerArmyMightMulti > 0) {
                mightMultiRatio = round00(totalMightMulti / playerArmyMightMulti);
            }
            if(playerArmyMightAvgSq > 0) {
                mightAvgSqRatio = round00(totalMightAvgSq / playerArmyMightAvgSq);
            }
        }
        //console.log(`totalMightMulti: ${totalMightMulti}, playerArmyMightMulti: ${playerArmyMightMulti}, isPlayerArmy: ${armyContainerPack.isPlayerArmy}`);
    }
    const emptyLeadershipList = [...new Set(units.filter(x => x.isEmptyLeadership && !x.isBuilding).map(x => x.title))].join(", ");

    const absentUnits = units.filter(x => x.isAbsent && x.amount > 0).map(x => x.name).filter(onlyUnique);
    const absentHint = absentUnits.join(", ");

    const bigMonster = units.filter(x => x.title && x.amount == 0 && !x.isBuilding).map(x => x.title).filter(onlyUnique);
    const bigMonsterHint = bigMonster.join(", ");
    //console.log(`armyContainer.style.display: ${armyContainer.style.display}`);

    const buildings = units.filter(x => x.isBuilding).map(x => x.title).filter(onlyUnique);
    const buildingsHint = buildings.join(", ");
    
    const isFlex = armyContainer.style.display == "flex";
    let leadershipBlock = "";
    if(getPlayerBool("showLeadership")) {
        leadershipBlock = `<span title="${isEn ? "Leadership" : "Лидерство"}">&#10026; ${totalLeadership.toLocaleString()}${emptyLeadershipList ? `<span title="${isEn ? "Units without leadership" : "Юниты без лидерства"}: ${emptyLeadershipList}">*</span>` : ""}</span>`;
    }
    if(!isFlex) {
        //armyContainer.insertAdjacentHTML("beforeend", `<br>`);
    } else {
        armyContainer.style.flexWrap = "wrap";
        addElement("div", { style: "flex-basis: 100%; height: 0;"}, armyContainer);
    }
    armyContainer.insertAdjacentHTML("beforeend", `<div name=armyHealthAndExperience style="display: inline-block; font-size: 12px; text-align: center; width: 100%;">
<span title="${isEn ? "Health" : "Здоровье"}"><font style="color: red;">❤</font> ${totalHealth}</span>
<span title="${isEn ? "Experience" : "Опыт"}">🕮 ${totalExperience}</span>
${isEvent && getPlayerBool("showEventArmiesMightComparison") ? `<span title="${isEn ? "Attack: damage of all creatures taking into account the attack modifier" : "Атака: урон всех существ с учетом модификатора атаки"}">⚔ ${totalAttack}</span>` : ""}
${isEvent && getPlayerBool("showEventArmiesMightComparison") ? `<span title="${isEn ? "Defense: health of all creatures, taking into account the defense modifier" : "Защита: здоровье всех существ с учетом модификатора защиты"}">🛡 ${totalDefense}</span>` : ""}
${isEvent && getPlayerBool("showEventArmiesMightComparison") && !armyContainerPack.isPlayerArmy ? `<span title="${isEn ? "The ratio of the enemy army's strength to the strength of your army (average and root mean square)" : "Соотношение силы армии противника к силе вашей армии (средних и среднеквадратичных)"}">${mightAddRatio}σ/${mightMultiRatio}μ/${mightAvgSqRatio}q</span>` : ""}
${leadershipBlock}${absentHint ? `<span style="color: red; font-weight: bold;" title="${isEn ? "Mosters absent in db" : "Монстры отсутствующие в базе"} ${absentHint}">?</span>` : ""}${bigMonsterHint ? `<span title="${isEn ? "Mosters" : "Монстры"}: ${bigMonsterHint}">👹</span>` : ""}${buildingsHint ? `<span title="${isEn ? "Buildings" : "Постройки"}: ${buildingsHint}">🏠</span>` : ""}
</div>`);

    const fixedDivSelectors = ["div#tableDiv"];
    for(const fixedDivSelector of fixedDivSelectors) {
        const fixedDiv = armyContainer.closest(fixedDivSelector);
        if(fixedDiv) {
            const armyHealthAndExperience = armyContainer.querySelector("div[name=armyHealthAndExperience]");
            const armyHealthAndExperienceRect = armyHealthAndExperience.getBoundingClientRect();
            const tableDivRect = fixedDiv.getBoundingClientRect();
            fixedDiv.style.height = `${tableDivRect.height + armyHealthAndExperienceRect.height}px`;
        }
    }
}
async function getMonster(url) {
    const name = getUrlParamValue(url, "name");
    const monster = monsters.find(y => y.name == name);
    if(monster) {
        return monster;
    }
    const urlSearch = url.split("?")[1];
    let doc = await getRequest(`${path}/army_info.php?${urlSearch}`);
    const title = doc.querySelector("div.info_header_content > div > h1").innerText;
    const health = parseInt(doc.querySelector("div.scroll_content_half > img[src*='attr_hit_points.png']").closest("div").querySelector("div").innerText);

    doc = await getRequest(`https://www.lordswm.com/army_info.php?${urlSearch}`);
    const enTitle = doc.querySelector("div.info_header_content > div > h1").innerText;
    const unit = { name: name, title: title, enTitle: enTitle, health: health, isNew: true};

    const newMonsters = JSON.parse(getValue("monsters", "[]"));
    newMonsters.push(unit);
    monsters.push(unit);
    setValue("monsters", JSON.stringify(newMonsters));
    
    return unit;
}
function onlyUnique(value, index, array) { return array.indexOf(value) === index; }
async function transformMapHunts() {
    if(location.pathname != '/map.php') {
        return;
    }
    const map_hunt_block_div = document.querySelector("div#map_hunt_block_div");
    if(map_hunt_block_div) {
        const lastChild = map_hunt_block_div.lastChild;
        if(lastChild.tagName?.toLowerCase() == "br") {
            lastChild.remove();
        }
    }
    const koef = parseFloat(getPlayerValue("koef_dop_exp", 1));
    const hunts = [];
    for(const x of Array.from(document.querySelectorAll("div[id^=neut_right_block] > div:first-child > div:first-child"))) {
        const armyRef = x.querySelector("a[href^='army_info.php?name=']");
        const name = getUrlParamValue(armyRef.href, "name");
        const amount = parseInt(x.querySelector("b").innerText.match(/(\d+)/)[1]);
        const title = armyRef.innerText;
        let gold = 0;
        const goldMatch = x.innerHTML.match(new RegExp(`(\\d+) ${isEn ? "gold" : "золота"}`));
        if(goldMatch) {
            gold = parseInt(goldMatch[1]);
        }
        const monster = await getMonster(armyRef.href);
        const fullExperience = Math.round(amount * monster.experience / 5);
        let experience = Math.min(fullExperience, PlayerLevel * 500);
        if(PlayerLevel > 2) { //Если опыт меньше нижней отсечки по уровню (3+ уровни)
            experience = Math.max(experience, PlayerLevel * 100);
        }
        experience = Math.round(experience * koef); // total_exp - опыт с учетом коэф. перекача

        const isHalfAmount = x.innerHTML.includes("[1/2]");
        let diamonds = x.innerHTML.includes("diamonds.png") ? 0.1 : 0;
        const diamondsMatch = new RegExp(isEn ? "([\\d\\.]+) diamond" : "([\\d\\.]+) бриллиант").exec(x.innerHTML);
        if(diamondsMatch) {
            diamonds = parseFloat(diamondsMatch[1]);
        }
        let guildPoints = 1;
        const guildPointsMacth = x.innerText.match(/\+([2,3,5])/);
        if(guildPointsMacth) {
            guildPoints = parseInt(guildPointsMacth[1]);
        }
        hunts.push({ name: name, title: title, amount: amount, title: title, gold: gold, monster: monster, huntDescriptionPanel: x, fullExperience: fullExperience, experience: experience, isHalfAmount: isHalfAmount, diamonds: diamonds, guildPoints: guildPoints });
    }
    if(hunts.length == 0) {
        return;
    }
    console.log(hunts);
    document.title = isEn ? "Hunt found" : "Охота найдена";
    // Если находимся в режиме поиска, то пропускаем охоты, не отвечающие критериям поиска. В режиме поиска мы находимся, если включен хоть один критериев поиска.
    const isLookingFor = getPlayerBool("lookingForMarkedInList") && monsters.find(x => x.wanted) || Number(getPlayerValue("experienceLimit")) > 0 || getPlayerBool("lookingForHalfAmount") || getPlayerBool("lookingForDiamond") || getPlayerBool("lookingForFlying") || getPlayerBool("lookingForAdvancedGuildPoints");
    if(isLookingFor) {
        const found = hunts.find(isHuntMatch) ? true : false;
        if(!found) {
            const skipButton = document.querySelector(`div#map_hunt_block_div div[hint^='${isEn ? "Pass" : "Пройти"}']`);
            if(skipButton) {
                document.title = isEn ? "Unsuitable hunting" : "Неподходящая охота";
                if(getPlayerBool("skipUnmatchedHunts")) {
                    document.title = isEn ? "Hunt skipped" : "Охота пропущена";
                    skipButton.dispatchEvent(new MouseEvent('click')); //setTimeout(function() { window.location.href = location.protocol+'//'+location.hostname+'/'+'map.php?action=skip'; }, 2000);
                }
            }
        }
    }
    for(const hunt of hunts) {
        if(getPlayerBool("isShortHuntDescription")) {
            hunt.huntDescriptionPanel.innerHTML = `<a href="army_info.php?name=${hunt.name}">${hunt.title}</a> (${hunt.amount}${hunt.isHalfAmount ? "[1/2]" : ""}) ${isEn ? "guard" : "стерегут"}${hunt.gold > 0 ? ` ${hunt.gold} ${isEn ? "g." : "з."}`: ""}${hunt.diamonds > 0 ? ` ${hunt.diamonds} <img style="width: 16px; height: 16px; border: 0; vertical-align: middle;" title="${isEn ? "Diamonds" : "Бриллианты"}" src="https://dcdn.heroeswm.ru/i/r/48/diamonds.png">`: ""}`;
            hunt.huntDescriptionPanel.style.fontSize = "11px";
            if(hunt.guildPoints > 1) {
                hunt.huntDescriptionPanel.insertAdjacentHTML("beforeend", `<b>(+${hunt.guildPoints})</b>`);
            }
        }
        // История
        //correctWars(hunt.title); // Нужна только мне из-за первоначальных кривых данных
        const wars = restoreWars(hunt.title, PlayerId);//        const wars = JSON.parse(getPlayerValue(hunt.title, "[]")).map(x => JSON.parse(x));
        if(wars.length > 0) {
            const historyContainer = addElement("div", { id: `historyContainer${hunt.name}`, style: "display: none;" }, hunt.huntDescriptionPanel);
            //console.log(wars);
            for(const war of wars) {
                historyContainer.insertAdjacentHTML("beforeend", `<div><a href="/warlog.php?warid=${war.id}" target="_blank">${war.isWin ? "<b>" : ""}${war.date.substr(0, 16).replace("T", " ")} <span title="${isEn ? "Player level" : "Уровень игрока"}">(${war.playerLevel})</span> (${war.enemyLevel})${war.isWin ? "</b>" : ""}</a></div>`);
            }

            addElement("br", {}, hunt.huntDescriptionPanel.nextSibling);
            const historyToggler = addElement("div", { title: isEn ? "History" : "История", style: "display: inline-block; cursor: pointer;", innerHTML: `<img spoiled="true" src="https://dcdn.heroeswm.ru/i/inv_im/btn_expand.svg" style="vertical-align: middle;">` }, hunt.huntDescriptionPanel.nextSibling);
            historyToggler.addEventListener("click", function(e) {
                const historyContainer = document.getElementById(`historyContainer${hunt.name}`);
                historyContainer.style.display = (historyContainer.style.display == "none" ? "block" : "none");
                e.target.setAttribute("spoiled", !(e.target.getAttribute("spoiled") == "true"));
                e.target.style.transform = e.target.getAttribute("spoiled") == "true" ? 'rotate(0deg)' : 'rotate(90deg)';
            });
        }
        //

        const hp = getPlayerBool("showTotalMonstersHealth", true) ? ` <font style="font-size: 9px;color:#CD00CD">HP:<b>${hunt.monster.health * hunt.amount}</b></font>` : "";
        if(getPlayerBool("showTotalMonstersHealth", true)) {
            const amountEndIndex = hunt.huntDescriptionPanel.innerHTML.indexOf(")");
            hunt.huntDescriptionPanel.innerHTML = hunt.huntDescriptionPanel.innerHTML.substring(0, amountEndIndex) + hp + hunt.huntDescriptionPanel.innerHTML.substring(amountEndIndex);
        }
        const min_count = Math.round(hunt.amount / 5 - 0.5); //Для минимального 5% прироста, чтобы получить минимальную умелку 0.2 (20% от 1) убиваем 20% существ
        let exp_min_count = Math.min(Math.floor(hunt.monster.experience * min_count / 5), PlayerLevel * 500); //Опыт при минимальном приросте
        let exp_with_helper = Math.min(Math.round(hunt.fullExperience / 2), PlayerLevel * 500); //Опыт с помощником (50/50)
        if(PlayerLevel > 2) { //Если опыт меньше нижней отсечки по уровню (3+ уровни)
            exp_with_helper = Math.max(exp_with_helper, PlayerLevel * 35);
            exp_min_count = Math.max(exp_min_count, PlayerLevel * 14);
        }
        exp_with_helper = (exp_with_helper * koef).toFixed(0);
        exp_min_count = (exp_min_count * koef).toFixed(0);

        if(isLookingFor && isHuntMatch(hunt)) {
            hunt.huntDescriptionPanel.closest("div[id^=neut_show]").style.background = "#D1FFD1";
        }
        const fullExperienceText = hunt.experience != hunt.fullExperience ? ` (${isEn ? "from" : "из"} ${hunt.fullExperience})` : "";
        hunt.huntDescriptionPanel.insertAdjacentHTML("beforeend", `
<style>
.huntVariants {
    border-collapse: collapse;
}
.huntVariants td,
.huntVariants th {
    font-size: 7pt;
    border: 1px solid #b94a48 !important;
}
</style>
<table class="huntVariants">
    <tr><th>${isEn ? "Hunt" : "Варианты охоты"}</th><th>${isEn ? "Exp" : "Опыт"}</th><th>${isEn ? "Next amount" : "След. кол-во"}</th></tr>
    <tr><td>${isEn ? "by oneself" : "в одиночку"} 100%</td><td>${hunt.experience}${fullExperienceText}</td><td>${(hunt.amount * 1.3).toFixed(0)}</td></tr>
    <tr${getPlayerBool("enable_Exp_Half") ? "" : " style='display: none;'"}><td>${isEn ? "with a partner" : "с напарником"} 50%</td><td>${exp_with_helper}</td><td>${(hunt.amount * Math.pow(1.3, 0.5)).toFixed(0)}</td></tr>
    <tr${getPlayerBool("enable_5_procent") ? "" : " style='display: none;'"}><td title="${isEn ? "with a partner for min growth 5.6%" : "с напарником для минимального прироста в 5.6%"}">${isEn ? "with a partner" : "с напарником"} 20% (${min_count})</td><td>${exp_min_count}</td><td>${(hunt.amount * Math.pow(1.3, 0.2)).toFixed(0)}</td></tr>
</table>
`);
        if(hunt.experience < (PlayerLevel + 1) * 100 && PlayerLevel > 1) {
            hunt.huntDescriptionPanel.insertAdjacentHTML("beforeend", `<br><font style="color:#0000CD">${isEn ? "Kill it now! On level" : "Убей сейчас! На"} ${PlayerLevel + 1} ${isEn ? " you gain" : "уровне за них дадут"} <b>${(PlayerLevel + 1) * 100}</b> ${isEn ? "exp" : "опыта"}.</font>`);
        }
    }
}
function correctWars(name, playerId = PlayerId) {
    const wars = JSON.parse(getValue(`${name}${playerId}`, "[]")).map(x => JSON.parse(x));
    for(const war of wars) {
        if(war.warDate) {
            war.date = war.warDate;
            delete war.warDate;
        }
        if(war.warId) {
            war.id = war.warId;
            delete war.warId;
        }
        if(!war.enemyName) {
            war.enemyName = name;
        }
        if(!war.type) {
            war.type = 0;
        }
    }
    setValue(`${name}${playerId}`, JSON.stringify(wars.map(x => JSON.stringify(x))));
}
function createTraceMonstersPanelCaller(monstersListContainer) {
    const monstersListActivator = addElement('div', { id: "get_list_go", class: "job_fl_btn show_hint", style: "width: 20px; height: 20px; vertical-align: middle; display: inline-block;", innerHTML: `<img src="//dcdn.heroeswm.ru/i/mobile_view/icons_add/pismo.png" style="width: 16px; height: 16px;">` }, monstersListContainer);
    monstersListActivator.addEventListener("click", showMonstersPanel);
}
function showMonstersPanel() {
    const panelName = "Monsters";
    let bg = document.getElementById(`bg${panelName}Overlay`);
    let bgc = document.getElementById(`bg${panelName}Center`);
    if(bg) {
        bg.style.display = "block";
        bgc.style.display = "block";
        return;
    }
    bg = addElement('div', { id: `bg${panelName}Overlay`, style: "position: fixed; left: 0px; width: 100%; top: 0px; height: 100%; background: #000000; opacity: 0.5; z-index: 1120;" }, document.body);
    const topStyle = isMobileDevice ? "top: 0;" : "top: 50%; transform: translateY(-50%);";
    bgc = addElement('div', { id: `bg${panelName}Center`, style: `position: fixed; left: ${(document.body.offsetWidth - 650) / 2}px; width: 650px; ${topStyle} height: 100%; overflow: auto; background: #F6F3EA; z-index: 1121;` }, document.body);
    bg.addEventListener("click", function() { hidePanel(panelName); }); //клик вне окна
    let monstersTableHtml = "";
    for(const monster of monsters) {
        const imageName = monster.imageFullName || `${monster.imageName || monster.name}anip33`;
        const imageSource = `${resourcesPath}/i/portraits/${imageName}.png`;
        monstersTableHtml += `
<tr name="${monster.name}">
    <td style="text-align: center;"><a href="army_info.php?name=${monster.name}" target="_blank" style="text-decoration: none;"><img name=monsterPicture style="height: 25px; width: 30px; border: 0; display: ${getPlayerBool("viewMonsterPictures") ? "" : "none"};" src="${imageSource}"></a></td>
    <td style="text-align: center;"><input name=title type=text value="${isEn && monster.enTitle ? monster.enTitle : monster.title}"></td>
    <td style="text-align: center;"><input name=experience type=number value="${monster.experience}" style="width: 70px;"></td>
    <td style="text-align: center;"><input name=health type=number value="${monster.health}" style="width: 70px;"></td>
    <td style="text-align: center;"><input name=canFly type=checkbox ${monster.canFly ? "checked" : ""}></td>
    <td style="text-align: center;"><input name=wanted type=checkbox ${monster.wanted ? "checked" : ""}></td>
    <td style="text-align: center;"><input name=newYear type=checkbox ${monster.newYear ? "checked" : ""}></td>
</tr>`;
    }
    bgc.innerHTML = `
<style>
    .grid {
        border-collapse: collapse;
    }
    .grid th, .grid td {
        border: 1px solid black;
    }
    .grid-header td {
        text-align: center;
        font-weight: bold;
    }
</style>
<div style="border: 1px solid #abc; padding: 5px; margin: 2px;">
    <div>
        <b>${isEn ? "Select creatures for hunt. Total" : "Выберите существ для охоты. Всего"} <font style="color: #FF0000;">${monsters.length}</font></b>
        <input type="button" id="lookForAllButton" value="${isEn ? "Look for all" : "Искать всех"}">
        <input type="button" id="dontLookForAnyoneButton" value="${isEn ? "Don't look for anyone" : "Не искать никого"}">
        <input type="button" id="deleteGreatCreaturesButton" value="${isEn ? "Delete great creatures from portal" : "Удалить великих существ из портала"}">
        <button id="closeMonstersListButton" type="button" style="float: right; cursor: pointer; font-size: 20px;" title="${isEn ? "Close" : "Закрыть"}">&times;</button>
        <hr/>
    </div>
    <table class=grid cellspacing="0">
        <tr class="grid-header">
            <td><input type=checkbox id=viewMonsterPicturesCheckbox title="${isEn ? "Show pictures" : "Показать картинки"}"></td>
            <td>${isEn ? "Title" : "Заголовок"}</td>
            <td>${isEn ? "Experience" : "Опыт"}</td>
            <td>${isEn ? "Health" : "Здоровье"}</td>
            <td>${isEn ? "Can fly" : "Летает"}</td>
            <td>${isEn ? "Wanted" : "Разыски<br>вается"}</td>
            <td>${isEn ? "New year" : "Ново<br>годний"}</td>
        </tr>
        ${monstersTableHtml}
    </table>
</div>`;
    document.getElementById("viewMonsterPicturesCheckbox").addEventListener("click", function() { setPlayerValue("viewMonsterPictures", this.checked); toggleMonsterPictures(); });
    document.getElementById("viewMonsterPicturesCheckbox").checked = getPlayerBool("viewMonsterPictures");

    document.getElementById('lookForAllButton').addEventListener("click", wantedAll);
    document.getElementById('dontLookForAnyoneButton').addEventListener("click", unwantAll);
    
    const deleteGreatCreaturesButton = document.getElementById('deleteGreatCreaturesButton');
    const megaMonsters = JSON.parse(getValue("monsters", "[]")).filter(x => x.name.startsWith("mega_"));
    deleteGreatCreaturesButton.style.display = megaMonsters.length > 0 ? "" : "none";
    deleteGreatCreaturesButton.addEventListener("click", function() {
        const newMonsters = JSON.parse(getValue("monsters", "[]")).filter(x => !x.name.startsWith("mega_"));
        setValue("monsters", JSON.stringify(newMonsters));
        location.reload();
    });
    document.getElementById("closeMonstersListButton").addEventListener("click", function() { hidePanel(panelName); }); //крестик в углу
    Array.from(bgc.querySelectorAll("input[name=title]")).forEach(x => x.addEventListener("change", function() { setMonsterProperty(this.closest("tr").getAttribute("name"), isEn ? "enTitle" : "title", this.value); }));
    Array.from(bgc.querySelectorAll("input[name=experience]")).forEach(x => x.addEventListener("change", function() { setMonsterProperty(this.closest("tr").getAttribute("name"), this.name, this.value); }));
    Array.from(bgc.querySelectorAll("input[name=health]")).forEach(x => x.addEventListener("change", function() { setMonsterProperty(this.closest("tr").getAttribute("name"), this.name, this.value); }));
    Array.from(bgc.querySelectorAll("input[name=canFly]")).forEach(x => x.addEventListener("change", function() { setMonsterProperty(this.closest("tr").getAttribute("name"), this.name, this.checked); }));
    Array.from(bgc.querySelectorAll("input[name=wanted]")).forEach(x => x.addEventListener("change", function() { setMonsterProperty(this.closest("tr").getAttribute("name"), this.name, this.checked); }));
    Array.from(bgc.querySelectorAll("input[name=newYear]")).forEach(x => x.addEventListener("change", function() { setMonsterProperty(this.closest("tr").getAttribute("name"), this.name, this.checked); }));
}
function toggleMonsterPictures() {
    Array.from(document.querySelectorAll("img[name=monsterPicture]")).forEach(x => x.style.display = getPlayerBool("viewMonsterPictures") ? "" : "none");
}
function setMonsterProperty(monsterName, propertyName, propertyValue) {
    //console.log(`monsterName: ${monsterName}, propertyName: ${propertyName}, propertyValue: ${propertyValue}`);
    const newMonsters = JSON.parse(getValue("monsters", "[]"));
    let monster = newMonsters.find(x => x.name == monsterName);
    if(!monster) {
        monster = monsters.find(x => x.name == monsterName);
        newMonsters.push(monster);
    }
    monster[propertyName] = propertyValue;
    setValue("monsters", JSON.stringify(newMonsters));
}
function wantedAll() {
    monsters.forEach(x => { x.wanted = true; });
    setValue("monsters", JSON.stringify(monsters));
    bindWanted();
}
function unwantAll() {
    monsters.forEach(x => { x.wanted = false; });
    setValue("monsters", JSON.stringify(monsters));
    bindWanted();
}
function bindWanted() {
    const monstersPanel = document.querySelector(`#bgMonstersCenter`);
    Array.from(monstersPanel.querySelectorAll("input[name=wanted]")).forEach(x => {
        const monster = monsters.find(y => y.name == x.closest("tr").getAttribute("name"));
        x.checked = monster?.wanted || false;
    });
}
function createSettingsCaller() {
    const settingsButtonContainer = document.querySelector("div#hwm_map_objects_and_buttons > div.job_fl_btns_block");
    if(settingsButtonContainer) {
        let huntHelperSettingsButton = document.querySelector("#huntHelperSettingsButton"); // console.log(huntHelperSettingsButton); - всегда нул
        if(!huntHelperSettingsButton) {
            settingsButtonContainer.insertAdjacentHTML("beforeend", `
    <a id=huntHelperSettingsButton href="javascript:void(0);" class="map_sel_obj_t" style="width: 200px;">
        <div class="job_fl_btn show_hint" hint="${isEn ? "HuntHelper script settings" : "Настройки скрипта HuntHelper"}">
            <img src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_hunters.png">
        </div>
    </a>`);
            huntHelperSettingsButton = document.querySelector("#huntHelperSettingsButton");
            huntHelperSettingsButton.addEventListener("click", showSettingsPanel);
            if(typeof win.hwm_hints_init === 'function') win.hwm_hints_init();
        }
    }
}
function showSettingsPanel() {
    const panelName = "hwmHuntHelperSettings";
    if(showPupupPanel(panelName)) {
        return;
    }
    const innerHtml = `
<div class="separator">${isEn ? "Hunt view" : "Отображение охот"}</div>
    <label><input type=checkbox id=isShortHuntDescriptionCheckbox> ${isEn ? "Brief hunt description" : "Краткое сообщение об охоте"}</label>
    <br><label><input type=checkbox id=showTotalMonstersHealthCheckBox> ${isEn ? "Show total monsters health" : "Показать суммарное здоровье монстров"}</label>
    <br><label><input type=checkbox id=set_enable_Exp_Half> ${isEn ? "Show <b>exp with helper</b>, if kill 50% each" : "Отображать <b>опыт с помощником</b>, если убьёте по 50%"}</label>
    <br><label><input type=checkbox id=set_enable_5_procent> ${isEn ? "Display how many creatures to kill <b>for the minimum increase</b> of creatures" : "Отображать сколько убить существ <b>для минимального прироста</b> существ"}</label>
    <br>${isEn ? "Overexp rate" : "Коэффициент перекача"} <input id="set_koef" value="${getPlayerValue("koef_dop_exp", 1)}" style="width: 100px;" maxlength="6" type="number">
    <br><label><input type=checkbox id=hideHuntsCheckbox> ${isEn ? "Hide hunts" : "Скрыть охоты"} (<b><font color=green size=3>GreenPeace</font></b>)</label>
<div class="separator">${isEn ? "Hunt searche" : "Поиск охот"}</div>
    <label><input type=checkbox id=skipUnmatchedHuntsCheckbox> ${isEn ? "Skip unmatched hunts" : "Пропускать неподходящие охоты"}</label>
    <br><b>${isEn ? "Looking for" : "Искать"}</b>
    <br><label>1) <input type=checkbox id=lookingForMarkedInListCheckbox> ${isEn ? "creatures marked in the list" : "существ отмеченных в списке"}</label><span id=monstersListContainer></span>
    <br>2) ${isEn ? "experience less then" : "опыт меньше, чем"}: <input id="experienceLimitInput" type="number" value="${getPlayerValue("experienceLimit", "0")}" style="width: 70px;">
    <br><label>3) <input type=checkbox id=lookingForHalfAmountCheckbox> ${isEn ? "half amount ([1/2])" : "половинки ([1/2])"}</label>
    <br><label>4) <input type=checkbox id=lookingForDiamondCheckbox> <img width="16" height="16" border="0" title="${isEn ? "Diamonds" : "Бриллианты"}" src="https://dcdn.heroeswm.ru/i/r/48/diamonds.png"></label>
    <br><label>5) <input type=checkbox id=lookingForFlyingCheckbox> ${isEn ? "flying" : "летающих"}</label>
    <br><span><label>6) <input type=checkbox id=lookingForAdvancedGuildPointsCheckbox> ${isEn ? "advanced guild points" : "увеличенные очки гильдии"}</label> <form style="display: inline-block;" oninput="minAdvancedPointsOutput.value = minAdvancedPointsInput.value"><input id=minAdvancedPointsInput type=range list=advancedGuildPointsDatalist min=2 max=5 style="width: 60px; vertical-align: middle;" onfocus="this.select();"/><output name=minAdvancedPointsOutput for="minAdvancedPointsInput"></output></form> ${isEn ? "and more" : "и более"}</span>
    <datalist id="advancedGuildPointsDatalist"> <option value="2" /> <option value="3" /> <option value="5" /> </datalist>
<div class="separator">${isEn ? "Hunter records" : "Рекорды охот"}</div>
    <label><input type=checkbox id=set_show_archive> ${isEn ? "Show <b>archive records links</b>" : "Отображать <b>ссылки на рекорды</b> из архива"}</label> <img src="https://dcdn.heroeswm.ru/i/icons/attr_knowledge.png" width="18">
    <br><label><input type=checkbox id=loadPlayersRecordsSemaphoresCheckBox> ${isEn ? "Load players records semaphores" : "Загружать светофоры рекордов персонажей"}</label>
<div class="separator">${isEn ? "Armies info" : "Информация об армиях"}</div>
    <label><input type=checkbox id=armiesInfoInLeadersGuildCheckBox> ${isEn ? "Armies info in leaders guild" : "Информация об армиях в гильдии лидеров"}</label>
    <br><label><input type=checkbox id=armiesInfoAtTheEventsPageCheckBox> ${isEn ? "Armies info at the events page" : "Информация об армиях на ивентах"}</label>
    <br><label><input type=checkbox id=showLeadershipCheckBox> ${isEn ? "Show total leadership" : "Показать суммарное лидерство"}</label>
    <br><label><input type=checkbox id=showShootersFrameCheckBox> ${isEn ? "Select the shooters with a frame" : "Выделить рамкой стрелков"}</label>
    <br><label><input type=checkbox id=showCastersFrameCheckBox> ${isEn ? "Select the casters with a frame" : "Выделить рамкой магов"}</label>
    <br><label><input type=checkbox id=showPoisonersFrameCheckBox> ${isEn ? "Select the poisoners frame" : "Выделить рамкой травителей"}</label>
    <br><label><input type=checkbox id=showEventArmiesMightComparisonCheckBox> ${isEn ? "Compare the strength of the player's and the enemy's armies during the event" : "Сравнивать мощь армий игрока и противника на ивенте"}</label>
`;
    const settingsDiv = addElement("div", { innerHTML: innerHtml });
    bindSettings(settingsDiv);
    bindSettingsHandlers(settingsDiv);

    createTraceMonstersPanelCaller(settingsDiv.querySelector("#monstersListContainer"));

    const fieldsMap = [];
    fieldsMap.push([settingsDiv]);
    
    const scriptSettingsContainer = addElement("div", {}, settingsDiv);
    addElement("label", { for: "recruitMightPerBattleContainer", innerText: isEn ? "Penetrating power\xA0" : "Пробиваемая мощь\xA0" }, scriptSettingsContainer);
    const recruitMightPerBattleContainer = addElement("input", { id: "recruitMightPerBattleContainer", type: "number", style: "width: 70px; display: inline-block;", value: getPlayerValue("recruitMightPerBattle", 5000), placeholder: "5000", title: isEn ? "For the cave event" : "Для ивента пещер", onfocus: "this.select();" }, scriptSettingsContainer);
    recruitMightPerBattleContainer.addEventListener("change", function() { setPlayerValue("recruitMightPerBattle", Number(this.value)); });

    addElement("label", { for: "recruitHeroAttackInput", innerText: isEn ? "\xA0Hero attack\xA0" : "\xA0Атака героя\xA0" }, scriptSettingsContainer);
    const recruitHeroAttackInput = addElement("input", { id: "recruitHeroAttackInput", type: "number", style: "width: 70px; display: inline-block;", value: getPlayerValue("recruitHeroAttack", 50), placeholder: "50", title: isEn ? "Hero attack" : "Атака героя", onfocus: "this.select();" }, scriptSettingsContainer);
    recruitHeroAttackInput.addEventListener("change", function() { setPlayerValue("recruitHeroAttack", Number(this.value)); });

    addElement("label", { for: "recruitHeroDefenseInput", innerText: isEn ? "\xA0Hero defense\xA0" : "\xA0Защита героя\xA0" }, scriptSettingsContainer);
    const recruitHeroDefenseInput = addElement("input", { id: "recruitHeroDefenseInput", type: "number", style: "width: 70px; display: inline-block;", value: getPlayerValue("recruitHeroDefense", 50), placeholder: "50", title: isEn ? "Hero defense" : "Защита героя", onfocus: "this.select();" }, scriptSettingsContainer);
    recruitHeroDefenseInput.addEventListener("change", function() { setPlayerValue("recruitHeroDefense", Number(this.value)); });


    const title = `${getScriptReferenceHtml()} ${getSendErrorMailReferenceHtml()} ${isEn ? "Creatures total" : "Всего существ"}: <font style="color:#FF0000;">${monsters.length}</font>`;
    createPupupPanel(panelName, title, fieldsMap);
}
function bindSettings(settingsDiv) {
    settingsDiv.querySelector("#isShortHuntDescriptionCheckbox").checked = getPlayerBool("isShortHuntDescription");
    settingsDiv.querySelector("#set_enable_Exp_Half").checked = getPlayerBool("enable_Exp_Half");
    settingsDiv.querySelector("#set_enable_5_procent").checked = getPlayerBool("enable_5_procent");
    settingsDiv.querySelector("#hideHuntsCheckbox").checked = getPlayerBool("hideHunts");

    settingsDiv.querySelector("#skipUnmatchedHuntsCheckbox").checked = getPlayerBool("skipUnmatchedHunts");
    settingsDiv.querySelector("#lookingForMarkedInListCheckbox").checked = getPlayerBool("lookingForMarkedInList");
    settingsDiv.querySelector("#experienceLimitInput").value = getPlayerValue("experienceLimit", "");
    settingsDiv.querySelector("#lookingForHalfAmountCheckbox").checked = getPlayerBool("lookingForHalfAmount");
    settingsDiv.querySelector("#lookingForDiamondCheckbox").checked = getPlayerBool("lookingForDiamond");
    settingsDiv.querySelector("#lookingForFlyingCheckbox").checked = getPlayerBool("lookingForFlying");
    settingsDiv.querySelector("#lookingForAdvancedGuildPointsCheckbox").checked = getPlayerBool("lookingForAdvancedGuildPoints");
    settingsDiv.querySelector("#minAdvancedPointsInput").value = getPlayerValue("minAdvancedPoints", "2");
    settingsDiv.querySelector("output[name=minAdvancedPointsOutput]").value = getPlayerValue("minAdvancedPoints", "2");

    settingsDiv.querySelector("#showTotalMonstersHealthCheckBox").checked = getPlayerBool("showTotalMonstersHealth", true);
    
    settingsDiv.querySelector("#set_show_archive").checked = getPlayerBool("show_archive");
    settingsDiv.querySelector("#loadPlayersRecordsSemaphoresCheckBox").checked = getPlayerBool("loadPlayersRecordsSemaphores");
    
    settingsDiv.querySelector("#armiesInfoInLeadersGuildCheckBox").checked = getPlayerBool("armiesInfoInLeadersGuild", true);
    settingsDiv.querySelector("#armiesInfoAtTheEventsPageCheckBox").checked = getPlayerBool("armiesInfoAtTheEventsPage", true);
    settingsDiv.querySelector("#showLeadershipCheckBox").checked = getPlayerBool("showLeadership");
    settingsDiv.querySelector("#showShootersFrameCheckBox").checked = getPlayerBool("showShootersFrame");
    settingsDiv.querySelector("#showCastersFrameCheckBox").checked = getPlayerBool("showCastersFrame");
    settingsDiv.querySelector("#showPoisonersFrameCheckBox").checked = getPlayerBool("showPoisonersFrame");
    settingsDiv.querySelector("#showEventArmiesMightComparisonCheckBox").checked = getPlayerBool("showEventArmiesMightComparison");
    
}
function bindSettingsHandlers(settingsDiv) {
    settingsDiv.querySelector("#isShortHuntDescriptionCheckbox").addEventListener("click", function() { setPlayerValue("isShortHuntDescription", this.checked); });
    settingsDiv.querySelector("#set_enable_Exp_Half").addEventListener("click", function() { setPlayerValue("enable_Exp_Half", this.checked); });
    settingsDiv.querySelector("#set_enable_5_procent").addEventListener("click", function() { setPlayerValue("enable_5_procent", this.checked); });
    settingsDiv.querySelector("#hideHuntsCheckbox").addEventListener("click", function() { setPlayerValue("hideHunts", this.checked); applyGreenPeace(); });
    settingsDiv.querySelector("#set_koef").addEventListener("change", function() { setPlayerValue("koef_dop_exp", Number(this.value)); });

    settingsDiv.querySelector("#skipUnmatchedHuntsCheckbox").addEventListener("click", function() { setPlayerValue("skipUnmatchedHunts", this.checked); });
    settingsDiv.querySelector("#lookingForMarkedInListCheckbox").addEventListener("click", function() { setPlayerValue("lookingForMarkedInList", this.checked); });
    settingsDiv.querySelector("#experienceLimitInput").addEventListener("change", function() { setPlayerValue("experienceLimit", this.value); });
    settingsDiv.querySelector("#lookingForHalfAmountCheckbox").addEventListener("click", function() { setPlayerValue("lookingForHalfAmount", this.checked); });
    settingsDiv.querySelector("#lookingForDiamondCheckbox").addEventListener("click", function() { setPlayerValue("lookingForDiamond", this.checked); });
    settingsDiv.querySelector("#lookingForFlyingCheckbox").addEventListener("click", function() { setPlayerValue("lookingForFlying", this.checked); });
    settingsDiv.querySelector("#lookingForAdvancedGuildPointsCheckbox").addEventListener("click", function() { setPlayerValue("lookingForAdvancedGuildPoints", this.checked); });
    settingsDiv.querySelector("#minAdvancedPointsInput").addEventListener("change", function() { setPlayerValue("minAdvancedPoints", this.value); });

    settingsDiv.querySelector("#showTotalMonstersHealthCheckBox").addEventListener("click", function() { setPlayerValue("showTotalMonstersHealth", this.checked); });
    
    settingsDiv.querySelector("#set_show_archive").addEventListener("click", function() { setPlayerValue("show_archive", this.checked); });
    settingsDiv.querySelector("#loadPlayersRecordsSemaphoresCheckBox").addEventListener("click", function() { setPlayerValue("loadPlayersRecordsSemaphores", this.checked); });

    settingsDiv.querySelector("#armiesInfoInLeadersGuildCheckBox").addEventListener("click", function() { setPlayerValue("armiesInfoInLeadersGuild", this.checked); });
    settingsDiv.querySelector("#armiesInfoAtTheEventsPageCheckBox").addEventListener("click", function() { setPlayerValue("armiesInfoAtTheEventsPage", this.checked); });
    settingsDiv.querySelector("#showLeadershipCheckBox").addEventListener("click", function() { setPlayerValue("showLeadership", this.checked); });
    settingsDiv.querySelector("#showShootersFrameCheckBox").addEventListener("click", function() { setPlayerValue("showShootersFrame", this.checked); });
    settingsDiv.querySelector("#showCastersFrameCheckBox").addEventListener("click", function() { setPlayerValue("showCastersFrame", this.checked); });
    settingsDiv.querySelector("#showPoisonersFrameCheckBox").addEventListener("click", function() { setPlayerValue("showPoisonersFrame", this.checked); });
    settingsDiv.querySelector("#showEventArmiesMightComparisonCheckBox").addEventListener("click", function() { setPlayerValue("showEventArmiesMightComparison", this.checked); });
}
function hidePanel(panelName) {
    document.getElementById(`bg${panelName}Overlay`).style.display = "none";
    document.getElementById(`bg${panelName}Center`).style.display = "none";
}
function isHuntMatch(hunt) {
    if(getPlayerBool("lookingForMarkedInList") && hunt.monster.wanted) {
        return true;
    }
    if(hunt.experience <= Number(getPlayerValue("experienceLimit"))) {
        return true;
    }
    if(getPlayerBool("lookingForHalfAmount") && hunt.isHalfAmount) {
        return true;
    }
    if(getPlayerBool("lookingForDiamond") && hunt.diamonds > 0) {
        return true;
    }
    if(getPlayerBool("lookingForFlying") && hunt.monster.canFly) {
        return true;
    }
    if(getPlayerBool("lookingForAdvancedGuildPoints") && hunt.guildPoints >= parseInt(getPlayerValue("minAdvancedPoints", "2"))) {
        return true;
    }
    return false;
}
function huntHelpers() {
    if(location.pathname != '/group_wars.php') {
        return;
    }
    const battleRows = Array.from(document.querySelectorAll("center table.wb > tbody > tr"));
    for(const titleRow of battleRows.slice(0, 1)) {
        titleRow.cells[3].innerHTML += `
<label style="font-size: 7pt;">${isEn ? "Hunter" : "Охотник"}<input type=checkbox id=set_find_Hunt title=""></label>`;
        titleRow.cells[6].innerHTML += `
<label style="font-size: 7pt;">${isEn ? "Show HP" : "Показать HP"}<input type=checkbox id=showTotalMonstersHealthCheckBox title=""></label>
<label style="font-size: 7pt;">${isEn ? "Signal" : "Сигнал"}<input type=checkbox id=set_beep_if_free title=""></label>`;
        document.querySelector("#set_find_Hunt").addEventListener("click", function() { setPlayerValue("find_Hunt", this.checked); location.reload(); });
        document.querySelector("#set_beep_if_free").addEventListener("click", function() { setPlayerValue("beep_if_free", this.checked); });
        document.querySelector("#showTotalMonstersHealthCheckBox").addEventListener("click", function() { setPlayerValue("showTotalMonstersHealth", this.checked); location.reload(); });
        document.querySelector("#set_find_Hunt").checked = getPlayerBool("find_Hunt");
        document.querySelector("#set_beep_if_free").checked = getPlayerBool("beep_if_free");
        document.querySelector("#showTotalMonstersHealthCheckBox").checked = getPlayerBool("showTotalMonstersHealth", true);
    }
    for(const row of battleRows.slice(1)) {
        const mapRef = row.querySelector("td > a[href*='map.php?cx']");
        if(!mapRef) {
            if(getPlayerBool("find_Hunt")) {
                row.style.display = "none";
            }
            continue;
        }
        const battleDescriptionCell = row.childNodes[6];
        const monstrRef = battleDescriptionCell.querySelector("a[href^='army_info.php?name=']");
        const monsterTitle = monstrRef.querySelector("i").innerText;
        const monstersAmount = parseInt(monstrRef.parentNode.innerHTML.match(/\((\d+)\)/)[1]);
        const monster = monsters.find(x => x.title == monsterTitle);
        if(!monster) {
            console.log(`Не найден monsterTitle: ${monsterTitle}, monstersAmount: ${monstersAmount}`)
            continue;
        }
        //console.log(mapRef.href.replace("/map.php", "/move_sector.php").replace(mapRef.search, `?id=${sectors[mapRef.search.slice(1)]}`));

        mapRef.href = mapRef.href.replace("/map.php", "/move_sector.php").replace(mapRef.search, `?id=${sectors[mapRef.search.slice(1)]}`);
        mapRef.title = isEn ? "Go" : "Перейти";

        const total_exp = Math.floor(monster.experience * monstersAmount / 5);
        const backgroundColor = total_exp < PlayerLevel * 133 ? "#cfd" : (total_exp < PlayerLevel * 100 ? "#0f0" : 'inherit');
        battleDescriptionCell.insertAdjacentHTML("beforeend", `<br><font style="font-size: 7pt; color: #013220; background-color: ${backgroundColor};"><b>${total_exp}</b></font>${isEn ? "&nbspexp." : "&nbspопыта."}`);
        if(getPlayerBool("showTotalMonstersHealth", true)) {
            battleDescriptionCell.insertAdjacentHTML("beforeend", ` <font style="font-size: 7pt; color: #CD00CD">HP:&nbsp;<b>${monster.health * monstersAmount}</b></font>`);
        }
        if(getPlayerBool("beep_if_free") && battleDescriptionCell.innerHTML.includes(isEn ? "Join" : "Вступить")) {
            new Audio("https://zvukogram.com/mp3/cats/1002/vyistrel-iz-vintovki-po-misheni.mp3").play();
        }
    }
}
function addHuntRecordsArchiveReference() {
    //добавить ссылку на архив рекордов на странице рекордов
    if(location.pathname != "/plstats_hunters.php") {
        return;
    }
    const container = document.querySelector("table.wbwhite>tbody>tr:last-of-type>td");    //const container = document.body;    //console.log(container);
    if(!container) {
        return;
    }
    const url = new URL(location.href); // console.log(url);
    const search = new URLSearchParams(url.search);
    const show_archive = search.get("show_archive");
    if(show_archive != "1") {
        search.set("show_archive", "1");
    } else {
        search.delete("show_archive");
    }
    url.search = search.toString();//    console.log(url);
    const alterRecordsText = show_archive == "1" ? (isEn ? "Current records" : "Текущие рекорды") : (isEn ? "Records archive before 01.03.2015" : "Архив рекордов до 01.03.2015");
    container.insertAdjacentHTML("beforeend", `<br><center><a href="${url.href}"><b><font color="blue">${alterRecordsText}</font></b></a></center>`);
}
function applyGreenPeace() {
    const map_hunt_block_div = document.querySelector("#map_hunt_block_div");
    if(map_hunt_block_div) {
        map_hunt_block_div.style.display = getPlayerBool("hideHunts") ? "none" : "block";
    }
}
async function readWarlog(e = null, playerId = PlayerId, pages = 0) {
    if(warlogProcessing) {
        const terminateProcessConfirm = confirm(isEn ? "Stop?" : "Прервать?");
        if(terminateProcessConfirm) {
            terminateProcess = true;
        }
        return;
    }
    const warStatistics = JSON.parse(getValue(`WarStatistics${playerId}`, "{}"));
    let warlogScanned = warStatistics.minWarId > 0 && warStatistics.firstWarId == warStatistics.minWarId;
    if(!warlogScanned && !confirm(isEn ? "It takes about 20 minutes. Continue?" : "Это займет около 20-ти минут. Продолжить?")) {
        return;
    }
    warlogProcessing = true;
    terminateProcess = false;
    let { lastWarlogPageIndex, firstWarId } = await getLastWarlogPageIndex(playerId);   //console.log(`playerId: ${playerId}, pages: ${pages}, lastWarlogPageIndex: ${lastWarlogPageIndex}`);

    warStatistics.firstWarId = firstWarId;    console.log(warStatistics);
    warlogScanned = warStatistics.minWarId > 0 && warStatistics.firstWarId == warStatistics.minWarId;
    if(pages) {
        lastWarlogPageIndex = Math.min(lastWarlogPageIndex, pages - 1);
    }
    let totalWars = 0;
    let totalPages = 0;
    let minDate;
    let maxDate;
    let minWarId;
    let maxWarId;
    let currentPageIndex = 0;
    while(currentPageIndex <= lastWarlogPageIndex) {
        if(e) {
            e.target.value = `${isEn ? "Process page" : "Обработка страницы"} ${currentPageIndex + 1} ${isEn ? "from" : "из"} ${lastWarlogPageIndex + 1}. ${isEn ? "Break?" : "Остановить?"}`;
        }
        if(terminateProcess) {
            break;
        }
        //console.log(`currentPageIndex: ${currentPageIndex}`);
        const wars = await parseWarlogPage(playerId, currentPageIndex);
        //console.log(wars);
        wars.forEach(x => {
            minWarId = !minWarId ? x.id : Math.min(minWarId, x.id);
            maxWarId = !maxWarId ? x.id : Math.max(maxWarId, x.id);
            minDate = !minDate || x.date < minDate ? x.date : minDate;
            maxDate = !maxDate || x.date > maxDate ? x.date : maxDate;
        });
        totalPages++;
        totalWars += wars.length;
        for(const war of wars) {
            if(isMercBattle(war.type) || war.type == 0) {
                storeWar(war, playerId);
            }
            if(!terminateProcess &&  warlogScanned && war.id < warStatistics.maxWarId) {
                console.log(`Прерываю процесс warlogScanned: ${warlogScanned}, war.id: ${war.id}, warStatistics.maxWarId: ${warStatistics.maxWarId}`);
                terminateProcess = true; // Для дополнительных сканирований после основного. Читаем не все страницы, а только новые
            }
        }
        if(!pages && currentPageIndex == lastWarlogPageIndex && minWarId > warStatistics.firstWarId) {
            lastWarlogPageIndex++; // Если зачитываем всю статистику до конца, то количество страниц могло возрасти. Тогда зачитаем ещё страницу.
        }
        currentPageIndex++;
    }
    warStatistics.minWarId = !warStatistics.minWarId || minWarId < warStatistics.minWarId ? minWarId : warStatistics.minWarId;
    warStatistics.maxWarId = !warStatistics.maxWarId || maxWarId > warStatistics.maxWarId ? maxWarId : warStatistics.maxWarId;
    warStatistics.minDate = !warStatistics.minDate || minDate < new Date(warStatistics.minDate) ? minDate : new Date(warStatistics.minDate);
    warStatistics.maxDate = !warStatistics.maxDate || maxDate > new Date(warStatistics.maxDate) ? maxDate : new Date(warStatistics.maxDate);
    warlogScanned = warStatistics.minWarId > 0 && warStatistics.firstWarId == warStatistics.minWarId;
    setValue(`WarStatistics${playerId}`, JSON.stringify(warStatistics));
    warlogProcessing = false;
    if(e) {
        const getWarsStatisticsName = warlogScanned ? (isEn ? "Append war statistics" : "Пополнить боевую статистику") : (isEn ? "Get war statistics" : "Получить боевую статистику");
        e.target.value = getWarsStatisticsName;
    }
}
async function parseWarlogPage(playerId, pageIndex) {
    const doc = await getRequest(`/pl_warlog.php?id=${playerId}&page=${pageIndex}`);
    const warRefs = Array.from(doc.querySelectorAll("div.global_a_hover > a[href^='warlog.php?warid=']"));
    const wars = [];
    for(const warRef of warRefs) {
        const warId = parseInt(getUrlParamValue(warRef.href, "warid"));
        const warDate = parseDate(warRef.innerText, false, true);
        const leftSideNodes = [];
        const rightSideNodes = [];
        let currentSide = leftSideNodes;
        let node = warRef;
        while((node = node.nextSibling) && node.nodeType != Node.COMMENT_NODE) {
            //console.log(`node.nodeType: ${node.nodeType}`);
            if(node.nodeType == Node.TEXT_NODE) {
                if(node.textContent == " vs ") {
                    currentSide = rightSideNodes;
                }
                continue;
            }
            currentSide.push(node);
        }
        const warType = parseInt(node.textContent); // Нашли комментарий с кодом типа боя
        let playerNode = leftSideNodes.find(x => x.outerHTML.includes(`pl_info.php?id=${playerId}`));
        const enemyNodes = playerNode ? rightSideNodes : leftSideNodes;
        if(!playerNode) {
            playerNode = rightSideNodes.find(x => x.outerHTML.includes(`pl_info.php?id=${playerId}`));
        }
        const isWin = playerNode.nodeName.toLowerCase() == "b";
        const playerNameExec = />(.+)\[(\d+)\]</.exec(playerNode.innerHTML);
        const playerLevel = parseInt(playerNameExec[2]);
        //console.log(`warId: ${warId}, warType: ${warType}, warDate: ${warDate}, isWin: ${isWin}, playerLevel: ${playerLevel}, isMercBattle: ${isMercBattle(warType)}`);
        const war = { id: warId, date: warDate, type: warType, isWin: isWin, playerLevel: playerLevel, enemyName: "", enemyLevel: "" };
        if(isMercBattle(warType)) {
             let enemyNode = enemyNodes[0];
             const enemyExec = /(.+) {(\d+)}/.exec(enemyNode.firstChild.innerText || enemyNode.firstChild.textContent);
             if(enemyExec) {
                 war.enemyName = enemyExec[1];
                 war.enemyLevel = parseInt(enemyExec[2]);
             }
        }
        if(warType == 0) {
             let enemyNode = enemyNodes[0];
             const enemyExec = /(.+) \((\d+)\)/.exec(enemyNode.firstChild.innerText || enemyNode.firstChild.textContent);
             if(enemyExec) {
                 war.enemyName = enemyExec[1];
                 war.enemyLevel = parseInt(enemyExec[2]);
             }
        }
        wars.push(war);
    }
    return wars;
}
async function getLastWarlogPageIndex(playerId = PlayerId) {
  const responseText = await getRequestText(`/pl_warlog.php?id=${playerId}&page=999999`);
  const pageExec = /a class="active" href="#">(\d+?)</gmi.exec(responseText);
  const doc = (new DOMParser).parseFromString(responseText, "text/html");
  const warRefs = Array.from(doc.querySelectorAll("div.global_a_hover > a[href^='warlog.php?warid=']"));
  const firstWarId = warRefs.map(x => parseInt(getUrlParamValue(x.href, "warid"))).reduce((t, x) => { return t == 0 || x < t ? x : t }, 0);
  return { lastWarlogPageIndex: pageExec ? (parseInt(pageExec[1]) - 1) : 0, firstWarId: firstWarId };
}
function isMercBattle(btype = win.btype) { return btype == _GN_OTRYAD || btype == _GN_MONSTER || btype == _GN_NABEGI || btype == _GN_ZASHITA || btype == _GN_ARMY || btype == _SURVIVALGN || btype == _NEWGNCARAVAN; }
function storeWar(war, playerId) {
    const enemyHistory = restoreWars(war.enemyName, playerId); //JSON.parse(getValue(`${war.enemyName}${playerId}`, "[]")).map(x => JSON.parse(x));
    let exists = enemyHistory.find(x => x.id == war.id);
    if(!exists) {
        enemyHistory.push(war);
        enemyHistory.sort((a, b) => b.id - a.id); // Сортируем по убыванию id

        //console.log(enemyHistory);
        setValue(`${war.enemyName}${playerId}`, JSON.stringify(enemyHistory.map(x => [x.id, (typeof x.date.getMonth === 'function') ? x.date.toISOString().substr(0, 16).replace("T", " ") : x.date, x.isWin ? 1 : 0, parseInt(x.playerLevel), parseInt(x.enemyLevel)])));
    }
    //console.log(getValue(`${war.enemyName}${playerId}`));
    //console.log(restoreWars(war.enemyName, playerId));
}
function toWar(warArray, name) { return { id: warArray[0], date: warArray[1], isWin: warArray[2] ? true : false, playerLevel: parseInt(warArray[3]), enemyLevel: parseInt(warArray[4]), enemyName: name }; }
function restoreWars(name, playerId) { return JSON.parse(getValue(`${name}${playerId}`, "[]")).map(x => toWar(x, name)); }
function clearWarsStatistics() {
    if(!confirm(isEn ? "Clear?" : "Очистить?")) {
        return;
    }
    let counter = 0;
    for(const key of GM_listValues()) {
        const value = getValue(key);
        if(value && key.startsWith("WarStatistics")) {
            deleteValue(key);
            counter++;
        }
        if(value && typeof(value) == "string" && value.startsWith("[[")) {
            //console.log(`${key}`);
            //console.log(value);
            try {
                const obj = JSON.parse(value);
                console.log(obj);
                if(obj[0]?.length == 5) {
                    deleteValue(key);
                    console.log(`Cleared ${key}`);
                    counter++;
                }
            } catch {
            }
        }
    }
    console.log(`Total cleared ${counter}`);
}
function addMercAgenciesTable(tasksPanel) {
    const mercAgenciesTable = addElement("table", { width: "90%", border: "1", align: "center", cellspacing: "0", cellpadding: "3" }, tasksPanel);
    mercAgenciesTable.innerHTML = `<thead><tr>
    <th><div align="center"><img src="//dcdn.heroeswm.ru/i/btns/job_fl_btn_mercenary.png" title="${isEn ? "Representation in the sector" : "Представительство в секторе"}" alt="${isEn ? "Representation in the sector" : "Представительство в секторе"}" width="15" height="15">
      </div>
    </th>
    <th><div align="center"><a href="plstats_merc.php?task=9&amp;level=0&amp;race=0"><b>${isEn ? "Army" : "Армии"}</b></a>
      </div>
    </th>
    <th><div align="center"><a href="plstats_merc.php?task=10&amp;level=0&amp;race=0"><b>${isEn ? "Conspirators" : "Заговорщики"}</b></a>
      </div>
    </th>
    <th><div align="center"><a href="plstats_merc.php?task=2&amp;level=0&amp;race=0"><b>${isEn ? "Invaders" : "Захватчики"}</b></a>
      </div>
    </th>
    <th><div align="center"><a href="plstats_merc.php?task=4&amp;level=0&amp;race=0"><b>${isEn ? "Monster" : "Монстры"}</b></a>
      </div>
    </th>
    <th><div align="center"><a href="plstats_merc.php?task=5&amp;level=0&amp;race=0"><b>${isEn ? "Raid" : "Набеги"}</b></a>
      </div>
    </th>
    <th><div align="center"><a href="plstats_merc.php?task=7&amp;level=0&amp;race=0"><b>${isEn ? "Vanguard" : "Отряды"}</b></a>
      </div>
    </th>
    <th><div align="center"><a href="plstats_merc.php?task=3&amp;level=0&amp;race=0"><b>${isEn ? "Brigands" : "Разбойники"}</b></a>
      </div>
    </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><div align="center"><b>${isEn ? "East River" : "Восточная река"}</b></div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
  </tr>
  <tr>
    <td><div align="center"><b>${isEn ? "Peaceful Camp" : "Мирный лагерь"}</b></div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center">7%</div></td>
  </tr>
  <tr>
    <td><div align="center"><b>${isEn ? "Fairy Trees" : "Магический лес"}</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center"><b>24%</b></div></td>
  </tr>
  <tr>
    <td><div align="center"><b>${isEn ? "Fishing Village" : "Рыбачье село"}</b></div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
    <td><div align="center"><b>24%</b></div></td>
    <td><div align="center">7%</div></td>
  </tr>
  <tr>
    <td><div align="center"><b>${isEn ? "Skip tasks from level" : "Пропускать задания с уровня"} <input id=autoSkipMercenaryTasksCheckbox type=checkbox ${getPlayerBool("autoSkipMercenaryTasks") ? "checked=true" : ""} title="${isEn ? "Autoskip tasks" : "Автопропуск заданий"}" /></b></div></td>
    <td><div align="center"><input id=armyTaskLevelToSkipInput type=number value="${getPlayerValue("armyTaskLevelToSkip", "")}" placeholder="0" /></div></td>
    <td><div align="center"><input id=conspiratorsTaskLevelToSkipInput type=number value="${getPlayerValue("conspiratorsTaskLevelToSkip", "")}" placeholder="0" /></div></td>
    <td><div align="center"><input id=invadersTaskLevelToSkipInput type=number value="${getPlayerValue("invadersTaskLevelToSkip", "")}" placeholder="0" /></div></td>
    <td><div align="center"><input id=monsterTaskLevelToSkipInput type=number value="${getPlayerValue("monsterTaskLevelToSkip", "")}" placeholder="0" /></div></td>
    <td><div align="center"><input id=raidTaskLevelToSkipInput type=number value="${getPlayerValue("raidTaskLevelToSkip", "")}" placeholder="0" /></div></td>
    <td><div align="center"><input id=vanguardTaskLevelToSkipInput type=number value="${getPlayerValue("vanguardTaskLevelToSkip", "")}" placeholder="0" /></div></td>
    <td><div align="center"><input id=brigandsTaskLevelToSkipInput type=number value="${getPlayerValue("brigandsTaskLevelToSkip", "")}" placeholder="0" /></div></td>
  </tr>
</tbody>`;
    mercAgenciesTable.querySelector("#autoSkipMercenaryTasksCheckbox").addEventListener("change", function() { setPlayerValue("autoSkipMercenaryTasks", this.checked); });
    mercAgenciesTable.querySelector("#armyTaskLevelToSkipInput").addEventListener("change", function() { setPlayerValue("armyTaskLevelToSkip", this.value); });
    mercAgenciesTable.querySelector("#conspiratorsTaskLevelToSkipInput").addEventListener("change", function() { setPlayerValue("conspiratorsTaskLevelToSkip", this.value); });
    mercAgenciesTable.querySelector("#invadersTaskLevelToSkipInput").addEventListener("change", function() { setPlayerValue("invadersTaskLevelToSkip", this.value); });
    mercAgenciesTable.querySelector("#monsterTaskLevelToSkipInput").addEventListener("change", function() { setPlayerValue("monsterTaskLevelToSkip", this.value); });
    mercAgenciesTable.querySelector("#raidTaskLevelToSkipInput").addEventListener("change", function() { setPlayerValue("raidTaskLevelToSkip", this.value); });
    mercAgenciesTable.querySelector("#vanguardTaskLevelToSkipInput").addEventListener("change", function() { setPlayerValue("vanguardTaskLevelToSkip", this.value); });
    mercAgenciesTable.querySelector("#brigandsTaskLevelToSkipInput").addEventListener("change", function() { setPlayerValue("brigandsTaskLevelToSkip", this.value); });
}
function initLoadSemaphoresButton() {
    if(location.pathname == "/pl_hunter_stat.php") {
        if(getPlayerBool("loadPlayersRecordsSemaphores")) {
            // const captionCell = document.querySelector('body>center>table table.wbwhite>tbody>tr:first-child>td');
            // const startLoadButton = addElement('div', { id: "startLoadButton", class: "button-62", style: "display: inline-block;", innerHTML: isEn ? 'Load semaphores' : 'Загрузить светофоры' }, captionCell.querySelector("b"), "afterend");
            // startLoadButton.addEventListener('click', loadSemaphores);
            loadSemaphores();
        }
    }
}
async function loadSemaphores(e) {
    const startLoadButton = e?.target;
    if(startLoadButton) startLoadButton.innerHTML = isEn ? 'Loading...' : 'Загрузка...';
    const playerId = getUrlParamValue(location.href, "id");
    const playerInfoDoc = await getRequest(`/pl_info.php?id=${playerId}`);
    const level = getLevel(playerInfoDoc);
    if(!level) {
        if(startLoadButton) startLoadButton.innerHTML = isEn ? 'Level getting error' : 'Ошибка получения уровня';
        console.log(isEn ? 'Level getting error' : 'Ошибка получения уровня');
        return;
    }
    const fraction = getFraction(playerInfoDoc);
    if(!fraction) {
        if(startLoadButton) startLoadButton.innerHTML = isEn ? 'Fascion getting error' : 'Ошибка получения фракции';
        console.log(isEn ? 'Fascion getting error' : 'Ошибка получения фракции');
        return;
    }
    const recordsDoc = await getRequest(`/plstats_hunters.php?level=${level}&race=${fraction}`);
    const unitRrefs = recordsDoc.querySelectorAll("tr>td>a[href^='army_info.php?name=']");
    const records = {};
    for(const unitRef of unitRrefs) {
        let unitRow = unitRef.closest("tr");
        const rowspan = Number(unitRow.cells[0].getAttribute("rowspan") || 1);
        const unitName = getUrlParamValue(unitRef.href, "name");
        //console.log(`unitName: ${unitName}, rowspan: ${rowspan}`);
        const unitAmounts = [];
        for(let i = 1; i <= rowspan; i++) {
            const warRef = unitRow.querySelector("a[href^='warlog.php?warid=']");
            unitAmounts.push(Number(warRef.innerText));
            unitRow = unitRow.nextElementSibling;
        }
        records[unitName] = unitAmounts;
    }
    const recordRows = document.querySelectorAll('body>center>table table.wbwhite table.wb>tbody>tr:nth-child(n+2)');
    const titleRow = recordRows[0].closest("table").rows[0];
    let semaphoreCell = titleRow.querySelector("td[name=semaphoreCell]") || addElement("td", { name: "semaphoreCell", innerHTML: "#", title: isEn ? "Semaphores" : "Светофоры" }, titleRow, "afterbegin")
    for(const row of recordRows) {
        semaphoreCell = row.querySelector("td[name=semaphoreCell]") || addElement('td', { name: "semaphoreCell", class: 'wblight', innerHTML: "&nbsp;" }, row, "afterbegin");

        const unitRef = row.querySelector("a[href^='army_info.php?name=']");
        const unitName = getUrlParamValue(unitRef.href, "name");
        const warRef = row.querySelector("a[href^='warlog.php?warid=']");
        const unitsAmount = Number(warRef.innerText);

        const record = records[unitName];
        if(!record) {
            continue;
        }
        const recordAmount = record[0];
        let ratio = 0.6;
        if (recordAmount > 0 && unitsAmount > 0) {
            ratio = unitsAmount * 1.3 / recordAmount;
        }
        let color = 0;
        if(ratio < 0.3) {
            color = 1;
        } else if (ratio < 0.5) {
            color = 2;
        } else if (ratio < 0.7) {
            color = 3;
        } else if (ratio < 1) {
            color = 4;
        } else {
            color = 5;
        }
        const recordText = record.join(" - ") + ` ${Math.round(ratio * 100)}%`;
        if (recordAmount > 0 && unitsAmount > 0) {
            semaphoreCell.innerHTML = `<a href="/plstats_hunters.php?level=${level}&race=${fraction}&mid=${unitName}#${unitName}"><img src="i/map/nl${color}.gif" border="0" alt="${isEn ? 'Record' : 'Рекорд'}: ${recordText}" title="${isEn ? 'Record' : 'Рекорд'}: ${recordText}" width="12" height="12"></a>`;
        }
    }
    if(startLoadButton) startLoadButton.innerHTML = isEn ? 'Load semaphores' : 'Загрузить светофоры';
}
function getLevel(doc = document) {
    const levelInfoBold = Array.from(doc.querySelectorAll("td>b, td>div>b")).find(x => x.innerHTML.includes(isEn ? 'Combat level' : 'Боевой уровень'));
    if(levelInfoBold) {
        const levelRegex = new RegExp(`${isEn ? 'Combat level' : 'Боевой уровень'}: (\\d{1,2})`);
        return parseInt(levelRegex.exec(levelInfoBold.innerHTML)[1]);
    }
}
function getFraction(doc = document) {
    const fractionImage = doc.querySelector("td>b>img[src*='/i/f/r']");
    if(fractionImage) {
        const fractionRegex = new RegExp(`/i/f/r(\\d{1,3}).png`);
        return parseInt(fractionRegex.exec(fractionImage.src)[1]);
    }
}
function groupToArray(list, keyFieldOrSelector) { return list.reduce(function(t, item) {
    const keyValue = typeof keyFieldOrSelector === 'function' ? keyFieldOrSelector(item) : item[keyFieldOrSelector];
    const existingGroup = t.find(x => x.key == keyValue);
    if(existingGroup) {
        existingGroup.values.push(item);
    } else {
        t.push({ key: keyValue, values: [item] });
    }
    return t;
}, []); };
function parseMonsterParameters() {
    let creaturesArrayText = "";
    let creaturesArray = [];
    for(const castleKey of Object.keys(allCreatures)) {
        const castleCreatures = allCreatures[castleKey];
        let castle = getCastleByName(castleKey);
        for(const creatureKey of Object.keys(castleCreatures)) {
            const creature = castleCreatures[creatureKey];
            let abilities = [];
            if(creature.description) {
                abilities = creature.description.split(":")[1].split(/[\.,]/).filter(x => x).map(x => x.trim().replace(/ /g, " "));
            }
            creaturesArray.push([creatureKey,castle,creature.tier,creature.atk,creature.def,creature.min_dmg,creature.max_dmg,creature.hp,creature.speed,creature.shots,0,0,creature.ini,Number(creature.leadership) || 0,abilities]);
        }
    }
    creaturesArray.sort((a, b) => a[0].localeCompare(b[0]));
    for(const creature of creaturesArray) {
        creaturesArrayText += (creaturesArrayText ? `
,` : "") + JSON.stringify(creature);
    }
    console.log("[" + creaturesArrayText + "]");
}
function getCastleByName(castleKey) {
    switch(castleKey) {
        case "Рыцарь":
            return 1;
        case "Рыцарь света":
            return 101;
        case "Некромант":
            return 2;
        case "Некромант - повелитель смерти":
            return 102;
        case "Маг":
            return 3;
        case "Маг-разрушитель":
            return 103;
        case "Эльф":
            return 4;
        case "Эльф-заклинатель":
            return 104;
        case "Варвар":
            return 5;
        case "Варвар крови":
            return 105;
        case "Варвар шаман":
            return 205;
        case "Темный эльф":
            return 6;
        case "Темный эльф-укротитель":
            return 106;
        case "Демон":
            return 7;
        case "Демон тьмы":
            return 107;
        case "Гном":
            return 8;
        case "Гном огня":
            return 108;
        case "Степной варвар":
            return 9;
        case "Степной варвар ярости":
            return 109;
        case "Фараон":
            return 10;

        case "Пираты":
            return 51;
        case "Инферно":
            return 52;
        case "Сектанты":
            return 53;
        case "Подземелье":
            return 54;
        case "Армия холода":
            return 55;
        case "Нейтралы":
            return 56;
        case "Механики":
            return 57;
        case "Рыцари солнца":
            return 58;
        case "Фауна и жители леса":
            return 59;
        case "Существа с прокачкой в ивенте":
            return 60;
        case "Остальные нейтралы":
            return 61;
        case "Грибы":
            return 62;
        case "Разбойники":
            return 63;
        case "Ангелы":
            return 64;
        case "Некрополис":
            return 65;
        case "Армия Тьмы":
            return 66;
        case "Морские обитатели":
            return 67;
        case "Элементали":
            return 68;
        case "Наемники":
            return 69;
        case "Непокорные племена":
            return 70;
        case "Драконы":
            return 71;
        case "Воры":
            return 72;
        case "Обитатели пляжа":
            return 73;
        case "Гноллы":
            return 74;
        case "Фермеры":
            return 75;
        case "Амфибии":
            return 76;
        case "Существа нового года":
            return 77;
        case "Имперцы":
            return 78;
        case "Пираты-нежить":
            return 79;
        case "Жители рощи":
            return 80;
    }
    return 0;
}
function getCreatureMightHeuristic(monster, hero = {}) {
    if(!monster.attack) {
        if(!monster.isBuilding) {
            console.log(monster);
        }
        return { attack: 0, defense: 0, mightAdd: 0, mightMulti: 0, mightAvgSq: 0 };
    }
    //console.log(monster);
    //console.log(hero);
    const shootingPenalty = monster.abilities.includes("Стрелок") && !monster.abilities.includes("Стрельба без штрафов") && monster.shots >=4 ? 0.5 : 1;
    
    const heroAttack = hero.attack || 0;
    const attack = (monster.minDamage + monster.maxDamage) / 2 * (1 + 0.05 * (monster.attack + heroAttack)) * monster.initiative / 10 * shootingPenalty;

    const heroDefense = hero.defense || 0;
    const defense = monster.health * (1 + 0.05 * (monster.defense + heroDefense));
    
    const result = { attack: attack, defense: defense,
        mightAdd: Math.round((attack * attackWeight + defense * defenceWeight) / (attackWeight + defenceWeight)),
        mightMulti: Math.round(Math.sqrt(attack * defense)),
        mightAvgSq: Math.round(Math.sqrt((attack * attack + defense * defense)) / 2) };
    //console.log(result);
    return result;
}
function refreshRecruitPrices() {
    if(location.pathname == "/recruit_event_set.php") {
        parseRecruitPricesPage();
    }
}
async function refreshAllRecruitPrices() {
    for(let castleNumber = 1; castleNumber <= 10; castleNumber++) {
        const doc = await getRequest(`/recruit_event_set.php?sf=${castleNumber}`);
        parseRecruitPricesPage(doc);
    }
}
function parseRecruitPricesPage(doc = document) {
    const creatureInfoDivs = doc.querySelectorAll("div#recruit_event_join_block div.recruit_event_set_stack_block:has(a[href^='army_info.php?name='])");
    //console.log(`creatureInfoDivs: ${creatureInfoDivs.length}`);
    const creatures = [];
    for(const creatureInfoDiv of creatureInfoDivs) {
        const baseCreature = parseCreatureDiv(creatureInfoDiv);
        creatures.push(baseCreature);
        const estimatedAmount = baseCreature.estimatedAmount;
        const stacksUpDivs = creatureInfoDiv.querySelectorAll("div.recruit_event_set_stack_up_out");
        for(const stacksUpDiv of stacksUpDivs) {
            creatures.push(parseCreatureDiv(stacksUpDiv, estimatedAmount));
        }
    }
}
function parseCreatureDiv(creatureDiv, estimatedAmount) {
    const creatureRef = creatureDiv.querySelector("a[href^='army_info.php?name=']");
    const creatureName = getUrlParamValue(creatureRef.href, "name");
    const { creatures, storageKey } = getStoredRecruitEventCreatures();
    //console.log(storageKey);    console.log(creatures);

    let creature = creatures.find(x => x.name == creatureName);
    if(!creature) {
        creature = { name: creatureName };
        creatures.push(creature);
    }
    const add_now_count = creatureRef.parentNode.querySelector("div#add_now_count");
    if(add_now_count) {
        creature.amount = Number(add_now_count.innerText.replace(/,/g, ""));
    }
    if(estimatedAmount) {
        creature.estimatedAmount = estimatedAmount;
    }
    const monster = monsters.find(x => x.name == creatureName); //console.log(monster);
    
    const mechDiv = creatureDiv.querySelector("div:has(>img[src*='mech.png'])");
    if(mechDiv) {
        const mechDivExec = /([\d,]+)(\u00A0x\u00A01)?/.exec(mechDiv.innerText);
        if(mechDivExec) {
            if(mechDivExec[2]) {
                creature.mech = Number(mechDivExec[1].replace(/,/g, ""));
                const estimatedMight = (monster.tier == 7 ? 8 : 4) * Number(getPlayerValue("recruitMightPerBattle", 5000)); // 4 (Для седьмого тира 8) присоединения * 5000 - приблизительно выбиваемая мощь для оценки
                creature.estimatedAmount = Math.round(estimatedMight / creature.mech);
                delete creature.amount;
            } else {
                creature.totalMech = Number(mechDivExec[1].replace(/,/g, ""));
            }
        }
    }
    const silverDiv = creatureDiv.querySelector("div:has(>img[src*='adv_ev_silver48.png'])");
    if(silverDiv) {
        const silverDivExec = /([\d,]+)(\u00A0x\u00A01)?/.exec(silverDiv.innerText);
        if(silverDivExec) {
            if(silverDivExec[2]) {
                creature.silver = Number(silverDivExec[1].replace(/,/g, ""));
            } else {
                creature.totalSilver = Number(silverDivExec[1].replace(/,/g, ""));
            }
        }
    }
    setPlayerValue(storageKey, JSON.stringify(creatures));
    
    if(silverDiv) {
        const monsterMight = getCreatureMightHeuristic(monster, { attack : Number(getPlayerValue("recruitHeroAttack", 50)), defense: Number(getPlayerValue("recruitHeroDefense", 50)) });  //console.log(monsterMight);
        const amount = creature.amount || creature.estimatedAmount;
        addElement("div", { innerHTML: `${Math.round(monsterMight.mightAdd * amount)}σ/${Math.round(monsterMight.mightMulti * amount)}μ/${Math.round(monsterMight.mightAvgSq * amount)}`, style: "font-size: 10px; font-weight: bold;", title: `${isEn ? "Mean and root mean square estimate" : "Средняя и среднеквадратичная оценка"}: (⚔ ${round00(monsterMight.attack)} × ${attackWeight} + 🛡 ${round00(monsterMight.defense)} × ${defenceWeight}) / (${attackWeight} + ${defenceWeight}) ${isEn ? "and" : "и"} √ (⚔ ${round00(monsterMight.attack)} × 🛡 ${round00(monsterMight.defense)}) ${isEn ? "multiplied by the quantity" : "умноженные на количество"} (${amount})` }, silverDiv.parentNode);
    }
    //console.log(creatures);
    return creature;
}
function getStoredRecruitEventCreatures() {
    const now = new Date();
    const now0 = new Date();
    now0.setDate(1);
    now0.setMonth(now0.getMonth() - 1);
    let storageKey = `recruitEventCreatures${now.getFullYear()}${now.getMonth()}`;
    let recruitEventCreaturesText = getPlayerValue(storageKey);
    if(!recruitEventCreaturesText) {
        storageKey = `recruitEventCreatures${now0.getFullYear()}${now0.getMonth()}`;
        recruitEventCreaturesText = getPlayerValue(storageKey);
        if(!recruitEventCreaturesText) {
            storageKey = `recruitEventCreatures${now.getFullYear()}${now.getMonth()}`;
            recruitEventCreaturesText = "[]";
        }
    }
    const creatures = JSON.parse(recruitEventCreaturesText);
    return { storageKey: storageKey, creatures: creatures };
}
// function correctWarsStatistics(e) {
    // if(!confirm(isEn ? "Correct?" : "Исправить?")) {
        // return;
    // }
    // for(const key of GM_listValues()) {
        // const value = getValue(key);
        // if(value && typeof(value) == "string" && value.startsWith("[[")) {
            // const wars = JSON.parse(value);
            // const pureWars = wars.filter(x => x[0] != "{");
            // if(wars.length > pureWars.length && pureWars.length > 0 && Array.isArray(pureWars[0]) && toWar(pureWars[0], key).date) {
                // setValue(key, JSON.stringify(pureWars));
                // e.target.insertAdjacentHTML("afterend", `<div>Очищен от старья ключ ${key}, удалено ${wars.length - pureWars.length} значений</div>`);
            // }
        // }
    // }
// }

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
    const contentDiv = addElement("div", { class: "script-settings-panel" }, backgroundPopupPanel);
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
function getUrlParamValue(url, paramName) {
    if(url instanceof URL || url instanceof Location) {
        return new URLSearchParams(url.search).get(paramName);
    }
    if(typeof url === "string") {
        return new URLSearchParams(url.split("?")[1]).get(paramName);
    }
}
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
