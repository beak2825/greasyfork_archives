// ==UserScript==
// @name         Hybrid Wage Flasher
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.0
// @icon         https://i.imgur.com/M0jWVYS.png
// @description  Unleashes Your Sharingan
// @include      https://www.gethybrid.io/workers/tasks/*
// @include      https://www.gethybrid.io/workers/projects
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/369970/Hybrid%20Wage%20Flasher.user.js
// @updateURL https://update.greasyfork.org/scripts/369970/Hybrid%20Wage%20Flasher.meta.js
// ==/UserScript==

if (location.href.includes('https://www.gethybrid.io/workers/projects')) DATABASE();
//if (location.href.includes('https://www.gethybrid.io/workers/tasks/')) WAGE();

function DATABASE () {
    var database = JSON.parse(localStorage.getItem('hybridHits')) || {};
    var hits = document.querySelectorAll('tbody > tr');

    for (let i = 0; i < hits.length; i++) {
        var hitDetails = hits[i].querySelectorAll('td');
        var hit = {
            name: hitDetails[0].textContent,
            reward: hitDetails[2].textContent.replace('$','')
        };

        if (database[hit.name]) {
            if (database[hit.name].reward !== hit.reward) {
                delete database[hit.name];
                database[hit.name] = hit.reward;
            }
        }

        else database[hit.name] = hit.reward;
    }

    localStorage.setItem('hybridHits', JSON.stringify(database));
    return;
}


var database = JSON.parse(localStorage.getItem('hybridHits'));
var taskName = document.querySelector('[class="active"]').textContent;
var amount = database[taskName];
console.log(amount);

const SECONDS_TO_MILLISECONDS_MULTIPLER = 1000;

const WAGE_HIGH = 12;
const WAGE_MED = 9;

let isWorkerSite = window.location.href.includes("worker.mturk.com");

var hitSubmitDetected = false;
var hitSubmitDetectedTimestamp;

window.addEventListener("message", function handleMessage(event) {
    if(event.data.hitSubmitClicked) {
        hitSubmitDetected = true;
        hitSubmitDetectedTimestamp = new Date();
    }
});

var hitForm = document.querySelector("form#new_task_response");
var startTime = new Date();
if (!location.href.includes('gethybrid.io/workers/projects')) window.addEventListener('beforeunload', doAtHitEnd);

if(hitForm) {
    hitForm.addEventListener("submit", function handleHitFormSubmit(event) {
        if(!hitSubmitDetected) {
            hitSubmitDetected = true;
            hitSubmitDetectedTimestamp = new Date();
        }
    });
}


function secondsToMMSSString(seconds) {
    let minutes = Math.floor(seconds / 60);
    let spareSeconds = Math.floor(seconds - (minutes * 60));
    return `${minutes.toLocaleString("US", {minimumIntegerDigits: 2, maximumFractionDigits: 0})}:${spareSeconds.toLocaleString("US", {minimumIntegerDigits: 2, maximumFractionDigits: 0})}`;
}

function doAtHitEnd(){
    var unloadTimestamp = new Date();
    var seconds = Number((unloadTimestamp - startTime) / 1000);

    var reward = amount;
    var wage = reward * 3600 / seconds;

    var pageloadLostWage;
    var pageCompleteLostWage;
    var submitTimeLostWage;

    var pageloadElement = document.querySelector("#timeLostToPageLoad");
    var pageCompleteElement = document.querySelector("#timeLostToFullPageLoad");

    if(pageloadElement) {
        const completionTimeMinusLoadTime = seconds - ( Number(pageloadElement.innerText) / 1000);
        const zeroLoadTimeWage = reward * 3600 / ( completionTimeMinusLoadTime );
        pageloadLostWage = zeroLoadTimeWage - wage;
    }

    if(pageCompleteElement) {
        const completionTimeMinusPageCompleteTime = seconds - ( Number(pageCompleteElement.innerText) / 1000);
        const wageWithoutWaitingForResources = reward * 3600 / ( completionTimeMinusPageCompleteTime );
        pageCompleteLostWage = wageWithoutWaitingForResources - wage;
    }

    if(hitSubmitDetected) {

        /*if(DEBUG_FAKE_SUBMIT_DETECTION) {
            hitSubmitDetectedTimestamp = Number(unloadTimestamp) + 1;
        }*/

        const submitTimeLost = unloadTimestamp - hitSubmitDetectedTimestamp;
        const completionTimeMinusSubmitTime = seconds - ( submitTimeLost / 1000);
        const wageWithoutWaitingForSubmit = reward * 3600 / ( completionTimeMinusSubmitTime );
        submitTimeLostWage = wageWithoutWaitingForSubmit - wage;
    }

    let wageColor;
    if(wage >= WAGE_HIGH) {
        wageColor = "green";
    }
    else if(wage >= WAGE_MED) {
        wageColor = "yellow";
    }
    else {
        wageColor = "red";
    }

    document.body.insertAdjacentHTML('afterend', `<div id='wageWrapper'><div id='wage'>$${wage.toFixed(2)}/hr.</div></div>`);

    console.log(wage.toFixed(2));

    document.querySelector("#wageWrapper").style = `` +
        `position: fixed;` +
        `width: 100%;` +
        `height: 100%;` +
        `top: 0px;` +
        `left: 0px;` +
        `background-color: rgba(0,0,0,0.8);`;

    document.querySelector("#wage").style = `` +
        `position: absolute;` +
        `top: 50%;` +
        `font-size: 100px;` +
        `font-weight: bold;` +
        `font-family: monospace;` +
        `color: ${wageColor};` +
        `width: 100%;` +
        `text-align: center;`;
}