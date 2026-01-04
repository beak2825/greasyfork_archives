// ==UserScript==
// @name         Flight Rising Baldwin
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically transmutes items from your list.
// @author       Triggernometry
// @match        https://www1.flightrising.com/trading/baldwin/transmute*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456799/Flight%20Rising%20Baldwin.user.js
// @updateURL https://update.greasyfork.org/scripts/456799/Flight%20Rising%20Baldwin.meta.js
// ==/UserScript==

// wait until page load, then run main
$(document).ready(main);

// Categories are food, mats, app, fam, other

var transmuteItems = {
    "food"      : [],
    "mats"      : [],
    "app"       : [],
    "fam"       : [],
    "other"     : []
};

// set this to true to automatically melt down all food items with a point value of 2.
// the script will check the list if it doesn't find any 2-value food items, so you can still fill out the list if you use this option.
var autoMeltFood = false;

// these are used across all/most functions
var toggleState = GM_getValue('toggleState', false);
var toggleDisplay = ["OFF (click to toggle)",
                     "ON (click to toggle)"];

function buildGUI() {
    console.log("toggleDisplay:", toggleDisplay);
    // set up GUI box
    $('body').prepend("<div id=\"familiarbox\">" +
                      "    <div style=\"text-align: center; color: #e8cc9f; font: bold 7.8pt/30px tahoma; background: #731d08; margin: -10px -10px 10px;\">Auto Brewing</div>" +
                      // set toggle display to whatever it was before new page was loaded (or off, if page has never beeen loaded this session)
                      "    <button id=\"onOffDisplay\">" + toggleDisplay[toggleState ? 1 : 0] + "</button>" +
                      "</div>" +
                      "<style>" +
                      "    #familiarbox label {" +
                      "        float: inherit;" +
                      "    }" +
                      "    #familiarbox {" +
                      "        padding: 10px;" +
                      "        border: 1px solid #000;" +
                      "        position: fixed;" +
                      "        top: 0;" +
                      "        left: 0;" +
                      "        background: #fff;" +
                      "        z-index: 1002;" +
                      "    }" +
                      "    #turnOff," +
                      "    #turnOn {" +
                      "        border: 0;" +
                      "        background-color: #dcd6c8;" +
                      "        padding: 5px 10px;" +
                      "        color: #731d08;" +
                      "        margin: auto;" +
                      "        box-shadow: 0 1px 3px #999;" +
                      "        border-radius: 5px;" +
                      "        text-shadow: 0 1px 1px #FFF;" +
                      "        border-bottom: 1px solid #222;" +
                      "        cursor: pointer;" +
                      "        display: block;" +
                      "        font: bold 11px arial;" +
                      "        transition: 0.1s;" +
                      "    }" +
                      "    #onOffDisplay {" +
                      "        border: 0;" +
                      "        background-color: #dcd6c8;" +
                      "        padding: 5px 10px;" +
                      "        color: #731d08;" +
                      "        margin: auto;" +
                      "        box-shadow: 0 1px 3px #999;" +
                      "        border-radius: 5px;" +
                      "        text-shadow: 0 1px 1px #FFF;" +
                      "        border-bottom: 1px solid #222;" +
                      "        cursor: pointer;" +
                      "        display: block;" +
                      "        font: bold 11px arial;" +
                      "        transition: 0.1s;" +
                      "    }" +
                      "    #turnOff:hover," +
                      "    #turnOn:hover {" +
                      "        background-color: #bfb9ac;" +
                      "        color: #731d08;" +
                      "    }" +
                      "</style>"
                     );

    // set the toggle click behavior
    $('#onOffDisplay').click(function(){
        toggleState = !toggleState;
        GM_setValue('toggleState', toggleState);

        if(toggleState) {
            $('#onOffDisplay').html(toggleDisplay[1]);
        }
        else {
            $('#onOffDisplay').html(toggleDisplay[0]);
        }
    });
}

async function getFood(maxPoints) {
    // switch to food category tab, if not already selected
    while(document.querySelector('#swaptabs > a[data-tab-id="food"]').className != 'generic-hoard-tab generic-hoard-tab-selected') {
        console.log("Swapping to food tab");
        let chooseCategory = document.querySelector('#swaptabs > a[data-tab-id="food"]').click();
        await sleep(2000);
    }

    // get all items in category
    let itemList = document.querySelectorAll('#itempage > span > a');

    // compare to own list of allowed items
    for (const node of itemList) {
        // get tooltip name
        var tooltipID = node.getAttribute('rel');
        // get first matching tooltip. this might fail if similar tooltips exist, like #17 and #177? need to test
        var tooltip = document.querySelectorAll(`${tooltipID} .foodval > strong`)[0];
        //console.log("Tooltip", tooltipID, "Foodval", tooltip.firstChild.data);
        var foodPoints = Number(tooltip.firstChild.data);

        if(foodPoints <= maxPoints ) {
            // if allowed item found, set and break loop
            console.log("Found food:", node);
            return node;
        }
    }

    //if reached end of loop without returning, no valid food found
    return null;
}

async function getMatchingTransmutable() {
    for (const key of Object.keys(transmuteItems)) {
        let valueList = transmuteItems[key];
        console.log("key:", key);
        // switch to category tab
        let chooseCategory = document.querySelector(`#swaptabs > a[data-tab-id="${key}"]`).click();
        await sleep(2000);

        // get all items in category
        let itemList = document.querySelectorAll('#itempage > span > a');

        // compare to own list of allowed items
        for (const node of itemList) {
            if(valueList.includes(node.getAttribute('data-name'))) {
                // if allowed item found, return and break loops
                return node;
            }
        }
    }

    //if reached end of loop without returning, no item found
    return null;
}

async function collectItem(){
    await sleep(2000);
    let collectDoneItem = document.querySelector('input[value="Collect!"]').click();
    // wait for page to load after click
    // await collectDoneItem.DOMContentLoaded();
    await sleep(2000);
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
    let clickTransmuteButton = document.querySelector('#baldwin-transmute-btn');
    console.log("Click return object:", clickTransmuteButton);

    // wait for item load
    // if Transmute button is clicked multiple times, page breaks
    while(!document.querySelector('#ui-id-1'))
    {
        await sleep(2000);
        clickTransmuteButton.click();
        await sleep(2000);
    }

    var transmuteSelection;

    if (autoMeltFood) {
        transmuteSelection = await getFood(2);
    }

    if (!transmuteSelection) {
        transmuteSelection = await getMatchingTransmutable();
    }

    // if not null, item found
    if(transmuteSelection) {
        console.log("Selected food:", transmuteSelection);

        transmuteSelection.click();
        await sleep(1000);
        let transmuteStart = document.querySelector('#attch').click();
        await sleep(2000);
        let transmuteConfirm = document.querySelector('#transmute-confirm-ok').click();
    }
    // otherwise, reached end of items without findin a match. Exit.
    else {
        console.log("Reached end without finding a match. Nothing to brew.");
        return 0;
    }
}

function sleep(ms) {
    console.log(`Sleebs ${ms} ms!`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

function main(){
    buildGUI();

    // only if on
    if (toggleState == true){
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
}