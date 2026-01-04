// ==UserScript==
// @name         Blubbled's Resurviv UI Mod
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  QoL features for Resurviv/Namerio
// @author       Blubbled
// @match        http://resurviv.biz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506235/Blubbled%27s%20Resurviv%20UI%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/506235/Blubbled%27s%20Resurviv%20UI%20Mod.meta.js
// ==/UserScript==

(function() {
    function toggleUncappedFPS(enabled) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 1);
        };
    }

    function periodicallyShowKillCounter() {
        showKillCounter();
        setTimeout(periodicallyShowKillCounter, 100);
    }

    function showKillCounter() {
        var killCounter = document.getElementById('ui-kill-counter-wrapper');
        if (killCounter) {
            killCounter.style.display = 'block';

            var counterText = killCounter.querySelector('.counter-text');
            if (counterText) {
                counterText.style.minWidth = '30px';
            }
        }
    }

    function calculateAverageBoostWidth() {
        var counterLengths = [98.5, 98.5, 147.75, 49.25];
        var boostCounters = document.querySelectorAll('#ui-boost-counter .ui-bar-inner');
        var totalWidth = 0;

        boostCounters.forEach(function(counter, index) {
            var widthPercentage = parseFloat(counter.style.width);
            var unitLength = counterLengths[index];
            totalWidth += (widthPercentage / 100) * unitLength;
        });

        var totalUnitLength = counterLengths.reduce((a, b) => a + b, 0);
        var averageWidthPercentage = (totalWidth / totalUnitLength) * 100;

        return averageWidthPercentage.toFixed(2) + "%";
    }

    function toggleUIElementDisplay(enabled) {
        if (enabled) {

            var healthBarWidthCopy = document.createElement('span');
            healthBarWidthCopy.id = 'health-bar-width-copy';
            healthBarWidthCopy.classList.add('unselectable');
            healthBarWidthCopy.style.position = 'fixed';
            healthBarWidthCopy.style.fontSize = '25px';
            healthBarWidthCopy.style.fontWeight = 'bold';
            healthBarWidthCopy.style.display = 'none';

            var ammoCountCopy = document.createElement('span');
            ammoCountCopy.id = 'ammo-count-copy';
            ammoCountCopy.classList.add('unselectable');
            ammoCountCopy.style.position = 'fixed';
            ammoCountCopy.style.fontSize = '25px';
            ammoCountCopy.style.fontWeight = 'bold';
            ammoCountCopy.style.display = 'none';

            var weaponNameCopy = document.createElement('span');
            weaponNameCopy.id = 'weapon-name-copy';
            weaponNameCopy.classList.add('unselectable');
            weaponNameCopy.style.position = 'fixed';
            weaponNameCopy.style.fontSize = '20px';
            weaponNameCopy.style.fontWeight = 'bold';
            weaponNameCopy.style.display = 'none';

            var boostWidthCopy = document.createElement('span');
            boostWidthCopy.id = 'boost-width-copy';
            boostWidthCopy.classList.add('unselectable');
            boostWidthCopy.style.position = 'fixed';
            boostWidthCopy.style.fontSize = '20px';
            boostWidthCopy.style.fontWeight = 'bold';
            boostWidthCopy.style.color = 'orange';
            boostWidthCopy.style.display = 'none';

            function updateHealthBarWidthCopy() {
                var healthBar = document.getElementById('ui-health-actual');
                if (healthBar && healthBar.offsetWidth > 0 && healthBar.offsetHeight > 0) {
                    var healthBarWidth = Math.round(parseFloat(healthBar.style.width));
                    var healthBarColor = healthBar.style.backgroundColor;

                    healthBarWidthCopy.textContent = healthBarWidth + "%";
                    healthBarWidthCopy.style.color = healthBarColor;
                    healthBarWidthCopy.style.display = 'block';
                } else {
                    healthBarWidthCopy.style.display = 'none';
                }
            }

            function updateAmmoCountCopy() {
                var ammoCountElement = document.getElementById('ui-current-clip');
                if (ammoCountElement && window.getComputedStyle(ammoCountElement).display !== 'none' && parseFloat(window.getComputedStyle(ammoCountElement).opacity) > 0) {
                    var ammoCount = ammoCountElement.textContent;
                    ammoCountCopy.textContent = ammoCount;
                    ammoCountCopy.style.color = ammoCountElement.style.color;
                    ammoCountCopy.style.display = 'block';
                } else {
                    ammoCountCopy.style.display = 'none';
                }
            }

            function updateWeaponNameCopy() {
                var equippedWeapon = document.querySelector('.ui-weapon-switch[style*="background-color: rgba(0, 0, 0, 0.4)"], .ui-weapon-switch[style*="opacity: 1"]');
                if (equippedWeapon) {
                    var weaponName = equippedWeapon.querySelector('.ui-weapon-name').textContent;
                    weaponNameCopy.textContent = weaponName;
                    weaponNameCopy.style.color = 'white';
                    weaponNameCopy.style.display = 'block';
                } else {
                    weaponNameCopy.style.display = 'none';
                }
            }

            function updateBoostWidthCopy() {
                var boostElement = document.getElementById('ui-boost-counter');
                if (boostElement && window.getComputedStyle(boostElement).display !== 'none' && parseFloat(window.getComputedStyle(boostElement).opacity) > 0) {
                    var averageBoostWidth = calculateAverageBoostWidth();
                    boostWidthCopy.textContent = averageBoostWidth;
                    boostWidthCopy.style.display = 'block';
                } else {
                    boostWidthCopy.style.display = 'none';
                }
            }

            function followCursor(event) {
                healthBarWidthCopy.style.left = `${event.clientX - 70}px`;
                healthBarWidthCopy.style.top = `${event.clientY + 25}px`;

                ammoCountCopy.style.left = `${event.clientX + 40}px`;
                ammoCountCopy.style.top = `${event.clientY + 25}px`;

                weaponNameCopy.style.left = `${event.clientX + 40}px`;
                weaponNameCopy.style.top = `${event.clientY + 50}px`;

                boostWidthCopy.style.left = `${event.clientX - 70}px`;
                boostWidthCopy.style.top = `${event.clientY + 50}px`;
            }

            document.addEventListener('mousemove', followCursor);

            healthBarWidthCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            healthBarWidthCopy.style.webkitUserSelect = 'none'; /* Safari */
            healthBarWidthCopy.style.userSelect = 'none'; /* Standard syntax */

            ammoCountCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            ammoCountCopy.style.webkitUserSelect = 'none'; /* Safari */
            ammoCountCopy.style.userSelect = 'none'; /* Standard syntax */

            weaponNameCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            weaponNameCopy.style.webkitUserSelect = 'none'; /* Safari */
            weaponNameCopy.style.userSelect = 'none'; /* Standard syntax */

            boostWidthCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            boostWidthCopy.style.webkitUserSelect = 'none'; /* Safari */
            boostWidthCopy.style.userSelect = 'none'; /* Standard syntax */

            document.body.appendChild(healthBarWidthCopy);
            document.body.appendChild(ammoCountCopy);
            document.body.appendChild(weaponNameCopy);
            document.body.appendChild(boostWidthCopy);

            updateHealthBarWidthCopy();
            updateAmmoCountCopy();
            updateWeaponNameCopy();
            updateBoostWidthCopy();

            var healthObserver = new MutationObserver(updateHealthBarWidthCopy);
            var healthTargetNode = document.getElementById('ui-health-actual');
            if (healthTargetNode) {
                healthObserver.observe(healthTargetNode, { attributes: true, attributeFilter: ['style', 'class'] });
            }
            if (healthTargetNode && healthTargetNode.parentElement) {
                healthObserver.observe(healthTargetNode.parentElement, { attributes: true, attributeFilter: ['style', 'class'] });
            }

            var ammoObserver = new MutationObserver(updateAmmoCountCopy);
            var ammoTargetNode = document.getElementById('ui-current-clip');
            if (ammoTargetNode) {
                ammoObserver.observe(ammoTargetNode, { attributes: true, childList: true, subtree: true });
            }

            var weaponObserver = new MutationObserver(updateWeaponNameCopy);
            var weaponTargetNodes = document.querySelectorAll('.ui-weapon-switch');
            weaponTargetNodes.forEach(function(node) {
                weaponObserver.observe(node, { attributes: true, attributeFilter: ['style', 'class'] });
            });

            var boostObserver = new MutationObserver(updateBoostWidthCopy);
            var boostTargetNodes = document.querySelectorAll('#ui-boost-counter .ui-bar-inner');
            boostTargetNodes.forEach(function(node) {
                boostObserver.observe(node, { attributes: true, attributeFilter: ['style', 'class'] });
            });

        } else {
            var healthBarWidthCopy = document.getElementById('health-bar-width-copy');
            if (healthBarWidthCopy) {
                healthBarWidthCopy.parentNode.removeChild(healthBarWidthCopy);
            }

            var ammoCountCopy = document.getElementById('ammo-count-copy');
            if (ammoCountCopy) {
                ammoCountCopy.parentNode.removeChild(ammoCountCopy);
            }

            var weaponNameCopy = document.getElementById('weapon-name-copy');
            if (weaponNameCopy) {
                weaponNameCopy.parentNode.removeChild(weaponNameCopy);
            }

            var boostWidthCopy = document.getElementById('boost-width-copy');
            if (boostWidthCopy) {
                boostWidthCopy.parentNode.removeChild(boostWidthCopy);
            }
        }
    }

    toggleUIElementDisplay(true);
    showKillCounter();
    periodicallyShowKillCounter();
})();
