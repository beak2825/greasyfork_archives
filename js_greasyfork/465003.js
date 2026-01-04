// ==UserScript==
// @name         home_page_helper
// @namespace    http://tampermonkey.net/
// @version      0.8.3
// @description  Открывает самую выгодную работу в секторе. Кнопка сброса статов не исчезает, + опция добавить 5 статов 1 кликом (можно спамить)
// @license     University of Ligma
// @author      Something begins
// @match       https://www.heroeswm.ru/*
// @match       https://my.lordswm.com/*
// @match       https://www.lordswm.com/*
// @exclude     /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465003/home_page_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/465003/home_page_helper.meta.js
// ==/UserScript==
if (!location.pathname.includes("home.php") && !document.querySelector("#hwm_topline_with_hint2")) {
    throw new Error("Sorry mate, wrong door");
}
let i;
const statAmount = 5;
const facility_types = ['sh', 'fc', 'mn']
const sector_coords_1 = {
    "Ungovernable Steppe": [48, 48],
    "Eagle Nest": [49, 48],
    "Peaceful Camp": [50, 48],
    "Crystal Garden": [51, 48],
    "Fairy Trees": [52, 48],
    "Mithril Coast": [53, 49],
    "Bear Mountain": [52, 49],
    "Rogues' Wood": [51, 49],
    "Tiger Lake": [50, 49],
    "Shining Spring": [49, 49],
    "Sunny City": [48, 49],
    "Sublime Arbor": [48, 50],
    "Green Wood": [49, 50],
    "Empire Capital": [50, 50],
    "East River": [51, 50],
    "Magma Mines": [52, 50],
    "Harbour City": [53, 50],
    "Lizard Lowland": [49, 51],
    "Wolf Dale": [50, 51],
    "Dragons' Caves": [51, 51],
    "The Wilderness": [49, 52],
    "Portal Ruins": [50, 52],
    "Great Wall": [51, 52],
    "Titans' Valley": [51, 53],
    "Fishing Village": [52, 53],
    "Kingdom Castle": [52, 54]
}
let isExecuting = false; // Tracks if the function is running
const queue = []; // Queue to store pending executions
const resetStatsHTML =
    `
<div id="script_reset_stats" class="home_reset_btn btn_hover show_hint" hint="Сбросить параметры" onclick="home_css_change_stat('reset', 1, this);return false;" hwm_hint_added="1">
  <img src="https://dcdn2.heroeswm.ru/i/pl_info/btn_reset.png" class="inv_100mwmh">
</div>
`;
//document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td").remove();
const parser = new DOMParser();
let send_get = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType('text/plain; charset=windows-1251');
    xhr.send(null);
    if (xhr.status == 200) return xhr.responseText;
    return null;
};
// get element from text
function getElementDepth(element) {
    if (!element.children || element.children.length === 0) {
        return 1;
    }
    let maxDepth = 0;
    for (let child of element.children) {
        let childDepth = getElementDepth(child);
        if (childDepth > maxDepth) {
            maxDepth = childDepth;
        }
    }
    return maxDepth + 1;
}

function getLeastLayered(elArr) {
    const eleMap = new Map();
    for (const ele of elArr) {
        eleMap.set(ele, getElementDepth(ele));
    }
    let minKey = null;
    let minValue = Infinity;
    for (let [key, value] of eleMap.entries()) {
        if (value < minValue) {
            minValue = value;
            minKey = key;
        }
    }
    return minKey
}

function findFromString(arg, eleType) {
    const allEles = document.querySelectorAll(eleType);
    let includeArr;
    if (typeof arg === "object") {
        includeArr = Array.from(allEles).filter(ele => {
            let othersInclude = true;
            for (const str of arg) {
                if (!ele.textContent.includes(str)) {
                    othersInclude = false;
                    break;
                }
            }
            return othersInclude;
        });
    } else {
        includeArr = Array.from(allEles).filter(ele => { return ele.textContent.includes(arg) });
    }

    return getLeastLayered(includeArr);
}

function processQueue() {
    if (isExecuting || queue.length === 0) return;

    isExecuting = true;
    const { containerIndex, i } = queue.shift(); // Dequeue the next execution
    clickStat(containerIndex, i);
}

function findAndGo() {
    let maxFacility;
    let maxValue = Number.NEGATIVE_INFINITY;
    let reponse_text = send_get(`${location.protocol}//${location.host}/map.php?`);
    let doc = parser.parseFromString(reponse_text, 'text/html');
    let cur_sector_1 = doc.querySelector("#set_mobile_max_width > div.global_container_block_header > b");
    if (cur_sector_1) cur_sector_1 = cur_sector_1.innerText;
    let cur_sector_cx = sector_coords_1[cur_sector_1][0];
    let cur_sector_cy = sector_coords_1[cur_sector_1][1];
    for (const f_type of facility_types) {
        let reponse_text = send_get(`${location.protocol}//${location.host}/map.php?cx=${cur_sector_cx}&cy=${cur_sector_cy}&st=${f_type}&action=get_objects&js_output=1&rand=616285.8014822785`);
        let doc = parser.parseFromString(reponse_text, 'text/html');
        let available_facilities = {};
        for (const el of doc.getElementsByClassName("map_obj_table_hover")) {
            if (el.classList.length > 1 || el.innerHTML.includes(`color="#E65054"`)) continue
            const facility_a = el.querySelector("td:nth-child(4) a")
            available_facilities[facility_a.href] = parseInt(facility_a.querySelector("b").innerText)

        }
        if (available_facilities.length === 0) continue;
        for (const facility in available_facilities) {
            if (available_facilities[facility] > maxValue) {
                maxFacility = facility;
                maxValue = available_facilities[facility];
            }
        }
        if (maxFacility === undefined) continue;
        // break;
    }
    if (maxFacility) location.href = maxFacility;
    else alert("Не найдено доступных предприятий");
}

function clickStat(containerIndex, i = 0) {
    if (i === statAmount) {
        isExecuting = false;
        processQueue(); // Process the next item in the queue
        return;
    }

    const root = Array.from(document.querySelectorAll(".inv_stat_data"))[containerIndex];
    const button = root.querySelector(".btn_hover2");
    if (!button) {
        queue = [];
        return;

    }
    const oldCount = root.querySelector(".home_stat_text").textContent;

    button.click();
    let newCount;
    const changesApplied = setInterval(() => {
        const root = Array.from(document.querySelectorAll(".inv_stat_data"))[containerIndex];
        newCount = root.querySelector(".home_stat_text").textContent;
        if (oldCount === newCount) return;

        clearInterval(changesApplied);
        clickStat(containerIndex, i + 1); // Continue the recursive function
    }, 10);
}


function insertPlus10() {
    const statDivs = Array.from(document.querySelectorAll(".inv_stat_data")).slice(0, 4);
    if (document.querySelector("div[containerIndex]") || !document.body.innerHTML.includes("Свободных очков")) return;
    for (const containerIndex in statDivs) {
        statDivs[containerIndex].insertAdjacentHTML("beforeend", `<div containerIndex=${containerIndex} class="home_button2 btn_hover2" style="display:inline-block; margin-top: 10px; width: 150%; font-size: 12">+${statAmount}</div>`);
    }
}

function insertStatButton() {
    const resetButton = document.querySelector(".home_reset_btn");
    if (resetButton) return;
    document.querySelector(".inventory_stats.home_stats").insertAdjacentHTML("afterBegin", resetStatsHTML);
}

function fixStatsButton() {
    const homeDiv = document.querySelector("#home_css_stats_wrap_div");
    if (!homeDiv) return;
    insertStatButton();
    insertPlus10();
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                insertStatButton();
                insertPlus10();
            }
        });
    });
    const config = { childList: true, subtree: true };
    observer.observe(homeDiv, config);
}
if (location.pathname.includes("home.php")) {
    fixStatsButton();
    let parent = findFromString("Вы нигде не работаете", "td");
    if (!parent) parent = findFromString("Вы нигде не работаете", "span");
    parent && parent.insertAdjacentHTML('beforeend', `<button id = "fast_work" style = "display: block; color:red;">Открыть работу</button>`)

}

document.addEventListener("click", event => {
    if (event.target.id === "fast_work" || (event.target.src && event.target.src.includes("icons_add/work.png")) || event.target.getAttribute("hwm_label") === "Вы нигде не работаете" ) {
        event.preventDefault();
        findAndGo();
    }
    if (!event.target.getAttribute("containerIndex")) return;
    const containerIndex = parseInt(event.target.getAttribute("containerIndex"));
    queue.push({ containerIndex, i: 0 });
    processQueue();
})