// ==UserScript==
// @name hwmProtocolsAndForums
// @author Demin, Tags, Tamozhnya1
// @namespace Tamozhnya1
// @version 6.8
// @description Цветные протоколы боёв, передач, клана, склада, ларцов. Загрузка следующих страниц. Фильтрация. Листать форум и фильтровать форумы кузнецов и прочего. Черный список. Распознавание ссылок на форуме, в почте и в информации об игроке
// @include /^https{0,1}:\/\/((www|my|mirror)\.(heroeswm|lordswm)\.(ru|com))\/(sklad_log|pl_transfers|pl_warlog|clan_log|gift_box_log|forum_thread|forum_messages|pl_info|pers_settings|sms|sms\-create|new_topic|clan_control|clan_broadcast|bselect)\.(php.*)/
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant 		   GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488345/hwmProtocolsAndForums.user.js
// @updateURL https://update.greasyfork.org/scripts/488345/hwmProtocolsAndForums.meta.js
// ==/UserScript==

// (c) 2012, demin  https://greasyfork.org/ru/scripts/1233-hwm-forum-extension, 2024 Tamozhnya1
// (c) Tags 2023.04 https://greasyfork.org/ru/users/924307-foxxelias, Tamozhnya1 2024.02.26

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
const resourcesPath = `${location.protocol}//${location.host.replace("www", "dcdn")}`;

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

addStyle(`
.battle_row {
  width: 100%;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
}
.battle_row img {
  width: 14px;
  height: 14px;
  vertical-align: bottom;
}
.battle_row > div {
  display: inline-block;
  vertical-align: bottom;
}
.global_a_hover {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: ${isMobileDevice ? 55 : 75}vh;
}
`);
const types = [
{ pattern: "исключил из клана", icon: ``, color: "#FF7450" },
{ pattern: "вышел из клана", icon: ``, color: "#FF7400" },
{ pattern: "вступил в клан", icon: ``, color: "#39E639" },
{ pattern: "Получен контроль", icon: ``, color: "#FFFF40" },
{ pattern: "проигран врагу", icon: ``, color: "#AD66D5" },
{ pattern: "[80/80]", icon: ``, color: "#FFF000" },
{ pattern: "[100/100]", icon: ``, color: "#00F120" },
{ pattern: "бриллиантов обменяно ", icon: ``, color: "#00F120" },
{ pattern: "вернул c ремонта ", icon: ``, color: "#FFF000" },
{ pattern: "возвращено автоматически c ремонта", icon: ``, color: "#0008DC" },
{ pattern: "Золото о", icon: ``, color: "#FFF8DC" },
{ pattern: "взял в ремонт", icon: ``, color: "#FFF8DC" },
{ pattern: "Куплен", icon: ``, color: "#DEB887" },
{ pattern: "Вернул ", icon: ``, color: "#FFDEAD" },
{ pattern: "арендова", icon: ``, color: "#FFEBCD" },
{ pattern: "Передан", icon: ``, color: "#E0FFFF" },
{ pattern: ", доп. комиссия ", icon: ``, color: "#B0C4DE" },
{ pattern: "Продан ", icon: ``, color: "#ADFF2F" },
{ pattern: "вернул", icon: ``, color: "#00FA9A" },
{ pattern: "возвращ", icon: ``, color: "#7FFF00" },
{ pattern: "Возвращено автоматически ", icon: ``, color: "#3CB371" },
{ pattern: "Взят в ремонт ", icon: ``, color: "#7CFC00" },
{ pattern: "Вернул c ремонта ", icon: ``, color: "#FA8072" },
{ pattern: "Получен элемент ", icon: ``, color: "#00FF00" },
{ pattern: "Получен", icon: ``, color: "#FF9104" },
{
	pattern: "<!--0-->",
	icon: `<a href="hunter_guild.php" title="${isEn ? "Hunter's guild" : "Гильдия охотников"}" style="height: inherit;"><img src="${resourcesPath}/i/btns/job_fl_btn_hunters.png" alt="hunt"></a>`,
	color: "#cceecc"
}, {
	pattern: "<!--5-->",
	icon: `<a href="mercenary_guild.php" style="height: inherit;"><img src="https://dcdn3.heroeswm.ru/i/rewards/gn/task2.png" alt="" style="height: inherit;" ></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--7-->",
	icon: `<a href="mercenary_guild.php" style="height: inherit;"><img src="https://dcdn.heroeswm.ru/i/rewards/gn/task4.png" style="height: inherit;" ></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--8-->",
	icon: `<a href="mercenary_guild.php" style="height: inherit;"><img src="https://dcdn3.heroeswm.ru/i/rewards/gn/task5.png" alt="" style="height: inherit;" ></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--10-->",
	icon: `<a href="mercenary_guild.php" style="height: inherit;"><img src="https://dcdn3.heroeswm.ru/i/rewards/gn/task7.png" alt="" style="height: inherit;" ></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--12-->",
	icon: `<a href="mercenary_guild.php" style="height: inherit;"><img src="https://dcdn2.heroeswm.ru/i/rewards/gn/task9.png" alt="" style="height: inherit;" ></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--14-->",
	icon: `<a href="tournaments.php" style="height: inherit;"><img src=https://dcdn2.heroeswm.ru/i/bselect/tournaments.png?v=3b" alt="${isEn ? "Tournaments" : "Турниры"}" title="${isEn ? "Tournaments" : "Турниры"}" style="height: inherit;" ></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--21-->",
	icon: `<a href="one_to_one.php"><img title="Дуэли" src="https://dcdn3.heroeswm.ru/i/bselect/duels.png?v=3b" width="15" height="15" border="0"></a>`,
	color: "#FFFF00"
}, {
	pattern: "<!--26-->",
	icon: `<a href="thief_guild.php"><img title="Гильдия воров" src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_thiefs.png" width="15" height="15" border="0"></a>`,
	color: "#FFFF00"
}, {
	pattern: "<!--28-->",
	icon: `<a href="mercenary_guild.php" style="height: inherit;"><img src="https://dcdn1.heroeswm.ru/i/rewards/gn/task10.png" alt="" style="height: inherit;" ></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--29-->",
	icon: `<a href="mercenary_guild.php" style="height: inherit;"><img src="https://dcdn3.heroeswm.ru/i/rewards/gn/task3.png" alt="" style="height: inherit;"></a>`,
	color: "#eeeecc"
}, {
	pattern: "<!--40-->",
	icon: `<a href="pvp_guild.php" title="${isEn ? "Commander's Guild" : "Гильдия Тактиков"}"><img src="https://dcdn3.heroeswm.ru/i/bselect/tactic.png?v=3b" width="15" height="15" border="0"></a>`,
	color: "#20B2A0"
}, {
	pattern: "<!--44-->",
	icon: `<a href="village_def.php"><img src="//dcdn.heroeswm.ru/i/vil_def_n.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#20B2AA"
}, {
	pattern: "<!--61-->",
	icon: `<a href="ranger_guild.php" style="height: inherit;"><img title="Гильдия рейнджеров" src="https://dcdn2.heroeswm.ru/i/bselect/ranger.png?v=3b" ></a>`,
	color: "#ccccee"
}, {
	pattern: "<!--66-->",
	icon: `<a href="thief_guild.php" style="height: inherit;"><img title="Гильдия воров" src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_thiefs.png" ></a>`,
	color: "#ccccee"
}, {
	pattern: "<!--67-->",
	icon: `<a href="village_def.php"><img src="//dcdn.heroeswm.ru/i/vil_def_n.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#5F9EA0"
}, {
	pattern: "<!--68-->",
	icon: `<img src="https://dcdn.heroeswm.ru/i/top/line/2x2fast.gif" title="Турнир" alt="Турнир">`,
	color: ""
}, {
	pattern: "<!--75-->",
    icon: `<a href="tykvik_set.php" title="${isEn ? "The Squashman" : "Тыквик"}"><img src="${resourcesPath}/i/tykv2014.jpg" alt="${isEn ? "The Squashman" : "Тыквик"}" width="15" height="15" border="0"></a>`,
	color: "Wheat"
}, {
	pattern: "<!--80-->",
	icon: `<a href="mapwars.php" title="${isEn ? "Battles for facilities. Defence." : "Бои за территории. Защита."}"><img src="/i/bselect/mapwars.png?v=3b" alt="" width="15" height="15" border="0"></a>`,
	color: "#00FA9A"
}, {
	pattern: "<!--81-->",
	icon: `<a href="mapwars.php" title="${isEn ? "Battles for facilities. Capture." : "Бои за территории. Захват."}"><img src="/i/bselect/mapwars.png?v=3b" alt="" width="15" height="15" border="0"></a>`,
	color: "#00FA9A"
}, {
	pattern: "<!--88-->",
	icon: `<a href="mapwars.php" title="${isEn ? "Battles for facilities" : "Бои за территории"}"><img src="/i/bselect/mapwars.png?v=3b" alt="" width="15" height="15" border="0"></a>`,
	color: "#00FA9A"
}, {
	pattern: "<!--89-->",
	icon: `<a href="mapwars.php" title="${isEn ? "Battles for facilities. Attack." : "Бои за территории. Атака."}"><img src="/i/bselect/mapwars.png?v=3b" alt="" width="15" height="15" border="0"></a>`,
	color: "#00FA9A"
}, {
	pattern: "<!--94-->",
	icon: `<a href="tj_single.php"><img src="//dcdn.heroeswm.ru/i/tj2ev200.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#cccccc"
}, {
	pattern: "<!--95-->",
	icon: `<a href="task_guild.php" style="height: inherit;" title="${isEn ? "Watcher's guild" : "Гильдия стражей"}"><img src="https://dcdn3.heroeswm.ru/i/bselect/task_guild.png?v=3b" ></a>`,
	color: "#17d3bf"
}, {
	pattern: "<!--96-->",
	icon: `<a href="pirate_event.php"><img src="https://dcdn.heroeswm.ru/i/bselect/cargo_event.png?v=3b" alt="${isEn ? "Pirates Siege" : "Пиратская блокада"}" title="${isEn ? "Pirates Siege" : "Пиратская блокада"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--99-->",
	icon: `<a href="treasure_event.php"><img src="https://dcdn.heroeswm.ru/i/klad_event.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#D2B48C"
}, {
	pattern: "<!--104-->",
	icon: `<a href="mapwars.php" title="${isEn ? "Battles for facilities. Taxes." : "Бои за территории. Налоги."}"><img src="https://dcdn.heroeswm.ru/i/mobile_view/icons_add/tax_blue.png" width="15" height="15" border="0"></a>`,
	color: "#C177FF"
}, {
	pattern: "<!--110-->",
	icon: `<a href="campaign_list.php" title="${isEn ? "Campaigns" : "Кампании"}"><img src="https://dcdn1.heroeswm.ru/i/bselect/campaigns.png?v=3b" width="15" height="15" border="0"></a>`,
	color: "#b5b5b5"
}, {
	pattern: "<!--111-->",
	icon: `<a href="village_def.php"><img src="//dcdn.heroeswm.ru/i/vil_def_n.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#808000"
}, {
	pattern: "<!--113-->",
	icon: `<a href="team_event.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/great_pvp.png?v=3b" alt="" width="15" height="15" border="0"></a>`,
	color: "#FFFF40"
}, {
	pattern: "<!--115-->",
	icon: `<a href="pirate_hunt.php"><img src="https://qcdn.heroeswm.ru/i/pirate_hunt2x2.png" alt="" title="${isEn ? "Pirate Hunt" : "Охота на пиратов"}" width="15" height="15" border="0"></a>`,
	color: "#9ACD32"
}, {
	pattern: "<!--117-->",
	icon: `<a href="tj_single.php"><img src="//dcdn.heroeswm.ru/i/tj2ev200.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#cccccc"
}, {
	pattern: "<!--119-->",
	icon: `<a href="village_def.php"><img src="//dcdn.heroeswm.ru/i/vil_def_n.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#9b5755"
}, {
	pattern: "<!--120-->",
	icon: `<a href="recruit_event.php" title="${isEn ? "Dungeon Caves" : "Подземные пещеры"}"><img src="https://dcdn.heroeswm.ru/i/bselect/recruit_event.png?v=3b" alt="" width="15" height="15" border="0"></a>`,
	color: "#ffaec8"
}, {
	pattern: "<!--123-->",
	icon: `<a href="pirate_self_event.php"><img src="https://dcdn2.heroeswm.ru/i/bselect/pirate_event.png?v=3b" alt="${isEn ? "Pirate raids" : "Пиратские рейды"}" title="${isEn ? "Pirate raids" : "Пиратские рейды"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--126-->",
	icon: `<a href="map.php"><img src="https://dcdn.heroeswm.ru/i/day_dungeon_with/monks.png?v=2" alt="" title="${isEn ? "Group of apostates" : "Группа отступников"}" width="15" height="15" border="0"></a>`,
	color: "#8FBC8F"
}, {
	pattern: "<!--127-->",
	icon: `<a href="leader_guild.php" style="height: inherit;"><img src="https://dcdn1.heroeswm.ru/i/bselect/leaders.png?v=3b" title="${isEn ? "Leader's Guild" : "Гильдия Лидеров"}" style="height: inherit;"></a>`,
	color: "#cccccc"
}, {
	pattern: "<!--131-->",
	icon: `<a href="village_def.php"><img src="//dcdn.heroeswm.ru/i/vil_def_n.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#00CED1"
}, {
	pattern: "<!--133-->",
	icon: `<a href="naym_event.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/naym_event.png" title="${isEn ? "Risky Adventure" : "Рисковая авантюра"}" alt="" width="15" height="15" border="0"></a>`,
	color: "#40E0D0"
}, {
	pattern: "<!--135-->",
	icon: `<a href="leader_guild.php" style="height: inherit;"><img src="https://dcdn1.heroeswm.ru/i/bselect/leaders.png?v=3b" title="${isEn ? "Leader's Guild" : "Гильдия Лидеров"}" style="height: inherit;"></a>`,
	color: "#cccccc"
}, {
	pattern: "<!--137-->",
	icon: `<a href="leader_guild.php" style="height: inherit;"><img src="https://dcdn1.heroeswm.ru/i/bselect/leaders.png?v=3b" title="${isEn ? "Leader's Guild" : "Гильдия Лидеров"}" style="height: inherit;"></a>`,
	color: "#cccccc"
}, {
	pattern: "<!--138-->",
	icon: `<a href="map_hero_event.php"><img src="/i/bselect/map_hero_event.png" title="${isEn ? "Expedition into the fog" : "Туманная экспедиция"}" width="15" height="15" border="0"></a>`,
	color: "#2E8B55"
}, {
	pattern: "<!--139-->",
	icon: `<a href="lg_event.php"><img src="https://dcdn1.heroeswm.ru/i/bselect/leader_event.png?v=3b" title="${isEn ? "Call of Leaders" : "Призыв Лидеров"}" width="15" height="15" border="0"></a>`,
	color: "#2E8B57"
}, {
	pattern: "<!--140-->",
	icon: `<a href="hunting_event.php"><img src="//dcdn.lordswm.com/i/hunting_event2022_08.png" title="${isEn ? "Hunting Season" : "Сезон охоты"}" width="15" height="15" border="0"></a>`,
	color: "#7FFFD4"
}, {
	pattern: "<!--141-->",
	icon: `<a href="tournaments.php"><img src="https://dcdn2.heroeswm.ru/i/bselect/tournaments.png?v=3b" title="${isEn ? "Tournaments" : "Турниры"}" width="15" height="15" border="0"></a>`,
	color: "#7FFFD5"
}, {
	pattern: "<!--142-->",
	icon: `<a href="adventure_event.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/event.png?v=3b" title="${isEn ? "Inferno’s Obsession" : "Наваждение Инферно"}" width="15" height="15" border="0"></a>`,
	color: "#008000"
}, {
	pattern: "<!--143-->",
	icon: `<a href="village_def.php"><img src="//dcdn.heroeswm.ru/i/vil_def_n.jpg" alt="" width="15" height="15" border="0"></a>`,
	color: "#AFEEEE"
}, {
	pattern: "<!--144-->",
	icon: `<a href="faction_event.php"><img src="https://dcdn2.heroeswm.ru/i/bselect/faction_event8.png" alt="" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--146-->",
	icon: `<a href="rogue_like_event.php"><img src="https://dcdn.heroeswm.ru/i/bselect/crossroad_event.png?v=3b" alt="${isEn ? "Сrossroads of Mysteries" : "Распутье тайн"}" title="${isEn ? "Сrossroads of Mysteries" : "Распутье тайн"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--147-->",
	icon: `<a href="reaping_event.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/event.png?v=3b" alt="${isEn ? "New Year's business" : "Новогоднее дело"}" title="${isEn ? "New Year's business" : "Новогоднее дело"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--148-->",
	icon: `<a href="tj_single.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/event.png?v=3b" alt="${isEn ? "Portal of Time" : "Портал времени"}" title="${isEn ? "Portal of Time" : "Портал времени"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--150-->",
	icon: `<a href="ambush_event.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/event.png?v=3b" alt="${isEn ? "Smuggler Interception" : "Отлов контрабандистов"}" title="${isEn ? "Smuggler Interception" : "Отлов контрабандистов"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--151-->",
	icon: `<a href="mercenary_event.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/event.png?v=3b" alt="${isEn ? "Mercenary Ledger" : "Счёт наёмника"}" title="${isEn ? "Mercenary Ledger" : "Счёт наёмника"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--152-->",
	icon: `<a href="map.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/event.png?v=3b" alt="${isEn ? "Map event" : "Событие на карте"}" title="${isEn ? "Map event" : "Событие на карте"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}, {
	pattern: "<!--155-->",
	icon: `<a href="journey_event.php"><img src="https://dcdn3.heroeswm.ru/i/bselect/event.png?v=3b" alt="${isEn ? "Wasteland Legends" : "Легенды пустошей"}" title="${isEn ? "Wasteland Legends" : "Легенды пустошей"}" width="15" height="15" border="0"></a>`,
	color: "#AFEEEF"
}
];

const logContainerSelector = function(doc) {
    if(location.pathname == '/bselect.php') {
        return doc.querySelector('div#hwm_no_zoom>div:nth-of-type(2)>div:nth-of-type(2)');
    }
    if(location.pathname == '/forum_thread.php') {
        return doc.querySelector('table.table3');
    }
    return doc.querySelectorAll('div.global_a_hover')[1] || doc.querySelector('div.global_a_hover');
}
const pagingContainerSelector = function(doc) {
    if(location.pathname == '/gift_box_log.php') {
        return doc.querySelectorAll('td.wbwhite > center')[2];
    }
    if(location.pathname == '/bselect.php') {
        return doc.querySelector('div#hwm_no_zoom>div:nth-of-type(2)>div:nth-of-type(1)');
    }
    if(location.pathname == '/forum_thread.php') {
        return doc.querySelector('body>center>table>tbody>tr>td>center');
    }
    return doc.querySelector("div.hwm_pagination").parentNode;
}
const p_date = /(\d{2}-\d{2}-\d{2}) (\d{1,2}:\d{2}): /; // pattern
const p_user = /(<a.*pl_info\.php\?id=\d+".*><b>.+<\/b><\/a>)/; // pattern

let loading = false;
let stop = false;
const loadCaption = isEn ? "Load" : "Загрузить";
const stopLoadCaption = isEn ? "Stop" : "Остановить";
const forumThreadId = getUrlParamValue(location.href, "id");
const threadId = getUrlParamValue(location.href, "tid");
const smithsThread = isEn ? 121 : 22;
const miscellaneousThread = isEn ? 122 : 23;

main();
function main() {
    processProtocols();
    if(location.pathname == "/sms.php") {
        Array.from(document.querySelectorAll("table.wbwhite > tbody > tr > td:not(:has(td))")).forEach(exudeReferences);
    }
    if(location.pathname == "/pl_info.php") {
        const personalInfoTitleContainer = Array.from(document.querySelectorAll("td.wb > b")).find(x => x.innerText == (isEn ? "Personal info" : "Личная информация"));
        const personalInfoTable = personalInfoTitleContainer.closest("table");
        const personalInfoCell = personalInfoTable.rows[1].cells[0];
        exudeReferences(personalInfoCell);
    }
    if(location.pathname == "/forum_thread.php" || location.pathname == "/forum_messages.php") {
        const table3 = document.querySelector("table.table3");
        if(location.pathname == "/forum_thread.php") {
            if(getPlayerBool("compactForumView")) {
                const firstTable = document.querySelector("body>center>table");
                firstTable.removeAttribute("width");
                addStyle(`
    table.c_darker td {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    table.c_darker td:hover {
        overflow: visible;
    }`);
            }
            if(forumThreadId == smithsThread) {
                // Фильтры для форума услуг кузнецов и оружейников
                table3.insertAdjacentHTML("beforebegin", `
        <tr>
            <td>
                &nbsp;<label for=hideCraftersCheckbox style="cursor:pointer;">${isEn ? "Hide crafters" : "Удалять оружейников"}</label>
                <input type=checkbox ${getPlayerBool("hideCrafters", true) ? 'checked' : ''} id=hideCraftersCheckbox>&nbsp;&nbsp;
            </td>
            <td>
                &nbsp;<label for=hideSmithsCheckbox style="cursor:pointer;">${isEn ? "Hide smiths except 90%" : "Удалять кузнецов, кроме 90%"}</label>
                <input type=checkbox ${getPlayerBool("hideSmiths") ? 'checked' : ''} id=hideSmithsCheckbox>&nbsp;&nbsp;
            </td>
            <td>
                &nbsp;<label for=hideSmiths90Checkbox style="cursor:pointer;">${isEn ? "Hide smiths 90%" : "Удалять кузнецов 90%"}</label>
                <input type=checkbox ${getPlayerBool("hideSmiths90") ? 'checked' : ''} id=hideSmiths90Checkbox>
            </td>
        </tr>`);
                document.getElementById("hideCraftersCheckbox").addEventListener("click", function() { setPlayerValue("hideCrafters", this.checked); filterMessages(); });
                document.getElementById("hideSmithsCheckbox").addEventListener("click", function() { setPlayerValue("hideSmiths", this.checked); filterMessages(); });
                document.getElementById("hideSmiths90Checkbox").addEventListener("click", function() { setPlayerValue("hideSmiths90", this.checked); filterMessages(); });
            }
            if(forumThreadId == miscellaneousThread) {
                // Фильтры для форума покупок, продаж, услуг
                table3.insertAdjacentHTML("beforebegin", `
        <tr>
            <td>
                &nbsp;<label for=hideServicesCheckbox style="cursor:pointer;">${isEn ? "Hide services" : "Удалять услуги"}</label>
                <input type=checkbox ${getPlayerBool("hideServices", true) ? 'checked' : ''} id=hideServicesCheckbox>&nbsp;&nbsp;
            </td>
            <td>
                &nbsp;<label for=hideBuyCheckbox style="cursor:pointer;">${isEn ? "Hide buing" : "Удалять покупки"}</label>
                <input type=checkbox ${getPlayerBool("hideBuy") ? 'checked' : ''} id=hideBuyCheckbox>&nbsp;&nbsp;
            </td>
            <td>
                &nbsp;<label for=hideSellCheckbox style="cursor:pointer;">${isEn ? "Hide selling" : "Удалять продажи"}</label>
                <input type=checkbox ${getPlayerBool("hideSell") ? 'checked' : ''} id=hideSellCheckbox>&nbsp;&nbsp;
            </td>
        </tr>`);
                document.getElementById("hideServicesCheckbox").addEventListener("click", function() { setPlayerValue("hideServices", this.checked); filterMessages(); });
                document.getElementById("hideBuyCheckbox").addEventListener("click", function() { setPlayerValue("hideBuy", this.checked); filterMessages(); });
                document.getElementById("hideSellCheckbox").addEventListener("click", function() { setPlayerValue("hideSell", this.checked); filterMessages(); });
            }
        }
        if(location.pathname == "/forum_messages.php") {
            table3.insertAdjacentHTML("beforebegin", `
    <tr>
        <td>
            &nbsp;<label for=hideBlackListMessagesCheckbox style="cursor: pointer;">${isEn ? "Hide marked" : "Скрыть помеченные"}</label>
            <input type=checkbox ${getPlayerBool("hideBlackListMessages") ? 'checked' : ''} id=hideBlackListMessagesCheckbox>&nbsp;&nbsp;
            &nbsp;<label for=markedOnlyCheckbox style="cursor: pointer;">${isEn ? "Marked only" : "Только помеченные"}</label>
            <input type=checkbox ${getPlayerBool("markedOnly") ? 'checked' : ''} id=markedOnlyCheckbox>&nbsp;&nbsp;
            &nbsp;<label for=compactForumViewCheckbox style="cursor: pointer;">${isEn ? "Compact view" : "Компактное представление"}</label>
            <input type=checkbox ${getPlayerBool("compactForumView") ? 'checked' : ''} id=compactForumViewCheckbox>&nbsp;&nbsp;
        </td>
    </tr>`);
            document.getElementById("hideBlackListMessagesCheckbox").addEventListener("click", function() { setPlayerValue("hideBlackListMessages", this.checked); filterMessages(); });
            document.getElementById("markedOnlyCheckbox").addEventListener("click", function() { setPlayerValue("markedOnly", this.checked); filterMessages(); });
            document.getElementById("compactForumViewCheckbox").addEventListener("click", function() { setPlayerValue("compactForumView", this.checked); filterMessages(); });
            Array.from(table3.querySelectorAll('tr:nth-child(odd) > td:first-child')).forEach(exudeReferences);
            addStyle("table.compactForum tr.message_footer td { padding: 0px; }");
        }
        const currentPageIndex = getUrlParamValue(location.href, "page") || 0;
        if(currentPageIndex != "last") {
            // Кнопка загрузки следующей страницы
            table3.insertAdjacentHTML("afterend", `<center id=loadNextPageButton style="cursor: pointer;"><ins>${isEn ? "Load next page" : "Загрузить следующую страницу"}</ins><span style="display: none;" id=currentPageIndexHolder>${currentPageIndex}</span></center>`);
            document.getElementById("loadNextPageButton").addEventListener("click", loadNextPage);
        }
        filterMessages();
        addBlackListCheckboxes();
    }
    addTextCounter();
}
function addTextCounter() {
    const settingsByUrl = {
        "/forum_messages.php": { maxLength: 3000, textareaSelector: "textarea#nm_txta", messageLengthSpanCreator: function(textarea) { return addElement("span", { id: "messageLengthSpan" }, textarea.closest("tr").cells[0]); } },
        "/new_topic.php": { maxLength: 3000, textareaSelector: "textarea#nm_txta", messageLengthSpanCreator: function(textarea) { return addElement("span", { id: "messageLengthSpan" }, textarea.closest("tr").cells[0]); } },
        "/pers_settings.php": { maxLength: 2000, textareaSelector: "textarea[name=info]", messageLengthSpanCreator: function(textarea) { const node2000 = findText(textarea.closest("td"), x => x.textContent && x.textContent.includes("2000")); node2000.replaceWith(addElement("span", { innerHTML: node2000.textContent.replace("2000", `<span id=messageLengthSpan></span>`) })); } },
        "/sms-create.php": { maxLength: 3900, textareaSelector: "textarea[name=msg]", messageLengthSpanCreator: function(textarea) { const cell = textarea.closest("tr").previousElementSibling.firstChild; cell.innerHTML = cell.innerHTML.replace(":", ` (<span id=messageLengthSpan></span>):`); } },
        "/sms.php": { maxLength: 2900, textareaSelector: "textarea[name=data]", messageLengthSpanCreator: function(textarea) { const cell = textarea.closest("tr").nextElementSibling.firstChild; cell.insertAdjacentHTML("afterbegin", `(<span id=messageLengthSpan></span>) `); } },
        "/clan_control.php": { maxLength: 9800 },
        "/clan_broadcast.php": { maxLength: 3900 },
    };
    const settings = settingsByUrl[location.pathname];
    if(settings) {
        const textarea = document.querySelector(settings.textareaSelector || "textarea");
        if(textarea) {
            if(!textarea.hasAttribute("maxlength")) {
                textarea.maxLength = settings.maxLength;
            } else {
                console.log(`native maxLength: ${textarea.getAttribute("maxlength")}, my: ${settings.maxLength}`)
            }
            if(settings.messageLengthSpanCreator) {
                settings.messageLengthSpanCreator(textarea);
            }
            const messageLengthSpan = document.getElementById("messageLengthSpan");
            if(messageLengthSpan) {
                messageLengthSpan.innerText = `${textarea.value.length}/${textarea.maxLength}`;
            }
            textarea.addEventListener("input", function() {
                this.style.backgroundColor = this.value.length == this.maxLength ? "#fcc" : "";
                if(messageLengthSpan) messageLengthSpan.innerText = `${this.value.length}/${this.maxLength}`;
            });
        }
    }
}
function processProtocols() {
    if(["/sklad_log.php", "/pl_transfers.php", "/pl_warlog.php", "/clan_log.php", "/gift_box_log.php", "/bselect.php", "/forum_thread.php"].includes(location.pathname)) {
        const header = pagingContainerSelector(document);
        const protocolSearchInput = addElement("input", { id: "protocolSearchInput", type: "text", style: "width: 100px; vertical-align: top;", title: isEn ? "Protocol filter" : "Фильтр по протоколу", onfocus: "this.select();" }, header);
        protocolSearchInput.addEventListener("input", search);
        
        if(location.pathname != "/bselect.php") {
            const toggleLoadingButton = addElement("div", { id: "toggleLoadingButton", class: "home_button2 btn_hover2", style: "display: inline-block; vertical-align: top; padding: 0px 4px; width: fit-content;", innerText: loadCaption }, header);
            toggleLoadingButton.addEventListener("click", toggleLoading);

            const pageCountInput = addElement("input", { id: "pageCountInput", type: "number", value: getPlayerValue("ProtocolPageAmount", 5), style: "width: 50px; vertical-align: top;", title: isEn ? "Page amount to loading" : "Количество страниц для загрузки", onfocus: "this.select();" }, header);
            pageCountInput.addEventListener("change", function() { setPlayerValue("ProtocolPageAmount", this.value); });
        }
        processLog();
    }
}
async function toggleLoading() {
    const toggleLoadingButton = document.getElementById("toggleLoadingButton");
    if(loading) {
        stop = true;
        return;
    }
    loading = true;
    //stop = false;
    const currentPageIndex = parseInt(getUrlParamValue(location.href, "page") || 0);
    const pageCount = Number(getPlayerValue("ProtocolPageAmount", 5)) || 5;
    for(let newPageIndex = currentPageIndex + 1; newPageIndex <= currentPageIndex + pageCount; newPageIndex++) {
        toggleLoadingButton.innerText = `${stopLoadCaption} ${newPageIndex + 1}`;
        const nextPageUrl = new URL(location.href);
        nextPageUrl.searchParams.set('page', newPageIndex);
        //console.log(nextPageUrl.toString());
        const nextPage = await getRequest(nextPageUrl);
        processLog(nextPage);
        window.history.replaceState(null, nextPage.title, nextPageUrl);
        if(stop) {
            break;
        }
    }
    loading = false;
    stop = false;
    toggleLoadingButton.innerText = loadCaption;
}
function processLog(doc = document) {
    remap(doc);
    const logContainer = logContainerSelector(document); //console.log(logContainer);
    if(!logContainer) {
        return;
    }
    const nextPageLogContainer = logContainerSelector(doc);
    if(logContainer.tagName == "TABLE" && nextPageLogContainer.tagName == "TABLE") {
        if(doc != document) {
            for(const newRow of [...nextPageLogContainer.rows].slice(1)) {
                logContainer.querySelector("tbody").insertAdjacentElement("beforeend", newRow);
            }
        }
    } else {
        logContainer.style.fontSize = "9pt";
        logContainer.style.borderTop = "1px solid black";
        let rawBattles = nextPageLogContainer.innerHTML.split('<br>').filter(x => x && x != "\n" && (!x.startsWith("<center>") || doc == document));
        //console.log(rawBattles)
            //rawBattles.pop(); //location.pathname == '/gift_box_log.php'
        if(doc == document) {
            logContainer.innerHTML = "";
        }
        for(let rawBattle of rawBattles) {
            if(rawBattle.startsWith("<center>")) {
                logContainer.insertAdjacentHTML("beforeend", rawBattle);
                continue;
            }
            const type = types.find(x => rawBattle.includes(x.pattern));
            // rawBattle = rawBattle.replace(p_date, "<div>$1</div><div>$2</div>");
            // rawBattle = rawBattle.replace(p_user, "<div>$1</div>");		
            const rowHtml = (type?.icon || "") + rawBattle.replace("vs", "&nbsp;vs&nbsp;").replace("&nbsp;&nbsp;", "&nbsp;");
            const battleContainer = addElement('div', { innerHTML: rowHtml, class: "battle_row", style: `background-color: ${type?.color || "inherit"}` }, logContainer);
            const battleLinksSpan = battleContainer.querySelector("span[name=battleLinksSpan]");
            battleLinksSpan?.remove();
        }
    }
    search();
}
function remap(doc) {
    if(location.pathname == '/bselect.php') {
        const logContainer = logContainerSelector(doc);
        logContainer.style.width = "98%";
        logContainer.style.overflowY = "auto";
        logContainer.style.maxHeight = "65vh";
    }
    if(location.pathname == '/gift_box_log.php') {
        const logContainer = addElement("div", { class: "global_a_hover" });
        const td = doc.querySelector('td.wbwhite');
        let i = 0;
        const children = Array.from(td.childNodes);
        for(const child of children) {
            if(i == 3) {
                child.insertAdjacentElement("afterend", logContainer);
                //console.log(logContainer)
            }
            //console.log(child)
            if(i > 3) {
                if(child.nodeName.toLowerCase() == "center") {
                    child.remove();
                } else {
                    logContainer.appendChild(child);
                }
            }
            i++;
        }
    }
}
function search() {
    const value = document.getElementById("protocolSearchInput").value;
    const regex = new RegExp(value, "gi");
    let logContainer = logContainerSelector(document);
    let listElementsSelector = "div";
    if(location.pathname == "/forum_thread.php") {
        logContainer = document;
        listElementsSelector = "table.table3>tbody>tr";
    }
    Array.from(logContainer.querySelectorAll(listElementsSelector)).forEach(x => {
        x.innerHTML = x.innerHTML.replace(/<\/?mark[^>]*>/g, "");
        const searched = regex.test(x.innerHTML);
        x.style.display = searched ? "" : "none";
        if(searched && value.length > 0) {
            x.innerHTML = x.innerHTML.replace(regex, `<mark>$&</mark>`);
        }
    });
}
function addBlackListCheckboxes() {
    if(location.pathname != "/forum_messages.php") {
        return;
    }
    const table3 = document.querySelector("table.table3");
    const authorRefs = table3.querySelectorAll("tr > td a[href^='pl_info.php?id=']");
    const forumBlackList = JSON.parse(getValue("forumBlackList", "[]"));
    for(authorRef of authorRefs) {
        const cell = authorRef.closest("td");
        if(!cell.querySelector("input[name=blackListCheckbox]")) {
            const playerId = parseInt(getUrlParamValue(authorRef.href, "id"));
            const blackListCheckbox = addElement("input", { type: "checkbox", name: "blackListCheckbox", playerId: playerId, title: isEn ? "Mark" : "Пометить" }, authorRef, "beforebegin");
            blackListCheckbox.checked = forumBlackList.includes(playerId);
            blackListCheckbox.addEventListener("change", function() { addToBlackList(this.getAttribute("playerId"), this.checked); });
        }
    }
}
function addToBlackList(playerId, adding) {
    const forumBlackList = JSON.parse(getValue("forumBlackList", "[]"));
    playerId = parseInt(playerId);
    if(adding) {
        if(!forumBlackList.includes(playerId)) {
            forumBlackList.push(playerId);
            Array.from(document.querySelectorAll(`table.table3 input[name=blackListCheckbox]`)).filter(x => x.getAttribute("playerId") == playerId).forEach(x => x.checked = true);
        }
    } else {
        const indexOfId = forumBlackList.indexOf(playerId);
        if(indexOfId > -1) {
            forumBlackList.splice(indexOfId, 1);
            Array.from(document.querySelectorAll(`table.table3 input[name=blackListCheckbox]`)).filter(x => x.getAttribute("playerId") == playerId).forEach(x => x.checked = false);
        }
    }
    setValue("forumBlackList", JSON.stringify(forumBlackList));
    filterMessages();
}
async function loadNextPage() {
    document.getElementById("loadNextPageButton").disabled = true;
    const currentPageIndexHolder = document.getElementById('currentPageIndexHolder');
    const nextPageIndex = Number(currentPageIndexHolder.innerText) + 1;
    currentPageIndexHolder.innerText = nextPageIndex;
    const pageBottom = document.body.scrollHeight;
    
    const nextPageUrl = `${location.pathname}?${threadId ? `tid=${threadId}` : ""}${forumThreadId ? `id=${forumThreadId}` : ""}&page=${nextPageIndex}`;
    //console.log(nextPageUrl)
    const nextPage = await getRequest(nextPageUrl);

    const newTable3 = nextPage.querySelector("table.table3 > tbody");
    if(location.pathname == "/forum_messages.php") {
        Array.from(newTable3.querySelectorAll('tr:nth-child(odd) > td:first-child')).forEach(exudeReferences);
    }
    const newRows = Array.from(newTable3.rows).slice(1); //console.log(newRows);
    //const newTable3exec = /(<tr.*><td><a href=.?forum_messages\.php\?tid=.+<\/a><\/td><\/tr>)/.exec(nextPage.querySelector("table.table3").innerHTML);
    const table3 = document.querySelector("table.table3 > tbody");
    //table3.insertAdjacentHTML("beforeend", `<tr><td colspan=2><hr></td><td><a href='${nextPageUrl.slice(1)}'><b><font color=red>${nextPageIndex + 1}</font></b></a></td><td colspan=2><hr></td></tr>${newTable3exec[1]}`);
    table3.insertAdjacentHTML("beforeend", getBreakLine(nextPageIndex, nextPageUrl));
    newRows.forEach(x => table3.insertAdjacentElement("beforeend", x));
    filterMessages();
    addBlackListCheckboxes();
    Array.from(document.querySelectorAll(`center > a[href='${nextPageUrl.slice(1)}']`)).forEach(x => x.replaceWith(addElement("b", {innerHTML: `<font color="red">${nextPageIndex + 1}</font>`}))); // Ссылку на загруженную страницу заменяем красным номером страницы
    //window.scrollTo(0, pageBottom + 1);
    window.history.replaceState(null, nextPage.title, nextPageUrl);
    document.getElementById("loadNextPageButton").disabled = false;
}
function getBreakLine(nextPageIndex, nextPageUrl) {
    if(location.pathname == "/forum_thread.php") {
        return `
<tr>
    <td colspan=2>
        <hr>
    </td>
    <td>
        <a href='${nextPageUrl.slice(1)}'><b><font color=red>${nextPageIndex + 1}</font></b></a>
    </td>
    <td colspan=2>
        <hr>
    </td>
</tr>`;
    }
    if(location.pathname == "/forum_messages.php") {
        return `
<tr>
    <td name=compactViewTogglableCell style="${getPlayerBool("compactForumView") ? "display: none;" : ""}">
        <hr style="color: #9f9f9f; background-color: #9f9f9f; border: none; height: 2px;">
    </td>
    <td>
        <div style="display: flex; flex-direction: row; align-items: center;">
          <div style="flex-grow: 0;">
              <a href='${nextPageUrl.slice(1)}'><b><font color=red>${nextPageIndex + 1}</font></b></a>
          </div>
          <div style="flex-grow: 1; height: 2px; background-color: #9f9f9f;">
          </div>
        </div>
    </td>
</tr>`;
    }
}
function filterMessages() {
    const userFilters = { hideCrafters: getPlayerBool("hideCrafters", true), hideSmiths: getPlayerBool("hideSmiths"), hideSmiths90: getPlayerBool("hideSmiths90"), hideServices: getPlayerBool("hideServices", true), hideBuy: getPlayerBool("hideBuy"), hideSell: getPlayerBool("hideSell"), hideBlackListMessages: getPlayerBool("hideBlackListMessages"), markedOnly: getPlayerBool("markedOnly") };
    const forumBlackList = JSON.parse(getValue("forumBlackList", "[]"));
    let evenRow = false;
    const table3 = document.querySelector("table.table3");
    const allRows = Array.from(document.querySelectorAll("table.table3 > tbody > tr"));
    if(location.pathname == "/forum_messages.php") {
        if(!isMobileDevice) {
            const table = [...document.querySelectorAll("body > center > table")].find(x => x.querySelector("a[href='forum.php']"));
            table.style.width = getPlayerBool("compactForumView") ? "60%" : "98%";
        }
        allRows[0].cells[0].style.display = getPlayerBool("compactForumView") ? "none" : "";
    }    
    let rows = allRows.slice(1);
    if(location.pathname == "/forum_messages.php") {
        if(getPlayerBool("compactForumView")) {
            table3.classList.add("compactForum")
        } else {
            table3.classList.remove("compactForum")
        }
        rows = rows.filter(x => x.cells[0].getAttribute("rowspan") == "2");
    }
    Array.from(document.querySelectorAll("td[name=compactViewTogglableCell]")).forEach(x => { x.style.display = getPlayerBool("compactForumView") ? "none" : ""; });
    //console.log(`rows.length: ${rows.length}`);
    for(const row of rows) {
        //console.log(`evenRow: ${evenRow}`);
        //console.log(row);
        if(location.pathname == "/forum_messages.php") {
            const innerRow = row.cells[1].querySelector("table tr");
            const authorInfo = innerRow.querySelector("span[name=authorInfo]");
            if(getPlayerBool("compactForumView") && !authorInfo) {
                addElement("span", { name: "authorInfo", innerHTML: "&nbsp;" + row.cells[0].innerHTML.replace("<br>", "&nbsp;") }, innerRow.cells[0]);
                //innerRow.querySelector("br").remove();
            }
            if(!getPlayerBool("compactForumView") && authorInfo) {
                authorInfo.remove();
            }
            row.cells[0].style.display = getPlayerBool("compactForumView") ? "none" : "";
        }
        let isHideRow = evalHideRow(userFilters, row, forumBlackList);
        row.style.display = isHideRow ? 'none' : '';
        if(location.pathname == "/forum_messages.php") {
            row.nextElementSibling.style.display = isHideRow ? 'none' : '';
        }
        if(!isHideRow) {
            if(location.pathname == "/forum_thread.php") {
                row.className = evenRow ? "second" : "";
            }
            if(location.pathname == "/forum_messages.php") {
                if(isMobileDevice) {
                    //console.log(row.nextElementSibling)
                    row.nextElementSibling.cells[0].style.fontSize = "20px";
                }
            }
            evenRow = !evenRow;
        }
    }
}
function evalHideRow(userFilters, row, forumBlackList) {
    if(location.pathname == "/forum_messages.php") {
        if(userFilters.hideBlackListMessages) {
            const authorRef = row.cells[0].querySelector("a[href^='pl_info.php?id=']");
            if(authorRef) {
                const playerId = parseInt(getUrlParamValue(authorRef.href, "id"));
                return forumBlackList.includes(playerId);
            }
        }
        if(userFilters.markedOnly) {
            const authorRef = row.cells[0].querySelector("a[href^='pl_info.php?id=']");
            if(authorRef) {
                const playerId = parseInt(getUrlParamValue(authorRef.href, "id"));
                return !forumBlackList.includes(playerId);
            }
        }
        return false;
    }
    const messageRef = row.querySelector("td > a[href^='forum_messages.php?tid=']");
    if(!messageRef) {
        return false;
    }
    const message = messageRef.innerHTML.toLowerCase();
    return location.pathname == "/forum_thread.php" && forumThreadId == smithsThread && (
                userFilters.hideCrafters && isCraft(message) && !isRepair(message)
                || userFilters.hideSmiths && isRepairExcept90(message) && !isCraft(message)
                || userFilters.hideSmiths90 && isRepair90(message) && !isCraft(message)
                )
            || location.pathname == "/forum_thread.php" && forumThreadId == miscellaneousThread && (
                userFilters.hideServices && (message.indexOf("услуги") != -1 || message.indexOf("service") != -1)
                || userFilters.hideBuy && (message.indexOf("куплю") != -1 || message.indexOf("kуплю") != -1 || message.indexOf("buy") != -1)
                || userFilters.hideSell && (message.indexOf("прода") != -1 || message.indexOf("sell") != -1)
                );
}
function isCraft(message) { return message.indexOf("крафт") != -1 || message.indexOf("kрафт") != -1 || message.indexOf("armour") != -1 || message.indexOf("weapon") != -1 || message.indexOf("jewe") != -1; }
function isRepair(message) { return message.indexOf("ремонт") != -1 || message.indexOf("repair") != -1; }
function is90(message) { return (message.indexOf("90%") != -1 || message.indexOf("90 %") != -1 || message.indexOf("90 за") != -1); }
function isRepair90(message) { return isRepair(message) && is90(message); }
function isRepairExcept90(message) { return isRepair(message) && !is90(message); }
function exudeReferences(element) { Array.from(element.childNodes).filter(x => x.nodeName == "#text").forEach(x => { addElement('span', { innerHTML: linkify(x.textContent) }, x, "beforebegin"); x.remove(); }) }
function linkify(text) { 
    //const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig; // Put the URL to variable $1 and Domain name to $3 after visiting the URL
    const linkRexp = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
    return text.replace(linkRexp, "<a href='$1' target='_blank'>$1</a>");
}
function collectTextNodes(node) {
    let textNodes = [];
    for(node = node.firstChild; node; node = node.nextSibling) {
        if(node.nodeType == 3 && node.textContent.trim()) {
            textNodes.push(node);
        } else {
            textNodes = textNodes.concat(filterTextNode(node));
        }
    }
    return textNodes;
}
function findText(node, selector) {
    for(node = node.firstChild; node; node = node.nextSibling) {
        if(node.nodeType == 3 && node.textContent.trim()) {
            if(selector(node)) {
                return node;
            }
        } else {
            const result = findText(node, selector);
            if(result) {
                return result;
            }
        }
    }
    return null;
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
