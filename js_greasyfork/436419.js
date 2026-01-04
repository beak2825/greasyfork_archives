// ==UserScript==
// @name         Edit for VoxCount
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @icon         https://surviv.io/favicon.ico
// @description  Some changed for VoxCount
// @author       [VC] Ultra
// @license MIT
 
 
// Extra Information
// Made by: [VC] Ultra
// For: surviv.io
 
 
// <========== MATCH ==========> \\
 
// @match        http://surviv.io/*
// @match        https://surviv.io/*
// @match        http://surviv.io/?region=na&zone=sfo
// @match        http://surviv.io/?region=na&zone=mia
// @match        http://surviv.io/?region=na&zone=nyc
// @match        http://surviv.io/?region=na&zone=chi
// @match        http://surviv.io/?region=sa&zone=sao
// @match        http://surviv.io/?region=eu&zone=fra
// @match        http://surviv.io/?region=eu&zone=waw
// @match        http://surviv.io/?region=as&zone=sgp
// @match        http://surviv.io/?region=as&zone=nrt
// @match        http://surviv.io/?region=as&zone=hkg
// @match        http://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=na&zone=sfo
// @match        https://surviv.io/?region=na&zone=mia
// @match        https://surviv.io/?region=na&zone=nyc
// @match        https://surviv.io/?region=na&zone=chi
// @match        https://surviv.io/?region=sa&zone=sao
// @match        https://surviv.io/?region=eu&zone=fra
// @match        https://surviv.io/?region=eu&zone=waw
// @match        https://surviv.io/?region=as&zone=sgp
// @match        https://surviv.io/?region=as&zone=nrt
// @match        https://surviv.io/?region=as&zone=hkg
// @match        https://surviv.io/?region=kr&zone=sel
// @match        http://surviv2.io*
// @match        https://surviv2.io*
// @match        http://2dbattleroyale.com*
// @match        https://2dbattleroyale.com*
// @match        http://2dbattleroyale.org*
// @match        https://2dbattleroyale.org*
// @match        http://piearesquared.info*
// @match        https://piearesquared.info*
// @match        http://thecircleisclosing.com*
// @match        https://thecircleisclosing.com*
// @match        http://archimedesofsyracuse.info*
// @match        https://archimedesofsyracuse.info*
// @match        http://secantsecant.com*
// @match        https://secantsecant.com*
// @match        http://parmainitiative.com*
// @match        https://parmainitiative.com*
// @match        http://nevelskoygroup.com*
// @match        https://nevelskoygroup.com*
// @match        http://kugahi.com*
// @match        https://kugahi.com*
// @match        http://chandlertallowmd.com*
// @match        https://chandlertallowmd.com*
// @match        http://ot38.club*
// @match        https://ot38.club*
// @match        http://kugaheavyindustry.com*
// @match        https://kugaheavyindustry.com*
// @match        http://rarepotato.com*
// @match        https://rarepotato.com*
// @match        http://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        https://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        http://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// @match        https://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
 
// @grant        none
 
// @downloadURL https://update.greasyfork.org/scripts/436419/Edit%20for%20VoxCount.user.js
// @updateURL https://update.greasyfork.org/scripts/436419/Edit%20for%20VoxCount.meta.js
// ==/UserScript==
// <==========GUN_HUD==========> \\
(function() {
    'use strict';
    var elems = document.getElementsByClassName('ui-weapon-name')
    console.log(elems);
    for (var ii = 0; ii < elems.length; ii++) {
        elems[ii].addEventListener('DOMSubtreeModified', function() {
            var weaponName = this.textContent;
            var border = 'solid';
            var background = 'solid';
            switch (weaponName) {
                    // <---------- Default ----------> \\
                default:
                    border = '#FFFFFF';
                    border = 'solid';
                    background = '#5e5e5e';
                    background = '#5e5e5e';
                    break;
// <------------------------------MELEES------------------------------> \\
                case "Fists":
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Karmabit----->
                case "Karambit":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Karambit Rugged":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Karmabit Prismatic":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Karmabit Drowned":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Bayonet----->
                case "Bayonet":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Bayonet Rugged":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Bayonet Woodland":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Huntsman----->
                case "Huntsman":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Huntsman Rugged":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Huntsman Burnished":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Bowie----->
                case "Bowie":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Bowie Vintage":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Bowie Frontier":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Axe----->
                case "Wood Axe":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Blood Axe":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Fire Axe":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Katana----->
                case "Katana":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Katana Rusted":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Katana Orchid":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Naginata----->
                case 'Naginata':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Machetes----->
                case "Machete": //Machete Taiga
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Kukri": //Tallow's Kukri
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Hammers----->
                case "Stone Hammer":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Sledgehammer":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Hook----->
                case "Hook":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Pan----->
                case "Pan":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Knuckles----->
                case "Knuckles":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Knuckles Rusted":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Knuckles Heroic":
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Saw----->
                case "Bonesaw": //Bonesaw Rusted
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <-----Cobalt----->
                case "Spade": //Trench Spade
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Crowbar": //Scouting Crowbar
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Kukri": //Marksman's Recurve
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Bonesaw": //The Separator
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "Katana": //Hakai no Katana
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                case "War Hammer": //Panzerhammer
                    border +='#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <===GUNS===>
                    // <---------- YELLOW: 9mm ----------> \\
                case 'CZ-3A1':
                case 'G18C':
                case 'M9':
                case 'M93R':
                case 'MAC-10':
                case 'MP5':
                case 'P30L':
                case 'Dual P30L':
                case 'UMP9':
                case 'Vector':
                case 'VSS':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- RED: 12 Gauge ----------> \\
                case 'M1100':
                case 'M870':
                case 'MP220':
                case 'Saiga-12':
                case 'SPAS-12':
                case 'Super 90':
                case 'USAS-12':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- BLUE: 7.62 mm ----------> \\
                case 'AK-47':
                case 'AN-94':
                case 'BAR M1918':
                case 'BLR 81':
                case 'DP-28':
                case 'Groza':
                case 'Groza-S':
                case 'M1 Garand':
                case 'M39 EMR':
                case 'Mosin-Nagant':
                case 'OT-38':
                case 'OTs-38':
                case 'PKP Pecheneg':
                case 'SCAR-H':
                case 'SV-98':
                case 'SVD-63':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- GREEN: 5.56mm ----------> \\
                case 'FAMAS':
                case 'L86A2':
                case 'M249':
                case 'M416':
                case 'M4A1-S':
                case 'Mk 12 SPR':
                case 'QBB-97':
                case 'Scout Elite':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- Purple: .45 ACP ----------> \\
                case 'M1911':
                case 'M1A1':
                case 'Mk45G':
                case 'Model 94':
                case 'Peacemaker':
                case 'Vector 45':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- FLARE ----------> \\
                case 'Flare Gun':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- .50 AE ----------> \\
                case 'DEagle 50':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- .308 Subsonic ----------> \\
                case 'AWM-S':
                case 'Mk 20 SSR':
                    border += '##0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- Potato ----------> \\
                case 'Potato Cannon':
                case 'Spud Gun':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- CURSED: 9 mm ----------> \\
                case 'M9 Cursed':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- Bugle ----------> \\
                case 'Bugle':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- Trowables ----------> \\
                case 'Frag':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                case 'MIRV':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                case 'Potato':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                case 'Smoke':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                case 'Snowball':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                case 'Strobe':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                case 'Iron Bomb':
                    border += '#0066FF';
                    background += '#5e5e5e';
                    break;
                case 'Mine':
                    border += '#0066FF';
                    background += '5r5r5r';
                    
            }
            // <---------- GUN END ----------> \\
            console.log(border);
            this.parentNode.style.border = border;
        }, true);
    }
})();
// <========== ARMOR HUD ==========> \\
(function() {
    'use strict';
    var elems = document.getElementsByClassName('ui-armor-level');
    console.log(elems);
    for (var ii = 0; ii < elems.length; ii++) {
        elems[ii].addEventListener('DOMSubtreeModified', function() {
            var armorlv = this.textContent;
            var border = 'solid';
            switch (armorlv) {
                default: border = '#000000';
                    border = 'solid';
                    break;
                case 'Lvl. 0':
                    border += '#0066FF';
                    break;
                case 'Lvl. 1':
                    border += '#0066FF';
                    break;
                case 'Lvl. 2':
                    border += '#0066FF';
                    break;
                case 'Lvl. 3':
                    border += '#0066FF';
                    break;
                case 'Lvl. 4':
                    border += '#0066FF';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, true);
    }
})();
// <==========ARMOR_END==========> \\
// <==========HUD_END==========> \\
// ==UserScript==
 
var lat = document.querySelector(`#latWrapper > span`);
var fps = document.querySelector(`#fpsWrapper > span`);
let times = [];
 
const getPing = () => {
    let ping = new Date;
 
    let request = new XMLHttpRequest();
    request.open(`GET`, window.location.href, true);
 
    request.onload = (() => {
        lat.innerHTML = `${new Date - ping} ms`;
        setTimeout(getPing, 500);
    });
    request.send();
}
 
 
 
const getFPS = () => {
    window.requestAnimationFrame(() => {
        const now = performance.now();
 
        while(times.length > 0 && times[0] <= now - 1000) times.shift();
        times.push(now);
 
        fps.innerHTML = `${times.length} FPS`;
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
#fpsWrapper, #latWrapper,#joinWrapper {
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
    sp.innerHTML = `By Spring rolls#3096`;
    a.appendChild(sp);
 
    let b = document.querySelector(`#numWrapper`);
    document.querySelector(`#ui-bottom-center-0`).insertBefore(a, b);

    

    let joinWrapper = document.createElement(`div`);
    joinWrapper.id = `joinWrapper`;
    joinWrapper.classList.add(`box-container`);
 
    let joina = document.createElement(`span`);
    joina.innerHTML = `Join VC pls!`;
    joinWrapper.appendChild(joina);
 
    let joinb = document.querySelector(`#joinWrapper`);
    document.querySelector(`#ui-top-left`).insertBefore(joinWrapper, joinb);
}


const mainScript = () => {
    createElements();
    injectCSS();
    getFPS();
    getPing();
    runScripts();
}
mainScript();



// ==UserScript==
// @name         Surviv.io 2021 - Dark theme (Finished)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @icon         https://media.discordapp.net/attachments/828306103448109097/871941998393831454/svgviewer-png-output_1.png
// @description  ếch
// @author       sk
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @match        *://surviv.io/*
// @match        https://surviv.io
// @match        https://surviv.io/*
// @match        http://surviv.io/?region=na&zone=sfo
// @match        http://surviv.io/?region=na&zone=mia
// @match        http://surviv.io/?region=na&zone=nyc
// @match        http://surviv.io/?region=na&zone=chi
// @match        http://surviv.io/?region=sa&zone=sao
// @match        http://surviv.io/?region=eu&zone=fra
// @match        http://surviv.io/?region=eu&zone=waw
// @match        http://surviv.io/?region=as&zone=sgp
// @match        http://surviv.io/?region=as&zone=nrt
// @match        http://surviv.io/?region=as&zone=hkg
// @match        http://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=na&zone=sfo
// @match        https://surviv.io/?region=na&zone=mia
// @match        https://surviv.io/?region=na&zone=nyc
// @match        https://surviv.io/?region=na&zone=chi
// @match        https://surviv.io/?region=sa&zone=sao
// @match        https://surviv.io/?region=eu&zone=fra
// @match        https://surviv.io/?region=eu&zone=waw
// @match        https://surviv.io/?region=as&zone=sgp
// @match        https://surviv.io/?region=as&zone=nrt
// @match        https://surviv.io/?region=as&zone=hkg
// @match        https://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=as&zone=vnm
// @match        http://surviv2.io*
// @match        https://surviv2.io*
// @match        http://2dbattleroyale.com*
// @match        https://2dbattleroyale.com*
// @match        http://2dbattleroyale.org*
// @match        https://2dbattleroyale.org*
// @match        http://piearesquared.info*
// @match        https://piearesquared.info*
// @match        http://thecircleisclosing.com*
// @match        https://thecircleisclosing.com*
// @match        http://archimedesofsyracuse.info*
// @match        https://archimedesofsyracuse.info*
// @match        http://secantsecant.com*
// @match        https://secantsecant.com*
// @match        http://parmainitiative.com*
// @match        https://parmainitiative.com*
// @match        http://nevelskoygroup.com*
// @match        https://nevelskoygroup.com*
// @match        http://kugahi.com*
// @match        https://kugahi.com*
// @match        http://chandlertallowmd.com*
// @match        https://chandlertallowmd.com*
// @match        http://ot38.club*
// @match        https://ot38.club*
// @match        http://kugaheavyindustry.com*
// @match        https://kugaheavyindustry.com*
// @match        http://rarepotato.com*
// @match        https://rarepotato.com*
// @match        https://code.jquery.com/jquery-3.4.1.min.js
// @match        http://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        https://twitch.tv/popout/survivio/extensions/c79geyxwmp1zpas3qxbddzrtytffta/panel*
// @match        http://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// @match        https://c79geyxwmp1zpas3qxbddzrtytffta.ext-twitch.tv/c79geyxwmp1zpas3qxbddzrtytffta/1.0.2/ce940530af57d2615ac39c266fe9679d/index_twitch.html?anchor=panel&language=en&mode=viewer&state=released&platform=web&popout=true*
// ==/UserScript==

if(window.location.href.includes("stats")){
    document.getElementById("adsLeaderBoardTop").remove(); // ad
    document.getElementById("adsPlayerTop").remove(); // ad
    
    setTimeout(function blockAds(){
    if(document.getElementById("sticky-footer") == null){
    }
    else{
    document.getElementById("sticky-footer").remove(); // ad
    }
    },400);
    }
    
    else{
    document.getElementById("background").style = "filter:brightness(50%);background-image:url(https://media.discordapp.net/attachments/853850773452750850/881197780289343528/0001-6288787050_20210820_141206_0000.png?width=721&height=406);";
    
    document.getElementById("start-top-left").style = "display:none;";
    document.getElementById("start-menu").style = "display:none;";
    document.getElementById("free-gp-offer").style = "display:none;opacity:0;";
    document.getElementById("missions-name").style = "background-image:none";
    document.getElementById("missions-wrapper").style = "margin-block:155px;";
    document.getElementById("social-share-block").style = "display:none;";
    document.getElementById("pass-block").style = "background-color:rgb(0 0 0 / 20%);border-radius:0;";
    document.getElementById("start-row-header").style = "display:none;";
    document.getElementById("btn-support").style = "display:none;";
    document.getElementById("modal-body-warning").style = "background:rgb(255 255 255 / 0%);";
    
    document.getElementById("prestige-loading").style = "color:rgb(0 0 0 / 70%);";
    document.getElementById("start-row-top").style = "margin-left:250px;margin-block:200px;";
    document.getElementById("squad-boost-perc").style = "display:none;";
    document.getElementById("btn-team-leave").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    document.getElementById("boost-warning").style = "background:rgb(34 30 35);padding:5px;opacity:0.2;font-size:16px;margin-block-start:0px;display:block;";
    document.getElementById("xp-team-text").style = "display:none;";
    document.getElementById("team-menu-members").style = "margin-block:77px;";
    document.getElementById("team-menu-columns").style = "margin-block:150px;margin-inline:-100px";
    document.getElementById("invite-code-text").style = "opacity:0;";
    document.getElementById("invite-link-text").style = "opacity:0;";
    document.getElementById("team-url").style = "background:rgb(255 255 255 / 50%);border-radius:0;width:550px;margin-left:-138px;";
    document.getElementById("team-hide-url").style = "margin-inline:5000px";
    document.getElementById("team-code").style = "width:0px;font-size:0px;";
    document.getElementById("team-link-input").style = "width:550px;border-radius:0px;margin-left:-195px;color:rgb(255 255 255 / 70%);";
    document.getElementById("msg-wait-reason").style = "margin-bottom:47px;";
    
    document.getElementById("ui-spectate-video-ad-container-desktop").style = "display:none;margin-block:-5000px;opacity:0;";
    document.getElementById("ui-spectate-ad-container-desktop").style = "display:none;margin-block:-5000px;opacity:0;";
    document.getElementById("pass-buy-btn-spectate").style = "display:none;";
    document.getElementById("ui-stats-ad-container-desktop").style = "display:none;";
    
    document.getElementById("modal-customize-cat-title").style = "opacity:0;";
    document.getElementById("modal-customize-sort").style = "display:none;";
    document.getElementById("modal-customize-header").style = "border-radius:0px;background-color:rgba(0,0,0,0.08);"
    document.getElementById("modal-customize-footer").style = "border-radius:0px;background-color:rgba(0,0,0,0.08);";
    document.getElementById("modal-customize-unlocks").style = "display:none;";
    document.getElementById("button-sell-item").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    document.getElementById("modal-customize-item-sell-container").style = "background-color:rgba(0,0,0,0.08);";
    document.getElementById("modal-customize-item-header").style = "display:none;";
    document.getElementById("modal-customize-body").style = "background-color:rgba(0,0,0,0.08);";
    document.getElementById("modal-customize-list").style = "background-color:rgba(0,0,0,0);";
    
    document.getElementById("market-change-type").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    document.getElementById("market-change-rarity").style = "box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    document.getElementById("market-change-sort").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    document.getElementById("market-change-mode").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    
    document.getElementById("btn-help").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    document.getElementById("btn-news").style = "background-color:#221E23;box-shadow:none;border-bottom:2px solid #010003;border-radius:0px;";
    document.getElementById("news-block").style = "border-radius:0px;";
    
    document.getElementById("btn-game-fullscreen").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/minimize.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
    document.getElementById("btn-game-sound").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/audio-on.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
    document.getElementById("btn-game-quit").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/quit.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
    document.getElementById("btn-game-resume").style = "box-shadow:none;border-radius:0px;background:rgba(250,250,250,0.3);border-bottom:none;background-image:url(../img/gui/resume.svg);background-size:34px;background-position:4px 2px;background-repeat:no-repeat;";
    document.getElementById("btn-game-settings").style = "border-radius:0px;";
    document.getElementById("btn-game-keybinds").style = "border-radius:0px;";
    
    document.getElementById("ui-stats-contents-inner").style = "background-color:rgba(0,0,0,0);";
    document.getElementById("ui-stats-header").style = "opacity:0;";
    
    }
    
    GM_addStyle(`
    .ui-stats-ad-container{
    top:5000px;
    opacity:0;
    }
    #ui-game-tab-keybinds > .btn-keybind-restore{
    box-shadow:none;
    border-radius:0px;
    background:rgba(250,250,250,0.3);
    border-bottom:none;
    }
    .ui-keybind-container>.btn-keybind-desc{
    box-shadow:none;
    border-radius:0px;
    background:rgba(250,250,250,0.3);
    border-bottom:none;
    }
    #modal-news>.modal-content>.modal-body{
    background-color:rgba(250,250,250,0.05);
    }
    .modal-body {
    background-color:rgba(250,250,250,0.05);
    }
    .btn-keybind{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    #btn-start-fullscreen{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-start-mute{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-settings{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .market-container{
    background:rgba(0,0,0,0.08);
    }
    .market-container .market-items-list-container {
    background:rgba(0,0,0,0.08);
    }
    .market-list-item-container{
    background:rgba(0,0,0,0.08);
    }
    .market-list-item-container .market-item-info-container .market-item-stats-container .market-item-stats-text p{
    color:rgba(250,250,250,0.5);
    }
    #market-modal-sell-item .modal-content .modal-body, #market-modal-buy-item .modal-content .modal-body, #market-modal-notification .modal-content .modal-body{
    background:rgba(250,250,250,.1);
    }
    #market-modal-sell-item .modal-content .modal-body .market-modal-sell-item-container, #market-modal-buy-item .modal-content .modal-body .market-modal-sell-item-container, #market-modal-notification .modal-content .modal-body .market-modal-sell-item-container {
    background:rgba(250,250,250,.1);
    }
    .modal-footer{
    background:rgba(250,250,250,.1);
    }
    #market-modal-sell-item .modal-content .modal-body .market-modal-price-container, #market-modal-buy-item .modal-content .modal-body .market-modal-price-container, #market-modal-notification .modal-content .modal-body .market-modal-price-container{
    background:rgba(250,250,250,.1);
    background-image:none;
    }
    #market-modal-sell-item .modal-content .modal-body .market-modal-price-container .market-modal-price, #market-modal-buy-item .modal-content .modal-body .market-modal-price-container .market-modal-price, #market-modal-notification .modal-content .modal-body .market-modal-price-container .market-modal-price{
    background-image:none;
    color:white;
    }
    .btn-modal-confirm{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-modal-confirm span {
    color:#fff;
    }
    .market-list-item-container .market-item-action-container .market-item-action-btn{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-market-filter-gray{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .market-change-selection div .right-market-btn{
    background-color:#221E23;
    box-shadow:none;
    border-radius:0px;
    }
    .close-corner{
    display:none;
    }
    #iap-modal .iap-screen .iap-container .iap-limited-offers{
    background:rgba(0,0,0,0.08);
    }
    #iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack .iap-discount{
    opacity:0
    }
    #iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    #iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack .iap-lto-item-container{
    background:rgba(255,255,255,0);
    }
    #iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-title-container .iap-lto-time-left-text{
    color:rgba(255,255,255,.8);
    }
    #iap-modal .iap-screen .iap-container .iap-limited-offers .iap-lto-packs-container .iap-lto-pack {
    height:320px;
    }
    #iap-modal .iap-screen .iap-container .iap-gp .iap-gp-packs-container .iap-gp-pack{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    #iap-modal .iap-screen .iap-container .iap-gp .iap-gp-packs-container .iap-gp-pack .iap-gp-item-container{
    background:rgba(255,255,255,0);
    }
    .market-container{
    background-color:none;
    }
    
    .btn-offerwall-shop .btn-offerwall{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    #crates-modal .crates-screen .crates-container .crate-display .crate-spinner{
    display:none;
    }
    .btn-offerwall-container{
    background:none;
    box-shadow:none;
    }
    .modal-content-right{
    background:rgba(0,0,0,0.08);
    border:none;
    border-radius:0px;
    }
    .modal-customize-cat{
    background-color:rgba(0,0,0,0.08);
    box-shadow:none;
    border-radius:0px;
    }
    .modal-customize-cat-connect-selected{
    opacity:0;
    }
    ::-webkit-scrollbar{
    display:none;
    }
    ::-webkit-scrollbar-thumb{
    border-radius:0px;
    box-shadow:none;
    }
    ::-webkit-scrollbar-track{
    border-radius:0px;
    box-shadow:none;
    }
    
    .modal-content-shadow{
    box-shadow:10px 10px 8px 0 rgb(0 0 0 / 0%);
    }
    
    #modal-customize-close span.close-corner{
    display:none;
    }
    .modal-account>.modal-content>.modal-footer-name{
    opacity:0.8;
    border-radius:0px;
    }
    .modal-account>.modal-content>.modal-body-name{
    opacity:0.8;
    border-radius:0px;
    }
    .modal-account>.modal-content>.modal-header-name{
    opacity:0.8;
    border-radius:0px;
    }
    .modal-account>.modal-content .close-corner{
    display:none;
    }
    .modal-account>.modal-content #modal-account-name-title{
    text-align:center;
    }
    #modal-account-name-change .player-name-input{
    border-radius:0px;
    }
    .modal-account>.modal-content>.modal-header-reset-stats, .modal-account>.modal-content .modal-header-delete{
    opacity:0.8;
    border-radius:0;
    }
    .player-name-input{
    background-color:rgb(255 255 255 / 50%);
    border-radius:0;
    color:rgb(0 0 0 / 70%);
    }
    .modal-account>.modal-content>.modal-footer-reset-stats, .modal-account>.modal-content .modal-footer-delete {
    opacity:0.8;
    border-radius:0;
    }
    .modal-account>.modal-content>.modal-footer>.finish{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .modal-header{
    opacity:0;
    }
    #modal-customize-header {
    opacity:1;
    }
    
    
    .trainee-block {
    display:none;
    }
    .btn-account-turq{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-account-grey{
    background-color:#3F3841;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .account-buttons{
    background:rgba(0,0,0,0.08);
    }
    .account-details-link-out{
    background-image:none;
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .server-select{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .ad-block-leaderboard-bottom{
    display:none;
    }
    .ad-block-med-rect{
    display:none;
    }
    .ad-block-left-bottom{
    display:none;
    }
    .index-offer-time-left-text{
    opacity:0;
    }
    .btn-open-iap{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .animated-loadout>.character-container{
    display:none;
    }
    .btn-login-facebook{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-login-facebook>.login-button-name>.icon{
    background-image:none;
    }
    .login-button-name>.icon::after{
    display:none;
    }
    .login-button-name{
    margin-left:0;
    text-shadow:none;
    }
    .btn-login-google{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-login-google>.login-button-name>.icon{
    display:none;
    }
    .btn-login-twitch{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-login-twitch>.login-button-name>.icon{
    display:none;
    }
    .btn-login-discord{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-login-discord>.login-button-name>.icon{
    display:none;
    }
    .btn-login-apple{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-login-apple>.login-button-name>.icon{
    display:none;
    }
    .btn-login-steam{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-login-steam>.login-button-name>.icon{
    display:none;
    }
    .btn-login-linked{
    background-size:20px;
    background-position-x:50%;
    }
    .notLogged{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .island-text p{
    display:none;
    
    }
    .menu-block{
    background-color:rgba(0,0,0,0);
    }
    .account-alert:before{
    display:none;
    }
    .account-alert:after{
    display:none;
    }
    .animated-loadout .btn-prestige p span{
    color:rgb(0 0 0 / 70%)
    }
    .animated-loadout .btn-green, .animated-loadout .btn-prestige{
    width:56px;
    
    }
    .animated-loadout .btn-prestige{
    background:rgb(255 255 255 / 50%);
    border-radius:0;
    width:340px;
    margin-bottom:-55px;
    margin-right:95px;
    }
    .btn-green{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-prestige{
    margin-bottom:100px;
    }
    .animated-loadout .btns-container{
    margin-top:140px;
    }
    .animated-loadout .user-new-prestige{
    opacity:0;
    }
    .animated-loadout .btn-green p, .animated-loadout .btn-prestige p{
    font-size:0;
    margin-top:27.5px;
    letter-spacing:7.5px;
    }
    .animated-loadout #prestige-loadin {
    margin-top:12.5px;
    }
    .btn-green.btn-darken.menu-option.account-loadout-link{
    background-image:url("img/gui/emote.svg");
    background-repeat:no-repeat;
    background-size:50px;
    background-position-x:5px;
    background-position-y:2px;
    background-color:#FF000000;
    box-shadow:none;
    border-bottom:none;
    border-radius:0;
    }
    .btn-battle-container {
    background-color:none
    box-shadow:none;
    border-radius:0px;
    }
    .btn-battle{
    -webkit-animation-name:none;
    }
    .btn-team-option{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .account-loading-container{
    display:none;
    }
    .pass-quest-xp{
    font-size:16px;
    }
    .btn-change-mode-selection div .right-play-btn{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-change-type-selection div .right-play-btn{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    }
    .btn-change-type-selection{
    max-height:500px;
    }
    .btn-change-mode-selection {
    max-height:500px;
    }
    .xp-boost-bar-container{
    display:none;
    }
    .menu-team-autofill-option{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    height:45px;
    }
    .btn-team-fill{
    background:#0000;
    }
    .team-menu-member{
    display:block;
    height:0px;
    background:rgb(255 255 255 / 0%);
    vertical-align:none;
    }
    .member-boost-value {
    display:none;
    }
    .member-name-placeholder {
    display:none;
    }
    .copy-toast{
    font-size:12px;
    color:rgb(255 255 255 / 50%);
    }
    #team-desc-text span{
    color:rgb(0 0 0 / 70%);
    }
    .copy-item{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    width:173px;
    }
    .hide-item{
    display:none;
    }
    .hide-item btn-darken{
    display:none;
    }
    #team-code-text{
    margin-block:-55px;
    }
    #btn-team-mobile-link-join{
    margin-left:14px;
    }
    .name-self{
    color:rgba(255, 255, 255, 0.7);
    background:rgba(255,255,255,.2);
    }
    #pass-block.stimfield-bonus{
    border:5px solid rgb(255 255 255 / 50%);
    }
    .pass-stimfield-container {
    bottom:-52px;
    background:rgb(255 255 255 / 50%);
    }
    .btn-mode-desert{
    box-shadow:inset 0 -2px #ffffff00!important;
    }
    .team-menu-member>.icon-kick {
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    width:173px;
    height:65px;
    margin-inline:0px;
    margin-block:-90px;
    background-position:center;
    }
    .team-menu-member>.icon-leader{
    background-color:#221E23;
    box-shadow:none;
    border-bottom:2px solid #010003;
    border-radius:0px;
    width:173px;
    height:65px;
    margin-inline:0px;
    margin-block:-90px;
    background-position:center;
    background-size:40px;
    }
    .name{
    margin-block:-196px;
    border-radius:0px;
    }
    .team-menu-member>.icon{
    
    }
    .team-menu-member{
    display:inline-table;
    }
    .gwd-page-container{
    display:none;
    `);