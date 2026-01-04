// ==UserScript==
// @name         Event Map Opener
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.mousehuntgame.com/inventory.php?tab=special&sub_tab=all
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421784/Event%20Map%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/421784/Event%20Map%20Opener.meta.js
// ==/UserScript==

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function cycle(num) {
    console.group("Map Cycler (Iterations: ${num})");
    for (let i = 0; i < num; i++) {
        await check_map();
        await sleep(1000);
        await leave();
        await sleep(1000);
        await confirmleave();
        await sleep(1000);

        await open();
        await sleep(1000);
        await leave();
        await sleep(1000);
        await confirmleave();
        await sleep(1000);
        console.groupEnd("Map Cycler (Iterations: ${num}");
    }
}

function check_map(){
    const checkMapButton = document.querySelector(
        ".mousehuntHud-userStat.treasureMap"
    );
    checkMapButton.click();
}

function open(){
    const mapButton = document.querySelector(
        ".inventoryPage-item-button[data-item-type='lunar_new_year_scroll_case_convertible']"
    );
    if (mapButton) {
        mapButton.click();
        console.log("Error: No blue 'Leave Map' button to click on");
    }
    else {
        console.log("Error: No Map 'Open' button to click on");
    }
}

function leave(){
    const leaveButton = document.querySelector(
        ".mousehuntActionButton.tiny.lightBlue.treasureMapView-leaveMapButton"
    );

    if (leaveButton != null) {
        console.log("leavebutton found");
        leaveButton.click();
    }
    else {
        console.log("Error: No light blue confirm leave button to click on");
    }
}

function confirmleave(){
    const confirmButton = document.querySelector(".treasureMapDialogView-continueButton");
    if (confirmButton != null) {
        if (document.getElementsByClassName("treasureMapDialogView-title")[0].innerText == "Leave Lantern Lighter Event Map?") {
            confirmButton.click();
        }
        else {
            console.log("Almost left the wrong map kek")
        }
    }
    else {
        console.log("confirm missing");
    }
}

cycle(170); //Replace number in brackets with how many scrolls you want to open