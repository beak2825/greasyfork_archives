// ==UserScript==
// @name           hwmEcostat
// @namespace      Tamozhnya1
// @author         LazyGreg, demin, перф, Tamozhnya1
// @description    Окончание смен и баланс предприятий на карте и в статистике. Сортировка статистики по потребности. Предпросмотр поребителей в обобщенной статистике.
// @version        5.5
// @include        https://*heroeswm.ru/map.php*
// @include        *lordswm.com/*
// @include        https://*heroeswm.*/map.php*
// @include        https://*heroeswm.*/ecostat*
// @include        https://*heroeswm.*/object-info.php*
// @include        https://*heroeswm.*/mercenary_guild.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant 		   GM.xmlHttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/526540/hwmEcostat.user.js
// @updateURL https://update.greasyfork.org/scripts/526540/hwmEcostat.meta.js
// ==/UserScript==

// (c) 2009, LazyGreg  http://www.heroeswm.ru/pl_info.php?id=160839
// (c) 2010-2012, demin  (http://www.heroeswm.ru/pl_info.php?id=15091)
// (c) 2013, перф  (http://www.heroeswm.ru/pl_info.php?id=2188492)

// 4.14 24.07.2020 ввод акционерных предприятий, сместился баланс.
// 4.13 14.03.2020 изменение значков ресурсов.
// 4.12 19.11.2018 перевод сервера игры на https://
// 4.11 30.09.2015 добавлен сектор Sublime Arbor.
// 4.10 11.12.2013 полностью переработан алгоритм получения баланса и времени (быстрее обрабатывает, сохраняет баланс даже если нет Окончания смены).
// 4.06 10.12.2013 выделение цветом времени объектов за последние 5 минут при балансе >1000з.
// 4.05 19.11.2013 добавлены новые сектора, 5 переменных для хранения значений.
// 4.03 09.10.2013 fix для FF3.6.
// 4.02 09.10.2013 Предприятия разбиты в 3 переменных в зависимости от id; Выделение цветом и жирным ячейки "Может купить" в таблице статистики.
// 4.01 Добавлены балансы

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

const resourcesPath = `${location.protocol}//${location.host.replace("www", "dcdn")}`;
const SortType = { Text: 1, Number: 2 };

// ===== ID - Location lookup table =====
const id2loc = [
    { abbr: "EmC", name: "Empire Capital", colr: "#000000", ids: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 32, 34, 38, 165] },
    { abbr: "EsR", name: "East River", colr: "#000000", ids: [23,24,25,26,28,33,36,75,87,89,238,258,279,300,321,342] },
    { abbr: "PoR", name: "Portal's Ruins", colr: "#FF0000", ids: [92,93,99,100,102,118,163,211,217,228,245,266,287,308,329,350] },
    { abbr: "WoD", name: "Wolf's Dale", colr: "#000000", ids: [43,44,45,46,47,48,74,85,86,226,241,261,282,303,324,345] },
    { abbr: "LzL", name: "Lizard's Lowland", colr: "#009900", ids: [56,57,58,59,60,61,63,64,80,83,242,263,284,305,326,347] },
    { abbr: "GrW", name: "Green Wood", colr: "#009900", ids: [67,68,69,70,71,72,76,77,81,88,243,264,285,306,327,348] },
    { abbr: "SnC", name: "Sunny City", colr: "#CC6600", ids: [103,104,105,106,107,115,116,213,220,231,248,269,290,311,332,353] },
    { abbr: "ShS", name: "Shining Spring", colr: "#009900", ids: [108,109,110,111,112,113,114,117,219,230,247,268,289,310,331,352] },
    { abbr: "EgN", name: "Eagle's Nest", colr: "#CC6600", ids: [94,95,97,98,101,119,120,139,140,227,244,265,286,307,328,349] },
    { abbr: "PcC", name: "Peaceful Camp", colr: "#CC6600", ids: [49,50,51,52,53,54,55,73,79,82,141,262,283,304,325,346] },

    { abbr: "TgL", name: "Tiger's Lake", colr: "#000000", ids: [13,14,15,16,27,31,35,39,84,224,239,259,280,301,322,343] },
    { abbr: "RgW", name: "Rogue's Wood", colr: "#000000", ids: [18,19,20,21,22,30,37,78,90,225,240,260,281,302,323,344] },
    { abbr: "MgM", name: "Magma Mines", colr: "#3300FF", ids: [121,122,135,142,143,144,145,164,216,232,249,270,291,312,333,354] },
    { abbr: "BrM", name: "Bear' Mountain", colr: "#3300FF", ids: [123,124,125,136,146,147,148,149,214,215,250,271,292,313,334,355] },
    { abbr: "FrT", name: "Fairy Trees", colr: "#3300FF", ids: [126,127,134,150,151,152,153,212,221,233,251,272,293,314,335,356] },
    { abbr: "MfC", name: "Mythril Coast", colr: "#3300FF", ids: [128,129,130,137,138,154,155,156,157,235,253,274,295,316,337,358] },
    { abbr: "PrC", name: "Port City", colr: "#3300FF", ids: [131,132,133,158,159,160,161,162,222,234,252,273,294,315,336,357] },
    { abbr: "FsV", name: "Fishing Village", colr: "#FF0000", ids: [166,174,175,196,197,198,199,200,223,236,256,277,298,319,340,361] },
    { abbr: "DrC", name: "Dragons's Caves", colr: "#000000", ids: [167,168,169,170,171,172,209,210,218,229,246,267,288,309,330,351] },
    { abbr: "GtW", name: "Great Wall", colr: "#FF0000", ids: [173,178,179,192,193,194,195,201,202,203,254,275,296,317,338,359] },

    { abbr: "TiV", name: "Titans' Valley", colr: "#FF0000", ids: [176,177,187,188,189,190,191,206,207,208,255,276,297,318,339,360] },
    { abbr: "KiC", name: "Kingdom Castle", colr: "#FF0000", ids: [180,181,182,183,184,185,186,204,205,237,257,278,299,320,341,362] },
    { abbr: "UnS", name: "Ungovernable Steppe", colr: "#CC6600", ids: [363,364,365,366,369,370,371,372,373,374,375,376,377,378,379,380] },
    { abbr: "CrG", name: "Crystal Garden", colr: "#CC6600", ids: [367,368,381,382,383,384,385,386,387,388,389,390,391,392,393,394] },
    { abbr: "Wld", name: "The Wilderness", colr: "#009900", ids: [395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410] },
    { abbr: "SbA", name: "Sublime Arbor", colr: "#009900", ids: [411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426] },
];

main();
function main() {
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
    refreshObjectData();
    showObjectsInfo();
    let refreshStatisticsParent;
    if(location.pathname == "/map.php") {
        const refsContainer = document.querySelector("div#hwm_map_objects_and_buttons");
        observe(refsContainer, function() { showObjectsInfo(); });
        // Настройки
        const ecostatRef = document.querySelector("div.map_text_margin > a[href='ecostat.php']");
        if(ecostatRef) {
            ecostatRef.style.display = "inline-block";
            const ecostatRefContainer = ecostatRef.closest("div");

            const scriptSettingsButton = addElement('div', { class: "home_button2 btn_hover2", innerHTML: '&#9881;', title: (isEn ? "Script settings" : "Настройки скрипта") + " " + GM_info.script.name, style: "display: inline-block; width: fit-content;" }, ecostatRefContainer);
            scriptSettingsButton.addEventListener("click", showScriptSettings);

            refreshStatisticsParent = ecostatRefContainer;
        }
    }
    if(location.pathname == "/ecostat_details.php") {
        refreshStatisticsParent = document.querySelector("div#tableDiv > table > thead > tr > td");
    }
    if(refreshStatisticsParent) {
        const refreshStatisticsButtonStyle = "display: inline-block; width: fit-content;" + (location.pathname == "/ecostat_details.php" ? " max-height: 16px; vertical-align: middle; line-height: 16px;" : "");
        const refreshStatisticsButton = addElement('div', { class: "home_button2 btn_hover2", innerHTML: '&#8635;', title: (isEn ? "Refresh statistics" : "Обновить статистику"), style: refreshStatisticsButtonStyle }, refreshStatisticsParent);
        refreshStatisticsButton.addEventListener("click", function(e) { refreshStatistics(e); });
    }
    if(location.pathname == "/ecostat.php" && getPlayerBool("autoloadStatisticsDetails")) {
        const resourcesIds = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 55, 77, 80, 81];
        [...document.querySelectorAll("div#tableDiv table tr > td > a[href^='ecostat_details.php?id=']")].filter(x => resourcesIds.includes(parseInt(getUrlParamValue(x.href, "id")))).map(x => { return { row: x.closest("tr"), id: parseInt(getUrlParamValue(x.href, "id")) }; }).forEach(x => {
            let timeout;
            x.row.addEventListener("mouseenter", async function(e) { timeout = setTimeout(function() { showEcostatsDetail(e, x.id) }, 500); })
            x.row.addEventListener("mouseleave", function(e) { clearTimeout(timeout); const tooltipDiv = document.getElementById(`ecostatDetails${x.id}TooltipDiv`); if(tooltipDiv) { tooltipDiv.style.display = "none"; } });
        });
    }
}
async function showEcostatsDetail(e, id) {
    [...document.querySelectorAll("div[name=ecostatDetailsTooltipDiv]")].forEach(x => x.style.display = "none");
    let tooltipDiv = document.getElementById(`ecostatDetails${id}TooltipDiv`);
    if(!tooltipDiv) {
        e.target.style.position = "relative";
        tooltipDiv = addElement("div", { id: `ecostatDetails${id}TooltipDiv`, name: "ecostatDetailsTooltipDiv", innerHTML: isEn ? "Loading..." : "Загрузка...", style: "position: absolute; left: 0px; z-index: 150;" }, e.target);

        const ecostatDetailsDoc = await getRequest(`/ecostat_details.php?id=${id}`);
        //console.log(ecostatDetailsDoc);
        const buyDiv1 = ecostatDetailsDoc.querySelector("div#global_table_div2");
        console.log(buyDiv1);
        //const buyDiv = ecostatDetailsDoc.querySelector("div#global_table_div2 > div#tableDiv");
        
        [...buyDiv1.querySelectorAll("tr")].forEach(row => {
            const buyAmount = Number(row.cells[1].innerHTML.replace(/&nbsp;/g, ""));
            if(!(buyAmount > 0)) {
                row.style.display = "none";
            } else {
                const objectRefs = [...row.querySelectorAll("a[href^='object-info.php']")];
                const objectId = parseInt(getUrlParamValue(objectRefs[0].href, "id"));
                if(getPlayerBool("HideObjectsNamesInStatistics")) {
                    objectRefs[0].title = objectRefs[1].innerText;
                    objectRefs[1].remove();
                }
                const loc_data = id2loc.find(x => x.ids.includes(objectId)) || { abbr: "n/a", name: "New Loc?", colr: "#000000" };
                row.cells[0].insertAdjacentHTML("beforeend", `,&nbsp;<span title="${loc_data.name}"><b><font color=${loc_data.colr}>${getPlayerBool("ShowFullSectorNames") ? loc_data.name : loc_data.abbr}</font></b></span>`);
                row.cells[0].style.width = "300px";
            }
        });
        sortTable(buyDiv1.querySelector("table"), 1, 1, SortType.Number, x => -Number(x.innerHTML.replace(/&nbsp;/g, "")));
        tooltipDiv.innerHTML = buyDiv1.outerHTML;
    }
    const anchorRect = e.target.getBoundingClientRect();
    //tooltipDiv.style.top = `${anchorRect.height}px`;
    tooltipDiv.style.left = `${e.x + 5 - anchorRect.left}px`;
    tooltipDiv.style.display = "";
    //console.log(`tooltipDiv.style.display: ${tooltipDiv.style.display}`);
}
function showObjectsInfo() {
    let objectInfoRefs;
    if(location.pathname == "/map.php") {
        objectInfoRefs = document.querySelectorAll("div#map_right_block tr > td:first-child > a[href^='object-info.php']");
    }
    if(location.pathname == "/ecostat_details.php") {
        const objectInfoRefsAll = Array.from(document.querySelectorAll("div#tableDiv tr > td:first-child > a[href^='object-info.php']"));
        const groups = groupByToArray(objectInfoRefsAll, x => x.closest("tr"));
        objectInfoRefs = groups.map(x => x.values.findLast(y => true));
    }
    if(location.pathname == "/mercenary_guild.php") {
    	objectInfoRefs = document.querySelectorAll("center > table a[href^='object-info.php'");
    }
    if(!objectInfoRefs) {
        return;
    }
    //console.log(objectInfoRefs)
    //const objects = [];
	let row_count = 0;
	for(const objectInfoRef of objectInfoRefs) {
        const isEvenRow = row_count % 2 == 0;
        const row = objectInfoRef.closest("tr");
        const objectId = parseInt(getUrlParamValue(objectInfoRef.href, "id"));
		// if(objects.includes(objectId)) {
            // continue;
        // }
        // objects.push(objectId);
        const loc_data = id2loc.find(x => x.ids.includes(objectId)) || { abbr: "n/a", name: "New Loc?", colr: "#000000" };

		if(location.pathname == "/ecostat_details.php") { // add location only in Ecostat page
			// if(getPlayerBool("HideObjectOwner")) {
                // while(objectInfoRef.parentNode.childNodes[2]) {
                    // objectInfoRef.parentNode.removeChild(objectInfoRef.parentNode.childNodes[2]);
                // }
			// }
            objectInfoRef.insertAdjacentHTML("afterend", `,&nbsp;<span title="${loc_data.name}"><b><font color=${loc_data.colr}>${getPlayerBool("ShowFullSectorNames") ? loc_data.name : loc_data.abbr}</font></b></span>`);
            if(!isEvenRow) {
                for(const cell of row.cells) {
                    cell.style.backgroundColor = "#f0ece3";
                }
            }
		}
        if(getPlayerBool("ShowWorkshiftTime") && location.pathname != "/mercenary_guild.php") {
            let objectShiftTimeSpan = objectInfoRef.parentElement.querySelector("span[name=objectShiftTimeSpan]");
            objectInfoRef.style.width = "fit-content";
            objectInfoRef.style.display = "inline-block";
            if(!objectShiftTimeSpan) {
                objectShiftTimeSpan = addElement('span', { name: "objectShiftTimeSpan", style: "font-size: 11px; cursor: pointer; display: inline-block;", innerHTML: objectShiftTimeFormat(objectId), title: isEn ? "Get workshift begin info" : "Получить информацию о начале смены" });
                objectShiftTimeSpan.addEventListener("click", async function(e) {
                    e.stopPropagation();
                    this.innerHTML = getWheelImage();
                    await refreshObjectData(objectId);
                    this.innerHTML = objectShiftTimeFormat(objectId);
                });
                objectInfoRef.insertAdjacentElement("afterend", objectShiftTimeSpan);
            } else {
                objectShiftTimeSpan.innerHTML = objectShiftTimeFormat(objectId);
            }
        }
		if(location.pathname == "/mercenary_guild.php") {
            objectInfoRef.insertAdjacentHTML("afterend", `&nbsp;<span><b>(&nbsp;<font color=${loc_data.colr}>${loc_data.name}</font>&nbsp;)</b></span>`); // add location only in Mercenary Guild page
		}
        if(location.pathname == "/ecostat_details.php" && getPlayerBool("HideObjectsNamesInStatistics")) {
            objectInfoRef.closest("td").querySelector("a").title = objectInfoRef.innerText;
            objectInfoRef.remove();
        }
		row_count++;
	}
    editTables();
}
function editTables() {
    if(location.pathname == "/map.php") {
        if(getPlayerBool("HideObjectOwner")) {
            // Очищаем столбец Владелец.
            const tables = [...document.querySelectorAll('div#map_right_block table')].filter(x => x.rows.length > 0);
            for(const table of tables) {
                const clanColumnIndex = [...table.rows[0].cells].findIndex(x => x.innerHTML.includes(isEn ? "Clan" : "Клан"));
                if(clanColumnIndex > -1) {
                    //console.log(clanColumnIndex);
                    [...table.rows].forEach(x => { if(x.cells[clanColumnIndex]) { x.cells[clanColumnIndex].style.display = "none"; }});
                    break;
                }
            }
        }
    }
    if(location.pathname == "/ecostat_details.php") {
        // Меняем "Может купить"
        const tables = [...document.querySelectorAll('table')].filter(x => x.rows.length > 0 && x.rows[0].cells.length > 1);
        const sellTable = tables.find(x => x.rows[0].cells[1].textContent.match(isEn ? "Demands" : 'Может купить'));
        if(sellTable) {
            sellTable.rows[0].cells[1].firstChild.textContent = isEn ? "Dem." : "Куп.";
            sellTable.rows[0].cells[0].width = "85%";
            [...sellTable.rows].filter(x => Number(x.cells[1].firstChild.textContent) > 0).forEach(x => {
                x.cells[1].style.fontWeight = "bold";
                x.cells[1].style.backgroundColor = "#CCFF99";
            });
            sortTable(sellTable, 1, 1, SortType.Number, x => -Number(x.innerHTML.replace(/&nbsp;/g, "")));
        }
        const buyTable = tables.find(x => x.rows[0].cells[1].textContent.match(isEn ? "Supplies" : 'Может продать'));
        if(buyTable) {
            buyTable.rows[0].cells[1].firstChild.textContent = isEn ? "Suppl." : "Ресурс";
            buyTable.rows[0].cells[0].width = "70%";
        }
    }
}
async function refreshObjectData(objectId) {
    let doc;
    if(objectId) {
        doc = await getRequest(`/object-info.php?id=${objectId}&rand=${Math.random() * 1000000}`);
    } else if(location.pathname == "/object-info.php") {
        objectId = getUrlParamValue(location.href, "id");
        doc = document;
    }
    if(!doc) {
        return;
    }
    const objectStats = JSON.parse(getValue(`ObjectStats${objectId}`, "{}"));

    const balanceTable = [...doc.querySelectorAll("td")].find(x => x.innerHTML == (isEn ? "Balance: " : "Баланс: "))?.closest("table");
    let balance = 0;
    //console.log(balanceTable)
    objectStats.destroyed = balanceTable ? "0" : "1";
    if(balanceTable) {
        const balanceValueBold = [...balanceTable.querySelectorAll("b")].find(x => (/[\d\,]+/).exec(x.innerText));
        balance = parseInt(balanceValueBold.innerText.replace(/,/g, ""));
    }
    objectStats.balance = balance;

    const workshiftEndsRegexp = new RegExp(`${isEn ? "Workshift ends at" : "Окончание смены"}: (\\d+):(\\d+)`);
    const workshiftEndsExec = workshiftEndsRegexp.exec(doc.body.innerHTML);
    let workshiftEndsMinutes;
    if(workshiftEndsExec) {
        workshiftEndsMinutes = parseInt(workshiftEndsExec[2]);
        objectStats.workshiftEndsMinutes = workshiftEndsMinutes;
    } else {
        delete objectStats.workshiftEndsMinutes;
    }
    console.log(`balance: ${balance}, workshiftEndsMinutes: ${workshiftEndsMinutes}`);

    setValue(`ObjectStats${objectId}`, JSON.stringify(objectStats));
}
function objectShiftTimeFormat(objectId) {
    let shiftTime = "[n/a]";
    const objectStats = JSON.parse(getValue(`ObjectStats${objectId}`, "{}"));
    if(objectStats.destroyed == "1") {
        return `&nbsp;<b title="${isEn ? "Object destroyed" : "Объект разрушен"}">&#9760</b>`
    }
    if(objectStats.hasOwnProperty("workshiftEndsMinutes")) {
        const curDate = new Date();
        const curHour = curDate.getHours();
        const curMin = curDate.getMinutes();

        let soon_work = objectStats.workshiftEndsMinutes - curMin; //скоро на работу
        soon_work = soon_work + (soon_work < 0 ? 60 : 0);
        let color = "black";
        const minBalance = 1000; //граница баланса для выделения цветом времени объёктов.
        if(soon_work < 11 && objectStats.balance > minBalance) {
            color = "#CC0000";
        }
        if(soon_work > 54 && objectStats.balance > minBalance) {
            color = "#400060";
        }
        let target_hr = curHour + (objectStats.workshiftEndsMinutes > curMin ? 0 : 1);
        target_hr = target_hr == 24 ? 0 : target_hr;
        shiftTime = `<font style="color:${color};">[${target_hr.toString().padStart(2, "0")}:${objectStats.workshiftEndsMinutes.toString().padStart(2, "0")}]</font>`;
    }
    return `&nbsp;<b>${shiftTime}</b>${balanceFormat(objectStats.balance)}`;
}
function balanceFormat(balance) {
    if(balance == undefined) {
        return "";
    }
    let style_color = "black";
    let balanceStr = "";
    if(balance > 500000) {
        style_color = '#00B000';
        balanceStr = Math.round(balance / 100000) / 10 + 'kk';
    } else if(balance > 30000) {
        style_color = '#0033FF';
        balanceStr = Math.round(balance / 1000) + 'k';
    } else if(balance > 999) {
        style_color = '#6633CC';
        balanceStr = Math.round(balance / 1000) + 'k';
    } else {
        style_color = '#666666';
        balanceStr = balance + 'з';
    }
    return `, <font style="color: ${style_color};">${balanceStr}</font>`;
}
async function refreshStatistics(e) {
    let objectsSelector;
    if(location.pathname == "/map.php") {
        objectsSelector = "div#map_right_block tr > td:first-child > a[href^='object-info.php']";
    }
    if(location.pathname == "/ecostat_details.php") {
        objectsSelector = "div#tableDiv tr > td:first-child > a:first-child";
    }
    if(location.pathname == "/mercenary_guild.php") {
        objectsSelector = "center > table a[href^='object-info.php'";
    }
    if(!objectsSelector) {
        return;
    }
    e.target.disabled = true;
    e.target.style.background = "gray";
    let counter = 1;
	const objectInfoRefs = document.querySelectorAll(objectsSelector);
    //console.log(objectInfoRefs);
	for(const objectInfoRef of objectInfoRefs) {
        e.target.innerHTML = counter;
        const row = objectInfoRef.closest("tr");
        const objectId = parseInt(getUrlParamValue(objectInfoRef.href, "id"));
        const objectShiftTimeSpan = row.querySelector("span[name=objectShiftTimeSpan]");
        if(objectShiftTimeSpan) {
            objectShiftTimeSpan.innerHTML = getWheelImage();// Это бесполезно, т.к. браузер покажет изменения страницы после окончания работы функции. Или полезно, не знаю.
        }
        await refreshObjectData(objectId);
        if(objectShiftTimeSpan) {
            objectShiftTimeSpan.innerHTML = objectShiftTimeFormat(objectId);
        }
        counter++;
    }
    e.target.disabled = false;
    e.target.style.removeProperty('background');
    e.target.innerHTML = "&#8635;";
}
function showScriptSettings() {
    if(showPupupPanel(GM_info.script.name)) {
        return;
    }
    const fieldsMap = [];
    const hwmEconomicStatisticsOptionsContent = addElement("div", { id: "hwmEconomicStatisticsOptionsContent" });
    hwmEconomicStatisticsOptionsContent.innerHTML = `<table>
        <tr>
            <td><label for=showWorkshiftTimeCheckbox>${isEn ? "Show workshift end time" : "Отображать время окончания смены"}: </label><input type=checkbox ${getPlayerBool("ShowWorkshiftTime") ? "checked" : ""} id=showWorkshiftTimeCheckbox>
            </td>
        </tr>
        <tr>
            <td><label for=hideObjectOwnerCheckbox>${isEn ? "Hide object owner in economical statistics" : "Скрыть владельца предприятия"}: </label><input type=checkbox ${getPlayerBool("HideObjectOwner") ? "checked" : ""} id=hideObjectOwnerCheckbox></td>
        </tr>
        <tr>
            <td><label for=ShowFullSectorNamesCheckbox>${isEn ? "Show full sector names" : "Отображать полные названия секторов"}: </label><input type=checkbox ${getPlayerBool("ShowFullSectorNames") ? "checked" : ""} id=ShowFullSectorNamesCheckbox></td>
        </tr>
        <tr>
            <td><label for=HideObjectsNamesInStatisticsCheckbox>${isEn ? "Hide objects names in statistics" : "Скрыть названия объектов в статистике"}: </label><input type=checkbox ${getPlayerBool("HideObjectsNamesInStatistics") ? "checked" : ""} id=HideObjectsNamesInStatisticsCheckbox></td>
        </tr>
        <tr>
            <td><label for=autoloadStatisticsDetailsCheckbox>${isEn ? "Autoload statistics details" : "Автозагрузка деталей статистики"}: </label><input type=checkbox ${getPlayerBool("autoloadStatisticsDetails") ? "checked" : ""} id=autoloadStatisticsDetailsCheckbox></td>
        </tr>
        <tr>
            <td><br><br><input type="submit" id="clearWorkshiftTimesInput" class="button-62" value="${isEn ? "Clear statistics" : "Очистить статистику"}"></td>
        </tr>
    </table>`;
	hwmEconomicStatisticsOptionsContent.querySelector("#showWorkshiftTimeCheckbox").addEventListener("change", function() { setPlayerValue("ShowWorkshiftTime", this.checked); });
	hwmEconomicStatisticsOptionsContent.querySelector("#hideObjectOwnerCheckbox").addEventListener("change", function() { setPlayerValue("HideObjectOwner", this.checked); });
	hwmEconomicStatisticsOptionsContent.querySelector("#ShowFullSectorNamesCheckbox").addEventListener("change", function() { setPlayerValue("ShowFullSectorNames", this.checked); });
    hwmEconomicStatisticsOptionsContent.querySelector("#HideObjectsNamesInStatisticsCheckbox").addEventListener("change", function() { setPlayerValue("HideObjectsNamesInStatistics", this.checked); });
    hwmEconomicStatisticsOptionsContent.querySelector("#autoloadStatisticsDetailsCheckbox").addEventListener("change", function() { setPlayerValue("autoloadStatisticsDetails", this.checked); });
	hwmEconomicStatisticsOptionsContent.querySelector("#clearWorkshiftTimesInput").addEventListener("click", function() {
        [...GM_listValues()].filter(x => x.startsWith("ObjectStats") && Number(x.replace("ObjectStats", "")) > 0).forEach(x => deleteValue(x));
    });
    fieldsMap.push([hwmEconomicStatisticsOptionsContent]);
    createPupupPanel(GM_info.script.name, getScriptReferenceHtml() + " " + getSendErrorMailReferenceHtml(), fieldsMap);
}
function getWheelImage() { return `<img border="0" align="absmiddle" height="11" src="${resourcesPath}/css/loading.gif">`; }
function sortTable(tableElement, columnIndex, startRowIndex = 1, sortType = SortType.Text, valueSelector = null) {
    Array.from(tableElement.rows).slice(startRowIndex).forEach(x => {
        x.sortValue = (sortType == SortType.Text ? (valueSelector ? valueSelector(x.cells[columnIndex]) : x.cells[columnIndex].innerHTML).toLowerCase() : (
        sortType == SortType.Number ? Number(valueSelector ? valueSelector(x.cells[columnIndex]) : x.cells[columnIndex].innerHTML.trim()) : 0));
        //console.log(`x.sortValue: ${x.sortValue}, x.cells[${columnIndex}].innerHTML: ${x.cells[columnIndex].innerHTML}`);
    });
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
function groupByToArray(list, keyFieldOrSelector) { return list.reduce(function(t, item) {
    const keyValue = typeof keyFieldOrSelector === 'function' ? keyFieldOrSelector(item) : item[keyFieldOrSelector];
    let cell = t.find(x => x.key == keyValue);
    if(!cell) {
        t.push({ key: keyValue, values: [item] });
    } else {
        cell.values.push(item);
    }
    return t;
}, []); };
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
function findSequentialTextContainsValue(node, value) {
    if(!node) {
        return;
    }
    let curNode = node;
    while(curNode = nextSequential(curNode)) {
        //console.log(`curNode.nodeName: ${curNode.nodeName}, curNode.textContent: ${curNode.textContent}`);
        if(curNode.nodeName == "#text" && curNode.textContent.includes(value)) {
            return curNode;
        }
    }
}
function findSiblingComment(node) {
    if(!node) {
        return;
    }
    let curNode = node;
    while(curNode = curNode.nextSibling) {
        //console.log(`curNode.nodeName: ${curNode.nodeName}, curNode.textContent: ${curNode.textContent}`);
        if(curNode.nodeName == "#comment") {
            return curNode;
        }
    }
}
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
        if(!config.once) {
            for(const target of targets) {
                if(target) {
                    observer.observe(target, config);
                }
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
