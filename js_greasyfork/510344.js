// ==UserScript==
// @name         BetterBlox
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Filter unwanted roblox games and harmful content
// @author       Damc (Contributers: @spring67)
// @match        *://*.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510344/BetterBlox.user.js
// @updateURL https://update.greasyfork.org/scripts/510344/BetterBlox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const badStrings = [
        'anime', 'skibidi', 'hero', 'mighty omega', 'time of ninja',
        'dress to imp', 'blox fruits', 'brookhaven', 'battleground', 'neko',
        'toilet', 'wukong', 'fat', 'chunky', 'together', 'rp', 'wild horse',
        'mermaid', 'shindo', 'bathroom', 'skibi', 'bathtub', 'baddi', 'furr',
        'pop it', 'asmr', 'running head', 'survive the', 'banban', 'العرب',
        'rng', 'school', 'royal high', 'gymn', 'foblox', 'ultimate tower',
        'dragon', 'shoot and eat', 'dandy', 'salon', 'strideway', 'lgbt',
        'lady athletics', 'love sick', 'scp', 'creatures of son', 'shinobi', 'death row 💀', 'budokai',
        'to save princess', 'catwalk', 'hanami', 'kind legacy', 'naruto', 'jujutsu', '17+', '18+', '🔞', 'all star',
        'aba'
    ];
    const allowed = ['lucky blocks', 'emergency'];

    function filterContent() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const elementText = element.textContent.toLowerCase();
            if (badStrings.some(badString => elementText.includes(badString))) {
                if (!allowed.some(allowedString => elementText.includes(allowedString))) {
                    const parentElement = element.closest('.game-card, .game-item, .game-slider');
                    const containerMain = document.querySelector("#container-main > div.content");
                    if (parentElement &&
                        !parentElement.matches('#place-list, #place-list *') &&
                        (parentElement.closest('#container-main > div.content') || containerMain.contains(element))) {
                        console.log(`Bad content removed: "${elementText.trim()}"`);
                        parentElement.remove();
                    }
                }
            }
        });

        const placeListDivs = document.querySelectorAll('#place-list > div');
        placeListDivs.forEach(div => {
            const divText = div.textContent.toLowerCase();
            if (badStrings.some(badString => divText.includes(badString))) {
                if (!allowed.some(allowedString => divText.includes(allowedString))) {
                    console.log(`Bad game removed from place list: "${divText.trim()}"`);
                    div.remove();
                }
            }
        });
    }

    const observer = new MutationObserver(filterContent);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    filterContent();
})();