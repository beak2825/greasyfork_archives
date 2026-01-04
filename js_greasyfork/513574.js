// ==UserScript==
// @name         ScrapTF raffle autoentering
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Go to "https://scrap.tf/raffles/ending" to automatically enter raffles. Works slow to ensure it enters as many raffles successfully as possible. Will probably require refreshing raffles page couple times.
// @author       Nape
// @match        https://scrap.tf/raffles/*
// @exclude      https://scrap.tf/raffles/puzzle
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513574/ScrapTF%20raffle%20autoentering.user.js
// @updateURL https://update.greasyfork.org/scripts/513574/ScrapTF%20raffle%20autoentering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let raffle_i = 0;
    function openRaffle(raffles){
        while (raffle_i < raffles.length) {
            const raffle_link = raffles[raffle_i].getElementsByTagName("a")[0].href;
            setTimeout(() => {GM_openInTab(raffle_link, true);}, raffle_i*10000);
            ++raffle_i;
        }
    }

    async function scrollDown(){
        let y = 800;
        while (document.getElementsByClassName("raffle-pagination-done")[0].style.display != "") {
            y = Math.min(y+600, document.body.scrollHeight);
            window.scrollTo(0,y);
            await new Promise(r => setTimeout(r, 200));
        }
        window.scrollTo(0,0);
        const not_entered_raffles = Array.from(document.getElementsByClassName("panel-raffle"))
                .filter(element => !element.classList.contains('raffle-entered'));
        openRaffle(not_entered_raffles);
    }

    window.addEventListener("load", () => {
        if (window.location == "https://scrap.tf/raffles/ending"){
            scrollDown();
        } else if (window.location != "https://scrap.tf/raffles") {
            setTimeout(() => {
                const enter_raffle_btn = document.querySelectorAll('.enter-raffle-btns > button:last-child')[0];
                if (enter_raffle_btn && enter_raffle_btn.innerText != ' Leave Raffle') {
                    enter_raffle_btn.click();
                    setTimeout(window.close, 5000);
                }
            }, 2000);
        }
    });
})();