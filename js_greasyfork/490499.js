// ==UserScript==
// @name         Hover Wiki
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tired of opening the wiki to see damage values? This script shows item stats on hover, like damage, etc.
// @author       Runonstof
// @match        *.deadfrontier.com/onlinezombiemmo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490499/Hover%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/490499/Hover%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';


    /******************************************************
     * Credits:
     *
     * - To Rebekah (TectonicStupidity) for the calculation of hits per second
     ******************************************************/


    /******************************************************
     * Constants
     ******************************************************/


    if (!unsafeWindow.hasOwnProperty("globalData")) {
        return;
    }
    const weaponData = unsafeWindow.globalData;

    const weaponAttributes = [
        'name',
        'code',
        'type',
        'ammo_type',
        'shot_time',
        'shots_fired',
        'spread',
        'shot_size',
        'calliber_type',
        'bullet_capacity',
        'reload_time',
        'turn_speed_multi',
        'knockback_multi',
        'melee',
        'chainsaw',
        'explosive',
        'flamethrower',
        'critical',
        'spin_delay',
        'accuracy_mod',
        'str_req',
        'pro_req',
        'cost',
        'shop_level',
        'avatar_img',
        '3dtype',
        'dismantle',
    ];

    // https://deadfrontier.fandom.com/wiki/Stats_and_Levels#Critical_Hit
    const CRIT_MULTIPLIER = 5;

    const CACHE = {
        STATS: {},
    };

    const infoBox = unsafeWindow.document.getElementById('infoBox');

    /******************************************************
     * Utility functions
     ******************************************************/

    function getDamageStats(itemId) {
        if (CACHE.STATS.hasOwnProperty(itemId)) {
            return CACHE.STATS[itemId];
        }

        const stats = {
            dph: 0,
            hits: 0, // amount of hits done in a single action/shot
            dpah: 0, // damage per all hits
            cdpah: 0, // crit damage per all hits
            // spread: 0,
            hps: 0, // hits per second
            hs: 0, // hitspeed
            dps: 0,
        };

        if (!weaponData.hasOwnProperty(itemId)) {
            return false;
        }

        const itemData = unsafeWindow.globalData[itemId];
        const weapData = weaponData[itemId];

        if (itemData.itemtype != 'weapon') {
            return false;
        }

        // stats.spread = Math.max(parseInt(itemData.spread), 1);
        stats.hits = Math.max(parseInt(itemData.shots_fired), 1);

        if (itemData.shot_time) {
            // Credits to Rebekah (TectonicStupidity) for this calculation
            stats.hps = Math.round(60/(parseFloat(weapData.shot_time) + 2) * 1000) / 1000;
        }

        stats.dph = parseFloat(itemData.calliber_type) + 1;

        if (itemData.selective_fire_type == 'burst') {
            stats.hits *= parseFloat(itemData.selective_fire_amount);
            stats.hps *= parseFloat(itemData.selective_fire_amount);
            stats.dph /= Math.max(parseInt(itemData.selective_fire_amount), 1);
        }

        stats.dps = stats.dph * stats.hits * stats.hps;
        stats.dpah = stats.dph * stats.hits;
        stats.hs = 1 / stats.hps;

        if (itemData.critical > 0) {
            stats.cdpah = stats.dpah * CRIT_MULTIPLIER;
        }

        if (itemData.selective_fire_type == 'burst') {
            stats.dps /= Math.max(parseInt(itemData.selective_fire_amount), 1);
            stats.cdpah /= Math.max(parseInt(itemData.selective_fire_amount), 1);
        }

        return CACHE.STATS[itemId] = stats;
    }


    // For other scripts to use
    unsafeWindow.hoverWikiGetDamageStats = getDamageStats;


    /******************************************************
     * Function overrides
     ******************************************************/

    var origInfoCard = unsafeWindow.infoCard || null;
    if (origInfoCard) {
        inventoryHolder.removeEventListener("mousemove", origInfoCard, false);


        unsafeWindow.infoCard = function (e, override) {
            // Call the original infoCard function
            origInfoCard(e, override);

            if(active || pageLock || !allowedInfoCard(e.target) || override) {
                return;
            }

            let target;
            if(e.target.parentNode.classList.contains("fakeItem"))
            {
                target = e.target.parentNode;
            } else
            {
                target = e.target;
            }

            if (!target.classList.contains('item') && !target.classList.contains('fakeItem')) {
                return;
            }

            const item = target.dataset.type?.split('_')[0] || null;

            if (!item) {
                return;
            }

            //Remove previous stats info
            let elems = document.getElementsByClassName("statsInfoContainer");
            for(let i = elems.length - 1; i >= 0; i--) {
                if (elems[i].dataset.itemId === item) {
                    // No re-render needed
                    return;
                }
                elems[i].parentNode.removeChild(elems[i]);
            }

            const itemStats = getDamageStats(item);

            if (itemStats === false) {
                return;
            }

            const allItemStats = Array.from(infoBox.querySelectorAll('.itemData') || []);

            let insertAfter = allItemStats.find(el => el.textContent.match(/ Skill Required$/))
                || allItemStats.find(el => el.textContent.match(/ Chance$/))
                || allItemStats.find(el => el.textContent.match(/ Speed$/));

            if (!insertAfter) {
                return;
            }

            const infoContainer = document.createElement('div');
            infoContainer.classList.add('statsInfoContainer');
            infoContainer.dataset.itemId = item;

            const critText = itemStats.cdpah ? ` <span style="font-size: 10px">(<span style="border-bottom: 1px dotted #fff">${itemStats.cdpah} crit</span>)</span>` : '';

            infoContainer.innerHTML = `
            <div class="itemData">Damage: ${itemStats.dph}${ itemStats.hits > 1 ? ` x ${itemStats.hits} = ${itemStats.dpah}` : '' }${critText}</div>
            <div class="itemData">Hitspeed: ${itemStats.hs.toFixed(2)}s</div>
            <div class="itemData">Damage/sec: ${itemStats.dps.toFixed(2)}</div>
            `;

            insertAfter.parentNode.insertBefore(infoContainer, insertAfter.nextSibling);
        }.bind(unsafeWindow);

        inventoryHolder.addEventListener("mousemove", unsafeWindow.infoCard, false);
    }

})();