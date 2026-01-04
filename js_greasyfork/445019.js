// ==UserScript==
// @name         Surviv.io | Health and Adrenaline counter
// @namespace    https://github.com/Samer-Kizi
// @version      1.1
// @description  apple apple apple
// @author       sk
// @license      MIT
// @match        https://surviv.io/*
// @match        https://surviv2.io/*
// @match        https://2dbattleroyale.com/*
// @match        https://2dbattleroyale.org/*
// @match        https://piearesquared.info/*
// @match        https://thecircleisclosing.com/*
// @match        https://secantsecant.com/*
// @match        https://parmainitiative.com/*
// @match        https://ot38.club/*
// @match        https://drchandlertallow.com/*
// @match        https://rarepotato.com/*
// @match        https://archimedesofsyracuse.info/*
// @match        https://nevelskoygroup.com/*
// @match        https://kugahi.com/*
// @match        https://kugaheavyindustry.com/*
// @match        https://chandlertallowmd.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/445019/Survivio%20%7C%20Health%20and%20Adrenaline%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/445019/Survivio%20%7C%20Health%20and%20Adrenaline%20counter.meta.js
// ==/UserScript==

// I stole health counter from Michal2SAB lol

(function() {
    'use strict';
    var lastHP = 0
    var health = document.createElement("span");
    health.style = "display:block;position:fixed;z-index: 2;margin:6px 0 0 0;right: 15px;mix-blend-mode: difference;font-weight: bold;font-size:large;";
    document.querySelector("#ui-health-container").appendChild(health);

    var adr = document.createElement("span");
    adr.style = "display:block;position:fixed;z-index: 2;margin:6px 0 0 0;left: 15px;mix-blend-mode: difference;font-weight: bold;font-size:large;";
    document.querySelector("#ui-health-container").appendChild(adr);

    setInterval(function(){
        var hp = document.getElementById("ui-health-actual").style.width.slice(0,-1)
        if(lastHP !== hp){
            lastHP = hp
            health.innerHTML = Math.round(hp)
        }
        var boost0 = document.getElementById("ui-boost-counter-0").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            boost1 = document.getElementById("ui-boost-counter-1").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            boost2 = document.getElementById("ui-boost-counter-2").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            boost3 = document.getElementById("ui-boost-counter-3").querySelector(".ui-bar-inner").style.width.slice(0,-1),
            adr0 = boost0*25/100 + boost1*25/100 + boost2*37.5/100 + boost3*12.5/100
        adr.innerHTML = Math.round(adr0)
    })
})();