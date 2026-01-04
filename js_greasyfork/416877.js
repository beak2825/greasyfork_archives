// ==UserScript==
// @name         ExHentai autoscroll and next
// @namespace    none
// @version      0.1
// @description  automatic scroll and next for easier, handless reading of exHentai galleries
// @author       saddestpandaever
// @match        *://exhentai.org/s/*
// @downloadURL https://update.greasyfork.org/scripts/416877/ExHentai%20autoscroll%20and%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/416877/ExHentai%20autoscroll%20and%20next.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var header = document.getElementsByTagName("h1")[0];
    var button = document.createElement("button");
    button.innerHTML = "Start scrolling";
    button.onclick = function(){
        scrollDown(20);
    };
    header.appendChild(button);
})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickNext(next){
    await sleep(2000);
    next.click();
}

async function scrollDown(delay){

    var windowScrollBottom, botDiv = document.getElementById("i4"), next = document.getElementById("next"), imagediv = document.getElementById("i3");

    var plus = document.createElement("button"), minus=document.createElement("button"), pause = document.createElement("button"), paused=false, speedindicator = document.createElement("text");
    plus.innerHTML = "+"; minus.innerHTML = "-"; pause.innerHTML = "P"; speedindicator.innerHTML = Math.floor(1000/delay)+"px/s";
    plus.setAttribute("style", "width:30; height:30; margin-left: -30px; background-color: #666666; position:fixed");
    minus.setAttribute("style", "width:30; height:30; margin-left: -30px; background-color: #666666; margin-top: 20px; position:fixed");
    pause.setAttribute("style", "width:30; height:30; margin-left: -30px; background-color: #666666; margin-top: 40px; position:fixed");
    speedindicator.setAttribute("style", "width:30; height:30; margin-left: -30px; margin-top: 65px; position:fixed");
    function updateSpeedIndicator(){
        speedindicator.innerHTML = Math.floor(1000/delay) + "px/s";
    }

    plus.onclick = function() {
        if(delay > 2) delay=delay-2;
        updateSpeedIndicator();
    };
    minus.onclick = function() {
        delay=delay+2;
        updateSpeedIndicator();

    };
    pause.onclick = function() {
        paused=!paused;
    };
    imagediv.prepend(plus, minus, pause,speedindicator);


    while(true){
        while(paused){ await sleep(10);}

        await sleep(delay);
        window.scrollBy(0, 1);
        windowScrollBottom=window.pageYOffset + window.innerHeight;

        if(windowScrollBottom > botDiv.offsetTop){
            next = document.getElementById("next");
            await sleep(1500);//ms to stay at the bottom of the page before going to the next
            await clickNext(next);
            await sleep(300);

            imagediv = document.getElementById("i3");
            await imagediv.scrollIntoView();
            imagediv.prepend(plus, minus, pause,speedindicator);

            await sleep(1500);//ms before starting to scroll
        }
    }
}