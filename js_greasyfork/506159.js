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
// @downloadURL https://update.greasyfork.org/scripts/506159/Blubbled%27s%20Resurviv%20UI%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/506159/Blubbled%27s%20Resurviv%20UI%20Mod.meta.js
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
                if (ammoCountElement && window.getComputedStyle(ammoCountElement).opacity >= 0) {
                    var ammoCount = ammoCountElement.textContent;
                    ammoCountCopy.textContent = ammoCount;
                    ammoCountCopy.style.color = ammoCountElement.style.color;
                    ammoCountCopy.style.display = 'block';
                } else {
                    ammoCountCopy.style.display = 'none';
                }
            }

            function followCursor(event) {
                healthBarWidthCopy.style.left = `${event.clientX - 70}px`;
                healthBarWidthCopy.style.top = `${event.clientY+25}px`;

                ammoCountCopy.style.left = `${event.clientX+40}px`;
                ammoCountCopy.style.top = `${event.clientY+25}px`; // Offset ammo display slightly below health
            }

            document.addEventListener('mousemove', followCursor);

            healthBarWidthCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            healthBarWidthCopy.style.webkitUserSelect = 'none'; /* Safari */
            healthBarWidthCopy.style.userSelect = 'none'; /* Standard syntax */

            ammoCountCopy.style.webkitTouchCallout = 'none'; /* iOS Safari */
            ammoCountCopy.style.webkitUserSelect = 'none'; /* Safari */
            ammoCountCopy.style.userSelect = 'none'; /* Standard syntax */

            document.body.appendChild(healthBarWidthCopy);
            document.body.appendChild(ammoCountCopy);

            updateHealthBarWidthCopy();
            updateAmmoCountCopy();

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
        } else {
            var healthBarWidthCopy = document.getElementById('health-bar-width-copy');
            if (healthBarWidthCopy) {
                healthBarWidthCopy.parentNode.removeChild(healthBarWidthCopy);
            }

            var ammoCountCopy = document.getElementById('ammo-count-copy');
            if (ammoCountCopy) {
                ammoCountCopy.parentNode.removeChild(ammoCountCopy);
            }
        }
    }

    toggleUIElementDisplay(true);
    showKillCounter();
    periodicallyShowKillCounter();
})();
