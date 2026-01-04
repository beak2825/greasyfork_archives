// ==UserScript==
// @name         Hamster Combat Web Hack
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Hack for telegram game Hamster Kombat
// @author       Waximus
// @match        https://hamsterkombatgame.io/clicker/
// @icon         https://www.google.com/s2/favicons?sz=16&domain=hamsterkombatgame.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501928/Hamster%20Combat%20Web%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/501928/Hamster%20Combat%20Web%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.hostname === 'hamsterkombatgame.io') {
        console.log("Hamster combat injection");

        const original_indexOf = Array.prototype.indexOf;
        Array.prototype.indexOf = function(...args) {
            if (JSON.stringify(this) === JSON.stringify(["android", "android_x", "ios"])) {
                setTimeout(() => {
                    Array.prototype.indexOf = original_indexOf;
                }, 0);
                return 0;
            }
            return original_indexOf.apply(this, args);
        };

        var isZeroEnergy = false;
        var init = false;
        var energy, button;

        var checkboxDiv = document.createElement('div');
        checkboxDiv.classList = ['app-bar-item no-select'];
        var checkbox = document.createElement('input');
        checkboxDiv.appendChild(checkbox);
        (function() {
            var checkboxP = document.createElement('p');
            checkboxDiv.appendChild(checkboxP);
            checkbox.type = 'checkbox';
            checkbox.classList = ['app-bar-item-image'];
            checkboxP.innerHTML = 'Autoclicker';
        })()

        const tick = () => {
            if (energy) {
                if (init) {
                    if (checkbox.checked) {
                        var energyStr = energy.innerHTML;
                        var currEnergy = energyStr.split(' / ')[0];
                        var maxEnergy = energyStr.split(' / ')[1];
                        if (currEnergy <= 10) {
                            isZeroEnergy = true;
                        }
                        if (currEnergy >= maxEnergy - 10) {
                            isZeroEnergy = false;
                        }
                        if (!isZeroEnergy) {
                            button.dispatchEvent(new PointerEvent('pointerup'));
                        }
                    } else {
                        isZeroEnergy = false;
                    }
                } else {
                    document.querySelector('.app-bar-nav').appendChild(checkboxDiv);
                    init = true;
                }
            } else {
                energy = document.querySelector('.user-tap-energy p');
                button = document.querySelector('.user-tap-button');
            }

            setTimeout(tick, 1);
        };

        tick();
    }
})();