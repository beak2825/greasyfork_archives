// ==UserScript==
// @name         AdBlocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  114514
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415301/AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/415301/AdBlocker.meta.js
// ==/UserScript==

let time_ms, moving;

function getRnd(max, min){return Math.floor(Math.random()*(max-min))+min;}

function init(){
    const yaju = document.createElement("img");
    yaju.id = "yaju";
    yaju.src = "https://pbs.twimg.com/profile_images/775339556623167489/IRIg6niu_400x400.jpg";
	yaju.style.zIndex = 1145141919810;
	yaju.style.position = "fixed";
    yaju.style.top = "100vh";
    yaju.style.left = "calc(50vw - 200px)";
    yaju.style.transition = "top 2500ms 0ms ease, visibility 0ms 2500ms";
	yaju.style.visibility = "hidden";
    yaju.onclick = function(){location.href = "http://www.114514.com/";}
    document.body.appendChild(yaju);
    return;
}

function downYaju(){
    let yaju = document.getElementById("yaju");
	yaju.style.transition = "top 2500ms 0ms ease, visibility 0ms 2500ms";
    yaju.style.top = "100vh";
	yaju.style.visibility = "hidden";
	moveYaju();
    return;
}

function upYaju(){
    let yaju = document.getElementById("yaju");
	yaju.style.left = getRnd(90, 10).toString() + "vw";
	yaju.style.transition = "top 2500ms 0ms ease, visibility 0ms 0ms";
    yaju.style.top = "calc(100vh - 350px)";
	yaju.style.visibility = "visible";
    return;
}

function moveYaju(){
    time_ms = getRnd(15000, 3000);
    window.setTimeout(upYaju, time_ms);
    time_ms = getRnd(3000, 15000);
    window.setTimeout(downYaju, time_ms);
}

init();
moveYaju();
