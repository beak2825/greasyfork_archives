// ==UserScript==
// @name         War Timer
// @namespace    wartimer.zero.torn
// @version      0.5
// @description  SHows a war timer
// @author       nao
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510080/War%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/510080/War%20Timer.meta.js
// ==/UserScript==

let api = "";

let url = `https://api.torn.com/faction/?selections=&key=${api}`;
let timeRemaining= -1;
function getWar(){
    console.log("Getting War Data");
    $.getJSON(url, function(response){
        if (response.ranked_wars){
            let warID = Object.keys(response.ranked_wars)[0];
            if (response.ranked_wars[warID] && response.ranked_wars[warID].war){
                let startTime = response.ranked_wars[warID].war.start;
                let endTime = response.ranked_wars[warID].war.end;
                let ndata = {};
                let ctime = Date.now();

                ndata["lcheck"] = ctime;
                if (endTime == 0){
                    ndata["start"] = startTime;
                }
                else{
                    ndata["start"] = -1;
                }
                localStorage.zerowartime = JSON.stringify(ndata);
                showData();
            }
        }

    });
}

function updateTime(){
    if (timeRemaining <= 0){
        insertFetch();
        return;
    }
    timeRemaining--;
    let valn = `<b seconds="${timeRemaining}">${convertTime(timeRemaining)}</b>`;
    $("#warCont").html(valn);


}
function convertTime(time){
    let days = Math.floor(time / 86400);
    time = time - days * 86400;
    let hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    return `${days} d ${hours} h ${minutes} m ${seconds} s`;
}
function showData(){
    if ( $("#sidebar > div:nth-child(2) > div").length == 0){
        setTimeout(showData, 300);
        return;
    }
    let val = `<div id="warCont"></div>`;
    if ($("#warCont").length == 0){
        $("#sidebar > div:nth-child(1) > div > div.user-information___VBSOk").append(val);
    }

    if (localStorage.zerowartime){
        let data = JSON.parse(localStorage.zerowartime);
        let start = data.start;
        if (start == -1){
            insertFetch()
            return;
        }
        timeRemaining = start - Math.floor(Date.now() / 1000);
        console.log(timeRemaining);

        setInterval(updateTime, 1000);
    }
    else{
        insertFetch()

    }
}

function insertFetch(){
    let valn = `<button id="getWar" class="torn-btn">Fetch War Data</button>`;
    $("#warCont").html(valn);
    $("#getWar").off("click");
    $("#getWar").click(function(){
        getWar();
    });
}

showData();