// ==UserScript==
// @name         Melvoridle Helper
// @namespace    https://github.com/lovedzc/
// @version      1.004
// @description  Auto loot, and auto eat food. For Melvor Idle 1.0
// @author       lovedzc
// @match        https://www.melvoridle.com/index_noads.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435898/Melvoridle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/435898/Melvoridle%20Helper.meta.js
// ==/UserScript==

// 自动捡拾所有
function AutoLoot()
{
    try {
        var text = document.getElementById("combat-loot-text").innerText;
        var a = text.indexOf("(");
        var b = text.indexOf("/");
        var num = text.substr(a+1, b-a-1);
        if (num > 0){
            document.getElementById("combat-btn-loot-all").click();
        }
    } catch (Exception) {
    }
}

// 自动吃食物
function AutoEatFood()
{
    try {
        var sHPCur = document.getElementById("combat-player-hitpoints-current").innerText;
        var sHPMax = document.getElementById("combat-player-hitpoints-max").innerText;
        var sFood = document.querySelector("#combat-food-container > div > button.btn.btn-outline-secondary.text-combat-smoke.font-size-sm > span:nth-child(3)").innerHTML;

        var HPCur = parseInt(sHPCur.split(",").join(""));
        var HPMax = parseInt(sHPMax.split(",").join(""));
        var Food = parseInt(sFood.split(",").join(""));

        if (HPCur / HPMax < 0.5) {
            while (HPMax - HPCur > Food) {
                document.getElementsByClassName("btn btn-outline-secondary text-combat-smoke font-size-sm")[0].click();
                HPCur = HPCur + Food;
            }
        }

    } catch (Exception) {
    }
}

function main() {
    AutoLoot();
    AutoEatFood();
}

function init() {
    window.setInterval(main, 2000);
}

init();
