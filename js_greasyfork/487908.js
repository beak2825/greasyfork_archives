// ==UserScript==
// @name         DelugeRPG Basic Pokedex Achievement Script X TS Farmer
// @license MIT
// @namespace    https://greasyfork.org/en/users/1260021
// @version      2.0
// @description  PokeDex Filler x TS Farmer
// @author       Calcite
// @match        *.delugerpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487908/DelugeRPG%20Basic%20Pokedex%20Achievement%20Script%20X%20TS%20Farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/487908/DelugeRPG%20Basic%20Pokedex%20Achievement%20Script%20X%20TS%20Farmer.meta.js
// ==/UserScript==

/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
//𝗧𝗵𝗶𝘀 𝘀𝗰𝗿𝗶𝗽𝘁 𝘂𝘀𝗲𝘀 𝗔 𝗟𝗢𝗧 𝗼𝗳 𝗠𝗮𝘀𝘁𝗲𝗿 𝗕𝗮𝗹𝗹. 𝗣𝗹𝗲𝗮𝘀𝗲 𝗥𝗲𝗽𝗹𝗲𝗻𝗶𝘀𝗵 𝘆𝗼𝘂𝗿 𝘀𝘁𝗮𝗰𝗸 𝗼𝗳 𝗶𝘁 𝗺𝗼𝗿𝗲 𝗼𝗳𝘁𝗲𝗻 𝘁𝗵𝗮𝗻 𝗻𝗼𝗿𝗺𝗮𝗹.//
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/
/****************𝗖𝗔𝗨𝗧𝗜𝗢𝗡****************/



/**********ON/OFF SETTINGS**********/
var autoWalkFind = true; // enable walking+finding without you doing work
var clickSimulationActive = false; // flag to control click simulation
var groupACount = 0; // Counter for group A arrow key simulation
var groupAMove = 38; // Variable to store the current move for group A

var scanFreq = 250;
var isDoneLoadingFreq = 750;



function fireKey(el, key) {
    var eventObj;
    // Set key to corresponding code.
    // 37 = left, 38 = up, 39 = right, 40 = down;
    if (document.createEventObject) {
        eventObj = document.createEventObject();
        eventObj.keyCode = key;
        el.fireEvent("onkeydown", eventObj);
    } else if (document.createEvent) {
        eventObj = document.createEvent("Events");
        eventObj.initEvent("keydown", true, true);
        eventObj.which = key;
        el.dispatchEvent(eventObj);
    }
}

//𝗜𝗙 𝗬𝗢𝗨 𝗪𝗔𝗡𝗧 𝗧𝗢 𝗗𝗢 𝗣𝗢𝗞𝗘𝗗𝗘𝗫 𝗪𝗛𝗜𝗟𝗘 𝗙𝗔𝗥𝗠𝗜𝗡𝗚 𝗙𝗢𝗥 𝗣𝗢𝗧𝗘𝗡𝗧𝗜𝗔𝗟 𝗧𝗥𝗜𝗣𝗟𝗘 𝗦𝗧𝗔𝗧𝗦, 𝗬𝗢𝗨 𝗖𝗔𝗡 𝗖𝗛𝗔𝗡𝗚𝗘 𝗧𝗛𝗘 𝗩𝗔𝗥𝗜𝗔𝗕𝗟𝗘 𝗜𝗡 𝘀𝗲𝘁𝗜𝗻𝘁𝗲𝗿𝘃𝗮𝗹 𝗥𝗜𝗚𝗛𝗧 𝗕𝗘𝗟𝗢𝗪 𝗧𝗛𝗜𝗦 𝗖𝗢𝗠𝗠𝗘𝗡𝗧 𝗪𝗜𝗧𝗛 𝗧𝗛𝗜𝗦 ↓↓↓↓
//var elements = document.querySelectorAll('img[src="https://i.dstatic.com/images/pokeball-n.png"][alt="N"][title="You don\'t have this pokemon in your box."], img[src="https://i.dstatic.com/images/pokeball-y.png"][alt="Y"][title="You already have one of these in your box."]');
//if (elements !== null) {
//𝗜𝗙 𝗬𝗢𝗨 𝗪𝗔𝗡𝗧 𝗧𝗢 𝗗𝗢 𝗣𝗢𝗞𝗘𝗗𝗘𝗫 𝗪𝗛𝗜𝗟𝗘 𝗙𝗔𝗥𝗠𝗜𝗡𝗚 𝗙𝗢𝗥 𝗣𝗢𝗧𝗘𝗡𝗧𝗜𝗔𝗟 𝗧𝗥𝗜𝗣𝗟𝗘 𝗦𝗧𝗔𝗧𝗦, 𝗬𝗢𝗨 𝗖𝗔𝗡 𝗖𝗛𝗔𝗡𝗚𝗘 𝗧𝗛𝗘 𝗩𝗔𝗥𝗜𝗔𝗕𝗟𝗘 𝗜𝗡 𝘀𝗲𝘁𝗜𝗻𝘁𝗲𝗿𝘃𝗮𝗹 𝗥𝗜𝗚𝗛𝗧 𝗕𝗘𝗟𝗢𝗪 𝗧𝗛𝗜𝗦 𝗖𝗢𝗠𝗠𝗘𝗡𝗧 𝗪𝗜𝗧𝗛 𝗧𝗛𝗜𝗦 ↑↑↑↑

setInterval(() => {
    var element = document.querySelector('img[src="https://i.dstatic.com/images/pokeball-n.png"][alt="N"][title="You don\'t have this pokemon in your box."]');
if (element !== null) {
        document.querySelector("#catch")?.click();
        clickSimulationActive = true;
    } else {
        clickSimulationActive = false;
    }
}, 1250);

setInterval(() => {
    document.querySelector("#battle > form > div.center > input:nth-child(1)")?.click();
}, 1250);

setInterval(() => {
    document.querySelector("#item-masterball")?.click();
}, 450);

setInterval(() => {
    document.querySelector("#itemwrap > div:nth-child(1) > form > div.buttoncenter.clear > input:nth-child(2)")?.click();
}, 1250);

setInterval(() => {
    document.querySelector("#battle > div.infobox > a.btn.btn-primary")?.click();
}, 1250);


function handleAutoWalkFind() {
    var isUpDownActive = true;
    var interval = Math.floor(Math.random() * (20 - 9 + 1)) + 9;



    var autoWalkFindInterval = setInterval(() => {
        var isLoading = $("#showpoke").text().indexOf("Searching...") > -1;
        if (!isLoading && autoWalkFind) {
            var move;
            if (isUpDownActive) {

                if (upCount < upLimit) {
                    move = 38;
                    upCount++;
                } else if (downCount < downLimit) {
                    move = 40;
                    downCount++;
                }

                if (upCount >= upLimit && downCount >= downLimit) {
                    isUpDownActive = false;
                    upCount = 0;
                    downCount = 0;
                }
            } else {

                if (leftCount < leftLimit) {
                    move = 37;
                    leftCount++;
                } else if (rightCount < rightLimit) {
                    move = 39;
                    rightCount++;
                }

                if (leftCount >= leftLimit && rightCount >= rightLimit) {
                    isUpDownActive = true;
                    leftCount = 0;
                    rightCount = 0;
                }
            }
            if (move !== undefined) {
                fireKey(document, move);
            }
        }
    }, interval);
}


var upCount = 0;
var downCount = 0;
var leftCount = 0;
var rightCount = 0;

var upLimit = 20;
var downLimit = 20;
var leftLimit = 20;
var rightLimit = 20;


handleAutoWalkFind();

