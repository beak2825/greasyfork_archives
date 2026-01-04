// ==UserScript==
// @name         CSGO500 Rain Clicker (500Casino, CSGO500, ...more)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  CSGO500 Rain Clicker
// @author       UwU Onii Chan OwO
// @match        *://500.casino/*
// @match        *://500casino.io/*
// @match        *://csgo500.com/*
// @match        *://500PLAY.com/*
// @match        *://csgo500pl.com/*
// @match        *://csgo500tr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgo500.com
// @grant        none
// @license      Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// @downloadURL https://update.greasyfork.org/scripts/449584/CSGO500%20Rain%20Clicker%20%28500Casino%2C%20CSGO500%2C%20more%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449584/CSGO500%20Rain%20Clicker%20%28500Casino%2C%20CSGO500%2C%20more%29.meta.js
// ==/UserScript==

// Please note that this script is easy to get fixed cuz legit its just clicking when the rain appears. I might have make an advanced one when they update it.

window.addEventListener('load',() => {
console.log('nico');
var clicked = 0;
setInterval(function() {
if(document.getElementsByClassName('rain-box-container')[0].getElementsByClassName('base-button button is-pink')[0]) {
    if(clicked === 0) {
console.log('Its raining on 500');
    document.getElementsByClassName('rain-box-container')[0].getElementsByClassName('base-button button is-pink')[0].click();
        console.log('Clicked');
    clicked = 1;
    }
} else {
clicked = 0;
};
}, 5000);
});