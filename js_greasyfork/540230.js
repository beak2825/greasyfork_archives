// ==UserScript==
// @name        Wasted Away
// @namespace   Violentmonkey Scripts
// @match       https://*reddit.com/*
// @match       https://*facebook.com/*
// @match       https://*instagram.com/*
// @match       https://*x.com/*
// @license MIT

// @grant       none
// @version     1.0
// @author      - Rohan Bhattacharyya
// @description Adds a small panel that shows you how much time you've wasted on the @match websites, and shows you what you could have done in that time instead.
// @downloadURL https://update.greasyfork.org/scripts/540230/Wasted%20Away.user.js
// @updateURL https://update.greasyfork.org/scripts/540230/Wasted%20Away.meta.js
// ==/UserScript==

let ticking = false;
let intervalId = null;
let lastTick = Date.now();



// in seconds
const couldHave = {
    1: ["Breathed", "Looked at the sky", "Smelled a rose"],
    30:["Added a task for the day", "Closed out distracting tabs"],
    60:["Pet your pet", "Eat a snack", "Microwave a meal", "Did 1 minute relaxation breathing"],
    3600:["Cooked dinner", "Gone shopping", "Paint a picture", "Programmed a small script", "Done some gardening", "Gone swimming", "Done exercise", "Gotten a haircut"]
};

function sToString(seconds){
    seconds = parseFloat(seconds);
    if (seconds > (3600 * 24)) {
        return `${(seconds / (3600 * 24)).toFixed(1)} days`;
    } else if (seconds > 3600) {
        return `${(seconds / 3600).toFixed(1)} hours`;
    } else if (seconds > 60) {
        return `${(seconds / 60).toFixed(1)} minutes`;
    } else {
        return `${seconds.toFixed(1)} seconds`;
    }
}

function getSavedData(){
    const val = parseFloat(localStorage.getItem("wastedAway"));
    if (isNaN(val)) {
        localStorage.setItem("wastedAway", "0");
        return 0;
    }
    return val;
}

function tick(){
    const now = Date.now();
    const delta = (now - lastTick) / 1000;
    lastTick = now;

    const previous = getSavedData();
    localStorage.setItem("wastedAway", (previous + delta).toString());

    const newTotal = getSavedData();
    document.querySelector("#wastedCounter").innerHTML = `You've Wasted ${sToString(newTotal)} of your life on this site.`;
}

function youCouldHave() {
    let seconds = getSavedData();
    if (seconds>3600){
        alert(`
            ${couldHave["3600"][Math.floor(Math.random() * couldHave["3600"].length)]} ${Math.floor(seconds/3600.0)} times.
            OR
            ${couldHave["60"][Math.floor(Math.random() * couldHave["60"].length)]} ${Math.floor(seconds/60.0)} times.
            OR
            ${couldHave["30"][Math.floor(Math.random() * couldHave["30"].length)]} ${Math.floor(seconds/30.0)} times.
            OR
            ${couldHave["1"][Math.floor(Math.random() * couldHave["1"].length)]} ${Math.floor(seconds/1.0)} times.
        `);
    } else if (seconds>60){
        alert(`
            ${couldHave["60"][Math.floor(Math.random() * couldHave["60"].length)]} ${Math.floor(seconds/60.0)} times.
            OR
            ${couldHave["30"][Math.floor(Math.random() * couldHave["30"].length)]} ${Math.floor(seconds/30.0)} times.
            OR
            ${couldHave["1"][Math.floor(Math.random() * couldHave["1"].length)]} ${Math.floor(seconds/1.0)} times.
        `);
    } else if (seconds>30){
        alert(`
            ${couldHave["30"][Math.floor(Math.random() * couldHave["30"].length)]} ${Math.floor(seconds/30.0)} times.
            OR
            ${couldHave["1"][Math.floor(Math.random() * couldHave["1"].length)]} ${Math.floor(seconds/1.0)} times.
        `);
    } else {
        alert(`
            ${couldHave["1"][Math.floor(Math.random() * couldHave["1"].length)]} ${Math.floor(seconds/1.0)} times.
        `);
    }
    
}

function startTicking(){
    if (!ticking) {
        lastTick = Date.now();
        intervalId = setInterval(tick, 100);
        ticking = true;
    }
}

function stopTicking(){
    if (ticking) {
        clearInterval(intervalId);
        ticking = false;
    }
}

function handleVisibilityChange(){
    if (document.hidden) {
        stopTicking();
    } else {
        startTicking();
    }
}

function start(){
    const newDiv = document.createElement("div");
    newDiv.style.position = "fixed";
    newDiv.style.top = "0px";
    newDiv.style.left = "0px";
    newDiv.style.width = "fit-content";
    newDiv.style.zIndex = "99999999";
    newDiv.style.padding = "5px";
    newDiv.style.backgroundColor = "#111111";
    newDiv.style.borderRadius = "5px";
    newDiv.style.color = "AliceBlue";
    newDiv.style.fontFamily = "'Segoe UI', Arial, sans-serif";

    const current = getSavedData();

    newDiv.innerHTML = `
        <p style="font-size: 0.6rem;padding:5px;" id="wastedCounter">You've Wasted ${sToString(current)} of your life on this site</p>
        <button style="font-size: 0.6rem;background-color:#1C1C1C;color:AliceBlue" id="youCouldHaveButton">What could I have done in this time instead?</button>
    `;
    document.body.appendChild(newDiv);
    newDiv.querySelector("#youCouldHaveButton").addEventListener("click", youCouldHave);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange(); // Start ticking if already visible
}

setTimeout(()=>{start();}, 1000);
