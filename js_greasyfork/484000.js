// ==UserScript==
// @name         hero attack
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  fuck off
// @author       пророк санбой
// @license      None
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/484000/hero%20attack.user.js
// @updateURL https://update.greasyfork.org/scripts/484000/hero%20attack.meta.js
// ==/UserScript==
let heroInterval;
let isOn = false;

function heroAttack(tileX, tileY, activeobj) {
    const id = typeof unsafeWindow.pl_id === "undefined" ? unsafeWindow.plid1 : unsafeWindow.pl_id;
    const command = `battle.php?warid=${warid}&move=1&pl_id=${id}&attack=1&my_monster=${activeobj}&x=0&y=2&ax=${tileX}&ay=${tileY}&lastturn=${lastturn}&lastmess=${lastmess}&lastmess2=${lastmess2}&magicp=0&rand=${mathrandom()}`;
    console.log(command);
    loadmy(command);
}


function main() {
    const enemies = Object.values(stage.pole.obj).filter(cre => { return cre.side === -1 && cre.nownumber > 0 && !cre.hero });
    console.log("activeobj", activeobj);
    if (activeobj && stage.pole.obj[activeobj].hero && stage.pole.obj[activeobj].side === 1) {
        const firstEnemy = enemies[0];
        heroAttack(firstEnemy.x, firstEnemy.y, activeobj);
    }
}
let settings_interval = setInterval(() => {
    if (Object.keys(unsafeWindow.stage.pole.obj).length !== 0) {
        clearInterval(settings_interval);
        document.querySelector("#left_button").insertAdjacentHTML("beforeend", `<button id = "hero_attack"> Авто герой вкл/выкл </button>`);
        document.querySelector("#hero_attack").addEventListener("click", event => {
            event.preventDefault();
            if (isOn) clearInterval(heroInterval);
            else heroInterval = setInterval(main, 1000);
            isOn = !isOn;
        })
    }
}, 300)