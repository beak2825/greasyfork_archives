// ==UserScript==
// @name        Another Auto Clicker for More Ore
// @namespace   Violentmonkey Scripts
// @match       https://syns.studio/more-ore/
// @grant       none
// @version     1.6.1
// @author      BlueberryPir8
// @icon        https://syns.studio/more-ore/misc-tinyRock.22ef93dd.ico
// @license     MIT
// @compatible  firefox >=52
// @compatible  chrome >=57
// @compatible  edge >=14
// @description Another Auto Clicker for More Ore (working as of v1.5.9 Beta). Clicks weak spots (with a randomized delay), manual attacks for quests, gold nuggets, hulk smashes, and tenant intimidation.
// @downloadURL https://update.greasyfork.org/scripts/446370/Another%20Auto%20Clicker%20for%20More%20Ore.user.js
// @updateURL https://update.greasyfork.org/scripts/446370/Another%20Auto%20Clicker%20for%20More%20Ore.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

Element.prototype._addEventListener = Element.prototype.addEventListener;
Element.prototype.addEventListener = function (...args) {
    const weakSpot = this.classList?.contains('weak-spot') ? 'Weak Spot' : null;
    const manualAttack = this.classList?.contains('manual-attack') ? 'Manual Attack' : null;
    const questComplete =
        this.classList?.contains('quest-banner-container') &&
        (this.querySelector('.quest-success') || this.querySelector('.quest-failed'))
            ? 'Quest Complete'
            : null;
    if (!(weakSpot || manualAttack || questComplete)) {
        this._addEventListener(...args);
        return;
    }
    let cb = args[1];
    args[1] = function cbOverride(...args2) {
        args2[0] = Object.assign({}, args2[0]);
        args2[0].isTrusted = true;
        return cb(...args2);
    };
    return this._addEventListener(...args);
};

const SHORT_TIMEOUT = 100;
const LONG_TIMEOUT = 100;

let prev;
let shortTimer = 0;
let longTimer = 0;
let priorityClick = false;

function frame(ts) {
    if (!prev) {
        prev = ts;
    }
    const delta = ts - prev;
    shortTimer += delta;
    longTimer += delta;

    if (shortTimer > SHORT_TIMEOUT) {
        if (!priorityClick) {
            if (document.querySelector('.weak-spot')) {
                document.querySelector('.weak-spot').click();
            }
        }

        shortTimer = shortTimer % SHORT_TIMEOUT;
    }

    if (longTimer > LONG_TIMEOUT) {
        if (!priorityClick) {
            if (document.querySelector('.manual-attack')) {
                if (
                    !document.querySelector('.quest-banner-container > .quest-success') &&
                    !document.querySelector('.quest-banner-container > .quest-failed')
                ) {
                    priorityClick = true;
                    setTimeout(() => {
                        document.querySelector('.manual-attack')?.click();
                        priorityClick = false;
                    }, LONG_TIMEOUT);
                } else {
                    priorityClick = true;
                    setTimeout(() => {
                        document.querySelector('.quest-banner-container')?.click();
                        priorityClick = false;
                    }, LONG_TIMEOUT);
                }
            }
            if (document.querySelector('.gold-nugget-container')) {
                priorityClick = true;
                setTimeout(() => {
                    document.querySelector('.gold-nugget-container')?.click();
                    priorityClick = false;
                }, LONG_TIMEOUT);
            }
            if (document.querySelector('.active-skill-hulkSmash')) {
                const elem = document.querySelector('.active-skill-hulkSmash');
                if (!elem?.classList?.contains('on-cooldown')) {
                    priorityClick = true;
                    setTimeout(() => {
                        elem.click();
                        priorityClick = false;
                    }, LONG_TIMEOUT);
                }
            }
          if (document.querySelector('.active-skill-tenantIntimidation')) {
                const elem = document.querySelector('.active-skill-tenantIntimidation');
                if (!(elem?.classList?.contains('on-cooldown') || elem?.classList?.contains('active'))) {
                    priorityClick = true;
                    setTimeout(() => {
                        elem.click();
                        priorityClick = false;
                    }, LONG_TIMEOUT);
                }
            }
        }

        longTimer = longTimer % LONG_TIMEOUT;
    }

    prev = ts;

    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);
