// ==UserScript==
// @name         Open best work
// @namespace    nexterot
// @homepage     https://greasyfork.org/ru/scripts/488416-open-best-work
// @version      1.0.0
// @description  Открывает самую выгодную работу в секторе. Кнопка на домашней странице в информации о работе
// @license     none
// @author      Something begins
// @match       https://www.heroeswm.ru/home*
// @match       https://my.lordswm.com/home*
// @match       https://www.lordswm.com/home*
// @exclude     /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488416/Open%20best%20work.user.js
// @updateURL https://update.greasyfork.org/scripts/488416/Open%20best%20work.meta.js
// ==/UserScript==
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
    "Fishing Village": [52, 52],
    "Kingdom Castle": [52, 54]
}
let send_get = function(url)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType('text/plain; charset=windows-1251');
    xhr.send(null);
    if(xhr.status == 200) return xhr.responseText;
    return null;
};
const parser = new DOMParser();

let parent = document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(1)")
if (parent){
     if (parent.innerText.includes("нигде не работаете")) parent.insertAdjacentHTML('beforeend', `<button id = "fast_work" style = "display: block;">Открыть работу</button>`)
}
else{
    parent = document.querySelector("#set_mobile_max_width > div.home_column.home_left_landscape_mobile.home_main_pers_block > div.home_container_block.home_work_block > div.home_inside_margins.global_a_hover")
    if (parent.innerText.includes("нигде не работаете")) parent.insertAdjacentHTML('beforeend', `<input type="image" id="fast_work" src="https://dcdn.heroeswm.ru/i/mobile_view/icons_add/work.png" style="display:block; float:right; border: 0.1rem solid; width:40px; border-radius:33% "\>`)
}
let button = document.querySelector("#fast_work")
button && button.addEventListener("click", ()=>{
    let maxFacility;
    let reponse_text = send_get(`${location.protocol}//${location.host}/map.php?`)
    let doc = parser.parseFromString(reponse_text, 'text/html');
    let cur_sector_1 = doc.querySelector("#set_mobile_max_width > div.global_container_block_header > b")
    if (cur_sector_1) cur_sector_1 = cur_sector_1.innerText
    let cur_sector_cx = sector_coords_1[cur_sector_1][0];
    let cur_sector_cy = sector_coords_1[cur_sector_1][1];
    let res;
    for (const f_type of facility_types) {
        let reponse_text = send_get(`${location.protocol}//${location.host}/map.php?cx=${cur_sector_cx}&cy=${cur_sector_cy}&st=${f_type}&action=get_objects&js_output=1&rand=616285.8014822785`)
        let doc = parser.parseFromString(reponse_text, 'text/html');
        let available_facilities = {}
        for (const el of doc.getElementsByClassName("map_obj_table_hover")) {
            if (el.classList.length > 1 || el.innerHTML.includes(`color="#E65054"`)) continue
            const facility_a = el.querySelector("td:nth-child(4) a")
            available_facilities[facility_a.href] = parseInt(facility_a.querySelector("b").innerText)

        }
        if (available_facilities.length === 0) continue
        console.log(f_type)
        console.log(available_facilities)
        let maxValue = Number.NEGATIVE_INFINITY;
        for (const facility in available_facilities) {
            if (available_facilities[facility] > maxValue) {
                maxFacility = facility;
                maxValue = available_facilities[facility];
            }
        }
        if (maxFacility === undefined) continue
        break
    }
    if (maxFacility) location.href = maxFacility;
    else alert("Не найдено доступных предприятий")
})