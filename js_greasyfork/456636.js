// ==UserScript==
// @name         Número de tarefas nos quadros do jira
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show the number of cards in a Jira Column
// @author       Brennon Gabriel de Oliveira
// @match        https://docato.atlassian.net/*/boards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456636/N%C3%BAmero%20de%20tarefas%20nos%20quadros%20do%20jira.user.js
// @updateURL https://update.greasyfork.org/scripts/456636/N%C3%BAmero%20de%20tarefas%20nos%20quadros%20do%20jira.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(updateValues,1000)
})();

function getCardsCount(){
    const numberOfCards = [];
    document.querySelectorAll("#ghx-pool > div.ghx-swimlane").forEach(block=>{
        block.querySelectorAll("ul > li").forEach((column, columnIndex)=>{
            if(!numberOfCards[columnIndex]) numberOfCards[columnIndex] = 0;
            numberOfCards[columnIndex] += column.querySelectorAll(".ghx-newcard").length
        })
    })
    return numberOfCards
}

function updateValues(){
    const numberOfCards = getCardsCount();
    const header = document.querySelectorAll("#ghx-column-headers > li")
    header.forEach((headerItem, itemIndex)=>{
        headerItem.querySelector("h2").innerHTML = headerItem.querySelector("h2").innerHTML.split(" <b>")[0] + " <b>(" + numberOfCards[itemIndex] + ")</b>";
    })
}
