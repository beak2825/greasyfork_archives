// ==UserScript==
// @name         hega planet cycle
// @name:de      hega planet cycle
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a button in the right menu for cycling through all available planets.
// @description:de Fügt einen Knopf im rechten Menü ein, welcher das automatische Durschalten zwischen allen Planeten ermöglicht.
// @author       holycrumb
// @license      MIT
// @match        https://scarif.hiddenempire.de/game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hiddenempire.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473509/hega%20planet%20cycle.user.js
// @updateURL https://update.greasyfork.org/scripts/473509/hega%20planet%20cycle.meta.js
// ==/UserScript==
'use strict';

window.addEventListener("load", function(){
    console.log("pc load called");

    button.create();
    //resume
    if (localData.getStatus()){
        localData.setStatus(10);
        toggleTimer();
    }
    //listener to reset countdown
    document.addEventListener("click", () => {
        if (localData.timer) localData.setStatus(10);
    });
});

const localData = {
    timer: 0,
    //timeout used to reset the initial countdown back to 5s, after the initial button click sets it to 10s, because of the click event listener on the whole document
    timeout: 0,
    getStatus: () => {
        let status = parseInt(localStorage.getItem("localCycleStatus"), 10);
        if (isNaN(status)){
            localStorage.setItem("localCycleStatus", status = 0);
            console.log("localCycleStatus created: " + status);
        }
        return status;
    },
    setStatus: (status) => {
        localStorage.setItem("localCycleStatus", status);
    }
}

const button = {
    create: () => {
        let btnElement = $('<li><a id="btnCyclePlanets" title="Toggles cycling through all available planets" class="heMenuIconsSmall heMenuIconsSmall_view" style="opacity: 0.5;">Cycle Planets</a></li>');
        btnElement.on("click", btnCyclePlanetsClick);
        $(".mright").prepend(btnElement);
    },
    opacity: (value) => {
        let btnElement = $("#btnCyclePlanets");
        if (btnElement.css("opacity") != value) btnElement.css("opacity", value);
    },
    exists: () => {
        return document.getElementsByClassName("heViewPlanetBtnRight")[0];
    },
    click: () => {
        try {
            document.getElementsByClassName("heViewPlanetBtnRight")[0].click();
        } catch {
            console.log("Button not found");
        }
    }
}

function toggleTimer(){
    if(!localData.timer){
        localData.timer = window.setInterval(function(){
            let status = localData.getStatus();
            if (button.exists()) status--;
            if (status == 0){
                button.click();
                status = 5;
            }
            localData.setStatus(status);
        }, 1000);
        button.opacity(1)
    } else {
        window.clearInterval(localData.timer);
        localData.timer = 0;
        localData.setStatus(0);
        button.opacity(0.5);
    }
}

function btnCyclePlanetsClick(){
    if(!localData.timer){
        button.click();
        toggleTimer();
        localData.timeout = setTimeout(() => {
            localData.setStatus(4);
        }, 1000);
    } else {
        if (localData.timeout){
            clearTimeout(localData.timeout);
            localData.timeout = 0;
        }
        toggleTimer();
    }
}