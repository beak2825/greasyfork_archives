// ==UserScript==
// @name         Roblox Robux Visual Changer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Visually change Robux amount
// @author       NOT_FIND
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531988/Roblox%20Robux%20Visual%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/531988/Roblox%20Robux%20Visual%20Changer.meta.js
// ==/UserScript==

function abbreviateNumber(number) {
    const abbreviations = ['', 'K', 'M', 'B', 'T', 'QD', 'QN'];
    let tier = Math.floor(Math.log10(Math.abs(number)) / 3);
    if(tier > 6) tier = 6;
    if(tier <= 0) return number;
    
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;
    return Math.floor(scaled) + abbreviations[tier] + '+';
}

window.addEventListener('keydown', function(event) {
    if (event.code === 'Insert') {
        const amount = prompt('Robux Amount:');
        if (amount && !isNaN(amount)) {
            localStorage.setItem('fakeRobux', amount);
            updateRobux();
        }
    }
});

function updateRobux() {
    const savedAmount = localStorage.getItem('fakeRobux');
    if (savedAmount) {
        const robuxElement = document.getElementById('nav-robux-amount');
        if (robuxElement) {
            robuxElement.textContent = abbreviateNumber(parseInt(savedAmount));
        }
    }
}

const observer = new MutationObserver(updateRobux);
observer.observe(document.body, {
    childList: true,
    subtree: true
});

updateRobux();