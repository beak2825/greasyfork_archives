// ==UserScript==
// @name         Conquest Tally
// @version      0.0.1
// @description  A grepolis extension to tally up supports and incoming attacks on conquests
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @namespace https://greasyfork.org/users/1483397
// @downloadURL https://update.greasyfork.org/scripts/539325/Conquest%20Tally.user.js
// @updateURL https://update.greasyfork.org/scripts/539325/Conquest%20Tally.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var uw;
    if (typeof unsafeWindow == 'undefined') {
        uw = window;
    } else {
        uw = unsafeWindow;
    }
    // function to inject total counts into the conquest element
    function injectCounts(conquestElement, supportsCount, seaAttacksCount, landAttacksCount) {
        const countsDiv = document.createElement('div');
        countsDiv.className = 'conquest-counts';
        countsDiv.style.cssText = `display: flex; justify-content: end; align-items: center; padding: 5px 0px; border-top: 1px solid #ca8;`;
        countsDiv.innerHTML = `
            <h4 style="margin-right: 10px;">Incoming Totals: </h4>
            <div class="bold" style="display: flex; align-items:center; margin-right: 25px; gap:5px"><img class="command_type" alt="Support" title="Support" src="https://gpus.innogamescdn.com/images/game/unit_overview/support.png" style="float: left;"> ${supportsCount}</div>
            <div class="bold" style="display: flex; align-items:center; margin-right: 25px; gap:5px"><img class="command_type" alt="Sea Attack" title="Sea Attack" src="https://gpus.innogamescdn.com/images/game/unit_overview/attack_sea.png" style="float: left;"> ${seaAttacksCount}</div>
            <div class="bold" style="display: flex; align-items:center; margin-right: 25px; gap:5px"><img class="command_type" alt="Land Attack" title="Land Attack" src="https://gpus.innogamescdn.com/images/game/unit_overview/attack_land.png" style="float: left;"> ${landAttacksCount}</div>
        `;
        conquestElement.appendChild(countsDiv);
    };

    const conquestObserver = new MutationObserver((mutations, observer) => {
        const filteredMutations = mutations.filter(mutation => mutation.type === 'childList' && mutation.addedNodes.length > 0);
        filteredMutations.forEach((mutation) => {
            const addedNodes = Array.from(mutation.addedNodes);
            if (addedNodes.some(node => node.nodeType === Node.ELEMENT_NODE && node.querySelector('.conquest.published'))) {
                const conquestElement = document.querySelector('.conquest.published');
                if (conquestElement) {
                    const supports = conquestElement.querySelectorAll('.support');
                    const seaAttacks = conquestElement.querySelectorAll('.attack_sea');
                    const landAttacks = conquestElement.querySelectorAll('.attack_land');

                    injectCounts(conquestElement, supports.length, seaAttacks.length, landAttacks.length);
                }
            }
        });
    });
    // main level observer to watch for conquest listings in messages or forums
    conquestObserver.observe(document, { childList: true, subtree: true });
})();