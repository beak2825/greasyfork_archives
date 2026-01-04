// ==UserScript==
// @name         itch to tw for auto inventory
// @namespace    itchToTheTwforAutoInventory
// @version      0.1
// @license		 MIT
// @description  'itch to tw for auto inventory' automatically hits claim on an inventory website 'itch to the tw' in the background in all languages
// @author       DayXP
// @match        https://www.twitch.tv/drops/inventory*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474965/itch%20to%20tw%20for%20auto%20inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/474965/itch%20to%20tw%20for%20auto%20inventory.meta.js
// ==/UserScript==

const refminutes = 5; //refresh the inventory page every x minutes. default = 5
const refseconds = 10; //try to hit claim after the refreshed page in x seconds. default = 10. choose 30-45 for slow computers, avoid go lower than 5.
let buttonText = ['claim now', 'jetzt abholen', 'reclamar ahora', 'en profiter', 'riscuoti subito', 'kiváltás most!', 'claim nu', 'hent nå', 'odbierz teraz',
                  'resgatar agora', 'solicită acum', 'vyzdvihnúť teraz', 'lunasta nyt', 'hämta nu', 'nhận ngay', 'Şimdi Al', 'vyzvednout kořist', 'Διεκδίκηση τώρα',
                  'Взимане сега', 'Получить сейчас', 'เคลมตอนนี้', '现在领取', '立即領取', '今すぐ入手', '지금 받기'];

const IdleTimer = setTimeout(function(){
    let items = document.querySelectorAll("[class*='ScCoreButton']");
    items.forEach((item) => {
        buttonText.forEach((searchText) => {
            if (item.innerText.toLowerCase().includes(searchText.toLowerCase())) {
                if (item != null) { item.click(); };
            }
        });
    });
    items = null;
    clearTimeout(IdleTimer);
}, refseconds*1000);
setInterval(function() {
    window.location.reload();
}, refminutes*60250);
