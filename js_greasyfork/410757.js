// ==UserScript==
// @name         DH3 Real Max Global Level
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Show the actual global level where each skill is maxed out at level 100
// @author       Lasse Brustad
// @match        https://dh3.diamondhunt.co/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410757/DH3%20Real%20Max%20Global%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/410757/DH3%20Real%20Max%20Global%20Level.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';

    // skills
    const skills = {
        combat: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        magic: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        mining: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        crafting: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        woodcutting: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        farming: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        brewing: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        fishing: {
            unlocked: false,
            xp: 0,
            lvl: 0
        },
        cooking: {
            unlocked: false,
            xp: 0,
            lvl: 0
        }
    };

    function getActualLvl(skill, xp) {
        if (skills[skill].unlocked) {
            const lvl = window.getLevel(xp);
            return lvl >= 100 ? 100 : lvl;
        }
        if (window.getItem(skill + 'Unlocked') === 1) {
            skills[skill].unlocked = true;
            return getActualLvl(skill, xp);
        }
        return 0;
    }

    function getStoredLvl(skill) {
        const xp = window.getItem(skill + 'Xp');
        if (skills[skill] && skills[skill].xp === xp) {
            return skills[skill].lvl;
        }
        const lvl = getActualLvl(skill, xp);
        skills[skill] = { xp, lvl };
        return lvl
    }

    window.getGlobalLevel = function() {
        let globalLevel = 0;
        for (let skill in skills) {
            globalLevel += getStoredLvl(skill);
        }

        return globalLevel;
    };
})();