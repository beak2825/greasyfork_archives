// ==UserScript==
// @name           Autobattle
// @author         daks64
// @description    Кнопка активации автобоя сразу после расстановки
// @version        1.21
// @include        *heroeswm.ru/war.php*
// @include        *lordswm.com/war.php*
// @icon           https://i.ibb.co/F4YkLPC6/pig.png
// @namespace https://greasyfork.org/users/1134791
// @downloadURL https://update.greasyfork.org/scripts/545993/Autobattle.user.js
// @updateURL https://update.greasyfork.org/scripts/545993/Autobattle.meta.js
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

console.log("test", win);

main();


function main() {
    battleLoadedTimerId = setInterval(waitForBattleLoad, 200);
}

function waitForBattleLoad() {
    if(win.stage[win.war_scr].setted_atb) {
        clearInterval(battleLoadedTimerId);
        console.log(`btype: ${win.btype}`);
        if ((win.warlog == 0) && ((win.stimer != 18000))) {
            document.getElementById('left_button').insertAdjacentHTML("beforeend", `
        <div id="reflectDeploymentButton" class="toolbars_img">
            <img width="20%" height="20%" align="left" src="https://i.ibb.co/F4YkLPC6/pig.png" alt="${isEn ? "Reflect deployment vertical" : "Автобой"}" title="${isEn ? "Reflect deployment vertical" : "Автобой"}">
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
/*function removeReflectDeploymentButton() {
    const reflectDeploymentButton = document.getElementById("reflectDeploymentButton");
    if(reflectDeploymentButton) {
        reflectDeploymentButton.remove();
    }
}*/

function reflectDeployment() {
    fastbut_onRelease2();
}
