// ==UserScript==
// @name         Execute HP
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Add Execute Under X HP to Secondary Weapon - Changes colour when ready
// @author       Stig [2648238]
// @match        https://www.torn.com/loader.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492356/Execute%20HP.user.js
// @updateURL https://update.greasyfork.org/scripts/492356/Execute%20HP.meta.js
// ==/UserScript==

const executePercent = 29; // Change this to your Execute %

(function() {
    'use strict';

    function getPercentage(value) {
        var raw = value * (executePercent / 100);
        return Math.ceil(raw);
    }

    function waitForElement(selector, callback) {
        let el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(function() {
                waitForElement(selector, callback);
            }, 500); // checks every 500ms
        }
    }

    function getHealth() {
        // Opponent header container (rose = opponent; teal is usually you)
        const header = document.querySelector('div.headerWrapper___p6yrL.rose___QcHAq');
        if (!header) return { current: 0, max: 0 };

        // Find the health icon inside this header, then its sibling span with "current / max"
        const span = header.querySelector('.iconHealth___Ojjg3.icon___wP1tC.hideText___CVBj_')?.closest('.entry___m0IK_')?.querySelector('span');
        if (!span) return { current: 0, max: 0 };
        console.log(span.textContent);
        const [current, max] = span.textContent.split('/').map(v => parseInt(v.replace(/,/g, '').trim(), 10));
        console.log(current, max);
        return (!isNaN(current) && !isNaN(max)) ? { current, max } : { current: 0, max: 0 };
    }

    function render() {
        var weaponSecond = document.getElementById('weapon_second');
        if (weaponSecond) {
            var targetDiv = weaponSecond.querySelector('.bottom___XSBgG');
            if (targetDiv) {
                var newDiv = document.createElement('div');
                newDiv.className = 'custom-execute-under';

                var { current, max } = getHealth();
                var underHP = getPercentage(max);
                newDiv.textContent = `Execute Under: ${underHP} HP`;

                // Add CSS
                var css = `
                    .custom-execute-under {
                        position: absolute;
                        top: 70px;
                        left: 24px;
                        font-size: 10px;
                        color: red; /* Default colour */
                        font-weight: normal; /* Default weight */
                    }
                `;
                var style = document.createElement('style');
                document.head.appendChild(style);
                style.appendChild(document.createTextNode(css));

                targetDiv.parentNode.insertBefore(newDiv, targetDiv.nextSibling);

                // Update colour dynamically based on health
                setInterval(function() {
                    var health = getHealth();
                    if (health.current <= underHP && health.current > 0) {
                        newDiv.textContent = 'Execute Now!';
                        newDiv.style.color = '#00FF00'; // Bright green
                        newDiv.style.fontWeight = 'bold';
                        newDiv.style.left = '45px';
                    } else {
                        newDiv.style.color = 'red';
                        newDiv.style.fontWeight = 'normal';
                    }
                }, 100); // Check every 500ms
            }
        }
    }

    waitForElement('.entry___m0IK_', function() {
        render();
    });
})();