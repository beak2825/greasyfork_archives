// ==UserScript==
// @name         Geoguessr Old UI Emulator
// @version      1.1
// @description  Re-adds the score bar and moveable end map to Geoguessr
// @author       zakiack
// @match        *://*.geoguessr.com/*
// @license      MIT
// @namespace    https://greasyfork.org/users/1037819
// @downloadURL https://update.greasyfork.org/scripts/461344/Geoguessr%20Old%20UI%20Emulator.user.js
// @updateURL https://update.greasyfork.org/scripts/461344/Geoguessr%20Old%20UI%20Emulator.meta.js
// ==/UserScript==
var ranRes = false;
var ranEnd = false;
function generateBar(score,barPercent,id){
    const barBackground = document.createElement("div");
    const barFill = document.createElement("div");
    const scorePara = document.createElement("p");
    barBackground.id = id;
    barBackground.style.width = "90%";
    barBackground.style.backgroundColor = "grey";
    barBackground.style.textAlign = "center";
    barBackground.style.height = "20px";
    barBackground.style.margin = "auto";
    barFill.style.width = barPercent+"%";
    barFill.style.backgroundColor = "orange";
    barFill.class = "filled bar";
    scorePara.innerHTML = score;
    scorePara.class = "score label";
    barBackground.appendChild(barFill);
    barFill.appendChild(scorePara);
    return barBackground;
}
function addBarDuring(resultElement){
    const score = parseFloat(document.querySelector('div[class^="round-result_pointsIndicatorWrapper"]').firstElementChild.firstElementChild.firstElementChild.innerHTML.replace(/,/g, ''));
    const barPercent = (score/5000)*100;
    let e = document.getElementById("the bar");
    if (e && score){
        const barFill = e.firstElementChild;
        const scorePara = barFill.firstElementChild;
        barFill.style.width = barPercent+"%";
        scorePara.innerHTML = score;

    } else if(!e) {
        const bar = generateBar(score,barPercent,"the bar");
        resultElement.insertBefore(bar,resultElement.firstChild);
    }

}
function addBarEnd(){
    const score = parseFloat(document.querySelectorAll('div[class^="status_value"]')[2].innerHTML.replace(/,/g, ''));
    const resultOverlays = document.querySelectorAll('div[class^="result-overlay_overlay"]');
    if (resultOverlays){
        for (let i=0;i<resultOverlays.length;i++){
            resultOverlays[i].remove();
        }
    }
    const bottomBar = document.querySelector('div[class^="result-layout_contentNew"]');
    const barPercent = (score/25000)*100;
    let e = document.getElementById("the bar end");
    if(!e) {
        const bar = generateBar(score,barPercent,"the bar end");
        let e1 = document.getElementById("the bar");
        bottomBar.insertBefore(bar,e1);
        e1.remove();
        const roundDesc = document.createElement("p");
        roundDesc.innerHTML = "You Scored "+score+" Out of 25,000 points";
        roundDesc.style.fontSize = "20px";
        bottomBar.insertBefore(roundDesc,bar);
    }
}
function checkGameEnd(){
    //if (window.location.href.includes("/game/")){
        const gameLayout = document.querySelector('.game-layout');
        const checkEndingElement = document.querySelector('div[class^="round-indicator_roundIndicatorContent"]');
        const resultElement = document.querySelector('div[class^="result-layout_contentNew"]');
        const endElement = document.querySelector('div[class^="result-map__map"]');
        if(checkEndingElement && checkEndingElement.innerHTML.includes("Result") && ranEnd == false) {
            ranRes = true;
            ranEnd = true;
            addBarEnd();
        }else if(gameLayout && resultElement && ranRes == false) {
            addBarDuring(resultElement);
            ranRes = true;
            ranEnd = false;
        }else if(gameLayout) {
            ranRes = false;
            ranEnd = false;
        }
    //}
}
function init(){
    console.log("zakiack's old geoguessr ui emulator running");
    const observer = new MutationObserver(checkGameEnd);
    observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
}
init();