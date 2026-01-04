// ==UserScript==
// @name         Surviv.io XClient (BETA)
// @namespace    https://greasyfork.org/en/users/198860-zyenith
// @version      1.0.0
// @description  Miscellaneous Surviv.io tweaks to make the game better!
// @author       zyenith
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://ot38.club/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://kugaheavyindustry.com/*
// @match        *://chandlertallowmd.com/*
// @grant        none
// @antifeature    Tracking, for compatibility info
// @require        https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @downloadURL https://update.greasyfork.org/scripts/457024/Survivio%20XClient%20%28BETA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457024/Survivio%20XClient%20%28BETA%29.meta.js
// ==/UserScript==

const healthContainer = document.querySelector('#ui-health-container');

// Create health element
const health = document.createElement('span');
health.style.cssText = `
    display: block;
    position: fixed;
    z-index: 2;
    margin: 6px 0 0 0;
    right: 15px;
    mix-blend-mode: difference;
    font-weight: bold;
    font-size: large;
  `;
healthContainer.appendChild(health);

// Create adr element
const adr = document.createElement('span');
adr.style.cssText = `
    display: block;
    position: fixed;
    z-index: 2;
    margin: 6px 0 0 0;
    left: 15px;
    mix-blend-mode: difference;
    font-weight: bold;
    font-size: large;
  `;
healthContainer.appendChild(adr);

setInterval(function() {
    // Update health
    const hp = document.getElementById('ui-health-actual').style.width.slice(0, -1);
    health.innerHTML = Math.round(hp);

    // Calculate and update adr
    const boost0 = document.getElementById('ui-boost-counter-0').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const boost1 = document.getElementById('ui-boost-counter-1').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const boost2 = document.getElementById('ui-boost-counter-2').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const boost3 = document.getElementById('ui-boost-counter-3').querySelector('.ui-bar-inner').style.width.slice(0, -1);
    const adr0 = boost0 * 25 / 100 + boost1 * 25 / 100 + boost2 * 37.5 / 100 + boost3 * 12.5 / 100;
    adr.innerHTML = Math.round(adr0);
});
