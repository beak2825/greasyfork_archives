// ==UserScript==
// @name         Forge QOL
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Makes downloading minecraft mods on curseforge less painful.
// @author       angxxl
// @match        https://www.curseforge.com/*
// @match        https://legacy.curseforge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495897/Forge%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/495897/Forge%20QOL.meta.js
// ==/UserScript==



function updateCurseForgeLinks() {
    document.querySelectorAll('a[href*="https://www.curseforge.com/minecraft/mc-mods/"][href*="/files/"], a[href*="https://legacy.curseforge.com/minecraft/mc-mods/"][href*="/files/"]').forEach(link => {
        const urlParts = link.href.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (!isNaN(lastPart)) { // Check if the last part is a number
            link.href = link.href.replace('/files/', '/download/');
        }
    });
}


function redirectCurseForgePage() {
    const urlParts = window.location.href.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if ((window.location.href.includes("https://www.curseforge.com/minecraft/mc-mods/") || window.location.href.includes("https://legacy.curseforge.com/minecraft/mc-mods/")) && window.location.href.includes("/files/") && !isNaN(lastPart)) {
        window.location.href = window.location.href.replace('/files/', '/download/');
    }
}


function updateAndRedirectLegacyCurseForgeLinks() {
    document.querySelectorAll('a[href*="https://legacy.curseforge.com/"]').forEach(link => {
        link.href = link.href.replace('https://legacy.curseforge.com/', 'https://www.curseforge.com/');
    });

    if (window.location.href.includes("https://legacy.curseforge.com/")) {
        window.location.href = window.location.href.replace('https://legacy.curseforge.com/', 'https://www.curseforge.com/');
    }
}

function speedUpTime(factor) {
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;

    window.setInterval = function(callback, delay, ...args) {
        return originalSetInterval(callback, delay / factor, ...args);
    };

    window.setTimeout = function(callback, delay, ...args) {
        return originalSetTimeout(callback, delay / factor, ...args);
    };
}

function checkPagePattern() {
    const urlPattern = /^https:\/\/www\.curseforge\.com\/[^\/]+\/[^\/]+\/[^\/]+\/download\/[^\/]+$/;
    return urlPattern.test(window.location.href);
}

if (checkPagePattern()) {
    speedUpTime(40);
}

updateCurseForgeLinks();
redirectCurseForgePage();
updateAndRedirectLegacyCurseForgeLinks();

setInterval(() => {
    updateCurseForgeLinks();
    redirectCurseForgePage();
    updateAndRedirectLegacyCurseForgeLinks();
}, 700);
