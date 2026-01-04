// ==UserScript==
// @name         HP_battle_stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Пишет в консоль статистику хп армии. Дробь = хп сейчас/хп в начале боя, процент = выбитый процент предприятия в клановых ПВП боях. Цифра в скобках = сколько хп осталось до неслома (клановые ПВП бои)
// @author       Something begins
// @license      none
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/478343/HP_battle_stats.user.js
// @updateURL https://update.greasyfork.org/scripts/478343/HP_battle_stats.meta.js
// ==/UserScript==

let timer = 0;
unsafeWindow.bs = "";
function calcCreHP(creObjIndex){
    const cre = stage.pole.obj[creObjIndex];
    const fullHealth = (cre.nownumber - 1) * cre.maxhealth;
}
function main(){
    if (!stage) return;
    if (Object.values(stage.pole.obj).length === 0) return;
    let consoleString ="";

    for (const side of [1, -1]){
        const lordsList = Object.values(stage.pole.obj).filter(cre => {return (cre.hero && cre.side === side)});
        consoleString += side === 1 ? "LEFT ": "RIGHT "
/*         consoleString+=`Герои: `;

        for(const lord of lordsList){
            consoleString += lord.nametxt + "," ;
        } */

        let allHP = 0;
        let maxHP = 0;
        // current situation
        for (const cre of Object.values(stage.pole.obj)){
            if (cre.hero || [0, -1].includes(cre.nownumber) || cre.nametxt === "" || cre.side !== side || cre.summoned2 || cre.summonedc) continue;
            // console.log(cre.obj_index, cre.nametxt, cre.nownumber, cre);
            const creHP = (cre.nownumber - 1) * cre.maxhealth + cre.nowhealth;
            // console.log(cre.nametxt, creHP);
            allHP += creHP;
        }
        // battle start situation
        for (const cre of Object.values(stage.pole.obj)){
            if (cre.hero || [-1].includes(cre.nownumber) || cre.nametxt === "" || cre.side !== side || cre.summoned2 || cre.summonedc) continue;
            // console.log(cre.obj_index, cre.nametxt, cre.maxnumber, cre);

            const creMaxHP = cre.maxnumber * cre.realhealth;
            // console.log(cre.nametxt, creHP);
            maxHP += creMaxHP;
        }
        const untilNotWorn = 27/45 * maxHP - allHP;
        const prefix = untilNotWorn > 0 ? "+" : "";
        consoleString += ` | ${allHP} / ${maxHP} |`;
        consoleString +=` | ${(allHP/maxHP * 45).toFixed(2)}% (${prefix}${untilNotWorn.toFixed(2)}) | `;
    }
    unsafeWindow.bs = consoleString;
    timer++;
    if (timer%5 === 0) console.log(unsafeWindow.bs);
    return unsafeWindow.bs;
};

setInterval(main, 1000);

