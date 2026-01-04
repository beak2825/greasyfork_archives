// ==UserScript==
// @name         Surviv.io Counters
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  An ingame counter overlay to view connection stats and in-game health stats.
// @author       DamienVesper
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://parmainitiative.com/*
// @match        *://ot38.club/*
// @match        *://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/*
// @match        *://*.c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/*
// @match        *://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/*
// @match        *://*.twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/*
// @grant        GM_xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/407813/Survivio%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/407813/Survivio%20Counters.meta.js
// ==/UserScript==

let times = [];

const getPing = () => {
    let ping = new Date;

    let request = new XMLHttpRequest();
    request.open(`GET`, window.location.href, true);

    request.onload = (() => {
        document.querySelector(`#latWrapper > span`).innerHTML = `${new Date - ping} LAT`;
        setTimeout(getPing, 500);
    });
    request.send();
}



const getFPS = () => {
    window.requestAnimationFrame(() => {
        const now = performance.now();

        while(times.length > 0 && times[0] <= now - 1000) times.shift();
        times.push(now);

        document.querySelector(`#fpsWrapper > span`).innerHTML = `${times.length} FPS`;
        getFPS();
    });
}

const getHealth = () => {
    let healthBar = document.querySelector(`#ui-health-actual`);
    return Math.round(healthBar.clientWidth / 4);
}
const getBoost = () => {
    let boostActualWidth = 0;

    let boosts = document.querySelectorAll(`.ui-boost-base .ui-bar-inner`);
    boosts.forEach((boost, i) => {
        if(i <= 1) boostActualWidth += parseInt(boost.style.width.slice(0, boost.style.width.length - 1)) / 4;
        else if(i == 2) boostActualWidth += parseInt(boost.style.width.slice(0, boost.style.width.length - 1)) / 2.5;
        else if(i == 3) boostActualWidth += parseInt(boost.style.width.slice(0, boost.style.width.length - 1)) / 10;
    });


    return Math.round(boostActualWidth);
}

const injectCSS = () => {
    let style = document.createElement(`style`);
    style.innerHTML = `
.box-container {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding: 8px;
}
#hpWrapper, #btWrapper {
    width: 50px;
    margin-right: 5px;
    display: inline-block;
}
#fpsWrapper, #latWrapper {
    margin: 5px 0px;
    width: 192px;
}
#ui-spectate-options {
    top: 85px;
}
#copd {
    position: relative;
    top: 97px;
    left: -55%;
    width: 205px;
    text-align: center;
}
`;
    document.head.appendChild(style);
}


const createElements = () => {
    //Add FPS
    let fpsWrapper = document.createElement(`div`);
    fpsWrapper.id = `fpsWrapper`;
    fpsWrapper.classList.add(`box-container`);

    let fps = document.createElement(`span`);
    fpsWrapper.appendChild(fps);

    document.querySelector(`#ui-top-left`).appendChild(fpsWrapper);

    //Add LAT
    let latWrapper = document.createElement(`div`);
    latWrapper.id = `latWrapper`;
    latWrapper.classList.add(`box-container`);

    let lat = document.createElement(`span`);
    latWrapper.appendChild(lat);
    document.querySelector(`#ui-top-left`).appendChild(latWrapper);

    //Create bottom wrapper.
    let boostCounter = document.querySelector(`#ui-boost-counter`);
    let botWrapper = document.createElement(`div`);
    botWrapper.id = `numWrapper`;
    document.querySelector(`#ui-bottom-center-0`).insertBefore(botWrapper, boostCounter);

    //Add HP
    let hpWrapper = document.createElement(`div`);
    hpWrapper.classList.add(`box-container`);
    hpWrapper.id = `hpWrapper`;

    let hpTxt = document.createElement(`span`);
    setInterval(() => (hpTxt.innerHTML = `HP: ${getHealth()}`));
    hpWrapper.appendChild(hpTxt);
    botWrapper.appendChild(hpWrapper);

    //Add Boost
    let adWrapper = document.createElement(`div`);
    adWrapper.classList.add(`box-container`);
    adWrapper.id = `btWrapper`;

    let adTxt = document.createElement(`span`);
    setInterval(() => (adTxt.innerHTML = `AD: ${getBoost()}`));
    adWrapper.appendChild(adTxt);
    botWrapper.appendChild(adWrapper);
}

const runScripts = () => {
    let a = document.createElement(`div`);
    a.id = `copd`;
    a.classList.add(`box-container`);

    let sp = document.createElement(`span`);
    sp.innerHTML = `Subscribe`;
    a.appendChild(sp);

    let b = document.querySelector(`#numWrapper`);
    document.querySelector(`#ui-bottom-center-0`).insertBefore(a, b);
}

const mainScript = () => {
    createElements();
    injectCSS();
    getFPS();
    getPing();
    runScripts();
}
mainScript();