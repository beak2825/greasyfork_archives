// ==UserScript==
// @name         chain_calc
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Считает автоматом цепь на K (Л), расстояние на V (М), хп на H (Р)
// @author       Something begins
// @license     license to goon
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/477040/chain_calc.user.js
// @updateURL https://update.greasyfork.org/scripts/477040/chain_calc.meta.js
// ==/UserScript==
const gvInterval = setInterval(()=>{
    try{if (btype === 66 && finished) {
        clearInterval(gvInterval);
        //location.href = "https://www.heroeswm.ru/map.php?cx=50&cy=49";
    }}catch{}
}, 100);
const primary_color = "purple"
const secondary_color = "green"
let chat1 = document.querySelector("#chat_format")
chat1.insertAdjacentHTML("beforeend", `<div id = "chat_coords"></div> <div id = "hp_coords"></div>`)
let coords_div = document.querySelector("#chat_coords");
let firstTime = true
let calc_x, calc_y = null
/*const attachTo = document.querySelector("#left_button");
const ifLoadedInterval = setInterval(()=>{
    console.log(finished);
    if (Object.keys(unsafeWindow.stage.pole.obj).length === 0) return;
    clearInterval(ifLoadedInterval);
    if (finished) return;
    attachTo.insertAdjacentHTML("beforeEnd", `<button id = "start_end">START/END</button>`);
    document.querySelector("#start_end").addEventListener("click", event=>{
    event.preventDefault();
        location.href = location.href.includes("lt=-1&") ? location.href.replace("war.php?lt=-1&", "war.php?") : location.href.replace("war.php?", "war.php?lt=-1&");
    })
}, 100);*/
function paint_coords(x, y, color, timeout = 500) {
    let tile = shado[x + y * defxn]
    if (tile == undefined) return
    tile.stroke(color)
    tile.fill(color)
    set_visible(tile, 1)
    setTimeout(() => {
        tile.fill(null)
        tile.stroke(null)
        set_visible(tile, 0)
    }, 500)
}
let coordinates_list = []
let settings_interval = setInterval(() => {
    if (!stage) return;
    let temp = unsafeWindow.stage.pole.obj
    if (Object.keys(temp).length !== 0) {
        Object.values(unsafeWindow.stage.pole.obj).forEach(creature => {
            if (creature.hero || creature.rock) return
            coordinates_list.push({ x: creature.x, y: creature.y })
        })
        clearInterval(settings_interval)
    }
}, 300)

function findClosestCoordinate(chosenCoord) {
    let minI;
    let closestCoord = coordinates_list[0];
    minI = 0
    let minDist = getDistance(closestCoord, chosenCoord);
    if (minDist < 1) {
        closestCoord = coordinates_list[1];
        minDist = getDistance(coordinates_list[1], chosenCoord);
        minI = 1
    }
    let dist;
    for (let i = 0; i < coordinates_list.length; i++) {
        let temp = getDistance(coordinates_list[i], chosenCoord);
        if (temp < 1) continue
        dist = temp;
        coordinates_list[i].dist = dist
        if (dist <= minDist) {
            minDist = dist;
            closestCoord = coordinates_list[i];
            minI = i
        }
    }
    let alternatives = coordinates_list.filter(coordinate => coordinate.dist === minDist && !(coordinate.x === closestCoord.x && coordinate.y === closestCoord.y));

    for (const coord of alternatives) paint_coords(coord.x, coord.y, "red");
    coordinates_list.splice(minI, 1)
    paint_coords(closestCoord.x, closestCoord.y, "black")
    return { x: closestCoord.x, y: closestCoord.y, distance: minDist };
}

function getDistance(coord1, coord2) {
    let dx = coord1.x - coord2.x;
    let dy = coord1.y - coord2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

window.addEventListener("keyup", event => {
    if (!((document.querySelector("#chattext") !== document.activeElement) && (document.querySelector("#chattext_classic") !== document.activeElement))) return
    if (["k", "K", "л", "Л"].includes(event.key)) {
        let [x_last, y_last] = [xr_last, yr_last];
        coordinates_list = []
        Object.values(unsafeWindow.stage.pole.obj).forEach(creature => {
            if (creature.hero || creature.rock || (creature.x === x_last && creature.y === y_last) || [0, -1].includes(creature.nownumber)) return
            coordinates_list.push({ x: creature.x, y: creature.y })
        })
        paint_coords(x_last, y_last, "black")
        let i = 0
        setTimeout(() => {
            let conseq_chain = findClosestCoordinate({ x: x_last, y: y_last })
            let chain_interval = setInterval(() => {
                conseq_chain = findClosestCoordinate({ x: conseq_chain.x, y: conseq_chain.y })
                i++;
                if (i >= 2) clearInterval(chain_interval);
            }, 500)
            }, 500)
    }
    if (["v", "V", "м", "М"].includes(event.key)) {
        let [x_last, y_last] = [xr_last, yr_last];
        if (calc_x == null) {
            [calc_x, calc_y] = [x_last, y_last];
            if (firstTime) paint_coords(x_last, y_last, secondary_color)
            else paint_coords(x_last, y_last, primary_color)
        } else {
            coords_div = document.querySelector("#chat_coords")
            if ([...coords_div.children].length === 2) coords_div.innerHTML = ""
            let distance = getDistance({ x: x_last, y: y_last }, { x: calc_x, y: calc_y })
            let color;
            if ([...coords_div.children].length === 1) {
                color = primary_color
                firstTime = true
            } else {
                color = secondary_color
                firstTime = false
            }
            coords_div.insertAdjacentHTML("beforeend", `<span style = "color: #ffffff; font-size: 120%; background-color: ${color}">${distance.toFixed(2)}<br></span>`)
            paint_coords(x_last, y_last, color)
            calc_x = calc_y = null
        }
    }
    if (["H", "h", "р", "Р"].includes(event.key)) {
        let [x_last, y_last] = [xr_last, yr_last];
        const cre = unsafeWindow.stage.pole.obj[mapobj[x_last + defxn*y_last]];
        const creHP = (cre.nownumber - 1) * cre.maxhealth + cre.nowhealth;
        coords_div = document.querySelector("#hp_coords");
        coords_div.innerHTML = "";
        paint_coords(x_last, y_last, "red");
        coords_div.insertAdjacentHTML("beforeend", `<span><i>${cre.nametxt} [${cre.nownumber}]</i><br></span>`);
        coords_div.insertAdjacentHTML("beforeend", `<span style = "color: #ffffff; font-size: 120%; background-color: red">${creHP} хп<br></span>`);

    }
})