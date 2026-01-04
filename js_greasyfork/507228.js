// ==UserScript==
// @name        [GC] Trading Post QoL
// @namespace   Masterofdarkness and hanso
// @match       https://www.grundos.cafe/island/tradingpost/*
// @match       https://grundos.cafe/island/tradingpost/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant       GM_setValue
// @license     MIT
// @version     1.3
// @author      Masterofdarkness and hanso
// @description Adds links to the static lot numbers, show how many active lots you have, move autosale items to the top and change the color of the lot
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/507228/%5BGC%5D%20Trading%20Post%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/507228/%5BGC%5D%20Trading%20Post%20QoL.meta.js
// ==/UserScript==

//Activate routine only if on your trade page
if(window.location.href == 'https://www.grundos.cafe/island/tradingpost/') {
    //Move AutoSale items to the top and change color to trade lot blue
    const container = document.querySelector('.trading_post');
    let tradeLots = Array.from(container.querySelectorAll('.trade-lot'));
    const hrBars = Array.from(container.querySelectorAll('hr'));
    const pattern = /^[0-9,]+ NP$/;

    let createLot = Array.from(container.querySelectorAll('.flex-column.big-gap'));
    let createLotButtonText = createLot[createLot.length - 1];

    tradeLots = tradeLots.map(tradeLot => { return { div : tradeLot, hrBar: tradeLot.nextElementSibling.tagName === 'HR' ? tradeLot.nextElementSibling : null }});
    tradeLots.sort((a, b) => {
        const spanA = a.div.querySelector('span[id^="quicksale-text-"]');
        const spanB = b.div.querySelector('span[id^="quicksale-text-"]');

        const matchesA = spanA && pattern.test(spanA.textContent.trim());
        const matchesB = spanB && pattern.test(spanB.textContent.trim());

        return (matchesB ? 1 : 0) - (matchesA ? 1 : 0);
    });

    tradeLots.forEach(tradeLot => {
        if(!tradeLot.div.innerHTML.includes(`<em class="gray">None</em>`)) {
            tradeLot.div.style.backgroundColor = '#b0bcec';
        }
        container.appendChild(tradeLot.div);
        if (tradeLot.hrBar) {
            container.appendChild(tradeLot.hrBar);
        }

    });

    container.appendChild(createLotButtonText);
}

//Make static Lot#s clickable links
document.querySelectorAll('div.flex-column.small-gap span > strong, div.flex.space-between > strong').forEach(strong => {const m = strong.innerHTML.match(/Lot #(\d+)/);if(m)strong.innerHTML = `<a href="https://www.grundos.cafe/island/tradingpost/lot/${m[1]}">Lot #${m[1]}</a>`});

//Get Number of active lots
let i = 0;
document.querySelectorAll('div.trade-lot.flex-column.big-gap').forEach(trade => {i++});

//Print value of active lots out of 20
let elements = document.querySelector('strong.center.bigfont')
elements.textContent += ` (${i}/20)`;


