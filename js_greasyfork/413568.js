// ==UserScript==
// @name         Flight Rising Baldwin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically transmutes items from your list
// @author       Gnorbu
// @match        https://www1.flightrising.com/trading/baldwin/transmute*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413568/Flight%20Rising%20Baldwin.user.js
// @updateURL https://update.greasyfork.org/scripts/413568/Flight%20Rising%20Baldwin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    getState();
})();

// Categories are food, mats, app, fam, battle, skins, specialty, other

let transmuteItems = [['food','Albino Dasher'],
                     ['food','Common Sparrow'],
                     ['food','Red Squirrel'],
                     ['mats','Sand'],
                     ['other','Broken Clay Pot']
                    ];

let randomIndex = Math.floor(Math.random() * transmuteItems.length);
let transmuteItem = transmuteItems[randomIndex];

function getState(){

    let idle = document.querySelector('#plus-button-container');
    let brewing = document.querySelector('.baldwin-cauldron-brewing');
    let done = document.querySelector('.baldwin-cauldron-done');

    if(done){
        collectItem();
    } else if (brewing){
        brewingWait();
    } else if(idle){
        transmute();
    }
}

async function collectItem(){
    let collectDoneItem = document.querySelector('input[value="Collect!"]').click();
    await sleep(1000);
    location.reload();
}

async function brewingWait(){
    let brewingTime = document.querySelector('#baldwin-timer-value').getAttribute('data-seconds-left');
    brewingTime = parseInt(brewingTime) + 3;
    console.log(`Now waiting for ${brewingTime} seconds. Please Stand by.`)
    await sleep(brewingTime * 1000);
    location.reload();
}

async function transmute(){
    let clickTransmuteButton = document.querySelector('#plus-button').click();
    await sleep(2000);
    console.log(`${transmuteItem[0]} : ${transmuteItem[1]}`)
    let chooseCategory = document.querySelector(`#swaptabs > a[data-tab-id="${transmuteItem[0]}"]`).click();
    await sleep(2000);
    let itemList = document.querySelectorAll('#itempage > span > a');
    let transmuteSelection;

    itemList.forEach((node) => {
        if(node.getAttribute('data-name') == transmuteItem[1]){
            transmuteSelection = node;
        }
    })

    transmuteSelection.click();
    await sleep(1000);
    let transmuteStart = document.querySelector('#attch').click();
    await sleep(2000);
    let transmuteConfirm = document.querySelector('#transmute-confirm-ok').click();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}