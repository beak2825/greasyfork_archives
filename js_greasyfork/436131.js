// ==UserScript==
// @name         A Mod
// @namespace    https://ytiridium77.github.io/
// @version      2.6
// @description  A small decoration features for surviv.io
// @author       『Philipp』#1899
// @license MIT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        GM_xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436131/A%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/436131/A%20Mod.meta.js
// ==/UserScript==


(function(){
    'use strict';

    var o = document.createElement("a");
	o.setAttribute("id","my_Heart");
    o.style.fontSize = "25px";
	o.style.color = "#4287f5";
    o.style.display = "block";
    document.getElementById("ui-boost-counter").parentNode.appendChild(o);
    var reference = document.getElementById('ui-boost-counter');
    reference.parentNode.insertBefore(o, reference);

	setInterval(function(){
		o.innerHTML = "HP: " + Math.round(document.getElementById("ui-health-actual").style.width.slice(0, -1))
	}, 500);

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
    let boostCounter = document.querySelector(`#ui-boost-counter`);
    let botWrapper = document.createElement(`div`);
    botWrapper.id = `numWrapper`;
    document.querySelector(`#ui-bottom-center-0`).insertBefore(botWrapper, boostCounter);

const createElements = () => {
let adWrapper = document.createElement(`div`);
    adWrapper.classList.add(`box-container`);
    adWrapper.id = `btWrapper`;

    let adTxt = document.createElement(`span`);
    adTxt.style.fontSize = "25px";
	adTxt.style.color = "#4287f5";
    adTxt.style.display = "block";
    setInterval(() => (adTxt.innerHTML = `AD: ${getBoost()}`));
    adWrapper.appendChild(adTxt);
    botWrapper.appendChild(adWrapper);
}
createElements();

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
                    border += '#000000';
                    background += '#5e5e5e';
                    break;
                    // <-----Karmabit----->
                case "Karambit":
                    border +='#76787A';
                    background += '#5e5e5e';
                    break;
                case "Karambit Rugged":
                    border +='#16163B';
                    background += '#5e5e5e';
                    break;
                case "Karmabit Prismatic":
                    border +='#34D682';
                    background += '#5e5e5e';
                    break;
                case "Karmabit Drowned":
                    border +='#0CBCCC';
                    background += '#5e5e5e';
                    break;
                    // <-----Bayonet----->
                case "Bayonet":
                    border +='#76787A';
                    background += '#5e5e5e';
                    break;
                case "Bayonet Rugged":
                    border +='#76787A';
                    background += '#5e5e5e';
                    break;
                case "Bayonet Woodland":
                    border +='#5AA415';
                    background += '#5e5e5e';
                    break;
                    // <-----Huntsman----->
                case "Huntsman":
                    border +='#76787A';
                    background += '#5e5e5e';
                    break;
                case "Huntsman Rugged":
                    border +='#A0441E';
                    background += '#5e5e5e';
                    break;
                case "Huntsman Burnished":
                    border +='#DACF76';
                    background += '#5e5e5e';
                    break;
                    // <-----Bowie----->
                case "Bowie":
                    border +='#76787A';
                    background += '#5e5e5e';
                    break;
                case "Bowie Vintage":
                    border +='#B6B6B6';
                    background += '#5e5e5e';
                    break;
                case "Bowie Frontier":
                    border +='#BA4B2E';
                    background += '#5e5e5e';
                    break;
                    // <-----Axe----->
                case "Wood Axe":
                    border +='#95500E';
                    background += '#5e5e5e';
                    break;
                case "Blood Axe":
                    border +='#568A09';
                    background += '#5e5e5e';
                    break;
                case "Fire Axe":
                    border +='#B40000';
                    background += '#5e5e5e';
                    break;
                    // <-----Katana----->
                case "Katana":
                    border +='#858585';
                    background += '#5e5e5e';
                    break;
                case "Katana Rusted":
                    border +='#875F37';
                    background += '#5e5e5e';
                    break;
                case "Katana Orchid":
                    border +='#C189CB';
                    background += '#5e5e5e';
                    break;
                    // <-----Naginata----->
                case 'Naginata':
                    border += '#3C3C3C';
                    background += '#5e5e5e';
                    break;
                    // <-----Machetes----->
                case "Machete": //Machete Taiga
                    border +='#685F40';
                    background += '#5e5e5e';
                    break;
                case "Kukri": //Tallow's Kukri
                    border +='#685F40';
                    background += '#5e5e5e';
                    break;
                    // <-----Hammers----->
                case "Stone Hammer":
                    border +='#585A5C';
                    background += '#5e5e5e';
                    break;
                case "Sledgehammer":
                    border +='#585A5C';
                    background += '#5e5e5e';
                    break;
                    // <-----Hook----->
                case "Hook":
                    border +='#888A8B';
                    background += '#5e5e5e';
                    break;
                    // <-----Pan----->
                case "Pan":
                    border +='#484848';
                    background += '#5e5e5e';
                    break;
                    // <-----Knuckles----->
                case "Knuckles":
                    border +='#63452D';
                    background += '#5e5e5e';
                    break;
                case "Knuckles Rusted":
                    border +='#63452D';
                    background += '#5e5e5e';
                    break;
                case "Knuckles Heroic":
                    border +='#90700D';
                    background += '#5e5e5e';
                    break;
                    // <-----Saw----->
                case "Bonesaw": //Bonesaw Rusted
                    border += '#461904';
                    background += '#5e5e5e';
                    break;
                    // <-----Cobalt----->
                case "Spade": //Trench Spade
                    border +='#DACF59';
                    background += '#5e5e5e';
                    break;
                case "Crowbar": //Scouting Crowbar
                    border +='#ACD563';
                    background += '#5e5e5e';
                    break;
                case "Kukri": //Marksman's Recurve
                    border +='#8DCEDB';
                    background += '#5e5e5e';
                    break;
                case "Bonesaw": //The Separator
                    border +='#DC79DC';
                    background += '#5e5e5e';
                    break;
                case "Katana": //Hakai no Katana
                    border +='#C76A67';
                    background += '#5e5e5e';
                    break;
                case "War Hammer": //Panzerhammer
                    border +='#EAB963';
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
                    border += '#FFAE00';
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
                    border += '#FF0000';
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
                    border += '#039E00';
                    background += '#5e5e5e';
                    break;
                    // <---------- Purple: .45 ACP ----------> \\
                case 'M1911':
                case 'M1A1':
                case 'Mk45G':
                case 'Model 94':
                case 'Peacemaker':
                case 'Vector 45':
                    border += '#7900FF';
                    background += '#5e5e5e';
                    break;
                    // <---------- FLARE ----------> \\
                case 'Flare Gun':
                    border += '#D44600';
                    background += '#5e5e5e';
                    break;
                    // <---------- .50 AE ----------> \\
                case 'DEagle 50':
                    border += '#292929';
                    background += '#5e5e5e';
                    break;
                    // <---------- .308 Subsonic ----------> \\
                case 'AWM-S':
                case 'Mk 20 SSR':
                    border += '#465000';
                    background += '#5e5e5e';
                    break;
                    // <---------- Potato ----------> \\
                case 'Potato Cannon':
                case 'Spud Gun':
                    border += '#935924';
                    background += '#5e5e5e';
                    break;
                    // <---------- CURSED: 9 mm ----------> \\
                case 'M9 Cursed':
                    border += '#323232';
                    background += '#5e5e5e';
                    break;
                    // <---------- Bugle ----------> \\
                case 'Bugle':
                    border += '#F2BC21';
                    background += '#5e5e5e';
                    break;
                    // <---------- Trowables ----------> \\
                case 'Frag':
                    border += '#837516';
                    background += '#5e5e5e';
                    break;
                case 'MIRV':
                    border += '#940000';
                    background += '#5e5e5e';
                    break;
                case 'Potato':
                    border += '#958359';
                    background += '#5e5e5e';
                    break;
                case 'Smoke':
                    border += '#DDDDDD';
                    background += '#5e5e5e';
                    break;
                case 'Snowball':
                    border += '#74D4F8';
                    background += '#5e5e5e';
                    break;
                case 'Strobe':
                    border += '#FFF205';
                    background += '#5e5e5e';
                    break;
                case 'Iron Bomb':
                    border += '#00FF00';
                    background += '#5e5e5e';
                    break;
            }
            // <---------- GUN END ----------> \\
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }


var el = document.createElement("p");
var el2 = document.getElementsByClassName("ui-team-member ui-bg-standard")[0];
el2.parentNode.appendChild(el);
el2.parentNode.insertBefore(el,el2);

const getPing = () => {

let ping = new Date;

    let request = new XMLHttpRequest();
    request.open(`GET`, window.location.href, true);

    request.onload = (() => {
        el.innerHTML = ` Ping: ${new Date - ping}`;
        setTimeout(getPing, 500);
    });
    request.send();
};

getPing();
})();