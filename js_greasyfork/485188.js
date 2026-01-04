// ==UserScript==
// @name           hwmTroopsReflector
// @namespace      Tamozhnya1
// @author         Tamozhnya1
// @description    Кнопка отражения войск по вертикали при расстановке
// @version        2.1
// @include        *heroeswm.ru/war.php*
// @include        *lordswm.com/war.php*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/485188/hwmTroopsReflector.user.js
// @updateURL https://update.greasyfork.org/scripts/485188/hwmTroopsReflector.meta.js
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
if(!playerIdMatch) {
    return;
}
const PlayerId = playerIdMatch[1];
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const win = window.wrappedJSObject || unsafeWindow;
let battleLoadedTimerId;
let battleStartedTimerId;

main();
function main() {
    battleLoadedTimerId = setInterval(waitForBattleLoad, 200);
}
function waitForBattleLoad() {
    if(win.stage[win.war_scr].setted_atb) {
        clearInterval(battleLoadedTimerId);
        console.log(`btype: ${win.btype}`);
        if(win.warlog == 0) {
            document.getElementById('right_button').insertAdjacentHTML("beforeend", `
        <div id="reflectDeploymentButton" class="toolbars_img">
            <img src="https://dcdn.heroeswm.ru/i/combat/btn_autoalignment.png?v=6" alt="${isEn ? "Reflect deployment vertical" : "Отразить расстановку по вертикали"}" title="${isEn ? "Reflect deployment vertical" : "Отразить расстановку по вертикали"}" style="filter: sepia(100%) hue-rotate(190deg) saturate(900%);">
        </div>`);
            document.getElementById("reflectDeploymentButton").addEventListener("click", reflectDeployment);
            battleStartedTimerId = setInterval(waitForBattleStart, 200);
            document.getElementById("confirm_ins_img").addEventListener("click", removeReflectDeploymentButton, true);
        }
    }
}
function waitForBattleStart() {
    if (win.lastturn > -1) {
        clearInterval(battleStartedTimerId);
        removeReflectDeploymentButton();
    }
}
function removeReflectDeploymentButton() {
    const reflectDeploymentButton = document.getElementById("reflectDeploymentButton");
    if(reflectDeploymentButton) {
        reflectDeploymentButton.remove();
    }
}
function reflectDeployment() {
    let yourside = win.yourside;
    if(win.btype == 119) {
        yourside = 1;
    }
    const playerIndexOnYourSide = Math.floor((win.playero - 1) / 2);
    const deploymentFieldWidthBegin = Math.floor(playerIndexOnYourSide * win.defyn / yourside + 1);
    const deploymentFieldWidthEnd = Math.floor((playerIndexOnYourSide + 1) * win.defyn / yourside);
    console.log(`playero: ${win.playero}, win.yourside: ${win.yourside}, yourside: ${yourside}, defxn: ${win.defxn}, defyn: ${win.defyn}, stackcount: ${win.stackcount}, camp_mirror: ${win.camp_mirror}, deploymentFieldWidthBegin: ${deploymentFieldWidthBegin}, deploymentFieldWidthEnd: ${deploymentFieldWidthEnd}`);
    const poleObj = win.stage[win.war_scr].obj; //console.log(poleObj);
    const playerUnits = Object.keys(poleObj).filter(k => !poleObj[k].hero && poleObj[k].owner == win.playero && !poleObj[k].building && !poleObj[k].ballista && poleObj[k].lname != "cannonani" && !poleObj[k].warmachine && poleObj[k].portal != 1).map(k => poleObj[k]);
    const deployment = playerUnits.map(u => [u.id, u.nownumber, u.x, deploymentFieldWidthBegin + deploymentFieldWidthEnd - u.y - u.big]); // big = 0 или 1, если большое существо
    //const deployment = playerUnits.map(x => [x.obj_index, x.nownumber, x.x, deploymentFieldWidthBegin + deploymentFieldWidthEnd - x.y - x.big]); // big = 0 или 1, если большое существо
    const insStr = deployment.map(x => x.join("#")).join("^") + "^"; console.log(insStr);
    const pole = win.stage[win.war_scr]; //stage[war_scr].obj  Object.keys(stage[war_scr].obj).map(x => { let u = stage[war_scr].obj[x]; return `${u.id} ${u.nametxt} ${u.side} ${u.owner} x/y/big/n/building:${u.x}/${u.y}/${u.big}/${u.nownumber}/${u.building}`; })
    pole.useinsertion_cre(insStr); // Расстановка по данным из текстовой строки
}
