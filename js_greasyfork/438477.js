// ==UserScript==
// @name         Auto recruit
// @namespace    http://triburile.ro
// @version      0.1
// @description  Recruit
// @author       You
// @match        https://*/game.php*screen=train*
// @match        https://*/game.php*screen=barracks*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438477/Auto%20recruit.user.js
// @updateURL https://update.greasyfork.org/scripts/438477/Auto%20recruit.meta.js
// ==/UserScript==
recruit();

async function recruit() {
    console.log("Started script. Will wait for 2-5 seconds.");
    await timeout(randomSeconds(2, 5)); // wait for 2-5 seconds
    var maxPop = parseInt(document.querySelector("#pop_max_label").innerText);
    var currentPop = parseInt(document.querySelector("#pop_current_label").innerText);
    var maxSpearToRecruit = parseInt(document.querySelector("#spear_0_a").innerText.substring(1, document.querySelector("#spear_0_a").innerText.length-1));
    var spearToRecruitInput = document.querySelector("#spear_0");
    var recruitButton = document.querySelector("#train_form > table > tbody > tr:nth-child(10) > td:nth-child(2) > input");
    if (recruitButton == null) {
        recruitButton = document.querySelector("#train_form > table > tbody > tr:nth-child(5) > td:nth-child(2) > input");
    }
    if (recruitButton == null) {
        recruitButton = document.querySelector("#train_form > table > tbody > tr:nth-child(3) > td:nth-child(2) > input");
    }
    if (recruitButton == null) {
        recruitButton = document.getElementsByClassName('btn btn-recruit')[0];
    }

    if(needToUpgradeFarm(maxPop, currentPop)) {
        console.log("Need to upgrade farm.");
    }

    var spearsToRecruit = 0;
    if (maxSpearToRecruit >= 2 && maxSpearToRecruit <= 10) {
        spearsToRecruit = 2;
    } else {
        spearsToRecruit = 5;
    }

    spearToRecruitInput.value = spearsToRecruit;
    await timeout(randomSeconds(1, 3));
    recruitButton.click();
    await timeout(randomSeconds(2, 5));
    localStorage.setItem('last_action', Date.parse(new Date()));
    window.location.assign(game_data.link_base_pure + "place&mode=scavenge");
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomSeconds(min, max) {
    return randomNumber(min, max) * 1000;
}

function updateLocalStorage() {
    localStorage.setItem('last_action', Date.parse(new Date()));
}

function needToUpgradeFarm(maxPop, currentPop) {
    if (currentPop === maxPop) {
        return true;
    }
    if (maxPop - currentPop <= 35) {
        return true;
    }
    return false;
}