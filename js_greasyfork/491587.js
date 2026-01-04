// ==UserScript==
// @name         Execute Highlighter
// @namespace    heartflower.torn.com
// @version      1.1.1
// @description  Highlights the execute weapon once you're ready to execute
// @author       Heartflower [2626587]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491587/Execute%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/491587/Execute%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change this value if you use another execute %
    let executeValue = 27;

    // Find the execute bonus
    function findExecute() {
        let wrapper = document.body.querySelector('.playersModelWrap___dkqHO');
        if (!wrapper) {
            setTimeout(findExecute, 100);
            return;
        }

        let bonusExecutes = wrapper.querySelectorAll('i.bonus-attachment-execute');
        if (!bonusExecutes || bonusExecutes.length < 1) {
            console.log('No bonus executes found');
            return;
        }

        // For each execute weapon, find the executeValue
        bonusExecutes.forEach(execute => {
            // console.log('Execute value:' + executeValue);
            let attachmentNode = execute.parentNode;
            let propsNode = attachmentNode.parentNode;
            let topNode = propsNode.parentNode;
            let weaponNode = topNode.parentNode;

            let interval = setInterval(function() {
                highlightWeapon(interval, weaponNode, executeValue);
            }, 100);
        });
    }

    // Find how much life % your enemy has
    function findLife() {
        let defender = document.body.querySelector('.rose___QcHAq');
        if (!defender) {
            return;
        }

        let lifeElement = defender.querySelector('[id^="player-health-value"]');
        if (!lifeElement) {
            return;
        }

        let life = lifeElement.textContent;

        // console.log(lifeElement);

        // Split the string based on the delimiter "/"
        let parts = life.split(" / ");

        // Extract current life and maximum life
        let currentLife = parseFloat(parts[0].replace(/,/g, ""));
        let maximumLife = parseFloat(parts[1].replace(/,/g, ""));

        let percentage = (currentLife / maximumLife) * 100;

        return percentage;
    }

    // Highlight the weapon if ready to execute
    function highlightWeapon(interval, element, execute) {
        let life = findLife();

        if (execute >= life) {
            // console.log('Execute bigger than life');

            element.style.background = 'var(--default-bg-17-gradient)';
        } else {
            element.style.background = '';
        }
    }

    setInterval(findLife, 100);
    findExecute();
})();