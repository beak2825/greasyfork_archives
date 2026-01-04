// ==UserScript==
// @name         IdlePixel Upgrade
// @namespace    com.Ethan.idlepixelhacker
// @version      2.9.5
// @description  Upgrade the Game...
// @author       Ethan
// @license      MIT
// @match        *://idle-pixel.com/login/*
// @match        *://idle-pixel.com/login/play*
// @match        *://idle-pixel.com/hiscores/teams*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482132/IdlePixel%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/482132/IdlePixel%20Upgrade.meta.js
// ==/UserScript==

(function() {
    //Setup
    var skin = ''; // skin selection oly option in dev claire
    var team = ''; // Team name highlighter
    //code
    function startup() {
        quickfight();
        showOther();
        setInterval(replaceImageURLs, 10);
        setInterval(highlightTeam, 10);
    }
    function replaceImageURLs() {
        var imgs = document.querySelectorAll('img');
        var replacements = {};

        if (skin === 'claire') {
            replacements = {
                'https://cdn.idle-pixel.com/images/hero_head_none.png': 'https://glistening-clafoutis-48168f.netlify.app/claire_hero_head_none.png',
                'https://cdn.idle-pixel.com/images/hero_body_none.png': 'https://glistening-clafoutis-48168f.netlify.app/claire_hero_body_none.png',
                'https://cdn.idle-pixel.com/images/hero_gloves_none.png': 'https://glistening-clafoutis-48168f.netlify.app/claire_hero_body_none.png',
                'https://cdn.idle-pixel.com/images/hero_legs_none.png': 'https://glistening-clafoutis-48168f.netlify.app/claire_hero_legs_none.png',
                'https://cdn.idle-pixel.com/images/hero_boots_none.png': 'https://glistening-clafoutis-48168f.netlify.app/claire_hero_boots_none.png',
            };
        }

        imgs.forEach(function(img) {
            var newSrc = replacements[img.src];
            if (newSrc) {
                img.src = newSrc;
            }
        });
    }
    function highlightTeam() {
        var rows = document.querySelectorAll('tr.tr-hiscore-player');
        rows.forEach(function(row) {
            if (row.textContent.includes(team)) {
                row.style.backgroundColor = '#00F0D4';
            }
        });
    }
    function quickfight() {
        var elementIds = [
            "game-panel-combat-select-area-panels-quickfight-field",
            "game-panel-combat-select-area-panels-quickfight-forest",
            "game-panel-combat-select-area-panels-quickfight-cave",
            "game-panel-combat-select-area-panels-quickfight-volcano",
            "game-panel-combat-select-area-panels-quickfight-northern_field",
            "game-panel-combat-select-area-panels-quickfight-mansion",
            "game-panel-combat-select-area-panels-quickfight-beach",
            "game-panel-combat-select-area-panels-quickfight-blood_field",
            "game-panel-combat-select-area-panels-quickfight-blood_forest",
            "game-panel-combat-select-area-panels-quickfight-blood_cave",
            "game-panel-combat-select-area-panels-quickfight-blood_volcano",
            "game-panel-combat-select-area-panels-quickfight-beach",
        ];

        elementIds.forEach(function(id) {
            var element = document.getElementById(id);
            if (element) {
                element.style.display = '';
            }
        });
    }
    function showOther() {
        // Combat
        var combatElement = document.getElementById("select-area-combat-faradox-castle-unlock");
        if (combatElement) {
            combatElement.style.display = "block";
        }

        // Gathering
        var gatheringElement = document.getElementById("gathering-box-castle");
        if (gatheringElement) {
            gatheringElement.style.display = "block";
        }

        const questBoxes = document.querySelectorAll('.quest-box');
        questBoxes.forEach((div) => {
            if (div.dataset.previousQuest) {
                delete div.dataset.previousQuest;
            }
        });
    }
    startup();
})();
